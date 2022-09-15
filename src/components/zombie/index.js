import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useSound from 'use-sound';
import AttackSprite from '../../imgs/zombie/Attack.png';
import DeathSprite from '../../imgs/zombie/Death.png';
import HurtSprite from '../../imgs/zombie/Hurt.png';
import WalkSprite from '../../imgs/zombie/Walk.png';
import { damageCharacter } from '../../redux/actions/DamageCharacter.actions';
import Sounds from '../../songs/zombie/Sounds.mp3';
import { verifyColision } from '../../utils/colisionDetection';
import './Zombie.css';

const Zombie = ({ onDeath, onAttack, id, isAttacking }) => {
    const [positionX, setPositionX] = useState(generatePosition());
    const [walking, setWalking] = useState(true);
    const [attack, setAttack] = useState(false);
    const [rotate, setRotate] = useState('0deg');
    const [life, setLife] = useState(5);
    const [dead, setDead] = useState(false);
    const [playSound, { stop }] = useSound(Sounds, {
        volume: 0.1,
        sprite: {
            hurt: [513, 898],
            walk: [2832, 3138],
            death: [9216, 9881]
        }
    });
    const dispatch = useDispatch();
    const state = useSelector((state) => state);
    useEffect(() => {
    }, [])

    function generatePosition() {
        let position = Math.floor(Math.random() * 2) + 1;

        if (position == 1)
            return -680;
        else
            return 680;
    }

    useEffect(() => {
        if (walking) {

            const enemyWalk = setInterval(() => {
                //O inimigo ira perseguir o personagem...
                if (positionX < state.characterPosition)
                    setPositionX(prevState => prevState + 1);
                else
                    setPositionX(prevState => prevState - 1);

            }, 10)
            return () => clearInterval(enemyWalk)
        }
    }, [walking]);

    useEffect(() => {
        isAttacking(attack);

    }, [attack])

    useEffect(() => {
        if (positionX < state.characterPosition)
            setRotate('0deg')
        else
            setRotate('180deg')

        //Quando o inimigo encostar no personagem, ele para...
        if (verifyColision(state.characterPosition, positionX, 46, rotate) && life > 0) {
            setAttack(true);
            onAttack !== undefined && onAttack();
            setWalking(false);
        } else {
            setAttack(false);

        }
    }, [positionX, state.characterPosition, life]);

    useEffect(() => {
        if (attack && life > 0)
            dispatch(damageCharacter(true));
        else
            dispatch(damageCharacter(false));
    }, [attack])

    useEffect(() => {
        if (isDamaged()) {
            stop();
            playSound({ id: 'hurt' });
            setWalking(false);
            let attack = { ...state.characterAttack };
            if (attack.type == 'light')
                setLife(prevState => prevState - 1);
            if (attack.type == 'heavy')
                setLife(prevState => prevState - 2)
        } else {
            setWalking(true);
        }
    }, [attack, state.characterAttack])


    useEffect(() => {
        if (life <= 0) {
            stop();
            playSound({ id: 'death' });
        }
    }, [life])

    useEffect(() => {
        if (dead)
            onDeath()
    }, [dead])

    function isDamaged() {
        return verifyColision(state.characterPosition, positionX, 166) && state.characterAttack && life > 0;
    }
    //Alterna entre os sprites de acordo com a ação...
    function animateSprite() {
        if (life <= 0) {
            setTimeout(() => {
                setDead(true);
            }, 600)
            return {
                backgroundImage: 'url(' + DeathSprite + ')',
                animation: 'death 0.7s steps(6)',

            }
        } else {
            if (isDamaged()) {
                return {
                    backgroundImage: 'url(' + HurtSprite + ')',
                    animation: 'hurt 0.2s steps(2) infinite',
                }
            }
            if (attack) {
                return {
                    backgroundImage: 'url(' + AttackSprite + ')',
                    animation: 'attack 0.5s steps(6) infinite',
                }
            } else {
                return {
                    backgroundImage: 'url(' + WalkSprite + ')',
                    animation: 'walk 0.7s steps(6) infinite',
                }
            }
        }
    }

    return (
        !dead &&
        <div className='zombie-body' style={{
            transform: `translate(${positionX}px) rotateY(${rotate})`,
        }}>
            <div className='health-zombie'
                style={{
                    width: life > 0 ? (life * 10): 0
                }}
            />
            <div
                className="zombie-content"
                style={{
                    width: 90,
                    height: 90,
                    ...animateSprite()
                }}>
            </div>
        </div>
    )
}

export default Zombie;