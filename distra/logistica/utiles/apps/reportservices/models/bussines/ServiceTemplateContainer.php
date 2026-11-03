<?php


//namespace reportservices;


abstract class ServiceTemplateContainer
{

    private $config;

    /**
     * ServiceTemplateContainer constructor.
     */
    public function __construct()
    {
        /***
         * Formarto de la variable
         * '{"reportserver": {"user":"admin", "apikey": "admin", "url":"http://url.to.reportserver", "format": "json"}}'
         * 
         * * 
         */
        $this->config = get_object_vars(json_decode ((new VariablesGlobalesModel())->obtenerValor('rsconfig')));
    }

    /**
     * @return LogisticaConfigHelper
     */
    public function getConfigutation($configProperty = '')
    {
        if ($configProperty != '') {
            return get_object_vars($this->config[$configProperty]);
        }
        return '';
    }
}