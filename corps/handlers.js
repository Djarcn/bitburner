import {
    HireEmployees,
    AssignEmployees,
    AevumSpread,
    NormalSpread
} from "/corps/utils.js"

/** @param {import("../.vscode").NS} ns */
export async function ProductHandler(ns, division, city, product) {
    if (ns.corporation.getProduct(division, product).developmentProgress < 100) { return product }

    const price = "MP*" + (product * 2);
    ns.corporation.sellProduct(division, city, product, "MAX", price, true);
    await ns.sleep(1000);
    try { ns.corporation.setProductMarketTA2(division, product, true) }
    catch {  }

    if (ns.corporation.getDivision(division).products.length > 2) { ns.corporation.discontinueProduct(division, ns.corporation.getDivision(division).products[0]) }
    await ns.sleep(100);
    StartDevelopment(ns, division, city, product + 1);

    return product + 1;
}

/** @param {import("../.vscode").NS} ns */
export function StartDevelopment(ns, division, city, product) {
    ns.print("Starting development of " + product);
    const money_available = ns.corporation.getCorporation().funds;
    const budget = money_available / 20;
    ns.corporation.makeProduct(division, city, product, budget, budget);
}



const cities = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"];
const aevum_differential = 60;

/** @param {import("../.vscode").NS} ns */
export async function EmployeeHandler(ns, division) {
    if (ns.corporation.getOffice(division, "Aevum").employees.length > 300) { return }

    const money_available = ns.corporation.getCorporation().funds;

    while (ns.corporation.getOffice(division, "Aevum").size < aevum_differential) {
        const office_size = ns.corporation.getOffice(division, "Aevum").employees.length;
        const upgrade_cost = ns.corporation.getOfficeSizeUpgradeCost(division, "Aevum", aevum_differential - office_size);

        if (money_available > upgrade_cost * 2) {
            await HireEmployees(ns, division, "Aevum", aevum_differential - office_size);
            await AssignEmployees(ns, division, "Aevum", AevumSpread(aevum_differential - office_size));
            return;
        }
    }

    let upgrade_cost = 0;
    for (const city of cities) {
        upgrade_cost += ns.corporation.getOfficeSizeUpgradeCost(division, city, 30);
    }

    if (money_available > upgrade_cost * 2) {
        for (const city of cities) {
            await HireEmployees(ns, division, city, 30);
            await ns.sleep(100);
            if (city == "Aevum") {
                await AssignEmployees(ns, division, city, AevumSpread(30));
                continue;
            }
            await AssignEmployees(ns, division, city, NormalSpread(30));
        }
    }
}