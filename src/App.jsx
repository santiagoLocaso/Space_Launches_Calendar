import axios from 'axios'
import { useState, useEffect } from 'react';
import './App.css';
import { LaunchCard } from "./components/LaunchCard/LaunchCard.jsx";
import { LaunchDetail } from "./components/LaunchDetail/LaunchDetail.jsx";
import { fetchUpcomingLaunches } from './services/api'; // Importamos el servicio

function App() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLaunch, setSelectedLaunch] = useState(null);

  // El useEffect ahora está súper limpio
  useEffect(() => {
    const getLaunches = async () => {
      try {
        const data = await fetchUpcomingLaunches(); // Usamos la función del servicio
        setLaunches(data);
        setLoading(false);
      } catch (err) {
        setError('Error de enlace ascendente con el centro de datos.');
        setLoading(false);
      }
    };
    getLaunches();
  }, []);

  if (loading) return <div className="loading">SINCRO DE DATOS ORBITALES EN CURSO...</div>;
  if (error) return <div className="error">{error}</div>;

  if (selectedLaunch) {
    return <LaunchDetail launch={selectedLaunch} onBack={() => setSelectedLaunch(null)} />;
  }

  return (
    <div className="app-container">
      <header className="main-header">
        <h1>CALENDARIO DE LANZAMIENTOS</h1>
      </header>

      <main className="cdm-cards-grid">
        {launches.map((launch) => (
          <LaunchCard 
            key={launch.id} 
            launch={launch} 
            onClick={() => setSelectedLaunch(launch)} 
          />
        ))}
      </main>

      <footer className="main-footer">
        <p>"Mira otra vez ese punto. Eso es aquí. Ese es nuestro hogar. Eso somos nosotros."</p>
        <div className="footer-links">
          <span>&copy; {new Date().getFullYear()} SANTIAGO LOCASO</span>
          <a href="https://www.linkedin.com/in/santiago-locaso/" target="_blank" rel="noopener noreferrer">CONTACTO</a>
        </div>
      </footer>
    </div>
  );
}

export default App;