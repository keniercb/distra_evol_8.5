ALTER TYPE mod_logtaller.td_jsonordencita
  DROP ATTRIBUTE observaciones,
  DROP ATTRIBUTE medio;



CREATE OR REPLACE FUNCTION mod_logtaller.f_modelosubmedioscita (
  p_idcita numeric
)
RETURNS SETOF mod_logtaller.td_jsonordencita AS
$body$
	DECLARE



    v_result mod_logtaller.td_jsonordencita;    



    v_rec record;
    


	BEGIN



    create temp table datos_json(



      columna TEXT,



      clave TEXT,



	  frag text,



      valor TEXT


    );    



		for v_rec in 



			SELECT
            json_array_elements(dc.dinamicos::json) -> 'etiqueta' as columna,
            json_array_elements(dc.dinamicos::json) -> 'name' as clave,
            json_array_elements(dc.dinamicos::json) as frag,
            null as valor

            from mod_logtaller.dat_cita dc

            where (dc.idcita = p_idcita or p_idcita is null)


		loop

			INSERT INTO datos_json (columna, clave, frag, valor)

            VALUES (v_rec.columna, v_rec.clave, v_rec.frag, v_rec.valor);

		end loop;



        for v_result in

        	select d.columna, d.clave, d.frag, d.valor from datos_json d

            loop

            v_result.columna = replace(v_result.columna,'"','');

            v_result.clave = replace(v_result.clave,'"','');

            v_result.valor = (select json_extract_path_text(v_result.frag::json,v_result.clave));
        
        
        	return next v_result;

            end loop;

            drop table datos_json;

	END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logtaller.f_modelosubmedioscita (p_idcita numeric)
  OWNER TO zeolides;




