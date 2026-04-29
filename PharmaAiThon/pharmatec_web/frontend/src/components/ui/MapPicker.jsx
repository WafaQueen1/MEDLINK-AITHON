import { useEffect, useRef, useState } from 'react';

const LEAFLET_CSS_ID = 'leaflet-css';
const LEAFLET_SCRIPT_ID = 'leaflet-script';

const loadLeaflet = () =>
  new Promise((resolve, reject) => {
    if (window.L) {
      resolve(window.L);
      return;
    }

    if (!document.getElementById(LEAFLET_CSS_ID)) {
      const link = document.createElement('link');
      link.id = LEAFLET_CSS_ID;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const existingScript = document.getElementById(LEAFLET_SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.L), { once: true });
      existingScript.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = LEAFLET_SCRIPT_ID;
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error('Failed to load map'));
    document.body.appendChild(script);
  });

export const MapPicker = ({ value, onChange, label = 'Pharmacy Location', onClose }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [loadingMap, setLoadingMap] = useState(true);
  const [mapError, setMapError] = useState('');
  const [selectionMessage, setSelectionMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    const initMap = async () => {
      try {
        const L = await loadLeaflet();
        if (cancelled || mapInstanceRef.current || !mapRef.current) {
          return;
        }

        const center = value.latitude && value.longitude
          ? [Number(value.latitude), Number(value.longitude)]
          : [36.7538, 3.0588];

        const map = L.map(mapRef.current).setView(center, value.latitude && value.longitude ? 14 : 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        map.on('click', (event) => {
          const nextValue = {
            latitude: Number(event.latlng.lat.toFixed(6)),
            longitude: Number(event.latlng.lng.toFixed(6)),
          };
          onChange(nextValue);
          setSelectionMessage(`Point selected at ${nextValue.latitude}, ${nextValue.longitude}`);
        });

        mapInstanceRef.current = map;
        setLoadingMap(false);
      } catch (error) {
        if (!cancelled) {
          setMapError('Unable to load the map. Please check your internet connection.');
          setLoadingMap(false);
        }
      }
    };

    initMap();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onChange]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = window.L;

    if (!map || !L || value.latitude == null || value.longitude == null) {
      return;
    }

    const position = [Number(value.latitude), Number(value.longitude)];

    if (!markerRef.current) {
      const customMarker = L.divIcon({
        className: 'pharmacy-marker',
        html: '<span class="pharmacy-marker-pulse"></span><span class="pharmacy-marker-pin"></span>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      markerRef.current = L.marker(position, { icon: customMarker }).addTo(map);
    } else {
      markerRef.current.setLatLng(position);
    }

    markerRef.current.bindPopup('Selected location').openPopup();
    map.setView(position, 15);
  }, [value.latitude, value.longitude]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMapError('Geolocation is not supported in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextValue = {
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
        };

        setMapError('');
        onChange(nextValue);
        setSelectionMessage(`Current location selected at ${nextValue.latitude}, ${nextValue.longitude}`);
      },
      () => {
        setMapError('Location access was denied. You can still click on the map to choose a point.');
      }
    );
  };

  return (
    <div className="map-modal-backdrop">
      <div className="map-modal">
        <div className="map-picker">
          <div className="map-picker-header">
            <div>
              <span className="field-title">{label}</span>
              <p className="map-picker-copy">Click on the map to drop a marker and save the pharmacy location.</p>
            </div>
            <div className="map-picker-actions">
              <button type="button" className="button secondary" onClick={handleUseCurrentLocation}>
                Use My Location
              </button>
              <button type="button" className="button secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>

          <div ref={mapRef} className="map-canvas">
            {loadingMap ? <div className="map-loading">Loading map...</div> : null}
          </div>

          <div className="map-coordinates">
            <label className="field">
              <span>Latitude</span>
              <input type="number" value={value.latitude ?? ''} readOnly required />
            </label>
            <label className="field">
              <span>Longitude</span>
              <input type="number" value={value.longitude ?? ''} readOnly required />
            </label>
          </div>

          <div className="map-picker-footer">
            <span className="map-picker-hint">
              {value.latitude != null && value.longitude != null
                ? 'Location selected and marked on the map.'
                : 'No location selected yet.'}
            </span>
            <button type="button" className="button primary" onClick={onClose}>
              Save Location
            </button>
          </div>

          {selectionMessage ? <p className="map-selection-note">{selectionMessage}</p> : null}
          {mapError ? <p className="error-text">{mapError}</p> : null}
        </div>
      </div>
    </div>
  );
};
