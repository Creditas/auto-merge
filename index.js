module.exports = (robot) => {
  robot.on('pull_request', async context => {
    const isMerged = context.action === 'closed' && context.pull_request.merged;
    const isMaster = context.pull_request.base.ref === 'master';

    if(!isMerged || !isMaster) return;

    let action;
    const head = 'master';
    const base = 'develop';

    try {
      action = context.github.repos.merge({
        base,
        head
      });
    } catch (e) {
      action = constext.github.pullRequests.create({
        title: 'Merge with master - conflict!',
        head,
        base
      });
    } finally {
      return action;
    }
  });
}
