<?php

/**
 * Amqp_Observable
 *
 * @author Equipo de Arquitectura UCID
 * @package    Amqp
 * @version    1.0
 */
class Amqp_Observable {

    /**
     * Establece la conexión a Rabbitmq.
     *
     * @var Rabbit_Connection
     */
    private $_conn;
    /**
     * Xml que contiene la configuración de la conexión y de los componentes del modelo de Amqp.
     *
     * @var SimpleXMLElement
     */
    private $_xmlConfig;
    /**
     * Almacena los objetos vivos de los componentes de Amqp que se están usando.
     *
     * @var array
     */
    private $_components;
    /**
     * Propiedades por defecto de los mensajes a enviar a las colas.
     *
     * @var array
     */
    private static $_messageProperties = array(
        Rabbit_Message::PROPERTY_CONTENT_TYPE => 'application/json'
    );

    /**
     * Inicializa la conexión al broker rabbitmq que implementa el protocolo Amqp.
     *
     * @returns void
     */
    private function initAmqpConnection() {
        $connNode = $this->_xmlConfig->conn;
        $attribsConnNode = $connNode->attributes();
        $config = array();
        foreach ($attribsConnNode as $attrib => $value) {
            $config[$attrib] = ($attrib == 'port') ? (integer) $value : (string) $value;
        }
        $this->_conn = new Rabbit_Connection($config);
    }

    /**
     * Inicializa los componentes del modelo de rabbitmq (exchanges, queues y bindings).
     *
     * @returns void
     */
    private function initAmqpComponents() {
        $exchanges = $this->_xmlConfig->exchanges[0];
        $queues = $this->_xmlConfig->queues[0];
        $this->_components['queues'] = array();
        $this->_components['exchanges'] = array();
        //queues
        foreach ($queues as $nodeName => $nodeObj) {
            $queue = array();
            foreach ($nodeObj->attributes() as $attrib => $value) {
                $queue[$attrib] = (string) $value;
            }
            $queue['flags'] = array();
            if ($nodeObj->flags) {
                foreach ($nodeObj->flags[0]->attributes() as $flag => $value) {
                    $queue['flags']['CONN_' . ucfirst($flag)] = (boolean) $value;
                }
            }
            $queue['object'] = @$this->_conn->getQueue($queue['name'], new Rabbit_Flags($queue['flags']));
            $this->_components['queues'][] = $queue;
        }
        //exchanges
        foreach ($exchanges as $nodeName => $nodeObj) {
            $exchange = array();
            foreach ($nodeObj->attributes() as $attrib => $value) {
                $exchange[$attrib] = (string) $value;
            }
            $exchange['object'] = @$this->_conn->getExchange($exchange['name'], $exchange['type']);
            //binds
            $binds = $nodeObj->binds;
            foreach ($binds->bind as $bindNode) {
                $bind = array();
                foreach ($bindNode->attributes() as $attrib => $value) {
                    $bind[$attrib] = (string) $value;
                }
                //binding
                $exchange['object']->bind($bind['queue'], array_key_exists('bk', $bind) ? $bind['bk'] : null);
                $exchange['binds'] = $bind;
            }
            $this->_components['exchanges'][] = $exchange;
        }
    }

    public function __construct($idComponent) {
        try {
            $this->_xmlConfig = ZendExt_FastResponse::getXML('amqpconfig');
            $this->initAmqpConnection();
            $this->_xmlConfig = ZendExt_FastResponse::getXML('amqpconfig')->$idComponent;
            $this->initAmqpComponents();
        } catch (Exception $e) {
            if(!strstr($e->getMessage(), "Error Connecting to server")) {
                throw $e;
            } else {
                ZendExt_Logger::write($e);
                echo "<script type=\"text/javascript\">mostrarMensaje(8, 'EL servidor RabbitMQ no se encuentra disponible.')</script>";
            }
        }
    }

    public function subscribe($callback, $queueName = null, $consumerTag = '') {
        if ($this->isConnected()) {
            $queueObj = ($queueName == null) ? $this->_components['queues'][0]['object'] : $this->queues->$queueName;
            //Consuming 1 to 1 messages.
            $queueObj->getChannel()->basic_qos(0, 1, false);
            $queueObj->consume($callback, $consumerTag);
        }
    }

    public function publish($msgBody, $properties = array(), $routeKey = null) {
        if ($this->isConnected()) {
            /* foreach(self :: $_messageProperties as $key => $value){
              if(! array_key_exists($key, $properties)){
              $properties[$key] = $value;
              }
              } */
            $msg = new Rabbit_Message($msgBody/* , $properties */);
            $this->_components['exchanges'][0]['object']->publish($msg, $routeKey);
        }
    }

    public function __get($attrib) {
        switch ($attrib) {
            case 'exchanges': return $this;
            case 'queues': return $this;
            default: break;
        }
        foreach ($this->_components['exchanges'] as $exchange) {
            if ($exchange['name'] == $attrib) {
                return $exchange['object'];
            }
        }
        foreach ($this->_components['queues'] as $queue) {
            if ($queue['name'] == $attrib) {
                return $queue['object'];
            }
        }
        return null;
    }

    public function getConnection() {
        return $this->_conn;
    }

    public function isConnected() {
        return $this->_conn->isConnected();
    }

    public function connect() {
        return $this->_conn->connect();
    }

    public function close() {
        if ($this->isConnected())
            $this->_conn->close();
    }

}
