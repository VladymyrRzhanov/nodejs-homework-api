const { updateContact } = require('../controllers/contacts.controllers');
const Contacts = require('../repository/contacts');
const { CustomError } = require('../helpers/customError');
const { HttpCodeRes } = require('../config/constants');

jest.mock('../repository/contacts');

describe('Unit test controller updateContact', () => {
    let req, res, next;

  
  beforeEach(() => {
    Contacts.updateContact = jest.fn()
    req = { params: { id: 6 }, body: { name: "Vladymyr" }, user: { _id: 2 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => data)
    };
  });

  test('Contact exist', async () => {
    const contact = { id: 6, name: 'Vladymyr', email: "dui.in@egetlacus.com", phone: "(294) 840-6685" };
    Contacts.updateContact = jest.fn(() => {
      return contact
    })
    const result = await updateContact(req, res);
    expect(result).toBeDefined()
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('payload');
    expect(result.payload.contact).toEqual(contact);
  });

  test('Contact not exist v.1.0.', async () => {
    await expect(updateContact(req, res)).rejects.toEqual(new CustomError(HttpCodeRes.NOT_FOUND, 'Not Found'))
  });

  test('Contact not exist v.1.1', () => {
    return updateContact(req, res).catch(e => {
      expect(e.status).toEqual(HttpCodeRes.NOT_FOUND)
      expect(e.message).toEqual('Not Found')
    });
  });
});