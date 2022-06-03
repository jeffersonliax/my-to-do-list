const { pool } = require("./src/database/connect");
const { encrypt } = require("./src/utils/crypto");
const { verifyJWT } = require("./src/utils/verifyJwt");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API da aplicação" });
});

app.get("/users", verifyJWT, (req, res) => {
  pool.query("select * from usuarios", (err, result) => {
    if (!err) {
      res.status(200).json({ usuarios: result.rows });
    } else {
      res.status(400).json({ message: err.message });
    }
  });
});

app.post("/users", (req, res) => {
  const { nomeCompleto, email, senha } = req.body;
  const newPassword = encrypt(senha);

  pool.query(
    "insert into usuarios values (default, $1, $2, $3)",
    [nomeCompleto, email, newPassword],
    (err) => {
      if (!err) {
        res.status(200).json({ message: "Usuário cadastrado com sucesso!" });
      } else {
        res.status(400).json({ message: err.message });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const { email, senha } = req.body;
  const newPassword = encrypt(senha);

  pool.query(
    "select * from usuarios usu where usu.email = $1 and usu.senha = $2",
    [email, newPassword],
    (err, result) => {
      if (!err) {
        if (result.rows.length !== 0) {
          const user = result.rows[0];
          const token = jwt.sign({ userId: user.id }, process.env.SECRET, {
            expiresIn: 300,
          });
          const newUser = {
            auth: true,
            token,
            nomeCompleto: user.nomecompleto,
            email: user.email,
          };

          res.status(200).json(newUser);
        } else {
          res.status(404).json({ message: "Login inválido!" });
        }
      } else {
        res.status(404).json({ message: err.message });
      }
    }
  );
});

app.listen(3001, () => console.log("Servidor rodando na porta 3001!"));
