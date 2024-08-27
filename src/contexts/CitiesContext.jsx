import {
    createContext,
    useEffect,
    useContext,
    useState,
    useCallback,
  } from "react";
  
  const BASE_URL = "http://localhost:9000";
  
  const CitiesContext = createContext();
  
  function CitiesProvider({ children }) {
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentCity, setCurrentCity] = useState({});
    const [error, setError] = useState("");
  
    useEffect(function () {
      async function fetchCities() {
        setIsLoading(true);
  
        try {
          const res = await fetch(`${BASE_URL}/cities`);
          const data = await res.json();
          setCities(data);
          setIsLoading(false);
        } catch {
          setError("There was an error loading cities...");
          setIsLoading(false);
        }
      }
      fetchCities();
    }, []);
  
      
      
  
    const getCity = useCallback(
      async function getCity(id) {
        if (Number(id) === currentCity.id) return;
  
        setIsLoading(true);
  
        try {
          const res = await fetch(`${BASE_URL}/cities/${id}`);
          const data = await res.json();
          setCurrentCity(data);
          setIsLoading(false);
        } catch {
          setError("There was an error loading the city...");
          setIsLoading(false);
        }
      },
      [currentCity.id]
    );
  
    async function createCity(newCity) {
      setIsLoading(true);
  
      try {
        const res = await fetch(`${BASE_URL}/cities`, {
          method: "POST",
          body: JSON.stringify(newCity),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
  
        setCities((prevCities) => [...prevCities, data]);
        setCurrentCity(data);
        setIsLoading(false);
      } catch {
        setError("There was an error creating the city...");
        setIsLoading(false);
      }
    }
  
    async function deleteCity(id) {
      setIsLoading(true);
  
      try {
        await fetch(`${BASE_URL}/cities/${id}`, {
          method: "DELETE",
        });
  
        setCities((prevCities) => prevCities.filter((city) => city.id !== id));
        setCurrentCity({});
        setIsLoading(false);
      } catch {
        setError("There was an error deleting the city...");
        setIsLoading(false);
      }
    }
  
    return (
      <CitiesContext.Provider
        value={{
          cities,
          isLoading,
          currentCity,
          error,
          getCity,
          createCity,
          deleteCity,
        }}
      >
        {children}
      </CitiesContext.Provider>
    );
  }
  
  function useCities() {
    const context = useContext(CitiesContext);
    if (context === undefined)
      throw new Error("CitiesContext was used outside the CitiesProvider");
    return context;
  }
  
  export { CitiesProvider, useCities };
  