module.exports = (robot) => {
  robot.on('pull_request', async context => {
    const { payload, github, issue } = context;
    const isMerged = payload.action === 'closed' && payload.pull_request.merged;
    const isMaster = payload.pull_request.base.ref === 'master';

    if(!isMerged || !isMaster) return;

    let action;
    const head = 'master';
    const base = 'develop';

    try {
      const merge = issue({
        base,
        head
      });

      action = await github.repos.merge(merge);
    } catch (e) {
      const pullRequest = issue({
        title: 'Merge with master - Conflict!',
        head,
        base
      });

      action = await github.pullRequests.create(pullRequest);
    } finally {
      return action;
    }
  });
}
