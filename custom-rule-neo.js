const ruleProvidersBase = {
    "type": "http",
    "format": "text",
    "interval": "3600",
};
const ruleProviders = {
  MIUI_Bloatware : {
    ...ruleProvidersBase,
    "behavior": "classical",
    "url": "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/MIUI_Bloatware.list",
    "path": "./MIUI_Bloatware.yaml"
  },
  Block : {
    ...ruleProvidersBase,
    "behavior": "classical",
    "url" : "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Block.list",
    "path" : "./Block.list"
  },
  BanAD : {
    ...ruleProvidersBase,
    "behavior": "classical",
    "url" : "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanAD.list",
    "path" : "./BanAD.list"
  },
  BanEasyList : {
    ...ruleProvidersBase,
    "behavior": "classical",
    "url" : "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyList.list",
    "path" : "./BanEasyList.list"
  },
  BanEasyListChina : {
    ...ruleProvidersBase,
    "behavior": "classical",
    "url" : "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyListChina.list",
    "path" : "./BanEasyListChina.list"
  },
  BanEasyPrivacy : {
    ...ruleProvidersBase,
    "behavior": "classical",
    "url" : "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyPrivacy.list",
    "path" : "./BanEasyPrivacy.list"
  },
  BanProgramAD : {
    ...ruleProvidersBase,
    "behavior": "classical",
    "url" : "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanProgramAD.list",
    "path" : "./BanProgramAD.list"
  },
  JP : {
    ...ruleProvidersBase,
    "behavior": "classical",
    "url" : "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/JP.list",
    "path" : "./JP.list"
  },
  Bypass : {
    ...ruleProvidersBase,
    "behavior": "classical",
    "url" : "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Bypass.list",
    "path" : "./Bypass.list"
  },
  AI : {
    ...ruleProvidersBase,
    "behavior": "classical",
    "url" : "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/refs/heads/master/Clash/Ruleset/AI.list",
    "path" : "./AI.list"
  },
}

const prependProxyGroups = [
  {
    "name" : "MIUI_BLOATWARE",
    "type" : "select",
    "proxies" : [ "REJECT", "DIRECT" ]
  },
  {
    "name" : "AD_BLOCK",
    "type" : "select",
    "proxies" : [ "REJECT", "DIRECT" ]
  },
  {
    "name" : "JP_DOMAIN",
    "type" : "select",
    "include-all": true,
    "filter" : "JP|日本",
    "proxies" : [ "JP-AUTO", "JP", "DIRECT", "MANUAL", "AUTO", "REJECT"  ]
  },
  {
    "name" : "BYPASS",
    "type" : "select",
    "include-all": true,
    "proxies" : [ "DIRECT", "MANUAL", "AUTO", "REJECT" ]
  },
  {
    "name" : "AI",
    "type" : "select",
    "include-all": true,
    "proxies" : [ "JP-AUTO", "JP", "DIRECT", "MANUAL", "AUTO", "REJECT"  ]
  },
];
const prependRule = [
  "RULE-SET,MIUI_Bloatware,MIUI_BLOATWARE",
  "RULE-SET,Block,AD_BLOCK",
  "RULE-SET,BanAD,AD_BLOCK",
  "RULE-SET,BanEasyList,AD_BLOCK",
  "RULE-SET,BanEasyListChina,AD_BLOCK",
  "RULE-SET,BanEasyPrivacy,AD_BLOCK",
  "RULE-SET,BanProgramAD,AD_BLOCK",
  "RULE-SET,JP,JP_DOMAIN",
  "RULE-SET,Bypass,BYPASS",
];

function main(config) {
    if (!config.proxies) return config;
    overwriteProxyGroups(config);

  let oldRules = config["rules"];
  config["rules"] = prependRule.concat(oldRules);

  let oldProxyGroups = config["proxy-groups"];
  config["proxy-groups"] = prependProxyGroups.concat(oldProxyGroups);

  Object.assign(config, {
    "rule-providers": ruleProviders
  });

  return config;
}

// 以下代码来自
// https://github.com/yyhhyyyyyy/selfproxy/blob/cb1470d2a321051573d3ecc902a692173b9dd787/Mihomo/Extension_Script/script.js#L499

// 覆写代理组
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
        { name: "HK-AUTO", regex: new RegExp(`^(?=.*${includeTerms.HK})(?!.*${excludeTerms}).*$`, "i") },
        { name: "TW-AUTO", regex: new RegExp(`^(?=.*${includeTerms.TW})(?!.*${excludeTerms}).*$`, "i") },
        { name: "SG-AUTO", regex: new RegExp(`^(?=.*${includeTerms.SG})(?!.*${excludeTerms}).*$`, "i") },
        { name: "JP-AUTO", regex: new RegExp(`^(?=.*${includeTerms.JP})(?!.*${excludeTerms}).*$`, "i") },
        { name: "KR-AUTO", regex: new RegExp(`^(?=.*${includeTerms.KR})(?!.*${excludeTerms}).*$`, "i") },
        { name: "US-AUTO", regex: new RegExp(`^(?=.*${includeTerms.US})(?!.*${excludeTerms}).*$`, "i") },
        { name: "UK-AUTO", regex: new RegExp(`^(?=.*${includeTerms.UK})(?!.*${excludeTerms}).*$`, "i") },
        { name: "FR-AUTO", regex: new RegExp(`^(?=.*${includeTerms.FR})(?!.*${excludeTerms}).*$`, "i") },
        { name: "DE-AUTO", regex: new RegExp(`^(?=.*${includeTerms.DE})(?!.*${excludeTerms}).*$`, "i") },
        {
            name: "其它-AUTO",
            regex: new RegExp(`^(?!.*(?:${allCountryTerms}|${excludeTerms})).*$`, "i")
        }
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
    const manualProxyGroups = [
        {
            name: "HK",
            regex: new RegExp(`^(?=.*${includeTerms.HK})(?!.*${excludeTerms}).*$`, "i"),
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/HK.png"
        },
        {
            name: "JP",
            regex: new RegExp(`^(?=.*${includeTerms.JP})(?!.*${excludeTerms}).*$`, "i"),
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/JP.png"
        },
        {
            name: "KR",
            regex: new RegExp(`^(?=.*${includeTerms.KR})(?!.*${excludeTerms}).*$`, "i"),
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/KR.png"
        },
        {
            name: "SG",
            regex: new RegExp(`^(?=.*${includeTerms.SG})(?!.*${excludeTerms}).*$`, "i"),
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/SG.png"
        },
        {
            name: "US",
            regex: new RegExp(`^(?=.*${includeTerms.US})(?!.*${excludeTerms}).*$`, "i"),
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/US.png"
        },
        {
            name: "UK",
            regex: new RegExp(`^(?=.*${includeTerms.UK})(?!.*${excludeTerms}).*$`, "i"),
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/UK.png"
        },
        {
            name: "FR",
            regex: new RegExp(`^(?=.*${includeTerms.FR})(?!.*${excludeTerms}).*$`, "i"),
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/FR.png"
        },
        {
            name: "DE",
            regex: new RegExp(`^(?=.*${includeTerms.DE})(?!.*${excludeTerms}).*$`, "i"),
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/DE.png"
        },
        {
            name: "TW",
            regex: new RegExp(`^(?=.*${includeTerms.TW})(?!.*${excludeTerms}).*$`, "i"),
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/TW.png"
        }
    ];

    const manualProxyGroupsConfig = manualProxyGroups
        .map((item) => ({
            name: item.name,
            type: "select",
            proxies: getManualProxiesByRegex(config, item.regex),
            icon: item.icon,
            hidden: false,
        }))
        .filter((item) => item.proxies.length > 0);

    // 负载均衡策略
    // 可选值：round-robin / consistent-hashing / sticky-sessions
    // round-robin：轮询 按顺序循环使用代理列表中的节点
    // consistent-hashing：散列 根据请求的哈希值将请求分配到固定的节点
    // sticky-sessions：缓存 对「你的设备IP + 目标地址」组合计算哈希值，根据哈希值将请求分配到固定的节点 缓存 10 分钟过期
    // 默认值：consistent-hashing
    const loadBalanceStrategy = "consistent-hashing";

    const groups = [
        {
            name: "MANUAL",
            type: "select",
            "include-all": true,
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Cylink.png",
            proxies: ["HK", "JP", "KR", "SG", "US", "UK", "FR", "DE", "TW"],
        },
        {
            name: "AUTO",
            type: "select",
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Urltest.png",
            proxies: ["ALL-AUTO"],
        },
        {
            name: "LOAD-BALANCING",
            type: "load-balance",
            url: "https://cp.cloudflare.com",
            interval: 300,
            strategy: loadBalanceStrategy,
            proxies: allProxies,
            icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Color/Available.png"
        },
        {
            name: "ALL-AUTO",
            type: "url-test",
            url: "https://cp.cloudflare.com",
            interval: 300,
            tolerance: 50,
            proxies: allProxies,
            hidden: true,
        },
    ];

    autoProxyGroups.length &&
        // groups[1].proxies.unshift(...autoProxyGroups.map((item) => item.name));
        groups[1].proxies.push(...autoProxyGroups.map((item) => item.name));
    groups.push(...autoProxyGroups);
    groups.push(...manualProxyGroupsConfig);
    // config["proxy-groups"] = groups;
    let oldProxyGroups = config["proxy-groups"];
    oldProxyGroups[0].proxies.unshift('AUTO');
    config["proxy-groups"] = oldProxyGroups.concat(groups);
}
function getProxiesByRegex(params, regex) {
    const matchedProxies = params.proxies.filter((e) => regex.test(e.name)).map((e) => e.name);
    return matchedProxies.length > 0 ? matchedProxies : ["COMPATIBLE"];
}
function getManualProxiesByRegex(params, regex) {
    const matchedProxies = params.proxies.filter((e) => regex.test(e.name)).map((e) => e.name);
    return matchedProxies.length > 0 ? matchedProxies : ["COMPATIBLE"];
}
