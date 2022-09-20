import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import CharacterAttackReducer from "../reducers/CharacterAttack.reducer";
import CharacterPositionReducer from "../reducers/CharacterPosition.reducer";
import CharacterStaminaReducer from "../reducers/CharacterStamina.reducer";
import DamageCharacterReducer from "../reducers/DamageCharacter.reducer";
import EnemiesControlReducer from "../reducers/EnemiesControl.reducer";
import SpecialAttackReducer from "../reducers/SpecialAttack.reducer";

const rootReducer = combineReducers({
    characterPosition: CharacterPositionReducer,
    characterDamaged: DamageCharacterReducer,
    characterAttack: CharacterAttackReducer,
    specialAttack: SpecialAttackReducer,
    characterStamina: CharacterStaminaReducer,
    enemiesControl: EnemiesControlReducer
})

const store = configureStore({reducer: rootReducer});

export default store;