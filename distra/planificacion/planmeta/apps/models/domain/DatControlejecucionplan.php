<?php

class DatControlejecucionplan extends BaseDatControlejecucionplan {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'DatPlanificacion', array('local' => 'idplanificacion', 'foreign' => 'idplanificacion')
        );
    }

    //Lista los indicadores con cantidad mayor que cero dada una entidad, un plan y un ejercicio (entidad hija)

    public function listarIndEjec($parametros, $WHERE, $offsetLimit) {
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        $entidades = $ent = implode(',', $parametros['entidades']);

        $conn = Doctrine_Manager::connection();
        $sql = "WITH valioso AS (
SELECT
   COALESCE(sum(cantidadreal),0) as cantreal,
  idplanificacion
FROM
  mod_planificacion.dat_controlejecucionplan

  GROUP BY idplanificacion)

SELECT p.idplanificacion,
       p.idindicador,
       ind.codigo,
       ind.denominacion,
       p.idunidadmedida,
       (p.cantidad + p.ajuste) as cantfinal,
       COALESCE (v.cantreal,0) as cantreal,
       ((p.cantidad + p.ajuste) - COALESCE (v.cantreal,0)) as pendiente
FROM mod_planificacion.dat_planificacion p
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo = em.identidadmodelo
     INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador = ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador = ind.idindicador
     LEFT JOIN valioso v ON (p.idplanificacion=v.idplanificacion)
where em.identidad IN($entidades)  AND
      p.idejercicio = {$parametros['idejercicio']} AND
      em.idmodelo = {$parametros['idmodelo']} AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      p.idaprobaciondemanda = 4 AND
      (p.cantidad + p.ajuste) >0
      $addwhere
      $WHERE
      order by  ind.codigo
      $offsetLimit";

        $sqlT = "WITH valioso AS (
SELECT
   COALESCE(sum(cantidadreal),0) as cantreal,
  idplanificacion
FROM
  mod_planificacion.dat_controlejecucionplan

  GROUP BY idplanificacion)

  SELECT count(p.idplanificacion) as total
FROM mod_planificacion.dat_planificacion p
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo = em.identidadmodelo
     INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador = ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador = ind.idindicador
     LEFT JOIN valioso v ON (p.idplanificacion=v.idplanificacion)
where em.identidad IN($entidades)  AND
      p.idejercicio = {$parametros['idejercicio']} AND
      em.idmodelo = {$parametros['idmodelo']} AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      p.idaprobaciondemanda = 4 AND
      (p.cantidad + p.ajuste) >0
      $addwhere
      $WHERE";
        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $conn->execute($sqlT)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total [0]['total'];
        return $data;
    }

    //Lista los indicadores con cantidad mayor que cero dada una entidad, un plan y un ejercicio (entidad padre)
    public function listarIndEjecCons($parametros, $WHERE, $offsetLimit) {
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        $entidades = $ent = implode(',', $parametros['entidades']);

        $conn = Doctrine_Manager::connection();
        $sql = "WITH valioso AS (
SELECT
   COALESCE(sum(cantidadreal),0) as cantreal,
  idplanificacion
FROM
  mod_planificacion.dat_controlejecucionplan

  GROUP BY idplanificacion)

SELECT
       x.idindicador,
       x.codigo,
       x.denominacion,
       x.idunidadmedida,
       sum(x.cantfinal) as cantfinal,
       sum(x.cantreal) as cantreal,
       sum(x.pendiente) as pendiente
FROM
(SELECT
       p.idindicador,
       ind.codigo,
       ind.denominacion,
       p.idunidadmedida,
       (p.cantidad + p.ajuste) as cantfinal,
       COALESCE (v.cantreal,0) as cantreal,
       ((p.cantidad + p.ajuste) - COALESCE (v.cantreal,0)) as pendiente
FROM mod_planificacion.dat_planificacion p
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo = em.identidadmodelo
     INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador = ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador = ind.idindicador
     LEFT JOIN valioso v ON (p.idplanificacion=v.idplanificacion)
where em.identidad IN($entidades)  AND
      p.idejercicio = {$parametros['idejercicio']} AND
      em.idmodelo = {$parametros['idmodelo']} AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      p.idaprobaciondemanda = 4 AND
      (p.cantidad + p.ajuste) >0
      $addwhere
      $WHERE )x

      GROUP BY
       x.idindicador,
       x.codigo,
       x.denominacion,
       x.idunidadmedida
        order by  x.codigo
      $offsetLimit";


        $sqlT = "WITH valioso AS (
SELECT
   COALESCE(sum(cantidadreal),0) as cantreal,
  idplanificacion
FROM
  mod_planificacion.dat_controlejecucionplan

  GROUP BY idplanificacion)

SELECT
      count(DISTINCT x.idindicador) as total
FROM
(SELECT
       p.idindicador,
       ind.codigo,
       ind.denominacion,
       p.idunidadmedida,
       (p.cantidad + p.ajuste) as cantfinal,
       COALESCE (v.cantreal,0) as cantreal,
       ((p.cantidad + p.ajuste) - COALESCE (v.cantreal,0)) as pendiente
FROM mod_planificacion.dat_planificacion p
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo = em.identidadmodelo
     INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador = ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador = ind.idindicador
     LEFT JOIN valioso v ON (p.idplanificacion=v.idplanificacion)
where em.identidad IN($entidades)  AND
      p.idejercicio = {$parametros['idejercicio']} AND
      em.idmodelo = {$parametros['idmodelo']} AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      p.idaprobaciondemanda = 4 AND
      (p.cantidad + p.ajuste) >0
      $addwhere
      $WHERE)x";

        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $conn->execute($sqlT)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total [0]['total'];
        return $data;
    }

    //Lista la cantidad real de la ejecución dado un idplanificación
    public function listarEjecucionPlan($parametros, $offsetLimit, $WHERE) {

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
  idcontrolejecucionplan,
  cantidadreal,
  fechareal
FROM
  mod_planificacion.dat_controlejecucionplan
  where idplanificacion={$parametros['idplanificacion']}
  $WHERE
      $offsetLimit";
        $sqlT = "SELECT COUNT (idcontrolejecucionplan)
FROM
  mod_planificacion.dat_controlejecucionplan
  where idplanificacion={$parametros['idplanificacion']}
  $WHERE
      ";

        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $conn->execute($sqlT)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total [0]['count'];
        return $data;
    }

    //Inserta la cantidad real de la ejecución dado un idplanificación
    public function insertarEjecPlan($params) {
        if ($params['eliminar'][0] != null) {
            $ind_elim = implode(',', $params['eliminar']);
            $conn = Doctrine_Manager::connection();
            $sql = "DELETE FROM mod_planificacion.dat_controlejecucionplan cep
                WHERE cep.idcontrolejecucionplan IN ($ind_elim)";
            $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        } else {
            foreach ($params['ejec'] as $ejec) {
                if ($ejec->idcontrolejecucionplan != null) {
                    $objeto = Doctrine::getTable('DatControlejecucionplan')
                            ->find(
                            $ejec->idcontrolejecucionplan
                    );
                    //modificar
                    $objeto->cantidadreal = $ejec->cantidadreal;
                    $objeto->fechareal = $ejec->fecha;
                    $objeto->save();
                } else {
                    //adicionar
                    $objEjecPlan = new DatControlejecucionplan();
                    $objEjecPlan->cantidadreal = $ejec->cantidadreal;
                    $objEjecPlan->fechareal = $ejec->fecha;
                    $objEjecPlan->idplanificacion = $params['idplanificacion'];
                    $objEjecPlan->idusuario = $params['idusuario'];
                    $objEjecPlan->save();
                }
            }
        }


        return true;
    }

}
