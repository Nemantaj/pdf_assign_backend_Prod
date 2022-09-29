const path = require("path");
const fs = require("fs");

const PDF = require("pdfkit");
const Contact = require("../model/Contact");

exports.postContact = (req, res, next) => {
  const fullName = req.body.name;
  const numbers = req.body.numbers;

  if (!fullName || !numbers) {
    const error = new Error("An error occured!");
    error.title = "Error Occured";
    error.statusCode = 422;
    throw error;
  }

  const newNumbers = numbers.map((doc) => {
    return { num: doc };
  });

  const newContact = new Contact({
    username: fullName,
    numbers: newNumbers,
  });

  newContact
    .save()
    .then((result) => {
      if (!result) {
        const error = new Error("An error occured!");
        error.title = "Error Occured";
        error.statusCode = 422;
        throw error;
      }

      res.status(200).json({ success: true });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getContacts = (req, res, next) => {
  Contact.find()
    .then((result) => {
      res.status(200).json({ result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.retrieveContacts = (req, res, next) => {
  const dateLte = req.body.lte;
  const dateGte = req.body.gte;

  if (!dateLte || !dateGte) {
    const error = new Error("An error occured!");
    error.title = "Error Occured";
    error.statusCode = 422;
    throw error;
  }

  Contact.find({
    createdAt: {
      $gte: dateLte,
      $lt: dateGte,
    },
  })
    .then((result) => {
      console.log(result);
      res.status(200).json({ result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPDF = (req, res, next) => {
  const entryId = req.params.entryId;

  if (!entryId) {
    const error = new Error("An error occured!");
    error.title = "Error Occured";
    error.statusCode = 422;
    throw error;
  }

  Contact.findById(entryId)
    .then((result) => {
      if (!result) {
        const error = new Error("An error occured!");
        error.title = "Error Occured";
        error.statusCode = 422;
        throw error;
      }

      const pdfName = "Contact-" + entryId;
      const pdfPath = path.join("data", pdfName);

      const pdfDoc = new PDF();
      pdfDoc.pipe(fs.createWriteStream(pdfPath));
      pdfDoc.pipe(res);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + pdfName + '"'
      );

      pdfDoc.fontSize(26).text(result.username, { underlined: true });
      pdfDoc.moveDown();
      pdfDoc.moveDown();
      result.numbers.forEach((doc) => {
        pdfDoc.fontSize(15).text(`(${doc._id}) - ${doc.num}`);
        pdfDoc.moveDown();
      });
      pdfDoc.end();
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPDFAll = (req, res, next) => {
  const entryIds = req.body.entryIds;

  if (!entryIds) {
    const error = new Error("An error occured!");
    error.title = "Error Occured";
    error.statusCode = 422;
    throw error;
  }

  Contact.find({
    _id: { $in: entryIds },
  })
    .then((result) => {
      if (!result) {
        const error = new Error("An error occured!");
        error.title = "Error Occured";
        error.statusCode = 422;
        throw error;
      }

      const pdfName = "Contact-All";
      const pdfPath = path.join("data", pdfName);

      const pdfDoc = new PDF();
      pdfDoc.pipe(fs.createWriteStream(pdfPath));
      pdfDoc.pipe(res);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + pdfName + '"'
      );

      pdfDoc.fontSize(26).text("CONTACT-LIST", { underlined: true });
      pdfDoc.moveDown();
      pdfDoc.moveDown();
      result.forEach((doc) => {
        doc.numbers.forEach((numer) => {
          pdfDoc
            .fontSize(15)
            .text(`(${numer._id}) - ${numer.num} - ${doc.username}`);
          pdfDoc.moveDown();
        });
      });
      pdfDoc.end();
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
