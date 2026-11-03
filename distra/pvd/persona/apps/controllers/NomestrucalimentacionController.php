<?php

/**
 * Created by PhpStorm.
 * User: yOaN
 * Date: 18/09/14
 * Time: 11:21
 */
class NomestrucalimentacionController extends ZendExt_Controller_Secure
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

    public function nomestrucalimentacionAction()
    {

    }

    public function getEstrucAlimentacionAction()
    {
        /* echo json_encode(NomAptitudfisicaModel::getAptitudesFisicasActivas(
            $this->_request->getPost('query'),
            $this->_request->getPost('limit'),
            $this->_request->getPost('start')
        ));*/
 /*       try {
            $limit = $this->_request->getPost('limit');
            $start = $this->_request->getPost('start');
            $query = $this->_request->getPost('query');
            $objModel = new NomAptitudfisicaModel();
            if ($query != '') {
                $result = $objModel->getAptitudesFisicasActivas($query, $limit, $start);
            } else {
                $result = $objModel->getAptitudesFisicasActivas(null, $limit, $start);
            }
            $this->response = $result;
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }*/
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

    public function addEstrucAlimentacionAction()
    {
        /*$values = json_decode($this->_request->getPost('values'));
        try {
            if ($values->denominacion != '') {
                $obj->denominacion = $values->denominacion;
            } else {
                throw new Exception("El campo denominacion no puede estar vacio.");
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
            $objModel = new NomAptitudfisicaModel();
            if ($objModel->addAptitudesFisicas($obj)) {
                $this->response->success = true;
                $this->response->mensaje = "La aptitud f&iacute;sica  ha sido adicionado satisfactoriamente.";
            } else {
                $this->response->success = false;
                $this->response->mensaje = "La aptitud f&iacute;sica  que quiere adicionar ya existe.";
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();*/
    }

    public function modEstrucAlimentacionAction()
    {
        /*$idnomenclador = $this->_request->getPost('idnomenclador');
        $values = json_decode($this->_request->getPost('values'));
        try {
            $objModel = new NomAptitudfisicaModel();
            $result = $objModel->modAptitudesFisicas(
                $idnomenclador, $values->denominacion, $values->descripcion, $values->fdesde, $values->fhasta
            );
            if ($result) {
                $this->response->success = true;
                $this->response->mensaje = "La aptitud f&iacute;sica  ha sido modifcado satisfactoriamente.";
            } else {
                $this->response->success = false;
                $this->response->mensaje = "La aptitud f&iacute;sica modificar ya existe.";
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();*/
    }

    public function delEstrucAlimentacionAction()
    {
       /* try {
            $arrIds = json_decode($this->_request->getPost('idnomenclador'));
            if (!empty($arrIds) && is_array($arrIds)) {
                //$obj->idnomenclador = $arrIds;
            } else {
                throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
            }
            $objModel = new NomAptitudfisicaModel();
            foreach ($arrIds as $value) {
                $result = $objModel->delAptitudesFisicas($value);
            }
            if ($result) {
                if ($result['exception'] == 1) {
                    $this->response->success = false;
                    $this->response->codigo = 23503;
                    $this->response->mensaje
                        = "El(Los) tipo de actitud física  ha(n) sido eliminado(s) satisfactoriamente.";
                    //$this->returnRequest();
                } else {
                    $this->response->success = true;
                    $this->response->mensaje = "El tipo de aptitud física ha sido eliminado satisfactoriamente.";

                }

            }
        } catch (Exception $e) {
            $this->response->success = false;
            $this->response->mensaje = $e->getMessage();
            $this->response->file = $e->getFile();
            $this->response->linea = $e->getLine();
            //$this->returnRequest();
        }
        $this->responseRequest();*/
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