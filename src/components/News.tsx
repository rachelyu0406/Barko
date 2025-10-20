import { useState, useEffect } from "react";
import {
  Newspaper,
  ExternalLink,
  Calendar,
  TrendingUp,
  Loader,
  AlertCircle,
} from "lucide-react";

type NewsArticle = {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  urlToImage?: string;
};

type NewsProps = {
  country?: string;
  userLocation?: string;
};

export function News({
  country = "US",
  userLocation = "United States",
}: NewsProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<"general" | "business" | "markets">(
    "business"
  );

  const getMockNews = (): NewsArticle[] => {
    console.log("🔵 getMockNews called - returning articles");
    return [
      {
        title:
          "Federal Reserve Holds Interest Rates Steady Amid Economic Uncertainty",
        description:
          "The Federal Reserve announced it will maintain current interest rates as inflation shows signs of cooling while employment remains strong.",
        url: "https://www.federalreserve.gov",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        source: "Financial Times",
        urlToImage:
          "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
      },
      {
        title: "New Study Shows Americans Struggle with Emergency Savings",
        description:
          "A recent survey reveals that 60% of Americans would struggle to cover a $1,000 emergency expense, highlighting the importance of financial literacy.",
        url: "https://www.cnbc.com",
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        source: "CNBC",
        urlToImage:
          "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
      },
      {
        title: "Stock Market Reaches New Highs on Tech Sector Gains",
        description:
          "Major indices climbed to record levels as technology stocks led the rally, with investors showing renewed confidence in growth sectors.",
        url: "https://www.bloomberg.com",
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        source: "Bloomberg",
        urlToImage:
          "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
      },
      {
        title: "Housing Market Shows Signs of Cooling as Mortgage Rates Rise",
        description:
          "Home sales declined for the third consecutive month as higher mortgage rates continue to impact affordability for first-time buyers.",
        url: "https://www.wsj.com",
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        source: "Wall Street Journal",
        urlToImage:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
      },
      {
        title:
          "Cryptocurrency Market Volatility Continues Amid Regulatory Concerns",
        description:
          "Bitcoin and major cryptocurrencies experienced significant price swings as investors await clarity on new regulatory frameworks.",
        url: "https://www.coindesk.com",
        publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        source: "CoinDesk",
        urlToImage:
          "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80",
      },
      {
        title: "Retirement Savings Gap Widens for Younger Generations",
        description:
          "New research indicates millennials and Gen Z workers are falling behind on retirement savings compared to previous generations at the same age.",
        url: "https://www.forbes.com",
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        source: "Forbes",
        urlToImage:
          "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80",
      },
    ];
  };

  useEffect(() => {
    console.log("🟢 News component mounted or category changed:", category);
    fetchNews();
  }, [category, country]);

  const fetchNews = async () => {
    console.log("🟡 fetchNews called");
    setLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_NEWS_API_KEY;
      console.log("🔑 API Key exists:", !!apiKey);

      if (!apiKey) {
        console.log("⚠️ No API key, using mock data");
        const mockData = getMockNews();
        console.log("📰 Mock articles count:", mockData.length);
        setArticles(mockData);
        setLoading(false);
        return;
      }

      const query =
        category === "general"
          ? "personal finance OR savings OR budgeting OR investing"
          : category === "business"
          ? "economy OR business OR financial news"
          : "stock market OR cryptocurrency OR trading";

      const countryCode = getCountryCode(country);
      const url = `https://newsapi.org/v2/top-headlines?country=${countryCode}&category=business&q=${encodeURIComponent(
        query
      )}&pageSize=12&apiKey=${apiKey}`;

      console.log("🌐 Fetching from API:", url.replace(apiKey, "HIDDEN"));
      const response = await fetch(url);
      const data = await response.json();

      console.log("📡 API Response:", data);

      if (data.status === "ok" && data.articles && data.articles.length > 0) {
        const validArticles = data.articles.filter(
          (article: any) =>
            article.title &&
            article.description &&
            article.title !== "[Removed]"
        );
        console.log("✅ Valid articles from API:", validArticles.length);

        if (validArticles.length > 0) {
          setArticles(validArticles);
        } else {
          console.log("⚠️ No valid articles, using mock");
          setArticles(getMockNews());
        }
      } else {
        console.log("⚠️ API response not OK, using mock");
        setArticles(getMockNews());
      }
    } catch (err) {
      console.error("❌ Error fetching news:", err);
      setError("Using sample articles");
      setArticles(getMockNews());
    } finally {
      setLoading(false);
      console.log("✨ Loading complete");
    }
  };

  const getCountryCode = (country: string): string => {
    const countryMap: Record<string, string> = {
      "United States": "us",
      "United Kingdom": "gb",
      Canada: "ca",
      Australia: "au",
      India: "in",
      Germany: "de",
      France: "fr",
      Japan: "jp",
      China: "cn",
      Brazil: "br",
    };
    return countryMap[country] || "us";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  console.log(
    "🎨 Rendering News component - articles:",
    articles.length,
    "loading:",
    loading
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Financial News</h2>
          <p className="text-blue-300 text-sm">
            Stay informed with the latest financial updates
          </p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "business", label: "Business", icon: TrendingUp },
          { id: "markets", label: "Markets", icon: Newspaper },
          { id: "general", label: "Personal Finance", icon: Calendar },
        ].map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                category === cat.id
                  ? "bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500"
                  : "bg-[#0a1f3d] text-blue-300 border-2 border-blue-700/50 hover:border-emerald-500/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-300 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Unable to fetch latest news</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#132a4a] rounded-xl overflow-hidden border border-blue-800/30 hover:border-emerald-500/50 transition-all duration-200 group"
          >
            {article.urlToImage && (
              <div className="relative h-48 overflow-hidden bg-blue-900/20">
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}

            <div className="p-4">
              <div className="flex items-center gap-2 mb-2 text-xs text-blue-400">
                <span className="font-semibold">{article.source}</span>
                <span>•</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>

              <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                {article.title}
              </h3>

              <p className="text-blue-200 text-sm line-clamp-3 mb-3">
                {article.description}
              </p>

              <div className="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
                <span>Read more</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>
        ))}
      </div>

      {articles.length === 0 && !loading && (
        <div className="text-center py-12">
          <Newspaper className="w-16 h-16 text-blue-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            No articles found
          </h3>
          <p className="text-blue-300">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
}
