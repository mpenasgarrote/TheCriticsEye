import { useFetcher } from '@remix-run/react'

import { Product } from '~/types/interfaces'

interface EditProductProps {
	product: Product
	fetcher: ReturnType<typeof useFetcher>
	onClick: React.MouseEventHandler<HTMLButtonElement>
}

export default function EditProduct({ fetcher, onClick }: EditProductProps) {
	const isEditing = fetcher.state === 'submitting'

	return (
		<>
			<div>
				<button
					onClick={onClick}
					className={`transition-all duration-400 ease-in-out transform ${
						isEditing ? 'cursor-not-allowed' : 'hover:scale-125 '
					}`}
					disabled={isEditing}
				>
					{isEditing ? (
						<i className="bi bi-slash-circle text-errorColor-default text-xl h-auto"></i>
					) : (
						<i className="bi bi-pencil text-primaryYellow-light text-xl h-auto hover:text-green-500 transition-all transition-200"></i>
					)}
				</button>
			</div>
		</>
	)
}
