'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { MotionValue, SpringOptions } from 'framer-motion'
import { motion, useDragControls, useSpring } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { columnCount, matrix, stack } from '../../app/flow/utils'

const springOptions: SpringOptions = {
  damping: 30,
  bounce: 1,
}

function getCoords(size: number[]) {
  const [w, h] = size
  const screenWidth = w / 0.75
  const screenHeight = h / 0.75
  return stack.map((item) => {
    const [y, x] = item
    const isOffsetItem = x % 2 === 1
    return {
      x: -(x * w + w / 2 - screenWidth / 2),
      y: -(y * h + (isOffsetItem ? (h / 2) : 0) + h / 2 - screenHeight / 2),
      left: x * w,
      top: y * h + (isOffsetItem ? (h / 2) : 0),
    }
  })
}

export function Waterfall() {
  const [isInit, setIsInit] = useState(false)
  const [size, setSize] = useState([0, 0])
  const dragControls = useDragControls()
  const x: MotionValue<number> = useSpring(0, springOptions)
  const y: MotionValue<number> = useSpring(0, springOptions)
  const [activeIndex, _setActiveIndex] = useState(0)
  const aroundIndexes = getAroundIndexes(2)

  const constraintsRef = useRef<HTMLDivElement>(null)
  const dragDomRef = useRef<HTMLDivElement>(null)

  const coords = useMemo(() => {
    return getCoords(size)
  }, [size])

  useEffect(() => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    const size = [screenWidth * 0.75, screenHeight * 0.75]
    setSize(size)
    setIsInit(true)
    const [w, h] = size
    x.jump(-w * (columnCount / 2) + screenWidth / 2)
    y.jump(-h * (columnCount / 2) + screenHeight / 2 - ((columnCount + 1) % 2 === 0 ? h / 2 : 0))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [w, h] = size

  const router = useRouter()

  if (!isInit)
    return

  return (
    <motion.div layoutRoot ref={constraintsRef} style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <motion.div
        style={{ width: w * columnCount, height: h * columnCount + 1, x, y }}
        drag
        dragMomentum={false}
        dragControls={dragControls}
        ref={dragDomRef}
        onDragEnd={() => {
          const newIndex = getActiveIndex()
          setActiveIndex(newIndex)
        }}
      >
        {
          coords.map((item, index) => {
            if (!aroundIndexes.includes(index))
              return null

            const isActive = index === activeIndex
            return (
              <div
                key={index}
                style={{ zIndex: isActive ? 10 : 0, width: w, height: h, padding: 20, position: 'absolute', top: item.top, left: item.left }}
                onClick={() => {
                  if (index !== activeIndex)
                    setActiveIndex(index)
                  else
                    router.push(`?id=${index}`)
                }}
              >
                <motion.div
                  style={{ background: '#eee', zIndex: isActive ? 10 : 0, border: '1px solid #000', height: '100%', display: 'grid', placeItems: 'center', fontSize: 45 }}
                  layoutId={`card-${index}`}
                >
                  {index}
                </motion.div>
              </div>
            )
          })
        }
      </motion.div>
    </motion.div>
  )

  function setActiveIndex(newIndex: number) {
    _setActiveIndex(newIndex)
    x.set(coords[newIndex].x)
    y.set(coords[newIndex].y)
  }

  function getActiveIndex() {
    const aroundIndexes = getAroundIndexes(2)

    const [xv, yv] = [x.getVelocity(), y.getVelocity()]
    const [currX, currY] = [x.get(), y.get()]
    let resIndex = 0
    let minDistance = Number.POSITIVE_INFINITY
    for (const index of aroundIndexes) {
      const { x, y } = coords[index]
      const distance = Math.sqrt((x - (currX + xv / 30)) ** 2 + (y - (currY + yv / 10)) ** 2) + (index === activeIndex ? 100 : 0)
      if (distance < minDistance) {
        resIndex = index
        minDistance = distance
      }
    }
    return resIndex
  }

  function getAroundIndexes(n: number) {
    const [i, j] = stack[activeIndex]
    const aroundIndexes: number[] = []
    for (let y = i - n; y <= i + n + 1; y++) {
      for (let x = j - n; x <= j + n; x++)
        aroundIndexes.push(matrix[y]?.[x])
    }

    return aroundIndexes.filter(item => item !== undefined)
  }
}
