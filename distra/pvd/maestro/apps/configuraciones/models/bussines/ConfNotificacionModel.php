<?php
/**
 * @name ConfNotificacionModel - Clase modelo del componente de configuración "Notificación".
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 * @date 02/11/2017 Ing. Orestes Rodríguez Lorenzo
 * @version 1.0.0
 */

class ConfNotificacionModel extends ZendExt_Model
{
    private $respuesta;
    /**
     * @author Ing. Orestes Rodríguez Lorenzo
     * @date 02/11/2017
     */
    public function __construct()
    {
        $this->respuesta = new stdClass();
    }

    /**
     * @name obtenerConfig Función para obtener las configuraciones de notificacón registradas
     * @return
     * @author Ing. Orestes Rodríguez Lorenzo.
     * @date 20/10/2017
     */
    public function obtenerConfig()
    {
        try {
            $obj = new ConfNotificacion();
            $config = $obj->obtenerConfigByEntidadDominio($_SESSION['Zeolides']['entidad']->idestructura);
            foreach ($config as $key => $value) {
                $dominio = $obj->obtenerDominio(array($value['iddominio']));
                $config[$key]['dominio'] = $dominio[0]['denominacion'];
            }
            return $config;
        } catch (Exception $e) {
            $this->respuesta->exito = false;
            $this->respuesta->excepcion = $e;
            return $this->respuesta;
        }
    }

    public function adicionarConfiguracion($iddominio, $servidor, $puerto, $smtpaut, $remitente, $nombremitente, $contrasena)
    {
        try {
            $obj = new ConfNotificacion();
            $obj->iddominio = $iddominio;
            $obj->servidor = $servidor;
            $obj->puerto = $puerto;
            $obj->smtpaut = $smtpaut;
            $obj->remitente = isset($remitente) ? $remitente : null;
            $obj->nombremitente = isset($nombremitente) ? $nombremitente : null;
            $obj->contrasena = isset($contrasena) ? $contrasena : null;
            $obj->identidad = $_SESSION['Zeolides']['entidad']->idestructura;
            $obj->save();
            $this->respuesta->exito = true;
            return $this->respuesta;
        } catch (Exception $e) {
            print_r($e->getCode());die;
            $this->respuesta->exito = false;
            $this->respuesta->excepcion = $e;
            return $this->respuesta;
        }
    }

    public function modificarConfiguracion($idnotificacion, $iddominio, $servidor, $puerto, $smtpaut, $remitente, $nombremitente, $contrasena)
    {
        try {
            $obj = new ConfNotificacion();
            $config = $obj->obtenerPorId($idnotificacion);
            $config->iddominio = $iddominio;
            $config->servidor = $servidor;
            $config->puerto = $puerto;
            $config->smtpaut = $smtpaut;
            $config->remitente = $remitente;
            $config->nombremitente = $nombremitente;
            $config->contrasena = $contrasena;
            $config->save();
            $this->respuesta->exito = true;
            return $this->respuesta;
        } catch (Exception $e) {
            $this->respuesta->exito = false;
            $this->respuesta->excepcion = $e;
            return $this->respuesta;
        }
    }

    public function eliminarConfiguracion($idnotificacion)
    {
        try {
            $obj = new ConfNotificacion();
            foreach ($idnotificacion as $value) {
                $config = $obj->obtenerPorId($value);
                $config->delete();
            }
            $this->respuesta->exito = true;
            return $this->respuesta;
        } catch (Exception $e) {
            $this->respuesta->exito = false;
            $this->respuesta->excepcion = $e;
            return $this->respuesta;
        }
    }

    public function obtenerConfigByEntidadDominio($identidad, $iddominio) {
        try {
            $obj = new ConfNotificacion();
            return $obj->obtenerConfigByEntidadDominio($identidad, $iddominio);
        } catch (Exception $e) {
            $this->respuesta->exito = false;
            $this->respuesta->excepcion = $e;
            return $this->respuesta;
        }
    }
}