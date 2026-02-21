const Adoptions = require("../models/Adoptions");

// CREATE Adoptions
const createAdoptions = async (data) => {
  try {
    const res = new Adoptions(data);
    const saved = await res.save();
    return { success: true, data: saved };
  } catch (error) {
    console.error("Create Adoptions Error:", error);
    return { success: false, error };
  }
};

// GET SINGLE Adoptions
const getAdoptionsByOne = async (query) => {
  try {
    const resData = await Adoptions.findOne(query).populate("userId");
    return resData ? { success: true, data: resData } : { success: false };
  } catch (error) {
    console.error("Get Adoptions Error:", error);
    return { success: false, error };
  }
};

// GET ALL Adoptions
const getAllAdoptions = async (query = {}) => {
  try {
    const resData = await Adoptions.find(query).sort({ createdAt: -1 }).populate("petId").populate("userId");
    return resData ? { success: true, data: resData } : { success: false };
  } catch (error) {
    console.error("Get All Adoptions Error:", error);
    return { success: false, error };
  }
};

// UPDATE Adoptions
const updateAdoptions = async (id, updateData) => {
  try {
    const resData = await Adoptions.findByIdAndUpdate({ _id: id }, updateData, {
      new: true,
    }).populate("petId").populate("userId");
    return resData ? { success: true, data: resData } : { success: false };
  } catch (error) {
    console.error("Update Adoptions Error:", error);
    return { success: false, error };
  }
};

// DELETE Adoptions
const deleteAdoptions = async (id) => {
  try {
    const resData = await Adoptions.findByIdAndDelete({ _id: id });
    return { success: !!resData };
  } catch (error) {
    console.error("Delete Adoptions Error:", error);
    return { success: false, error };
  }
};

module.exports = {
  createAdoptions,
  getAdoptionsByOne,
  getAllAdoptions,
  updateAdoptions,
  deleteAdoptions,
};
