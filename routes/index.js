const express = require("express");
const router = express.Router();
const Velzy = require("../lib/velzy");

//admin root
router.get("/", (req,res) => {
  res.render("index")
});

router.get("/tables", async (req,res) => {
  const tableList = await Velzy.tableList();
  res.json({
    tables: tableList
  });
});

router.get("/tables/:name", async (req,res) => {
  console.log("Asking for ", req.params.name);
  try{
    const records = await Velzy[req.params.name].query({criteria: null});
    res.json({
      table: req.params.name,
      records: records
    })
  }catch(err){
    res.json({
      success: false,
      error: err.message
    })
  }
});

router.get("/tables/:name/search", async (req, res) => {
  const tableName = req.params.name;
  const term = req.query.q;
  console.log("Searching... ", tableName, term);
  if (term) {
    const results = await Velzy[req.params.name].search(term);
    console.log(results);
    res.json({
      success: true,
      tableName: req.params.name,
      term: term,
      results: results
    })
  } else {
    res.json({
      success: false,
      tableName: req.params.name,
      error: "No search term provided"
    })
  }
})


router.get("/tables/:name/:id", async (req,res) => {
  console.log("Record request... ", req.params.name, req.params.id);
  try{
    const record = await Velzy[req.params.name].get(
      req.params.id
    );
    res.json({
      table: req.params.name,
      record: record
    })
  }catch(err){
    res.json({
      success: false,
      error: err.message
    })
  }

});

router.post("/tables/:name", async (req,res) => {
  console.log("Incoming save for ", req.params.name, req.body);
  const tableName = req.params.name;
  const doc = req.body;
  try{
    const result = await Velzy[tableName].save(doc);
    res.json({
      success: true,
      record: result,
      table: tableName
    })
  }catch(err){
    console.error(err)
    res.json({
      success: false,
      error: err.message
    })
  }

});


router.delete("/tables/:name/:id", async (req, res) => {
  const id = req.params.id;
  const tableName = req.params.name;
  console.log("Delete request incoming: ", tableName,id);

  try{
    const result = await Velzy[tableName].delete(id);
    res.json({
      success: result.deleted,
      record: {
        id: result.id //need this to remove from client
      },
      tableName: tableName
    });
  }catch(err){
    console.error(err);
    res.json({
      success: false,
      error: err.message
    })
  }
});


module.exports = router;
