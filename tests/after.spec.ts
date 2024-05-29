import {expect, test} from "@playwright/test";

test('repo dispatch', async ({ request }) => {
    const {
        NEXT_TESTS,
        REPO_OWNER,
        REPO_NAME,
        GITHUB_TOKEN,
    } = process.env;

    console.log('next tests to run:');
    console.log(NEXT_TESTS);

    let payload = {
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json"
        },
        data: {
            event_type: "RunMonolithTests/next",
            client_payload: {
                current: 9,
                next: NEXT_TESTS
            }
        }
    };

    if(!REPO_OWNER || !REPO_NAME || !GITHUB_TOKEN) {
        throw new Error('Owner and repo required');
    }

    const [owner, repo] = REPO_NAME.split('/');
    const dispatchUrl = `https://api.github.com/repos/${owner}/${repo}/dispatches`;

    console.log(`Dispatching ${dispatchUrl} with payload`, payload);

    const res = await request.post(dispatchUrl, payload);

    return res.status;
});