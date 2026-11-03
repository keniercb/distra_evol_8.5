<?php

class DatPlanificacionporfecha extends BaseDatPlanificacionporfecha {

    public function Setup() {
        parent::setUp();

        $this->hasOne(
                'DatPlanificacion', array('local' => 'idplanificacion',
            'foreign' => 'idplanificacion')
        );
    }

    public function listarIndEjecsinmodelo($parametros, $WHERE, $offsetLimit, $solocontar = null) {
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
   COALESCE(sum(cantidad),0) as cantreal,
  idplanificacion
FROM
  mod_planificacion.dat_planificacionporfecha

  GROUP BY idplanificacion)

SELECT p.idplanificacion,
       p.idindicador,
       ind.codigo,
       ind.denominacion,
       (p.cantidad + p.ajuste) as cantidad,
       COALESCE (v.cantreal,0) as cantidadreal,
       ((p.cantidad + p.ajuste) - COALESCE (v.cantreal,0)) as cantidadpordesglozar
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
      (p.idaprobaciondemanda = 4 OR p.idaprobaciondemanda = 5)AND
      (p.cantidad + p.ajuste) >0
      $addwhere
      $WHERE
      order by p.idplanificacion
      $offsetLimit";

        $sqlT = "WITH valioso AS (
SELECT
   COALESCE(sum(cantidad),0) as cantreal,
  idplanificacion
FROM
  mod_planificacion.dat_planificacionporfecha

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
      (p.idaprobaciondemanda = 4 OR p.idaprobaciondemanda = 5) AND
      (p.cantidad + p.ajuste) >0
      $addwhere
      $WHERE";
        if ($parametros['listar'] == 3)
            $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        if ($parametros['contar'] == 3) {
            $data->total = $conn->execute($sqlT)->fetchAll(PDO::FETCH_ASSOC);
            $data->total = $data->total [0]['total'];
        }
        return $data;
    }

    public function listarIndEjecConssinmodelo($parametros, $WHERE, $offsetLimit, $solocontar = null) {
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
   COALESCE(sum(cantidad),0) as cantreal,
  idplanificacion
FROM
  mod_planificacion.dat_planificacionporfecha

  GROUP BY idplanificacion)

SELECT
       x.idindicador,
       x.codigo,
       x.denominacion,
       sum(x.cantfinal) as cantidad,
       sum(x.cantreal) as cantidadreal,
       sum(x.pendiente) as cantidadpordesglozar
FROM
(SELECT
       p.idindicador,
       ind.codigo,
       ind.denominacion,
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
     (p.idaprobaciondemanda = 4 OR p.idaprobaciondemanda = 5) AND
      (p.cantidad + p.ajuste) >0
      $addwhere
      $WHERE)x

      GROUP BY
       x.idindicador,
       x.codigo,
       x.denominacion
      $offsetLimit";


        $sqlT = "WITH valioso AS (
SELECT
   COALESCE(sum(cantidad),0) as cantreal,
  idplanificacion
FROM
  mod_planificacion.dat_planificacionporfecha

  GROUP BY idplanificacion)

SELECT
      count(DISTINCT x.idindicador) as total
FROM
(SELECT
       p.idindicador,
       ind.codigo,
       ind.denominacion,
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
      (p.idaprobaciondemanda = 4 OR p.idaprobaciondemanda = 5) AND
      (p.cantidad + p.ajuste) >0
      $addwhere
      $WHERE)x";
        if ($parametros['listar'] == true)
            $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        if ($parametros['contar'] == true) {
            $data->total = $conn->execute($sqlT)->fetchAll(PDO::FETCH_ASSOC);
            $data->total = $data->total [0]['total'];
        }
        return $data;
    }

    //Utilizado como servicio
    public function servicioObtenerIndicadoresPorFecha($identidad, $fechaInicio, $fechaFin) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT pf.fechainicio as start_date,
                        pf.fechafin as end_date,
                        ind.idindicador as idelemento,
                        ind.denominacion as text,
                        0 as progress,
                        1 as open,
                        12 as idtipoelemento,
                        0 as actualizarporciento,
                        0 as modificar,
                        0 as eliminar,
                        pf.cantidad as cantidad
                 FROM mod_planificacion.dat_planificacionporfecha pf
                      INNER JOIN mod_planificacion.dat_planificacion p ON p.idplanificacion = pf.idplanificacion
                      INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo = em.identidadmodelo
                      INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador = ind.idindicador
                 where em.identidad IN ($identidad) AND
                       pf.fechainicio <= $fechaFin AND
                       pf.fechafin >= $fechaInicio";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}
