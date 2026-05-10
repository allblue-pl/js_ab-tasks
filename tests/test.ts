import chain from "./chain.ts";
import promises from "./promises.ts";
import simple from "./simple.ts";
import waitFor from "./wait-for.ts";

new Promise<void>(function(resolve, reject) {
    console.log('Testing...');
    resolve();
        })
    // .then(() => {
    //     return simple();
    // })
    // .then(() => {
    //     return chain();
    // })
    // .then(() => {
    //     return promises();
    // })
    .then(() => {
        return waitFor();
    })
    .then(() => {
        console.log('\nTesting finished.');
    })
    .catch(function(err) {
        console.error('Error:');
        console.error(err.stack);
    });
