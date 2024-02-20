import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { ContactFactory } from 'Database/factories'
import Drive from '@ioc:Adonis/Core/Drive'
import { file } from '@ioc:Adonis/Core/Helpers'
import Contact from 'App/Models/Contact'

test.group('Contacts update', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return () => Database.rollbackGlobalTransaction()
  })

  // Write your test here

  test('Edit an existing contact via the contact`s ID', async ({ client, route }) => {
    await Contact.query().delete()

    const contact = await ContactFactory.query().create()
    const updatedContact = {
      firstName: 'Test',
      surname: 'Contact',
      email1: 'example@contact.com',
      phoneNumber1: '+22 454 4546 454',
    }
    const response = await client
      .put(route('ContactsController.update', { id: contact.id }))
      .form(updatedContact)

    response.dumpBody()
    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Contact was edited',
      data: contact.id,
    })
  })

  test('return 404 if the requested ID to be deleted does not exist on the database', async ({
    client,
    route,
  }) => {
    await Contact.query().delete()

    const id = Math.random()
    const response = await client.delete(route('ContactsController.update', { id: id }))

    response.dumpBody()
    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Unknown contact was requested',
    })
  })

  test('edit/update a contact`s profile picture via the contact`s ID', async ({
    route,
    client,
    assert,
  }) => {
    const fakeDrive = Drive.fake()
    const { contents, name } = await file.generateJpg('100kb')

    const contact = await ContactFactory.query().create()
    const response = await client
      .put(route('ContactsController.update', { id: contact.id }))
      .fields({
        firstName: 'Test',
        surname: 'Contact',
        email1: 'contact@test.com',
        phoneNumber1: '+22 564 6454 454',
      })
      .file('profilePicture', contents, { filename: name })

    console.log(`response text: ${response.text}`)
    console.log(`response body: ${response.body.toString}`)

    response.dumpBody()
    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Contact was edited',
      data: contact.id,
    })

    assert.isTrue(await fakeDrive.exists(name))
  })
})
