const path = require('path')
const dotenv = require('dotenv')

// mode setup
const envFile = `.env.${process.env.NODE_ENV || 'development'}`
dotenv.config({ path: path.resolve(__dirname, envFile) })

const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')
const app = express()

const userRouter = require('./routers/userRouter')
const departmentRouter = require('./routers/departmentRouter')
const designationRouter = require('./routers/designationRouter')
const User = require('./models/userModal')
const Department = require('./models/departmentModal')

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cors())

//connect mongodb
connectDB(process.env.DATABASE_URL).then(async () => {
    console.log('database connected')
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
        console.log('Admin already exist:', existingAdmin.email)
    }

    if (!existingAdmin) {
        const admin = new User({
            name: 'Super Admin',
            email: process.env.SUPERADMIN_EMAIL,
            password: process.env.SUPERADMIN_PASSWORD,
            role: 'admin',
            level: 1,
            reportsTo: null
        })

        await admin.save();
        console.log('Admin created', admin.email)
    }
})

// seed department dummy data
const dummyData = Array.from({ length: 50 }, (_, i) => ({
    name: `Department ${i + 1}`
}))

const addDepartment = async () => {
    const count = await Department.countDocuments();
    if (count == 0) {
        await Department.insertMany(dummyData)
        console.log("Department data added")
    }
}

addDepartment();

// routes
app.use("/api/v1/department", departmentRouter)
app.use('/api/v1/user', userRouter)
app.use("/api/v1/designation", designationRouter)

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`server started at port http://localhost:${port} in ${process.env.NODE_ENV} mode`))
