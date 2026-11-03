<?php

class DatMedioAmbienteModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function listarAcciones($data) {
        $model = new DatAmbiente();
        $result = $model->listarAcciones($data);
        echo json_encode(array('data' => $result, 'total' => count($result)));
    }

    public function listarCuencas($data) {
        $model = new DatAmbiente();
        $result = $model->listarCuencas($data);
        echo json_encode(array('data' => $result, 'total' => count($result)));
    }

    public function listarBahias($data) {
        $model = new DatAmbiente();
        $result = $model->listarBahias($data);
        echo json_encode(array('data' => $result, 'total' => count($result)));
    }

    public function guardarValorGlobal($parametros) {
        $ejercicio = Array();
        $moneda = Array();
        $ejercicio[0]['id'] = DatInversion::idejercicioPorDenominacion($parametros['aaejercicio']);
        $ejercicio[1]['id'] = DatInversion::idejercicioPorDenominacion($parametros['aejercicio']);
        $ejercicio[2]['id'] = $parametros['idejercicio'];
        $ejercicio[3]['id'] = DatInversion::idejercicioPorDenominacion($parametros['pejercicio']);
        $moneda[0]['id'] = $parametros['MP'];
        $moneda[0]['name'] = 'mp';
        $moneda[1]['id'] = $parametros['USD'];
        $moneda[1]['name'] = 'usd';
        $nomsector = DatAmbiente::cargarNomAmb("dat_sector", "idsector"); //idnomencaldor sector
        self::fnGuardarGlobal($ejercicio, $moneda, $parametros, $nomsector);
    }

    public function fnGuardarGlobal($ejercicio, $moneda, $parametros, $nomsector) {
        $cont = 1;
        $modGlobag = new DatMedioambglobal();
        $modDatInversion = new DatInversion();
        foreach ($parametros['datos'] as $key => $valor) {//RECORRE EL ARREGLO DE FILAS MODIFICADAS
            if (is_numeric($valor->denominacion)) {
                if (!$valor->idmedioambglobal) {
                    $id = self::adicionarSector($valor, $parametros['idinversion'], $nomsector);
                    if ($id != "" && $id != 0) {
                        $parametros['datos'][$key]->idmedioambglobal = $id;
                    }
                } else {
                    $nom = $modGlobag->getIdNomen($valor->idmedioambglobal);
                    $modGlobag->modDatos($valor->denominacion, $valor->idmedioambglobal, $nom[0]['idnomenclador']);
                }
            }
            if ($valor->sumapresp_usd != "" && $valor->sumapresp_usd != 0) {
                $modGlobag->addPresupuestoGlobal($valor->idmedioambglobal, $parametros['USD'], $valor->sumapresp_usd);
            }
            if ($valor->sumapresp_mp != "" && $valor->sumapresp_mp != 0) {
                $modGlobag->addPresupuestoGlobal($valor->idmedioambglobal, $parametros['MP'], $valor->sumapresp_mp);
            }
            foreach ($ejercicio as $value) {//REINICIA EL CONTADOR
                $estadoEjer = DatInversion::estadoEjercicioPorEjercicio($value['id']);
                foreach ($moneda as $value1) {//DEFINE LAS DOS MONEDAS QUE SE VAN A LISTAR
                    $pos1 = "ejecutado" . $value1['name'] . $cont; //POSICION DEL VALOR A MODIFICAR
                    $pos2 = "idmedioambejecutado" . $value1['name'] . $cont; //POSICION DEL VALOR QUE TIENE EL ID QUE SE ACTUALIZARA

                    $pos3 = "proyec" . $value1['name'] . $cont;
                    $pos4 = "idmedioambproyectado" . $value1['name'] . $cont;

                    $pos5 = "estimado" . $value1['name'] . $cont;
                    $pos6 = "idmedioambestimado" . $value1['name'] . $cont;

                    $pos7 = "plan" . $value1['name'] . $cont;
                    $pos8 = "idmedioambplan" . $value1['name'] . $cont;
                    
                    if (($estadoEjer != 'Cerrado' && $estadoEjer != 'Listo' && $estadoEjer != 'Ejecución') || ($parametros['ajustar'] == 'true')) { //Creado --Elaboracion
                        self::saveEjecutadoMA($valor->$pos1, $valor->$pos2, $value['id'], $parametros['idinversion'], 
                                $value1['id'], $valor->idmedioambglobal, $modDatInversion, $modGlobag);
                        self::saveEstimadoMA($valor->$pos5, $valor->$pos6, $value['id'], $parametros['idinversion'], 
                                $value1['id'], $valor->idmedioambglobal, $modDatInversion, $modGlobag);
                        self::saveProyecMA($valor->$pos3, $valor->$pos4, $value['id'], $parametros['idinversion'], 
                                $value1['id'], $valor->idmedioambglobal, $modDatInversion, $modGlobag);
                        self::savePlanMA($valor->$pos7, $valor->$pos8, $value['id'], $parametros['idinversion'], 
                                $value1['id'], $valor->idmedioambglobal, $modDatInversion, $modGlobag);
                    } else if ($estadoEjer == 'Listo') {
                        self::saveEjecutadoMA($valor->$pos1, $valor->$pos2, $value['id'], $parametros['idinversion'], 
                                $value1['id'], $valor->idmedioambglobal, $modDatInversion, $modGlobag);
                        self::saveEstimadoMA($valor->$pos5, $valor->$pos6, $value['id'], $parametros['idinversion'], 
                                $value1['id'], $valor->idmedioambglobal, $modDatInversion, $modGlobag);
                    } else if ($estadoEjer == 'Ejecución') {
                        self::saveEjecutadoMA($valor->$pos1, $valor->$pos2, $value['id'], $parametros['idinversion'], 
                                $value1['id'], $valor->idmedioambglobal, $modDatInversion, $modGlobag);
                    }
                    
                }
                $cont = $cont + 1;
            }
            $cont = 1;
        }
    }
    
    private function saveEjecutadoMA($val1, $val2, $idEjer, $idInvers, $idmoneda, $idmedioambglobal, $modDatInversion, $modGlobag) {
        if ($val2 != "") {
            if ($val1 != 0) {
                $modDatInversion->updatevalor("dat_medioambejecutado", $val1, "idmedioambejecutado", $val2, $idEjer);
            } else {
                $modGlobag->eliminarGlobal("dat_medioambejecutado", $idInvers, "idmedioambejecutado", $val2);
            }
        } else if ($val1 != "" && $val1 != 0) {
            $modGlobag->addvalorGlobal("dat_medioambejecutado", $val1, $idmoneda, $idEjer, $idmedioambglobal);
        }
    }
    
    private function saveEstimadoMA($val5, $val6, $idEjer, $idInvers, $idmoneda, $idmedioambglobal, $modDatInversion, $modGlobag) {
        if ($val6 != "") { // print_r(1);die;
            if ($val5 != 0) {
                $modDatInversion->updatevalor("dat_medioambestimado", $val5, "idmedioambestimado", $val6, $idEjer);
            } else {
                $modGlobag->eliminarGlobal("dat_medioambestimado", $idInvers, "idmedioambestimado", $val6);
            }
        } else if ($val5 != "" && $val5 != 0) {//print_r($valor->$pos5);die;
            $modGlobag->addvalorGlobal("dat_medioambestimado", $val5, $idmoneda, $idEjer, $idmedioambglobal);
        }
    }
    
    private function saveProyecMA($val3, $val4, $idEjer, $idInvers, $idmoneda, $idmedioambglobal, $modDatInversion, $modGlobag) {
        if ($val4 != "") { // print_r(1);die;
            if ($val3 != 0) {
                $modDatInversion->updatevalor("dat_medioambproyectado", $val3, "idmedioambproyectado", $val4, $idEjer);
            } else {
                $modGlobag->eliminarGlobal("dat_medioambproyectado", $idInvers, "idmedioambproyectado", $val4);
            }
        } else if ($val3 != "" && $val3 != 0) {//print_r($valor->$pos3);die;
            $modGlobag->addvalorGlobal("dat_medioambproyectado", $val3, $idmoneda, $idEjer, $idmedioambglobal);
        }
    }
    
    private function savePlanMA($val7, $val8, $idEjer, $idInvers, $idmoneda, $idmedioambglobal, $modDatInversion, $modGlobag) {
        if ($val8 != "") {
            if ($val7 != 0) {
                $modDatInversion->updatevalor("dat_medioambplan", $val7, "idmedioambplan", $val8, $idEjer);
            } else {
                $modGlobag->eliminarGlobal("dat_medioambplan", $idInvers, "idmedioambplan", $val8);
            }
        } else if ($val7 != "" && $val7 != 0) {//print_r($valor->$pos7);die;
            $modGlobag->addvalorGlobal("dat_medioambplan", $val7, $idmoneda, $idEjer, $idmedioambglobal);
        }
    }

    public function listarNomDatos($dat) {
        $model = new DatAmbiente();
        $nomaccion = $model->cargarNomAmb("dat_accion", "idaccion");
        $nombahias = $model->cargarNomAmb("dat_bahia", "idbahia");
        $nomcuencas = $model->cargarNomAmb("dat_cuenca", "idcuenca");
        if ($dat['idnomencaldor'] == $nomaccion[0]['idnomenclador']) {
            
        } else if ($dat['idnomencaldor'] == $nombahias[0]['idnomenclador']) {
            $result = $model->listarBahias();
        } else if ($dat['idnomencaldor'] == $nomcuencas[0]['idnomenclador']) {
            $result = $model->listarCuencas();
        } else {
            $result = $model->listarSectores();
        }
        echo json_encode(array('data' => $result));
    }

    public function listarSectores() {
        $model = new DatAmbiente();
        $result = $model->listarSectores();
        echo json_encode(array('data' => $result));
    }

    public function adicionarSector($sector, $idinversion, $nom) {
        if ($nom != 0) {
            $objDatMed = new DatMedioambglobal();
            $exist = $objDatMed->findMeGlobal($sector->denominacion, $nom[0]['idnomenclador'], 0, $idinversion);
            if ($exist == 2) {
                $objDatMed->idinversion = $idinversion;
                $objDatMed->iddatosnomenclador = $sector->denominacion;
                $objDatMed->iddatosnomencladorpadre = $sector->denominacion;
                $objDatMed->idnomenclador = $nom[0]['idnomenclador'];
                $objDatMed->save();
            } else {
                return 0;
            }
        }
        return $objDatMed->idmedioambglobal;
    }

    public function adicionarDatos($dat) {

        $model = new DatAmbiente();
        $nomaccion = $model->cargarNomAmb("dat_accion", "idaccion");
        $nombahias = $model->cargarNomAmb("dat_bahia", "idbahia");
        $nomcuencas = $model->cargarNomAmb("dat_cuenca", "idcuenca");
        $cont = 0;
        $repetidos = 0;
        $collectionAcc = new Doctrine_Collection('DatMedioambglobal');
        if ($nomaccion[0]['idnomenclador'] != 0 && $nombahias[0]['idnomenclador'] != 0 && $nomcuencas[0]['idnomenclador'] != 0) {
            foreach ($dat['datosAccion'] as $fg) {
                $objDatMed = new DatMedioambglobal();
                $exist = $objDatMed->findMeGlobal($fg->iddatosnomenclador, $nomaccion[0]['idnomenclador'], $dat['idsector']);
                if ($exist == 2) {
                    $objDatMed->idinversion = $dat['idinversion'];
                    $objDatMed->iddatosnomenclador = $fg->iddatosnomenclador;
                    $objDatMed->iddatosnomencladorpadre = $dat['iddatosnomencladorpadre'];
                    $objDatMed->idnomenclador = $nomaccion[0]['idnomenclador'];
                    $objDatMed->idpadre = $dat['idsector'];
                    $collectionAcc[$cont] = $objDatMed;
                    $cont++;
                } else {
                    $repetidos++;
                }
            }
            foreach ($dat['datosBahia'] as $fg) {
                $objDatMed = new DatMedioambglobal();
                $exist = $objDatMed->findMeGlobal($fg->iddatosnomenclador, $nombahias[0]['idnomenclador'], $dat['idsector']);
                if ($exist == 2) {
                    $objDatMed->idinversion = $dat['idinversion'];
                    $objDatMed->iddatosnomenclador = $fg->iddatosnomenclador;
                    $objDatMed->iddatosnomencladorpadre = $dat['iddatosnomencladorpadre'];
                    $objDatMed->idnomenclador = $nombahias[0]['idnomenclador'];
                    $objDatMed->idpadre = $dat['idsector'];
                    $collectionAcc[$cont] = $objDatMed;
                    $cont++;
                } else {
                    $repetidos++;
                }
            }

            foreach ($dat['datosCuenca'] as $fg) {
                $objDatMed = new DatMedioambglobal();
                $exist = $objDatMed->findMeGlobal($fg->iddatosnomenclador, $nomcuencas[0]['idnomenclador'], $dat['idsector']);
                if ($exist == 2) {
                    $objDatMed->idinversion = $dat['idinversion'];
                    $objDatMed->iddatosnomenclador = $fg->iddatosnomenclador;
                    $objDatMed->iddatosnomencladorpadre = $dat['iddatosnomencladorpadre'];
                    $objDatMed->idnomenclador = $nomcuencas[0]['idnomenclador'];
                    $objDatMed->idpadre = $dat['idsector'];
                    $collectionAcc[$cont] = $objDatMed;
                    $cont++;
                } else {
                    $repetidos++;
                }
            }
            $collectionAcc->save();
            if ($repetidos == 0 && $cont > 0) {
                return 1;
            } else {
                return 55;
            }
        } else {
            return 55;
        }
    }

    public function cargarMedioAmb($datosInv) {
        $modelInv = new DatInversion();

        $ejercicio = array();
        $moneda = array();
        $moneda[0]['id'] = $datosInv['USD'];
        $moneda[0]['name'] = 'usd';
        $moneda[1]['id'] = $datosInv['MP'];
        $moneda[1]['name'] = 'mp';
        $ejercicio[0]['id'] = $modelInv->idejercicioPorDenominacion($datosInv['aaejercicio']);
        $ejercicio[1]['id'] = $modelInv->idejercicioPorDenominacion($datosInv['aejercicio']);
        $ejercicio[2]['id'] = $datosInv['idejercicio'];
        $ejercicio[3]['id'] = $modelInv->idejercicioPorDenominacion($datosInv['pejercicio']);
        $pres = self::cargarMaXEj($datosInv, $moneda, $ejercicio, $model);
        return $pres;
    }

    public function cargarMaXEj($datosInv, $moneda, $ejercicio) {
        $cont = 1;
        $model = new DatAmbiente();
        //ARREGLO LAS DOS MONEDAS QUE SE VAN A LISTAR PARA CADA EJERCICIO POR SECTOR
        $medioamb = $model->cargarMedioAmb($datosInv); //TODOS LOS SECTORES POR EJERC ENTIDAD INVERSION
        foreach ($medioamb as $key => $valor) {//RECORRO LOS sectores
            foreach ($ejercicio as $ke => $ejer) {//REINICIA EL CONTADOR
                foreach ($moneda as $mond) {//PARA LAS DOS MONEDAS
                    $ejecutar = $model->listarejecutado($ejer['id'], $mond['id'], $datosInv, $valor['idmedioambglobal']);
                    $medioamb[$key]['ejecutado' . $mond['name'] . $cont] = $ejecutar[0]['valor'] ? $ejecutar[0]['valor'] : 0;
                    if ($ejecutar[0]['idmedioambejecutado'] != "") {
                        $medioamb[$key]['idmedioambejecutado' . $mond['name'] . $cont] = $ejecutar[0]['idmedioambglobal'] ? $ejecutar[0]['idmedioambejecutado'] : 0;
                    }
                    $estima = $model->listarestimado($ejer['id'], $mond['id'], $datosInv, $valor['idmedioambglobal']);
                    $medioamb[$key]['estimado' . $mond['name'] . $cont] = $estima[0]['valor'] ? $estima[0]['valor'] : 0;
                    if ($estima[0]['idmedioambestimado'] != "") {
                        $medioamb[$key]['idmedioambestimado' . $mond['name'] . $cont] = $estima[0]['idmedioambglobal'] ? $estima[0]['idmedioambestimado'] : 0;
                    }

                    $proyec = $model->listarproyecc($ejer['id'], $mond['id'], $datosInv, $valor['idmedioambglobal']);
                    $medioamb[$key]['proyec' . $mond['name'] . $cont] = $proyec[0]['valor'] ? $proyec[0]['valor'] : 0;
                    if ($proyec[0]['idmedioambproyectado'] != "") {
                        $medioamb[$key]['idmedioambproyectado' . $mond['name'] . $cont] = $proyec[0]['idmedioambproyectado'] ? $proyec[0]['idmedioambproyectado'] : 0;
                    }

                    $plan = $model->listarplanmdio($ejer['id'], $mond['id'], $datosInv, $valor['idmedioambglobal']);
                    $medioamb[$key]['plan' . $mond['name'] . $cont] = $plan[0]['valor'] ? $plan[0]['valor'] : 0;
                    if ($plan[0]['idmedioambplan'] != "") {
                        $medioamb[$key]['idmedioambplan' . $mond['name'] . $cont] = $plan[0]['idmedioambplan'] ? $plan[0]['idmedioambplan'] : 0;
                    }
                }
                $cont = $cont + 1;
            }
            $cont = 1;
            $medioamb[$key]['annospost_usd'] = $valor['sumapresp_usd'] - ($medioamb[$key]['ejecutadousd1'] + $medioamb[$key]['estimadousd2'] + $medioamb[$key]['planusd3'] + $medioamb[$key]['proyecusd4']);
            $medioamb[$key]['annospost_mp'] = $valor['sumapresp_mp'] - ($medioamb[$key]['ejecutadomp1'] + $medioamb[$key]['estimadomp2'] + $medioamb[$key]['planmp3'] + $medioamb[$key]['proyecmp4']);
        }
        return $medioamb;
    }

    public function eliminarDat($parametros) {
        $objDatMed = new DatMedioambglobal();
        $del = $objDatMed->eliminarDat($parametros, implode(',', $parametros['datos']));
        return $del;
    }

}

