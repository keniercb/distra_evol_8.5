<?php

/**
 * Created by PhpStorm.
 * User: keniercb
 * Date: 28/11/16
 * Time: 8:49
 */
class LogisticaJWTHelper implements ISingletonClass
{
    /**
     * @var null
     */
    private static $instance = null;
    /**
     * @var array
     */
    private $config;

    /**
     * LogisticaJWTHelper constructor.
     */
    private function __construct()
    {
        $this->config = parse_ini_file('jwt_config.ini');
        JWT::$leeway = $this->getConfig('JWT_LEEWAY');
    }

    /**
     * Metodo para garantizar que la clase es un objeto singleton
     * @return LogisticaJWTHelper
     */
    public static function __init()
    {
        if (is_null(LogisticaJWTHelper::$instance)) {
            LogisticaJWTHelper::$instance = new LogisticaJWTHelper();
        }
        return LogisticaJWTHelper::$instance;
    }

    public function encode($msg = null, $key = null, $alg = null)
    {
        $msg = is_null($msg) ? $this->config['JWT_DEFAULT_MSG'] : $msg;
        $msg = array(
            'message' => $msg,
            'exp' => time() + $this->config['JWT_EXP_TIME']
        );
        /*$key = is_null($key) ? $this->config['JWT_KEY'] : $key;
        $alg = is_null($alg) ? $this->config['JWT_METH'] : $alg*/;
        return JWT::encode($msg, $this->config['JWT_KEY'], $this->config['JWT_METH']);
    }

    public function decode($msg, $key = null, $alg = null)
    {
        /*$key = is_null($key) ? $this->config['JWT_KEY'] : $key;
        $alg = is_null($alg) ? $this->config['JWT_METH'] : $alg;*/
        return JWT::decode($msg, $this->config['JWT_KEY'], array($this->config['JWT_METH']));
    }

    /**
     * @return array
     */
    public function getConfig($key)
    {
        return $this->config[$key];
    }


}