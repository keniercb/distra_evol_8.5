<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class SegUsuarioSegRolModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    public function moduserrol($usuariorol)
    {
        $usuariorol->save();
        return true;
    }

    public function getUsersByRolAndDomain($rolesDominio, $arrayRoles) {
        $query = "
            SELECT DISTINCT u.idusuario, u.nombreusuario, u.iddominio, u.posiciondominio, u.idpersona, u.estado
            FROM mod_seguridad.seg_usuario u
            LEFT JOIN mod_seguridad.seg_compartimentacionusuario cu ON u.idusuario = cu.idusuario 
            INNER JOIN mod_seguridad.seg_usuariodominio ud ON u.idusuario = ud.idusuario
            INNER JOIN mod_seguridad.dat_entidadusuariorol eur ON u.idusuario = eur.idusuario
            INNER JOIN mod_seguridad.seg_rol r ON eur.idrol = r.idrol
            LEFT JOIN mod_seguridad.seg_compartimentacionrol cr ON r.idrol = cr.idrol
            WHERE ud.iddominio = {$rolesDominio}
            AND r.idrol IN ({$arrayRoles})
        ";
        return Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($query);
    }

}