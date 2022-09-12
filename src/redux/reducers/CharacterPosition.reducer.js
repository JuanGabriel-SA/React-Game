export default function (state = {x: 730, y: 0, rotation: '0deg'}, action) {
    switch (action.type) {
        case 'MOVE_CHARACTER':
            return action.payload;
        default:
            return state;
    }
}