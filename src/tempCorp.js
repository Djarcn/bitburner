import {
    HireEmployees,
    AssignEmployees,
    AevumSpread,
    NormalSpread,
    UpgradeWarehouse
} from "/corps/utils.js"


const cities = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"];
const division = "getDrugs";
const development_city = "Aevum";

/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    for (const city of cities) {
        if ( ns.corporation.getDivision(division).cities.includes(city) ) { continue }
        ns.corporation.expandCity(division, city);
    }

    for (const city of cities) {
        if (city == development_city) {
            await HireEmployees(ns, division, city, 30);
            await ns.sleep(100);
            await AssignEmployees(ns, division, city, AevumSpread(30));
            continue;
        }
        await HireEmployees(ns, division, city, 10);
        await ns.sleep(100);
        await AssignEmployees(ns, division, city, NormalSpread(10));
    }

    ns.run("/corps/loop.js", 1, division);
} 