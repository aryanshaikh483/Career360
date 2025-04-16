const fs = require('fs');

// Path to your JSON file
const filePath = '../PersonalityData'; // Adjust the path as per your folder structure

try {
  // Read the JSON file
  const jsonData = fs.readFileSync(filePath, 'utf8');

  // Parse JSON data into JavaScript object or array
  const questions = JSON.parse(jsonData);

  // Now `questions` variable contains your JSON data as a JavaScript object or array
  console.log(questions);
} catch (err) {
  console.error('Error reading JSON file:', err);
}
