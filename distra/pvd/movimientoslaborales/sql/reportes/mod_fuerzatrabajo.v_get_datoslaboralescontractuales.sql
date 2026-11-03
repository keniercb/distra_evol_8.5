-- View: mod_fuerzatrabajo.v_get_datoslaboralescontractuales
DROP VIEW mod_fuerzatrabajo.v_get_datoslaboralescontractuales;

CREATE OR REPLACE VIEW mod_fuerzatrabajo.v_get_datoslaboralescontractuales
 AS
 SELECT p.idpersona AS identificador,
    d.numero AS documento_identidad,
    initcap(p.nombre::text) AS primer_nombre,
    initcap(p.snombre::text) AS segundo_nombre,
    initcap(p.papel::text) AS primer_apellido,
    initcap(p.sapel::text) AS segundo_apellido,
    initcap(replace(concat(btrim(p.nombre::text), ' ', btrim(p.snombre::text), ' ', btrim(p.papel::text), ' ', btrim(p.sapel::text)), '  '::text, ' '::text)) AS nombre_completo,
    pe.fdesde AS fecha_alta_entidad,
    vgs_e.denominacion AS entidad,
        CASE
            WHEN vgs_ub.idconcepto = 6::numeric AND vgs_ub.denominacion::text ~~* 'UEB SEDE CENTRAL'::text THEN vgs_a.denominacion
            ELSE vgs_ub.denominacion
        END AS unidad_basica,
    vgs_a.denominacion AS area,
    vgp_c.idcargo,
    vgp_c.denominacion AS cargo,
    ntc.denominacion AS tipo_de_contrato,
    ns.denominacion AS situacion_laboral
   FROM mod_persona.dat_persona p
     JOIN mod_persona.dat_docidentidad d ON p.idpersona = d.idpersona AND d.principal = 1::numeric
     JOIN mod_persona.dat_personaentidad pe ON p.idpersona = pe.idpersona
     JOIN mod_persona.dat_situacionlaboral sl USING (idpersonaentidad)
     JOIN mod_fuerzatrabajo.nom_tipocontrato ntc ON ntc.idtipocontrato = sl.idtipocontrato
     JOIN mod_persona.nom_situacion ns ON sl.idsituacion = ns.idsituacion
     JOIN mod_estructuracomp.v_get_structures vgs_e ON vgs_e.idestructura = pe.identidad
     JOIN mod_estructuracomp.v_get_positions vgp_c ON vgp_c.idcargo = sl.idcargo
     LEFT JOIN mod_estructuracomp.v_get_structures vgs_a ON vgs_a.idestructura = sl.idarea
     LEFT JOIN mod_estructuracomp.v_get_structures vgs_ub ON vgs_ub.idestructura = vgs_a.idpadre
  WHERE (p.feliminado IS NULL OR p.feliminado::date > now()::date) AND (pe.fhasta IS NULL OR pe.fhasta > now()::date) AND (sl.fhasta IS NULL OR sl.fhasta > now()::date) AND sl.estado = 0::numeric
  ORDER BY vgp_c.ordenunico;

ALTER TABLE mod_fuerzatrabajo.v_get_datoslaboralescontractuales OWNER TO zeolides;
