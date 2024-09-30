const { wss } = require('../index');
const Query = require("../models/resultModel");
const WebSocket = require('ws'); 

const sendUpdateToClients = (query, user) => {
    const usersArray = Array.from(query.users.values());
    const queryUpdate = { queryName: query.queryName, users: user };
    console.log("Sending update to clients:", queryUpdate);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(queryUpdate));
        }
    });
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

        sendUpdateToClients(query, user);

        res.status(200).json({ message: "User added successfully", query });
    } catch (error) {
        console.error("Error adding user to query:", error);
        res.status(500).json({ message: "Error adding user to query" });
    }
};

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

module.exports = {
    getUsersByQuery,
    addUserToQuery,
};
