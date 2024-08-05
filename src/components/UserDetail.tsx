import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById, User } from '../services/userService';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(Number(id));
        setUser(data);
        setLoading(false);
      } catch (err : Error | any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user found</div>;
  }

  return (
    <div>
      <h1>User Detail</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      {/* Add other user fields as needed */}
    </div>
  );
};

export default UserDetail;
