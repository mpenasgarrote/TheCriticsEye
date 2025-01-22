// app/routes/logout.ts
import { logout } from '~/data/auth.server'

export const action = async ({ request }: { request: Request }) => {
    return logout(request)
}
