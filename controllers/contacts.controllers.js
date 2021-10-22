const Contacts = require('../repository/contacts');
const {HttpCodeRes} = require('../config/constants');

const getContacts = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const data = await Contacts.listContacts(userId, req.query);
        res.json({ status: 'success', code: HttpCodeRes.SUCCESS, data: { ...data } });
    } catch (error) {
        next(error)
    }
};

const getContactById = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const contact = await Contacts.getContactById(req.params.id, userId);
        if (contact) {
            return res.status(HttpCodeRes.SUCCESS).json({ status: 'success', code: HttpCodeRes.SUCCESS, payload: { contact } });
        }
        return res.status(HttpCodeRes.NOT_FOUND).json({ status: 'error', code: HttpCodeRes.NOT_FOUND, message: "Not found" });
    } catch (error) {
        next(error)
    }
};

const createContact = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const contact = await Contacts.addContact({ ...req.body, owner: userId });
        res.status(HttpCodeRes.SUCCESS_CREATE).json({ status: 'success', code: HttpCodeRes.SUCCESS_CREATE, payload: { contact } });
    } catch (error) {
        next(error)
    }
};

const deleteContact = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const contact = await Contacts.removeContact(req.params.id, userId);
        if (contact) {
            return res.status(HttpCodeRes.SUCCESS).json({ status: 'success', code: HttpCodeRes.SUCCESS, message: "Contact deleted" });
        }
        return res.status(HttpCodeRes.NOT_FOUND).json({ status: 'error', code: HttpCodeRes.NOT_FOUND, message: "Not found" });
    } catch (error) {
        next(error)
    }
};

const updateContact = async (req, res, next) => {
    try {
        const userId = req.user._id;
        if (Object.keys(req.body).length === 0) {
            return res.status(HttpCodeRes.BAD_REQUEST).json({ status: 'error', code: HttpCodeRes.BAD_REQUEST, message: "Missing fields" });
        }
        const contact = await Contacts.updateContact(req.params.id, req.body, userId);
        if (contact) {
            return res.status(HttpCodeRes.SUCCESS).json({ status: 'success', code: HttpCodeRes.SUCCESS, payload: { contact } });
        }
        return res.status(HttpCodeRes.NOT_FOUND).json({ status: 'error', code: HttpCodeRes.NOT_FOUND, message: "Not found" });
    } catch (error) {
        next(error)
    }
};

const updateFavouriteStatus = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const contact = await Contacts.updateContactStatus(req.params.id, req.body, userId);
        if (req.body.favourite) {
            return res.status(HttpCodeRes.SUCCESS).json({ status: 'success', code: HttpCodeRes.SUCCESS, payload: { contact } });
        }
        else if (!req.body.favourite) {
            return res.status(HttpCodeRes.BAD_REQUEST).json({ status: 'error', code: HttpCodeRes.BAD_REQUEST, message: "Missing field favourite" });
        }
        res.status(HttpCodeRes.NOT_FOUND).json({ status: 'error', code: HttpCodeRes.NOT_FOUND, message: "Not found" });
    } catch (error) {
        next(error)
    }
};

module.exports = {
    getContacts,
    getContactById,
    createContact,
    deleteContact,
    updateContact,
    updateFavouriteStatus
};