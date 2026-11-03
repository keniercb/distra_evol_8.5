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

class NomregimentrabajoController extends ZendExt_Controller_Secure
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

    public function nomregimentrabajoAction()
    {
			$this->render('nomregimentrabajo');
    }

    public function getTipoRegimenTrabajoAction()
    {
        try {
            $limit = $this->_getParam('limit');
            $start = $this->_getParam('start');
            $query = $this->_getParam('query');
            $objModel = new NomRegimentrabajoModel();
            if ($query != '') {
                $this->response = $objModel->getTipoRegimenTrabajoActive($query, $limit, $start);
            } else {
                $this->response = $objModel->getTipoRegimenTrabajoActive(null, $limit, $start);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }
	
	public function getGrupoDescansoRegimenTrabajoAction()
    {
        try {
            $limit = $this->_getParam('limit');
            $start = $this->_getParam('start');
            $query = $this->_getParam('query');
			$idregimentrabajo= $this->_getParam('idregimentrabajo');			
            $objModel = new NomGrupodescansoModel();
            if ($query != '') {
                $this->response = $objModel->getGrupoDescansoActive($idregimentrabajo,$query, $limit, $start);
            } else {
                $this->response = $objModel->getGrupoDescansoActive($idregimentrabajo,null, $limit, $start);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    function addTipoRegimenTrabajoAction()
    {
		$denominacion= $this->_getParam('denominacion');
		$descripcion= $this->_getParam('descripcion');
		$fdesde= $this->_getParam('fdesde');
		$fhasta= $this->_getParam('fhasta');			
		$horastrabajo= $this->_getParam('horastrabajo');
        $tipofondotiempo= $this->_getParam('tipofondotiempo');
        $fondotiempo= $this->_getParam('fondotiempo');

        try {
            if ($denominacion != '') {
                $obj->denominacion = $denominacion;
            } else {
                throw new Exception("El campo denominación no puede estar vacio.");
            }
            if ($descripcion != '') {
                $obj->descripcion = $descripcion;
            } else {
                $obj->descripcion = null;
            }
            if ($fdesde != '') {
                $fi = explode('/', $fdesde);
                $obj->fdesde = $fi[2] . $fi[1] . $fi[0];
            } else {
                throw new Exception("El campo fecha de creación no puede estar vacio.");
            }
            if ($fhasta != '') {
                $ff = explode('/', $fhasta);
                $obj->fhasta = $ff[2] . $ff[1] . $ff[0];
            } else {
                $obj->fhasta = null;
            }
            $obj->horastrabajo = $horastrabajo;
            $obj->tipofondotiempo = $tipofondotiempo;
            if ($fondotiempo) {
                $obj->fondotiempo = $fondotiempo;
            } else {
                $obj->fondotiempo = 0;
            }

            $objModel = new NomRegimentrabajoModel();
            if ($objModel->addTipoRegimenTrabajo($obj)) {
                $this->response->success = true;
                $this->response->cod = 1;
            } else {
                $this->response->success = false;
                $this->response->cod = 3;
                $this->response->mensaje = "El régimen de trabajo ya existe.";
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    function modTipoRegimenTrabajoAction()
    {
        $model = new NomRegimentrabajoModel();
        $cambiodenom = $this->_request->getPost ('cambiodenom');
        if($cambiodenom == 'true')
        {
            $existe = $model->Existe($this->_request->getPost ('denominacion'));
        }
        if($cambiodenom == 'false' ||( $cambiodenom == 'true' && count($existe) == 0))
        {
            $obj = Doctrine::getTable('NomRegimentrabajo')->find($this->_request->getPost('idregimentrabajo'));
            $obj->denominacion = $this->_request->getPost ('denominacion');
            $obj->descripcion = $this->_request->getPost ('descripcion');
            $obj->fdesde = $this->_request->getPost ('fdesde');
            $obj->horastrabajo = $this->_request->getPost ('horastrabajo');
            $obj->tipofondotiempo = $this->_request->getPost ('tipofondotiempo');
            $fondotiempo = $this->_request->getPost ('fondotiempo');
            if ($fondotiempo) {
                $obj->fondotiempo = $fondotiempo;
            } else {
                $obj->fondotiempo = 0;
            }
            if($this->_request->getPost ('fhasta') == '')
                $ff = null;
            else
                $ff = $this->_request->getPost ('fhasta');
            $obj->fhasta = $ff;
            $model->Actualizar($obj);
            $r['cod'] =1;
            echo (json_encode ($r));
        }
        else
        {
            $r['cod'] =3;
            echo (json_encode ($r));
        }
    }
	
	function addGrupoDescansoAction()
    {
        $idregimentrabajo = $this->_getParam('idregimentrabajo');
		$denominacion= $this->_getParam('denominacion');
		$descripcion= $this->_getParam('descripcion');
		$fdesde= $this->_getParam('fdesde');
		$fhasta= $this->_getParam('fhasta');	
        try {
            if ($denominacion != '') {
                $obj->denominacion = $denominacion;
            } else {
                throw new Exception("El campo denominación no puede estar vacio.");
            }
            if ($descripcion != '') {
                $obj->descripcion = $descripcion;
            } else {
                $obj->descripcion = null;
            }
			 if ($idregimentrabajo != '') {
                $obj->idregimentrabajo = $idregimentrabajo;
            } else {
                $obj->descripcion = null;
            }
            if ($fdesde != '') {
                $fi = explode('/', $fdesde);
                $obj->fdesde = $fi[2] . $fi[1] . $fi[0];
            } else {
                throw new Exception("El campo fecha de creación no puede estar vacio.");
            }
            if ($fhasta != '') {
                $ff = explode('/', $fhasta);
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
                $this->response->mensaje = "El grupo de descanso ya existe.";
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        $this->responseRequest();
    }

    function modGrupoDescansoAction()
    {
        $model = new NomGrupodescansoModel();
        $cambiodenom = $this->_request->getPost ('cambiodenom');

        if($cambiodenom == 'true')
        {
            $existe = $model->ExisteGD($this->_request->getPost ('denominacion'), $this->_request->getPost ('idregimentrabajo'));
        }

        if($cambiodenom == 'false' ||( $cambiodenom == 'true' && count($existe) == 0))
        {
            $obj = Doctrine::getTable('NomGrupodescanso')->find($this->_request->getPost('idgrupodescanso'));

            $obj->denominacion = $this->_request->getPost ('denominacion');
            $obj->descripcion = $this->_request->getPost ('descripcion');
            $obj->fdesde = $this->_request->getPost ('fdesde');
            if($this->_request->getPost ('fhasta') == '')
                $ff = null;
            else
                $ff = $this->_request->getPost ('fhasta');
            $obj->fhasta = $ff;
            $model->Actualizar($obj);
            $r['cod'] =1;
            echo (json_encode ($r));
        }
        else
        {
            $r['cod'] =3;
            echo (json_encode ($r));
        }
    }

    function delTipoRegimenTrabajoAction()
    {
        $arrIds = json_decode(stripslashes($this->_request->getPost('idregimentrabajo')));
        if (!empty($arrIds) && is_array($arrIds)) {
            $obj->idregimentrabajo = $arrIds;
        }
        $objModel = new NomRegimentrabajoModel();
        $result = $objModel->delTipoRegimenTrabajo($arrIds);
        echo json_encode($result);
    }
	
    function delGrupoDescansoAction()
    {
           $arrIds = json_decode(stripslashes($this->_request->getPost('idregimentrabajo')));
            if (!empty($arrIds) && is_array($arrIds)) {
                $obj->idnomenclador = $arrIds;
            }
            $objModel = new NomGrupodescansoModel();
            $result = $objModel->delGrupoDescanso($arrIds);
        echo json_encode($result);
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
        $nomecladores = NomRegimentrabajo::getTipoRegimenTrabajoActive();
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

    function obtenerTurnoTrabajoAction()
    {
        $obj = new NomTurnotrabajoModel();
        $result = $obj->GetAll();
        $r['datos'] = $result;
        echo (json_encode ($r));
    }

    function getEstructurasAction()
    {
        try {
            if ($this->_getParam('node') == 0 && $this->_getParam('idestructura') != 0) {
                $id = $this->_getParam('idestructura');
            } else {
                $id = $this->_getParam('node');
            }

            $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($id);

            $datos = Array();
            $pos = 0;
            foreach ($r as $t => $est) {
                if ($est->idconcepto != 7) {
                    $datos[$pos] = $est;
                    if ($this->_getParam('idestructura')) {
                        if ($this->_getParam('check') == 1) {
                            $obj = new ConfEstructuras();
                            $existe = $obj->existeEntidadByPadre($this->_getParam('idestructura'), $est->id);
                            if (count($existe) > 0) {
                                $datos[$pos]->checked = true;
                            } else {
                                $datos[$pos]->checked = false;
                            }
                        } else {
                            $datos[$pos]->checked = false;
                        }

                    }
                    $pos++;
                }
            }

            echo json_encode($datos);
        } catch (Exception $e) {
            echo json_encode(Array());
        }
    }

} 