import { Waterfall } from '@/components/flow/waterfall'
import { Content } from '@/components/flow/content'

export default function FlowPage() {
  return (
    <div style={{ position: 'relative' }}>
      <Waterfall />
      <Content />
    </div>
  )
}
