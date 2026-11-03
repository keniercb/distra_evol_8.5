<?php

class NomciudadaniaController extends ZendExt_Controller_Secure
{
    private $request;

    function init()
    {
        parent::init();
    }

    function nomciudadaniaAction()
    {
        $this->render();
    }

    function getCitizenshipAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $query = $this->_request->getPost('query');
        $objModel = new NomCiudadaniaModel();
        if ($query != '') {
            $result = $objModel->getActiveCitizenship($query, $limit, $start);
        } else {
            $result = $objModel->getActiveCitizenship(null, $limit, $start);
        }
        $this->request->data = $result->data;
        $this->request->quantity = $result->quantity;
        $this->returnRequest();
    }

    function returnRequest()
    {
        echo json_encode($this->request);
    }

    function addCitizenshipAction()
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
            if ($values->bandera != '') {
                $obj->bandera = $values->bandera;
            } else {
                throw new Exception("El campo bandera no puede estar vacio.");
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
            $objModel = new NomCiudadaniaModel();
            if ($objModel->addCitizenship($obj)) {
                $this->request->success = true;
                $this->request->mensaje = "La ciudadanía ha sido adicionado satisfactoriamente.";
                $this->returnRequest();
            } else {
                $this->request->success = false;
                $this->request->mensaje = "La ciudadanía que quiere adicionar ya existe.";
                $this->returnRequest();
            }
        } catch (Exception $e) {
            $this->request->success = false;
            $this->request->mensaje = $e->getMessage();
            $this->request->file = $e->getFile();
            $this->request->linea = $e->getLine();
            $this->returnRequest();
        }
    }

    function modCitizenshipAction()
    {
        $values = json_decode($this->_request->getPost('values'));
        $idnomenclador = $this->_request->getPost('idnomenclador');
        try {
            $objModel = new NomCiudadaniaModel();
            $result = $objModel->modCitizenship(
                $idnomenclador, $values->denominacion, $values->abreviatura, $values->descripcion, $values->bandera,
                $values->fdesde,
                $values->fhasta
            );
            if ($result) {
                $this->request->success = true;
                $this->request->mensaje = "La ciudadanía ha sido modifcado satisfactoriamente.";
                $this->returnRequest();
            } else {
                $this->request->success = false;
                $this->request->mensaje = "La ciudadanía que quiere adicionar ya existe.";
                $this->returnRequest();
            }
        } catch (Exception $e) {
            $this->request->success = false;
            $this->request->mensaje = $e->getMessage();
            $this->request->file = $e->getFile();
            $this->request->linea = $e->getLine();
            $this->returnRequest();
        }
    }

    function delCitizenshipAction()
    {
        try {
            $arrIds = json_decode($this->_request->getPost('idnomenclador'));
            if (!empty($arrIds) && is_array($arrIds)) {
                $obj->idnomenclador = $arrIds;
            } else {
                throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
            }
            $objModel = new NomCiudadaniaModel();
            foreach ($arrIds as $value) {
                $result = $objModel->delCitizenship($value);
            }
            if ($result) {
                /* $this->request->success = true;
                 $this->request->mensaje = "El documento ha sido eliminado satisfactoriamente.";
                 $this->returnRequest();*/
                if ($result['exception'] == 1) {
                    $this->request->success = false;
                    $this->request->codigo = 23503;
                    $this->request->mensaje = "la ciudadania no se podido eliminar debido porque esta en uso.";
                    $this->returnRequest();
                } else {
                    $this->request->success = true;
                    $this->request->mensaje = "La ciudadania ha sido eliminado satisfactoriamente.";
                    $this->returnRequest();
                }
            } else {
                $this->request->success = false;
                $this->request->mensaje = "La ciudadania no se puede eliminar.";
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
                 $obj->idciudadania = $arrIds;
             } else {
                 throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
             }
             $objModel = new NomCiudadaniaModel();
             foreach ($arrIds as $value) {
                 $result = $objModel->delCitizenship($value);
             }
             if ($result) {
                 $this->request->success = true;
                 $this->request->mensaje = "La ciudadanía ha sido eliminado satisfactoriamente.";
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
        $nomecladores = NomCiudadania::getActiveCitizenship();
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