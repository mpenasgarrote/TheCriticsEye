import { ActionFunctionArgs } from '@remix-run/node'
import { getAuthToken } from '~/data/auth.server'
import { getFromAPI } from '~/data/filters.server'
import { getGenresFromProduct } from '~/data/products.server'
import { Product } from '~/types/interfaces'

export async function action({ request, params }: ActionFunctionArgs) {
	console.log('hola')
	const authToken = (await getAuthToken(request)) as string

	const query = params.query as string

	const genresString = params.genres as string
	const genres =
		genresString != 'null' ? genresString.split(',').map(Number) : []

	try {
		const recievedProducts = await getFromAPI(query, authToken)

		if (Array.isArray(recievedProducts)) {
			if (!genres || genres.length === 0) {
				const filteredProducts = recievedProducts
				return { products: filteredProducts }
			}

			const filteredProducts = await filterProductsByGenre(
				recievedProducts,
				genres,
				authToken
			)

			if (filteredProducts) {
				return { products: filteredProducts }
			}
		}
	} catch (error) {
		return {
			Error: {
				message: 'Failed to get products.',
			},
			status: 500,
		}
	}
}

const filterProductsByGenre = async (
	products: Product[],
	genres: number[],
	authToken: string
): Promise<Product[]> => {
	// Use Promise.all to wait for all genre fetches
	const filteredProducts = await Promise.all(
		products.map(async (product) => {
			const productGenres = await getGenresFromProduct(product.id, authToken)

			// Return product if it matches any of the genres
			if (
				productGenres &&
				productGenres.some((genre) => genres.includes(genre.id))
			) {
				return product
			}
			return undefined // Explicitly return undefined if no match
		})
	)

	// // Filter out undefined values
	return filteredProducts.filter(
		(product): product is Product => product !== undefined
	)

	// return await products.reduce<Promise<Product[]>>(
	// 	async (accPromise, product: Product) => {
	// 		const acc = await accPromise
	// 		const productGenres = await getGenresFromProduct(product.id, authToken)

	// 		if (
	// 			productGenres &&
	// 			productGenres.some((genre) => genres.includes(genre.id))
	// 		) {
	// 			acc.push(product)
	// 		}

	// 		return acc
	// 	},
	// 	Promise.resolve([] as Product[])
	// )
}
