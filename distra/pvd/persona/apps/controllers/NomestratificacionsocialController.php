<?php
$dirwww = $_SERVER["DOCUMENT_ROOT"];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dirrelmt = "/";
//Direccion absoluta del marco de trabajo
//$dirabsmt = str_replace("//", "/", dirname($dirwww . "..") . "/" . $dirrelmt);
$dirabsmt = str_replace("//", "/", str_replace('web','',$dirwww). $dirrelmt);
$config["include_path"] = get_include_path();
$config["include_path"] .= "" . PATH_SEPARATOR . $dirabsmt . "apps/pvd/persona/projects/models/bussines";
//Se inicializa el include path de php a partir de la variable de configuracion
set_include_path($config["include_path"]);

class NomestratificacionsocialController extends ZendExt_Controller_Secure
{
    private $request;

    /**
     * Inicializa las variables necesarias
     */
    public function init()
    {
        parent::init();
    }

    public function nomestratificacionsocialAction()
    {

    }

    public function getSocialStratificationAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $query = $this->_request->getPost('query');
        $objModel = new NomEstratificacionsocialModel();
        if ($query != '') {
            $result = $objModel->getSocialStratificationActive($query, $limit, $start);
        } else {
            $result = $objModel->getSocialStratificationActive(null, $limit, $start);
        }
        $this->request->data = $result->data;
        $this->request->quantity = $result->quantity;
        $this->returnRequest();
    }

    function returnRequest()
    {
        echo json_encode($this->request);
    }

    function addSocialStratificationAction()
    {
        $values = json_decode($this->_request->getPost('values'));
        try {
            $obj = new StdClass();
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
            $objModel = new NomEstratificacionsocialModel();
            if ($objModel->addSocialStratification($obj)) {
                $this->request->success = true;
                $this->request->mensaje = "La estratificacion social ha sido adicionado satisfactoriamente.";
                $this->returnRequest();
            } else {
                $this->request->success = false;
                $this->request->mensaje = "La estratificacion social que quiere adicionar ya existe.";
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

    function modSocialStratificationAction()
    {
        $idnomenclador = $this->_request->getPost('idnomenclador');
        $values = json_decode($this->_request->getPost('values'));
        try {
            $objModel = new NomEstratificacionsocialModel();
            $result = $objModel->modSocialStratification(
                $idnomenclador, $values->denominacion, $values->abreviatura, $values->descripcion, $values->fdesde,
                $values->fhasta
            );
            if ($result) {
                $this->request->success = true;
                $this->request->mensaje = "La estratificacion social ha sido modifcado satisfactoriamente.";
                $this->returnRequest();
            } else {
                $this->request->success = false;
                $this->request->mensaje = "La estratificacion social que quiere adicionar ya existe.";
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

    function delSocialStratificationAction()
    {
        try {
            $arrIds = json_decode($this->_request->getPost('idnomenclador'));
            if (!empty($arrIds) && is_array($arrIds)) {
                //$obj->idnomenclador = $arrIds;
            } else {
                throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
            }
            $objModel = new NomEstratificacionsocialModel();
            foreach ($arrIds as $value) {
                $result = $objModel->delSocialStratification($value);
            }
            if ($result) {
                /* $this->request->success = true;
                 $this->request->mensaje = "El documento ha sido eliminado satisfactoriamente.";
                 $this->returnRequest();*/
                if ($result['exception'] == 1) {
                    $this->request->success = false;
                    $this->request->codigo = 23503;
                    $this->request->mensaje = "La estratificación social no se podido eliminar porque esta en uso.";
                    $this->returnRequest();
                } else {
                    $this->request->success = true;
                    $this->request->mensaje = "La estratificación social ha sido eliminado satisfactoriamente.";
                    $this->returnRequest();
                }
            } else {
                $this->request->success = false;
                $this->request->mensaje = "La estratificación social no se puede eliminar.";
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
             $objModel = new NomEstratificacionsocialModel();
             foreach ($arrIds as $value) {
                 $result = $objModel->delSocialStratification($value);
             }
             if ($result) {
                 $this->request->success = true;
                 $this->request->mensaje = "La estratificacion social ha sido eliminado satisfactoriamente.";
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
        $header = json_decode($this->_request->getParam('header'));
        $tiporeporte = $this->_request->getParam('tiporeporte');
        if ($usuario == '1') {
            $usuario = $this->global->Perfil->usuario;
        }
        if ($fecha == '1') {
            //$fecha = gmdate("d/m/Y H:i:s");
            $fecha = date("F j, Y, g:i a");
        }
        $nomecladores = NomEstratificacionsocial::getSocialStratificationActive();
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