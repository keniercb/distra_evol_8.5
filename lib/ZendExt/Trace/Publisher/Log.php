<?php

class ZendExt_Trace_Publisher_Log
{
    /**
     * Instancia del Xml de config de las trazas.
     *
     * @var SimpleXmlElement.
     */
    private $_xml;

    /**
     * Constructor
     *
     * @return void.
     */
    function __construct()
    {
        $this->_xml = ZendExt_FastResponse:: getXML('traceconfig');
    }

    function save($pContainer)
    {

        $className = get_class($pContainer); //Obtengo el nombre de la clase del contenedor

        $tmp = $this->_xml->containers->$className; //Busco su rama dentro del Xml de trazas

        $enabled = (int)$tmp ['enabled'];

        if ($enabled) {

            try {

                $logger = $tmp->logger;
                $class = (string)$logger['class'];
                $method = (string)$logger['method'];

                $usuario = (string)$pContainer->getUser();
                $tipo = (string)$tmp['alias'];

                if ($tipo === 'Fallo de Autenticación') {

                    $usuario = (string)$pContainer->getPUser();
                    $p = array('usuario' => $usuario, 'tipo' => $tipo);
                } else if ($tipo === 'Bloqueo') {

                    $ipPC = (string)$pContainer->getBloqueado();
                    $p = array('usuario' => $usuario, 'tipo' => $tipo, 'Entidad bloqueada' => $ipPC);
                } else {

                    $p = array('usuario' => $usuario, 'tipo' => $tipo);
                }


                $class:: $method ($p);
                foreach ($pContainer->getChildren() as $child) {
                    $this->save($child);
                }

            } catch (Exception $e) {
                throw new ZendExt_Exception('TRACE001', $e);
            }
        }

    }

}
