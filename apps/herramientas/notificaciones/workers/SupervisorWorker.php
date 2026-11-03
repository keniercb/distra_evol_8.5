<?php

/**
 * SupervisorWorker
 * Worker responsable de hacer tareas de supervición o monitoreo de avisos.
 *
 * @author Ernesto Herrera Morales
 */
class SupervisorWorker extends Amqp_Worker_Abstract
{

    /**
     * __construct
     * Constructor de la clase.
     *
     * @param string $idProcess
     */
    public function __construct($idProcess = '')
    {
        parent::__construct($idProcess);
    }

    /**
     * work
     * Realiza las tareas de supervición o monitoreo.
     *
     * @param mixed $args
     */
    public function work($args)
    {
        if ($task = HisTareaAviso:: getIdByUuid($args->idtask)) {
            $taskAnswer = HisRespuestaTarea:: getByTask($task);
            if (!$taskAnswer) {
                $taskAnswer = new HisRespuestaTarea();
                $taskAnswer->idtarea = $task;
                $taskAnswer->estadotarea = NomEstadoTarea:: getIdByCode(
                    $args->code
                );
                $taskAnswer->observacion = $args->observacion;
            }
            $i = count($taskAnswer->HisRespuestaDestinatario);
            foreach ($args->destinatarios as $dest) {
                $taskAnswer->HisRespuestaDestinatario[$i]->destinatario
                    = $dest->destinatario;
                $taskAnswer->HisRespuestaDestinatario[$i]->fecha = $dest->fecha;
                $taskAnswer->HisRespuestaDestinatario[$i++]->observacion
                    = $dest->observacion;
            }
            $taskAnswer->save();
        } else {
            echo "the task is not have a event configured...\n";
        }
    }
}