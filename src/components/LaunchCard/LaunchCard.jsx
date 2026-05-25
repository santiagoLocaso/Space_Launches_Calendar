import './LaunchCard.css';
import { translateStatus } from '../../utils/formatters';

export function LaunchCard({ launch, onClick }) {
  const launchDate = new Date(launch.net).toLocaleDateString('es-AR');
  const rocketImage = launch.image || 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=500';

  return (
    <div className="cdm-card" onClick={onClick}>
      <div className="cdm-card-img-wrapper">
        <img src={rocketImage} alt={launch.name} />
        <span className="cdm-card-badge">{translateStatus(launch.status?.name)}</span>
      </div>
      <div className="cdm-card-content">
        <h2>{launch.name.toUpperCase()}</h2>
        <p>📅 {launchDate}</p>
        <p>🚀 {launch.launch_service_provider?.name?.toUpperCase()}</p>
      </div>
    </div>
  );
}