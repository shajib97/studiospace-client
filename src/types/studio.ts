export interface Studio{
 _id: string;
 title: string;
 category: string;
 hourlyRate: number;
 location: string;
 imageUrl: string;
 rating: number;
 reviewCount: number;
}

export interface StudioDetails extends Studio {
  securityDeposit: number;
  maxCapacity: number;
  amenities: string[];
  overview: string;
  ownerName: string;
  gallery?: string[];
  reviews?: {
  name: string;
  rating: number;
  comment: string;
}[];
}