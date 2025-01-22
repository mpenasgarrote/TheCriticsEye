import { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from 'react-router'
import { getAuthToken, getLoggedUserId } from '~/data/auth.server'
import { postProduct } from '~/data/products.server'
import { isValidProduct } from '~/data/validations.server'

export async function action({ request }: ActionFunctionArgs) {
	const authToken = await getAuthToken(request)
	const formData = await request.formData()

	const userId = (await getLoggedUserId(request)) as string
	const title = formData.get('title') as string
	const description = formData.get('description') as string
	const author = formData.get('author') as string
	const typeId = formData.get('typeId') as string
	const genresString = formData.get('genres') as string
	const genres = genresString ? genresString.split(',').map(Number) : []
	const image = formData.get('image') as File | null

	const errors = isValidProduct(
		title,
		description,
		author,
		Number(typeId),
		genres
	)

	if (Object.keys(errors).length > 0) {
		return errors
	}

	if (authToken) {
		try {
			await postProduct(
				{
					title: title,
					description: description,
					author: author,
					type_id: Number(typeId),
					genres: genres,
					user_id: Number(userId),
					image: image,
				},
				authToken
			)

			return redirect('/home')
		} catch (error) {
			return {
				ReviewError: {
					message: 'Failed to post product.',
				},
				status: 500,
			}
		}
	}
	return null
}
