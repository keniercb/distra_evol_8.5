<?php

class DatControlejecucionnivelactividad extends BaseDatControlejecucionnivelactividad {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'DatActividadentidad', array('local' => 'idactividadentidad',
            'foreign' => 'idactividadentidad')
        );
    }

    //Lista los niveles de actividad mayores que cero dada una entidad y un ejercicio
    public function listarNivelesAct($params, $strEspecialidades, $strEntidades, $WHERE, $offsetLimit, $Having
    ) {
        $nivel = NomActividad::getNivel();
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT  count(*) OVER() as total,
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
              COALESCE(ae.ajuste,0) ) as nivelactividadfinal,
                     COALESCE (v.nivelactvreal,0) as nivelactvreal

                          FROM mod_planificacion.nom_actividad a

                          INNER JOIN mod_planificacion.dat_actespcomportamiento aec
                              ON (a.idactividad = aec.idactividad AND aec.idespecialidad IN
                              ({$strEspecialidades}))
                          INNER JOIN mod_planificacion.dat_actividadentidad ae
                              ON (ae.idactespcomportamiento = aec.idactespcomportamiento
                    AND (ae.idejercicio =  {$params['idejercicio']} or ae.idejercicio is null)
                           AND (ae.identidad IN ({$strEntidades}) or ae.identidad is null) )

                          LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
                              ON(aem.idactividadentidad = ae.idactividadentidad)

                          LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
                              ON(aea.idactividadentidad = ae.idactividadentidad)

                          LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
                              ON( aep.idactividadentidad = ae.idactividadentidad)
                              LEFT JOIN valioso v ON (ae.idactividadentidad=v.idactividadentidad)

                          WHERE a.nivel={$nivel} AND a.idaprobacion =4 AND a.estado=1
                          " . $WHERE . "
                          GROUP BY
                              a.idactividad,
                              a.codigo,
                              a.denominacion,
                              aea.nivelactividadautomatico,
                              aem.nivelactividadmanual,
                              aep.nivelactividadproduccion,
                              ae.ajuste,
                              v.nivelactvreal
                              ORDER BY a.codigo) as x
                              GROUP BY
                              x.idactividad,
                              x.codigo,
                              x.denominacion
                              Having  SUM(x.nivelactividadfinal)>0
                              " . $Having . "
                              ORDER BY x.codigo  $offsetLimit";


        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];

        return $data;
    }

    //Lista la cantidad real de la ejecución dado un idactividadentidad
    public function listarEjecucionNiveles($parametros, $offsetLimit, $WHERE) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                  idcontrolejecucionnivelactividad,
                  nivelactividadreal,
                  fechareal,
                  idactividadentidad,
                  idusuario
                FROM
                  mod_planificacion.dat_controlejecucionnivelactividad
                  where idactividadentidad={$parametros['idactividadentidad']}
                  $WHERE
                      $offsetLimit";
        $sqlT = "SELECT COUNT (idcontrolejecucionnivelactividad)
                FROM
                  mod_planificacion.dat_controlejecucionnivelactividad
                  where idactividadentidad={$parametros['idactividadentidad']}
                  $WHERE";

        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $conn->execute($sqlT)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total [0]['count'];
        return $data;
    }

    //Inserta la cantidad real de la ejecución dado un idactividadentidad
    public function insertarEjecNiv($params) {
        if ($params['eliminar'][0] != null) {
            $actv = implode(',', $params['eliminar']);
            //eliminar
            $conn = Doctrine_Manager::connection();
            $sql = "DELETE FROM mod_planificacion.dat_controlejecucionnivelactividad cep
                WHERE cep.idcontrolejecucionnivelactividad IN ($actv)";
            $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        } else {
            foreach ($params['ejec'] as $ejec) {

                if ($ejec->idcontrolejecucionnivel == null
                ) {
                    $objEjecNiv = new DatControlejecucionnivelactividad();
                    $objEjecNiv->nivelactividadreal = $ejec->nivelactividadreal;
                    $objEjecNiv->fechareal = $ejec->fecha;
                    $objEjecNiv->idactividadentidad = $params['idactividadentidad'];
                    $objEjecNiv->idusuario = $params['idusuario'];
                    $objEjecNiv->save();
                } else {
                    $objeto = Doctrine::getTable(
                                    'DatControlejecucionnivelactividad'
                            )->find(
                            $ejec->idcontrolejecucionnivel
                    );
                    //modificar
                    $objeto->nivelactividadreal = $ejec->nivelactividadreal;
                    $objeto->fechareal = $ejec->fecha;
                    $objeto->save();
                }
            }
        }
        return true;
    }

}
