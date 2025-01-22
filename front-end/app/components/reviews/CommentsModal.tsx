import { useFetcher } from '@remix-run/react'
import { Comment } from '~/types/interfaces'
import ComponentLoader from '../navigation/ComponentLoader'
import CommentCard from './CommentCard'
import NoResults from '../filters/NoResults'
import AddComment from './AddComment'
import { useEffect, useState } from 'react'

export default function CommentsModal({
	onClose,
	comments,
	reviewId,
	userLogged,
}: {
	onClose: () => void
	comments: Comment[] | null
	reviewId: number
	userLogged: number
}) {
	const fetcher = useFetcher<{ comments: Comment[] }>()

	const [showForm, setShowForm] = useState(false)
	const [updatedComments, setUpdatedComments] = useState(comments)

	useEffect(() => {
		if (fetcher.state === 'idle' && fetcher.data?.comments) {
			setUpdatedComments(fetcher.data.comments)
		}

		if (fetcher.state === 'loading') {
			setShowForm(false)
		}
	}, [fetcher.state, fetcher.data])

	return (
		<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center animate__animated animate__fadeIn">
			<ComponentLoader fetcher={fetcher} />

			<div className="bg-primaryBlack-default text-white p-8 rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-fadeInScale">
				<div className="mb-6 flex items-center justify-between">
					<h1 className="text-3xl text-primaryBlack-default dark:text-primaryYellow-default font-semibold">
						Comment Section
					</h1>
					<div className="flex gap-4 items-center">
						<button
							className="flex items-center text-primaryBlack-default rounded-full dark:text-primaryYellow-default hover:scale-125 hover:text-green-500 dark:hover:text-green-500 transition-all duration-200 mt-1"
							aria-label="Add review"
							onClick={() => setShowForm(!showForm)}
						>
							<i className="bi bi-plus text-2xl"></i>
						</button>
						<button
							type="button"
							onClick={onClose}
							className="flex items-center text-primaryBlack-default rounded-full dark:text-primaryYellow-default hover:scale-125 hover:text-red-500  dark:hover:text-red-500 transition-all duration-200"
							aria-label="Close"
						>
							<span aria-hidden="true" className="text-2xl">
								&times;
							</span>
						</button>
					</div>
				</div>

				{showForm && (
					<div className="animate-slide-down">
						<AddComment fetcher={fetcher} reviewId={reviewId} />
					</div>
				)}

				<hr className="border border-primaryYellow-default mb-10" />

				<div>
					{updatedComments && updatedComments.length > 0 ? (
						updatedComments.map((comment) => (
							<div key={comment.id}>
								<CommentCard
									comment={comment}
									userLogged={userLogged}
									fetcher={fetcher}
								/>
							</div>
						))
					) : (
						<NoResults />
					)}
				</div>
			</div>
		</div>
	)
}
