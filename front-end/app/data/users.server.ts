import axios from 'axios'
import { User } from '~/types/interfaces'

const apiUrl = process.env.API_URL

export async function getUserById(
	user_id: number,
	authToken: string
): Promise<User> {
	try {
		const response = await axios.get(`${apiUrl}/api/users/${user_id}`, {
			headers: {
				Authorization: `Bearer ${authToken}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			withCredentials: true,
		})

		const user: User = (await response.data.user) as User

		return user
	} catch (error) {
		console.error(error)

		throw error
	}
}

export async function deleteUserById(user_id: number, authToken: string) {
	const response = await axios.delete(`${apiUrl}/api/users/${user_id}`, {
		headers: {
			Authorization: `Bearer ${authToken}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		withCredentials: true,
	})

	console.log('Response: ', response.data)
	if (response.status === 200) {
		console.log('User Deleted Succesfully.', response.data)

		return 200
	} else {
		console.error('An error has occured when deleting a review.')

		return 400
	}
}

export async function updateUser(
	{
		id,
		name,
		email,
		username,
		image,
	}: {
		id: number
		name: string
		email: string
		username: string
		image: File | null
	},
	authToken: string
) {
	const response = await axios.patch(
		`${apiUrl}/api/users/${id}`,
		{ name, email, username },
		{
			headers: {
				Authorization: `Bearer ${authToken}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			withCredentials: true,
		}
	)

	if (response.status !== 200) {
		throw new Error(`Failed to update user ${id}. Status: ${response.status}`)
	}

	if (image) {
		checkImage(id, image, authToken)
	}

	return true
}

async function checkImage(
	user_id: number,
	image: File | string,
	authToken: string
) {
	const product = await getUserById(user_id, authToken)

	if (product?.image === image) {
		return null
	}

	if (image instanceof File) {
		uploadUserImage(user_id, image, authToken)
	} else {
		console.error('Invalid image type. Expected a File.')
	}
}

async function uploadUserImage(userId: number, image: File, authToken: string) {
	try {
		const formData = new FormData()
		formData.append('user_id', userId.toString())
		formData.append('image', image)

		const uploadImage = await axios.post(
			`${apiUrl}/api/uploadProfileImage`,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${authToken}`,
				},
				withCredentials: true,
			}
		)

		console.log('Image Uploaded Successfully: ' + uploadImage.data.url)
		return uploadImage.data.url
	} catch (error) {
		console.error('Error when uploading image:', error)
	}
}

export async function updatePassword(
	id: number,
	newPassword: string,
	authToken: string
) {
	try {
		const response = await axios.patch(
			`${apiUrl}/api/users/${id}`,
			{ password: newPassword },
			{
				headers: {
					Authorization: `Bearer ${authToken}`,
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				withCredentials: true,
			}
		)

		if (response.status === 200) {
			return {
				message: 'Password updated succesfully',
				status: 200,
			}
		}
	} catch (error) {
		return {
			message: 'En error occurred when updating password: ',
			error,
			status: 400,
		}
	}
}
