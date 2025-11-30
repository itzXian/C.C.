const ruleProvidersBase = {
  "type": "http",
  "format": "text",
  "interval": "3600",
};
const ruleProvidersBaseClassical = {
  ...ruleProvidersBase,
  "behavior": "classical",
};
const ruleProvidersBaseDomain = {
  ...ruleProvidersBase,
  "behavior": "domain",
};
const ruleProvidersBaseIpcodr = {
  ...ruleProvidersBase,
  "behavior": "ipcidr",
};

const proxyGroupsBase = {
    "asiaAutoFirst": {
        "type": "select",
        "proxies": [ "HK-AUTO", "TW-AUTO", "JP-AUTO", "KR-AUTO", "SG-AUTO", "AUTO", "MANUAL", "DIRECT", "REJECT" ]
    },
    "jpAutoFirst": {
        "type": "select",
        "proxies": [ "JP-AUTO", "AUTO", "MANUAL", "DIRECT", "REJECT" ]
    },
    "autoFirst": {
        "type": "select",
        "proxies": [ "AUTO", "MANUAL", "DIRECT", "REJECT" ]
    },
    "manualFirst": {
        "type": "select",
        "proxies": [ "MANUAL", "AUTO", "DIRECT", "REJECT" ]
    },
    "directFirst": {
        "type": "select",
        "proxies": [ "DIRECT", "AUTO", "MANUAL", "REJECT" ]
    },
    "rejectFirst": {
        "type": "select",
        "proxies": [ "REJECT", "AUTO", "MANUAL", "DIRECT" ]
    },
}

const prependProxyGroups = [
// HOYO
   {
    ...proxyGroupsBase.asiaAutoFirst,
    "name": "HOYO_CN_PROXY",
    "include-all": true,
    "proxies": [ "HOYO_PROXY", "HOYO_BYPASS" ]
  },
  {
    ...proxyGroupsBase.asiaAutoFirst,
    "name": "HOYO_PROXY",
    "include-all": true,
  },
  {
    ...proxyGroupsBase.directFirst,
    "name": "HOYO_BYPASS",
  },
// BLOCK
 {
    ...proxyGroupsBase.rejectFirst,
    "name": "MIUI_BLOATWARE",
  },
  {
    ...proxyGroupsBase.rejectFirst,
    "name": "AD_BLOCK",
  },
// BYPASS
  {
    ...proxyGroupsBase.directFirst,
    "name": "BYPASS",
  },
// CUSTOM
/* Use port 443 instead
  {
    ...proxyGroupsBase.directFirst,
    "name": "GITHUB_SSH",
  },
*/
  {
    ...proxyGroupsBase.autoFirst,
    "name": "PIXIV",
  },
// CUSTOM_JP
  {
    ...proxyGroupsBase.jpAutoFirst,
    "name": "GITHUB",
  },
  {
    ...proxyGroupsBase.jpAutoFirst,
    "name": "JP_DOMAIN",
    "include-all": true,
    "filter": "JP|日本",
  },
  {
    ...proxyGroupsBase.jpAutoFirst,
    "name": "AI",
  },
  {
    ...proxyGroupsBase.jpAutoFirst,
    "name": "GOOGLE_CN_PROXY",
  },
  {
    ...proxyGroupsBase.jpAutoFirst,
    "name": "GOOGLE",
  },
  {
    ...proxyGroupsBase.jpAutoFirst,
    "name": "YOUTUBE",
  },
  {
    ...proxyGroupsBase.jpAutoFirst,
    "name": "TWITTER",
  },
  {
    ...proxyGroupsBase.jpAutoFirst,
    "name": "TELEGRAM",
  },
  {
    ...proxyGroupsBase.jpAutoFirst,
    "name": "DISCORD",
  },
// PROXY
  {
    ...proxyGroupsBase.autoFirst,
    "name": "MS",
  },
  {
    ...proxyGroupsBase.autoFirst,
    "name": "APPLE",
  },
// FINAL
  {
    ...proxyGroupsBase.manualFirst,
    "name": "FINAL"
  },
];

const ruleProviders = {
// HOYO
  Hoyo_CN_Proxy: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/Hoyo_CN_Proxy.list",
    "path": "./Hoyo_CN_Proxy.list"
  },
  Hoyo_Proxy: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/Hoyo_Proxy.list",
    "path": "./Hoyo_Proxy.list"
  },
  Hoyo_Bypass: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/Hoyo_Bypass.list",
    "path": "./Hoyo_Bypass.list"
  },
// BLOCK
  MIUI_Bloatware: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/MIUI_Bloatware.list",
    "path": "./MIUI_Bloatware.yaml"
  },
  Block: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/Block.list",
    "path": "./Block.list"
  },
  BanAD: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanAD.list",
    "path": "./BanAD.list"
  },
  BanEasyList: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyList.list",
    "path": "./BanEasyList.list"
  },
  BanEasyListChina: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyListChina.list",
    "path": "./BanEasyListChina.list"
  },
  BanEasyPrivacy: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanEasyPrivacy.list",
    "path": "./BanEasyPrivacy.list"
  },
  BanProgramAD: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanProgramAD.list",
    "path": "./BanProgramAD.list"
  },
// BYPASS
  Bypass: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/Bypass.list",
    "path": "./Bypass.list"
  },
  ChinaCompanyIp: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/refs/heads/master/Clash/ChinaCompanyIp.list",
    "path": "./ChinaCompanyIp.list"
  },
  ChinaDomain: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/refs/heads/master/Clash/ChinaDomain.list",
    "path": "./ChinaDomain.list"
  },
  ChinaMedia: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/refs/heads/master/Clash/ChinaMedia.list",
    "path": "./ChinaMedia.list"
  },
  ChinaIp: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/refs/heads/master/Clash/ChinaIp.list",
    "path": "./ChinaIp.list"
  },
  ChinaIpV6: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/refs/heads/master/Clash/ChinaIpV6.list",
    "path": "./ChinaIpV6.list"
  },
  LocalAreaNetwork: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/refs/heads/master/Clash/LocalAreaNetwork.list",
    "path": "./LocalAreaNetwork.list"
  },
// CUSTOM
  Pixiv: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Pixiv/Pixiv.list",
    "path": "./Pixiv.list"
  },
// CUSTOM_JP
  GitHub: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/GitHub/GitHub.list",
    "path": "./GitHub.list"
  },
  JP: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/itzXian/C.C./refs/heads/master/Ruleset/JP.list",
    "path": "./JP.list"
  },
  AI: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/refs/heads/master/Clash/Ruleset/AI.list",
    "path": "./AI.list"
  },
  GoogleCNProxyIP: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/refs/heads/master/Clash/Ruleset/GoogleCNProxyIP.list",
    "path": "./GoogleCNProxyIP.list"
  },
  Google: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Google/Google.list",
    "path": "./Google.list"
  },
  YouTube: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/YouTube/YouTube.list",
    "path": "./YouTube.list"
  },
  Twitter: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Twitter/Twitter.list",
    "path": "./Twitter.list"
  },
  Telegram: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Telegram/Telegram.list",
    "path": "./Telegram.list"
  },
  Discord: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Discord/Discord.list",
    "path": "./Discord.list"
  },
// PROXY
  Microsoft: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/refs/heads/master/Clash/Ruleset/Microsoft.list",
    "path": "./Microsoft.list"
  },
  Apple: {
    ...ruleProvidersBaseClassical,
    "url": "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/refs/heads/master/Clash/Ruleset/Apple.list",
    "path": "./Apple.list"
  },
}

const prependRule = [
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
  "RULE-SET,ChinaCompanyIp,BYPASS",
  "RULE-SET,ChinaDomain,BYPASS",
  "RULE-SET,ChinaMedia,BYPASS",
  "RULE-SET,ChinaIp,BYPASS",
  "RULE-SET,ChinaIpV6,BYPASS",
  //"GEOIP,CN,BYPASS",
// CUSTOM_JP(BEFORE FINAL)
  // GEOIP cause slow connection
  //"GEOIP,JP,JP_DOMAIN",
// FINAL
  "MATCH,FINAL",
];

// 以下代码参照
// https://www.clashverge.dev/guide/script.html
function main(config) {
  if (!config.proxies) return config;
  overwriteProxyGroups(config);

  //let oldRules = config["rules"];
  config["rules"] = prependRule//.concat(oldRules);

  let oldProxyGroups = config["proxy-groups"];
  config["proxy-groups"] = oldProxyGroups.concat(prependProxyGroups);

  Object.assign(config, {
    "rule-providers": ruleProviders
  });

  removeNodeByName(config, /.*(剩余|到期|主页|官网|游戏|关注|网站|地址|有效|网址|禁止|邮箱|发布|客服|订阅|节点|问题|联系).*/g);

  return config;
}

// 以下代码源自
// https://github.com/yyhhyyyyyy/selfproxy/blob/cb1470d2a321051573d3ecc902a692173b9dd787/Mihomo/Extension_Script/script.js#L499

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
            name: "ALL-COUNTRIES-AUTO",
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
        },
        {
            name: "JP",
            regex: new RegExp(`^(?=.*${includeTerms.JP})(?!.*${excludeTerms}).*$`, "i"),
        },
        {
            name: "KR",
            regex: new RegExp(`^(?=.*${includeTerms.KR})(?!.*${excludeTerms}).*$`, "i"),
        },
        {
            name: "SG",
            regex: new RegExp(`^(?=.*${includeTerms.SG})(?!.*${excludeTerms}).*$`, "i"),
        },
        {
            name: "US",
            regex: new RegExp(`^(?=.*${includeTerms.US})(?!.*${excludeTerms}).*$`, "i"),
        },
        {
            name: "UK",
            regex: new RegExp(`^(?=.*${includeTerms.UK})(?!.*${excludeTerms}).*$`, "i"),
        },
        {
            name: "FR",
            regex: new RegExp(`^(?=.*${includeTerms.FR})(?!.*${excludeTerms}).*$`, "i"),
        },
        {
            name: "DE",
            regex: new RegExp(`^(?=.*${includeTerms.DE})(?!.*${excludeTerms}).*$`, "i"),
        },
        {
            name: "TW",
            regex: new RegExp(`^(?=.*${includeTerms.TW})(?!.*${excludeTerms}).*$`, "i"),
        }
    ];

    const manualProxyGroupsConfig = manualProxyGroups
        .map((item) => ({
            name: item.name,
            type: "select",
            proxies: getManualProxiesByRegex(config, item.regex),
            icon: item.icon,
            //hidden: false,
            hidden: true,
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
            //proxies: ["HK", "JP", "KR", "SG", "US", "UK", "FR", "DE", "TW"],
            proxies: [ "HK-AUTO", "TW-AUTO", "JP-AUTO", "KR-AUTO", "SG-AUTO", "AUTO", "LOAD-BALANCING", "DIRECT" ],
        },
        {
            name: "AUTO",
            type: "select",
            proxies: ["ALL-AUTO"],
            hidden: true,
        },
        {
            name: "LOAD-BALANCING",
            type: "load-balance",
            url: "https://cp.cloudflare.com",
            interval: 300,
            strategy: loadBalanceStrategy,
            proxies: allProxies,
            hidden: true,
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

    config["proxy-groups"] = groups;

// 原配置基础上追加而非覆盖
/***
    let oldProxyGroups = config["proxy-groups"];
    oldProxyGroups[0].proxies.unshift('AUTO', 'MANUAL', 'LOAD-BALANCING');
    config["proxy-groups"] = oldProxyGroups.concat(groups);
***/
}
function getProxiesByRegex(params, regex) {
    const matchedProxies = params.proxies.filter((e) => regex.test(e.name)).map((e) => e.name);
    return matchedProxies.length > 0 ? matchedProxies: ["COMPATIBLE"];
}
function getManualProxiesByRegex(params, regex) {
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
