/**
* @param {NS} ns
**/
/** @param {import("..").NS} ns */
import { multiscan, gainRootAccess, hasRootAccess } from "/functions/utils.js";

export async function main(ns) {
	ns.tail();

	let orig = ns.read("/lib/servers.txt");	//reads server.txt which contains arrays of server data
	var servers = multiscan(ns, "home");
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

	if (!ns.hasRootAccess(a)) {
		await gainRootAccess(ns, a);
	}

	let ramUsage = ns.getScriptRam(script);

	for (let i = 0; i < servers.length; ++i) {
		if (servers[i] == "home"){
			continue;
		}
		let serv = servers[i];
		if (!ns.hasRootAccess(serv)) {
			await gainRootAccess(ns, serv);
		}
		ns.killall(serv);
		if(!hasRootAccess){
			await ns.scp("/workhorse/nuke.js");
			await ns.exec("/workhorse/nuke.js", serv);
		}
		let ram = ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv);

		await ns.scp(script, serv);

		if (ram != 0)
			ns.exec(script, serv, Math.floor(ram / ramUsage), a);
	}
}