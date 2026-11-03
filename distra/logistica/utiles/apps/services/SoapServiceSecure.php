<?php

/**
 * Created by PhpStorm.
 * User: Kenier
 * Date: 27/11/2016
 * Time: 17:25
 */
class SoapServiceSecure
{
    private $_className;
    private $_authenticated;
    private $_config;

    /**
     * SoapServiceSecure Clase para annadir una capa de seguridad a los servicios web.
     * @param $_className Nombre de la clase que implementa los servicios web
     */
    public function __construct($_className)
    {
        $this->_className = $_className;
        $this->_authenticated = false;
        $this->_config = parse_ini_file('wss_config.ini');
    }

    public function authHeader($header)
    {
        $secureToken = LogisticaJWTHelper::__init()->decode($header->wssToken);
        if ($secureToken->message == LogisticaJWTHelper::__init()->getConfig('JWT_DEFAULT_MSG')) {
            $this->_authenticated = true;
        }
    }

    public function getAuthenticated()
    {
        return $this->_authenticated;
    }

    public function getClassName()
    {
        return $this->_className;
    }

    public function __call($methodName, $parametros)
    {
        if (!method_exists($this->_className, $methodName)) {
            throw new Exception('Method not found');
        }
        /*if ($this->_config['secure']) {
            $this->checkAuth();
        }*/
        return call_user_func_array(array(new $this->_className, $methodName), $parametros);
    }

    public function checkAuth()
    {
        if (!$this->_authenticated) {
            throw new Exception('You have not access to this resource.');
        }
    }


}