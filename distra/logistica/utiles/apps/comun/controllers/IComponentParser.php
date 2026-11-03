<?php

/**
 *
 * @author Kenier Cumba Bueno
 */
interface IComponentParser
{

    /**
     * Funcion para cargar los datos del componente del fichero
     * de configuracion
     */
    public function loadComponent($component);

    /**
     * Funcion que construye el componente cargado
     */
    public function buildComponent($component, BaseController $controller = null);

    /**
     *
     */
    public function initComponent($component, $autoloadPath = false);

    /**
     * Funcion que carga todas las dependencias del componente, las incluidas y
     * las requeridas
     */
    public function buildDependencies($component);

    /**
     * Funcion que devuelve una arreglo con los ficheros necesarios para el funcionamiento
     * del componente
     */
    public function getComponentRequiredFiles($component, $autoloadPath = false);

    /**
     * Funcion que devuelve una cadena con las direcciones de las carpetas que requiere
     * el componente para su integracion con otros componentes
     */
    public function getComponentRequiredPath($component);

    /**
     * Funcion para determinar si ya un componente fue cargado en la configuracion
     */
    public function isLoadedComponent($component);

    /**
     * Funcion para cargar el fichero de con las definiciones de los componentes
     */
    public function loadDefinitionsFile($file);

    /**
     *
     */
    public function buildRequired($component);

    /**
     *
     */
    public function buildIncluded($component);

    /**
     *
     */
    public function loadCSSFiles($component);

    /**
     *
     */
    public function loadJSFiles($component);

    /**
     *
     */
    public function loadMainView($component);

    /**
     *
     */
    public function loadLocaleFiles($component);

    /**
     *
     */
    public function getComponent($component);

    /**
     *
     */
    public function loadPath();
}
