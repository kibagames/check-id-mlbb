const axios = require("axios");

module.exports = async function(id, server) {
  if (!id) throw `Parameter 'id' cannot be empty`;
  if (!server) throw `Parameter 'server' cannot be empty`;
  
  try {
    const payload = {
      code: "MOBILE_LEGENDS",
      data: {
        userId: String(id),
        zoneId: String(server)
      }
    };
    
    let response = await axios.post("https://gopay.co.id/games/v1/order/user-account", payload, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
      }
    });

    let { message, data } = response.data;
    if (message !== "Success" && !data?.username) throw `Invalid ID Player or Server ID`;
    
    return {
      "in-game-nickname": data.username,
      "country": data.countryOrigin ? data.countryOrigin.toUpperCase() : "UNKNOWN"
    };
  } catch (e) {
    if (e.response && e.response.data && e.response.data.message) {
        throw e.response.data.message;
    }
    throw "Invalid ID Player or Server ID";
  }
}