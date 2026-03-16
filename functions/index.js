const { onSchedule } = require("firebase-functions/v2/scheduler");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const nodemailer = require("nodemailer");

initializeApp();
const db = getFirestore();

const BASE_URL = "https://matzy-bday.vercel.app";

exports.autoPublishCards = onSchedule({ schedule: "every 1 minutes", secrets: ["GMAIL_USER", "GMAIL_PASS"] }, async () => {
  const now = Timestamp.now();
  const snap = await db.collection("cards").where("isPublic", "==", false).get();

  const due = snap.docs.filter(
    (d) => d.data().scheduledAt && d.data().scheduledAt.toMillis() <= now.toMillis()
  );

  if (!due.length) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  await Promise.all(
    due.map(async (d) => {
      const card = d.data();
      await d.ref.update({ isPublic: true });

      if (card.recipientEmail) {
        await transporter.sendMail({
          from: `"Matzy Bday" <${process.env.GMAIL_USER}>`,
          to: card.recipientEmail,
          subject: `Ada kartu untukmu dari ${card.signature || "seseorang"} 🎉`,
          html: `
            <p>Hei <strong>${card.name}</strong>,</p>
            <p>Ada seseorang yang mengirimkan kartu spesial untukmu.</p>
            <br/>
            <a href="${BASE_URL}/card?id=${card.slug}" style="padding:10px 20px;background:#c9a84c;color:#0d0820;border-radius:8px;text-decoration:none;font-weight:bold;">Buka Kartumu</a>
          `,
        });
      }
    })
  );
});
