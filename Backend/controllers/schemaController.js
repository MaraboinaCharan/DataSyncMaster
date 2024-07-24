async function fetchSchemaData(req, res) {
  // console.log({ schema1, schema2 });

  res.json({ schema1, schema2 });
}

module.exports = { fetchSchemaData };
