import { Link } from '@remix-run/react'
import { Product } from '~/types/interfaces'
import { getScoreColor, typeColors } from '~/utils/utils'

export default function SearchProductCard({ product }: { product: Product }) {
	return (
		<Link
			key={product.id}
			to={`/product/details/${product.id}`}
			className={`block transition-opacity duration-500`}
		>
			<div
				key={product.id}
				className="px-4 py-2 hover:bg-primaryYellow-default hover:text-black hover:font-extrabold transition-all transition-200 cursor-pointer flex items-center justify-between gap-2"
				role="button"
				tabIndex={0}
				onClick={() => console.log(`Selected: ${product.title}`)}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						console.log(`Selected: ${product.title}`)
					}
				}}
			>
				<img
					src={product.image}
					alt={product.title}
					className="w-10 h-12 rounded-lg"
				/>
				<div>
					<span>{product.title}</span>
					<div className="w-fit">
						<p
							className={`${
								typeColors[product.type?.name ? product.type.name : '']
							} rounded-md px-1 py-1 text-sm italic text-white`}
						>
							{product.type ? product.type.name : ''}
						</p>
					</div>
				</div>

				<div
					className={`text-md py-1 px-2 ${getScoreColor(
						product.score ?? 0
					)} text-white font-bold rounded-lg ml-auto`}
				>
					<span>{product.score}</span>
				</div>
			</div>

			<hr className="border-primaryBlack-light mb-2" />
		</Link>
	)
}
