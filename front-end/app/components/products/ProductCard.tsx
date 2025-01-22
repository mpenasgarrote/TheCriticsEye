import { Product, User } from '~/types/interfaces'
import { genreColors, getScoreColor, typeColors } from '~/utils/utils'
import DeleteProduct from './DeleteProduct'
import { Link, useFetcher } from '@remix-run/react'
import EditProduct from './EditProduct'
import { useState } from 'react'
import EditProductModal from './EditProductModal'

export function ProductCard({
	product,
	userLogged,
}: {
	product: Product
	userLogged: User
}) {
	const fetcher = useFetcher()
	const isUserOwner = product.user_id === userLogged.id
	const [isModalOpen, setIsModalOpen] = useState(false)

	const openModal = () => setIsModalOpen(true)

	const closeModal = () => setIsModalOpen(false)

	return (
		<>
			{isModalOpen && (
				<EditProductModal onClose={closeModal} product={product} />
			)}

			<div className="relative w-64 mx-auto flex flex-col rounded-lg h-full overflow-hidden transform transition-transform transition-opacity opacity-100 hover:scale-105 animate-slide-down">
				{isUserOwner && (
					<div className="absolute top-2 right-2 z-10 flex bg-primaryBlack-light px-2 rounded-lg gap-4">
						<EditProduct
							product={product}
							fetcher={fetcher}
							onClick={() => openModal()}
						/>
						<DeleteProduct productId={product.id} fetcher={fetcher} />
					</div>
				)}

				<Link
					key={product.id}
					to={`/product/details/${product.id}`}
					className={`block transition-opacity duration-500`}
				>
					<div className="relative bg-white dark:bg-primaryBlack-light rounded-lg shadow-lg  flex flex-col h-full">
						<img
							src={product.image}
							alt={product.title}
							className="w-full h-48 object-cover"
						/>
						<div className="p-4 flex flex-col flex-grow">
							<div className="flex items-center gap-6 justify-between">
								<h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
									{product.title}
								</h2>
								<div>
									<p
										className={`${
											typeColors[product.type?.name ? product.type.name : '']
										} rounded-md px-2 py-1 text-xs italic text-white`}
									>
										{product.type ? product.type.name : ''}
									</p>
								</div>
							</div>
							<hr className="my-2" />
							<div className="mt-auto flex justify-between items-center">
								<div>
									{product.type && (
										<div className="flex gap-4 items-center">
											{product.genres?.map((genre) => (
												<p
													key={genre.id}
													className={`${
														genreColors[genre.name] || 'bg-primaryBlack-light'
													} justify-self-center mt-2 rounded-md px-2 py-1 text-xs font-bold text-white`}
												>
													{genre.name}
												</p>
											))}
										</div>
									)}
								</div>

								<div
									className={`text-lg py-2 px-4 ${getScoreColor(
										product.score ?? 0
									)} text-white font-bold rounded-lg ml-auto`}
								>
									<span>{product.score}</span>
								</div>
							</div>
						</div>
					</div>
				</Link>
			</div>
		</>
	)
}
