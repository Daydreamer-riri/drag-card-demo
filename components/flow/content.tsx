'use client'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { rate, springOptions } from './constants'
import styles from './content.module.css'
import { Item } from './item'

const detailOptions = {
  initial: { opacity: 1, scale: rate },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 1, scale: rate },
  transition: { type: 'spring', ...springOptions },
}

export function Content() {
  const searchParams = useSearchParams()
  const selectedId = searchParams.get('id')
  const router = useRouter()

  const y = useSpring(0, springOptions)

  const onDragEnd = () => {
    const latest = y.get()
    const origin = -Number(selectedId) * window.innerHeight
    const distance = latest - origin
    if (distance < -100) {
      if (Number(selectedId) === 100) {
        y.set(origin)
        return
      }
      y.set(origin - window.innerHeight)
      router.replace(`?id=${Number(selectedId) + 1}`)
    }
    else if (distance > 100) {
      if (Number(selectedId) === 0) {
        y.set(origin)
        return
      }
      y.set(origin + window.innerHeight)
      router.replace(`?id=${Number(selectedId) - 1}`)
    }
    else {
      y.set(origin)
    }
  }

  const unSelectedOpacity = useMotionValue(0)

  useEffect(() => {
    if (selectedId === null)
      unSelectedOpacity.set(0)
  }, [selectedId])

  const prevSelectedId = usePrevious(selectedId)
  if (prevSelectedId === null && selectedId !== null)
    y.jump(-Number(selectedId) * window.innerHeight)

  return (
    <AnimatePresence>
      {selectedId !== null
        ? (
          <motion.div
            drag="y"
            className={styles.contentContainer}
            style={{ y, transformOrigin: `center calc(${selectedId} * var(--screen-height) + var(--screen-height) / 2)` }}
            dragMomentum={false}
            onDragStart={() => {
              unSelectedOpacity.set(1)
            }}
            onDragEnd={onDragEnd}
            {...detailOptions}
          >
            <Item
              opacityValue={unSelectedOpacity}
              key={Number(selectedId) - 1}
              index={Number(selectedId) - 1}
              isDetail
            />
            <Item key={Number(selectedId)} index={Number(selectedId)} isDetail />
            <Item
              opacityValue={unSelectedOpacity}
              key={Number(selectedId) + 1}
              index={Number(selectedId) + 1}
              isDetail
            />
          </motion.div>
          )
        : null}
    </AnimatePresence>
  )
}

function usePrevious<T>(value: T): T | null {
  const currentRef = useRef<T>(value)
  const previousRef = useRef<T | null>(null)
  if (value !== currentRef.current) {
    previousRef.current = currentRef.current
    currentRef.current = value
  }

  return previousRef.current
}

function useWindowHeight() {
  const [height, setHeight] = useState(0)
  useEffect(() => {
    setHeight(window.innerHeight)
    const onResize = () => {
      setHeight(window.innerHeight)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])
  return height
}
