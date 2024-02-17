import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import {cuid} from '@ioc:Adonis/Core/Helpers'

export default class Contact extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public firstName: string

  @column()
  public surname: string

  @column()
  public company?: string | null | undefined

  @column()
  public jobTitle?: string | null | undefined

  @column()
  public email1: string

  @column()
  public email2?: string | null | undefined

  @column()
  public phoneNumber1: string

  @column()
  phoneNumber2?: string | null | undefined

  @column()
  public country?: string | null | undefined

  @column()
  public streetAddressLine1?: string | null | undefined
  
  @column()
  public streetAddressLine2?: string | null | undefined

  @column()
  public city?: string | null | undefined

  @column()
  public postCode?: string | null | undefined

  @column()
  public state?: string | null | undefined

  @column()
  public birthday?: string | null | undefined
  
  @column()
  public website?: string | null | undefined

  @column()
  public notes?: string | null | undefined

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
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
