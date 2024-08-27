
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Pricing from './pages/Pricing'
import Product from './pages/Product'
import PageNotFound from './pages/PageNotFound'
import AppLayout from './pages/AppLayout'

import CityList from './components/CityList'
import { CitiesProvider } from './contexts/CitiesContext'
import CountryList from './components/CountryList'
import City from './components/City'

function App() {
  

  return (
    <>
      <CitiesProvider>

      <BrowserRouter>
       <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/pricing' element={<Pricing/>}/>
        <Route path='/product' element={<Product/>}/>
        <Route path='/app' element={<AppLayout/>}>
         <Route index element={<Navigate replace to="cities"/>}/>
         <Route path='cities' element={<CityList/>}/>
         <Route path='cities/:id' element={<City/>}/>
         <Route path="countries" element={<CountryList/>} />

        </Route>
        <Route path='*' element={<PageNotFound/>}/>
      </Routes>
      </BrowserRouter>
      </CitiesProvider>
    </>
  )
}

export default App
