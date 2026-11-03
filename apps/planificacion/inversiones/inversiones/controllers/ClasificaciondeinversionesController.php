<?php

class ClasificaciondeinversionesController extends ZendExt_Controller_Secure {

    /**
     * init
     * Inicializar el componente
     * */
    public function init() {


        parent::init();
    }

    //mio
    public function gestionclasifinversionesAction() {
        $this->render();
    }

    public function clasificaciondeinversionesAction() {
//        $jsayuda = $this->integrator->ayuda->devolverJS();
//        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    public function mismadenominacionAction() {
        $model = new NomTipoinversionModel();
        echo json_encode($model->mismadenominacion($this->_request->getPost()));
    }

    public function cargarDatosClaInversionAction() {
        $params['idtipoinversion'] = $this->_request->getPost('idtipoinversion');
        $params['start'] = $this->_request->getPost('start');
        $params['limit'] = $this->_request->getPost('limit');
        $params['filtros'] = $this->_request->getPost('filtros');
        $model = new NomTipoinversionModel();
        if (is_array($params['filtros'])) {
            foreach ($this->_request->getPost('filtros') as $key => $dat) {
                if ($dat ['field'] == 'idtipoinversion') {
                    $params ['filtros']['idtipoinversion'] = $dat ['data'] ['value'];
                } elseif ($dat ['field'] == 'denominacion') {
                    $params ['filtros']['denominacion'] = $dat ['data'] ['value'];
                } elseif ($dat ['field'] == 'formatodetapa') {
                    $params ['filtros']['formatodetapa'] = $dat ['data'] ['value'];
                }
            }
        }
        if ($params['idtipoinversion'] == 0) {
            $datos = array();
            echo json_encode(array('data' => $datos));
        } else {
            $datos = $model->obtenerArrayIdDatosClaNom($param);
            echo json_encode($datos);
        }
    }

    public function adicionarAction() {
        $params['idformatoetapa'] = $this->_request->getPost('formato');
        $params['denominacion'] = $this->_request->getPost('denominacion');
        $params['idtipoinversion'] = $this->_request->getPost('idtipoinversion');
        $result = NomTipoinversionModel::adicionarClasificacionInv($params);
        if ($result) {
            echo json_encode(array('codMsgg' => 1));
        } else {
            echo json_encode(array('codMsgA' => 0));
        }
    }

    public function modificarAction() {
        $params['idformatoetapa'] = $this->_request->getPost('idformatoetapa');
        $params['denominacion'] = $this->_request->getPost('denominacion');
        $params['idtipoinversion'] = $this->_request->getPost('idtipoinversion');
        $codMsg = NomTipoinversion::actualizar($params);
        echo json_encode(array('codMsgg' => $codMsg));
    }

    public function listarformatoAction() {
        $listar = ConfFormatoetapa::getFormatosEtapaClac();
        //print_r($listar);die;
        echo json_encode(array('data' => $listar));
    }


    public function cargarDocPrimariosAction() {
        $estructura = $this->global->Estructura->idestructura;
        $idsubsistema = 30;
        $datos = $this->integrator->datosmaestros->documentosPorSubsistemaEntidad($idsubsistema, $estructura, array());

        foreach($datos as $key => &$dato){
            $iddoc = InversionesModel::buscarEspacioFactibilidadByTipoInv();
            if($iddoc[0]['iddocumentos'] == $dato->iddoc)
                 $dato->checked = true;
            else
                $dato->checked = false;
        }

        echo json_encode(array('data' => $datos));
    }


    public function guardarDocumentoTipoInversionAction() {
        $params['iddocumento'] = $this->_request->getPost('iddocumento');
        $params['idTiposInversion'] = json_decode(stripslashes($this->_request->getPost('idtiposinversion')));
        $result = NomTipoinversionModel::guardarDocumentoTipoInversion($params);
        if ($result) {
            echo json_encode(array('codMsgg' => 1));
        } else {
            echo json_encode(array('codMsgA' => 0));
        }
    }

    public function listarAction() {
        $listarP = NomTipoinversion::listarprincipal($this->_request->getPost());
        echo json_encode(array('data' => array_slice($listarP, $this->_request->getPost('start'), $this->_request->getPost('limit')),
            'total' => count($listarP)));
    }

    public function eliminarAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $params = json_decode(stripslashes($this->_request->getPost('idtipoinversiones')));
        $model = new NomTipoinversionModel();
        try {
            $result = $model->eliminarTipoInversion($params);
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
