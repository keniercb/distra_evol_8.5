CREATE TYPE mod_logactivofijotangible.td_listgeneralsubmayor AS (
  disponible NUMERIC(19,1),
  cantidad NUMERIC(19,1),
  denominacion VARCHAR(255),
  codigo VARCHAR(255),
  naturaleza VARCHAR(255),
  marca VARCHAR(255),
  marcaestado NUMERIC(1,0),
  modelo VARCHAR(255),
  modeloestado NUMERIC(1,0),
  marcamodelo VARCHAR(255),
  indicador NUMERIC(19,1),
  numeropieza VARCHAR(255),
  activ1000000006 NUMERIC(19,1),
  activ1000000008 NUMERIC(19,1),
  activ1000000007 NUMERIC(19,1)
);

ALTER TYPE mod_logactivofijotangible.td_listgeneralsubmayor
  OWNER TO zeolides;





--funcion--


CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_listgeneralsubmayor (
p_idestructura NUMERIC,   
p_arrayidestructura VARCHAR,  
p_administrativo NUMERIC,  
p_servicio NUMERIC,  
p_auxiliar NUMERIC
)
RETURNS SETOF mod_logactivofijotangible.td_listgeneralsubmayor AS
$body$
DECLARE

  v_rec mod_logactivofijotangible.td_listgeneralsubmayor;
  
BEGIN

  FOR v_rec IN
  
  	SELECT
                (
                    SELECT count(rn2.idregnumerico)
                    FROM mod_logactivofijotangible.dat_registronumerico rn2
                    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna ON rna.idregnumerico = rn2.idregnumerico
                    INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn2.idproducto
                    INNER JOIN mod_logactivofijotangible.nom_actividad na ON na.idactividad = rna.idactividad
                    INNER JOIN mod_logactivofijotangible.nom_estatustecnico net on net.idestatustecnico = rna.idestatustecnico
                    WHERE p.idindicador = i.idindicador
                    AND p.cronologia > 0 
                   AND p.idestructura = any (cast('{' || p_arrayidestructura || '}' as NUMERIC[])) 
                    AND rna.idestadoperacion not in (0,6,5,7,8,9)
                    AND na.denominacion NOT ILIKE '%P/B%' AND net.denominacion NOT LIKE 'Mal Estado'
                ) AS disponible,
                (
                    SELECT count(rn2.idregnumerico)
                    FROM mod_logactivofijotangible.dat_registronumerico rn2
                    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna ON rna.idregnumerico = rn2.idregnumerico
                    INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn2.idproducto
                    WHERE p.idindicador = i.idindicador
                    AND p.cronologia > 0 
                    AND p.idestructura = any (cast('{' || p_arrayidestructura || '}' as NUMERIC[]))
                     AND rna.idestadoperacion not in (0,6,5,7,8,9)
                ) AS cantidad,
                	i.denominacion as denominacion,
                    i.codigo as codigo,
                    nat.denominacion as naturaleza,
                    marc.denominacion as marca,
                    marc.estado as marcaestado,
                    model.denominacion as modelo,
                    model.estado as modeloestado,
                    ((Case When ih.idmarca is not null Then
                    (marc.denominacion  || (Case When ih.idmodelo is not null Then ' - ' Else '' End)) Else '' End)  || (Case
                    When ih.idmodelo is not null Then model.denominacion Else '' End)) AS marcamodelo,
                    i.idindicador as idindicador,
                    i.numeropieza as numeropieza,
                (
                    SELECT count(rn3.idregnumerico)
                    FROM mod_logactivofijotangible.dat_registronumerico rn3
                    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna1000000006
                    ON rna1000000006.idregnumerico = rn3.idregnumerico
                    INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn3.idproducto
                    WHERE p.idindicador = i.idindicador
                    AND p.cronologia > 0 
                    AND p.idestructura = any (cast('{' || p_arrayidestructura || '}' as NUMERIC[])) 
                    AND rna1000000006.idestadoperacion not in (0,6,5,7,8,9)
                    AND rna1000000006.idactividad = p_administrativo
                ) AS activ1000000006,
                (
                    SELECT count(rn3.idregnumerico)
                    FROM mod_logactivofijotangible.dat_registronumerico rn3
                    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna1000000008
                    ON rna1000000008.idregnumerico = rn3.idregnumerico
                    INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn3.idproducto
                    WHERE p.idindicador = i.idindicador
                    AND p.cronologia > 0
                    AND p.idestructura  = any (cast('{' || p_arrayidestructura || '}' as NUMERIC[])) 
                    AND rna1000000008.idestadoperacion not in (0,6,5,7,8,9)
                	AND rna1000000008.idactividad = p_servicio
                ) AS activ1000000008,
                (
                    SELECT count(rn3.idregnumerico)
                    FROM mod_logactivofijotangible.dat_registronumerico rn3
                    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna1000000007
                    ON rna1000000007.idregnumerico = rn3.idregnumerico
                    INNER JOIN mod_logistica.dat_producto p ON p.idproducto = rn3.idproducto
                    WHERE p.idindicador = i.idindicador
                    AND p.cronologia > 0 
                    AND p.idestructura  = any (cast('{' || p_arrayidestructura || '}' as NUMERIC[]))
                     AND rna1000000007.idestadoperacion not in (0,6,5,7,8,9)
                	AND rna1000000007.idactividad = p_auxiliar
                ) AS activ1000000007 
                
 		FROM mod_datosmaestros.nom_indicador i
                      INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on i.idindicador = ih.idindicador
                      INNER JOIN mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = i.idnaturaleza
                      LEFT JOIN mod_datosmaestros.nom_marca marc on ih.idmarca = marc.idmarca
                      LEFT JOIN mod_datosmaestros.nom_modelo model on ih.idmodelo = model.idmodelo
                      
 		WHERE (SELECT p.idestructura FROM mod_logistica.dat_producto p
                      INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON rn.idproducto = p.idproducto
                      INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna3 on rna3.idregnumerico = rn.idregnumerico
                      WHERE p.idindicador = i.idindicador
                      AND p.cronologia > 0
                      AND p.idestructura  = any (cast('{' || p_arrayidestructura || '}' as NUMERIC[])) 
                      AND rna3.idestadoperacion not in (0,6,5,7,8,9)
                      LIMIT 1
              ) IS NOT NULL AND ih.explotacion = 1
  		     
	loop

      return next v_rec;

    end loop;
        
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE;