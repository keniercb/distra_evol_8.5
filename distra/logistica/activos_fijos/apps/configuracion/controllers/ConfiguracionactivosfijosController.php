<?php

/**
 *
 */
class ConfiguracionactivosfijosController extends BaseController
{

    /**
     *
     */
    function init($conf = 'log.aft.configuracionaf')
    {
        parent::init($conf);
    }

    /**
     *
     */
    public function configuracionactivosfijosAction()
    {
        $this->autoShow = false;
        $this->render();
    }

}
