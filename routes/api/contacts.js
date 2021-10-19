const express = require('express')
const router = express.Router();
const {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
  updateFavouriteStatus
} = require('../../controllers/contacts.controllers');
const { ContactValidate, ContactUpdateValidate, ContactUpdateStatusValidate, ContactIdValidate } = require('../../validation/validation');

router.get('/', getContacts);

router.get('/:id', ContactIdValidate, getContactById);

router.post('/', ContactValidate, createContact);

router.delete('/:id', ContactIdValidate, deleteContact);

router.put('/:id', [ContactIdValidate, ContactUpdateValidate], updateContact);

router.patch('/:id/favourite', [ContactIdValidate, ContactUpdateStatusValidate], updateFavouriteStatus);

module.exports = router;
