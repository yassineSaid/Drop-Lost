const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;
const objetCategories = ["smartphone", "electronique", "document", "cle", "lunette", "outils", "vetement", "autre"]
const objetSchema = new Schema({
    categorie: {
        type: String,
        enum: ["smartphone", "electronique", "document", "cle", "lunette", "outils", "vetement", "autre"],
        required: true
    },
    sousCategorie: {
        type: String
    },
    marque: {
        type: String
    },
    modele: {
        type: String
    },
})
const personnesSchema = new Schema({
    sexe: {
        type: String,
        enum: ['homme', 'femme'],
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    nom: {
        type: String,
    },
})
const animalSchema = new Schema({
    nom: {
        type: String,
    },
    type: {
        type: String,
        required: true,
        enum: ["chien", "chat", "autre"]
    },
    race: {
        type: String
    }
})
const annonceSchema = new Schema({
    type: {
        type: String,
        enum: ['objet', 'personne', 'animal'],
        required: true
    },
    trouve: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    animal: {
        type: animalSchema
    },
    objet: {
        type: objetSchema,
        validate: validateObjet
    },
    personne: {
        type: personnesSchema
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    images: {
        type: [String]
    }
});
function isNullOrEmpty(value) { 
    if (value == null ||  
        value == undefined || 
        value.length == 0) { 
        return true; 
    } else { 
        return false; 
    } 
} 
function validateObjet(objet) {
    if (objet.categorie === "smartphone" && (isNullOrEmpty(objet.marque) || isNullOrEmpty(objet.modele))) {
        return false
    }
    else if ((!isNullOrEmpty(objet.categorie) && objet.categorie !== "smartphone") && isNullOrEmpty(objet.sousCategorie)) {
        return false
    }
    return true
}
annonceSchema.pre('save', async function (next) {
    try {
        next();
    } catch (error) {
        next(error);
    }
});
const Annonce = mongoose.model('annonce', annonceSchema);

module.exports = Annonce;