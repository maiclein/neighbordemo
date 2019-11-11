import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | writing', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:writing');
    assert.ok(route);
  });
});
