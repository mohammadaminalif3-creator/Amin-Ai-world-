// Amin AI World — content data
// Add new prompts or tools by copying the object pattern below.
// imageEmoji/gradient is used when no real image url is provided.

const PROFILE = {
  name: "Amin",
  channel: "চারপাশে যা দেখছি",
  bio: "AI প্রযুক্তি নিয়ে কাজ করি, বাংলা ভাষায় AI প্রম্পট ও টুলসের তথ্য সবার জন্য সহজলভ্য করার চেষ্টা করছি। এই প্ল্যাটফর্ম একটা ছোট স্বপ্ন থেকে শুরু — যেখানে যে কেউ ফ্রিতে AI দিয়ে সৃজনশীল কাজ শিখতে ও করতে পারবে।",
  youtube: "https://youtube.com/@charpashezadekhchi?si=tvOTfwOs41ndiGW7",
  facebook: "https://www.facebook.com/share/17jjS1diVA/",
  avatarGradient: "linear-gradient(135deg,#7C5CFF,#4DE8FF)"
};

const ARTICLES = [
  {
    id: "a1",
    title: "AI প্রম্পট লেখার ৫টি কৌশল",
    excerpt: "ভালো ফলাফল পেতে প্রম্পটে কী কী থাকা জরুরি — স্টাইল, লাইটিং, ক্যামেরা অ্যাঙ্গেল থেকে শুরু করে রেফারেন্স পর্যন্ত।",
    date: "৩০ জুন, ২০২৬",
    content: "এখানে আপনার পুরো লেখা বসবে। data.js ফাইলে এই content ফিল্ডে যত খুশি লিখতে পারবেন।"
  }
];

const PROMPTS = [
  {
    id: "p1",
    title: "সাইবারপাঙ্ক শহরের রাত",
    titleEn: "Cyberpunk City Night",
    prompt: "A rain-soaked cyberpunk megacity street at night, neon kanji signs reflecting in puddles, flying cars in the distance, cinematic lighting, ultra-detailed, 35mm lens, volumetric fog --ar 16:9",
    tool: "Midjourney",
    tags: ["cyberpunk", "city", "night"],
    gradient: "linear-gradient(135deg,#FF2E63,#1B1B3A)"
  },
  {
    id: "p2",
    title: "বাংলার গ্রামীণ সকাল",
    titleEn: "Bengali Village Morning",
    prompt: "A serene Bengali village at sunrise, mist over green paddy fields, a wooden boat on a calm river, golden light, watercolor painting style, soft pastel tones, highly detailed",
    tool: "DALL·E 3",
    tags: ["bangla", "village", "nature"],
    gradient: "linear-gradient(135deg,#0F9B8E,#1B998B)"
  },
  {
    id: "p3",
    title: "ফ্যান্টাসি ড্রাগন রাইডার",
    titleEn: "Fantasy Dragon Rider",
    prompt: "An armored warrior riding a massive ice dragon above snowy mountain peaks, epic fantasy art, dramatic clouds, dynamic pose, trending on artstation, hyper-detailed scales --ar 9:16",
    tool: "Stable Diffusion",
    tags: ["fantasy", "dragon", "epic"],
    gradient: "linear-gradient(135deg,#4DE8FF,#2541B2)"
  },
  {
    id: "p4",
    title: "মিনিমাল প্রোডাক্ট শট",
    titleEn: "Minimal Product Shot",
    prompt: "Studio product photography of a matte black perfume bottle on a marble pedestal, soft single light source, deep shadows, minimalist background, commercial advertising style, 8k",
    tool: "Midjourney",
    tags: ["product", "minimal", "commercial"],
    gradient: "linear-gradient(135deg,#2D2D2D,#7C5CFF)"
  },
  {
    id: "p5",
    title: "ভবিষ্যতের রোবট প্রতিকৃতি",
    titleEn: "Future Robot Portrait",
    prompt: "Close-up portrait of a humanoid robot with translucent skin showing glowing circuitry, soft rim lighting, photorealistic, shallow depth of field, Unreal Engine 5 render",
    tool: "Leonardo AI",
    tags: ["robot", "portrait", "scifi"],
    gradient: "linear-gradient(135deg,#7C5CFF,#FF6B6B)"
  },
  {
    id: "p6",
    title: "শীতের পাহাড়ি ক্যাবিন",
    titleEn: "Winter Mountain Cabin",
    prompt: "A cozy wooden cabin glowing with warm light, surrounded by snow-covered pine trees, northern lights in the sky, long exposure photography style, peaceful winter night",
    tool: "DALL·E 3",
    tags: ["winter", "cabin", "landscape"],
    gradient: "linear-gradient(135deg,#1B1B3A,#4DE8FF)"
  },
  {
    id: "p7",
    title: "ময়ূরের রঙিন পালক",
    titleEn: "Colorful Peacock Feathers",
    prompt: "Extreme close-up of a peacock's tail feathers fanned out, vibrant iridescent blue and green eye patterns, soft natural light, macro photography, ultra sharp detail, 8k",
    tool: "Midjourney",
    tags: ["bird", "nature", "macro"],
    gradient: "linear-gradient(135deg,#0D9488,#7C5CFF)"
  },
  {
    id: "p8",
    title: "ফ্ল্যামিঙ্গোদের ঝাঁক উড়ে যাওয়া",
    titleEn: "Flock of Flamingos in Flight",
    prompt: "A flock of pink flamingos flying low over a calm lake at sunrise, golden reflection on the water, wings spread wide, nature photography, telephoto lens, 8k detail",
    tool: "DALL·E 3",
    tags: ["bird", "lake", "sunrise"],
    gradient: "linear-gradient(135deg,#FF6B9D,#FFC371)"
  },
  {
    id: "p9",
    title: "পাহাড়ি নদীর বাঁক",
    titleEn: "Winding Mountain River",
    prompt: "Aerial drone view of a turquoise river winding through deep green forest and rocky cliffs, crystal clear water, sunlight glinting on the surface, ultra wide shot, cinematic color grading",
    tool: "Midjourney",
    tags: ["river", "aerial", "nature"],
    gradient: "linear-gradient(135deg,#0EA5E9,#10B981)"
  },
  {
    id: "p10",
    title: "নদীর তীরে সন্ধ্যা",
    titleEn: "Evening by the Riverbank",
    prompt: "A peaceful riverbank at dusk, silhouette of a fisherman in a small boat, soft purple and orange sky reflecting on calm water, traditional Bengali countryside, oil painting style",
    tool: "Stable Diffusion",
    tags: ["river", "bangla", "sunset"],
    gradient: "linear-gradient(135deg,#5B247A,#FF7E5F)"
  },
  {
    id: "p11",
    title: "আকাশ থেকে স্কাইডাইভিং",
    titleEn: "Skydiving from the Sky",
    prompt: "First-person POV of a skydiver free-falling above scattered clouds, sunlight breaking through, patchwork landscape far below, extreme sports photography, GoPro style, high adrenaline composition",
    tool: "Midjourney",
    tags: ["skydiving", "adventure", "sky"],
    gradient: "linear-gradient(135deg,#1E3A8A,#60A5FA)"
  },
  {
    id: "p12",
    title: "প্যারাসুট খোলার মুহূর্ত",
    titleEn: "Parachute Opening Moment",
    prompt: "Dramatic shot of a parachute opening mid-air against a bright blue sky, skydiver silhouette below, wide angle lens, dynamic motion, freeze-frame action photography",
    tool: "DALL·E 3",
    tags: ["skydiving", "action", "extreme"],
    gradient: "linear-gradient(135deg,#0284C7,#FACC15)"
  },
  {
    id: "p13",
    title: "প্যারিসের আইফেল টাওয়ার",
    titleEn: "Eiffel Tower, Paris",
    prompt: "The Eiffel Tower at twilight with warm golden lights, Parisian rooftops in the foreground, soft pastel sky, romantic cinematic atmosphere, travel photography style, 35mm",
    tool: "DALL·E 3",
    tags: ["worldwide", "paris", "landmark"],
    gradient: "linear-gradient(135deg,#7C5CFF,#FFC371)"
  },
  {
    id: "p14",
    title: "জাপানের সাকুরা মৌসুম",
    titleEn: "Japan Cherry Blossom Season",
    prompt: "A traditional Japanese street lined with blooming cherry blossom trees, soft pink petals falling, ancient pagoda in the background, serene atmosphere, anime-inspired art style",
    tool: "Stable Diffusion",
    tags: ["worldwide", "japan", "spring"],
    gradient: "linear-gradient(135deg,#FFB6C1,#FF6B9D)"
  },
  {
    id: "p15",
    title: "সাহারা মরুভূমির রাত",
    titleEn: "Sahara Desert Night",
    prompt: "Vast Sahara desert sand dunes under a starry night sky with the Milky Way visible, a lone camel silhouette, astrophotography style, long exposure, deep blue and orange tones",
    tool: "Midjourney",
    tags: ["worldwide", "desert", "night"],
    gradient: "linear-gradient(135deg,#1B1B3A,#FF7E5F)"
  }
];

const VIDEOS = [
  {
    id: "v1",
    title: "AI দিয়ে তৈরি সিনেমাটিক দৃশ্য (উদাহরণ)",
    titleEn: "Cinematic AI Generated Scene (Example)",
    youtubeId: "REPLACE_WITH_YOUTUBE_ID",
    tool: "Runway",
    prompt: "A drone shot flying through a futuristic city at golden hour, cinematic color grading, smooth camera motion --motion 4 --duration 5s"
  },
  {
    id: "v2",
    title: "ফটোরিয়েলিস্টিক প্রকৃতির দৃশ্য (উদাহরণ)",
    titleEn: "Photorealistic Nature Scene (Example)",
    youtubeId: "REPLACE_WITH_YOUTUBE_ID",
    tool: "Sora",
    prompt: "Ocean waves crashing on a rocky shore at sunset, ultra realistic, slow motion, 4k cinematic footage"
  }
];

const TOOLS = [
  {
    id: "t1",
    name: "ChatGPT",
    category: "টেক্সট / চ্যাট",
    desc: "OpenAI-এর তৈরি কথোপকথনমূলক AI, লেখা, কোড, আইডিয়া ও বিশ্লেষণে সহায়ক।",
    link: "https://chat.openai.com",
    free: true
  },
  {
    id: "t2",
    name: "Midjourney",
    category: "ছবি জেনারেশন",
    desc: "টেক্সট প্রম্পট থেকে উচ্চমানের শৈল্পিক ছবি তৈরির জনপ্রিয় টুল, Discord-ভিত্তিক।",
    link: "https://www.midjourney.com",
    free: false
  },
  {
    id: "t3",
    name: "DALL·E 3",
    category: "ছবি জেনারেশন",
    desc: "OpenAI-এর ছবি জেনারেটর, বিস্তারিত প্রম্পট বোঝায় দক্ষ ও ফটোরিয়েলিস্টিক আউটপুট দেয়।",
    link: "https://openai.com/dall-e-3",
    free: false
  },
  {
    id: "t4",
    name: "Stable Diffusion",
    category: "ছবি জেনারেশন",
    desc: "ওপেন-সোর্স ছবি জেনারেশন মডেল, নিজের কম্পিউটারে বা ফ্রি অনলাইন টুলেও চালানো যায়।",
    link: "https://stability.ai",
    free: true
  },
  {
    id: "t5",
    name: "Claude",
    category: "টেক্সট / চ্যাট",
    desc: "Anthropic-এর তৈরি AI অ্যাসিস্ট্যান্ট, লেখা, কোডিং ও বিশ্লেষণে নির্ভরযোগ্য।",
    link: "https://claude.ai",
    free: true
  },
  {
    id: "t6",
    name: "ElevenLabs",
    category: "ভয়েস / অডিও",
    desc: "টেক্সট-টু-স্পিচ ও ভয়েস ক্লোনিং টুল, প্রাকৃতিক শোনায় এমন কণ্ঠস্বর তৈরি করে।",
    link: "https://elevenlabs.io",
    free: true
  },
  {
    id: "t7",
    name: "Leonardo AI",
    category: "ছবি জেনারেশন",
    desc: "গেম আর্ট ও কনসেপ্ট ডিজাইনের জন্য জনপ্রিয় AI ইমেজ জেনারেটর, ফ্রি ক্রেডিট দেয়।",
    link: "https://leonardo.ai",
    free: true
  },
  {
    id: "t8",
    name: "Runway",
    category: "ভিডিও",
    desc: "AI দিয়ে ভিডিও জেনারেশন ও এডিটিং, টেক্সট-টু-ভিডিও ফিচার সমৃদ্ধ।",
    link: "https://runwayml.com",
    free: false
  },
  {
    id: "t9",
    name: "Gemini",
    category: "টেক্সট / চ্যাট",
    desc: "Google-এর তৈরি AI অ্যাসিস্ট্যান্ট, সার্চ ও Google Workspace-এর সাথে গভীরভাবে যুক্ত।",
    link: "https://gemini.google.com",
    free: true
  },
  {
    id: "t10",
    name: "Perplexity AI",
    category: "সার্চ / রিসার্চ",
    desc: "তথ্যসূত্রসহ উত্তর দেয় এমন AI সার্চ ইঞ্জিন, রিসার্চ ও তথ্য যাচাইয়ের জন্য উপযোগী।",
    link: "https://www.perplexity.ai",
    free: true
  },
  {
    id: "t11",
    name: "Canva AI",
    category: "ডিজাইন",
    desc: "AI দিয়ে পোস্টার, প্রেজেন্টেশন, সোশ্যাল মিডিয়া ডিজাইন সহজে তৈরি করার টুল।",
    link: "https://www.canva.com",
    free: true
  },
  {
    id: "t12",
    name: "Suno AI",
    category: "ভয়েস / অডিও",
    desc: "টেক্সট প্রম্পট থেকে সম্পূর্ণ গান ও সংগীত তৈরি করা যায় এমন AI টুল।",
    link: "https://suno.com",
    free: true
  },
  {
    id: "t13",
    name: "GitHub Copilot",
    category: "কোডিং",
    desc: "AI কোড সহকারী, প্রোগ্রামিং করার সময় কোড সাজেশন ও অটোকমপ্লিট দেয়।",
    link: "https://github.com/features/copilot",
    free: false
  },
  {
    id: "t14",
    name: "Pika",
    category: "ভিডিও",
    desc: "টেক্সট বা ছবি থেকে শর্ট AI ভিডিও তৈরির জনপ্রিয় টুল, ব্যবহার সহজ।",
    link: "https://pika.art",
    free: true
  },
  {
    id: "t15",
    name: "HeyGen",
    category: "ভিডিও",
    desc: "AI অ্যাভাটার ব্যবহার করে টেক্সট থেকে কথা বলা ভিডিও তৈরির টুল।",
    link: "https://www.heygen.com",
    free: true
  },
  {
    id: "t16",
    name: "Notion AI",
    category: "প্রোডাক্টিভিটি",
    desc: "Notion-এর মধ্যেই লেখা, সারাংশ ও আইডিয়া তৈরিতে সহায়ক AI ফিচার।",
    link: "https://www.notion.so/product/ai",
    free: false
  }
];
