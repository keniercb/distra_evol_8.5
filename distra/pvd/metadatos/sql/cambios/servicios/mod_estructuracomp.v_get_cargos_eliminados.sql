-- View: mod_estructuracomp.v_get_cargos

-- DROP VIEW mod_estructuracomp.v_get_cargos;

CREATE OR REPLACE VIEW mod_estructuracomp.v_get_cargos_eliminados AS
 SELECT nfe.idfila AS idcargo,
    nfe.idconcepto,
    nc.denominacion,
    dc.cantidad,
    dc.cantidadreal
   FROM mod_estructuracomp.nom_filaestruc nfe
     JOIN mod_estructuracomp.nom_concepto nomeav ON nfe.idconcepto = nomeav.idconcepto
     JOIN mod_estructuracomp.dat_cargo dc ON nfe.idfila = dc.idcargo AND dc.idproyecto = 0::numeric
     JOIN mod_estructuracomp.nom_cargo nc ON nc.idnomcargo = dc.idnomcargo
  WHERE nfe.fechafin IS NOT NULL OR nc.fechafin IS NOT NULL;

ALTER TABLE mod_estructuracomp.v_get_cargos_eliminados
    OWNER TO zeolides;

