CREATE OR REPLACE FUNCTION  mod_datosmaestros.f_codigodelasoperaciones (
  p_idestructuracomun numeric
    )
    RETURNS TABLE (
     idnomoperaciones numeric, 
     denominacion character varying,
     codigooperacion character varying,
     idsubsistema  numeric
    
     
    ) AS
    $body$
    begin
    return query (select 
               o.idnomoperaciones,
               o.denominacion,
               o.codigooperacion,
               es.idsubsistema
              from mod_datosmaestros.nom_operacion  o
              join mod_datosmaestros.dat_operacionesentidad  oe on o.idnomoperaciones = oe.idnomoperaciones
              join mod_datosmaestros.dat_estructurasubsist es on oe.idestructuracomun = es.idestructuracomun
              join mod_datosmaestros.dat_documentoprim dp on es.idestructurasubsist = dp.idestructurasubsist 
              where dp.sigla = 'ajusteLog' AND o.idsubsistema = 10 and oe.idestructuracomun = 200531041
              order by o.codigooperacion --and o.codigooperacion is not NULL
     );
    end;
    $body$
    LANGUAGE 'plpgsql'
    VOLATILE
    CALLED ON NULL INPUT
    SECURITY INVOKER
    PARALLEL UNSAFE
    COST 100 ROWS 1000;

    ALTER FUNCTION mod_datosmaestros.f_codigodelasoperaciones (numeric)
    OWNER TO zeolides;