import { useFetcher } from '@remix-run/react'
import { Genre, Product, User } from '~/types/interfaces'
import FilterMenu from './FilterMenu'
import ComponentLoader from '../navigation/ComponentLoader'
import DisplayProducts from './DisplayProducts'
import { useState } from 'react'

export default function FiltersPage({
	fetcher,
	user,
	genres,
	products,
	type,
	title,
}: {
	fetcher: ReturnType<typeof useFetcher>
	user: User
	genres: Genre[]
	products: Product[]
	type: number
	title: string
}) {
	const [showFilters, setShowFilters] = useState(false)

	return (
		<div className="container mx-auto max-w-screen-xl px-4">
			<div className="flex justify-between items-start">
				<h1 className="text-3xl font-semibold text-primaryBlack-default dark:text-primaryYellow-default">
					{title}
				</h1>

				<button
					className="mr-4 mt-4 text-primaryBlack-default hover:font-bold hover:text-primaryYellow-light hover:scale-150 transition-all duration-300 ease-in-out dark:text-primaryYellow-default rounded-full hover:bg-primaryBlue-dark transition-colors"
					aria-label="show filters"
					onClick={() => setShowFilters(!showFilters)}
				>
					<i
						className={`bi text-2xl ${
							showFilters ? 'bi-chevron-up' : 'bi-chevron-down'
						}`}
					/>
				</button>
			</div>

			{showFilters && (
				<div className="flex justify-center mt-4 animate-slide-down">
					<FilterMenu
						userLogged={user.id}
						fetcher={fetcher}
						type_id={type}
						genres={genres}
					/>
				</div>
			)}

			<hr className="border-2 border-primaryYellow-default mb-6 mt-6" />
			<div>
				<ComponentLoader fetcher={fetcher} />
				<DisplayProducts products={products} userLogged={user} />
			</div>
		</div>
	)
}
