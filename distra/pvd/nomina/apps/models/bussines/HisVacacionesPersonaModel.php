<?php

class HisVacacionesPersonaModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function HisVacacionesPersonaModel()
    {
        parent::ZendExt_Model();
    }

    public function Adicionar($arrDatos, $idnomina, $fechaoperacion, $tipooperacion)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        // print_r($arrDatos);die;
        foreach ($arrDatos as $k => $v) {
            $obj = new HisVacacionesPersona();
            $obj->idnomina = $idnomina;
            $obj->tipooperacion = $tipooperacion;
            $obj->fechaoperacion = $fechaoperacion;
            $obj->idvacacionespersona = $v['idvacacionespersona'];
            $obj->tiempoacumulado = $v['tiempoacumulado'];
            $obj->importeacumulado = $v['importeacumulado'];

            if ($tipooperacion == 1) {
                $saldoentiempo = $v['tiempoacumulado'] + $v['saldoentiempo'];
                $obj->saldoentiempo = $v['tiempoacumulado'] + $v['saldoentiempo'];
                $obj->saldoenimporte = $v['importeacumulado'] + $v['saldoenimporte'];
                if ($saldoentiempo >= 24) {
                    if ($v['saldoentiempo'] != 24) {
                        $obj->saldoentiempo = 24.0;
                        $obj->tiempoacumulado = 24 - $v['saldoentiempo'];
                    } else {
                        $obj->saldoentiempo = 24.0;
                        $obj->tiempoacumulado = 0.0;
                    }
                }
            } else {
                $st = $v['saldoentiempo'] - $v['tiempoacumulado'];
                $si = $v['saldoenimporte'] - $v['importeacumulado'];
                $obj->saldoentiempo = $st > 0 ? $st : 0;
                $obj->saldoenimporte = $si > 0 ? $si : 0;
            }
            $obj->save();
        }
        $conn->commit();
        return true;
    }

    public function actualizarDatosGeneralesHistoricoVacaciones($idpersona, $identidad, $idhisvacacionespersona, $fecha, $ajustetiempo, $ajusteimporte, $tipoajuste, $observaciones)
    {
        $objHisVacPer = new HisVacacionesPersona();
        $objHisVacPerAdicionar = $objHisVacPer->obtenerObjHisVacacionesPersonaDadoId($idhisvacacionespersona);
        if ($tipoajuste == 1) {
            $saldotiempo = $objHisVacPerAdicionar->saldoentiempo + $ajustetiempo;
            $saldoimporte = $objHisVacPerAdicionar->saldoenimporte + $ajusteimporte;
        } else {
            $saldotiempo = $objHisVacPerAdicionar->saldoentiempo - $ajustetiempo;
            $saldoimporte = $objHisVacPerAdicionar->saldoenimporte - $ajusteimporte;
        }

        if ($saldotiempo < 0 || $saldoimporte < 0) {
            return 3;
        } else {
            $objHisVacPerAdicionar->saldoentiempo = $saldotiempo;
            $objHisVacPerAdicionar->saldoenimporte = $saldoimporte;
            $objHisVacPerAdicionar->ajustetiempo = $ajustetiempo;
            $objHisVacPerAdicionar->ajusteimporte = $ajusteimporte;
            $objHisVacPerAdicionar->tipoajuste = $tipoajuste;
            $objHisVacPerAdicionar->observaciones = $observaciones;

            //Guardando los datos.
            $objHisVacPerAdicionar->save();
            return 1;
        }
    }

    public function eliminarDatosHistoricoVacacionesPersona($idhisvacacionespersona)
    {

        //Se crea el objeto de los datos de vacaciones de la persona.
        $objHisVacPer = new HisVacacionesPersona();
        $objHisVacPerDelDatos = $objHisVacPer->obtenerObjHisVacacionesPersonaDadoId($idhisvacacionespersona);

        //Insertando los datos.
        $objHisVacPerDelDatos->fechaoperacion = null;
        $objHisVacPerDelDatos->tiempoacumulado = 0.00;
        $objHisVacPerDelDatos->importeacumulado = 0.00;
        $objHisVacPerDelDatos->saldoentiempo = 0.00;
        $objHisVacPerDelDatos->saldoenimporte = 0.00;

        //Guardando los datos.
        $objHisVacPerDelDatos->save();
    }

    public function validarAcumuladoVacaciones($idpersona, $diasadisfrutar, $identidad)
    {
        $sqlvacacionespersona = "select vac.idvacacionespersona
        from mod_nomina.dat_vacacionespersona vac
        where vac.idpersona = ? and vac.identidad = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arreglovacacionespersona = $conn->fetchAll($sqlvacacionespersona, array($idpersona, $identidad));
        $objDatVacacionesPersona = new DatVacacionesPersona();
        $objHisVacaciones = new HisVacacionesPersona();
        $arrultimaoperacion = $objHisVacaciones->obtenerUltimaOperacionSubMayor($arreglovacacionespersona[0]['idvacacionespersona']);
        //Si tiene operaciones
        if (count($arrultimaoperacion) > 0) {
            $saldorestante = $arrultimaoperacion[0]['saldoentiempo'] - $diasadisfrutar;
            if ($saldorestante < 0) {
                return -1;
            } else {
                return 1;
            }
            //Sino tiene operaciones
        } else {
            $arrcargainicial = $objDatVacacionesPersona->obtenerDatosVacacionesPersona($idpersona, $identidad);
            //Si tiene carga inicial
            if (count($arrcargainicial) > 0) {
                $saldorestante = $arrcargainicial[0]['tiempoacumuladoinicial'] - $diasadisfrutar;
                if ($saldorestante < 0) {
                    return -1;
                } else {
                    return 1;
                }
            } else {
                return -1;
            }
        }

    }

    public function calcularImporteaLiquidar($idpersona, $diasadisfrutar, $identidad, $lugaresdecimales = null)
    {
        //print_r($lugaresdecimales);die;
        $sqlvacacionespersona = "select vac.idvacacionespersona
        from mod_nomina.dat_vacacionespersona vac
        where vac.idpersona = ? and vac.identidad = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arreglovacacionespersona = $conn->fetchAll($sqlvacacionespersona, array($idpersona, $identidad));
        if (count($arreglovacacionespersona) > 0) {
            $objHisVacaciones = new HisVacacionesPersona();
            $arrultimaoperacion = $objHisVacaciones->obtenerUltimaOperacionSubMayor($arreglovacacionespersona[0]['idvacacionespersona']);
            if (count($arrultimaoperacion) > 0) {
                $importealiquidar = number_format($arrultimaoperacion[0]['saldoenimporte'] / $arrultimaoperacion[0]['saldoentiempo'] * $diasadisfrutar, (!empty($lugaresdecimales)) ? $lugaresdecimales : 2, '.', '');
                //$importealiquidar  = number_format($promedioenimporte * $diasadisfrutar, 2, '.', '');
                return $importealiquidar;
            } else {
                $objDatVacacionesPersona = new DatVacacionesPersona();
                $arrcargainicial = $objDatVacacionesPersona->obtenerDatosVacacionesPersona($idpersona, $identidad);
                if (count($arrcargainicial) > 0) {
                    //$promedioenimporte = number_format($arrcargainicial[0]['importeacumuladoinicial'] / $arrcargainicial[0]['tiempoacumuladoinicial'], 4, '.', '');
                    $importealiquidar = number_format($arrcargainicial[0]['importeacumuladoinicial'] / $arrcargainicial[0]['tiempoacumuladoinicial'] * $diasadisfrutar, (!empty($lugaresdecimales)) ? $lugaresdecimales : 2, '.', '');
                    return $importealiquidar;
                } else {
                    return 0;
                }
            }
        } else {
            return 0;
        }
    }

    public function calcularDiasAcumulados($idpersona, $identidad, $lugaresdecimales = null)
    {
        $sqlvacacionespersona = "select *
        from mod_nomina.dat_vacacionespersona vac
        where vac.idpersona = ? and vac.identidad = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arreglovacacionespersona = $conn->fetchAll($sqlvacacionespersona, array($idpersona, $identidad));
        if (count($arreglovacacionespersona) > 0) {
            $objHisVacaciones = new HisVacacionesPersona();
            $arrultimaoperacion = $objHisVacaciones->obtenerUltimaOperacionSubMayor($arreglovacacionespersona[0]['idvacacionespersona']);
            if (count($arrultimaoperacion) > 0) {
                //return $arrultimaoperacion[0]['saldoentiempo'];
                return number_format($arrultimaoperacion[0]['saldoentiempo'], ((!empty($lugaresdecimales)) ? $lugaresdecimales : 2), '.', '');
            } else {
                //return $arreglovacacionespersona[0]['tiempoacumuladoinicial'];
                return number_format($arreglovacacionespersona[0]['tiempoacumuladoinicial'], ((!empty($lugaresdecimales)) ? $lugaresdecimales : 2), '.', '');
            }
        } else {
            return 0;
        }
    }

    public function calcularImporteAcumulado($idpersona, $identidad, $lugaresdecimales = null)
    {
        $sqlvacacionespersona = "select *
        from mod_nomina.dat_vacacionespersona vac
        where vac.idpersona = ? and vac.identidad = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arreglovacacionespersona = $conn->fetchAll($sqlvacacionespersona, array($idpersona, $identidad));
        if (count($arreglovacacionespersona) > 0) {
            $objHisVacaciones = new HisVacacionesPersona();
            $arrultimaoperacion = $objHisVacaciones->obtenerUltimaOperacionSubMayor($arreglovacacionespersona[0]['idvacacionespersona']);
            if (count($arrultimaoperacion) > 0) {
                //return $arrultimaoperacion[0]['saldoenimporte'];
                return number_format ($arrultimaoperacion[0]['saldoenimporte'], ((!empty($lugaresdecimales)) ? $lugaresdecimales : 2), '.', '');
            } else {
                //return $arreglovacacionespersona[0]['importeacumuladoinicial'];
                return number_format ($arreglovacacionespersona[0]['importeacumuladoinicial'], ((!empty($lugaresdecimales)) ? $lugaresdecimales : 2), '.', '');;
            }
        } else {
            return 0;
        }
    }


    public function obtenerSaldosVacacionesPersonaEntidadMesAnno($idpersona, $idestructura, $mes, $anno)
    {
        $periodo = $mes . '-' . $anno;
        //Obteniendo el idhisvacacionespersona maximo de un mes determinado
        $sqlidhissaldovacaciones = "select max(hvp.idhisvacacionespersona) as idhisvacacionespersona
        from mod_nomina.dat_vacacionespersona vac
        inner join mod_nomina.his_vacacionespersona hvp on (hvp.idvacacionespersona = vac.idvacacionespersona)
        where vac.idpersona = ? and vac.identidad = ? and periodo ilike '" . $periodo . "' ;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $idhisvacacionespersonamesanno = $conn->fetchOne($sqlidhissaldovacaciones, array($idpersona, $idestructura));
        //Obteniendo el saldo de las vacaciones de la persona da una entidad, un mes y un anno
        $sqlsaldovacacionespersonamesanno = "select *
        from mod_nomina.his_vacacionespersona hvp
        where hvp.idhisvacacionespersona = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $datoshisvacacionespersonamesanno = $conn->fetchAll($sqlsaldovacacionespersonamesanno, array($idhisvacacionespersonamesanno));
        return $datoshisvacacionespersonamesanno;
    }
}
