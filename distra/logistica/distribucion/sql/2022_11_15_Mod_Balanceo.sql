CREATE VIEW mod_estructuracomp.v_dametodasestructuras (
    idestructura,
    codigo,
    denominacion,
    abreviatura,
    idconcepto,
    idorgano,
    direccion,
    codigonit,
    correo,
    fax,
    telefono)
AS
SELECT fila.idfila AS idestructura,
        CASE
            WHEN estructura.codigo::text <> ''::text THEN estructura.codigo
            WHEN estructuraop.codigo::text <> ''::text THEN estructuraop.codigo
            ELSE NULL::character varying(20)
        END AS codigo,
        CASE
            WHEN estructura.denominacion::text <> ''::text THEN estructura.denominacion
            WHEN estructuraop.denominacion::text <> ''::text THEN estructuraop.denominacion
            ELSE NULL::character varying
        END AS denominacion,
        CASE
            WHEN estructura.abreviatura::text <> ''::text THEN estructura.abreviatura
            WHEN estructuraop.abreviatura::text <> ''::text THEN estructuraop.abreviatura
            ELSE NULL::character varying
        END AS abreviatura,
        CASE
            WHEN estructura.idconcepto IS NOT NULL THEN estructura.idconcepto
            WHEN estructuraop.idconcepto IS NOT NULL THEN estructuraop.idconcepto
            ELSE NULL::numeric
        END AS idconcepto,
        CASE
            WHEN estructura.idorgano IS NOT NULL THEN estructura.idorgano
            WHEN estructuraop.idorgano IS NOT NULL THEN estructuraop.idorgano
            ELSE NULL::numeric
        END AS idorgano,
        CASE
            WHEN estructura.direccion::text <> ''::text THEN estructura.direccion
            WHEN estructuraop.direccion::text <> ''::text THEN estructuraop.direccion
            ELSE NULL::character varying
        END AS direccion,
        CASE
            WHEN estructura.codigonit::text <> ''::text THEN estructura.codigonit
            WHEN estructuraop.codigonit::text <> ''::text THEN estructuraop.codigonit
            ELSE NULL::character varying
        END AS codigonit,
        CASE
            WHEN estructura.correo::text <> ''::text THEN estructura.correo
            WHEN estructuraop.correo::text <> ''::text THEN estructuraop.correo
            ELSE NULL::character varying
        END AS correo,
        CASE
            WHEN estructura.fax::text <> ''::text THEN estructura.fax
            WHEN estructuraop.fax::text <> ''::text THEN estructuraop.fax
            ELSE NULL::character varying
        END AS fax,
        CASE
            WHEN estructura.telefono::text <> ''::text THEN estructura.telefono
            WHEN estructuraop.telefono::text <> ''::text THEN estructuraop.telefono
            ELSE NULL::character varying
        END AS telefono
FROM mod_estructuracomp.nom_filaestruc fila
     JOIN mod_estructuracomp.nom_concepto nomeav ON fila.idconcepto = nomeav.idconcepto
     LEFT JOIN mod_estructuracomp.dat_estructura estructura ON estructura.idestructura = fila.idfila AND (estructura.idestado = 0::numeric OR
         estructura.idproyecto = 0::numeric)
     LEFT JOIN mod_estructuracomp.nom_organo orgest ON orgest.idorgano = estructura.idorgano AND orgest.idconcepto = fila.idconcepto
     LEFT JOIN mod_estructuracomp.dat_estructuraop estructuraop ON estructuraop.idestructuraop = fila.idfila AND (estructuraop.idestado = 0::numeric
         OR estructuraop.idproyecto = 0::numeric)
     LEFT JOIN mod_estructuracomp.nom_organo orgestop ON orgestop.idorgano = estructuraop.idorgano AND orgestop.idconcepto = fila.idconcepto
WHERE fila.fechafin IS NULL AND (estructura.denominacion::text <> ''::text OR estructuraop.denominacion::text <> ''::text)
ORDER BY fila.ordenunico;

ALTER VIEW mod_estructuracomp.v_dametodasestructuras
  OWNER TO zeolides;