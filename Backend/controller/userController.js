import Users from "../models/user.js";

// ALL USERS
export const getAllUser = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    const query = {
      name: { $regex: search, $options: "i" },
    };

    const total = await Users.countDocuments(query);
    const users = await Users.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.status(201).json({
      success: true,
      data: users,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `error:${err}`,
    });
  }
};

// SINGLE USERS
export const getSingleUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findById(id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `error:${err}`,
    });
  }
};

// ADD USERS
export const addUsers = async (req, res) => {
  try {
    const user = await Users.create(req.body);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `error:${err}`,
    });
  }
};

// UPDATE USERS
export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findByIdAndUpdate(id, req.body, { new: true });
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `error:${err}`,
    });
  }
};

// DELETE USERS
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    await Users.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "Data deleted Success...",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `error:${err}`,
    });
  }
};
