import axios from 'axios';

const testProfile = async () => {
    try {
        // Replace with your actual token from localStorage
        const token = 'YOUR_TOKEN_HERE';
        
        const response = await axios.get('http://localhost:3000/api/lecturer/profile', {
            headers: {
                'token': token,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
};

testProfile();
