import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma"; // the PrismaClient instance

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const data = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        state: data.state,
        lga: data.lga,
        schoolName: data.schoolName,
        currentClass: data.currentClass,
        previousResult: data.previousResult,
        course: data.course,
        username: data.username,
        paid: data.paid || false,
        paymentRef: data.paymentRef || null,
      },
    });

    return res.status(200).json({ success: true, user });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
