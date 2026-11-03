<?php

class DatControlejecucionplanDemanda extends BaseDatControlejecucionplandemanda {

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

        $sql = "SELECT s.idplanificacion,s.idindicador,s.codigo,s.denominacion,s.precio,round(s.importe,3) as importe,round(s.cantfinal,6) as cantfinal,
s.idunidadmedida,round(s.cantcontratada,6) as cantcontratada,s.preciocontratado,round(s.importecontratado,3) as importecontratado,round(s.cantreal,6) as cantreal,round(s.pendiente,6) as pendiente,
s.indsustituido,s.idcontrataciondemanda,
CASE WHEN s.cantfinal<>0 THEN round(COALESCE((s.cantcontratada*100)/s.cantfinal,0),3)  ELSE 0 END as pcontratado,
CASE WHEN s.cantcontratada<>0 THEN round(COALESCE((s.cantreal*100)/s.cantcontratada,0),3)  ELSE 0 END as pejecutado
 FROM(WITH valioso AS (
SELECT
   COALESCE(sum(cantidadreal),0) as cantreal,
  idplanificacion
FROM
  mod_planificacion.dat_controlejecucionplandemanda

  GROUP BY idplanificacion)

SELECT DISTINCT (p.idplanificacion),
       p.idindicador,
       ind.codigo,
       ind.denominacion,
       p.precio,
       cont.idcontrataciondemanda,
       round(((p.precio*SUM((p.cantidad+p.ajuste))) +
                 (((p.precio*SUM((p.cantidad+p.ajuste)*ip.flete)))/100) + (((p.precio*
                 SUM((p.cantidad+p.ajuste)*ip.contingencia)))/100))- ( COALESCE(SUM(cpe),0) *p.precio),3) as importe,
       p.idunidadmedida,
       sum(p.cantidad + p.ajuste) as cantfinal,
       COALESCE(cont.cantidadcontratada,0)as cantcontratada,
       COALESCE(cont.preciocontratado,0) as preciocontratado,
       COALESCE(cont.cantidadcontratada,0)*COALESCE(cont.preciocontratado,0) as importecontratado,
         COALESCE (v.cantreal,0) as cantreal,
       ((COALESCE(cont.cantidadcontratada,0))- COALESCE (v.cantreal,0) ) as pendiente,
       (
         SELECT ind.denominacion
         from mod_planificacion.dat_desviacionplanxsustituciondemanda ds
              left JOIN mod_planificacion.dat_desviacionplandemanda d on
                d.iddesviacionplandemanda = ds.iddesviacionplandemanda
              INNER JOIN mod_datosmaestros.nom_indicador ind ON d.idindicador =
                ind.idindicador
         where p.idplanificacion = ANY (ds.idplanificacion)
       ) as indsustituido
FROM mod_planificacion.dat_planificacion p
 INNER JOIN mod_planificacion.dat_entidaddatosnomenclador cb ON p.idcentrobalance=cb.identidaddatosnomenclador
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo = em.identidadmodelo
     INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador = ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador = ind.idindicador
     LEFT JOIN valioso v ON (p.idplanificacion=v.idplanificacion)
     LEFT JOIN mod_planificacion.dat_contrataciondemanda cont ON p.idplanificacion=cont.idplanificacion
      LEFT JOIN mod_planificacion.dat_ajusteexistencia ae on (p.idindicador =
      ae.idindicador  AND ae.idejercicio =  {$parametros['idejercicio']})
     LEFT JOIN mod_planificacion.dat_odcte odcte on (ip.idindicador =
      odcte.idindicador AND odcte.identidad = em.identidad AND em.idmodelo =
       odcte.idmodelo AND odcte.idejercicio =  {$parametros['idejercicio']})
       INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iv ON
      ip.idindicador = iv.idindicador
     INNER JOIN mod_datosmaestros.nom_viaadquisicion via ON iv.idviaadquisicion
      = via.idviaadquisicion
where cb.identidad ={$parametros['identidad']}  AND
      p.idejercicio =  {$parametros['idejercicio']} AND
      em.idmodelo = {$parametros['idmodelo']} AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      (p.idaprobaciondemanda = 4 OR p.idaprobaciondemanda = 5) AND
      (p.cantidad + p.ajuste) >0
      $addwhere
      $WHERE
      GROUP BY
      p.idplanificacion,  ind.codigo,ind.denominacion,
      ind.numeropieza,
      cont.cantidadcontratada,
      cont.preciocontratado,v.cantreal,cont.idcontrataciondemanda
      ORDER BY ind.codigo )s
      $offsetLimit";

        /* $sqlT = "WITH valioso AS (
          SELECT
          COALESCE(sum(cantidadreal),0) as cantreal,
          idplanificacion
          FROM
          mod_planificacion.dat_controlejecucionplandemanda

          GROUP BY idplanificacion)

          SELECT count(p.idplanificacion) as total
          FROM mod_planificacion.dat_planificacion p
          INNER JOIN mod_planificacion.dat_entidaddatosnomenclador cb ON p.idcentrobalance=cb.identidaddatosnomenclador
          INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo = em.identidadmodelo
          INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador = ind.idindicador
          INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador = ind.idindicador
          LEFT JOIN valioso v ON (p.idplanificacion=v.idplanificacion)
          LEFT JOIN mod_planificacion.dat_contrataciondemanda cont ON p.idplanificacion=cont.idplanificacion
          LEFT JOIN mod_planificacion.dat_ajusteexistencia ae on (p.idindicador =
          ae.idindicador  AND ae.idejercicio =  {$parametros['idejercicio']})
          LEFT JOIN mod_planificacion.dat_odcte odcte on (ip.idindicador =
          odcte.idindicador AND odcte.identidad = em.identidad AND em.idmodelo =
          odcte.idmodelo AND odcte.idejercicio =  {$parametros['idejercicio']})
          where cb.identidad ={$parametros['identidad']}  AND
          p.idejercicio = {$parametros['idejercicio']} AND
          em.idmodelo = {$parametros['idmodelo']} AND
          ip.nivelplanif = 1 AND
          ip.idaprobacion = 4 AND
          p.idaprobaciondemanda = 4 AND
          (p.cantidad + p.ajuste) >0
          $addwhere
          $WHERE"; */

        $sqlT = "SELECT s.total as total

 FROM(WITH valioso AS (
SELECT
   COALESCE(sum(cantidadreal),0) as cantreal,
  idplanificacion
FROM
  mod_planificacion.dat_controlejecucionplandemanda

  GROUP BY idplanificacion)

SELECT count(DISTINCT p.idplanificacion) as total
FROM mod_planificacion.dat_planificacion p
 INNER JOIN mod_planificacion.dat_entidaddatosnomenclador cb ON p.idcentrobalance=cb.identidaddatosnomenclador
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo = em.identidadmodelo
     INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador = ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador = ind.idindicador
     LEFT JOIN valioso v ON (p.idplanificacion=v.idplanificacion)
     LEFT JOIN mod_planificacion.dat_contrataciondemanda cont ON p.idplanificacion=cont.idplanificacion
      LEFT JOIN mod_planificacion.dat_ajusteexistencia ae on (p.idindicador =
      ae.idindicador  AND ae.idejercicio =  {$parametros['idejercicio']})
     LEFT JOIN mod_planificacion.dat_odcte odcte on (ip.idindicador =
      odcte.idindicador AND odcte.identidad = em.identidad AND em.idmodelo =
       odcte.idmodelo AND odcte.idejercicio =  {$parametros['idejercicio']})
       INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iv ON
      ip.idindicador = iv.idindicador
     INNER JOIN mod_datosmaestros.nom_viaadquisicion via ON iv.idviaadquisicion
      = via.idviaadquisicion
where cb.identidad ={$parametros['identidad']}  AND
      p.idejercicio =  {$parametros['idejercicio']} AND
      em.idmodelo = {$parametros['idmodelo']} AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      (p.idaprobaciondemanda = 4 OR p.idaprobaciondemanda = 5) AND
      (p.cantidad + p.ajuste) >0
      $addwhere
      $WHERE )s";
        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $conn->execute($sqlT)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total [0]['total'];

        return $data;
    }

    //Lista la cantidad real de la ejecución dado un idplanificación
    public function listarEjecucionPlan($parametros, $offsetLimit, $WHERE) {

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
  idcontrolejecucionplandemanda,
  cantidadreal,
  fechareal
FROM
  mod_planificacion.dat_controlejecucionplandemanda
  where idplanificacion={$parametros['idplanificacion']}
  $WHERE
      $offsetLimit";
        $sqlT = "SELECT COUNT (idcontrolejecucionplandemanda)
FROM
  mod_planificacion.dat_controlejecucionplandemanda
  where idplanificacion={$parametros['idplanificacion']}
  $WHERE
      ";

        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $conn->execute($sqlT)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total [0]['count'];
        return $data;
    }

    public function listarEjecucionAdicion($parametros, $offsetLimit, $WHERE) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT dc.idcontrolejecdesviacion,
       cantidadreal,
       fechareal
FROM mod_planificacion.dat_controlejecdesviacion dc
INNER JOIN  mod_planificacion.dat_desviacionplandemanda dp on (dp.iddesviacionplandemanda=dc.iddesviacionplandemanda)
 LEFT JOIN mod_planificacion.dat_desviacionplanxsustituciondemanda s ON
        dp.iddesviacionplandemanda = s.iddesviacionplandemanda
         where dc.iddesviacionplandemanda={$parametros['iddesviacionplandemanda']} AND s.iddesviacionplandemanda is null
   $offsetLimit";
        $sqlT = "SELECT count(dc.idcontrolejecdesviacion)
FROM mod_planificacion.dat_controlejecdesviacion dc
INNER JOIN  mod_planificacion.dat_desviacionplandemanda dp on (dp.iddesviacionplandemanda=dc.iddesviacionplandemanda)
 LEFT JOIN mod_planificacion.dat_desviacionplanxsustituciondemanda s ON
        dp.iddesviacionplandemanda = s.iddesviacionplandemanda
         where dc.iddesviacionplandemanda={$parametros['iddesviacionplandemanda']} AND s.iddesviacionplandemanda is null
   $offsetLimit";

        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $conn->execute($sqlT)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total [0]['count'];
        return $data;
    }

    public function listarEjecucionDesviacion($parametros, $offsetLimit, $WHERE) {

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT dp.idindicador,
       cantidadreal,
       fechareal
FROM mod_planificacion.dat_controlejecdesviacion dc
INNER JOIN  mod_planificacion.dat_desviacionplandemanda dp on (dp.iddesviacionplandemanda=dc.iddesviacionplandemanda)
INNER JOIN mod_planificacion.dat_desviacionplanxsustituciondemanda s ON
        dp.iddesviacionplandemanda = s.iddesviacionplandemanda
         where dp.idindicador={$parametros['idindicador']}
   $offsetLimit";
        $sqlT = "SELECT count(dp.idindicador)
FROM mod_planificacion.dat_controlejecdesviacion dc
INNER JOIN  mod_planificacion.dat_desviacionplandemanda dp on (dp.iddesviacionplandemanda=dc.iddesviacionplandemanda)
INNER JOIN mod_planificacion.dat_desviacionplanxsustituciondemanda s ON
        dp.iddesviacionplandemanda = s.iddesviacionplandemanda
         where dp.idindicador={$parametros['idindicador']}
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
            $sql = "DELETE FROM mod_planificacion.dat_controlejecucionplandemanda cep
                WHERE cep.idcontrolejecucionplandemanda IN ($ind_elim)";
            $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        } else {
            foreach ($params['ejec'] as $ejec) {
                if ($ejec->idcontrolejecucionplandemanda != null) {
                    $objeto = Doctrine::getTable('DatControlejecucionplandemanda')
                            ->find(
                            $ejec->idcontrolejecucionplandemanda
                    );
                    //modificar
                    $objeto->cantidadreal = $ejec->cantidadreal;
                    $objeto->fechareal = $ejec->fechareal;
                    $objeto->save();
                } else {
                    //adicionar
                    $objEjecPlan = new DatControlejecucionplanDemanda();
                    $objEjecPlan->cantidadreal = $ejec->cantidadreal;
                    $objEjecPlan->fechareal = $ejec->fechareal;
                    $objEjecPlan->idplanificacion = $params['idplanificacion'];
                    $objEjecPlan->idusuario = $params['idusuario'];
                    $objEjecPlan->save();
                }
            }
        }

        return true;
    }

    public function insertarEjecfueradePlanyDesv($params) {
        if ($params['eliminar'][0] != null) {
            $ind_elim = implode(',', $params['eliminar']);
            $conn = Doctrine_Manager::connection();
            $sql = "DELETE FROM mod_planificacion.dat_controlejecdesviacion cep
                WHERE cep.idcontrolejecdesviacion IN ($ind_elim)";
            $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        } else {

            foreach ($params['ejec'] as $ejec) {
                if ($ejec->idcontrolejecdesviacion != null) {
                    $objeto = Doctrine::getTable('DatControlejecdesviacion')
                            ->find(
                            $ejec->idcontrolejecdesviacion
                    );
                    //modificar

                    $objeto->cantidadreal = $ejec->cantidadreal;
                    $objeto->fechareal = $ejec->fechareal;
                    $objeto->save();
                } else {
                    //adicionar
                    $objEjecPlan = new DatControlejecdesviacion();
                    $objEjecPlan->cantidadreal = $ejec->cantidadreal;
                    $objEjecPlan->fechareal = $ejec->fechareal;
                    $objEjecPlan->iddesviacionplandemanda = $params['iddesviacionplandemanda'];
                    $objEjecPlan->save();
                }
            }
        }


        return true;
    }

//Inserta la cantidad real de la ejecución dado un idplanificación

    public function insertarFueradePlan($params) {
        $arrayid = implode(',', $params['idsplanificacion']);
        $idsplanif = '{' . $arrayid . '}';

        if ($params['codigo'] == 1) {

            foreach ($params['indicadores'] as $ejec) {

                //adicionar
                $objEjecPlan = new DatDesviacionplanDemanda();
                $objEjecPlan->idindicador = $ejec->idindicador;
                $objEjecPlan->identidad = $params['identidad'];
                $objEjecPlan->idejercicio = $params['idejercicio'];
                $objEjecPlan->idusuario = $params['idusuario'];
                $objEjecPlan->save();


                $objeto = new DatDesviacionplanxsustituciondemanda();
                $objeto->iddesviacionplandemanda = $objEjecPlan->iddesviacionplandemanda;
                $objeto->idplanificacion = $idsplanif;
                $objeto->save();
            }
        } else {
            foreach ($params['indicadores'] as $ejec) {

                //adicionar
                $objEjecPlan = new DatDesviacionplanDemanda();
                $objEjecPlan->idindicador = $ejec->idindicador;
                $objEjecPlan->identidad = $params['identidad'];
                $objEjecPlan->idejercicio = $params['idejercicio'];
                $objEjecPlan->idusuario = $params['idusuario'];
                $objEjecPlan->save();
            }
        }

        return true;
    }

    //Gráfica ejecución global x entidad
    public function graficaEjecucionglobalxentidad($parametros) {
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT

(p.precio*SUM((p.cantidad+p.ajuste))) +
                 (((p.precio*SUM((p.cantidad+p.ajuste)))*ip.flete)/100) + (((p.precio*
                 SUM((p.cantidad+p.ajuste)))*ip.contingencia)/100) as importeplan,

                 (p.precio*SUM((COALESCE (ce.cantidadreal,0)))) +
                 (((p.precio*SUM((COALESCE (ce.cantidadreal,0))))*ip.flete)/100) + (((p.precio*
                 SUM((COALESCE (ce.cantidadreal,0))))*ip.contingencia)/100) as importeejecutado,

  ((p.precio*SUM((p.cantidad+p.ajuste))) +
                 (((p.precio*SUM((p.cantidad+p.ajuste)))*ip.flete)/100) + (((p.precio*
                 SUM((p.cantidad+p.ajuste)))*ip.contingencia)/100))- ((p.precio*SUM((COALESCE (ce.cantidadreal,0)))) +
                 (((p.precio*SUM((COALESCE (ce.cantidadreal,0))))*ip.flete)/100) + (((p.precio*
                 SUM((COALESCE (ce.cantidadreal,0))))*ip.contingencia)/100)) as importependiente
FROM
  mod_planificacion.dat_planificacion p
  INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador = ind.idindicador
  INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador = ind.idindicador
  INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo=em.identidadmodelo
  LEFT JOIN mod_planificacion.dat_controlejecucionplandemanda ce ON p.idplanificacion=ce.idplanificacion
where
  em.identidad IN($entidades)AND
  p.idejercicio={$parametros['idejercicio']}   AND
  ip.nivelplanif = 1 AND
  ip.idaprobacion = 4 AND
  p.idaprobaciondemanda = 4
  $addwhere
  group by p.precio,ip.flete,
ip.contingencia";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Gráfica ejecución global x entidad (Ingreso/Gasto)
    public function graficaEjecucionglobalxentidadIngresoGasto($parametros) {
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        $conn = Doctrine_Manager::connection();
        $sql = "
WITH consulta AS (
SELECT CASE
         WHEN mod.tipoplan=0  THEN (p.precio*SUM((COALESCE (ce.cantidadreal,0)))) +
                 (((p.precio*SUM((COALESCE (ce.cantidadreal,0))))*ip.flete)/100) + (((p.precio*
                 SUM((COALESCE (ce.cantidadreal,0))))*ip.contingencia)/100)
         ELSE 0
       END as gastos,
       CASE
         WHEN mod.tipoplan=1  THEN (p.precio*SUM((COALESCE (ce.cantidadreal,0)))) +
                 (((p.precio*SUM((COALESCE (ce.cantidadreal,0))))*ip.flete)/100) + (((p.precio*
                 SUM((COALESCE (ce.cantidadreal,0))))*ip.contingencia)/100)
         ELSE 0
       END as ingreso
FROM mod_planificacion.dat_planificacion p
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON em.identidadmodelo =
      p.identidadmodelo
      INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo= mod.idmodelo
		INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador = ind.idindicador
  	INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador = ind.idindicador
LEFT JOIN mod_planificacion.dat_controlejecucionplandemanda ce ON p.idplanificacion=ce.idplanificacion
WHERE  em.identidad IN($entidades)AND
  p.idejercicio={$parametros['idejercicio']}   AND
  ip.nivelplanif = 1 AND
  ip.idaprobacion = 4 AND
  p.idaprobaciondemanda = 4
  $addwhere

GROUP BY p.precio,mod.tipoplan,
ip.flete,
ip.contingencia)

SELECT sum(c.gastos) as gastos,
       sum(c.ingreso) as ingreso,
       (sum(c.ingreso)-sum(c.gastos)) as diferencia
from consulta c";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    //Gráfica ejecución global x entidad x plan
    public function graficaEjecucionglobalxentidadxplan($parametros) {
        $entidades = implode(',', $parametros['identidad']);

        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        $conn = Doctrine_Manager::connection();
        $sql = "WITH desviacionsust AS (
SELECT COALESCE(sum(d.cantidadreal * ip.precio), 0) as sustituciones,
       d.identidadmodelo
FROM mod_planificacion.dat_desviacionplandemanda d
     INNER JOIN mod_planificacion.dat_desviacionplanxsustituciondemanda s ON
      d.iddesviacionplandemanda = s.iddesviacionplandemanda
     INNER JOIN mod_datosmaestros.nom_indicador ind ON d.idindicador =
      ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
      ind.idindicador
where ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      d.idejercicio = {$parametros['idejercicio']}
      $addwhere
GROUP BY d.identidadmodelo),
  desviacionadicion AS (
  SELECT COALESCE(sum(d.cantidadreal * ip.precio), 0) as adiciones,
         d.identidadmodelo
  FROM mod_planificacion.dat_desviacionplandemanda d
       LEFT JOIN mod_planificacion.dat_desviacionplanxsustituciondemanda s ON
        d.iddesviacionplandemanda = s.iddesviacionplandemanda
       INNER JOIN mod_datosmaestros.nom_indicador ind ON d.idindicador =
        ind.idindicador
       INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
        ind.idindicador
  where s.iddesviacionplandemanda is null AND
        ip.nivelplanif = 1 AND
        ip.idaprobacion = 4 AND
        d.idejercicio = {$parametros['idejercicio']}
        $addwhere
  GROUP BY d.identidadmodelo)

SELECT sum((cantidad + ajuste) * p.precio) as importeplan,
       COALESCE(sum((COALESCE(ce.cantidadreal, 0)) * p.precio), 0) as
        importeejecutado,
       COALESCE(sum(d.sustituciones), 0) as importesustitucion,
       COALESCE(sum(a.adiciones), 0) as importeadicion,
       (COALESCE(sum((COALESCE(ce.cantidadreal, 0)) * p.precio), 0) + COALESCE(
       sum(d.sustituciones), 0) + COALESCE(sum(a.adiciones), 0)) as
        importetotalejecutado
FROM mod_planificacion.dat_planificacion p
     INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador =
      ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
      ind.idindicador
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo =
      em.identidadmodelo
     LEFT JOIN mod_planificacion.dat_controlejecucionplandemanda ce ON
      p.idplanificacion = ce.idplanificacion
     LEFT JOIN desviacionsust d ON (em.identidadmodelo = d.identidadmodelo)
     LEFT JOIN desviacionadicion a ON (em.identidadmodelo = a.identidadmodelo)
where em.identidad IN ($entidades)
      {$parametros['addcondicion']} AND
      p.idejercicio = {$parametros['idejercicio']} AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      p.idaprobaciondemanda = 4
      $addwhere";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Gráfica ejecución global x entidad x clasificación del plan
    public function graficaEjecucionglobalxentidadxClasifplan($parametros) {
        $entidades = implode(',', $parametros['identidad']);

        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        $comillas = "'";

        $conn = Doctrine_Manager::connection();
        $sql = "WITH desviacionsust AS (
SELECT

(ip.precio*SUM((d.cantidadreal))) +
                 (((ip.precio*SUM((d.cantidadreal)))*ip.flete)/100) + (((ip.precio*
                 SUM((d.cantidadreal)))*ip.contingencia)/100) as sustituciones,

       d.identidadmodelo
FROM mod_planificacion.dat_desviacionplandemanda d
     INNER JOIN mod_planificacion.dat_desviacionplanxsustituciondemanda s ON
      d.iddesviacionplandemanda = s.iddesviacionplandemanda
     INNER JOIN mod_datosmaestros.nom_indicador ind ON d.idindicador =
      ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
      ind.idindicador
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON d.identidadmodelo =
      em.identidadmodelo
     INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
where ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      d.idejercicio = {$parametros['idejercicio']} AND
      mod.tipoplan={$parametros['uri']}
      $addwhere
GROUP BY d.identidadmodelo, ip.precio,ip.contingencia,ip.flete),
  desviacionadicion AS (
  SELECT

  (ip.precio*SUM((d.cantidadreal))) +
                 (((ip.precio*SUM((d.cantidadreal)))*ip.flete)/100) + (((ip.precio*
                 SUM((d.cantidadreal)))*ip.contingencia)/100)  as adiciones,

         d.identidadmodelo
  FROM mod_planificacion.dat_desviacionplandemanda d
       LEFT JOIN mod_planificacion.dat_desviacionplanxsustituciondemanda s ON
        d.iddesviacionplandemanda = s.iddesviacionplandemanda
       INNER JOIN mod_datosmaestros.nom_indicador ind ON d.idindicador =
        ind.idindicador
       INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
        ind.idindicador
       INNER JOIN mod_planificacion.dat_entidadmodelo em ON d.identidadmodelo =
        em.identidadmodelo
       INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
  where s.iddesviacionplandemanda is null AND
        ip.nivelplanif = 1 AND
        ip.idaprobacion = 4 AND
        d.idejercicio = {$parametros['idejercicio']} AND
         mod.tipoplan={$parametros['uri']}
        $addwhere
  GROUP BY d.identidadmodelo, ip.precio,ip.contingencia,ip.flete)



SELECT mod.denominacion as plan,

       (p.precio*SUM((p.cantidad+p.ajuste))) +
                 (((p.precio*SUM((p.cantidad+p.ajuste)))*ip.flete)/100) + (((p.precio*
                 SUM((p.cantidad+p.ajuste)))*ip.contingencia)/100) as importeplan,

       (p.precio*SUM((ce.cantidadreal))) +
                 (((p.precio*SUM((ce.cantidadreal)))*ip.flete)/100) + (((p.precio*
                 SUM((ce.cantidadreal)))*ip.contingencia)/100) as
        importeejecutado,


       COALESCE(sum(d.sustituciones), 0) as importesustitucion,

       COALESCE(sum(a.adiciones), 0) as importeadicion,

        (((p.precio*SUM((ce.cantidadreal))) +
                 (((p.precio*SUM((ce.cantidadreal)))*ip.flete)/100) + (((p.precio*
                 SUM((ce.cantidadreal)))*ip.contingencia)/100)) + COALESCE(
       sum(d.sustituciones), 0) + COALESCE(sum(a.adiciones), 0)) as
        importetotalejecutado



FROM mod_planificacion.dat_planificacion p
     INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador =
      ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
      ind.idindicador
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo =
      em.identidadmodelo
     INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
     LEFT JOIN mod_planificacion.dat_controlejecucionplandemanda ce ON
      p.idplanificacion = ce.idplanificacion
     LEFT JOIN desviacionsust d ON (em.identidadmodelo = d.identidadmodelo)
     LEFT JOIN desviacionadicion a ON (em.identidadmodelo = a.identidadmodelo)
where em.identidad IN ($entidades) AND
      p.idejercicio = {$parametros['idejercicio']} AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      p.idaprobaciondemanda = 4 AND
       mod.tipoplan={$parametros['uri']}
      $addwhere
GROUP BY mod.denominacion, p.precio,ip.contingencia,ip.flete
      ";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Gráfica ejecución x entidad x trimestres
    public function graficaEjecucionglobalxentidadejecutadoxtrimestre($parametros
    ) {
        $entidades = implode(',', $parametros['identidad']);


        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $comillas = "'";
        $conn = Doctrine_Manager::connection();
        $varconst = "(p.precio*SUM(COALESCE(ce.cantidadreal, 0))) +
                 (((p.precio*SUM(COALESCE(ce.cantidadreal, 0)))*ip.flete)/100) + (((p.precio*
                 SUM(COALESCE(ce.cantidadreal, 0)))*ip.contingencia)/100)";
        $sql = "--ejecutado por trimestre
WITH
ejecutado AS (
SELECT

        CASE
         WHEN EXTRACT (QUARTER FROM ce.fechareal) =1 THEN $varconst
         ELSE 0
       END as ejecutadotrimestre1,
               CASE
         WHEN EXTRACT (QUARTER FROM ce.fechareal) =2 THEN $varconst
         ELSE 0
       END as ejecutadotrimestre2,
               CASE
         WHEN EXTRACT (QUARTER FROM ce.fechareal) =3 THEN $varconst
         ELSE 0
       END as ejecutadotrimestre3,
               CASE
         WHEN EXTRACT (QUARTER FROM ce.fechareal) =4 THEN $varconst
         ELSE 0
       END as ejecutadotrimestre4

FROM mod_planificacion.dat_planificacion p
     INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador =
      ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
      ind.idindicador
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo =
      em.identidadmodelo
     LEFT JOIN mod_planificacion.dat_controlejecucionplandemanda ce ON
      p.idplanificacion = ce.idplanificacion
    INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
where em.identidad IN ($entidades) AND
      p.idejercicio = {$parametros['idejercicio']} AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      p.idaprobaciondemanda = 4
      $addwhere AND
      mod.tipoplan={$parametros['uri']}
      {$parametros['addcondicion']}
GROUP BY ce.fechareal,p.precio,
ip.flete,
ip.contingencia

)

SELECT sum(e.ejecutadotrimestre1)as ejecutadotrimestre1,
sum(e.ejecutadotrimestre2) as ejecutadotrimestre2,
sum(e.ejecutadotrimestre3) as ejecutadotrimestre3,
sum(e.ejecutadotrimestre4) as ejecutadotrimestre4
FROM ejecutado e ";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Gráfica ejecución x entidad x trimestres
    public function graficaEjecucionglobalxentidadadicionadoxtrimestre($parametros
    ) {
        $entidades = implode(',', $parametros['identidad']);

        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $comillas = "'";
        $conn = Doctrine_Manager::connection();
        $varconst = "(ip.precio*SUM(COALESCE(d.cantidadreal, 0))) +
                 (((ip.precio*SUM(COALESCE(d.cantidadreal, 0)))*ip.flete)/100) + (((ip.precio*
                 SUM(COALESCE(d.cantidadreal, 0)))*ip.contingencia)/100)";
        $sql = "--adiciones por trimestre
WITH
adiciones AS (
SELECT

                 CASE
         WHEN EXTRACT (QUARTER FROM d.fechareal) =1 THEN $varconst
         ELSE 0
       END as adiciontrimestre1,
               CASE
         WHEN EXTRACT (QUARTER FROM d.fechareal) =2 THEN $varconst
         ELSE 0
       END as adiciontrimestre2,
               CASE
         WHEN EXTRACT (QUARTER FROM d.fechareal) =3 THEN $varconst
         ELSE 0
       END as adiciontrimestre3,
               CASE
         WHEN EXTRACT (QUARTER FROM d.fechareal) =4 THEN $varconst
         ELSE 0
       END as adiciontrimestre4

  FROM mod_planificacion.dat_desviacionplandemanda d
       LEFT JOIN mod_planificacion.dat_desviacionplanxsustituciondemanda s ON
        d.iddesviacionplandemanda = s.iddesviacionplandemanda
        INNER JOIN mod_planificacion.dat_entidadmodelo em ON d.identidadmodelo =
      em.identidadmodelo
       INNER JOIN mod_datosmaestros.nom_indicador ind ON d.idindicador =
        ind.idindicador
       INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
        ind.idindicador
        INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
  where s.iddesviacionplandemanda is null AND
        em.identidad IN ($entidades) AND
        ip.nivelplanif = 1 AND
        ip.idaprobacion = 4 AND
        d.idejercicio = {$parametros['idejercicio']} AND
        mod.tipoplan={$parametros['uri']}
        $addwhere
        {$parametros['addcondicion']}
  GROUP BY d.fechareal, ip.precio,
ip.flete,
ip.contingencia)

SELECT sum(e.adiciontrimestre1)as adiciontrimestre1,
sum(e.adiciontrimestre2) as adiciontrimestre2,
sum(e.adiciontrimestre3) as adiciontrimestre3,
sum(e.adiciontrimestre4) as adiciontrimestre4
FROM adiciones e ";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Gráfica ejecución x entidad x trimestres
    public function graficaEjecucionglobalxentidadsustituirxtrimestre($parametros
    ) {
        $entidades = implode(',', $parametros['identidad']);
        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $comillas = "'";
        $conn = Doctrine_Manager::connection();
        $varconst = "(ip.precio*SUM(COALESCE(d.cantidadreal, 0))) +
                 (((ip.precio*SUM(COALESCE(d.cantidadreal, 0)))*ip.flete)/100) + (((ip.precio*
                 SUM(COALESCE(d.cantidadreal, 0)))*ip.contingencia)/100)";
        $sql = "--adiciones por trimestre
WITH
sustituciones AS (
SELECT CASE
         WHEN EXTRACT(QUARTER
FROM d.fechareal) = 1 THEN $varconst
         ELSE 0
       END as sustituciontrimestre1,
     CASE
       WHEN EXTRACT(QUARTER
FROM d.fechareal) = 2 THEN $varconst
       ELSE 0
     END as sustituciontrimestre2,
     CASE
       WHEN EXTRACT(QUARTER
FROM d.fechareal) = 3 THEN $varconst
       ELSE 0
     END as sustituciontrimestre3,
     CASE
       WHEN EXTRACT(QUARTER
FROM d.fechareal) = 4 THEN $varconst
       ELSE 0
     END as sustituciontrimestre4
FROM mod_planificacion.dat_desviacionplandemanda d
     INNER JOIN mod_planificacion.dat_desviacionplanxsustituciondemanda s ON
      d.iddesviacionplandemanda = s.iddesviacionplandemanda
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON d.identidadmodelo =
      em.identidadmodelo
     INNER JOIN mod_datosmaestros.nom_indicador ind ON d.idindicador =
      ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
      ind.idindicador
      INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
where em.identidad IN ($entidades) AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      d.idejercicio = {$parametros['idejercicio']} AND
      mod.tipoplan={$parametros['uri']}
      $addwhere
      {$parametros['addcondicion']}
GROUP BY d.fechareal,ip.precio,
ip.flete,
ip.contingencia)

SELECT sum(e.sustituciontrimestre1) as sustituciontrimestre1,
       sum(e.sustituciontrimestre2) as sustituciontrimestre2,
       sum(e.sustituciontrimestre3) as sustituciontrimestre3,
       sum(e.sustituciontrimestre4) as sustituciontrimestre4
FROM sustituciones e
 ";
        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Gráfica ejecución x entidad x meses
    public function graficaEjecucionglobalxentidadejecutadoxmeses($parametros) {
        $entidades = implode(',', $parametros['identidad']);


        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $comillas = "'";
        $conn = Doctrine_Manager::connection();
        $varconst = "(p.precio*SUM(COALESCE(ce.cantidadreal, 0))) +
                 (((p.precio*SUM(COALESCE(ce.cantidadreal, 0)))*ip.flete)/100) + (((p.precio*
                 SUM(COALESCE(ce.cantidadreal, 0)))*ip.contingencia)/100)";
        $sql = "--ejecutado por meses
WITH
ejecutado AS (
SELECT CASE
         WHEN EXTRACT(MONTH
FROM ce.fechareal) = 1 THEN $varconst
         ELSE 0
       END as ejecutadoenero,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 2 THEN $varconst
       ELSE 0
     END as ejecutadofebrero,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 3 THEN $varconst
       ELSE 0
     END as ejecutadomarzo,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 4 THEN $varconst
       ELSE 0
     END as ejecutadoabril,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 5 THEN $varconst
       ELSE 0
     END as ejecutadomayo,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 6 THEN $varconst
       ELSE 0
     END as ejecutadojunio,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 7 THEN $varconst
       ELSE 0
     END as ejecutadojulio,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 8 THEN $varconst
       ELSE 0
     END as ejecutadoagosto,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 9 THEN $varconst
       ELSE 0
     END as ejecutadoseptiembre,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 10 THEN $varconst
       ELSE 0
     END as ejecutadooctubre,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 11 THEN $varconst
       ELSE 0
     END as ejecutadonoviembre,
     CASE
       WHEN EXTRACT(MONTH
FROM ce.fechareal) = 12 THEN $varconst
       ELSE 0
     END as ejecutadodiciembre
FROM mod_planificacion.dat_planificacion p
     INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador =
      ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
      ind.idindicador
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo =
      em.identidadmodelo
     LEFT JOIN mod_planificacion.dat_controlejecucionplandemanda ce ON
      p.idplanificacion = ce.idplanificacion
      INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
where em.identidad IN ($entidades) AND
      --em.idmodelo = AND
      p.idejercicio = {$parametros['idejercicio']} AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      p.idaprobaciondemanda = 4 AND
      mod.tipoplan={$parametros['uri']}
      $addwhere
GROUP BY ce.fechareal,p.precio,
ip.flete,
ip.contingencia)

SELECT sum(e.ejecutadoenero) as ejecutadoenero,
       sum(e.ejecutadofebrero) as ejecutadofebrero,
       sum(e.ejecutadomarzo) as ejecutadomarzo,
       sum(e.ejecutadoabril) as ejecutadoabril,
       sum(e.ejecutadomayo) as ejecutadomayo,
       sum(e.ejecutadojunio) as ejecutadojunio,
       sum(e.ejecutadojulio) as ejecutadojulio,
       sum(e.ejecutadoagosto) as ejecutadoagosto,
       sum(e.ejecutadoseptiembre) as ejecutadoseptiembre,
       sum(e.ejecutadooctubre) as ejecutadooctubre,
       sum(e.ejecutadonoviembre) as ejecutadonoviembre,
       sum(e.ejecutadodiciembre) as ejecutadodiciembre
FROM ejecutado e";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Gráfica ejecución x entidad x meses
    public function graficaEjecucionglobalxentidadsustituirxmeses($parametros) {
        $entidades = implode(',', $parametros['identidad']);


        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $comillas = "'";
        $conn = Doctrine_Manager::connection();
        $varconst = "(ip.precio*SUM(COALESCE(d.cantidadreal, 0))) +
                 (((ip.precio*SUM(COALESCE(d.cantidadreal, 0)))*ip.flete)/100) + (((ip.precio*
                 SUM(COALESCE(d.cantidadreal, 0)))*ip.contingencia)/100)";
        $sql = "--sustituciones por meses
WITH
sustituciones AS (
SELECT CASE
         WHEN EXTRACT(MONTH
FROM d.fechareal) = 1 THEN $varconst
         ELSE 0
       END as sustitucionenero,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 2 THEN $varconst
       ELSE 0
     END as sustitucionfebrero,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 3 THEN $varconst
       ELSE 0
     END as sustitucionmarzo,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 4 THEN $varconst
       ELSE 0
     END as sustitucionabril,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 5 THEN $varconst
       ELSE 0
     END as sustitucionmayo,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 6 THEN $varconst
       ELSE 0
     END as sustitucionjunio,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 7 THEN $varconst
       ELSE 0
     END as sustitucionjulio,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 8 THEN $varconst
       ELSE 0
     END as sustitucionagosto,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 9 THEN $varconst
       ELSE 0
     END as sustitucionseptiembre,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 10 THEN $varconst
       ELSE 0
     END as sustitucionoctubre,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 11 THEN $varconst
       ELSE 0
     END as sustitucionnoviembre,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 12 THEN $varconst
       ELSE 0
     END as sustituciondiciembre
FROM mod_planificacion.dat_desviacionplandemanda d
     INNER JOIN mod_planificacion.dat_desviacionplanxsustituciondemanda s ON
      d.iddesviacionplandemanda = s.iddesviacionplandemanda
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON d.identidadmodelo =
      em.identidadmodelo
     INNER JOIN mod_datosmaestros.nom_indicador ind ON d.idindicador =
      ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
      ind.idindicador
      INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
where em.identidad IN ($entidades) AND
      --em.idmodelo =  AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      d.idejercicio = {$parametros['idejercicio']} AND
       mod.tipoplan={$parametros['uri']}
      $addwhere
GROUP BY d.fechareal, ip.precio,
ip.flete,
ip.contingencia)

SELECT sum(e.sustitucionenero) as sustitucionenero,
       sum(e.sustitucionfebrero) as sustitucionfebrero,
       sum(e.sustitucionmarzo) as sustitucionmarzo,
       sum(e.sustitucionabril) as sustitucionabril,
       sum(e.sustitucionmayo) as sustitucionmayo,
       sum(e.sustitucionjunio) as sustitucionjunio,
       sum(e.sustitucionjulio) as sustitucionjulio,
       sum(e.sustitucionagosto) as sustitucionagosto,
       sum(e.sustitucionseptiembre) as sustitucionseptiembre,
       sum(e.sustitucionoctubre) as sustitucionoctubre,
       sum(e.sustitucionnoviembre) as sustitucionnoviembre,
       sum(e.sustituciondiciembre) as sustituciondiciembre
FROM sustituciones e";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Gráfica ejecución x entidad x meses
    public function graficaEjecucionglobalxentidadadicionadoxmeses($parametros) {
        $entidades = implode(',', $parametros['identidad']);


        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $comillas = "'";
        $conn = Doctrine_Manager::connection();
        $varconst = "(ip.precio*SUM(COALESCE(d.cantidadreal, 0))) +
                 (((ip.precio*SUM(COALESCE(d.cantidadreal, 0)))*ip.flete)/100) + (((ip.precio*
                 SUM(COALESCE(d.cantidadreal, 0)))*ip.contingencia)/100)";
        $sql = "--adiciones por meses
WITH
adiciones AS (
SELECT CASE
         WHEN EXTRACT(MONTH
FROM d.fechareal) = 1 THEN $varconst
         ELSE 0
       END as adicionenero,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 2 THEN $varconst
       ELSE 0
     END as adicionfebrero,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 3 THEN $varconst
       ELSE 0
     END as adicionmarzo,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 4 THEN $varconst
       ELSE 0
     END as adicionabril,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 5 THEN $varconst
       ELSE 0
     END as adicionmayo,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 6 THEN $varconst
       ELSE 0
     END as adicionjunio,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 7 THEN $varconst
       ELSE 0
     END as adicionjulio,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 8 THEN $varconst
       ELSE 0
     END as adicionagosto,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 9 THEN $varconst
       ELSE 0
     END as adicionseptiembre,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 10 THEN $varconst
       ELSE 0
     END as adicionoctubre,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 11 THEN $varconst
       ELSE 0
     END as adicionnoviembre,
     CASE
       WHEN EXTRACT(MONTH
FROM d.fechareal) = 12 THEN $varconst
       ELSE 0
     END as adiciondiciembre
FROM mod_planificacion.dat_desviacionplandemanda d
     LEFT JOIN mod_planificacion.dat_desviacionplanxsustituciondemanda s ON
      d.iddesviacionplandemanda = s.iddesviacionplandemanda
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON d.identidadmodelo =
      em.identidadmodelo
     INNER JOIN mod_datosmaestros.nom_indicador ind ON d.idindicador =
      ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
      ind.idindicador
      INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
where s.iddesviacionplandemanda is null AND
      em.identidad IN ($entidades) AND
      --em.idmodelo = AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      d.idejercicio = {$parametros['idejercicio']}
      AND  mod.tipoplan={$parametros['uri']}
      $addwhere
GROUP BY d.fechareal, ip.precio,
ip.flete,
ip.contingencia)

SELECT sum(e.adicionenero) as adicionenero,
       sum(e.adicionfebrero) as adicionfebrero,
       sum(e.adicionmarzo) as adicionmarzo,
       sum(e.adicionabril) as adicionabril,
       sum(e.adicionmayo) as adicionmayo,
       sum(e.adicionjunio) as adicionjunio,
       sum(e.adicionjulio) as adicionjulio,
       sum(e.adicionagosto) as adicionagosto,
       sum(e.adicionseptiembre) as adicionseptiembre,
       sum(e.adicionoctubre) as adicionoctubre,
       sum(e.adicionnoviembre) as adicionnoviembre,
       sum(e.adiciondiciembre) as adiciondiciembre
FROM adiciones e";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Indicadores ejecutados más valiosos
    public function graficaIndicadoresMasEjecutados($parametros) {
        $entidades = implode(',', $parametros['identidad']);


        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $comillas = "'";
        $conn = Doctrine_Manager::connection();
        $sql = "
            --los indicadores mas ejecutados (por cantidad)
WITH consulta AS
(SELECT ind.idindicador,
        ind.denominacion,

        sum((cantidad + ajuste)) as plan,

        COALESCE(sum(ce.cantidadreal), 0) as
         ejecutado

 FROM mod_planificacion.dat_planificacion p
      INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador =
       ind.idindicador
      INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
       ind.idindicador
      INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo =
       em.identidadmodelo
      LEFT JOIN mod_planificacion.dat_controlejecucionplandemanda ce ON
       p.idplanificacion = ce.idplanificacion
       INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
 where em.identidad IN ($entidades) AND
       p.idejercicio = {$parametros['idejercicio']} AND
       ip.nivelplanif = 1 AND
       ip.idaprobacion = 4 AND
       p.idaprobaciondemanda = 4
       AND mod.tipoplan = {$parametros['uri']}
       $addwhere
 GROUP BY ind.idindicador,
          ind.denominacion)

SELECT c.idindicador,
       c.denominacion,
       c.plan,
       c.ejecutado
from consulta c
ORDER BY c.ejecutado {$parametros['orden']}
Limit 10 ";


        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Gráfica ejecución x entidad x vías de adquisición
    public function graficaEjecucionglobalxentidadxVA($parametros) {
        $entidades = implode(',', $parametros['identidad']);


        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        $conn = Doctrine_Manager::connection();
        $sql = "--Ejecución por VA x planes de gastos
WITH desviacionsust AS (
SELECT

(ip.precio*SUM(COALESCE(d.cantidadreal, 0))) +
                 (((ip.precio*SUM(COALESCE(d.cantidadreal, 0)))*ip.flete)/100) + (((ip.precio*
                 SUM(COALESCE(d.cantidadreal, 0)))*ip.contingencia)/100) as sustituciones,

       d.identidadmodelo
FROM mod_planificacion.dat_desviacionplandemanda d
     INNER JOIN mod_planificacion.dat_desviacionplanxsustituciondemanda s ON
      d.iddesviacionplandemanda = s.iddesviacionplandemanda
     INNER JOIN mod_datosmaestros.nom_indicador ind ON d.idindicador =
      ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
      ind.idindicador
where ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      d.idejercicio = {$parametros['idejercicio']}
      $addwhere
GROUP BY d.identidadmodelo,ip.precio,
ip.flete,
ip.contingencia),
  desviacionadicion AS (

  SELECT

  (ip.precio*SUM(COALESCE(d.cantidadreal, 0))) +
                 (((ip.precio*SUM(COALESCE(d.cantidadreal, 0)))*ip.flete)/100) + (((ip.precio*
                 SUM(COALESCE(d.cantidadreal, 0)))*ip.contingencia)/100) as adiciones,

         d.identidadmodelo
  FROM mod_planificacion.dat_desviacionplandemanda d
       LEFT JOIN mod_planificacion.dat_desviacionplanxsustituciondemanda s ON
        d.iddesviacionplandemanda = s.iddesviacionplandemanda
       INNER JOIN mod_datosmaestros.nom_indicador ind ON d.idindicador =
        ind.idindicador
       INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
        ind.idindicador
  where s.iddesviacionplandemanda is null AND
        ip.nivelplanif = 1 AND
        ip.idaprobacion = 4 AND
        d.idejercicio = {$parametros['idejercicio']}
        $addwhere
  GROUP BY d.identidadmodelo,ip.precio,
ip.flete,
ip.contingencia)

SELECT via.denominacion as viaadquisicion,

      (SUM((p.cantidad+p.ajuste)*p.precio))+
                 (((SUM((p.cantidad+p.ajuste)*p.precio*ip.flete)))/100) + (((
                 SUM((p.cantidad+p.ajuste)*p.precio*ip.contingencia)))/100) as importeplan,

        (SUM(p.precio*COALESCE(ce.cantidadreal, 0))) +
                 (((SUM(p.precio*COALESCE(ce.cantidadreal, 0)*ip.flete)))/100) + (((
                 SUM(p.precio*COALESCE(ce.cantidadreal, 0)*ip.contingencia)))/100)  as
        importeejecutado,

       COALESCE(sum(d.sustituciones), 0) as importesustitucion,
       COALESCE(sum(a.adiciones), 0) as importeadicion,

       (((SUM(p.precio*COALESCE(ce.cantidadreal, 0))) +
                 (((SUM(p.precio*COALESCE(ce.cantidadreal, 0)*ip.flete)))/100) + (((
                 SUM(p.precio*COALESCE(ce.cantidadreal, 0)*ip.contingencia)))/100)) + COALESCE(
       sum(d.sustituciones), 0) + COALESCE(sum(a.adiciones), 0)) as
        importetotalejecutado


FROM mod_planificacion.dat_planificacion p
     INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador =
      ind.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
      ind.idindicador
     INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iv ON
      ip.idindicador = iv.idindicador
     INNER JOIN mod_datosmaestros.nom_viaadquisicion via ON iv.idviaadquisicion
      = via.idviaadquisicion
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo =
      em.identidadmodelo
     INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
     LEFT JOIN mod_planificacion.dat_controlejecucionplandemanda ce ON
      p.idplanificacion = ce.idplanificacion
     LEFT JOIN desviacionsust d ON (em.identidadmodelo = d.identidadmodelo)
     LEFT JOIN desviacionadicion a ON (em.identidadmodelo = a.identidadmodelo)
where em.identidad IN ($entidades) AND
      p.idejercicio = {$parametros['idejercicio']} AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4 AND
      p.idaprobaciondemanda = 4 AND
      mod.tipoplan=0
      $addwhere
GROUP BY via.denominacion";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Indicadores fuera de plan más valiosos(adiciones)
    public function graficaIndicadoresFueraPlanMasValiosos($parametros) {
        $entidades = implode(',', $parametros['identidad']);
        $comillas = "'";


        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }

        $conn = Doctrine_Manager::connection();
        $sql = "  SELECT ind.idindicador,
         ind.denominacion,
         (ip.precio*SUM(COALESCE(d.cantidadreal, 0))) +
                 (((ip.precio*SUM(COALESCE(d.cantidadreal, 0)))*ip.flete)/100) + (((ip.precio*
                 SUM(COALESCE(d.cantidadreal, 0)))*ip.contingencia)/100) as adiciones

  FROM mod_planificacion.dat_desviacionplandemanda d
       LEFT JOIN mod_planificacion.dat_desviacionplanxsustituciondemanda s ON
        d.iddesviacionplandemanda = s.iddesviacionplandemanda
       INNER JOIN mod_datosmaestros.nom_indicador ind ON d.idindicador =
        ind.idindicador
       INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
        ind.idindicador
       INNER JOIN mod_planificacion.dat_entidadmodelo em ON d.identidadmodelo =
        em.identidadmodelo
        INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
  where s.iddesviacionplandemanda is null AND
        ip.nivelplanif = 1 AND
        ip.idaprobacion = 4 AND
        d.idejercicio = {$parametros['idejercicio']} AND
        em.identidad IN ($entidades)
        AND mod.tipoplan = {$parametros['uri']}
        $addwhere
  GROUP BY ind.idindicador, ip.precio,
ip.flete,
ip.contingencia
  ORDER BY adiciones DESC
  LIMIT 10";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //Gráfica ejecución de indicadores más valiosos
    public function graficaEjecucionMasValiosos($parametros) {
        $entidades = implode(',', $parametros['identidad']);

        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                $addwhere = 'AND ind.estado= 1';
            }
        }
        $comillas = "'";
        $conn = Doctrine_Manager::connection();
        $sql = "WITH consulta AS
(SELECT ind.idindicador,
        ind.denominacion,

         (p.precio*SUM((p.cantidad+p.ajuste))) +
                 (((p.precio*SUM((p.cantidad+p.ajuste)))*ip.flete)/100) + (((p.precio*
                 SUM((p.cantidad+p.ajuste)))*ip.contingencia)/100) as importeplan,

                 (p.precio*SUM(COALESCE(ce.cantidadreal, 0))) +
                 (((p.precio*SUM(COALESCE(ce.cantidadreal, 0)))*ip.flete)/100) + (((p.precio*
                 SUM(COALESCE(ce.cantidadreal, 0)))*ip.contingencia)/100) as
         importeejecutado

 FROM mod_planificacion.dat_planificacion p
      INNER JOIN mod_datosmaestros.nom_indicador ind ON p.idindicador =
       ind.idindicador
      INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
       ind.idindicador
      INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo =
       em.identidadmodelo
      LEFT JOIN mod_planificacion.dat_controlejecucionplandemanda ce ON
       p.idplanificacion = ce.idplanificacion
       INNER JOIN mod_planificacion.dat_modelo mod ON em.idmodelo = mod.idmodelo
 where em.identidad IN ($entidades) AND
       p.idejercicio = {$parametros['idejercicio']} AND
       ip.nivelplanif = 1 AND
       ip.idaprobacion = 4 AND
       p.idaprobaciondemanda = 4
       AND mod.tipoplan = {$parametros['uri']}
       $addwhere
 GROUP BY ind.idindicador,
          ind.denominacion,p.precio,
ip.flete,
ip.contingencia)

SELECT c.idindicador,
       c.denominacion,
       c.importeplan,
       c.importeejecutado
from consulta c
ORDER BY c.importeejecutado DESC
Limit 10
      ";

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

}
