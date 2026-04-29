"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

function LocationMarker({ position, setPosition }: { position: [number, number] | null, setPosition: (p: [number, number]) => void }) {
  useMapEvents({
    click(e: any) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Selected Location</Popup>
    </Marker>
  );
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

type LocationPickerProps = {
  onChange: (lat: number, lng: number) => void;
  defaultLocation?: [number, number];
};

export default function LocationPicker({ onChange, defaultLocation }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(defaultLocation || null);
  const [center, setCenter] = useState<[number, number]>(defaultLocation || [51.505, -0.09]); // Default to London

  useEffect(() => {
    // Try to get user's current location if no default
    if (!defaultLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  }, [defaultLocation]);

  const handlePositionChange = (pos: [number, number]) => {
    setPosition(pos);
    onChange(pos[0], pos[1]);
  };

  return (
    <div className="h-[300px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer
        {...({ center: center, zoom: 13, scrollWheelZoom: true } as any)}
        className="w-full h-full z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap lat={center[0]} lng={center[1]} />
        <LocationMarker position={position} setPosition={handlePositionChange} />
      </MapContainer>
    </div>
  );
}
