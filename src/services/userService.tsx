const apiUrl = process.env.REACT_APP_API_URL;

export interface Vehicle {
  vehicleNo: string;
  model: string;
  year: string;
  color: string;
  type: string;
  description: string;
  brand: {
    id: number;
  };
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  contactNo: string;
  dateJoin: string;
  age: number;
  genderType: string;
  nic: string;
  nationality: string;
  religion: string;
  userLogging: string | null;
  role: string;
  email: string;
  passWord: string;
  vehicle: Vehicle[];
}

// Fetch all users with role EMPLOYEE
export const fetchEmployees = async (): Promise<User[]> => {
  const response = await fetch(`${apiUrl}/users?role=EMPLOYEE`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }

  const data = await response.json();
  return data.content;
};

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${apiUrl}/users?role=USER`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }

  const data = await response.json();
  return data.content;
};

// Fetch a user by ID
export const fetchUserById = async (id: number): Promise<User> => {
  const response = await fetch(`${apiUrl}/users/${id}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user with ID ${id}`);
  }

  const data = await response.json();
  return data.content;
};

// Create a new user
export const createUser = async (newUser: Partial<User>): Promise<User> => {
  const response = await fetch(`${apiUrl}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  const data = await response.json();
  return data.content;
};

// Update an existing user by ID
export const updateUser = async (id: number, updatedUser: Partial<User>): Promise<User> => {
  const response = await fetch(`${apiUrl}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedUser),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user with ID ${id}`);
  }

  const data = await response.json();
  return data.content;
};

// Log in a user
export const loginUser = async (email: string, passWord: string): Promise<User> => {
  const response = await fetch(`${apiUrl}/users/login`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, passWord }),
  });

  if (response.status === 400) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.validationFailures[0].message);
  } else if (response.status === 500) {
    throw new Error('Server Error');
  }

  const data = await response.json();
  return data.content;
};
