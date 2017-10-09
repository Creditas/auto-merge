module.exports = (robot) => {
  robot.on('pull_request', async context => {
    const isMerged = context.payload.action === 'closed' && context.payload.pull_request.merged;
    const isMaster = context.payload.pull_request.base.ref === 'master';

    if(!isMerged || !isMaster) return;

    let action;
    const head = 'master';
    const base = 'develop';

    try {
      action = context.github.repos.merge(context.issue({
        base,
        head
      }));
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
