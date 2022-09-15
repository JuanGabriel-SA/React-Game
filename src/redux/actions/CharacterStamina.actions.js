export function consumeStamina (payload) {
    return {
        type: 'CONSUME_STAMINA',
        payload: payload
    }
}

export function resetStamina (payload) {
    return {
        type: 'RESET_STAMINA',
        payload: payload
    }
}

