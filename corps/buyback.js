/** @param {import("../.vscode").NS} ns */
export async function main(ns) {
    const money = ns.getServerMoneyAvailable("home");
    const sharePrice = ns.corporation.getCorporation().sharePrice;

    let shareMax = Math.floor(money / sharePrice);
    
    const shareAmount = Math.min(shareMax, ns.corporation.getCorporation().issuedShares)

    ns.print(money);
    ns.print(sharePrice);
    ns.print(shareAmount);

    ns.corporation.buyBackShares(shareAmount);
    ns.tprintf("Bought " + shareAmount + " shares back.");
}