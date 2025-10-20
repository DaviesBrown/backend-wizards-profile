import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/me", async (req, res) => {
  try {
    const  response = await axios.get("https://catfact.ninja/fact", { timeout: 5000 });
    const timestamp = new Date().toISOString();
    const fact = response.data.fact;
    const data = {
      status: "success",
      user: {
        email: "nwosudavid77@gmail.com",
        name: "Nwosu David",
        stack: "Node.js/Express"
      },
      timestamp,
      fact
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      status: "Error",
      message: "Unable to get cat facts",
      timestamp: new Date().toISOString()
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
