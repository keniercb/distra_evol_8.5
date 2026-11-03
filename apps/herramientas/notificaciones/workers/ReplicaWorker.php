<?php

/**
 * ReplicaWorker
 * Worker responsable de responder notificaciones del gestornc.
 *
 * @author Jessica Saenz
 */
class ReplicaWorker extends Amqp_Worker_Abstract
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

        $this->mandarNotificacion(
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

    private function mandarNotificacion($destinatario, $fecha, $remitente)
    {

        $evento = Doctrine::getTable('DatEvent')->findBy(
            'nombre', 'adicionar ambiente'
        )->toArray();
        if (count($evento) == 0) {
            $evento = new DatEvent();
            $evento->nombre = 'adicionar ambiente';
            $evento->descripcion = 'adicionar ambiente';
            $evento->save();
        } else {
            $objEvent = $evento[0];
            $evento = new DatEvent();
            $evento->activo = $objEvent['activo'];
            $evento->interno = $objEvent['interno'];
            $evento->nombre = $objEvent['nombre'];
            $evento->idevento = $objEvent['idevento'];
            $evento->descripcion = $objEvent['descripcion'];
            $evento->referencia = $objEvent['referencia'];
        }

        $objAviso = Doctrine::getTable('DatAviso')->findBy(
            'denominacion', 'Adicion de ambiente'
        )->toArray();
        $iddestinatario = 0;
        if (count($objAviso) == 0) {
            $iddestinatario = DatDestinatarioModel:: insertarDestinatario(
                2, $destinatario
            );
            $objAviso = new DatAviso();
            $objAviso->denominacion = 'Adicion de ambiente';
            $objAviso->activo = 1;
            $objAviso->descripcion = 'Adicion de ambiente';
            $objAviso->creadopor = $remitente;
            $objAviso->idtipoaviso = 1;
            $objAviso->save();

            $objEventoAviso = new DatEventoAviso();
            $objEventoAviso->idevento = $evento->idevento;
            $objEventoAviso->idaviso = $objAviso->idaviso;
            $objEventoAviso->save();

            $content = new DatContenido();
            $content->idtipocont = 2;
            $content->save();

            $avisoDestViaCont = new DatAvisoDestinatarioViaContenido();
            $avisoDestViaCont->idaviso = $objEventoAviso->idaviso;
            $avisoDestViaCont->iddestinatario = $iddestinatario;
            $avisoDestViaCont->idcontenido = $content->idcontenido;
            $avisoDestViaCont->save();
        } else {
            $aviso = $objAviso[0];
            $objAviso = new DatAviso();
            $objAviso->denominacion = $aviso['denominacion'];
            $objAviso->activo = $aviso['activo'];
            $objAviso->descripcion = $aviso['descripcion'];
            $objAviso->creadopor = $aviso['creadopor'];
            $objAviso->idtipoaviso = $aviso['idtipoaviso'];
            $objAviso->idaviso = $aviso['idaviso'];
        }
        $notificacion = new DatEventoAvisoDestinatario();
        if ($iddestinatario == 0) {
            $notificacion->idevento = $evento->idevento;
            $notificacion->idaviso = $objAviso->idaviso;
            $iddestinatario = DatDestinatarioModel:: insertarDestinatario(
                2, $destinatario
            );
            $notificacion->iddestinatario = $iddestinatario;
        } else {
            $notificacion->iddestinatario = $iddestinatario;
            $notificacion->idaviso = $objAviso->idaviso;
            $notificacion->idevento = $evento->idevento;
        }
        $notificacion->originadopor = $remitente;
        $notificacion->fecha = $fecha;
        $notificacion->estado = 1;
        $notificacion->save();

        return true;
    }
}
