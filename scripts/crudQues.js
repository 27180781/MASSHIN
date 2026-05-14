const validators = {
	notEmpty: async input => {
		console.log(input);
		if (!input) return "y/n only";
		return true;
	},
};
module.exports = [
	{
		name: "name",
		type: "input",
		message: "Model Name?",
		validate: validators.notEmpty,
		default: "Ness",
	},
	{
		name: "isAuth",
		type: "confirm",
		message: "Authenticated route? y/n",
	},
	{
		name: "isVuexModule",
		type: "confirm",
		message: "Create Vuex module for it? y/n",
	},
	{
		name: "isVueTable",
		type: "confirm",
		message: "Create Vue table for it? y/n",
	},
];
