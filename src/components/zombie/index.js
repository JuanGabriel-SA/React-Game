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
import DamageCountEffect from '../effects/DamageCountEffect';
import './Zombie.css';
const Zombie = ({ onDeath, onAttack, isAttacking }) => {
    const [x, setX] = useState(generatePosition());
    const [y, setY] = useState(0);
    const [position, setPosition] = useState({ x: x, y: 0 })
    const [walking, setWalking] = useState(true);
    const [attack, setAttack] = useState(false);
    const [rotate, setRotate] = useState('0deg');
    const [life, setLife] = useState(5);
    const [isDamaged, setIsDamaged] = useState(false);
    const [damageCount, setDamageCount] = useState(0);
    const [dead, setDead] = useState(false);
    const [critical, setCritical] = useState(false);
    const [playSound, { stop }] = useSound(Sounds, {
        volume: 0.1,
        sprite: {
            hurt: [0, 430],
            criticalHurt: [611, 1600],
            walk: [2607, 300],
            death: [8962, 2000]
        },
        interrupt: false
    });
    const dispatch = useDispatch();
    const state = useSelector((state) => state);


    useEffect(() => {
        if (verifyDamage()) {
            setWalking(false);
            takeDamage();
        } else {
            setTimeout(() => {
                setWalking(true);
            }, 1000)
            setIsDamaged(false);
        }
    }, [state.characterAttack, rotate, critical])

    function verifyDamage() {
        if (state.characterAttack.isAttacking && life > 0) {
            let characterRotation = state.characterPosition.rotation;
            let colisionMarginX = 0;
            let attackType = state.characterAttack.type;
            //O attack de dash tem um range muito maior...
            if (attackType == 'dash')
                colisionMarginX = 600
            else
                colisionMarginX = 200;
            //O ataque especial vai atingir o inimigo independente da posição dele...
            if (state.characterAttack.type == 'special')
                return true;
            else
                return (verifyColision(state.characterPosition, position, colisionMarginX, 180)
                    && life > 0
                    && characterRotation != rotate)
        }
    }

    function takeDamage() {
        let attackType = state.characterAttack.type;
        let damage = 0;
        setIsDamaged(true);
        stop();
        playSound({ id: 'hurt' });
        switch (attackType) {
            case 'light':
                damage = 1;
                break;
            case 'heavy':
                damage = 2
                break;
            case 'dash':
                damage = 3
                break;
            case 'special':
                damage = 20;
                break;
        }
        if (critical) {
            stop();
            playSound({ id: 'criticalHurt' })
            damage = damage * 2;
        }

        setLife(prevState => prevState - damage);
        setDamageCount(damage);
    }

    useEffect(() => {

    }, [critical])

    function generatePosition() {
        let position = Math.floor(Math.random() * 2) + 1;

        if (position == 1)
            return -200;
        else
            return 1730;
    }

    useEffect(() => {
        if (walking && !state.specialAttack) {
            const enemyWalk = setInterval(() => {
                //O inimigo ira perseguir o personagem...
                if (x < state.characterPosition.x)
                    setX(prevState => prevState + 2);
                else
                    setX(prevState => prevState - 2);

            }, 10)
            return () => clearInterval(enemyWalk)
        }
    }, [walking, state.characterPosition, state.specialAttack]);

    useEffect(() => {
        if (x < state.characterPosition.x && !state.specialAttack && life > 0)
            setRotate('0deg')
        if (x > state.characterPosition.x && !state.specialAttack && life > 0)
            setRotate('180deg')

        let attackType = state.characterAttack.type;
        //Quando o inimigo encostar no personagem, ele para e ataca...
        if (verifyColision(position, state.characterPosition, 80, 80) && life > 0 && !state.specialAttack && attackType !== 'dash') {
            setAttack(true);
            onAttack !== undefined && onAttack();
            setWalking(false);
        } else {
            if (life > 0) {
                setWalking(true);
                setAttack(false);
            }

        }
    }, [position, state.characterPosition, life, state.specialAttack, state.characterAttack]);

    useEffect(() => {
        isAttacking(attack);
        if (attack && life > 0)
            dispatch(damageCharacter(true));
        else
            dispatch(damageCharacter(false));
    }, [attack])

    useEffect(() => {
        if (life <= 0) {
            setWalking(false)
            playSound({ id: 'death' });
        }
    }, [life])

    useEffect(() => {
        if (dead) {
            setWalking(false);
            onDeath();
        }
    }, [dead])

    useEffect(() => {
        setPosition({ x: x, y: y });

    }, [x, y])
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
            if (isDamaged) {
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

    useEffect(() => {
        let aux = state.characterAttack.critical;
        if (aux) {
            setCritical(true);
        } else {
            setCritical(false);
        }
    }, [state.characterAttack])

    useEffect(() => {

    }, [critical])

    return (
        !dead &&
        <div
            className="zombie-body"
            style={{
                transform: `translate(${x}px)`,
            }}>
            <div className='health-zombie'
                style={{
                    width: life > 0 ? (life * 10) : 0,
                    display: life <= 0 && 'none'
                }}
            />
            {isDamaged && <DamageCountEffect damage={damageCount} trigger={isDamaged} onCritical={critical} />}
            <div
                className="zombie-content"
                style={{
                    width: 90,
                    height: 90,
                    transform: `rotateY(${rotate})`,
                    ...animateSprite(),
                }}></div>
        </div>
    )

}
export default Zombie;