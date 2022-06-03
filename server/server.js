const { pool } = require("./src/database/connect");
const { encrypt } = require("./src/utils/crypto");
const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API da aplicação" });
});

app.post("/users", (req, res) => {
  const { nomeCompleto, email, senha } = req.body;
  const newPassword = encrypt(senha);

  pool.query(
    "insert into usuarios values (default, $1, $2, $3)",
    [nomeCompleto, email, newPassword],
    (err, result) => {
      pool.end(() => {});
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
      pool.end(() => {});
      if (!err) {
        if (result.rows.length !== 0) {
          res.status(200).json(result.rows[0]);
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
