<?php

/**
 * Clase que implementa los metodos para interceptar la ejecucion de funciones
 *
 * @version 1.0
 * @author  Kenier Cumba Bueno
 */
abstract class AbstractInterceptor
{

    public $object;
    public $rootObject;

    public function __construct($object)
    {
        $this->object = $object;

        if (is_a($object, "AbstractInterceptor")) {
            $this->rootObject = $object->rootObject;
        } else {
            $this->rootObject = $object;
        }

        $object->intercepted = $this;
    }

    public function callMethod($method, $args)
    {
        return call_user_func_array(array($this->object, $method), $args);
    }

    public function __isset($name)
    {
        return isset($this->rootObject->$name);
    }

    public function __unset($name)
    {
        unset($this->rootObject->$name);
    }

    public function __set($name, $value)
    {
        $this->rootObject->$name = $value;
    }

    public function __get($name)
    {
        return $this->rootObject->$name;
    }

    public function __call($method, $args)
    {
        if ($method[0] == "_") {
            $method = substr($method, 1);
        }

        if (method_exists($this, "before")) {
            $this->before($this->rootObject, $method, $args);
        }

        if (method_exists($this, "around")) {
            $value = $this->around($this->rootObject, $method, $args);
        } else {
            $value = $this->callMethod($method, $args);
        }

        if (method_exists($this, "after")) {
            $this->after($this->rootObject, $method, $args);
        }

        return $value;
    }

}
