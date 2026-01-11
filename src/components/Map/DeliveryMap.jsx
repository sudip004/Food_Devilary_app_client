import React, { useEffect, useState, useMemo } from "react";
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

// Leaflet icon fix
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Map size
const containerStyle = {
  width: "100%",
  height: "400px",
};

// Custom icons
const restaurantIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const customerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2203/2203183.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});



const DeliveryMap = ({ orderId, onDelivered }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchLocation = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/orders/${orderId}/updatelocation`
        );

        setData(res.data);

        if (res.data.orderStatus === "Delivered") {
          clearInterval(intervalId);

          
          onDelivered?.();
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchLocation();
    intervalId = setInterval(fetchLocation, 10000);

    return () => clearInterval(intervalId);
  }, [orderId, onDelivered]);


  // ✅ Hooks are ALWAYS called
  const restaurant = useMemo(() => {
    if (!data) return null;
    return {
      // lat: data.restaurantLocation.latitude,
      // lng: data.restaurantLocation.longitude,
       lat: 23.33247947692871,
       lng: 88.32687377929688,
    };
  }, [data]);

  const customer = useMemo(() => {
    if (!data) return null;
    return {
      // lat: data.customerLocation.latitude,
      // lng: data.customerLocation.longitude,
      lat: 23.32530052490749,
      lng: 88.32263019095298,
    };
  }, [data]);

  const deliveryBoy = useMemo(() => {
    if (!data) return null;
    return {
      // lat: data.deliveryBoyLocation.latitude,
      // lng: data.deliveryBoyLocation.longitude,
      lat: 23.31892504101475,
      lng: 88.31868073742328,
    };
  }, [data]);

  // ✅ Conditional rendering AFTER hooks
  if (!data) {
    return <p>Loading map...</p>;
  }
console.log("data",data);

  return (
    <MapContainer
      center={deliveryBoy}
      zoom={13}
      style={containerStyle}
      scrollWheelZoom
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <Marker position={restaurant} icon={restaurantIcon}>
        <Popup>Restaurant</Popup>
      </Marker>

      <Marker position={customer} icon={customerIcon}>
        <Popup>Customer</Popup>
      </Marker>

      <Marker position={deliveryBoy} icon={deliveryIcon}>
        <Popup>Delivery Boy</Popup>
      </Marker>

      <Polyline
        positions={[restaurant, deliveryBoy, customer]}
        pathOptions={{ color: "blue", weight: 4 }}
      />
    </MapContainer>
  );
};

export default DeliveryMap;
