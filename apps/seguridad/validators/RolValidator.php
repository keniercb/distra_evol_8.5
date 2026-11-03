<?php

/**
 * @name RolValidator - Clase para llevar a cabo aspectos de validación 
 * antes de que se ejecute la acción de insertar, 
 * modificar u eliminar roles o grupos.
 * @package seguridad
 * @copyright UCID
 * @author Darien García Tejo.
 * @version 2.0-0
 */
class RolValidator
{

    /**
     * @method validarDenominacion - Función usada para validar que 
     * no se repita la denominación de un rol o grupo.
     * @return ZendExt_Exception | TRUE
     */
    public function validarDenominacion()
    {
        $denominacion = $_POST['denominacion'];
        $type = ($_POST['type'] == 'rol') ? FALSE : TRUE;
        if (SegRol::validarDenominacion($denominacion, $type, NULL)) {
            if ($type)
                throw new ZendExt_Exception('SEGRUPO001');
            else
                throw new ZendExt_Exception('SEG018');
        }
        return true;
    }

    /**
     * @method validarModificacion - Función usada para validar que 
     * no se repita una vez modificado, la denominación de un rol o grupo.
     * @return ZendExt_Exception | TRUE
     */
    public function validarModificacion()
    {
        $idrol = $_POST['idrol'];
        $denominacion = $_POST['denominacion'];
        $type = ($_POST['type'] == 'rol') ? FALSE : TRUE;
        if (SegRol::validarDenominacion($denominacion, $type, $idrol)) {
            if ($type)
                throw new ZendExt_Exception('SEGRUPO002');
            else
                throw new ZendExt_Exception('SEG019');
        }
        return true;
    }

    /**
     * @method validarFuncionalidad - Función usada para validar que cuando
     *  se modifique un rol o grupo no se le quiten todas las funcionalidades.
     * @return ZendExt_Exception | TRUE
     */
    public function validarFuncionalidad()
    {
        $idrol = $_POST['idrol'];
        $sistemas = json_decode(stripslashes($_POST['arraysistfun']));
        $arrayeliminar = json_decode(stripslashes($_POST['arrayeliminar']));
        $arrayGruposAdd = json_decode(stripslashes($_POST['arrayGruposAdd']));
        $arrayGruposDel = json_decode(stripslashes($_POST['arrayGruposDel']));
        $cantSistemasAdd = count($sistemas);
        $cantGruposAdd = count($arrayGruposAdd);
        if ($cantSistemasAdd == 0 
            && count($arrayeliminar) > 0 
            && $cantGruposAdd == 0) {
            $cantidadrolsistemas = DatSistemaSegRolDatFuncionalidad::
                cantidadsisrol($idrol);
            $cantFuncDel = DatSistemaSegRolDatFuncionalidad::
                cantidadFuncEliminar($idrol, $arrayeliminar);
            $cantGrupos = SegRolGrupo::obtenerGruposRol(array($idrol));
            if ($cantFuncDel == $cantidadrolsistemas && count($cantGrupos) == 0)
                throw new ZendExt_Exception('SEG012');
        }
        if ($cantGruposAdd == 0 
            && count($arrayGruposDel) > 0 
            && $cantSistemasAdd == 0) {
            //Retorno la cantidad de grupos a los que pertenece el rol que
            // sean diferentes de los que se van a eliminar.
            if (SegRolGrupo::obtenerGruposNoRol($idrol, $arrayGruposDel) == 0 
                && DatSistemaSegRolDatFuncionalidad::cantidadsisrol($idrol) == 0
            )
                throw new ZendExt_Exception('SEG012');
        }
        return true;
    }

    public function updateAcl()
    {
        //Obteniendo el listado de usuarios.
        $userList = array();
        if (isset($_REQUEST['arrayUsuario'])) {
            $userAndDomainList = json_decode(
                stripslashes($_REQUEST['arrayUsuario'])
            );
            foreach ($userAndDomainList as $userAndDomain) {
                $userList[] = $userAndDomain[0];
            }
        }

        //Obteniendo el listado de roles.
        $roleList = array();
        if ($_REQUEST['type'] == 'grupo') {
            $roleRecordList = $this->getRolesByGroupId($_REQUEST['idrol']);
            foreach ($roleRecordList as $roleRecord) {
                $roleList[] = $roleRecord['idrol'];
            }
        } else $roleList[] = $_REQUEST['idrol'];

        //Ejecutando tarea de actualización de las ACL de los usuarios con 
        //sessiones activas.
        if (((isset($_REQUEST['type']) 
            || isset($_REQUEST['idrecurso'])) && count($roleList) > 0)
                || (count($roleList) > 0 && count($userList) > 0)
        ) {
            $securityConfig = new Zend_Config_Ini(
                Zend_Registry::get('config')->security_config, 'trace'
            );
            if ($securityConfig->background) {
                $taskRunner = new Amqp_Task_Mgr();
                $taskRunner->runTask('updateAcl', array($roleList, $userList));
            } else {

                $sessionAclUpdateObj = new ZendExt_Session_Acl_Update();
                $sessionAclUpdateObj->init($roleList, $userList);
            }
        }
        return true;
    }

    private function getRolesByGroupId($groupId)
    {
        return Doctrine_Query::create()
            ->select('idrol')
            ->from('SegRolGrupo')
            ->where('idgrupo = ?', $groupId)
            ->fetchArray();
    }

}

