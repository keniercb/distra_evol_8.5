<?php

class NomcausalimitacionController extends ZendExt_Controller_Secure
{

    protected $objModel;
    private $request;

    function init()
    {
        parent::init();
        $this->objModel = new NomCausalimitacionModel();
    }

    function nomcausalimitacionAction()
    {
        $this->render();
    }

    function getcausasAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $query = $this->_request->getPost('query');
        $result = $this->objModel->getAllCausa($query, $limit, $start);
        $this->request->data = $result->data;
        $this->request->quantity = $result->quantity;
        $this->returnRequest();
    }

    function returnRequest()
    {
        echo json_encode($this->request);
    }

    function getAllCausaAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $query = $this->_request->getPost('query');
        $result = $this->objModel->getAllCausa($query, $limit, $start);
        $this->request->data = $result->data;
        $this->request->quantity = $result->quantity;
        $this->returnRequest();
    }

    function getActiveCausaAction()
    {
        $result = $this->objModel->getActiveCausa();
        $this->request->data = $result->data;
        $this->request->quantity = $result->quantity;
        $this->returnRequest();
    }

    function addCausaAction()
    {
        $values = json_decode($this->_request->getPost('values'));
        try {
            if ($values->descripcion == '')
                $values->descripcion = null;
            if ($values->abreviatura == '') {
                $values->abreviatura = null;
            }
            if ($values->fhasta == '')
                $values->fhasta = null;
            if ($this->objModel->addCausa($values)) {
                $this->request->success = true;
                $this->request->mensaje = "La causa de limitación ha sido adicionada satisfactoriamente.";
                $this->returnRequest();
            } else {
                $this->request->success = false;
                $this->request->mensaje = "Ha ocurrido un error mientras se adicionaban los datos.";
                $this->returnRequest();
            }
        } catch (Exception $e) {
            $this->request->success = false;
            $this->request->mensaje = $e->getMessage();
            $this->request->file = $e->getFile();
            $this->request->linea = $e->getLine();
            $this->returnRequest();
        }
    }

    function modCausaAction()
    {
        $idnomenclador = $this->_request->getPost('idnomenclador');
        $values = json_decode($this->_request->getPost('values'));
        try {
            $result = $this->objModel->modCausa(
                $idnomenclador, $values->denominacion, $values->denominacion, $values->descripcion, $values->fdesde, $values->fhasta
            );
            if ($result) {
                $this->request->success = true;
                $this->request->mensaje = "La causa de limitación ha sido modifcada satisfactoriamente.";
                $this->returnRequest();
            }
        } catch (Exception $e) {
            $this->request->success = false;
            $this->request->mensaje = $e->getMessage();
            $this->request->file = $e->getFile();
            $this->request->linea = $e->getLine();
            $this->returnRequest();
        }
    }

    function delCausaAction()
    {
        try {
            $arrIds = json_decode($this->_request->getPost('idnomenclador'));
            if (!empty($arrIds) && is_array($arrIds)) {
                $obj->idnomenclador = $arrIds;
            } else {
                throw new Exception("El arreglo de nomencladores est&aacute; vacío.");
            }
            foreach ($arrIds as $value) {
                $result = $this->objModel->delCausa($value);
            }
            if ($result->success != 0) {
                $this->request->success = true;
                $this->request->mensaje = "La causa de limitación ha sido eliminada satisfactoriamente.";
                $this->returnRequest();
            } else {
                $this->request->success = false;
                $this->request->mensaje = $result->mensaje;
                $this->returnRequest();
            }
        } catch (Exception $e) {
            $this->request->success = false;
            $this->request->mensaje = $e->getMessage();
            $this->request->file = $e->getFile();
            $this->request->linea = $e->getLine();
            $this->returnRequest();
        }
    }

    function showReportAction()
    {
        $formato = $this->_request->getParam('formato');
        $titulo = $this->_request->getParam('titulo');
        $usuario = json_decode($this->_request->getParam('usuario'));
        $fecha = json_decode($this->_request->getParam('fecha'));
        $header = json_decode($this->_request->getParam('header'));
        $tiporeporte = $this->_request->getParam('tiporeporte');
        if ($usuario == '1') {
            $usuario = $this->global->Perfil->usuario;
        }
        if ($fecha == '1') {
            //$fecha = gmdate("d/m/Y H:i:s");
            $fecha = date("F j, Y, g:i a");
        }
        $nomecladores = NomCausalimitacionModel::getAllCausa();
        $datos = array();
        foreach ($nomecladores->data as $key => $value) {
            $datos[$key]['numero'] = $key + 1;
            $datos[$key]['denominacion'] = $value['denominacion'];
            $datos[$key]['abreviatura'] = $value['abreviatura'];
            $datos[$key]['fdesde'] = $value['fdesde'];
            $datos[$key]['fhasta'] = $value['fhasta'];
            $datos[$key]['descripcion'] = $value['descripcion'];
        }
        if ($tiporeporte == 'listado') {
            ZendExt_IoC_Inter::getInstance()->comun->ExportarReporte(
                $formato, $titulo, $datos, $header, $usuario, $fecha, null
            );
        }
    }

}
