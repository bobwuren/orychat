#!/usr/bin/env node

const AuthService = require("../services/authService");
const UserModel = require("../models/userModel");
const readline = require("readline");
const validator = require("validator");

// Interface interactive
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function createAdmin() {
  try {
    console.log("\n🚀 Création d'un compte administrateur Orientys\n");
    console.log("═".repeat(60));

    // Demander l'email
    const email = await askQuestion("📧 Email de l'admin: ");

    if (!email || !validator.isEmail(email)) {
      console.log("\n❌ Email invalide!");
      rl.close();
      return;
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      console.log("\n❌ Un utilisateur avec cet email existe déjà!");
      rl.close();
      return;
    }

    // Demander le mot de passe
    const password = await askQuestion("🔐 Mot de passe: ");

    if (!password || password.length < 8) {
      console.log("\n❌ Mot de passe invalide! (minimum 8 caractères)");
      rl.close();
      return;
    }

    // Demander confirmation
    const confirmPassword = await askQuestion("✓ Confirmer le mot de passe: ");

    if (password !== confirmPassword) {
      console.log("\n❌ Les mots de passe ne correspondent pas!");
      rl.close();
      return;
    }

    console.log("\n⏳ Création de l'administrateur en cours...\n");

    // Créer l'admin directement avec AuthService
    const response = await AuthService.register({
      email,
      password,
      permissions: "admin",
    });

    // Afficher les informations formatées
    console.log("✅ ADMIN CRÉÉ AVEC SUCCÈS!\n");
    console.log("═".repeat(60));

    // Informations admin
    console.log("\n👤 INFORMATIONS ADMIN:");
    console.log("   ┌─────────────────────────────────────────────");
    console.log(`   ├─ ID        : ${response.user.id}`);
    console.log(`   ├─ Email     : ${response.user.email}`);
    console.log(`   ├─ Rôle      : admin`);
    console.log(`   └─ Créé le   : ${new Date().toLocaleString("fr-FR")}`);

    console.log("\n🔑 INFORMATIONS DE CONNEXION:");
    console.log("   ┌─────────────────────────────────────────────");
    console.log(`   ├─ Email     : ${response.user.email}`);
    console.log(`   └─ Mot passe : ${password}`);

    // Message de sécurité
    console.log("\n⚠️  SÉCURITÉ IMPORTANTE:");
    console.log("   ┌─────────────────────────────────────────────");
    console.log("   ├─ Conservez ces informations en lieu sûr");
    console.log("   └─ Ne partagez jamais vos identifiants");

    // Instructions de connexion
    console.log("\n🚀 PROCHAINES ÉTAPES:");
    console.log("   ┌─────────────────────────────────────────────");
    console.log("   ├─ 1. Connectez-vous à l'interface admin");
    console.log("   ├─ 2. Configurez votre profil");
    console.log("   └─ 3. Commencez à gérer la plateforme");

    console.log("\n" + "═".repeat(60));
    console.log("📝 Note: Ces informations ne seront plus affichées.");
    console.log("═".repeat(60) + "\n");
  } catch (error) {
    console.error("\n❌ ERREUR:", error.message);
    if (error.code === "ER_DUP_ENTRY") {
      console.log(
        "   Un utilisateur avec cet email existe déjà dans la base de données",
      );
    }
    console.log("\n" + "═".repeat(60) + "\n");
  } finally {
    rl.close();
  }
}

// Lancer le script
createAdmin();
