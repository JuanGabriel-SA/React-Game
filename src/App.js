import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Boss from './components/boss';
import Character from './components/character';
import Heart from './components/others/heart';
import Life from './components/others/life';
import Zumbi from './components/zombie';

function App() {
  const [enemyCount, setEnemyCount] = useState(0);
  const [heartCount, setHeartCount] = useState(0);
  const [damage, setDamage] = useState(false);
  const [life, setLife] = useState(10);
  const [currentEnemy, setCurrentEnemy] = useState([]);
  const animateSpecialIcon = useAnimation();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  useEffect(() => {
    if (state.specialAttack)
      animateSpecialAttack()
  
  }, [state.specialAttack])

  useEffect(() => {
    if (life <= 5) {
      const createHearts = setInterval(() => {
        setHeartCount(prevState => prevState + 1)

      }, 3000)
      return () => clearInterval(createHearts)
    }

  }, [life])

  useEffect(() => {
    let aux = [...currentEnemy];
    if (enemyCount < 3) {
      //Cria 3 zumbis
      aux.push(<Zumbi isAttacking={(e) => setDamage(e)} onDeath={() => setEnemyCount(prevState => prevState + 1)} />)
      setCurrentEnemy(aux)
    }

  }, [enemyCount])


  function getLifeBar() {
    let aux = [];
    for (let i = 0; i < life; i++) {
      aux.push(<Life />)
    }
    return aux;
  }

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
    //console.log(state.characterPosition)
  }, [state.characterPosition])
  return (
    <div className="game-content">
      <Character damage={damage} onDamage={() => setLife(prevState => prevState - 1)} />
      <Boss isAttacking={(e) => setDamage(e)} onDeath={() => setEnemyCount(prevState => prevState + 1)} />
      <motion.h1
        initial={{ opacity: 0 }}
        animate={animateSpecialIcon}
        className='danger-icon'>
        危
      </motion.h1>
      <div className='game-background' style={{
        opacity: state.specialAttack && '0'
      }}>
        <div className='life-bar' style={{ opacity: state.specialAttack ? 0.4 : 1 }}>
          <div className='life-bar-out'/>
          <div className='life-bar-in'style={{
            width: life * 27.1
          }} />
        </div>
        {getHearts()}
      </div>
    </div>
  );
}

export default App;
