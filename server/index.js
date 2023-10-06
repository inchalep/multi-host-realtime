const {
  getStage,
  stageExists,
  createStage,
  createStageParticipantToken,
} = require("./utils");

const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const { v4: uuid4 } = require("uuid");

const items = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
];
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.get("/api/items", (req, res) => {
  res.json(items);
});

app.get("/", (req, res) => {
  res.json("hello world");
});

app.post("/api/stage-token", async (req, res) => {
  try {
    if (req.method == "POST") {
      const body = req.body;
      console.log(body, "body");
      const username = body.username;
      const stageName = body.stageName;
      const userId = uuid4();
      let token = await createStageParticipantToken(
        stageName,
        userId,
        username
      );
      return res.status(200).json({ message: "success", data: token });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/api/stage", async (req, res) => {
  try {
    if (req.method == "POST") {
      const body = req.body;
      const stageName = body.name;
      let stage = stageExists(stageName)
        ? getStage(stageName)
        : await createStage(stageName);
      return res.status(200).json({ message: "success", data: stage });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

