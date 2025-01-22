export default function NoResults() {
	return (
		<div className="flex flex-col items-center justify-center p-8 bg-primaryBlack-light rounded-lg shadow-lg">
			<i className="bi bi-emoji-frown text-6xl text-primaryYellow-light mb-4"></i>
			<p className="text-2xl font-semibold text-primaryBlack-default dark:text-primaryWhite-default mb-2">
				Oops!
			</p>
			<p className="text-lg text-primaryBlack-default dark:text-primaryWhite-default">
				No results were found.
			</p>
		</div>
	)
}
