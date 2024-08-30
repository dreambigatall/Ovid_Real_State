//import { useEffect, useState } from "react";
import { useState, useEffect } from "react";
const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export function useGeolocation(defaultPosition = null) {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(null);

  function getPosition() {
    if (!navigator.geolocation)
      return setError("Your browser does not support geolocation");

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }

  useEffect(() => {
    if (position && position.lat && position.lng) {
      const fetchCityName = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(
            `${BASE_URL}?lat=${position.lat}&lng=${position.lng}`
          );
          const data = await response.json();
          console.log(data)
          setCity(data.city);
        } catch (error) {
          setError("Failed to fetch city name");
        } finally {
          setIsLoading(false);
        }
      };

      fetchCityName();
    }
  }, [position]);

  return { isLoading, position, error, city, getPosition };
}

