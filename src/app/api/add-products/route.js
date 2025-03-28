import { db } from "@/lib/firebase/config";
import { NextResponse } from "next/server";
import { writeBatch, doc, collection } from "firebase/firestore";
import data from "../../catalogue/data.json";
export async function POST(req) {
  try {
    const body = await req.json(); // Correct way to get the request body
    console.log("Received body:", body);
    if (!body) {
      return NextResponse.json(
        { error: "Empty request body" },
        { status: 400 }
      );
    }
    // console.log("req: ", req.json());
    console.log("req: ", req);
    console.log(" before await req.json()");

    console.log(" after await req.json()");
    console.log("Received body: ", body);
    const products = body;

    if (!products || !Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const batch = writeBatch(db); // ✅ Correct way to create a batch

    products.forEach((product) => {
      const productRef = doc(collection(db, "products"));
      batch.set(productRef, product);
    });

    await batch.commit();
    return NextResponse.json({ success: true, message: "Products added" });
  } catch (error) {
    console.log("error: ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
