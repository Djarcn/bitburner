/**
* @param {NS} ns
**/
/** @param {import("..").NS} ns */

export async function main(ns) {
	ns.tail();

	
	let orig =  ns.read("/lib/servers.txt");	//reads server.txt which contains arrays of server data
	var servers = orig.split("\r\n").map(function(x){return x.split("\t")});		//processes the file into an actual array
	let level = ns.getHackingLevel();
	let script = "/workhorse/early-hack-template.js";
	let a = " ";
	let port1 = ns.fileExists("BruteSSH.exe");
	let port2 = ns.fileExists("FTPCrack.exe");

	if (port1 && port2 && level >= 150) {
		a = "silver-helix";
		ns.brutessh(a);
		ns.ftpcrack(a);
	}
	else if (port1 && port2 && level > 100) {
		a = "phantasy";
		ns.brutessh(a);
		ns.ftpcrack(a);
	}
	else if (port1 && level >= 100) {
		a = "max-hardware";
		ns.brutessh(a);
	}
	else if (level >= 100)
		a = "harakiri-sushi";
	else if (level >= 40)
		a = "joesguns";
	else
		a = "n00dles";
	ns.nuke(a);

	// script ram usage 
	
	let ramUsage = ns.getScriptRam(script);

	for (let i = 0; i < servers.length; ++i) {
		let serv = servers[i][0];
		let ports = servers[i][1];
		let ram = ns.getServerMaxRam(serv);
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

		await ns.scp(script, serv);
		ns.nuke(serv);

		ns.killall(serv);
		if (ram != 0)
			ns.exec(script, serv, Math.floor(ram / ramUsage), a);
	}
}