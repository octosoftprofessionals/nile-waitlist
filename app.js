const express = require('express');

const pool = require('./database');

const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

// Routes

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/clients', (req, res) => {
  const sql = 'SELECT * FROM clients';

  pool.query(sql, (error, results) => {
    if (error) throw error;
    results.length > 0 ? res.json(results) : res.send('not results');
  });
});

app.post('/clients', (req, res) => {
  const clientsObj = {
    name: req.body.name,
    near_wallet: req.body.near_wallet,
    email: req.body.email,
    telegram: req.body.telegram,
    twitter: req.body.twitter,
  };
  const sqlCheckWallet = `SELECT near_wallet FROM clients WHERE near_wallet = '${clientsObj.near_wallet}'`;
  const sqlCheckEmail = `SELECT email FROM clients WHERE email = '${clientsObj.email}'`;
  const sql = 'INSERT INTO clients SET ?';

  pool.query(sqlCheckWallet, clientsObj, (error, result) => {
    if (result.length !== 0) {
      res.send('near wallet is alredy loged!');
    } else {
      pool.query(sqlCheckEmail, clientsObj, (error, result) => {
        if (result.length !== 0) {
          res.send('email is alredy loged!');
        } else {
          pool.query(sql, clientsObj, (error) => {
            if (error) throw error;
            res.send('client added!');
          });
        }
      });
    }
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
