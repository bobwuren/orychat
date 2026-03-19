/**
 * OrientysLogo
 *
 * SVG fidèle au logo Orientys :
 *   - Bonnet de diplômé bleu indigo (#1e1b6e)
 *   - Plans / chevrons violet-bleu (#6b5dd3)
 *   - Cordon sombre (#0f0d2e)
 *
 * Props :
 *   size      — taille en pixels du carré englobant (défaut : 32)
 *   className — classes Tailwind additionnelles
 *
 * Usage :
 *   <OrientysLogo size={32} />
 *   <OrientysLogo size={40} className="opacity-90" />
 */

interface OrientysLogoProps {
  size?: number;
  className?: string;
}

export default function OrientysLogo({
  size = 32,
  className = "",
}: OrientysLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Orientys"
    >
      {/* Plan supérieur du bonnet — bleu indigo */}
      <polygon points="50,8 95,30 50,52 5,30" fill="#1e1b6e" />

      {/* Côtés du bonnet */}
      <polygon points="5,30 5,38 50,60 50,52" fill="#17145a" />
      <polygon points="95,30 95,38 50,60 50,52" fill="#252099" />

      {/* Plans intérieurs violet-bleu */}
      <polygon points="50,52 80,38 80,44 50,58" fill="#6b5dd3" opacity="0.95" />
      <polygon points="50,52 20,38 20,44 50,58" fill="#6b5dd3" opacity="0.95" />

      {/* Cordon */}
      <line
        x1="72"
        y1="30"
        x2="72"
        y2="56"
        stroke="#0f0d2e"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="72"
        y1="56"
        x2="62"
        y2="68"
        stroke="#0f0d2e"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Pompon */}
      <polygon points="62,68 58,72 66,72" fill="#0f0d2e" />
    </svg>
  );
}
