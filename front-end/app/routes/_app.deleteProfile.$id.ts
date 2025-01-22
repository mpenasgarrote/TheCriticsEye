import { ActionFunctionArgs } from '@remix-run/node'
import { getAuthToken, logout } from '~/data/auth.server'
import { deleteUserById } from '~/data/users.server'

export async function action({ request, params }: ActionFunctionArgs) {
	const authToken = (await getAuthToken(request)) as string

	const userId = params.id as string

	try {
		console.log('hoal')

		const response = await deleteUserById(Number(userId), authToken)

		if (response === 200) {
			return logout(request)
		}

		return { error: 'An error ocurred when deleting an user' }
	} catch (error) {
		return { error: 'Unexpected error.' }
	}
}
