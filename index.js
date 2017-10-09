module.exports = (robot) => {
  robot.on('release', async context => {
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
