import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse, College } from '@/types/college'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: 'College ID is required' },
      }
      return NextResponse.json(response, { status: 400 })
    }

    const college = await prisma.college.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        courses: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        cutoffs: {
          orderBy: { year: 'desc' },
          take: 50,
        },
      },
    })

    if (!college) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: 'College not found' },
      }
      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<College> = {
      success: true,
      data: college as unknown as College,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching college:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: { message: 'Something went wrong while loading the college' },
    }
    return NextResponse.json(response, { status: 500 })
  }
}