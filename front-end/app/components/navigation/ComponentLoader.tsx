import { useFetcher } from '@remix-run/react'

interface ComponentLoaderProps {
	fetcher: ReturnType<typeof useFetcher>
}

const ComponentLoader = ({ fetcher }: ComponentLoaderProps) => {
	const isLoading = fetcher.state === 'loading'

	if (!isLoading) return null

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="loader border-t-4 border-b-4 border-primaryYellow-default rounded-full w-16 h-16 animate-spin"></div>
		</div>
	)
}

export default ComponentLoader
