-- mod_logpuntoventa.dat_pedidotienda definition

-- Drop table

-- DROP TABLE mod_logpuntoventa.dat_pedidotienda;

CREATE SEQUENCE mod_logpuntoventa.sec_datverificacionprecios_seq
	INCREMENT BY 1
	MINVALUE 1000
	MAXVALUE 1099999999
	START 1000
	CYCLE;

CREATE TABLE mod_logpuntoventa.dat_verificacionprecios (
	idpedidotienda numeric(19) DEFAULT nextval('mod_logpuntoventa.sec_datverificacionprecios_seq'::regclass) NOT NULL,
	fechapedido date NULL,
	idestructuracomun numeric(19) NULL,
	idareaventa numeric(19) NULL,
	idusuario numeric(19) NULL,
	identificador varchar(100) NULL,
	infoventa text NULL,
	receiptnumber int4 NULL,
	CONSTRAINT dat_verificacionprecios_pkey PRIMARY KEY (idpedidotienda)
);

CREATE TABLE mod_logpuntoventa.tmp_productosventasprecio (
	idpedidotienda numeric(19) NOT NULL,
	codigo varchar(100) NULL,
	idindicador numeric(19)
);


-- DROP FUNCTION mod_logpuntoventa.f_verificarproductoventa(numeric, _varchar, _varchar);

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_verificarproductoventa(p_idpedido numeric, productos character varying[], servicios character varying[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
v_datosconf record;
v_recproductos record;
v_recservicios record;
v_in record;
v_tasa record;
v_preciobase numeric;
v_precio numeric;
v_idprecioslotes numeric;
v_count numeric;
v_datospedido record;
v_recventa record;
v_lineprod varchar[];
v_codprod varchar;
v_precioprod numeric(25,6);
begin
	
CREATE TEMPORARY TABLE tmp_auxiliarventas
(
      codigo varchar,
      precio numeric(25,6)
)
ON COMMIT drop;
	
SELECT * into v_datospedido FROM mod_logpuntoventa.dat_verificacionprecios where idpedidotienda = p_idpedido;	
SELECT * into v_datosconf FROM mod_logpuntoventa.dat_areaventa where idareaventa = v_datospedido.idareaventa;

for v_recventa in 
	select
		regexp_split_to_table(
			v_datospedido.infoventa
			, '\n') as linea
loop
	select
		array_agg(t.fragmento) into v_lineprod from (
			select regexp_split_to_table(v_recventa.linea, ';') as fragmento
		) t;
	
	if v_lineprod[4]::numeric = 4 then
			v_codprod := v_lineprod[5];
			v_precioprod := REGEXP_REPLACE(v_lineprod[17],',','')::numeric;
			insert into tmp_auxiliarventas(codigo, precio)values(v_codprod, v_precioprod);
	end if;	
end loop;

for v_recproductos in select pa.idproducto, ni.idindicador, pa.precio, pa.preciobase, va.precio as preciosalida, coalesce(nih.codigobarra, coalesce(ni.numeropieza, ni.codigo)) as codigo from mod_logpuntoventa.dat_productoareaventa pa 
	inner join mod_logistica.dat_producto p on p.idproducto = pa.idproducto
	inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = p.idindicador
	inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
	inner join tmp_auxiliarventas va on va.codigo = coalesce(nih.codigobarra, coalesce(ni.numeropieza, ni.codigo))::varchar
	where pa.idareaventa = v_datospedido.idareaventa 
	and coalesce(nih.codigobarra, coalesce(ni.numeropieza, ni.codigo))::varchar = any(productos) 
	and va.precio <> pa.precio
loop 
		insert into mod_logpuntoventa.tmp_productosventasprecio(idpedidotienda, codigo, idindicador)
		values(p_idpedido, v_recproductos.codigo, v_recproductos.idindicador);
end loop;

for v_recservicios in select ds.* from mod_logpuntoventa.dat_servicioareaventa ds 
	inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = ds.idindicador
	inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
	inner join tmp_auxiliarventas va on va.codigo = coalesce(nih.codigobarra, coalesce(ni.numeropieza, ni.codigo))::varchar
	where ds.idareaventa = v_datospedido.idareaventa
	and coalesce(nih.codigobarra, coalesce(ni.numeropieza, ni.codigo))::varchar = any(servicios) 
	and va.precio <> ds.precio
loop 
		insert into mod_logpuntoventa.tmp_productosventasprecio(idpedidotienda, codigo, idindicador)
		values(p_idpedido, v_recservicios.codigo, v_recservicios.idindicador);
end loop;

END;
$function$
;



