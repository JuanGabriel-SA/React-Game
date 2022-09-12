export function characterIsAttacking (payload) {
    return {
        type: 'CHARACTER_IS_ATTACKING',
        payload: payload
    }
}
export function characterIsNotAttacking (payload) {
    return {
        type: 'CHARACTER_IS_NOT_ATTACKING',
        payload: payload
    }
}
