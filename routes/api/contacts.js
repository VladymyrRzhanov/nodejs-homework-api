const express = require('express')
const router = express.Router()
const Contacts = require('../../model');
const { ContactValidate, ContactUpdateValidate, ContactUpdateStatusValidate, ContactIdValidate } = require('../../validation/validation');

router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();
    res.json({ status: 'success', code: 200, payload: { contacts } });
  } catch (error) {
    next(error)
  }
});

router.get('/:contactId', ContactIdValidate, async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
    if (contact) {
      return res.status(200).json({ status: 'success', code: 200, payload: { contact } });
    }
      return res.status(404).json({ status: 'error', code: 404, message: "Not found" });
  } catch (error) {
    next(error)
  }
})

router.post('/', ContactValidate, async (req, res, next) => {
   try {
    const contact = await Contacts.addContact(req.body);
    res.status(201).json({ status: 'success', code: 201, payload: { contact } });
  } catch (error) {
    next(error)
  }
})

router.delete('/:contactId', ContactIdValidate, async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId);
    if (contact) {
      return res.status(200).json({ status: 'success', code: 200, message: "Contact deleted" });
    }
      return res.status(404).json({ status: 'error', code: 404, message: "Not found" });
  } catch (error) {
    next(error)
  }
})

router.put('/:contactId', ContactIdValidate, ContactUpdateValidate, async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ status: 'error', code: 400, message: "Missing fields" });
    }
    const contact = await Contacts.updateContact(req.params.contactId, req.body);
    if (contact) {
      return res.status(200).json({ status: 'success', code: 200, payload: { contact } });
    }
    return res.status(404).json({ status: 'error', code: 404, message: "Not found" });
  } catch (error) {
    next(error)
  }
});

router.patch('/:contactId/favourite', ContactIdValidate, ContactUpdateStatusValidate, async (req, res, next) => {
  try {
    const contact = await Contacts.updateContactStatus(req.params.contactId, req.body);
    if (contact) {
      return res.status(200).json({ status: 'success', code: 200, payload: { contact } });
    }
    return res.status(404).json({ status: 'error', code: 404, message: "Not found" });
  } catch (error) {
    next(error)
  }
});

module.exports = router
