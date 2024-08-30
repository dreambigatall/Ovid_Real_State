import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import styles from './Map.module.css'
import { MapContainer,TileLayer,Marker,Popup, useMap } from 'react-leaflet';
import {useCities} from "../contexts/CitiesContext"
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button'
import MarkerClusterGroup from 'react-leaflet-cluster';
const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";


export default function Map() {
  
  const [serChParams, setSearchParams]=useSearchParams();
  const lat=serChParams.get("lat");
  const lng=serChParams.get("lng");
  const{cities}=useCities();
  const [mapPosition,setMapPosition]=useState([40,0]);
  const{isLoading:isLoadingPosition, position:geolocationPosition, getPosition, error, city}=useGeolocation();
  const [showPopup, setShowPopup] = useState(false);
   //const[mycity,setMycity]=useState();
  //const [isload, setIsload]=useState(false);
  //const[isError, setIsError]=useState();
  useEffect(function(){
     if(lat && lng)setMapPosition([lat,lng])
     },[lat,lng]);

     useEffect(function(){
      if(geolocationPosition){
        setMapPosition([geolocationPosition.lat, 
          geolocationPosition.lng])
      }
     },[geolocationPosition]);

     const handleClick = () => {
      getPosition(); // Fetch the geolocation
      setShowPopup(true); // Show the popup after fetching the position
    };

   /* useEffect(function(){
      //if(!geolocationPosition.lat && !geolocationPosition.lng) return ;
       
      async function mycityfetcher(){
        try{   setIsload(true);
              const res=await fetch(`${BASE_URL}?latitude=${lat}&longtiude=${lng}`);
              if(!res.ok) throw new Error("there is an error to fech your city");
              const data=res.json();
              setMycity(data.city || data.locality || "");
              console.log(data)
        }catch(err){
          setIsError(err);

        }finally{
          setIsload(false);

        }
      }

    mycityfetcher();


    },[lat,lng])

*/
  return (

    <div className={styles.mapContainer}>
      {!geolocationPosition && <Button type="position" onClick={handleClick}>{
        isLoadingPosition?"Loading>>>":"Use your Position"
        }</Button>}
        {showPopup && geolocationPosition && (
        <div className="popup">
          <h3>Your Location</h3>
          <p>Latitude: {geolocationPosition.lat}</p>
          <p>Longitude: {geolocationPosition.lng}</p>
          <p>{city}</p>
          
          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}
      {error && <p>Error: {error}</p>}

      <MapContainer 
     // center={[lat,lng]}
     center={mapPosition}
       zoom={6} scrollWheelZoom={true} className={styles.map}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
    />
    <MarkerClusterGroup chunkedLoading>
    {cities.map((city)=>(<Marker position={[city.position.lat,city.position.lng]} key={city.id}>
      <Popup>
        <span>{city.emoji}</span><span>{city.CityName}</span>
        <span>{city.notes}</span>
      </Popup>
    </Marker>))}
    </MarkerClusterGroup>
    <ChangCenter position={mapPosition}/>
    
  </MapContainer>

    </div>
  )
}


function ChangCenter({position}){

  const map =useMap();
  map.setView(position);
  return null;
}