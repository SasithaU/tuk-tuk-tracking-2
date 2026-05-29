const express = require("express");
const router = express.Router();
const {
  listDistricts,
  getDistrictById,
  getStationsByDistrict,
} = require("../controllers/districtController");

/**
 * @swagger
 * /districts:
 *   get:
 *     summary: Get all districts
 *     description: Retrieve a list of all districts. Can be filtered by provinceId
 *     tags: [Districts]
 *     parameters:
 *       - name: provinceId
 *         in: query
 *         required: false
 *         description: Filter districts by province ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Districts listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/District'
 *       500:
 *         description: Internal server error
 */
router.get("/", listDistricts);

/**
 * @swagger
 * /districts/{id}:
 *   get:
 *     summary: Get district by ID
 *     description: Retrieve a specific district by its ID
 *     tags: [Districts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: District ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: District details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/District'
 *       404:
 *         description: District not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getDistrictById);

/**
 * @swagger
 * /districts/{id}/stations:
 *   get:
 *     summary: Get police stations in a district
 *     description: Retrieve all police stations that are located in a specific district
 *     tags: [Districts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: District ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Police stations for district retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PoliceStation'
 *       500:
 *         description: Internal server error
 */
router.get("/:id/stations", getStationsByDistrict);

module.exports = router;
