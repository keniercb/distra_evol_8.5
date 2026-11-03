<?php

/**
 * Class NomsituacionpersonaController
 */
class NomsituacionController extends ZendExt_Controller_Secure
{
    /**
     * Inicializa las variables necesarias
     */
    protected $response;
    protected $objSituacion;

    /**
     *
     */
    public function init()
    {
        parent::init();
    }

    /**
     *
     */
    public function nomsituacionAction()
    {

    }

    /**
     *
     */
    public function getAllSituationAction()
    {
        $this->objSituacion = $this->getInstanceOf();
        try {
            $activo = $this->_getParam('activo', true);
            $cargoAsociado = $this->_getParam('asociadocargo', false);
            $this->response = $this->objSituacion->getAllSituation($activo, $cargoAsociado);
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    private function getInstanceOf()
    {
        return $this->objSituacion instanceof NomSituacionModel ? $this->objSituacion : new NomSituacionModel();
    }

    public function responseRequest()
    {
        $this->response->success = isset($this->response->success) ? $this->response->success : true;
        echo json_encode($this->response);
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
    public function addSituationAction()
    {
        $values = json_decode($this->_request->getPost('values'));
        try {
            $obj->idpadre = $values->idpadre;
            $obj->asociadocargo = $values->asociadocargo;
            if ($values->denominacion != '') {
                $obj->denominacion = $values->denominacion;
            } else {
                throw new Exception("El campo denominacion no puede estar vacio.");
            }
            if ($values->color != '') {
                $obj->color = $values->color;
            } else {
                $obj->color = null;
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
            $objModel = new NomSituacionModel();
            if ($objModel->addSituation($obj)) {
                $this->response->success = true;
                $this->response->mensaje = "La situacion ha sido adicionado satisfactoriamente.";
            } else {
                $this->response->success = false;
                $this->response->mensaje = "La situacion que quiere adicionar ya existe.";
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    /**
     *
     */
    public function changeSituationAction()
    {
        $idsituacion = $this->_request->getPost('idsituacion');
        $values = json_decode($this->_request->getPost('values'));
        try {
            $objModel = new NomSituacionModel();
            $result = $objModel->changeSituation($idsituacion, $values);
            if ($result) {
                $this->response->success = true;
                $this->response->mensaje = "La situacion ha sido modifcado satisfactoriamente.";
            } else {
                $this->response->success = false;
                $this->response->mensaje = "La situacion que quiere modificar ya existe.";
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    /**
     *
     */
    public function removeSituationAction()
    {
        try {
            $arrIds = json_decode($this->_request->getPost('idsituacion'));
            if (!empty($arrIds) && is_array($arrIds)) {
                $obj->idsituacion = $arrIds;
            } else {
                throw new Exception("El arreglo de idsituacion est&aacute; vacio.");
            }
            $objModel = new NomSituacionModel();
            foreach ($arrIds as $value) {
                $result = $objModel->removeSituation($value);
            }
            if ($result->exception == 0) {
                $this->response->success = true;
                $this->response->mensaje = "La situacion de la persona ha sido eliminado satisfactoriamente.";
            } else {
                $this->response->success = false;
                $this->response->mensaje = "La situacion de la persona no se puede eliminar debido a que está en uso.";
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }
}