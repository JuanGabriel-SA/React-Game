import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useSound from 'use-sound';
import ConsumedSound from '../../../songs/others/heart/Consumed.wav';
import { verifyColision } from '../../../utils/colisionDetection';
import './Heart.css';
const Heart = ({ onConsume }) => {
    const [positionX, setPositionX] = useState(generatePosition());
    const [consumed, setConsumed] = useState(false);
    const [colision, setColision] = useState(false);
    const rotateAnimation = useAnimation();
    const state = useSelector((state) => state);
    const [playSound, properties] = useSound(ConsumedSound, {volume: 0.1});

    function generatePosition() {
        //Se a posição do coração não for par, gere outra posição...
        let position = Math.floor(Math.random() * (1250 - (170) + 1)) + (170);
        if (position % 2 == 0) {
            return position;
        }
        return generatePosition();
    }

    useEffect(() => {
        rotateAnimation.start({
            rotateY: [0, 360],
            x: [positionX, positionX],
            transition: {
                repeat: Infinity,
                ease: 'linear'
            }
        })
    }, [positionX])

    useEffect(() => {
        let position = {x: positionX, y: 0};
        console.log(position, state.characterPosition)
        if (verifyColision(position, state.characterPosition, 50, 80)) {
            setColision(true);
        }
    }, [state.characterPosition])

    async function consume() {
        playSound();
        onConsume();
        await rotateAnimation.start({
            rotateY: 0,
            scale: [1, 1.6, 0],
            transition: {
                times: [0, 0.3, 0.6],
                duration: 0.4,
                ease: 'linear'
            }
        })
        setConsumed(true);
    }

    useEffect(() => {
        if (colision)
            consume();
    }, [colision])

    return (
        !consumed &&
        <motion.div
            animate={rotateAnimation}
            className="heart-component"
            style={{
                transform: `translateX(${positionX}px)`
            }}>

        </motion.div>
    )
}

export default Heart;