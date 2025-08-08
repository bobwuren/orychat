const db = require("./db");

// --- UNIVERSITIES, DEGREES, AND ASSOCIATIONS ---
const universities = [
  {
    name: "Université de Lomé (UL)",
    web_site: "https://www.univ-lome.tg/",
    description: "La plus grande université publique du Togo, reconnue pour son Centre Informatique et de Calcul (CIC) et l’Institut des Sciences de l’Information, de la Communication et des Arts (ISICA). Elle propose des formations de pointe en informatique, communication numérique et intelligence artificielle.",
    is_sponsor: true,
    degrees: [
      { name: "Licence en Informatique", description: "Génie logiciel, Réseaux, Bases de données, Maintenance" },
      { name: "Master en Informatique", description: "Intelligence artificielle, Sécurité informatique, Systèmes d’information" },
      { name: "Doctorat en Informatique", description: "IA, Big Data, Cybersécurité, Informatique décisionnelle" },
      { name: "Licence en Communication Numérique et Multimédia", description: "Journalisme numérique, Marketing digital, Design graphique" },
      { name: "Master en Communication et Médias Numériques", description: null },
    ]
  },
  {
    name: "Université de Kara (UK)",
    web_site: "https://www.univkara.tg/",
    description: "Université publique du nord du Togo, dotée d'une Faculté des Sciences et d’un Département d’Informatique dynamique, axé sur la formation en programmation, algorithmique, IA et technologies web.",
    is_sponsor: true,
    degrees: [
      { name: "Licence en Informatique", description: "Programmation, Algorithmique, Bases de données, Réseaux" },
      { name: "Master en Informatique", description: "Intelligence artificielle, Technologies web, Systèmes d’information" },
      { name: "Doctorat en Informatique (en projet)", description: null },
    ]
  },
  {
    name: "École Supérieure de Commerce et d’Économie Numérique (ESCEN)",
    web_site: "https://escen.university/",
    description: "Établissement privé spécialisé dans l’économie numérique, le management digital et la transformation digitale, reconnu par le Ministère de l’Enseignement Supérieur.",
    is_sponsor: true,
    degrees: [
      { name: "Licence en Économie Numérique", description: "Marketing Digital et E-commerce, Finance Digitale et Inclusion Financière, Management de Projets Numériques" },
      { name: "Master en Économie Numérique", description: "Stratégie digitale, Transformation numérique, Gouvernance des données" },
    ]
  },
  {
    name: "Tam Tam Digital School",
    web_site: "https://tamtamdigital.org/",
    description: "École privée innovante, pionnière dans la formation accélérée aux métiers du numérique, reconnue par l’Agence Nationale de la Formation Professionnelle (ANF).",
    is_sponsor: true,
    degrees: [
      { name: "Certificat Professionnel en Développement Web & Mobile", description: "6-12 mois, reconnu ANF" },
      { name: "Certificat en Data Science et Intelligence Artificielle", description: null },
      { name: "Certificat en Marketing Digital et Community Management", description: null },
      { name: "Certificat en Design Numérique et UX/UI", description: null },
      { name: "Diplôme en Gestion de Projets Numériques", description: "bac+3, niveau licence" },
    ]
  },
  {
    name: "Institut Africain d’Informatique (IAI-Togo)",
    web_site: "https://www.iai-togo.tg/",
    description: "Institution publique panafricaine, sous tutelle du CIO, spécialisée dans la formation d’ingénieurs et de techniciens supérieurs en informatique, avec des diplômes reconnus internationalement.",
    is_sponsor: true,
    degrees: [
      { name: "Diplôme d’Ingénieur en Informatique", description: "Génie logiciel, Sécurité des systèmes d’information, Réseaux et télécommunications, Intelligence artificielle et Big Data" },
      { name: "Licence Professionnelle en Informatique", description: null },
    ]
  },
  {
    name: "Lomé Business School (LBS)",
    web_site: "https://lome-bs.com/",
    description: "Grande école privée accréditée, spécialisée dans le management des systèmes d’information, le digital management et la transformation numérique, avec des diplômes reconnus en Afrique et en Europe.",
    is_sponsor: true,
    degrees: [
      { name: "Bachelor en Systèmes d’Information et Digital Management", description: null },
      { name: "Master en Management des Systèmes d’Information", description: null },
      { name: "Master en Marketing Digital et Transformation Numérique", description: null },
      { name: "Master en Gestion de Projets Technologiques", description: null },
    ]
  },
  {
    name: "iPNet (Institut de formation en nouvelles technologies)",
    web_site: "https://www.ipnetuniversity.com/",
    description: "Institut privé de référence dans la formation aux nouvelles technologies, cybersécurité, IA, data science et développement d’applications web et mobiles.",
    is_sponsor: true,
    degrees: [
      { name: "Licence en Cybersécurité", description: null },
      { name: "Licence en Intelligence Artificielle et Data Science", description: null },
      { name: "Licence en Développement d’Applications (Web & Mobile)", description: null },
      { name: "Licence en Réseaux et Télécommunications", description: null },
    ]
  },
];

// --- SERIES, SUBJECTS, AND COEFFICIENTS ---
const series = [
  {
    code: "A4",
    description: "Littéraire",
    subjects: [
      { name: "Français", coefficient: 4 },
      { name: "Anglais", coefficient: 3 },
      { name: "Philosophie", coefficient: 4 },
      { name: "Histoire-Géographie", coefficient: 3 },
      { name: "Langue vivante 2", coefficient: 2 },
      
    ]
  },
  {
    code: "C",
    description: "Mathématiques et Sciences Physiques",
    subjects: [
      { name: "Mathématiques", coefficient: 4 },
      { name: "Physique-Chimie", coefficient: 4 },
      { name: "Français", coefficient: 2 },
      { name: "Anglais", coefficient: 2 },
      { name: "Philosophie", coefficient: 2 },
      { name: "Histoire-Géographie", coefficient: 2 },
      
    ]
  },
  {
    code: "D",
    description: "Mathématiques et Sciences de la Nature",
    subjects: [
      { name: "Mathématiques", coefficient: 3 },
      { name: "Sciences de la Vie et de la Terre (SVT)", coefficient: 4 },
      { name: "Physique-Chimie", coefficient: 3 },
      { name: "Français", coefficient: 2 },
      { name: "Anglais", coefficient: 2 },
      { name: "Philosophie", coefficient: 2 },
      { name: "Histoire-Géographie", coefficient: 2 },
      
    ]
  },
  {
    code: "F1",
    description: "Construction Mécanique",
    subjects: [
      { name: "Dessin Industriel", coefficient: 3 },
      { name: "Mécanique Appliquée", coefficient: 4 },
      { name: "Technologie Mécanique", coefficient: 3 },
      { name: "Mathématiques Appliquées", coefficient: 3 },
      { name: "Sciences Physiques", coefficient: 3 },
      { name: "Français", coefficient: 2 },
      { name: "Anglais", coefficient: 2 },
      { name: "Philosophie", coefficient: 2 },
      { name: "Histoire-Géographie", coefficient: 2 },
      { name: "Éducation Civique et Morale", coefficient: 1 },
      
    ]
  },
  {
    code: "F2",
    description: "Électronique",
    subjects: [
      { name: "Électronique", coefficient: 4 },
      { name: "Électrotechnique", coefficient: 4 },
      { name: "Mathématiques Appliquées", coefficient: 3 },
      { name: "Sciences Physiques", coefficient: 3 },
      { name: "Dessin Technique", coefficient: 3 },
      { name: "Français", coefficient: 2 },
      { name: "Anglais", coefficient: 2 },
      { name: "Philosophie", coefficient: 2 },
      { name: "Histoire-Géographie", coefficient: 2 },
      { name: "Éducation Civique et Morale", coefficient: 1 },
      
    ]
  },
  {
    code: "F3",
    description: "Électrotechnique",
    subjects: [
      { name: "Électrotechnique", coefficient: 4 },
      { name: "Machines Électriques", coefficient: 3 },
      { name: "Mathématiques Appliquées", coefficient: 3 },
      { name: "Sciences Physiques", coefficient: 3 },
      { name: "Dessin Technique", coefficient: 3 },
      { name: "Français", coefficient: 2 },
      { name: "Anglais", coefficient: 2 },
      { name: "Philosophie", coefficient: 2 },
      { name: "Histoire-Géographie", coefficient: 2 },
      { name: "Éducation Civique et Morale", coefficient: 1 },
      
    ]
  },
  {
    code: "F4",
    description: "Génie Civil (Bâtiment et Travaux Publics)",
    subjects: [
      { name: "Dessin de Bâtiment", coefficient: 4 },
      { name: "Technologie de Construction", coefficient: 4 },
      { name: "Mécanique Appliquée (Résistance des matériaux)", coefficient: 3 },
      { name: "Métré et Étude de Prix", coefficient: 3 },
      { name: "Topographie", coefficient: 3 },
      { name: "Mathématiques Appliquées", coefficient: 3 },
      { name: "Sciences Physiques", coefficient: 3 },
      { name: "Français", coefficient: 2 },
      { name: "Anglais", coefficient: 2 },
      { name: "Philosophie", coefficient: 2 },
      { name: "Histoire-Géographie", coefficient: 2 },
      { name: "Éducation Civique et Morale", coefficient: 1 },
      
    ]
  },
  {
    code: "G1",
    description: "Gestion Administrative",
    subjects: [
      { name: "Gestion Administrative", coefficient: 4 },
      { name: "Organisation du Travail", coefficient: 3 },
      { name: "Secrétariat et Correspondance", coefficient: 3 },
      { name: "Comptabilité Générale", coefficient: 4 },
      { name: "Informatique de Bureau", coefficient: 2 },
      { name: "Français", coefficient: 2 },
      { name: "Anglais Commercial", coefficient: 2 },
      { name: "Mathématiques Appliquées", coefficient: 2 },
      { name: "Sciences Économiques et Sociales", coefficient: 2 },
      { name: "Histoire-Géographie", coefficient: 2 },
      { name: "Philosophie", coefficient: 2 },
      { name: "Éducation Civique et Morale", coefficient: 1 },
      
    ]
  },
  {
    code: "G2",
    description: "Technique Quantitative de Gestion",
    subjects: [
      { name: "Comptabilité Générale", coefficient: 4 },
      { name: "Comptabilité Analytique", coefficient: 3 },
      { name: "Mathématiques Financières", coefficient: 3 },
      { name: "Statistiques Appliquées", coefficient: 3 },
      { name: "Sciences de Gestion", coefficient: 2 },
      { name: "Informatique Appliquée à la Gestion", coefficient: 2 },
      { name: "Français", coefficient: 2 },
      { name: "Anglais Commercial", coefficient: 2 },
      { name: "Mathématiques", coefficient: 2 },
      { name: "Sciences Économiques", coefficient: 2 },
      { name: "Histoire-Géographie", coefficient: 2 },
      { name: "Philosophie", coefficient: 2 },
      { name: "Éducation Civique et Morale", coefficient: 1 },
      
    ]
  },
  {
    code: "G3",
    description: "Technique Commerciale",
    subjects: [
      { name: "Technique de Vente et Négociation", coefficient: 3 },
      { name: "Marketing", coefficient: 3 },
      { name: "Communication Commerciale", coefficient: 2 },
      { name: "Droit Commercial", coefficient: 2 },
      { name: "Comptabilité de Base", coefficient: 2 },
      { name: "Informatique de Gestion", coefficient: 2 },
      { name: "Français", coefficient: 2 },
      { name: "Anglais Commercial", coefficient: 2 },
      { name: "Mathématiques Appliquées", coefficient: 2 },
      { name: "Sciences Économiques", coefficient: 2 },
      { name: "Histoire-Géographie", coefficient: 2 },
      { name: "Philosophie", coefficient: 2 },
      { name: "Éducation Civique et Morale", coefficient: 1 },
      
    ]
  },
  {
    code: "E",
    description: "Génie Mécanique (Maintenance Industrielle, etc.)",
    subjects: [
      { name: "Mécanique Appliquée", coefficient: 4 },
      { name: "Technologie de Maintenance", coefficient: 3 },
      { name: "Dessin Industriel", coefficient: 3 },
      { name: "Construction Mécanique", coefficient: 3 },
      { name: "Mathématiques Appliquées", coefficient: 3 },
      { name: "Sciences Physiques", coefficient: 3 },
      { name: "Français", coefficient: 2 },
      { name: "Anglais", coefficient: 2 },
      { name: "Philosophie", coefficient: 2 },
      { name: "Histoire-Géographie", coefficient: 2 },
      { name: "Éducation Civique et Morale", coefficient: 1 },
      
    ]
  },
  {
    code: "Ti/1",
    description: "Techniques Industrielles (Chaudronnerie, Soudage)",
    subjects: [
      { name: "Chaudronnerie", coefficient: 4 },
      { name: "Soudage", coefficient: 4 },
      { name: "Dessin Technique Industriel", coefficient: 3 },
      { name: "Technologie des Matériaux", coefficient: 3 },
      { name: "Mathématiques Appliquées", coefficient: 3 },
      { name: "Sciences Physiques", coefficient: 3 },
      { name: "Français", coefficient: 2 },
      { name: "Anglais", coefficient: 2 },
      { name: "Philosophie", coefficient: 2 },
      { name: "Histoire-Géographie", coefficient: 2 },
      { name: "Éducation Civique et Morale", coefficient: 1 },
    ]
  },
];

// --- SEED FUNCTION ---
async function seed() {
  // 1. Insert universities
  for (const uni of universities) {
    const [uniResult] = await db.query(
      `INSERT INTO universities (name, web_site, description, is_sponsor) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=name`,
      [uni.name, uni.web_site, uni.description, uni.is_sponsor]
    );
    // Get university id
    const [uniRow] = await db.query(`SELECT id FROM universities WHERE name = ?`, [uni.name]);
    const university_id = uniRow[0].id;

    // 2. Insert degrees and link
    for (const deg of uni.degrees) {
      await db.query(
        `INSERT INTO degrees (name, description) VALUES (?, ?) ON DUPLICATE KEY UPDATE name=name`,
        [deg.name, deg.description]
      );
      // Get degree id
      const [degRow] = await db.query(`SELECT id FROM degrees WHERE name = ?`, [deg.name]);
      const degree_id = degRow[0].id;
      // Link university <-> degree
      await db.query(
        `INSERT IGNORE INTO university_degrees (university_id, degree_id) VALUES (?, ?)`,
        [university_id, degree_id]
      );
    }
  }

  // 3. Insert series
  for (const serie of series) {
    await db.query(
      `INSERT INTO series (code, description) VALUES (?, ?) ON DUPLICATE KEY UPDATE code=code`,
      [serie.code, serie.description]
    );
    // Get serie id
    const [serieRow] = await db.query(`SELECT id FROM series WHERE code = ?`, [serie.code]);
    const serie_id = serieRow[0].id;

    // 4. Insert subjects and coefficients
    for (const subj of serie.subjects) {
      await db.query(
        `INSERT INTO subjects (name) VALUES (?) ON DUPLICATE KEY UPDATE name=name`,
        [subj.name]
      );
      // Get subject id
      const [subjRow] = await db.query(`SELECT id FROM subjects WHERE name = ?`, [subj.name]);
      const subject_id = subjRow[0].id;
      // Insert coefficient (réel)
      await db.query(
        `INSERT IGNORE INTO subject_coefficients (subject_id, serie_id, coefficient) VALUES (?, ?, ?)`,
        [subject_id, serie_id, subj.coefficient]
      );
    }
  }

  console.log("Universities, degrees, series, subjects, and coefficients seeded!");
}

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}

