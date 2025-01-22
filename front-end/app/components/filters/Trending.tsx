import { Product, User } from '~/types/interfaces'

import { ProductCarrousel } from './ProductCarrousel'

interface TrendingMoviesProps {
	products: Product[]
	userLogged: User
}

export function TrendingMovies({ products, userLogged }: TrendingMoviesProps) {
	return (
		<ProductCarrousel
			title="Currently Trending Movies"
			products={products}
			userLogged={userLogged}
		/>
	)
}

export function TrendingGames({ products, userLogged }: TrendingMoviesProps) {
	return (
		<ProductCarrousel
			title="Currently Trending Games"
			products={products}
			userLogged={userLogged}
		/>
	)
}

export function TrendingBooks({ products, userLogged }: TrendingMoviesProps) {
	return (
		<ProductCarrousel
			title="Currently Trending Books"
			products={products}
			userLogged={userLogged}
		/>
	)
}
