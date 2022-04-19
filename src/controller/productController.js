// const productModel = require('../model/productModel')

// const { uploadFile } = require('./awsController')

// const bcrypt = require('bcrypt')

// const validator = require('validator')

// //-------------------------------validation functions-----------------------


// const isValid = function (value) {
//     if (typeof value === 'undefined' || value === null) return false
//     if (typeof value === 'string' && value.trim().length === 0) return false
//     if (value === 0) return false
//     return true;
// }

// const isValidRequestBody = function (requestBody) {
//     return Object.keys(requestBody).length > 0
// }

// const isValidPassword = function (password) {
//     if (password.length > 7 && password.length < 16)
//         return true
// }

// const isValidfiles = function (files) {
//     if (files && files.length > 0)
//         return true
// }



// // ====================== five api ===============================================================================================//


// const createProduct = async function (req, res) {

//     try {

//         const requestBody = JSON.parse(req.body.data)
//         if (!isValidRequestBody(requestBody)) {
//             res.status(400).send({ status: false, Message: "Invalid request parameters, Please provide user details" })
//             return
//         }
//         const { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = requestBody
//         const files = req.files
//         let availableSizesNewArray = []
//         if (!isValidfiles(files)) {
//             res.status(400).send({ status: false, Message: "Please provide product's image" })
//             return
//         }
//         if (!isValid(title)) {
//             res.status(400).send({ status: false, Message: "Please provide product's title" })
//             return
//         }
//         if (!isValid(description)) {
//             res.status(400).send({ status: false, Message: "Please provide product's description" })
//             return
//         }
//         if (!isValid(price)) {
//             res.status(400).send({ status: false, Message: "Please provide product's price" })
//             return
//         }
//         if (!isValid(currencyId)) {
//             res.status(400).send({ status: false, Message: "Please provide currencyId" })
//             return
//         }
//         if (!isValid(currencyFormat)) {
//             res.status(400).send({ status: false, Message: "Please provide currency Format" })
//             return
//         }
//         if (!isValid(style)) {
//             res.status(400).send({ status: false, Message: "Please provide product's style" })
//             return
//         }
//         if (availableSizes) {
//             if (availableSizes.length === 0) {
//                 return res.status(400).send({ status: false, msg: 'please provide the product size' })
//             }
//             for (let i = 0; i < availableSizes.length; i++) {
//                 availableSizesNewArray.push(availableSizes[i].toUpperCase())
//                 if (!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(availableSizes[i]))) {
//                     return res.status(400).send({ status: false, message: `please provide available size from  ${["S", "XS", "M", "X", "L", "XXL", "XL"]}` })
//                 }

//             }
//         }
//         // ================= unique validation =====================

//         const isTitleAlreadyUsed = await productModel.findOne({ title: title });

//         if (isTitleAlreadyUsed) {
//             res.status(400).send({ status: false, message: `${title} title  is already exist` })
//             return
//         }

//         // ================= validation ends ============================

//         const productImage = await uploadFile(files[0])
//         const productData = {
//             title: title,
//             description: description,
//             price: price,
//             currencyId: currencyId,
//             currencyFormat: currencyFormat,
//             isFreeShipping: isFreeShipping,
//             style: style,
//             availableSizes: availableSizesNewArray,
//             installments: installments,
//             productImage: productImage
//         }
//         const newProduct = await productModel.create(productData)

//         res.status(201).send({ status: true, message: "product created sucessfully", data: newProduct });
//     }
//     catch (err) {
//         res.status(500).send({ status: false, Message: err.message })
//     }

// }

// // ======================= sixth api ==============================================================================================//


// const getProductBYQuery = async function (req, res) {

//     try {
//         if (req.query.size || req.query.name || req.query.priceGreaterThan || req.query.priceLessThan) {
//             let availableSizes = req.query.size
//             let title = req.query.name
//             let priceGreaterThan = req.query.priceGreaterThan
//             let priceLessThan = req.query.priceLessThan
//             obj = {}
//             if (availableSizes) {
//                 obj.availableSizes = availableSizes
//             }
//             if (title) {
//                 obj.title = { $regex: title, $options: " " }
//             }
//             if (priceGreaterThan) {
//                 obj.price = { $gt: priceGreaterThan }
//             }
//             if (priceLessThan) {
//                 obj.price = { $lt: priceLessThan }
//             }
//             obj.isDeleted = false
//             obj.deletedAt = null

//             const getProductsList = await productModel.find(obj).sort({ price: 1 })

//             if (!getProductsList || getProductsList.length == 0) {
//                 res.status(400).send({ status: false, message: `product is not available right now.` })
//             } else {
//                 res.status(200).send({ status: true, message: 'Success', data: getProductsList })
//             }
//         } else {
//             const getListOfProducts = await productModel.find({ isDeleted: false, deletedAt: null }).sort({ price: 1 })
//             res.status(200).send({ status: true, message: 'Success', data: getListOfProducts })
//         }
//     } catch (err) {
//         res.status(500).send({ status: false, msg: err.message })
//     }

// }

// // ======================= seventh api ==========================================================================================//


// const getProductById = async function (req, res) {
//     try {
//         let productId = req.params.productId
//         const searchProduct = await productModel.findById(productId)
//         if (!searchProduct) {
//             return res.status(400).send({ status: false, msg: 'product does not exist with this prouct id or incorrect product id' })
//         }
//         res.status(200).send({ status: true, msg: 'sucess', data: searchProduct })
//     }
//     catch (err) {
//         res.status(500).send({ status: false, Message: err.message })
//     }
// }

// // ======================= eight api ==============================================================================================//


// const updateProductById = async function (req, res) {
//     try {
//         const requestBody = JSON.parse(req.body.data);
//         const productId = req.params.productId
//         const checkProductId = await productModel.findOne({ _id: productId, isDeleted: false })
//         if (!checkProductId) {
//             return res.status(404).send({ status: false, msg: 'please provide valid product id ' })
//         }
//         const { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = requestBody;

//         const updateProductInfo = {}

//         const files = req.files

//         if (isValidfiles(files)) {
//             const ProfilePicture = await uploadFile(files[0])
//             updateProductInfo.profileImage = ProfilePicture
//         }
//         if (isValid(title)) {
//             const isTitleAlreadyUsed = await productModel.findOne({ title: title });
//             if (isTitleAlreadyUsed) {
//                 return res.status(400).send({ status: false, msg: `${title} already exist ` })
//             }
//             updateProductInfo.title = title
//         }
//         if (isValid(description)) {
//             updateProductInfo.description = description
//         }

//         if (isValid(price)) {
//             updateProductInfo.price = price
//         }

//         if (isValid(currencyId)) {
//             updateProductInfo.currencyId = currencyId
//         }

//         if (isValid(isFreeShipping)) {
//             updateProductInfo.isFreeShipping = isFreeShipping
//         }

//         if (isValid(currencyFormat)) {
//             updateProductInfo.currencyFormat = currencyFormat
//         }

//         if (isValid(style)) {
//             updateProductInfo.style = style
//         }
//         if (availableSizes) {

//             if (availableSizes.length === 0) {
//                 return res.status(400).send({ status: false, msg: 'please provide the product size' })
//             }
//             let array = []
//             for (let i = 0; i < availableSizes.length; i++) {
//                 array.push(availableSizes[i].toUpperCase())
//                 if (!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(array[i]))) {
//                     return res.status(400).send({ status: false, message: `please provide available size from  ${["S", "XS", "M", "X", "L", "XXL", "XL"]}` })
//                 }
//             }
//             updateProductInfo.$addToSet = { availableSizes: array }
//         }
//         if (isValid(installments)) {
//             updateProductInfo.installments = installments
//         }
//         const updatedProduct = await productModel.findOneAndUpdate({ _id: productId }, updateProductInfo, { new: true })

//         return res.status(200).send({ status: true, message: 'Success', data: updatedProduct });

//     } catch (error) {
//         return res.status(500).send({ status: false, message: error.message });
//     }

// }

// // ======================= ninth  api ================================================================================================//

// const deleteProductById = async function (req, res) {
//     try {
//         let productId = req.params.productId
//         const searchProduct = await productModel.findOne({ _id: productId, isDeleted: false })
//         if (!searchProduct) {
//             return res.status(400).send({ status: false, msg: 'product does not exist with this prouct id or already deleted' })
//         }
//         const result = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, { isDeleted: true, deletedAt: new Date() }, { new: true })
//         res.status(200).send({ status: true, msg: 'successfully deleted', data: result })
//     }
//     catch (err) {
//         res.status(500).send({ status: false, Message: err.message })
//     }

// }

// // ===================================================================================================================================//

// module.exports.createProduct = createProduct
// module.exports.getProductBYQuery = getProductBYQuery
// module.exports.getProductById = getProductById
// module.exports.updateProductById = updateProductById
// module.exports.deleteProductById = deleteProductById












const productModel = require("../model/productModel")
const validator = require("./validations")
const aws = require("./awsController")
const currencySymbol = require('currency-symbol-map')


const createProduct = async function (req, res) {
    try {

        let files = req.files;
        let productBody = req.body;

        if (!validator.isValidRequestBody(productBody)) {
            return res.status(400).send({ status: false, message: 'Please provide valid product body' })
        }

        let { title, description, productImage, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = productBody

        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, message: 'Title is required' })
        }
        const titleAleadyUsed = await productModel.findOne({ title })
        if (titleAleadyUsed) {
            return res.status(400).send({ status: false, message: `${title} is alraedy in use. Please use another title` })
        }

        if (!validator.isValidRequestBody(files)) {
            return res.status(400).send({ status: false, message: 'Product Image is required' })
        }

        if (!validator.isValid(description)) {
            return res.status(400).send({ status: false, message: 'Description is required' })
        }

        if (!validator.isValid(price)) {
            return res.status(400).send({ status: false, message: 'Price is required' })
        }

        if (!validator.isValid(currencyId)) {
            return res.status(400).send({ status: false, message: 'currencyId is required' })
        }

        if (currencyId != 'INR') {
            return res.status(400).send({ status: false, message: 'currencyId should be INR' })
        }

        if (!validator.isValid(currencyFormat)) {
            currencyFormat = currencySymbol('INR')
        }
        currencyFormat = currencySymbol('INR')


        if (style) {
            if (!validator.validString(style)) {
                return res.status(400).send({ status: false, message: 'style is required' })
            }
        }

        if (installments) {
            if (!validator.isValid(installments)) {
                return res.status(400).send({ status: false, message: 'installments required' })
            }
        }
        if (installments) {
            if (!validator.validInstallment(installments)) {
                return res.status(400).send({ status: false, message: `installments can't be a decimal number` })
            }
        }

        if (isFreeShipping) {
            if (!(isFreeShipping != true)) {
                return res.status(400).send({ status: false, message: 'isFreeShipping must be a boolean value' })
            }
        }

        productImage = await aws.uploadFile(files[0])

        const productData = { title, description, productImage, price, currencyId, currencyFormat: currencyFormat, isFreeShipping, style, availableSizes, installments, productImage: productImage }
        
        if (availableSizes) {
            let size = availableSizes.split(",").map(x => x.trim())

            for (let i = 0; i < size.length; i++) {
                if (!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(size[i]))) {
                    return res.status(400).send({ status: false, message: `availableSizes should be among ${["S", "XS", "M", "X", "L", "XXL", "XL"].join(', ')}` })
                }
            }
            if (size) {
                productData.availableSizes = size
            }
        }
        const saveProductDetails = await productModel.create(productData)
        return res.status(201).send({ status: true, message: 'Successfully saved product details', data: saveProductDetails })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message})
    }
}

// getAllProducts
const getProductbyQuery = async function(req,res) {
    try {
        const queryParams = req.query
        const body = req.body

        if(validator.isValidRequestBody(body)) {
            return res.status(400).send({ status: false, message: `Don't you understand about query params` })
        }

        const { title, priceGreaterThan, priceLessThan, priceSort, size } = queryParams

        const product = {}

        if(size) {

            const searchSize = await productModel.find({availableSizes: size, isDeleted: false}).sort({price: priceSort})

            if(searchSize.length !== 0) {
                return res.status(200).send({ status: true, message: 'Success', data: searchSize})
            }
            else {
                return res.status(400).send({status: false, message: `product not found with this ${size}`})
            }
        }

        if(title) {
            const searchName = await productModel.find({title: {$regex: title}, isDeleted: false}).sort({price: priceSort})

            if(searchName.length !== 0) {
                return res.status(200).send({status: true, message: 'Success', data: searchName})
            }
            else {
                return res.status(400).send({status: false, message: `product not found with this ${title}`})
            }
        }

        if(priceGreaterThan) {
            product["$gt"] = priceGreaterThan// product.price = {$gte: priceGreaterThan}
        }

        if(priceLessThan) {
            product["$lt"] = priceLessThan // product.price = {$lte: priceLessThan}
        }

        if(priceLessThan || priceGreaterThan) {
            const searchPrice = await productModel.find({price: product, isDeleted: false}).sort({price: priceSort})

            if(searchPrice.length !== 0) {
                return res.status(200).send({status: true, message: 'Success', data: searchPrice})
            }
            else {
                return res.status(400).send({status: false, message: 'product not found with this range' })
            }                
        }

        const Products = await productModel.find({data: product, isDeleted: false}).sort({price: priceSort})
        if(Products !== 0) {
            return res.status(200).send({status: true, message: 'Success', count: Products.length, data: Products})
        }
        else {
            return res.status(404).send({status: false, message: 'No product exist in database'})
        }
    }
    catch (error) {
        res.status(500).send({status: false, error: error.message })
    }
}


const getProduct = async function (req, res) {
    try {
        let productId = req.params.productId

        if (!validator.isValidRequestBody(productId)) {
            return res.status(400).send({ status: false, msg: "please provide productId" })
        }

        if (!validator.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: `${productId} is not a valid product id ` })
        }

        let getProductData = await productModel.findById(productId)

        if (!getProductData) {
            return res.status(404).send({ status: false, message: "Product is Not Found" })
        }

        return res.status(200).send({ status: true, msg: "Product Details", data: getProductData })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}




const updateProduct = async function (req, res) {
    try {
        const productId = req.params.productId
        const data = req.body

        if (!validator.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid Product id" })
        }

        if (!validator.isValidRequestBody(data)) {
            if (!(validator.isValidRequestBody(req.files)))
                return res.status(400).send({ status: false, msg: "Please enter Data to be updated" })
        }

        let { title, description, price, currencyId, currencyFormat, availableSizes } = data

        let checkProduct = await productModel.findOne({ _id: productId, isDeleted: true })
        if (checkProduct) {
            return res.status(400).send({ status: false, msg: "Product Already Deleted" })
        }

        if (title) {
            if (!validator.isValid(title)) {
                return res.status(400).send({ status: false, msg: "Please enter title" })
            }

            const titleUsed = await productModel.findOne({ title })
            if (titleUsed) {
                return res.status(400).send({ status: false, msg: "title must be unique" })
            }
        }

        if (description) {
            if (!validator.isValid(description)) {
                return res.status(400).send({ status: false, msg: "Please enter description" })
            }
        }

        if (price) {
            if (!validator.isValid(price)) {
                return res.status(400).send({ status: false, msg: "Please enter Price" })
            }
        }

        if (currencyId) {
            if (!validator.isValid(currencyId)) {
                return res.status(400).send({ status: false, msg: "Please enter currencyId" })
            }

            if (!validator.isINR(currencyId)) {
                return res.status(400).send({ status: false, msg: "Currencr Id must be INR" })
            }
        }

        if (currencyFormat) {
            if (!validator.isValid(currencyFormat)) {
                return res.status(400).send({ status: false, msg: "Please enter currency format" })
            }

            if (!validator.isRs(currencyFormat)) {
                return res.status(400).send({ status: false, msg: "Currency Format must be Rs" })
            }
        }

        if (availableSizes) {
            if (!validator.isValid(availableSizes)) {
                return res.status(400).send({ status: false, msg: "Please enter available sizes" })
            }

            if (!validator.isValidSizes(availableSizes)) {
                return res.status(400).send({ status: false, msg: "Available Sizes should be from ['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL']" })
            }
        }

        if (req.files) {
            let files = req.files
            if (files && files.length > 0) {
                var uploadedFileURL = await aws.uploadFile(files[0])
            }
        }

        const productUpdated = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, { $set: data }, { new: true })
        if (!productUpdated) {
            return res.status(404).send({ status: false, msg: "No Such Product exists" })
        }

        productUpdated["productImage"] = uploadedFileURL

        return res.status(200).send({ status: true, msg: "Data Updated Succesfully", data: productUpdated })
    }

    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: error.message })
    }

}



const deleteProduct = async function (req, res) {
    try {
        let productId = req.params.productId

        if (!productId) {
            return res.status(400).send({ status: false, msg: "please provide productId" })
        }

        if (!validator.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid Product id" })
        }

        let checkProduct = await productModel.findOne({ _id: productId, isDeleted: true })
        if (checkProduct) {
            return res.status(400).send({ status: false, msg: "Product Already Deleted" })
        }
        else {
            let deleteNow = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, { isDeleted: true, deletedAt: Date.now() }, { new: true })
            if (deleteNow == null) {
                return res.status(404).send({ status: false, msg: "Product Not Exists" });
            }
            else {
                return res.status(200).send({ status: true, msg: "Product Deleted Successfully", data: deleteNow })
            }
        }

    }
    catch (error) {
        return res.status(500).send({ msg: "Error", error: error.message })
    }

}


module.exports = { createProduct, getProductbyQuery, getProduct, updateProduct, deleteProduct, }