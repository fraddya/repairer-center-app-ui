import { JobStatus } from '../enums/JobStatus';

const apiUrl = process.env.REACT_APP_API_URL;

export interface Job {
  id: number;
  jobDateAndTime: string;
  jobStatus: JobStatus;
  jobDescription: string;
  estimateTime: number;
  estimatePrice: number;
  actualPrice: number;
  repairerItems: RepairerItem[];
  vehicle: Vehicle;
  status: string;
  customer: Customer;
  assignEmployee: Employee;
}

export interface RepairerItem {
  id: number;
  description: string;
  quantity: number;
  estimatePrice: number;
  status: string | null;
  part: Part;
}

export interface Part {
  id: number;
  partCode: string;
  name: string;
  price: number;
  brand: Brand;
}

export interface Brand {
  id: number;
  name: string;
  code: string;
  description: string;
}

export interface Vehicle {
  id: number;
  vehicleNo: string;
  model: string;
  year: string;
  color: string;
  type: string;
  description: string;
  brand: Brand;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  contactNo: string;
  age: number;
  genderType: string;
  email: string;
  role: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  contactNo: string;
  age: number;
  genderType: string;
  email: string;
  role: string;
}

export const fetchJobs = async (jobStatus: string): Promise<Job[]> => {
  const response = await fetch(`${apiUrl}/jobs?jobStatus=${jobStatus}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }

  const data = await response.json();
  return data.content;
};

export const fetchAllJobs = async (): Promise<Job[]> => {
  const response = await fetch(`${apiUrl}/jobs`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }

  const data = await response.json();
  return data.content;
};

export const updateJob = async (jobId: number, updatedJob: Partial<Job>): Promise<Job> => {
  const response = await fetch(`${apiUrl}/jobs/${jobId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedJob),
  });

  if (!response.ok) {
    throw new Error('Failed to update job');
  }

  const data = await response.json();
  return data.content;
};

export const assingJob = async (jobId: number, assignEmployeeId: number): Promise<Job> => {
  const response = await fetch(`${apiUrl}/jobs/${jobId}/adminAssign`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      assignEmployee: {
        id: assignEmployeeId,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to assign job');
  }

  const data = await response.json();
  return data.content;
};


