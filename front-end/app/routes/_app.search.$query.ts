import type { LoaderFunction } from '@remix-run/node'
import { getAuthToken } from '~/data/auth.server'
import { querySearch } from '~/data/filters.server'

export const loader: LoaderFunction = async ({ request, params }) => {
	const authToken = (await getAuthToken(request)) as string
	const query = params.query as string

	if (!query) {
		return { results: [] }
	}

	const results = await querySearch(query, authToken)

	if ('errors' in results) {
		return { results: [] }
	}

	return { results: results }
}
