import { Product, User } from '~/types/interfaces'
import { ProductCard } from '../products/ProductCard'
import NoResults from './NoResults'

export default function DisplayProducts({
	products,
	userLogged,
}: {
	products: Product[]
	userLogged: User
}) {
	return (
		<>
			{products.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
					{products.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							userLogged={userLogged}
						/>
					))}
				</div>
			) : (
				<NoResults />
			)}
		</>
	)
}
