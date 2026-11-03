<?php

//require '../PHPMailer/PHPMailerAutoload.php';
include_once('/../../Adapters/PHPMailer/5.2.15/PHPMailerAutoload.php');

//-------------------------------------------------------------------------------------------

while (true) {
    sleep(60);
    $fichero = file('/var/lib/postgresql/9.5/main/zeolides_db_violations',
        FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES); //TODO obtener version de postgres para obtener la ruta correcta
    if ($fichero) {
        $cuerpoCorreo = "";
        $violacionesXBD = array();
        $buscar = array('fechahora', 'aplicacion', 'usuario', 'ip', 'puerto', 'numeropid', 'esquema', 'tabla', 'operacion', 'valoranterior',
            'valornuevo', 'sentencia');
        $reemplazar = array('Fecha-Hora', 'Aplicación', 'Usuario', 'IP', 'Puerto', 'Numero de pid (postgres)', 'Esquema', 'Tabla', 'Operación',
            'Valor anterior', 'Valor nuevo', 'Sentencia');
        shell_exec("echo '' > '/var/lib/postgresql/9.5/main/zeolides_db_violations'");

        foreach ($fichero as $violacion) {
            $violacion = json_decode($violacion);
            $violacionesXBD[$violacion->basedatos][] = $violacion;
            unset($violacion->basedatos);
        }
        foreach ($violacionesXBD as $key => $bd) {
            foreach ($bd as $dato) {
                $cuerpoCorreo .=
                    '<h3 style="font-family: Lucida Sans, sans-serif; margin: 0em;">Base de datos: ' . $key . '</h3>
                    <div style="float:left; margin-left: 1em; margin-bottom: 1em; width:98%;">';
                foreach ($dato as $key1 => $d) {
                    if (is_object($d))
                        $d = json_encode($d);
                    $cuerpoCorreo .=
                        ' <p style="font-size: 12px; font-family: Lucida Sans, sans-serif;"><b>' . $key1 . ':</b>
                        ' . $d . '</p>';
                }
                $cuerpoCorreo .= ' </div>';
            }
            $cuerpoCorreo = str_replace($buscar, $reemplazar, $cuerpoCorreo);

            $mail = new PHPMailer;
            $mail->isSMTP();
            $mail->SMTPDebug = 2; //TODO poner 0 para ambiente de produccion
            $mail->Debugoutput = 'html';
            $mail->Host = "correo.prod.xetid.cu";
            $mail->Port = 587; //25 sin tls, 587 con tls
            $mail->SMTPAuth = true;
            $mail->Username = "usuario";
            $mail->Password = "contrasenna";
            $mail->SMTPSecure = 'tls';
            $mail->SMTPOptions = array(
                "ssl" => array("verify_peer" => false,
                    "verify_peer_name" => false,
                    "allow_self_signed" => true
                ));
            $mail->Subject = 'Violaciones en BD de Zeolides';
            $mail->CharSet = 'UTF-8';
            switch ($key) {
                case 'zeolides231cein101SERVER':
                    $mail->setFrom('lianet@prod.xetid.cu', 'Marco de Trabajo Zeolides');
                   // $mail->addReplyTo('lianet@prod.xetid.cu', 'Lianet Suárez Martinez');
                    $mail->addAddress('lianet@xetid.cu', 'Lianet Suárez Martinez');
                    $mail->isHTML(true);
                    $mail->Body = $cuerpoCorreo;
                    $mail->AltBody = 'Han ocurrido violaciones en la base de datos de Zeolides';
                    break;
            }

            if (!$mail->send()) {
                shell_exec("echo -e '" . date("Y-m-d H:i:s") . "    Mailer Error: " . $mail->ErrorInfo .
                    "' >> '/var/lib/postgresql/9.5/main/zeolides_db_violations.log'");
            }
            else{
                echo "Mensaje enviado!";
            }
        }

    }
}

