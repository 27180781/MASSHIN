const ErrorService = require("../services/ErrorService");
const _ = require("lodash");

class Controller {
	constructor(name, model, modifableValues) {
		this.name = name;
		this.model = model;
		this.modifableValues = modifableValues;
	}

	/**
	 * Find all records
	 */
	index() {
		return async (req, res) => {
			try {
				return res.send(await this.model.find());
			} catch (e) {
				return ErrorService.createError(
					`${this.name} Controller | index`,
					ErrorService.errors.generalError,
					res
				);
			}
		};
	}

	/**
	 * Find a single record
	 * @param {*} req.params.id the record id
	 */
	show() {
		return async (req, res) => {
			try {
				res.send(await this.model.findById(req.params.id));
			} catch (e) {
				return ErrorService.createError(
					`${this.name} Controller | show`,
					ErrorService.errors.generalError,
					res
				);
			}
		};
	}

	/**
	 * Save's a single record
	 * @param {*} req.body the record data
	 */
	store() {
		return async (req, res) => {
			try {
				res.send(await this.model.create(this.pick(req)));
			} catch (e) {
				return ErrorService.createError(
					`${this.name} Controller | store`,
					ErrorService.errors.generalError,
					res
				);
			}
		};
	}

	/**
	 * Updates single record
	 * @param {*} req.params.id the wanted record'd id
	 * @param {*} req.body holds the record updates
	 */
	update() {
		return async (req, res) => {
			try {
				await this.model.updateOne(this._secureFilters(req), {
					$set: this.pick(req),
				});
				res.sendStatus(200);
			} catch (e) {
				return ErrorService.createError(
					`${this.name} Controller | update`,
					ErrorService.errors.generalError,
					res
				);
			}
		};
	}

	/**
	 * Delete's a single record
	 * @param {*} req.params.id the wanted record's id
	 */
	destroy() {
		return async (req, res) => {
			try {
				const filter = this._secureFilters(req);
				await this.model.deleteOne(filter);
				res.sendStatus(200);
			} catch (e) {
				return ErrorService.createError(
					`${this.name} Controller | destroy`,
					ErrorService.errors.generalError,
					res
				);
			}
		};
	}

	/**
	 * Replicates a single record
	 * @param {*} req.params.id the wanted record's id
	 */
	replicate() {
		return async (req, res) => {
			try {
				const parent = await this.model.findById(req.params.id);
				let replicatedData = { ...parent._doc };
				delete replicatedData._id;
				let newRecord = await this.model.create(replicatedData);
				res.send(newRecord);
			} catch (e) {
				return ErrorService.createError(
					`${this.name} Controller | Replicate`,
					ErrorService.errors.generalError,
					res
				);
			}
		};
	}

	/**
	 * Picks modifable values from req.body depends on user's role
	 * @param {*} req the request body
	 * @returns
	 */
	pick(req) {
		return req.user.role == 0
			? req.body
			: _.pick(req.body, this.modifableValues);
	}

	/**
	 * Creates basic Mongoose filters, include authorization
	 * @param {*} req the request body
	 * @returns the record values that can be updated or stored
	 */
	_secureFilters(req) {
		let f = { _id: req.params.id };
		if (req.user.role > 0) f["user"] = req.user.id;
		return f;
	}
}

module.exports = Controller;
