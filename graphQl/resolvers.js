const User = require('../models/user');
const brycypt = require('bcryptjs');
const validator = require('validator');

module.exports = {
    createUser: async function ({ userInput }, req) {
        // const email = args.userInput.email
        const errors = [];
        if (!validator.isEmail(userInput.email)) {
            errors.push({ message: 'Invalid Email' });
        }
        if (
            validator.isEmpty(userInput.password) ||
            !validator.isLength(userInput.password, { min: 5 })
        ) {
            errors.push({ message: 'Password is too short' });
        }
        if (errors.length > 0) {
            const error = new Error('Invalid Input');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const existingUser = await User.findOne({ email: userInput.email });

        if (existingUser) {
            const error = new Error('User exist already!!');
            throw error;
        }
        const hashPassword = await brycypt.hash(userInput.password, 12);
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashPassword,
        });
        const createUser = await user.save();
        return {
            ...createUser._doc,
            _id: createUser._id.toString(),
        };
    },
};
