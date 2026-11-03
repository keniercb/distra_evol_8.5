<?php

class UsuarioValidator extends ZendExt_Model
{
    public $post = array();

    public function UsuarioValidator()
    {
        parent::ZendExt_Model();
    }

    public function validarInsertarUsuario()
    {
        return true;
    }

    public function validarModificarUsuario()
    {
        return true;
    }

    public function validarRepeticionClave()
    {
        try {
            //Obtengo las claves de acceso
            $query = Doctrine_Query::create();
            $clavesacceso = $query->select('claveacceso')->from(
                'DatClavesacceso'
            )->where("idpersona = {$_POST['idpersona']}")->execute();
            //Recorro las claves de acceso para verificar si la nueva clave de acceso ya existe.
            foreach ($clavesacceso as $cacceso) {
                if ($cacceso->claveacceso === md5($_POST['claveacceso'])) {
                    throw new ZendExt_Exception('EGU005');
                }
            }
            return true;
        } catch (Doctrine_Exception $e) {
            throw new ZendExt_Exception('EGU003');
        }
    }

    public function validarExistenciaUsuario()
    {
        try {
            //Obtengo el usuario con el alias que se desea asignar
            $query = Doctrine_Query::create();
            $usuario = $query->select('idpersona, alias')->from('DatUsuario')
                ->where("alias = '{$_POST['alias']}'")->execute();
            if ($usuario->count()
                && $usuario[0]->idpersona != $_POST['idpersona']
            ) {
                throw new ZendExt_Exception('EGU006');
            }
            return true;
        } catch (Doctrine_Exception $e) {
            throw new ZendExt_Exception('EGU003');
        }
    }
}


