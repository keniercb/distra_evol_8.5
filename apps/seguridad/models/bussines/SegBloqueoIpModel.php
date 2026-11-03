<?php

/**
 * @name SegBloqueoUsuario Clase de negocio de bloqueo de usuarios.
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0-0
 */
class SegBloqueoIpModel extends ZendExt_Model
{

    /**
     * @method SegBloqueoUsuario Constructor de la clase.
     */
    public function init()
    {
        parent::ZendExt_Model();
    }

    /**
     * @method @method cargar Función generica usada 
     * para listar los ip bloqueados.
     *
     * @param integer $start Comienzo.
     * @param integer $limit Fin.
     * @param string $string cadena de busqueda.
     *
     * @return array Listado de bloqueos.
     */
    public static function cargar($start, $limit, $string)
    {
        $arrayResult = array();
        $cant = 0;
        if ($string) {
            $arrayResult = SegBloqueoip::
                obtenerIpBloqueados($limit, $start, $string);
            $cant = SegBloqueoip::cantIpBloqueados($string);
        } else {
            $arrayResult = SegBloqueoip::obtenerIpBloqueados($limit, $start);
            $cant = SegBloqueoip::cantIpBloqueados();
        }
        return array('cantidad_filas' => $cant, 'datos' => $arrayResult);
    }

    /**
     * Funcion usada para eliminar los usuarios bloqueadas (Desbloqueo).
     *
     * @param array $arrayDel
     * @return void
     */
    public static function actualizar($arrayDel)
    {
        SegBloqueo::eliminarUsuariosBloqueados($arrayDel);
    }

}
