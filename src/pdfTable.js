// @ts-check
import * as jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import svgLoader from './loader.svg';

export default class PDFTable {
  isChrome = false;

  isPortrait = false;

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
    display: 'inline-block',
    width: '50px',
  };

  pageStyle = {
    display: 'border-box',
    position: 'absolute',
    top: '0px',
    left: '0px',
    width: '1187px',
    height: '842px',
    maxWidth: '1187px',
    maxHeight: '842px',
    minWidth: '1187px',
    minHeight: '842px',
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

  /**
   *
   * @param {Array} pages Array com any objetos page
   * @param {string} fileName Nome do arquivo
   * @param {string} format 'l' ou 'p', Landscape ou Portrait
   * @param {boolean} checkChrome Ignora a verificação seo browser é chrome
   */
  constructor(pages, fileName, format, checkChrome) {
    this.isChrome = this.isChromeBrowser();
    if (!this.isChrome && !checkChrome) return;
    if (format === 'p') {
      this.isPortrait = true;
      this.adjustToPortrait();
    }
    this.fileName = fileName || `not_named_${Date.now()}`;
    this.adjustScale(this.scaleFactor);
    this.init(pages, this.isPortrait);
  }

  /**
   *
   * @param {Array} pages Array com objetos page
   * @param {boolean} isPortrait Se é landscape ou portrait
   */
  init(pages, isPortrait) {
    (async () => {
      const loader = this.addLoader('Preparando seu PDF');
      const shots = await this.shots(pages);
      setTimeout(() => {
        loader.update('Estamos quase lá');
        setTimeout(async () => {
          const pdf = await this.shotsToPDF(shots, isPortrait);
          loader.update('Pronto');
          pdf.save(`${this.fileName}.pdf`);
          setTimeout(() => {
            loader.remove();
          }, 1000);
        }, 500);
      }, 500);
    })();
  }

  /**
   * Verificação sé o browser é Chrome
   */
  isChromeBrowser() {
    let isChrome = false;
    const isChromium = !!window.chrome;
    const winNav = window.navigator;
    const vendorName = winNav.vendor;
    const isOpera = typeof window.opr !== 'undefined';
    const isIEedge = winNav.userAgent.indexOf('Edge') > -1;
    const isIOSChrome = !!winNav.userAgent.match('CriOS');
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    switch (true) {
      case isIOSChrome:
        isChrome = false;
        break;
      case
        isChromium !== null
        && typeof isChromium !== 'undefined'
        && vendorName === 'Google Inc.'
        && isOpera === false
        && isIEedge === false
        && isFirefox === false:
        isChrome = true;
        break;
      default:
        isChrome = false;
    }
    return isChrome;
  }

  /**
   *
   * @param {*} obj Verefica se o obj passado é um literal
   */
  isObejct(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]' ? obj : {};
  }

  /**
   * Ajusta a scala para mudar de landscape para portrait
   */
  adjustToPortrait() {
    const pageStylePortrait = {
      width: this.pageStyle.height,
      height: this.pageStyle.width,
      maxWidth: this.pageStyle.maxHeight,
      maxHeight: this.pageStyle.maxWidth,
      minWidth: this.pageStyle.minHeight,
      minHeight: this.pageStyle.minWidth,
    };

    const tableStylePortrait = {
      maxWidth: this.tableStyle.maxHeight,
      maxHeight: this.tableStyle.maxWidth,
    };

    Object.assign(this.pageStyle, pageStylePortrait);
    Object.assign(this.tableStyle, tableStylePortrait);
  }

  /**
   *
   * @param {number} factor Fator para ajustar a scale e smpificar downscale
   */
  adjustScale(factor) {
    this.resetStyle.margin = `${parseInt(this.resetStyle.margin, 10) * factor}px`;
    this.resetStyle.padding = `${parseInt(this.resetStyle.padding, 10) * factor}px`;
    this.pageStyle.top = `${parseInt(this.pageStyle.top, 10) * factor}px`;
    this.pageStyle.left = `${parseInt(this.pageStyle.left, 10) * factor}px`;
    this.pageStyle.width = `${parseInt(this.pageStyle.width, 10) * factor}px`;
    this.pageStyle.height = `${parseInt(this.pageStyle.height, 10) * factor}px`;
    this.pageStyle.maxWidth = `${parseInt(this.pageStyle.maxWidth, 10) * factor}px`;
    this.pageStyle.maxHeight = `${parseInt(this.pageStyle.maxHeight, 10) * factor}px`;
    this.pageStyle.minWidth = `${parseInt(this.pageStyle.minWidth, 10) * factor}px`;
    this.pageStyle.minHeight = `${parseInt(this.pageStyle.minHeight, 10) * factor}px`;
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

  /**
   *
   * @param {string} txt Texto do loader
   * @returns {Object} Devolve loader
   */
  addLoader(txt) {
    const loader = {
      div: document.createElement('div'),
      /**
       *
       * @param {string} newTxt texto para ser mostrado durante loading
       */
      update(newTxt) {
        const sp = this.div.getElementsByTagName('span')[0];
        sp.innerHTML = newTxt;
      },
      remove() {
        this.div.remove();
      },
    };
    Object.assign(loader.div.style, this.resetStyle);
    Object.assign(loader.div.style, this.loaderWrapperStyle);
    const span = document.createElement('span');
    span.innerHTML = txt;
    Object.assign(span.style, this.resetStyle);
    loader.div.appendChild(span);
    const br = document.createElement('br');
    loader.div.appendChild(br);
    const img = document.createElement('span');
    Object.assign(img.style, this.loaderStyle);
    img.innerHTML = svgLoader;
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    Object.assign(loader.div.style, { width: `${width}px`, height: `${height}px` });
    loader.div.appendChild(img);
    document.body.appendChild(loader.div);
    return loader;
  }

  /**
   *
   * @param {Array} pages Array de objetos page
   * @returns {Promise} Array de page rendeizadas para imagem
   */
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
          reject(error);
        }
      })();
    });
  }

  /**
   *
   * @param {Object} html HMTLElement para transformar em imagem
   * @returns {Promise} String base64 da imagem
   */
  takeAShot(html) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          document.body.appendChild(html);
          let imgUrl = await domtoimage.toJpeg(html, { quality: 0.95 });
          html.remove();
          resolve(imgUrl);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   *
   * @param {Array} shots Array de imagem para transforma em pdf
   * @param {boolean} isPortrait Se é landscape ou portrait
   * @returns {Promise} Objeto jsPDF
   */
  shotsToPDF(shots, isPortrait) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const pdf = new jsPDF(isPortrait ? 'p' : 'l', 'pt', 'a3');
          const promises = [];
          shots.map((shot, i) => {
            promises.push(new Promise((res, rej) => {
              try {
                let img = new Image();
                img.src = shot;
                img.onload = () => {
                  pdf.setPage(i + 1);
                  pdf.addImage(img, 'JPG', 0, 0, (img.width * this.scaleFactorPDF), (img.height * this.scaleFactorPDF));
                  res(true);
                };
              } catch (error) {
                rej(error);
              }
            }));
            if (shots[i + 1]) pdf.addPage();
          });
          await Promise.all(promises);
          resolve(pdf);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   *
   * @param {Object} pageContent Objeto page
   * @param {number} counter Número da página atual
   * @param {number} total Número total de paginas
   * @returns {Promise} Renderiza html para tirar shot
   */
  addPage(pageContent, counter, total) {
    return new Promise((resolve, reject) => {
      try {
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
          pageCounter.innerHTML = pageContent.counter.innerHTML.replace('$1', `${counter}`);
          pageCounter.innerHTML = pageCounter.innerHTML.replace('$2', `${total}`);
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
        let img;
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
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   *
   * @param {Object} table Table que vai receber objeto thead
   * @param {Array} theadData thead do objeto page
   */
  makeThead(table, theadData) {
    const thead = document.createElement('thead');
    table.appendChild(thead);
    theadData.map((trEle) => {
      if (!Array.isArray(trEle)) return trEle;
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

  /**
   *
   * @param {Object} table Table que vai receber objeto tbody
   * @param {Array} tbodyData tbody do objeto page
   */
  makeTbody(table, tbodyData) {
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    tbodyData.map((trEle) => {
      if (!Array.isArray(trEle)) return trEle;
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
  /** CONCEITO
  /**
   * Usada em função conceito
   * @param {string} base64Image String base64 da imagem
   * @param {boolean} isClockwise Qual direçao para rodar
   * @returns {Promise} Com novo string base64
   *
  rotateBase64Image90deg(base64Image, isClockwise) {
    return new Promise((resolve, reject) => {
      try {
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
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Função conceito
   *
  concept() {
    (async () => {
      try {
        const div = document.createElement('div');
        Object.assign(div.style, {
          position: 'absolute', top: '0px', left: '0px', backgroundColor: 'blue',
        });
        div.innerHTML = 'Hello World';
        document.body.appendChild(div);
        let imgUrl = await domtoimage.toPng(div, {});
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
        // console.log(error);
      }
    })();
  }
  */
}
