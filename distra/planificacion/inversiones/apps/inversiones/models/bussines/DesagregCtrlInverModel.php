<?php

/**
 * Created by JetBrains PhpStorm.
 * User: yosniel
 * Date: 6/03/16
 * Time: 9:23
 */
class DesagregCtrlInverModel extends ZendExt_Model {

    public function getCmpIver($idinvers) {
        return DesagregCtrlInver::getCmpPorInv($idinvers);
    }

    public function getPlanAprobadoIver($params) {
        $valCmp = DesagregCtrlInver::PlanAprobadoPorInvCmp($params);
        $valPPplan = DesagregCtrlInver::PlanAprobadoPP($params);
        $valOtrosInd = DesagregCtrlInver::OtrosInd($params);

        $data = array();
        $data[0]['plantotalCUP'] = 0;
        $data[0]['importaciones'] = 0;
        //valor de componentes
        foreach ($valCmp as $key => $valC) {
            if ($valC['codigoiso'] == 'CUP') {
                $data[0]['plantotalCUP'] += $valC['sum'];
            } else {
                $data[0]['importaciones'] += $valC['sum'];
            }
            $data[0][$valC['idetapainversion'] . '-' . $valC['idmonedaentidad']] = $valC['sum'];
        }
        //plan de preparacion
        foreach ($valPPplan as $key => $valPP) {
            $data[0]['pp-' . $valPP['idmonedaentidad']] = $valPP['valor'];
        }
        //otros indicadores
        foreach ($valOtrosInd as $key => $valO) {
            if ($valO['idnomotrosindicadores'] == '122') {
                $data[0]['contexter'] = $valO['plan'];
            }
            if ($valO['idnomotrosindicadores'] == '124') {
                $data[0]['fondosbas'] = $valO['plan'];
            }
        }
        return $data;
    }

    public function getDesagI($param) {
        $desagCmp = DesagregCtrlInver::desgCmp($param);
        $desagOtrosInd = DesagregCtrlInver::DesgInd($param);
        $desagPlanPrep = DesagregCtrlInver::DesgPP($param);

        $data = array();
        $data[0]['plantotalCUP'] = 0;
        $data[0]['importaciones'] = 0;
        foreach ($desagCmp as $valDesC) {
            if ($valDesC['codigoiso'] == 'CUP') {
                $data[0]['plantotalCUP'] += $valDesC['valor'];
            } else {
                $data[0]['importaciones'] += $valDesC['valor'];
            }
            $data[0][$valDesC['idetapainversion'] . '-' . $valDesC['idmonedaentidad']] += $valDesC['valor'];
        }

        foreach ($desagPlanPrep as $valDesPP) {
            $data[0]['pp-' . $valDesPP['idmonedaentidad']] += $valDesPP['valor'];
        }

        foreach ($desagOtrosInd as $desO) {
            if ($desO['idnomotrosindicadores'] == '122') {
                $data[0]['contexter'] = $desO['valor'];
            }
            if ($desO['idnomotrosindicadores'] == '124') {
                $data[0]['fondosbas'] = $desO['valor'];
            }
        }
        return $data;
    }

    public function getDesagEquipos($param, $idTrimestres) {
        $ids = implode(",", $idTrimestres);
        $desagEquipo = DesagregCtrlInver::desgEquipo($param, $ids);
        $data = array();
        $data[0]['total'] = 0;
        foreach ($desagEquipo as $valDesE) {
            $data[0][$valDesE['identidadmodelo']] = $valDesE['valor'];
            $data[0]['total'] += $valDesE['valor'];
        }

        return $data;
    }

    public function getComprobacionEquipos($param) {
        $modelEquipo = new DatEtapaEquipoModel();
        $planEquipo = $modelEquipo->CargarEquiposDesglose($param); //carga los equipos aprobados en el plan
        
//        me da la posicion en el arreglo de equipos aprobados en el plan del indicador que tengo seleccionado
        $pos = self::getPosEquipo($planEquipo, $param['idindicador']);
        
        $iddesagregacionplan = self::desagregacionTotal($param);
        $ids = array();
        $data = array();
        foreach ($iddesagregacionplan->toArray() as $id) {
            $ids[] = $id['iddesagregacionplan'];
        }

        if (count($iddesagregacionplan->toArray())) {
            $ids = implode(",", $ids);
            $desagEquipo = DesagregCtrlInver::comprobacionEquipo($ids, $param['idindicador']); //obtiene la cantidad de equipos desagregados por plan

            $data[0]['total'] = 0;
            foreach ($desagEquipo as $desEq) {
                $data[0][$desEq['identidadmodelo']] = $planEquipo[$pos][$desEq['identidadmodelo']] - $desEq['sum'];
            }
            $data[0]['total'] = array_sum($data[0]);
        }
        return $data;
    }
    
    private function getPosEquipo($equipos, $idInd) {
        foreach ($equipos as $pos => $eq) {
            if($eq['idindicador'] == $idInd){
                return $pos;
            }
        }
        return;
    }

    public function savedesagregacion($datDesglose, $param) {
        $iddesagregacionplan = self::desagregacionPlan($param);

        if ($param['desglose'] == 1) {
            self::desagregacionestaplan($datDesglose, $iddesagregacionplan);
            self::desagregacionIndicadores($datDesglose, $iddesagregacionplan);
        }

        if ($param['desglose'] == 2) {
            self::desagregacionEquipoPlan($datDesglose, $iddesagregacionplan, $param);
        }

        if ($param['desglose'] == 3) {
            self::desagregacionMAPlan($datDesglose, $iddesagregacionplan, $param);
        }

        return true;
    }

    public function saveControl($datDesglose, $param) {
        $idcontrolplan = self::controlPlan($param);
        $idcontrolplantiempocontrol = self::controlPlanTiempoControl($param['tiempoCtrl'], $idcontrolplan);

//        if ($param['ctrl'] == 1 || $param['ctrl'] == 2 || $param['ctrl'] == 3) {
        if ($param['desglose'] == 0) {
            self::controlestaplan($datDesglose, $idcontrolplantiempocontrol);
        }
        if ($param['desglose'] == 1) {
            self::controlEquipoPlan($datDesglose, $idcontrolplantiempocontrol, $param['idindicador']);
        }
        if ($param['desglose'] == 2) {
            self::controlIndicadores($datDesglose, $idcontrolplantiempocontrol);
        }
//        }
        return true;
    }

    private function controlestaplan($datDesglose, $idcontrolplantiempocontrol) {
        $collectionControlEtapa = new Doctrine_Collection('DatControlplan');
        foreach ($datDesglose as $index => $datde) {
            //print_r($datde);
            $aux = split('-', $datde[0]);

            if (count($aux) > 1 && $datde[1]) {

                if ($aux[0] == 'pp') {
                    /*print_r($idcontrolplantiempocontrol);
                    print_r('----');
                    print_r($aux[1]);die;*/
                    self::controlPP($datde[1], $idcontrolplantiempocontrol, $aux[1]);
                } else {
                    $existe = Doctrine::getTable('DatControletapaplan')->findByDql(
                            "idcontrolplantiempocontrol = $idcontrolplantiempocontrol and idetapainversion = $aux[0] and idmonedaentidad = $aux[1]"
                    );
                    if (count($existe->toArray())) {
                        DatControletapaplan::actualizarValor($existe->toArray()[0]['idcontroletapaplan'], $datde[1]);
                    } else {
                        $objControlEtapa = new DatControletapaplan();
                        $objControlEtapa->idcontrolplantiempocontrol = $idcontrolplantiempocontrol;
                        $objControlEtapa->idetapainversion = $aux[0];
                        $objControlEtapa->idmonedaentidad = $aux[1];
                        $objControlEtapa->valor = $datde[1];
                        $collectionControlEtapa[$index] = $objControlEtapa;
                    }
                }
            }
        }/*die;*/
        $collectionControlEtapa->save();
    }

    private function controlPP($datos, $idcontrolplantiempocontrol, $identidadmoneda) {
        $existeCtrl = Doctrine::getTable('DatControlplanpreparacionplan')->findByDql(
                "idcontrolplantiempocontrol = $idcontrolplantiempocontrol and idmonedaentidad = $identidadmoneda");

        if (count($existeCtrl->toArray())) {
            //print_r('entra 1');die;
            DatControlplanpreparacionplan::actualizarValor($idcontrolplantiempocontrol, $identidadmoneda, $datos);
        } else {
            //print_r('entra 2');die;
            $ctrlPPPlan = new DatControlplanpreparacionplan();
            $ctrlPPPlan->idmonedaentidad = $identidadmoneda;
            $ctrlPPPlan->idcontrolplantiempocontrol = $idcontrolplantiempocontrol;
            $ctrlPPPlan->valor = $datos;
            $ctrlPPPlan->save();
        }
    }

    private function controlIndicadores($datos, $idcontrolplantiempocontrol) {
        $collectionControlIndPlan = new Doctrine_Collection('DatControlindplan');
        foreach ($datos as $index => $dat) {
            if ($dat[0] == 'fondosbas' && $dat[1]) {
                $idfondosbas = 124;
                $valor = $dat[1];
                $objDesagIndPlan = self::addCtrlIndPlan($idcontrolplantiempocontrol, $idfondosbas, $valor);
                if ($objDesagIndPlan != null) {
                    $collectionControlIndPlan[$index] = $objDesagIndPlan;
                }
            }
            if ($dat[0] == 'contexter' && $dat[1]) {
                $idcontexter = 122;
                $valor = $dat[1];
                $objDesagIndPlan = self::addCtrlIndPlan($idcontrolplantiempocontrol, $idcontexter, $valor);
                if ($objDesagIndPlan != null) {
                    $collectionControlIndPlan[$index] = $objDesagIndPlan;
                }
            }
        }
        $collectionControlIndPlan->save();
    }

    private function controlEquipoPlan($datDesgloseEquipo, $idcontrolplantiempocontrol, $idindicador) {
        $collectionCtrlEquipo = new Doctrine_Collection('DatControlequipoplan');
        foreach ($datDesgloseEquipo as $index => $datde) {
            if ($datde[0] != 'total') {
                $objCtrlequipo = Doctrine::getTable('DatControlequipoplan')->findByDql(
                        "idcontrolplantiempocontrol = " . $idcontrolplantiempocontrol . "
                        and identidadmodelo = " . $datde[0] . " and idindicador = " . $idindicador . ""
                );

                if (count($objCtrlequipo->toArray())) {
                    DatControlequipoplan::actualizar($objCtrlequipo->toArray()[0]['idcontrolequipoplan'], $datde[1]);
                } else {
                    $objCtrlequipo = new DatControlequipoplan();
                    $objCtrlequipo->idcontrolplantiempocontrol = $idcontrolplantiempocontrol;
                    $objCtrlequipo->identidadmodelo = $datde[0];
                    $objCtrlequipo->idindicador = $idindicador;
                    $objCtrlequipo->valor = $datde[1];
                    $collectionCtrlEquipo[$index] = $objCtrlequipo;
                }
            }
        }
        $collectionCtrlEquipo->save();
    }

    private function desagregacionestaplan($datDesglose, $iddesagregacionplan) {
        $collectionDesgloseEtapa = new Doctrine_Collection('DatDesagregacionetapaplan');
        foreach ($datDesglose as $index => $datde) {
            $aux = split('-', $datde[0]);
            if (count($aux) > 1 && ($datde[1] || $datde[1] === 0)) {
                if ($aux[0] == 'pp') {
                    self::desagregacionPP($datde[1], $iddesagregacionplan, $aux[1]);
                } else {
                    $existe = Doctrine::getTable('DatDesagregacionetapaplan')->findByDql(
                            "iddesagregacionplan = $iddesagregacionplan and idetapainversion = $aux[0] and idmonedaentidad = $aux[1]"
                    );
                    if (count($existe->toArray())) {
                        DatDesagregacionetapaplan::actualizarValor($existe->toArray()[0]['iddesagregacionetapaplan'], $datde[1]);
                    } else {
                        $objDesagregacionEtapa = new DatDesagregacionetapaplan();
                        $objDesagregacionEtapa->iddesagregacionplan = $iddesagregacionplan;
                        $objDesagregacionEtapa->idetapainversion = $aux[0];
                        $objDesagregacionEtapa->idmonedaentidad = $aux[1];
                        $objDesagregacionEtapa->valor = $datde[1];
                        $collectionDesgloseEtapa[$index] = $objDesagregacionEtapa;
                    }
                }
            }
        }
        $collectionDesgloseEtapa->save();
    }

    private function desagregacionIndicadores($datos, $iddesagregacionplan) {
        $collectionDesagIndPlan = new Doctrine_Collection('DatDesagregacionindplan');
        foreach ($datos as $index => $dat) {
            if ($dat[0] == 'fondosbas' && ($dat[1] || $dat[1] === 0)) {
                $idfondosbas = 124;
                $valor = $dat[1];
                $objDesagIndPlan = self::addDesagIndPlan($iddesagregacionplan, $idfondosbas, $valor);
                if ($objDesagIndPlan != null) {
                    $collectionDesagIndPlan[$index] = $objDesagIndPlan;
                }
            }
            if ($dat[0] == 'contexter' && ($dat[1] || $dat[1] === 0)) {
                $idcontexter = 122;
                $valor = $dat[1];
                $objDesagIndPlan = self::addDesagIndPlan($iddesagregacionplan, $idcontexter, $valor);
                if ($objDesagIndPlan != null) {
                    $collectionDesagIndPlan[$index] = $objDesagIndPlan;
                }
            }
        }
        $collectionDesagIndPlan->save();
    }

    private function desagregacionPP($datos, $iddesagregacionplan, $identidadmoneda) {
        $existeDesg = Doctrine::getTable('DatDesagregacionplanpreparacionplan')->findByDql(
                "iddesagregacionplan = $iddesagregacionplan and idmonedaentidad = $identidadmoneda");

        if (count($existeDesg->toArray())/* && $existe->toArray()[0]['valor'] != $valor */) {
            DatDesagregacionplanpreparacionplan::actualizarValor($iddesagregacionplan, $identidadmoneda, $datos);
        } else {
            $desagPPPlan = new DatDesagregacionplanpreparacionplan();
            $desagPPPlan->idmonedaentidad = $identidadmoneda;
            $desagPPPlan->iddesagregacionplan = $iddesagregacionplan;
            $desagPPPlan->valor = $datos;
            $desagPPPlan->save();
        }
    }

    private function addDesagIndPlan($iddesagregacionplan, $idnomotrosInd, $valor) {
        $existe = Doctrine::getTable('DatDesagregacionindplan')->findByDql(
                "iddesagregacionplan = $iddesagregacionplan and idnomotrosindicadores = $idnomotrosInd");

        if (count($existe->toArray())/* && $existe->toArray()[0]['valor'] != $valor */) {
            DatDesagregacionindplan::actualizarValor($existe->toArray()[0]['iddesagregacionplan'], $idnomotrosInd, $valor);
        } else {
            $objDesagIndPlan = new DatDesagregacionindplan();
            $objDesagIndPlan->iddesagregacionplan = $iddesagregacionplan;
            $objDesagIndPlan->idnomotrosindicadores = $idnomotrosInd;
            $objDesagIndPlan->valor = $valor;
            return $objDesagIndPlan;
        }
        return null;
    }

    private function addCtrlIndPlan($idcontrolplantiempocontrol, $idnomotrosInd, $valor) {
        $existe = Doctrine::getTable('DatControlindplan')->findByDql(
                "idcontrolplantiempocontrol = $idcontrolplantiempocontrol and idnomotrosindicadores = $idnomotrosInd");

        if (count($existe->toArray())) {
            DatControlindplan::actualizarValor($existe->toArray()[0]['idcontrolplantiempocontrol'], $idnomotrosInd, $valor);
        } else {
            $objCtrlIndPlan = new DatControlindplan();
            $objCtrlIndPlan->idcontrolplantiempocontrol = $idcontrolplantiempocontrol;
            $objCtrlIndPlan->idnomotrosindicadores = $idnomotrosInd;
            $objCtrlIndPlan->valor = $valor;
            return $objCtrlIndPlan;
        }
        return null;
    }

    public function getEntidadModelo($param) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    em.identidadmodelo,
                    dm.denominacion
                  FROM
                    mod_planificacion.dat_entidadmodelo em
                    INNER JOIN mod_planificacion.dat_modelo dm ON(dm.idmodelo = em.idmodelo)
                  WHERE
                em.identidad = " . $param['identidad'] . "";
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    private function desagregacionEquipoPlan($datDesgloseEquipo, $iddesagregacionplan, $otrosParams) {
        $collectionDesgloseEquipo = new Doctrine_Collection('DatDesagregacionequipoplan');
        foreach ($datDesgloseEquipo as $index => $datde) {
            if ($datde[0] != 'total') {
                $existeDesgEquipoPlan = Doctrine::getTable('DatDesagregacionequipoplan')->findByDql(
                        "iddesagregacionplan = " . $iddesagregacionplan . " and identidadmodelo = " . $datde[0] . " and idindicador = " . $otrosParams['idindicador'] . ""
                );


                if (count($existeDesgEquipoPlan->toArray())) {
                    DatDesagregacionequipoplan::actualizar($existeDesgEquipoPlan->toArray()[0]['iddesagregacionequipoplan'], $datde[1]);
                } else {
                    $objDesagregacionequipo = new DatDesagregacionequipoplan();
                    $objDesagregacionequipo->iddesagregacionplan = $iddesagregacionplan;
                    $objDesagregacionequipo->identidadmodelo = $datde[0];
                    $objDesagregacionequipo->idindicador = $otrosParams['idindicador'];
                    $objDesagregacionequipo->valor = ($datde[1] != null) ? $datde[1] : 0;
                    $collectionDesgloseEquipo[$index] = $objDesagregacionequipo;
                }
            }
        }
        $collectionDesgloseEquipo->save();
    }

    private function desagregacionMAPlan($datDesgloseEquipo, $iddesagregacionplan, $otrosParams) {
        $collectionDesgloseMA = new Doctrine_Collection('DatDesagregacionmedambplan');
        foreach ($datDesgloseEquipo as $index => $datde) {
            $existeDesgMAplan = Doctrine::getTable('DatDesagregacionmedambplan')->findByDql(
                    "iddesagregacionplan = " . $iddesagregacionplan . " and idmonedaentidad = " . $datde[0] . ""
            );

            if (count($existeDesgMAplan->toArray())) {
                DatDesagregacionmedambplan::actualizar($iddesagregacionplan, (float) $datde[1], $datde[0]);
            } else {
                $objDesagregacionMA = new DatDesagregacionmedambplan();
                $objDesagregacionMA->iddesagregacionplan = $iddesagregacionplan;
                $objDesagregacionMA->idmonedaentidad = $datde[0];
                $objDesagregacionMA->valor = (float) $datde[1];
                $collectionDesgloseMA[$index] = $objDesagregacionMA;
            }
        }
        $collectionDesgloseMA->save();
    }

    public function getPlanMA($param) {
        $datos = DatMedioambglobal::getMAplan($param['idinvers']);

        $data = array();
        foreach ($datos as $val) {
            $data[0][$val['idmonedaentidad']] = $val['sum'];
        }
        return $data;
    }

    public function getComprobacionInver($param) {
        $param['trimestre'] = implode(",", array(1, 2, 3, 4));

        $planTotal = self::getPlanAprobadoIver($param);

        $desagrregacion = self::getDesagI($param);

        $difPlanDesag = array_diff_key($planTotal[0], $desagrregacion[0]);
        if (count($difPlanDesag) > 0) {
            foreach ($difPlanDesag as $k => $value) {
                $difPlanDesag[$k] = 0;
            }
            $desagrregacion[0] = array_merge($desagrregacion[0], $difPlanDesag);
        }

        $difDesagPlan = array_diff_key($desagrregacion[0], $planTotal[0]);
        if (count($difDesagPlan) > 0) {
            foreach ($difDesagPlan as $k => $value) {
                $difDesagPlan[$k] = 0;
            }
            $planTotal[0] = array_merge($planTotal[0], $difDesagPlan);
        }

        $compTotal = array();

        foreach ($planTotal[0] as $p => $plan) {
            foreach ($desagrregacion[0] as $d => $desag) {
                if ($p == $d) {
                    $compTotal[0][$p] = round($plan - $desag, 2);
                    break;
                }
            }
        }
        return $compTotal;
    }

    public function getComprobacionMA($param) {
        $iddesagregacionplan = self::desagregacionTotal($param);
        $ids = array();
        $data = array();
        foreach ($iddesagregacionplan->toArray() as $id) {
            $ids[] = $id['iddesagregacionplan'];
        }
        $ids = implode(",", $ids);
        $totalMA = DesagregCtrlInver::ComprobacionMA($ids);

        $planMA = DatMedioambglobal::getMAplan($param['idinversion']);

        for ($i = 0; $i < count($planMA); $i++) {
            for ($j = 0; $j < count($totalMA); $j++) {
                if ($planMA[$i]['idmonedaentidad'] == $totalMA[$j]['idmonedaentidad']) {
                    $data[0][$totalMA[$j]['idmonedaentidad']] = $planMA[$i]['sum'] - $totalMA[$j]['sum'];
                }
            }
        }

        return $data;
    }

    private function desagregacionTotal($param) {
        return Doctrine::getTable('DatDesagregacionplan')->findByDql(
                        "idinversion = " . $param['idinversion'] . " and idejercicio = " . $param['idejercicio'] . ""
        );
    }

    public function getColumnasMA($param) {
        return DatMedioambglobal::getMAplan($param['idinvers']);
    }

//getEntidadModelo
    public function getDesagregacionMA($param) {
        $iddesagregacionplan = self::desagregacionPlan($param);
        $desagMA = DesagregCtrlInver::DesgMA($iddesagregacionplan);

        $data = array();
        if (count($desagMA) > 0) {
            foreach ($desagMA as $valMA) {
                $data[0][$valMA['idmonedaentidad']] = $valMA['valor'];
            }
        } else {
            $entModelo = self::getMonedaEntidad($param);
            foreach ($entModelo as $valEnt) {
                $data[0][$valEnt['idmonedaentidad']] = 0;
            }
        }
        return $data;
    }

    public function getMonedaEntidad($param) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT me.idmonedaentidad,
                    nm.codigoiso
                FROM mod_datosmaestros.dat_monedaentidad me
                INNER JOIN mod_datosmaestros.nom_moneda nm ON(nm.idmoneda = me.idmoneda)
                WHERE me.idestructuracomun = " . $param['identidad'] . " ORDER BY nm.codigoiso";
        $data = $conn->execute($sql);
        $dat = $data->fetchAll(PDO::FETCH_ASSOC);
        return $dat;
    }

    private function desagregacionPlan($param) {
        $existeDesgPlan = Doctrine::getTable('DatDesagregacionplan')->findByDql(
                "idtrimestre = " . $param['idtrimestre'] . " and idinversion = " . $param['idinversion'] . " and idejercicio = " . $param['idejercicio'] . ""
        );
        if (count($existeDesgPlan)) {
            $iddesagregacionplan = $existeDesgPlan->toArray()[0]['iddesagregacionplan'];
        } else {
            $objDesagregacionplan = new DatDesagregacionplan();
            $objDesagregacionplan->idtrimestre = $param['idtrimestre'];
            $objDesagregacionplan->idinversion = $param['idinversion'];
            $objDesagregacionplan->idejercicio = $param['idejercicio'];
            $objDesagregacionplan->save();

            $iddesagregacionplan = $objDesagregacionplan->iddesagregacionplan;
        }

        return $iddesagregacionplan;
    }

    private function controlPlan($param) {
        $existeDesgPlan = Doctrine::getTable('DatControlplan')->findByDql(
                "idtrimestre = " . $param['idtrimestre'] . " and idinversion = " . $param['idinversion'] . " and idejercicio = " . $param['idejercicio'] . ""
        );

        if (count($existeDesgPlan)) {
            $idcontrolplan = $existeDesgPlan->toArray()[0]['idcontrolplan'];
        } else {
            $objCtrolplan = new DatControlplan();
            $objCtrolplan->idtrimestre = $param['idtrimestre'];
            $objCtrolplan->idinversion = $param['idinversion'];
            $objCtrolplan->idejercicio = $param['idejercicio'];
            $objCtrolplan->save();

            $idcontrolplan = $objCtrolplan->idcontrolplan;
        }

        return $idcontrolplan;
    }

    private function controlPlanTiempoControl($idtiempocontrol, $idcontrolplan) {
        $existeDesgPlan = Doctrine::getTable('DatControlplantiempocontrol')->findByDql(
                "idcontrolplan = " . $idcontrolplan . " and idtiempocontrol = " . $idtiempocontrol . ""
        );

        if (count($existeDesgPlan)) {
            $idcontrolplantiempocontrol = $existeDesgPlan->toArray()[0]['idcontrolplantiempocontrol'];
        } else {
            $objCtrolplantiempocontrol = new DatControlplantiempocontrol();
            $objCtrolplantiempocontrol->idcontrolplan = $idcontrolplan;
            $objCtrolplantiempocontrol->idtiempocontrol = $idtiempocontrol;
            $objCtrolplantiempocontrol->save();

            $idcontrolplantiempocontrol = $objCtrolplantiempocontrol->idcontrolplantiempocontrol;
        }

        return $idcontrolplantiempocontrol;
    }

    public function getCtrl($param) {
        $desagCmp = DesagregCtrlInver::ctrlCmp($param);
        $desagOtrosInd = DesagregCtrlInver::ctrlInd($param);
        $desagPlanPrep = DesagregCtrlInver::ctrlPP($param);

        $data = array();
        $data[0]['plantotalCUP'] = 0;
        $data[0]['importaciones'] = 0;
        foreach ($desagCmp as $valDesC) {
            if ($valDesC['codigoiso'] == 'CUP') {
                $data[0]['plantotalCUP'] += $valDesC['valor'];
            } else {
                $data[0]['importaciones'] += $valDesC['valor'];
            }
            $data[0][$valDesC['idetapainversion'] . '-' . $valDesC['idmonedaentidad']] += $valDesC['valor'];
        }

        foreach ($desagPlanPrep as $valDesPP) {
            $data[0]['pp-' . $valDesPP['idmonedaentidad']] += $valDesPP['valor'];
        }

        foreach ($desagOtrosInd as $desO) {
            if ($desO['idnomotrosindicadores'] == '122') {
                $data[0]['contexter'] = $desO['valor'];
            }
            if ($desO['idnomotrosindicadores'] == '124') {
                $data[0]['fondosbas'] = $desO['valor'];
            }
        }
        return $data;
    }

    public function getCtrlMA($param) {
        $ctrlMA = DesagregCtrlInver::realMA($param);
        $data = array();

        if (count($ctrlMA) > 0) {
            foreach ($ctrlMA as $valDesC) {
                $data[0][$valDesC['idmonedaentidad']] += $valDesC['valor'];
            }
        } else {
            $entModelo = self::getMonedaEntidad($param);
            foreach ($entModelo as $valEnt) {
                $data[0][$valEnt['idmonedaentidad']] = 0;
            }
        }
        return $data;
    }

    public function getDesagIsemestre($semestre, $param) {
        $desagCmp = DesagregCtrlInver::desgCmpIsemestre(implode(",", $semestre), $param);
        $desagOtrosInd = DesagregCtrlInver::desgIndSemestre(implode(",", $semestre), $param);
        $desagPlanPrep = DesagregCtrlInver::DesgPPSemestre(implode(",", $semestre), $param);

        $data = array();
        $data[0]['plantotalCUP'] = 0;
        $data[0]['importaciones'] = 0;
        foreach ($desagCmp as $valDesC) {
            if ($valDesC['codigoiso'] == 'CUP') {
                $data[0]['plantotalCUP'] += $valDesC['sum'];
            } else {
                $data[0]['importaciones'] += $valDesC['sum'];
            }
            $data[0][$valDesC['idetapainversion'] . '-' . $valDesC['idmonedaentidad']] += $valDesC['sum'];
        }

        foreach ($desagPlanPrep as $valDesPP) {
            $data[0]['pp-' . $valDesPP['idmonedaentidad']] += $valDesPP['valor'];
        }

        foreach ($desagOtrosInd as $desO) {
            if ($desO['idnomotrosindicadores'] == '122') {
                $data[0]['contexter'] = $desO['valor'];
            }
            if ($desO['idnomotrosindicadores'] == '124') {
                $data[0]['fondosbas'] = $desO['valor'];
            }
        }
        return $data;
    }

    public function getDesagIsemestreMA($semestre, $param) {
        $desagIsemestre = DesagregCtrlInver::desgMAIsemestre(implode(",", $semestre), $param);

        $data = array();
        if (count($desagIsemestre) > 0) {
            foreach ($desagIsemestre as $valMA) {
                $data[0][$valMA['idmonedaentidad']] = $valMA['valor'];
            }
        } else {
            $entModelo = self::getMonedaEntidad($param);
            foreach ($entModelo as $valEnt) {
                $data[0][$valEnt['idmonedaentidad']] = 0;
            }
        }
        return $data;
    }

	public function cleanDesagregacion($idInvs, $params){
		DatDesagregacionplan::cleanDesag(implode(',', $idInvs), $params);
		return true;
	}
}
