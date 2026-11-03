COMMENT ON SCHEMA mod_reccomplejas2 IS 'Agrupa los datos del componente recuperaciones complejas. Versión 2. (RRHH)';

CREATE OR REPLACE FUNCTION mod_reccomplejas2.f_cambiar_orden (
  idcampo_v numeric,
  idpadre_v numeric,
  sentido numeric
)
RETURNS boolean AS
$body$
declare 
v_res boolean;
hijos record;
padre record;
v_ind_aux integer;
v_index_par record;
begin
v_res := false;

SELECT index,idconfiguracion into v_index_par FROM mod_reccomplejas2.dat_campo WHERE idcampo=$1;

IF($2 IS NOT NULL) THEN 
--HIJO

IF ($3=1) THEN
--arriba
SELECT idcampo, index into hijos FROM mod_reccomplejas2.dat_campo where idpadre = $2 AND index < v_index_par.index ORDER BY index DESC LIMIT 1;
IF (hijos IS NOT NULL) THEN
			v_ind_aux:=hijos.index;			
			UPDATE mod_reccomplejas2.dat_campo SET index=v_index_par.index WHERE idcampo=hijos.idcampo;
			UPDATE mod_reccomplejas2.dat_campo SET index=v_ind_aux WHERE idcampo=$1;
			v_res := true;
		END IF;

ELSE
--abajo
SELECT idcampo, index into hijos FROM mod_reccomplejas2.dat_campo where idpadre = $2 AND index > v_index_par.index ORDER BY index LIMIT 1; 
		IF (hijos IS NOT NULL) THEN
			v_ind_aux:=hijos.index;
			UPDATE mod_reccomplejas2.dat_campo SET index=v_index_par.index WHERE idcampo=hijos.idcampo;
			UPDATE mod_reccomplejas2.dat_campo SET index=v_ind_aux WHERE idcampo=$1;
			v_res := true;
		END IF;
END IF;


ELSE
--PADRE

IF ($3=1) THEN
--arriba
SELECT idcampo, index into padre FROM mod_reccomplejas2.dat_campo where idconfiguracion = v_index_par.idconfiguracion AND idpadre IS NULL AND index < v_index_par.index ORDER BY index DESC LIMIT 1;
IF (padre IS NOT NULL) THEN
			v_ind_aux:=padre.index;			
			UPDATE mod_reccomplejas2.dat_campo SET index=v_index_par.index WHERE idcampo=padre.idcampo;
			UPDATE mod_reccomplejas2.dat_campo SET index=v_ind_aux WHERE idcampo=$1;
			v_res := true;
		END IF;

ELSE
--abajo

SELECT idcampo, index into padre FROM mod_reccomplejas2.dat_campo where idconfiguracion = v_index_par.idconfiguracion AND idpadre IS NULL AND index > v_index_par.index ORDER BY index LIMIT 1; 
		IF (padre IS NOT NULL) THEN
			v_ind_aux:=padre.index;
			UPDATE mod_reccomplejas2.dat_campo SET index=v_index_par.index WHERE idcampo=padre.idcampo;
			UPDATE mod_reccomplejas2.dat_campo SET index=v_ind_aux WHERE idcampo=$1;
			v_res := true;
			
		END IF;
END IF;

END IF;
return v_res;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

COMMENT ON SEQUENCE mod_reccomplejas2.sec_busqueda_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_busqueda".';

COMMENT ON SEQUENCE mod_reccomplejas2.sec_busquedausuario_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_busquedausuario".';

COMMENT ON SEQUENCE mod_reccomplejas2.sec_campo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_campo".';

COMMENT ON SEQUENCE mod_reccomplejas2.sec_configcondicion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_configcondicion".';

COMMENT ON SEQUENCE mod_reccomplejas2.sec_configmostrar_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_configmostrar".';

COMMENT ON SEQUENCE mod_reccomplejas2.sec_filtro_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "seg_filtro".';

COMMENT ON SEQUENCE mod_reccomplejas2.sec_mapeo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_mapeo".';

COMMENT ON SEQUENCE mod_reccomplejas2.sec_segcampo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "seg_campo".';

COMMENT ON SEQUENCE mod_reccomplejas2.sec_union_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_union".';

ALTER TABLE mod_reccomplejas2.dat_busqueda
  ADD COLUMN cantidad NUMERIC(1,0) DEFAULT 0 NOT NULL;

COMMENT ON COLUMN mod_reccomplejas2.dat_busqueda.cantidad
IS '0-Busqueda de campos
1-Busqueda de cantidad';

ALTER TABLE mod_reccomplejas2.dat_campo
  ADD COLUMN index NUMERIC(19,0);

ALTER TABLE mod_reccomplejas2.dat_configcondicion
  ADD COLUMN usarreemplazar VARCHAR(255) DEFAULT 'NINGUNO'::character varying;

ALTER TABLE mod_reccomplejas2.dat_mapeo
  ALTER COLUMN idpersistejoin TYPE NUMERIC(5,0);

