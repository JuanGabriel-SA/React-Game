export default function (state = 250, action) {
    switch (action.type) {
        case 'CONSUME_STAMINA':
            if (state < 0)
                return 0;
            return state - action.payload;
        case 'RESET_STAMINA':
            return 250;
        default:
            return state;
    }
}