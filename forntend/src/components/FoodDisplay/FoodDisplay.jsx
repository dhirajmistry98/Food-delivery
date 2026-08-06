import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category}) => {

  const { food_list, isBootstrapping } = useContext(StoreContext)
  const filteredFood = food_list.filter((item) => category === "All" || category === item.category);

  return (
    <div className='food-display' id='food-display'>
     <h2>Top dishes near you</h2>
     {isBootstrapping ? <p className="food-display-status">Loading menu...</p> : null}
     {!isBootstrapping && !food_list.length ? <p className="food-display-status">No dishes are available right now.</p> : null}
     {!isBootstrapping && food_list.length && !filteredFood.length ? (
      <p className="food-display-status">No dishes are available in this category yet.</p>
     ) : null}
     <div className="food-display-list">
      {filteredFood.map((item, index) => {
          return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price}
          image= {item.image}/>
      })}
     </div>
    </div>
  )
}

export default FoodDisplay
