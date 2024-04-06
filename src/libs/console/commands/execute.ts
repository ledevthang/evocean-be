import { PrismaService } from "@root/libs/prisma/prisma.service";
import { Command, CommandRunner } from "nest-commander";

@Command({
  name: "hi"
})
export class ExecuteCommand extends CommandRunner {
  constructor(private prisma: PrismaService) {
    super();
  }

  async run() {
    for (const theme of data) {
      let media = {
        pages: theme.pages,
        format: theme.format,
        previews: theme.images,
        categories: theme.categories,
        hightlight: theme.highlight,
        live_preview: (theme as any)?.preview,
        figma_features: theme.figma_features,
        template_features: theme.template_features
      };

      await this.prisma.theme.create({
        data: {
          media,
          name: theme.name,
          overview: theme.description,
          zip_link:
            (theme as any).zip_link ||
            "https://firebasestorage.googleapis.com/v0/b/evocean-25bc7.appspot.com/o/themes%2Fzip%2FUUSqBovw%2F1712197966140_themeforest_UUSqBovw_gamfi_metaverse_web3_igo_launchpad_next_js.zip?alt=media&token=ab731a59-e367-4986-8167-ce13dd6d75bb"
        }
      });
    }

    console.log("done");

    return Promise.resolve(void 0);
  }
}

const data = [
  {
    name: "Sphere — NFT Template",
    description:
      "If you're operating in the Web3 NFT industry and looking to enhance your digital presence, our landing page template can help. Our template has been tailored to meet the specific needs of companies in the NFT space and offers a seamless experience with a modern design. By integrating blockchain technology into your landing page, you can give your business a competitive edge in the market. Our template also comes with comprehensive features and a user-friendly interface. You can easily create a stunning landing page that will capture your audience's attention and help you stand out in the crowded market. The landing page is ideal for launching new projects or promoting existing ones. With the rapidly-growing NFT industry, it's more important than ever to have a professional digital presence. Our landing page template can help you achieve just that, giving your NFT business the edge it needs to succeed. So, why wait? Get started today and take your NFT business to the next level!",
    categories: ["NFT Template", "Web3", "Template"],
    template_features: [
      "Animations & Effects",
      "Color Styles",
      "Components",
      "Carousel",
      "CMS",
      "Link Styles",
      "SEO & Performance",
      "Text Styles",
      "Web Fonts",
      "Responsive",
      "Optimized Accessibility"
    ],
    figma_features: ["Auto layout", "Scroll Sections"],
    pages: [
      "Home",
      "About",
      "Discover",
      "Community",
      "Blog",
      "Careers",
      "Contact",
      "Terms of Service",
      "Privacy Policy",
      "404"
    ],
    highlight: ["Auto dark Theme"],
    format: ["Framer"],
    images: [
      "https://framerusercontent.com/images/UnwjWV8lGzLZ4SIkd1eoECzakQ.png?scale-down-to=1024",
      "https://framerusercontent.com/images/yBlMlHx5fEQV6NRuTEppmDefVE.png?scale-down-to=1024",
      "https://framerusercontent.com/images/c5lgSptpIxtSAkyhDJMwtPtMc.png?scale-down-to=1024"
    ],
    preview: "https://spherenft.framer.ai/",
    zip_link:
      "https://firebasestorage.googleapis.com/v0/b/evocean-25bc7.appspot.com/o/themes%2Fzip%2FUUSqBovw%2F1712197966140_themeforest_UUSqBovw_gamfi_metaverse_web3_igo_launchpad_next_js.zip?alt=media&token=ab731a59-e367-4986-8167-ce13dd6d75bb"
  },
  {
    name: "NextAI — SaaS & AI Website Template",
    description:
      "Meet NextAI, the ultimate website template tailored for AI startups and services, presenting a sleek, modern design as cutting-edge as your ideas. This template serves as the perfect toolkit, enabling you to establish a stunning digital presence swiftly and affordably. Whether you're introducing groundbreaking technologies or innovative solutions, NextAI's design seamlessly aligns with the futuristic nature of AI, capturing the essence of your vision. The user-friendly interface ensures a seamless navigation experience for visitors, while the template's affordability makes it an accessible choice for startups looking to make a powerful impact online. Elevate your AI venture with NextAI, where design meets innovation to reflect the uniqueness of your ideas in the digital landscape.",
    categories: ["AI Web", "Web3", "Template", "SaaS"],
    template_features: ["Breakpoints", "Scroll Sections", "Text Styles", "CMS"],
    figma_features: ["Auto layout", "Scroll Sections"],
    pages: ["Home", "Features", "Pricing", "Contact Us", "Blog", "Blog Page"],
    highlight: [
      "Auto Dark Theme",
      "Toolkit",
      "Works in Figma & Framer",
      "6+ pages",
      "15+ Section Layout",
      "Free Figma file included"
    ],
    format: ["Figma"],
    images: [
      "https://framerusercontent.com/images/04UXATrmIwNZc70Nwn6nnbBYRU.jpg?scale-down-to=1024",
      "https://framerusercontent.com/images/11KSGbIZoRSg4pjdnUoif6MKHI.svg",
      "https://framerusercontent.com/images/2qpl8UQkAndtCWoKgO6GxgIr0Pk.jpg?scale-down-to=1024"
    ],
    preview: "https://nextai.framer.website/",
    zip_link:
      "https://firebasestorage.googleapis.com/v0/b/evocean-25bc7.appspot.com/o/themes%2Fzip%2FUUSqBovw%2F1712197966140_themeforest_UUSqBovw_gamfi_metaverse_web3_igo_launchpad_next_js.zip?alt=media&token=ab731a59-e367-4986-8167-ce13dd6d75bb"
  },
  {
    name: "Coinfluence — Web3 Template",
    description:
      "Introducing Coinfluence - a revolutionary Framer website template designed specifically for Web3 projects. With its unparalleled layout and distinctive design, Coinfluence provides a unique platform to showcase your vision in the decentralized realm. Whether you're launching a blockchain-based platform, a cryptocurrency project, or a decentralized application, Coinfluence empowers you to captivate audiences and communicate your mission with clarity and style. Say goodbye to generic website templates and embrace Coinfluence - where innovation meets design to propel your Web3 project to new heights of success.",
    categories: ["Web3", "Template"],
    template_features: [
      "Animations & Effects",
      "Color Styles",
      "Components",
      "Carousel",
      "CMS",
      "Link Styles",
      "SEO & Performance",
      "Text Styles",
      "Web Fonts",
      "Responsive",
      "Optimized Accessibility"
    ],
    figma_features: ["Auto layout", "Scroll Sections"],
    pages: ["Home", "Features", "Pricing", "Contact Us", "Blog", "Blog Page"],
    highlight: [
      "Auto Dark Theme",
      "Works in Figma & Framer",
      "6+ pages",
      "Free Figma file include"
    ],
    format: ["Figma", "Framer"],
    images: [
      "https://framerusercontent.com/images/O2k5ygbGStvSEEAOA5wE9ZkFFVQ.jpg?scale-down-to=1024",
      "https://framerusercontent.com/images/gB2PX1li1BlVN3rYiC2uFfn1m4.jpg?scale-down-to=1024",
      "https://framerusercontent.com/images/MOtxekWopUYDdiuhJkghTsSXk.jpg?scale-down-to=1024"
    ],
    preview: "https://coinfluence.framer.website/",
    zip_link:
      "https://firebasestorage.googleapis.com/v0/b/evocean-25bc7.appspot.com/o/themes%2Fzip%2FUUSqBovw%2F1712197966140_themeforest_UUSqBovw_gamfi_metaverse_web3_igo_launchpad_next_js.zip?alt=media&token=ab731a59-e367-4986-8167-ce13dd6d75bb"
  },
  {
    name: "Space3 — SaaS Template",
    description:
      "Unlock the limitless potential of your online presence with Space3, the epitome of modern SaaS website templates. Space3 is meticulously engineered to redefine user experience and perfection down to the smallest detail. It's not just a template; it's your gateway to online success. Experience Elevated: Space3 is more than a design; it's a journey. Crafted with precision and a keen eye for aesthetics, every pixel and every element has been thoughtfully arranged to provide an exceptional user experience. From the seamless navigation to the striking visuals, your website will leave a lasting impression on every visitor. Conversion Catalyst: In the competitive digital landscape, converting visitors into loyal customers is the name of the game. Space3 empowers you with the tools and features needed to turn casual visitors into devoted patrons. Our template is optimized for lead generation, ensuring that your business goals are not just met but exceeded. Stand Out, Shine Bright: With Space3, you don't blend in; you stand out. Your online presence will be unique, capturing the essence of your brand and making you instantly recognizable. Say goodbye to cookie-cutter websites and hello to a digital identity that's as distinctive as your business. Reach for the Stars: Your business goals are our mission. Space3 equips you with the power to reach for the stars and beyond. Whether you're looking to expand your audience, increase revenue, or establish industry dominance, our template is your trusted companion on the path to success. Why Space3? Cutting-edge design tailored for modern businesses User-centric experience for increased engagement Conversion-focused features for higher ROI Unparalleled uniqueness that sets you apart Business-driven solutions to achieve your objectives Make Space3 your choice and watch your online presence soar to new heights. Elevate your brand, captivate your audience, and achieve digital excellence like never before. It's time to launch your success story – with Space3, the possibilities are infinite. Take the first step toward online greatness. Explore Space3 today and discover the future of web design. Your journey to digital excellence starts here.",
    categories: ["Web3", "SaaS", "Template"],
    template_features: ["Breakpoints", "Scroll Sections", "Text Styles", "CMS"],
    figma_features: ["Auto layout", "Scroll Sections"],
    pages: [
      "Home",
      "Features",
      "Pricing",
      "Intergration",
      "Docs",
      "Changelog",
      "Contact",
      "Privacy"
    ],
    highlight: [
      "Premium and high quality files",
      "100% Customizable and easy to use",
      "8+ pages",
      "Free Figma file include"
    ],
    format: ["Figma"],
    images: [
      "https://framerusercontent.com/images/RbqI1SuJYAsC2ccUt66zMqjMMg.png?scale-down-to=1024",
      "https://framerusercontent.com/images/3yDj0eVW2cunLeqqVnN2TmWZYU.png?scale-down-to=1024",
      "https://framerusercontent.com/images/i1aRc9reofmxSOF1qYmK92WiQA.png?scale-down-to=1024"
    ],
    preview: "https://space3.framer.website/",
    zip_link:
      "https://firebasestorage.googleapis.com/v0/b/evocean-25bc7.appspot.com/o/themes%2Fzip%2FUUSqBovw%2F1712197966140_themeforest_UUSqBovw_gamfi_metaverse_web3_igo_launchpad_next_js.zip?alt=media&token=ab731a59-e367-4986-8167-ce13dd6d75bb"
  },
  {
    name: "X-Wallet: Crypto Wallet Premium UI Kits App",
    description:
      "The X-Wallet app is a secure and easy-to-use way to store, send, receive, and exchange cryptocurrencies. It is a good option for users who are looking for a mobile wallet that supports a wide range of cryptocurrencies and offers a variety of features.\n\n✨ App Features:\n✔ Store, send, receive, and exchange cryptocurrencies\n✔ Buy cryptocurrencies with a credit card or bank transfer\n✔ View real-time cryptocurrency prices\n✔ Set up price alerts\n✔ Track your cryptocurrency investments\n✔ Secure your wallet with two-factor authentication\n✔ Back up your wallet with a recovery phrase\n\n🎛️ Here are some additional details about the X-Wallet app:\n- The app supports a wide range of cryptocurrencies, including Bitcoin, Ethereum, Litecoin, and Dogecoin.\n- You can buy cryptocurrencies with a credit card or bank transfer through a third-party partner.\n- The app provides real-time cryptocurrency prices from a variety of sources.\n- You can set up price alerts to be notified when the price of a cryptocurrency reaches a certain level.\n- The app allows you to track your cryptocurrency investments over time.\n\nThis Crypto UI Kit is suitable for:\n✡ Cryptocurrency App\n✡ Crypto Trading App\n✡ Crypto Tracking App\n✡ Crypto Stock Market App\n✡ Crypto Wallet App\n✡ Crypto Investment App\n✡ Crypto Exchange App\n✡ Crypto Finance App",
    categories: ["Smart Wallet", "UI Kits", "App"],
    template_features: [
      "Store, send, receive, and exchange cryptocurrencies",
      "Buy cryptocurrencies with a credit card or bank transfer",
      "View real-time cryptocurrency prices",
      "Set up price alerts",
      "Track your cryptocurrency investments",
      "Secure your wallet with two-factor authentication",
      "Back up your wallet with a recovery phrase"
    ],
    figma_features: ["Auto layout"],
    pages: [
      "Home",
      "Buy&Sell",
      "Send",
      "Swap",
      "Menu",
      "Import Token",
      "Login",
      "Support"
    ],
    highlight: [
      "35+ Screen",
      "Editable Component Library",
      "Made with Google Font",
      "Pixel Perfect",
      "Modern and minimalist style",
      "Global style guide"
    ],
    format: ["Figma"],
    images: [
      "https://images.ui8.net/uploads/feature-1_1693658734867.png",
      "https://images.ui8.net/uploads/feature-2_1693658739496.png",
      "https://images.ui8.net/uploads/feature-3_1693658758832.png",
      "https://images.ui8.net/uploads/feature-4_1693658776100.png",
      "https://images.ui8.net/uploads/feature-6_1693658797358.png",
      "https://images.ui8.net/uploads/feature-5_1693658814248.png"
    ],
    zip_link:
      "https://firebasestorage.googleapis.com/v0/b/evocean-25bc7.appspot.com/o/themes%2Fzip%2FUUSqBovw%2F1712197966140_themeforest_UUSqBovw_gamfi_metaverse_web3_igo_launchpad_next_js.zip?alt=media&token=ab731a59-e367-4986-8167-ce13dd6d75bb"
  },
  {
    name: "Secury — Blockchain & Web3 Business Template",
    description:
      "I am excited to share with you the latest offering in the world of blockchain and web3 projects - Secury. This Framer template is the ultimate solution for your needs, providing a versatile and easy-to-use platform to help you build and design your dream website. With 9 complete website designs tailored specifically for blockchain and web3 businesses, Secury offers endless possibilities. Whether you are a startup or an established business, Secury caters to all your requirements. The template is designed to be user-friendly, allowing you to easily navigate through the various options and customize your website to fit your brand and style. Its clean and modern design ensures a seamless user experience for visitors, making your website stand out from the rest. So why wait? Take your blockchain and web3 projects to the next level with Secury. Get started today and experience the ultimate in Framer templates.",
    categories: ["Web3", "Template", "Blockchain"],
    template_features: [
      "Animations & Effects",
      "Color Styles",
      "Components",
      "Carousel",
      "CMS",
      "Link Styles",
      "SEO & Performance",
      "Text Styles",
      "Web Fonts",
      "Responsive",
      "Optimized Accessibility"
    ],
    figma_features: ["Auto layout", "Scroll Sections"],
    pages: [
      "Home",
      "Company",
      "Resources",
      "Resources Details",
      "News",
      "Contact",
      "Term",
      "Privacy",
      "404"
    ],
    highlight: [
      "8+ pages",
      "Customizable Useful Components",
      "Light & Dark Theme",
      "Neatly organized and layered",
      "Simple, Clean, and Modern Design"
    ],
    format: ["Figma", "Framer"],
    images: [
      "https://framerusercontent.com/images/5tqXPzxDzjloEivUJBVMAg0M1k.jpg?scale-down-to=1024",
      "https://framerusercontent.com/images/lyxioq2lsFfNHF7FZw6JabPE.jpg?scale-down-to=1024",
      "https://framerusercontent.com/images/b4gDsIaqGGgtFD1DIjDSqlii1jw.jpg?scale-down-to=1024"
    ],
    preview: "https://secury.framer.website/?via=framerbite"
  },
  {
    name: "NFT Distro - NFT Website UI Design KIT",
    description:
      "NFT Distro - NFT Website UI Design KIT. We designed a highly detailed apps screen and certainly clean, so you can use it in your project.\n\nWhat will you get?\n- 15+ Screens\n- Vector-Based\n- Well organized layer\n- Free use google font\n\nCompatibility\n- Figma\n\n100% vector editable and scalable. The color is easy to change. Each illustration is organized, named & very easy to use.",
    categories: ["NFT", "UIKit", "Web3"],
    template_features: [
      "Animations & Effects",
      "Color Styles",
      "Components",
      "Carousel",
      "Link Styles",
      "SEO & Performance",
      "Text Styles",
      "Web Fonts",
      "Responsive",
      "Optimized Accessibility"
    ],
    figma_features: [
      "Dark Light Theme",
      "Auto Layout",
      "Fully Customizable",
      "Modern Style"
    ],
    pages: [
      "Home",
      "Explore",
      "Trending",
      "Search",
      "Contact",
      "Term",
      "Privacy",
      "Company",
      "404",
      "FAQ"
    ],
    highlight: [
      "Fully Customizable",
      "Light and Dark Theme",
      "15+ Screens",
      "Figma Component",
      "Figma Autolayout",
      "Element Guideline"
    ],
    format: ["Figma"],
    images: [
      "https://images.ui8.net/uploads/detail-image0a4-a_1673883364793.png",
      "https://images.ui8.net/uploads/detail-image04-1_1673883362940.png",
      "https://images.ui8.net/uploads/detail-image04-2_1673883359815.png",
      "https://images.ui8.net/uploads/detail-image04-6_1673883357459.png",
      "https://images.ui8.net/uploads/detail-image04-4_1673883301330.png",
      "https://images.ui8.net/uploads/detail-image04-3_1673883298403.png",
      "https://images.ui8.net/uploads/detail-1image04_1673883290500.png",
      "https://images.ui8.net/uploads/detail-image04_1673883240834.png"
    ],
    preview:
      "https://ui8.net/dpopstudio/products/nft-distro-nft-website-ui-design-kit"
  },
  {
    name: "NFT Store UI Kit",
    description:
      "The NFT Store UI Kit is an atomic and high-quality UI design kit for the NFT marketplace. This UI Kit was designed with great care and attention to detail. The NFT UI kit allows you to quickly develop a prototype for an NFT Market application, digital consultancy, or cryptocurrency company for yourself or your clients. Furthermore, all displays are accessible in both light and dark mode, and they are simple to fully customize to your requirements.",
    categories: ["NFT", "UIKit", "App", "Store"],
    template_features: [
      "Animations & Effects",
      "Color Styles",
      "Components",
      "Carousel",
      "Link Styles",
      "SEO & Performance",
      "Text Styles",
      "Web Fonts",
      "Responsive",
      "Optimized Accessibility"
    ],
    figma_features: [
      "Dark Light Theme",
      "Auto Layout",
      "Fully Customizable",
      "Organized Layers",
      "Vector based",
      "Free Fonts and Icons",
      "Clean & Modern"
    ],
    pages: [
      "Home",
      "Explore",
      "Trending",
      "Search",
      "Contact",
      "Term",
      "Privacy",
      "Company",
      "FAQ"
    ],
    highlight: [
      "70+ Mobile Screens",
      "Easily Customizable",
      "Well Organized Layers and Groups",
      "Dark & Light Versions",
      "Free Fonts and Icons",
      "Available for Sketch & Figma"
    ],
    format: ["Figma", "Sketch", "Lunacy"],
    preview:
      "https://images.ui8.net/uploads/full-1-2112-x-5000_1624160145821.png",
    images: [
      "https://images.ui8.net/uploads/detail-1-1800-x-1360_1624160152663.png",
      "https://images.ui8.net/uploads/detail-2-1800-x-1360_1624022949546.png",
      "https://images.ui8.net/uploads/detail-3-1800-x-1360png-20-29-23-035_1624022966052.png",
      "https://images.ui8.net/uploads/detail-4-1800-x-1360_1624022976436.png",
      "https://images.ui8.net/uploads/detail-5-1800-x-1360_1624160163622.png",
      "https://images.ui8.net/uploads/detail-6-1800-x-1360_1624022993707.png"
    ]
  },
  {
    name: "AI Chatbot UI Kit",
    description:
      "Welcome to the world of AI Chatbot UI Kit! As businesses strive to provide exceptional customer service and engagement, AI chatbots have emerged as a game-changer in the industry. With the help of AI-powered chatbots, companies can efficiently handle customer queries, automate mundane tasks, and enhance their overall customer experience.\n\nTo simplify the process of building and designing chatbots, AI Chatbot UI Kit provides a comprehensive set of user interface components and templates. Whether you're a developer or designer, AI Chatbot UI Kit offers a range of customizable features that can help you create a chatbot that perfectly fits your business needs.\n\nWith its user-friendly interface and diverse features, AI Chatbot UI Kit can help businesses save time and resources, while providing a seamless experience to their customers. So, whether you're looking to build a chatbot from scratch or want to enhance an existing one, AI Chatbot UI Kit is the perfect solution for all your chatbot needs.",
    categories: ["AI", "UIKit", "App", "Chatbot"],
    template_features: [
      "Animations & Effects",
      "Color Styles",
      "Components",
      "Link Styles",
      "Text Styles",
      "Optimized Accessibility"
    ],
    figma_features: [
      "40+ Screens",
      "Free fonts",
      "Vector based",
      "Well Organized Layers and Groups",
      "Easily Customizable",
      "Compatible with Figma"
    ],
    pages: [
      "Home",
      "Signin",
      "Signup",
      "Setting",
      "Chat",
      "Image",
      "Voice",
      "Privacy",
      "Help Center",
      "About",
      "FAQ"
    ],
    highlight: [
      "40+ Screens",
      "Easily Customizable",
      "Well Organized Layers and Groups"
    ],
    format: ["Figma", "Sketch", "Lunacy"],
    preview: "https://images.ui8.net/uploads/1_1678115421475.png",
    images: [
      "https://images.ui8.net/uploads/8_1678103578653.png",
      "https://images.ui8.net/uploads/8_1678103577949.png",
      "https://images.ui8.net/uploads/8_1678103578518.png",
      "https://images.ui8.net/uploads/8_1678103577945.png",
      "https://images.ui8.net/uploads/8_1678103577961.png",
      "https://images.ui8.net/uploads/8_1678103577943.png",
      "https://images.ui8.net/uploads/8_1678103578528.png",
      "https://images.ui8.net/uploads/8_1678103577934.png"
    ]
  },
  {
    name: "Aurelia - Wallet UI Kit",
    description:
      "Aurelia is a beautiful, rich and elegant mobile Wallet and Crypto App UI Kit specially designed to fit right into the new iOS, iPhone and all mobile devices.\n\nAurelia comes with a set of more than +34 beautifully designed screens in total, available in dark and light modes. Aurelia is also highly customizable, well layered, vector and organized. It's the ultimate tool for your next successful app!\n\nDesigned with care by Royalz Store",
    categories: ["Smart Wallet", "UIKit", "App"],
    template_features: [
      "Animations & Effects",
      "Color Styles",
      "Components",
      "Text Styles",
      "Optimized Accessibility"
    ],
    figma_features: [
      "75+ Elements",
      "17+ Screens",
      "Highly Customizable Layouts",
      "Auto Layout",
      "Compatible with Figma"
    ],
    pages: [
      "Home",
      "Buy&Sell",
      "Send",
      "Swap",
      "Search",
      "Menu",
      "Import Token",
      "Login",
      "Support"
    ],
    highlight: [
      "+34 screens, +150 elements",
      "Available in dark & light modes",
      "Highly customizable",
      "Well layered & organized files",
      "Compatible with Sketch, Photoshop, XD & Figma",
      "Screen @1x (375x812px)"
    ],
    format: ["Figma", "Sketch", "Lunacy", "Photoshop", "Adobe XD"],
    preview: "https://images.ui8.net/uploads/preview-1_1527714171195.jpg",
    images: [
      "https://images.ui8.net/uploads/7_1611414517000.jpg",
      "https://images.ui8.net/uploads/10_1536561600978.jpg",
      "https://images.ui8.net/uploads/10_1536561601014.jpg",
      "https://images.ui8.net/uploads/44_1604154887537.jpg",
      "https://images.ui8.net/uploads/10_1536561600944.jpg",
      "https://images.ui8.net/uploads/10_1536561600969.jpg",
      "https://images.ui8.net/uploads/44_1604154887608.jpg",
      "https://images.ui8.net/uploads/10_1550310648595.jpg"
    ]
  },
  {
    name: "Techfy X - Startup Website Template",
    description:
      "Blast off with Techfy X 🌑🚀! Our premium Dark Mode Startup Webflow Template is launchpad-ready for rising tech stars. Its bold aesthetic commands attention, showcasing your features with a futuristic style.\n\nWith a total of almost 24 pages, Techfy X includes everything you will need to have a dark mode startup website that will impress all your visitors, clients, and partners. This template makes it effortless to navigate your innovative website.\n\nTechfy X AI & ML App Webflow Template comes with great benefits. One of them is the Figma file that is included with your purchase. Send us an email to support@brixtemplates.com after your purchase (attaching your order receipt), and we will be more than happy to send you the Figma design source file.\n\nAlso than the Figma file, Techfy X fintech blockchain Webflow Template comes with many other great benefits and perks that not all Webflow Templates come with, and those are: 3 unique headers, 3 unique footers, 3 notification bars, social media cover designs that match with the template, 2 email signatures, and an icon family set loaded into the template.",
    categories: ["Web", "Template", "Landing Page", "SaaS"],
    template_features: [
      "Unique & Premium Design",
      "Speed Optimized",
      "Perfect Responsive",
      "Seamless Animations",
      "100% Customizable",
      "Webflow CMS & Ecommerce"
    ],
    figma_features: [
      "75+ Elements",
      "17+ Screens",
      "Highly Customizable Layouts",
      "Auto Layout",
      "Compatible with Figma"
    ],
    pages: [
      "Home",
      "About",
      "Team Member (CMS)",
      "Blog V1",
      "Blog Post (CMS)",
      "Blog Category (CMS)",
      "Contact",
      "Pricing (Ecommerce)",
      "Pricing Single (Ecommerce)",
      "Careers (CMS)",
      "Career Single (CMS)",
      "Career Category (CMS)",
      "Integrations (CMS)",
      "Integration Single(CMS)",
      "Integration Category (CMS)",
      "Features Landing Page",
      "Password Protect",
      "404 Password Protected"
    ],
    highlight: [
      "30+ screens",
      "Available in dark & light modes",
      "3 Headers",
      "3 Footer",
      "3 Notification Bars",
      "Well layered & organized files",
      "Compatible with Sketch, Photoshop, XD & Figma",
      "Icon Family Set"
    ],
    format: ["Figma", "Sketch", "Lunacy", "Photoshop", "Adobe XD"],
    preview:
      "https://ui8.net/account/download/5a7db503952643005f4362b1/61ec4679656719003b9f7b6d?redirect=1",
    images: [
      "https://assets-global.website-files.com/5e593fb060cf877cf875dd1f/6601b91c39b214542531b58d_5b13c7e8-9fe1-445a-8237-6edd044aa599.png",
      "https://assets-global.website-files.com/5e593fb060cf877cf875dd1f/6601b91c39b214542531b597_4bf4fb2f-05a9-4a3d-ae2e-6e3cea3c8b82.png",
      "https://assets-global.website-files.com/5e593fb060cf877cf875dd1f/6601b91c39b214542531b593_6597d09a-52db-4e6a-a684-e545c3f90dd5.png",
      "https://assets-global.website-files.com/5e593fb060cf877cf875dd1f/6601b91c39b214542531b59b_ef09ca78-451f-4c0c-97a4-d306103ecd08.png",
      "https://assets-global.website-files.com/5e593fb060cf877cf875dd1f/6601b91c39b214542531b590_f5399d27-6b50-43e8-9cac-5fd7c2a01317.png"
    ]
  },
  {
    name: "Techfy X - Startup Website Template",
    description:
      "Blast off with Techfy X 🌑🚀! Our premium Dark Mode Startup Webflow Template is launchpad-ready for rising tech stars. Its bold aesthetic commands attention, showcasing your features with a futuristic style.\n\nWith a total of almost 24 pages, Techfy X includes everything you will need to have a dark mode startup website that will impress all your visitors, clients, and partners. This template makes it effortless to navigate your innovative website.\n\nTechfy X AI & ML App Webflow Template comes with great benefits. One of them is the Figma file that is included with your purchase. Send us an email to support@brixtemplates.com after your purchase (attaching your order receipt), and we will be more than happy to send you the Figma design source file.\n\nAlso than the Figma file, Techfy X fintech blockchain Webflow Template comes with many other great benefits and perks that not all Webflow Templates come with, and those are: 3 unique headers, 3 unique footers, 3 notification bars, social media cover designs that match with the template, 2 email signatures, and an icon family set loaded into the template.",
    categories: ["Web", "Template", "SaaS"],
    template_features: [
      "Retina Ready",
      "Web Fonts",
      "Custom 404 Pages",
      "Responsive Slider",
      "CSS Grid",
      "Symbols",
      "Forms",
      "Interactions",
      "Media Lightbox",
      "Responsive Navigation",
      "Responsive Design",
      "CMS"
    ],
    figma_features: [
      "75+ Elements",
      "17+ Screens",
      "Highly Customizable Layouts",
      "Auto Layout",
      "Compatible with Figma"
    ],
    pages: [
      "Home",
      "About",
      "Team Member (CMS)",
      "Blog V1",
      "Blog Post (CMS)",
      "Blog Category (CMS)",
      "Contact",
      "Pricing (Ecommerce)",
      "Pricing Single (Ecommerce)",
      "Careers (CMS)",
      "Career Single (CMS)",
      "Career Category (CMS)",
      "Integrations (CMS)",
      "Integration Single(CMS)",
      "Integration Category (CMS)",
      "Features Landing Page",
      "Password Protect",
      "404 Password Protected"
    ],
    highlight: [
      "20+ screens",
      "Awesome and Creative Design",
      "3 Home Pages",
      "Fully Responsive and Retina Ready",
      "Fully Customizable without any coding knowledge",
      "SEO and Speed Optimized",
      "Webflow CMS"
    ],
    format: ["Figma", "Sketch", "Photoshop", "Adobe XD"],
    preview: "https://techfytemplate.webflow.io/",
    images: [
      "https://assets-global.website-files.com/5e593fb060cf877cf875dd1f/660726650a604cf15267fff4_94ab1ae0-2dd4-49e1-96a5-a731ae326aaf.jpeg",
      "https://assets-global.website-files.com/5e593fb060cf877cf875dd1f/660726650a604cf15267fffa_069203b7-8492-4e4b-a74f-5179da979816.jpeg",
      "https://assets-global.website-files.com/5e593fb060cf877cf875dd1f/660726650a604cf15267fffe_3f092c11-c217-4d21-a73c-2a179c0e6cd2.jpeg",
      "https://assets-global.website-files.com/5e593fb060cf877cf875dd1f/660726650a604cf15267fff7_08ca41a3-7b7e-4530-95b7-08dee4157604.jpeg",
      "https://assets-global.website-files.com/5e593fb060cf877cf875dd1f/660726650a604cf15268002f_f001709e-eefe-43b7-a5ad-4e69cf6d5fd4.jpeg"
    ]
  },
  {
    name: "osler: AI Telehealth & Telemedicine Website",
    description:
      "Osler is a patient-centric AI telehealth & telemedicine website template inspired by the Father of Modern Medicine. 🦾💊\n\nDesigned with simplicity and care, the Osler web template empowers you to create a cohesive experience that brings healthcare within users' reach. 👩⚕️️🏥",
    categories: ["Web", "Template", "AI"],
    template_features: [
      "Fully Responsive",
      "Animations & Effects",
      "Color Styles",
      "Components",
      "Carousel",
      "Link Styles",
      "SEO & Performance",
      "Text Styles",
      "Web Fonts",
      "Optimized Accessibility"
    ],
    figma_features: [
      "100+ Component",
      "17+ Pages",
      "80+ Section",
      "Organized Layer",
      "Custom UI Icon",
      "Custom 3D Render"
    ],
    pages: [
      "Home",
      "About Us",
      "Platform",
      "Services",
      "Career",
      "FAQ",
      "Resources",
      "Main Menu",
      "AI Health Assement",
      "Single Post",
      "404",
      "Pricing",
      "Contact Us",
      "Privacy Policy"
    ],
    highlight: [
      "17 Extensive Page Collection",
      "80+ Unique Sections",
      "Mobile-First & Responsive",
      "osler Design System",
      "osler Icon Set",
      "Custom 3D Renders",
      "Clean Layer & Naming",
      "Holistic Design Principle",
      "Lifetime Update & Support",
      "Font Included (Nunito by Vernon Adams, Google Font License)"
    ],
    format: ["Figma"],
    preview: "https://www.strangehelix.bio/product/osler",
    images: [
      "https://images.ui8.net/uploads/ui8-feature-01_1709262194000.png",
      "https://images.ui8.net/uploads/ui8-feature-02_1709262209397.png",
      "https://images.ui8.net/uploads/ui8-feature-08_1696140887725.png",
      "https://images.ui8.net/uploads/ui8-feature-08_1696140886937.png",
      "https://images.ui8.net/uploads/ui8-feature-07_1709262220973.png",
      "https://images.ui8.net/uploads/ui8-feature-08_1696140886960.png",
      "https://images.ui8.net/uploads/ui8-feature-08_1696140886988.png"
    ]
  }
] as const;
