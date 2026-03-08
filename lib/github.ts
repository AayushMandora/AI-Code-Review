export async function getUserRepos(accessToken: string) {
    const res = await fetch("https://api.github.com/user/repos?sort=updated&per_page=20", {
        headers: { Authorization: `Bearer ${accessToken}` },
    })
    return res.json()
}

export async function getRepoPRs(accessToken: string, owner: string, repo: string) {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=open`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    })
    return res.json()
}

export async function getPRDiff(accessToken: string, owner: string, repo: string, pullNumber: number) {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3.diff", // returns raw diff
        },
    })
    return res.text()
}