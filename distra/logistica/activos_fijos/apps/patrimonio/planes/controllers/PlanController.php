<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication.'/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path().PATH_SEPARATOR.$config['include_path']);
}

class PlanController extends BaseController /* ZendExt_Controller_Secure */
{
    private $objModel, $sSeguridad, $sEstrucComp;

    public function init()
    {
        $this->objModel = new PlanModel();
        parent :: init('log.aft.planespatrimonio');
        $this->sSeguridad = ServiciosSeguridadHelper::__init();
        $this->sEstrucComp = ServiciosEstructuraComposicionHelper::__init();
    }

    public function planAction()
    {
        // $this->render();
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.planespatrimonio');
        $this->renderTemplate();
    }

    public function modificarplanAction()
    {
        $parametros = $this->uiParams;
        $modPlan = $this->objModel->modificarPlan($parametros);
        if ($modPlan == true)
            $this->msg = 1;
        else
            $this->msg = 3;
    }

    public function cargarplanesAction()
    {
        if ($this->uiParams['idestructuracomun']) {
            $idestructuracomun = $this->uiParams['idestructuracomun'];
        } else {
            $idestructuracomun = $this->global->Estructura->idestructura;
        }
        $parametros = $this->uiParams;
        $parametros['idestructuraop'] = $idestructuracomun;        
        $arrDatos = $this->objModel->cargarPlanes($parametros);
        $this->datos = $arrDatos;
        $this->total = count($arrDatos);
    }

    public function adicionarplanAction()
    {
        $repuesta = $this->objModel->adicionarPlanes(json_decode(stripcslashes($this->_request->getPost('datosplan'))));
        $this->msg = $repuesta;
    }

    public function eliminarplanAction()
    {
        try {
            $eliminado = $this->objModel->eliminarplan(
                json_decode(stripcslashes($this->_request->getPost('arrayidplan')))
            );
            $this->msg = 1;
        } catch (Exception $e) {
            $this->msg = 2;
            $this->error = $e->getMessage();
        }


        //echo json_encode(array('Msg' => 0));
    }

    public function confaprobarcancelarplanAction()
    {        
        $parametros = $this->uiParams;
        $parametros['idplan'] = json_decode(stripcslashes($this->_request->getPost('idplan')));        
        $confirmar = $this->objModel->confaprobarcancelarplan($parametros);
        $this->msg = $confirmar;
    }

    public function cargarespecialidadAction()
    {
        $especialidad = $this->objModel->cargarEspecialidad();
        $this->datos = $especialidad;
        $this->total = count($especialidad);
        // echo json_encode($especialidad);
    }

    public function getentidadAction()
    {
        $cEstructura = 'Estructura';
        $cPerfil = 'Perfil';
        $identidades = $this->sSeguridad->obtenerEstructurasFormales($this->global->$cPerfil->certificado);
        $idestructuraEntrada = $this->global->$cEstructura->idestructura;
        $index = 0;
        foreach ($identidades as $id) {
            $ent = $this->sEstrucComp->getEstructura($id);
            if ($ent[0]->idpadre == $idestructuraEntrada) {
                $datos[$index]['entidad'] = $ent[0]->denominacion;
                $datos[$index]['identidad'] = $ent[0]->idestructura;
                $datos[$index]['idpadre'] = $ent[0]->idpadre;
                $index++;
            }
        }
        $this->datos = $datos;
        $this->total = count($datos);
        /* $ent = $this->sEstrucComp->getEstructura($this->global->$cEstructura->idestructura);  
          $this->entidad = $ent[0]->denominacion;
          $this->identidad = $ent[0]->idestructura;
          $this->idpadre = $ent[0]->idpadre; */
    }

}
