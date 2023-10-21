const { hash, compare } = require('bcrypt');


const passwordHashing = async (plaintext) => {
    return await hash(plaintext,8);
}

const passwordCompare = async (plaintext,hashPassword) => {
    return await compare(plaintext,hashPassword);
}

module.exports = {
    passwordHashing,
    passwordCompare
}