// Version: 2.0
// Reference:
//     https://www.clashverge.dev/guide/script.html
//     https://github.com/yyhhyyyyyy/selfproxy/blob/cb1470d2a321051573d3ecc902a692173b9dd787/Mihomo/Extension_Script/script.js

/* ========== Base-Options Configuration ========== */
const options = [
    "configBase",
    "configGeo",
    "configExternalController",
    "configHosts",
    "configDns",
    "configTun",
    //"configAdblockDns",
    //"configExitProvider",
    //"tailscale",
    "browser",
    "downloader",
    "hoyo",
    "sbcz",
    "ehentai",
    "ad",
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
];

const configBase = {
    "mixed-port":          7890,
    "allow-lan":           true,
    mode:                  "rule",
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

const cdn = "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release";
const configGeo = {
    "geox-url": {
        geoip:   `${cdn}/geoip.dat`,
        geosite: `${cdn}/geosite.dat`,
        mmdb:    `${cdn}/geoip.metadb`,
        asn:     `${cdn}/GeoLite2-ASN.mmdb`,
    },
    "geo-auto-update":     true,
    "geo-update-interval": 24,
};

const port   = Math.floor(Math.random() * 9999) + 10000;
const secret = Math.random().toString(36).slice(2);
const configExternalController = {
    "external-controller": `0.0.0.0:${port}`,
    "secret":              secret,
    "external-ui":         "ui",
    "external-ui-url":     "https://github.com/Zephyruso/zashboard/releases/latest/download/dist-no-fonts.zip",
};

const configHosts = {
    "dns.alidns.com":        ["223.5.5.5", "223.6.6.6", "2400:3200:baba::1", "2400:3200::1"],
    "127.0.0.1.sslip.io":    "127.0.0.1",
    "127.atlas.skk.moe":     "127.0.0.1",
    "cdn.jsdelivr.net":      "cdn.jsdelivr.net.cdn.cloudflare.net",
};

const directDns    = ["https://dns.alidns.com/dns-query", "https://doh.pub/dns-query"];
const proxyDns     = ["https://1.1.1.1/dns-query", "https://dns.google/dns-query"];
const adblockDns   = ["https://dns.adguard-dns.com/dns-query"];
const configDns = {
    enable:                true,
    "use-hosts":           true,
    "use-system-hosts":    true,
    "prefer-h3":           true,
    ipv6:                  false,
    "default-nameserver":  [
        "https://223.5.5.5/dns-query",
        "https://1.12.12.12/dns-query",
        "https://120.53.53.53/dns-query"
    ],
    "enhanced-mode":       "fake-ip",
    "fake-ip-range":       "198.18.0.1/16",
    "fake-ip-filter-mode": "rule",
    "fake-ip-filter": [
        "RULE-SET, fakeIpFilter,       real-ip",
        "GEOSITE,  private,            real-ip",
        "GEOSITE,  connectivity-check, real-ip",
        "GEOSITE,  category-ntp,       real-ip",
        "MATCH,                        fake-ip",
    ],
    "nameserver-policy":       {},
    nameserver:                proxyDns,
    "proxy-server-nameserver": directDns,
    "direct-nameserver":       directDns,
};

const configTun = {
    enable:                  true,
    stack:                   "system",
    "auto-route":            true,
    "auto-redirect":         true,
    "auto-detect-interfact": true,
    "dns-hijack": [
        "any:53",
        "tcp://any:53"
    ],
    "strict-route":          true,
};

const configExitProvider = {};

/* ========== Proxy Groups Configuration ========== */
const Filter = {
    hk:      "香港|HK|Hong|🇭🇰",
    tw:      "台湾|TW|Taiwan|Wan|🇹🇼|🇨🇳",
    sg:      "新加坡|狮城|SG|Singapore|🇸🇬",
    jp:      "日本|JP|Japan|🇯🇵",
    kr:      "韩国|韓|KR|Korea|🇰🇷",
    au:      "澳大利亚|澳|AU|Australia|🇦🇺",
    us:      "美国|US|United States|America|🇺🇸",
    uk:      "英国|UK|United Kingdom|🇬🇧",
    fr:      "法国|FR|France|🇫🇷",
    de:      "德国|DE|Germany|🇩🇪",
    exclude: "剩余|到期|主页|官网|游戏|关注|网站|地址|有效|网址|禁止|邮箱|发布|客服|订阅|节点|问题|联系",
    all:     "",
};

const buildRegex = (includeTerm, excludeTerm = Filter.exclude) =>
    includeTerm
        ? `^(?=.*(${includeTerm}))(?!.*${excludeTerm}).*$`
        : `^((?!.*${excludeTerm}).)*$`;

const hasValue = (value) => {
    if (value == null)             return false;
    if (typeof value === "string") return value.trim() !== "";
    if (Array.isArray(value))      return value.length > 0;
    if (typeof value === "object") return Object.keys(value).length > 0;
    return true;
};

const mergeInto = (target, source) => {
    for (const key of Object.keys(source)) {
        if (Array.isArray(target[key])) {
            target[key] = target[key].concat(source[key]);
        } else if (typeof target[key] === "object") {
            Object.assign(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
};

/* ========== Icon Support ========== */
const Icon = {
    github:  (name) => `https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/icon/color/${name}.png`,
    wiki:    (path) => `https://upload.wikimedia.org/wikipedia/${path}`,
    gplay:   (hash) => `https://play-lh.googleusercontent.com/${hash}`,
    favicon: (url)  => `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=256`,
};

const buildGroup = (overrides) => ({
    name:              overrides.name, // keep the name first, for easier viewing
    hidden:            true,
    url:               "https://www.google.com/generate_204",
    "expected-status": "200/204/302",
    timeout:           3000,
    interval:          1800,
    //"exclude-filter":  "0.[0-9][倍xX✕✖⨉]",
    //"exclude-filter":  "(?:0\.[1-9]|[2-9])[倍xX✕✖⨉]",
    //"exclude-filter":  "[2-9][倍xX✕✖⨉]",
    tolerance:         50,
    ...overrides,
});

const buildExitProvider = (providers) =>
    Object.fromEntries(
        Object.entries(providers).map(([key, value]) => {
            const exitProviderKey = `→${key}`;
            return [exitProviderKey, {
                ...value,
                override: {
                    ...(value?.override ?? {}),
                    "dialer-proxy":      "RELAY",
                    "additional-prefix": exitProviderKey,
                },
            }];
        })
    );

const buildGroupsWithProvider = (proxies = [], providers = {}, prefix = "") => {
    const providerKeys = Object.keys(providers);
    const hasProviders = hasValue(providers);
    const proxyNames = hasValue(proxies) ? proxies.map(p => p.name) : [];

    let relayGroups = [
        {
            name: "FALLBACK HKSG",
            type: "fallback",
            filter: buildRegex(["hk", "sg"].map(e => Filter[e]).join("|")),
            proxies: [`${prefix}AUTO HK`, `${prefix}AUTO SG`],
        },
        { name: "LBCH HKSG", type: "load-balance", filter: buildRegex(["hk", "sg"].map(e => Filter[e]).join("|")), strategy: "consistent-hashing", timeout: 500 },
        //{ name: "AUTO HKSG", type: "url-test", filter: buildRegex(["hk", "sg"].map(e => Filter[e]).join("|")) },
        { name: "AUTO JP",   type: "url-test", filter: buildRegex(Filter.jp) },
        { name: "AUTO HK",   type: "url-test", filter: buildRegex(Filter.hk) },
        { name: "AUTO SG",   type: "url-test", filter: buildRegex(Filter.sg) },
        { name: "AUTO AU",   type: "url-test", filter: buildRegex(Filter.au) },
        { name: "AUTO US",   type: "url-test", filter: buildRegex(Filter.us) },
        //{ name: "AUTO !JP",  type: "url-test", filter: buildRegex(Filter.all, `${Filter.exclude}|${Filter.jp}`) },
        { name: "AUTO ALL",  type: "url-test", filter: buildRegex(Filter.all) },
        { name: "LBRR HK",   type: "load-balance", filter: buildRegex(Filter.hk), strategy: "round-robin", timeout: 500 },
        { name: "LBRR SG",   type: "load-balance", filter: buildRegex(Filter.sg), strategy: "round-robin", timeout: 500 },
    ].map(e => buildGroup({
        use:     providerKeys,
        ...e,
        name:    `${prefix}${e.name}`,
        proxies: e?.proxies || [].concat(proxyNames.filter(n => n.match(e.filter))),
    }));
    if (!hasProviders)
        relayGroups = relayGroups.filter(g => hasValue(g.proxies));

    const relaySelectorGroup = [{
        name:    `${prefix}RELAY`,
        type:    "select",
        filter:  buildRegex(Filter.all),
        proxies: [...relayGroups.map(g => g.name), ...proxyNames],
        use:     providerKeys,
        hidden:  false,
        icon:    prefix ? "" : Icon.wiki("commons/3/3a/Noto_Emoji_v2.034_1f517.svg"),
    }];

    const exitProviders    = hasProviders
        ? buildExitProvider(providers)
        : buildExitProvider({ "provider-exit": { type: "inline", payload: proxies } });
    const exitProviderKeys = Object.keys(exitProviders);

    let exitGroups = [
        {
            name: "FALLBACK JP",
            type: "fallback",
            filter: buildRegex(Filter.jp),
            proxies: [`→${prefix}AUTO JP (1X)`, `→${prefix}AUTO JP`],
        },
        {
            name: "FALLBACK HKSG",
            type: "fallback",
            filter: buildRegex(["hk", "sg"].map(e => Filter[e]).join("|")),
            proxies: [`${prefix}AUTO HK`, `${prefix}AUTO SG`],
        },
        {
            name: "LBCH JP",
            type: "load-balance",
            filter: buildRegex(Filter.jp),
            strategy: "consistent-hashing",
            timeout: 500,
        },
        {
            name: "LBCH JP (1X)",
            type: "load-balance",
            filter: buildRegex(Filter.jp),
            "exclude-filter":  "(?:0\.[1-9]|[2-9])[倍xX✕✖⨉]",
            strategy: "consistent-hashing",
            timeout: 500,
        },
        {
            name: "LBCH HKSG",
            type: "load-balance",
            filter: buildRegex(["hk", "sg"].map(e => Filter[e]).join("|")),
            strategy: "consistent-hashing",
            timeout: 500,
        },
        {
            name: "AUTO JP (1X)",
            type: "url-test",
            filter: buildRegex(Filter.jp),
            "exclude-filter": "(?:0\.[1-9]|[2-9])[倍xX✕✖⨉]",
        },
        { name: "AUTO JP",       type: "url-test", filter: buildRegex(Filter.jp) },
        { name: "AUTO HK",       type: "url-test", filter: buildRegex(Filter.hk) },
        { name: "AUTO SG",       type: "url-test", filter: buildRegex(Filter.sg) },
        //{ name: "AUTO !JP",      type: "url-test", filter: buildRegex(Filter.all, `${Filter.exclude}|${Filter.jp}`) },
    ].map(e => buildGroup({
        use:     exitProviderKeys,
        ...e,
        name:    `→${prefix}${e.name}`,
        proxies: e?.proxies || [].concat(proxyNames.filter(n => n.match(e.filter))),
    }));
    if (!hasProviders)
        exitGroups = exitGroups.filter(g => hasValue(g.proxies));

    const exitSelectorGroup = [{
        name:    `${prefix}EXIT`,
        type:    "select",
        filter:  buildRegex(Filter.all),
        proxies: exitGroups.map(g => g.name),
        use:     exitProviderKeys,
        hidden:  false,
        icon:    prefix ? "" : Icon.wiki("commons/f/f2/Send_icon.svg"),
    }];

    return { exitProviders, exitSelectorGroup, exitGroups, relaySelectorGroup, relayGroups };
};

const buildProxiesGroupsProviders = (proxies = [], providers = {}) => {
    const base = buildGroupsWithProvider(proxies, providers);

    if (hasValue(providers)) {
        const tempRelaySelector = [];
        const tempExitSelector  = [];
        for (const [key, value] of Object.entries(providers)) {
            const temp = buildGroupsWithProvider("", { [key]: value }, key);
            mergeInto(base, temp);
            tempExitSelector .push(temp.exitSelectorGroup [0].name);
            tempRelaySelector.push(temp.relaySelectorGroup[0].name);

        }
        base.exitSelectorGroup [0].proxies.unshift(...tempExitSelector);
        base.relaySelectorGroup[0].proxies.unshift(...tempRelaySelector);
    }

    const orderedGroups = configExitProvider?.enable
        ? [...base.exitSelectorGroup, ...base.relaySelectorGroup, ...base.exitGroups, ...base.relayGroups]
        : [...base.relayGroups];
    const proxyGroupNames = orderedGroups.map(g => g.name);
    const prebuiltProxies = {
        selectFirst: ["SELECTOR", ...proxyGroupNames, "PASS", "DIRECT", "REJECT"],
        rejectFirst: ["REJECT", "SELECTOR", "PASS", "DIRECT"],
        directFirst: ["DIRECT", "SELECTOR", "PASS", "REJECT"],
    };
    const selectorGroup = [
        {
            name: "SELECTOR",
            proxies: [...proxyGroupNames, "PASS", "DIRECT", "REJECT"],
            "include-all": true,
            icon: Icon.wiki("commons/c/c0/Noto_Emoji_v2.034_1f537.svg"),
        },
    ].map(e => buildGroup({ ...e, type: "select", hidden: false }));

    return {
        prebuiltProxies,
        prebuiltGroups: [...orderedGroups, ...selectorGroup],
        prebuiltProviders: { ...providers, ...(configExitProvider?.enable ? base.exitProviders : {}) }
    };
};

/* ========== Rule-Providers Configuration ========== */
// Docs:
//     https://wiki.metacubex.one/config/rule-providers/
//     https://wiki.metacubex.one/config/rule-providers/content/
//     https://wiki.metacubex.one/handbook/syntax/#_8

const buildRuleSet = (rules = [], options = {}) => ({
    type:     "inline",
    behavior: "classical",
    payload:  rules,
    ...options,
});

const buildCommonSubRules = (target) => [
    "RULE-SET,      non_jp,             PASS",
    "RULE-SET,      jp,                 PASS",
    `GEOSITE,       geolocation-!cn,    ${target}`,
    "GEOSITE,       private,            CN",
    "GEOSITE,       CN,                 CN",
    "GEOIP,         private,            CN,              no-resolve",
    "GEOIP,         CN,                 CN,              no-resolve",
    `MATCH,                             ${target}`,
];

const addNameserverPolicy = (config, obj) => {
    if (config?.dns) {
        config.dns["nameserver-policy"] = { ...config.dns["nameserver-policy"], ...obj };
    }
};

const Units = {
    configBase:               { override: (config) => Object.assign(config, configBase) },
    configGeo:                { override: (config) => Object.assign(config, configGeo) },
    configExternalController: { override: (config) => Object.assign(config, configExternalController) },
    configHosts:              { override: (config) => Object.assign(config, { hosts: configHosts }) },
    configAdblockDns:         { override: (config) => config.dns.nameserver = adblockDns },
    configExitProvider:       { override: () => configExitProvider.enable = true },
    configDns: {
        "rule-providers": {
            fakeIpFilter: buildRuleSet([
                "+.m2m", "+.bogon","injections.adguard.org", "local.adguard.org","+.internal","+.sslip.io","+.nip.io", "*.home.arpa",
                "+.lan", "+.local", "*.lan", "*.localdomain", "*.example", "*.invalid", "*.localhost", "*.test", "*.local",
                "time.*.com", "time.*.gov", "time.*.edu.cn", "time.*.apple.com", "time-ios.apple.com",
                "time1.*.com", "time2.*.com", "time3.*.com", "time4.*.com", "time5.*.com", "time6.*.com", "time7.*.com",
                "ntp.*.com", "ntp1.*.com", "ntp2.*.com", "ntp3.*.com", "ntp4.*.com", "ntp5.*.com", "ntp6.*.com", "ntp7.*.com",
                "*.time.edu.cn", "*.ntp.org.cn", "+.pool.ntp.org", "*.pool.ntp.org",
                "time1.cloud.tencent.com", "+.msftconnecttest.com", "+.msftncsi.com", "localhost.ptlogin2.qq.com", "localhost.sec.qq.com",
                "+.srv.nintendo.net", "*.n.n.srv.nintendo.net", "+.cdn.nintendo.net",
                "+.stun.playstation.net", "xbox.*.*.microsoft.com", "*.*.xboxlive.com", "xbox.*.microsoft.com", "xnotify.xboxlive.com",
                "stun.*.*", "stun.*.*.*", "+.stun.*.*", "+.stun.*.*.*", "+.stun.*.*.*.*", "+.stun.*.*.*.*.*",
                "heartbeat.belkin.com", "*.linksys.com", "*.linksyssmartwifi.com", "*.router.asus.com",
                "mesu.apple.com", "swscan.apple.com", "swquery.apple.com", "swdownload.apple.com", "swcdn.apple.com", "swdist.apple.com", "+.push.apple.com",
                "proxy.golang.org", "lens.l.google.com", "stun.l.google.com", "na.b.g-tun.com", "+.nflxvideo.net",
                "*.square-enix.com", "*.finalfantasyxiv.com", "*.ffxiv.com", "*.ff14.sdo.com", "ff.dorado.sdo.com",
                "+.cmbchina.com", "+.cmbimg.com", "+.sandai.net", "+.n0808.com", "+.uu.163.com", "ps.res.netease.com",
                "+.wilds.monsterhunter.com", "+.playfabapi.com", "*.*.cloudapp.azure.com", "Mijia Cloud",
            ], { behavior: "domain" }),
        },
        override: (config) => Object.assign(config, { dns: configDns }),
    },
    configTun: {
        override: (config) => Object.assign(config, { tun: configTun }),
    },
    hoyo: {
        "rule-providers": {
            hoyo_proxy: buildRuleSet([
                "DOMAIN,dispatchosglobal.yuanshen.com", // GI
                "DOMAIN,oseurodispatch.yuanshen.com",   // GI
                "DOMAIN,osusadispatch.yuanshen.com",    // GI
                "DOMAIN,osuspider.yuanshen.com",        // GI
                "DOMAIN,autopatchhk.yuanshen.com",      // GI
                "DOMAIN,osasiadispatch.yuanshen.com",   // GI
                "AND,((DST-PORT,8999),(NETWORK,tcp))",  // GI
            ]),
            hoyo_direct: buildRuleSet([
                "DOMAIN-REGEX,[\\w-]*log-upload-os\\.hoyoverse\\.com",
                "DOMAIN,minor-api-os.hoyoverse.com",
                //"DOMAIN,asia-ugc-api.hoyoverse.com",
                //"DOMAIN,asia-ugc-upload.hoyoverse.com",
                //"DOMAIN,asia-ugc-api-static.hoyoverse.com",
                "DOMAIN-REGEX,asia-ugc[\\w-]*\\.hoyoverse\\.com", // GI UGC
                "AND,((DST-PORT,22101-22102),(NETWORK,udp))",     // GI
                "AND,((DST-PORT,23301/23801),(NETWORK,udp))",     // HSR
                "AND,((DST-PORT,20501),(NETWORK,udp))",           // ZZZ
            ]),
        },
        "rules": [
            "RULE-SET,      hoyo_direct,        HOYO_DIRECT",
            "RULE-SET,      hoyo_proxy,         HOYO_PROXY",
            "GEOSITE,       mihoyo-cn,          HOYO_DIRECT",
            "GEOSITE,       mihoyo,             HOYO_PROXY",
        ],
        "proxy-groups": [
            {
                name: "HOYO_PROXY",
                url: "https://sdk.hoyoverse.com/hk4e/announcement/index.html?detect=123",
                icon: Icon.favicon("https://hoyoverse.com"),
            },
            {
                name: "HOYO_DIRECT",
                proxies: ["DIRECT", "HOYO_PROXY"],
                url: "https://sdk.hoyoverse.com/hk4e/announcement/index.html?detect=123",
                icon: Icon.favicon("https://hoyoverse.com"),
            },
        ],
        override: (config) => addNameserverPolicy(config, { "GEOSITE:hoyoverse": directDns }),
    },
    sbcz: {
        "rule-providers": {
            sbcz: buildRuleSet([
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
               icon: Icon.gplay("rzvj2FaKgGNlLOjMPl0DVXX5uL9ash2u_2JZu_eAmYcleMrw4Hgecla1dF8XRw5rgfY"),
            },
        ],
        */
    },
    ad: {
        "rule-providers": {
            miui_ad: buildRuleSet([
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
                icon: Icon.favicon("https://www.mi.com/"),
            },
            {
                name: "AD",
                proxies: "rejectFirst",
                icon: Icon.wiki("commons/1/1c/Codex_icon_Block_red.svg"),
            },

        ],
    },
    browser: {
        "rule-providers": {
            browser: buildRuleSet([
                "PROCESS-NAME,net.quetta.browser",
                "PROCESS-NAME,org.torproject.torbrowser",
            ]),
        },
        "rules": [
            "SUB-RULE,(RULE-SET,browser),sub_browser",
        ],
        "sub-rules": {
            sub_browser: buildCommonSubRules("BROWSER"),
        },
        "proxy-groups": [
            {
                name: "BROWSER",
                "include-all": true,
                icon: Icon.wiki("commons/0/08/Internet-icon.svg"),
            },
        ],
        override: (config) => addNameserverPolicy(config, { "RULE-SET:browser": proxyDns }),
    },
    downloader: {
        "rule-providers": {
            downloader: buildRuleSet([
                "PROCESS-NAME,idm.internet.download.manager",
                "PROCESS-NAME,com.gianlu.aria2app",
                "PROCESS-NAME,aria2c",
            ]),
        },
        "rules": [
            "SUB-RULE,(RULE-SET,downloader),sub_downloader",
        ],
        "sub-rules": {
            sub_downloader: buildCommonSubRules("DOWNLOADER"),
        },
        "proxy-groups": [
            {
                name: "DOWNLOADER",
                "include-all": true,
                icon: Icon.wiki("commons/0/08/Paomedia_small-n-flat_cloud-down.svg"),
            },
        ],
        override: (config) => addNameserverPolicy(config, { "RULE-SET:downloader": proxyDns }),
    },
    ehentai: {
        "rules": [
            "DOMAIN-SUFFIX, hath.network,       HATH_NETWORK",
            "GEOSITE,       ehentai,            EHENTAI",
        ],
        "proxy-groups": [
            {
                name: "HATH_NETWORK",
                "include-all": true,
                icon: Icon.wiki("commons/b/b5/Noto_Emoji_KitKat_1f43c.svg"),
            },
            {
                name: "EHENTAI",
                "include-all": true,
                icon: Icon.wiki("commons/b/b5/Noto_Emoji_KitKat_1f43c.svg"),
            },
        ],
        override: (config) => addNameserverPolicy(config, { "GEOSITE:ehentai": proxyDns }),
    },
    github: {
        "rules": [
            "GEOSITE,       npmjs,              FINAL",
            "GEOSITE,       github,             GITHUB",
        ],
        "proxy-groups": [
            {
                name: "GITHUB",
                "include-all": true,
                icon: Icon.wiki("commons/c/c6/Font_Awesome_5_brands_github-square.svg"),
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
                icon: Icon.wiki("commons/2/25/Microsoft_icon.svg"),
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
                icon: Icon.wiki("commons/8/83/Steam_icon_logo.svg"),
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
                icon: Icon.wiki("commons/8/83/Steam_icon_logo.svg"),
            },
        ],
    },
    pixiv: {
        "rules": [
            "DOMAIN-SUFFIX, pximg.net,          PXIMG",
            "GEOSITE,       pixiv,              PIXIV",
        ],
        "proxy-groups": [
            {
                name: "PXIMG",
                icon: Icon.gplay("UADIlh0kSQkh59fl-s3RgLFILa_EY5RqA4sMOtKD-fX0z0fDVUR7_a7ysylufmhH-K-XfhSVVdpspD8K0jtu"),
            },
            {
                name: "PIXIV",
                icon: Icon.gplay("UADIlh0kSQkh59fl-s3RgLFILa_EY5RqA4sMOtKD-fX0z0fDVUR7_a7ysylufmhH-K-XfhSVVdpspD8K0jtu"),
            },
        ],
        override: (config) => addNameserverPolicy(config, { "+.pximg.net": proxyDns }),
    },
    ai: {
        "rules": [
            "GEOSITE,       category-ai-!cn,    AI",
        ],
        "proxy-groups": [
            {
                name: "AI",
                icon: Icon.gplay("lmG9HlI0awHie0cyBieWXeNjpyXvHPwDBb8MNOVIyp0P8VEh95AiBHtUZSDVR3HLe3A"),
            },
        ],
    },
    youtube: {
        "rules": [
            "DOMAIN-SUFFIX, googlevideo.com,    GOOGLE_VIDEO",
            "GEOSITE,       youTube,            YOUTUBE",
        ],
        "proxy-groups": [
            {
                name: "GOOGLE_VIDEO",
                icon: Icon.favicon("https://youtube.com"),
            },
            {
                name: "YOUTUBE",
                icon: Icon.favicon("https://youtube.com"),
            },
        ],
        override: (config) => addNameserverPolicy(config, { "+.googlevideo.com": proxyDns }),
    },
    google_fcm: {
        "rule-providers": {
            google_fcm: buildRuleSet([
                "+.mobile-gtalk.l.google.com",
                "+.mobile-gtalk4.l.google.com",
            ], { behavior: "domain" }),
        },
        "rules": [
            "RULE-SET,      google_fcm,         GOOGLE_FCM",
            "GEOSITE,       googlefcm,          GOOGLE_FCM",
        ],
        "proxy-groups": [
            {
                name: "GOOGLE_FCM",
                proxies: "directFirst",
                icon: Icon.favicon("https://firebase.google.com"),
            },
        ],
        override: (config) => {
            const hosts = {
                "mtalk.google.com": "172.253.63.188",
                "alt1-mtalk.google.com": "192.178.131.188",
                "alt2-mtalk.google.com": "209.85.144.188",
                "alt3-mtalk.google.com": "108.177.11.188",
                "alt4-mtalk.google.com": "192.178.218.188",
                "alt5-mtalk.google.com": "64.233.178.188",
                "alt6-mtalk.google.com": "192.178.213.188",
                "alt7-mtalk.google.com": "172.253.116.188",
                "alt8-mtalk.google.com": "192.178.223.188",
                "dl.google.com": "142.250.31.93",
                "dl.l.google.com": "142.250.31.136",
                "mobile-gtalk.l.google.com": [
                    "142.251.170.188",
                    "142.251.157.188",
                    "142.251.179.188",
                    //"192.178.155.188",
                    //"172.253.63.1888",
                ],
                "alt1.mobile-gtalk.l.google.com": "173.194.43.188",
                "alt3.mobile-gtalk.l.google.com": "142.250.101.188",
                "alt5.mobile-gtalk.l.google.com": "172.253.145.188",
                "alt7.mobile-gtalk.l.google.com": "172.253.135.188",
                "alt2.mobile-gtalk4.l.google.com": "172.217.78.188",
                "alt4.mobile-gtalk4.l.google.com": "192.178.231.188",
                "alt6.mobile-gtalk4.l.google.com": "172.253.145.188",
                "alt8.mobile-gtalk4.l.google.com": "142.251.96.188",
            };
            config.hosts = { ...config.hosts, ...hosts };
        },
    },
    google: {
        "rules": [
            "GEOIP,         google,             GOOGLE,          no-resolve",
            "GEOSITE,       google,             GOOGLE",
        ],
        "proxy-groups": [
            {
                name: "GOOGLE",
                icon: Icon.wiki("commons/c/c1/Google_%22G%22_logo.svg"),
            },
        ],
    },
    twitter: {
        "rules": [
            "DOMAIN-SUFFIX, twimg.com,          TWIMG",
            "GEOSITE,       twitter,            TWITTER",
            "GEOIP,         twitter,            TWITTER,         no-resolve",
        ],
        "proxy-groups": [
            {
                name: "TWIMG",
                icon: Icon.wiki("commons/6/6f/Logo_of_Twitter.svg"),
            },
            {
                name: "TWITTER",
                icon: Icon.wiki("commons/6/6f/Logo_of_Twitter.svg"),
            },
        ],
        override: (config) => addNameserverPolicy(config, { "+.twimg.com": proxyDns }),
    },
    telegram: {
        "rules": [
            "IP-CIDR,       91.108.56.200/32,   TG_RESOURCES,    no-resolve",
            "GEOIP,         telegram,           TELEGRAM,        no-resolve",
            "GEOSITE,       telegram,           TELEGRAM",
        ],
        "proxy-groups": [
            {
                name: "TG_RESOURCES",
                icon: Icon.wiki("commons/8/82/Telegram_logo.svg"),
            },
            {
                name: "TELEGRAM",
                icon: Icon.wiki("commons/8/82/Telegram_logo.svg"),
            },
        ],
    },
    discord: {
        "rules": [
            "DOMAIN,        cdn.discordapp.com, DISCORD_CDN",
            "GEOSITE,       discord,            DISCORD",
        ],
        "proxy-groups": [
            {
                name: "DISCORD_CDN",
                icon: Icon.wiki("fr/4/4f/Discord_Logo_sans_texte.svg"),
            },
            {
                name: "DISCORD",
                icon: Icon.wiki("fr/4/4f/Discord_Logo_sans_texte.svg"),
            },
        ],
        override: (config) => addNameserverPolicy(config, { "cdn.discordapp.com": proxyDns }),
    },
    apple: {
        "rules": [
            "GEOSITE,       apple,              APPLE",
            "GEOSITE,       apple-intelligence, APPLE",
        ],
        "proxy-groups": [
            {
                name: "APPLE",
                icon: Icon.wiki("commons/8/84/Apple_Computer_Logo_rainbow.svg"),
            },
        ],
    },
    non_jp: {
        "rule-providers": {
            non_jp: buildRuleSet([
                "+.hinative.com",
                "+.game8.jp",
                "+.kotobank.jp",
            ], { behavior: "domain" }),
        },
        "rules": [
            "RULE-SET,      non_jp,             NON_JP",
        ],
        "proxy-groups": [
            {
                name: "NON_JP",
                icon: Icon.wiki("commons/4/45/Wikimania2019_flower_icon.svg"),
            },
        ],
    },
    jp: {
        "rule-providers": {
            jp: buildRuleSet([
                //".jp",
                "+.syosetu.com",
            ], { behavior: "domain" }),
        },
        "rules": [
            "RULE-SET,      jp,                 JP",
            "GEOIP,         JP,                 JP,              no-resolve",
        ],
        "proxy-groups": [
            {
                name: "JP",
                icon: Icon.wiki("commons/5/54/Noto_Emoji_v2.034_1f338.svg"),
            },
        ],
    },
    non_cn: {
        "rules": [
            "GEOSITE,       geolocation-!cn,    FINAL",
        ],
    },
    cn: {
        "rules": [
            "GEOSITE,       private,            CN",
            "GEOSITE,       CN,                 CN",
            "GEOIP,         private,            CN",
            "GEOIP,         CN,                 CN",
        ],
        "proxy-groups": [
            {
                name: "CN",
                proxies: "directFirst",
                url: "https://connect.rom.miui.com/generate_204",
                icon: Icon.wiki("commons/8/8b/Noto_Emoji_v2.034_2b50.svg"),
            },
        ],
        override: (config) => addNameserverPolicy(config, { "GEOSITE:cn": directDns }),
    },
    final: {
        "rules": [
            "MATCH,                             FINAL",
        ],
        "proxy-groups": [
            {
                name: "FINAL",
                "include-all": true,
                icon: Icon.github("final"),
            },
        ],
    },
    tiktok: {
        "rules": [
            "GEOSITE,       tiktok,             TIKTOK",
            "GEOSITE,       bytedance@!cn,      TIKTOK",
        ],
        "proxy-groups": [
            {
                name: "TIKTOK",
                "include-all": true,
                icon: Icon.github("tiktok"),
            },
        ],
    },
    tailscale: {
        "rule-providers": {
            tailscale: buildRuleSet([
                "*.ts.net",
                "*.*.ts.net",
                "100.*.*.*",
            ], { behavior: "domain" }),
        },
        "rules": [
            "RULE-SET,      tailscale,          TAILSCALE",
        ],
        "proxy-groups": [
            {
                name: "TAILSCALE",
                url: "https://hello.ts.net",
                proxies: "empty",
                use: ["tailscale"],
                icon: Icon.favicon("https://tailscale.com"),
            },
        ],
        override: (config) => {
            if (!config?.dns) return; // dns not set
            config.dns["fake-ip-filter"] = config.dns["fake-ip-filter"] || [];
            const fakeIpFilter     = config.dns["fake-ip-filter"];
            const fakeIpFilterMode = config.dns?.["fake-ip-filter-mode"];
            if (fakeIpFilterMode === "rule") {
                fakeIpFilter.unshift("RULE-SET,tailscale,fake-ip");
            } else if (fakeIpFilterMode === "whitelist") {
                fakeIpFilter.unshift("RULE-SET,tailscale");
            } else {
                console.log(`################
dns: {
    "fake-ip-filter-mode": "blacklist",
    "fake-ip-filter": [
        "RULE-SET,private"
    ]
}

may cause tailscale does not work
################`);
            }
        },
        overrideFinal: (config) => Object.assign(config["proxy-providers"], {
            tailscale: {
                type: "inline",
                "health-check": {
                    enable: true,
                    url: "https://hello.ts.net",
                    "expected-status": "200/204/302",
                    timeout: 3000,
                    interval: 1800,
                },
                payload: [
                    {
                        name:       "Tailscale",
                        type:       "tailscale",
                        hostname:   "mihomo",
                        "auth-key": "tskey-blabla",
                        "state-dir": "./tailscale", // requie an unique dir name per tailscale node
                    },
                ],
            },
        }),
    },
};

const applyConfig = (config, keys = []) => {
    const units = {
        "rule-providers": {},
        rules:            [],
        "sub-rules":      {},
        "proxy-groups":   [],
        override:         [],
        overrideFinal:    [],
    };

    for (const key of keys) {
        if (!Units[key]) {
            console.warn(`[applyConfig] Unknown key: "${key}"`);
            continue;
        }
        mergeInto(units, Units[key]);
    }

    units.override.forEach(fn => fn(config));

    const base = buildProxiesGroupsProviders(config.proxies, config["proxy-providers"]);

    units["proxy-providers"] = base.prebuiltProviders;
    units["proxy-groups"] = units["proxy-groups"].map(g => {
        const group = buildGroup({ ...g, type: "select", hidden: false });
        if (!hasValue(group.proxies)) {
            group.proxies = base.prebuiltProxies.selectFirst;
        } else if (typeof group.proxies === "string") {
            group.proxies = base.prebuiltProxies[group.proxies];
        }
        return group;
    });
    units["proxy-groups"].unshift(...base.prebuiltGroups);

    for (const key of Object.keys(units)) {
        if (key !== "override" && key !== "overrideFinal") {
            config[key] = units[key];
        }
    }

    units.overrideFinal.forEach(fn => fn(config))
};

/* ========== Entry Point ========== */
const main = (config) => {
    applyConfig(config, options);
    return config;
};

const IS_NODE = typeof process !== "undefined" && !!process.versions?.node;
if (IS_NODE) module.exports = { main, applyConfig, Units };
