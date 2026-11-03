<?php

/**
 * Created by PhpStorm.
 * User: yOaN
 * Date: 18/09/14
 * Time: 11:21
 */
class NomestructalojamientoController extends ZendExt_Controller_Secure
{
    protected $response;

    //private $request;
    /**
     * Inicializa las variables necesarias
     */
    public function init()
    {
        parent::init();
    }

    public function nomestructalojamientoAction()
    {

    }

   public function getEstructAlojamientoAction()
    {
        try {
            $objModel = new NomestructalojamientoModel();
            $this->response = $objModel->getEstructAlojamiento(true);

        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    public function responseRequest()
    {
        $this->response->success = isset($this->response->success) ? $this->response->success : true;
        echo json_encode($this->response);
    }

    public function responseExceptions($error)
    {
        $this->response->success = false;
        $this->response->codigo = $error->getCode();
        $this->response->mensaje = $error->getMessage();
        $this->response->traza = $error->getTraceAsString();
        $this->responseRequest();
    }

    public function addEstructAlojamientoAction()
    {
        $values = json_decode($this->_request->getPost('values'));

        try {
            if ($values->denominacion != '') {
                $obj->denominacion = $values->denominacion;
            } else {
                throw new Exception("El campo denominacion no puede estar vacio.");
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
            $obj->idpadre = $values->idpadre;
            $objModel = new NomestructalojamientoModel();
            if ($objModel->addEstructAlojamiento($obj)) {
                $this->response->success = true;
                // $this->response->mensaje = "La aptitud f&iacute;sica  ha sido adicionado satisfactoriamente.";
            } else {
                $this->response->success = false;
                // $this->response->mensaje = "La aptitud f&iacute;sica  que quiere adicionar ya existe.";
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    public function modEstructAlojamientoAction()
    {
        $idestructuraalojamiento = $this->_request->getPost('idestructuraalojamiento');
        $values = json_decode($this->_request->getPost('values'));
        //print_r($idestructuraalojamiento);die;
        try {

            $objModel = new NomestructalojamientoModel();
            $result = $objModel->modEstructAlojamiento($idestructuraalojamiento, $values);

            if ($result) {
                $this->request->success = true;
                $this->request->mensaje = "La estructura de alojamiento ha sido modificada satisfactoriamente.";
                $this->returnRequest();
            } else {
                $this->request->success = false;
                $this->request->mensaje = "La estructura de alojamiento quiere adicionar ya existe.";
                $this->returnRequest();
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    public function delEstructAlojamientoAction()
    {

        try {
            $arrIds = json_decode($this->_request->getPost('idestructuraalojamiento'));

            if (!empty($arrIds) && is_array($arrIds)) {
                $obj->idestructuraalojamiento = $arrIds;
            } else {
                throw new Exception("El arreglo de idtipoformacion est&aacute; vacio.");
            }
            $objModel = new NomestructalojamientoModel();
            foreach ($arrIds as $value) {
                $result = $objModel->delEstructAlojamiento($value);

            }

            if ($result->exception == 0) {
                $this->response->success = true;
                //  $this->response->mensaje = "La estructura de alojamiento ha sido eliminado satisfactoriamente.";
            } else {
                $this->response->success = false;
                //  $this->response->mensaje = "La estructura de alojamiento no  se puede eliminar debido a que está en uso.";
            }
            $this->responseRequest();


        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }

    }


    function returnRequest()
    {
        echo json_encode($this->request);
    }


}