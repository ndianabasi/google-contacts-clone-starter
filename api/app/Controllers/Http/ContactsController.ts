import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Contact from 'App/Models/Contact'
import ContactValidator from 'App/Validators/ContactValidator'
import Logger from '@ioc:Adonis/Core/Logger'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'

export default class ContactsController {
  /**
   * method for GET request
   *
   * Fetch contacts via pagination
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const { page, perPage } = request.qs()

      const contacts = await Contact.query()
        .select([
          'id',
          'first_name',
          'surname',
          'email1',
          'phone_number1',
          'company',
          'job_title',
          'profile_picture',
        ])
        .orderBy('first_name', 'asc')
        .paginate(page, perPage)

      return response.ok({ data: contacts })
    } catch (error) {
      Logger.error('Error at ContactsController.list:\n%o', error)

      return response.status(error?.status ?? 500).json({
        message: 'An error occurred while fetching the contacts.',
        error: process.env.NODE_ENV !== 'production' ? error : null,
      })
    }
  }

  /**
   * method for POST request
   *
   * Create a new contact
   */
  public async store({ request, response }: HttpContextContract) {
    // const payload = request.body();

    try {
      const payload = await request.validate(ContactValidator)

      /**
       * It is important to destructure and obtain the
       * individual properties which we want to insert
       * into our the table.
       *
       * You do not want malicious actors to try to
       * overwrite the `id` or `created_at` or
       * `updated_at` by including those in the payload
       *
       * So, the statement below is discouraged as it is
       * dangerous
       *
       * `await Contact.create(payload)`
       *
       * Again, destructure the `payload` as done
       * below, no matter how many properties are there
       * in the payload
       */
      const {
        firstName,
        surname,
        company,
        jobTitle,
        email1,
        email2,
        phoneNumber1,
        phoneNumber2,
        country,
        streetAddressLine1,
        streetAddressLine2,
        city,
        postCode,
        state,
        birthday,
        website,
        notes,
        profilePicture,
      } = payload

      /**
       * create a new contact
       */
      const contact = await Contact.create({
        firstName,
        surname,
        company,
        jobTitle,
        email1,
        email2,
        phoneNumber1,
        phoneNumber2,
        country,
        streetAddressLine1,
        streetAddressLine2,
        city,
        postCode,
        state,
        birthday,
        website,
        notes,
        profilePicture: profilePicture ? Attachment.fromFile(profilePicture) : null,
      })

      /**
       * Refreshing the `contact moedl before returning
       * it as the payload of the response is important
       *
       * If not refreshed, only the actual/few properties
       * which were inserted will be returned
       */

      await contact.refresh()

      return response.created({ message: 'Contact was created.', data: contact.id })
    } catch (error) {
      Logger.error('Error at ContactsController.store:\n%o', error)

      return response.status(error?.status ?? 500).json({
        message: 'An error occured while creating the contact.',
        error: process.env.NODE_ENV !== 'production' || error?.status === 442 ? error : null,
      })
    }
  }

  /**
   * method for GET request
   *
   * Fetch a contact by ID
   */
  public async show({ response, requestedContact }: HttpContextContract) {
    try {
      return response.ok({ data: requestedContact })
    } catch (error) {
      Logger.error('Error at ContactsController.show:\n%o', error)

      return response.status(error?.status ?? 500).json({
        message: 'An error occurred while deleting the contact.',
        error: process.env.NODE_ENV !== 'production' ? error : null,
      })
    }
  }

  /**
   * method for PUT request
   *
   * Update a contact by ID
   */
  public async update({ request, response, requestedContact }: HttpContextContract) {
    try {
      const payload = await request.validate(ContactValidator)

      const {
        firstName,
        surname,
        company,
        jobTitle,
        email1,
        email2,
        phoneNumber1,
        phoneNumber2,
        country,
        streetAddressLine1,
        streetAddressLine2,
        city,
        postCode,
        state,
        birthday,
        website,
        notes,
        profilePicture,
      } = payload!

      requestedContact?.merge({
        firstName,
        surname,
        company,
        jobTitle,
        email1,
        email2,
        phoneNumber1,
        phoneNumber2,
        country,
        streetAddressLine1,
        streetAddressLine2,
        city,
        postCode,
        state,
        birthday,
        website,
        notes,
        profilePicture: profilePicture ? Attachment.fromFile(profilePicture) : null,
      })

      await requestedContact?.save()
      await requestedContact?.refresh()

      return response.created({ message: 'Contact was edited', data: requestedContact?.id })
    } catch (error) {
      Logger.error('Error at ContactsController.update:\n%o', error)

      return response.status(error?.status ?? 500).json({
        message: 'An error occurred while updating the contact.',
        error: process.env.NODE_ENV !== 'production' ? error : null,
      })
    }
  }

  /**
   * method for DELETE request
   *
   * Delete a contact by ID
   */
  public async destroy({ response, requestedContact }: HttpContextContract) {
    try {
      await requestedContact?.delete()

      return response.created({ message: 'Contact was deleted', data: requestedContact?.id })
    } catch (error) {
      Logger.error('Error at ContactController.destro:\n%o', error)

      return response.status(error?.status ?? 500).json({
        message: 'An error occured whiles deleting the contact.',
        error: process.env.NODE_ENV !== 'production' ? error : null,
      })
    }
  }
}
