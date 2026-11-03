<?php

class DatAjusteexistencia extends BaseDatAjusteexistencia {

    public function setUp() {
        parent::setUp();
    }

    private function addWhereConParams(&$where, &$arrayParams, $columCond, $param
    ) {
        $where .= " AND " . $columCond;
        $arrayParams[] = $param;
    }

    private function addWhereSinParams(&$where, $columCond) {
        $where .= " AND " . $columCond;
    }

    public function existe_ccc($obj) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT  *
            FROM mod_planificacion.dat_ajusteexistencia  mae
            WHERE mae.idindicador = " . $obj->idindicador
                . " AND mae.identidad = " . $obj->identidad . "
                AND mae.idejercicio= " . $obj->idejercicio . " ";

        $res = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);

        if ($res != null) {
            return '0';
        } else {
            return '21';
        }
    }

    public function obtenerIdajusteexistencia($idindicador, $identidad, $idejercicio
    ) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "SELECT  mae.idajusteexistencia
            FROM mod_planificacion.dat_ajusteexistencia  mae
            WHERE mae.idindicador = " . $idindicador . " AND mae.identidad = "
                . $identidad . " AND mae.idejercicio= " . $idejercicio . " ";

        $res = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $res[0]['idajusteexistencia'];
    }

    public function calcularajustesdados($idindicador, $identidad, $idejercicio) {
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "Select COALESCE((COALESCE(SUM (odcte.cpe),0) +
COALESCE(SUM (daecb.coberturaparcialestimada),0)),0) as cantidad
from mod_planificacion.dat_ajusteexistencia dae
left join mod_planificacion.dat_ajusteexistenciacb daecb on dae.identidad = daecb.identidad
and dae.idindicador = daecb.idindicador and daecb.idejercicio = dae.idejercicio
left join mod_planificacion.dat_odcte  odcte on dae.identidad = odcte.identidad
and dae.idindicador = odcte.idindicador and odcte.idejercicio = dae.idejercicio
where dae.idindicador=" . $idindicador . " and dae.identidad = " . $identidad
                . " and dae.idejercicio = " . $idejercicio . " ";

        $res = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_ASSOC);
        return $res[0]['cantidad'];
    }

    public function consultaDoce($queryTotal, $parametros) {
        return $queryTotal->Select('COUNT(daex.idindicador)')
                        ->from('DatAjusteexistencia daex')
                        ->leftjoin(' daex.DatAjusteexistenciaod daexod')
                        ->innerJoin('daexod.DatEntidadmodelo em')
                        ->leftJoin(' daex.NomIndicador nomin')
                        ->leftJoin(' nomin.NomIndicadorplanif nominpnif')
                        ->leftJoin(' nomin.DatIndicadorcentrobalance dicb')
                        ->leftJoin(' dicb.DatEntidaddatosnomenclador dedn')
                        ->addwhere(
                                ' daex.identidad=? AND em.identidad = ? AND em.idmodelo =?
                     AND daex.idejercicio =? ', array($parametros['identidadOD'],
                            $parametros['identidadlogueada'],
                            $parametros['idmodelo'], 1)
                        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
    }

    //FIN DE LA FUNCIONALDIAD PARA OBTENER LOS DATOS A EXPORTAR COMO CB SIN CHECK AJUSTAR


    /* public function listarIndicadoresAjusteCB($start, $limit, $parametros)
      {
      $query = new Doctrine_Query();
      $queryTotal = new Doctrine_Query();

      if ($parametros['filtros']) {
      foreach ($parametros['filtros'] as $p => $s) {

      if ($s != null) {
      if ($p == 'codigo') {
      $query->addWhere("nomin.codigo  LIKE ? ", ("$s%"));
      $queryTotal->addWhere("nomin.codigo  LIKE ? ", ("$s%"));
      } elseif ($p == 'denominacion') {
      $query->addWhere(
      "upper(nomin.denominacion)  LIKE ? ",
      ("%" . strtoupper($s) . "%")
      );
      $queryTotal->addWhere(
      "upper(nomin.denominacion)  LIKE ? ",
      ("%" . strtoupper($s) . "%")
      );
      } elseif ($p == 'numeropieza') {
      $query->addWhere(
      "upper(nomin.numeropieza)  LIKE ? ",
      ("%" . strtoupper($s) . "%")
      );
      $queryTotal->addWhere(
      "upper(nomin.numeropieza)  LIKE ? ",
      ("%" . strtoupper($s) . "%")
      );
      } elseif ($p == 'precio_condicion1'
      || $p == 'precio_condicion2'
      || $p == 'precio_condicion3'
      ) {
      $query->addWhere(
      "nominpnif.precio " . $s['condicion'] . " ? ",
      $s['precio']
      );
      $queryTotal->addWhere(
      "nominpnif.precio " . $s['condicion'] . " ? ",
      $s['precio']
      );
      } elseif ($p == 'denominacioncb') {
      $entidaddatosnom
      = DatEntidaddatosnomenclador::getIdDatosNom($s);
      $query->addWhere(
      'dicb.identidaddatosnomenclador =?',
      $entidaddatosnom[0]['identidaddatosnomenclador']
      );
      $queryTotal->addWhere(
      'dicb.identidaddatosnomenclador =?',
      $entidaddatosnom[0]['identidaddatosnomenclador']
      );
      } elseif ($p == 'necesidad_condicion1'
      || $p == 'necesidad_condicion2'
      || $p == 'necesidad_condicion3'
      ) {
      $query->addWhere(
      "daexcb.necesidad " . $s['condicion'] . " ? ",
      $s['necesidad']
      );
      $queryTotal->addWhere(
      "daexcb.necesidad " . $s['condicion'] . " ? ",
      $s['necesidad']
      );
      } elseif ($p == 'coberturaparcialestimada_condicion1'
      || $p == 'coberturaparcialestimada_condicion2'
      || $p == 'coberturaparcialestimada_condicion3'
      ) {
      $query->addWhere(
      "daexcb.coberturaparcialestimada " . $s['condicion']
      . " ? ", $s['coberturaparcialestimada']
      );
      $queryTotal->addWhere(
      "daexcb.coberturaparcialestimada " . $s['condicion']
      . " ? ", $s['coberturaparcialestimada']
      );
      } elseif ($p == 'importe_condicion1'
      || $p == 'importe_condicion2'
      || $p == 'importe_condicion3'
      ) {
      $query->addWhere(
      "daexcb.importedemanda " . $s['condicion'] . " ? ",
      $s['importe']
      );
      $queryTotal->addWhere(
      "daexcb.importedemanda " . $s['condicion'] . " ? ",
      $s['importe']
      );
      } else {
      if ($p == 'idaprobacionsi') {
      $query->addWhere("daexcb.idaprobacion > 2");
      $queryTotal->addWhere("daexcb.idaprobacion > 2");
      } else {
      if ($p == 'idaprobacionno') {
      $query->addWhere("daexcb.idaprobacion <= 2 ");
      $queryTotal->addWhere(
      "daexcb.idaprobacion <= 2 "
      );
      } elseif ($p == 'demanda_condicion1'
      || $p == 'demanda_condicion2'
      || $p == 'demanda_condicion3'
      ) {
      $query->addWhere(
      "daexcb.demanda " . $s['condicion'] . " ? ",
      $s['demanda']
      );
      $queryTotal->addWhere(
      "daexcb.demanda " . $s['condicion'] . " ? ",
      $s['demanda']
      );
      }
      }
      }
      }
      }
      }

      $res = self::consultaTrece($query, $parametros, $start, $limit);

      $total = self::consultaCatorce($queryTotal, $parametros);

      $res[20]['total'] = $total[0]['COUNT'];

      $importe = self::importe($queryTotal, $parametros);

      $res[21]['importetotal'] = $importe[0]['importetotal'];
      return $res;
      } */

    /* public function consultaTrece($query, $parametros, $start, $limit)
      {
      return $query->Select(
      'daex.idindicador,daex.coberturatotalestimada,daexcb.idaprobacion,
      daex.idejercicio,nomin.codigo,nomin.denominacion,nomin.numeropieza,nominpnif.precio,
      dedn.identidad as identidadcb,dicb.identidaddatosnomenclador,
      daexcb.necesidad,daexcb.coberturaparcialestimada,
      daexcb.reservaministerial,daexcb.cantidadeconomia,daexcb.demanda,
      (daexcb.demanda*nominpnif.precio) as importe,
      daexcb.ajustenivelactividadpos,daexcb.ajustenivelactividadneg,
      daexcb.identidadmodelo'
      )->from('DatAjusteexistencia daex')
      ->innerJoin(' daex.DatAjusteexistenciacb daexcb')
      ->innerJoin(' daexcb.DatEntidadmodelo em')
      ->innerJoin(' daex.NomIndicador nomin')
      ->innerJoin(' nomin.NomIndicadorplanif nominpnif')
      ->innerJoin(' nomin.DatIndicadorcentrobalance dicb')
      ->innerJoin(' dicb.DatEntidaddatosnomenclador dedn')
      ->addwhere(
      ' daex.identidad=?   AND em.idmodelo=? AND dicb.identidaddatosnomenclador =?
      AND daex.idejercicio =? AND daexcb.necesidad > 0 ',
      array($parametros['identidadlogueada'], $parametros['idmodelo'],
      $parametros['identidaddatosnomenclador'], 1)
      )->orderby(' nomin.codigo')->offset($start)->limit($limit)
      ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
      }
     */
    public function consultaCatorce($queryTotal, $parametros) {
        return $queryTotal->Select('COUNT(daex.idindicador)')
                        ->from('DatAjusteexistencia daex')
                        ->leftjoin(' daex.DatAjusteexistenciacb daexcb')
                        ->leftjoin(' daexcb.DatEntidadmodelo em')
                        ->leftjoin(' daex.NomIndicador nomin')
                        ->leftjoin(' nomin.NomIndicadorplanif nominpnif')
                        ->leftjoin(' nomin.DatIndicadorcentrobalance dicb')
                        ->leftjoin(' dicb.DatEntidaddatosnomenclador dedn')
                        ->addwhere(
                                ' daex.identidad=? AND em.identidad=?  AND em.idmodelo=?
                AND dicb.identidaddatosnomenclador =?  AND daex.idejercicio =?
                AND daexcb.necesidad > 0', array($parametros['identidadlogueada'],
                            $parametros['identidadlogueada'], $parametros['idmodelo'],
                            $parametros['identidaddatosnomenclador'], 1)
                        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
    }

    /* public function importe($queryTotal, $parametros)
      {
      return $queryTotal->Select(
      'SUM(daexcb.demanda*nominpnif.precio) as importetotal'
      )->from('DatAjusteexistencia daex')
      ->leftjoin(' daex.DatAjusteexistenciacb daexcb')
      ->leftjoin(' daexcb.DatEntidadmodelo em')
      ->leftjoin(' daex.NomIndicador nomin')
      ->leftjoin(' nomin.NomIndicadorplanif nominpnif')
      ->leftjoin(' nomin.DatIndicadorcentrobalance dicb')
      ->leftjoin(' dicb.DatEntidaddatosnomenclador dedn')
      ->addwhere(
      ' daex.identidad=? AND em.identidad=?  AND em.idmodelo=?
      AND dicb.identidaddatosnomenclador =?  AND daex.idejercicio =?
      AND daexcb.necesidad > 0',
      array($parametros['identidadlogueada'],
      $parametros['identidadlogueada'], $parametros['idmodelo'],
      $parametros['identidaddatosnomenclador'], 1)
      )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
      } */

    //FUNCIONALIDAD PARA OBTENER LOS DATOS A EXPORTAR CON CHECK AJUSTAR SELECCIONADO

    /* public function listarExportarIndicadoresAjusteCB($start, $limit,
      $parametros, $count
      )
      {

      $query = new Doctrine_Query();
      $queryTotal = new Doctrine_Query();

      if ($parametros['filtros']) {
      foreach ($parametros['filtros'] as $p => $s) {

      if ($s != null) {
      if ($p == 'codigo') {
      $query->addWhere("nomin.codigo  LIKE ? ", ("$s%"));
      $queryTotal->addWhere("nomin.codigo  LIKE ? ", ("$s%"));
      } elseif ($p == 'denominacion') {
      $query->addWhere(
      "upper(nomin.denominacion)  LIKE ? ",
      ("%" . strtoupper($s) . "%")
      );
      $queryTotal->addWhere(
      "upper(nomin.denominacion)  LIKE ? ",
      ("%" . strtoupper($s) . "%")
      );
      } elseif ($p == 'numeropieza') {
      $query->addWhere(
      "upper(nomin.numeropieza)  LIKE ? ",
      ("%" . strtoupper($s) . "%")
      );
      $queryTotal->addWhere(
      "upper(nomin.numeropieza)  LIKE ? ",
      ("%" . strtoupper($s) . "%")
      );
      } elseif ($p == 'precio_condicion1'
      || $p == 'precio_condicion2'
      || $p == 'precio_condicion3'
      ) {
      $query->addWhere(
      "nominpnif.precio " . $s['condicion'] . " ? ",
      $s['precio']
      );
      $queryTotal->addWhere(
      "nominpnif.precio " . $s['condicion'] . " ? ",
      $s['precio']
      );
      } elseif ($p == 'denominacioncb') {
      $entidaddatosnom
      = DatEntidaddatosnomenclador::getIdDatosNom($s);
      $query->addWhere(
      'dicb.identidaddatosnomenclador =?',
      $entidaddatosnom[0]['identidaddatosnomenclador']
      );
      $queryTotal->addWhere(
      'dicb.identidaddatosnomenclador =?',
      $entidaddatosnom[0]['identidaddatosnomenclador']
      );
      } elseif ($p == 'necesidad_condicion1'
      || $p == 'necesidad_condicion2'
      || $p == 'necesidad_condicion3'
      ) {
      $query->addWhere(
      "daexcb.necesidad " . $s['condicion'] . " ? ",
      $s['necesidad']
      );
      $queryTotal->addWhere(
      "daexcb.necesidad " . $s['condicion'] . " ? ",
      $s['necesidad']
      );
      } elseif ($p == 'coberturaparcialestimada_condicion1'
      || $p == 'coberturaparcialestimada_condicion2'
      || $p == 'coberturaparcialestimada_condicion3'
      ) {
      $query->addWhere(
      "daexcb.coberturaparcialestimada " . $s['condicion']
      . " ? ", $s['coberturaparcialestimada']
      );
      $queryTotal->addWhere(
      "daexcb.coberturaparcialestimada " . $s['condicion']
      . " ? ", $s['coberturaparcialestimada']
      );
      } elseif ($p == 'importe_condicion1'
      || $p == 'importe_condicion2'
      || $p == 'importe_condicion3'
      ) {
      $query->addWhere(
      "daexcb.importedemanda " . $s['condicion'] . " ? ",
      $s['importe']
      );
      $queryTotal->addWhere(
      "daexcb.importedemanda " . $s['condicion'] . " ? ",
      $s['importe']
      );
      } else {
      if ($p == 'idaprobacionsi') {
      $query->addWhere("daexcb.idaprobacion > 2");
      $queryTotal->addWhere("daexcb.idaprobacion > 2");
      } else {
      if ($p == 'idaprobacionno') {
      $query->addWhere("daexcb.idaprobacion <= 2 ");
      $queryTotal->addWhere(
      "daexcb.idaprobacion <= 2 "
      );
      } elseif ($p == 'demanda_condicion1'
      || $p == 'demanda_condicion2'
      || $p == 'demanda_condicion3'
      ) {
      $query->addWhere(
      "daexcb.demanda " . $s['condicion'] . " ? ",
      $s['demanda']
      );
      $queryTotal->addWhere(
      "daexcb.demanda " . $s['condicion'] . " ? ",
      $s['demanda']
      );
      }
      }
      }
      }
      }
      }
      if (!$count) {
      $res = self::consultaQuince($query, $parametros, $start, $limit);
      } else {
      $total = self::totalUno($queryTotal, $parametros);

      $res['total'] = $total[0]['COUNT'];
      }


      return $res;
      } */

    /* public function consultaQuince($query, $parametros, $start, $limit)
      {
      return $query->Select(
      'daex.idindicador,daex.coberturatotalestimada as total,
      daexcb.idaprobacion as idaprob,daex.idejercicio,
      nomin.codigo as codigo,nomin.denominacion as denominacion,
      nomin.numeropieza as numeropieza ,nominpnif.precio,
      dedn.identidad as identidadcb,dicb.identidaddatosnomenclador,
      daexcb.necesidad as necesidad,daexcb.coberturaparcialestimada as coberturaparcialestimada,
      daexcb.reservaministerial,daexcb.cantidadeconomia,
      daexcb.demanda as demanda,(daexcb.demanda*nominpnif.precio) as importe,
      daexcb.ajustenivelactividadpos,daexcb.ajustenivelactividadneg,
      daexcb.identidadmodelo'
      )->from('DatAjusteexistencia daex')
      ->innerJoin(' daex.DatAjusteexistenciacb daexcb')
      ->innerJoin(' daexcb.DatEntidadmodelo em')
      ->innerJoin(' daex.NomIndicador nomin')
      ->innerJoin(' nomin.NomIndicadorplanif nominpnif')
      ->innerJoin(' nomin.DatIndicadorcentrobalance dicb')
      ->innerJoin(' dicb.DatEntidaddatosnomenclador dedn')
      ->addwhere(
      ' daex.identidad=?   AND em.idmodelo=? AND dicb.identidaddatosnomenclador =?
      AND daex.idejercicio =? ',
      array($parametros['identidadlogueada'],
      $parametros['idmodelo'],
      $parametros['identidaddatosnomenclador'], 1)
      )->orderby(' nomin.codigo')->offset($start)->limit($limit)
      ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
      } */

    public function totalUno($queryTotal, $parametros) {
        return $queryTotal->Select('COUNT(daex.idindicador)')
                        ->from('DatAjusteexistencia daex')
                        ->leftjoin(' daex.DatAjusteexistenciacb daexcb')
                        ->leftjoin(' daexcb.DatEntidadmodelo em')
                        ->leftjoin(' daex.NomIndicador nomin')
                        ->leftjoin(' nomin.NomIndicadorplanif nominpnif')
                        ->leftjoin(' nomin.DatIndicadorcentrobalance dicb')
                        ->leftjoin(' dicb.DatEntidaddatosnomenclador dedn')
                        ->addwhere(
                                ' daex.identidad=? AND em.identidad=?  AND em.idmodelo=?
                    AND dicb.identidaddatosnomenclador =?  AND daex.idejercicio =?', array($parametros['identidadlogueada'],
                            $parametros['identidadlogueada'],
                            $parametros['idmodelo'],
                            $parametros['identidaddatosnomenclador'], 1)
                        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
    }

    //FIN FUNCIONALIDAD PARA OBTENER LOS DATOS A EXPORTAR CON CHECK AJUSTAR SELECCIONADO

    /* public function listarIndicadoresVia($start, $limit, $parametros)
      {
      $query = new Doctrine_Query();
      $queryTotal = new Doctrine_Query();
      if ($parametros['filtros']) {
      foreach ($parametros['filtros'] as $p => $s) {
      if ($s != null) {
      if ($p == 'codigo') {
      $query->addWhere("nomin.codigo  LIKE ? ", ("$s%"));
      $queryTotal->addWhere("nomin.codigo  LIKE ? ", ("$s%"));
      } elseif ($p == 'denominacion') {
      $query->addWhere(
      "upper(nomin.denominacion)  LIKE ? ",
      ("%" . strtoupper($s) . "%")
      );
      $queryTotal->addWhere(
      "upper(nomin.denominacion)  LIKE ? ",
      ("%" . strtoupper($s) . "%")
      );
      } elseif ($p == 'numeropieza') {
      $query->addWhere(
      "upper(nomin.numeropieza)  LIKE ? ",
      ("%" . strtoupper($s) . "%")
      );
      $queryTotal->addWhere(
      "upper(nomin.numeropieza)  LIKE ? ",
      ("%" . strtoupper($s) . "%")
      );
      } elseif ($p == 'precio_condicion1'
      || $p == 'precio_condicion2'
      || $p == 'precio_condicion3'
      ) {
      $query->addWhere(
      "nominpnif.precio " . $s['condicion'] . " ? ",
      $s['precio']
      );
      $queryTotal->addWhere(
      "nominpnif.precio " . $s['condicion'] . " ? ",
      $s['precio']
      );
      } elseif ($p == 'denominacioncb') {
      $entidaddatosnom
      = DatEntidaddatosnomenclador::getIdDatosNom($s);
      $query->addWhere(
      'dicb.identidaddatosnomenclador =?',
      $entidaddatosnom[0]['identidaddatosnomenclador']
      );
      $queryTotal->addWhere(
      'dicb.identidaddatosnomenclador =?',
      $entidaddatosnom[0]['identidaddatosnomenclador']
      );
      } elseif ($p == 'importe_condicion1'
      || $p == 'importe_condicion2'
      || $p == 'importe_condicion3'
      ) {
      $query->addWhere(
      "daexcb.importedemanda " . $s['condicion'] . " ? ",
      $s['importe']
      );
      $queryTotal->addWhere(
      "daexcb.importedemanda " . $s['condicion'] . " ? ",
      $s['importe']
      );
      } else {
      if ($p == 'idaprobacionsi') {
      $query->addWhere("daexcb.idaprobacion > 2");
      $queryTotal->addWhere("daexcb.idaprobacion > 2");
      } else {
      if ($p == 'idaprobacionno') {
      $query->addWhere("daexcb.idaprobacion <= 2 ");
      $queryTotal->addWhere(
      "daexcb.idaprobacion <= 2 "
      );
      } else {
      if ($p == 'desglosadosi') {

      } else {
      if ($p == 'desglosadono') {

      } else {
      if ($p == 'desglosadop') {

      } elseif ($p == 'demanda_condicion1'
      || $p == 'demanda_condicion2'
      || $p == 'demanda_condicion3'
      ) {
      $query->addWhere(
      "daexcb.demanda "
      . $s['condicion'] . " ? ",
      $s['demanda']
      );
      $queryTotal->addWhere(
      "daexcb.demanda "
      . $s['condicion'] . " ? ",
      $s['demanda']
      );
      } else {
      if ($p == 'idumedida') {

      $query->addWhere(
      "nomin.$p=?", $s
      );
      $queryTotal->addWhere(
      "nomin.$p=?", $s
      );
      }
      }
      }
      }
      }
      }
      }
      }
      }
      }
      if ($parametros['masunavia'] == 0) {
      $res = self::consultaDiezSeis($query, $parametros, $start, $limit);

      $total = self::consultaDiezSiete($queryTotal, $parametros);
      } else {

      $res = $query->Select(
      'daex.idindicador,daexcb.idaprobacion,daex.idejercicio,
      nomin.codigo,nomin.denominacion,nomin.numeropieza,
      nominpnif.precio,nomin.idumedida,
      dedn.identidad as identidadcb,dicb.identidaddatosnomenclador,
      daexcb.necesidad,daexcb.coberturaparcialestimada,
      daexcb.reservaministerial,daexcb.cantidadeconomia,daexcb.demanda,
      (daexcb.demanda*nominpnif.precio) as importe,
      daexcb.ajustenivelactividadpos,daexcb.ajustenivelactividadneg,
      daexcb.identidadmodelo'
      )->from('DatAjusteexistencia daex')
      ->innerJoin(' daex.DatAjusteexistenciacb daexcb')
      ->innerJoin(' daexcb.DatEntidadmodelo em')
      ->innerJoin(' daex.NomIndicador nomin')
      ->innerJoin(' nomin.NomIndicadorplanif nominpnif')
      ->innerJoin(' nomin.DatIndicadorcentrobalance dicb')
      ->innerJoin(' dicb.DatEntidaddatosnomenclador dedn')
      ->addwhere(
      ' daex.identidad=?  AND em.idmodelo=? AND dicb.identidaddatosnomenclador =?
      AND daexcb.idaprobacion >= ? AND daex.idejercicio =?',
      array($parametros['identidad'], $parametros['idmodelo'],
      $parametros['identidaddatosnomenclador'],
      1, 1)
      )
      ->addWhere(
      '(SELECT COUNT(divaos.idindicador)
      FROM DatIndicadorviaadquisicionorganosatisface divaos
      WHERE divaos.idindicador =  nomin.idindicador) > 1'
      )->orderby(' nomin.codigo')->offset($start)->limit($limit)
      ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();


      $total = $queryTotal->Select(
      'sum(daexcb.importedemanda) as importetotal'
      )
      ->from('DatAjusteexistencia daex')
      ->leftjoin(' daex.DatAjusteexistenciacb daexcb')
      ->leftjoin(' daexcb.DatEntidadmodelo em')
      ->leftjoin(' daex.NomIndicador nomin')
      ->leftjoin(' nomin.NomIndicadorplanif nominpnif')
      ->leftjoin(' nomin.DatIndicadorcentrobalance dicb')
      ->leftjoin(' dicb.DatEntidaddatosnomenclador dedn')
      ->addwhere(
      ' daex.identidad=? AND em.identidad=?  AND em.idmodelo=?
      AND dicb.identidaddatosnomenclador =?  AND daex.idejercicio =?',
      array($parametros['identidadlogueada'],
      $parametros['identidadlogueada'],
      $parametros['idmodelo'],
      $parametros['identidaddatosnomenclador'], 1)
      )
      ->addWhere(
      '(SELECT COUNT(divaos.idindicador)
      FROM DatIndicadorviaadquisicionorganosatisface divaos
      WHERE divaos.idindicador =  nomin.idindicador) > 1'
      )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
      }

      $res[20]['total'] = $total[0]['COUNT'];

      return $res;
      } */

    /* public function consultaDiezSeis($query, $parametros, $start, $limit)
      {
      return $query->Select(
      'daex.idindicador,daexcb.idaprobacion,daex.idejercicio,
      nomin.codigo,nomin.denominacion,nomin.numeropieza,nominpnif.precio,nomin.idumedida,
      dedn.identidad as identidadcb,dicb.identidaddatosnomenclador,
      daexcb.necesidad,daexcb.coberturaparcialestimada,
      daexcb.reservaministerial,daexcb.cantidadeconomia,
      daexcb.demanda,(daexcb.demanda*nominpnif.precio) as importe,
      daexcb.ajustenivelactividadpos,daexcb.ajustenivelactividadneg,
      daexcb.identidadmodelo,
      sum(ddvo.cantidad) as cantidad'
      )->from('DatAjusteexistencia daex')
      ->innerJoin(' daex.DatAjusteexistenciacb daexcb')
      ->innerJoin(' daexcb.DatEntidadmodelo em')
      ->leftJoin('daexcb.DatDesgviaadquisorgsat ddvo')
      ->innerJoin(' daex.NomIndicador nomin')
      ->innerJoin(' nomin.NomIndicadorplanif nominpnif')
      ->innerJoin(' nomin.DatIndicadorcentrobalance dicb')
      ->innerJoin(' dicb.DatEntidaddatosnomenclador dedn')
      ->addwhere(
      ' daex.identidad=?  AND em.idmodelo=? AND dicb.identidaddatosnomenclador =?
      AND daexcb.idaprobacion >= ? AND daex.idejercicio =? ',
      array($parametros['identidad'], $parametros['idmodelo'],
      $parametros['identidaddatosnomenclador'],
      1, 1)
      )->addwhere(' daexcb.demanda > 0')
      ->groupby(
      'daex.idindicador, daexcb.idaprobacion, daex.idejercicio,
      nomin.codigo, nomin.denominacion, nomin.numeropieza,
      nominpnif.precio, nomin.idumedida, dedn.identidad,
      dicb.identidaddatosnomenclador, daexcb.necesidad,
      daexcb.coberturaparcialestimada, daexcb.reservaministerial,
      daexcb.cantidadeconomia, daexcb.demanda, daexcb.ajustenivelactividadpos,
      daexcb.ajustenivelactividadneg, daexcb.identidadmodelo,
      daexcb.idajusteexistenciacb, daex.idajusteexistencia,
      nomin.idindicador, dicb.idindicadorcentrobalance'
      )->orderby(' nomin.codigo')->offset($start)->limit($limit)
      ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
      } */

    public function consultaDiezSiete($queryTotal, $parametros) {
        return $queryTotal->Select(
                                'sum(daexcb.importedemanda) as importetotal'
                        )->from('DatAjusteexistencia daex')
                        ->leftjoin(' daex.DatAjusteexistenciacb daexcb')
                        ->leftJoin('daexcb.DatDesgviaadquisorgsat ddvo')
                        ->leftjoin(' daexcb.DatEntidadmodelo em')
                        ->leftjoin(' daex.NomIndicador nomin')
                        ->leftjoin(' nomin.NomIndicadorplanif nominpnif')
                        ->leftjoin(' nomin.DatIndicadorcentrobalance dicb')
                        ->leftjoin(' dicb.DatEntidaddatosnomenclador dedn')
                        ->addwhere(
                                ' daex.identidad=? AND em.identidad=?  AND em.idmodelo=?
                     AND dicb.identidaddatosnomenclador =?  AND daex.idejercicio =?', array($parametros['identidadlogueada'],
                            $parametros['identidadlogueada'],
                            $parametros['idmodelo'],
                            $parametros['identidaddatosnomenclador'], 1)
                        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
    }

    public function idEntidadesXCB($ided) {

        $conn = Doctrine_Manager::connection();
        $sqlQuery = self::consultaSiete($ided);

        $total = $conn->execute($sqlQuery);
        $total = $total->fetchAll(PDO::FETCH_ASSOC);
        foreach ($total as $key => $value) {
            $total[$key] = $value['identidad'];
        }
        return $total;
    }

    public function consultaSiete($ided) {
        $consultaSiete = "SELECT DISTINCT em.identidad
                      FROM mod_planificacion.dat_planificacion d
                      INNER JOIN mod_planificacion.dat_entidadmodelo em
                       ON d.identidadmodelo = em.identidadmodelo
                      INNER JOIN mod_datosmaestros.nom_indicador n ON d.idindicador = n.idindicador
                      INNER JOIN mod_planificacion.dat_indicadorcentrobalance d2
                      ON n.idindicador = d2.idindicador
                      WHERE d2.identidaddatosnomenclador IN  ($ided)
                      GROUP BY em.identidad";
        return $consultaSiete;
    }

    //Devuelve los datos de los indicadores demandados dado un  CB y un modelo($ided)
    public function indsXCB($ided) {
        $arrayParams = array();
        $arrayParams[] = $ided;
        $conn = Doctrine_Manager::connection();
        $sqlQuery = self::consultaOcho();
        $total = $conn->execute($sqlQuery, $arrayParams);
        $total = $total->fetchAll(PDO::FETCH_ASSOC);
        foreach ($total as $key => $value) {
            $total[$key] = $value['identidad'];
        }
        return $total;
    }

    public function consultaOcho() {
        $consultaOcho = "SELECT DISTINCT em.identidad
                      FROM mod_planificacion.dat_planificacion d
                      INNER JOIN mod_planificacion.dat_entidadmodelo em
                      ON d.identidadmodelo = em.identidadmodelo
                      INNER JOIN mod_datosmaestros.nom_indicador n
                      ON d.idindicador = n.idindicador
                      INNER JOIN mod_datosmaestros.dat_indicadorcentrobalance d2
                       ON n.idindicador = d2.idindicador
                      WHERE (d2.identidaddatosnomenclador =?)
                      GROUP BY em.identidad";
        return $consultaOcho;
    }

    public function listarEntidades($parametros) {
        $conn = Doctrine_Manager::connection();
        $query = "   SELECT DISTINCT d.identidad AS identidad
FROM  mod_planificacion.dat_ajusteexistencia d
LEFT JOIN  mod_datosmaestros.nom_indicador n ON d.idindicador = n.idindicador
LEFT JOIN  mod_planificacion.dat_indicadorcentrobalance d4 ON n.idindicador = d4.idindicador
WHERE ( d4.identidaddatosnomenclador = ? ) ";
        $res = $conn->execute(
                $query, array($parametros['identidaddatosnomenclador'])
        );
        $data->data = $res->fetchAll(PDO::FETCH_ASSOC);
        return $data->data;
    }

    public function obtenerObjExistenciaOD($parametros) {

        $query = new Doctrine_Query();
        $res = $query
                        ->from('DatAjusteexistenciaod od')
                        ->where(
                                'od.idajusteexistencia=? AND od.identidadmodelo=? AND  od.idajusteexistenciaod=? ', array($parametros->idajusteexistencia,
                            $parametros->identidadmodelo,
                            $parametros->idajusteexistenciaod)
                        )
                        ->execute()->getFirst();
        return $res;
    }

    public function coberturaObjExistenciaOD($parametros) {

        $query = new Doctrine_Query();
        $res = $query
                        ->from('DatAjusteexistenciaod od')
                        ->where('od.idajusteexistencia=? ', $parametros)->execute()->getFirst();
        return $res;
    }

    public function obtenerObjExistenciaCB($parametros) {
        $query = new Doctrine_Query();
        $res = $query
                        ->from('DatAjusteexistenciacb cb')
                        ->where(
                                'cb.idajusteexistencia=? AND cb.identidadmodelo=? AND  cb.idajusteexistenciacb=? ', array($parametros->idajusteexistencia,
                            $parametros->identidadmodelo,
                            $parametros->idajusteexistenciacb)
                        )->execute()->getFirst();
        return $res;
    }

    public function coberturaObjExistenciaCB($parametros) {

        $query = new Doctrine_Query();
        $res = $query
                        ->from('DatAjusteexistenciacb cb')
                        ->where('cb.idajusteexistencia=?  ', $parametros)->execute()->getFirst();
        return $res;
    }

    public function obtenerObjExistencia($parametros) {

        $query = new Doctrine_Query();
        $res = $query
                        ->from('DatAjusteexistencia daex')
                        ->where(
                                'daex.idajusteexistencia =? AND daex.identidad=? AND daex.idindicador=? ', array($parametros->idajusteexistencia, $parametros->identidad,
                            $parametros->idindicador)
                        )->execute()->getFirst();

        return $res;
    }

    public function obtenerObjExistenciaNew($parametros) {
        $query = new Doctrine_Query();
        $res = $query
                        ->from('DatAjusteexistencia daex')
                        ->where(
                                'daex.identidad=? AND daex.idindicador=? AND daex.idejercicio =?', array($parametros['identidad'], $parametros ['idindicador'],
                            $parametros ['idejercicio'])
                        )->execute();
        if (isset($res[0])) {
            return $res[0];
        } else {
            return array();
        }
    }

    public function listarIndcadoresCobertura($parametros) {
        $query = new Doctrine_Query();
        $addwhere = "";
        $paramsQuery = array();       
        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $p => $s) {

                if ($s != null) {
                    if ($p == 'codigo') {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "nomin.codigo  LIKE ? ", ("$s%")
                        );
                    } elseif ($p == 'denominacion') {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "upper(nomin.denominacion)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'idumedida') {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "nomin.idumedida ="
                                . " ? ", $s
                        );
                    } elseif ($p == 'idcentrobalance') {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "indcb.identidaddatosnomenclador ="
                                . " ? ", $s
                        );
                    } elseif ($p == 'numeropieza') {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "upper(nomin.numeropieza)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'cantidadeninventario_condicion1' || $p == 'cantidadeninventario_condicion2' || $p == 'cantidadeninventario_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "daex.cantidadeninventario" . $s['condicion']
                                . " ? ", $s['importe']
                        );
                    } elseif ($p == 'mercanciaentransito_condicion1' || $p == 'mercanciaentransito_condicion2' || $p == 'mercanciaentransito_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "daex.mercanciaentransito" . $s['condicion']
                                . " ? ", $s['importe']
                        );
                    } elseif ($p == 'cantidadcontratado_condicion1' || $p == 'cantidadcontratado_condicion2' || $p == 'cantidadcontratado_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "daex.cantidadcontratado" . $s['condicion'] . " ? ", $s['importe']
                        );
                    } elseif ($p == 'necesidadannoactual_condicion1' || $p == 'necesidadannoactual_condicion2' || $p == 'necesidadannoactual_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "daex.necesidadannoactual" . $s['condicion']
                                . " ? ", $s['importe']
                        );
                    } elseif ($p == 'coberturatotalestimada_condicion1' || $p == 'coberturatotalestimada_condicion2' || $p == 'coberturatotalestimada_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "daex.coberturatotalestimada" . $s['condicion']
                                . " ? ", $s['importe']
                        );
                    } elseif ($p == 'cteoriginal_condicion1' || $p == 'cteoriginal_condicion2' || $p == 'cteoriginal_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "daex.cteoriginal" . $s['condicion'] . " ? ", $s['importe']
                        );
                    } elseif ($p == 'economia_condicion1' || $p == 'economia_condicion2' || $p == 'economia_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "daex.cantidadeconomia" . $s['condicion'] . " ? ", $s['importe']
                        );
                    } elseif ($p == 'RM_condicion1' || $p == 'RM_condicion2' || $p == 'RM_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "daex.reservaministerial" . $s['condicion'] . " ? ", $s['importe']
                        );
                    } elseif ($p == 'conmat') {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "daex.generadoconmat  = ? ", ($s)
                        );
                    }
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        if ($parametros['listar']) {
            $query = self::consultaNueve($parametros, $addwhere);           
            $res = $conn->execute($query, $paramsQuery);
            $result->data = $res->fetchAll(PDO::FETCH_ASSOC);
             $result->total = $result->data[0] ['total'];
        }
        /*if ($parametros['contar']) {
            $total = self::total($parametros, $addwhere);           
            $total = $conn->execute($total, $paramsQuery);
            $total = $total->fetchAll(PDO::FETCH_ASSOC);
            $result->total = $total[0]['total'];
        }*/ 
        return $result;
    }

    public function total($parametros, $addwhere) {
        $total = "SELECT  COUNT( Distinct planif.idindicador ) as total
                   FROM mod_planificacion.dat_planificacion planif
                   INNER JOIN mod_planificacion.dat_entidadmodelo em
                   ON( planif.identidadmodelo = em.identidadmodelo
                   AND (em.identidad IN (" . ($parametros['entidadeshijas'])
                . ") or planif.idcentrobalance="
                . ($parametros['idcb']) . ")
                   AND planif.idejercicio = " . ($parametros['idejercicio']) . ")
		   INNER JOIN mod_datosmaestros.nom_indicador nomin
                   ON( planif.idindicador = nomin.idindicador)
                   INNER JOIN mod_datosmaestros.dat_indicadorcentrobalance indcb
                   ON( indcb.idindicador = nomin.idindicador)
                   LEFT JOIN mod_planificacion.dat_ajusteexistencia daex
                   ON( planif.idindicador = daex.idindicador
                   AND daex.idejercicio = " . ($parametros['idejercicio']) . "
                   AND daex.identidad = " . $parametros['entidad'] . ")
                   WHERE true $addwhere
                HAVING SUM(planif.cantidad)> 0";
        return $total;
    }

    public function consultaNueve($parametros, $addwhere) {
        $groupby = self::groupBy();
        $consultaNueve = "SELECT  --DISTINCT 
                               planif.idindicador,nomin.codigo,indcb.identidaddatosnomenclador as idcentrobalance,
                               nomin.denominacion,nomin.idumedida,nomin.numeropieza,SUM( planif.cantidad) as cant,
                               COALESCE(daex.cantidadeninventario,0) as cantidadeninventario ,
                               COALESCE(daex.mercanciaentransito,0) as mercanciaentransito ,
                               COALESCE(daex.cantidadcontratado,0)as cantidadcontratado,
                               COALESCE(daex.necesidadannoactual,0)as necesidadannoactual,
                               COALESCE(daex.coberturatotalestimada,0)as coberturatotalestimada,
                               COALESCE(daex.cteoriginal,0)as cteoriginal,
                               COALESCE(daex.reservaministerial,0) as reservaministerial,
                               COALESCE(daex.cantidadeconomia,0) as cantidadeconomia,
                               daex.generadoconmat as conmat,
                               count(*) OVER() as total
                  FROM mod_planificacion.dat_planificacion planif
                   INNER JOIN mod_planificacion.dat_entidadmodelo em
                   ON( planif.identidadmodelo = em.identidadmodelo
                   AND (em.identidad IN (" . ($parametros['entidadeshijas'])
                . ") "
                . "or planif.idcentrobalance=" . ($parametros['idcb']) . "))
		   INNER JOIN mod_datosmaestros.nom_indicador nomin
                   ON( planif.idindicador = nomin.idindicador)
                   INNER JOIN mod_datosmaestros.dat_indicadorcentrobalance indcb
                   ON( indcb.idindicador = nomin.idindicador)
                   LEFT JOIN mod_planificacion.dat_ajusteexistencia daex
                   ON( planif.idindicador = daex.idindicador AND daex.idejercicio = "
                . ($parametros['idejercicio'])
                . " AND daex.identidad = " . $parametros['entidad'] . ")
                   WHERE planif.idejercicio = " . ($parametros['idejercicio']) . "   $addwhere $groupby
                   HAVING SUM(planif.cantidad) > 0
                   ORDER BY nomin.codigo OFFSET " . ($parametros['start']) . "
                   LIMIT " . ($parametros['limit']) . " ";
        return $consultaNueve;
    }

    public function groupBy() {
        $consulta = "GROUP BY planif.idindicador, nomin.codigo,nomin.denominacion,indcb.identidaddatosnomenclador,
         nomin.numeropieza,nomin.idumedida,daex.cantidadeninventario,daex.mercanciaentransito,
         daex.cantidadcontratado,daex.necesidadannoactual, daex.coberturatotalestimada,
         daex.cteoriginal,daex.ajustenivelactividadneg, daex.ajustenivelactividadpos,
         daex.reservaministerial, daex.cantidadeconomia,daex.generadoconmat";
        return $consulta;
    }

    public function obtenerViasOrganoAprobarDesaprobar($parametros) {
        $query = new Doctrine_Query();
        $res = $query->select(
                                'diva.idviaadquisicion,divaos.idorganosatisface,nomvia.denominacion
            ,nomorg.denominacion, nomin.idindicador,divaos.idindicadorviaadquisicionorganosatisface,
            ddvo.cantidad,ddvo.iddesgviaadquisorgsat,ddvo.idaprobacion'
                        )->from('NomIndicador nomin')
                        ->leftjoin(
                                ' nomin.DatIndicadorviaadquisicionorganosatisface divaos'
                        )->leftjoin(' divaos.DatDesgviaadquisorgsat ddvo ')
                        ->leftjoin(' divaos.DatIndicadorviaadquisicion diva')
                        ->leftjoin(' divaos.NomOrganosatisface nomorg')
                        ->leftjoin(' diva.NomViaadquisicion nomvia')
                        ->where(
                                'nomin.idindicador =? AND divaos.idindicador =? AND diva.idindicador=?', array($parametros['idindicador'], $parametros['idindicador'],
                            $parametros['idindicador'])
                        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return $res;
    }

    public function listarIndcadoresCoberturaExportar($start, $limit, $parametros, $count
    ) {

        $query = new Doctrine_Query();
        //$queryTotal = new Doctrine_Query();
        $addwhere = "";
        $paramsQuery = array();

        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $p => $s) {

                if ($s != null) {
                    if ($p == 'codigo') {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "nomin.codigo  LIKE ? ", ("$s%")
                        );
                    } elseif ($p == 'denominacion') {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "upper(nomin.denominacion)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'numeropieza') {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "upper(nomin.numeropieza)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'cantidadeninventario_condicion1' || $p == 'cantidadeninventario_condicion2' || $p == 'cantidadeninventario_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "daex.cantidadeninventario" . $s['condicion']
                                . " ? ", $s['importe']
                        );
                    } elseif ($p == 'mercanciaentransito_condicion1' || $p == 'mercanciaentransito_condicion2' || $p == 'mercanciaentransito_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "daex.mercanciaentransito" . $s['condicion']
                                . " ? ", $s['importe']
                        );
                    } elseif ($p == 'cantidadcontratado_condicion1' || $p == 'cantidadcontratado_condicion2' || $p == 'cantidadcontratado_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "daex.cantidadcontratado" . $s['condicion'] . " ? ", $s['importe']
                        );
                    } elseif ($p == 'necesidadannoactual_condicion1' || $p == 'necesidadannoactual_condicion2' || $p == 'necesidadannoactual_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "daex.necesidadannoactual" . $s['condicion']
                                . " ? ", $s['importe']
                        );
                    } elseif ($p == 'coberturatotalestimada_condicion1' || $p == 'coberturatotalestimada_condicion2' || $p == 'coberturatotalestimada_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "daex.coberturatotalestimada" . $s['condicion']
                                . " ? ", $s['importe']
                        );
                    } elseif ($p == 'cteoriginal_condicion1' || $p == 'cteoriginal_condicion2' || $p == 'cteoriginal_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "daex.cteoriginal" . $s['condicion'] . " ? ", $s['importe']
                        );
                    } elseif ($p == 'economia_condicion1' || $p == 'economia_condicion2' || $p == 'economia_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "daex.cantidadeconomia" . $s['condicion'] . " ? ", $s['importe']
                        );
                    } elseif ($p == 'RM_condicion1' || $p == 'RM_condicion2' || $p == 'RM_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "daex.reservaministerial" . $s['condicion'] . " ? ", $s['importe']
                        );
                    }
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        if ($count == false) {
            $parametros['limit'] = $limit;
            $parametros['start'] = $start;
            $query = self::consultaNueve($parametros, $addwhere);
            //$query = self::consultaDiez($parametros, $addwhere, $start, $limit);
            $res = $conn->execute($query, $paramsQuery);
            $result = $res->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $total = self::total($parametros, $addwhere);
            /* $total
              = "SELECT  COUNT( Distinct planif.idindicador ) as total
              FROM mod_planificacion.dat_planificacion planif
              INNER JOIN mod_planificacion.dat_entidadmodelo em
              ON( planif.identidadmodelo = em.identidadmodelo
              AND (em.identidad IN (" . ($parametros['entidadeshijas'])
              . ") or planif.idcentrobalance=" . ($parametros['idcb']) . ")
              AND planif.idejercicio = " . ($parametros['idejercicio']) . ")
              INNER JOIN mod_datosmaestros.nom_indicador nomin
              ON( planif.idindicador = nomin.idindicador)
              LEFT JOIN mod_planificacion.dat_ajusteexistencia daex
              ON( planif.idindicador = daex.idindicador
              AND daex.idejercicio = " . ($parametros['idejercicio']) . "
              AND daex.identidad = " . $parametros['entidad'] . ")
              WHERE true $addwhere"; */
            $total = $conn->execute($total, $paramsQuery);
            $total = $total->fetchAll(PDO::FETCH_ASSOC);

            $result['total'] = $total[0]['total'];
        }
        return $result;
    }

    public function consultaDiez($parametros, $addwhere, $start, $limit) {
        $groupby = self::groupByUno();
        $consultaDiez = "SELECT  DISTINCT planif.idindicador,nomin.codigo,
                               nomin.denominacion,nomin.numeropieza,SUM( planif.cantidad) as cant,
                               COALESCE(daex.cantidadeninventario,0) as cantidadeninventario ,
                               COALESCE(daex.mercanciaentransito,0) as mercanciaentransito ,
                               COALESCE(daex.cantidadcontratado,0)as cantidadcontratado,
                               COALESCE(daex.necesidadannoactual,0)as necesidadannoactual,
                               COALESCE(daex.coberturatotalestimada,0)as coberturatotalestimada,
                               COALESCE(daex.cteoriginal,0)as cteoriginal,
                               COALESCE(daex.reservaministerial,0) as reservaministerial,
                               COALESCE(daex.cantidadeconomia,0) as cantidadeconomia, daex.generadoconmat as conmat

                   FROM mod_planificacion.dat_planificacion planif
                   INNER JOIN mod_planificacion.dat_entidadmodelo em
                   ON( planif.identidadmodelo = em.identidadmodelo

                   AND (em.identidad IN (" . ($parametros['entidadeshijas'])
                . ") or planif.idcentrobalance=" . ($parametros['idcb']) . ")

                   AND planif.idejercicio = " . ($parametros['idejercicio']) . ")
		   INNER JOIN mod_datosmaestros.nom_indicador nomin
                   ON( planif.idindicador = nomin.idindicador)
                   LEFT JOIN mod_planificacion.dat_ajusteexistencia daex
                   ON( planif.idindicador = daex.idindicador AND daex.idejercicio = "
                . ($parametros['idejercicio'])
                . " AND daex.identidad = " . $parametros['entidad'] . ")
                   WHERE true $addwhere $groupby ORDER BY nomin.codigo
                   OFFSET $start LIMIT $limit";
        return $consultaDiez;
    }

    public function groupByUno() {
        $consulta = "GROUP BY planif.idindicador, nomin.codigo,nomin.denominacion,
                   nomin.numeropieza, daex.cantidadeninventario,daex.mercanciaentransito,
                   daex.cantidadcontratado,daex.necesidadannoactual,
                   daex.coberturatotalestimada, daex.cteoriginal,
                   daex.ajustenivelactividadneg, daex.ajustenivelactividadpos,
                   daex.reservaministerial, daex.cantidadeconomia,daex.generadoconmat";
        return $consulta;
    }

    public function getIndicadoresModelEntidad($parametros) {
        $query = new Doctrine_Query();

        $res = $query
                        ->from('DatAjusteexistencia daex')
                        ->innerJoin(' daex.DatAjusteexistenciaod daexod')
                        ->innerJoin('daexod.DatEntidadmodelo em')
                        ->innerJoin(' daex.NomIndicador nomin')
                        ->innerJoin(' nomin.NomIndicadorplanif nominpnif')
                        ->innerJoin(' nomin.DatIndicadorcentrobalance dicb')
                        ->innerJoin(' dicb.DatEntidaddatosnomenclador dedn')
                        ->addwhere(
                                ' daex.identidad=? AND em.identidad = ?
                AND dicb.identidaddatosnomenclador <>? AND daex.idejercicio =?
                AND daexod.identidadmodelo = em.identidadmodelo AND daexod.identidadmodelo =? ', array($parametros['identidad'], $parametros['identidad'],
                            $parametros['identidaddatosnomenclador'], 1,
                            $parametros['identidadmodelo'])
                        )->orderby('nomin.codigo')->execute();


        return $res;
    }

}
