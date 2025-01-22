import { useFetcher } from '@remix-run/react'

interface AddReviewProps {
	productId: number
	fetcher: ReturnType<typeof useFetcher>
}

function AddReview({ productId, fetcher }: AddReviewProps) {
	type FetcherData = {
		ReviewError?: {
			message?: string
		}
	}

	const reviewErrors = (fetcher.data as FetcherData)?.ReviewError

	const isSubmitting = fetcher.state === 'submitting'

	return (
		<fetcher.Form
			method="post"
			action={`/addReview/${String(productId)}`}
			className="bg-primaryWhite-default dark:bg-primaryBlack-light p-8 rounded-xl shadow-lg mb-6 transition-all duration-300"
		>
			{reviewErrors?.message && (
				<div className="text-red-500 text-xs mb-4">
					<p className="animate-shake">{reviewErrors.message}</p>
				</div>
			)}

			<input type="hidden" name="productId" value={productId} />

			<h2 className="text-2xl font-semibold text-primaryBlack-default dark:text-primaryYellow-light mb-6">
				Add a Review
			</h2>

			<hr className="border border-primaryYellow-light" />

			<div className="mb-6 mt-6">
				<label
					htmlFor="title"
					className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
				>
					Review Title
				</label>
				<input
					type="text"
					id="title"
					name="title"
					className="italic focus:outline-none transition-all duration-200 transform bg-primaryWhite-default dark:bg-primaryBlack-default w-full p-4 rounded-lg border border-primaryYellow-default text-primaryBlack-default dark:text-primaryWhite-default focus:ring-2 focus:ring-primaryYellow-light dark:focus:ring-primaryYellow-default"
					placeholder="Title"
					required
				/>
			</div>

			<div className="mb-6">
				<label
					htmlFor="content"
					className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
				>
					Review Content
				</label>
				<textarea
					id="content"
					name="content"
					className="italic focus:outline-none transition-all duration-200 transform bg-primaryWhite-default dark:bg-primaryBlack-default w-full p-4 rounded-lg border border-primaryYellow-default text-primaryBlack-default dark:text-primaryWhite-default focus:ring-2 focus:ring-primaryYellow-light dark:focus:ring-primaryYellow-default"
					placeholder="Content"
					required
				/>
			</div>

			<div className="mb-6">
				<label
					htmlFor="rating"
					className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
				>
					Rating (1 to 100)
				</label>
				<input
					type="number"
					id="score"
					name="score"
					min="1"
					max="100"
					className="italic focus:outline-none transition-all duration-200 transform bg-primaryWhite-default dark:bg-primaryBlack-default w-full p-4 rounded-lg border border-primaryYellow-default text-primaryBlack-default dark:text-primaryWhite-default focus:ring-2 focus:ring-primaryYellow-light dark:focus:ring-primaryYellow-default"
					placeholder="Enter a rating between 1 and 100"
					required
				/>
			</div>

			<button
				disabled={isSubmitting}
				type="submit"
				className={`w-full font-bold py-4 rounded-lg transition-all duration-300 transform relative ${
					isSubmitting
						? 'bg-primaryBlack-default text-primaryWhite-default cursor-not-allowed'
						: 'bg-primaryYellow-default hover:bg-primaryYellow-light text-white hover:scale-105'
				}`}
			>
				{isSubmitting ? 'Posting...' : 'Post Review'}
			</button>
		</fetcher.Form>
	)
}

export default AddReview
