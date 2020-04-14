const User = require('../models/user');
const Annonce = require('../models/annonce')
module.exports = {
    ajouterAnnonce: async (req, res, next) => {
        //console.log(req.body)
        const annonce = new Annonce(req.body);
        try {
            const result = await annonce.save();
            console.log(result);
        } catch (err) {
            console.log(err)
        }
        res.status(200).json({ success: true });
    },
}