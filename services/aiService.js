/**
 * =====================================================
 * AI Service - Version 2.0
 * =====================================================
 * Service d'intelligence artificielle pour générer des
 * recommandations d'orientation personnalisées
 *
 * NOUVEAUTÉ v2.0: Intègre les réponses du questionnaire
 * pour des recommandations ultra-personnalisées
 *
 * @module services/aiService
 * @version 2.0
 */

const axios = require('axios');
const SerieModel = require('../models/serieModel');
const SubjectModel = require('../models/subjectModel');
const UniversityModel = require('../models/universityModel');
const QuestionnaireModel = require('../models/questionnaireModel');

/**
 * Génère des recommandations d'orientation personnalisées
 *
 * @param {Object} params - Paramètres de génération
 * @param {number} params.userId - ID de l'utilisateur
 * @param {number} params.serieId - ID de la série
 * @param {Array} params.notes - Notes de l'étudiant
 * @param {number} params.questionnaireId - ID du questionnaire (NOUVEAU v2.0)
 * @returns {Promise<Object>} Recommandations générées
 * @throws {Error} Si la génération échoue
 */
exports.getRecommendation = async ({userId, serieId, notes, questionnaireId}) => {
    console.log('🤖 [AI Service v2.0] Génération de recommandation pour user:', userId);

    try {
        console.log('🔵 [AI Service] Entrée userId:', userId);
        console.log('🔵 [AI Service] Entrée serieId:', serieId);
        console.log('🔵 [AI Service] Entrée questionnaireId:', questionnaireId);
        console.log('🔵 [AI Service] Entrée notes:', notes);

        // 1. Récupération des données de base
        const [serie, subjects, sponsors] = await Promise.all([
            SerieModel.getById(serieId),
            SubjectModel.getBySerieId(serieId),
            UniversityModel.getAllSponsors()
        ]);

        console.log('🟢 [AI Service] Série récupérée:', serie);
        console.log('🟢 [AI Service] Matières récupérées:', subjects.length);
        console.log('🟢 [AI Service] Sponsors récupérés:', sponsors.length);

        // 2. NOUVEAU v2.0 : Récupération du questionnaire
        let questionnaire = null;
        if (questionnaireId) {
            questionnaire = await QuestionnaireModel.getById(questionnaireId);
            console.log('🟢 [AI Service] Questionnaire récupéré:', questionnaire ? 'Oui' : 'Non');
        } else {
            // Si pas de questionnaireId fourni, récupérer le dernier questionnaire de l'utilisateur
            questionnaire = await QuestionnaireModel.getLatestByUserId(userId);
            console.log('🟢 [AI Service] Dernier questionnaire utilisateur récupéré:', questionnaire ? 'Oui' : 'Non');
        }

        // 3. Calcul de la moyenne
        const moyenne = notes.length > 0
            ? notes.reduce((acc, n) => acc + (n.value || 0), 0) / notes.length
            : 0;
        console.log('📊 [AI Service] Moyenne calculée:', moyenne.toFixed(2));

        // 4. Construction des notes détaillées pour le prompt
        const subjectsNotes = notes.map(n => {
            const subject = subjects.find(s => s.id === n.subjectId);
            return `${subject?.name || 'Inconnu'}: ${n.value}/20 (coeff ${subject?.coefficient || 1})`;
        }).join('\n  - ');

        // 5. Construction de la liste des universités sponsors
        const sponsorsList = sponsors.map(u =>
            `${u.name} (${u.webSite || ''}): ${u.degrees && u.degrees.length > 0
                ? u.degrees.map(d => d.name).join(', ')
                : 'Aucun programme numérique'}`
        ).join('\n  - ');

        // 6. NOUVEAU v2.0 : Construction du prompt enrichi avec questionnaire
        const content = buildEnrichedPrompt({
            serie,
            moyenne,
            subjectsNotes,
            sponsorsList,
            questionnaire
        });

        console.log('\n🟡 [AI Service] Prompt enrichi envoyé à l\'IA');

        // 7. Appel à l'API IA (Groq/Llama)
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "Conseiller orientation numérique Togo - Expert en personnalisation"
                    },
                    {
                        role: "user",
                        content: content
                    }
                ],
                temperature: 0.7,
                max_tokens: 2500,
                response_format: {type: "json_object"}
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        console.log('\n🟣 [AI Service] Réponse brute IA reçue');

        // 8. Traitement de la réponse
        const rawResponse = response.data.choices[0].message.content;
        const jsonResponse = extractJsonArray(rawResponse);

        console.log('\n🟤 [AI Service] JSON extrait IA:', JSON.stringify(jsonResponse, null, 2));

        // 9. Mapping camelCase
        const orientations = jsonResponse.map(item => ({
            name: item.name,
            why: item.why,
            degrees: (item.degrees || []).map(d => ({
                name: d.name,
                articleLink: d.article_link
            })),
            universities: (item.universities || []).map(u => ({
                name: u.name,
                site: u.site || u.website
            })),
        }));

        console.log('\n🟢 [AI Service] Orientations traitées:', orientations.length);

        return {
            userId,
            serieId,
            orientations: orientations,
            noteIds: notes.map(note => note.id)
        };

    } catch (error) {
        console.error('❌ [AI Service] Erreur:', error.message);
        throw error;
    }
};

/**
 * Construit le prompt enrichi avec les données du questionnaire
 *
 * @param {Object} params - Paramètres du prompt
 * @param {Object} params.serie - Série de l'étudiant
 * @param {number} params.moyenne - Moyenne générale
 * @param {string} params.subjectsNotes - Notes formatées
 * @param {string} params.sponsorsList - Liste des universités
 * @param {Object} params.questionnaire - Réponses au questionnaire (peut être null)
 * @returns {string} Prompt formaté pour l'IA
 */
function buildEnrichedPrompt({serie, moyenne, subjectsNotes, sponsorsList, questionnaire}) {
    // Section questionnaire (conditionnelle)
    let questionnaireSection = '';

    if (questionnaire) {
        questionnaireSection = `
═══════════════════════════════════════
📝 PROFIL PERSONNEL (QUESTIONNAIRE)
═══════════════════════════════════════
Vision professionnelle (5-10 ans) : ${questionnaire.visionProfessionnelle || 'Non renseigné'}
Style d'apprentissage préféré : ${questionnaire.styleApprentissage || 'Non renseigné'}
Domaine numérique d'intérêt : ${questionnaire.domaineNumerique || 'Non renseigné'}
Priorité dans la formation : ${questionnaire.prioriteFormation || 'Non renseigné'}
Mode de travail préféré : ${questionnaire.modeTravail || 'Non renseigné'}

${questionnaire.matieresPreferees ? `Matières préférées et forces :
${questionnaire.matieresPreferees}` : ''}

${questionnaire.passionsExtraScolaires ? `Passions extra-scolaires :
${questionnaire.passionsExtraScolaires}` : ''}

${questionnaire.messageLibre ? `Message libre :
${questionnaire.messageLibre}` : ''}
`;
    } else {
        questionnaireSection = `
═══════════════════════════════════════
📝 PROFIL PERSONNEL
═══════════════════════════════════════
[Aucun questionnaire disponible - Recommandations basées uniquement sur les notes]
`;
    }

    const prompt = `
Tu es un conseiller d'orientation spécialisé dans les métiers du numérique au Togo.
Voici le profil complet à analyser :

═══════════════════════════════════════
📊 PROFIL ACADÉMIQUE
═══════════════════════════════════════
Série : ${serie.code} (${serie.description})
Moyenne générale : ${moyenne.toFixed(2)}/20

Résultats détaillés :
  - ${subjectsNotes}
${questionnaireSection}
═══════════════════════════════════════
🏫 UNIVERSITÉS PARTENAIRES
═══════════════════════════════════════
${sponsorsList}

═══════════════════════════════════════
🎯 TA MISSION
═══════════════════════════════════════
1. Propose EXACTEMENT 3 métiers/filières NUMÉRIQUES adaptés

2. Pour CHAQUE métier, fournis :
   - "name": Nom du métier (ex: "Développeur Web", "Data Analyst")
   
   - "why": Explication PERSONNALISÉE et DÉTAILLÉE (minimum 4-5 phrases) qui :
     ${questionnaire ? `
     • Analyse les RÉSULTATS ACADÉMIQUES spécifiques (cite les notes)
     • Relie avec les RÉPONSES AU QUESTIONNAIRE (vision pro, style apprentissage, passions)
     • Explique pourquoi CE métier correspond à CE profil unique
     • Mentionne les FORCES identifiées et les ASPIRATIONS personnelles
     ` : `
     • Analyse les RÉSULTATS ACADÉMIQUES spécifiques (cite les notes)
     • Explique les compétences nécessaires pour ce métier
     • Justifie pourquoi ce métier correspond au profil académique
     `}
   
   - "degrees": Liste des diplômes nécessaires pour ce métier
     Format : [
       {"name": "Licence en Informatique", "article_link": "https://example.com/article"},
       {"name": "Master en Data Science", "article_link": "https://example.com/article2"}
     ]
     ⚠️ Les liens doivent être de VRAIS articles sur Internet parlant du diplôme
   
   - "universities": Universités PARTENAIRES proposant ces formations
     Format : [
       {"name": "Université de Lomé", "website": "https://www.univ-lome.tg"},
       {"name": "Tam Tam Digital School", "website": "https://tamtamdigital.org"}
     ]
     ⚠️ Ne propose QUE les universités qui offrent RÉELLEMENT la formation (analyse contextuelle)
     ⚠️ Si aucune université partenaire ne correspond, laisser le tableau VIDE []

═══════════════════════════════════════
✅ CRITÈRES IMPÉRATIFS
═══════════════════════════════════════
• PERSONNALISATION MAXIMALE : Chaque "why" doit être unique et basé sur LE profil de l'étudiant
${questionnaire ? '• COHÉRENCE TOTALE : Les métiers doivent correspondre aux notes ET au questionnaire' : '• COHÉRENCE : Les métiers doivent correspondre aux notes académiques'}
• NUMÉRIQUE UNIQUEMENT : Tous les métiers doivent être dans le domaine du digital/tech
• PERTINENCE : Même pour les séries littéraires, trouve des débouchés numériques adaptés
• UNIVERSITÉS VÉRIFIÉES : Ne propose que les universités qui offrent VRAIMENT la formation
• FORMAT JSON : Réponds UNIQUEMENT par un tableau JSON valide (pas de texte avant/après)

═══════════════════════════════════════
📋 EXEMPLE DE RÉPONSE ATTENDUE
═══════════════════════════════════════
[
  {
    "name": "Community Manager",
    "why": "Tes excellents résultats en Français (16/20) et Anglais (15/20) démontrent tes compétences rédactionnelles solides, essentielles pour ce métier. ${questionnaire ? 'Ta vision de devenir entrepreneur et ton intérêt pour gérer les réseaux sociaux correspondent parfaitement au Community Management. De plus, ta passion pour la création de contenu et ton mode de travail en équipe sont des atouts majeurs pour animer des communautés en ligne.' : ''} Ce métier te permettra de combiner créativité, stratégie digitale et entrepreneuriat.",
    "degrees": [
      {"name": "Licence en Marketing Digital", "article_link": "https://exemple.com/article1"},
      {"name": "Certificat en Community Management", "article_link": "https://exemple.com/article2"}
    ],
    "universities": [
      {"name": "ESCEN", "website": "https://escen.university"},
      {"name": "Lomé Business School", "website": "https://lome-bs.com"}
    ]
  },
  {
    "name": "Développeur Web",
    "why": "...",
    "degrees": [...],
    "universities": [...]
  },
  {
    "name": "Data Analyst",
    "why": "...",
    "degrees": [...],
    "universities": [...]
  }
]
`;

    return prompt;
}

/**
 * Extrait le tableau JSON de la réponse brute de l'IA
 *
 * @param {string} rawString - Réponse brute de l'IA
 * @returns {Array} Tableau JSON parsé
 * @throws {Error} Si le parsing échoue
 */
function extractJsonArray(rawString) {
    try {
        const start = rawString.indexOf('[');
        const end = rawString.lastIndexOf(']') + 1;
        return JSON.parse(rawString.slice(start, end));
    } catch (e) {
        console.error('Erreur parsing JSON:', rawString);
        throw new Error('Réponse IA invalide');
    }
}