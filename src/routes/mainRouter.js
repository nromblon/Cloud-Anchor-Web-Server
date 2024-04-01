import express from "express";
import Group from "../models/Group.js";

const router = express.Router();

router.use(express.json());

router.post('/register', async (req, res) => {
    try {
        const result = await Group.create({
            groupName: req.body.groupName,
            password: req.body.password,
            anchorIds: []
        });

        console.log(`created group: `);
        console.log(result);
        res.status(200).json('success');
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// RETRIEVE group's all anchors
router.get('/anchors', async (req, res) => {
    const groupName = req.query.groupName;

    try {
        const anchorIds = await Group.findOne({groupName: groupName})
            .select('anchorIds').lean().exec();

        console.log(anchorIds);
        res.json(anchorIds);
    } catch(err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// RETRIEVE n latest anchors from group
router.get('/latest-anchor', async (req, res) => {
    const groupName = req.query.groupName;
    const amount = parseInt(req.query.amount) ?? 1;
    try {
        const result = await Group.findOne({groupName: groupName})
            .select('anchorIds').lean().exec();
        const latest = result.anchorIds.slice(0, amount);
        console.log(latest);
        res.json(latest);
    } catch(err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// ADD ANCHOR
router.post('/anchors', verifyPassword, async (req, res) => {
    console.log('POST /anchors received');
    console.log(req.body);
    const groupName = req.body.groupName;
    const anchorId = req.body.anchorId;
    try {
        const result = await Group.updateOne(
            {groupName: groupName}, 
            {
                $addToSet: {
                    anchorIds: anchorId
                }
            }).exec();

        console.log(result);
        res.sendStatus(200);
    } catch(err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// DELETE anchors from group
router.delete('/anchors', verifyPassword, async (req, res) => {
    const groupName = req.body.groupName;
    const anchorId = req.body.anchorId;
    try {
        const result = await Group.updateOne(
            {groupName: groupName}, 
            {
                $pull: {
                    anchorIds: anchorId
                }
            }).exec();

        console.log(result);
        res.sendStatus(200);
    } catch(err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// CLEAR all anchors
router.delete('/clear-anchors', verifyPassword, async (req, res) => {
    const groupName = req.body.groupName;
    try {
        const result = await Group.updateOne(
            {groupName: groupName}, 
            {
                $set: {
                    anchorIds: []
                }
            }).exec();

        console.log(result);
        res.sendStatus(200);
    } catch(err) {
        console.error(err);
        res.status(500).json(err);
    }
});

async function verifyPassword(req, res, next) {
    const grpName = req.body.groupName;
    const pw = req.body.password;

    const foundGroup = await Group.findOne({groupName: grpName}).exec();

    if (foundGroup) {
        if (foundGroup.password == pw)
            next();
        else
            res.status(400).json('incorrect password');
    }
    else
        res.status(400).json('group not found');
}

export default router;