const express = require("express");
const router = express.Router();
const {
  listVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleLocations,
} = require("../controllers/vehicleController");
const { requireAdmin } = require("../middleware/auth");

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Get all vehicles
 *     description: Retrieve a list of all vehicles. Can be filtered by status, driverId, or registrationNumber
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         required: false
 *         description: Filter vehicles by status (e.g., active, inactive)
 *         schema:
 *           type: string
 *       - name: driverId
 *         in: query
 *         required: false
 *         description: Filter vehicles by driver ID
 *         schema:
 *           type: string
 *       - name: registrationNumber
 *         in: query
 *         required: false
 *         description: Filter vehicles by registration number
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicles listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 *       500:
 *         description: Internal server error
 */
router.get("/", listVehicles);

/**
 * @swagger
 * /vehicles/{id}:
 *   get:
 *     summary: Get vehicle by ID
 *     description: Retrieve a specific vehicle by its ID with driver information
 *     tags: [Vehicles]
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
 *         description: Vehicle details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getVehicleById);

/**
 * @swagger
 * /vehicles/{id}/locations:
 *   get:
 *     summary: Get vehicle locations
 *     description: Retrieve location history for a specific vehicle
 *     tags: [Vehicles]
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
 *         description: Vehicle locations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Location'
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id/locations", getVehicleLocations);

/**
 * @swagger
 * /vehicles:
 *   post:
 *     summary: Create a new vehicle
 *     description: Create a new vehicle (Admin only)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registrationNumber
 *               - deviceId
 *             properties:
 *               registrationNumber:
 *                 type: string
 *               deviceId:
 *                 type: string
 *               driverId:
 *                 type: string
 *               status:
 *                 type: string
 *                 default: active
 *               color:
 *                 type: string
 *               manufacturerYear:
 *                 type: number
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Bad request or duplicate vehicle
 *       500:
 *         description: Internal server error
 */
router.post("/", requireAdmin, createVehicle);

/**
 * @swagger
 * /vehicles/{id}:
 *   put:
 *     summary: Update a vehicle
 *     description: Update vehicle details (Admin only)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Vehicle ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               registrationNumber:
 *                 type: string
 *               deviceId:
 *                 type: string
 *               driverId:
 *                 type: string
 *               status:
 *                 type: string
 *               color:
 *                 type: string
 *               manufacturerYear:
 *                 type: number
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", requireAdmin, updateVehicle);

/**
 * @swagger
 * /vehicles/{id}:
 *   delete:
 *     summary: Delete a vehicle
 *     description: Delete a vehicle and related data (Admin only)
 *     tags: [Vehicles]
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
 *         description: Vehicle deleted successfully
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", requireAdmin, deleteVehicle);

module.exports = router;
