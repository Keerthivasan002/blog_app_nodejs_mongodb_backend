import mongoose from "mongoose";

const userModel = mongoose.Schema({
    username:{
        type : String,

    },

    email:{
        type: String
    },

    password:{
        type:String,
    }

})

export default mongoose.model("user", userModel);