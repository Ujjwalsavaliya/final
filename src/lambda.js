const AWS = require('aws-sdk');
const xlsx = require('xlsx');

const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        // Parse the incoming event body to extract the feedback data
        const feedbackData = JSON.parse(event.body);

        // Create a new Excel workbook
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet([feedbackData]);

        // Add the worksheet to the workbook
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Feedback');

        // Generate a buffer from the workbook
        const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Define the S3 bucket and key (file name)
        const bucketName = 'aws-feedback-bucket';
        const key = `feedback_${Date.now()}.xlsx`;

        // Upload the buffer to S3
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: buffer,
            ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };

        await s3.upload(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Feedback successfully saved' }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
};
