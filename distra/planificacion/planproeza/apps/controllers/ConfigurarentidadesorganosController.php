<?php

class ConfigurarentidadesorganosController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function configurarentidadesorganosAction() {
        $this->render();
    }

    public function listarRelacionEntidadOrganoAction() {
        $parametros['start'] = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 20;
        $model = new ConfigurarentidadesorganosModel();
        $result = $model->listarRelacionEntidadOrgano($parametros);
        if (isset($result['resultado'])) {
            if ($result['total'] == 0) {
                echo json_encode(array('campos' => array(), 'total' => 0));
            } else {
                echo json_encode(array('campos' => $result['resultado'], 'total' => $result['total']));
            }
        } else
            echo json_encode(array('campos' => array(), 'total' => 0));
    }

    public function listarOrganoSatisfaceAction() {
        $parametros['start'] = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 20;
        $parametros['busquedaOrg'] = $this->_request->getPost('busquedaOrg');
        $parametros['denomorgano'] = ($this->_request->getPost('denomorgano')) ? $this->_request->getPost('denomorgano') : null;
        $model = new ConfigurarentidadesorganosModel();
        $result = $model->listarOrganoSatisface($parametros);
        if (isset($result['resultado'])) {
            if ($result['total'] == 0) {
                echo json_encode(array('campos' => array(), 'total' => 0));
            } else {
                echo json_encode(array('campos' => $result['resultado'], 'total' => $result['total']));
            }
        } else
            echo json_encode(array('campos' => array(), 'total' => 0));
    }

    public function adicionarRelacionEntidadOrganoAction() {
        $parametros['idEstructura'] = $this->_request->getPost('idEstructura');
        $parametros['idOrganoSatisface'] = $this->_request->getPost('idOrganoSatisface');
        $model = new ConfigurarentidadesorganosModel();
        $result = $model->adicionarRelacionEntidadOrgano($parametros);
        echo json_encode(array('mensaje' => $result));
    }

    public function eliminarRelacionEntidadOrganoAction() {
        $arrayIdElementosEliminar = json_decode(stripslashes($this->_request->getPost('arrayIdElementosEliminar')));
        $model = new ConfigurarentidadesorganosModel();
        $result = $model->eliminarRelacionEntidadOrgano($arrayIdElementosEliminar);
        echo json_encode(array('mensaje' => $result));
    }

    public function verificarEntidadOrganoEmpresarialAction() {
        $idEstructura = $this->_request->getPost('idEstructura');
        $model = new ConfigurarentidadesorganosModel();
        $result = $model->verificarEntidadOrganoEmpresarial($idEstructura);
        echo json_encode(array('mensaje' => $result));
    }

    public function cargarArbolEstructuraAction() {
        $idEstructura = ($this->_request->getPost('node') && $this->_request->getPost('node') != 'nodo2') ? $this->_request->getPost('node') : 0;
        $valor = $this->_request->getPost('denominacion');
        $iddominio = $this->global->Perfil->iddominio;
        $dominios = $this->integrator->metadatos->buscarHijosEstructuras($iddominio, $idEstructura, 0, 0, 3);
        $result = array();
        foreach ($dominios as $key => $val) {
            if ($valor != null) {
                $flag = stristr($val['text'], $valor);
            }
            if ($val['tipo'] != 7) {
                $result[$key] = $val;
                $result[$key]['qtip'] = $val['text'];
            }
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

}
