/**
* @param {NS} ns
**/
/** @param {import("..").NS} ns */

export async function main(ns) {
	ns.tail();
    await ns.exec("/src/cleanStart.js", "home");
    await ns.exec("/src/upgradeServers.js", "home");
}