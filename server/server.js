const http = require("http");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const { hash } = require("crypto");
require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        if (err.code === "ER_DUP_ENTRY") {
            res.end("Este email já está cadastrado!");
            return;
        }

        console.log("Erro ao cadastrar:", err);
        return;
    }

    console.log("MySQL conectado!");
});

const server = http.createServer((req, res) => {

    res.setHeader("Access-Control-Allow-Origin", "*");

    if (req.method !== "POST") {
        res.end();
        return;
    }

    let body = "";

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", async () => {
        console.log("REQUISIÇÂO OK!");

        const userData = JSON.parse(body);

        if (userData.action === "login") {
            console.log("Tentativa de login");
            console.log(userData.email);

            const sql = "SELECT * FROM users WHERE email = ?";

            db.query(sql, [userData.email], async (err, results) => {
                if (err) {
                    console.log("Erro ao procurar usuário:", err);
                    return;
                }

                if (results.length === 0) {
                    res.end("Usuário não encontrado!");
                    return;
                }

                const user = results[0];

                console.log("Usuário encontrado:", user.username);

                const passwordMatch = await bcrypt.compare(
                    userData.password,
                    user.password
                );

                if (passwordMatch) {
                    res.end("Login realizado!");
                } else {
                    res.end("Senha incorreta!");
                }
            });

            return;
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        console.log(hashedPassword);

        const sql = `
            INSERT INTO users (username, email, password)
            VALUES (?, ?, ?)
        `;

        const values = [
            userData.username,
            userData.email,
            hashedPassword
        ];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.log("Erro ao cadastrar:", err);
                return;
            }

            console.log("Usuário cadastrado!");

            res.end("Cadastro recebido!");
        });
    });
});

server.listen(3000);