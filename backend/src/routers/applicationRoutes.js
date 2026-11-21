const router = require("express").Router();
const controller = require("../controllers/applicationController");
const { protect, allowRoles } = require("../middleware/auth");

router.post("/:jobId", protect, allowRoles("jobseeker"), controller.applyToJob);
router.get("/mine", protect, allowRoles("jobseeker"), controller.myApplications);
router.get("/job/:jobId", protect, allowRoles("employer", "admin"), controller.jobApplications);

module.exports = router;
