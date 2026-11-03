ALTER TYPE mod_logtaller.td_getestadia
  ADD ATTRIBUTE ubicacion VARCHAR;

  CREATE OR REPLACE FUNCTION mod_logtaller.f_getestadia (
  p_tiporeporte numeric,
  p_fechainicio date,
  p_fechafin date,
  p_sector numeric,
  p_cliente numeric,
  p_idestructura numeric,
  p_start numeric,
  p_limit numeric
)
RETURNS SETOF mod_logtaller.td_getestadia AS
$body$
    DECLARE

    v_rec mod_logtaller.td_getestadia;
    
    BEGIN

        for v_rec in

          SELECT  (case when dot.fechacierre is null then (( Select current_date ) - dot.fechainicio)
                 else (dot.fechacierre - dot.fechainicio) end) as estadia,
                  dot.fechainicio,
                  dot.fechacierre,
                  dd.nrodoc,
                  nmc.nombre as cliente,
                  dd.estado,
                  nmc.abreviatura,
                  round(AVG(All (select(case when dot.fechacierre is null then ((Select current_date) - dot.fechainicio) 
                  else (dot.fechacierre-dot.fechainicio) end))) OVER(),2) as promedio,
                  count(1) over() as cantidad,
                  nut.denominacion as ubicacion
           FROM mod_logistica.dat_documento dd
                inner join mod_logtaller.dat_ordentrabajo dot on dot.idordentrabajo = dd.iddocumento
                inner join mod_logistica.dat_documentocliente dmc on dmc.iddocumento = dd.iddocumento 
                inner join mod_datosmaestros.nom_clientesproveedor nmc on nmc.idclientesproveedores = dmc.idcliente
                inner join mod_logtaller.nom_ubicaciontall nut on nut.idubicaciontall = dot.ubicacionactual
           WHERE dd.idestructuracomun = p_idestructura and dmc.tipocliente = 1 and 
                case when p_sector is not null then nmc.idsector = p_sector else true end and 
                case when p_cliente is not null then dmc.idcliente = p_cliente else true end and     
              case when p_tiporeporte = 1 then 
                 ( 
                 (case when p_fechainicio is not null then dot.fechainicio >= p_fechainicio  and dd.estado in (1,2) else true end) and 
                  (case when p_fechafin is not null then dot.fechainicio <= p_fechafin  and dd.estado in (1,2) else true end)
                  )
                  else true end and
                  case when p_tiporeporte = 2 then 
                  (
                  (case when p_fechainicio is not null then dot.fechacierre >= p_fechainicio  and dot.fechacierre is not null else true end) and 
                  (case when p_fechafin is not null then dot.fechacierre <= p_fechafin  and dot.fechacierre is not null else true end)
                    
                  )
                  else true end and
                  case when p_tiporeporte = 3 then 
                  (
                  ((case when p_fechainicio is not null then dot.fechainicio >= p_fechainicio  and dd.estado in (1,2) else true end) and 
                  (case when p_fechafin is not null then dot.fechainicio <= p_fechafin  and dd.estado in (1,2) else true end)
                  ))or
                  ((case when p_fechainicio is not null then dot.fechacierre >= p_fechainicio  and dot.fechacierre is not null else true end) and 
                  (case when p_fechafin is not null then dot.fechacierre <= p_fechafin  and dot.fechacierre is not null else true end)
                  )
                  else true end
           			order by (case when dot.fechacierre is null then (( Select current_date ) - dot.fechainicio)
                 else (dot.fechacierre - dot.fechainicio) end) desc
                      limit p_limit
                      offset p_start
                      
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

CREATE OR REPLACE VIEW mod_logtaller.v_ordentrabajo(
    idordentrabajo,
    nrodoc,
    numeroref,
    anno,
    fechacontable,
    estado,
    observaciones,
    codigoentidad,
    entidad,
    cliente,
    tecnico,
    fechainicio,
    fechafin,
    dictamentecnico,
    importecup,
    importecuc,
    fechacierre,
    garantia,
    creadopor,
    aprobadopor,
    cerradopor,
    idestado,
    estadoorden,
    idestructuracomun,
    iddoc,
    idagencia,
    idcliente,
    identificador)
AS
  SELECT DISTINCT dd.iddocumento AS idordentrabajo,
         dd.nrodoc,
         dd.numeroref,
         dd.anno,
         dd.fechacontable,
         dd.estado,
         dd.observaciones,
         dd.codigoentidad,
         dd.entidad,
         COALESCE(vdc.nombre, ''::character varying) AS cliente,
         vp.nombre AS tecnico,
         dot.fechainicio,
         dot.fechafin,
         dot.dictamentecnico,
         dot.importe AS importecup,
         dot.importealternativo AS importecuc,
         dot.fechacierre,
         CASE
           WHEN dot.garantia = 1::numeric THEN 'Si'::text
           ELSE 'No'::text
         END AS garantia,
         dd.creadopor,
         dd.aprobadopor,
         sux.nombreusuario AS cerradopor,
         dd.idestado,
         dot.estadoorden,
         dd.idestructuracomun,
         dd.iddoc,
         dot.idagencia,
         dot.idcliente,
         dot.atributoidentificador AS identificador,
         nut.denominacion as ubicacion
  FROM mod_logistica.v_documento dd
       JOIN mod_logtaller.dat_ordentrabajo dot ON dot.idordentrabajo = dd.iddocumento
       inner join mod_logtaller.nom_ubicaciontall nut on nut.idubicaciontall = dot.ubicacionactual
       LEFT JOIN mod_logistica.v_documentocliente vdc ON vdc.iddocumento = dd.iddocumento
       LEFT JOIN mod_logtaller.v_persona vp ON vp.idpersona = dot.idtecnico
       LEFT JOIN mod_seguridad.seg_usuario sux ON sux.idusuario = dot.cerradopor;