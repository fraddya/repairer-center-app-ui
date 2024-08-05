const apiUrl = process.env.REACT_APP_API_URL;

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  contactNo: string;
  dateJoin: any;
  age: number;
  genderType: string;
  nic: string;
  nationality: string;
  religion: string;
  userLogging: string;
  role: string;
  email: string;
  vehicle: Vehicle[];
}
interface Vehicle {
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
  }
  else if (response.status === 500) {
    throw new Error('Server Error');
  }
  // const { role } = await response.json();
  // localStorage.setItem('userRole', role);
  // console.log('Logged in user role:', role);
  // if (!response.ok) {
  //   throw new Error('Failed to log in');
  // }
  const data = await response.json();
  return data.content;
};
