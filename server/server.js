//now, only God knows how this works :D
//that said, good luck!

const http = require("http");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: "./.env" });
const crypto = require("crypto");

const db = mysql.createConnection({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    port: process.env.DB_PORT,

    ssl: {
        rejectUnauthorized: true
    }

});

db.connect((err) => {
    if (err) {
        console.log("Erro ao conectar ao MySQL:", err);
        return;
    }

    console.log("MySQL conectado!");
});

const sessions = {};

const server = http.createServer((req, res) => {

    res.setHeader("Access-Control-Allow-Origin", "*");

    const cookies = req.headers.cookie;

    if (cookies) {
        const sessionId = cookies.split("=")[1];

        console.log("Session ID:", sessionId);

        const userId = sessions[sessionId];

        console.log("User ID:", userId);
    }

    // get tasks
    if (req.method === "GET" && req.url === "/tasks") {

        const cookies = req.headers.cookie;

        if (!cookies) {
            res.statusCode = 401;
            res.end("You're not logged in!");
            return;
        }

        const sessionId = cookies.split("=")[1];
        const userId = sessions[sessionId];

        if (!userId) {
            res.statusCode = 401;
            res.end("Invalid session!");
            return;
        }

        const sql = "SELECT * FROM tasks WHERE user_id = ?";

        db.query(sql, [userId], (err, results) => {

            if (err) {
                console.log("Error while getting tasks:", err);
                res.statusCode = 500;
                res.end("Server error!");
                return;
            }

            res.end(JSON.stringify(results));
        });

        return;
    }

    // delete task
    if (req.method === "DELETE" && req.url === "/tasks") {

        const cookies = req.headers.cookie;

        if (!cookies) {
            res.statusCode = 401;
            res.end("You're not logged in!");
            return;
        }

        const sessionId = cookies.split("=")[1];
        const userId = sessions[sessionId];

        if (!userId) {
            res.statusCode = 401;
            res.end("Invalid session!");
            return;
        }

        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {

            const taskData = JSON.parse(body);

            const sql = `
                DELETE FROM tasks
                WHERE id = ? AND user_id = ?
            `;

            const values = [
                taskData.id,
                userId
            ];

            db.query(sql, values, (err, result) => {

                if (err) {
                    console.log("Error while deleting task:", err);
                    res.statusCode = 500;
                    res.end("Server error!");
                    return;
                }

                res.end("Task deleted!");
            });
        });

        return;
    }

    // update task
    if (req.method === "PATCH" && req.url === "/tasks") {

        const cookies = req.headers.cookie;

        if (!cookies) {
            res.statusCode = 401;
            res.end("You're not logged in!");
            return;
        }

        const sessionId = cookies.split("=")[1];
        const userId = sessions[sessionId];

        if (!userId) {
            res.statusCode = 401;
            res.end("Invalid session!");
            return;
        }

        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {

            const taskData = JSON.parse(body);

            const sql = `
                UPDATE tasks
                SET completed = ?
                WHERE id = ? AND user_id = ?
            `;

            const values = [
                taskData.completed,
                taskData.id,
                userId
            ];

            db.query(sql, values, (err, result) => {

                if (err) {
                    console.log("Error while updating task:", err);
                    res.statusCode = 500;
                    res.end("Server error!");
                    return;
                }

                res.end("Task updated!");
            });
        });

        return;
    }

    if (req.method === "GET" && req.url !== "/me") {

        if (req.url === "/") {

            const cookies = req.headers.cookie;

            if (!cookies) {
                res.statusCode = 302;
                res.setHeader("Location", "/sign-in.html");
                res.end();
                return;
            }

            const sessionId = cookies.split("=")[1];
            const userId = sessions[sessionId];

            if (!userId) {
                res.statusCode = 302;
                res.setHeader("Location", "/sign-in.html");
                res.end();
                return;
            }
        }

        let filePath;

        if (req.url === "/") {
            filePath = "index.html";
        } else {
            filePath = "." + req.url;
        }

        fs.readFile(filePath, (err, data) => {

            if (err) {
                res.statusCode = 404;
                res.end("File not found!");
                return;
            }

            res.end(data);
        });

        return;
    }

    if (req.method === "GET" && req.url === "/me") {

        const cookies = req.headers.cookie;

        if (!cookies) {
            res.statusCode = 401;
            res.end("You're not logged in!");
            return;
        }

        const sessionId = cookies.split("=")[1];

        const userId = sessions[sessionId];

        if (!userId) {
            res.statusCode = 401;
            res.end("Invalid session!");
            return;
        }

        const sql = "SELECT username FROM users WHERE id = ?";

        db.query(sql, [userId], (err, results) => {

            if (err) {
                console.log("Erro ao procurar usuário:", err);
                res.statusCode = 500;
                res.end("Server error!");
                return;
            }

            if (results.length === 0) {
                res.statusCode = 404;
                res.end("User not found!");
                return;
            }

            const username = results[0].username;

            res.end(username);
        });

        return;
    }

    if (req.method === "POST" && req.url === "/logout") {

        const cookies = req.headers.cookie;

        if (cookies) {
            const sessionId = cookies.split("=")[1];

            delete sessions[sessionId];
        }

        res.setHeader(
            "Set-Cookie",
            "sessionId=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0"
        );

        res.end("Logout succesfull!");

        return;
    }

    // tasks ig
    if (req.method === "POST" && req.url === "/tasks") {

        const cookies = req.headers.cookie;

        if (!cookies) {
            res.statusCode = 401;
            res.end("You're not logged in!");
            return;
        }

        const sessionId = cookies.split("=")[1];
        const userId = sessions[sessionId];

        if (!userId) {
            res.statusCode = 401;
            res.end("Invalid session!");
            return;
        }

        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {

            const taskData = JSON.parse(body);

            const sql = `
                INSERT INTO tasks (user_id, task)
                VALUES (?, ?)
            `;

            const values = [
                userId,
                taskData.task
            ];

            db.query(sql, values, (err, result) => {

                if (err) {
                    console.log("Error while creating task:", err);
                    res.statusCode = 500;
                    res.end("Server error!");
                    return;
                }

                res.end(JSON.stringify({
                    id: result.insertId
                }));
            });
        });

        return;
    }

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
                    console.log("Error while trying to find user:", err);
                    return;
                }

                if (results.length === 0) {
                    res.end("User not found!");
                    return;
                }

                const user = results[0];

                console.log("User found:", user.username);

                const passwordMatch = await bcrypt.compare(
                    userData.password,
                    user.password
                );

                if (passwordMatch) {

                    const sessionId = crypto.randomUUID();

                    sessions[sessionId] = user.id;

                    console.log("Session created:", sessionId);
                    console.log("Session user:", user.id);

                    res.setHeader(
                        "Set-Cookie",
                        `sessionId=${sessionId}; HttpOnly; SameSite=Lax; Path=/`
                    );

                    res.end("Login succesfull!");

                } else {
                    res.end("Invalid password!");
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
                console.log("Error while signing-up:", err);
                return;
            }

            console.log("User signed-up!");

            res.end("Sign-up data received succesfully!");
        });
    });
});

server.listen(process.env.PORT || 3000, "0.0.0.0");