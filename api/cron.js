import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { Resend } from "resend";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end("Unauthorized");
  }

  const now = Timestamp.now();
  const snap = await db
    .collection("cards")
    .where("isPublic", "==", false)
    .where("scheduledAt", "<=", now)
    .get();

  if (snap.empty) return res.status(200).json({ published: 0 });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://matzy-bday.vercel.app";
  const jobs = snap.docs.map(async (d) => {
    const card = d.data();
    await d.ref.update({ isPublic: true });

    if (card.recipientEmail) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: card.recipientEmail,
        subject: `Ada kartu untukmu dari ${card.signature || "seseorang"} 🎉`,
        html: `
          <p>Hei <strong>${card.name}</strong>,</p>
          <p>Ada seseorang yang mengirimkan kartu spesial untukmu.</p>
          <p><a href="${baseUrl}/card?id=${card.slug}" style="padding:10px 20px;background:#c9a84c;color:#0d0820;border-radius:8px;text-decoration:none;font-weight:bold;">Buka Kartumu</a></p>
        `,
      });
    }
  });

  await Promise.all(jobs);
  res.status(200).json({ published: snap.size });
}
