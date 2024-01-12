'use client'
import { motion, useForceUpdate, useMotionValue } from 'framer-motion'
import { useState } from 'react'
import { stack } from '../../flow/utils'
import styles from './style.module.css'

const offsets = [
  { x: -20, y: -40 },
  { x: -220, y: -40 },
]

const buttonClass = 'h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'

export function DragDemo() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [forceUpdate] = useForceUpdate()

  const [step, setStep] = useState(0)

  const onDragEnd = () => {
    if (step < 2)
      return

    let distance = Number.POSITIVE_INFINITY
    let newOffset: { x: number; y: number } = { x: 0, y: 0 }
    for (const offset of offsets) {
      const d = Math.sqrt((x.get() - offset.x) ** 2 + (y.get() - offset.y) ** 2)
      if (d < distance) {
        newOffset = offset
        distance = d
      }
    }
    x.jump(newOffset.x)
    y.jump(newOffset.y)
  }

  return (
    <div className="relative">
      <motion.div
        drag
        className="w-[400px] h-[400px] bg-gray-300 relative"
        dragMomentum={false}
        style={{ x, y }}
        onDrag={forceUpdate}
        onDragEnd={onDragEnd}
      >
        {step >= 1
          ? (
            <>
              <div className="bg-neutral-600 w-[100px] h-[200px] absolute top-[100px] left-[50px]"></div>
              <div className="bg-neutral-600 w-[100px] h-[200px] absolute top-[100px] left-[250px]"></div>
            </>
            )
          : null}
      </motion.div>
      <div className="w-[160px] h-[320px] border-gray-900 border-2 absolute top-0 left-0 pointer-events-none"></div>
      <p className="relative z10">
        <span>x: {x.get()}, y: {y.get()}</span>
      </p>
      {step >= 2
        ? (
          <p>
            {JSON.stringify(offsets)}
          </p>
          )
        : null}
      {step >= 3
        ? (
          <p>
            <span>vx: {x.getVelocity()}, vy: {y.getVelocity()}</span>
          </p>
          )
        : null}
      <button className={buttonClass} onClick={() => setStep(step + 1)}>Next</button>
    </div>
  )
}

export function Matrix() {
  const [step, setStep] = useState(0)
  return (
    <>
      <div className="relative w-[440px] h-[440px]">
        {step === 0
          ? null
          : stack.map(([y, x], index) => (
            <div
              key={index}
              className={`absolute w-[40px] h-[40px] grid place-items-center ${styles['animate-fade-in']}`}
            // @ts-expect-error css var
              style={{ 'top': y * 40, 'left': x * 40, 'transform': `translateY(${step > 1 && x % 2 === 0 ? '-50%' : 0})`, '--index': index }}
            >
              {index}
            </div>
          ))}
      </div>
      <button className={buttonClass} onClick={() => setStep(step + 1)}>Next</button>
    </>
  )
}
