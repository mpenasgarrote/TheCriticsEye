import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { getAuthToken } from '~/data/auth.server'
import { deleteProductById } from '~/data/products.server'

export async function action({ request }: ActionFunctionArgs) {
	const authToken = (await getAuthToken(request)) as string
	const formData = await request.formData()

	const productId = formData.get('productId') as string

	try {
		await deleteProductById(Number(productId), authToken)

		return redirect('/home')
	} catch (error) {
		return { message: 'Product could not be deleted.' }
	}
}
