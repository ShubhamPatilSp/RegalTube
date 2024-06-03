import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName:{
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar:{
        type: String, // Cloudinary url 
        required: true,
        trim: true,
    },
    coverImage:{
        type: String,
    },
    watchHistory:[
        {type: Schema.Types.ObjectId,
        ref: "Video"
    }
    ],
    passwords:{
        typeof: String, 
        required: [true, "Password is required"]
    },
    refreshToken:{
        type: String,
    }
    },
    {
        timestamps: true
    }
)

UserSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10)
    next()
})
UserSchema.methods.isPasswordCorrect = async function 
(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function(){
   return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }

)
}
userSchema.methods.getRefreshToken = async function(){
    return jwt.sign({
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }

)
}


export const User = mongoose.model('User', UserSchema);
