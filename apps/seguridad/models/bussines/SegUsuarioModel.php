<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class SegUsuarioModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    function insertarservicio($instance)
    {
        $instance->save();
        return true;
    }

    public function insertarservidoraut($sistemaservautenticacion)
    {
        if ($sistemaservautenticacion)
            $sistemaservautenticacion->save();
    }

    public function insertarperfil($result)
    {
        foreach ($result as $valor) {
            $valor->save();
        }
        return true;
    }

    public function modificarperfil(
    $resultModificar, $resultEliminar, $resultAdicionar
    )
    {
        if ($resultModificar) {
            foreach ($resultModificar as $valor) {
                $valor->save();
            }
        }
        if ($resultEliminar) {
            foreach ($resultEliminar as $valor)
                $valor->delete();
        }
        if ($resultAdicionar) {
            foreach ($resultAdicionar as $valor)
                $valor->save();
        }
        return true;
    }

    public function modificarusuario($sistemaservautenticacion, $usuario)
    {
        $usuario->save();
        if ($sistemaservautenticacion) {
            $record = Doctrine_Core::getTable('SegUsuarioDatSerautenticacion')->findOneBy('idusuario', $usuario->idusuario);

            if ($record) {
                // Actualizar el registro existente
                $record->fromArray(array('idservidor' => $sistemaservautenticacion->idservidor));
            } else {
                // Crear nuevo registro
                $record = new SegUsuarioDatSerautenticacion();
                $record->fromArray(array('idservidor' => $sistemaservautenticacion->idservidor, 'idusuario' => $usuario->idusuario));
            }
            $record->save();
        }
        return true;
    }

    public function asignarroles(
    $arrayentidadusuariorolAdd, $arrayentidadusuariorolElim
    )
    {
        if (count($arrayentidadusuariorolElim)) {
            foreach ($arrayentidadusuariorolElim as $valor) {
                DatEntidadSegUsuarioSegRol::eliminarentidadusuariorol(
                    $valor->idusuario, $valor->idrol, $valor->identidad
                );
            }
        }
        if (count($arrayentidadusuariorolAdd)) {
            foreach ($arrayentidadusuariorolAdd as $valor)
                $valor->save();
        }
        return true;
    }

    public function getIdPersonaByIdUsuario($idusuario)
    {
        $result = SegUsuario::getIdPersonaByIdUsuario($idusuario);
        return $result;
    }

    public function gettodosLosUsuarios($limit, $start)
    {
        $objSegUser = new SegUsuario();
        return $objSegUser->todosLosUsuarios($limit, $start);
    }

    public function getcanttodosLosUsuarios()
    {
        $objSegUser = new SegUsuario();
        return $objSegUser->canttodosLosUsuarios();
    }

    public function getallUsers($limit, $start)
    {
        $objSegUser = new SegUsuario();
        return $objSegUser->getallUsers($limit, $start);
    }

    public function UsersByFuncionality(
    $iddominios, $referencia, $recurso, $excluir = array(), 
        $limit = 0, $offset = 0
    )
    {
        $objSegUser = new SegUsuario();
        return $objSegUser->UsersByFuncionality(
            $iddominios, $referencia, $recurso, $excluir, $limit, $offset
        );
    }

    public function totalUsersByFuncionality(
    $iddominios, $referencia, $recurso, $excluir = array()
    )
    {
        $objSegUser = new SegUsuario();
        return $objSegUser->totalUsersByFuncionality(
            $iddominios, $referencia, $recurso, $excluir
        );
    }

    public function getEntidad($idusuario)
    {
        $objSegUser = new SegUsuario();
        return $objSegUser->getEntidad($idusuario);
    }

    public function cambiarestadoEntidad($idusuario, $estado)
    {
        $objSegUser = new SegUsuario();
        return $objSegUser->cambiarestadoEntidad($idusuario, $estado);
    }

}
