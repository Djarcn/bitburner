/**
* @param {NS} ns
**/
/** @param {import("..").NS} ns */

//original starting script

export async function main(ns) {
	// Array of all servers
	let serversPort = [["n00dles", 0], ["foodnstuff", 0], ["sigma-cosmetics", 0], ["joesguns", 0], ["nectar-net", 0], ["hong-fang-tea", 0], ["harakiri-sushi", 0], ["CSEC", 1], ["neo-net", 1], ["zer0", 1], ["max-hardware", 1], ["iron-gym", 1], ["johnson-ortho", 2], ["crush-fitness", 2], ["phantasy", 2], ["omega-net", 2], ["silver-helix", 2], ["the-hub", 2], ["avmnite-02h", 2], ["computek", 3], ["I.I.I.I", 3], ["netlink", 3], ["millenium-fitness", 3], ["summit-uni", 3], ["rho-construction", 3], ["rothman-uni", 3], ["catalyst", 3], ["syscore", 4], ["snap-fitness", 4], ["zb-def", 4], ["nova-med", 4], ["applied-energetics", 4], ["univ-energy", 4], [".", 4], ["aevum-police", 4], ["lexo-corp", 4], ["unitalife", 4], ["global-pharm", 4], ["alpha-ent", 4], ["run4theh111z", 4], ["zeus-med", 5], ["galactic-cyber", 5], ["deltaone", 5], ["icarus", 5], ["aerocorp", 5], ["defcomm", 5], ["taiyang-digital", 5], ["infocomm", 5], ["stormtech", 5], ["kuai-gong", 5], ["4sigma", 5], ["nwo", 5], ["clarkinc", 5], ["b-and-a", 5], ["The-Cave", 5], ["ecorp", 5], ["megacorp", 5], ["fulcrumassets", 5], ["zb-institute", 5], ["microdyne", 5], ["vitalife", 5], ["powerhouse-fitness", 5], ["omnia", 5], ["solaris", 5], ["titan-labs", 5], ["helios", 5], ["blade", 5], ["fulcrumtech", 5], ["omnitek", 5]]

	let level = ns.getHackingLevel();
	let script = "/old/early-hack-template.js";
	let a = " ";
	if (level < 10)
		a = "n00dles";
	else if (level < 40)
		a = "joesguns";
	else if (level < 100)
		a = "harakiri-sushi";
	else if (level < 150) {
		a = "phantasy";
		ns.brutessh(a);
		ns.ftpcrack(a);
		ns.nuke(a);
	}
	else {
		a = "silver-helix";
		ns.brutessh(a);
		ns.ftpcrack(a);
		ns.nuke(a);
	}

	// script ram usage
	let ramUsage = ns.getScriptRam(script);

	for (let i = 0; i < serversPort.length; ++i) {
		let serv = serversPort[i][0];
		let ports = serversPort[i][1];
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
		if (ram != 0)
			ns.exec(script, serv, Math.floor(ram / ramUsage), a);
	}
}