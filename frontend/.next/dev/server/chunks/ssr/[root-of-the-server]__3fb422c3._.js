module.exports = [
"[project]/utils/cache.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getFromCache",
    ()=>getFromCache,
    "saveToCache",
    ()=>saveToCache
]);
function saveToCache(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
function getFromCache(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}
}),
"[project]/hooks/useSubjects.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSubjects",
    ()=>useSubjects
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$cache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/cache.ts [ssr] (ecmascript)");
;
;
const DATA_URL = "/git/data.json";
function useSubjects() {
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const cached = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$cache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getFromCache"])("subjects");
        if (cached) {
            setData(cached);
            setLoading(false);
        }
        if (navigator.onLine) {
            fetch(DATA_URL).then((res)=>res.json()).then((json)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$cache$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["saveToCache"])("subjects", json);
                setData(json);
                setLoading(false);
            });
        }
    }, []);
    return {
        data,
        loading
    };
}
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[project]/pages/dashboard.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Dashboard
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSubjects$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useSubjects.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
"use client";
;
;
;
function Dashboard() {
    const { data, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSubjects$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useSubjects"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
        children: "Loading..."
    }, void 0, false, {
        fileName: "[project]/pages/dashboard.tsx",
        lineNumber: 9,
        columnNumber: 23
    }, this);
    if (!data) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
        children: "No data"
    }, void 0, false, {
        fileName: "[project]/pages/dashboard.tsx",
        lineNumber: 10,
        columnNumber: 21
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            maxWidth: 900,
            margin: "40px auto"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                children: "Subjects"
            }, void 0, false, {
                fileName: "[project]/pages/dashboard.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            Object.keys(data.subjects).map((subject)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    onClick: ()=>router.push(`/subject/${subject}`),
                    style: {
                        padding: 20,
                        background: "#fff",
                        marginBottom: 12,
                        borderRadius: 8,
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                    },
                    children: subject.toUpperCase()
                }, subject, false, {
                    fileName: "[project]/pages/dashboard.tsx",
                    lineNumber: 17,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/pages/dashboard.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3fb422c3._.js.map