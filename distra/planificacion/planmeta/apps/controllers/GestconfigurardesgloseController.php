<?php

/**
 * BasesParaPlanController
 * Controlador para gestionar las bases para un plan
 *
 * @ author Pedro Enrique Rojas Aguilar
 * @ package Planificación
 * @ subpackage Planificación Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 1.0-0
 * */
class GestconfigurardesgloseController extends ZendExt_Controller_Secure {

    /**
     * init
     * Inicializar el componente
     * */
    public function init() {
        parent::init();
    }

    //fin de la función init
    /**
     * bpgestnivelesactividad
     * Renderizar la vista
     * */
    public function gestconfigurardesgloseAction() {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        // $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    //fin de la función gestconfigurardesglose

    public function listarConfigDesgloseAction() {
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['denominacion'] = $this->_request->getPost('denominacion');
        $params['descripcion'] = $this->_request->getPost('descripcion');
        /*  $params['filtros'] = $this->_request->getPost('filtros')[0];
        */


        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos['field'] == 'denominacion') {
                    $parametros ['denominacion'] = $datos ['data'] ['value'];
                } else {
                    if ($datos['field'] == 'descripcion') {
                        $parametros['descripcion'] = $datos ['data'] ['value'];
                    } else {
                        if ($datos['field'] == 'asociado') {
                            if ($datos ['data'] ['value'] == 'Sí') {
                                $parametros ['asociado'] = 1;
                            } else {
                                $parametros ['asociado'] = 2;
                            }
                        }
                    }
                }
            }
            //}
        }


        $data = DatDesglose::listar($params, $parametros);
        echo json_encode($data);
    }

    public function listarDatosNomConfigDesgloseAction() {
        $params['limit'] = ($this->_request->getPost('limit') == null) ? 20 : $this->_request->getPost('limit');
        $params['start'] = ($this->_request->getPost('start') == null) ? 0 : $this->_request->getPost('start');
        $params['iddesglose'] = $this->_request->getPost('iddesglose');
        $params['denominacion'] = $this->_request->getPost('denominacion');
        $params['descripcion'] = $this->_request->getPost('descripcion');

        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos['field'] == 'denominacion') {
                    $parametros ['denominacion'] = $datos ['data'] ['value'];
                } else {
                    if ($datos['field'] == 'descripcion') {
                        $parametros['descripcion'] = $datos ['data'] ['value'];
                    } else {
                        if ($datos['field'] == 'orden') {
                            $parametros ['orden']['datos'] = $datos ['data'] ['value'];
                            $parametros ['orden']['signo'] = $datos ['data'] ['comparison'];
                        }
                    }
                }
            }
            //}
        }

        $data = DatDesglosetiponomenclador::listar($params, $parametros);
        echo json_encode($data);
    }

    public function adicionarConfigDesgloseAction() {
        $params['iddesglose'] = $this->_request->getPost('iddesglose');
        $params['denominacion'] = $this->_request->getPost('denominacion');
        $params['descripcion'] = $this->_request->getPost('descripcion');
        $params['tiponomencladores_orden'] = json_decode(
                stripslashes($this->_request->getPost('tiponomencladores_orden'))
        );
        if ($params['iddesglose'] == null) {
            $deno = "'" . $params['denominacion'] . "'";
            $desg = Doctrine::getTable('DatDesglose')->findByDql(
                    " denominacion = $deno"
            );
            $denominacion = $desg[0]->denominacion;
        }
        if ($denominacion == $params['denominacion']) {
            echo json_encode(array('codMsgM' => 2));
        } else {
            DatDesgloseModel::adicionarConfigDesglose($params);
            if ($params['iddesglose'] == null) {
                echo json_encode(array('codMsgM' => 1));
            } else {
                echo json_encode(array('codMsgM' => 3));
            }
        }
    }

    public function eliminarConfigDesgloseAction() {
        $confDesgloses = json_decode(
                stripslashes($this->_request->getPost('conf_desgloses'))
        );
        $modelConfigDesg = new DatDesgloseModel();
        $modelConfigDesg->eliminarConfigDesglose($confDesgloses);
        echo json_encode(array('codMsgM' => 1));
    }

    public function listarTipoNomencladorAction() {
        /* temporal listar solo los nomncladores relacionados con el componente actividad */
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $modelTipoNom = new NomTiponomencladorModel();
        $idtipocomponente = 9; //en BD desarrollo
        echo json_encode(
                array('data' => $modelTipoNom->listar($params),
                    'total' => $modelTipoNom->total()[0]['total'])
        );
        //  echo json_encode($data);
    }

    public function cambiarActualAction() {

        $parametros->iddesglose = $this->_request->getParam('iddesglose');
        $parametros->confirmar = $this->_request->getParam('confirmar');
        $modelConfigDesg = new DatDesgloseModel();
        $resp = $modelConfigDesg->cambiarDesgloseActual($parametros);

        echo json_encode(array('mensaje' => $resp));
    }

}
