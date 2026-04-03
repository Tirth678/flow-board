const app = require('./src/app');
const connectDB = require('./src/db/db');
const port = 3001
connectDB()
app.listen(port, () => {
    console.log(`Listening on port 3000`)
})
