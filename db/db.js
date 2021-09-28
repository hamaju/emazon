const fs = require('fs')
const crypto = require('crypto')

module.exports = class Database {
  constructor(filename) {
    if (!filename) {
      throw new Error('Creating a database requires a filename')
    }

    this.filename = filename
    try {
      fs.accessSync(this.filename) // not usually recommended
    } catch (err) {
      fs.writeFileSync(this.filename, '[]')
    }
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8',
      })
    )
  }

  async getOne(id) {
    const records = await this.getAll()
    return records.find((record) => record.id === id)
  }

  async create(attrs) {
    attrs.id = this.randomId()

    const records = await this.getAll()
    records.push(attrs)
    await this.writeAll(records)

    return attrs
  }

  async delete(id) {
    const records = await this.getAll()
    // return all records that don't match the specified id
    const filteredRecords = records.filter((record) => record.id !== id)
    await this.writeAll(filteredRecords)
  }

  async update(id, attrs) {
    const records = await this.getAll()
    const record = records.find((record) => record.id === id)

    if (!record) {
      throw new Error(`Record with an id of ${id} not found`)
    }

    // adds the 2nd argument's object into the first argument's object
    Object.assign(record, attrs)
    await this.writeAll(records)
  }

  async getOneBy(filters) {
    const records = await this.getAll()

    for (let record of records) {
      let found = true

      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false
        }
      }

      if (found) {
        return record
      }
    }
  }

  async writeAll(records) {
    await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2))
  }

  randomId() {
    return crypto.randomBytes(4).toString('hex')
  }
}
