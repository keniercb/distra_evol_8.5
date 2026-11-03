-- View: mod_estructuracomp.v_get_positions
-- DROP VIEW mod_estructuracomp.v_get_positions;
CREATE OR REPLACE VIEW mod_estructuracomp.v_get_positions
 AS
 SELECT nfe.idfila AS idcargo,
    nfe.idconcepto,
    nc.denominacion,
    nfe.ordenunico
   FROM mod_estructuracomp.nom_filaestruc nfe
     JOIN mod_estructuracomp.nom_concepto nomeav ON nfe.idconcepto = nomeav.idconcepto
     JOIN mod_estructuracomp.dat_cargo dc ON nfe.idfila = dc.idcargo AND dc.idproyecto = 0::numeric
     JOIN mod_estructuracomp.nom_cargo nc ON nc.idnomcargo = dc.idnomcargo
  WHERE nfe.fechafin IS NULL AND nc.fechafin IS NULL;

ALTER TABLE mod_estructuracomp.v_get_positions OWNER TO zeolides;
