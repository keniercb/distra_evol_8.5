<?php

/*
 *  $Id: EventListener.php 5798 2009-06-02 15:10:46Z piccoloprincipe $
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * This software consists of voluntary contributions made by many individuals
 * and is licensed under the LGPL. For more information, see
 * <http://www.phpdoctrine.org>.
 */

/**
 * Doctrine_EventListener     all event listeners extend this base class
 *                            the empty methods allow child classes to only implement the methods they need to implement
 *
 * @author      Konsta Vesterinen <kvesteri@cc.hut.fi>
 * @package     Doctrine
 * @subpackage  EventListener
 * @license     http://www.opensource.org/licenses/lgpl-license.php LGPL
 * @link        www.phpdoctrine.org
 * @since       1.0
 * @version     $Revision: 5798 $
 */
class Doctrine_EventListener implements Doctrine_EventListener_Interface
{

    public function preClose(Doctrine_Event $event)
    {

    }

    public function postClose(Doctrine_Event $event)
    {

    }

    public function onCollectionDelete(Doctrine_Collection $collection)
    {

    }

    public function onPreCollectionDelete(Doctrine_Collection $collection)
    {

    }

    public function onOpen(Doctrine_Connection $connection)
    {

    }

    public function preTransactionCommit(Doctrine_Event $event)
    {

    }

    public function postTransactionCommit(Doctrine_Event $event)
    {

    }

    public function preTransactionRollback(Doctrine_Event $event)
    {

    }

    public function postTransactionRollback(Doctrine_Event $event)
    {

    }

    public function preTransactionBegin(Doctrine_Event $event)
    {

    }

    public function postTransactionBegin(Doctrine_Event $event)
    {

    }

    public function preSavepointCommit(Doctrine_Event $event)
    {

    }

    public function postSavepointCommit(Doctrine_Event $event)
    {

    }

    public function preSavepointRollback(Doctrine_Event $event)
    {

    }

    public function postSavepointRollback(Doctrine_Event $event)
    {

    }

    public function preSavepointCreate(Doctrine_Event $event)
    {

    }

    public function postSavepointCreate(Doctrine_Event $event)
    {

    }

    public function postConnect(Doctrine_Event $event)
    {
        $conn = $event->getInvoker();
        $register = Zend_Registry::getInstance();
        $array = array('skipExtends' => true, 'allowModifications' => true);
        $config = new Zend_Config_Ini($register->config->security_config, null, $array);

        if ($config->BDIntegrity->changeDbDetect === "") {
            $config->BDIntegrity->changeDbDetect = self::estaActivaDeteccionCambios($conn);
            $arrayFile = array(
                'config' => $config,
                'filename' => $register->config->security_config
            );
            $writer = new Zend_Config_Writer_Ini($arrayFile);
            try {
                $writer->write();
            } catch (Exception $exception) {
                throw new ZendExt_Exception('SEGINTEGRIDAD06', $exception);
            }
        }
        if ($config->BDIntegrity->changeDbDetect === "1") {
            $result = $conn->fetchAll('SELECT mod_seguridad.f_hubo_violacion() as st')[0]['st'];

            if ($result) {
//                try {
//                    $cuerpoCorreo = "";
//                    $violacionesXBD = array();
//                    $buscar = array('fechahora', 'aplicacion', 'usuario', 'ip', 'puerto', 'numeropid', 'esquema', 'tabla', 'operacion', 'valoranterior',
//                        'valornuevo', 'sentencia');
//                    $reemplazar = array('Fecha-Hora', 'Aplicación', 'Usuario', 'IP', 'Puerto', 'Numero de pid (postgres)', 'Esquema', 'Tabla', 'Operación',
//                        'Valor anterior', 'Valor nuevo', 'Sentencia');
//                    $result = explode("\n", $result);
//                    unset($result[0]);
//                    unset($result[count($result)]);
//
//                    foreach ($result as $violacion) {
//                        $violacion = json_decode($violacion);
//                        $violacionesXBD[$violacion->basedatos][] = $violacion;
//                        unset($violacion->basedatos);
//                    }
//
//                    foreach ($violacionesXBD as $key => $bd) {
//                        foreach ($bd as $dato) {
//                            $cuerpoCorreo .=
//                                '<h3 style="font-family: Lucida Sans, sans-serif; margin: 0em;">Base de datos: ' . $key . '</h3>
//                <div style="float:left; margin-left: 1em; margin-bottom: 1em; width:98%;">';
//                            foreach ($dato as $key1 => $d) {
//                                if (is_object($d))
//                                    $d = json_encode($d);
//                                $cuerpoCorreo .=
//                                    ' <p style="font-size: 12px; font-family: Lucida Sans, sans-serif;"><b>' . $key1 . ':</b>
//                    ' . $d . '</p>';
//                            }
//                            $cuerpoCorreo .= ' </div>';
//                        }
//                        $cuerpoCorreo = str_replace($buscar, $reemplazar, $cuerpoCorreo);
//                    }
//                    self::sendPHPEmail(array('lianet@xetid.cu', 'amanuel@xetid.cu'), 'Violaciones en BD de Zeolides', $cuerpoCorreo, 'xetidProd', $conn);
//
//                } catch (Exception $e) {
//                    throw new ZendExt_Exception('E069', new Exception("La integridad de la base de datos ha sido comprometida."), null);
//                }
                throw new ZendExt_Exception('E069', new Exception("La integridad de la base de datos ha sido comprometida."), null);
            } else {
                self::estaActivaDeteccionCambios($conn);//Para que si esta activa la deteccion segun el fichero de configuracion y no hubo violacion de datos, validar si se elimino o deshabilito algun trigger de deteccion de cambios
            }
        }
    }

    public function preConnect(Doctrine_Event $event)
    {

    }

    public function preQuery(Doctrine_Event $event)
    {
        $register = Zend_Registry::getInstance();
        $configBDIntegrity = new Zend_Config_Ini($register->config->security_config, "BDIntegrity");
        if ($configBDIntegrity->changeDbDetect === "1") {
            $conn = $event->getInvoker();
            $query = $event->getQuery();
            $queryClean = strtolower(ltrim($query));
            $queryType = substr($queryClean, 0, 6);

            if ($queryType == 'update' || $queryType == 'delete' || $queryType == 'insert') {
                if (!strpos($query, 'dat_pid')) {
                    try {
                        self::insertPID($conn, $conn->getPid());
                    } catch (Exception $e) {
                        throw new Exception("Couldn't insert connection PID in mod_seguridad.dat_pid", $e->getCode());
                    };
                }
            }
        }
    }

    public function postQuery(Doctrine_Event $event)
    {

    }

    public function prePrepare(Doctrine_Event $event)
    {

    }

    public function postPrepare(Doctrine_Event $event)
    {

    }

    public function preExec(Doctrine_Event $event)
    {

    }

    public function postExec(Doctrine_Event $event)
    {

    }

    public function preError(Doctrine_Event $event)
    {

    }

    public function postError(Doctrine_Event $event)
    {

    }

    public function preFetch(Doctrine_Event $event)
    {

    }

    public function postFetch(Doctrine_Event $event)
    {

    }

    public function preFetchAll(Doctrine_Event $event)
    {

    }

    public function postFetchAll(Doctrine_Event $event)
    {

    }

    public function preStmtExecute(Doctrine_Event $event)
    {
        $register = Zend_Registry::getInstance();
        $configBDIntegrity = new Zend_Config_Ini($register->config->security_config, "BDIntegrity");

        if ($configBDIntegrity->changeDbDetect === "1") {
            $conn = $event->getInvoker()->getConnection();
            $query = $event->getQuery();
            $queryClean = strtolower(ltrim($query));
            $queryType = substr($queryClean, 0, 6);
            if ($queryType == 'update' || $queryType == 'delete' || $queryType == 'insert') {
                try {
                    self::insertPID($conn, $conn->getPid());
                } catch (Exception $e) {
                    throw new Exception("Couldn't insert connection PID in mod_seguridad.dat_pid", $e->getCode());
                };
            }
        }
    }

    public function postStmtExecute(Doctrine_Event $event)
    {
        $register = Zend_Registry::getInstance();
        if (isset($register->TraceManager)) {
            $events_manager = ZendExt_Event:: getInstance();
            $events_manager->dispatch('dataHandler', array('Query' => $event->getQuery(), 'Params' => $event->getParams(), 'nameId' => $register->TraceManager['nameId'], 'id' => $register->TraceManager['id']));
        }
    }

    private static function insertPID($conn, $pid)
    {
        $query = "
            INSERT INTO mod_seguridad.dat_pid
            (numeropid)
            VALUES
            ('{$pid}');
        ";
        $conn->fetchOne($query);
    }

    private static function estaActivaDeteccionCambios($conn)
    {
        $cantTablasTrigger = self::obtenerCantTablasTriggersDeteccionCambiosBD($conn);
        $cantTotalTablas = self::obtenerCantidadTablasDeteccionCambiosBD($conn);
        if ($cantTablasTrigger !== 0) {
            if ($cantTablasTrigger != $cantTotalTablas) {
                throw new ZendExt_Exception('E069', new Exception("La integridad de la base de datos ha sido comprometida."), null);
            } else {
                return "1";
            }
        } else
            return "0";
    }

    private static function obtenerCantTablasTriggersDeteccionCambiosBD($conn)
    {
        $sql = "SELECT COUNT(relname)
                FROM pg_catalog.pg_class
                WHERE relnamespace NOT IN (SELECT oid FROM pg_namespace WHERE nspname IN ('pg_catalog', 'information_schema'))
		        AND relkind = 'r'
                AND relname NOT IN ('dat_pid', 'his_violacionesbd', 'dat_accion', 'dat_funcionalidad')
                AND (oid IN (SELECT tgrelid
                                        FROM pg_catalog.pg_trigger
                                        WHERE tgname = 'tg_eliminar_pid'
                                        AND tgenabled = 'O')
                AND oid IN (SELECT tgrelid
                                      FROM pg_catalog.pg_trigger
                                      WHERE tgname  = 'tg_adicionar_violacion' 
                                      AND tgenabled = 'O')
                )";

        try {
            $result = $conn->fetchOne($sql);
        } catch (Exception $e) {
            throw new Exception("Couldn't obtain the tables that do not have change detection mechanism", $e->getCode());
        };

        return $result;
    }

    private static function obtenerCantidadTablasDeteccionCambiosBD($conn)
    {
        $sql = "SELECT count(1)
                FROM information_schema.tables 
                WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
                AND table_name NOT IN ('dat_pid', 'his_violacionesbd', 'dat_accion', 'dat_funcionalidad')
                AND table_type =  'BASE TABLE'";

        try {
            $result = $conn->fetchOne($sql);
        } catch (Exception $e) {
            throw new Exception("Couldn't obtain the number of tables enabled for the change detection mechanism", $e->getCode());
        };

        return $result;
    }

    private static function sendPHPEmail($emails, $subject, $content, $emailserver, $conn = null)
    {
        $emailcfg = self::cargarDatosServidorCorreo($emailserver, $conn);

        if (php_sapi_name() == "cli") {
            $dirCerts = DIR_ABS_MT;
        } else {
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
//            $mail->SMTPDebug = 4;                                                                      // Enable verbose debug output
            $mail->isSMTP();                                                                           // Set mailer to use SMTP
            $mail->fqdn = $emailcfg['fqdn'];
            $mail->Host = $emailcfg['ip'];                                                     // Specify main and backup SMTP servers
            $mail->SMTPAuth = true;                                                                    // Enable SMTP authentication
            $mail->Username = $emailcfg['usuario'];                                                    // SMTP username
            $mail->Password = $rsa->decrypt($emailcfg['password']);                                 // SMTP password
            $mail->SMTPSecure = $emailcfg['tsl'] ? 'tls' : false;            // Enable TLS encryption, `ssl` also accepted
            $mail->SMTPOptions = array(
                "ssl" => array("verify_peer" => false,
                    "verify_peer_name" => false,
                    "allow_self_signed" => true
                )
            );
            $mail->Port = $emailcfg['puerto'];                                                        // TCP port to connect, tls=587, ssl=465
            $mail->From = $emailcfg['usuario'] . '@' . $emailcfg['fqdn'];
            $mail->FromName = 'Administrador Zeolides';

            //$destinatarios = $this->getDestinatarios($emails);

            $mail->addAddress($value);

            $mail->WordWrap = 50;                                                                      // Set word wrap to 50 characters
            $mail->isHTML(false);                                                                      // Set email format to HTML
            $mail->Subject = $subject;
            $mail->Body = $content;
            $mail->AltBody = $content;
            if (!$mail->send()) {
                $queue = new NotificationQueue(NotificationQueue::TYPE_EMAIL);
                if (count($mail->bad_rcpt) > 0) {
                    foreach ($mail->bad_rcpt as $rcpt) {
                        $queue->getQueue()->enqueue(array($rcpt['to'], $subject, $content));
                    }
                    $queue->processQueue();
                } /*else if(strstr($mail->ErrorInfo, 'SMTP Connect() fall&oacute;') ) {
					foreach ($mail->to[0] as $rcpt) {
						$queue->getQueue()->enqueue(array($rcpt, $subject, $content));
					}
					$queue->processQueue();
				}*/ else {
                    throw new ZendExt_Exception('MAILER001', null, array($mail->ErrorInfo));
                }
            }
        }
        return;
    }

    private static function cargarDatosServidorCorreo($denominacion, $conn)
    {
        $sql = "SELECT s.idservidor, s.tiposervidor, s.denominacion, s.descripcion,  s.ip, e.fqdn, e.password, 
                e.usuario, e.puerto, e.ssl, e.tsl
                FROM mod_seguridad.dat_servidor s 
                LEFT JOIN mod_seguridad.dat_serautenticacion a ON s.idservidor = a.idservidor
                LEFT JOIN mod_seguridad.dat_servidoremail e ON s.idservidor = e.idservidor
                LEFT JOIN mod_seguridad.dat_servidorxmpp x ON s.idservidor = x.idservidor
                WHERE s.denominacion = '{$denominacion}'";
        return $conn->fetchAssoc($sql)[0];
    }
}
