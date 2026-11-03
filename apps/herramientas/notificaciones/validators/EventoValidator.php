<?php

/**
 * Description of EventoValidator
 *
 * @author Ernesto Herrera Morales
 */
class EventoValidator
{

    private $_values;
    private $_arrayReference;
    private $_xmlHandler;

    public function __construct()
    {
        $this->_values = json_decode($_POST['values']);
        $this->_arrayReference = explode(
            ComponentSpecModel::SEPARATOR, $this->_values->dirAction
        );
        $this->_xmlHandler = new XmlHandlerModel();
    }

    /**
     * validarNombreEvento_bi
     * Valida que el nombre del evento no exista.
     *
     * @return boolean
     */
    public function validarNombreEvento_bi()
    {
        $event = Doctrine::getTable('DatEvent')->findBy(
            'nombre', $this->_values->eventName
        )->toArray();

        return count($event) == 0;
    }

    /**
     * validarAccionEjecucionEvento
     * Valida que la acción configurada para el evento a insertar,
     * no despache otros
     * eventos con la misma ejecución.
     *
     * @return boolean
     */
    public function validarAccionEjecucionEvento()
    {
        if (isset($this->_values->dirAction)) {
            $xmlN = $this->_xmlHandler->notification->xml;
            $nodes = XmlHandlerModel::getNodes($xmlN, $this->_arrayReference);
            if ($nodes[count($this->_arrayReference)]->{
            XmlHandlerModel::EVENT_NODE . "s"}
            ) {
                return XmlHandlerModel::checkEventExecution(
                    $nodes[count($this->_arrayReference)]->{
                    XmlHandlerModel::EVENT_NODE . "s"},
                    $this->_values->ejecucion
                );
            }
        }

        return true;
    }

    /**
     * validarPermisosXMLs
     * Valida que los xmls del componente de notificación del
     * MT tengan permisos de
     * escritura para realizar en ellos las operaciones pertinentes.
     *
     * @return boolean
     */
    public function validarPermisosXMLs()
    {
        if (!isset($this->_values->idnode)) {
            $xmlnePath = $this->_xmlHandler->notificationevents->path;
            if (!is_writable($xmlnePath)) {
                return false;
            }
        } else {
            $xmls = $this->_xmlHandler->getXMLs();
            foreach ($xmls as $xml) {
                $currentXmlPath = $this->_xmlHandler->$xml->path;
                if (!is_writable($currentXmlPath)) {
                    return false;
                }
            }
        }

        return true;
    }

}