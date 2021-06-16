// three ways to interact with mongoose
/*
 * callback
 * promise
 * async/await
 */

const User = require('../models/Users')
const Deck = require('../models/Deck')


const getAllDeck = async(req, res, next) => {
    const decks = await Deck.find({});
    res.json(decks)
}

const createDeck = async(req, res, next) => {
    // find owner 
    const owner = await User.findById(req.body.owner)
        //create new deckS
    const deck = req.body;
    deck.owner = owner._id;
    const newDeck = new Deck(deck);
    await newDeck.save();
    owner.decks.push(newDeck._id);
    await owner.save();
    res.json(deck)
}

const getDeck = async(req, res, next) => {
    const { deckId } = req.params;
    const deck = await Deck.findById(deckId);
    return res.json(deck)
}
const replaceDeck = async(req, res, next) => {
    const { deckId } = req.params;
    const newDeck = req.body;
    const result = await Deck.findByIdAndUpdate(deckId, newDeck);
    res.json({ result })
}
const updateDeck = async(req, res, next) => {
    const { deckId } = req.params;
    const newDeck = req.body;
    const result = await Deck.findByIdAndUpdate(deckId, newDeck);
    res.json({ result })
}
const deleteDeck = async(req, res, next) => {
    const { deckId } = req.params;
    const deck = await Deck.findById(deckId);
    const ownerId = deck.owner
    const owner = await User.findById(ownerId);
    await deck.remove();
    owner.decks.pull(deck);
    await owner.save();
    res.json("ok")

}

module.exports = {
    getAllDeck,
    createDeck,
    getDeck,
    replaceDeck,
    updateDeck,
    deleteDeck,
}