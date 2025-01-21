// * INDEX
function index(req, res) {
  res.send(`Show data`);
}

// * SHOW
function show(req, res) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    /* throw error for middleware errorHandler */
    const err = new Error("Id required not valid");
    err.status = 400;
    err.error = "Bad request by client";
    throw err;
  }

  res.send(`Show data with id ${id}`);
}

// * STORE
function store(req, res) {
  res.send(`Store data`);
}

// * UPDATE
function update(req, res) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    /* throw error for middleware errorHandler */
    const err = new Error("Id required not valid");
    err.status = 400;
    err.error = "Bad request by client";
    throw err;
  }

  res.send(`Update data with id ${id}`);
}

// * MODIFY
function modify(req, res) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    /* throw error for middleware errorHandler */
    const err = new Error("Id required not valid");
    err.status = 400;
    err.error = "Bad request by client";
    throw err;
  }

  res.send(`Modify data with id ${id}`);
}

// * DESTROY
function destroy(req, res) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    /* throw error for middleware errorHandler */
    const err = new Error("Id required not valid");
    err.status = 400;
    err.error = "Bad request by client";
    throw err;
  }

  res.send(`Delete data with id ${id}`);
}

// * EXPORT METHODS
module.exports = { index, show, store, update, modify, destroy };
