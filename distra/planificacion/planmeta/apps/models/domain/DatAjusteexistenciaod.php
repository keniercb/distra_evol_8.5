<?php

class DatAjusteexistenciaod extends BaseDatAjusteexistenciaod {

    public function setUp() {
        parent::setUp();
    }

    public function aprobarDesaprobar($parametros) {
        $hojas = Doctrine::getTable('DatAjusteexistenciaod')->find(
                $parametros['idajusteexistenciaod']
        );
        $hojas->save();
        return true;
    }

    public function aprobarComoOD($parametros) {
        if ($parametros) {
            foreach ($parametros['arrayind'] as $key => $value) {
                //$arridaexod[$key] = $value->idajusteexistenciaod;
                $arrayindicadores[] = $value->idindicador;
            }
        }

        if ($parametros['hijosentidad'][0] != null) {
            array_push(
                    $parametros['hijosentidad'], $parametros['identidadlogueada']
            );
            $query = new Doctrine_Query();
            $res = $query->update('DatOdcte od')
                            ->set('od.idaprobacion', '?', $parametros['idaprobacion'])
                            ->addwhere(
                                    'od.idmodelo =? AND od.idaprobacion <=2', $parametros['idmodelo']
                            )->whereIn('od.identidad', $parametros['hijosentidad'])
                            ->whereIn('od.idindicador', $arrayindicadores)->execute();
        } else {

            $query = new Doctrine_Query();
            $res = $query->update('DatOdcte od')
                            ->set('od.idaprobacion', '?', $parametros['idaprobacion'])
                            ->addWhere(
                                    'od.idaprobacion <=? AND od.idmodelo=? AND od.identidadmodelo=?'
                                    . 'AND od.identidad=?', array(2, $parametros['idmodelo'],
                                $parametros['identidadmodelo'],
                                $parametros['identidadlogueada'])
                            )->whereIn('od.idindicador', $arrayindicadores)->execute();
        }

        return $res;
    }

    //Aprobar y desaprobar Todos los ajustes  para cdo la entidad se comporta como OD en dat_ajusteexistenciaod 
    public function aprobarTodosComoOD($parametros) {

        if ($parametros['hijosentidad'][0] != null) {
            array_push(
                    $parametros['hijosentidad'], $parametros['identidadlogueada']
            );

            $query = new Doctrine_Query();
            $res = $query->update('DatOdcte od')
                    ->set('od.idaprobacion', '?', $parametros['idaprobacion'])
                    ->addwhere(
                            'od.idmodelo=? AND od.idaprobacion <=?', array($parametros['idmodelo'], 2)
                    )->whereIn('od.identidad', $parametros['hijosentidad'])
                    ->execute();
        } else {
            $identidadL = $parametros['identidadlogueada'];
            $identidadmodelo = $parametros['identidadmodelo'];
            $query = new Doctrine_Query();
            $res = $query->update('DatOdcte od')
                            ->set('od.idaprobacion', '?', $parametros['idaprobacion'])
                            ->addwhere(
                                    'od.identidadmodelo=? AND od.idmodelo=? AND od.idaprobacion <=?', array($identidadmodelo, $parametros['idmodelo'], 2)
                            )->addwhere('od.identidad=?', $identidadL)->execute();
        }
        return $res;
    }

    public function aprobarComoRector($parametros) {


        $queryUno = new Doctrine_Query();
        $resUno = $queryUno->update('DatAjusteexistenciaod od')
                ->set('od.idaprobacion', '?', $parametros['idaprobacion'])
                ->addWhere('od.idmodelo=? ', $parametros['idmodelo'])
                ->whereIn('od.identidad ', $parametros['hijosentidad'])
                ->whereIn('od.idindicador ', $parametros['arrayindicadores'])
                ->execute();

        return $resUno;
    }

    public function listarEntidades($entidadescad) {

        $conn = Doctrine_Manager::connection();

        $query = "SELECT f.idfila as id,
       estruct.denominacion as text,
       estruct.codigo,
       true as leaf,
       1 as tipo
FROM mod_estructuracomp.nom_filaestruc f
     INNER JOIN  (  select e.idestructura ,e.denominacion,e.codigo,e.idproyecto from  mod_estructuracomp.dat_estructura e union
                        select eop.idestructuraop as idestructura ,eop.denominacion,eop.codigo,eop.idproyecto from  mod_estructuracomp.dat_estructuraop eop)estruct
						ON  f.idfila=estruct.idestructura
WHERE (
        SELECT idfila
        FROM mod_estructuracomp.nom_filaestruc
        WHERE idfila IN ($entidadescad) AND
              lft > f.lft AND
              rgt < f.rgt
        limit 1
      ) IS NOT NULL AND
      f.idpadre =
      (
        SELECT identidad
        FROM mod_planificacion.dat_entidaddatosnomenclador ed
        WHERE iddatosnomenclador = 176
      ) AND
      f.idfila <>
      (
        SELECT identidad
        FROM mod_planificacion.dat_entidaddatosnomenclador ed
        WHERE iddatosnomenclador = 176
      ) AND
      estruct.idproyecto = 0";
        $res = $conn->execute($query);
        $data->data = $res->fetchAll(PDO::FETCH_ASSOC);
        return $data->data;
    }

    public function actualizarOdcte($parametros) {

        $paramsQuery = array($parametros['identidadOD'],
            $parametros['idmodelo'],
            $parametros['identidadmodelo'], 1);
        $conn = Doctrine_Manager::connection();

        $query = "select * from mod_planificacion.f_actualizarodcte(?, ?, ?, ?)";
        $res = $conn->execute($query, $paramsQuery);
        $result = $res->fetchAll();
        return $result;
    }

    private function addWhereConParams(&$where, &$paramsQuery, $columCond, $param
    ) {
        $where .= " AND " . $columCond;
        $paramsQuery[] = $param;
    }

    private function addWhereSinParams(&$where, $columCond) {
        $where .= " AND " . $columCond;
    }

    private function addWhereConParamsFoo(&$foo, $columCond, $param) {
        $foo .= " AND " . $columCond . $param;
    }

    private function addHavigConParamsFoo(&$addHaving, $columCond, $param) {
        $addHaving .= " AND " . $columCond . $param;
    }

    /* private function addWhereConParamsVia(&$whereviaadq, &$paramsQuery,
      $columCond, $param
      )
      {
      $whereviaadq .= " AND " . $columCond . $param;
      } */

    private function addWhereSinParamsFoo(&$foo, $columCond) {
        $foo .= " AND " . $columCond;
    }

    public function listarIndOD($start, $limit, $parametros) {

        //objeto conex de Doctrine
        $conn = Doctrine_Manager::connection();
        //tratamiento de parametros
        $identidadmodelo = DatEntidadmodelo::getIdentidadmodelo(
                        $parametros['idmodelo'], $parametros['identidadOD']
        );
        $parametros['identidadmodelo'] = $identidadmodelo[0]['identidadmodelo'];
        $paramsQuery = array();
        $myidentidad = $parametros['identidadOD'];
        $mymodelo = $parametros['idmodelo'];
        $addwhere = "";
        $foo = " Where true";
        //$whereviaadq = "";
        //$whereorganosat = "";
        $addHaving = "Having true ";
        if ($parametros['CB'] == 1 && $parametros['ajusteCB'] == 'false') {
            self::addWhereConParams(
                    $addwhere, $paramsQuery, "p.idcentrobalance=?", $parametros['identidaddatosnomenclador']
            );
            // $entidadcolumnatotal=$parametros['idcb'];
            $entidadcolumnatotal = $myidentidad;
        } else {
            if ($parametros['identidaddatosnomenclador']) {
                self::addWhereConParams(
                        $addwhere, $paramsQuery, "p.idcentrobalance <>?", $parametros['identidaddatosnomenclador']
                );
            }
            $entidadcolumnatotal = $myidentidad;
        }
        //tratamiento del filtro
        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $p => $s) {
                if ($s != null) {
                    if ($p == 'codigo') {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "i.codigo  LIKE ? ", ("$s%")
                        );
                    } elseif ($p == 'denominacion') {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "upper(i.denominacion)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'naturaleza') {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "i.idnaturaleza  = ? ", $s
                        );
                    } elseif ($p == 'unidadmedida') {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "i.idumedida  = ? ", $s
                        );
                    } elseif ($p == 'numeropieza') {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "upper(i.numeropieza)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'precio_condicion1' || $p == 'precio_condicion2' || $p == 'precio_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "ipnif.precio " . $s['condicion'] . " ? ", $s['precio']
                        );
                    } elseif ($p == 'denominacioncb') {
                        $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom($s);
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, 'p.idcentrobalance =?', $entidaddatosnom[0]['identidaddatosnomenclador']
                        );
                    } elseif ($p == 'necesidad_condicion1' || $p == 'necesidad_condicion2' || $p == 'necesidad_condicion3'
                    ) {

                        self::addHavigConParamsFoo(
                                $addHaving, " SUM(foo.necesidad)  " . $s['condicion'], $s['necesidad']
                        );
                    } elseif ($p == 'coberturaparcialestimada_condicion1' || $p == 'coberturaparcialestimada_condicion2' || $p == 'coberturaparcialestimada_condicion3'
                    ) {

                        self::addWhereConParamsFoo(
                                $foo, "(SELECT COALESCE(SUM(cpe),0)
                            FROM  mod_planificacion.dat_odcte  odcte1
                            WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo AND odcte1.idindicador = foo.idindicador
AND odcte1.idejercicio = "
                                . $parametros['idejercicio'] . ")"
                                . $s['condicion'], $s['coberturaparcialestimada']
                        );
                    } elseif ($p == 'coberturatotalestimada_condicion1' || $p == 'coberturatotalestimada_condicion2' || $p == 'coberturatotalestimada_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "COALESCE(ae.coberturatotalestimada,0) "
                                . $s['condicion'] . " ? ", $s['coberturatotalestimada']
                        );
                    } elseif ($p == 'importe_condicion1' || $p == 'importe_condicion2' || $p == 'importe_condicion3'
                    ) {

                        self::addHavigConParamsFoo(
                                $addHaving, "(SUM(foo.necesidad) -
                            (SELECT COALESCE(SUM(cpe),0)
                            FROM  mod_planificacion.dat_odcte  odcte1
                            WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
    AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                                . $parametros['idejercicio'] . ")) * foo.precio "
                                . $s['condicion'], $s['importe']
                        );
                    } elseif ($p == 'importemlc_condicion1' || $p == 'importemlc_condicion2' || $p == 'importemlc_condicion3'
                    ) {

                        self::addHavigConParamsFoo(
                                $addHaving, "(SUM(foo.necesidad) -
                            (SELECT COALESCE(SUM(cpe),0)
                            FROM  mod_planificacion.dat_odcte  odcte1
                            WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                                . $parametros['idejercicio']
                                . ")) * foo.preciodivisa "
                                . $s['condicion'], $s['importemlc']
                        );
                    } elseif ($p == 'flete_condicion1' || $p == 'flete_condicion2' || $p == 'flete_condicion3'
                    ) {

                        self::addHavigConParamsFoo(
                                $addHaving, "SUM((foo.necesidad) -
                            (SELECT COALESCE(SUM(cpe),0)
                            FROM  mod_planificacion.dat_odcte  odcte1
                            WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                                . $parametros['idejercicio']
                                . ")) * foo.precio * (foo.flete)/100 "
                                . $s['condicion'], $s['flete']
                        );
                    } elseif ($p == 'contingencia_condicion1' || $p == 'contingencia_condicion2' || $p == 'contingencia_condicion3'
                    ) {

                        self::addHavigConParamsFoo(
                                $addHaving, "SUM((foo.necesidad) -
                                (SELECT COALESCE(SUM(cpe),0)
                            FROM  mod_planificacion.dat_odcte  odcte1
                            WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                                . $parametros['idejercicio']
                                . ")) * foo.precio * (foo.contingencia)/100 "
                                . $s['condicion'], $s['contingencia']
                        );
                    } elseif ($p == 'importefila_condicion1' || $p == 'importefila_condicion2' || $p == 'importefila_condicion3'
                    ) {

                        self::addHavigConParamsFoo(
                                $addHaving, "SUM((foo.necesidad) -
                                (SELECT COALESCE(SUM(cpe),0)
                            FROM  mod_planificacion.dat_odcte  odcte1
                            WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                                . $parametros['idejercicio'] . ")) * foo.precio +
SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM  mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                                . $parametros['idejercicio'] . ")) * foo.precio *
                            (foo.flete)/100 +
SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM  mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                                . $parametros['idejercicio']
                                . ")) * foo.precio * (foo.contingencia)/100 "
                                . $s['condicion'], $s['importefila']
                        );
                    } else {
                        if ($p == 'idaprobacionsi') {
                            self::addWhereSinParamsFoo(
                                    $foo, "(SELECT idaprobacion FROM mod_planificacion."
                                    . "dat_odcte WHERE identidad = $myidentidad"
                                    . " AND idmodelo = $mymodelo AND idindicador"
                                    . " = foo.idindicador AND idejercicio = "
                                    . $parametros['idejercicio'] . ") > 1"
                            );
                        } else {
                            if ($p == 'idaprobacionno') {
                                self::addWhereSinParamsFoo(
                                        $foo, "(SELECT idaprobacion FROM mod_planificacion.dat_odcte WHERE identidad ="
                                        . " $myidentidad AND idmodelo = "
                                        . "$mymodelo AND idindicador = "
                                        . "foo.idindicador AND idejercicio = "
                                        . $parametros['idejercicio'] . ") = 1 "
                                );
                            } elseif ($p == 'demanda_condicion1' || $p == 'demanda_condicion2' || $p == 'demanda_condicion3'
                            ) {
                                self::addHavigConParamsFoo(
                                        $addHaving, "SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
                            FROM mod_planificacion.dat_odcte  odcte1
                            WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                                        . $parametros['idejercicio'] . ")"
                                        . $s['condicion'], $s['demanda']
                                );
                            } elseif ($p == 'denomviaadquisicion') {
                                self::addWhereConParamsFoo(
                                        $foo, 'upper (foo.viaadquisicion ) =', "upper( '" . $s . "' )"
                                );
                            } elseif ($p == 'denomorganosatisface') {
                                self::addWhereConParamsFoo(
                                        $foo, "upper(foo.organosatisface)  LIKE  ", ("'%" . strtoupper($s) . "%'")
                                );
                            }
                        }
                    }
                }
            }
        }

        $comparacionElab = "";

        if (self::verificarEjercicioActual_Elaboracion(
                        $parametros['idejercicio']
                )
        ) {
            $comparacionElab = " AND  ipnif.idaprobacion > 1 AND ipnif.nivelplanif = 1";
        }

        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']
            ) {
                self::addWhereSinParams($addwhere, " i.estado = 1");
            }
        }
        //consulta general para obtener los indicadores
        $consultageneral = self::consultaGeneral(
                        $addwhere, $foo, $parametros, $mymodelo, $myidentidad, $comparacionElab, $addHaving, $entidadcolumnatotal
        );
        if ($start != null && $limit != null) {
//se le agrega el limit y start a la consulta general
            $consultageneral .= " OFFSET $start LIMIT $limit";
        }
//ejecutando la consulta general
        $res = $conn->execute($consultageneral, $paramsQuery);
        $arrayindicadores = $res->fetchAll(PDO::FETCH_ASSOC);
//consulta para obtener el total de indicadores e importes
        $consultatotalimportes = self::consultaTotalImportes(
                        $addwhere, $foo, $parametros, $myidentidad, $mymodelo, $addHaving
        );
        //ejecutando la consulta del total
        $total = $conn->execute($consultatotalimportes, $paramsQuery);
        $totales = $total->fetchAll(PDO::FETCH_ASSOC);
        $resultado['datos'] = $arrayindicadores;
        $resultado['total'] = $totales[0]['total'];
        $resultado['importetotal'] = $totales[0]['importetotal'];
        $resultado['importeflete'] = $totales[0]['importeflete'];
        $resultado['importecontingencia'] = $totales[0]['importecontingencia'];
        $resultado['importenecesidad'] = $totales[0]['importenecesidad'];
        $resultado['importeajustado'] = $totales[0]['importeajustado'];
        $resultado['importemn'] = $totales[0]['importemn'];
        $resultado['importemlc'] = $totales[0]['importemlc'];
        return $resultado;
    }

    public function select() {
        $consulta = "SELECT Sum(pru.importeMN) as importeMN,
SUm(pru.importemlc) as importemlc, sum(pru.importeflete) as importeflete,
sum(pru.importecontingencia) as importecontingencia,
sum(pru.importetotal) as importetotal,sum(pru.importenecesidad) as importenecesidad,
sum(pru.importeajustado) as importeajustado,count(pru.idindicador) as total";
        return $consulta;
    }

    public function selectUno() {
        $consulta = "SELECT foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,
foo.numeropieza,foo.denominacion,foo.denominacioncb,foo.unidadmedida,foo.idnaturaleza,
foo.coberturatotalestimada,foo.viaadquisicion,foo.organosatisface,SUM(foo.necesidad) as necesidad,
COALESCE((SELECT idaprobacion";
        return $consulta;
    }

    public function consultaTotalImportes($addwhere, $foo, $parametros, $myidentidad, $mymodelo, $addHaving
    ) {
        $select = self::select();
        $selectUno = self::selectUno();
        $groupBy = self::groupBy();
        $selectDos = self::selectDos();
        $consulta = "$select FROM($selectUno
FROM mod_planificacion.dat_odcte  odcte1 WHERE odcte1.identidad = $myidentidad
AND odcte1.idmodelo = $mymodelo AND odcte1.idindicador = foo.idindicador
AND odcte1.idejercicio = " . $parametros['idejercicio'] . "),1) as idaprobacion,
(SELECT COALESCE(SUM(cpe),0) FROM  mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
    AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ") as coberturaparcialestimada,
SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM  mod_planificacion.dat_odcte  odcte1 WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
    AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ") as demanda,

(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM  mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
    AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ")) * foo.precio as importeMN,

(SUM(foo.necesidad)) * foo.precio + (SUM(foo.necesidad)) * foo.precio * (foo.flete)/100 +
(SUM(foo.necesidad)) * foo.precio * (foo.contingencia)/100 as importenecesidad,

(SELECT COALESCE(SUM(cpe),0)
FROM mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
    AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ") * foo.precio +

(SELECT COALESCE(SUM(cpe),0)
FROM mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
    AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ") * foo.precio * (foo.flete)/100 +

(SELECT COALESCE(SUM(cpe),0)
FROM mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
    AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ") * foo.precio * (foo.contingencia)/100 as
    importeajustado, (SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
    AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ")) * foo.preciodivisa as importeMLC,

SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM  mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
    AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ")) * foo.precio * (foo.flete)/100 as
    importeflete, SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM  mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
    AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ")) * foo.precio * (foo.contingencia)/100
    as importecontingencia, SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM  mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN ({$parametros['entidades']})
    AND odcte1.idmodelo = $mymodelo AND odcte1.idindicador = foo.idindicador
    AND odcte1.idejercicio = " . $parametros['idejercicio'] . ")) * foo.precio +
SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM  mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
    AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ")) * foo.precio * (foo.flete)/100 +
SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM  mod_planificacion.dat_odcte  odcte1 WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
    AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ")) * foo.precio * (foo.contingencia)/100 as
    importetotal FROM ($selectDos

FROM mod_planificacion.dat_planificacion p
INNER JOIN mod_datosmaestros.nom_indicador i on p.idindicador=i.idindicador
INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on
i.idindicador = ipnif.idindicador
INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn on
p.idcentrobalance = edn.identidaddatosnomenclador
INNER JOIN mod_estructuracomp.dat_estructura e on edn.identidad = e.idestructura

INNER JOIN mod_planificacion.dat_entidadmodelo em on p.identidadmodelo =
em.identidadmodelo
LEFT JOIN  mod_planificacion.dat_ajusteexistencia ae on (p.idindicador =
ae.idindicador AND ae.identidad = $myidentidad AND ae.idejercicio = "
                . $parametros['idejercicio'] . ")
LEFT JOIN mod_planificacion.dat_odcte odcte on
(i.idindicador = odcte.idindicador AND odcte.identidad= em.identidad AND
em.idmodelo = odcte.idmodelo AND odcte.idejercicio = "
                . $parametros['idejercicio'] . ")
INNER JOIN mod_datosmaestros.nom_unidadmedida um ON
(um.idunidadmedida = i.idumedida)
INNER JOIN mod_datosmaestros.nom_naturaleza dn ON
(dn.idnaturaleza = i.idnaturaleza) WHERE em.identidad IN
({$parametros['entidades']}) AND em.idmodelo = $mymodelo AND e.idproyecto = 0
AND ipnif.nivelplanif = 1 AND ipnif.idaprobacion = 4 AND (p.cantidad+p.ajuste)>0
AND p.idejercicio = " . $parametros['idejercicio'] . " $addwhere
Group by i.idindicador,p.viasadquisicion,p.organossatisface, i.codigo,
i.idnaturaleza,ipnif.precio,ipnif.preciodivisa,i.numeropieza,ipnif.flete
,ipnif.contingencia,i.denominacion,e.denominacion,um.abreviaturaunidadmedida,
dn.denominacion,ae.coberturatotalestimada order by i.codigo) as foo
$foo $groupBy $addHaving ORDER BY foo.codigo) as pru";
        return $consulta;
    }

    public function selectDos() {
        $consulta = "SELECT i.idindicador,i.codigo,ipnif.precio,ipnif.preciodivisa,
i.numeropieza,i.idnaturaleza,i.denominacion,ipnif.flete,ipnif.contingencia,
e.denominacion as denominacioncb,um.abreviaturaunidadmedida as unidadmedida,
dn.denominacion as naturaleza,SUM(p.cantidad + p.ajuste) as necesidad,
ae.coberturatotalestimada as coberturatotalestimada,p.viasadquisicion as viaadquisicion,
p.organossatisface as organosatisface";
        return $consulta;
    }

    public function groupBy() {
        $consulta = "Group by foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,
foo.numeropieza,foo.flete,foo.contingencia,foo.denominacion,foo.denominacioncb,
foo.unidadmedida,foo.idnaturaleza,foo.coberturatotalestimada,foo.viaadquisicion,
foo.organosatisface";
        return $consulta;
    }

    public function selectTres($parametros) {
        if ($parametros['glob'] == 'false')
            $modeloentidad = 'foo.identidadmodelo,';
        else {
            $modeloentidad = '';
        }
        $consulta = "SELECT foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,
                    foo.numeropieza,foo.denominacion,foo.denominacioncb,foo.unidadmedida,
                    foo.idnaturaleza,foo.naturaleza,
                    COALESCE(foo.reservaministerial,0) as reservaministerial,
                    COALESCE(foo.cantidadeconomia,0) as cantidadeconomia,
                    $modeloentidad
                    foo.coberturatotalestimada,
                    foo.viaadquisicion,foo.organosatisface,SUM(foo.necesidad) as necesidad";
        return $consulta;
    }

    /* public function consultaGeneral($addwhere, $foo, $parametros, $mymodelo, $myidentidad, $comparacionElab, $addHaving
      ) {
      $select = self::selectTres($parametros);
      $selectUno = self::selectCuatro($parametros);
      $groupByUno = self::groupByUno($parametros);
      $groupByDos = self::groupByDos($parametros);
      $consulta = " $select ,COALESCE((SELECT idaprobacion
      FROM  mod_planificacion.dat_odcte  odcte1
      WHERE odcte1.identidad = $myidentidad AND"
      . " odcte1.idmodelo = $mymodelo AND odcte1.idindicador ="
      . " foo.idindicador AND odcte1.idejercicio = "
      . $parametros['idejercicio'] . "),1) as idaprobacion,
      (SELECT COALESCE(SUM(cpe),0) FROM  mod_planificacion.dat_odcte  odcte1
      WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
      AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
      . $parametros['idejercicio'] . ") as coberturaparcialestimada,
      SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
      FROM mod_planificacion.dat_odcte  odcte1
      WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
      AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
      . $parametros['idejercicio'] . ") as demanda,
      (SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
      FROM  mod_planificacion.dat_odcte  odcte1
      WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
      AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
      . $parametros['idejercicio'] . ")) * foo.precio as importe,
      (SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
      FROM  mod_planificacion.dat_odcte  odcte1
      WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
      AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
      . $parametros['idejercicio'] . ")) * foo.preciodivisa as importemlc,
      SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
      FROM  mod_planificacion.dat_odcte  odcte1
      WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
      AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
      . $parametros['idejercicio'] . ")) * foo.precio * (foo.flete)/100 as flete,
      SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
      FROM mod_planificacion.dat_odcte  odcte1
      WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
      AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
      . $parametros['idejercicio'] . ")) * foo.precio * (foo.contingencia)/100
      as contingencia,SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
      FROM mod_planificacion.dat_odcte  odcte1 WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
      AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
      . $parametros['idejercicio'] . ")) * foo.precio +
      SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
      FROM mod_planificacion.dat_odcte  odcte1
      WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
      AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
      . $parametros['idejercicio'] . ")) * foo.precio * (foo.flete)/100 +
      SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
      FROM  mod_planificacion.dat_odcte  odcte1
      WHERE odcte1.identidad IN ({$parametros['entidades']}) AND odcte1.idmodelo = $mymodelo
      AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
      . $parametros['idejercicio'] . ")) * foo.precio * (foo.contingencia)/100 as
      importefila FROM ($selectUno
      FROM mod_planificacion.dat_planificacion p
      INNER JOIN mod_datosmaestros.nom_indicador i on
      p.idindicador=i.idindicador
      INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif
      on i.idindicador = ipnif.idindicador
      INNER JOIN mod_planificacion.dat_entidaddatosnomenclador
      edn on p.idcentrobalance = edn.identidaddatosnomenclador
      INNER JOIN mod_estructuracomp.dat_estructura e on
      edn.identidad = e.idestructura
      INNER JOIN mod_planificacion.dat_entidadmodelo em on
      p.identidadmodelo = em.identidadmodelo
      LEFT JOIN  mod_planificacion.dat_ajusteexistencia ae on
      (p.idindicador = ae.idindicador AND ae.identidad = $myidentidad "
      . "AND ae.idejercicio = " . $parametros['idejercicio'] . ")
      LEFT JOIN mod_planificacion.dat_odcte odcte on
      (i.idindicador = odcte.idindicador AND odcte.identidad= em.identidad
      AND em.idmodelo = odcte.idmodelo AND odcte.idejercicio = "
      . $parametros['idejercicio'] . ")
      INNER JOIN mod_datosmaestros.nom_unidadmedida um ON
      (um.idunidadmedida = i.idumedida)
      INNER JOIN mod_datosmaestros.nom_naturaleza dn ON
      (dn.idnaturaleza = i.idnaturaleza) WHERE em.identidad IN
      ({$parametros['entidades']}) AND em.idmodelo = $mymodelo AND e.idproyecto = 0
      AND ipnif.nivelplanif = 1 AND ipnif.idaprobacion = 4 AND (p.cantidad+p.ajuste)>0
      AND p.idejercicio = " . $parametros['idejercicio'] . "."
      . $comparacionElab . "
      $addwhere $groupByUno order by i.codigo ) as foo $foo $groupByDos

      $addHaving
      order by foo.codigo ";
      return $consulta;
      } */

    public function consultaGeneral($addwhere, $foo, $parametros, $mymodelo, $myidentidad, $comparacionElab, $addHaving, $entidadcolumnatotal
    ) {
        $select = self::selectTres();
        $selectUno = self::selectCuatro();
        $groupByUno = self::groupByUno();
        $groupByDos = self::groupByDos();
        $consulta = " $select ,COALESCE((SELECT idaprobacion
                      FROM  mod_planificacion.dat_odcte  odcte1
                                 WHERE odcte1.identidad = $myidentidad AND"
                . " odcte1.idmodelo = $mymodelo AND odcte1.idindicador ="
                . " foo.idindicador AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . "),1) as idaprobacion,
(SELECT COALESCE(SUM(cpe),0) FROM  mod_planificacion.dat_odcte  odcte1
        WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3
WHERE f3.idfila = $myidentidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4
WHERE f4.idfila = $myidentidad)) AND odcte1.idmodelo = $mymodelo
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ") as coberturaparcialestimada,
SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
        FROM mod_planificacion.dat_odcte  odcte1
        WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3 WHERE
f3.idfila = $myidentidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4 WHERE
f4.idfila = $myidentidad)) AND odcte1.idmodelo = $mymodelo
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ") as demanda,
(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM  mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3
WHERE f3.idfila = $myidentidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4
WHERE f4.idfila = $myidentidad)) AND odcte1.idmodelo = $mymodelo
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ")) * foo.precio as importe,
(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM  mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3
WHERE f3.idfila = $myidentidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4
WHERE f4.idfila = $myidentidad)) AND odcte1.idmodelo = $mymodelo
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ")) * foo.preciodivisa as importemlc,
SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM  mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3
WHERE f3.idfila = $myidentidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4
WHERE f4.idfila = $myidentidad)) AND odcte1.idmodelo = $mymodelo
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ")) * foo.precio * (foo.flete)/100 as flete,
SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3
WHERE f3.idfila = $myidentidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4
WHERE f4.idfila = $myidentidad)) AND odcte1.idmodelo = $mymodelo
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ")) * foo.precio * (foo.contingencia)/100
    as contingencia,SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM mod_planificacion.dat_odcte  odcte1 WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3
WHERE f3.idfila = $myidentidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4
WHERE f4.idfila = $myidentidad)) AND odcte1.idmodelo = $mymodelo
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ")) * foo.precio +
SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3
WHERE f3.idfila = $myidentidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4
WHERE f4.idfila = $myidentidad)) AND odcte1.idmodelo = $mymodelo
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ")) * foo.precio * (foo.flete)/100 +
SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM  mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3
WHERE f3.idfila = $myidentidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4
WHERE f4.idfila = $myidentidad)) AND odcte1.idmodelo = $mymodelo
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ")) * foo.precio * (foo.contingencia)/100 as
    importefila FROM ($selectUno
        FROM mod_planificacion.dat_planificacion p
        INNER JOIN mod_datosmaestros.nom_indicador i on
        p.idindicador=i.idindicador
        INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif
        on i.idindicador = ipnif.idindicador
        INNER JOIN mod_planificacion.dat_entidaddatosnomenclador
        edn on p.idcentrobalance = edn.identidaddatosnomenclador
        INNER JOIN mod_estructuracomp.dat_estructura e on
        edn.identidad = e.idestructura
        INNER JOIN mod_planificacion.dat_entidadmodelo em on
        p.identidadmodelo = em.identidadmodelo
        LEFT JOIN  mod_planificacion.dat_ajusteexistencia ae on
        (p.idindicador = ae.idindicador AND ae.identidad = $entidadcolumnatotal "
                . "AND ae.idejercicio = " . $parametros['idejercicio'] . ")
        LEFT JOIN mod_planificacion.dat_odcte odcte on
        (i.idindicador = odcte.idindicador AND odcte.identidad= em.identidad
        AND em.idmodelo = odcte.idmodelo AND odcte.idejercicio = "
                . $parametros['idejercicio'] . ")
        INNER JOIN mod_datosmaestros.nom_unidadmedida um ON
        (um.idunidadmedida = i.idumedida)
         INNER JOIN mod_datosmaestros.nom_naturaleza dn ON
         (dn.idnaturaleza = i.idnaturaleza) WHERE em.identidad IN
        (SELECT f.idfila
        FROM mod_estructuracomp.nom_filaestruc f
        WHERE f.lft >= (SELECT f1.lft FROM mod_estructuracomp.nom_filaestruc f1
        WHERE f1.idfila = $myidentidad)
        AND f.rgt <= (SELECT f2.rgt FROM mod_estructuracomp.nom_filaestruc f2
        WHERE f2.idfila = $myidentidad)) AND em.idmodelo = $mymodelo AND e.idproyecto = 0
        AND ipnif.nivelplanif = 1 AND ipnif.idaprobacion = 4 AND (p.cantidad+p.ajuste)>0
        AND p.idejercicio = " . $parametros['idejercicio'] . "."
                . $comparacionElab . "
        $addwhere $groupByUno order by i.codigo ) as foo $foo $groupByDos

        $addHaving
        order by foo.codigo ";
        return $consulta;
    }

    public function groupByUno($parametros) {
        if ($parametros['glob'] == 'false')
            $modeloentidad = ',p.identidadmodelo';
        else {
            $modeloentidad = '';
        }
        $consulta = "Group by i.idindicador, p.viasadquisicion,p.organossatisface,
        i.idnaturaleza,i.codigo,p.precio,p.preciodivisa,i.numeropieza,
        ipnif.flete,ipnif.contingencia,i.denominacion,e.denominacion,
        ae.reservaministerial,
        ae.cantidadeconomia,
        um.abreviaturaunidadmedida,dn.denominacion,ae.coberturatotalestimada
        $modeloentidad
        ";
        return $consulta;
    }

    public function groupByDos($parametros) {
        if ($parametros['glob'] == 'false')
            $modeloentidad = ',foo.identidadmodelo';
        else {
            $modeloentidad = '';
        }
        $consulta = "Group by foo.idindicador,foo.codigo,foo.precio,
                    foo.preciodivisa,foo.numeropieza,foo.flete,foo.contingencia,
                    foo.denominacion,foo.denominacioncb,foo.unidadmedida,
                    foo.idnaturaleza,foo.naturaleza,foo.coberturatotalestimada,
                    foo.reservaministerial,
                    foo.cantidadeconomia,
                    foo.viaadquisicion,foo.organosatisface
        $modeloentidad
        ";
        return $consulta;
    }

    public function selectCuatro($parametros) {
        if ($parametros['glob'] == 'false')
            $modeloentidad = 'p.identidadmodelo,';
        else {
            $modeloentidad = '';
        }
        $consulta = "SELECT i.idindicador,i.codigo,p.precio,p.preciodivisa,
        i.numeropieza,i.denominacion,i.idnaturaleza,ipnif.flete,ipnif.contingencia,
        e.denominacion as denominacioncb,um.abreviaturaunidadmedida as unidadmedida,
        dn.denominacion as naturaleza,SUM(p.cantidad + p.ajuste) as necesidad,
        COALESCE(ae.coberturatotalestimada,0) as coberturatotalestimada,
        COALESCE(ae.reservaministerial,0) as reservaministerial,
        COALESCE(ae.cantidadeconomia,0) as cantidadeconomia,
        p.viasadquisicion as viaadquisicion,
        $modeloentidad
        p.organossatisface as organosatisface";
        return $consulta;
    }

    public function obtenerDatosDelReporteOD($parametros) {
        $idejercicio = $parametros->idejercicio;
        $conn = Doctrine_Manager::connection();
        $addwhere = "";
        $foo = " Where true";

        $idcentrobalance = Array();

        if ($parametros->comportamiento != 2) {
            $idcentrobalance = implode(',', $parametros->entidaddatosnom);
            if ($idcentrobalance[0] != null) {
                self::addWhereSinParams(
                        $addwhere, "p.idcentrobalance =  $parametros->iddatnomparacb "
                );
            }
        } else {

            if ($parametros->identidaddatosnom) {
                self::addWhereSinParams(
                        $addwhere, "p.idcentrobalance <> $parametros->identidaddatosnom "
                );
            }
        }
        if ($parametros->codigo) {
            $addwhere .= " AND upper(i.codigo) LIKE '%" . strtoupper(
                            $parametros->codigo
                    ) . "%' ";
        }
        if ($parametros->numpieza) {
            $addwhere .= " AND upper(i.numeropieza) LIKE '%" . strtoupper(
                            $parametros->numpieza
                    ) . "%' ";
        }
        if ($parametros->denominacion) {
            $addwhere .= " AND upper(i.denominacion) LIKE '%" . strtoupper(
                            $parametros->denominacion
                    ) . "%' ";
        }

        $consultageneral = self::consultaGeneralUno(
                        $idejercicio, $addwhere, $foo, $parametros
        );

        $dato = $conn->execute($consultageneral);
        $datos = $dato->fetchAll();

        return $datos;
    }

    public function selectCinco() {
        $consulta = "SELECT ole.idindicador,ole.codigo,ole.precio,ole.preciodivisa,
ole.numeropieza,ole.denominacion,ole.denominacioncb,ole.coberturatotalestimada,
ole.viaadquisicion,ole.organosatisface,sum(ole.necesidad) as necesidad,
sum(ole.importe) as importe,sum(ole.importemlc) as importemlc,
sum(ole.flete) as importeflete,sum(ole.contingencia) as importecontingencia,
sum(ole.importefila) as importefila,sum(ole.demanda) as demanda";
        return $consulta;
    }

    public function selectSeis() {
        $consulta = "SELECT foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,
                    foo.numeropieza,foo.denominacion,foo.denominacioncb,
                    foo.coberturatotalestimada,foo.viaadquisicion,foo.organosatisface,
                    foo.identidad,SUM(foo.necesidad) as necesidad";
        return $consulta;
    }

    public function selectSiete() {
        $consulta = "SELECT i.idindicador,i.codigo,ipnif.precio,ipnif.preciodivisa,
                     i.numeropieza,i.denominacion,ipnif.flete,ipnif.contingencia,
                     em.identidad,e.denominacion as denominacioncb,
                     SUM(p.cantidad + p.ajuste) as necesidad,
                     ae.coberturatotalestimada as coberturatotalestimada";
        return $consulta;
    }

    public function consultaGeneralUno($idejercicio, $addwhere, $foo, $parametros
    ) {
        $select = self::selectCinco();
        $selectUno = self::selectSeis();
        $selectDos = self::selectSiete();
        $groupby = self::groupByTres();
        $groupbyUno = self::groupByCuatro();
        $groupbyDos = self::groupByCinco();
        $consulta = " $select FROM($selectUno,COALESCE((SELECT idaprobacion
FROM  mod_planificacion.dat_odcte  odcte1
 WHERE odcte1.identidad = foo.identidad AND odcte1.idmodelo =
                $parametros->idplan AND odcte1.idindicador = foo.idindicador
                AND odcte1.idejercicio = $idejercicio),1) as idaprobacion,
                (SELECT COALESCE(SUM(cpe),0) FROM  mod_planificacion.dat_odcte  odcte1
                WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc
f3 WHERE f3.idfila = foo.identidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4
WHERE f4.idfila = foo.identidad))AND odcte1.idmodelo = $parametros->idplan
AND odcte1.idindicador = foo.idindicador
AND odcte1.idejercicio = $idejercicio) as coberturaparcialestimada,
SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) FROM mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN (SELECT f5.idfila FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3 WHERE
f3.idfila = foo.identidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4 WHERE
f4.idfila = foo.identidad)) AND odcte1.idmodelo = $parametros->idplan
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = $idejercicio) as demanda,
(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) FROM  mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN (SELECT f5.idfila FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3 WHERE
f3.idfila = foo.identidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4 WHERE
f4.idfila = foo.identidad)) AND odcte1.idmodelo = $parametros->idplan
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = $idejercicio))
 * foo.precio as importe, (SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM  mod_planificacion.dat_odcte  odcte1 WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3
WHERE f3.idfila = foo.identidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4
WHERE f4.idfila = foo.identidad)) AND odcte1.idmodelo = $parametros->idplan
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = $idejercicio))
* foo.preciodivisa as importemlc,SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM  mod_planificacion.dat_odcte  odcte1 WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3
WHERE f3.idfila = foo.identidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4 WHERE
f4.idfila = foo.identidad)) AND odcte1.idmodelo = $parametros->idplan
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = $idejercicio))
* foo.precio * (foo.flete)/100 as flete, SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM mod_planificacion.dat_odcte  odcte1 WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3 WHERE
f3.idfila = foo.identidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4 WHERE
f4.idfila = foo.identidad)) AND odcte1.idmodelo = $parametros->idplan
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = $idejercicio))
 * foo.precio * (foo.contingencia)/100 as contingencia,
SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) FROM mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN (SELECT f5.idfila FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3 WHERE
f3.idfila = foo.identidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4 WHERE
f4.idfila = foo.identidad)) AND odcte1.idmodelo = $parametros->idplan
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = $idejercicio)) * foo.precio +
SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) FROM mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN (SELECT f5.idfila FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3 WHERE
f3.idfila = foo.identidad) AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4 WHERE
f4.idfila = foo.identidad)) AND odcte1.idmodelo = $parametros->idplan
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = $idejercicio))
* foo.precio * (foo.flete)/100 + SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM  mod_planificacion.dat_odcte  odcte1 WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3 WHERE
f3.idfila = foo.identidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4 WHERE
f4.idfila = foo.identidad)) AND odcte1.idmodelo = $parametros->idplan
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = $idejercicio))
* foo.precio * (foo.contingencia)/100 as importefila FROM ($selectDos,
(SELECT va.denominacion FROM mod_datosmaestros.nom_viaadquisicion va
INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iva on
va.idviaadquisicion = iva.idviaadquisicion
 WHERE iva.idindicador = i.idindicador limit 1 ) as viaadquisicion,

(SELECT os.denominacion FROM mod_datosmaestros.dat_indicadorviaadquisicion iva
INNER JOIN  mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ivaos
on (iva.idindicador = ivaos.idindicador AND iva.idviaadquisicion =
ivaos.idviaadquisicion)
INNER JOIN mod_datosmaestros.nom_organosatisface  os on ivaos.idorganosatisface
= os.idorganosatisface WHERE iva.idindicador = i.idindicador limit 1 ) as organosatisface

FROM mod_planificacion.dat_planificacion p
INNER JOIN mod_datosmaestros.nom_indicador i on p.idindicador=i.idindicador
INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on i.idindicador =ipnif.idindicador
INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn on
p.idcentrobalance = edn.identidaddatosnomenclador
INNER JOIN mod_estructuracomp.dat_estructura e on edn.identidad = e.idestructura
INNER JOIN mod_planificacion.dat_entidadmodelo em on p.identidadmodelo =
em.identidadmodelo LEFT JOIN  mod_planificacion.dat_ajusteexistencia ae on (p.idindicador =
ae.idindicador AND ae.identidad = em.identidad AND ae.idejercicio = p.idejercicio)
LEFT JOIN mod_planificacion.dat_odcte odcte on (i.idindicador =
odcte.idindicador AND odcte.identidad= em.identidad AND em.idmodelo =
odcte.idmodelo AND odcte.idejercicio = p.idejercicio)
WHERE em.identidad IN (SELECT f.idfila
FROM mod_estructuracomp.nom_filaestruc f
WHERE f.lft >= (SELECT f1.lft FROM mod_estructuracomp.nom_filaestruc f1
WHERE f1.idfila = em.identidad)
AND f.rgt <= (SELECT f2.rgt FROM mod_estructuracomp.nom_filaestruc f2
WHERE f2.idfila = em.identidad)) AND em.idmodelo = $parametros->idplan
AND i.estado=1 AND p.idejercicio = $idejercicio AND em.identidad IN($parametros->hijosentidad)
$addwhere $groupby ) as foo $foo $groupbyUno ) as ole $groupbyDos
offset $parametros->start limit $parametros->limit ";
        return $consulta;
    }

    public function groupByTres() {
        $consulta = "
Group by i.idindicador,em.identidad,i.codigo,ipnif.precio,ipnif.preciodivisa
,i.numeropieza,ipnif.flete,ipnif.contingencia,i.denominacion,e.denominacion,
ae.coberturatotalestimada order by i.codigo";
        return $consulta;
    }

    public function groupByCuatro() {
        $consulta = "Group by foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,
                    foo.numeropieza,foo.flete,foo.contingencia,foo.denominacion,
                    foo.denominacioncb,foo.coberturatotalestimada,foo.viaadquisicion,
                    foo.organosatisface,foo.identidad order by foo.codigo";
        return $consulta;
    }

    public function groupByCinco() {
        $consulta = "Group by ole.idindicador,ole.codigo,ole.precio,ole.preciodivisa,
ole.numeropieza,ole.denominacion,ole.denominacioncb,ole.coberturatotalestimada,
ole.viaadquisicion,ole.organosatisface order by ole.codigo";
        return $consulta;
    }

    public function contarIndicadoresTotalReporteOD($parametros) {
        $idejercicio = $parametros->idejercicio;
        $conn = Doctrine_Manager::connection();
        $addwhere = "";
        $foo = " Where true";

        $idcentrobalance = Array();

        if ($parametros->comportamiento != 2) {
            $idcentrobalance = implode(',', $parametros->entidaddatosnom);
            if ($idcentrobalance[0] != null) {
                self::addWhereSinParams(
                        $addwhere, "p.idcentrobalance =  $parametros->iddatnomparacb "
                );
            }
        } else {

            if ($parametros->identidaddatosnom) {
                self::addWhereSinParams(
                        $addwhere, "p.idcentrobalance <> $parametros->identidaddatosnom "
                );
            }
        }
        if ($parametros->codigo) {
            $addwhere .= " AND upper(i.codigo) LIKE '%" . strtoupper(
                            $parametros->codigo
                    ) . "%' ";
        }
        if ($parametros->numpieza) {
            $addwhere .= " AND upper(i.numeropieza) LIKE '%" . strtoupper(
                            $parametros->numpieza
                    ) . "%' ";
        }
        if ($parametros->denominacion) {
            $addwhere .= " AND upper(i.denominacion) LIKE '%" . strtoupper(
                            $parametros->denominacion
                    ) . "%' ";
        }

        $consultatotalimportes = self::consultatotalImportesUno(
                        $idejercicio, $addwhere, $foo, $parametros
        );
        $dato = $conn->execute($consultatotalimportes);
        $datos = $dato->fetchAll();
        return $datos[0]['total'];
    }

    public function selectOcho() {
        $consulta = "SELECT Sum(pru.importeMN) as importeMN,SUm(pru.importemlc) as importemlc,
sum(pru.importeflete) as importeflete,sum(pru.importecontingencia) as importecontingencia,
sum(pru.importetotal) as importetotal,sum(pru.importenecesidad) as importenecesidad,
sum(pru.importeajustado) as importeajustado,count(pru.idindicador) as total";
        return $consulta;
    }

    public function selectNueve() {
        $consulta = " SELECT ole.idindicador,ole.codigo,ole.precio,ole.preciodivisa,
ole.numeropieza,ole.denominacion,ole.denominacioncb,ole.coberturatotalestimada,
ole.viaadquisicion,ole.organosatisface,SUM (ole.importeMN) as importeMN,
SUM (ole.importemlc) as importemlc,SUM (ole.importeflete) as importeflete,
SUM (ole.importecontingencia) as importecontingencia,
SUM (ole.importetotal) as importetotal,SUM (ole.importenecesidad) as importenecesidad,
SUM (ole.importeajustado) as importeajustado";
        return $consulta;
    }

    public function selectDiez() {
        $consulta = "SELECT foo.idindicador,foo.codigo,foo.identidad,foo.precio,
foo.preciodivisa,foo.numeropieza,foo.denominacion,foo.denominacioncb,
foo.coberturatotalestimada,foo.viaadquisicion,foo.organosatisface,
SUM(foo.necesidad) as necesidad";
        return $consulta;
    }

    public function selectOnce() {
        $consulta = "SELECT i.idindicador,i.codigo,ipnif.precio,ipnif.preciodivisa,
	i.numeropieza,i.denominacion,ipnif.flete,ipnif.contingencia,em.identidad,
	e.denominacion as denominacioncb,SUM(p.cantidad + p.ajuste) as necesidad,
	ae.coberturatotalestimada as coberturatotalestimada";
        return $consulta;
    }

    public function groupBySeis() {
        $consulta = "Group by i.idindicador,i.codigo,ipnif.precio,ipnif.preciodivisa,
	i.numeropieza,em.identidad,ipnif.flete,ipnif.contingencia,i.denominacion,
	e.denominacion,	ae.coberturatotalestimada order by i.codigo";
        return $consulta;
    }

    public function groupBySiete() {
        $consulta = "Group by foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,
foo.numeropieza,foo.identidad,foo.flete,foo.contingencia,foo.denominacion,
foo.denominacioncb,foo.coberturatotalestimada,foo.viaadquisicion,foo.organosatisface
ORDER BY foo.codigo";
        return $consulta;
    }

    public function groupByOcho() {
        $consulta = "Group by ole.idindicador,ole.codigo,ole.precio,ole.preciodivisa,
ole.numeropieza,ole.denominacion,ole.denominacioncb,ole.coberturatotalestimada,
ole.viaadquisicion,ole.organosatisface order by ole.codigo";
        return $consulta;
    }

    public function consultatotalImportesUno($idejercicio, $addwhere, $foo, $parametros
    ) {
        $select = self::selectOcho();
        $selectUno = self::selectNueve();
        $selectDos = self::selectDiez();
        $selectTres = self::selectOnce();
        $groupby = self::groupBySeis();
        $groupbyUno = self::groupBySiete();
        $groupbyDos = self::groupByOcho();

        $consulta = "$select FROM ($selectUno FROM ($selectDos,
 COALESCE((SELECT idaprobacion FROM mod_planificacion.dat_odcte  odcte1
 WHERE odcte1.identidad = foo.identidad AND odcte1.idmodelo = $parametros->idplan
 AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = $idejercicio),1) as idaprobacion,
(SELECT COALESCE(SUM(cpe),0) FROM  mod_planificacion.dat_odcte  odcte1
                            WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3 WHERE
f3.idfila = foo.identidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4 WHERE
f4.idfila = foo.identidad))
AND odcte1.idmodelo = $parametros->idplan AND odcte1.idindicador = foo.idindicador
AND odcte1.idejercicio = $idejercicio) as coberturaparcialestimada,
SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
                            FROM  mod_planificacion.dat_odcte  odcte1
                            WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3 WHERE
f3.idfila = foo.identidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4 WHERE
f4.idfila = foo.identidad))
AND odcte1.idmodelo = $parametros->idplan AND odcte1.idindicador = foo.idindicador
AND odcte1.idejercicio = $idejercicio) as demanda,
(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
 FROM  mod_planificacion.dat_odcte  odcte1 WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3 WHERE
f3.idfila = foo.identidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4 WHERE
f4.idfila = foo.identidad)) AND odcte1.idmodelo = $parametros->idplan
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = $idejercicio))
* foo.precio as importeMN,(SUM(foo.necesidad)) * foo.precio +
(SUM(foo.necesidad)) * foo.precio * (foo.flete)/100 + (SUM(foo.necesidad)) * foo.precio
* (foo.contingencia)/100 as importenecesidad,(SELECT COALESCE(SUM(cpe),0)
 FROM mod_planificacion.dat_odcte  odcte1 WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3
WHERE f3.idfila = foo.identidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4
WHERE f4.idfila = foo.identidad)) AND odcte1.idmodelo = $parametros->idplan
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = $idejercicio)
* foo.precio + (SELECT COALESCE(SUM(cpe),0) FROM mod_planificacion.dat_odcte  odcte1
WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3
WHERE f3.idfila = foo.identidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4
WHERE f4.idfila = foo.identidad)) AND odcte1.idmodelo = $parametros->idplan
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = $idejercicio)
* foo.precio * (foo.flete)/100 + (SELECT COALESCE(SUM(cpe),0)
 FROM mod_planificacion.dat_odcte  odcte1 WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3
WHERE f3.idfila = foo.identidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4
WHERE f4.idfila = foo.identidad)) AND odcte1.idmodelo = $parametros->idplan
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = $idejercicio)
* foo.precio * (foo.contingencia)/100 as importeajustado,

(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
 FROM mod_planificacion.dat_odcte  odcte1 WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3
WHERE f3.idfila = foo.identidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4
WHERE f4.idfila = foo.identidad)) AND odcte1.idmodelo = $parametros->idplan
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = $idejercicio))
* foo.preciodivisa as importeMLC,SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM  mod_planificacion.dat_odcte  odcte1 WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3
WHERE f3.idfila = foo.identidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4
WHERE f4.idfila = foo.identidad)) AND odcte1.idmodelo = $parametros->idplan
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = $idejercicio))
* foo.precio * (foo.flete)/100 as importeflete,
SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM  mod_planificacion.dat_odcte  odcte1 WHERE odcte1.identidad IN (SELECT f5.idfila
FROM mod_estructuracomp.nom_filaestruc f5
WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3 WHERE
f3.idfila = foo.identidad)
AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4 WHERE
f4.idfila = foo.identidad)) AND odcte1.idmodelo = $parametros->idplan
AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = $idejercicio))
* foo.precio * (foo.contingencia)/100 as importecontingencia,

SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
FROM  mod_planificacion.dat_odcte  odcte1  WHERE odcte1.identidad IN (SELECT f5.idfila
        FROM mod_estructuracomp.nom_filaestruc f5
        WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3
        WHERE f3.idfila = foo.identidad)
        AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4
        WHERE f4.idfila = foo.identidad)) AND odcte1.idmodelo = $parametros->idplan
        AND odcte1.idindicador = foo.idindicador
        AND odcte1.idejercicio = $idejercicio)) * foo.precio +
SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
 FROM  mod_planificacion.dat_odcte  odcte1 WHERE odcte1.identidad IN (SELECT f5.idfila
        FROM mod_estructuracomp.nom_filaestruc f5
        WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3
        WHERE f3.idfila = foo.identidad)
        AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4
        WHERE f4.idfila = foo.identidad)) AND odcte1.idmodelo = $parametros->idplan
        AND odcte1.idindicador = foo.idindicador
        AND odcte1.idejercicio = $idejercicio)) * foo.precio * (foo.flete)/100 +
SUM((foo.necesidad) - (SELECT COALESCE(SUM(cpe),0)
        FROM  mod_planificacion.dat_odcte  odcte1
        WHERE odcte1.identidad IN (SELECT f5.idfila
        FROM mod_estructuracomp.nom_filaestruc f5
        WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3
        WHERE f3.idfila = foo.identidad)
        AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4
        WHERE f4.idfila = foo.identidad)) AND odcte1.idmodelo = $parametros->idplan
        AND odcte1.idindicador = foo.idindicador AND odcte1.idejercicio = $idejercicio))
        * foo.precio * (foo.contingencia)/100 as importetotal
FROM ($selectTres,
	(SELECT va.denominacion FROM mod_datosmaestros.nom_viaadquisicion va
INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iva on
va.idviaadquisicion = iva.idviaadquisicion
 WHERE iva.idindicador = i.idindicador limit 1) as viaadquisicion,

(SELECT os.denominacion FROM mod_datosmaestros.dat_indicadorviaadquisicion iva
INNER JOIN  mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ivaos
on (iva.idindicador = ivaos.idindicador AND iva.idviaadquisicion =
ivaos.idviaadquisicion)
INNER JOIN mod_datosmaestros.nom_organosatisface  os on ivaos.idorganosatisface
= os.idorganosatisface
WHERE iva.idindicador = i.idindicador limit 1) as organosatisface
FROM mod_planificacion.dat_planificacion p
INNER JOIN mod_datosmaestros.nom_indicador i on p.idindicador=i.idindicador
INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on i.idindicador = ipnif.idindicador
INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn on
p.idcentrobalance = edn.identidaddatosnomenclador
INNER JOIN mod_estructuracomp.dat_estructura e on edn.identidad = e.idestructura
INNER JOIN mod_planificacion.dat_entidadmodelo em on p.identidadmodelo =
em.identidadmodelo LEFT JOIN  mod_planificacion.dat_ajusteexistencia ae on
(p.idindicador = ae.idindicador AND ae.identidad = em.identidad AND ae.idejercicio =
p.idejercicio)LEFT JOIN mod_planificacion.dat_odcte odcte on (i.idindicador =
odcte.idindicador AND odcte.identidad= em.identidad AND em.idmodelo =
odcte.idmodelo AND odcte.idejercicio = p.idejercicio) WHERE em.identidad IN
(SELECT f.idfila FROM mod_estructuracomp.nom_filaestruc f
WHERE f.lft >= (SELECT f1.lft FROM mod_estructuracomp.nom_filaestruc f1 WHERE
f1.idfila = em.identidad) AND f.rgt <= (SELECT f2.rgt FROM mod_estructuracomp.nom_filaestruc f2
WHERE f2.idfila = em.identidad)) AND em.idmodelo = $parametros->idplan
AND i.estado=1 AND p.idejercicio = $idejercicio AND em.identidad IN($parametros->hijosentidad)
$addwhere $groupby) as foo $foo $groupbyUno) as ole $groupbyDos) as pru";
        return $consulta;
    }

    public function obtenerObjExistenciaOD() {

        $conn = Doctrine_Manager::connection();

        $query = "SELECT COUNT( aeod.idindicador ) as total,
SUM( round(COALESCE(odcte.demanda,0) * ipnif.precio, 3 )) as importetotal
FROM mod_planificacion.dat_ajusteexistenciaod aeod
INNER JOIN mod_planificacion.dat_odcte odcte ON( odcte.idindicador = aeod.idindicador
AND odcte.identidadmodelo = aeod.identidadmodelo AND odcte.identidad = aeod.identidad   )
LEFT JOIN mod_planificacion.dat_ajusteexistencia ae ON( ae.idindicador = aeod.idindicador
AND ae.identidad = aeod.identidad) INNER JOIN mod_datosmaestros.nom_indicador ind
ON(aeod.idindicador = ind.idindicador )
INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on i.idindicador =
ipnif.idindicador INNER JOIN mod_planificacion.dat_indicadorcentrobalance indcb
ON( indcb.idindicador = ind.idindicador )
LEFT JOIN mod_planificacion.dat_entidaddatosnomenclador entdn
ON( entdn.iddatosnomenclador = indcb.identidaddatosnomenclador )
WHERE  aeod.identidad=? AND aeod.idmodelo=? AND 
       aeod.identidadmodelo=? AND (aeod.necesidad + odcte.demandahijos )>0";
        $totalA = $conn->execute($query);
        $total = $totalA->fetchAll(PDO::FETCH_ASSOC);
        return $total;
    }

    public function listarIndExportarOD($start, $limit, $parametros, $count) {
        $identidadmodelo = DatEntidadmodelo::getIdentidadmodelo(
                        $parametros['idmodelo'], $parametros['identidadOD']
        );
        $parametros['identidadmodelo'] = $identidadmodelo[0]['identidadmodelo'];
        //$tablaactualizada = self::actualizarOdcte($parametros);
        $paramsQuery = array();
        $paramsQuery[] = $parametros['identidadOD'];
        $paramsQuery[] = $parametros['idmodelo'];
        $paramsQuery[] = $parametros['identidadmodelo'];
        $addwhere = "";
        //$addHaving = " HAVING true ";
        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $p => $s) {
                if ($s != null) {
                    if ($p == 'codigo') {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "ind.codigo  LIKE ? ", ("$s%")
                        );
                    } elseif ($p == 'denominacion') {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "upper(ind.denominacion)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'numeropieza') {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "upper(ind.numeropieza)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'precio_condicion1' || $p == 'precio_condicion2' || $p == 'precio_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "ipnif.precio " . $s['condicion'] . " ? ", $s['precio']
                        );
                    } elseif ($p == 'denominacioncb') {
                        $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom($s);
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, 'indcb.identidaddatosnomenclador =?', $entidaddatosnom[0]['identidaddatosnomenclador']
                        );
                    } elseif ($p == 'necesidad_condicion1' || $p == 'necesidad_condicion2' || $p == 'necesidad_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, " (aeod.necesidad + odcte.demandahijos )  "
                                . $s['condicion'] . " ? ", $s['necesidad']
                        );
                    } elseif ($p == 'coberturaparcialestimada_condicion1' || $p == 'coberturaparcialestimada_condicion2' || $p == 'coberturaparcialestimada_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "odcte.cpe " . $s['condicion'] . " ? ", $s['coberturaparcialestimada']
                        );
                    } elseif ($p == 'coberturatotalestimada_condicion1' || $p == 'coberturatotalestimada_condicion2' || $p == 'coberturatotalestimada_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "ae.coberturatotalestimada " . $s['condicion']
                                . " ? ", $s['coberturatotalestimada']
                        );
                    } elseif ($p == 'importe_condicion1' || $p == 'importe_condicion2' || $p == 'importe_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "(odcte.demanda*ipnif.precio) " . $s['condicion']
                                . " ? ", $s['importe']
                        );
                    } elseif ($p == 'importemlc_condicion1' || $p == 'importemlc_condicion2' || $p == 'importemlc_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "(odcte.demanda*ipnif.preciodivisa) "
                                . $s['condicion'] . " ? ", $s['importemlc']
                        );
                    } elseif ($p == 'flete_condicion1' || $p == 'flete_condicion2' || $p == 'flete_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "((odcte.demanda*ipnif.precio)*ipnif.flete/100) "
                                . $s['condicion'] . " ? ", $s['flete']
                        );
                    } elseif ($p == 'contingencia_condicion1' || $p == 'contingencia_condicion2' || $p == 'contingencia_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "((odcte.demanda*ipnif.precio)*ipnif.contingencia/100) "
                                . $s['condicion'] . " ? ", $s['contingencia']
                        );
                    } elseif ($p == 'importefila_condicion1' || $p == 'importefila_condicion2' || $p == 'importefila_condicion3'
                    ) {
                        self::addWhereConParams(
                                $addwhere, $paramsQuery, "((((odcte.demanda*ipnif.precio)*ipnif.flete)/100)+"
                                . "(((odcte.demanda*ipnif.precio)*ipnif.contingencia)/100)+"
                                . "(odcte.demanda*ipnif.precio)) "
                                . $s['condicion'] . " ? ", $s['importefila']
                        );
                    } else {
                        if ($p == 'idaprobacionsi') {
                            self::addWhereSinParams(
                                    $addwhere, "aeod.idaprobacion > 1"
                            );
                        } else {
                            if ($p == 'idaprobacionno') {
                                self::addWhereSinParams(
                                        $addwhere, "aeod.idaprobacion = 1 "
                                );
                            } elseif ($p == 'demanda_condicion1' || $p == 'demanda_condicion2' || $p == 'demanda_condicion3'
                            ) {
                                self::addWhereConParams(
                                        $addwhere, $paramsQuery, "odcte.demanda " . $s['condicion'] . " ? ", $s['demanda']
                                );
                            }
                        }
                    }
                }
            }
        }
        if ($parametros['CB'] == 1 && $parametros['ajusteCB'] == 'false') {
            self::addWhereConParams(
                    $addwhere, $paramsQuery, "indcb.identidaddatosnomenclador=? ", $parametros['identidaddatosnomenclador']
            );
        }
        $conn = Doctrine_Manager::connection();
        if (!$count) {
            $query = self::consultaUno($addwhere, $start, $limit);
            $res = $conn->execute($query, $paramsQuery);
            $result = $res->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $query = self::consultaDos($addwhere);
            $total = $conn->execute($query, $paramsQuery);
            $total = $total->fetchAll(PDO::FETCH_ASSOC);

            $result[20]['total'] = $total[0]['total'];
            $result[21]['importetotal'] = $total[0]['importetotal'];
            $result[22]['importeflete'] = $total[0]['importeflete'];
            $result[23]['importecontingencia'] = $total[0]['importecontingencia'];
            $result[27]['importedemanda'] = $total[0]['importedemanda'];
            $result[24]['importemn'] = $total[0]['importemn'];
            $result[25]['importemlc'] = $total[0]['importemlc'];
            $result[26]['importenecesidadtotal'] = $total[0]['importenecesidadtotal'];
        }
        return $result;
    }

    public function consultaDos($addwhere) {
        $consulta = "SELECT COUNT( aeod.idindicador ) as total,
SUM( (COALESCE(odcte.demanda,0) * ipnif.precio)+((COALESCE(odcte.demanda,0) *
ipnif.precio)*(ipnif.flete/100))+ ((COALESCE(odcte.demanda,0) * ipnif.precio)*
(ipnif.contingencia/100))) as importetotal,
SUM( (COALESCE((aeod.necesidad + odcte.demandahijos ),0) * ipnif.precio)+(
(COALESCE((aeod.necesidad + odcte.demandahijos ),0) * ipnif.precio)*
(ipnif.flete/100))+
     ((COALESCE((aeod.necesidad + odcte.demandahijos ),0) * ipnif.precio)*
     (ipnif.contingencia/100))) as importenecesidadtotal,
sum((COALESCE(odcte.demanda,0) * ipnif.precio)*(ipnif.flete/100))
as importeflete,
sum((COALESCE(odcte.demanda,0) * ipnif.precio)*(ipnif.contingencia/100)) as
importecontingencia,
            SUM(COALESCE(odcte.demanda,0) * ipnif.precio) as importeMN,
        SUM(COALESCE(odcte.demanda,0) * ipnif.preciodivisa) as importeMLC
                          FROM mod_planificacion.dat_ajusteexistenciaod aeod
                            INNER JOIN mod_planificacion.dat_odcte odcte
                            ON( odcte.idindicador = aeod.idindicador
                            AND odcte.identidadmodelo = aeod.identidadmodelo
                            AND odcte.identidad = aeod.identidad   )
                            LEFT JOIN mod_planificacion.dat_ajusteexistencia ae
                            ON( ae.idindicador = aeod.idindicador
                            AND ae.identidad = aeod.identidad   )
                            INNER JOIN mod_datosmaestros.nom_indicador ind
                            ON(aeod.idindicador = ind.idindicador )
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif
                            ipnif on i.idindicador = ipnif.idindicador
                            INNER JOIN mod_planificacion.
                            dat_indicadorcentrobalance indcb
                            ON( indcb.idindicador = ind.idindicador )
                   LEFT JOIN mod_planificacion.dat_entidaddatosnomenclador entdn
                ON( entdn.iddatosnomenclador = indcb.identidaddatosnomenclador )
                            WHERE  aeod.identidad=? AND aeod.idmodelo=? AND
             aeod.identidadmodelo=? AND (aeod.necesidad + odcte.demandahijos )>0
                            $addwhere";
        return $consulta;
    }

    public function selectTrece() {
        $consulta = "SELECT aeod.identidadmodelo, aeod.identidad, aeod.idmodelo,
            (aeod.necesidad + odcte.demandahijos ) as necesidad,
            aeod.idajusteexistenciaod,
            aeod.idaprobacion, aeod.idindicador,
            aeod.idejercicio,
            odcte.cpe as coberturaparcialestimada,
            odcte.demanda, odcte.demandahijos,
            odcte.ajustenivelactividadneg, odcte.ajustenivelactividadpos,
            odcte.fechaajuste, odcte.idodcte,
            ae.idajusteexistencia, ae.coberturatotalestimada,
            ind.codigo, ind.numeropieza, ind.denominacion,
            ipnif.precio, (odcte.demanda*ipnif.precio) as importe,
            (odcte.demanda*ipnif.preciodivisa) as importeMLC,
            ((odcte.demanda*ipnif.precio)*ipnif.flete/100)as flete,
           ((odcte.demanda*ipnif.precio)*ipnif.contingencia/100)as contingencia,
            ((((odcte.demanda*ipnif.precio)*ipnif.flete)/100)+(
            ((odcte.demanda*ipnif.precio)*ipnif.contingencia)/100)+
            (odcte.demanda*ipnif.precio)) as importefila,
            entdn.identidad as identcb";
        return $consulta;
    }

    public function consultaUno($addwhere, $start, $limit) {
        $select = self::selectTrece();
        $consulta = "$select FROM mod_planificacion.dat_ajusteexistenciaod aeod
        INNER JOIN mod_planificacion.dat_odcte odcte
        ON( odcte.idindicador = aeod.idindicador
            AND odcte.identidadmodelo = aeod.identidadmodelo)
        LEFT JOIN mod_planificacion.dat_ajusteexistencia ae
        ON( ae.idindicador = aeod.idindicador
            AND ae.identidad = aeod.identidad)
        INNER JOIN mod_datosmaestros.nom_indicador ind
        ON(aeod.idindicador = ind.idindicador )
        INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on i.idindicador
        = ipnif.idindicador
        INNER JOIN mod_planificacion.dat_indicadorcentrobalance indcb
        ON( indcb.idindicador = ind.idindicador )
        LEFT JOIN mod_planificacion.dat_entidaddatosnomenclador entdn
        ON( entdn.identidaddatosnomenclador = indcb.identidaddatosnomenclador )
        WHERE  aeod.identidad=? AND aeod.idmodelo=?
        AND aeod.identidadmodelo=? AND (aeod.necesidad + odcte.demandahijos )>0
        $addwhere ORDER BY ind.codigo OFFSET $start LIMIT $limit";
        return $consulta;
    }

    public function verificarEjercicioActual_Elaboracion($idejercicio) {
        $query = new Doctrine_Query();
        $query->select('ejer.idejercicio')->from(
                        'NomEjercicioplanificacion ejer'
                )
                ->innerjoin('ejer.NomDatosnomenclador in')
                ->where(
                        "ejer.idejercicio=? AND ejer.actual=1 AND
                    in.uridatosnomenclador='elaboracion'", $idejercicio
        );
        if ($query->count() > 0) {
            return true;
        }
        return false;
    }

}
