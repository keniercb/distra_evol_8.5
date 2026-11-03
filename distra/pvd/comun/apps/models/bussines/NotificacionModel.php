<?php
/**
 * @name NotificacionModel - Clase modelo del componente "Notificación".
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 * @date 02/11/2017 Ing. Orestes Rodríguez Lorenzo
 * @version 1.0.0
 */
class NotificacionModel extends ZendExt_Model
{
    public function NotificacionModel() {
        parent::ZendExt_Model();
    }

    /**
     * @param $identidad (Tipo: Numeric) Identificador de la entidad a la que pertenece la configuración.
     * @param $iddominio (Tipo: Numeric) Identificador del dominio de solución que empleará la notificación.
     * @param $datos array(array($idpersona, $todos, $MsgHtml, $asunto))
     *  $idpersona (Tipo: Numeric) Identificador de la persona.
     *  $todos (Tipo: Boolean)Determina si se envia a todos los correos de la persona. Por defecto false.
     *  $MsgHtml (Tipo: String) Cuerpo del mensaje en html.
     *  $asunto (Tipo: String) Asunto del correo.
     * @return array Arrego con el resultado con los identificadores de las personas a las que se envió el correo y las
     *  que no. (Primera posición: Enviados; Segunda posición: No enviados)
     */
    public function enviarCorreo($identidad, $iddominio, $datos)
    {
        $config = ZendExt_IoC_Inter::getInstance()->maestro->obtenerConfigNotificacion($identidad, $iddominio, $datos);
        $mail = new PHPMailer();
        $mail->IsSMTP();
        $mail->SMTPSecure = "tls";
        $mail->SMTPAuth = ($config[0]['smtpaut'] == 1) ? true : false;
        $mail->Host = $config[0]['servidor'];
        $mail->Port = $config[0]['puerto'];
        $mail->SMTPSecure = "ssl";
        $mail->Username = $config[0]['remitente'];
        $mail->Password = base64_decode($config[0]['contrasena']);
        $mail->Mailer = "smtp";
        $mail->Timeout = 50;
        $mail->From = $config[0]['remitente'];
        $mail->FromName = $config[0]['nombremitente'];
        $enviado = array();
        $noenviado = array();
        foreach ($datos as $value) {
            $dir = ZendExt_IoC_Inter::getInstance()->persona->obtenerCorreoByPers($value['idpersona'], $value['todos']);
            if (count($dir) > 0) {
                foreach ($dir as $correo) {
                    $mail->AddAddress($correo['contacto']);
                }
                $mail->Subject = utf8_decode($value['asunto']);
                $mail->MsgHTML($value['msghtml']);
                if (!$mail->Send())
                    array_push($noenviado, $value['idpersona']);
                else
                    array_push($enviado, $value['idpersona']);
                $mail->ClearAddresses();
            } else {
                array_push($noenviado, $value['idpersona']);
            }
        }
        return array('enviado' => $enviado, 'noenviado' => $noenviado);
    }
}