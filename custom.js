// Version: 2.0
// Reference:
//     https://www.clashverge.dev/guide/script.html
//     https://github.com/yyhhyyyyyy/selfproxy/blob/cb1470d2a321051573d3ecc902a692173b9dd787/Mihomo/Extension_Script/script.js

/* ========== Base-Options Configuration ========== */

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

const _cdn = "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release";
const configGeo = {
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
const configExternalController = {
    "external-controller": `0.0.0.0:${_port}`,
    "secret":              _secret,
    "external-ui":         "ui",
    "external-ui-url":     "https://github.com/Zephyruso/zashboard/releases/latest/download/dist-no-fonts.zip",
};

const configHosts = {
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
const configDns = {
    enable:                true,
    "prefer-h3":           true,
    ipv6:                  false,
    "default-nameserver":  _directDns,
    "enhanced-mode":       "fake-ip",
    "fake-ip-range":       "198.18.0.1/16",
    "fake-ip-filter-mode": "rule",
    "fake-ip-filter": [
        "RULE-SET, fakeIpFilter,       real-ip",
        "GEOSITE,  private,            real-ip",
        "GEOSITE,  cn,                 real-ip",
        "GEOSITE,  connectivity-check, real-ip",
        "GEOSITE,  category-ntp,       real-ip",
        "MATCH,                        fake-ip",
    ],
    "nameserver-policy": {
        "GEOSITE:private":     _directDns,
        "GEOSITE:cn":          _directDns,
        "GEOSITE:hoyoverse":   _directDns,
        "+.twimg.com":         _proxyDns,
        "+.pximg.net":         _proxyDns,
        "cdn.discordapp.com":  _proxyDns,
    },
    nameserver:                _proxyDns,
    "proxy-server-nameserver": _directDns,
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
    url:               "https://cp.cloudflare.com",
    "expected-status": "200/204/302",
    timeout:           5000,
    interval:          1800,
    "exclude-filter":  "0.[0-9]",
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
        { name: "AUTO HKSG", type: "url-test",     filter: buildRegex(["hk", "sg"].map(e => Filter[e]).join("|")) },
        { name: "AUTO HK",   type: "url-test",     filter: buildRegex(Filter.hk) },
        { name: "AUTO JP",   type: "url-test",     filter: buildRegex(Filter.jp) },
        { name: "AUTO SG",   type: "url-test",     filter: buildRegex(Filter.sg) },
        { name: "AUTO AU",   type: "url-test",     filter: buildRegex(Filter.au) },
        { name: "AUTO US",   type: "url-test",     filter: buildRegex(Filter.us) },
        { name: "AUTO !JP",  type: "url-test",     filter: buildRegex(Filter.all, `${Filter.exclude}|${Filter.jp}`) },
        { name: "AUTO ALL",  type: "url-test",     filter: buildRegex(Filter.all) },
        { name: "LB HK",     type: "load-balance", filter: buildRegex(Filter.hk), strategy: "round-robin" },
        { name: "LB SG",     type: "load-balance", filter: buildRegex(Filter.sg), strategy: "round-robin" },
    ].map(e => buildGroup({
        ...e,
        name:    `${prefix}${e.name}`,
        proxies: proxyNames.filter(n => n.match(e.filter)),
        use:     providerKeys,
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
        { name: "AUTO JP",  type: "url-test", filter: buildRegex(Filter.jp) },
        { name: "AUTO !JP", type: "url-test", filter: buildRegex(Filter.all, `${Filter.exclude}|${Filter.jp}`) },
    ].map(e => buildGroup({
        ...e,
        name:    `→${prefix}${e.name}`,
        proxies: proxyNames.filter(n => n.match(e.filter)),
        use:     exitProviderKeys,
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
    `GEOSITE,       geolocation-!cn,    ${target}`,
    "GEOSITE,       private,            CN",
    "GEOSITE,       CN,                 CN",
    "GEOIP,         private,            CN,              no-resolve",
    "GEOIP,         CN,                 CN,              no-resolve",
    `MATCH,                             ${target}`,
];

const Units = {
    configBase:               { override: (config) => Object.assign(config, configBase) },
    configGeo:                { override: (config) => Object.assign(config, configGeo) },
    configExternalController: { override: (config) => Object.assign(config, configExternalController) },
    configHosts:              { override: (config) => Object.assign(config, { hosts: configHosts }) },
    configAdblockDns:         { override: (config) => config.dns.nameserver = _adblockDns },
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
    hoyo: {
        "rule-providers": {
            hoyo_gi_cn: buildRuleSet([
                "DOMAIN,dispatchosglobal.yuanshen.com",
                "DOMAIN,oseurodispatch.yuanshen.com",
                "DOMAIN,osusadispatch.yuanshen.com",
                "DOMAIN,osuspider.yuanshen.com",
            ]),
            hoyo_etc: buildRuleSet([
                "DOMAIN,minor-api-os.hoyoverse.com",
                //"DOMAIN,asia-ugc-api.hoyoverse.com",
                //"DOMAIN,asia-ugc-upload.hoyoverse.com",
                //"DOMAIN,asia-ugc-api-static.hoyoverse.com",
                "DOMAIN-REGEX,asia-ugc[\\w-]*\\.hoyoverse\\.com",      // GI UGC
                "DOMAIN-REGEX,[\\w-]*log-upload-os\\.hoyoverse\\.com",
            ]),
            hoyo_proxy: buildRuleSet([
                "DOMAIN-SUFFIX,hoyoverse.com",
                "DOMAIN-SUFFIX,hoyolab.com",
                "DOMAIN,autopatchhk.yuanshen.com",     // GI
                "DOMAIN,osasiadispatch.yuanshen.com",  // GI
                "AND,((DST-PORT,8999),(NETWORK,tcp))", // GI
            ]),
            hoyo_direct: buildRuleSet([
                "DOMAIN-SUFFIX,yuanshen.com",
                "DOMAIN-SUFFIX,mihoyo.com",
                "AND,((DST-PORT,22101-22102),(NETWORK,udp))", // GI
                "AND,((DST-PORT,23301/23801),(NETWORK,udp))", // HSR
                "AND,((DST-PORT,20501),(NETWORK,udp))",       // ZZZ
            ]),
            hoyo_final: buildRuleSet([
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
                icon: Icon.favicon("https://hoyoverse.com"),
            },
            {
                name: "HOYO_DIRECT",
                proxies: ["DIRECT", "HOYO_PROXY"],
                url: "https://sdk.hoyoverse.com/hk4e/announcement/index.html?detect=123",
                icon: Icon.favicon("https://hoyoverse.com"),
            },
        ],
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
    },
    downloader: {
        "rule-providers": {
            downloader: buildRuleSet([
                "PROCESS-NAME,idm.internet.download.manager",
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
    },
    ehentai: {
        "rules": [
            "DOMAIN-SUFFIX, hath.network,       HENTAI@HOME",
            "GEOSITE,       ehentai,            EHENTAI",
        ],
        "proxy-groups": [
            {
                name: "HENTAI@HOME",
                "include-all": true,
                icon: Icon.wiki("commons/b/b5/Noto_Emoji_KitKat_1f43c.svg"),
            },
            {
                name: "EHENTAI",
                "include-all": true,
                icon: Icon.wiki("commons/b/b5/Noto_Emoji_KitKat_1f43c.svg"),
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
            "GEOSITE,       pixiv,              PIXIV",
        ],
        "proxy-groups": [
            {
                name: "PIXIV",
                icon: Icon.gplay("UADIlh0kSQkh59fl-s3RgLFILa_EY5RqA4sMOtKD-fX0z0fDVUR7_a7ysylufmhH-K-XfhSVVdpspD8K0jtu"),
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
                icon: Icon.gplay("lmG9HlI0awHie0cyBieWXeNjpyXvHPwDBb8MNOVIyp0P8VEh95AiBHtUZSDVR3HLe3A"),
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
                icon: Icon.favicon("https://youtube.com"),
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
                icon: Icon.favicon("https://firebase.google.com"),
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
                icon: Icon.wiki("commons/c/c1/Google_%22G%22_logo.svg"),
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
                icon: Icon.wiki("commons/6/6f/Logo_of_Twitter.svg"),
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
                icon: Icon.wiki("commons/8/82/Telegram_logo.svg"),
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
                icon: Icon.wiki("fr/4/4f/Discord_Logo_sans_texte.svg"),
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
                icon: Icon.wiki("commons/8/84/Apple_Computer_Logo_rainbow.svg"),
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
                icon: Icon.wiki("commons/4/45/Wikimania2019_flower_icon.svg"),
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
                url: "http://connect.rom.miui.com/generate_204",
                icon: Icon.wiki("commons/8/8b/Noto_Emoji_v2.034_2b50.svg"),
            },
        ],
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
            const fakeIpFilter     = config?.dns?.["fake-ip-filter"];
            if (!Array.isArray(fakeIpFilter)) return; // dns absent or fake-ip-filter not set
            const fakeIpFilterMode = config?.dns?.["fake-ip-filter-mode"];
            if (fakeIpFilterMode === "rule") {
                fakeIpFilter.unshift("RULE-SET,tailscale,fake-ip");
            } else if (fakeIpFilterMode === "blacklist") {
                fakeIpFilter.unshift("RULE-SET,tailscale");
            }
        },
        overrideLater: (config) => Object.assign(config["proxy-providers"], {
            tailscale: {
                type: "inline",
                "health-check": {
                    enable: true,
                    url: "https://hello.ts.net",
                    interval: 1800,
                    timeout: 3000,
                    "expected-status": "200/204/302",
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
        overrideLater:    [],
    };

    for (const key of keys) {
        const unit = Units[key];
        if (!unit) {
            console.warn(`[applyConfig] Unknown key: "${key}"`);
            continue;
        }
        mergeInto(units, unit);
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
        if (key !== "override" && key !== "overrideLater") {
            config[key] = units[key];
        }
    }

    units.overrideLater.forEach(fn => fn(config))
};

/* ========== Entry Point ========== */
const main = (config) => {
    applyConfig(config, [
        "configBase",
        "configGeo",
        "configExternalController",
        "configHosts",
        "configDns",
        //"configAdblockDns",
        //"configExitProvider",
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
if (IS_NODE) module.exports = { main, applyConfig, Units };
