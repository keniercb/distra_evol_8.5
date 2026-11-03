<?php

/**
 * @class     SubmayorController
 * Clase que se encarga de manejar las acciones
 * para las recuperaciones del submayor de activos.
 * @namespace Logistica\Activos fijos\Recuperaciones\Controllers
 * @author    Divisiçon de Gestiçon de Entidades
 * @copyright XETID
 * @version   2.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
$configFile = Zend_Registry::getInstance()->get('config')->dir_aplication
    . 'logistica/activos_fijos/recuperaciones/controllers/SubmayorController.php';
include_once($configFile);

class SubmayorpatController extends SubmayorController//BaseController
{

    private $mSubMayor, $serviciosCfg;

    public function init()
    {
        parent::init('log.aft.submayorpatrimonio');
        $this->serviciosCfg = ServiciosConfiguracionGeneralHelper::__init();
        $this->view->uiVariables = array_merge(
            array(
            'naturalezaPPA' => IntegracionNomencladoresModel::NATURALEZA_PPA,
            ), $this->view->uiVariables
        );

        $this->view->arrayJs = array(
            $this->serviciosCfg->getJSAtributosDinamicos(),
            '</script><script type="text/javascript"
            src="/pvd/comun/views/js/buscarpersonacomp/buscarpersonacomp.js"></script>'
        );

        //$this->mSubMayor = new SubmayorPatModel();
        $this->mSubMayor = new SubmayorModel();        
    }

    public function submayorpatAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.submayorpatrimonio');
        $this->renderTemplate();
    }
     public function getconteoAction()
    {       
        $arrIdesAreas = json_decode(stripslashes($this->_request->getPost('arrIdEstructuras')));
        $idnatObjObra = IntegracionNomencladoresModel::NATURALEZA_OBJETODEOBRA;
        $idnatINMUEBLE = IntegracionNomencladoresModel::NATURALEZA_INMUEBLE;
       // $idnatActivos = IntegracionNomencladoresModel::NATURALEZA_ACTIVOS;      
		 ini_set('memory_limit', '2048M');
        if ($this->uiParams['filtroespecialidad']) {
            $this->uiParams['idespecialidad'] = $this->global->Estructura->idespecialidad;
        }
        $this->uiParams['tipo'] = 1;
        $this->uiParams['idnaturaleza'] = array(/*$idnatActivos,*/$idnatINMUEBLE,$idnatObjObra);
        $estructura = 'Estructura';
        if (!is_array($arrIdesAreas)) {
            $arrIdesAreas = ZendExt_GlobalConcept::getInstance()->$estructura->idestructura;
        }
        $parametros = json_decode($this->_request->getPost('filter'));
        $this->uiParams = $this->mSubMayor->configureParams($parametros, $this->uiParams);
        
        if (!$this->uiParams['salidas'] || $this->uiParams['salidas'] != 2) {         // OK
            $datos = $this->mSubMayor->getConteoEntidad(
                $this->uiParams['start'], $this->uiParams['limit'], $this->uiParams, $arrIdesAreas
            );

        } else {
            // Falta
            $datos = $this->mSubMayor->GetConteoEntidadSalidas(
                $this->uiParams['start'], $this->uiParams['limit'], $this->uiParams, $arrIdesAreas
            );

        }
//        $estructuraHelper = ServiciosEstructuraComposicionHelper::__init();
//        $areasO = $estructuraHelper->getEstructurasHijasById(0, $this->global->$estructura->idestructura, false, true);
        /*foreach ($areasO as $row)
        {
            $areasIds[] = $row['id'];
        }*/
//        $datosEnviar = $datos['datos'];
//        $datosEnviar[0]['areas'] = $areasIds;
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['cantidad'];
        $this->cantidadTotal = $datos['cantidadTotal'];
    }
 

}
