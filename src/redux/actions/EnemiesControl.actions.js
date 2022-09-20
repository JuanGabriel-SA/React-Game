export function addEnemy (payload) {
    return {
        type: 'ADD_ENEMY',
        payload: payload
    }
}
export function editEnemy (payload) {
    return {
        type: 'EDIT_ENEMY',
        payload: payload
    }
}

export function removeEnemy (payload) {
    return {
        type: 'REMOVE_ENEMY',
        payload: payload
    }
}
