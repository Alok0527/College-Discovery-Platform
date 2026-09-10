import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse, CompareCollege } from '@/types/college'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const idsParam = searchParams.get('ids')

    if (!idsParam) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: 'College IDs are required' },
      }
      return NextResponse.json(response, { status: 400 })
    }

    const ids = idsParam.split(',').map((id) => id.trim()).filter(Boolean)

    if (ids.length < 2) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: 'At least 2 college IDs are required' },
      }
      return NextResponse.json(response, { status: 400 })
    }

    if (ids.length > 3) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: 'Maximum 3 colleges can be compared' },
      }
      return NextResponse.json(response, { status: 400 })
    }

    const uniqueIds = [...new Set(ids)]
    if (uniqueIds.length !== ids.length) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: 'Duplicate colleges are not allowed' },
      }
      return NextResponse.json(response, { status: 400 })
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: uniqueIds } },
      include: {
        courses: {
          select: { name: true },
        },
      },
    })

    if (colleges.length !== uniqueIds.length) {
      const foundIds = colleges.map((c) => c.id)
      const missingIds = uniqueIds.filter((id) => !foundIds.includes(id))
      const response: ApiResponse<null> = {
        success: false,
        error: { message: `Invalid college IDs: ${missingIds.join(', ')}` },
      }
      return NextResponse.json(response, { status: 400 })
    }

    const compareData: CompareCollege[] = colleges.map((college) => ({
      id: college.id,
      name: college.name,
      city: college.city,
      state: college.state,
      fees: college.fees,
      rating: college.rating,
      placementAverage: college.placementAverage,
      placementHighest: college.placementHighest,
      courses: college.courses.map((c) => c.name),
    }))

    const response: ApiResponse<CompareCollege[]> = {
      success: true,
      data: compareData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in compare:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: { message: 'Something went wrong while comparing colleges' },
    }
    return NextResponse.json(response, { status: 500 })
  }
}