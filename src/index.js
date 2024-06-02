import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'; // Custom styles

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
            const response = await axios.post('https://vzhdec3bqw3rakhf2u6mbp3kgu0dvcwz.lambda-url.ap-southeast-2.on.aws/', feedbackData);
            if (response.status === 200) {
                alert('Feedback successfully saved');
            } else {
                throw new Error('Failed to save feedback');
            }
    
            // Reset feedback data after successful submission
            setFeedbackData({
                name: '',
                email: '',
                options: [],
                rating: '1'
            });
        } catch (error) {
            console.error('Error sending feedback data:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="container">
            <h1 className="mt-5">Airport Information</h1>
            {airportInfo ? (
                <ul className="list-group">
                    <li className="list-group-item">Name: <a href="https://www.townsvilleairport.com.au/">{Airport_name}</a></li>
                    <li className="list-group-item">City: {airportInfo.city}</li>
                    <li className="list-group-item">Country: {airportInfo.country}</li>
                    <li className="list-group-item">Region: {airportInfo.region}</li>
                    <li className="list-group-item">IATA: {airportInfo.iata}</li>
                </ul>
            ) : (
                <p className="text-danger">Error fetching airport information</p>
            )}

            <h1 className="mt-5">Airlines Information</h1>
            {airlineInfo ? (
                <div className="card">
                    <img src="https://api-ninjas.com/images/airline_logos/virgin_australia.jpg" className="card-img-top" alt="Virgin Australia" />
                    <div className="card-body">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">Name: <a href='https://www.virginaustralia.com/au'>{airlineInfo.name}</a></li>
                            <li className="list-group-item">IATA: {airlineInfo.iata}</li>
                            <li className="list-group-item">ICAO: {airlineInfo.icao}</li>
                            <li className="list-group-item">
                                Fleet:
                                <ul>
                                    {airlineInfo.fleet && Object.entries(airlineInfo.fleet).map(([aircraft, count]) => (
                                        <li key={aircraft}>{aircraft}: {count}</li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            ) : (
                <p className="text-danger">Error fetching airline information</p>
            )}

            <h1 className="mt-5">How Virgin Australia can make service Better?</h1>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" className="form-control" id="name" name="name" value={feedbackData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" className="form-control" id="email" name="email" value={feedbackData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="options">What do you want to Rate:</label>
                    <select className="form-control" id="options" name="options" value={feedbackData.options} onChange={handleChange} multiple>
                        <option value="wifi">In-flight WiFi</option>
                        <option value="meals">Meal Options</option>
                        <option value="legroom">Extra Legroom</option>
                        <option value="entertainment">Entertainment System</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="rating">Rating:</label>
                    <select className="form-control" id="rating" name="rating" value={feedbackData.rating} onChange={handleChange}>
                        {[1, 2, 3, 4, 5].map(value => (
                            <option key={value} value={value}>{value} Star</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
