const apiUrl = process.env.REACT_APP_API_URL;

export interface User {
  id: number;
  name: string;
  email: string;
  // Add other user fields as needed
}

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${apiUrl}/employees`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  const data = await response.json();
  return data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await fetch(`${apiUrl}/users/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user with id ${id}`);
  }
  const data = await response.json();
  return data;
};

export const createUser = async (user: User): Promise<User> => {
  const response = await fetch(`${apiUrl}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  const data = await response.json();
  return data;
};

export const updateUser = async (id: number, user: User): Promise<User> => {
  const response = await fetch(`${apiUrl}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error(`Failed to update user with id ${id}`);
  }
  const data = await response.json();
  return data;
};

export const deleteUser = async (id: number): Promise<void> => {
  const response = await fetch(`${apiUrl}/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete user with id ${id}`);
  }
};
