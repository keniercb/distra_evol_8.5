CREATE OR REPLACE FUNCTION mod_logfarmacia.f_importatarjeta (
  p_idestructura numeric,
  p_iddoc numeric,
  p_idoperacion numeric,
  p_idejercicio numeric,
  p_idperiodo numeric,
  p_cronologia numeric,
  p_idusuario numeric,
  p_fechacontable date,
  p_anno numeric,
  p_numeroref numeric
)
RETURNS numeric [] AS
$body$
DECLARE
v_productos record;
v_result integer[];
v_idtarjetadocumento NUMERIC;
v_datosventa NUMERIC;
v_datostarjeta NUMERIC;
v_iddocumento_temp NUMERIC;
v_adicionarp NUMERIC;
v_idtarjetamedicamentoprod NUMERIC;
v_idproductotarjetamedicamento NUMERIC;
v_idtarjetamedicamento NUMERIC;
v_comprobar NUMERIC;
v_comprobarproducto record;
v_comprobarpaciente NUMERIC;

BEGIN

v_result:= v_result || mod_logfarmacia.f_validadataimportatarjeta();
IF v_result @> array[3] or v_result @> array[4] THEN return v_result; END IF;


FOR v_productos IN 
SELECT DISTINCT 
  a.numeroidentidad,
  a.nombrepaciente,
  a.direccion,
  a.cmf,
  a.provincia,
  a.municipio,
  a.medicamento,
  a.dosis,
  a.nombremedico,
  a.nroregistro,
  a.policlinico,
  a.hospital,
  a.otrasunidades,
  a.fechaexpedicion,
  a.cmfarchivado,
  a.nofarmacia,
  a.snombrepaciente,
  a.apellidopaciente,
  a.sapellidopaciente,
  a.snombremedico,
  a.apellidomedico,
  a.sapellidomedico,
  (SELECT cb.idcuadrobasico FROM mod_logfarmacia.conf_cuadrobasico cb 
  INNER JOIN mod_datosmaestros.nom_indicador ni ON ni.idindicador = cb.idindicador 
  WHERE ni.numeropieza ilike a.medicamento OR ni.denominacion ilike a.medicamento 
  OR ni.descripcion ilike a.medicamento limit 1) as idcuadrobasico,
  (SELECT btrim(concat(a.nombrepaciente,' ',a.snombrepaciente,' ',a.apellidopaciente,' ',a.sapellidopaciente))) as nombrecompletopaciente,
  (SELECT btrim(concat(a.nombremedico,' ',a.snombremedico,' ',a.apellidomedico,' ',a.sapellidomedico))) as nombrecompletomedico,
  (SELECT dp.iddpt FROM mod_datosmaestros.nom_dpt dp WHERE dp.denominacion ilike a.provincia limit 1) as idprovincia,    
  (SELECT dp.iddpt FROM mod_datosmaestros.nom_dpt dp WHERE dp.denominacion ilike a.municipio limit 1) as idmunicipio

  FROM mod_logfarmacia.dat_imptarjeta a
  WHERE a.numeroidentidad NOT IN (SELECT vc.numeroidentidad FROM mod_logpuntoventa.dat_ventacliente vc)

  GROUP BY a.numeroidentidad,
  a.nombrepaciente,
  a.direccion,
  a.cmf,
  a.provincia,
  a.municipio,
  a.medicamento,
  a.dosis,
  a.nombremedico,
  a.nroregistro,
  a.policlinico,
  a.hospital,
  a.otrasunidades,
  a.fechaexpedicion,
  a.cmfarchivado,
  a.nofarmacia,
  a.snombrepaciente,
  a.apellidopaciente,
  a.sapellidopaciente,
  a.snombremedico,
  a.apellidomedico,
  a.sapellidomedico
 
LOOP 
 
      FOR v_comprobarpaciente IN --Compruebo si existe el paciente   
        SELECT distinct vc.numeroidentidad
        FROM  mod_logpuntoventa.dat_ventacliente vc
        WHERE vc.numeroidentidad = v_productos.numeroidentidad
      
  LOOP 
  
     IF (v_comprobarpaciente IS NULL) THEN --si no existe el paciente, lo creo
     INSERT INTO mod_logistica.dat_documento
        (     
          iddoc,
          idoperacion,
          idejercicio,
          idestructuracomun,                
          idperiodo,
          estado,
          cronologia,
          idusuario,
          fechacontable,
          anno,
          numeroref,
          idaprobadopor,     
          nrodoc,
          idbloqueousuario                                   
        )
        VALUES (                
          p_iddoc,
          p_idoperacion,
          p_idejercicio,                
          p_idestructura,
          p_idperiodo,
          3,
          p_cronologia,
          p_idusuario,
          p_fechacontable,
          p_anno,
          p_numeroref,
          p_idusuario,
          p_numeroref,
          p_idusuario
        ) RETURNING iddocumento INTO v_idtarjetadocumento;
                  
     INSERT INTO mod_logpuntoventa.dat_ventacliente
        (
          numeroidentidad,
          municipio,
          provincia,
          direccion,
          nombre,
          idprovincia,
          idmunicipio,
          fechainscripcion
        )
        VALUES (
          v_productos.numeroidentidad,
          v_productos.municipio,
          v_productos.provincia,
          v_productos.direccion,
          v_productos.nombrecompletopaciente,
          v_productos.idprovincia,
          v_productos.idmunicipio,
          v_productos.fechaexpedicion
        ) RETURNING idventacliente INTO v_datosventa;
                    
     INSERT INTO mod_logfarmacia.dat_tarjetamedicamento
        ( 
          idtarjetamedicamento,
          consultoriomedico,
          area,
          idpaciente
        )
        VALUES (
          v_idtarjetadocumento,
          v_productos.cmf,
          v_productos.policlinico,
          v_datosventa
        ) RETURNING idtarjetamedicamento INTO v_datostarjeta;  
                    
     INSERT INTO mod_logfarmacia.dat_productotarjetamedicamento
        ( 
          dosis,
          fechaemision,
          nroregistro,
          nombre,
          hospital,
          otrasunidades,
          idtarjetamedicamento,
          idcuadrobasico
        )
        VALUES (
          v_productos.dosis,
          v_productos.fechaexpedicion,
          v_productos.nroregistro,
          v_productos.nombrecompletomedico,
          v_productos.hospital,
          v_productos.otrasunidades,
          v_datostarjeta,
          v_productos.idcuadrobasico
        ) RETURNING idproductotarjetamedicamento INTO v_idtarjetamedicamentoprod;  
                                 
     ELSE  
      
        FOR v_comprobarproducto IN --Compruebo que exista el medicamento
          SELECT pt.idproductotarjetamedicamento, cb.idcuadrobasico, dt.dosis,    
          btrim(concat(dt.nombremedico,' ',dt.snombremedico,' ',dt.apellidomedico,' ',dt.sapellidomedico)) as nombrecompletomedico,
          dt.nroregistro, dt.hospital, dt.otrasunidades, dt.fechaexpedicion
          FROM mod_logfarmacia.conf_cuadrobasico cb
          LEFT JOIN mod_logfarmacia.dat_productotarjetamedicamento pt ON pt.idcuadrobasico = cb.idcuadrobasico
          LEFT join mod_datosmaestros.nom_indicador ni on ni.idindicador = cb.idindicador
          LEFT join mod_logfarmacia.dat_imptarjeta dt on dt.medicamento = ni.numeropieza or dt.medicamento ilike ni.denominacion or dt.medicamento ilike ni.descripcion
          WHERE dt.numeroidentidad = v_productos.numeroidentidad 
           
        LOOP
           
           IF (v_comprobarproducto.idproductotarjetamedicamento IS NULL) THEN -- si no existe el medicamento, lo creo           
           INSERT INTO mod_logfarmacia.dat_productotarjetamedicamento
              ( 
                dosis,
                fechaemision,
                nroregistro,
                nombre,
                hospital,
                otrasunidades,
                idtarjetamedicamento,
                idcuadrobasico
              )
              VALUES (
                v_productos.dosis,
                v_productos.fechaexpedicion,
                v_productos.nroregistro,
                v_productos.nombrecompletomedico,
                v_productos.hospital,
                v_productos.otrasunidades,
                (SELECT dtm.idtarjetamedicamento FROM mod_logfarmacia.dat_tarjetamedicamento dtm           
                INNER JOIN mod_logpuntoventa.dat_ventacliente vc ON vc.idventacliente = dtm.idpaciente
                WHERE vc.numeroidentidad = v_productos.numeroidentidad limit 1),
                v_comprobarproducto.idcuadrobasico
              ) RETURNING idproductotarjetamedicamento INTO v_idproductotarjetamedicamento;
              
           ELSE   --si existe el medicamento, lo actualizo
                    
           UPDATE mod_logfarmacia.dat_productotarjetamedicamento
                SET 
                nroregistro = v_comprobarproducto.nroregistro,
                nombre = v_comprobarproducto.nombrecompletomedico,
                hospital = v_comprobarproducto.hospital,
                otrasunidades = v_comprobarproducto.otrasunidades,
                dosis = v_comprobarproducto.dosis,
                fechaexpiracion = v_comprobarproducto.fechaexpedicion
                WHERE idcuadrobasico = v_comprobarproducto.idcuadrobasico 
                AND idproductotarjetamedicamento = v_comprobarproducto.idproductotarjetamedicamento;
           END IF;
        END LOOP;
     END IF;
  END LOOP;	
END LOOP;	              
RETURN v_result;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_logfarmacia.f_importatarjeta (p_idestructura numeric, p_iddoc numeric, p_idoperacion numeric, p_idejercicio numeric, p_idperiodo numeric, p_cronologia numeric, p_idusuario numeric, p_fechacontable date, p_anno numeric, p_numeroref numeric)
  OWNER TO zeolides;






CREATE OR REPLACE FUNCTION mod_logfarmacia.f_validadataimportatarjeta (
)
RETURNS integer [] AS
$body$
declare
v_result integer[]:=array[0];
v_rec record;
begin

--Para tarjetas duplicadas
select a.numeroidentidad as numeroidentidad, a.medicamento as medicamento into v_rec
from mod_logfarmacia.dat_imptarjeta a
where a.numeroidentidad is not null and a.medicamento is not null
group by a.numeroidentidad, a.medicamento
having count(*) > 1
order by a.numeroidentidad;

if v_rec.numeroidentidad is not null and v_rec.medicamento is not null then v_result:= v_result|| array[3]; end if;


--Código producto nulos
/*select a.codigoproducto, a.almacenamiento into v_rec from mod_datosmaestros.dat_impproducto a where a.codigoproducto is null;

if v_rec.almacenamiento is not null then v_result:= v_result|| array[4]; end if;*/


return v_result;
end
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_logfarmacia.f_validadataimportatarjeta ()
  OWNER TO zeolides;