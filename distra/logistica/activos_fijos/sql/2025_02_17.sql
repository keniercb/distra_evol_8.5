CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_modelo_resumen (
  p_iddocumento numeric
)
RETURNS TABLE (
  denominacion varchar,
  cantidad numeric,
  estado varchar,
  cant_estado bigint,
  nroinventario varchar,
  responsable varchar
) AS
$body$
BEGIN
    RETURN QUERY
   SELECT DISTINCT
        drna.denominacion,
        m.cantidad,
        CASE
            WHEN minv.color = 'negro' THEN 'verificado'
            WHEN minv.color = 'rojo' THEN 'faltante'
            WHEN minv.color = 'verde' THEN 'sobrante'
            ELSE 'desconocido'
        END::VARCHAR(20) AS estado,
        COUNT(*) OVER(PARTITION BY 
            CASE
                WHEN minv.color = 'negro' THEN 'verificado'
                WHEN minv.color = 'rojo' THEN 'faltante'
                WHEN minv.color = 'verde' THEN 'sobrante'
                ELSE 'desconocido'
            END) AS cant_estado,
        drna.nroinventario,
        CONCAT_WS(' ', 
            pers.nombre, 
            pers.snombre, 
            pers.papel, 
            pers.sapel
        )::VARCHAR AS responsable
    FROM
        mod_logistica.dat_movimiento m
    INNER JOIN
        mod_logistica.dat_producto p ON p.idproducto = m.idproducto
    INNER JOIN
        mod_logactivofijotangible.dat_registronumerico drn ON drn.idproducto = p.idproducto
    INNER JOIN
        mod_logactivofijotangible.dat_regnumericoactivo drna ON drna.idregnumerico = drn.idregnumerico
    INNER JOIN
        mod_logactivofijotangible.dat_movregnumerico dmrn ON dmrn.idmovimiento = m.idmovimiento AND dmrn.idregnumerico = drn.idregnumerico
    INNER JOIN
        mod_logactivofijotangible.dat_movregnumericoactivo dmrna ON dmrna.idmovregnumerico = dmrn.idmovregnumerico
    LEFT JOIN
        mod_logactivofijotangible.dat_movregnumericoinventario minv ON minv.idmovregnumerico = dmrna.idmovregnumerico
    LEFT JOIN
        mod_logactivofijotangible.dat_responsable resp ON drna.idresponsable = resp.idresponsable
    LEFT JOIN
        mod_persona.dat_persona pers ON pers.idpersona = resp.idpersona
    WHERE
        m.iddocumento = p_iddocumento AND drna.idnaturaleza NOT IN (-8, -7)
    ORDER BY estado;
       
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logactivofijotangible.f_modelo_resumen (p_iddocumento numeric)
  OWNER TO zeolides;