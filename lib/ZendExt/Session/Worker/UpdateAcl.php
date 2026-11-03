<?php
/**
 * Class ZendExt_Session_Worker_UpdateAcl
 * Tarea que actualiza los permisos (ACL) de los usuarios en las sessiones abiertas.
 *
 * @author: Yoandry Morejon Borbon
 * @copyright XETID
 * @package: Quarseg
 * @subpackage Usuario
 * @version 1.0-0
 */
class ZendExt_Session_Worker_UpdateAcl extends Amqp_Worker_Abstract {

    /**
     * Tarea que actualiza la ACL de los usuarios en las sesiones abiertas.
     *
     * @param array $args Parametros de entrada (1: Listado de roles, 2: Listado de usuarios).
     */
    public function work($args) {
        $sessionAclUpdateObj = new ZendExt_Session_Acl_Update();
        $sessionAclUpdateObj->init($args[0], $args[1], $this);
    }
}