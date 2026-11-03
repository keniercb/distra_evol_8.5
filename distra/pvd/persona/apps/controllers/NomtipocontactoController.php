<?php

class NomtipocontactoController extends ZendExt_Controller_Secure
{
    private $request;

    function init()
    {
        parent::init();
    }

    function nomtipocontactoAction()
    {
        // $this->cargaInicial('persona', 'nomenclador');
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    function getTypeContactAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $query = $this->_request->getPost('query');
        $objModel = new NomTipocontactoModel();
        if ($query != '') {
            $result = $objModel->getActiveTypeContact($query, $limit, $start);
        } else {
            $result = $objModel->getActiveTypeContact(null, $limit, $start);
        }
        $this->request->data = $result->data;
        $this->request->quantity = $result->quantity;
        $this->returnRequest();
    }

    function returnRequest()
    {
        echo json_encode($this->request);
    }

    function addTypeContactAction()
    {
        $values = json_decode($this->_request->getPost('values'));
        $r->success = NomTipocontactoModel::addTypeContact(
            $values->denominacion, $values->abreviatura, $values->descripcion, $values->fdesde, $values->fhasta
        );
        echo json_encode($r);
    }

    function modTypeContactAction()
    {
        $idnomenclador = $this->_request->getPost('idnomenclador');
        $values = json_decode($this->_request->getPost('values'));
        try {
            $objModel = new NomTipocontactoModel();
            $result = $objModel->modTypeContact(
                $idnomenclador, $values->denominacion, $values->abreviatura, $values->descripcion, $values->fdesde, $values->fhasta
            );
            if ($result) {
                $this->request->success = true;
                $this->request->mensaje = "El tipo contacto sido modifcado satisfactoriamente.";
                $this->returnRequest();
            } else {
                $this->request->success = false;
            }
        } catch (Exception $e) {
            $this->request->success = false;
            $this->request->mensaje = $e->getMessage();
            $this->request->file = $e->getFile();
            $this->request->linea = $e->getLine();
            $this->returnRequest();
        }
    }

    function delTypeContactAction()
    {
        try {
            $arrIds = json_decode($this->_request->getPost('idnomenclador'));
            if (!empty($arrIds) && is_array($arrIds)) {
                //$obj->idnomenclador = $arrIds;
            } else {
                throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
            }
            $objModel = new NomTipocontactoModel();
            foreach ($arrIds as $value) {
                $result = $objModel->delTypeContact($value);
            }
            if ($result) {
                /* $this->request->success = true;
                 $this->request->mensaje = "El documento ha sido eliminado satisfactoriamente.";
                 $this->returnRequest();*/
                if ($result['exception'] == 1) {
                    $this->request->success = false;
                    $this->request->codigo = 23503;
                    $this->request->mensaje = "El tipo de contacto no se ha podido eliminar porque esta en uso.";
                    $this->returnRequest();
                } else {
                    $this->request->success = true;
                    $this->request->mensaje = "El tipo de contacto ha sido eliminado satisfactoriamente.";
                    $this->returnRequest();
                }
            } else {
                $this->request->success = false;
                $this->request->mensaje = "El tipo de contacto no se puede eliminar.";
                $this->returnRequest();
            }
        } catch (Exception $e) {
            $this->request->success = false;
            $this->request->mensaje = $e->getMessage();
            $this->request->file = $e->getFile();
            $this->request->linea = $e->getLine();
            $this->returnRequest();
        }
        /* try {
             $arrIds = json_decode($this->_request->getPost('idnomenclador'));
             if (!empty($arrIds) && is_array($arrIds)) {
                 $obj->idnomenclador = $arrIds;
             } else {
                 throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
             }
             $objModel = new NomTipocontactoModel();
             foreach ($arrIds as $value) {
                 $result = $objModel->delTypeContact($value);
             }
             if ($result) {
                 $this->request->success = true;
                 $this->request->mensaje = "El tipo de talla ha sido eliminado satisfactoriamente.";
                 $this->returnRequest();
             }
         } catch (Exception $e) {
             $this->request->success = false;
             $this->request->mensaje = $e->getMessage();
             $this->request->file = $e->getFile();
             $this->request->linea = $e->getLine();
             $this->returnRequest();
         }*/
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
        $nomecladores = NomTipocontacto::getActiveTypeContact();
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