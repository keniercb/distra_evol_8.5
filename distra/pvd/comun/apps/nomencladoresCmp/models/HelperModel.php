<?php
/**
 * Created by PhpStorm.
 * User: raciel
 * Date: 22/07/14
 * Time: 22:40
 */

class HelperModel
{

    public static function excecute($agModel, $agFunction, $agParams)
    {

        // Verificar que sea un objeto el modelo
        if (is_object($agModel)) {
            // Verificar que la funcion exista
            try {
                if (is_callable(array($agModel, $agFunction), true))
        return call_user_func(array($agModel, $agFunction), $agParams);
            } catch (Exception $e) {

                return NULL;
            }

        }

        // salida null significa que no afecta nada de la salida
        return null;
    }


} 