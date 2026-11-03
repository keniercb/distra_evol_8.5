<?php

/**
 * NotificationWorker
 * Worker responsable de hacer tareas de notificación.
 *
 * @author Ernesto Herrera Morales
 */
class NotificationWorker extends Amqp_Worker_Abstract
{

    /**
     * Instancia del manejador de XML del componente de notificaciones.
     *
     * @var XmlHandlerModel $_xmlHandlerModel
     */
    private $_xmlHandlerModel;
    /**
     * Instancia de un cliente de telecomunicaciones.
     *
     * @var TelematicClientModel $_telematicClient
     */
    private $_telematicClient;
    /**
     * Instancia del modelo de personas.
     *
     * @var DatPersonaNotificacionesModel $_personaModel
     */
    private $_personaModel;
    /**
     * Instancia del modelo de estructuras.
     *
     * @var DatEstructuraNotificacionesModel $_estructuraModel
     */
    private $_estructuraModel;
    /**
     * Instancia del modelo de eventos del sistema.
     *
     * @var DatEventModel $_eventoModel
     */
    private $_eventoModel;
    /**
     * Identificador del aviso que despacha el worker.
     *
     * @var mixed $_idNotification
     */
    private $_idNotification;
    /**
     * Direcciones de contactos de las personas a las que se le enviará la notificación actual.
     *
     * @var array $_ctosDestinatarios
     */
    private $_ctosDestinatarios;
    /**
     * Identificadores de las personas a las que se le enviará la notificación actual.
     *
     * @var array $_idsDestinatarios
     */
    private $_idsDestinatarios;

    /**
     * __construct
     * Constructor de la clase.
     *
     * @param string $idProcess
     */
    public function __construct($idProcess)
    {
        parent :: __construct($idProcess);
        //$this->_xmlHandlerModel = new XmlHandlerModel();
        $this->_telematicClient = TelematicClientModel :: getInstance();
        $this->_personaModel = new DatPersonaNotificacionesModel();
        $this->_estructuraModel = new DatEstructuraNotificacionesModel();
        $this->_eventoModel = new DatEventModel();
        $this->registerTask = ZendExt_Event_Notification :: NOTIFICATION_TASK;
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
		//var_dump($args);die;
        $args=get_object_vars($args);
        $incidencia = json_decode(json_encode($args['incidencia']),TRUE);//aqui obtengo la incidencia
//var_dump($incidencia);die;
        $notificationEventDispatched = new HisEventoDespachado();
        $notificationEventDispatched->originadopor = $args['sender'];
        $notificationEventDispatched->detalle = "";
        $countDispatched = 0;
        try {
            if (($evento = $args[0]) !== null) {
                $tmp=DatEvent :: getId($evento);
                $notificationEventDispatched->idevento = DatEvent :: getId($evento);
                if (NotificacionesUtil :: toStrictBoolean(DatEvent :: isActive($evento))) {
                    $notifications = $this->_eventoModel->getNotificationsInfoByEvent($evento);
                    foreach ($notifications as $notification) {
                        if (DatAvisoModel::isActive($notification['a_id'])) {
                            $commandArgs = $args[1];
                            if ($notification['a_component'] && $notification['a_service']) {
                                if (!is_array($commandArgs)) {
                                    $commandArgs = NotificacionesUtil::object2Array($commandArgs);
                                }
                                $commandArgs['idaviso'] = $notification['a_id'];
                                $result = $this->execCommand(
                                    array($notification['a_component'], $notification['a_service']), $commandArgs
                                );
                                if ($result['success'] === true) {
                                    $result['data'] = ($result['data']) ? $this->formatExtraData($result['data'])
                                        : $this->formatExtraData($commandArgs->data);
                                    if (!$result['destinatarios']) {
                                        $result['destinatarios'] = $commandArgs->destinatarios;
                                    }
                                    $this->sendDesktopNotification(
                                        $notification['a_id'],
                                        $result['data'],
                                        $result['destinatarios'],
                                        $args['fecha'],
                                        $args['sender'],
                                        $tmp
                                    );
                                    $this->sendNotification(
                                        $notification['a_id'],
                                        $result['data'],
                                        $result['destinatarios']
                                    );
                                    $countDispatched++;
                                } else {
                                    $notificationEventDispatched->detalle
                                        .= "<br/>La validación del aviso (" . DatAvisoModel :: getName(
                                            $notification['a_id']
                                        ) . ") no se cumplió. <br/>";
                                }
                            } else {
                                $this->sendDesktopNotification(
                                    $notification['a_id'],
                                    isset($commandArgs->data) ? $this->formatExtraData($commandArgs->data) : null,
                                    $commandArgs->destinatarios,
                                    $args['fecha'],
                                    $args['sender'],
                                    $tmp
                                );
                                $this->sendNotification(
                                    $notification['a_id'],
                                    isset($commandArgs->data) ? $this->formatExtraData($commandArgs->data) : null,
                                    $commandArgs->destinatarios,
                                    $incidencia
                                );
                                $countDispatched++;
                            }
                        } else {
                            $notificationEventDispatched->detalle
                                .= "<br/>El aviso " . $notification['a_id'] . "(" . DatAvisoModel :: getName(
                                    $notification['a_id']
                                ) . ")" . " no está activo. <br/>";
                        }
                    }
                } else {
                    $notificationEventDispatched->exito = 0;
                    $notificationEventDispatched->detalle .= "<br/>El evento no está activo.<br/>";
                }
            } else {
                return;
            }
        } catch (Exception $e) {
            $notificationEventDispatched->exito = 0;
            $notificationEventDispatched->detalle .= $e->getMessage() . "<br/>" . $e->getTraceAsString();
        }
        if ($countDispatched == 0) {
            $notificationEventDispatched->exito = 0;
            $notificationEventDispatched->detalle .= "<br/>No se envío ningún aviso.";
        }
        $notificationEventDispatched->fecha = NotificacionesUtil :: getCurrentDate();
        if ($notificationEventDispatched->idevento) {
            $notificationEventDispatched->save();
            $this->saveNotificationTasks($notificationEventDispatched);
        }
    }

    private function phoneticSearch($word) {
        $bagCorreo = array('email', 'e-mail', 'mail', 'mailito', 'correo electronico', 'Correo electr&oacute;nico', 'correo');
        $bagJabber = array('jabber', 'chat', 'mensajeria instantanea', 'Mensajer&iacute;a instantanea');
        foreach ($bagCorreo as $w){
            if(Util::spanish_metaphone($w) == Util::spanish_metaphone($word))
                return 2;
        }
        foreach ($bagJabber as $w){
            if(Util::spanish_metaphone($w) == Util::spanish_metaphone($word))
                return 6;
        }
        return 0;
    }

    /**
     * execCommand
     * Ejecuta un comando de validación o función notificadora dada su referencia.
     *
     * @param array $reference
     * @param array $args
     * @return array
     */

    private function execCommand($reference, $args = null)
    {
        list($component, $service) = $reference;
        return $this->integrator->$component->$service($args);
    }

    /**
     * getConcretDestinatariosByType
     * Devuelve los destinatarios concretos por su tipo.
     *
     * @param type $destinatarios
     *
     * @return array
     */
    private function getConcretDestinatariosByType($destinatarios)
    {
        $concretDestinatarios = array();
        $concretDestinatariosByType = array((string)$this->_personaModel    => array(),
            (string)$this->_estructuraModel => array());
        foreach ($destinatarios as $destinatario) {
            $concretDestinatarioModel = DatDestinatarioModel :: getConcretDestinatarioModel(
                $destinatario['idcontacto']
            );
            array_push(
                $concretDestinatarios, $concretDestinatarioModel->getConcretDestinatarios($destinatario['idcontacto'])
            );
        }
        foreach ($concretDestinatarios as $concretDestinatario) {
            if (array_key_exists((string)$this->_personaModel, $concretDestinatario)) {
                array_push(
                    $concretDestinatariosByType[(string)$this->_personaModel],
                    $concretDestinatario[(string)$this->_personaModel]
                );
            }
            if (array_key_exists((string)$this->_estructuraModel, $concretDestinatario)) {
                array_push(
                    $concretDestinatariosByType[(string)$this->_estructuraModel],
                    $concretDestinatario[(string)$this->_personaModel]
                );
            }
        }
        return $concretDestinatariosByType;
    }

    /**
     * getContactAddressesByVia
     * Devuelve las direcciones de contactos de los destinatarios con el tipo de medio pasados por parámetros.
     *
     * @param type $destinatarios
     * @param type $via
     *
     * @return array
     */
    private function getContactAddressesByVia($destinatarios, $via)
    {
		
        $contactAddresses = array();
        $ctos = array();
        if ($destinatarios[(string)$this->_personaModel]) {
            try {
                foreach ($destinatarios[(string)$this->_personaModel] as $dest) {
					array_push($ctos,$this->integrator->pvd->obtenerDatosContacto($dest));
                    //$ctos = $this->integrator->pvd->obtenerDatosContacto($dest);
                }
            }catch(Exception $e){
                ZendExt_Logger::write($e->getTraceAsString());
            }
        }
        //var_dump($ctos);die;
        //@TODO para estructuras...
        /* $entities = $this->integrator->metadatos->BuscarEntidadesXidestructura
         * ($atomicInfo['destinatarios'][(string)$estructuraModel]);
          $structureCtos = $this->integrator->pvd->GetPersonaByArrIdEntidades($entities, 1, PHP_INT_SIZE, 0); */
        //$contacts = $ctos->data;
        foreach ($ctos as $cto) {			
            $tmc = $this->phoneticSearch($cto->data[0]['denomtipomediocontacto']);
            if ($tmc == $via) {
                array_push($contactAddresses, $cto->data[0]['contacto']);
            }
        }
        //var_dump($contactAddresses);die;
        return $contactAddresses;
    }

    private function sendSistemaNotification($systemInfo, NotificationWorker $self)
    {
        $systemInfo['mensaje'] = array($systemInfo['mensaje']);
        //TODO agregarle el recurso a los contactos
        $this->_telematicClient->enviarMensajeListaContactos($systemInfo, $self);
    }

    private function sendSmstextNotification($smstextInfo, NotificationWorker $self)
    {
        //$smstextInfo['mensaje'] = array($smstextInfo['mensaje']);
        //TODO agregarle el recurso a los contactos
        //$this->_telematicClient->enviarMensajeListaContactos($smstextInfo, $self);
    }

    /**
     * sendJabberNotification
     * Envía una notificación vía jabber.
     *
     * @param array              $jabberInfo
     * @param NotificationWorker $self
     *
     * @return void
     */
    private function sendJabberNotification($jabberInfo, NotificationWorker $self)
    {
        $jabberInfo['mensaje'] = array($jabberInfo['mensaje']);
        $this->_telematicClient->enviarMensajeListaContactos($jabberInfo, $self);
        /* Utilizando servicio del MT no dependiente del componente telematico */
        foreach ($jabberInfo['destinatarios'] as $jabbercontact) {
            $jcontacts[] = $jabbercontact;
        }
        $xml = new SimpleXMLElement(file_get_contents(DIR_ABS_MT."apps/comun/recursos/xml/servers.xml"));
        $sjabber = (string)$xml->jabber['denominacion'];
        if($sjabber != null) {
            $this->integrator->notification->sendJabberNotification($jcontacts, $jabberInfo['mensaje'][0], $sjabber);
        }
    }

    /**
     * sendEmailNotification
     * Envía una notificación vía correo electrónico.
     *
     * @param array              $emailInfo
     * @param NotificationWorker $self
     *
     * @return void
     */
    private function sendEmailNotification($emailInfo, NotificationWorker $self)
    {
//        print_r(json_encode($self));
//        $aa = json_encode($self);
//        exec("echo $aa >> '/var/www/reg.log'");
//    die;

        if(!$this->_personaModel->existeGrupoconDestinatarios())
        {
//            if(!$this->_personaModel->existeGrupoconDestinatarios()){}
        }
        else{
			
            $this->_telematicClient->enviarCorreoSinAdjunto($emailInfo, $self);
            /* Utilizando servicio del MT no dependiente del componente telematico */
            foreach ($emailInfo['destinatarios'] as $email) {
                $emails[] = array('email' => $email);
            }
            $xml = new SimpleXMLElement(file_get_contents(DIR_ABS_MT."apps/comun/recursos/xml/servers.xml"));
            $semail = (string)$xml->email['denominacion'];
            if($semail != null) {
                $this->integrator->notification->sendPHPEmail($emails, $emailInfo['asunto'], $emailInfo['mensaje'], $semail);
            }
        }

    }

    /**
     * formatExtraData
     * Establece un formato a los datos extra (los datos dinámicos) de los mensajes.
     *
     * @param string $extraData
     *
     * @return string
     */
    private function formatExtraData($extraData)
    {
        $formatedData = "";
        foreach ($extraData as $attrib => $value) {
            $formatedData .= $attrib . " : " . $value . "\n";
        }
        return $formatedData;
    }

    /**
     * sendNotification
     * Envía la notificación dada a los destinatarios y por las vías
     * configuradas con anterioridad.
     *
     * @param string $idNotification   Identificador del aviso
     * @param string $extraData        Datos extra del aviso
     * @param array  $arrDestinatarios Listado de destinatarios
     *
     * @return void
     */
    private function sendNotification($idNotification, $extraData = null, $arrDestinatarios = array(),$incidencia)//$idNotification = 97
    {
		
        $this->_idNotification = $idNotification;
        $infoXvias = DatAvisoDestinatarioViaContenido :: getContentsByAviso($idNotification);
        
        //aqui es donde
        $dir_modulo_cein = DIR_ABS_MT.'apps/herramientas/cein';   //esto es para verificar si tiene modulo cein
        $resp = is_dir($dir_modulo_cein);                         //esto es para verificar si tiene modulo cein
        if($this->_personaModel->existeGrupoconDestinatarios() && $resp && count($incidencia) > 0){        //tiene modulo cein y tiene un grupo con al menos un usuario
            //busco el id del aviso dado la referencia
            //o pudo hacer un nuevo metodo que develva los usuarios
            print_r('---------------------------------------');
            $idusuario = $incidencia['idusuariosoporte'];
            //var_dump($idusuario);die;
            $denGrupo = $this->integrator->cein->obtenerDenominacionRol($idusuario); //Este es el nivel que tiene asociado el usuario del marco de trabajo
            //var_dump($denGrupo);die;
            $destinatarios = DatDestinatarioModel::obtenerDestinatariosdadoGrupo($denGrupo[0]['denominacion']);
//print_r($destinatarios);die;

//            $grupodestinatario = new DatGrupoDestinatarioModel();
//            $destinatarios = $grupodestinatario->obteneriddestinatariosFromGroup($denRol[0]['denominacion']);

//            $destinatarios = $destinatarios[0];
//            $destinatarios = DatDestinatarioModel :: getConcretDestinatarios($arrD[0]); //deben venir varios id

//            if($denRol){
//                $arr = $this->integrator->cein->obtenerUsuariosByRol($denRol[0]['denominacion']);//administrador
//
//                $idpersona = $this->integrator->seguridad->getArrayIdPersonaByUsersName($arr);//obtener el id de la persona asociada a ese usuario
//
//                $ins = new DatGrupoNotificacionesModel();
//                $ins::
//
//                $grupo =($idpersona);//buscar al grupo de notificaciones al que pertenece esa persona
//                print_r($grupo);
//
////                print_r('**********************************');
//
//            }else print_r('11111111111111111111111111111111111');

        }
        else {
            $destinatarios = DatDestinatarioModel :: getByAviso($idNotification, 0, PHP_INT_MAX);
            /*
             (
                [0] => Array
                    (
                        [idcontacto] => 53
                        [idtipocontacto] => 2
                        [contacto] => Adrian  Nodarse Orfila
                    )

                [1] => Array
                    (
                        [idcontacto] => 60
                        [idtipocontacto] => 2
                        [contacto] => Angel Manuel Lopez Acosta
                    )

            )
            */
        }
//var_dump($destinatarios);die;
        $concretDestinatarios = $this->getConcretDestinatariosByType($destinatarios);

        $values = array_values($concretDestinatarios);

        $this->_idsDestinatarios = array_merge($values[0], $values[1]);
        $con = 0;
        foreach ($infoXvias as $via => $data) {
			$con++;
            if ($extraData) {
                $data['mensaje'] .= $extraData;
            }
            $data['id'] = (string)Zend_Uuid :: generate();
            $methodName = 'send' . ucfirst($via) . ucfirst($this->registerTask); //sendEmailNotification
            
            $data['destinatarios'] = $this->getContactAddressesByVia($concretDestinatarios, $data['viaenvio']);
			
            if ((is_object($arrDestinatarios) && is_array($arrDestinatarios->$via))
                || (is_array($arrDestinatarios) && is_array($arrDestinatarios[$via]))
            ) {
				//var_dump('no entra aqui');die;
                $data['destinatarios'] = array_merge(
                    $data['destinatarios'],
                    (is_object($arrDestinatarios)) ? $arrDestinatarios->$via : $arrDestinatarios[$via]
                );
            }

            $this->_ctosDestinatarios = $data['destinatarios'];
            /*$cantdestinatarios = count($data['destinatarios']);
            for($i=0;$i<$cantdestinatarios;$i++){
					//$tmp = array();
					//$tmp['viaenvio'] = $data['viaenvio'];
					//$tmp['asunto'] = $data['asunto'];
					//$tmp['mensaje'] = $data['mensaje'];
					//$tmp['id'] = $data['id'];
					//$tmp['destinatarios'] = $data['destinatarios'][$i];
					//var_dump($tmp);die;
					$data["destinatarios"] = $data["destinatarios"][$i];
				
			}*/
			
            $this->$methodName($data, $this);
        }
       
            
        
        //var_dump($con);die;
    }
    /**
     * sendDesktopNotification
     * Envía la notificación dada a la bandeja de notificaciones de los destinatarios .
     *
     * @param string $idNotification   Identificador del aviso
     * @param string $extraData        Datos extra del aviso
     * @param array  $arrDestinatarios Listado de destinatarios
     * @param string $fecha            Fecha de ejecucion del evento
     * @param string $hora             Hora de ejecucion del evento
     * @param string $sender           Id del usuario que dispara el evento
     *
     * @return void
     */
    private function sendDesktopNotification(
        $idNotification, $extraData = null, $arrDestinatarios = array(), $fecha = '', $sender = '', $idEvento = ''
    )
    {
        try {
            $destinatarios = DatDestinatarioModel:: getByAviso($idNotification, 0, PHP_INT_MAX);
        }catch(Exception $e){
            ZendExt_Logger::write($e->getMessage());
        }
        foreach ($destinatarios as $destinatario) {
            $notificacion = new DatEventoAvisoDestinatario();
            $notificacion->idevento = $idEvento;
            $notificacion->idaviso = $idNotification;
            $notificacion->iddestinatario = $destinatario['idcontacto'];
            $notificacion->originadopor = $sender;
            $notificacion->fecha = $fecha;
            $notificacion->estado = 1;
            $notificacion->save();
        }

        return true;
    }

    /**
     * saveNotificationTasks
     *
     * Salva las tareas de avisos asociadas al evento despachado.
     *
     * @param HisEventoDespachado $event
     *
     * @return void
     */
    private function saveNotificationTasks(HisEventoDespachado $event)
    {
        foreach ($this->_telematicClient->tasks as $task) {
            $task->ideventodespachado = $event->ideventodespachado;
            $task->save();
        }
    }

    /**
     * __get
     *
     * @param string $name
     *
     * @return mixed
     */
    public function __get($name)
    {
        switch ($name) {
            case 'idaviso':
                return $this->_idNotification;
            case 'contactos':
                return $this->_ctosDestinatarios;
            case 'destinatarios':
                return $this->_idsDestinatarios;
            default:
                return null;
        }
    }
}
