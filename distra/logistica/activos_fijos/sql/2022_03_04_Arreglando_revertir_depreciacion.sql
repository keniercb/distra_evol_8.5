DROP FUNCTION IF EXISTS mod_logactivofijotangible.f_revertirultimadepreciacion(iddocumento numeric, idestructura numeric);

CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_revertirultimadepreciacion (
  iddocumento numeric
)
RETURNS void AS
$body$
DECLARE

	v_rec RECORD;
    v_fechainicio DATE;
    v_recdatos RECORD;

BEGIN

	SELECT p.inicio INTO v_fechainicio
    FROM mod_logistica.dat_documento d
	INNER JOIN mod_datosmaestros.dat_periodocontable p ON p.idperiodo = d.idperiodo
    WHERE d.iddocumento = $1;

	
	FOR v_rec IN
    	SELECT mrn1.idregnumerico, mrna1.depreciacion, mrna1.depreciacioncuc
        FROM mod_logistica.dat_documento d1
        INNER JOIN mod_logistica.dat_movimiento m1 ON m1.iddocumento = d1.iddocumento
        INNER JOIN mod_logactivofijotangible.dat_movregnumerico mrn1 ON mrn1.idmovimiento = m1.idmovimiento
        INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo mrna1 ON mrna1.idmovregnumerico = mrn1.idmovregnumerico
        WHERE d1.iddocumento = $1
    LOOP
    	
    	UPDATE mod_logactivofijotangible.dat_movregnumericoactivo mrna
        SET 
        	depreciacionacumulada = depreciacionacumulada - v_rec.depreciacion,
            depreciacionacumuladaalternativo = depreciacionacumuladaalternativo - v_rec.depreciacioncuc
        WHERE mrna.idmovregnumerico IN (
        	SELECT mrn.idmovregnumerico
            FROM mod_logactivofijotangible.dat_movregnumerico mrn
            INNER JOIN mod_logistica.dat_movimiento m ON m.idmovimiento = mrn.idmovimiento
            WHERE mrn.idregnumerico = v_rec.idregnumerico AND m.iddocumento > $1
        );
        
		UPDATE mod_logactivofijotangible.dat_regnumericoactivo rna
        SET 
        	depreciacionacumulada = depreciacionacumulada - v_rec.depreciacion,
            depreciacionacumuladaalternativo = depreciacionacumuladaalternativo - v_rec.depreciacioncuc
        WHERE rna.idregnumerico = v_rec.idregnumerico;
        
        v_recdatos := null;
        
        SELECT mrna.depreciacion, d.fechacontable, mrn.idregnumerico INTO v_recdatos
        FROM mod_logactivofijotangible.dat_movregnumerico mrn
        INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo mrna ON mrn.idmovregnumerico = mrna.idmovregnumerico
        INNER JOIN mod_logistica.dat_movimiento m ON m.idmovimiento = mrn.idmovimiento
        INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
        INNER JOIN mod_datosmaestros.nom_operacion oper on oper.idnomoperaciones = d.idoperacion        
        WHERE mrn.idregnumerico = v_rec.idregnumerico
        	AND oper.codigooperacion = 'OPER_DEPRECIACION'
            AND d.iddocumento <> $1
        ORDER BY d.iddocumento DESC
        LIMIT 1
        ;
        
        if v_recdatos IS NOT NULL THEN 
        	UPDATE mod_logactivofijotangible.dat_regnumericoactivo rna
			SET ultimadepreciacion = v_recdatos.depreciacion, fechaultimadep = v_recdatos.fechacontable
            WHERE rna.idregnumerico = v_recdatos.idregnumerico;
        END IF;
        
    END LOOP;
    
    UPDATE mod_logactivofijotangible.his_regnumericoestatus 
    SET 
    	fechafin = NULL, 
        fechainicio = v_fechainicio
    WHERE idregnumerico IN (
    	SELECT mrn1.idregnumerico 
        FROM mod_logactivofijotangible.dat_movregnumerico mrn1
    	INNER JOIN mod_logistica.dat_movimiento m1 ON m1.idmovimiento = mrn1.idmovimiento 
        WHERE m1.iddocumento = $1);
    
    DELETE FROM mod_logactivofijotangible.dat_movregnumerico mrn
	WHERE mrn.idmovimiento IN (
    	SELECT m.idmovimiento 
        FROM mod_logistica.dat_movimiento m
        WHERE m.iddocumento = $1
    );
    
    DELETE FROM mod_logistica.dat_documento d WHERE d.iddocumento = $1;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;