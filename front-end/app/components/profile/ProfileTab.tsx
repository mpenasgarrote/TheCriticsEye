import { useEffect, useState } from 'react'
import { User } from '~/types/interfaces'
import DeleteProfile from './DeleteProfile'
import { useFetcher } from '@remix-run/react'
import EditProfile from './EditProfile'
import ComponentLoader from '../navigation/ComponentLoader'

interface ProfileModalProps {
	onClose: () => void
	user: User
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
	onClose,
	user,
}: ProfileModalProps) => {
	const fetcher = useFetcher()
	const [isEditing, setIsEditing] = useState(false)

	const [imagePreview, setImagePreview] = useState(user.image)
	const [username, setUsername] = useState(user.username)
	const [name, setName] = useState(user.name)
	const [email, setEmail] = useState(user.email)

	const isSubmitting =
		fetcher.state === 'submitting' || fetcher.state === 'loading' ? true : false

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = () => {
				if (reader.readyState === FileReader.DONE) {
					setImagePreview(reader.result as string)
				}
			}
			reader.readAsDataURL(file)
		}
	}

	useEffect(() => {
		if (fetcher.state === 'loading') {
			setIsEditing(false)
		}
	})

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		switch (name) {
			case 'username':
				setUsername(value)
				break
			case 'name':
				setName(value)
				break
			case 'email':
				setEmail(value)
				break
			default:
				break
		}
	}

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate__animated animate__fadeIn transform transition-all duration-300 animate-fadeInScale">
			<ComponentLoader fetcher={fetcher} />
			<fetcher.Form
				method="post"
				action={`/updateProfile/${user.id}`}
				encType="multipart/form-data"
				className="dark:bg-primaryBlack-default text-primaryWhite-default rounded-lg shadow-lg w-11/12 max-w-xl p-6 relative"
			>
				<button
					onClick={onClose}
					type="button"
					className="absolute top-4 right-4 text-primaryYellow-default hover:text-primaryYellow-light text-2xl"
					aria-label="Close modal"
				>
					&times;
				</button>

				<div className="flex items-center mb-6 gap-4">
					{isEditing ? (
						<div className="flex justify-center items-center rounded-lg p-4">
							<div
								className="w-24 h-24 border-4 bg-primaryBlack-light border border-primaryWhite-default rounded-full p-2 flex justify-center items-center transition-all duration-300 ease-in-out transform hover:scale-125 hover:border-primaryYellow-default relative"
								style={{
									backgroundImage: `url(${imagePreview})`,
									backgroundSize: 'cover',
									backgroundPosition: 'center',
								}}
							>
								<input
									type="file"
									id="image"
									name="image"
									accept="image/*"
									className="w-full h-full rounded-full cursor-pointer opacity-0"
									onChange={handleImageChange}
								/>
							</div>
						</div>
					) : (
						<img
							src={
								imagePreview ||
								'https://res.cloudinary.com/dy4kmqtwc/image/upload/v1736026088/Critics%20Eye/gtdrnbhbsebjqt3vqnha.jpg'
							}
							alt="Profile"
							className="w-24 h-24 rounded-full border-4 border-primaryYellow-default object-cover mb-2"
						/>
					)}

					{isEditing ? (
						<input
							type="text"
							name="username"
							value={username}
							onChange={handleInputChange}
							className="text-xl font-bold bg-primaryBlack-light border border-primaryYellow-light rounded-md px-4 py-2"
						/>
					) : (
						<h1 className="text-2xl font-bold">{user.username}</h1>
					)}
				</div>

				<hr className="border-2 border-primaryYellow-default mb-4" />

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-bold mb-1" htmlFor="name">
							Name
						</label>
						{isEditing ? (
							<input
								type="text"
								id="name"
								name="name"
								value={name}
								onChange={handleInputChange}
								className="w-full bg-primaryBlack-light border border-primaryYellow-light text-primaryWhite-default rounded-md px-4 py-2"
							/>
						) : (
							<p className="text-lg">{user.name}</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-bold mb-1" htmlFor="email">
							Email
						</label>
						{isEditing ? (
							<input
								type="email"
								id="email"
								name="email"
								value={email}
								onChange={handleInputChange}
								className="w-full bg-primaryBlack-light border border-primaryYellow-light text-primaryWhite-default rounded-md px-4 py-2"
							/>
						) : (
							<p className="text-lg">{user.email}</p>
						)}
					</div>

					<div>
						<label
							className="block text-sm font-bold mb-1"
							htmlFor="accountCreated"
						>
							Account Created
						</label>
						<p id="accountCreated" className="text-lg">
							{new Date(user.created_at).toLocaleDateString()}
						</p>
					</div>
				</div>

				<div className="mt-6 flex justify-end gap-4">
					{isEditing ? (
						<>
							<button
								onClick={() => setIsEditing(false)}
								type="button"
								disabled={isSubmitting}
								className={`transition-all duration-400 ease-in-out transform ${
									isSubmitting
										? 'cursor-not-allowed'
										: 'hover:scale-125 hover:text-red-500'
								}`}
							>
								{isSubmitting ? (
									<i className="bi bi-slash-circle text-errorColor-default text-xl h-auto"></i>
								) : (
									<i className="bi bi-x-lg mr-2"></i>
								)}
							</button>

							<button
								type="submit"
								disabled={isSubmitting}
								className={`transition-all duration-400 ease-in-out transform ${
									isSubmitting
										? 'cursor-not-allowed'
										: 'hover:scale-125 hover:text-green-500'
								}`}
							>
								{isSubmitting ? (
									<i className="bi bi-slash-circle text-errorColor-default text-xl h-auto"></i>
								) : (
									<i className="bi bi-check-lg mr-2"></i>
								)}
							</button>
						</>
					) : (
						<>
							<EditProfile
								fetcher={fetcher}
								onClick={() => setIsEditing(true)}
							/>
							<DeleteProfile fetcher={fetcher} userId={user.id} />
						</>
					)}
				</div>
			</fetcher.Form>
		</div>
	)
}
