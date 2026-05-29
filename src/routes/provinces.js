const express = require("express");
const router = express.Router();
const {
  listProvinces,
  getProvinceById,
  getDistrictsByProvince,
} = require("../controllers/provinceController");

console.log("Province routes loaded");

/**
 * @swagger
 * /provinces:
 *   get:
 *     summary: Get all provinces
 *     description: Retrieve a list of all provinces in the system
 *     tags: [Provinces]
 *     responses:
 *       200:
 *         description: List of provinces retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Province'
 *       500:
 *         description: Internal server error
 */
router.get("/", listProvinces);
console.log("Province GET / route registered");

/**
 * @swagger
 * /provinces/{id}:
 *   get:
 *     summary: Get province by ID
 *     description: Retrieve a specific province by its ID
 *     tags: [Provinces]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Province ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Province details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Province'
 *       404:
 *         description: Province not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getProvinceById);

/**
 * @swagger
 * /provinces/{id}/districts:
 *   get:
 *     summary: Get districts in a province
 *     description: Retrieve all districts that belong to a specific province
 *     tags: [Provinces]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Province ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Districts for province retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/District'
 *       500:
 *         description: Internal server error
 */
router.get("/:id/districts", getDistrictsByProvince);

module.exports = router;
