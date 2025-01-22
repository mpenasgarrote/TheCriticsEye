import { ActionFunctionArgs } from '@remix-run/node'
import { getAuthToken } from '~/data/auth.server'
import { getUserById, updateUser } from '~/data/users.server'

export async function action({ request, params }: ActionFunctionArgs) {
	const authToken = (await getAuthToken(request)) as string
	const formData = await request.formData()

	const userId = params.id as string

	if (!userId) {
		throw new Error('user ID is required')
	}

	const username = formData.get('username') as string
	const name = formData.get('name') as string
	const email = formData.get('email') as string
	const image = formData.get('image') as File | null

	if (!username || !name || !email) {
		return {
			Error: { message: 'Please, do not leave any empty fields. ' },
		}
	}

	try {
		const updatedUser = await updateUser(
			{
				id: Number(userId),
				username: username,
				name: name,
				email: email,
				image: image ?? null,
			},
			authToken
		)

		if (updatedUser) {
			const user = await getUserById(Number(userId), authToken)
			return { user: user }
		}
	} catch (error) {
		return {
			error: error,
			status: 500,
		}
	}
}
