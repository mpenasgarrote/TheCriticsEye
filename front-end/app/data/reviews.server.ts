import axios from 'axios'
import { Review, Comment } from '~/types/interfaces'
import { getUserById } from './users.server'

const apiUrl = process.env.API_URL

export async function checkIfUserHasReviewOnProduct(
	user_id: string | number,
	product_id: string | number,
	authToken: string
) {
	try {
		const response = await axios.get(
			`${apiUrl}/api/hasReview?user_id=${user_id}&product_id=${product_id}`,
			{
				headers: {
					Authorization: `Bearer ${authToken}`,
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				withCredentials: true,
			}
		)

		if (response.status === 200) {
			return response.data.review as Review
		} else {
			return false
		}
	} catch (error) {
		return false
	}
}

export async function postReview(
	product_id: string | number,
	user_id: string | number,
	title: string,
	content: string,
	score: number | string,
	authToken: string
) {
	const response = await axios.post(
		`${apiUrl}/api/reviews`,
		{ user_id, title, content, score, product_id },
		{
			headers: {
				Authorization: `Bearer ${authToken}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			withCredentials: true,
		}
	)

	if (response.status === 200) {
		console.log('Review Added.', response.data)
	} else {
		console.error('An error has occured when adding a review.')
	}
}

export async function postComment(
	review_id: number,
	user_id: number,
	content: string,
	authToken: string
) {
	const response = await axios.post(
		`${apiUrl}/api/comments`,
		{ review_id, user_id, content },
		{
			headers: {
				Authorization: `Bearer ${authToken}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			withCredentials: true,
		}
	)

	if (response.status === 200) {
		console.log('Comment Added.', response.data)

		return response.data
	} else {
		console.error('An error has occured when adding a Comment.')

		return {
			Error: {
				message: 'An error has occurred when adding a Comment.',
			},
		}
	}
}

export async function deleteReviewById(review_id: number, authToken: string) {
	const response = await axios.delete(`${apiUrl}/api/reviews/${review_id}`, {
		headers: {
			Authorization: `Bearer ${authToken}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		withCredentials: true,
	})

	if (response.status === 200) {
		console.log('Review Deleted Succesfully.', response.data)
	} else {
		console.error('An error has occured when deleting a review.')
	}
}

export async function updateReviewById(
	review: { id: number; title: string; content: string; score: number },
	authToken: string
) {
	try {
		const { id: review_id, ...reviewData } = review
		const response = await axios.patch(
			`${apiUrl}/api/reviews/${review_id}`,
			reviewData,
			{
				headers: {
					Authorization: `Bearer ${authToken}`,
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				withCredentials: true,
			}
		)

		if (response.status !== 200) {
			throw new Error(
				`Failed to update review ${review_id}. Status: ${response.status}`
			)
		}

		console.log('Review updated successfully:', response.data)

		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(
				'Axios error while updating review:',
				error.response?.data || error.message
			)
		} else {
			console.error('Unexpected error while updating review:', error)
		}

		throw error
	}
}

export async function getReviewsFromProduct(
	product_id: string,
	authToken: string
): Promise<Review[]> {
	try {
		const response = await axios.get(
			`${apiUrl}/api/reviews?product_id=${product_id}`,
			{
				headers: {
					Authorization: `Bearer ${authToken}`,
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				withCredentials: true,
			}
		)

		const reviews: Review[] = (await response.data.reviews) as Review[]

		await Promise.all(
			reviews.map(async (review) => {
				review.user = await getUserById(review.user_id, authToken)

				const comments: Comment[] | { message: string } =
					await getCommentsFromReview(review.id, authToken)

				review.comments = Array.isArray(comments) ? comments : undefined
			})
		)

		return reviews
	} catch (error) {
		console.error(error)

		throw error
	}
}

export async function getCommentsFromReview(
	id: number,
	authToken: string
): Promise<Comment[] | { message: string }> {
	try {
		const response = await axios.get(`${apiUrl}/api/comments?review_id=${id}`, {
			headers: {
				Authorization: `Bearer ${authToken}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			withCredentials: true,
		})

		if (response.status === 200) {
			const comments: Comment[] = response.data.comments as Comment[]

			return comments
		}

		return {
			message: 'An error has ocurred when fetching comments: ',
		}
	} catch (error) {
		return {
			message: 'An error has ocurred when fetching comments: ',
		}
	}
}

export async function deleteCommentById(id: number, authToken: string) {
	console.log('hola')
	const response = await axios.delete(`${apiUrl}/api/comments/${id}`, {
		headers: {
			Authorization: `Bearer ${authToken}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		withCredentials: true,
	})

	console.log('Response: ', response.data)

	if (response.status === 200) {
		console.log('Comment Deleted Succesfully.', response.data)
	} else {
		console.error('An error has occured when deleting a comment.')
	}
}
