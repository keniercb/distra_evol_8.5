<?php

class ConfigurarfichacostoController extends ZendExt_Controller_Secure
{

    public function init()
    {
        parent::init();
    }

    //Renderizar la vista
    public function configurarfichacostoAction()
    {
        $this->render();
    }

    public function listarnaturalezasAction()
    {
        $naturalezas = DatFichacostoModel::listarnaturaleza();
        echo json_encode(array('data' => $naturalezas));
    }

    public function guardarConfiguracionAction()
    {
        $params['confnaturaleza'] = json_decode(stripslashes($this->_request->getParam('confnaturaleza')));
        //$params['confautor'] = json_decode(stripslashes($this->_request->getParam('confautor')));
        $obj = new DatFichacostoModel();
        $res = $obj->guardarConfiguracion($params);
        echo json_encode(array('codMsgN' => $res));
    }

    public function listarfichacostoAction()
    {
        $params['start'] = $this->_request->getPost('start');
        $params['limit'] = $this->_request->getPost('limit');
        $params['filtros'] = $this->_request->getPost('filtros');
        $ficha = DatFichacostoModel::listarfichacosto($params);
        echo json_encode(array('data' => $ficha, 'total' => $ficha[0]['total']));
    }

    public function listardatnomconceptosAction()
    {
        $array_gastos = NomDatosnomenclador::getDatosNomPorUriTipoNom('Conceptosdegasto');
        unset($array_gastos[0]);
        $array_gastos = array_values($array_gastos);
        echo json_encode(array('data' => $array_gastos));
    }

    public function listarnaturalezasfichaAction()
    {
        $params['start'] = $this->_request->getPost('start');
        $params['limit'] = $this->_request->getPost('limit');
        $params['filtros'] = $this->_request->getPost('filtros');
        $naturalezas = DatFichacostoModel::listarnaturalezaficha($params);
        echo json_encode(array('data' => $naturalezas, 'total' => $naturalezas[0]['total']));
    }

    public function addnaturalezafichaAction()
    {

        try {
            $params['naturalezas'] = json_decode(stripslashes($this->_request->getParam('naturalezas')));
            $res = DatFichacostoModel::addnaturalezaficha($params);
            echo json_encode(array('codMsgN' => $res));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }


    }

    public function eliminarrelacionfichaAction()
    {
        try {
            $params['relaciones'] = json_decode(stripslashes($this->_request->getParam('relaciones')));
            $res = DatFichacostoModel::eliminarrelacionficha($params);
            echo json_encode(array('codMsgN' => $res));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }

    }

    public function listarautorfichaAction()
    {
        $params['start'] = $this->_request->getPost('start');
        $params['limit'] = $this->_request->getPost('limit');
        $params['filtros'] = $this->_request->getPost('filtros');
        $autorFicha = DatFichacostoModel::listarautorficha($params);
        echo json_encode(array('data' => $autorFicha, 'total' => $autorFicha[0]['total']));
    }

    public function guardarconfautorAction()
    {
        try {
            $params['iddatosautorficha'] = $this->_request->getParam('iddatosautorficha');
            $params['subordinada'] = $this->_request->getParam('subordinada');
            $params['confeccionado'] = $this->_request->getParam('confeccionado');
            $params['cargoConfeccionado'] = $this->_request->getParam('cargoConfeccionado');
            $params['telefonoConfeccionado'] = $this->_request->getParam('telefonoConfeccionado');
            $params['aprobado'] = $this->_request->getParam('aprobado');
            $params['cargoAprobado'] = $this->_request->getParam('cargoAprobado');
            $params['telefonoAprobado'] = $this->_request->getParam('telefonoAprobado');
            $obj = new DatFichacostoModel();
            $res = $obj->guardarconfautor($params);
            echo json_encode(array('codMsgN' => $res));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function eliminarconfautorAction()
    {
        try {
            $params['datosautorficha'] = json_decode(stripslashes($this->_request->getParam('datosautorficha')));
            $res = DatFichacostoModel::eliminarconfautor($params);
            echo json_encode(array('codMsgN' => $res));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }

    }

}
