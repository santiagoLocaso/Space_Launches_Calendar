export const translateStatus = (statusName) => {
  if (!statusName) return 'DESCONOCIDO';
  const statuses = {
    "Go for Launch": "LISTO PARA EL LANZAMIENTO",
    "Launch Successful": "LANZAMIENTO EXITOSO",
    "TBD": "A DETERMINAR",
    "Success": "LANZAMIENTO EXITOSO",
    "Failure": "FALLO EN EL LANZAMIENTO",
    "In Flight": "EN VUELO",
    "Hold": "EN ESPERA / PAUSADO",
    "Partial Failure": "FALLO PARCIAL"
  };
  return statuses[statusName] || statusName.toUpperCase();
};

export const translateLocation = (locationName) => {
  if (!locationName) return 'UBICACIÓN DESCONOCIDA';
  return locationName
    .replace('Space Force Station', 'ESTACIÓN DE LA FUERZA ESPACIAL')
    .replace('Space Force Base', 'BASE DE LA FUERZA ESPACIAL')
    .replace('Space Center', 'CENTRO ESPACIAL')
    .replace('Launch Complex', 'COMPLEJO DE LANZAMIENTO')
    .replace('Cosmodrome', 'COSMÓDROMO')
    .replace('Cape Canaveral', 'CABO CAÑAVERAL');
};

export const translateOrbit = (orbitName) => {
  if (!orbitName) return 'A DETERMINAR';
  const orbits = {
    "Low Earth Orbit": "ÓRBITA TERRESTRE BAJA (LEO)",
    "Geostationary Transfer Orbit": "ÓRBITA DE TRANSFERENCIA GEOESTACIONARIA (GTO)",
    "Sun-Synchronous Orbit": "ÓRBITA HELIOSÍNCRONA (SSO)",
    "Medium Earth Orbit": "ÓRBITA TERRESTRE MEDIA (MEO)",
    "Polar Orbit": "ÓRBITA POLAR",
    "Sub-Orbital": "SUBORBITAL"
  };
  return orbits[orbitName] || orbitName.toUpperCase();
};

export const translateType = (typeName) => {
  if (!typeName) return 'NO ESPECIFICADO';
  const types = {
    "Communications": "COMUNICACIONES",
    "Earth Science": "CIENCIAS DE LA TIERRA",
    "Navigation": "NAVEGACIÓN",
    "Planetary Science": "CIENCIA PLANETARIA",
    "Astrophysics": "ASTROFÍSICA",
    "Resupply": "REABASTECIMIENTO",
    "Human Exploration": "EXPLORACIÓN TRIPULADA",
    "Test Flight": "VUELO DE PRUEBA",
    "Dedicated Rideshare": "MISIÓN COMPARTIDA"
  };
  return types[typeName] || typeName.toUpperCase();
};