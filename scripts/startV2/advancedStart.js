/**
* @param {NS} ns
**/
/** @param {import("../.").NS} ns */

export async function main(ns) {
    //let servers = ["the-hub", "computek", "johnson-ortho", "omega-net", "crush-fitness", "phantasy", "max-hardware", "iron-gym"];

    let target = "the-hub"; //sets target for attack
    let cores = 2;          //denotes home server core count, for use in calculations
    let runner = "pserv-0"; //sets which server will run/host the attack

    await ns.scp(["/scripts/startV2/hack.js", "/scripts/startV2/grow.js", "/scripts/startV2/weak.js"], "home", runner);    //copies the workhorse script to the host

    let hackRAM = ns.getScriptRam("/scripts/startV2/hack.js");   //grabs the RAM cost of hack.js
    let growRAM = ns.getScriptRam("/scripts/startV2/grow.js");   //grabs the RAM cost of grow.js
    let weakRAM = ns.getScriptRam("/scripts/startV2/weak.js");   //grabs the RAM cost of weak.js
    let remainingRam = ns.getServerMaxRam(runner);  //grabs the MaxRam of the host (assumes the host has no scripts running)

    //math?
    let me = ns.getPlayer();       //grabs player stats
    let serv = ns.getServer(target);    //grabs targetted server's stats

    //weaken target server to minDifficulty
    while (serv.hackDifficulty != serv.minDifficulty) {
        ns.exec("/scripts/startV2/weak.js", runner, (serv.hackDifficulty - serv.minDifficulty) / ns.weakenAnalyze(1, cores), target, 0);
        await ns.sleep(ns.getWeakenTime(target) + 60);
        ns.killall(runner);
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
        ns.exec("/scripts/startV2/weak.js", runner, weakGThreads, target, 0);
        ns.exec("/scripts/startV2/grow.js", runner, growThreads, target, 0);
        await ns.sleep(weakTime + 60);
        ns.killall(runner);
        serv = ns.getServer(target);
    }

    //create equalized waves of hack(), weaken(), and grow() threads to repeatedly hack/weaken/grow/weaken with minimal delay.
    // desired behavior: hack>weaken>grow>weaken>repeat
    // weakTime>growTime>hackTime
    // launch order: weakH>weakG>grow>hack
    let totalTime = 0;
    let i = 0; //for uniqueness

    while (remainingRam > ramCost && totalTime < (weakTime - 180)) {
        if (weakHThreads > 0)
            ns.exec("/scripts/startV2/weak.js", runner, weakHThreads, target, 0 + i);
        if (weakGThreads > 0)
            ns.exec("/scripts/startV2/weak.js", runner, weakGThreads, target, 120 + i);
        if (hackThreads > 0)
            ns.exec("/scripts/startV2/hack.js", runner, hackThreads, target, (weakTime - hackTime - 60) + i);
        if (growThreads > 0)
            ns.exec("/scripts/startV2/grow.js", runner, growThreads, target, 60 + weakTime - growTime + i);
        await ns.sleep(60);
        i++;
        totalTime += 120;
        remainingRam -= ramCost;
    }
}