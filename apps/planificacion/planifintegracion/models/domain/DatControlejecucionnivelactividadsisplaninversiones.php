<?php

class DatControlejecucionnivelactividadsisplaninversiones extends DatControlejecucionnivelactividad
{

    //Lista los niveles de actividad mayores que cero dada una entidad y un ejercicio
    public function listarNivelesAct($params, $strEspecialidades, $strEntidades, $WHERE, $offsetLimit, $Having
    )
    {
        $nivel = NomActividad::getNivel();
        $conn = Doctrine_Manager::connection();
        $sql = "
  SELECT count(*) OVER() as total,
  x.idactividad as idactividad,
         x.codigo,
         x.denominacion,
         SUM(x.nivelactividadfinal) as nivelactividadfinal,
         SUM(x.nivelactvreal) as nivelactvreal,
         COALESCE((SUM(x.nivelactividadfinal) - COALESCE(SUM(x.nivelactvreal),0)),0) as pendiente
         FROM
                (WITH valioso AS (
SELECT
   COALESCE(sum(nivelactividadreal),0) as nivelactvreal,
   idactividadentidad
FROM
  mod_planificacion.dat_controlejecucionnivelactividad

GROUP BY idactividadentidad)
SELECT
a.idactividad as idactividad,
a.codigo,
a.denominacion,

(COALESCE(aem.nivelactividadmanual,0)+
COALESCE(aea.nivelactividadautomatico,0) +
COALESCE(aep.nivelactividadproduccion,0) +
COALESCE(aee.nivelactividadelemento, 0)+
COALESCE(ae.ajuste,0) +  COALESCE(SUM(aei.plan), 0)
) as nivelactividadfinal,

COALESCE (v.nivelactvreal,0) as nivelactvreal

FROM mod_planificacion.nom_actividad a
INNER JOIN mod_planificacion.dat_actespcomportamiento aec
ON (a.idactividad = aec.idactividad AND aec.idespecialidad IN({$strEspecialidades}))
INNER JOIN mod_planificacion.dat_actividadentidad ae
ON (ae.idactespcomportamiento = aec.idactespcomportamiento
AND (ae.idejercicio =  {$params['idejercicio']} or ae.idejercicio is null)
AND (ae.identidad IN ({$strEntidades}) or ae.identidad is null) )
LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
ON(aem.idactividadentidad = ae.idactividadentidad)
LEFT JOIN mod_planifintegracion.dat_elementonivelactividad aee 
ON (aee.idactividadentidad = ae.idactividadentidad)
LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
ON(aea.idactividadentidad = ae.idactividadentidad)
LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
ON( aep.idactividadentidad = ae.idactividadentidad)
 LEFT JOIN mod_planifinversiones.dat_inversnivelactividaddesglose aei
              ON (aei.idactividadentidad = ae.idactividadentidad AND
              aei.idejercicio = {$params['idejercicio']})
LEFT JOIN valioso v ON (ae.idactividadentidad=v.idactividadentidad)

            WHERE a.nivel={$nivel} AND a.idaprobacion =4 AND a.estado=1
            " . $WHERE . "
            GROUP BY
                a.idactividad,
                a.codigo,
                a.denominacion,
                aea.nivelactividadautomatico,
                aem.nivelactividadmanual,
                aee.nivelactividadelemento,
                aep.nivelactividadproduccion,
                ae.ajuste,
                aec.idactespcomportamiento,
                v.nivelactvreal
                ORDER BY a.codigo) as x
                GROUP BY
                x.idactividad,
                x.codigo,
                x.denominacion
                Having  SUM(x.nivelactividadfinal)>0
                " . $Having . "
		ORDER BY x.codigo
      $offsetLimit";
        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];

        return $data;
    }

}
