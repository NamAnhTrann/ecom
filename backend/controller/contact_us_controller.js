const Contact = require("../schema/contact_schema");

module.exports = {
  //post contact
  addContact: async function (req, res) {
    try {
      const newContact = new Contact({
        ...req.body,
      });
      await newContact.save();
      return res.status(200).json(newContact);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  //get all contacts
  listAllContacts: async function (req, res) {
    try {
      const contacts = await Contact.find({});
      return res.status(200).json(contacts);
    } catch (err) {
      return res.status(500).json({ message: "Internal error", err });
    }
  },

  //get single contact
  listSingleContact: async function (req, res) {
    const contact_id = req.params.id;
    try {
      const contact = await Contact.findById(contact_id);
      return res.status(200).jsonq(contact);
    } catch (err) {
      return res.status(500).json({ message: "Internal error", err });
    }
  },
};
