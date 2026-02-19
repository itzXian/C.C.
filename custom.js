// Version: 1.0
// Reference:
//     https://www.clashverge.dev/guide/script.html
//     https://github.com/yyhhyyyyyy/selfproxy/blob/cb1470d2a321051573d3ecc902a692173b9dd787/Mihomo/Extension_Script/script.js

/* ========== Base-Options Configuration ========== */
const overrideBasicOptions = (config) => {
    Object.assign(config, {
        "mixed-port": 7890,
        "allow-lan": true,
        mode: "rule",
        "geox-url": {
            geoip:   "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.dat",
            geosite: "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geosite.dat",
            mmdb:    "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.metadb",
            asn:     "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/GeoLite2-ASN.mmdb",
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
            "127.0.0.1.sslip.io": "127.0.0.1",
            "127.atlas.skk.moe":  "127.0.0.1",
            "cdn.jsdelivr.net":   "cdn.jsdelivr.net.cdn.cloudflare.net",
        },
    });
};

const overrideExternalController = (config) => {
    Object.assign(config, {
        "external-controller": `0.0.0.0:${Math.floor(Math.random() * 9999) + 10000}`,
        secret:                Math.random().toString(36).slice(2),
        "external-ui":         "ui",
        "external-ui-url":     "https://github.com/Zephyruso/zashboard/releases/download/v2.6.0/dist-no-fonts.zip",
    });
};

const overrideDns = (config) => {
    const directDns  = ["quic://223.5.5.5:853", "tls://223.5.5.5:853"];
    const proxyDns   = ["tls://1.0.0.1:853", "tls://1.1.1.1", "tls://8.8.8.8:853", "tls://8.8.4.4:853"];
    const adblockDns = ["dns.adguard-dns.com"];

    const fakeIpFilter = [
        "+.m2m", "injections.adguard.org", "local.adguard.org", "+.bogon", "+.lan", "+.local",
        "+.internal", "+.localdomain", "home.arpa", "127.0.0.1.sslip.io", "127.atlas.skk.moe",
        "dns.msftncsi.com", "*.srv.nintendo.net", "*.stun.playstation.net", "xbox.*.microsoft.com",
        "*.xboxlive.com", "*.turn.twilio.com", "*.stun.twilio.com", "stun.syncthing.net", "stun.*",
        "127.*.*.*.sslip.io", "127-*-*-*.sslip.io", "*.127.*.*.*.sslip.io", "*-127-*-*-*.sslip.io",
        "127.*.*.*.nip.io", "127-*-*-*.nip.io", "*.127.*.*.*.nip.io", "*-127-*-*.nip.io",
    ];

    config.dns = {
        enable:                    true,
        "prefer-h3":               false,
        ipv6:                      false,
        "respect-rules":           true,
        "default-nameserver":      directDns,
        "proxy-server-nameserver": directDns,
        "enhanced-mode":           "fake-ip",
        "fake-ip-range":           "198.18.0.1/16",
        "fake-ip-filter-mode":     "blacklist",
        "fake-ip-filter": [
            ...fakeIpFilter,
            "geosite:private",
            "geosite:connectivity-check"
        ],
        "nameserver-policy": {
            "+.twimg.com":         proxyDns,
            "+.pximg.net":         proxyDns,
            "cdn.discordapp.com":  proxyDns,
        },
        "direct-nameserver":       directDns,
        "direct-nameserver-follow-policy": true,
        nameserver:                adblockDns,
    };
};

/* ========== Rule-Providers Configuration ========== */
// Docs:
//     https://wiki.metacubex.one/config/rule-providers/
//     https://wiki.metacubex.one/config/rule-providers/content/
//     https://wiki.metacubex.one/handbook/syntax/#_8
const overrideRuleProviders = (config) => {
    config["rule-providers"] = {
        Hoyo_GI_CN: {
            type: "inline",
            behavior: "domain",
            payload: [
                "autopatchhk.yuanshen.com",
                "oseurodispatch.yuanshen.com",
                "osusadispatch.yuanshen.com",
                "osuspider.yuanshen.com",
            ],
        },
        Hoyo_GI: {
            type: "inline",
            behavior: "domain",
            payload: [
                "osasiadispatch.yuanshen.com",
            ],
        },
        Hoyo_GI_UGC: {
            type: "inline",
            behavior: "domain",
            payload: [
                "asia-ugc*.hoyoverse.com",
            ],
        },
        Hoyo_Direct: {
            type: "inline",
            behavior: "classical",
            payload: [
                "DOMAIN-REGEX,[\\w-]*log-upload-os\\.hoyoverse\\.com",
                "DOMAIN-SUFFIX,yuanshen.com",
                "DOMAIN-SUFFIX,mihoyo.com",
                "AND,((DST-PORT,22101-22102),(NETWORK,udp))", // GI
                "AND,((DST-PORT,23301/23801),(NETWORK,udp))", // HSR
                "AND,((DST-PORT,20501),(NETWORK,udp))",       // ZZZ
            ],
        },
        Hoyo_Proxy: {
            type: "inline",
            behavior: "classical",
            payload: [
                "DOMAIN-SUFFIX,hoyoverse.com,HOYO_PROXY",
                "DOMAIN-SUFFIX,hoyolab.com,HOYO_PROXY",
                "AND,((DST-PORT,8999),(NETWORK,tcp)),HOYO_PROXY", // GI
                "DOMAIN-SUFFIX,starrails.com,HOYO_PROXY",         // HSR
                "DOMAIN-SUFFIX,zenlesszonezero.com,HOYO_PROXY",   // ZZZ
            ],
        },
        MIUI_Bloatware: {
            type: "inline",
            behavior: "domain",
            payload: [
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
            ],
        },
    };
};

/* ========== Rules Configuration ========== */
const overrideRules = (config) => {
    config.rules = [
        "RULE-SET,      Hoyo_GI_CN,         HOYO_GI_CN",
        "RULE-SET,      Hoyo_GI,            HOYO_GI",
        "RULE-SET,      Hoyo_GI_UGC,        HOYO_GI_UGC",
        "RULE-SET,      Hoyo_Direct,        HOYO_DIRECT",
        "RULE-SET,      Hoyo_Proxy,         HOYO_PROXY",
        "GEOSITE,       hoyoverse,          HOYO_PROXY",
        "RULE-SET,      MIUI_Bloatware,     MIUI_BLOATWARE",
        "GEOSITE,       category-ads-all,   AD_BLOCK",
        "GEOSITE,       steam@cn,           STEAM_CN",
        "DOMAIN-SUFFIX, steamserver.net,    STEAM_CN",
        "GEOSITE,       steam,              STEAM",
        "GEOSITE,       pixiv,              PIXIV",
        "GEOSITE,       category-ai-!cn,    AI",
        "GEOSITE,       youTube,            YOUTUBE",
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
        "GEOIP,         JP,                 JP,              no-resolve",
        "GEOSITE,       geolocation-!cn,    PROXY",
        "GEOSITE,       private,            BYPASS",
        "GEOSITE,       CN,                 BYPASS",
        "GEOIP,         private,            BYPASS",
        "GEOIP,         CN,                 BYPASS",
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
}

const DEEP_CLONE = (obj) =>
    typeof structuredClone === "function"
        ? structuredClone(obj)
        : JSON.parse(JSON.stringify(obj));

const CREATE_PROXY_GROUP = (overrides) => ({
    hidden:            true,
    url:               "https://www.google.com/generate_204",
    "expected-status": "200/204/302",
    timeout:           3000,
    interval:          300,
    "exclude-filter":  "0.[0-9]",
    tolerance:         100,
    ...overrides,
});

const CREATE_RELAY_PROVIDER = (obj) => {
    const provider = Object.create(null);
    for (const key of Object.keys(obj)) {
        const relay = `🔗${key}`;
        provider[relay] = { ...obj[key], override: { "dialer-proxy": "SELECTOR", "additional-prefix": relay } };
    }
    return provider;
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
            ? proxies.map((p) => p.name).filter((n) => n.match(e.filter))
            : [],
        use:     providerKeys,
    }));
    if (!hasProviders)
        proxyGroups = proxyGroups.filter((p) => p.proxies);

    const selectorGroup = [{
        type:    "select",
        name:    `${prefix}SELECTOR`,
        filter:  REGEX(FILTER.ALL),
        proxies: proxyGroups.map((p) => p.name),
        use:     providerKeys,
        hidden:  false,
    }];

    const relayProxies   = hasProviders
        ? []
        : DEEP_CLONE(proxies);
    const relayProviders = hasProviders
        ? CREATE_RELAY_PROVIDER(providers)
        : CREATE_RELAY_PROVIDER({ "provider-relay": { type: "inline", payload: relayProxies } });
    const relayProviderKeys = Object.keys(relayProviders);
    const hasRelayProxies   = IS_NOT_EMPTY(relayProxies);

    let relayGroups = [
        { type: "url-test", name: "AUTO JP",  filter: REGEX(FILTER.JP) },
        { type: "url-test", name: "AUTO !JP", filter: REGEX(FILTER.ALL, `${FILTER.EXCLUDE}|${FILTER.JP}`) },
    ].map((e) => CREATE_PROXY_GROUP({
        ...e,
        name:    `${prefix}🔗${e.name}`,
        proxies: hasRelayProxies
            ? relayProxies.map((p) => p.name).filter((n) => n.match(e.filter))
            : [],
        use:     relayProviderKeys,
    }));
    if (hasRelayProxies)
        relayGroups = relayGroups.filter((p) => p.proxies);

    const relaySelectorGroup = [{
        type:    "select",
        name:    `${prefix}🔗RELAY`,
        filter:  REGEX(FILTER.ALL),
        proxies: relayGroups.map((p) => p.name),
        use:     relayProviderKeys,
        hidden:  false,
    }];

    return { proxyGroups, selectorGroup, relayGroups, relaySelectorGroup, relayProviders };
};

const overrideProxyGroups = (config) => {
    const providers = config?.["proxy-providers"] ?? {};
    const hasProviders = IS_NOT_EMPTY(providers);

    let { proxyGroups, selectorGroup, relayGroups, relaySelectorGroup, relayProviders } =
        CREATE_PROXY_GROUPS_WITH_PROVIDER(config.proxies, providers);

    if (hasProviders) {
        const tempSelector      = [];
        const tempRelaySelector = [];

        for (const [key, value] of Object.entries(providers)) {
            const pr = CREATE_PROXY_GROUPS_WITH_PROVIDER("", { [key]: value }, key);
            proxyGroups        = [...proxyGroups,        ...pr.proxyGroups];
            selectorGroup      = [...selectorGroup,      ...pr.selectorGroup];
            relayGroups        = [...relayGroups,        ...pr.relayGroups];
            relaySelectorGroup = [...relaySelectorGroup, ...pr.relaySelectorGroup];
            relayProviders     = { ...relayProviders,    ...pr.relayProviders };
            tempSelector.push(pr.selectorGroup[0].name);
            tempRelaySelector.push(pr.relaySelectorGroup[0].name);
        }

        selectorGroup[0].proxies.unshift(...tempSelector);
        relaySelectorGroup[0].proxies.unshift(...tempRelaySelector);
    }

    const allGroups = [
        ...relaySelectorGroup,
        ...selectorGroup,
        ...relayGroups,
        ...proxyGroups,
    ];
    const proxyGroupNames = allGroups.map((e) => e.name);

    const customFirst = { proxies: ["CUSTOM", ...proxyGroupNames, "DIRECT", "REJECT"] };
    const directFirst = { proxies: ["DIRECT", "CUSTOM", "REJECT"] };
    const rejectFirst = { proxies: ["REJECT", "CUSTOM", "DIRECT"] };

    const otherGroups = [
        { name: "CUSTOM",      proxies: [...proxyGroupNames, "DIRECT", "REJECT"] },
        { name: "HOYO_GI_CN",  proxies: ["HOYO_DIRECT", "HOYO_PROXY"], url: "https://yuanshen.com" },
        { name: "HOYO_GI",     proxies: ["HOYO_PROXY", "HOYO_DIRECT"] },
        { name: "HOYO_GI_UGC", proxies: ["HOYO_PROXY", "HOYO_DIRECT"] },
        { name: "HOYO_DIRECT",    ...directFirst },
        { name: "HOYO_PROXY",     ...customFirst },
        { name: "MIUI_BLOATWARE", ...rejectFirst },
        { name: "AD_BLOCK",       ...rejectFirst },
        { name: "STEAM_CN",       ...directFirst },
        { name: "STEAM",          ...customFirst },
        { name: "PIXIV",          ...customFirst },
        { name: "AI",             ...customFirst },
        { name: "YOUTUBE",        ...customFirst },
        { name: "GOOGLE",         ...customFirst },
        { name: "TWITTER",        ...customFirst },
        { name: "TELEGRAM",       ...customFirst },
        { name: "DISCORD",        ...customFirst },
        { name: "MICROSOFT",      ...customFirst },
        { name: "APPLE",          ...customFirst },
        { name: "NON_JP",         ...customFirst },
        { name: "JP",             ...customFirst },
        { name: "PROXY",          ...customFirst },
        { name: "BYPASS",         ...directFirst, url: "http://connect.rom.miui.com/generate_204" },
        { name: "FINAL",          ...customFirst },
    ].map((e) => CREATE_PROXY_GROUP({ ...e, type: "select", hidden: false }));

    config["proxy-groups"]    = [...allGroups, ...otherGroups];
    config["proxy-providers"] = { ...providers, ...relayProviders };
};

/* ========== Icon Support ========== */
const GITHUB  = (name) => `https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/icon/color/${name}.png`;
const WIKI    = (path) => `https://upload.wikimedia.org/wikipedia/commons/${path}`;
const GPLAY   = (id)   => `https://play-lh.googleusercontent.com/${id}`;
const FAVICON = (url)  => `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=256`;

const ICON_MAP = {
    RELAY:          WIKI("3/3a/Noto_Emoji_v2.034_1f517.svg"),
    SELECTOR:       GITHUB("manual"),
    CUSTOM:         WIKI("c/c0/Noto_Emoji_v2.034_1f537.svg"),
    HOYO_GI_CN:     GPLAY("YQqyKaXX-63krqsfIzUEJWUWLINxcb5tbS6QVySdxbS7eZV7YB2dUjUvX27xA0TIGtfxQ5v-tQjwlT5tTB-O"),
    HOYO_GI_UGC:    GPLAY("YQqyKaXX-63krqsfIzUEJWUWLINxcb5tbS6QVySdxbS7eZV7YB2dUjUvX27xA0TIGtfxQ5v-tQjwlT5tTB-O"),
    HOYO_GI:        GPLAY("YQqyKaXX-63krqsfIzUEJWUWLINxcb5tbS6QVySdxbS7eZV7YB2dUjUvX27xA0TIGtfxQ5v-tQjwlT5tTB-O"),
    HOYO_DIRECT:    FAVICON("https://hoyoverse.com"),
    HOYO_PROXY:     FAVICON("https://hoyoverse.com"),
    HOYO_HSR:       GPLAY("IqXUfiwbK-NCu5KyyK9P3po1kd4ZPOC4QJVWRk2ooJXnUcSpkCUQRYYJ-9vZkCEnPOxDIEWjNpS30OwHNZTtCKw"),
    HOYO_ZZZ:       GPLAY("8jEmEvTsNIRW1vLlrDXXCcDlKkQrNb8NzccOXrln4G_DOUZpcBPbN9ssjuwBWz7_yZQ"),
    MIUI_BLOATWARE: FAVICON("https://www.mi.com/"),
    AD_BLOCK:       WIKI("1/1c/Codex_icon_Block_red.svg"),
    STEAM_CN:       WIKI("8/83/Steam_icon_logo.svg"),
    STEAM:          WIKI("8/83/Steam_icon_logo.svg"),
    PIXIV:          GPLAY("UADIlh0kSQkh59fl-s3RgLFILa_EY5RqA4sMOtKD-fX0z0fDVUR7_a7ysylufmhH-K-XfhSVVdpspD8K0jtu"),
    AI:             GPLAY("lmG9HlI0awHie0cyBieWXeNjpyXvHPwDBb8MNOVIyp0P8VEh95AiBHtUZSDVR3HLe3A"),
    YOUTUBE:        FAVICON("https://youtube.com"),
    GOOGLE:         WIKI("c/c1/Google_%22G%22_logo.svg"),
    TWITTER:        WIKI("6/6f/Logo_of_Twitter.svg"),
    TELEGRAM:       WIKI("8/82/Telegram_logo.svg"),
    DISCORD:        "https://upload.wikimedia.org/wikipedia/fr/4/4f/Discord_Logo_sans_texte.svg",
    MICROSOFT:      WIKI("2/25/Microsoft_icon.svg"),
    APPLE:          WIKI("8/84/Apple_Computer_Logo_rainbow.svg"),
    NON_JP:         WIKI("5/5c/Noto_Emoji_v2.034_1f536.svg"),
    JP:             WIKI("5/54/Noto_Emoji_v2.034_1f338.svg"),
    PROXY:          WIKI("2/26/Noto_Emoji_v2.034_1f310.svg"),
    BYPASS:         WIKI("8/8b/Noto_Emoji_v2.034_2b50.svg"),
    FINAL:          GITHUB("final"),
};

const setProxyGroupIcon = (config) => {
    for (const g of config["proxy-groups"]) {
        if (!g.hidden) {
            g.icon = ICON_MAP?.[g.name.match(/[A-Za-z0-9_]+$/)?.[0]] ?? "";
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
