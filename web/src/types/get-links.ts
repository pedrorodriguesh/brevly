export interface GetLinksResponse {
  links: Links[]
}

interface Links {
  shortCode: string
  fullUrl: string
  accessCount: number
}
