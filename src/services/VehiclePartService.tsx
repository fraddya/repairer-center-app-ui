const apiUrl = process.env.REACT_APP_API_URL;

export interface Brand {
  id: number;
  name: string;
}

export interface VehiclePart {
  id?: number;
  partCode: string;
  name: string;
  price: number;
  description: string;
  brand: Brand;
  status?: string;
}

// Fetch suggestions for vehicle parts based on brand ID
export const fetchVehiclePartSuggestions = async (brandId: number): Promise<VehiclePart[]> => {
  const response = await fetch(`${apiUrl}/vehicleParts/suggestions/${brandId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch vehicle part suggestions');
  }

  const data = await response.json();
  return data.content;
};

// Create a new vehicle part
export const createVehiclePart = async (newVehiclePart: Partial<VehiclePart>): Promise<VehiclePart> => {
  const response = await fetch(`${apiUrl}/vehicleParts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newVehiclePart),
  });

  if (!response.ok) {
    throw new Error('Failed to create vehicle part');
  }

  const data = await response.json();
  return data.content;
};

// Update an existing vehicle part
export const updateVehiclePart = async (id: number, updatedVehiclePart: Partial<VehiclePart>): Promise<VehiclePart> => {
  const response = await fetch(`${apiUrl}/vehicleParts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedVehiclePart),
  });

  if (!response.ok) {
    throw new Error('Failed to update vehicle part');
  }

  const data = await response.json();
  return data.content;
};
