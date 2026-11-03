-- Created By : ScriptSplitGenerador
-- Only Schema
SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
CREATE SCHEMA mod_crmadministracion;
CREATE SCHEMA mod_crmclienteproveedor;
CREATE SCHEMA mod_crmcontratacion;
SET search_path = mod_crmcontratacion, pg_catalog;
CREATE TYPE td_actaaceptacion AS (
	numerocontrato character varying,
	nombrecontrato character varying,
	clienteproveedor character varying,
	numerohito character varying,
	nombrehito character varying
);
CREATE TYPE td_actacomite AS (
	numero character varying,
	nombre character varying,
	area character varying,
	autor character varying,
	miembro character varying,
	responsable character varying,
	estado character varying,
	clasificacion character varying,
	fecha date,
	texto character varying,
	fechaestado date
);
CREATE TYPE td_cantcliente AS (
	cliente character varying,
	cantidad numeric
);
CREATE TYPE td_cantestado AS (
	estado character varying,
	cantidad numeric
);
CREATE TYPE td_cantfecha AS (
	fecha date,
	cantidad numeric
);
CREATE TYPE td_canttipocontrato AS (
	contrato character varying,
	cantidad numeric
);
CREATE TYPE td_comite AS (
	numerocontrato character varying,
	nombre character varying,
	descripcion character varying,
	clienteproveedor character varying,
	area character varying,
	dias character varying,
	fechaestado date,
	estado character varying
);
CREATE TYPE td_contactofacultad AS (
	nombre character varying,
	codigo character varying,
	nombrecontacto character varying,
	tipofacultad character varying,
	facultad character varying
);
CREATE TYPE td_contrato AS (
	numero character varying,
	numerocontrato character varying,
	nombre character varying,
	fechafirma date,
	montototal numeric,
	tipocontrato character varying,
	clienteproveedor character varying,
	cliente numeric,
	fechainicio date,
	fechafin date,
	estado character varying,
	cup numeric,
	cuc numeric,
	nombrepersona character varying
);
CREATE TYPE td_dictamen AS (
	usuario character varying(90),
	persona character varying(90),
	rol character varying(90),
	observacion text,
	fecha date,
	numerocontrato character varying(90),
	nombreestado character varying(90),
	nombreclienteproveedor text
);
CREATE TYPE td_fechascontratos AS (
	contrato character varying,
	cantidad numeric
);
CREATE TYPE td_oferta AS (
	numero character varying,
	nombreempresa character varying,
	nombreueb character varying,
	fecha date,
	codigoclienteproveedor character varying,
	clienteproveedor character varying,
	referencia character varying,
	descripcion character varying,
	cantidad numeric,
	preciocuc numeric,
	preciocup numeric,
	importecuc numeric,
	importecup numeric,
	diasvigencia numeric,
	cuentamn character varying,
	cuentacuc character varying,
	titular character varying,
	persona character varying
);
CREATE TYPE td_solicitudpago AS (
	codigo character varying,
	fecha date,
	descripcion character varying,
	objetivo character varying,
	numerocontrato character varying,
	numerocuentamn character varying,
	numerocuentacuc character varying,
	cheque character varying,
	transferenciabancaria character varying,
	transferenciainterna character varying,
	otros character varying,
	operaciones character varying,
	inversiones character varying,
	pagoanticipado character varying,
	pagoposterior character varying,
	numerofactura character varying,
	montomn numeric,
	montocuc numeric,
	total numeric,
	entidad character varying,
	tipopago character varying,
	instrumentopago character varying,
	proveedor character varying
);
SET search_path = mod_crmadministracion, pg_catalog;
CREATE FUNCTION ft_reporte_insertar() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
	rec mod_crmadministracion.dat_reporte;
BEGIN
    SET search_path =  mod_crmadministracion;
    IF (NEW.idpadre IS NULL)
    	THEN NEW.idpadre:= NEW.idreporte;
    END IF;
RETURN NEW;
END;
$$;
SET search_path = mod_crmcontratacion, pg_catalog;
CREATE FUNCTION f_get_actacomite(_fechainicio date, _fechafin date, _proceso character varying) RETURNS SETOF td_actacomite
    LANGUAGE plpgsql
    AS $$
DECLARE 
    valores record;
    datos mod_crmcontratacion.td_actacomite;
BEGIN
	IF _fechainicio IS NULL THEN _fechainicio=date_trunc('month',current_date); END IF;
	IF _fechafin IS NULL THEN _fechafin=date_trunc('month',current_date) +'1month' ::interval -'1sec' ::interval; END IF;
	IF _proceso IS NULL THEN _proceso='mdContrato'; END IF;
    
	IF _proceso='mdContrato' OR _proceso='mdcontratoproveedor' THEN    
        FOR valores IN (SELECT DISTINCT c.numerocontrato, c.nombre, 
        d.observacion, e.nombre as nombreestado,
        (p.nombre||' '||p.papel||' '||p.sapel) as persona,
        COALESCE (desop.denominacion, des.denominacion) as area, d.fecha as fechaestado
        FROM mod_crmcontratacion.dat_dictamen d 
        LEFT JOIN mod_crmcontratacion.dat_contrato c ON(c.idcontrato=d.idcontrato) 
        LEFT JOIN mod_crmcontratacion.nom_estado e ON(e.idestado=d.idestado) 
        LEFT JOIN mod_estructuracomp.dat_estructura des ON (c.idarea = des.idestructura and des.idproyecto = 0)
        LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (c.idarea = desop.idestructuraop and desop.idproyecto = 0)
        LEFT JOIN mod_seguridad._seg_usuario u ON (d.idusuario=u.idusuario)
        LEFT JOIN mod_persona.dat_persona p ON (p.idpersona=u.idpersona)
        WHERE d.fecha BETWEEN _fechainicio AND _fechafin AND c.cliente=(CASE WHEN _proceso='mdContrato' THEN 1 ELSE 0 END)
        ORDER BY fechaestado)
        LOOP
              datos.numero=valores.numerocontrato;
              datos.nombre=valores.nombre;
              datos.area=valores.area;
              datos.fechaestado=valores.fechaestado;
              RETURN NEXT datos;
        END LOOP;
    ELSIF _proceso='solicitudpago' THEN    
        FOR valores IN (SELECT DISTINCT c.codigo as numerocontrato, c.descripcion as nombre, c.descripcion, 
        con.denominacionclienteproveedor as clienteproveedor, 
        (p.nombre||' '||p.papel||' '||p.sapel) as persona,
        COALESCE (desop.denominacion, des.denominacion) as area, d.fecha as fechaestado
        FROM mod_crmcontratacion.dat_solicitudpagodictamen d 
        LEFT JOIN mod_crmcontratacion.dat_solicitudpago c ON(c.idsolicitudpago=d.idsolicitudpago) 
        LEFT JOIN mod_crmcontratacion.nom_estado e ON(e.idestado=d.idestado) 
        LEFT JOIN mod_estructuracomp.dat_estructura des ON (c.idarea = des.idestructura and des.idproyecto = 0)
        LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (c.idarea = desop.idestructuraop and desop.idproyecto = 0)
        LEFT JOIN mod_crmcontratacion.dat_contrato con ON(con.idcontrato=c.idcontrato) 
        LEFT JOIN mod_seguridad._seg_usuario u ON (d.idusuario=u.idusuario)
        LEFT JOIN mod_persona.dat_persona p ON (p.idpersona=u.idpersona)
        WHERE d.fecha BETWEEN _fechainicio AND _fechafin)
        LOOP
            datos.numero=valores.numerocontrato;
            datos.nombre=valores.nombre;
            datos.area=valores.area;
            datos.fechaestado=valores.fechaestado;
            RETURN NEXT datos;
        END LOOP;
    ELSIF _proceso='solicitudnegocio' THEN    
        FOR valores IN (SELECT DISTINCT c.idsolicitud as numerocontrato, c.nombre, c.descripcion,  
        (p.nombre||' '||p.papel||' '||p.sapel) as persona,
        COALESCE (cp.nombre,per.nombre||' '||per.papel||' '||per.sapel,estru.denominacion,estruop.denominacion) as clienteproveedor,
        COALESCE (desop.denominacion, des.denominacion) as area, d.fecha as fechaestado
        FROM mod_crmcontratacion.dat_solicituddictamen d 
        LEFT JOIN mod_crmcontratacion.dat_solicitudnegocio c ON(c.idsolicitud=d.idsolicitud) 
        LEFT JOIN mod_estructuracomp.dat_estructura des ON (c.idarearesponsable = des.idestructura and des.idproyecto = 0)
        LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (c.idarearesponsable = desop.idestructuraop and desop.idproyecto = 0)
        LEFT JOIN mod_datosmaestros.nom_clientesproveedor cp ON(c.idclienteproveedor=cp.idclientesproveedores) 
        LEFT JOIN mod_estructuracomp.dat_estructura estru ON (cp.idestructura = estru.idestructura and estru.idproyecto=0)
        LEFT JOIN mod_estructuracomp.dat_estructuraop estruop ON (cp.idestructura = estruop.idestructuraop and estruop.idproyecto=0)
        LEFT JOIN mod_persona.dat_persona per ON (cp.idpersona = per.idpersona)
        LEFT JOIN mod_seguridad._seg_usuario u ON (d.idusuario=u.idusuario)
        LEFT JOIN mod_persona.dat_persona p ON (p.idpersona=u.idpersona)
        WHERE d.fecha BETWEEN _fechainicio AND _fechafin)
        LOOP
            datos.numero=valores.numerocontrato;
            datos.nombre=valores.nombre;
            datos.area=valores.area;
            datos.fechaestado=valores.fechaestado;
            RETURN NEXT datos;
        END LOOP;
    ELSIF _proceso='ofertanegocio' THEN    
        FOR valores IN (SELECT DISTINCT c.numero as numerocontrato, c.nombre, c.descripcion,
        (p.nombre||' '||p.papel||' '||p.sapel) as persona,
        COALESCE (cp.nombre,per.nombre||' '||per.papel||' '||per.sapel,estru.denominacion,estruop.denominacion) as clienteproveedor,
        COALESCE (desop.denominacion, des.denominacion) as area, d.fecha as fechaestado
        FROM mod_crmcontratacion.dat_ofertadictamen d 
        LEFT JOIN mod_crmcontratacion.dat_ofertanegocio c ON(c.idoferta=d.idoferta) 
        LEFT JOIN mod_crmcontratacion.nom_estado e ON(e.idestado=d.idestado) 
        LEFT JOIN mod_estructuracomp.dat_estructura des ON (c.idarea = des.idestructura and des.idproyecto = 0)
        LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (c.idarea = desop.idestructuraop and desop.idproyecto = 0)
        LEFT JOIN mod_datosmaestros.nom_clientesproveedor cp ON(c.idclienteproveedor=cp.idclientesproveedores) 
        LEFT JOIN mod_estructuracomp.dat_estructura estru ON (cp.idestructura = estru.idestructura and estru.idproyecto=0)
        LEFT JOIN mod_estructuracomp.dat_estructuraop estruop ON (cp.idestructura = estruop.idestructuraop and estruop.idproyecto=0)
        LEFT JOIN mod_persona.dat_persona per ON (cp.idpersona = per.idpersona)
        LEFT JOIN mod_seguridad._seg_usuario u ON (d.idusuario=u.idusuario)
        LEFT JOIN mod_persona.dat_persona p ON (p.idpersona=u.idpersona)
        WHERE d.fecha BETWEEN _fechainicio AND _fechafin)
        LOOP
            datos.numero=valores.numerocontrato;
            datos.nombre=valores.nombre;
            datos.area=valores.area;
            datos.fechaestado=valores.fechaestado;
            RETURN NEXT datos;
        END LOOP;
    END IF;
	--RETURN datos;
END
$$;
CREATE FUNCTION f_get_comites(_fechainicio date, _fechafin date, _proceso character varying) RETURNS SETOF td_comite
    LANGUAGE plpgsql
    AS $$
DECLARE 
    valores record;
    datos mod_crmcontratacion.td_comite;
BEGIN
	IF _fechainicio IS NULL THEN _fechainicio=date_trunc('month',current_date); END IF;
	IF _fechafin IS NULL THEN _fechafin=date_trunc('month',current_date) +'1month' ::interval -'1sec' ::interval; END IF;
	IF _proceso IS NULL THEN _proceso='mdContrato'; END IF;
	IF _proceso='mdContrato' OR _proceso='mdcontratoproveedor' THEN    
        FOR valores IN (SELECT DISTINCT c.numerocontrato, c.nombre, 
        c.descripcion, c.denominacionclienteproveedor as clienteproveedor, e.nombre as estado,
        COALESCE (desop.denominacion, des.denominacion) as area, d.fecha as fechaestado
        FROM mod_crmcontratacion.dat_dictamen d 
        LEFT JOIN mod_crmcontratacion.dat_contrato c ON(c.idcontrato=d.idcontrato) 
        LEFT JOIN mod_crmcontratacion.nom_estado e ON(e.idestado=d.idestado) 
        LEFT JOIN mod_estructuracomp.dat_estructura des ON (c.idarea = des.idestructura and des.idproyecto = 0)
        LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (c.idarea = desop.idestructuraop and desop.idproyecto = 0)
        WHERE d.fecha BETWEEN _fechainicio AND _fechafin AND c.cliente=(CASE WHEN _proceso='mdContrato' THEN 1 ELSE 0 END)
        ORDER BY fechaestado)
        LOOP
              datos.numerocontrato=valores.numerocontrato;
              datos.nombre=valores.nombre;
              datos.descripcion=valores.descripcion;            
              datos.clienteproveedor=valores.clienteproveedor;
              datos.area=valores.area;
              datos.fechaestado=valores.fechaestado;
              datos.estado=valores.estado;
              RETURN NEXT datos;
        END LOOP;
    ELSIF _proceso='solicitudpago' THEN    
        FOR valores IN (SELECT DISTINCT c.codigo as numerocontrato, c.descripcion as nombre, c.descripcion, 
        con.denominacionclienteproveedor as clienteproveedor, e.nombre as estado,
        COALESCE (desop.denominacion, des.denominacion) as area, d.fecha as fechaestado
        FROM mod_crmcontratacion.dat_solicitudpagodictamen d 
        LEFT JOIN mod_crmcontratacion.dat_solicitudpago c ON(c.idsolicitudpago=d.idsolicitudpago) 
        LEFT JOIN mod_crmcontratacion.nom_estado e ON(e.idestado=d.idestado) 
        LEFT JOIN mod_estructuracomp.dat_estructura des ON (c.idarea = des.idestructura and des.idproyecto = 0)
        LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (c.idarea = desop.idestructuraop and desop.idproyecto = 0)
        LEFT JOIN mod_crmcontratacion.dat_contrato con ON(con.idcontrato=c.idcontrato) 
        WHERE d.fecha BETWEEN _fechainicio AND _fechafin)
        LOOP
            datos.numerocontrato=valores.numerocontrato;
            datos.nombre=valores.nombre;
            datos.descripcion=valores.descripcion;            
            datos.clienteproveedor=valores.clienteproveedor;
            datos.area=valores.area;
            datos.fechaestado=valores.fechaestado;
            datos.estado=valores.estado;
            RETURN NEXT datos;
        END LOOP;
    ELSIF _proceso='solicitudnegocio' THEN    
        FOR valores IN (SELECT DISTINCT c.idsolicitud as numerocontrato, c.nombre, c.descripcion,  e.nombre as estado,
        COALESCE (cp.nombre,per.nombre||' '||per.papel||' '||per.sapel,estru.denominacion,estruop.denominacion) as clienteproveedor,
        COALESCE (desop.denominacion, des.denominacion) as area, d.fecha as fechaestado
        FROM mod_crmcontratacion.dat_solicituddictamen d 
        LEFT JOIN mod_crmcontratacion.dat_solicitudnegocio c ON(c.idsolicitud=d.idsolicitud) 
        LEFT JOIN mod_crmcontratacion.nom_estado e ON(e.idestado=d.idestado)
        LEFT JOIN mod_estructuracomp.dat_estructura des ON (c.idarearesponsable = des.idestructura and des.idproyecto = 0)
        LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (c.idarearesponsable = desop.idestructuraop and desop.idproyecto = 0)
        LEFT JOIN mod_datosmaestros.nom_clientesproveedor cp ON(c.idclienteproveedor=cp.idclientesproveedores) 
        LEFT JOIN mod_estructuracomp.dat_estructura estru ON (cp.idestructura = estru.idestructura and estru.idproyecto=0)
        LEFT JOIN mod_estructuracomp.dat_estructuraop estruop ON (cp.idestructura = estruop.idestructuraop and estruop.idproyecto=0)
        LEFT JOIN mod_persona.dat_persona per ON (cp.idpersona = per.idpersona)
        WHERE d.fecha BETWEEN _fechainicio AND _fechafin)
        LOOP
            datos.numerocontrato=valores.numerocontrato;
            datos.nombre=valores.nombre;
            datos.descripcion=valores.descripcion;            
            datos.clienteproveedor=valores.clienteproveedor;
            datos.area=valores.area;
            datos.fechaestado=valores.fechaestado;
            datos.estado=valores.estado;
            RETURN NEXT datos;
        END LOOP;
    ELSIF _proceso='ofertanegocio' THEN    
        FOR valores IN (SELECT DISTINCT c.numero as numerocontrato, c.nombre, c.descripcion, e.nombre as estado,
        COALESCE (cp.nombre,per.nombre||' '||per.papel||' '||per.sapel,estru.denominacion,estruop.denominacion) as clienteproveedor,
        COALESCE (desop.denominacion, des.denominacion) as area, d.fecha as fechaestado
        FROM mod_crmcontratacion.dat_ofertadictamen d 
        LEFT JOIN mod_crmcontratacion.dat_ofertanegocio c ON(c.idoferta=d.idoferta) 
        LEFT JOIN mod_crmcontratacion.nom_estado e ON(e.idestado=d.idestado) 
        LEFT JOIN mod_estructuracomp.dat_estructura des ON (c.idarea = des.idestructura and des.idproyecto = 0)
        LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (c.idarea = desop.idestructuraop and desop.idproyecto = 0)
        LEFT JOIN mod_datosmaestros.nom_clientesproveedor cp ON(c.idclienteproveedor=cp.idclientesproveedores) 
        LEFT JOIN mod_estructuracomp.dat_estructura estru ON (cp.idestructura = estru.idestructura and estru.idproyecto=0)
        LEFT JOIN mod_estructuracomp.dat_estructuraop estruop ON (cp.idestructura = estruop.idestructuraop and estruop.idproyecto=0)
        LEFT JOIN mod_persona.dat_persona per ON (cp.idpersona = per.idpersona)
        WHERE d.fecha BETWEEN _fechainicio AND _fechafin)
        LOOP
            datos.numerocontrato=valores.numerocontrato;
            datos.nombre=valores.nombre;
            datos.descripcion=valores.descripcion;            
            datos.clienteproveedor=valores.clienteproveedor;
            datos.area=valores.area;
            datos.fechaestado=valores.fechaestado;
            datos.estado=valores.estado;
            RETURN NEXT datos;
        END LOOP;
    END IF;
	--RETURN datos;
END
$$;
CREATE FUNCTION f_get_contratos(_dominio numeric, _numero character varying, _nombre character varying, _clienteproveedor character varying, _vigente numeric, _marco numeric, _cliente numeric) RETURNS SETOF td_contrato
    LANGUAGE plpgsql
    AS $$
DECLARE
    valores record;
    datos mod_crmcontratacion.td_contrato;
BEGIN
    FOR valores IN (
        SELECT c.numero,c.numerocontrato,c.nombre,to_char(c.fechafirma,'DD/MM/YYYY') as fechafirma,c.fechainicio,
        to_char(c.fechafin,'DD/MM/YYYY') as fechafin,c.denominaciontipocontrato AS tipocontrato,
        c.denominacionclienteproveedor AS clienteproveedor,ne.nombre as estado,
                    mc1.valor as cup, mc2.valor as cuc,
                   -- dmc.cuc,dmc.cup,
                    c.montototal,
        (select pe.img from mod_crmadministracion.dat_plantillaestructura pe where pe.idestructura=64) as icono
        --decode(regexp_replace(i.icono, 'data:image/png;base64,', ''), 'BASE64') as icono
        FROM mod_crmcontratacion.dat_contrato c
        INNER JOIN mod_crmcontratacion.nom_estado ne ON ne.idestado = c.idestado
        LEFT JOIN mod_crmcontratacion.nom_mediodepago nmp ON nmp.idmediodepago = c.idmediopago
        LEFT JOIN mod_crmcontratacion.nom_sector ns ON ns.idsector = c.idsector
        LEFT JOIN mod_persona.dat_persona per ON (c.idresponsable = per.idpersona)
        LEFT JOIN mod_datosmaestros.nom_terminosdepago ntp ON c.idcondicionpago = ntp.idterminodepago
        LEFT JOIN mod_crmcontratacion.dat_proforma dpr ON c.idproforma = dpr.idproforma
        LEFT JOIN mod_estructuracomp.dat_estructura des ON (c.idarea = des.idestructura and des.idproyecto = 0)
        LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (c.idarea = desop.idestructuraop and desop.idproyecto = 0)
        LEFT JOIN mod_estructuracomp.nom_icono i ON (i.idicono='110')--(i.idicono=des.idicono)
        LEFT JOIN mod_crmcontratacion.dat_ofertanegocio ofn ON (c.idcontrato = ofn.idcontrato)
        INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON (c.idarea = nfe.idfila)
                    
        LEFT JOIN mod_crmcontratacion.dat_monedacontrato mc1 ON 
                    (c.idcontrato=mc1.idcontrato
                    AND mc1.idmoneda=(SELECT nm1.idmoneda FROM mod_datosmaestros.nom_moneda nm1 WHERE nm1.codigoiso='CUP') )
        LEFT JOIN mod_crmcontratacion.dat_monedacontrato mc2 ON 
                    (c.idcontrato=mc2.idcontrato
                    AND mc2.idmoneda=(SELECT nm2.idmoneda FROM mod_datosmaestros.nom_moneda nm2 WHERE nm2.codigoiso='CUC') )
                            
        WHERE  (CASE WHEN _dominio NOTNULL THEN ( dominiofila[_dominio] = 1::bit ) ELSE ( dominiofila[1] = 1::bit ) END)
        AND ((c.idcontrato = c.idpadre AND (SELECT count(dc.idpadre) FROM mod_crmcontratacion.dat_contrato dc WHERE c.idcontrato = dc.idpadre) = 1)
              OR (c.idcontrato != c.idpadre AND (SELECT count(dc.idpadre) FROM mod_crmcontratacion.dat_contrato dc WHERE c.idcontrato = dc.idpadre) = 0))
    	AND (CASE WHEN _nombre NOTNULL THEN (c.nombre ILIKE '%'||_nombre||'%') ELSE TRUE END) 
        AND (CASE WHEN _numero NOTNULL THEN (c.numero ILIKE '%'||_numero||'%') ELSE TRUE END) 
        AND (CASE WHEN _clienteproveedor NOTNULL THEN (c.denominacionclienteproveedor ILIKE '%'||_clienteproveedor||'%') ELSE TRUE END) 
        AND (CASE WHEN _marco NOTNULL THEN (c.contratomarco = _marco) ELSE TRUE END)
        AND (CASE WHEN _cliente NOTNULL THEN (c.cliente = _cliente) ELSE TRUE END)
        AND (CASE WHEN _vigente NOTNULL THEN (CASE WHEN _vigente = 1 THEN 
                                              (c.fechafirma <= current_date AND (c.fechafin>=current_date OR c.fechafin ISNULL)) 
                                              ELSE (c.fechafirma > current_date OR c.fechafin<current_date OR c.fechafin ISNULL) END)
             ELSE TRUE END)
        ORDER BY c.idpadre,numero ASC,  nombre ASC)
    LOOP
        datos.numero=valores.numero;
        datos.numerocontrato=valores.numerocontrato;
        datos.nombre=valores.nombre;
        datos.fechafirma=valores.fechafirma;
        datos.fechafin=valores.fechafin;
        datos.clienteproveedor=valores.clienteproveedor;
        datos.fechainicio=valores.fechainicio;
        datos.tipocontrato=valores.tipocontrato;
        datos.montototal=valores.montototal;
        datos.estado=valores.estado;
        datos.cup=valores.cup;
        datos.cuc=valores.cuc;
        datos.nombrepersona=valores.icono;
        RETURN NEXT datos;
    END LOOP;
    --RETURN datos;
END
$$;
CREATE FUNCTION f_get_contratosimprimir(_idcontratos character varying) RETURNS SETOF td_contrato
    LANGUAGE plpgsql
    AS $$
DECLARE
    valores record;
    datos mod_crmcontratacion.td_contrato;
BEGIN
	
    FOR valores IN (SELECT c.numero,c.numerocontrato,c.nombre,c.fechafirma,c.fechainicio,c.fechafin,c.denominaciontipocontrato AS tipocontrato,
        c.denominacionclienteproveedor AS clienteproveedor,ne.nombre as estado,mc1.valor as cup, mc2.valor as cuc,c.montototal,
    	(CASE WHEN c.idresponsable NOTNULL THEN per.nombre||' '||per.papel||' '||per.sapel else '' END) as nombrepersona
        FROM mod_crmcontratacion.dat_contrato c
        INNER JOIN mod_crmcontratacion.nom_estado ne ON ne.idestado = c.idestado
        LEFT JOIN mod_crmcontratacion.nom_mediodepago nmp ON nmp.idmediodepago = c.idmediopago
        LEFT JOIN mod_crmcontratacion.nom_sector ns ON ns.idsector = c.idsector
        LEFT JOIN mod_persona.dat_persona per ON (c.idresponsable = per.idpersona)
        LEFT JOIN mod_datosmaestros.nom_terminosdepago ntp ON c.idcondicionpago = ntp.idterminodepago
        LEFT JOIN mod_crmcontratacion.dat_proforma dpr ON c.idproforma = dpr.idproforma
        LEFT JOIN mod_estructuracomp.dat_estructura des ON (c.idarea = des.idestructura and des.idproyecto = 0)
        LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (c.idarea = desop.idestructuraop and desop.idproyecto = 0)
        LEFT JOIN mod_crmcontratacion.dat_ofertanegocio ofn ON (c.idcontrato = ofn.idcontrato)
        INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON (c.idarea = nfe.idfila)
        --LEFT JOIN crosstab('SELECT dmc.idcontrato,dmc.idmoneda,dmc.valor FROM mod_crmcontratacion.dat_monedacontrato dmc ORDER BY 1,2',
        --'SELECT DISTINCT nm.idmoneda FROM mod_datosmaestros.dat_monedaentidad dme INNER JOIN mod_datosmaestros.nom_moneda nm ON
        --nm.idmoneda = dme.idmoneda INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON nfe.idfila = dme.idestructuracomun
        --INNER JOIN mod_crmcontratacion.dat_contrato dc ON dc.idestructuracomun = dme.idestructuracomun
        --WHERE nfe.dominiofila[1] = 1::bit ORDER BY nm.idmoneda') AS dmc ("idcontrato" NUMERIC,"cuc" NUMERIC,"cup" NUMERIC) ON c.idcontrato = dmc.idcontrato
        
        LEFT JOIN mod_crmcontratacion.dat_monedacontrato mc1 ON 
                    (c.idcontrato=mc1.idcontrato
                    AND mc1.idmoneda=(SELECT nm1.idmoneda FROM mod_datosmaestros.nom_moneda nm1 WHERE nm1.codigoiso='CUP') )
        LEFT JOIN mod_crmcontratacion.dat_monedacontrato mc2 ON 
                    (c.idcontrato=mc2.idcontrato
                    AND mc2.idmoneda=(SELECT nm2.idmoneda FROM mod_datosmaestros.nom_moneda nm2 WHERE nm2.codigoiso='CUC') )
        
        WHERE  ( dominiofila[1] = 1::bit )
        AND (c.idcontrato = ANY  (string_to_array(_idcontratos, ',')::BIGINT[]))
        ORDER BY c.idpadre,numero ASC, fechafirma DESC, nombre ASC)
    LOOP
        datos.numero=valores.numero;
        datos.numerocontrato=valores.numerocontrato;
        datos.nombre=valores.nombre;
        datos.fechafirma=valores.fechafirma;
        datos.clienteproveedor=valores.clienteproveedor;
        datos.fechainicio=valores.fechainicio;
        datos.fechafin=valores.fechafin;
        datos.tipocontrato=valores.tipocontrato;
        datos.montototal=valores.montototal;
        datos.estado=valores.estado;
        datos.cup=valores.cup;
        datos.cuc=valores.cuc;
        datos.nombrepersona=valores.nombrepersona;
        RETURN NEXT datos;
    END LOOP;
    --RETURN datos;
END
$$;
CREATE FUNCTION f_get_datosactaaceptacion(_idcontrato numeric) RETURNS SETOF td_actaaceptacion
    LANGUAGE plpgsql
    AS $$
DECLARE 
    valores record;
    datos mod_crmcontratacion.td_actaaceptacion;
BEGIN
	FOR valores IN (SELECT c.nombre, c.numero, c.denominacionclienteproveedor, h.numero as numerohito, h.descripcion
    FROM mod_crmcontratacion.dat_contrato c 
    LEFT JOIN mod_crmcontratacion.dat_hito h on (c.idcontrato=h.idcontrato)
    WHERE c.idcontrato=_idcontrato ORDER BY h.numero)
    LOOP
        datos.numerocontrato=valores.numero;
        datos.nombrecontrato=valores.nombre;
        datos.clienteproveedor=valores.denominacionclienteproveedor;
        datos.numerohito=valores.numerohito;
        datos.nombrehito=valores.descripcion;
        RETURN NEXT datos;
	END LOOP;
	--RETURN datos;
END
$$;
CREATE FUNCTION f_get_datosactaaceptacion(_idcontrato numeric, _idhitos character varying) RETURNS SETOF td_actaaceptacion
    LANGUAGE plpgsql
    AS $$
DECLARE 
    valores record;
    datos mod_crmcontratacion.td_actaaceptacion;
BEGIN
	FOR valores IN (SELECT c.nombre, c.numero, c.denominacionclienteproveedor, h.numero as numerohito, h.descripcion
    FROM mod_crmcontratacion.dat_contrato c 
    LEFT JOIN mod_crmcontratacion.dat_hito h on (c.idcontrato=h.idcontrato)
    WHERE c.idcontrato=_idcontrato AND (h.idhito = ANY  (string_to_array(_idhitos, ',')::integer[])) ORDER BY h.numero)
    LOOP
        datos.numerocontrato=valores.numero;
        datos.nombrecontrato=valores.nombre;
        datos.clienteproveedor=valores.denominacionclienteproveedor;
        datos.numerohito=valores.numerohito;
        datos.nombrehito=valores.descripcion;
        RETURN NEXT datos;
	END LOOP;
	--RETURN datos;
END
$$;
CREATE FUNCTION f_get_dictamenes(_idcontrato numeric) RETURNS SETOF td_dictamen
    LANGUAGE plpgsql
    AS $$DECLARE 
    valores record;
    datos mod_crmcontratacion.td_dictamen;
BEGIN
	FOR valores IN (SELECT u.nombreusuario, 
    (CASE WHEN u.idpersona NOTNULL THEN p.nombre||' '||p.papel||' '||p.sapel else '' END) as nombrepersona,
    r.denominacion, d.observacion, d.fecha, c.numero, e.nombre as nombreestado, c.denominacionclienteproveedor
    FROM mod_crmcontratacion.dat_dictamen d 
    LEFT JOIN mod_seguridad.seg_usuario u ON(u.idusuario=d.idusuario) 
    LEFT JOIN mod_persona.dat_persona p ON(p.idpersona=u.idpersona) 
    LEFT JOIN mod_seguridad.seg_rol r ON(r.idrol=d.idrol) 
    LEFT JOIN mod_crmcontratacion.dat_contrato c ON(c.idcontrato=d.idcontrato) 
  	LEFT JOIN mod_crmcontratacion.nom_estado e ON(e.idestado=d.idestado) 
    WHERE d.idcontrato=_idcontrato)
    LOOP
        datos.usuario=valores.nombreusuario;
        datos.persona=valores.nombrepersona;
        datos.rol=valores.denominacion;
        datos.fecha=valores.fecha;
        datos.numerocontrato=valores.numero;
        datos.nombreestado=valores.nombreestado;
        datos.nombreclienteproveedor=valores.denominacionclienteproveedor;
        datos.observacion=valores.observacion;
        RETURN NEXT datos;
	END LOOP;
	--RETURN datos;
END
$$;
CREATE FUNCTION f_get_dictamenes(_idcontrato numeric, _proceso character varying) RETURNS SETOF td_dictamen
    LANGUAGE plpgsql
    AS $$
DECLARE 
    valores record;
    datos mod_crmcontratacion.td_dictamen;
BEGIN
	IF _proceso='contrato' THEN    
        FOR valores IN (SELECT u.nombreusuario, 
        (CASE WHEN u.idpersona NOTNULL THEN p.nombre||' '||p.papel||' '||p.sapel else '' END) as nombrepersona,
        r.denominacion, d.observacion, d.fecha, c.numero, e.nombre as nombreestado, c.denominacionclienteproveedor
        FROM mod_crmcontratacion.dat_dictamen d 
        LEFT JOIN mod_seguridad.seg_usuario u ON(u.idusuario=d.idusuario) 
        LEFT JOIN mod_persona.dat_persona p ON(p.idpersona=u.idpersona) 
        LEFT JOIN mod_seguridad.seg_rol r ON(r.idrol=d.idrol) 
        LEFT JOIN mod_crmcontratacion.dat_contrato c ON(c.idcontrato=d.idcontrato) 
        LEFT JOIN mod_crmcontratacion.nom_estado e ON(e.idestado=d.idestado) 
        WHERE d.idcontrato=_idcontrato)
        LOOP
            datos.usuario=valores.nombreusuario;
            datos.persona=valores.nombrepersona;
            datos.rol=valores.denominacion;
            datos.fecha=valores.fecha;
            datos.numerocontrato=valores.numero;
            datos.nombreestado=valores.nombreestado;
            datos.nombreclienteproveedor=valores.denominacionclienteproveedor;
            datos.observacion=valores.observacion;
            RETURN NEXT datos;
        END LOOP;
    ELSIF _proceso='solicitudpago' THEN    
        FOR valores IN (SELECT u.nombreusuario, 
        (CASE WHEN u.idpersona NOTNULL THEN p.nombre||' '||p.papel||' '||p.sapel else '' END) as nombrepersona,
        r.denominacion, d.observacion, d.fecha, c.codigo as numero, e.nombre as nombreestado--, c.denominacionclienteproveedor
        FROM mod_crmcontratacion.dat_solicitudpagodictamen d 
        LEFT JOIN mod_seguridad.seg_usuario u ON(u.idusuario=d.idusuario) 
        LEFT JOIN mod_persona.dat_persona p ON(p.idpersona=u.idpersona) 
        LEFT JOIN mod_seguridad.seg_rol r ON(r.idrol=d.idrol) 
        LEFT JOIN mod_crmcontratacion.dat_solicitudpago c ON(c.idsolicitudpago=d.idsolicitudpago) 
        LEFT JOIN mod_crmcontratacion.nom_estado e ON(e.idestado=d.idestado) 
        WHERE d.idsolicitudpago=_idcontrato)
        LOOP
            datos.usuario=valores.nombreusuario;
            datos.persona=valores.nombrepersona;
            datos.rol=valores.denominacion;
            datos.fecha=valores.fecha;
            datos.numerocontrato=valores.numero;
            datos.nombreestado=valores.nombreestado;
            --datos.nombreclienteproveedor=valores.denominacionclienteproveedor;
            datos.observacion=valores.observacion;
            RETURN NEXT datos;
        END LOOP;
    ELSIF _proceso='solicitudnegocio' THEN    
        FOR valores IN (SELECT u.nombreusuario, 
        (CASE WHEN u.idpersona NOTNULL THEN p.nombre||' '||p.papel||' '||p.sapel else '' END) as nombrepersona,
        r.denominacion, d.observacion, d.fecha, c.idsolicitud as numero, e.nombre as nombreestado--, c.denominacionclienteproveedor
        FROM mod_crmcontratacion.dat_solicituddictamen d 
        LEFT JOIN mod_seguridad.seg_usuario u ON(u.idusuario=d.idusuario) 
        LEFT JOIN mod_persona.dat_persona p ON(p.idpersona=u.idpersona) 
        LEFT JOIN mod_seguridad.seg_rol r ON(r.idrol=d.idrol) 
        LEFT JOIN mod_crmcontratacion.dat_solicitudnegocio c ON(c.idsolicitud=d.idsolicitud) 
        LEFT JOIN mod_crmcontratacion.nom_estado e ON(e.idestado=d.idestado) 
        WHERE d.idsolicitud=_idcontrato)
        LOOP
            datos.usuario=valores.nombreusuario;
            datos.persona=valores.nombrepersona;
            datos.rol=valores.denominacion;
            datos.fecha=valores.fecha;
            --datos.numerocontrato=valores.numero;
            datos.nombreestado=valores.nombreestado;
            --datos.nombreclienteproveedor=valores.denominacionclienteproveedor;
            datos.observacion=valores.observacion;
            RETURN NEXT datos;
        END LOOP;
    ELSIF _proceso='oferta' THEN    
        FOR valores IN (SELECT u.nombreusuario, 
        (CASE WHEN u.idpersona NOTNULL THEN p.nombre||' '||p.papel||' '||p.sapel else '' END) as nombrepersona,
        r.denominacion, d.observacion, d.fecha, c.numero, e.nombre as nombreestado--, c.denominacionclienteproveedor
        FROM mod_crmcontratacion.dat_ofertadictamen d 
        LEFT JOIN mod_seguridad.seg_usuario u ON(u.idusuario=d.idusuario) 
        LEFT JOIN mod_persona.dat_persona p ON(p.idpersona=u.idpersona) 
        LEFT JOIN mod_seguridad.seg_rol r ON(r.idrol=d.idrol) 
        LEFT JOIN mod_crmcontratacion.dat_ofertanegocio c ON(c.idoferta=d.idoferta) 
        LEFT JOIN mod_crmcontratacion.nom_estado e ON(e.idestado=d.idestado) 
        WHERE d.idoferta=_idcontrato)
        LOOP
            datos.usuario=valores.nombreusuario;
            datos.persona=valores.nombrepersona;
            datos.rol=valores.denominacion;
            datos.fecha=valores.fecha;
            datos.numerocontrato=valores.numero;
            datos.nombreestado=valores.nombreestado;
            --datos.nombreclienteproveedor=valores.denominacionclienteproveedor;
            datos.observacion=valores.observacion;
            RETURN NEXT datos;
        END LOOP;
    END IF;
	--RETURN datos;
END
$$;
CREATE FUNCTION f_get_facultados(_idclientes character varying, _tipofacultad numeric) RETURNS SETOF td_contactofacultad
    LANGUAGE plpgsql
    AS $$
DECLARE
    valores record;
    datos mod_crmcontratacion.td_contactofacultad;
    nombre_temp varchar;
    nombrecontacto_temp varchar;
BEGIN
	nombre_temp=NULL;
    FOR valores IN (
        SELECT 
        (CASE WHEN clpr.registrado = 0 THEN clpr.codigo||' - '||clpr.nombre else 
         COALESCE (estru.codigo, ident.numero)||' - '||COALESCE (estru.denominacion, per.nombre||' '||per.papel||' '||per.sapel) END) as nombre,
        (CASE WHEN clpr.registrado = 0 THEN clpr.codigo else COALESCE (estru.codigo, ident.numero) END) as codigo,
		c.nombre as nombrecontacto, c.facultad, tf.denominacion
        FROM mod_datosmaestros.nom_clientesproveedor clpr
        LEFT JOIN mod_estructuracomp.dat_estructura estru ON (clpr.idestructura = estru.idestructura and estru.idproyecto=0)
        LEFT JOIN mod_persona.dat_persona per ON (clpr.idpersona = per.idpersona)
        LEFT JOIN mod_persona.dat_docidentidad ident ON (clpr.idpersona = ident.idpersona)
        LEFT JOIN mod_datosmaestros.nom_contacto c ON (c.idclientesproveedores=clpr.idclientesproveedores)
        INNER JOIN mod_crmclienteproveedor.dat_facultad f ON (f.idcontacto=c.idcontacto)
        LEFT JOIN mod_crmclienteproveedor.nom_tipofacultad tf ON (tf.idtipofacultad=f.idtipofacultad)
        WHERE  
    	(CASE WHEN _idclientes NOTNULL THEN clpr.idclientesproveedores=ANY  (string_to_array(_idclientes, ',')::bigint[]) ELSE TRUE END) AND 
        (CASE WHEN _tipofacultad NOTNULL THEN tf.idtipofacultad=_tipofacultad ELSE TRUE END))
    LOOP
    	--IF (nombre_temp IS NULL) THEN
        --	nombre_temp=valores.nombre;
        --    datos.nombre=valores.nombre;
        --    datos.tipofacultad=valores.denominacion;
        --END IF;
        IF (valores.nombre<>nombre_temp OR nombre_temp IS NULL) THEN
        	datos.nombre=valores.nombre;
            nombre_temp=valores.nombre;
            datos.nombrecontacto=valores.nombrecontacto;
            nombrecontacto_temp=valores.nombrecontacto;
            -- datos.nombre=valores.nombre;
        ELSE
        	datos.nombre=NULL;
            IF (valores.nombrecontacto<>nombrecontacto_temp OR nombrecontacto_temp IS NULL) THEN
                datos.nombrecontacto=valores.nombrecontacto;
                nombrecontacto_temp=valores.nombrecontacto;
                -- datos.nombre=valores.nombre;
            ELSE
                datos.nombrecontacto=NULL;
            END IF;
        END IF;
        datos.tipofacultad=valores.denominacion;
        datos.facultad=valores.facultad;
        RETURN NEXT datos;
    END LOOP;
    -- RETURN datos;
END
$$;
CREATE FUNCTION f_get_html(_items json, _html text) RETURNS text
    LANGUAGE plpgsql
    AS $$
  DECLARE
    _i          JSON;
    _k          JSON;
    _exp        TEXT;
  BEGIN
      FOR _k IN SELECT * FROM json_array_elements(_items) LOOP
          --_exp := '<span\s+class=\"editor-element\"\s+idelemento=\"' || (_k ->> 'idelemento') || '\">(?:\w|\s)+<\/span>';
          _exp := '<span(class\=\"editor\-element\"|\s|contenteditable=\"false\")*idelemento=\"' || (_k ->> 'idelemento') || '\"(class\=\"editor\-element\"|\s|contenteditable=\"false\")*>(?:\w|\s)+<\/span>';
          _html := regexp_replace(_html, _exp, (_k ->> 'value'));
      END LOOP;
    RETURN _html || '<br>';
  END
  $$;
CREATE FUNCTION f_get_html_contrato(_idcontrato numeric) RETURNS text
    LANGUAGE plpgsql
    AS $$
  DECLARE
    _html_final    TEXT := '';
    _html          TEXT := '';
    _html_clausula TEXT := '';
    _items         JSON;
    _i             JSON;
    _k             JSON;
    _exp           TEXT;
  BEGIN
    FOR _i IN SELECT e FROM mod_crmcontratacion.dat_contrato dc, json_array_elements(dc.elemento) e
    WHERE dc.idcontrato = _idcontrato LOOP
      _items := (_i -> 'items');
      _html := '';
      IF (_i ->> 'htmlvalue') ISNULL THEN
        _html_final := _html_final || '<div align="center"><font size="3"><b>' || (_i ->> 'title') || '</b></font><br></div>';
        FOR _k IN SELECT * FROM json_array_elements(_items) LOOP
          _html := _html || '<b>' || (_k ->> 'title') || ': </b>'/* ||  '<br>'*/;
          SELECT * INTO _html_clausula
            FROM mod_crmcontratacion.f_get_html((_k -> 'items'), (_k ->> 'htmlvalue'));
          _html := _html || _html_clausula /*|| '<br>'*/;
        END LOOP;
        ELSE
          _html_final := '<b>' || _html_final || (_i ->> 'title') || ': </b>'/* || '<br>'*/;
          SELECT * INTO _html
          FROM mod_crmcontratacion.f_get_html(_items, (_i ->> 'htmlvalue'));
      END IF;
      _html_final = _html_final || _html /*|| '<br>'*/;
    END LOOP;
    RETURN _html_final;
  END
  $$;
CREATE FUNCTION f_get_html_proforma(_idproforma numeric) RETURNS text
    LANGUAGE plpgsql
    AS $$
  DECLARE
    _html_final    TEXT := '';
    _i             RECORD;
    _cont          NUMERIC:=0;
  BEGIN
    FOR _i IN SELECT m1.idproforma,m1.denominacion,m1.vendedor,m1.comprador,m1.ambos,m3.denominacion as clausula,m2.contenido as contenidoclausula,m1.anexos 
    FROM mod_crmcontratacion.dat_proforma m1 INNER JOIN mod_crmcontratacion.dat_proformaclausula m2 ON m1.idproforma=m2.idproforma
    INNER JOIN mod_crmcontratacion.nom_clausula m3 ON m2.idclausula=m3.idclausula WHERE m1.idproforma=_idproforma LOOP
      IF _cont=0 THEN 
      _html_final:= '<span style="font-weight:bold;">'||_i.denominacion||'</span><br><br>'||'DE UNA PARTE:'||_i.vendedor||'<br>'||'DE OTRA PARTE:'||_i.comprador||'<br>'||'AMBAS PARTES:'||_i.ambos||'<br>'||'CLAUSULAS<br>'||_i.clausula||'<br>'||_i.contenidoclausula||'<br>';
        _cont:=_cont+1;
      ELSE
          _html_final:= _html_final||_i.clausula||'<br>'||_i.contenidoclausula||'<br>';
      END IF;
    END LOOP;
    RETURN _html_final;
  END
  $$;
CREATE FUNCTION f_get_ofertacomercial(_idoferta numeric, _idpersona numeric) RETURNS SETOF td_oferta
    LANGUAGE plpgsql
    AS $$
DECLARE 
	persona CHARACTER VARYING;
    valores record;
    datos mod_crmcontratacion.td_oferta;
BEGIN
	persona=(SELECT (per.nombre||' '||per.papel||' '||per.sapel) as persona FROM mod_persona.dat_persona per WHERE per.idpersona=_idpersona); --101506
	FOR valores IN (
        SELECT e2.denominacion as nombreempresa,o.numero as codigoempresa, e.denominacion as nombreueb,CURRENT_DATE as fecha, cp.nombre as clienteproveedor, cp.codigo as codigoclienteproveedor, 
        i.codigo as referencia, io.denominacion as descripcion, io.cantidad, 
        (CASE WHEN mio2.valor IS NOT NULL THEN mio2.valor ELSE 0.00 END) as preciocuc, 
        (CASE WHEN mio1.valor IS NOT NULL THEN mio1.valor ELSE 0.00 END) as preciocup,
        (CASE WHEN mio2.valor IS NOT NULL THEN ROUND((mio2.valor*io.cantidad),2) else 0 END) as importecuc,
        (CASE WHEN mio1.valor IS NOT NULL THEN ROUND((mio1.valor*io.cantidad),2) else 0 END) as importecup,
        ((CASE WHEN mio1.valor IS NOT NULL THEN mio1.valor else 0 END)+(CASE WHEN mio2.valor IS NOT NULL THEN mio2.valor else 0 END)) as total,
        o.vigencia,
        --(CASE WHEN cbc.nombrecuenta IS NOT NULL THEN 'MN: '||cbc.nombrecuenta ELSE NULL END) as cuentamn,
        --(CASE WHEN cbc2.nombrecuenta IS NOT NULL THEN 'CUC: '||cbc2.nombrecuenta ELSE NULL END) as cuentacuc
        (CASE WHEN cbc.nombrecuenta IS NOT NULL AND cbc2.nombrecuenta IS NOT NULL THEN 'MN: '||cbc.nombrecuenta||'   CUC: '||cbc2.nombrecuenta
         WHEN cbc.nombrecuenta IS NOT NULL AND cbc2.nombrecuenta IS NULL THEN 'MN: '||cbc.nombrecuenta
         WHEN cbc.nombrecuenta IS NULL AND cbc2.nombrecuenta IS NOT NULL THEN 'CUC: '||cbc2.nombrecuenta
         ELSE NULL END) as cuentamn
        --cbc.nombrecuenta as cuentamn, 
        --cbc2.nombrecuenta as cuentacuc
        FROM mod_crmcontratacion.dat_ofertanegocio o 
        LEFT JOIN mod_estructuracomp.dat_estructura e on (e.idestructura=o.idestructuracomun)
        LEFT JOIN mod_estructuracomp.nom_filaestruc fe on(e.idestructura=fe.idfila)
        LEFT JOIN mod_estructuracomp.dat_estructura e2 on (e2.idestructura=ltree2text(subpath(fe.parent_path, 0, 1))::INT)
        LEFT JOIN mod_datosmaestros.nom_clientesproveedor cp on (cp.idclientesproveedores=o.idclienteproveedor)
        LEFT JOIN mod_crmcontratacion.dat_indicadoroferta io on (io.idoferta=o.idoferta)
        LEFT JOIN mod_datosmaestros.nom_indicador i on (i.idindicador=io.idindicador)
        
        LEFT JOIN mod_datosmaestros.dat_cuentabanccliente cbc ON 
            (cp.idclientesproveedores=cbc.idclienteproveedores --AND cbc.predeterminado=1 
            AND cbc.idmoneda=(SELECT nm1.idmoneda FROM mod_datosmaestros.nom_moneda nm1 WHERE nm1.codigoiso='CUP') )
        --    left JOIN mod_datosmaestros.nom_moneda nm1 on (nm1.idmoneda=cbc.idmoneda AND nm1.codigoiso='CUP')
            LEFT JOIN mod_datosmaestros.dat_cuentabanccliente cbc2 ON 
            (cp.idclientesproveedores=cbc2.idclienteproveedores --AND cbc2.predeterminado=1
            AND cbc2.idmoneda=(SELECT nm2.idmoneda FROM mod_datosmaestros.nom_moneda nm2 WHERE nm2.codigoiso='CUC'))
            --left JOIN mod_datosmaestros.nom_moneda nm2 on (nm2.idmoneda=cbc2.idmoneda AND nm2.codigoiso='CUC')
        
        LEFT JOIN mod_crmcontratacion.dat_monedaindicadoroferta mio1 ON (mio1.idindicadoroferta=io.idindicadoroferta
        AND mio1.idmoneda=(SELECT nm3.idmoneda FROM mod_datosmaestros.nom_moneda nm3 WHERE nm3.codigoiso='CUP'))                    
     --   INNER JOIN mod_datosmaestros.nom_moneda nm3 on (nm3.idmoneda=fm.idmoneda AND nm3.codigoiso='CUP')
        LEFT JOIN mod_crmcontratacion.dat_monedaindicadoroferta mio2 ON (mio2.idindicadoroferta=io.idindicadoroferta
        AND mio2.idmoneda=(SELECT nm4.idmoneda FROM mod_datosmaestros.nom_moneda nm4 WHERE nm4.codigoiso='CUC'))
        --INNER JOIN mod_datosmaestros.nom_moneda nm4 on (nm4.idmoneda=fm2.idmoneda AND nm4.codigoiso='CUC')
    WHERE o.idoferta=_idoferta) --104
    LOOP
        datos.nombreempresa=valores.nombreempresa;
        datos.numero=valores.codigoempresa;
    	datos.nombreueb=valores.nombreueb;
        datos.fecha=valores.fecha;
        datos.codigoclienteproveedor=valores.codigoclienteproveedor;
        datos.clienteproveedor=valores.clienteproveedor;
        datos.referencia=valores.referencia;
        datos.descripcion=valores.descripcion;
        datos.cantidad=valores.cantidad;
        datos.preciocuc=valores.preciocuc;
        datos.preciocup=valores.preciocup;
        datos.importecuc=valores.importecuc;
        datos.importecup=valores.importecup;
        datos.diasvigencia=valores.vigencia;
        datos.cuentamn=valores.cuentamn;
        --datos.cuentacuc=valores.cuentacuc;
        datos.persona=persona;
        RETURN NEXT datos;
	END LOOP;
	--RETURN datos;
END
$$;
CREATE FUNCTION f_get_soliciudpago(_idsolicitud numeric) RETURNS SETOF td_solicitudpago
    LANGUAGE plpgsql
    AS $$
DECLARE 
    valores record;
    datos mod_crmcontratacion.td_solicitudpago;
BEGIN
	FOR valores IN (SELECT sp.*, to_char(sp.fecharecibo,'YYYY/MM/DD') as fecha,
                    cbc.numerocuenta as numerocuentamn, cbc2.numerocuenta as numerocuentacuc, c.numerocontrato, 
                    fsp.numero as numerofactura,
                    fm.valor as montomn, fm2.valor as montocuc, 
                    ((CASE WHEN fm.valor IS NOT NULL THEN fm.valor else 0 END)+(CASE WHEN fm2.valor IS NOT NULL THEN fm2.valor else 0 END)) as total,
                    (CASE WHEN mp.nombre = 'Cheque' THEN 'X' ELSE '' END) as cheque,
                    (CASE WHEN mp.nombre = 'Transferencia Bancaria' THEN 'X' ELSE '' END) as transferenciabancaria,
                    (CASE WHEN mp.nombre = 'Transferencia Interna' THEN 'X' ELSE '' END) as transferenciainterna,
                    (CASE WHEN mp.nombre = 'Otros' THEN 'X' ELSE '' END) as otros,
                    (CASE WHEN tp.nombre = 'Operaciones' THEN 'X' ELSE '' END) as operaciones,
                    (CASE WHEN tp.nombre = 'Inversiones' THEN 'X' ELSE '' END) as inversiones,
                    (CASE WHEN tp.nombre = 'Pago Anticipado' THEN 'X' ELSE '' END) as pagoanticipado,
                    (CASE WHEN tp.nombre = 'Pago Posterior' THEN 'X' ELSE '' END) as pagoposterior
                    FROM mod_crmcontratacion.dat_solicitudpago sp
                    LEFT JOIN mod_crmcontratacion.dat_contrato c ON c.idcontrato=sp.idcontrato 
                    LEFT JOIN mod_datosmaestros.nom_clientesproveedor cp ON c.idclienteproveedor=cp.idclientesproveedores
                    LEFT JOIN mod_crmcontratacion.nom_mediodepago mp ON mp.idmediodepago=sp.idformapago
                    LEFT JOIN mod_datosmaestros.nom_terminosdepago tp ON c.idcondicionpago=tp.idterminodepago
                    
                    LEFT JOIN mod_datosmaestros.dat_cuentabanccliente cbc ON 
                    (cp.idclientesproveedores=cbc.idclienteproveedores AND cbc.predeterminado=1 AND cbc.idmoneda=9900000103)
                    LEFT JOIN mod_datosmaestros.dat_cuentabanccliente cbc2 ON 
                    (cp.idclientesproveedores=cbc2.idclienteproveedores AND cbc2.predeterminado=1 AND cbc2.idmoneda=9900000102)
                    
                    LEFT JOIN mod_crmcontratacion.dat_facturasolicitudpago fsp ON fsp.idsolicitudpago=sp.idsolicitudpago
                    LEFT JOIN mod_crmcontratacion.dat_facturamoneda fm ON (fsp.idfactura=fm.idfactura AND fm.idmoneda=9900000103)
                    LEFT JOIN mod_crmcontratacion.dat_facturamoneda fm2 ON (fsp.idfactura=fm2.idfactura AND fm2.idmoneda=9900000102)
                    WHERE sp.idsolicitudpago=_idsolicitud
                   )
    LOOP
        datos.codigo=valores.codigo;
        datos.fecha=valores.fecha;
        datos.descripcion=valores.descripcion;
        datos.objetivo=valores.objetivos;
        datos.numerocontrato=valores.numerocontrato;
        datos.numerocuentamn=valores.numerocuentamn;
        datos.numerocuentacuc=valores.numerocuentacuc;
        datos.cheque=valores.cheque;
        datos.transferenciabancaria=valores.transferenciabancaria;
        datos.transferenciainterna=valores.transferenciainterna;
        datos.otros=valores.otros;
        datos.operaciones=valores.operaciones;
        datos.inversiones=valores.inversiones;
        datos.pagoanticipado=valores.pagoanticipado;
        datos.pagoposterior=valores.pagoposterior;
        datos.numerofactura=valores.numerofactura;
        datos.montomn=valores.montomn;
        datos.montocuc=valores.montocuc;
        datos.total=valores.total;
        RETURN NEXT datos;
	END LOOP;
	--RETURN datos;
END
$$;
CREATE FUNCTION f_get_soliciudpago(_idsolicitud numeric, _idestructuracomun numeric) RETURNS SETOF td_solicitudpago
    LANGUAGE plpgsql
    AS $$
DECLARE 
	estructura CHARACTER VARYING;
    valores record;
    datos mod_crmcontratacion.td_solicitudpago;
BEGIN
	estructura = (SELECT e.abreviatura FROM mod_estructuracomp.dat_estructura e WHERE e.idestructura=100000532);
	FOR valores IN (SELECT sp.*, to_char(sp.fecharecibo,'YYYY/MM/DD') as fecha,
                    cbc.numerocuenta as numerocuentamn, cbc2.numerocuenta as numerocuentacuc, c.numerocontrato, 
                    fsp.numero as numerofactura, 
                    fm.valor as montomn, fm2.valor as montocuc, 
                    mp.nombre as instrumentopago, tp.nombre as tipopago,
                    COALESCE (cp.nombre,per.nombre||' '||per.papel||' '||per.sapel,estru.denominacion,estruop.denominacion) as proveedor,
                    ((CASE WHEN fm.valor IS NOT NULL THEN fm.valor else 0 END)+(CASE WHEN fm2.valor IS NOT NULL THEN fm2.valor else 0 END)) as total,
                    (CASE WHEN mp.nombre = 'Cheque' THEN 'X' ELSE '' END) as cheque,
                    (CASE WHEN mp.nombre = 'Transferencia Bancaria' THEN 'X' ELSE '' END) as transferenciabancaria,
                    (CASE WHEN mp.nombre = 'Transferencia Interna' THEN 'X' ELSE '' END) as transferenciainterna,
                    (CASE WHEN mp.nombre = 'Otros' THEN 'X' ELSE '' END) as otros,
                    (CASE WHEN tp.nombre = 'Operaciones' THEN 'X' ELSE '' END) as operaciones,
                    (CASE WHEN tp.nombre = 'Inversiones' THEN 'X' ELSE '' END) as inversiones,
                    (CASE WHEN tp.nombre = 'Pago Anticipado' THEN 'X' ELSE '' END) as pagoanticipado,
                    (CASE WHEN tp.nombre = 'Pago Posterior' THEN 'X' ELSE '' END) as pagoposterior
                    FROM mod_crmcontratacion.dat_solicitudpago sp
                    LEFT JOIN mod_crmcontratacion.dat_contrato c ON c.idcontrato=sp.idcontrato 
                    LEFT JOIN mod_datosmaestros.nom_clientesproveedor cp ON c.idclienteproveedor=cp.idclientesproveedores
                    LEFT JOIN mod_persona.dat_persona per ON (cp.idpersona = per.idpersona)
                    LEFT JOIN mod_estructuracomp.dat_estructura estru ON (cp.idestructura = estru.idestructura and estru.idproyecto=0)
                    LEFT JOIN mod_estructuracomp.dat_estructuraop estruop ON (cp.idestructura = estruop.idestructuraop and estruop.idproyecto=0)
                    LEFT JOIN mod_crmcontratacion.nom_mediodepago mp ON mp.idmediodepago=sp.idformapago
                    LEFT JOIN mod_datosmaestros.nom_terminosdepago tp ON c.idcondicionpago=tp.idterminodepago
                    
                    LEFT JOIN mod_datosmaestros.dat_cuentabanccliente cbc ON 
                    (cp.idclientesproveedores=cbc.idclienteproveedores AND cbc.predeterminado=1 
                    AND cbc.idmoneda=(SELECT nm1.idmoneda FROM mod_datosmaestros.nom_moneda nm1 WHERE nm1.codigoiso='CUP') )
                --    left JOIN mod_datosmaestros.nom_moneda nm1 on (nm1.idmoneda=cbc.idmoneda AND nm1.codigoiso='CUP')
                    LEFT JOIN mod_datosmaestros.dat_cuentabanccliente cbc2 ON 
                    (cp.idclientesproveedores=cbc2.idclienteproveedores AND cbc2.predeterminado=1
                    AND cbc2.idmoneda=(SELECT nm2.idmoneda FROM mod_datosmaestros.nom_moneda nm2 WHERE nm2.codigoiso='CUC'))
                    --left JOIN mod_datosmaestros.nom_moneda nm2 on (nm2.idmoneda=cbc2.idmoneda AND nm2.codigoiso='CUC')
                    
                    LEFT JOIN mod_crmcontratacion.dat_facturasolicitudpago fsp ON fsp.idsolicitudpago=sp.idsolicitudpago
                    LEFT JOIN mod_crmcontratacion.dat_facturamoneda fm ON (fsp.idfactura=fm.idfactura
                    AND fm.idmoneda=(SELECT nm3.idmoneda FROM mod_datosmaestros.nom_moneda nm3 WHERE nm3.codigoiso='CUP'))                    
                 --   INNER JOIN mod_datosmaestros.nom_moneda nm3 on (nm3.idmoneda=fm.idmoneda AND nm3.codigoiso='CUP')
                    LEFT JOIN mod_crmcontratacion.dat_facturamoneda fm2 ON (fsp.idfactura=fm2.idfactura
                    AND fm2.idmoneda=(SELECT nm4.idmoneda FROM mod_datosmaestros.nom_moneda nm4 WHERE nm4.codigoiso='CUC'))
                    --INNER JOIN mod_datosmaestros.nom_moneda nm4 on (nm4.idmoneda=fm2.idmoneda AND nm4.codigoiso='CUC')
                    WHERE sp.idsolicitudpago=_idsolicitud
                   )
    LOOP
        datos.codigo=valores.codigo;
        datos.fecha=valores.fecha;
        datos.descripcion=valores.descripcion;
        datos.objetivo=valores.objetivos;
        datos.numerocontrato=valores.numerocontrato;
        datos.numerocuentamn=valores.numerocuentamn;
        datos.numerocuentacuc=valores.numerocuentacuc;
        datos.cheque=valores.cheque;
        datos.transferenciabancaria=valores.transferenciabancaria;
        datos.transferenciainterna=valores.transferenciainterna;
        datos.otros=valores.otros;
        datos.operaciones=valores.operaciones;
        datos.inversiones=valores.inversiones;
        datos.pagoanticipado=valores.pagoanticipado;
        datos.pagoposterior=valores.pagoposterior;
        datos.numerofactura=valores.numerofactura;
        datos.montomn=valores.montomn;
        datos.montocuc=valores.montocuc;
        datos.total=valores.total;
        datos.entidad=estructura;
        datos.tipopago=valores.tipopago;
        datos.instrumentopago=valores.instrumentopago;
        datos.proveedor=valores.proveedor;
        RETURN NEXT datos;
	END LOOP;
	--RETURN datos;
END
$$;
CREATE FUNCTION ft_actualizacion_arbol_contrato() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
if (new.idpadre is null or new.idpadre = 0) then
    new.idpadre = new.idcontrato;
end if;
RETURN new;
END;
$$;
CREATE FUNCTION ft_chequear() RETURNS trigger
    LANGUAGE plpgsql IMMUTABLE
    AS $$
BEGIN
IF(OLD.version = NEW.version)THEN
  NEW.version = NEW.version + 1;
  ELSE
    IF (OLD.version is Null) THEN 
      NEW.version = 0;
      ELSE
	RAISE EXCEPTION 'CONCURRENCE RESTRICTION';
    END IF;
END IF;
RETURN NEW;
END;
$$;
COMMENT ON FUNCTION ft_chequear() IS 'Funcion que actualiza el campo version utilizado para la concurrencia.';
CREATE FUNCTION ft_cliente_cantidad(cliente numeric) RETURNS SETOF td_cantcliente
    LANGUAGE plpgsql
    AS $_$
DECLARE
 datos mod_crmcontratacion.td_cantcliente;
 valores record;
BEGIN
if ($1 is null) then
    for valores in (select nombre,count(idclienteproveedor) as cant from(SELECT (CASE WHEN ne.registrado = 0 THEN ne.nombre else COALESCE (estru.denominacion, per.nombre||' '||per.papel||' '||per.sapel) END) as nombre,dc.idclienteproveedor
	FROM mod_crmcontratacion.dat_contrato as dc
	inner join mod_datosmaestros.nom_clientesproveedor as ne on (ne.idclientesproveedores=dc.idclienteproveedor)
	LEFT JOIN mod_estructuracomp.dat_estructura estru ON (ne.idestructura = estru.idestructura and estru.idproyecto=0)
    LEFT JOIN mod_persona.dat_persona per ON (ne.idpersona = per.idpersona))a
	Group by a.nombre) loop
	
		datos.cliente = valores.nombre;
		datos.cantidad = valores.cant;
		return next datos;
    end loop;
else
   for valores in 	(select nombre,count(idclienteproveedor) as cant from(SELECT (CASE WHEN ne.registrado = 0 THEN ne.nombre 
   else COALESCE (estru.denominacion, per.nombre||' '||per.papel||' '||per.sapel) END) as nombre,dc.idclienteproveedor
	FROM mod_crmcontratacion.dat_contrato as dc
	inner join mod_datosmaestros.nom_clientesproveedor as ne on (ne.idclientesproveedores=dc.idclienteproveedor)
	LEFT JOIN mod_estructuracomp.dat_estructura estru ON (ne.idestructura = estru.idestructura and estru.idproyecto=0)
        LEFT JOIN mod_persona.dat_persona per ON (ne.idpersona = per.idpersona))a
     	where idclienteproveedor = $1 group by a.nombre) loop
		datos.cliente = valores.nombre;
		datos.cantidad = valores.cant;
		return next datos;
    end loop;
end if;
END
  $_$;
COMMENT ON FUNCTION ft_cliente_cantidad(cliente numeric) IS 'Guarda la cantidad de contratos que tiene cada cliente o proveedor.';
CREATE FUNCTION ft_estado_cantidad(estado numeric) RETURNS SETOF td_cantestado
    LANGUAGE plpgsql
    AS $_$
DECLARE
 datos mod_crmcontratacion.td_cantestado;
 valores record;
BEGIN
if ($1 is null) then
    for valores in (SELECT ne.nombre, count(dc.idestado) as cant 
	FROM mod_crmcontratacion.dat_contrato as dc
	inner join mod_crmcontratacion.nom_estado as ne using (idestado)
	group by ne.nombre) loop
		datos.estado = valores.nombre;
		datos.cantidad = valores.cant;
		return next datos;
    end loop;
else
   for valores in (SELECT ne.nombre, count(dc.idestado) as cant 
	FROM mod_crmcontratacion.dat_contrato as dc
	inner join mod_crmcontratacion.nom_estado as ne using (idestado)
	where dc.idestado = $1 group by ne.nombre) loop
		datos.estado = valores.nombre;
		datos.cantidad = valores.cant;
		return next datos;
    end loop;
end if;
END;$_$;
COMMENT ON FUNCTION ft_estado_cantidad(estado numeric) IS 'Guarda la cantidad de contratos por estado.';
CREATE FUNCTION ft_fechascontratos(cantdias numeric) RETURNS SETOF td_fechascontratos
    LANGUAGE plpgsql
    AS $_$
DECLARE
 datos mod_crmcontratacion.td_fechascontratos;
 valores record;
BEGIN
if ($1 is null) then
    for valores in (SELECT dc.nombre,dc.fechafin,(dc.fechafin-now()::date) as cant FROM mod_crmcontratacion.dat_contrato as dc WHERE dc.fechafin > now()::date) loop
	datos.contrato = valores.nombre;
	datos.cantidad = valores.cant;
	return next datos;
    end loop;
else
   for valores in (SELECT dc.nombre,dc.fechafin,(dc.fechafin-now()::date) as cant FROM mod_crmcontratacion.dat_contrato as dc WHERE dc.fechafin > now()::date
   AND (dc.fechafin-now()::date)<=$1) loop
	datos.contrato = valores.nombre;
	datos.cantidad = valores.cant;
	return next datos;
    end loop;
end if;
END;$_$;
COMMENT ON FUNCTION ft_fechascontratos(cantdias numeric) IS 'Guarda la fecha de vencimiento de los contratos seg''un le fecha de fin con la actual.';
CREATE FUNCTION ft_tipocontrato_cantidad(tipo numeric) RETURNS SETOF td_canttipocontrato
    LANGUAGE plpgsql
    AS $_$
DECLARE
 datos mod_crmcontratacion.td_canttipocontrato;
 valores record;
BEGIN
if ($1 is null) then
    for valores in (SELECT ne.denominacion, count(dc.idtipocontrato) as cant 
	FROM mod_crmcontratacion.dat_contrato as dc
	inner join mod_crmcontratacion.dat_tipocontrato as ne using (idtipocontrato)
	group by ne.denominacion) loop
		datos.contrato = valores.denominacion;
		datos.cantidad = valores.cant;
		return next datos;
    end loop;
else
   for valores in (SELECT ne.denominacion, count(dc.idtipocontrato) as cant 
	FROM mod_crmcontratacion.dat_contrato as dc
	inner join mod_crmcontratacion.dat_tipocontrato as ne using (idtipocontrato)
	where dc.idtipocontrato = $1 group by ne.denominacion) loop
		datos.contrato = valores.denominacion;
		datos.cantidad = valores.cant;
		return next datos;
    end loop;
end if;
END;$_$;
COMMENT ON FUNCTION ft_tipocontrato_cantidad(tipo numeric) IS 'Guarda la cantidad de tipo de contrato por contrato.';
SET search_path = mod_crmadministracion, pg_catalog;
SET default_tablespace = '';
SET default_with_oids = false;
CREATE TABLE conf_accesodirecto (
    idaccesodirecto numeric(19,0) NOT NULL,
    idestructura numeric(19,0),
    idusuario numeric(19,0) NOT NULL,
    idfuncionalidad numeric(19,0) NOT NULL
);
COMMENT ON TABLE conf_accesodirecto IS 'Almacena la configuración de los módulos que se cargan por defecto.';
COMMENT ON COLUMN conf_accesodirecto.idaccesodirecto IS 'Identificador del acceso directo.';
COMMENT ON COLUMN conf_accesodirecto.idestructura IS 'Identificador de la estructura.';
COMMENT ON COLUMN conf_accesodirecto.idusuario IS 'Identificador del usuario.';
COMMENT ON COLUMN conf_accesodirecto.idfuncionalidad IS 'Identificador de la funcionalidad.
';
CREATE TABLE conf_clientesproveedores (
    idconfclientesproveedores numeric(1,0) NOT NULL,
    activo numeric(1,0)
);
COMMENT ON COLUMN conf_clientesproveedores.idconfclientesproveedores IS 'identificador del cliente proveedor';
COMMENT ON COLUMN conf_clientesproveedores.activo IS '1 activo el GD
0 no activo el GD';
CREATE SEQUENCE sec_comitegeneral_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE conf_comitegeneral (
    idcomitegeneral numeric DEFAULT nextval('sec_comitegeneral_seq'::regclass) NOT NULL,
    nombre character varying(50),
    pordefecto numeric DEFAULT 0,
    idestructuracomun numeric(19,0),
    descripcion character varying(250)
);
COMMENT ON COLUMN conf_comitegeneral.pordefecto IS 'Si es 1 es por defecto si es 0 no lo es';
CREATE SEQUENCE sec_contratogeneral_seq
    START WITH 2
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE conf_contratogeneral (
    idcontratogeneral numeric(19,0) DEFAULT nextval('sec_contratogeneral_seq'::regclass) NOT NULL,
    idestadoofertalisto numeric(19,0),
    activopersona numeric(1,0) DEFAULT 0,
    idestructuracomun numeric(19,0)
);
CREATE SEQUENCE sec_confmodulo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE conf_modulo (
    idconfmodulo numeric(19,0) DEFAULT nextval('sec_confmodulo_seq'::regclass) NOT NULL,
    config json NOT NULL,
    valores json NOT NULL,
    idestructuracomun numeric(19,0) NOT NULL
);
COMMENT ON TABLE conf_modulo IS 'Guarda la configuración de los módulos activos del sistema.';
COMMENT ON COLUMN conf_modulo.idconfmodulo IS 'Guarda el identificador del módulo.';
COMMENT ON COLUMN conf_modulo.config IS 'Guarda los mdulos que puedes ser activados o desactivados';
COMMENT ON COLUMN conf_modulo.valores IS 'Guarda que módulos estan activos y cuales no.';
COMMENT ON COLUMN conf_modulo.idestructuracomun IS 'Identificador de estructura común.';
CREATE TABLE conf_ofertanegocio (
    idconfoferta numeric(19,0) NOT NULL,
    idestadosolicitudinsertar numeric(19,0) NOT NULL,
    idespaciotrabajo character varying(255),
    espaciotrabajo character varying(255),
    activo numeric(1,0),
    idestadosolicitudofertainsertar numeric(19,0)
);
COMMENT ON TABLE conf_ofertanegocio IS 'Guarda las ofertas de negocios.';
COMMENT ON COLUMN conf_ofertanegocio.idconfoferta IS 'Guarda el identificador de la configuración de oferta negocio.';
COMMENT ON COLUMN conf_ofertanegocio.idestadosolicitudinsertar IS 'Identificador del estado de la solicitud que puede ser seleccionada al insertar la oferta.';
COMMENT ON COLUMN conf_ofertanegocio.idespaciotrabajo IS 'Identificador del espacio de trabajo.';
COMMENT ON COLUMN conf_ofertanegocio.espaciotrabajo IS 'Denominación del espacio de trabajo';
COMMENT ON COLUMN conf_ofertanegocio.activo IS 'Esta activo o no gestor documental';
CREATE TABLE conf_solicitudnegocio (
    idconfsolicitud numeric(1,0) NOT NULL,
    idespaciotrabajo character varying(255),
    espaciotrabajo character varying(255),
    activo numeric(1,0)
);
COMMENT ON COLUMN conf_solicitudnegocio.idconfsolicitud IS 'Identificador de la solicitud de negocio';
COMMENT ON COLUMN conf_solicitudnegocio.idespaciotrabajo IS 'Identificador del espacio de trabajo';
COMMENT ON COLUMN conf_solicitudnegocio.espaciotrabajo IS 'Denominación del espacio de trabajo.';
COMMENT ON COLUMN conf_solicitudnegocio.activo IS '1 si esta activo o no el gestor documental';
CREATE SEQUENCE sec_valorespordefecto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE conf_valorespordefecto (
    idvalorespordefecto numeric(19,0) DEFAULT nextval('sec_valorespordefecto_seq'::regclass) NOT NULL,
    idarea numeric(19,0),
    idresponsable numeric(19,0),
    idsector numeric(19,0),
    idtipocontrato numeric(19,0),
    idestructuracomun numeric(19,0),
    idareafiltro numeric,
    idresponsablefiltro numeric,
    idestadofiltro numeric,
    idtipocontratofiltro numeric,
    idvigenciafiltro numeric,
    idclientefiltro numeric,
    idusuario numeric
);
COMMENT ON TABLE conf_valorespordefecto IS 'Guarda la configuración de los valores por defecto.';
COMMENT ON COLUMN conf_valorespordefecto.idvalorespordefecto IS 'Identificador de la tabla.';
COMMENT ON COLUMN conf_valorespordefecto.idarea IS 'Identificador del área.';
COMMENT ON COLUMN conf_valorespordefecto.idresponsable IS 'Identificador del responsable.';
COMMENT ON COLUMN conf_valorespordefecto.idsector IS 'Identificador del sector.';
COMMENT ON COLUMN conf_valorespordefecto.idtipocontrato IS 'Identificador del tipo de contrato.';
COMMENT ON COLUMN conf_valorespordefecto.idestructuracomun IS 'Identificador de la estructura.';
CREATE SEQUENCE sec_comitegestordocumental_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_comitegestordocumental (
    idcomitegestordocumental numeric(19,0) DEFAULT nextval('sec_comitegestordocumental_seq'::regclass) NOT NULL,
    denominacion character varying(255),
    idespaciotrabajo character varying(255),
    activo numeric(1,0) DEFAULT 0,
    idestructuracomun numeric(19,0),
    organizacion json DEFAULT '[]'::json
);
COMMENT ON TABLE dat_comitegestordocumental IS 'Guarda el comité de gestor documental.';
COMMENT ON COLUMN dat_comitegestordocumental.idcomitegestordocumental IS 'Identificador de gestor documental.';
COMMENT ON COLUMN dat_comitegestordocumental.denominacion IS 'Denominación del espacio de trabajo.';
COMMENT ON COLUMN dat_comitegestordocumental.idespaciotrabajo IS 'Identificador del espacio de trabajo.';
COMMENT ON COLUMN dat_comitegestordocumental.activo IS 'Guarda los valores 0 si no está activo y 1 si está activo el gestor documental para esta entidad.';
COMMENT ON COLUMN dat_comitegestordocumental.idestructuracomun IS 'Identificador de la estructura.';
COMMENT ON COLUMN dat_comitegestordocumental.organizacion IS 'Guarda la organización de las carpetas en las que se almacenan los documentos.';
CREATE SEQUENCE sec_comitetransicion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_comitetransicion (
    idcomitetransicion numeric(19,0) DEFAULT nextval('sec_comitetransicion_seq'::regclass) NOT NULL,
    idtransicion numeric(19,0) NOT NULL,
    idestructuracomun numeric(19,0) NOT NULL,
    reglas json DEFAULT '[]'::json,
    idcomite numeric(19,0)
);
COMMENT ON TABLE dat_comitetransicion IS 'Guarda los datos del comité de transición.';
COMMENT ON COLUMN dat_comitetransicion.idcomitetransicion IS 'Identificador de la tabla';
COMMENT ON COLUMN dat_comitetransicion.idtransicion IS 'Identificador de la tabla nom_transicion';
COMMENT ON COLUMN dat_comitetransicion.idestructuracomun IS 'Identificador de la estructura';
COMMENT ON COLUMN dat_comitetransicion.reglas IS 'Guarda las reglas del comité de transición.';
CREATE SEQUENCE sec_compartimentacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_compartimentacion (
    idcompartimentacion numeric(19,0) DEFAULT nextval('sec_compartimentacion_seq'::regclass) NOT NULL,
    idrol numeric(19,0),
    definicion json DEFAULT '{}'::json
);
COMMENT ON TABLE dat_compartimentacion IS 'Guarda la compartimentación del número de contrato.';
COMMENT ON COLUMN dat_compartimentacion.idcompartimentacion IS 'Identificador de la tabla.';
COMMENT ON COLUMN dat_compartimentacion.idrol IS 'Identificador del rol.';
COMMENT ON COLUMN dat_compartimentacion.definicion IS 'Guarda la definición  de la compratimentación.';
CREATE SEQUENCE sec_contratocontabilidad_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_contratocontabilidad (
    idcontratocontabilidad numeric(19,0) DEFAULT nextval('sec_contratocontabilidad_seq'::regclass) NOT NULL,
    activo numeric(1,0) DEFAULT 0,
    idestructuracomun numeric(19,0)
);
COMMENT ON TABLE dat_contratocontabilidad IS 'Guarda la configuración de la planificación de los contratos.';
COMMENT ON COLUMN dat_contratocontabilidad.idcontratocontabilidad IS 'Identificador de la contabilidad del contrato.';
COMMENT ON COLUMN dat_contratocontabilidad.activo IS 'Guarda 1 cuando está activo y el valor 0 cuando está inactivo.';
COMMENT ON COLUMN dat_contratocontabilidad.idestructuracomun IS 'Identificador de la estructura.';
CREATE SEQUENCE sec_contratogestordocumental_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_contratogestordocumental (
    idcontratogestordocumental numeric(19,0) DEFAULT nextval('sec_contratogestordocumental_seq'::regclass) NOT NULL,
    denominacion character varying(255),
    idespaciotrabajo character varying(255),
    activo numeric(1,0) DEFAULT 0,
    idestructuracomun numeric(19,0),
    organizacion json DEFAULT '[]'::json
);
COMMENT ON TABLE dat_contratogestordocumental IS 'Guarda el contrato de gestor docuemntal.';
COMMENT ON COLUMN dat_contratogestordocumental.idcontratogestordocumental IS 'Identificador de contrato de gestión empresarial.';
COMMENT ON COLUMN dat_contratogestordocumental.denominacion IS 'Guarda la denominación del contrato de gestor documental.';
COMMENT ON COLUMN dat_contratogestordocumental.idespaciotrabajo IS 'Identificador del espacio de trabajo.';
COMMENT ON COLUMN dat_contratogestordocumental.activo IS 'Guarda los valores de 0 y 1. El valor 0 es que no está activo y el valor 1 indica que está activo.';
COMMENT ON COLUMN dat_contratogestordocumental.idestructuracomun IS 'Identificador de estructura común.';
COMMENT ON COLUMN dat_contratogestordocumental.organizacion IS 'Guarda la organización.';
CREATE SEQUENCE sec_contratoplanificacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_contratoplanificacion (
    idcontratoplanificacion numeric(19,0) DEFAULT nextval('sec_contratoplanificacion_seq'::regclass) NOT NULL,
    activo numeric(1,0) DEFAULT 0,
    idestructuracomun numeric(19,0)
);
COMMENT ON TABLE dat_contratoplanificacion IS 'Guarda la configuración de la planificación de los contratos.';
COMMENT ON COLUMN dat_contratoplanificacion.idcontratoplanificacion IS 'Identificador de la planificación del contrato.';
COMMENT ON COLUMN dat_contratoplanificacion.activo IS 'Guarda 1 cuando está activo y el valor 0 cuando está inactivo.';
COMMENT ON COLUMN dat_contratoplanificacion.idestructuracomun IS 'Identificador de la estructura.';
CREATE SEQUENCE sec_moduloreporte_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_moduloreporte (
    idmodulo numeric(3,0) DEFAULT nextval('sec_moduloreporte_seq'::regclass) NOT NULL,
    identificador character varying(50) NOT NULL,
    denominacion character varying(150) NOT NULL
);
COMMENT ON TABLE dat_moduloreporte IS 'Guarda los módulos de reporte.';
COMMENT ON COLUMN dat_moduloreporte.idmodulo IS 'Identificador del módulo.';
COMMENT ON COLUMN dat_moduloreporte.identificador IS 'Guarda el identificador.';
COMMENT ON COLUMN dat_moduloreporte.denominacion IS 'Guarda la denominación del módulo de reporte.';
CREATE SEQUENCE sec_plantilla_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_plantilla (
    idplantilla numeric(10,0) DEFAULT nextval('sec_plantilla_seq'::regclass) NOT NULL,
    denominacion character varying(100) NOT NULL,
    identidad numeric(19,0) NOT NULL
);
COMMENT ON TABLE dat_plantilla IS 'Guarda la plantilla.';
COMMENT ON COLUMN dat_plantilla.idplantilla IS 'Identificador de la plantilla.';
COMMENT ON COLUMN dat_plantilla.denominacion IS 'Guarda la denominación.';
COMMENT ON COLUMN dat_plantilla.identidad IS 'Guarda la identidad.';
CREATE SEQUENCE sec_plantillaestructura_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_plantillaestructura (
    idestructura numeric(19,0) DEFAULT nextval('sec_plantillaestructura_seq'::regclass) NOT NULL,
    region character varying(1) NOT NULL,
    posicion character varying(1) NOT NULL,
    tipo numeric(1,0) NOT NULL,
    texto text,
    img bytea,
    idplantilla numeric(10,0) NOT NULL
);
COMMENT ON TABLE dat_plantillaestructura IS 'Guarda la plantilla estructura.';
COMMENT ON COLUMN dat_plantillaestructura.idestructura IS 'Identificador de la estructura común.';
COMMENT ON COLUMN dat_plantillaestructura.region IS 'Guarda la región.';
COMMENT ON COLUMN dat_plantillaestructura.posicion IS 'Guarda la posición.';
COMMENT ON COLUMN dat_plantillaestructura.tipo IS 'Guarda el tipo de la plantilla. Guarda el valor 1 que es texto y el valor 2 es la imagen.';
COMMENT ON COLUMN dat_plantillaestructura.texto IS 'Guarda el texto.';
COMMENT ON COLUMN dat_plantillaestructura.img IS 'Guarda la imagen.';
COMMENT ON COLUMN dat_plantillaestructura.idplantilla IS 'Identificador de la plantilla.';
CREATE SEQUENCE sec_reporte_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_reporte (
    idreporte numeric(19,0) DEFAULT nextval('sec_reporte_seq'::regclass) NOT NULL,
    idpadre numeric(19,0) NOT NULL,
    denominacion character varying(150) NOT NULL,
    agrupador numeric(1,0) NOT NULL,
    tipocontenido numeric(1,0),
    recurso character varying(100),
    url character varying(150),
    nombrecomponente character varying(100),
    idmodulo numeric(3,0) NOT NULL
);
COMMENT ON TABLE dat_reporte IS 'Guarda el reporte.';
COMMENT ON COLUMN dat_reporte.idreporte IS 'Identificador del reporte.';
COMMENT ON COLUMN dat_reporte.idpadre IS 'Identificador del padre.';
COMMENT ON COLUMN dat_reporte.denominacion IS 'Guarda la denominación.';
COMMENT ON COLUMN dat_reporte.agrupador IS 'Guarda el agrupador.';
COMMENT ON COLUMN dat_reporte.tipocontenido IS 'Guarda el tipo de contenido.';
COMMENT ON COLUMN dat_reporte.recurso IS 'Guarda el recurso.';
COMMENT ON COLUMN dat_reporte.url IS 'Guarda el url.';
COMMENT ON COLUMN dat_reporte.nombrecomponente IS 'Guarda el nombre del componente.';
COMMENT ON COLUMN dat_reporte.idmodulo IS 'Identificador de módulos.';
CREATE SEQUENCE sec_reportefiltro_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_reportefiltro (
    idfiltro numeric(19,0) DEFAULT nextval('sec_reportefiltro_seq'::regclass) NOT NULL,
    denominacion character varying(100) NOT NULL,
    orden numeric(2,0) NOT NULL,
    anchocolumna numeric(4,0) NOT NULL,
    nombreparametro character varying(50) NOT NULL,
    tipo numeric(1,0) NOT NULL,
    javatype character varying(50) NOT NULL,
    idreporte numeric(19,0) NOT NULL
);
COMMENT ON TABLE dat_reportefiltro IS 'Guarda el reporte filtro.';
COMMENT ON COLUMN dat_reportefiltro.idfiltro IS 'Identificador del filtro.';
COMMENT ON COLUMN dat_reportefiltro.denominacion IS 'Guarda la denominación.';
COMMENT ON COLUMN dat_reportefiltro.orden IS 'Guarda el orden que se muestran los filtros.';
COMMENT ON COLUMN dat_reportefiltro.anchocolumna IS 'Guarda el ancho de columna.';
COMMENT ON COLUMN dat_reportefiltro.nombreparametro IS 'Guarda el nombre del parámetro.';
COMMENT ON COLUMN dat_reportefiltro.tipo IS 'Guarda el tipo de reporte.';
COMMENT ON COLUMN dat_reportefiltro.javatype IS 'Guarda el tipo de datos que se utiliza  en el Jasper.';
COMMENT ON COLUMN dat_reportefiltro.idreporte IS 'Guarda el identificador del reporte.';
CREATE TABLE dat_reportefiltronomenclador (
    idfiltro numeric(19,0) NOT NULL,
    nomidentificador character varying(100) NOT NULL,
    nomdenominacion character varying(100) NOT NULL,
    tipofuentedatos numeric(1,0) NOT NULL,
    sentenciasql character varying(255),
    nomservicio character varying(255),
    multipleseleccion numeric(1,0) DEFAULT 0,
    paginado numeric(1,0) DEFAULT 0
);
COMMENT ON TABLE dat_reportefiltronomenclador IS 'Guarda el reporte del filtro nomenclador.';
COMMENT ON COLUMN dat_reportefiltronomenclador.idfiltro IS 'Identificador del filtro.';
COMMENT ON COLUMN dat_reportefiltronomenclador.nomidentificador IS 'Guarda el nombre del identificador.';
COMMENT ON COLUMN dat_reportefiltronomenclador.nomdenominacion IS 'Guarda el nombre de la denominación.';
COMMENT ON COLUMN dat_reportefiltronomenclador.tipofuentedatos IS 'Guarda el tipo de fuente de datos.  Si es valor 0 guarda una sentencia sql, y si es valor 1 guarda la decalración del servicio.';
COMMENT ON COLUMN dat_reportefiltronomenclador.sentenciasql IS 'Guarda las sentencias sql.';
COMMENT ON COLUMN dat_reportefiltronomenclador.nomservicio IS 'Guarda el nombre de servicio.';
CREATE TABLE dat_reportefiltronumerico (
    idfiltro numeric(19,0) NOT NULL,
    valorminimo numeric(10,0),
    valormaximo numeric(10,0) NOT NULL
);
COMMENT ON TABLE dat_reportefiltronumerico IS 'Guarda el reporte del filtro numérico.';
COMMENT ON COLUMN dat_reportefiltronumerico.idfiltro IS 'Identificador del filtro.';
COMMENT ON COLUMN dat_reportefiltronumerico.valorminimo IS 'Guarda el valor mínimo.';
COMMENT ON COLUMN dat_reportefiltronumerico.valormaximo IS 'Guarda el valor máximo.';
CREATE TABLE dat_reportefiltrotexto (
    idfiltro numeric(19,0) NOT NULL,
    longitudminima numeric(3,0),
    longitudmaxima numeric(3,0) NOT NULL
);
COMMENT ON TABLE dat_reportefiltrotexto IS 'Guarda el reporte del filtro de texto.';
COMMENT ON COLUMN dat_reportefiltrotexto.idfiltro IS 'Identificador del filtro.';
COMMENT ON COLUMN dat_reportefiltrotexto.longitudminima IS 'Guarda la longitud mínima.';
COMMENT ON COLUMN dat_reportefiltrotexto.longitudmaxima IS 'Guarda la longitud máxima.';
CREATE SEQUENCE sec_solicitudpagogestordocumental_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_solicitudpagogestordocumental (
    idsolicitudpagogestordocumental numeric(19,0) DEFAULT nextval('sec_solicitudpagogestordocumental_seq'::regclass) NOT NULL,
    denominacion character varying(255),
    idespaciotrabajo character varying(255),
    activo numeric(1,0) DEFAULT 0,
    idestructuracomun numeric(19,0),
    organizacion json DEFAULT '[]'::json
);
COMMENT ON TABLE dat_solicitudpagogestordocumental IS 'Guarda la configuracion para la solicitud de pago del gestor docuemntal.';
COMMENT ON COLUMN dat_solicitudpagogestordocumental.idsolicitudpagogestordocumental IS 'Identificador de contrato de gestión empresarial.';
COMMENT ON COLUMN dat_solicitudpagogestordocumental.denominacion IS 'Guarda la denominación del contrato de gestor documental.';
COMMENT ON COLUMN dat_solicitudpagogestordocumental.idespaciotrabajo IS 'Identificador del espacio de trabajo.';
COMMENT ON COLUMN dat_solicitudpagogestordocumental.activo IS 'Guarda los valores de 0 y 1. El valor 0 es que no está activo y el valor 1 indica que está activo.';
COMMENT ON COLUMN dat_solicitudpagogestordocumental.idestructuracomun IS 'Identificador de estructura común.';
COMMENT ON COLUMN dat_solicitudpagogestordocumental.organizacion IS 'Guarda la organización.';
CREATE SEQUENCE sec_accesodirecto_seq
    START WITH 2
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
SET search_path = mod_crmclienteproveedor, pg_catalog;
CREATE TABLE dat_cuestionariopregunta (
    idcuestionario numeric(19,0) NOT NULL,
    idpregunta numeric(19,0) NOT NULL
);
COMMENT ON TABLE dat_cuestionariopregunta IS 'Guarda los datos de cuestionario pregunta.';
COMMENT ON COLUMN dat_cuestionariopregunta.idcuestionario IS 'Identificador del cuestionario.';
COMMENT ON COLUMN dat_cuestionariopregunta.idpregunta IS 'Identificador de pregunta.';
CREATE SEQUENCE sec_facultad_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_facultad (
    idfacultad numeric(19,0) DEFAULT nextval('sec_facultad_seq'::regclass) NOT NULL,
    idtipofacultad numeric(19,0),
    idcontacto numeric(19,0)
);
COMMENT ON TABLE dat_facultad IS 'Guarda las facuoltades de un contacto.';
COMMENT ON COLUMN dat_facultad.idfacultad IS 'Identificador de las facultades.
';
COMMENT ON COLUMN dat_facultad.idtipofacultad IS 'Identificador del tipo de facultad.';
COMMENT ON COLUMN dat_facultad.idcontacto IS 'Identificador del contacto.';
CREATE SEQUENCE sec_identificador_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_identificador (
    ididentificador numeric(19,0) DEFAULT nextval('sec_identificador_seq'::regclass) NOT NULL,
    idtipocodigo numeric(19,0),
    denominacion character varying(255),
    idclienteproveedor numeric(19,0)
);
COMMENT ON TABLE dat_identificador IS 'Guarda los identificadores de un cliente y/o proveedor.';
COMMENT ON COLUMN dat_identificador.ididentificador IS 'Guarda el identificador.';
COMMENT ON COLUMN dat_identificador.idtipocodigo IS 'Identificador del tipo código.';
COMMENT ON COLUMN dat_identificador.denominacion IS 'Guarda la denominación del identificador.';
COMMENT ON COLUMN dat_identificador.idclienteproveedor IS 'Identificador de cliente y/o proveedor.';
CREATE TABLE dat_perfilcliente (
    idclienteproveedor numeric(19,0) NOT NULL,
    idcuestionario numeric(19,0) NOT NULL,
    idpregunta numeric(19,0) NOT NULL,
    idrespuesta numeric(19,0) NOT NULL
);
COMMENT ON COLUMN dat_perfilcliente.idclienteproveedor IS 'Ientificador de cliente y proveedor.';
COMMENT ON COLUMN dat_perfilcliente.idcuestionario IS 'Identificador de cuestionario.';
COMMENT ON COLUMN dat_perfilcliente.idpregunta IS 'Identificador de pregunta.';
COMMENT ON COLUMN dat_perfilcliente.idrespuesta IS 'Identificador de respuesta.';
CREATE SEQUENCE sec_cuestionario_seq
    START WITH 6
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999
    CACHE 1;
CREATE TABLE nom_cuestionario (
    nombre character varying(255) NOT NULL,
    idcuestionario numeric(19,0) DEFAULT nextval('sec_cuestionario_seq'::regclass) NOT NULL,
    descripcion character varying(255),
    segmentacion character varying(255)
);
COMMENT ON TABLE nom_cuestionario IS 'Guarda el cuestionario.';
COMMENT ON COLUMN nom_cuestionario.nombre IS 'Guarda el nombre del cuestionario.';
COMMENT ON COLUMN nom_cuestionario.idcuestionario IS 'Identificador de la tabla.';
COMMENT ON COLUMN nom_cuestionario.descripcion IS 'Guarda la descripción.';
COMMENT ON COLUMN nom_cuestionario.segmentacion IS 'Guarda la segmentación.';
CREATE SEQUENCE sec_organismo_seq
    START WITH 67
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE nom_organismo (
    idorganismo numeric(19,0) DEFAULT nextval('sec_organismo_seq'::regclass) NOT NULL,
    codigo character varying(15),
    nombre character varying(255)
);
COMMENT ON COLUMN nom_organismo.idorganismo IS 'Identificador del organismo.';
COMMENT ON COLUMN nom_organismo.codigo IS 'Guarda el código del organismo.';
COMMENT ON COLUMN nom_organismo.nombre IS 'Guarda el nombre del organismo.';
CREATE SEQUENCE sec_pregunta_seq
    START WITH 12
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999
    CACHE 1;
CREATE TABLE nom_pregunta (
    idpregunta numeric(19,0) DEFAULT nextval('sec_pregunta_seq'::regclass) NOT NULL,
    pregunta character varying(255) NOT NULL,
    descripcion character varying(255),
    idtiporespuesta numeric(19,0)
);
COMMENT ON TABLE nom_pregunta IS 'Guarda la pregunta.';
COMMENT ON COLUMN nom_pregunta.idpregunta IS 'Identificador de la tabla.';
COMMENT ON COLUMN nom_pregunta.pregunta IS 'Guarda la pregunta.';
COMMENT ON COLUMN nom_pregunta.descripcion IS 'Guarda la descripcón.';
COMMENT ON COLUMN nom_pregunta.idtiporespuesta IS 'Identificador del tipo de respuesta.';
CREATE SEQUENCE sec_respuesta_seq
    START WITH 13
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999
    CACHE 1;
CREATE TABLE nom_respuesta (
    idrespuesta numeric(19,0) DEFAULT nextval('sec_respuesta_seq'::regclass) NOT NULL,
    respuesta character varying(255) NOT NULL,
    descripcion character varying(255),
    idtiporespuesta numeric(19,0)
);
COMMENT ON TABLE nom_respuesta IS 'Guarda la respuesta.';
COMMENT ON COLUMN nom_respuesta.idrespuesta IS 'Identificador de la tabla.';
COMMENT ON COLUMN nom_respuesta.respuesta IS 'Guarda la respuesta.';
COMMENT ON COLUMN nom_respuesta.descripcion IS 'Guarda la descripción.';
COMMENT ON COLUMN nom_respuesta.idtiporespuesta IS 'Identificador del tipo de respuesta.';
CREATE SEQUENCE sec_tipocodigo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE nom_tipocodigo (
    idtipocodigo numeric(19,0) DEFAULT nextval('sec_tipocodigo_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    validacion character varying(255)
);
COMMENT ON TABLE nom_tipocodigo IS 'Guarda el tipo de código. Ya sea SENTAI; REUP:';
COMMENT ON COLUMN nom_tipocodigo.idtipocodigo IS 'Identificador del tipo de código.';
COMMENT ON COLUMN nom_tipocodigo.denominacion IS 'Guarda la denominación del tipo de código.';
COMMENT ON COLUMN nom_tipocodigo.validacion IS 'Guarda la validación de cada código.';
CREATE SEQUENCE sec_tipofacultad_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE nom_tipofacultad (
    idtipofacultad numeric(19,0) DEFAULT nextval('sec_tipofacultad_seq'::regclass) NOT NULL,
    denominacion character varying(255)
);
COMMENT ON TABLE nom_tipofacultad IS 'Guarda el tipo de facultad que tiene el contacto.';
COMMENT ON COLUMN nom_tipofacultad.idtipofacultad IS 'Identificador del tipo de facultad.
';
COMMENT ON COLUMN nom_tipofacultad.denominacion IS 'Guarda la denominación.';
CREATE SEQUENCE sec_tiporespuesta_seq
    START WITH 2
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999
    CACHE 1;
CREATE TABLE nom_tiporespuesta (
    idtiporespuesta numeric(19,0) DEFAULT nextval('sec_tiporespuesta_seq'::regclass) NOT NULL,
    tiporespuesta character varying(255) NOT NULL,
    descripcion character varying(255)
);
COMMENT ON TABLE nom_tiporespuesta IS 'Guarda el tipo de respuesta.';
COMMENT ON COLUMN nom_tiporespuesta.idtiporespuesta IS 'Identificador del la tabla.';
COMMENT ON COLUMN nom_tiporespuesta.tiporespuesta IS 'Guarda el tipo de respuesta.';
COMMENT ON COLUMN nom_tiporespuesta.descripcion IS 'Guarda la descripción.';
SET search_path = mod_crmcontratacion, pg_catalog;
CREATE SEQUENCE sec_contratoexpiracionvigencia_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE conf_contratoexpiracionvigencia (
    idcontratoexpiracionvigencia numeric(19,0) DEFAULT nextval('sec_contratoexpiracionvigencia_seq'::regclass) NOT NULL,
    colorprecaucion character varying(10),
    colorexpirado character varying(10),
    identidad numeric(19,0),
    diasvencimiento numeric(4,0)
);
COMMENT ON TABLE conf_contratoexpiracionvigencia IS 'Guarda la vigencia del contrato.';
COMMENT ON COLUMN conf_contratoexpiracionvigencia.idcontratoexpiracionvigencia IS 'Identificador de la tabla.';
COMMENT ON COLUMN conf_contratoexpiracionvigencia.colorprecaucion IS 'Guarda el color cuando está por expirar la vigencia.';
COMMENT ON COLUMN conf_contratoexpiracionvigencia.colorexpirado IS 'Guarda el color que se usa cuando la vigencia de un contrato halla caducado.';
COMMENT ON COLUMN conf_contratoexpiracionvigencia.identidad IS 'Guarda el identificador de la identidad que usa esa configuración de colores.';
COMMENT ON COLUMN conf_contratoexpiracionvigencia.diasvencimiento IS 'Guarda la cantidad de días que se desee que empiece avisar de la caducidad de la vigencia.';
CREATE SEQUENCE sec_elementotipocontrato_seq
    START WITH 10
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999
    CACHE 1;
CREATE TABLE conf_elementotipocontrato (
    idelemento numeric(19,0) DEFAULT nextval('sec_elementotipocontrato_seq'::regclass) NOT NULL,
    elemento json
);
COMMENT ON TABLE conf_elementotipocontrato IS 'Guarda la configuración de los elementos del tipo de contrato.
[{
    "idelemento": (se genera con la secuencia ''sec_elementocontrato_seq''),
    "denominacion": "",
    "tipo": (los tipos son "widget" ó "container"),
    "humanlabel": (campo equivalente al nombre del componente Extjs seleccionado),
    "namecomponent": (nombre físico del componente al cual se hace referencia),
    "mextype": (xtype del componente),
    "fuente":
        (json fuente de datos)
            {
                "clase": (nombre de la clase entidad ORM),
                "idsselection": (arreglo de ids de elmentos seleccionado),
                "campowhere": (campo que idtentifica la selección),
                "campo": (campo al cual va dirigida la selección),
                "tablename": (referencia a la tabla, ''esquema''.''tabla''),
                "ruta": (ruta física de la clase)
            },
    "descripcion": "",
    "idpadre": "",
    "leaf": (nodo hoja true || false),
    "cfg":
        (json que guarda la personalización del componente)
            {"nombre de la propiedad": "valor", ...},
    "depth": (profundidad),
    "index": (orden),
    "event": 
        (json que guarda la personalización del componente)
            {"nombre del evento": "función que implementa", ...},
    "compartimentacion": 
            (arreglo de json, permite la visivilidad del componente a roles de usuarios)
            [{"idrol": "", "denominacion": "", "visibilidad": true || false}],
    "obligatorio": true || false
}, ...]';
COMMENT ON COLUMN conf_elementotipocontrato.idelemento IS 'Identificador del elemento.
';
COMMENT ON COLUMN conf_elementotipocontrato.elemento IS 'Guarda los elementos del tipo de contrato.
[{
    "idelemento": (se genera con la secuencia ''sec_elementocontrato_seq''),
    "denominacion": (guarda la denominación del elemento del tipo de contrato),
    "tipo": (los tipos son "widget" ó "container"),
    "humanlabel": (campo equivalente al nombre del componente Extjs seleccionado),
    "namecomponent": (nombre físico del componente al cual se hace referencia),
    "mextype": (xtype del componente),
    "fuente":
        (json fuente de datos)
            {
                "clase": (nombre de la clase entidad ORM),
                "idsselection": (arreglo de ids de elmentos seleccionado),
                "campowhere": (campo que identifica la selección),
                "campo": (campo al cual va dirigida la selección),
                "tablename": (referencia a la tabla, ''esquema''.''tabla''),
                "ruta": (ruta física de la clase)
            },
    "descripcion": (guiarda ),
    "idpadre": (identificador del padre),
    "leaf": (nodo hoja true || false),
    "cfg":
        (json que guarda la personalización del componente)
            {"nombre de la propiedad": "valor", ...},
    "depth": (profundidad),
    "index": (orden),
    "event": 
        (json que guarda la personalización del componente)
            {"nombre del evento": "función que implementa", ...},
    "compartimentacion": 
            (arreglo de json, permite la visivilidad del componente a roles de usuarios)
            [{"idrol": "", "denominacion": "", "visibilidad": true || false}],
    "obligatorio": true || false
}, ...]';
CREATE SEQUENCE sec_entidadformatonumcontrato_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE conf_entidadformatonumcontrato (
    identidadformatonumcontrato numeric(19,0) DEFAULT nextval('sec_entidadformatonumcontrato_seq'::regclass) NOT NULL,
    identidad numeric(19,0) NOT NULL,
    idformatonumcontrato numeric(10,0) NOT NULL,
    contratodestino numeric(1,0) DEFAULT 1
);
COMMENT ON TABLE conf_entidadformatonumcontrato IS 'Configuración del formato número de contrato de la entidad.';
COMMENT ON COLUMN conf_entidadformatonumcontrato.identidadformatonumcontrato IS 'Identificador del formato número de la entidad.';
COMMENT ON COLUMN conf_entidadformatonumcontrato.identidad IS 'Identificador de la entidad.';
COMMENT ON COLUMN conf_entidadformatonumcontrato.idformatonumcontrato IS 'Identificador del formato número de contrato.';
COMMENT ON COLUMN conf_entidadformatonumcontrato.contratodestino IS 'Identifica si el formato se aplica para los contratos con clientes(2), proveedores(3) o para ambos(1)';
CREATE SEQUENCE sec_entidadformatonumcontratoincremento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE conf_entidadformatonumcontratoincremento (
    identidadformatonumcontratoincremento numeric(19,0) DEFAULT nextval('sec_entidadformatonumcontratoincremento_seq'::regclass) NOT NULL,
    valorinicial numeric(19,0),
    valor numeric(19,0) NOT NULL,
    idformatonumcontratoelemento numeric(10,0),
    identidadformatonumcontrato numeric(19,0)
);
COMMENT ON TABLE conf_entidadformatonumcontratoincremento IS 'Configuración del formato número del contrato de la entidad';
COMMENT ON COLUMN conf_entidadformatonumcontratoincremento.identidadformatonumcontratoincremento IS 'Identificador del formato número de contrato.';
COMMENT ON COLUMN conf_entidadformatonumcontratoincremento.valorinicial IS 'Guarda el valor inicial.';
COMMENT ON COLUMN conf_entidadformatonumcontratoincremento.valor IS 'Guarda el valor.';
COMMENT ON COLUMN conf_entidadformatonumcontratoincremento.idformatonumcontratoelemento IS 'Identificador de formato del contrato elemento.';
COMMENT ON COLUMN conf_entidadformatonumcontratoincremento.identidadformatonumcontrato IS 'Identificador del formato número de contrato.';
CREATE SEQUENCE sec_anexo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_anexo (
    idanexo numeric(19,0) DEFAULT nextval('sec_anexo_seq'::regclass) NOT NULL,
    idexterno numeric(19,0),
    contenido bytea,
    nombre character varying(255) NOT NULL,
    tipoarchivo character varying(255),
    categoria numeric(1,0)
);
COMMENT ON TABLE dat_anexo IS 'Guarda el documento del contrato.';
COMMENT ON COLUMN dat_anexo.idanexo IS 'Identificador de la tabla.';
COMMENT ON COLUMN dat_anexo.idexterno IS 'Identificador del contrato.';
COMMENT ON COLUMN dat_anexo.categoria IS 'Identifica si el documento pertenece a solicitud(1),oferta(2),contrato(3),dictamensolicitud(4),dictamenoferta(5),dictamencontrato(6),solicitudpago(7)';
CREATE SEQUENCE sec_area_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_area (
    idarea numeric(19,0) DEFAULT nextval('sec_area_seq'::regclass) NOT NULL,
    idestructura numeric(19,0)
);
CREATE SEQUENCE sec_contrato_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999
    CACHE 1;
CREATE TABLE dat_contrato (
    idcontrato numeric(19,0) DEFAULT nextval('sec_contrato_seq'::regclass) NOT NULL,
    numero character varying(255) NOT NULL,
    idclienteproveedor numeric(19,0) NOT NULL,
    idtipocontrato numeric(19,0) NOT NULL,
    nombre character varying(255) NOT NULL,
    fechafirma date,
    idpadre numeric(19,0),
    elemento json,
    idestructuracomun numeric(19,0) NOT NULL,
    montototal numeric(24,2) DEFAULT 0,
    denominaciontipocontrato character varying(255),
    denominacionclienteproveedor character varying(255),
    proforma character varying(255),
    objeto text,
    descripcion text,
    idproforma numeric(19,0),
    contratomarco numeric(1,0),
    cliente numeric(1,0),
    idcontratomarco numeric(19,0),
    fechainicio date,
    fechafin date,
    idestado numeric(19,0),
    idmediopago numeric(19,0),
    registropago json,
    version numeric(19,0) DEFAULT 0,
    idsector numeric(19,0),
    numerojson json,
    vigencia numeric(3,0),
    unidadtiempo numeric(1,0),
    idresponsable numeric(19,0),
    idcondicionpago numeric(19,0),
    fechaestado date,
    fechamodificacion date,
    idarea numeric(19,0),
    numerocontrato character varying(255),
    idespaciotrabajo character varying(255) DEFAULT ''::character varying,
    cumplimientoobligaciones numeric(1,0) DEFAULT 0,
    objetosuplemento text,
    idcategoria numeric(19,0),
    iddocumentocontratooriginal character varying,
    nombrepersona character varying(255),
    idpadreviejo numeric(19,0),
    idhijoviejo numeric(19,0)
);
COMMENT ON TABLE dat_contrato IS 'Guarda los valores del contrato.';
COMMENT ON COLUMN dat_contrato.idcontrato IS 'Identificador del contrato.';
COMMENT ON COLUMN dat_contrato.numero IS 'Número del contrato que genera la entidad (Con el formato establecido en la entidad).';
COMMENT ON COLUMN dat_contrato.idclienteproveedor IS 'Identificador de cliente proveedor.';
COMMENT ON COLUMN dat_contrato.idtipocontrato IS 'Identificador del tipo de contrato.';
COMMENT ON COLUMN dat_contrato.nombre IS 'Nombre del elemento del contrato.';
COMMENT ON COLUMN dat_contrato.fechafirma IS 'Guarda la fecha firma del contrato.';
COMMENT ON COLUMN dat_contrato.idpadre IS 'Identificador del padre.';
COMMENT ON COLUMN dat_contrato.elemento IS 'Guarda los elementos del contrato.
 [{
    "title": (título de la sección, "De una parte"),
    "xtype": (xtype del componente),
    "tipo": (identifica la sección del contrato, "deUnaParte"),
    "items": [
    {
            "denominacion": (denominación del elemento),
            "xtype": (xtype del componente),
            "obligatorio": "true" || "false",
            "tipo": (los tipos son "widget" ó "container"),
            "value": (valor asignado),
            "rawValue": (valor a mostrar),
            "idelemento": (identificador del elemeneto),
            "fuente":
                (json fuente de datos)
                {
                    "clase": (nombre de la clase entidad ORM),
                    "idsselection": (arreglo de ids de elmentos seleccionado),
                    "campowhere": (campo que idtentifica la selección),
                    "campo": (campo al cual va dirigida la selección),
                    "tablename": (referencia a la tabla, ''esquema''.''tabla''),
                    "ruta": (ruta física de la clase)
                },
            "compartimentacion":
                (arreglo de json, permite la visivilidad del componente a roles de usuarios)
                [{"idrol": "", "denominacion": "", "visibilidad": true || false}],
            "cfg":
                (json que guarda la personalización del componente)
                {"nombre de la propiedad": "valor", ...},
            "event":
                (json que guarda la personalización del componente)
                {"nombre del evento": "función que implementa", ...}
        },...],
    "htmlvalue": (contiene la escritura de la sección de conjunto con las variables declaradas en la configuración)
}, {
    "title": (título de la sección, "De otra parte"),
    "xtype": (xtype del componente),
    "tipo": (identifica la sección del contrato, "deOtraParte"),
    "items": [
        {
            "denominacion": (denominación del elemento),
            "xtype": (xtype del componente),
            "obligatorio": "true" || "false",
            "tipo": (los tipos son "widget" ó "container"),
            "value": (valor asignado),
            "rawValue": (valor a mostrar),
            "idelemento": (identificador del elemeneto),
            "fuente":
                (json fuente de datos)
                {
                    "clase": (nombre de la clase entidad ORM),
                    "idsselection": (arreglo de ids de elmentos seleccionado),
                    "campowhere": (campo que idtentifica la selección),
                    "campo": (campo al cual va dirigida la selección),
                    "tablename": (referencia a la tabla, ''esquema''.''tabla''),
                    "ruta": (ruta física de la clase)
                },
            "compartimentacion":
                (arreglo de json, permite la visivilidad del componente a roles de usuarios)
                [{"idrol": "", "denominacion": "", "visibilidad": true || false}],
            "cfg":
                (json que guarda la personalización del componente)
                {"nombre de la propiedad": "valor", ...},
            "event":
                (json que guarda la personalización del componente)
                {"nombre del evento": "función que implementa", ...}
        }, ...],
    "htmlvalue": (contiene la escritura de la sección de conjunto con las variables declaradas en la configuración)
}, {
    "title": (título de la sección, "Ambas partes"),
    "xtype": (xtype del componente),
    "tipo": (identifica la sección del contrato, "ambasPartes"),
    "items": [
        {
            "denominacion": (denominación del elemento),
            "xtype": (xtype del componente),
            "obligatorio": "true" || "false",
            "tipo": (los tipos son "widget" ó "container"),
            "value": (valor asignado),
            "rawValue": (valor a mostrar),
            "idelemento": (identificador del elemeneto),
            "fuente":
                (json fuente de datos)
                {
                    "clase": (nombre de la clase entidad ORM),
                    "idsselection": (arreglo de ids de elmentos seleccionado),
                    "campowhere": (campo que idtentifica la selección),
                    "campo": (campo al cual va dirigida la selección),
                    "tablename": (referencia a la tabla, ''esquema''.''tabla''),
                    "ruta": (ruta física de la clase)
                },
            "compartimentacion":
                (arreglo de json, permite la visivilidad del componente a roles de usuarios)
                [{"idrol": "", "denominacion": "", "visibilidad": true || false}],
            "cfg":
                (json que guarda la personalización del componente)
                {"nombre de la propiedad": "valor", ...},
            "event":
                (json que guarda la personalización del componente)
                {"nombre del evento": "función que implementa", ...}
        }, ...],
    "htmlvalue": (contiene la escritura de la sección de conjunto con las variables declaradas en la configuración)
}, {
    "title": (título de la sección, "Cl\u00e1usula"),
    "xtype": (xtype del componente),
    "clausula": (identifica la sección de cláusula, true),
    "items": [
        {
            "title": (título de la cláusula),
            "xtype": (xtype del componente),
            "items": [
                {
                    "denominacion": (denominación del elemento),
                    "xtype": (xtype del componente),
                    "obligatorio": "true" || "false",
                    "tipo": (los tipos son "widget" ó "container"),
                    "value": (valor asignado),
                    "rawValue": (valor a mostrar),
                    "idelemento": (identificador del elemeneto),
                    "fuente":
                        (json fuente de datos)
                        {
                            "clase": (nombre de la clase entidad ORM),
                            "idsselection": (arreglo de ids de elmentos seleccionado),
                            "campowhere": (campo que idtentifica la selección),
                            "campo": (campo al cual va dirigida la selección),
                            "tablename": (referencia a la tabla, ''esquema''.''tabla''),
                            "ruta": (ruta física de la clase)
                        },
                    "compartimentacion":
                        (arreglo de json, permite la visivilidad del componente a roles de usuarios)
                        [{"idrol": "", "denominacion": "", "visibilidad": true || false}],
                    "cfg":
                        (json que guarda la personalización del componente)
                        {"nombre de la propiedad": "valor", ...},
                    "event":
                        (json que guarda la personalización del componente)
                        {"nombre del evento": "función que implementa", ...}
                }, ...],
            "htmlvalue": (contiene la escritura de la cláusula de conjunto con las variables declaradas en la configuración)
        }, ...]
},
{
    "title": (título de la sección, "Anexos"),
    "xtype": (xtype del componente),
    "tipo": (identifica la sección del contrato, "anexos"),
    "items": [
        {
            "denominacion": (denominación del elemento),
            "xtype": (xtype del componente),
            "obligatorio": "true" || "false",
            "tipo": (los tipos son "widget" ó "container"),
            "value": (valor asignado),
            "rawValue": (valor a mostrar),
            "idelemento": (identificador del elemeneto),
            "fuente":
                (json fuente de datos)
                {
                    "clase": (nombre de la clase entidad ORM),
                    "idsselection": (arreglo de ids de elmentos seleccionado),
                    "campowhere": (campo que idtentifica la selección),
                    "campo": (campo al cual va dirigida la selección),
                    "tablename": (referencia a la tabla, ''esquema''.''tabla''),
                    "ruta": (ruta física de la clase)
                },
            "compartimentacion":
                (arreglo de json, permite la visivilidad del componente a roles de usuarios)
                [{"idrol": "", "denominacion": "", "visibilidad": true || false}],
            "cfg":
                (json que guarda la personalización del componente)
                {"nombre de la propiedad": "valor", ...},
            "event":
                (json que guarda la personalización del componente)
                {"nombre del evento": "función que implementa", ...}
        }, ...],
    "htmlvalue": (contiene la escritura de la sección de conjunto con las variables declaradas en la configuración)
}]';
COMMENT ON COLUMN dat_contrato.idestructuracomun IS 'Identificador de la estructura.';
COMMENT ON COLUMN dat_contrato.montototal IS 'Guarda el monto total.';
COMMENT ON COLUMN dat_contrato.denominaciontipocontrato IS 'Guarda la denominación del tipo de contrato.';
COMMENT ON COLUMN dat_contrato.denominacionclienteproveedor IS 'Guarda la denominación del cliente proveedor.';
COMMENT ON COLUMN dat_contrato.proforma IS 'Guarda la denominación de la proforma.';
COMMENT ON COLUMN dat_contrato.objeto IS 'Guarda el objeto del contrato.';
COMMENT ON COLUMN dat_contrato.descripcion IS 'Guarda la descripción del contrato.';
COMMENT ON COLUMN dat_contrato.idproforma IS 'Identificador de la proforma.';
COMMENT ON COLUMN dat_contrato.contratomarco IS 'Guarda los valores 0 y 1. El valor 1 para contrato marco, y el valor cero para contrato.';
COMMENT ON COLUMN dat_contrato.cliente IS 'Guarda los valores 1 y 0. El valor 1 significa contrato con cliente y el valor cero con proveedor.';
COMMENT ON COLUMN dat_contrato.idcontratomarco IS 'Identificador del contrato marco.';
COMMENT ON COLUMN dat_contrato.fechainicio IS 'Guarda la fecha de inicio del contrato.';
COMMENT ON COLUMN dat_contrato.fechafin IS 'Guarda la fecha fin del contrato.';
COMMENT ON COLUMN dat_contrato.idestado IS 'Identificador del estado.';
COMMENT ON COLUMN dat_contrato.idmediopago IS 'Identificador de medio de pago.';
COMMENT ON COLUMN dat_contrato.registropago IS 'Guarda el registro de pago.';
COMMENT ON COLUMN dat_contrato.version IS 'Guarda la versión. Cada vez que se realice cambios sobre el contrato se guarda la cantidad de veces.';
COMMENT ON COLUMN dat_contrato.idsector IS 'Identificador del sector';
COMMENT ON COLUMN dat_contrato.numerojson IS 'Estructura del número de contrato en formato json.';
COMMENT ON COLUMN dat_contrato.vigencia IS 'Vigencia del contrato, representa la cantidad de meses o años de vigencia del contrato';
COMMENT ON COLUMN dat_contrato.unidadtiempo IS 'Representa la unidad de tiempo en la que se establece la vigencia del contrato, 1 es días, 2 es meses y 3 es años';
COMMENT ON COLUMN dat_contrato.idresponsable IS 'Identificador de la persona responsable del contrato';
COMMENT ON COLUMN dat_contrato.idcondicionpago IS 'Identificador de la condicion de pago del contrato';
COMMENT ON COLUMN dat_contrato.fechaestado IS 'Guarda la fecha de modificación del estado.';
COMMENT ON COLUMN dat_contrato.fechamodificacion IS 'Guarda la fecha de la modificación del contrato.';
COMMENT ON COLUMN dat_contrato.idarea IS 'Identificador del área.';
COMMENT ON COLUMN dat_contrato.numerocontrato IS 'Guarda el número del contrato. En el caso del proveedor es el formato que tienen establecido por la entidad que se tiene como proveedor. Cuando es cliente este número coincide con el número de contrato del cliente.';
COMMENT ON COLUMN dat_contrato.idespaciotrabajo IS 'Guarda el identificador del espacio de trabajo. Es generado por el gestor documental.';
COMMENT ON COLUMN dat_contrato.cumplimientoobligaciones IS '1 es al cumplimiento de las obligaciones y 0 no lo es.';
COMMENT ON COLUMN dat_contrato.objetosuplemento IS 'Guarda el objeto del suplemento.';
COMMENT ON COLUMN dat_contrato.idcategoria IS 'Identificador de la categoría.';
COMMENT ON COLUMN dat_contrato.iddocumentocontratooriginal IS 'Identificador del documento original del gestor documental. Es cuando se escanea un contrato se guarda con este id.';
CREATE SEQUENCE sec_contratoareaimplicada_seq
    START WITH 186
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_contratoareaimplicada (
    idarea numeric(19,0) DEFAULT nextval('sec_contratoareaimplicada_seq'::regclass) NOT NULL,
    idestructura numeric(19,0) NOT NULL,
    idcontrato numeric(19,0) NOT NULL
);
COMMENT ON TABLE dat_contratoareaimplicada IS 'Guarda el contrato del área implicada.';
COMMENT ON COLUMN dat_contratoareaimplicada.idarea IS 'Identificador del área.';
COMMENT ON COLUMN dat_contratoareaimplicada.idestructura IS 'Identificador de la estructura.';
COMMENT ON COLUMN dat_contratoareaimplicada.idcontrato IS 'Identificador del contrato.';
CREATE SEQUENCE sec_contratoestado_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_contratoestado (
    idcontratoestado numeric(19,0) DEFAULT nextval('sec_contratoestado_seq'::regclass) NOT NULL,
    idestado numeric(19,0) NOT NULL,
    idcontrato numeric(19,0) NOT NULL,
    fechainicio date NOT NULL,
    fechafin date,
    idusuario numeric(19,0) NOT NULL
);
CREATE SEQUENCE sec_dictamen_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_dictamen (
    iddictamen numeric(19,0) DEFAULT nextval('sec_dictamen_seq'::regclass) NOT NULL,
    idcontrato numeric(19,0),
    idestado numeric(19,0),
    idrol numeric(19,0),
    observacion text,
    documento text,
    idusuario numeric(19,0),
    activo numeric(1,0) DEFAULT 1,
    fecha date
);
COMMENT ON TABLE dat_dictamen IS 'Guarda el dictamen del contrato.';
COMMENT ON COLUMN dat_dictamen.iddictamen IS 'Identificador';
COMMENT ON COLUMN dat_dictamen.idcontrato IS 'Identificador del contrato.
';
COMMENT ON COLUMN dat_dictamen.idestado IS 'Identificador del estado';
COMMENT ON COLUMN dat_dictamen.idrol IS 'Identificador del rol.';
COMMENT ON COLUMN dat_dictamen.observacion IS 'Guarda ls observación emitida por el rol que aprueba o rechaza el contrato.';
COMMENT ON COLUMN dat_dictamen.documento IS 'Identificador del documento guardado en el gestor documental.';
COMMENT ON COLUMN dat_dictamen.idusuario IS 'Identificador del usuario.';
COMMENT ON COLUMN dat_dictamen.activo IS 'Guarda si está activo. El valor 1 es activo y el valor cero es inactivo.';
COMMENT ON COLUMN dat_dictamen.fecha IS 'Guarda la fecha del dictamen.';
CREATE SEQUENCE sec_facturamoneda_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_facturamoneda (
    idfacturamoneda numeric(19,0) DEFAULT nextval('sec_facturamoneda_seq'::regclass) NOT NULL,
    idfactura numeric(19,0),
    idmoneda numeric(19,0),
    valor numeric(19,2)
);
COMMENT ON TABLE dat_facturamoneda IS 'Guarda las monedas de la factura.';
COMMENT ON COLUMN dat_facturamoneda.idfacturamoneda IS 'Identificador de la factura.';
COMMENT ON COLUMN dat_facturamoneda.idfactura IS 'Identificador de la factura.';
COMMENT ON COLUMN dat_facturamoneda.idmoneda IS 'Identificador de la moneda. ';
COMMENT ON COLUMN dat_facturamoneda.valor IS 'Guarda el valor de la moneda. La cantidad.';
CREATE SEQUENCE sec_facturasolicitudpago_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_facturasolicitudpago (
    idfactura numeric(19,0) DEFAULT nextval('sec_facturasolicitudpago_seq'::regclass) NOT NULL,
    numero character varying(20),
    idsolicitudpago numeric(19,0),
    idespaciotrabajo character varying(255)
);
COMMENT ON TABLE dat_facturasolicitudpago IS 'Guarda la facturas de solicitud de pago.';
COMMENT ON COLUMN dat_facturasolicitudpago.idfactura IS 'Identificador de la factura.';
COMMENT ON COLUMN dat_facturasolicitudpago.numero IS 'Guarda el número de la factura.';
COMMENT ON COLUMN dat_facturasolicitudpago.idsolicitudpago IS 'Identificador de solicitud de pago.';
COMMENT ON COLUMN dat_facturasolicitudpago.idespaciotrabajo IS 'Identificador del espacio de trabajo.';
CREATE SEQUENCE sec_hito_seq
    START WITH 25
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_hito (
    idhito numeric(19,0) DEFAULT nextval('sec_hito_seq'::regclass) NOT NULL,
    descripcion text,
    vigencia numeric(3,0),
    unidadtiempo numeric(1,0),
    fechacreacion date,
    fechaestimada date,
    numero numeric(3,0),
    idcontrato numeric(19,0) NOT NULL,
    idarea numeric(19,0),
    fechareplanificada date,
    idespaciotrabajo character varying(255),
    idiguala numeric(19,0)
);
COMMENT ON TABLE dat_hito IS 'Guarda los datos de los hitos de pago.';
COMMENT ON COLUMN dat_hito.idhito IS 'Identificador del hito.';
COMMENT ON COLUMN dat_hito.descripcion IS 'Guarda la descripción del hito.
';
COMMENT ON COLUMN dat_hito.vigencia IS 'Guarda la vigencia del hito.';
COMMENT ON COLUMN dat_hito.unidadtiempo IS 'Guarda el tiempo. Si es día guarda valor 1. Si es semanas guarda el valor 2. Si es meses guarda valor 3.';
COMMENT ON COLUMN dat_hito.fechacreacion IS 'Guarda le fecha donde se crea el hito.';
COMMENT ON COLUMN dat_hito.fechaestimada IS 'Guarda la fecha estimada de realizar el hito.';
COMMENT ON COLUMN dat_hito.numero IS 'Guarda el orden del hito por un número ordenado.';
COMMENT ON COLUMN dat_hito.idcontrato IS 'Identificador de contrato de la tabla dat_contrato.';
COMMENT ON COLUMN dat_hito.idarea IS 'Identificador del área de la tabla mod_estructuracomp.dat.estructuraop.';
COMMENT ON COLUMN dat_hito.fechareplanificada IS 'Guarda la fecha replanificada.';
COMMENT ON COLUMN dat_hito.idespaciotrabajo IS 'Identificador del espacio de trabajo.';
COMMENT ON COLUMN dat_hito.idiguala IS 'Identificador de igualdad.';
CREATE SEQUENCE sec_hitoestado_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_hitoestado (
    idhitoestado numeric(19,0) DEFAULT nextval('sec_hitoestado_seq'::regclass) NOT NULL,
    idestado numeric(19,0) NOT NULL,
    idhito numeric(19,0) NOT NULL,
    fechainicio date NOT NULL,
    fechafin date,
    idusuario numeric(19,0) NOT NULL
);
COMMENT ON TABLE dat_hitoestado IS 'Guarda el estado de los hitos.';
COMMENT ON COLUMN dat_hitoestado.idhitoestado IS 'Identificador del hito de estado.';
COMMENT ON COLUMN dat_hitoestado.idestado IS 'Identificador del estado.';
COMMENT ON COLUMN dat_hitoestado.idhito IS 'Identificador del hito.';
COMMENT ON COLUMN dat_hitoestado.fechainicio IS 'Guarda la fecha de inicio.';
COMMENT ON COLUMN dat_hitoestado.fechafin IS 'Guarda la fecha fin.';
COMMENT ON COLUMN dat_hitoestado.idusuario IS 'Identificador de usuario.';
CREATE SEQUENCE sec_hitooferta_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_hitooferta (
    idhitooferta numeric(19,0) DEFAULT nextval('sec_hitooferta_seq'::regclass) NOT NULL,
    descripcion character varying(255),
    vigencia numeric(3,0),
    unidadtiempo numeric(1,0),
    fechacreacion date,
    fechaestimada date,
    numero numeric(3,0),
    idoferta numeric(19,0),
    idarea numeric(19,0)
);
COMMENT ON TABLE dat_hitooferta IS 'Guara el hito de la oferta.';
COMMENT ON COLUMN dat_hitooferta.idhitooferta IS 'Identificador del hito de la oferta.';
COMMENT ON COLUMN dat_hitooferta.descripcion IS 'Guarda la descripción del hito de oferta.';
COMMENT ON COLUMN dat_hitooferta.vigencia IS 'Guarda la vigencia del hito, la cantidad.';
COMMENT ON COLUMN dat_hitooferta.unidadtiempo IS 'Guarda la unidad de tiempo en años o meses.';
COMMENT ON COLUMN dat_hitooferta.fechacreacion IS 'Guarda la fecha de creación del hito de oferta.';
COMMENT ON COLUMN dat_hitooferta.fechaestimada IS 'Guarda la fecha estimada del hito de oferta.';
COMMENT ON COLUMN dat_hitooferta.numero IS 'Guarda el orden del hito de oferta por un número ordenado.';
COMMENT ON COLUMN dat_hitooferta.idoferta IS 'Identificador de la oferta.';
COMMENT ON COLUMN dat_hitooferta.idarea IS 'Identificador del área.';
CREATE SEQUENCE sec_indicadorcontrato_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999
    CACHE 1;
CREATE TABLE dat_indicadorcontrato (
    idindicadorcontrato numeric(19,0) DEFAULT nextval('sec_indicadorcontrato_seq'::regclass) NOT NULL,
    idindicador numeric(19,0),
    idcontrato numeric(19,0),
    cantidad numeric(19,2),
    idactividad numeric(19,0),
    tipo numeric(1,0),
    denominacion character varying(255)
);
COMMENT ON TABLE dat_indicadorcontrato IS 'Guarda el indicador del contrato.';
COMMENT ON COLUMN dat_indicadorcontrato.idindicadorcontrato IS 'Identificador de la tabla.';
COMMENT ON COLUMN dat_indicadorcontrato.idindicador IS 'Identificador del producto o servicio.';
COMMENT ON COLUMN dat_indicadorcontrato.idcontrato IS 'Identificador del contrato.';
COMMENT ON COLUMN dat_indicadorcontrato.cantidad IS 'Cantidad de productos.';
COMMENT ON COLUMN dat_indicadorcontrato.idactividad IS 'Identificador de servicio.';
COMMENT ON COLUMN dat_indicadorcontrato.tipo IS 'Guarda 1 si es producto y 2 si es servicio.';
COMMENT ON COLUMN dat_indicadorcontrato.denominacion IS 'Guarda la denominación.';
CREATE SEQUENCE sec_indicadorhito_seq
    START WITH 12
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_indicadorhito (
    idindicadorhito numeric(19,0) DEFAULT nextval('sec_indicadorhito_seq'::regclass) NOT NULL,
    idindicador numeric(19,0),
    idactividad numeric(19,0),
    idhito numeric(19,0) NOT NULL,
    cantidad numeric(19,2),
    denominacion character varying(255),
    tipo numeric(1,0)
);
COMMENT ON TABLE dat_indicadorhito IS 'Guarda indicador de hito.';
COMMENT ON COLUMN dat_indicadorhito.idindicadorhito IS 'Identificador de la tabla indicador hito.';
COMMENT ON COLUMN dat_indicadorhito.idindicador IS 'Identificador del indicadorde la tabla nom_indicador.';
COMMENT ON COLUMN dat_indicadorhito.idactividad IS 'Identificador de la actividad.';
COMMENT ON COLUMN dat_indicadorhito.idhito IS 'Guarda el identificador del hito de la tabla dat_hito.';
COMMENT ON COLUMN dat_indicadorhito.cantidad IS 'Guarda la cantidad del producto.';
COMMENT ON COLUMN dat_indicadorhito.denominacion IS 'Guarda el nombre del producto.';
COMMENT ON COLUMN dat_indicadorhito.tipo IS 'Guarda el valor 1 si es producto y 2 si es servicio.';
CREATE TABLE dat_indicadorhitooferta (
    idindicadorhitooferta numeric(19,0) NOT NULL,
    idindicador numeric(19,0),
    idactividad numeric(19,0),
    idhitooferta numeric(19,0),
    cantidad numeric(10,2),
    denominacion character varying(255),
    tipo numeric(1,0)
);
COMMENT ON TABLE dat_indicadorhitooferta IS 'Guarda el indicador del hito oferta.';
COMMENT ON COLUMN dat_indicadorhitooferta.idindicadorhitooferta IS 'Identificador del la tabla.';
COMMENT ON COLUMN dat_indicadorhitooferta.idindicador IS 'Identificador del indicador. Guarda el identificador de las actividades normadas. Tiene relación con el esquema datos maestros con la tabla nom_indicador.';
COMMENT ON COLUMN dat_indicadorhitooferta.idactividad IS 'Identificador de actividad. Tiene vínculo con el esquema datos maestros de la tabla nom_indicador.';
COMMENT ON COLUMN dat_indicadorhitooferta.idhitooferta IS 'Identificador de hito oferta.';
COMMENT ON COLUMN dat_indicadorhitooferta.cantidad IS 'Guarda la cantidad de productos que se requiera.';
COMMENT ON COLUMN dat_indicadorhitooferta.denominacion IS 'Guarda la denominación.';
COMMENT ON COLUMN dat_indicadorhitooferta.tipo IS 'Guarda los valores 1 y 2. El valor 1 es si es producto, y el valor 2 si es servicio.';
CREATE SEQUENCE sec_indicadoroferta_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_indicadoroferta (
    idindicadoroferta numeric(19,0) DEFAULT nextval('sec_indicadoroferta_seq'::regclass) NOT NULL,
    idindicador numeric(19,0),
    idactividad numeric(19,0),
    idoferta numeric(19,0),
    cantidad numeric(19,2),
    denominacion character varying(255),
    tipo numeric(1,0)
);
COMMENT ON TABLE dat_indicadoroferta IS 'Guarda el indicador oferta.';
COMMENT ON COLUMN dat_indicadoroferta.idindicadoroferta IS 'Identificador de la tabla.';
COMMENT ON COLUMN dat_indicadoroferta.idindicador IS 'Identificador del indicador.';
COMMENT ON COLUMN dat_indicadoroferta.idactividad IS 'Ientificador de la actividad.';
COMMENT ON COLUMN dat_indicadoroferta.idoferta IS 'Identificador de la oferta.';
COMMENT ON COLUMN dat_indicadoroferta.cantidad IS 'Guarda la cantidad del producto o servicio.';
COMMENT ON COLUMN dat_indicadoroferta.denominacion IS 'Guarda la denominación.';
COMMENT ON COLUMN dat_indicadoroferta.tipo IS 'Guarda los valores 1 y 2. El valor 1 es si es producto, y el valor 2 si es servicio.';
CREATE TABLE dat_indicadorsolicitud (
    idindicadorsolicitud numeric(19,0) NOT NULL,
    idindicador numeric(19,0),
    idactividad numeric(19,0),
    idsolicitudnegocio numeric(19,0),
    cantidad numeric(19,2),
    denominacion character varying(255),
    tipo numeric(1,0)
);
COMMENT ON TABLE dat_indicadorsolicitud IS 'Guarda los indicadores de la solicitud.';
COMMENT ON COLUMN dat_indicadorsolicitud.idindicadorsolicitud IS 'Identificador de la solicitud.';
COMMENT ON COLUMN dat_indicadorsolicitud.idindicador IS 'Identificador del indicador.';
COMMENT ON COLUMN dat_indicadorsolicitud.idactividad IS 'Identificador de la actividad.';
COMMENT ON COLUMN dat_indicadorsolicitud.idsolicitudnegocio IS 'Identificador de la solicitud de negocio.';
COMMENT ON COLUMN dat_indicadorsolicitud.cantidad IS 'Guarda la cantidad.';
COMMENT ON COLUMN dat_indicadorsolicitud.denominacion IS 'Guarda la denominación.';
COMMENT ON COLUMN dat_indicadorsolicitud.tipo IS 'Guarda el tipo. El valor 1 es para cliente y el valor 2 es para proveedor.';
CREATE SEQUENCE sec_datmediopago_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_mediopagocontrato (
    idcontrato numeric(19,0),
    idmediopago numeric(19,0),
    idmediopagocontrato numeric(19,0) DEFAULT nextval('sec_datmediopago_seq'::regclass) NOT NULL
);
COMMENT ON TABLE dat_mediopagocontrato IS 'Guarda el medio de pago del contrato.';
COMMENT ON COLUMN dat_mediopagocontrato.idcontrato IS 'Identificador del contrato.';
COMMENT ON COLUMN dat_mediopagocontrato.idmediopago IS 'Identificador del medio de pago.';
COMMENT ON COLUMN dat_mediopagocontrato.idmediopagocontrato IS 'Identificador del medio de pago del contrato.';
CREATE SEQUENCE sec_mediopagooferta_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_mediopagooferta (
    idmediopagooferta numeric(19,0) DEFAULT nextval('sec_mediopagooferta_seq'::regclass) NOT NULL,
    idoferta numeric(19,0),
    idmediopago numeric(19,0)
);
COMMENT ON TABLE dat_mediopagooferta IS 'Guarda el medio de pago de la oferta.';
COMMENT ON COLUMN dat_mediopagooferta.idmediopagooferta IS 'Identificador de la tabla.';
COMMENT ON COLUMN dat_mediopagooferta.idoferta IS 'Identificador de la oferta.';
COMMENT ON COLUMN dat_mediopagooferta.idmediopago IS 'Identificador del medio de pago. Del esquema mod_crmcontratacion de la tabla nom_mediopago.';
CREATE SEQUENCE sec_monedacontrato_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_monedacontrato (
    idmonedacontrato numeric(19,0) DEFAULT nextval('sec_monedacontrato_seq'::regclass) NOT NULL,
    idmoneda numeric(19,0) NOT NULL,
    idcontrato numeric(19,0) NOT NULL,
    valor numeric(19,3) DEFAULT 0 NOT NULL
);
COMMENT ON TABLE dat_monedacontrato IS 'Guarda la moneda del contrato.';
COMMENT ON COLUMN dat_monedacontrato.idmonedacontrato IS 'Identificador de la tabla.';
COMMENT ON COLUMN dat_monedacontrato.idmoneda IS 'Identificador de la moneda de la tabla nom_moneda del esquema mod_datosmaestros.';
COMMENT ON COLUMN dat_monedacontrato.idcontrato IS 'Identificador del contrato del esquema mod_crmcontratacion la tabla dat_contrato.';
COMMENT ON COLUMN dat_monedacontrato.valor IS 'Guarda el monto.';
CREATE SEQUENCE sec_monedahito_seq
    START WITH 42
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_monedahito (
    idmonedahito numeric(19,0) DEFAULT nextval('sec_monedahito_seq'::regclass) NOT NULL,
    idmoneda numeric(19,0),
    idhito numeric(19,0),
    valor numeric(19,3)
);
COMMENT ON TABLE dat_monedahito IS 'Guarda los monedas asociadas a los hitos de pago';
COMMENT ON COLUMN dat_monedahito.idmonedahito IS 'Identificador de moneda hito.';
COMMENT ON COLUMN dat_monedahito.idmoneda IS 'Identificador de moneda. Guarda el tipo de moneda, de la tabla dat_moneda.';
COMMENT ON COLUMN dat_monedahito.idhito IS 'Identificador de hito.';
COMMENT ON COLUMN dat_monedahito.valor IS 'Guarda el valor del hito según el tipo de moneda.';
CREATE SEQUENCE sec_monedahitooferta_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_monedahitooferta (
    idmonedahitooferta numeric(19,0) DEFAULT nextval('sec_monedahitooferta_seq'::regclass) NOT NULL,
    idmoneda numeric(19,0),
    idhitooferta numeric(19,0),
    valor numeric(19,2)
);
COMMENT ON TABLE dat_monedahitooferta IS 'Guarda la moneda del hito de oferta.';
COMMENT ON COLUMN dat_monedahitooferta.idmonedahitooferta IS 'Identificador de la moneda del hito oferta.';
COMMENT ON COLUMN dat_monedahitooferta.idmoneda IS 'Identificador de la moneda. Del esquema mod_datosmaestros de la tabla nom_moneda.';
COMMENT ON COLUMN dat_monedahitooferta.idhitooferta IS 'Identificador del hito de oferta.';
COMMENT ON COLUMN dat_monedahitooferta.valor IS 'Guarda el monto del hito de la oferta.';
CREATE SEQUENCE sec_monedaindicador_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_monedaindicador (
    idmonedaindicador numeric(19,0) DEFAULT nextval('sec_monedaindicador_seq'::regclass) NOT NULL,
    idmoneda numeric(19,0),
    idindicadorhito numeric(19,0),
    valor numeric(19,3)
);
COMMENT ON TABLE dat_monedaindicador IS 'Guarda la moneda indicador.';
COMMENT ON COLUMN dat_monedaindicador.idmonedaindicador IS 'Identificador de la moneda indicador.';
COMMENT ON COLUMN dat_monedaindicador.idmoneda IS 'Identificador de moneda.';
COMMENT ON COLUMN dat_monedaindicador.idindicadorhito IS 'Identificador del indicador hito de la tabla dat_indicadorhito.';
COMMENT ON COLUMN dat_monedaindicador.valor IS 'Guarda el valor del hito según el tipo de moneda.';
CREATE SEQUENCE sec_monedaindicadorcontrato_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_monedaindicadorcontrato (
    idmonedaindicador numeric(19,0) DEFAULT nextval('sec_monedaindicadorcontrato_seq'::regclass) NOT NULL,
    idmoneda numeric(19,0),
    idindicadorcontrato numeric(19,0),
    valor numeric(19,2)
);
COMMENT ON TABLE dat_monedaindicadorcontrato IS 'Guarda la moneda indicador (producto y servicio) del contrato.';
COMMENT ON COLUMN dat_monedaindicadorcontrato.idmonedaindicador IS 'Identificador de la moneda indicador.';
COMMENT ON COLUMN dat_monedaindicadorcontrato.idmoneda IS 'Identificador de la moneda.';
COMMENT ON COLUMN dat_monedaindicadorcontrato.idindicadorcontrato IS 'Identificador del indicador contrato.';
COMMENT ON COLUMN dat_monedaindicadorcontrato.valor IS 'Guarda el valor.';
CREATE TABLE dat_monedaindicadorhitooferta (
    idmonedaindicadorhitooferta numeric(19,0) NOT NULL,
    idmoneda numeric(19,0),
    idindicadorhitooferta numeric(19,0),
    valor numeric(19,2)
);
COMMENT ON TABLE dat_monedaindicadorhitooferta IS 'Guarda la moneda indicador del hito oferta.';
COMMENT ON COLUMN dat_monedaindicadorhitooferta.idmonedaindicadorhitooferta IS 'Identificador de la moneda indicador del hito de oferta.';
COMMENT ON COLUMN dat_monedaindicadorhitooferta.idmoneda IS 'Identificador de la moneda. Del esquema mod_datosmaestros de la tabla nom_moneda.';
COMMENT ON COLUMN dat_monedaindicadorhitooferta.idindicadorhitooferta IS 'Guarda el identificador del hito de oferta.';
COMMENT ON COLUMN dat_monedaindicadorhitooferta.valor IS 'Guarda el monto de la moneda indicador hito de oferta.';
CREATE TABLE dat_monedaindicadoroferta (
    idmonedaindicadoroferta numeric(19,0) NOT NULL,
    idmoneda numeric(19,0),
    idindicadoroferta numeric(19,0),
    valor numeric(19,2)
);
COMMENT ON TABLE dat_monedaindicadoroferta IS 'Guarda la moneda indciador oferta.';
COMMENT ON COLUMN dat_monedaindicadoroferta.idmonedaindicadoroferta IS 'Identificador de la tabla.';
COMMENT ON COLUMN dat_monedaindicadoroferta.idmoneda IS 'Identificador de la moneda.';
COMMENT ON COLUMN dat_monedaindicadoroferta.idindicadoroferta IS 'Identificador del indicador oferta.';
COMMENT ON COLUMN dat_monedaindicadoroferta.valor IS 'Guarda el valor del indicador oferta.';
CREATE SEQUENCE sec_monedaoferta_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_monedaoferta (
    idmonedaoferta numeric(19,0) DEFAULT nextval('sec_monedaoferta_seq'::regclass) NOT NULL,
    idmoneda numeric(19,0),
    idoferta numeric(19,0),
    valor numeric(19,2)
);
COMMENT ON TABLE dat_monedaoferta IS 'Guarda la moneda de la oferta.';
COMMENT ON COLUMN dat_monedaoferta.idmonedaoferta IS 'Identificador de la tabla.';
COMMENT ON COLUMN dat_monedaoferta.idmoneda IS 'Identificador de la moneda.';
COMMENT ON COLUMN dat_monedaoferta.idoferta IS 'Identificador de la oferta.';
COMMENT ON COLUMN dat_monedaoferta.valor IS 'Guarda el valor de la oferta.';
CREATE TABLE dat_moracontrato (
    idmora numeric(19,0) NOT NULL,
    porciento numeric(19,0),
    dias numeric(19,0),
    maximo numeric(19,0),
    idmoneda numeric(19,0)
);
CREATE SEQUENCE sec_ofertadictamen_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_ofertadictamen (
    iddictamen numeric(19,0) DEFAULT nextval('sec_ofertadictamen_seq'::regclass) NOT NULL,
    idoferta numeric(19,0),
    idestado numeric(19,0),
    idrol numeric(19,0),
    observacion text,
    documento text,
    idusuario numeric(19,0),
    activo numeric(1,0) DEFAULT 1 NOT NULL,
    fecha date
);
COMMENT ON TABLE dat_ofertadictamen IS 'Guarda la oferta dictamen.';
COMMENT ON COLUMN dat_ofertadictamen.iddictamen IS 'Identificador del dictamen.';
COMMENT ON COLUMN dat_ofertadictamen.idoferta IS 'Identificador de la oferta.';
COMMENT ON COLUMN dat_ofertadictamen.idestado IS 'Identificador del estado.';
COMMENT ON COLUMN dat_ofertadictamen.idrol IS 'Identificador del rol.';
COMMENT ON COLUMN dat_ofertadictamen.observacion IS 'Guarda las observaciones.';
COMMENT ON COLUMN dat_ofertadictamen.documento IS 'Guarda el documento.';
COMMENT ON COLUMN dat_ofertadictamen.idusuario IS 'Identificador del usuario.';
COMMENT ON COLUMN dat_ofertadictamen.activo IS 'Guarda los valores 0 o 1. El valor 0 es cuando no está activo y el valor 1 es cuando está activo.';
COMMENT ON COLUMN dat_ofertadictamen.fecha IS 'Guarda la fecha.';
CREATE SEQUENCE sec_ofertanegocio_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_ofertanegocio (
    idoferta numeric(19,0) DEFAULT nextval('sec_ofertanegocio_seq'::regclass) NOT NULL,
    nombre character varying(150) NOT NULL,
    idsolicitud numeric(19,0),
    fechainicio date NOT NULL,
    fechafirma date,
    vigencia numeric(3,0) NOT NULL,
    idmediopago numeric(19,0),
    idcondicionpago numeric(19,0),
    montototal numeric(10,2),
    descripcion text,
    unidadtiempo numeric(1,0) NOT NULL,
    idespaciotrabajo character varying(255),
    cliente numeric(1,0),
    objeto character varying(255),
    idclienteproveedor numeric(19,0),
    idsector numeric(19,0),
    idresponsable numeric(19,0),
    idarea numeric(19,0),
    numero character varying(10),
    idestructuracomun numeric(19,0),
    idcontrato numeric(19,0)
);
COMMENT ON TABLE dat_ofertanegocio IS 'Guarda la oferta de negocio.';
COMMENT ON COLUMN dat_ofertanegocio.idoferta IS 'Identificador del oferta.';
COMMENT ON COLUMN dat_ofertanegocio.nombre IS 'Guarda el nombre de la oferta.';
COMMENT ON COLUMN dat_ofertanegocio.idsolicitud IS 'Identificador de la solicitud.';
COMMENT ON COLUMN dat_ofertanegocio.fechainicio IS 'Guarda la fecha de inicio de la oferta.';
COMMENT ON COLUMN dat_ofertanegocio.fechafirma IS 'Guarda le fecha firma.';
COMMENT ON COLUMN dat_ofertanegocio.vigencia IS 'Guarda la vigencia.';
COMMENT ON COLUMN dat_ofertanegocio.idmediopago IS 'Identificador de medio de pago.';
COMMENT ON COLUMN dat_ofertanegocio.idcondicionpago IS 'Identificador de condiciones de pago.';
COMMENT ON COLUMN dat_ofertanegocio.montototal IS 'Guarda el monto total.';
COMMENT ON COLUMN dat_ofertanegocio.descripcion IS 'Guarda la descripción.';
COMMENT ON COLUMN dat_ofertanegocio.unidadtiempo IS 'Representa la unidad de tiempo en la que se establece la vigencia de la oferta, 1 es dias y 2 es meses.';
COMMENT ON COLUMN dat_ofertanegocio.idespaciotrabajo IS 'Identificador del espacio de trabajo donde se guardan los documentos asociados a la oferta de negocio. Es generado por el gestor documental.';
COMMENT ON COLUMN dat_ofertanegocio.cliente IS 'Guarda los valores 0 y 1. El valor 1 significa oferta con cliente y el valor 0 oferta con proveedor.';
COMMENT ON COLUMN dat_ofertanegocio.objeto IS 'Guarda el objeto de la oferta de negocio.';
COMMENT ON COLUMN dat_ofertanegocio.idclienteproveedor IS 'Identificador de clientes y proveedores. Del esquema mod_dastosmestros la tabla, nom_clientesproveedor.';
COMMENT ON COLUMN dat_ofertanegocio.idsector IS 'Identificador del sector, del esquema mod_crmcontratacion de la tabla nom_sector.';
COMMENT ON COLUMN dat_ofertanegocio.idresponsable IS 'Identificador del responsable.';
COMMENT ON COLUMN dat_ofertanegocio.idarea IS 'Identificador del área, del esquema mod_contratacion de la tabla nom_area.';
COMMENT ON COLUMN dat_ofertanegocio.numero IS 'Guarda el número de la oferta de negocio.';
COMMENT ON COLUMN dat_ofertanegocio.idestructuracomun IS 'Identificador de la estructura. Del esquema mod_estructuracomp la tabla nom_filaestruc.';
COMMENT ON COLUMN dat_ofertanegocio.idcontrato IS 'Guarda el identificador del contrato.';
CREATE SEQUENCE sec_ofertanegociodocumento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_ofertanegociodocumento (
    idofertadocumento numeric(19,0) DEFAULT nextval('sec_ofertanegociodocumento_seq'::regclass) NOT NULL,
    nombre character varying(150) NOT NULL,
    documento json NOT NULL,
    idoferta numeric(19,0) NOT NULL
);
COMMENT ON TABLE dat_ofertanegociodocumento IS 'Guarda la oferta de negocio de documento.';
COMMENT ON COLUMN dat_ofertanegociodocumento.idofertadocumento IS 'Guarda el identificador de la oferta documento.';
COMMENT ON COLUMN dat_ofertanegociodocumento.nombre IS 'Guarda el nombre.';
COMMENT ON COLUMN dat_ofertanegociodocumento.documento IS 'Guarda el documento.';
COMMENT ON COLUMN dat_ofertanegociodocumento.idoferta IS 'Identificador de la oferta.';
CREATE SEQUENCE sec_ofertanegocioestado_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_ofertanegocioestado (
    idofertaestado numeric(19,0) DEFAULT nextval('sec_ofertanegocioestado_seq'::regclass) NOT NULL,
    idoferta numeric(19,0) NOT NULL,
    idestado numeric(19,0) NOT NULL,
    fechainicio date NOT NULL,
    fechafin date,
    idusuario numeric(19,0) NOT NULL
);
COMMENT ON TABLE dat_ofertanegocioestado IS 'Guarda la oferta de negocio estado.';
COMMENT ON COLUMN dat_ofertanegocioestado.idofertaestado IS 'Identificador de la oferta estado.';
COMMENT ON COLUMN dat_ofertanegocioestado.idoferta IS 'Identificador de la oferta.';
COMMENT ON COLUMN dat_ofertanegocioestado.idestado IS 'Identificador del estado.';
COMMENT ON COLUMN dat_ofertanegocioestado.fechainicio IS 'Guarad la fecha de inicio.';
COMMENT ON COLUMN dat_ofertanegocioestado.fechafin IS 'Guarda la fecha fin.';
COMMENT ON COLUMN dat_ofertanegocioestado.idusuario IS 'Identificador del usuario.';
CREATE SEQUENCE sec_productosdatosadicionales_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_productosdatosadicionales (
    idproductodatosadicionales numeric(19,0) DEFAULT nextval('sec_productosdatosadicionales_seq'::regclass) NOT NULL,
    idproducto numeric(19,0),
    datos json
);
COMMENT ON TABLE dat_productosdatosadicionales IS 'Guarda los productos adicionales de los atributos dinámicos que vienen de maestros de productos y servicios.';
COMMENT ON COLUMN dat_productosdatosadicionales.idproductodatosadicionales IS 'Identificador de la tabla.';
COMMENT ON COLUMN dat_productosdatosadicionales.idproducto IS 'Identificador de producto que está en la tabla de maestros de productos y servicio.';
COMMENT ON COLUMN dat_productosdatosadicionales.datos IS 'Guarda los atributos dinámicos configurados en la naturalerza de productos y servicios del esquema mod_datosmaestros y los valores de los mismos.';
CREATE SEQUENCE sec_proforma_seq
    START WITH 7
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_proforma (
    idproforma numeric(19,0) DEFAULT nextval('sec_proforma_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    idtipocontrato numeric(19,0) NOT NULL,
    vendedor text NOT NULL,
    comprador text NOT NULL,
    ambos text NOT NULL,
    anexos text,
    marco numeric(1,0) DEFAULT 0 NOT NULL,
    idplantilla numeric(10,0),
    idestructuracomun numeric(19,0)
);
COMMENT ON TABLE dat_proforma IS 'Guarda las proformas de un contrato.';
COMMENT ON COLUMN dat_proforma.idproforma IS 'Identificador de la proforma.';
COMMENT ON COLUMN dat_proforma.denominacion IS 'Denominación de la proforma.';
COMMENT ON COLUMN dat_proforma.idtipocontrato IS 'Llave foránea de la tabla dat_tipocontrato.';
COMMENT ON COLUMN dat_proforma.vendedor IS 'Datos del vendedor. En esta columna se registra la estrucutura de la sección correspondiente a los datos del vendedor.';
COMMENT ON COLUMN dat_proforma.comprador IS 'Datos del comprador. En esta columna se registra la estructura de la sección correspondiente a los datos del comprador.';
COMMENT ON COLUMN dat_proforma.ambos IS 'Datos del comprador y vendedor. En esta columna se registra la estrucutura de la sección correspondiente a los datos del comprador y vendedor.';
COMMENT ON COLUMN dat_proforma.anexos IS 'Guarda los anexos del contrato.';
COMMENT ON COLUMN dat_proforma.marco IS 'Guarda si es contrato marco o no.';
COMMENT ON COLUMN dat_proforma.idplantilla IS 'Identificador de la plantilla.';
COMMENT ON COLUMN dat_proforma.idestructuracomun IS 'Identificador de la estructura. Llave foránea del esquema mod_estructcomposicion.';
CREATE SEQUENCE sec_proformaclausula_seq
    START WITH 89
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_proformaclausula (
    idproformaclausula numeric(19,0) DEFAULT nextval('sec_proformaclausula_seq'::regclass) NOT NULL,
    idproforma numeric(19,0) NOT NULL,
    idclausula numeric(19,0) NOT NULL,
    contenido character varying NOT NULL,
    orden numeric(2,0)
);
COMMENT ON TABLE dat_proformaclausula IS 'Guarda las proformas cláusula de un contrato.';
COMMENT ON COLUMN dat_proformaclausula.idproformaclausula IS 'Identificador de la relacion entre una proforma y las cláusulas.';
COMMENT ON COLUMN dat_proformaclausula.idproforma IS 'Llave foránea de la tabla dat_proforma.';
COMMENT ON COLUMN dat_proformaclausula.idclausula IS 'Llave foránea de la tabla nom_clausula.';
COMMENT ON COLUMN dat_proformaclausula.contenido IS 'Contenido de la cláusula para esta proforma.';
COMMENT ON COLUMN dat_proformaclausula.orden IS 'Guarda el orden. Es un consecutivo de las cláusulas.';
CREATE SEQUENCE sec_roltransicion_seq
    START WITH 8
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_roltransicion (
    idroltransicion numeric(19,0) DEFAULT nextval('sec_roltransicion_seq'::regclass) NOT NULL,
    idtransicion numeric(19,0) NOT NULL,
    idrol numeric(19,0)
);
COMMENT ON TABLE dat_roltransicion IS 'Guarda los valores de los usuarios en transicion.';
COMMENT ON COLUMN dat_roltransicion.idroltransicion IS 'Identificador del rol transición.';
COMMENT ON COLUMN dat_roltransicion.idtransicion IS 'Identificador de transición.';
COMMENT ON COLUMN dat_roltransicion.idrol IS 'Identificador del usuario.';
CREATE SEQUENCE sec_solicituddictamen_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_solicituddictamen (
    iddictamen numeric(19,0) DEFAULT nextval('sec_solicituddictamen_seq'::regclass) NOT NULL,
    idsolicitud numeric(19,0),
    idestado numeric(19,0),
    idrol numeric(19,0),
    observacion text,
    documento text,
    idusuario numeric(19,0),
    activo numeric(1,0) DEFAULT 1 NOT NULL,
    fecha date
);
COMMENT ON TABLE dat_solicituddictamen IS 'Guarda la solicitud del dictamen.';
COMMENT ON COLUMN dat_solicituddictamen.iddictamen IS 'Identificador de la tabla.';
COMMENT ON COLUMN dat_solicituddictamen.idsolicitud IS 'Identificador de la solicitud.';
COMMENT ON COLUMN dat_solicituddictamen.idestado IS 'Identificador del estado.';
COMMENT ON COLUMN dat_solicituddictamen.idrol IS 'Identificador del rol.';
COMMENT ON COLUMN dat_solicituddictamen.observacion IS 'Guarda la observación.';
COMMENT ON COLUMN dat_solicituddictamen.documento IS 'Identificador del documento guardado en el gestor documental.';
COMMENT ON COLUMN dat_solicituddictamen.idusuario IS 'Identificador de usuario.';
COMMENT ON COLUMN dat_solicituddictamen.activo IS 'Guarda los valores 0 y 1. El valor 0 es inactivo el valor 1 es activo.';
COMMENT ON COLUMN dat_solicituddictamen.fecha IS 'Guarda la fecha de la solicitud dictamen.';
CREATE SEQUENCE sec_solicitudnegocio_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_solicitudnegocio (
    idsolicitud numeric(19,0) DEFAULT nextval('sec_solicitudnegocio_seq'::regclass) NOT NULL,
    idclienteproveedor numeric(19,0),
    idsector numeric(19,0) NOT NULL,
    idarearesponsable numeric(19,0) NOT NULL,
    descripcion text,
    fechacreada date,
    nombre character varying(150) NOT NULL,
    idespaciotrabajo character varying(255),
    documento json,
    cliente numeric(1,0) DEFAULT 1,
    idestructuracomun numeric(19,0)
);
COMMENT ON TABLE dat_solicitudnegocio IS 'Guarda la solicitud de negocio.';
COMMENT ON COLUMN dat_solicitudnegocio.idsolicitud IS 'Identificador de la solicitud.';
COMMENT ON COLUMN dat_solicitudnegocio.idclienteproveedor IS 'Identificador de cliente proveedor.';
COMMENT ON COLUMN dat_solicitudnegocio.idsector IS 'Identificador del sector.';
COMMENT ON COLUMN dat_solicitudnegocio.idarearesponsable IS 'Identificador del área responsable.';
COMMENT ON COLUMN dat_solicitudnegocio.descripcion IS 'Guarda la descripción.';
COMMENT ON COLUMN dat_solicitudnegocio.fechacreada IS 'Guarda la fecha en que se creó.';
COMMENT ON COLUMN dat_solicitudnegocio.nombre IS ' Nombre de la solicitud.';
COMMENT ON COLUMN dat_solicitudnegocio.idespaciotrabajo IS 'Identificador del espacio de trabajo donde se guardan los documentos asociados a la solicitud de negocio.';
COMMENT ON COLUMN dat_solicitudnegocio.documento IS 'Guarda el documento.';
COMMENT ON COLUMN dat_solicitudnegocio.cliente IS 'Cliente 1 Proveedor 2';
COMMENT ON COLUMN dat_solicitudnegocio.idestructuracomun IS 'Identificador de la estructura del esquema estructura y composición.';
CREATE SEQUENCE sec_solicitudnegocioareaimplicada_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_solicitudnegocioareaimplicada (
    idarea numeric(19,0) DEFAULT nextval('sec_solicitudnegocioareaimplicada_seq'::regclass) NOT NULL,
    idestructura numeric(19,0) NOT NULL,
    idsolicitud numeric(19,0) NOT NULL
);
COMMENT ON TABLE dat_solicitudnegocioareaimplicada IS 'Guarda la solicitud de negocio del área implicada.';
COMMENT ON COLUMN dat_solicitudnegocioareaimplicada.idarea IS 'Identificador del área.';
COMMENT ON COLUMN dat_solicitudnegocioareaimplicada.idestructura IS 'Identificador de la estructura.';
COMMENT ON COLUMN dat_solicitudnegocioareaimplicada.idsolicitud IS 'Identificador de la solicitud.';
CREATE SEQUENCE sec_solicitudnegocioestado_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_solicitudnegocioestado (
    idsolicitudestado numeric(19,0) DEFAULT nextval('sec_solicitudnegocioestado_seq'::regclass) NOT NULL,
    idestado numeric(19,0) NOT NULL,
    idsolicitud numeric(19,0) NOT NULL,
    fechainicio date NOT NULL,
    fechafin date,
    idusuario numeric(19,0) NOT NULL
);
COMMENT ON TABLE dat_solicitudnegocioestado IS 'Guarda el estado de la solictud de negocio.';
COMMENT ON COLUMN dat_solicitudnegocioestado.idsolicitudestado IS 'Identificador de la solicitud de estado.';
COMMENT ON COLUMN dat_solicitudnegocioestado.idestado IS 'Identificador  del estado.';
COMMENT ON COLUMN dat_solicitudnegocioestado.idsolicitud IS 'Identificador de la solicitud.';
COMMENT ON COLUMN dat_solicitudnegocioestado.fechainicio IS 'Guarda la fecha de inicio.';
COMMENT ON COLUMN dat_solicitudnegocioestado.fechafin IS 'Guarda la fecha fin.';
COMMENT ON COLUMN dat_solicitudnegocioestado.idusuario IS 'Identificador del usuario.';
CREATE TABLE dat_solicitudnegocioproveedor (
    idsolicitudnegocioproveedor numeric(19,0) NOT NULL,
    idsolicitudnegocio numeric(19,0),
    idproveedor numeric(19,0)
);
COMMENT ON TABLE dat_solicitudnegocioproveedor IS 'Guarda la solicitud de negocio del proveedor.';
COMMENT ON COLUMN dat_solicitudnegocioproveedor.idsolicitudnegocioproveedor IS 'Identificador de la solicitud de negocio del proveedor.';
COMMENT ON COLUMN dat_solicitudnegocioproveedor.idsolicitudnegocio IS 'Identificador de la solicitud de negocio.';
COMMENT ON COLUMN dat_solicitudnegocioproveedor.idproveedor IS 'Identificador del proveedor.';
CREATE SEQUENCE sec_solicitudpago_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_solicitudpago (
    idsolicitudpago numeric(19,0) DEFAULT nextval('sec_solicitudpago_seq'::regclass) NOT NULL,
    descripcion character varying(255),
    objetivos character varying(255),
    codigo character varying(100),
    idarea numeric(19,0),
    idformapago numeric(19,0),
    fecharecibo date,
    idcontrato numeric(19,0),
    idespaciotrabajo character varying(255),
    idestructuracomun numeric(19,0)
);
COMMENT ON TABLE dat_solicitudpago IS 'Guarda la solicitud de pago.';
COMMENT ON COLUMN dat_solicitudpago.idsolicitudpago IS 'Identificador de la solicitud de pago.';
COMMENT ON COLUMN dat_solicitudpago.descripcion IS 'Descripción de la solicitud de pago.';
COMMENT ON COLUMN dat_solicitudpago.objetivos IS 'Objetivos de la solicitud de pago.';
COMMENT ON COLUMN dat_solicitudpago.codigo IS 'Guarda el código de la solicitud de pago.';
COMMENT ON COLUMN dat_solicitudpago.idarea IS 'Identificador del área. Llave foránea con estructuraop.';
COMMENT ON COLUMN dat_solicitudpago.idformapago IS 'Identificador de la forma de pago.';
COMMENT ON COLUMN dat_solicitudpago.fecharecibo IS 'Guarda la fecha del recibo de la solicitud.';
COMMENT ON COLUMN dat_solicitudpago.idcontrato IS 'Identificador del contrato.';
COMMENT ON COLUMN dat_solicitudpago.idespaciotrabajo IS 'Identificador del espacio de trabajo.';
COMMENT ON COLUMN dat_solicitudpago.idestructuracomun IS 'Identificador de la estructuracomun.';
CREATE SEQUENCE sec_solicitudpagodictamen_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_solicitudpagodictamen (
    iddictamen numeric(19,0) DEFAULT nextval('sec_solicitudpagodictamen_seq'::regclass) NOT NULL,
    idsolicitudpago numeric(19,0),
    idestado numeric(19,0),
    idrol numeric(19,0),
    observacion text,
    documento text,
    idusuario numeric(19,0),
    activo numeric(1,0) DEFAULT 1 NOT NULL,
    fecha date
);
COMMENT ON TABLE dat_solicitudpagodictamen IS 'Guarda la solicitud de pago dictamen.';
COMMENT ON COLUMN dat_solicitudpagodictamen.iddictamen IS 'Identificador de la tabla.';
COMMENT ON COLUMN dat_solicitudpagodictamen.idsolicitudpago IS 'Identificador de solicitud de pago.';
COMMENT ON COLUMN dat_solicitudpagodictamen.idestado IS 'Identificador de estado.';
COMMENT ON COLUMN dat_solicitudpagodictamen.idrol IS 'Identificador del rol.';
COMMENT ON COLUMN dat_solicitudpagodictamen.observacion IS 'Guarda la observación que se requiera de la solicitud de pago del dictamen.';
COMMENT ON COLUMN dat_solicitudpagodictamen.documento IS 'Guarda el documento.';
COMMENT ON COLUMN dat_solicitudpagodictamen.idusuario IS 'Identificador del usuario.';
COMMENT ON COLUMN dat_solicitudpagodictamen.activo IS 'Guarda los valores 0 y 1. El valor 1 es activo y el valor 0 es inactivo.';
COMMENT ON COLUMN dat_solicitudpagodictamen.fecha IS 'Guarda la fecha de la solicitud de pago dictamen.';
CREATE SEQUENCE sec_solicitudpagoestado_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_solicitudpagoestado (
    idsolicitudpagoestado numeric(19,0) DEFAULT nextval('sec_solicitudpagoestado_seq'::regclass) NOT NULL,
    idestado numeric(19,0),
    idsolicitudpago numeric(19,0),
    fechainicio date NOT NULL,
    fechafin date,
    idusuario numeric(19,0)
);
COMMENT ON COLUMN dat_solicitudpagoestado.idsolicitudpagoestado IS 'Identificador de la solicitud de pago.';
COMMENT ON COLUMN dat_solicitudpagoestado.idestado IS 'Identificador de estado.';
COMMENT ON COLUMN dat_solicitudpagoestado.idsolicitudpago IS 'Identificador de solicitud de pago.';
COMMENT ON COLUMN dat_solicitudpagoestado.fechainicio IS 'Guarda la fecha de inicio.';
COMMENT ON COLUMN dat_solicitudpagoestado.fechafin IS 'Guarda la fecha fin.';
COMMENT ON COLUMN dat_solicitudpagoestado.idusuario IS 'Identificador de usuario.';
CREATE SEQUENCE sec_solicitudpagoobjetivo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999
    CACHE 1;
CREATE TABLE dat_solicitudpagoobjetivo (
    idsolicitudpagoobjetivo numeric(19,0) DEFAULT nextval('sec_solicitudpagoobjetivo_seq'::regclass) NOT NULL,
    idsolicitudpago numeric(19,0),
    hitos json,
    indicadores json
);
CREATE SEQUENCE sec_tipocontrato_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999
    CACHE 1;
CREATE TABLE dat_tipocontrato (
    idtipocontrato numeric(19,0) DEFAULT nextval('sec_tipocontrato_seq'::regclass) NOT NULL,
    denominacion character varying(255) NOT NULL,
    idestructuracomun numeric(19,0),
    tipo numeric(1,0) DEFAULT 1 NOT NULL,
    editable numeric(1,0) DEFAULT 1 NOT NULL,
    compartimentacion json,
    cliente numeric(1,0) DEFAULT 1
);
COMMENT ON TABLE dat_tipocontrato IS 'Guarda los valores de tipo de contrato.';
COMMENT ON COLUMN dat_tipocontrato.idtipocontrato IS 'Identificador de tipo de contrato.';
COMMENT ON COLUMN dat_tipocontrato.denominacion IS 'Denominación de tipo de contrato.';
COMMENT ON COLUMN dat_tipocontrato.idestructuracomun IS 'Identificador de estructura comun.';
COMMENT ON COLUMN dat_tipocontrato.tipo IS 'Guarda los valores del tipo de contrato.';
COMMENT ON COLUMN dat_tipocontrato.editable IS 'Guarda los valores 1 y cero. Por defecto es 1.';
COMMENT ON COLUMN dat_tipocontrato.compartimentacion IS 'Guarda la compartimenación por rol de usuarios.
           (arreglo de json, permite la visivilidad del componente a roles de usuarios)
            [{"idrol": "", "denominacion": "", "visibilidad": true || false}],
';
COMMENT ON COLUMN dat_tipocontrato.cliente IS 'Guarda si es cliente o no.';
CREATE SEQUENCE sec_vehiculocontrato_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE dat_vehiculocontrato (
    idvehiculocontrato numeric(19,0) DEFAULT nextval('sec_vehiculocontrato_seq'::regclass) NOT NULL,
    idclienteproveedor numeric(19,0),
    idindicador numeric(19,0),
    idmarca numeric(19,0),
    idmodelo numeric(19,0),
    chapa character varying(255),
    denominacion character varying(255),
    provincia character varying(255),
    datos json,
    tipomedio character varying(255)
);
COMMENT ON TABLE dat_vehiculocontrato IS 'Guarda los vehículos que se le van a prestar servicio según el contrato.';
COMMENT ON COLUMN dat_vehiculocontrato.idvehiculocontrato IS 'Identificador de la tabla.';
COMMENT ON COLUMN dat_vehiculocontrato.idclienteproveedor IS 'Identificador del cliente y/o proveedor.';
COMMENT ON COLUMN dat_vehiculocontrato.idindicador IS 'Identificador del indicador.';
COMMENT ON COLUMN dat_vehiculocontrato.idmarca IS 'Identificador de la marca.';
COMMENT ON COLUMN dat_vehiculocontrato.idmodelo IS 'Identificador del modelo.';
COMMENT ON COLUMN dat_vehiculocontrato.chapa IS 'Número de chapa o serie.';
COMMENT ON COLUMN dat_vehiculocontrato.denominacion IS 'Guarda la denominación.';
COMMENT ON COLUMN dat_vehiculocontrato.provincia IS 'Guarda la provincia a la que pertenece el vehículo.';
COMMENT ON COLUMN dat_vehiculocontrato.datos IS 'Guarda los valores de los atributos dinámicos.';
COMMENT ON COLUMN dat_vehiculocontrato.tipomedio IS 'Guarda el tipo de medio. Si es automotor o montacargas.';
CREATE SEQUENCE sec_categoria_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE nom_categoria (
    idcategoria numeric(19,0) DEFAULT nextval('sec_categoria_seq'::regclass) NOT NULL,
    denominacion character varying(255),
    descripcion character varying(255),
    fechainicio date,
    fechafin date
);
COMMENT ON TABLE nom_categoria IS 'Guarda las categorías definidas.';
COMMENT ON COLUMN nom_categoria.idcategoria IS 'Identificador de la categoría.';
COMMENT ON COLUMN nom_categoria.denominacion IS 'Guarda la denominación de la categoría.';
COMMENT ON COLUMN nom_categoria.descripcion IS 'Guarda la descripción de la categoría.';
COMMENT ON COLUMN nom_categoria.fechainicio IS 'Guarda la fecha de inicio.';
COMMENT ON COLUMN nom_categoria.fechafin IS 'Guarda la fecha fin.';
CREATE SEQUENCE sec_clausula_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE nom_clausula (
    idclausula numeric(19,0) DEFAULT nextval('sec_clausula_seq'::regclass) NOT NULL,
    descripcion character varying(255),
    fechainicio date NOT NULL,
    fechafin date,
    denominacion character varying(100) NOT NULL
);
COMMENT ON TABLE nom_clausula IS 'Nomenclador de la cláusula.';
COMMENT ON COLUMN nom_clausula.idclausula IS 'Identificador de la tabla nom_clausula.';
COMMENT ON COLUMN nom_clausula.descripcion IS 'Descripción de la cláusula.';
COMMENT ON COLUMN nom_clausula.fechainicio IS 'Es la fecha de inicio.';
COMMENT ON COLUMN nom_clausula.fechafin IS 'Es la fecha de fin.';
COMMENT ON COLUMN nom_clausula.denominacion IS 'Denominación de la cláusula.';
CREATE SEQUENCE sec_entregable_seq
    START WITH 9
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE nom_entregable (
    identregable numeric(19,0) DEFAULT nextval('sec_entregable_seq'::regclass) NOT NULL,
    nombre character varying(100) NOT NULL,
    fechainicio date NOT NULL,
    fechafin date,
    descripcion character varying(255)
);
COMMENT ON TABLE nom_entregable IS 'Nomenclador de entregable.';
COMMENT ON COLUMN nom_entregable.identregable IS 'Identificador de la tabla nom_entregable.';
COMMENT ON COLUMN nom_entregable.nombre IS 'Nombre del entregable.';
COMMENT ON COLUMN nom_entregable.fechainicio IS 'Es la fecha de inicio.';
COMMENT ON COLUMN nom_entregable.fechafin IS 'Es la fecha fin.';
COMMENT ON COLUMN nom_entregable.descripcion IS 'Es la descripción de los entregables.';
CREATE SEQUENCE sec_estado_seq
    START WITH 10
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE nom_estado (
    idestado numeric(19,0) DEFAULT nextval('sec_estado_seq'::regclass) NOT NULL,
    nombre character varying(100) NOT NULL,
    fechainicio date NOT NULL,
    fechafin date,
    descripcion character varying(255),
    inicial numeric(1,0) NOT NULL,
    icono character varying(255),
    acciones json
);
COMMENT ON TABLE nom_estado IS 'Guarda los estados de las transiciones.';
COMMENT ON COLUMN nom_estado.idestado IS 'Identificador de la tabla nom_estado.';
COMMENT ON COLUMN nom_estado.nombre IS 'Nombre del estado.';
COMMENT ON COLUMN nom_estado.fechainicio IS 'Es la fecha de inicio.';
COMMENT ON COLUMN nom_estado.fechafin IS 'Es la fecha fin.';
COMMENT ON COLUMN nom_estado.descripcion IS 'Guarda la descripción del estado.';
COMMENT ON COLUMN nom_estado.inicial IS 'Determina que estado es inicial.';
COMMENT ON COLUMN nom_estado.icono IS 'Guarda la clase CCS que identifica la imagen del estado.';
COMMENT ON COLUMN nom_estado.acciones IS 'Guarda en el campo json las acciones que permite ese estado. Ejemplo: adicionar, eliminar.';
CREATE SEQUENCE sec_formatonumcontrato_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE nom_formatonumcontrato (
    idformatonumcontrato numeric(10,0) DEFAULT nextval('sec_formatonumcontrato_seq'::regclass) NOT NULL,
    denominacion character varying(100)
);
COMMENT ON TABLE nom_formatonumcontrato IS 'Guarda el formato número del contrato.';
COMMENT ON COLUMN nom_formatonumcontrato.idformatonumcontrato IS 'Identificador de la tabla.';
COMMENT ON COLUMN nom_formatonumcontrato.denominacion IS 'Denominación del formato.';
CREATE SEQUENCE sec_formatonumcontratoelemento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE nom_formatonumcontratoelemento (
    idformatonumcontratoelemento numeric(10,0) DEFAULT nextval('sec_formatonumcontratoelemento_seq'::regclass) NOT NULL,
    denominacion character varying(100) NOT NULL,
    ejemplo character varying(100) NOT NULL,
    orden numeric(2,0) NOT NULL,
    tipo numeric(1,0) NOT NULL,
    idformatonumcontrato numeric(10,0) NOT NULL
);
COMMENT ON TABLE nom_formatonumcontratoelemento IS 'Guarda el elemento del formato número del contrato.';
COMMENT ON COLUMN nom_formatonumcontratoelemento.idformatonumcontratoelemento IS 'Identificador de la tabla.';
COMMENT ON COLUMN nom_formatonumcontratoelemento.denominacion IS 'Denominación del formato.';
COMMENT ON COLUMN nom_formatonumcontratoelemento.ejemplo IS 'Guarda el ejemplo del elemento.';
COMMENT ON COLUMN nom_formatonumcontratoelemento.orden IS 'Guarda el orden a mostrar en el formato.';
COMMENT ON COLUMN nom_formatonumcontratoelemento.tipo IS 'Define si es numérico guarda valor 3, fecha guarda valor 2, nomenclador guarda valor 4 o texto guarda valor 1.';
COMMENT ON COLUMN nom_formatonumcontratoelemento.idformatonumcontrato IS 'Identificador del formato de número de contrato.';
CREATE TABLE nom_formatonumcontratoelementofecha (
    idformatonumcontratoelemento numeric(10,0) NOT NULL,
    formato character varying(50) NOT NULL,
    generada numeric(1,0) NOT NULL,
    nombreparametro character varying(50)
);
COMMENT ON TABLE nom_formatonumcontratoelementofecha IS 'Guarda la fecha del elemento del formato número del contrato.';
COMMENT ON COLUMN nom_formatonumcontratoelementofecha.idformatonumcontratoelemento IS 'Identificador de la tabla.';
COMMENT ON COLUMN nom_formatonumcontratoelementofecha.formato IS 'Guarda el formato del número.';
COMMENT ON COLUMN nom_formatonumcontratoelementofecha.generada IS 'Guarda los datos que son generados.';
COMMENT ON COLUMN nom_formatonumcontratoelementofecha.nombreparametro IS 'Nombre del parámetro.';
CREATE TABLE nom_formatonumcontratoelementonomenclador (
    idformatonumcontratoelemento numeric(10,0) NOT NULL,
    idnomenclador numeric(3,0) NOT NULL,
    nombreparametro character varying(50) NOT NULL
);
COMMENT ON TABLE nom_formatonumcontratoelementonomenclador IS 'Guarda los valores del elemento nomenclador.';
COMMENT ON COLUMN nom_formatonumcontratoelementonomenclador.idformatonumcontratoelemento IS 'Identificador del formato número del contrato.';
COMMENT ON COLUMN nom_formatonumcontratoelementonomenclador.idnomenclador IS 'Identificador del nomenclador.';
COMMENT ON COLUMN nom_formatonumcontratoelementonomenclador.nombreparametro IS 'Guarda el nombre del parámetro.';
CREATE SEQUENCE sec_formatonumcontratoelementonomencladorvalor_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE nom_formatonumcontratoelementonomencladorvalor (
    idformatonumcontratoelementonomencladorvalor numeric(19,0) DEFAULT nextval('sec_formatonumcontratoelementonomencladorvalor_seq'::regclass) NOT NULL,
    idnomencladorelemento numeric(19,0),
    valor character varying(150),
    idformatonumcontratoelemento numeric(10,0)
);
COMMENT ON TABLE nom_formatonumcontratoelementonomencladorvalor IS 'Guarda los valores del elemento nomenclador valor.';
COMMENT ON COLUMN nom_formatonumcontratoelementonomencladorvalor.idformatonumcontratoelementonomencladorvalor IS 'Identificador del formato número contrato del elemento  nomenclador valor.';
COMMENT ON COLUMN nom_formatonumcontratoelementonomencladorvalor.idnomencladorelemento IS 'Identificador del nomenclador elemento.';
COMMENT ON COLUMN nom_formatonumcontratoelementonomencladorvalor.valor IS 'Guarda el valor asociado al identificador del valor del nomenclador.';
COMMENT ON COLUMN nom_formatonumcontratoelementonomencladorvalor.idformatonumcontratoelemento IS 'Identificador del formato número del contrato elemento.';
CREATE TABLE nom_formatonumcontratoelementonumerico (
    idformatonumcontratoelemento numeric(10,0) NOT NULL,
    longitud numeric(2,0) NOT NULL,
    incluircerosizquierda numeric(1,0) DEFAULT 0 NOT NULL
);
COMMENT ON TABLE nom_formatonumcontratoelementonumerico IS 'Guarda los valores del elemento numérico.';
COMMENT ON COLUMN nom_formatonumcontratoelementonumerico.idformatonumcontratoelemento IS 'Identificador de la tabla.
';
COMMENT ON COLUMN nom_formatonumcontratoelementonumerico.longitud IS 'Guarda la longitud que debe tener el número del contrato.';
COMMENT ON COLUMN nom_formatonumcontratoelementonumerico.incluircerosizquierda IS 'Completa con ceros la longitud de entrada.';
CREATE TABLE nom_formatonumcontratoelementoparametro (
    idformatonumcontratoelemento numeric(10,0) NOT NULL,
    nombreparametro character varying(50) NOT NULL
);
COMMENT ON TABLE nom_formatonumcontratoelementoparametro IS 'Guarda el número de contrato del elemento parámetro.';
COMMENT ON COLUMN nom_formatonumcontratoelementoparametro.idformatonumcontratoelemento IS 'Identificador de la tabla.';
COMMENT ON COLUMN nom_formatonumcontratoelementoparametro.nombreparametro IS 'Guarda el nombre de la tabla.';
CREATE TABLE nom_formatonumcontratoelementotexto (
    idformatonumcontratoelemento numeric(10,0) NOT NULL,
    caracteres character varying(150) NOT NULL
);
COMMENT ON TABLE nom_formatonumcontratoelementotexto IS 'Nomenclador de formato número contrato elemento texto.';
COMMENT ON COLUMN nom_formatonumcontratoelementotexto.idformatonumcontratoelemento IS 'Identificador de formato número contrato del elemento.';
COMMENT ON COLUMN nom_formatonumcontratoelementotexto.caracteres IS 'Guarda los caracteres que se desee asociar.';
CREATE SEQUENCE sec_incoterm_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE nom_incoterm (
    idincoterm numeric(19,0) DEFAULT nextval('sec_incoterm_seq'::regclass) NOT NULL,
    nombre character varying(100) NOT NULL,
    abreviatura character varying(10) NOT NULL,
    fechainicio date NOT NULL,
    fechafin date,
    descripcion character varying(255)
);
COMMENT ON TABLE nom_incoterm IS 'Nomenclador de incoterm.';
COMMENT ON COLUMN nom_incoterm.idincoterm IS 'Identificador de la tabla nom_incoterm.';
COMMENT ON COLUMN nom_incoterm.nombre IS 'Nombre de incoterm.';
COMMENT ON COLUMN nom_incoterm.abreviatura IS 'Abreviatura de incoterm.';
COMMENT ON COLUMN nom_incoterm.fechainicio IS 'Es la fecha de inicio.';
COMMENT ON COLUMN nom_incoterm.fechafin IS 'Es la fecha fin.';
COMMENT ON COLUMN nom_incoterm.descripcion IS 'Guarda la descripción del incoterm.';
CREATE SEQUENCE sec_mediopago_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE nom_mediodepago (
    idmediodepago numeric(19,0) DEFAULT nextval('sec_mediopago_seq'::regclass) NOT NULL,
    nombre character varying(100) NOT NULL,
    fechainicio date NOT NULL,
    fechafin date,
    descripcion character varying(255)
);
COMMENT ON TABLE nom_mediodepago IS 'Nomenclador de medio de pago.';
COMMENT ON COLUMN nom_mediodepago.idmediodepago IS 'Identificador de la tabla nom_mediodepago.';
COMMENT ON COLUMN nom_mediodepago.nombre IS 'Nombre del medio de pago.';
COMMENT ON COLUMN nom_mediodepago.fechainicio IS 'Es la fecha de inicio.';
COMMENT ON COLUMN nom_mediodepago.fechafin IS 'Es la fecha fin.';
COMMENT ON COLUMN nom_mediodepago.descripcion IS 'Guarda la descripción del  pago.';
CREATE SEQUENCE sec_periodicidad_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE nom_periodicidad (
    idperiodicidad numeric(19,0) DEFAULT nextval('sec_periodicidad_seq'::regclass) NOT NULL,
    denominacion character varying(100),
    descripcion character varying(255),
    fechainicio date NOT NULL,
    fechafin date
);
COMMENT ON TABLE nom_periodicidad IS 'Guarda el tiempo del contrato.';
COMMENT ON COLUMN nom_periodicidad.idperiodicidad IS 'Identificador de la periodicidad.';
COMMENT ON COLUMN nom_periodicidad.denominacion IS 'Guarda la denominacion de la periodicidad.';
COMMENT ON COLUMN nom_periodicidad.descripcion IS 'Descripción de la periodicidad.';
COMMENT ON COLUMN nom_periodicidad.fechainicio IS 'Fecha de inicio.';
COMMENT ON COLUMN nom_periodicidad.fechafin IS 'Fecha fin.';
CREATE SEQUENCE sec_prioridad_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE nom_prioridad (
    idprioridad numeric(19,0) DEFAULT nextval('sec_prioridad_seq'::regclass) NOT NULL,
    denominacion character varying(100),
    descripcion character varying(255),
    fechainicio date NOT NULL,
    fechafin date
);
COMMENT ON TABLE nom_prioridad IS 'Guarda la prioridad del contrato.';
COMMENT ON COLUMN nom_prioridad.idprioridad IS 'Identificador de la prioridad.';
COMMENT ON COLUMN nom_prioridad.denominacion IS 'La denominación.';
COMMENT ON COLUMN nom_prioridad.descripcion IS 'La descripción.';
COMMENT ON COLUMN nom_prioridad.fechainicio IS 'La fecha de inicio.';
COMMENT ON COLUMN nom_prioridad.fechafin IS 'La fecha fin.';
CREATE SEQUENCE sec_proceso_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE nom_proceso (
    idproceso numeric(19,0) DEFAULT nextval('sec_proceso_seq'::regclass) NOT NULL,
    denominacion character varying(255),
    descripcion character varying(255),
    fechainicio date,
    fechafin date,
    identificador character varying(255)
);
COMMENT ON TABLE nom_proceso IS 'Guarda en proceso del contrato.';
COMMENT ON COLUMN nom_proceso.idproceso IS 'Identificador del proceso.';
COMMENT ON COLUMN nom_proceso.denominacion IS 'Guarda la denominación.';
COMMENT ON COLUMN nom_proceso.descripcion IS 'Guarda la descripción.';
COMMENT ON COLUMN nom_proceso.fechainicio IS 'Guarda la fecha de inicio.';
COMMENT ON COLUMN nom_proceso.fechafin IS 'Guarda la fecha fin del proceso.';
COMMENT ON COLUMN nom_proceso.identificador IS 'Guarda el identificador.';
CREATE SEQUENCE sec_sector_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE nom_sector (
    idsector numeric(19,0) DEFAULT nextval('sec_sector_seq'::regclass) NOT NULL,
    denominacion character varying(255),
    descripcion character varying(255),
    fechainicio date,
    fechafin date
);
COMMENT ON TABLE nom_sector IS 'Guarda los sectores definidos a nivel de país.';
COMMENT ON COLUMN nom_sector.idsector IS 'Identificador del sector.';
COMMENT ON COLUMN nom_sector.denominacion IS 'Guarda la denominación del sector.';
COMMENT ON COLUMN nom_sector.descripcion IS 'Guarda la descripción del sector.';
COMMENT ON COLUMN nom_sector.fechainicio IS 'Guarda la fecha de inicio.';
COMMENT ON COLUMN nom_sector.fechafin IS 'Guarda la fecha fin.';
CREATE SEQUENCE sec_transicion_seq
    START WITH 8
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE nom_transicion (
    idtransicion numeric(19,0) DEFAULT nextval('sec_transicion_seq'::regclass) NOT NULL,
    idestadoinicial numeric(19,0) NOT NULL,
    idestadofinal numeric(19,0) NOT NULL,
    fechainicio date NOT NULL,
    fechafin date,
    descripcion character varying(255),
    idproceso numeric(19,0),
    idestructura numeric(19,0),
    notificar numeric(1,0) DEFAULT 0
);
COMMENT ON TABLE nom_transicion IS 'Nomenclador de transición.';
COMMENT ON COLUMN nom_transicion.idtransicion IS 'Identificador de la tabla transición.';
COMMENT ON COLUMN nom_transicion.idestadoinicial IS 'Identificador del estado inicial.';
COMMENT ON COLUMN nom_transicion.idestadofinal IS 'Identificador del estado final.';
COMMENT ON COLUMN nom_transicion.fechainicio IS 'Es la fecha de inicio.';
COMMENT ON COLUMN nom_transicion.fechafin IS 'Es la fecha fin.';
COMMENT ON COLUMN nom_transicion.descripcion IS 'Guarda la descripción de la transición.';
COMMENT ON COLUMN nom_transicion.idproceso IS 'Identificador del proceso.';
COMMENT ON COLUMN nom_transicion.notificar IS 'En 0 si no se notifica en 1 si lo hace';
CREATE SEQUENCE sec_contratomarco_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE sec_contratomarcoclausula_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE sec_elementocontrato_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999
    CACHE 1;
CREATE SEQUENCE sec_elementotipocontratoidelemento_seq
    START WITH 100
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999
    CACHE 1;

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET search_path = mod_crmcontratacion, pg_catalog;
SET search_path = mod_crmadministracion, pg_catalog;
SET search_path = mod_crmcontratacion, pg_catalog;
SET search_path = mod_crmadministracion, pg_catalog;
SET search_path = mod_crmclienteproveedor, pg_catalog;
SET search_path = mod_crmcontratacion, pg_catalog;
SET search_path = mod_crmadministracion, pg_catalog;
INSERT INTO conf_modulo (idconfmodulo, config, valores, idestructuracomun) VALUES (150, '[{"securityFunction":true,"$namespace":"Nomencladores","$className":"Contratacion.module.Nomencladores","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true},{"securityFunction":true,"$namespace":"TipoContrato","$className":"Contratacion.module.TipoContrato","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"SolicitudNegocio","$className":"Contratacion.module.SolicitudNegocio","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"OfertaNegocio","$className":"Contratacion.module.OfertaNegocio","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"Proformas","$className":"Contratacion.module.Proformas","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"GestionContrato","$className":"Contratacion.module.GestionContrato","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"Facturacion","$className":"Contratacion.module.Facturacion","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"SolicitudPago","$className":"Contratacion.module.SolicitudPago","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"Comite","$className":"Contratacion.module.Comite","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"Recuperaciones","$className":"Contratacion.module.Recuperaciones","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"GestionClienteProveedor","$className":"Clientesproveedores.module.GestionClienteProveedor","isModule":true,"parent":{"$className":"CRM.module.Clientesproveedores","$namespace":"Clientesproveedores","isModule":true}},{"$className":"CRM.module.Clientesproveedores","$namespace":"Clientesproveedores","isModule":true},{"securityFunction":true,"$namespace":"NomClienteProveedor","$className":"Clientesproveedores.module.NomClienteProveedor","isModule":true,"parent":{"$className":"CRM.module.Clientesproveedores","$namespace":"Clientesproveedores","isModule":true}},{"securityFunction":true,"$namespace":"PerfilesClientes","$className":"Clientesproveedores.module.PerfilesClientes","isModule":true,"parent":{"$className":"CRM.module.Clientesproveedores","$namespace":"Clientesproveedores","isModule":true}},{"securityFunction":true,"$namespace":"Segmentacion","$className":"Clientesproveedores.module.Segmentacion","isModule":true,"parent":{"$className":"CRM.module.Clientesproveedores","$namespace":"Clientesproveedores","isModule":true}},{"securityFunction":true,"$namespace":"Solicitud","$className":"Clientesproveedores.module.Solicitud","isModule":true,"parent":{"$className":"CRM.module.Clientesproveedores","$namespace":"Clientesproveedores","isModule":true}},{"securityFunction":true,"$namespace":"PanelControlMarketing","$className":"Marketing.module.PanelControlMarketing","isModule":true,"parent":{"$className":"CRM.module.Marketing","$namespace":"Marketing","isModule":true}},{"$className":"CRM.module.Marketing","$namespace":"Marketing","isModule":true},{"securityFunction":true,"$namespace":"GestionCampanna","$className":"Marketing.module.GestionCampanna","isModule":true,"parent":{"$className":"CRM.module.Marketing","$namespace":"Marketing","isModule":true}},{"securityFunction":true,"$namespace":"GestionOportunidad","$className":"Marketing.module.GestionOportunidad","isModule":true,"parent":{"$className":"CRM.module.Marketing","$namespace":"Marketing","isModule":true}}]', '{"Contratacion":"true","Nomencladores":"true","TipoContrato":"true","SolicitudNegocio":"true","OfertaNegocio":"true","Proformas":"true","GestionContrato":"true","Facturacion":"true","SolicitudPago":"true","Comite":"true","Recuperaciones":"true","GestionClienteProveedor":"true","NomClienteProveedor":"true","PerfilesClientes":"false","Segmentacion":"false","Solicitud":"false","PanelControlMarketing":"false","GestionCampanna":"false","GestionOportunidad":"false"}', 100000532);
INSERT INTO conf_modulo (idconfmodulo, config, valores, idestructuracomun) VALUES (152, '[{"securityFunction":true,"$namespace":"Nomencladores","$className":"Contratacion.module.Nomencladores","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true},{"securityFunction":true,"$namespace":"TipoContrato","$className":"Contratacion.module.TipoContrato","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"SolicitudNegocio","$className":"Contratacion.module.SolicitudNegocio","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"OfertaNegocio","$className":"Contratacion.module.OfertaNegocio","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"Proformas","$className":"Contratacion.module.Proformas","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"GestionContrato","$className":"Contratacion.module.GestionContrato","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"Facturacion","$className":"Contratacion.module.Facturacion","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"SolicitudPago","$className":"Contratacion.module.SolicitudPago","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"Comite","$className":"Contratacion.module.Comite","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"Recuperaciones","$className":"Contratacion.module.Recuperaciones","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"GestionClienteProveedor","$className":"Clientesproveedores.module.GestionClienteProveedor","isModule":true,"parent":{"$className":"CRM.module.Clientesproveedores","$namespace":"Clientesproveedores","isModule":true}},{"$className":"CRM.module.Clientesproveedores","$namespace":"Clientesproveedores","isModule":true},{"securityFunction":true,"$namespace":"NomClienteProveedor","$className":"Clientesproveedores.module.NomClienteProveedor","isModule":true,"parent":{"$className":"CRM.module.Clientesproveedores","$namespace":"Clientesproveedores","isModule":true}},{"securityFunction":true,"$namespace":"PerfilesClientes","$className":"Clientesproveedores.module.PerfilesClientes","isModule":true,"parent":{"$className":"CRM.module.Clientesproveedores","$namespace":"Clientesproveedores","isModule":true}},{"securityFunction":true,"$namespace":"Segmentacion","$className":"Clientesproveedores.module.Segmentacion","isModule":true,"parent":{"$className":"CRM.module.Clientesproveedores","$namespace":"Clientesproveedores","isModule":true}},{"securityFunction":true,"$namespace":"Solicitud","$className":"Clientesproveedores.module.Solicitud","isModule":true,"parent":{"$className":"CRM.module.Clientesproveedores","$namespace":"Clientesproveedores","isModule":true}},{"securityFunction":true,"$namespace":"PanelControlMarketing","$className":"Marketing.module.PanelControlMarketing","isModule":true,"parent":{"$className":"CRM.module.Marketing","$namespace":"Marketing","isModule":true}},{"$className":"CRM.module.Marketing","$namespace":"Marketing","isModule":true},{"securityFunction":true,"$namespace":"GestionCampanna","$className":"Marketing.module.GestionCampanna","isModule":true,"parent":{"$className":"CRM.module.Marketing","$namespace":"Marketing","isModule":true}},{"securityFunction":true,"$namespace":"GestionOportunidad","$className":"Marketing.module.GestionOportunidad","isModule":true,"parent":{"$className":"CRM.module.Marketing","$namespace":"Marketing","isModule":true}}]', '{"Contratacion":"true","Nomencladores":"true","TipoContrato":"true","SolicitudNegocio":"true","OfertaNegocio":"true","Proformas":"true","GestionContrato":"true","Facturacion":"true","SolicitudPago":"true","Comite":"true","Recuperaciones":"true","GestionClienteProveedor":"true","NomClienteProveedor":"true","PerfilesClientes":"true","Segmentacion":"true","Solicitud":"true","PanelControlMarketing":"true","GestionCampanna":"true","GestionOportunidad":"true"}', 100530362);
INSERT INTO conf_modulo (idconfmodulo, config, valores, idestructuracomun) VALUES (153, '[{"securityFunction":true,"$namespace":"Nomencladores","$className":"Contratacion.module.Nomencladores","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"$namespace":"Contratacion","$className":"CRM.module.Contratacion","isModule":true,"parent":{"$className":"CRM.$application","$namespace":"CRM","isModule":false}},{"securityFunction":true,"$namespace":"TipoContrato","$className":"Contratacion.module.TipoContrato","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"SolicitudNegocio","$className":"Contratacion.module.SolicitudNegocio","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"OfertaNegocio","$className":"Contratacion.module.OfertaNegocio","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"Proformas","$className":"Contratacion.module.Proformas","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"GestionContrato","$className":"Contratacion.module.GestionContrato","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"Facturacion","$className":"Contratacion.module.Facturacion","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"SolicitudPago","$className":"Contratacion.module.SolicitudPago","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"Comite","$className":"Contratacion.module.Comite","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"Recuperaciones","$className":"Contratacion.module.Recuperaciones","isModule":true,"parent":{"$className":"CRM.module.Contratacion","$namespace":"Contratacion","isModule":true}},{"securityFunction":true,"$namespace":"GestionClienteProveedor","$className":"Clientesproveedores.module.GestionClienteProveedor","isModule":true,"parent":{"$className":"CRM.module.Clientesproveedores","$namespace":"Clientesproveedores","isModule":true}},{"$namespace":"Clientesproveedores","$className":"CRM.module.Clientesproveedores","isModule":true,"parent":{"$className":"CRM.$application","$namespace":"CRM","isModule":false}},{"securityFunction":true,"$namespace":"NomClienteProveedor","$className":"Clientesproveedores.module.NomClienteProveedor","isModule":true,"parent":{"$className":"CRM.module.Clientesproveedores","$namespace":"Clientesproveedores","isModule":true}},{"securityFunction":true,"$namespace":"PerfilesClientes","$className":"Clientesproveedores.module.PerfilesClientes","isModule":true,"parent":{"$className":"CRM.module.Clientesproveedores","$namespace":"Clientesproveedores","isModule":true}},{"securityFunction":true,"$namespace":"Segmentacion","$className":"Clientesproveedores.module.Segmentacion","isModule":true,"parent":{"$className":"CRM.module.Clientesproveedores","$namespace":"Clientesproveedores","isModule":true}},{"securityFunction":true,"$namespace":"Solicitud","$className":"Clientesproveedores.module.Solicitud","isModule":true,"parent":{"$className":"CRM.module.Clientesproveedores","$namespace":"Clientesproveedores","isModule":true}},{"securityFunction":true,"$namespace":"PanelControlMarketing","$className":"Marketing.module.PanelControlMarketing","isModule":true,"parent":{"$className":"CRM.module.Marketing","$namespace":"Marketing","isModule":true}},{"$namespace":"Marketing","$className":"CRM.module.Marketing","isModule":true,"parent":{"$className":"CRM.$application","$namespace":"CRM","isModule":false}},{"securityFunction":true,"$namespace":"GestionCampanna","$className":"Marketing.module.GestionCampanna","isModule":true,"parent":{"$className":"CRM.module.Marketing","$namespace":"Marketing","isModule":true}},{"securityFunction":true,"$namespace":"GestionOportunidad","$className":"Marketing.module.GestionOportunidad","isModule":true,"parent":{"$className":"CRM.module.Marketing","$namespace":"Marketing","isModule":true}}]', '{"Marketing":"false","Clientesproveedores":"true","Contratacion":"true","Nomencladores":"true","TipoContrato":"true","SolicitudNegocio":"true","OfertaNegocio":"true","Proformas":"true","GestionContrato":"true","Facturacion":"false","SolicitudPago":"true","Comite":"true","Recuperaciones":"true","GestionClienteProveedor":"true","NomClienteProveedor":"true","PerfilesClientes":"false","Segmentacion":"false","Solicitud":"false","PanelControlMarketing":"false","GestionCampanna":"false","GestionOportunidad":"false"}', 200530666);
INSERT INTO conf_ofertanegocio (idconfoferta, idestadosolicitudinsertar, idespaciotrabajo, espaciotrabajo, activo, idestadosolicitudofertainsertar) VALUES (1, 9, '10f9e2ae-cb0a-4776-bdd8-baeb9920b52d', 'Compartido', 1, NULL);
INSERT INTO conf_solicitudnegocio (idconfsolicitud, idespaciotrabajo, espaciotrabajo, activo) VALUES (1, '67087b9c-0ae0-4dc7-bb07-e046d3b6c61b', 'Espacios personales de usuario', 1);
INSERT INTO dat_moduloreporte (idmodulo, identificador, denominacion) VALUES (10, 'cliente', 'Cliente');
INSERT INTO dat_moduloreporte (idmodulo, identificador, denominacion) VALUES (7, 'contratacion', 'Contratación');
INSERT INTO dat_reporte (idreporte, idpadre, denominacion, agrupador, tipocontenido, recurso, url, nombrecomponente, idmodulo) VALUES (1, 1, 'Contrato', 1, NULL, NULL, NULL, NULL, 7);
INSERT INTO dat_reporte (idreporte, idpadre, denominacion, agrupador, tipocontenido, recurso, url, nombrecomponente, idmodulo) VALUES (23, 1, 'Cantidad de Contrato por Tipo', 0, 2, 'crmContratosTipo.jrxml', NULL, NULL, 7);
INSERT INTO dat_reporte (idreporte, idpadre, denominacion, agrupador, tipocontenido, recurso, url, nombrecomponente, idmodulo) VALUES (24, 1, 'Cantidad de Contrato a vencer', 0, 2, 'crmFechasContratos.jrxml', NULL, NULL, 7);
INSERT INTO dat_reporte (idreporte, idpadre, denominacion, agrupador, tipocontenido, recurso, url, nombrecomponente, idmodulo) VALUES (25, 25, 'Clientes Proveedores', 0, 3, NULL, NULL, 'RecupClientesProveedores.view.Main', 7);
INSERT INTO dat_reporte (idreporte, idpadre, denominacion, agrupador, tipocontenido, recurso, url, nombrecomponente, idmodulo) VALUES (22, 1, 'Cantidad de Contrato por estado', 0, 2, 'crmEstadoContrato.jrxml', NULL, NULL, 7);
INSERT INTO dat_reporte (idreporte, idpadre, denominacion, agrupador, tipocontenido, recurso, url, nombrecomponente, idmodulo) VALUES (29, 29, 'Recuperación General', 0, 3, NULL, NULL, 'ReporteContratacion.view.Main', 7);
INSERT INTO dat_reporte (idreporte, idpadre, denominacion, agrupador, tipocontenido, recurso, url, nombrecomponente, idmodulo) VALUES (30, 30, 'Facultades por cliente', 0, 2, 'crmClienteContactoFacultadesCartaVertical.jrxml', NULL, NULL, 7);
INSERT INTO dat_reporte (idreporte, idpadre, denominacion, agrupador, tipocontenido, recurso, url, nombrecomponente, idmodulo) VALUES (31, 1, 'Listado de Contratos', 0, 2, 'crmContratosA4Horizontal.jrxml', NULL, NULL, 7);
INSERT INTO dat_reporte (idreporte, idpadre, denominacion, agrupador, tipocontenido, recurso, url, nombrecomponente, idmodulo) VALUES (33, 33, 'Reporte de comite de negocio', 0, 2, 'crmReporteComite.jrxml', NULL, NULL, 7);
INSERT INTO dat_reportefiltro (idfiltro, denominacion, orden, anchocolumna, nombreparametro, tipo, javatype, idreporte) VALUES (12, 'Estado', 1, 200, 'idestado', 4, 'java.math.Bigdecimal', 22);
INSERT INTO dat_reportefiltro (idfiltro, denominacion, orden, anchocolumna, nombreparametro, tipo, javatype, idreporte) VALUES (14, 'Tipo Contrato', 1, 500, 'idtipo', 4, 'java.math.Bigdecimal', 23);
INSERT INTO dat_reportefiltro (idfiltro, denominacion, orden, anchocolumna, nombreparametro, tipo, javatype, idreporte) VALUES (15, 'Cantidad días', 1, 100, 'idf', 3, 'java.math.Bigdecimal', 24);
INSERT INTO dat_reportefiltro (idfiltro, denominacion, orden, anchocolumna, nombreparametro, tipo, javatype, idreporte) VALUES (24, 'Fecha de inicio', 1, 140, 'fechainicio', 2, 'java.util.Date', 33);
INSERT INTO dat_reportefiltro (idfiltro, denominacion, orden, anchocolumna, nombreparametro, tipo, javatype, idreporte) VALUES (25, 'Fecha de fin', 2, 140, 'fechafin', 2, 'java.util.Date', 33);
INSERT INTO dat_reportefiltro (idfiltro, denominacion, orden, anchocolumna, nombreparametro, tipo, javatype, idreporte) VALUES (26, 'Proceso', 3, 140, 'proceso', 4, 'java.lang.String', 33);
INSERT INTO dat_reportefiltro (idfiltro, denominacion, orden, anchocolumna, nombreparametro, tipo, javatype, idreporte) VALUES (22, 'Cliente Proveedor', 1, 350, 'idclientes', 4, 'java.lang.String', 30);
INSERT INTO dat_reportefiltronomenclador (idfiltro, nomidentificador, nomdenominacion, tipofuentedatos, sentenciasql, nomservicio, multipleseleccion, paginado) VALUES (14, 'idtipocontrato', 'denominacion', 0, 'SELECT 
 distinct tc.idtipocontrato,
  denominacion  
FROM 
  mod_crmcontratacion.dat_tipocontrato tc
inner join mod_crmcontratacion.dat_contrato c
on (tc.idtipocontrato=c.idtipocontrato)', NULL, 1, 1);
INSERT INTO dat_reportefiltronomenclador (idfiltro, nomidentificador, nomdenominacion, tipofuentedatos, sentenciasql, nomservicio, multipleseleccion, paginado) VALUES (26, 'identificador', 'denominacion', 0, 'SELECT p.denominacion, p.identificador FROM mod_crmcontratacion.nom_proceso p', NULL, 0, 0);
INSERT INTO dat_reportefiltronomenclador (idfiltro, nomidentificador, nomdenominacion, tipofuentedatos, sentenciasql, nomservicio, multipleseleccion, paginado) VALUES (12, 'idestado', 'nombre', 0, 'SELECT idestado, nombre  
FROM mod_crmcontratacion.nom_estado ', NULL, 0, 0);
INSERT INTO dat_reportefiltronomenclador (idfiltro, nomidentificador, nomdenominacion, tipofuentedatos, sentenciasql, nomservicio, multipleseleccion, paginado) VALUES (22, 'idclientesproveedores', 'codigo', 0, 'SELECT * FROM (SELECT idclientesproveedores, codigo||'' - ''||nombre   as codigo, idestructura FROM mod_datosmaestros.nom_clientesproveedor) as p where codigo is not null', NULL, 1, 0);
INSERT INTO dat_reportefiltronumerico (idfiltro, valorminimo, valormaximo) VALUES (15, 1, 300);
SELECT pg_catalog.setval('sec_accesodirecto_seq', 13, true);
SELECT pg_catalog.setval('sec_comitegeneral_seq', 12, true);
SELECT pg_catalog.setval('sec_comitegestordocumental_seq', 1, true);
SELECT pg_catalog.setval('sec_comitetransicion_seq', 868, true);
SELECT pg_catalog.setval('sec_compartimentacion_seq', 7, true);
SELECT pg_catalog.setval('sec_confmodulo_seq', 153, true);
SELECT pg_catalog.setval('sec_contratocontabilidad_seq', 1, false);
SELECT pg_catalog.setval('sec_contratogeneral_seq', 2, false);
SELECT pg_catalog.setval('sec_contratogestordocumental_seq', 4, true);
SELECT pg_catalog.setval('sec_contratoplanificacion_seq', 7, true);
SELECT pg_catalog.setval('sec_moduloreporte_seq', 14, true);
SELECT pg_catalog.setval('sec_plantilla_seq', 47, true);
SELECT pg_catalog.setval('sec_plantillaestructura_seq', 64, true);
SELECT pg_catalog.setval('sec_reporte_seq', 33, true);
SELECT pg_catalog.setval('sec_reportefiltro_seq', 26, true);
SELECT pg_catalog.setval('sec_solicitudpagogestordocumental_seq', 1, false);
SELECT pg_catalog.setval('sec_valorespordefecto_seq', 1, false);
SET search_path = mod_crmclienteproveedor, pg_catalog;
INSERT INTO dat_facultad (idfacultad, idtipofacultad, idcontacto) VALUES (1, 3, 77);
INSERT INTO dat_facultad (idfacultad, idtipofacultad, idcontacto) VALUES (2, 1, 77);
INSERT INTO dat_facultad (idfacultad, idtipofacultad, idcontacto) VALUES (3, 1, 78);
INSERT INTO dat_facultad (idfacultad, idtipofacultad, idcontacto) VALUES (4, 2, 79);
INSERT INTO dat_facultad (idfacultad, idtipofacultad, idcontacto) VALUES (5, 2, 82);
INSERT INTO dat_facultad (idfacultad, idtipofacultad, idcontacto) VALUES (7, 4, 85);
INSERT INTO dat_facultad (idfacultad, idtipofacultad, idcontacto) VALUES (8, 3, 85);
INSERT INTO dat_facultad (idfacultad, idtipofacultad, idcontacto) VALUES (13, 4, 83);
INSERT INTO dat_facultad (idfacultad, idtipofacultad, idcontacto) VALUES (14, 1, 85);
INSERT INTO dat_facultad (idfacultad, idtipofacultad, idcontacto) VALUES (15, 4, 86);
INSERT INTO dat_facultad (idfacultad, idtipofacultad, idcontacto) VALUES (16, 1, 86);
INSERT INTO dat_facultad (idfacultad, idtipofacultad, idcontacto) VALUES (17, 2, 87);
INSERT INTO dat_identificador (ididentificador, idtipocodigo, denominacion, idclienteproveedor) VALUES (1, 1, '653211', 990000009618);
INSERT INTO dat_identificador (ididentificador, idtipocodigo, denominacion, idclienteproveedor) VALUES (2, 1, '75455', 990000009617);
INSERT INTO dat_identificador (ididentificador, idtipocodigo, denominacion, idclienteproveedor) VALUES (3, 1, '85', 990000009617);
INSERT INTO dat_identificador (ididentificador, idtipocodigo, denominacion, idclienteproveedor) VALUES (4, 1, '987967964', 990000009619);
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (77, '161', 'Ministerio de Comunicaciones');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (78, '171', 'Ministerio del  Comercio Interior');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (79, '174', 'Ministerio del Comercio Exterior y la Inversión Extranjera');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (80, '211', 'Ministerio de Ciencia,Tecnología y Medio Ambiente');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (81, '221', 'Ministerio de Educación');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (82, '223', 'Ministerio de Educación Superior');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (83, '233', 'Instituto Cubano de Radio y Televisión');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (84, '234', 'Ministerio de  Cultura');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (85, '241', 'Ministerio de Salud Publica');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (86, '242', 'Instituto Nacional de Deportes,Educación Física y Recreación');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (87, '249', 'Contraloría General de la República');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (88, '251', 'Banco Nacional de Cuba');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (89, '253', 'Banco Popular de Ahorro');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (90, '254', 'Ministerio de Finanzas y Precios');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (91, '256', 'Ministerio de Turismo');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (92, '257', 'Banco Central de Cuba');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (93, '258', 'Banco de Crédito y Comercio');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (94, '259', 'Banco Exterior de Cuba');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (95, '261', 'Ministerio de Economía y Planificación');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (96, '262', 'Ministerio de Trabajo y Seguridad Social');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (97, '263', 'Ministerio de Justicia');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (98, '264', 'Ministerio de Relaciones Exteriores');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (99, '267', 'Tribunal Supremo Popular');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (100, '268', 'Fiscalía General de la República');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (101, '271', 'Ministerio de las Fuerzas Armadas Revolucionarias');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (102, '272', 'Ministerio del Interior');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (103, '300', 'Consejo de Estado');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (104, '301', 'Poder Popular Nacional - Asamblea Nacional');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (105, '302', 'Comité Ejecutivo del Consejo de Ministros');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (106, '304', 'Aduana General de la República Nivel Central');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (107, '305', 'Consejo de Ministros');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (108, '306', 'Oficina del Historiador de la Ciudad de la Habana');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (109, '311', 'Poder Popular de Pinar del Rio');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (110, '313', 'Poder Popular de La Habana');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (111, '314', 'Poder Popular de Matanzas');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (112, '315', 'Poder Popular de Villa Clara');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (113, '316', 'Poder Popular de Cienfuegos');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (114, '317', 'Poder Popular de Sancti Spíritus');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (115, '318', 'Poder Popular de Ciego de ÿvila');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (116, '319', 'Poder Popular de Camagüey');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (117, '320', 'Poder Popular de Las Tunas');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (118, '321', 'Poder Popular de Holguín');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (119, '322', 'Poder Popular de Granma');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (120, '323', 'Poder Popular de Santiago de Cuba');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (121, '324', 'Poder Popular de Guantánamo');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (122, '325', 'Poder Popular de Isla de la Juventud');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (123, '326', 'Poder Popular de Artemisa');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (124, '327', 'Poder Popular de Mayabeque');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (125, '501', 'Partido Comunista de Cuba');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (126, '502', 'Unión de Jóvenes Comunistas');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (127, '503', 'Organización de Pioneros José Marti');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (128, '504', 'Central de Trabajadores de Cuba');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (129, '505', 'Federación de Mujeres Cubanas');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (130, '506', 'Comité de Defensa de la Revolución');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (131, '507', 'Asociación Nacional de Agricultores Pequeños');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (132, '654', 'Grupo Empresarial PALCO');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (133, '658', 'GRUPO AZUCARERO');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (134, '692', 'Grupo de las Industrias Biotecnológica y Farmacéutica');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (135, '700', 'GRUPO EMPRESARIAL CENTRO HISTORICO');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (136, '743', 'GRUPO EMPRESARIAL DE RECICLJE');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (137, '970', 'Zona especial de Desarrollo Mariel');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (138, '998', 'No se subordina a un Organismo');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (139, '999', 'Organismo Desconocido');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (1, '020', 'GRUPO DE ADMINISTRACION EMPRESARIAL S.A.');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (2, '102', 'Ministerio de Industrias');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (3, '104', 'Ministerio de Energía y Minas');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (4, '111', 'Ministerio de la Industria Alimentaria');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (5, '113', 'Instituto Nacional de Recursos Hidráulicos');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (6, '126', 'Ministerio de la Construcción');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (7, '131', 'Ministerio de la Agricultura');
INSERT INTO nom_organismo (idorganismo, codigo, nombre) VALUES (8, '151', 'Ministerio del Transporte');
INSERT INTO nom_tipocodigo (idtipocodigo, denominacion, validacion) VALUES (1, 'Codigo contable', '');
INSERT INTO nom_tipocodigo (idtipocodigo, denominacion, validacion) VALUES (2, 'Código NIT', '');
INSERT INTO nom_tipofacultad (idtipofacultad, denominacion) VALUES (2, 'Hacer compras o servicios');
INSERT INTO nom_tipofacultad (idtipofacultad, denominacion) VALUES (4, 'Firmar cheques');
INSERT INTO nom_tipofacultad (idtipofacultad, denominacion) VALUES (3, 'Firmar facturas');
INSERT INTO nom_tipofacultad (idtipofacultad, denominacion) VALUES (1, 'Firmar contratos');
SELECT pg_catalog.setval('sec_cuestionario_seq', 7, true);
SELECT pg_catalog.setval('sec_facultad_seq', 17, true);
SELECT pg_catalog.setval('sec_identificador_seq', 4, true);
SELECT pg_catalog.setval('sec_organismo_seq', 139, true);
SELECT pg_catalog.setval('sec_pregunta_seq', 12, false);
SELECT pg_catalog.setval('sec_respuesta_seq', 13, false);
SELECT pg_catalog.setval('sec_tipocodigo_seq', 5, true);
SELECT pg_catalog.setval('sec_tipofacultad_seq', 4, true);
SELECT pg_catalog.setval('sec_tiporespuesta_seq', 4, true);
SET search_path = mod_crmcontratacion, pg_catalog;
INSERT INTO conf_entidadformatonumcontrato (identidadformatonumcontrato, identidad, idformatonumcontrato, contratodestino) VALUES (103, 200530666, 47, 1);
INSERT INTO conf_entidadformatonumcontratoincremento (identidadformatonumcontratoincremento, valorinicial, valor, idformatonumcontratoelemento, identidadformatonumcontrato) VALUES (141, 1, 1, 383, 103);
INSERT INTO dat_roltransicion (idroltransicion, idtransicion, idrol) VALUES (378, 119, 100000000001);
INSERT INTO dat_roltransicion (idroltransicion, idtransicion, idrol) VALUES (379, 120, 100000000001);
INSERT INTO dat_roltransicion (idroltransicion, idtransicion, idrol) VALUES (380, 121, 100000000001);
INSERT INTO dat_roltransicion (idroltransicion, idtransicion, idrol) VALUES (381, 122, 100000000001);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (54, 'CONTRATO DE ADMINISTRACIÓN PRODUCTIVA O DE SERVICIOS', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (55, 'CONTRATO DE AGENCIA', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (56, 'CONTRATO DE ALQUILER DE MEDIOS DE TRANSPORTE', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (57, 'CONTRATO DE ALQUILER Y RENTA DE MEDIOS DE TRANSPORTE', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (58, 'CONTRATO DE ARRENDAMIENTO', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (59, 'CONTRATO DE COMISIÓN', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (60, 'CONTRATO DE COMODATO', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (61, 'CONTRATO DE COMPRAVENTA', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (62, 'CONTRATO DE CONDiCIONES ESPECIFICAS', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (63, 'CONTRATO DE CONSIGNACIÓN', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (64, 'CONTRATO DE CONTROL TÉCNICO', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (65, 'CONTRATO DE COOPERACION PARA LA PRESTACIÓN DE SERVICIOS', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (66, 'CONTRATO DE DEPÓSITO', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (67, 'CONTRATO DE DESARROLLO', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (68, 'CONTRATO DE DOCUMENTACIÓN DE PROYECTOS', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (69, 'CONTRATO DE DONACIÓN', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (70, 'CONTRATO DE EJECUCIÓN DE OBRA', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (71, 'CONTRATO DE INVESTIGACIÓN INGENIERA APLICADA', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (72, 'CONTRATO DE LEASING', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (73, 'CONTRATO DE LICENCIA DE USO', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (74, 'CONTRATO DE MULTIMODAL DE TRANSPORTE', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (75, 'CONTRATO DE PERMUTA', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (76, 'CONTRATO DE PRESTACIÓN DE SERVICIOS', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (77, 'CONTRATO DE PRODUCCIÓN COOPERADA DE BIENES', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (78, 'CONTRATO DE SUMINISTRO', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (79, 'CONTRATO DE TRANSPORTE AÉREO DE CARGA Y PASAJEROS', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (80, 'CONTRATO DE TRANSPORTE MARÿTIMO DE CARGA Y PASAJEROS', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (81, 'CONTRATO DE TRANSPORTE MULTIMODAL', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (82, 'CONTRATO DE TRANSPORTE TERRESTRE DE CARGA', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (83, 'CONTRATO DE TRANSPORTE TERRESTRE DE PASAJEROS', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (84, 'CONTRATOS DE COOPERACIÓN', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (85, 'CONTRATOS DE PRESTACIÓN DE SERVICIOS', 200530666, 1, 1, '""', 0);
INSERT INTO dat_tipocontrato (idtipocontrato, denominacion, idestructuracomun, tipo, editable, compartimentacion, cliente) VALUES (86, 'CONTRATOS PARA LA PRODUCCIÓN COOPERADA DE BIENES O PARA LA PRESTACIÓN DE SERVICIOS', 200530666, 1, 1, '""', 0);
INSERT INTO nom_categoria (idcategoria, denominacion, descripcion, fechainicio, fechafin) VALUES (1, 'Acuerdos', 'Acuerdos', NULL, NULL);
INSERT INTO nom_categoria (idcategoria, denominacion, descripcion, fechainicio, fechafin) VALUES (2, 'Bases permanentes', 'Bases permanentes', NULL, NULL);
INSERT INTO nom_categoria (idcategoria, denominacion, descripcion, fechainicio, fechafin) VALUES (3, 'Contratos marcos', 'Contratos marcos', NULL, NULL);
INSERT INTO nom_categoria (idcategoria, denominacion, descripcion, fechainicio, fechafin) VALUES (4, 'Convenios', 'Convenios', NULL, NULL);
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (1, '', '2016-05-24', NULL, 'OBJETO DEL CONTRATO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (2, '', '2016-05-24', NULL, 'ALCANCE DEL CONTRATO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (3, '', '2016-05-24', NULL, 'VALOR DEL CONTRATO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (4, '', '2016-05-24', NULL, 'FORMA DE PAGO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (5, '', '2016-05-24', NULL, 'PERSONAL DE DIRECCIÓN');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (6, '', '2016-05-24', NULL, 'OTRAS CONDICIONES');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (7, '', '2016-05-24', NULL, 'VIGENCIA');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (8, '', '2016-05-24', NULL, 'LUGAR, TÉRMINOS Y CONDICIONES DE ENTREGA');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (9, '', '2016-05-24', NULL, 'PENALIDADES');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (10, '', '2016-05-24', NULL, 'CALIDAD y GARANTIA');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (11, '', '2016-05-24', NULL, 'ENVASE Y EMBALAJE');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (12, '', '2016-05-24', NULL, 'LEGISLACIÓN APLICABLE');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (13, '', '2016-05-24', NULL, 'DISPOSICIONES FINALES');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (14, '', '2016-05-24', NULL, 'PRECIO, VALOR Y FORMA DE PAGO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (15, '', '2016-05-24', NULL, 'RECLAMACIONES Y SOLUCIÓN DE CONTROVERSIAS');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (16, '', '2016-05-24', NULL, 'CAUSAS EXIMENTES DE RESPONSABILIDAD');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (17, '', '2016-05-24', NULL, 'CONFIDENCIALIDAD');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (18, '', '2016-05-24', NULL, 'CAUSAS DE TERMINACION DEL CONTRATO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (19, '', '2016-05-24', NULL, 'VIGENCIA DEL CONTRATO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (27, '', '2016-05-24', NULL, 'LEGISLACIÓN APLICABLE.');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (28, '', '2016-05-25', NULL, 'LUGAR Y CONDICIONES DE ENTREGA');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (29, '', '2016-05-25', NULL, 'IMPORTE');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (30, '', '2016-05-25', NULL, 'CONDICIONES Y FECHA DE ENTREGA');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (31, '', '2016-05-25', NULL, 'PRECIOS Y FORMA DE PAGO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (32, '', '2016-05-25', NULL, 'MARCAS');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (33, '', '2016-05-25', NULL, 'CALIDAD');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (34, '', '2016-05-25', NULL, 'INSPECCION');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (35, '', '2016-05-25', NULL, 'GARANTIA');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (36, '', '2016-05-25', NULL, 'RECLAMACIONES');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (37, '', '2016-05-25', NULL, 'TRANSPORTACION DE LAS MERCANCÿAS');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (38, '', '2016-05-25', NULL, 'SEGURO DE LA MERCANCÿA');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (39, '', '2016-05-25', NULL, 'PROMOCIÓN');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (40, '', '2016-05-25', NULL, 'EXONERACIONES');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (41, '', '2016-05-25', NULL, 'ARBITRAJE');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (42, '', '2016-05-26', NULL, 'DEFINICIONES');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (43, '', '2016-05-26', NULL, 'RELACIONES ENTRE LAS PARTES');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (44, '', '2016-05-26', NULL, 'ADMINISTRACIÓN');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (45, '', '2016-05-26', NULL, 'COMERCIALIZACION');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (46, '', '2016-05-26', NULL, 'FUERZA DE TRABAJO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (47, '', '2016-05-26', NULL, 'CUENTAS BANCARIAS, CAPITALES Y PRELACION DE PAGOS');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (48, '', '2016-05-26', NULL, 'REMUNERACIÓN');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (49, '', '2016-05-26', NULL, 'SEGUROS');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (50, '', '2016-05-26', NULL, 'DAÑO O DESTRUCCIÓN');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (51, '', '2016-05-26', NULL, 'FUERZA MAYOR');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (52, '', '2016-05-26', NULL, 'VIGENCIA Y TERMINACIÓN DEL CONTRATO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (53, '', '2016-05-26', NULL, 'INTEGRIDAD DEL CONTRATO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (54, '', '2016-05-26', NULL, 'OBLIGACIONES FISCALES');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (55, '', '2016-05-26', NULL, 'ARBITRAJE Y LEY APLICABLE');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (56, '', '2016-05-26', NULL, 'DISPOSICIONES GENERALES');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (57, '', '2016-05-26', NULL, 'NOTIFICACIONES');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (59, '', '2016-05-26', NULL, 'DE LA PRESTACIÓN DEL SERVICIO DE ALOJAMIENTO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (60, '', '2016-05-26', NULL, 'DE LA PRESTACIÓN DE LOS SERVICIOS GASTRONÓMICOS');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (108, '', '2016-05-27', NULL, 'DE LAS CONDICIONES Y FORMAS DE PAGOS');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (110, '', '2016-05-27', NULL, 'SOLUCIÓN DE CONFLICTOS');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (111, '', '2016-05-27', NULL, 'MODIFICACIÓN');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (112, '', '2016-05-27', NULL, 'LEY APLICABLE');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (113, '', '2016-05-27', NULL, 'INTERPRETACIÓN E INTEGRACIÓN DE LAS CONDICIONES GENERALES DE LOS SERVICIOS HOTELEROS.');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (114, '', '2016-05-27', NULL, 'RESOLUCION Y RESCISION.');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (116, '', '2016-06-01', NULL, 'OBLIGACIONES DE TECNOAZUCAR');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (117, '', '2016-06-01', NULL, 'OBLIGACIONES DEL CLIENTE');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (118, '', '2016-06-01', NULL, 'PRECIO, FORMA Y TERMINOS DE PAGO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (119, '', '2016-06-01', NULL, 'RESOLUCIÓN DEL CONTRATO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (120, '', '2016-06-01', NULL, 'OBLIGACIONES DEL PRINCIPAL.');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (121, '', '2016-06-01', NULL, 'OBLIGACIONES DEL AGENTE.');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (122, '', '2016-06-01', NULL, 'REMUNERACION');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (129, '', '2016-06-01', NULL, 'OBLIGACIONES DE LAS PARTES');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (130, '', '2016-06-01', NULL, 'PEDIDOS, OFERTAS Y COMERCIALIZACIÓN DE PRODUCTOS TERMINADOS');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (131, '', '2016-06-01', NULL, 'PRECIO Y MECANISMO DE AJUSTE');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (132, '', '2016-06-01', NULL, 'COMITÉ DE COORDINACIÓN');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (133, '', '2016-06-01', NULL, 'TÉRMINO DEL CONTRATO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (134, '', '2016-06-01', NULL, 'CANTIDAD  Y PLAZO(S) DE ENTREGA');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (135, '', '2016-06-01', NULL, 'TIPOS, GASTOS Y CONDICIONES DE TRANSPORTACIÓN');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (136, '', '2016-06-01', NULL, 'OBLIGACIONES DEL REPRESENTANTE');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (137, '', '2016-06-01', NULL, 'OBLIGACIONES DEL CONCESIONARIO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (138, '', '2016-06-01', NULL, 'OBLIGACIONES DEL CONCEDENTE');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (139, '', '2016-06-01', NULL, 'DE LA REMUNERACION DEL CONCESIONARIO.');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (140, '', '2016-06-02', NULL, 'CONDICIONES GENERALES DEL ARRENDAMIENTO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (141, '', '2016-06-02', NULL, 'CONDICIONES DE LA ENTREGA');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (142, '', '2016-06-02', NULL, 'CONDICIONES Y FORMA DE PAGO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (143, '', '2016-06-02', NULL, 'OPCIÓN DE COMPRA');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (144, '', '2016-06-02', NULL, 'SEGURO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (146, '', '2016-06-02', NULL, 'OBLIGACIONES DE EL ARRENDADOR');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (147, '', '2016-06-02', NULL, 'OBLIGACIONES DE EL ARRENDATARIO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (148, '', '2016-06-02', NULL, 'GARANTÿA');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (150, '', '2016-06-02', NULL, 'MODIFICACIÓN DEL CONTRATO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (152, '', '2016-06-02', NULL, 'DISPOCISIONES FINALES');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (156, '', '2017-09-21', NULL, 'OBLIGACIONES DE EL COMPRADOR');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (157, '', '2017-09-21', NULL, 'DE LA CANTIDAD Y LOS PLAZOS DE ENTREGA');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (159, '', '2017-09-21', NULL, 'FACTURACION, PRECIOS, TARIFAS Y FORMA DE PAGO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (160, '', '2017-09-21', NULL, 'CONDICIONES DE TRANSPORTACIÓN Y ALMACENAMIENTO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (161, '', '2017-09-21', NULL, 'DE LAS RECLAMACIONES Y LITIGIOS');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (162, '', '2017-09-21', NULL, 'DE LA MODIFICACION Y TERMINACION DEL CONTRATO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (186, '', '2018-02-08', NULL, 'OBJETO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (155, '', '2017-09-21', NULL, 'OBLIGACIONES DE EL PRODUCTOR');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (187, '', '2018-02-08', NULL, 'SOBRE LA ENTREGA Y TRANSMISIÓN DE LA PROPIEDAD');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (170, '', '2017-09-21', NULL, 'LUGARES, CANTIDAD Y CONDICIONES DE ENTREGA Y TRANSPORTACIÓN');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (188, '', '2018-02-08', NULL, 'VALOR Y FORMA DE PAGO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (158, '', '2017-09-21', NULL, 'GARANTIA Y ESPECIFICACIONES DE CALIDAD');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (163, '', '2017-09-21', NULL, 'BASAMENTO JURÿDICO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (189, '', '2018-02-08', NULL, 'LIMITACIÓN O EXENCIÓN DE RESPONSABILIDAD');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (190, '', '2018-02-08', NULL, 'RECLAMACIONES, SANCIONES PECUNIARIAS Y SOLUCIÓN DE LITIGIOS');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (191, '', '2018-02-08', NULL, 'LEGISLACION Y JURISDICCION APLICABLE');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (192, '', '2018-02-08', NULL, 'DE LA MODIFICACION DEL CONTRATO');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (193, '', '2018-02-08', NULL, 'TERMINACION Y VIGENCIA');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (58, '', '2016-05-26', NULL, 'ESTIPULACIONES');
INSERT INTO nom_clausula (idclausula, descripcion, fechainicio, fechafin, denominacion) VALUES (197, '', '2019-02-27', NULL, 'FECHAS DE ENTREGA');
INSERT INTO nom_entregable (identregable, nombre, fechainicio, fechafin, descripcion) VALUES (0, 'Contratos', '2016-05-24', NULL, '');
INSERT INTO nom_entregable (identregable, nombre, fechainicio, fechafin, descripcion) VALUES (1, 'Contratos externos', '2016-05-24', NULL, '');
INSERT INTO nom_entregable (identregable, nombre, fechainicio, fechafin, descripcion) VALUES (2, 'Hitos de pago', '2016-05-24', NULL, '');
INSERT INTO nom_entregable (identregable, nombre, fechainicio, fechafin, descripcion) VALUES (3, 'Hitos de pagos externos', '2016-05-24', NULL, '');
INSERT INTO nom_entregable (identregable, nombre, fechainicio, fechafin, descripcion) VALUES (4, 'Hitos de pagos foráneos', '2016-05-24', NULL, '');
INSERT INTO nom_entregable (identregable, nombre, fechainicio, fechafin, descripcion) VALUES (5, 'Entregables', '2016-05-24', NULL, '');
INSERT INTO nom_entregable (identregable, nombre, fechainicio, fechafin, descripcion) VALUES (6, 'Entregables externos', '2016-05-24', NULL, '');
INSERT INTO nom_entregable (identregable, nombre, fechainicio, fechafin, descripcion) VALUES (7, 'Entregables foráneos', '2016-05-24', NULL, '');
INSERT INTO nom_estado (idestado, nombre, fechainicio, fechafin, descripcion, inicial, icono, acciones) VALUES (23, 'Aceptado', '2018-04-10', NULL, '', 0, 'aceptar', '["historial"]');
INSERT INTO nom_estado (idestado, nombre, fechainicio, fechafin, descripcion, inicial, icono, acciones) VALUES (7, 'Firmado', '2016-05-24', NULL, '', 0, 'firmaautorizada', '["createsupl","print","historial","sign"]');
INSERT INTO nom_estado (idestado, nombre, fechainicio, fechafin, descripcion, inicial, icono, acciones) VALUES (8, 'Creado', '2016-05-24', NULL, '', 1, 'nuevo', '["print","edit","del","historial"]');
INSERT INTO nom_estado (idestado, nombre, fechainicio, fechafin, descripcion, inicial, icono, acciones) VALUES (15, 'Reclamado', '2017-05-16', NULL, '', 0, 'reclamacion', '["document"]');
INSERT INTO nom_estado (idestado, nombre, fechainicio, fechafin, descripcion, inicial, icono, acciones) VALUES (65, 'Cierre', '2019-08-21', NULL, '', 0, 'cierre', '[]');
INSERT INTO nom_estado (idestado, nombre, fechainicio, fechafin, descripcion, inicial, icono, acciones) VALUES (12, 'Ejecución', '2017-05-16', NULL, '', 0, 'ejecutar', '[]');
INSERT INTO nom_estado (idestado, nombre, fechainicio, fechafin, descripcion, inicial, icono, acciones) VALUES (14, 'Moroso', '2017-05-16', NULL, '', 0, 'compilar', '[]');
INSERT INTO nom_estado (idestado, nombre, fechainicio, fechafin, descripcion, inicial, icono, acciones) VALUES (13, 'Demandado', '2017-05-16', NULL, '', 0, 'demanda', '["document"]');
INSERT INTO nom_estado (idestado, nombre, fechainicio, fechafin, descripcion, inicial, icono, acciones) VALUES (22, 'Sin concluir', '2018-04-10', NULL, '', 0, 'esquema', '[]');
INSERT INTO nom_estado (idestado, nombre, fechainicio, fechafin, descripcion, inicial, icono, acciones) VALUES (28, 'Denegar', '2018-04-10', NULL, '', 0, 'anulardocumento', '[]');
INSERT INTO nom_estado (idestado, nombre, fechainicio, fechafin, descripcion, inicial, icono, acciones) VALUES (3, 'Enviado al cliente', '2016-05-24', NULL, '', 0, 'exportar', '["print","historial","createsupl"]');
INSERT INTO nom_estado (idestado, nombre, fechainicio, fechafin, descripcion, inicial, icono, acciones) VALUES (6, 'Cerrado', '2016-05-24', NULL, '', 0, 'cerrarperiodo', '["print","historial","edit","del","createsupl"]');
INSERT INTO nom_estado (idestado, nombre, fechainicio, fechafin, descripcion, inicial, icono, acciones) VALUES (11, 'Rechazado', '2016-12-09', NULL, '', 0, 'desaprobar rojo', '["del","historial","print","edit"]');
INSERT INTO nom_estado (idestado, nombre, fechainicio, fechafin, descripcion, inicial, icono, acciones) VALUES (2, 'Solicitud', '2016-05-24', NULL, '', 0, 'gestionarsolicitud', '["edit","del","historial","print","createsupl"]');
INSERT INTO nom_estado (idestado, nombre, fechainicio, fechafin, descripcion, inicial, icono, acciones) VALUES (9, 'Aprobado', '2016-05-25', NULL, '', 0, 'aprobar verde', '["print","historial","createsupl","createcontrato"]');
INSERT INTO nom_estado (idestado, nombre, fechainicio, fechafin, descripcion, inicial, icono, acciones) VALUES (30, 'Corrección', '2018-10-01', NULL, '', 0, 'gestioncomercial verde', '["edit"]');
INSERT INTO nom_formatonumcontrato (idformatonumcontrato, denominacion) VALUES (47, 'Cliente-Proveedor');
INSERT INTO nom_formatonumcontratoelemento (idformatonumcontratoelemento, denominacion, ejemplo, orden, tipo, idformatonumcontrato) VALUES (383, 'consecutivo', '001', 1, 3, 47);
INSERT INTO nom_formatonumcontratoelemento (idformatonumcontratoelemento, denominacion, ejemplo, orden, tipo, idformatonumcontrato) VALUES (384, 'Separador', '-', 2, 1, 47);
INSERT INTO nom_formatonumcontratoelemento (idformatonumcontratoelemento, denominacion, ejemplo, orden, tipo, idformatonumcontrato) VALUES (385, 'Anno', '2020', 3, 2, 47);
INSERT INTO nom_formatonumcontratoelementofecha (idformatonumcontratoelemento, formato, generada, nombreparametro) VALUES (385, 'Y', 1, NULL);
INSERT INTO nom_formatonumcontratoelementonumerico (idformatonumcontratoelemento, longitud, incluircerosizquierda) VALUES (383, 3, 1);
INSERT INTO nom_formatonumcontratoelementotexto (idformatonumcontratoelemento, caracteres) VALUES (384, '-');
INSERT INTO nom_incoterm (idincoterm, nombre, abreviatura, fechainicio, fechafin, descripcion) VALUES (0, 'En fábrica', 'EXW', '2016-05-24', NULL, '');
INSERT INTO nom_incoterm (idincoterm, nombre, abreviatura, fechainicio, fechafin, descripcion) VALUES (1, 'Franco porteador', 'FCA', '2016-05-24', NULL, '');
INSERT INTO nom_incoterm (idincoterm, nombre, abreviatura, fechainicio, fechafin, descripcion) VALUES (2, 'Transporte pagado hasta', 'CPT', '2016-05-24', NULL, '');
INSERT INTO nom_incoterm (idincoterm, nombre, abreviatura, fechainicio, fechafin, descripcion) VALUES (3, 'Transporte y seguro pagado hasta', 'CIP', '2016-05-24', NULL, '');
INSERT INTO nom_incoterm (idincoterm, nombre, abreviatura, fechainicio, fechafin, descripcion) VALUES (4, 'Entregada en terminal', 'DAT', '2016-05-24', NULL, '');
INSERT INTO nom_incoterm (idincoterm, nombre, abreviatura, fechainicio, fechafin, descripcion) VALUES (5, 'Entregada en lugar', 'DAP', '2016-05-24', NULL, '');
INSERT INTO nom_incoterm (idincoterm, nombre, abreviatura, fechainicio, fechafin, descripcion) VALUES (6, 'Entregada derechos pagados', 'DDP', '2016-05-24', NULL, '');
INSERT INTO nom_incoterm (idincoterm, nombre, abreviatura, fechainicio, fechafin, descripcion) VALUES (7, 'Franco al costado del Buque', 'FAS', '2016-05-24', NULL, '');
INSERT INTO nom_incoterm (idincoterm, nombre, abreviatura, fechainicio, fechafin, descripcion) VALUES (8, 'Franco a bordo', 'FOB', '2016-05-24', NULL, '');
INSERT INTO nom_incoterm (idincoterm, nombre, abreviatura, fechainicio, fechafin, descripcion) VALUES (9, 'Coste y flete', 'CFR', '2016-05-24', NULL, '');
INSERT INTO nom_incoterm (idincoterm, nombre, abreviatura, fechainicio, fechafin, descripcion) VALUES (10, 'Coste, seguro y flete', 'CIF', '2016-05-24', NULL, '');
INSERT INTO nom_mediodepago (idmediodepago, nombre, fechainicio, fechafin, descripcion) VALUES (0, 'Carta de crédito local', '2016-05-24', NULL, '');
INSERT INTO nom_mediodepago (idmediodepago, nombre, fechainicio, fechafin, descripcion) VALUES (1, 'Cheque certificado', '2016-05-24', NULL, '');
INSERT INTO nom_mediodepago (idmediodepago, nombre, fechainicio, fechafin, descripcion) VALUES (2, 'Cheque de gerencia', '2016-05-24', NULL, '');
INSERT INTO nom_mediodepago (idmediodepago, nombre, fechainicio, fechafin, descripcion) VALUES (3, 'Cheque nominatario', '2016-05-24', NULL, '');
INSERT INTO nom_mediodepago (idmediodepago, nombre, fechainicio, fechafin, descripcion) VALUES (4, 'Cheque voucher', '2016-05-24', NULL, '');
INSERT INTO nom_mediodepago (idmediodepago, nombre, fechainicio, fechafin, descripcion) VALUES (5, 'Dinero efectivo', '2016-05-24', NULL, '');
INSERT INTO nom_mediodepago (idmediodepago, nombre, fechainicio, fechafin, descripcion) VALUES (6, 'Letra de cambio', '2016-05-24', NULL, '');
INSERT INTO nom_mediodepago (idmediodepago, nombre, fechainicio, fechafin, descripcion) VALUES (7, 'Orden de cobro', '2016-05-24', NULL, '');
INSERT INTO nom_mediodepago (idmediodepago, nombre, fechainicio, fechafin, descripcion) VALUES (8, 'Pagaré', '2016-05-24', NULL, '');
INSERT INTO nom_mediodepago (idmediodepago, nombre, fechainicio, fechafin, descripcion) VALUES (9, 'Tarjeta débito o crédito', '2016-05-24', NULL, '');
INSERT INTO nom_mediodepago (idmediodepago, nombre, fechainicio, fechafin, descripcion) VALUES (10, 'Transferencia bancaria', '2016-05-24', NULL, '');
INSERT INTO nom_periodicidad (idperiodicidad, denominacion, descripcion, fechainicio, fechafin) VALUES (7, 'Repetición mensual', 'Repetición mensual', '2018-05-11', NULL);
INSERT INTO nom_periodicidad (idperiodicidad, denominacion, descripcion, fechainicio, fechafin) VALUES (8, 'Repetición trimestral', 'Repetición trimestral', '2018-05-11', NULL);
INSERT INTO nom_prioridad (idprioridad, denominacion, descripcion, fechainicio, fechafin) VALUES (1, 'Alta', '', '2016-05-24', NULL);
INSERT INTO nom_prioridad (idprioridad, denominacion, descripcion, fechainicio, fechafin) VALUES (2, 'Medio', '', '2016-05-24', NULL);
INSERT INTO nom_prioridad (idprioridad, denominacion, descripcion, fechainicio, fechafin) VALUES (3, 'Bajo', '', '2016-05-24', NULL);
INSERT INTO nom_proceso (idproceso, denominacion, descripcion, fechainicio, fechafin, identificador) VALUES (3, 'Contrato/Suplemento Cliente', '', '2017-02-17', NULL, 'mdContrato');
INSERT INTO nom_proceso (idproceso, denominacion, descripcion, fechainicio, fechafin, identificador) VALUES (2, 'Solicitud de Negocio', '', '2017-02-14', NULL, 'solicitudnegocio');
INSERT INTO nom_proceso (idproceso, denominacion, descripcion, fechainicio, fechafin, identificador) VALUES (4, 'Oferta de Negocio', '', '2017-03-17', NULL, 'ofertanegocio');
INSERT INTO nom_proceso (idproceso, denominacion, descripcion, fechainicio, fechafin, identificador) VALUES (5, 'Trabajo terminado', '', '2018-01-25', NULL, 'hitospagos');
INSERT INTO nom_proceso (idproceso, denominacion, descripcion, fechainicio, fechafin, identificador) VALUES (7, 'Contrato/Suplemento Proveedor', '', '2018-03-01', NULL, 'mdcontratoproveedor');
INSERT INTO nom_proceso (idproceso, denominacion, descripcion, fechainicio, fechafin, identificador) VALUES (6, 'Solicitud de Pago', '', '2018-02-26', NULL, 'solicitudpago');
INSERT INTO nom_proceso (idproceso, denominacion, descripcion, fechainicio, fechafin, identificador) VALUES (8, 'Oferta de Negocio Proveedor', '', '2020-02-28', NULL, 'ofertanegocioproveedor');
INSERT INTO nom_proceso (idproceso, denominacion, descripcion, fechainicio, fechafin, identificador) VALUES (9, 'Solicitud de Negocio Proveedor', '', '2020-02-28', NULL, 'solicitudnegocioproveedor');
INSERT INTO nom_sector (idsector, denominacion, descripcion, fechainicio, fechafin) VALUES (3, 'FAR', '', '2016-05-31', NULL);
INSERT INTO nom_sector (idsector, denominacion, descripcion, fechainicio, fechafin) VALUES (2, 'Economia', '', '2016-05-31', NULL);
INSERT INTO nom_sector (idsector, denominacion, descripcion, fechainicio, fechafin) VALUES (6, 'Exportación', '', '2017-03-30', NULL);
INSERT INTO nom_transicion (idtransicion, idestadoinicial, idestadofinal, fechainicio, fechafin, descripcion, idproceso, idestructura, notificar) VALUES (119, 8, 2, '2016-11-04', NULL, '', 3, 200530666, 0);
INSERT INTO nom_transicion (idtransicion, idestadoinicial, idestadofinal, fechainicio, fechafin, descripcion, idproceso, idestructura, notificar) VALUES (120, 2, 9, '2016-11-04', NULL, '', 3, 200530666, 0);
INSERT INTO nom_transicion (idtransicion, idestadoinicial, idestadofinal, fechainicio, fechafin, descripcion, idproceso, idestructura, notificar) VALUES (121, 2, 11, '2016-11-04', NULL, '', 3, 200530666, 0);
INSERT INTO nom_transicion (idtransicion, idestadoinicial, idestadofinal, fechainicio, fechafin, descripcion, idproceso, idestructura, notificar) VALUES (122, 9, 7, '2016-11-04', NULL, '', 3, 200530666, 0);
SELECT pg_catalog.setval('sec_anexo_seq', 48, true);
SELECT pg_catalog.setval('sec_area_seq', 29, true);
SELECT pg_catalog.setval('sec_categoria_seq', 1, false);
SELECT pg_catalog.setval('sec_clausula_seq', 201, true);
SELECT pg_catalog.setval('sec_contrato_seq', 1059, true);
SELECT pg_catalog.setval('sec_contratoareaimplicada_seq', 186, false);
SELECT pg_catalog.setval('sec_contratoestado_seq', 78, true);
SELECT pg_catalog.setval('sec_contratoexpiracionvigencia_seq', 11, true);
SELECT pg_catalog.setval('sec_contratomarco_seq', 1, false);
SELECT pg_catalog.setval('sec_contratomarcoclausula_seq', 1, false);
SELECT pg_catalog.setval('sec_datmediopago_seq', 23, true);
SELECT pg_catalog.setval('sec_dictamen_seq', 143, true);
SELECT pg_catalog.setval('sec_elementocontrato_seq', 1, false);
SELECT pg_catalog.setval('sec_elementotipocontrato_seq', 12, true);
SELECT pg_catalog.setval('sec_elementotipocontratoidelemento_seq', 137, true);
SELECT pg_catalog.setval('sec_entidadformatonumcontrato_seq', 103, true);
SELECT pg_catalog.setval('sec_entidadformatonumcontratoincremento_seq', 141, true);
SELECT pg_catalog.setval('sec_entregable_seq', 9, true);
SELECT pg_catalog.setval('sec_estado_seq', 65, true);
SELECT pg_catalog.setval('sec_facturamoneda_seq', 184, true);
SELECT pg_catalog.setval('sec_facturasolicitudpago_seq', 59, true);
SELECT pg_catalog.setval('sec_formatonumcontrato_seq', 47, true);
SELECT pg_catalog.setval('sec_formatonumcontratoelemento_seq', 385, true);
SELECT pg_catalog.setval('sec_formatonumcontratoelementonomencladorvalor_seq', 289, true);
SELECT pg_catalog.setval('sec_hito_seq', 445, true);
SELECT pg_catalog.setval('sec_hitoestado_seq', 587, true);
SELECT pg_catalog.setval('sec_hitooferta_seq', 11, true);
SELECT pg_catalog.setval('sec_incoterm_seq', 11, true);
SELECT pg_catalog.setval('sec_indicadorcontrato_seq', 377, true);
SELECT pg_catalog.setval('sec_indicadorhito_seq', 73, true);
SELECT pg_catalog.setval('sec_indicadoroferta_seq', 85, true);
SELECT pg_catalog.setval('sec_mediopago_seq', 1, false);
SELECT pg_catalog.setval('sec_mediopagooferta_seq', 16, true);
SELECT pg_catalog.setval('sec_monedacontrato_seq', 637, true);
SELECT pg_catalog.setval('sec_monedahito_seq', 819, true);
SELECT pg_catalog.setval('sec_monedahitooferta_seq', 35, true);
SELECT pg_catalog.setval('sec_monedaindicador_seq', 57, true);
SELECT pg_catalog.setval('sec_monedaindicadorcontrato_seq', 95, true);
SELECT pg_catalog.setval('sec_monedaoferta_seq', 156, true);
SELECT pg_catalog.setval('sec_ofertadictamen_seq', 56, true);
SELECT pg_catalog.setval('sec_ofertanegocio_seq', 107, true);
SELECT pg_catalog.setval('sec_ofertanegociodocumento_seq', 1, false);
SELECT pg_catalog.setval('sec_ofertanegocioestado_seq', 123, true);
SELECT pg_catalog.setval('sec_periodicidad_seq', 8, true);
SELECT pg_catalog.setval('sec_prioridad_seq', 4, true);
SELECT pg_catalog.setval('sec_proceso_seq', 9, true);
SELECT pg_catalog.setval('sec_productosdatosadicionales_seq', 11, true);
SELECT pg_catalog.setval('sec_proforma_seq', 88, true);
SELECT pg_catalog.setval('sec_proformaclausula_seq', 951, true);
SELECT pg_catalog.setval('sec_roltransicion_seq', 381, true);
SELECT pg_catalog.setval('sec_sector_seq', 8, true);
SELECT pg_catalog.setval('sec_solicituddictamen_seq', 17, true);
SELECT pg_catalog.setval('sec_solicitudnegocio_seq', 107, true);
SELECT pg_catalog.setval('sec_solicitudnegocioareaimplicada_seq', 78, true);
SELECT pg_catalog.setval('sec_solicitudnegocioestado_seq', 128, true);
SELECT pg_catalog.setval('sec_solicitudpago_seq', 62, true);
SELECT pg_catalog.setval('sec_solicitudpagodictamen_seq', 3, true);
SELECT pg_catalog.setval('sec_solicitudpagoestado_seq', 1, false);
SELECT pg_catalog.setval('sec_solicitudpagoobjetivo_seq', 382, false);
SELECT pg_catalog.setval('sec_tipocontrato_seq', 86, true);
SELECT pg_catalog.setval('sec_transicion_seq', 122, true);
SELECT pg_catalog.setval('sec_vehiculocontrato_seq', 10, true);

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET search_path = mod_crmcontratacion, pg_catalog;
SET search_path = mod_crmadministracion, pg_catalog;
SET search_path = mod_crmcontratacion, pg_catalog;
SET search_path = mod_crmadministracion, pg_catalog;
SET search_path = mod_crmclienteproveedor, pg_catalog;
SET search_path = mod_crmcontratacion, pg_catalog;
SET search_path = mod_crmadministracion, pg_catalog;
SET search_path = mod_crmclienteproveedor, pg_catalog;
SET search_path = mod_crmcontratacion, pg_catalog;
SET search_path = mod_crmadministracion, pg_catalog;
ALTER TABLE ONLY conf_modulo
    ADD CONSTRAINT ak_idestructuracomun_confmodulo UNIQUE (idestructuracomun);
ALTER TABLE ONLY conf_clientesproveedores
    ADD CONSTRAINT conf_clientesproveedores_pkey PRIMARY KEY (idconfclientesproveedores);
ALTER TABLE ONLY conf_valorespordefecto
    ADD CONSTRAINT fk_valorespordefecto PRIMARY KEY (idvalorespordefecto);
ALTER TABLE ONLY conf_accesodirecto
    ADD CONSTRAINT pk_accesodirecto PRIMARY KEY (idaccesodirecto);
ALTER TABLE ONLY conf_comitegeneral
    ADD CONSTRAINT pk_comitegeneral PRIMARY KEY (idcomitegeneral);
ALTER TABLE ONLY dat_comitegestordocumental
    ADD CONSTRAINT pk_comitegestordocumental PRIMARY KEY (idcomitegestordocumental);
ALTER TABLE ONLY dat_comitetransicion
    ADD CONSTRAINT pk_comitetransicion PRIMARY KEY (idcomitetransicion);
ALTER TABLE ONLY dat_compartimentacion
    ADD CONSTRAINT pk_compartimentacion PRIMARY KEY (idcompartimentacion);
ALTER TABLE ONLY conf_modulo
    ADD CONSTRAINT pk_confmodulo PRIMARY KEY (idconfmodulo);
ALTER TABLE ONLY conf_ofertanegocio
    ADD CONSTRAINT pk_confofertanegocio PRIMARY KEY (idconfoferta);
ALTER TABLE ONLY conf_solicitudnegocio
    ADD CONSTRAINT pk_confsolicitudnegocio PRIMARY KEY (idconfsolicitud);
ALTER TABLE ONLY dat_contratocontabilidad
    ADD CONSTRAINT pk_contratocontabilidad PRIMARY KEY (idcontratocontabilidad);
ALTER TABLE ONLY conf_contratogeneral
    ADD CONSTRAINT pk_contratogeneral PRIMARY KEY (idcontratogeneral);
ALTER TABLE ONLY dat_contratogestordocumental
    ADD CONSTRAINT pk_contratogestordocumental PRIMARY KEY (idcontratogestordocumental);
ALTER TABLE ONLY dat_contratoplanificacion
    ADD CONSTRAINT pk_contratoplanificacion PRIMARY KEY (idcontratoplanificacion);
ALTER TABLE ONLY dat_moduloreporte
    ADD CONSTRAINT pk_moduloreporte PRIMARY KEY (idmodulo);
ALTER TABLE ONLY dat_plantilla
    ADD CONSTRAINT pk_plantilla PRIMARY KEY (idplantilla);
ALTER TABLE ONLY dat_plantillaestructura
    ADD CONSTRAINT pk_plantillaestructura PRIMARY KEY (idestructura);
ALTER TABLE ONLY dat_reporte
    ADD CONSTRAINT pk_reporte PRIMARY KEY (idreporte);
ALTER TABLE ONLY dat_reportefiltro
    ADD CONSTRAINT pk_reportefiltro PRIMARY KEY (idfiltro);
ALTER TABLE ONLY dat_reportefiltronomenclador
    ADD CONSTRAINT pk_reportefiltronomenclador PRIMARY KEY (idfiltro);
ALTER TABLE ONLY dat_reportefiltronumerico
    ADD CONSTRAINT pk_reportefiltronumerico PRIMARY KEY (idfiltro);
ALTER TABLE ONLY dat_reportefiltrotexto
    ADD CONSTRAINT pk_reportefiltrotexto PRIMARY KEY (idfiltro);
ALTER TABLE ONLY dat_solicitudpagogestordocumental
    ADD CONSTRAINT pk_solicitudpagogestordocumental PRIMARY KEY (idsolicitudpagogestordocumental);
SET search_path = mod_crmclienteproveedor, pg_catalog;
ALTER TABLE ONLY dat_identificador
    ADD CONSTRAINT pk_codigo PRIMARY KEY (ididentificador);
ALTER TABLE ONLY nom_cuestionario
    ADD CONSTRAINT pk_cuestionario PRIMARY KEY (idcuestionario);
ALTER TABLE ONLY dat_cuestionariopregunta
    ADD CONSTRAINT pk_cuestionariopregunta PRIMARY KEY (idcuestionario, idpregunta);
ALTER TABLE ONLY dat_facultad
    ADD CONSTRAINT pk_facultad PRIMARY KEY (idfacultad);
ALTER TABLE ONLY nom_organismo
    ADD CONSTRAINT pk_organismo PRIMARY KEY (idorganismo);
ALTER TABLE ONLY dat_perfilcliente
    ADD CONSTRAINT pk_perfilcliente PRIMARY KEY (idclienteproveedor, idcuestionario, idpregunta, idrespuesta);
ALTER TABLE ONLY nom_pregunta
    ADD CONSTRAINT pk_pregunta PRIMARY KEY (idpregunta);
ALTER TABLE ONLY nom_respuesta
    ADD CONSTRAINT pk_respuesta PRIMARY KEY (idrespuesta);
ALTER TABLE ONLY nom_tipocodigo
    ADD CONSTRAINT pk_tipocodigo PRIMARY KEY (idtipocodigo);
ALTER TABLE ONLY nom_tipofacultad
    ADD CONSTRAINT pk_tipofacultad PRIMARY KEY (idtipofacultad);
ALTER TABLE ONLY nom_tiporespuesta
    ADD CONSTRAINT pk_tiporespuesta PRIMARY KEY (idtiporespuesta);
SET search_path = mod_crmcontratacion, pg_catalog;
ALTER TABLE ONLY nom_incoterm
    ADD CONSTRAINT ak_abreviatura_incoterm UNIQUE (abreviatura);
ALTER TABLE ONLY nom_sector
    ADD CONSTRAINT ak_denominacion UNIQUE (denominacion);
ALTER TABLE ONLY nom_categoria
    ADD CONSTRAINT ak_denominacion_categoria UNIQUE (denominacion);
ALTER TABLE ONLY nom_clausula
    ADD CONSTRAINT ak_denominacion_clausula UNIQUE (denominacion);
ALTER TABLE ONLY nom_periodicidad
    ADD CONSTRAINT ak_denominacion_periodicidad UNIQUE (denominacion);
ALTER TABLE ONLY nom_prioridad
    ADD CONSTRAINT ak_denominacion_prioridad UNIQUE (denominacion);
ALTER TABLE ONLY nom_proceso
    ADD CONSTRAINT ak_denominacion_proceso UNIQUE (denominacion);
ALTER TABLE ONLY dat_proforma
    ADD CONSTRAINT ak_denominacion_proforma UNIQUE (denominacion);
ALTER TABLE ONLY nom_estado
    ADD CONSTRAINT ak_icono_estado UNIQUE (icono);
ALTER TABLE ONLY nom_entregable
    ADD CONSTRAINT ak_nombre_entregable UNIQUE (nombre);
ALTER TABLE ONLY nom_estado
    ADD CONSTRAINT ak_nombre_estado UNIQUE (nombre);
ALTER TABLE ONLY nom_incoterm
    ADD CONSTRAINT ak_nombre_incoterm UNIQUE (nombre);
ALTER TABLE ONLY nom_mediodepago
    ADD CONSTRAINT ak_nombre_mediodepago UNIQUE (nombre);
ALTER TABLE ONLY dat_area
    ADD CONSTRAINT dat_area_pkey PRIMARY KEY (idarea);
ALTER TABLE ONLY dat_moracontrato
    ADD CONSTRAINT dat_moracontrato_pkey PRIMARY KEY (idmora);
ALTER TABLE ONLY nom_proceso
    ADD CONSTRAINT nom_proceso_identificador_key UNIQUE (identificador);
ALTER TABLE ONLY nom_categoria
    ADD CONSTRAINT pk_categoria PRIMARY KEY (idcategoria);
ALTER TABLE ONLY nom_clausula
    ADD CONSTRAINT pk_clausula PRIMARY KEY (idclausula);
ALTER TABLE ONLY dat_contrato
    ADD CONSTRAINT pk_contrato PRIMARY KEY (idcontrato);
ALTER TABLE ONLY dat_contratoareaimplicada
    ADD CONSTRAINT pk_contratoareaimplicada PRIMARY KEY (idarea);
ALTER TABLE ONLY dat_anexo
    ADD CONSTRAINT pk_contratodocumento PRIMARY KEY (idanexo);
ALTER TABLE ONLY dat_contratoestado
    ADD CONSTRAINT pk_contratoestado PRIMARY KEY (idcontratoestado);
ALTER TABLE ONLY conf_contratoexpiracionvigencia
    ADD CONSTRAINT pk_contratoexpiracionvigencia PRIMARY KEY (idcontratoexpiracionvigencia);
ALTER TABLE ONLY dat_dictamen
    ADD CONSTRAINT pk_dictamen PRIMARY KEY (iddictamen);
ALTER TABLE ONLY conf_elementotipocontrato
    ADD CONSTRAINT pk_elementotipocontrato PRIMARY KEY (idelemento);
ALTER TABLE ONLY conf_entidadformatonumcontrato
    ADD CONSTRAINT pk_entidadformatonumcontrato PRIMARY KEY (identidadformatonumcontrato);
ALTER TABLE ONLY conf_entidadformatonumcontratoincremento
    ADD CONSTRAINT pk_entidadformatonumcontratoincremento PRIMARY KEY (identidadformatonumcontratoincremento);
ALTER TABLE ONLY nom_entregable
    ADD CONSTRAINT pk_entregable PRIMARY KEY (identregable);
ALTER TABLE ONLY nom_estado
    ADD CONSTRAINT pk_estado PRIMARY KEY (idestado);
ALTER TABLE ONLY dat_facturamoneda
    ADD CONSTRAINT pk_facturamoneda PRIMARY KEY (idfacturamoneda);
ALTER TABLE ONLY dat_facturasolicitudpago
    ADD CONSTRAINT pk_facturasolicitudpago PRIMARY KEY (idfactura);
ALTER TABLE ONLY nom_formatonumcontrato
    ADD CONSTRAINT pk_formatonumcontrato PRIMARY KEY (idformatonumcontrato);
ALTER TABLE ONLY nom_formatonumcontratoelemento
    ADD CONSTRAINT pk_formatonumcontratoelemento PRIMARY KEY (idformatonumcontratoelemento);
ALTER TABLE ONLY nom_formatonumcontratoelementofecha
    ADD CONSTRAINT pk_formatonumcontratoelementofecha PRIMARY KEY (idformatonumcontratoelemento);
ALTER TABLE ONLY nom_formatonumcontratoelementonomenclador
    ADD CONSTRAINT pk_formatonumcontratoelementonomenclador PRIMARY KEY (idformatonumcontratoelemento);
ALTER TABLE ONLY nom_formatonumcontratoelementonomencladorvalor
    ADD CONSTRAINT pk_formatonumcontratoelementonomencladorvalor PRIMARY KEY (idformatonumcontratoelementonomencladorvalor);
ALTER TABLE ONLY nom_formatonumcontratoelementonumerico
    ADD CONSTRAINT pk_formatonumcontratoelementonumerico PRIMARY KEY (idformatonumcontratoelemento);
ALTER TABLE ONLY nom_formatonumcontratoelementoparametro
    ADD CONSTRAINT pk_formatonumcontratoelementoparametro PRIMARY KEY (idformatonumcontratoelemento);
ALTER TABLE ONLY nom_formatonumcontratoelementotexto
    ADD CONSTRAINT pk_formatonumcontratoelementotexto PRIMARY KEY (idformatonumcontratoelemento);
ALTER TABLE ONLY dat_hito
    ADD CONSTRAINT pk_hito PRIMARY KEY (idhito);
ALTER TABLE ONLY dat_hitoestado
    ADD CONSTRAINT pk_hitoestado PRIMARY KEY (idhitoestado);
ALTER TABLE ONLY dat_hitooferta
    ADD CONSTRAINT pk_hitooferta PRIMARY KEY (idhitooferta);
ALTER TABLE ONLY nom_incoterm
    ADD CONSTRAINT pk_incoterm PRIMARY KEY (idincoterm);
ALTER TABLE ONLY dat_indicadorcontrato
    ADD CONSTRAINT pk_indicadorcontrato PRIMARY KEY (idindicadorcontrato);
ALTER TABLE ONLY dat_indicadorhito
    ADD CONSTRAINT pk_indicadorhito PRIMARY KEY (idindicadorhito);
ALTER TABLE ONLY dat_indicadorhitooferta
    ADD CONSTRAINT pk_indicadorhitooferta PRIMARY KEY (idindicadorhitooferta);
ALTER TABLE ONLY dat_indicadoroferta
    ADD CONSTRAINT pk_indicadoroferta PRIMARY KEY (idindicadoroferta);
ALTER TABLE ONLY dat_indicadorsolicitud
    ADD CONSTRAINT pk_indicadorsolicitud PRIMARY KEY (idindicadorsolicitud);
ALTER TABLE ONLY nom_mediodepago
    ADD CONSTRAINT pk_mediopago PRIMARY KEY (idmediodepago);
ALTER TABLE ONLY dat_mediopagocontrato
    ADD CONSTRAINT pk_mediopagocontrato PRIMARY KEY (idmediopagocontrato);
ALTER TABLE ONLY dat_mediopagooferta
    ADD CONSTRAINT pk_mediopagooferta PRIMARY KEY (idmediopagooferta);
ALTER TABLE ONLY dat_monedacontrato
    ADD CONSTRAINT pk_monedacontrato PRIMARY KEY (idmonedacontrato);
ALTER TABLE ONLY dat_monedahito
    ADD CONSTRAINT pk_monedahito PRIMARY KEY (idmonedahito);
ALTER TABLE ONLY dat_monedahitooferta
    ADD CONSTRAINT pk_monedahitooferta PRIMARY KEY (idmonedahitooferta);
ALTER TABLE ONLY dat_monedaindicador
    ADD CONSTRAINT pk_monedaindicador PRIMARY KEY (idmonedaindicador);
ALTER TABLE ONLY dat_monedaindicadorcontrato
    ADD CONSTRAINT pk_monedaindicadorcontrato PRIMARY KEY (idmonedaindicador);
ALTER TABLE ONLY dat_monedaindicadorhitooferta
    ADD CONSTRAINT pk_monedaindicadorhitooferta PRIMARY KEY (idmonedaindicadorhitooferta);
ALTER TABLE ONLY dat_monedaindicadoroferta
    ADD CONSTRAINT pk_monedaindicadoroferta PRIMARY KEY (idmonedaindicadoroferta);
ALTER TABLE ONLY dat_monedaoferta
    ADD CONSTRAINT pk_monedaoferta PRIMARY KEY (idmonedaoferta);
ALTER TABLE ONLY dat_ofertadictamen
    ADD CONSTRAINT pk_ofertadictamen PRIMARY KEY (iddictamen);
ALTER TABLE ONLY dat_ofertanegocio
    ADD CONSTRAINT pk_ofertanegocio PRIMARY KEY (idoferta);
ALTER TABLE ONLY dat_ofertanegociodocumento
    ADD CONSTRAINT pk_ofertanegociodocumento PRIMARY KEY (idofertadocumento);
ALTER TABLE ONLY dat_ofertanegocioestado
    ADD CONSTRAINT pk_ofertanegocioestado PRIMARY KEY (idofertaestado);
ALTER TABLE ONLY nom_periodicidad
    ADD CONSTRAINT pk_periodicidad PRIMARY KEY (idperiodicidad);
ALTER TABLE ONLY nom_prioridad
    ADD CONSTRAINT pk_prioridad PRIMARY KEY (idprioridad);
ALTER TABLE ONLY nom_proceso
    ADD CONSTRAINT pk_proceso PRIMARY KEY (idproceso);
ALTER TABLE ONLY dat_productosdatosadicionales
    ADD CONSTRAINT pk_productosdatosadicionales PRIMARY KEY (idproductodatosadicionales);
ALTER TABLE ONLY dat_proforma
    ADD CONSTRAINT pk_proforma PRIMARY KEY (idproforma);
ALTER TABLE ONLY dat_proformaclausula
    ADD CONSTRAINT pk_proformaclausula PRIMARY KEY (idproformaclausula);
ALTER TABLE ONLY dat_roltransicion
    ADD CONSTRAINT pk_roltransicion PRIMARY KEY (idroltransicion);
ALTER TABLE ONLY nom_sector
    ADD CONSTRAINT pk_sector PRIMARY KEY (idsector);
ALTER TABLE ONLY dat_solicituddictamen
    ADD CONSTRAINT pk_solicituddictamen PRIMARY KEY (iddictamen);
ALTER TABLE ONLY dat_solicitudnegocio
    ADD CONSTRAINT pk_solicitudnegocio PRIMARY KEY (idsolicitud);
ALTER TABLE ONLY dat_solicitudnegocioareaimplicada
    ADD CONSTRAINT pk_solicitudnegocioareaimplicada PRIMARY KEY (idarea);
ALTER TABLE ONLY dat_solicitudnegocioestado
    ADD CONSTRAINT pk_solicitudnegocioestado PRIMARY KEY (idsolicitudestado);
ALTER TABLE ONLY dat_solicitudnegocioproveedor
    ADD CONSTRAINT pk_solicitudnegocioproveedor PRIMARY KEY (idsolicitudnegocioproveedor);
ALTER TABLE ONLY dat_solicitudpago
    ADD CONSTRAINT pk_solicitudpago PRIMARY KEY (idsolicitudpago);
ALTER TABLE ONLY dat_solicitudpagodictamen
    ADD CONSTRAINT pk_solicitudpagodictamen PRIMARY KEY (iddictamen);
ALTER TABLE ONLY dat_solicitudpagoestado
    ADD CONSTRAINT pk_solicitudpagoestado PRIMARY KEY (idsolicitudpagoestado);
ALTER TABLE ONLY dat_solicitudpagoobjetivo
    ADD CONSTRAINT pk_solicitudpagoobjetivo PRIMARY KEY (idsolicitudpagoobjetivo);
ALTER TABLE ONLY dat_tipocontrato
    ADD CONSTRAINT pk_tipocontrato PRIMARY KEY (idtipocontrato);
ALTER TABLE ONLY nom_transicion
    ADD CONSTRAINT pk_transicion PRIMARY KEY (idtransicion);
ALTER TABLE ONLY dat_vehiculocontrato
    ADD CONSTRAINT pk_vehiculocontrato PRIMARY KEY (idvehiculocontrato);
SET search_path = mod_crmadministracion, pg_catalog;
CREATE UNIQUE INDEX idx_idvalorespordefecto ON conf_valorespordefecto USING btree (idvalorespordefecto);
SET search_path = mod_crmclienteproveedor, pg_catalog;
CREATE UNIQUE INDEX dat_codigo_idcodigo_uindex ON dat_identificador USING btree (ididentificador);
CREATE UNIQUE INDEX nom_tipocodigo_idtipocodigo_uindex ON nom_tipocodigo USING btree (idtipocodigo);
CREATE UNIQUE INDEX nom_tipofacultad_idtipofacultad_uindex ON nom_tipofacultad USING btree (idtipofacultad);
SET search_path = mod_crmcontratacion, pg_catalog;
CREATE UNIQUE INDEX dat_hitooferta_idhitooferta_uindex ON dat_hitooferta USING btree (idhitooferta);
CREATE UNIQUE INDEX dat_indicadoroferta_idindicadoroferta_uindex ON dat_indicadoroferta USING btree (idindicadoroferta);
CREATE UNIQUE INDEX dat_monedaindicadorhitooferta_idmonedaindicadorhitooferta_uinde ON dat_monedaindicadorhitooferta USING btree (idmonedaindicadorhitooferta);
CREATE UNIQUE INDEX dat_solicitudnegocioproveedor_idsolicitudnegocioproveedor_uinde ON dat_solicitudnegocioproveedor USING btree (idsolicitudnegocioproveedor);
CREATE UNIQUE INDEX dat_solicitudpago_idsolicitudpago_uindex ON dat_solicitudpago USING btree (idsolicitudpago);
CREATE INDEX fki_indicador_indicadorcontrato ON dat_indicadorcontrato USING btree (idindicador);
CREATE INDEX idx_clausula ON nom_clausula USING btree (idclausula);
CREATE UNIQUE INDEX idx_entregable ON nom_entregable USING btree (identregable);
CREATE UNIQUE INDEX idx_estado_idsolicitudpagoestado ON dat_solicitudpagoestado USING btree (idsolicitudpagoestado);
CREATE INDEX idx_filaestructtipocontrato ON dat_tipocontrato USING btree (idestructuracomun);
CREATE UNIQUE INDEX idx_idestado ON nom_estado USING btree (idestado);
CREATE UNIQUE INDEX idx_incoterm ON nom_incoterm USING btree (idincoterm);
CREATE UNIQUE INDEX idx_indicadorhitooferta_idindicadorhitooferta ON dat_indicadorhitooferta USING btree (idindicadorhitooferta);
CREATE UNIQUE INDEX idx_indicadorsolicitud_idindicadorsolicitud ON dat_indicadorsolicitud USING btree (idindicadorsolicitud);
CREATE UNIQUE INDEX idx_mediodepago ON nom_mediodepago USING btree (idmediodepago);
CREATE UNIQUE INDEX idx_mediopagooferta_idmediopagooferta ON dat_mediopagooferta USING btree (idmediopagooferta);
CREATE INDEX idx_monedaentidad_facturamoneda ON dat_facturamoneda USING btree (idmoneda);
CREATE UNIQUE INDEX idx_monedahitooferta_idmonedahitooferta ON dat_monedahitooferta USING btree (idmonedahitooferta);
CREATE UNIQUE INDEX idx_monedaoferta_idmonedaoferta ON dat_monedaoferta USING btree (idmonedaoferta);
CREATE UNIQUE INDEX idx_transicion ON nom_transicion USING btree (idtransicion);
SET search_path = mod_crmadministracion, pg_catalog;
CREATE TRIGGER t_insertar_reporte BEFORE INSERT ON dat_reporte FOR EACH ROW EXECUTE PROCEDURE ft_reporte_insertar();
SET search_path = mod_crmcontratacion, pg_catalog;
CREATE TRIGGER t_actualizarpadrecontrato BEFORE INSERT ON dat_contrato FOR EACH ROW EXECUTE PROCEDURE ft_actualizacion_arbol_contrato();
CREATE TRIGGER t_version BEFORE UPDATE ON dat_contrato FOR EACH ROW EXECUTE PROCEDURE ft_chequear();
SET search_path = mod_crmadministracion, pg_catalog;
ALTER TABLE ONLY dat_comitetransicion
    ADD CONSTRAINT fk_comitegeneral_comitetransicion FOREIGN KEY (idcomite) REFERENCES conf_comitegeneral(idcomitegeneral);
ALTER TABLE ONLY conf_contratogeneral
    ADD CONSTRAINT fk_estado_contratogeneral FOREIGN KEY (idestadoofertalisto) REFERENCES mod_crmcontratacion.nom_estado(idestado) ON DELETE SET NULL;
ALTER TABLE ONLY conf_contratogeneral
    ADD CONSTRAINT fk_estructura_contratogeneral FOREIGN KEY (idestructuracomun) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);
ALTER TABLE ONLY conf_valorespordefecto
    ADD CONSTRAINT fk_filaestrucarea_valorespordefecto FOREIGN KEY (idarea) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);
ALTER TABLE ONLY dat_reporte
    ADD CONSTRAINT fk_moduloreporte_reporte FOREIGN KEY (idmodulo) REFERENCES dat_moduloreporte(idmodulo) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY conf_valorespordefecto
    ADD CONSTRAINT fk_persona_valorespordefecto FOREIGN KEY (idresponsable) REFERENCES mod_persona.dat_persona(idpersona) ON DELETE SET NULL;
ALTER TABLE ONLY dat_plantillaestructura
    ADD CONSTRAINT fk_plantilla_plantillaestructura FOREIGN KEY (idplantilla) REFERENCES dat_plantilla(idplantilla) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_reporte
    ADD CONSTRAINT fk_reporte_reporte FOREIGN KEY (idreporte) REFERENCES dat_reporte(idreporte) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_reportefiltro
    ADD CONSTRAINT fk_reporte_reportefiltro FOREIGN KEY (idreporte) REFERENCES dat_reporte(idreporte) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_reportefiltronomenclador
    ADD CONSTRAINT fk_reportefiltro_reportefiltronomenclador FOREIGN KEY (idfiltro) REFERENCES dat_reportefiltro(idfiltro) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_reportefiltronumerico
    ADD CONSTRAINT fk_reportefiltro_reportefiltronomenclador FOREIGN KEY (idfiltro) REFERENCES dat_reportefiltro(idfiltro) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_reportefiltrotexto
    ADD CONSTRAINT fk_reportefiltro_reportefiltrotexto FOREIGN KEY (idfiltro) REFERENCES dat_reportefiltro(idfiltro) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_compartimentacion
    ADD CONSTRAINT fk_rol_compartimentacion FOREIGN KEY (idrol) REFERENCES mod_seguridad.seg_rol(idrol);
ALTER TABLE ONLY conf_valorespordefecto
    ADD CONSTRAINT fk_sector_valorespordefecto FOREIGN KEY (idsector) REFERENCES mod_crmcontratacion.nom_sector(idsector) ON DELETE SET NULL;
ALTER TABLE ONLY conf_valorespordefecto
    ADD CONSTRAINT fk_tipocontrato_valorespordefecto FOREIGN KEY (idtipocontrato) REFERENCES mod_crmcontratacion.dat_tipocontrato(idtipocontrato) ON DELETE SET NULL;
ALTER TABLE ONLY dat_comitetransicion
    ADD CONSTRAINT fk_transicion_comitetransicion FOREIGN KEY (idtransicion) REFERENCES mod_crmcontratacion.nom_transicion(idtransicion);
SET search_path = mod_crmclienteproveedor, pg_catalog;
ALTER TABLE ONLY dat_perfilcliente
    ADD CONSTRAINT fk_clienteproveedor_perfilcliente FOREIGN KEY (idclienteproveedor) REFERENCES mod_datosmaestros.nom_clientesproveedor(idclientesproveedores) ON DELETE CASCADE;
ALTER TABLE ONLY dat_cuestionariopregunta
    ADD CONSTRAINT fk_cuestionario_cuestionariopregunta FOREIGN KEY (idcuestionario) REFERENCES nom_cuestionario(idcuestionario);
ALTER TABLE ONLY dat_perfilcliente
    ADD CONSTRAINT fk_cuestionario_perfilcliente FOREIGN KEY (idcuestionario) REFERENCES nom_cuestionario(idcuestionario);
ALTER TABLE ONLY dat_cuestionariopregunta
    ADD CONSTRAINT fk_pregunta_cuestionariopregunta FOREIGN KEY (idpregunta) REFERENCES nom_pregunta(idpregunta);
ALTER TABLE ONLY dat_perfilcliente
    ADD CONSTRAINT fk_respuesta_perfilcliente FOREIGN KEY (idrespuesta) REFERENCES nom_respuesta(idrespuesta);
ALTER TABLE ONLY dat_identificador
    ADD CONSTRAINT fk_tipocodigo_identificador FOREIGN KEY (idtipocodigo) REFERENCES nom_tipocodigo(idtipocodigo) ON DELETE CASCADE;
ALTER TABLE ONLY dat_facultad
    ADD CONSTRAINT fk_tipofacultad_tipofacultadcontacto FOREIGN KEY (idtipofacultad) REFERENCES nom_tipofacultad(idtipofacultad) ON DELETE CASCADE;
ALTER TABLE ONLY nom_pregunta
    ADD CONSTRAINT fk_tiporespuesta_pregunta FOREIGN KEY (idtiporespuesta) REFERENCES nom_tiporespuesta(idtiporespuesta);
ALTER TABLE ONLY nom_respuesta
    ADD CONSTRAINT fk_tiporespuesta_respuesta FOREIGN KEY (idtiporespuesta) REFERENCES nom_tiporespuesta(idtiporespuesta);
SET search_path = mod_crmcontratacion, pg_catalog;
ALTER TABLE ONLY dat_contrato
    ADD CONSTRAINT fk_categoria_contrato FOREIGN KEY (idcategoria) REFERENCES nom_categoria(idcategoria);
ALTER TABLE ONLY dat_proformaclausula
    ADD CONSTRAINT fk_clausula_proformaclausula FOREIGN KEY (idclausula) REFERENCES nom_clausula(idclausula);
ALTER TABLE ONLY dat_contratoareaimplicada
    ADD CONSTRAINT fk_contrato_contratoareaimplicada FOREIGN KEY (idcontrato) REFERENCES dat_contrato(idcontrato) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_contratoestado
    ADD CONSTRAINT fk_contrato_contratoestado FOREIGN KEY (idcontrato) REFERENCES dat_contrato(idcontrato) ON DELETE CASCADE;
ALTER TABLE ONLY dat_dictamen
    ADD CONSTRAINT fk_contrato_dictamen FOREIGN KEY (idcontrato) REFERENCES dat_contrato(idcontrato) ON DELETE CASCADE;
ALTER TABLE ONLY dat_hito
    ADD CONSTRAINT fk_contrato_hito FOREIGN KEY (idcontrato) REFERENCES dat_contrato(idcontrato) ON DELETE CASCADE;
ALTER TABLE ONLY dat_indicadorcontrato
    ADD CONSTRAINT fk_contrato_indicadorcontrato FOREIGN KEY (idcontrato) REFERENCES dat_contrato(idcontrato) ON DELETE CASCADE;
ALTER TABLE ONLY dat_mediopagocontrato
    ADD CONSTRAINT fk_contrato_mediopago FOREIGN KEY (idcontrato) REFERENCES dat_contrato(idcontrato) ON DELETE CASCADE;
ALTER TABLE ONLY dat_solicitudpago
    ADD CONSTRAINT fk_contrato_solicitudpago FOREIGN KEY (idcontrato) REFERENCES dat_contrato(idcontrato) ON DELETE CASCADE;
ALTER TABLE ONLY dat_monedacontrato
    ADD CONSTRAINT fk_datcontrato_monedacontrato FOREIGN KEY (idcontrato) REFERENCES dat_contrato(idcontrato) ON DELETE CASCADE;
ALTER TABLE ONLY conf_entidadformatonumcontratoincremento
    ADD CONSTRAINT fk_entidadformatonumcontrato_entidadformatonumcontratoincrement FOREIGN KEY (identidadformatonumcontrato) REFERENCES conf_entidadformatonumcontrato(identidadformatonumcontrato) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_solicitudnegocioestado
    ADD CONSTRAINT fk_estado FOREIGN KEY (idestado) REFERENCES nom_estado(idestado) ON UPDATE CASCADE;
ALTER TABLE ONLY dat_hitoestado
    ADD CONSTRAINT fk_estado FOREIGN KEY (idestado) REFERENCES nom_estado(idestado) ON UPDATE CASCADE;
ALTER TABLE ONLY dat_contratoestado
    ADD CONSTRAINT fk_estado FOREIGN KEY (idestado) REFERENCES nom_estado(idestado) ON UPDATE CASCADE;
ALTER TABLE ONLY dat_contrato
    ADD CONSTRAINT fk_estado_contrato FOREIGN KEY (idestado) REFERENCES nom_estado(idestado);
ALTER TABLE ONLY dat_dictamen
    ADD CONSTRAINT fk_estado_dictamen FOREIGN KEY (idestado) REFERENCES nom_estado(idestado);
ALTER TABLE ONLY dat_ofertadictamen
    ADD CONSTRAINT fk_estado_ofertadictamen FOREIGN KEY (idestado) REFERENCES nom_estado(idestado);
ALTER TABLE ONLY dat_ofertanegocioestado
    ADD CONSTRAINT fk_estado_ofertanegocioestado FOREIGN KEY (idestado) REFERENCES nom_estado(idestado) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_solicituddictamen
    ADD CONSTRAINT fk_estado_solicituddictamen FOREIGN KEY (idestado) REFERENCES nom_estado(idestado);
ALTER TABLE ONLY dat_solicitudpagoestado
    ADD CONSTRAINT fk_estado_solicitudpago FOREIGN KEY (idestado) REFERENCES nom_estado(idestado) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_solicitudpagodictamen
    ADD CONSTRAINT fk_estado_solicitudpagodictamen FOREIGN KEY (idestado) REFERENCES nom_estado(idestado);
ALTER TABLE ONLY nom_transicion
    ADD CONSTRAINT fk_estadofinal_transicion FOREIGN KEY (idestadofinal) REFERENCES nom_estado(idestado);
ALTER TABLE ONLY nom_transicion
    ADD CONSTRAINT fk_estadoinicial_transicion FOREIGN KEY (idestadoinicial) REFERENCES nom_estado(idestado);
ALTER TABLE ONLY dat_facturamoneda
    ADD CONSTRAINT fk_factura_facturamoneda FOREIGN KEY (idfactura) REFERENCES dat_facturasolicitudpago(idfactura) ON DELETE CASCADE;
ALTER TABLE ONLY dat_proforma
    ADD CONSTRAINT fk_filaestruc_proforma FOREIGN KEY (idestructuracomun) REFERENCES mod_estructuracomp.nom_filaestruc(idfila);
ALTER TABLE ONLY conf_entidadformatonumcontrato
    ADD CONSTRAINT fk_formatonumcontrato_entidadformatonumcontrato FOREIGN KEY (idformatonumcontrato) REFERENCES nom_formatonumcontrato(idformatonumcontrato) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY nom_formatonumcontratoelemento
    ADD CONSTRAINT fk_formatonumcontrato_formatonumcontratoelemento FOREIGN KEY (idformatonumcontrato) REFERENCES nom_formatonumcontrato(idformatonumcontrato) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY conf_entidadformatonumcontratoincremento
    ADD CONSTRAINT fk_formatonumcontratoelemento_entidadformatonumcontratoincremen FOREIGN KEY (idformatonumcontratoelemento) REFERENCES nom_formatonumcontratoelementonumerico(idformatonumcontratoelemento) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE ONLY nom_formatonumcontratoelementofecha
    ADD CONSTRAINT fk_formatonumcontratoelemento_formatonumcontratoelementofecha FOREIGN KEY (idformatonumcontratoelemento) REFERENCES nom_formatonumcontratoelemento(idformatonumcontratoelemento) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY nom_formatonumcontratoelementonomenclador
    ADD CONSTRAINT fk_formatonumcontratoelemento_formatonumcontratoelementonomencl FOREIGN KEY (idformatonumcontratoelemento) REFERENCES nom_formatonumcontratoelemento(idformatonumcontratoelemento) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY nom_formatonumcontratoelementonumerico
    ADD CONSTRAINT fk_formatonumcontratoelemento_formatonumcontratoelementonumeric FOREIGN KEY (idformatonumcontratoelemento) REFERENCES nom_formatonumcontratoelementonumerico(idformatonumcontratoelemento) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY nom_formatonumcontratoelementoparametro
    ADD CONSTRAINT fk_formatonumcontratoelemento_formatonumcontratoelementoparamet FOREIGN KEY (idformatonumcontratoelemento) REFERENCES nom_formatonumcontratoelemento(idformatonumcontratoelemento) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY nom_formatonumcontratoelementotexto
    ADD CONSTRAINT fk_formatonumcontratoelemento_formatonumcontratoelementotexto FOREIGN KEY (idformatonumcontratoelemento) REFERENCES nom_formatonumcontratoelementotexto(idformatonumcontratoelemento) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY nom_formatonumcontratoelementonomencladorvalor
    ADD CONSTRAINT fk_formatonumcontratoelementonomenclador_formatonumcontratoelem FOREIGN KEY (idformatonumcontratoelemento) REFERENCES nom_formatonumcontratoelementonomenclador(idformatonumcontratoelemento) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_hitoestado
    ADD CONSTRAINT fk_hito_hitoestado FOREIGN KEY (idhito) REFERENCES dat_hito(idhito) ON DELETE CASCADE;
ALTER TABLE ONLY dat_indicadorhito
    ADD CONSTRAINT fk_hito_indicadorhito FOREIGN KEY (idhito) REFERENCES dat_hito(idhito) ON DELETE CASCADE;
ALTER TABLE ONLY dat_monedahito
    ADD CONSTRAINT fk_hito_monedahito FOREIGN KEY (idhito) REFERENCES dat_hito(idhito) ON DELETE CASCADE;
ALTER TABLE ONLY dat_indicadorhitooferta
    ADD CONSTRAINT fk_hitooferta_indicadorhitooferta FOREIGN KEY (idhitooferta) REFERENCES dat_hitooferta(idhitooferta) ON DELETE CASCADE;
ALTER TABLE ONLY dat_solicitudpago
    ADD CONSTRAINT fk_idmediodepago_solicitudpago FOREIGN KEY (idformapago) REFERENCES nom_mediodepago(idmediodepago) ON DELETE CASCADE;
ALTER TABLE ONLY dat_monedaindicadorcontrato
    ADD CONSTRAINT fk_indicadorcontrato_monedaindicador FOREIGN KEY (idindicadorcontrato) REFERENCES dat_indicadorcontrato(idindicadorcontrato) ON DELETE CASCADE;
ALTER TABLE ONLY dat_monedaindicador
    ADD CONSTRAINT fk_indicadorhito_monedaindicador FOREIGN KEY (idindicadorhito) REFERENCES dat_indicadorhito(idindicadorhito) ON DELETE CASCADE;
ALTER TABLE ONLY dat_monedaindicadorhitooferta
    ADD CONSTRAINT fk_indicadorhitooferta_monedaindicadorhitooferta FOREIGN KEY (idindicadorhitooferta) REFERENCES dat_indicadorhitooferta(idindicadorhitooferta);
ALTER TABLE ONLY dat_monedaindicadoroferta
    ADD CONSTRAINT fk_indicadoroferta_monedaindicadoroferta FOREIGN KEY (idindicadoroferta) REFERENCES dat_indicadoroferta(idindicadoroferta);
ALTER TABLE ONLY dat_contrato
    ADD CONSTRAINT fk_mediodepago_contrato FOREIGN KEY (idmediopago) REFERENCES nom_mediodepago(idmediodepago);
ALTER TABLE ONLY dat_mediopagooferta
    ADD CONSTRAINT fk_mediodepago_mediopagooferta FOREIGN KEY (idmediopago) REFERENCES nom_mediodepago(idmediodepago) ON DELETE CASCADE;
ALTER TABLE ONLY dat_mediopagocontrato
    ADD CONSTRAINT fk_nommediopago_mediopago FOREIGN KEY (idmediopago) REFERENCES nom_mediodepago(idmediodepago);
ALTER TABLE ONLY dat_hito
    ADD CONSTRAINT fk_nomperiodicidad_hito FOREIGN KEY (idiguala) REFERENCES nom_periodicidad(idperiodicidad);
ALTER TABLE ONLY dat_ofertadictamen
    ADD CONSTRAINT fk_oferta_dictamen FOREIGN KEY (idoferta) REFERENCES dat_ofertanegocio(idoferta) ON DELETE CASCADE;
ALTER TABLE ONLY dat_hitooferta
    ADD CONSTRAINT fk_ofertanegocio_hitooferta FOREIGN KEY (idoferta) REFERENCES dat_ofertanegocio(idoferta) ON DELETE CASCADE;
ALTER TABLE ONLY dat_indicadoroferta
    ADD CONSTRAINT fk_ofertanegocio_indicadoroferta FOREIGN KEY (idoferta) REFERENCES dat_ofertanegocio(idoferta) ON DELETE CASCADE;
ALTER TABLE ONLY dat_mediopagooferta
    ADD CONSTRAINT fk_ofertanegocio_mediopagooferta FOREIGN KEY (idoferta) REFERENCES dat_ofertanegocio(idoferta) ON DELETE CASCADE;
ALTER TABLE ONLY dat_monedahitooferta
    ADD CONSTRAINT fk_ofertanegocio_monedahitooferta FOREIGN KEY (idhitooferta) REFERENCES dat_hitooferta(idhitooferta) ON DELETE CASCADE;
ALTER TABLE ONLY dat_monedaoferta
    ADD CONSTRAINT fk_ofertanegocio_monedaoferta FOREIGN KEY (idoferta) REFERENCES dat_ofertanegocio(idoferta) ON DELETE CASCADE;
ALTER TABLE ONLY dat_ofertanegocioestado
    ADD CONSTRAINT fk_ofertanegocio_ofertanegocioestado FOREIGN KEY (idoferta) REFERENCES dat_ofertanegocio(idoferta) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY nom_transicion
    ADD CONSTRAINT fk_proceso_transicion FOREIGN KEY (idproceso) REFERENCES nom_proceso(idproceso);
ALTER TABLE ONLY dat_productosdatosadicionales
    ADD CONSTRAINT fk_productodatosadicionales_producto FOREIGN KEY (idproducto) REFERENCES dat_indicadorcontrato(idindicadorcontrato) ON DELETE CASCADE;
ALTER TABLE ONLY dat_contrato
    ADD CONSTRAINT fk_proforma_contrato FOREIGN KEY (idproforma) REFERENCES dat_proforma(idproforma);
ALTER TABLE ONLY dat_proformaclausula
    ADD CONSTRAINT fk_proforma_proformaclausula FOREIGN KEY (idproforma) REFERENCES dat_proforma(idproforma) ON DELETE CASCADE;
ALTER TABLE ONLY dat_solicituddictamen
    ADD CONSTRAINT fk_rol_solicituddictamen FOREIGN KEY (idrol) REFERENCES mod_seguridad.seg_rol(idrol);
ALTER TABLE ONLY dat_solicitudpagodictamen
    ADD CONSTRAINT fk_rol_solicituddictamen FOREIGN KEY (idrol) REFERENCES mod_seguridad.seg_rol(idrol);
ALTER TABLE ONLY dat_contrato
    ADD CONSTRAINT fk_sector_contrato FOREIGN KEY (idsector) REFERENCES nom_sector(idsector);
ALTER TABLE ONLY dat_ofertanegocio
    ADD CONSTRAINT fk_sector_ofertanegocio FOREIGN KEY (idsector) REFERENCES nom_sector(idsector);
ALTER TABLE ONLY dat_solicitudnegocio
    ADD CONSTRAINT fk_sector_solicitudnegocio FOREIGN KEY (idsector) REFERENCES nom_sector(idsector) ON UPDATE CASCADE;
ALTER TABLE ONLY dat_solicituddictamen
    ADD CONSTRAINT fk_solicitud_dictamen FOREIGN KEY (idsolicitud) REFERENCES dat_solicitudnegocio(idsolicitud) ON DELETE CASCADE;
ALTER TABLE ONLY dat_solicitudpagodictamen
    ADD CONSTRAINT fk_solicitud_dictamen FOREIGN KEY (idsolicitudpago) REFERENCES dat_solicitudpago(idsolicitudpago) ON DELETE CASCADE;
ALTER TABLE ONLY dat_indicadorsolicitud
    ADD CONSTRAINT fk_solicitudnegocio_indicadorsolicitud FOREIGN KEY (idsolicitudnegocio) REFERENCES dat_solicitudnegocio(idsolicitud) ON DELETE CASCADE;
ALTER TABLE ONLY dat_ofertanegocio
    ADD CONSTRAINT fk_solicitudnegocio_ofertanegocio FOREIGN KEY (idsolicitud) REFERENCES dat_solicitudnegocio(idsolicitud);
ALTER TABLE ONLY dat_solicitudnegocioareaimplicada
    ADD CONSTRAINT fk_solicitudnegocio_solicitudnegocioareaimplicada FOREIGN KEY (idsolicitud) REFERENCES dat_solicitudnegocio(idsolicitud) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_solicitudnegocioestado
    ADD CONSTRAINT fk_solicitudnegocio_solicitudnegocioestado FOREIGN KEY (idsolicitud) REFERENCES dat_solicitudnegocio(idsolicitud) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_solicitudnegocioproveedor
    ADD CONSTRAINT fk_solicitudnegocio_solicitudnegocioproveedor FOREIGN KEY (idsolicitudnegocio) REFERENCES dat_solicitudnegocio(idsolicitud) ON DELETE CASCADE;
ALTER TABLE ONLY dat_facturasolicitudpago
    ADD CONSTRAINT fk_solicitudpago_facturas FOREIGN KEY (idsolicitudpago) REFERENCES dat_solicitudpago(idsolicitudpago) ON DELETE CASCADE;
ALTER TABLE ONLY dat_solicitudpagoobjetivo
    ADD CONSTRAINT fk_solicitudpago_objetivosolicitudpago FOREIGN KEY (idsolicitudpago) REFERENCES dat_solicitudpago(idsolicitudpago) ON DELETE CASCADE;
ALTER TABLE ONLY dat_solicitudpagoestado
    ADD CONSTRAINT fk_solicitudpago_solicitudpagoestado FOREIGN KEY (idsolicitudpago) REFERENCES dat_solicitudpago(idsolicitudpago) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY dat_contrato
    ADD CONSTRAINT fk_tipocontrato_contrato FOREIGN KEY (idtipocontrato) REFERENCES dat_tipocontrato(idtipocontrato);
ALTER TABLE ONLY dat_proforma
    ADD CONSTRAINT fk_tipocontrato_proforma FOREIGN KEY (idtipocontrato) REFERENCES dat_tipocontrato(idtipocontrato);
ALTER TABLE ONLY dat_roltransicion
    ADD CONSTRAINT fk_transicion_roltransicion FOREIGN KEY (idtransicion) REFERENCES nom_transicion(idtransicion) ON DELETE CASCADE;
ALTER TABLE ONLY dat_dictamen
    ADD CONSTRAINT fk_usuario_dictamen FOREIGN KEY (idusuario) REFERENCES mod_seguridad.seg_usuario(idusuario);
ALTER TABLE ONLY dat_solicituddictamen
    ADD CONSTRAINT fk_usuario_solicituddictamen FOREIGN KEY (idusuario) REFERENCES mod_seguridad.seg_usuario(idusuario);
ALTER TABLE ONLY dat_solicitudpagodictamen
    ADD CONSTRAINT fk_usuario_solicituddictamen FOREIGN KEY (idusuario) REFERENCES mod_seguridad.seg_usuario(idusuario);

	ALTER TABLE mod_crmcontratacion.dat_contrato ADD COLUMN vehiculos character varying(255);


CREATE SEQUENCE mod_crmcontratacion.sec_vehiculocontrato_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE mod_crmcontratacion.sec_vehiculocontrato_seq
  OWNER TO zeolides;


CREATE TABLE mod_crmcontratacion.dat_vehiculocontrato
(
  idvehiculocontrato numeric(19,0) NOT NULL DEFAULT nextval('mod_crmcontratacion.sec_vehiculocontrato_seq'::regclass), -- Identificador de la tabla.
  idclienteproveedor numeric(19,0), -- Identificador del cliente y/o proveedor.
  idindicador numeric(19,0), -- Identificador del indicador.
  idmarca numeric(19,0), -- Identificador de la marca.
  idmodelo numeric(19,0), -- Identificador del modelo.
  chapa character varying(255), -- Número de chapa o serie.
  denominacion character varying(255), -- Guarda la denominación.
  provincia character varying(255), -- Guarda la provincia a la que pertenece el vehículo.
  datos json, -- Guarda los valores de los atributos dinámicos.
  tipomedio character varying(255), -- Guarda el tipo de medio. Si es automotor o montacargas.
  CONSTRAINT pk_vehiculocontrato PRIMARY KEY (idvehiculocontrato),
  CONSTRAINT fk_vehiculocontrato_clienteproveedor FOREIGN KEY (idclienteproveedor)
      REFERENCES mod_datosmaestros.nom_clientesproveedor (idclientesproveedores) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_vehiculocontrato_indicador FOREIGN KEY (idindicador)
      REFERENCES mod_datosmaestros.nom_indicador (idindicador) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE SET NULL,
  CONSTRAINT fk_vehiculocontrato_marca FOREIGN KEY (idmarca)
      REFERENCES mod_datosmaestros.nom_marca (idmarca) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE SET NULL,
  CONSTRAINT fk_vehiculocontrato_modelo FOREIGN KEY (idmodelo)
      REFERENCES mod_datosmaestros.nom_modelo (idmodelo) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE SET NULL
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_crmcontratacion.dat_vehiculocontrato
  OWNER TO zeolides;
COMMENT ON TABLE mod_crmcontratacion.dat_vehiculocontrato
  IS 'Guarda los vehículos que se le van a prestar servicio según el contrato.';
COMMENT ON COLUMN mod_crmcontratacion.dat_vehiculocontrato.idvehiculocontrato IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_crmcontratacion.dat_vehiculocontrato.idclienteproveedor IS 'Identificador del cliente y/o proveedor.';
COMMENT ON COLUMN mod_crmcontratacion.dat_vehiculocontrato.idindicador IS 'Identificador del indicador.';
COMMENT ON COLUMN mod_crmcontratacion.dat_vehiculocontrato.idmarca IS 'Identificador de la marca.';
COMMENT ON COLUMN mod_crmcontratacion.dat_vehiculocontrato.idmodelo IS 'Identificador del modelo.';
COMMENT ON COLUMN mod_crmcontratacion.dat_vehiculocontrato.chapa IS 'Número de chapa o serie.';
COMMENT ON COLUMN mod_crmcontratacion.dat_vehiculocontrato.denominacion IS 'Guarda la denominación.';
COMMENT ON COLUMN mod_crmcontratacion.dat_vehiculocontrato.provincia IS 'Guarda la provincia a la que pertenece el vehículo.';
COMMENT ON COLUMN mod_crmcontratacion.dat_vehiculocontrato.datos IS 'Guarda los valores de los atributos dinámicos.';
COMMENT ON COLUMN mod_crmcontratacion.dat_vehiculocontrato.tipomedio IS 'Guarda el tipo de medio. Si es automotor o montacargas.';



CREATE SEQUENCE mod_crmadministracion.sec_confproforma_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 7
  CACHE 1;
ALTER TABLE mod_crmadministracion.sec_confproforma_seq
  OWNER TO zeolides;


CREATE TABLE mod_crmadministracion.conf_proforma
(
  idconfproforma numeric(1,0) NOT NULL DEFAULT nextval('mod_crmadministracion.sec_confproforma_seq'::regclass), -- Identificador de la solicitud de negocio
  idespaciotrabajo character varying(255), -- Identificador del espacio de trabajo
  espaciotrabajo character varying(255), -- Denominación del espacio de trabajo.
  activo numeric(1,0), -- 1 si esta activo o no el gestor documental
  CONSTRAINT pk_confproforma PRIMARY KEY (idconfproforma)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_crmadministracion.conf_proforma
  OWNER TO zeolides;
COMMENT ON COLUMN mod_crmadministracion.conf_proforma.idconfproforma IS 'Identificador de la solicitud de negocio';
COMMENT ON COLUMN mod_crmadministracion.conf_proforma.idespaciotrabajo IS 'Identificador del espacio de trabajo';
COMMENT ON COLUMN mod_crmadministracion.conf_proforma.espaciotrabajo IS 'Denominación del espacio de trabajo.';
COMMENT ON COLUMN mod_crmadministracion.conf_proforma.activo IS '1 si esta activo o no el gestor documental';




CREATE SEQUENCE mod_crmcontratacion.sec_tipocontratoentidad_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE mod_crmcontratacion.sec_tipocontratoentidad_seq
  OWNER TO zeolides;






CREATE TABLE mod_crmcontratacion.dat_tipocontratoentidad
(
  idtipocontratoentidad numeric(19,0) NOT NULL DEFAULT nextval('mod_crmcontratacion.sec_tipocontratoentidad_seq'::regclass), -- Identidficador de la tabla dat_tipocontratoentidad.
  idtipocontrato numeric(19,0), -- Identificador de cliente-proveedor.
  idestructuracomun numeric(19,0), -- Identificador de la estructura común.
  CONSTRAINT pk_tipocontratoentidad PRIMARY KEY (idtipocontratoentidad),
  CONSTRAINT fk_filaestruct_tipocontratoentidad FOREIGN KEY (idestructuracomun)
      REFERENCES mod_estructuracomp.nom_filaestruc (idfila) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_tipocontrato_tipocontratoentidad FOREIGN KEY (idtipocontrato)
      REFERENCES mod_crmcontratacion.dat_tipocontrato (idtipocontrato) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_crmcontratacion.dat_tipocontratoentidad
  OWNER TO zeolides;
COMMENT ON COLUMN mod_crmcontratacion.dat_tipocontratoentidad.idtipocontratoentidad IS 'Identidficador de la tabla dat_tipocontratoentidad.';
COMMENT ON COLUMN mod_crmcontratacion.dat_tipocontratoentidad.idtipocontrato IS 'Identificador de cliente-proveedor.';
COMMENT ON COLUMN mod_crmcontratacion.dat_tipocontratoentidad.idestructuracomun IS 'Identificador de la estructura común.';




ALTER TABLE mod_crmcontratacion.dat_tipocontrato ADD COLUMN idespaciotrabajo character varying(255);



CREATE SEQUENCE mod_crmcontratacion.sec_hitocertificodesglose_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999 START 1
  CACHE 1;


CREATE TABLE mod_crmcontratacion.dat_hitocertificodesglose (
  idhitocertificodesglose NUMERIC(19,0) DEFAULT nextval('mod_crmcontratacion.sec_hitocertificodesglose_seq'::regclass) NOT NULL,
  idhito NUMERIC(19,0) NOT NULL,
  idusuario NUMERIC(19,0) NOT NULL,
  fecha DATE,
  CONSTRAINT pk_hito_hitocertificodesglos PRIMARY KEY(idhitocertificodesglose),
  CONSTRAINT fk_hito_hitocertificodesglos FOREIGN KEY (idhito)
    REFERENCES mod_crmcontratacion.dat_hito(idhito)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
)
WITH (oids = false);

ALTER TABLE mod_crmcontratacion.dat_hitocertificodesglose
  OWNER TO zeolides;

