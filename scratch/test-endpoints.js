require("dotenv").config();
const http = require("http");
const app = require("../app");

const PORT = 4567;
let server;

// Helper to wrap http requests in a Promise
const makeRequest = (path, method = "GET", body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const req = http.request(
      {
        host: "localhost",
        port: PORT,
        path: path,
        method: method,
        headers: headers,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            resolve({
              statusCode: res.statusCode,
              body: JSON.parse(data),
            });
          } catch (e) {
            resolve({
              statusCode: res.statusCode,
              body: data,
            });
          }
        });
      }
    );

    req.on("error", (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  // Start server locally on port 4567
  server = app.listen(PORT, async () => {
    console.log(`Test server running on port ${PORT}...`);
    try {
      let token = null;

      console.log("\n--- Testing Authentication ---");
      const loginRes = await makeRequest("/api/v1/auth/login", "POST", {
        username: "admin",
        password: "Admin@123",
      });
      console.log("POST /api/v1/auth/login Status:", loginRes.statusCode);
      if (loginRes.statusCode === 200 && loginRes.body.success) {
        token = loginRes.body.data.token;
        console.log("✅ Login successful, token obtained.");
      } else {
        console.log("❌ Login failed:", loginRes.body);
      }

      console.log("\n--- Testing Public/Unprotected Routes ---");
      const healthRes = await makeRequest("/api/v1/health");
      console.log("GET /api/v1/health Status:", healthRes.statusCode, healthRes.body.success ? "✅" : "❌");

      const provincesRes = await makeRequest("/api/v1/provinces");
      console.log("GET /api/v1/provinces Status:", provincesRes.statusCode, provincesRes.body.success ? "✅" : "❌");

      const vehiclesRes = await makeRequest("/api/v1/vehicles");
      console.log("GET /api/v1/vehicles Status:", vehiclesRes.statusCode, vehiclesRes.body.success ? "✅" : "❌");

      console.log("\n--- Testing Authenticated Routes ---");
      if (token) {
        const Vehicle = require("../src/models/Vehicle");
        const sampleVehicle = await Vehicle.findOne();
        const vehicleId = sampleVehicle ? sampleVehicle._id.toString() : "";

        const districtsRes = await makeRequest("/api/v1/districts", "GET", null, token);
        console.log("GET /api/v1/districts Status:", districtsRes.statusCode, districtsRes.body.success ? "✅" : "❌");
        if (!districtsRes.body.success) console.log(districtsRes.body);

        const stationsRes = await makeRequest("/api/v1/police-stations", "GET", null, token);
        console.log("GET /api/v1/police-stations Status:", stationsRes.statusCode, stationsRes.body.success ? "✅" : "❌");
        if (!stationsRes.body.success) console.log(stationsRes.body);

        const driversRes = await makeRequest("/api/v1/drivers", "GET", null, token);
        console.log("GET /api/v1/drivers Status:", driversRes.statusCode, driversRes.body.success ? "✅" : "❌");
        if (!driversRes.body.success) console.log(driversRes.body);

        const locationsRes = await makeRequest(`/api/v1/locations/history?vehicleId=${vehicleId}`, "GET", null, token);
        console.log("GET /api/v1/locations/history Status:", locationsRes.statusCode, locationsRes.body.success ? "✅" : "❌");
        if (!locationsRes.body.success) console.log(locationsRes.body);

        const latestLocationsRes = await makeRequest("/api/v1/locations/latest", "GET", null, token);
        console.log("GET /api/v1/locations/latest Status:", latestLocationsRes.statusCode, latestLocationsRes.body.success ? "✅" : "❌");
        if (!latestLocationsRes.body.success) console.log(latestLocationsRes.body);

        if (vehicleId) {
          const vehicleLatestRes = await makeRequest(`/api/v1/locations/vehicle/${vehicleId}`, "GET", null, token);
          console.log(`GET /api/v1/locations/vehicle/${vehicleId} Status:`, vehicleLatestRes.statusCode, vehicleLatestRes.body.success ? "✅" : "❌");
          if (!vehicleLatestRes.body.success) console.log(vehicleLatestRes.body);
        }
      } else {
        console.log("⚠️ Skipping authenticated tests due to missing token.");
      }

    } catch (error) {
      console.error("Test execution failed:", error);
    } finally {
      console.log("\nClosing test server...");
      server.close(() => {
        console.log("Test server closed.");
        process.exit(0);
      });
    }
  });
};

runTests();
