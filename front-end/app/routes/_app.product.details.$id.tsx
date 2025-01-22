import { LoaderFunctionArgs } from '@remix-run/node'
import { getProductById } from '~/data/products.server'
import { getAuthToken, getLoggedUser } from '~/data/auth.server'
import { Product, Review } from '~/types/interfaces'
import { genreColors, getScoreColor } from '~/utils/utils'
import { useLoaderData } from '@remix-run/react'
import { getReviewsFromProduct } from '~/data/reviews.server'
import { ReviewsDisplay } from '~/components/reviews/ReviewsDisplay'

export async function loader({ params, request }: LoaderFunctionArgs): Promise<{
	product: Product
	reviews: Review[]
	userLogged: number | null
} | null> {
	const authToken = (await getAuthToken(request)) as string

	const loggedUser = await getLoggedUser(request, authToken)
	const userLogged = loggedUser ? loggedUser.id : null

	const productId = params.id as string

	if (!authToken) {
		throw new Response('Unauthorized', { status: 401 })
	}

	const product = (await getProductById(productId, authToken)) as Product

	const reviews = (await getReviewsFromProduct(
		productId,
		authToken
	)) as Review[]

	return { product, reviews, userLogged }
}

export default function ProductDetails() {
	const { product, reviews, userLogged } = useLoaderData<{
		product: Product
		reviews: Review[]
		userLogged: number
	}>()

	return (
		<>
			<div className="max-w-4xl mt-10 mx-auto p-6 rounded-lg dark:bg-primaryBlack-default drop-shadow-lg">
				<div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
					{product.image ? (
						<img
							src={product.image}
							alt={product.title}
							className="w-64 h-64 object-cover rounded-lg md:mr-6 mb-4 md:mb-0"
						/>
					) : (
						<div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 md:mr-6 mb-4 md:mb-0">
							No Image
						</div>
					)}

					<div className="flex-1">
						<div className="flex justify-between items-center mb-4">
							<h1 className="text-2xl font-bold text-primaryBlack-default dark:text-primaryYellow-default">
								{product.title}
							</h1>
							<p className="bg-gray-600 justify-self-center mt-2 rounded-md px-2 py-1 text-xs italic text-white">
								{product.type ? product.type.name : ''}
							</p>
						</div>
						<hr className="text-primaryYellow-default" />
						<p className="text-primaryWhite-default mt-2">
							{product.description}
						</p>

						<div className="flex justify-between items-center">
							<div>
								<span className="text-primaryYellow-default font-bold text-sm">
									Author:
								</span>{' '}
								<span className="font-medium text-primaryBlack-default dark:text-primaryWhite-default">
									{product.author}
								</span>
							</div>
							{product.score !== undefined && (
								<div
									className={`text-4xl mt-6 py-2 px-4 text-white font-bold rounded-lg w-20 h-20 flex items-center justify-center lg:flex lg:items-center lg:justify-center  ${getScoreColor(
										product.score
									)} lg:mr-0`}
								>
									<span>{product.score}</span>
								</div>
							)}
						</div>

						<div className="mb-4 flex justify-between items-center">
							<div>
								<span className="text-primaryYellow-default font-bold text-sm">
									Uploaded At:
								</span>{' '}
								<span className="font-medium text-primaryBlack-default dark:text-primaryWhite-default">
									{new Date(product.created_at).toLocaleDateString()}
								</span>
							</div>
						</div>

						{product.type && (
							<div className="flex gap-4 items-center">
								{product.genres?.map((genre) => (
									<p
										key={genre.id}
										className={`${
											genreColors[genre.name] || 'bg-primaryBlack-light'
										} justify-self-center mt-2 rounded-md px-2 py-1 text-xs font-bold text-white`}
									>
										{genre.name}
									</p>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			<ReviewsDisplay
				productId={product.id}
				reviews={reviews}
				userLogged={userLogged}
			/>
		</>
	)
}
