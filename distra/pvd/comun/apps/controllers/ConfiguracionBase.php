<?php

/**
 * Controlador para gestionar los tipos de certificaciones.
 *
 * @author Tte. Darien.
 * @package Presentación.
 * @subpackage ComponentesBase.
 * @category .
 * @uses
 * @copyright UCID
 * @version 1.0
 */
class ConfiguracionBase
{
    /**
     * @var mixed
     */
    private $estructura;

    private $objReadConfig;

    /**
     * @var array
     */
    private $configGenral;

    /**
     * @param $arrayConfig
     */
    function __construct($arrayConfig)
    {
        $this->configGenral = $this->getConfiguracionGeneral($arrayConfig);
        $this->objReadConfig = ReadWriteConfiguracion::getInstance();
        $this->estructura = $this->getEstructuraModuloConfig();
    }

    /**
     * @return array
     */
    public function getDireccionIconos()
    {
        $dirIconos = array();

        foreach ($this->configGenral as $key => $value) {
            if ($value['dirIconos'])
                array_push($dirIconos, array($key => $value['dirIconos']));
        }
        return $dirIconos;
    }

    /**
     * @return string
     */
    public function getDireccionIconosString()
    {
        $dirIconos = '';
        foreach ($this->configGenral as $key => $value) {
            if ($value['dirIconos'])
                $dirIconos .= $key . ":'" . $value['dirIconos'] . "',";
        }
        return $dirIconos;
    }

    //return array
    /**
     * @param $config
     * @return array
     */
    public function getArchivosBase($config)
    {
        $result = array();
        $estructArchBase = $this->configGenral[$config]['dirArchivosBase'];
        foreach ($estructArchBase as $value)
            array_push($result, array('js', $value));
        return $result;
    }

    //return array
    /**
     * @param $config
     * @return array
     */
    public function getArchivoBaseCss($config)
    {
        $result = array();

        $estructBaseCss = $this->configGenral[$config]['dirBaseCss'];
        if (is_array($estructBaseCss)) {
            foreach ($estructBaseCss as $value)
                array_push($result, array('css', $value));
        } else {
            array_push($result, array('css', $estructBaseCss));
        }
        return $result;
    }

    //return array.
    /**
     * @return mixed
     */
    public function getArchivosBaseLibreria($config)
    {
        return $this->configGenral[$config]['dirBaseExtjs'];
    }    

    //array
    /**
     * @param $arrayConfig
     * @return array
     */
    private function getConfiguracionGeneral($arrayConfig)
    {

        return array(
            "default" => array(
                "dirBaseExtjs" => array(
                    array("js", $arrayConfig['dirExt'] . 'js/ext-base.js'),
                    array("js", $arrayConfig['dirExt'] . 'js/ext-all.js'),
                    array("js", '/portal/views/js/portal/informacion/infoSistema.js'),
                ),
                "dirBaseCss" => $arrayConfig['dirExtCss'] . 'css/ext-all.css',
                "dirIconos" => $arrayConfig['dirExtCss'] . 'images/iconos/',
                "dirArchivosBase" => array($arrayConfig['dirExtUcid'] . 'js/imporcss.js',
                    $arrayConfig['dirExtUcid'] . 'js/ucid-all.js'
                )
            ),
            "ext-jquery" => array(
                "dirBaseExtjs" => array(
                    array("js", '/pvd/persona/views/ext/lib/jquery.min.js'),
                    array("js", '/pvd/persona/views/ext/lib/jquery-ui.custom.js'),
                    array("js", '/pvd/persona/views/ext/lib/ext-jquery-adapter.js'),
                    array("js", $arrayConfig['dirExt'] . 'js/ext-base.js'),
                    array("js", $arrayConfig['dirExt'] . 'js/ext-all.js'),
                    array("js", '/portal/views/js/portal/informacion/infoSistema.js')
                ),
                "dirBaseCss" => array(
                    '/pvd/persona/views/css/jquery-ui.css',
                    $arrayConfig['dirExtCss'] . 'css/ext-all.css'
                ),
                "dirIconos" => $arrayConfig['dirExtCss'] . 'images/iconos/',
                "dirArchivosBase" => array(
                    $arrayConfig['dirExtUcid'] . 'js/imporcss.js',
                    $arrayConfig['dirExtUcid'] . 'js/ucid-all.js'
                )
            ),
            "rrhh" => array(
                "dirBaseCss" => 'pvd/comun/ExtJs/temas/' . $arrayConfig['userTema'] . '/css/ext-all.css',
                "dirIconos" => 'pvd/comun/ExtJs/temas/' . $arrayConfig['userTema'] . '/imagenes/iconos/',
                "dirArchivosBase" => array(
                    $arrayConfig['dirExtUcid'] . 'js/imporcss.js',
                    $arrayConfig['dirExtUcid'] . 'js/ucid-all.js',
                    '/pvd/comun/views/js/rrhh-all.js'
                )
            )
        );
    }

    /**
     * Devuelve
     * @return array
     */
    private function getEstructuraModuloConfig()
    {
        return $this->objReadConfig->getConfigModules();
    }

    //String
    /**
     * @param $modulo
     * @return mixed
     */
    public function getDireccionModulo($modulo)
    {
        return $this->estructura[$modulo]['src'];
    }

    //String o array
    /**
     * @param $modulo
     * @param $componente
     * @param $tipoElem
     * @return mixed
     */
    public function getElementoComponenteByTipoElem($modulo, $componente, $tipoElem)
    {
        return $this->estructura[$modulo]['component'][$componente][$tipoElem];
    }

    /**
     * @param $modulo
     * @param $componente
     * @return bool
     */
    public function existeComponente($modulo, $componente)
    {
        return ($this->estructura[$modulo]['component'][$componente]) ? true : false;
    }
}
