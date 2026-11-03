<?php

/**
 * CmpControlprocesosController
 * Controlador para
 *
 * @ author
 * @ package Planificación
 * @ subpackage Planificación Empresarial y Presupuestaria
 * @ copyright UCID
 * @ version 2.0
 * */
class CmpControlprocesosController extends ZendExt_Controller_Secure {

    /**
     * init
     * Inicializar el componente
     * */
    function init() {
        parent::init();
    }

    /**
     *
     * Renderizar la vista
     * */
    public function cmpcontrolprocesosAction() {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    public function cargarProcesosAction() {
        $objcmpprocesos = new CmpControlprocesosModel();
        $arrayprocesos = $objcmpprocesos->cargarProcesosPlanificacion();
        echo json_encode($arrayprocesos);
    }

    public function cargarFuncionalidadesSinAsociarAction() {
        $valor = $this->_request->getPost('valor');
        //no mirar
        //$parametros->idsubsistema = 300000001788;
        $conn = Doctrine_Manager::connection();
        $query = "SELECT   idsistema FROM  mod_seguridad.dat_sistema 
        WHERE denominacion = 'Planificación material'";
        $parametros->idsubsistema = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        $parametros->idsubsistema = $parametros->idsubsistema[0];
        //fin del desastre
        $parametros->idproceso = $this->_request->getPost('idproceso');
        $objcmpprocesos = new CmpControlprocesosModel();
        $arrayfuncionalidades = $objcmpprocesos->cargarFuncionalidadesSinAsociar($parametros);
        if ($valor != null) {
            foreach ($arrayfuncionalidades as $key => $value) {
                if (stristr($value['text'], $valor) == false) {
                    unset($arrayfuncionalidades[$key]);
                }
            }
            $res = array();
            $i = 0;
            foreach ($arrayfuncionalidades as $key => $val) {
                $res[$i++] = $val;
            }
        }
        if ($res != null) {
            $arrayfuncionalidades = $res;
        }
        echo json_encode($arrayfuncionalidades);
    }

    public function cargarFuncionalidadesAsociadasAction() {
        //$idsubsistema = 1152;//esto debe de salir por los conceptos globales->no pincha

        $idproceso = $this->_request->getPost('idproceso');
        $objcmpprocesos = new CmpControlprocesosModel();
        $arrayfuncionalidadesasoc = $objcmpprocesos->cargarFuncionalidadesAsociadas($idproceso);
        echo json_encode($arrayfuncionalidadesasoc);
    }

    public function adicionarAsociacionProcesoFuncionalidadAction() {
        $parametros->arrayfuncionalidades = json_decode(
                stripslashes($this->_request->getPost('arrayfuncionalidades'))
        );
        $parametros->idproceso = $this->_request->getPost('idproceso');
        $parametros->referencia = $this->_request->getPost('referencia');
        $parametros->idtiponomenclador = $this->_request->getPost(
                'idtiponomenclador'
        );
        $objcmpcontrolproceso = new CmpControlprocesosModel();
        $respuesta = $objcmpcontrolproceso->adicionarAsociacionProcesoFuncionalidad(
                $parametros
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

    public function eliminarAsociacionProcesoFuncionalidadAction() {
        $parametros->idprocesofuncionalidad = $this->_request->getPost(
                'idprocesofuncionalidad'
        );
        $objcmpcontrolproceso = new CmpControlprocesosModel();
        $respuesta = $objcmpcontrolproceso->eliminarAsociacionProcesoFuncionalidad(
                $parametros
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

    public function cargarEstadosAction() {
        $parametros->idprocesofuncionalidad = $this->_request->getPost(
                'idprocesofuncionalidad'
        );
        $objcmpprocesos = new CmpControlprocesosModel();
        $arrayestados = $objcmpprocesos->cargarEstados();
        echo json_encode($arrayestados);
    }

    public function listarEjerciciosAction() {
        $objcmpprocesos = new CmpControlprocesosModel();
        $arrayejercicios = $objcmpprocesos->listarEjercicios();
        echo json_encode(
                array('data' => $arrayejercicios,
                    'total' => count($arrayejercicios))
        );
    }

    public function cargarEspFiltrosAction() {
        $cbmodel = new CmpControlprocesosModel();
        $data['data'] = $cbmodel->listarEntidadesFiltro();
        if ($data == 1) {
            echo("{'codMsg':22 }");
        } else {
            echo json_encode($data);
        }
    }

    public function adicionarPermisosAction() {
        $parametros->idprocesofuncionalidadentidad = $this->_request->getPost(
                'idprocesofuncionalidadentidad'
        );
        $parametros->idprocesofuncionalidadestado = $this->_request->getPost(
                'idprocesofuncionalidadestado'
        );
        //$parametros->idprocesofuncionalidad = $this->_request->getPost('idprocesofuncionalidad');
        $parametros->evento = $this->_request->getPost('evento');
        $parametros->idestado = $this->_request->getPost('idestado');
        $parametros->idejercicio = $this->_request->getPost('idejercicio');
        $parametros->guardar = $this->_request->getPost('guardar');
        $parametros->eliminar = $this->_request->getPost('eliminar');
        $parametros->modificar = $this->_request->getPost('modificar');
        $parametros->insertar = $this->_request->getPost('insertar');
        $arrayidentidades = json_decode(
                stripslashes($this->_request->getParam('arrayidentidades'))
        );
        $arrayFuncionalidades = json_decode(
                stripslashes($this->_request->getParam('arrayprocesofuncionalidad'))
        );

        $todoshijos = array();
        $objcmpcontrolproceso = new CmpControlprocesosModel();
        if (!$parametros->idprocesofuncionalidadentidad && $parametros->evento == 'Adicionar'
        ) {
            foreach ($arrayFuncionalidades as $key => $valueFunc) {
                $parametros->idprocesofuncionalidad = $valueFunc;
                $resul = $objcmpcontrolproceso->buscarIdprocesofuncionalidadestado($parametros);
                if ($resul[0] == null) {
                    $objcmpcontrolproceso->insertarProcesofuncionalidadestado($parametros);
                    $resul = $objcmpcontrolproceso->buscarIdprocesofuncionalidadestado($parametros);
                }
                $parametros->idprocesofuncionalidadestado = $resul[0]['idprocesofuncionalidadestado'];
                $procesofuncionalidadestado = $objcmpcontrolproceso->addEstadoFunc($parametros);
                if ($procesofuncionalidadestado) {
                    $objprocesofuncionalidadestado = Doctrine::getTable('DatProcesofuncionalidadestado')->findByDql(
                            "idprocesofuncionalidad=$procesofuncionalidadestado->idprocesofuncionalidad
                        and idestado=$procesofuncionalidadestado->idestado
                        and idejercicio=$procesofuncionalidadestado->idejercicio"
                    );
                    if (isset($objprocesofuncionalidadestado[0])) {
                        $parametros->idprocesofuncionalidadestado = $objprocesofuncionalidadestado[0]->idprocesofuncionalidadestado;
                    }
                }
            }
        }
        $modeloActEnt = new DatActividadentidad();
        foreach ($arrayidentidades as $key => $value) {
            $hijas = DatActividadentidad::auxObtenerEntidadesHijasComun($value);
            foreach ($hijas as $hijo) {
                $todoshijos[] = $hijo;
            }
        }

        $objcmpcontrolproceso = new CmpControlprocesosModel();

        foreach ($todoshijos as $valueent) {
            $parametros->identidad = $valueent;
            $respuesta = $objcmpcontrolproceso->adicionarPermisos($parametros);
        }

        if ($respuesta->idprocesofuncionalidadentidad || $respuesta == 1) {

            echo json_encode(array('codMsgA' => 1));
        } else {
            echo json_encode(array('codMsgA' => 3));
        }
    }

    public function buscarEntidadesHijas($identidad) {
        $security = ZendExt_Aspect_Security_Sgis::getInstance();
        $entidadesHijas = array();
        $modeloActEnt = new DatActividadentidad();
        $entidadesHijas = DatActividadentidad::auxObtenerEntidadesHijasComun(
                        $identidad
        );
        return $entidadesHijas;
    }

    //Cargar permisos
    public function cargarDatosPermisoAction() { {
            $parametros->idpermiso = $this->_request->getParam('idpermiso');
            $objpermiso = Doctrine::getTable('DatProcesofuncionalidadentidad')
                    ->find($parametros->idpermiso);
            if ($objpermiso) {
                $response[0]['eliminar'] = $objpermiso->eliminar;
                $response[0]['guardar'] = $objpermiso->guardar;
                $response[0]['identidad'] = $objpermiso->identidad;
                $response[0]['insertar'] = $objpermiso->insertar;
                $response[0]['modificar'] = $objpermiso->modificar;
                $aux = Doctrine::getTable('DatProcesofuncionalidadestado')
                        ->find(
                        $objpermiso->idprocesofuncionalidadestado
                );
                $response[0]['idejercicio'] = $aux->idejercicio;
                $denom = Doctrine::getTable('NomEjercicioplanificacion')->find(
                        $aux->idejercicio
                );
                $response[0]['denominacion'] = $denom->ejercicio;

                $mensaje = 1;
            } else {
                $mensaje = 0;
            }
            echo json_encode(array('mensaje' => $mensaje, 'data' => $response));
        }
    }

    //Eliminar permisos
    public function eliminarPermisosAction() {
        $arraypermisos = json_decode(
                stripslashes($this->_request->getParam('arrayidpermisos'))
        );
        $resultado = 1;

        foreach ($arraypermisos as $id) {

            $temporal = Doctrine::getTable("DatProcesofuncionalidadentidad")
                    ->find($id);

            if (isset($temporal)) {
                $parametros->idprofunest = $temporal->idprocesofuncionalidadestado;
                $parametros->hijas = DatActividadentidad::auxObtenerEntidadesHijasComun($temporal->identidad);
                $parametros->hijas[] = $temporal->identidad;

                try {
                    CmpControlprocesosModel::eliminarPermisos(
                            $id, $parametros
                    );
                    $resultado = 1;
                } catch (Exception $e) {
                    $resultado = 0;
                    break;
                }
            }
        }

        echo json_encode(array('codMsgE' => $resultado));
    }

    public function listarPermisosAction() {
        $parametros['start'] = $this->_request->getPost('start');
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['filtros'] = $this->_request->getPost('filtros');
        $parametros['idestado'] = $this->_request->getPost('idestado');
        $parametros['idprocesofuncionalidad'] = $this->_request->getPost(
                'idprocesofuncionalidad'
        );

        $objcmpcontrolproceso = new CmpControlprocesosModel();
        $result = $objcmpcontrolproceso->listarPermisos($parametros);

        if ($result == 3) {
            echo '{"data":[{"mensaje":"3"}]}';
        } else {
            echo json_encode($result);
        }
    }

    public function listarEjerciciosActivarDesactivarAction() {
        $parametros->idprocesofuncionalidad = $this->_request->getPost(
                'idprocesofuncionalidad'
        );
        $parametros->idestado = $this->_request->getPost('idestado');
        $parametros->activar = $this->_request->getPost('activo');
        $parametros->start = $this->_request->getPost('start');
        $parametros->limit = $this->_request->getPost('limit');
        $result = NomEjercicioplanificacion::listarEjerciciosActDesact(
                        $parametros
        );
        echo json_encode(array('data' => $result));
    }

    public function listarEjerciciosActivarDesactivarArbolAction() {
        $parametros->idprocesofuncionalidad = $this->_request->getPost(
                'idprocesofuncionalidad'
        );
        $parametros->idestado = $this->_request->getPost('idestado');
        $parametros->activar = $this->_request->getPost('activo');
        $parametros->start = $this->_request->getPost('start');
        $parametros->limit = $this->_request->getPost('limit');
        $result = NomEjercicioplanificacion::listarEjerciciosActDesact(
                        $parametros
        );
        echo json_encode($result);
    }

    public function cargarModificarEntidadesAction() {

        $parametros->idejercicio = $this->_request->getPost('idejercicio');
        $parametros->evento = $this->_request->getPost('evento');
        $parametros->idestado = $this->_request->getPost('idestado');

        $cbmodel = new CmpControlprocesosModel();
        $data = $cbmodel->listarModificarEntidades($parametros);

        if ($data == 1) {
            echo("{'codMsg':22 }");
        } else {
            echo json_encode($data);
        }
    }

    public function activarEstadoAction() {
        $parametros->idprocesofuncionalidad = $this->_request->getPost(
                'idprocesofuncionalidad'
        );
        $parametros->activo = $this->_request->getPost('activo');
        $parametros->idestado = $this->_request->getPost('idestado');
        $arrayejercicio = json_decode(
                stripslashes($this->_request->getParam('arrayejercicio'))
        );
        $cbmodel = new CmpControlprocesosModel();
        $data = $cbmodel->activarEstado($arrayejercicio, $parametros);

        echo json_encode(array('mensaje' => $data));
    }

}
