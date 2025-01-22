import { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
	// Recollim les películes de la api.
}

export default function Films() {
	const data = useLoaderData<{ message: string }>()

	return (
		<div>
			<h1>{data.message}</h1>
		</div>
	)
}
