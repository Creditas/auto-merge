module.exports = (robot) => {
  robot.on('pull_request', async context => {
    const {
      payload,
      github,
      issue,
      config
    } = context;
    const { head, base } = config('auto-merge');
    const hasInvalidConfig = !head || !base;
    const isInvalidPullRequest = isValidPullRequest(payload);
    let action;

    if(isInvalidPullRequest || hasInvalidConfig) return;

    try {
      action = await createMerge(issue, github);
    } catch (e) {
      action = await createPullRequest(issue, github);
    } finally {
      return action;
    }
  });
}

function createMerge(issue, github) {
  const config = issue({
    base,
    head
  });

  return github.repos.merge(config);
}

function createPullRequest(issue, github) {
  const config = issue({
    title: 'Merge with master - Conflict!',
    head,
    base
  });

  return github.pullRequests.create(config);
}

function isValidPullRequest(payload) {
  const isMerged = payload.action === 'closed' && payload.pull_request.merged;
  const isCofigBranch = payload.pull_request.base.ref === 'master';

  return isMerged && isConfigBranch;
}
