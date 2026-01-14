import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Settings, Search, Mic, ChevronDown } from "lucide-react";
import ApiErrorScreen from './components/ApiErrorScreen.jsx';
import SearchError from './components/SearchError.jsx';

const weatherConfig = {
  0: { label: "Céu Limpo", icon: "☀️" },
  1: { label: "Limpo", icon: "🌤️" },
  2: { label: "Parcialmente Nublado", icon: "⛅" },
  3: { label: "Encoberto", icon: "☁️" },
  61: { label: "Chuva Leve", icon: "🌧️" },
  63: { label: "Chuva", icon: "🌧️" },
  71: { label: "Neve Leve", icon: "❄️" },
  95: { label: "Tempestade", icon: "⛈️" },
};

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  

  // Estados de Erro Distintos
  const [apiError, setApiError] = useState(false); // Para erro crítico (API cair)
  const [searchError, setSearchError] = useState(false); // Para erro de busca (cidade errada)

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDayOpen, setIsDayOpen] = useState(false);
  const [isUnitsOpen, setIsUnitsOpen] = useState(false);

  const [unitTemp, setUnitTemp] = useState('celsius');
  const [unitWind, setUnitWind] = useState('kmh');
  const [unitPrecip, setUnitPrecip] = useState('mm');

  // Efeito para carregar uma cidade padrão ao abrir o site
// CIDADE PADRÃO AO CARREGAR: BERLIM
  useEffect(() => {
    const defaultCity = {
      name: "Berlim",
      latitude: 52.5244,
      longitude: 13.4105,
      admin1: "Berlim"
    };
    fetchWeather(defaultCity);
  }, []);// O array vazio [] garante que isso só rode uma vez ao carregar a página
  const dates = weatherData ? [...new Set(weatherData.hourly.time.map(t => t.split('T')[0]))] : [];

  const formatDay = (dateString) => {
    if (!dateString) return "";
    const dayName = new Date(dateString + "T12:00:00").toLocaleDateString('pt-BR', { weekday: 'long' });
    return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  };

  const displayTemp = (temp) => {
    if (unitTemp === 'fahrenheit') return Math.round((temp * 9 / 5) + 32);
    return Math.round(temp);
  };

  const displayWind = (speed) => {
    if (unitWind === 'mph') return (speed * 0.621371).toFixed(1);
    return speed;
  };

  const displayPrecip = (precip) => {
    if (unitPrecip === 'inch') return (precip / 25.4).toFixed(2);
    return precip;
  };

  const searchCities = async (e) => {
    if (e.type === 'click' || (e.key === 'Enter' && city.trim() !== '')) {
      setLoading(true);
      setSearchError(false); // Reseta erro de busca ao tentar de novo
      setApiError(false);    // Reseta erro de API
      setWeatherData(null);
      setSuggestions([]);

      try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=pt&country_code=br&format=json`;
        const geoRes = await axios.get(geoUrl);

        if (!geoRes.data.results) {
          setSearchError(true); // Ativa erro de "cidade não encontrada"
          setLoading(false);
          return;
        }

        if (geoRes.data.results.length === 1) {
          fetchWeather(geoRes.data.results[0]);
        } else {
          setSuggestions(geoRes.data.results);
        }
      } catch (err) {
        setApiError(true); // Ativa tela cheia de erro de sistema/API
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchWeather = async (location) => {
    setLoading(true);
    setSuggestions([]);
    try {
      const { latitude, longitude, name, admin1 } = location;
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
      const weatherRes = await axios.get(weatherUrl);

      const data = {
        ...weatherRes.data,
        cityName: name,
        stateName: admin1,
      };

      setWeatherData(data);
      setSelectedDate(data.hourly.time[0].split('T')[0]);
      setCity('');
    } catch (err) {
      setApiError(true); // Se falhar aqui, também é erro de API
    } finally {
      setLoading(false);
    }
  };

  function DataFormatada() {
    const today = new Date();
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(today);
  }

  // INTERRUPÇÃO: Se houver erro de API, mostra a tela cheia
  if (apiError) return <ApiErrorScreen />;

  return (
    <div className="app-container">
      <header className="main-header">
        <nav className="navbar">
          <div className="logo">
            <span className="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="197" height="40" fill="none" viewBox="0 0 197 40">
                <g clipPath="url(#a)">
                  <path fill="#FF820A" d="M25.093 1.054 21.16 0l-3.315 12.37-2.992-11.168-3.933 1.054 3.233 12.066L6.1 6.269l-2.88 2.88 8.834 8.832-11-2.947L0 18.967l12.019 3.22a8.144 8.144 0 1 1 15.869-.011l10.922 2.926 1.054-3.933-12.066-3.233 11-2.947-1.054-3.934-12.066 3.234 8.053-8.053-2.88-2.88-8.71 8.711 2.952-11.013Z" />
                  <path fill="#FF820A" d="M27.877 22.221a8.127 8.127 0 0 1-2.026 3.733l7.913 7.913 2.88-2.88-8.767-8.766ZM25.771 26.037a8.137 8.137 0 0 1-3.639 2.151l2.88 10.746 3.933-1.054-3.174-11.843ZM21.985 28.227a8.157 8.157 0 0 1-2.033.256c-.753 0-1.481-.102-2.173-.293l-2.881 10.756L18.83 40l3.154-11.773ZM17.64 28.15a8.142 8.142 0 0 1-3.574-2.183L6.133 33.9l2.88 2.88 8.628-8.63ZM14 25.897a8.125 8.125 0 0 1-1.976-3.686L1.066 25.147 2.12 29.08 14 25.897Z" />
                  <path fill="#fff" d="M53.648 27 50.37 12.48h3.454l2.156 11.814h.242l2.552-11.814H62.8l2.552 11.814h.264l2.156-11.814h3.278L67.728 27h-4.422l-2.464-11.814h-.198L58.18 27h-4.532Zm24.198.308c-.953 0-1.804-.132-2.552-.396a5.14 5.14 0 0 1-1.87-1.144 5.018 5.018 0 0 1-1.188-1.848c-.264-.733-.396-1.562-.396-2.486 0-.91.125-1.745.374-2.508a5.719 5.719 0 0 1 1.144-2.002 5 5 0 0 1 1.826-1.32c.719-.308 1.533-.462 2.442-.462.88 0 1.665.147 2.354.44.69.279 1.262.704 1.716 1.276.47.572.807 1.276 1.012 2.112.22.821.301 1.767.242 2.838l-9.064.088v-1.738l7.238-.066-1.122.88c.103-.777.052-1.415-.154-1.914-.205-.499-.506-.865-.902-1.1a2.386 2.386 0 0 0-1.276-.352c-.557 0-1.048.147-1.474.44-.425.293-.755.726-.99 1.298-.234.557-.352 1.232-.352 2.024 0 1.247.272 2.163.814 2.75.558.587 1.284.88 2.178.88.411 0 .756-.051 1.034-.154.294-.117.528-.264.704-.44.191-.176.338-.374.44-.594.118-.22.213-.44.286-.66l2.75.594a5.262 5.262 0 0 1-.594 1.474c-.249.425-.586.8-1.012 1.122-.425.308-.938.543-1.54.704-.586.176-1.276.264-2.068.264Zm10.143 0c-.645 0-1.217-.125-1.716-.374a2.864 2.864 0 0 1-1.166-1.122c-.279-.484-.418-1.085-.418-1.804 0-.63.117-1.159.352-1.584.25-.425.609-.77 1.078-1.034.47-.264 1.049-.484 1.738-.66.69-.176 1.474-.33 2.354-.462.47-.073.85-.14 1.144-.198.308-.073.535-.183.682-.33.147-.161.22-.389.22-.682 0-.41-.147-.763-.44-1.056-.293-.293-.755-.44-1.386-.44-.425 0-.821.073-1.188.22-.352.147-.66.367-.924.66-.25.293-.433.667-.55 1.122l-2.794-.858a4.982 4.982 0 0 1 .748-1.562c.337-.44.74-.807 1.21-1.1a5.106 5.106 0 0 1 1.606-.682 8.25 8.25 0 0 1 1.958-.22c1.13 0 2.046.183 2.75.55.719.352 1.254.91 1.606 1.672.352.748.528 1.716.528 2.904v1.98c0 .513.007 1.034.022 1.562.03.528.059 1.063.088 1.606L95.623 27H92.83a37.091 37.091 0 0 1-.176-1.254c-.044-.484-.08-.968-.11-1.452h-.396a5.078 5.078 0 0 1-.88 1.518c-.381.455-.85.821-1.408 1.1-.543.264-1.166.396-1.87.396Zm1.342-2.288c.279 0 .557-.051.836-.154.293-.103.572-.242.836-.418.279-.19.528-.425.748-.704.235-.279.425-.594.572-.946l-.044-1.848.506.11c-.264.19-.572.345-.924.462a8.59 8.59 0 0 1-1.1.242c-.367.059-.733.125-1.1.198a5.652 5.652 0 0 0-.99.286 1.8 1.8 0 0 0-.682.484c-.161.19-.242.462-.242.814 0 .455.147.814.44 1.078.293.264.675.396 1.144.396Zm13.111 2.244c-1.29 0-2.244-.337-2.86-1.012-.601-.69-.902-1.782-.902-3.278v-5.038h-1.672l.044-2.486h1.166c.455 0 .792-.066 1.012-.198.22-.132.352-.374.396-.726l.286-1.65h1.804v2.574h2.926v2.574h-2.926v4.818c0 .528.125.91.374 1.144.25.235.631.352 1.144.352.279 0 .543-.03.792-.088a1.91 1.91 0 0 0 .682-.286v2.948a6.552 6.552 0 0 1-1.254.286 8.932 8.932 0 0 1-1.012.066Zm4.454-.264V11.27h3.19v3.608c0 .293-.014.601-.044.924a7.678 7.678 0 0 1-.11.99c-.044.323-.095.653-.154.99-.044.337-.095.675-.154 1.012h.484c.206-.748.462-1.393.77-1.936.323-.543.734-.96 1.232-1.254.499-.308 1.13-.462 1.892-.462 1.35 0 2.362.477 3.036 1.43.675.939 1.012 2.383 1.012 4.334V27h-3.19v-5.61c0-1.232-.183-2.141-.55-2.728-.352-.601-.887-.902-1.606-.902-.586 0-1.07.176-1.452.528-.381.352-.667.829-.858 1.43-.19.587-.3 1.247-.33 1.98V27h-3.168Zm19.247.308c-.953 0-1.804-.132-2.552-.396a5.15 5.15 0 0 1-1.87-1.144 5.028 5.028 0 0 1-1.188-1.848c-.264-.733-.396-1.562-.396-2.486 0-.91.125-1.745.374-2.508a5.73 5.73 0 0 1 1.144-2.002 5.008 5.008 0 0 1 1.826-1.32c.719-.308 1.533-.462 2.442-.462.88 0 1.665.147 2.354.44.69.279 1.262.704 1.716 1.276.47.572.807 1.276 1.012 2.112.22.821.301 1.767.242 2.838l-9.064.088v-1.738l7.238-.066-1.122.88c.103-.777.052-1.415-.154-1.914-.205-.499-.506-.865-.902-1.1a2.383 2.383 0 0 0-1.276-.352c-.557 0-1.048.147-1.474.44-.425.293-.755.726-.99 1.298-.234.557-.352 1.232-.352 2.024 0 1.247.272 2.163.814 2.75.558.587 1.284.88 2.178.88.411 0 .756-.051 1.034-.154.294-.117.528-.264.704-.44.191-.176.338-.374.44-.594.118-.22.213-.44.286-.66l2.75.594a5.262 5.262 0 0 1-.594 1.474c-.249.425-.586.8-1.012 1.122-.425.308-.938.543-1.54.704-.586.176-1.276.264-2.068.264Zm7.415-.308V15.45h2.618l.022 3.938h.418c.118-.983.316-1.782.594-2.398.294-.616.697-1.07 1.21-1.364.514-.293 1.152-.44 1.914-.44.132 0 .272.007.418.022.162 0 .345.022.55.066l-.132 3.366a2.794 2.794 0 0 0-.726-.22 4.33 4.33 0 0 0-.704-.066c-.572 0-1.063.132-1.474.396-.41.264-.748.645-1.012 1.144-.249.484-.418 1.078-.506 1.782V27h-3.19Zm14.764 0V12.48h4.136l6.578 10.274h.242l-.198-10.274h3.08V27h-3.74l-6.952-10.758h-.242L151.424 27h-3.102Zm22.14.308c-1.158 0-2.178-.227-3.058-.682a5.052 5.052 0 0 1-2.068-2.046c-.498-.91-.748-2.039-.748-3.388 0-1.35.25-2.471.748-3.366.514-.895 1.21-1.562 2.09-2.002.895-.455 1.907-.682 3.036-.682 1.159 0 2.178.227 3.058.682a4.845 4.845 0 0 1 2.09 2.046c.514.895.77 2.017.77 3.366 0 1.364-.264 2.5-.792 3.41a4.873 4.873 0 0 1-2.112 2.002c-.88.44-1.884.66-3.014.66Zm.11-2.354c.572 0 1.049-.132 1.43-.396.396-.264.69-.66.88-1.188.206-.543.308-1.195.308-1.958 0-.807-.11-1.489-.33-2.046-.205-.572-.513-1.005-.924-1.298-.41-.308-.931-.462-1.562-.462-.542 0-1.012.132-1.408.396-.396.25-.696.645-.902 1.188-.205.528-.308 1.18-.308 1.958 0 1.247.25 2.193.748 2.838.499.645 1.188.968 2.068.968ZM180.306 27l-2.86-11.55h3.3l1.628 9.042h.418l1.936-9.042h3.806l2.002 9.042h.418l1.584-9.042h3.234L192.89 27h-4.356l-1.804-8.976h-.374L184.64 27h-4.334Z" />
                </g>
                <defs>
                  <clipPath id="a">
                    <path fill="#fff" d="M0 0h196.864v40H0z" />
                  </clipPath>
                </defs>
              </svg>
            </span>
          </div>
          <div className="nav-actions">
            <div className="custom-dropdown">
              <button className="unit-selector" onClick={() => setIsUnitsOpen(!isUnitsOpen)}>
                <Settings size={16} />
                <span>Unidades</span>
                <ChevronDown size={16} className={isUnitsOpen ? 'rotate-180' : ''} />
              </button>

              {isUnitsOpen && (
                <div className="dropdown-menu units-menu" onClick={(e) => e.stopPropagation()}>
                  <div className="menu-header" style={{ padding: '8px 16px', borderBottom: '1px solid #313351' }}>
                    <button className="text-btn" style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                      onClick={() => { setUnitTemp('fahrenheit'); setUnitWind('mph'); setUnitPrecip('inch'); setIsUnitsOpen(false); }}>
                      Switch to Imperial
                    </button>
                  </div>
                  <div className="menu-section">
                    <p className="menu-label">Temperature</p>
                    <button className={`dropdown-item ${unitTemp === 'celsius' ? 'active' : ''}`}
                      onClick={() => { setUnitTemp('celsius'); setIsUnitsOpen(false); }}>
                      Celsius (°C) {unitTemp === 'celsius' && <span className="check">✓</span>}
                    </button>
                    <button className={`dropdown-item ${unitTemp === 'fahrenheit' ? 'active' : ''}`}
                      onClick={() => { setUnitTemp('fahrenheit'); setIsUnitsOpen(false); }}>
                      Fahrenheit (°F) {unitTemp === 'fahrenheit' && <span className="check">✓</span>}
                    </button>
                  </div>
                  <div className="menu-section">
                    <p className="menu-label">Wind Speed</p>
                    <button className={`dropdown-item ${unitWind === 'kmh' ? 'active' : ''}`}
                      onClick={() => { setUnitWind('kmh'); setIsUnitsOpen(false); }}>
                      km/h {unitWind === 'kmh' && <span className="check">✓</span>}
                    </button>
                    <button className={`dropdown-item ${unitWind === 'mph' ? 'active' : ''}`}
                      onClick={() => { setUnitWind('mph'); setIsUnitsOpen(false); }}>
                      mph {unitWind === 'mph' && <span className="check">✓</span>}
                    </button>
                  </div>
                  <div className="menu-section">
                    <p className="menu-label">Precipitation</p>
                    <button className={`dropdown-item ${unitPrecip === 'mm' ? 'active' : ''}`}
                      onClick={() => { setUnitPrecip('mm'); setIsUnitsOpen(false); }}>
                      Millimeters (mm) {unitPrecip === 'mm' && <span className="check">✓</span>}
                    </button>
                    <button className={`dropdown-item ${unitPrecip === 'inch' ? 'active' : ''}`}
                      onClick={() => { setUnitPrecip('inch'); setIsUnitsOpen(false); }}>
                      Inches (in) {unitPrecip === 'inch' && <span className="check">✓</span>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        <section className="hero-section">
          <h1>Como está o céu hoje?</h1>
          <div className="search-wrapper">
            <div className="search-input-group">
              <Search className="icon-left" size={20} />
              <input type="text" placeholder="Procurar um lugar..." value={city} onChange={(e) => setCity(e.target.value)} onKeyDown={searchCities} />
              <Mic className="icon-right" size={20} />
            </div>
            <button className="btn-search" onClick={searchCities}>Pesquisa</button>

           

          </div>

            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((item) => (
                  <ul key={item.id} onClick={() => fetchWeather(item)}>
                    <strong>{item.name}</strong>, {item.admin1}
                  </ul>
                ))}
              </ul>
            )}
        </section>
      </header>

      {loading ? (
  <main className="weather-grid">
    <div className="left-side">
      {/* Card Principal em modo Loading */}
      <section className="main-card skeleton loading-main-card">
        <div className="dot-flashing">
          <div className="dot" style={{ animationDelay: '0s' }}></div>
          <div className="dot" style={{ animationDelay: '0.2s' }}></div>
          <div className="dot" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p>Loading...</p>
      </section>

      {/* Grid de Detalhes em modo Loading */}
      <section className="details-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="detail-item skeleton" style={{ height: '100px' }}></div>
        ))}
      </section>

      {/* Previsão Diária em modo Loading */}
      <div className="daily">
        <div className="daily-forecast">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="daily-item skeleton" style={{ height: '155px', width: '75px' }}></div>
          ))}
        </div>
      </div>
    </div>

    {/* Lateral Horária em modo Loading */}
    <aside className="hourly-forecast skeleton">
      <div style={{ padding: '20px' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="hourly-row skeleton" style={{ height: '50px', marginBottom: '10px', opacity: 0.5 }}></div>
        ))}
      </div>
    </aside>
  </main>
) : weatherData && (
  /* SEU CÓDIGO NORMAL DA WEATHER GRID AQUI */
  <main className="weather-grid">
     {/* ... resto do seu código atual ... */}
  </main>
)}
 {/* EXIBIÇÃO DO ERRO DE BUSCA LOGO ABAIXO DA BARRA */}
            {searchError && <SearchError />}
      

      {weatherData && (
        <main className="weather-grid">
          <div className="left-side">
            <section className="main-card">
              <div className='city'>
                <h1>{weatherData.cityName}, {weatherData.stateName}</h1>
                <p>{DataFormatada()}</p>
              </div>
              <div className="temp-container">
                <span className="icon-big">{weatherConfig[weatherData.current.weather_code]?.icon || "🌡️"}</span>
                <div className="temp-big">{displayTemp(weatherData.current.temperature_2m)}°</div>
              </div>
            </section>

            <section className="details-grid">
              <div className="detail-item"><p>Sensação</p><strong>{displayTemp(weatherData.current.apparent_temperature)}°</strong></div>
              <div className="detail-item"><p>Umidade</p><strong>{weatherData.current.relative_humidity_2m}%</strong></div>
              <div className="detail-item"><p>Vento</p><strong>{displayWind(weatherData.current.wind_speed_10m)} {unitWind === 'kmh' ? 'km/h' : 'mph'}</strong></div>
              <div className="detail-item"><p>Chuva</p><strong>{displayPrecip(weatherData.current.precipitation)} {unitPrecip === 'mm' ? 'mm' : 'in'}</strong></div>
            </section>

            <div className='daily'>
              <h2>Previsão Diária</h2>
              <footer className="daily-forecast">
                {weatherData.daily.time.map((date, index) => (
                  <div key={index} className="daily-item">
                    <p>{new Date(date + "T12:00:00").toLocaleDateString('pt-BR', { weekday: 'short' })}</p>
                    <span>{weatherConfig[weatherData.daily.weather_code[index]]?.icon}</span>
                    <p>{displayTemp(weatherData.daily.temperature_2m_max[index])}° / {displayTemp(weatherData.daily.temperature_2m_min[index])}°</p>
                  </div>
                ))}
              </footer>
            </div>
          </div>

          <aside className="hourly-forecast">
            <div className="hourly-header">
              <h3>Previsão horária</h3>
              <div className="custom-dropdown">
                <button className="dropdown-trigger" onClick={() => setIsDayOpen(!isDayOpen)}>
                  {formatDay(selectedDate)}
                  <ChevronDown size={16} className={isDayOpen ? 'rotate-180' : ''} />
                </button>
                {isDayOpen && (
                  <div className="dropdown-menu">
                    {dates.map((date) => (
                      <button key={date} className={`dropdown-item ${selectedDate === date ? 'active' : ''}`} onClick={() => { setSelectedDate(date); setIsDayOpen(false); }}>
                        {formatDay(date)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="hourly-list">
              {weatherData.hourly.time.map((time, index) => {
                if (!time.startsWith(selectedDate)) return null;
                const hours = new Date(time).getHours();
                const period = hours >= 12 ? 'PM' : 'AM';
                const hourDisplay = hours === 0 ? "0 AM" : `${hours % 12 || 12} ${period}`;
                return (
                  <div key={index} className="hourly-row">
                    <div className="hourly-time">
                      <span className="icon">{weatherConfig[weatherData.hourly.weather_code[index]]?.icon || "☀️"}</span>
                      <span>{hourDisplay.toUpperCase()}</span>
                    </div>
                    <span className="hourly-temp">{displayTemp(weatherData.hourly.temperature_2m[index])}°</span>
                  </div>
                );
              })}
            </div>
          </aside>
        </main>
      )}
    </div>
  );
}

export default App;