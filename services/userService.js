const connection = require('../connection');

const userIdentify = async (req) => {
  const phoneNumber = req.body.phoneNumber;
  const email = req.body.email;

  try {
    let results = [];

    if (phoneNumber !== null && email !== null) {
      results = await executeQuery('SELECT * FROM Contact WHERE email = ? OR phoneNumber = ?', [email, phoneNumber]);
    } else if (phoneNumber !== null) {
      results = await executeQuery('SELECT * FROM Contact WHERE phoneNumber = ?', [phoneNumber]);
    } else if (email !== null) {
      results = await executeQuery('SELECT * FROM Contact WHERE email = ?', [email]);
    }
    if (results.length === 0) {
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
      const existingEmails = [...new Set(results.map((contact) => contact.email).filter((value) => value !== null && value !== undefined))];
      const existingPhoneNumbers = [...new Set(results.map((contact) => contact.phoneNumber).filter((value) => value !== null && value !== undefined))];

      if ((!existingEmails.includes(email) && email!=null) || (!existingPhoneNumbers.includes(phoneNumber) && phoneNumber!=null)) {
        let result;
        result = await executeQuery(
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
        let fetched = [];
        if(email!= null && phoneNumber!=null){
          fetched=await executeQuery('SELECT * FROM Contact WHERE (email = ? OR phoneNumber = ? OR linkedId=?) AND id!=?', [email, phoneNumber, primaryContactId,primaryContactId]);
        }else if(email==null && phoneNumber!=null){
          fetched=await executeQuery('SELECT * FROM Contact WHERE (phoneNumber = ? OR linkedId=?) AND id!=?', [phoneNumber, primaryContactId,primaryContactId]);
        }else{
          fetched=await executeQuery('SELECT * FROM Contact WHERE (email = ? OR linkedId=?) AND id!=?', [email,primaryContactId,primaryContactId]);
        }
        const existingSecondaryIds = [...new Set(fetched.map((contact) => contact.id).filter((value) => value !== null))];
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
      } else{
        await executeQuery(
          `UPDATE Contact SET linkPrecedence = "secondary", linkedId = ? WHERE (email='${email}' || phoneNumber='${phoneNumber}') AND id!=?`,
          [primaryContactId, primaryContactId]
        );

        let fetched = [];
        if(email!= null && phoneNumber!=null){
          fetched=await executeQuery('SELECT * FROM Contact WHERE (email = ? OR phoneNumber = ? OR linkedId=?) AND id!=?', [email, phoneNumber, primaryContactId,primaryContactId]);
        }else if(email==null && phoneNumber!=null){
          fetched=await executeQuery('SELECT * FROM Contact WHERE (phoneNumber = ? OR linkedId=?) AND id!=?', [phoneNumber, primaryContactId,primaryContactId]);
        }else{
          fetched=await executeQuery('SELECT * FROM Contact WHERE (email = ? OR linkedId=?) AND id!=?', [email,primaryContactId,primaryContactId]);
        }
        const existingSecondaryIds = [...new Set(fetched.map((contact) => contact.id).filter((value) => value !== null))];

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
