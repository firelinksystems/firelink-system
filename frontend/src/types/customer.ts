export interface Customer {
  id: string;
  companyName?: string;
  contactName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postcode?: string;
  country: string;
  vatNumber?: string;
  createdAt: string;
  updatedAt: string;
  jobCount?: number;
  lastJob?: string;
}

export interface CreateCustomerData {
  companyName?: string;
  contactName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postcode?: string;
  country?: string;
  vatNumber?: string;
}

export interface UpdateCustomerData {
  companyName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postcode?: string;
  vatNumber?: string;
}

export interface CustomerFilters {
  search?: string;
  page: number;
  limit: number;
}
