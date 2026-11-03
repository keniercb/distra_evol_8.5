<?php

/**
 * @name SegBloqueoUsuario Clase de negocio de bloqueo de usuarios.
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0-0
 */
class SegBloqueoUsuarioModel extends ZendExt_Model
{

    /**
     * @method SegBloqueoUsuario Constructor de la clase.
     */
    public function init()
    {
        parent::ZendExt_Model();
    }

    /**
     * @method cargar Función generica usada para 
     * listar los usuarios bloqueados.
     *
     * @param integer $start Comienzo.
     * @param integer $limit Fin.
     * @param string $string cadena de busqueda.
     *
     * @return array Listado de bloqueos.
     */
    public static function cargar($start = 0, $limit = 10, $string = NULL)
    {
        $perfil = SegUtil::getPerfil();
        $arrayIdDominio = SegUtil::convertToUnidimensional(
            SeguridadECProxy::getInstance()
            ->buscarArbolHijosDominio(array($perfil->iddominio)), 'iddominio'
        );
        $arrayIdDominio = array_merge(
            $arrayIdDominio, array($perfil->iddominio)
        );
        $arrayResult = SegBloqueousuario::
            obtenerUsuariosBloqueados($limit, $start, $arrayIdDominio, $string);
        $cant = SegBloqueousuario::
            cantUsuariosBloqueados($arrayIdDominio, $string);
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
