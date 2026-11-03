<?php

/**
 * Created by JetBrains PhpStorm.
 * User: yosniel
 * Date: 6/05/16
 * Time: 9:23
 */
include_once (Zend_Registry::get('config')->dir_aplication . '/planmeta/lib/PHPExcel/Classes/PHPExcel.php');
include_once (Zend_Registry::get('config')->dir_aplication . '/planmeta/lib/PHPExcel/PHPExcel/Classes/PHPExcel/IOFactory.php');

class DatEtapaEquipoModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function adicionarEquipos($array_equipo, $params) {
        $datos = DatEtapaEquipo::adiconarEqui($array_equipo, $params);
        return $datos;
    }

    public function CargarEqui($params) {
        $datos = DatEtapaEquipo::listarEquipos($params);
//print_r($datos);die;
        foreach ($datos['data'] as $key => $value) {
            $datos['data'][$key]['cantidad'] = number_format($value['cantidad'], '0', '.', ',');
            $datos['data'][$key]['precio'] = number_format($value['precio'], '2', '.', ',');
            $datos['data'][$key]['preciodivisa'] = number_format($value['preciodivisa'], '2', '.', ',');
            $datos['data'][$key]['importe'] = number_format($value['importe'], '2', '.', '');
            $datos['data'][$key]['importedivisa'] = number_format($value['importedivisa'], '2', '.', '');
        }
        return $datos;
    }

    public function CargarEquipos($params) {

        $datos = DatEtapaEquipo::listarEquiposPlan($params);
        foreach ($datos['data'] as $key => $value) {
            $datos['data'][$key]['cantidad'] = number_format($value['cantidad'], '0', '.', ',');
            $datos['data'][$key]['precio'] = number_format($value['precio'], '2', '.', ',');
            $datos['data'][$key]['preciodivisa'] = number_format($value['preciodivisa'], '2', '.', ',');
            $datos['data'][$key]['importe'] = number_format($value['importe'], '2', '.', ',');
            $datos['data'][$key]['importedivisa'] = number_format($value['importedivisa'], '2', '.', ',');
        }
        return $datos;
    }

    public function CargarEquiposDesglose($params) {
//        $datosEquipos = DatEtapaEquipo::listarEquiposDesglose($params);
        $datosEquipos = DatEtapaEquipo::listarEquiposDesagregac($params);
        $datos = Array();
        $auxIdindicador = -1;
        $total = 0;
        foreach ($datosEquipos as $key => $value) {
            if ($value['idindicador'] != $auxIdindicador) {
                $datos[$key][$value['identidadmodelo']] = number_format($value['valor'], '0', '.', ',');
                $datos[$key]['denominacion'] = $value['denominacion'];
                $datos[$key]['descripcion'] = $value['descripcion'];
                $datos[$key]['importe'] = $value['importe'];
                $datos[$key]['importedivisa'] = $value['importedivisa'];
                $datos[$key]['adquirir'] = $value['adquirir'];
                $datos[$key]['comprar'] = $value['comprar'];
                $datos[$key]['comprarpais'] = $value['comprarpais'];
                $datos[$key]['idindicador'] = $value['idindicador'];
                $datos[$key]['total'] = $value['valor'];
                $total += $value['valor'];
            } else {
                $datos[$key - 1][$value['identidadmodelo']] = number_format($value['valor'], '0', '.', ',');
                $total += $value['valor'];
                $datos[$key - 1]['total'] = $total;
            }
            $auxIdindicador = $value['idindicador'];
        }
//pre_r($datos);die;
        return $datos;
    }

    public function fnCargarEquiposDesglose($datosInv) {
        $modelInv = new DatInversion();
        $ejercicio = array();
        $ejercicio[0]['id'] = $modelInv->idejercicioPorDenominacion($datosInv['aaejercicio']);
        $ejercicio[1]['id'] = $modelInv->idejercicioPorDenominacion($datosInv['aejercicio']);
        $ejercicio[2]['id'] = $datosInv['idejercicio'];
        $ejercicio[3]['id'] = $modelInv->idejercicioPorDenominacion($datosInv['pejercicio']);
        $pres = self::cargarEquiposDesg($datosInv, $ejercicio);
        return $pres;
    }

    public function cargarEquiposDesg($datosInv, $ejercicio) {
        $model = new DatEtapaEquipo();
        $cont = 1;
        $equipos = $model->cargarEquiposGlobal($datosInv); //TODOS LOS SECTORES POR EJERC ENTIDAD INVERSION
//print_r($equipos);die;
        foreach ($equipos as $key => $valor) {//RECORRO LOS sectores
            $equipos[$key]['cantidad'] = $valor['cantidad'] ? number_format($valor['cantidad'], '0', '', '') : 0;
            foreach ($ejercicio as $ke => $ejer) {//REINICIA EL CONTADOR
                $ejecutar = $model->listarejecutado($ejer['id'], $datosInv, $valor['idetapaequipos']);
                $equipos[$key]['ejecutado' . $cont] = $ejecutar[0]['valor'] ? number_format($ejecutar[0]['valor'], '0', '', '') : 0;
                if ($ejecutar[0]['idetapaequipoejecutado'] != "") {
                    $equipos[$key]['idetapaequipoejecutado' . $cont] = $ejecutar[0]['idetapaequipoejecutado'] ? $ejecutar[0]['idetapaequipoejecutado'] : 0;
                }
                $estima = $model->listarestimado($ejer['id'], $datosInv, $valor['idetapaequipos']);
                $equipos[$key]['estimado' . $cont] = $estima[0]['valor'] ? number_format($estima[0]['valor'], '0', '', '') : 0;
                if ($estima[0]['idetapaequipoestimado'] != "") {
                    $equipos[$key]['idetapaequipoestimado' . $cont] = $estima[0]['idetapaequipoestimado'] ? $estima[0]['idetapaequipoestimado'] : 0;
                }

                $proyec = $model->listarproyecc($ejer['id'], $datosInv, $valor['idetapaequipos']);
                $equipos[$key]['proyec' . $cont] = $proyec[0]['valor'] ? number_format($proyec[0]['valor'], '0', '', '') : 0;
                if ($proyec[0]['idetapaequipoproyectado'] != "") {
                    $equipos[$key]['idetapaequipoproyectado' . $cont] = $proyec[0]['idetapaequipoproyectado'] ? $proyec[0]['idetapaequipoproyectado'] : 0;
                }

                $plan = $model->listarplanmdio($ejer['id'], $datosInv, $valor['idetapaequipos']);
                $equipos[$key]['plan' . $cont] = $plan[0]['valor'] ? number_format($plan[0]['valor'], '0', '', '') : 0;
                if ($plan[0]['idetapaequipoplan'] != "") {
                    $equipos[$key]['idetapaequipoplan' . $cont] = $plan[0]['idetapaequipoplan'] ? $plan[0]['idetapaequipoplan'] : 0;
                }
                $cont = $cont + 1;
            }
            $cont = 1;
            $equipos[$key]['annospos'] = $valor['cantidad'] - ($equipos[$key]['ejecutado1'] + $equipos[$key]['estimado2'] + $equipos[$key]['plan3'] + $equipos[$key]['proyec4']);
        }
        return $equipos;
    }

    public function listarEntidadModelo($params) {
        $datos = DatEtapaEquipo::listarEnt($params);
        return $datos;
    }

    public function eliminarEquipo($parametros) {
        $idetapaequipo = Array();
        $idEquiposNoElim = Array();
        // print_r($parametros);die;

        $des = "Se eliminó el equipo: ";
        
        foreach ($parametros['idindicadores'] as $key => $idInd) {
            $boolEquipoDesg = DatEtapaEquipo::boolEquipoDesglosado($parametros['idetapaequipos'][$key]);
            if ($boolEquipoDesg[0]['cont'] == 0) {
                $idetapaequipo[] = $parametros['idetapaequipos'][$key];
                $des = $des. "{$parametros['idetapaequipos'][$key]}, ";
            } else {
                $idEquiposNoElim[] = $parametros['idindicadores'][$key];
            }
        }
//pre_r($idetapaequipo);die;
//pre_r($idEquiposNoElim);die;
        if (count($idetapaequipo)){
            DatEtapaEquipo::eliminarEqui(implode(',', $idetapaequipo));
//print_r($parametros);die;
//            HisTrazasinversionesModel::seveTrazasInversiones('Inversión_Constructor', 'modificar', 'dat_etapaequipos', 
//                    $parametros['idinversion'], $des, $parametros['idusuario']);
        }
        return $idEquiposNoElim;
    }

    public function equipoDesglosado($parametros) {
        return DatEtapaEquipo::boolEquipoDesglosado($parametros);
    }

    public function guardarEquipos($params) {
        $arrep = Array();
        $des = " Se modifico el quipo: ";
        foreach ($params['idetapaequipos'] as $key => $dat) {
// print_r($dat);die('swdw');
            $arrep['cantidad'] = $dat->cantidad;
            $arrep['precio'] = $dat->precio;
            $arrep['preciodivisa'] = $dat->preciodivisa;
            $import = $dat->cantidad * $dat->precio;
            $arrep['importe'] = $import;
            $importD = $dat->cantidad * $dat->preciodivisa;
            $arrep['importedivisa'] = $importD;
            $arrep['observaciones'] = $dat->observaciones;
            $arrep['idadquisicion'] = is_numeric($dat->adquirir) ? $dat->adquirir : $dat->idadquisicion;
            $arrep['idcomprar'] = is_numeric($dat->comprar) ? $dat->comprar : $dat->idcomprar;
            $arrep['idcomprarpais'] = is_numeric($dat->pais) ? $dat->pais : $dat->idcomprarpais;
            $arrep['idetapaequipos'] = $dat->idetapaequipos;

            $des = $des . "{$dat->denominacion} con los siguientes datos: cantidad: {$dat->cantidad}, idcomprar: {$arrep['idcomprar']},
            idpais: {$arrep['idcomprarpais']}, idadquisicion: {$arrep['idadquisicion']},observaciones: {$arrep['observaciones']}, ";
            //HisTrazasinversionesModel::seveTrazasInversiones('Inversión_Constructor', 'modificar', 'dat_etapaequipos', $params['idinversion'], $des, $params['idusuario']);

            $datos = DatEtapaEquipo::updateEquipos($params, $arrep);
        }

        //Insertar Traza
        return $datos;
    }

    public function deVolEtapa($params) {
        $datos = DatEtapaEquipo::deVolEtapa($params);
        return $datos;
    }

    public function deVolPlan($params) {
        $datos = DatEtapaEquipo::deVolPlan($params);
        return $datos;
    }

    public function guardarValorEquipo($parametros) {
        $ejercicio = Array();
        $ejercicio[0]['id'] = DatInversion::idejercicioPorDenominacion($parametros['aaejercicio']);
        $ejercicio[1]['id'] = DatInversion::idejercicioPorDenominacion($parametros['aejercicio']);
        $ejercicio[2]['id'] = $parametros['idejercicio'];
        $ejercicio[3]['id'] = DatInversion::idejercicioPorDenominacion($parametros['pejercicio']);
        self::fnGuardarEquipos($ejercicio, $parametros);
    }

    public function guardarValorEquipoAjuste($parametros) {
        $ejercicio = Array();
        $ejercicio[0]['id'] = DatInversion::idejercicioPorDenominacion($parametros['aaejercicio']);
        $ejercicio[1]['id'] = DatInversion::idejercicioPorDenominacion($parametros['aejercicio']);
        $ejercicio[2]['id'] = $parametros['idejercicio'];
        $ejercicio[3]['id'] = DatInversion::idejercicioPorDenominacion($parametros['pejercicio']);
        self::fnGuardarEquiposAjuste($ejercicio, $parametros);
    }

    public function fnGuardarEquipos($ejercicio, $parametros) {
//pre_r($parametros);die;
        $cont = 1;
        $modequipo = new DatEtapaEquipo();
        $modDatInversion = new DatInversion();
        foreach ($parametros['datos'] as $key => $valor) {//RECORRE EL ARREGLO DE FILAS MODIFICADAS
            if ($valor->idetapaequipoglobal == "") {
                $idEquiposGlob = $modequipo->insertarEquiposGlobal($valor->idetapaequipos, $valor->idadquisicion ? $valor->idadquisicion : 1, $valor->idcomprar ? $valor->idcomprar : 1, $valor->idcomprarpais ? $valor->idcomprarpais : 1);
            } else {
                $idEquiposGlob = $valor->idetapaequipoglobal;
            }
            foreach ($ejercicio as $value) {//REINICIA EL CONTADOR
                $boolSaveTrazas = false;
                $estado = DatInversion::estadoEjercicioPorEjercicio($value['id']);
                $pos1 = "ejecutado" . $cont; //POSICION DEL VALOR A MODIFICAR
                $pos2 = "idetapaequipoejecutado" . $cont; //POSICION DEL VALOR QUE TIENE EL ID QUE SE ACTUALIZARA

                $pos3 = "proyec" . $cont;
                $pos4 = "idetapaequipoproyectado" . $cont;

                $pos5 = "estimado" . $cont;
                $pos6 = "idetapaequipoestimado" . $cont;

                $pos7 = "plan" . $cont;
                $pos8 = "idetapaequipoplan" . $cont;
//        print_r($valor);die;
                if ($valor->$pos2 != "") {
                    $cantidad = $valor->$pos1;
                    if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                        if ($valor->$pos1 != 0) {
                            $modDatInversion->updatevalor("dat_etapaequipoejecutado", $valor->$pos1, "idetapaequipoejecutado", $valor->$pos2, $value['id']);
                        } else {
                            $modequipo->eliminarGlobal("dat_etapaequipoejecutado", "idetapaequipoejecutado", $valor->$pos2);
                        }
                    } else if ($estado == 'Listo') {
                        if ($valor->$pos1 != 'plan' && $valor->$pos1 != 'proyec')
                            if ($valor->$pos1 != 0) {
                                $modDatInversion->updatevalor("dat_etapaequipoejecutado", $valor->$pos1, "idetapaequipoejecutado", $valor->$pos2, $value['id']);
                            } else {
                                $modequipo->eliminarGlobal("dat_etapaequipoejecutado", "idetapaequipoejecutado", $valor->$pos2);
                            }
                    } else if ($estado == 'Ejecución') {
                        if ($valor->$pos1 != 'plan' && $valor->$pos1 != 'proyec' && $valor->$pos1 != 'estimado')
                            if ($valor->$pos1 != 0) {
                                $boolSaveTrazas = true;
                                $tabla = "mod_planifinversiones.dat_etapaequipoejecutado";
                                $acc = "actualizar";
                                $des = "Se actualizó el equipo: {$valor->denominacion} de: ## a: {$valor->$pos1}";

                                $modDatInversion->updatevalor("dat_etapaequipoejecutado", $valor->$pos1, "idetapaequipoejecutado", $valor->$pos2, $value['id']);
                            } else {
                                $modequipo->eliminarGlobal("dat_etapaequipoejecutado", "idetapaequipoejecutado", $valor->$pos2);
                            }
                    }
                } else if ($valor->$pos1 != "" && $valor->$pos1 != 0) {
                    $cantidad = $valor->$pos1;
                    if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                        $modequipo->addvalorGlobal("dat_etapaequipoejecutado", $idEquiposGlob, $value['id'], $valor->$pos1);
                    } else if ($estado == 'Listo') {
                        if ($valor->$pos1 != 'plan' && $valor->$pos1 != 'proyec')
                            $modequipo->addvalorGlobal("dat_etapaequipoejecutado", $idEquiposGlob, $value['id'], $valor->$pos1);
                    }else if ($estado == 'Ejecución') {
                        //pre_r('entra');
                        if ($valor->$pos1 != 'plan' && $valor->$pos1 != 'proyec' && $valor->$pos1 != 'estimado')
                            $modequipo->addvalorGlobal("dat_etapaequipoejecutado", $idEquiposGlob, $value['id'], $valor->$pos1);
                    }
                }

                if ($valor->$pos6 != "") {


                    $cantidad = $valor->$pos5;
                    if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                        if ($valor->$pos5 != 0) {
                            $modDatInversion->updatevalor("dat_etapaequipoestimado", $valor->$pos5, "idetapaequipoestimado", $valor->$pos6, $value['id']);
                        } else {
                            $modequipo->eliminarGlobal("dat_etapaequipoestimado", "idetapaequipoestimado", $valor->$pos6);
                        }
                    } else if ($estado == 'Listo') {
                        if ($valor->$pos5 != 'plan' && $valor->$pos5 != 'proyec')
                            if ($valor->$pos5 != 0) {
                                $modDatInversion->updatevalor("dat_etapaequipoestimado", $valor->$pos5, "idetapaequipoestimado", $valor->$pos6, $value['id']);
                            } else {
                                $modequipo->eliminarGlobal("dat_etapaequipoestimado", "idetapaequipoestimado", $valor->$pos6);
                            }
                    } else if ($estado == 'Ejecución') {
                        if ($valor->$pos5 != 'plan' && $valor->$pos5 != 'proyec' && $valor->$pos5 != 'estimado')
                            if ($valor->$pos5 != 0) {
                                $modDatInversion->updatevalor("dat_etapaequipoestimado", $valor->$pos5, "idetapaequipoestimado", $valor->$pos6, $value['id']);
                            } else {
                                $modequipo->eliminarGlobal("dat_etapaequipoestimado", "idetapaequipoestimado", $valor->$pos6);
                            }
                    }
                } else if ($valor->$pos5 != "" && $valor->$pos5 != 0) {
                    $cantidad = $valor->$pos5;

                    if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                        $modequipo->addvalorGlobal("dat_etapaequipoestimado", $idEquiposGlob, $value['id'], $valor->$pos5);
                    } else if ($estado == 'Listo') {
                        if ($valor->$pos5 != 'plan' && $valor->$pos5 != 'proyec')
                            $modequipo->addvalorGlobal("dat_etapaequipoestimado", $idEquiposGlob, $value['id'], $valor->$pos5);
                    }else if ($estado == 'Ejecución') {
                        if ($valor->$pos5 != 'plan' && $valor->$pos5 != 'proyec' && $valor->$pos5 != 'estimado')
                            $modequipo->addvalorGlobal("dat_etapaequipoestimado", $idEquiposGlob, $value['id'], $valor->$pos5);
                    }
                }

                if ($valor->$pos4 != "") {
                    $cantidad = $valor->$pos3;
                    if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                        if ($valor->$pos3 != 0) {
                            $modDatInversion->updatevalor("dat_etapaequipoproyectado", $valor->$pos3, "idetapaequipoproyectado", $valor->$pos4, $value['id']);
                        } else {
                            $modequipo->eliminarGlobal("dat_etapaequipoproyectado", "idetapaequipoproyectado", $valor->$pos4);
                        }
                    } else if ($estado == 'Listo') {
                        if ($valor->$pos3 != 'plan' && $valor->$pos3 != 'proyec')
                            if ($valor->$pos3 != 0) {
                                $modDatInversion->updatevalor("dat_etapaequipoproyectado", $valor->$pos3, "idetapaequipoproyectado", $valor->$pos4, $value['id']);
                            } else {
                                $modequipo->eliminarGlobal("dat_etapaequipoproyectado", "idetapaequipoproyectado", $valor->$pos4);
                            }
                    } else if ($estado == 'Ejecución') {
                        if ($valor->$pos3 != 'plan' && $valor->$pos3 != 'proyec' && $valor->$pos3 != 'estimado')
                            if ($valor->$pos3 != 0) {
                                $modDatInversion->updatevalor("dat_etapaequipoproyectado", $valor->$pos3, "idetapaequipoproyectado", $valor->$pos4, $value['id']);
                            } else {
                                $modequipo->eliminarGlobal("dat_etapaequipoproyectado", "idetapaequipoproyectado", $valor->$pos4);
                            }
                    }
                } else if ($valor->$pos3 != "" && $valor->$pos3 != 0) {
                    $cantidad = $valor->$pos3;

                    if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                        $modequipo->addvalorGlobal("dat_etapaequipoproyectado", $idEquiposGlob, $value['id'], $valor->$pos3);
                    } else if ($estado == 'Listo') {
                        if ($valor->$pos3 != 'plan' && $valor->$pos3 != 'proyec')
                            $modequipo->addvalorGlobal("dat_etapaequipoproyectado", $idEquiposGlob, $value['id'], $valor->$pos3);
                    }else if ($estado == 'Ejecución') {
                        if ($valor->$pos3 != 'plan' && $valor->$pos3 != 'proyec' && $valor->$pos3 != 'estimado')
                            $modequipo->addvalorGlobal("dat_etapaequipoproyectado", $idEquiposGlob, $value['id'], $valor->$pos3);
                    }
                }

                if ($valor->$pos8 != "") {
                    $objEquipoAnterior = $modDatInversion->getValor("dat_etapaequipoplan", $valor->$pos7, "idetapaequipoglobal", $valor->idetapaequipoglobal, $value['id']);
                    if ($objEquipoAnterior[0]['valor'] != $valor->$pos7) {
                        $cantidad = $valor->$pos7;
                        if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                            if ($valor->$pos7 != 0) {
                                $modDatInversion->updatevalor("dat_etapaequipoplan", $valor->$pos7, "idetapaequipoglobal", $valor->idetapaequipoglobal, $value['id']);
                            } else {
                                $modequipo->eliminarGlobal("dat_etapaequipoplan", "idetapaequipoplan", $valor->$pos8);
                            }
                        } else if ($estado == 'Listo') {
                            if ($valor->$pos7 != 'plan' && $valor->$pos7 != 'proyec')
                                if ($valor->$pos7 != 0) {
                                    $modDatInversion->updatevalor("dat_etapaequipoplan", $valor->$pos7, "idetapaequipoglobal", $valor->idetapaequipoglobal, $value['id']);
                                } else {
                                    $modequipo->eliminarGlobal("dat_etapaequipoplan", "idetapaequipoplan", $valor->$pos8);
                                }
                        } else if ($estado == 'Ejecución') {
                            if ($valor->$pos7 != 'plan' && $valor->$pos7 != 'proyec' && $valor->$pos7 != 'estimado')
                                if ($valor->$pos7 != 0) {
                                    $modDatInversion->updatevalor("dat_etapaequipoplan", $valor->$pos7, "idetapaequipoglobal", $valor->idetapaequipoglobal, $value['id']);
                                } else {
                                    $modequipo->eliminarGlobal("dat_etapaequipoplan", "idetapaequipoplan", $valor->$pos8);
                                }
                        }
                    }
                } else if ($valor->$pos7 != "" && $valor->$pos7 != 0) {
                    $cantidad = $valor->$pos7;

                    if ($estado != 'Cerrado' && $estado != 'Listo' && $estado != 'Ejecución') {
                        $modequipo->addvalorGlobal("dat_etapaequipoplan", $idEquiposGlob, $value['id'], $valor->$pos7);
                    } else if ($estado == 'Listo') {
                        if ($valor->$pos7 != 'plan' && $valor->$pos7 != 'proyec')
                            $modequipo->addvalorGlobal("dat_etapaequipoplan", $idEquiposGlob, $value['id'], $valor->$pos7);
                    }else if ($estado == 'Ejecución') {
                        if ($valor->$pos7 != 'plan' && $valor->$pos7 != 'proyec' && $valor->$pos7 != 'estimado')
                            $modequipo->addvalorGlobal("dat_etapaequipoplan", $idEquiposGlob, $value['id'], $valor->$pos7);
                    }
                }
                $cont = $cont + 1;

                $boolSaveTrazas = true;
                $tabla = "dat_etapaequipoejecutado";
                $acc = "actualizar";
                $des = "Se actualizó por el botón guardarel equipo: {$valor->denominacion} del plan: {$parametros['plan']} con los siguientes datos, 
                        cantidad: {$cantidad} comprar: {$valor->comprar} país: {$valor->pais}, 
                        el ejercicio estaba en: {$estado}";

                if ($boolSaveTrazas) {
//                    HisTrazasinversionesModel::seveTrazasInversiones('Desglose Equipo', $acc, $tabla, $parametros['idinversion'], $des, $parametros['usuario']);
                }
            }
            $cont = 1;
        }
    }

    public function fnGuardarEquiposAjuste($ejercicio, $parametros) {
        $cont = 1;
        $modequipo = new DatEtapaEquipo();
        $modDatInversion = new DatInversion();
        foreach ($parametros['datos'] as $key => $valor) {//RECORRE EL ARREGLO DE FILAS MODIFICADAS
            if ($valor->idetapaequipoglobal == "") {
                $idEquiposGlob = $modequipo->insertarEquiposGlobal($valor->idetapaequipos, $valor->idadquisicion ? $valor->idadquisicion : 1, $valor->idcomprar ? $valor->idcomprar : 1, $valor->idcomprarpais ? $valor->idcomprarpais : 1);
            } else {
                $idEquiposGlob = $valor->idetapaequipoglobal;
            }
            foreach ($ejercicio as $value) {//REINICIA EL CONTADOR
                $pos1 = "ejecutado" . $cont; //POSICION DEL VALOR A MODIFICAR
                $pos2 = "idetapaequipoejecutado" . $cont; //POSICION DEL VALOR QUE TIENE EL ID QUE SE ACTUALIZARA

                $pos3 = "proyec" . $cont;
                $pos4 = "idetapaequipoproyectado" . $cont;

                $pos5 = "estimado" . $cont;
                $pos6 = "idetapaequipoestimado" . $cont;

                $pos7 = "plan" . $cont;
                $pos8 = "idetapaequipoplan" . $cont;
                if ($valor->$pos2 != "") {
                    $cantidad = $valor->$pos1;
                    if ($valor->$pos1 != 0) {
                        $modDatInversion->updatevalor("dat_etapaequipoejecutado", $valor->$pos1, "idetapaequipoejecutado", $valor->$pos2, $value['id']);
                    } else {
                        // $modequipo->eliminarGlobal("dat_etapaequipoglobal", $valor->idetapaequipoglobal);
                        $modequipo->eliminarGlobal("dat_etapaequipoejecutado", "idetapaequipoejecutado", $valor->$pos2);
                    }
                } else if ($valor->$pos1 != "" && $valor->$pos1 != 0) {
                    $cantidad = $valor->$pos1;
                    $modequipo->addvalorGlobal("dat_etapaequipoejecutado", $idEquiposGlob, $value['id'], $valor->$pos1);
                }

                if ($valor->$pos6 != "") { // print_r(1);die;
                    $cantidad = $valor->$pos5;
                    if ($valor->$pos5 != 0) {
                        $modDatInversion->updatevalor("dat_etapaequipoestimado", $valor->$pos5, "idetapaequipoestimado", $valor->$pos6, $value['id']);
                    } else {
                        $modequipo->eliminarGlobal("dat_etapaequipoestimado", "idetapaequipoestimado", $valor->$pos6);
                        //  $modequipo->eliminarGlobal("dat_etapaequipoglobal", $valor->idetapaequipoglobal);
                    }
                } else if ($valor->$pos5 != "" && $valor->$pos5 != 0) {
                    $cantidad = $valor->$pos5;
                    $modequipo->addvalorGlobal("dat_etapaequipoestimado", $idEquiposGlob, $value['id'], $valor->$pos5);
                }
                if ($valor->$pos4 != "") {
                    $cantidad = $valor->$pos3;
                    if ($valor->$pos3 != 0) {
                        $modDatInversion->updatevalor("dat_etapaequipoproyectado", $valor->$pos3, "idetapaequipoproyectado", $valor->$pos4, $value['id']);
                    } else {
                        $modequipo->eliminarGlobal("dat_etapaequipoproyectado", "idetapaequipoproyectado", $valor->$pos4);
                        //  $modequipo->eliminarGlobal("dat_etapaequipoglobal", $valor->idetapaequipoglobal);
                    }
                } else if ($valor->$pos3 != "" && $valor->$pos3 != 0) {
                    $cantidad = $valor->$pos3;
                    $modequipo->addvalorGlobal("dat_etapaequipoproyectado", $idEquiposGlob, $value['id'], $valor->$pos3);
                }
                if ($valor->$pos8 != "") {
                    $cantidad = $valor->$pos7;
                    if ($valor->$pos7 != 0) {
                        $modDatInversion->updatevalor("dat_etapaequipoplan", $valor->$pos7, "idetapaequipoglobal", $valor->idetapaequipoglobal, $value['id']);
                    } else {
                        $modequipo->eliminarGlobal("dat_etapaequipoplan", "idetapaequipoplan", $valor->$pos8);
                        //  $modequipo->eliminarGlobal("dat_etapaequipoglobal", $valor->idetapaequipoglobal);
                    }
                } else if ($valor->$pos7 != "" && $valor->$pos7 != 0) {
                    $cantidad = $valor->$pos7;
                    $modequipo->addvalorGlobal("dat_etapaequipoplan", $idEquiposGlob, $value['id'], $valor->$pos7);
                }
                $cont = $cont + 1;

                $boolSaveTrazas = true;
                $tabla = "dat_etapaequipoejecutado";
                $acc = "actualizar";
                $des = "Se actualizó por el Ajustar guardarel equipo: {$valor->denominacion} del plan: {$parametros['plan']} con los siguientes datos, 
                        cantidad: {$cantidad} comprar: {$valor->comprar} país: {$valor->pais}, 
                        el ejercicio estaba en: {$estado}";

                if ($boolSaveTrazas) {
//                    HisTrazasinversionesModel::seveTrazasInversiones('Desglose Equipo', $acc, $tabla, $parametros['idinversion'], $des, $parametros['usuario']);
                }
            }
            $cont = 1;
        }
    }
    
    public function actualizarPrecioEquipos($params) {

        //$datos = DatEtapaEquipo::listarEquiposPlan($params);
        foreach ($params['idetapaequipos'] as $value) {
            $data=DatEtapaEquipo::dameEquipo($value);
            $data[0]['idetapaequipos']=$value;
            DatEtapaEquipo::UpdateEquipo($data);
        }
        return 1;
    }

}
