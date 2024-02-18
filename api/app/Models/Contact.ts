import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'

export default class Contact extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column({ serializeAs: 'firstName' })
  public firstName: string

  @column()
  public surname: string

  @column()
  public company?: string | null | undefined

  @column({ serializeAs: 'jobTitle' })
  public jobTitle?: string | null | undefined

  @column()
  public email1: string

  @column()
  public email2?: string | null | undefined

  @column({ serializeAs: 'phoneNumber1' })
  public phoneNumber1: string

  @column({ serializeAs: 'phoneNumber2' })
  phoneNumber2?: string | null | undefined

  @column()
  public country?: string | null | undefined

  @column({ serializeAs: 'streetAddressLine1' })
  public streetAddressLine1?: string | null | undefined

  @column({ serializeAs: 'streetAddressLine2' })
  public streetAddressLine2?: string | null | undefined

  @column()
  public city?: string | null | undefined

  @column({ serializeAs: 'postCode' })
  public postCode?: string | null | undefined

  @column()
  public state?: string | null | undefined

  // @column()
  // public birthday?: string | null | undefined

  @column.date({ autoCreate: false, autoUpdate: false })
  public birthday?: DateTime | null | undefined

  @column()
  public website?: string | null | undefined

  @column()
  public notes?: string | null | undefined

  @attachment({
    disk: 'local',
    folder: 'avatars',
    preComputeUrl: true,
    serializeAs: 'profilePicture',
  })
  public profilePicture?: AttachmentContract | null

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  public updatedAt: DateTime

  /**
   * Runs before creating a new record
   */
  @beforeCreate()
  public static generateUUID(contact: Contact): void {
    /**
     * This is a static method to generate a random ID
     * for the `id` column
     *
     * `cuid()` returns a collision-resistant unique ID
     */
    contact.id = cuid()
  }
}
