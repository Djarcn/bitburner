/**
* @param {NS} ns
**/
/** @param {import("..").NS} ns */

//same as advanced start but only runs a single wave per target

export async function main(ns) {
	let servers = ["the-hub", "computek", "johnson-ortho", "omega-net", "crush-fitness", "phantasy", "max-hardware", "iron-gym"];
	let cores = ns.getServer(target).cpuCores;          //denotes home server core count, for use in calculations
	let runner = "pserv-1"; //sets which server will run/host the attack

	await ns.scp(["/workhorse/hack.js", "/workhorse/grow.js", "/workhorse/weak.js"], "home", runner);    //copies the workhorse script to the host

	let hackRAM = ns.getScriptRam("/workhorse/hack.js");   //grabs the RAM cost of hack.js
	let growRAM = ns.getScriptRam("/workhorse/grow.js");   //grabs the RAM cost of grow.js
	let weakRAM = ns.getScriptRam("/workhorse/weak.js");   //grabs the RAM cost of weak.js

	for (let i = 0; i < servers.length; ++i) {

		let target = servers[i];
		let me = ns.getPlayer();       //grabs player stats
		let serv = ns.getServer(target);    //grabs targetted server's stats

		//weaken target server to minDifficulty
		while (serv.hackDifficulty != serv.minDifficulty) {
			let isUsed = true;
			let ramAvailable = ns.getServerMaxRam(runner) - ns.getServerUsedRam(runner);
			let desiredThreads = (serv.hackDifficulty - serv.minDifficulty) / ns.weakenAnalyze(1, cores);
			if (ramAvailable >= desiredThreads * weakRAM)
				ns.exec("/workhorse/weak.js", runner, desiredThreads, target, 0);
			else {
				ns.exec("/workhorse/weak.js", runner, ramAvailable / weakRAM, target, 0);
				isUsed = false;
			}
			await ns.sleep(ns.getWeakenTime(target) + 120);
			if (isUsed)
				ns.kill("/workhorse/weak.js", runner, desiredThreads, target, 0);
			else
				ns.kill("/workhorse/weak.js", runner, ramAvailable / weakRAM, target, 0);
			serv = ns.getServer(target);
		}

		let hackThreads = Math.floor(0.95 / ns.formulas.hacking.hackPercent(serv, me));   //calculates the number of hack() threads it would take to take 95% of a servers max money
		let weakHThreads = ns.hackAnalyzeSecurity(hackThreads) / ns.weakenAnalyze(1, cores);    //calculates the number of weaken() threads it would take to undo the security increase caused by hack()
		let growThreads = Math.floor(Math.log(20) / Math.log(ns.formulas.hacking.growPercent(serv, 1, me, cores)));   //calculates the number of grow() threads it would take to rebuild a server to max money from 5%
		let weakGThreads = ns.growthAnalyzeSecurity(growThreads) / ns.weakenAnalyze(1, cores);  //calculates the number of weaken() threads it would take to undo the security increase caused by grow()

		let ramCost = hackThreads * 0.1 + (weakHThreads + weakGThreads) * 0.15 + growThreads * 0.15;    //calculates the ammount of RAM it would cost to run an equalized loop of the above scripts*threads

		//calculate the to run the scripts
		let hackTime = ns.getHackTime(target);
		let growTime = ns.getGrowTime(target);
		let weakTime = ns.getWeakenTime(target);
		ns.print("h: " + hackTime + "\ng: " + growTime + "\nw: " + weakTime);

		//grow target server to maxMoney
		while (serv.moneyAvailable != serv.moneyMax) {
			let ramAvailable = ns.getServerMaxRam(runner) - ns.getServerUsedRam(runner);
			let isUsed = true;
			if (ramAvailable >= (weakGThreads * weakRAM) + (growThreads * growRAM)) {
				ns.exec("/workhorse/weak.js", runner, weakGThreads, target, 0);
				await ns.sleep(60);
				ns.exec("/workhorse/grow.js", runner, growThreads, target, 0);
			}
			else if (ramAvailable >= weakRAM + growRAM) {
				let threadMult = ramAvailable / ((weakGThreads * weakRAM) + (growThreads * growRAM));
				ns.exec("/workhorse/weak.js", runner, Math.floor(weakGThreads * threadMult), target, 0);
				await ns.sleep(60);
				ns.exec("/workhorse/grow.js", runner, Math.floor(growThreads * threadMult), target, 0);
				isUsed = false;
			}
			else
				return 0;
			await ns.sleep(weakTime + 60);
			if (isUsed) {
				ns.kill("/workhorse/weak.js", runner, weakGThreads, target, 0);
				ns.kill("/workhorse/grow.js", runner, growThreads, target, 0);
			}
			else{
				ns.kill("/workhorse/weak.js", runner, Math.floor(weakGThreads * threadMult), target, 0);
				ns.kill("/workhorse/grow.js", runner, Math.floor(growThreads * threadMult), target, 0);
			}
			serv = ns.getServer(target);
		}

		if (weakHThreads > 0)
			ns.exec("/workhorse/weak.js", runner, weakHThreads, target, 0 + i);
		if (weakGThreads > 0)
			ns.exec("/workhorse/weak.js", runner, weakGThreads, target, 120 + i);
		if (hackThreads > 0)
			ns.exec("/workhorse/hack.js", runner, hackThreads, target, (weakTime - hackTime - 60) + i);
		if (growThreads > 0)
			ns.exec("/workhorse/grow.js", runner, growThreads, target, 60 + weakTime - growTime + i);
	}
}