import { useNavigation } from '@remix-run/react'

const Loader = () => {
	const navigation = useNavigation()

	return (
		<>
			{navigation.state === 'loading' && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="loader border-t-4 border-b-4 border-primaryYellow-default rounded-full w-16 h-16 animate-spin"></div>
				</div>
			)}
		</>
	)
}

export default Loader
