<?php

/**
 * Created by PhpStorm.
 * User: yOaN
 * Date: 17/09/14
 * Time: 15:12
 */
class NomtipoestanciaexteriorController extends ZendExt_Controller_Secure
{
    protected $response;

    /**
     * Inicializa las variables necesarias
     */
    public function init()
    {
        parent::init();
    }

    public function nomtipoestanciaexteriorAction()
    {

    }

    public function getTiposEstanciaExteriorAction()
    {
        try {
            $limit = $this->_request->getPost('limit');
            $start = $this->_request->getPost('start');
            $query = $this->_request->getPost('query');
            $objModel = new NomTipoestanciaexteriorModel();
            if ($query != '') {
                $result = $objModel->getTipoEstanciaExteriorActivos($query, $limit, $start);
            } else {
                $result = $objModel->getTipoEstanciaExteriorActivos(null, $limit, $start);
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

    public function addTipoEstanciaExteriorAction()
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
            $objModel = new NomTipoestanciaexteriorModel();
            if ($objModel->addTipoEstanciaExterior($obj)) {
                $this->response->success = true;
                $this->response->mensaje = "El tipo de estancia en el exterior ha sido adicionado satisfactoriamente.";
            } else {
                $this->response->success = false;
                $this->response->mensaje = "El tipo de estancia en el exterior que quiere adicionar ya existe.";
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    public function modTipoEstanciaExteriorAction()
    {
        $idnomenclador = $this->_request->getPost('idnomenclador');
        $values = json_decode($this->_request->getPost('values'));
        try {
            $objModel = new NomTipoestanciaexteriorModel();
            $result = $objModel->modTipoEstanciaExterior(
                $idnomenclador, $values->denominacion, $values->abreviatura, $values->descripcion, $values->fdesde,
                $values->fhasta
            );
            if ($result) {
                $this->response->success = true;
                $this->response->mensaje = "El tipo de estancia en el exterior ha sido modifcado satisfactoriamente.";
            } else {
                $this->response->success = false;
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    public function delTipoEstanciaExteriorAction()
    {
        try {
            $arrIds = json_decode($this->_request->getPost('idnomenclador'));
            if (!empty($arrIds) && is_array($arrIds)) {
                //$obj->idnomenclador = $arrIds;
            } else {
                throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
            }
            $objModel = new NomTipoestanciaexteriorModel();
            foreach ($arrIds as $value) {
                $result = $objModel->delTipoEstanciaExterior($value);
            }
            if ($result) {
                /* $this->request->success = true;
                 $this->request->mensaje = "El documento ha sido eliminado satisfactoriamente.";
                 $this->returnRequest();*/
                if ($result['exception'] == 1) {
                    $this->response->success = false;
                    $this->response->codigo = 23503;
                    $this->response->mensaje
                        = "El tipo de estancia en el exterior no se ha podido eliminar porque esta en uso.";
                    $this->responseRequest();
                } else {
                    $this->response->success = true;
                    $this->response->mensaje
                        = "El tipo de estancia en el exterior ha sido eliminado satisfactoriamente.";
                    $this->responseRequest();
                }
            } else {
                $this->response->success = false;
                $this->response->mensaje = "El tipo de estancia en el exterior no se puede eliminar.";
                $this->responseRequest();
            }
        } catch (Exception $e) {
            $this->response->success = false;
            $this->response->mensaje = $e->getMessage();
            $this->response->file = $e->getFile();
            $this->response->linea = $e->getLine();
            $this->responseRequest();
        }
        /* try {
             $arrIds = json_decode($this->_request->getPost('idnomenclador'));
             if (!empty($arrIds) && is_array($arrIds)) {
                 $obj->idnomenclador = $arrIds;
             } else {
                 throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
             }
             $objModel = new NomTipoestanciaexteriorModel();
             foreach ($arrIds as $value) {
                 $result = $objModel->delTipoEstanciaExterior($value);
             }
             if ($result) {
                 $this->response->success = true;
                 $this->response->mensaje = "El(Los) tipo de estancia en el exterior
                 ha(n) sido eliminado(s) satisfactoriamente.";
             }
         } catch (Exception $e) {
             $this->responseExceptions($e);
             return;
         }
         $this->responseRequest();*/
    }

    public function showReportAction()
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
        $nomecladores = NomTipoestanciaexterior::getTipoEstanciaExteriorActivos();
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