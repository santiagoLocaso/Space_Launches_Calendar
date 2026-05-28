import { useState, useEffect } from 'react';
import axios from 'axios';
import './LaunchDetail.css';
import { translateStatus, translateLocation, translateType, translateOrbit } from '../../utils/formatters';
import { useCountdown } from '../../hooks/useCountdown';

export function LaunchDetail({ launch, onBack }) {
  const [translatedDesc, setTranslatedDesc] = useState('');
  const [isTranslating, setIsTranslating] = useState(true);

  const [isCopied, setIsCopied] = useState(false);

  // MAGIA PURA: Reemplazamos 35 líneas de lógica por esta sola línea
  const timeParts = useCountdown(launch.net);

  const rocketImage = launch.image || 'https://images.unsplash.com/photo-1517976487492-5750f3195933?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  const launchDate = new Date(launch.net);
  const webcastUrl = launch.vidURLs?.[0]?.url || null;

  const firstStage = launch.rocket?.launcher_stage?.[0];
  const boosterSerial = firstStage?.launcher?.serial_number ? firstStage.launcher.serial_number : 'DESCONOCIDO';
  const landingAttempt = firstStage?.landing?.attempt;
  const landingLocation = firstStage?.landing?.location?.abbrev || firstStage?.landing?.location?.name || 'TBD';
  const recoveryStatus = landingAttempt ? landingLocation.toUpperCase() : 'NO RECUPERABLE';

  const targetTimezones = [
    { country: 'Argentina / Uruguay', zone: 'America/Argentina/Buenos_Aires' },
    { country: 'España (Madrid)', zone: 'Europe/Madrid' },
    { country: 'México (CDMX)', zone: 'America/Mexico_City' },
    { country: 'Colombia / Perú', zone: 'America/Bogota' },
    { country: 'Chile / Paraguay', zone: 'America/Santiago' },
    { country: 'Venezuela', zone: 'America/Caracas' }
  ];

  // Traducción de la descripción (se mantiene igual)
  useEffect(() => {
    const translateTexts = async () => {
      setIsTranslating(true);
      const descText = launch.mission?.description;
      if (descText) {
        try {
          const descRes = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(descText)}&langpair=en|es`);
          if (descRes.data?.responseData?.translatedText) {
            setTranslatedDesc(descRes.data.responseData.translatedText);
          } else {
            setTranslatedDesc(descText);
          }
        } catch (error) {
          setTranslatedDesc(descText);
        }
      } else {
        setTranslatedDesc('No se registran especificaciones ni descripción detallada para esta misión en la base de datos.');
      }
      setIsTranslating(false);
    };
    translateTexts();
  }, [launch]);

  const handleCopyLink = () => {
    const publicUrl = `${window.location.origin}/?id=${launch.id}`;
    navigator.clipboard.writeText(publicUrl);
    
    setIsCopied(true);
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const publicShareUrl = `${window.location.origin}/?id=${launch.id}`;
  
  const whatsappText = `🚀 ¡Mira este lanzamiento: *${launch.name}*!\n\nSigue la cuenta regresiva, la telemetría y los datos de la misión aquí:\n${publicShareUrl}`;
  const twitterText = `🚀 Sigue el lanzamiento de ${launch.name} en el calendario de misiones.\n\n`;

// --- FUNCIÓN PARA AGENDAR EN GOOGLE CALENDAR ---
  const handleAddToCalendar = () => {
    const startDate = new Date(launch.net);
    // Asumimos que el evento de lanzamiento dura 1 hora en la agenda
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    // Google Calendar requiere este formato exacto: YYYYMMDDTHHmmssZ
    const formatToGCalDate = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const title = encodeURIComponent(`🚀 Lanzamiento: ${launch.name}`);
    const details = encodeURIComponent(`Sigue la cuenta regresiva, la telemetría y transmisión en vivo aquí:\n${window.location.origin}/?id=${launch.id}`);
    const location = encodeURIComponent(launch.pad?.name || 'Centro Espacial');
    const dates = `${formatToGCalDate(startDate)}/${formatToGCalDate(endDate)}`;

    // URL dinámica que abre Google Calendar con todo pre-completado
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    
    window.open(gCalUrl, '_blank');
  };

  return (
    <div className="cdm-container">
      <div className="cdm-back-nav">
        <button className="cdm-back-btn" onClick={onBack}>
          ← VOLVER AL CALENDARIO
        </button>
      </div>

      <div className="cdm-hero" style={{ backgroundImage: `linear-gradient(to top, #000000 0%, rgba(0, 0, 0, 0.3) 100%), url(${rocketImage})` }}>
        <div className="cdm-hero-content">
          <span className="cdm-badge">{translateStatus(launch.status?.name)}</span>
          <h1>{launch.name.toUpperCase()}</h1>
          <div className="cdm-hero-meta">
            <span>📅 {launchDate.toLocaleDateString('es-AR')}</span>
            <span>🕒 {launchDate.toLocaleTimeString('es-AR', {hour: '2-digit', minute:'2-digit'})} HS</span>
            <span>🚀 {launch.rocket?.configuration?.name?.toUpperCase()}</span>
            <span>🏢 {launch.launch_service_provider?.name?.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* EL RESTO DEL JSX (HTML) SE MANTIENE EXACTAMENTE IGUAL */}
      <div className="cdm-box">
        <h3>COUNTDOWN</h3>
        <div className="cdm-timer-display">
          <span className="cdm-timer-sign">{timeParts.sign}</span>
          {timeParts.d !== '00' && (
            <>
              <div className="cdm-time-block">
                <span className="cdm-time-num">{timeParts.d}</span>
                <span className="cdm-time-label">DÍAS</span>
              </div>
              <span className="cdm-timer-colon">:</span>
            </>
          )}
          <div className="cdm-time-block">
            <span className="cdm-time-num">{timeParts.h}</span>
            <span className="cdm-time-label">HORAS</span>
          </div>
          <span className="cdm-timer-colon">:</span>
          <div className="cdm-time-block">
            <span className="cdm-time-num">{timeParts.m}</span>
            <span className="cdm-time-label">MIN</span>
          </div>
          <span className="cdm-timer-colon">:</span>
          <div className="cdm-time-block">
            <span className="cdm-time-num">{timeParts.s}</span>
            <span className="cdm-time-label">SEG</span>
          </div>
        </div>
      </div>

      {webcastUrl && (
        <div className="cdm-box">
          <h3>TRANSMISIÓN EN DIRECTO</h3>
          <a href={webcastUrl} target="_blank" rel="noopener noreferrer" className="cdm-live-btn">
            <span className="live-dot"></span> VER TRANSMISIÓN OFICIAL
          </a>
        </div>
      )}

      <div className="cdm-box">
        <h3>DATOS DE MISIÓN</h3>
        <div className="cdm-grid-data">
          <div className="cdm-data-item">
            <span className="cdm-data-key">VEHÍCULO:</span>
            <span className="cdm-data-value">{launch.rocket?.configuration?.full_name?.toUpperCase()}</span>
          </div>
          <div className="cdm-data-item">
            <span className="cdm-data-key">AGENCIA:</span>
            <span className="cdm-data-value">{launch.launch_service_provider?.name?.toUpperCase()}</span>
          </div>
          <div className="cdm-data-item">
            <span className="cdm-data-key">TIPO:</span>
            <span className="cdm-data-value">{translateType(launch.mission?.type)}</span>
          </div>
          <div className="cdm-data-item">
            <span className="cdm-data-key">PLATAFORMA:</span>
            <span className="cdm-data-value">{translateLocation(launch.pad?.name)}</span>
          </div>
          <div className="cdm-data-item">
            <span className="cdm-data-key">PRIMERA ETAPA:</span>
            <span className="cdm-data-value">{boosterSerial}</span>
          </div>
          <div className="cdm-data-item">
            <span className="cdm-data-key">RECUPERACIÓN:</span>
            <span className="cdm-data-value">{recoveryStatus}</span>
          </div>
          <div className="cdm-data-item">
            <span className="cdm-data-key">ÓRBITA:</span>
            <span className="cdm-data-value">{translateOrbit(launch.mission?.orbit?.name)}</span>
          </div>
          <div className="cdm-data-item">
            <span className="cdm-data-key">ESTADO:</span>
            <span className="cdm-data-value">{translateStatus(launch.status?.name)}</span>
          </div>
        </div>
      </div>

      <div className="cdm-box">
        <h3>VENTANA DE LANZAMIENTO (HORARIOS INTERNACIONALES)</h3>
        <div className="cdm-grid-data">
          {targetTimezones.map((item) => (
            <div key={item.zone} className="cdm-data-item">
              <span className="cdm-data-key">{item.country.toUpperCase()}:</span>
              <span className="cdm-data-value telemetry-font">
                {launchDate.toLocaleString('es-AR', { 
                  timeZone: item.zone, day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' 
                })} HS
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="cdm-box">
        <h3>DESCRIPCIÓN</h3>
        <div className="cdm-description">
          {isTranslating ? (
            <p style={{fontStyle: 'italic'}}>DECODIFICANDO TELEMETRÍA OFICIAL...</p>
          ) : (
            <p>{translatedDesc}</p>
          )}
        </div>
      </div>

      <div className="cdm-box">
        <h3>CARGAS ÚTILES (1)</h3>
        <div className="payload-container">
          <h4 className="payload-title">{launch.mission?.name?.toUpperCase() || 'CARGA PRINCIPAL'}</h4>
          <ul className="payload-list">
            <li><strong>PROVEEDOR:</strong> {launch.launch_service_provider?.name?.toUpperCase()}</li>
            <li><strong>ÓRBITA:</strong> {translateOrbit(launch.mission?.orbit?.name)}</li>
            <li><strong>TIPO:</strong> {translateType(launch.mission?.type)}</li>
          </ul>
          <p className="payload-desc">
            Conjunto de sistemas y satélites destinados a cumplir el objetivo de la misión orbital. Datos específicos de masa y cantidad clasificados o no provistos por la telemetría actual.
          </p>
        </div>
      </div>

      <div className="cdm-box" style={{ padding: 0 }}>
        <h3 style={{ paddingTop: '2rem', marginBottom: '1rem' }}>SECUENCIA DE VUELO (FLIGHT PROFILE)</h3>
        <div className="spacex-table">
          <div className="spacex-table-head">
            <span className="col-time">TIEMPO (T- / T+)</span>
            <span className="col-event">EVENTO DE TELEMETRÍA</span>
          </div>
          <div className="spacex-table-body">
            {[
              { time: "T- 00:38:00", event: `Director de lanzamiento de ${launch.launch_service_provider?.name || 'la Agencia'} autoriza la carga de propelente.` },
              { time: "T- 00:35:00", event: "Inicio de carga de combustible (RP-1 / Kerosene de grado aeroespacial)." },
              { time: "T- 00:16:00", event: "Inicio de carga de oxígeno líquido (LOX) en la primera etapa." },
              { time: "T- 00:07:00", event: `Comienza el enfriamiento térmico de los motores del ${launch.rocket?.configuration?.name || 'vehículo'} previo a la ignición.` },
              { time: "T- 00:01:00", event: "La computadora de vuelo asume el control automático para los chequeos finales pre-lanzamiento." },
              { time: "T- 00:01:00", event: "Presurización de los tanques de propelente a niveles de vuelo." },
              { time: "T- 00:00:03", event: "El controlador de motores comanda el inicio de la secuencia de ignición." },
              { time: "T+ 00:00:00", event: "DESPEGUE (LIFTOFF)." },
              { time: "T+ 00:01:12", event: "Max-Q (Momento de máxima presión aerodinámica sobre el vehículo)." },
              { time: "T+ 00:02:30", event: "MECO (Apagado del motor principal) y separación de la primera etapa." },
              { time: "T+ 00:02:38", event: "Ignición del motor de la segunda etapa (SES-1)." },
              { time: "T+ 00:03:00", event: "Despliegue y separación de la cofia protectora (Fairing)." },
            ].map((item, index) => (
              <div key={index} className="spacex-row">
                <span className="spacex-time">{item.time}</span>
                <span className="spacex-event">{item.event.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cdm-box">
        <h3>RECORDATORIO Y COMPARTIR</h3>
        <div className="share-buttons">
          
          {/* BOTÓN DE ALARMA DESTACADO */}
          <button onClick={handleAddToCalendar} className="share-btn copy-btn" style={{ borderColor: '#e5b13a', color: '#e5b13a' }}>
            🔔 ACTIVAR ALARMA
          </button>
          
          <a 
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(publicShareUrl)}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="share-btn"
          >
            𝕏 TWITTER
          </a>
          
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicShareUrl)}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="share-btn"
          >
            FACEBOOK
          </a>
          
          <a 
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="share-btn"
          >
            WHATSAPP
          </a>
          
          <button 
            onClick={handleCopyLink} 
            className="share-btn copy-btn"
            style={{ 
              borderColor: isCopied ? '#4ade80' : 'var(--box-border)', 
              color: isCopied ? '#4ade80' : 'var(--text-main)' 
            }}
          >
            {isCopied ? '✅ COPIADO' : '🔗 COPIAR ENLACE'}
          </button>
        </div>
      </div>
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