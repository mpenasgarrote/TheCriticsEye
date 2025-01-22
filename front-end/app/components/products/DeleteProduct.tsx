import { useFetcher } from '@remix-run/react'

interface DeleteProductProps {
	productId: number
	fetcher: ReturnType<typeof useFetcher>
}

export default function DeleteProduct({
	productId,
	fetcher,
}: DeleteProductProps) {
	const isDeleting = fetcher.state === 'submitting'

	const handleDelete = () => {
		fetcher.submit(
			{ productId: String(productId) },
			{ method: 'post', action: `/deleteProduct` }
		)
	}

	return (
		<>
			<button
				onClick={handleDelete}
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
