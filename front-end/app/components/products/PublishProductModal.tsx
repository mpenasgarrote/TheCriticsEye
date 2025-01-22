import { useFetcher } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { Type } from '~/types/interfaces'
import ComponentLoader from '../navigation/ComponentLoader'
import { genreColors, typeColors } from '~/utils/utils'

interface Genre {
	id: number
	name: string
}

interface PublishProductProps {
	onClose: () => void
}

const PublishProductModal: React.FC<PublishProductProps> = ({
	onClose,
}: PublishProductProps) => {
	const fetcher = useFetcher()
	const genreFetcher = useFetcher<Genre[]>()
	const typeFetcher = useFetcher<Type[]>()

	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [image, setImage] = useState<File | null>(null)
	const [genresLoaded, setGenresLoaded] = useState(false)
	const [typesLoaded, setTypesLoaded] = useState(false)
	const [selectedGenres, setSelectedGenres] = useState<number[]>([])
	const [selectedType, setSelectedType] = useState<number | null>(null)

	type FetcherData = {
		errors?: {
			title?: string
			description?: string
			author?: string
			typeId?: string
			genres?: string
		}
	}

	const formError = (fetcher.data as FetcherData)?.errors

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const file = e.target.files[0]
			setImage(file)

			const reader = new FileReader()
			reader.onloadend = () => {
				setImagePreview(reader.result as string)
			}
			reader.readAsDataURL(file)
		}
	}

	useEffect(() => {
		if (!genresLoaded) {
			genreFetcher.load('/getGenres')
			setGenresLoaded(true)
		}
	}, [genresLoaded, genreFetcher])

	useEffect(() => {
		if (!typesLoaded) {
			typeFetcher.load('/getTypes')
			setTypesLoaded(true)
		}
	}, [typesLoaded, typeFetcher])

	const toggleGenreSelection = (genreId: number) => {
		if (selectedGenres.includes(genreId)) {
			setSelectedGenres((prev) => prev.filter((id) => id !== genreId))
		} else if (selectedGenres.length < 2) {
			setSelectedGenres((prev) => [...prev, genreId])
		} else {
			setSelectedGenres((prev) => [...prev.slice(1), genreId])
		}
	}

	const handleTypeSelection = (typeId: number) => {
		setSelectedType((prev) => (prev === typeId ? null : typeId))
	}

	const isSubmitting =
		fetcher.state === 'submitting' || fetcher.state === 'loading'

	useEffect(() => {
		if (fetcher.state === 'idle' && fetcher.data) {
			onClose()
		}
	}, [fetcher.state, fetcher.data, onClose])

	return (
		<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center animate__animated animate__fadeIn">
			<ComponentLoader fetcher={fetcher} />

			<div
				className="bg-primaryBlack-default text-white p-8 rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-fadeInScale"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => {
					if (e.key === 'Escape') onClose()
				}}
			>
				<div className="mb-6 flex items-center justify-between">
					<h1 className="text-3xl text-primaryBlack-default dark:text-primaryYellow-default font-semibold">
						Add a New Product
					</h1>
					<button
						type="button"
						onClick={onClose}
						className="text-primaryBlack-default rounded-full dark:text-primaryYellow-default hover:scale-125 hover:text-red-500 transition-all duration-200"
						aria-label="Close"
					>
						<span aria-hidden="true" className="text-4xl">
							&times;
						</span>
					</button>
				</div>

				<hr className="border border-primaryYellow-default mb-10" />

				<fetcher.Form
					method="post"
					action="/addProduct"
					className="grid grid-cols-1 md:grid-cols-2 gap-8"
					encType="multipart/form-data"
				>
					<div>
						<div className="mb-4">
							<label
								htmlFor="title"
								className="block text-lg font-medium text-primaryYellow-light mb-2"
							>
								Title
							</label>
							<input
								type="text"
								id="title"
								name="title"
								required
								className="w-full p-3 rounded-lg border border-primaryBlack-default italic focus:outline-none transition-all duration-200 transform focus:ring focus:ring-primaryYellow-default focus:scale-105 focus:border-primaryYellow-default bg-primaryBlack-light text-gray-900 dark:text-gray-200"
								placeholder="Enter product title"
							/>
						</div>

						<div className="mb-4">
							<label
								htmlFor="description"
								className="block text-lg font-medium text-primaryYellow-light mb-2"
							>
								Description
							</label>

							<textarea
								id="description"
								name="description"
								required
								rows={4}
								className="w-full p-3 rounded-lg border border-primaryBlack-default italic focus:outline-none transition-all duration-200 transform focus:ring focus:ring-primaryYellow-default focus:scale-105 focus:border-primaryYellow-default bg-primaryBlack-light text-gray-900 dark:text-gray-200"
								placeholder="Enter product description"
							/>
						</div>

						<div className="mb-4">
							<label
								htmlFor="author"
								className="block text-lg font-medium text-primaryYellow-light mb-2"
							>
								Author
							</label>

							<input
								type="text"
								id="author"
								name="author"
								required
								className="w-full p-3 rounded-lg border border-primaryBlack-default italic focus:outline-none transition-all duration-200 transform focus:ring focus:ring-primaryYellow-default focus:scale-105 focus:border-primaryYellow-default bg-primaryBlack-light text-gray-900 dark:text-gray-200"
								placeholder="Enter author name"
							/>
						</div>
					</div>

					<div>
						<div className="mb-4">
							<label
								htmlFor="type_id"
								className="block text-lg font-medium text-primaryYellow-light"
							>
								Type
							</label>

							{typeFetcher.state === 'loading' ? (
								<p>Loading types...</p>
							) : (
								<div className="grid grid-cols-3 gap-2 mt-2">
									{typeFetcher.data?.map((type: Type) => (
										<button
											key={type.id}
											type="button"
											onClick={() => handleTypeSelection(type.id)}
											className={`bg-gray-600 justify-self-center mt-2 rounded-md px-4 py-2 text-sm hover:scale-125 text-white font-bold transition-all duration-200 ${
												selectedType === type.id
													? `${typeColors[type.name]} 
													   border-2 border-primaryYellow-light scale-110 text-white`
													: 'bg-primaryBlack-light border-2 border-primaryBlack-default text-white'
											}`}
										>
											{type.name}
										</button>
									))}
								</div>
							)}

							<input
								type="hidden"
								value={selectedType !== null ? selectedType.toString() : ''}
								name="typeId"
							/>
						</div>

						<div className="mb-4">
							<label
								htmlFor="genreLabel"
								className="block text-lg font-medium text-primaryYellow-light"
							>
								Genres
							</label>

							{genreFetcher.state === 'loading' ? (
								<p>Loading genres...</p>
							) : (
								<div className="grid grid-cols-3 gap-2 mt-2">
									{genreFetcher.data?.map((genre: Genre) => (
										<button
											key={genre.id}
											type="button"
											onClick={() => toggleGenreSelection(genre.id)}
											className={`justify-self-center mt-2 rounded-md px-4 py-2 text-xs font-bold hover:scale-110 text-white transition-all duration-200 ${
												selectedGenres.includes(genre.id)
													? `${
															genreColors[genre.name]
													  } border-2 border-primaryYellow-light scale-105 text-black`
													: 'bg-primaryBlack-light border-2 border-primaryBlack-default text-white'
											}`}
										>
											{genre.name}
										</button>
									))}
									<input
										type="hidden"
										value={
											selectedGenres !== null ? selectedGenres.toString() : ''
										}
										name="genres"
									/>
								</div>
							)}
						</div>
					</div>

					<div className="mt-8 mb-4 col-span-2">
						<div className="mb-4">
							<label
								htmlFor="image"
								className="block text-xl text-center font-medium text-primaryYellow-light"
							>
								Product Image
							</label>
							<hr className="border border-primaryYellow-light mt-2 mb-4" />
							<div className="mt-2 w-full h-[350px] p-4 bg-primaryBlack-light text-white rounded-lg border-2 border-dashed border-primaryBlack-default relative flex items-center justify-center">
								<input
									type="file"
									id="image"
									name="image"
									accept="image/*"
									className="absolute inset-0 opacity-0 cursor-pointer"
									onChange={handleImageChange}
								/>
								{imagePreview ? (
									<img
										src={imagePreview}
										alt="Preview of the selected product"
										className="w-auto h-auto max-w-80 max-h-80 object-cover rounded-lg"
									/>
								) : (
									<div className="text-center text-gray-400">
										Select an image
									</div>
								)}
							</div>
						</div>

						<div>
							{formError && (
								<ul>
									{Object.entries(formError).map(([key, value]) => {
										return (
											<li key={key} className="text-red-500 text-xs">
												{value}
											</li>
										)
									})}
								</ul>
							)}
						</div>

						<button
							disabled={isSubmitting}
							type="submit"
							className={`w-full font-bold py-3 rounded-lg transition-all duration-300 transform relative ${
								isSubmitting
									? 'bg-gray-400 text-gray-200 cursor-not-allowed'
									: 'bg-primaryYellow-default hover:bg-primaryYellow-light text-white hover:scale-110'
							}`}
						>
							{isSubmitting && (
								<div className="absolute ml-10 left-3/4 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
									<div className="w-5 h-5 border-4 border-t-transparent border-primaryWhite-default border-solid rounded-full animate-spin"></div>
								</div>
							)}
							{isSubmitting ? 'Publishing...' : 'Publish'}
						</button>
					</div>
				</fetcher.Form>
			</div>
		</div>
	)
}

export default PublishProductModal
