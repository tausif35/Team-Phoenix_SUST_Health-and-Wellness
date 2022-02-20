const HttpError = require("../models/http-error");

const drugs = require("../database/drugs");

exports.getDrug = (req, res, next) => {
  // console.log(drugs);
  const { drugName } = req.query;
  let drug;
  drug = drugs.find((drug) => {
    const drug_Name = drug.Name.toLowerCase();
    return drug_Name === drugName.toLowerCase();
  });
  if (!drug) {
    return next(new HttpError("Drug not found", 404));
  }
  res.status(201).json({ drug: drug });
};
