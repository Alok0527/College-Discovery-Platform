export interface College {
  id: string
  name: string
  slug: string
  city: string
  state: string
  location: string
  fees: number
  rating: number
  overview: string
  placementAverage: number | null
  placementHighest: number | null
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
  courses?: Course[]
  reviews?: Review[]
  cutoffs?: Cutoff[]
}

export interface Course {
  id: string
  collegeId: string
  name: string
  duration: number
  createdAt: Date
}

export interface Review {
  id: string
  collegeId: string
  userId: string | null
  rating: number
  comment: string
  createdAt: Date
}

export interface Cutoff {
  id: string
  collegeId: string
  exam: string
  branch: string
  category: string
  homeState: string | null
  openingRank: number | null
  closingRank: number
  year: number
  createdAt: Date
}

export interface CollegeFilters {
  search?: string
  city?: string
  state?: string
  location?: string
  minFees?: number
  maxFees?: number
  minRating?: number
  course?: string
  sortBy?: 'name' | 'fees' | 'rating'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  results: T[]
  currentPage: number
  totalPages: number
  totalResults: number
  limit: number
}

export interface PredictorInput {
  exam: string
  rank: number
  category?: string
  branch?: string
  homeState?: boolean
}

export interface PredictorResult {
  college: College
  branch: string
  closingRank: number
  chance: 'High' | 'Medium' | 'Low' | 'Not Recommended'
  exam: string
  year: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    message: string
  }
}

export interface CompareCollege {
  id: string
  name: string
  city: string
  state: string
  fees: number
  rating: number
  placementAverage: number | null
  placementHighest: number | null
  courses: string[]
}