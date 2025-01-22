import { Link } from '@remix-run/react'

const MainFooter: React.FC = () => {
	return (
		<footer className="mt-10 bg-primaryBlack-default text-primaryWhite-default px-6 py-4 shadow-inner">
			<div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
				<div className="flex-shrink-0 mx-auto md:mx-0 text-center md:text-left">
					<p className="text-sm md:text-base font-medium">
						&copy; {new Date().getFullYear()} |{' '}
						<strong>The Critic&apos;s Eye.</strong> All rights reserved.
					</p>
				</div>

				<div className="flex items-center space-x-6 md:space-x-14 mt-4 md:mt-0">
					<Link
						to="/about"
						className="text-primaryWhite-default hover:text-primaryYellow-default text-sm font-medium transition-colors"
					>
						About
					</Link>
					<Link
						to="/contact"
						className="text-primaryWhite-default hover:text-primaryYellow-default text-sm font-medium transition-colors"
					>
						Contact
					</Link>
					<Link
						to="/privacy"
						className="text-primaryWhite-default hover:text-primaryYellow-default text-sm font-medium transition-colors"
					>
						Privacy Policy
					</Link>
				</div>

				<div className="flex items-center space-x-4 mt-4 md:mt-0">
					<a
						href="https://facebook.com"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-primaryYellow-default text-primaryWhite-default transition-colors"
					>
						<i className="bi bi-facebook text-lg"></i>
					</a>
					<a
						href="https://twitter.com"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-primaryYellow-default text-primaryWhite-default transition-colors"
					>
						<i className="bi bi-twitter text-lg"></i>
					</a>
					<a
						href="https://instagram.com"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-primaryYellow-default text-primaryWhite-default transition-colors"
					>
						<i className="bi bi-instagram text-lg"></i>
					</a>
				</div>
			</div>
		</footer>
	)
}

export default MainFooter
