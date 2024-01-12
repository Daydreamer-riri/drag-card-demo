import { DragDemo, Matrix } from "./components";

export default function Slide1() {
  return (
    <div className="prose max-w-4xl mx-auto">
      <h2>1</h2>
      <Matrix/>
      <h2>2</h2>
      <DragDemo />
    </div>
  )
}