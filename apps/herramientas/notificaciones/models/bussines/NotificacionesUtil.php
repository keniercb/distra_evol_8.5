<?php

class NotificacionesUtil
{
    public static function toStrictBoolean(
        $_val, $_trueValues = array('yes', 'y', 'true', '1', 'on'),
        $_forceLowercase = true
    )
    {
        if (is_string($_val)) {
            return (in_array(
                ($_forceLowercase ? strtolower($_val) : $_val), $_trueValues
            )
            );
        } else {
            return (boolean)$_val;
        }
    }

    public static function spacify($camel, $glue = ' ')
    {
        return preg_replace('/([a-z0-9])([A-Z])/', "$1$glue$2", $camel);
    }

    public static function fullName($persona)
    {
        return implode(
            ' ',
            array($persona['nombre'], $persona['snombre'], $persona['papel'], $persona['sapel'])
        );
    }

    public static function object2Array($d)
    {
        if (is_object($d)) {
            $d = get_object_vars($d);
        }
        if (is_array($d)) {
            return array_map(array(__CLASS__, __METHOD__), $d);
        } else {
            return $d;
        }
    }

    public static function getCurrentDate()
    {
        return Zend_Date:: now();
        //return gmdate("Y-m-d H:i:s", $date->get);
    }
}