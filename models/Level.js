const mongoose = require('mongoose');

const LevelSchema = new mongoose.Schema({
    level: { type: Number, required: true, unique: true },
    instructionSubtitle: { type: String, required: false },
    helpCode: { type: String, required: false },
    helpDescription: { type: String, required: false },
    variableName: { type: String, required: false },
    answerPattern: { type: String, required: false },
    lesson: { type: String, required: false },
    items: [
        {
            id: { type: String, required: true },
            class: { type: String, required: true },
            image: { type: String, required: true },
        },
    ],
});

module.exports = mongoose.model('Level', LevelSchema, 'level');

