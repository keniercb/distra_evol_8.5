<?php

/**
 * @class      ConfiguracioninventarioService
 * @package    Invetario
 * @subpackage Configuracion
 * @author     Antonio Diaz Soutuyo
 * @copyright  XETID
 * @version    2.0n
 */
class ConfiguraciontalleresService extends ZendExt_Model
{


    public function __construct()
    {
        parent::ZendExt_Model();
        $this->aperturaAFT = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_AFT);
        $this->view->uiVariables = array_merge(
            array('existeAFT' => json_encode($this->aperturaAFT)), $this->view->uiVariables
        );
        $this->modelo = new ConfiguracionMediosTalleresModel(
            $this->aperturaAFT
        );
       $this->model = new ConfiguracionTalleresModel();

    }

    public function getJsConfiguracion()
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirPhtml = $dirApps .
            '/logistica/talleres/configuracion/views/scripts/configuraciontalleres/configuraciontalleres.phtml';
        $js .= file_get_contents($dirPhtml);
        return $js;
    }

    public function getJsConfiguracionMedios()
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirPhtml = $dirApps . '/logistica/talleres/configuracion/views/scripts/configuracionmediostaller/' .
            'configuracionmediostaller.phtml';
        $js = file_get_contents($dirPhtml);
        return $js;
    }

    public function getJsConfiguracionActividades()
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirPhtml = $dirApps . '/logistica/talleres/configuracion/views/scripts/configuracionactividades/' .
            'configuracionactividades.phtml';
        $js = file_get_contents($dirPhtml);
        return $js;
    }

    public function getJsConfiguracionVistaEdades()
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirPhtml = $dirApps . '/logistica/talleres/configuracion/views/scripts/configuracionvistaparalizaciones/' .
            'configuracionvistaparalizaciones.phtml';
        $js = file_get_contents($dirPhtml);
        return $js;
    }

    public function getDinamicos($params)
    {
        return $this->modelo->cargarAtributosPorIndicador($params);
    }

    public function getJsConfiguracionFacturacion()
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirPhtml = $dirApps . '/logistica/talleres/configuracion/views/scripts/configuracionfacturacion/' .
            'configuracionfacturacion.phtml';
        $js = file_get_contents($dirPhtml);
        return $js;
    }

    public function devolverConfiguracion($idestructura)
    {
        return $this->model->cargarConfiguracion($idestructura);
    }

    public function getJsConfiguracionParalizacion()
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirPhtml = $dirApps . '/logistica/talleres/configuracion/views/scripts/configuracionparalizacion/' .
            'configuracionparalizacion.phtml';
        $js = file_get_contents($dirPhtml);
        return $js;
    }
}
