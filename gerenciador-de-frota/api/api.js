const express = require('express');
const app = express();
const PORT = 3000;
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require("./database/frota.db");

app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));

const veiculosIniciais = [
  { fabricante: "BMW", modelo: "S10 LTZ", cor: "BRANCO", placa: "ABC-1234", km: "90569", local: "SEDE", status: "DISPONÍVEL" },
  { fabricante: "CHEVROLET", modelo: "DUSTER", cor: "PRETO", placa: "DEF-5678", km: "8691", local: "SEDE", status: "RETIRADO" },
  { fabricante: "CHEVROLET", modelo: "DUSTER", cor: "PRETO", placa: "GHI-9012", km: "12345", local: "FILIAL", status: "ATRASADO" },
  { fabricante: "FIAT", modelo: "TORO", cor: "VERMELHO", placa: "JKL-3456", km: "45678", local: "SEDE", status: "DISPONÍVEL" }
];

veiculosIniciais.forEach(v => {
  const existe = db.prepare("SELECT * FROM veiculos WHERE placa = ?").get(v.placa);
  if (!existe) {
    db.prepare(`
      INSERT INTO veiculos (fabricante, modelo, cor, placa, km, local, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      v.fabricante,
      v.modelo,
      v.cor,
      v.placa,
      v.km,
      v.local,
      v.status
    );
  }
});

const adminsPadrao = [
  { nome: "Felipe Barretto", login: "felipe", senha: "teste" },
  { nome: "Lucas Mendes", login: "lumendes", senha: "123" },
  { nome: "João Vency", login: "vency", senha: "abc" },
  { nome: "Fulano", login: "admin1", senha: "1234"},
  { nome: "Beltrano", login: "admin2", senha: "abcd"}
];

adminsPadrao.forEach(adm => {
  const existe = db.prepare("SELECT * FROM admins WHERE login = ?").get(adm.login);
  if (!existe) {
    db.prepare("INSERT INTO admins (nome, login, senha) VALUES (?, ?, ?)").run(
      adm.nome,
      adm.login,
      adm.senha
    );
  }
});

// ---- Rotas ----

// Rota inicial
app.get('/', (req, res) => {
  res.json({ message: 'API rodando' });
});

// ---- VEÍCULOS ----
// Listar veículos
app.get('/veiculos', (req, res) => {
  const rows = db.prepare("SELECT * FROM veiculos").all();
  res.json(rows);
});

// Buscar por ID
app.get('/veiculos/:id', (req, res) => {
  const row = db.prepare("SELECT * FROM veiculos WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Veículo não encontrado' });
  res.json(row);
});

// Adicionar veículo
app.post('/veiculos', (req, res) => {
  const { fabricante, modelo, cor, placa, km, local, status } = req.body;

  try {
    const statement = db.prepare(`
      INSERT INTO veiculos (fabricante, modelo, cor, placa, km, local, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = statement.run(
      fabricante,
      modelo,
      cor || "",
      placa,
      km || "0",
      local || "SEDE",
      status || "disponivel"
    );

    res.status(201).json({ id: result.lastInsertRowid, ...req.body });
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(400).json({ error: "Já existe um veículo com esta placa" });
    }
    res.status(500).json({ error: "Erro ao cadastrar veículo" });
  }
});

// Atualizar veículo
app.put('/veiculos/:id', (req, res) => {
  const id = req.params.id;

  const veiculo = db.prepare("SELECT * FROM veiculos WHERE id = ?").get(id);
  if (!veiculo) return res.status(404).json({ error: 'Veículo não encontrado' });

  const { fabricante, modelo, cor, placa, km, local, status } = req.body;

  try {
    db.prepare(`
      UPDATE veiculos SET
        fabricante = ?,
        modelo = ?,
        cor = ?,
        placa = ?,
        km = ?,
        local = ?,
        status = ?
      WHERE id = ?
    `).run(
      fabricante ?? veiculo.fabricante,
      modelo ?? veiculo.modelo,
      cor ?? veiculo.cor,
      placa ?? veiculo.placa,
      km ?? veiculo.km,
      local ?? veiculo.local,
      status ?? veiculo.status,
      id
    );

    res.json({ message: "Atualizado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar" });
  }
});

// Excluir veículo
app.delete('/veiculos/:id', (req, res) => {
  const statement = db.prepare("DELETE FROM veiculos WHERE id = ?");
  const result = statement.run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Veículo não encontrado" });
  }

  res.status(204).send();
});


// ---- ADMINS ----

app.post("/login", (req, res) => {
  const { login, senha } = req.body;

  const admin = db.prepare("SELECT * FROM admins WHERE login = ? AND senha = ?").get(login, senha);

  if (!admin) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  res.cookie("sessao", admin.id, {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 2
  });

  return res.json({
    message: "Login realizado com sucesso!",
    admin: { id: admin.id, nome: admin.nome }
  });
});


// ---- Iniciar servidor ----
app.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`);
});

