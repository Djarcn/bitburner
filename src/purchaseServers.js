/**
* @param {NS} ns
**/
/** @param {import("..").NS} ns */

export async function main(ns) {
    ns.tail();
    // How much RAM each purchased server will have.
    let ram = Math.pow(2,Math.floor(Math.log((ns.getServerMoneyAvailable("home")/ns.getPurchasedServerLimit())/55000)/Math.log(2)));
    let hostname = "foo";

    // Iterator we'll use for our loop
    let i = 0;

    // Continuously try to purchase servers until we've reached the maximum
    // amount of servers
    while (i < ns.getPurchasedServerLimit()) {
        // Check if we have enough money to purchase a server
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
            // If we have enough money, then:
            //  1. Purchase the server
            //  2. Copy our hacking script onto the newly-purchased server
            //  3. Run our hacking script on the newly-purchased server with 3 threads
            //  4. Increment our iterator to indicate that we've bought a new server
            if (!ns.serverExists("pserv-" + i))
                hostname = ns.purchaseServer("pserv-" + i, ram);
            ++i;
        }
        else
            await ns.sleep(6000);
    }
}