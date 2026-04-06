const axios = require("axios");

const analyzeTask = async (description) => {
  const text = description.toLowerCase();

  if (text.includes("urgent") || text.includes("asap") || text.includes("tomorrow")) {
    return { priority: "High" };
  } else if (text.includes("week") || text.includes("soon")) {
    return { priority: "Medium" };
  } else {
    return { priority: "Low" };
  }
};

module.exports = { analyzeTask };