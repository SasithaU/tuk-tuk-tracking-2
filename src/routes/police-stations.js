const express = require("express");
const router = express.Router();
const {
  listPoliceStations,
  getPoliceStationById,
} = require("../controllers/policeStationController");

/**
 * @swagger
 * /police-stations:
 *   get:
 *     summary: Get all police stations
 *     description: Retrieve a list of all police stations. Can be filtered by districtId or provinceId
 *     tags: [Police Stations]
 *     parameters:
 *       - name: districtId
 *         in: query
 *         required: false
 *         description: Filter police stations by district ID
 *         schema:
 *           type: string
 *       - name: provinceId
 *         in: query
 *         required: false
 *         description: Filter police stations by province ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Police stations listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PoliceStation'
 *       500:
 *         description: Internal server error
 */
router.get("/", listPoliceStations);

/**
 * @swagger
 * /police-stations/{id}:
 *   get:
 *     summary: Get police station by ID
 *     description: Retrieve a specific police station by its ID
 *     tags: [Police Stations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Police Station ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Police station details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PoliceStation'
 *       404:
 *         description: Police station not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getPoliceStationById);

module.exports = router;
