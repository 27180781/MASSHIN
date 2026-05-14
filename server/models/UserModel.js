const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passwordHash = require("password-hash");
const { convertPhoneNumber } = require("../services/services");
const validators = require("./custromValidators");

const userSchema = new Schema(
	{
		name: { type: String },
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			validate: validators.user.email,
		},
		password: {
			type: String,
			required: true,
			validate: validators.user.password,
		},
		role: {
			type: Number,
			default: 4,
		},
		phone: {
			type: String,
			validate: validators.user.phone,
		},
	},
	{ timestamps: true }
);

//if user changes the password or adding password - hash it
userSchema.pre("save", async function (next) {
	const user = this;
	if (user.phone) {
		user.phone = convertPhoneNumber(user.phone);
	}
	if (user.isModified("password")) {
		//hashing admin's password
		let hash = passwordHash.generate(user.password);
		user.password = hash;
	}
	next();
});
//convert phone number on update
userSchema.pre(/^find/, function () {
	const { _update } = this;
	if (_update && _update.$set && _update.$set.phone) {
		const user = _update.$set;
		user.phone = convertPhoneNumber(user.phone);
	}
});

//this function verifies the user's password
function checkPass(pass) {
	return passwordHash.verify(pass, this.password);
}

userSchema.methods.checkPass = checkPass;

const User = mongoose.model("User", userSchema);

module.exports = User;
