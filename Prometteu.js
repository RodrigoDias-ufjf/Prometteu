const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const url = 'ws://127.0.0.1:9222/devtools/browser/647a7a9a-4790-4227-a416-b6b4867fb3d8'
    const browser = await puppeteer.connect({ browserWSEndpoint: url });
    const page0 = await browser.newPage();

    await page0.goto('https://integrada.minhabiblioteca.com.br/reader/books/9788580551730', { timeout: 0 });
    await page0.waitForNavigation({ waitUntil: 'domcontentloaded' });

    const ultimaPagina = await page0.evaluate(() => {

        return document.querySelector("#root > div.sc-bZQynM.hhxHQe > div.sc-bAtgIc.iRFxhC > div.sc-csuNZv.jlsNLy > div.sc-kOCNXg.hCDqBJ > div.sc-hZhUor.kskTSS > div.sc-drKuOJ.KInqH").textContent
        // seletor da string da última página
    });

    let ultimoNumero = ultimaPagina.replace(/\D/g, ''); // converte a string da última página em um número
    console.log("O número de páginas sendo baixado é: " + ultimoNumero);

    for (var i = 0; i <= ultimoNumero; i++) {

        const page = await browser.newPage();

        await page.goto('https://integrada.minhabiblioteca.com.br/reader/books/9788580551730/pageid/' + i, { timeout: 0 });
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

        const frames = await page.frames()

        frame3 = frames[3];

        const pbk = await frame3.evaluate(() => {

            return document.querySelector("#pbk-page").src;

        });

        var imagem = await page.goto(pbk);
        fs.writeFile("./paginas/pag" + i + ".jpg", await imagem.buffer(), function (err) { });

        console.log(pbk);

        await page.close();

    };

    await browser.close();

})();