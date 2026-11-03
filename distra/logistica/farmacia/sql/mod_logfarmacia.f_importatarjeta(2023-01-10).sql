CREATE OR REPLACE FUNCTION mod_logfarmacia.f_importatarjeta (
  idestructura numeric,
  iddoc numeric,
  idoperacion numeric,
  idejercicio numeric,
  idperiodo numeric,
  idcronologia numeric,
  idusuario numeric,
  idcuadrobasico numeric
) 
RETURNS numeric [] AS
$body$
DECLARE
v_productos record;
v_datosventa NUMERIC;
v_datostarjeta NUMERIC;
v_result integer[];

 v_idestructura NUMERIC;
 v_iddocumento_temp NUMERIC;
 v_iddoc NUMERIC;
 v_idoperacion NUMERIC;
 v_idejercicio NUMERIC;
 v_idperiodo NUMERIC;
 v_idcronologia NUMERIC;
 v_idusuario NUMERIC;
 v_idcuadrobasico NUMERIC;

BEGIN
	v_idestructura = $1;
    v_iddoc = $2;
    v_idoperacion = $3;
     v_idejercicio = $4;
     v_idperiodo = $5;
     v_idcronologia = $6;
      v_idusuario = $7;
       v_idcuadrobasico = $8;
    
   

v_result:= v_result || mod_logfarmacia.f_validadataimportatarjeta();
if v_result @> array[3] or v_result @> array[4] then return v_result; end if;

for v_productos in 
select distinct 
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
a.fechaexpedicion

from mod_logfarmacia.dat_imptarjeta a
where a.numeroidentidad not in (select vc.numeroidentidad from mod_logpuntoventa.dat_ventacliente vc
)

group by a.numeroidentidad,
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
a.fechaexpedicion


 LOOP 
          /*--Busco documento
          SELECT d.iddocumento into v_iddocumento_temp
          FROM mod_logistica.dat_documento d
          INNER JOIN mod_logfarmacia.dat_tarjetamedicamento ta on ta.idtarjetamedicamento= d.iddocumento
          WHERE d.iddoc = v_iddoc and d.idoperacion = v_idoperacion 
                  and d.idestructuracomun = v_idestructura;   */
          
            -- Si no esta lo creo
            --IF(v_iddocumento_temp IS NULL) THEN
              INSERT INTO 
                mod_logistica.dat_documento
              (     
                iddoc,
                idoperacion,
                idejercicio,
                idestructuracomun,                
                idperiodo ,
                estado,
                cronologia                             
                
              )
              VALUES (                
                v_iddoc,
                v_idoperacion,
                v_idejercicio,                
                v_idestructura,
                v_idperiodo,
                3,
                v_idcronologia
              ) RETURNING iddocumento into v_iddocumento_temp;
              
             INSERT INTO mod_logpuntoventa.dat_ventacliente
                (
                numeroidentidad,
                municipio,
                provincia,
                direccion,
                nombre,
                idprovincia,
                idmunicipio
                )
                values (
                v_productos.numeroidentidad,
                v_productos.municipio,
                v_productos.provincia,
                v_productos.direccion,
                v_productos.nombrepaciente,
                NULL,
                null

                ) returning idventacliente into v_datosventa;
                
              INSERT INTO mod_logfarmacia.dat_tarjetamedicamento
                ( 
                idtarjetamedicamento,
                consultoriomedico,
                area,
                idpaciente

                )
                values (
                v_iddocumento_temp,
                v_productos.cmf,
                v_productos.policlinico,
                v_datosventa

                ) returning idtarjetamedicamento into v_datostarjeta;  

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
                values (
                v_productos.dosis,
                v_productos.fechaexpedicion,
                v_productos.nroregistro,
                v_productos.nombremedico,
                v_productos.hospital,
                v_productos.otrasunidades,
                v_datostarjeta,
                v_idcuadrobasico
                
                --v_idcuadrobasico_temp
                ) returning idtarjetamedicamento into v_datostarjeta;  
             
           /* ELSE -- Si ya existe la tarjeta le añado los medicamentos   
            
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
                values (
                v_productos.dosis,
                v_productos.fechaexpedicion,
                v_productos.nroregistro,
                v_productos.nombremedico,
                v_productos.hospital,
                v_productos.otrasunidades,
                v_iddocumento_temp,
                null
                );*/
          --  END IF;	

end loop;
return v_result;
end;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;