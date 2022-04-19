// const userModel = require("../model/userModel")
// const bcrypt = require("bcrypt")
// const jwt = require("jsonwebtoken")
// const mongoose = require('mongoose')
// let s3 = require('./awsController')

// const isValid = function (value) {
//     if (typeof value === "undefined" || value === null) return false
//     if (typeof value === 'string' && value.trim().length === 0) return false
//     return true
// }

// const isValidRequestBody = function (requestBody) {
//     return Object.keys(requestBody).length > 0
// }

// const isValidObjectId = function (ObjectId) {
//     return mongoose.Types.ObjectId.isValid(ObjectId)
// }

// let validateEmail = function (Email) {
//     return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(Email);
// }


// let validatephone = function (phone) {
//     return /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone)
// }

// let char=function(value){
//     return /^[A-Za-z\s]+$/.test(value)
// }

// let validateString = function (value) {
//     return /^\S*$/.test(value)
// }

// let isValidPincode = function (value) {
//     if (!isNaN(value) && value.toString().length == 6) return true
// }


// const register = async (req, res) => {
//     try {
//         let data = req.body
//         if (!isValidRequestBody(data)) {
//             return res.status(400).send({ status: false, message: "Please enter your details to register" })
//         }

//         const { fname, lname, email, profileImage, phone, password, address } = data

//         if (!isValid(fname)) {
//             return res.status(400).send({ status: false, message: "fname is required" })
//         }

//         if (!char(fname)) {
//             return res.status(400).send({ status: false, message: "Please mention valid firstName" })
//         }

//         if (!validateString(fname)) {
//             return res.status(400).send({ status: false, message: "Spaces are not allowed in fname" })
//         }

//         if (!isValid(lname)) {
//             return res.status(400).send({ status: false, message: "lname is required" })
//         }

//         if (!char(lname)) {
//             return res.status(400).send({ status: false, message: "Please mention valid lastname" })
//         }

//         if (!validateString(lname)) {
//             return res.status(400).send({ status: false, message: "Spaces are not allowed in lname" })
//         }

//         if (!isValid(email)) {
//             return res.status(400).send({ status: false, message: "Email is required" })
//         }

//         if (!validateEmail(email)) {
//             return res.status(400).send({ status: false, message: "Please enter a valid email" })
//         }

//         let uniqueEmail = await userModel.findOne({ email: email })
//         if (uniqueEmail) {
//             return res.status(400).send({ status: false, message: "Email already exists" })
//         }

//         let files = req.files
//         if (files && files.length > 0) {
//             //upload to s3 and get the uploaded link
//             // res.send the link back to frontend/postman
//             let uploadedFileURL = await s3.uploadFile(files[0])
//             data['profileImage'] = uploadedFileURL
//         }
//         else {
//             return res.status(400).send({ status: false, message: "profileImage is required" })
//         }

//         if (!isValid(phone)) {
//             return res.status(400).send({ status: false, message: "phone number is required" })
//         }

//         if (!validatephone(phone)) {
//             return res.status(400).send({ status: false, message: "Please enter a valid phone" })
//         }

//         let uniquephone = await userModel.findOne({ phone: phone })
//         if (uniquephone) {
//             return res.status(400).send({ status: false, message: "phone already exists" })
//         }

//         if (!isValid(password)) {
//             return res.status(400).send({ status: false, message: "Password is required" })
//         }

//         if (password.length < 8 || password.length > 15) {
//             return res.status(400).send({ status: false, message: "The length of password should be in between 8-15 characters" })
//         }

//         if (!validateString(password)) {
//             return res.status(400).send({ status: false, message: "Spaces are not allowed in password" })
//         }

//         // Hashing the passwords
//         const salt = bcrypt.genSaltSync(10);
//         const hashedPassword = bcrypt.hashSync(password, salt);
//         data.password = hashedPassword


//         if (!isValid(address.shipping.street)) {
//             return res.status(400).send({ status: false, message: "Shipping Street is required" })
//         }
//         if (!isValid(address.shipping.city)) {
//             return res.status(400).send({ status: false, message: "Shipping city is required" })
//         }
//         if (!char(address.shipping.city)) {
//             return res.status(400).send({ status: false, message: "Please mention valid shipping city" })
//         }

//         if (!isValid(address.shipping.pincode)) {
//             return res.status(400).send({ status: false, message: "Shipping pincode is required" })
//         }

//         if (!isValidPincode(address.shipping.pincode)) {
//             return res.status(400).send({ status: false, message: "Pincode should be numeric and length is 6" })
//         }


//         if (!isValid(address.billing.street)) {
//             return res.status(400).send({ status: false, message: "Billing Street is required" })
//         }
//         if (!isValid(address.billing.city)) {
//             return res.status(400).send({ status: false, message: "Billing city is required" })
//         }

//         if (!char(address.billing.city)) {
//             return res.status(400).send({ status: false, message: "Please mention valid billing city" })
//         }

//         if (!isValid(address.billing.pincode)) {
//             return res.status(400).send({ status: false, message: "Billing pincode is required" })
//         }
//         if (!isValidPincode(address.billing.pincode)) {
//             return res.status(400).send({ status: false, message: "Pincode should be numeric and length is 6" })
//         }

//         //If all these validations passed , registering a user
//         let UserData = await userModel.create(data)
//         return res.status(201).send({ status: true, message: "You're registered successfully", data: UserData })
//     }

//     //Exceptional error handling
//     catch (error) {
//         return res.status(500).send({ status: false, message: error.message })
//     }
// }

// // ============================ second login api =============================================================================================

// const doLogin = async function (req, res) {
//     try {
//         let requestBody = req.body

//         // request body validation 

//         if (!isValidRequestBody(requestBody)) {
//             res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide login details' })
//             return
//         }
//         if (requestBody.email && requestBody.password) {

//             // email id or password is velid or not check validation 

//             let userEmail = await userModel.findOne({ email: requestBody.email });

//             if (!userEmail) {
//                 return res.status(400).send({ status: false, msg: "Invalid user email" })
//             }

//             const decryptPassword = await bcrypt.compare(requestBody.password, userEmail.password)

//             if (!decryptPassword) {
//                 return res.status(400).send({ status: false, msg: 'password is incorrect' })
//             }

//             // jwt token create and send back the user

//             let payload = { _id: userEmail._id }

//             let generatedToken = jwt.sign(payload, 'Group29', { expiresIn: '60m' })

//             // res.header('x-api-key', generatedToken);

//             res.status(200).send({ status: true, data: " user  login successfull", userId: userEmail._id, token: { generatedToken } })
//         } else {
//             res.status(400).send({ status: false, msg: "must contain email and password" })
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({ status: false, msg: error.message });
//     }
// };

// // ===================== third appi to get data by user id ================================================================================================


// const getuserById = async (req, res) => {
//     try {
//         //  authorization  //
//         const userId = req.params.userId
//         let userIdfromToken = req.userId;

//         console.log(userId)
//         console.log(userIdfromToken)


//         if (userId != userIdfromToken) {
//             return res.status(400).send({ status: false, msg: "unauthorized access" })
//         }
//         const searchprofile = await userModel.findOne({ _id: userId })

//         if (!searchprofile) {
//             return res.status(404).send({ status: false, message: ' user profile  does not exist' })
//         }
//         return res.status(200).send({ status: true, message: 'user profile details', data: searchprofile })

//     } catch (error) {
//         return res.status(500).send({ success: false, error: error.message });
//     }
// }

// // =============================== fourth api to update a user ==================================================================//


// const updateUser = async (req, res) => {
//     try {
//         const userId = req.params.userId;
//         const data = req.body;
//         const keys = Object.keys(data);
//         const file = req.files;

//         if (Object.keys(data).length == 0) {
//             return res.status(400).send({status: false,message: 'Please Input Some Data'});
//         }

//         for (let i = 0; i < keys.length; i++) {
//             if (keys[i] == '_id') {
//                 return res.status(400).send({status: false,message: 'You are not able to update _id property'
//                 });
//             }
//             else {
//                 if (data[keys[i]].trim() == '') {
//                     return res.status(400).send({status: false,message: `${keys[i]} should not be empty !`
//                     });
//                 }
//                 else if (keys[i] == 'email') {
//                     if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/).test(data.email.trim())) {
//                         return res.status(400).send({ status: false, message: 'Enter a valid Email Id' });
//                     }
//                 }
//                 else if (keys[i] == 'phone') {
//                     if (!(/^[6789]\d{9}$/).test(data.phone.trim())) {
//                         return res.status(400).send({ status: false, message: 'The mobile number must be 10 digits and should be only Indian number' });
//                     }

//                 }
//                 else if (keys[i] == 'address.shipping.pincode' || keys[i] == 'address.billing.pincode') {
//                     const regex = /^\d{6}$/;
//                     if (!regex.test(data[keys[i]])) {
//                         return res.status(400).send({status: false,message: `Enter the valid Pincode of ${keys[i]}`});
//                     }
//                 }
//                 else if (keys[i] == 'password') {
//                     if (!(data.password.length > 8 && data.password.length <= 15)) {
//                         return res.status(400).send({status: false,message: 'Minimum password should be 8 and maximum will be 15'});
//                     }
//                     data.password = bcrypt.hashSync(data.password, 10);
//                 }
//             }
//         }


//         let duplicateMobile = await userModel.findOne({ phone: data.phone })
//         if (duplicateMobile) {
//             return res.status(400).send({ status: false, msg: "mobile number already exists" })
//         }


//         let isDuplicateEmail = await userModel.findOne({ email: data.email })
//         if (isDuplicateEmail) {
//             return res.status(400).send({ status: false, msg: "email already exists" })
//         }

//         if (file && file.length > 0) {
//             if (file[0].mimetype.indexOf('image') == -1) {
//                 return res.status(400).send({status:false,message:'Only image files are allowed !'});
//             }
//             const profile_url = await aws.uploadFile(file[0]);
//             data["profileImage"] = profile_url;
//         }
//         const updateRes = await userModel.findByIdAndUpdate(userId, data, { new: true });
//         return res.status(200).send({status: true,message: `${Object.keys(data).length} field has been updated successfully !`,data: updateRes});
//     } catch (err) {
//         console.log(err)
//    return res.status(500).send({status: false,error: err.messag});
// }
// }


// // =================================================================================================================================================


// module.exports.register = register
// module.exports.doLogin = doLogin
// module.exports.getuserById = getuserById
// module.exports.updateUser = updateUser












const userModel = require("../model/userModel")
const validator = require("./validations")
const bcrypt = require('bcrypt');
const aws = require("./awsController")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const saltRounds = 10;





//........................First API ............................................................

const register = async function (req, res) {
    try {

        let files = req.files
        let userBody = req.body

        let { fname, lname, email, profileImage, phone, password, address } = userBody

        if (!validator.isValidRequestBody(userBody)) {
            return res.status(400).send({ status: false, message: 'please provide user body' })
        }

        if (!validator.isValid(fname)) {
            return res.status(400).send({ status: false, message: 'fname is required' })
        }

        if (!validator.isValid(lname)) {
            return res.status(400).send({ status: false, message: 'lname is required' })
        }

        if (!validator.validString(profileImage)) {
            return res.status(400).send({ status: false, message: 'profile image is required' })
        }

        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: 'email is required' })
        }

        if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, message: 'Invalid Email' })
        }

        const emailAlreadyUsed = await userModel.findOne({ email })
        if (emailAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${email} is already in use. Please try another email Id.` })
        }

        if (!validator.isValidRequestBody(files)) {
            return res.status(400).send({ status: false, message: 'Profile Image is required' })
        }

        if (!validator.isValid(phone)) {
            return res.status(400).send({ status: false, message: 'phone number is required' })
        }

        if (!((/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/).test(phone))) {
            return res.status(400).send({ status: false, message: 'Phone number must be a valid Indian number' })
        }

        const phoneAlreadyUsed = await userModel.findOne({ phone })
        if (phoneAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${phone} is already in use, Please try a new phone number` })
        }

        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: 'password is required' })
        }

        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ status: false, message: "The length of password should be in between 8-15 characters" })
        }

        if (!validator.isValid(address.shipping.street)) {
            return res.status(400).send({ status: false, message: "Shipping Street is required" })
        }
        if (!validator.isValid(address.shipping.city)) {
            return res.status(400).send({ status: false, message: "Shipping city is required" })
        }
        if (!validator.char(address.shipping.city)) {
            return res.status(400).send({ status: false, message: "Please mention valid shipping city" })
        }

        if (!validator.isValid(address.shipping.pincode)) {
            return res.status(400).send({ status: false, message: "Shipping pincode is required" })
        }

        if (!validator.isValidPincode(address.shipping.pincode)) {
            return res.status(400).send({ status: false, message: "Pincode should be numeric and length is 6" })
        }


        if (!validator.isValid(address.billing.street)) {
            return res.status(400).send({ status: false, message: "Billing Street is required" })
        }
        if (!validator.isValid(address.billing.city)) {
            return res.status(400).send({ status: false, message: "Billing city is required" })
        }

        if (!validator.char(address.billing.city)) {
            return res.status(400).send({ status: false, message: "Please mention valid billing city" })
        }

        if (!validator.isValid(address.billing.pincode)) {
            return res.status(400).send({ status: false, message: "Billing pincode is required" })
        }
        if (!validator.isValidPincode(address.billing.pincode)) {
            return res.status(400).send({ status: false, message: "Pincode should be numeric and length is 6" })
        }

        //         //If all these validations passed , registering a user
        //         let UserData = await userModel.create(data)
        //         return res.status(201).send({ status: true, message: "You're registered successfully", data: UserData })
        //     }

        //     //Exceptional error handling
        //     catch (error) {
        //         return res.status(500).send({ status: false, message: error.message })
        //     }
        // }

        profileImage = await aws.uploadFile(files[0]);

        const encryptedPassword = await bcrypt.hash(password, 10)

        let userData = { fname, lname, email, profileImage, phone, password: encryptedPassword, address }

        const saveUserData = await userModel.create(userData)

        return res.status(201).send({ status: true, message: 'user created successfully', data: saveUserData })
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}


//..............................SECOND API...............................................

const loginUser = async function (req, res) {
    try {
        let requestBody = req.body

        // request body validation 

        if (!validator.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide login details' })
            return
        }
        if (requestBody.email && requestBody.password) {

            // email id or password is velid or not check validation 

            let userEmail = await userModel.findOne({ email: requestBody.email });

            if (!userEmail) {
                return res.status(400).send({ status: false, msg: "Invalid user email" })
            }

            const decryptPassword = await bcrypt.compare(requestBody.password, userEmail.password)

            if (!decryptPassword) {
                return res.status(400).send({ status: false, msg: 'password is incorrect' })
            }

            // jwt token create and send back the user

            let payload = { _id: userEmail._id }

            let generatedToken = jwt.sign(payload, 'Group29', { expiresIn: '120m' })

            // res.header('x-api-key', generatedToken);

            res.status(200).send({ status: true, data: " user  login successfull", userId: userEmail._id, token: { generatedToken } })
        } else {
            res.status(400).send({ status: false, msg: "must contain email and password" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: error.message });
    }
};

//..........................................THIRD API..................................................

const getUser = async function (req, res) {
    try {
        const userId = req.params.userId

        if (!userId) {
            return res.status(400).send({ status: false, msg: "please provide userId" })
        }

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "BAD REQUEST, please enter valid userId" })
        }

        const userDetails = await userModel.findOne({ _id: userId })

        if (!userDetails) {
            return res.status(404).send({ status: false, msg: "No such user found" })
        }

        return res.status(200).send({ status: true, msg: "User profile details", data: userDetails })
    }

    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: err.message })
    }
}



//...............................UPDATE USER...........................


const updateProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const data = req.body;
        const keys = Object.keys(data);
        const file = req.files;

        if (Object.keys(data).length == 0 && (!file)) {
            return res.status(400).send({ status: false, message: 'Please Input Some Data' });
        }


        for (let i = 0; i < keys.length; i++) {
            if (keys[i] == '_id') {
                return res.status(400).send({
                    status: false, message: 'You are not able to update _id property'
                });
            }
            else {
                if (data[keys[i]].trim() == '') {
                    return res.status(400).send({
                        status: false, message: `${keys[i]} should not be empty !`
                    });
                }
                else if (keys[i] == 'email') {
                    if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/).test(data.email.trim())) {
                        return res.status(400).send({ status: false, message: 'Enter a valid Email Id' });
                    }
                }
                else if (keys[i] == 'phone') {
                    if (!(/^[6789]\d{9}$/).test(data.phone.trim())) {
                        return res.status(400).send({ status: false, message: 'The mobile number must be 10 digits and should be only Indian number' });
                    }

                }
                else if (keys[i] == 'address.shipping.pincode' || keys[i] == 'address.billing.pincode') {
                    const regex = /^\d{6}$/;
                    if (!regex.test(data[keys[i]])) {
                        return res.status(400).send({ status: false, message: `Enter the valid Pincode of ${keys[i]}` });
                    }
                }
                else if (keys[i] == 'password') {
                    if (!(data.password.length > 8 && data.password.length <= 15)) {
                        return res.status(400).send({ status: false, message: 'Minimum password should be 8 and maximum will be 15' });
                    }
                    data.password = bcrypt.hashSync(data.password, 10);
                }
            }
        }


        let duplicateMobile = await userModel.findOne({ phone: data.phone })
        if (duplicateMobile) {
            return res.status(400).send({ status: false, msg: "mobile number already exists" })
        }


        let isDuplicateEmail = await userModel.findOne({ email: data.email })
        if (isDuplicateEmail) {
            return res.status(400).send({ status: false, msg: "email already exists" })
        }

        if (file && file.length > 0) {
            if (file[0].mimetype.indexOf('image') == -1) {
                return res.status(400).send({ status: false, message: 'Only image files are allowed !' });
            }
            const profile_url = await aws.uploadFile(file[0]);
            data["profileImage"] = profile_url;
        }
        const updateRes = await userModel.findByIdAndUpdate(userId, data, { new: true });
        return res.status(200).send({ status: true, message: `${Object.keys(data).length} field has been updated successfully !`, data: updateRes });
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.messag });
    }
}


module.exports.register = register

module.exports.loginUser = loginUser

module.exports.getUser = getUser

module.exports.updateProfile = updateProfile