/**
* @param {NS} ns
**/
/** @param {import("..").NS} ns */

//purchases a single server

export async function main(ns) {
    //deleteServer("pserv-0");
    ns.purchaseServer("pserv-0", 65536);
}