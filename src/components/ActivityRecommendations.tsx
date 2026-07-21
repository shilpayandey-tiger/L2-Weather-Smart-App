import { 
  Mountain, 
  Bike, 
  Footprints, 
  Sparkles, 
  AlertTriangle, 
  Shirt, 
  Droplet, 
  TrendingUp,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle
} from "lucide-react";
import { WeatherRecommendation, ActivityRecommendation } from "../types";

interface ActivityRecommendationsProps {
  recommendation: WeatherRecommendation | null;
  isLoading: boolean;
}

export default function ActivityRecommendations({ recommendation, isLoading }: ActivityRecommendationsProps) {
  
  const getActivityIcon = (name: string) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes("hiking") || lowercaseName.includes("hike") || lowercaseName.includes("climb") || lowercaseName.includes("mountain")) {
      return <Mountain className="h-5 w-5" />;
    }
    if (lowercaseName.includes("cycling") || lowercaseName.includes("cycle") || lowercaseName.includes("bike") || lowercaseName.includes("biking")) {
      return <Bike className="h-5 w-5" />;
    }
    if (lowercaseName.includes("running") || lowercaseName.includes("run") || lowercaseName.includes("jogging") || lowercaseName.includes("walk")) {
      return <Footprints className="h-5 w-5" />;
    }
    if (lowercaseName.includes("swim") || lowercaseName.includes("surf") || lowercaseName.includes("sail") || lowercaseName.includes("beach") || lowercaseName.includes("water")) {
      return <Droplet className="h-5 w-5" />;
    }
    return <Sparkles className="h-5 w-5" />;
  };

  const getStatusStyle = (status: ActivityRecommendation["status"]) => {
    switch (status) {
      case "Excellent":
        return {
          badge: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30",
          text: "text-emerald-600 dark:text-emerald-400",
          icon: <Award className="h-4 w-4 text-emerald-500" />,
          barColor: "bg-emerald-500"
        };
      case "Good":
        return {
          badge: "bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-900/30",
          text: "text-sky-600 dark:text-sky-400",
          icon: <CheckCircle2 className="h-4 w-4 text-sky-500" />,
          barColor: "bg-sky-500"
        };
      case "Fair":
        return {
          badge: "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30",
          text: "text-amber-600 dark:text-amber-400",
          icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
          barColor: "bg-amber-500"
        };
      case "Not Recommended":
        return {
          badge: "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30",
          text: "text-rose-600 dark:text-rose-400",
          icon: <XCircle className="h-4 w-4 text-rose-500" />,
          barColor: "bg-rose-500"
        };
      default:
        return {
          badge: "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800",
          text: "text-slate-500 dark:text-slate-400",
          icon: <HelpCircle className="h-4 w-4 text-slate-400" />,
          barColor: "bg-slate-400"
        };
    }
  };

  if (isLoading) {
    return (
      <div id="activity-recommendations-loading" className="bg-white/80 dark:bg-[#111827]/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/70 rounded-3xl p-8 shadow-sm transition-all min-h-[380px] flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-sky-100 dark:border-sky-950 border-t-sky-500 animate-spin" />
          <Sparkles className="h-5 w-5 text-sky-500 absolute animate-pulse" />
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-5">Consulting Gemini Weather Intelligence...</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 text-center max-w-xs leading-relaxed">
          Analyzing humidity, temperatures, wind indices, and precipitation trends for your planning report.
        </p>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div id="activity-recommendations-empty" className="bg-white/80 dark:bg-[#111827]/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/70 rounded-3xl p-8 shadow-sm transition-all min-h-[380px] flex flex-col items-center justify-center text-center">
        <Sparkles className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-4" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No Intelligence Generated</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs leading-relaxed">
          Search for any location above to fetch localized planning recommendations and activity suitability logs.
        </p>
      </div>
    );
  }

  return (
    <div
      id="activity-recommendations-card"
      className="bg-white/80 dark:bg-[#111827]/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/70 rounded-3xl p-6 shadow-sm transition-all relative overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-sky-500" />
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">AI Weather Intelligence</h3>
      </div>

      {/* Main Overall Recommendation Summary Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50/50 to-indigo-50/20 dark:from-sky-950/20 dark:to-indigo-950/10 border border-sky-100/40 dark:border-sky-900/20 mb-6">
        <p id="recommendation-summary" className="text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-300">
          {recommendation.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Score List for Activities */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-2xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
            Outdoor Suitability
          </h4>

          {recommendation.activities.map((activity, idx) => {
            const statusConfig = getStatusStyle(activity.status);
            return (
              <div
                id={`activity-row-${idx}`}
                key={activity.name}
                className="p-4 border border-slate-50 dark:border-slate-800/40 bg-slate-50/20 dark:bg-slate-800/10 rounded-2xl flex flex-col gap-3 hover:border-slate-100 dark:hover:border-slate-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl">
                      {getActivityIcon(activity.name)}
                    </div>
                    <div>
                      <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {activity.name}
                      </h5>
                      <span className="text-3xs text-slate-400 dark:text-slate-500">
                        Activity index
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {activity.score}%
                    </span>
                    <span className={`text-4xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 ${statusConfig.badge}`}>
                      {statusConfig.icon}
                      {activity.status}
                    </span>
                  </div>
                </div>

                {/* Progress bar visualizer */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${statusConfig.barColor}`}
                    style={{ width: `${activity.score}%` }}
                  />
                </div>

                <p className="text-3xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {activity.advice}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: Smart Advice & Preparations */}
        <div className="lg:col-span-5 space-y-4">
          <h4 className="text-2xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
            Active Preparation
          </h4>

          {/* Clothing Guidance Card */}
          <div id="clothing-advice-box" className="p-4 rounded-2xl border border-amber-100/30 dark:border-amber-950/20 bg-amber-50/10 dark:bg-amber-950/5 flex gap-3.5">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 text-amber-500 dark:text-amber-400 rounded-xl h-fit">
              <Shirt className="h-5 w-5" />
            </div>
            <div>
              <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Recommended Apparel
              </h5>
              <p id="clothing-advice-text" className="text-3xs leading-relaxed text-slate-500 dark:text-slate-400 mt-1.5">
                {recommendation.clothingAdvice}
              </p>
            </div>
          </div>

          {/* Hydration Guidance Card */}
          <div id="hydration-advice-box" className="p-4 rounded-2xl border border-sky-100/30 dark:border-sky-950/20 bg-sky-50/10 dark:bg-sky-950/5 flex gap-3.5">
            <div className="p-2.5 bg-sky-50 dark:bg-sky-950/30 text-sky-500 dark:text-sky-400 rounded-xl h-fit">
              <Droplet className="h-5 w-5" />
            </div>
            <div>
              <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Hydration Strategy
              </h5>
              <p id="hydration-advice-text" className="text-3xs leading-relaxed text-slate-500 dark:text-slate-400 mt-1.5">
                {recommendation.hydrationLevel}
              </p>
            </div>
          </div>

          {/* Environmental Health Metric Tip */}
          <div id="environmental-tip-box" className="p-4 rounded-2xl border border-emerald-100/30 dark:border-emerald-950/20 bg-emerald-50/10 dark:bg-emerald-950/5 flex gap-3.5">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 dark:text-emerald-400 rounded-xl h-fit">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Performance Efficiency
              </h5>
              <p className="text-3xs leading-relaxed text-slate-500 dark:text-slate-400 mt-1.5">
                Keep track of sudden thermal shifts, wind gusts, and local barometric changes to stay at peak athletic capacity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
