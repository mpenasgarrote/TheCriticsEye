import { Review } from '~/types/interfaces'
import { getScoreColor } from '~/utils/utils'
import DeleteReview from './DeleteReview'
import { useFetcher } from '@remix-run/react'
import { useState } from 'react'
import CommentsModal from './CommentsModal'

interface ReviewCardProps {
	review: Review
	userLogged: number
	fetcher: ReturnType<typeof useFetcher>
}

export default function ReviewCard({
	review,
	userLogged,
	fetcher,
}: ReviewCardProps) {
	const isUserReviewOwner = review.user_id === userLogged

	const [isEditing, setIsEditing] = useState(false)
	const [editedReview, setEditedReview] = useState(review)
	const [isCommentSectionOpen, setCommentSectionOpen] = useState(false)

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setEditedReview({
			...editedReview,
			[name]: value,
		})
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		fetcher.submit(
			{
				id: String(editedReview.id),
				title: editedReview.title,
				content: editedReview.content,
				score: String(editedReview.score),
			},
			{
				method: 'post',
				action: `/updateReview/${editedReview.id}/${editedReview.product_id}`,
			}
		)
		setIsEditing(false)
	}

	return (
		<>
			{isCommentSectionOpen && (
				<CommentsModal
					onClose={() => setCommentSectionOpen(false)}
					comments={review.comments ? review.comments : null}
					reviewId={review.id}
					userLogged={userLogged}
				/>
			)}

			<div className="bg-primaryWhite-default dark:bg-primaryBlack-light shadow-md rounded-lg p-6 border border-gray-200 dark:border-primaryBlack-default hover:shadow-lg transition-shadow duration-300 mt-8">
				<div className="flex items-center mb-4 gap-4 justify-between">
					<div className="flex items-center gap-4">
						<img
							src={
								review.user?.image
									? review.user?.image
									: 'https://res.cloudinary.com/dy4kmqtwc/image/upload/v1736026088/Critics%20Eye/gtdrnbhbsebjqt3vqnha.jpg'
							}
							alt={review.user?.username}
							className="w-12 h-12 rounded-full object-cover"
						/>
						<div>
							{isUserReviewOwner && (
								<p className="text-gray-400 italic text-xs align-center">
									(You)
								</p>
							)}
							<h1 className="text-xl font-semibold text-primaryBlack-default dark:text-primaryYellow-light">
								{review.user?.username}
							</h1>
						</div>
					</div>

					{review.score !== undefined && (
						<div
							className={`text-xl py-2 px-4 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center lg:flex lg:items-center lg:justify-center ${getScoreColor(
								review.score
							)} lg:mr-0`}
						>
							{isEditing ? (
								<input
									type="number"
									name="score"
									value={editedReview.score}
									onChange={handleInputChange}
									className="text-center bg-transparent w-12 h-12 border-2 border-primaryYellow-light text-white font-bold rounded-full focus:outline-none transition-all duration-300"
									placeholder="Edit score"
								/>
							) : (
								<div
									className={`text-xl py-2 px-4 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center lg:flex lg:items-center lg:justify-center ${getScoreColor(
										review.score
									)} lg:mr-0`}
								>
									{review.score}
								</div>
							)}
						</div>
					)}
				</div>

				<hr className="border-gray-300" />

				<div className="mt-4">
					<h1 className="text-xl font-semibold text-primaryBlack-default dark:text-primaryWhite-default">
						{isEditing ? (
							<textarea
								name="title"
								value={editedReview.title}
								onChange={handleInputChange}
								className="text-gray-600 dark:text-gray-300 bg-transparent border-2 border-primaryYellow-light focus:outline-none w-full p-2 rounded-md transition-all duration-300"
								rows={4}
								placeholder="Edit your review content"
							/>
						) : (
							review.title
						)}
					</h1>
					<p className="text-lg text-primaryBlack-default dark:text-primaryWhite-default">
						{isEditing ? (
							<textarea
								name="content"
								value={editedReview.content}
								onChange={handleInputChange}
								className="text-gray-600 dark:text-gray-300 bg-transparent border-2 border-primaryYellow-light focus:outline-none w-full p-2 rounded-md transition-all duration-300"
								rows={4}
								placeholder="Edit your review content"
							/>
						) : (
							review.content
						)}
					</p>
				</div>

				<div className="flex items-center justify-end mt-4 gap-4">
					<button
						onClick={() => setCommentSectionOpen(true)}
						className={`transition-all duration-400 ease-in-out transform ${
							fetcher.state === 'submitting'
								? 'cursor-not-allowed'
								: 'hover:scale-150 hover:text-primaryYellow-default'
						}`}
					>
						{fetcher.state === 'submitting' ? (
							<i className="bi bi-slash-circle text-errorColor-default mr-2 text-2xl h-auto"></i>
						) : (
							<i className="bi bi-chat text-primaryYellow-light text-2xl h-auto"></i>
						)}
					</button>

					{isUserReviewOwner && (
						<div className="flex items-center gap-4">
							{isEditing ? (
								<>
									<button
										onClick={handleSubmit}
										className="px-4 py-2 bg-primaryYellow-light text-white rounded-lg transition-colors hover:bg-primaryYellow-dark"
									>
										Save
									</button>
									<button
										onClick={() => setIsEditing(false)}
										className="px-4 py-2 bg-gray-400 text-white rounded-lg transition-colors hover:bg-gray-500"
									>
										Cancel
									</button>
								</>
							) : (
								<>
									<button
										onClick={() => setIsEditing(true)}
										className={`transition-all duration-400 ease-in-out transform ${
											fetcher.state === 'submitting'
												? 'cursor-not-allowed'
												: 'hover:scale-150 hover:text-primaryYellow-default'
										}`}
									>
										{fetcher.state === 'submitting' ? (
											<i className="bi bi-slash-circle text-errorColor-default mr-2 text-2xl h-auto"></i>
										) : (
											<i className="bi bi-pencil text-primaryYellow-light text-2xl h-auto"></i>
										)}
									</button>

									<DeleteReview
										reviewId={review.id}
										productId={review.product_id}
										fetcher={fetcher}
									/>
								</>
							)}
						</div>
					)}
				</div>
			</div>
		</>
	)
}
