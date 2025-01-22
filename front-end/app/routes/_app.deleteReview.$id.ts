import { ActionFunctionArgs } from '@remix-run/node'
import { getAuthToken } from '~/data/auth.server'
import { deleteReviewById, getReviewsFromProduct } from '~/data/reviews.server'
import { Review } from '~/types/interfaces'

export async function action({ request, params }: ActionFunctionArgs) {
	const authToken = (await getAuthToken(request)) as string
	const formData = await request.formData()

	const reviewId = formData.get('reviewId') as string
	const productId = params.id as string

	try {
		await deleteReviewById(Number(reviewId), authToken)
		const updatedReviews: Review[] = await getReviewsFromProduct(
			productId,
			authToken
		)

		console.log('updatedReviews', updatedReviews)

		return { reviews: updatedReviews }
	} catch (error) {
		return { error: 'An error ocurred when deleting a review' }
	}
}
