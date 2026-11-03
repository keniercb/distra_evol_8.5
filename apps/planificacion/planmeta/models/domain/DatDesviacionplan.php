<?php

class DatDesviacionplan extends BaseDatDesviacionplan {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'DatEntidadmodelo', array('local' => 'identidadmodelo', 'foreign' => 'identidadmodelo')
        );
        $this->hasOne(
                'NomEjercicioplanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
        $this->hasMany(
                'DatDesviacionplanxsustitucion', array('local' => 'iddesviacionplan',
            'foreign' => 'iddesviacionplan')
        );
    }

    //Lista la desviación de la ejecución dado un idplanificación
    public function listarDesvPlan($parametros, $offsetLimit, $WHERE) {
        $arridplanif = implode(',', $parametros['idplanificacion']);

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT dp.idindicador,dp.iddesviacionplan,
       ind.codigo,
       ind.denominacion,
       ind.idumedida,
       cantidadreal,
       fechareal
FROM mod_planificacion.dat_desviacionplan dp
     INNER JOIN mod_planificacion.dat_desviacionplanxsustitucion dps ON
      dp.iddesviacionplan = dps.iddesviacionplan
     INNER JOIN mod_datosmaestros.nom_indicador ind ON dp.idindicador =
      ind.idindicador
WHERE dps.idplanificacion = " . "'" . "{" . $arridplanif . "}" . "'" . " AND dp.idejercicio={$parametros['idejercicio']}
  $WHERE
      $offsetLimit";


        $sqlT = "SELECT COUNT (dp.iddesviacionplan)
FROM mod_planificacion.dat_desviacionplan dp
     INNER JOIN mod_planificacion.dat_desviacionplanxsustitucion dps ON
      dp.iddesviacionplan = dps.iddesviacionplan
     INNER JOIN mod_datosmaestros.nom_indicador ind ON dp.idindicador =
      ind.idindicador
WHERE dps.idplanificacion = " . "'" . "{" . $arridplanif . "}" . "'" . " AND dp.idejercicio={$parametros['idejercicio']}
   $WHERE";

        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $conn->execute($sqlT)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total [0]['count'];
        return $data;
    }

    //Lista las desviaciones por adicion que significa que son indicadores que no estaban en el plan
    public function listarDesvAdicionesPlan($parametros, $offsetLimit, $WHERE) {
        $entidadmodelo = DatEntidadmodelo::getIdentidadmodelo(
                        $parametros['idmodelo'], $parametros['identidad']
        );
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT dp.idindicador,dp.iddesviacionplan,
       ind.codigo,
       ind.denominacion,
       ind.idumedida,
       cantidadreal,
       fechareal
FROM mod_planificacion.dat_desviacionplan dp
     INNER JOIN mod_datosmaestros.nom_indicador ind ON dp.idindicador =
      ind.idindicador
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON dp.identidadmodelo =
      em.identidadmodelo
       LEFT JOIN mod_planificacion.dat_desviacionplanxsustitucion s ON
        dp.iddesviacionplan = s.iddesviacionplan
WHERE dp.identidadmodelo={$entidadmodelo[0]['identidadmodelo']} AND
s.iddesviacionplan is null
AND dp.idejercicio={$parametros['idejercicio']}
   $WHERE
   $offsetLimit";
        $sqlT = "SELECT count(dp.idindicador)
FROM mod_planificacion.dat_desviacionplan dp
     INNER JOIN mod_datosmaestros.nom_indicador ind ON dp.idindicador =
      ind.idindicador
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON dp.identidadmodelo =
      em.identidadmodelo
       LEFT JOIN mod_planificacion.dat_desviacionplanxsustitucion s ON
        dp.iddesviacionplan = s.iddesviacionplan
WHERE dp.identidadmodelo={$entidadmodelo[0]['identidadmodelo']}AND
s.iddesviacionplan is null AND dp.idejercicio={$parametros['idejercicio']}
   $WHERE
   $offsetLimit";

        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $conn->execute($sqlT)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total [0]['count'];
        return $data;
    }

    //Lista los indicadores para adicionar una desviación
    public function listarIndAddDesviacion($parametros, $WHERE, $offsetLimit) {
        if ($parametros['idindicadores'][0] != null) {
            $indicadores = $ent = implode(',', $parametros['idindicadores']);
            $NotIn = "AND i.idindicador NOT IN ($indicadores)";
        } else {
            $NotIn = "";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT i.idindicador,
       codigo,
       denominacion,
       idumedida
FROM mod_datosmaestros.nom_indicador i
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON (i.idindicador =
      ip.idindicador)
WHERE i.estado = 1 AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 --AND
      --ip.precio > 0
      $NotIn $WHERE $offsetLimit";
        $sqlT = "SELECT count(i.idindicador) as total
FROM mod_datosmaestros.nom_indicador i
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON (i.idindicador =
      ip.idindicador)
WHERE i.estado = 1 AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 --AND
      --ip.precio > 0
                $NotIn $WHERE ";

        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $conn->execute($sqlT)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total [0]['total'];
        return $data;
    }

    //Lista los indicadores para adicionar una desviacion por adicion
    public function listarIndAddDesviacionAdicion($parametros, $WHERE, $offsetLimit
    ) {
        if ($parametros['idindicadores'][0] != null) {
            $indicadores = $ent = implode(',', $parametros['idindicadores']);
            $NotIn = "AND i.idindicador NOT IN ($indicadores)";
        } else {
            $NotIn = "";
        }


        $entidadmodelo = DatEntidadmodelo::getIdentidadmodelo(
                        $parametros['idmodelo'], $parametros['identidad']
        );

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT i.idindicador,
       codigo,
       denominacion,
       idumedida
FROM mod_datosmaestros.nom_indicador i
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON (i.idindicador =
      ip.idindicador)
      LEFT JOIN mod_planificacion.dat_planificacion p  ON (p.idindicador=i.idindicador AND
      p.identidadmodelo = {$entidadmodelo[0]['identidadmodelo']} AND
      p.idejercicio={$parametros['idejercicio']})
WHERE i.estado = 1 AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 --AND
      --ip.precio > 0
      $NotIn
      $WHERE
      $offsetLimit";

        $sqlT = "SELECT count(i.idindicador) as total
FROM mod_datosmaestros.nom_indicador i
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON (i.idindicador =
      ip.idindicador)
      LEFT JOIN mod_planificacion.dat_planificacion p  ON (p.idindicador=i.idindicador AND
      p.identidadmodelo = {$entidadmodelo[0]['identidadmodelo']} AND
      p.idejercicio={$parametros['idejercicio']})
WHERE i.estado = 1 AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 --AND
     -- ip.precio > 0
      $NotIn
      $WHERE ";

        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $conn->execute($sqlT)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total [0]['total'];
        return $data;
    }

    //Inserta la desviación de la ejecución dado un idplanificación
    public function insertarDesvPlan($params) {
        if ($params['eliminar'][0] != null) {
            $elim = implode(',', $params['eliminar']);
            $conn = Doctrine_Manager::connection();
            $sql = "DELETE FROM mod_planificacion.dat_desviacionplan cep
                WHERE cep.iddesviacionplan IN ($elim)";

            $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $entidadmodelo = DatEntidadmodelo::getIdentidadmodelo(
                            $params['idmodelo'], $params['identidad']
            );
            $iddesviacion = "";
            foreach ($params['ejec'] as $ejec) {
                if ($ejec->idplanificacion[0] != null || $ejec->iddesviacionplan == null
                ) {
                    //insertar
                    $objEjecPlan = new DatDesviacionplan();
                    $objEjecPlan->cantidadreal = $ejec->cantidadreal;
                    $objEjecPlan->fechareal = $ejec->fecha;
                    $objEjecPlan->identidadmodelo = $entidadmodelo[0]['identidadmodelo'];
                    $objEjecPlan->idejercicio = $params['idejercicio'];
                    $objEjecPlan->idindicador = $ejec->idindicador;
                    $objEjecPlan->idusuario = $params['idusuario'];
                    $objEjecPlan->save();
                    $iddesviacion = $objEjecPlan->iddesviacionplan;
                } else {
                    $objeto = Doctrine::getTable('DatDesviacionPlan')->find(
                            $ejec->iddesviacionplan
                    );
                    //modificar
                    $objeto->cantidadreal = $ejec->cantidadreal;
                    $objeto->fechareal = $ejec->fecha;
                    $objeto->save();
                }
            }
        }
        if ($iddesviacion != "") {
            return $iddesviacion;
        } else {
            return true;
        }
    }

    //Inserta la desviación por adicion
    public function insertarDesvPlanPorSust($params) {
        foreach ($params['ejec'] as $ejec) {
            $idsplanificacion = [];
            $idsplanificacion = implode(',', $ejec->idplanificacion);
            if ($ejec->idplanificacion != null) {
                $objEjecPlan = new DatDesviacionplanxsustitucion();
                $objEjecPlan->iddesviacionplan = $params['iddesviacionplan'];
                $objEjecPlan->idplanificacion = "{" . $idsplanificacion . "}";
                $objEjecPlan->save();
            }
        }
        return true;
    }

}
