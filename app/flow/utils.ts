// 打印螺旋数组
export function printSpiralMatrix(n: number) {
  let num = n * n - 1
  const matrix = Array.from({ length: n })
    .fill(0)
    .map(() => Array.from({ length: n })
      .fill(0)) as number[][]

  const stack = [Array.from({ length: n * n }).fill([0, 0])] as number[][]
  let left = 0
  let right = n - 1
  let top = 0
  let bottom = n - 1
  while (left <= right && top <= bottom) {
    for (let row = top; row <= bottom; row++) {
      matrix[row][left] = num
      stack[num] = [row, left]
      num--
    }
    for (let column = left + 1; column <= right; column++) {
      matrix[bottom][column] = num
      stack[num] = [bottom, column]
      num--
    }
    if (left < right && top < bottom) {
      for (let row = bottom - 1; row > top; row--) {
        matrix[row][right] = num
        stack[num] = [row, right]
        num--
      }
      for (let column = right; column > left; column--) {
        matrix[top][column] = num
        stack[num] = [top, column]
        num--
      }
    }
    left++
    right--
    top++
    bottom--
  }
  return { matrix, stack }
}

export const columnCount = 11

export const { matrix, stack } = printSpiralMatrix(columnCount)
