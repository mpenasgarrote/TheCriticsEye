import { ActionFunctionArgs } from '@remix-run/node'
import { getAuthToken } from '~/data/auth.server'
import { deleteCommentById, getCommentsFromReview } from '~/data/reviews.server'

export async function action({ request }: ActionFunctionArgs) {
	const authToken = (await getAuthToken(request)) as string
	const formData = await request.formData()

	const commentId = formData.get('commentId') as string
	const reviewId = formData.get('reviewId') as string

	console.log(commentId + ' | ' + reviewId)
	try {
		await deleteCommentById(Number(commentId), authToken)

		const updatedResults = await getCommentsFromReview(
			Number(reviewId),
			authToken
		)

		return { comments: updatedResults }
	} catch (error) {
		return { message: 'Comment could not be deleted.' }
	}
}
