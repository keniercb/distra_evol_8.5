<?php

class DatCartatecnologicaModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

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

    public function adicionarCartaTec($params) {

        $objCT = new DatCartatecnologica();
        $objCT->denominacion = $params['denominacion'];
        $objCT->valorrendimiento = $params['rendimiento'];
        $objCT->idumedidarendimiento = $params['idumedidarendimiento'];
        $objCT->idvariablecontrol = $params['idvariable'];
        $objCT->identidadcrea = $params['identidadcrea'];
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

        $objCT = Doctrine::getTable('DatCartatecnologica')->find($params['idcartatecnologica']);
        $variable_old = $objCT->idvariablecontrol;
        $objCT->denominacion = $params['denominacion'];
        //$objCT->fecha = date("d/m/Y");
        $objCT->valorrendimiento = $params['rendimiento'];
        $objCT->idumedidarendimiento = $params['idumedidarendimiento'];
        $objCT->idvariablecontrol = $params['idvariable'];
        $objCT->idindicador = $params['idindicador'];
        $objCT->idmodelo = $params['idmodelo'];
        $dm = Doctrine_Manager::getInstance();
        $con = $dm->getCurrentConnection();
        $objCT->save();
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
        $objCT->save();

        $param->idcartatecnologica = $objCT->idcartatecnologica;
        //$param->identidadcrea = $params['identidadcrea'];
        $param->identidadcrea = $params['identidad'];
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
            $objCTAct->save();
        }
        return '24';
    }

    public function eliminarCartasTecnologicas($cartastecnologicas, $variables, $idusuario) {
        $query = Doctrine_Query::create();
        $query->delete('DatCartatecnologica')
                ->from('DatCartatecnologica')
                ->addWhere('enuso = 0')
                ->addWhere('estado = 0')
                ->addWhere('idaprobacion = 1')
                ->addWhere('idusuario = ?', $idusuario)
                ->whereIn('idcartatecnologica', $cartastecnologicas)->execute();
        try {
            foreach ($variables as $value) {
                $enUsovar = DatVariablecontrol::variableEnUso($value);
                if (count($enUsovar) == 0) {
                    DatVariablecontrol::actualizarVariableEnUso($value, 0);
                } else {
                    DatVariablecontrol::actualizarVariableEnUso($value, 1);
                }
            }
            return 1;
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
                        DatCartatecnologicaModel::auxrelacionarCTEntidadesHijas($integrator, $value);
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

    public function validarActividades($data) {
        $diacero = 0;
        foreach ($data as $value) {
            /*if ($value['duracion'] == 0) {
                return 0;
            }*/
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

    public function auxrelacionarCTEntidadesHijas($integrator, $value) {

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

        foreach ($entidadesHijas as $key => $hija) {

            if ($hija != $identidad) {

                $datosHija = $integrator->metadatos->DameEstructura($hija);
                //obtengo la especialidad de la entidad hija
                $idEspecialidadHija = $datosHija [0]->idespecialidad;

                //cantidad de entidades hijas relacionadas con el modelo del plan
                $objEntidadModelo = Doctrine::getTable('DatEntidadmodelo')->findByDql("identidad={$hija} and idmodelo={$idmodelo}");
                if ($objEntidadModelo[0]->identidadmodelo != null) {
                    //cantidad de  actividades de la carta teconologica con que se relaciona la entidad hija
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

}
