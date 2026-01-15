import {
  Users,
  GraduationCap,
  Building,
  Target,
  TrendingUp,
  Clock,
} from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "15,000+",
    label: "Étudiants accompagnés",
    description: "Depuis notre lancement",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: GraduationCap,
    value: "95%",
    label: "Taux de satisfaction",
    description: "Utilisateurs satisfaits",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: Building,
    value: "500+",
    label: "Universités partenaires",
    description: "En France et à l'international",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    icon: Target,
    value: "12,000+",
    label: "Recommandations générées",
    description: "Par notre intelligence artificielle",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    icon: TrendingUp,
    value: "89%",
    label: "Taux de réussite",
    description: "Dans les formations choisies",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    icon: Clock,
    value: "10 min",
    label: "Résultats obtenus",
    description: "Temps moyen pour les premières recommandations",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
];

export default function StatsSection() {
  return (
    <section className="py-12 bg-gradient-to-r from-primary/5 to-primary/10">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="inline-flex items-center justify-center p-3 rounded-full mb-4 transition-transform group-hover:scale-110">
                <div
                  className={`${stat.bgColor} ${stat.color} p-3 rounded-full`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
