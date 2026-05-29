const express = require("express");
const router = express.Router();
const {
  submitLocationPing,
  getLatestLocations,
  getVehicleLatestLocation,
  getLocationHistory,
  searchLocations,
} = require("../controllers/locationController");
const { allowDeviceAccess } = require("../middleware/auth");

/**
 * @swagger
 * /locations/ping:
 *   post:
 *     summary: Submit a location ping
 *     description: Submit a location ping from a device or authenticated user
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleId
 *               - latitude
 *               - longitude
 *             properties:
 *               vehicleId:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               accuracy:
 *                 type: number
 *               speed:
 *                 type: number
 *               heading:
 *                 type: number
 *               altitude:
 *                 type: number
 *               source:
 *                 type: string
 *                 default: GPS
 *               batteryLevel:
 *                 type: number
 *               networkType:
 *                 type: string
 *     responses:
 *       201:
 *         description: Location ping submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LocationPing'
 *       400:
 *         description: Bad request (missing required fields or invalid vehicle ID)
 *       500:
 *         description: Internal server error
 */
router.post("/ping", allowDeviceAccess, submitLocationPing);

/**
 * @swagger
 * /locations/latest:
 *   get:
 *     summary: Get latest locations for all vehicles
 *     description: Retrieve the most recent location for all vehicles with vehicle and driver information
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Latest locations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LastKnownLocation'
 *       500:
 *         description: Internal server error
 */
router.get("/latest", getLatestLocations);

/**
 * @swagger
 * /locations/vehicle/{id}:
 *   get:
 *     summary: Get latest location for a vehicle
 *     description: Retrieve the most recent location for a specific vehicle
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Vehicle ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle latest location retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LastKnownLocation'
 *       404:
 *         description: Vehicle not found or no location data available
 *       500:
 *         description: Internal server error
 */
router.get("/vehicle/:id", getVehicleLatestLocation);

/**
 * @swagger
 * /locations/history:
 *   get:
 *     summary: Get location history
 *     description: Retrieve location history for vehicles with pagination and filtering options
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: vehicleId
 *         in: query
 *         required: false
 *         description: Filter location history by vehicle ID
 *         schema:
 *           type: string
 *       - name: startDate
 *         in: query
 *         required: false
 *         description: Start date for location history (ISO 8601 format)
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: endDate
 *         in: query
 *         required: false
 *         description: End date for location history (ISO 8601 format)
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Location history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LocationPing'
 *       500:
 *         description: Internal server error
 */
router.get("/history", getLocationHistory);

/**
 * @swagger
 * /locations/search:
 *   get:
 *     summary: Search locations
 *     description: Search locations based on coordinates, distance, or other criteria
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: latitude
 *         in: query
 *         required: false
 *         description: Search latitude
 *         schema:
 *           type: number
 *       - name: longitude
 *         in: query
 *         required: false
 *         description: Search longitude
 *         schema:
 *           type: number
 *       - name: radius
 *         in: query
 *         required: false
 *         description: Search radius in kilometers
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Location search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LocationPing'
 *       500:
 *         description: Internal server error
 */
router.get("/search", searchLocations);

module.exports = router;
