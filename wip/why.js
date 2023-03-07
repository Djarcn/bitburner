/**
* @param {NS} ns
**/
/** @param {import("..").NS} ns */
import { gainRootAccess } from "/functions/utils.js";

function goToSchool(ns, pay) {
    if (pay) {
        ns.universityCourse("rothman university", "Algorithms", true);
    }
    else {
        ns.universityCourse("rothman university", "Study Computer Science", true);
    }
}
function isFactionNeeded(ns, faction) {      //checks if you still need a given faction by checking if you have the augmentation input
    let facAugmentation = '';
    switch (faction) {
        case "CyberSec":
            facAugmentation = "Cranial Signal Processors - Gen II";
            break;
        case "Tian Di Hui":
            facAugmentation = "Neuroreceptor Management Implant";
            break;
        case "NiteSec":
            facAugmentation = "";
            break;
        case "The Black Hand":
            facAugmentation = "";
            break;
        case "BitRunners":
            facAugmentation = "Embedded Netburner Module Core V2 Upgrade";
            break;
    }
    let myAugmentations = ns.getOwnedAugmentations();
    for (let i = 0; i < myAugmentations.length; ++i) {
        if (myAugmentations[i] == facAugmentation) {
            return false;
        }
    }
    return true;
}
async function getFile(ns, file) {
    if (!ns.fileExists(file)) {
        ns.createProgram(file, true);
    }
    while (!ns.fileExists(file)) {
        await ns.sleep(6000);
    }
}

async function waitForInvitation(ns, faction) {        //waits until you have an invitation to given faction
    while (true) {
        let invites = await ns.checkFactionInvitations();
        for (let i = 0; i < invites.length; i++) {
            if (invites[i] = faction) {
                return true;
            }
        }
        await ns.sleep(6000);
    }
}
async function runFaction(ns, faction, rep) {
    try {
        ns.joinFaction(faction);
    } catch (err) {
        await waitForInvitation;   
    }
    while (await ns.getFactionRep(faction) < rep) {
        ns.workForFaction(faction, "Hacking Contracts");
        await ns.sleep(60000);
    }
}

async function backdoor(ns, serv) {        //backdoors called server
    ns.killall(serv); 
    await gainRootAccess(ns, serv);
    await ns.scp("/workhorse/nuke.js", serv);
    ns.exec("/workhorse/nuke.js", serv);
}

export async function main(ns) {
    ns.tail();

    let hackLevel = "0";
    ns.exec("/src/cleanStart.js", "home");
    await ns.sleep(5000);
    goToSchool(ns, false);

    while (hackLevel < 50) {
        await ns.sleep(5000);
        hackLevel = ns.getHackingLevel();
    }
    let file = 'brutessh.exe';
    await getFile(ns, file);

    ns.exec("/src/cleanStart.js", "home");
    await ns.sleep(5000);
    hackLevel = ns.getHackingLevel();
    goToSchool(ns, false);

    let serv = "CSEC";
    let faction = "CyberSec";

    if (isFactionNeeded(ns, faction)) {
        while (hackLevel < ns.getServerRequiredHackingLevel(serv)) {
            await ns.sleep(6000);
            hackLevel = ns.getHackingLevel();
        }
        await backdoor(ns, serv);
        await waitForInvitation(ns, faction);
        await runFaction(ns, faction, 18750);
    }

    faction = "Tian Di Hui";

    if (isFactionNeeded(ns, faction)) {
        while (hackLevel < 50 || ns.getServerMoneyAvailable("home") < "1200000") {
            await ns.sleep(6000);
            hackLevel = ns.getHackingLevel();
        }
        ns.travelToCity("New Tokyo");
        await waitForInvitation(ns, faction);
        await runFaction(ns, faction, 75000);
    }

    while (hackLevel < 100) {
        if (ns.getServerMoneyAvailable("home") > "10000000") {
            goToSchool(ns, true);
            break;
        }
        await ns.sleep(6000);
        hackLevel = ns.getHackingLevel();
    }

    file = "FTPCrack.exe";
    await getFile(ns, file);
    file = "relaySMTP.exe";
    await getFile(ns, file);
    ns.exec("/src/cleanStart.js", "home");
    await ns.sleep(5000);

    /*faction = "NiteSec";
    serv = "avmnite-02h";

    if (isFactionNeeded(ns, faction)) {   //temp
        while (hackLevel < ns.getServerRequiredHackingLevel(serv)) {
            await ns.sleep(6000);
            hackLevel = ns.getHackingLevel();
        }

        await backdoor(ns, serv);
        await waitForInvitation(ns, faction);
        await runFaction(ns, faction, 18750);
    }*/

    /*faction = "The Black Hand";
    serv = "I.I.I.I";

    if (isFactionNeeded(ns, faction)) {   //temp
        while (hackLevel < ns.getServerRequiredHackingLevel(serv)) {
            await ns.sleep(6000);
            hackLevel = ns.getHackingLevel();
        }

        await backdoor(ns, serv);
        await waitForInvitation(ns, faction);
        await runFaction(ns, faction, 18750);
    }*/

    /*while (hackLevel < 225) {
        await ns.sleep(6000);
        hackLevel = ns.getHackingLevel();
    }
    ns.applyToCompany("four sigma", "software job");*/

    faction = "BitRunners";
    serv = "run4theh111z";

    if (isFactionNeeded(ns, faction)) { //temp
        while (hackLevel < ns.getServerRequiredHackingLevel(serv)) {
            await ns.sleep(6000);
            hackLevel = ns.getHackingLevel();
        }

        await backdoor(ns, serv);
        await waitForInvitation(ns, faction);
        await runFaction(ns, faction, 125000);
    }
}