import { createCookieSessionStorage } from '@remix-run/node'
import { redirect } from '@remix-run/react'
import axios from 'axios'
import { SignupInput, ShowErrors, User } from '~/types/interfaces'

const apiUrl = process.env.API_URL

export const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: 'authToken',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production' ? true : false,
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 24 * 7,
	},
})

export async function login({ email_or_username, password }: SignupInput) {
	const response = await axios.post(
		`${apiUrl}/api/login`,
		{ email_or_username, password },
		{
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			withCredentials: true,
		}
	)

	if (response.status === 200 && response.data?.token) {
		const userId = response.data.user.id

		const authToken = response.data.token

		return await createUserSession(userId, authToken, '/home')
	} else {
		const validationErr: ShowErrors = {
			title: 'Invalid login credentials',
			code: '401',
		}

		throw validationErr
	}
}

async function createUserSession(
	user_id: string,
	authToken: string,
	redirectPath: string
) {
	const session = await sessionStorage.getSession()

	session.set('user_id', user_id)
	session.set('authToken', authToken)

	return redirect(redirectPath, {
		headers: {
			'Set-Cookie': await sessionStorage.commitSession(session),
		},
	})
}

export async function signup(
	name: string,
	username: string,
	email: string,
	password: string,
	password_confirmation: string,
	image: File | null
) {
	try {
		const response = await axios.post(
			`${apiUrl}/api/register`,
			{ name, username, email, password, password_confirmation },
			{
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				withCredentials: true,
			}
		)

		if (response.status === 200) {
			const userId = response.data.user.id
			const authToken = response.data.token

			if (image) {
				uploadProfileImage(userId, image)
			}

			return createUserSession(userId, authToken, '/home')
		} else {
			return {
				error: {
					message: response.data,
					code: response.status,
				},
			}
		}
	} catch (error) {
		return error
	}
}

async function uploadProfileImage(userId: number, image: File) {
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

export async function getAuthToken(request: Request): Promise<string | null> {
	const cookieHeader = request.headers.get('Cookie')
	if (!cookieHeader) return null

	const session = await sessionStorage.getSession(cookieHeader)

	const authToken = session.get('authToken')

	return authToken || null
}

export async function getLoggedUserId(
	request: Request
): Promise<string | null> {
	const cookieHeader = request.headers.get('Cookie')

	if (!cookieHeader) return null

	const session = await sessionStorage.getSession(cookieHeader)

	const userId = session.get('user_id')

	return userId || null
}

export async function logout(request: Request) {
	try {
		const session = await sessionStorage.getSession(
			request.headers.get('Cookie')
		)

		session.set('user_id', null)
		session.set('authToken', null)

		const cookie = await sessionStorage.commitSession(session)

		return redirect('/login', {
			headers: {
				'Set-Cookie': cookie,
			},
		})
	} catch (error) {
		console.error('error during logout: ' + error)
		return redirect('/home')
	}
}

export async function getLoggedUser(request: Request, authToken: string) {
	if (!authToken) return null

	const response = await axios.get(apiUrl + '/api/user', {
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
	})

	return response.data as User
}

export async function sendPasswordResetRequest(email: string) {
	try {
		const response = await axios.post(
			`${apiUrl}/api/sendPasswordReset`,
			{ email },
			{
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				withCredentials: true,
			}
		)

		if (response.status === 200) {
			return {
				message: response.data.message,
				status: response.status,
			}
		}
	} catch (error) {
		return {
			message: 'Something went wrong' + error,
		}
	}
}
