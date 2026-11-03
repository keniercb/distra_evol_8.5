<?php

/**
 * Description of TelematicClientModel
 *
 * @author Ernesto Herrera Morales
 */
class TelematicClientModel extends ZendExt_Model
{

    private static $_instance = null;
    private $_connected = false;
    private $_observable;
    private $_tasksRegistered;
    private static $_servicesByVia
        = array(
            'jabber' => array('enviarMensajeListaContactos',
                              'enviarMensajePorContacto'),
            'correo' => array('enviarCorreoSinAdjunto'),
            'sistema' => array('enviarMensajeListaContactos',
                               'enviarMensajePorContacto'),
            'sms' => array());
    const TELEMATIC_COMPONENT_ID = 'telematic_task';

    /**
     * sendMessage
     *
     * @param string $via
     * @param array  $args
     */
    private function sendMessage($via, $args)
    {
        try {
            if ($this->isConnected()) {
                list($msg, $worker) = $args;
                $msg['tipo'] = $via;
                $tarea = new HisTareaAviso();
                $tarea->uuid = $msg['id'];
                $tarea->idaviso = $worker->idaviso;
                $tarea->destinatariosreal = implode(
                    ',', $worker->destinatarios
                );
                $tarea->contactosreal = implode(',', $worker->contactos);
                $tarea->contenidoreal = is_array($msg['mensaje'])
                    ? $msg['mensaje'][0] : $msg['mensaje'];
                if (array_key_exists('asunto', $msg)) {
                    $tarea->asuntoreal = $msg['asunto'];
                }
                $tarea->viaaviso = $msg['viaenvio'];
                $this->_observable->publish(json_encode($msg));
                $tarea->fechacreacion = NotificacionesUtil:: getCurrentDate();
                $this->_tasksRegistered[] = $tarea;
            }
        } catch (Exception $e) {
            //@TODO log error
            throw $e;
        }
    }

    /**
     * sendDirectMessage
     *
     * @param string $via
     * @param array  $args
     */
    private function sendDirectMessage($via, $args)
    {
        try {
            if ($this->isConnected()) {
                list($msg) = $args;
                $msg['tipo'] = $via;
                $this->_observable->publish(json_encode($msg));
            }
        } catch (Exception $e) {
            //@TODO log error
            throw $e;
        }
    }

    private function __construct()
    {
        parent:: __construct();
        $this->_tasksRegistered = array();
        try {
            $this->_observable = new Amqp_Observable(
                self :: TELEMATIC_COMPONENT_ID
            );
            $this->_connected = true;
        } catch (Exception $e) {
            if ($e->getCode() == 0) {
                $this->_connected = false;
            }
        }
    }

    public static function getInstance()
    {
        if (!self::$_instance instanceof self) {
            self:: $_instance = new self();
        }

        return self::$_instance;
        //return null;
    }

    public function isConnected()
    {
        if ($this->_observable) {
            return $this->_observable->isConnected();
        }

        return false;
    }

    public function connect()
    {
        if ($this->_observable) {
            return $this->_observable->connect();
        }

        return false;
    }

    public function __call($name, $args)
    {
        if ($this->isConnected()) {
            foreach (self:: $_servicesByVia as $via => $services) {
                if (in_array($name, $services)) {
                    $this->sendMessage($via, $args);

                    return;
                } else {
                    if ($name == 'sendDirectEmail' && $via == 'correo') {
                        $this->sendDirectMessage('correo', $args);

                        return;
                    }
                }
            }
        }
    }

    public function __get($name)
    {
        if ($name == 'tasks') {
            return $this->_tasksRegistered;
        }
    }

    public function clearTasks()
    {
        $this->_tasksRegistered = array();
    }

}