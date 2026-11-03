ALTER TABLE mod_logtaller.dat_actividadcita
  ADD COLUMN codigo VARCHAR(25);


ALTER TABLE mod_logtaller.dat_piezadispcita
  ADD COLUMN existencia NUMERIC(25,6);


ALTER TABLE mod_logtaller.dat_piezadispcita
  ADD COLUMN idproducto NUMERIC(19,0);


ALTER TABLE mod_logtaller.dat_piezadispcita
  ADD COLUMN denominacion VARCHAR;


ALTER TABLE mod_logtaller.dat_actividadcita
  ADD COLUMN denominacion VARCHAR;




CREATE TYPE mod_logtaller.td_jsonordencita AS (
  columna TEXT,
  clave TEXT,
  frag TEXT,
  valor TEXT,
  medio VARCHAR(255),
  observaciones VARCHAR(255)
);

ALTER TYPE mod_logtaller.td_jsonordencita
  OWNER TO zeolides;


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



      valor TEXT,



      medio VARCHAR(255),
      
      
      
      observaciones VARCHAR(255)


    );    



		for v_rec in 



			SELECT
            json_array_elements(dc.dinamicos::json) -> 'etiqueta' as columna,
            json_array_elements(dc.dinamicos::json) -> 'name' as clave,
            json_array_elements(dc.dinamicos::json) as frag,
            null as valor,

            nic.denominacion as medio,
            
            dc.observacion as observaciones
       

            from mod_logtaller.dat_cita dc

            inner join mod_datosmaestros.nom_indicador nic on nic.idindicador = dc.idindicador

            where (dc.idcita = p_idcita or p_idcita is null)           



		loop

			INSERT INTO datos_json (columna, clave, frag, valor, medio, observaciones)

            VALUES (v_rec.columna, v_rec.clave, v_rec.frag, v_rec.valor, v_rec.medio, v_rec.observaciones);

		end loop;



        for v_result in

        	select d.columna, d.clave, d.frag, d.valor, d.medio, d.observaciones from datos_json d

            loop

            v_result.columna = replace(v_result.columna,'"','');

            v_result.clave = replace(v_result.clave,'"','');

            v_result.valor = (select json_extract_path_text(v_result.frag::json,v_result.clave));
                
            v_result.medio = replace(v_result.medio,'"','');
            
            v_result.observaciones = replace(v_result.observaciones,'"','');
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




CREATE TYPE mod_logtaller.td_modelocitamat AS (
  codigo VARCHAR(255),
  denominacion VARCHAR(255),
  um VARCHAR(50),
  cantidad NUMERIC(25,2),
  importecup NUMERIC(25,6),
  importecuc NUMERIC(25,6),
  preciocup NUMERIC(25,6),
  preciocuc NUMERIC(25,6)
);

ALTER TYPE mod_logtaller.td_modelocitamat
  OWNER TO zeolides;



CREATE OR REPLACE FUNCTION mod_logtaller.f_modelosubmediosmaterialcita (
  p_idcita numeric
)
RETURNS SETOF mod_logtaller.td_modelocitamat AS
$body$
	DECLARE
	v_rec mod_logtaller.td_modelocitamat;
	BEGIN
		for v_rec in 
        select DISTINCT coalesce(ind.numeropieza,ind.codigo) as numeropieza,ind.denominacion as denomaterial,
        num.abreviaturaunidadmedida,
        dm.cantidad as cantidad,
        sum(round(dm.cantidad * dm.precioventa,2)) as importecup,
        sum(round(dm.cantidad * dm.precioventaalternativo,2)) as importecuc,
        dm.precioventa,
        dm.precioventaalternativo,
        dm.idindicador,
        sum(dm.cantidad) as entregado
        
        from mod_logistica.dat_documento dd
        inner join mod_logtaller.dat_cita dc on dc.idcita= dd.iddocumento
        inner join mod_logtaller.dat_piezadispcita dm on dm.idcita = dc.idcita
        inner join mod_datosmaestros.nom_indicador ind on ind.idindicador = dm.idindicador
        left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = ind.idumedida
        where dd.iddocumento = p_idcita
        group by ind.numeropieza, ind.codigo, ind.denominacion, num.abreviaturaunidadmedida, dm.cantidad, dd.fechacontable, dm.importe
        ,dm.importealternativo, dm.precioventa, dm.precioventaalternativo, dm.idindicador
		loop
			return next v_rec;
		end loop;
	END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logtaller.f_modelosubmediosmaterialcita (p_idcita numeric)
  OWNER TO zeolides;




CREATE TYPE mod_logtaller.td_modelosubtrabajocita AS (
  trabajorealizar VARCHAR(255),
  cantreal NUMERIC(19,0),
  tiemporeal NUMERIC(19,0),
  observacion VARCHAR(255),
  logo TEXT,
  responsable VARCHAR(255),
  importecup NUMERIC(25,6),
  importecuc NUMERIC(25,6),
  preciocup NUMERIC(25,6),
  preciocuc NUMERIC(25,6)
);

ALTER TYPE mod_logtaller.td_modelosubtrabajocita
  OWNER TO zeolides;


CREATE OR REPLACE FUNCTION mod_logtaller.f_modelosubtrabajocita (
  p_idcita numeric
)
RETURNS SETOF mod_logtaller.td_modelosubtrabajocita AS
$body$
	DECLARE
	v_rec mod_logtaller.td_modelosubtrabajocita;
	BEGIN
		for v_rec in 
        SELECT (COALESCE(ind.numeropieza,(CASE WHEN (ind.numeropieza IS NULL OR ind.numeropieza = '') THEN ind.codigo ELSE ind.numeropieza END))||' - '||ind.denominacion) as trabajorealizar,
        (select count(*) from mod_logtaller.dat_actividadcita dm where dm.idcita = dot.idcita) as cantreal,
        dot.duracion,dp.observacion,i.urllogo as logo,concat(dp.nombreresponsable) as responsable,
        dot.importe as importecup,dot.importealternativo as importecuc,dot.precioventa, dot.precioventaalternativo
        FROM mod_logistica.dat_documento dd
        inner join mod_logtaller.dat_actividadcita dot on dot.idcita = dd.iddocumento
       
        inner join mod_datosmaestros.nom_indicador ind on ind.idindicador = dot.idindicador
        inner join mod_logistica.dat_documentocliente dc on dc.iddocumento = dd.iddocumento and dc.tipocliente = 1
        left join mod_datosmaestros.nom_clientesproveedor ncp on dc.idcliente = ncp.idclientesproveedores 
        left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
        left join mod_logtaller.dat_cita dp on dp.idcita = dd.iddocumento
        inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
        inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
        inner join mod_datosmaestros.dat_estructurasubsist desu on desu.idestructurasubsist = ddp.idestructurasubsist
        inner join mod_estructuracomp.v_dametodasestructuras des on des.idestructura = desu.idestructuracomun
        inner join mod_logistica.conf_general i on i.idestructura = des.idestructura
      	where (dd.iddocumento = p_idcita OR p_idcita IS NULL)
		loop
			return next v_rec;
        end loop;
	END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logtaller.f_modelosubtrabajocita (p_idcita numeric)
  OWNER TO zeolides;















