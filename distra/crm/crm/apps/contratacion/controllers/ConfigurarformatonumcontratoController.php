<?php

class ConfigurarformatonumcontratoController extends ZendExt_Controller_Secure
{

    function init()
    {
        $this->model = new ConfigurarFormatoNumContratoModel();
        parent::init();
    }

    function configurarformatonumcontratoAction()
    {
    }

    function cargarFormatoNumContratoEntidadAction()
    {
        echo json_encode($this->model->getFormatoNumContratoEntidad());
    }

    function cargarFormatosNumContratoAction()
    {
        $formato = $this->model->getFormatosNumContrato();
        echo json_encode(array('data' => $formato, 'cant' => count($formato)));
    }

    function cargarElementosIncrementalesAction()
    {
        $elemIncr = $this->model->getElementosIncrementales(
            $this->_getParam('idformato'),
            $this->_getParam('identidadformato'),
            $this->_getParam('contratodestino')
        );
        echo json_encode(
            array('data' => $elemIncr, 'cant' => count($elemIncr))
        );
    }

    function guardarConfiguracionAction()
    {
        $formatos = $this->model->guardarConfigFormatoNumContratoEntidad(
            $this->_getParam('idformatonumcontrato'),
            $this->_getParam('identidadformatonumcontrato'),
            $this->_getParam('contratodestino'),
            $this->_getParam('elemIncrem')
        );

        echo json_encode(
            array('success' => true, 'cdmessage' => 1, 'formatos' => $formatos)
        );
    }
}
