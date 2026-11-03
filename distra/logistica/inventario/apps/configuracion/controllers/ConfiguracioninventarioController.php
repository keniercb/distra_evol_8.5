<?php

/**
 * @class      ConfiguracioninventarioController
 *
 * @package    Inventario
 * @subpackage Configuracion
 * @author     Antonio Diaz Soutuyo
 * @copyright  XETID
 * @version    2.0
 */
class ConfiguracioninventarioController extends BaseController
{

    private $idestructuraComun;
    private $modeloConfiguracion;
    private $params;

    public function init()
    {
        parent::init('log.inv.configuracion');
        $this->idestructuraComun = $this->global->Estructura->idestructura;
        $this->modeloConfiguracion = new ConfiguracioninventarioModel();
        $this->params = $this->_request->getParams();
    }

    public function configuracioninventarioAction()
    {
        $this->autoShow = false;
        $this->render();
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna true si se salvo la configuracion correctamente
     *
     */
    public function salvarconfiguracionAction()
    {
        $this->params['idestructuracomun'] = $this->idestructuraComun;
        $this->modeloConfiguracion->salvarConfiguracion($this->params);
        $this->success = true;
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna los datos de la configuracion en caso de existir
     *
     */
    public function caragrconfiguracionAction()
    {
        $this->datos = $this->modeloConfiguracion->devolverConfiguracion(
            $this->idestructuraComun
        );
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna los datos de tipo de tasa
     */
    public function cargartipostasaAction()
    {
        $result = $this->modeloConfiguracion->cargarTiposTasa();
        $this->datos = $result['datos'];
        $this->cantidad = $result['cant'];
    }

    /**
     * @author Gabriel
     * @description Devuelve las subordinaciones configuradas para el INRE
     **/
    public function obtenerSubordinacionesAction()
    {
        $this->datos = $this->estructuraHelper->obtenerSubordinaciones(null,1000);
    }

    /**
     * @author Gabriel
     * @description Devuelve las estructuras para el combo Unidad mayor
     **/
    public function obtenerEstructurasUMayorAction()
    {
        $result= $this->modeloConfiguracion->obtenerEstructurasUMayor($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function escribirFicheroConfAction()
    {
        $arrayKeys = array('mostrarcomboentidad', 'certificargastos','compartimentar_centro_balance'
        ,'recep_trans_ext','recep_trans_int','recep_fact','recep_prod');
        $values = array();
        foreach ($arrayKeys as $key) {
            $values[$key] = $this->uiParams[$key] ? $this->uiParams[$key] : 0;
        }
        $this->successed= InitConfigLoader::__init()->writeFile($values, 'log_config');
    }
}
