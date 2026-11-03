CREATE OR REPLACE FUNCTION mod_datosmaestros.f_find_format(
	p_formato varchar,
	p_match varchar
	)
    RETURNS int[]
    LANGUAGE 'plpgsql'
    COST 500
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
v_match text[];
v_inicio int = 0;
V_fin int = 0;
begin

select regexp_match(p_formato, p_match) into v_match;

if array_upper(v_match, 1) > 0 then
	select strpos(p_formato, v_match[1]) into v_inicio;
	select length(v_match[1]) into V_fin;
	
end if;

return array[v_inicio, V_fin];
end
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_find_format(varchar, varchar)
    OWNER TO zeolides;

----------------------

CREATE OR REPLACE FUNCTION mod_datosmaestros.f_set_centuria_AAA(
	p_formato varchar
	)
    RETURNS varchar
    LANGUAGE 'plpgsql'
    COST 500
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
v_inicio_fin int[];
v_result_format varchar;
v_date varchar;
v_centuria varchar;
begin
v_result_format = p_formato;

select EXTRACT(year FROM CURRENT_DATE)::varchar into v_date;

select substring(v_date from 1 for 1) || substring(v_date from 3 for 2) into v_centuria;

v_inicio_fin = mod_datosmaestros.f_find_format(p_formato, 'AAA');

if v_inicio_fin[1] > 0 then
	select overlay(p_formato placing v_centuria from v_inicio_fin[1] for v_inicio_fin[2]) into v_result_format;
end if;

return v_result_format;
end
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_set_centuria_AAA(varchar)
    OWNER TO zeolides;


------------------

CREATE OR REPLACE FUNCTION mod_datosmaestros.f_set_trimestre_T(
	p_formato varchar
	)
    RETURNS varchar
    LANGUAGE 'plpgsql'
    COST 500
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
v_inicio_fin int[];
v_result_format varchar;
v_trimestre varchar;
begin
v_result_format = p_formato;

select EXTRACT(quarter FROM CURRENT_DATE)::varchar into v_trimestre;

v_inicio_fin = mod_datosmaestros.f_find_format(p_formato, 'T');

if v_inicio_fin[1] > 0 then
	select overlay(p_formato placing v_trimestre from v_inicio_fin[1] for v_inicio_fin[2]) into v_result_format;
end if;

return v_result_format;
end
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_set_trimestre_T(varchar)
    OWNER TO zeolides;


--------------------------

CREATE OR REPLACE FUNCTION mod_datosmaestros.f_set_mes_MM(
	p_formato varchar
	)
    RETURNS varchar
    LANGUAGE 'plpgsql'
    COST 500
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
v_inicio_fin int[];
v_result_format varchar;
v_mes varchar;
begin
v_result_format = p_formato;

select lpad(EXTRACT(month FROM CURRENT_DATE)::varchar, 2, '0') into v_mes;

v_inicio_fin = mod_datosmaestros.f_find_format(p_formato, 'MM');

if v_inicio_fin[1] > 0 then
	select overlay(p_formato placing v_mes from v_inicio_fin[1] for v_inicio_fin[2]) into v_result_format;
end if;

return v_result_format;
end
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_set_mes_MM(varchar)
    OWNER TO zeolides;

---------------

CREATE OR REPLACE FUNCTION mod_datosmaestros.f_set_territorio_SS(
	p_formato varchar,
	p_idestructuracomun numeric
	)
    RETURNS varchar
    LANGUAGE 'plpgsql'
    COST 500
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
v_inicio_fin int[];
v_result_format varchar;
v_territorio varchar;
begin
v_result_format = p_formato;

select substring(codigo from length(codigo)-1 for 2) into v_territorio
from mod_estructuracomp.dat_estructuraop
where idestructuraop = p_idestructuracomun
limit 1;

v_inicio_fin = mod_datosmaestros.f_find_format(p_formato, 'SS');

if v_inicio_fin[1] > 0 and v_territorio is not null and v_territorio ~ '^[0-9]+$' then
	select overlay(p_formato placing lpad(v_territorio, 2, '0') from v_inicio_fin[1] for v_inicio_fin[2]) into v_result_format;
end if;

return v_result_format;
end
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_set_territorio_SS(varchar, numeric)
    OWNER TO zeolides;

---------------------


CREATE OR REPLACE FUNCTION mod_datosmaestros.f_existe_sequencia_codigo_barra(
	p_nombre_sequence varchar
	)
    RETURNS bool
    LANGUAGE 'plpgsql'
    COST 500
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
v_existe int;
begin

SELECT 0 into v_existe
FROM pg_class 
where relname = p_nombre_sequence;

return v_existe is not null;
end
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_existe_sequencia_codigo_barra(varchar)
    OWNER TO zeolides;

----------------------------

CREATE OR REPLACE FUNCTION mod_datosmaestros.f_crear_sequencia_codigo_barra(
	p_idestandarcodigobarra numeric,
	p_idestructuracomun numeric,
	p_len_max_value int
	)
    RETURNS varchar
    LANGUAGE 'plpgsql'
    COST 500
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
v_existe int;
v_es_por_estructura bool;
v_idestructura numeric;
v_nombre varchar = '';
v_max_value varchar;
begin

select repeat('9', p_len_max_value) into v_max_value;

SELECT sequenciaporentidad into v_es_por_estructura
FROM mod_datosmaestros.dat_estandarcodigobarras
where idestandarcodigobarra = p_idestandarcodigobarra;

if v_es_por_estructura then
	v_nombre = p_idestandarcodigobarra::varchar || '_' || p_idestructuracomun::varchar;
	v_idestructura = p_idestructuracomun;
else
	v_nombre = p_idestandarcodigobarra::varchar;
end if;

v_nombre = 'sec_estandarcodigobarras_' || v_nombre || '_seq';

EXECUTE format(
        '
        CREATE SEQUENCE mod_datosmaestros.%s
		  CYCLE
          INCREMENT 1 MINVALUE 1
          MAXVALUE %s START 1
          CACHE 1
        ',
        v_nombre, v_max_value
    );
	
INSERT INTO mod_datosmaestros.dat_estandarcodigobarras_estructuraseq(
	idestandarcodigobarra, idestructura, secuenciaactual)
	VALUES (p_idestandarcodigobarra, v_idestructura, 1);

return v_nombre;

end
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_crear_sequencia_codigo_barra(numeric, numeric, int)
    OWNER TO zeolides;

----------------------
CREATE OR REPLACE FUNCTION mod_datosmaestros.f_generar_codigo_chequeo(
	p_codigobarras varchar
	)
    RETURNS INTEGER
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
codbarra_array text[];
par_array INTEGER[];
impar_array INTEGER[];
cantidad INTEGER;
codbarra varchar;
tamannocodigo INTEGER;
codchequeocalculado INTEGER;
multiplicarpar INTEGER = 1;
multiplicarimpar INTEGER = 1;
sumapar INTEGER = 0;
sumaimpar INTEGER = 0;
BEGIN
codbarra = p_codigobarras;
tamannocodigo = length(codbarra);
codbarra = substring(codbarra for tamannocodigo-1);

codbarra_array := string_to_array(codbarra, null);
cantidad := array_upper(codbarra_array, 1) :: INTEGER;

if tamannocodigo = 13 then
multiplicarpar = 3;
elseif tamannocodigo = any(array[8,12,14,18]) then
multiplicarimpar = 3;
else
return -1;
end if;

for i in 1 .. cantidad
loop
	if((i) % 2 = 0) then
		par_array = array_append(par_array, codbarra_array[i]::INTEGER);
		sumapar = sumapar + ((codbarra_array[i]::INTEGER) * multiplicarpar);
	else
		impar_array = array_append(impar_array, codbarra_array[i]::INTEGER);
		sumaimpar = sumaimpar + ((codbarra_array[i]::INTEGER) * multiplicarimpar);
	end if;
end loop;

codchequeocalculado = abs(((sumapar + sumaimpar) % 10) -10) % 10;

return codchequeocalculado;
end
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_generar_codigo_chequeo(varchar)
    OWNER TO zeolides;

-------------------

CREATE OR REPLACE FUNCTION mod_datosmaestros.f_validarcodigodebarras(
	p_codigobarras varchar
	)
    RETURNS bool
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
codchequeo INTEGER;
codchequeocalculado INTEGER;
tamannocodigo INTEGER;
BEGIN

tamannocodigo = length(p_codigobarras);
codchequeo = substring(p_codigobarras from tamannocodigo for 1)::INTEGER;

select mod_datosmaestros.f_generar_codigo_chequeo(p_codigobarras) into codchequeocalculado;

if codchequeocalculado = codchequeo then
return true;
else
return false;
end if;
end
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_validarcodigodebarras(varchar)
    OWNER TO zeolides;

--------------------------------

CREATE OR REPLACE FUNCTION mod_datosmaestros.f_generar_codigo_barra_parcial(
	p_formato varchar,
	p_idestructura numeric
	)
    RETURNS varchar
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
v_formato varchar;
BEGIN
v_formato = p_formato;

select mod_datosmaestros.f_set_centuria_AAA(v_formato) into v_formato;
select mod_datosmaestros.f_set_trimestre_T(v_formato) into v_formato;
select mod_datosmaestros.f_set_mes_MM(v_formato) into v_formato;
select mod_datosmaestros.f_set_territorio_SS(v_formato, p_idestructura) into v_formato;

return v_formato;
end
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_generar_codigo_barra_parcial(varchar, numeric)
    OWNER TO zeolides;

------------------------------

CREATE OR REPLACE FUNCTION mod_datosmaestros.f_generar_codigo_barra_sequencia_codigochequeo(
	p_formato varchar,
	p_nombre_sequencia varchar,
	p_inicio_fin_sequecia int[],
	p_inicio_fin_codigochequeo int[]
	)
    RETURNS varchar
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
v_formato varchar;
v_valor_sequencia varchar;
v_codigochequeo varchar;
BEGIN
v_formato = p_formato;

if p_inicio_fin_sequecia[1] > 0 then
	v_valor_sequencia = nextval(p_nombre_sequencia::regclass);
	select overlay(v_formato placing lpad(v_valor_sequencia, p_inicio_fin_sequecia[2], '0') from p_inicio_fin_sequecia[1] for p_inicio_fin_sequecia[2]) into v_formato;
end if;

if p_inicio_fin_codigochequeo[1] > 0 then
	select mod_datosmaestros.f_generar_codigo_chequeo(v_formato) into v_codigochequeo;
	select overlay(v_formato placing v_codigochequeo from p_inicio_fin_codigochequeo[1] for p_inicio_fin_codigochequeo[2]) into v_formato;
end if;

return v_formato;
end
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_generar_codigo_barra_sequencia_codigochequeo(varchar, varchar, int[], int[])
    OWNER TO zeolides;


--------------------------------------

CREATE OR REPLACE FUNCTION mod_datosmaestros.f_generar_codigo_barra(
	p_idestandarcodigobarra numeric,
	p_idestructura numeric
	)
    RETURNS table(
		codigo_msg int,
		msg text,
		codigo_barra varchar,
		nombre_sequencia varchar,
		inicio_fin_sequencia int[],
		inicio_fin_codigochequeo int[],
		es_por_estructura bool
	)
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
v_codigo_barra varchar;
v_bandera varchar;
v_formato varchar;
v_es_por_estructura bool;
v_nombre_sequencia varchar;
v_inicio_fin int[];
v_inicio_fin_sequencia int[];
v_inicio_fin_codigochequeo int[];
v_idestructura numeric;
v_existe_sequencia bool;
BEGIN

SELECT bandera, formato, sequenciaporentidad into v_bandera, v_formato, v_es_por_estructura
FROM mod_datosmaestros.dat_estandarcodigobarras
where idestandarcodigobarra = p_idestandarcodigobarra;

select mod_datosmaestros.f_generar_codigo_barra_parcial(v_formato, p_idestructura) into v_formato;

v_inicio_fin = mod_datosmaestros.f_find_format(v_formato, '^(?:(\d|X)+)$');

if v_inicio_fin[1] = 0 then
	return query
	select -1::int, ('Quedan caracteres desconocidos en el formato: ' || v_bandera || v_formato)::text, 
	''::varchar, ''::varchar, v_inicio_fin_sequencia, v_inicio_fin_codigochequeo, v_es_por_estructura
	;
	return;
end if;

if v_es_por_estructura then
	v_nombre_sequencia = p_idestandarcodigobarra::varchar || '_' || p_idestructura::varchar;
	v_idestructura = p_idestructura;
else
	v_nombre_sequencia = p_idestandarcodigobarra::varchar;
end if;

v_nombre_sequencia = 'sec_estandarcodigobarras_' || v_nombre_sequencia || '_seq';

v_codigo_barra = v_bandera || v_formato;

v_inicio_fin_sequencia = mod_datosmaestros.f_find_format(v_codigo_barra, '9+');
v_inicio_fin_codigochequeo = mod_datosmaestros.f_find_format(v_codigo_barra, 'X');

if v_inicio_fin_sequencia[1] > 0 then
	select mod_datosmaestros.f_existe_sequencia_codigo_barra(v_nombre_sequencia) into v_existe_sequencia;
	if not v_existe_sequencia then
		perform mod_datosmaestros.f_crear_sequencia_codigo_barra(
			p_idestandarcodigobarra,
			p_idestructura,
			v_inicio_fin_sequencia[2]
		);
	end if;
end if;

return query
select 1::int, 'Ok'::text, v_codigo_barra, ('mod_datosmaestros.' || v_nombre_sequencia)::varchar, 
v_inicio_fin_sequencia, v_inicio_fin_codigochequeo, v_es_por_estructura
;
end
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_generar_codigo_barra(numeric, numeric)
    OWNER TO zeolides;

-----------------------------------

CREATE OR REPLACE FUNCTION mod_datosmaestros.f_generar_codigo_barra_solo(
	p_idestandarcodigobarra numeric,
	p_idestructura numeric
	)
    RETURNS table(
		codigo_msg int,
		msg text,
		codigo_barra varchar
	)
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
v_codigo_barra varchar;
v_codigo_msg int;
v_msg text;
v_nombre_sequencia varchar;
v_inicio_fin_sequencia int[];
v_inicio_fin_codigochequeo int[];
v_es_por_estructura bool;
BEGIN

SELECT a.codigo_msg, a.msg, a.codigo_barra, a.nombre_sequencia, a.inicio_fin_sequencia, a.inicio_fin_codigochequeo, a.es_por_estructura
into v_codigo_msg, v_msg, v_codigo_barra, v_nombre_sequencia, v_inicio_fin_sequencia, v_inicio_fin_codigochequeo, v_es_por_estructura
FROM mod_datosmaestros.f_generar_codigo_barra(p_idestandarcodigobarra, p_idestructura) a;

if v_codigo_msg = -1 then
	return query
	select v_codigo_msg, v_msg, v_codigo_barra
	;
	return;
end if;

select mod_datosmaestros.f_generar_codigo_barra_sequencia_codigochequeo(
	v_codigo_barra, 
	v_nombre_sequencia,
	v_inicio_fin_sequencia,
	v_inicio_fin_codigochequeo
) into v_codigo_barra;

if v_inicio_fin_sequencia[1] > 0 THEN
	perform mod_datosmaestros.f_actualizar_codigo_barra_sequencia_actual(
		p_idestandarcodigobarra,
		case when v_es_por_estructura then p_idestructura else null end,
		v_nombre_sequencia
	);
end if;

return query
select v_codigo_msg, v_msg, v_codigo_barra
;
end
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_generar_codigo_barra_solo(numeric, numeric)
    OWNER TO zeolides;

--------------------------------------

CREATE OR REPLACE FUNCTION mod_datosmaestros.f_generar_codigo_barra_en_indicadorhoja(
	p_idestandarcodigobarra numeric,
	p_idestructura numeric
	)
    RETURNS table(
		codigo_msg int,
		msg text,
		codigo_barra varchar
	)
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
v_codigo_barra varchar;
v_codigo_msg int;
v_msg text;
v_nombre_sequencia varchar;
v_inicio_fin_sequencia int[];
v_inicio_fin_codigochequeo int[];
v_es_por_estructura bool;
BEGIN

SELECT a.codigo_msg, a.msg, a.codigo_barra, a.nombre_sequencia, a.inicio_fin_sequencia, a.inicio_fin_codigochequeo, a.es_por_estructura
into v_codigo_msg, v_msg, v_codigo_barra, v_nombre_sequencia, v_inicio_fin_sequencia, v_inicio_fin_codigochequeo, v_es_por_estructura
FROM mod_datosmaestros.f_generar_codigo_barra(p_idestandarcodigobarra, p_idestructura) a;

if v_codigo_msg = -1 then
	return query
	select v_codigo_msg, v_msg, v_codigo_barra
	;
	return;
end if;

UPDATE mod_datosmaestros.nom_indicadorhoja a
	SET codigobarra = mod_datosmaestros.f_generar_codigo_barra_sequencia_codigochequeo(
			v_codigo_barra, 
			v_nombre_sequencia,
			v_inicio_fin_sequencia,
			v_inicio_fin_codigochequeo
		)
	from (
		select idindicador
		from mod_datosmaestros.nom_indicadorhoja
		where codigobarra is null or codigobarra =''
	) b
	WHERE a.idindicador = b.idindicador;

if v_inicio_fin_sequencia[1] > 0 THEN
	perform mod_datosmaestros.f_actualizar_codigo_barra_sequencia_actual(
		p_idestandarcodigobarra,
		case when v_es_por_estructura then p_idestructura else null end,
		v_nombre_sequencia
	);
end if;

return query
select v_codigo_msg, v_msg, v_codigo_barra
;
end
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_generar_codigo_barra_en_indicadorhoja(numeric, numeric)
    OWNER TO zeolides;

-----------------------------------------

CREATE OR REPLACE FUNCTION mod_datosmaestros.f_actualizar_codigo_barra_sequencia_actual(
	p_idestandarcodigobarra numeric,
	p_idestructura numeric,
	p_nombre_sequencia varchar
	)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
BEGIN

UPDATE mod_datosmaestros.dat_estandarcodigobarras_estructuraseq
SET secuenciaactual = currval(p_nombre_sequencia::regclass)
WHERE idestandarcodigobarra = p_idestandarcodigobarra 
and case when p_idestructura is null then idestructura is null else idestructura = p_idestructura end
;

end
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_actualizar_codigo_barra_sequencia_actual(numeric, numeric, varchar)
    OWNER TO zeolides;


--------------------------------------

CREATE OR REPLACE FUNCTION mod_datosmaestros.f_generar_codigo_barra_en_impproducto(
	p_idestandarcodigobarra numeric,
	p_idestructura numeric
	)
    RETURNS table(
		codigo_msg int,
		msg text,
		codigo_barra varchar
	)
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
v_codigo_barra varchar;
v_codigo_msg int;
v_msg text;
v_nombre_sequencia varchar;
v_inicio_fin_sequencia int[];
v_inicio_fin_codigochequeo int[];
v_es_por_estructura bool;
BEGIN

SELECT a.codigo_msg, a.msg, a.codigo_barra, a.nombre_sequencia, a.inicio_fin_sequencia, a.inicio_fin_codigochequeo, a.es_por_estructura
into v_codigo_msg, v_msg, v_codigo_barra, v_nombre_sequencia, v_inicio_fin_sequencia, v_inicio_fin_codigochequeo, v_es_por_estructura
FROM mod_datosmaestros.f_generar_codigo_barra(p_idestandarcodigobarra, p_idestructura) a;

if v_codigo_msg = -1 then
	return query
	select v_codigo_msg, v_msg, v_codigo_barra
	;
	return;
end if;

UPDATE mod_datosmaestros.dat_impproducto a
	SET codigobarra = mod_datosmaestros.f_generar_codigo_barra_sequencia_codigochequeo(
			v_codigo_barra, 
			v_nombre_sequencia,
			v_inicio_fin_sequencia,
			v_inicio_fin_codigochequeo
		)
	from (
		select idimpproducto
		from mod_datosmaestros.tmp_impproductoerror
		where error = '7'
	) b
	WHERE a.idimpproducto = b.idimpproducto;

if v_inicio_fin_sequencia[1] > 0 THEN
	perform mod_datosmaestros.f_actualizar_codigo_barra_sequencia_actual(
		p_idestandarcodigobarra,
		case when v_es_por_estructura then p_idestructura else null end,
		v_nombre_sequencia
	);
end if;

return query
select v_codigo_msg, v_msg, v_codigo_barra
;
end
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_generar_codigo_barra_en_impproducto(numeric, numeric)
    OWNER TO zeolides;