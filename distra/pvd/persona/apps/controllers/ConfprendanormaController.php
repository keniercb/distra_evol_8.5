<?php

/**
 * Created by PhpStorm.
 * User: yOaN
 * Date: 18/09/14
 * Time: 11:21
 */
class ConfprendanormaController extends ZendExt_Controller_Secure
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

    public function confprendanormaAction()
    {

    }

    public function getConfiguracionAction()
    {
        //die('dgdlgk');
        try {
            $limit = $this->_request->getPost('limit');
            $start = $this->_request->getPost('start');
            // die('1');
            $query = $this->_request->getPost('query');
            $objModel = new ConfprendanormaModel();
            if ($query != '') {
                $result = $objModel->getConfiguracion($query, $limit, $start);
            } else {
                $result = $objModel->getConfiguracion(null, $limit, $start);
            }
            $this->response = $result;
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
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

    public function getPrendaAction()
    {

        $result = NomPrenda::getActiveWear();
        echo Zend_Json::encode(array('data' => $result, 'quantity' => count($result)));
    }

    public function getNormaAction()
    {
        $value=1;
        $result = NomNorma::getActiveNorm(null, null, null, $value);
        echo Zend_Json::encode(array('data' => $result, 'quantity' => count($result)));
    }

    public function getTallaAction()
    {
        $value=1;
        $result = NomTalla::getActiveSize(null, null, null, $value);
        echo Zend_Json::encode(array('data' => $result, 'quantity' => count($result)));
    }

    public function addConfiguracionAction()
    {

        try {
            $obj->idprenda = $this->_request->getPost('idprenda');
            $obj->idnorma = $this->_request->getPost('idnorma');
            $obj->idtalla = $this->_request->getPost('idtalla');

            $objModel = new ConfprendanormaModel();
            if ($objModel->addConfiguracion($obj)) {
                $this->response->success = true;
            } else {
                $this->response->success = false;

            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    public function modConfiguracionAction()
    {
        $idnomenclador = $this->_request->getPost('idnomenclador');

        try {
            $objModel = new ConfprendanormaModel();
            $result = $objModel->modConfiguracion(
                $idnomenclador, $this->_request->getPost('idprenda'), $this->_request->getPost('idnorma'), $this->_request->getPost('idtalla')
            );
            if ($result) {
                $this->response->success = true;
            } else {
                $this->response->success = false;

            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    public function delConfiguracionAction()
    {
        try {
            $arrIds = json_decode($this->_request->getPost('idnomenclador'));
            if (!empty($arrIds) && is_array($arrIds)) {
            } else {
                throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
            }
            $objModel = new ConfprendanormaModel();
            foreach ($arrIds as $value) {
                $result = $objModel->delConfiguracion($value);
            }
            if ($result) {
                if ($result['exception'] == 1) {
                    $this->response->success = false;
                    $this->response->codigo = 23503;

                } else {
                    $this->response->success = true;


                }

            }
        } catch (Exception $e) {
            $this->response->success = false;
            $this->response->mensaje = $e->getMessage();
            $this->response->file = $e->getFile();
            $this->response->linea = $e->getLine();
            //$this->returnRequest();
        }
        $this->responseRequest();
    }

    function returnRequest()
    {
        echo json_encode($this->request);
    }

    public function showReportAction()
    {
        /* $formato = $this->_request->getParam('formato');
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
         $nomecladores =NomAsigdefensa::getAsiganacionDefensa();
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