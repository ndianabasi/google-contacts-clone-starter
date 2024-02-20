import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'contacts'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      /**
       * change the data type for the birthday column
       * from strings to luxon date and index the column
       */
      table.date('birthday').alter().index()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      /**
       * unindex the birthday column roll back the changes
       *
       * i.e, convert the birthday column from luxon date
       * to strings just as it previously was
       */
      table.dropIndex('birthday')
      table.string('birthday').alter()
    })
  }
}
