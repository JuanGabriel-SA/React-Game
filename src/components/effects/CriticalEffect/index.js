import { motion } from "framer-motion";
import './CriticalEffect.css';
const CriticalEffect = ({ onCritical, life }) => {
    return (
        <motion.div className='critical-effect' animate={onCritical ? {
            scale: [1, 1.5],
            opacity: [1, 0],
            transition: {
                duration: 0.4,
                ease: 'circOut',
                opacity: {
                    duration: 0.4,
                    ease: 'circOut',
                    delay: 0.4,
                },
            },
        } : {
            display: 'none'
        }
        }>
            <label>Critical</label>
        </motion.div>
    )
}

export default CriticalEffect;
