import React , {useState , useEffect , useCallback, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const {onLoadedIngredients} = props;
  const [enteredFilter , setEnteredFilter] = useState('');
  const inputRef  = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value ){
        const queryParams = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch('https://react-hooks-639f7.firebaseio.com/ingredients.json'+queryParams)
        .then(response => response.json())
        .then (responseData => {
          const loadedIngredients = [];
          for (const key in responseData){
            loadedIngredients.push({
              id : key ,
              title : responseData[key].title,
              amount : responseData[key].amount,
            });
          }
          onLoadedIngredients(loadedIngredients);
        });
        }
      
    } , 500);
    return () => {
      clearTimeout(timer);
    };
  } , [enteredFilter,onLoadedIngredients , inputRef]);
  
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" 
          ref = {inputRef}
          value={enteredFilter} 
          onChange={event => setEnteredFilter(event.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
