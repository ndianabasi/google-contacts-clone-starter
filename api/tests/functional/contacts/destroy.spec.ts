import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { ContactFactory } from 'Database/factories'

test.group('Contacts destroy', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return () => Database.rollbackGlobalTransaction()
  })

  // Write your test here
  test('delete an existing contact by the contact`s ID', async ({ client, route }) => {
    const contact = await ContactFactory.query().create()

    const response = await client.delete(route('ContactsController.destroy', { id: contact.id }))

    response.dumpBody()
    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Contact was deleted',
      data: contact.id,
    })
  })

  test('return 404 if the requested ID for deletion does not exist', async ({ client, route }) => {
    const id = Math.random()

    const response = await client.delete(route('ContactsController.destroy', { id: id }))

    response.dumpBody()
    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Unknown contact was requested',
    })
  })
})
