<?php

/**
 * Created by PhpStorm.
 * User: yOaN
 * Date: 18/09/14
 * Time: 11:21
 */
class NomestructransportacionController extends ZendExt_Controller_Secure
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

    public function nomestructransportacionAction()
    {

    }

    public function getEstrucTransportacionAction()
    {
        try {
            $objModel = new NomEstructransportacionModel();
            $this->response = $objModel->getEstrucTransportacion(true);
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

    public function addEstrucTransportacionAction()
    {
       $values = json_decode($this->_request->getPost('values'));
        try {
            if ($values->denominacion != '') {
                $obj->denominacion = $values->denominacion;
            } else {
                throw new Exception("El campo denominación no puede estar vacio.");
            }
            if ($values->fdesde != '') {
                $fi = explode('/', $values->fdesde);
                $obj->fdesde = $fi[2] . $fi[1] . $fi[0];
            } else {
                throw new Exception("El campo fecha de creación no puede estar vacio.");
            }
            if ($values->fhasta != '') {
                $ff = explode('/', $values->fhasta);
                $obj->fhasta = $ff[2] . $ff[1] . $ff[0];
            } else {
                $obj->fhasta = null;
            }
            $obj->idpadre= $values->idpadre;
            $objModel = new NomEstructransportacionModel();
            if ($objModel->addModo($obj)) {
                $this->response->success = true;
                //$this->response->mensaje = "La aptitud f&iacute;sica  ha sido adicionado satisfactoriamente.";
            } else {
                $this->response->success = false;
                //$this->response->mensaje = "La aptitud f&iacute;sica  que quiere adicionar ya existe.";
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    public function modEstrucTransportacionAction()
    {
        $idestructuratransportacion = $this->_request->getPost('idestructuratransportacion');
        $values = json_decode($this->_request->getPost('values'));
        try {
            $objModel = new NomEstructransportacionModel();
            $result = $objModel->modEstrucTransportacion($idestructuratransportacion, $values);
            if ($result) {
                $this->request->success = true;
                $this->request->mensaje = "La estructura de transportación ha sido modificada satisfactoriamente.";
                $this->returnRequest();
            } else {
                $this->request->success = false;
                $this->request->mensaje = "La estructura de transportación que desea adicionar ya existe.";
                $this->returnRequest();
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    public function delEstrucTransportacionAction()
    {
        try {
            $arrIds = json_decode($this->_request->getPost('idestructuratransportacion'));
           // print_r($arrIds);die;
            if (!empty($arrIds) && is_array($arrIds)) {
                $obj->idestructuratransportacion = $arrIds;
            } else {
                throw new Exception("El arreglo de idtipoformacion est&aacute; vacio.");
            }
            $objModel = new NomEstructransportacionModel();
            foreach ($arrIds as $value) {
                $result = $objModel->delEstrucTransportacion($value);

            }
            if ($result->exception == 0) {
                $this->response->success = true;
                $this->response->mensaje = "La estructura de alimentación ha sido eliminado satisfactoriamente.";
            } else {
                $this->response->success = false;
                $this->response->mensaje
                    = "La estructura de alimentación no
                se puede eliminar debido a que está en uso.";
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

    public function showReportAction()
    {
        /*$formato = $this->_request->getParam('formato');
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
        $nomecladores = NomAptitudfisica::getAptitudesFisicasActivos();
        $datos = array();
        foreach ($nomecladores as $key => $value) {
            $datos[$key]['numero'] = $key + 1;
            $datos[$key]['denominacion'] = $value['denominacion'];
            $datos[$key]['fdesde'] = $value['fdesde'];
            $datos[$key]['fhasta'] = $value['fhasta'];
            $datos[$key]['descripcion'] = $value['descripcion'];
        }
        if ($tiporeporte == 'listado') {
            ZendExt_IoC_Inter::getInstance()->comun->ExportarReporte(
                $formato, $titulo, $datos, $header, $usuario, $fecha, null
            );
        }*/
    }

}