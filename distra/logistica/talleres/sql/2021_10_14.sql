CREATE OR REPLACE FUNCTION mod_logtaller.f_modelosubtrabajo (
  idregistro numeric
)
RETURNS SETOF mod_logtaller.td_modelosubtrabajo AS
$body$
	DECLARE
	v_rec mod_logtaller.td_modelosubtrabajo;
	BEGIN
		for v_rec in 
        SELECT (COALESCE(ind.numeropieza,ind.codigo)||' '||ind.denominacion) as trabajorealizar,
        (select count(*) from mod_logtaller.dat_material dm where dm.idactividad = doa.idactividad and dm.porplan = 1 and dm.idordentrabajo = dot.idordentrabajo) as cantmedporplan,
        (select count(*) from mod_logtaller.dat_material dm where dm.idactividad = doa.idactividad and dm.idordentrabajo = dot.idordentrabajo) as cantreal,
        doa.tiemporeal,doa.observacion,i.urllogo as logo,concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel) as responsable,
        doa.costo as importecup,doa.importealternativo as importecuc,doa.precio, doa.precioalternativo
        FROM mod_logistica.dat_documento dd
        inner join mod_logtaller.dat_ordentrabajo dot on dot.idordentrabajo = dd.iddocumento
        --inner join mod_logtaller.dat_trabajoservicio dts on dts.idordentrabajo = dot.idordentrabajo
        --inner join mod_logtaller.conf_actividad na on na.idactividad = dts.idservicio
        inner join mod_logtaller.dat_ordenactividad doa on doa.idordentrabajo = dot.idordentrabajo
        --left join mod_logtaller.conf_actividad _na on _na.idactividad = doa.idactividad
        inner join mod_datosmaestros.nom_indicador ind on ind.idindicador = doa.idindicador
        inner join mod_logistica.dat_documentocliente dc on dc.iddocumento = dd.iddocumento and dc.tipocliente = 1
        left join mod_datosmaestros.nom_clientesproveedor ncp on dc.idcliente = ncp.idclientesproveedores 
        left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura
        left join mod_persona.dat_persona dp on dp.idpersona = doa.idresponsable
        inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
        inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
        inner join mod_datosmaestros.dat_estructurasubsist desu on desu.idestructurasubsist = ddp.idestructurasubsist
        inner join mod_estructuracomp.v_dametodasestructuras des on des.idestructura = desu.idestructuracomun
        inner join mod_logistica.conf_general i on i.idestructura = des.idestructura
      	where (dd.iddocumento = $1 OR $1 IS NULL)
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

ALTER FUNCTION mod_logtaller.f_modelosubtrabajo (idregistro numeric)
  OWNER TO zeolides;