import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const App = () => {
    const [airportInfo, setAirportInfo] = useState(null);
    const [airlineInfo, setAirlineInfo] = useState(null);
    const [feedbackData, setFeedbackData] = useState({
        name: '',
        email: '',
        options: [],
        rating: '1'
    });

    const API_KEY = 'NaKZK/rxLDzWVNbXHk3ABg==oPjpM3crayXZDxdF';
    const Airport_name = 'Townsville Airport';
    const Airline_name = 'Virgin Australia';

    useEffect(() => {
        const fetchAirportInfo = async () => {
            try {
                const airportResponse = await axios.get(`https://api.api-ninjas.com/v1/airports?name=${Airport_name}`, {
                    headers: {
                        'X-Api-Key': API_KEY
                    }
                });
                setAirportInfo(airportResponse.data[0]);
            } catch (error) {
                console.error('Error fetching airport information:', error);
            }
        };

        const fetchAirlineInfo = async () => {
            try {
                const airlineResponse = await axios.get(`https://api.api-ninjas.com/v1/airlines?name=${Airline_name}`, {
                    headers: {
                        'X-Api-Key': API_KEY
                    }
                });
                setAirlineInfo(airlineResponse.data[0]);
            } catch (error) {
                console.error('Error fetching airline information:', error);
            }
        };

        fetchAirportInfo();
        fetchAirlineInfo();
    }, []);

    const handleChange = (event) => {
        const { name, value, type } = event.target;
        if (type === 'select-multiple') {
            const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
            setFeedbackData(prevState => ({ ...prevState, [name]: selectedOptions }));
        } else {
            setFeedbackData(prevState => ({ ...prevState, [name]: value }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Send feedback data to the backend
            const response = await axios.post('https://jcmrasg6xgawuifwkrrsjvgble0vciuh.lambda-url.ap-southeast-2.on.aws/', feedbackData);
            console.log('Response from backend:', response.data);
            // Reset feedback data after successful submission
            setFeedbackData({
                name: '',
                email: '',
                options: [],
                rating: '1'
            });
        } catch (error) {
            console.error('Error sending feedback data:', error);
        }
    };
    
    return (
        <div>
            <h1>Airport Information</h1>
            {airportInfo ? (
                <ul>
                    <li>Name: <a href="https://www.townsvilleairport.com.au/">{Airport_name}</a></li>
                    <li>City: {airportInfo.city}</li>
                    <li>Country: {airportInfo.country}</li>
                    <li>Region: {airportInfo.region}</li>
                    <li>IATA: {airportInfo.iata}</li>
                </ul>
            ) : (
                <p>Error fetching airport information</p>
            )}

            <h1>Airlines Information</h1>
            {airlineInfo ? (
                <ul>
                    <li>Name: <a href='https://www.virginaustralia.com/au'>{airlineInfo.name}</a></li>
                    <li>IATA: {airlineInfo.iata}</li>
                    <li>ICAO: {airlineInfo.icao}</li>
                    <li>Fleet:</li>
                    <ul>
                        {airlineInfo.fleet && Object.entries(airlineInfo.fleet).map(([aircraft, count]) => (
                            <li key={aircraft}>{aircraft}: {count}</li>
                        ))}
                    </ul>
                </ul>
            ) : (
                <p>Error fetching airline information</p>
            )}

            <h1>How Virgin Australia can make service Better?</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" onChange={handleChange} required /><br /><br />

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" onChange={handleChange} required /><br /><br />

                <label htmlFor="options">What do you want to Rate:</label>
                <select id="options" name="options" onChange={handleChange} multiple>
                    <option value="wifi">In-flight WiFi</option>
                    <option value="meals">Meal Options</option>
                    <option value="legroom">Extra Legroom</option>
                    <option value="entertainment">Entertainment System</option>
                </select><br /><br />

                <label htmlFor="rating">Rating:</label>
                <select id="rating" name="rating" onChange={handleChange}>
                    {[1, 2, 3, 4, 5].map(value => (
                        <option key={value} value={value}>{value} Star</option>
                    ))}
                </select><br /><br />

                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
