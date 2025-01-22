import { useFetcher } from '@remix-run/react'
import { useState } from 'react'
import { Genre } from '~/types/interfaces'
import { genreColors } from '~/utils/utils'

export default function FilterMenu({
	fetcher,
	type_id,
	genres,
	userLogged,
}: {
	fetcher: ReturnType<typeof useFetcher>
	type_id: number
	genres: Genre[]
	userLogged: number
}) {
	const [orderBy, setOrderBy] = useState<string>('title')
	const [orderMode, setOrderMode] = useState<string>('asc')
	const [selectedGenres, setSelectedGenres] = useState<number[]>([])
	const [publishedByMe, setPublishedByMe] = useState<boolean>(false)

	const isSubmitting =
		fetcher.state === 'submitting' || fetcher.state === 'loading' ? true : false

	const buildQueryString = () => {
		let queryString = ''

		if (orderBy) {
			queryString += `sort=${orderBy}:${orderMode}`
		}

		if (publishedByMe) {
			if (queryString) queryString += '&'
			queryString += `user_id=${userLogged}`
		}

		return queryString
	}

	const toggleGenreSelection = (genreId: number) => {
		if (selectedGenres.includes(genreId)) {
			setSelectedGenres((prev) => prev.filter((id) => id !== genreId))
		} else {
			setSelectedGenres((prev) => [...prev, genreId])
		}
	}

	const handleOrderFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setOrderBy(event.target.value)
	}

	const handleOrderMode = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setOrderMode(event.target.value)
	}

	const handlePublishedByMe = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPublishedByMe(event.target.checked)
	}

	const handleApplyFilters = () => {
		const query = `type_id=${type_id}&` + buildQueryString()

		const genresParam = selectedGenres.length > 0 ? selectedGenres : 'null'

		console.log('Query:', query)

		fetcher.submit(query, {
			method: 'post',
			action: `/applyFilters/${query}/${genresParam}`,
		})
	}

	return (
		<div className="p-6 dark:bg-primaryBlack-light rounded-lg max-w-fit shadow-lg space-y-6">
			<fetcher.Form
				method="post"
				encType="multipart/form-data"
				className="space-y-4"
			>
				<div className="flex gap-8">
					<div className="space-y-2">
						<label
							htmlFor="orderBy"
							className="block text-lg font-medium text-primaryYellow-light mb-2"
						>
							Order By:
						</label>
						<div className="flex gap-4">
							<div className="relative w-full group">
								<select
									name="orderBy"
									id="orderBy"
									value={orderBy}
									onChange={handleOrderFilter}
									className="w-full p-2 border bg-primaryBlack-light border-primaryBlack-default rounded-md font-bold focus:ring-2 focus:ring-primaryYellow-light focus:outline-none transition-transform duration-200 ease-in-out transform group-hover:scale-105"
								>
									<option value="title">Name</option>
									<option value="created_at">Last Created</option>
									<option value="score">Score</option>
								</select>
								<div className="absolute inset-0 transition-transform duration-300 scale-0 group-focus-within:scale-100"></div>
							</div>

							<div className="relative w-full group">
								<select
									name="orderMode"
									id="orderMode"
									onChange={handleOrderMode}
									className="w-full p-2 border bg-primaryBlack-light border-primaryBlack-default  rounded-md font-bold focus:ring-2 focus:ring-primaryYellow-light focus:outline-none transition-transform duration-200 ease-in-out transform group-hover:scale-105"
								>
									<option
										value="asc"
										className="hover:bg-primaryYellow-default hover:text-primaryBlack-default hover:font-bold transition-all"
									>
										Ascendant
									</option>
									<option value="desc">Descendant</option>
								</select>
								<div className="absolute inset-0 transition-transform duration-300 scale-0 group-focus-within:scale-100"></div>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-3">
						{genres.map((genre: Genre) => (
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
					</div>
				</div>

				<div className="flex items-center space-x-2">
					<label className="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							checked={publishedByMe}
							onChange={handlePublishedByMe}
							className="sr-only peer"
						/>
						<div className="w-11 h-6 bg-primaryBlack-default rounded-full peer transition-all peer-focus:ring-2 peer-focus:ring-indigo-300 dark:peer-focus:ring-primaryYellow-light peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primaryYellow-default"></div>
						<span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
							Published By Me
						</span>
					</label>
				</div>

				<div>
					<button
						disabled={isSubmitting}
						type="button"
						onClick={handleApplyFilters}
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
						{isSubmitting ? 'Loading...' : 'Filter Results'}
					</button>
				</div>
			</fetcher.Form>
		</div>
	)
}
