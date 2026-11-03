<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class RecuperacionesController extends BaseController
{
    private $_aperturaAFT;

    function init()
    {
        parent::init('log.tall.recupertalleres');
        $this->_aperturaAFT = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_AFT);
        $monedas = $this->configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
        $alternativa = 0;
        $moneda = array();
        foreach ($monedas['datos'] as $value) {
            if ($value['dualidad'] == 1) {
                $alternativa = 1;
                $moneda['monedaalternativa'] = $value['idmoneda'];
                $moneda['nombremonedaalternativa'] = $value['codigoiso'];
            } else {
                $moneda['monedacontable'] = $value['idmoneda'];
                $moneda['nombremonedacontable'] = $value['codigoiso'];
            }
        }
        $this->view->uiVariables = array_merge(
            array(
                'existeAFT'            => json_encode($this->_aperturaAFT),
                'alternativa'          => $alternativa == 1 ? 'true' : 'false',
                'monedacontable'       => "'" . "{$moneda['monedacontable']}" . "'",
                'nommonedacontable'    => "'" . "{$moneda['nombremonedacontable']}" . "'",
                'monedaalternativa'    => "'" . "{$moneda['monedaalternativa']}" . "'",
                'nommonedaalternativa' => "'" . "{$moneda['nombremonedaalternativa']}" . "'",
                'estaestructura'       => $this->global->Estructura->idestructura
            ), $this->view->uiVariables
        );
    }


    function recuperacionestalleresAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(
            $this->configuracionHelper->mostrarNomencladoresGenerales(),
            $this->configuracionHelper->ObtenerJSArbolNaturaleza()
        );
        $this->initComponent('log.tall.recupertalleres');
        $this->renderTemplate();
    }

}
