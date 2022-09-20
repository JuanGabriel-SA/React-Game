import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useSound from 'use-sound';
import { addEnemy, editEnemy, removeEnemy } from '../../redux/actions/EnemiesControl.actions';
import Sounds from '../../songs/zombie/Sounds.mp3';
import { verifyColision } from '../../utils/colisionDetection';
import getItem from '../../utils/getItem';
import DamageCountEffect from '../effects/DamageCountEffect';
import './Skeleton.css';
const Skeleton = ({ onDeath, onAttack, id }) => {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [position, setPosition] = useState({ x: 2000, y: 0 })
    const [walking, setWalking] = useState(true);
    const [attack, setAttack] = useState(false);
    const [rotate, setRotate] = useState('0deg');
    const [life, setLife] = useState(30);
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

    function generatePosition() {
        let position = Math.floor(Math.random() * 2) + 1;

        if (position == 1)
            setX(-200);
        else
            setX(1730);
    }

    useEffect(() => {
        if (walking && !state.specialAttack) {
            const enemyWalk = setInterval(() => {
                //O inimigo ira perseguir o personagem...
                if (x < state.characterPosition.x)
                    setX(prevState => prevState + 1);
                else
                    setX(prevState => prevState - 1);

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
        if (life <= 0) {
            setWalking(false)
            playSound({ id: 'death' });
        }
    }, [life])

    useEffect(() => {
        if (dead) {
            setWalking(false);
            onDeath != undefined && onDeath();
        }
    }, [dead])

    useEffect(() => {
        setPosition({ x: x, y: y });
    }, [x, y])

    useEffect(() => {
        let aux = {
            id: id,
            position: position,
            life: life
        }
        dispatch(addEnemy(aux));
    }, []);

    useEffect(() => {
        updateEnemy('position', position);
    }, [position]);

    useEffect(() => {
        //Assim que o inimigo morrer, ele será removido do estado, evitando problemas de performance...
        if (life <= 0)
            dispatch(removeEnemy(id));
            
        updateEnemy('life', life);
    }, [life])

    useEffect(() => {
        //console.log(state.enemiesControl)
    }, [state.enemiesControl])

    function updateEnemy(key, value) {
        let allEnemies = [...state.enemiesControl];
        let enemy = getItem(id, allEnemies);
        if (enemy !== null) {
            let aux = { ...enemy, [key]: value }
            dispatch(editEnemy(aux))
        }
    }
    //Alterna entre os sprites de acordo com a ação...
    function animateSprite() {
        if (life <= 0) {
            setTimeout(() => {
                setDead(true);
            }, 1800)
            return {
                animation: 'skeletonDeath 1.8s steps(13)',
                backgroundPositionY: '25%',

            }
        } else {
            if (state.specialAttack) {
                return {
                    animation: 'bossStopped 1.5s steps(5) infinite',
                    backgroundPositionY: '0%',
                }
            }
            if (isDamaged) {
                return {
                    animation: 'skeletonHurt 0.5s steps(3)',
                    backgroundPositionY: '100%',
                }
            }
            if (attack) {
                return {
                    animation: 'skeletonAttack 0.8s steps(13) infinite',
                    backgroundPositionY: '0%',
                }
            } else {
                return {
                    backgroundPositionY: '50%',
                    animation: 'skeletonWalk 0.7s steps(12) infinite',
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

    return (
        !dead &&
        <div
            className="skeleton-body"
            style={{
                transform: `translate(${x}px)`,
            }}>
            <div className='health-skeleton'
                style={{
                    width: life > 0 ? (life * 10) : 0,
                    display: life <= 0 && 'none'
                }}
            />
            {isDamaged && <DamageCountEffect damage={damageCount} trigger={isDamaged} onCritical={critical} />}
            <div
                className="skeleton-content"
                style={{
                    width: 128,
                    height: 128,
                    transform: `rotateY(${rotate})`,
                    ...animateSprite(),
                }}></div>
        </div>
    )

}
export default Skeleton;