/**
* @param {NS} ns
**/
/** @param {import("../.").NS} ns */

export async function main(ns) {
    // Defines the "target server"
    let target = ns.args[0];

    // Defines the maximum security level the target server can
    // have.
    let securityThresh = ns.getServerMinSecurityLevel(target);

    // Infinite loop that continously weaken the target server
    while (true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            await ns.weaken(target);
            await ns.sleep(ns.args[1]);
        }
        else {
            await ns.sleep(5000);
        }
    }
}