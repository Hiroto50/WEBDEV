import React, { useState } from 'react';

function App() {
    const [nimi, setNimi] = useState('');
    const [sql, setSql] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/execute-sql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nimi, sql })
            });
            const data = await response.json();
            if (response.ok) {
                setResult(data.data);
                setError(null);
            } else {
                setResult(null);
                setError(data.error);
            }
        } catch (err) {
            setError('Server error');
        }
    };

    return (
        <div>
            <h1>SQL Executor</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nimi"
                    value={nimi}
                    onChange={(e) => setNimi(e.target.value)}
                    required
                />
                <textarea
                    placeholder="SQL-lause"
                    value={sql}
                    onChange={(e) => setSql(e.target.value)}
                    required
                ></textarea>
                <button type="submit">Suorita SQL</button>
            </form>
            {result && (
                <div>
                    <h2>Tulos:</h2>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
            {error && (
                <div>
                    <h2>Virhe:</h2>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}

export default App;
