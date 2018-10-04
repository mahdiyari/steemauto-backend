/**
 * This method will add functions to a queue and will run functions with a delay
 */
let i = 1
const queue = (cb, delay) => {
  i++
  setTimeout(() => {
    cb()
    i--
  }, i * delay)
}

module.exports = queue
