import { useFetcher } from '@remix-run/react'

interface EditProfileProps {
	fetcher: ReturnType<typeof useFetcher>
	onClick: React.MouseEventHandler<HTMLButtonElement>
}

export default function EditProfile({ fetcher, onClick }: EditProfileProps) {
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
