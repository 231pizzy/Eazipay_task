"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = exports.comparePassWord = exports.decode = exports.hashPassword = exports.SaltGenerator = exports.genToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModels_1 = __importDefault(require("../models/userModels"));
const genToken = ({ email, id }) => {
    const token = jsonwebtoken_1.default.sign({ email, id }, 'secret', { expiresIn: '7d' });
    return token;
};
exports.genToken = genToken;
const SaltGenerator = async () => {
    return bcrypt_1.default.genSalt();
};
exports.SaltGenerator = SaltGenerator;
const hashPassword = async (password, salt) => {
    return await bcrypt_1.default.hash(password, salt);
};
exports.hashPassword = hashPassword;
const decode = (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, 'secret');
    return decoded;
};
exports.decode = decode;
// export const hashPassword = async (password: string) => {
//   const saltFactor: any = process.env.SALTFACTOR || 10
//   const salt = await bcrypt.genSalt(saltFactor);
//   const hashedPassword = await bcrypt.hash(password, salt)
//    return hashedPassword
// }
const comparePassWord = async (user, password) => {
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    return isMatch;
};
exports.comparePassWord = comparePassWord;
const authenticateUser = async (token) => {
    const { id } = (0, exports.decode)(token);
    const user = await userModels_1.default.findById(id);
    return user;
};
exports.authenticateUser = authenticateUser;
