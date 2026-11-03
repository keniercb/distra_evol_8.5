<?php

/**
 * ZendExt_Aspect_Notification
 *
 *
 * @author    Ernesto Herrera Morales
 * @copyright UCID-ERP-Cuba
 * @package   ZendExt_Aspect
 * @version   1.0-0
 */
final class ZendExt_Aspect_Notification implements ZendExt_Aspect_ISinglenton
{
    /**
     * Instancia de ZendExt_Event_Notification
     *
     * @var ZendExt_Event_Notification
     */
    private $_eventnotificationInstance;

    /**
     * Constructor de la clase, es privado para impedir que pueda
     * ser instanciado y de esta forma garantizar que la instancia
     * sea un singleton
     *
     * @return void
     */
    private function __construct()
    {
        $this->_eventnotificationInstance = ZendExt_Event_Notification :: getInstance();
    }

    /**
     * Obtención de la instancia de la clase, ya que esta no puede ser
     * instanciada directamente debido a que es un singleton.
     *
     * @return ZendExt_Aspect_Notification - instancia de la clase
     */
    static public function getInstance()
    {
        static $instance;
        if (!isset($instance)) {
            $instance = new self();
        }
        return $instance;
    }

    /**
     * dispatchEventNotification
     * Lanza eventos que generan notificaciones o avisos.
     *
     * @return void
     */
    private function dispatchEventNotification(SimpleXMLElement $action, $execution)
    {
        foreach ($action->events->event as $event) {
            if ($event['execution'] == $execution) {
                $this->_eventnotificationInstance->dispatch((string)$event['name'], true);
            }
        }
    }

    /**
     * dispatchEventNotification
     * Lanza eventos que generan notificaciones o avisos
     * antes de ejecutarse la acción correspondiente.
     *
     * @return void
     */
    public function preDispatchEventNotification($action)
    {
        if ($action instanceof SimpleXMLElement) {
            $this->dispatchEventNotification($action, 'pre');
        }
    }

    /**
     * dispatchEventNotification
     * Lanza eventos que generan notificaciones o avisos
     * después de ejecutarse la acción correspondiente.
     *
     * @return void
     */
    public function postDispatchEventNotification($action)
    {
        if ($action instanceof SimpleXMLElement) {
            $this->dispatchEventNotification($action, 'post');
        }
    }

    /**
     * dispatchEventNotification
     * Lanza eventos que generan notificaciones o avisos
     * si falla la acción correspondiente en tiempo de ejecución.
     *
     * @return void
     */
    public function failedDispatchEventNotification($action)
    {
        if ($action instanceof SimpleXMLElement) {
            $this->dispatchEventNotification($action, 'failed');
        }
    }

}

