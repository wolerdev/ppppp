import {model,Schema} from "mongoose"

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createAt: String
})
export default model('User',userSchema)