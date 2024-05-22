const AWS = require('aws-sdk');
const axios = require('axios');

exports.handler = async (event) => {
    try {
        // Parse the incoming event body to extract the feedback data
        const feedbackData = JSON.parse(event.body);
        console.log('Received feedback:', feedbackData);

        // Save feedback data to AWS, for example, S3 bucket
        const s3 = new AWS.S3();
        const params = {
            Bucket: 'project4webapp', // Replace 'your-bucket-name' with your actual bucket name
            Key: `feedback/${Date.now()}.json`, // You can customize the key based on your preference
            Body: JSON.stringify(feedbackData),
            ContentType: 'application/json'
        };

        // Upload the feedback data to S3
        await s3.upload(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Feedback received successfully' })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' })
        };
    }
};
