<?php
$dirwww = $_SERVER["DOCUMENT_ROOT"];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dirrelmt = "/";
//Direccion absoluta del marco de trabajo
$dirabsmt = str_replace("//", "/", dirname($dirwww . "..") . "/" . $dirrelmt);
$config["include_path"] = get_include_path();
$config["include_path"] .= "" . PATH_SEPARATOR . $dirabsmt . "apps/pvd/persona/projects/models/bussines";
//Se inicializa el include path de php a partir de la variable de configuracion
set_include_path($config["include_path"]);

class NomcategoriapersonaController extends ZendExt_Controller_Secure
{
    protected $objModel;
    private $request;

    function init()
    {
        parent::init();
        //$this->objModel = new NomCategoriapersonaModel();
    }

    function nomcategoriapersonaAction()
    {
        // $this->cargaInicial('persona', 'nomenclador');
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        // $this->render();
    }

    function getCategoriasAction()
    {
        try {
            $objModel = new NomCategoriapersonaModel();
            $this->response = $objModel->getCategorias(true);
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

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

    function addCategoriasAction()
    {
        $values = json_decode($this->_request->getPost('values'));
        try {
            $obj->idpadre = $values->idpadre;
            if ($values->denominacion != '') {
                $obj->denominacion = $values->denominacion;
            } else {
                throw new Exception("El campo denominacion no puede estar vacio.");
            }
            if ($values->alia != '') {
                $obj->alia = $values->alia;
            } else {
                $obj->alia = null;
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
            $objModel = new NomCategoriapersonaModel();
            if ($objModel->addModo($obj)) {
                $this->response->success = true;
                $this->response->mensaje = "El motivo de baja ha sido adicionado satisfactoriamente.";
            } else {
                $this->response->success = false;
                $this->response->mensaje = "El motivo de baja que quiere adicionar ya existe.";
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    function modCategoriasAction()
    {
        $idcategoriapersona = $this->_request->getPost('idcategoriapersona');
        $values = json_decode($this->_request->getPost('values'));
        try {
            $objModel = new NomCategoriapersonaModel();
            $result = $objModel->modCategorias($idcategoriapersona, $values);
            if ($result) {
                $this->request->success = true;
                $this->request->mensaje = "El motivo de baja ha sido modifcado satisfactoriamente.";
                $this->returnRequest();
            } else {
                $this->request->success = false;
                $this->request->mensaje = "El imotivo de bajaque quiere adicionar ya existe.";
                $this->returnRequest();
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    function returnRequest()
    {
        echo json_encode($this->request);
    }

    function delCategoriasAction()
    {
        try {
            $arrIds = json_decode($this->_request->getPost('idcategoriapersona'));
            if (!empty($arrIds) && is_array($arrIds)) {
                $obj->idcategoriapersona = $arrIds;
            } else {
                throw new Exception("El arreglo de idtipoformacion est&aacute; vacio.");
            }
            $objModel = new NomCategoriapersonaModel();
            foreach ($arrIds as $value) {
                $result = $objModel->removeModo($value);

            }
            if ($result->exception == 0) {
                $this->response->success = true;
                $this->response->mensaje = "El motivo de baja de la persona ha sido eliminado satisfactoriamente.";
            } else {
                $this->response->success = false;
                $this->response->mensaje
                    = "El modo de formacion de la persona no
                se puede eliminar debido a que está en uso.";
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
        $nomecladores = NomMotivobaja::getActiveLowMotive();
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

    public function getAllCategoriasAction()
    {
        $this->objModel = $this->getInstanceOf();
        try {
            $this->response = $this->objModel->getAllSituation($this->_getParam('activo', true));
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    private function getInstanceOf()
    {
        return $this->objModel instanceof NomCategoriapersonaModel ? $this->objModel : new NomCategoriapersonaModel();
    }
}