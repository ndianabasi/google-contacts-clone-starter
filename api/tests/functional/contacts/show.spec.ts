import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { ContactFactory } from 'Database/factories'

test.group('Contacts show', (group) => {
  /**
   * reversible global transaction for each test
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return () => Database.rollbackGlobalTransaction()
  })

  // Write your test here

  test('fetch an existing contact by the contact`s ID', async ({ client, route }) => {
    const contact = await ContactFactory.query().create()

    const response = await client.get(route('ContactsController.show', { id: contact.id }))

    response.dumpBody()
    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        id: contact.id,
        firstName: contact.firstName,
        surname: contact.surname,
        email1: contact.email1,
        phoneNumber1: contact.phoneNumber1,
      },
    })
  })

  test('return 404 if the requested contact (by ID) does not exist', async ({ client, route }) => {
    const id = Math.random()
    const response = await client.get(route('ContactsController.show', { id: id }))

    response.dumpBody()
    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Unknown contact was requested',
    })
  })
})
