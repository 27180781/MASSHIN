const User = require("./UserModel");

module.exports = {
  time: {
    validator: (v) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v),
    message: (props) => `${props.value} is not a valid time!`,
  },
  color: {
    validator: (v) => /^#([0-9a-f]{3}){1,2}$/i.test(v),
    message: () => "Invalid color",
  },
  user: {
    phone: {
      validator: (v) =>
        /^\+?(972|0)(-)?0?(([23489]{1}\d{7})|([71,72,73,74,75,76,77]{2}\d{7})|[5]{1}\d{8})$/g.test(
          v
        ),
      message: (props) => `${props.value} is not a valid phone!`,
    },
    role: (r) => {
      return {
        validator: async (v) => await User.findOne({ v, role: r }),
        message: (props) => `${props.value} dont have the right role`,
      };
    },
    email: {
      validator: (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v),
      message: (props) => `${props.value} is not a valid email!`,
    },
    password: {
      validator: (v) => v.length > 5,
      message: (props) => `${props.value} is not a valid password!`,
    },
  },
};
