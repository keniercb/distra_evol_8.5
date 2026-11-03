<?php

class DatNivelactividadporfecha extends BaseDatNivelactividadporfecha {

    public function setUp() {
        parent::setUp();
    }

    public function listarNivelesAct($params, $strEspecialidades, $strEntidades, $WHERE, $offsetLimit, $Having
    ) {
        $nivel = NomActividad::getNivel();
        $conn = Doctrine_Manager::connection();
        $sql = "  SELECT count(*) OVER() as total,
                x.idactividad as idactividad,
         x.codigo,
         x.denominacion,
         SUM(x.nivelactividadfinal) as nivelactividad,
         SUM(x.nivelactividadxfecha) as nivelactividadreal,
         COALESCE((SUM(x.nivelactividadfinal) - COALESCE(SUM(
           x.nivelactividadxfecha), 0)), 0) as nivelactividadpordesglozar
  FROM (WITH valioso AS (
                          SELECT COALESCE(sum(nivelactividad), 0) as
                            nivelactividad,
                                 idactividadentidad
                          FROM mod_planificacion.dat_nivelactividadporfecha
                          GROUP BY idactividadentidad
       )
  SELECT a.idactividad as idactividad, a.codigo, a.denominacion, (COALESCE(
    aem.nivelactividadmanual, 0) + COALESCE(aea.nivelactividadautomatico, 0) +
    COALESCE(aep.nivelactividadproduccion, 0) + COALESCE(ae.ajuste, 0)) as
    nivelactividadfinal, COALESCE(v.nivelactividad, 0) as nivelactividadxfecha
  FROM mod_planificacion.nom_actividad a
       INNER JOIN mod_planificacion.dat_actespcomportamiento aec ON (
         a.idactividad = aec.idactividad AND aec.idespecialidad IN (
         {$strEspecialidades}))
       INNER JOIN mod_planificacion.dat_actividadentidad ae ON (
         ae.idactespcomportamiento = aec.idactespcomportamiento AND (
         ae.idejercicio = {$params['idejercicio']} or ae.idejercicio is null) AND (ae.identidad IN (
         {$strEntidades}) or ae.identidad is null))
       LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem ON (
         aem.idactividadentidad = ae.idactividadentidad)
       LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea ON (
         aea.idactividadentidad = ae.idactividadentidad)
       LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep ON (
         aep.idactividadentidad = ae.idactividadentidad)
       LEFT JOIN valioso v ON (ae.idactividadentidad = v.idactividadentidad)
  WHERE a.nivel = {$nivel} AND
        a.idaprobacion = 4 AND
        a.estado = 1
          " . $WHERE . "
  GROUP BY a.idactividad, a.codigo, a.denominacion,
    aea.nivelactividadautomatico, aem.nivelactividadmanual,
    aep.nivelactividadproduccion, ae.ajuste, v.nivelactividad
  ORDER BY a.codigo) as x
  GROUP BY x.idactividad,
           x.codigo,
           x.denominacion
  Having SUM(x.nivelactividadfinal) > 0
   " . $Having . "
  ORDER BY x.codigo 
  $offsetLimit";
        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];
        return $data;
    }

    //Utilizado como servicio
    public function servicioObtenerActividadesPorFecha($identidad, $fechaInicio, $fechaFin) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
  naf.fechainicio as start_date,
  naf.fechafin as end_date,
  --'' as parent,
  --rank() OVER (ORDER BY naf.idnivelactividadporfecha ASC) as id,
  a.idactividad as idelemento,
  a.denominacion as text,
  0 as progress,
  1 as open,  
  11 as idtipoelemento,
  0 as actualizarporciento,
  0 as modificar,
  0 as eliminar,
  naf.nivelactividad as nivel
  
FROM mod_planificacion.dat_nivelactividadporfecha naf
INNER JOIN mod_planificacion.dat_actividadentidad ae ON(naf.idactividadentidad= ae.idactividadentidad)
INNER JOIN mod_planificacion.nom_actividad a ON(ae.idactividad= a.idactividad)
where ae.identidad IN($identidad)
AND naf.fechainicio <= $fechaFin
AND naf.fechafin >= $fechaInicio";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}
