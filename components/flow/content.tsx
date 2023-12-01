'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './content.module.css'

export function Content() {
  const searchParams = useSearchParams()
  const selectedId = searchParams.get('id')

  const router = useRouter()

  return (
    <AnimatePresence>
      {selectedId !== null
        ? (
          <motion.div
            layoutId={`card-${selectedId}`}
            key={selectedId}
            className={styles.container}
            style={{ border: '1px solid #000', background: '#eee', zIndex: 11 }}
          >
            <div className={styles.close} onClick={() => router.back()}>close</div>
            {selectedId}
          </motion.div>
          )
        : null}
    </AnimatePresence>
  )
}
