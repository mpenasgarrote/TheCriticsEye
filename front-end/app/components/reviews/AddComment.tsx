import { useFetcher } from '@remix-run/react'

interface AddCommentsProps {
	reviewId: number
	fetcher: ReturnType<typeof useFetcher>
}

export default function CommentAdd({ reviewId, fetcher }: AddCommentsProps) {
	type FetcherData = {
		Error?: {
			message?: string
		}
	}

	const errors = (fetcher.data as FetcherData)?.Error

	const isSubmitting = fetcher.state === 'submitting'

	return (
		<fetcher.Form
			method="post"
			action={`/addComment/${String(reviewId)}`}
			className="bg-primaryWhite-default dark:bg-primaryBlack-light p-8 rounded-xl shadow-lg mb-6 transition-all duration-300"
		>
			{errors?.message && (
				<div className="text-red-500 text-xs mb-4">
					<p className="animate-shake">{errors.message}</p>
				</div>
			)}

			<input type="hidden" name="reviewId" value={reviewId} />

			<h2 className="text-2xl font-semibold text-primaryBlack-default dark:text-primaryYellow-light mb-6">
				Add a Comment
			</h2>

			<hr className="border border-primaryYellow-light mb-6" />

			<div className="mb-6">
				<label
					htmlFor="content"
					className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
				>
					Write your Opinion...
				</label>
				<textarea
					id="content"
					name="content"
					className="italic focus:outline-none transition-all duration-200 transform bg-primaryWhite-default dark:bg-primaryBlack-default w-full p-4 rounded-lg border border-primaryYellow-default text-primaryBlack-default dark:text-primaryWhite-default focus:ring-2 focus:ring-primaryYellow-light dark:focus:ring-primaryYellow-default"
					placeholder="ex: 'I completly agree with you!'"
					required
				/>
			</div>

			<button
				disabled={isSubmitting}
				type="submit"
				className={`w-full font-bold py-4 rounded-lg transition-all duration-300 transform relative ${
					isSubmitting
						? 'bg-primaryBlack-default text-primaryWhite-default cursor-not-allowed'
						: 'bg-primaryYellow-default hover:bg-primaryYellow-light text-black hover:scale-105'
				}`}
			>
				{isSubmitting ? 'Posting...' : 'Comment'}
			</button>
		</fetcher.Form>
	)
}
