<?php

class NomcategoriaController extends ZendExt_Controller_Secure
{
    protected $response;

    /**
     * Inicializa las variables necesarias
     */
    public function init()
    {
        parent::init();
    }

    public function nomcategoriaAction()
    {

    }

    public function getCategoriaAction()
    {
        try {
            $limit = $this->_getParam('limit');
            $start = $this->_getParam('start');
            $query = $this->_getParam('query');

            $idtipocategoria = $this->_getParam('idtipocategoria');
            $objModel = new NomCategoriaModel();

            if ($query != '') {
                $this->response = $objModel->getCategoriaActivo($idtipocategoria, $query, $limit, $start);
            } else {
                $this->response = $objModel->getCategoriaActivo($idtipocategoria, null, $limit, $start);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    /**
     * @param $error
     */
    public function responseExceptions($error)
    {
        $this->response->success = false;
        $this->response->codigo = $error->getCode();
        $this->response->mensaje = $error->getMessage();
        $this->response->traza = $error->getTraceAsString();
        $this->responseRequest();
    }

    /**
     *
     */
    public function responseRequest()
    {
        $this->response->success = isset($this->response->success) ? $this->response->success : true;
        echo json_encode($this->response);
    }

    function addCategoriaAction()
    {
        $values = json_decode($this->_request->getPost('values'));
        try {
            if ($values->denominacion != '') {
                $obj->denominacion = $values->denominacion;
            } else {
                throw new Exception("El campo denominacion no puede estar vacio.");
            }
            if ($values->idtipocategoria != '') {
                $obj->idtipocategoria = $values->idtipocategoria;
            } else {
                throw new Exception("El campo Tipo centro estudio no puede estar vacio.");
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
            $objModel = new NomCategoriaModel();
            if ($objModel->addCategoria($obj)) {
                $this->response->success = true;
            } else {
                $this->response->success = false;
                $this->response->mensaje = "La categoria que quiere adicionar ya existe.";
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    function modCategoriaAction()
    {
        $idnomenclador = $this->_request->getPost('idnomenclador');
        $values = json_decode($this->_request->getPost('values'));
        try {
            $objModel = new NomCategoriaModel();
            $result = $objModel->modCategoria(
                $idnomenclador, $values->denominacion, $values->abreviatura, $values->descripcion, $values->fdesde,
                $values->fhasta,
                $values->idtipocategoria
            );
            if ($result) {
                $this->response->success = true;
                $this->response->mensaje = "La categoria ha sido modifcado satisfactoriamente.";
            } else {
                $this->response->success = false;
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    function delCategoriaAction()
    {
        try {
            $arrIds = json_decode($this->_request->getPost('idnomenclador'));
            if (!empty($arrIds) && is_array($arrIds)) {
                //$obj->idnomenclador = $arrIds;
            } else {
                throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
            }
            $objModel = new NomCategoriaModel();
            foreach ($arrIds as $value) {
                $result = $objModel->delCategoria($value);
            }
            if ($result) {
                /* $this->request->success = true;
                 $this->request->mensaje = "El documento ha sido eliminado satisfactoriamente.";
                 $this->returnRequest();*/
                if ($result['exception'] == 1) {
                    $this->response->success = false;
                    $this->response->codigo = 23503;
                    $this->response->mensaje = "La categoría no se podido eliminar porque esta en uso.";
                    //$this->returnRequest();
                } else {
                    $this->response->success = true;
                    $this->response->mensaje = "La categoría  ha sido eliminado satisfactoriamente.";
                    //$this->returnRequest();
                }
            } else {
                $this->response->success = false;
                $this->response->mensaje = "La categoría no se puede eliminar.";
                //$this->returnRequest();
            }
        } catch (Exception $e) {
            $this->response->success = false;
            $this->response->mensaje = $e->getMessage();
            $this->response->file = $e->getFile();
            $this->response->linea = $e->getLine();
            //$this->returnRequest();
        }
        /*try {
            $arrIds = json_decode($this->_request->getPost('idnomenclador'));
            if (!empty($arrIds) && is_array($arrIds)) {
                $obj->idnomenclador = $arrIds;
            } else {
                throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
            }
            $objModel = new NomCategoriaModel();
            foreach ($arrIds as $value) {
                $result = $objModel->delCategoria($value);
            }
            if ($result) {
                $this->response->success = true;
                $this->response->mensaje = "La categoria ha sido eliminado satisfactoriamente.";
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }*/
        $this->responseRequest();
    }

    function returnRequest()
    {
        echo json_encode($this->request);
    }

    function showReportAction()
    {
        $formato = $this->_request->getParam('formato');
        $titulo = $this->_request->getParam('titulo');
        $usuario = json_decode($this->_request->getParam('usuario'));
        $fecha = json_decode($this->_request->getParam('fecha'));
        //$params = json_decode($this->_request->getParam('params'));
        $header = json_decode($this->_request->getParam('header'));
        $tiporeporte = $this->_request->getParam('tiporeporte');
        if ($usuario == '1') {
            $usuario = $this->global->Perfil->usuario;
        }
        if ($fecha == '1') {
            //$fecha = gmdate("d/m/Y H:i:s");
            $fecha = date("F j, Y, g:i a");
        }
        $nomecladores = NomCategoria::getCategoriaActivo();
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
            ZendExt_IoC_Inter::getInstance()->comun->ExportarReporte(
                $formato, $titulo, $datos, $header, $usuario, $fecha, null
            );
        }
    }
}