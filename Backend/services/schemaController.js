/**
 * @param {takes schema1 and schma2 }
 * @returns {returns the input in json format}
 */
async function fetchSchemaData(req, res) {
  res.json({ schema1, schema2 });
}

module.exports = { fetchSchemaData };
