import React , {useState , useEffect , useCallback , useReducer , useMemo} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredient , action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredient , action.ingredient];
    case 'DELETE' :
      return currentIngredient.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there');
  }
}



const Ingredients = () => {
  const [userIngredients , dispatch] = useReducer(ingredientReducer ,[] );
  // const [userIngredients , dispatch] = useReducer(ingredientReducer ,[] );
  //const [userIngredients , setUserIngredients ] = useState([]);
  // const [httpState , dispatchHttp] = useReducer(httpReducer , {loading : false , error : null});
  // const [isLoading , setIsLoading] = useState(false);
  // const [error , setError] = useState(null);

  const {isLoading, error , data , sendRequest , extra, reqIdentifier} = useHttp();
  

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    //setUserIngredients(filteredIngredients);
    dispatch({ 
      type: 'SET',
      ingredients: filteredIngredients,
    });
  } , []);

  useEffect(() => {
    
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
    console.log('coming outside add');
    console.log(isLoading);
    console.log(reqIdentifier);
  
    if(!isLoading &&  reqIdentifier === 'REMOVE_INGREDIENT'){
      dispatch({type : 'DELETE' , id : extra });
    }else if (!isLoading  && reqIdentifier === 'ADD_INGREDIENT'){
      console.log('coming inside add');
      dispatch({ 
            type : 'ADD',
            ingredient : {id : data.name , ...extra },
          })
    }
    
    
  } , [data , extra , reqIdentifier , isLoading , error]);

  const addIngredientHandler = useCallback((ingredient) => {
    sendRequest('https://react-hooks-639f7.firebaseio.com/ingredients.json' , 'POST' ,JSON.stringify(ingredient) , 'ADD_INGREDIENT' );
    // setIsLoading(true);
    // dispatchHttp({
    //   type:'SEND',
    // });
    // fetch('https://react-hooks-639f7.firebaseio.com/ingredients.json' , {
    //   method: 'POST',
    //   body : JSON.stringify(ingredient),
    //   headers : { 'Content-Type': 'application/json'},
    // }).then(response => {
    //   dispatchHttp({
    //     type:'RESPONSE',
    //   });
    //   return response.json();      
    // })
    // .then(responseData => {
    //   // setUserIngredients(prevIngredients => [...prevIngredients , {id : responseData.name , ...ingredient }]);
    //   dispatch({ 
    //     type : 'ADD',
    //     ingredient : {id : responseData.name , ...ingredient },
    //   })
      

    // }).catch(err => {
    //   //console.log(err.message);
    //   // setError(err.message);
    //   //console.log(error);
    //   // setIsLoading(false);
    //   dispatchHttp({
    //     type:'ERROR',
    //     errorData : err.message,
    //   });
    // });    
  } , []);

  const removeIngredientHandler = useCallback(ingredientId => {  
    sendRequest(`https://react-hooks-639f7.firebaseio.com/ingredients/${ingredientId}.json` , 'DELETE'  ,null ,  ingredientId , 'REMOVE_INGREDIENT' );
  },[sendRequest]);

  const clearError = useCallback(() => {
    //setError(false);
    // dispatchHttp({
    //   type:'RESPONSE',
    // });
  },[]);

  const ingredientlList = useMemo(() => {
    return (
      <IngredientList 
      ingredients = {userIngredients} 
      onRemoveItem = {removeIngredientHandler}/>
    );
  } , [userIngredients,removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm 
      onAddIngredient={addIngredientHandler}
      loading ={isLoading}
      />
      <section>
        <Search onLoadedIngredients = {filteredIngredientsHandler}/>
        {ingredientlList}
      </section>
    </div>
  );
}

export default Ingredients;
