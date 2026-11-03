<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 26/06/16
 * Time: 15:27
 */
$dir_www = $_SERVER["DOCUMENT_ROOT"];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dir_rel_mt = "/";
//Direccion absoluta del marco de trabajo
//$dir_abs_mt = str_replace("//", "/", dirname($dir_www . "..") . "/" . $dir_rel_mt);
$dir_abs_mt = str_replace("//", "/", str_replace('web','',$dir_www). $dir_rel_mt);
$config["include_path"] = get_include_path();
$config["include_path"] .= "" . PATH_SEPARATOR . $dir_abs_mt . "apps/pvd/persona/controllers";
//Se inicializa el include path de php a partir de la variable de configuracion
set_include_path($config["include_path"]);

class NomAsignacionController extends ZendExt_Controller_Secure
{

    private $request;

    function init()
    {
        parent::init();
    }

    function returnRequest()
    {
        echo json_encode($this->request);
    }

    function nomasignacionAction()
    {

        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    function getAsignacionAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $query = $this->_request->getPost('query');
        $objModel = new NomAsignacionModel();
        if ($query != '') {
            $result = $objModel->getAsignacionActive($query, $limit, $start);
        } else {
            $result = $objModel->getAsignacionActive(null, $limit, $start);
        }
        $this->request->data = $result->data;
        $this->request->quantity = $result->quantity;
        $this->returnRequest();
    }

    function addAsignacionAction()
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

            $objModel = new NomAsignacionModel();
            if ($objModel->addAsignacion($obj)) {
                $this->request->success = true;
                $this->request->mensaje = "La asignacion ha sido adicionado satisfactoriamente.";
                $this->returnRequest();
            } else {/*
                $this->request->success = false;
                $this->request->mensaje = "La asignacion que quiere adicionar ya existe.";
                $this->returnRequest();*/
            }
        } catch (Exception $e) {
            $this->request->success = false;
            $this->request->mensaje = $e->getMessage();
            $this->request->file = $e->getFile();
            $this->request->linea = $e->getLine();
            $this->returnRequest();
        }
    }

    function modAsignacionAction()
    {
        $values = json_decode($this->_request->getPost('values'));
        $idnomenclador = $this->_request->getPost('idnomenclador');
        try {
            $objModel = new NomAsignacionModel();
            $result = $objModel->modAsignacion($idnomenclador, $values->denominacion, $values->abreviatura,
                $values->descripcion, $values->fdesde, $values->fhasta);
            if ($result) {
                $this->request->success = true;
                $this->request->mensaje = "La asignacion ha sido modifcado satisfactoriamente.";
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

    function delAsignacionAction()
    {
        try {
            $arrIds = json_decode($this->_request->getPost('idnomenclador'));
            if (!empty($arrIds) && is_array($arrIds)) {
                $obj->idnomenclador = $arrIds;
            } else {
                throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
            }
            $objModel = new NomAsignacionModel();
            foreach ($arrIds as $value) {
                $result = $objModel->delAsignacion($value);
            }
            if ($result) {
                $this->request->success = true;
                $this->request->mensaje = "La asignacion ha sido eliminado satisfactoriamente.";
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
        $nomecladores = NomAsignacion::getAsignacionActive();
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
            ZendExt_IoC_Inter::getInstance()->comun->ExportarReporte($formato, $titulo, $datos, $header, $usuario, $fecha, null);
        }
    }

}