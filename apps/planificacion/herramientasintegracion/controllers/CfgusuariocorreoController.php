<?php

/**
 * Created by PhpStorm.
 * User: tumbarell
 */
class CfgusuariocorreoController extends ZendExt_Controller_Secure
{

    public function init()
    {
        parent::init();
//        $this->_meta = ZendExt_Metadata::getInstance();
    }

    public function cfgusuariocorreoAction()
    {
//        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
//        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    public function existeArchivoAction()
    {   
        $test = $this->_request->getPost('test');
        if ($test == 1) {
            $parametros->user = $this->_request->getPost('user');
            $parametros->asunto = $this->_request->getPost('asunto');
            $parametros->contenido = $this->_request->getPost('contenido');

            //print_r('asdadasd'); die;
            $emails = array();
            $emails[] = $parametros->user;
            $dir_www = $_SERVER ['DOCUMENT_ROOT'];
            $dir_rel_mt = '/';
            $dir_abs_mt = str_replace('//', '/', dirname($dir_www . '..') . '/' . $dir_rel_mt);


            $configFile = $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'planificacion' . DIRECTORY_SEPARATOR .
                    'comun' . DIRECTORY_SEPARATOR . 'recursos' . DIRECTORY_SEPARATOR . 'xml' . DIRECTORY_SEPARATOR . 'config_mailer.xml';
            if (file_exists($configFile)) {
                $xmlCargado = simplexml_load_file($configFile);
            }

            $RSA = new ZendExt_RSA();
            $keys = $RSA->generate_keys('9990454949', '9990450271', 0);
            $passDesencriptado = $RSA->decrypt((string) $xmlCargado->config['pwd'], $keys[2], $keys[0]);

            $dir2 = split("web", $_SERVER['DOCUMENT_ROOT']);
            require_once '' . $dir2[0] . '/apps/planificacion/comun/recursos/lib/PHPMailer/class.phpmailer.php';


            $mail = new PHPMailer();

            $mail->IsSMTP();

            $mail->SMTPDebug = 1;
            //OJO
            $mail->SMTPAuth = false;
            $mail->SMTPSecure = "none";

            $mail->Host = (string) $xmlCargado->config['host'];
            $mail->Port = (string) $xmlCargado->config['port'];
            $mail->Username = (string) $xmlCargado->config['nombre'];
            $mail->Password = $passDesencriptado;
//        $mail->Mailer = (string)$xmlCargado->config['mailer'];
            $mail->Timeout = 50;
            //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            //====== DE QUIEN ES ========
            $mail->From = (string) $xmlCargado->config['user'];
            $mail->FromName = (string) $xmlCargado->config['user'];
            $mail->Subject = $parametros->asunto;

            //====== PARA QUIEN =========
            //print_r($parametros->emails); die;
            foreach ($emails as $dir) {
                $mail->AddBCC($dir, $dir);
                //$mail->AddReplyTo($dir, $dir);
            }

            //Cuerpo del mensaje

            $body .= $parametros->contenido;
            $body .= " <br><i>No responder este correo. Enviado desde el Sistema de Planificaci&oacute;n.</i></p>";
            $mail->Body = $body;

            $mail->MsgHTML($mail->Body);
            $mail->IsHTML(true);
            //print_r($mail);die;
            require_once '' . $dir2[0] . 'apps/planificacion/comun/recursos/lib/PHPMailer/class.smtp.php';
            $mail2 = new SMTP();

            $a = $mail2->connect((string) $xmlCargado->config['host'], (string) $xmlCargado->config['port']);
            $r = null;
            //print_r('asdas');
            //var_dump($a);die;
            if ($a == true) {
                try {
                    if (!class_exists("phpmailer")) {
                        require_once '' . $dir2[0] . '/apps/planificacion/comun/recursos/lib/PHPMailer/class.phpmailer.php';
                    }
                    $r = $mail->Send();
                    $respuesta[0] = 1;
                    $respuesta[1] = null;
                    $respuesta[2] = "ok";
                } catch (phpmailerException $e) {
                    $respuesta[0] = false;
                    $respuesta[1] = 2;
                    $r = "" . $e->getMessage();
                    echo json_encode(array("mensaje" => $r));
                }
            } else {
                $respuesta[0] = false;
                $respuesta[1] = 1;
                $r = "No hay conexion con el servidor de correo";
            }
            echo json_encode(array("mensaje" => $r));
            
        }else{
            ini_set("max_execution_time", 3600); //1hora
            $dir_www = $_SERVER ['DOCUMENT_ROOT'];
            $dir_rel_mt = '/';
            $dir_abs_mt = str_replace('//', '/', dirname($dir_www . '..') . '/' . $dir_rel_mt);

            $configFile = $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'planificacion' . DIRECTORY_SEPARATOR .
                'comun' . DIRECTORY_SEPARATOR . 'recursos' . DIRECTORY_SEPARATOR . 'xml' . DIRECTORY_SEPARATOR . 'config_mailer.xml';
            if (file_exists($configFile)) {
                $data[0]['existe']= 'Ya esta creado el archivo config_mailer.xml';
                echo json_encode(array("data" => $data, "total" => 1));
            }else{
                echo json_encode(array("data" => 1, "total" => 1));
            }
        }
        
        
    }
    
    
    public function generarArchivoAction()
    {
        ini_set("max_execution_time", 3600); //1hora
        //Creando el modelo de negocio de gestion de usuariosç
        $parametros->host = $this->_request->getPost('host');
        $parametros->port = $this->_request->getPost('port');
        $parametros->nombre = $this->_request->getPost('nombre');
        $parametros->user = $this->_request->getPost('user');
        $parametros->pwd1 = $this->_request->getPost('pwd1');
        /**
         * 
         <correo>
    <config secure="none" mailer="smtp" host="correo.xetid.cu" port="25" user="planificacion@xetid.cu"
            nombre="planificacion"
            pwd="82834433583811093699 83963739955350785615 26676933834472399938 87783215948285534376 1522435234375"
    />
</correo>
         */
        //    cod auxiliar para encriptar el pass del usuario para acceder al smtp. lo que imprime debe ponerse en el config_mailer.xml
          $RSA = new ZendExt_RSA();
          $keys = $RSA->generate_keys('9990454949', '9990450271', 0);
          $passEncriptado = $RSA->encrypt($parametros->pwd1, $keys[1], $keys[0], 5);
        
        
        $textoXML = '<correo>';
	$textoXML .= "\n";
	$textoXML .= '<config secure="none" mailer="smtp" host="'.$parametros->host.'" port="'.$parametros->port.'" user="'.$parametros->user.'" ';
	$textoXML .= "\n";
        $textoXML .= 'nombre="'.$parametros->nombre.'" ';
        $textoXML .= 'pwd="'.$passEncriptado.'" />';
        $textoXML .= "\n";
        $textoXML .= '</correo>';
	// Nos aseguramos de que la cadena que contiene el XML esté en UTF-8
	$textoXML = mb_convert_encoding($textoXML, "UTF-8");
//        $dir = split("apps", __FILE__);
//        var_dump($dir);
        $dir2 = split("web", $_SERVER['DOCUMENT_ROOT']);
//        var_dump($dir2); die;
        $path = '' . $dir2[0] . 'apps/planificacion/comun/recursos/xml/config_mailer.xml' ;
        $lugar = '' . $_SERVER['SERVER_NAME'] . '/planificacion/plan711/views/images/upload/' . $_FILES['file']['name'];
        
        $gestor = fopen($path, 'w');
	fwrite($gestor, $textoXML);
	fclose($gestor);
        
        echo json_encode(array("mensaje" => 1));
    }
    
    public function CorreoDePruebaAction()
    {
        
        
        echo json_encode(array("mensaje" => 'prueba'));

    }

}
