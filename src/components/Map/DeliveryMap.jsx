import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const containerStyle = {
  width: "100%",
  height: "400px",
};

// Custom icons
const restaurantIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
  iconSize: [35, 35],
});

const customerIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
  iconSize: [35, 35],
});

const deliveryIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/869/869636.png",
  iconSize: [35, 35],
});

const DeliveryMap = ({ orderId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/${orderId}/location`);
        setData(res.data);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 10000); // every 10 seconds
    return () => clearInterval(interval);
  }, [orderId]);

  // Example fixed points (Santipur area)
  const restaurant = { lat: 22.963, lng: 88.437 };
  const customer = { lat: 22.935, lng: 88.430 };

  return (
    <div style={{ width: containerStyle.width, height: containerStyle.height }}>
      <MapContainer
        center={customer}
        zoom={13}
        style={containerStyle}
        scrollWheelZoom={true}
      >
        {/* OpenStreetMap base layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {/* Restaurant Marker */}
        <Marker position={restaurant} icon={restaurantIcon}>
          <Popup>Restaurant</Popup>
        </Marker>

        {/* Customer Marker */}
        <Marker position={customer} icon={customerIcon}>
          <Popup>Customer</Popup>
        </Marker>

        {/* Delivery Boy Marker */}
        {data && (
          <Marker
            position={{ lat: data.latitude, lng: data.longitude }}
            icon={deliveryIcon}
          >
            <Popup>Delivery Boy</Popup>
          </Marker>
        )}

        {/* Route Line */}
        <Polyline
          positions={[restaurant, data || restaurant, customer]}
          pathOptions={{ color: "blue", weight: 4, opacity: 0.7 }}
        />
      </MapContainer>
    </div>
  );
};

export default DeliveryMap;
