const express = require("express");
const router = express.Router();
const {
  listDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
} = require("../controllers/driverController");
const { requireAdmin } = require("../middleware/auth");

/**
 * @swagger
 * /drivers:
 *   get:
 *     summary: Get all drivers
 *     description: Retrieve a list of all drivers. Can be filtered by status, licenseNumber, or contactNumber
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         required: false
 *         description: Filter drivers by status (e.g., active, inactive)
 *         schema:
 *           type: string
 *       - name: licenseNumber
 *         in: query
 *         required: false
 *         description: Filter drivers by license number
 *         schema:
 *           type: string
 *       - name: contactNumber
 *         in: query
 *         required: false
 *         description: Filter drivers by contact number
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Drivers listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Driver'
 *       500:
 *         description: Internal server error
 */
router.get("/", listDrivers);

/**
 * @swagger
 * /drivers/{id}:
 *   get:
 *     summary: Get driver by ID
 *     description: Retrieve a specific driver by their ID with vehicle information
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Driver ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Driver details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getDriverById);

/**
 * @swagger
 * /drivers:
 *   post:
 *     summary: Create a new driver
 *     description: Create a new driver (Admin only)
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - licenseNumber
 *               - contactNumber
 *               - dateOfBirth
 *               - licenseExpiryDate
 *             properties:
 *               name:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               vehicleId:
 *                 type: string
 *               address:
 *                 type: string
 *               emergencyContact:
 *                 type: string
 *               status:
 *                 type: string
 *                 default: active
 *               licenseExpiryDate:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Driver created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       400:
 *         description: Bad request or duplicate license number
 *       500:
 *         description: Internal server error
 */
router.post("/", requireAdmin, createDriver);

/**
 * @swagger
 * /drivers/{id}:
 *   put:
 *     summary: Update a driver
 *     description: Update driver details (Admin only)
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Driver ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               vehicleId:
 *                 type: string
 *               address:
 *                 type: string
 *               emergencyContact:
 *                 type: string
 *               status:
 *                 type: string
 *               licenseExpiryDate:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Driver updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", requireAdmin, updateDriver);

/**
 * @swagger
 * /drivers/{id}:
 *   delete:
 *     summary: Delete a driver
 *     description: Delete a driver and related data (Admin only)
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Driver ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Driver deleted successfully
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", requireAdmin, deleteDriver);

module.exports = router;
