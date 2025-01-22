import { useFetcher } from '@remix-run/react'
import { useState } from 'react'
import { Product } from '~/types/interfaces'
import ComponentLoader from './ComponentLoader'
import SearchProductCard from '../products/SearchProductCard'

export default function Searchbar() {
	const [searchQuery, setSearchQuery] = useState('')
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)

	const fetcher = useFetcher()

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const query = e.target.value
		setSearchQuery(query)

		if (query.trim() !== '') {
			fetcher.load(`/search/${query}`)
		}
	}

	const results: Product[] =
		(fetcher.data as { results: Product[] })?.results || []

	return (
		<div className="relative w-full max-w-xs">
			<input
				type="text"
				value={searchQuery}
				onChange={handleSearchChange}
				onFocus={() => setIsDropdownOpen(true)}
				onBlur={() => {
					setTimeout(() => setIsDropdownOpen(false), 200)
				}}
				placeholder="Search..."
				className={`bg-primaryBlack-light text-sm w-full rounded-full pl-12 pr-5 py-2.5 focus:outline-none focus:font-bold transition-all duration-300 ease-in-out focus:scale-105 focus:ring-2 focus:ring-primaryBlack-light dark:focus:bg-primaryBlack-default focus:text-primaryBlack-default dark:focus:text-primaryWhite-default ${
					fetcher.state === 'loading'
						? 'animate-pulse bg-primaryYellow-default'
						: ''
				}`}
			/>

			<span
				className={`absolute inset-y-0 flex items-center transition-all duration-300 ease-in-out left-4 ${
					isDropdownOpen
						? 'scale-105 opacity-100 left-2'
						: 'scale-75 opacity-50'
				} ${fetcher.state === 'loading' ? 'animate-pulse' : ''}`}
			>
				<i className="bi bi-search text-primaryWhite-default"></i>
			</span>

			{isDropdownOpen && (
				<div className="absolute left-0 right-0 bg-primaryWhite-default dark:bg-primaryBlack-default shadow-lg rounded-lg mt-2 z-50 max-h-60 overflow-y-auto">

					{results.map((result: Product) => (
						<SearchProductCard key={result.id} product={result} />
					))}
				</div>
			)}
		</div>
	)
}
