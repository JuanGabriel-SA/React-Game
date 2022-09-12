export default function (state = false, action) {
    switch (action.type) {
        case 'SPECIAL_ATTACK':
            return action.payload;
        default:
            return state;
    }
}