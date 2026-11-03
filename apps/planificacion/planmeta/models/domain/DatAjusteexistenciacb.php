<?php

class DatAjusteexistenciacb extends BaseDatAjusteexistenciacb
{

    public function setUp()
    {
        parent::setUp();
    }

    //Aprobar y desaprobar los ajustes para cdo la entidad
    // se comporta como CB en dat_ajusteexistenciacb y dat_ajusteexistenciacb
    public function aprobarComoCB($parametros)
    {
        //$identidadmodelo = $parametros['arrayind'][0]->identidadmodelo;
        if ($parametros) {
            foreach ($parametros['arrayind'] as $key => $value) {
                //$arridaexod[$key] = $value->idajusteexistenciacb;
                //$arrayidajustexistencia[$key] = $value->idajusteexsitencia;
                $arrayinds[$key] = $value->idindicador;
            }
        }
        $query = new Doctrine_Query();
        $res = $query->update('DatAjusteexistenciacb cb')
            ->set('cb.idaprobacion', '?', $parametros['idaprobacion'])
            ->addwhere(
                'cb.idmodelo=? AND cb.identidadmodelo=? AND cb.identidad=?',
                array($parametros['idmodelo'], $parametros['identidadmodelo'],
                      $parametros['identidadcb'])
            )->whereIn('cb.idindicador', $arrayinds)->execute();
        $queryUno = new Doctrine_Query();
        $queryUno->update('DatOdcte od')
            ->set('od.idaprobacion', '?', $parametros['idaprobacion'])
            ->addwhere('od.idmodelo=?', $parametros['idmodelo'])
            ->whereIn('od.idindicador', $arrayinds)->execute();
        return $res;
    }

    //Aprobar y desaprobar Todos los ajustes para cdo la entidad
    // se comporta como CB en dat_ajusteexistenciacb y dat_ajusteexistenciacb
    public function aprobarTodosComoCB($parametros)
    {
        $identidadL = $parametros['identidadlogueada'];
        $identidadmodelo = $parametros['identidadmodelo'];
        /*if ($parametros) {
            foreach ($parametros['arrayind'] as $key => $value) {
                $arridaexod[$key] = $value->idajusteexistenciacb;
            }
        }*/

        $query = new Doctrine_Query();
        $res = $query->update('DatAjusteexistenciacb cb')
            ->set('cb.idaprobacion', $parametros['idaprobacion'])
            ->where(
                'cb.idmodelo=' . $parametros['idmodelo']
                . ' AND cb.identidadmodelo=' . $identidadmodelo
                . ' AND identidad = ' . $identidadL
            )->execute();

        $queryUno = new Doctrine_Query();
        $resUno = $queryUno->update('DatOdcte od')
            ->set('od.idaprobacion', $parametros['idaprobacion'])
            ->where(
                'od.identidadmodelo IN (SELECT em.identidadmodelo
                                                        FROM DatEntidadmodelo em
                                                        WHERE em.idmodelo ='
                . $parametros['idmodelo'] . ')'
            )
            ->addwhere(
                'od.idodcte IN (SELECT ae.idodcte FROM DatOdcte ae
                WHERE ae.idindicador in (SELECT ic.idindicador
                FROM DatIndicadorcentrobalance ic
                INNER JOIN ic.DatEntidaddatosnomenclador ed
                on (ic.identidaddatosnomenclador = ed.identidaddatosnomenclador)
                WHERE ed.identidad = '
                . $identidadL . ') )'
            )->execute();
        return $res;
    }

    //Aprobar y desaprobar los ajustes seleccionados por el usuario para cdo
    // la entidad se comporta como Rector en dat_ajusteexistenciacb y dat_ajusteexistenciaod
    public function aprobarComoRector($parametros)
    {
        //$identidadmodelo = $parametros['arrayind'][0]->identidadmodelo;
        if ($parametros) {
            foreach ($parametros['arrayind'] as $key => $value) {

                //$arridaexod[$key] = $value->idajusteexistenciacb;
                //$arrayidajustexistencia[$key] = $value->idajusteexsitencia;
                $arrayinds[$key] = $value->idindicador;
            }
        }
        $query = new Doctrine_Query();
        $res = $query->update('DatAjusteexistenciacb cb')
            ->set('cb.idaprobacion', '?', $parametros['idaprobacion'])
            ->whereIn('cb.idindicador', $arrayinds)->execute();

        $queryUno = new Doctrine_Query();
        $queryUno->update('DatOdcte od')
            ->set('od.idaprobacion', '?', $parametros['idaprobacion'])
            ->addwhere('od.idmodelo=?', $parametros['idmodelo'])
            ->whereIn('od.idindicador', $arrayinds)->execute();
        return $res;
    }

    //Aprobar y desaprobar TODOS los ajustes seleccionados por el usuario para cdo
    // la entidad se comporta como Rector en dat_ajusteexistenciacb y dat_ajusteexistenciaod
    public function aprobarTodosComoRector($parametros)
    {
        $identidadL = $parametros['identidadlogueada'];
        $identidadmodelo = $parametros['identidadmodelo'];
        /*if ($parametros) {
            foreach ($parametros['arrayind'] as $key => $value) {
                $arridaexod[$key] = $value->idajusteexistenciacb;
            }
        }*/

        $query = new Doctrine_Query();
        $res = $query->update('DatAjusteexistenciacb cb')
            ->set('cb.idaprobacion', $parametros['idaprobacion'])
            ->where(
                'cb.idmodelo=' . $parametros['idmodelo']
                . ' AND cb.identidadmodelo=' . $identidadmodelo
                . ' AND identidad = ' . $identidadL
            )->execute();

        $queryUno = new Doctrine_Query();
        $queryUno->update('DatOdcte od')
            ->set('od.idaprobacion', $parametros['idaprobacion'])
            ->where(
                'od.identidadmodelo IN (SELECT em.identidadmodelo
                 FROM DatEntidadmodelo em WHERE em.idmodelo =' . $parametros['idmodelo'] . ')'
            )
            ->addwhere(
                'od.idodcte IN (SELECT ae.idodcte
                   FROM DatOdcte ae WHERE ae.idindicador in (SELECT ic.idindicador
                   FROM DatIndicadorcentrobalance ic
                   INNER JOIN ic.DatEntidaddatosnomenclador ed
                   on (ic.identidaddatosnomenclador = ed.identidaddatosnomenclador)
                   WHERE ed.identidad = '. $identidadL . ') )'
            )->execute();
        return $res;
    }

    private function addWhereConParams(&$where, &$paramsQuery, $columCond,$param)
    {
        $where .= " AND " . $columCond;
        $paramsQuery[] = $param;
    }

    private function addWhereSinParams(&$where, $columCond)
    {
        $where .= " AND " . $columCond;
    }

    private function addWhereConParamsFoo(&$foo, $columCond, $param)
    {
        $foo .= " AND " . $columCond . $param;
    }

    private function addHavigConParamsFoo(&$addHaving, $columCond, $param)
    {
        $addHaving .= " AND " . $columCond . $param;
    }

    private function addWhereSinParamsFoo(&$foo, $columCond)
    {
        $foo .= " AND " . $columCond;
    }

//ESTE METODO SE EMPLEA TAMBIEN PARA LISTAR LOS INDICADORES DEL DESGLOSE POR VIA DE ADQUISICION
    public function listarIndCB($start, $limit, $parametros)
    {
        //objeto conex de Doctrine
        $conn = Doctrine_Manager::connection();

        $identidadmodelo = DatEntidadmodelo::getIdentidadmodelo(
            $parametros['idmodelo'], $parametros['idcb']
        );
        $parametros['identidadmodelo'] = $identidadmodelo[0]['identidadmodelo'];

        $paramsQuery = array();
        $myentidad = $parametros['idcb'];
        $mymodelo = $parametros['idmodelo'];
        $myentdatnom = $parametros['identidaddatosnomenclador'];

        $addwhere = "";
        $foo = " Where true  ";
        $addHaving = "Having true ";

        //tratamiento del filtro
        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $p => $s) {
                if ($s != null) {
                    if ($p == 'codigo') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery, "i.codigo  LIKE ? ",
                            ("$s%")
                        );
                    } elseif ($p == 'denominacion') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            "upper(i.denominacion)  LIKE ? ",
                            ("%" . strtoupper($s) . "%")
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
                            $addwhere, $paramsQuery,
                            "upper(i.numeropieza)  LIKE ? ",
                            ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'precio_condicion1'
                        || $p == 'precio_condicion2'|| $p == 'precio_condicion3'
                    ) {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            "ipnif.precio " . $s['condicion'] . " ? ",
                            $s['precio']
                        );
                    } elseif ($p == 'denominacioncb') {
                        $entidaddatosnom
                            = DatEntidaddatosnomenclador::getIdDatosNom($s);
                        self::addWhereConParams(
                            $addwhere, $paramsQuery, 'p.idcentrobalance =?',
                            $entidaddatosnom[0]['identidaddatosnomenclador']
                        );
                    } elseif ($p == 'necesidad_condicion1'
                        || $p == 'necesidad_condicion2'
                        || $p == 'necesidad_condicion3'
                    ) {

                        self::addHavigConParamsFoo(
                            $addHaving, "SUM(foo.necesidad) " . $s['condicion'], $s['necesidad']
                        );
                    } elseif ($p == 'coberturaparcialestimada_condicion1'
                        || $p == 'coberturaparcialestimada_condicion2'
                        || $p == 'coberturaparcialestimada_condicion3'
                    ) {

                        self::addWhereConParamsFoo(
                            $foo, "(SELECT COALESCE(SUM(coberturaparcialestimada),0)
                            FROM mod_planificacion.dat_ajusteexistenciacb aecb
                            WHERE identidad = $myentidad
                            AND idmodelo = $mymodelo AND idindicador = foo.idindicador
                            AND idejercicio = ". $parametros['idejercicio'] . ") "
                            . $s['condicion'], $s['coberturaparcialestimada']
                        );
                    } elseif ($p == 'coberturatotalestimada_condicion1'
                        || $p == 'coberturatotalestimada_condicion2'
                        || $p == 'coberturatotalestimada_condicion3'
                    ) {

                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            "COALESCE(ae.coberturatotalestimada,0) "
                            . $s['condicion'] . " ? ",
                            $s['coberturatotalestimada']
                        );
                    } elseif ($p == 'importe_condicion1'
                        || $p == 'importe_condicion2'|| $p == 'importe_condicion3'
                    ) {

                        self::addHavigConParamsFoo(
                            $addHaving, "(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                            FROM mod_planificacion.dat_odcte odcte
                            WHERE idmodelo = $mymodelo AND idindicador = foo.idindicador
                            AND idejercicio = ". $parametros['idejercicio'] . ") -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0)
					+ COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $myentidad
					AND idmodelo = $mymodelo
					AND idindicador = foo.idindicador
					AND idejercicio = " . $parametros['idejercicio']
                            . "),0))) * foo.precio" . $s['condicion'],
                            $s['importe']
                        );
                    } elseif ($p == 'importemlc_condicion1'
                        || $p == 'importemlc_condicion2'|| $p == 'importemlc_condicion3'
                    ) {
                        self::addHavigConParamsFoo(
                            $addHaving, "(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                            FROM mod_planificacion.dat_odcte odcte
                            WHERE idmodelo = $mymodelo AND idindicador = foo.idindicador
                            AND idejercicio = ". $parametros['idejercicio'] . ") -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0)
					+ COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $myentidad AND idmodelo = $mymodelo
					AND idindicador = foo.idindicador
					AND idejercicio = " . $parametros['idejercicio']
                            . "),0))) * foo.preciodivisa) * foo.preciodivisa "
                            . $s['condicion'], $s['importemlc']
                        );
                    } elseif ($p == 'flete_condicion1'
                        || $p == 'flete_condicion2'|| $p == 'flete_condicion3'
                    ) {

                        self::addHavigConParamsFoo(
                            $addHaving, "((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                            FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
                            AND idindicador = foo.idindicador AND idejercicio = "
                            . $parametros['idejercicio'] . ") -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0)
					+ COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $myentidad
					AND idmodelo = $mymodelo
					AND idindicador = foo.idindicador
					AND idejercicio = " . $parametros['idejercicio']
                            . "),0))) * precio) * (foo.flete)/100"
                            . $s['condicion'], $s['flete']
                        );
                    } elseif ($p == 'contingencia_condicion1'
                        || $p == 'contingencia_condicion2'
                        || $p == 'contingencia_condicion3'
                    ) {

                        self::addHavigConParamsFoo(
                            $addHaving, "((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                            FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
                            AND idindicador = foo.idindicador AND idejercicio = "
                            . $parametros['idejercicio'] . ") -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0)
					+ COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $myentidad
					AND idmodelo = $mymodelo
					AND idindicador = foo.idindicador
					AND idejercicio = " . $parametros['idejercicio']
                            . "),0))) * precio) * (foo.contingencia)/100"
                            . $s['condicion'], $s['contingencia']
                        );
                    } elseif ($p == 'importefila_condicion1'
                        || $p == 'importefila_condicion2'|| $p == 'importefila_condicion3'
                    ) {

                        self::addHavigConParamsFoo(
                            $addHaving, "(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
					FROM mod_planificacion.dat_odcte odcte
					WHERE idmodelo = $mymodelo AND idindicador = foo.idindicador
					AND idejercicio = " . $parametros['idejercicio'] . ") -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0)
					+ COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $myentidad AND idmodelo = $mymodelo
					AND idindicador = foo.idindicador
					AND idejercicio = " . $parametros['idejercicio'] . "),0))) * foo.precio +
					((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
					FROM mod_planificacion.dat_odcte odcte
					WHERE idmodelo = $mymodelo
					AND idindicador = foo.idindicador
					AND idejercicio = " . $parametros['idejercicio'] . ") -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0)
					+ COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $myentidad AND idmodelo = $mymodelo
					AND idindicador = foo.idindicador
					AND idejercicio = " . $parametros['idejercicio'] . "),0))) * precio) * (foo.flete)/100 +
					((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
					FROM mod_planificacion.dat_odcte odcte
					WHERE idmodelo = $mymodelo AND idindicador = foo.idindicador
					AND idejercicio = " . $parametros['idejercicio'] . ") -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0)
					+ COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $myentidad AND idmodelo = $mymodelo
					AND idindicador = foo.idindicador
					AND idejercicio = " . $parametros['idejercicio']
                            . "),0))) * precio) * (foo.contingencia)/100"
                            . $s['condicion'], $s['importefila']
                        );
                    } else {
                        if ($p == 'idaprobacionsi') {
                            self::addWhereSinParamsFoo(
                                $foo,
                                "(SELECT idaprobacion
                                FROM mod_planificacion.dat_ajusteexistenciacb
                                WHERE identidad = $myentidad AND idmodelo = $mymodelo
                                AND idindicador = foo.idindicador AND idejercicio = "
                                . $parametros['idejercicio'] . ") > 1"
                            );
                        } else {
                            if ($p == 'idaprobacionno') {
                                self::addWhereSinParamsFoo(
                                    $foo,
                                    "(SELECT idaprobacion
                                    FROM mod_planificacion.dat_ajusteexistenciacb
                                    WHERE identidad = $myentidad AND idmodelo = $mymodelo
                                    AND idindicador = foo.idindicador AND idejercicio = "
                                    . $parametros['idejercicio'] . ") = 1 "
                                );
                            } elseif ($p == 'demanda_condicion1'
                                || $p == 'demanda_condicion2'|| $p == 'demanda_condicion3'
                            ) {

                                self::addHavigConParamsFoo(
                                    $addHaving, "SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                            FROM mod_planificacion.dat_odcte odcte
                            WHERE idmodelo = $mymodelo AND idindicador = foo.idindicador
                            AND idejercicio = ". $parametros['idejercicio'] . ") -
                    (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0)
                    + COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $myentidad
					AND idmodelo = $mymodelo AND idindicador = foo.idindicador
					AND idejercicio = " . $parametros['idejercicio'] . "),0))"
                                    . $s['condicion'], $s['demanda']
                                );
                            } elseif ($p == 'denomviaadquisicion') {
                                self::addWhereConParamsFoo(
                                    $foo,
                                    'upper (foo.viaadquisicion ) =',
                                    "upper( '" . $s . "' )"
                                );
                            } elseif ($p == 'denomorganosatisface') {
                                self::addWhereConParamsFoo(
                                    $foo,
                                    "upper(foo.organosatisface)  LIKE  ",
                                    ("'%" . strtoupper($s) . "%'")
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
            $comparacionElab
                = " AND  ipnif.idaprobacion > 1 AND i.estado = 1 AND ipnif.nivelplanif = 1";
        }
        if ($parametros['idejercicio']) {
            $arrayIdejercicio
                = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio']
                == $parametros['idejercicio']
            ) {
                self::addWhereSinParams($addwhere, " i.estado = 1");
            }
        }
        //consulta general para obtener los indicadores
        $consultageneral
            = self::consultaGeneral(
                $myentidad, $mymodelo, $parametros,
                $comparacionElab, $myentdatnom, $addwhere, $foo, $addHaving
            );
        if ($start != null && $limit != null) {
            //se le agrega el limit y start a la consulta general

            $consultageneral .= " OFFSET $start LIMIT $limit";
        }
        
        $res = $conn->execute($consultageneral, $paramsQuery);
        $arrayindicadores = $res->fetchAll(PDO::FETCH_ASSOC);
        //consulta para obtener el total de indicadores e importes
        $consultatotalimportes
            = self::consultaTotalImportes(
                $myentidad, $mymodelo, $parametros,
                $myentdatnom, $addwhere, $foo, $addHaving
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

    public function select()
    {
        $select = "SELECT SUM(pru.importeMN) as importeMN, SUM(pru.importemlc) as importemlc,
SUM(pru.importeflete) as importeflete, SUM(pru.importecontingencia) as importecontingencia,
SUM(pru.importetotal) as importetotal, SUM(pru.importenecesidad) as importenecesidad,
sum(pru.importeajustado) as importeajustado, COUNT(pru.idindicador) as total";
        return $select;
    }

    public function groupBy($addHaving)
    {
        $group = "Group by foo.idindicador,
                    foo.codigo,foo.precio,foo.preciodivisa,foo.numeropieza,foo.flete,
                    foo.contingencia,foo.denominacion,foo.denominacioncb,foo.unidadmedida,
                    foo.idnaturaleza,foo.coberturatotalestimada,foo.viaadquisicion,
                    foo.organosatisface $addHaving and SUM(foo.necesidad)>0 order by foo.codigo";
        return $group;
    }
    
    public function consultaTotalImportes($myentidad, $mymodelo, $parametros,
        $myentdatnom, $addwhere, $foo, $addHaving)
    {
        $select = self::select(); $groupby = self::groupBy($addHaving);
        $consultaImportes = " $select FROM
(SELECT foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,foo.numeropieza,
        foo.denominacion,foo.denominacioncb,foo.unidadmedida,foo.idnaturaleza,
        foo.coberturatotalestimada,foo.viaadquisicion,foo.organosatisface,
        SUM(foo.necesidad) as necesidadod,(SELECT idaprobacion FROM mod_planificacion.
        dat_ajusteexistenciacb WHERE identidad = $myentidad AND "
        . "idmodelo = $mymodelo AND idindicador = foo.idindicador AND "
        . "idejercicio = ". $parametros['idejercicio'] . ") as idaprobacion,
        SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
        FROM mod_planificacion.dat_odcte odcte

WHERE idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = "  . $parametros['idejercicio'] . ") as necesidad,
(SELECT COALESCE(SUM(coberturaparcialestimada),0)
FROM mod_planificacion.dat_ajusteexistenciacb aecb
WHERE identidad = $myentidad AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros['idejercicio'] . ") as coberturaparcialestimada,
SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte

WHERE idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = ". $parametros['idejercicio'] . ") -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb
WHERE identidad = $myentidad AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros['idejercicio'] . "),0)) as demanda,

(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador AND idejercicio = ". $parametros['idejercicio'] . ") -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb
WHERE identidad = $myentidad AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros['idejercicio'] . "),0))) * foo.precio as importeMN,

(SELECT COALESCE(SUM(coberturaparcialestimada),0) FROM mod_planificacion.dat_ajusteexistenciacb aecb
WHERE identidad = $myentidad AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros['idejercicio'] . ")  * foo.precio +

(SELECT COALESCE(SUM(coberturaparcialestimada),0)
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = ". $parametros['idejercicio'] . ")  * foo.precio * (foo.flete)/100 +

(SELECT COALESCE(SUM(coberturaparcialestimada),0)
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = ". $parametros['idejercicio'] . ")  * foo.precio * (foo.contingencia)/100 as
    importeajustado,

(SUM(foo.necesidad)) * foo.precio + (SUM(foo.necesidad)) * foo.precio * (foo.flete)/100 +
(SUM(foo.necesidad)) * foo.precio * (foo.contingencia)/100 as importenecesidad,

(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador
AND idejercicio = ". $parametros['idejercicio'] . ") -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros['idejercicio'] . "),0))) *foo.preciodivisa as importemlc,

((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador
AND idejercicio = ". $parametros['idejercicio'] . ") -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros['idejercicio'] . "),0))) * precio) *
    (foo.flete)/100 as importeflete,

((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte

WHERE idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = ". $parametros['idejercicio'] . ") -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros['idejercicio'] . "),0))) * precio) *
    (foo.contingencia)/100 as importecontingencia,

(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte

WHERE idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros['idejercicio'] . ") -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros['idejercicio'] . "),0))) * foo.precio +

((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador AND idejercicio = " . $parametros['idejercicio'] . ") -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros['idejercicio'] . "),0))) * precio) *
    (foo.flete)/100 +

((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador AND idejercicio = " . $parametros['idejercicio'] . ") -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros['idejercicio'] . "),0))) * precio) *
    (foo.contingencia)/100 as importetotal

FROM (SELECT i.idindicador,i.codigo,ipnif.precio,ipnif.preciodivisa,i.numeropieza,
i.denominacion,i.idnaturaleza,ipnif.flete,ipnif.contingencia,e.denominacion  as denominacioncb,
um.abreviaturaunidadmedida as unidadmedida,dn.denominacion as naturaleza,
SUM(p.cantidad + p.ajuste) as necesidad,ae.coberturatotalestimada as coberturatotalestimada ,
p.viasadquisicion as viaadquisicion,p.organossatisface as organosatisface

FROM mod_planificacion.dat_planificacion p
INNER JOIN mod_datosmaestros.nom_indicador i on p.idindicador=i.idindicador
INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on i.idindicador = ipnif.idindicador
INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn on
p.idcentrobalance = edn.identidaddatosnomenclador
INNER JOIN mod_estructuracomp.dat_estructura e on edn.identidad = e.idestructura
INNER JOIN mod_planificacion.dat_entidadmodelo em on p.identidadmodelo = em.identidadmodelo
LEFT JOIN  mod_planificacion.dat_ajusteexistencia ae on (p.idindicador =
ae.idindicador AND ae.identidad = $myentidad AND ae.idejercicio = p.idejercicio)
LEFT JOIN mod_planificacion.dat_odcte odcte on (p.idindicador =
odcte.idindicador AND odcte.identidad= em.identidad AND em.idmodelo =
odcte.idmodelo AND odcte.idejercicio = p.idejercicio)
INNER JOIN mod_datosmaestros.nom_unidadmedida um ON (um.idunidadmedida = i.idumedida)
INNER JOIN mod_datosmaestros.nom_naturaleza dn ON(dn.idnaturaleza = i.idnaturaleza)

WHERE em.idmodelo = $mymodelo AND p.idejercicio = " . $parametros['idejercicio'] . "
AND ipnif.nivelplanif = 1 AND ipnif.idaprobacion = 4 AND e.idproyecto = 0
AND p.idcentrobalance = $myentdatnom $addwhere
Group by i.idindicador,i.idnaturaleza,p.viasadquisicion,p.organossatisface,
i.codigo,ipnif.precio,ipnif.preciodivisa,i.numeropieza,ipnif.flete,ipnif.contingencia,
i.denominacion,e.denominacion,um.abreviaturaunidadmedida,dn.denominacion,ae.coberturatotalestimada
order by i.codigo) as foo $foo  $groupby) as pru";
        return $consultaImportes;
    }

    public function selectUno()
    {
     $select = "SELECT foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,
                foo.numeropieza,foo.denominacion,foo.denominacioncb,foo.unidadmedida,
                COALESCE(foo.reservaministerial,0) as reservaministerial,
                COALESCE(foo.cantidadeconomia,0) as cantidadeconomia,
                foo.idnaturaleza,foo.coberturatotalestimada,foo.viaadquisicion,foo.organosatisface";
        return $select;
    }

    public function groupbyUno($addHaving)
    {
        $group = "Group by foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,
                    foo.numeropieza,foo.flete,foo.contingencia,foo.denominacion,
                    foo.denominacioncb,foo.unidadmedida,foo.idnaturaleza,
                    foo.reservaministerial,
                    foo.cantidadeconomia,
                    foo.coberturatotalestimada,foo.viaadquisicion,foo.organosatisface
                    $addHaving and SUM(foo.necesidad)>0 order by foo.codigo";
        return $group;
    }

    public function consultaGeneral($myentidad, $mymodelo, $parametros,
        $comparacionElab, $myentdatnom, $addwhere, $foo, $addHaving)
    {
        $select = self::selectUno();
        $groupBy = self::groupbyUno($addHaving);
        $consulta = "$select,
                    SUM(foo.necesidad) as necesidadod,
                   
                     COALESCE((SELECT idaprobacion
                     FROM mod_planificacion.dat_ajusteexistenciacb
                     WHERE identidad = $myentidad AND idmodelo = $mymodelo
                     AND idindicador = foo.idindicador AND idejercicio = "
            . $parametros['idejercicio'] . "),1) as idaprobacion,
                    SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                    FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
                    AND idindicador = foo.idindicador AND idejercicio = "
            . $parametros['idejercicio'] . ") as necesidad,
                    (SELECT COALESCE(SUM(coberturaparcialestimada),0)
                    FROM mod_planificacion.dat_ajusteexistenciacb aecb
                    WHERE identidad = $myentidad AND idmodelo = $mymodelo
                    AND idindicador = foo.idindicador AND idejercicio = "
            . $parametros['idejercicio'] . ") as coberturaparcialestimada,
                    SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                    FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
                    AND idindicador = foo.idindicador AND idejercicio = "
            . $parametros['idejercicio'] . ") -
                    (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0)
                    + COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $myentidad AND idmodelo = $mymodelo
					AND idindicador = foo.idindicador
					AND idejercicio = " . $parametros['idejercicio'] . "),0)) as demanda,
                    (SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                    FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
                    AND idindicador = foo.idindicador AND idejercicio = "
            . $parametros['idejercicio'] . ") -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros['idejercicio'] . "),0))) * foo.precio as importe,

(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte  WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador AND idejercicio = ". $parametros['idejercicio'] . ") -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0)
+ COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros['idejercicio'] . "),0))) *foo.preciodivisa as importemlc,

((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador AND idejercicio = ". $parametros['idejercicio'] . ") -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros['idejercicio'] . "),0))) * precio)*(foo.flete)/100 as flete,

((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador AND idejercicio = ". $parametros['idejercicio'] . ") -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb
WHERE identidad = $myentidad AND idmodelo = $mymodelo
AND idindicador = foo.idindicador
AND idejercicio = " . $parametros['idejercicio'] . "),0))) * precio) *
(foo.contingencia)/100 as contingencia,

(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador AND idejercicio = " . $parametros['idejercicio'] . ") -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros['idejercicio'] . "),0))) * foo.precio +
((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte

WHERE idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros['idejercicio'] . ") -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros['idejercicio'] . "),0))) * precio)*(foo.flete)/100 +
((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador AND idejercicio = " . $parametros['idejercicio'] . ") -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros['idejercicio'] . "),0))) * precio) *
(foo.contingencia)/100 as importefila FROM (SELECT i.idindicador,i.codigo,
p.precio,p.preciodivisa,i.numeropieza,i.denominacion,i.idnaturaleza,
ipnif.flete,ipnif.contingencia,e.denominacion  as denominacioncb,
um.abreviaturaunidadmedida as unidadmedida,dn.denominacion as naturaleza,
SUM(p.cantidad + p.ajuste) as necesidad,
COALESCE(ae.reservaministerial,0) as reservaministerial,
COALESCE(ae.cantidadeconomia,0) as cantidadeconomia,
COALESCE(ae.coberturatotalestimada,0) as coberturatotalestimada,
p.viasadquisicion as viaadquisicion,p.organossatisface as organosatisface
FROM mod_planificacion.dat_planificacion p
INNER JOIN mod_datosmaestros.nom_indicador i on p.idindicador = i.idindicador
INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on i.idindicador = ipnif.idindicador
INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn on p.idcentrobalance = edn.identidaddatosnomenclador
INNER JOIN mod_estructuracomp.dat_estructura e on edn.identidad = e.idestructura
INNER JOIN mod_planificacion.dat_entidadmodelo em on p.identidadmodelo = em.identidadmodelo
LEFT JOIN  mod_planificacion.dat_ajusteexistencia ae on (p.idindicador = ae.idindicador
AND ae.identidad = $myentidad AND ae.idejercicio = p.idejercicio)
LEFT JOIN mod_planificacion.dat_odcte odcte on (i.idindicador = odcte.idindicador
AND odcte.identidad= em.identidad AND em.idmodelo = odcte.idmodelo AND odcte.idejercicio = p.idejercicio)
INNER JOIN mod_datosmaestros.nom_unidadmedida um ON (um.idunidadmedida = i.idumedida)
INNER JOIN mod_datosmaestros.nom_naturaleza dn ON (dn.idnaturaleza = i.idnaturaleza)
WHERE em.idmodelo = $mymodelo " . $comparacionElab . "
AND p.idejercicio = " . $parametros['idejercicio'] . " AND ipnif.nivelplanif = 1
AND ipnif.idaprobacion = 4 AND e.idproyecto = 0 AND p.idcentrobalance = $myentdatnom
$addwhere Group by i.idindicador,i.idnaturaleza,p.viasadquisicion,p.organossatisface,
i.codigo,p.precio,p.preciodivisa ,i.numeropieza,ipnif.flete,ipnif.contingencia,
i.denominacion,e.denominacion,um.abreviaturaunidadmedida,dn.denominacion,ae.coberturatotalestimada,
ae.reservaministerial,
ae.cantidadeconomia
order by i.codigo) as foo
$foo $groupBy";
        return $consulta;
    }

    public function obtenerDatosDelReporteCBBalancear($parametros)
    {
        $idejercicio = $parametros->idejercicio;
        $conn = Doctrine_Manager::connection();
        $addwhere = "";
        $foo = " Where true";
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

        $consultageneral = self::consultaGeneralUno($idejercicio, $addwhere, $foo, $parametros);
        $dato = $conn->execute($consultageneral);
        $datos = $dato->fetchAll();

        return $datos;
    }

    public function selectDos()
    {
        $select = "SELECT foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,
foo.numeropieza,foo.denominacion,foo.denominacioncb,foo.coberturatotalestimada,
foo.viaadquisicion,foo.organosatisface";
        return $select;
    }

    public function groupbyDos($parametros)
    {
        $group = "Group by foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,
            foo.numeropieza,foo.flete,foo.contingencia,foo.denominacion,foo.denominacioncb,
            foo.coberturatotalestimada,foo.viaadquisicion,foo.organosatisface
    order by foo.codigo offset $parametros->start limit $parametros->limit";
        return $group;
    }

    public function consultaGeneralUno($idejercicio, $addwhere, $foo, $parametros)
    {
        $select = self::selectDos(); $group = self::groupbyDos($parametros);
        $consulta = "$select,
SUM(foo.necesidad) as necesidadod,
 COALESCE((SELECT idaprobacion FROM mod_planificacion.dat_ajusteexistenciacb
 WHERE identidad = $parametros->identidad AND idmodelo = $parametros->idmodelo
 AND idindicador = foo.idindicador AND idejercicio = $idejercicio),1) as idaprobacion,
SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe FROM mod_planificacion.dat_odcte odcte

WHERE idmodelo = $parametros->idmodelo AND idindicador = foo.idindicador
AND idejercicio = $idejercicio) as necesidad, (SELECT COALESCE(SUM(coberturaparcialestimada),0)
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $parametros->identidad
AND idmodelo = $parametros->idmodelo AND idindicador = foo.idindicador
AND idejercicio = $idejercicio) as coberturaparcialestimada,SUM(foo.necesidad)
- (SELECT COALESCE(SUM(cpe),0) as cpe FROM mod_planificacion.dat_odcte odcte

WHERE idmodelo = $parametros->idmodelo AND idindicador = foo.idindicador
AND idejercicio = $idejercicio) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb
WHERE identidad = $parametros->identidad AND idmodelo = $parametros->idmodelo
AND idindicador = foo.idindicador AND idejercicio = $idejercicio),0)) as demanda,

(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte

WHERE idmodelo = $parametros->idmodelo AND idindicador = foo.idindicador
AND idejercicio = $idejercicio) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb
WHERE identidad = $parametros->identidad AND idmodelo = $parametros->idmodelo
AND idindicador = foo.idindicador AND idejercicio = $idejercicio),0))) * foo.precio as importe,

(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $parametros->idmodelo
AND idindicador = foo.idindicador AND idejercicio = $idejercicio) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $parametros->identidad
AND idmodelo = $parametros->idmodelo AND idindicador = foo.idindicador
AND idejercicio = $idejercicio),0))) * foo.preciodivisa as importemlc,

((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $parametros->idmodelo
AND idindicador = foo.idindicador AND idejercicio = $idejercicio) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $parametros->identidad
AND idmodelo = $parametros->idmodelo AND idindicador = foo.idindicador
AND idejercicio = $idejercicio),0))) * precio) * (foo.flete)/100 as flete,

((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $parametros->idmodelo
AND idindicador = foo.idindicador AND idejercicio = $idejercicio) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $parametros->identidad
AND idmodelo = $parametros->idmodelo AND idindicador = foo.idindicador
AND idejercicio = $idejercicio),0))) * precio)*(foo.contingencia)/100 as contingencia,

(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $parametros->idmodelo
AND idindicador = foo.idindicador AND idejercicio = $idejercicio) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $parametros->identidad
AND idmodelo = $parametros->idmodelo AND idindicador = foo.idindicador
AND idejercicio = $idejercicio),0))) * foo.precio +
((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $parametros->idmodelo
AND idindicador = foo.idindicador AND idejercicio = $idejercicio) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0)
+ COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb
WHERE identidad = $parametros->identidad AND idmodelo = $parametros->idmodelo
AND idindicador = foo.idindicador AND idejercicio = $idejercicio),0))) * precio)
* (foo.flete)/100 + ((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $parametros->idmodelo
AND idindicador = foo.idindicador AND idejercicio = $idejercicio) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb
WHERE identidad = $parametros->identidad AND idmodelo = $parametros->idmodelo
AND idindicador = foo.idindicador AND idejercicio = $idejercicio),0))) * precio)
* (foo.contingencia)/100 as importefila
   FROM (SELECT i.idindicador,i.codigo,ipnif.precio,ipnif.preciodivisa,i.numeropieza,
                    i.denominacion,ipnif.flete,ipnif.contingencia,e.denominacion as denominacioncb,
SUM(p.cantidad + p.ajuste) as necesidad,ae.coberturatotalestimada as coberturatotalestimada,
p.viasadquisicion as viaadquisicion,p.organossatisface as organosatisface
FROM mod_planificacion.dat_planificacion p
INNER JOIN mod_datosmaestros.nom_indicador i on p.idindicador=i.idindicador
INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on
i.idindicador = ipnif.idindicador INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn on
p.idcentrobalance = edn.identidaddatosnomenclador
INNER JOIN mod_estructuracomp.dat_estructura e on edn.identidad = e.idestructura
INNER JOIN mod_planificacion.dat_entidadmodelo em on p.identidadmodelo = em.identidadmodelo
LEFT JOIN  mod_planificacion.dat_ajusteexistencia ae on (p.idindicador =
ae.idindicador AND ae.identidad = $parametros->identidad
AND ae.idejercicio = p.idejercicio)
LEFT JOIN mod_planificacion.dat_odcte odcte on (i.idindicador =
odcte.idindicador AND odcte.identidad= em.identidad AND em.idmodelo =
odcte.idmodelo AND odcte.idejercicio = p.idejercicio)

WHERE em.idmodelo = $parametros->idmodelo AND p.idejercicio = $idejercicio AND i.estado=1
AND p.idcentrobalance = $parametros->idcb $addwhere
Group by i.idindicador,p.viasadquisicion, p.organossatisface ,i.codigo,
ipnif.precio,ipnif.preciodivisa,i.numeropieza,ipnif.flete,ipnif.contingencia,
i.denominacion,e.denominacion,ae.coberturatotalestimada order by i.codigo) as foo
$foo $group";
        return $consulta;
    }

    public function contarIndicadoresTotalReporteCB($parametros)
    {

        $idejercicio = $parametros->idejercicio;
        $conn = Doctrine_Manager::connection();
        $addwhere = "";
        $foo = " Where true";
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
        $consultatotalimportes
            = self::consultaTotalImportesUno($idejercicio, $addwhere, $foo, $parametros);
        $dato = $conn->execute($consultatotalimportes);
        $datos = $dato->fetchAll();
        return $datos[0]['total'];
    }

    public function selectCuatro()
    {
        $consulta = "SELECT SUM(pru.importeMN) as importeMN, SUM(pru.importemlc) as importemlc,
SUM(pru.importeflete) as importeflete, SUM(pru.importecontingencia) as importecontingencia,
SUM(pru.importetotal) as importetotal, SUM(pru.importenecesidad) as importenecesidad,
sum(pru.importeajustado) as importeajustado, COUNT(pru.idindicador) as total";
        return $consulta;
    }

    public function selectCinco()
    {
        $consulta = "SELECT foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,
foo.numeropieza,foo.denominacion,foo.denominacioncb,foo.coberturatotalestimada,
foo.viaadquisicion,foo.organosatisface,SUM(foo.necesidad) as necesidadod";
        return $consulta;
    }

    public function consultaTotalImportesUno($idejercicio, $addwhere, $foo, $parametros)
    {
        $select = self::selectCuatro(); $selectUno = self::selectCinco();
        $group = self::groupByTres(); $groupUno = self::groupByCuatro();
        $consulta = "$select FROM ($selectUno,
(SELECT idaprobacion FROM mod_planificacion.dat_ajusteexistenciacb WHERE
identidad = $parametros->identidad  AND idmodelo = $parametros->idmodelo "
            . "AND idindicador = foo.idindicador AND idejercicio = "
            . "$idejercicio) as idaprobacion,
SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
 FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $parametros->idmodelo
        AND idindicador = foo.idindicador AND idejercicio = $idejercicio) as necesidad,
(SELECT COALESCE(SUM(coberturaparcialestimada),0)
 FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $parametros->identidad
        AND idmodelo = $parametros->idmodelo AND idindicador = foo.idindicador
        AND idejercicio = $idejercicio) as coberturaparcialestimada,
SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
        FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $parametros->idmodelo
AND idindicador = foo.idindicador AND idejercicio = $idejercicio) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $parametros->identidad
AND idmodelo = $parametros->idmodelo AND idindicador = foo.idindicador
AND idejercicio = $idejercicio),0)) as demanda,

(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $parametros->idmodelo
AND idindicador = foo.idindicador AND idejercicio = $idejercicio) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $parametros->identidad
AND idmodelo = $parametros->idmodelo AND idindicador = foo.idindicador
AND idejercicio = $idejercicio),0))) * foo.precio as importeMN,

(SELECT COALESCE(SUM(coberturaparcialestimada),0)
 FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $parametros->identidad
 AND idmodelo = $parametros->idmodelo AND idindicador = foo.idindicador
 AND idejercicio = $idejercicio)  * foo.precio + (SELECT COALESCE(SUM(coberturaparcialestimada),0)
 FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $parametros->identidad
  AND idmodelo = $parametros->idmodelo AND idindicador = foo.idindicador
  AND idejercicio = $idejercicio)  * foo.precio * (foo.flete)/100 +

(SELECT COALESCE(SUM(coberturaparcialestimada),0)
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $parametros->identidad
AND idmodelo = $parametros->idmodelo AND idindicador = foo.idindicador
AND idejercicio = $idejercicio)  * foo.precio * (foo.contingencia)/100 as importeajustado,

(SUM(foo.necesidad)) * foo.precio + (SUM(foo.necesidad)) * foo.precio * (foo.flete)/100 +
(SUM(foo.necesidad)) * foo.precio * (foo.contingencia)/100 as importenecesidad,

(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $parametros->idmodelo
AND idindicador = foo.idindicador AND idejercicio = $idejercicio) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $parametros->identidad
AND idmodelo = $parametros->idmodelo AND idindicador = foo.idindicador
AND idejercicio = $idejercicio),0))) * foo.preciodivisa as importemlc,

((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $parametros->idmodelo
AND idindicador = foo.idindicador AND idejercicio = $idejercicio) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $parametros->identidad
AND idmodelo = $parametros->idmodelo AND idindicador = foo.idindicador
AND idejercicio = $idejercicio),0))) * precio) *(foo.flete)/100 as importeflete,

((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $parametros->idmodelo
AND idindicador = foo.idindicador AND idejercicio = $idejercicio) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0)
+ COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $parametros->identidad
AND idmodelo = $parametros->idmodelo AND idindicador = foo.idindicador
AND idejercicio = $idejercicio),0))) * precio) * (foo.contingencia)/100 as importecontingencia,

(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $parametros->idmodelo
AND idindicador = foo.idindicador AND idejercicio =$idejercicio) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $parametros->identidad
AND idmodelo = $parametros->idmodelo AND idindicador = foo.idindicador
AND idejercicio = $idejercicio),0))) * foo.precio +

((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $parametros->idmodelo
AND idindicador = foo.idindicador AND idejercicio = $idejercicio) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $parametros->identidad
AND idmodelo = $parametros->idmodelo AND idindicador = foo.idindicador
AND idejercicio = $idejercicio),0))) * precio) * (foo.flete)/100 +

((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $parametros->idmodelo
AND idindicador = foo.idindicador AND idejercicio = $idejercicio) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $parametros->identidad
AND idmodelo = $parametros->idmodelo AND idindicador = foo.idindicador
AND idejercicio = $idejercicio),0))) * precio) * (foo.contingencia)/100 as
    importetotal FROM (SELECT i.idindicador,
i.codigo,ipnif.precio,ipnif.preciodivisa,i.numeropieza,i.denominacion,ipnif.flete,
ipnif.contingencia,e.denominacion as denominacioncb,SUM(p.cantidad + p.ajuste) as necesidad,
ae.coberturatotalestimada as coberturatotalestimada ,
 (SELECT va.denominacion FROM mod_datosmaestros.nom_viaadquisicion va
INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iva on va.
idviaadquisicion = iva.idviaadquisicion
 WHERE iva.idindicador = i.idindicador limit 1) as viaadquisicion,

(SELECT os.denominacion FROM mod_datosmaestros.dat_indicadorviaadquisicion iva
INNER JOIN  mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ivaos
on (iva.idindicador = ivaos.idindicador AND iva.idviaadquisicion = ivaos.idviaadquisicion)
INNER JOIN mod_datosmaestros.nom_organosatisface os on ivaos.idorganosatisface
= os.idorganosatisface WHERE iva.idindicador = i.idindicador limit 1) as organosatisface

FROM mod_planificacion.dat_planificacion p
INNER JOIN mod_datosmaestros.nom_indicador i on p.idindicador=i.idindicador
INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on i.idindicador =
ipnif.idindicador INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn on
p.idcentrobalance = edn.identidaddatosnomenclador
INNER JOIN mod_estructuracomp.dat_estructura e on edn.identidad = e.idestructura
INNER JOIN mod_planificacion.dat_entidadmodelo em on p.identidadmodelo = em.identidadmodelo
LEFT JOIN  mod_planificacion.dat_ajusteexistencia ae on (p.idindicador =
ae.idindicador AND ae.identidad = $parametros->identidad AND ae.idejercicio = p.idejercicio)
LEFT JOIN mod_planificacion.dat_odcte odcte on (p.idindicador =
odcte.idindicador AND odcte.identidad= em.identidad AND em.idmodelo =
odcte.idmodelo AND odcte.idejercicio = p.idejercicio)

WHERE em.idmodelo = $parametros->idmodelo AND p.idejercicio = $idejercicio
AND i.estado = 1 AND p.idcentrobalance = $parametros->idcb $addwhere $groupUno )
as foo $foo $group";
        return $consulta;
    }

    public function groupByTres()
    {
        $consulta = "Group by foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,
                    foo.numeropieza,foo.flete,foo.contingencia,foo.denominacion,
                    foo.denominacioncb,foo.coberturatotalestimada,foo.viaadquisicion,
                    foo.organosatisface order by foo.codigo) as pru";
        return $consulta;
    }

    public function groupByCuatro()
    {
        $consulta = "Group by i.idindicador,i.codigo,ipnif.precio,ipnif.preciodivisa,
        i.numeropieza,ipnif.flete,ipnif.contingencia,i.denominacion,e.denominacion,
        ae.coberturatotalestimada order by i.codigo";
        return $consulta;
    }

    public function obtenerObjExistenciaCB($parametros)
    {
        $query = new Doctrine_Query();
        $res = $query
            ->from('DatAjusteexistenciacb cb')
            ->where(
                'cb.identidadmodelo=? AND  cb.idajusteexistenciacb=? ',
                array($parametros->identidadmodelo,
                      $parametros->idajusteexistenciacb)
            )
            ->execute()->getFirst();
        return $res;
    }

    public function obtenerObjCB($parametros)
    {
        $query = new Doctrine_Query();
        $res = $query
            ->from('DatAjusteexistenciacb cb')
            ->where(
                'cb.idmodelo=? AND  cb.identidad=? AND cb.idindicador=? AND '
                . 'cb.idejercicio =? ',
                array($parametros->idmodelo, $parametros->identidad,
                      $parametros->idindicador, $parametros->idejercicio)
            )->execute()->getFirst();
        return $res;
    }

    public function obtnerIndicadoresConDemanda($limit, $start)
    {
        $addwhere = "";
        $addHaving = " HAVING true ";
        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $p => $s) {
                if ($s != null) {
                    if ($p == 'codigo') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery, "ind.codigo  LIKE ? ",
                            ("$s%")
                        );
                    } elseif ($p == 'denominacion') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            "upper(ind.denominacion)  LIKE ? ",
                            ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'numeropieza') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            "upper(ind.numeropieza)  LIKE ? ",
                            ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'precio_condicion1'
                        || $p == 'precio_condicion2'
                        || $p == 'precio_condicion3'
                    ) {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            "ipnif.precio " . $s['condicion'] . " ? ",
                            $s['precio']
                        );
                    } elseif ($p == 'denominacioncb') {
                        $entidaddatosnom
                            = DatEntidaddatosnomenclador::getIdDatosNom($s);
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            'indcb.identidaddatosnomenclador =?',
                            $entidaddatosnom[0]['identidaddatosnomenclador']
                        );
                    } elseif ($p == 'necesidad_condicion1'
                        || $p == 'necesidad_condicion2'
                        || $p == 'necesidad_condicion3'
                    ) {
                        self::addWhereConParams(
                            $addHaving, $paramsQuery,
                            " aeod.necesidad  " . $s['condicion'] . " ? ",
                            $s['necesidad']
                        );
                    } elseif ($p == 'coberturaparcialestimada_condicion1'
                        || $p == 'coberturaparcialestimada_condicion2'
                        || $p == 'coberturaparcialestimada_condicion3'
                    ) {
                        self::addWhereConParams(
                            $addHaving, $paramsQuery,
                            "SUM(d2.coberturaparcialestimada) "
                            . $s['condicion'] . " ? ",
                            $s['coberturaparcialestimada']
                        );
                    } elseif ($p == 'importe_condicion1'
                        || $p == 'importe_condicion2'
                        || $p == 'importe_condicion3'
                    ) {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            "d2.importedemanda " . $s['condicion'] . " ? ",
                            $s['importe']
                        );
                    } else {
                        if ($p == 'idaprobacionsi') {
                            self::addWhereSinParams(
                                $where, "d2.idaprobacion > 1"
                            );
                        } else {
                            if ($p == 'idaprobacionno') {
                                self::addWhereSinParams(
                                    $where, "d2.idaprobacion = 1 "
                                );
                            } elseif ($p == 'demanda_condicion1'
                                || $p == 'demanda_condicion2'
                                || $p == 'demanda_condicion3'
                            ) {
                                self::addWhereConParams(
                                    $addHaving, $paramsQuery,
                                    "SUM(d2.demanda) " . $s['condicion']
                                    . " ? ",
                                    $s['demanda']
                                );
                            }
                        }
                    }
                }
            }
        }

        $conn = Doctrine_Manager::connection();
        $query = self::consultaUno($start, $limit);
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);

        $query = self::consultaDos();

        $total = $conn->execute($query);
        $total = $total->fetchAll(PDO::FETCH_ASSOC);

        $result[20]['total'] = $total[0]['total'];
        $result[21]['importetotal'] = $total[0]['importetotal'];
        return $result;
    }

    public function consultaDos()
    {
        $consulta = "SELECT COUNT( aecb.idindicador ) as total,
SUM( round(COALESCE(aecb.demanda,0) * ipnif.precio, 3 )) as importetotal
             FROM mod_planificacion.dat_ajusteexistenciacb aecb
INNER JOIN mod_datosmaestros.nom_indicador ind ON( ind.idindicador = aecb.idindicador )
INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on
ind.idindicador = ipnif.idindicador WHERE  aecb.demanda >0 ";
        return $consulta;
    }

    public function selectNueve()
    {
        $consulta = "SELECT aecb.necesidad, aecb.demanda,
aecb.identidadmodelo, aecb.importedemanda, aecb.idajusteexistenciacb,
aecb.identidad, aecb.idmodelo, aecb.idindicador, aecb.idejercicio, ind.codigo,
ind.denominacion, ind.numeropieza, ipnif.precio, (aecb.demanda*ipnif.precio) as importe,
edn.identidaddatosnomenclador as idcentrobalance";
        return $consulta;
    }

    public function consultaUno($start, $limit)
    {
        $select = self::selectNueve();
        $consulta = " $select
FROM mod_planificacion.dat_ajusteexistenciacb aecb
INNER JOIN mod_datosmaestros.nom_indicador ind ON( ind.idindicador = aecb.idindicador )
INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on ind.idindicador= ipnif.idindicador
INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn
ON( edn.identidad = aecb.identidad AND edn.iddatosnomenclador = 1)WHERE  aecb.demanda >0
       ORDER BY ind.codigo OFFSET $start LIMIT $limit";
        return $consulta;
    }

    public function listarExportarIndicadoresAjusteCB($start, $limit,
        $parametros, $count
    )
    {
        $identidadmodelo = DatEntidadmodelo::getIdentidadmodelo(
            $parametros['idmodelo'], $parametros['idcb']
        );
        $parametros['identidadmodelo'] = $identidadmodelo[0]['identidadmodelo'];

        $paramsQuery = array();
        $paramsQuery[] = $parametros['idcb'];
        $paramsQuery[] = $parametros['idmodelo'];
        $paramsQuery[] = $parametros['identidadmodelo'];
        $paramsQuery[] = $parametros['identidaddatosnomenclador'];
        $addwhere = "";
        //$addHaving = " HAVING true ";
        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $p => $s) {
                if ($s != null) {
                    if ($p == 'codigo') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery, "ind.codigo  LIKE ? ",
                            ("$s%")
                        );
                    } elseif ($p == 'denominacion') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            "upper(ind.denominacion)  LIKE ? ",
                            ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'numeropieza') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            "upper(ind.numeropieza)  LIKE ? ",
                            ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'precio_condicion1'
                        || $p == 'precio_condicion2'
                        || $p == 'precio_condicion3'
                    ) {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            "ipnif.precio " . $s['condicion'] . " ? ",
                            $s['precio']
                        );
                    } elseif ($p == 'denominacioncb') {
                        $entidaddatosnom
                            = DatEntidaddatosnomenclador::getIdDatosNom($s);
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            'indcb.identidaddatosnomenclador =?',
                            $entidaddatosnom[0]['identidaddatosnomenclador']
                        );
                    } elseif ($p == 'necesidad_condicion1'
                        || $p == 'necesidad_condicion2'
                        || $p == 'necesidad_condicion3'
                    ) {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            " aecb.necesidad  " . $s['condicion'] . " ? ",
                            $s['necesidad']
                        );
                    } elseif ($p == 'coberturaparcialestimada_condicion1'
                        || $p == 'coberturaparcialestimada_condicion2'
                        || $p == 'coberturaparcialestimada_condicion3'
                    ) {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            "aecb.coberturaparcialestimada " . $s['condicion']
                            . " ? ",
                            $s['coberturaparcialestimada']
                        );
                    } elseif ($p == 'coberturatotalestimada_condicion1'
                        || $p == 'coberturatotalestimada_condicion2'
                        || $p == 'coberturatotalestimada_condicion3'
                    ) {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            "ae.coberturatotalestimada " . $s['condicion']
                            . " ? ",
                            $s['coberturatotalestimada']
                        );
                    } elseif ($p == 'importe_condicion1'
                        || $p == 'importe_condicion2'
                        || $p == 'importe_condicion3'
                    ) {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            "(aecb.demanda*ipnif.precio) " . $s['condicion']
                            . " ? ",
                            $s['importe']
                        );
                    } elseif ($p == 'importemlc_condicion1'
                        || $p == 'importemlc_condicion2'
                        || $p == 'importemlc_condicion3'
                    ) {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            "(aecb.demanda*ipnif.preciodivisa) "
                            . $s['condicion'] . " ? ",
                            $s['importemlc']
                        );
                    } elseif ($p == 'flete_condicion1'
                        || $p == 'flete_condicion2'
                        || $p == 'flete_condicion3'
                    ) {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            "((aecb.demanda*ipnif.precio)*ipnif.flete/100) "
                            . $s['condicion'] . " ? ", $s['flete']
                        );
                    } elseif ($p == 'contingencia_condicion1'
                        || $p == 'contingencia_condicion2'
                        || $p == 'contingencia_condicion3'
                    ) {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            "((aecb.demanda*ipnif.precio)*ipnif.contingencia/100) "
                            . $s['condicion'] . " ? ",
                            $s['contingencia']
                        );
                    } elseif ($p == 'importefila_condicion1'
                        || $p == 'importefila_condicion2'
                        || $p == 'importefila_condicion3'
                    ) {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            "((((aecb.demanda*ipnif.precio)*ipnif.flete)/100)+"
                            . "(((aecb.demanda*ipnif.precio)*"
                            . "ipnif.contingencia)/100)+(aecb.demanda*ipnif.precio)) "
                            . $s['condicion'] . " ? ", $s['importefila']
                        );
                    } else {
                        if ($p == 'idaprobacionsi') {
                            self::addWhereSinParams(
                                $addwhere, "aecb.idaprobacion > 1"
                            );
                        } else {
                            if ($p == 'idaprobacionno') {
                                self::addWhereSinParams(
                                    $addwhere, "aecb.idaprobacion = 1 "
                                );
                            } elseif ($p == 'demanda_condicion1'
                                || $p == 'demanda_condicion2'
                                || $p == 'demanda_condicion3'
                            ) {
                                self::addWhereConParams(
                                    $addwhere, $paramsQuery,
                                    "aecb.demanda " . $s['condicion'] . " ? ",
                                    $s['demanda']
                                );
                            }
                        }
                    }
                }
            }
        }

        $conn = Doctrine_Manager::connection();
        if (!$count) {
            $query = self::consultaTres($addwhere, $start, $limit);

            $res = $conn->execute($query, $paramsQuery);
            $result = $res->fetchAll(PDO::FETCH_ASSOC);
            $conn = Doctrine_Manager::connection();
        } else {
            $query = self::consultaCuatro($addwhere);
            $total = $conn->execute($query, $paramsQuery);
            $total = $total->fetchAll(PDO::FETCH_ASSOC);

            $result[20]['total'] = $total[0]['total'];
            $result[21]['importetotal'] = $total[0]['importetotal'];
            $result[22]['importeflete'] = $total[0]['importeflete'];
            $result[23]['importecontingencia']
                = $total[0]['importecontingencia'];
            $result[24]['importemn'] = $total[0]['importemn'];
            $result[25]['importemlc'] = $total[0]['importemlc'];
            $result[26]['importenecesidadtotal']
                = $total[0]['importenecesidadtotal'];
        }

        return $result;
    }

    public function selectSeis()
    {
        $consulta = "SELECT COUNT( aecb.idindicador ) as total,
SUM( (COALESCE(aecb.demanda,0) * ipnif.precio)+((COALESCE(aecb.demanda,0) *
ipnif.precio)*(ipnif.flete/100))+ ((COALESCE(aecb.demanda,0) * ipnif.precio)*
(ipnif.contingencia/100))) as importetotal,
SUM( (COALESCE(aecb.necesidad,0) * ipnif.precio)+((COALESCE(aecb.necesidad,0) *
ipnif.precio)*(ipnif.flete/100))+ ((COALESCE(aecb.necesidad,0) * ipnif.precio)*
(ipnif.contingencia/100))) as importenecesidadtotal,
sum((COALESCE(aecb.demanda,0) * ipnif.precio)*(ipnif.flete/100))as importeflete,
sum((COALESCE(aecb.demanda,0) * ipnif.precio)*(ipnif.contingencia/100)) as
importecontingencia,SUM(COALESCE(aecb.demanda,0) * ipnif.precio) as importeMN,
SUM(COALESCE(aecb.demanda,0) * ipnif.preciodivisa) as importeMLC";
        return $consulta;
    }

    public function consultaCuatro($addwhere)
    {
        $select = self::selectSeis();
        $consulta = " $select
FROM mod_planificacion.dat_ajusteexistenciacb aecb
INNER JOIN mod_datosmaestros.dat_indicadorcentrobalance indcb
ON( indcb.idindicador = aecb.idindicador AND aecb.idejercicio = 1 )
LEFT JOIN mod_planificacion.dat_entidaddatosnomenclador entdn
ON( indcb.identidaddatosnomenclador = entdn.identidaddatosnomenclador AND
entdn.iddatosnomenclador = 1) LEFT JOIN mod_planificacion.dat_ajusteexistencia ae
ON( ae.identidad = aecb.identidad AND ae.idindicador = aecb.idindicador AND
ae.idejercicio = 1) INNER JOIN mod_datosmaestros.nom_indicador ind
ON( ind.idindicador = aecb.idindicador )
INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on ind.idindicador =
ipnif.idindicador WHERE  aecb.identidad=? AND aecb.idmodelo=?
AND aecb.identidadmodelo=? AND entdn.identidaddatosnomenclador =? AND aecb.necesidad >0
$addwhere";
        return $consulta;
    }

    public function selectSiete()
    {
        $consulta = "SELECT aecb.necesidad, aecb.demanda,
aecb.reservaministerial, aecb.cantidadeconomia,aecb.coberturaparcialestimada, aecb.fechaajuste,
aecb.identidadmodelo, aecb.importedemanda,aecb.idajusteexistenciacb, aecb.idaprobacion,
aecb.identidad, aecb.idmodelo, aecb.idindicador,aecb.idejercicio, ind.codigo, ind.denominacion,
ind.numeropieza, ipnif.precio, (aecb.demanda*ipnif.precio) as importe,(aecb.demanda*ipnif.preciodivisa)
as importemlc,((aecb.demanda*ipnif.precio)*ipnif.flete/100)as flete,
((aecb.demanda*ipnif.precio)*ipnif.contingencia/100)as contingencia,
((((aecb.demanda*ipnif.precio)*ipnif.flete)/100)+(((aecb.demanda*ipnif.precio)
*ipnif.contingencia)/100)+(aecb.demanda*ipnif.precio)) as importefila,
ae.idajusteexistencia, ae.coberturatotalestimada";
        return $consulta;
    }

    public function consultaTres($addwhere, $start, $limit)
    {
        $select = self::selectSiete();
        $consulta = " $select
FROM mod_planificacion.dat_ajusteexistenciacb aecb
INNER JOIN mod_datosmaestros.dat_indicadorcentrobalance indcb
ON( indcb.idindicador = aecb.idindicador AND aecb.idejercicio = 1 )
LEFT JOIN mod_planificacion.dat_entidaddatosnomenclador entdn
ON( indcb.identidaddatosnomenclador = entdn.identidaddatosnomenclador AND
entdn.iddatosnomenclador = 1) LEFT JOIN mod_planificacion.dat_ajusteexistencia ae
ON( ae.identidad = aecb.identidad AND ae.idindicador = aecb.idindicador AND
ae.idejercicio = 1) INNER JOIN mod_datosmaestros.nom_indicador ind
ON( ind.idindicador = aecb.idindicador ) WHERE  aecb.identidad=? AND aecb.idmodelo=?
AND aecb.identidadmodelo=? AND entdn.identidaddatosnomenclador =? AND aecb.necesidad >0
 $addwhere ORDER BY ind.codigo OFFSET $start LIMIT $limit";
        return $consulta;
    }

    public function indicadoresDesgloseViaAdquisicion($start, $limit,
        $parametros
    )
    {


        //objeto conex de Doctrine
        $conn = Doctrine_Manager::connection();

        $identidadmodelo = DatEntidadmodelo::getIdentidadmodelo(
            $parametros['idmodelo'], $parametros['idcb']
        );

        $parametros['identidadmodelo'] = $identidadmodelo[0]['identidadmodelo'];

        $paramsQuery = array();
        $myentidad = $parametros['idcb'];
        $mymodelo = $parametros['idmodelo'];
        $myentdatnom = $parametros['identidaddatosnomenclador'];
        $consultavaraisvias = "";
        $addwhere = "";
        $foo = " Where true ";
        $addHaving = "Having true  ";
        //tratamiento del filtro
        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $p => $s) {
                if ($s != null) {
                    if ($p == 'codigo') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery, "i.codigo  LIKE ? ",
                            ("$s%")
                        );
                    } elseif ($p == 'denominacion') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            "upper(i.denominacion)  LIKE ? ",
                            ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'numeropieza') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            "upper(i.numeropieza)  LIKE ? ",
                            ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'precio_condicion1'
                        || $p == 'precio_condicion2'
                        || $p == 'precio_condicion3'
                    ) {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            "ipnif.precio " . $s['condicion'] . " ? ",
                            $s['precio']
                        );
                    } elseif ($p == 'idumedida') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery, 'i.idumedida =?', $s
                        );
                    }  elseif ($p == 'denominacioncb') {
                        $entidaddatosnom
                            = DatEntidaddatosnomenclador::getIdDatosNom($s);
                        self::addWhereConParams(
                            $addwhere, $paramsQuery, 'p.idcentrobalance =?',
                            $entidaddatosnom[0]['identidaddatosnomenclador']
                        );
                    } elseif ($p == 'necesidad_condicion1'
                        || $p == 'necesidad_condicion2'
                        || $p == 'necesidad_condicion3'
                    ) {

                        self::addHavigConParamsFoo(
                            $addHaving,
                            "  SUM(foo.necesidad) " . $s['condicion'],
                            $s['necesidad']
                        );
                    } elseif ($p == 'coberturaparcialestimada_condicion1'
                        || $p == 'coberturaparcialestimada_condicion2'
                        || $p == 'coberturaparcialestimada_condicion3'
                    ) {

                        self::addWhereConParamsFoo(
                            $foo, "(SELECT COALESCE(SUM(coberturaparcialestimada),0)
                            FROM mod_planificacion.dat_ajusteexistenciacb aecb
                            WHERE identidad = $myentidad AND idmodelo = $mymodelo
                            AND idindicador = foo.idindicador) "
                            . $s['condicion'], $s['coberturaparcialestimada']
                        );
                    } elseif ($p == 'coberturatotalestimada_condicion1'
                        || $p == 'coberturatotalestimada_condicion2'
                        || $p == 'coberturatotalestimada_condicion3'
                    ) {

                        self::addWhereConParams(
                            $addwhere, $paramsQuery,
                            "ae.coberturatotalestimada " . $s['condicion']
                            . " ? ",
                            $s['coberturatotalestimada']
                        );
                    } elseif ($p == 'importe_condicion1'
    || $p == 'importe_condicion2' || $p == 'importe_condicion3'
) {

    self::addHavigConParamsFoo(
        $addHaving, "(SELECT COALESCE(SUM(coberturaparcialestimada),0)
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador) * foo.precio "
        . $s['condicion'], $s['importe']
    );
                    } elseif ($p == 'importemlc_condicion1'
                        || $p == 'importemlc_condicion2'|| $p == 'importemlc_condicion3'
                    ) {

self::addHavigConParamsFoo(
    $addHaving, "(SELECT COALESCE(SUM(coberturaparcialestimada),0)
    FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
    AND idmodelo = $mymodelo AND idindicador = foo.idindicador) * foo.preciodivisa "
    . $s['condicion'], $s['importemlc']
);
                    } elseif ($p == 'flete_condicion1'
|| $p == 'flete_condicion2'|| $p == 'flete_condicion3'
) {

self::addHavigConParamsFoo(
    $addHaving, "((SELECT COALESCE(SUM(coberturaparcialestimada),0)
    FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
    AND idmodelo = $mymodelo AND idindicador = foo.idindicador) * precio) * (foo.flete)/100 "
    . $s['condicion'], $s['flete']
);
                    } elseif ($p == 'contingencia_condicion1'
                        || $p == 'contingencia_condicion2'|| $p == 'contingencia_condicion3'
                    ) {

self::addHavigConParamsFoo(
    $addHaving, "((SELECT COALESCE(SUM(coberturaparcialestimada),0)
    FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador) * precio) * (foo.contingencia)/100 "
    . $s['condicion'], $s['contingencia']
);
                    } elseif ($p == 'importefila_condicion1'
|| $p == 'importefila_condicion2' || $p == 'importefila_condicion3'
                    ) {

self::addHavigConParamsFoo(
    $addHaving, "((SELECT COALESCE(SUM(coberturaparcialestimada),0)
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador) * foo.precio +
(SELECT COALESCE(SUM(coberturaparcialestimada),0) FROM mod_planificacion.dat_ajusteexistenciacb aecb
WHERE identidad = $myentidad AND idmodelo = $mymodelo AND idindicador = foo.idindicador)
* foo.preciodivisa + ((SELECT COALESCE(SUM(coberturaparcialestimada),0)
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador) * precio) * (foo.flete)/100 +
((SELECT COALESCE(SUM(coberturaparcialestimada),0) FROM mod_planificacion.dat_ajusteexistenciacb aecb
WHERE identidad = $myentidad AND idmodelo = $mymodelo
AND idindicador = foo.idindicador) * precio) * (foo.contingencia)/100)" . $s['condicion'], $s['importefila']
);
                    } else {
if ($p == 'idaprobacionsi') {
    self::addWhereSinParamsFoo(
        $foo,
        "(SELECT idaprobacion FROM mod_planificacion.dat_ajusteexistenciacb "
        . "WHERE identidad = $myentidad AND idmodelo = $mymodelo AND"
        . " idindicador = foo.idindicador) > 1"
    );
} else {
    if ($p == 'idaprobacionno') {
        self::addWhereSinParamsFoo(
            $foo,
            "(SELECT idaprobacion FROM mod_planificacion.dat_ajusteexistenciacb"
            . " WHERE identidad = $myentidad AND idmodelo = $mymodelo AND "
            . "idindicador = foo.idindicador) = 1 "
        );
    } elseif ($p == 'demanda_condicion1'
        || $p == 'demanda_condicion2'|| $p == 'demanda_condicion3'
    ) {

        self::addHavigConParamsFoo(
            $addHaving, "( SUM(foo.necesidad) -
       (
         SELECT COALESCE(SUM(cpe), 0) as cpe
         FROM mod_planificacion.dat_odcte odcte
         WHERE idmodelo = $mymodelo AND
               idindicador = foo.idindicador
       )) " . $s['condicion'],
            $s['demanda']
        );
    }
}
                    }
                }
            }
        }
        if ($parametros['masunavia'] != 0) {
            $consultavaraisvias
                = " AND (SELECT COUNT(ivia.idindicador) as cantidad
        FROM mod_datosmaestros.dat_indicadorviaadquisicion as ivia
        where i.idindicador=ivia.idindicador) >1
         ";
        }

 if ($parametros['listar']) {
        //consulta general para obtener los indicadores
        $consultageneral = self::consultaCinco(
            $addwhere, $foo, $parametros,
            $consultavaraisvias, $myentdatnom, $mymodelo, $myentidad, $addHaving
        );

        if ($start != null && $limit != null) {
            //se le agrega el limit y start a la consulta general
            $consultageneral .= " OFFSET $start LIMIT $limit";
        }

        //ejecutando la consulta general
       // $b= $conn->getSqlQuery();
      //
        $res = $conn->execute($consultageneral, $paramsQuery);
        $arrayindicadores = $res->fetchAll(PDO::FETCH_ASSOC);
        
 $resultado['datos'] = $arrayindicadores;}
  if ($parametros['contar']) {
        //consulta para obtener el total de indicadores e importes
        $consultatotalimportes = self::consultaSeis(
            $addwhere, $foo, $parametros,
            $consultavaraisvias, $myentdatnom, $mymodelo, $myentidad, $addHaving
        );

        //ejecutando la consulta del total
        $total = $conn->execute($consultatotalimportes, $paramsQuery);

        $totales = $total->fetchAll(PDO::FETCH_ASSOC);
        $resultado['total'] = $totales[0]['total'];
        $resultado['importetotal'] = $totales[0]['importetotal'];
        $resultado['importeflete'] = $totales[0]['importeflete'];
        $resultado['importecontingencia'] = $totales[0]['importecontingencia'];
        $resultado['importenecesidad'] = $totales[0]['importenecesidad'];
        $resultado['importeajustado'] = $totales[0]['importeajustado'];
        $resultado['importemn'] = $totales[0]['importemn'];
  $resultado['importemlc'] = $totales[0]['importemlc'];}

        return $resultado;
    }

    public function selectOcho()
    {
        $consulta = "SELECT SUM(pru.importeMN) as importeMN,
                SUM(pru.importemlc) as importemlc,SUM(pru.importeflete) as importeflete,
                SUM(pru.importecontingencia) as importecontingencia,
                SUM(pru.importetotal) as importetotal,
                SUM(pru.importenecesidad) as importenecesidad,
                sum(pru.importeajustado) as importeajustado,
                COUNT(pru.idindicador) as total";
        return $consulta;
    }

    public function groupByCinco()
    {
        $consulta = "Group by foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,
                    foo.numeropieza,foo.flete,foo.contingencia,foo.denominacion,
                    foo.denominacioncb,foo.idumedida,foo.coberturatotalestimada";
        return $consulta;
    }

    public function groupBySeis()
    {
        $consulta = "Group by i.idindicador,i.codigo,ipnif.precio,ipnif.preciodivisa,
        i.numeropieza,ipnif.flete,ipnif.contingencia,i.denominacion, i.idumedida,
        e.denominacion,ae.coberturatotalestimada order by i.codigo";
        return $consulta;
    }

    public function selectDiez()
    {
        $consulta = "SELECT foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,
                    foo.numeropieza,foo.denominacion,foo.denominacioncb,foo.idumedida,
                    foo.coberturatotalestimada,SUM(foo.necesidad) as necesidadod,
SUM(foo.cantidad) as cantidad";
        return $consulta;
    }

    public function selectOnce()
    {
        $consulta = "SELECT i.idindicador,i.codigo,ipnif.precio,ipnif.preciodivisa,
                            i.numeropieza,i.denominacion,ipnif.flete,ipnif.contingencia,
                            i.idumedida,e.denominacion as denominacioncb,
SUM(p.cantidad) as necesidad,ae.coberturatotalestimada as coberturatotalestimada,
sum(COALESCE(ddvo.cantidad,0)) as cantidad";
        return $consulta;
    }

    public function consultaSeis($addwhere, $foo, $parametros,
        $consultavaraisvias, $myentdatnom, $mymodelo, $myentidad, $addHaving)
    {
        $select = self::selectOcho(); $group = self::groupByCinco();
        $groupUno = self::groupBySeis(); $selectUno = self::selectDiez();
        $selectDos = self::selectOnce(); $consulta = "$select FROM ($selectUno,
(SELECT idaprobacion FROM mod_planificacion.dat_ajusteexistenciacb
WHERE identidad = $myentidad AND idmodelo = $mymodelo AND idindicador =
    foo.idindicador) as idaprobacion,
SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
        FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador) as necesidad,
(SELECT COALESCE(SUM(coberturaparcialestimada),0)
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador) as coberturaparcialestimada,
SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador),0)) as demanda,

(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
   FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador),0))) * foo.precio as
importeMN,(SELECT COALESCE(SUM(coberturaparcialestimada),0)
 FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
 AND idmodelo = $mymodelo AND idindicador = foo.idindicador)  * foo.precio as
 importeajustado,(SUM(foo.necesidad)) * foo.precio as importenecesidad,
 (SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
 FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador),0))) * foo.preciodivisa as importemlc,

((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador) - (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador),0))) * precio) * (foo.flete)/100 as
importeflete,

((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador),0))) * precio)
* (foo.contingencia)/100 as importecontingencia,

(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador),0))) * foo.precio +
((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador),0))) * precio) * (foo.flete)/100 +
((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador),0))) * precio)
* (foo.contingencia)/100 as importetotal    FROM ($selectDos
FROM mod_planificacion.dat_planificacion p
INNER JOIN mod_datosmaestros.nom_indicador i on p.idindicador=i.idindicador
INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on i.idindicador= ipnif.idindicador
INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn on
p.idcentrobalance = edn.identidaddatosnomenclador
INNER JOIN mod_estructuracomp.dat_estructura e on edn.identidad =e.idestructura
INNER JOIN mod_planificacion.dat_entidadmodelo em on p.identidadmodelo =em.identidadmodelo
LEFT JOIN  mod_planificacion.dat_ajusteexistencia ae on (p.idindicador =
ae.idindicador AND ae.identidad = $myentidad)
LEFT JOIN mod_planificacion.dat_odcte odcte on (i.idindicador = odcte.
idindicador AND odcte.identidad= em.identidad AND em.idmodelo = odcte.idmodelo)
LEFT JOIN mod_planificacion.dat_ajusteexistenciacb aecb on (i.idindicador =
aecb.idindicador AND aecb.identidad= $myentidad AND em.idmodelo = $mymodelo)
LEFT JOIN mod_planificacion.dat_desgviaadquisorgsat ddvo  on (i.idindicador =
ddvo.idindicador AND ddvo.identidad= $myentidad  AND ddvo.idejercicio = "
            . $parametros['idejercicio'] . ")
WHERE em.idmodelo = $mymodelo AND p.idejercicio = " . $parametros['idejercicio'] . "
AND p.idcentrobalance = $myentdatnom $consultavaraisvias $addwhere $groupUno)
as foo $foo $group $addHaving AND SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idindicador = foo.idindicador) -
(SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE idindicador = foo.idindicador) >0
order by foo.codigo) as pru";
        return $consulta;
    }

    public function selectDoce()
    {
        $consulta = "SELECT foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,
                    foo.numeropieza,foo.denominacion,foo.denominacioncb,foo.idumedida,
                    foo.coberturatotalestimada,SUM(foo.necesidad) as necesidadod,
SUM(foo.cantidad) as cantidad";
        return $consulta;
    }

    public function selectTrece()
    {
        $consulta = "SELECT i.idindicador,i.codigo,ipnif.precio,ipnif.preciodivisa,
i.numeropieza,i.denominacion,ipnif.flete,ipnif.contingencia,i.idumedida,
e.denominacion as denominacioncb,SUM(p.cantidad) as necesidad,
ae.coberturatotalestimada as coberturatotalestimada,sum(COALESCE(ddvo.cantidad,0)) as cantidad";
        return $consulta;
    }

    public function groupByNueve()
    {
        $consulta = "Group by foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,
foo.numeropieza,foo.flete,foo.contingencia,foo.denominacion,foo.denominacioncb,
foo.idumedida,foo.coberturatotalestimada";
        return $consulta;
    }

    public function consultaCinco($addwhere, $foo, $parametros,
        $consultavaraisvias, $myentdatnom, $mymodelo, $myentidad, $addHaving)
    {
        $select = self::selectDoce();

        $selectUno = self::selectTrece();
        $group = self::groupByNueve();
        $consulta = "$select,
COALESCE((SELECT idaprobacion FROM mod_planificacion.dat_ajusteexistenciacb
WHERE identidad = $myentidad AND idmodelo = $mymodelo AND idindicador =
    foo.idindicador),1) as idaprobacion,SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
    FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
    AND idindicador = foo.idindicador) as necesidad,
(SELECT COALESCE(SUM(coberturaparcialestimada),0)
       FROM mod_planificacion.dat_ajusteexistenciacb aecb
       WHERE identidad = $myentidad AND idmodelo = $mymodelo
       AND idindicador = foo.idindicador) as coberturaparcialestimada,
SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
       FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
       AND idindicador = foo.idindicador) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
 AND idmodelo = $mymodelo AND idindicador = foo.idindicador),0)) as demanda,


(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
 FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
 AND idindicador = foo.idindicador) - (SELECT COALESCE ((SELECT SUM(COALESCE
 (coberturaparcialestimada,0) + COALESCE(reservaministerial,0)+ COALESCE(cantidadeconomia,0))
 FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
 AND idmodelo = $mymodelo AND idindicador = foo.idindicador),0))) * foo.precio as importe,

(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
        AND idindicador = foo.idindicador) -
    (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
    COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
    FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador),0))) * foo.preciodivisa as importemlc,
     ((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador),0))) * precio) * (foo.flete)/100 as flete,
((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
 FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador),0))) * precio) *
(foo.contingencia)/100 as contingencia,

(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador),0))) * foo.precio +
((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador),0))) * precio)
* (foo.flete)/100 +((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador) -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0)
+ COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador),0))) * precio) *
(foo.contingencia)/100 as importefila

FROM ($selectUno FROM mod_planificacion.dat_planificacion p
INNER JOIN mod_datosmaestros.nom_indicador i on p.idindicador=i.idindicador
INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on
i.idindicador = ipnif.idindicador
INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn on
p.idcentrobalance = edn.identidaddatosnomenclador
INNER JOIN mod_estructuracomp.dat_estructura e on edn.identidad =e.idestructura
INNER JOIN mod_planificacion.dat_entidadmodelo em on p.identidadmodelo =em.identidadmodelo
LEFT JOIN  mod_planificacion.dat_ajusteexistencia ae on (p.idindicador =
ae.idindicador AND ae.identidad = $myentidad)
LEFT JOIN mod_planificacion.dat_odcte odcte on (i.idindicador =
odcte.idindicador AND odcte.identidad= em.identidad AND em.idmodelo =
odcte.idmodelo AND odcte.idejercicio = ". $parametros['idejercicio'] . ")
LEFT JOIN mod_planificacion.dat_desgviaadquisorgsat ddvo  on
(i.idindicador = ddvo.idindicador AND ddvo.identidad= $myentidad  "
            . "AND ddvo.idejercicio = ". $parametros['idejercicio'] . ")
WHERE em.idmodelo = $mymodelo AND p.idejercicio = " . $parametros['idejercicio'] . " AND i.estado=1
AND p.idcentrobalance = $myentdatnom $consultavaraisvias $addwhere
Group by i.idindicador,i.codigo,ipnif.precio,ipnif.preciodivisa,
i.numeropieza,ipnif.flete,ipnif.contingencia,i.denominacion, i.idumedida,
e.denominacion,ae.coberturatotalestimada order by i.codigo) as foo
$foo $group $addHaving AND SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte
WHERE idindicador = foo.idindicador) -(SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE idindicador = foo.idindicador) >0
order by foo.codigo ";

        return $consulta;
    }

    public function verificarEjercicioActual_Elaboracion($idejercicio)
    {
        $query = new Doctrine_Query();
        $query->select('ejer.idejercicio')
            ->from('NomEjercicioplanificacion ejer')
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



