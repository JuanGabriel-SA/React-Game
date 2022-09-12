import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import CharacterAttackReducer from "../reducers/CharacterAttack.reducer";
import CharacterPositionReducer from "../reducers/CharacterPosition.reducer";
import DamageCharacterReducer from "../reducers/DamageCharacter.reducer";
import SpecialAttackReducer from "../reducers/SpecialAttack.reducer";

const rootReducer = combineReducers({
    characterPosition: CharacterPositionReducer,
    characterDamaged: DamageCharacterReducer,
    characterAttack: CharacterAttackReducer,
    specialAttack: SpecialAttackReducer
})

const store = configureStore({reducer: rootReducer});

export default store;