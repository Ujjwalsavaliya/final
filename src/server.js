const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(cors());

app.post('/feedback', (req, res) => {
    try {
        const feedbackData = req.body;
        
        // Create a new Excel workbook
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet([feedbackData]);

        // Add the worksheet to the workbook
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Feedback');

        // Define the file path
        const filePath = path.resolve(__dirname, `feedback_${Date.now()}.xlsx`);

        // Write the workbook to the local file system
        xlsx.writeFile(workbook, filePath);

        res.status(200).json({ message: 'Feedback successfully saved' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
