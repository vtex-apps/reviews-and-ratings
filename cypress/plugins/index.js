const readXlsx = require('./read-xlsx')

module.exports = on => {
  on('task', {
    readXlsx: readXlsx.read,
  })
}
