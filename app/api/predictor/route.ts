import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse, PredictorInput, PredictorResult, College } from '@/types/college'

const VALID_EXAMS = ['JEE Main', 'JEE Advanced']
const VALID_CATEGORIES = ['General', 'OBC', 'SC', 'ST']
const VALID_BRANCHES = [
  'Computer Science and Engineering',
  'Electronics and Communication Engineering',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Information Technology',
  'Biotechnology',
]

function calculateChance(studentRank: number, closingRank: number): 'High' | 'Medium' | 'Low' | 'Not Recommended' {
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

export async function POST(request: NextRequest) {
  try {
    const body: PredictorInput = await request.json()

    const { exam, rank, category, branch } = body

    if (!exam || typeof exam !== 'string') {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: 'Exam is required' },
      }
      return NextResponse.json(response, { status: 400 })
    }

    if (!VALID_EXAMS.includes(exam)) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: `Invalid exam. Supported exams: ${VALID_EXAMS.join(', ')}` },
      }
      return NextResponse.json(response, { status: 400 })
    }

    if (!rank || typeof rank !== 'number' || !Number.isInteger(rank)) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: 'Valid integer rank is required' },
      }
      return NextResponse.json(response, { status: 400 })
    }

    if (rank <= 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: 'Rank must be a positive number' },
      }
      return NextResponse.json(response, { status: 400 })
    }

    if (rank > 1000000) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: 'Rank is too large' },
      }
      return NextResponse.json(response, { status: 400 })
    }

    const validCategory = category && VALID_CATEGORIES.includes(category) ? category : 'General'

    if (branch && !VALID_BRANCHES.includes(branch)) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: `Invalid branch. Supported branches: ${VALID_BRANCHES.join(', ')}` },
      }
      return NextResponse.json(response, { status: 400 })
    }

    const cutoffWhere: Record<string, unknown> = {
      exam,
      category: validCategory,
      year: 2024,
    }

    if (branch) {
      cutoffWhere.branch = branch
    }

    const cutoffs = await prisma.cutoff.findMany({
      where: cutoffWhere,
      include: {
        college: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            state: true,
            location: true,
            fees: true,
            rating: true,
            placementAverage: true,
            placementHighest: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { closingRank: 'asc' },
      take: 20,
    })

    if (cutoffs.length === 0) {
      const response: ApiResponse<PredictorResult[]> = {
        success: true,
        data: [],
      }
      return NextResponse.json(response)
    }

    const results: PredictorResult[] = cutoffs
      .filter((cutoff) => cutoff.closingRank > 0)
      .map((cutoff) => ({
        college: cutoff.college as unknown as College,
        branch: cutoff.branch,
        closingRank: cutoff.closingRank,
        chance: calculateChance(rank, cutoff.closingRank),
        exam: cutoff.exam,
        year: cutoff.year,
      }))
      .filter((result) => result.chance !== 'Not Recommended')
      .slice(0, 10)

    const response: ApiResponse<PredictorResult[]> = {
      success: true,
      data: results,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in predictor:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: { message: 'Something went wrong while predicting colleges' },
    }
    return NextResponse.json(response, { status: 500 })
  }
}