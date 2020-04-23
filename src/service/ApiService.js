import axios from 'axios';

const API_BASE_URL = 'https://us-central1-my-project-test-273106.cloudfunctions.net/WeatherReport';

class ApiService {

    fetchWeatherReport(zip, weeksBehind) {
        return axios.get(API_BASE_URL + "?zip=" + zip + "&weeksBehind=" + weeksBehind);
    }
}

export default new ApiService();