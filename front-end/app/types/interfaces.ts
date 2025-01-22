export type ValidationErrors = {
	title?: string
	amount?: string
	date?: string
}

export interface SignupInput {
	email_or_username: string
	password: string
}

export interface ShowErrors {
	title?: string
	code?: string
}

export interface Product {
	id: number
	title: string
	description: string
	type_id: number
	type?: Type
	genres?: Genre[]
	user_id: number
	author: string
	created_at: string
	updated_at: string
	image?: string
	score?: number
}

export interface Type {
	id: number
	name: string
	created_at: string
	updated_at: string
}

export interface Genre {
	id: number
	name: string
	created_at: string
	updated_at: string
}

export interface User {
	id: number
	name: string
	username: string
	email: string
	password: string
	image: string
	created_at: string
	updated_at: string
}
export interface Comment {
	id: number
	review_id: number
	user_id: number
	user?: User
	content: string
	created_at: string
	updated_at: string
}
export interface Review {
	id: number
	user_id: number
	user?: User
	title: string
	content: string
	score: number
	product_id: number
	product?: Product
	comments?: Comment[]
	created_at?: Date
	updated_at?: Date
}

export interface ReviewError {
	message?: string
}
