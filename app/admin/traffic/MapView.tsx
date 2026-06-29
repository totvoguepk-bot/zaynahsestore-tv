'use client';

import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { KNOWN_CITIES } from '@/lib/traffic/cities';

interface Dot {
  city: string;
  lat: number;
  lng: number;
  count: number;
}

interface MapViewProps {
  visitorDots: Dot[];
  orderDots: Dot[];
}

export default function MapView({ visitorDots, orderDots }: MapViewProps) {
  const allCities = new Map<string, { lat: number; lng: number; visitors: number; orders: number }>();
  for (const [name, coords] of Object.entries(KNOWN_CITIES)) {
    allCities.set(name, { ...coords, visitors: 0, orders: 0 });
  }
  for (const d of visitorDots) {
    const existing = allCities.get(d.city);
    if (existing) existing.visitors = d.count;
  }
  for (const d of orderDots) {
    const existing = allCities.get(d.city);
    if (existing) existing.orders = d.count;
  }

  return (
    <MapContainer
      center={[30.3753, 69.3451]}
      zoom={5}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
      scrollWheelZoom={true}
      doubleClickZoom={true}
      dragging={true}
      touchZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <ZoomControl position="topright" />

      {/* City markers with popups */}
      {Array.from(allCities.entries()).map(([city, data]) => {
        const total = data.visitors + data.orders;
        if (total === 0) return null;
        const radius = Math.max(6, Math.min(16, 5 + total * 0.4));
        return (
          <CircleMarker
            key={city}
            center={[data.lat, data.lng]}
            radius={radius}
            pathOptions={{
              color: data.visitors > 0 ? '#22c55e' : '#f97316',
              fillColor: data.visitors > 0 ? '#22c55e' : '#f97316',
              fillOpacity: 0.6,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-sm font-semibold min-w-[160px]">
                <p className="text-base font-black mb-1">{city}</p>
                <p className="text-emerald-600">
                  <span className="font-bold">{data.visitors}</span> visitors
                </p>
                {data.orders > 0 && (
                  <p className="text-orange-600">
                    <span className="font-bold">{data.orders}</span> orders
                  </p>
                )}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
