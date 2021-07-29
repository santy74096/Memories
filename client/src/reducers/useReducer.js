
export const initialState = null;   //initial state will be null because we don't need to store anything at very start

export const reducer = (state,action) => {  //state contain the current status or data and action will define that what we want to do
    if(action.type === "USER"){
        return action.payload   //payload contain the changable data
    }
    if(action.type == "CLEAR"){
        return null;
    }
    if(action.type == "UPDATE"){
        return {
            ...state,
            followers:action.payload.followers,
            following:action.payload.following
        };
    }
    if(action.type == "UPDATEPIC"){
        return {
            ...state,
            pic:action.payload
        };
    }
    return state;
}