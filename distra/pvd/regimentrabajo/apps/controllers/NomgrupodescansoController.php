<?php
$dir_www = $_SERVER["DOCUMENT_ROOT"];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dir_rel_mt = "/";
//Direccion absoluta del marco de trabajo
$dir_abs_mt = str_replace("//", "/", dirname($dir_www . "..") . "/" . $dir_rel_mt);
$config["include_path"] = get_include_path();
$config["include_path"] .= "" . PATH_SEPARATOR . $dir_abs_mt . "apps/pvd/persona/controllers";
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

    public function responseRequest()
    {
        $this->response->success = isset($this->response->success) ? $this->response->success : TRUE;
        echo json_encode($this->response);
    }

    public function responseExceptions($error)
    {
        $this->response->success = FALSE;
        $this->response->codigo = $error->getCode();
        $this->response->mensaje = $error->getMessage();
        $this->response->traza = $error->getTraceAsString();
        $this->responseRequest();
    }

    public function nomgrupodescansoAction()
    {
			$this->render('nomgrupodescanso');
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

    function addGrupoDescansoAction()
    {
        $values = json_decode($this->_request->getPost('values'));
        try {
            if ($values->denominacion != '') {
                $obj->denominacion = $values->denominacion;
            } else {
                throw new Exception("El campo denominación no puede estar vacio.");
            }
            if ($values->idregimentrabajo != '') {
                $obj->idregimentrabajo = $values->idregimentrabajo;
            } else {
                throw new Exception("El campo régimen de trabajo no puede estar vacio.");
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
                throw new Exception("El campo fecha de creación no puede estar vacio.");
            }
            if ($values->fhasta != '') {
                $ff = explode('/', $values->fhasta);
                $obj->fhasta = $ff[2] . $ff[1] . $ff[0];
            } else {
                $obj->fhasta = null;
            }
            $objModel = new NomGrupodescansoModel();
            if ($objModel->addGrupoDescanso($obj)) {
                $this->response->success = true;
                $this->response->cod = 1;
            } else {
                $this->response->success = false;
                $this->response->cod = 3;
                $this->response->mensaje = "El régimen de trabajo que quiere adicionar ya existe.";
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    function modGrupoDescansoAction()
    {
        $idnomenclador = $this->_request->getPost('idnomenclador');
        $values = json_decode($this->_request->getPost('values'));
        try {
            $objModel = new NomGrupodescansoModel();
            $result = $objModel->modGrupoDescanso($idnomenclador, $values->denominacion, $values->descripcion, $values->fdesde, $values->fhasta);
            if ($result) {
                $this->response->success = true;
                $this->response->mensaje = "El régimen de trabajo ha sido modificado satisfactoriamente.";
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    function delGrupoDescansoAction()
    {
        $arrIds = json_decode($this->_request->getPost('idnomenclador'));
        if (!empty($arrIds) && is_array($arrIds)) {
            $obj->idnomenclador = $arrIds;
        }
        $objModel = new NomGrupodescansoModel();
        foreach ($arrIds as $value) {
            $resp = $objModel->delGrupoDescanso($value);
        }
        if ($resp == false) {
            $m->codMsg = 3;
            echo json_encode($m);
        } else {
            $m->codMsg = 1;
            echo json_encode($m);
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
            ZendExt_IoC_Inter::getInstance()->comunpersona->ExportarReporte($formato, $titulo, $datos, $header, $usuario, $fecha, null);
        }
    }

    function getEstructuraAction()
    {
        try {
            $result = Array();
            if ($this->_getParam('node') == 0 && $this->_getParam('idestructura') != 0) {
                $id = $this->_getParam('idestructura');
                $estr = ZendExt_IoC::getInstance()->metadatos->DameEstructura($id);
                array_push($result, $estr[0]);
            } else {
                $id = $this->_getParam('node');
                $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($id);
                foreach ($r as $est) {
                    if ($est->idconcepto == 7) {
                        $est->text = $est->text . " <b>($est->cantidad | $est->cantidad_real)</b>";
                    }
                    array_push($result, $est);
                }
            }
            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode(Array());
        }
    }

}