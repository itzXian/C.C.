// Version: 2.0
// Reference:
//     https://www.clashverge.dev/guide/script.html
//     https://github.com/yyhhyyyyyy/selfproxy/blob/cb1470d2a321051573d3ecc902a692173b9dd787/Mihomo/Extension_Script/script.js

/* ========== Base-Options Configuration ========== */

const baseOptions = {
    "mixed-port": 7890,
    "allow-lan":  true,
    mode:         "rule",
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
};

const _cdn = "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release";
const geo = {
    "geox-url": {
        geoip:   `${_cdn}/geoip.dat`,
        geosite: `${_cdn}/geosite.dat`,
        mmdb:    `${_cdn}/geoip.metadb`,
        asn:     `${_cdn}/GeoLite2-ASN.mmdb`,
    },
    "geo-auto-update":     true,
    "geo-update-interval": 24,
};

const _port   = Math.floor(Math.random() * 9999) + 10000;
const _secret = Math.random().toString(36).slice(2);
const externalController = {
    "external-controller": `0.0.0.0:${_port}`,
    "secret":              _secret,
    "external-ui":         "ui",
    "external-ui-url":     "https://github.com/Zephyruso/zashboard/releases/latest/download/dist-no-fonts.zip",
};

const hosts = {
    "dns.alidns.com":        ["223.5.5.5", "223.6.6.6", "2400:3200:baba::1", "2400:3200::1"],
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
};

const _directDns  = ["223.5.5.5:853", "119.29.29.29", "114.114.114.114"];
const _proxyDns   = ["1.1.1.1", "1.0.0.1", "8.8.8.8", "8.8.4.4"];
const _adblockDns = ["dns.adguard-dns.com"];
const dns = {
    enable:                true,
    "prefer-h3":           true,
    ipv6:                  false,
    "default-nameserver":  _directDns,
    "enhanced-mode":       "fake-ip",
    "fake-ip-range":       "198.18.0.1/16",
    "fake-ip-filter-mode": "blacklist",
    "fake-ip-filter": [
        "rule-set:local",
        "geosite:cn",
        "geosite:connectivity-check",
    ],
    "nameserver-policy": {
        "rule-set:local":      "system",
        "geosite:private":     _directDns,
        "geosite:cn":          _directDns,
        "geosite:hoyoverse":   _directDns,
        "+.twimg.com":         _proxyDns,
        "+.pximg.net":         _proxyDns,
        "cdn.discordapp.com":  _proxyDns,
    },
    nameserver:                _proxyDns,
    "proxy-server-nameserver": _directDns,
};

/* ========== Proxy Groups Configuration ========== */
const _filter = {
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

const _regexCache = new Map();
const REGEX = (includeTerm, excludeTerm = _filter.EXCLUDE) => {
    const key = `${includeTerm}\0${excludeTerm}`;
    if (_regexCache.has(key)) return _regexCache.get(key);
    const result = includeTerm
        ? `^(?=.*(${includeTerm}))(?!.*${excludeTerm}).*$`
        : `^((?!.*${excludeTerm}).)*$`;
    _regexCache.set(key, result);
    return result;
};

const IS_NOT_EMPTY = (value) => {
    if (value == null)             return false;
    if (typeof value === "string") return value.trim() !== "";
    if (Array.isArray(value))      return value.length > 0;
    if (typeof value === "object") return Object.keys(value).length > 0;
    return true;
};

const DEEP_CLONE = (obj) =>
    typeof structuredClone === "function"
        ? structuredClone(obj)
        : JSON.parse(JSON.stringify(obj));

const CREATE_PROXY_GROUP = (overrides) => ({
    name:              overrides.name, // keep the name first, for easier viewing
    hidden:            true,
    url:               "https://cp.cloudflare.com",
    "expected-status": "200/204/302",
    timeout:           5000,
    interval:          1800,
    "exclude-filter":  "0.[0-9]",
    tolerance:         50,
    ...overrides,
});

const CREATE_EXIT_PROVIDER = (providers) =>
    Object.fromEntries(
        Object.entries(providers).map(([key, value]) => {
            const exitKey = `→${key}`;
            return [exitKey, {
                ...value,
                override: {
                    "dialer-proxy":      "RELAY",
                    "additional-prefix": exitKey,
                },
            }];
        })
    );

/* ========== Icon Support ========== */
const GITHUB  = (name) => `https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/icon/color/${name}.png`;
const WIKI    = (path) => `https://upload.wikimedia.org/wikipedia/${path}`;
const GPLAY   = (id)   => `https://play-lh.googleusercontent.com/${id}`;
const FAVICON = (url)  => `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=256`;

const CREATE_PROXY_GROUPS_WITH_PROVIDER = (proxies = [], providers = {}, prefix = "") => {
    const providerKeys = Object.keys(providers);
    const hasProviders = IS_NOT_EMPTY(providers);
    const hasProxies   = IS_NOT_EMPTY(proxies);

    let proxyGroups = [
        { name: "AUTO HKSG", type: "url-test",     filter: REGEX(["HK", "SG"].map((e) => _filter[e]).join("|")) },
        { name: "AUTO HK",   type: "url-test",     filter: REGEX(_filter.HK) },
        { name: "AUTO JP",   type: "url-test",     filter: REGEX(_filter.JP) },
        { name: "AUTO SG",   type: "url-test",     filter: REGEX(_filter.SG) },
        { name: "AUTO AU",   type: "url-test",     filter: REGEX(_filter.AU) },
        { name: "AUTO US",   type: "url-test",     filter: REGEX(_filter.US) },
        { name: "AUTO !JP",  type: "url-test",     filter: REGEX(_filter.ALL, `${_filter.EXCLUDE}|${_filter.JP}`) },
        { name: "AUTO ALL",  type: "url-test",     filter: REGEX(_filter.ALL) },
        { name: "LB HK",     type: "load-balance", filter: REGEX(_filter.HK), strategy: "round-robin" },
        { name: "LB SG",     type: "load-balance", filter: REGEX(_filter.SG), strategy: "round-robin" },
    ].map((e) => CREATE_PROXY_GROUP({
        ...e,
        name:    `${prefix}${e.name}`,
        proxies: hasProxies
            ? proxies.map((proxy) => proxy.name).filter((name) => name.match(e.filter))
            : [],
        use:     providerKeys,
    }));
    if (!hasProviders)
        proxyGroups = proxyGroups.filter((g) => IS_NOT_EMPTY(g.proxies));

    const relaySelectorGroup = [{
        name:    `${prefix}RELAY`,
        type:    "select",
        filter:  REGEX(_filter.ALL),
        proxies: proxyGroups.map((g) => g.name),
        use:     providerKeys,
        hidden:  false,
        icon:    prefix ? "" : WIKI("commons/3/3a/Noto_Emoji_v2.034_1f517.svg"),
    }];

    const exitProxies      = hasProviders
        ? []
        : DEEP_CLONE(proxies);
    const hasExitProxies   = IS_NOT_EMPTY(exitProxies);
    const exitProviders    = hasProviders
        ? CREATE_EXIT_PROVIDER(providers)
        : CREATE_EXIT_PROVIDER({ "provider-exit": { type: "inline", payload: exitProxies } });
    const exitProviderKeys = Object.keys(exitProviders);

    let exitGroups = [
        { name: "AUTO JP",  type: "url-test", filter: REGEX(_filter.JP) },
        { name: "AUTO !JP", type: "url-test", filter: REGEX(_filter.ALL, `${_filter.EXCLUDE}|${_filter.JP}`) },
    ].map((e) => CREATE_PROXY_GROUP({
        ...e,
        name:    `→${prefix}${e.name}`,
        proxies: hasExitProxies
            ? exitProxies.map((proxy) => proxy.name).filter((name) => name.match(e.filter))
            : [],
        use:     exitProviderKeys,
    }));
    if (hasExitProxies)
        exitGroups = exitGroups.filter((g) => IS_NOT_EMPTY(g.proxies));

    const exitSelectorGroup = [{
        name:    `${prefix}EXIT`,
        type:    "select",
        filter:  REGEX(_filter.ALL),
        proxies: exitGroups.map((g) => g.name),
        use:     exitProviderKeys,
        hidden:  false,
        icon:    prefix ? "" : WIKI("commons/f/f2/Send_icon.svg"),
    }];

    return { proxyGroups, relaySelectorGroup, exitGroups, exitSelectorGroup, exitProviders };
};

const CREATE_PROXIES_GROUPS_PROVIDERS = (proxies = [], providers = {}) => {
    let { proxyGroups, relaySelectorGroup, exitGroups, exitSelectorGroup, exitProviders } =
        CREATE_PROXY_GROUPS_WITH_PROVIDER(proxies, providers);

    const hasProviders = IS_NOT_EMPTY(providers);
    if (hasProviders) {
        const tempSelector     = [];
        const tempExitSelector = [];

        for (const [key, value] of Object.entries(providers)) {
            const pr = CREATE_PROXY_GROUPS_WITH_PROVIDER("", { [key]: value }, key);

            proxyGroups.push(...pr.proxyGroups);
            relaySelectorGroup.push(...pr.relaySelectorGroup);
            exitGroups.push(...pr.exitGroups);
            exitSelectorGroup.push(...pr.exitSelectorGroup);

            const [relayName] = pr.relaySelectorGroup.map(g => g.name);
            const [exitName]  = pr.exitSelectorGroup.map(g => g.name);
            tempSelector.push(relayName);
            tempExitSelector.push(exitName);

            Object.assign(exitProviders, pr.exitProviders);
        }

        relaySelectorGroup[0].proxies.unshift(...tempSelector);
        exitSelectorGroup[0].proxies.unshift(...tempExitSelector);
    };

    const proxyGroupNames = [
        ...exitSelectorGroup,
        ...relaySelectorGroup,
        ...exitGroups,
        ...proxyGroups,
    ].map((g) => g.name);
    const prebuiltProxies = {
        selectFirst: ["SELECTOR", ...proxyGroupNames, "PASS", "DIRECT", "REJECT"],
        rejectFirst: ["REJECT", "SELECTOR", "PASS", "DIRECT"],
        directFirst: ["DIRECT", "SELECTOR", "PASS", "REJECT"],
    };

    const otherGroups = [
        {
            name: "SELECTOR",
            proxies: [...proxyGroupNames, "PASS", "DIRECT", "REJECT"],
            "include-all": true,
            icon: WIKI("commons/c/c0/Noto_Emoji_v2.034_1f537.svg"),
        },
    ].map((e) => CREATE_PROXY_GROUP({ ...e, type: "select", hidden: false }));
    const prebuiltGroups = [
        ...exitSelectorGroup,
        ...relaySelectorGroup,
        ...exitGroups,
        ...proxyGroups,
        ...otherGroups,
    ];
    const prebuiltProviders = Object.assign({}, providers, exitProviders);

    return { prebuiltProxies, prebuiltGroups, prebuiltProviders };
};

/* ========== Rule-Providers Configuration ========== */
// Docs:
//     https://wiki.metacubex.one/config/rule-providers/
//     https://wiki.metacubex.one/config/rule-providers/content/
//     https://wiki.metacubex.one/handbook/syntax/#_8
const CREATE_RULE_PROVIDER = (rules = [], options = {}) => ({
    type:     "inline",
    behavior: "classical",
    payload:  rules,
    ...options,
});

const units = {
    baseOptions:        { override: (config) => Object.assign(config, baseOptions) },
    geo:                { override: (config) => Object.assign(config, geo) },
    externalController: { override: (config) => Object.assign(config, externalController) },
    hosts:              { override: (config) => config.hosts = hosts },
    dns:                { override: (config) => config.dns = dns},
    adblockDns:         { override: (config) => config.dns.nameserver = _adblockDns },
    hoyo: {
        "rule-providers": {
            hoyo_gi_cn: CREATE_RULE_PROVIDER([
                "DOMAIN,dispatchosglobal.yuanshen.com",
                "DOMAIN,oseurodispatch.yuanshen.com",
                "DOMAIN,osusadispatch.yuanshen.com",
                "DOMAIN,osuspider.yuanshen.com",
            ]),
            hoyo_etc: CREATE_RULE_PROVIDER([
                "DOMAIN,minor-api-os.hoyoverse.com",
                //"DOMAIN,asia-ugc-api.hoyoverse.com",
                //"DOMAIN,asia-ugc-upload.hoyoverse.com",
                //"DOMAIN,asia-ugc-api-static.hoyoverse.com",
                "DOMAIN-REGEX,asia-ugc[\\w-]*\\.hoyoverse\\.com",      // GI UGC
                "DOMAIN-REGEX,[\\w-]*log-upload-os\\.hoyoverse\\.com",
            ]),
            hoyo_proxy: CREATE_RULE_PROVIDER([
                "DOMAIN-SUFFIX,hoyoverse.com",
                "DOMAIN-SUFFIX,hoyolab.com",
                "DOMAIN,autopatchhk.yuanshen.com",     // GI
                "DOMAIN,osasiadispatch.yuanshen.com",  // GI
                "AND,((DST-PORT,8999),(NETWORK,tcp))", // GI
            ]),
            hoyo_direct: CREATE_RULE_PROVIDER([
                "DOMAIN-SUFFIX,yuanshen.com",
                "DOMAIN-SUFFIX,mihoyo.com",
                "AND,((DST-PORT,22101-22102),(NETWORK,udp))", // GI
                "AND,((DST-PORT,23301/23801),(NETWORK,udp))", // HSR
                "AND,((DST-PORT,20501),(NETWORK,udp))",       // ZZZ
            ]),
            hoyo_final: CREATE_RULE_PROVIDER([
                "PROCESS-NAME-REGEX,.*GenshinImpact.*",         // GI
            ]),
        },
        "rules": [
            "RULE-SET,      hoyo_gi_cn,         HOYO_DIRECT",
            "RULE-SET,      hoyo_etc,           HOYO_DIRECT",
            "RULE-SET,      hoyo_proxy,         HOYO_PROXY",
            "RULE-SET,      hoyo_direct,        HOYO_DIRECT",
            "RULE-SET,      hoyo_final,         HOYO_PROXY",
        ],
        "proxy-groups": [
            {
                name: "HOYO_PROXY",
                url: "https://sdk.hoyoverse.com/hk4e/announcement/index.html?detect=123",
                icon: FAVICON("https://hoyoverse.com"),
            },
            {
                name: "HOYO_DIRECT",
                proxies: ["DIRECT", "HOYO_PROXY"],
                url: "https://sdk.hoyoverse.com/hk4e/announcement/index.html?detect=123",
                icon: FAVICON("https://hoyoverse.com"),
            },
         ],
    },
    sbcz: {
        "rule-providers": {
            sbcz: CREATE_RULE_PROVIDER([
                "DOMAIN-SUFFIX,xoyo.games",
                "DOMAIN-SUFFIX,amazingseasun.com",
                "DOMAIN-SUFFIX,amazingseasuncdn.com",
                "AND,((PROCESS-NAME,com.seasun.snowbreak.google),(DST-PORT,1883))",
            ]),
        },
        "rules": [
            "RULE-SET,      sbcz,               DIRECT",
        ],
        /*
        "proxy-groups": [
            {
                name: "SBCZ",
                proxies: "directFirst",
               icon: GPLAY("rzvj2FaKgGNlLOjMPl0DVXX5uL9ash2u_2JZu_eAmYcleMrw4Hgecla1dF8XRw5rgfY"),
            },
        ],
        */
    },
    ad: {
        "rule-providers": {
            miui_ad: CREATE_RULE_PROVIDER([
                // Avlyun / sec.miui CSE
                "miui-fxcse.avlyun.com",     "update.avlyun.sec.miui.com",
                "sdkconf.avlyun.com",        "ixav-cse.avlyun.com",
                "miav-cse.avlyun.com",       "logupdate.avlyun.sec.miui.com",
                // ByteDance
                "tbm.snssdk.com",            "toblog.ctobsnssdk.com",
                "ug.snssdk.com",             "tobapplog.ctobsnssdk.com",
                // Xunlei / Sandai
                "hub5pn.wap.sandai.net",     "master.wap.dphub.sandai.net",
                "hub5u.wap.sandai.net",      "idx.m.hub.sandai.net",
                "tw13b093.sandai.net",       "uploadlog.xlmc.sandai.net",
                "t03-api.xlmc.xunlei.com",   "pre.api.tw06.xlmc.sandai.net",
                "guid-xldw-ssl.n0808.com",
                // MIUI Browser
                "api.browser.miui.com",      "ssl-cdn.static.browser.mi-img.com",
                "hot.browser.miui.com",      "security.browser.miui.com",
                "r.browser.miui.com",        "hd.browser.miui.com",
                "c3-cache.browser.miui.com", "api-ipv4.browser.miui.com",
                "qsb.browser.miui.com",      "global-search.browser.miui.com",
                "qsb.browser.miui.srv",
                // QuickApp
                "statres.quickapp.cn",       "qr.quickapp.cn",
                // Xiaomi / MIUI telemetry & ads
                "api.installer.xiaomi.com",  "tracking.miui.com",   "data.mistat.xiaomi.com",
                "diagnosis.ad.xiaomi.com",   "log.ad.xiaomi.com",   "m.track.ad.xiaomi.com",
                "sdkconfig.ad.xiaomi.com",   "api.ad.xiaomi.com",   "tracker.ai.xiaomi.com",
                "grayconfig.ai.xiaomi.com",  "mazu.sec.miui.com",   "adinfo.ra1.xlmc.sec.miui.com",
                "auth.be.sec.miui.com",      "flash.sec.miui.com",  "port.sec.miui.com",
                "data.sec.miui.com",         "update.miui.com",     "api.hybrid.xiaomi.com",
                "hybrid.xiaomi.com",         "hybrid.miui.com",     "o2o.api.xiaomi.com",
                "test.ad.xiaomi.com",        "api.sec.miui.com",
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
                // Misc
                "beacon-api.aliyuncs.com",   "s1.irs03.com",        "pssn.alicdn.com",
                "mpush-api.aliyun.com",      "up.cm.ksmobile.com",  "dl.cm.ksmobile.com",
                "dw-online.ksosoft.com",     "zzhc.vnet.cn",        "t7z.cupid.iqiyi.com",
                "rdt.tfogc.com",             "pgdt.gtimg.cn",       "worldwide.sogou.com",
                "www.pangolin-dsp-toutiao.com",
            ], { behavior: "domain" }),
        },
        "rules": [
            "RULE-SET,      miui_ad,            MIUI_AD",
            "GEOSITE,       category-ads-all,   AD",
        ],
        "proxy-groups": [
            {
                name: "MIUI_AD",
                proxies: "rejectFirst",
                icon: FAVICON("https://www.mi.com/"),
            },
            {
                name: "AD",
                proxies: "rejectFirst",
                icon: WIKI("commons/1/1c/Codex_icon_Block_red.svg"),
            },

        ],
    },
    browser: {
        "rule-providers": {
            browser: CREATE_RULE_PROVIDER([
                "PROCESS-NAME,net.quetta.browser",
            ]),
        },
        "rules": [
            "SUB-RULE,(RULE-SET,browser),sub_browser",
        ],
        "sub-rules": {
            sub_browser: [
                "GEOSITE,       geolocation-!cn,    BROWSER",
                "RULE-SET,      local,              CN",
                "GEOSITE,       private,            CN",
                "GEOSITE,       CN,                 CN",
                "GEOIP,         private,            CN,              no-resolve",
                "GEOIP,         CN,                 CN,              no-resolve",
                "MATCH,BROWSER",
            ],
        },
        "proxy-groups": [
            {
                name: "BROWSER",
                "include-all": true,
                icon: WIKI("commons/0/08/Internet-icon.svg"),
            },
        ],
    },
    downloader: {
        "rule-providers": {
            downloader: CREATE_RULE_PROVIDER([
                "PROCESS-NAME,idm.internet.download.manager",
            ]),
        },
        "rules": [
            "SUB-RULE,(RULE-SET,downloader),sub_downloader",
        ],
        "sub-rules": {
            sub_downloader: [
                "GEOSITE,       geolocation-!cn,    DOWNLOADER",
                "RULE-SET,      local,              CN",
                "GEOSITE,       private,            CN",
                "GEOSITE,       CN,                 CN",
                "GEOIP,         private,            CN,              no-resolve",
                "GEOIP,         CN,                 CN,              no-resolve",
                "MATCH,DOWNLOADER",
            ],
        },
        "proxy-groups": [
            {
                name: "DOWNLOADER",
                "include-all": true,
                icon: WIKI("commons/0/08/Paomedia_small-n-flat_cloud-down.svg"),
            },
        ],
    },
    ehentai: {
        "rules": [
            "GEOSITE,       ehentai,            EHENTAI",
        ],
        "proxy-groups": [
            {
                name: "EHENTAI",
                "include-all": true,
                icon: WIKI("commons/b/b5/Noto_Emoji_KitKat_1f43c.svg"),
            },
        ],
    },
    github: {
        "rules": [
            "GEOSITE,       github,             GITHUB",
        ],
        "proxy-groups": [
            {
                name: "GITHUB",
                "include-all": true,
                icon: WIKI("commons/c/c6/Font_Awesome_5_brands_github-square.svg"),
            },
        ],
    },
    microsoft: {
        "rules": [
            "GEOSITE,       microsoft,          MICROSOFT",
        ],
        "proxy-groups": [
            {
                name: "MICROSOFT",
                icon: WIKI("commons/2/25/Microsoft_icon.svg"),
            },
        ],
    },
    steam_cn: {
        "rules": [
            "GEOSITE,       steam@cn,           STEAM_CN",
            "DOMAIN-SUFFIX, steamserver.net,    STEAM_CN",
        ],
        "proxy-groups": [
           {
                name: "STEAM_CN",
                proxies: "directFirst",
                icon: WIKI("commons/8/83/Steam_icon_logo.svg"),
            },
        ],
    },
    steam: {
        "rules": [
            "GEOSITE,       steam,              STEAM",
        ],
        "proxy-groups": [
             {
                name: "STEAM",
                icon: WIKI("commons/8/83/Steam_icon_logo.svg"),
            },
        ],
    },
    pixiv: {
        "rules": [
            "GEOSITE,       pixiv,              PIXIV",
        ],
        "proxy-groups": [
            {
                name: "PIXIV",
                icon: GPLAY("UADIlh0kSQkh59fl-s3RgLFILa_EY5RqA4sMOtKD-fX0z0fDVUR7_a7ysylufmhH-K-XfhSVVdpspD8K0jtu"),
            },
        ],
    },
    ai: {
        "rules": [
            "GEOSITE,       category-ai-!cn,    AI",
        ],
        "proxy-groups": [
            {
                name: "AI",
                icon: GPLAY("lmG9HlI0awHie0cyBieWXeNjpyXvHPwDBb8MNOVIyp0P8VEh95AiBHtUZSDVR3HLe3A"),
            },
        ],
    },
    youtube: {
        "rules": [
            "GEOSITE,       youTube,            YOUTUBE",
        ],
        "proxy-groups": [
            {
                name: "YOUTUBE",
                icon: FAVICON("https://youtube.com"),
            },
       ],
    },
    google_fcm: {
        "rules": [
            "GEOSITE,       googlefcm,          GOOGLE_FCM",
        ],
        "proxy-groups": [
            {
                name: "GOOGLE_FCM",
                proxies: "directFirst",
                icon: FAVICON("https://firebase.google.com"),
            },
        ],
    },
    google: {
        "rules": [
            "GEOIP,         google,             GOOGLE,          no-resolve",
            "GEOSITE,       google,             GOOGLE",
        ],
        "proxy-groups": [
             {
                name: "GOOGLE",
                icon: WIKI("commons/c/c1/Google_%22G%22_logo.svg"),
            },
        ],
    },
    twitter: {
        "rules": [
            "GEOIP,         twitter,            TWITTER,         no-resolve",
            "GEOSITE,       twitter,            TWITTER",
        ],
        "proxy-groups": [
            {
                name: "TWITTER",
                icon: WIKI("commons/6/6f/Logo_of_Twitter.svg"),
            },
        ],
    },
    telegram: {
        "rules": [
            "GEOIP,         telegram,           TELEGRAM,        no-resolve",
            "GEOSITE,       telegram,           TELEGRAM",
        ],
        "proxy-groups": [
            {
                name: "TELEGRAM",
                icon: WIKI("commons/8/82/Telegram_logo.svg"),
            },
        ],
    },
    discord: {
        "rules": [
            "GEOSITE,       discord,            DISCORD",
        ],
        "proxy-groups": [
            {
                name: "DISCORD",
                icon: WIKI("fr/4/4f/Discord_Logo_sans_texte.svg"),
            },
        ],
    },
    apple: {
        "rules": [
            "GEOSITE,       apple,              APPLE",
            "GEOSITE,       apple-intelligence, APPLE",
        ],
        "proxy-groups": [
            {
                name: "APPLE",
                icon: WIKI("commons/8/84/Apple_Computer_Logo_rainbow.svg"),
            },
        ],
    },
    non_jp: {
        "rules": [
            "DOMAIN-SUFFIX, hinative.com,       NON_JP",
            "DOMAIN-SUFFIX, game8.jp,           NON_JP",
        ],
        "proxy-groups": [
            {
                name: "NON_JP",
                icon: WIKI("commons/4/45/Wikimania2019_flower_icon.svg"),
            },
        ],
    },
    jp: {
        "rules": [
            "DOMAIN-REGEX,  .*\\.jp,            JP",
            "GEOIP,         JP,                 JP,              no-resolve",
        ],
        "proxy-groups": [
            {
                name: "JP",
                icon: WIKI("commons/5/54/Noto_Emoji_v2.034_1f338.svg"),
            },
        ],
    },
    non_cn: {
        "rules": [
            "GEOSITE,       geolocation-!cn,    FINAL",
        ],
    },
    cn: {
        "rule-providers": {
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
        },
        "rules": [
            "RULE-SET,      local,              CN",
            "GEOSITE,       private,            CN",
            "GEOSITE,       CN,                 CN",
            "GEOIP,         private,            CN",
            "GEOIP,         CN,                 CN",
        ],
        "proxy-groups": [
            {
                name: "CN",
                proxies: "directFirst",
                url: "http://connect.rom.miui.com/generate_204",
                icon: WIKI("commons/8/8b/Noto_Emoji_v2.034_2b50.svg"),
            },
        ],
    },
    final: {
        "rules": [
            "MATCH,FINAL",
        ],
        "proxy-groups": [
            {
                name: "FINAL",
                "include-all": true,
                icon: GITHUB("final"),
            },
        ],
    },
    tiktok: {
        "rules": [
            "GEOSITE,       tiktok,             TIKTOK",
        ],
        "proxy-groups": [
            {
                name: "TIKTOK",
                "include-all": true,
                icon: GITHUB("tiktok"),
            },
        ],
    },
    tailscale: {
        "rule-providers": {
            tailscale: CREATE_RULE_PROVIDER([
                "DOMAIN-REGEX,.*\\.tail[\\w]*\\.ts\\.net",
                "IP-CIDR,100.0.0.0/8",
            ]),
        },
        "rules": [
            "RULE-SET,      tailscale,          TAILSCALE",
        ],
        "proxy-groups": [
            {
                name: "TAILSCALE",
                proxies: ["Tailscale"],
                icon: FAVICON("https://tailscale.com"),
                url: "https://hello.ts.net",
            },
        ],
        override: (config) => {
            const proxies = [{
                name:       "Tailscale",
                type:       "tailscale",
                hostname:   "mihomo",
                "auth-key": "tskey-blabla",
            }];
            if (config.proxies) {
                config.proxies.push(proxies);
            } else {
                config.proxies = proxies;
            };
        },
    },

};

const apply = (config, keys=[]) => {
    const { prebuiltProxies, prebuiltGroups, prebuiltProviders } = CREATE_PROXIES_GROUPS_PROVIDERS(config.proxies, config["proxy-providers"]);

    const ruleProviders = {};
    const rules         = [];
    const subRules      = {};
    let   proxyGroups   = [];
    for (const key of keys) {
        const unit = units[key];
        if (unit["rule-providers"]) Object.assign(ruleProviders, unit["rule-providers"]);
        if (unit.rules)             rules.push(...unit.rules);
        if (unit["sub-rules"])      Object.assign(subRules, unit["sub-rules"]);
        if (unit["proxy-groups"])   proxyGroups.push(...unit["proxy-groups"]);
        if (unit.override)          unit.override(config);
    }
    proxyGroups = proxyGroups.map((g) => {
        const base = CREATE_PROXY_GROUP({ ...g, type: "select", hidden: false });

        if (!IS_NOT_EMPTY(base.proxies)) {
            base.proxies = prebuiltProxies.selectFirst;
        } else if (typeof base.proxies === 'string') {
            base.proxies = prebuiltProxies[base.proxies];
        }

        return base;
    });

    config["proxy-providers"] = { ...prebuiltProviders };
    config["rule-providers"]  = ruleProviders;
    config.rules              = rules;
    config["sub-rules"]       = subRules;
    config["proxy-groups"]    = [...prebuiltGroups, ...proxyGroups];
};

/* ========== Entry Point ========== */
const main = (config) => {
    apply(config, [
        "baseOptions",
        "geo",
        "externalController",
        "host",
        "dns",
        //"adblockDns",
        //"tailscale",
        "hoyo",
        "sbcz",
        "ad",
        "browser",
        "downloader",
        "ehentai",
        "pixiv",
        "ai",
        "steam_cn",
        "steam",
        "github",
        "microsoft",
        "youtube",
        "google_fcm",
        "google",
        "apple",
        "twitter",
        "telegram",
        "discord",
        "tiktok",
        "non_jp",
        "jp",
        "non_cn",
        "cn",
        "final",
    ]);
    return config;
};

const IS_NODE = typeof process !== "undefined" && !!process.versions?.node;
if (IS_NODE) module.exports = { main, apply, units };
