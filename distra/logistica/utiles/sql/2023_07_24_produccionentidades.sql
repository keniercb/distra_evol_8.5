CREATE OR REPLACE FUNCTION mod_datosmaestros.f_crearsubsistemaproduccion (
)
RETURNS void AS
$body$
declare
v_rec record;
v_recAux record;
v_countExist numeric;
begin
v_countExist := (select count(ns.idsubsistema) from mod_datosmaestros.nom_subsistema ns where ns.idsubsistema = 114);
raise notice 'contador %', v_countExist;
if v_countExist = 0 then
	INSERT INTO 
      mod_datosmaestros.nom_subsistema
    (
      idsubsistema,
      denominacion,
      uri
    )
    VALUES (
      114,
      'Produccion',
      'logistica/produccion'
    );
end if;
for v_rec in (
	select vdm.idestructura, vdm.codigo, vdm.denominacion
    from mod_estructuracomp.nom_filaestruc f
    inner join mod_estructuracomp.v_dametodasestructuras vdm on f.idfila = vdm.idestructura

    where (vdm.idconcepto = 3 or (vdm.idconcepto = 5 and vdm.idorgano = -2))
)
	
loop
	v_countExist := (select count(est.idestructurasubsist) from mod_datosmaestros.dat_estructurasubsist est 
    				where est.idestructuracomun = v_rec.idestructura and est.idsubsistema = 114);
    if v_countExist = 0 then
    	INSERT INTO 
          mod_datosmaestros.dat_estructurasubsist
        (
          idsubsistema,
          idestado,
          idestructuracomun,
          contabiliza,
          cierra
        )
        VALUES (
          114,
          0,
          v_rec.idestructura,
          0,
          0
        );
    end if;                
end loop;
end
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 500;

ALTER FUNCTION mod_datosmaestros.f_crearsubsistemaproduccion ()
  OWNER TO zeolides;
  
SELECT * FROM mod_datosmaestros.f_crearsubsistemaproduccion();  