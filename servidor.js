const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const usuariosPath = path.join(__dirname, "usuarios.json");

// Função para ler usuários
function lerUsuarios() {
  if (!fs.existsSync(usuariosPath)) {
    fs.writeFileSync(usuariosPath, "[]");
  }
  const data = fs.readFileSync(usuariosPath);
  return JSON.parse(data);
}

// Função para salvar usuários
function salvarUsuarios(usuarios) {
  fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
}

// Rota de login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const usuarios = lerUsuarios();

  const usuarioEncontrado = usuarios.find(
    (u) => u.username === username && u.password === password
  );

  if (usuarioEncontrado) {
    res.redirect("/home.html");
  } else {
    res.send(
      `<h2>Usuário ou senha incorretos!</h2><a href='/login.html'>Voltar</a>`
    );
  }
});

// Rota de cadastro
app.post("/cadastro", (req, res) => {
  const { username, email, password } = req.body;
  const usuarios = lerUsuarios();

  if (usuarios.some((u) => u.username === username)) {
    res.send(`<h2>Usuário já existe!</h2><a href='/cadastro.html'>Voltar</a>`);
    return;
  }

  const novoUsuario = {
    username,
    email,
    password,
    cargo: "Membro",
    moedas: 0,
    brainrots: {}
  };

  usuarios.push(novoUsuario);
  salvarUsuarios(usuarios);

  res.redirect("/home.html");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});