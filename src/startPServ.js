/**
* @param {NS} ns
**/
/** @param {import("..").NS} ns */

export async function main(ns) {
    ns.tail();
    let level = ns.getHackingLevel();
    let script = "/workhorse/early-hack-template.js";
    let a = " ";
    let ports = 0;
    if (ns.fileExists("BruteSSH.exe"))
        ports++;
    if (ns.fileExists("FTPCrack.exe"))
        ports++;
    if (ns.fileExists("relaySMTP.exe"))
        ports++;
    if (ns.fileExists("HTTPWorm.exe"))
        ports++;
    if (ns.fileExists("SQLInject.exe"))
        ports++;

    if (ports >= 5 && level >= 1150)
        a = "ecorp";
    else if (ports >= 5 && level >= 925)
        a = "megacorp";
    else if (ports >= 3 && level >= 450)
        a = "catalyst";
    else if (ports >= 3 && level >= 350)
        a = "the-hub";
    else if (ports >= 2 && level >= 175)
        a = "silver-helix";
    else if (ports >= 2 && level >= 175)
        a = "phantasy";
    else if (ports >= 1 && level >= 100)
        a = "max-hardware";
    else if (level >= 100)
        a = "harakiri-sushi";
    else if (level >= 40)
        a = "joesguns";
    else
        a = "n00dles";


    if (ports >= 1)
        ns.brutessh(a);
    if (ports >= 2)
        ns.ftpcrack(a);
    if (ports >= 3)
        ns.relaysmtp(a);
    if (ports >= 4)
        ns.httpworm(a);
    if (ports >= 5)
        ns.sqlinject(a);

    ns.nuke(a);

    if (!ns.fileExists("Formulas.exe")) {
        // script ram usage 
        let ramUsage = ns.getScriptRam(script);
        for (let i = 0; i < ns.getPurchasedServerLimit(); i++) {
            let hostname = "pserv-" + i;
            let ramAvailable = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname);
            await ns.scp(script, hostname);
            ns.exec(script, hostname, Math.floor(ramAvailable / ramUsage), a);
        }
    }
    else {
        for (let i = 0; i < ns.getPurchasedServerLimit(); i++) {
            let host = "pserv-" + i;
            ns.killall(host);
            ns.exec("/functions/singleStart.js", "home", 1, host, a);
        }
    }
}