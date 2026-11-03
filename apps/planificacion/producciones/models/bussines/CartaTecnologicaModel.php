<?php

class CartaTecnologicaModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

//***************************************************************
    public function insertar($datCartatecnologica) {
        $datCartatecnologica->save();
    }

    public function modificar($datCartatecnologica) {
        $datCartatecnologica->save();
    }

    public function eliminar($datCartatecnologica) {
        $datCartatecnologica->delete();
    }

    public function listarIndicadoresCartaTecnologica($parametros) {
        $query = new Doctrine_Query();
        $querytotal = new Doctrine_Query();

        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $datos) {
                if ($datos ['field'] == 'codigo') {

//$query->addWhere('n.codigo = {$datos ['data'] ['value']}');
                    $parametros ['codigo'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'numeropieza') {
                    $parametros ['numeropieza'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'denominacion') {
                    $parametros ['denominacion'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'descripcion') {
                    $parametros ['descripcion'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'umedida') {
                    $parametros ['idumedida'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'precio') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['precio_condicion1'] = array('precio' => $datos ['data'] ['value'],
                            'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['precio_condicion2'] = array('precio' => $datos ['data'] ['value'],
                            'condicion' => "<");
                    } else {
                        $parametros ['precio_condicion3'] = array('precio' => $datos ['data'] ['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'centrobalance') {
                    $parametros ['idcentrobalance'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'estado') {
                    if ($datos ['data'] ['value'] == 'Si') {
                        $parametros ['estadosi'] = '1';
                    }
                    if ($datos ['data'] ['value'] == 'No') {
                        $parametros ['estadono'] = '0';
                    }
                }
            }
        }


//si entran cualquier campo para realizar la busqueda
        if (is_array($parametros)) {
            foreach ($parametros as $p => $s) {
                if ($p == 'denominacion' && $s != '') {

                    $query->addWhere(
                            "upper(n.denominacion) LIKE '%" . strtoupper($s) . "%'"
                    );
                    $querytotal->addWhere(
                            "upper(n.denominacion) LIKE '%" . strtoupper($s) . "%'"
                    );
                } elseif ($p == 'codigo' && $s != '') {
                    $query->addWhere("n.codigo LIKE '$s%' ");
                    $querytotal->addWhere("n.codigo LIKE '$s%' ");
                } elseif ($p == 'numeropieza' && $s != '') {
                    $query->addWhere(
                            "upper(n.numeropieza)  LIKE '%" . strtoupper($s) . "%'"
                    );
                    $querytotal->addWhere(
                            "upper(n.numeropieza)  LIKE '%" . strtoupper($s) . "%'"
                    );
                } elseif ($p == 'idformato' && $s != '') {
                    $query->addWhere('n.idformato = ?', $s);
                    $querytotal->addWhere('n.idformato = ?', $s);
                } elseif ($p == 'identidaddatosnomenclador' && $s != '') {
                    $query->addWhere('r.identidaddatosnomenclador = ?', $s);
                    $querytotal->addWhere(
                            'r.identidaddatosnomenclador = ?', $s
                    );
                }

                /*                 * ****************** FILTRADO POR COLUMNA ******************* */

                if ($p == 'descripcion' && $s != '') {
                    $query->addWhere(
                            'upper(n.descripcion) LIKE %' . strtoupper($s) . '%'
                    );
                    $querytotal->addWhere(
                            'upper(n.descripcion) LIKE %' . strtoupper($s) . '%'
                    );
                } elseif ($p == 'idumedida' && $s != '') {
                    $query->addWhere('n.idumedida = ?', $s);
                    $querytotal->addWhere('n.idumedida = ?', $s);
                } elseif ($p == 'precio_condicion1' || $p == 'precio_condicion2' || $p == 'precio_condicion3'
                ) {
                    $query->addWhere(
                            'np.precio ' . $s ['condicion'] . ' ? ', $s ['precio']
                    );
                    $querytotal->addWhere(
                            'np.precio ' . $s ['condicion'] . ' ? ', $s ['precio']
                    );
                }
                /*                 * ****************************************************************** */
            }
        }


        $query->addWhere('n.nivel = 4');
        $querytotal->addWhere("n.nivel = 4");


        /* Filtrar por estado */
        $query->addWhere('n.estado  = 1 ');
        $querytotal->addWhere('n.estado  = 1 ');
        /* Filtrar por aprobacion */
        $query->addWhere('np.idaprobacion  >= 3 AND np.idaprobacion  <= 4 ');
        $querytotal->addWhere(
                'np.idaprobacion  >= 3 AND np.idaprobacion  <= 4  '
        );

//especifico las tablas de búsqueda
        $data->data = $query->select(
                                "n.ordender,n.ordenizq,n.idindicador,n.denominacion,n.codigo,n.descripcion,
             n.idformato,n.estado,np.nivelplanif,n.idpais,np.idaprobacion,np.precio,
             n.idumedida,n.numeropieza,np.flete,np.contingencia,
             n.idumedida"
                        )->from("NomIndicador n")
                        ->innerJoin('n.NomIndicadorplanif np')
//->innerJoin('n.NomIndicadoruam iuam WITH iuam.idnaturalezauam = 1')
//->innerJoin('n.NomIndicadoruam iuam')
                        ->innerJoin("n.DatIndicadorcentrobalance e")
//->innerJoin("e.DatEntidaddatosnomenclador r")
//->innerJoin("iuam.NomNaturalezauam ntz")
                        ->offset($parametros['start'])->limit($parametros['limit'])
                        ->orderby("n.codigo")->execute()->toArray(true);

        $data->total = $querytotal
                        ->select('COUNT(DISTINCT n.idindicador) as total')
                        ->from("NomIndicador n")
                        ->innerJoin('n.NomIndicadorplanif np')
//->innerJoin('n.NomIndicadoruam iuam WITH iuam.idnaturalezauam = 1')// 1 es cultivo
//->innerJoin('n.NomIndicadoruam iuam')// 1 es cultivo
                        ->innerjoin("n.DatIndicadorcentrobalance e")
//->innerjoin("e.DatEntidaddatosnomenclador r")
                        ->execute()->getFirst()->total;

        $this->nomenclador = new ZendExt_Nomencladores_ADT();


        foreach ($data->data as $k => $direction) {
            $unidades = $parametros['integrator']->datosmaestros->obtenerUnidadMedidaDadoId(
                    $direction ['idumedida']
            );
            $data->data [$k] ['umedida'] = $unidades[0]['denominacionunidadmedida'];

            $data->data [$k]['nivelplanif'] = $direction['NomIndicadorplanif']['nivelplanif'];
            $data->data [$k]['precio'] = $direction['NomIndicadorplanif']['precio'];
            $data->data [$k]['idaprobacion'] = $direction['NomIndicadorplanif']['idaprobacion'];
            $data->data [$k]['flete'] = $direction['NomIndicadorplanif']['flete'];
            $data->data [$k]['contingencia'] = $direction['NomIndicadorplanif']['contingencia'];
            $data->data [$k]['precioventa'] = $direction['NomIndicadorplanif']['precioventa'];
            $data->data [$k]['preciodivisa'] = $direction['NomIndicadorplanif']['preciodivisa'];

//print_r($direction['NomIndicadorplanif']);die;
//print_r($data->data [$k]);die;

            if (is_array($direction ['DatIndicadorcentrobalance'])) {
                foreach (
                $direction ['DatIndicadorcentrobalance'] as $d
                ) {
                    $datosentidad = $parametros['integrator']->metadatos->DameEstructura(
                            $d ['DatEntidaddatosnomenclador'] ['identidad']
                    );
                    $data->data [$k] ['centrobalance'] = $datosentidad [0]->denominacion;
                }
            } else {
                $data->data [$k] ['centrobalance'] = '-';
            }

            $data->data [$k] ['numeropieza'] = ($direction ['numeropieza'] == "") ? "-" : $direction ['numeropieza'];
        }
        return $data;
    }

    public function getIndicadores($parametros) {
        $result = DatCartatecnologica::getIndicadores($parametros);
        return $result;
    }

    public function adicionarCartaTec($params) {

        $objCT = new DatCartatecnologica();
        $objCT->denominacion = $params['denominacion'];
        $objCT->valorrendimiento = $params['rendimiento'];
        $objCT->idumedidarendimiento = $params['idumedidarendimiento'];
        $objCT->idvariablecontrol = $params['idvariable'];
        //$objCT->identidadcrea = $params['identidadcrea'];
        $objCT->identidadcrea = $params['identidad'];
        $objCT->idindicador = $params['idindicador'];
        $objCT->idusuario = $params['idusuario'];
        $objCT->idtipomodelo = $params['idtipomodelo'];
        $objCT->idmodelo = $params['idmodelo'];
        $dm = Doctrine_Manager::getInstance();
        $con = $dm->getCurrentConnection();
        $objCT->save();
        $con->commit();

        $tipomodelo = $params['tipomodelo'];
        $this->_meta = ZendExt_Metadata::getInstance();
        $parametros = $params['metafields'];                        //los campos dinamicos que vienen con sus valores desde la vista
        $id = $objCT->idcartatecnologica;
        $insertaok = $this->_meta->Metadata()->insertarEnMetadatos($tipomodelo[0]['idtabla'], $parametros, array('idcartatecnologica' => $id));
        if ($insertaok != true) {
            $con->rollback();                                       //Si no se logra insertar se revierte la insercion de la carta tecnologica
        }

        DatCartatecnologicaentidad::adicionarCartaTecnoEntidad($objCT->idcartatecnologica, $objCT->identidadcrea);
        DatVariablecontrol::actualizarVariableEnUso($params['idvariable'], 1);

        return '24';
    }

    public function modificarCartaTec($params) {

        //$objCT = Doctrine::getTable('DatCartatecnologica')->find($params['idcartatecnologica']);

        $objCT = Doctrine::getTable('DatCartatecnologica')->findByDql("idcartatecnologica = {$params['idcartatecnologica']}");

        $variable_old = $objCT[0]->idvariablecontrol;
        $objCT[0]->denominacion = $params['denominacion'];
        //$objCT->fecha = date("d/m/Y");
        $objCT[0]->valorrendimiento = $params['rendimiento'];
        $objCT[0]->idumedidarendimiento = $params['idumedidarendimiento'];
        $objCT[0]->idvariablecontrol = $params['idvariable'];
        $objCT[0]->idindicador = $params['idindicador'];
        $objCT[0]->idmodelo = $params['idmodelo'];
        $dm = Doctrine_Manager::getInstance();
        $con = $dm->getCurrentConnection();

        $objCT[0]->save();

        //print_r($objCT[0]);        die;

        $con->commit();
//Actualizar los campos dinamicos de la carta
        $tipomodelo = $params['tipomodelo'];
        $this->_meta = ZendExt_Metadata::getInstance();
//los campos dinamicos que vienen con sus valores desde la vista
//Se la añade el idcartatecnologica

        $parametros = $params['metafields'];
        $parametros['insertarenmeta'] = 1;
        $parametros['idcartatecnologica'] = $objCT->idcartatecnologica;
        $obj = (object) $parametros;
        $modificaok = $this->_meta->Metadata()->modificarEnMetadatos($tipomodelo[0]['idtabla'], (array) $obj);
        if ($modificaok != true) {
            $con->rollback();                                       //Si no se logra insertar se revierte la insercion de la carta tecnologica
        }

//Actualizando las producciones del ejercicio actual, por haber modificado la carta tecnológica que está utilizando.
//DatAplicacioncartatecModel::actualizarProduccionesEjercicioActual($params['idejercicioactual'], $objCT->idcartatecnologica, $objCT->valorrendimiento);

        $enUsovarOld = DatVariablecontrol::variableEnUso($variable_old);
        $enUsovarNew = DatVariablecontrol::variableEnUso($params['idvariable']);
        if (count($enUsovarOld) == 0) {
            DatVariablecontrol::actualizarVariableEnUso($variable_old, 0);
        } else {
            DatVariablecontrol::actualizarVariableEnUso($variable_old, 1);
        }

        if (count($enUsovarNew) == 0) {
            DatVariablecontrol::actualizarVariableEnUso($params['idvariable'], 1);
        }

        return '24';
    }

    public function duplicarCartaTec($params) {
        $objCT = new DatCartatecnologica();
        $objCT->denominacion = $params['denominacion'];
//$objCT->fecha = date("d/m/Y");
        $objCT->valorrendimiento = $params['rendimiento'];
        $objCT->idumedidarendimiento = $params['idumedidarendimiento'];
        $objCT->idvariablecontrol = $params['idvariable'];
//$objCT->identidadcrea = $params['identidadcrea'];
        $objCT->identidadcrea = $params['identidad'];
        $objCT->idindicador = $params['idindicador'];
        $objCT->idusuario = $params['idusuario'];
        $objCT->idtipomodelo = $params['idtipomodelo'];
        $objCT->idmodelo = $params['idmodelo'];
        $dm = Doctrine_Manager::getInstance();
        $con = $dm->getCurrentConnection();
        $objCT->save();
        $con->commit();

        $tipomodelo = $params['tipomodelo'];
        $this->_meta = ZendExt_Metadata::getInstance();
        $parametros = $params['metafields'];                        //los campos dinamicos que vienen con sus valores desde la vista
        $id = $objCT->idcartatecnologica;
        $insertaok = $this->_meta->Metadata()->insertarEnMetadatos($tipomodelo[0]['idtabla'], $parametros, array('idcartatecnologica' => $id));
        if ($insertaok != true) {
            $con->rollback();                                       //Si no se logra insertar se revierte la insercion de la carta tecnologica
        }
        DatCartatecnologicaentidad::adicionarCartaTecnoEntidad($objCT->idcartatecnologica, $params['identidadcrea']);
        DatVariablecontrol::actualizarVariableEnUso($params['idvariable'], 1);

        /* Copiar actividades */
        /* buscar las actividades */
        $cartaTecactvs = DatCartatecnologicaactividad::obtenerCartaTecAct(
                        $params['idcartatecnologica']
        );
        foreach ($cartaTecactvs as $valorAct) {
            $objCTAct = new DatCartatecnologicaactividad();
            $objCTAct->idcartatecnologica = $objCT->idcartatecnologica;
            $objCTAct->idactividad = $valorAct->idactividad;
            $objCTAct->plazo = $valorAct->plazo;
            $objCTAct->duracion = $valorAct->duracion;
            $objCTAct->idetapa = $valorAct->idetapa;
            $objCTAct->diacero = $valorAct->diacero;
            $objCTAct->porciento = $valorAct->porciento;
            $objCTAct->idusuario = $valorAct->idusuario;
            $objCTAct->save();
        }
        return '24';
    }

    public function eliminarCartasTecnologicas($cartastecnologicas, $variables, $idusuario) {
        $result = -1;
        try {
            $query = Doctrine_Query::create();
            $query->delete('DatCartatecnologica')
                    ->from('DatCartatecnologica')
                    ->addWhere('enuso = 0')
                    ->addWhere('estado = 0')
                    ->addWhere('idaprobacion = 1')
                    ->whereIn('idcartatecnologica', $cartastecnologicas)->execute();
            $result = 0;

            foreach ($variables as $value) {
                $enUsovar = DatVariablecontrol::variableEnUso($value);
                if (count($enUsovar) == 0) {
                    DatVariablecontrol::actualizarVariableEnUso($value, 0);
                } else {
                    DatVariablecontrol::actualizarVariableEnUso($value, 1);
                }
            }
            $result = 1;
            return $result;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function listarActividadesCT($params) {
        $res = DatCartatecnologicaactividad::listarActividadesCT($params);
        return $res;
    }

    public function listarActividadesCTDependencia($params) {
        $res = DatCartatecnologicaactividad::listarActividadesCTDependencia($params);
        return $res;
    }

    public function listarActividades($params, $idactividad = false) {
        $res = DatCartatecnologicaactividad::listarActividades($params, $idactividad);
        return $res;
    }

    public function setDependencia($params) {
        $padres = array();
        $padres = ($params['actPadres']);
        $children = array();
        $children = ($params['actChildren']);
        foreach ($padres as $p) {

            if (is_object($p)) {
                $p = get_object_vars($p);
            }
            DatCartatecnologicaactividad::deleteDependencia($p['idcartatecnologicaactividad']);
            foreach ($children as $ch) {

                if (is_object($ch)) {
                    $ch = get_object_vars($ch);
                }
                DatCartatecnologicaactividad::insertDependencia($p['idcartatecnologicaactividad'], $ch['idcartatecnologicaactividad']);
            }
        }
    }

    public function aprobarCartaTecnologica($params) {
        $cant = 0;
//Para cuando la accion es aprobar
        if ($params['idaprobacion'] != 1) {
            $integrator = $params['integrator'];

            foreach ($params['cartas'] as $value) {
                $resp = 0;
                $params['idcartatecnologica'] = $value->idcarta;
                $actividades = DatCartatecnologicaactividad::listarActividadesCT($params);
                if ($actividades[0]['total'] > 0) {
                    $resp = self::validarActividades($actividades);
                }
                if ($resp != 0) {
                    $res = DatCartatecnologica::aprobarCartaTecnologica($params['idaprobacion'], $value->idcarta);
                    $cant = cant + $res;
                  
                    if ($res != 0 && $value->idaprobacion != 3 && $value->idaprobacion != 4 && $value->uso != 1) {
                        //DatCartatecnologicaModel::auxrelacionarCTEntidadesHijas($integrator, $value);
                        self::auxrelacionarCTEntidadesHijas($integrator, $value);
                    }
                }
            }
        } else {
//Para cuando la accion es desaprobar
            foreach ($params['cartas'] as $value) {
                if ($value->uso != 1) {
                    $res = DatCartatecnologica::aprobarCartaTecnologica($params['idaprobacion'], $value->idcarta);
                    $cant = $cant + $res;
                    if ($params['idaprobacion'] == 1) {
                        $arrCarta[] = $value->idcarta;
                        DatCartatecnologica::activarCartaTecnologica(0, $arrCarta);
//eliminar la asociacion de la carta con las estructuras, excepto la estructura dueña
                        DatCartatecnologicaentidad::eliminarRelacionCartaTecnoEntidad($value->idcarta, $value->identidad);
                    }
                }
            }
        }
        return $cant;
    }

    public function activarCartaTecnologica($params) {
        $res = DatCartatecnologica::activarCartaTecnologica($params['activar'], $params['cartas']);

        return array('codMsg' => 24, 'cant' => $res);
    }

    public function generarFicha($params) {

        $arrayFichacosto = array();
        $arrayFichacosto['denoempresa'] = $params['denoentidad'];
        $arrayFichacosto['codigo'] = $params['codigoentidad'];
        /*         * ******************** */
        $objCtind = DatCartatecnologica::buscarCartaTecIndicador(
                        $params['idcartatecnologica']
        );


        $objCtind = $objCtind[0];

        $arrayFichacosto['precio_oficial_aprobado_pc'] = round(
                $objCtind['DatCartatecnologicaindicador']['NomIndicador']['precio'], 3
        );
        $arrayFichacosto['precio_oficial_aprobado_cuc'] = "-";


        $arrayFichacosto['producto_servicio'] = $objCtind['DatCartatecnologicaindicador']['NomIndicador']['denominacion'];
        $arrayFichacosto['codigo_prod_oserv'] = $objCtind['DatCartatecnologicaindicador']['NomIndicador']['codigo'];

        $unidades = $params['integrator']->datosmaestros->obtenerUnidadMedidaDadoId(
                $objCtind['DatCartatecnologicaindicador']['NomIndicador']['idumedida']
        );
        $arrayFichacosto['um'] = $unidades->abreviatura;

        $arrayFichacosto['rendimiento'] = round(
                ($objCtind['valorrendimiento'] / $objCtind['valorcapacidadprod']), 3
        );
        $arrayFichacosto['rend_periodos_ant'] = "-";

        $resultarrayCtactindinduam = DatCartatecnologica::obtenerFichaDeCosto(
                        $params['idcartatecnologica']
        );

        $arrayFichacosto['materias_primas_fundamentales_pc'] = round(
                $resultarrayCtactindinduam[0]['importeinsumos'], 2
        );
        $arrayFichacosto['materias_primas_fundamentales_cuc'] = '-';

        $arrayFichacosto['combusibles_lubricantes_pc'] = round(
                $resultarrayCtactindinduam[0]['importecomblub'], 2
        );
        $arrayFichacosto['combusibles_lubricantes_cuc'] = '-';

        $arrayFichacosto['energia_electrica_pc'] = round(
                $resultarrayCtactindinduam[0]['importeenergiaelect'], 2
        );
        $arrayFichacosto['energia_electrica_cuc'] = "-";

        $arrayFichacosto['agua_pc'] = round(
                $resultarrayCtactindinduam[0]['importeagua'], 2
        );
        $arrayFichacosto['agua_cuc'] = "-";


        /*         * **** materia_prima_materiales *** */
        $arrayFichacosto['materia_prima_materiales_pc'] = round(
                $arrayFichacosto['materias_primas_fundamentales_pc'] +
                $arrayFichacosto['combusibles_lubricantes_pc'] + $arrayFichacosto['energia_electrica_pc'] +
                $arrayFichacosto['agua_pc'], 2
        );
        $arrayFichacosto['materia_prima_materiales_cuc'] = '-';
        /*         * ******************************************************************** */

        $arrayFichacosto['otros_gastos_directos_depreciacion_pc'] = round(
                $resultarrayCtactindinduam[0]['importe_ogd_depreciacion'], 4
        );
        $arrayFichacosto['otros_gastos_directos_depreciacion_cuc'] = "-";

        $arrayFichacosto['otros_gastos_directos_arrendamiento_equipo_pc'] = "0";
        $arrayFichacosto['otros_gastos_directos_arrendamiento_equipo_cuc'] = "-";

        $arrayFichacosto['otros_gastos_directos_ropa_calzado_pc'] = "0";
        $arrayFichacosto['otros_gastos_directos_ropa_calzado_cuc'] = "-";
        /*         * ************* */
        $arrayFichacosto['otros_gastos_directos_pc'] = round(
                $arrayFichacosto['otros_gastos_directos_depreciacion_pc'] +
                $arrayFichacosto['otros_gastos_directos_arrendamiento_equipo_pc'] +
                $arrayFichacosto['otros_gastos_directos_ropa_calzado_pc'] +
                $arrayFichacosto['gastos_fuerza_trabajo_pc'], 4
        );
        $arrayFichacosto['otros_gastos_directos_cuc'] = "-";
        /*         * ************ */

        $arrayFichacosto['gastos_fuerza_trabajo_salarios_pc'] = round(
                $resultarrayCtactindinduam[0]['importesalario'], 2
        );
        $arrayFichacosto['gastos_fuerza_trabajo_salarios_cuc'] = "-";

        $arrayFichacosto['gastos_fuerza_trabajo_vacaciones_pc'] = round(
                ($resultarrayCtactindinduam[0]['importesalario'] * '0.0909'), 2
        );
        $arrayFichacosto['gastos_fuerza_trabajo_vacaciones_cuc'] = "-";

        $arrayFichacosto['gastos_fuerza_trabajo_ImpUtilizacionFuerzaTrab_pc'] = "0";
        $arrayFichacosto['gastos_fuerza_trabajo_ImpUtilizacionFuerzaTrab_cuc'] = "-";

        $arrayFichacosto['gastos_fuerza_trabajo_ContribucionSegSocial_pc'] = round(
                (($resultarrayCtactindinduam[0]['importesalario'] +
                $resultarrayCtactindinduam[0]['importesalario'] * '0.0909') * '0.125'), 2
        );
        $arrayFichacosto['gastos_fuerza_trabajo_ContribucionSegSocial_cuc'] = "-";

        $arrayFichacosto['gastos_fuerza_trabajo_EstimulacionEnPesosConvertibles_pc'] = "0";
        $arrayFichacosto['gastos_fuerza_trabajo_EstimulacionEnPesosConvertibles_cuc'] = "-";

        /*         * ********** */
        $arrayFichacosto['gastos_fuerza_trabajo_pc'] = round(
                ($arrayFichacosto['gastos_fuerza_trabajo_salarios_pc'] +
                $arrayFichacosto['gastos_fuerza_trabajo_vacaciones_pc'] +
                $arrayFichacosto['gastos_fuerza_trabajo_ImpUtilizacionFuerzaTrab_pc'] +
                $arrayFichacosto['gastos_fuerza_trabajo_ContribucionSegSocial_pc'] +
                $arrayFichacosto['gastos_fuerza_trabajo_EstimulacionEnPesosConvertibles_pc']), 2
        );
        $arrayFichacosto['gastos_fuerza_trabajo_cuc'] = "-";
        /*         * *********** */

        $arrayFichacosto['gastos_indirectos_produccion_pc'] = round(
                (0.54 * ($arrayFichacosto['gastos_fuerza_trabajo_salarios_pc'] + $arrayFichacosto['gastos_fuerza_trabajo_vacaciones_pc'])), 2
        ); //0,54 *  salarios + vacaciones
        $arrayFichacosto['gastos_indirectos_produccion_cuc'] = "-";

        $arrayFichacosto['gastos_indirectos_produccion_depreciacion_pc'] = "0";
        $arrayFichacosto['gastos_indirectos_produccion_depreciacion_cuc'] = "-";

        $arrayFichacosto['gastos_indirectos_produccion_MttoYReparacion_pc'] = round(
                $resultarrayCtactindinduam[0]['importe_ogd_mantenimiento'], 4
        );
        $arrayFichacosto['gastos_indirectos_produccion_MttoYReparacion_cuc'] = "-";

        $arrayFichacosto['otros_pc'] = $arrayFichacosto['gastos_indirectos_produccion_pc'] - $arrayFichacosto['gastos_indirectos_produccion_MttoYReparacion_pc'];
        $arrayFichacosto['otros_cuc'] = "-";

        /*         * *********************************************** */
        $arrayFichacosto['gastos_generales_admin_CombustiblesYLubricantes_pc'] = "0";
        $arrayFichacosto['gastos_generales_admin_CombustiblesYLubricantes_cuc'] = "-";

        $arrayFichacosto['gastos_generales_admin_EnergiaElect_pc'] = "0";
        $arrayFichacosto['gastos_generales_admin_EnergiaElect_cuc'] = "-";

        $arrayFichacosto['gastos_generales_admin_depreciacion_pc'] = "0";
        $arrayFichacosto['gastos_generales_admin_depreciacion_cuc'] = "-";

        $arrayFichacosto['gastos_generales_admin_RopaYCalzado_pc'] = "0";
        $arrayFichacosto['gastos_generales_admin_RopaYCalzado_cuc'] = "-";

        $arrayFichacosto['gastos_generales_admin_alimentos_pc'] = "0";
        $arrayFichacosto['gastos_generales_admin_alimentos_cuc'] = "-";

        $arrayFichacosto['gastos_generales_admin_pc'] = round(
                (0.12 * ($arrayFichacosto['gastos_fuerza_trabajo_salarios_pc'] + $arrayFichacosto['gastos_fuerza_trabajo_vacaciones_pc'])), 2
        );
        $arrayFichacosto['gastos_generales_admin_cuc'] = "-";

        /*         * ******************************** */
        $arrayFichacosto['gastos_distribucion_y_venta_CombustibleYLubricantes_pc'] = "0";
        $arrayFichacosto['gastos_distribucion_y_venta_CombustibleYLubricantes_cuc'] = "-";

        $arrayFichacosto['gastos_distribucion_y_venta_EnergiaElect_pc'] = "0";
        $arrayFichacosto['gastos_distribucion_y_venta_EnergiaElect_cuc'] = "-";

        $arrayFichacosto['gastos_distribucion_y_venta_despreciacion_pc'] = "0";
        $arrayFichacosto['gastos_distribucion_y_venta_despreciacion_cuc'] = "-";

        $arrayFichacosto['gastos_distribucion_y_venta_alimientos_pc'] = "0";
        $arrayFichacosto['gastos_distribucion_y_venta_alimientos_cuc'] = "-";

        $arrayFichacosto['gastos_distribucion_y_venta_pc'] = "0";
        $arrayFichacosto['gastos_distribucion_y_venta_cuc'] = "-";
        /*         * ******************************************** */

        $arrayFichacosto['gastos_bancarios_pc'] = "0";
        $arrayFichacosto['gastos_bancarios_cuc'] = "-";

        $seguro = NomIndicadoruam::getIndicadorUam(
                        $objCtind['DatCartatecnologicaindicador']['NomIndicador']['idindicador']
                )->seguro;

        $arrayFichacosto['gastos_seguro_pc'] = round(
                ($arrayFichacosto['precio_oficial_aprobado_pc'] * $seguro * $arrayFichacosto['rendimiento']), 2
        ); // preciooficialaprobado * porcientoseguroparobado
        $arrayFichacosto['gastos_seguro_cuc'] = "-";
        /*         * *************** subtotal_gasto_elaboracion *************** */
        $arrayFichacosto['subtotal_gasto_elaboracion_pc'] = round(
                ($arrayFichacosto['otros_gastos_directos_pc'] +
                $arrayFichacosto['gastos_fuerza_trabajo_pc'] + $arrayFichacosto['gastos_indirectos_produccion_pc'] +
                $arrayFichacosto['gastos_generales_admin_pc'] + $arrayFichacosto['gastos_bancarios_pc'] + $arrayFichacosto['gastos_seguro_pc']), 4
        );
        $arrayFichacosto['subtotal_gasto_elaboracion_cuc'] = "-";


        /*         * ********************************************************************* */
        $arrayFichacosto['gastos_totales_OCostoProd_pc'] = round(
                ($arrayFichacosto['materia_prima_materiales_pc'] +
                $arrayFichacosto['subtotal_gasto_elaboracion_pc']), 2
        );
        $arrayFichacosto['gastos_totales_OCostoProd_cuc'] = "-";
        /*         * ******************************************************************** */


        /*         * **************** */
        $arrayFichacosto['ingreso_pc'] = round(
                ($objCtind['DatCartatecnologicaindicador']['NomIndicador']['precio'] * $arrayFichacosto['rendimiento']), 2
        );
        $arrayFichacosto['ingreso_cuc'] = "-";

        $arrayFichacosto['utilidad_pc'] = round(
                $arrayFichacosto['ingreso_pc'] - $arrayFichacosto['gastos_totales_OCostoProd_pc'], 2
        );
        $arrayFichacosto['utilidad_cuc'] = "-";


        $arrayFichacosto['coeficiente_aporte_a_la_empresa_pc'] = round(
                ($arrayFichacosto['gastos_generales_admin_pc'] + $arrayFichacosto['utilidad_pc']) / $arrayFichacosto['ingreso_pc'], 5
        );
        $arrayFichacosto['coeficiente_aporte_a_la_empresa_cuc'] = "-";


        /*         * ************************ IU *********************************** */

        $table = '<table border="1">
  <tr>
    <td colspan="3"><div align="center"><strong>FICHA DE COSTO UNI&Oacute;N AGROPECUARIA MILITAR </strong></div></td>
  </tr>
  <tr>
    <td colspan="2"><strong>EMPRESA:' . $arrayFichacosto['denoempresa'] . '</strong></td>
    <td width="194"><strong>C&Oacute;DIGO:' . $arrayFichacosto['codigo'] . '</strong></td>
  </tr>
  <tr>
    <td width="374"><strong>PRODUCTO O SERVICIO:'
                . $arrayFichacosto['producto_servicio'] . '</strong></td>
    <td width="201"><strong>C&Oacute;DIGO:'
                . $arrayFichacosto['codigo_prod_oserv'] . '</strong></td>
    <td><strong>UM:' . $arrayFichacosto['um'] . '</strong></td>
  </tr>
  <tr>
    <td><strong>RENDIMIENTO:' . $arrayFichacosto['rendimiento'] . '</strong></td>
    <td colspan="2"><strong>RENDIMIENTO PER&Iacute;ODOS ANTERIORES:'
                . $arrayFichacosto['rend_periodos_ant'] . '</strong></td>
  </tr>
  <tr>
    <td><div align="center"><strong>CONCEPTO DE GASTOS </strong></div></td>
    <td><div align="center"><strong>MONEDA TOTAL </strong></div></td>
    <td> <div align="center"><strong>DE ELLO CUC </strong></div></td>
  </tr>
  <tr>
    <td><strong>MATERIA PRIMA Y MATERIALES </strong></td>
    <td>' . $arrayFichacosto['materia_prima_materiales_pc'] . '</td>
    <td>' . $arrayFichacosto['materia_prima_materiales_cuc'] . '</td>
  </tr>
  <tr>
    <td>Materias Primas y Materiales fundamentales </td>
    <td>' . $arrayFichacosto['materias_primas_fundamentales_pc'] . '</td>
    <td>' . $arrayFichacosto['materias_primas_fundamentales_cuc'] . '</td>
  </tr>
  <tr>
    <td>Combustibles y lubricantes </td>
   <td>' . $arrayFichacosto['combusibles_lubricantes_pc'] . '</td>
    <td>' . $arrayFichacosto['combusibles_lubricantes_cuc'] . '</td>
  </tr>
  <tr>
    <td>Energia El&eacute;ctrica </td>
    <td>' . $arrayFichacosto['energia_electrica_pc'] . '</td>
    <td>' . $arrayFichacosto['energia_electrica_cuc'] . '</td>
  </tr>
  <tr>
    <td>Agua</td>
    <td>' . $arrayFichacosto['agua_pc'] . '</td>
    <td>' . $arrayFichacosto['agua_cuc'] . '</td>
  </tr>
  <tr>
    <td><strong>SUBTOTAL(GASTOS DE ELABORACI&Oacute;N)</strong></td>
    <td>' . $arrayFichacosto['subtotal_gasto_elaboracion_pc'] . '</td>
    <td>' . $arrayFichacosto['subtotal_gasto_elaboracion_cuc'] . '</td>
  </tr>
  <tr>
    <td><strong>OTROS GASTOS DIRECTOS </strong></td>
    <td>' . $arrayFichacosto['otros_gastos_directos_pc'] . '</td>
    <td>' . $arrayFichacosto['otros_gastos_directos_cuc'] . '</td>
  </tr>
  <tr>
    <td>Depreciaci&oacute;n</td>
     <td>' . $arrayFichacosto['otros_gastos_directos_depreciacion_pc'] . '</td>
    <td>' . $arrayFichacosto['otros_gastos_directos_depreciacion_cuc'] . '</td>
  </tr>
  <tr>
    <td>Arrendamiento de Equipos</td>
      <td>'
                . $arrayFichacosto['otros_gastos_directos_arrendamiento_equipo_pc']
                . '</td>
    <td>' . $arrayFichacosto['otros_gastos_directos_arrendamiento_equipo_cuc']
                . '</td>
  </tr>
  <tr>
    <td>Ropa y Calzado(trabajadores directos) </td>
    <td>' . $arrayFichacosto['otros_gastos_directos_ropa_calzado_pc'] . '</td>
    <td>' . $arrayFichacosto['otros_gastos_directos_ropa_calzado_cuc'] . '</td>
  </tr>
  <tr>
    <td><strong>GASTOS DE FUERZA DE TRABAJO </strong></td>
     <td>' . $arrayFichacosto['gastos_fuerza_trabajo_pc'] . '</td>
    <td>' . $arrayFichacosto['gastos_fuerza_trabajo_cuc'] . '</td>
  </tr>
  <tr>
    <td>Salarios</td>
    <td>' . $arrayFichacosto['gastos_fuerza_trabajo_salarios_pc'] . '</td>
    <td>' . $arrayFichacosto['gastos_fuerza_trabajo_salarios_cuc'] . '</td>
  </tr>
  <tr>
    <td>Vacaciones</td>
    <td>' . $arrayFichacosto['gastos_fuerza_trabajo_vacaciones_pc'] . '</td>
    <td>' . $arrayFichacosto['gastos_fuerza_trabajo_vacaciones_cuc'] . '</td>
  </tr>
  <tr>
    <td>Impuestos por la Utilizaci&oacute;n de la Fuerza de Trabajo </td>
    <td>'
                . $arrayFichacosto['gastos_fuerza_trabajo_ImpUtilizacionFuerzaTrab_pc']
                . '</td>
    <td>'
                . $arrayFichacosto['gastos_fuerza_trabajo_ImpUtilizacionFuerzaTrab_cuc']
                . '</td>
  </tr>
  <tr>
    <td>Contribuci&oacute;n a la Seguridad Social </td>
    <td>' . $arrayFichacosto['gastos_fuerza_trabajo_ContribucionSegSocial_pc']
                . '</td>
    <td>'
                . $arrayFichacosto['gastos_fuerza_trabajo_ContribucionSegSocial_cuc']
                . '</td>
  </tr>
  <tr>
    <td>Estimulaci&oacute;n en Pesos Convertibles </td>
    <td>'
                . $arrayFichacosto['gastos_fuerza_trabajo_EstimulacionEnPesosConvertibles_pc']
                . '</td>
    <td>'
                . $arrayFichacosto['gastos_fuerza_trabajo_EstimulacionEnPesosConvertibles_cuc']
                . '</td>
  </tr>
  <tr>
    <td><strong>GASTOS INDIRECTOS DE PRODUCCI&Oacute;N </strong></td>
    <td>' . $arrayFichacosto['gastos_indirectos_produccion_pc'] . '</td>
    <td>' . $arrayFichacosto['gastos_indirectos_produccion_cuc'] . '</td>
  </tr>
  <tr>
    <td>Depreciaci&oacute;n</td>
    <td>' . $arrayFichacosto['gastos_indirectos_produccion_depreciacion_pc'] . '</td>
    <td>' . $arrayFichacosto['gastos_indirectos_produccion_depreciacion_cuc']
                . '</td>
  </tr>
  <tr>
    <td>Mantenimiento y Reparaci&oacute;n </td>
    <td>'
                . $arrayFichacosto['gastos_indirectos_produccion_MttoYReparacion_pc']
                . '</td>
    <td>'
                . $arrayFichacosto['gastos_indirectos_produccion_MttoYReparacion_cuc']
                . '</td>
  </tr>
  <tr>
    <td>Otros</td>
    <td>' . $arrayFichacosto['otros_pc'] . '</td>
    <td>' . $arrayFichacosto['otros_cuc'] . '</td>
  </tr>
  <tr>
    <td><strong>GASTOS GENERALES DE ADMINISTRACI&Oacute;N </strong></td>
   <td>' . $arrayFichacosto['gastos_generales_admin_pc'] . '</td>
    <td>' . $arrayFichacosto['gastos_generales_admin_cuc'] . '</td>
  </tr>
  <tr>
    <td>Combustibles y lubricantes </td>
    <td>'
                . $arrayFichacosto['gastos_generales_admin_CombustiblesYLubricantes_pc']
                . '</td>
    <td>'
                . $arrayFichacosto['gastos_generales_admin_CombustiblesYLubricantes_cuc']
                . '</td>
  </tr>
  <tr>
    <td>Energ&iacute;a El&eacute;ctrica </td>
   <td>' . $arrayFichacosto['gastos_generales_admin_EnergiaElect_pc'] . '</td>
    <td>' . $arrayFichacosto['gastos_generales_admin_EnergiaElect_cuc'] . '</td>
  </tr>
  <tr>
    <td>Depreciaci&oacute;n</td>
    <td>' . $arrayFichacosto['gastos_generales_admin_depreciacion_pc'] . '</td>
    <td>' . $arrayFichacosto['gastos_generales_admin_depreciacion_cuc'] . '</td>
  </tr>
  <tr>
    <td>Ropa y Calzado(trabajadores indirectos correspondientes) </td>
  <td>' . $arrayFichacosto['gastos_generales_admin_RopaYCalzado_pc'] . '</td>
    <td>' . $arrayFichacosto['gastos_generales_admin_RopaYCalzado_cuc'] . '</td>
  </tr>
  <tr>
    <td>Alimentos</td>
    <td>' . $arrayFichacosto['gastos_generales_admin_alimentos_pc'] . '</td>
    <td>' . $arrayFichacosto['gastos_generales_admin_alimentos_cuc'] . '</td>
  </tr>
  <tr>
    <td><strong>GASTOS DE DISTRIBUCI&Oacute;N Y VENTA </strong></td>
    <td>' . $arrayFichacosto['gastos_distribucion_y_venta_pc'] . '</td>
    <td>' . $arrayFichacosto['gastos_distribucion_y_venta_cuc'] . '</td>
  </tr>
  <tr>
    <td>Combustibles y lubricantes </td>
    <td>'
                . $arrayFichacosto['gastos_distribucion_y_venta_CombustibleYLubricantes_pc']
                . '</td>
    <td>'
                . $arrayFichacosto['gastos_distribucion_y_venta_CombustibleYLubricantes_cuc']
                . '</td>
  </tr>
  <tr>
    <td>Energ&iacute;a El&eacute;ctrica </td>
    <td>' . $arrayFichacosto['gastos_distribucion_y_venta_EnergiaElect_pc'] . '</td>
    <td>' . $arrayFichacosto['gastos_distribucion_y_venta_EnergiaElect_cuc'] . '</td>
  </tr>
  <tr>
    <td>Depreciaci&oacute;n</td>
   <td>' . $arrayFichacosto['gastos_distribucion_y_venta_despreciacion_pc'] . '</td>
    <td>' . $arrayFichacosto['gastos_distribucion_y_venta_despreciacion_cuc']
                . '</td>
  </tr>
  <tr>
    <td>Ropa y Calzado(trabajadores indirectos correspondientes) </td>
   <td>' . $arrayFichacosto['gastos_distribucion_y_venta_despreciacion_pc'] . '</td>
    <td>' . $arrayFichacosto['gastos_distribucion_y_venta_despreciacion_cuc']
                . '</td>
  </tr>
  <tr>
    <td>Alimentos</td>
    <td>' . $arrayFichacosto['gastos_distribucion_y_venta_alimientos_pc'] . '</td>
    <td>' . $arrayFichacosto['gastos_distribucion_y_venta_alimientos_cuc'] . '</td>
  </tr>
  <tr>
    <td><strong>GASTOS BANCARIOS </strong></td>
    <td>' . $arrayFichacosto['gastos_bancarios_pc'] . '</td>
    <td>' . $arrayFichacosto['gastos_bancarios_cuc'] . '</td>
  </tr>
  <tr>
    <td><strong>GASTOS DEL SEGURO </strong></td>
    <td>' . $arrayFichacosto['gastos_seguro_pc'] . '</td>
    <td>' . $arrayFichacosto['gastos_seguro_cuc'] . '</td>
  </tr>
  <tr>
    <td><strong>GASTOS TOTALES O COSTO DE PRODUCCI&Oacute;N </strong></td>
    <td>' . $arrayFichacosto['gastos_totales_OCostoProd_pc'] . '</td>
    <td>' . $arrayFichacosto['gastos_totales_OCostoProd_cuc'] . '</td>
  </tr>
  <tr>
    <td><strong>PRECIO OFICIAL APROBADO </strong></td>
   <td>' . $arrayFichacosto['precio_oficial_aprobado_pc'] . '</td>
    <td>' . $arrayFichacosto['precio_oficial_aprobado_cuc'] . '</td>
  </tr>
  <tr>
    <td><strong>INGRESO</strong></td>
    <td>' . $arrayFichacosto['ingreso_pc'] . '</td>
    <td>' . $arrayFichacosto['ingreso_cuc'] . '</td>
  </tr>
  <tr>
    <td><strong>UTILIDAD</strong></td>
    <td>' . $arrayFichacosto['utilidad_pc'] . '</td>
    <td>' . $arrayFichacosto['utilidad_cuc'] . '</td>
  </tr>
  <tr>
    <td><strong>COEFICIENTE DE APORTE A LA EMPRESA (CAE) </strong></td>
    <td>' . $arrayFichacosto['coeficiente_aporte_a_la_empresa_pc'] . '</td>
    <td>' . $arrayFichacosto['coeficiente_aporte_a_la_empresa_cuc'] . '</td>
  </tr>
  <tr>
    <td height="61"><p><em><strong>ELABORADO POR:</strong></em></p>
    <p><em><strong>CARGO:</strong></em></p></td>
    <td><em><strong>FIRMA:</strong></em></td>
    <td><em><strong>FECHA:</strong></em></td>
  </tr>
  <tr>
    <td height="61"><p><em><strong>APROBADO POR: </strong></em></p>
    <p><em><strong>CARGO:</strong></em></p></td>
    <td><em><strong>FIRMA:</strong></em></td>
    <td><em><strong>FECHA:</strong></em></td>
  </tr>
</table>';
        if ($params['formato'] == 'EXCEL') {
            header("Pragma: public");
            header("Expires: 0");
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header("Content-Type: application/force-download");
            header("Content-Type: application/octet-stream");
            header("Content-Type: application/download");
            header(
                    "Content-Disposition: attachment;filename =FICHA_DE_COSTO.xls"
            );
            header("Content-Transfer-Encoding: binary ");
            echo $table;
        } elseif ($params['formato'] == 'HTML') {
            echo $table;
        }
    }

    public function asociarCartaaModelo($cartas, $modelos) {
        $objeto = new DatCartatecnologicamodelo();
        $objeto->eliminarModelosXCarta($cartas);
        foreach ($cartas as $value) {
            foreach ($modelos as $val) {
                $obj = new DatCartatecnologicamodelo();
                $obj->idmodelo = $val;
                $obj->idcartatecnologica = $value;
                $obj->save();
            }
        }
        return true;
    }

    public function listarPlanesXCarta($idcarta) {
        $obj = new DatCartatecnologicamodelo();
        return $obj->listarModelosXCarta($idcarta);
    }

    public function validarAprobacionCT($cartas) {
        foreach ($cartas as $idcartatecnologica) {
            $idaprobacionct = DatCartatecnologica::aprobacionCT(
                            $idcartatecnologica
            );
            $idaprob = $idaprobacionct [0] ['idaprobacion'];
            if ($idaprob == 3 || $idaprob == 4) {
                $result = array('codMsg' => 23);
                break;
            } else {
                $result = array('codMsg' => 24);
            } //puede realizar la operacion
        }
        return $result;
    }

    public function listarEtapas() {
        $obj = new DatCartatecnologica();
        return $obj->listarEtapas();
    }

    public function setDiaCero($params) {
        $data = DatCartatecnologicaactividad::setDiaCero($params);
        return $data;
    }

    public function exportarFichaCosto($params) {
        $datoscarta = CartatecnologicaModel::datosCartaFichaCosto($params);
        $equiposasoc = new DatCartatecnologica();

        $data = $equiposasoc->listarEquiposAsocACarta($params);

        $natindicadores = DatFichacosto::exportarFichaCosto($params);
        $piedefirma = DatDatosautorficha::obtenerDatosAutor($params);
        $mediosmateriales = 0;
        $energia = 0;
        $combustible = 0;
        $agua = 0;
        $depreciacion = 0;
        $salario = 0;
        $mantenimiento = 0;
        foreach ($data as $item) {
            $depreciacion = $depreciacion + $item['depreciasionperiodo'];
            $mantenimiento = $mantenimiento + $item['gastosmantenimiento'];
        }
        $depreciacion = round($depreciacion, 2);
        $mantenimiento = round($mantenimiento, 2);
        foreach ($natindicadores as $value) {
            if ($value['uriconcepto'] == 'Materiasprimasmaterialesfundamentales') {
                $mediosmateriales = $value['importetotal'];
            } elseif ($value['uriconcepto'] == 'EnergíaEléctrica') {
                $energia = $value['importetotal'];
            } elseif ($value['uriconcepto'] == 'Combustibleylubricante') {
                $combustible = $value['importetotal'];
            } elseif ($value['uriconcepto'] == 'Agua') {
                $agua = $value['importetotal'];
            } elseif ($value['uriconcepto'] == 'Salarios') {
                $salario = $value['importetotal'];
            }
        }
        $datetime = new DateTime('now');
        $fecha = $datetime->format('d-m-Y');
        list($dia, $mes, $anno) = split("-", $fecha);


        $excel = "
            <table border=1 cellpadding=0 cellspacing=0 width=766 style='border: 1pt solid black;border-collapse:
                 collapse;table-layout:fixed;width:575pt'>
                 <col width=329>
                 <col width=37 >
                 <col width=80 span=5 style='width:60pt'>
                 <tr height=17 style='height:12.75pt'>
                  <td height=17 colspan=7  width=329 style='height:12.75pt;width:247pt;border-bottom:none'>&nbsp;</td>
                 </tr>
                 <tr height=17 style='height:12.75pt'>
                  <td align=center colspan=7 height=17  width=766 style='height:12.75pt;font-size:16;width:575pt;border-top:none;
                  border-bottom:none'>MODELO - TIPO</td>
                 </tr>
                 <tr height=17 style='height:12.75pt'>
                  <td align=center colspan=7 height=17  width=766 style='height:12.75pt;font-size:16;width:575pt;border-top:none;
                  border-bottom:none'>PARA LA FORMACION O MODIFICACION DE PRECIOS MAYORISTAS POR EL METODO DE GASTOS</td>
                 </tr>
                 <tr height=18 style='height:13.5pt'>
                  <td colspan=7 height=18  style='height:13.5pt;border-top:none;border-bottom: 1pt solid black'>&nbsp;</td>

                 </tr>
                <tr height=17 style='height:12.75pt'>
                  <td height=17 colspan=2  style='height:12.75pt'>A) Empresa:  " . $params['denomentidad'] . "</td>
                  <td  colspan=5>B) Descripci&oacute;n del Producto:  " . $datoscarta[0]['denoindicador'] . "</td>
                 </tr>
                 <tr height=17 style='height:12.75pt'>
                  <td height=17 colspan=2  style='height:12.75pt'>Subordinada a:  " . $piedefirma[0]['empresasubordinada'] . " </td>
                  <td  colspan=5>UM: " . utf8_decode($datoscarta[0]['valorrendimiento'])
                . "  " . $datoscarta[0]['denominacionunidadmedida']
                . " / " . $datoscarta[0]['variablecontrol'] . "</td>
                 </tr>
                 <tr height=17 style='height:12.75pt'>
                  <td colspan=2 height=17  width=366 style='border-right:.5pt solid black;
                  height:12.75pt;width:275pt'>Propuesta de Precio</td>
                  <td  colspan=5 >C&oacute;digo del Producto: " . $datoscarta[0]['codigoind'] . "</td>
                 </tr>
                 <tr height=17 style='height:12.75pt'>
                  <td colspan=2 height=17  width=366 style='border-right:.5pt solid black;
                  height:12.75pt;width:275pt'>Nuevo:<span
                  style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>Modificado: X</td>
                 </tr>
                 <tr height=18 style='height:13.5pt'>
                  <td height=18 colspan=7 style='height:13.5pt'>Volumen de
                  Producci&oacute;n en U.F. (Anual)</td>

                 </tr>
                 <tr align='center' height=17 style='height:12.75pt'>
                  <td rowspan=2 height=34  width=329 style='height:25.5pt;border-top:
                  none;width:247pt'>Conceptos de Gastos</td>
                  <td rowspan=2  width=37 style='border-top:none;width:28pt'>Fila</td>
                  <td rowspan=2  width=80 style='border-top:none;width:60pt'>Costo
                  Base</td>
                  <td colspan=3 width=240 style='border-left:none;width:180pt'>Propuesta
                  Importe</td>
                  <td rowspan=2 width=80 style='border-top:none;width:60pt'>Aprobado</td>
                 </tr>
                 <tr align='center' height=17 style='height:12.75pt'>
                  <td height=17  width=90 style='height:12.75pt;border-top:none;
                  border-left:none;width:90pt'>&nbsp;&nbsp; M.N. &nbsp;&nbsp; </td>
                  <td  width=80 style='border-top:none;border-left:none;width:60pt'>Divisa</td>
                  <td  width=80 style='border-top:none;border-left:none;width:60pt'>Total</td>
                 </tr>
                 <tr height=17 style='height:12.75pt;text-align:center'>
                  <td align=center  style='border-top:none;border-left:none'>A</td>
                  <td align=center  style='border-top:none;border-left:none'>B</td>
                  <td align=center  style='border-top:none;border-left:none'>1</td>
                  <td align=center  style='border-top:none;border-left:none'>2</td>
                  <td align=center  style='border-top:none;border-left:none'>3</td>
                  <td align=center  style='border-top:none;border-left:none'>4</td>
                  <td align=center  style='border-top:none;border-left:none'>6</td>
                 </tr>
                 <tr height=21 style='height:15.75pt'>
                  <td height=21  style='height:15.75pt;border-top:none'><strong>Materias
                  Primas y Materiales</strong></td>
                  <td align=center  style='border-top:none;border-left:none'><strong>1</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=H13</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=SUMA(H14:H17)</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=20 style='height:15.0pt'>
                  <td height=20  style='height:15.0pt;border-top:none'><span
                  style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp;</span>Materias Primas y Materiales Fundamentales</td>
                  <td align=center  style='border-top:none;border-left:none'>1,1</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">=H14-G14</td>
                  <td  style=\"mso-number-format:'0.00';border-top:none;border-left:none\">&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">" . $mediosmateriales . "</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=20 style='height:15.0pt'>
                  <td height=20  style='height:15.0pt;border-top:none'><span
                  style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp;</span>Combustibles y Lubricantes</td>
                  <td align=center  style='border-top:none;border-left:none'>1,2</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">=H15-G15</td>
                  <td  style=\"mso-number-format:'0.00';border-top:none;border-left:none\">&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">" . $combustible . "</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=20 style='height:15.0pt'>
                  <td height=20  style='height:15.0pt;border-top:none'><span
                  style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp;</span>Energ&iacute;a El&eacute;ctrica</td>
                  <td align=center  style='border-top:none;border-left:none'>1,3</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">=H16-G16</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">" . $energia . "</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=20 style='height:15.0pt'>
                  <td height=20  style='height:15.0pt;border-top:none'><span
                  style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp;</span>Agua</td>
                  <td align=center  style='border-top:none;border-left:none'>1,4</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">=H17-G17</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">" . $agua . "</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                </tr> 
                <tr height=21 style='height:15.75pt'>
                  <td height=21  style='height:15.75pt;border-top:none'><strong>Subtotal
                  (Gastos de Elaboraci&oacute;n)</strong></td>
                  <td align=center  style='border-top:none;border-left:none'><strong>2</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=F19+F23+F29+F32+F36+F37+F38</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=H19+H23+H29+H32+H36+H37+H38</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=21 style='height:15.75pt'>
                  <td height=21  style='height:15.75pt;border-top:none'><strong>Otros Gastos
                  Directos</td>
                  <td align=center  style='border-top:none;border-left:none'><strong>3</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=SUMA(F20:F22)</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=SUMA(H20:H22)</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=20 style='height:15.0pt'>
                  <td height=20  style='height:15.0pt;border-top:none'><span
                  style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp;</span>Depreciaci&oacute;n</td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'>3,1</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">=H20-G20</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">" . $depreciacion . "</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=20 style='height:15.0pt'>
                  <td height=20  style='height:15.0pt;border-top:none'><span
                  style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp;</span>Arrendamiento de Equipos</td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'>3,2</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=20 style='height:15.0pt'>
                  <td height=20  style='height:15.0pt;border-top:none'><span
                  style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp;</span>Ropa y Calzado (Trabajadores Directos)</td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'>3,3</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=21 style='height:15.75pt'>
                  <td height=21  style='height:15.75pt;border-top:none'><strong>Gastos de
                  Fuerza de Trabajo</strong></td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'><strong>4</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=SUMA(F24:F28)</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=SUMA(H24:H28)</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=20 style='height:15.0pt'>
                  <td height=20  style='height:15.0pt;border-top:none'><span
                  style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp;</span>Salarios</td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'>4,1</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">=H24-G24</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">" . $salario . "</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=20 style='height:15.0pt'>
                  <td height=20  style='height:15.0pt;border-top:none'><span
                  style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp;</span>Vacaciones</td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'>4,2</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">=H25-G25</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">=H24*0.0909</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=20 style='height:15.0pt'>
                  <td height=20  style='height:15.0pt;border-top:none'><span
                  style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp;</span>Contribuci&oacute;n
                  a la Seguridad Social</td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'>4,3</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">=H26-G26</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">=(H24+H25)*0.125</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=20 style='height:15.0pt'>
                  <td height=20  style='height:15.0pt;border-top:none'><span
                  style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp;</span>Impuesto por
                  la Utilizaci&oacute;n de la Fuerza de Trabajo</td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'>4,4</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=20 style='height:15.0pt'>
                  <td height=20  style='height:15.0pt;border-top:none'><span
                  style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp;</span>Estimulaci&oacute;n Fuerza de Trabajo</td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'>4,5</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=21 style='height:15.75pt'>
                  <td height=21  style='height:15.75pt;border-top:none'><strong>Gastos
                  Indirectos de Producci&oacute;n</strong></td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'><strong>5</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=SUMA(F30:F31)</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=SUMA(H30:H31)</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=20 style='height:15.0pt'>
                  <td height=20  style='height:15.0pt;border-top:none'><span
                  style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp;</span>Mantenimiento y Reparaci&oacute;n</td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'>5,1</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">=H30-G30</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">" . $mantenimiento . "</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=20 style='height:15.0pt'>
                  <td height=20  style='height:15.0pt;border-top:none'><span
                  style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp;</span>Otros</td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'>5,2</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">=H31-G31</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">=(" . $salario . "*0.65)-H30</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=21 style='height:15.75pt'>
                  <td height=21  style='height:15.75pt;border-top:none'><strong>Gastos
                  Generales y de Administraci&oacute;n</strong></td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'><strong>6</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=SUMA(F33:F35)</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=SUMA(H33:H35)</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=20 style='height:15.0pt'>
                  <td height=20  style='height:15.0pt;border-top:none'><span
                  style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp;</span>Materiales</td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'>6,1</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">=H33-G33</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">=(H24-((H24*0.65)+H34))*0.6</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=20 style='height:15.0pt'>
                  <td height=20  style='height:15.0pt;border-top:none'><span
                  style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp;</span>Contribuci&oacute;n
                  a la Seguridad Social (1,5 %)</td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'>6,2</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">=H34-G34</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">=(H24+H25)*0.015</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=20 style='height:15.0pt'>
                  <td height=20  style='height:15.0pt;border-top:none'><span
                  style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp;</span>Otros</td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'>6,3</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">=H35-G35</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\">=(" . $salario . "-(" . $salario . "*0.65))-(H33+H34)</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
               <tr height=21 style='height:15.75pt'>
                  <td height=21  style='height:15.75pt;border-top:none'><strong>Gastos de
                  Distribuci&oacute;n y Venta</strong></td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'><strong>7</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=21 style='height:15.75pt'>
                  <td height=21  style='height:15.75pt;border-top:none'><strong>Gastos
                  Bancarios</strong></td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'><strong>8</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=21 style='height:15.75pt'>
                  <td height=21  style='height:15.75pt;border-top:none'><strong>Seguro
                  Estatal</strong></td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'><strong>9</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=H38-G38</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=(H13+H19+H23+H29+H32+H36)*0.05</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=21 style='height:15.75pt'>
                  <td height=21  style='height:15.75pt;border-top:none'><strong>Gastos
                  Totales</strong></td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'><strong>10</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=F13+F18</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=H13+H18</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=21 style='height:15.75pt'>
                  <td height=21  style='height:15.75pt;border-top:none'><strong>Gasto por
                  Tonelada</strong></td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'><strong>11</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=H39/" . utf8_decode($datoscarta[0]['valorrendimiento']) . "</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=21 style='height:15.75pt'>
                  <td height=21  style='height:15.75pt;border-top:none'><strong>Gasto por
                  Kilogramo</strong></td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'><strong>12</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=H40/1000</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=21 style='height:15.75pt'>
                  <td height=21  style='height:15.75pt;border-top:none'><strong>Gasto por
                  Quintal</strong></td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'><strong>13</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=H40/21.74</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=21 style='height:15.75pt'>
                  <td height=21  style='height:15.75pt;border-top:none'><strong>Margen
                  Utilidad (10 % Gasto Total)</strong></td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'><strong>14</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>0.1</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=21 style='height:15.75pt'>
                  <td height=21  style='height:15.75pt;border-top:none'><strong>Utilidad</strong></td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'><strong>15</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=H39*H43</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=21 style='height:15.75pt'>
                  <td height=21  style='height:15.75pt;border-top:none'><strong>Precio de
                  Empresa por Tonelada</strong></td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'><strong>16</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=(H39+H44)/" . utf8_decode($datoscarta[0]['valorrendimiento']) . "</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=21 style='height:15.75pt'>
                  <td height=21  style='height:15.75pt'><strong>Precio de Empresa por
                  Kilogramo</strong></td>
                  <td align=center  style='mso-number-format:'@';border-left:none'><strong>17</strong></td>
                  <td  style='border-left:none'>&nbsp;</td>
                  <td  style='border-left:none'>&nbsp;</td>
                  <td  style='border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=H45/1000</strong></td>
                  <td  style='border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=21 style='height:15.75pt'>
                  <td height=21  style='height:15.75pt'><strong>Precio de Empresa por
                  Quintal</strong></td>
                  <td align=center  style='mso-number-format:'@';border-left:none'><strong>18</strong></td>
                  <td  style='border-left:none'>&nbsp;</td>
                  <td  style='border-left:none'>&nbsp;</td>
                  <td  style='border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=H45/21.74</strong></td>
                  <td  style='border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=21 style='height:15.75pt'>
                  <td height=21  style='height:15.75pt;border-top:none'><strong>Precio de
                  Empresa Anterior por Tonelada</strong></td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'><strong>19</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>5521.96</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=21 style='height:15.75pt'>
                  <td height=21  style='height:15.75pt;border-top:none'><strong>Precio de
                  Empresa Anterior por Kilogramo</strong></td>
                  <td align=center  style='mso-number-format:'@';border-top:none;border-left:none'><strong>20</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';\"><strong>=H48/1000</strong></td>
                  <td  style='border-top:none;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=22 style='height:16.5pt'>
                  <td height=22 style='height:16.5pt;border-bottom:1.0pt solid black'><strong>Precio de Empresa Anterior
                  por Quintal</strong></td>
                  <td align=center style=\"mso-number-format:'@';border-bottom:1.0pt solid black;border-left:none\"><strong>21</strong></td>
                  <td  style='border-bottom:1.0pt solid black;border-left:none'>&nbsp;</td>
                  <td  style='border-bottom:1.0pt solid black;border-left:none'>&nbsp;</td>
                  <td  style='border-bottom:1.0pt solid black;border-left:none'>&nbsp;</td>
                  <td align=right style=\"mso-number-format:'0.00';border-bottom:1.0pt solid black;\"><strong>254</strong></td>
                  <td style='border-bottom:1.0pt solid black;border-left:none'>&nbsp;</td>
                 </tr>
                 <tr height=17 style='height:12.75pt'>
                  <td colspan=7 height=17 style='height:12.75pt' align=left valign=top>
                  
                   <table border=1 cellpadding=0 cellspacing=0 style='font-weight:200;border-collapse:
                 collapse;table-layout:fixed;'>
                   <tr>
                    <td height=17 width=329 style='height:12.75pt;border-bottom:none;border-left:1pt solid black;
                    width:247pt'>Confeccionado por:</td>
                    <td  style='border-bottom:none' align=center colspan=3 >Firma:</td>
                    <td  style='border-bottom:none' colspan=2 >Cargo:  " . $piedefirma[0]['cargoconf'] . "</td>
                    <td colspan=3 align=center style=\"border-right:1.0pt solid black;
                  width:180pt\">Fecha</td>
                   </tr>
                   <tr height=17 style='height:12.75pt'>
                  <td height=17 style='height:12.75pt;border-top:none;border-left:1pt solid black'> " . $piedefirma[0]['confeccionada'] . "</td>
                   <td style='border-top:none' colspan=3 ></td>
                  <td  style='border-top:none' colspan=2 >Tel&eacute;fono: " . $piedefirma[0]['telefonoconf'] . "</td>
                  <td align=center  width=80 style='border-top:none;width:60pt'>D</td>
                  <td align=center  width=80 style='border-top:none;border-left:none;width:60pt'>M</td>
                  <td align=center  width=80 style='border-right:1.0pt solid black;border-top:none;border-left:none;width:60pt'>A</td>
                 </tr>
                  <tr height=17 style='height:12.75pt'>
                  <td height=17  style='border-bottom:none;height:12.75pt;border-left:1pt solid black'>Aprobado por:</td>
                   <td align=center style='border-bottom:none' colspan=3 >Firma:</td>
                  <td  colspan=2 style='border-bottom:none;border-right:.5pt solid black'>Cargo:  " . $piedefirma[0]['cargoaprob'] . "</td>
                  <td rowspan=2 width=80 style='border-bottom:1.0pt solid black;
                  border-top:none;width:60pt'>" . $dia . "</td>
                  <td rowspan=2 width=80 style='border-bottom:1.0pt solid black;
                  border-top:none;width:60pt'>" . $mes . "</td>
                  <td rowspan=2 width=80 style='border-right:1.0pt solid black;border-bottom:1.0pt solid black;
                  border-top:none;border-right:1pt solid black;width:60pt'>" . $anno . "</td>
                 </tr>
                 <tr height=18 style='height:13.5pt'>
                  <td height=18 style='border-bottom:1.0pt solid black;border-top:none;height:13.5pt'> " . $piedefirma[0]['aprobada'] . "</td>
                   <td style='border-top:none;border-bottom:1.0pt solid black' colspan=3 ></td>
                  
                  <td colspan=2 style=\"border-top:none;border-bottom:1.0pt solid black\">Tel&eacute;fono:  " . $piedefirma[0]['telefonoaprob'] . "</td>
                 </tr>
                 </table>
                  </span></td>
                  
                  
                 </tr>
                 </table>";

//Seleccionar el tipo de formato al exportar
        if ($params['exportarfichapdf'] == 1) {
            $obj = new GenerarPdfFichaCosto($params, $datoscarta, $piedefirma, $mediosmateriales, $energia, $combustible, $agua, $depreciacion, $salario, $mantenimiento, $dia, $mes, $anno);
            $obj->export();
        } else {
            $filename = $datoscarta[0]['denominacion'];
            $filename = strtolower($filename);


            //Reemplazamos caracteres especiales latinos
            $find = array('á', 'é', 'í', 'ó', 'ú', 'â', 'ê', 'î', 'ô', 'û', 'ü', 'ã', 'õ', 'ç', 'ñ');
            $repl = array('a', 'e', 'i', 'o', 'u', 'a', 'e', 'i', 'o', 'u', 'u', 'a', 'o', 'c', 'n');
            $filename = str_replace($find, $repl, $filename);

            //Añadimos los guiones
            $find = array(' ', '&amp;', '\r\n', '\n', '+');
            $filename = str_replace($find, '-', $filename);


            //Eliminamos y Reemplazamos los demas caracteres especiales
            $find = array('/[^a-z0-9\-&lt;&gt;]/', '/[\-]+/', '/&lt;{^&gt;*&gt;/');
            $repl = array('', '-', '');
            $filename = preg_replace($find, $repl, $filename);
            $filename = strtoupper($filename);

            header("Pragma: public");
            header("Expires: " . date("D:M:Y"));
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header("Content-Type: application/force-download");
            header("Content-Type: application/octet-stream");
            header("Content-Type: application/download");
            header("Content-Disposition: attachment;filename=FichaCosto_(" . $filename . ").xls");
            header("Content-Transfer-Encoding: binary ");

            echo $excel;
        }
    }

    private function datosCartaFichaCosto($params) {
        $conn = Doctrine_Manager::connection();
        $query = "
SELECT ct.idcartatecnologica,
       ct.denominacion,
       cartaent.identidad,
       ct.idusuario,
       ct.fecha,
       ct.idindicador,
       ct.idmodelo,
       ind.denominacion AS denoindicador,
       ind.codigo AS codigoind,
       ct.valorrendimiento,
       ct.idumedidarendimiento,
       vc.denominacion AS variablecontrol,
       um.denominacionunidadmedida
FROM mod_spouam.dat_cartatecnologica ct
     INNER JOIN mod_datosmaestros.nom_indicador ind ON (ind.idindicador =
       ct.idindicador)
     INNER JOIN mod_spouam.dat_cartatecnologicaentidad cartaent ON (
       cartaent.idcartatecnologica = ct.idcartatecnologica)
     INNER JOIN mod_spouam.dat_variablecontrol vc ON (vc.idvariablecontrol =
       ct.idvariablecontrol)
     INNER JOIN mod_datosmaestros.nom_unidadmedida um ON (um.idunidadmedida=ct.idumedidarendimiento)
WHERE ct.idcartatecnologica =  {$params['idcartatecnologica']} AND
         cartaent.identidad =  {$params['identidad']}
         ";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function validarActividades($data) {
        $diacero = 0;
        foreach ($data as $value) {
            /* if ($value['duracion'] == 0) {
              return 0;
              } */
            if ($value['diacero'] == 1) {
                $diacero = 1;
                return $diacero;
            }
        }
        return $diacero;
    }

    public function updateEnUso($cartaTec, $uso) {

        $conn = Doctrine_Manager::connection();

        try {
            $sqlEnUso = "UPDATE mod_spouam.dat_cartatecnologica SET  enuso=? WHERE idcartatecnologica = ?";

            $cartaEnUso = $conn->execute($sqlEnUso, array($uso, $cartaTec));
        } catch (Exception $e) {
            return $e;
        }
    }

    private function auxrelacionarCTEntidadesHijas($integrator, $value) {

        $idcarta = $value->idcarta;
        $identidad = $value->identidad;
        $idvariablecontrol = $value->idvariablecontrol;
        $idmodelo = $value->idmodelo;

//eliminar todas las asociaciones con estructuras que no sea la creadora de la carta
        DatCartatecnologicaentidad::eliminarRelacionCartaTecnoEntidad($idcarta, $identidad);
//obtengo las entidades hijas de la estructura que creo la carta tecnológica
        $entidadesHijas = DatActividadentidad::auxObtenerEntidadesHijasComun($identidad);
//listo las actividades de la carta tecnologica
        $result = DatCartatecnologica::listarIDActividades($idcarta);
//obtengo el numero de actividades
        $cantActCT = count($result);
//obteniendo cadena de idsactividades
        $idactividadesCT = $result[0]['idactividad'];
        foreach ($result as $k => $v) {
            if ($k != 0)
                $idactividadesCT = $idactividadesCT . "," . $v['idactividad'];
        }

        $entidadesValidadasAct = "";
        $cont = 0;

        // print_r($entidadesHijas);die;
        foreach ($entidadesHijas as $key => $hija) {
            if ($hija != $identidad) {
                $datosHija = $integrator->metadatos->DameEstructura($hija);
//obtengo la especialidad de la entidad hija
                $idEspecialidadHija = $datosHija [0]->idespecialidad;

//cantidad de entidades hijas relacionadas con el modelo del plan
                $objEntidadModelo = Doctrine::getTable('DatEntidadmodelo')->findByDql("identidad={$hija} and idmodelo={$idmodelo}");

                if (isset($objEntidadModelo[0]->identidadmodelo) && $objEntidadModelo[0]->identidadmodelo != null) {
//cantidad de  actividades de la carta teconologica con que se relaciona la entidad hija
                    if (!empty($idEspecialidadHija)) {
                        $data = DatCartatecnologica::asociarCTEntHija($idactividadesCT, $idEspecialidadHija);
                        $cantActRel = $data[0]['cant'];

                        if ($cantActCT == $cantActRel) {
                            if ($cont == 0)
                                $entidadesValidadasAct = $entidadesValidadasAct . $entidadesHijas[$key];
                            else
                                $entidadesValidadasAct = $entidadesValidadasAct . "," . $entidadesHijas[$key];
                            $cont++;
                        }
                    }
                }
            }
        }

//validar relacion variables de control entidades				
        if ($entidadesValidadasAct != "") {
            $entidadesAsociar = DatVariablecontrolentidad::relacionEntidadesVariableControl($idvariablecontrol, $entidadesValidadasAct);
            if (!$entidadesAsociar[0]) {
                return 0;
            } else
                foreach ($entidadesAsociar as $validas) {
//insertar en la relacion carta tecnologica actividad
                    DatCartatecnologicaentidad::adicionarCartaTecnoEntidad($idcarta, $validas);
                }
            return 1;
        } else {
            return 0;
        }
    }

//*************************************************************

    public function listarCartas($params, $x) {
        $x->select(
                "ct.idcartatecnologica,
                             ct.denominacion,
                            ct.identidadcrea as idestructura,
                            ct.idusuario,                            
                            ct.fecha,
                            ct.idindicador,
                            ct.idmodelo,
                            ind.denominacion as denoindicador,
                            ind.codigo as codigoind,
                            ct.idaprobacion,
                            ct.estado,
                            ct.valorrendimiento,
                            ct.idumedidarendimiento,
                            vc.denominacion as variablecontrol,
                            vc.idvariablecontrol,
                            ct.enuso"
        );
        if ($params['produccion']) {
            $x->select("cartaent.idcartatecnologicaentidad");
            $x->where('ct.idaprobacion', 4);
            $x->where('ct.estado', 1);
        }
        $x->join(
                'mod_spouam.dat_cartatecnologica ct', 'ct.idcartatecnologica = meta.idcartatecnologica'
        );
        $x->join(
                'mod_spouam.dat_variablecontrol vc', 'vc.idvariablecontrol = ct.idvariablecontrol'
        );
        $x->join(
                'mod_datosmaestros.nom_indicador ind', 'ind.idindicador = ct.idindicador'
        );
        $x->join(
                'mod_spouam.dat_cartatecnologicaentidad cartaent', 'cartaent.idcartatecnologica = ct.idcartatecnologica'
        );

        if ($params['global'] == 'false') {
            $x->where('ct.identidadcrea', $params['identidad']);
        }
        $x->where_in('cartaent.identidad', $params['identidades']);

        if ($params['limit']) {
            $x->offset($params['start']);
            $x->limit($params['limit']);
        }
        if ($params['global'] == 'true') {
//construyendo el group by
            $cadena = '';
            foreach ($x->ar_select as $key => $value) {
                $alias = explode(" as ", $value);
                $cadena = $cadena . $alias[0] . ',';
            }
//eliminando la ultima coma de la cadena
            $groupBy = rtrim($cadena, ',');
            $x->groupby($groupBy);
        }
        $x->orderby('ct.denominacion');
        $query = $x->get()->result_array();
        return $query;
    }

    public function listarTotalCartas($params, $x) {
        $x->select(
                "ct.idcartatecnologica"
        );
        $x->join(
                'mod_spouam.dat_cartatecnologica ct', 'ct.idcartatecnologica = meta.idcartatecnologica'
        );
        $x->join(
                'mod_spouam.dat_variablecontrol vc', 'vc.idvariablecontrol = ct.idvariablecontrol'
        );
        $x->join(
                'mod_datosmaestros.nom_indicador ind', 'ind.idindicador = ct.idindicador'
        );
        $x->join(
                'mod_spouam.dat_cartatecnologicaentidad cartaent', 'cartaent.idcartatecnologica = ct.idcartatecnologica'
        );
        if ($params['produccion']) {
            $x->where('ct.idaprobacion', 4);
            $x->where('ct.estado', 1);
        }
        if ($params['global'] == 'false')
            $x->where('ct.identidadcrea', $params['identidad']);

        $x->where_in('cartaent.identidad', $params['identidades']);
        if ($params['global'] == 'true') {
//construyendo el group by
            $cadena = '';
            foreach ($x->ar_select as $key => $value) {
                $alias = explode(" as ", $value);
                $cadena = $cadena . $alias[0] . ',';
            }
//eliminando la ultima coma de la cadena
            $groupBy = rtrim($cadena, ',');
            $x->groupby($groupBy);
        }
        $query = $x->get()->result_array();
        return count($query);
    }

    public function ordenarFiltros($filtros, $x) {
        $parametrosDinamicosAFiltrar = array();
        if ($filtros[0]) {
            foreach ($filtros as $p => $datos) {
                if ($datos['field'] == 'denominacion') {
                    $temp = mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8');
                    $x->where("upper(ct.denominacion) LIKE '%" . $temp . "%'");
                } else if ($datos['field'] == 'idestructura') {
                    $x->where('ct.identidadcrea =', $datos['data']['value']);
                } elseif ($datos['field'] == 'fecha') {

                    $fecha = explode('/', $datos['data']['value']);
                    $fecha = $fecha[1] . '/' . $fecha[0] . '/' . $fecha[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $x->where('date(ct.fecha) <', $fecha);
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $x->where('date(ct.fecha) >', $fecha);
                        } else {
                            $x->where('date(ct.fecha) =', $fecha);
                        }
                    }
                } else if ($datos['field'] == 'denoindicador') {
                    $temp = mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8');
                    $x->where("upper(ind.denominacion) LIKE '%" . $temp . "%'");
                } else if ($datos['field'] == 'idaprobacion') {
                    if ($datos['data']['value'] == 'Aprobado rector') {
                        $x->where('ct.idaprobacion =', 4);
                    } else if ($datos['data']['value'] == 'Aprobado') {
                        $x->where('ct.idaprobacion =', 3);
                    } else {
                        $x->where('ct.idaprobacion =', 1);
                    }
                } else if ($datos['field'] == 'enuso' || $datos['field'] == 'estado') {
                    if ($datos['data']['value'] == 'Sí' || $datos['data']['value'] == 'Si') {
                        $x->where('ct.' . $datos['field'], 1);
                    } else {
                        $x->where('ct.' . $datos['field'], 0);
                    }
                } else if ($datos['field'] == 'valorrendimiento') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $x->where('ct.valorrendimiento <', $datos['data']['value']);
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $x->where('ct.valorrendimiento >', $datos['data']['value']);
                        } else {
                            $x->where('ct.valorrendimiento =', $datos['data']['value']);
                        }
                    }
                } else if ($datos['field'] == 'idusuario') {
                    $x->where('ct.idusuario', $datos['data']['value']);
                } else if ($datos['field'] == 'idumedidarendimiento') {
                    $x->where('ct.idumedidarendimiento', $datos['data']['value']);
                } else if ($datos['field'] == 'idvariablecontrol') {
                    $x->where('vc.idvariablecontrol', $datos['data']['value']);
                } else if ($datos['field'] == 'idmodelo') {
                    $x->where('ct.idmodelo', $datos['data']['value']);
                } else {

                    foreach ($x->ar_select as $field) {
                        $pos = strripos($field, ' as ');
                        $inicio = $pos + 4;

                        $lenght = (strlen($field)) - ($pos + 4);
                        $cadena = substr($field, $inicio, $lenght);

                        if ($datos['field'] == $cadena) {
                            $pos = strripos($cadena, '_');
                            $denomCampo = substr($cadena, $pos + 1, (strlen($cadena)) - ($pos + 1));
                            break;
                        }
                    }
                    if ($datos['field']) {
                        $pos = strripos($datos['field'], '_');
                        $denomCampo = substr(
                                $datos['field'], $pos + 1, (strlen($datos['field'])) - ($pos + 1)
                        );
                        if ($datos['data']['type'] == 'string') {
//es un nomenclador
                            if (is_numeric($datos['data']['value']))
                                $x->where("meta." . $denomCampo, $datos['data']['value']);
                            else {
//es una cadena
                                $temp = mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8');
                                $x->where("upper(meta. $denomCampo) LIKE '%" . $temp . "%'");
                            }
                        } else {
//es un numero
                            if ($datos['data']['type'] == 'numeric') {
                                if ($datos['data']['comparison'] == "gt") {
                                    $x->where("meta." . $denomCampo . ' >', $datos['data']['value']);
                                } elseif ($datos['data']['comparison'] == "lt") {
                                    $x->where("meta." . $denomCampo . ' <', $datos['data']['value']);
                                } else {
                                    $x->where("meta." . $denomCampo . ' =', $datos['data']['value']);
                                }
                            } else {
//es una fecha
                                if ($datos['data']['type'] == 'date') {

                                    $fecha = explode('/', $datos['data']['value']);
                                    $fecha = $fecha[1] . '/' . $fecha[0] . '/' . $fecha[2];
                                    if ($datos['data']['comparison'] == "gt") {
                                        $x->where("meta." . $denomCampo . ' >', $fecha);
                                    } elseif ($datos['data']['comparison'] == "lt") {
                                        $x->where("meta." . $denomCampo . ' <', $fecha);
                                    } else {
                                        $x->where("meta." . $denomCampo . ' =', $fecha);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return $x;
    }

    public function actualizarEnUso() {
        $cartas = DatAplicacioncartatec::listarCartasEnProduccion();

        $idcartatecnologica_array = array();
        foreach ($cartas as $carta) {
            $idcartatecnologica_array[] = $carta;
        }

        $idcartatecnologica_lista = implode(',', $idcartatecnologica_array);
        DatCartatecnologica::actualizarEnUso($idcartatecnologica_lista);
    }

    public function exportar($params, $x, $cmd) {
//Ajustando los parámetros de los filtros al formato 'listar'
        $nuevos_filtros = [];
        foreach ($params['filtros'] as $filtro) {
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
        $params['filtros'] = $nuevos_filtros;
        if ($params['filtros'][0]) {
            $x = CartaTecnologicaModel::ordenarFiltros($params['filtros'], $x);
        }
//Fin de los filtros
        $cartasTecno = CartaTecnologicaModel::listarCartas($params, $x);

//obteniendo los modelos
        $modelos = DatModelo::devolverModelos();
        $denomModelos = array();
        foreach ($modelos as $value) {
            $denomModelos[$value['idmodelo']] = $value['denominacion'];
        }
        unset($modelos);

//obteniendo las denominaciones de las estructuras
        $denomentidad = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad'], true);
        foreach ($denomentidad as $k => $valor) {
            unset($denomentidad[$k]);
            $denomentidad [$valor['idestructura']] = $valor['denominacion'];
        }

//trabajo con columnas dinamicas
        $scm = array();
        for ($index = 0; $index < count($cmd['cm']); $index++) {
            $scm[$index]['dataIndex'] = $cmd['cm'][$index]['dataIndex'];
            $scm[$index]['nomcol'] = $cmd['cm'][$index]['header'];
            $scm[$index]['nomval'] = $cmd['cm'][$index]['edit']['displayField'];
        }
//html para el excel
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        if ($params['tipo'] == 'cart')
            header("Content-Disposition: attachment;filename=CartasTecnologicas.xls");
        else
            header("Content-Disposition: attachment;filename=ActividadesCartasTecnologicas.xls");
        header("Content-Transfer-Encoding: binary ");

        $primeraparte = " <table border=1 cellspacing=0 width=60%>";
        if ($params['tipo'] == 'cart') {
            $collValue = 12 + count($scm);
            $primeraparte = $primeraparte . " <tr><th align=left colspan=$collValue>Cartas tecnol&oacute;gicas</th></tr>";
        } else {
            $collValue = 17 + count($scm);
            $primeraparte = $primeraparte . "<tr><th align=left colspan=$collValue>Cartas tecnol&oacute;gicas y actividades</th></tr>";
        }

        $primeraparte = $primeraparte . " <tr><th align = left colspan = $collValue>Entidad: " . utf8_decode($params['entidad']) . " </th></tr>
        <tr><th align = left colspan = $collValue>Ejercicio actual : " . $params['denoejercicio'] . " </th></tr>
        <tr><th align = left colspan = $collValue>Tipo de modelo : " . utf8_decode($params['denominaciontipomodelo']) . " </th></tr>

        <tr><td align = left colspan = $collValue> </td></tr>
        <tr align = left colspan = $collValue>
        <th align = left > Denominaci&oacute;n</th>
        <th align = left>Entidad</th>
        <th align = left>C&oacute;digo indicador</th>
        <th align = left>Producto</th>
        <th align = left>Plan</th>
        <th align = left>Aprobado</th>
        <th align = left>Activado</th>
        <th align = left>Uso</th>
        <th align = left>Rendimiento</th>
        <th align = left>UM</th>
        <th align = left>Variable de control</th>";
        foreach ($scm as $value) {
            $primeraparte .= '<th align=left>' . utf8_decode($value['nomcol']) . '</th>';
        }
        if ($params['tipo'] == 'cart')
            $primeraparte .= '<th align = left>Importe</th> </tr>';
        else {
            $primeraparte .= "<th align = left > C&oacute;digo de la actividad</th>
        <th align = left>Actividades o servicios</th>
        <th align = left>Plazo de inicio</th>
        <th align = left>Etapa</th>
        <th align = left>Porciento</th>
        <th align = left>Importe</th>";
        }
        echo $primeraparte;
        foreach ($cartasTecno as $carta) {
            self::pintarDatosCarta($carta, $denomentidad, $denomModelos, $params, $scm);
            if ($params['tipo'] == 'cart') {
                $impCarta = DatCartatecnologica::obtenerCartasxEntidadEnEjercicio($params, $carta['idcartatecnologica']);
                echo "<td align=right style=\"mso-number-format:'0.00';\">" . $impCarta[0]['importecarta'] . "</td>";
            } else {
                $params['cartatecnologica']->idcartatecnologica = $carta['idcartatecnologica'];
                $actsCarta = $this->obtenerActxCarta($params);
                foreach ($actsCarta as $p => $actCarta) {
                    if ($p != 0) {
                        self::pintarDatosCarta($carta, $denomentidad, $denomModelos, $params, $scm);
                    }
                    echo "<td align = left style = \"mso-number-format:'@';\">" . $actCarta['codigo'] . "</td>";
                    echo "<td align=left style=\"mso-number-format:'@';\">" . utf8_decode($actCarta['denominacion']) . "</td>";
                    echo "<td align=right style=\"mso-number-format:'0';\">" . $actCarta['plazo'] . "</td>";
                    echo "<td align=left style=\"mso-number-format:'@';\">" . utf8_decode($actCarta['etapa']) . "</td>";
                    echo "<td align=right style=\"mso-number-format:'0.00';\">" . $actCarta['porciento'] . "</td>";
                    echo "<td align=right style=\"mso-number-format:'0.00';\">" . $actCarta['importe'] . "</td>";
                }
            }
        }
        echo "</table>";
    }

    public function pintarDatosCarta($carta, $denomentidad, $denomModelos, $params, $scm) {
        echo "<tr><td align=left style=\"mso-number-format:'@';\">" . utf8_decode($carta['denominacion']) . "</td>";
        echo "<td align=left style=\"mso-number-format:'@';\">" . $denomentidad[$carta['idestructura']] . "</td>";
        echo "<td align=left style=\"mso-number-format:'@';\">" . $carta['codigoind'] . "</td>";
        echo "<td align=left style=\"mso-number-format:'@';\">" . utf8_decode($carta['denoindicador']) . "</td>";
        echo "<td align=left style=\"mso-number-format:'@';\">" . utf8_decode($denomModelos[$carta['idmodelo']]) . "</td>";
        if ($carta['idaprobacion'] == 4) {
            $aprobacion = "Aprobado rector";
        } else if ($carta['idaprobacion'] == 3) {
            $aprobacion = "Aprobado especialista";
        } else {
            $aprobacion = "Desaprobado";
        }
        echo "<td align=left style=\"mso-number-format:'@';\">" . $aprobacion . "</td>";
        if ($carta['estado'] == 1) {
            $activacion = "Activado";
        } else {
            $activacion = "Desactivado";
        }
        echo "<td align=left style=\"mso-number-format:'@';\">" . $activacion . "</td>";
        if ($carta['enuso'] == 1) {
            $uso = "S&iacute;";
        } else {
            $uso = "No";
        }
        echo "<td align=left style=\"mso-number-format:'@';\">" . $uso . "</td>";
        echo "<td align=right style=\"mso-number-format:'0.00';\">" . $carta['valorrendimiento'] . "</td>";
        $umedidarendimiento = $params['integrator']->datosmaestros->obtenerUnidadMedidaDadoId($carta['idumedidarendimiento']);
        echo "<td align=left style=\"mso-number-format:'@';\">" . utf8_decode($umedidarendimiento[0]['denominacionunidadmedida']) . "</td>";
        echo "<td align=left style=\"mso-number-format:'@';\">" . utf8_decode($carta['variablecontrol']) . "</td>";
        foreach ($scm as $value) {
            echo "<td align=left style=\"mso-number-format:'@';\">" . utf8_decode($carta[$value['nomval']]) . "</td>";
        }
    }

    public function exportarCartaConActividadesOIndicadores($params, $cmd) {
        $um = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(Array($params['cartatecnologica']->idumedidarendimiento));
        $modelo = Doctrine::getTable('DatModelo')->findByDql("idmodelo={$params['cartatecnologica']->idmodelo}");
        $variablecontrol = Doctrine::getTable('DatVariablecontrol')->findByDql("idvariablecontrol={$params['cartatecnologica']->idvariablecontrol}");

        if ($params['tipo'] == 'ind') {
            $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
            $params['unidadesmedida'] = array();
            foreach ($unidades as $unidad) {
                $params['unidadesmedida'][$unidad['idunidadmedida']] = $unidad['denominacionunidadmedida'];
            }
            unset($unidades);

            $naturalezas = DatBasescalculoModel::obtenerNaturalezas();
            $params['naturaleza'] = array();
            foreach ($naturalezas as $naturaleza) {
                $params['naturaleza'][$naturaleza['naturaleza']] = $naturaleza['denominacion'];
            }
            unset($naturalezas);
            $data = $this->obtenerIndxCarta($params);
        } else {
            $data = $this->obtenerActxCarta($params);
        }
//html para el excel
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        if ($params['tipo'] == 'ind')
            header("Content-Disposition: attachment;filename=IndicadoresCartaTecnologica.xls");
        else
            header("Content-Disposition: attachment;filename=ActividadesCartaTecnologica.xls");
        header("Content-Transfer-Encoding: binary ");

        $primeraparte = " <table border=1 cellspacing=0 width=60%>";
        if ($params['tipo'] == 'ind') {
            $collValue = 7;
            $collValueEnc = 3;
            $primeraparte = $primeraparte . " <tr><th align=left colspan=$collValue>Indicadores de la carta tecnológica</th></tr>";
        } else {
            $collValue = 6;
            $collValueEnc = 2;
            $primeraparte = $primeraparte . "<tr><th align=left colspan=$collValue>Actividades de la carta tecnológica</th></tr>";
        }

        $primeraparte = $primeraparte . " <tr><th align = left colspan = $collValue>Entidad: " . $params['entidad'] . " </th></tr>
        <tr><th align = left colspan = $collValue>Ejercicio actual : " . $params['denoejercicio'] . " </th></tr>
        <tr></tr>
        <tr><th align = left colspan = $collValue>Tipo de carta: " . $params['denominaciontipomodelo'] . " </th></tr>
        <tr align = left colspan = $collValue>
        <th align = left colspan = '2'>Carta: " . $params['cartatecnologica']->denominacion . " </th>
        <th align = left colspan = '2'>Producto: " . $params['cartatecnologica']->denoindicador . " </th>
        <th align = left colspan = $collValueEnc>Rendimiento: " . $params['cartatecnologica']->valorrendimiento . " </th>
        </tr>

        <tr align = left colspan = $collValue>
        <th align = left colspan = '2'>Plan: " . $modelo[0]->denominacion . " </th>
        <th align = left colspan = '2'>UM: " . $um[0] ['denominacionunidadmedida'] . " </th>
        <th align = left colspan = $collValueEnc>Variable de control: " . $variablecontrol[0]->denominacion . " </th></tr>";
//trabajo con columnas dinamicas
        $dinPorFila = (int) ($collValue / 2);
        $p = 0;
        $contador = count($cmd['cm']);
        for ($index = 0; $index < $contador; $index++) {
            $valordtn = $cmd['cm'][$index]['edit']['hiddenName'];
            $datNom = NomDatosnomenclador::ObtenerDatosDadoArrayIdDatosNom(array($params['cartatecnologica']->$valordtn));
            if ($index == 0 || $p == $dinPorFila) {
                if ($p == $dinPorFila) {
                    $primeraparte = $primeraparte . "</tr>";
                }
                $primeraparte = $primeraparte . "<tr><th align = left colspan = 2>" . $cmd['cm'][$index]['header'] . ": " . $datNom[0]['denominacion'] . "</th>";
                $p = 1;
            } else {
                $p++;
                if ($p == $dinPorFila) {
                    $collSobra = 2 + ($collValue - ($dinPorFila * 2));
                    $primeraparte = $primeraparte . "<th align = left colspan = $collSobra>" . $cmd['cm'][$index]['header'] . ": " . $datNom[0]['denominacion'] . "</th>";
                } else
                    $primeraparte = $primeraparte . "<th align = left colspan = 2>" . $cmd['cm'][$index]['header'] . ": " . $datNom[0]['denominacion'] . "</th>";
            }
        }


        $primeraparte = $primeraparte . "<tr><td align = left colspan = $collValue> </td></tr>
        <tr align = left colspan = $collValue>
        <th align = left > Código</th>";
        if ($params['tipo'] == 'act') {
            $primeraparte = $primeraparte . "<th align = left>Actividades o servicios</th>
        <th align = left>Plazo de inicio</th>
        <th align = left>Etapa</th>
        <th align = left>Porciento</th>";
        } else {
            $primeraparte = $primeraparte . "<th align = left>Denominación</th>
        <th align = left>Unidad de medida</th>
        <th align = left>Naturaleza</th>
        <th align = left>Precio</th>
        <th align = left>Cantidad</th>";
        }
        $primeraparte = $primeraparte . "<th align = left>Importe</th>
        </tr>";

        echo $primeraparte;
        $totalImporte = 0;
        foreach ($data as $i) {
            $totalImporte += $i['importe'];
            echo "<tr><td align = left style = \"mso-number-format:'@';\">" . $i['codigo'] . "</td>";
            echo "<td align=left style=\"mso-number-format:'@';\">" . $i['denominacion'] . "</td>";
            if ($params['tipo'] == 'act') {
                echo "<td align=right style=\"mso-number-format:'0';\">" . $i['plazo'] . "</td>";
                echo "<td align=left style=\"mso-number-format:'@';\">" . $i['etapa'] . "</td>";
                echo "<td align=right style=\"mso-number-format:'0.00';\">" . $i['porciento'] . "</td>";
            } else {
                echo "<td align=left style=\"mso-number-format:'@';\">" . $params['unidadesmedida'][$i['idumedida']] . "</td>";
                echo "<td align=left style=\"mso-number-format:'@';\">" . $params['naturaleza'][$i['idnaturaleza']] . "</td>";
                echo "<td align=right style=\"mso-number-format:'0.00';\">" . $i['precio'] . "</td>";
                echo "<td align=right style=\"mso-number-format:'0.00';\">" . $i['cantidad'] . "</td>";
            }
            echo "<td align=right style=\"mso-number-format:'0.00';\">" . $i['importe'] . "</td></tr>";
        }
        echo "<tr></tr>";
        $collValue = $collValue - 1;
        echo "<tr><th align=right colspan=$collValue style=\"mso-number-format:'@';\">Importe total: </th>";
        echo "<th align=right style=\"mso-number-format:'0.00';\">" . $totalImporte . "</th></tr>";
        echo "</table>";
    }

    public function obtenerActxCarta($params) {
        $obj = new DatCartatecnologica();
        $data = $obj->obtenerActxCarta($params);
        return $data;
    }

    public function obtenerIndxCarta($params) {
        $obj = new DatCartatecnologica();
        $data = $obj->obtenerIndxCarta($params);
        return $data;
    }

    public function listarEquiposAsocACarta($params) {
        $obj = new DatCartatecnologica();
        $data = $obj->listarEquiposAsocACarta($params);
        return $data;
    }

    public function TotalesDepACarta($params) {
        $obj = new DatCartatecnologica();
        $data = $obj->TotalesDepACarta($params);
        return $data;
    }

    public function listarEquipos($params) {
        $obj = new DatDepreciacionequipo();
        $data = $obj->listarDepreciaciones($params);
        return $data;
    }

    public function asociarEqACarta($params) {
        try {
            /**
             * Para adicionar estos dos valores hay que realizar un calculo todavia no esta definido
             * gastosmantenimiento
             * depreciasionperiodo
             */
            foreach ($params['equipos'] as $value) {
                $obj = new DatEquipoCarta();
                $obj->idcartatecnologica = $params['idcartatecnologica'];
                $obj->iddepreciacionequipo = $value;
                $obj->idusuario = $params['idusuario'];
                $obj->save();
            }
            return 1;
        } catch (Exception $exc) {
            return $exc->getMessage();
        }
    }

    public function eliminarEquipoAsoc($params) {
        try {
            $obj = new DatEquipoCarta();
            foreach ($params['equipos'] as $value) {
                $obj->Eliminar($value);
            }
            return 1;
        } catch (Exception $exc) {
            return $exc->getMessage();
        }
    }

    public function buscardenominacion($params) {
        $res = DatCartatecnologica::buscardenominacion($params);
        if ($res[0]) {
            return 25;
        }
        return 24;
    }

}
