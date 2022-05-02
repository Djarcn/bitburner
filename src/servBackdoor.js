/**
* @param {NS} ns
**/
/** @param {import("..").NS} ns */

export async function main(ns) {
    ns.tail();


    let serv = "w0r1d_d43m0n";
    let ports = 5;
    let port1 = ns.fileExists("BruteSSH.exe");
    let port2 = ns.fileExists("FTPCrack.exe");
    let port3 = ns.fileExists("relaySMTP.exe");
    let port4 = ns.fileExists("HTTPWorm.exe");
    let port5 = ns.fileExists("SQLInject.exe");

    // opens ports 1-5
    if (ports > 0 && port1) {
        ns.brutessh(serv);  
    }
    if (ports > 1 && port2) {
        ns.ftpcrack(serv);
    }
    if (ports > 2 && port3) {
        ns.relaysmtp(serv);
    }
    if (ports > 3 && port4) {
        ns.httpworm(serv);
    }
    if (ports > 4 && port5) {
        ns.sqlinject(serv);
    }

    ns.nuke(serv);

}