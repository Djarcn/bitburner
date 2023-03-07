import {
    HireEmployees,
    AssignEmployees,
    UpgradeWarehouse,
    BuyMaterials
} from "/corps/utils.js"

const agriculture_division = "Seed"
const cities = ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"];
let employmentSpread = {
    "Operations": 1,
    "Engineer": 1,
    "Business": 1,
    "Management": 0,
    "Research & Development": 0,
    "Training": 0,
    "Unassigned": 0
}
let materials = {
    "Hardware": 125,
    "Robots": 0,
    "AI Cores": 75,
    "Real Estate": 27000
}

/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    //Create corporation, create agriculture industry, unlock smart supply
    ns.corporation.createCorporation("Sneed\'s Seed and Feed", false); //false will only work on bitnode 3
    ns.corporation.expandIndustry("Agriculture", agriculture_division);
    ns.corporation.unlockUpgrade("Smart Supply");

    //Expand division to all cities
    for (const city of cities) {
        if (ns.corporation.getDivision(agriculture_division).cities.includes(city)) { continue }
        ns.corporation.expandCity(agriculture_division, city);
        await ns.sleep(100);
    }

    //Enable smart supply, hire and assign employees, upgrade warehouses, and start selling in all cities
    for (const city of cities) {
        await UpgradeWarehouse(ns, agriculture_division, city, 300);

        ns.corporation.setSmartSupply(agriculture_division, city, true);

        await HireEmployees(ns, agriculture_division, city, 3);
        await AssignEmployees(ns, agriculture_division, city, employmentSpread);

        ns.corporation.hireAdVert(agriculture_division);

        ns.corporation.sellMaterial(agriculture_division, city, "Plants", "MAX", "MP");
        ns.corporation.sellMaterial(agriculture_division, city, "Food", "MAX", "MP");
        await ns.sleep(100);
    }

    await ns.prompt("You have 1 minute to purchase:\n2 FocusWires, 2 Neural Accelerators, 2 Speech Processor Implants, 2 Nuoptimal Nootropic Injector Implants, and 2 Smart Factories.\nTime will start when you press Yes");
    ns.tprint("\n2 FocusWires\n2 Neural Accelerators\n2 Speech Processor Implants\n2 Nuoptimal Nootropic Injector Implants\n2 Smart Factories")
    await ns.sleep(60000)

    //Buy materials in all cities
    for (const city of cities) {
        await BuyMaterials(ns, agriculture_division, city, materials);
    }

    //Wait for investment offer to reach $210b then accept
    while (ns.corporation.getInvestmentOffer().funds < 210000000000) { await ns.sleep(3000) }
    ns.corporation.acceptInvestmentOffer();

    //Increase employee capacity, hire employees, fill jobs as specified in array
    for (const city of cities) {
        ns.corporation.upgradeOfficeSize(agriculture_division, city, 6);
        await HireEmployees(ns, agriculture_division, city, 6);
        employmentSpread = {
            "Operations": 2,
            "Engineer": 2,
            "Business": 1,
            "Management": 2,
            "Research & Development": 2,
            "Training": 0,
            "Unassigned": 0
        }
        await AssignEmployees(ns, agriculture_division, city, employmentSpread);
    }
    
    await ns.prompt("You have 1 minute to purchase up to 10 Smart Factories and 10 Smart Storage.\nTime will start when you press Yes");
    ns.tprint("\n10 Smart Factories\n10 Smart Storage");
    await ns.sleep(60000)

    //Upgrade all warehouses to 2k capacity
    for (const city of cities) {
        await UpgradeWarehouse(ns, agriculture_division, city, 2000);
    }

    //Update materials object and buy materials
    for (const city of cities) {
        materials = {
            "Hardware": 2800,
            "Robots": 96,
            "AI Cores": 2520,
            "Real Estate": 146400
        }
        await BuyMaterials(ns, agriculture_division, city, materials);
    }

    //Wait for investment offer to reach $5t then accept
    while (ns.corporation.getInvestmentOffer().funds < 5000000000000) { await ns.sleep(3000) }
    ns.corporation.acceptInvestmentOffer();

    //Upgrade all warehouses to 3.8k capacity
    for (const city of cities) {
        await UpgradeWarehouse(ns, agriculture_division, city, 3800);
    }

    //Update materials object and buy materials
    for (const city of cities) {
        materials = {
            "Hardware": 9300,
            "Robots": 726,
            "AI Cores": 6270,
            "Real Estate": 230400
        }
        await BuyMaterials(ns, agriculture_division, city, materials);
    }

    ns.tprint("Setup is finished.");
}
