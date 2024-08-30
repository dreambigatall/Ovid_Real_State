import {
    createContext,
    useEffect,
    useContext,
    
    useCallback,
    useReducer,
  } from "react";
  
  const BASE_URL = "http://localhost:9000";
  const initialState={
    cities:[],
    isLoading:false,
    currentCity:{},
    error:'',
  }
  function reducer(state, action){
      switch(action.type){
        case "loading":return{
          ...state,isLoading:true
        };

        case "city/fetched":return{
          ...state, cities:action.payload, isLoading:false,
        };
        case "city/currentCity":return{
          ...state, currentCity:action.payload, 
        }
        case "city/createnewcity":return{
          ...state, cities:[state.cities,action.payload ]
        };
        case "city/deleted": return{
          ...state,
          isLoading:false,
          cities:state.cities.filter((city)=>city.id!==action.payload)
        };
        case "error":
          return{
          ...state,error:action.payload,
        };
        case "rejected":return{
          ...state, isLoading:false
        }
        default: throw new Error("do it agin");
          

        

      }

  }
  const CitiesContext = createContext();
  
  function CitiesProvider({ children }) {
    //const [cities, setCities] = useState([]);
    //const [isLoading, setIsLoading] = useState(false);
    //const [currentCity, setCurrentCity] = useState({});
    //const [error, setError] = useState("");
      const[state, dispach]=useReducer(reducer,initialState);
      const{isLoading, cities, currentCity, error}=state;
    useEffect(function () {
      async function fetchCities() {
        dispach({type:"loading"});
  
        try {
          const res = await fetch(`${BASE_URL}/cities`);
          const data = await res.json();
          //setCities(data);
          //setIsLoading(false);
          dispach({type:"city/fetched", payload:data})
        } catch {
          //setError("There was an error loading cities...");
          //setIsLoading(false);
          dispach({type:"error", payload:"some thing went wrong"})
          dispach({type:"rejected"})
        }
      }
      fetchCities();
    }, []);
  
      
      
  
    const getCity = useCallback(
      async function getCity(id) {
        if (Number(id) === currentCity.id) return;
  
        //setIsLoading(true);
        dispach({type:"loading"});
  
        try {
          const res = await fetch(`${BASE_URL}/cities/${id}`);
          const data = await res.json();
         // setCurrentCity(data);
          //setIsLoading(false);
          dispach({type:"city/currentCity" , payload:data})
          dispach({type:"rejected"})
        } catch {
          //setError("There was an error loading the city...");
          dispach({type:"error", payload:"Something went wrong"})
          dispach({type:"rejected"})
          
        }
      },
      [currentCity.id]
    );
  
    async function createCity(newCity) {
      //setIsLoading(true);
      dispach({type:"loading"})
  
      try {
        const res = await fetch(`${BASE_URL}/cities`, {
          method: "POST",
          body: JSON.stringify(newCity),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
  
        //setCities((prevCities) => [...prevCities, data]);
        //setCurrentCity(data);
       // setIsLoading(false);
       dispach({type:"city/createnewcity", payload:data})
      } catch {
        //setError("There was an error creating the city...");
        //setIsLoading(false);
        dispach({type:"error", payload:"some thing went wrong"})
      }
    }
  
    async function deleteCity(id) {
      //setIsLoading(true);
         dispach({type:"loading"})
      try {
        await fetch(`${BASE_URL}/cities/${id}`, {
          method: "DELETE",
        });
  
        //setCities((prevCities) => prevCities.filter((city) => city.id !== id));
        //setCurrentCity({});
        //setIsLoading(false);
        dispach({type:"city/deleted", payload:id})
      } catch {
        //setError("There was an error deleting the city...");
        //setIsLoading(false);
        dispach({type:"error", payload:"some thing went wrong"})

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
  