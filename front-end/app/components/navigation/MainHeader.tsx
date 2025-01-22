import { NavLink, Form } from '@remix-run/react'
import { useState, useEffect } from 'react'
import { User } from '~/types/interfaces'
import PublishProductModal from '../products/PublishProductModal'
import Searchbar from './Searchbar'
import { ProfileModal } from '../profile/ProfileTab'

const MainHeader = ({ user }: { user: User }) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const [isProductModalOpen, setIsProductModalOpen] = useState(false)
	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)
	const [isDarkMode, setIsDarkMode] = useState(true)

	const openModal = () => setIsProductModalOpen(true)
	const closeModal = () => setIsProductModalOpen(false)

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) {
				setScrolled(true)
			} else {
				setScrolled(false)
			}
		}

		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	/*
		Dark Mode: 
		Utilitzem el useEffect per identficar quin es el mode actual de la pàgina.
	*/
	useEffect(() => {
		if (
			localStorage.getItem('theme') === 'dark' ||
			(!localStorage.getItem('theme') &&
				window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}, [])

	// Al apretar el botó, fem set al valor contrari per a canviar de mode. Utilitzem localStorage per guardar el mode i classList per aplicar-lo.
	const toggleTheme = () => {
		if (isDarkMode) {
			setIsDarkMode(false)
			localStorage.setItem('theme', 'light')
			document.documentElement.classList.remove('dark')
		} else {
			setIsDarkMode(true)
			localStorage.setItem('theme', 'dark')
			document.documentElement.classList.add('dark')
		}
	}

	return (
		<nav
			className={`${
				scrolled ? 'bg-primaryBlack-lighter' : 'bg-primaryBlack-default'
			} text-white px-6 py-4 shadow-md fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out`}
		>
			<div
				className={`flex flex-wrap items-center justify-between max-w-7xl mx-auto ${
					scrolled ? 'py-2' : 'py-4'
				} transition-all duration-300 ease-in-out`}
			>
				<NavLink
					to="/home"
					className={({ isActive }) =>
						isActive
							? 'text-2xl md:text-3xl font-extrabold tracking-wide text-center text-primaryYellow-default'
							: 'text-2xl md:text-3xl font-extrabold tracking-wide text-center text-primaryWhite-default'
					}
					end
				>
					<img
						src="/images/LogoCritics.png"
						alt="The Critic's Eye"
						className={`${
							scrolled ? 'h-10 md:h-12' : 'h-12 md:h-16'
						} hover:scale-110 transition-all duration-300 ease-in-out mx-auto`}
					/>
				</NavLink>

				<div className="flex items-center space-x-8">
					{['Movies', 'Games', 'Books'].map((item) => (
						<NavLink
							key={item}
							to={`/${item.toLowerCase()}`}
							className={({ isActive }) =>
								isActive
									? 'relative text-primaryYellow-default dark:text-primaryYellow-default text-lg font-medium transition-all duration-300 ease-in-out group'
									: 'relative text-primaryWhite-default dark:text-primaryWhite-default text-lg font-medium transition-all duration-300 ease-in-out group'
							}
							end
						>
							<span className="absolute inset-0 rounded-lg bg-primaryBlack-light transform scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-300 ease-in-out" />
							<span className="relative z-10 px-2 group-hover:text-primaryYellow-default">
								{item}
							</span>
						</NavLink>
					))}
				</div>

				<div className="flex items-center space-x-6 md:space-x-10 mt-4 md:mt-0">
					<Searchbar />

					<button
						onClick={openModal}
						className="transition-all duration-400 ease-in-out overflow-hidden transform transition-transform hover:scale-150 hover:text-primaryYellow-default"
					>
						<i className="bi bi-cloud-upload-fill mr-4 w-14 h-auto"></i>
					</button>

					<div className="relative">
						{user ? (
							<>
								<button
									onClick={() => setIsDropdownOpen(!isDropdownOpen)}
									className="w-auto h-auto"
								>
									<img
										src={
											user.image
												? user.image
												: 'https://res.cloudinary.com/dy4kmqtwc/image/upload/v1736026088/Critics%20Eye/gtdrnbhbsebjqt3vqnha.jpg'
										}
										alt="User Profile"
										className="w-20 h-14 rounded-full object-cover border border-primaryBlack-light transition-all duration-300 ease-in-out transform hover:scale-125 hover:border-primaryYellow-default"
									/>
								</button>
								<div
									className={`absolute left-1/2 dark:bg-primaryBlack-default transform -translate-x-1/2 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out ${
										isDropdownOpen
											? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
											: 'opacity-0 scale-95 translate-y-2 pointer-events-none'
									}`}
								>
									<ul className="py-2">
										<li className="px-4 py-2 w-full dark:bg-primaryBlack-default dark:text-primaryWhite-default dark:hover:text-primaryYellow-default dark:hover:bg-primaryBlack-light cursor-pointer block">
											<div className="flex items-center space-x-2">
												<label className="relative inline-flex items-center cursor-pointer">
													<input
														type="checkbox"
														checked={isDarkMode}
														onChange={toggleTheme}
														className="sr-only peer"
													/>
													<div className="w-11 h-6 bg-primaryWhite-default rounded-full peer transition-all peer-focus:ring-2 peer-focus:ring-indigo-300 dark:peer-focus:ring-primaryYellow-light peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primaryBlack-light"></div>
													<span className="ml-4 text-sm font-medium text-gray-900 dark:text-gray-300">
														{isDarkMode ? 'Dark' : 'Light'}
													</span>
												</label>
											</div>
										</li>

										<li className="px-4 py-2 w-full dark:bg-primaryBlack-default dark:text-primaryWhite-default dark:hover:text-primaryYellow-default dark:hover:bg-primaryBlack-light cursor-pointer block flex items-center">
											<i className="bi bi-person text-lg"></i>
											<button
												onClick={() => setIsProfileModalOpen(true)}
												className=""
											>
												<span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
													Profile
												</span>
											</button>
										</li>

										<li className="w-full">
											<Form method="post" action="/logout" className="w-full">
												<button
													type="submit"
													className="w-full text-left px-4 py-2 dark:bg-primaryBlack-default dark:text-primaryWhite-default dark:hover:text-primaryYellow-default dark:hover:bg-primaryBlack-light cursor-pointer block"
												>
													<i className="bi bi-box-arrow-right"></i>
													<span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
														Logout
													</span>
												</button>
											</Form>
										</li>
									</ul>
								</div>
							</>
						) : (
							<span className="font-medium text-lg">Not Logged</span>
						)}
					</div>
				</div>
			</div>

			{isProductModalOpen && <PublishProductModal onClose={closeModal} />}
			{isProfileModalOpen && (
				<ProfileModal
					onClose={() => setIsProfileModalOpen(false)}
					user={user}
				/>
			)}
		</nav>
	)
}

export default MainHeader
