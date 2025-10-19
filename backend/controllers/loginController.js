export const loginUser = (req, res) => {
  const { role, password } = req.body;

  if (role === "admin" && password === "1234") {
    res.status(200).json({ success: true, role, message: "Valid user" });
  } else if (role === "staff" && password === "9878") {
    res.status(200).json({ success: true, role, message: "Valid user" });
  } else {
    res.status(401).json({ success: false, message: "Invalid user" });
  }
};
