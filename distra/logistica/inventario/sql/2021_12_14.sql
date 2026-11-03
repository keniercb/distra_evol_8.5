ALTER TYPE mod_logalimento.td_listardocumentomenu
  ALTER ATTRIBUTE nrodoc TYPE VARCHAR(10);
 
ALTER TYPE mod_logalimento.td_listardocumentomenu
  ALTER ATTRIBUTE estado TYPE VARCHAR(100);
  
CREATE OR REPLACE FUNCTION mod_logalimento.f_listardocumentomenu (
  p_idestructuraop numeric
)
RETURNS SETOF mod_logalimento.td_listardocumentomenu AS
$body$
DECLARE
all_rec mod_logalimento.td_listardocumentomenu;
BEGIN
for all_rec in
select 
dd.nrodoc,
dm.fecha, 
case when dd.estado = 1 then 'Elaboración'
when dd.estado = 2 then 'Preparado'
when dd.estado = 3 then 'Aprobado'
when dd.estado = 11 then 'Revisado'
else null end as estado,
dd.fechacontable,
naa.denominacion as actividad,
nn.denominacion as norma,
su.nombreusuario as creadopor,
su1.nombreusuario as aprobadopor,
des.denominacion,
su2.nombreusuario,
i.urllogo,
(select min(ddd.fechacontable) 
from mod_logistica.dat_documento ddd
inner join mod_logalimento.dat_menu ddisd on ddisd.idmenu = ddd.iddocumento 
where ddd.idestructuracomun = $1) as fechaminima,
(select max(ddd.fechacontable) 
from mod_logistica.dat_documento ddd
inner join mod_logalimento.dat_menu ddisd on ddisd.idmenu = ddd.iddocumento 
where ddd.idestructuracomun = $1) as fechamaxima
from mod_logistica.dat_documento dd
inner join mod_logalimento.dat_menu dm on dm.idmenu = dd.iddocumento
inner join mod_logalimento.dat_actividad dac on dac.idmenu = dm.idmenu 
inner join mod_logalimento.dat_recetaactividad dea on dea.idactividad = dac.idactividad
inner join mod_logalimento.nom_actividadalimento naa on naa.idactividadalimento = dac.idactividadalimento
inner join mod_logalimento.nom_norma nn on nn.idnorma = dm.idnorma
inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
inner join mod_datosmaestros.dat_estructurasubsist desu on desu.idestructurasubsist = ddp.idestructurasubsist
inner join mod_estructuracomp.dat_estructura des on des.idestructura = desu.idestructuracomun
inner join mod_logistica.conf_general i on i.idestructura = des.idestructura
left join mod_seguridad.seg_usuario su on su.idusuario = dd.idusuario
left join mod_seguridad.seg_usuario su1 on su1.idusuario = dd.aprobadopor
left join mod_seguridad.seg_usuario su2 on su2.idusuario = dm.idrevisadopor
where (des.idestructura = $1) 
loop
return next all_rec;
end loop;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;