import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useSound from 'use-sound';
import './App.css';
import Character from './components/character';
import Heart from './components/others/heart';
import Zumbi from './components/zombie';
import GeralSounds from './songs/others/stamina/Danger.wav';

function App() {
  const [enemyCount, setEnemyCount] = useState(0);
  const [heartCount, setHeartCount] = useState(0);
  const [damage, setDamage] = useState(false);
  const [life, setLife] = useState(10);
  const [currentEnemy, setCurrentEnemy] = useState([]);
  const [specialCount, setSpecialCount] = useState(0);
  const animateSpecialIcon = useAnimation();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [playSound, properties] = useSound(GeralSounds, { volume: 0.03 });

  useEffect(() => {
    if (state.specialAttack)
      animateSpecialAttack()
  }, [state.specialAttack])

  useEffect(() => {
    if (specialCount < 250) {
      const specialInterval = setInterval(() => {
        setSpecialCount(prevState => prevState + 1)
      }, 10)

      return () => clearInterval(specialInterval)
    }
  }, [specialCount])

  useEffect(() => {
    if (life <= 999 && heartCount < 1) {
      const createHearts = setInterval(() => {
        setHeartCount(prevState => prevState + 1)

      }, 1000)
      return () => clearInterval(createHearts)
    }

  }, [life, heartCount])

  useEffect(() => {
    let aux = [...currentEnemy];
    if (enemyCount < 3) {
      //Cria 3 zumbis
      aux.push(<Zumbi isAttacking={(e) => setDamage(e)} onDeath={() => setEnemyCount(prevState => prevState + 1)} />)
      setCurrentEnemy(aux)
    }

  }, [enemyCount])

  function getHearts() {
    let aux = [];
    for (let i = 0; i < heartCount; i++) {
      aux.push(<Heart onConsume={() => setLife(prevState => prevState + 1)} />)
    }
    return aux;
  }

  function animateSpecialAttack() {
    animateSpecialIcon.start({
      opacity: 1,
    })
    setTimeout(() => {
      animateSpecialIcon.start({
        opacity: 0,
        transition: {
          duration: 0.2
        }
      })
    }, 800)
  }

  useEffect(() => {
    if (state.characterStamina < 30) {
      playSound();
      const interval = setInterval(() => {
        playSound();
      }, 500)

      return () => clearInterval(interval);
    }
  }, [state.characterStamina])
  return (
    <div className="game-content">

      {/* Lifebar */}
      <div className='life-bar' style={{ opacity: state.specialAttack ? 0.4 : 1 }}>
        <div className='life-bar-text'>
          Saúde
        </div>
        <div className='life-bar-out' />
        <div className='life-bar-in' style={{
          width: life * 27.1
        }} />
      </div>
      {/* Lifebar */}

      {/* Stamina */}
      <div className='vigor-bar'>
        <div className='vigor-bar-text'>
          Vigor
        </div>
        <div className='vigor-bar-out' style={{
          opacity: state.specialAttack ? 0.4 : 1,
        }}>
        </div>
        <motion.div className='vigor-bar-in'
          style={{
            width: state.characterStamina
          }}
          /*Se o personagem não tiver stamina o suficiente para executar nenhum ataque,
          é realizada a animação...*/
          animate={state.characterStamina < 30 ?
            {
              opacity: [0, 1],
              backgroundColor: 'red',
              transition: {
                repeat: Infinity,
                ease: 'linear'
              }
            } :
            { opacity: 1 }}
        />
      </div>
      {/* Stamina */}
      {/* Especial */}
      <div className='special-bar' style={{ opacity: state.specialAttack ? 0.4 : 1 }}>
        <div className='special-bar-text'>
          Mil cortes
        </div>
        <motion.div className='special-bar-out' />
        <motion.div className='special-bar-in' style={{
          width: specialCount,
          background: specialCount == 250 ? 'red' : 'linear-gradient(90deg, rgba(0,18,181,1) 0%, rgba(0,12,120,1) 100%)'
        }}
          animate={
            specialCount == 250 &&
            {
              opacity: [0, 1, 0],
              transition: {
                repeat: Infinity,
                ease: 'linear',
                duration: 0.6
              }
            }
          } />
        {specialCount == 250 &&
          <motion.h1 className='special-icon' animate={{
            x: [2, 0, 2],
            opacity: [0, 1, 0],
            transition: {
              repeat: Infinity,
              ease: 'linear',
              duration: 0.1
            }
          }}>
            危
          </motion.h1>
        }
      </div>
      {/* Especial */}
      <Character damage={damage} onDamage={() => setLife(prevState => prevState - 1)} />
      {/* {currentEnemy} */}
      {/* <Boss isAttacking={(e) => setDamage(e)} onDeath={() => setEnemyCount(prevState => prevState + 1)} /> */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={animateSpecialIcon}
        className='danger-icon'>
        危
      </motion.h1>
      <div className='game-background' style={{
        opacity: state.specialAttack && '0'
      }}>
        {getHearts()}
      </div>
    </div>
  );
}

export default App;
