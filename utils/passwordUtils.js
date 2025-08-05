const bcrypt = require ('bcrypt');

exports.hashPassword = async (plainText) => {
    const saltRounds = await bcrypt.genSalt(10);
    return await bcrypt.hash(plainText, saltRounds);
}

exports.comparePasswords = async (plainText, hashed) => {
    return await bcrypt.compare(plainText, hashed);
}