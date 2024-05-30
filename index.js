const https = require('https');

const {
    TEST_TAG,
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

if (testsToRunNext.length) {
    let payload = {
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
        },
        data: {
            event_type: "RunMonolithTests/next",
            client_payload: {
                maxParallel: MAX_PARALLEL,
                testTag: TEST_TAG,
                nextTests: testsToRunNext.join('|'),
                leftTests: otherTestsToRun.join('|'),
                stop: testsToRunNext.length === 0
            }
        }
    };

    if (!REPO_OWNER || !REPO_NAME || !GITHUB_TOKEN) {
        throw new Error('Owner and repo required');
    }

    const [owner, repo] = REPO_NAME.split('/');
    const dispatchUrl = `https://api.github.com/repos/${owner}/${repo}/dispatches`;

    const postData = JSON.stringify(payload);
    console.log(`Dispatching ${dispatchUrl} with payload`, JSON.stringify(payload, null, 2));

    const options = {
        hostname: 'api.github.com',
        port: 443,
        path: `/repos/${owner}/${repo}/dispatches`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };

    const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });

    req.on('error', (error) => {
        console.error(error);
    });

    req.write(postData);
    req.end();
}