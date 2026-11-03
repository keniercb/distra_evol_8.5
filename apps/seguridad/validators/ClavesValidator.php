<?php

/**
 * @name ClavesValidator - Clase de validación de claves.
 * @package seguridad
 * @copyright UCID
 * @author Darien García Tejo.
 * @version 2.0-0
 */
class ClavesValidator
{

    /**
     * @method validarCaducidad() - Función usada para validar que en caso de
     *  cambiar el tiempo de caducidad de la clave si esta es menor que la que
     *  existia alerta al administrador de ello, en caso de seguir con la
     *  operacion se actualizan automaticamente en base de datos la caducidad 
     *  de los usuarios.
     *
     * @return bool
     */
    public function validarCaducidad()
    {
        if (!$_POST['confirmar']) {
            $diascaducidad = $_POST['diascaducidad'];
            $clave = Doctrine::getTable('SegRestricclaveacceso')
                ->find($_POST['idrestricclaveacceso']);
            if ($diascaducidad < $clave->diascaducidad)
                throw new ZendExt_Exception('SEGCLAVES001');
        }
        return true;
    }

}

