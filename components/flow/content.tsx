'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { springOptions } from './constants'
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
            // layoutId={`card-${selectedId}`}
            key={selectedId}
            className={styles.container}
            style={{ border: '1px solid #000', background: '#eee', zIndex: 11 }}
            initial={{ opacity: 1, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 1, scale: 0.6 }}
            transition={{ type: 'spring', ...springOptions }}
          >
            <motion.div
              className={styles.close}
              onClick={() => router.back()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              close
            </motion.div>
            {selectedId}
          </motion.div>
          )
        : null}
    </AnimatePresence>
  )
}
