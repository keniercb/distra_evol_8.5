<?php

/**
 * NotificationService
 *
 * @author  Ernesto Herrera Morales
 * @version 1.0
 */
class NotificationService extends ZendExt_Model
{

    private $_avisoMgr;
    private $_telematicClient;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_avisoMgr = new DatAvisoModel();
        $this->_telematicClient = TelematicClientModel:: getInstance();
    }

    /**
     * Servicio que devuelve el arreglo de scripts con las clases js
     * que intervienen en el registro
     * y modificación de un aviso.
     *
     * @return array
     */
    public function obtenerScriptsVentanaEditarAviso()
    {
        $personaModel = new DatPersonaNotificacionesModel();
        $scriptsBuscarPersonaCmp = $personaModel->getUIBuscarPersona();
        $scriptsBuscarPersonaCmp
            = '<root>' . $scriptsBuscarPersonaCmp . '</root>';
        $xmlScripts = simplexml_load_string($scriptsBuscarPersonaCmp);
        $scripts = array();
        foreach ($xmlScripts->script as $xmlScript) {
            $scripts[] = (string)$xmlScript['src'];
        }
        $notificationViewDir = '/herramientas/notificaciones/views';
        $notificationIdiomaDir
            = $notificationViewDir . '/idioma/'
            . ZendExt_GlobalConcept:: getInstance()->Perfil->idioma
            . '/gestnotificationevents';
        $notificationJsDir
            = $notificationViewDir . '/js/gestnotificationevents';
        array_push(
            $scripts, $notificationViewDir . '/comun/js/AppClass.js',
            $notificationViewDir . '/comun/js/Ext.ux.data.PagingMemoryProxy.js',
            $notificationViewDir . "/comun/js/amqpNotification.js",
            $notificationIdiomaDir . '/gestnotificationevents.js',
            $notificationJsDir . '/gestionarGrupos/gestionarGrupos.js',
            $notificationJsDir
            . '/gestionarDestinarios/GestionarDestinatarios.js',
            $notificationJsDir . '/gestionarAvisos/GestionarAvisos.js'
        );

        return $scripts;
    }

    /**
     * Servicio que permite activar/desactivar un aviso.
     *
     * @param int $idaviso
     *
     * @return void
     */
    public function activarDesactivarAviso($idaviso)
    {
        DatAvisoModel:: activarDesactivar($idaviso);
    }

    /**
     * Servicio que devuelve la información de un aviso dado su creador.
     *
     * @param int $idcreador
     *
     * @return array
     */
    public function obtenerInfoAvisoDadoCreador($idcreador)
    {
        $i = 0;
        $avisos = DatAvisoModel:: getByCreator($idcreador);
        foreach ($avisos as $aviso) {
            $contentsInfo = DatAvisoDestinatarioViaContenidoModel::getContentsByAviso($aviso['idaviso']);
            $avisos[$i]['jabber'] = array('active' => 0);
            $avisos[$i]['sistema'] = array('active' => 0);
            $avisos[$i]['sms'] = array('active' => 0);
            $avisos[$i]['email'] = array('active' => 0);
            foreach ($contentsInfo as $contentInfo) {
                if ($contentInfo['texto_jabber']) {
                    $avisos[$i]['jabber'] = array('active' => 1);
                    $avisos[$i]['jabber']['texto_jabber']
                        = $contentInfo['texto_jabber'];
                } else {
                    if ($contentInfo['texto_sistema']) {
                        $avisos[$i]['sistema'] = array('active' => 1);
                        $avisos[$i]['sistema']['texto_sistema']
                            = $contentInfo['texto_sistema'];
                    } else {
                        if ($contentInfo['texto_smstext']) {
                            $avisos[$i]['sms'] = array('active' => 1);
                            $avisos[$i]['sms']['texto_sms']
                                = $contentInfo['texto_smstext'];
                        } else {
                            if ($contentInfo['texto_email']
                                || $contentInfo['asunto_email']
                            ) {
                                $avisos[$i]['email'] = array('active' => 1);
                                $avisos[$i]['email']['texto_email']
                                    = $contentInfo['texto_email'];
                                $avisos[$i]['email']['asunto_email']
                                    = $contentInfo['asunto_email'];
                            }
                        }
                    }
                }
            }
            $i++;
        }

        return $avisos;
    }

    /**
     * Servicio que elimina un aviso.
     *
     * @param $idaviso
     *
     * @return void
     */
    public function eliminarAviso($idaviso)
    {
        $aviso = Doctrine:: getTable('DatAviso')->find($idaviso);
        if ($aviso instanceof DatAviso) {
            $this->_avisoMgr->eliminardat_aviso($aviso);
        }
    }

    /**
     * Servicio que modifica el estado de un aviso.
     *
     * @param $id identificador de la tupla en la tabla
     *            DatEventoAvisoDestinatario
     *
     * @return boolean
     */
    public function cambiarEstadoNotificacion($id, $estado)
    {

        $notificacion = Doctrine::getTable('DatEventoAvisoDestinatario')
            ->findOneBy('id', $id);
        $notificacion->estado = $estado;
        $obj = new DatEventoAvisoDestinatarioModel();
        $obj->modificardat_evento_aviso_destinatario($notificacion);

        return true;
    }

    /**
     * Servicio que elimina un aviso de la bandeja de notificaciones.
     *
     * @param $id identificador de la tupla en la tabla
     *            DatEventoAvisoDestinatario
     *
     * @return boolean
     */
    public function eliminarNotificacion($idarrays)
    {
        Doctrine_Query::create()->delete()->from('DatEventoAvisoDestinatario')
            ->whereIn("id", $idarrays)->execute();

        return true;

    }

    /** Servicio obtiene los avisos de la bandeja de notificaciones.
     *
     * @param $id   identificador del usuario
     * @param $tipo tipo de aviso
     *
     * @return Array
     */
    public function obtenerNotificaciones($idusuario, $tipo = 0)
    {
        $idpersona = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);
        $destinatario = DatPersonaNotificaciones::getIdsDestinatariosByIdsPerson(array($idpersona[0]['idpersona']));
        $result = DatEventoAvisoDestinatario::getAllAvisoByPersonType($destinatario[0], $tipo);
        return $result;
    }

    /** Servicio obtiene los avisos de la bandeja de notificaciones.
     *
     * @param $id   identificador del usuario
     * @param $tipo tipo de aviso
     *
     * @return Array
     */
    public function obtenerCantidadNotificaciones($idusuario)
    {
        $idpersona = $this->integrator->seguridad->getIdPersonaByIdUsuario($idusuario);
        $destinatario = DatPersonaNotificaciones::getIdsDestinatariosByIdsPerson(array($idpersona[0]['idpersona']));
        $result = DatEventoAvisoDestinatario::getCantidadNotificaciones($destinatario[0]);
        return $result;
    }

    public function getIdsDestinatarioByIdPersona($arraysIdpersona)
    {
        $return = DatPersonaNotificaciones::getIdsDestinatariosByIdsPerson(
            $arraysIdpersona
        );

        return $return;
    }

    /**
     * Servicio para modificar los contenidos de los avisos
     * por la vías especificadas.
     *
     * @param type             int   $idaviso
     *
     *
     * @return void
     */
    public function modificarContenidosAviso($idaviso, $attributes, $spec)
    {
        $contents = DatAvisoDestinatarioViaContenidoModel:: getContentsByAviso(
            $idaviso
        );
        foreach ($contents as $content) {
            $contentObj = Doctrine:: getTable('DatContenido')->find(
                $content['idcontenido']
            );
            $tiposContenido = NomTipocontenido:: cargarTipoContenidos();
            foreach ($tiposContenido as $tipoContenido) {
                $medio = $tipoContenido['denominacion'];
                if ($content['texto_' . $medio]
                    || $content['asunto_' . $medio]
                ) {
                    if ($spec->$medio) {
                        $texto = array();
                        $concretContentClass
                            = 'Dat' . ucfirst($medio) . 'Content';
                        foreach ($spec->$medio->attributes as $attrib) {
                            $texto[] = implode(
                                ' : ', array($attrib->title,
                                             $attributes[$attrib->mapping])
                            );
                        }
                        $contentObj->$concretContentClass->texto = implode(
                            "\n", $texto
                        );
                        if ($medio == 'email' && $spec->email->topicAttribute) {
                            $contentObj->$concretContentClass
                                ->asunto
                                = $attributes[$spec->email->topicAttribute];
                        }
                        $contentObj->$concretContentClass->save();
                        break;
                    }
                }
            }
        }
    }

    /**
     * enviarAviso
     * Servicio que envía un aviso de propósito general a los
     * destinatarios y con el contenido especificado.
     * Registra además si este tuvo éxito.
     *
     * @param array $contenido array('jabber'=>array('mensaje'=>'...'),
     *                         'email'=>array('asunto'=>'...',
     *                         'mensaje'=>'...'))
     * @param array $destinatarios
     *
     * @return void
     */
    public function enviarAviso($contenido, $destinatarios)
    {

        $obj = new stdClass();
        $obj->idaviso = DatAviso:: getDefault();
        $obj->destinatarios = $destinatarios;
        $avisoValidator = new AvisoValidator(
            $obj->destinatarios, array_keys($contenido)
        );
        if ($avisoValidator->validarDirCtosDestinatarios(false)) {
            $ctos = $avisoValidator->getContactsAddresses();

            foreach ($contenido as $via => $mensaje) {
                $senderMethod = 'enviar' . ucfirst($via);
                $obj->contactos = $ctos[$via];
                $this->_avisoMgr->$senderMethod($mensaje, $obj);
            }
            foreach ($this->_telematicClient->tasks as $task) {
                $task->save();
            }
            $this->_telematicClient->clearTasks();
            return true;
        } else {
            return false;
            //throw new ZendExt_Exception('HERRNOT010');
        }
    }

    public function enviarAvisobyRest($params)
    {

        $destinarios = $params['destinatarios'];
        $contenido = $params['data']['contenido'];
        $asunto = $params['data']['asunto'];
        $object = new stdClass();
        $object->destinatarios = array();
        $object->data = array();
        $object->data['contenido'] = $contenido;
        $object->data['asunto'] = $asunto;
        foreach ($destinarios as $via => $contact) {
            $object->destinatarios[$via] = $contact;
        }
        $event = ZendExt_Event_Notification::getInstance();
        $event->dispatch('responderNoConformidad', $object);
    }

    /**
     * obtenerConfiguracionAvisos
     *
     */
    public function obtenerConfiguracionAvisos($arrayIdAviso)
    {
        return DatAvisoDestinatarioViaContenido::obtenerConfiguracionAvisos(
            $arrayIdAviso
        );
    }

    /**
     * obtenerDenominacionAvisos
     *
     * @param $page
     */
    public function obtenerDenominacionAvisos($page)
    {
        return DatAviso::obtenerDenominaciones($page);
    }

    /*servicio para modificar el texto de un mensaje de jabber*/
    public function setMensajeJabber($idAviso, $mensaje)
    {
        DatAvisoModel::setMensajeJabber($idAviso, $mensaje);
        return true;
    }

    public function getIdAvisoByDenominacion($denominacion)
    {
        return DatAvisoModel::getIdAvisoByDenominacion($denominacion);
    }

    /**
     * sendEmail
     * Servicio que envía un email
     *
     * @param array $emails Arreglo de direcciones de correos
     *                      a los que se desea enviar un aviso.
     * @param string $subject Asunto del correo
     * @param string $content Contenido del correo
     * @return void
     */
    public function sendEmail($emails, $subject, $content)
    {
        $telematicClient = TelematicClientModel::getInstance();
        $emailInfo['id'] = (string)Zend_Uuid:: generate();
        $emailInfo['mensaje'] = $content;
        $emailInfo['asunto'] = $subject;
        $emailInfo['destinatarios'] = $emails;
        $emailInfo['viaenvio'] = 2;
        $telematicClient->sendDirectEmail('correo', $emailInfo);
        return true;
    }

    /**
     * sendPHPEmail
     * Servicio que envía un email utilizando php
     *
     * @param array $emails Arreglo de direcciones de correos a los que se desea enviar un aviso.
     * @param string $subject Asunto del correo
     * @param string $content Contenido del correo
     * @return void
     */
    public function sendPHPEmail($emails, $subject, $content, $emailserver)
    {//sleep(30) //demora 30 segundos		
        $emailcfg = $this->integrator->seguridad->obtenerDatosServidor($emailserver); 
        //var_dump($emailcfg);die;        
        if(php_sapi_name() == "cli"){
            $dirCerts = DIR_ABS_MT;
        }else {
            $dirCerts = substr(
                $_SERVER['DOCUMENT_ROOT'],
                0,
                strrpos($_SERVER['DOCUMENT_ROOT'], 'web')
            );
        }
        $dirCerts .= 'config' . DIRECTORY_SEPARATOR . 'certs' . DIRECTORY_SEPARATOR
            . 'auth' . DIRECTORY_SEPARATOR;
        $rsa = new ZendExt_Crypt_Rsa(new ZendExt_Crypt_Rsa_Config($dirCerts));
        
        foreach ($emails as $value) {
			$mail = new ZendExt_Mailer();
			$mail->SetLanguage('es');
			$mail->SMTPDebug = 4;                                                                      // Enable verbose debug output
			$mail->isSMTP();                                                                           // Set mailer to use SMTP
			$mail->fqdn = $emailcfg[0]['DatServidoremail']['fqdn'];
			$mail->Host = $emailcfg[0]['ip'];                                                     // Specify main and backup SMTP servers
			$mail->SMTPAuth = true;                                                                    // Enable SMTP authentication
			$mail->Username = $emailcfg[0]['DatServidoremail']['usuario'];                                                    // SMTP username
			$mail->Password = $rsa->decrypt($emailcfg[0]['DatServidoremail']['password']);                                 // SMTP password
			$mail->SMTPSecure = $emailcfg[0]['DatServidoremail']['tsl'] ? 'tls' : false;            // Enable TLS encryption, `ssl` also accepted
			$mail->SMTPOptions = array(
				"ssl" => array("verify_peer" => false,
					"verify_peer_name" => false,
					"allow_self_signed" => true
				)
			);
			$mail->Port = $emailcfg[0]['DatServidoremail']['puerto'];                                                        // TCP port to connect, tls=587, ssl=465
			$mail->From = $emailcfg[0]['DatServidoremail']['usuario'].'@'.$emailcfg[0]['DatServidoremail']['fqdn'];
			$mail->FromName = 'Administrador Zeolides';
			
		//$destinatarios = $this->getDestinatarios($emails);

       
			//var_dump($value["email"]);die;
            $mail->addAddress($value["email"]);
            
			$mail->WordWrap = 50;                                                                      // Set word wrap to 50 characters
			$mail->isHTML(false);                                                                      // Set email format to HTML
			$mail->Subject = $subject;
			$mail->Body = $content;
			$mail->AltBody = $content;
			
			if (!$mail->send()) {
				$queue = new NotificationQueue(NotificationQueue::TYPE_EMAIL);
				if(count($mail->bad_rcpt) > 0) {
					foreach ($mail->bad_rcpt as $rcpt) {
						$queue->getQueue()->enqueue(array($rcpt['to'], $subject, $content));
					}
					$queue->processQueue();
				}
				/*else if(strstr($mail->ErrorInfo, 'SMTP Connect() fall&oacute;') ) {
					foreach ($mail->to[0] as $rcpt) {
						$queue->getQueue()->enqueue(array($rcpt, $subject, $content));
					}
					$queue->processQueue();
				}*/ else {
					throw new ZendExt_Exception('MAILER001', null, array($mail->ErrorInfo));
				}
			}
        }
        
    }

    /**
     * sendEmail
     * Servicio que envía un mensaje a una lista de usuarios
     *
     * @param array $idPersonas Arreglo de identificadores de usuarios.
     * @param string $content Contenido del Aviso
     * @return void
     */
    public function sendSistemMessage($idPersonas, $content, $tipoAviso)
    {

        $destinatarios = array();
        foreach ($idPersonas as $person) {
            $datPersonaNotificaciones = new DatPersonaNotificaciones();
            $resp = $datPersonaNotificaciones->getIdsDestinatariosByIdsPerson($person);
            if (count($resp)) {
                $destinatarios[] = $resp[0];
            } else {
                $destinatario = new DatDestinatario();
                $destinatario->idtipodest = 2;
                $destinatario->save();
                $datPersonaNotificaciones->idpersona = $person;
                $datPersonaNotificaciones->iddestinatario = $destinatario->iddestinatario;
                $datPersonaNotificaciones->save();
                $destinatarios[] = $destinatario->iddestinatario;
            }
        }
        $evento = new DatEvento();
        $existe = $evento->getIdByName('Notificaciones_del_Sistema');
        if ($existe) {
            $idEvento = $existe;
        } else {
            $evento->nombre = 'Notificaciones_del_Sistema';
            $evento->interno = 1;
            $evento->activo = 1;
            $evento->descripcion = 'Notificaciones_del_Sistema';
            $evento->save();
            $idEvento = $evento->idevento;
        }
        $idUsuario = ZendExt_GlobalConcept :: getInstance()->Perfil->idusuario;
        $aviso = new DatAviso();

        $aviso->denominacion = 'Notificaciones_del_Sistema';
        $aviso->idtipoaviso = $tipoAviso;
        $aviso->descripcion = $content;
        $aviso->activo = 1;
        $aviso->creadopor = $idUsuario;

        $aviso->save();
        $idAviso = $aviso->idaviso;
        $eventoAviso = new DatEventoAviso();
        $eventoAviso->idevento = $idEvento;
        $eventoAviso->idaviso = $idAviso;
        $eventoAviso->save();

            foreach ($destinatarios as $destinatario) {
                $eventoAvisoDestinatario = new DatEventoAvisoDestinatario();
                $eventoAvisoDestinatario->idevento = $idEvento;
                $eventoAvisoDestinatario->idaviso = $idAviso;
                $eventoAvisoDestinatario->iddestinatario = $destinatario;
                $eventoAvisoDestinatario->originadopor = $idUsuario;
                $eventoAvisoDestinatario->estado = 1;
                $eventoAvisoDestinatario->save();
            }

        return true;
    }
    /**
     * sendSistemNotifiTime
     * Servicio que envía una notificacion en una fecha determinada a una lista de usuarios
     *
     * @param array $idPersonas Arreglo de identificadores de usuarios.
     * @param string $content Contenido del Aviso
     * @param string $tipoAviso (Informacio,Abvertencia,Error,Alerta) 1,2,3,4
     * @param string $cmd Servicio de validacion de los argumentos (componente-servicio)
     * @param string $fecha Fecha de ejecucion de la tarea (datatime)
     * @param array $arguments Argumentos a validar en el cmd
     * @return boolean
     */
    public function sendSistemNotifiTime($idPersonas, $content, $tipoAviso, $cmd, $fecha, $arguments)
    {
        $this->_sshCronMang = new SshCronManager();
        $destinatarios = array();
        foreach ($idPersonas as $person) {
            $datPersonaNotificaciones = new DatPersonaNotificaciones();
            $resp = $datPersonaNotificaciones->getIdsDestinatariosByIdsPerson($person);
            if (count($resp)) {
                $destinatarios[] = $resp[0];
            } else {
                $destinatario = new DatDestinatario();
                $destinatario->idtipodest = 2;
                $destinatario->save();
                $datPersonaNotificaciones->idpersona = $person;
                $datPersonaNotificaciones->iddestinatario = $destinatario->iddestinatario;
                $datPersonaNotificaciones->save();
                $destinatarios[] = $destinatario->iddestinatario;
            }
        }
        $evento = new DatEvento();
        $nameAviso = uniqid('Notificaciones_Crontab_');
        $existe = $evento->getIdByName($nameAviso);

        if ($existe) {
           return false;
        } else {
            $evento->nombre = $nameAviso;
            $evento->interno = 1;
            $evento->activo = 1;
            $evento->descripcion = 'Este evento sera disparado en la fecha';
            $evento->save();
            $idEvento = $evento->idevento;
        }
        $idUsuario = ZendExt_GlobalConcept :: getInstance()->Perfil->idusuario;
        $aviso = new DatAviso();

        $aviso->denominacion = $nameAviso;
        $aviso->idtipoaviso = $tipoAviso;
        $aviso->descripcion = $content;
        $aviso->activo = 1;
        $aviso->creadopor = $idUsuario;
        if($cmd){
            $comando = explode('-',$cmd);
            $aviso->cmpvalidador = $comando[0];
            $aviso->svcvalidador = $comando[1];
        }
        $aviso->save();
        $idAviso = $aviso->idaviso;
        $eventoAviso = new DatEventoAviso();
        $eventoAviso->idevento = $idEvento;
        $eventoAviso->idaviso = $idAviso;
        $eventoAviso->save();

        foreach ($idPersonas as $destinatario) {
            $dests[] = DatDestinatarioModel:: insertarDestinatario(
                2, $destinatario
            );
        }

        //contenidos
        $contenidos = array();
        $concretContentRecord = new DatJabberContent();
        $objContent = new DatJabberContentModel();

        $concretContentRecord->texto = "hello jabber";
        $contenido['id'] = $objContent->insertardat_jabber_content($concretContentRecord);
        $contenido['via'] = 0;
        $contenidos[] = $contenido;

        //agregar el aviso, los destinatarios, y el contenido
        $avisoDestViaContModel = new DatAvisoDestinatarioViaContenidoModel(
        );

        foreach ($dests as $dest) {
            foreach ($contenidos as $content) {
                $avisoDestViaCont = new DatAvisoDestinatarioViaContenido();
                $avisoDestViaCont->idaviso = $idAviso;
                $avisoDestViaCont->iddestinatario = $dest;
                $avisoDestViaCont->idcontenido = $content['id'];
                $avisoDestViaContModel->
                insertardat_aviso_destinatario_via_contenido(
                    $avisoDestViaCont
                );
            }
        }

        $id = uniqid('id_');
        $fecha = $fecha->format('i').' '.$fecha->format('H').' '.$fecha->format('d').' '.$fecha->format('m');
        $arrayArgs = ($arguments) ? implode("/@", $arguments) : '';       
        $dir_abs_mt = substr(DIR_ABS_MT, 0, strlen(DIR_ABS_MT) - 1);
       $this->_sshCronMang->append_cronjob("$fecha * ID=$id sh $dir_abs_mt/lib/Amqp/Worker/consumer_notifica.sh $nameAviso $arrayArgs >/dev/null 2>&1");
       $this->_sshCronMang->clear_crontab_file();

    }

    /**
     * - Servicio para el envio de notificaciones por
     * jabber.
     * @param $to ARRAY Listado de destinatarios
     * @param $msg STRING Mensaje a ser enviado
     * @param $jabberserver STRING Denominacion del servidor xmpp a utilizar.
     */
    public function sendJabberNotification($to, $msg, $jabberserver){
        $jabbercfg = $this->integrator->seguridad->obtenerDatosServidor($jabberserver);
        if(php_sapi_name() == "cli"){
            $dirCerts = DIR_ABS_MT;
        }else {
            $dirCerts = substr(
                $_SERVER['DOCUMENT_ROOT'],
                0,
                strrpos($_SERVER['DOCUMENT_ROOT'], 'web')
            );
        }
        $dirCerts .= 'config' . DIRECTORY_SEPARATOR . 'certs' . DIRECTORY_SEPARATOR
            . 'auth' . DIRECTORY_SEPARATOR;
        $rsa = new ZendExt_Crypt_Rsa(new ZendExt_Crypt_Rsa_Config($dirCerts));

        $conn = new ZendExt_JAXL(array(
            'host' => $jabbercfg[0]['DatServidorxmpp']['ip'],
            'port' => $jabbercfg[0]['DatServidorxmpp']['puerto'],
            'jid' => $jabbercfg[0]['DatServidorxmpp']['usuario'] . "@jabber." .$jabbercfg[0]['DatServidorxmpp']['fqdn'],
            'force_tls' => $jabbercfg[0]['tsl'] == true ? true : false,
            'pass' => $rsa->decrypt($jabbercfg[0]['DatServidorxmpp']['password']),
            'log_level' => JAXL_DEBUG,
            'auth_mode' => 'PLAIN',
            'protocol' => 'tcp',
            'bosh_url' => null,
            'log_path' => DIR_ABS_MT . 'log' . DIRECTORY_SEPARATOR . 'JAXL_LOG' . DIRECTORY_SEPARATOR . 'jaxl.log',
            'resource' => null,
            'stream_context' => stream_context_create(array('ssl' => array(
                "verify_peer" => false,
                "verify_peer_name" => false,
                "allow_self_signed" => true
                )
            ))
        ));
        $arrayErrors = ['on_connect_error', 'on_error_message'];
        $conn->add_cb('on_auth_success', function () use ($conn, $to, $msg) {
            _info('connected');
            $conn->send_chat_msg($to, $msg);
        });
        foreach ($arrayErrors as $error) {
            $conn->add_cb($error, function () use ($conn, $to, $msg) {
                $queue = new NotificationQueue(NotificationQueue::TYPE_XMPP);
                foreach ($to as $dest) {
                    $queue->getQueue()->enqueue(array($dest, $msg));
                }
                $queue->processQueue();
            });
        }

        try {
            $conn->start(array(
                '--with-unix-sock' => false
            ));
        } catch (Exception $e) {
            ZendExt_Logger::write(
                $e->getCode() . '=> ' . $e->getMessage(),
                DIR_ABS_MT . 'log' . DIRECTORY_SEPARATOR . 'JAXL_LOG' . DIRECTORY_SEPARATOR . 'jaxl.log'
            );
        }
    }
    
    //-----------------------metodos para notificar por correos en CEIN---------------------------
    private function getDestinatarios($destinatarios) {
	if(is_array($destinatarios[0]))
	    return $this->getDestinatarios($destinatarios[0]);
	else
	    return $destinatarios;
    }

    public function obtenerDestinatariosdadoGrupo($denominacion){
        return DatDestinatarioModel::obtenerDestinatariosdadoGrupo($denominacion);
    }

    //obtener dado un arreglo de destinatarios los correos electronicos
    public function getConcretDestinatariosByType($destinatarios){
        return DatDestinatarioModel::getConcretDestinatariosByType($destinatarios);
    }
}
