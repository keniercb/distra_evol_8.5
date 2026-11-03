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

class NomtituloController extends ZendExt_Controller_Secure
{
    protected $request;

    public function init()
    {
        parent::init();
    }

    public function nomtituloAction()
    {

    }

    public function getTitleAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $query = $this->_request->getPost('query');
        $objModel = new NomTituloModel();
        if ($query != '') {
            $result = $objModel->getTitleActive($query, $limit, $start);
        } else {
            $result = $objModel->getTitleActive(null, $limit, $start);
            
        }
        $this->request->data = $result->data;
        $this->request->quantity = $result->quantity;
        $this->returnRequest();
    }

    function returnRequest()
    {
        echo json_encode($this->request);
    }

    public function getEspecialidadesArbolAction()
    {
        try {
            $objModel = new NomTituloModel();
            if ($this->_getParam('node', 'root') === 'root') {
                $r = $objModel->getRoot();
            } else {
                $r = $objModel->getEspecialidades($this->_getParam('node'));
            }
            $this->request = $r;
        } catch (Exception $e) {
            $this->request->success = false;
            $this->request->mensaje = $e->getMessage();
            $this->request->file = $e->getFile();
            $this->request->linea = $e->getLine();
            $this->returnRequest();

            return;
        }
        $this->returnRequest();
    }

    function addTitleAction()
    {
        $values = json_decode($this->_request->getPost('values'));
        try {
            $obj = $this->setTituloObj($values);
            $objModel = new NomTituloModel();
            if ($objModel->addTitle($obj)) {
                $this->request->success = true;
                $this->request->mensaje = "El título ha sido adicionado satisfactoriamente.";
                $this->returnRequest();
            } else {
                $this->request->success = false;
                $this->request->mensaje = "El título que quiere adicionar ya existe.";
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
    protected function setTituloObj($values)
    {
        $obj = new StdClass();
        if ($values->denominacion != '') {
            $obj->denominacion = $values->denominacion;
        } else {
            throw new Exception("El campo denominacion no puede estar vacio.");
        }
        if ($values->idniveleducacional != '') {
            $obj->idniveleducacional = $values->idniveleducacional;
        } else {
            $obj->idniveleducacional = null;
        }
        if ($values->codigo != '') {
            $obj->codigo = $values->codigo;
        } else {
            $obj->codigo = null;
        }
        if ($values->idespecialidad != '') {
            $obj->idespecialidad = $values->idespecialidad;
        } else {
            $obj->idespecialidad = null;
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

            return $obj;
        } else {
            $obj->fhasta = null;

            return $obj;
        }
    }

    function modTitleAction()
    {
        $idnomenclador = $this->_request->getPost('idnomenclador');
        $values = json_decode($this->_request->getPost('values'));
        try {
            $objModel = new NomTituloModel();
            $result = $objModel->modTitle(
                $idnomenclador, $values->denominacion, $values->abreviatura, $values->descripcion, $values->fdesde,
                $values->fhasta,
                $values->idniveleducacional, $values->idespecialidad, $values->codigo
            );
            if ($result) {
                $this->request->success = true;
                $this->request->mensaje = "El título ha sido modifcado satisfactoriamente.";
                $this->returnRequest();
            } else {
                $this->request->success = false;
                $this->request->mensaje = "El título que quiere adicionar ya existe.";
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

    function delTitleAction()
    {
        try {
            $arrIds = json_decode($this->_request->getPost('idnomenclador'));
            $obj = new StdClass();
            if (!empty($arrIds) && is_array($arrIds)) {
                $obj->idnomenclador = $arrIds;
            } else {
                throw new Exception("El arreglo de idnomenclador est&aacute; vacio.");
            }
            $objModel = new NomTituloModel();
            foreach ($arrIds as $value) {
                $result = $objModel->delTitle($value);
            }
            if ($result) {
                $this->request->success = true;
                $this->request->mensaje = "El título ha sido eliminado satisfactoriamente.";
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
        $header = json_decode($this->_request->getParam('header'));
        $tiporeporte = $this->_request->getParam('tiporeporte');
        if ($usuario == '1') {
            $usuario = $this->global->Perfil->usuario;
        }
        if ($fecha == '1') {
            //$fecha = gmdate("d/m/Y H:i:s");
            $fecha = date("F j, Y, g:i a");
        }
        $nomecladores = NomTitulo::getTitleActive();
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