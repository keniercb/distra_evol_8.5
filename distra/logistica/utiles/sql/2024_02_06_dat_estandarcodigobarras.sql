CREATE SEQUENCE IF NOT EXISTS mod_datosmaestros.sec_datestandarcodigobarras_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9999999
    CACHE 1;

CREATE TABLE IF NOT EXISTS mod_datosmaestros.dat_estandarcodigobarras
(
    idestandarcodigobarra numeric(19,0) NOT NULL DEFAULT nextval('mod_datosmaestros.sec_datestandarcodigobarras_seq'::regclass),
    denominacion character varying(255) NOT NULL,
    bandera character varying(255) NOT NULL,
    formato character varying(255) NOT NULL,
    sequenciaporentidad boolean NOT NULL DEFAULT false,
    CONSTRAINT dat_estandarcodigobarras_pkey PRIMARY KEY (idestandarcodigobarra)
    )
    WITH (
        OIDS = FALSE
        )
    ;

ALTER TABLE IF EXISTS mod_datosmaestros.dat_estandarcodigobarras
    OWNER to zeolides;

--------------------------

CREATE SEQUENCE IF NOT EXISTS mod_datosmaestros.sec_datestandarcodigobarras_estructura_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9999999
    CACHE 1;

CREATE TABLE mod_datosmaestros.dat_estandarcodigobarras_estructuraseq
(
    idestandaracodbestructuraseq numeric(19) NOT NULL DEFAULT nextval('mod_datosmaestros.sec_datestandarcodigobarras_estructura_seq'::regclass),
    idestandarcodigobarra numeric(19) NOT NULL,
    idestructura numeric(19),
    secuenciaactual numeric(10) NOT NULL DEFAULT 0,
    PRIMARY KEY (idestandaracodbestructuraseq),
    CONSTRAINT fk_estancodbarrseqestructu_idestandarcodigobarras FOREIGN KEY (idestandarcodigobarra)
        REFERENCES mod_datosmaestros.dat_estandarcodigobarras (idestandarcodigobarra) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT fk_estancodbarrseqestructu_estructura FOREIGN KEY (idestructura)
        REFERENCES mod_estructuracomp.nom_filaestruc (idfila) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
);

ALTER TABLE IF EXISTS mod_datosmaestros.dat_estandarcodigobarras_estructuraseq
    OWNER to zeolides;


----------------------------

INSERT INTO mod_logistica.nom_variableglobal(
	nombre, valor, activo, ambito, datatype)
	VALUES ('VG_ISCIMEX', 'true', 1, 1, 2);


---------------------------------------

ALTER TABLE IF EXISTS mod_datosmaestros.tmp_impproductoerror
    ADD COLUMN IF NOT EXISTS idimpproducto numeric(19);

CREATE OR REPLACE FUNCTION mod_datosmaestros.f_validadataimportaproducto(
	)
    RETURNS integer[]
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
v_result integer[]:=array[0];
v_rec record;
v_productos record;
v_iscimex record;
begin

delete from mod_datosmaestros.tmp_impproductoerror;
--Para productos  duplicados
select a.codigoproducto into v_rec
from mod_datosmaestros.dat_impproducto a
where  a.codigoproducto is not null
group by a.codigoproducto
having count(*) > 1
order by a.codigoproducto;

if v_rec.codigoproducto is not null then v_result:= v_result|| array[3]; end if;
--codigos null
--codigos duplicados
insert into mod_datosmaestros.tmp_impproductoerror(
    codigoproducto,
    codigobarra,
    denominacionproducto,
    um,
    error
  )
  select 'Sin codigo', a.codigobarra, a.denominacionproducto, a.um, '3' 
  from mod_datosmaestros.dat_impproducto a
  where length(a.codigoproducto) = 0
  group by a.codigoproducto, a.codigobarra, a.denominacionproducto, a.um;

--codigos duplicados
insert into mod_datosmaestros.tmp_impproductoerror(
    codigoproducto,
    codigobarra,
    denominacionproducto,
    um,
    error
  )
  select a.codigoproducto, a.codigobarra, a.denominacionproducto, a.um, '1' 
  from mod_datosmaestros.dat_impproducto a
  group by a.codigoproducto, a.codigobarra, a.denominacionproducto, a.um
  having (select count(a1.codigoproducto) from mod_datosmaestros.dat_impproducto a1 where a1.codigoproducto = a.codigoproducto) > 1;
    
  --codigos de barras duplicados
  --codigos duplicados
insert into mod_datosmaestros.tmp_impproductoerror(
    codigoproducto,
    codigobarra,
    denominacionproducto,
    um,
    error
  )
  select a.codigoproducto, a.codigobarra, a.denominacionproducto, a.um, '2' 
  from mod_datosmaestros.dat_impproducto a
  group by a.codigoproducto, a.codigobarra, a.denominacionproducto, a.um
  having (select count(a1.codigobarra) from mod_datosmaestros.dat_impproducto a1 where a1.codigobarra = a.codigobarra) > 1;
    
--Código producto nulos
/*select a.codigoproducto, a.almacenamiento into v_rec from mod_datosmaestros.dat_impproducto a where a.codigoproducto is null;

if v_rec.almacenamiento is not null then v_result:= v_result|| array[4]; end if;*/

---codigos de barras

select valor into v_iscimex
from mod_logistica.nom_variableglobal
where nombre = 'VG_ISCIMEX' and valor = 'true';

IF v_iscimex.valor is not null THEN
--codigo barra vacio
select count(*) as cantidad into v_rec
from mod_datosmaestros.dat_impproducto
where codigobarra is null or length(codigobarra) = 0;

if v_rec.cantidad > 0 then v_result:= v_result|| array[7]; end if;

insert into mod_datosmaestros.tmp_impproductoerror(
    idimpproducto,
    codigoproducto,
    codigobarra,
    denominacionproducto,
    um,
    error
  )
  select a.idimpproducto, a.codigoproducto, 'Sin codigo de barra', a.denominacionproducto, a.um, '7' 
  from mod_datosmaestros.dat_impproducto a
  where a.codigobarra is null or length(a.codigobarra) = 0
  group by a.idimpproducto, a.codigoproducto, a.codigobarra, a.denominacionproducto, a.um;

-----------------
--tamannos no permitidos
select count(*) as cantidad into v_rec
from mod_datosmaestros.dat_impproducto
where (codigobarra is not null or length(codigobarra) > 0)
and length(codigobarra) not in(8,12,13,14,18);

if v_rec.cantidad > 0 then v_result:= v_result|| array[8]; end if;

insert into mod_datosmaestros.tmp_impproductoerror(
    codigoproducto,
    codigobarra,
    denominacionproducto,
    um,
    error
  )
  select a.codigoproducto, a.codigobarra, a.denominacionproducto, a.um, '8' 
  from mod_datosmaestros.dat_impproducto a
  where (a.codigobarra is not null or length(a.codigobarra) > 0)
  and length(codigobarra) not in(8,12,13,14,18)
  group by a.codigoproducto, a.codigobarra, a.denominacionproducto, a.um;

-----------------
--codigo chequeo correcto
select count(*) as cantidad into v_rec
from mod_datosmaestros.dat_impproducto
where length(codigobarra) = any(array[8,12,13,14,18])
and mod_datosmaestros.f_validarcodigodebarras(codigobarra) = false;

if v_rec.cantidad > 0 then v_result:= v_result|| array[9]; end if;

insert into mod_datosmaestros.tmp_impproductoerror(
    codigoproducto,
    codigobarra,
    denominacionproducto,
    um,
    error
  )
  select a.codigoproducto, a.codigobarra, a.denominacionproducto, a.um, '9' 
  from mod_datosmaestros.dat_impproducto a
  where length(codigobarra) = any(array[8,12,13,14,18])
  and mod_datosmaestros.f_validarcodigodebarras(codigobarra) = false
  group by a.codigoproducto, a.codigobarra, a.denominacionproducto, a.um;

---------------
--codigo de barras solo numeros
select count(*) as cantidad into v_rec
from mod_datosmaestros.dat_impproducto
where length(codigobarra) > 0
and not codigobarra ~ '^[0-9]+$'
;

if v_rec.cantidad > 0 then v_result:= v_result|| array[10]; end if;

insert into mod_datosmaestros.tmp_impproductoerror(
    codigoproducto,
    codigobarra,
    denominacionproducto,
    um,
    error
  )
  select a.codigoproducto, a.codigobarra, a.denominacionproducto, a.um, '10' 
  from mod_datosmaestros.dat_impproducto a
  where length(codigobarra) > 0
  and not codigobarra ~ '^[0-9]+$'
  group by a.codigoproducto, a.codigobarra, a.denominacionproducto, a.um;



end if;

return v_result;
end
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_validadataimportaproducto()
    OWNER TO zeolides;

--------------

CREATE OR REPLACE FUNCTION mod_datosmaestros.f_validarcodigodebarras(
	p_codigobarras varchar
	)
    RETURNS bool
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
codchequeo INTEGER;
codchequeocalculado INTEGER;
multiplicarpar INTEGER = 1;
multiplicarimpar INTEGER = 1;
sumapar INTEGER = 0;
sumaimpar INTEGER = 0;
BEGIN
codbarra = p_codigobarras;
tamannocodigo = length(codbarra);
codchequeo = substring(codbarra from tamannocodigo for 1)::INTEGER;
codbarra = substring(codbarra for tamannocodigo-1);

codbarra_array := string_to_array(codbarra, null);
cantidad := array_upper(codbarra_array, 1) :: INTEGER;

if tamannocodigo = 13 then
multiplicarpar = 3;
elseif tamannocodigo = any(array[8,12,14,18]) then
multiplicarimpar = 3;
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

if codchequeocalculado = codchequeo then
return true;
else
return false;
end if;
end
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_validarcodigodebarras(varchar)
    OWNER TO zeolides;


---------------------------------------------
--mover a otro lado


CREATE OR REPLACE FUNCTION mod_datosmaestros.f_importaproducto(
	p_idusuario numeric)
    RETURNS numeric[]
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
v_recordnaturaleza record;
v_recmatriz record;
v_idmatrizprecio numeric;
v_idmatrizadd record;
v_idmatrizdual record;
v_idmatrizdualadd numeric;
v_idespecialidad numeric;
v_idprecio record;
v_record record;
v_result integer[];
  

BEGIN
v_idespecialidad := (select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                        where cue.idusuario = p_idusuario limit 1);
/*insert into mod_datosmaestros.tmp_importarjmr (codigoproducto, descripcionproducto, tipo) (select codigoproducto, descripcionproducto, tipo from mod_datosmaestros.dat_impproducto)	;	
return v_result;*/
v_result:= v_result || mod_datosmaestros.f_validadataimportaproducto();
if v_result @> array[2] or /*v_result @> array[3] or*/ v_result @> array[4] or v_result @> array[5] or v_result @> array[6] or v_result @> array[7] or v_result @> array[8] or v_result @> array[9] or v_result @> array[10] then return v_result; end if;

with indicadores AS (INSERT INTO mod_datosmaestros.nom_indicador
  ( 
  	numeropieza, tipo, denominacion, descripcion, idformato, idespecialidad, idelementogasto, 
  	idnaturaleza, idpadre, idumedida, idarbol, fechainicio, nivel,  idusuario) 
  (
    select distinct 
    a.codigoproducto, a.tipo,coalesce(a.descripcionproducto,'SIN DENOMINACION'),
    coalesce(a.descripcionproducto,'SIN DESCRIPCION'),
    s.idformato, COALESCE(v_idespecialidad,s.idespecialidad),g.idelementoobjeto,
    coalesce(nat.idnaturaleza,s.idnaturaleza),s.idindicador as idpadre,
    um.idunidadmedida,s.idindicador,now(),s.nivel,p_idusuario
    from mod_datosmaestros.dat_impproducto a
    left join mod_datosmaestros.nom_indicador ni on ni.numeropieza = a.codigoproducto
    left join mod_datosmaestros.nom_unidadmedida um on um.abreviaturaunidadmedida like a.um
    left join mod_datosmaestros.nom_naturaleza nat on nat.codigo ilike a.naturaleza
    left join mod_contabilidadcosto.nom_elementogasto g on g.codigoelementoobjeto ilike a.elementogasto
    left join mod_datosmaestros.tmp_impproductoerror err on err.codigoproducto = a.codigoproducto
    left join lateral (select ind.idformato,ind.idindicador,ind.tipo,ind.idespecialidad,
    		max(pf.nivel) as nivel,ind.idnaturaleza
        from mod_datosmaestros.nom_indicador ind 
        inner join mod_datosmaestros.dat_formato f on f.idformato = ind.idformato 
        inner join mod_datosmaestros.dat_parteformato pf on pf.idformato = f.idformato
		where ind.tipo = a.tipo			   
        group by ind.idformato,ind.idindicador,ind.tipo,ind.idespecialidad
        order by ind.idindicador asc limit 1) s on true
    where err.codigoproducto is null and ni.idindicador is NULL and a.codigoproducto is not null
  ) RETURNING idindicador as idsalida)
  INSERT INTO mod_datosmaestros.nom_indicadorhoja
    ( 
      idindicador
    )
  select idsalida from indicadores;  
    UPDATE 
      mod_datosmaestros.nom_indicadorhoja idh
    SET 
      idgruposubgrupo = indi.idgruposubgrupo,
      explotacion = indi.explotacion,
      almacenado = indi.almacenado,
      idmarca = indi.idmarca,
      idmodelo = indi.idmodelo,
      precio = indi.precio,
      tipocontrol = indi.tipocontrol,
      isuh = indi.isuh,
	  codigoauxiliar = indi.codigoauxiliar,
      referencia = indi.referencia,
      codigobarra = indi.codigobarra
    from (select (case when a.utiloherramienta = 1 then 1 else 0 end) as isuh,
    a.precio, COALESCE(a.formaalmacenamiento,1) as tipocontrol,ni.idindicador,
    gs.idgruposubgrupo,nm.idmarca,nmo.idmodelo,
    (case when a.almacenamiento in (1,3) then 1 else 0 end) as almacenado,
    (case when a.almacenamiento in (2,3) then 1 else 0 end) as explotacion,
	a.codigoauxiliar, a.referencia, a.codigobarra
    from mod_datosmaestros.dat_impproducto a
    inner join mod_datosmaestros.nom_indicador ni on ni.numeropieza = a.codigoproducto
    left join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
    left join mod_datosmaestros.nom_gruposubgrupo gs on gs.denominacion ilike a.grupo
    left join mod_datosmaestros.nom_marca nm on nm.codigo ilike a.marca
    left join mod_datosmaestros.nom_modelo nmo on nmo.denominacion ilike a.modelo
    /*where nih.idindicador is null*/) indi
    where indi.idindicador = idh.idindicador;
  --inserto en planificacion
  insert into mod_datosmaestros.nom_indicadorplanif
  (idindicador, nivelplanif)
  (select DISTINCT ni.idindicador, 1 from mod_datosmaestros.dat_impproducto a
    inner join mod_datosmaestros.nom_indicador ni on ni.numeropieza = a.codigoproducto
    left join mod_datosmaestros.nom_indicadorplanif nip on nip.idindicador = ni.idindicador
    where nip.idindicador is null
  );

  for v_recordnaturaleza in select dm.idtipoprecio, i.idnaturaleza from mod_logfacturacion.dat_matrizprecio dm
    inner join mod_logfacturacion.nom_tipoprecio ntp on ntp.idtipoprecio = dm.idtipoprecio
    inner join mod_datosmaestros.nom_indicador i on i.idindicador = dm.idindicador
      where ntp.estado = 1 and dm.idindicador in ( 
      select dm1.idindicador from mod_logfacturacion.dat_matrizprecio dm1 
      inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dm1.idindicador 
          where ni.idnaturaleza in (
          select ind.idnaturaleza from mod_datosmaestros.dat_impproducto im 
          inner join mod_datosmaestros.nom_indicador ind on ind.numeropieza = im.codigoproducto
          )
    ) and dm.preciopromedio = 1 group by dm.idtipoprecio, i.idnaturaleza
    order by i.idnaturaleza
loop

  /*select ind.idindicador into v_record from mod_datosmaestros.dat_impproducto im 
  inner join mod_datosmaestros.nom_indicador ind on ind.numeropieza = im.codigoproducto
  where ind.idnaturaleza = v_recordnaturaleza.idnaturaleza;*/
  
  --loop 
  	select max(dm.idmatrizprecio) into v_idmatrizprecio from mod_logfacturacion.dat_matrizprecio dm 
             where dm.idindicador in ( 
              select dm1.idindicador from mod_logfacturacion.dat_matrizprecio dm1 
                inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dm1.idindicador 
                where ni.idnaturaleza = v_recordnaturaleza.idnaturaleza
             ) and dm.preciopromedio = 1 and dm.idtipoprecio = v_recordnaturaleza.idtipoprecio;
                
    select dm.* into v_recmatriz from mod_logfacturacion.dat_matrizprecio dm where dm.idmatrizprecio = v_idmatrizprecio;
    
--raise notice 'v_record %',v_record;

	with matrizprecio AS (INSERT INTO 
        mod_logfacturacion.dat_matrizprecio
      (
        idindicador,
        idestructuracomun,
        preciopromedio,
        idtipoprecio,
        idumedida,
        bi
      )
      (select ind.idindicador,v_recmatriz.idestructuracomun,v_recmatriz.preciopromedio,
          v_recmatriz.idtipoprecio,v_recmatriz.idumedida, v_recmatriz.bi from mod_datosmaestros.dat_impproducto im 
      inner join mod_datosmaestros.nom_indicador ind on ind.numeropieza = im.codigoproducto
      where ind.idnaturaleza = v_recordnaturaleza.idnaturaleza)
      returning idmatrizprecio
    ),matrizpreciodualmonetaria as (INSERT INTO 
          mod_logfacturacion.dat_matrizpreciodualmonetaria
        (
          idmoneda,
          idmatrizprecio,
          precioventa,
          precio,
          porciento
        )
        (select s.idmoneda,mp.idmatrizprecio,0,0,s.porciento from matrizprecio mp
        inner join (select dmm.* from mod_logfacturacion.dat_matrizpreciodualmonetaria dmm
        ) s on s.idmatrizprecio = v_idmatrizprecio) 
        returning idmatrizpreciodualidadmonetaria
    )INSERT INTO mod_logfacturacion.dat_precio
      ( 
      	idcuentadesgloseprecio,	
      	idmatrizpreciodualidadmonetaria,
        valor,porciento,concepto
      )
      (select s.idcuentadesgloseprecio,mpd.idmatrizpreciodualidadmonetaria,
      s.valor,s.porciento,s.concepto from matrizpreciodualmonetaria mpd
      inner join (select p.*,dmm.idmatrizprecio from mod_logfacturacion.dat_precio p
      		inner join mod_logfacturacion.dat_matrizpreciodualmonetaria dmm 
            	on dmm.idmatrizpreciodualidadmonetaria = p.idmatrizpreciodualidadmonetaria
        ) s on s.idmatrizprecio = v_idmatrizprecio);
end loop;--end loop v_recordnaturaleza
delete from mod_datosmaestros.dat_impproducto;
return v_result;
end;
$BODY$;

ALTER FUNCTION mod_datosmaestros.f_importaproducto(numeric)
    OWNER TO zeolides;
