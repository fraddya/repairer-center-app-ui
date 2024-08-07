const apiUrl = process.env.REACT_APP_API_URL;

export interface Brand {
  id: number;
  name: string;
  code: string;
  description: string;
}

export const fetchBrands = async (): Promise<Brand[]> => {
    const response = await fetch(`${apiUrl}/brands/suggestions`, {
      method: 'GET',
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch Brands');
    }
  
    const data = await response.json();
    return data.content;
  };

  export const createBrand = async (newBrand: Partial<Brand>): Promise<Brand> => {
    const response = await fetch(`${apiUrl}/brands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBrand),
    });
  
    if (!response.ok) {
      throw new Error('Failed to Create brand');
    }
  
    const data = await response.json();
    return data.content;
  };


// export const createBrand = async (newBrand: Partial<Brand>): Promise<Brand> => {
//   const response = await axios.post(`${apiUrl}/brands`, newBrand);
//   return response.data;
// };

