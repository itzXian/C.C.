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
  }
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
    "proxies" : [ "🚀 手动切换", "♻️ 自动选择", "🇯🇵 日本", "DIRECT" ]
  },
  {
    "name" : "BYPASS",
    "type" : "select",
    "include-all": true,
    "filter" : "-1x",
    "proxies" : [ "DIRECT", "🚀 手动切换", "♻️ 自动选择", "REJECT" ]
  },
];
const prependRule = [
  "DOMAIN-SUFFIX,clashverge.dev,♻️ 自动选择",
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
  let oldRules = config["rules"];
  config["rules"] = prependRule.concat(oldRules);

  let oldProxyGroups = config["proxy-groups"];
  config["proxy-groups"] = prependProxyGroups.concat(oldProxyGroups);

  Object.assign(config, {
    "rule-providers": ruleProviders
  });

  return config;
}
