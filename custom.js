/*
Version: 2.0
Reference:
https://www.clashverge.dev/guide/script.html
https://github.com/yyhhyyyyyy/selfproxy/blob/cb1470d2a321051573d3ecc902a692173b9dd787/Mihomo/Extension_Script/script.js
*/

/* ========== Options ========== */
const options = [
    "configBase",
    "configGeo",
    "configExternalController",
    "configHosts",
    "configDns",
    "configTun",
    //"configAdblockDns",
    //"configExitProvider",
    "addIcons",
    //"tailscale",
    "browser",
    "downloader",
    "hoyo",
    "sbcz",
    "ehentai_media",
    "ehentai",
    "ad",
    "pixiv",
    "ai",
    "steam_cn",
    "steam",
    "github",
    "microsoft",
    "youtube_media",
    "youtube",
    "google_fcm",
    "google",
    "apple",
    "twitter_media",
    "twitter",
    "telegram_media",
    "telegram",
    "discord_meida",
    "discord",
    "tiktok",
    "non_jp",
    "jp",
    "non_cn",
    "cn",
    "final",
];

/* ========== Help Functions ========== */
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

/* ========== Build Proxy Groups ========== */
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

const buildRegex = (include, exclude = Filter.exclude) =>
    include
        ? `^(?=.*(${include}))(?!.*${exclude}).*$`
        : `^((?!.*${exclude}).)*$`;

const buildGroup = (overrides) => ({
    name:              overrides.name,
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

const relay_groups = [
    { name: "FLBK HKSG", type: "fallback", filter: buildRegex(`${Filter.hk}|${Filter.sg}`), proxies: ["AUTO HK", "AUTO SG"] },
    { name: "FLBK JP",   type: "fallback", filter: buildRegex(Filter.jp), proxies: ["AUTO JP"] },
    { name: "FLBK US",   type: "fallback", filter: buildRegex(Filter.us), proxies: ["AUTO US"] },
    { name: "LBCH HKSG", type: "load-balance", filter: buildRegex(`${Filter.hk}|${Filter.sg}`), strategy: "consistent-hashing", timeout: 500 },
    { name: "LBCH JP",   type: "load-balance", filter: buildRegex(Filter.jp), strategy: "consistent-hashing", timeout: 500 },
    { name: "LBCH US",   type: "load-balance", filter: buildRegex(Filter.us), strategy: "consistent-hashing", timeout: 500 },
    { name: "AUTO JP", type: "url-test", filter: buildRegex(Filter.jp), hidden: true },
    { name: "AUTO HK", type: "url-test", filter: buildRegex(Filter.hk), hidden: true },
    { name: "AUTO SG", type: "url-test", filter: buildRegex(Filter.sg), hidden: true },
    { name: "AUTO US", type: "url-test", filter: buildRegex(Filter.us), hidden: true },
    //{ name: "AUTO !JP",  type: "url-test", filter: buildRegex(Filter.all, `${Filter.exclude}|${Filter.jp}`) },
    //{ name: "AUTO HKSG", type: "url-test", filter: buildRegex(`${Filter.hk}|${Filter.sg}`) },
    //{ name: "AUTO ALL",  type: "url-test", filter: buildRegex(Filter.all) },
    { name: "LBRR HK",   type: "load-balance", filter: buildRegex(Filter.hk), strategy: "round-robin", timeout: 500 },
    { name: "LBRR SG",   type: "load-balance", filter: buildRegex(Filter.sg), strategy: "round-robin", timeout: 500 },
];

const exit_groups = [
    { name: "FLBK JP",   type: "fallback", filter: buildRegex(Filter.jp), proxies: ["AUTO JP"] },
    { name: "FLBK HKSG", type: "fallback", filter: buildRegex(`${Filter.hk}|${Filter.sg}`), proxies: ["AUTO HK", "AUTO SG"] },
    { name: "FLBK US",   type: "fallback", filter: buildRegex(Filter.us), proxies: ["AUTO US"] },
    //{ name: "LBCH JP (1X)", type: "load-balance", filter: buildRegex(Filter.jp), "exclude-filter":  "(?:0\.[1-9]|[2-9])[倍xX✕✖⨉]", strategy: "consistent-hashing", timeout: 500 },
    { name: "LBCH JP",   type: "load-balance", filter: buildRegex(Filter.jp), strategy: "consistent-hashing", timeout: 500 },
    { name: "LBCH HKSG", type: "load-balance", filter: buildRegex(`${Filter.hk}|${Filter.sg}`), strategy: "consistent-hashing", timeout: 500 },
    { name: "LBCH US",   type: "load-balance", filter: buildRegex(Filter.us), strategy: "consistent-hashing", timeout: 500 },
    //{ name: "AUTO JP (1X)", type: "url-test", filter: buildRegex(Filter.jp), "exclude-filter": "(?:0\.[1-9]|[2-9])[倍xX✕✖⨉]", hidden: true },
    { name: "AUTO JP", type: "url-test", filter: buildRegex(Filter.jp), hidden: true },
    { name: "AUTO HK", type: "url-test", filter: buildRegex(Filter.hk), hidden: true },
    { name: "AUTO SG", type: "url-test", filter: buildRegex(Filter.sg), hidden: true },
    { name: "AUTO US", type: "url-test", filter: buildRegex(Filter.us), hidden: true },
];

const buildGroupsWithProviders = (proxies = [], groups = [], providerKeys = [], prefix = "", selector = "") => {
    const hasProviders = hasValue(providerKeys);
    const proxyNames = hasValue(proxies) ? proxies.map(p => p.name) : [];

    const result = {};
    result.groups = groups
    .map(g => ({
        use:     providerKeys,
        ...g,
        name:    `${prefix}${g.name}`,
        proxies: g?.proxies
            ? g.proxies.map(p => `${prefix}${p}`)
            : [].concat(proxyNames.filter(n => n.match(g.filter))),
    }))
    .filter(g => (hasProviders || hasValue(g.proxies)));

    result.selectors = [
        {
            name:    `${prefix}${selector}`,
            proxies: [...result.groups.filter(g => !g?.hidden).map(g => g.name ), ...proxyNames],
            use:     providerKeys,
        },
    ].map(g => buildGroup({ ...g, type: "select", hidden: false }));

    return result;
};

const buildGroupsWithProvidersWrapper = (proxies = [], groups = [], providerKeys = [], prefix = "", selector = "") => {
    const result = buildGroupsWithProviders(proxies, groups, providerKeys, prefix, selector);
    if (hasValue(providerKeys)) {
        const tempSelectorNames = providerKeys.map(key => {
            const temp = buildGroupsWithProviders("", groups, [key], key, selector);
            mergeInto(result, temp);
            return temp.selectors[0].name;
        });
        result.selectors[0].proxies.unshift(...tempSelectorNames);
    }
    return result;
};

const excludeProviders = (providers = {}, filter = "") => {
    const resultProviders = {};
    for (const [key, value] of Object.entries(providers)) {
        if ((value?.custom ?? "").includes(filter)) continue;
        resultProviders[key] = { ...value };
    }
    return resultProviders;
};

const buildExitProviders = (providers) => {
    const exitProviders = {};
    for (const [key, value] of Object.entries(providers)) {
        const exitProviderKey = `_${key}`;
        const override = {
            ...(value?.override ?? {}),
            "dialer-proxy": "RELAY",
            "additional-prefix": exitProviderKey,
        };
        exitProviders[exitProviderKey] = {
            ...value,
            override,
        };
    }
    return exitProviders;
};

const buildProxiesGroupsProviders = (proxies = [], providers = {}) => {
    const hasProviders = hasValue(providers);

    const relayProviders = hasProviders
        ? excludeProviders(providers, "EXIT")
        : {};
    const relayProviderKeys = Object.keys(relayProviders);
    const relay = relayProviderKeys.length > 1
        ? buildGroupsWithProvidersWrapper(proxies, relay_groups, relayProviderKeys, "", "RELAY")
        : buildGroupsWithProviders       (proxies, relay_groups, relayProviderKeys, "", "RELAY")

    const exitProviders = hasProviders
        ? buildExitProviders(excludeProviders(providers, "RELAY"))
        : buildExitProviders({ "provider-exit": { type: "inline", payload: proxies } });
    const exitProviderKeys = Object.keys(exitProviders);
    const exit = exitProviderKeys.length > 1
        ? buildGroupsWithProvidersWrapper(proxies, exit_groups, exitProviderKeys, "_", "EXIT")
        : buildGroupsWithProviders       (proxies, exit_groups, exitProviderKeys, "_", "EXIT")

    const groups = config_exit_provider?.enable
        ? [...exit.selectors, ...relay.selectors, ...exit.groups, ...relay.groups]
        : [...relay.groups];
    const groupNames = groups.filter(g => !g?.hidden).map(g => g.name);

    const selectors = [
        {
            name: "SELECTOR",
            proxies: [...groupNames, "PASS", "DIRECT", "REJECT"],
        },
    ].map(g => buildGroup({ ...g, type: "select", hidden: false }));

    return {
        prebuiltProxies: {
            default: ["SELECTOR", ...groupNames, "PASS", "DIRECT", "REJECT"],
            perfer(filter) { return  this.default.find(g => g.match(filter)) || "" },
        },
        prebuiltGroups: [...groups.map(g => buildGroup(g)), ...selectors],
        prebuiltProviders: { ...relayProviders, ...(config_exit_provider?.enable ? exitProviders : {}) }
    };
};

/* ========== DNS, TUN, Rule Providers, Rules, Proxy Groups, Etc ========== */
/*
Docs:
https://wiki.metacubex.one/config/general
https://wiki.metacubex.one/config/general#api
https://wiki.metacubex.one/config/general/#geoip
https://wiki.metacubex.one/config/dns
https://wiki.metacubex.one/config/inbound/tun
https://wiki.metacubex.one/config/rule-providers
https://wiki.metacubex.one/config/rule-providers/content
https://wiki.metacubex.one/handbook/syntax/#_8
https://wiki.metacubex.one/config/rules
https://wiki.metacubex.one/config/proxy-groups
https://wiki.metacubex.one/config/proxy-groups/load-balance
https://wiki.metacubex.one/config/proxy-providers
https://wiki.metacubex.one/config/proxies/dialer-proxy
https://wiki.metacubex.one/config/proxies/tailscale
*/

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
    /*
    unit1: {
        "rule-providers": {},
        rules:            [],
        "sub-rules":      {},
        "proxy-groups":   [],
        override:         (args) => fn(args),
        overrideFinal:    (args) => fn(args),
    },
    unit2: { ... },
    unit3: { ... },
    */
};

const config_base = {
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
Units.configBase = { override: (config) => Object.assign(config, config_base) };

const cdn = "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release";
const config_geo = {
    "geox-url": {
        geoip:   `${cdn}/geoip.dat`,
        geosite: `${cdn}/geosite.dat`,
        mmdb:    `${cdn}/geoip.metadb`,
        asn:     `${cdn}/GeoLite2-ASN.mmdb`,
    },
    "geo-auto-update":     true,
    "geo-update-interval": 24,
};
Units.configGeo = { override: (config) => Object.assign(config, config_geo) };

const port   = Math.floor(Math.random() * 9999) + 10000;
const secret = Math.random().toString(36).slice(2);
const config_external_controller = {
    "external-controller": `0.0.0.0:${port}`,
    "secret":              secret,
    "external-ui":         "ui",
    "external-ui-url":     "https://github.com/Zephyruso/zashboard/releases/latest/download/dist-no-fonts.zip",
};
Units.configExternalController = { override: (config) => Object.assign(config, config_external_controller) };

const config_hosts = {
    "dns.alidns.com":        ["223.5.5.5", "223.6.6.6", "2400:3200:baba::1", "2400:3200::1"],
    "127.0.0.1.sslip.io":    "127.0.0.1",
    "127.atlas.skk.moe":     "127.0.0.1",
    "cdn.jsdelivr.net":      "cdn.jsdelivr.net.cdn.cloudflare.net",
};
Units.configHosts = { override: (config) => Object.assign(config, { hosts: config_hosts }) };

const config_exit_provider = {};
Units.configExitProvider = { override: () => config_exit_provider.enable = true };

const direct_dns    = ["https://dns.alidns.com/dns-query", "https://doh.pub/dns-query"];
const proxy_dns     = ["https://1.1.1.1/dns-query", "https://dns.google/dns-query"];
const adblock_dns   = ["https://dns.adguard-dns.com/dns-query"];
const config_dns = {
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
    nameserver:                proxy_dns,
    "proxy-server-nameserver": direct_dns,
    "direct-nameserver":       direct_dns,
};
Units.configDns = {
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
    override: (config) => Object.assign(config, { dns: config_dns }),
};

Units.configAdblockDns = { override: (config) => config.dns.nameserver = adblock_dns };

const config_tun = {
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
Units.configTun = { override: (config) => Object.assign(config, { tun: config_tun }) };

Units.hoyo = {
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
            "DOMAIN-REGEX,[\\w-]*log-upload-os\\.hoyoverse\\.com", // don't know why but this reduces ping...?
            //"DOMAIN,minor-api-os.hoyoverse.com",
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
        { name: "HOYO_PROXY", proxies: "RELAY", url: "https://sdk.hoyoverse.com/hk4e/announcement/index.html?detect=123" },
        { name: "HOYO_DIRECT", proxies: ["DIRECT", "HOYO_PROXY"], url: "https://sdk.hoyoverse.com/hk4e/announcement/index.html?detect=123" },
    ],
    override: (config) => addNameserverPolicy(config, {
        "RULE-SET:hoyo_direct": direct_dns,
        "RULE-SET:hoyo_proxy": proxy_dns,
        "GEOSITE:mihoyo-cn": direct_dns,
        "GEOSITE:mihoyo": proxy_dns,
    }),
};

Units.sbcz = {
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
    "proxy-groups": [{ name: "SBCZ", proxies: "DIRECT" }],
    */
};

Units.ad = {
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
        { name: "MIUI_AD", proxies: "REJECT" },
        { name: "AD", proxies: "REJECT" },
    ],
};
Units.browser = {
    "rule-providers": {
        browser: buildRuleSet([
            "PROCESS-NAME,net.quetta.browser",
            "PROCESS-NAME,org.torproject.torbrowser",
        ]),
    },
    "rules": [ "SUB-RULE,(RULE-SET,browser),sub_browser", ],
    "sub-rules": { sub_browser: buildCommonSubRules("BROWSER") },
    "proxy-groups": [{ name: "BROWSER", proxies: "(HKSG|HK|SG)", "include-all": true }],
    override: (config) => addNameserverPolicy(config, { "RULE-SET:browser": proxy_dns }),
};

Units.downloader = {
    "rule-providers": {
        downloader: buildRuleSet([
            "PROCESS-NAME,idm.internet.download.manager",
            "PROCESS-NAME,com.gianlu.aria2app",
            "PROCESS-NAME,aria2c",
            "PROCESS-NAME-REGEX,.*qbittorrent.*",
        ]),
    },
    "rules": [ "SUB-RULE,(RULE-SET,downloader),sub_downloader", ],
    "sub-rules": { sub_downloader: buildCommonSubRules("DOWNLOADER") },
    "proxy-groups": [{ name: "DOWNLOADER", proxies: "LBRR", "include-all": true }],
    override: (config) => addNameserverPolicy(config, { "RULE-SET:downloader": proxy_dns }),
};

Units.ehentai = {
    "rules": [ "GEOSITE,       ehentai,            EHENTAI", ],
    "proxy-groups": [{ name: "EHENTAI", "include-all": true }],
    override: (config) => addNameserverPolicy(config, { "GEOSITE:ehentai": proxy_dns }),
};

Units.ehentai_media = {
    "rules": [ "DOMAIN-SUFFIX, hath.network,       EHENTAI_MEDIA", ],
    "proxy-groups": [{ name: "EHENTAI_MEDIA", proxies: "RELAY" }],
};

Units.github = {
    "rules": [
        "GEOSITE,       npmjs,              FINAL",
        "GEOSITE,       github,             GITHUB",
    ],
    "proxy-groups": [{ name: "GITHUB", proxies: "RELAY", "include-all": true }],
};

Units.microsoft = {
    "rules": [ "GEOSITE,       microsoft,          MICROSOFT", ],
    "proxy-groups": [{ name: "MICROSOFT" }],
};

Units.steam_cn = {
    "rules": [
        "GEOSITE,       steam@cn,           STEAM_CN",
        "DOMAIN-SUFFIX, steamserver.net,    STEAM_CN",
    ],
    "proxy-groups": [{ name: "STEAM_CN", proxies: "DIRECT" }],
};

Units.steam = {
    "rules": [ "GEOSITE,       steam,              STEAM", ],
    "proxy-groups": [{ name: "STEAM" }],
};

Units.pixiv = {
    "rules": [ "GEOSITE,       pixiv,              PIXIV", ],
    "proxy-groups": [{ name: "PIXIV" }],
    override: (config) => addNameserverPolicy(config, { "+.pximg.net": proxy_dns }),
};

Units.ai = {
    "rules": [ "GEOSITE,       category-ai-!cn,    AI", ],
    "proxy-groups": [{ name: "AI" }],
};

Units.youtube = {
    "rules": [ "GEOSITE,       youTube,            YOUTUBE", ],
    "proxy-groups": [{ name: "YOUTUBE" }],
};

Units.youtube_media = {
    "rules": [ "GEOSITE,       youTube,            YOUTUBE", ],
    "proxy-groups": [{ name: "GOOGLE_VIDEO", proxies: "RELAY" }],
    override: (config) => addNameserverPolicy(config, { "+.googlevideo.com": proxy_dns }),
};

const google_fcm_hosts = {
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
Units.google_fcm = {
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
    "proxy-groups": [{ name: "GOOGLE_FCM", proxies: "DIRECT" }],
    override: (config) => { config.hosts = { ...config.hosts, ...google_fcm_hosts }; },
};

Units.google = {
    "rules": [
        "GEOSITE,       google,             GOOGLE",
        "GEOIP,         google,             GOOGLE,          no-resolve",
    ],
    "proxy-groups": [{ name: "GOOGLE" }],
};

Units.twitter = {
    "rules": [
        "GEOSITE,       twitter,            TWITTER",
        "GEOIP,         twitter,            TWITTER,         no-resolve",
    ],
    "proxy-groups": [{ name: "TWITTER" }],
    override: (config) => addNameserverPolicy(config, { "+.twimg.com": proxy_dns }),
};

Units.twitter_media = {
    "rules": [
        "DOMAIN,        video.twimg.com,    TWITTER_MEDIA",
        "DOMAIN,        pbs.twimg.com,      TWITTER_MEDIA",
    ],
    "proxy-groups": [{ name: "TWITTER_MEDIA", proxies: "RELAY" }],
}

Units.telegram = {
    "rules": [
        "GEOSITE,       telegram,           TELEGRAM",
        "GEOIP,         telegram,           TELEGRAM,        no-resolve",
    ],
    "proxy-groups": [{ name: "TELEGRAM" }],
};

Units.telegram_media = {
    "rules": [
        "IP-CIDR,       91.108.56.200/32,   TELEGRAM_MEDIA,    no-resolve",
    ],
    "proxy-groups": [{ name: "TELEGRAM_MEDIA", proxies: "RELAY" }],
};

Units.discord = {
    "rules": [ "GEOSITE,       discord,            DISCORD", ],
    "proxy-groups": [{ name: "DISCORD" }],
    override: (config) => addNameserverPolicy(config, { "cdn.discordapp.com": proxy_dns }),
};

Units.discord_meida = {
    "rules": [ "DOMAIN,        cdn.discordapp.com, DISCORD_MEDIA", ],
    "proxy-groups": [{ name: "DISCORD_MEDIA", proxies: "RELAY" }],
};

Units.apple = {
    "rules": [
        "GEOSITE,       apple,              APPLE",
        "GEOSITE,       apple-intelligence, APPLE",
    ],
    "proxy-groups": [{ name: "APPLE" }],
};

Units.non_jp = {
    "rule-providers": {
        non_jp: buildRuleSet([
            "+.hinative.com",
            "+.game8.jp",
            "+.kotobank.jp",
        ], { behavior: "domain" }),
    },
    "rules": [ "RULE-SET,      non_jp,             NON_JP", ],
    "proxy-groups": [{ name: "NON_JP", proxies: "RELAY" }],
};

Units.jp = {
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
    "proxy-groups": [{ name: "JP" }],
};

Units.non_cn = {
    "rules": [ "GEOSITE,       geolocation-!cn,    FINAL", ],
};

Units.cn = {
    "rules": [
        "GEOSITE,       private,            CN",
        "GEOSITE,       CN,                 CN",
        "GEOIP,         private,            CN",
        "GEOIP,         CN,                 CN",
    ],
    "proxy-groups": [{ name: "CN", proxies: "DIRECT", url: "https://connect.rom.miui.com/generate_204" }],
    override: (config) => addNameserverPolicy(config, { "GEOSITE:cn": direct_dns }),
};

Units.final = {
    "rules": [ "MATCH,                             FINAL", ],
    "proxy-groups": [{ name: "FINAL" }],
};

Units.tiktok = {
    "rules": [
        "GEOSITE,       tiktok,             TIKTOK",
        "GEOSITE,       bytedance@!cn,      TIKTOK",
    ],
    "proxy-groups": [{ name: "TIKTOK" }],
};

const tailscale_proxy_providers = {
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
    /***
        {
            name:       "Tailscale as Exit Node",
            type:       "tailscale",
            hostname:   "mihomo",
            "auth-key": "tskey-blabla2",
            "exit-node": "100.110.120.130",
            "exit-node-allow-lan-access": true,
            "dialer-proxy": "RELAY",
            "state-dir": "./tailscale-as-exit-node", // requie an unique dir name per tailscale node
        },
    */
    ],
};
const tailscale_override_tips = `################
    dns: {
        "fake-ip-filter-mode": "blacklist",
        "fake-ip-filter": [
            "GEOSITE,private"
        ]
    }
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    May prevent tailscale from connecting to other tailscale nodes
################`;
const tailscale_override = (config) => {
    if (!config?.dns) return; // dns not set
    config.dns["fake-ip-filter"] = config.dns["fake-ip-filter"] || [];
    const fakeIpFilter     = config.dns["fake-ip-filter"];
    const fakeIpFilterMode = config.dns?.["fake-ip-filter-mode"];
    if (fakeIpFilterMode === "rule") {
        fakeIpFilter.unshift("RULE-SET,tailscale,fake-ip");
    } else if (fakeIpFilterMode === "whitelist") {
        fakeIpFilter.unshift("RULE-SET,tailscale");
    } else {
        console.log(tailscale_override_tips);
    }
};
Units.tailscale = {
    "rule-providers": {
        tailscale: buildRuleSet([
            "*.ts.net",
            "*.*.ts.net",
        ], { behavior: "domain" }),
    },
    "rules": [
        // https://tailscale.com/docs/reference/ip-pool
        "IP-CIDR,       100.64.0.0/10,      TAILSCALE,       no-resolve",
        "RULE-SET,      tailscale,          TAILSCALE",
    ],
    "proxy-groups": [{ name: "TAILSCALE", url: "https://hello.ts.net", proxies: [], use: ["tailscale"] }],
    override: (config) => tailscale_override(config),
    overrideFinal: (config) => Object.assign(config["proxy-providers"], { tailscale: tailscale_proxy_providers }),
};

const Icons = {
    github:  (name) => `https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/icon/color/${name}.png`,
    favicon: (url)  => `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=256`,
    get(name) { return this.ios?.[name] || this.old?.[name] },
};
Icons.old = {
    _EXIT: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Send_icon.svg",
    RELAY: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Noto_Emoji_v2.034_1f517.svg",
    SELECTOR: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Noto_Emoji_v2.034_1f3af.svg",
    TAILSCALE: Icons.favicon("https://tailscale.com"),
    BROWSER: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Noto_Emoji_v2.034_1f537.svg",
    DOWNLOADER: "https://upload.wikimedia.org/wikipedia/commons/0/08/Paomedia_small-n-flat_cloud-down.svg",
    HOYO_PROXY: Icons.favicon("https://hoyoverse.com"),
    HOYO_DIRECT: Icons.favicon("https://hoyoverse.com"),
    SBCZ: Icons.favicon("https://snowbreak.amazingseasun.com"),
    EHENTAI: Icons.favicon("https://e-hentai.org"),
    EHENTAI_MEDIA: Icons.favicon("https://e-hentai.org"),
    AD: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Codex_icon_Block_red.svg",
    MIUI_AD: Icons.favicon("https://www.mi.com/"),
    PIXIV: Icons.favicon("https://www.pixiv.net"),
    AI: "https://play-lh.googleusercontent.com/lmG9HlI0awHie0cyBieWXeNjpyXvHPwDBb8MNOVIyp0P8VEh95AiBHtUZSDVR3HLe3A",
    STEAM: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
    STEAM_CN: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
    GITHUB: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Font_Awesome_5_brands_github-square.svg",
    MICROSOFT: "https://upload.wikimedia.org/wikipedia/commons/2/25/Microsoft_icon.svg",
    YOUTUBE: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
    GOOGLE_VIDEO: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
    GOOGLE: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
    GOOGLE_FCM: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
    APPLE: "https://upload.wikimedia.org/wikipedia/commons/8/84/Apple_Computer_Logo_rainbow.svg",
    TWITTER: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg",
    TWITTER_MEDIA: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg",
    TELEGRAM: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg",
    TELEGRAM_MEDIA: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg",
    DISCORD: "https://upload.wikimedia.org/wikipedia/fr/4/4f/Discord_Logo_sans_texte.svg",
    DISCORD_MEDIA: "https://upload.wikimedia.org/wikipedia/fr/4/4f/Discord_Logo_sans_texte.svg",
    TIKTOK: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Tiktok_icon.svg",
    NON_JP: "https://upload.wikimedia.org/wikipedia/commons/4/45/Wikimania2019_flower_icon.svg",
    JP: "https://upload.wikimedia.org/wikipedia/commons/5/54/Noto_Emoji_v2.034_1f338.svg",
    CN: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Noto_Emoji_v2.034_2b50.svg",
    FINAL: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Emoji_u1f52f.svg",
};
Icons.ios = {
    //EXIT: "",
    //RELAY: "",
    //SELECTOR: "",
    TAILSCALE: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/00/3e/bf/003ebf6e-1348-c7e2-ce3a-3d8109f67d51/Placeholder.mill/400x400bb-75.webp",
    BROWSER: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/48/45/ca/4845cac1-dd89-fc30-3c08-652f2aed934c/Placeholder.mill/400x400bb-75.webp",
    DOWNLOADER: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/d9/92/7d/d9927d0e-9eba-0922-dbb6-d0b8eaf82aa4/Placeholder.mill/400x400ia-75.webp",
    //HOYO_PROXY: "",
    //HOYO_DIRECT: "",
    SBCZ: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/10/5f/0e/105f0e8f-7942-0fde-c2e0-79345827aa58/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/400x400ia-75.webp",
    //EHENTAI: "",
    //EHENTAI_MEDIA: "",
    AD: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/6a/81/8f/6a818fb6-1521-2a89-60cd-07239c6230ad/Placeholder.mill/400x400ia-75.webp",
    MIUI_AD: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/36/83/3b/36833b79-3066-63e4-ea2b-797b09843d18/Placeholder.mill/400x400ia-75.webp",
    PIXIV: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/7e/6e/d7/7e6ed73e-6d98-574e-56ff-91d9b46615eb/Placeholder.mill/400x400ia-75.webp",
    AI: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/85/eb/b3/85ebb3df-5d4c-7216-ea4f-919fe9987cad/Placeholder.mill/400x400bb-75.webp",
    STEAM: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/7b/be/a9/7bbea9f7-8f0a-19e4-8c04-0cd7d8aab7ff/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/400x400ia-75.webp",
    STEAM_CN: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/7b/be/a9/7bbea9f7-8f0a-19e4-8c04-0cd7d8aab7ff/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/400x400ia-75.webp",
    GITHUB: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/d0/5f/bb/d05fbb11-a1e2-795d-af2f-5e48b13949bb/Placeholder.mill/400x400ia-75.webp",
    MICROSOFT: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/a3/b2/f9/a3b2f994-953b-3d78-52ec-392a4ada4114/Placeholder.mill/400x400ia-75.webp",
    YOUTUBE: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/a6/09/6b/a6096b82-e4ed-4213-e7d9-1a7882b6146e/Placeholder.mill/400x400ia-75.webp",
    GOOGLE_VIDEO: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/a6/09/6b/a6096b82-e4ed-4213-e7d9-1a7882b6146e/Placeholder.mill/400x400ia-75.webp",
    GOOGLE: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/77/05/af/7705af6e-4b3e-f2d9-c68f-779f0d7c1a86/Placeholder.mill/400x400ia-75.webp",
    GOOGLE_FCM: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/77/05/af/7705af6e-4b3e-f2d9-c68f-779f0d7c1a86/Placeholder.mill/400x400ia-75.webp",
    //APPLE: "",
    TWITTER: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/31/4e/98/314e9863-7df7-236f-4159-0fb7f28e2b23/Placeholder.mill/400x400ia-75.webp",
    TWITTER_MEDIA: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/31/4e/98/314e9863-7df7-236f-4159-0fb7f28e2b23/Placeholder.mill/400x400ia-75.webp",
    TELEGRAM: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/d2/0c/9b/d20c9b91-830b-cc6c-aacd-8ab622116e39/Placeholder.mill/400x400ia-75.webp",
    TELEGRAM_MEDIA: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/d2/0c/9b/d20c9b91-830b-cc6c-aacd-8ab622116e39/Placeholder.mill/400x400ia-75.webp",
    DISCORD: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/db/29/bc/db29bc45-4500-e891-cd9e-5ac441798ea0/Placeholder.mill/400x400bb-75.webp",
    DISCORD_MEDIA: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/db/29/bc/db29bc45-4500-e891-cd9e-5ac441798ea0/Placeholder.mill/400x400bb-75.webp",
    TIKTOK: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/19/43/1b/19431ba4-7ac5-7e31-e6f3-ea5dcd4e419c/Placeholder.mill/400x400ia-75.webp",
    //NON_JP: "",
    //JP: "",
    //CN: "",
    //FINAL: "",
};
Units.addIcons = { overrideFinal: (config) => config["proxy-groups"].forEach(g => g.icon = g.icon ?? Icons.get(g.name)) };


const applyConfig = (config, options = []) => {
    const merged = {
        "rule-providers": {/* unit1["rule-providers"], unit2["rule-providers"]... */},
        rules:            [/* unit1.rules, unit2.rules...*/],
        "sub-rules":      {},
        "proxy-groups":   [],
        override:         [],
        overrideFinal:    [],
    };

    for (const option of options) {
        if (Units[option]) {
            mergeInto(merged, Units[option]);
        } else {
            console.warn(`[applyConfig] Unknown option: "${option}"`);
        }
    }

    merged.override.forEach(fn => fn(config));

    const base = buildProxiesGroupsProviders(config.proxies, config["proxy-providers"]);
    merged["proxy-providers"] = base.prebuiltProviders;
    merged["proxy-groups"] = merged["proxy-groups"].map(g => {
        const group = buildGroup({ ...g, type: "select", hidden: false });
        if (!Array.isArray(group.proxies)) {
            group["default-selected"] = base.prebuiltProxies.perfer(group.proxies);
            group.proxies = base.prebuiltProxies.default;
        }
        return group;
    });
    merged["proxy-groups"].unshift(...base.prebuiltGroups);

    Object.keys(merged).forEach(key => { if (!key.includes("override")) config[key] = merged[key] });
    merged.overrideFinal.forEach(fn => fn(config))
};

/* ========== Entry Point ========== */
const main = (config) => {
    applyConfig(config, options);
    return config;
};

const IS_NODE = typeof process !== "undefined" && !!process.versions?.node;
if (IS_NODE) module.exports = { main, applyConfig, Units };
