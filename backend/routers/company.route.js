import express from 'express';

const router = express.Router();

// Routes for logged in users
router.use(authController.protect);

// Routes for admins only
router.use(authController.restrictTo('admin'));
