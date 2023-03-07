import {
    ProductHandler,
    StartDevelopment,
    EmployeeHandler
} from "/corps/handlers.js"

/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    const division = ns.args[0];
    const development_city = "Aevum";

    let product = parseInt(ns.corporation.getDivision(division).products.pop()) || 1;
    if (product == 1) { StartDevelopment(ns, division, development_city, product) }
    await ns.sleep(100);

    while (true) {
        product = await ProductHandler(ns, division, development_city, product);
        await EmployeeHandler(ns, division);
        await ns.sleep(10000);
    }
}