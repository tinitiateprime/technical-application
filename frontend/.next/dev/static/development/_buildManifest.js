self.__BUILD_MANIFEST = {
  "/": [
    "static/chunks/pages/index.js"
  ],
  "/_error": [
    "static/chunks/pages/_error.js"
  ],
  "/dashboard": [
    "static/chunks/pages/dashboard.js"
  ],
  "/repo/[slug]": [
    "static/chunks/pages/repo/[slug].js"
  ],
  "/subject/[subject]": [
    "static/chunks/pages/subject/[subject].js"
  ],
  "/topic/[topic]": [
    "static/chunks/pages/topic/[topic].js"
  ],
  "__rewrites": {
    "afterFiles": [],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/",
    "/_app",
    "/_error",
    "/api/auth/[...nextauth]",
    "/components/FavButton",
    "/components/SignInButton",
    "/components/Userinfo",
    "/components/useCachedData",
    "/dashboard",
    "/repo/[slug]",
    "/subject",
    "/subject/[subject]",
    "/topic/[topic]"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()