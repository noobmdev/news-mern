const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
const htmlPdf = require("html-pdf");

module.exports.buildPdf = async ({ filename, article, update = false }) => {
  await createPdfForm(filename, article, update);

  const originalFilePath = path.join("public", "files", filename);
  let formPath = `form_${filename}.pdf`;
  if (update) {
    formPath = `form_${filename}`;
  }

  const originalArticleBytes = fs.readFileSync(originalFilePath);
  const formArticleBytes = fs.readFileSync(formPath);

  const [firstDonorPdfDoc, secondDonorPdfDoc] = await Promise.all([
    PDFDocument.load(formArticleBytes),
    PDFDocument.load(originalArticleBytes),
  ]);

  const pdfDoc = await PDFDocument.create();

  const [firstDonorPage] = await pdfDoc.copyPages(firstDonorPdfDoc, [0]);

  await Promise.all(
    secondDonorPdfDoc.getPageIndices().map(async (page) => {
      const [secondDonorPage] = await pdfDoc.copyPages(secondDonorPdfDoc, [
        page,
      ]);
      pdfDoc.addPage(secondDonorPage);
    })
  );

  pdfDoc.insertPage(0, firstDonorPage);

  const pdfBytes = await pdfDoc.save();

  let pathBuild = path.join(
    "public",
    "files",
    update ? filename : `build_${filename}.pdf`
  );
  fs.open(pathBuild, "w", function (err, fd) {
    fs.write(fd, pdfBytes, 0, pdfBytes.length, null, function (err) {
      fs.close(fd, function () {
        fs.unlink(formPath, (err) => {
          if (err) console.log(err);
          else {
            console.log("\nDeleted file: ", formPath);
            if (!update) {
              fs.unlink(originalFilePath, (err) => {
                if (err) throw err;
                else {
                  console.log("\nDeleted file: ", originalFilePath);
                }
              });
            }
          }
        });
      });
    });
  });
};

const createPdfForm = (filename, article, update = false) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.join(__dirname, "template.ejs"),
      {
        article,
      },
      (err, data) => {
        if (err) {
          throw err;
        } else {
          let options = {
            height: "11.25in",
            width: "8.5in",
            header: {
              height: "20mm",
            },
            footer: {
              height: "20mm",
            },
          };
          htmlPdf
            .create(data, options)
            .toFile(
              update ? `form_${filename}` : `form_${filename}.pdf`,
              function (err, data) {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              }
            );
        }
      }
    );
  });
};

exports.removeFile = (filename) =>
  new Promise((resolve, reject) => {
    const removePath = path.join("public", "files", filename);
    fs.unlink(removePath, (err) => {
      if (err) throw reject(err);
      else console.log("\nDeleted file: ", removePath);
      resolve();
    });
  });
