module.exports = {
  apps: [{
    name: 'car-driver-ps4',
    script: './start.js',
    log_date_format : "YYYY-MM-DD HH:mm:ss.SSS",
    watch: true,
    env: {
      COMMON_VARIABLE: true,
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
}
