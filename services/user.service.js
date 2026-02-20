// service/user.service.js
const User = require("../models/User");
let saveUser = async (data) => {
  try {
    let resData = await new User(data);
    let res = await resData.save();
    return { success: true, data: res };
  } catch (error) {
    console.log("Error saving user", error);
    return { success: false, error };
  }
};

// find user
let getUserByOne = async (query) => {
  try {
    let resData = await User.findOne(query);
    return resData ? { success: true, data: resData } : { success: false };
  } catch (error) {
    console.log("Error finding user", error);
    return { success: false, error };
  }
};

let getUserById = async (id) => {
  try {
    let resData = await User.findById({ _id: id });
    return resData ? { success: true, data: resData } : { success: false };
  } catch (error) {
    console.log("Error finding user", error);
    return { success: false, error };
  }
};

// get all user by admin
let getAllUser = async (query) => {
  try {
    let resData = await User.find(query).lean();
    return { success: true, data: resData };
  } catch (error) {
    console.log("Error finding users", error);
    return { success: false, error };
  }
};

// userupdate
let updateUser = async (id, updateData) => {
  try {
    let resData = await User.findByIdAndUpdate({ _id: id }, updateData, {
      new: true,
    });
    return resData ? { success: true, data: resData } : { success: false };
  } catch (error) {
    console.log("Error updating user", error);
    return { success: false, error };
  }
};

module.exports = { saveUser, getAllUser, getUserByOne, getUserById ,updateUser};
