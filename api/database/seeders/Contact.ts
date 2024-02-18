import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { ContactFactory } from 'Database/factories'

export default class ContactSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await ContactFactory.createMany(100)
  }
}
