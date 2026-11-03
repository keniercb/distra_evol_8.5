CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_confcamposreporte (
  p_idreporte numeric,
  p_idestructura numeric
)
RETURNS SETOF mod_logactivofijotangible.td_confcamposreporte AS
$body$
DECLARE
  v_rec mod_logactivofijotangible.td_confcamposreporte;
  v_identificador varchar = '';
  v_sql1 varchar = '';
  v_a varchar = '';
  v_aprobadopor varchar = '';
  v_anno varchar = '';
  v_jeferegvehiculo varchar = '';
  v_miembcomibaseuno varchar = '';
  v_miembcomibasedos varchar = '';
  v_miembcomibasetres varchar = '';
  v_miembcomisupeuno varchar = '';
  v_miembcomisupedos varchar = '';
  v_miembcomisupetres varchar = '';
  v_pertenece varchar = '';
  v_piefirmauno varchar = '';
  v_piefirmados varchar = '';
  v_prescomibase varchar = '';
  v_prescomisupe varchar = '';
  v_proviene varchar = '';
  v_reinscrito varchar = '';
  v_solicitadopor varchar = '';
  v_cargoaprueba varchar = '';
  v_cargorevisa varchar = '';
  v_revisadopor varchar = '';
  v_elaboradopor varchar = '';
  v_cargoelabora varchar = '';
  v_cargorecepciona varchar = '';
  v_recepcionadopor varchar = '';
  v_jefedpto varchar = '';
  v_autoriza varchar = '';
  v_cargo varchar = '';
  v_presidentecomibase varchar = '';
  v_presidentecomisup varchar = '';
  v_miembrocomibase varchar = '';
  v_miembrodos varchar = '';
  v_miembrouno varchar = '';
  v_presidente varchar = '';
  v_cargocomibaseuno varchar = '';
  v_cargocomibasedos varchar = '';
  v_cargocomibasetres varchar = '';  
  v_cargosolicitadopor varchar = '';
  v_cargopresidentecomisionbase varchar = '';
  
  v_cargorevisadopor varchar = '';
  v_cargocomisuperior varchar = '';
  v_cargocomisupuno varchar = '';
  v_cargocomisupdos varchar = '';
  

BEGIN
  create table datos_confreportes(
      idreporte NUMERIC(19,0),
      a VARCHAR(255),
      aprobadopor VARCHAR(255),
      anno VARCHAR(255),
      jeferegvehiculo VARCHAR(255),
      miembcomibaseuno VARCHAR(255),
      miembcomibasedos VARCHAR(255),
      miembcomibasetres VARCHAR(255),
      miembcomisupeuno VARCHAR(255),
      miembcomisupedos VARCHAR(255),
      miembcomisupetres VARCHAR(255),
      pertenece VARCHAR(255),
      piefirmauno VARCHAR(255),
      piefirmados VARCHAR(255),
      prescomibase VARCHAR(255),
      prescomisupe VARCHAR(255),
      proviene VARCHAR(255),
      reinscrito VARCHAR(255),
      solicitadopor VARCHAR(255),
      cargoaprueba VARCHAR(255),
      cargorevisa VARCHAR(255),
      revisadopor VARCHAR(255),
      elaboradopor VARCHAR(255),
      cargoelabora VARCHAR(255),
      cargorecepciona VARCHAR(255),
      recepcionadopor VARCHAR(255),
      jefedpto VARCHAR(255),
      autoriza VARCHAR(255),
  	  cargo VARCHAR(255),
      presidentecomibase VARCHAR(255),
      presidentecomisup VARCHAR(255),
      miembrocomibase VARCHAR(255),
      miembrodos VARCHAR(255),
      miembrouno VARCHAR(255),
      presidente VARCHAR(255),
      cargocomibaseuno VARCHAR(255),
      cargocomibasedos VARCHAR(255),
      cargocomibasetres VARCHAR(255),
	  cargosolicitadopor VARCHAR(255),
	  cargopresidentecomisionbase VARCHAR(255),
	  
	  
	  cargorevisadopor VARCHAR(255),
	  cargocomisuperior VARCHAR(255),
	  cargocomisupuno VARCHAR(255),
	  cargocomisupdos VARCHAR(255)
	  
	  
      );

  insert into datos_confreportes(idreporte)
  values ($1);
  v_sql1 = 'select
cfgr.nombrecampo,
cfgre.valor

from mod_logactivofijotangible.conf_reporteaft cfgr
inner join mod_logactivofijotangible.conf_reporteaftentidad cfgre on cfgr.idconfreporteaft = cfgre.idconfreporteaft
where cfgr.idreporte ='|| $1 ||' and cfgre.idestructura = '||$2;

  for v_rec in  execute v_sql1

  loop
    if v_rec.nombrecampo = 'A' THEN
      v_a = v_rec.valor;

    end if;
    if v_rec.nombrecampo = 'Aprobado por' THEN
      v_aprobadopor = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Año' THEN
      v_anno = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Jefe de registro de vehiculos de ' THEN
      v_jeferegvehiculo = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Miembro de la comisión de base 1' THEN
      v_miembcomibaseuno = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Miembro de la comisión de base 2' THEN
      v_miembcomibasedos = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Miembro de la comisión de base 3' THEN
      v_miembcomibasetres = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Miembro de la comisión superior 1' THEN
      v_miembcomisupeuno = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Miembro de la comisión superior 2' THEN
      v_miembcomisupedos = v_rec.valor;
    end if;
     if v_rec.nombrecampo = 'Miembro de la comisión superior 3' THEN
      v_miembcomisupetres = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Pertenece' THEN
      v_pertenece = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Pie de firma 1' THEN
      v_piefirmauno = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Pie de firma 2' THEN
      v_piefirmados = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Presidente de la comisión de base' THEN
      v_prescomibase = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Presidente de la comisión superior' THEN
      v_prescomisupe = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Proviene' THEN
      v_proviene = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Reinscrito' THEN
      v_reinscrito = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Solicitado por' THEN
      v_solicitadopor = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Cargo del que lo aprueba' THEN
      v_cargoaprueba = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Cargo del que lo revisa' THEN
      v_cargorevisa = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Revisado por' THEN
      v_revisadopor = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Elaborado por' THEN
      v_elaboradopor = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Cargo del que lo elabora' THEN
      v_cargoelabora = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Cargo del que lo recepciona' THEN
      v_cargorecepciona = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Recepcionado por' THEN
      v_recepcionadopor = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Jefe de Dpto' THEN
      v_jefedpto = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Autoriza' THEN
      v_autoriza = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Cargo' THEN
      v_cargo = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Presidente de la comisión de base' THEN
      v_presidentecomibase = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Presidente de la comisión superior' THEN
      v_presidentecomisup = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Presidente' THEN
      v_presidente = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Miembro 1' THEN
      v_miembrouno = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Miembro 2' THEN
      v_miembrodos = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Miembro comisión de base' THEN
      v_miembrocomibase = v_rec.valor;
    end if;    
    if v_rec.nombrecampo = 'Cargo miembro comisión de base 1' THEN
    	v_cargocomibaseuno = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Cargo miembro comisión de base 2' THEN
    	v_cargocomibasedos = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Cargo miembro comisión de base 3' THEN
    	v_cargocomibasetres = v_rec.valor;
    end if;	
	if v_rec.nombrecampo = 'Cargo solicitado por' THEN
    	v_cargosolicitadopor = v_rec.valor;
    end if;
    if v_rec.nombrecampo = 'Cargo presidente comisión de base' THEN
    	v_cargopresidentecomisionbase = v_rec.valor;
    end if;



	if v_rec.nombrecampo = 'Cargo revisado por' THEN
    	v_cargorevisadopor = v_rec.valor;
    end if;
	
	if v_rec.nombrecampo = 'Cargo presidente comisión superior' THEN
    	v_cargocomisuperior = v_rec.valor;
    end if;
	
	if v_rec.nombrecampo = 'Cargo miembro comisión superior 1' THEN
    	v_cargocomisupuno = v_rec.valor;
    end if;
	
	if v_rec.nombrecampo = 'Cargo miembro comisión superior 2' THEN
    	v_cargocomisupdos = v_rec.valor;
    end if;

	
  end loop;

  update datos_confreportes
  SET a = v_a,
      aprobadopor = v_aprobadopor,
      anno = v_anno,
      jeferegvehiculo = v_jeferegvehiculo,
      miembcomibaseuno = v_miembcomibaseuno,
      miembcomibasedos = v_miembcomibasedos,
      miembcomibasetres = v_miembcomibasetres,
      miembcomisupeuno = v_miembcomisupeuno,
      miembcomisupedos = v_miembcomisupedos,
      miembcomisupetres = v_miembcomisupetres,
      pertenece = v_pertenece,
      piefirmauno = v_piefirmauno,
      piefirmados = v_piefirmados,
      prescomibase = v_prescomibase,
      prescomisupe = v_prescomisupe,
      proviene = v_proviene,
      reinscrito = v_reinscrito,
      solicitadopor = v_solicitadopor,
      cargoaprueba = v_cargoaprueba,
      cargorevisa = v_cargorevisa,
      revisadopor = V_revisadopor,
      elaboradopor = v_elaboradopor,
      cargoelabora = v_cargoelabora,
      cargorecepciona = v_cargorecepciona,
      recepcionadopor = v_recepcionadopor,
      jefedpto = v_jefedpto,
      autoriza = v_autoriza,
      cargo = v_cargo,
      presidentecomibase = v_presidentecomibase,
      presidentecomisup = v_presidentecomisup,
      miembrocomibase = v_miembrocomibase,
      miembrodos = v_miembrodos,
      miembrouno = v_miembrouno,
      presidente = v_presidente,
      cargocomibaseuno = v_cargocomibaseuno,
      cargocomibasedos = v_cargocomibasedos,
      cargocomibasetres = v_cargocomibasetres,
	  cargosolicitadopor = v_cargosolicitadopor,
	  cargopresidentecomisionbase = v_cargopresidentecomisionbase,
	  
	  cargorevisadopor = v_cargorevisadopor,
	  cargocomisuperior = v_cargocomisuperior,
      cargocomisupuno = v_cargocomisupuno,
      cargocomisupdos = v_cargocomisupdos
	  

  where idreporte = $1;



  for v_rec in
  select 'reporte' as nombrecampo,
         $1 as valor,
         a,
         aprobadopor,
         anno,
         jeferegvehiculo,
         miembcomibaseuno,
         miembcomibasedos,
         miembcomibasetres,
         miembcomisupeuno,
         miembcomisupedos,
         miembcomisupetres,
         pertenece,
         piefirmauno,
         piefirmados,
         prescomibase,
         prescomisupe,
         proviene,
         reinscrito,
         solicitadopor,
         cargoaprueba,
      	 cargorevisa,
      	 revisadopor,
         elaboradopor,
         cargoelabora,
         cargorecepciona,
         recepcionadopor,
         jefedpto,
         autoriza,
         cargo,
         presidentecomibase,
         presidentecomisup,
         miembrocomibase,
         miembrodos,
         miembrouno,
         presidente,
         cargocomibaseuno,
         cargocomibasedos,
         cargocomibasetres,		 
		 cargosolicitadopor,
	     cargopresidentecomisionbase,
		 
		 
		 
		 cargorevisadopor,
	     cargocomisuperior,
         cargocomisupuno,
         cargocomisupdos
		 
		 
  from datos_confreportes

  LOOP
  return next v_rec;
  END LOOP;
drop table if exists datos_confreportes;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logactivofijotangible.f_confcamposreporte (p_idreporte numeric, p_idestructura numeric)
  OWNER TO zeolides;

DROP TYPE mod_logactivofijotangible.td_listarregistrosub CASCADE;
CREATE TYPE mod_logactivofijotangible.td_listarregistrosub AS (
  marca VARCHAR(255),
  nroserie VARCHAR(255),
  modelo VARCHAR(255),
  annofabricacion NUMERIC(19,0),
  nromotor1 VARCHAR(255),
  nromotor2 VARCHAR(255),
  logo TEXT,
  aft VARCHAR(255),
  colorprim VARCHAR(255),
  colorsec VARCHAR(255),
  nombrepais VARCHAR(255),
  valoradquisicion NUMERIC(25,6),
  nromatricula VARCHAR(255),
  nrocirculacion VARCHAR(255),
  valorcontable NUMERIC(25,6),
  nroinventario VARCHAR(255),
  observaciones VARCHAR(255),
  facturaoficio VARCHAR(255)
);

ALTER TYPE mod_logactivofijotangible.td_listarregistrosub
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_listarregistrosub (
  p_iddocumento numeric
)
RETURNS SETOF mod_logactivofijotangible.td_listarregistrosub AS
$body$
  DECLARE
  v_rec mod_logactivofijotangible.td_listarregistrosub;
    v_identificador varchar = '';
  v_sql1 varchar = '';
  BEGIN
    for v_rec in
    select
    na.denominacion as marca,
    drn.nroserie,
    no.denominacion as modelo,
    dmrna.annofabricacion,
    dmrnat.nromotor1,
    dmrnat.nromotor2,
    cg.urllogo as logo,
    ni.denominacion as aft,
    ncprim.denominacion as colorprim,
    ncsec.denominacion as colorsec,
    np.nombrepais,
    dmrna.valoradquisicion,
    dmrnat.nromatricula,
    dmrnat.nrocirculacion,
    dmrna.valorcontable,
    dmrna.nroinventario,

    dd.observaciones,

    drna.facturaoficio

    from mod_logistica.dat_documento dd
    inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento
    inner join mod_logactivofijotangible.dat_movregnumerico dmrn on dmrn.idmovimiento = dm.idmovimiento
    inner join mod_logactivofijotangible.dat_registronumerico drn on drn.idregnumerico = dmrn.idregnumerico
inner join mod_logactivofijotangible.dat_regnumericoactivo drna on drn.idregnumerico = drna.idregnumerico
    inner join mod_logactivofijotangible.dat_movregnumericoactivo dmrna on dmrna.idmovregnumerico = dmrn.idmovregnumerico
    left join mod_logactivofijotangible.dat_movregnumericoactivotransp dmrnat on dmrnat.idmovregnumerico = dmrn.idmovregnumerico
    inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto    
    inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
    inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
    left join mod_datosmaestros.nom_marca na on na.idmarca = nih.idmarca
    left join mod_datosmaestros.nom_modelo no on no.idmodelo = nih.idmodelo
    left join mod_logactivofijotangible.nom_color ncprim on ncprim.idcolor = dmrna.idcolorprim
    left join mod_logactivofijotangible.nom_color ncsec on ncsec.idcolor = dmrna.idcolorsec
    left join mod_datosmaestros.nom_pais np on np.idpais = ni.idpais  
    left join mod_logistica.conf_general cg on cg.idestructura = dp.idestructuracomun
    where dd.iddocumento = $1
    and dd.estado = 3
    
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

ALTER FUNCTION mod_logactivofijotangible.f_listarregistrosub (p_iddocumento numeric)
  OWNER TO zeolides;

ALTER TABLE mod_logactivofijotangible.dat_regnumericoactivo
  ADD COLUMN IF NOT EXISTS facturaoficio VARCHAR(255);

COMMENT ON COLUMN mod_logactivofijotangible.dat_regnumericoactivo.facturaoficio
IS 'Campo especifico de transgaviota';


ALTER TABLE mod_logactivofijotangible.dat_regnumericoactivo
  ADD COLUMN IF NOT EXISTS nrobajaturautos VARCHAR(255);

COMMENT ON COLUMN mod_logactivofijotangible.dat_regnumericoactivo.nrobajaturautos
IS 'Campo especifico de transgaviota';




CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_listarregistrosub (
  p_iddocumento numeric
)
RETURNS SETOF mod_logactivofijotangible.td_listarregistrosub AS
$body$
  DECLARE
  v_rec mod_logactivofijotangible.td_listarregistrosub;
    v_identificador varchar = '';
  v_sql1 varchar = '';
  BEGIN
    for v_rec in
    select
    COALESCE(na.denominacion, '') as marca,
    COALESCE(drn.nroserie,'') as nroserie,
    COALESCE(no.denominacion,'') as modelo,
    COALESCE(dmrna.annofabricacion,0) as annofabricacion,
    COALESCE(dmrnat.nromotor1,'') as nromotor1,
    COALESCE(dmrnat.nromotor2,'') as nromotor2,
    COALESCE(cg.urllogo,'') as logo,
    COALESCE(ni.denominacion,'') as aft,
    COALESCE(ncprim.denominacion,'') as colorprim,
    COALESCE(ncsec.denominacion,'') as colorsec,
    COALESCE(np.nombrepais,'') as nombrepais,
    COALESCE(dmrna.valoradquisicion,0) as valoradquisicion,
    COALESCE(dmrnat.nromatricula,'') as nromatricula,
    COALESCE(dmrnat.nrocirculacion,'') as nrocirculacion,
    COALESCE(dmrna.valorcontable,0) as valorcontable,
    COALESCE(dmrna.nroinventario,'') as nroinventario,

    COALESCE(dd.observaciones,'') as observaciones,

    COALESCE(drna.facturaoficio,'') as facturaoficio

    from mod_logistica.dat_documento dd
    inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd.iddocumento
    inner join mod_logactivofijotangible.dat_movregnumerico dmrn on dmrn.idmovimiento = dm.idmovimiento
    inner join mod_logactivofijotangible.dat_registronumerico drn on drn.idregnumerico = dmrn.idregnumerico
	inner join mod_logactivofijotangible.dat_regnumericoactivo drna on drn.idregnumerico = drna.idregnumerico
    inner join mod_logactivofijotangible.dat_movregnumericoactivo dmrna on dmrna.idmovregnumerico = dmrn.idmovregnumerico
    left join mod_logactivofijotangible.dat_movregnumericoactivotransp dmrnat on dmrnat.idmovregnumerico = dmrn.idmovregnumerico
    inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto    
    inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
    inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
    left join mod_datosmaestros.nom_marca na on na.idmarca = nih.idmarca
    left join mod_datosmaestros.nom_modelo no on no.idmodelo = nih.idmodelo
    left join mod_logactivofijotangible.nom_color ncprim on ncprim.idcolor = dmrna.idcolorprim
    left join mod_logactivofijotangible.nom_color ncsec on ncsec.idcolor = dmrna.idcolorsec
    left join mod_datosmaestros.nom_pais np on np.idpais = ni.idpais  
    left join mod_logistica.conf_general cg on cg.idestructura = dp.idestructuracomun
    where dd.iddocumento = $1
    and dd.estado = 3
    
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