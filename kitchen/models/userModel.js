import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minLength: [2, "Name must be at least 2 characters"],
        maxLength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false
    },
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer"
    },
    refreshToken: {
        type: String,
        select: false
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);

});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

