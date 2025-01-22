import axios from 'axios'
import { Genre, Product, Type } from '~/types/interfaces'

const apiUrl = process.env.API_URL

export async function getTypes(authToken: string): Promise<Type[]> {
	try {
		const response = await axios.get(`${apiUrl}/api/product-types`, {
			headers: {
				Authorization: `Bearer ${authToken}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			withCredentials: true,
		})

		return response.data.Types as Type[]
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			console.error('Error fetching types:', error.message)
			throw new Error('Error fetching types')
		} else {
			throw error
		}
	}
}

export async function getGenres(authToken: string): Promise<Genre[]> {
	try {
		const response = await axios.get(`${apiUrl}/api/genres`, {
			headers: {
				Authorization: `Bearer ${authToken}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			withCredentials: true,
		})

		return response.data.genres as Genre[]
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			console.error('Error fetching genres:', error.message)
			throw new Error('Error fetching genres')
		} else {
			throw error
		}
	}
}

interface ProductGenre {
	product_id: number
	genre_id: number
}

export async function getGenresFromProduct(
	productId: number,
	authToken: string
): Promise<Genre[]> {
	try {
		const response = await axios.get(
			`${apiUrl}/api/product-genres?product_id=${productId}`,
			{
				headers: {
					Authorization: `Bearer ${authToken}`,
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				withCredentials: true,
			}
		)

		const data: ProductGenre[] = response.data[
			'Product-Genre'
		] as ProductGenre[]

		const genres: Genre[] = await getGenres(authToken)

		const productGenres = data.map(({ genre_id }) => {
			const genre = genres.find((genre: Genre) => genre.id === genre_id)
			return genre
		})

		return productGenres as Genre[]
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			console.error('Error fetching genres:', error.message)
			throw new Error('Error fetching genres')
		} else {
			throw error
		}
	}
}

export async function getProductById(
	id: string,
	authToken: string
): Promise<Product | null> {
	try {
		const response = await axios.get(`${apiUrl}/api/products/${id}`, {
			headers: {
				Authorization: `Bearer ${authToken}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			withCredentials: true,
		})

		const product = response.data.message as Product
		const allTypes: Type[] = await getTypes(authToken)
		const type = allTypes.find((type: Type) => type.id === product.type_id)
		product.type = type
		product.genres = await getGenresFromProduct(product.id, authToken)

		return product
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Error fetching product:', error.message)
			throw new Error('Error fetching product')
		} else {
			throw error
		}
	}
}
export async function postProduct(
	product: {
		title: string
		description: string
		author: string | null
		type_id: number
		genres: number[]
		user_id: number
		image: File | null
	},
	authToken: string
) {
	const { title, description, author, type_id, genres, user_id } = product

	try {
		const response = await axios.post(
			`${apiUrl}/api/products`,
			{ title, description, author, type_id, user_id },
			{
				headers: {
					Authorization: `Bearer ${authToken}`,
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				withCredentials: true,
			}
		)

		const createdProduct = response.data.product

		console.log('Response: ', response.data)

		if (!createdProduct || !createdProduct.id) {
			throw new Error('Product couldnt be uploaded.')
		}

		if (genres.length > 0) {
			genres.map(async (genre) => {
				const product_id = createdProduct.id
				const genre_id = genre

				await axios.post(
					`${apiUrl}/api/product-genres`,
					{ product_id, genre_id },
					{
						headers: {
							Authorization: `Bearer ${authToken}`,
							'Content-Type': 'application/json',
							Accept: 'application/json',
						},
						withCredentials: true,
					}
				)
			})
		}

		if (product.image) {
			uploadProductImage(createdProduct.id, product.image, authToken)
		}
		return createdProduct
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Error de Axios:', error.response?.data || error.message)
		} else {
			console.error('Error inesperado:', error)
		}

		throw error
	}
}

export async function deleteProductById(product_id: number, authToken: string) {
	const response = await axios.delete(`${apiUrl}/api/products/${product_id}`, {
		headers: {
			Authorization: `Bearer ${authToken}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		withCredentials: true,
	})

	console.log('Response: ', response.data)

	if (response.status === 200) {
		console.log('Product Deleted Succesfully.', response.data)
	} else {
		console.error('An error has occured when deleting a product.')
	}
}

export async function updateProductById(
	product: {
		id: number
		title: string
		description: string
		author: string
		type_id: number
		genres: number[]
		image: File | null
	},
	authToken: string
) {
	try {
		const { id, title, description, author, type_id, genres, image } = product

		const response = await axios.patch(
			`${apiUrl}/api/products/${id}`,
			{ title, description, author, type_id },
			{
				headers: {
					Authorization: `Bearer ${authToken}`,
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				withCredentials: true,
			}
		)

		if (response.status !== 200) {
			throw new Error(
				`Failed to update product ${id}. Status: ${response.status}`
			)
		}

		if (genres.length > 0) {
			genres.map(async (genre) => {
				const product_id = product.id
				const genre_id = genre

				await axios.post(
					`${apiUrl}/api/product-genres`,
					{ product_id, genre_id },
					{
						headers: {
							Authorization: `Bearer ${authToken}`,
							'Content-Type': 'application/json',
							Accept: 'application/json',
						},
						withCredentials: true,
					}
				)
			})
		}

		console.log('Product updated successfully:', response.data)

		if (genres.length > 0) {
			updateProductGenres(id, genres, authToken)
		}

		if (image) {
			checkImage(id, image, authToken)
		}

		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(
				'Axios error while updating review:',
				error.response?.data || error.message
			)
		} else {
			console.error('Unexpected error while updating review:', error)
		}

		throw error
	}
}

async function checkImage(
	product_id: number,
	image: File | string,
	authToken: string
) {
	const product = await getProductById(String(product_id), authToken)

	if (product?.image === image) {
		return null
	}

	if (image instanceof File) {
		uploadProductImage(product_id, image, authToken)
	} else {
		console.error('Invalid image type. Expected a File.')
	}
}

const updateProductGenres = async (
	product_id: number,
	genres: number[],
	authToken: string
) => {
	try {
		await axios.delete(
			`${apiUrl}/api/product-genres?product_id=${product_id}`,
			{
				headers: {
					Authorization: `Bearer ${authToken}`,
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				withCredentials: true,
			}
		)
		console.log('Existing genres removed.')

		const response = await axios.post(
			`${apiUrl}/api/product-genres`,
			{ product_id, genres },
			{
				headers: {
					Authorization: `Bearer ${authToken}`,
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				withCredentials: true,
			}
		)

		console.log('Genres updated:', response.data)
	} catch (error) {
		console.error('Error updating genres:', error)
	}
}

async function uploadProductImage(
	productId: number,
	image: File,
	authToken: string
) {
	try {
		const formData = new FormData()
		formData.append('product_id', productId.toString())
		formData.append('image', image)

		const uploadImage = await axios.post(
			`${apiUrl}/api/uploadProductImage`,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${authToken}`,
				},
				withCredentials: true,
			}
		)

		console.log('Image Uploaded Successfully: ' + uploadImage.data.url)
		return uploadImage.data.url
	} catch (error) {
		console.error('Error when uploading image:', error)
	}
}
