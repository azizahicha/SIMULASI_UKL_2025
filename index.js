
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json()); 
const SECRET_KEY = "supersecretkey2024";


let users = [
  { id: 1, username: "admin", password: "admin123", role: "admin" },
  { id: 2, username: "siswa1", password: "pass123", role: "student" }
];

let presences = [];


function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token tidak valid atau sudah kedaluwarsa" });
    }
    req.user = user; 
    next();
  });
}


app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username dan password wajib diisi" });
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(400).json({ message: "Username atau password salah" });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({ message: "Login berhasil", token });
});


app.get("/users", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Akses ditolak, hanya admin" });
  }

  
  const userList = users.map(({ password, ...rest }) => rest);
  res.json(userList);
});


app.post("/users", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Akses ditolak, hanya admin" });
  }

  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res
      .status(400)
      .json({ message: "Username, password, dan role wajib diisi" });
  }

  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ message: "Username sudah digunakan" });
  }

  const newUser = {
    id: users.length + 1,
    username,
    password,
    role,
  };

  users.push(newUser);
  const { password: pwd, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});


app.post("/presences", authenticateToken, (req, res) => {
  const { date, status } = req.body;

  if (!date || !status) {
    return res.status(400).json({ message: "Tanggal dan status wajib diisi" });
  }

  const validStatus = ["hadir", "sakit", "izin", "alfa"];
  if (!validStatus.includes(status.toLowerCase())) {
    return res.status(400).json({
      message: `Status harus salah satu dari: ${validStatus.join(", ")}`,
    });
  }

  const presenceRecord = {
    id: presences.length + 1,
    userId: req.user.id,
    date,
    status: status.toLowerCase(),
  };

  presences.push(presenceRecord);
  res.status(201).json(presenceRecord);
});

app.get("/presences", authenticateToken, (req, res) => {
  const userPresences = presences.filter((p) => p.userId === req.user.id);
  res.json(userPresences);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
