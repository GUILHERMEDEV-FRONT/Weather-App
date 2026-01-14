import { RotateCw, AlertTriangle } from "lucide-react";



const ApiErrorScreen = ({ onRetry }) => {
  return (
    <>
      <style>{`
        .weather-app-container {
          background-color: #0B0B1E;
          color: #FFFFFF;
          height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 40px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          font-size: 18px;
        }

        .units-dropdown {
          background-color: #1E1E3F;
          border: 1px solid #31315B;
          color: #FFFFFF;
          padding: 8px 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          cursor: pointer;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .error-icon-circle {
          margin-bottom: 24px;
          opacity: 0.9;
        }

        .error-title {
          font-size: 40px;
          font-weight: 700;
          margin: 0 0 16px 0;
        }

        .error-description {
          color: #9A9AB5;
          font-size: 16px;
          line-height: 1.5;
          max-width: 450px;
          margin-bottom: 32px;
        }

        .retry-btn {
          background-color: #1E1E3F;
          color: #FFFFFF;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .retry-btn:hover {
          background-color: #2A2A5A;
        }
      `}</style>

      <div className="weather-app-container">
        {/* Barra Superior */}
        <header className="header">
          <div className="logo-section">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" fill="#FF8A00" />
              <path d="M12 2V4M12 20V22M4 12H2M22 12H20M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93" stroke="#FF8A00" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Weather Now
          </div>
          <button className="units-dropdown">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Units
            <span>▾</span>
          </button>
        </header>

        {/* Mensagem de Erro Central */}
        <main className="main-content">
          <div className="error-icon-circle">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9A9AB5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
          </div>

          <h1 className="error-title">Algo deu errado
          </h1>
          <p className="error-description">
            Não foi possível conectar-se ao servidor (erro de API). Tente novamente em alguns instantes.
          </p>

          <button className="retry-btn" onClick={() => window.location.reload()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Retry
          </button>

        </main>
      </div>
    </>
  );
};

export default ApiErrorScreen;