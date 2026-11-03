CREATE TABLE mod_migracion_aft.mig_transg_datos_sin_migrar (
  categoria VARCHAR(255),
  marca VARCHAR(255),
  modelo VARCHAR(255),
  matricula VARCHAR(255) NOT NULL,
  nromotor VARCHAR(255),
  nrochasis VARCHAR(255),
  color VARCHAR(255),
  anno NUMERIC(19,0),
  idcolor NUMERIC(19,0)
) 
WITH (oids = false);

ALTER TABLE mod_migracion_aft.mig_transg_datos_sin_migrar
  OWNER TO zeolides;
  
  
CREATE OR REPLACE FUNCTION mod_migracion_aft.mig_trangs_datos_sin_migrar (
)
RETURNS void AS
$body$
DECLARE
	v_rec record;
BEGIN
  
	update mod_migracion_aft.mig_transg_datos_sin_migrar m
    set idcolor = (
    	select c.idcolor
        from  mod_logactivofijotangible.nom_color c
        where upper(c.denominacion) = upper(m.color)
    );
    
    INSERT INTO 
    mod_logactivofijotangible.nom_color
    (
      estado,
      denominacion
    )
    (SELECT DISTINCT 1, upper(m.color)
    FROM mod_migracion_aft.mig_transg_datos_sin_migrar m
    WHERE m.idcolor is null and m.color <> '');
      
    update mod_migracion_aft.mig_transg_datos_sin_migrar m
    set idcolor = (
    	select c.idcolor
        from  mod_logactivofijotangible.nom_color c
        where upper(c.denominacion) = upper(m.color)
    );

	for v_rec in 
    	select m.anno, m.idcolor, m.matricula, m.nrochasis, m.nromotor, rna.idregnumerico
        from mod_migracion_aft.mig_transg_datos_sin_migrar m
        inner join mod_logactivofijotangible.dat_regnumericoactivotransp rnat on rnat.nromatricula ilike m.matricula
        inner join mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rnat.idregnumerico
    LOOP
    	
    	UPDATE mod_logactivofijotangible.dat_registronumerico 
        SET nroserie = v_rec.nrochasis          
        WHERE idregnumerico = v_rec.idregnumerico; 
        
        UPDATE mod_logactivofijotangible.dat_regnumericoactivo 
        SET 
          idcolorprim = v_rec.idcolor,
          annofabricacion = v_rec.anno
        WHERE idregnumerico = v_rec.idregnumerico;
        
        UPDATE mod_logactivofijotangible.dat_regnumericoactivotransp rnat
        SET nromotor1 = v_rec.nromotor
        WHERE rnat.idregnumerico = v_rec.idregnumerico;
    
    end loop;

END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_migracion_aft.mig_trangs_datos_sin_migrar ()
  OWNER TO zeolides;