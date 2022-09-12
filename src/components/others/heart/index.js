import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useSound from 'use-sound';
import ConsumedSound from '../../../songs/others/heart/Consumed.mp3';
import { verifyColision } from '../../../utils/colisionDetection';
import './Heart.css';
const Heart = ({ onConsume }) => {
    const [positionX, setPositionX] = useState(generatePosition());
    const [consumed, setConsumed] = useState(false);
    const [colision, setColision] = useState(false);
    const rotateAnimation = useAnimation();
    const state = useSelector((state) => state);
    const characterPosition = state.characterPosition;
    const [playSound, properties] = useSound(ConsumedSound);

    function generatePosition() {
        //Se a posição do coração não for par, gere outra posição...
        let position = Math.floor(Math.random() * (402 - (-402) + 1)) + (-402);
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
        if (verifyColision(positionX, characterPosition, 46)) {
            setColision(true);
        }
    }, [characterPosition])

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