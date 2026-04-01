const app = require('../BE/src/app');
const connectDB = require('./db/db');
connectDB()
app.listen(() => {
    console.log('Listening on port 3001');
})