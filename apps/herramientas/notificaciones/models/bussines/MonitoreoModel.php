<?php

/**
 * MonitoreoModel
 *
 * @author  Ernesto Herrera Morales
 * @version 1.0
 */
class MonitoreoModel extends ZendExt_Model
{

    private $_personaModel;

    public function __construct()
    {
        parent::__construct();
        $this->_personaModel = new DatPersonaNotificacionesModel();
    }

    public function listarEventosDespachados(
        $start = 0, $limit = 10, $params = array()
    )
    {
        $eventsDispatched = HisEventoDespachado:: getDispatchedEvents(
            $start, $limit, $params
        );
        $personaModel = new DatPersonaNotificacionesModel();
        $formattedEvents = array();
        foreach ($eventsDispatched as $event) {
            $person = $this->integrator->seguridad->getIdPersonaByIdUsuario(
                $event['sender']
            );
            if ($person[0]['idpersona']) {
                $event['sender'] = $personaModel->getFullName(
                    null, $person[0]['idpersona']
                );
            } else {
                if ($person[0]['idusuario']) {
                    $event['sender'] = $this->integrator->seguridad->nombreUsuario($person[0]['idusuario']);
                }
            }
            $formattedEvents[] = $event;
        }

        return $formattedEvents;
    }

    public function listarAvisosEnviados(
        $ideventodespachado = null, $start = 0, $limit = 20, $params = array()
    )
    {
        $personaModel = new DatPersonaNotificacionesModel();
        $sql = HisEventoDespachado:: getAvisosEnviadosCommonQuery(
            $ideventodespachado, $params, $start, $limit
        );
        $notsSended = Doctrine_Manager:: getInstance()->getCurrentConnection()
            ->fetchAssoc($sql);
        $formattedEvents = array();
        foreach ($notsSended as $not) {
            if ($not['creadopor'] != -1) {
                $person = $this->integrator->seguridad->getIdPersonaByIdUsuario(
                    $not['creadopor']
                );
                if ($person[0]['idpersona']) {
                    $not['creadopor'] = $personaModel->getFullName(
                        null, $person[0]['idpersona']
                    );
                } else {
                    if ($person[0]['idusuario']) {
                        $not['creadopor'] = $this->integrator->seguridad->nombreUsuario($person[0]['idusuario']);
                    }
                }
            } else {
                $not['creadopor'] = "";
            }
            $formattedEvents[] = $not;
        }

        return $formattedEvents;
    }

    public function totalAvisosEnviados(
        $ideventodespachado = null, $params = array()
    )
    {
        $sql = HisEventoDespachado:: getAvisosEnviadosCommonQuery(
            $ideventodespachado, $params, null, null, true
        );
        $sql = "SELECT COUNT(*) FROM (" . $sql . ") as x";

        return Doctrine_Manager:: getInstance()->getCurrentConnection()
            ->fetchOne($sql);
    }

    public function totalEventosDespachados($params = array())
    {
        return HisEventoDespachado:: getTotal($params);
    }

    public function mostrarMensajesEnviadosPorEventoDespachado(
        $ideventodespachado
    )
    {
        $query
            = 'SELECT task.idtarea as idtarea,
                          c.presentacion as via,
                          task.viaaviso as idvia,
                          task.asuntoreal as asunto,
                          task.contenidoreal as cuerpo,
                          task.fechacreacion as fechaenvio,                           
                          e.nombre as estado,
                          e.descripcion as detalle,
                          r.observacion as observacion
                  FROM his_tareaaviso task
                  INNER JOIN nom_tipocontenido c ON task.viaaviso = c.viaenvio
                  INNER JOIN his_respuestatarea r ON task.idtarea = r.idtarea
                  INNER JOIN nom_estadotarea e ON e.idestado = r.estadotarea
                  WHERE (task.ideventodespachado = ' . $ideventodespachado
            . ')';

        return $this->conn->fetchAll($query);
    }

    public function listarDestinatariosPorMensaje(
        $idtask, $via, $start, $limit, $params = array()
    )
    {
        $result = array();
        if ($idtask && $via) {
            $this->destinatariosReal
                =
            $realContacts = HisTareaAviso:: getRealDestAndContacts($idtask);
            $hasConfirmation = HisRespuestaTarea:: hasConfirmation($idtask);
            $dests = $realContacts[0];
            $contacts = $realContacts[1];
            $cantDest = count($dests);
            $cantCtos = count($contacts);
            for ($i = $start; $i < $limit + $start; $i++) {
                $destInfo = array();
                if ($dests[$i]) {
                    $destInfo['iddestinatario'] = $dests[$i];
                    $destInfo['nombre'] = $this->_personaModel->getFullName(
                        null, $dests[$i]
                    );
                    if ($cantDest != $cantCtos) {
                        $dirsCto
                            = $this->integrator->pvd->
                        BuscarDatosContactosByArrIdPersonas(
                            array($dests[$i])
                        );
                        foreach ($dirsCto as $dir) {
                            if ($dir['idtipomediocontacto'] == $via) {
                                $destInfo['contacto'] = $dir['numero'];
                                break;
                            }
                        }
                    } else {
                        $destInfo['contacto'] = $contacts[$i];
                    }
                    if (!$hasConfirmation) {
                        $destInfo['exito'] = $hasConfirmation;
                        $destInfo['detalle']
                            = 'No se ha tenido confirmación del mensaje.';
                    } else {
                        $confirmation = HisTareaAviso::getConfirmationByCto(
                            $idtask, $destInfo['contacto']
                        );
                        $destInfo['exito'] = $confirmation[0]['exito'];
                        $destInfo['detalle'] = $confirmation[0]['detalle'];
                        $destInfo['fecha'] = $confirmation[0]['fecha'];
                    }
                    $result[] = $destInfo;
                } else {
                    break;
                }
            }
        }

        return $result;
    }

    public function totalListarDestinatariosPorMensaje(
        $idtask, $via, $params = array()
    )
    {
        if ($idtask) {
            if ($this->destinatariosReal) {
                return count($this->destinatariosReal[0]);
            } else {
                $dest = HisTareaAviso:: getRealDestAndContacts($idtask);

                return count($dest[0]);
            }
        }

        return 0;
    }
}