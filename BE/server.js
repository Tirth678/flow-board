const app = require('./src/app');
const connectDB = require('./src/db/db');
const port = process.env.PORT || 5001;

connectDB()
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
