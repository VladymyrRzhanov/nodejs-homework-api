const Contact = require('../model/contact');

const listContacts = async (userId, query) => {
  const { limit = 5, page = 1, favourite = null } = query;
  const searchOptions = { owner: userId };
  if (favourite !== null) {
    searchOptions.favourite = favourite;
  }
  const results = await Contact.paginate(searchOptions, { limit, page });
  const { docs: contacts } = results;
  delete results.docs;
  return { ...results, contacts };
};

const getContactById = async (contactId, userId) => {
  const result = await Contact.findOne({ _id: contactId, owner: userId }).populate({ path: 'owner',select: 'email subscription' });
  return result;
};

const removeContact = async (contactId, userId) => {
  const result = await Contact.findOneAndDelete({ _id: contactId, owner: userId });
  return result;
};

const addContact = async (body) => {
  const result = await Contact.create(body);
  return result;
};

const updateContact = async (contactId, body, userId) => {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true });
  return result
};

const updateContactStatus = async (contactId, body, userId) => {
  const result = await Contact.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true });
  return result
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateContactStatus
};
