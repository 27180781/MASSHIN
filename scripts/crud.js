const inquirer = require("inquirer");
const crudQues = require("./crudQues");
const fs = require("fs");
const path = require("path");

const createCrud = async () => {
  try {
    let basepath = path.join(__dirname, "..");
    cleanTestFiles(basepath);
    let crudAns = await inquirer.prompt(crudQues);
    let model = capitalize(crudAns.name);
    createModel(model, basepath);
    createRouter(model, crudAns.isAuth, basepath);
    createController(model, basepath);
    if (crudAns.isVuexModule) {
      createVuexModule(model, basepath);
      createVueView(model, basepath);
      addModuleToVueRouter(model, basepath);
    }
  } catch (e) {
    console.log(`something bad happend, ${e}`);
  }
};

const createModel = (name, basepath) => {
  let temp = `const mongoose=require("mongoose");const Schema=mongoose.Schema;const ${name}Schema=new Schema({},{timestamps:true});const ${name}=mongoose.model("${name}",${name}Schema);module.exports=${name};`;
  fs.writeFileSync(`${basepath}/server/models/${name}Model.js`, temp, "utf-8");
};

const createRouter = (name, isAuth, basepath) => {
  try {
    let temp = `const router = require("express").Router();const ${name}Controller = require("../controllers/${name}Controller");${
      isAuth ? `const userAuth = require("../middleware/auth").userAuth;` : ""
    }\n//Basic Crud routes \nrouter.get("/", ${
      isAuth ? " userAuth, " + name : name
    }Controller.index);router.get("/:id", ${
      isAuth ? " userAuth, " + name : name
    }Controller.show);router.post("/", ${
      isAuth ? " userAuth, " + name : name
    }Controller.store);router.put("/:id", ${
      isAuth ? " userAuth, " + name : name
    }Controller.update);router.delete("/:id", ${
      isAuth ? " userAuth, " + name : name
    }Controller.destroy);module.exports = router;`;

    let filepath = `${basepath}/server/routes/${name.toLowerCase()}Routes.js`;
    fs.writeFileSync(filepath, temp, "utf-8");

    filepath = `${basepath}/server/routes/routesList.json`;
    let routesList = require(filepath);
    routesList.routes.push(name.toLowerCase());
    fs.writeFileSync(filepath, JSON.stringify(routesList), "utf-8");
  } catch (e) {
    throw e;
  }
};

//TODO: change model name to upperCase
createController = (name, basepath) => {
  //TODO: change model name to uppercase - something like this: name[0] = name[0].toUpperCase;
  let temp = `const ${name}=require("../models/${name}Model");const services=require("../services/services");class ${name}Controller{static async index(req,res){try{res.send(await ${name}.find());}catch(e){return services.createError("${name}Controller|index",services.errors.generalError,res);}}static async show(req,res){try{const data=await ${name}.findById(req.params.id);res.send(data);}catch(e){return services.createError("${name}Controller|index",services.errors.generalError,res);}}static async store(req,res){try{const record=await ${name}.create({...req.body});res.send(record);}catch(e){return services.createError("${name}Controller|Store",services.errors.generalError,res);}}static async update(req,res){try{await ${name}.updateOne({_id:req.params.id},{$set:req.body});res.sendStatus(200);}catch(e){return services.createError("${name}Controller|update",services.errors.generalError,res);}}static async destroy(req,res){try{await ${name}.deleteOne({_id:req.params.id});res.sendStatus(200);}catch(e){return services.createError("${name}Controller|destroy",services.errors.generalError,res);}}static async replicate(req,res){try{const parent=await ${name}.findById(req.params.id);let replicatedData={...parent._doc};deletereplicatedData._id;let newRecord=await ${name}.create(replicatedData);res.send(newRecord);}catch(e){return services.createError("${name}Controller|replicate",services.errors.generalError,res);}}}module.exports=${name}Controller;`;

  fs.writeFileSync(
    `${basepath}/server/controllers/${name}Controller.js`,
    temp,
    "utf-8"
  );
};

const cleanTestFiles = basepath => {
  let p = path.join(basepath, "controllers", "NessController.js");
  if (fs.existsSync(p)) fs.unlinkSync(p);

  p = path.join(basepath, "routes", "nessRoutes.js");
  if (fs.existsSync(p)) fs.unlinkSync(p);

  p = path.join(basepath, "models", "NessModel.js");
  if (fs.existsSync(p)) fs.unlinkSync(p);
};

const createVuexModule = (module, basepath) => {
  try {
    let temp = `import axios from "axios";export default {state: {${module}s: [],"${module}s/filtered": [],${module}: null,},getters: {${module}s: state => state.${module}s,${module}: state => state.${module},"${module}s/filtered": state => state["${module}s/filtered"]},mutations: {"${module}s/set": (state, payload) => {state.${module}s = payload;state.filtered = [...state.${module}s];},"${module}/set": (state, payload) => (state.${module} = payload),"${module}s/filter": (state, {key, val}) => {state["${module}s/filtered"] =!val? [...state.${module}s]: state["${module}s"].filter(f => f[key] === val);},"${module}s/add": (state, payload) => state.${module}s.push(payload),"${module}s/remove": (state, id) =>(state.${module}s = state.${module}s.filter(item => {return item._id !== id;})),"${module}s/update": (state, payload) => {state.${module}s = state.${module}s.map(item => {if (item._id === payload._id) {return payload;}return item;});},},actions: {"${module}s/index": async context => {try {const { data } = await axios.get("/${module}");context.commit("${module}s/set", data);} catch (e) {console.log(e);}},"${module}/show": async (context, id) => {try {let { data } = await axios.get('/api/${module}/' + id);context.commit("${module}/set", data);} catch (e) {console.log(e);}},"${module}/insert": async (context, data) => {try {const formData = new FormData();for (var key in data) {formData.append(key, data[key]);}let {data} = await axios.post('/api/${module}', formData);context.commit("${module}s/add", data);} catch (e) {console.log(e);}},"${module}/remove": async (context, id) => {try {await axios.delete('/api/${module}/' + id);context.commit("${module}s/remove", id);} catch (e) {console.log(e);}},"${module}/update": async (context, payload) => {try {const formData = new FormData();for (var key in payload) {formData.append(key, payload[key]);}let {data} = await axios.put('/api/${module}/' + payload._id, formData);context.commit("${module}s/update", data);} catch (e) {console.log(e);}},},};`;
    fs.writeFileSync(
      `${basepath}/src/store/modules/${module}Module.js`,
      temp,
      "utf-8"
    );
    const vuexModules = require(`${basepath}/src/store/vuexModules.js`);
    vuexModules.push(`${module}Module`);
    temp = "module.exports = [";
    vuexModules.forEach((m, i) => {
      if (i !== 0) temp += ",";
      temp += `"${m}"`;
    });
    temp += "];";
    fs.writeFileSync(`${basepath}/src/store/vuexModules.js`, temp, "utf-8");
  } catch (e) {
    console.log(e);
  }
};

const addModuleToVueRouter = (module, basepath) => {
  let routesData = require(`${basepath}/src/router/routes.json`);
  routesData.routes.push({
    path: `/${module}`,
    name: `${module.charAt(0).toUpperCase() + module.slice(1)}`
  });
  let temp = JSON.stringify(routesData);
  fs.writeFileSync(`${basepath}/src/router/routes.json`, temp, "utf-8");
};

const createVueView = (module, basepath) => {
  let temp = `<template><div><h3>${module}</h3></div></template><script>export default {name: '${module}',data: () => {return {};},computed: {},methods: {},};</script><style lang="scss" scoped></style>`;
  fs.writeFileSync(
    `${basepath}/src/views/${module.charAt(0).toUpperCase() +
      module.slice(1)}.vue`,
    temp,
    "utf-8"
  );
};

const capitalize = str => {
  str = str.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
};

createCrud();
