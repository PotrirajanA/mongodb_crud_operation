import React, { useEffect, useState } from 'react'
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"

const API_URL = "http://localhost:3000/api/users"

const App = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchUser = async(page=1, search="")=>{
    setLoading(true);
    try{
      const res = await axios.get(API_URL, {params:{page, limit:5, search}});
      setUsers(res.data.data)
      setPage(page);
      setTotalPage(res.data.totalPage);
    }
    catch(err){
      toast.error("failed to fetch error",err);
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchUser(page,search);
  },[page,search])


  return (
    <>
    <Toaster position='top-center' />
   <div className="w-full bg-gray-50 min-h-screen">
  <div className="max-w-xl mx-auto bg-amber-40 py-3">
    <h1 className="text-center font-bold text-xl text-white bg-blue-400 rounded-xl py-3">User Management</h1>

    <div className='mt-5'>
      <table className='w-full text-center bg-white rounded-sm overflow-hidden '>
        <thead >
          <tr className='bg-blue-50'>
            <td className='py-2 font-semibold text-blue-500 tracking-wider '>Name</td>
            <td className='py-2 font-semibold text-blue-500 tracking-wider '>Email</td>
            <td className='py-2 font-semibold text-blue-500 tracking-wider '>Age</td>
            <td className='py-2 font-semibold text-blue-500 tracking-wider '>Actions</td>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-100'>
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className='text-center'>Users Not Found...</td>
            </tr>
          ) : (
            users.map((user)=>(
              <tr key={user._id}>
                <td className='py-3 text-cyan-800 font-medium'>{user.name}</td>
                <td className='py-3 text-cyan-800 font-medium'>{user.email}</td>
                <td className='py-3 text-cyan-800 font-medium'>{user.age}</td>
                <td className='flex justify-center gap-3 items-center py-3'>
                  <button className='bg-green-500 px-2 rounded-sm text-white cursor-pointer'>Edit</button>
                  <button className='bg-red-500 px-2 rounded-sm text-white cursor-pointer'>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className='mt-4 text-center'>
        <div className='flex justify-center gap-5'>
          <button className='bg-gray-200 px-2 text-sm rounded-sm'>pre</button>
          <span className='text-gray-500 text-sm'>{page} / {totalPage}</span>
          <button className='bg-gray-200 px-2 text-sm rounded-sm'>next</button>
        </div>
      </div>
    </div>
  </div>
</div>
    </>
  )
}

export default App
