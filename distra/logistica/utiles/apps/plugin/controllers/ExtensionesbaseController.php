<?php

/**
 * Clase controladora para gestionar los datos de las extensiones
 *
 * @author Maricet Estvez Fresnedo
 *
 */
class ExtensionesbaseController extends BaseController
{

    public function init()
    {
        parent::init('log.lb.extensionesbase');
    }

    public function extensionesbaseAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.lb.extensionesbase');
        $this->rendertemplate();
    }

    /**
     * Funcion para cargar los datos del grid segun sea necesario
     */
    public function cargarDatosAction()
    {

        $model = new ExtensionesProxy($this->uiParams);
        $this->datos = $model->cargarDatos($this->uiParams);
    }

}
