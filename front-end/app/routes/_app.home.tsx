import { LoaderFunction, redirect } from '@remix-run/node'
import { getAuthToken, getLoggedUser } from '~/data/auth.server'
import {
	TrendingBooks,
	TrendingGames,
	TrendingMovies,
} from '../components/filters/Trending'
import { useLoaderData } from '@remix-run/react'
import { Product, User } from '~/types/interfaces'
import { getTrending } from '~/data/filters.server'

export const loader: LoaderFunction = async ({ request }) => {
	const authToken = await getAuthToken(request)

	if (!authToken) {
		return redirect('/login')
	}

	const user = await getLoggedUser(request, authToken)

	const trendingMovies = await getTrending(2, authToken)

	const trendingGames = await getTrending(3, authToken)

	const trendingBooks = await getTrending(1, authToken)

	return { trendingMovies, trendingGames, trendingBooks, user }
}

export default function Home() {
	const { trendingMovies, trendingGames, trendingBooks, user } = useLoaderData<{
		trendingMovies: Product[]
		trendingGames: Product[]
		trendingBooks: Product[]
		user: User
	}>()

	return (
		<div className="container mx-auto p-2">
			<TrendingMovies products={trendingMovies} userLogged={user} />
			<div className="mt-14 mb-14"></div>
			<TrendingGames products={trendingGames} userLogged={user} />
			<div className="mt-14 mb-14"></div>
			<TrendingBooks products={trendingBooks} userLogged={user} />
		</div>
	)
}
