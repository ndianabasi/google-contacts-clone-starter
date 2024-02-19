import Route from '@ioc:Adonis/Core/Route'

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
