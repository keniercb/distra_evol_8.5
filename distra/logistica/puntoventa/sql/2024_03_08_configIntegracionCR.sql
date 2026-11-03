CREATE SEQUENCE mod_logpuntoventa.sec_datinfoconexioncr_seq
  INCREMENT 1 MINVALUE 10000000
  MAXVALUE 1099999999 START 1000000000
  CACHE 1;

ALTER SEQUENCE mod_logpuntoventa.sec_datinfoconexioncr_seq RESTART WITH 10000001;


CREATE TABLE mod_logpuntoventa.dat_infoconexioncr (
  idinfoconexioncr NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_datinfoconexioncr_seq'::regclass) NOT NULL,
  tipo VARCHAR(10),
  url VARCHAR(150) NOT NULL,
  clave VARCHAR(150) NOT NULL,
  keypublic VARCHAR(150),
  keysecret VARCHAR(150),
  CONSTRAINT dat_infoconeccioncr_pkey PRIMARY KEY(idinfoconexioncr)
) 
WITH (oids = false);

ALTER TABLE mod_logpuntoventa.dat_infoconexioncr
  OWNER TO zeolides;
  
--Campos en caja
ALTER TABLE IF EXISTS mod_logpuntoventa.dat_caja
  ADD COLUMN IF NOT EXISTS modelocaja VARCHAR(50);  

ALTER TABLE IF EXISTS mod_logpuntoventa.dat_caja
  ADD COLUMN IF NOT EXISTS identificador VARCHAR(50);  

ALTER TABLE IF EXISTS mod_logpuntoventa.dat_caja
  ADD COLUMN IF NOT EXISTS ip VARCHAR(20);  
  
ALTER TABLE IF EXISTS mod_logpuntoventa.dat_caja
  ADD COLUMN IF NOT EXISTS idtiporegistradora NUMERIC(2,0);  
  
--Campos caja usuario

ALTER TABLE IF EXISTS mod_logpuntoventa.dat_cajausuario
  ADD COLUMN IF NOT EXISTS pin NUMERIC(8,0);

ALTER TABLE IF EXISTS mod_logpuntoventa.dat_cajausuario
  ADD COLUMN IF NOT EXISTS tipo NUMERIC(1,0);  
  
--Campos Gestion de cajeros 

ALTER TABLE IF EXISTS mod_logpuntoventa.dat_cajero
  ADD COLUMN IF NOT EXISTS idestructuracomun NUMERIC(19,0);  

--Campos area de venta
ALTER TABLE IF EXISTS mod_logpuntoventa.dat_areaventa
  ADD COLUMN IF NOT EXISTS idinfoconexioncr NUMERIC(19,0);
  
ALTER TABLE mod_logpuntoventa.dat_areaventa
  ADD CONSTRAINT dat_areaventaconexioncr_fk FOREIGN KEY (idinfoconexioncr)
    REFERENCES mod_logpuntoventa.dat_infoconexioncr(idinfoconexioncr)
    ON DELETE SET NULL
    ON UPDATE NO ACTION
    NOT DEFERRABLE;  

--Servicios areas de venta
CREATE SEQUENCE mod_logpuntoventa.sec_datservicioareaventa_seq
  INCREMENT 1 MINVALUE 1000000
  MAXVALUE 1099999999 START 1000000
  CACHE 1;

ALTER SEQUENCE mod_logpuntoventa.sec_datservicioareaventa_seq RESTART WITH 1000001;


CREATE TABLE mod_logpuntoventa.dat_servicioareaventa (
  idservicio NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_datservicioareaventa_seq'::regclass) NOT NULL,
  idindicador NUMERIC(19,0) NOT NULL,
  codigo VARCHAR(100),
  denominacion VARCHAR(255),
  descripcionventa VARCHAR(25),
  preciobase NUMERIC(25,6) DEFAULT 0,
  precio NUMERIC(25,6) DEFAULT 0,
  idmoneda NUMERIC(19,0) NOT NULL,
  idareaventa NUMERIC(19,0) NOT NULL,
  fecha DATE,
  CONSTRAINT dat_servicioareaventa_pkey PRIMARY KEY(idservicio),
  CONSTRAINT dat_servicioareaventa_fk FOREIGN KEY (idindicador)
    REFERENCES mod_datosmaestros.nom_indicador(idindicador)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT
    NOT DEFERRABLE,
  CONSTRAINT dat_servicioareaventa_fk1 FOREIGN KEY (idmoneda)
    REFERENCES mod_datosmaestros.nom_moneda(idmoneda)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT dat_servicioareaventa_fk2 FOREIGN KEY (idareaventa)
    REFERENCES mod_logpuntoventa.dat_areaventa(idareaventa)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON COLUMN mod_logpuntoventa.dat_servicioareaventa.fecha
IS 'Fecha de actualizacion del precio';

ALTER TABLE mod_logpuntoventa.dat_servicioareaventa
  OWNER TO zeolides;  
  
CREATE SEQUENCE mod_logpuntoventa.sec_hisservicioareaventa_seq
  INCREMENT 1 MINVALUE 10000
  MAXVALUE 1099999999 START 10000
  CACHE 1;

ALTER SEQUENCE mod_logpuntoventa.sec_hisservicioareaventa_seq RESTART WITH 10001;


CREATE TABLE mod_logpuntoventa.his_servicioareaventa (
  idhistorico NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_hisservicioareaventa_seq'::regclass) NOT NULL,
  idservicio NUMERIC(19,0) NOT NULL,
  idindicador NUMERIC(19,0) NOT NULL,
  preciobase NUMERIC(25,6) DEFAULT 0 NOT NULL,
  precio NUMERIC(25,6) DEFAULT 0 NOT NULL,
  idmoneda NUMERIC(19,0) NOT NULL,
  fechaanterior DATE NOT NULL,
  fechaactualizacion DATE NOT NULL,
  CONSTRAINT his_servicioareaventa_pkey PRIMARY KEY(idhistorico),
  CONSTRAINT his_servicioareaventa_fk FOREIGN KEY (idservicio)
    REFERENCES mod_logpuntoventa.dat_servicioareaventa(idservicio)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT his_servicioareaventa_fk1 FOREIGN KEY (idmoneda)
    REFERENCES mod_datosmaestros.nom_moneda(idmoneda)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON COLUMN mod_logpuntoventa.his_servicioareaventa.idhistorico
IS 'Id de la tabla';

COMMENT ON COLUMN mod_logpuntoventa.his_servicioareaventa.idindicador
IS 'Id del servicio';

COMMENT ON COLUMN mod_logpuntoventa.his_servicioareaventa.preciobase
IS 'Precio base historico';

COMMENT ON COLUMN mod_logpuntoventa.his_servicioareaventa.precio
IS 'Precio de venta historico';

COMMENT ON COLUMN mod_logpuntoventa.his_servicioareaventa.idmoneda
IS 'Id de la moneda';

COMMENT ON COLUMN mod_logpuntoventa.his_servicioareaventa.fechaanterior
IS 'Fecha anterior';

COMMENT ON COLUMN mod_logpuntoventa.his_servicioareaventa.fechaactualizacion
IS 'Fecha de actualizacion del precio';

ALTER TABLE mod_logpuntoventa.his_servicioareaventa
  OWNER TO zeolides;  
  
CREATE TYPE mod_logpuntoventa.td_serviciosventa AS (
  idindicador NUMERIC(19,0),
  umedida VARCHAR,
  idservicio NUMERIC(19,0),
  text VARCHAR,
  naturaleza VARCHAR,
  monedacontable VARCHAR,
  monedaventa VARCHAR,
  count NUMERIC(19,0),
  referencia VARCHAR,
  descripcionventa VARCHAR,
  denominacion VARCHAR,
  idnaturaleza NUMERIC(19,0),
  precio NUMERIC(25,6),
  precioventa NUMERIC(25,6),
  idcategoriapadre NUMERIC
);

ALTER TYPE mod_logpuntoventa.td_serviciosventa
  OWNER TO zeolides;  
  
CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_serviciosventa (
  p_idareaventa numeric,
  p_idnaturaleza numeric,
  p_criterio varchar,
  p_idmonedacontable numeric,
  p_idmonedaventa numeric,
  p_limit numeric,
  p_start numeric,
  p_criterioavan numeric,
  p_idnaturalezapadre numeric,
  p_precio numeric = 0
)
RETURNS SETOF mod_logpuntoventa.td_serviciosventa AS
$body$
declare
all_rec mod_logpuntoventa.td_serviciosventa;
begin
for all_rec in
select dsa.idindicador,num.abreviaturaunidadmedida as um,dsa.idservicio,
(COALESCE(ni.numeropieza,ni.codigo)||' - '||coalesce(nih.descripcionventa,substring(ni.denominacion,0,30))) as text,
nn.denominacion as naturaleza,
(case when p_idmonedacontable is not null then (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedacontable) else '' end) as monedacontable,
(case when p_idmonedaventa is not null then (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedaventa) else '' end) as monedaventa,
count(*) OVER() as total,ni.numeropieza as referencia,coalesce(nih.descripcionventa,substring(ni.denominacion,0,25)) as descripcionventa,
ni.denominacion,nn.idnaturaleza,dsa.preciobase as preciobase, dsa.precio as precioventa,
(select natv.idreferencia from mod_logpuntoventa.dat_areaventanaturaleza natv where natv.idareaventa = dsa.idareaventa
and natv.idnaturaleza = nn.idnaturaleza limit 1) as idcategoriapadre
from mod_logpuntoventa.dat_servicioareaventa dsa
inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dsa.idindicador
left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = ni.idumedida
left join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador= ni.idindicador
left join mod_datosmaestros.nom_naturaleza nn on nn.idnaturaleza = ni.idnaturaleza
left join mod_datosmaestros.nom_especialidad ne on ne.idespecialidad = ni.idespecialidad
where dsa.idareaventa = p_idareaventa
and (case when p_criterio is not null then (ni.denominacion ilike '%' || p_criterio || '%' or ni.numeropieza ilike '%' || p_criterio || '%' or ni.codigo ilike '%' || p_criterio || '%') else
true end)
and(case when p_idnaturaleza is not null then ni.idnaturaleza = p_idnaturaleza else true end)
and(case when p_idnaturalezapadre is not null then ni.idnaturaleza =any(
select idnaturaleza from mod_logpuntoventa.dat_naturalezaventa where idpadre = p_idnaturalezapadre
)else true end)
and(case when p_precio = 1 then dsa.precio > 0 else true end)

group by dsa.idindicador,ni.codigo,ni.numeropieza,ni.denominacion,ni.descripcion,num.abreviaturaunidadmedida,dsa.idservicio,nih.descripcionventa,
nn.idnaturaleza,nn.denominacion,ne.denespecialidad,
dsa.preciobase,dsa.precio,dsa.idareaventa

order by text
offset p_start limit p_limit
loop
--raise exception '%', all_rec;
return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER FUNCTION mod_logpuntoventa.f_serviciosventa (p_idareaventa numeric, p_idnaturaleza numeric, p_criterio varchar, p_idmonedacontable numeric, p_idmonedaventa numeric, p_limit numeric, p_start numeric, p_criterioavan numeric, p_idnaturalezapadre numeric, p_precio numeric)
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logfacturacion.f_getserviciosprecioventa (
  p_idareaventa numeric,
  p_idcliente numeric,
  p_idtipoprecio numeric,
  p_idmoneda numeric,
  p_idestructuracomun numeric
)
RETURNS SETOF mod_logfacturacion.td_precioventa AS
$body$
declare
all_rec mod_logfacturacion.td_precioventa;
v_conf record;
v_idmonedacontable numeric;
v_idmonedaalt numeric;
v_monedas record;
v_servicios record;
v_degloseprecio record;
v_matrizdualidad record;
v_configurado numeric;
v_medianaturaleza numeric;
v_mediasector numeric;
v_ventaredondeo numeric;
v_sector numeric;
v_decimasuperior numeric;
begin
select coalesce(conf.idpadrematriz,conf.idestructuracomun) as idpadrematriz into v_conf from mod_logfacturacion.conf_configuracionfactura conf 
where conf.idestructuracomun = p_idestructuracomun;
                
for v_servicios in select dsa.idservicio, dsa.idindicador,
0.0 as precio,
0.0 as precioventa,
0.0 as precioalt,
0.0 as precioventaalt,
concat(ni.numeropieza,'-',ni.denominacion) as servicio,
ni.idnaturaleza
from mod_logpuntoventa.dat_servicioareaventa dsa
inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dsa.idindicador
where dsa.idareaventa = p_idareaventa
loop
	v_configurado = 0;
    all_rec.precio = 0;
    all_rec.precioventa = 0; 
    all_rec.precioalt = 0;
    all_rec.precioventaalt = 0; 
    all_rec.producto = v_servicios.servicio;
	for v_matrizdualidad in select dm.preciopromedio, dmd.idmatrizpreciodualidadmonetaria, dmd.idmoneda, coalesce(dmd.precio,0) as precio, coalesce(dmd.precioventa,0) as precioventa 
    						from mod_logfacturacion.dat_matrizpreciodualmonetaria dmd 
                            inner join mod_logfacturacion.dat_matrizprecio dm on dm.idmatrizprecio = dmd.idmatrizprecio
                            where dm.idindicador = v_servicios.idindicador and dm.idtipoprecio = p_idtipoprecio
                            and dm.idestructuracomun = v_conf.idpadrematriz
	LOOP
         
	    if v_matrizdualidad.idmoneda = p_idmoneda then
            	all_rec.precio = v_matrizdualidad.precio;
	            all_rec.precioventa = v_matrizdualidad.precioventa;
        else
        	all_rec.precioalt = 0;
	        all_rec.precioventaalt = 0;
        end if;
    end loop;    
    v_sector := (select nicl.idsector from mod_datosmaestros.nom_clientesproveedor nicl where nicl.idclientesproveedores = p_idcliente limit 1);    
    v_medianaturaleza := (select coalesce((Select nm.media from mod_logfacturacion.dat_naturalezamedia nm  
                where nm.idtipoprecio = p_idtipoprecio and nm.idnaturaleza = v_servicios.idnaturaleza),1));
    v_mediasector := (select coalesce((Select sm.media from mod_logfacturacion.dat_sectormedia sm  
                where sm.idtipoprecio = p_idtipoprecio and sm.idnaturaleza = v_servicios.idnaturaleza 
                and sm.idsector = v_sector),1));
    all_rec.precioventa = all_rec.precioventa*v_medianaturaleza*v_mediasector; 
    all_rec.precioventa = round(all_rec.precioventa,6);
    v_decimasuperior := (select coalesce((select dcr.redondear from mod_logfacturacion.dat_clienteredondeo dcr
    where dcr.idtipoprecio = p_idtipoprecio and dcr.idcliente = p_idcliente limit 1),0));
    if v_decimasuperior = 1 THEN
		all_rec.precioventa = round(all_rec.precioventa,2);
        v_ventaredondeo = all_rec.precioventa*100;
        if v_ventaredondeo%10 <> 0 THEN
        	all_rec.precioventa = (v_ventaredondeo - v_ventaredondeo%10 + 10)/100;
            all_rec.precioventa = round(all_rec.precioventa,2);
        end if;
    end if;    
	all_rec.idproducto = v_servicios.idservicio;    
	return next all_rec;
end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

ALTER FUNCTION mod_logfacturacion.f_getserviciosprecioventa (p_idareaventa numeric, p_idcliente numeric, p_idtipoprecio numeric, p_idmoneda numeric, p_idestructuracomun numeric)
  OWNER TO zeolides;  

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_actualizarpreciosventa (
  p_idareaventa numeric,
  p_fechacontable date
)
RETURNS void AS
$body$
DECLARE
v_datosconf record;
v_recprodutos record;
v_recservicios record;
v_in record;
v_tasa record;
v_preciobase numeric;
v_precio numeric;
v_idprecioslotes numeric;
v_count numeric;
BEGIN
SELECT * into v_datosconf FROM mod_logpuntoventa.dat_areaventa where idareaventa = p_idareaventa;
--raise notice 'v_datosconf %',v_datosconf;
for v_recprodutos in SELECT idproducto, precio, precioventa, precioalt, precioventaalt, monedacontable, monedaalternativa 
                      FROM mod_logfacturacion.f_getproductosprecioventa(v_datosconf.idestructuraop, v_datosconf.idcliente, 
                      v_datosconf.idtipoprecio, v_datosconf.idmoneda, v_datosconf.idestructuracomun)
loop
	/*if v_recprodutos.monedaalternativa != v_datosconf.idmoneda then
        v_preciobase = 0;
        v_precio = 0;
   		select * into v_tasa from mod_logpuntoventa.nom_tasacambio where idmonedabase = v_recprodutos.monedaalternativa and idmonedacambio = v_datosconf.idmoneda; 	
        if v_tasa.idtasacambio is not null then
        	v_preciobase = round((v_recprodutos.precioalt * v_tasa.venta),2);
            v_precio = round((v_recprodutos.precioventaalt * v_tasa.venta),2);
        else 
        	select * into v_tasa from mod_logpuntoventa.nom_tasacambio where idmonedabase = v_datosconf.idmoneda and idmonedacambio = v_recprodutos.monedaalternativa; 
            if v_tasa.idtasacambio is not null then
            	v_preciobase = round((v_recprodutos.precioalt / v_tasa.venta),2);
                v_precio = round((v_recprodutos.precioventaalt / v_tasa.venta),2);
            end if;
        end if;
    else*/
    	v_preciobase = v_recprodutos.precio;
        v_precio = v_recprodutos.precioventa;
    --end if;
    --raise notice 'v_tasa %',v_tasa;
	select * into v_in from mod_logpuntoventa.dat_productoareaventa where idproducto = v_recprodutos.idproducto;
    --raise notice 'v_in %',v_in.precio||'---'|| v_recprodutos.precioventaalt;
      if v_in.idproducto is not null and (v_in.precio != v_precio or v_in.preciobase != v_preciobase) then
       	UPDATE mod_logpuntoventa.dat_productoareaventa 
        SET preciobase = v_preciobase,
            precio = v_precio,
            idmoneda = v_datosconf.idmoneda,
            fecha = p_fechacontable
        WHERE idproducto = v_in.idproducto; 
          INSERT INTO mod_logpuntoventa.his_productoareaventa(idproducto,preciobase,precio,idmoneda,fechaanterior,fechaactualizacion)
			VALUES (v_in.idproducto,coalesce(v_in.preciobase,0),coalesce(v_in.precio,0),v_in.idmoneda,v_in.fecha,p_fechacontable);
          --enviar el otro para el historico
      else if v_in.idproducto is null then 
        INSERT INTO mod_logpuntoventa.dat_productoareaventa(idproducto,preciobase,precio,idmoneda,idareaventa,fecha)
          VALUES (v_recprodutos.idproducto,v_preciobase,v_precio,v_datosconf.idmoneda,p_idareaventa,p_fechacontable);
        end if;
      end if;
      v_count := (select count(l.idlote) 
       from mod_logistica.dat_lote l 
      left join mod_logpuntoventa.dat_productolote pl on pl.idlote = l.idlote
      where l.idproducto = v_recprodutos.idproducto and l.cronologia > 0 and pl.idlote is null);
      if v_count > 0 and v_precio > 0 and v_preciobase > 0 then
        v_idprecioslotes := COALESCE((select pl.idprecioslotes from mod_logpuntoventa.dat_preciolotes pl where pl.idproducto = v_recprodutos.idproducto
        and pl.preciobase = v_preciobase and pl.precioventa = v_precio limit 1),0);
        if v_idprecioslotes = 0 then
            insert into mod_logpuntoventa.dat_preciolotes
            (
                preciobase,precioventa,fecha,idproducto
            )
            values (v_preciobase, v_precio, p_fechacontable, v_recprodutos.idproducto)
            returning idprecioslotes into v_idprecioslotes;
        end if; 
        insert into mod_logpuntoventa.dat_productolote(idlote, idproducto, preciobase, precioventa, fecha, idprecioslotes)
        (select l.idlote, v_recprodutos.idproducto, v_preciobase, v_precio, p_fechacontable, v_idprecioslotes 
         from mod_logistica.dat_lote l 
        left join mod_logpuntoventa.dat_productolote pl on pl.idlote = l.idlote
        where l.idproducto = v_recprodutos.idproducto and l.cronologia > 0 and pl.idlote is null);
     end if; 	   
     
end loop;  

for v_recservicios in SELECT f.idproducto, f.precio, f.precioventa, f.precioalt, f.precioventaalt, f.monedacontable, f.monedaalternativa,
 					  dsa.idindicador	
                      FROM mod_logfacturacion.f_getserviciosprecioventa(v_datosconf.idareaventa, v_datosconf.idcliente, 
                      v_datosconf.idtipoprecio, v_datosconf.idmoneda, v_datosconf.idestructuracomun) f
                      inner join mod_logpuntoventa.dat_servicioareaventa dsa on dsa.idservicio = f.idproducto
loop
	
    	v_preciobase = v_recservicios.precio;
        v_precio = v_recservicios.precioventa;
    
    select * into v_in from mod_logpuntoventa.dat_servicioareaventa where idservicio = v_recservicios.idproducto;
      if v_in.idservicio is not null and (v_in.precio != v_precio or v_in.preciobase != v_preciobase) then
       	UPDATE mod_logpuntoventa.dat_servicioareaventa 
        SET preciobase = v_preciobase,
            precio = v_precio,
            idmoneda = v_datosconf.idmoneda,
            fecha = p_fechacontable
        WHERE idservicio = v_in.idservicio; 
          INSERT INTO mod_logpuntoventa.his_servicioareaventa(idservicio, idindicador,preciobase,precio,idmoneda,fechaanterior,fechaactualizacion)
			VALUES (v_in.idservicio, v_in.idindicador,v_in.preciobase,v_in.precio,v_in.idmoneda,v_in.fecha,p_fechacontable);
          --enviar el otro para el historico
      else if v_in.idservicio is null then 
        INSERT INTO mod_logpuntoventa.dat_servicioareaventa(idservicio,idindicador,preciobase,precio,idmoneda,idareaventa,fecha)
          VALUES (v_recservicios.idproducto,v_recservicios.idindicador,v_preciobase,v_precio,v_datosconf.idmoneda,p_idareaventa,p_fechacontable);
        end if;
      end if;	   
     
end loop;

END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_logpuntoventa.f_actualizarpreciosventa (p_idareaventa numeric, p_fechacontable date)
  OWNER TO zeolides;  