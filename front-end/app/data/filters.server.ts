import axios from 'axios'
import { Product, ShowErrors, Type } from '~/types/interfaces'
import { getGenresFromProduct, getTypes } from './products.server'

const apiUrl = process.env.API_URL

export async function querySearch(
	queryParam: string,
	authToken: string
): Promise<Product[] | ShowErrors> {
	const query = `title_contains=${encodeURIComponent(queryParam)}`

	return await getFromAPI(query, authToken)
}

export async function getProductsFromType(type_id:number,
	authToken: string
) {
	
	const query = 'type_id=' + type_id

	return await getFromAPI(query, authToken)
}


export async function getTrending(
	type_id: number,
	authToken: string
): Promise<Product[] | ShowErrors> {
	const query = `type_id=${type_id}&limit=10&sort=score:desc`

	return await getFromAPI(query, authToken)
}

export async function getFromAPI(
	query: string,
	authToken: string
): Promise<Product[] | ShowErrors> {
	try {
		const response = await axios.get(`${apiUrl}/api/products?${query}`, {
			headers: {
				Authorization: `Bearer ${authToken}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			withCredentials: true,
		})

		const data = (await response.data.products) as Product[]

		const allTypes: Type[] = await getTypes(authToken)

		const movies: Product[] = await Promise.all(
			data.map(async (movie) => {
				const type = allTypes.find((type: Type) => type.id === movie.type_id)
				movie.type = type
				movie.genres = await getGenresFromProduct(movie.id, authToken)

				return movie
			})
		)

		return movies as Product[]
	} catch (error: unknown) {
		console.log('Error fetching trending movies:', error)
		if (axios.isAxiosError(error)) {
			const validationErr: ShowErrors = {
				title: error.message,
				code: error.code,
			}
			return validationErr
		} else {
			throw error
		}
	}
}
