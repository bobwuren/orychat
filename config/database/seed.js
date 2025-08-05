const db = require("./db");

async function seed() {
    try {
        console.log("🌱 Début du seed pour le système éducatif togolais...");

        // Création des séries du système éducatif togolais
        const series = [
            {code: "A4", description: "Série Littéraire (Lettres Modernes)"},
            {code: "B", description: "Série Économique et Sociale"},
            {code: "C", description: "Série Scientifique (Mathématiques-Sciences Physiques)"},
            {code: "D", description: "Série Scientifique (Sciences Naturelles)"},
            {code: "E", description: "Série Techniques Industrielles"},
            {code: "F1", description: "Série Électrotechnique"},
            {code: "F2", description: "Série Mécanique Générale"},
            {code: "F3", description: "Série Électronique"},
            {code: "F4", description: "Série Génie Civil"},
            {code: "G1", description: "Série Secrétariat-Bureautique"},
            {code: "G2", description: "Série Comptabilité"},
            {code: "G3", description: "Série Commerce-Vente"},
            {code: "Ti", description: "Série Techniques Industrielles"}
        ];

        const seriesMap = new Map();

        for (const s of series) {
            const [result] = await db.execute(
                "INSERT INTO series (code, description) VALUES (?, ?)",
                [s.code, s.description]
            );
            seriesMap.set(s.code, result.insertId);
        }

        console.log("✅ Séries créées avec succès");

        // Matières et coefficients selon le système togolais
        const subjects = [
            // Matières communes
            {name: "Mathématiques", coeff: {A4: 2, B: 3, C: 7, D: 5, E: 4, F1: 4, F2: 4, F3: 4, F4: 4, G1: 2, G2: 3, G3: 2, Ti: 4}},
            {name: "Français", coeff: {A4: 5, B: 4, C: 3, D: 3, E: 3, F1: 3, F2: 3, F3: 3, F4: 3, G1: 4, G2: 3, G3: 3, Ti: 3}},
            {name: "Anglais", coeff: {A4: 3, B: 3, C: 2, D: 2, E: 2, F1: 2, F2: 2, F3: 2, F4: 2, G1: 3, G2: 2, G3: 4, Ti: 2}},
            {name: "Philosophie", coeff: {A4: 4, B: 3, C: 2, D: 2, E: 2, F1: 2, F2: 2, F3: 2, F4: 2, G1: 2, G2: 2, G3: 2, Ti: 2}},
            {name: "Histoire-Géographie", coeff: {A4: 4, B: 4, C: 2, D: 2, E: 2, F1: 2, F2: 2, F3: 2, F4: 2, G1: 2, G2: 2, G3: 2, Ti: 2}},
            {name: "Education Civique et Morale", coeff: {A4: 1, B: 1, C: 1, D: 1, E: 1, F1: 1, F2: 1, F3: 1, F4: 1, G1: 1, G2: 1, G3: 1, Ti: 1}},
            // Matières scientifiques
            {name: "Physique-Chimie", coeff: {C: 6, D: 3, E: 4, F1: 3, F2: 3, F3: 3, F4: 3, Ti: 4}},
            {name: "Sciences de la Vie et de la Terre", coeff: {D: 6, C: 2}},
            {name: "Sciences Physiques", coeff: {E: 5, Ti: 5}},
            // Matières techniques
            {name: "Technologie", coeff: {E: 6, F1: 8, F2: 8, F3: 8, F4: 8, Ti: 8}},
            {name: "Dessin Technique", coeff: {E: 3, F1: 4, F2: 4, F3: 4, F4: 4, Ti: 4}},
            {name: "Électrotechnique", coeff: {F1: 8}},
            {name: "Mécanique", coeff: {F2: 8}},
            {name: "Électronique", coeff: {F3: 8}},
            {name: "Génie Civil", coeff: {F4: 8}},
            {name: "Construction Mécanique", coeff: {F2: 4, Ti: 4}},
            // Matières économiques et gestion
            {name: "Sciences Économiques et Sociales", coeff: {B: 6}},
            {name: "Comptabilité", coeff: {G2: 8, G1: 2, G3: 3}},
            {name: "Économie d'Entreprise", coeff: {G2: 4, G3: 6}},
            {name: "Droit", coeff: {B: 3, G1: 3, G2: 3, G3: 3}},
            {name: "Secrétariat-Bureautique", coeff: {G1: 8}},
            {name: "Techniques Commerciales", coeff: {G3: 8}},
            {name: "Marketing", coeff: {G3: 4}},
            {name: "Communication", coeff: {G1: 4, G3: 3}},
            // Matières littéraires
            {name: "Littérature", coeff: {A4: 4}},
            {name: "Latin", coeff: {A4: 2}},
            {name: "Grec", coeff: {A4: 2}},
            // Langues
            {name: "Allemand", coeff: {A4: 2, B: 2, C: 2, D: 2}},
            {name: "Espagnol", coeff: {A4: 2, B: 2, C: 2, D: 2}},
            // Informatique (matière moderne ajoutée)
            {name: "Informatique", coeff: {A4: 1, B: 2, C: 2, D: 2, E: 3, F1: 3, F2: 3, F3: 4, F4: 3, G1: 4, G2: 3, G3: 3, Ti: 4}}
        ];

        for (const subj of subjects) {
            const [result] = await db.execute(
                "INSERT INTO subjects (name) VALUES (?)",
                [subj.name]
            );
            const subjectId = result.insertId;

            if (subj.coeff) {
                for (const [code, coeff] of Object.entries(subj.coeff)) {
                    const serieId = seriesMap.get(code);
                    if (serieId) {
                        await db.execute(
                            "INSERT INTO subject_coefficients (subject_id, serie_id, coefficient) VALUES (?, ?, ?)",
                            [subjectId, serieId, coeff]
                        );
                    }
                }
            }
        }

        console.log("✅ Matières et coefficients créés avec succès");

        // Formations dans le numérique disponibles au Togo
        const allDegrees = [
            // Licences professionnelles
            "Licence Professionnelle en Informatique de Gestion",
            "Licence Professionnelle en Génie Logiciel",
            "Licence Professionnelle en Réseaux et Télécommunications",
            "Licence Professionnelle en Maintenance Informatique",
            "Licence Professionnelle en Développement Web et Mobile",
            "Licence Professionnelle en Cybersécurité",
            "Licence Professionnelle en Administration Systèmes et Réseaux",
            "Licence Professionnelle en Intelligence Artificielle",
            "Licence Professionnelle en Data Science",
            "Licence Professionnelle en E-commerce",
            "Licence Professionnelle en Infographie et Multimédia",
            "Licence Professionnelle en Télécommunications",
            // Licences académiques
            "Licence en Informatique",
            "Licence en Mathématiques-Informatique",
            "Licence en Télécommunications",
            // Masters
            "Master en Informatique",
            "Master en Génie Logiciel",
            "Master en Réseaux et Systèmes Distribués",
            "Master en Sécurité des Systèmes d'Information",
            "Master en Intelligence Artificielle",
            "Master en Data Science et Big Data",
            "Master en Télécommunications",
            // BTS
            "BTS Informatique de Gestion",
            "BTS Maintenance Informatique",
            "BTS Électronique",
            "BTS Télécommunications",
            // Autres formations
            "Ingénieur en Informatique",
            "Ingénieur en Télécommunications",
            "DUT Informatique"
        ];

        // Insérer les diplômes
        const degreeMap = new Map();
        for (const degreeName of allDegrees) {
            const [result] = await db.execute(
                "INSERT INTO degrees (name) VALUES (?)",
                [degreeName]
            );
            degreeMap.set(degreeName, result.insertId);
        }

        console.log("✅ Formations créées avec succès");

        // Vraies universités et instituts togolais du numérique
        const universities = [
            {
                name: "Institut Africain d'Informatique (IAI-TOGO)",
                web_site: "https://iai.tg",
                description: "Institut de référence en informatique en Afrique de l'Ouest, formations de qualité en informatique et télécommunications.",
                is_sponsor: true,
                degrees: [
                    "Licence Professionnelle en Informatique de Gestion",
                    "Licence Professionnelle en Génie Logiciel",
                    "Licence Professionnelle en Réseaux et Télécommunications",
                    "Master en Informatique",
                    "Master en Génie Logiciel",
                    "Ingénieur en Informatique"
                ]
            },
            {
                name: "Université de Lomé (UL)",
                web_site: "https://univ-lome.tg",
                description: "Université publique du Togo, Faculté des Sciences et École Supérieure d'Informatique.",
                is_sponsor: false,
                degrees: [
                    "Licence en Informatique",
                    "Licence en Mathématiques-Informatique",
                    "Master en Informatique",
                    "Master en Réseaux et Systèmes Distribués",
                    "DUT Informatique"
                ]
            },
            {
                name: "École Supérieure d'Informatique et de Gestion (ESIG)",
                web_site: "https://esig.tg",
                description: "École privée spécialisée en informatique et gestion, formations professionnalisantes.",
                is_sponsor: true,
                degrees: [
                    "Licence Professionnelle en Développement Web et Mobile",
                    "Licence Professionnelle en Cybersécurité",
                    "Licence Professionnelle en Administration Systèmes et Réseaux",
                    "BTS Informatique de Gestion",
                    "Master en Sécurité des Systèmes d'Information"
                ]
            },
            {
                name: "Institut Supérieur des Sciences et Techniques (ISST)",
                web_site: "https://isst.tg",
                description: "Institut technique supérieur offrant des formations en informatique et électronique.",
                is_sponsor: false,
                degrees: [
                    "BTS Informatique de Gestion",
                    "BTS Maintenance Informatique",
                    "BTS Électronique",
                    "Licence Professionnelle en Maintenance Informatique"
                ]
            },
            {
                name: "École Supérieure de Commerce et de Gestion (ESCG)",
                web_site: "https://escg.tg",
                description: "École de commerce avec spécialisation en systèmes d'information et e-commerce.",
                is_sponsor: true,
                degrees: [
                    "Licence Professionnelle en E-commerce",
                    "Licence Professionnelle en Informatique de Gestion",
                    "Master en Data Science et Big Data"
                ]
            },
            {
                name: "Institut des Sciences et Techniques de l'Information (ISTI)",
                web_site: "https://isti.tg",
                description: "Institut spécialisé dans les nouvelles technologies et l'intelligence artificielle.",
                is_sponsor: true,
                degrees: [
                    "Licence Professionnelle en Intelligence Artificielle",
                    "Licence Professionnelle en Data Science",
                    "Master en Intelligence Artificielle",
                    "Master en Data Science et Big Data"
                ]
            },
            {
                name: "École Supérieure des Télécommunications (EST)",
                web_site: "https://est.tg",
                description: "École spécialisée en télécommunications et réseaux.",
                is_sponsor: false,
                degrees: [
                    "Licence en Télécommunications",
                    "BTS Télécommunications",
                    "Master en Télécommunications",
                    "Ingénieur en Télécommunications"
                ]
            },
            {
                name: "Institut Supérieur de Communication Numérique (ISCN)",
                web_site: "https://iscn.tg",
                description: "Institut moderne axé sur la communication numérique et le multimédia.",
                is_sponsor: true,
                degrees: [
                    "Licence Professionnelle en Infographie et Multimédia",
                    "Licence Professionnelle en Développement Web et Mobile",
                    "BTS Informatique de Gestion"
                ]
            },
            {
                name: "Université de Kara (UK)",
                web_site: "https://univ-kara.tg",
                description: "Université publique du Nord-Togo avec département informatique.",
                is_sponsor: false,
                degrees: [
                    "Licence en Informatique",
                    "BTS Informatique de Gestion",
                    "DUT Informatique"
                ]
            },
            {
                name: "École Africaine de Développement (EAD-Togo)",
                web_site: "https://ead.tg",
                description: "École privée proposant des formations en développement informatique et gestion de projet.",
                is_sponsor: true,
                degrees: [
                    "Licence Professionnelle en Génie Logiciel",
                    "Licence Professionnelle en Développement Web et Mobile",
                    "Master en Génie Logiciel"
                ]
            }
        ];

        for (const u of universities) {
            const [result] = await db.execute(
                "INSERT INTO universities (name, web_site, description, is_sponsor, created_at) VALUES (?, ?, ?, ?, NOW())",
                [u.name, u.web_site, u.description, u.is_sponsor]
            );
            const universityId = result.insertId;

            for (const degreeName of u.degrees) {
                const degreeId = degreeMap.get(degreeName);
                if (degreeId) {
                    await db.execute(
                        "INSERT INTO university_degrees (university_id, degree_id) VALUES (?, ?)",
                        [universityId, degreeId]
                    );
                }
            }
        }

        console.log("✅ Universités et associations avec les formations créées avec succès");
        console.log("🎉 Seed terminé avec succès !");
        console.log(`📊 Résumé:`);
        console.log(`   - ${series.length} séries du baccalauréat togolais`);
        console.log(`   - ${subjects.length} matières avec coefficients par série`);
        console.log(`   - ${allDegrees.length} formations dans le numérique`);
        console.log(`   - ${universities.length} établissements d'enseignement supérieur`);
        
        process.exit(0);
    } catch (err) {
        console.error("❌ Erreur lors du seed:", err);
        process.exit(1);
    }
}

seed();