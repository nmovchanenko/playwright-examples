import {expect, test} from "@playwright/test";

test('repo dispatch', async ({ request }) => {
    const {
        CURRENT_TESTS,
        NEXT_TESTS,
        REPO_OWNER,
        REPO_NAME,
        GITHUB_TOKEN,
    } = process.env;

    console.log('current tests:');
    console.log(CURRENT_TESTS);
    console.log('next tests to run:');
    console.log(NEXT_TESTS);

    const limit = 3;

    const testsToRunNext = [];
    const otherTestsToRun = [];

    NEXT_TESTS.split('|').forEach((testId, index) => {
        if (index < limit) {
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
                current: testsToRunNext.join('|'),
                next: otherTestsToRun.join('|')
            }
        }
    };

    if(!REPO_OWNER || !REPO_NAME || !GITHUB_TOKEN) {
        throw new Error('Owner and repo required');
    }

    const [owner, repo] = REPO_NAME.split('/');
    const dispatchUrl = `https://api.github.com/repos/${owner}/${repo}/dispatches`;

    console.log(`Dispatching ${dispatchUrl} with payload`, JSON.stringify(payload, null, 2));

    // const res = await request.post(dispatchUrl, payload);

    // return res.status;
});