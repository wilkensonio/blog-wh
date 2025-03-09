const cert = require('../models/certs');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');

const certs = async (req, res) => { 
    const certs = await cert.find();
    const isAdmin = req.user && req.user.isAdmin === true;
    const isWriter = req.user && req.user.isWriter === true;
    const resume = req.user && req.user.resume === true; 
    res.render('certs/index', { certs, isAdmin, isWriter, resume });
}

const formCert = (req, res) => {
    const isAdmin = req.user && req.user.isAdmin === true;
    const isWriter = req.user && req.user.isWriter === true;
    const resume = req.user && req.user.resume === true;
    res.render('certs/new', { isAdmin, isWriter, resume });
}

const deleteCert = async (req, res) => {
    try {
        const { id } = req.params;
        const oneCert = await cert.findById(id);
        if (!oneCert) {
            return res.status(404).json({ error: 'Cert not found' });
        }
        defualtImageUrl = '/certsUploads/default.jpg';
        if (oneCert.imageUrl !== defualtImageUrl) {
            try {
                const imagePath = path.join(__dirname, `../public${oneCert.imageUrl}`);
                fs.promises.unlink(imagePath);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Error deleting oneCert image' });
            }
        }
        await cert.findByIdAndDelete(id);
        res.redirect('/certs');
    } catch (error) { 
        console.error(error);
        return res.status(400).json({ error: error.message });
    } 
}

const createCert = async (req, res) => {
    try {

        const { title } = req.body;
        let imageUrl;

        if (req.file) {
            imageUrl = req.file.path.split('public')[1];
        } else {
            imageUrl = '/certsUploads/default.jpg';
        }
        const newCert = new cert({
            title,
            imageUrl,
            slug: slugify(title, { lower: true, strict: true })
        });
        await newCert.save();
        res.redirect('/certs');
    } catch (error) { 
        console.error(error);
        res.status(400).json({ error: error.message });
    }
}

const updateCert = async (req, res) => {

    const { id } = req.params;
    const { title } = req.body;
    let imageUrl;

    if (req.file) {
        imageUrl = req.file.path.split('public')[1];
    } else {
        imageUrl = '/certsUploads/default.jpg';
    }
    const cert = await cert.findById(id);
    if (!cert) {
        return res.status(404).json({ error: 'Cert not found' });
    }
    cert.title = title;
    cert.imageUrl = imageUrl;
    await cert.save();
    res.redirect('/certs');
}

const editCertForm = async (req, res) => {
    try {
        const { id } = req.params;
        const cert = await cert.findById(id);
        if (!cert) {
            return res.status(404).json({ error: 'Cert not found' });
        }
        const isAdmin = req.user && req.user.isAdmin === true;
        const isWriter = req.user && req.user.isWriter === true;
        res.render('certs/edit', { cert, isAdmin, isWriter });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    certs,
    formCert,
    deleteCert,
    createCert,
    updateCert,
    editCertForm
}