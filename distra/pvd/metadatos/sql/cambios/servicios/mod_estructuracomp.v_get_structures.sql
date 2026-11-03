-- View: mod_estructuracomp.v_get_structures
-- DROP VIEW mod_estructuracomp.v_get_structures;
CREATE OR REPLACE VIEW mod_estructuracomp.v_get_structures
 AS
 SELECT fila.idfila AS idestructura,
        CASE
            WHEN estructura.denominacion::text <> ''::text THEN estructura.denominacion
            WHEN estructuraop.denominacion::text <> ''::text THEN estructuraop.denominacion
            ELSE NULL::character varying
        END AS denominacion,
    fila.ordenunico,
    fila.idpadre,
    estructuraop.idorgano,
    estructuraop.idconcepto
   FROM mod_estructuracomp.nom_filaestruc fila
     JOIN mod_estructuracomp.nom_concepto nomeav ON fila.idconcepto = nomeav.idconcepto
     LEFT JOIN mod_estructuracomp.dat_estructura estructura ON estructura.idestructura = fila.idfila AND (estructura.idestado = 0::numeric OR estructura.idproyecto = 0::numeric)
     LEFT JOIN mod_estructuracomp.nom_organo orgest ON orgest.idorgano = estructura.idorgano AND orgest.idconcepto = fila.idconcepto
     LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop ON estructuraop.idestructuraop = fila.idfila AND (estructuraop.idestado = 0::numeric OR estructuraop.idproyecto = 0::numeric)
     LEFT JOIN mod_estructuracomp.nom_organo orgestop ON orgestop.idorgano = estructuraop.idorgano AND orgestop.idconcepto = fila.idconcepto
  WHERE fila.fechafin IS NULL AND (estructura.denominacion::text <> ''::text OR estructuraop.denominacion::text <> ''::text);

ALTER TABLE mod_estructuracomp.v_get_structures OWNER TO zeolides;
