const connection = require('../connection');

const userIdentify = async (req) => {
  const phoneNumber = req.body.phoneNumber;
  const email = req.body.email;

  try {
    const results = await executeQuery('SELECT * FROM Contact WHERE email = ? OR phoneNumber = ?', [email, phoneNumber]);

    if (results.length === 0) {
      console.log(13)
      const result = await executeQuery('INSERT INTO Contact (email, phoneNumber, linkPrecedence) VALUES (?, ?, "primary")', [email, phoneNumber]);

      const primaryContactId = result.insertId;
      const contact = {
        primaryContatctId: primaryContactId,
        emails: [email],
        phoneNumbers: [phoneNumber],
        secondaryContactIds: [],
      };

      return {
        data: { contact },
        message: 'Data fetched successfully',
      };
    } else {
      const primaryContact = results.reduce((oldest, current) => {
        const oldestDate = new Date(oldest.createdAt);
        const currentDate = new Date(current.createdAt);
        return currentDate < oldestDate ? current : oldest;
      });
      
      const primaryContactId = primaryContact.id;
      const existingEmails = results
        .map((contact) => contact.email)
        .filter((value) => value !== null);
      const existingPhoneNumbers = results
        .map((contact) => contact.phoneNumber)
        .filter((value) => value !== null);

      if (!existingEmails.includes(email) || !existingPhoneNumbers.includes(phoneNumber)) {
        const result = await executeQuery(
          'INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence) VALUES (?, ?, ?, "secondary")',
          [email, phoneNumber, primaryContactId]
        );

        const secondaryContactId = result.insertId;
        const contact = {
          primaryContatctId: primaryContactId,
          emails: existingEmails.concat(email),
          phoneNumbers: existingPhoneNumbers.concat(phoneNumber),
          secondaryContactIds: [secondaryContactId],
        };

        return {
          data: { contact },
          message: 'Data fetched successfully',
        };
      }  else if(primaryContact.email===email && primaryContact.phoneNumber===phoneNumber) {
        const contact = {
          primaryContatctId: primaryContactId,
          emails: existingEmails,
          phoneNumbers: existingPhoneNumbers,
          secondaryContactIds: [],
        };

        return {
          data: { contact },
          message: 'Data fetched successfully',
        };
      } else{
        await executeQuery(
          `UPDATE Contact SET linkPrecedence = "secondary", linkedId = ? WHERE (email='${email}' || phoneNumber='${phoneNumber}') AND id!=?`,
          [primaryContactId, primaryContactId]
        );

        const fetched = await executeQuery('SELECT * FROM Contact WHERE (email = ? OR phoneNumber = ?) AND id!=?', [email, phoneNumber, primaryContactId]);
        
        const existingSecondaryIds = fetched
        .map((contact) => contact.id)
        .filter((value) => value !== null);
        const contact = {
          primaryContatctId: primaryContactId,
          emails: existingEmails,
          phoneNumbers: existingPhoneNumbers,
          secondaryContactIds: existingSecondaryIds,
        };

        return {
          data: { contact },
          message: 'Data fetched successfully',
        };
      }
    }
  } catch (error) {
    console.error('Error executing query:', error);
    return {
      data: null,
      message: error.message,
    };
  }
};

const executeQuery = (query, values) => {
  return new Promise((resolve, reject) => {
    connection.promise().execute(query, values)
      .then(([rows]) => resolve(rows))
      .catch(reject);
  });
};

module.exports = userIdentify;
