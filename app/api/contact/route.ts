import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/contact
 * Endpoint pour traiter les messages de contact
 * Envoie un email à l'équipe Orientys
 */

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validation basique
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires." },
        { status: 400 }
      );
    }

    // Appel au backend pour envoyer l'email
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
    const response = await fetch(`${apiUrl}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Erreur backend contact:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi du message." },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message envoyé avec succès." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur API contact:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors du traitement de votre demande." },
      { status: 500 }
    );
  }
}
