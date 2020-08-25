const http = require("http");
const url = require("url");
const fs = require("fs");
const replaceTemplate = require('./module/replaceTemplate');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const tempOverview = fs.readFileSync(`${__dirname}/dev-data/templates/overview.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/dev-data/templates/product.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/dev-data/templates/card.html`, 'utf-8')



const server = http.createServer((req, res) => {


            const { query, pathname } = (url.parse(req.url, true))
            //overview
            if (pathname == '/' || pathname === '/overview') {
                        res.writeHead(200, {
                                    'Content-Type': 'text/html'
                        })

                        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join(' ');

                        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/, cardsHtml)

                        res.end(output);
            }
            //product
            else if (pathname === '/product') {
                        const product = dataObj[query.id]
                        res.writeHead(200, {
                                    'Content-Type': 'text/html'
                        })
                        const output = replaceTemplate(tempProduct, product);
                        res.end(output)
            }
            //api
            else if (pathname === '/api') {

                        res.writeHead(200, {
                                    'Content-Type': 'application/json'
                        })
                        res.end(data);
            }
            else {
                        res.writeHead(404, {
                                    'Content-type': 'text/html'
                        });
                        res.end("<h1>Page not found</h1>");
            }

})

server.listen(8080, () => {
            console.log("Server started")
});