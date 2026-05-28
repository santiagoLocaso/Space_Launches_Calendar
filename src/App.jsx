import { useState, useEffect } from 'react';
import './App.css';
import { LaunchCard } from './components/LaunchCard/LaunchCard.jsx';
import { LaunchDetail } from './components/LaunchDetail/LaunchDetail.jsx';
import { fetchUpcomingLaunches } from './services/api';

function App() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLaunch, setSelectedLaunch] = useState(null);

  useEffect(() => {
    const getLaunches = async () => {
      try {
        const data = await fetchUpcomingLaunches();
        setLaunches(data);
        
        // MAGIA DE ENRUTAMIENTO: Leer la URL al cargar la app
        const params = new URLSearchParams(window.location.search);
        const launchId = params.get('id');
        
        if (launchId) {
          // Si hay un ID en la URL, buscamos el cohete y lo abrimos
          const foundLaunch = data.find(l => l.id === launchId);
          if (foundLaunch) {
            setSelectedLaunch(foundLaunch);
          }
        }

        setLoading(false);
      } catch (err) {
        setError('Error de enlace ascendente con el centro de datos.');
        setLoading(false);
      }
    };
    getLaunches();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      // Leemos la URL actual después de que el usuario tocó "Atrás"
      const params = new URLSearchParams(window.location.search);
      const launchId = params.get('id');

      if (launchId) {
        // Si sigue habiendo un ID, buscamos y mostramos ese lanzamiento
        const foundLaunch = launches.find(l => l.id === launchId);
        setSelectedLaunch(foundLaunch || null);
      } else {
        // Si no hay ID (porque volvimos a la raíz), cerramos el detalle
        setSelectedLaunch(null);
      }
    };

    // Activamos el "escuchador" del navegador
    window.addEventListener('popstate', handlePopState);

    // Limpiamos el evento si el componente se desmonta
    return () => window.removeEventListener('popstate', handlePopState);
  }, [launches]);

  // Función para cambiar de pantalla y actualizar la URL al mismo tiempo
  const handleNavigation = (launch) => {
    setSelectedLaunch(launch);
    if (launch) {
      // Agrega el ID a la URL sin recargar la página
      window.history.pushState({}, '', `?id=${launch.id}`);
    } else {
      // Limpia la URL al volver al inicio
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  if (loading) return <div className="loading">SINCRO DE DATOS ORBITALES EN CURSO...</div>;
  if (error) return <div className="error">{error}</div>;

  if (selectedLaunch) {
    return <LaunchDetail launch={selectedLaunch} onBack={() => handleNavigation(null)} />;
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
            onClick={() => handleNavigation(launch)} 
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