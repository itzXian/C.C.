// 以下代码参照
// https://www.clashverge.dev/guide/script.html
// https://github.com/yyhhyyyyyy/selfproxy/blob/cb1470d2a321051573d3ecc902a692173b9dd787/Mihomo/Extension_Script/script.js
// https://github.com/clash-verge-rev/clash-verge-rev/discussions/2053#discussion-7518652

/* ========== 常量 & 辅助 ========== */
const CONST = {
    DNS_TEST_URL: "https://cp.cloudflare.com",
    INTERVAL: 300,
    TOLERANCE: 50,
    REGEX_REMOVE: /(\/i|\/)/g,
};

const excludeTerms = "剩余|到期|主页|官网|游戏|关注|网站|地址|有效|网址|禁止|邮箱|发布|客服|订阅|节点|问题|联系";
const includeTerms = {
    HK: "(香港|HK|Hong|🇭🇰)",
    TW: "(台湾|TW|Taiwan|Wan|🇹🇼|🇨🇳)",
    SG: "(新加坡|狮城|SG|Singapore|🇸🇬)",
    JP: "(日本|JP|Japan|🇯🇵)",
    KR: "(韩国|韓|KR|Korea|🇰🇷)",
    AU: "(澳大利亚|澳|AU|Australia|🇦🇺)",
    US: "(美国|US|United States|America|🇺🇸)",
    UK: "(英国|UK|United Kingdom|🇬🇧)",
    FR: "(法国|FR|France|🇫🇷)",
    DE: "(德国|DE|Germany|🇩🇪)",
    DIA: "(专线)",
};

const safeProvidersKeys = (config) => Object.keys(config?.["proxy-providers"] || {});

const deepClone = (obj) => {
    return typeof structuredClone === "function" ? structuredClone(obj) : JSON.parse(JSON.stringify(obj));
};

const regexToFilterString = (r) => String(r).replace(CONST.REGEX_REMOVE, "");

/* ========== 预构建的正则（缓存） ========== */
const makeAutoRegexes = (() => {
    // build once to avoid recompilation - single definition used for both
    const regexes = [
        { name: "JP", regex: new RegExp(`^(?=.*${includeTerms.JP})(?!.*${excludeTerms}).*$`, "i") },
        { name: "JP HY2❌", regex: new RegExp(`^(?=.*${includeTerms.JP})(?!.*${excludeTerms}).*$`, "i"), "exclude-type": "hysteria2|Hysteria2" },
        { name: "HK", regex: new RegExp(`^(?=.*${includeTerms.HK})(?!.*${excludeTerms}).*$`, "i") },
        { name: "SG", regex: new RegExp(`^(?=.*${includeTerms.SG})(?!.*${excludeTerms}).*$`, "i") },
        { name: "JPHKSGTWAU HY2✅", regex: new RegExp(`^(?=.*${includeTerms.JP}|${includeTerms.HK}|${includeTerms.SG}|${includeTerms.TW}|${includeTerms.AU})(?!.*${excludeTerms}).*$`, "i"), "exclude-type": "vless|Vless|vmess|Vmess" },
        { name: "JPHKSGTWAU", regex: new RegExp(`^(?=.*${includeTerms.JP}|${includeTerms.HK}|${includeTerms.SG}|${includeTerms.TW}|${includeTerms.AU})(?!.*${excludeTerms}).*$`, "i") },
        { name: "NON-JP", regex: new RegExp(`^((?!.*${excludeTerms}|${includeTerms.JP}).)*$`, "i") },
        { name: "ALL", regex: new RegExp(`^((?!.*${excludeTerms}).)*$`, "i") },
        { name: "ALL HY2✅", regex: new RegExp(`^((?!.*${excludeTerms}).)*$`, "i"), "exclude-type": "vless|Vless|vmess|Vmess" },
        { name: "ALL HY2❌", regex: new RegExp(`^((?!.*${excludeTerms}).)*$`, "i"), "exclude-type": "hysteria2|Hysteria2" },
    ];
    return () => ({ auto: regexes, load: regexes });
})();

/* ========== 代理/组相关辅助 ========== */
const getProxiesByRegex = (proxies, regex) => {
    const matched = (proxies || []).filter((p) => regex.test(p.name)).map((p) => p.name);
    return matched.length ? matched : ["COMPATIBLE"];
};

const recreateProxyGroupWithProvider = (group = [], provider) => {
    if (!Array.isArray(group) || group.length === 0) return [];
    return group.map((e) => ({ ...e, name: `${provider} ${e.name}`, proxies: [], use: [provider] }));
};

/* ========== 构建自动/负载均衡组 ========== */
const buildAutoProxyGroups = (proxies, suffix = "") => {
    const { auto } = makeAutoRegexes();
    const s = suffix || "";
    return auto
        .map((item) => ({
            name: `AUTO | ${item.name}${s}`,
            type: "url-test",
            url: CONST.DNS_TEST_URL,
            interval: CONST.INTERVAL,
            tolerance: CONST.TOLERANCE,
            filter: regexToFilterString(item.regex),
            "exclude-type": item["exclude-type"] ? item["exclude-type"] : "",
            proxies: getProxiesByRegex(proxies, item.regex),
            hidden: true,
        }))
        .filter((g) => g.proxies.length > 0);
};

const buildLoadBalanceGroups = (proxies, suffix = "") => {
    const { load } = makeAutoRegexes();
    const s = suffix || "";
    const base = { type: "load-balance", url: CONST.DNS_TEST_URL, interval: CONST.INTERVAL, hidden: true, "exclude-filter": "0.[0-9]" };
    const strategies = ["consistent-hashing", "round-robin", "sticky-sessions"];
    const prefixes = ["CH_LOAD_BA", "RR_LOAD_BA", "SS_LOAD_BA"];

    return strategies.flatMap((strategy, idx) =>
        load
            .map((item) => ({
                ...base,
                name: `${prefixes[idx]} | ${item.name}${s}`,
                filter: regexToFilterString(item.regex),
                proxies: getProxiesByRegex(proxies, item.regex),
                strategy,
            }))
            .filter((g) => g.proxies.length > 0)
    );
};

/* ========== 覆写函数 ========== */
const overrideBasicOptions = (config) => {
    const otherOptions = {
        "mixed-port": 7890,
        "allow-lan": true,
        mode: "rule",
        "geox-url": {
            geoip: "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.dat",
            geosite: "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geosite.dat",
            mmdb: "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.metadb",
            asn: "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/GeoLite2-ASN.mmdb",
        },
        "geo-auto-update": true,
        "geo-update-interval": 24, // hours
        "log-level": "warning",
        ipv6: false,
        "find-process-mode": "strict",
        profile: { "store-selected": true, "store-fake-ip": true },
        "unified-delay": true,
        "tcp-concurrent": true,
        "global-client-fingerprint": "chrome",
        sniffer: {
            enable: true,
            sniff: {
                HTTP: { ports: [80, "8080-8880"], "override-destination": true },
                TLS: { ports: [443, 8443] },
                QUIC: { ports: [443, 8443] },
            },
            "skip-domain": ["Mijia Cloud", "+.push.apple.com"],
        },
    };
    Object.assign(config, otherOptions);
};

const overrideDns = (config) => {
    const directDns = ["https://dns.alidns.com/dns-query", "https://doh.pub/dns-query"];
    const proxyDns = ["tls://8.8.4.4", "tls://1.1.1.1"];
    const defaultAdblockDns = ["dns.adguard-dns.com"];
    const overrideAdblockDns = [
    ];
    const adblockDns = overrideAdblockDns.length ? overrideAdblockDns : defaultAdblockDns;

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
        "*-127-*-*.nip.io",
    ];

    config.dns = {
        enable: true,
        "prefer-h3": false,
        ipv6: false,
        "respect-rules": true,
        "default-nameserver": ["quic://223.5.5.5:853", "tls://223.5.5.5:853"],
        "proxy-server-nameserver": directDns,
        "enhanced-mode": "fake-ip",
        "fake-ip-range": "198.18.0.1/16",
        "fake-ip-filter-mode": "blacklist",
        "fake-ip-filter": [
            ...fakeIpFilter,
            "geosite:private",
            "geosite:connectivity-check"
        ],
        "nameserver-policy": {
            "+.twimg.com": proxyDns,
            "+.pximg.net": proxyDns,
            "cdn.discordapp.com": proxyDns,
        },
        "direct-nameserver": directDns,
        "direct-nameserver-follow-policy": true,
        nameserver: adblockDns,
    };
};

const overrideHosts = (config) => {
    config.hosts = {
        "dns.alidns.com": ["223.5.5.5", "223.6.6.6", "2400:3200:baba::1", "2400:3200::1"],
        "127.0.0.1.sslip.io": "127.0.0.1",
        "127.atlas.skk.moe": "127.0.0.1",
        "cdn.jsdelivr.net": "cdn.jsdelivr.net.cdn.cloudflare.net",
    };
};

const overrideTunnel = (config) => {
    config.tun = {
        enable: true,
        stack: "system",
        device: "tun0",
        "dns-hijack": ["any:53", "tcp://any:53"],
        "auto-route": true,
        "auto-detect-interface": true,
        "strict-route": true,
        "route-exclude-address": [],
    };
};

/* ========== 生成与注入 proxy-groups ========== */
const buildProxyGroupBase = (groupNames) => {
    const jpAutoFirst = { type: "select", proxies: ["CUSTOM", "MANUAL", ...groupNames, "DIRECT", "REJECT"] };
    return {
        jpAutoFirst,
        directFirst: { ...jpAutoFirst, proxies: ["DIRECT", "MANUAL", "CUSTOM", "REJECT"] },
        rejectFirst: { ...jpAutoFirst, proxies: ["REJECT", "MANUAL", "CUSTOM", "DIRECT"] },
    };
};

const overrideProxyGroups = (config) => {
    const allProxies = deepClone(config.proxies || []);
    const autoProxyGroups = buildAutoProxyGroups(allProxies);
    const loadBalanceGroups = buildLoadBalanceGroups(allProxies);

    const groups = [{ name: "MANUAL", type: "select", proxies: [] }];

    if (autoProxyGroups.length) {
        groups[0].proxies.push(...autoProxyGroups.map((g) => g.name));
        groups.push(...autoProxyGroups);
    }
    if (loadBalanceGroups.length) {
        groups[0].proxies.push(...loadBalanceGroups.map((g) => g.name));
        groups.push(...loadBalanceGroups);
    }

    groups[0].proxies.push(...allProxies.map((p) => p.name));

    // provider-specific groups
    const providerKeys = safeProvidersKeys(config);
    const tempGroups = [];
    if (providerKeys.length) {
        groups.forEach((g) => {
            g.use = providerKeys.slice();
            if (g.name !== "MANUAL") g.proxies = [];
        });

        const tempNames = [];
        providerKeys.forEach((provider) => {
            const newGroups = [{ name: `MANUAL ${provider}`, type: "select", proxies: [], use: [provider] }];
            const newAuto = recreateProxyGroupWithProvider(autoProxyGroups, provider);
            const newLoad = recreateProxyGroupWithProvider(loadBalanceGroups, provider);
            const newAll = [...newAuto, ...newLoad];
            newGroups[0].proxies.push(...newAll.map((i) => i.name));
            newGroups.push(...newAll);
            tempNames.push(newGroups[0].name);
            tempGroups.push(...newGroups);
        });

        groups[0].proxies.unshift(...tempNames);
        groups.push(...tempGroups);
    }

    const proxyGroupBase = buildProxyGroupBase(groups[0].proxies);

    const createProxyGroup = (name, base, extraProxies) => ({ ...base, name, proxies: extraProxies ? [...extraProxies, ...base.proxies] : base.proxies });

    const customProxyGroups = [
        { name: "CUSTOM", type: "select", proxies: ["MANUAL", "DIRECT", "REJECT", ...groups[0].proxies] },
        createProxyGroup("HOYO_CN_PROXY", proxyGroupBase.jpAutoFirst, ["HOYO_PROXY", "HOYO_BYPASS"]),
        createProxyGroup("HOYO_BYPASS", proxyGroupBase.directFirst),
        createProxyGroup("HOYO_GI", proxyGroupBase.jpAutoFirst, ["HOYO_PROXY", "HOYO_BYPASS"]),
        createProxyGroup("HOYO_HSR", proxyGroupBase.jpAutoFirst, ["HOYO_PROXY", "HOYO_BYPASS"]),
        createProxyGroup("HOYO_ZZZ", proxyGroupBase.jpAutoFirst, ["HOYO_PROXY", "HOYO_BYPASS"]),
        createProxyGroup("HOYO_PROXY", proxyGroupBase.jpAutoFirst),
        createProxyGroup("MIUI_BLOATWARE", proxyGroupBase.rejectFirst),
        createProxyGroup("AD_BLOCK", proxyGroupBase.rejectFirst),
        createProxyGroup("STEAM_CN", proxyGroupBase.directFirst),
        createProxyGroup("STEAM", proxyGroupBase.jpAutoFirst),
        createProxyGroup("PIXIV", proxyGroupBase.jpAutoFirst),
        createProxyGroup("AI", proxyGroupBase.jpAutoFirst),
        createProxyGroup("YOUTUBE", proxyGroupBase.jpAutoFirst),
        createProxyGroup("GOOGLE", proxyGroupBase.jpAutoFirst),
        createProxyGroup("TWITTER", proxyGroupBase.jpAutoFirst),
        createProxyGroup("TELEGRAM", proxyGroupBase.jpAutoFirst),
        createProxyGroup("DISCORD", proxyGroupBase.jpAutoFirst),
        createProxyGroup("MICROSOFT", proxyGroupBase.jpAutoFirst),
        createProxyGroup("APPLE", proxyGroupBase.jpAutoFirst),
        createProxyGroup("NON_JP ∆", proxyGroupBase.jpAutoFirst),
        createProxyGroup("DOWNLOAD 〇", proxyGroupBase.jpAutoFirst),
        createProxyGroup("JP", proxyGroupBase.jpAutoFirst),
        createProxyGroup("PROXY", proxyGroupBase.jpAutoFirst),
        createProxyGroup("BYPASS", proxyGroupBase.directFirst),
        createProxyGroup("FINAL", proxyGroupBase.jpAutoFirst),
    ];

    groups.push(...customProxyGroups);

    if (tempGroups.length) {
        const tempNames = tempGroups.map((m) => m.name).filter((name) => !name.includes(groups[0].name));
        groups.filter((g) => g.name.includes("〇")).forEach((g) => g.proxies.push(...tempNames));
    }

    config["proxy-groups"] = groups;
};

/* ========== rule-providers (保留原有) ========== */
const overrideRuleProviders = (config) => {
    const ruleProviderConfig = { type: "http", interval: "3600" };
    const ruleProviderBase = {
        Classical: { ...ruleProviderConfig, format: "text", behavior: "classical" },
        Domain: { ...ruleProviderConfig, format: "text", behavior: "domain" },
        Ipcodr: { ...ruleProviderConfig, format: "text", behavior: "ipcidr" },
        ClassicalYaml: { ...ruleProviderConfig, format: "yaml", behavior: "classical" },
        DomainYaml: { ...ruleProviderConfig, format: "yaml", behavior: "domain" },
        IpcodrYaml: { ...ruleProviderConfig, format: "yaml", behavior: "ipcidr" },
    };

    const ruleProviders = {
        Hoyo_CN_Proxy: {
            ...ruleProviderBase.Classical,
            url: "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/Hoyo_CN_Proxy.list",
            path: "./Hoyo_CN_Proxy.list",
        },
        Hoyo_Bypass: {
            ...ruleProviderBase.Classical,
            url: "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/Hoyo_Bypass.list",
            path: "./Hoyo_Bypass.list",
        },
        Hoyo_Proxy: {
            ...ruleProviderBase.Classical,
            url: "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/Hoyo_Proxy.list",
            path: "./Hoyo_Proxy.list",
        },
        MIUI_Bloatware: {
            ...ruleProviderBase.Classical,
            url: "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/MIUI_Bloatware.list",
            path: "./MIUI_Bloatware.list",
        },
    };

    config["rule-providers"] = ruleProviders;
};

/* ========== rules ========== */
const overrideRules = (config) => {
    const Hoyo_CN_Proxy = [
        "DOMAIN,osasiadispatch.yuanshen.com,HOYO_CN_PROXY",
        "DOMAIN,autopatchhk.yuanshen.com,HOYO_CN_PROXY",
        "DOMAIN,oseurodispatch.yuanshen.com,HOYO_CN_PROXY",
        "DOMAIN,osusadispatch.yuanshen.com,HOYO_CN_PROXY",
        "DOMAIN,osuspider.yuanshen.com,HOYO_CN_PROXY",
    ];

    const Hoyo_Bypass = [
        "DOMAIN,dispatchosglobal.yuanshen.com,HOYO_BYPASS",
        "DOMAIN-REGEX,[\\w-]*log-upload-os\\.hoyoverse\\.com,HOYO_BYPASS",
        "DOMAIN-REGEX,asia-ugc[\\w-]*\\.hoyoverse\\.com,HOYO_BYPASS",
        "DOMAIN-SUFFIX,yuanshen.com,HOYO_BYPASS",
        "DOMAIN-SUFFIX,mihoyo.com,HOYO_BYPASS",
        // GI: 22101-22102
        "AND,((DST-PORT,22101-22102),(NETWORK,udp)),HOYO_BYPASS",
        // HSR: 23301/23801
        "AND,((DST-PORT,23301/23801),(NETWORK,udp)),HOYO_BYPASS",
        // ZZZ: 20501
        "AND,((DST-PORT,20501),(NETWORK,udp)),HOYO_BYPASS",
    ];

    const Hoyo_GI = [
        "AND,((DST-PORT,8999),(NETWORK,tcp)),HOYO_PROXY",
        "DOMAIN,dispatch-hk4e-global-os-asia.hoyoverse.com,HOYO_GI",
    ];
    const Hoyo_HSR = ["DOMAIN-SUFFIX,starrails.com,HOYO_HSR"];
    const Hoyo_ZZZ = ["DOMAIN-SUFFIX,zenlesszonezero.com,HOYO_ZZZ"];
    const Hoyo_Proxy = ["DOMAIN-SUFFIX,hoyoverse.com,HOYO_PROXY", "DOMAIN-SUFFIX,hoyolab.com,HOYO_PROXY"];

    const MIUI_Bloatware = [
        "DOMAIN,api.installer.xiaomi.com,MIUI_BLOATWARE",
        "DOMAIN,tracking.miui.com,MIUI_BLOATWARE",
        "DOMAIN,data.mistat.xiaomi.com,MIUI_BLOATWARE",
        "DOMAIN,diagnosis.ad.xiaomi.com,MIUI_BLOATWARE",
        "DOMAIN,log.ad.xiaomi.com,MIUI_BLOATWARE",
        "DOMAIN,m.track.ad.xiaomi.com,MIUI_BLOATWARE",
        "DOMAIN,sdkconfig.ad.xiaomi.com,MIUI_BLOATWARE",
        "DOMAIN,api.ad.xiaomi.com,MIUI_BLOATWARE",
        "DOMAIN,tracker.ai.xiaomi.com,MIUI_BLOATWARE",
        "DOMAIN,grayconfig.ai.xiaomi.com,MIUI_BLOATWARE",
        "DOMAIN,mazu.sec.miui.com,MIUI_BLOATWARE",
        "DOMAIN,miui-fxcse.avlyun.com,MIUI_BLOATWARE",
        "DOMAIN,sdkconf.avlyun.com,MIUI_BLOATWARE",
        "DOMAIN,miav-cse.avlyun.com,MIUI_BLOATWARE",
        "DOMAIN,update.avlyun.sec.miui.com,MIUI_BLOATWARE",
        "DOMAIN,ixav-cse.avlyun.com,MIUI_BLOATWARE",
        "DOMAIN,logupdate.avlyun.sec.miui.com,MIUI_BLOATWARE",
        "DOMAIN,api.sec.miui.com,MIUI_BLOATWARE",
        "DOMAIN,auth.be.sec.miui.com,MIUI_BLOATWARE",
        "DOMAIN,flash.sec.miui.com,MIUI_BLOATWARE",
        "DOMAIN,api.hybrid.xiaomi.com,MIUI_BLOATWARE",
        "DOMAIN,o2o.api.xiaomi.com,MIUI_BLOATWARE",
        "DOMAIN,api.browser.miui.com,MIUI_BLOATWARE",
        "DOMAIN,ssl-cdn.static.browser.mi-img.com,MIUI_BLOATWARE",
        "DOMAIN,security.browser.miui.com,MIUI_BLOATWARE",
        "DOMAIN,hot.browser.miui.com,MIUI_BLOATWARE",
        "DOMAIN,r.browser.miui.com,MIUI_BLOATWARE",
        "DOMAIN,hd.browser.miui.com,MIUI_BLOATWARE",
        "DOMAIN,c3-cache.browser.miui.com,MIUI_BLOATWARE",
        "DOMAIN,api-ipv4.browser.miui.com,MIUI_BLOATWARE",
        "DOMAIN,qsb.browser.miui.com,MIUI_BLOATWARE",
        "DOMAIN,sentry.d.xiaomi.net,MIUI_BLOATWARE",
        "DOMAIN,global-search.browser.miui.com,MIUI_BLOATWARE",
        "DOMAIN,global.search.xiaomi.net,MIUI_BLOATWARE",
        "DOMAIN,api.developer.xiaomi.com,MIUI_BLOATWARE",
        "DOMAIN,update.miui.com,MIUI_BLOATWARE",
        "DOMAIN,port.sec.miui.com,MIUI_BLOATWARE",
        "DOMAIN,qsb.browser.miui.srv,MIUI_BLOATWARE",
        "DOMAIN,rom.pt.miui.srv,MIUI_BLOATWARE",
        "DOMAIN,ccc.sys.miui.com,MIUI_BLOATWARE",
        "DOMAIN,jupiter.sys.miui.com,MIUI_BLOATWARE",
        "DOMAIN,metok.sys.miui.com,MIUI_BLOATWARE",
        "DOMAIN,tmfsdk.m.qq.com,MIUI_BLOATWARE",
        "DOMAIN,tmfsdk4.m.qq.com,MIUI_BLOATWARE",
        "DOMAIN,tbm.snssdk.com,MIUI_BLOATWARE",
        "DOMAIN,othstr.beacon.qq.com,MIUI_BLOATWARE",
        "DOMAIN,tools.3g.qq.com,MIUI_BLOATWARE",
        "DOMAIN,tmfsdktcp.m.qq.com,MIUI_BLOATWARE",
        "DOMAIN,h.trace.qq.com,MIUI_BLOATWARE",
        "DOMAIN,hub5pn.wap.sandai.net,MIUI_BLOATWARE",
        "DOMAIN,tpstelemetry.tencent.com,MIUI_BLOATWARE",
        "DOMAIN,pssn.alicdn.com,MIUI_BLOATWARE",
        "DOMAIN,tmfsdktcpv4.m.qq.com,MIUI_BLOATWARE",
        "DOMAIN,tmeadcomm.y.qq.com,MIUI_BLOATWARE",
        "DOMAIN,tangram.e.qq.com,MIUI_BLOATWARE",
        "DOMAIN,us.l.qq.com,MIUI_BLOATWARE",
        "DOMAIN,tdid.m.qq.com,MIUI_BLOATWARE",
        "DOMAIN,h.trace.qq.com,MIUI_BLOATWARE",
        "DOMAIN,api.yky.qq.com,MIUI_BLOATWARE",
        "DOMAIN,sdk.e.qq.com,MIUI_BLOATWARE",
        "DOMAIN,android.bugly.qq.com,MIUI_BLOATWARE",
        "DOMAIN,toblog.ctobsnssdk.com,MIUI_BLOATWARE",
        "DOMAIN,tobapplog.ctobsnssdk.com,MIUI_BLOATWARE",
        "DOMAIN,cfg.imtt.qq.com,MIUI_BLOATWARE",
        "DOMAIN,statres.quickapp.cn,MIUI_BLOATWARE",
        "DOMAIN,qr.quickapp.cn,MIUI_BLOATWARE",
        "DOMAIN,hybrid.xiaomi.com,MIUI_BLOATWARE",
        "DOMAIN,hybrid.miui.com,MIUI_BLOATWARE",
        "DOMAIN,s1.irs03.com,MIUI_BLOATWARE",
        "DOMAIN,up.cm.ksmobile.com,MIUI_BLOATWARE",
        "DOMAIN,dl.cm.ksmobile.com,MIUI_BLOATWARE",
        "DOMAIN,dw-online.ksosoft.com,MIUI_BLOATWARE",
        "DOMAIN,zzhc.vnet.cn,MIUI_BLOATWARE",
        "DOMAIN,beacon-api.aliyuncs.com,MIUI_BLOATWARE",
        "DOMAIN,mpush-api.aliyun.com,MIUI_BLOATWARE",
        "DOMAIN,ug.snssdk.com,MIUI_BLOATWARE",
        "DOMAIN,t7z.cupid.iqiyi.com,MIUI_BLOATWARE",
        "DOMAIN,worldwide.sogou.com,MIUI_BLOATWARE",
        "DOMAIN,www.pangolin-dsp-toutiao.com,MIUI_BLOATWARE",
        "DOMAIN,master.wap.dphub.sandai.net,MIUI_BLOATWARE",
        "DOMAIN,hub5u.wap.sandai.net,MIUI_BLOATWARE",
        "DOMAIN,idx.m.hub.sandai.net,MIUI_BLOATWARE",
        "DOMAIN,tw13b093.sandai.net,MIUI_BLOATWARE",
        "DOMAIN,adinfo.ra1.xlmc.sec.miui.com,MIUI_BLOATWARE",
        "DOMAIN,test.ad.xiaomi.com,MIUI_BLOATWARE",
        "DOMAIN,uploadlog.xlmc.sandai.net,MIUI_BLOATWARE",
        "DOMAIN,t03-api.xlmc.xunlei.com,MIUI_BLOATWARE",
        "DOMAIN,pre.api.tw06.xlmc.sandai.net,MIUI_BLOATWARE",
        "DOMAIN,guid-xldw-ssl.n0808.com,MIUI_BLOATWARE",
        "DOMAIN,data.sec.miui.com,MIUI_BLOATWARE",
        "DOMAIN,pgdt.gtimg.cn,MIUI_BLOATWARE",
        "DOMAIN,rdt.tfogc.com,MIUI_BLOATWARE",
    ];

    const Download = [
        "DOMAIN-REGEX,api.[\\w]+raplay.com,DOWNLOAD 〇",
        "DOMAIN-REGEX,[\\w]+.raplay.*workers.dev,DOWNLOAD 〇",
        "DOMAIN-REGEX,.*\\.[\\w]+[eo](hu|ze).workers.dev,DOWNLOAD 〇",
    ];

    const customRules = [
        ...Hoyo_CN_Proxy,
        ...Hoyo_Bypass,
        ...Hoyo_GI,
        ...Hoyo_HSR,
        ...Hoyo_ZZZ,
        ...Hoyo_Proxy,
        ...MIUI_Bloatware,
        "GEOSITE,category-ads-all,AD_BLOCK",
        "GEOSITE,steam@cn,STEAM_CN",
        "DOMAIN-SUFFIX,steamserver.net,STEAM_CN",
        "GEOSITE,steam,STEAM",
        "GEOSITE,pixiv,PIXIV",
        "GEOSITE,category-ai-!cn,AI",
        "GEOSITE,youTube,YOUTUBE",
        "GEOIP,google,GOOGLE,no-resolve",
        "GEOSITE,google,GOOGLE",
        "GEOIP,twitter,TWITTER,no-resolve",
        "GEOSITE,twitter,TWITTER",
        "GEOIP,telegram,TELEGRAM,no-resolve",
        "GEOSITE,telegram,TELEGRAM",
        "GEOSITE,discord,DISCORD",
        "GEOSITE,microsoft,MICROSOFT",
        "GEOSITE,apple,APPLE",
        "GEOSITE,apple-intelligence,APPLE",
        "DOMAIN-SUFFIX,hinative.com,NON_JP ∆",
        ...Download,
        "GEOIP,JP,JP,no-resolve",
        "GEOSITE,geolocation-!cn,PROXY",
        "GEOSITE,private,BYPASS",
        "GEOSITE,CN,BYPASS",
        "GEOIP,private,BYPASS",
        "GEOIP,CN,BYPASS",
        "MATCH,FINAL",
    ];

    config["rules"] = customRules;
};

/* ========== dialer / relay 支持 ========== */
const dialerProxy = (config, dialer) => {
    const allProxies = deepClone(config.proxies || []);
    const relayProviders = {
        "provider-config-relay": {
            type: "inline",
            override: { "dialer-proxy": dialer, "additional-prefix": "🛬" },
            payload: allProxies,
        },
    };

    const autoProxyGroups = buildAutoProxyGroups(allProxies, "🛬");
    const loadBalanceGroups = buildLoadBalanceGroups(allProxies, "🛬");

    const groups = [{ name: "RELAY", type: "select", proxies: [], "exclude-filter": excludeTerms }];

    if (autoProxyGroups.length) {
        groups[0].proxies.push(...autoProxyGroups.map((g) => g.name));
        groups.push(...autoProxyGroups);
    }
    if (loadBalanceGroups.length) {
        groups[0].proxies.push(...loadBalanceGroups.map((g) => g.name));
        groups.push(...loadBalanceGroups);
    }

    const providerKeys = safeProvidersKeys(config);
    const tempGroups = [];

    if (providerKeys.length) {
        const proxyProviders = config["proxy-providers"] || {};
        const tempNames = [];

        providerKeys.forEach((provider) => {
            const newProvider = `${provider}-Relay`;
            relayProviders[newProvider] = {
                ...proxyProviders[provider],
                override: { ...proxyProviders[provider]?.override, "dialer-proxy": dialer, "additional-suffix": "🛬" },
            };

            const newGroups = [{ name: `RELAY ${provider}`, type: "select", proxies: [], use: [newProvider] }];
            const newAuto = recreateProxyGroupWithProvider(autoProxyGroups, newProvider);
            const newLoad = recreateProxyGroupWithProvider(loadBalanceGroups, newProvider);
            const newAll = [...newAuto, ...newLoad];

            newGroups[0].proxies.push(...newAll.map((i) => i.name));
            newGroups.push(...newAll);

            tempNames.push(newGroups[0].name);
            tempGroups.push(...newGroups);
        });

        groups[0].proxies.unshift(...tempNames);

        // 将 tempNames 插入现有 proxy-groups 的常用选择位置
        (config["proxy-groups"] || []).forEach((g) => {
            if (g.type === "select" && !g.hidden && !g.proxies.includes(tempNames[0]) && !g.name.includes(dialer)) {
                g.proxies.splice(1, 0, ...tempNames);
            }
        });

        Object.assign((config["proxy-providers"] = config["proxy-providers"] || {}), relayProviders);
    } else {
        config["proxy-providers"] = relayProviders;
    }

    groups.forEach((g) => {
        g.use = Object.keys(relayProviders);
        if (g.name !== "RELAY") g.proxies = [];
    });

    tempGroups.forEach((g) => {
        if (!g.name.includes("RELAY")) g.proxies = [];
    });

    groups.push(...tempGroups);

    // 在现有 proxy-groups 中插入 RELAY 相关项
    (config["proxy-groups"] || []).forEach((g) => {
        if (g.name.includes("∆")) {
            g.proxies.push(...groups.map((r) => r.name).filter((name) => !name.includes(groups[0].name)));
        }
        if (g.type === "select" && !g.hidden && !g.proxies.includes(groups[0].name) && !g.name.includes(dialer)) {
            g.proxies.splice(1, 0, groups[0].name);
        }
    });

    config["proxy-groups"] = [...(config["proxy-groups"] || [])];
    config["proxy-groups"].unshift(...groups);
};

/* ========== 图标支持 ========== */
const generateIconUrl = (name) => `https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/icon/color/${name}.png`;

const ICON_MAP = {
    RELAY: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Noto_Emoji_v2.034_1f517.svg",
    MANUAL: generateIconUrl("manual"),
    CUSTOM: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Noto_Emoji_v2.034_1f537.svg",
    HOYO_CN_PROXY: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://hoyoverse.com&size=256",
    HOYO_BYPASS: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://hoyoverse.com&size=256",
    HOYO_GI: "https://play-lh.googleusercontent.com/YQqyKaXX-63krqsfIzUEJWUWLINxcb5tbS6QVySdxbS7eZV7YB2dUjUvX27xA0TIGtfxQ5v-tQjwlT5tTB-O",
    HOYO_HSR: "https://play-lh.googleusercontent.com/IqXUfiwbK-NCu5KyyK9P3po1kd4ZPOC4QJVWRk2ooJXnUcSpkCUQRYYJ-9vZkCEnPOxDIEWjNpS30OwHNZTtCKw",
    HOYO_ZZZ: "https://play-lh.googleusercontent.com/8jEmEvTsNIRW1vLlrDXXCcDlKkQrNb8NzccOXrln4G_DOUZpcBPbN9ssjuwBWz7_yZQ",
    HOYO_PROXY: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://hoyoverse.com&size=256",
    MIUI_BLOATWARE: "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.mi.com/&size=256",
    AD_BLOCK: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Codex_icon_Block_red.svg",
    STEAM_CN: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
    STEAM: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
    PIXIV: "https://play-lh.googleusercontent.com/UADIlh0kSQkh59fl-s3RgLFILa_EY5RqA4sMOtKD-fX0z0fDVUR7_a7ysylufmhH-K-XfhSVVdpspD8K0jtu",
    AI: "https://play-lh.googleusercontent.com/lmG9HlI0awHie0cyBieWXeNjpyXvHPwDBb8MNOVIyp0P8VEh95AiBHtUZSDVR3HLe3A",
    YOUTUBE: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://youtube.com&size=256",
    GOOGLE: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
    TWITTER: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg",
    TELEGRAM: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg",
    DISCORD: "https://upload.wikimedia.org/wikipedia/fr/4/4f/Discord_Logo_sans_texte.svg",
    MICROSOFT: "https://upload.wikimedia.org/wikipedia/commons/2/25/Microsoft_icon.svg",
    APPLE: "https://upload.wikimedia.org/wikipedia/commons/8/84/Apple_Computer_Logo_rainbow.svg",
    "NON_JP ∆": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Noto_Emoji_v2.034_1f536.svg",
    "DOWNLOAD 〇": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Noto_Emoji_v2.034_1f536.svg",
    JP: "https://upload.wikimedia.org/wikipedia/commons/5/54/Noto_Emoji_v2.034_1f338.svg",
    PROXY: "https://upload.wikimedia.org/wikipedia/commons/2/26/Noto_Emoji_v2.034_1f310.svg",
    BYPASS: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Noto_Emoji_v2.034_2b50.svg",
    FINAL: generateIconUrl("final"),
};

const getIconForGroup = (name) => ICON_MAP[name] || null;

const setProxyGroupIcon = (config) => {
    (config["proxy-groups"] || []).forEach((g) => {
        if (!g.hidden) {
            const icon = getIconForGroup(g.name);
            if (icon) g.icon = icon;
        }
    });
};

/* ========== 删除代理（按正则） ========== */
function removeProxyByRegex(config, regex) {
    config.proxies = (config.proxies || []).filter((e) => !e.name.match(regex));
    config["proxy-groups"] = (config["proxy-groups"] || [])
        .map((e) => {
            e.proxies = (e.proxies || []).filter((name) => !name.match(regex));
            return e;
        })
        .filter(Boolean);
}

/* ========== 主入口 ========== */
const main = (config) => {
    if (!config?.proxies) return config;
    overrideBasicOptions(config);
    overrideDns(config);
    overrideHosts(config);
    overrideTunnel(config);
    overrideProxyGroups(config);
    // overrideRuleProviders(config); // 如需使用远程 rule-providers 取消注释
    overrideRules(config);
    dialerProxy(config, "MANUAL");
    setProxyGroupIcon(config);
    return config;
};

//module.exports = { main };
