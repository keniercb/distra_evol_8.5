<?php

/**
 * Created by PhpStorm.
 * User: jose
 * Date: 2/16/15
 * Time: 8:55 AM
 */
class BandejaNotificacionModel extends ZendExt_Model
{
    public function BandejaNotificacionModel()
    {
        parent::ZendExt_Model();
    }

    public function listarNotificaciones($iduser, $type = 0)
    {
        $result = $this->integrator->notification->obtenerNotificaciones(
            $iduser,
            $type
        );
        $arrays = array();
        $session = Zend_Registry::get('session');
        $certificate = $session->certificado;
        foreach ($result as $fila) {
            $idUsusario = $fila['originadopor'];
            $result = $this->integrator->seguridad->getUsersProfile(
                array($idUsusario),
                $certificate
            );
            $user = $result[0]['usuario'];
            $denominacion = $fila['descripcionaviso'];
            $fecha = $fila['fecha'];
            $mensaje = "$denominacion - Usuario: $user - Fecha: $fecha";
            array_push(
                $arrays,
                array(
                    'id' => $fila['id'],
                    'detalle' => $mensaje,
                    'estado' => $fila['estado'],
                    'tipo' => $fila['idtipoaviso']
                )
            );
        }

        return $arrays;
    }

    public function eliminarNotificaciones($idNotificacion)
    {
        $result = $this->integrator->notification->eliminarNotificacion(
            $idNotificacion
        );

        return $result;
    }

    public function cambiarEstado($idNotificacion, $estado)
    {
        $result = $this->integrator->notification->cambiarEstadoNotificacion(
            $idNotificacion,
            $estado
        );

        return $result;
    }

    public function getCantidadNotificacionesNoLeidasAction($iduser)
    {
        return $this->integrator->notification->obtenerCantidadNotificaciones(
            $iduser
        );
    }
} 