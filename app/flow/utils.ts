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
    for (let column = left; column <= right; column++) {
      matrix[top][column] = num
      stack[num] = [top, column]
      num--
    }
    for (let row = top + 1; row <= bottom; row++) {
      matrix[row][right] = num
      stack[num] = [row, right]
      num--
    }
    if (left < right && top < bottom) {
      for (let column = right - 1; column > left; column--) {
        matrix[bottom][column] = num
        stack[num] = [bottom, column]
        num--
      }
      for (let row = bottom; row > top; row--) {
        matrix[row][left] = num
        stack[num] = [row, left]
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
