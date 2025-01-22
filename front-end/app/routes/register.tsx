import { ActionFunctionArgs } from '@remix-run/node'
import SignupForm from '~/components/auth/SignupForm'
import { signup } from '~/data/auth.server'
import { validateSignupCredentials } from '~/data/validations.server'

export default function Index() {
	return (
		<div>
			<SignupForm />
		</div>
	)
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()

	const name = formData.get('name') as string
	const username = formData.get('username') as string
	const email = formData.get('email') as string
	const password = formData.get('password') as string
	const confirmPassword = formData.get('confirmPassword') as string
	const image = formData.get('image') as File | null

	if (!name || !username || !email || !password || !confirmPassword) {
		return {
			validationErrors: {
				name: !name ? 'Name is required' : undefined,
				username: !username ? 'Username is required' : undefined,
				email: !email ? 'Email is required' : undefined,
				password: !password ? 'Password is required' : undefined,
				confirmPassword: !confirmPassword
					? 'Confirm Password is required'
					: undefined,
			},
			status: 400,
		}
	}

	const validationErrors = validateSignupCredentials({
		name,
		username,
		email,
		password,
		confirmPassword,
	})
	if (validationErrors) {
		return validationErrors
	}

	try {
		return await signup(name, username, email, password, confirmPassword, image)
	} catch (error) {
		return error
	}
}
