import { ActionFunctionArgs } from '@remix-run/node'
import { getAuthToken, getLoggedUserId } from '~/data/auth.server'
import { getCommentsFromReview, postComment } from '~/data/reviews.server'

export async function action({ request, params }: ActionFunctionArgs) {
	const authToken = await getAuthToken(request)
	const formData = await request.formData()

	const userId = (await getLoggedUserId(request)) as string
	const content = formData.get('content')
	const reviewId = params.review as string

	if (typeof content !== 'string') {
		return {
			Error: {
				message: 'Something went wrong.',
			},
			status: 400,
		}
	}

	if (content.length < 4) {
		return {
			Error: {
				message: 'Your comment has to be at least 4 characters long.',
			},
		}
	}
	if (authToken) {
		try {
			await postComment(Number(reviewId), Number(userId), content, authToken)

			const updatedResults = await getCommentsFromReview(
				Number(reviewId),
				authToken
			)

			return { comments: updatedResults }
		} catch (error) {
			return {
				Error: {
					message: 'Failed to post comment.',
				},
				status: 500,
			}
		}
	}

	return null
}
