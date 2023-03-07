/**
* @param {NS} ns
**/
/** @param {import("..").NS} ns */
import { multiscan, gainRootAccess, hasRootAccess } from "/functions/utils.js";

function maxElement(arr) {
    let max = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i]
        }
    }

    let maxE = arr.indexOf(max);
    return maxE
}

export function best_target(ns, arr) {
	let list = [];
	let results = [];
	let little_results = [];
	arr.forEach(server => {
		if (!ns.hasRootAccess(server)) {
			gainRootAccess(ns, server);
		}

		if (ns.hasRootAccess(server) && ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel() && server != 'home' && !ns.getPurchasedServers().includes(server) && ns.getServerMoneyAvailable(server)) {
			list.push(server);
		}
	})


	list.forEach((target, i) => {
		results[i] = ns.getServerMaxMoney(target);
		little_results[i] = ns.getServerMaxMoney(target) * ns.hackAnalyze(target);
	})

	return [list[maxElement(results)], list[maxElement(little_results)]];
}

export async function main(ns) {
	ns.tail();

	//let orig = ns.read("/lib/servers.txt");	//reads server.txt which contains arrays of server data
	var servers = await multiscan(ns, "home");
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

	a = best_target(ns, servers);

	let ramUsage = ns.getScriptRam(script);

	for (let i = 0; i < servers.length; ++i) {
		if (servers[i] == "home"){
			continue;
		}
		let serv = servers[i];
		if (!ns.hasRootAccess(serv)) {
			gainRootAccess(ns, serv);	
		}
		ns.killall(serv);
		if(!hasRootAccess){
			await ns.scp("/workhorse/nuke.js");
			ns.exec("/workhorse/nuke.js", serv);
		}
		let ram = ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv);

		await ns.scp(script, serv);

		if (ram >= ramUsage)
			ns.exec(script, serv, Math.floor(ram / ramUsage), a[1]);
	}
}