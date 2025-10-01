const sendCode = require('./authCodeController');
const verifyCode = require('./verifyCodeController');
const updateUserName = require('./updateUserName');
const createReference = require('./createReference');
const getReferences = require('./getReferences')

module.exports = {sendCode ,verifyCode,updateUserName,createReference,getReferences};