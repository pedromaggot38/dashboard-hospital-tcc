/**
* Array de rotas publicas, acessíveis por todos
* Rotas que não precisam de autenticação
* @type {string[]}
*/
export const publicRoutes = [
  '/'
]

/**
* Rotas usadas para autenticação
* Rotas irão redirecionar usuários logados para /dashboard
* @type {string[]}
*/

export const authRoutes = [
  '/',
  '/password-recovery'
]

/**
* API - Prefixo das rotas de autenticação
* Rotas que iniciam com este prefixo serão usadas para autenticação
*  @type {string}
*/
export const apiAuthPrefix = '/api/auth'

/**
* Rota padrão para redirecionamento após o login
  @type {string}
*/
export const DEFAULT_LOGIN_REDIRECT = '/dashboard'