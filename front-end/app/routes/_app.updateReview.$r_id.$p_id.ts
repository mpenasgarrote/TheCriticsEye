import { ActionFunctionArgs } from '@remix-run/node'
import { getAuthToken } from '~/data/auth.server'
import { getReviewsFromProduct, updateReviewById } from '~/data/reviews.server'
import { Review } from '~/types/interfaces'

export async function action({ request, params }: ActionFunctionArgs) {
	const authToken = (await getAuthToken(request)) as string
	const formData = await request.formData()

	const review_id = params.r_id as string
	const product_id = params.p_id as string

	if (!product_id) {
		throw new Error('Product ID is required')
	}

	const title: string = (await formData.get('title')) as string
	const content: string = (await formData.get('content')) as string
	const score: string = (await formData.get('score')) as string

	if (!title || !content || !score) {
		return {
			ReviewError: { message: 'Please, do not leave any empty fields. ' },
		}
	}

	try {
		const review = {
			id: Number(review_id),
			title: title,
			content: content,
			score: Number(score),
		}
		const updateReview = await updateReviewById(review, authToken)

		if (updateReview) {
			const updatedReviews: Review[] = await getReviewsFromProduct(
				product_id,
				authToken
			)
			return { reviews: updatedReviews }
		}
	} catch (error) {
		return {
			error: error,
			status: 500,
		}
	}
}
