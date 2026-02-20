// service/pet.service.js
const Pet = require("../models/Pet");
let savePet = async (data) => {
  try {
    let resData = await new Pet(data);
    let res = await resData.save();
    return res ? { success: true, data: res } : { success: false };
  } catch (error) {
    console.log("Error saving pet", error);
    return { success: false, error };
  }
};

// find pet
let findPetByOne = async (query) => {
  try {
    let resData = await Pet.findOne(query).lean();
    return resData ? { success: true, data: resData } : { success: false };
  } catch (error) {
    console.log("Error finding pet", error);
    return { success: false, error };
  }
};

// get all pets (with pagination)
let getAllPet = async (filter, skip = 0, limit = 10) => {
  try {
    const resData = await Pet.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
      const total = await Pet.countDocuments(filter);

    return resData ? { success: true, data: resData, total } : { success: false };
  } catch (error) {
    console.log("Error fetching pets", error);
    return { success: false, error };
  }
};

// update pet
let updatePet = async (id, updateData) => {
  try {
    let resData = await Pet.findByIdAndUpdate({ _id: id }, updateData, {
      new: true,
    });
    return resData ? { success: true, data: resData } : { success: false };
  } catch (error) {
    console.log("Error updating pet", error);
    return { success: false, error };
  }
};

// delete pet
let deletePet = async (id) => {
  try {
    let resData = await Pet.findByIdAndDelete({ _id: id });
    return resData ? { success: true, data: resData } : { success: false };
  } catch (error) {
    console.log("Error deleting pet", error);
    return { success: false, error };
  }
};

module.exports = { savePet, getAllPet, findPetByOne, updatePet, deletePet };
