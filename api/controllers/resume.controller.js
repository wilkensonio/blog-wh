const path = require('path');
const fs = require('fs');

const resumePath = path.join(__dirname, '../public/resume/resumepdf/resume.pdf'); 
exports.downloadResume = (req, res) => {
    if (fs.existsSync(resumePath)) {
        res.download(resumePath, 'resume.pdf', (err) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error downloading the resume');
            }
        });
    }
    else {
        res.status(404).send('Resume not found');
    } 
};