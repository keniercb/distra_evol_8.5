<?php

class CentrodebalanceModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function listarModelos() {
        $modelosTodos = DatModelo::devolverModelos();
        foreach ($modelosTodos as $key => $datos) {
            $data[$key]['idmodelo'] = $datos['idmodelo'];
            $data[$key]['denominacion'] = $datos['denominacion'];
        }
        return $data;
    }

    public function listarModelosAsociados($identidad) {
        $datos = DatEntidadmodelo::getModeloAsocEntidad($identidad);
        return $datos;
    }

    public function listarCentrosBalance($rector, $cb, $od, $identidad) {
        $i = 0;
        if ($rector) {
            $centbal = DatEntidaddatosnomenclador::getCB();
            if ($centbal) {
                foreach ($centbal as $valor) {
                    $dat[$i]['identidad'] = $valor['identidad'];
                    $enti = $this->integrator->metadatos->DameEstructura($valor['identidad']);
                    $dat[$i]['denominacion'] = $enti[0]->denominacion;
                    $i++;
                }

                $datos = $dat;
            } else {
                $datos = 1;
            }
        } else {
            if ($cb && !$od) {
                $datos[0]['identidad'] = $identidad;
                $enti = $this->integrator->metadatos->DameEstructura($identidad);
                $datos[0]['denominacion'] = $enti[0]->denominacion;
            } else {
                if ($cb && $od) {
                    $datos[0]['identidad'] = $identidad;
                    $enti = $this->integrator->metadatos->DameEstructura($identidad);
                    $datos[0]['denominacion'] = $enti[0]->denominacion;
                } else {
                    if ($od && !$cb) {
                        $datos = 1;
                    }
                }
            }
        }

        return $datos;
    }

    public function listarTodos($tipo) {
        $i = 0;
        if ($tipo == "CB") {
            $centbal = DatEntidaddatosnomenclador::getCB();
        } else {
            if ($tipo == "OD") {
                $centbal = DatEntidaddatosnomenclador::getOD();
            } else {
                $centbal = DatEntidaddatosnomenclador::getOACE();
            }
        }
        if ($centbal) {
            foreach ($centbal as $valor) {
                $dat[$i]['identidad'] = $valor['identidad'];
                $enti = $this->integrator->metadatos->DameEstructura($valor['identidad']);
                $dat[$i]['denominacion'] = $enti[0]->denominacion;
                $i++;
            }

            $datos = $dat;
        } else {
            $datos = 1;
        }
        return $datos;
    }

    public function listarEntidades($parametros) {


        if (($parametros['soyCB'] == 'true' && $parametros['orgrecto'] == 'undefined') || $parametros['orgrecto'] == 'true'
        ) {
            $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom($parametros['identidad']);

            $parametros['identtidaddes'] = DatPlanificacion::obtenerEntidadesQueDemandanByIdCB(
                            $entidaddatosnom[0]['identidaddatosnomenclador']
            );

            $datos = array();
            if (isset($parametros['identtidaddes'][0])) {
                $arrayEntidades = array();
                foreach ($parametros['identtidaddes'] as $k) {
                    $arrayEntidades[] = $k['identidad'];
                }
                $entidadescad = implode(',', $arrayEntidades);
                $datos = DatAjusteexistenciaod::listarEntidades($entidadescad);
            }
        }

        return $datos;
    }

    public function listarIndicadoresODBalance($start, $limit, $parametros) {
        //Obtengo el identidaddatosnomenclador de la entidad logeada como centro
        // de balance

        $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNomOD($parametros['identidadarbol']);
        $parametros['identidaddatosnomenclador'] = $entidaddatosnom[0]['identidaddatosnomenclador'];
        //Listar indicadores X órgano demandante y modelo
        $data = DatAjusteexistencia::listarIndODModelo($start, $limit, $parametros);
        $arrayEnti = array();
        if (is_array($data->data)) {
            foreach ($data->data as $key => $value) {
                unset($data->data[$key]);
                $arrayEnti[] = $value['identidadcb'];
                if ($key < 20) {
                    $data->data[$key]['identidadcb'] = $value['identidadcb'];
                    $data->data[$key]['idajusteexistencia'] = $value['idajusteexistencia'];
                    $data->data[$key]['idindicador'] = $value['idindicador'];
                    $data->data[$key]['coberturatotalestimada'] = $value['coberturatotalestimada'];
                    $data->data[$key]['idaprobacion'] = $value['DatAjusteexistenciaod'][0]['idaprobacion'];
                    $data->data[$key]['idejercicio'] = $value['idejercicio'];
                    $data->data[$key]['idajusteexistenciaod'] = $value['DatAjusteexistenciaod'][0]['idajusteexistenciaod'];
                    $data->data[$key]['necesidad'] = $value['DatAjusteexistenciaod'][0]['necesidad'];
                    $data->data[$key]['coberturaparcialestimada'] = $value['DatAjusteexistenciaod'][0]['coberturaparcialestimada'];
                    $data->data[$key]['reservaministerial'] = $value['DatAjusteexistenciaod'][0]['reservaministerial'];
                    $data->data[$key]['cantidadeconomia'] = $value['DatAjusteexistenciaod'][0]['cantidadeconomia'];
                    $data->data[$key]['demanda'] = $value['DatAjusteexistenciaod'][0]['demanda'];
                    $data->data[$key]['identidadmodelo'] = $value['DatAjusteexistenciaod'][0]['identidadmodelo'];
                    $data->data[$key]['ajustenivelactividadpos'] = $value['DatAjusteexistenciaod'][0]['ajustenivelactividadpos'];
                    $data->data[$key]['ajustenivelactividadneg'] = $value['DatAjusteexistenciaod'][0]['ajustenivelactividadneg'];
                    $data->data[$key]['importe'] = $value['DatAjusteexistenciaod'][0]['importe'];
                    $data->data[$key]['idindicador'] = $value['NomIndicador']['idindicador'];
                    $data->data[$key]['codigo'] = $value['NomIndicador']['codigo'];
                    $data->data[$key]['denominacion'] = $value['NomIndicador']['denominacion'];
                    $data->data[$key]['numeropieza'] = $value['NomIndicador']['numeropieza'];
                    $data->data[$key]['precio'] = $value['NomIndicadorplanif']['precio'];
                }
            }
        }


        //SE OBTIENEN LOS DATOS DE LAS ENTIDADES QUE SON CENTROS DE BALANCE DE 
        //LOS INDICADORES ANTERIORES
        $integrator = ZendExt_IoC::getInstance();
        $datosenti = $integrator->metadatos->ObtenerDatosEstructurasPorArrayId($arrayEnti);

        //SE HACE CON UN SOLO FOR PK LOS ARREGLOS SON PARALELOS, EL DIA QUE NO 
        //COINCIDAN SE DEBE
        //DE EMPELAR UN CILCO ANIDADO AUNKE ESTO ATENTE CONTRA EL RENDIMIENTO.
        $arrayIdsent = array();
        if (is_array($datosenti)) {
            foreach ($datosenti as $valorDatosent) {
                $arrayIdsent['id' . $valorDatosent['idestructura']] = $valorDatosent['denominacion'];
            }
        }
        foreach ($data->data as $key => $value) {
            $data->data[$key]['denominacioncb'] = $arrayIdsent['id'
                    . $value['identidadcb']];
        }
        return $data;
    }

//FUNCION QUE MANDA A LISTAR LOS INDICADORES DEL BALANCE EN DEPENDENCIA DE 
//LOS PARAMETROS ENVIADOS
    public function listarIndicadoresBalance($start, $limit, $parametros) {
        //Obtengo el identidaddatosnomenclador de la entidad logeada como
        // centro de balance
        if ($parametros['rector'] == 1) {
            $parametros['identidadlogueada'] = $parametros['idcb'];
        }
        if ($parametros['OD'] == 1) {

            $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom($parametros['identidadarbol']);
            $parametros['identidaddatosnomenclador'] = $entidaddatosnom[0]['identidaddatosnomenclador'];
        } elseif ($parametros['CB'] == 1 || $parametros['CB']) {
            $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom($parametros['idcb']);
        }
        $parametros['identidaddatosnomenclador'] = $entidaddatosnom[0]['identidaddatosnomenclador'];

        $bandera = 0;

        //Listar indicadores X órgano demandante y modelo
        //esta es la condicional que estaba y le cambie la ultima parte para 
        //que consolidara como rector-od

        if ($parametros['OD'] == 1 && $parametros['idmodelo']) {
            //Llamar una consulta listarIndOD
            $datos = DatAjusteexistenciaod::listarIndOD($start, $limit, $parametros);
        } else {
            if ($parametros['ajusteCB'] == 'false') {
                $datos = DatAjusteexistenciaod::listarIndOD($start, $limit, $parametros);

                // $balance = 1;
            } else {
                if ($parametros['ajusteCB'] == 'true'
                ) {
                    $bandera = 1;

                    $datos = DatAjusteexistenciacb::listarIndCB($start, $limit, $parametros);
                }
            }
        }


        if ($bandera == 0) {
            if ($datos['total'] > 0) {
                foreach ($datos['datos'] as $key => $value) {
                    if ($value ['identcb']) {
                        $datenti = $this->integrator->metadatos->DameEstructura($value ['identcb']);
                        $datos['datos'][$key]['denominacioncb'] = $datenti[0]->denominacion;
                    }
                    $datos['datos'][$key]['importe'] = number_format($value['importe'], '6', '.', ',');
                    $datos['datos'][$key]['importemlc'] = number_format($value['importemlc'], '6', '.', ',');
                    $datos['datos'][$key]['flete'] = number_format($value['flete'], '6', '.', ',');
                    $datos['datos'][$key]['contingencia'] = number_format($value['contingencia'], '6', '.', ',');
                    $datos['datos'][$key]['importefila'] = number_format($value['importefila'], '6', '.', ',');
                    $datos['datos'][$key]['precio'] = number_format($value['precio'], '6', '.', ',');
                    $datos['datos'][$key]['demanda'] = number_format($value['demanda'], '6', '.', ',');
                    $datos['datos'][$key]['coberturatotalestimada'] = number_format($value['coberturatotalestimada'], '6', '.', ',');
                    $datos['datos'][$key]['necesidad'] = number_format($value['necesidad'], '6', '.', ',');
                }
            }
        } else {
            if ($bandera == 1) {
                if ($datos['total'] > 0) {
                    foreach ($datos['datos'] as $key => $value) {
                        if ($value ['identidad']) {
                            $datenti = $this->integrator->metadatos->DameEstructura($value ['identidad']);
                            $datos['datos'][$key]['denominacioncb'] = $datenti[0]->denominacion;
                        }
                        $datos['datos'][$key]['importe'] = number_format($value['importe'], '6', '.', ',');
                        $datos['datos'][$key]['importemlc'] = number_format($value['importemlc'], '6', '.', ',');
                        $datos['datos'][$key]['flete'] = number_format($value['flete'], '6', '.', ',');
                        $datos['datos'][$key]['contingencia'] = number_format($value['contingencia'], '6', '.', ',');
                        $datos['datos'][$key]['importefila'] = number_format(
                                $value['importefila'], '6', '.', ','
                        );
                        $datos['datos'][$key]['precio'] = number_format($value['precio'], '6', '.', ',');
                        $datos['datos'][$key]['demanda'] = number_format($value['demanda'], '6', '.', ',');
                        $datos['datos'][$key]['coberturaparcialestimada'] = number_format($value['coberturaparcialestimada'], '6', '.', ',');
                        $datos['datos'][$key]['necesidad'] = number_format($value['necesidad'], '6', '.', ',');
                    }
                }
            }
        }

        //SE HACE CON UN SOLO FOR PK LOS ARREGLOS SON PARALELOS, EL DIA QUE NO 
        //COINCIDAN SE DEBE
        //DE EMPELAR UN CILCO ANIDADO AUNKE ESTO ATENTE CONTRA EL RENDIMIENTO.

        if ($datos['total'] == 0) {
            $data->codMsg = 15;
        }
        $data->data = $datos['datos'];
        $data->total = $datos['total'];
        $data->importetotal = number_format($datos['importetotal'], '6', '.', ',');
        $data->importecontingencia = number_format($datos['importecontingencia'], '6', '.', ',');
        $data->importenecesidad = number_format($datos['importenecesidad'], '6', '.', ',');
        $data->importeajustado = number_format($datos['importeajustado'], '6', '.', ',');
        $data->importemn = number_format($datos['importemn'], '6', '.', ',');
        $data->importemlc = number_format($datos['importemlc'], '6', '.', ',');
        return $data;
    }

//LISTA LOS INDICADORES QUE VAN AL DESGLOCE POR VIA DE ADQUISICION Y 
//ORGANO QUE SATISFACE
    public function listarIndicadoresVia($start, $limit, $parametros) {
        //Obtengo el identidaddatosnomenclador de la entidad logeada como 
        //centro de balance
        if ($parametros['rector'] == 1) {
            $parametros['identidadlogueada'] = $parametros['idcb'];
        }
        $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom($parametros['idcb']);
        $parametros['identidaddatosnomenclador'] = $entidaddatosnom[0]['identidaddatosnomenclador'];

        $datos = DatAjusteexistenciacb::indicadoresDesgloseViaAdquisicion($start, $limit, $parametros);


        // $integrator = ZendExt_IoC::getInstance();

        $arrayUM = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();

        $arrayDenum = array();
        foreach ($arrayUM as $value) {
            $arrayDenum['id' . $value['idunidadmedida']] = $value['denominacionunidadmedida'];
        }
        unset($arrayUM);
        if ($datos['datos'][0] != null) {
            foreach ($datos['datos'] as $key => $value) {

                if ($key < 20) {

                    if ($value ['idumedida']) {

                        $datos['datos'][$key]['um'] = $arrayDenum['id'
                                . $value['idunidadmedida']];
                    }
                    if ($value['cantidad']) {
                        if ($value['cantidad'] == $value['demanda']) {
                            $datos['datos'][$key]['desglosado'] = 1;
                        } else {
                            $datos['datos'][$key]['desglosado'] = 2;
                        }
                    }
                    $datos['datos'][$key]['importe'] = number_format($value['importe'], '3', '.', ',');
                    $datos['datos'][$key]['importemlc'] = number_format($value['importemlc'], '3', '.', ',');
                    $datos['datos'][$key]['flete'] = number_format($value['flete'], '3', '.', ',');
                    $datos['datos'][$key]['contingencia'] = number_format($value['contingencia'], '3', '.', ',');
                    $datos['datos'][$key]['importefila'] = number_format($value['importefila'], '3', '.', ',');
                }
            }
        }


        if ($datos['total'] == 0) {
            $data->codMsg = 15;
        }

        $data->data = $datos['datos'];
        $data->total = $datos['total'];
        $data->importetotal = number_format($datos['importetotal'], '6', '.', ',');
        $data->importecontingencia = number_format($datos['importecontingencia'], '6', '.', ',');
        $data->importenecesidad = number_format($datos['importenecesidad'], '6', '.', ',');
        $data->importeajustado = number_format($datos['importeajustado'], '6', '.', ',');
        $data->importemn = number_format($datos['importemn'], '6', '.', ',');
        $data->importemlc = number_format($datos['importemlc'], '6', '.', ',');



        return $data;
    }

//FUNCION QUE REALIZA EL AJUSTE AUTOMATICO DEL BALANCE LLAMANDO A UNA FUNCIOn
// EN LA BD
    public function actualizarBalanceActualizarCte($parametros) {
        $paramsQuery = array($parametros['identidad'], $parametros['idmodelo'],
            $parametros['identidadmodelo'], $parametros['idejercicio'],
            '{' . $parametros['arrayindicadores'] . '}');
        $query = "select * from mod_planificacion."
                . "f_actualizar_balancematerial_actualizarcte(?,?,?,?,?,0);";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query, $paramsQuery);
        $resultadoPrimero = $res->fetchAll(PDO::FETCH_ASSOC);
        ($resultadoPrimero[0]['f_ActualizarDatosOD']) ? '21' : '23';
    }

//FUNCION QUE ACTUALIZA LAS COBERTURAS DEL BALANCE MATERIAL CUANDO ESTAS 
//SE REALIZAN DE FORMA MANUAL
    public function ActualizarCampos($parametros) {

        if ($parametros['od'] == 1 && $parametros['arrayind'][0] != null) {


            // $conn = Doctrine_Manager::connection();
            $p['identidad'] = $parametros['entidadloguada'];
            $p['idmodelo'] = $parametros['idmodelo'];
            $identidadmodelo = DatEntidadmodelo::getIdentidadmodelo(
                            $parametros['idmodelo'], $parametros['entidadloguada']
            );
            $p['identidadmodelo'] = $identidadmodelo[0]['identidadmodelo'];
            $p['idejercicio'] = $parametros['idejercicio'];
            foreach ($parametros['arrayind'] as $key => $value) {

                $arrayindicadores[] = $value->idindicador;

                $params = $value;
                $params->identidad = $parametros['entidadloguada'];
                $p['idindicador'] = $value->idindicador;
                $objodcte = DatOdcte::obtenerObjODCTE($p);
                $objajusteex = DatAjusteexistencia::obtenerObjExistenciaNew($p);
                if (is_array($objajusteex)) {
                    break;
                }

                $CTE = $objajusteex->coberturatotalestimada + $objodcte->cpe;
                $cparcial = $objodcte->cpe;

                if ($objodcte->idodcte == null) {
                    if ($value->coberturaparcialestimada || $value->coberturaparcialestimada == 0
                    ) {

                        if ($CTE >= $value->coberturaparcialestimada) {
                            $obj = new DatOdcte();
                            $obj->identidad = $parametros['entidadloguada'];
                            $obj->idmodelo = $parametros['idmodelo'];
                            $obj->identidadmodelo = $p['identidadmodelo'];
                            $obj->idejercicio = $parametros['idejercicio'];
                            $obj->idindicador = $value->idindicador;
                            $obj->demanda = 0;
                            $obj->demandahijos = 0;
                            $obj->cpe = $value->coberturaparcialestimada;

                            $obj->save();

                            $objajusteex->coberturatotalestimada = ($CTE) - $value->coberturaparcialestimada;

                            $objajusteex->save();
                            $data = 1;
                        } else {
                            $data = 3;
                        }
                    }
                } else {
                    if ($value->coberturaparcialestimada || $value->coberturaparcialestimada == 0
                    ) {


                        if ($CTE >= $value->coberturaparcialestimada) {
                            $demanda = $value->necesidad - $value->coberturaparcialestimada;
                            if ($demanda < 0) {
                                $demanda = 0;
                            }

                            $objodcte->cpe = $value->coberturaparcialestimada;
                            $objodcte->demanda = $demanda;
                            $objodcte->save();

                            $objajusteex->coberturatotalestimada = ($CTE) - $value->coberturaparcialestimada;
                            $objajusteex->save();
                            $data = 1;
                        } else {
                            $data = 3;
                        }
                    }
                }
            }
        } else {

            if ($parametros['cb'] == 1 && $parametros['arrayind'][0] != null) {

                $p['identidad'] = $parametros['entidadloguada'];
                $p['idmodelo'] = $parametros['idmodelo'];
                $identidadmodelo = DatEntidadmodelo::getIdentidadmodelo(
                                $parametros['idmodelo'], $parametros['entidadloguada']
                );
                $p['identidadmodelo'] = $identidadmodelo[0]['identidadmodelo'];
                $p['idejercicio'] = $parametros['idejercicio'];
                foreach ($parametros['arrayind'] as $key => $value) {
                    $arrayindicadores[] = $value->idindicador;
                    $params = $value;
                    $params->identidad = $parametros['entidadloguada'];
                    $params->idindicador = $value->idindicador;
                    ;
                    $params->idmodelo = $parametros['idmodelo'];
                    $params->idejercicio = $parametros['idejercicio'];
                    $objajusteexCB = DatAjusteexistenciacb::obtenerObjCB($params);
                    // $obCB = $objajusteexCB->demanda;
                    $p['idindicador'] = $value->idindicador;
                    $objajusteex = DatAjusteexistencia::obtenerObjExistenciaNew($p);
                    $CTE = $objajusteex->coberturatotalestimada + $objajusteexCB->coberturaparcialestimada;
                    $cparcial = $objajusteexCB->coberturaparcialestimada;
                    if ($objajusteexCB->idajusteexistenciacb == null) {
                        $obj = new DatAjusteexistenciacb();
                        $obj->identidad = $parametros['entidadloguada'];
                        $obj->idmodelo = $parametros['idmodelo'];
                        $obj->identidadmodelo = $p['identidadmodelo'];
                        $obj->idejercicio = $parametros['idejercicio'];
                        $obj->idindicador = $value->idindicador;
                        $obj->coberturaparcialestimada = $value->coberturaparcialestimada;
                        $obj->save();
                        $objajusteex->coberturatotalestimada = ($CTE) - $value->coberturaparcialestimada;
                        $objajusteex->save();
                        $data = 1;
                    } else {

                        if ($value->coberturaparcialestimada != null || $value->coberturaparcialestimada == 0
                        ) {
                            if (($objajusteex->cantidadeninventario + $objajusteex->mercanciaentransito + $objajusteex->cantidadcontratado + $objajusteex->reservaministerial + $objajusteex->cantidadeconomia) - $objajusteex->necesidadannoactual >= $value->coberturaparcialestimada
                            ) {

                                if (($value->coberturaparcialestimada) <= $value->necesidad
                                ) {

                                    if ($objajusteexCB->coberturaparcialestimada != $value->coberturaparcialestimada
                                    ) {

                                        $objajusteexCB->coberturaparcialestimada - $value->coberturaparcialestimada;
                                        $objajusteexCB->coberturaparcialestimada = $value->coberturaparcialestimada;
                                        $objajusteexCB->demanda = $value->necesidad - $value->coberturaparcialestimada;
                                        $objajusteexCB->save();

                                        $objajusteex->coberturatotalestimada = ($CTE) - $value->coberturaparcialestimada;
                                        $objajusteex->save();
                                        $data = 1;
                                    }
                                } else {
                                    $data = 2;
                                }
                            } else {
                                $data = 3;
                            }
                        }
                    }
                }
            }
        }
        return $data;
    }

    public function ActualizarCamposAjusteEntidad($parametros) {

        if ($parametros['arrayind']) {


            foreach ($parametros['arrayind'] as $value) {

                $idajusteexistencia = DatAjusteexistencia::obtenerIdajusteexistencia(
                                $value->idindicador, $value->identidad, $value->idejercicio
                );
                $ajustadobm = DatAjusteexistencia::calcularajustesdados(
                                $value->idindicador, $value->identidad, $value->idejercicio
                );
                if ($idajusteexistencia != null) {
                    $objexistencia = Doctrine::getTable('DatAjusteexistencia')
                            ->find($idajusteexistencia);

//               
                    if (isset($value->cantidadeninventario) && $value->cantidadeninventario >= 0
                    ) {

                        $calculo = ($value->cantidadeninventario + $objexistencia->mercanciaentransito + $objexistencia->cantidadcontratado + $objexistencia->reservaministerial + $objexistencia->cantidadeconomia) - $objexistencia->necesidadannoactual;
                        $calculoPrimero = $calculo - $ajustadobm;
                        $objexistencia->coberturatotalestimada = $calculoPrimero;
                        $objexistencia->cteoriginal = $calculo;
                        $objexistencia->cantidadeninventario = $value->cantidadeninventario;
                    }
                    $objexistencia->generadoconmat = 0;
                    $objexistencia->save();


                    if (isset($value->mercanciaentransito)) {

                        $calculo = ($value->mercanciaentransito + $objexistencia->cantidadeninventario + $objexistencia->cantidadcontratado + $objexistencia->reservaministerial + $objexistencia->cantidadeconomia) - $objexistencia->necesidadannoactual;
                        $calculoPrimero = $calculo - $ajustadobm;
                        $objexistencia->coberturatotalestimada = $calculoPrimero;
                        $objexistencia->cteoriginal = $calculo;
                        $objexistencia->mercanciaentransito = $value->mercanciaentransito;
                    }
                    $objexistencia->generadoconmat = 0;
                    $objexistencia->save();

                    if (isset($value->cantidadcontratado)) {
                        $objexistencia = Doctrine::getTable('DatAjusteexistencia')->find($idajusteexistencia);
                        $calculo = ($value->cantidadcontratado + $objexistencia->cantidadeninventario + $objexistencia->mercanciaentransito + $objexistencia->reservaministerial + $objexistencia->cantidadeconomia) - $objexistencia->necesidadannoactual;
                        $calculoPrimero = $calculo - $ajustadobm;
                        $objexistencia->coberturatotalestimada = $calculoPrimero;
                        $objexistencia->cteoriginal = $calculo;
                        $objexistencia->cantidadcontratado = $value->cantidadcontratado;
                    }
                    $objexistencia->generadoconmat = 0;
                    $objexistencia->save();

                    if (isset($value->necesidadannoactual)) {
                        $objexistencia = Doctrine::getTable('DatAjusteexistencia')->find($idajusteexistencia);
                        $calculo = ($objexistencia->cantidadeninventario + $objexistencia->mercanciaentransito + $objexistencia->cantidadcontratado + $objexistencia->reservaministerial + $objexistencia->cantidadeconomia) - $value->necesidadannoactual;
                        $calculoPrimero = $calculo - $ajustadobm;
                        $objexistencia->coberturatotalestimada = $calculoPrimero;
                        $objexistencia->cteoriginal = $calculo;
                        $objexistencia->necesidadannoactual = $value->necesidadannoactual;
                    }
                    $objexistencia->generadoconmat = 0;
                    $objexistencia->save();

                    if (isset($value->RM)) {
                        $objexistencia = Doctrine::getTable('DatAjusteexistencia')->find($idajusteexistencia);
                        $calculo = ($objexistencia->cantidadeninventario + $objexistencia->mercanciaentransito + $objexistencia->cantidadcontratado + $objexistencia->cantidadeconomia + $value->RM) - $objexistencia->necesidadannoactual;
                        $calculoPrimero = $calculo - $ajustadobm;
                        $objexistencia->coberturatotalestimada = $calculoPrimero;
                        $objexistencia->cteoriginal = $calculo;
                        $objexistencia->reservaministerial = $value->RM;
                    }
                    $objexistencia->generadoconmat = 0;
                    $objexistencia->save();

                    if (isset($value->economia)) {
                        $objexistencia = Doctrine::getTable('DatAjusteexistencia')->find($idajusteexistencia);
                        $calculo = ($objexistencia->cantidadeninventario + $objexistencia->mercanciaentransito + $objexistencia->cantidadcontratado + $objexistencia->reservaministerial + $value->economia) - $objexistencia->necesidadannoactual;
                        $calculoPrimero = $calculo - $ajustadobm;
                        $objexistencia->coberturatotalestimada = $calculoPrimero;
                        $objexistencia->cteoriginal = $calculo;
                        $objexistencia->cantidadeconomia = $value->economia;
                    }
                    $objexistencia->generadoconmat = 0;
                    $objexistencia->save();
                } else {
                    $objexistencia = new DatAjusteexistencia();
                    if (isset($value->cantidadeninventario) && $value->cantidadeninventario >= 0
                    ) {
                        $objexistencia->cantidadeninventario = $value->cantidadeninventario;
                    } else {
                        $objexistencia->cantidadeninventario = 0;
                    }
                    if (isset($value->mercanciaentransito)) {
                        $objexistencia->mercanciaentransito = $value->mercanciaentransito;
                    } else {
                        $objexistencia->mercanciaentransito = 0;
                    }
                    if (isset($value->cantidadcontratado)) {
                        $objexistencia->cantidadcontratado = $value->cantidadcontratado;
                    } else {
                        $objexistencia->cantidadcontratado = 0;
                    }
                    if (isset($value->necesidadannoactual)) {
                        $objexistencia->necesidadannoactual = $value->necesidadannoactual;
                    } else {
                        $objexistencia->necesidadannoactual = 0;
                    }
                    if (isset($value->RM)) {
                        $objexistencia->reservaministerial = $value->RM;
                    } else {
                        $objexistencia->reservaministerial = 0;
                    }
                    if (isset($value->economia)) {
                        $objexistencia->cantidadeconomia = $value->economia;
                    } else {
                        $objexistencia->cantidadeconomia = 0;
                    }

                    $objexistencia->generadoconmat = 0;
                    $objexistencia->idindicador = $value->idindicador;
                    $objexistencia->idejercicio = $value->idejercicio;
                    $objexistencia->identidad = $value->identidad;
                    $objexistencia->ajustenivelactividadneg = 0;
                    $objexistencia->ajustenivelactividadpos = 0;
                    $objexistencia->idaprobacion = 1;

                    $calculo = ($objexistencia->cantidadeninventario + $objexistencia->mercanciaentransito + $objexistencia->cantidadcontratado + $objexistencia->cantidadeconomia + $value->RM) - $value->necesidadannoactual;
                    $objexistencia->coberturatotalestimada = $calculo;
                    $objexistencia->cteoriginal = $calculo;
                    $objexistencia->save();
                }
            }
        } else {
            $data = 3;
        }

        if ($data != 3) {
            $data = 1;
        } else {
            if ($data != 0) {
                $data = 2;
            }
        }


        return $data;
    }

    public function listarIndCTEyOtros($parametros) {
        $parametros['entidadeshijas'] = DatActividadentidad::auxObtenerEntidadesHijasComun((int) $parametros['entidad']);
        array_push($parametros['entidadeshijas'], $parametros['entidad']);
        $parametros['entidadeshijas'] = implode(',', $parametros['entidadeshijas']);

        $parametros['idcb'] = DatEntidaddatosnomenclador::getIdentidaddatosnomenclador($parametros['entidad']);
        $parametros['idcb'] = $parametros['idcb'][0]['identidaddatosnomenclador'];
        if (!$parametros['idcb']) {
            $parametros['idcb'] = 0;
        }
        $arrayexis = DatAjusteexistencia::listarIndcadoresCobertura($parametros);
        foreach ($arrayexis->data as $key => $value) {
            $array[$key]['idajusteexistencia'] = $value['idajusteexistencia'];
            $array[$key]['idindicador'] = $value['idindicador'];
            $array[$key]['identidad'] = $value['identidad'];
            $array[$key]['idumedida'] = $value['idumedida'];
            $array[$key]['idcentrobalance'] = $value['idcentrobalance'];
            $array[$key]['cantidadeninventario'] = number_format(
                    $value['cantidadeninventario'], '6', '.', ','
            );
            $array[$key]['mercanciaentransito'] = number_format(
                    $value['mercanciaentransito'], '6', '.', ','
            );
            $array[$key]['cantidadcontratado'] = number_format(
                    $value['cantidadcontratado'], '6', '.', ','
            );
            $array[$key]['necesidadannoactual'] = number_format(
                    $value['necesidadannoactual'], '6', '.', ','
            );
            $array[$key]['ajustenivelactividadneg'] = $value['ajustenivelactividadneg'];
            $array[$key]['RM'] = number_format(
                    $value['reservaministerial'], '6', '.', ','
            );
            $array[$key]['economia'] = $value['cantidadeconomia'];
            $array[$key]['coberturatotalestimada'] = ($value['coberturatotalestimada'] < 0) ?
                    number_format(0, '6', '.', ',') : number_format(
                            $value['coberturatotalestimada'], '6', '.', ','
            ); //validar que el CTE no sea negativo
            $array[$key]['ajustenivelactividadpos'] = $value['ajustenivelactividadpos'];
            $array[$key]['codigo'] = $value['codigo'];
            $array[$key]['denominacion'] = $value['denominacion'];
            $array[$key]['numeropieza'] = $value['numeropieza'];
            $array[$key]['cteoriginal'] = number_format(
                    $value['cteoriginal'], '6', '.', ','
            );
            $array[$key]['conmat'] = $value['conmat'];
        }
        $data[0] = $array;
        $data[1] = $arrayexis->total;
        return $data;
    }

//FUNCION QUE SE ENCARGA DE MANDAR HA APROBAR O DESAPROBAR EN DEPENDENCIA DEL 
//COMPORTAMIENTO QUE SE TENGA
    public function AprobarDesaprobarDemandaPorIndicador($parametros) {
        $arrayidentidadmodelo = DatEntidadmodelo::getIdentidadmodelo(
                        $parametros['idmodelo'], $parametros['identidadlogueada']
        );

        $parametros['identidadmodelo'] = $arrayidentidadmodelo[0]['identidadmodelo'];

        if ($parametros['od'] == 1 && !$parametros['cb'] && !$parametros['orgrector']
        ) {

            if ($parametros['todos'] == 0) {
                $datos = DatAjusteexistenciaod::aprobarComoOD($parametros);
            } else {
                $datos = DatAjusteexistenciaod::aprobarTodosComoOD($parametros);
            }
        } else {
            if (!$parametros['od'] && $parametros['cb'] == 1 && !$parametros['orgrector']
            ) {
                if ($parametros['todos'] == 0) {
                    $datos = DatAjusteexistenciacb::aprobarComoCB($parametros);
                } else {
                    $datos = DatAjusteexistenciacb::aprobarTodosComoCB($parametros);
                }
            } else {

                if ($parametros['todos'] == 0) {
                    $datos = DatAjusteexistenciacb::aprobarComoRector($parametros);
                } else {
                    $datos = DatAjusteexistenciacb::aprobarTodosComoRector($parametros);
                }
                //buscar el identidadmodelo para la entidad del combo(CB), no la log
            }
        }

        if ($parametros['aprobado'] == 1) {
            return 1;
        } else {
            return 0;
        }
    }

    public function ListPlanesOrdenPrioridad() {
        
    }

    public function aprobarDesaprobarDesglose($parametros) {
        $query = new Doctrine_Query();
        if ($parametros['desgloses'][0] != null) {
            $query->update('DatDesgviaadquisorgsat dvo')
                    ->set('dvo.idaprobacion', '?', $parametros['valor'])
                    ->whereIn('dvo.iddesgviaadquisorgsat', $parametros['desgloses'])
                    ->addWhere(
                            'dvo.idindicador = ? AND dvo.idmodelo=? AND dvo.identidad =?'
                            . ' AND dvo.idejercicio=?', array($parametros['idindicador'], $parametros['idmodelo'],
                        $parametros['identidad'],
                        $parametros['idejercicio'])
                    )->execute();
        }
        return 20;
    }

//FUNCION QUE SE ENCARGA DE CONFORMAR EL FICHERO XLS PARA EXPORTAR LOS 
//INDICADORES DEL BALANCE
    public function exportarIndicadoresCB($parametros) {
        //Obtengo el identidaddatosnomenclador de la entidad logeada como centro
        //de balance
        if ($parametros['rector'] == 1) {
            $parametros['identidadlogueada'] = $parametros['idcb'];
        }
        if ($parametros['OD'] == 1) {

            $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom($parametros['identidadarbol']);
            $parametros['identidaddatosnomenclador'] = $entidaddatosnom[0]['identidaddatosnomenclador'];
        } elseif ($parametros['CB'] == 1) {
            $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom($parametros['idcb']);
        }
        $parametros['identidaddatosnomenclador'] = $entidaddatosnom[0]['identidaddatosnomenclador'];

        $bandera = 0;

        if ($parametros['OD'] == 1 && $parametros['idmodelo']
        ) {
            //Llamar una consulta listarIndOD
            $datos = DatAjusteexistenciaod::listarIndOD($start, $limit, $parametros);
        } else {
            if ($parametros['ajusteCB'] == 'false'
            ) {
                $datos = DatAjusteexistenciaod::listarIndOD($start, $limit, $parametros);

                // $balance = 1;
            } else {
                if ($parametros['ajusteCB'] == 'true'
                ) {
                    $bandera = 1;


                    $datos = DatAjusteexistenciacb::listarIndCB($start, $limit, $parametros);
                }
            }
        }

        // $iportetotal = 0;
        if ($bandera == 0) {
            if ($datos['total'] > 0) {
                foreach ($datos['datos'] as $key => $value) {
                    if ($value ['identcb']) {
                        $datenti = $this->integrator->metadatos->DameEstructura($value ['identcb']);
                        $datos['datos'][$key]['denominacioncb'] = $datenti[0]->denominacion;
                    }
                    $datos['datos'][$key]['importe'] = number_format($value['importe'], '6', '.', ',');
                    $datos['datos'][$key]['importemlc'] = number_format($value['importemlc'], '6', '.', ',');
                    $datos['datos'][$key]['flete'] = number_format($value['flete'], '6', '.', ',');
                    $datos['datos'][$key]['contingencia'] = number_format($value['contingencia'], '6', '.', ',');
                    $datos['datos'][$key]['importefila'] = number_format($value['importefila'], '6', '.', ',');
                    $datos['datos'][$key]['precio'] = number_format($value['precio'], '6', '.', ',');
                    $datos['datos'][$key]['demanda'] = number_format($value['demanda'], '6', '.', ',');
                    $datos['datos'][$key]['coberturatotalestimada'] = number_format($value['coberturatotalestimada'], '6', '.', ',');
                    $datos['datos'][$key]['necesidad'] = number_format($value['necesidad'], '6', '.', ',');
                }
            }
        } else {
            if ($bandera == 1) {
                if ($datos['total'] > 0) {
                    foreach ($datos['datos'] as $key => $value) {
                        if ($value ['identidad']) {
                            $datenti = $this->integrator->metadatos->DameEstructura($value ['identidad']);
                            $datos['datos'][$key]['denominacioncb'] = $datenti[0]->denominacion;
                        }
                        $datos['datos'][$key]['importe'] = number_format($value['importe'], '6', '.', ',');
                        $datos['datos'][$key]['importemlc'] = number_format($value['importemlc'], '6', '.', ',');
                        $datos['datos'][$key]['flete'] = number_format($value['flete'], '6', '.', ',');
                        $datos['datos'][$key]['contingencia'] = number_format($value['contingencia'], '6', '.', ',');
                        $datos['datos'][$key]['importefila'] = number_format($value['importefila'], '6', '.', ',');
                        $datos['datos'][$key]['precio'] = number_format($value['precio'], '6', '.', ',');
                        $datos['datos'][$key]['demanda'] = number_format($value['demanda'], '6', '.', ',');
                        $datos['datos'][$key]['coberturaparcialestimada'] = number_format($value['coberturaparcialestimada'], '6', '.', ',');
                        $datos['datos'][$key]['necesidad'] = number_format(
                                $value['necesidad'], '6', '.', ','
                        );
                    }
                }
            }
        }


        //SE HACE CON UN SOLO FOR PK LOS ARREGLOS SON PARALELOS, 
        //EL DIA QUE NO COINCIDAN SE DEBE
        //DE EMPELAR UN CILCO ANIDADO AUNKE ESTO ATENTE CONTRA EL RENDIMIENTO.

        if ($datos['total'] == 0) {
            $data->codMsg = 15;
        }

        $data->data = $datos['datos'];
        $data->total = $datos['total'];
        $data->importetotal = number_format($datos['importetotal'], '6', '.', ',');

        $data->importecontingencia = number_format($datos['importecontingencia'], '6', '.', ',');
        $data->importenecesidad = number_format($datos['importenecesidad'], '6', '.', ',');
        $data->flete = number_format($datos['flete'], '6', '.', ',');
        $data->importeajustado = number_format($datos['importeajustado'], '6', '.', ',');
        $data->importemn = number_format($datos['importemn'], '6', '.', ',');
        $data->importemlc = number_format($datos['importemlc'], '6', '.', ',');

        $integrator = ZendExt_IoC::getInstance();
        $nombre = $integrator->metadatos->DameEstructura(
                (int) $parametros['identidadOD']
        );
        $denoEntidad = $nombre[0]->denominacion;
        if ($parametros['OD'] == 1)
            $comp = 'Órgano demandante';
        else {
            $comp = 'Centro de balance';
        }
        $titulo = '<b>Entidad:</b>' . ' ' . $denoEntidad . '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' . '<b>Plan:</b>' . ' '
                . $parametros['plan'] . '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' .
                '<b>Comportamiento:</b>' . ' ' . $comp . '</b>';

        if ($parametros['ajusteCB'] == 'true')
            $titulo.= '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp Vista balancear';

        $extension = '.xls';
        header(
                "Content-type: application/vnd.ms-" . $tipo . "; name='" . $tipo
                . "';Charset=iso-8859-1"
        );
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header(
                "Content-disposition: attachment; filename=" . 'Balance_material'
                . $extension
        );
        header("Pragma: no-cache");
        header("Expires: 0");

        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; '
        . 'charset=utf-8"></HEAD><BODY>';
        echo "<table border=1>\n";
        echo "<h3> <caption >Balance Material</caption> </h3>";
        echo "<th colspan=\"19\">$titulo</th>";
        echo "<tr>\n";
        echo "<th>C&oacute;digo</th>\n";
        echo "<th>N&uacute;mero de pieza </th>\n";
        echo "<th>Denominaci&oacute;n</th>\n";
        echo "<th>Naturaleza</th>\n";
        echo "<th>Centro de balance</th>\n";
        echo "<th>Unidad de medida</th>\n";
        echo "<th>Necesidad</th>\n";
        echo "<th>CTE</th>\n";
        echo "<th>Total</th>\n";
        echo "<th>Demanda</th>\n";
        echo "<th>Precio</th>\n";
        echo "<th>Importe</th>\n";
        echo "<th>importe mlc</th>\n";
        echo "<th>Importe flete</th>\n";
        echo "<th>Importe contingencia</th>\n";
        echo "<th>Importe fila</th>\n";
        echo "<th>Via adquisicion</th>\n";
        echo "<th>Organo que satisfase</th>\n";
        echo "<th>Aprobado</th>\n";
        echo "</tr>\n";

        if ($datos['total'] > 0) {
            foreach ($datos['datos'] as $key => $indicador) {
                echo "<tr>\n";
                echo "<td style=\"mso-number-format:'@';\">"
                . $indicador['codigo'] . "</td>\n";
                echo "<td>" . $indicador['numeropieza'] . "</td>\n";
                echo "<td>" . $indicador['denominacion'] . "</td>\n";
                echo "<td>" . $indicador['naturaleza'] . "</td>\n";
                echo "<td>" . $indicador['denominacioncb'] . "</td>\n";
                echo "<td>" . $indicador['unidadmedida'] . "</td>\n";
                echo "<td>" . $indicador['necesidad']
                . "</td>\n"; //echo "<td>" . $naturaleza . "</td>\n";
                echo "<td>" . $indicador['coberturaparcialestimada']
                . "</td>\n";
                echo "<td>" . $indicador['coberturatotalestimada'] . "</td>\n";
                echo "<td>" . $indicador['demanda'] . "</td>\n";
                echo "<td>" . $indicador['precio'] . "</td>\n";
                echo "<td>" . $indicador['importe'] . "</td>\n";
                echo "<td>" . $indicador['importemlc'] . "</td>\n";
                echo "<td>" . $indicador['flete'] . "</td>\n";
                echo "<td>" . $indicador['contingencia'] . "</td>\n";
                echo "<td>" . $indicador['importefila'] . "</td>\n";
                echo "<td>" . $indicador['viaadquisicion'] . "</td>\n";
                echo "<td>" . $indicador['organosatisface'] . "</td>\n";
                echo "<td>" . $indicador['idaprobacion']
                . "</td>\n"; //echo "<td>" . $aprobado . "</td>\n";
                echo "</tr>\n";
            }
        }
        echo "<tr>\n";
        echo "<th>Importe Total:</th>\n";
        echo "<th>Importe MN</th>\n";
        echo "<th>Importe MLC</th>\n";
        echo "<th>Importe Flete</th>\n";
        echo "<th>Importe Contingencia</th>\n";
        echo "<th>Importe Necesidad</th>\n";
        echo "<th>Importe Importe ajustado</th>\n";
        echo "</tr>\n";
        echo "<tr>\n";
        echo "<td>" . $data->importetotal . "</td>\n";
        echo "<td>" . $data->importemn . "</td>\n";
        echo "<td>" . $data->importemlc . "</td>\n";
        echo "<td>" . $data->flete . "</td>\n";
        echo "<td>" . $data->importecontingencia . "</td>\n";
        echo "<td>" . $data->importenecesidad . "</td>\n";
        echo "<td>" . $data->importeajustado . "</td>\n";
        echo "</tr>\n";


        echo "</table>\n";
    }

    public function exportarExistenciasEntidades($parametros) {
        $global = ZendExt_GlobalConcept::getInstance();
        $globalEstructura = $global->Estructura;
        $identidad = $globalEstructura->idestructura;
        $denomEntidad = $globalEstructura->denominacion;
        $integrator = ZendExt_IoC::getInstance();
        $excluir = array(7,8,9,10);
        $estructuras = $integrator->metadatos->DameHijosEstructura($identidad,$excluir);

        $parametros['entidadeshijas'] = DatActividadentidad::auxObtenerEntidadesHijasComun((int) $parametros['entidad']);
        array_push($parametros['entidadeshijas'], $parametros['entidad']);
        $parametros['entidadeshijas'] = implode(',', $parametros['entidadeshijas']);

        $parametros['idcb'] = DatEntidaddatosnomenclador::getIdentidaddatosnomenclador($parametros['entidad']);
        $parametros['idcb'] = $parametros['idcb'][0]['identidaddatosnomenclador'];
        if (!$parametros['idcb']) {
            $parametros['idcb'] = 0;
        }
        $identificar = true;
        foreach ($estructuras as $estruc) {
            $estrucs[$estruc->idestructura] = $estruc->denominacion;
        }
        $estrucs[$identidad] = $denomEntidad;
        unset($estructuras);
        $extension = '.xls';
        header(
                "Content-type: application/vnd.ms-" . $tipo . "; name='" . $tipo
                . "';Charset=iso-8859-1"
        );
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header(
                "Content-disposition: attachment; filename=" . 'Calculo_de_Cobertura_Total_Estimada'
                . $extension
        );
        header("Pragma: no-cache");
        header("Expires: 0");
        echo '<HTML><HEAD> <META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html;'
        . 'charset=utf-8"></HEAD><BODY>';
        echo "<table border=1>\n";
        echo " <h3> <caption >Cálculo de Cobertura Total Estimada</caption> </h3> ";

        foreach ($parametros['filt'] as $filtro) {
            $obj_filtro['field'] = $filtro->field;
            $obj_filtro['data']['type'] = $filtro->data->type;
            if ($obj_filtro['data']['type'] == 'numeric') {
                $obj_filtro['data']['comparison'] = $filtro->data->comparison;
            }
            if ($obj_filtro['data']['type'] == 'list') {
                $obj_filtro['data']['value'] = $filtro->data->value[0];
            } else {
                $obj_filtro['data']['value'] = $filtro->data->value;
            }
            $nuevos_filtros[] = $obj_filtro;
        }
        $parametros['filtros'] = self::ordenarFiltrosListarExportar($nuevos_filtros);

        $parametros['contar'] = true;
        $parametros['listar'] = false;
        $cantIndicadoresExportar = self::listarIndCTEyOtros($parametros);

        $cantRegistro = 10000;
        $cantPaginas = (int) ($cantIndicadoresExportar[1] / $cantRegistro);
        if (fmod($cantIndicadoresExportar['1'], $cantRegistro) > 0) {
            $cantPaginas++;
        }
        unset($cantIndicadoresExportar);
        $start = 0;
        $parametros['contar'] = false;
        $parametros['listar'] = true;
        $integrator = ZendExt_IoC::getInstance();
        for ($i = 1; $i <= $cantPaginas; $i++) {
            $parametros['start'] = $start;
            $parametros['limit'] = $cantRegistro;
            $indicadores = self::listarIndCTEyOtros($parametros);
            $start += $cantRegistro;
            foreach ($indicadores[0] as $value) {
                if ($identificar) {
                    echo "<th colspan=\"13\"> Entidad: " . $parametros['nomsel']
                    . "</th>\n";
                    echo "<tr>\n";
                    echo "<th>C&oacute;digo</th>\n";
                    echo "<th>N&uacute;mero de pieza </th>\n";
                    echo "<th>Denominaci&oacute;n</th>\n";
                    echo "<th>Unidad de medida</th>\n";
                    echo "<th>Centro de balance</th>\n";
                    echo "<th>Inventario</th>\n";
                    echo "<th>Tr&aacute;nsito</th>\n";
                    echo "<th>Contratados</th>\n";
                    echo "<th>Necesidad</th>\n";
                    echo "<th>CTE</th>\n";
                    echo "<th>CTE inicial</th>\n";
                    echo "<th>RM</th>\n";
                    echo "<th>Econom&iacute;a</th>\n";
                    echo "</tr>\n";
                    $identificar = false;
                }
                echo "<tr>\n";
                echo "<td style=\"mso-number-format:'@';\">" . $value['codigo']
                . "</td>\n";
                echo "<td>" . $value['numeropieza'] . "</td>\n";
                echo "<td>" . $value['denominacion'] . "</td>\n";
                $UM = $integrator->datosmaestros->obtenerUnidadMedidaDadoId(
                        Array($value['idumedida'])
                );
                echo "<td>" . $UM[0]['denominacionunidadmedida'] . "</td>\n";
                $identcb = DatEntidaddatosnomenclador::getEntidadDadoIdDatos($value['idcentrobalance']);
                $datosEntidad = $integrator->metadatos->DameEstructura(
                        $identcb[0]['identidad']
                );
                echo "<td>" . $datosEntidad[0]->denominacion . "</td>\n";
                echo "<td>" . number_format(
                        $value['cantidadeninventario'], '3', '.', ','
                ) . "</td>\n";
                echo "<td>" . number_format(
                        $value['mercanciaentransito'], '3', '.', ','
                ) . "</td>\n";
                echo "<td>" . number_format(
                        $value['cantidadcontratado'], '3', '.', ','
                ) . "</td>\n";
                echo "<td>" . number_format(
                        $value['necesidadannoactual'], '3', '.', ','
                ) . "</td>\n";
                echo "<td>" . number_format(
                        $value['coberturatotalestimada'], '3', '.', ','
                ) . "</td>\n";
                echo "<td>" . number_format(
                        $value['cteoriginal'], '3', '.', ','
                ) . "</td>\n";
                echo "<td>" . number_format(
                        $value['RM'], '3', '.', ','
                ) . "</td>\n";
                echo "<td>" . number_format(
                        $value['economia'], '3', '.', ','
                ) . "</td>\n";
                echo "</tr>\n";
            }
        }
        echo "</table>\n";
    }

    //esta funcionalidad se utiliza en ListPlanesOrdenPrioridadAction y ajusta 
    // como organo demandante
    public function obtPlanesPriaridad($parametros) {

        $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom($parametros['identidad']);

        $parametros['identidaddatosnomenclador'] = $entidaddatosnom[0]['identidaddatosnomenclador'] ? $entidaddatosnom[0]['identidaddatosnomenclador'] : 0;

        if ($parametros['comportamiento'] == 0) {

            $paramsQuery = array('{' . $parametros['identidad'] . '}',
                $parametros['idejercicio'],
                $parametros['identidaddatosnomenclador']);
            $query = "select mod_planificacion.f_ajustar(?,?,?)";
            $conn = Doctrine_Manager::connection();
            $res = $conn->execute($query, $paramsQuery);
            $resultadoPrimero = $res->fetchAll(PDO::FETCH_ASSOC);
            return ($resultadoPrimero[0]['f_ajustar ']) ? '21' : '21';
        } else {
            $paramsQuery = array('{' . $parametros['identidad'] . '}',
                $parametros['idejercicio'],
                $parametros['identidaddatosnomenclador']);
            $query = "select  mod_planificacion.f_ajustarcb(?,?,?)";
            $conn = Doctrine_Manager::connection();

            $res = $conn->execute($query, $paramsQuery);
            $resultadoPrimero = $res->fetchAll(PDO::FETCH_ASSOC);
            return ($resultadoPrimero[0]['f_ajustarcb ']) ? '21' : '21';
        }
    }

    public function actualizarExistencias($params) {
        $idejercicio = NomEjercicioplanificacion::listarEjercicioActual();
        $idejercicio = $idejercicio[0]['idejercicio'];
        $arrayParams = array();
        $arrayParams[0] = $idejercicio;

        $strEntidades = "{" . implode(",", $params['identidad']) . "}";
        $arrayParams[1] = $strEntidades;

        $query = "select * from mod_planifintegracion.f_integracionajusteexistencia"
                . "2(?,?);";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query, $arrayParams);
        $resultUno = $res->fetchAll(PDO::FETCH_ASSOC);
        return ($resultUno[0]['f_integracionajusteexistencia2']) ? '21' : '23';
    }

    public function actualizarExistenciasPorPlan() {
        $query = "select * from mod_planificacion.ft_actualizarbalancemat();";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $res->fetchAll(PDO::FETCH_ASSOC);
        return '21';
    }

    public function actualizarCalculosDemandaHijos($parametros) {
        $identidadmodelo = DatEntidadmodelo::getIdentidadmodelo($parametros['idmodelo'], $parametros['identidad']);
        $parametros['identidadmodelo'] = $identidadmodelo[0]['identidadmodelo'];
        If ($parametros['comportamiento'] == 0) {
            $paramsQuery = array($parametros['identidad'],
                $parametros['idmodelo'],
                $parametros['identidadmodelo']);
            $query = "select * from mod_planificacion.f_ActualizarDatosOD(?,?,?);";
            $conn = Doctrine_Manager::connection();
            $res = $conn->execute($query, $paramsQuery);
            $resultUno = $res->fetchAll(PDO::FETCH_ASSOC);
            $valor = ($resultUno[0]['f_ActualizarDatosOD']) ? '21' : '23';
        } else {
            $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom($parametros['identidad']);
            $parametros['identidaddatosnomenclador'] = $entidaddatosnom[0]['identidaddatosnomenclador'];
            $paramsQuery = array($parametros['identidad'], $parametros['idmodelo'],
                $parametros['identidadmodelo'], $parametros['identidaddatosnomenclador']);
            $query = "select * from mod_planificacion.f_actualizaciondatoscb"
                    . "(?,?,?,?);";
            $conn = Doctrine_Manager::connection();
            $res = $conn->execute($query, $paramsQuery);
            $resultUno = $res->fetchAll(PDO::FETCH_ASSOC);
            $valor = ($resultUno[0]['f_actualizaciondatoscb']) ? '21' : '23';
        }

        return $valor;
    }

//    FUNCIONALIDADES DEL COMPONENTE REDISTRIBUCION

    public function obtenerIndicadoresConDemanda($limit, $start) {
        $datos = DatAjusteexistenciacb::obtnerIndicadoresConDemanda($limit, $start);
        if ($datos[0] != null) {
            foreach ($datos as $key => $value) {
                if ($key < 20) {
                    if ($value ['identidad']) {
                        $datenti = $this->integrator->metadatos->DameEstructura($value['identidad']);
                        $datos[$key]['denominacioncb'] = $datenti[0]->denominacion;
                    }
                    $datos[$key]['umedida'] = 'sdf';
                    $datos[$key]['preciomlc'] = 0;
                    $datos[$key]['satisfecha'] = 0;
                    $datos[$key]['esd'] = 0;
                    $datos[$key]['porciento'] = 0;
                    $datos[$key]['importe'] = 0;
                }
            }
        }

        if ($datos[0] != null) {

            if ($datos[20]['total'] > 20 || $datos[20]['total'] != null) {
                $data->total = $datos[20]['total'];
                unset($datos[20]);
            }

            if ($datos[21]['importetotal'] != null) {
                $data->importetotal = number_format($datos[21]['importetotal'], '3', '.', ',');
                unset($datos[21]);
            }
            $data->data = $datos;
        } else {
            $data->codMsg = 15;
        }


        return $data;
    }

    public function redistribuirExcedente($params) {
        $idejercicio = NomEjercicioplanificacion::listarEjercicioActual();
        $idejercicio = $idejercicio[0]['idejercicio'];
        $paramsQuery = array("{" . $params['idcentrobalance'] . "}",
            $idejercicio);
        $query = "select * from mod_planificacion.f_redistribucionexcedente(?,?);";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($query, $paramsQuery);
        $result = $result->fetchAll(PDO::FETCH_ASSOC);
        return ($result[0]['f_redistribucionexcedente']) ? '21' : '23';
    }

    public function gestPermisos($params) {
        $query = Doctrine_Query::create();
        $query->select(
                        'dpfe.insertar as insertar,dpfe.modificar as modificar,dpfe.eliminar'
                        . ' as eliminar,dpfe.guardar as guardar,'
                        . 'dpf.idprocesofuncionalidad,dpfe.idprocesofuncionalidadentidad'
                        . ',dpfest.idprocesofuncionalidadestado'
                )->from('DatProcesofuncionalidad dpf')
                ->innerjoin('dpf.DatProcesofuncionalidadestado dpfest')
                ->innerjoin('dpfest.DatProcesofuncionalidadentidad dpfe')
                ->where(
                        "dpfest.idejercicio = ?  AND dpfe.identidad = ? "
                        . "AND dpfest.activo = 1 AND dpf.referencia LIKE '%"
                        . ($params['idfuncionalidad']) . "%' ", array($params['idejercicio'], $params['identidad'])
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        return $result;
    }

    public function ordenarFiltrosListarExportar($filtros) {
        $parametros = array();
        if (is_array($filtros)) {
            foreach ($filtros as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $parametros ['filtros']['codigo'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'denominacion') {
                    $parametros ['filtros']['denominacion'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'cteoriginal') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['cteoriginal_condicion1'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['cteoriginal_condicion2'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['cteoriginal_condicion3'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'numeropieza') {
                    $parametros ['filtros']['numeropieza'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'idumedida') {
                    $parametros ['filtros']['idumedida'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'idcentrobalance') {
                    $parametros ['filtros']['idcentrobalance'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'cantidadeninventario') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['cantidadeninventario_condicion1'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['cantidadeninventario_condicion2'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['cantidadeninventario_condicion3'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'mercanciaentransito') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['mercanciaentransito_condicion1'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['mercanciaentransito_condicion2'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['mercanciaentransito_condicion3'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'cantidadcontratado') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['cantidadcontratado_condicion1'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['cantidadcontratado_condicion2'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['cantidadcontratado_condicion3'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'necesidadannoactual') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['necesidadannoactual_condicion1'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['necesidadannoactual_condicion2'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['necesidadannoactual_condicion3'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'coberturatotalestimada') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['coberturatotalestimada_condicion1'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['coberturatotalestimada_condicion2'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['coberturatotalestimada_condicion3'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'economia') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['economia_condicion1'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['economia_condicion2'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['economia_condicion3'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'RM') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['RM_condicion1'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['RM_condicion2'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['RM_condicion3'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'conmat') {

                    if ($datos ['data'] ['value'] == 'Si') {
                        $parametros['filtros']['conmat'] = 1;
                    } elseif ($datos ['data'] ['value'] == 'No') {
                        $parametros['filtros']['conmat'] = 0;
                    }
                }
            }
        }

        return $parametros['filtros'];
    }

    public function ordenarFiltrosListarExportarDesgVA($filtros) {
        $parametros = array();

        if (is_array($filtros)) {
            foreach ($filtros as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $parametros ['filtros']['codigo'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'denominacion') {
                    $parametros ['filtros']['denominacion'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'idumedida'
                ) {
                    $parametros['filtros']['idumedida'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'precio') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['precio_condicion1'] = array('precio' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['precio_condicion2'] = array('precio' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['precio_condicion3'] = array('precio' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'numeropieza') {
                    $parametros ['filtros']['numeropieza'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'denominacioncb'
                ) {
                    $parametros ['filtros']['denominacioncb'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'importe'
                ) {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['importe_condicion1'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['importe_condicion2'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['importe_condicion3'] = array('importe' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'idaprobacion') {
                    if ($datos ['data'] ['value'] == 'SI') {
                        $parametros ['filtros']['idaprobacionsi'] = '1';
                    }
                    if ($datos ['data'] ['value'] == 'NO') {
                        $parametros ['filtros']['idaprobacionno'] = '0';
                    }
                } elseif ($datos ['field'] == 'desglosado') {
                    if ($datos ['data'] ['value'] == 'SI') {
                        $parametros ['filtros']['desglosadosi'] = '1';
                    }
                    if ($datos ['data'] ['value'] == 'NO') {
                        $parametros ['filtros']['desglosadono'] = '0';
                    }
                    if ($datos ['data'] ['value'] == 'PARCIAL') {
                        $parametros ['filtros']['desglosadop'] = '2';
                    }
                } elseif ($datos ['field'] == 'demanda') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['filtros']['demanda_condicion1'] = array('demanda' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['filtros']['demanda_condicion2'] = array('demanda' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['filtros'] ['demanda_condicion3'] = array('demanda' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                }
            }
        }

        return $parametros['filtros'];
    }

}
