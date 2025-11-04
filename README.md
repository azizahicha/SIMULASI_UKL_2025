
Aplikasi ini dibuat menggunakan Node.js untuk sistem presensi sederhana.
Terdapat dua peran pengguna yaitu admin dan siswa.
Admin dapat mengelola user, sementara siswa dapat mencatat dan melihat presensi.

Fitur
Login menggunakan JSON Web Token (JWT)
Manajemen user oleh admin
Pencatatan presensi siswa
Node.js
Body Parser
JSON Web Token (JWT)

Cara Menjalankan

Pastikan Node.js sudah terinstall

Buka terminal dan jalankan:
node index.js
Server akan berjalan di http://localhost:3000

Akun Awal
Role	Username	Password
Admin	admin	admin123
Siswa	siswa1	pass123
Endpoint
1. Login

POST /login
Body:

{
  "username": "admin",
  "password": "admin123"
}

Response:

{
  "token": "jwt_token"
}

2. Menampilkan semua user (admin)
GET /users
Header:
Authorization: Bearer [token_admin]

3. Menambah user baru (admin)
POST /users
Header:
Authorization: Bearer [token_admin]
Body:
{
  "username": "nama_user",
  "password": "password_user",
  "role": "student"
}

4. Mencatat presensi (siswa)
POST /presences
Header:
Authorization: Bearer [token_siswa]


Body:
{
  "date": "2025-11-04",
  "status": "hadir"
}

5. Melihat presensi (siswa)
GET /presences
Header:

Authorization: Bearer [token_siswa]
