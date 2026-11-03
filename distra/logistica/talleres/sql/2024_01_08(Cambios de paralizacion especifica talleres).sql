
CREATE TYPE mod_logtaller.td_paraliespecifica AS (
  idordentrabajo NUMERIC(19,0),
  entidad VARCHAR(255),
  agencia VARCHAR(255),
  cliente VARCHAR(255),
  marca VARCHAR(255),
  modelo VARCHAR(255),
  matricula VARCHAR(255),
  motivo VARCHAR(255),
  fechaentrada DATE,
  fechainicio DATE,
  diasparalizado NUMERIC(19,0),
  fechapronostico DATE,
  fechafin DATE,
  sobreestadia NUMERIC(19,0),
  nropedido VARCHAR(255),
  fechapedido VARCHAR(255),
  nrdoc VARCHAR(255),
  observaciones VARCHAR(255),
  faltante VARCHAR(255),
  indicativo VARCHAR(255),
  pendientepor VARCHAR(255),
  estadoorden NUMERIC(19,0),
  nroorden VARCHAR(255),
  atributoidentificador VARCHAR(255),
  dictamentecnico VARCHAR(255),
  idestado NUMERIC(19,0),
  idagencia NUMERIC(19,0),
  idcliente NUMERIC(19,0),
  idestructuracomun NUMERIC(19,0),
  iddoc NUMERIC(19,0),
  ubicacion VARCHAR(255),
  idconfiguracion NUMERIC(19,0),
  idgruposubgrupo NUMERIC(19,0),
  idusuario NUMERIC,
  denoconfiguracion VARCHAR(255)
);

ALTER TYPE mod_logtaller.td_paraliespecifica
  OWNER TO zeolides;

CREATE TABLE mod_logtaller.dat_confusuarioparalizacion (
  idordentrabajo NUMERIC(19,0),
  entidad VARCHAR(255),
  agencia VARCHAR(255),
  cliente VARCHAR(255),
  marca VARCHAR(255),
  modelo VARCHAR(255),
  matricula VARCHAR(255),
  motivo VARCHAR(255),
  fechaentrada DATE,
  fechainicio DATE,
  diasparalizado NUMERIC(19,0),
  fechapronostico DATE,
  fechafin DATE,
  sobreestadia NUMERIC(19,0),
  nropedido VARCHAR(255),
  fechapedido VARCHAR(255),
  nrdoc VARCHAR(255),
  observaciones VARCHAR(255),
  faltante VARCHAR(255),
  indicativo VARCHAR(255),
  pendientepor VARCHAR(255),
  estadoorden NUMERIC(19,0),
  nroorden VARCHAR(255),
  atributoidentificador VARCHAR(255),
  dictamentecnico VARCHAR(255),
  idestado NUMERIC(19,0),
  idagencia NUMERIC(19,0),
  idcliente NUMERIC(19,0),
  idestructuracomun NUMERIC(19,0),
  iddoc NUMERIC(19,0),
  ubicacion VARCHAR(255),
  idconfiguracion NUMERIC(19,0),
  idgruposubgrupo NUMERIC(19,0),
  idusuario NUMERIC,
  denoconfiguracion VARCHAR(255)
) 
WITH (oids = false);

ALTER TABLE mod_logtaller.dat_confusuarioparalizacion
  OWNER TO zeolides;
CREATE OR REPLACE FUNCTION mod_logtaller.f_paralizacionespecifica_new (
  marca varchar [],
  modelo varchar [],
  matricula varchar,
  tipomedio numeric,
  idconfiguracion numeric,
  idusuario numeric,
  denoconfiguracion varchar
)
RETURNS SETOF mod_logtaller.td_paraliespecifica AS
$body$
declare
v_rec mod_logtaller.td_paraliespecifica;
replace_array integer[];
cantidad INTEGER;
v_par integer;
delimitador text := ', ';
stringmarca text :=' (cast((Select nom.denominacion
        from mod_logtaller.dat_medioorden dm 
        inner join mod_datosmaestros.nom_indicador nind on nind.idindicador = dm.idindicador
        inner join mod_datosmaestros.nom_indicadorhoja nindh on nindh.idindicador = nind.idindicador
        inner join mod_datosmaestros.nom_marca nom on nom.idmarca = nindh.idmarca
        where dm.idordentrabajo = v.idordentrabajo
                ) as varchar) ilike any(%1$L))';
stringmodelo text:= ' (cast((Select nomd.denominacion
        from  mod_logtaller.dat_medioorden dm 
        inner join mod_datosmaestros.nom_indicador nind on nind.idindicador = dm.idindicador
        inner join mod_datosmaestros.nom_indicadorhoja nindh on nindh.idindicador = nind.idindicador
        inner join mod_datosmaestros.nom_modelo nomd on nomd.idmodelo = nindh.idmodelo
        where dm.idordentrabajo = v.idordentrabajo
                ) as varchar) ilike any(%2$L))                ';   
stringmatricula text:=' and cast((select d.value::json->''nromatricula'' from (SELECT value FROM json_array_elements((
                select ((cast(dm.dinamicos as json))) from mod_logtaller.dat_medioorden dm where dm.idordentrabajo = v.idordentrabajo
                ))) d where cast(d.value as VARCHAR) ilike ''%%nromatricula%%''
                ) as varchar) ilike %3$L';         
stringtipomedio text:= 'and dmo.idordentrabajo in(select dm.idordentrabajo
                from  mod_logtaller.dat_medioorden dm 
                inner join  mod_datosmaestros.nom_indicador nind on nind.idindicador = dm.idindicador
                where nind.idpadre = (select DISTINCT idtipo from mod_logtaller.dat_reportetipo where idreporteparalizacion = %4$L))';                                    


consulta text:= '
 insert into result 
 (SELECT DISTINCT 
  v.idordentrabajo,
  v.entidad as entidad,
    v.entidad as agencia,
    v.cliente,
    cast((Select nom.denominacion
        from mod_logtaller.dat_medioorden dm 
        inner join mod_datosmaestros.nom_indicador nind on nind.idindicador = dm.idindicador
        inner join mod_datosmaestros.nom_indicadorhoja nindh on nindh.idindicador = nind.idindicador
        inner join mod_datosmaestros.nom_marca nom on nom.idmarca = nindh.idmarca
        where dm.idordentrabajo = v.idordentrabajo
                ) as varchar) as marca,
    cast((Select nomd.denominacion
        from  mod_logtaller.dat_medioorden dm 
        inner join mod_datosmaestros.nom_indicador nind on nind.idindicador = dm.idindicador
        inner join mod_datosmaestros.nom_indicadorhoja nindh on nindh.idindicador = nind.idindicador
        inner join mod_datosmaestros.nom_modelo nomd on nomd.idmodelo = nindh.idmodelo
        where dm.idordentrabajo = v.idordentrabajo
                ) as varchar) as modelo,
    cast((select d.value::json->''nromatricula'' from (SELECT value FROM json_array_elements((
    select ((cast(dm.dinamicos as json))) from mod_logtaller.dat_medioorden dm where dm.idordentrabajo = v.idordentrabajo
    ))) d where cast(d.value as VARCHAR) ilike ''%%nromatricula%%''
    ) as varchar) as matricula,
    v.dictamentecnico as motivos,
    v.fechainicio as fechaentrada,
    v.fechainicio as fechainicio,
   (case
      when v.fechainicio is not null then (current_date - v.fechainicio)
      else 0
    end) as diasparalizado,
    v.fechafin as fechapronostico,
    v.fechafin,
     (case
        when v.fechafin is not null then ((current_date - v.fechafin))
        else 0
      end) as sobreestadia,
     (
     select array_to_string(array
        (
          select a.nrodoc
          from mod_logistica.dat_documento a
            where a.iddocumento in (
              select c.idpedido from mod_logtaller.dat_ordentrabajo b
              inner join mod_logtaller.dat_pedidoordentrabajo c on b.idordentrabajo = c.idordentrabajo
              where c.idordentrabajo = v.idordentrabajo )
        ), '||''''||', '||''''||' )
       ) as nropedido,
       (
         select array_to_string(array
          (select a.fechacontable 
            from mod_logistica.dat_documento a
             where a.iddocumento in (
                   select c.idpedido
                   from mod_logtaller.dat_ordentrabajo b 
                   inner join mod_logtaller.dat_pedidoordentrabajo c on b.idordentrabajo = c.idordentrabajo
                   where c.idordentrabajo = v.idordentrabajo
                    )
          ), '||''''||', '||''''||' )
   ) as fechapedido,
   v.nrodoc as ot,
  v.observaciones as observaciones,
   case
     when v.estadoorden = 1 then ' ||'''Falta de piezas'''||'
     else ' ||'''No posee'''||'
   end as faltante,
   v.identificador as indicativo,
   (case
      when v.estadoorden = 1 then ' ||'''Falta de piezas''' || '
      else ' ||''' '''||'
    end) as pendientepor, 
    v.estadoorden,      
    v.nrodoc as nroorden,
   v.identificador as atributoidentificador,
   v.dictamentecnico,
   v.idestado,
   v.idagencia,
   v.idcliente,
   v.idestructuracomun,
   v.iddoc,
   v.ubicacion,
   '||idconfiguracion||',
    drna.idgruposubgrupo,
    '||idusuario||'
        from mod_logtaller.v_ordentrabajo v
        inner join mod_logtaller.dat_medioorden dmo on dmo.idordentrabajo = v.idordentrabajo
        left join mod_logactivofijotangible.dat_registronumerico drn on drn.idproducto = dmo.idproducto
        left join mod_logactivofijotangible.dat_regnumericoactivo drna on drna.idregnumerico = drn.idregnumerico
        where v.idestado in (1,2)
        and v.tipocliente = 1';
            
begin
CREATE temp table result of mod_logtaller.td_paraliespecifica;
if (marca is not null and modelo is not null) then 
consulta:=consulta ||' and (' || stringmarca || ' or' || stringmodelo  || ' )'; 
else 
if (marca is not null ) then
 consulta:=consulta ||' and' || stringmarca;
end if;
if (modelo is not null )then 
consulta:=consulta ||' and' || stringmodelo;
end if;
end if;
if (matricula is not null ) then 
consulta:=consulta || stringmatricula;  end if;

IF(tipomedio is not null)then 
consulta:=consulta || stringtipomedio;  end if;

consulta:= consulta || ' )';
execute format (
  consulta,
    marca,
    modelo,
    matricula,
    idconfiguracion
);

return query (Select * from result);

drop table result;

end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logtaller.f_paralizacionespecifica_new (marca varchar [], modelo varchar [], matricula varchar, tipomedio numeric, idconfiguracion numeric, idusuario numeric, denoconfiguracion varchar)
  OWNER TO zeolides;
  
CREATE OR REPLACE FUNCTION mod_logtaller.f_parliespecifica (
  p_idconfiguracion numeric [],
  p_idestructuras numeric [],
  p_idusuario numeric
)
RETURNS SETOF mod_logtaller.td_paraliespecifica AS
$body$
DECLARE

all_rec mod_logtaller.td_paraliespecifica;
reportetipo numeric;
reportegrupo numeric[];
reportemarca character varying[];
reportemodelo character varying[];
denoconfiguracion character varying:='';
marcasexcluir NUMERIC[];

BEGIN


delete from mod_logtaller.dat_confusuarioparalizacion where idusuario = $3;

for i in 1 .. array_upper($1, 1)
loop
reportemodelo := (select array_agg('%'||denominacion||'%') from mod_logtaller.dat_reportemodelo
inner join mod_datosmaestros.nom_modelo using (idmodelo) where idreporteparalizacion = $1[i]
and (case when p_idestructuras is not null then idestructuracomun = any(cast(p_idestructuras as numeric[])
)
end)
);
/*
marcasexcluir := (SELECT distinct array_agg(nm.idmarca) from mod_datosmaestros.dat_nommarcamodelo nomm 
          inner join mod_datosmaestros.nom_marca nm on nm.idmarca = nomm.idmarca
                    inner join mod_datosmaestros.nom_modelo nmod on nmod.idmodelo = nomm.idmodelo
                    where nmod.denominacion ilike any(reportemodelo)); 
*/
reportetipo := (select distinct  idtipo  from mod_logtaller.dat_reportetipo where idreporteparalizacion = $1[i]
and (case when p_idestructuras is not null then idestructuracomun = any(cast(p_idestructuras as numeric[])
)
end)
);
reportemarca := (select array_agg('%'||denominacion||'%') from mod_logtaller.dat_reportemarca
inner join mod_datosmaestros.nom_marca using (idmarca) where idreporteparalizacion = $1[i]
and (case when p_idestructuras is not null then idestructuracomun = any(cast(p_idestructuras as numeric[])
) and (idmarca not in (SELECT distinct nm.idmarca from mod_datosmaestros.dat_nommarcamodelo nomm 
          inner join mod_datosmaestros.nom_marca nm on nm.idmarca = nomm.idmarca
                    inner join mod_datosmaestros.nom_modelo nmod on nmod.idmodelo = nomm.idmodelo
                    where nmod.denominacion ilike any(reportemodelo)))
end)
);
reportegrupo := (select array_agg(idgruposubgrupo) from mod_logtaller.dat_reportegruposubgrupo where idreporteparalizacion = $1[i]
and (case when p_idestructuras is not null then idestructuracomun = any(cast(p_idestructuras as numeric[])
)
end)
);
denoconfiguracion := (select ''''||denominacion||'''' from mod_logtaller.conf_reporteparalizacion where idreporteparalizacion = $1[i]);

insert into mod_logtaller.dat_confusuarioparalizacion (
  select * from mod_logtaller.f_paralizacionespecifica_new(reportemarca, reportemodelo, null,reportetipo, $1[i],$3,denoconfiguracion)
  );
end loop;
return query (select DISTINCT * from mod_logtaller.dat_confusuarioparalizacion where idusuario = $3);
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logtaller.f_parliespecifica (p_idconfiguracion numeric [], p_idestructuras numeric [], p_idusuario numeric)
  OWNER TO zeolides;

CREATE OR REPLACE VIEW mod_logtaller.v_ordentrabajo (
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
    identificador,
    ubicacion,
    tipocliente)
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
    nut.denominacion AS ubicacion,
    vdc.tipocliente
FROM mod_logistica.v_documento dd
     JOIN mod_logtaller.dat_ordentrabajo dot ON dot.idordentrabajo = dd.iddocumento
     JOIN mod_logtaller.nom_ubicaciontall nut ON nut.idubicaciontall = dot.ubicacionactual
     LEFT JOIN mod_logistica.v_documentocliente vdc ON vdc.iddocumento = dd.iddocumento
     LEFT JOIN mod_logtaller.v_persona vp ON vp.idpersona = dot.idtecnico
     LEFT JOIN mod_seguridad.seg_usuario sux ON sux.idusuario = dot.cerradopor;

ALTER VIEW mod_logtaller.v_ordentrabajo
  OWNER TO zeolides;
