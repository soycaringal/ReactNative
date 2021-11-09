const path = require('path')

module.exports = ({ env }) => {
  return {
    webpack: {
      alias: {
        '~': path.join(__dirname, 'src'),
        '~components': path.join(__dirname, 'src', 'components')
      }
    }
  }
}
