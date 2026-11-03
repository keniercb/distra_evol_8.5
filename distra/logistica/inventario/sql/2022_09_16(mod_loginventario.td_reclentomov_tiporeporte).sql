CREATE TYPE mod_loginventario.td_reclentomov_tiporeporte AS (
  idproducto NUMERIC(19,0),
  codigo VARCHAR,
  denominacion VARCHAR,
  fechamov DATE,
  cantidad NUMERIC(25,6),
  operacion VARCHAR,
  existencia NUMERIC(25,6),
  disponible NUMERIC(25,6),
  cant NUMERIC(25,6),
  deposito VARCHAR,
  almacen VARCHAR,
  logo TEXT,
  umedida VARCHAR
);

ALTER TYPE mod_loginventario.td_reclentomov_tiporeporte
  OWNER TO zeolides;