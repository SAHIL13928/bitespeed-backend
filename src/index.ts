import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

app.post("/identify", async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: "Provide email or phoneNumber" });
  }

 
  const matchedContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phoneNumber || undefined }
      ]
    },
    orderBy: { createdAt: "asc" }
  });

  let primaryContact;
  if (matchedContacts.length === 0) {
   
    primaryContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: "primary"
      }
    });
  } else {
   
    const primaries = matchedContacts.filter(c => c.linkPrecedence === "primary");
    primaries.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    primaryContact = primaries[0];

    
    for (const p of primaries.slice(1)) {
      await prisma.contact.update({
        where: { id: p.id },
        data: {
          linkPrecedence: "secondary",
          linkedId: primaryContact.id
        }
      });
    }

    
    const allRelated = await prisma.contact.findMany({
      where: {
        OR: [
          { id: primaryContact.id },
          { linkedId: primaryContact.id }
        ]
      }
    });

    const emailExists = allRelated.some(c => c.email === email);
    const phoneExists = allRelated.some(c => c.phoneNumber === phoneNumber);

    if (!emailExists || !phoneExists) {
      await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: "secondary",
          linkedId: primaryContact.id
        }
      });
    }
  }

  
  const allRelatedContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { id: primaryContact.id },
        { linkedId: primaryContact.id }
      ]
    },
    orderBy: { createdAt: "asc" }
  });

  const emails = Array.from(new Set(allRelatedContacts.map(c => c.email).filter(Boolean)));
  const phones = Array.from(new Set(allRelatedContacts.map(c => c.phoneNumber).filter(Boolean)));
  const secondaryIds = allRelatedContacts
    .filter(c => c.linkPrecedence === "secondary")
    .map(c => c.id);

  res.json({
    contact: {
      primaryContatctId: primaryContact.id,
      emails,
      phoneNumbers: phones,
      secondaryContactIds: secondaryIds
    }
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
