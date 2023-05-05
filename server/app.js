const express = require("express");
const fs = require("fs/promises");

const app = express();
const port = 3000;
const dbFilePath = "./db.json";

app.use(express.json());

// Get list of people
app.get("/api/people", async (req, res) => {
	try {
		const data = JSON.parse(await fs.readFile(dbFilePath, "utf8"));

		return res.json(data);
	} catch (error) {
		console.log(error);
		return res.status(500).send("Internal Server Error");
	}
});

// Add new data to the JSON file
app.post("/api/people", async (req, res) => {
	try {
		const jsonData = JSON.parse(await fs.readFile(dbFilePath, "utf8"));
		const incomingData = req.body;

		// Add id field to incoming data
		req.body.id = jsonData[jsonData.length - 1].id + 1;

		jsonData.push(incomingData);

		await fs.writeFile(dbFilePath, JSON.stringify(jsonData));

		return res.status(201).send("Data appended successfully");
	} catch (error) {
		console.log(error);
		return res.status(500).send("Internal Server Error");
	}
});

// Delete user from JSON file
app.post("/api/people/delete", async (req, res) => {
	try {
		const jsonData = JSON.parse(await fs.readFile(dbFilePath, "utf8"));
		const filteredData = jsonData.filter(user => user.id !== req.body.id);

      if (!jsonData.find(user => user.id === req.body.id)) return res.status(404).send("Could not find the user. Invalid Id");

		await fs.writeFile(dbFilePath, JSON.stringify(filteredData));

		return res.status(201).send("User removed successfully");
	} catch (error) {
		console.log(error);
		return res.status(500).send("Internal Server Error");
	}
});

// Update data in database based on user id
app.post("/api/people/update", async (req, res) => {
	try {
		const jsonData = JSON.parse(await fs.readFile(dbFilePath, "utf8"));
		const userIdx = jsonData.findIndex(obj => obj.id === req.body.id);

      if (userIdx === -1) return res.status(404).send("Could not find the user. Invalid Id");

      jsonData[userIdx] = req.body;

		await fs.writeFile(dbFilePath, JSON.stringify(jsonData));

		return res.status(201).send("User updated successfully");
	} catch (error) {
		console.log(error);
		return res.status(500).send("Internal Server Error");
	}
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
