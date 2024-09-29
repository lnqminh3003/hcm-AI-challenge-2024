const Query = require("../models/resultModel");
// {
//     "queryName": "query 2",
//     "user":  {
//         "id": "Bao",
//         "videoId": "123123",
//         "frameId": "456456"
//       }
//   }

const getUsersByQuery = async (req, res) => {
  try {
    const { queryName } = req.params; 

    const query = await Query.findOne({ queryName });

    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    res.status(200).json({ users: query.users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

const addUserToQuery = async (req, res) => {
  try {
    const { queryName, user } = req.body;

    if (!queryName || !user) {
      return res
        .status(400)
        .json({ message: "queryName and user are required" });
    }

    let query = await Query.findOne({ queryName });

    if (!query) {
      query = new Query({ queryName, users: new Map() });
    }

    user.time = new Date();

    query.users.set(user.id, user);

    await query.save();

    res.status(200).json({ message: "User added successfully", query });
  } catch (error) {
    console.error("Error adding user to query:", error);
    res.status(500).json({ message: "Error adding user to query" });
  }
};

module.exports = {
  getUsersByQuery,
  addUserToQuery,
};
