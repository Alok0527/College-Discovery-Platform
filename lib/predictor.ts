export const VALID_EXAMS: string[] = ['JEE Main', 'JEE Advanced']

export const VALID_CATEGORIES: string[] = ['General', 'OBC', 'SC', 'ST']

export const VALID_BRANCHES: string[] = [
  'Computer Science and Engineering',
  'Electronics and Communication Engineering',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Information Technology',
  'Biotechnology',
]

export type Chance = 'High' | 'Medium' | 'Low' | 'Not Recommended'

export function calculateChance(
  studentRank: number,
  closingRank: number
): Chance {
  if (studentRank <= closingRank * 0.7) {
    return 'High'
  }
  if (studentRank <= closingRank) {
    return 'Medium'
  }
  if (studentRank <= closingRank * 1.15) {
    return 'Low'
  }
  return 'Not Recommended'
}