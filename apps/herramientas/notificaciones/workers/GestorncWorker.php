<?php

/**
 * GestorncWorker
 * Worker responsable de responder notificaciones del gestornc.
 *
 * @author Jessica Saenz
 */
class GestorncWorker extends Amqp_Worker_Abstract
{
    /**
     * Instancia de un cliente de telecomunicaciones.
     *
     * @var TelematicClientModel $_telematicClient
     */
    private $_telematicClient;

    public function __construct($idProcess)
    {
        parent:: __construct($idProcess);
        $this->_telematicClient = TelematicClientModel:: getInstance();
    }

    /**
     * work
     * Realiza las tareas de notificación.
     *
     * @param array $args
     *
     * @return void
     */
    public function work($args)
    {
        //$this->integrator->notification->sendEmail(array('aaclaro@xetid.cu'),
        //'mi asunto','mi contenido');
        $this->sendDesktopNotification(
            $args->destinatario_usuario[0], $args->fecha, $args->remitente
        );

    }

    /**
     * sendDesktopNotification
     * Envía una notificación a la bandeja de notificaciones del destinatario.
     *
     * @param string $destinatario Destinatario de la notificacion
     * @param timestam $fecha      Hora de ejecucion del evento
     * @param string $remitente    Remitente de la notificacion
     *
     * @return void
     */

    private function sendDesktopNotification($destinatario, $fecha, $remitente)
    {
        $evento = Doctrine::getTable('DatEvent')->findBy(
            'nombre', 'gestor de no conformidades'
        )->toArray();
        if (count($evento) == 0) {
            $evento = new DatEvent();
            $evento->nombre = 'gestor de no conformidades';
            $evento->descripcion = 'gestor de no conformidades';
            $eventModel = new DatEventModel();
            $eventModel->insertardat_evento($evento);
        }
        $objAviso = Doctrine::getTable('DatAviso')->findBy(
            'denominacion', 'Incidencia de soporte'
        )->toArray();
        $iddestinatario = 0;
        if (count($objAviso) == 0) {
            $iddestinatario = DatDestinatarioModel:: insertarDestinatario(
                2, $destinatario
            );
            $objAviso = new DatAviso();
            $objAviso->denominacion = 'Incidencia de soporte';
            $objAviso->activo = 1;
            $objAviso->descripcion = 'Incidencia de soporte';
            $objAviso->creadopor = $remitente;
            $objAviso->idtipoaviso = 1;
            $avisoModel = new DatAvisoModel();
            $avisoModel->insertardat_aviso($objAviso);

            $objEventoAvisoModel = new DatEventoAvisoModel();
            $objEventoAviso = new DatEventoAviso();
            $objEventoAviso->idevento = $evento->idevento;
            $objEventoAviso->idaviso = $objAviso->getData()['idaviso'];
            $objEventoAvisoModel->insertardat_evento_aviso($objEventoAviso);

            $content = new DatContenido();
            $content->idtipocont = 2;
            $content->save();

            $avisoDestViaCont = new DatAvisoDestinatarioViaContenido();
            $avisoDestViaCont->idaviso = $objEventoAviso->idaviso;
            $avisoDestViaCont->iddestinatario = $iddestinatario;
            $avisoDestViaCont->idcontenido = $content->getData()['idcontenido'];

            $avisoDestViaContModel = new DatAvisoDestinatarioViaContenidoModel(
            );
            $avisoDestViaContModel->
            insertardat_aviso_destinatario_via_contenido(
                $avisoDestViaCont
            );
        }
        $notificacion = new DatEventoAvisoDestinatario();
        if ($iddestinatario == 0) {
            $notificacion->idevento = $evento[0]['idevento'];
            $notificacion->idaviso = $objAviso[0]['idaviso'];
            $iddestinatario = DatDestinatarioModel:: insertarDestinatario(
                2, $destinatario
            );
            $notificacion->iddestinatario = $iddestinatario;
        } else {
            $notificacion->iddestinatario = $iddestinatario;
            $notificacion->idaviso = $objAviso->getData()['idaviso'];
            $notificacion->idevento = $evento->idevento;
        }
        $notificacion->originadopor = $remitente;
        $notificacion->fecha = $fecha;
        $notificacion->estado = 1;
        $notificacion->save();

        return true;
    }
}
