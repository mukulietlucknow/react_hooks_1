import React , {useState , useEffect , useCallback} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

const Ingredients = () => {
  const [userIngredients , setUserIngredients] = useState([]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  } , []);

  // useEffect(() => {
  //   fetch('https://react-hooks-639f7.firebaseio.com/ingredients.json')
  //   .then(response => response.json())
  //   .then (responseData => {
  //     const loadedIngredients = [];
  //     for (const key in responseData){
  //       loadedIngredients.push({
  //         id : key ,
  //         title : responseData[key].title,
  //         amount : responseData[key].amount,
  //       });
  //     }
  //     setUserIngredients(loadedIngredients);
  //   });
    
  // } , []);

  const addIngredientHandler = (ingredient) => {
    fetch('https://react-hooks-639f7.firebaseio.com/ingredients.json' , {
      method: 'POST',
      body : JSON.stringify(ingredient),
      headers : { 'Content-Type': 'application/json'},
    }).then(response => {
      setUserIngredients(prevIngredients => [...prevIngredients , {id : response.json().name , ...ingredient }]);
    });    
  }

  const removeIngredientHandler = ingredientId => {
    setUserIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== ingredientId));
  }
  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler}/>

      <section>
        <Search onLoadedIngredients = {filteredIngredientsHandler}/>
        <IngredientList ingredients = {userIngredients} onRemoveItem = {removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
