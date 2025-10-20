import "jsr:@supabase/functions-js/edge-runtime.d.ts";


declare const Deno: any;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    // prefer query param, fall back to body.lang, default to 'en'
    const body = await req.json().catch(() => ({}));
    const qLang = url.searchParams.get("lang") ?? undefined;
    const lang = (qLang || (body as any).lang || "en").toLowerCase();
    const supported = ["en", "fr", "es", "de"];
    const useLang = supported.includes(lang) ? lang : "en";

    const { incomeRange, financialGoals } = body as {
      incomeRange?: string;
      financialGoals?: string;
    };

    const fg = (financialGoals || "").toLowerCase();

    const translations: Record<
      string,
      {
        incomeLabels: Record<string, string>;
        lessons: Record<
          string,
          { title: string; description: string; category: string; whyDefault: string }
        >;
        whyOverrides: {
          debt?: string;
          invest?: string;
          retire?: string;
          house?: string;
          property?: string;
          business?: string;
        };
        personalizedMessage: (incomeLabel: string, goals: string) => string;
      }
    > = {
      en: {
        incomeLabels: {
          under_30k: "under $30,000 per year",
          "30k_60k": "$30,000-$60,000 per year",
          "60k_100k": "$60,000-$100,000 per year",
          "100k_150k": "$100,000-$150,000 per year",
          over_150k: "over $150,000 per year",
          prefer_not_say: "not specified",
        },
        lessons: {
          "1": { title: "Understanding Your Income", description: "Learn how to maximize and manage your income effectively", category: "Income Management", whyDefault: "Understanding income optimization is crucial for achieving your goals." },
          "2": { title: "Building an Emergency Fund", description: "Create a safety net for unexpected expenses", category: "Savings", whyDefault: "Emergency funds are the foundation of financial security." },
          "3": { title: "Budgeting Basics", description: "Master the 50/30/20 rule and track your spending", category: "Budgeting", whyDefault: "A solid budget helps you allocate resources toward your goals." },
          "4": { title: "Understanding Credit Scores", description: "Learn what affects your credit and how to improve it", category: "Credit", whyDefault: "Good credit opens doors to better financial opportunities." },
          "5": { title: "Debt Management Strategies", description: "Learn effective methods to pay off debt", category: "Debt", whyDefault: "Managing debt efficiently frees up money for savings and investments." },
          "6": { title: "Introduction to Investing", description: "Understand stocks, bonds, and index funds", category: "Investing", whyDefault: "Investing is key to building long-term wealth." },
          "7": { title: "Retirement Planning 101", description: "Start planning for your future today", category: "Retirement", whyDefault: "The earlier you start planning for retirement, the better." },
          "8": { title: "Tax Optimization", description: "Learn legal ways to reduce your tax burden", category: "Taxes", whyDefault: "Understanding taxes helps you keep more of your earnings." },
          "9": { title: "Real Estate Investing", description: "Explore property investment opportunities", category: "Investing", whyDefault: "Real estate can be a powerful wealth-building tool." },
          "10": { title: "Building Passive Income", description: "Create income streams that work for you", category: "Income Management", whyDefault: "Passive income provides financial freedom and security." },
        },
        whyOverrides: {
          debt: "This directly addresses your goal of managing debt.",
          invest: "This will help you achieve your investment goals.",
          retire: "Essential for achieving your retirement goals.",
          house: "This aligns with your real estate goals.",
          property: "This aligns with your real estate goals.",
          business: "This supports your entrepreneurial aspirations.",
        },
        personalizedMessage: (incomeLabel, goals) =>
          `Based on your income range (${incomeLabel}) and goals (${goals}), we've created a personalized learning path to help you achieve financial success.`,
      },

      fr: {
        incomeLabels: {
          under_30k: "moins de 30 000 $ par an",
          "30k_60k": "30 000 $-60 000 $ par an",
          "60k_100k": "60 000 $-100 000 $ par an",
          "100k_150k": "100 000 $-150 000 $ par an",
          over_150k: "plus de 150 000 $ par an",
          prefer_not_say: "non spécifié",
        },
        lessons: {
          "1": { title: "Comprendre vos revenus", description: "Apprenez à maximiser et gérer efficacement vos revenus", category: "Gestion des revenus", whyDefault: "Comprendre l'optimisation des revenus est crucial pour atteindre vos objectifs." },
          "2": { title: "Construire un fonds d'urgence", description: "Créez un filet de sécurité pour les dépenses imprévues", category: "Épargne", whyDefault: "Les fonds d'urgence sont la base de la sécurité financière." },
          "3": { title: "Notions de base du budget", description: "Maîtrisez la règle 50/30/20 et suivez vos dépenses", category: "Budgétisation", whyDefault: "Un budget solide vous aide à allouer des ressources vers vos objectifs." },
          "4": { title: "Comprendre les scores de crédit", description: "Apprenez ce qui affecte votre crédit et comment l'améliorer", category: "Crédit", whyDefault: "Un bon crédit ouvre des opportunités financières." },
          "5": { title: "Stratégies de gestion de la dette", description: "Apprenez des méthodes efficaces pour rembourser la dette", category: "Dette", whyDefault: "Gérer la dette efficacement libère de l'argent pour l'épargne et l'investissement." },
          "6": { title: "Introduction à l'investissement", description: "Comprendre actions, obligations et fonds indiciels", category: "Investissement", whyDefault: "L'investissement est essentiel pour construire la richesse à long terme." },
          "7": { title: "Planification de la retraite 101", description: "Commencez à planifier votre avenir dès aujourd'hui", category: "Retraite", whyDefault: "Plus vous commencez tôt la planification de la retraite, mieux c'est." },
          "8": { title: "Optimisation fiscale", description: "Apprenez des moyens légaux de réduire votre charge fiscale", category: "Impôts", whyDefault: "Comprendre les impôts vous aide à conserver davantage de vos revenus." },
          "9": { title: "Investissement immobilier", description: "Explorez les opportunités d'investissement immobilier", category: "Investissement", whyDefault: "L'immobilier peut être un outil puissant de création de richesse." },
          "10": { title: "Créer des revenus passifs", description: "Créez des sources de revenus qui travaillent pour vous", category: "Gestion des revenus", whyDefault: "Les revenus passifs offrent liberté et sécurité financières." },
        },
        whyOverrides: {
          debt: "Cela répond directement à votre objectif de gestion de la dette.",
          invest: "Cela vous aidera à atteindre vos objectifs d'investissement.",
          retire: "Essentiel pour atteindre vos objectifs de retraite.",
          house: "Cela correspond à vos objectifs immobiliers.",
          property: "Cela correspond à vos objectifs immobiliers.",
          business: "Cela soutient vos aspirations entrepreneuriales.",
        },
        personalizedMessage: (incomeLabel, goals) =>
          `En fonction de votre tranche de revenus (${incomeLabel}) et de vos objectifs (${goals}), nous avons créé un parcours d'apprentissage personnalisé pour vous aider à réussir financièrement.`,
      },

      es: {
        incomeLabels: {
          under_30k: "menos de $30,000 al año",
          "30k_60k": "$30,000-$60,000 al año",
          "60k_100k": "$60,000-$100,000 al año",
          "100k_150k": "$100,000-$150,000 al año",
          over_150k: "más de $150,000 al año",
          prefer_not_say: "no especificado",
        },
        lessons: {
          "1": { title: "Comprender sus ingresos", description: "Aprenda a maximizar y gestionar sus ingresos de manera efectiva", category: "Gestión de ingresos", whyDefault: "Comprender la optimización de ingresos es crucial para alcanzar sus metas." },
          "2": { title: "Crear un fondo de emergencia", description: "Cree una red de seguridad para gastos inesperados", category: "Ahorro", whyDefault: "Los fondos de emergencia son la base de la seguridad financiera." },
          "3": { title: "Conceptos básicos de presupuestos", description: "Domine la regla 50/30/20 y registre sus gastos", category: "Presupuesto", whyDefault: "Un presupuesto sólido le ayuda a asignar recursos hacia sus metas." },
          "4": { title: "Comprender puntajes de crédito", description: "Aprenda qué afecta su crédito y cómo mejorarlo", category: "Crédito", whyDefault: "Un buen crédito abre puertas a mejores oportunidades financieras." },
          "5": { title: "Estrategias de gestión de deuda", description: "Aprenda métodos efectivos para pagar deudas", category: "Deuda", whyDefault: "Gestionar la deuda eficientemente libera dinero para ahorro e inversión." },
          "6": { title: "Introducción a la inversión", description: "Comprenda acciones, bonos y fondos indexados", category: "Inversión", whyDefault: "Invertir es clave para construir riqueza a largo plazo." },
          "7": { title: "Planificación de jubilación 101", description: "Comience a planificar su futuro hoy", category: "Jubilación", whyDefault: "Cuanto antes empiece a planificar la jubilación, mejor." },
          "8": { title: "Optimización fiscal", description: "Aprenda formas legales de reducir su carga fiscal", category: "Impuestos", whyDefault: "Entender los impuestos le ayuda a conservar más de sus ingresos." },
          "9": { title: "Inversión en bienes raíces", description: "Explore oportunidades de inversión en propiedades", category: "Inversión", whyDefault: "Los bienes raíces pueden ser una poderosa herramienta para crear riqueza." },
          "10": { title: "Construir ingresos pasivos", description: "Cree fuentes de ingresos que trabajen para usted", category: "Gestión de ingresos", whyDefault: "Los ingresos pasivos brindan libertad y seguridad financiera." },
        },
        whyOverrides: {
          debt: "Esto aborda directamente su objetivo de gestionar la deuda.",
          invest: "Esto le ayudará a lograr sus objetivos de inversión.",
          retire: "Es esencial para alcanzar sus objetivos de jubilación.",
          house: "Esto se alinea con sus objetivos inmobiliarios.",
          property: "Esto se alinea con sus objetivos inmobiliarios.",
          business: "Esto respalda sus aspiraciones empresariales.",
        },
        personalizedMessage: (incomeLabel, goals) =>
          `Según su rango de ingresos (${incomeLabel}) y sus objetivos (${goals}), hemos creado una ruta de aprendizaje personalizada para ayudarle a alcanzar el éxito financiero.`,
      },

      de: {
        incomeLabels: {
          under_30k: "unter $30.000 pro Jahr",
          "30k_60k": "$30.000-$60.000 pro Jahr",
          "60k_100k": "$60.000-$100.000 pro Jahr",
          "100k_150k": "$100.000-$150.000 pro Jahr",
          over_150k: "über $150.000 pro Jahr",
          prefer_not_say: "nicht angegeben",
        },
        lessons: {
          "1": { title: "Ihr Einkommen verstehen", description: "Lernen Sie, wie Sie Ihr Einkommen effektiv maximieren und verwalten", category: "Einkommensverwaltung", whyDefault: "Das Verständnis der Einkommensoptimierung ist entscheidend, um Ihre Ziele zu erreichen." },
          "2": { title: "Aufbau eines Notfallfonds", description: "Erstellen Sie ein Sicherheitsnetz für unerwartete Ausgaben", category: "Sparen", whyDefault: "Notfallfonds sind die Grundlage finanzieller Sicherheit." },
          "3": { title: "Budget-Grundlagen", description: "Meistern Sie die 50/30/20-Regel und verfolgen Sie Ihre Ausgaben", category: "Budgetierung", whyDefault: "Ein solides Budget hilft Ihnen, Mittel effektiv zuzuweisen." },
          "4": { title: "Kreditwürdigkeit verstehen", description: "Erfahren Sie, was Ihre Kreditwürdigkeit beeinflusst und wie Sie sie verbessern", category: "Kredit", whyDefault: "Gute Kreditwürdigkeit öffnet Türen zu besseren finanziellen Möglichkeiten." },
          "5": { title: "Schuldenmanagement-Strategien", description: "Lernen Sie effektive Methoden zur Tilgung von Schulden", category: "Schulden", whyDefault: "Effizientes Schuldenmanagement schafft Geld für Ersparnisse und Investitionen frei." },
          "6": { title: "Einführung in Investitionen", description: "Verstehen Sie Aktien, Anleihen und Indexfonds", category: "Investieren", whyDefault: "Investieren ist der Schlüssel zum langfristigen Vermögensaufbau." },
          "7": { title: "Altersvorsorge 101", description: "Beginnen Sie noch heute mit der Planung Ihrer Zukunft", category: "Rente", whyDefault: "Je früher Sie mit der Altersvorsorge beginnen, desto besser." },
          "8": { title: "Steueroptimierung", description: "Lernen Sie legale Wege, Ihre Steuerlast zu reduzieren", category: "Steuern", whyDefault: "Das Verständnis von Steuern hilft Ihnen, mehr von Ihrem Einkommen zu behalten." },
          "9": { title: "Immobilieninvestitionen", description: "Erkunden Sie Immobilieninvestitionsmöglichkeiten", category: "Investieren", whyDefault: "Immobilien können ein mächtiges Instrument zum Vermögensaufbau sein." },
          "10": { title: "Aufbau passiver Einkünfte", description: "Schaffen Sie Einkommensströme, die für Sie arbeiten", category: "Einkommensverwaltung", whyDefault: "Passive Einkünfte bieten finanzielle Freiheit und Sicherheit." },
        },
        whyOverrides: {
          debt: "Dies behandelt direkt Ihr Ziel der Schuldenverwaltung.",
          invest: "Dies hilft Ihnen, Ihre Investitionsziele zu erreichen.",
          retire: "Wesentlich, um Ihre Rentenziele zu erreichen.",
          house: "Dies entspricht Ihren Immobilienzielen.",
          property: "Dies entspricht Ihren Immobilienzielen.",
          business: "Dies unterstützt Ihre unternehmerischen Bestrebungen.",
        },
        personalizedMessage: (incomeLabel, goals) =>
          `Basierend auf Ihrer Einkommensspanne (${incomeLabel}) und Ihren Zielen (${goals}) haben wir einen personalisierten Lernpfad erstellt, um Ihnen zum finanziellen Erfolg zu verhelfen.`,
      },
    };

    const t = translations[useLang];

    const incomeLabel = t.incomeLabels[incomeRange as string] ?? t.incomeLabels["prefer_not_say"];

    const baseIds = ["1","2","3","4","5","6","7","8","9","10"];
    const lessons = baseIds.map((id) => {
      const lesson = t.lessons[id];
      // compute why text: prefer override if keyword found in financialGoals
      let why = lesson.whyDefault;
      if (fg.includes("debt") && t.whyOverrides.debt && id === "5") why = t.whyOverrides.debt;
      if (fg.includes("invest") && t.whyOverrides.invest && id === "6") why = t.whyOverrides.invest;
      if ((fg.includes("retire") || fg.includes("retirement")) && t.whyOverrides.retire && id === "7") why = t.whyOverrides.retire;
      if ((fg.includes("house") || fg.includes("property")) && t.whyOverrides.house && id === "9") why = t.whyOverrides.house;
      if (fg.includes("business") && t.whyOverrides.business && id === "10") why = t.whyOverrides.business;

      // special case for lesson 1 to include incomeLabel in 'why' sentence when English-like pattern exists
      if (id === "1") {
        if (useLang === "en") {
          why = `With an income ${incomeLabel}, ${lesson.whyDefault}`;
        } else if (useLang === "fr") {
          why = `Avec un revenu ${incomeLabel}, ${lesson.whyDefault}`;
        } else if (useLang === "es") {
          why = `Con un ingreso ${incomeLabel}, ${lesson.whyDefault}`;
        } else if (useLang === "de") {
          why = `Bei einem Einkommen von ${incomeLabel} ist ${lesson.whyDefault}`;
        }
      }

      return {
        id,
        title: lesson.title,
        description: lesson.description,
        category: lesson.category,
        // keep difficulty and estimatedMinutes same as original
        difficulty: (() => {
          const map: Record<string, number> = { "1": 1, "2": 1, "3": 2, "4": 2, "5": 3, "6": 3, "7": 4, "8": 4, "9": 5, "10": 5 };
          return map[id] ?? 1;
        })(),
        estimatedMinutes: (() => {
          const map: Record<string, number> = { "1": 8, "2": 10, "3": 12, "4": 10, "5": 15, "6": 15, "7": 12, "8": 15, "9": 18, "10": 20 };
          return map[id] ?? 10;
        })(),
        why,
      };
    });

    const plan = {
      lessons,
      recommendedPath: lessons.map((l) => l.id),
      estimatedCompletionWeeks: Math.ceil(lessons.length / 2),
      personalizedMessage: t.personalizedMessage(incomeLabel, financialGoals || ""),
      language: useLang,
    };

    return new Response(JSON.stringify(plan), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message || String(error) }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
