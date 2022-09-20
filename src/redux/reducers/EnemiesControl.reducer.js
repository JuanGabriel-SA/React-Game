export default function (state = [], action) {
    switch (action.type) {
        case 'ADD_ENEMY':
            return [...state, action.payload];
        case 'EDIT_ENEMY':
            let newContent = action.payload;
            let newState = [...state];
            for (let i = 0; i < newState.length; i++) {
                if (newState[i].id == newContent.id) {
                    newState[i] = { ...newContent };
                }
            }
            return newState;
        case 'REMOVE_ENEMY':
            return state.filter(({ id }) => id !== action.payload);
        default:
            return state;
    }
}