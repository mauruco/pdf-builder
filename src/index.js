const PDFLandscape = require('./pdfLandscape').default;
/*
const PDFBuilder = require('PDFBuilder');
const data = [
  { // todas as propriedades são opcionais
    style: {}, //  (wrapper style) javascript style, expl: backgroundColor e não background-color
    logo: { src: '', alt: 'logo', style: {} }, // use src="base64Encoded" expl: src="data:image/png;base64,HDOIFF...."
    title: { innerHTML: 'Lorem Ipsum Dollor', style: {} }, // innerHTML aceita tbm html, expl: innerHTML: '<span class="red" style="color: 'red';">Lorem Ipsum</spam>'
    descLeft: { innerHTML: 'Lorem Ipsum Dollor', style: {} },
    descRight: { innerHTML: 'Lorem Ipsum Dollor', style: {} },
    counter: { innerHTML: 'page $1/$2', style: {} }, // $1 = pagina atual, $2 = paginas total
    table: {
      style: {},
      thead: [
        [{ innerHTML: 'dados titulo', style: {} }, { innerHTML: 'dados titulo', style: {} }],
      ],
      tbody: [
        [{ innerHTML: 'dados', style: {} }, { innerHTML: 'dados', style: {} }],
        [{ innerHTML: 'dados', style: {} }, { innerHTML: 'dados', style: {} }],
        [{ innerHTML: 'dados', style: {} }, { innerHTML: 'dados', style: {} }],
        [{ innerHTML: 'dados', style: {} }, { innerHTML: 'dados', style: {} }],
        [{ innerHTML: 'dados', style: {} }, { innerHTML: 'dados', style: {} }],
        [{ innerHTML: 'dados', style: {} }, { innerHTML: 'dados', style: {} }],
        [{ innerHTML: 'dados', style: {} }, { innerHTML: 'dados', style: {} }],
        [{ innerHTML: 'dados', style: {} }, { innerHTML: 'dados', style: {} }],
        [{ innerHTML: 'dados', style: {} }, { innerHTML: 'dados', style: {} }],
        [{ innerHTML: 'dados', style: {} }, { innerHTML: 'dados', style: {} }],
        [{ innerHTML: 'dados', style: {} }, { innerHTML: 'dados', style: {} }],
        [{ innerHTML: 'dados', style: {} }, { innerHTML: 'dados', style: {} }],
      ],
    },
  },
];
PDFBuilder.landscape(data, 'filename');
*/
module.exports = {
  landscape: (data, fileName) => new PDFLandscape(data, fileName),
};
