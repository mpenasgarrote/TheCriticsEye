import { useFetcher } from '@remix-run/react'

interface DeleteProfileProps {
	userId: number
	fetcher: ReturnType<typeof useFetcher>
}

export default function DeleteProfile({ userId, fetcher }: DeleteProfileProps) {
	const isDeleting = fetcher.state === 'submitting'

	const handleDelete = () => {
		fetcher.submit(
			{ _method: 'post' },
			{ method: 'post', action: `/deleteProfile/${userId}` }
		)
	}

	return (
		<>
			<button
				onClick={handleDelete}
				aria-label={isDeleting ? 'Deleting profile' : 'Delete profile'}
				className={`transition-all duration-400 ease-in-out transform ${
					isDeleting ? 'cursor-not-allowed' : 'hover:scale-125 '
				}`}
				disabled={isDeleting}
			>
				{isDeleting ? (
					<i className="bi bi-slash-circle text-errorColor-default text-xl h-auto"></i>
				) : (
					<i className="bi bi-trash text-primaryYellow-light text-xl h-auto hover:text-red-500 transition-all transition-200"></i>
				)}
			</button>
		</>
	)
}
