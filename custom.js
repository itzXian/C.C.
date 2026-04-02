// Version: 1.0
// Reference:
//     https://www.clashverge.dev/guide/script.html
//     https://github.com/yyhhyyyyyy/selfproxy/blob/cb1470d2a321051573d3ecc902a692173b9dd787/Mihomo/Extension_Script/script.js

/* ========== Base-Options Configuration ========== */
const overrideBasicOptions = (config) => {
    const CDN = "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release";

    Object.assign(config, {
        "mixed-port": 7890,
        "allow-lan":  true,
        mode:         "rule",
        "geox-url": {
            geoip:   `${CDN}/geoip.dat`,
            geosite: `${CDN}/geosite.dat`,
            mmdb:    `${CDN}/geoip.metadb`,
            asn:     `${CDN}/GeoLite2-ASN.mmdb`,
        },
        "geo-auto-update":     true,
        "geo-update-interval": 24,
        "log-level":           "warning",
        ipv6:                  false,
        "find-process-mode":   "strict",
        profile:               { "store-selected": true, "store-fake-ip": true },
        "unified-delay":       true,
        "tcp-concurrent":      true,
        sniffer: {
            enable: true,
            sniff: {
                HTTP: { ports: [80, "8080-8880"], "override-destination": true },
                TLS:  { ports: [443, 8443] },
                QUIC: { ports: [443, 8443] },
            },
            "skip-domain": ["Mijia Cloud", "+.push.apple.com"],
        },
        hosts: {
            "dns.alidns.com":     ["223.5.5.5", "223.6.6.6", "2400:3200:baba::1", "2400:3200::1"],
            "127.0.0.1.sslip.io":    "127.0.0.1",
            "127.atlas.skk.moe":     "127.0.0.1",
            "cdn.jsdelivr.net":      "cdn.jsdelivr.net.cdn.cloudflare.net",
            "mtalk.google.com":      "172.253.63.188",
            "alt1-mtalk.google.com": "192.178.131.188",
            "alt2-mtalk.google.com": "209.85.144.188",
            "alt3-mtalk.google.com": "108.177.11.188",
            "alt4-mtalk.google.com": "192.178.218.188",
            "alt5-mtalk.google.com": "64.233.178.188",
            "alt6-mtalk.google.com": "192.178.213.188",
            "alt7-mtalk.google.com": "172.253.116.188",
            "alt8-mtalk.google.com": "192.178.223.188",
            "dl.google.com":         "142.250.31.93",
            "dl.l.google.com":       "142.250.31.136",
        },
    });
};

const overrideExternalController = (config) => {
    const port   = Math.floor(Math.random() * 9999) + 10000;
    const secret = Math.random().toString(36).slice(2);

    Object.assign(config, {
        "external-controller": `0.0.0.0:${port}`,
        "secret":              secret,
        "external-ui":         "ui",
        "external-ui-url":     "https://github.com/Zephyruso/zashboard/releases/latest/download/dist-no-fonts.zip",
    });
};

const overrideDns = (config) => {
    const directDns  = ["223.5.5.5:853", "119.29.29.29", "114.114.114.114"];
    const proxyDns   = ["1.1.1.1", "1.0.0.1", "8.8.8.8", "8.8.4.4"];
    const adblockDns = ["dns.adguard-dns.com"];

    config.dns = {
        enable:                    true,
        "prefer-h3":               true,
        ipv6:                      false,
        "default-nameserver":      directDns,
        "enhanced-mode":           "fake-ip",
        "fake-ip-range":           "198.18.0.1/16",
        "fake-ip-filter-mode":     "blacklist",
        "fake-ip-filter": [
            "rule-set:local",
            "geosite:private",
            "geosite:cn",
            "geosite:connectivity-check",
        ],
        "nameserver-policy": {
            "rule-set:local":      "system",
            "geosite:private":     directDns,
            "geosite:cn":          directDns,
            "geosite:hoyoverse":   directDns,
            "+.twimg.com":         proxyDns,
            "+.pximg.net":         proxyDns,
            "cdn.discordapp.com":  proxyDns,
        },
        nameserver:                adblockDns,
    };
};

/* ========== Rule-Providers Configuration ========== */
// Docs:
//     https://wiki.metacubex.one/config/rule-providers/
//     https://wiki.metacubex.one/config/rule-providers/content/
//     https://wiki.metacubex.one/handbook/syntax/#_8
const CREATE_RULE_PROVIDER = (rules = [], options = {}) => {
    return {
        type:     "inline",
        behavior: "classical",
        payload:  rules,
        ...options,
    };
};

const overrideRuleProviders = (config) => {
    config["rule-providers"] = {
        hoyo_gi_cn: CREATE_RULE_PROVIDER([
            "DOMAIN,dispatchosglobal.yuanshen.com",
            "DOMAIN,oseurodispatch.yuanshen.com",
            "DOMAIN,osusadispatch.yuanshen.com",
            "DOMAIN,osuspider.yuanshen.com",
        ]),
        hoyo_etc: CREATE_RULE_PROVIDER([
            "DOMAIN,minor-api-os.hoyoverse.com",
        ]),
        hoyo_direct: CREATE_RULE_PROVIDER([
            "DOMAIN-REGEX,[\\w-]*log-upload-os\\.hoyoverse\\.com",
            "DOMAIN-SUFFIX,yuanshen.com",
            "DOMAIN-SUFFIX,mihoyo.com",
            //"DOMAIN,asia-ugc-api.hoyoverse.com",
            //"DOMAIN,asia-ugc-upload.hoyoverse.com",
            //"DOMAIN,asia-ugc-api-static.hoyoverse.com",
            "DOMAIN-REGEX,asia-ugc[\\w-]*\\.hoyoverse\\.com", // GI UGC
            "AND,((DST-PORT,22101-22102),(NETWORK,udp))",     // GI
            "AND,((DST-PORT,23301/23801),(NETWORK,udp))",     // HSR
            "AND,((DST-PORT,20501),(NETWORK,udp))",           // ZZZ
        ]),
        hoyo_proxy: CREATE_RULE_PROVIDER([
            "DOMAIN-SUFFIX,hoyoverse.com",
            "DOMAIN-SUFFIX,hoyolab.com",
            "DOMAIN,autopatchhk.yuanshen.com",       // GI
            "DOMAIN,osasiadispatch.yuanshen.com",    // GI
            "AND,((DST-PORT,8999),(NETWORK,tcp))",   // GI
            "PROCESS-NAME-REGEX,.*GenshinImpact",    // GI
        ]),
        miui_ad: CREATE_RULE_PROVIDER([
            // Xiaomi / MIUI telemetry & ads
            "api.installer.xiaomi.com",  "tracking.miui.com",   "data.mistat.xiaomi.com",
            "diagnosis.ad.xiaomi.com",   "log.ad.xiaomi.com",   "m.track.ad.xiaomi.com",
            "sdkconfig.ad.xiaomi.com",   "api.ad.xiaomi.com",   "tracker.ai.xiaomi.com",
            "grayconfig.ai.xiaomi.com",  "mazu.sec.miui.com",   "api.sec.miui.com",
            "auth.be.sec.miui.com",      "flash.sec.miui.com",  "port.sec.miui.com",
            "data.sec.miui.com",         "update.miui.com",     "api.hybrid.xiaomi.com",
            "hybrid.xiaomi.com",         "hybrid.miui.com",     "o2o.api.xiaomi.com",
            "test.ad.xiaomi.com",        "adinfo.ra1.xlmc.sec.miui.com",
            // Avlyun / sec.miui CSE
            "miui-fxcse.avlyun.com",     "update.avlyun.sec.miui.com",
            "sdkconf.avlyun.com",        "ixav-cse.avlyun.com",
            "miav-cse.avlyun.com",       "logupdate.avlyun.sec.miui.com",
            // MIUI Browser
            "api.browser.miui.com",      "ssl-cdn.static.browser.mi-img.com",
            "hot.browser.miui.com",      "security.browser.miui.com",
            "r.browser.miui.com",        "hd.browser.miui.com",
            "c3-cache.browser.miui.com", "api-ipv4.browser.miui.com",
            "qsb.browser.miui.com",      "global-search.browser.miui.com",
            "qsb.browser.miui.srv",
            // Other Xiaomi services
            "api.developer.xiaomi.com",  "sentry.d.xiaomi.net", "rom.pt.miui.srv",
            "global.search.xiaomi.net",  "ccc.sys.miui.com",
            "jupiter.sys.miui.com",      "metok.sys.miui.com",
            // Tencent SDK / ads
            "tmfsdk.m.qq.com",           "tmfsdk4.m.qq.com",    "tmfsdktcp.m.qq.com",
            "tmfsdktcpv4.m.qq.com",      "h.trace.qq.com",      "othstr.beacon.qq.com",
            "tools.3g.qq.com",           "tdid.m.qq.com",       "api.yky.qq.com",
            "sdk.e.qq.com",              "tangram.e.qq.com",    "us.l.qq.com",
            "tpstelemetry.tencent.com",  "tmeadcomm.y.qq.com",
            "cfg.imtt.qq.com",           "android.bugly.qq.com",
            // ByteDance
            "tbm.snssdk.com",            "toblog.ctobsnssdk.com",
            "ug.snssdk.com",             "tobapplog.ctobsnssdk.com",
            // QuickApp
            "statres.quickapp.cn",       "qr.quickapp.cn",
            // Xunlei / Sandai
            "hub5pn.wap.sandai.net",     "master.wap.dphub.sandai.net",
            "hub5u.wap.sandai.net",      "idx.m.hub.sandai.net",
            "tw13b093.sandai.net",       "uploadlog.xlmc.sandai.net",
            "t03-api.xlmc.xunlei.com",   "pre.api.tw06.xlmc.sandai.net",
            "guid-xldw-ssl.n0808.com",
            // Misc
            "beacon-api.aliyuncs.com",   "s1.irs03.com",        "pssn.alicdn.com",
            "mpush-api.aliyun.com",      "up.cm.ksmobile.com",  "dl.cm.ksmobile.com",
            "dw-online.ksosoft.com",     "zzhc.vnet.cn",        "t7z.cupid.iqiyi.com",
            "rdt.tfogc.com",             "pgdt.gtimg.cn",       "worldwide.sogou.com",
            "www.pangolin-dsp-toutiao.com",
        ], { behavior: "domain" }),
        download: CREATE_RULE_PROVIDER([
            "PROCESS-NAME,idm.internet.download.manager",
        ]),
        github_uc: CREATE_RULE_PROVIDER([
            "DOMAIN-SUFFIX,githubusercontent.com",
        ]),
        local: CREATE_RULE_PROVIDER([
            "+.m2m",              "injections.adguard.org", "local.adguard.org",
            "+.bogon",            "+.lan",                  "+.local",
            "+.internal",         "+.localdomain",          "home.arpa",
            "127.atlas.skk.moe",  "dns.msftncsi.com",       "*.srv.nintendo.net",
            "stun.*",             "*.stun.playstation.net", "xbox.*.microsoft.com",
            "*.xboxlive.com",     "*.turn.twilio.com",      "*.stun.twilio.com",
            "stun.syncthing.net", "127.0.0.1.sslip.io",     "127.*.*.*.sslip.io",
            "127-*-*-*.sslip.io", "*.127.*.*.*.sslip.io",   "*-127-*-*.nip.io",
            "127-*-*-*.nip.io",   "*-127-*-*-*.sslip.io",   "127.*.*.*.nip.io",
            "*.127.*.*.*.nip.io",
        ], { behavior: "domain" }),
    };
};

/* ========== Rules Configuration ========== */
const overrideRules = (config) => {
    config.rules = [
        "RULE-SET,      hoyo_gi_cn,         HOYO_GI_CN",
        "RULE-SET,      hoyo_etc,           HOYO_ETC",
        "RULE-SET,      hoyo_direct,        HOYO_DIRECT",
        "RULE-SET,      hoyo_proxy,         HOYO_PROXY",
        "RULE-SET,      miui_ad,            MIUI_AD",
        "GEOSITE,       category-ads-all,   AD_BLOCK",
        "GEOSITE,       hoyoverse,          HOYO_PROXY",
        "RULE-SET,      download,           DOWNLOAD",
        "GEOSITE,       ehentai,            EHENTAI",
        "RULE-SET,      github_uc,          GITHUB_UC",
        "GEOSITE,       steam@cn,           STEAM_CN",
        "DOMAIN-SUFFIX, steamserver.net,    STEAM_CN",
        "GEOSITE,       steam,              STEAM",
        "GEOSITE,       pixiv,              PIXIV",
        "GEOSITE,       category-ai-!cn,    AI",
        "GEOSITE,       youTube,            YOUTUBE",
        "GEOSITE,       googlefcm,          GOOGLE_FCM",
        "GEOIP,         google,             GOOGLE,          no-resolve",
        "GEOSITE,       google,             GOOGLE",
        "GEOIP,         twitter,            TWITTER,         no-resolve",
        "GEOSITE,       twitter,            TWITTER",
        "GEOIP,         telegram,           TELEGRAM,        no-resolve",
        "GEOSITE,       telegram,           TELEGRAM",
        "GEOSITE,       discord,            DISCORD",
        "GEOSITE,       microsoft,          MICROSOFT",
        "GEOSITE,       apple,              APPLE",
        "GEOSITE,       apple-intelligence, APPLE",
        "DOMAIN-SUFFIX, hinative.com,       NON_JP",
        "DOMAIN-SUFFIX, game8.jp,           NON_JP",
        "DOMAIN-REGEX,  .*\.jp,             JP",
        "GEOIP,         JP,                 JP,              no-resolve",
        "GEOSITE,       geolocation-!cn,    NON_CN",
        "RULE-SET,      local,              LOCAL",
        "GEOSITE,       private,            LOCAL",
        "GEOSITE,       CN,                 CN",
        "GEOIP,         private,            LOCAL",
        "GEOIP,         CN,                 CN",
        "MATCH,FINAL",
    ];
};

/* ========== Proxy Groups Configuration ========== */
const FILTER = {
    HK:      "香港|HK|Hong|🇭🇰",
    TW:      "台湾|TW|Taiwan|Wan|🇹🇼|🇨🇳",
    SG:      "新加坡|狮城|SG|Singapore|🇸🇬",
    JP:      "日本|JP|Japan|🇯🇵",
    KR:      "韩国|韓|KR|Korea|🇰🇷",
    AU:      "澳大利亚|澳|AU|Australia|🇦🇺",
    US:      "美国|US|United States|America|🇺🇸",
    UK:      "英国|UK|United Kingdom|🇬🇧",
    FR:      "法国|FR|France|🇫🇷",
    DE:      "德国|DE|Germany|🇩🇪",
    EXCLUDE: "剩余|到期|主页|官网|游戏|关注|网站|地址|有效|网址|禁止|邮箱|发布|客服|订阅|节点|问题|联系",
    ALL:     "",
};

const REGEX = (includeTerm, excludeTerm = FILTER.EXCLUDE) =>
    includeTerm
        ? `^(?=.*(${includeTerm}))(?!.*${excludeTerm}).*$`
        : `^((?!.*${excludeTerm}).)*$`;

const IS_NOT_EMPTY = (value) => {
    if (value == null)             return false;
    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value))      return value.length > 0;
    if (value instanceof Object)   return Object.keys(value).length > 0;
    return true;
};

const DEEP_CLONE = (obj) =>
    typeof structuredClone === "function"
        ? structuredClone(obj)
        : JSON.parse(JSON.stringify(obj));

const CREATE_PROXY_GROUP = (overrides) => ({
    hidden:            true,
    url:               "https://cp.cloudflare.com",
    "expected-status": "200/204/302",
    timeout:           5000,
    interval:          1800,
    "exclude-filter":  "0.[0-9]",
    tolerance:         50,
    ...overrides,
});

const CREATE_EXIT_PROVIDER = (providers) => {
    const result = {};
    for (const [key, value] of Object.entries(providers)) {
        const exitKey = `→${key}`;
        result[exitKey] = {
            ...value,
            override: {
                "dialer-proxy":      "RELAY",
                "additional-prefix": exitKey,
            },
        };
    }
    return result;
};

const CREATE_PROXY_GROUPS_WITH_PROVIDER = (proxies = [], providers = {}, prefix = "") => {
    const providerKeys = Object.keys(providers);
    const hasProviders = IS_NOT_EMPTY(providers);
    const hasProxies   = IS_NOT_EMPTY(proxies);

    let proxyGroups = [
        { type: "url-test",     name: "AUTO HKJPSG", filter: REGEX(["HK", "JP", "SG"].map((e) => FILTER[e]).join("|")) },
        { type: "url-test",     name: "AUTO HK",     filter: REGEX(FILTER.HK) },
        { type: "url-test",     name: "AUTO JP",     filter: REGEX(FILTER.JP) },
        { type: "url-test",     name: "AUTO SG",     filter: REGEX(FILTER.SG) },
        { type: "url-test",     name: "AUTO !JP",    filter: REGEX(FILTER.ALL, `${FILTER.EXCLUDE}|${FILTER.JP}`) },
        { type: "url-test",     name: "AUTO ALL",    filter: REGEX(FILTER.ALL) },
        { type: "load-balance", name: "LB HK",       filter: REGEX(FILTER.HK), strategy: "round-robin" },
        { type: "load-balance", name: "LB SG",       filter: REGEX(FILTER.SG), strategy: "round-robin" },
    ].map((e) => CREATE_PROXY_GROUP({
        ...e,
        name:    `${prefix}${e.name}`,
        proxies: hasProxies
            ? proxies.map((proxy) => proxy.name).filter((name) => name.match(e.filter))
            : [],
        use:     providerKeys,
    }));
    if (!hasProviders)
        proxyGroups = proxyGroups.filter((g) => g.proxies);

    const relaySelectorGroup = [{
        type:    "select",
        name:    `${prefix}RELAY`,
        filter:  REGEX(FILTER.ALL),
        proxies: proxyGroups.map((g) => g.name),
        use:     providerKeys,
        hidden:  false,
    }];

    const exitProxies   = hasProviders
        ? []
        : DEEP_CLONE(proxies);
    const exitProviders = hasProviders
        ? CREATE_EXIT_PROVIDER(providers)
        : CREATE_EXIT_PROVIDER({ "provider-exit": { type: "inline", payload: exitProxies } });
    const exitProviderKeys = Object.keys(exitProviders);
    const hasExitProxies   = IS_NOT_EMPTY(exitProxies);

    let exitGroups = [
        { type: "url-test", name: "AUTO JP",  filter: REGEX(FILTER.JP) },
        { type: "url-test", name: "AUTO !JP", filter: REGEX(FILTER.ALL, `${FILTER.EXCLUDE}|${FILTER.JP}`) },
    ].map((e) => CREATE_PROXY_GROUP({
        ...e,
        name:    `→${prefix}${e.name}`,
        proxies: hasExitProxies
            ? exitProxies.map((proxy) => proxy.name).filter((name) => name.match(e.filter))
            : [],
        use:     exitProviderKeys,
    }));
    if (hasExitProxies)
        exitGroups = exitGroups.filter((g) => g.proxies);

    const exitSelectorGroup = [{
        type:    "select",
        name:    `${prefix}EXIT`,
        filter:  REGEX(FILTER.ALL),
        proxies: exitGroups.map((g) => g.name),
        use:     exitProviderKeys,
        hidden:  false,
    }];

    return { proxyGroups, relaySelectorGroup, exitGroups, exitSelectorGroup, exitProviders };
};

const overrideProxyGroups = (config) => {
    const providers    = config?.["proxy-providers"] ?? {};
    const hasProviders = IS_NOT_EMPTY(providers);

    let { proxyGroups, relaySelectorGroup, exitGroups, exitSelectorGroup, exitProviders } =
        CREATE_PROXY_GROUPS_WITH_PROVIDER(config.proxies, providers);

    if (hasProviders) {
        const tempSelector     = [];
        const tempExitSelector = [];

        for (const [key, value] of Object.entries(providers)) {
            const pr = CREATE_PROXY_GROUPS_WITH_PROVIDER("", { [key]: value }, key);

            proxyGroups.push(...pr.proxyGroups);
            relaySelectorGroup.push(...pr.relaySelectorGroup);
            exitGroups.push(...pr.exitGroups);
            exitSelectorGroup.push(...pr.exitSelectorGroup);

            tempSelector.push(pr.relaySelectorGroup[0].name);
            tempExitSelector.push(pr.exitSelectorGroup[0].name);

            Object.assign(exitProviders, pr.exitProviders);
        }

        relaySelectorGroup[0].proxies.unshift(...tempSelector);
        exitSelectorGroup[0].proxies.unshift(...tempExitSelector);
    }

    const preGroups = [
        ...exitSelectorGroup,
        ...relaySelectorGroup,
        ...exitGroups,
        ...proxyGroups,
    ];
    const proxyGroupNames = preGroups.map((g) => g.name);

    const selectorFirst = { proxies: ["SELECTOR", ...proxyGroupNames, "DIRECT", "REJECT"] };
    const directFirst = { proxies: ["DIRECT", "SELECTOR", "REJECT"] };
    const rejectFirst = { proxies: ["REJECT", "SELECTOR", "DIRECT"] };

    const otherGroups = [
        { name: "SELECTOR",      proxies: [...proxyGroupNames, "DIRECT", "REJECT"] },
        { name: "HOYO_GI_CN",  proxies: ["HOYO_DIRECT", "HOYO_PROXY"], url: "https://hk4e-sdk.mihoyo.com/ping?callback=jsonptesting" },
        { name: "HOYO_ETC",    proxies: ["HOYO_DIRECT", "HOYO_PROXY"] },
        { name: "HOYO_DIRECT",    ...directFirst, url: "https://api.mihoyo.com/live?detect=123" },
        { name: "HOYO_PROXY",     ...selectorFirst, url: "https://sdk.hoyoverse.com/hk4e/announcement/index.html?detect=123" },
        { name: "MIUI_AD",        ...rejectFirst },
        { name: "AD_BLOCK",       ...rejectFirst },
        { name: "DOWNLOAD",       ...selectorFirst },
        { name: "EHENTAI",        ...selectorFirst, "include-all": true },
        { name: "GITHUB_UC",      ...selectorFirst, "include-all": true },
        { name: "STEAM_CN",       ...directFirst },
        { name: "STEAM",          ...selectorFirst },
        { name: "PIXIV",          ...selectorFirst },
        { name: "AI",             ...selectorFirst },
        { name: "YOUTUBE",        ...selectorFirst },
        { name: "GOOGLE_FCM",     ...directFirst },
        { name: "GOOGLE",         ...selectorFirst },
        { name: "TWITTER",        ...selectorFirst },
        { name: "TELEGRAM",       ...selectorFirst },
        { name: "DISCORD",        ...selectorFirst },
        { name: "MICROSOFT",      ...selectorFirst },
        { name: "APPLE",          ...selectorFirst },
        { name: "NON_JP",         ...selectorFirst },
        { name: "JP",             ...selectorFirst },
        { name: "NON_CN",         ...selectorFirst },
        { name: "CN",             ...directFirst, url: "http://connect.rom.miui.com/generate_204" },
        { name: "LOCAL",          ...directFirst },
        { name: "FINAL",          ...selectorFirst },
    ].map((e) => CREATE_PROXY_GROUP({ ...e, type: "select", hidden: false }));

    config["proxy-groups"]    = [...preGroups, ...otherGroups];
    config["proxy-providers"] = { ...providers, ...exitProviders };
};

/* ========== Icon Support ========== */
const GITHUB  = (name) => `https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/icon/color/${name}.png`;
const WIKI    = (path) => `https://upload.wikimedia.org/wikipedia/${path}`;
const GPLAY   = (id)   => `https://play-lh.googleusercontent.com/${id}`;
const FAVICON = (url)  => `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=256`;

const ICON_MAP = {
    EXIT:           WIKI("commons/f/f2/Send_icon.svg"),
    RELAY:          WIKI("commons/3/3a/Noto_Emoji_v2.034_1f517.svg"),
    SELECTOR:       WIKI("commons/c/c0/Noto_Emoji_v2.034_1f537.svg"),
    HOYO_GI_CN:     GPLAY("YQqyKaXX-63krqsfIzUEJWUWLINxcb5tbS6QVySdxbS7eZV7YB2dUjUvX27xA0TIGtfxQ5v-tQjwlT5tTB-O"),
    HOYO_ETC:       FAVICON("https://hoyoverse.com"),
    HOYO_DIRECT:    FAVICON("https://hoyoverse.com"),
    HOYO_PROXY:     FAVICON("https://hoyoverse.com"),
    HOYO_HSR:       GPLAY("IqXUfiwbK-NCu5KyyK9P3po1kd4ZPOC4QJVWRk2ooJXnUcSpkCUQRYYJ-9vZkCEnPOxDIEWjNpS30OwHNZTtCKw"),
    HOYO_ZZZ:       GPLAY("8jEmEvTsNIRW1vLlrDXXCcDlKkQrNb8NzccOXrln4G_DOUZpcBPbN9ssjuwBWz7_yZQ"),
    MIUI_AD:        FAVICON("https://www.mi.com/"),
    AD_BLOCK:       WIKI("commons/1/1c/Codex_icon_Block_red.svg"),
    DOWNLOAD:       WIKI("commons/0/08/Paomedia_small-n-flat_cloud-down.svg"),
    EHENTAI:        WIKI("commons/b/b5/Noto_Emoji_KitKat_1f43c.svg"),
    GITHUB_UC:      WIKI("commons/c/c6/Font_Awesome_5_brands_github-square.svg"),
    STEAM_CN:       WIKI("commons/8/83/Steam_icon_logo.svg"),
    STEAM:          WIKI("commons/8/83/Steam_icon_logo.svg"),
    PIXIV:          GPLAY("UADIlh0kSQkh59fl-s3RgLFILa_EY5RqA4sMOtKD-fX0z0fDVUR7_a7ysylufmhH-K-XfhSVVdpspD8K0jtu"),
    AI:             GPLAY("lmG9HlI0awHie0cyBieWXeNjpyXvHPwDBb8MNOVIyp0P8VEh95AiBHtUZSDVR3HLe3A"),
    YOUTUBE:        FAVICON("https://youtube.com"),
    GOOGLE_FCM:     FAVICON("https://firebase.google.com"),
    GOOGLE:         WIKI("commons/c/c1/Google_%22G%22_logo.svg"),
    TWITTER:        WIKI("commons/6/6f/Logo_of_Twitter.svg"),
    TELEGRAM:       WIKI("commons/8/82/Telegram_logo.svg"),
    DISCORD:        WIKI("fr/4/4f/Discord_Logo_sans_texte.svg"),
    MICROSOFT:      WIKI("commons/2/25/Microsoft_icon.svg"),
    APPLE:          WIKI("commons/8/84/Apple_Computer_Logo_rainbow.svg"),
    NON_JP:         WIKI("commons/4/45/Wikimania2019_flower_icon.svg"),
    JP:             WIKI("commons/5/54/Noto_Emoji_v2.034_1f338.svg"),
    NON_CN:         WIKI("commons/2/26/Noto_Emoji_v2.034_1f310.svg"),
    CN:             WIKI("commons/8/8b/Noto_Emoji_v2.034_2b50.svg"),
    LOCAL:          WIKI("commons/8/8b/Noto_Emoji_v2.034_2b50.svg"),
    FINAL:          GITHUB("final"),
};

const ICON_NAME_REGEX = /[A-Za-z0-9_]+$/;

const setProxyGroupIcon = (config) => {
    for (const group of config["proxy-groups"]) {
        if (!group.hidden) {
            //group.icon = ICON_MAP[group.name.match(ICON_NAME_REGEX)?.[0]] ?? "";
            group.icon = ICON_MAP[group.name] ?? "";
        }
    }
};

/* ========== Entry Point ========== */
const main = (config) => {
    overrideBasicOptions(config);
    overrideExternalController(config);
    overrideDns(config);
    overrideRuleProviders(config);
    overrideRules(config);
    overrideProxyGroups(config);
    setProxyGroupIcon(config);
    return config;
};

const IS_NODE = typeof process !== "undefined" && !!process.versions?.node;
if (IS_NODE) module.exports = { main };
