import { ActionFunctionArgs, redirect } from '@remix-run/node'
import ResetPasswordForm from '~/components/auth/ResetPasswordForm'
import { getLoggedUser } from '~/data/auth.server'
import { updatePassword } from '~/data/users.server'
import { isValidPassword } from '~/data/validations.server'

export default function Index() {
	return (
		<>
			<ResetPasswordForm />
		</>
	)
}

export async function action({ request, params }: ActionFunctionArgs) {
	const formData = await request.formData()

	const authToken = params.token

	if (!authToken) {
		return redirect('/login')
	}

	const user = await getLoggedUser(request, authToken)

	if (!user) {
		return {
			FormError: {
				general: {
					message: 'Could not find any user with your credentials',
				},
			},
			status: 404,
		}
	}
	const password = formData.get('password') as string
	const passwordRepeat = formData.get('passwordRepeat') as string

	if (password !== passwordRepeat) {
		console.log('hola')
		return {
			FormError: {
				repeat: {
					message: 'Passwords must be equal',
				},
			},
			status: 400,
		}
	}

	if (!isValidPassword(password)) {
		return {
			FormError: {
				password: {
					message: 'Password must be at least 8 characters long.',
				},
			},
			status: 400,
		}
	}

	try {
		const response = await updatePassword(user?.id, password, authToken)

		if (response?.status === 200) {
			console.log('Password Updated')
			return redirect('/login')
		}

		return {
			FormError: {
				message: "Password wasn't updated.",
			},
			status: 400,
		}
	} catch (error) {
		return {
			FormError: {
				general: {
					message:
						'Something happened when updating password: ' +
						(error as Error).message,
				},
			},
			status: 400,
		}
	}
}
