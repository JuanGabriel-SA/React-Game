import { motion } from 'framer-motion';
import './Life.css';
const Life = () => {
    return (
        <motion.div className='life-component' animate={{
            scale: [1, 1.2, 1],
            transition: {
                repeat: Infinity,
                ease: 'linear',
                duration: 1.2
            }
        }} />
    )
}

export default Life;