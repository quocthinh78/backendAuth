// three ways to interact with mongoose
/*
 * callback
 * promise
 * async/await
 */

const User = require('../models/Users')
const Deck = require('../models/Deck')
const Joi = require('@hapi/joi')
const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../config')
const encodedToken = (userId) => {
    return JWT.sign({
        iss: 'quocthinh',
        sub: userId,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 3),
    }, JWT_SECRET)
}
const signUp = async(req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    const isValidEmail = await User.findOne({ email });
    if (isValidEmail) return res.status(403).json({ error: { message: "Email is already in use" } })
    const newUser = await new User({ firstName, lastName, email, password });
    newUser.save();

    // encode a token
    const token = encodedToken(newUser._id)
    res.setHeader('dsdas', token)
    return res.status(201).json({ sucess: true })
}
const secret = async(req, res, next) => {
    res.json({ resource: true })
}
const signIn = async(req, res, next) => {
    const token = encodedToken(req.user._id);
    res.setHeader('Authorization', token);
    res.json(req.user);
    // return res.status(200).json({ success: true })
}
const authGoogle = async(req, res, next) => {
    const token = encodedToken(req.user._id);
    res.setHeader('Authorization', token);
    return res.status(200).json({ success: true })
}
const authFaceBook = async(req, res, next) => {
        const token = encodedToken(req.user._id);
        res.setHeader('Authorization', token);
        return res.status(200).json({ success: true })
    }
    // callback
    // const getAllUser = (req, res, next) => {
    //     User.find({}, (err, user) => {
    //         if (err) {
    //             console.log(err)
    //         }
    //         res.json({ user })
    //     })
    // }

// promise
// const getAllUser = (req, res, next) => {
//     User.find({}).then((users) => {
//         res.json({ users })
//     }).catch((err) => console.log(err))
// }

//callback
// const createUser = (req, res, next) => {
//     console.log(req.body)
//     const newUser = new User(req.body);
//     newUser.save((err, user) => {
//         if (err) {
//             console.log(err);
//         }
//         res.status(200).json({ user })
//     })
// }
//asyn await
const idSchema = Joi.object().keys({
    userId: Joi.string().required().regex(/^[0-9A-Za-z]{24}$/)
})
const getAllUser = async(req, res, next) => {
    const user = await User.find({})
    res.json({ user })
}

const createUser = async(req, res, next) => {
    const newUser = new User(req.value.body)
    await newUser.save();
    res.status(201).json({ user: newUser })
}
const getUser = async(req, res, next) => {
    const validateUser = idSchema.validate(req.params)
    console.log(validateUser);
    var { userId } = req.params;
    console.log(userId)
    const user = await User.findById(userId);
    res.json({ user })
}
const replaceUser = async(req, res, next) => {
    const { userId } = req.params;
    // console.log(userId)
    const user = req.body;
    const result = await User.findByIdAndUpdate(userId, user);
    res.json({ success: true })
}
const updateUsre = async(req, res, next) => {
    const { userId } = req.value.params;
    console.log("dsad", req.value.params)
    const user = req.value.body;
    const result = await User.findByIdAndUpdate(userId, user);
    res.json({ success: true })
}
const getUserDeck = async(req, res, next) => {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("decks");
    res.json(user)
}
const newUserDeck = async(req, res, next) => {
    const { userId } = req.params;
    const newDeck = new Deck(req.body);
    const user = await User.findById(userId);
    newDeck.owner = user;
    await newDeck.save();
    user.decks.push(newDeck._id);
    user.save();
    res.status(201).json({ deck: newDeck })

}

module.exports = {
    getAllUser,
    createUser,
    getUser,
    replaceUser,
    updateUsre,
    getUserDeck,
    newUserDeck,
    secret,
    signIn,
    signUp,
    authGoogle,
    authFaceBook
}