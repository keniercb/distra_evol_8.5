<?php
$dirwww = $_SERVER["DOCUMENT_ROOT"];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dirrelmt = "/";
//Direccion absoluta del marco de trabajo
//$dirabsmt = str_replace("//", "/", dirname($dirwww . "..") . "/" . $dirrelmt);
$dirabsmt = str_replace("//", "/", str_replace('web','',$dirwww). $dirrelmt);
$config["include_path"] = get_include_path();
$config["include_path"] .= "" . PATH_SEPARATOR . $dirabsmt . "apps/pvd/persona/controllers";
//Se inicializa el include path de php a partir de la variable de configuracion
set_include_path($config["include_path"]);

/**
 *Clase NomgrupodescansoController
 */
class NomgrupodescansoController extends ZendExt_Controller_Secure
{
    protected $response;

    /**
     * Inicializa las variables necesarias
     */
    public function init()
    {
        parent::init();
    }

    public function nomgrupodescansoAction()
    {

    }

    public function getGrupoDescansoAction()
    {
        try {
            $limit = $this->_getParam('limit');
            $start = $this->_getParam('start');
            $query = $this->_getParam('query');
            $idregimentrabajo = $this->_getParam('idregimentrabajo');
            $objModel = new NomGrupodescansoModel();
            if ($query != '') {
                $this->response = $objModel->getGrupoDescansoActive($idregimentrabajo, $query, $limit, $start);
            } else {
                $this->response = $objModel->getGrupoDescansoActive($idregimentrabajo, null, $limit, $start);
            }
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

    /**
     *
     */
    public function responseRequest()
    {
        $this->response->success = isset($this->response->success) ? $this->response->success : true;
        echo json_encode($this->response);
    }

    /**
     *
     */
    function addGrupoDescansoAction()
    {
        $values = json_decode($this->_request->getPost('values'));
        try {
            $obj = new StdClass();
            $this->validateValues($values, $obj);
            $objModel = new NomGrupodescansoModel();
            if ($objModel->addGrupoDescanso($obj)) {
                $this->response->success = true;
            } else {
                $this->response->success = false;
                $this->response->mensaje = "El tipo de regimen de trabajo que quiere adicionar ya existe.";
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    /**
     * @param $values
     * @param $obj
     *
     * @throws Exception
     */
    private function validateValues($values, $obj)
    {
        if ($values->denominacion != '') {
            $obj->denominacion = $values->denominacion;
        } else {
            throw new Exception("El campo denominacion no puede estar vacio.");
        }
        if ($values->idregimentrabajo != '') {
            $obj->idregimentrabajo = $values->idregimentrabajo;
        } else {
            throw new Exception("El campo idregimentrabajo no puede estar vacio.");
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
    }

    function modGrupoDescansoAction()
    {
        $idnomenclador = $this->_request->getPost('idnomenclador');
        $values = json_decode($this->_request->getPost('values'));
        try {
            $objModel = new NomGrupodescansoModel();
            $result = $objModel->modGrupoDescanso(
                $idnomenclador, $values->denominacion, $values->descripcion, $values->fdesde, $values->fhasta
            );
            if ($result) {
                $this->response->success = true;
                $this->response->mensaje = "El tipo de regimen de trabajo ha sido modifcado satisfactoriamente.";
            } else {
                $this->response->success = false;
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    function delGrupoDescansoAction()
    {
        try {
            $arrIds = json_decode($this->_request->getPost('idnomenclador'));
            if (!empty($arrIds) && is_array($arrIds)) {
                //$obj->idnomenclador = $arrIds;
            } else {
                throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
            }
            $objModel = new NomGrupodescansoModel();
            foreach ($arrIds as $value) {
                $result = $objModel->delGrupoDescanso($value);
            }
            if ($result) {
                $this->response->success = true;
                $this->response->mensaje = "El tipo de regimen de trabajo ha sido eliminado satisfactoriamente.";
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
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
        $nomecladores = NomGrupodescanso::getGrupoDescansoActive();
        $datos = array();
        foreach ($nomecladores as $key => $value) {
            $datos[$key]['numero'] = $key + 1;
            $datos[$key]['denominacion'] = $value['denominacion'];
            $datos[$key]['fdesde'] = $value['fdesde'];
            $datos[$key]['fhasta'] = $value['fhasta'];
            $datos[$key]['descripcion'] = $value['descripcion'];
        }
        if ($tiporeporte == 'listado') {
            ZendExt_IoC_Inter::getInstance()->comunpersona->ExportarReporte(
                $formato, $titulo, $datos, $header, $usuario, $fecha, null
            );
        }
    }
}