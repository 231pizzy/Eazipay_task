"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const userModels_1 = __importDefault(require("../models/userModels"));
const auth_1 = require("../utilis/auth");
const bcrypt_1 = __importDefault(require("bcrypt"));
const graphql_1 = require("graphql");
const graphQlError = (message) => {
    throw new graphql_1.GraphQLError(message, {
        extensions: {
            code: "BAD_USER_INPUT",
        },
    });
};
exports.resolvers = {
    Query: {
        getUsers: async () => {
            try {
                const users = await userModels_1.default.find();
                if (!users) {
                    return graphQlError("Users not found");
                }
                return users;
            }
            catch (error) {
                console.log(error);
            }
        },
        getUser: async (_, { id }) => {
            try {
                const user = await userModels_1.default.findById(id);
                if (!user) {
                    return graphQlError("User not found");
                }
                return user;
            }
            catch (error) {
                console.log(error);
            }
        }
    },
    //    MUTATIONS
    Mutation: {
        // SIGNUP USER
        Signup: async (_, userData) => {
            try {
                const { firstName, lastName, email, password } = await userData.newUser;
                const user = await userModels_1.default.findOne({ email });
                if (user) {
                    return graphQlError(`${user} is already in use`);
                }
                if (!password) {
                    return graphQlError('Password is required.');
                }
                //  const hashedPassword = await hashPassword(userData.password);
                //  userData.password = hashedPassword;
                const saltRounds = 10;
                const salt = await bcrypt_1.default.genSalt(saltRounds);
                const hashedPassword = await bcrypt_1.default.hash(password, salt);
                const newUserWithHashedPassword = {
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                };
                const newUser = await userModels_1.default.create(newUserWithHashedPassword);
                return newUser;
            }
            catch (error) {
                console.log(error);
            }
        },
        //  USER LOGIN
        Login: async (_, { loginUser }) => {
            const { email, password } = loginUser;
            const user = await userModels_1.default.findOne({ email });
            if (!user) {
                return graphQlError('Invalid credentials. Please check your email.');
            }
            const validate = await (0, auth_1.comparePassWord)(user, password);
            if (!validate) {
                return graphQlError("Invalid Login");
            }
            const token = (0, auth_1.genToken)({ email, id: user?._id?.toString() });
            return {
                user,
                token,
            };
        },
        // UPDATE USER
        UpdateUser: async (_, { updateUser }, context) => {
            if (!context.user) {
                return graphQlError('Authentication required to update user');
            }
            const { id, firstName, lastName, email, password } = updateUser;
            // Check if the user exists
            const existingUser = await userModels_1.default.findById(id);
            if (!existingUser) {
                return graphQlError('User not found');
            }
            if (context.user.id !== id) {
                return graphQlError('Unauthorized to update this user');
            }
            // Update user fields if provided
            if (firstName)
                existingUser.firstName = firstName;
            if (lastName)
                existingUser.lastName = lastName;
            if (email)
                existingUser.email = email;
            if (password) {
                const saltRounds = 10;
                const salt = await bcrypt_1.default.genSalt(saltRounds);
                const hashedPassword = await bcrypt_1.default.hash(password, salt);
                existingUser.password = hashedPassword;
            }
            // Save the updated user
            const updatedUser = await existingUser.save();
            return updatedUser;
        },
        // DELETE USER    
        DeleteUser: async (_, { id }, context) => {
            if (!context.user) {
                return graphQlError('Unauthorized. Please log in.');
            }
            // Check if the user exists
            try {
                const existingUser = await userModels_1.default.findByIdAndDelete(id);
                if (!existingUser) {
                    return graphQlError('User not found');
                }
                if (existingUser._id.toString() !== context.user.id) {
                    return graphQlError('Unauthorized. You can only delete your own account.');
                }
                await userModels_1.default.deleteOne({ _id: id });
                return existingUser;
            }
            catch (error) {
                return graphQlError("User not found");
            }
        },
    }
};
