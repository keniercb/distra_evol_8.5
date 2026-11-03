<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 17/06/16
 * Time: 17:49
 */
class NomtipoingresoController extends ZendExt_Controller_Secure
{
    protected $response;

    public function init()
    {
        parent::init();
    }

    public function responseRequest()
    {
        $this->response->success = isset($this->response->success) ? $this->response->success : TRUE;
        echo json_encode($this->response);
    }

    public function responseExceptions($error)
    {
        $this->response->success = FALSE;
        $this->response->codigo = $error->getCode();
        $this->response->mensaje = $error->getMessage();
        $this->response->traza = $error->getTraceAsString();
        $this->responseRequest();
    }

    public function nomtipoingresoAction()
    {

    }

    public function getTipoingresoAction()
    {
        try {
            $limit = $this->_getParam('limit');
            $start = $this->_getParam('start');
            $query = $this->_getParam('query');
            $objModel = new NomTipoingresoModel();
            if ($query != '') {
                //ver
                $this->response = $objModel->getTipoingresoActivo($query, $limit, $start);
            } else {
                //ver
                $this->response = $objModel->getTipoingresoActivo(null, $limit, $start);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    function addTipoingresoAction()
    {
        $values = json_decode($this->_request->getPost('values'));
        try {
            if ($values->denominacion != '') {
                $obj->denominacion = $values->denominacion;
            } else {
                throw new Exception("El campo denominacion no puede estar vacio.");
            }
            if ($values->abreviatura != '') {
                $obj->abreviatura = $values->abreviatura;
            } else {
                $obj->abreviatura = null;
            }
            if ($values->descripcion != '') {
                $obj->descripcion = $values->descripcion;
            } else {
                $obj->descripcion = null;
            }
            if ($values->fdesde != '') {
                $fi = explode('/', $values->fdesde);
                $obj->fdesde = $fi[2] . $fi[1] . $fi[0];
            } else {
                throw new Exception("El campo fecha de creacion no puede estar vacio.");
            }
            if ($values->fhasta != '') {
                $ff = explode('/', $values->fhasta);
                $obj->fhasta = $ff[2] . $ff[1] . $ff[0];
            } else {
                $obj->fhasta = null;
            }
            $objModel = new NomTipoingresoModel();
            if ($objModel->addTipoingreso($obj)) {
                $this->response->success = true;
            } else {
                $this->response->success = false;
                $this->response->mensaje = "El tipo de ingreso que quiere adicionar ya existe.";
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    function modTipoingresoAction()
    {
        $idnomenclador = $this->_request->getPost('idnomenclador');
        $values = json_decode($this->_request->getPost('values'));
        try {
            $objModel = new NomTipoingresoModel();
            $result = $objModel->modTipoingreso($idnomenclador, $values->denominacion, $values->abreviatura,
                $values->descripcion,$values->fdesde, $values->fhasta, $values->idparentesco
            );
            if ($result) {
                $this->response->success = true;
                $this->response->mensaje = "El tipo de ingreso ha sido modifcado satisfactoriamente.";
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    function delTipoingresoAction()
    {
        try {
            $arrIds = json_decode($this->_request->getPost('idnomenclador'));
            $objModel = new NomTipoingresoModel();
            $result = $objModel->delTipoingreso($arrIds);
            if ($result) {
                $this->response->success = true;
                $this->response->mensaje = "El tipo de ingreso ha sido eliminado satisfactoriamente.";
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    function showReportAction()
    {
        $formato = $this->_request->getParam('formato');
        $titulo = $this->_request->getParam('titulo');
        $usuario = json_decode($this->_request->getParam('usuario'));
        $fecha = json_decode($this->_request->getParam('fecha'));
        $params = json_decode($this->_request->getParam('params'));
        $header = json_decode($this->_request->getParam('header'));
        $tiporeporte = $this->_request->getParam('tiporeporte');
        if ($usuario == '1') {
            $usuario = $this->global->Perfil->usuario;
        }
        if ($fecha == '1') {
            //$fecha = gmdate("d/m/Y H:i:s");
            $fecha = date("F j, Y, g:i a");
        }
        $nomecladores = NomParentesco::getParentescoActivo();
        $datos = array();
        foreach ($nomecladores as $key => $value) {
            $datos[$key]['numero'] = $key + 1;
            $datos[$key]['denominacion'] = $value['denominacion'];
            $datos[$key]['abreviatura'] = $value['abreviatura'];
            $datos[$key]['fdesde'] = $value['fdesde'];
            $datos[$key]['fhasta'] = $value['fhasta'];
            $datos[$key]['descripcion'] = $value['descripcion'];
        }
        if ($tiporeporte == 'listado') {
            ZendExt_IoC_Inter::getInstance()->comun->ExportarReporte($formato, $titulo, $datos, $header, $usuario, $fecha, null);
        }
    }
}