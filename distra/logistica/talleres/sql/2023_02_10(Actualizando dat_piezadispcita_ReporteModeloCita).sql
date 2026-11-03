ALTER TABLE mod_logtaller.dat_piezadispcita
  ALTER COLUMN disponible DROP DEFAULT;

ALTER TABLE mod_logtaller.dat_piezadispcita
  ALTER COLUMN disponible TYPE NUMERIC(25,6);




ALTER TYPE mod_logtaller.td_modelosubtrabajocita
  ADD ATTRIBUTE codigo VARCHAR;


CREATE OR REPLACE FUNCTION mod_logtaller.f_modelosubtrabajocita (
  p_idcita numeric
)
RETURNS SETOF mod_logtaller.td_modelosubtrabajocita AS
$body$
	DECLARE
	v_rec mod_logtaller.td_modelosubtrabajocita;
	BEGIN
		for v_rec in 
        SELECT ind.denominacion as trabajorealizar,
        (select count(*) from mod_logtaller.dat_actividadcita dm where dm.idcita = dot.idcita) as cantreal,
        dot.duracion,dp.observacion,i.urllogo as logo,concat(dp.nombreresponsable) as responsable,
        dot.importe as importecup,dot.importealternativo as importecuc,dot.precioventa, dot.precioventaalternativo,
        COALESCE(ind.numeropieza,(CASE WHEN (ind.numeropieza IS NULL OR ind.numeropieza = '') THEN ind.codigo ELSE ind.numeropieza END)) as codigo
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