import {expect, test} from "@playwright/test";

test('repo dispatch', async ({ request }) => {
    const {
        MAX_PARALLEL,
        LEFT_TESTS,
        NEXT_TESTS,
        REPO_OWNER,
        REPO_NAME,
        GITHUB_TOKEN,
    } = process.env;

    console.log('Max parallel:');
    console.log(MAX_PARALLEL);
    console.log('current tests:');
    console.log(NEXT_TESTS);
    console.log('left tests to run:');
    console.log(LEFT_TESTS);

    const testsToRunNext = [];
    const otherTestsToRun = [];

    LEFT_TESTS.split('|').forEach((testId, index) => {
        if (index < Number(MAX_PARALLEL)) {
            testsToRunNext.push(testId);
        } else {
            otherTestsToRun.push(testId);
        }
    })

    let payload = {
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json"
        },
        data: {
            event_type: "RunMonolithTests/next",
            client_payload: {
                nextTests: testsToRunNext.join('|'),
                leftTests: otherTestsToRun.join('|'),
                stop: testsToRunNext.length === 0
            }
        }
    };

    if(!REPO_OWNER || !REPO_NAME || !GITHUB_TOKEN) {
        throw new Error('Owner and repo required');
    }

    const [owner, repo] = REPO_NAME.split('/');
    const dispatchUrl = `https://api.github.com/repos/${owner}/${repo}/dispatches`;

    console.log(`Dispatching ${dispatchUrl} with payload`, JSON.stringify(payload, null, 2));

    const res = await request.post(dispatchUrl, payload);

    return res.status;
});