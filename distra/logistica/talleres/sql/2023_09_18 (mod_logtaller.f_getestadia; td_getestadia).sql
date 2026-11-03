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

          SELECT ( select (case when dot.fechacierre is null then (( Select current_date ) - dot.fechainicio)
                 else (dot.fechacierre - dot.fechainicio) end) as estadia),
                  dot.fechainicio,
                  dot.fechacierre,
                  dd.nrodoc,
                  nmc.nombre as cliente,
                  dd.estado,
                  nmc.abreviatura,
                  round(AVG(All (select(case when dot.fechacierre is null then ((Select current_date) - dot.fechainicio) 
                  else (dot.fechacierre-dot.fechainicio) end))) OVER(),2) as promedio,
                  count(1) over() as cantidad
           FROM mod_logistica.dat_documento dd
                inner join mod_logtaller.dat_ordentrabajo dot on dot.idordentrabajo = dd.iddocumento
                inner join mod_logistica.dat_documentocliente dmc on dmc.iddocumento = dd.iddocumento 
                inner join mod_datosmaestros.nom_clientesproveedor nmc on nmc.idclientesproveedores = dmc.idcliente
           WHERE dd.idestructuracomun = 200531043 and dmc.tipocliente = 1 and 
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
                 				else (dot.fechacierre - dot.fechainicio) end) DESC
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

ALTER FUNCTION mod_logtaller.f_getestadia (p_tiporeporte numeric, p_fechainicio date, p_fechafin date, p_sector numeric, p_cliente numeric, p_idestructura numeric, p_start numeric, p_limit numeric)
  OWNER TO zeolides;


  
CREATE TYPE mod_logtaller.td_getestadia AS (
  estadia NUMERIC(19,0),
  fechainicio DATE,
  fechafin DATE,
  nrodoc NUMERIC(19,0),
  cliente VARCHAR(255),
  estado NUMERIC(19,0),
  abreviatura VARCHAR(255),
  promedio NUMERIC(19,0),
  cantidad NUMERIC(19,0)
);

ALTER TYPE mod_logtaller.td_getestadia
  OWNER TO zeolides;


