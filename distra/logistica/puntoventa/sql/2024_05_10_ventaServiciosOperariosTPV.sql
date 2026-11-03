--VARIABLE GLOBAL TPV_OPERARIOSERVICE = true
ALTER TABLE mod_logpuntoventa.dat_ventaservicio
  ADD COLUMN idpersona NUMERIC(19,0); 
  
CREATE SEQUENCE mod_logpuntoventa.sec_datserviciopersona_seq
  INCREMENT 1 MINVALUE 1000
  MAXVALUE 1099999999 START 1000
  CACHE 1;

ALTER SEQUENCE mod_logpuntoventa.sec_datserviciopersona_seq RESTART WITH 1000;

CREATE TABLE mod_logpuntoventa.dat_serviciopersona (
  idserviciopersona NUMERIC(19,0) DEFAULT nextval('mod_logpuntoventa.sec_datserviciopersona_seq'::regclass) NOT NULL,
  idservicio NUMERIC(19,0) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  CONSTRAINT dat_serviciopersona_pkey PRIMARY KEY(idserviciopersona),
  CONSTRAINT dat_serviciopersona_fk FOREIGN KEY (idservicio)
    REFERENCES mod_logpuntoventa.dat_servicioareaventa(idservicio)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logpuntoventa.dat_serviciopersona
  OWNER TO zeolides;  
  

ALTER TYPE mod_logpuntoventa.td_serviciosventa
  ADD ATTRIBUTE idpersona NUMERIC,
  ADD ATTRIBUTE nombrepersona VARCHAR;

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
v_inindextable record;
v_cantoperario numeric;
v_recordoperario record;
begin
for all_rec in
select dsa.idindicador,num.abreviaturaunidadmedida as um,dsa.idservicio,
(COALESCE(ni.numeropieza,ni.codigo)||' - '||coalesce(nih.descripcionventa,substring(ni.denominacion,0,30))) as text,
nn.denominacion as naturaleza,
(case when p_idmonedacontable is not null then (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedacontable) else '' end) as monedacontable,
(case when p_idmonedaventa is not null then (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = p_idmonedaventa) else '' end) as monedaventa,
count(*) OVER() as total,ni.codigo as referencia,coalesce(nih.descripcionventa,substring(ni.denominacion,0,25)) as descripcionventa,
ni.denominacion,nn.idnaturaleza,dsa.preciobase as preciobase, dsa.precio as precioventa,
(select natv.idreferencia from mod_logpuntoventa.dat_naturalezaagrupacion natv 
inner join mod_logpuntoventa.dat_naturalezaventa nvv on nvv.idpadre = natv.idnaturalezaagrupacion
where nvv.idnaturaleza = nn.idnaturaleza limit 1) as idcategoriapadre
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
select ps.idindicador, ps.idareaventa into v_inindextable from mod_logpuntoventa.dat_prodservareaventa ps 
  where ps.idareaventa = p_idareaventa and ps.idindicador = all_rec.idindicador;
  if v_inindextable.idindicador is null then
      insert into mod_logpuntoventa.dat_prodservareaventa(idindicador, idareaventa)
      values(all_rec.idindicador, p_idareaventa) RETURNING indexaux into all_rec.indexauxiliar;
  end if; 
  select count(distinct sp.idpersona) into v_cantoperario from mod_logpuntoventa.dat_serviciopersona sp 
  where sp.idservicio = all_rec.idservicio;
  if v_cantoperario = 1 THEN
  	select sp.idpersona, per.nombre || ' ' || coalesce(per.snombre, '') || ' ' || per.papel || ' ' || per.sapel as nombre 
    into v_recordoperario from mod_logpuntoventa.dat_serviciopersona sp 
    inner join mod_persona.dat_persona per on per.idpersona = sp.idpersona 
    where sp.idservicio = all_rec.idservicio limit 1;
  	all_rec.idpersona := v_recordoperario.idpersona;
    all_rec.nombrepersona := v_recordoperario.nombre;
  else
  	all_rec.idpersona := -1;
    all_rec.nombrepersona := '';
  end if;
--raise exception '%', all_rec;
return next all_rec; end loop;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;
  