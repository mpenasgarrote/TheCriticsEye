import { useFetcher } from '@remix-run/react'
import { Comment } from '~/types/interfaces'
import DeleteComment from './DeleteComment'

export default function CommentCard({
	comment,
	userLogged,
	fetcher,
}: {
	comment: Comment
	userLogged: number
	fetcher: ReturnType<typeof useFetcher>
}) {
	const isUserCommentOwner = comment.user_id === userLogged

	return (
		<div className="bg-primaryWhite-default dark:bg-primaryBlack-light shadow-md rounded-lg p-6 border border-gray-200 dark:border-primaryBlack-default hover:shadow-lg transition-shadow duration-300 mt-8">
			<div className="flex items-center mb-4 gap-4 justify-between">
				<div className="flex items-center gap-4">
					<img
						src={
							comment.user?.image
								? comment.user?.image
								: 'https://res.cloudinary.com/dy4kmqtwc/image/upload/v1736026088/Critics%20Eye/gtdrnbhbsebjqt3vqnha.jpg'
						}
						alt={comment.user?.username}
						className="w-12 h-12 rounded-full object-cover"
					/>
					<div>
						{isUserCommentOwner && (
							<p className="text-gray-400 italic text-xs align-center">(You)</p>
						)}
						<h1 className="text-xl font-semibold text-primaryBlack-default dark:text-primaryYellow-light">
							{comment.user?.username}
						</h1>
					</div>
				</div>
			</div>

			<hr className="border-gray-300" />

			<div className="mt-4">
				<p className="text-lg text-primaryBlack-default dark:text-primaryWhite-default">
					{comment.content}
				</p>
			</div>

			<div className="flex items-center justify-end mt-4 gap-4">
				{isUserCommentOwner && (
					<div className="flex items-center gap-4">
						<>
							<DeleteComment
								reviewId={comment.review_id}
								commentId={comment.id}
								fetcher={fetcher}
							/>
						</>
					</div>
				)}
			</div>
		</div>
	)
}
