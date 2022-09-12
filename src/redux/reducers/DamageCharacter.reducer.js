export default function (state = false, action) {
    switch (action.type) {
        case 'DAMAGE_CHARACTER':
            return action.payload;
        default:
            return state;
    }
}