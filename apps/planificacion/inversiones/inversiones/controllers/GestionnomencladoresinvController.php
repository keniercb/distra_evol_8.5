
<?php

/**
 * Created by JetBrains PhpStorm.
 * User: edilio
 * Date: 29/03/14
 * Time: 7:23
 * To change this template use File | Settings | File Templates.
 */
class GestionnomencladoresinvController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function gestionnomencladoresinvAction() {
       /* $jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->jsayuda = $jsayuda;*/
        $this->render();
    }

    public function cargarTreeNomencladoresAction() {
        $node = $this->_request->getPost('node');
        $valor = $this->_request->getPost('valor');
        $model = new InversionesModel();
        $result = $model->cargarNomencladorInversion($node, $valor);
        echo json_encode($result);
    }

    public function cargarDatosNomencladoresAction() {
        $node = $this->_request->getPost('node');
        $array = array();
        $datos = array();
        $model = new InversionesModel();
        $temp = $model->cargarGruposNomencladores($node);
        echo json_encode($temp);
    }

    public function cargarDatosNomInversionAction() {
        $params['idNomInversion'] = $this->_request->getPost('idNomInversion');
        $params['start'] = $this->_request->getPost('start');
        $params['limit'] = $this->_request->getPost('limit');
        $params['filtros'] = $this->_request->getPost('filtros');
        if($this->_request->getPost('anode'))
            $params['_parent'] = $this->_request->getPost('anode');

        $model = new DatTipoinversionprogramaModel();
        if (is_array($params['filtros'])) {
            foreach ($this->_request->getPost('filtros') as $key => $dat) {
                if ($dat ['field'] == 'denominacion') {
                    $params ['filtros']['denominacion'] = $dat ['data'] ['value'];
                } elseif ($dat ['field'] == 'descripcion') {
                    $params ['filtros']['descripcion'] = $dat ['data'] ['value'];
                } elseif ($dat ['field'] == 'color') {
                    $params ['filtros']['color'] = $dat ['data'] ['value'];
                } elseif ($dat ['field'] == 'uso') {
                    $params ['filtros']['uso'] = $dat ['data'] ['value'];
                }
            }
        }
        if ($params['idNomInversion'] == 0) {
            $datos = array();
            echo json_encode(array('data' => $datos));
        } else {
            $cargaDesdeGrid = true;
            $datos = $model->obtenerArrayIdDatosGrupoNom($params,$cargaDesdeGrid);
            /*foreach($datos as &$dato){
                $dato['idnom']=
            }*/
            echo json_encode($datos);
        }
    }

    public function adicionarNomencladorAction() {
        $iddatonomenclador = json_decode(stripslashes($this->_request->getPost('iddatonomenclador')));
        $idnomenclador = $this->_request->getPost('idnomenclador');

        $model = new DatTipoinversionprogramaModel();
        $result = $model->adicionarNomenclador($iddatonomenclador, $idnomenclador);
        if ($result == true) {
            echo json_encode(array('codMsgA' => 1));
        } else {
            echo json_encode(array('codMsgA' => 2));
        }
    }

    public function eliminarNomencladorAction() {
        $iddatonomenclador = json_decode(stripslashes($this->_request->getPost('iddatosnomenclador')));
        $idnomenclador = $this->_request->getPost('idnomenclador');
        $model = new DatTipoinversionprogramaModel();
        try {
            $accion = $model->eliminarNomenclador($iddatonomenclador, $idnomenclador);
            $resultado = 1;
        } catch (Exception $e) {
            $resultado = 0;
        }
        if ($resultado == 1) {
            echo json_encode(array('codMsgE' => 1));
        } else {
            echo json_encode(array('codMsgE' => 22));
        }
    }

}
