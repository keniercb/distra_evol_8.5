<?php
$dir_www = $_SERVER["DOCUMENT_ROOT"];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dir_rel_mt = "/";
//Direccion absoluta del marco de trabajo
//$dir_abs_mt = str_replace("//", "/", dirname($dir_www . "..") . "/" . $dir_rel_mt);
$dir_abs_mt = str_replace("//", "/", str_replace('web','',$dir_www). $dir_rel_mt);
$config["include_path"] = get_include_path();
$config["include_path"] .= "" . PATH_SEPARATOR . $dir_abs_mt . "apps/pvd/persona/projects/models/bussines";
//Se inicializa el include path de php a partir de la variable de configuracion
set_include_path($config["include_path"]);

class NomtipoformacionController extends ZendExt_Controller_Secure
{
    protected $response;
    protected $objTipoformacion;

    /**
     * Inicializa las variables necesarias
     */
    public function init()
    {
        parent::init();
    }

    public function nomtipoformacionAction()
    {

    }

    public function getTipoFormacionAction()
    {
        try {
//            $limit = $this->_getParam('limit');
//            $start = $this->_getParam('start');
//            $query = $this->_getParam('query');
            $objModel = new NomTipoformacionModel();
            $this->response = $objModel->getAllTipoformacion(true);
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

    function addTipoFormacionAction()
    {
        $values = json_decode($this->_request->getPost('values'));
        try {
            $obj->idpadre = $values->idpadre;
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
            $objModel = new NomTipoformacionModel();
            if ($objModel->addModo($obj)) {
                $this->response->success = true;
                $this->response->mensaje = "El tipo de preparacion ha sido adicionado satisfactoriamente.";
            } else {
                $this->response->success = false;
                $this->response->mensaje = "La situacion que quiere adicionar ya existe.";
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    function modTipoFormacionAction()
    {
        $idtipoformacion = $this->_request->getPost('idtipoformacion');
        $values = json_decode($this->_request->getPost('values'));
        try {
            $objModel = new NomTipoformacionModel();
            $result = $objModel->modTipoFormacion($idtipoformacion, $values);
            if ($result) {
                $this->response->success = true;
                $this->response->mensaje = "El tipo de preparacion ha sido modifcado satisfactoriamente.";
            } /* else {
              $this->response->success = false;
              $this->response->mensaje = "La situacion que quiere modificar ya existe.";
              } */
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    function delTipoFormacionAction()
    {
        try {
            $arrIds = json_decode($this->_request->getPost('idtipoformacion'));
            if (!empty($arrIds) && is_array($arrIds)) {
                //$obj->idtipoformacion = $arrIds;
            } else {
                throw new Exception("El arreglo de idtipoformacion est&aacute; vacio.");
            }
            $objModel = new NomTipoformacionModel();
            foreach ($arrIds as $value) {
                $result = $objModel->removeModo($value);
            }
            if ($result->exception == 0) {
                $this->response->success = true;
                $this->response->mensaje = "El tipo de preparacion de la persona ha sido eliminado satisfactoriamente.";
            } /* else {
              $this->response->success = false;
              $this->response->mensaje = 
             * "El modo de formacion de la persona no se puede eliminar debido a que está en uso.";
              } */
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
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
            $fecha = date("F j, Y, g:i a");
        }
        $nomecladores = NomTipoformacion::getTipoFormacionActive();
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
        }
    }

    public function getAllTipoformacionAction()
    {
        $this->objTipoformacion = $this->getInstanceOf();
        try {
            $this->response = $this->objTipoformacion->getAllTipoformacion($this->_getParam('activo', true));
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }

    }

    private function getInstanceOf()
    {
        return $this->objTipoformacion instanceof
        NomTipoformacionModel ? $this->objTipoformacion : new NomTipoformacionModel();
    }

}