const mongoose = require("mongoose");
const inquirer = require("inquirer");
const chalk = require("chalk");

const validators = {
	notEmpty: async input => {
		console.log(input);
		if (!input) return "y/n only";
		return true;
	},
	isNumber: async input => {
		let reg = new RegExp(/^\d+$/);
		if (!reg.test(input)) return "only numbers";
		return true;
	},
};

const ques = [
	{
		name: "email",
		type: "input",
		message: "email?",
		validate: validators.notEmpty,
		default: "bokoness@gmail.com",
	},
	{
		name: "password",
		type: "input",
		message: "password",
		default: "321123",
		validate: validators.notEmpty,
	},
	{
		name: "role",
		type: "input",
		message: "role",
		default: "0",
		validate: validators.isNumber,
	},
];

const createCrud = async () => {
	try {
		let crudAns = await inquirer.prompt(ques);
		let role = Number(crudAns.role);
		console.log(process.env.MONGO);
		await mongoose.connect(process.env.MONGO, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			dbName: process.env.DB_NAME,
		});
		const User = require("../server/models/UserModel");
		let u = await User.create({
			email: crudAns.email,
			password: crudAns.password,
			role,
		});
		console.log(chalk.green(`${crudAns.email} isAdded!`));
		process.exit();
	} catch (e) {
		console.log(chalk.red(`Something bad happend...\n ${e}}`));
		process.exit();
	}
};

createCrud();
