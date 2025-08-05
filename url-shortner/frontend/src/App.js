import React, { useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [short, setShort] = useState(null);
  const [inputCode, setInputCode] = useState("");
  const [stats, setStats] = useState(null);
  const [loadingShorten, setLoadingShorten] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState(null);
  const [copyStatus, setCopyStatus] = useState("");

  // Use environment variable or Render URL
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 
                      "https://retainsure-astv.onrender.com";

  const shorten = async () => {
    setError(null);
    setLoadingShorten(true);
    setStats(null);
    setShort(null);
    try {
      const resp = await fetch(`${BACKEND_URL}/api/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "Error shortening URL");
      }
      setShort(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingShorten(false);
    }
  };

  const fetchStats = async () => {
    if (!inputCode.trim()) {
      setError("Please enter a short code");
      return;
    }
    setError(null);
    setLoadingStats(true);
    setStats(null);
    try {
      const resp = await fetch(`${BACKEND_URL}/api/stats/${inputCode.trim()}`);
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Stats not found for code");
      setStats(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingStats(false);
    }
  };

  // Copy short URL to clipboard
  const handleCopy = () => {
    if (short && short.short_url) {
      navigator.clipboard.writeText(short.short_url);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 1500);
    }
  };

  return (
    <div className="app-container">
      <div className="app-content">
        <header className="app-header">
          <h1 className="app-title">🚀 URL Shortener</h1>
          <p className="app-subtitle">Shorten, share, and track your links</p>
        </header>

        <section className="card shorten-card">
          <div className="card-header">
            <h2 className="card-title">Shorten Your URL</h2>
          </div>
          
          <div className="card-body">
            <div className="input-group">
              <input
                type="url"
                placeholder="Enter a valid URL (e.g. https://example.com)"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="input"
                disabled={loadingShorten}
              />
              <button 
                onClick={shorten} 
                disabled={loadingShorten || !url.trim()}
                className={`button shorten-button ${loadingShorten ? 'loading' : ''}`}
              >
                {loadingShorten ? (
                  <span className="button-content">
                    <span className="spinner"></span>
                    Shortening...
                  </span>
                ) : "Shorten"}
              </button>
            </div>

            {short && (
              <div className="result-box">
                <div className="result-header">
                  <span className="result-label">Short URL:</span>
                  <span className="copy-status">{copyStatus}</span>
                </div>
                <div className="short-url-container">
                  <a 
                    href={short.short_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="short-url"
                  >
                    {short.short_url}
                  </a>
                  <button 
                    className="copy-button" 
                    onClick={handleCopy} 
                    title="Copy to clipboard"
                    aria-label="Copy to clipboard"
                  >
                    <svg className="copy-icon" viewBox="0 0 24 24">
                      <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="card stats-card">
          <div className="card-header">
            <h2 className="card-title">Get URL Analytics</h2>
          </div>
          
          <div className="card-body">
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter short code (e.g. abc123)"
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                className="input"
                disabled={loadingStats}
              />
              <button 
                onClick={fetchStats} 
                disabled={loadingStats || !inputCode.trim()}
                className={`button stats-button ${loadingStats ? 'loading' : ''}`}
              >
                {loadingStats ? (
                  <span className="button-content">
                    <span className="spinner"></span>
                    Loading...
                  </span>
                ) : "Get Stats"}
              </button>
            </div>

            {stats && (
              <div className="stats-box">
                <div className="stat-item">
                  <span className="stat-label">Original URL:</span>
                  <a 
                    href={stats.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="stat-value"
                  >
                    {stats.url}
                  </a>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Clicks:</span>
                  <span className="stat-value">{stats.clicks}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Created At:</span>
                  <span className="stat-value">
                    {new Date(stats.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {error && (
          <div className="error-message">
            <svg className="error-icon" viewBox="0 0 24 24">
              <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
            </svg>
            <span className="error-text">{error}</span>
          </div>
        )}

        <footer className="app-footer">
          <small>Simple URL Shortener &copy; {new Date().getFullYear()}</small>
        </footer>
      </div>
    </div>
  );
}

export default App;