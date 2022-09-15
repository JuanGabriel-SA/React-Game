export default function (state = {}, action) {
    switch (action.type) {
        case 'CHARACTER_IS_ATTACKING':
            return action.payload;
        case 'CHARACTER_IS_NOT_ATTACKING':
            return false;
        default:
            return state;
    }
}