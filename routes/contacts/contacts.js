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
const guard = require('../../helpers/guard');


router.get('/', guard, getContacts);

router.get('/:id', guard, ContactIdValidate, getContactById);

router.post('/', guard, ContactValidate, createContact);

router.delete('/:id', guard, ContactIdValidate, deleteContact);

router.put('/:id', guard, [ContactIdValidate, ContactUpdateValidate], updateContact);

router.patch('/:id/favourite', guard, [ContactIdValidate, ContactUpdateStatusValidate], updateFavouriteStatus);

module.exports = router;
