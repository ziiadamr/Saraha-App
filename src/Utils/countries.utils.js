import axios from "axios";

export async function getCountryCode(ip) {
    const response = await fetch(`https://ipapi.co/${ip}/country_code/`);
    return response.data;
}