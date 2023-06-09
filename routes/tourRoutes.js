const express = require('express');
const router = express.Router();
const tourController = require('../controller/tourController');

router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.creatTour);

router
  .route('/:id')
  .get(tourController.getTourDetail)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
