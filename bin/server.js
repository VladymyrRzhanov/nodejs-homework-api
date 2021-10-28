const db = require('../config/db');
const app = require('../app')
require('dotenv').config()
const UPLOAD_DIR = process.env.UPLOAD_DIR
const AVATARS_DIR = process.env.AVATARS_DIR
const mkdirp = require('mkdirp')

const PORT = process.env.PORT || 3000

db.then(() => {
  app.listen(PORT, async () => {
    await mkdirp(UPLOAD_DIR)
    await mkdirp(AVATARS_DIR)
    console.log(`Server running. Use our API on port: ${PORT}`)
  })
}).catch(error => {
  console.log(`Server not run. Error: ${error.message}`);
});
