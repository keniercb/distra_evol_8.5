<?php

class DatEntidadmodelosisplaninversiones extends DatEntidadmodelo
{
    public function servBP_getModeloAsocEntidadesN($identidades, $idejecicio)
    {
        $nivel = NomActividad::getNivel();
        $conn = Doctrine_Manager::connection();
        $sql
            = "SELECT DISTINCT m.idmodelo,  m.denominacion
FROM mod_planificacion.dat_modelo m
     INNER JOIN mod_planificacion.dat_actividadmodelo am 
     ON (m.idmodelo = am.idmodelo)
     LEFT JOIN mod_datosmaestros.dat_indicadormodelo im 
     ON (m.idmodelo =  im.idmodelo)
     INNER JOIN mod_planificacion.nom_actividad a 
     ON (am.idactividad = a.idactividad)
     INNER JOIN mod_planificacion.dat_actividadentidad ae 
     ON (ae.idactividad = a.idactividad)
     LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem 
     ON  ae.idactividadentidad = aem.idactividadentidad
     LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee 
     ON (aee.idactividadentidad = ae.idactividadentidad)
     LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea 
     ON ae.idactividadentidad = aea.idactividadentidad
     LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep 
     ON ae.idactividadentidad = aep.idactividadentidad
     LEFT JOIN mod_planifinversiones.dat_inversnivelactividaddesglose aei
     ON (aei.idactividadentidad = ae.idactividadentidad AND aei.idejercicio = $idejecicio)
     WHERE ae.identidad IN ($identidades) AND
           ae.idejercicio = $idejecicio AND
      a.nivel = {$nivel} AND
      a.idaprobacion = 4 AND
      a.estado = 1 AND
      (ae.idaprobacion = 5 OR
      ae.idaprobacion = 4)
      GROUP BY  m.idmodelo, m.denominacion,aem.nivelactividadmanual,aea.nivelactividadautomatico,aep.nivelactividadproduccion, aee.nivelactividadelemento
      HAVING   
      (COALESCE(aem.nivelactividadmanual, 0) + 
      COALESCE(aea.nivelactividadautomatico, 0) + 
      COALESCE(aep.nivelactividadproduccion, 0) +  
      COALESCE(aee.nivelactividadelemento, 0) + 
      COALESCE(SUM(aei.plan), 0)) > 0";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
}
