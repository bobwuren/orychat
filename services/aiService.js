const axios = require('axios');
const SerieModel = require('../models/serieModel');
const SubjectModel = require('../models/subjectModel');
const UniversityModel = require('../models/universityModel');

exports.getRecommendation = async ({userId, serieId, notes}) => {
    console.log('🤖 [AI Service] Génération de recommandation pour user:', userId);

    try {
        console.log('🔵 [AI Service] Entrée userId:', userId);
        console.log('🔵 [AI Service] Entrée serieId:', serieId);
        console.log('🔵 [AI Service] Entrée notes:', notes);

        // 1. Récupération des données
        const [serie, subjects, sponsors] = await Promise.all([
            SerieModel.getById(serieId),
            SubjectModel.getBySerieId(serieId),
            UniversityModel.getAllSponsors()
        ]);
        console.log('🟢 [AI Service] Série récupérée:', serie);
        console.log('🟢 [AI Service] Matières récupérées:', subjects);
        console.log('🟢 [AI Service] Sponsors récupérés:', sponsors);

        // 2. Construction du prompt
        const subjectsNotes = notes.map(n => {
            const subject = subjects.find(s => s.id === n.subjectId);
            return `${subject?.name || 'Inconnu'}: ${n.value}/20 (coeff ${subject?.coefficient || 1})`;
        }).join('\n  - ');

        const sponsorsList = sponsors.map(u =>
            `${u.name}: ${u.degrees?.join(', ') || 'Aucun programme numérique'}`
        ).join('\n  - ');

        const content = `
Tu es un conseiller d'orientation spécialisé dans les métiers du numérique au Togo. Voici le profil à analyser :

PROFIL ÉTUDIANT :
- Série : ${serie.code} (${serie.description})
- Résultats :
  - ${subjectsNotes}

UNIVERSITÉS PARTENAIRES ET FORMATIONS QU'ELLES PROPOSENT :
  - ${sponsorsList}

TA MISSION :
1. Proposer EXACTEMENT 3 métiers/filières NUMÉRIQUES adaptés
2. Pour chaque métier fournir :
   - "name": Nom du métier (ex: "Développeur Web")
   - "why": Explication PERSONNALISÉE basée sur ses résultats
   - "degrees": Diplômes nécessaires pour ce métier. Pour chaque diplôme nécéssaire : nom du diplome + lien d'un articcle en ligne parlant de ce diplôme; un vrai lien valide et disponible sur l'Internet (ex: "Licence en Informatique", "https://exemple.com/article1"))
   - "universities": Dans la liste des Universités partenaires, celles proposant ces formations (nom + site web). Si aucun, laisser la lise vide ([]).

CRITÈRES :
- Même pour les séries qui n'ont pas forcément trait au numérique, trouve des débouchés numériques. Mais de manière pertinente bien sûr. On invente pas un métier juste pour le plaisir.
- Explique bien (un peu détaillée) pourquoi chaque métier est adapté au profil de l'étudiant, en te basant sur ses notes et matières.
- Ne propose QUE des métiers/filières du NUMÉRIQUE Mais de manière pertinente et adaptée.
- Ne propose QUE des universités qui, d'après analyse (pas seulement sémantique mais aussi contextuelle) offrent la formation (si aucune, laisser vide).
- Plusieurs de nos universités sponsors penvent proposer la formation adéquate après analyse. Ajoute les toutes
- Réponds UNIQUEMENT par un tableau JSON valide.
- Utilise des champs en anglais (name, why, degrees, universities).

EXEMPLE DE RÉPONSE :
[
  {
    "name": "Community Manager",
    "why": "Tes excellents résultats en Français et Langues montrent tes compétences rédactionnelles, idéales pour ce métier ...",
    "degrees": [
      {"name": "Licence en Marketing Digital", "article_link": "https://exemple.com/article1"},
      {"name: ..., "article_link": ...},
      ...
    ],
    "universities": [
      {"name": "Université ABC", "website": "https://univ-abc.tg"},
      {"name": "Université 123", "website": "https://univ-123.tg"},
      ...
    ],
  }
]

Avec une limite raisonnable pour le nombre de degrees correspondants au profil de l'étudiant et universités par métier correspondant à son profil.
`;

        console.log('\n🟡 [AI Service] Prompt envoyé à l\'IA :\n', content);

        // 3. Appel à l'API Mistral
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "Conseiller orientation numérique Togo"
                    },
                    {
                        role: "user",
                        content: content
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000,
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

        console.log('\n🟣 [AI Service] Réponse brute IA :', response.data.choices[0].message.content);

        // 4. Traitement de la réponse
        const rawResponse = response.data.choices[0].message.content;
        const jsonResponse = extractJsonArray(rawResponse);

        console.log('\n🟤 [AI Service] JSON extrait IA :', JSON.stringify(jsonResponse, null, 2));

        // Mapping camelCase
        const orientations = jsonResponse.map(item => ({
            name: item.name,
            why: item.why,
            degrees: (item.degrees || []).map(d => ({
                name: d.name,
                articleLink: d.article_link
                // articleLink: generateArticleLink(d.name)
            })),
            universities: (item.universities || []).map(u => ({
                name: u.name,
                site: u.site || u.website
            })),
        }));

        console.log('\n🟢 [AI Service] Orientations traitées :', JSON.stringify(orientations, null, 2));

        return {
            userId,
            serieId,
            orientations: orientations,
            noteIds: notes.map(note => note.id)
        };
    } catch (error) {
        console.error('❌ [AI Service] Erreur:', error);
        throw error;
    }
};

// Fonctions utilitaires
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
