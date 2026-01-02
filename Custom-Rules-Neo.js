// 以下代码参照
// https://www.clashverge.dev/guide/script.html
const main = (config) => {
    if (!config.proxies) return config;
    //removeProxyByRegex(config, /^((?!专线).)*$/);
    overrideBasicOptions(config);
    overrideDns(config);
    overrideFakeIpFilter(config);
    overrideNameserverPolicy(config);
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
    ruleProviderConfig.Text = {
        ...ruleProviderConfig,
        "format": "text",
    };
    ruleProviderConfig.Yaml = {
        ...ruleProviderConfig,
        "format": "yaml",
    };
    const ruleProviderBase = {
        Classical: {
            ...ruleProviderConfig.Text,
            "behavior": "classical",
        },
        Domain: {
            ...ruleProviderConfig.Text,
            "behavior": "domain",
        },
        Ipcodr: {
            ...ruleProviderConfig.Text,
            "behavior": "ipcidr",
        },
        ClassicalYaml: {
            ...ruleProviderConfig.Yaml,
            "behavior": "classical",
        },
        DomainYaml: {
            ...ruleProviderConfig.Yaml,
            "behavior": "domain",
        },
        IpcodrYaml: {
            ...ruleProviderConfig.Yaml,
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
    "DOMAIN,steamserver.net,STEAM_CN",
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
// https://github.com/yyhhyyyyyy/selfproxy/blob/cb1470d2a321051573d3ecc902a692173b9dd787/Mihomo/Extension_Script/script.js#L499

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
    const dnsList = [
        "https://doh.pub/dns-query",
        "https://dns.alidns.com/dns-query",
    ];

    const proxyDnsList = [
        "https://doh.pub/dns-query",
        "https://dns.google/dns-query",
        "https://cloudflare-dns.com/dns-query",
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
    config.dns = { ...dnsOptions };
}

// 覆写DNS.Fake IP Filter
const overrideFakeIpFilter  = (config) => {
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
    config.dns["fake-ip-filter"] = fakeIpFilter;
}

// 覆写DNS.Nameserver Policy
const overrideNameserverPolicy  = (config) => {
    const nameserverPolicy = {
        "dns.alidns.com": "quic://223.5.5.5:853",
        "dot.pub": "119.29.29.29",
        "doh.pub": "119.29.29.29",
        "dns.pub": "119.29.29.29",
        "doh.360.cn": "101.198.198.198",
        "+.uc.cn": "quic://dns.alidns.com:853",
        "+.alibaba.com": "quic://dns.alidns.com:853",
        "*.alicdn.com": "quic://dns.alidns.com:853",
        "*.ialicdn.com": "quic://dns.alidns.com:853",
        "*.myalicdn.com": "quic://dns.alidns.com:853",
        "*.alidns.com": "quic://dns.alidns.com:853",
        "*.aliimg.com": "quic://dns.alidns.com:853",
        "+.aliyun.com": "quic://dns.alidns.com:853",
        "*.aliyuncs.com": "quic://dns.alidns.com:853",
        "*.alikunlun.com": "quic://dns.alidns.com:853",
        "*.alikunlun.net": "quic://dns.alidns.com:853",
        "*.cdngslb.com": "quic://dns.alidns.com:853",
        "+.alipay.com": "quic://dns.alidns.com:853",
        "+.alipay.cn": "quic://dns.alidns.com:853",
        "+.alipay.com.cn": "quic://dns.alidns.com:853",
        "+.alipaydev.com": "quic://dns.alidns.com:853",
        "*.alipayobjects.com": "quic://dns.alidns.com:853",
        "+.alibaba-inc.com": "quic://dns.alidns.com:853",
        "*.alibabausercontent.com": "quic://dns.alidns.com:853",
        "*.alibabadns.com": "quic://dns.alidns.com:853",
        "+.alibabachengdun.com": "quic://dns.alidns.com:853",
        "+.alicloudccp.com": "quic://dns.alidns.com:853",
        "+.alipan.com": "quic://dns.alidns.com:853",
        "+.aliyundrive.com": "quic://dns.alidns.com:853",
        "+.aliyundrive.net": "quic://dns.alidns.com:853",
        "+.alimama.com": "quic://dns.alidns.com:853",
        "+.cainiao.com": "quic://dns.alidns.com:853",
        "+.cainiao.com.cn": "quic://dns.alidns.com:853",
        "+.cainiaoyizhan.com": "quic://dns.alidns.com:853",
        "+.guoguo-app.com": "quic://dns.alidns.com:853",
        "+.etao.com": "quic://dns.alidns.com:853",
        "+.yitao.com": "quic://dns.alidns.com:853",
        "+.1688.com": "quic://dns.alidns.com:853",
        "+.amap.com": "quic://dns.alidns.com:853",
        "+.gaode.com": "quic://dns.alidns.com:853",
        "+.autonavi.com": "quic://dns.alidns.com:853",
        "+.dingtalk.com": "quic://dns.alidns.com:853",
        "+.mxhichina.com": "quic://dns.alidns.com:853",
        "+.soku.com": "quic://dns.alidns.com:853",
        "+.tb.cn": "quic://dns.alidns.com:853",
        "*.tbcdn.cn": "quic://dns.alidns.com:853",
        "+.taobao.com": "quic://dns.alidns.com:853",
        "+.taobao.org": "quic://dns.alidns.com:853",
        "*.taobaocdn.com": "quic://dns.alidns.com:853",
        "*.tbcache.com": "quic://dns.alidns.com:853",
        "+.tmall.com": "quic://dns.alidns.com:853",
        "+.goofish.com": "quic://dns.alidns.com:853",
        "+.xiami.com": "quic://dns.alidns.com:853",
        "+.xiami.net": "quic://dns.alidns.com:853",
        "*.ykimg.com": "quic://dns.alidns.com:853",
        "+.youku.com": "quic://dns.alidns.com:853",
        "+.tudou.com": "quic://dns.alidns.com:853",
        "*.cibntv.net": "quic://dns.alidns.com:853",
        "+.ele.me": "quic://dns.alidns.com:853",
        "*.elemecdn.com": "quic://dns.alidns.com:853",
        "+.feizhu.com": "quic://dns.alidns.com:853",
        "+.taopiaopiao.com": "quic://dns.alidns.com:853",
        "+.fliggy.com": "quic://dns.alidns.com:853",
        "+.alibtrip.com": "quic://dns.alidns.com:853",
        "+.koubei.com": "quic://dns.alidns.com:853",
        "+.mybank.cn": "quic://dns.alidns.com:853",
        "+.mmstat.com": "quic://dns.alidns.com:853",
        "+.uczzd.cn": "quic://dns.alidns.com:853",
        "+.iconfont.cn": "quic://dns.alidns.com:853",
        "+.freshhema.com": "quic://dns.alidns.com:853",
        "+.freshippo.com": "quic://dns.alidns.com:853",
        "+.hemamax.com": "quic://dns.alidns.com:853",
        "+.hemaos.com": "quic://dns.alidns.com:853",
        "+.hemashare.cn": "quic://dns.alidns.com:853",
        "+.shyhhema.com": "quic://dns.alidns.com:853",
        "+.sm.cn": "quic://dns.alidns.com:853",
        "+.npmmirror.com": "quic://dns.alidns.com:853",
        "+.alios.cn": "quic://dns.alidns.com:853",
        "+.wandoujia.com": "quic://dns.alidns.com:853",
        "+.9game.cn": "quic://dns.alidns.com:853",
        "+.aligames.com": "quic://dns.alidns.com:853",
        "+.25pp.com": "quic://dns.alidns.com:853",
        "*.aliapp.org": "quic://dns.alidns.com:853",
        "+.tanx.com": "quic://dns.alidns.com:853",
        "+.hellobike.com": "quic://dns.alidns.com:853",
        "*.hichina.com": "quic://dns.alidns.com:853",
        "*.yunos.com": "quic://dns.alidns.com:853",
        "*.nlark.com": "quic://dns.alidns.com:853",
        "*.yuque.com": "quic://dns.alidns.com:853",
        "upos-sz-mirrorali.bilivideo.com": "quic://dns.alidns.com:853",
        "upos-sz-estgoss.bilivideo.com": "quic://dns.alidns.com:853",
        "ali-safety-video.acfun.cn": "quic://dns.alidns.com:853",
        "*.qcloud.com": "https://doh.pub/dns-query",
        "*.gtimg.cn": "https://doh.pub/dns-query",
        "*.gtimg.com": "https://doh.pub/dns-query",
        "*.gtimg.com.cn": "https://doh.pub/dns-query",
        "*.gdtimg.com": "https://doh.pub/dns-query",
        "*.idqqimg.com": "https://doh.pub/dns-query",
        "*.udqqimg.com": "https://doh.pub/dns-query",
        "*.igamecj.com": "https://doh.pub/dns-query",
        "+.myapp.com": "https://doh.pub/dns-query",
        "*.myqcloud.com": "https://doh.pub/dns-query",
        "+.dnspod.com": "https://doh.pub/dns-query",
        "*.qpic.cn": "https://doh.pub/dns-query",
        "*.qlogo.cn": "https://doh.pub/dns-query",
        "+.qq.com": "https://doh.pub/dns-query",
        "+.qq.com.cn": "https://doh.pub/dns-query",
        "*.qqmail.com": "https://doh.pub/dns-query",
        "+.qzone.com": "https://doh.pub/dns-query",
        "+.tencent-cloud.cn": "https://doh.pub/dns-query",
        "*.tencent-cloud.net": "https://doh.pub/dns-query",
        "*.tencent-cloud.com": "https://doh.pub/dns-query",
        "+.tencent.com": "https://doh.pub/dns-query",
        "+.tencent.com.cn": "https://doh.pub/dns-query",
        "+.tencentmusic.com": "https://doh.pub/dns-query",
        "+.weixinbridge.com": "https://doh.pub/dns-query",
        "+.weixin.com": "https://doh.pub/dns-query",
        "+.weiyun.com": "https://doh.pub/dns-query",
        "+.soso.com": "https://doh.pub/dns-query",
        "+.sogo.com": "https://doh.pub/dns-query",
        "+.sogou.com": "https://doh.pub/dns-query",
        "*.sogoucdn.com": "https://doh.pub/dns-query",
        "*.roblox.cn": "https://doh.pub/dns-query",
        "+.robloxdev.cn": "https://doh.pub/dns-query",
        "+.wegame.com": "https://doh.pub/dns-query",
        "+.wegame.com.cn": "https://doh.pub/dns-query",
        "+.wegameplus.com": "https://doh.pub/dns-query",
        "+.cdn-go.cn": "https://doh.pub/dns-query",
        "*.tencentcs.cn": "https://doh.pub/dns-query",
        "*.qcloudimg.com": "https://doh.pub/dns-query",
        "+.dnspod.cn": "https://doh.pub/dns-query",
        "+.anticheatexpert.com": "https://doh.pub/dns-query",
        "url.cn": "https://doh.pub/dns-query",
        "*.qlivecdn.com": "https://doh.pub/dns-query",
        "*.tcdnlive.com": "https://doh.pub/dns-query",
        "*.dnsv1.com": "https://doh.pub/dns-query",
        "*.smtcdns.net": "https://doh.pub/dns-query",
        "+.coding.net": "https://doh.pub/dns-query",
        "*.codehub.cn": "https://doh.pub/dns-query",
        "tx-safety-video.acfun.cn": "https://doh.pub/dns-query",
        "acg.tv": "https://doh.pub/dns-query",
        "b23.tv": "https://doh.pub/dns-query",
        "+.bilibili.cn": "https://doh.pub/dns-query",
        "+.bilibili.com": "https://doh.pub/dns-query",
        "*.acgvideo.com": "https://doh.pub/dns-query",
        "*.bilivideo.com": "https://doh.pub/dns-query",
        "*.bilivideo.cn": "https://doh.pub/dns-query",
        "*.bilivideo.net": "https://doh.pub/dns-query",
        "*.hdslb.com": "https://doh.pub/dns-query",
        "*.biliimg.com": "https://doh.pub/dns-query",
        "*.biliapi.com": "https://doh.pub/dns-query",
        "*.biliapi.net": "https://doh.pub/dns-query",
        "+.biligame.com": "https://doh.pub/dns-query",
        "*.biligame.net": "https://doh.pub/dns-query",
        "+.bilicomic.com": "https://doh.pub/dns-query",
        "+.bilicomics.com": "https://doh.pub/dns-query",
        "*.bilicdn1.com": "https://doh.pub/dns-query",
        "*.bulicdn2.com": "https://doh.pub/dns-query",
        "+.mi.com": "https://doh.pub/dns-query",
        "+.duokan.com": "https://doh.pub/dns-query",
        "*.mi-img.com": "https://doh.pub/dns-query",
        "*.mi-idc.com": "https://doh.pub/dns-query",
        "*.xiaoaisound.com": "https://doh.pub/dns-query",
        "*.xiaomixiaoai.com": "https://doh.pub/dns-query",
        "*.mi-fds.com": "https://doh.pub/dns-query",
        "*.mifile.cn": "https://doh.pub/dns-query",
        "*.mijia.tech": "https://doh.pub/dns-query",
        "+.miui.com": "https://doh.pub/dns-query",
        "+.xiaomi.com": "https://doh.pub/dns-query",
        "+.xiaomi.cn": "https://doh.pub/dns-query",
        "+.xiaomi.net": "https://doh.pub/dns-query",
        "+.xiaomiev.com": "https://doh.pub/dns-query",
        "+.xiaomiyoupin.com": "https://doh.pub/dns-query",
        "+.gorouter.info": "https://doh.pub/dns-query",
        "+.bytedance.com": "180.184.2.2",
        "*.bytecdn.cn": "180.184.2.2",
        "*.volccdn.com": "180.184.2.2",
        "*.toutiaoimg.com": "180.184.2.2",
        "*.toutiaoimg.cn": "180.184.2.2",
        "*.toutiaostatic.com": "180.184.2.2",
        "*.toutiaovod.com": "180.184.2.2",
        "*.toutiaocloud.com": "180.184.2.2",
        "+.toutiaopage.com": "180.184.2.2",
        "+.feiliao.com": "180.184.2.2",
        "+.iesdouyin.com": "180.184.2.2",
        "*.pstatp.com": "180.184.2.2",
        "+.snssdk.com": "180.184.2.2",
        "*.bytegoofy.com": "180.184.2.2",
        "+.toutiao.com": "180.184.2.2",
        "+.feishu.cn": "180.184.2.2",
        "+.feishu.net": "180.184.2.2",
        "*.feishucdn.com": "180.184.2.2",
        "*.feishupkg.com": "180.184.2.2",
        "+.baike.com": "180.184.2.2",
        "+.zjurl.cn": "180.184.2.2",
        "+.okr.com": "180.184.2.2",
        "+.douyin.com": "180.184.2.2",
        "*.douyinpic.com": "180.184.2.2",
        "*.douyinstatic.com": "180.184.2.2",
        "*.douyincdn.com": "180.184.2.2",
        "*.douyinliving.com": "180.184.2.2",
        "*.douyinvod.com": "180.184.2.2",
        "+.huoshan.com": "180.184.2.2",
        "+.doubao.com": "180.184.2.2",
        "+.coze.cn": "180.184.2.2",
        "+.wukong.com": "180.184.2.2",
        "*.huoshanstatic.com": "180.184.2.2",
        "+.huoshanzhibo.com": "180.184.2.2",
        "+.ixigua.com": "180.184.2.2",
        "*.ixiguavideo.com": "180.184.2.2",
        "*.ixgvideo.com": "180.184.2.2",
        "*.byted-static.com": "180.184.2.2",
        "+.volces.com": "180.184.2.2",
        "*.zjcdn.com": "180.184.2.2",
        "*.zijieapi.com": "180.184.2.2",
        "+.feelgood.cn": "180.184.2.2",
        "+.volcengine.com": "180.184.2.2",
        "*.bytetcc.com": "180.184.2.2",
        "*.bytednsdoc.com": "180.184.2.2",
        "*.byteimg.com": "180.184.2.2",
        "*.byteacctimg.com": "180.184.2.2",
        "*.byteeffecttos.com": "180.184.2.2",
        "*.ibytedapm.com": "180.184.2.2",
        "+.oceanengine.com": "180.184.2.2",
        "*.edge-byted.com": "180.184.2.2",
        "*.volcvideo.com": "180.184.2.2",
        "*.bytecdntp.com": "180.184.2.2",
        "+.dongchedi.com": "180.184.2.2",
        "+.dcarstatic.com": "180.184.2.2",
        "+.dcarlive.com": "180.184.2.2",
        "+.dcarimg.com": "180.184.2.2",
        "+.dcarvod.com": "180.184.2.2",
        "+.dcarapi.com": "180.184.2.2",
        "+.pipix.com": "180.184.2.2",
        "+.ppximg.com": "180.184.2.2",
        "+.ppxstatic.com": "180.184.2.2",
        "+.ppxvod.com": "180.184.2.2",
        "+.xiaoxiaapi.com": "180.184.2.2",
        "+.rsproxy.cn": "180.184.2.2",
        "+.91.com": "180.76.76.76",
        "+.hao123.com": "180.76.76.76",
        "+.baidu.cn": "180.76.76.76",
        "+.baidu.com": "180.76.76.76",
        "+.iqiyi.com": "180.76.76.76",
        "*.iqiyipic.com": "180.76.76.76",
        "*.baidubce.com": "180.76.76.76",
        "*.bcelive.com": "180.76.76.76",
        "*.baiducontent.com": "180.76.76.76",
        "*.baidustatic.com": "180.76.76.76",
        "*.bdstatic.com": "180.76.76.76",
        "*.bdimg.com": "180.76.76.76",
        "*.bcebos.com": "180.76.76.76",
        "*.baidupcs.com": "180.76.76.76",
        "*.baidubcr.com": "180.76.76.76",
        "*.yunjiasu-cdn.net": "180.76.76.76",
        "+.tieba.com": "180.76.76.76",
        "+.dwz.cn": "180.76.76.76",
        "+.zuoyebang.com": "180.76.76.76",
        "+.zybang.com": "180.76.76.76",
        "+.xiaodutv.com": "180.76.76.76",
        "*.shifen.com": "180.76.76.76",
        "*.jomodns.com": "180.76.76.76",
        "*.bdydns.com": "180.76.76.76",
        "*.jomoxc.com": "180.76.76.76",
        "*.duapp.com": "180.76.76.76",
        "*.antpcdn.com": "180.76.76.76",
        "upos-sz-mirrorbd.bilivideo.com": "180.76.76.76",
        "upos-sz-mirrorbos.bilivideo.com": "180.76.76.76",
        "*.qhimg.com": "https://doh.360.cn/dns-query",
        "*.qhimgs.com": "https://doh.360.cn/dns-query",
        "*.qhimgs?.com": "https://doh.360.cn/dns-query",
        "*.qhres.com": "https://doh.360.cn/dns-query",
        "*.qhres2.com": "https://doh.360.cn/dns-query",
        "*.qhmsg.com": "https://doh.360.cn/dns-query",
        "*.qhstatic.com": "https://doh.360.cn/dns-query",
        "*.qhupdate.com": "https://doh.360.cn/dns-query",
        "*.qihucdn.com": "https://doh.360.cn/dns-query",
        "+.360.com": "https://doh.360.cn/dns-query",
        "+.360.cn": "https://doh.360.cn/dns-query",
        "+.360.net": "https://doh.360.cn/dns-query",
        "+.360safe.com": "https://doh.360.cn/dns-query",
        "*.360tpcdn.com": "https://doh.360.cn/dns-query",
        "+.360os.com": "https://doh.360.cn/dns-query",
        "*.360webcache.com": "https://doh.360.cn/dns-query",
        "+.360kuai.com": "https://doh.360.cn/dns-query",
        "+.so.com": "https://doh.360.cn/dns-query",
        "+.haosou.com": "https://doh.360.cn/dns-query",
        "+.yunpan.cn": "https://doh.360.cn/dns-query",
        "+.yunpan.com": "https://doh.360.cn/dns-query",
        "+.yunpan.com.cn": "https://doh.360.cn/dns-query",
        "*.qh-cdn.com": "https://doh.360.cn/dns-query",
        "+.baomitu.com": "https://doh.360.cn/dns-query",
        "+.qiku.com": "https://doh.360.cn/dns-query",
        "+.360simg.com": "https://doh.360.cn/dns-query",
        "+.securelogin.com.cn": "system",
        "captive.apple.com": "system",
        "hotspot.cslwifi.com": "system",
        "*.m2m": "system",
        "injections.adguard.org": "system",
        "local.adguard.org": "system",
        "*.bogon": "system",
        "instant.arubanetworks.com": "system",
        "setmeup.arubanetworks.com": "system",
        "router.asus.com": "system",
        "repeater.asus.com": "system",
        "+.asusrouter.com": "system",
        "+.routerlogin.net": "system",
        "+.routerlogin.com": "system",
        "+.tplinkwifi.net": "system",
        "+.tplogin.cn": "system",
        "+.tplinkap.net": "system",
        "+.tplinkmodem.net": "system",
        "+.tplinkplclogin.net": "system",
        "+.tplinkrepeater.net": "system",
        "*.ui.direct": "system",
        "unifi": "system",
        "*.huaweimobilewifi.com": "system",
        "*.router": "system",
        "aterm.me": "system",
        "console.gl-inet.com": "system",
        "homerouter.cpe": "system",
        "mobile.hotspot": "system",
        "ntt.setup": "system",
        "pi.hole": "system",
        "*.plex.direct": "system",
        "*.home": "system",
        "+.10.in-addr.arpa": "system",
        "+.16.172.in-addr.arpa": "system",
        "+.17.172.in-addr.arpa": "system",
        "+.18.172.in-addr.arpa": "system",
        "+.19.172.in-addr.arpa": "system",
        "+.20.172.in-addr.arpa": "system",
        "+.21.172.in-addr.arpa": "system",
        "+.22.172.in-addr.arpa": "system",
        "+.23.172.in-addr.arpa": "system",
        "+.24.172.in-addr.arpa": "system",
        "+.25.172.in-addr.arpa": "system",
        "+.26.172.in-addr.arpa": "system",
        "+.27.172.in-addr.arpa": "system",
        "+.28.172.in-addr.arpa": "system",
        "+.29.172.in-addr.arpa": "system",
        "+.30.172.in-addr.arpa": "system",
        "+.31.172.in-addr.arpa": "system",
        "+.168.192.in-addr.arpa": "system",
        "+.254.169.in-addr.arpa": "system",
        "*.lan": "system",
        "*.local": "system",
        "*.internal": "system",
        "*.localdomain": "system",
        "+.home.arpa": "system",
        "+.127.0.0.1.sslip.io": "system",
        "+.127.atlas.skk.moe": "system"
    };
    config.dns["nameserver-policy"] = nameserverPolicy;
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

// 覆盖代理组
const overrideProxyGroups = (config) => {
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
            name: `AUTO_${item.name}`,
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
            name: `RR_LOAD_BALANCING_${item.name}`,
            proxies: getProxiesByRegex(config, item.regex),
            strategy: "round-robin",
        }))
        .filter((item) => item.proxies.length > 0);
    const loadBalanceGroupsConsistentHashing = loadBalanceGroupRegexs
        .map((item) => ({
            ...loadBalanceBase,
            name: `LOAD_BALANCING_${item.name}`,
            proxies: getProxiesByRegex(config, item.regex),
            strategy: "consistent-hashing",
        }))
        .filter((item) => item.proxies.length > 0);
    const loadBalanceGroupsStickySession = loadBalanceGroupRegexs
        .map((item) => ({
            ...loadBalanceBase,
            name: `SS_LOAD_BALANCING_${item.name}`,
            proxies: getProxiesByRegex(config, item.regex),
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
    groups[0].proxies.push(...allProxies);
    groups.push(...autoProxyGroups);
    groups.push(...manualProxyGroups);
    groups.push(...loadBalanceGroups);

    const proxyGroupsBase = {
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
            ...proxyGroupsBase.jpAutoFirst,
            "name": "HOYO_CN_PROXY",
            "proxies": [ "HOYO_PROXY", "HOYO_BYPASS" ],
        },
        { ...proxyGroupsBase.directFirst, "name": "HOYO_BYPASS" },
        { ...proxyGroupsBase.jpAutoFirst, "name": "HOYO_PROXY" },
        // BLOCK
        { ...proxyGroupsBase.rejectFirst, "name": "MIUI_BLOATWARE" },
        { ...proxyGroupsBase.rejectFirst, "name": "AD_BLOCK" },
        // CUSTOM
        { ...proxyGroupsBase.directFirst, "name": "STEAM_CN" },
        { ...proxyGroupsBase.jpAutoFirst, "name": "STEAM" },
        // CUSTOM_JP
        { ...proxyGroupsBase.jpAutoFirst, "name": "PIXIV" },
        { ...proxyGroupsBase.jpAutoFirst, "name": "AI" },
        { ...proxyGroupsBase.jpAutoFirst, "name": "YOUTUBE" },
        { ...proxyGroupsBase.jpAutoFirst, "name": "GOOGLE" },
        { ...proxyGroupsBase.jpAutoFirst, "name": "TWITTER" },
        // PROXY
        { ...proxyGroupsBase.jpAutoFirst, "name": "TELEGRAM" },
        { ...proxyGroupsBase.jpAutoFirst, "name": "DISCORD" },
        { ...proxyGroupsBase.jpAutoFirst, "name": "MICROSOFT" },
        { ...proxyGroupsBase.jpAutoFirst, "name": "APPLE" },
        // BYPASS
        { ...proxyGroupsBase.directFirst, "name": "BYPASS" },
        // CUSTOM_JP
        { ...proxyGroupsBase.jpAutoFirst, "name": "JP_DOMAIN" },
        // FINAL
        { ...proxyGroupsBase.manualFirst, "name": "FINAL" },
    ];
    groups.push(...customProxyGroups);

    config["proxy-groups"] = groups;
}

const getProxiesByRegex = (config, regex) => {
    const matchedProxies = config.proxies.filter((e) => regex.test(e.name)).map((e) => e.name);
    return matchedProxies.length > 0 && matchedProxies;
}
const getProxiesByRegexSafe = (config, regex) => {
    const matchedProxies = config.proxies.filter((e) => regex.test(e.name)).map((e) => e.name);
    return matchedProxies.length > 0 ? matchedProxies: ["COMPATIBLE"];
}
// 以下代码源自
// https://github.com/clash-verge-rev/clash-verge-rev/discussions/2053#discussion-7518652
const removeProxyByRegex = (config, regex) => {
    const unmatchedProxies = config.proxies.filter((proxy) => !proxy.name.match(regex));
    if (unmatchedProxies.length > 0) config.proxies = unmatchedProxies;
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
    const proxyGroup = {
        "name": "RELAY",
        "type": "select",
        "proxies": [],
        "use": ["provider123"],
        "exclude-filter": "剩余|到期|主页|官网|游戏|关注|网站|地址|有效|网址|禁止|邮箱|发布|客服|订阅|节点|问题|联系",
    }
    config["proxy-groups"].forEach((e) => {
        if (!e.hidden && !e.proxies.includes(proxyGroup.name) && e.name!=dailer) e.proxies.unshift(proxyGroup.name);
    })
    config["proxy-groups"].unshift(proxyGroup)
    if (!exitNode.filter((e) => /(日本|Japan|JP)/.test(e.name)).map((e) => { e.name }).length) return
    config["proxy-groups"].unshift({
        name: "EXIT_NODE | AUTO_JP",
        type: "url-test",
        url: "https://cp.cloudflare.com",
        interval: 300,
        tolerance: 50,
        use: ["provider123"],
        filter: "(日本|Japan|JP).*(专线)",
        "exclude-filter": "0.[0-9]",
        hidden: true,
    })
    proxyGroup.proxies.unshift("EXIT_NODE | AUTO_JP")
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
