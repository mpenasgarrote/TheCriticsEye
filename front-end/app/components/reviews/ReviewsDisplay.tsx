import { useEffect, useState } from 'react'
import { Review } from '~/types/interfaces'
import ReviewCard from './ReviewCard'
import AddReview from './AddReview'
import { useFetcher } from '@remix-run/react'
import ComponentLoader from '../navigation/ComponentLoader'
import NoReviews from './NoReviews'

interface ReviewsDisplayProps {
	productId: number
	reviews: Review[]
	userLogged: number
}

export function ReviewsDisplay({
	productId,
	reviews,
	userLogged,
}: ReviewsDisplayProps) {
	const fetcher = useFetcher<{ reviews: Review[] }>()
	const [updatedReviews, setReviews] = useState(reviews)
	const [showForm, setShowForm] = useState(false)

	useEffect(() => {
		if (fetcher.state === 'idle' && fetcher.data?.reviews) {
			setReviews(fetcher.data.reviews)
		}

		if (fetcher.state === 'loading') {
			setShowForm(false)
		}
	}, [fetcher.state, fetcher.data])

	return (
		<div className="relative max-w-4xl mt-10 mx-auto p-10 px-20 rounded-lg dark:bg-primaryBlack-default drop-shadow-lg">
			<ComponentLoader fetcher={fetcher} />

			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-semibold text-primaryBlack-default dark:text-primaryYellow-default">
					Reviews
				</h1>
				<button
					className="mr-4 mt-4 text-primaryBlack-default hover:font-bold hover:text-primaryYellow-light hover:scale-150 transition duration-200 ease-in-out dark:text-primaryYellow-default rounded-full hover:bg-primaryBlue-dark transition-colors"
					aria-label="Add review"
					onClick={() => setShowForm(!showForm)}
				>
					<i className="bi bi-plus text-2xl"></i>
				</button>
			</div>

			{showForm && (
				<div className="animate-slide-down">
					<AddReview fetcher={fetcher} productId={productId} />
				</div>
			)}

			<hr className="border-primaryYellow-default mb-6" />

			{updatedReviews.length > 0 ? (
				updatedReviews.map((review: Review) => (
					<ReviewCard
						key={review.id}
						review={review}
						userLogged={userLogged}
						fetcher={fetcher}
					/>
				))
			) : (
				<NoReviews />
			)}
		</div>
	)
}
