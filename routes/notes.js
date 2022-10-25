const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//ROUT 1: Get all notes (GET -> only read)
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

//ROUT 2: Add a note (POST -> only read) 
router.post('/addnote', fetchuser, [
    body('title').isLength({ min: 1 }),
    body('description', 'Description length must be of 1 character').isLength({ min: 1 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save();
        res.json(saveNote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }

})
//ROUT 3: Update notes (PUT -> only read)
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //create a newnote object
        const newnotes = {};
        if (title) {
            newnotes.title = title;
        };
        if (description) {
            newnotes.description = description;
        };
        if (tag) {
            newnotes.tag = tag;
        };

        //find the note to be uploaded and update it
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Changes not Allowed by other user")
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newnotes }, { new: true })
        res.json({ note })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }

})
//ROUT 4: Update notes (DELETE -> only read)
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //find the note to be delete and delete it 
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        //Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Allowed by other user")
        }
        
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": " Note deleted" })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }

})

module.exports = router;