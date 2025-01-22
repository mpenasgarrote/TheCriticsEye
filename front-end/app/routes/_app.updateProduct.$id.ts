import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { getAuthToken } from '~/data/auth.server'
import { updateProductById } from '~/data/products.server'

export async function action({ request, params }: ActionFunctionArgs) {
	const authToken = (await getAuthToken(request)) as string
	const formData = await request.formData()

	const productId = params.id as string

	if (!productId) {
		throw new Error('Product ID is required')
	}

	const title: string = (await formData.get('title')) as string
	const description: string = (await formData.get('description')) as string
	const author: string = (await formData.get('author')) as string
	const typeId = formData.get('typeId')
	const genresString = formData.get('genres') as string
	const genres = genresString ? genresString.split(',').map(Number) : []
	const image = formData.get('image') as File | null
	const product = {
		id: Number(productId),
		title: title,
		description: description,
		author: author,
		type_id: Number(typeId),
		genres: genres,
		image: image,
	}

	console.log('Product: ', product)
	if (!title || !description || !author || !typeId || !genres) {
		return {
			Error: { message: 'Please, do not leave any empty fields. ' },
		}
	}

	try {
		const updateProduct = await updateProductById(product, authToken)

		if (updateProduct) {
			return redirect('/home')
		}
	} catch (error) {
		return {
			error: error,
			status: 500,
		}
	}
}
