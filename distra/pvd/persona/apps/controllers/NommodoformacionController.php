<?php
$dirwww = $_SERVER["DOCUMENT_ROOT"];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dirRelMt = "/";
//Direccion absoluta del marco de trabajo
//$dirabsmt = str_replace("//", "/", dirname($dirwww . "..") . "/" . $dirRelMt);
$dirabsmt = str_replace("//", "/", str_replace('web','',$dirwww). $dirRelMt);
$config["include_path"] = get_include_path();
$config["include_path"] .= "" . PATH_SEPARATOR . $dirabsmt . "apps/pvd/persona/projects/models/bussines";
//Se inicializa el include path de php a partir de la variable de configuracion
set_include_path($config["include_path"]);

class NommodoformacionController extends ZendExt_Controller_Secure
{

    protected $response;
    protected $objModoformacion;

    /**
     * Inicializa las variables necesarias
     */
    public function init()
    {
        parent::init();
    }

    public function nommodoformacionAction()
    {

    }

    function returnRequest()
    {
        echo json_encode($this->request);
    }

    public function getModoFormacionAction()
    {
        try {
            $limit = $this->_getParam('limit');
            $start = $this->_getParam('start');
            $query = $this->_getParam('query');
            $objModel = new NomModoformacionModel();
            $this->response = $objModel->getAllModoformacion(true);
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

    function addModoFormacionAction()
    {
        $values = json_decode($this->_request->getPost('values'));
        try {
            $obj->idpadre = $values->idpadre;
            //$obj->asociadocargo = $values->asociadocargo;
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
            $objModel = new NomModoformacionModel();
            if ($objModel->addModo($obj)) {
                $this->response->success = true;
                $this->response->mensaje = "El modo de formacion ha sido adicionado satisfactoriamente.";
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

    function modModoFormacionAction()
    {
        $idmodoformacion = $this->_request->getPost('idmodoformacion');
        $values = json_decode($this->_request->getPost('values'));
        try {
            $objModel = new NomModoformacionModel();
            $result = $objModel->modModoFormacion($idmodoformacion, $values);
            if ($result) {
                $this->response->success = true;
                $this->response->mensaje = "El modo de formacion ha sido modifcado satisfactoriamente.";
            } else {
                $this->response->success = false;
                $this->response->mensaje = "La situacion que quiere modificar ya existe.";
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    function delModoFormacionAction()
    {
        /*  try {
              $arrIds = json_decode($this->_request->getPost('idnomenclador'));
              if (!empty($arrIds) && is_array($arrIds)) {
                  $obj->idnomenclador = $arrIds;
              } else {
                  throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
              }
              $objModel = new NomModoformacionModel();
              foreach ($arrIds as $value) {
                  $result = $objModel->removeModo($value);
              }

              if ($result) {
                  /* $this->request->success = true;
                   $this->request->mensaje = "El documento ha sido eliminado satisfactoriamente.";
                   $this->returnRequest();*/
        /*if ($result['exception'] == 1) {
            $this->response->success = false;
            $this->response->codigo = 23503;
            $this->response->mensaje = "El modo de formación no se podido eliminar porque esta en uso.";
            $this->returnRequest();
        } else {
            $this->response->success = true;
            $this->response->mensaje = "El modo de formación ha sido eliminado satisfactoriamente.";
            $this->returnRequest();
        }
    }
    else{
        $this->response->success = false;
        $this->response->mensaje = "El modo de formación no se puede eliminar.";
        $this->returnRequest();
    }
  } catch (Exception $e) {
    $this->response->success = false;
    $this->response->mensaje = $e->getMessage();
    $this->response->file = $e->getFile();
    $this->response->linea = $e->getLine();
    $this->returnRequest();
  }*/
        try {
            $arrIds = json_decode($this->_request->getPost('idmodoformacion'));
            if (!empty($arrIds) && is_array($arrIds)) {
                $obj->idmodoformacion = $arrIds;
            } else {
                throw new Exception("El arreglo de idmodoformacion est&aacute; vacio.");
            }
            $objModel = new NomModoformacionModel();
            foreach ($arrIds as $value) {
                $result = $objModel->removeModo($value);
            }
            if ($result->exception == 0) {
                $this->response->success = true;
                $this->response->mensaje = "El modo de formacion de la persona ha sido eliminado satisfactoriamente.";
            }
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
        $nomecladores = NomModoformacion::getModoFormacionActive();
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

    public function getAllModoformacionAction()
    {
        $this->objModoformacion = $this->getInstanceOf();
        try {
            $this->response = $this->objModoformacion->getAllSituation($this->_getParam('activo', true));
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    private function getInstanceOf()
    {
        return $this->objModoformacion instanceof
        NomModoformacionModel ? $this->objModoformacion : new NomModoformacionModel();
    }

}
