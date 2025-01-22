import { ActionFunctionArgs } from '@remix-run/node'
import LoginForm from '../components/auth/LoginForm'
import { validateLoginCredentials } from '~/data/validations.server'
import { login } from '~/data/auth.server'

export default function Index() {
	return (
		<div>
			<LoginForm />
		</div>
	)
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()
	const username = formData.get('username') as string
	const password = formData.get('password') as string

	if (!username || !password) {
		return {
			validationErrors: {
				username: 'Email is required',
				password: 'Password is required',
			},
			status: 400,
		}
	}

	if (validateLoginCredentials({ username, password })) {
		return validateLoginCredentials({ username, password })
	}

	try {
		return await login({ email_or_username: username, password })
	} catch (error: unknown) {
		return error
	}
}
