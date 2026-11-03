<?php

class DatDesviacionplanDemanda extends BaseDatDesviacionplandemanda {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'DatEntidadmodelo', array('local' => 'identidadmodelo', 'foreign' => 'identidadmodelo')
        );
        $this->hasOne(
                'NomEjercicioplanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
        $this->hasMany(
                'DatDesviacionplanxsustituciondemanda', array('local' => 'iddesviacionplandemanda',
            'foreign' => 'iddesviacionplandemanda')
        );
    }

    //Lista la desviación de la ejecución dado un idplanificación
    public function listarDesvPlan($parametros, $offsetLimit, $WHERE) {
        $arridplanif = implode(',', $parametros['idplanificacion']);


        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT dp.idindicador,dp.iddesviacionplandemanda,
       ind.codigo,
       ind.denominacion,
       ind.idumedida,
       ind.numeropieza,
       cont.idcontrataciondemanda,
       dc.idcontrolejecdesviacion,
       dps.idplanificacion,
       SUM(cantidadreal)as cantreal,
           COALESCE(cont.cantidadcontratada,0)as cantcontratada,
       COALESCE(cont.preciocontratado,0) as preciocontratado,
       COALESCE(cont.cantidadcontratada,0)*COALESCE(cont.preciocontratado,0) as importecontratado,
        ((COALESCE(cont.cantidadcontratada,0))-  SUM(cantidadreal) ) as pendiente,
         CASE WHEN COALESCE(cont.cantidadcontratada,0)<>0
       THEN
       round(((COALESCE (sum(COALESCE (cantidadreal,0)),0)*100)/(COALESCE(cont.cantidadcontratada,0))),1)
       ELSE 0
        END as pejecutado
FROM mod_planificacion.dat_desviacionplandemanda dp
     INNER JOIN mod_planificacion.dat_desviacionplanxsustituciondemanda dps ON
      dp.iddesviacionplandemanda = dps.iddesviacionplandemanda
     LEFT JOIN mod_planificacion.dat_controlejecdesviacion dc on (dp.iddesviacionplandemanda=dc.iddesviacionplandemanda)
     INNER JOIN mod_datosmaestros.nom_indicador ind ON dp.idindicador =
      ind.idindicador
      INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON indp.idindicador =ind.idindicador
        LEFT JOIN mod_planificacion.dat_contrataciondemanda cont ON ind.idindicador=cont.idindicador
WHERE /*dps.idplanificacion = '{}' AND */dp.idejercicio={$parametros['idejercicio']}
  GROUP BY dp.idindicador,dp.iddesviacionplandemanda,
       ind.codigo,
       ind.denominacion,
       ind.idumedida,
       indp.precio ,
       dps.idplanificacion,
       dc.idcontrolejecdesviacion,
       cont.idcontrataciondemanda,
       ind.numeropieza,cantcontratada,preciocontratado

  $WHERE
      $offsetLimit";

        $sqlT = "SELECT COUNT (dp.iddesviacionplandemanda)
FROM mod_planificacion.dat_desviacionplandemanda dp
     INNER JOIN mod_planificacion.dat_desviacionplanxsustituciondemanda dps ON
      dp.iddesviacionplandemanda = dps.iddesviacionplandemanda
      LEFT JOIN mod_planificacion.dat_controlejecdesviacion dc on (dp.iddesviacionplandemanda=dc.iddesviacionplandemanda)
     INNER JOIN mod_datosmaestros.nom_indicador ind ON dp.idindicador =
      ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON indp.idindicador =ind.idindicador
     LEFT JOIN mod_planificacion.dat_contrataciondemanda cont ON ind.idindicador=cont.idindicador
WHERE /*dps.idplanificacion = '{}' AND */dp.idejercicio={$parametros['idejercicio']}


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
        $sql = "SELECT dp.idindicador,dp.iddesviacionplandemanda,
       ind.codigo,
       ind.denominacion,
       cont.idcontrataciondemanda,
       ind.idumedida,
       ind.numeropieza,


        COALESCE(cont.cantidadcontratada,0)as cantcontratada,
       COALESCE(cont.preciocontratado,0) as preciocontratado,
       COALESCE(cont.cantidadcontratada,0)*COALESCE(cont.preciocontratado,0) as importecontratado,
       SUM(cantidadreal)as cantreal,
        ((COALESCE(cont.cantidadcontratada,0))-  SUM(cantidadreal) ) as pendiente,
        CASE WHEN COALESCE(cont.cantidadcontratada,0)<>0
       THEN
       round(((COALESCE (sum(COALESCE (cantidadreal,0)),0)*100)/(COALESCE(cont.cantidadcontratada,0))),1)
       ELSE 0
        END as pejecutado
FROM mod_planificacion.dat_desviacionplandemanda dp
     INNER JOIN mod_datosmaestros.nom_indicador ind ON dp.idindicador =ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON indp.idindicador =ind.idindicador
       LEFT JOIN mod_planificacion.dat_desviacionplanxsustituciondemanda s ON
        dp.iddesviacionplandemanda = s.iddesviacionplandemanda
           LEFT JOIN mod_planificacion.dat_planificacion p ON p.idindicador = ind.idindicador
        LEFT JOIN mod_planificacion.dat_contrataciondemanda cont ON ind.idindicador=cont.idindicador
         LEFT JOIN mod_planificacion.dat_controlejecdesviacion dc on (dp.iddesviacionplandemanda=dc.iddesviacionplandemanda)
WHERE dp.identidad={$parametros['identidad']} AND
s.iddesviacionplandemanda is null
AND dp.idejercicio={$parametros['idejercicio']}
 GROUP BY dp.idindicador,dp.iddesviacionplandemanda,
       ind.codigo,
       ind.denominacion,
       ind.idumedida,
       indp.precio ,
       ind.numeropieza,cantcontratada,preciocontratado,cont.idcontrataciondemanda
   $offsetLimit";

        $sqlT = "SELECT count(dp.idindicador)
FROM mod_planificacion.dat_desviacionplandemanda dp
     INNER JOIN mod_datosmaestros.nom_indicador ind ON dp.idindicador =
      ind.idindicador
       LEFT JOIN mod_planificacion.dat_desviacionplanxsustituciondemanda s ON
        dp.iddesviacionplandemanda = s.iddesviacionplandemanda
        LEFT JOIN mod_planificacion.dat_controlejecdesviacion dc on (dp.iddesviacionplandemanda=dc.iddesviacionplandemanda)
WHERE dp.identidad= {$parametros['identidad']} AND
s.iddesviacionplandemanda is null AND dp.idejercicio={$parametros['idejercicio']}
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
        $sql = "SELECT DISTINCT i.idindicador,
       codigo,
       denominacion,
       idumedida
FROM mod_datosmaestros.nom_indicador i
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON (i.idindicador =
       ip.idindicador)
     left JOIN mod_planificacion.dat_planificacion dp ON (i.idindicador =
       dp.idindicador AND dp.idejercicio = {$parametros['idejercicio']})
     left JOIN mod_planificacion.dat_desviacionplandemanda d ON (i.idindicador =
       d.idindicador AND d.idejercicio = {$parametros['idejercicio']})
WHERE i.estado = 1 AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      --ip.precio > 0 AND
      dp.idindicador is null AND
      d.idindicador is null  $NotIn $offsetLimit";
        $sqlT = "SELECT DISTINCT COUNT (i.idindicador)
FROM mod_datosmaestros.nom_indicador i
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON (i.idindicador =
       ip.idindicador)
     left JOIN mod_planificacion.dat_planificacion dp ON (i.idindicador =
       dp.idindicador AND dp.idejercicio = {$parametros['idejercicio']})
     left JOIN mod_planificacion.dat_desviacionplandemanda d ON (i.idindicador =
       d.idindicador AND d.idejercicio = {$parametros['idejercicio']})
WHERE i.estado = 1 AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      --ip.precio > 0 AND
      dp.idindicador is null AND
      d.idindicador is null  $NotIn";

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
            $sql = "DELETE FROM mod_planificacion.dat_desviacionplandemanda cep
                WHERE cep.iddesviacionplandemanda IN ($elim)";

            $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $entidadmodelo = DatEntidadmodelo::getIdentidadmodelo(
                            $params['idmodelo'], $params['identidad']
            );
            $iddesviacion = "";
            foreach ($params['ejec'] as $ejec) {
                if ($ejec->idplanificacion[0] != null || $ejec->iddesviacionplandemanda == null
                ) {
                    //insertar
                    $objEjecPlan = new DatDesviacionplanDemanda();
                    $objEjecPlan->cantidadreal = $ejec->cantidadreal;
                    $objEjecPlan->fechareal = $ejec->fecha;

                    $objEjecPlan->identidadmodelo = $entidadmodelo[0]['identidadmodelo'];
                    $objEjecPlan->idejercicio = $params['idejercicio'];
                    $objEjecPlan->idindicador = $ejec->idindicador;
                    $objEjecPlan->idusuario = $params['idusuario'];
                    $objEjecPlan->save();
                    $iddesviacion = $objEjecPlan->iddesviacionplandemanda;
                } else {
                    $objeto = Doctrine::getTable('DatDesviacionPlandemanda')->find(
                            $ejec->iddesviacionplandemanda
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
                $objEjecPlan = new DatDesviacionplanxsustituciondemanda();
                $objEjecPlan->iddesviacionplandemanda = $params['iddesviacionplandemanda'];
                $objEjecPlan->idplanificacion = "{" . $idsplanificacion . "}";
                $objEjecPlan->save();
            }
        }
        return true;
    }

    public function listarindSust($params) {
        $params = trim($params, "{}");
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT i.idindicador, i.codigo, i.denominacion
FROM mod_datosmaestros.nom_indicador i
     INNER JOIN mod_planificacion.dat_planificacion ip ON (i.idindicador =
      ip.idindicador)

WHERE ip.idplanificacion IN ({$params})
       ";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $sust = "";
        foreach ($data as $d) {
            $sust = $sust . $d['codigo'] . '-' . $d['denominacion'] . "\n";
        }

        return $sust;
    }

}
