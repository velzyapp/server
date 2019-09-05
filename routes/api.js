const express = require("express");
const router = express.Router();
const Velzy = require("../lib/velzy");

//Table listing
router.get("/tables", async (req,res) => {
  const tableList = await Velzy.tableList();
  res.json(tableList);
})

//TopN is default, but can take query bits too
router.get("/tables/:name", async (req,res) => {
  const pageSize = req.query.pageSize || 100;
  const page = req.query.page || 1;
  const orderBy = req.query.orderBy || "id";
  const orderDir = req.query.orderDir || "desc"
  const tableName = req.params.name;
  console.log(`Getting top ${pageSize} of ${tableName}`);
  const topN = await Velzy.query({
    collection:req.params.name,
    page: page,
    orderBy: orderBy,
    pageSize: pageSize,
    orderDir: orderDir
  });
  const out = topN.map(r => r.body)
  res.json(out)
})


//Fuzzy search
router.get("/tables/:name/contains", async (req,res) => {
  const tableName = req.params.name;
  const key = req.query.key;
  const term = req.query.term;
  if(!key || !term){
    res.json({
      success: false,
      error: "A key and term is required to be sent via query"
    })
  }else{
    const result = await Velzy.contains(tableName, key, term);
    const out = result.map(r => r.body)
    res.json(out)
  }

})

//text search
router.get("/tables/:name/search", async (req,res) => {
  const tableName = req.params.name;
  const query = req.query.q;
  if(!query){
    res.json({
      success: false,
      error: "No query was received"
    })
  }else{
    const result = await Velzy.search(tableName,query);
    res.json(result)
  }
})

//single record by id
router.get("/tables/:name/:id", async (req,res) => {
  const tableName = req.params.name;
  const id = req.params.id;
  if(!id){
    res.json({
      success: false,
      error: "No ID received"
    })
  }else{
    const result = await Velzy.single({collection: tableName,id: id});
    const out = result ? result.body : null;
    res.json(out)
  }
})

module.exports = router;
