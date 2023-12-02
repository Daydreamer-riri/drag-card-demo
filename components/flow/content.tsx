'use client'
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useSpring } from 'framer-motion'
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
  const [canDrag, setCanDrag] = useState(true)
  const isReplacingRef = useRef(false)

  const y = useSpring(0, springOptions)

  useMotionValueEvent(y, 'change', (latest) => {
    if (isReplacingRef.current)
      return

    if (latest > window.innerHeight - 1) {
      setCanDrag(true)
      router.replace(`?id=${Number(selectedId) - 1}`)
      isReplacingRef.current = true
    }

    else if (latest < -window.innerHeight + 1) {
      setCanDrag(true)
      router.replace(`?id=${Number(selectedId) + 1}`)
      isReplacingRef.current = true
    }
  })

  useEffect(() => {
    y.jump(0)
    isReplacingRef.current = false
    setCanDrag(true)
  }, [selectedId, y])

  const unSelectedOpacity = useMotionValue(0)

  useEffect(() => {
    if (selectedId === null)
      unSelectedOpacity.set(0)
  }, [selectedId])

  return (
    <AnimatePresence>
      {selectedId !== null
        ? (
          <motion.div
            drag={canDrag ? 'y' : false}
            className={styles.contentContainer}
            style={{ y }}
            dragMomentum={false}
            dragConstraints={{ bottom: selectedId === '0' ? 0 : void 0 }}
            onDragStart={() => {
              unSelectedOpacity.set(1)
            }}
            onDragEnd={() => {
              if (y.get() > 100) {
                if (selectedId === '0')
                  return
                y.set(window.innerHeight)
                setCanDrag(false)
              }
              else if (y.get() < -100) {
                setCanDrag(false)
                y.set(-window.innerHeight)
              }
              else { y.set(0) }
            }}
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
