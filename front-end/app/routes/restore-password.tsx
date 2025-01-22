import { ActionFunctionArgs, redirect } from '@remix-run/node'
import RecoverPassword from '~/components/auth/RecoverPassword'
import { sendPasswordResetRequest } from '~/data/auth.server'
import { isValidEmail } from '~/data/validations.server'

export default function Index() {
	return (
		<div>
			<RecoverPassword />
		</div>
	)
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData()

	const email = (await formData.get('email')) as string

	const isEmailOk = isValidEmail(email)

	if (!isEmailOk) {
		return {
			FormError: {
				message: 'This email is not valid.',
			},
			status: 400,
		}
	}

	try {
		const response = await sendPasswordResetRequest(email)

		if (response && response.status === 200) {
			return redirect('/login')
		} else {
			return {
				FormError: {
					message: 'Email could not be sent.',
				},
				status: 400,
			}
		}
	} catch (error) {
		return {
			FormError: {
				message: 'Something went wrong when sending an email.',
			},
			status: 400,
		}
	}
}
