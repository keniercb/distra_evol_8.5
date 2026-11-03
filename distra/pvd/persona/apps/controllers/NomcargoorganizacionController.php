<?php

class NomcargoorganizacionController extends ZendExt_Controller_Secure
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

    public function nomcargoorganizacionAction()
    {

    }

    public function getPositionInOrganizationAction()
    {
        $objModel = new NomCargoorganizacionModel();
        try {
            $filtro = $this->_getParam('query');
            $limit = $this->_getParam('limit');
            $start = $this->_getParam('start', 0);
            $result = $objModel->getPositionInOrganizationActive($filtro, $limit, $start);
            $this->response->data = $result->data;
            $this->response->quantity = $result->quantity;
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

    public function responseRequest()
    {
        $this->response->success = isset($this->response->success) ? $this->response->success : true;
        echo json_encode($this->response);
    }

    function addPositionInOrganizationAction()
    {
        $values = json_decode($this->_getParam('values'));
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
        try {
            $objModel = new NomCargoorganizacionModel();
            if ($objModel->addPositionInOrganization($obj)) {
                $this->response->success = true;
                $this->response->mensaje = "La organizacion ha sido adicionado satisfactoriamente.";
            } else {
                $this->response->success = false;
                $this->response->mensaje = "La organizacion que quiere adicionar ya existe.";
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    function modPositionInOrganizationAction()
    {
        $idnomenclador = $this->_request->getPost('idnomenclador');
        $values = json_decode($this->_request->getPost('values'));
        try {
            $objModel = new NomCargoorganizacionModel();
            $result = $objModel->modPositionInOrganization(
                $idnomenclador, $values->denominacion, $values->abreviatura, $values->descripcion, $values->fdesde,
                $values->fhasta
            );
            if ($result) {
                $this->response->success = true;
                $this->response->mensaje = "La organizacion ha sido modifcado satisfactoriamente.";
                $this->responseRequest();
            } else {
                $this->response->success = false;
                $this->response->mensaje = "La organizacion que quiere adicionar ya existe.";
                $this->responseRequest();
            }
        } catch (Exception $e) {
            $this->response->success = false;
            $this->response->mensaje = $e->getMessage();
            $this->response->file = $e->getFile();
            $this->response->linea = $e->getLine();
            $this->responseRequest();
        }
    }

    function delPositionInOrganizationAction()
    {
        try {
            $arrIds = json_decode($this->_request->getPost('idnomenclador'));
            if (!empty($arrIds) && is_array($arrIds)) {
                //$obj->idnomenclador = $arrIds;
            } else {
                throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
            }
            $objModel = new NomCargoorganizacionModel();
            foreach ($arrIds as $value) {
                $result = $objModel->delPositionInOrganization($value);
            }
            if ($result) {
                /* $this->request->success = true;
                 $this->request->mensaje = "El documento ha sido eliminado satisfactoriamente.";
                 $this->returnRequest();*/
                if ($result['exception'] == 1) {
                    $this->response->success = false;
                    $this->response->codigo = 23503;
                    $this->response->mensaje = "El cargo no se podido eliminar porque esta en uso.";
                    $this->returnRequest();
                } else {
                    $this->response->success = true;
                    $this->response->mensaje = "El cargo ha sido eliminado satisfactoriamente.";
                    $this->returnRequest();
                }
            } else {
                $this->response->success = false;
                $this->response->mensaje = "El cargo no se puede eliminar.";
                $this->returnRequest();
            }
        } catch (Exception $e) {
            $this->response->success = false;
            $this->response->mensaje = $e->getMessage();
            $this->response->file = $e->getFile();
            $this->response->linea = $e->getLine();
            $this->returnRequest();
        }

        /*  try {
              $arrIds = json_decode($this->_request->getPost('idnomenclador'));
              $objModel = new NomCargoorganizacionModel();
              $result = $objModel->delPositionInOrganization($arrIds);
              if ($result) {
                  $this->response->success = true;
                  $this->response->mensaje = "La organizacion ha sido eliminado satisfactoriamente.";
                  $this->responseRequest();
              }
          } catch (Exception $e) {
              $this->response->success = false;
              $this->response->mensaje = $e->getMessage();
              $this->response->file = $e->getFile();
              $this->response->linea = $e->getLine();
              $this->responseRequest();
          }*/
    }

    function returnRequest()
    {
        echo json_encode($this->response);
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
        $nomecladores = NomCargoorganizacion::getPositionInOrganizationActive();
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