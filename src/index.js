import * as jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
/*
EXEMPLO:
Para fazer um pdf multi pagina é só adionar mais elementos ao array pdf, expl: const pdf = [{ title: { innerHTML: 'teste1' } }, { title: { innerHTML: 'teste2' } }];
const pdf = [
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
new PDFFinanceiro(pdf, 'nomeArquivo');
*/
class PDFFinanceiro {
  scaleFactor = 1.62;

  scaleFactorPDF = 0.62;

  resetStyle = {
    fontFamily: 'Arial, Helvetica, sans-serif',
    margin: '0px',
    padding: '0px',
  };

  loaderStyle = {
    position: 'fixed',
    top: '0px',
    left: '0px',
    zIndex: '99999',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  };

  pageStyle = {
    display: 'border-box',
    position: 'absolute',
    top: '0px',
    left: '0px',
    width: '1187px',
    height: '842px',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  };

  logoStyle = {
    display: 'block',
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: '158px',
    height: '46px',
  };

  titleStyle = {
    position: 'absolute',
    top: '28px',
    left: '200px',
    fontSize: '24px',
  };

  descLeftStyle = {
    position: 'absolute',
    top: '75px',
    left: '20px',
    fontSize: '16px',
  };

  descRightStyle = {
    position: 'absolute',
    top: '75px',
    right: '22px',
    fontSize: '16px',
    textAlign: 'right',
  };

  pageCounterStyle = {
    position: 'absolute',
    bottom: '20px',
    right: '22px',
    fontSize: '12px',
    textAlign: 'right',
  };

  tableStyle = {
    position: 'absolute',
    top: '105px',
    left: '20px',
    fontSize: '12px',
    maxWidth: '1147px',
    maxHeight: '802px',
    width: '100%',
    borderCollapse: 'collapse',
    overflow: 'hidden',
  };

  trStyle = {
  };

  thStyle = {
    textAlign: 'center',
    border: '1px solid #000000',
    padding: '3px',
  };

  tdStyle = {
    textAlign: 'center',
    border: '1px solid #000000',
    padding: '3px',
  };

  constructor(pages, fileName) {
    this.fileName = fileName || `not_named_${Date.now()}`;
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) this.adjustsStyleForFirefox();
    this.adjustScale(this.scaleFactor);
    this.init(pages);
    // this.test();
  }

  isObejct(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]' ? obj : {};
  }

  adjustsStyleForFirefox() {
    this.thStyle.border = '2px solid #000000';
    this.tdStyle.border = '2px solid #000000';
  }

  adjustScale(factor) {
    this.resetStyle.margin = `${parseInt(this.resetStyle.margin, 10) * factor}px`;
    this.resetStyle.padding = `${parseInt(this.resetStyle.padding, 10) * factor}px`;
    this.pageStyle.top = `${parseInt(this.pageStyle.top, 10) * factor}px`;
    this.pageStyle.left = `${parseInt(this.pageStyle.left, 10) * factor}px`;
    this.pageStyle.width = `${parseInt(this.pageStyle.width, 10) * factor}px`;
    this.pageStyle.height = `${parseInt(this.pageStyle.height, 10) * factor}px`;
    this.logoStyle.top = `${parseInt(this.logoStyle.top, 10) * factor}px`;
    this.logoStyle.left = `${parseInt(this.logoStyle.left, 10) * factor}px`;
    this.titleStyle.top = `${parseInt(this.titleStyle.top, 10) * factor}px`;
    this.titleStyle.left = `${parseInt(this.titleStyle.left, 10) * factor}px`;
    this.titleStyle.fontSize = `${parseInt(this.titleStyle.fontSize, 10) * factor}px`;
    this.descLeftStyle.top = `${parseInt(this.descLeftStyle.top, 10) * factor}px`;
    this.descLeftStyle.left = `${parseInt(this.descLeftStyle.left, 10) * factor}px`;
    this.descLeftStyle.fontSize = `${parseInt(this.descLeftStyle.fontSize, 10) * factor}px`;
    this.descRightStyle.top = `${parseInt(this.descRightStyle.top, 10) * factor}px`;
    this.descRightStyle.right = `${parseInt(this.descRightStyle.right, 10) * factor}px`;
    this.descRightStyle.fontSize = `${parseInt(this.descRightStyle.fontSize, 10) * factor}px`;
    this.pageCounterStyle.bottom = `${parseInt(this.pageCounterStyle.bottom, 10) * factor}px`;
    this.pageCounterStyle.right = `${parseInt(this.pageCounterStyle.right, 10) * factor}px`;
    this.pageCounterStyle.fontSize = `${parseInt(this.pageCounterStyle.fontSize, 10) * factor}px`;
    this.tableStyle.top = `${parseInt(this.tableStyle.top, 10) * factor}px`;
    this.tableStyle.left = `${parseInt(this.tableStyle.left, 10) * factor}px`;
    this.tableStyle.fontSize = `${parseInt(this.tableStyle.fontSize, 10) * factor}px`;
    this.tableStyle.maxWidth = `${parseInt(this.tableStyle.maxWidth, 10) * factor}px`;
    this.tableStyle.maxHeight = `${parseInt(this.tableStyle.maxHeight, 10) * factor}px`;
    this.thStyle.padding = `${parseInt(this.thStyle.padding, 10) * factor}px`;
    this.tdStyle.padding = `${parseInt(this.tdStyle.padding, 10) * factor}px`;
  }

  init(pages) {
    (async () => {
      const loader = this.addLoader();
      const shots = await this.shots(pages);
      const result = await this.shotsToPDF(shots);
      loader.remove();
    })();
  }

  addLoader() {
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const div = document.createElement('div');
    Object.assign(div.style, this.resetStyle);
    Object.assign(div.style, { fontSize: '22px', fontWeight: 'bold' });
    div.innerHTML = 'Carregando seu PDF...<br />';
    const img = document.createElement('img');
    img.alt = 'loader';
    img.src = 'data:image/gif;base64,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';
    Object.assign(div.style, this.loaderStyle);
    Object.assign(div.style, { width: `${width}px`, height: `${height}px` });
    div.appendChild(img);
    document.body.appendChild(div);
    return div;
  }

  shots(pages) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const promises = [];
          pages.map((page, i) => {
            const html = this.addPage(page, (i + 1), pages.length);
            promises.push(this.takeAShot(html));
            return page;
          });
          const shots = await Promise.all(promises);
          resolve(shots);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      })();
    });
  }

  takeAShot(html) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          document.body.appendChild(html);
          let imgUrl = await domtoimage.toPng(html);
          html.remove();
          resolve(imgUrl);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  shotsToPDF(shots) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pdf = new jsPDF('l', 'pt', 'a3');
          const promises = [];
          shots.map((shot, i) => {
            promises.push(new Promise((resolve, reject) => {
              let img = new Image();
              img.src = shot;
              pdf.addImage(img, 'PNG', 0, 0, (parseInt(this.pageStyle.width, 10) * this.scaleFactorPDF), (parseInt(this.pageStyle.height, 10) * this.scaleFactorPDF));
              resolve(true);
            }));
            if (shots[i + 1]) pdf.addPage();
          });
          const result = await Promise.all(promises);
          pdf.save(`${this.fileName}.pdf`);
          resolve(true);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      })();
    });
  }

  addPage(pageContent, counter, total) {
    const page = document.createElement('div');
    Object.assign(page.style, this.resetStyle);
    Object.assign(page.style, this.pageStyle);
    if (pageContent.style) Object.assign(page.style, this.isObejct(pageContent.pageStyle));
    const logo = document.createElement('img');
    Object.assign(logo.style, this.resetStyle);
    Object.assign(logo.style, this.logoStyle);
    logo.alt = 'logo';
    logo.src = 'data:image/png;base64,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';
    if (pageContent.logo && pageContent.logo.src) logo.src = pageContent.logo.src;
    if (pageContent.logo && pageContent.logo.alt) logo.alt = pageContent.logo.src;
    if (pageContent.logo && pageContent.logo.style) Object.assign(logo.style, this.isObejct(pageContent.logo.style));
    const title = document.createElement('div');
    if (pageContent.title) title.innerHTML = pageContent.title.innerHTML || '';
    Object.assign(title.style, this.resetStyle);
    Object.assign(title.style, this.titleStyle);
    if (pageContent.title && pageContent.title.style) Object.assign(title.style, this.isObejct(pageContent.title.style));
    const descLeft = document.createElement('div');
    if (pageContent.descLeft) descLeft.innerHTML = pageContent.descLeft.innerHTML || '';
    Object.assign(descLeft.style, this.resetStyle);
    Object.assign(descLeft.style, this.descLeftStyle);
    if (pageContent.descLeft && pageContent.descLeft.style) Object.assign(descLeft.style, this.isObejct(pageContent.descLeft.style));
    const descRight = document.createElement('div');
    if (pageContent.descRight) descRight.innerHTML = pageContent.descRight.innerHTML || '';
    Object.assign(descRight.style, this.resetStyle);
    Object.assign(descRight.style, this.descRightStyle);
    if (pageContent.descRight && pageContent.descRight.style) Object.assign(descRight.style, this.isObejct(pageContent.descRight.style));
    const pageCounter = document.createElement('div');
    Object.assign(pageCounter.style, this.resetStyle);
    Object.assign(pageCounter.style, this.pageCounterStyle);
    pageCounter.innerHTML = `${counter}/${total}`;
    if (pageContent.counter && pageContent.counter.innerHTML) {
      pageCounter.innerHTML = pageContent.counter.innerHTML.replace('$1', counter);
      pageCounter.innerHTML = pageCounter.innerHTML.replace('$2', total);
    }
    const table = document.createElement('table');
    Object.assign(table.style, this.resetStyle);
    Object.assign(table.style, this.tableStyle);
    if (pageContent.table && pageContent.table.style) Object.assign(table.style, this.isObejct(pageContent.table.style));
    if (pageContent.table && pageContent.table.thead) this.makeThead(table, Array.isArray(pageContent.table.thead) ? pageContent.table.thead : []);
    if (pageContent.table && pageContent.table.tbody) this.makeTbody(table, Array.isArray(pageContent.table.tbody) ? pageContent.table.tbody : []);
    if (logo.src && logo.alt) page.appendChild(logo);
    page.appendChild(title);
    page.appendChild(descLeft);
    page.appendChild(descRight);
    page.appendChild(pageCounter);
    page.appendChild(table);
    return page;
  }

  makeThead(table, theadData) {
    const thead = document.createElement('thead');
    table.appendChild(thead);
    theadData.map((trEle) => {
      const tr = document.createElement('tr');
      Object.assign(tr.style, this.resetStyle);
      Object.assign(tr.style, this.trStyle);
      trEle.map((thEle) => {
        const th = document.createElement('th');
        Object.assign(th.style, this.resetStyle);
        Object.assign(th.style, this.thStyle);
        if (thEle.style) Object.assign(th.style, this.isObejct(thEle.style));
        if (thEle.innerHTML) th.innerHTML = thEle.innerHTML || '';
        tr.appendChild(th);
        return th;
      });
      thead.appendChild(tr);
      return tr;
    });
  }

  makeTbody(table, tbodyData) {
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    tbodyData.map((trEle) => {
      const tr = document.createElement('tr');
      Object.assign(tr.style, this.resetStyle);
      Object.assign(tr.style, this.trStyle);
      trEle.map((tdEle) => {
        const td = document.createElement('td');
        Object.assign(td.style, this.resetStyle);
        Object.assign(td.style, this.tdStyle);
        if (tdEle.style) Object.assign(td.style, this.isObejct(tdEle.style));
        if (tdEle.innerHTML) td.innerHTML = tdEle.innerHTML || '';
        tr.appendChild(td);
        return td;
      });
      tbody.appendChild(tr);
      return tr;
    });
  }

  rotateBase64Image90deg(base64Image, isClockwise) {
    return new Promise((resolve, reject) => {
      let canvas = document.createElement('canvas');
      document.body.appendChild(canvas);
      let ctx = canvas.getContext('2d');
      let img = new Image();
      img.src = base64Image;
      img.onload = () => {
        canvas.height = img.width;
        canvas.width = img.height;
        if (isClockwise) {
          ctx.rotate(90 * Math.PI / 180);
          ctx.translate(0, -canvas.width);
        } else {
          ctx.rotate(-90 * Math.PI / 180);
          ctx.translate(-canvas.height, 0);
        }
        ctx.drawImage(img, 0, 0);
        let newBase64Image = canvas.toDataURL('image/png', 1.0);
        canvas.remove();
        resolve(newBase64Image);
      };
    });
  }

  test() {
    (async () => {
      try {
        const div = document.createElement('div');
        div.style = {
          position: 'absolute', top: '0px', left: '0px', backgroundColor: 'blue',
        };
        div.innerHTML = 'Hello World';
        document.body.appendChild(div);
        let imgUrl = await domtoimage.toPng(div);
        imgUrl = await this.rotateBase64Image90deg(imgUrl, true);
        div.remove();
        let img = new Image();
        img.src = imgUrl;
        document.body.appendChild(img);
        img.onload = () => {
          // 730x910 pdfPageSize
          const pdf = new jsPDF('p', 'pt', 'letter');
          pdf.addImage(img, 'PNG', 0, 0, (img.width * 0.62), (img.height * 0.62));
          pdf.addImage(img, 'PNG', 430, 0, (img.width * 0.62), (img.height * 0.62));
          //
          // pdf.addPage(612, 791);
          // pdf.setPage(2);
          // //
          // pdf.addImage(img, 'PNG', 0, 0, (img.width * 0.62), (img.height * 0.62));
          // pdf.addImage(img, 'PNG', 430, 0, (img.width * 0.62), (img.height * 0.62));
          pdf.save('Test.pdf');
        };
      } catch (error) {
        console.log(error);
      }
    })();
  }
}

const pdf = [
  { // todas as propriedades são opcionais
    style: {}, // javascript style, expl: backgroundColor e não background-color
    logo: { src: '', alt: 'logo', style: {} }, // use src="base64Encoded"
    title: { innerHTML: 'Lorem Ipsum Dollor', style: {} }, // innerHTML aceita tbm html, expl: innerHTML: '<span class="red" style="color: 'red';">Lorem Ipsum</spam>'
    descLeft: { innerHTML: 'Lorem Ipsum Dollor', style: {} },
    descRight: { innerHTML: 'Lorem Ipsum Dollor', style: {} },
    counter: { innerHTML: 'page $1/$2', style: {} }, // $1 = pagina atual, $2 = paginas total
    table: {
      style: {},
      thead: [
        [{ innerHTML: 'Data Vencimento', style: {} }, { innerHTML: 'Remessa', style: {} }, { innerHTML: 'Voucher', style: {} }, { innerHTML: 'Tipo Compromisso', style: {} }, { innerHTML: 'CPF/CNPJ', style: {} }, { innerHTML: 'Nome', style: {} }, { innerHTML: 'Val. Bruto', style: {} }, { innerHTML: 'Val. IRRF', style: {} }, { innerHTML: 'Val. Líquido', style: {} }, { innerHTML: 'Tarifa Bancária', style: {} }],
      ],
      tbody: [
        [{ innerHTML: 'Data Vencimento', style: {} }, { innerHTML: 'Remessa', style: {} }, { innerHTML: 'Voucher', style: {} }, { innerHTML: 'Tipo Compromisso', style: {} }, { innerHTML: 'CPF/CNPJ', style: {} }, { innerHTML: 'Nome', style: {} }, { innerHTML: 'Val. Bruto', style: {} }, { innerHTML: 'Val. IRRF', style: {} }, { innerHTML: 'Val. Líquido', style: {} }, { innerHTML: 'Tarifa Bancária', style: {} }],
        [{ innerHTML: 'Data Vencimento', style: {} }, { innerHTML: 'Remessa', style: {} }, { innerHTML: 'Voucher', style: {} }, { innerHTML: 'Tipo Compromisso', style: {} }, { innerHTML: 'CPF/CNPJ', style: {} }, { innerHTML: 'Nome', style: {} }, { innerHTML: 'Val. Bruto', style: {} }, { innerHTML: 'Val. IRRF', style: {} }, { innerHTML: 'Val. Líquido', style: {} }, { innerHTML: 'Tarifa Bancária', style: {} }],
        [{ innerHTML: 'Data Vencimento', style: {} }, { innerHTML: 'Remessa', style: {} }, { innerHTML: 'Voucher', style: {} }, { innerHTML: 'Tipo Compromisso', style: {} }, { innerHTML: 'CPF/CNPJ', style: {} }, { innerHTML: 'Nome', style: {} }, { innerHTML: 'Val. Bruto', style: {} }, { innerHTML: 'Val. IRRF', style: {} }, { innerHTML: 'Val. Líquido', style: {} }, { innerHTML: 'Tarifa Bancária', style: {} }],
        [{ innerHTML: 'Data Vencimento', style: {} }, { innerHTML: 'Remessa', style: {} }, { innerHTML: 'Voucher', style: {} }, { innerHTML: 'Tipo Compromisso', style: {} }, { innerHTML: 'CPF/CNPJ', style: {} }, { innerHTML: 'Nome', style: {} }, { innerHTML: 'Val. Bruto', style: {} }, { innerHTML: 'Val. IRRF', style: {} }, { innerHTML: 'Val. Líquido', style: {} }, { innerHTML: 'Tarifa Bancária', style: {} }],
        [{ innerHTML: 'Data Vencimento', style: {} }, { innerHTML: 'Remessa', style: {} }, { innerHTML: 'Voucher', style: {} }, { innerHTML: 'Tipo Compromisso', style: {} }, { innerHTML: 'CPF/CNPJ', style: {} }, { innerHTML: 'Nome', style: {} }, { innerHTML: 'Val. Bruto', style: {} }, { innerHTML: 'Val. IRRF', style: {} }, { innerHTML: 'Val. Líquido', style: {} }, { innerHTML: 'Tarifa Bancária', style: {} }],
        [{ innerHTML: 'Data Vencimento', style: {} }, { innerHTML: 'Remessa', style: {} }, { innerHTML: 'Voucher', style: {} }, { innerHTML: 'Tipo Compromisso', style: {} }, { innerHTML: 'CPF/CNPJ', style: {} }, { innerHTML: 'Nome', style: {} }, { innerHTML: 'Val. Bruto', style: {} }, { innerHTML: 'Val. IRRF', style: {} }, { innerHTML: 'Val. Líquido', style: {} }, { innerHTML: 'Tarifa Bancária', style: {} }],
        [{ innerHTML: 'Data Vencimento', style: {} }, { innerHTML: 'Remessa', style: {} }, { innerHTML: 'Voucher', style: {} }, { innerHTML: 'Tipo Compromisso', style: {} }, { innerHTML: 'CPF/CNPJ', style: {} }, { innerHTML: 'Nome', style: {} }, { innerHTML: 'Val. Bruto', style: {} }, { innerHTML: 'Val. IRRF', style: {} }, { innerHTML: 'Val. Líquido', style: {} }, { innerHTML: 'Tarifa Bancária', style: {} }],
        [{ innerHTML: 'Data Vencimento', style: {} }, { innerHTML: 'Remessa', style: {} }, { innerHTML: 'Voucher', style: {} }, { innerHTML: 'Tipo Compromisso', style: {} }, { innerHTML: 'CPF/CNPJ', style: {} }, { innerHTML: 'Nome', style: {} }, { innerHTML: 'Val. Bruto', style: {} }, { innerHTML: 'Val. IRRF', style: {} }, { innerHTML: 'Val. Líquido', style: {} }, { innerHTML: 'Tarifa Bancária', style: {} }],
        [{ innerHTML: 'Data Vencimento', style: {} }, { innerHTML: 'Remessa', style: {} }, { innerHTML: 'Voucher', style: {} }, { innerHTML: 'Tipo Compromisso', style: {} }, { innerHTML: 'CPF/CNPJ', style: {} }, { innerHTML: 'Nome', style: {} }, { innerHTML: 'Val. Bruto', style: {} }, { innerHTML: 'Val. IRRF', style: {} }, { innerHTML: 'Val. Líquido', style: {} }, { innerHTML: 'Tarifa Bancária', style: {} }],
        [{ innerHTML: 'Data Vencimento', style: {} }, { innerHTML: 'Remessa', style: {} }, { innerHTML: 'Voucher', style: {} }, { innerHTML: 'Tipo Compromisso', style: {} }, { innerHTML: 'CPF/CNPJ', style: {} }, { innerHTML: 'Nome', style: {} }, { innerHTML: 'Val. Bruto', style: {} }, { innerHTML: 'Val. IRRF', style: {} }, { innerHTML: 'Val. Líquido', style: {} }, { innerHTML: 'Tarifa Bancária', style: {} }],
        [{ innerHTML: 'Data Vencimento', style: {} }, { innerHTML: 'Remessa', style: {} }, { innerHTML: 'Voucher', style: {} }, { innerHTML: 'Tipo Compromisso', style: {} }, { innerHTML: 'CPF/CNPJ', style: {} }, { innerHTML: 'Nome', style: {} }, { innerHTML: 'Val. Bruto', style: {} }, { innerHTML: 'Val. IRRF', style: {} }, { innerHTML: 'Val. Líquido', style: {} }, { innerHTML: 'Tarifa Bancária', style: {} }],
        [{ innerHTML: 'Data Vencimento', style: {} }, { innerHTML: 'Remessa', style: {} }, { innerHTML: 'Voucher', style: {} }, { innerHTML: 'Tipo Compromisso', style: {} }, { innerHTML: 'CPF/CNPJ', style: {} }, { innerHTML: 'Nome', style: {} }, { innerHTML: 'Val. Bruto', style: {} }, { innerHTML: 'Val. IRRF', style: {} }, { innerHTML: 'Val. Líquido', style: {} }, { innerHTML: 'Tarifa Bancária', style: {} }],
      ],
    },
  },
];
new PDFFinanceiro(pdf, 'nomeArquivo');