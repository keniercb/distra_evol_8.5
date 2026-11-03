<?php
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class RecuperacionesController extends BaseController
{

    protected $_modelMT;

    function init()
    {
        parent::init('log.inv.recuperaciones');
        $monedas = $this->configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
        $this->_modelMT = new MercanciaTransitoModel();
        $alternativa = 0;

        foreach ($monedas['datos'] as $value) {
            if ($value['dualidad'] == 1) {
                $alternativa = 1;
                $moneda['codigoAlternativa'] = $value['codigoiso'];
                $moneda['monedaalternativa'] = $value['idmoneda'];
            } else {
                $moneda['codigoContable'] = $value['codigoiso'];
                $moneda['monedacontable'] = $value['idmoneda'];
            }
        }
        $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($this->global->Estructura->idestructura,
            LogisticaGlobal::SUBSISTEMA_INV);
        $cfgUsuarioEsp = new CfgUsuarioespecialidad();
        if ($this->jsonComponent->getComponent('log.inv.municiones', true)) {
            $configEspecialidad = $cfgUsuarioEsp->devolverConfiguracionEspecialidad(
                $this->global->Perfil->idusuario, $this->view->uiVariables['espArmamento']
            );
        }

        $this->view->uiVariables = array_merge(array(
            'alternativa' => $alternativa == 1 ? 'true' : 'false',
            'codigoContable' => "'" . "{$moneda['codigoContable']}" . "'",
            'codigoAlternativa' => "'" . "{$moneda['codigoAlternativa']}" . "'",
            'monedacontable' => "'" . "{$moneda['monedacontable']}" . "'",
            'monedaalternativa' => "'" . "{$moneda['monedaalternativa']}" . "'",
            'fechaContableINV' => "'{$fecha->fecha}'",
            'confArmamento' => empty($configEspecialidad->idespecialidad) ? 'false' : 'true',
            'estaestructura'=>$this->global->Estructura->idestructura
        ), $this->view->uiVariables
        );
    }

    function configlogisticaAction()
    {

        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(

            $this->configuracionHelper->mostrarNomencladoresGenerales(),
            $this->configuracionHelper->ObtenerJSArbolNaturaleza()

        );
        $this->initComponent('log.inv.recuperaciones');
        $this->renderTemplate();
    }
    
    public function getEstructurasAction(){
        $this->objectHelper->synchronize($this, $this->_modelMT->getEstructuras());
    }

}
