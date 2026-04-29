"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import Link from "next/link";

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);

  return null;
}

type Provider = {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  rating: number;
};

type MapProps = {
  center: [number, number];
  providers: Provider[];
};

export default function Map({ center, providers }: MapProps) {
  return (
    <MapContainer
      {...({ center: center, zoom: 13, scrollWheelZoom: false } as any)}
      className="w-full h-full rounded-xl z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterMap lat={center[0]} lng={center[1]} />

      {/* User Location Marker (Pulse Effect) */}
      <Marker position={center}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Provider Markers */}
      {providers.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]}>
          <Popup>
            <div className="p-1 min-w-[150px]">
              <h3 className="font-bold text-sm">{p.name}</h3>
              <p className="text-xs text-blue-600 font-semibold">
                {p.category}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-yellow-500">★</span>
                <span className="text-xs">{p.rating}</span>
              </div>
              <Link
                href={`/providers/${p.id}`}
                className="block mt-2 text-xs text-center bg-slate-900 text-white py-1 rounded"
              >
                View Profile
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
