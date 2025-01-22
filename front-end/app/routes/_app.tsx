import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import Loader from '~/components/navigation/Loader'
import MainFooter from '~/components/navigation/MainFooter'
import MainHeader from '~/components/navigation/MainHeader'
import { getAuthToken, getLoggedUser } from '~/data/auth.server'
import { User } from '~/types/interfaces'

export async function loader({ request }: LoaderFunctionArgs) {
	const authToken = await getAuthToken(request)

	if (!authToken) {
		return redirect('/login')
	}

	const user = getLoggedUser(request, authToken)

	if (!user) {
		return redirect('/login')
	}

	return user
}

export default function MainPageLayout(): JSX.Element {
	const user = useLoaderData<User>()

	return (
		<><title>The Critic&apos;s Eye</title><div className="flex flex-col min-h-screen">
			<link
				href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
				rel="stylesheet" />
			<Loader />
			<MainHeader user={user} />
			<main className="flex-grow pt-40">
				{' '}
				<Outlet />
			</main>
			<MainFooter />
		</div></>
	)
}

// export function CatchBoundary() {
// 	const caught = useCatch()

// 	if (caught.status === 404) {
// 		return <NotFound />
// 	}

// 	return (
// 		<div>
// 			<h1>Error</h1>
// 		</div>
// 	)
// }

// export function ErrorBoundary({ error }: { error: Error }) {
// 	return (
// 		<div>
// 			<h1>Something went wrong</h1>
// 		</div>
// 	)
// }
// function useCatch() {
// 	return { status: 404 }
// }
