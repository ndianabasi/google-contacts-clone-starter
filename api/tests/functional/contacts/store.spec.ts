import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { file } from '@ioc:Adonis/Core/Helpers'
import { ContactFactory } from 'Database/factories'
import Drive from '@ioc:Adonis/Core/Drive'
import { faker } from '@faker-js/faker'
import Contact from 'App/Models/Contact'

test.group('Contacts store', (group) => {
  /**
   * reversible global transaction for each test
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return () => Database.rollbackGlobalTransaction()
  })

  // Write your test here

  test('create a new contact with the required fields', async ({ client, route }) => {
    // const response = await client.post('/contacts')
    const response = await client.post(route('ContactsController.store')).form({
      firstName: 'Initial',
      surname: 'Test',
      email1: 'example@email.com',
      phoneNumber1: '+22 565 575 453',
    })

    response.dumpBody()
    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Contact was created.',
    })
  })

  test('create a new contact with a profile picture, and persist image to drive', async ({
    client,
    route,
    assert,
  }) => {
    // const response = await client.post('/contacts')

    const fakeDrive = Drive.fake()

    const { contents, name } = await file.generateJpg('300kb')
    const response = await client
      .post(route('ContactsController.store'))
      .fields({
        firstName: 'Initial',
        surname: 'Test',
        email1: 'example@email.com',
        phoneNumber1: '+22 565 575 453',
      })
      .file('profilePicture', contents, { filename: name })

    response.dumpBody()
    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Contact was created.',
    })

    assert.isTrue(await fakeDrive.exists(name))
  })

  test('return 422 if the contact`s profile picture properties are invalid before creating a new contact', async ({
    client,
    route,
    assert,
  }) => {
    // const response = await client.post('/contacts')

    const fakeDrive = Drive.fake()

    const { contents, name } = await file.generatePdf('2mb')
    const response = await client
      .post(route('ContactsController.store'))
      .fields({
        firstName: 'Initial',
        surname: 'Test',
        email1: 'example@email.com',
        phoneNumber1: '+22 565 575 453',
      })
      .file('profilePicture', contents, { filename: name })

    response.dumpBody()
    response.assertStatus(422)
    response.assertBodyContains({
      message: 'An error occured while creating the contact.',
      error: {
        messages: {
          errors: [
            { message: 'Invalid file extension pdf. Only jpg, png, webp, gif are allowed' },
            { message: 'File size should be less than 500KB' },
          ],
        },
      },
    })

    assert.isFalse(await fakeDrive.exists(name))
  })

  test('return 422 if the required fields are empty while creating a new contact', async ({
    client,
    route,
  }) => {
    // const response = await client.post('/contacts')
    const response = await client.post(route('ContactsController.store'))

    response.dumpBody()
    response.assertStatus(422)
    response.assertBodyContains({
      message: 'An error occured while creating the contact.',
      error: {
        messages: {
          errors: [
            { message: 'First Name is required.' },
            { message: 'Surname is required.' },
            { message: 'Email 1 is required.' },
            { message: 'Phone number 1 is required' },
          ],
        },
      },
    })
  })

  test('return 422 if the email is not unique before creating a new contact', async ({
    client,
    route,
  }) => {
    await Contact.query().delete()
    const contact = await ContactFactory.query().create()
    // const response = await client.post('/contacts')

    const response = await client.post(route('ContactsController.store')).fields({
      firstName: 'Initial',
      surname: 'Test',
      email1: contact.email1,
      phoneNumber1: '+22 565 575 453',
    })

    response.dumpBody()
    response.assertStatus(422)
    response.assertBodyContains({
      message: 'An error occured while creating the contact.',
      error: {
        messages: {
          errors: [{ message: 'Email 1 is already registered in your contacts.' }],
        },
      },
    })
  })

  test('return 422 if the maximum length rule is not obeyed when creating a new contact for fields where it applies', async ({
    client,
    route,
  }) => {
    const exceedMaxLength = (minLength) => {
      return faker.random.alpha(minLength)
    }
    const response = await client.post(route('ContactsController.store')).fields({
      firstName: faker.person.firstName() + exceedMaxLength(30),
      surname: faker.person.lastName() + exceedMaxLength(30),
      email1: faker.internet.email(),
      phoneNumber1: faker.phone.number(),
      country: faker.address.country() + exceedMaxLength(25),
    })

    response.dumpBody()
    response.assertStatus(422)
    response.assertBodyContains({
      message: 'An error occured while creating the contact.',
      error: {
        messages: {
          errors: [
            { message: 'First Name should be the maximum of 30 characters.' },
            { message: 'Surname should be maximum of 30 characters.' },
            { message: 'Country should be maximum of 25 characters.' },
          ],
        },
      },
    })
  })

  test('return 422 if the contact`s birthday field is not a past date, when creating a new contact', async ({
    client,
    route,
  }) => {
    const formatDate = (date: Date): string => {
      const year = date.getFullYear() // get year
      const month = String(date.getMonth() + 1).padStart(2, '0') // get month in 2 digits
      const day = String(date.getDate()).padStart(2, '0') // get dayin 2 digits

      return `${year}-${month}-${day}` // return `yyyy-MM-dd` format
    }
    const response = await client.post(route('ContactsController.store')).fields({
      firstName: faker.person.firstName(),
      surname: faker.person.lastName(),
      email1: faker.internet.email(),
      phoneNumber1: '+22 5656 645 4',
      birthday: formatDate(faker.date.future()),
    })

    response.dumpBody()
    response.assertStatus(422)
    response.assertBodyContains({
      message: 'An error occured while creating the contact.',
      error: {
        messages: {
          errors: [{ message: "Birthday must be before 'today'." }],
        },
      },
    })
  })

  test('return 422 if the contact`s birthday field is of an invaid farmat, when creating a new user', async ({
    client,
    route,
  }) => {
    const response = await client.post(route('ContactsController.store')).fields({
      firstName: faker.person.firstName(),
      surname: faker.person.lastName(),
      email1: faker.internet.email(),
      phoneNumber1: '+22 5656 645 4',
      birthday: faker.date.future().toISOString(),
    })

    response.dump()
    response.assertStatus(422)
    response.assertBodyContains({
      message: 'An error occured while creating the contact.',
      error: {
        messages: {
          errors: [],
        },
      },
    })
  })
})
