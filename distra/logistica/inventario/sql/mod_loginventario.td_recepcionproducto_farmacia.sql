DROP TYPE IF EXISTS mod_loginventario.td_recepcionproducto_farmacia;

CREATE TYPE mod_loginventario.td_recepcionproducto_farmacia AS
(
codigo VARCHAR,
  categoria VARCHAR,
  nombreproducto VARCHAR,
  unidadmedida VARCHAR,
  -- piloto_precio_publico NUMERIC,
  cantidadproducto NUMERIC(25,6),
  preciocontable NUMERIC(25,6),
  importetotal NUMERIC(25,6),
  saldo NUMERIC(25,6),
  recargodescuento NUMERIC(19,6),
  preciounitariototal NUMERIC(19,6),
  precioalternativo NUMERIC(25,6),
  importealternativo NUMERIC(25,6),
  monedaalternativa VARCHAR,
  monedacontable VARCHAR,
  cantidadporfactura NUMERIC(25,6),
  idmovimiento NUMERIC(19,0),
  importecup NUMERIC(25,6),
  importecuc NUMERIC(25,6),
  ubicacion VARCHAR(255)
);

ALTER TYPE mod_loginventario.td_recepcionproducto_farmacia OWNER TO zeolides;

-- OR REPLACE FUNCTION mod_loginventario.f_mercanciadistribuida(
--p_idestructuraorigen numeric,
--p_idestructuradestino numeric,
--p_idestructuradeposito numeric,
--p_fdesde date,
--p_fhasta date,
--p_estado numeric
--)