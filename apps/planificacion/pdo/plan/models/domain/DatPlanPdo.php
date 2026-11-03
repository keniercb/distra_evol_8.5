<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatPlanPdo extends BaseDatPlanPdo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatElementos',
            array('local' => 'idplan', 'foreign' => 'idelemento')
        );
        $this->hasMany(
            'DatArc', array('local'    => 'idplan', 'foreign' => 'idarc',
                            'refClass' => 'DatArcDatPlan')
        );
    }

    public function Buscar($idplan)
    {
      $temp=Doctrine::getTable('DatPlanPdo')->find($idplan);
      return $temp->toArray();
    }

    public function GetTodosXCriterio(
        $arrayautores, $denominacion, $fechainicio, $fechafin, $arrayestados,
        $categplan, $car, $offset, $limit
    ) {
        $connA = Doctrine_Manager:: connection();
        $cadenasubord = '';
        $totalsub = count($arrayautores);
        $operator = " OR ";
        if (isset($arrayautores[0])) {
            foreach ($arrayautores as $key => $autor) {
                $idautor = $autor['idusuario'];
                if ($key == $totalsub - 1) {
                    $operator = " ";
                }
                $cadenasubord .= " (dat_elementos.idusuariocrea = '$idautor') "
                    . $operator;
            }
        }
        //cadena sql con los estados en que puedo ver el documento 
        $cadenaestados = ' ';
        if (isset($arrayestados['data'][0])) {
            $operator = " OR ";
            $cadenaestados = ' AND (';
            $totalestados = count($arrayestados['data']);
            foreach ($arrayestados['data'] as $key => $estado) {
                $idestadoaprob = $estado['idestado'];
                if ($key == $totalestados - 1) {
                    $operator = " ";
                }
                $cadenaestados .= " (dat_elementos.idestadoaprob = '$idestadoaprob') "
                    . $operator;
            }
            $cadenaestados .= ")";
        }
        $cadena
            = "SELECT distinct(dat_elementos.idelemento),
            dat_plan_pdo.idplan,dat_elementos.denelemento AS denominacion,
            dat_plan_pdo.fechainicio AS fini,
            dat_plan_pdo.fechafin AS ffin,dat_elementos.descelemento AS desc,
            dat_elementos.idestadoaprob,
            dat_elementos.estadocumplimiento,dat_elementos.gradocumplimiento,
            dat_elementos.idusuariocrea,
            dat_elementos.activo AS estado
            FROM mod_objetivos.dat_elementos
            INNER JOIN mod_objetivos.dat_plan_pdo 
            ON dat_elementos.idelemento = dat_plan_pdo.idplan	";
        if ($categplan != null) {
            $cadena
                .= " INNER JOIN  mod_objetivos.dat_elementos_nom_nomenclador
                ON dat_elementos.idelemento =  dat_elementos_nom_nomenclador.idelemento ";
        }
        $cadena .= " WHERE (" . $cadenasubord . ") " . $cadenaestados;
        if ($denominacion != null) {
            $cadena .= " AND  dat_elementos.denelemento LIKE '%$denominacion%' ";
        }
        if ($fechainicio != null) {
            $cadena .= " AND  dat_plan_pdo.fechainicio >= '$fechainicio' ";
        }
        if ($fechafin != null) {
            $cadena .= " AND  dat_plan_pdo.fechafin <= '$fechafin' ";
        }
        if ($car != null) {
            $cadena .= " AND  dat_elementos.idelemento = '$car' ";
        }
        if ($categplan != null) {
            $cadena .= " AND  dat_elementos_nom_nomenclador.idnomenclador = '$categplan' ";
        }
        $resnopag = $connA->execute($cadena);
        $resultnopag = $resnopag->fetchAll();
        $total = count($resultnopag);
        if ($offset == null) {
            $offset = 0;
        }
        $cadena .= " OFFSET(" . $offset . ") LIMIT(" . $limit . ")";
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        $resultado[] = $total;
        $resultado[] = $result;
        return $resultado;
    }

    public function CargarPlanes(
        $arrayautores, $arrayestados, $categplan, $offset, $limit,
        $estadoaprobpordefcto, $idusuario, $filtros, $parametros
    ) {
        $connA = Doctrine_Manager:: connection();
        $cadenasubord = '';
        $totalsub = count($arrayautores);
        $operator = " OR ";
        if (isset($arrayautores[0])) {
            foreach ($arrayautores as $key => $autor) {
                $idautor = $autor['idusuario'];
                if ($key == $totalsub - 1) {
                    $operator = " ";
                }
                $cadenasubord .= " (e.idusuariocrea = '$idautor') " . $operator;
            }
        }
        $cadenasubordr = '';
        $totalsub = count($arrayautores);
        $operator = " OR ";
        if (isset($arrayautores[0])) {
            foreach ($arrayautores as $key => $autor) {
                $idautor = $autor['idusuario'];
                if ($key == $totalsub - 1) {
                    $operator = " ";
                }
                $cadenasubordr .= " (r.idusuariocrea = '$idautor') "
                    . $operator;
            }
        }
        //cadena sql con los estados en que puedo ver el documento 
        $cadenaestados = ' ';
        if (isset($arrayestados[0])) {
            $operator = " OR ";
            $cadenaestados = ' AND (';
            $totalestados = count($arrayestados);
            foreach ($arrayestados as $key => $estado) {
                $idestadoaprob = $estado['idestado'];
                if ($key == $totalestados - 1) {
                    $operator = " ";
                }
                $cadenaestados .= " (e.idestadoaprob = '$idestadoaprob') "
                    . $operator;
            }
            $cadenaestados .= ")";
        }
        //tratamientos de filtros
        $addwhere = "";
        $arrayParams = array();
        if ($filtros) {
            foreach ($filtros as $datos) {
                if ($datos ['field'] == 'idelemento') {
                    $addwhere = $addwhere . "AND e.uriidelemento LIKE '%" .
                        $arrayParams[] = $datos ['data'] ['value'] . "%'";
                } elseif ($datos ['field'] == 'denominacion') {
                    $addwhere = $addwhere . " AND upper(e.denelemento) LIKE '%"
                        . strtoupper($datos ['data'] ['value']) . "%'";
                } elseif ($datos ['field'] == 'fechainicio') {
                    $cond = " = ";
                    if ($datos ['data']['comparison'] == 'lt') {//antes
                        $cond = "<";
                    } else {
                        if ($datos ['data']['comparison'] == 'gt') {//despues
                            $cond = ">";
                        }
                    }
                    //esto es necesario debido a que interpreta la fecha como un entero
                    $arrayfechainicio = explode(' ', $datos ['data'] ['value']);
                    $fechainicio = explode('-', $arrayfechainicio[0]);
                    $addwhere
                        = $addwhere . " AND dat_plan_pdo.fechainicio {$cond} '"
                        . $fechainicio[0] . '-' . $fechainicio[1] . '-'
                        . $fechainicio[2] . "'";
                } elseif ($datos ['field'] == 'fechafin') {
                    $cond = " = ";
                    if ($datos ['data']['comparison'] == 'lt') {//antes
                        $cond = "<";
                    } else {
                        if ($datos ['data']['comparison'] == 'gt') {//despues
                            $cond = ">";
                        }
                    }
                    //esto es necesario debido a que interpreta la fecha como un entero
                    $arrayfechafin = explode(' ', $datos ['data'] ['value']);
                    $fechafin = explode('-', $arrayfechafin[0]);
                    $addwhere =$addwhere
                        . " AND dat_plan_pdo.fechafin {$cond} '"
                        . $fechafin[0] . '-' . $fechafin[1] . '-' . $fechafin[2]
                        . "'";
                } elseif ($datos ['field'] == 'textocumplimiento') {
                    $addwhere = $addwhere
                        . " AND e.estadocumplimiento = '{$datos ['data'] ['value']}'";
                } elseif ($datos ['field'] == 'gradocumplimiento') {
                    $cond = " = ";
                    if ($datos ['data']['comparison'] == 'lt') {//menor
                        $cond = "<";
                    } else {
                        if ($datos ['data']['comparison'] == 'gt') {//mayor
                            $cond = ">";
                        }
                    }
                    $addwhere = $addwhere . " AND e.gradocumplimiento {$cond} "
                        . ($datos ['data'] ['value'] * 1);
                } elseif ($datos ['field'] == 'observaciones') {
                    if ($datos ['data'] ['value'] == 'Si') {
                        $addwhere = $addwhere . " AND e.cantobserv > '0' ";
                    } else {
                        $addwhere = $addwhere . " AND e.cantobserv = '0' ";
                    }
                }
            }
        }
        $cadenaneg
            = "SELECT distinct r.idelemento FROM mod_objetivos.dat_elementos r
            INNER JOIN mod_objetivos.dat_elementos_dat_elementos eer 
            ON r.idelemento = eer.idelementohijo
            INNER JOIN mod_objetivos.dat_plan_pdo pr ON r.idelemento = pr.idplan 
            WHERE (" . $cadenasubordr . ") ";
        if ($estadoaprobpordefcto) {
            $cadenaneg
                .= " AND (r.idusuariocrea = '$idusuario'
                OR (r.idusuariocrea <> '$idusuario' 
                AND r.idestadoaprob <> '$estadoaprobpordefcto'))";
        }
        $cadena
            = "SELECT distinct(e.idelemento),
            dat_plan_pdo.idplan,e.denelemento AS denominacion,dat_plan_pdo.fechainicio,
            dat_plan_pdo.fechafin ,e.descelemento AS desc,e.idestadoaprob,
            e.estadocumplimiento,e.gradocumplimiento,e.idusuariocrea,
            e.activo AS activo,e.cantobserv AS observaciones
            FROM mod_objetivos.dat_elementos e
            INNER JOIN mod_objetivos.dat_plan_pdo ON e.idelemento = dat_plan_pdo.idplan	";
        if ($categplan != null) {
            $cadena
                .= " INNER JOIN  mod_objetivos.dat_elementos_nom_nomenclador
                ON e.idelemento =  dat_elementos_nom_nomenclador.idelemento ";
        }
        /*if($cadenasubord == '')
        {$cadenasubord = "e.idtipoelemento = '0' ";}*/
        $cadena .= " WHERE (" . $cadenasubord . ") " . $cadenaestados;
        if ($categplan != null) {
            $cadena .= " AND  dat_elementos_nom_nomenclador.idnomenclador = '$categplan' ";
        }
        if ($estadoaprobpordefcto) {
            $cadena
                .= " AND (e.idusuariocrea = '$idusuario'
                OR (e.idusuariocrea <> '$idusuario' 
                AND e.idestadoaprob <> '$estadoaprobpordefcto'))";
        }
        $cadena .= " AND e.idelemento NOT IN (" . $cadenaneg . ")";
        $cadena .= " {$addwhere} ";
        if ($parametros->sort) {
            if ($parametros->sort != 'fechafin'
                && $parametros->sort != 'fechainicio'
                && $parametros->sort != 'textocumplimiento'
                && $parametros->sort != 'observaciones'
                && $parametros->sort != 'nombreautor'
                && $parametros->sort != 'nombreestadoaprob'
            ) {
                $comparar = ($parametros->sort == 'denominacion')
                    ? "denelemento" : $parametros->sort;
                $cadena .= " ORDER BY e.{$comparar} {$parametros->dir}";
            } else {
                if ($parametros->sort == 'fechafin'
                    || $parametros->sort == 'fechainicio'
                ) {
                    $cadena .= " ORDER BY dat_plan_pdo.{$parametros->sort} {$parametros->dir}";
                } else {
                    $cadena .= " ORDER BY e.idelemento {$parametros->dir}";
                }
            }
        } else {
            //$cadena .= " ORDER BY e.idelemento ASC";
            $cadena .= " ORDER BY dat_plan_pdo.fechainicio ASC";
        }
        $resnopag = $connA->execute($cadena, $arrayParams);
        $resultnopag = $resnopag->fetchAll();
        $total = count($resultnopag);
        if ($offset == null) {
            $offset = 0;
        }
        $cadena .= " OFFSET(" . $offset . ") LIMIT(" . $limit . ")";
        $res = $connA->execute($cadena, $arrayParams);
        $result = $res->fetchAll();
        $resultado[] = $total;
        $resultado[] = $result;
        return $resultado;
    }

    public function getPlanesImport($arrayplan)
    {
        $connA = Doctrine_Manager:: connection();
        $cadena
            = "SELECT distinct(e.idelemento),
            dat_plan_pdo.idplan,e.denelemento AS denominacion,dat_plan_pdo.fechainicio,
            dat_plan_pdo.fechafin ,e.descelemento AS desc,e.idestadoaprob,
            e.estadocumplimiento,e.gradocumplimiento,e.idusuariocrea,
            e.activo AS activo,e.cantobserv AS observaciones
            FROM mod_objetivos.dat_elementos e
            INNER JOIN mod_objetivos.dat_plan_pdo ON e.idelemento = dat_plan_pdo.idplan
            WHERE e.idelemento IN(" . implode(", ", $arrayplan)
            . ")";
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        $resultado['total'] = count($result);
        $resultado['resultado'] = $result;
        return $resultado;
    }

    public function GetCantPlanes()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatPlanPdo plan')
            ->innerJoin('plan.DatElementos elem')
            ->execute()
            ->count();
        return $result;
    }

    public function GetPorLimite($inicio, $limite)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatPlanPdo plan')
            ->innerJoin('plan.DatElementos elem')
            ->offset($inicio)
            ->limit($limite)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function GetPlanDadoId($idplan)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatPlanPdo plan')
            ->innerJoin('plan.DatElementos elem')
            ->where('plan.idplan = ?', $idplan)
            // ->addWhere ('plan.idplan = ?', $idplan)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result[0];
    }

    public function GetNomDadoIdPlan($idplan, $tiponomenclador)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosNomNomenclador elemnom')
            ->where('elemnom.idelemento = ?', $idplan)
            ->addWhere('elemnom.tiponomenclador = ?', $tiponomenclador)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result[0];
    }

    public function GetElemNom($idelemento, $tiponomenclador)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatElementosNomNomenclador elemnom')
            ->where(
                'elemnom.idelemento =? AND elemnom.tiponomenclador =?',
                array($idelemento, $tiponomenclador)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function CargarPlaness($idusuario)
    {
        $query = new Doctrine_Query();
        $result = $query->select('plan.idplan, elem.denelemento')
            ->from('DatPlanPdo plan')
            ->innerJoin('plan.DatElementos elem')
            ->where("elem.idusuariocrea ='$idusuario'")
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function cargarPlanesHijos($idplanpadre, $idusuario)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatPlanPdo plan')
            ->innerJoin('plan.DatElementos e')
            ->innerJoin('e.DatElementosDatElementos ee')
            ->where(
                "ee.idelementopadre ='$idplanpadre' AND e.idusuariocrea='$idusuario'"
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function ActualizarInfPlan()
    {
        $query = new Doctrine_Query();
        $array = $this->getData();
        $idplan = $array['idplan'];
        $query->update('DatPlanPdo dp');
        foreach ($array as $key => $value) {
            if (strlen((string)$value) > 0) {
                $definicion = $this->getTable()->getColumnDefinition($key);
                if ($definicion['type'] != 'numeric') {
                    $value = "'" . $value . "'";
                }
                $query->set('dp.' . $key, $value);
            }
        }
        $query->where("dp.idplan = $idplan")->execute();
    }

    public function obtenerPlanes($parametros)
    {
        if ($parametros->idplan != '') {
            $cadenaPlan
                = " AND (e.controlcambio = 1) AND p.idplan = {$parametros->idplan} ";
        } else {
            $cadenaPlan = " ";
        }
        $cadenaComportamiento = (isset($parametros->comportamiento)) ?
            " AND (e.controlcambio = 1) AND p.idplan = {$parametros->idplan} "
            : "";
        $cadenaestados = (isset($parametros->arregloestados[0])) ?
            " AND (e.idestadoaprob IN (" . $parametros->arrayestados . ")) "
            : "";
        if ($parametros->fechainicio != '') {
            $cadenaFechaI = " AND (p.fechafin >= '$parametros->fechainicio') ";
        } else {
            $cadenaFechaI = "";
        }
        if ($parametros->fechafin != '') {
            $cadenaFechaF
                = " AND (p.fechainicio <= '{$parametros->fechafin}') ";
        } else {
            $cadenaFechaF = "";
        }
        $cadenaSelect
            = " SELECT DISTINCT(p.idplan), * ";
        $cadenaQUERY
            = " FROM mod_objetivos.dat_plan_pdo p

                INNER JOIN mod_objetivos.dat_elementos e
                ON (e.idelemento = p.idplan)

                WHERE (e.idusuariocrea = {$parametros->idusuario}

                OR e.idelemento IN (SELECT ei.idelemento
                FROM mod_objetivos.dat_elementos_dat_involucrados ei
                LEFT JOIN mod_objetivos.dat_involucrados i
                ON (ei.idinvolucrado = i.idinvolucrado)
                WHERE i.idusuario = {$parametros->idusuario}))

                {$cadenaestados} {$cadenaComportamiento} {$cadenaPlan}
                {$cadenaFechaI} {$cadenaFechaF}";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($cadenaSelect . $cadenaQUERY)->fetchAll(
            PDO::FETCH_ASSOC
        );
        return $result;
    }


    /*
     * cantidad de desviaciones por elemento(modificaciones en las fechas)
     * */
    public function cantDesviaciones($idElemento, $tipo)
    {
        if ($tipo == 3) {
            $cadenaSelect
                = " SELECT COUNT(DISTINCT(h.fechainicio)) -1
                + (COUNT(DISTINCT(h.fechafin)) -1)
                + (COUNT(DISTINCT(h.horainicio)) -1)
                + (COUNT(DISTINCT(h.horafin)) -1) AS desviaciones ";
        } else {
            $cadenaSelect
                = " SELECT COUNT(DISTINCT(h.fechainicio)) -1
                + (COUNT(DISTINCT(h.fechafin)) -1) AS desviaciones ";
        }
        $cadenaQUERY
            = " FROM mod_objetivos.dat_historial h
                WHERE h.idelemento = {$idElemento}";
        $conn = Doctrine_Manager::connection();

        $result = $conn->execute($cadenaSelect . $cadenaQUERY)->fetchAll(
            PDO::FETCH_COLUMN
        );
        return $result;
    }


}

//fin clase 

