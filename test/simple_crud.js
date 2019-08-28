describe("CRUD Ops", async () => {
  before(async () => {
    await Velzy.run("drop table if exists velzy.puppies");
    await Velzy.puppies.save({ id: 100, name: "Larry", goodBoy: false });
  });

  it("updates the doc price with a quick, non-destructive modify", async () => {
    const doc = await Velzy.puppies.modify(100, { goodBoy: true });
    const saved = await Velzy.puppies.get(100);
    assert.equal(true, saved.body.goodBoy)
  });

  it("says goodbye and deletes", async () => {
    await Velzy.puppies.delete(100);
    const found = await Velzy.puppies.get(100);
    assert(!found)
  })
})
