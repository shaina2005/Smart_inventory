import Help from "../model/HelpRequest.js";

export const addHelpRequest = async (req, res) => {
  try {
    const { email, title, description, screenshots } = req.body;

    // const screenshotArray = screenshots ? [screenshots] : [];

    const newRequest = new Help({
      email,
      title,
      description,
      screenshots,
    });

    await newRequest.save();

    res.status(200).json({
      message: "Submitted. Thanks for feedback!",
      color: "green",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Submission Failed. Please try again!",
      color: "red",
    });
  }
};

export const getHelpRequests = async (req, res) => {
  try {
    const requests = await Help.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching requests", error });
  }
};
