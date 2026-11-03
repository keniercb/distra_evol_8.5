<?php

class ControlpermisosController extends ZendExt_Controller_Secure {

    /** Inicializar el componente* */
    function init() {
        parent::init();
    }

    public function controlpermisosAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    public function cargarFuncionalidadesAction() {
        $identidad = $this->global->Estructura->idestructura;
        $certificado = $this->global->Perfil->certificado;
        $idsubsistema = $this->integrator->seguridad->ObtenerIdSistema('Planificación');
        $arrayfuncionalidades = $this->integrator->seguridad->ObtenerSistemaFuncionalidades($certificado, $idsubsistema, $identidad);
        $result = ControlPermisosModel::cargarFuncionalidades($arrayfuncionalidades);
        echo json_encode($result);
    }

    public function getEjerciciosAction() {
        $data->idejercicioactual = $this->pIntegrator->planmeta->obtenerEjercicioActual();
        $data->data = $this->pIntegrator->planmeta->obtenerEjercicios();
        echo json_encode($data);
    }

    public function getEstadosAction() {
        try {
            $data = ControlPermisosModel::listarEstados($parametros);
            echo json_encode(array('data' => $data));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarPermisosAction() {
        try {
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $params['filtros'] = $this->_request->getPost('filtros');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['idestado'] = $this->_request->getPost('idestado');
            $params['idfuncionalidad'] = $this->_request->getPost('idfuncionalidad');
            $params['identidad'] = $this->_request->getPost('identidad');
            $excluir = array(7, 8, 9, 10);
            $params['dominios'] = $this->integrator->metadatos->DameHijosEstructura($params['identidad'], $excluir);
            $data = ControlPermisosModel::listarPermisos($params);
            echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function obtenerEntidadesHijasAction() {
        try {
            $identidad = $this->_request->getPost('identidad');
            $entidad = $this->_request->getPost('denomentidad');
            $excluir = array(7, 8, 9, 10);
            $dominios = $this->integrator->metadatos->DameHijosEstructura($identidad, $excluir);
            $entidades = array();
            //idconcepto / tipo
            //0 / general
            //1 / organo
            //2 / agrupacion
            //3 / entidad
            //4 / organizacion
            //5 / organo interno
            //6 / agrupacion interna
            //7 / cargo civil
            //8 / estructura no formal
            //9 / medio
            //10 / cargo militar

            foreach ($dominios as $key => $value) {
                if ($value->idconcepto == 0 || $value->idconcepto == 1 || $value->idconcepto == 2 || $value->idconcepto == 3 ||
                        $value->idconcepto == 4 || $value->idconcepto == 5 || $value->idconcepto == 6
                // || $value->idconcepto == 7 
                // || $value->idconcepto == 8 
                // || $value->idconcepto == 9  
                // || $value->idconcepto == 10
                ) {
                    $entidades[$key][identidad] = $value->id;
                    $entidades[$key][denominacion] = $value->denominacion;
                    $entidades[$key][idconcepto] = $value->idconcepto;
                }
            }
            $arrayentidad['identidad'] = $identidad;
            $arrayentidad['denominacion'] = $entidad;
            $arrayentidad['idconcepto'] = 3;
            array_unshift($entidades, $arrayentidad);
            echo json_encode(array('data' => $entidades));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function guardarPermisosAction() {
        try {
            $params['datos'] = json_decode(stripslashes($this->_request->getPost('datos')));
            $params['idfuncionalidad'] = $this->_request->getPost('idfuncionalidad');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['idestado'] = $this->_request->getPost('idestado');
            $params['idusuario'] = $this->global->Perfil->idusuario;
            ControlPermisosModel::guardarPermisos($params);
            $dat->codMsgE = 1;
            echo json_encode($dat);
        } catch (Exception $exc) {
            echo json_encode($exc->getMessage());
        }
    }

    public function cargarUsuariosAction() {
        $users = $this->integrator->seguridad->getAllUsers();
        echo json_encode(array("data" => $users));
    }

    public function asignarPermisoTodasAction() {
        try {
            $params['idfuncionalidad'] = $this->_request->getPost('idfuncionalidad');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['idestado'] = $this->_request->getPost('idestado');
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['permiso'] = $this->_request->getPost('permiso');

            $params['global'] = ($this->_request->getPost('global') != null) ? $this->_request->getPost('global') : false;
            if ($params['global'] == "false") {
                $excluir = array(7,8,9,10);
                $params['dominios'] = $this->integrator->metadatos->DameHijosEstructura($params['identidad'],$excluir);
            } else {
                $params['dominios'] = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad'], false);
            }

            $entidad->id = $params['identidad'];
            array_unshift($params['dominios'], $entidad);

            ControlPermisosModel::asignarPermisoTodas($params);
            $dat->codMsgE = 1;
            echo json_encode($dat);
        } catch (Exception $exc) {
            echo json_encode($exc->getMessage());
        }
    }

    public function quitarPermisoTodasAction() {
        try {
            $params['idfuncionalidad'] = $this->_request->getPost('idfuncionalidad');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['idestado'] = $this->_request->getPost('idestado');
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['permiso'] = $this->_request->getPost('permiso');

            $params['global'] = ($this->_request->getPost('global') != null) ? $this->_request->getPost('global') : false;
            if ($params['global'] == "false") {
                $excluir = array(7,8,9,10);
                $params['dominios'] = $this->integrator->metadatos->DameHijosEstructura($params['identidad'],$excluir);
            } else {
                $params['dominios'] = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad'], false);
            }

            $entidad->id = $params['identidad'];
            array_unshift($params['dominios'], $entidad);

            ControlPermisosModel::quitarPermisoTodas($params);
            $dat->codMsgE = 1;
            echo json_encode($dat);
        } catch (Exception $exc) {
            echo json_encode($exc->getMessage());
        }
    }

}
