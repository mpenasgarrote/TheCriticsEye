import type { LoaderFunction } from '@remix-run/node'
import { getAuthToken } from '~/data/auth.server'
import { getTypes } from '~/data/products.server'

export const loader: LoaderFunction = async ({ request }) => {
	const authToken = (await getAuthToken(request)) as string
	const types = await getTypes(authToken)
	return types
}
