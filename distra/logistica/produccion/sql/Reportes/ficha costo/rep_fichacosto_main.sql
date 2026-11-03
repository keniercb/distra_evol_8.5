DROP TYPE IF EXISTS mod_logistica.td_fichacosto;
CREATE TYPE mod_logistica.td_fichacosto AS
(
	idcartatecindustrial numeric,
	logo character varying(255),
	entidad character varying(100),
	nrodoc numeric(19,0),
	denominacioncarta character varying(100),
	cantidadorden numeric,
	importeplan numeric,
	importer numeric,
	precior numeric
);
ALTER TYPE mod_logistica.td_fichacosto OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_logistica.f_fichacosto(p_idestructura numeric, p_iddocumento numeric, p_idcartatecindustrial numeric)
    RETURNS SETOF mod_logistica.td_fichacosto 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$

declare

begin
    return query (
        SELECT DISTINCT ctia.idcartatecindustrial,
                (SELECT cg.urllogo FROM mod_logistica.conf_general cg WHERE cg.idestructura = p_idestructura) as logo,

                (CASE WHEN (SELECT de.denominacion FROM mod_estructuracomp.dat_estructura de WHERE de.idestructura = p_idestructura limit 1) IS NOT NULL 
                        THEN
                            (SELECT de.denominacion FROM mod_estructuracomp.dat_estructura de WHERE de.idestructura = p_idestructura limit 1) 
                        ELSE
                            (SELECT deop.denominacion FROM mod_estructuracomp.dat_estructuraop deop WHERE deop.idestructuraop = p_idestructura limit 1) END) as entidad,

                (SELECT d.nrodoc FROM mod_logistica.dat_documento d where d.iddocumento = p_iddocumento) as nrodoc,

                cti.denominacion as denominacioncarta,

                (SELECT sum(dvp.cantidad) FROM mod_logproduccion.dat_valeproduccion dvp WHERE dvp.idordenproduccion = p_iddocumento)as cantidadorden,

                ((SELECT sum(dvp.cantidad)*sum(n.necesidad) FROM mod_logproduccion.dat_valeproduccion dvp WHERE dvp.idordenproduccion = p_iddocumento)*ip.precio)as importeplan,

                (SELECT sum(dm.importecontable) FROM mod_logistica.dat_documento d
                        LEFT JOIN mod_logistica.dat_documentopadre ddp ON ddp.idpadre = d.iddocumento
                        LEFT JOIN mod_logistica.dat_documento dd ON dd.iddocumento = ddp.iddocumento
                        LEFT JOIN mod_logistica.dat_documentopadre ddpp ON ddpp.idpadre = dd.iddocumento
                        LEFT JOIN mod_logistica.dat_documento ddd ON ddd.iddocumento = ddpp.iddocumento
                        LEFT JOIN mod_logistica.dat_movimiento dm ON dm.iddocumento = ddd.iddocumento
                        LEFT JOIN mod_logistica.dat_producto pp ON pp.idproducto = dm.idproducto
                        LEFT JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = ddd.iddoc
                    WHERE dd.estado = 3 AND dp.sigla LIKE '%valeLog%' AND d.iddocumento = p_iddocumento)AS importer,

                (SELECT sum(dm.preciocontable) FROM  mod_logistica.dat_documento d
                    LEFT JOIN mod_logistica.dat_documentopadre ddp ON ddp.idpadre = d.iddocumento
                    LEFT JOIN mod_logistica.dat_documento dd ON dd.iddocumento = ddp.iddocumento
                    LEFT JOIN mod_logistica.dat_documentopadre ddpp ON ddpp.idpadre = dd.iddocumento
                    LEFT JOIN mod_logistica.dat_documento ddd ON ddd.iddocumento = ddpp.iddocumento
                    LEFT JOIN mod_logistica.dat_movimiento dm ON dm.iddocumento = ddd.iddocumento
                    LEFT JOIN mod_logistica.dat_producto pp ON pp.idproducto = dm.idproducto
                    LEFT JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = ddd.iddoc
                    WHERE dd.estado = 3 AND dp.sigla LIKE '%valeLog%' AND d.iddocumento =p_iddocumento) AS precior

         FROM mod_planifindustrial.dat_cartatecindustrial cti
         INNER JOIN mod_planifindustrial.dat_cartatecindustrialactividad ctia ON (ctia.idcartatecindustrial = cti.idcartatecindustrial)
         INNER JOIN mod_planificacion.nom_actividad a ON (ctia.idactividad = a.idactividad)
         INNER JOIN mod_planificacion.dat_norma n ON (a.idactividad = n.idactividad)
         INNER JOIN mod_datosmaestros.nom_indicador i ON (i.idindicador = n.idindicador)
         --INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON (ip.idindicador = i.idindicador and ip.nivelplanif = 1 and ip.idaprobacion = 4)
         LEFT JOIN mod_datosmaestros.nom_indicadorplanif ip ON (ip.idindicador = i.idindicador and ip.nivelplanif = 1 and ip.idaprobacion = 4)
         LEFT JOIN mod_datosmaestros.nom_unidadmedida um ON (i.idumedida = um.idunidadmedida)
         LEFT JOIN mod_logproduccion.dat_ordenproduccion dop ON dop.idordenproduccion = cti.idcartatecindustrial
         LEFT JOIN mod_logistica.v_documento vd ON vd.iddocumento = dop.idordenproduccion
         WHERE cti.idcartatecindustrial = p_idcartatecindustrial and i.tipo = 1
         GROUP BY ctia.idcartatecindustrial, cti.denominacion,ip.precio,i.idindicador
    );
  end;
$BODY$;

ALTER FUNCTION mod_logistica.f_fichacosto(numeric, numeric, numeric) OWNER TO zeolides;

--select * from mod_logistica.f_fichacosto(200530690, 1000325779, 22);
