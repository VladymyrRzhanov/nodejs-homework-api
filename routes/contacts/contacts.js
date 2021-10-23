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
const wrapError=require('../../helpers/errorHandler')


router.get('/', guard, wrapError(getContacts));

router.get('/:id', guard, ContactIdValidate, wrapError(getContactById));

router.post('/', guard, ContactValidate, wrapError(createContact));

router.delete('/:id', guard, ContactIdValidate, wrapError(deleteContact));

router.put('/:id', guard, [ContactIdValidate, ContactUpdateValidate], wrapError(updateContact));

router.patch('/:id/favourite', guard, [ContactIdValidate, ContactUpdateStatusValidate], wrapError(updateFavouriteStatus));

module.exports = router;
