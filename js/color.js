document.addEventListener("DOMContentLoaded", () => {
    const savedColor = localStorage.getItem("appColor") || "#8d6cc6"; // Default color
    console.log("Saved color:", savedColor);
    document.body.style.setProperty("--app-color", savedColor); // Apply saved color
  });