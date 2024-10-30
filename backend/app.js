const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('./db/Henkilo.db');

app.use(cors());
app.use(express.json());

// Lomakkeen SQL-komennon käsittely
app.post('/execute-sql', (req, res) => {
    const { sql, nimi } = req.body;

    // Tallenna SQL-lause ja käyttäjän nimi AuditTrail-tauluun
    const auditSql = 'INSERT INTO AuditTrail (Nimi, Sql) VALUES (?, ?)';
    db.run(auditSql, [nimi, sql], (err) => {
        if (err) {
            console.error('Audit trail insert error:', err.message);
            return res.status(500).json({ message: 'Error auditing SQL' });
        }
    });

    // Suorita SQL-lause ja palauta tulos tai virhe
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('SQL execution error:', err.message);
            return res.status(400).json({ message: 'SQL Error', error: err.message });
        }
        res.json({ data: rows });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
