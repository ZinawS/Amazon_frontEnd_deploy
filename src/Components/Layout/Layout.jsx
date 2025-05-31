import React from 'react'
import Header from '../Header/Header'
import CarouselEffect from '../Carousel/CarouselEffect'
import Category from '../Category/Category'

function Layout({children}) {
  return (
    <div>
        <Header/>
        {children}
    </div>
  )
}

export default Layout