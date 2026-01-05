// 以下代码参照
// https://www.clashverge.dev/guide/script.html
const main = (config) => {
    if (!config.proxies) return config;
    //removeProxyByRegex(config, /^((?!专线).)*$/);
    overrideBasicOptions(config);
    overrideDns(config);
    overrideHosts(config);
    overrideTunnel(config);
    overrideProxyGroups(config);
    //overrideRuleProviders(config);
    overrideRules(config);
    dailerProxy(config, config.proxies, "MANUAL");
    setProxyGroupIcon(config);
    return config;
}

const overrideRuleProviders = (config) => {
    const ruleProviderConfig = {
        "type": "http",
        "interval": "3600",
    };
    ruleProviderConfig.text = {
        ...ruleProviderConfig,
        "format": "text",
    };
    ruleProviderConfig.yaml = {
        ...ruleProviderConfig,
        "format": "yaml",
    };
    const ruleProviderBase = {
        Classical: {
            ...ruleProviderConfig.text,
            "behavior": "classical",
        },
        Domain: {
            ...ruleProviderConfig.text,
            "behavior": "domain",
        },
        Ipcodr: {
            ...ruleProviderConfig.text,
            "behavior": "ipcidr",
        },
        ClassicalYaml: {
            ...ruleProviderConfig.yaml,
            "behavior": "classical",
        },
        DomainYaml: {
            ...ruleProviderConfig.yaml,
            "behavior": "domain",
        },
        IpcodrYaml: {
            ...ruleProviderConfig.yaml,
            "behavior": "ipcidr",
        },
    }
    const ruleProviders = {
        // HOYO
        Hoyo_CN_Proxy: {
            ...ruleProviderBase.Classical,
            "url": "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/Hoyo_CN_Proxy.list",
            "path": "./Hoyo_CN_Proxy.list"
        },
        Hoyo_Bypass: {
            ...ruleProviderBase.Classical,
            "url": "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/Hoyo_Bypass.list",
            "path": "./Hoyo_Bypass.list"
        },
        Hoyo_Proxy: {
            ...ruleProviderBase.Classical,
            "url": "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/Hoyo_Proxy.list",
            "path": "./Hoyo_Proxy.list"
        },
        // BLOCK
        MIUI_Bloatware: {
            ...ruleProviderBase.Classical,
            "url": "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/MIUI_Bloatware.list",
            "path": "./MIUI_Bloatware.list"
        },
    }
    config["rule-providers"] = ruleProviders;
}

const overrideRules = (config) => {
    const Hoyo_CN_Proxy = [
        "DOMAIN,osasiadispatch.yuanshen.com,HOYO_CN_PROXY",
        "DOMAIN,autopatchhk.yuanshen.com,HOYO_CN_PROXY",
        "DOMAIN,oseurodispatch.yuanshen.com,HOYO_CN_PROXY",
        "DOMAIN,osusadispatch.yuanshen.com,HOYO_CN_PROXY",
        "DOMAIN,osuspider.yuanshen.com,HOYO_CN_PROXY",
        // "DOMAIN-REGEX,\w*(os|patch)\w*\.yuanshen\.com",
    ]
    const Hoyo_Bypass = [
        "DOMAIN,dispatchosglobal.yuanshen.com,HOYO_BYPASS",
        "DOMAIN,sdk-log-upload-os.hoyoverse.com,HOYO_BYPASS",
        "DOMAIN,log-upload-os.hoyoverse.com,HOYO_BYPASS",
        "DOMAIN,ad-log-upload-os.hoyoverse.com,HOYO_BYPASS",
        "DOMAIN,ys-log-upload-os.hoyoverse.com,HOYO_BYPASS",
        "DOMAIN-REGEX,[\w-]*log-upload-os\.hoyoverse\.com,HOYO_BYPASS",
        "DOMAIN,asia-ugc-api.hoyoverse.com,HOYO_BYPASS",
        "DOMAIN-SUFFIX,yuanshen.com,HOYO_BYPASS",
        "DOMAIN-SUFFIX,mihoyo.com,HOYO_BYPASS",
        // GI: 22101-22102
        // HSR: 23301/23801
        // ZZZ: 20501
        "AND,((DST-PORT,22101-22102/23301/23801/20501),(NETWORK,udp)),HOYO_BYPASS",
    ]
    const Hoyo_Proxy = [
        "AND,((DST-PORT,8999),(NETWORK,tcp)),HOYO_PROXY",
        "DOMAIN-SUFFIX,hoyoverse.com,HOYO_PROXY",
        "DOMAIN-SUFFIX,hoyolab.com,HOYO_PROXY",
        "DOMAIN-SUFFIX,starrails.com,HOYO_PROXY",
        "DOMAIN-SUFFIX,zenlesszonezero.com,HOYO_PROXY",
    ]
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
    ]
    const customRules = [
    // HOYO
    ...Hoyo_CN_Proxy,
    ...Hoyo_Bypass,
    ...Hoyo_Proxy,
    // BLOCK
    ...MIUI_Bloatware,
    "GEOSITE,category-ads-all,AD_BLOCK",
    // CUSTOM
    "DOMAIN-SUFFIX,hinative.com,FINAL",
    "GEOSITE,steam@cn,STEAM_CN",
    "DOMAIN-SUFFIX,steamserver.net,STEAM_CN",
    "GEOSITE,steam,STEAM",
    // CUSTOM_JP
    "GEOSITE,pixiv,PIXIV",
    "GEOSITE,category-ai-!cn,AI",
    "GEOSITE,youTube,YOUTUBE",
    "GEOIP,google,GOOGLE",
    "GEOSITE,google,GOOGLE",
    "GEOIP,twitter,TWITTER",
    "GEOSITE,twitter,TWITTER",
    // PROXY
    "GEOIP,telegram,TELEGRAM",
    "GEOSITE,telegram,TELEGRAM",
    "GEOSITE,discord,DISCORD",
    "GEOSITE,microsoft,MICROSOFT",
    "GEOSITE,apple,APPLE",
    "GEOSITE,apple-intelligence,APPLE",
    // CUSTOM_JP(BEFORE FINAL)
    "GEOIP,JP,JP_DOMAIN",
    // BYPASS
    "GEOSITE,private,BYPASS",
    "GEOIP,private,BYPASS",
    "GEOSITE,CN,BYPASS",
    "GEOIP,CN,BYPASS",
    // FINAL
    "MATCH,FINAL",
    ];
    config["rules"] = customRules;
}

// 以下代码源自
// https://github.com/yyhhyyyyyy/selfproxy/blob/cb1470d2a321051573d3ecc902a692173b9dd787/Mihomo/Extension_Script/script.js

// 覆写Basic Options
const overrideBasicOptions = (config) => {
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
const overrideDns = (config) => {
    const directDnsList = [
        "quic://223.5.5.5:853",
    ];
    const proxyDnsList = [
        "tls://8.8.4.4",
        "tls://1.1.1.1",
    ];
    const adblockDnsList = [
        "dns.adguard-dns.com",
    ]
    const fakeIpFilter = [
        "geosite:private",
        "geosite:cn",
    ];
    const nameserverPolicy = {
        "geosite:private": "system",
        "geosite:cn": directDnsList,
        "geosite:geolocation-cn": directDnsList,
        "geosite:steam@cn": directDnsList,
        "+.steamserver.net": directDnsList,
        "geosite:steam": proxyDnsList,
        "geosite:pixiv": proxyDnsList,
        "geosite:category-ai-!cn": proxyDnsList,
        "geosite:youTube": proxyDnsList,
        "geosite:google": proxyDnsList,
        "geosite:twitter": proxyDnsList,
        "geosite:telegram": proxyDnsList,
        "geosite:discord": proxyDnsList,
        "geosite:microsoft": proxyDnsList,
        "geosite:apple": proxyDnsList,
        "geosite:apple-intelligence": proxyDnsList,
    };
    const fallbackFilter = {
        geoip: true,
        "geoip-code": "CN",
        geosite: [
            "gfw",
        ],
        ipcidr: [
            "240.0.0.0/4",
        ],
        domain: [
            "+.facebook.com",
        ],
    }

    const dnsOptions = {
        enable: true,
        "prefer-h3": false,
        "use-hosts": true,
        "use-system-hosts": true,
        "respect-rules": true,
        ipv6: false,
        "default-nameserver": directDnsList,
        "proxy-server-nameserver": directDnsList,
        "enhanced-mode": "fake-ip",
        "fake-ip-range": "198.18.0.1/16",
        "fake-ip-filter-mode": "blacklist",
        "fake-ip-filter": fakeIpFilter,
        "nameserver-policy": nameserverPolicy,
        nameserver: adblockDnsList,
        "direct-nameserver": [
            "system",
        ],
        "direct-nameserver-follow-policy": false,
        fallback: adblockDnsList,
        "fallback-filter": fallbackFilter,
    };
    config.dns = { ...dnsOptions };
}

// 覆写hosts
const overrideHosts  = (config) => {
    const hosts = {
        "dns.alidns.com": ['223.5.5.5', '223.6.6.6', '2400:3200:baba::1', '2400:3200::1'],
        "127.0.0.1.sslip.io": "127.0.0.1",
        "127.atlas.skk.moe": "127.0.0.1",
        "cdn.jsdelivr.net": "cdn.jsdelivr.net.cdn.cloudflare.net"
    };
    config.hosts = hosts;
}

// 覆写Tunnel
const overrideTunnel = (config) => {
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
    config.tun = { ...tunnelOptions };
}

const getProxiesByRegex = (proxies, regex) => {
    const matchedProxies = proxies.filter((e) => regex.test(e.name)).map((e) => e.name);
    //return matchedProxies.length > 0 ? matchedProxies: ["COMPATIBLE"];
    return matchedProxies.length > 0 && matchedProxies;
}

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
    DE: "(德国|DE|Germany|🇩🇪)",
    DIA: "(专线)",
};
// 合并所有国家关键词，供"其它"条件使用
const allCountryTerms = Object.values(includeTerms).join("|");

// 覆盖代理组
const overrideProxyGroups = (config) => {
    // 所有代理
    const allProxies = config["proxies"].map((e) => e.name);

    // 手动选择代理组
    /*
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
            proxies: getProxiesByRegex(config.proxies, item.regex),
            hidden: true,
        }))
        .filter((item) => item.proxies.length > 0);
    */

     // 自动代理组正则表达式配置
    const autoProxyGroupRegexs = [
    /*
        { name: "HK", regex: new RegExp(`^(?=.*${includeTerms.HK})(?!.*${excludeTerms}).*$`, "i") },
        { name: "TW", regex: new RegExp(`^(?=.*${includeTerms.TW})(?!.*${excludeTerms}).*$`, "i") },
        { name: "SG", regex: new RegExp(`^(?=.*${includeTerms.SG})(?!.*${excludeTerms}).*$`, "i") },
        { name: "KR", regex: new RegExp(`^(?=.*${includeTerms.KR})(?!.*${excludeTerms}).*$`, "i") },
        { name: "US", regex: new RegExp(`^(?=.*${includeTerms.US})(?!.*${excludeTerms}).*$`, "i") },
        { name: "UK", regex: new RegExp(`^(?=.*${includeTerms.UK})(?!.*${excludeTerms}).*$`, "i") },
        { name: "FR", regex: new RegExp(`^(?=.*${includeTerms.FR})(?!.*${excludeTerms}).*$`, "i") },
        { name: "DE", regex: new RegExp(`^(?=.*${includeTerms.DE})(?!.*${excludeTerms}).*$`, "i") },
        { name: "ALL-COUNTRIES", regex: new RegExp(`^(?!.*(?:${allCountryTerms}|${excludeTerms})).*$`, "i") },
    */
        { name: "JP", regex: new RegExp(`^(?=.*${includeTerms.JP})(?!.*${excludeTerms}).*$`, "i") },
        { name: "HKSGTW", regex: new RegExp(`^(?=.*${includeTerms.HK}|${includeTerms.SG}|${includeTerms.TW})(?!.*${excludeTerms}).*$`, "i") },
        { name: "JPHKSGTW", regex: new RegExp(`^(?=.*${includeTerms.JP}|${includeTerms.HK}|${includeTerms.SG}|${includeTerms.TW})(?!.*${excludeTerms}).*$`, "i") },
        { name: "ALL", regex: new RegExp(`^((?!.*${excludeTerms}).)*$`, "i") },
    ];

    const autoProxyGroups = autoProxyGroupRegexs
        .map((item) => ({
            name: `AUTO | ${item.name}`,
            type: "url-test",
            url: "https://cp.cloudflare.com",
            interval: 300,
            tolerance: 50,
            proxies: getProxiesByRegex(config.proxies, item.regex),
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
        { name: "JP", regex: new RegExp(`^(?=.*${includeTerms.JP})(?!.*${excludeTerms}).*$`, "i") },
        { name: "HKSG", regex: new RegExp(`^(?=.*${includeTerms.HK}|${includeTerms.SG})(?!.*${excludeTerms}).*$`, "i") },
        { name: "JPHKSG", regex: new RegExp(`^(?=.*${includeTerms.JP}|${includeTerms.HK}|${includeTerms.SG})(?!.*${excludeTerms}).*$`, "i") },
        { name: "ALL", regex: new RegExp(`^((?!.*${excludeTerms}).)*$`, "i") },
    ];

    const loadBalanceBase = {
        type: "load-balance",
        url: "https://cp.cloudflare.com",
        interval: 300,
        hidden: true,
        "exclude-filter": "0.[0-9]",
    }
    const loadBalanceGroupsRoundRobin = loadBalanceGroupRegexs
        .map((item) => ({
            ...loadBalanceBase,
            name: `LOAD_BA_RR | ${item.name}`,
            proxies: getProxiesByRegex(config.proxies, item.regex),
            strategy: "round-robin",
        }))
        .filter((item) => item.proxies.length > 0);
    const loadBalanceGroupsConsistentHashing = loadBalanceGroupRegexs
        .map((item) => ({
            ...loadBalanceBase,
            name: `LOAD_BA_CH | ${item.name}`,
            proxies: getProxiesByRegex(config.proxies, item.regex),
            strategy: "consistent-hashing",
        }))
        .filter((item) => item.proxies.length > 0);
    const loadBalanceGroupsStickySession = loadBalanceGroupRegexs
        .map((item) => ({
            ...loadBalanceBase,
            name: `LOAD_BA_SS | ${item.name}`,
            proxies: getProxiesByRegex(config.proxies, item.regex),
            strategy: "sticky-sessions",
        }))
        .filter((item) => item.proxies.length > 0);
    const loadBalanceGroups = [
        ...loadBalanceGroupsRoundRobin,
        ...loadBalanceGroupsConsistentHashing,
        ...loadBalanceGroupsStickySession,
    ]

    const groups = [
        {
            name: "MANUAL",
            type: "select",
            proxies: [],
        },
    ];

    autoProxyGroups.length && groups[0].proxies.push(...autoProxyGroups.map((item) => item.name));
    loadBalanceGroups.length && groups[0].proxies.push(...loadBalanceGroups.map((item) => item.name));
    //autoProxyGroups.length && groups[0].proxies.push(...manualProxyGroups.map((item) => item.name));
    groups[0].proxies.push(...allProxies);
    groups.push(...autoProxyGroups);
    groups.push(...loadBalanceGroups);
    //groups.push(...manualProxyGroups);

    const proxyGroupBase = {
        "jpAutoFirst": {
            "type": "select",
            "proxies": [ "MANUAL", "CUSTOM", "DIRECT", "REJECT", ...groups[0].proxies ]
        },
        "manualFirst": {
            "type": "select",
            "proxies": [ "MANUAL", "CUSTOM", "DIRECT", "REJECT" ]
        },
        "directFirst": {
            "type": "select",
            "proxies": [ "DIRECT", "MANUAL", "CUSTOM", "REJECT" ]
        },
        "rejectFirst": {
            "type": "select",
            "proxies": [ "REJECT", "MANUAL", "CUSTOM", "DIRECT" ]
        },
    }
    const customProxyGroups = [
        {
            "name": "CUSTOM",
            "type": "select",
            "proxies": [ "MANUAL", "DIRECT", "REJECT", ...groups[0].proxies ]
        },
        // HOYO
        {
            ...proxyGroupBase.jpAutoFirst,
            "name": "HOYO_CN_PROXY",
            "proxies": [ "HOYO_PROXY", "HOYO_BYPASS" ],
        },
        { ...proxyGroupBase.directFirst, "name": "HOYO_BYPASS" },
        { ...proxyGroupBase.jpAutoFirst, "name": "HOYO_PROXY" },
        // BLOCK
        { ...proxyGroupBase.rejectFirst, "name": "MIUI_BLOATWARE" },
        { ...proxyGroupBase.rejectFirst, "name": "AD_BLOCK" },
        // CUSTOM
        { ...proxyGroupBase.directFirst, "name": "STEAM_CN" },
        { ...proxyGroupBase.jpAutoFirst, "name": "STEAM" },
        // CUSTOM_JP
        { ...proxyGroupBase.jpAutoFirst, "name": "PIXIV" },
        { ...proxyGroupBase.jpAutoFirst, "name": "AI" },
        { ...proxyGroupBase.jpAutoFirst, "name": "YOUTUBE" },
        { ...proxyGroupBase.jpAutoFirst, "name": "GOOGLE" },
        { ...proxyGroupBase.jpAutoFirst, "name": "TWITTER" },
        // PROXY
        { ...proxyGroupBase.jpAutoFirst, "name": "TELEGRAM" },
        { ...proxyGroupBase.jpAutoFirst, "name": "DISCORD" },
        { ...proxyGroupBase.jpAutoFirst, "name": "MICROSOFT" },
        { ...proxyGroupBase.jpAutoFirst, "name": "APPLE" },
        // BYPASS
        { ...proxyGroupBase.directFirst, "name": "BYPASS" },
        // CUSTOM_JP
        { ...proxyGroupBase.jpAutoFirst, "name": "JP_DOMAIN" },
        // FINAL
        { ...proxyGroupBase.manualFirst, "name": "FINAL" },
    ];
    groups.push(...customProxyGroups);

    config["proxy-groups"] = groups;
}

const dailerProxy = (config, proxies, dailer) => {
    let exitNode = JSON.parse(JSON.stringify(proxies))
    exitNode.forEach((e) => {
        e.name = `EXIT_NODE | ${e.name}`
    })
    config["proxy-providers"] = {
        "provider123": {
            type: "inline",
            override: {
                "dialer-proxy": dailer
            },
            payload: exitNode
        }
    }
    const autoProxyGroupRegexs = [
        { name: "JP_DIA", regex: new RegExp(`^(?=.*${includeTerms.JP}.*${includeTerms.DIA})(?!.*${excludeTerms}).*$`, "i") },
        { name: "JP", regex: new RegExp(`^(?=.*${includeTerms.JP})(?!.*${excludeTerms}).*$`, "i") },
        { name: "HKSGTW", regex: new RegExp(`^(?=.*${includeTerms.HK}|${includeTerms.SG}|${includeTerms.TW})(?!.*${excludeTerms}).*$`, "i") },
        { name: "JPHKSGTW", regex: new RegExp(`^(?=.*${includeTerms.JP}|${includeTerms.HK}|${includeTerms.SG}|${includeTerms.TW})(?!.*${excludeTerms}).*$`, "i") },
        { name: "ALL", regex: new RegExp(`^((?!.*${excludeTerms}).)*$`, "i") },
    ];
    const autoProxyGroups = autoProxyGroupRegexs
        .map((item) => ({
            name: `EXIT_NODE | AUTO | ${item.name}`,
            type: "url-test",
            url: "https://cp.cloudflare.com",
            interval: 300,
            tolerance: 50,
            filter: `${item.regex}`.replaceAll(/(\/i|\/)/g, ""),
            proxies: getProxiesByRegex(exitNode, item.regex),
            hidden: true,
        }))
        .filter((item) => item.proxies.length > 0);

   const loadBalanceGroupRegexs = [
        { name: "JP_DIA", regex: new RegExp(`^(?=.*${includeTerms.JP}.*${includeTerms.DIA})(?!.*${excludeTerms}).*$`, "i") },
        { name: "JP", regex: new RegExp(`^(?=.*${includeTerms.JP})(?!.*${excludeTerms}).*$`, "i") },
        { name: "HKSG", regex: new RegExp(`^(?=.*${includeTerms.HK}|${includeTerms.SG})(?!.*${excludeTerms}).*$`, "i") },
        { name: "JPHKSG", regex: new RegExp(`^(?=.*${includeTerms.JP}|${includeTerms.HK}|${includeTerms.SG})(?!.*${excludeTerms}).*$`, "i") },
        { name: "ALL", regex: new RegExp(`^((?!.*${excludeTerms}).)*$`, "i") },
    ];
    const loadBalanceBase = {
        type: "load-balance",
        url: "https://cp.cloudflare.com",
        interval: 300,
        hidden: true,
        "exclude-filter": "0.[0-9]",
    }
    const loadBalanceGroupsRoundRobin = loadBalanceGroupRegexs
        .map((item) => ({
            ...loadBalanceBase,
            name: `EXIT_NODE | LOAD_BA_RR | ${item.name}`,
            filter: `${item.regex}`.replaceAll(/(\/i|\/)/g, ""),
            proxies: getProxiesByRegex(exitNode, item.regex),
            strategy: "round-robin",
        }))
        .filter((item) => item.proxies.length > 0);
    const loadBalanceGroupsConsistentHashing = loadBalanceGroupRegexs
        .map((item) => ({
            ...loadBalanceBase,
            name: `EXIT_NODE | LOAD_BA_CH | ${item.name}`,
            filter: `${item.regex}`.replaceAll(/(\/i|\/)/g, ""),
            proxies: getProxiesByRegex(exitNode, item.regex),
            strategy: "consistent-hashing",
        }))
        .filter((item) => item.proxies.length > 0);
    const loadBalanceGroupsStickySession = loadBalanceGroupRegexs
        .map((item) => ({
            ...loadBalanceBase,
            name: `EXIT_NODE | LOAD_BA_SS | ${item.name}`,
            filter: `${item.regex}`.replaceAll(/(\/i|\/)/g, ""),
            proxies: getProxiesByRegex(exitNode, item.regex),
            strategy: "sticky-sessions",
        }))
        .filter((item) => item.proxies.length > 0);
    const loadBalanceGroups = [
        ...loadBalanceGroupsRoundRobin,
        ...loadBalanceGroupsConsistentHashing,
        ...loadBalanceGroupsStickySession,
    ]

    const relayProxyGroups = [
        {
            "name": "RELAY",
            "type": "select",
            "proxies": [],
            "exclude-filter": "剩余|到期|主页|官网|游戏|关注|网站|地址|有效|网址|禁止|邮箱|发布|客服|订阅|节点|问题|联系",
        }
    ]
    autoProxyGroups.length && relayProxyGroups[0].proxies.push(...autoProxyGroups.map((item) => item.name));
    loadBalanceGroups.length && relayProxyGroups[0].proxies.push(...loadBalanceGroups.map((item) => item.name));
    relayProxyGroups.push(...autoProxyGroups);
    relayProxyGroups.push(...loadBalanceGroups);
    relayProxyGroups.forEach((e) => {
        e.use = ["provider123"];
        if (e.name == "RELAY") return
        e.proxies = [];
    })

    config["proxy-groups"].forEach((e) => {
        if (!e.hidden && !e.proxies.includes(relayProxyGroups[0].name) && e.name!=dailer) e.proxies.unshift(relayProxyGroups[0].name);
    })
    config["proxy-groups"].unshift(...relayProxyGroups);
}

const generateIconUrl = (name) => {
    return `https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/icon/color/${name}.png`
}

const setProxyGroupIcon = (config) => {
    const iconUrls = {
        RELAY: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Noto_Emoji_v2.034_1f517.svg",
        MANUAL: generateIconUrl("manual"),
        CUSTOM: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Noto_Emoji_v2.034_1f537.svg",
        HOYO_CN_PROXY: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://hoyoverse.com&size=256",
        HOYO_BYPASS: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://hoyoverse.com&size=256",
        HOYO_PROXY: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://hoyoverse.com&size=256",
        MIUI_BLOATWARE: "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.mi.com/&size=256",
        AD_BLOCK: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Codex_icon_Block_red.svg",
        STEAM_CN: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
        STEAM: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
        PIXIV: "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://pixiv.net&size=256",
        AI: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://chatgpt.com&size=256",
        YOUTUBE: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://youtube.com&size=256",
        GOOGLE: "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=256",
        TWITTER: "https://upload.wikimedia.org/wikipedia/commons/2/20/Coast_twitter.png",
        TELEGRAM: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Telegram_blue_icon.png/2000px-Telegram_blue_icon.png",
        DISCORD: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://discord.app&size=256",
        MICROSOFT: "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://microsoft.com&size=256",
        APPLE: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/AppleComputerLogorainbowBerdaiOthmaneCA.png/2000px-AppleComputerLogorainbowBerdaiOthmaneCA.png",
        BYPASS: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Noto_Emoji_v2.034_2b50.svg",
        JP_DOMAIN: "https://upload.wikimedia.org/wikipedia/commons/5/54/Noto_Emoji_v2.034_1f338.svg",
        FINAL: generateIconUrl("final"),
    }
    config["proxy-groups"].forEach((e) => {
        if (!e.hidden) e.icon = iconUrls[e.name]
    })
}

// 以下代码源自
// https://github.com/clash-verge-rev/clash-verge-rev/discussions/2053#discussion-7518652
function removeProxyByRegex(config, regex) {
    config.proxies = config.proxies.filter((e) => !e.name.match(regex));
    config['proxy-groups'] = config['proxy-groups'].map((e) => {
        e.proxies = e.proxies.filter((name) => !name.match(regex));
    });
}

const test = () => {
    module.exports = { main }
};
//test()
