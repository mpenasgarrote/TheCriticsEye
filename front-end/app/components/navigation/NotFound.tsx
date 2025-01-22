export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center h-screen bg-primaryBlack-light text-primaryWhite-default">
			<h1 className="text-8xl font-bold mb-4">404</h1>
			<p className="text-2xl mb-6">
				The page you&apos;re looking for does not exist.
			</p>
			<a
				href="/"
				className="px-6 py-2 bg-primaryYellow-default text-primaryBlack-default rounded-md hover:bg-primaryYellow-light transition-all"
			>
				Go Home
			</a>
		</div>
	)
}
