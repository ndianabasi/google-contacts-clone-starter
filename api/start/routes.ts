/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.get('/', async () => {
  return { hello: 'world' }
})

/**
 * Health check
 */
Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})

/**
 * Create a new contact
 */
Route.post('/contacts', 'ContactsController.store')

/**
 * Edit an existing contact
 */
Route.put('/contacts/:id', 'ContactsController.update').middleware(['findContact'])

/**
 * Fetch an existing contact
 */
Route.get('/contacts/:id', 'ContactsController.show').middleware(['findContact'])

/**
 * Delete an existing contact
 */
Route.delete('contacts/:id', 'ContactsController.destroy').middleware(['findContact'])

/**
 * Fetch users via pagisntion
 */
Route.get('/contacts', 'ContactsController.index')
