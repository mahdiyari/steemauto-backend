/** trails[] is array with min 1 and max 25 elements */
const trails = trails => {
  // proccessing more than 25 trails may cause problems
  if (!Array.isArray(trails) || trails.length > 25 || trails.length < 1) {
    return false
  }
  return true
}

/** method is a number (1 or 2) */
const votingMethod = method => {
  if (isNaN(method) || (method !== 1 && method !== 2)) {
    return false
  }
  return true
}

/** weight is number in range 0.1 ~ 100 */
const weight = weight => {
  if (isNaN(weight) || weight < 0.1 || weight > 100) {
    return false
  }
  return true
}

/** delay is number in range 0 ~ 30 */
const delay = delay => {
  if (isNaN(delay) || delay < 0 || delay > 30) {
    return false
  }
  return true
}
const validate = {
  trails,
  votingMethod,
  weight,
  delay
}

module.exports = validate
