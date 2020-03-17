const debug = require('debug')('middleware:pagination')

const parseToPositiveInt = num => {
  const value = parseInt(num, 10)
  return (value && value > 0) ? value : 0
}

const parseValueInRange = (num, min, max) => {
  if (num <= min) return min
  if (num >= max) return max
  return num
}

module.exports = (configProvided = {}) => (req, res, next) => {
  const config = { min: 20, max: 500, ...configProvided }
  req.pagination = {
    isEnable: false,
    default: { limit: config.min, offset: 0 }
  }

  let { offset, limit, page } = req.query

  if (!offset && !limit && !page) {
    debug('No pagination required')
    return next()
  }

  offset = parseToPositiveInt(offset)
  limit = parseToPositiveInt(limit)
  limit = parseValueInRange(limit, config.min, config.max)
  page = parseToPositiveInt(page)
  if (!offset && page) offset = (page - 1) * limit

  req.pagination.isEnable = true
  req.pagination.current = { limit, offset }
  debug(`Pagination defined: ${req.pagination}`)
  return next()
}
