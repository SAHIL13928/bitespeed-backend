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

  // Step 1: Find all contacts that match by email OR phone
  const matchedContacts = await prisma.contact.findMany({
    where: {
      OR: [
        email ? { email } : undefined,
        phoneNumber ? { phoneNumber } : undefined,
      ].filter(Boolean),
    },
    orderBy: { createdAt: "asc" },
  });

  let primaryContact;

  if (matchedContacts.length === 0) {
    // Step 2: If no match, create a new primary
    primaryContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: "primary",
      },
    });
  } else {
    // Step 3: Gather all unique contacts linked through matched ones
    const allIds = matchedContacts.map((c) =>
      c.linkPrecedence === "primary" ? c.id : c.linkedId
    );

    const uniquePrimaryIds = [...new Set(allIds)];

    // Fetch all related contacts across these primary IDs
    const allRelated = await prisma.contact.findMany({
      where: {
        OR: [
          { id: { in: uniquePrimaryIds } },
          { linkedId: { in: uniquePrimaryIds } },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    // Step 4: Find the oldest primary
    const primaries = allRelated.filter((c) => c.linkPrecedence === "primary");
    primaries.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    primaryContact = primaries[0];

    // Step 5: Demote newer primaries to secondary
    for (const p of primaries.slice(1)) {
      if (p.id !== primaryContact.id) {
        await prisma.contact.update({
          where: { id: p.id },
          data: {
            linkPrecedence: "secondary",
            linkedId: primaryContact.id,
          },
        });
      }
    }

    // Step 6: Ensure current email/phone are represented
    const emailExists = allRelated.some((c) => c.email === email);
    const phoneExists = allRelated.some((c) => c.phoneNumber === phoneNumber);

    if ((!emailExists && email) || (!phoneExists && phoneNumber)) {
      await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: "secondary",
          linkedId: primaryContact.id,
        },
      });
    }
  }

  // Step 7: Build the consolidated response
  const finalContacts = await prisma.contact.findMany({
    where: {
      OR: [{ id: primaryContact.id }, { linkedId: primaryContact.id }],
    },
    orderBy: { createdAt: "asc" },
  });

  const emails = Array.from(
    new Set(finalContacts.map((c) => c.email).filter(Boolean))
  );
  const phones = Array.from(
    new Set(finalContacts.map((c) => c.phoneNumber).filter(Boolean))
  );
  const secondaryIds = finalContacts
    .filter((c) => c.linkPrecedence === "secondary")
    .map((c) => c.id);

  res.json({
    contact: {
      primaryContactId: primaryContact.id,
      emails,
      phoneNumbers: phones,
      secondaryContactIds: secondaryIds,
    },
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
