<?php
/**
 * ZendExt_Cache
 *
 * Gestor de cache de la aplicacion
 *
 * @author Omar Antonio Diaz Peña
 * @package ZendExt
 * @copyright UCID-ERP Cuba
 * @version 1.0-0
 */
class ZendExt_Cache implements ZendExt_Aspect_ISinglenton
{
    /**
     * Gestor de cache de la aplicacion
     *
     * @var Zend_Cache_Core|Zend_Cache_Frontend
     */
    private $cache;

    /**
     * Constructor de la clase, es privado para impedir que pueda
     * ser instanciado y de esta forma garantizar que la instancia
     * sea un singlenton
     *
     * @return void
     */
    private function __construct()
    {
        $this->init();
    }

    /**
     * Obtencion de la instancia de la clase, ya que esta no puede ser
     * instanciada directamente debido a que es un singlenton
     *
     * @return ZendExt_Aspect_Config - instancia de la clase
     */
    static public function getInstance()
    {
        static $instance;
        if (!isset($instance))
            $instance = new self();
        return $instance;
    }

    /**
     * Inicializa el gestor de cache de la aplicacion
     *
     * @return void
     */
    private function init()
    {
        $configCache = Zend_Registry::getInstance()->config->cache;
        $frontendOptions = array('lifetime' => $configCache->lifetime, 'automatic_serialization' => $configCache->automatic_serialization);
        $backendOptions = array('cache_dir' => $configCache->cache_dir);
        $this->cache = Zend_Cache::factory($configCache->frontend, $configCache->backend, $frontendOptions, $backendOptions);
        /*if (extension_loaded('apc'))
            $this->cache->setBackend(new Zend_Cache_Backend_Apc($backendOptions));*/
    }

    /**
     * Almacena datos en cache
     *
     * @param mixed $pData - datos a almacenar en cache
     * @param string $pIdCache - identificador de los datos en cache
     * @param numeric
     * @return void
     */
    public function save($pData, $pIdCache, $specificLifetime = false)
    {
        $this->cache->save($pData, $pIdCache, array(), $specificLifetime);
    }

    /**
     * Obtiene los datos almacenados en cache
     *
     * @param string $pIdCache - identificador de los datos en cache
     * @return objecto - datos almacenados en cache
     */
    public function load($pIdCache)
    {
        return $this->cache->load($pIdCache);
    }

    public function remove($pIdCache)
    {
        return $this->cache->remove($pIdCache);
    }

    public function clean()
    {
        return $this->cache->clean();
    }
}
