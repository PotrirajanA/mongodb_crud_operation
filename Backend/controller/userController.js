import Users from "../models/user.js";

// ALL USERS
export const getAllUser = async (req,res) =>{
    const {page=1, limit=5, search =""} = req.query;
    const query = {
        name : {$regex: search, $options: "i"},
    }; 

    const total = await Users.countDocuments(query);
    const users = await Users.find(query)
    .skip((page-1)*limit)
    .limit(Number(limit));
    res.json({
        data:users,
        total,
        totalPages : Math.ceil(total/limit),
    });  
};

// SINGLE USERS
export const getSingleUser = async (req,res) =>{
    const id = req.params.id;
    const user = await Users.findById(id);
    res.json({
        data:user
    });
};

// ADD USERS
export const addUsers = async (req,res)=>{
    const user = await Users.create(req.body);
    res.json(user);
};

// UPDATE USERS
export const updateUser = async(req,res)=>{
    const id = req.params.id;
    const user = await Users.findByIdAndUpdate(id, req.body, {new:true});
    res.json({
        data:user
    });
};

// DELETE USERS
export const deleteUser = async(req,res)=>{
    const id = req.params.id;
    await Users.findByIdAndDelete(id);
    res.json({message:"Data deleted Success..."});
};
