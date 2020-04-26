const User = require('../models/user');
const Annonce = require('../models/annonce')
const LabelledFaceDescriptor = require('../models/LabelledFaceDescriptor')
const getValidationErrors = require('../models/validationErrors')
const path = require("path");
const multer = require("multer");
const jaccard = require('jaccard-similarity-sentences');
var stringSimilarity = require('string-similarity');
require("@tensorflow/tfjs-node");
var faceapi = require("face-api.js")
var canvas = require("canvas")
const { Image, loadImage, ImageData, createCanvas, HTMLCanvasElement, HTMLImageElement, Canvas } = canvas;
faceapi.env.monkeyPatch({
    Image, Canvas, ImageData
})

const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function (req, file, cb) {
        cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
}).any();
module.exports = {
    ajouterAnnonce: async (req, res, next) => {
        //console.log(req.body)
        const annonce = new Annonce(req.body);
        annonce.user = req.user._id;
        console.log(annonce)
        try {
            const result = await annonce.save();
            console.log(result);
            res.status(201).json({ success: true, result: result });

        } catch (err) {
            var errors = getValidationErrors(err.errors)
            console.error(errors)
            res.status(500).json({ success: false, errors: errors });
            //const validation = new ValidationErrors(err)
            //console.log(validation)
        }
    },
    ajouterImages: async (req, res, next) => {
        upload(req, res, (err) => {
            if (!err) {
                console.log(req.params)
                var images = [];
                req.files.forEach(element => {
                    images.push(element.filename)
                });
                const annonce = Annonce.findById(req.params.id).then(async function (annonce) {
                    console.log(annonce)
                    annonce.images = images;
                    annonce.save().then(async function (result) {
                        /* if (typeof annonce.personne !== "undefined") {
                            await faceapi.nets.ssdMobilenetv1.loadFromDisk("./public/weights/")
                            await faceapi.nets.faceLandmark68Net.loadFromDisk("./public/weights/")
                            await faceapi.nets.faceRecognitionNet.loadFromDisk("./public/weights/")
                            const labeledFaceDescriptors = await Promise.all(
                                item.images.map(async function (label) {
                                    console.log("CCCCCCCCCCCCCCCCCCCCCC")
                                    // fetch image data from urls and convert blob to HTMLImage element
                                    const imgUrl = `./public/uploads/${label}`
                                    const img = await canvas.loadImage(imgUrl)

                                    // detect the face with the highest score in the image and compute it's landmarks and face descriptor
                                    const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()

                                    if (!fullFaceDescription) {
                                        throw new Error(`no faces detected for ${label}`)
                                    }

                                    const faceDescriptors = [fullFaceDescription.descriptor]
                                    return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
                                })
                            )
                            const descriptor = new LabelledFaceDescriptor({
                                annonce: annonce._id,
                                descriptor: labeledFaceDescriptors
                            });
                            descriptor.save()
                        } */
                        res.status(201).json({ success: true, result: result });
                    })
                        .catch(err => {
                            res.status(500).json({ success: true, error: err });
                        })
                })

            }
        })
    },
    matchAnnonce: async (req, res, next) => {
        console.log(req.body)
        const annonces = getMatchedAnnonces(req.body.id, req.user).then(annonces => {
            res.status(200).json({ success: true, annonces: annonces })
        })
    },
    mesAnnonces: async (req, res, next) => {
        try {
            const annonces = await Annonce.find({ "user": req.user._id }).sort('date')
            console.log(req.user._id)
            res.status(200).json({ success: true, annonces: annonces });
        }
        catch (err) {
            console.log(error)
            res.status(500).json({ success: false, errors: err });
        }
    },
    getAnnoncesPerdus: async (req, res, next) => {
        try {
            const annonces = await Annonce.find({ "trouve": 'false' }).sort('date')
            res.status(200).json({ success: true, annonces: annonces });
        }
        catch (err) {
            console.log(error)
            res.status(500).json({ success: false, errors: err });
        }
    },
    getAnnonce: async (req, res, next) => {
        try {
            console.log("User: " + req.user)
            const annonce = await Annonce.findById(req.params.id)
            var response = { success: true, annonce: annonce, matched: false, annonces: [] }
            const annonces = await getMatchedAnnonces(req.params.id, req.user).then(
                annonces => {
                    console.log(annonces)
                    response = {
                        ...response,
                        matched: true,
                        annonces: annonces
                    }
                    res.status(200).json(response);
                },
                error => {
                    res.status(200).json(response);
                }
            )
                .catch(error => {
                    res.status(200).json(response);
                })
            //console.log(response)
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ success: false, errors: err });
        }
    }
}
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
async function getMatchedAnnonces(id, user) {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAa")
    var sentence1 = "J'ai perdu mon iphone 6s hier zone manar 3. C'est un iphone rose gold, dans une coque silicone noir.";
    var sentence2 = "J'ai trouvé un iphone 6s aux alentours du manar. il est rose et cache noir.";
    var sentence3 = "aman chkoun chefha el tofla hedhii!!! Berah ekher mara kenet maaya fil menzah 5 lebssa maryoul rose w jean !!! i3ayechkom eli ychoufha ikalamni "
    var sentence4 = "Fama tofla mahboula, men bekri w heya t3ayat wahad'ha fel chera3! lebssa pull rose , fama chkoun ya3rafha ??"
    var tab1 = sentence1.trim().split(" ");
    var tab2 = sentence2.trim().split(" ");
    var measure = jaccard.jaccardSimilarity(sentence1, sentence2);
    var measure1 = jaccard.jaccardSimilarity(sentence3, sentence4);
    console.log(measure);
    console.log(measure1);
    console.log(stringSimilarity.compareTwoStrings(sentence1, sentence2))
    console.log(stringSimilarity.compareTwoStrings(sentence3, sentence4))

    const annonce = await Annonce.findById(id);
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAa")
    let promise = new Promise(async function (resolve, reject) {
        console.log(annonce)
        if (typeof user === "undefined") {
            reject(new Error("Vous devez être connecté"))
        }
        if (annonce) {
            var query = {}
            if (annonce.trouve) {
                query.trouve = false
                query.date = {
                    $lte: annonce.date
                }
            } else {
                query.trouve = true
                query.date = {
                    $gte: annonce.date
                }
            }
            if (typeof annonce.objet !== "undefined") {
                query["objet.categorie"] = annonce.objet.categorie
                query["objet.sousCategorie"] = annonce.objet.sousCategorie
                query["objet.marque"] = annonce.objet.marque
                query["objet.modele"] = annonce.objet.modele
            }
            if (typeof annonce.personne !== "undefined") {
                query["personne.sexe"] = annonce.personne.sexe
                if (annonce.images.length > 0) {
                    await faceapi.nets.ssdMobilenetv1.loadFromDisk("./public/weights/")
                    await faceapi.nets.faceLandmark68Net.loadFromDisk("./public/weights/")
                    await faceapi.nets.faceRecognitionNet.loadFromDisk("./public/weights/")
                    const labeledFaceDescriptors = await Promise.all(
                        annonce.images.map(async label => {
                            // fetch image data from urls and convert blob to HTMLImage element
                            const imgUrl = `./public/uploads/${label}`
                            const img = await canvas.loadImage(imgUrl)

                            // detect the face with the highest score in the image and compute it's landmarks and face descriptor
                            const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()

                            if (!fullFaceDescription) {
                                throw new Error(`no faces detected for ${label}`)
                            }

                            const faceDescriptors = [fullFaceDescription.descriptor]
                            return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
                        })
                    )
                    const maxDescriptorDistance = 0.6
                    var faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance)
                }
            }
            await Annonce.find(query).then(async annoncesDoc => {
                var annonces = []
                annoncesDoc.forEach(item => {
                    var annonce = item.toObject()
                    annonce.score = 0;
                    annonce.scoreTotal = 0;
                    annonces.push(annonce)
                })
                console.log(annonces)
                var response = []
                if (typeof annonce.objet !== "undefined") {
                    console.log("SEARCHING FOR OBJET")
                    annonces.forEach(item => {
                        item.score += 2
                        item.scoreTotal += 2;
                        item.score += jaccard.jaccardSimilarity(annonce.description, item.description)
                        item.scoreTotal += 1
                    })
                    response = annonces.sort((a, b) => {
                        return a.score - b.score
                    }).reverse().slice(0, 4)
                }
                if (typeof annonce.personne !== "undefined") {
                    console.log("SEARCHING FOR PERSONNE")
                    await asyncForEach(annonces, async (item) => {
                        item.score += 0.5
                        item.scoreTotal += 0.5;
                        item.score += jaccard.jaccardSimilarity(annonce.description, item.description);
                        item.scoreTotal += 1;
                        if ("nom" in item.personne && "nom" in annonce.personne) {
                            item.score += stringSimilarity.compareTwoStrings(item.personne.nom, annonce.personne.nom)
                            item.scoreTotal += 1;
                        }
                        if (item.images.length > 0 && annonce.images.length > 0) {
                            var bestResult = 1;
                            await asyncForEach(item.images, async (image) => {
                                var localBestResult = 1;
                                const img = await canvas.loadImage("./public/uploads/" + image)
                                let fullFaceDescriptions = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors()
                                const results = fullFaceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor))
                                console.log(results)
                                results.map(r => {
                                    if (r.distance<bestResult) localBestResult=r.distance
                                })
                                if (localBestResult<bestResult) bestResult=localBestResult
                            })
                            var faceScore = 1-bestResult;
                            item.score+=faceScore;
                            item.scoreTotal+=1
                        }
                    })
                    console.log(annonces)
                    response = annonces.sort((a, b) => {
                        return a.score - b.score
                    }).reverse().slice(0, 4)
                }
                resolve(response)
            })
        }
        else {
            reject(new Error("Cette annonce n'éxiste pas"))
        }
    })
    return promise;

}