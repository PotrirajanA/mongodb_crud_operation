import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const API_URL = "http://localhost:3000/api/users";

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({name:"",age:"",email:""});
  const [isEditing, setIsEditing] = useState(null);

  const fetchUser = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, {
        params: { page, limit: 5, search },
      });
      setUsers(res.data.data);
      setPage(page);
      setTotalPage(res.data.totalPages);
    } catch (err) {
      toast.error("failed to fetch error", err);
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = (e)=>{
    setSearch(e.target.value)
    setPage(1);
  }

  const handleReset = ()=>{
    setFormData({name:"",age:"",email:""});
    setShowForm(false);
  }

  const formShow =()=>{
    setFormData({name:"",age:"",email:""});
    setShowForm(true);
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();

    if(!formData.name || !formData.age || !formData.email){
      toast.error("All fields are required");
      return;
    }

    try{
     if(isEditing){
       const res = await axios.put(`${API_URL}/${isEditing}`, formData);
      toast.success("User create successfully...");
      setUsers(users.map((user)=> (user._id === isEditing ? res.data.data : user)))
      setIsEditing(null);
     }
     else{
       const res = await axios.post(API_URL, formData);
      toast.success("User create successfully...");
      setUsers([ ...users,res.data]);
     }
      setShowForm(false);
    }
    catch(err){
      toast.error("Something went wrong");
    }
  }

  const handleEdit=(user)=>{ 
    setFormData({name: user.name, email: user.email, age: user.age});
    setIsEditing(user._id);
    setShowForm(true)
  }

  const handleDelete = async (id)=>{
    if(!confirm("Are you sure delete user?")) return;
    try{
      await axios.delete(`${API_URL}/${id}`);
      toast.success("User Deleted Sucessfully");
      setUsers(users.filter((user)=> user._id !== id));
    }
    catch(err){
      toast.error("Faild to delete user"+err);
    }
  }

  useEffect(() => {
    fetchUser(page, search);
  }, [page, search]);

  return (
    <>
      <Toaster position="top-center" />
      <div className="w-full bg-gray-50 min-h-screen">
        <div className="max-w-xl mx-auto bg-amber-40 py-3">
          <h1 className="text-center font-bold text-xl text-white bg-blue-400 rounded-xl py-3">
            User Management
          </h1>

          <div className="flex flex-col sm:flex-row py-5 gap-3">
            <input type="text" placeholder="Search...." className="flex-1 border border-gray-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:border-none  focus:ring-blue-400 placeholder:text-gray-300 text-gray-500" value={search} onChange={handleSearch}/>
            <button className="px-4 bg-blue-400 rounded-lg text-white font-semibold cursor-pointer hover:bg-blue-500" onClick={formShow}>Add Data</button>
          </div>

          {showForm && (<div className="fixed inset-0 z-50 bg-gray-900 opacity-95 flex items-center justify-center">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md shadow-blue-400 ">
              <h2 className="font-semibold text-2xl text-center text-blue-500">{isEditing ? "Update User" : "Create New User"}</h2>
              
              <form className="flex flex-col gap-3 mt-6" onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" className="flex-1 border border-gray-400 p-2 rounded-lg focus:outline-none focus:border-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-500 text-gray-500" value={formData.name} onChange={(e)=>setFormData({...formData , name:e.target.value })} />
                <input type="text" placeholder="Email" className="flex-1 border border-gray-400 p-2 rounded-lg focus:outline-none focus:border-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-500 text-gray-500" value={formData.email} onChange={(e)=>setFormData({...formData , email:e.target.value })} />
                <input type="number" placeholder="Age" className="flex-1 border border-gray-400 p-2 rounded-lg focus:outline-none focus:border-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-500 text-gray-500" value={formData.age} onChange={(e)=>setFormData({...formData , age:e.target.value })} />

                <div className="flex gap-5 flex-row-reverse mt-3">
                  <button className="flex-1 bg-yellow-500 hover:bg-yellow-600 cursor-pointer p-1 rounded text-white font-semibold text-sm" onClick={handleReset}>Reset</button>
                  <button className="flex-1 bg-green-500 p-1 rounded text-white font-semibold hover:bg-green-600 cursor-pointer text-sm" type="submit">{isEditing ? "Update" : "Create"}</button>
                </div>
              </form>

            </div>
          </div>)}

          <div className="mt-5">
            {loading ? (
              <p className="mt-20 text-center text-xl text-blue-500">
                Loading...
              </p>
            ) : (
              <>
                <table className="w-full text-center bg-white rounded-sm overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-blue-50">
                      <td className="py-2 font-semibold text-blue-500 tracking-wider ">
                        Name
                      </td>
                      <td className="py-2 font-semibold text-blue-500 tracking-wider ">
                        Email
                      </td>
                      <td className="py-2 font-semibold text-blue-500 tracking-wider ">
                        Age
                      </td>
                      <td className="py-2 font-semibold text-blue-500 tracking-wider ">
                        Actions
                      </td>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center">
                          Users Not Found...
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="py-3 text-cyan-800 font-medium">
                            {user.name}
                          </td>
                          <td className="py-3 text-cyan-800 font-medium">
                            {user.email}
                          </td>
                          <td className="py-3 text-cyan-800 font-medium">
                            {user.age}
                          </td>
                          <td className="flex justify-center gap-3 items-center py-3">
                            <button className="bg-green-500 hover:bg-green-600 px-2 rounded-sm text-white cursor-pointer" onClick={()=> handleEdit(user)}>
                              Edit
                            </button>
                            <button className="bg-red-500 hover:bg-red-600  px-2 rounded-sm text-white cursor-pointer" onClick={()=>handleDelete(user._id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {totalPage > 1 && (
                  <div className="mt-4 text-center">
                    <div className="flex justify-center gap-5">
                      <button
                        className={`bg-gray-200 px-2 text-sm rounded-sm ${
                          page === 1
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer"
                        }`}
                        onClick={() => setPage(page - 1)}
                      >
                        pre
                      </button>
                      <span className="text-gray-500 text-sm">
                        {page} / {totalPage}
                      </span>
                      <button
                        className={`bg-gray-200 px-2 text-sm rounded-sm ${
                          page === totalPage
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer"
                        }`}
                        onClick={() => setPage(page + 1)}
                      >
                        next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
