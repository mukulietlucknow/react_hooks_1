import {useReducer , useCallback} from 'react';

const httpReducer = (httpState , action) => {
    switch (action.type) {
      case 'SEND':
        return { loading: true , error: null , data : null , extra : null, reqIdentifier : action.reqIdentifier};
      case 'RESPONSE':
        return { loading: false , error: null , data : action.responseData , extra :action.extra  ,};
      case 'ERROR' :
        return { loading: false , error: action.errorData , };
      default:
        throw new Error('Should not get there');
    }
  }

const useHttp = () => {
    const [httpState , dispatchHttp] = useReducer(httpReducer , {loading : false , error : null , data : null , extra : null , reqIdentifier: null});

    const sendRequest = useCallback((url , method , body  , extra , reqIdentifier) => {
        dispatchHttp({
            type:'SEND',
            extra : extra,
            reqIdentifier : reqIdentifier
        });
        fetch( url,
            {
                method: method,
                body : body,
                headers : { 'Content-Type': 'application/json'}
        }).then(response => {
            return response.json();
        })
        .then(responseData => {        
        //setIsLoading(false);
        dispatchHttp({
            type:'RESPONSE',
            responseData : responseData,
        });
        // setUserIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== ingredientId));
        });
    }, []);

    return {
        isLoading : httpState.loading,
        data : httpState.data,
        error : httpState.error,
        sendRequest : sendRequest,
        extra :  httpState.extra,
        reqIdentifier :httpState.identifier
    };
    
};

export default useHttp;