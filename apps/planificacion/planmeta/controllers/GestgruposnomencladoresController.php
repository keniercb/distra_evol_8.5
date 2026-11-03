<?php

/**
 * Gestgruposnomencladores
 * Controlador para gestionar los nomencladores
 *
 * @ author Dionisdel Ponce Santana
 * @ package Planificación
 * @ subpackage Planificación
 * @ copyright UCID-ERP Cuba
 * @ version 2.x
 * */
class GestgruposnomencladoresController extends ZendExt_Controller_Secure {

    /**
     * funcion init()
     * Para inicializar el modulo
     *
     * @author Dionisdel Ponce Santana
     * */
    function init() {
        parent::init();
    }

    /**
     * funcion gestgruposnomencladores()
     * Para renderizar la vista
     *
     * @author Dionisdel Ponce Santana
     * */
    public function gestgruposnomencladoresAction() {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    /**
     * funcion listarNomencladoresTree()
     * Para renderizar la vista
     *
     * @author Dionisdel Ponce Santana
     * */
    public function listarTiposNomencladoresTreeAction() {
        $dat = NomNomencladoresModel::getXMLNomencladores();
        echo json_encode($dat);
    }

    /**
     * Permite insertar tipos de nomencladores y los datos de estos
     * dependiendo del valor de la variable "idnomenclador" , este al ser definido
     * indica que se pretende adicionar un los datos de un tipo de nomenclador
     * de lo contrario se insertarian los datos del mismo.
     *
     * @author Ariadna Rendón Artola
     * */
    public function adicionarNomAction() {
        $iddatonomenclador = $this->_request->getPost('iddatonomenclador');
        $idtiponomenclador = $this->_request->getPost('idtiponomenclador');
        $denominacion = $this->_request->getPost('denominacion');
        $descripcion = $this->_request->getPost('descripcion');
        /* adicionando tipo de nomenclador */
        if (!$idtiponomenclador) {
            $existetiponomenclador = NomTiponomenclador::buscarpordenom($denominacion);
            if (!isset($existetiponomenclador[0])) {
                $objtiponomenclador = new NomTiponomenclador();
                $objtiponomenclador->denominacion = $denominacion;
                $objtiponomenclador->descripcion = $descripcion;
                $objtiponomenclador->uritiponomenclador = $this->limpiaEspacio($denominacion);
                $objtiponomenclador->save();

                $objdatonomenclador = new NomDatosnomenclador();
                $objdatonomenclador->denominacion = "-";
                $objdatonomenclador->descripcion = "-";
                $objdatonomenclador->uridatosnomenclador = "-";
                $objdatonomenclador->idtiponomenclador = $objtiponomenclador->idtiponomenclador;
                $objdatonomenclador->save();
                $respuesta = 1;
            } else {
                $respuesta = 2;
            }
        } /* adicionando un dato del nomenclador */ else {
            $existedatonomenclador = NomDatosnomenclador::obtenerDatosNomencladorByDenominacionTipoNom($denominacion, $idtiponomenclador);
            if (!isset($existedatonomenclador[0])) {
                $objdatonomenclador = new NomDatosnomenclador();
                $objdatonomenclador->denominacion = $denominacion;
                $objdatonomenclador->descripcion = $descripcion;
                $objdatonomenclador->uridatosnomenclador = $this->limpiaEspacioUri($denominacion);
                $objdatonomenclador->idtiponomenclador = $idtiponomenclador;
                $objdatonomenclador->save();
                $iddatonomencladorhijo = $objdatonomenclador->iddatosnomenclador;
                /* guardando la relacion entre los datos nomencladores */
                if ($iddatonomenclador) {
                    $datosdatos = new DatDatosnomencladordatosnomenclador();
                    $datosdatos->iddatosnomencladorpadre = $iddatonomenclador;
                    $datosdatos->iddatosnomencladorhijo = $iddatonomencladorhijo;
                    $datosdatos->save();
                }
                $respuesta = 1;
            }
        }
        echo json_encode(array('codMsgA' => $respuesta));
    }

    /**
     * Permite modificar tipos de nomencladores y los datos de estos
     * dependiendo del valor de la variable "parent" , este al ser definido
     * indica que se pretende adicionar un los datos de un tipo de nomenclador
     * de lo contrario se insertarian los datos del mismo.
     *
     * @author Ariadna Rendón Artola
     * */
    public function modificarNomAction() {
        $idpadre = $this->_request->getPost('parent');
        $idTipoDatoNomenclador = $this->_request->getPost('idnomenclador');
        $descripcion = $this->_request->getPost('descripcion');
        $denominacion = $this->_request->getPost('denominacion');
        if (!$idpadre) {
            $procede = 1;
            $existetiponomenclador = NomTiponomenclador::buscarpordenom(
                            $denominacion
            );
            if (isset($existetiponomenclador[0])) {
                $idtiponomenclador = $existetiponomenclador[0]['idtiponomenclador'];
                if ($idTipoDatoNomenclador != $idtiponomenclador) {
                    $respuesta = 2;
                    $procede = 0;
                }
            }
            if ($procede == 1) {
                $result = NomDatosnomenclador::enUsoDatosNomenclador($idTipoDatoNomenclador);
                if (count($result) > 0) {
                    $respuesta = 3;
                } else {
                    $objtiponomenclador = Doctrine::getTable('NomTiponomenclador')
                            ->find($idTipoDatoNomenclador);
                    $objtiponomenclador->denominacion = $denominacion;
                    $objtiponomenclador->descripcion = $descripcion;
                    $objtiponomenclador->uritiponomenclador = $this->limpiaEspacio(
                            $denominacion
                    );
                    $objtiponomenclador->save();
                    $respuesta = 1;
                }
            }
        } else {
            $procede = 1;
            $objtiponomenclador = Doctrine::getTable('NomTiponomenclador')
                    ->find($idpadre);
            $existedatonomenclador = NomDatosnomenclador::obtenerDatosNomencladorByDenominacionTipoNom(
                            $denominacion, $objtiponomenclador->idtiponomenclador
            );
            if (isset($existedatonomenclador[0])) {
                $iddatosnomenclador = $existedatonomenclador[0]['iddatosnomenclador'];
                if ($iddatosnomenclador != $idTipoDatoNomenclador) {
                    $respuesta = 2;
                    $procede = 0;
                }
            }
            if ($procede == 1) {
                $objdatonomenclador = Doctrine::getTable('NomDatosnomenclador')
                        ->find($idTipoDatoNomenclador);
                $objdatonomenclador->denominacion = $denominacion;
                $objdatonomenclador->descripcion = $descripcion;
                $objdatonomenclador->uridatosnomenclador = $this->limpiaEspacio(
                        $denominacion
                );
                $objdatonomenclador->save();
                //actualizar la uri en DatModelo

                $respuesta = 1;
            }
        }
        echo json_encode(array('codMsgM' => $respuesta));
    }

    /**
     * Permite eliminar tipos de nomencladores y los datos de estos
     * dependiendo del valor de la variable "parent", este al ser definido
     * indica que se pretende adicionar un los datos de un tipo de nomenclador
     * de lo contrario se insertarian los datos del mismo.
     *
     * @author Ariadna Rendón Artola
     * */
    public function eliminarNomAction() {
        try {
            //revisar cuando hay asociacion
            $_parent = $this->_request->getPost('parent');
            $id = $this->_request->getPost('idnom');
            $iddatos = $this->_request->getPost('iddatos');
            if ($id[0] == 'd') {
                $aux = explode('n', $id);
                $id = $aux[1];
            }
            if ($_parent != null) {
                $modelNom = new NomDatosnomencladorModel();
                $nom = Doctrine::getTable('NomDatosnomenclador')->find($iddatos);
            } else {
                $modelNom = new NomTiponomencladorModel();
                $nom = Doctrine::getTable('NomTiponomenclador')->find($id);
            }
            $nomDatosNomen = new NomDatosnomenclador();
            $result = $nomDatosNomen->enUsoDatosNomenclador($id);
            if (count($result) > 0) {
                $cod = 2;
            } else {
                $nom->delete();
                //$cod = $modelNom->Eliminar($nom);
                $cod = 1;
            }

            echo json_encode(array('codE' => $cod));
        } catch (Exception $e) {
            echo json_encode(array('codE' => 2, 'codMsgN' => $e->getMessage()));
        }
    }

    /**
     * Permite listar tipos de nomencladores y los datos de estos ,l
     * os tipos de nomencladores pueden estar asociados o no,
     * dependiendo del valor de las variables "idgrupo y listarAsoc".
     *
     * @author Ariadna Rendón Artola
     * */
    public function listarTipoNomAction() {
        $parametros['denominacion'] = $this->_request->getPost('denominacion');
        $parametros['tipo'] = $this->_request->getPost(
                'tipo'
        ); //si es 1 es un Tipo si es 2 es un Dato
        $parametros['idreal'] = $this->_request->getPost('idreal');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idgrupo = $this->_request->getPost('idgrupo');
        $idespecialidad = $this->_request->getPost('idespecialidad');
        $select = $this->_request->getPost('hijos');
        $idtipoalistar = $this->_request->getPost(
                'idtipoalistar'
        ); //este atributo es para cuando se desea reutilizar un dato de algun tipo
        $idtiponomenclador = $this->_request->getPost('idtiponom');
        $listarAsoc = $this->_request->getPost('listarAsoc');
        $parametros['es_especialidad'] = $this->_request->getPost(
                'es_especialidad'
        );

        $mostrarasociacion = $this->_request->getPost('mostrarasociacion');
        $btngestionarrectorniv = $this->_request->getPost(
                'btngestionarrectorniv'
        );
        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $key => $datos) {
                if ($datos['field'] == 'denominacion') {
                    $parametros ['denominacion'] = $datos ['data'] ['value'];
                } else {
                    if ($datos['field'] == 'descripcion') {
                        $parametros['descripcion'] = $datos ['data'] ['value'];
                    }
                }
            }
        }
        $tiponom = new NomTiponomenclador();
        $datrector = new DatRectortiponomesp();
        if ($mostrarasociacion == 2 && $btngestionarrectorniv == 1 && $idespecialidad == null
        ) {
            $datrector = DatRectortiponomesp::gettodosAsociados($parametros);

            foreach ($datrector as $key => $dato) {

                if (!$parametros['tipo']) {
                    if (!$dato['iddatonomenclador']) {
                        $datrector[$key]['_is_leaf'] = true;
                    }
                } else {
                    $datrector[$key]['idtiponomenclador'] = $parametros['idreal'];
                    if ($dato['cantdescendente'] == 0) {
                        $datrector[$key]['_is_leaf'] = true;
                        $datrector[$key]['id'] = rand(1, 1000000) . $dato['id'];
                        $datrector[$key]['_parent'] = $this->_request->getPost(
                                'anode'
                        );
                    } else {
                        if ($parametros['tipo'] >= 2) {
                            $datrector[$key]['id'] = rand(1, 1000000)
                                    . $dato['id'];
                            $datrector[$key]['_parent'] = $this->_request->getPost('anode');
                        }
                    }
                }
            }
            echo json_encode(
                    array('data' => array_slice(
                                $datrector, $this->_request->getPost('start'), $this->_request->getPost('limit')
                        ),
                        'total' => count($datrector))
            );
        } else {
            if ($mostrarasociacion == 3 && $btngestionarrectorniv == 1 && $idespecialidad != null
            ) {
                $datrector = DatRectortiponomesp::listarNomCalculoNiveles(
                                $parametros
                );

                foreach ($datrector as $key => $dato) {

                    if (!$parametros['tipo']) {
                        if (!$dato['iddatonomenclador']) {
                            $datrector[$key]['_is_leaf'] = true;
                        }
                    } else {
                        $datrector[$key]['idtiponomenclador'] = $parametros['idreal'] ? $parametros['idreal'] : $idtiponomenclador;
                        if ($dato['cantdescendente'] == 0) {
                            $datrector[$key]['_is_leaf'] = true;
                            $datrector[$key]['id'] = rand(1, 1000000)
                                    . $dato['id'];
                            $datrector[$key]['_parent'] = $this->_request->getPost('anode');
                        } else {
                            if ($parametros['tipo'] >= 2) {
                                $datrector[$key]['id'] = rand(1, 1000000)
                                        . $dato['id'];
                                $datrector[$key]['_parent'] = $this->_request->getPost('anode');
                            }
                        }
                    }
                }
                echo json_encode(
                        array('data' => array_slice(
                                    $datrector, $this->_request->getPost('start'), $this->_request->getPost('limit')
                            ),
                            'total' => count($datrector))
                );
            } else {
                if ($mostrarasociacion == 3 && $btngestionarrectorniv == 1 && $idespecialidad == null
                ) {

                    $datrector = DatRectortiponomesp::listarNomCalculoNiveles(
                                    $parametros
                    );
                    foreach ($datrector as $key => $dato) {

                        if (!$parametros['tipo']) {
                            if (!$dato['iddatonomenclador']) {
                                $datrector[$key]['_is_leaf'] = true;
                            }
                        } else {
                            $datrector[$key]['idtiponomenclador'] = $parametros['idreal'] ? $parametros['idreal'] : $idtiponomenclador;
                            if ($dato['cantdescendente'] == 0) {
                                $datrector[$key]['_is_leaf'] = true;
                                $datrector[$key]['id'] = rand(1, 1000000)
                                        . $dato['id'];
                                $datrector[$key]['_parent'] = $this->_request->getPost('anode');
                            } else {
                                if ($parametros['tipo'] >= 2) {
                                    $datrector[$key]['id'] = rand(1, 1000000)
                                            . $dato['id'];
                                    $datrector[$key]['_parent'] = $this->_request->getPost('anode');
                                }
                            }
                        }
                    }

                    echo json_encode(
                            array('data' => array_slice(
                                        $datrector, $this->_request->getPost('start'), $this->_request->getPost('limit')
                                ),
                                'total' => count($datrector))
                    );
                } else {
                    if ($mostrarasociacion == 2 && $btngestionarrectorniv == 1 && $idespecialidad != null
                    ) {
                        $datrector = DatRectortiponomesp::getAsociados(
                                        $idespecialidad, $parametros
                        );
                        foreach ($datrector as $key => $dato) {

                            if (!$parametros['tipo']) {
                                if (!$dato['iddatonomenclador']) {
                                    $datrector[$key]['_is_leaf'] = true;
                                }
                            } else {
                                $datrector[$key]['idtiponomenclador'] = $parametros['idreal'] ? $parametros['idreal'] : $idtiponomenclador;
                                if ($dato['cantdescendente'] == 0) {
                                    $datrector[$key]['_is_leaf'] = true;
                                    $datrector[$key]['id'] = rand(1, 1000000)
                                            . $dato['id'];
                                    $datrector[$key]['_parent'] = $this->_request->getPost('anode');
                                } else {
                                    if ($parametros['tipo'] >= 2) {
                                        $datrector[$key]['id'] = rand(
                                                        1, 1000000
                                                ) . $dato['id'];
                                        $datrector[$key]['_parent'] = $this->_request->getPost('anode');
                                    }
                                }
                            }
                        }
                        echo json_encode(
                                array('data' => array_slice(
                                            $datrector, $this->_request->getPost('start'), $this->_request->getPost('limit')
                                    ),
                                    'total' => count($datrector))
                        );
                    } else {

                        $temp = $tiponom->listar(
                                $parametros, $start, $limit, $listarAsoc, $idgrupo, $idespecialidad, $idtipoalistar
                        );
                        foreach ($temp as $key => $dato) {

                            if (!$parametros['tipo']) {
                                if (!$dato['iddatonomenclador']) {
                                    $temp[$key]['_is_leaf'] = true;
                                }
                            } else {
                                $temp[$key]['idtiponomenclador'] = $idtiponomenclador;
                                if ($dato['cantdescendente'] == 0) {
                                    $temp[$key]['_is_leaf'] = true;
                                    $temp[$key]['id'] = rand(1, 1000000)
                                            . $dato['id'];
                                    $temp[$key]['_parent'] = $this->_request->getPost('anode');
                                } else {
                                    if ($parametros['tipo'] >= 2) {
                                        $temp[$key]['id'] = rand(1, 1000000)
                                                . $dato['id'];
                                        $temp[$key]['_parent'] = $this->_request->getPost('anode');
                                    }
                                }
                            }
                        }
                        $total = $temp[20]['total'];
                        unset($temp[20]);
                        echo json_encode(
                                array('total' => $total, 'data' => $temp)
                        );
                    }
                }
            }
        }
    }

    /**
     * Permite eliminar grupo de nomencladores .
     *
     * @author Ariadna Rendón Artola
     * */
    public function listarGruposNomAction() {
        $datosGrupos = NomTipocomponenteplanif::listarGrupos();
        $datos = array();
        foreach ($datosGrupos as $key => $val) {
            $datos[$key]['id'] = $val['idtipocomponente'];
            $datos[$key]['text'] = $val['descripcion'];
            $datos[$key]['leaf'] = true;
            $datos[$key]['qtip'] = $val['descripcion'];
        }
        echo json_encode($datos);
    }

    /**
     * Permite asociar tipos de nomencladores a grupos de nomencladores .
     *
     * @author Ariadna Rendón Artola
     * */
    public function gestAsocTipoNomAction() {
        $asociar = $this->_request->getPost('asociar');
        $idgrupo = $this->_request->getPost('idgrupo');
        $idnomenclador = $this->_request->getPost('idnomenclador');
        $idespecialidad = $this->_request->getPost('idespecialidad');
        $esEspecialidad = $this->_request->getPost('es_especialidad');
        if ($idgrupo || $idespecialidad) {
            if ($esEspecialidad == 1) {
                $model = new DatConftiponomespModel();
                $asociacion = new DatConftiponomesp();
                if ($asociar == 'true') {
                    $asociacion->idtiponomenclador = $idnomenclador;
                    $asociacion->idespecialidad = $idespecialidad;
                    $model->insertardatConftiponomesp($asociacion);
                } else {
                    $temp = DatConftiponomesp::getAsoc(
                                    $idespecialidad, $idnomenclador
                    );

                    if ($temp) {
                        DatTipocomponentetiponomencladorModel::Eliminar($temp);
                    } else {
                        $return = 2;
                    }
                    DatConftiponomespModel::eliminardatConftiponomesp(
                            $temp[0]
                    );
                }
            } else {
                $model = new DatTipocomponentetiponomencladorModel();
                $asociacion = new DatTipocomponentetiponomenclador();
                $modelrector = new DatRectortiponomespModel();

                if ($asociar == 'true') {
                    $asociacion->idtiponomenclador = $idnomenclador;
                    $asociacion->idtipocomponente = $idgrupo;
                    $model->Insertar($asociacion);
                } else {
                    $temp = DatTipocomponentetiponomenclador::getAsoc(
                                    $idgrupo, $idnomenclador
                    );
                    if ($temp) {
                        DatTipocomponentetiponomencladorModel::Eliminar($temp);

                        if (DatRectortiponomesp::getEliminar($idnomenclador)) {
                            $eliminarrectortiponomesp = DatRectortiponomesp::getEliminar(
                                            $idnomenclador
                            );

                            $modelrector->eliminardatRectortiponomesp(
                                    $eliminarrectortiponomesp
                            );
                        }
                    } else {
                        $return = 2;
                    }
                }
            }
            if (!$return) {
                $return = 1;
            }
        } else {
            $return = 22;
        }

        echo json_encode(array('codMsgE' => $return));
    }

    /**
     * Muestra las especialidades
     *
     * @author Damian Oscar Falcon Borras
     * */
    public function listarEspecialidadesAction() {
        $valor = ($this->_request->getPost('valor')) ? $this->_request->getPost(
                        'valor'
                ) : null;

        $node = $this->_request->getPost('node');
        $idEstructuraPadre = 'undefined';

        if ($node) {
            $idEstructura = $this->_request->getPost('node');
        } else {
            $idEstructura = 0;
        }


        $iddominio = $this->global->Perfil->iddominio;
        $dominios = $this->integrator->metadatos->buscarHijosEstructuras(
                $iddominio, $idEstructura, 0, 0, 3
        );

        if ($idEstructuraPadre == 'undefined' && $idEstructura != '0') {
            $idEstructuraPadre = $idEstructura;
        }
        $result = array();
        foreach ($dominios as $key => $val) {
            $result[$key] = $val;
            $result[$key]['idEstructuraPadre'] = $idEstructuraPadre;
            $result[$key]['entidades_productoras'] = "";
            $result[$key]['qtip'] = $val['text'];
        }
        if ($valor != null) {
            foreach ($result as $key => $value) {
                if (stristr($value['text'], $valor) == false) {
                    unset($result[$key]);
                }
            }
            $res = array();
            $i = 0;
            foreach ($result as $key => $val) {
                $res[$i++] = $val;
            }
        }
        if ($res != null) {
            $result = $res;
        }

        echo json_encode($result);
    }

    function limpiaEspacio($cadena) {
        $cadena = ereg_replace("([ ]+)", "", $cadena);
        $cadena = ereg_replace("\-", "", $cadena);
        return $cadena;
    }

    function limpiaEspacioUri($cadena) {
        $cadena = ereg_replace("([ ]+)", "", $cadena);
        //$cadena = ereg_replace("\-", "", $cadena);
        return $cadena;
    }

    //Asociar nomenclador listado del calculo de niveles a especialidad

    /**
     *
     */
    public function asociarTipoNomCNEspAction() {
        $asociar = $this->_request->getPost('asociar');
        $idgrupo = $this->_request->getPost('idgrupo');
        $idnomenclador = $this->_request->getPost('idnomenclador');
        $idespecialidad = $this->_request->getPost('idespecialidad');
        $esEspecialidad = $this->_request->getPost('es_especialidad');
        $arrayEntidades = array();
        $arrayEntidades[0] = $idespecialidad;
        if ($idgrupo || $idespecialidad) {
            $servicioestructura = $this->integrator->metadatos->obtenerPadreEntidad(
                    $idespecialidad
            );
            if ($esEspecialidad == 1) {
                $model = new DatRectortiponomespModel();
                $asociacion = new DatRectortiponomesp();
                if ($asociar == 'true') {
                    foreach ($servicioestructura as $key => $val) {
                        if ($idespecialidad != $val->id) {
                            $arrayEntidades[] = $val->id;
                            if ($val->id != $val->idpadre) {
                                $arrayEntidades[] = $val->idpadre;
                            }
                        } else {
                            break;
                        }
                    }
                    foreach ($arrayEntidades as $key => $val) {
                        $asociacion = new DatRectortiponomesp();
                        $asociacion->idtiponomenclador = $idnomenclador;
                        $asociacion->idespecialidad = $val;
                        $model->insertardatRectortiponomesp($asociacion);
                    }
                } else {

                    foreach ($servicioestructura as $key => $val) {
                        if ($idespecialidad != $val->id) {
                            $arrayEntidades[] = $val->id;
                            if ($val->id != $val->idpadre) {
                                $arrayEntidades[] = $val->idpadre;
                            }
                        } else {
                            break;
                        }
                    }


                    foreach ($arrayEntidades as $key => $val) {
                        $temp = DatRectortiponomesp::getAsociadosEliminar(
                                        $val, $idnomenclador
                        );
                        $model->eliminardatRectortiponomesp($temp[0]);
                    }
                }
            }
            $return = 1;
        } else {
            $return = 22;
        }

        echo json_encode(array('codMsgE' => $return));
    }

    public function exportarAction() {
        $params['idtiponomenclador'] = $this->_request->getParam('idreal');
        $params['dennomenclador'] = $this->_request->getParam('dennomenclador');

        $modelNomenclador = new NomNomencladoresModel();
        $modelNomenclador->exportarAExcel($params);
    }

}
