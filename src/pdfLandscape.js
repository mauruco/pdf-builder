import * as jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import loaderSrc from './loaderSrc';

export default class PDFLandscape {
  isChrome = false;

  scaleFactor = 1.62;

  scaleFactorPDF = 0.62;

  resetStyle = {
    fontFamily: 'Arial, Helvetica, sans-serif',
    margin: '0px',
    padding: '0px',
  };

  loaderWrapperStyle = {
    position: 'fixed',
    top: '0px',
    left: '0px',
    zIndex: '99999',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    fontSize: '22px',
    fontWeigth: 'bold',
    width: '100%',
    heigth: '100%',
  }

  loaderStyle = {
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
    width: '1147px',
    height: '802px',
  };

  titleStyle = {
    position: 'absolute',
    top: '28px',
    left: '190px',
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
    fontSize: '16px',
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

  constructor(pages, fileName, checkChrome) {
    this.validateBrowser();
    if (!this.isChrome && !checkChrome) return;
    this.fileName = fileName || `not_named_${Date.now()}`;
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) this.adjustsStyleForFirefox();
    this.adjustScale(this.scaleFactor);
    this.init(pages);
    // this.test();
  }

  validateBrowser() {
    const isChromium = window.chrome;
    const winNav = window.navigator;
    const vendorName = winNav.vendor;
    const isOpera = typeof window.opr !== 'undefined';
    const isIEedge = winNav.userAgent.indexOf('Edge') > -1;
    const isIOSChrome = winNav.userAgent.match('CriOS');
    switch (true) {
      case isIOSChrome:
        this.isChrome = false;
        break;
      case
        isChromium !== null
        && typeof isChromium !== 'undefined'
        && vendorName === 'Google Inc.'
        && isOpera === false
        && isIEedge === false:
        this.isChrome = true;
        break;
      default:
        this.isChrome = false;
    }
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
    this.logoStyle.width = `${parseInt(this.logoStyle.width, 10) * factor}px`;
    this.logoStyle.height = `${parseInt(this.logoStyle.height, 10) * factor}px`;
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
      const loader = this.addLoader('Preparando seu PDF<br />');
      const shots = await this.shots(pages);
      setTimeout(() => {
        loader.update('Estamos quase lá<br />');
        setTimeout(async () => {
          const pdf = await this.shotsToPDF(shots);
          loader.update('Pronto<br />');
          pdf.save(`${this.fileName}.pdf`);
          setTimeout(() => {
            loader.remove();
          }, 500);
        }, 1000);
      }, 1000);
    })();
  }

  addLoader(txt) {
    const div = document.createElement('div');
    Object.assign(div.style, this.resetStyle);
    Object.assign(div.style, this.loaderWrapperStyle);
    const span = document.createElement('span');
    span.innerHTML = txt;
    Object.assign(span.style, this.resetStyle);
    Object.assign(span.style, this.loaderStyle);
    div.appendChild(span);
    div.update = (newTxt) => {
      const sp = div.getElementsByTagName('span')[0];
      sp.innerHTML = newTxt;
    };
    const img = document.createElement('img');
    img.alt = 'loader';
    img.src = loaderSrc();
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    Object.assign(div.style, { width: `${width}px`, height: `${height}px` });
    div.appendChild(img);
    document.body.appendChild(div);
    return div;
  }

  shots(pages) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let promises = [];
          pages.map((page, i) => {
            promises.push(this.addPage(page, (i + 1), pages.length));
            return page;
          });
          const htmls = await Promise.all(promises);
          promises = [];
          htmls.map((html) => {
            promises.push(this.takeAShot(html));
            return html;
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
          resolve(pdf);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      })();
    });
  }

  addPage(pageContent, counter, total) {
    return new Promise((resolve, reject) => {
      const page = document.createElement('div');
      Object.assign(page.style, this.resetStyle);
      Object.assign(page.style, this.pageStyle);
      if (pageContent.style) Object.assign(page.style, this.isObejct(pageContent.pageStyle));
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
      const logo = document.createElement('div');
      Object.assign(logo.style, this.resetStyle);
      Object.assign(logo.style, this.logoStyle);
      let img = false;
      if (pageContent.logo && pageContent.logo.src && pageContent.logo && pageContent.logo.alt) {
        img = new Image();
        if (pageContent.logo && pageContent.logo.src) img.src = pageContent.logo.src;
        if (pageContent.logo && pageContent.logo.alt) img.alt = pageContent.logo.alt;
        if (pageContent.logo && pageContent.logo.style) Object.assign(img.style, this.isObejct(pageContent.logo.style));
        logo.appendChild(img);
      }
      page.appendChild(logo);
      page.appendChild(title);
      page.appendChild(descLeft);
      page.appendChild(descRight);
      page.appendChild(pageCounter);
      page.appendChild(table);
      if (!img) return resolve(page);
      img.onload = () => {
        resolve(page);
      };
    });
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
