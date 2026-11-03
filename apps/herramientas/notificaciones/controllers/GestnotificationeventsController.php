<?php

/**
 * Class GestnotificationeventsController
 *
 * Controlador utilizado para gestionar los eventos.
 */
class GestnotificationeventsController extends ZendExt_Controller_Secure
{
    /**
     * @var ComponentSpecModel
     */
    private $_cmpModel;

    /**
     * @var DatEventModel
     */
    private $_eventModel;

    /**
     * @var XmlHandlerModel
     */
    private $_xmlHandlerModel;

    /**
     * Inicializa los atributos de la clase.
     */
    public function init()
    {
        parent::init();
        $this->view->dirEtiquetas
            = '../../views/idioma/' . $this->global->Perfil->idioma
            . '/gestnotificationevents/gestnotificationevents.js';
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->_cmpModel = new ComponentSpecModel();
        $this->_eventModel = new DatEventModel();
        $this->_xmlHandlerModel = new XmlHandlerModel();
    }

    /**
     * Acción que imprime un el idioma del usuario autenticado en formato JSON.
     *
     * @response json
     */
    public function obteneridiomaAction()
    {
        echo json_encode(array('idioma' => $this->global->Perfil->idioma));
    }

    /**
     * Acción que visualiza la inetrfaz de gestión de notificaciones.
     *
     * @response html
     */
    public function gestnotificationeventsAction()
    {
        $this->view->scriptsBuscarPersona
            = $this->integrator->pvd->mostrarIUBuscarPersona();
        $this->render();
    }

    /**
     * Acción que imprime los sistemas instalados y sus funcionalidades
     * en formato JSON.
     *
     * @request $_POST = array(
     *     "node" => "identificador del nodo del arbol de funcionalidades"
     * )
     *
     * @response json
     */
    public function mostrarfuncionalidadesAction()
    {
        $node = $this->_request->getPost('node');
        echo json_encode($this->_cmpModel->mostrarFuncionalidades($node));
    }

    /**
     * Acción que inserta un evento.
     *
     * @request $_REQUEST = array(
     *     "values" = {
     *         "eventName":"nombre del evento",
     *         "descripcion":"descripción del evento",
     *         "ejecucion":"cuando se ejecuta el evento (antes, despues o
     * cuando falla una acción)",
     *         "dirAction":"acción a partir de la que se genera el evento"
     *     }
     * )
     *
     * @response json
     */
    public function insertareventoAction()
    {
        $aspecto = null;
        $values = json_decode($this->_request->values);

        if($values->dirAction)
           $this->_xmlHandlerModel->updateXmlWeaver($values->dirAction);
        $evento = new DatEvent();
        $evento->nombre = $values->eventName;
        $evento->descripcion = $values->descripcion;
        $event = Doctrine::getTable('DatEvent')->findBy(
            'nombre', $evento->nombre
        )->toArray();
        if (count($event) == 0) {
            if (isset($values->ejecucion) && isset($values->dirAction)) {
                $aspecto = array();
                $aspecto['ejecucion'] = ($values->ejecucion) ? $values->ejecucion : '';
                $aspecto['accion'] = ($values->dirAction) ? $values->dirAction : '';
                $evento->referencia = $aspecto['accion'];
            }
            $this->_eventModel->insertardat_evento($evento);

            if (is_array($aspecto)) {
                $this->_xmlHandlerModel->insertarEvento(
                    $evento->nombre, $aspecto
                );
            }
            echo json_encode(array('cod' => 1, 'msgLabel' => 'msgEventAdded'));
        } else {
            echo json_encode(array('cod' => 6, 'msgLabel' => 'msgEventAdded'));
        }
    }

    /**
     * Acción que activa o desactiva el evento.
     *
     * @request $_REQUEST = array(
     *     "idevento" => "Identificador del evento",
     *     "onlyDesactivate" => "true o false para desactivar o activar evento"
     * )
     *
     * @response json
     */
    public function activardesactivarAction()
    {
        $evento = Doctrine::getTable('DatEvent')->find(
            $this->_request->idevento
        );
        $evento->activo = $this->_request->onlyDesactivate
            ? 0
            : (integer)!NotificacionesUtil::toStrictBoolean($evento->activo);
        $this->_eventModel->modificardat_evento($evento);
        echo json_encode(
            array(
                'msgLabel' => NotificacionesUtil:: toStrictBoolean(
                    $evento->activo
                )
                    ? 'msgEventActived'
                    : 'msgEventDesactived'
            )
        );
    }

    /**
     * Acción que modifica el evento.
     *
     * @request $_REQUEST = array(
     *     "idevento" => "identificador del evento",
     *     "changes" => {
     *         "eventName":"nuevo nombre del evento",
     *         "oldName":"nombre actual del evento",
     *         "ejecucion":"nueva ejecución del evento",
     *         "oldExecution":"ejecución actual del evento",
     *         "fromAction":"nueva acción que genera el evento",
     *         "oldReference":"acción actual que genera el evento",
     *         "descripcion":"descripción del evento"
     *     }
     * )
     *
     * @response json
     */
    public function modificareventoAction()
    {
        $flag = true;
        $idevento = $this->_request->idevento;
        $evento = Doctrine:: getTable('DatEvent')->find($idevento);
        $changes = json_decode($this->_request->changes);

        if ($changes->eventName) {
            $event = Doctrine::getTable('DatEvent')->findBy(
                'nombre', $evento->nombre
            )->toArray();
            if (count($event) == 1 && $idevento == $event[0]['idevento']) {
                $evento->nombre = $changes->eventName;
            }else{
                $flag = false;
            }
        }

        if (!$flag) {
            echo json_encode(
                array('cod' => 6, 'mensaje' => 'El evento ya existe.')
            );
            return;
        }
        if ($changes->descripcion) {
            $evento->descripcion = $changes->descripcion;
        }
        if ($changes->fromAction) {
            $evento->referencia = $changes->fromAction;
        }
        if ($changes->oldReference && !$changes->fromAction) {
            $evento->referencia = null;
        }
        $this->_eventModel->modificardat_evento($evento);

        if ($changes->oldReference || $changes->oldName
            || $changes->oldExecution
        ) {
            $z = ($changes->oldReference) ? $changes->oldReference
                : $evento->referencia;
            $this->_xmlHandlerModel->updateXmlWeaver($z);
            $z1 = ($changes->oldName) ? $changes->oldName : $evento->nombre;
            $z2 = ($changes->oldReference) ? $changes->oldReference
                : $evento->referencia;
            $this->_xmlHandlerModel->eliminarEvento($z1, $z2);
            $this->_xmlHandlerModel->reloadXmlNotification();
        }

        if ($changes->fromAction || $changes->eventName
            || $changes->ejecucion
        ) {
            $aspecto = array();
            $aspecto['ejecucion'] = $this->_getParam('ejecucion');
            $aspecto['accion'] = $evento->referencia;
            $this->_xmlHandlerModel->updateXmlWeaver($evento->referencia);
            $this->_xmlHandlerModel->insertarEvento(
                $evento->nombre, $aspecto
            );
        }
        echo json_encode(
            array('cod' => 1, 'msgLabel' => 'msgEventUpdated')
        );
    }

    /**
     * Acción que elimina el evento.
     *
     * @request $_POST = array(
     *     "idevento" => "identificador del evento"
     * )
     *
     * @response json
     */
    public function eliminareventoAction()
    {
        $idevento = $this->_request->getPost('idevento');
        $evento = Doctrine:: getTable('DatEvent')->find($idevento);

        try {
            $this->_eventModel->eliminardat_evento($evento);
            if($evento->referencia !== NULL) {
                $this->_xmlHandlerModel->updateXmlWeaver($evento->referencia);
                $this->_xmlHandlerModel->eliminarEvento(
                    $evento->nombre, $evento->referencia ? $evento->referencia : ''
                );
            }
            echo json_encode(
                array('cod' => 7, 'msgLabel' => 'msgEventDeleted')
            );
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) {
                echo json_encode(
                    array('cod' => 6, 'msgLabel' => 'msgEventDeletedUnsuccess')
                );
            } else {
                throw $e;
            }
        }
    }

    /**
     * Acción que lista los eventos en formato JSON.
     *
     * @request $_REQUEST = (
     *     "start" => "número de página del listado",
     *     "limit" => "límite de registros de cada página"
     * )
     *
     * @response json
     */
    public function listareventosAction()
    {
        $events = $this->_eventModel->listar_eventos(
            $this->_request->start, $this->_request->limit
        );
        $list = array();
        $list['total'] = DatEvent::getTotal();
        $list['events'] = array();
        foreach ($events as $event) {
            $event['ejecucion'] = $this->_xmlHandlerModel->getEventExecution(
                $event['nombre'], $event['referencia']
            );
            $list['events'][] = $event;
        }
        echo json_encode($list);
    }

    /**
     * Acción que obtiene el identificador del evento a partir del nombre.
     *
     * @request $_REQUEST = (
     *     "nombre" => "nombre del evento"
     * )
     *
     * @response json
     */
    public function obtenerideventopornombreAction()
    {
        echo json_encode(
            array('id' => $this->_eventModel->getIdByName(
                $this->_request->nombre
            ))
        );
    }

}
