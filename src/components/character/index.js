import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useSound from 'use-sound';
import AttackDash from '../../imgs/character/AttackDash.png';
import AttackHeavy from '../../imgs/character/AttackHeavy.png';
import AttackLight from '../../imgs/character/AttackLight.png';
import EndSpecialAttack from '../../imgs/character/EndSpecialAttack.png';
import FallSprite from '../../imgs/character/Fall.png';
import HurtSprite from '../../imgs/character/Hurt.png';
import StopSprite from '../../imgs/character/Idle.png';
import JumpSprite from '../../imgs/character/Jump.png';
import SpecialAttack from '../../imgs/character/SpecialAttack.png';
import WalkSprite from '../../imgs/character/Walk.png';
import { characterIsAttacking, characterIsNotAttacking } from '../../redux/actions/CharacterAttack.actions';
import { moveCharacter } from '../../redux/actions/CharacterPosition.actions';
import { consumeStamina, resetStamina } from '../../redux/actions/CharacterStamina.actions';
import { specialAttackEffects } from '../../redux/actions/SpecialAttack.actions';
import Sounds from '../../songs/character/Sounds.mp3';
import { getRandom } from '../../utils/getRandom';
import useWindowDimensions from '../../utils/getWindowSize';
import './Character.css';

const Character = ({ onDamage, damage }) => {
    const [x, setX] = useState(730);
    const [y, setY] = useState(0);
    const [position, setPosition] = useState({ x: 730, y: 0 });
    const [rotate, setRotate] = useState('0deg');
    const [walking, setWalking] = useState(false);
    const [moveLeft, setMoveLeft] = useState(false);
    const [moveRight, setMoveRight] = useState(false);
    const [specialAttack, setSpecialAttack] = useState(false);
    const [specialAttackCount, setSpecialAttackCount] = useState(0);
    const [lightAttack, setLightAttack] = useState(false);
    const [heavyAttack, setHeavyAttack] = useState(false);
    const [isDashing, setIsDashing] = useState(false);
    const [jumping, setJumping] = useState(false);
    const [fall, setFall] = useState(false);
    const [effectPosition, setEffectPosition] = useState(0);
    const viewSize = useWindowDimensions();
    const dispatch = useDispatch();
    const [playSound, { stop }] = useSound(Sounds, {
        volume: 0.1,
        sprite: {
            hurt: [0, 249],
            walk: [251, 300],
            lightAttack: [566, 880],
            heavyAttack: [1637, 1000],
            dash: [2787, 600],
            specialAttackStart: [8050, 3000],
            specialAttack: [7208, 800],
            specialAttackEnd: [3849, 3000],
            jump: [10970, 800],
            air: [11709, 3000],
            fall: [17399, 800]

        }
    });
    const state = useSelector((state) => state);
    const stamina = state.characterStamina;
    useEffect(() => {
        setPosition({ x: 730, y: 0 })
    }, [])

    useEffect(() => {
        window.onkeydown = ((e) => {
            console.log(stamina)
            if (e.key == 'ArrowLeft' && !state.specialAttack) {
                setRotate('180deg');
                setMoveLeft(true);
            }

            if (e.key == 'ArrowUp' && !e.repeat && y == 0 && !state.specialAttack && !isDashing) {
                setEffectPosition(x);
                setJumping(true);
            }

            if (e.key == 'd' && !e.repeat && !state.specialAttack && stamina > 120) {
                setIsDashing(true);
            }

            if (e.key == 'ArrowRight' && !state.specialAttack) {
                setRotate('0deg');
                setMoveRight(true);
            }

            if (e.key == 'x' && !e.repeat && !state.specialAttack) {
                dispatch(specialAttackEffects(true));
                playSound({ id: 'specialAttackStart' });
                setTimeout(() => {
                    setSpecialAttack(true);
                }, 1000)
            }
            if (e.key == 'q' && !e.repeat && !state.specialAttack && stamina > 25) {
                setLightAttack(true);
            }

            if (e.key == 'e' && !e.repeat && !state.specialAttack && stamina > 80) {
                setHeavyAttack(true);
            }
        })

        window.onkeyup = ((e) => {
            if (e.key == 'ArrowLeft') {
                setWalking(false);
                setMoveLeft(false);
            }
            if (e.key == 'ArrowRight') {
                setWalking(false);
                setMoveRight(false);
            }
        })
    }, [lightAttack, heavyAttack, position, specialAttack, specialAttackCount, state.specialAttack, playSound, isDashing, stamina]);

    useEffect(() => {
        if (specialAttack) {
            const specialAttackInterval = setInterval(() => {
                playSound({ id: 'specialAttack' })

                setSpecialAttackCount(prevState => prevState + 1);
            }, 100)

            //Randomiza as posições do personagem...
            setX(getRandom(200, 1070));
            setY(getRandom(0, -400));

            //Varia a rotação do personagem...
            if (specialAttackCount % 2 == 0)
                setRotate('0deg')
            else
                setRotate('180deg')

            //Som do final do ataque...
            if (specialAttackCount == 19) {
                playSound({ id: 'specialAttackEnd' })
            }

            //Acaba o especial em 20 ataques...
            if (specialAttackCount == 20) {
                setSpecialAttack(false);
                setY(0);
                setX(730);
                dispatch(characterIsAttacking({ isAttacking: true, type: 'special' }));
                //Delay para realizar o sprite do final do ataque especial...
                setTimeout(() => {
                    dispatch(characterIsNotAttacking())
                    setSpecialAttackCount(0);
                    dispatch(specialAttackEffects(false));
                }, 940)
            }
            return () => clearInterval(specialAttackInterval)
        }
    }, [specialAttack, specialAttackCount])

    //Personagem caindo...
    useEffect(() => {
        //Garante que o personagem não fique dentro do chão...
        if (y > 0 && !specialAttack)
            setY(0)
        if (y < 0 && !jumping && !specialAttack) {
            const jumpInterval = setInterval(() => {
                //Personagem cai mais devagar enquanto está atacando no ar...
                if (heavyAttack || lightAttack || isDashing)
                    setY(prevState => prevState + 1)
                else
                    setY(prevState => prevState + 7)
            }, 10)
            return () => clearInterval(jumpInterval)
        }
    }, [y, jumping])

    //Salto do personagem...
    useEffect(() => {
        if (jumping && !isDashing) {
            const jumpInterval = setInterval(() => {
                setY(prevState => prevState - 10);
            }, 10)

            setTimeout(() => {
                setJumping(false);
            }, 550)

            return () => clearInterval(jumpInterval)
        }
    }, [jumping, y, isDashing])

    useEffect(() => {
        if (jumping && !isDashing) {
            playSound({ id: 'jump' })
            playSound({ id: 'air' })
        }
    }, [jumping])

    useEffect(() => {
        setWalking(false);
        if (isDashing) {
            loseStamina(120);
            dispatch(characterIsAttacking({ isAttacking: true, type: 'dash' }));
            playSound({ id: 'dash' })
            const dashInterval = setInterval(() => {
                if (rotate == '180deg')
                    setX(prevState => prevState - 18)
                else
                    setX(prevState => prevState + 18)
            }, 5)

            setTimeout(() => {
                setIsDashing(false);
                dispatch(characterIsNotAttacking());
            }, 600)
            return () => clearInterval(dashInterval)
        }
    }, [isDashing])


    useEffect(() => {
        if (walking && !heavyAttack && !lightAttack && !isDashing && !state.specialAttack) {
            moveSound();
            const walkingSound = setInterval(() => {
                moveSound();
            }, 200)

            return () => clearInterval(walkingSound);
        } else {
            setWalking(false);
        }
    }, [walking, state.specialAttack, y])

    function moveSound() {
        if (y == 0) {
            playSound({ id: 'walk' })
        }
    }

    useEffect(() => {
        setWalking(false);
        if (lightAttack && !heavyAttack && !isDashing) {
            loseStamina(25);
            dispatch(characterIsAttacking({ isAttacking: true, type: 'light' }));
            playSound({ id: 'lightAttack' })
            setTimeout(() => {
                setLightAttack(false);
                dispatch(characterIsNotAttacking())
            }, 200)
        } else {
            setLightAttack(false);
        }
    }, [lightAttack])

    useEffect(() => {
        //console.log(state.characterAttack)
    }, [state.characterAttack])

    useEffect(() => {
        setWalking(false);
        if (heavyAttack && !lightAttack && !isDashing) {
            loseStamina(80)
            dispatch(characterIsAttacking({ isAttacking: true, type: 'heavy' }));
            playSound({ id: 'heavyAttack' })
            setTimeout(() => {
                setHeavyAttack(false);
                dispatch(characterIsNotAttacking());
            }, 200)
        }
        else {
            setHeavyAttack(false)
        }
    }, [heavyAttack])

    function loseStamina(value) {
       
        if (stamina - value > 0)
            dispatch(consumeStamina(value));
    }

    useEffect(() => {
        const staminaInterval = setInterval(() => {
            dispatch(resetStamina());
        }, 1000);
        return () => clearInterval(staminaInterval)
    }, [heavyAttack, lightAttack, isDashing])

    useEffect(() => {

        //Não mover personagem quando ambas as teclas estiverem pressionadas...
        if (moveLeft && moveRight)
            setWalking(false)
        //Mover personagem para esquerda...
        //O personagem para para atacar se atacar enquanto estiver andando...
        if (moveLeft && !moveRight && !lightAttack && !heavyAttack && !isDashing && !state.specialAttack) {
            setWalking(true);
            const interval = setInterval(() => {
                setX(prevState => prevState - 10)
            }, 10)

            return () => clearInterval(interval);

        }
        //Mover personagem para direita...
        if (moveRight && !moveLeft && !lightAttack && !heavyAttack && !isDashing && !state.specialAttack) {
            setWalking(true);
            const interval = setInterval(() => {
                setX(prevState => prevState + 10)
            }, 10)

            return () => clearInterval(interval);
        }

    }, [moveLeft, moveRight, lightAttack, heavyAttack, isDashing, state.specialAttack])

    useEffect(() => {
        if (damage) {
            playSound({ id: 'hurt' })
            onDamage();
            const damagedSound = setInterval(() => {
                playSound({ id: 'hurt' })
                onDamage();
            }, [400])

            return () => clearInterval(damagedSound)
        }
    }, [damage])

    useEffect(() => {
        setPosition({ x: x, y: y, rotation: rotate });
        let screenWidth = viewSize.width;
      
        if (x > screenWidth - 200) {
            setX(prevState => prevState - 1)
        }
        if (x < -100)
            setX(prevState => prevState + 1)
    }, [y, x, rotate])

    useEffect(() => {
        if (y == 0 && specialAttackCount !== 20 && !specialAttack) {
            setEffectPosition(x);
            setFall(true);
            setTimeout(() => {
                setFall(false);
            }, 300)
            stop();
        }
    }, [y, specialAttack])

    useEffect(() => {
        if (fall)
            playSound({ id: 'fall' })
    }, [fall])

    useEffect(() => {
        dispatch(moveCharacter(position));
    }, [position])

    function animateCharacter() {
        if (specialAttackCount == 20) {
            return {
                backgroundImage: 'url(' + EndSpecialAttack + ')',
                animation: 'endSpecialAttack 1s steps(7)',
            }
        }
        if (specialAttack) {
            return {
                backgroundImage: 'url(' + SpecialAttack + ')',
                animation: 'characterSpecialAttack 0.2s steps(12) infinite',
            }
        }
        if (damage) {
            return {
                backgroundImage: 'url(' + HurtSprite + ')',
                animation: 'characterHurt 0.2s steps(4) infinite',
            }
        }
        if (jumping && !isDashing) {
            return {
                backgroundImage: 'url(' + JumpSprite + ')',
                animation: 'characterJump 0.2s steps(2)',
            }
        }
        if (y < 0 && !jumping && !isDashing && !lightAttack && !heavyAttack) {
            return {
                backgroundImage: 'url(' + FallSprite + ')',
                animation: 'characterFall 0.2s steps(2)',
            }
        }
        if (walking) {
            return {
                backgroundImage: 'url(' + WalkSprite + ')',
                animation: 'characterWalk 0.7s steps(8) infinite',
            }
        }
        if (isDashing) {
            return {
                backgroundImage: 'url(' + AttackDash + ')',
                animation: 'characterAttackHeavy 0.6s steps(6)',
            }
        }
        if (lightAttack) {
            return {
                backgroundImage: 'url(' + AttackLight + ')',
                animation: 'characterAttackLight 0.2s steps(6)',
            }
        }
        if (heavyAttack) {
            return {
                backgroundImage: 'url(' + AttackHeavy + ')',
                animation: 'characterAttackHeavy 0.3s steps(6)',
            }
        }

        return {
            backgroundImage: 'url(' + StopSprite + ')',
            animation: 'characterStopped 0.7s steps(4) infinite',
        }
    }

    function animateEffect() {
        if (jumping && !specialAttack) {
            return {
                animation: 'jumpEffect 0.6s steps(15)'
            }
        }
        if (fall) {
            return {
                animation: 'fallEffect 0.6s steps(15) infinite'
            }
        }
    }

    return (
        <>
            <div
                //Quando a animação de ataque acabar, o sprite é trocado para o stopped...
                onAnimationEnd={(e) => {
                    if (e.animationName == 'characterAttackLight' || e.animationName == 'characterAttackHeavy') {
                        dispatch(characterIsNotAttacking());
                    }
                }}

                className="character"
                style={{
                    width: 300,
                    height: 300,
                    transform: `translateX(${x}px) translateY(${y}px) rotateY(${rotate})`,
                    ...animateCharacter()
                }}>
            </div>

            {/*Div de efeitos, onde serão mostrados os efeitos de fumaça de queda, pulo entre outros...*/}
            {(jumping || fall) &&
                <div className='smoke-effect' style={{
                    transform: `translateX(${effectPosition}px)`,
                    ...animateEffect()
                }} />
            }
        </>
    )
}

export default Character;