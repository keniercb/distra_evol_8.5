CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_replicar_datos_mov (
  idmovregnumerico numeric
)
RETURNS void AS
$body$
DECLARE
    idmovimiento numeric;
	v_rec record;
BEGIN
	
	SELECT * INTO v_rec 
    FROM mod_logactivofijotangible.dat_movregnumericoactivo mrna
    INNER JOIN mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idmovregnumerico = mrna.idmovregnumerico
    WHERE mrna.idmovregnumerico = $1;

	UPDATE mod_logactivofijotangible.dat_movregnumericoactivo mrna
    set idestatustecnico = v_rec.idestatustecnico,
        idcolorprim = v_rec.idcolorprim,
        idcolorsec = v_rec.idcolorsec,
        idubicacion = v_rec.idubicacion,
        idactividad = v_rec.idactividad,
        annofabricacion = v_rec.annofabricacion,
        fechaadq = v_rec.fechaadq,
        fechaexpini = v_rec.fechaexpini,
        fechaexpfin = v_rec.fechaexpfin,
        idcategoria = v_rec.idcategoria,
        idresponsable = v_rec.idresponsable,
        denominacion = v_rec.denominacion,
        idgruposubgrupo = v_rec.idgruposubgrupo,
        idnaturaleza = v_rec.idnaturaleza,
        valoradquisicion = v_rec.valoradquisicion,
        valorcontable = v_rec.valorcontable,     
        vidautil = v_rec.vidautil,
        tasafiscal = v_rec.tasafiscal,
        porcientorecuperacion = v_rec.porcientorecuperacion,
        recursoconsumido = v_rec.recursoconsumido,
        cantidadrecursoconsumido = v_rec.cantidadrecursoconsumido,
        depreciacionacumulada = v_rec.depreciacionacumulada
    
	WHERE mrna.idmovregnumerico in (
    	SELECT  mrn.idmovregnumerico
        FROM mod_logactivofijotangible.dat_movregnumerico mrn
        WHERE mrn.idmovimiento = v_rec.idmovimiento
    );
    UPDATE 
  mod_logactivofijotangible.dat_regnumericoactivo 
SET 
  idestatustecnico = v_rec.idestatustecnico,
        idcolorprim = v_rec.idcolorprim,
        idcolorsec = v_rec.idcolorsec,
        idubicacion = v_rec.idubicacion,
        idactividad = v_rec.idactividad,
        annofabricacion = v_rec.annofabricacion,
        fechaadq = v_rec.fechaadq,
        fechaexpini = v_rec.fechaexpini,
        fechaexpfin = v_rec.fechaexpfin,
        idcategoria = v_rec.idcategoria,
        idresponsable = v_rec.idresponsable,
        denominacion = v_rec.denominacion,
        idgruposubgrupo = v_rec.idgruposubgrupo,
        idnaturaleza = v_rec.idnaturaleza,
        valoradquisicion = v_rec.valoradquisicion,
        valorcontable = v_rec.valorcontable,     
        vidautil = v_rec.vidautil,
        tasafiscal = v_rec.tasafiscal,
        porcientorecuperacion = v_rec.porcientorecuperacion,
        recursoconsumido = v_rec.recursoconsumido,
        cantidadrecursoconsumido = v_rec.cantidadrecursoconsumido,
        depreciacionacumulada = v_rec.depreciacionacumulada
WHERE 
  idregnumerico in (
  	SELECT  mrn.idregnumerico
        FROM mod_logactivofijotangible.dat_movregnumerico mrn
        WHERE mrn.idmovimiento = v_rec.idmovimiento
  )
;
    
    
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_logactivofijotangible.f_replicar_datos_mov (idmovregnumerico numeric)
  OWNER TO zeolides;