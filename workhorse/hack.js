/**
* @param {NS} ns
**/
/** @param {import("../.").NS} ns */

export async function main(ns) {
    // Defines the "target server"
    let target = ns.args[0];
    // Infinite loop that continously grows the target server
    while (true) {
        if ((ns.getServerMoneyAvailable(target) >= ns.getServerMaxMoney(target)*.9) && (ns.getServerSecurityLevel(target) == ns.getServerMinSecurityLevel(target))) {
            await ns.hack(target);
            await ns.sleep(ns.args[1]);
        } else {
            await ns.sleep(5000);
        }
    }
}