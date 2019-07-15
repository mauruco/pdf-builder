const PDFLandscape = require('./pdfLandscape').default;

module.exports = {
  PDFBuilder: {
    landscape: (data, fileName) => new PDFLandscape(data, fileName),
  },
};
