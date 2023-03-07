/** @param {import("../.vscode").NS} ns */
export async function HireEmployees(ns, division, city, amount) {
    const office_capacity = ns.corporation.getOffice(division, city).size;
    const office_employees = ns.corporation.getOffice(division, city).employees.length;

    if (office_capacity < amount + office_employees) {
        const differential = office_employees + amount - office_capacity;
        ns.corporation.upgradeOfficeSize(division, city, differential);
    }

    for (let i = 0; i < amount; i++) { ns.corporation.hireEmployee(division, city) }
}

/** @param {import("../.vscode").NS} ns */
export async function AssignEmployees(ns, division, city, spread) {
    //spread object must be 7 properties with the last being 0
    for (const job of Object.keys(spread)) {
        let current_employees_in_job = ns.corporation.getOffice(division, city).employeeJobs[job];
        const desired_employees_in_job = current_employees_in_job + spread[job];
        if (current_employees_in_job >= desired_employees_in_job) { continue }

        for (const employee of ns.corporation.getOffice(division, city).employees) {
            if (ns.corporation.getEmployee(division, city, employee).pos == "Unassigned") {
                await ns.corporation.assignJob(division, city, employee, job);

                current_employees_in_job++;
                if (current_employees_in_job >= desired_employees_in_job) { break }
            }
        }
    }
}

/** @param {import("../.vscode").NS} ns */
export function AevumSpread(new_employees) {
    const assignment1 = new_employees / 6;
    const asignment2 = new_employees / 3;
    return {
        "Operations": assignment1,
        "Engineer": assignment1,
        "Business": assignment1,
        "Management": assignment1,
        "Research & Development": asignment2,
        "Training": 0,
        "Unassigned": 0
    }
}

/** @param {import("../.vscode").NS} ns */
export function NormalSpread(new_employees) {
    const assignment = new_employees / 2;
    return {
        "Operations": assignment,
        "Engineer": 0,
        "Business": assignment,
        "Management": 0,
        "Research & Development": 0,
        "Training": 0,
        "Unassigned": 0
    }
}

/** @param {import("../.vscode").NS} ns */
export async function UpgradeWarehouse(ns, division, city, capacity) {
    if (!ns.corporation.hasWarehouse(division, city)) { ns.corporation.purchaseWarehouse(division, city) }
    while (ns.corporation.getWarehouse(division, city).size < capacity) {
        ns.corporation.upgradeWarehouse(division, city);
        await ns.sleep(100);
    }
    return;
}

/** @param {import("../.vscode").NS} ns */
export async function BuyMaterials(ns, division, city, materials) {
    //materials parameter must be an object
    const materialArray = Object.keys(materials);

    const targetAmount = Object.values(materials);
    const currentAmount = [];

    for (let i = 0; i < materialArray.length; i++) {
        while (true) {
            currentAmount[i] = ns.corporation.getMaterial(division, city, materialArray[i]).qty;
            if ( currentAmount[i] >= targetAmount[i] ) { break }
            const amountToBuy = (targetAmount[i] - currentAmount[i]) / 10;
            ns.corporation.buyMaterial(division, city, materialArray[i], amountToBuy);
            await ns.sleep(1000);
        }
        ns.corporation.buyMaterial(division, city, materialArray[i], 0);
    }
}