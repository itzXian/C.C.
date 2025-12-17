// 以下代码参照
// https://www.clashverge.dev/guide/script.html
function main(config) {
    if (!config.proxies) return config;
    overwriteBasicOptions(config);
    overwriteDns(config);
    overwriteHosts(config);
    overwriteTunnel(config);
    overwriteFakeIpFilter(config);
    //removeNodeByName(config, /.*(剩余|到期|主页|官网|游戏|关注|网站|地址|有效|网址|禁止|邮箱|发布|客服|订阅|节点|问题|联系).*/g);
    overwriteProxyGroups(config);
    config["rules"] = customRules;
    config["rule-providers"] = ruleProviders;
    return config;
}

const ruleProviderBase = {
    "type": "http",
    "format": "text",
    "interval": "3600",
};
const ruleProviderBaseClassical = {
    ...ruleProviderBase,
    "behavior": "classical",
};
const ruleProviderBaseDomain = {
    ...ruleProviderBase,
    "behavior": "domain",
};
const ruleProviderBaseIpcodr = {
    ...ruleProviderBase,
    "behavior": "ipcidr",
};
const ruleProviderBaseYaml = {
    "type": "http",
    "format": "yaml",
    "interval": "3600",
};
const ruleProviderBaseClassicalYaml = {
    ...ruleProviderBaseYaml,
    "behavior": "classical",
};
const ruleProviderBaseDomainYaml = {
    ...ruleProviderBaseYaml,
    "behavior": "domain",
};
const ruleProviderBaseIpcodrYaml = {
    ...ruleProviderBaseYaml,
    "behavior": "ipcidr",
};

const ruleProviders = {
// HOYO
  Hoyo_CN_Proxy: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/Hoyo_CN_Proxy.list",
    "path": "./Hoyo_CN_Proxy.list"
  },
  Hoyo_Proxy: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/Hoyo_Proxy.list",
    "path": "./Hoyo_Proxy.list"
  },
  Hoyo_Bypass: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/Hoyo_Bypass.list",
    "path": "./Hoyo_Bypass.list"
  },
// BLOCK
  MIUI_Bloatware: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/MIUI_Bloatware.list",
    "path": "./MIUI_Bloatware.yaml"
  },
  Block: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/Block.list",
    "path": "./Block.list"
  },
  BanAD: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanAD.list",
    "path": "./BanAD.list"
  },
  BanEasyList: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyList.list",
    "path": "./BanEasyList.list"
  },
  BanEasyListChina: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyListChina.list",
    "path": "./BanEasyListChina.list"
  },
  BanEasyPrivacy: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyPrivacy.list",
    "path": "./BanEasyPrivacy.list"
  },
  BanProgramAD: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanProgramAD.list",
    "path": "./BanProgramAD.list"
  },
// BYPASS
  Bypass: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/Bypass.list",
    "path": "./Bypass.list"
  },
  ChinaMax: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/ChinaMax/ChinaMax.list",
    "path": "./ChinaMax.list"
  },
  LocalAreaNetwork: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/refs/heads/master/Clash/LocalAreaNetwork.list",
    "path": "./LocalAreaNetwork.list"
  },
// CUSTOM
  Pixiv: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Pixiv/Pixiv.list",
    "path": "./Pixiv.list"
  },
// CUSTOM_JP
  GitHub: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/GitHub/GitHub.list",
    "path": "./GitHub.list"
  },
  JP: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/JP.list",
    "path": "./JP.list"
  },
  AI: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/refs/heads/master/Clash/Ruleset/AI.list",
    "path": "./AI.list"
  },
  GoogleCNProxyIP: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/refs/heads/master/Clash/Ruleset/GoogleCNProxyIP.list",
    "path": "./GoogleCNProxyIP.list"
  },
  Google: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Google/Google.list",
    "path": "./Google.list"
  },
  YouTube: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/YouTube/YouTube.list",
    "path": "./YouTube.list"
  },
  Twitter: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Twitter/Twitter.list",
    "path": "./Twitter.list"
  },
  Telegram: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Telegram/Telegram.list",
    "path": "./Telegram.list"
  },
  Discord: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Discord/Discord.list",
    "path": "./Discord.list"
  },
// PROXY
  Microsoft: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/refs/heads/master/Clash/Ruleset/Microsoft.list",
    "path": "./Microsoft.list"
  },
  Apple: {
    ...ruleProviderBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/refs/heads/master/Clash/Ruleset/Apple.list",
    "path": "./Apple.list"
  },
}

const customRules = [
// HOYO
  "RULE-SET,Hoyo_CN_Proxy,HOYO_CN_PROXY",
  "RULE-SET,Hoyo_Bypass,HOYO_BYPASS",
  "RULE-SET,Hoyo_Proxy,HOYO_PROXY",
// BLOCK
  "RULE-SET,MIUI_Bloatware,MIUI_BLOATWARE",
  "RULE-SET,Block,AD_BLOCK",
  "RULE-SET,BanAD,AD_BLOCK",
  "RULE-SET,BanEasyList,AD_BLOCK",
  "RULE-SET,BanEasyListChina,AD_BLOCK",
  "RULE-SET,BanEasyPrivacy,AD_BLOCK",
  "RULE-SET,BanProgramAD,AD_BLOCK",
// CUSTOM
  // Use port 443 instead
  //"AND,((DOMAIN-SUFFIX,github.com),(DST-PORT,22),(NETWORK,tcp)),GITHUB_SSH",
  "RULE-SET,Pixiv,PIXIV",
  "DOMAIN-SUFFIX,pixivision.net,PIXIV",
  "DOMAIN-SUFFIX,ads-pixiv.net,AD_BLOCK",
// CUSTOM_JP
  "RULE-SET,GitHub,GITHUB",
  "DOMAIN-SUFFIX,hinative.com,JP_DOMAIN",
  "RULE-SET,JP,JP_DOMAIN",
  "RULE-SET,AI,AI",
  "RULE-SET,Google,GOOGLE",
  "RULE-SET,YouTube,YOUTUBE",
  "RULE-SET,Twitter,TWITTER",
  "RULE-SET,Telegram,TELEGRAM",
  "RULE-SET,Discord,DISCORD",
// PROXY
  "RULE-SET,Microsoft,MS",
  "RULE-SET,Apple,APPLE",
// PROXY(BEFORE BYPASS)
  "DOMAIN,services.googleapis.cn,GOOGLE_CN_PROXY",
  "RULE-SET,GoogleCNProxyIP,GOOGLE_CN_PROXY",
// BYPASS
  "RULE-SET,Bypass,BYPASS",
  "RULE-SET,LocalAreaNetwork,BYPASS",
  "RULE-SET,ChinaMax,BYPASS",
  //"GEOIP,CN,BYPASS",
// CUSTOM_JP(BEFORE FINAL)
  // GEOIP cause slow connection
  //"GEOIP,JP,JP_DOMAIN",
// FINAL
  "MATCH,FINAL",
];

// 以下代码源自
// https://github.com/yyhhyyyyyy/selfproxy/blob/cb1470d2a321051573d3ecc902a692173b9dd787/Mihomo/Extension_Script/script.js#L499

// 覆写Basic Options
function overwriteBasicOptions(config) {
    const otherOptions = {
        "mixed-port": 7890,
        "allow-lan": true,
        mode: "rule",
        "log-level": "warning",
        ipv6: false,
        "find-process-mode": "strict",
        profile: {
            "store-selected": true,
            "store-fake-ip": true,
        },
        "unified-delay": true,
        "tcp-concurrent": true,
        "global-client-fingerprint": "chrome",
        sniffer: {
            enable: true,
            sniff: {
                HTTP: {
                    ports: [80, "8080-8880"],
                    "override-destination": true,
                },
                TLS: {
                    ports: [443, 8443],
                },
                QUIC: {
                    ports: [443, 8443],
                },
            },
            "skip-domain": ["Mijia Cloud", "+.push.apple.com"]
        },
    };
    Object.keys(otherOptions).forEach((key) => {
        config[key] = otherOptions[key];
    });
}
// 覆写DNS
function overwriteDns(params) {
    const dnsList = [
        "https://223.5.5.5/dns-query",
        "https://doh.pub/dns-query",
    ];

    const proxyDnsList = [
        "https://223.5.5.5/dns-query",
        "https://doh.pub/dns-query",
    ];

    const dnsOptions = {
        enable: true,
        "prefer-h3": true,
        ipv6: false,
        "enhanced-mode": "fake-ip",
        "fake-ip-range": "198.18.0.1/16",
        nameserver: dnsList,
        "proxy-server-nameserver": proxyDnsList,
    };
    params.dns = { ...dnsOptions };
}

// 覆写DNS.Fake IP Filter
function overwriteFakeIpFilter (params) {
    const fakeIpFilter = [
        "+.m2m",
        "injections.adguard.org",
        "local.adguard.org",
        "+.bogon",
        "+.lan",
        "+.local",
        "+.internal",
        "+.localdomain",
        "home.arpa",
        "127.0.0.1.sslip.io",
        "127.atlas.skk.moe",
        "dns.msftncsi.com",
        "*.srv.nintendo.net",
        "*.stun.playstation.net",
        "xbox.*.microsoft.com",
        "*.xboxlive.com",
        "*.turn.twilio.com",
        "*.stun.twilio.com",
        "stun.syncthing.net",
        "stun.*",
        "127.*.*.*.sslip.io",
        "127-*-*-*.sslip.io",
        "*.127.*.*.*.sslip.io",
        "*-127-*-*-*.sslip.io",
        "127.*.*.*.nip.io",
        "127-*-*-*.nip.io",
        "*.127.*.*.*.nip.io",
        "*-127-*-*-*.nip.io"
    ];
    params.dns["fake-ip-filter"] = fakeIpFilter;
}

// 覆写hosts
function overwriteHosts (params) {
    const hosts = {
        "dns.alidns.com": ['223.5.5.5', '223.6.6.6', '2400:3200:baba::1', '2400:3200::1'],
        "127.0.0.1.sslip.io": "127.0.0.1",
        "127.atlas.skk.moe": "127.0.0.1",
        "cdn.jsdelivr.net": "cdn.jsdelivr.net.cdn.cloudflare.net"
    };
    params.hosts = hosts;
}

// 覆写Tunnel
function overwriteTunnel(params) {
    const tunnelOptions = {
        enable: true,
        stack: "system",
        device: "tun0",
        "dns-hijack": ["any:53", "tcp://any:53"],
        "auto-route": true,
        "auto-detect-interface": true,
        "strict-route": true,
        // 根据自己环境来看要排除哪些网段
        "route-exclude-address": [],
    };
    params.tun = { ...tunnelOptions };
}
// 覆盖代理组
function overwriteProxyGroups(config) {
    // 所有代理
    const allProxies = config["proxies"].map((e) => e.name);
    // 公共的正则片段
    const excludeTerms = "剩余|到期|主页|官网|游戏|关注|网站|地址|有效|网址|禁止|邮箱|发布|客服|订阅|节点|问题|联系";
    // 包含条件：各个国家或地区的关键词
    const includeTerms = {
        HK: "(香港|HK|Hong|🇭🇰)",
        TW: "(台湾|TW|Taiwan|Wan|🇹🇼|🇨🇳)",
        SG: "(新加坡|狮城|SG|Singapore|🇸🇬)",
        JP: "(日本|JP|Japan|🇯🇵)",
        KR: "(韩国|韓|KR|Korea|🇰🇷)",
        US: "(美国|US|United States|America|🇺🇸)",
        UK: "(英国|UK|United Kingdom|🇬🇧)",
        FR: "(法国|FR|France|🇫🇷)",
        DE: "(德国|DE|Germany|🇩🇪)"
    };
    // 合并所有国家关键词，供"其它"条件使用
    const allCountryTerms = Object.values(includeTerms).join("|");
     // 自动代理组正则表达式配置
    const autoProxyGroupRegexs = [
/*
        { name: "HK-AUTO", regex: new RegExp(`^(?=.*${includeTerms.HK})(?!.*${excludeTerms}).*$`, "i") },
        { name: "TW-AUTO", regex: new RegExp(`^(?=.*${includeTerms.TW})(?!.*${excludeTerms}).*$`, "i") },
        { name: "SG-AUTO", regex: new RegExp(`^(?=.*${includeTerms.SG})(?!.*${excludeTerms}).*$`, "i") },
        { name: "KR-AUTO", regex: new RegExp(`^(?=.*${includeTerms.KR})(?!.*${excludeTerms}).*$`, "i") },
        { name: "US-AUTO", regex: new RegExp(`^(?=.*${includeTerms.US})(?!.*${excludeTerms}).*$`, "i") },
        { name: "UK-AUTO", regex: new RegExp(`^(?=.*${includeTerms.UK})(?!.*${excludeTerms}).*$`, "i") },
        { name: "FR-AUTO", regex: new RegExp(`^(?=.*${includeTerms.FR})(?!.*${excludeTerms}).*$`, "i") },
        { name: "DE-AUTO", regex: new RegExp(`^(?=.*${includeTerms.DE})(?!.*${excludeTerms}).*$`, "i") },
        { name: "ALL-COUNTRIES-AUTO", regex: new RegExp(`^(?!.*(?:${allCountryTerms}|${excludeTerms})).*$`, "i") },
*/
        { name: "JP-AUTO", regex: new RegExp(`^(?=.*${includeTerms.JP})(?!.*${excludeTerms}).*$`, "i") },
        { name: "HKSGTW-AUTO", regex: new RegExp(`^(?=.*${includeTerms.HK}|${includeTerms.SG}|${includeTerms.TW})(?!.*${excludeTerms}).*$`, "i") },
        { name: "JPHKSGTW-AUTO", regex: new RegExp(`^(?=.*${includeTerms.JP}|${includeTerms.HK}|${includeTerms.SG}|${includeTerms.TW})(?!.*${excludeTerms}).*$`, "i") },
        { name: "AUTO", regex: new RegExp(`^((?!.*${excludeTerms}).)*$`, "i") },
    ];

    const autoProxyGroups = autoProxyGroupRegexs
        .map((item) => ({
            name: item.name,
            type: "url-test",
            url: "https://cp.cloudflare.com",
            interval: 300,
            tolerance: 50,
            proxies: getProxiesByRegex(config, item.regex),
            hidden: true,
        }))
        .filter((item) => item.proxies.length > 0);

    // 手动选择代理组
    const manualProxyGroupRegexs = [
        { name: "HK", regex: new RegExp(`^(?=.*${includeTerms.HK})(?!.*${excludeTerms}).*$`, "i") },
        { name: "JP", regex: new RegExp(`^(?=.*${includeTerms.JP})(?!.*${excludeTerms}).*$`, "i") },
        { name: "KR", regex: new RegExp(`^(?=.*${includeTerms.KR})(?!.*${excludeTerms}).*$`, "i") },
        { name: "SG", regex: new RegExp(`^(?=.*${includeTerms.SG})(?!.*${excludeTerms}).*$`, "i") },
        { name: "US", regex: new RegExp(`^(?=.*${includeTerms.US})(?!.*${excludeTerms}).*$`, "i") },
        { name: "UK", regex: new RegExp(`^(?=.*${includeTerms.UK})(?!.*${excludeTerms}).*$`, "i") },
        { name: "FR", regex: new RegExp(`^(?=.*${includeTerms.FR})(?!.*${excludeTerms}).*$`, "i") },
        { name: "DE", regex: new RegExp(`^(?=.*${includeTerms.DE})(?!.*${excludeTerms}).*$`, "i") },
        { name: "TW", regex: new RegExp(`^(?=.*${includeTerms.TW})(?!.*${excludeTerms}).*$`, "i") }
    ];

    const manualProxyGroups = manualProxyGroupRegexs
        .map((item) => ({
            name: item.name,
            type: "select",
            proxies: getProxiesByRegex(config, item.regex),
            icon: item.icon,
            hidden: true,
        }))
        .filter((item) => item.proxies.length > 0);

    // 负载均衡策略
    // 可选值：round-robin / consistent-hashing / sticky-sessions
    // round-robin：轮询 按顺序循环使用代理列表中的节点
    // consistent-hashing：散列 根据请求的哈希值将请求分配到固定的节点
    // sticky-sessions：缓存 对「你的设备IP + 目标地址」组合计算哈希值，根据哈希值将请求分配到固定的节点 缓存 10 分钟过期
    // 默认值：consistent-hashing
    //const loadBalanceStrategy = "consistent-hashing";
   const loadBalanceGroupRegexs = [
        { name: "JP-LOAD-BALANCING", regex: new RegExp(`^(?=.*${includeTerms.JP})(?!.*${excludeTerms}).*$`, "i") },
        { name: "HKSG-AUTO-BALANCING", regex: new RegExp(`^(?=.*${includeTerms.HK}|${includeTerms.SG})(?!.*${excludeTerms}).*$`, "i") },
        { name: "JPHKSG-AUTO-BALANCING", regex: new RegExp(`^(?=.*${includeTerms.JP}|${includeTerms.HK}|${includeTerms.SG})(?!.*${excludeTerms}).*$`, "i") },
        { name: "LOAD-BALANCING", regex: new RegExp(`^((?!.*${excludeTerms}).)*$`, "i") },
    ];

    const loadBalanceBase = {
        type: "load-balance",
        url: "https://cp.cloudflare.com",
        interval: 300,
        tunnelOptionserance: 50,
        hidden: true,
        "exclude-filter": "0.[0-9]",
    }
    const loadBalanceGroupsConsistentHashing = loadBalanceGroupRegexs
        .map((item) => ({
            ...loadBalanceBase,
            name: item.name,
            proxies: getProxiesByRegex(config, item.regex),
            strategy: "consistent-hashing",
        }))
        .filter((item) => item.proxies.length > 0);
    const loadBalanceGroupsRoundRobin = loadBalanceGroupRegexs
        .map((item) => ({
            ...loadBalanceBase,
            name: item.name + "-RR",
            proxies: getProxiesByRegex(config, item.regex),
            strategy: "round-robin",
        }))
        .filter((item) => item.proxies.length > 0);
    const loadBalanceGroupsStickySession = loadBalanceGroupRegexs
        .map((item) => ({
            ...loadBalanceBase,
            name: item.name + "-SS",
            proxies: getProxiesByRegex(config, item.regex),
            strategy: "sticky-sessions",
        }))
        .filter((item) => item.proxies.length > 0);
    const loadBalanceGroups = [
        ...loadBalanceGroupsConsistentHashing,
        ...loadBalanceGroupsStickySession,
        ...loadBalanceGroupsRoundRobin,
    ]

    const iconUrl = (name) => {
        return `https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/icon/color/${name}.png`
    }
    const groups = [
        {
            name: "MANUAL",
            type: "select",
            icon: iconUrl("manual"),
            "include-all": true,
            //proxies: ["HK", "JP", "KR", "SG", "US", "UK", "FR", "DE", "TW"],
            proxies: [],
        },
    ];

    autoProxyGroups.length && groups[0].proxies.push(...autoProxyGroups.map((item) => item.name));
    loadBalanceGroups.length && groups[0].proxies.push(...loadBalanceGroups.map((item) => item.name));
    groups.push(...autoProxyGroups);
    groups.push(...manualProxyGroups);
    groups.push(...loadBalanceGroups);

    const proxyGroupsBase = {
        "jpAutoFirst": {
            "type": "select",
            "proxies": [ ...groups[0].proxies, "MANUAL", "DIRECT", "REJECT" ]
        },
        "autoFirst": {
            "type": "select",
            "proxies": [ "AUTO", "LOAD-BALANCING", "MANUAL", "DIRECT", "REJECT" ]
        },
        "manualFirst": {
            "type": "select",
            "proxies": [ "MANUAL", "DIRECT", "REJECT" ]
        },
        "directFirst": {
            "type": "select",
            "proxies": [ "DIRECT", "MANUAL", "REJECT" ]
        },
        "rejectFirst": {
            "type": "select",
            "proxies": [ "REJECT", "MANUAL", "DIRECT" ]
        },
    }
    const customProxyGroups = [
        // HOYO
        {
            ...proxyGroupsBase.jpAutoFirst,
            "name": "HOYO_CN_PROXY",
            "icon": iconUrl("mihoyo"),
            "proxies": [ "HOYO_PROXY", "HOYO_BYPASS" ]
        },
        { ...proxyGroupsBase.jpAutoFirst, "name": "HOYO_PROXY", "icon": iconUrl("mihoyo"), },
        { ...proxyGroupsBase.directFirst, "name": "HOYO_BYPASS", "icon": iconUrl("mihoyo"), },
        // BLOCK
        { ...proxyGroupsBase.rejectFirst, "name": "MIUI_BLOATWARE", "icon": "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg", },
        { ...proxyGroupsBase.rejectFirst, "name": "AD_BLOCK", "icon": iconUrl("adblock"), },
        // BYPASS
        { ...proxyGroupsBase.directFirst, "name": "BYPASS", "icon": iconUrl("cn"), },
        { ...proxyGroupsBase.jpAutoFirst, "name": "PIXIV", "icon": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Pixiv_Icon.svg", },
        // CUSTOM_JP
        {
            ...proxyGroupsBase.jpAutoFirst,
            "name": "JP_DOMAIN",
            "icon": iconUrl("jp"),
            "include-all": true,
            "filter": "JP|日本",
        },
        { ...proxyGroupsBase.jpAutoFirst, "name": "AI", "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/OpenAI_logo_2025_%28symbol%29.svg/1920px-OpenAI_logo_2025_%28symbol%29.svg.png", },
        { ...proxyGroupsBase.jpAutoFirst, "name": "GOOGLE_CN_PROXY", "icon": iconUrl("google"), },
        { ...proxyGroupsBase.jpAutoFirst, "name": "GOOGLE", "icon": iconUrl("google"), },
        { ...proxyGroupsBase.jpAutoFirst, "name": "YOUTUBE", "icon": iconUrl("youtube"), },
        { ...proxyGroupsBase.jpAutoFirst, "name": "TWITTER", "icon": iconUrl("twitter"), },
        { ...proxyGroupsBase.jpAutoFirst, "name": "TELEGRAM", "icon": iconUrl("telegram"), },
        { ...proxyGroupsBase.jpAutoFirst, "name": "DISCORD", "icon": "https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/66e3d80db9971f10a9757c99_Symbol.svg", },
        { ...proxyGroupsBase.jpAutoFirst, "name": "GITHUB", "icon": iconUrl("github"), },
        // PROXY
        { ...proxyGroupsBase.jpAutoFirst, "name": "MS", "icon": iconUrl("microsoft"), },
        { ...proxyGroupsBase.jpAutoFirst, "name": "APPLE", "icon": iconUrl("apple"), },
        // FINAL
        { ...proxyGroupsBase.manualFirst, "name": "FINAL", "icon": iconUrl("final"), },
    ];
    groups.push(...customProxyGroups);

    config["proxy-groups"] = groups;
}

function getProxiesByRegex(params, regex) {
    const matchedProxies = params.proxies.filter((e) => regex.test(e.name)).map((e) => e.name);
    return matchedProxies.length > 0 && matchedProxies;
}
function getProxiesByRegexSafe(params, regex) {
    const matchedProxies = params.proxies.filter((e) => regex.test(e.name)).map((e) => e.name);
    return matchedProxies.length > 0 ? matchedProxies: ["COMPATIBLE"];
}
// 以下代码源自
// https://github.com/clash-verge-rev/clash-verge-rev/discussions/2053#discussion-7518652
function removeNodeByName(config, regExp) {
    config.proxies = config.proxies.filter(proxy => !proxy.name.match(regExp));
    config['proxy-groups'] = config['proxy-groups'].map(it => {
        it.proxies = it.proxies.filter(name => !name.match(regExp));
        return it;
    });
    return config;
}
