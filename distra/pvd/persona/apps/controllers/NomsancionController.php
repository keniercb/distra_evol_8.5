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

class NomsancionController extends ZendExt_Controller_Secure
{
    private $request;

    /**
     * Inicializa las variables necesarias
     */
    public function init()
    {
        parent::init();
    }

    public function nomsancionAction()
    {

    }

    public function getSanctionAction()
    {
        /*print_r($this->integrator->pvd->getDataByCampo(array(936,937),9));
        die;*/
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $query = $this->_request->getPost('query');
        $idtiposancion = $this->_request->getPost('idtiposancion');
        $objModel = new NomSancionModel();
        if ($query != '') {
            $result = $objModel->getSanctionActive($idtiposancion, $query, $limit, $start);
        } else {
            $result = $objModel->getSanctionActive($idtiposancion, null, $limit, $start);
        }
        $this->request->data = $result->data;
        $this->request->quantity = $result->quantity;
        $this->returnRequest();
    }

    function returnRequest()
    {
        echo json_encode($this->request);
    }

    function addSanctionAction()
    {
        $values = json_decode($this->_request->getPost('values'));
        try {
            $obj = $this->setObjSancion($values);
            $objModel = new NomSancionModel();
            if ($objModel->addSanction($obj)) {
                $this->request->success = true;
                $this->request->mensaje = "La sancion ha sido adicionado satisfactoriamente.";
                $this->returnRequest();
            } else {
                $this->request->success = false;
                $this->request->mensaje = "La sancion que quiere adicionar ya existe.";
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

    /**
     * @param $values
     *
     * @return StdClass
     * @throws Exception
     */
    protected function setObjSancion($values)
    {
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
        if ($values->tiemporehabilitacion != '') {
            $obj->tiemporehabilitacion = $values->tiemporehabilitacion;
        } else {
            $obj->tiemporehabilitacion = null;
        }
        if ($values->unidadtiempo != '') {
            $obj->unidadtiempo = $values->unidadtiempo;
        } else {
            $obj->unidadtiempo = null;
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
        $obj->idtiposancion = $values->idtiposancion;

        return $obj;
    }

    function modSanctionAction()
    {
        $idnomenclador = $this->_request->getPost('idnomenclador');
        $values = json_decode($this->_request->getPost('values'));
        try {
            $objModel = new NomSancionModel();
            $result = $objModel->modSanction(
                $idnomenclador, $values->denominacion, $values->abreviatura, $values->descripcion, $values->fdesde,
                $values->fhasta,
                $values->idtiposancion, $values->tiemporehabilitacion, $values->unidadtiempo
            );
            if ($result) {
                $this->request->success = true;
                $this->request->mensaje = "La sancion ha sido modifcado satisfactoriamente.";

            } else {
                $this->request->success = false;
            }
            $this->returnRequest();
        } catch (Exception $e) {
            $this->request->success = false;
            $this->request->mensaje = $e->getMessage();
            $this->request->file = $e->getFile();
            $this->request->linea = $e->getLine();
            $this->returnRequest();
        }
    }

    function delSanctionAction()
    {
        try {
            $arrIds = json_decode($this->_request->getPost('idnomenclador'));
            if (!empty($arrIds) && is_array($arrIds)) {
                $obj->idnomenclador = $arrIds;
            } else {
                throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
            }
            $objModel = new NomSancionModel();
            foreach ($arrIds as $value) {
                $result = $objModel->delSanction($value);
            }
            if ($result) {
                /* $this->request->success = true;
                 $this->request->mensaje = "El documento ha sido eliminado satisfactoriamente.";
                 $this->returnRequest();*/
                if ($result['exception'] == 1) {
                    $this->request->success = false;
                    $this->request->codigo = 23503;
                    $this->request->mensaje = "La sanción no se ha podido eliminar porque esta en uso.";
                    $this->returnRequest();
                } else {
                    $this->request->success = true;
                    $this->request->mensaje = "La sanción ha sido eliminado satisfactoriamente.";
                    $this->returnRequest();
                }
            } else {
                $this->request->success = false;
                $this->request->mensaje = "La sanción no se puede eliminar.";
                $this->returnRequest();
            }
        } catch (Exception $e) {
            $this->request->success = false;
            $this->request->mensaje = $e->getMessage();
            $this->request->file = $e->getFile();
            $this->request->linea = $e->getLine();
            $this->returnRequest();
        }
        /*try {
            $arrIds = json_decode($this->_request->getPost('idnomenclador'));
            $obj = new StdClass();
            if (!empty($arrIds) && is_array($arrIds)) {
                $obj->idnomenclador = $arrIds;
            } else {
                throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
            }
            $objModel = new NomSancionModel();
            foreach ($arrIds as $value) {
                $result = $objModel->delSanction($value);
            }
            if ($result) {
                $this->request->success = true;
                $this->request->mensaje = "La sancion ha sido eliminado satisfactoriamente.";
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
        $nomecladores = NomSancion::getSanctionActive();
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