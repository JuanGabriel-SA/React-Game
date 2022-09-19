import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import './DamageCountEffect.css';
const DamageCountEffect = ({ damage, trigger, onCritical }) => {
    const animate = useAnimation();
    const [critical, setCritical] = useState(false);

    useEffect(() => {
        if (trigger)
            animate.start({
                display: 'initial',
                scale: [1, 1.6],
                transition: {
                    duration: 0.2,
                    ease: 'circOut',
                },
                transitionEnd: {
                    display: 'none'
                }
            })
    }, [trigger]);

    useEffect(() => {
        criticalCountEffect();
    }, [onCritical])

    function criticalCountEffect() {
        if (onCritical) {
            setCritical(true);
            setTimeout(() => {
                setCritical(false);
            }, [400])
        }
    }


    return (
        <motion.div initial={{scale: 0}} className='damage-count-effect' animate={animate}>
            <label style={{
                color: onCritical ? 'red': 'white',
                }}>{damage}</label>
        </motion.div>
    )
}

export default DamageCountEffect;