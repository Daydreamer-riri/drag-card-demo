import type { MotionValue } from 'framer-motion'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { rate, springOptions } from './constants'
import styles from './content.module.css'

export function Item({ isDetail, index, opacityValue }: { isDetail: boolean; index: number; opacityValue?: MotionValue<number> }) {
  const router = useRouter()
  const searchparams = useSearchParams()
  const selectedId = searchparams.get('id')
  const isOpen = selectedId === String(index)

  if (index < 0 || index > 100) {
    return (
      <motion.div className={styles.container}></motion.div>
    )
  }

  return (
    <motion.div
            // layoutId={`card-${selectedId}`}
      key={index}
      className={styles.container}
      style={{ opacity: opacityValue ?? 1, border: '1px solid #000', background: '#eee', zIndex: 11, scale: isDetail ? 1 : rate }}
      // {...(isDetail ? detailOptions : {})}
    >{isDetail
      && (
        <motion.div
          className={styles.close}
          onClick={() => router.back()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', ...springOptions }}
        >
          close
        </motion.div>
      )}
      { index }
    </motion.div>
  )
}
