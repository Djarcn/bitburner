/**
* @param {NS} ns
**/
/** @param {import("..").NS} ns */

export async function main(ns) {
    ns.exec("/src/cleanStart.js",home);
    await ns.sleep(2000);
    ns.kill()
}