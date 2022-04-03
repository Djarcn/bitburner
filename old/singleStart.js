/**
* @param {NS} ns
**/
/** @param {import("..").NS} ns */

export async function main(ns) {
    //math?
    let target = ns.args[1];
    let runner = ns.args[0];
    let cores = ns.getServer(target).cpuCores;

    await ns.scp(["/scripts/startV2/hack.js", "/scripts/startV2/grow.js", "/scripts/startV2/weak.js"], "home", runner);    //copies the workhorse scripts to the host
    let hackRAM = ns.getScriptRam("/scripts/startV2/hack.js");   //grabs the RAM cost of hack.js
    let growRAM = ns.getScriptRam("/scripts/startV2/grow.js");   //grabs the RAM cost of grow.js
    let weakRAM = ns.getScriptRam("/scripts/startV2/weak.js");   //grabs the RAM cost of weak.js

    let me = ns.getPlayer();       //grabs player stats
    let serv = ns.getServer(target);    //grabs targetted server's stats

    //weaken target server to minDifficulty
    while (serv.hackDifficulty != serv.minDifficulty) {
        let isUsed = true;
        let ramAvailable = ns.getServerMaxRam(runner) - ns.getServerUsedRam(runner);
        let desiredThreads = (serv.hackDifficulty - serv.minDifficulty) / ns.weakenAnalyze(1, cores);
        if (ramAvailable >= desiredThreads * weakRAM)
            ns.exec("/scripts/startV2/weak.js", runner, desiredThreads, target, 0);
        else {
            ns.exec("/scripts/startV2/weak.js", runner, ramAvailable / weakRAM, target, 0);
            isUsed = false;
        }
        await ns.sleep(ns.getWeakenTime(target) + 120);
        if (isUsed)
            ns.kill("/scripts/startV2/weak.js", runner, desiredThreads, target, 0);
        else
            ns.kill("/scripts/startV2/weak.js", runner, ramAvailable / weakRAM, target, 0);
        serv = ns.getServer(target);
    }

    let hackThreads = Math.floor(0.95 / ns.formulas.hacking.hackPercent(serv, me));   //calculates the number of hack() threads it would take to take 95% of a servers max money
    let weakHThreads = ns.hackAnalyzeSecurity(hackThreads) / ns.weakenAnalyze(1, cores);    //calculates the number of weaken() threads it would take to undo the security increase caused by hack()
    let growThreads = Math.floor(Math.log(20) / Math.log(ns.formulas.hacking.growPercent(serv, 1, me, cores)));   //calculates the number of grow() threads it would take to rebuild a server to max money from 5%
    let weakGThreads = ns.growthAnalyzeSecurity(growThreads) / ns.weakenAnalyze(1, cores);  //calculates the number of weaken() threads it would take to undo the security increase caused by grow()

    let ramCost = hackThreads * hackRAM + (weakHThreads + weakGThreads) * weakRAM + growThreads * growRAM;    //calculates the ammount of RAM it would cost to run an equalized loop of the above scripts*threads

    //calculate the to run the scripts
    let hackTime = ns.getHackTime(target);
    let growTime = ns.getGrowTime(target);
    let weakTime = ns.getWeakenTime(target);
    ns.print("h: " + hackTime + "\ng: " + growTime + "\nw: " + weakTime);

    //grow target server to maxMoney
    let ramAvailable = ns.getServerMaxRam(runner) - ns.getServerUsedRam(runner);
    while (serv.moneyAvailable != serv.moneyMax) {
        let isUsed = true;
        if (ramAvailable >= (weakGThreads * weakRAM) + (growThreads * growRAM)) {
            ns.exec("/scripts/startV2/weak.js", runner, weakGThreads, target, 0);
            await ns.sleep(60);
            ns.exec("/scripts/startV2/grow.js", runner, growThreads, target, 0);
        }
        else if (ramAvailable >= weakRAM + growRAM) {
            let threadMult = ramAvailable / ((weakGThreads * weakRAM) + (growThreads * growRAM));
            weakGThreads *= threadMult;
            growThreads *= growThreads;
            ns.exec("/scripts/startV2/weak.js", runner, Math.floor(weakGThreads), target, 0);
            await ns.sleep(60);
            ns.exec("/scripts/startV2/grow.js", runner, Math.floor(growThreads), target, 0);
            isUsed = false;
        }
        else
            return 0;
        await ns.sleep(weakTime + 60);
        if (isUsed) {
            ns.kill("/scripts/startV2/weak.js", runner, weakGThreads, target, 0);
            ns.kill("/scripts/startV2/grow.js", runner, growThreads, target, 0);
        }
        else {
            ns.kill("/scripts/startV2/weak.js", runner, Math.floor(weakGThreads), target, 0);
            ns.kill("/scripts/startV2/grow.js", runner, Math.floor(growThreads), target, 0);
        }
        serv = ns.getServer(target);
    }

    growThreads = Math.floor(Math.log(20) / Math.log(ns.formulas.hacking.growPercent(serv, 1, me, cores)));   //calculates the number of grow() threads it would take to rebuild a server to max money from 5%
    weakGThreads = ns.growthAnalyzeSecurity(growThreads) / ns.weakenAnalyze(1, cores);  //calculates the number of weaken() threads it would take to undo the security increase caused by grow()
    if (ramCost > ramAvailable) {
        let x = ramAvailable / ramCost;
        hackThreads *= x;
        weakHThreads *= x;
        growThreads *= x;
        weakGThreads *= x;
    }

    if (weakHThreads > 0)
        ns.exec("/scripts/startV2/weak.js", runner, weakHThreads, target, 0);
    if (weakGThreads > 0)
        ns.exec("/scripts/startV2/weak.js", runner, weakGThreads, target, 120);
    if (hackThreads > 0)
        ns.exec("/scripts/startV2/hack.js", runner, hackThreads, target, (weakTime - hackTime - 60));
    if (growThreads > 0)
        ns.exec("/scripts/startV2/grow.js", runner, growThreads, target, 60 + weakTime - growTime);
}
