// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
process.env.PORT = '3000';

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const should = chai.should();

// need to parse the response pdf
const binaryParser = function (res, cb) {
    res.setEncoding('binary');
    res.data = '';
    res.on("data", function (chunk) {
        res.data += chunk;
    });
    res.on('end', function () {
        cb(null, new Buffer(res.data, 'binary'));
    });
};

chai.use(chaiHttp);
// Our parent block
describe('Documents', () => {
  /*
  * Happy path for document generation
  */
  describe('POST /', () => {
    const templateMarkDown = fs.readFileSync('./test/templates/termsheet.md')
    it('it should return a markdown document with the variables replaced', (done) => {
      chai.request(server)
        .post('/documents')
        .set({Accept: 'text/markdown'})
        .send({
          data: {
            loan: {maturity: 12, amount: 15000, currency: 'GBP'},
            user: {first_name: 'jane', last_name: 'doe'},
            contract: {date: '2019-01-23'}
          },
          template: templateMarkDown.toString()
        })
        .buffer()
        .parse(binaryParser)
        .end((err, res) => {
          res.should.have.status(201);
          res.headers['content-type'].should.be.equal('text/markdown; charset=utf-8')
          let template = res.body.toString()
          chai.expect(template).to.include('Jane dow')
          chai.expect(template).to.include('15000 GBP')
          done();
        });
    })

    it('it should return a rendered html document', (done) => {
      chai.request(server)
        .post('/documents')
        .set({Accept: 'text/html'})
        .send({
          data: {
            loan: {maturity: 12, amount: 15000, currency: 'GBP'},
            user: {first_name: 'jane', last_name: 'dow'},
            contract: {date: '2019-01-23'}
          },
          template: templateMarkDown.toString()
        })
        .buffer()
        .parse(binaryParser)
        .end((err, res) => {
          res.should.have.status(201);
          res.headers['content-type'].should.be.equal('text/html; charset=utf-8')
          let html = res.body.toString()
          chai.expect(html).to.include('jane dow')
          chai.expect(html).to.include('15000 GBP')
          done();
        });
    })

    it('it should return a rendered pdf document', (done) => {
      chai.request(server)
        .post('/documents')
        .set({Accept: 'application/pdf'})
        .send({
          data: {
            loan: {maturity: 12, amount: 15000, currency: 'GBP'},
            user: {first_name: 'jane', last_name: 'dow'},
            contract: {date: '2019-01-23'}
          },
          template: templateMarkDown.toString()
        })
        .buffer()
        .parse(binaryParser)
        .end((err, res) => {
          res.should.have.status(201);
          res.headers['content-type'].should.be.equal('application/pdf; charset=utf-8')
          pdfParse(res.body).then(data => {
            console.log(data)
            chai.expect(data.text).to.include('Jane Dow')
            chai.expect(data.text).to.include('15000 GBP')
            done();
          })
        });
    }).timeout(1000)

  });

});
