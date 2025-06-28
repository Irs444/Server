const mongoose = require("mongoose")

const connectDB = (url) => {
    return new Promise((resolve, reject) => {
        if (url) {
            resolve(mongoose.connect(url))
        } else {
            reject("Error: Database not connected")
        }
    })
}

module.exports = connectDB