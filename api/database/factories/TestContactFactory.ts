import Contact from 'App/Models/Contact'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { DateTime } from 'luxon'

export default Factory.define(Contact, ({ faker }) => {
  return {
    
    const firstName = faker.name.firstName(faker.random.arrayElement([0, 1]))
  const surname = faker.name.lastName()
  const omitAddress = faker.datatype.boolean()

  return {
    firstName,
    surname,
    company: faker.company.companyName(),
    jobTitle: (() => {
      const omit = faker.datatype.boolean()
      return omit ? null : faker.name.jobTitle()
    })(),
    email1: faker.internet.email(firstName, surname),
    email2: (() => {
      const omit = faker.datatype.boolean()
      return omit ? null : `${firstName}.${surname}@${faker.internet.domainName()}`
    })(),
    phoneNumber1: faker.phone.phoneNumber(),
    phoneNumber2: (() => {
      const omit = faker.datatype.boolean()
      return omit ? null : faker.phone.phoneNumber()
    })(),
    country: faker.address.country(),
    state: omitAddress ? null : faker.address.state(),
    streetAddressLine1: omitAddress ? null : faker.address.streetAddress(),
    streetAddressLine2: omitAddress ? null : faker.address.streetAddress(),
    postCode: omitAddress ? null : faker.address.zipCode(),
    birthday: (() => {
      const omit = faker.datatype.boolean()
      return omit ? null : DateTime.fromJSDate(faker.date.past())
    })(),
    website: (() => {
      const omit = faker.datatype.boolean()
      return omit ? null : `https://${faker.internet.domainName()}`
    })(),
    notes: (() => {
      const omit = faker.datatype.boolean()
      return omit ? null : faker.lorem.paragraphs(faker.random.arrayElement([1, 2]))
    })(),
  }
  }
}).build()
