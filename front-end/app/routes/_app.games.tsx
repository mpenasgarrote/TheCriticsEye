import { LoaderFunction, redirect } from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import FiltersPage from '~/components/filters/FiltersPage'
import { getAuthToken, getLoggedUser } from '~/data/auth.server'
import { getProductsFromType } from '~/data/filters.server'
import { getGenres } from '~/data/products.server'
import { Product, User, Genre } from '~/types/interfaces'

export const loader: LoaderFunction = async ({ request }) => {
	const authToken = await getAuthToken(request)

	if (!authToken) {
		return redirect('/login')
	}

	const user = await getLoggedUser(request, authToken)

	const games = await getProductsFromType(3, authToken)

	const genres = await getGenres(authToken)

	return { games, user, genres }
}

export default function Games() {
	const fetcher = useFetcher<{ products: Product[] }>()

	const { games, user, genres } = useLoaderData<{
		games: Product[]
		user: User
		genres: Genre[]
	}>()

	let products = fetcher.data?.products

	if (!products) products = games

	return (
		<div className="container mx-auto p-2">
			<FiltersPage
				fetcher={fetcher}
				user={user}
				genres={genres}
				products={products}
				type={3}
				title={'Games'}
			/>
		</div>
	)
}
