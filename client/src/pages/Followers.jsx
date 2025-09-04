import React, { useContext, useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader";

const Followers = () => {
  const { followers, getFollowers, setSelectedUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

   const fetchFollowers = async () => {
       setLoading(true)   
       await getFollowers();
       setLoading(false);
   }

  useEffect(() => {
      fetchFollowers();
  }, []);

  
  if (loading) return <Loader/>

  return (
    <div className="h-full p-5 max-w-2xl mx-auto overflow-y-scroll">
      <h2 className="text-2xl font-bold mb-5">Followers</h2>
      <div className="flex flex-col gap-3">
        {
        followers && followers.length > 0 &&
        followers.map((user) => (
          <UserCard key={user._id} user={user} setSelectedUser={setSelectedUser} />
        ))} 
      </div>
    </div>
  );
};

export default Followers;
