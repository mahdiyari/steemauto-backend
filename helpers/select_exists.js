// this function will help parse result of select exists queries of mysql
const selectExists = (result) => {
  for (let i in result[0]) {
    if (result[0][i]) {
      return true
    } else {
      return false
    }
  }
}

module.exports = selectExists
