const HttpError = require('../models/http-error');


const drugs = require('../database/drugs');

const getDrug = (req, res, next) => {
    console.log(drugs);
    const {drugName} = req.body;
    const drug =  drugs.find((drug)=>{
        const drug_Name = drug.Name.toLowerCase();
        return drug_Name === drugName.toLowerCase();
    });
    if(!drug){
        return next(new HttpError('Drug not found', 404));
    }
    res.status(201).json({drug: drug});
};

exports.getDrug = getDrug;