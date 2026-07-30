import React, { useEffect } from 'react'

import { useSelector } from 'react-redux'
import { useBuyerProduct } from '../hooks/useBuyerProduct'
import Navbar from "../components/Navbar"
import Hero from '../components/Hero'
import ProductSection from '../components/ProductSection'
const Home = () => {
  
  return (
    <div>
        <Navbar/>
        <Hero/>
        <ProductSection/>
    </div>
  )
}

export default Home