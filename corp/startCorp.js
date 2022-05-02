/**
* @param {NS} ns
**/
/** @param {import("..").NS} ns */

export async function main(ns) {
    ns.createCorporation("doubling-isk", 0);
    ns.expandIndustry("Agriculture", "getWeed");
    ns.unlockUpgrade("Smart Supply");
}