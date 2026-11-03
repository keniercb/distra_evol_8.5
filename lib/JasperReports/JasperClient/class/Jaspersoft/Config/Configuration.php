<?php

namespace Jaspersoft\Config;

class Configuration
{

    private $config;

    function __construct()
    {
        try {
            $this->config = parse_ini_file(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'data.ini', true);
        } catch (Exception $exc) {
            throw new \Exception('No puedo encontrar el archivo de config del JasperClient.Trata de crear o actualizar el fichero data.ini en el config');
        }
    }

    public function getConfig()
    {
        return $this->config;
    }

}
