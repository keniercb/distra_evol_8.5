DROP FUNCTION mod_logfacturacion.fn_subreporteconceptoscrosstab(p_iddocumento numeric, p_monedacontable numeric, p_monedaalternativa numeric);
DROP TYPE mod_logfacturacion.td_subreporteconceptoscrosstab;


CREATE TYPE mod_logfacturacion.td_subreporteconceptoscrosstab AS (
  idfactura NUMERIC,
  cl NUMERIC,
  gav NUMERIC,
  rcc NUMERIC,
  transp NUMERIC
);

ALTER TYPE mod_logfacturacion.td_subreporteconceptoscrosstab
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logfacturacion.fn_subreporteconceptoscrosstab (
  p_iddocumento numeric,
  p_monedacontable numeric,
  p_monedaalternativa numeric
)
RETURNS SETOF mod_logfacturacion.td_subreporteconceptoscrosstab AS
$body$
DECLARE
  all_record mod_logfacturacion.td_subreporteconceptoscrosstab;
BEGIN
  for all_record in (
  	SELECT *
FROM   crosstab(
   'SELECT ' || p_iddocumento || ' as idfactura,codigo,valorcup
    FROM mod_logfacturacion.fn_subreporteconceptos (
  ' || p_iddocumento || ',
  ' || p_monedacontable || ',
  ' || p_monedaalternativa || '
)
   ORDER BY 1,2'
   ) AS valorcup ("idfactura" int,"CL" numeric, "GAV" numeric, "RCC" numeric, "TRANSP" numeric )
  )
  loop
      return next all_record;
  end loop;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logfacturacion.fn_subreporteconceptoscrosstab (p_iddocumento numeric, p_monedacontable numeric, p_monedaalternativa numeric)
  OWNER TO zeolides;