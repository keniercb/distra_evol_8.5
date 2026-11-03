<?php
/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 11/10/2018
 * Time: 10:58
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class RecuperacionesController extends BaseController
{
    function init()
    {
        parent::init('log.farm.recuperaciones');
        $sDatMaestros = DatosMaestrosHelper::__init();
        $fechaSub = $sDatMaestros->getFechaContableSubsistemaObj(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FARMACIA
        );
        $this->view->uiVariables = array_merge(array(
            'fechasub' => "'".$fechaSub->fecha."'",
            'fechasub2' => "'".$this->global->{"FechaContable"}->fecha."'",
            'idestructura' => $this->global->Estructura->idestructura

        ), $this->view->uiVariables
        );
    }

    function gestRecuperacionesAction()
	{
        	$this->autoShow = false;
	        $this->controllerConfig = 'log';
        	$this->prepareView();
	        $this->view->arrayJs = array(
						$this->configuracionHelper->mostrarNomencladoresGenerales(),
						$this->configuracionHelper->ObtenerJSArbolNaturaleza()

					);
	        $this->initComponent('log.farm.recuperaciones');
        	$this->renderTemplate();

	}

}