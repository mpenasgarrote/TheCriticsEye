import { Link, useFetcher } from '@remix-run/react'
import { useState } from 'react'

function SignupForm() {
	const fetcher = useFetcher()

	interface ValidationErrors {
		name?: string
		username?: string
		email?: string
		password?: string
		confirmPassword?: string
	}

	const validationErrors: ValidationErrors = fetcher.data ? fetcher.data : {}

	const errors = {
		name: validationErrors?.name,
		username: validationErrors?.username,
		email: validationErrors?.email,
		password: validationErrors?.password,
		confirmPassword: validationErrors?.confirmPassword,
	}

	const submitBtnCaption = 'Register'

	const isSubmitting =
		fetcher.state === 'submitting' || fetcher.state === 'loading'

	const [imagePreview, setImagePreview] = useState(
		'https://res.cloudinary.com/dy4kmqtwc/image/upload/v1736026088/Critics%20Eye/gtdrnbhbsebjqt3vqnha.jpg'
	)

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			setIsLoading(true)

			const reader = new FileReader()
			reader.onload = () => {
				if (reader.readyState === FileReader.DONE) {
					setImagePreview(reader.result as string)
					setIsLoading(false)
				}
			}
			reader.readAsDataURL(file)
		}
	}

	const [isLoading, setIsLoading] = useState(false)

	const toggleBtnCaption = 'Already have an account? Login'

	return (
		<>
			<div className="min-h-screen w-auto flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-700 dark:from-gray-800 dark:to-black">
				<div className="bg-primaryWhite-light dark:bg-primaryBlack-default backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-4xl">
					<h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
						Signup
					</h1>

					<fetcher.Form
						id="signup-form"
						method="post"
						className="space-y-4"
						encType="multipart/form-data"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-10  p-4 rounded-lg">
							<div className="space-y-4">
								<div>
									<label
										htmlFor="name"
										className={`block text-sm font-medium transition-all duration-200 ${
											errors.name
												? 'text-red-500 dark:text-red-500'
												: 'text-gray-700 dark:text-gray-300'
										}`}
									>
										Full Name
									</label>
									<input
										type="text"
										id="name"
										name="name"
										placeholder="Enter your name"
										className={`w-full p-3 rounded-lg border italic focus:outline-none transition-all duration-200 transform ${
											errors.name
												? 'border-red-500 focus:ring-errorColor-light text-errorColor-light focus:scale-105 focus:border-errorColor-light animate-shake'
												: 'focus:ring focus:ring-primaryYellow-default focus:scale-105 focus:border-primaryYellow-default bg-primaryBlack-light text-gray-900 dark:text-gray-200'
										}`}
										required
									/>
								</div>

								<div>
									<label
										htmlFor="username"
										className={`block text-sm font-medium transition-all duration-200 ${
											errors.username
												? 'text-red-500 dark:text-red-500'
												: 'text-gray-700 dark:text-gray-300'
										}`}
									>
										Username
									</label>
									<input
										type="text"
										id="username"
										name="username"
										placeholder="Enter your username"
										className={`w-full p-3 rounded-lg border italic focus:outline-none transition-all duration-200 transform ${
											errors.username
												? 'border-red-500 focus:ring-errorColor-light text-errorColor-light focus:scale-105 focus:border-errorColor-light animate-shake'
												: 'focus:ring focus:ring-primaryYellow-default focus:scale-105 focus:border-primaryYellow-default bg-primaryBlack-light text-gray-900 dark:text-gray-200'
										}`}
										required
									/>
								</div>

								<div>
									<label
										htmlFor="email"
										className={`block text-sm font-medium transition-all duration-200 ${
											errors.email
												? 'text-red-500 dark:text-red-500'
												: 'text-gray-700 dark:text-gray-300'
										}`}
									>
										Email
									</label>
									<input
										type="email"
										id="email"
										name="email"
										placeholder="Enter your email"
										className={`w-full p-3 rounded-lg border italic focus:outline-none transition-all duration-200 transform ${
											errors.email
												? 'border-red-500 focus:ring-errorColor-light text-errorColor-light focus:scale-105 focus:border-errorColor-light animate-shake'
												: 'focus:ring focus:ring-primaryYellow-default focus:scale-105 focus:border-primaryYellow-default bg-primaryBlack-light text-gray-900 dark:text-gray-200'
										}`}
										required
									/>
								</div>

								<div>
									<label
										htmlFor="password"
										className={`block text-sm font-medium transition-all duration-200 ${
											errors.password
												? 'text-red-500 dark:text-red-500'
												: 'text-gray-700 dark:text-gray-300'
										}`}
									>
										Password
									</label>
									<input
										type="password"
										id="password"
										name="password"
										placeholder="Enter your password"
										className={`w-full p-3 rounded-lg border italic focus:outline-none transition-all duration-200 transform ${
											errors.password
												? 'border-red-500 focus:ring-errorColor-light text-errorColor-light focus:scale-105 focus:border-errorColor-light animate-shake'
												: 'focus:ring focus:ring-primaryYellow-default focus:scale-105 focus:border-primaryYellow-default bg-primaryBlack-light text-gray-900 dark:text-gray-200'
										}`}
										required
									/>
								</div>

								<div>
									<label
										htmlFor="confirmPassword"
										className={`block text-sm font-medium transition-all duration-200 ${
											errors.confirmPassword
												? 'text-red-500 dark:text-red-500'
												: 'text-gray-700 dark:text-gray-300'
										}`}
									>
										Confirm Password
									</label>
									<input
										type="password"
										id="confirmPassword"
										name="confirmPassword"
										placeholder="Re-enter your password"
										className={`w-full p-3 rounded-lg border italic focus:outline-none transition-all duration-200 transform ${
											errors.confirmPassword
												? 'border-red-500 focus:ring-errorColor-light text-errorColor-light focus:scale-105 focus:border-errorColor-light animate-shake'
												: 'focus:ring focus:ring-primaryYellow-default focus:scale-105 focus:border-primaryYellow-default bg-primaryBlack-light text-gray-900 dark:text-gray-200'
										}`}
										required
									/>
								</div>
							</div>

							<div className="flex justify-center items-center rounded-lg p-4">
								<div
									className="w-60 h-60 border-4 bg-primaryBlack-light border border-primaryWhite-default rounded-full p-2 flex justify-center items-center transition-all duration-300 ease-in-out transform hover:scale-125 hover:border-primaryYellow-default relative"
									style={{
										backgroundImage: `url(${imagePreview})`,
										backgroundSize: 'cover',
										backgroundPosition: 'center',
									}}
								>
									{isLoading && (
										<div className="w-full h-full rounded-full absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
											<div className="w-10 h-10 border-4 border-t-transparent border-primaryYellow-light border-solid rounded-full animate-spin"></div>
										</div>
									)}

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
						</div>

						<div>
							{validationErrors && (
								<ul>
									{Object.values(validationErrors).map((error) => (
										<li key={error} className="text-red-500 text-xs">
											{error}
										</li>
									))}
								</ul>
							)}
						</div>

						<button
							disabled={isSubmitting}
							type="submit"
							className={`w-full font-bold py-3 rounded-lg transition-all duration-300 transform relative ${
								isSubmitting
									? 'bg-gray-400 text-gray-200 cursor-not-allowed'
									: 'bg-primaryYellow-default hover:bg-primaryYellow-light text-black hover:scale-110'
							}`}
						>
							{isSubmitting && (
								<div className="absolute ml-10 left-3/4 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
									<div className="w-5 h-5 border-4 border-t-transparent border-primaryWhite-default border-solid rounded-full animate-spin"></div>
								</div>
							)}
							{isSubmitting ? 'Registering...' : submitBtnCaption}
						</button>

						<Link
							to="/login"
							className="block text-center text-sm text-gray-700 dark:text-gray-300 hover:underline"
						>
							{toggleBtnCaption}
						</Link>
					</fetcher.Form>
				</div>
			</div>
		</>
	)
}

export default SignupForm
