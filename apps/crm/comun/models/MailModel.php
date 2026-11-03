<?php

/**
 * ModulesModel
 *
 * Esta es la clase modelo que se encarga de la administracion de los modulos
 * de forma general
 *
 * @package        ERP-PCRM
 * @category       Model
 * @author         Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
 * @copyright (c)  2016, XETID
 * @version        1.0
 */
class MailModel extends ZendExt_Model
{
    private $_fileconfig;
    private $_config;
    private $_mail;
    private $_dirresources;

    public function __construct()
    {
        $this->includeFiles();
        $this->_config = $this->getConfig();
        $this->_mail = new PHPMailer(true);
        $this->setServerConfig();
        $this->setDefaultsValues();
        parent::ZendExt_Model();
    }

    public function getConfig()
    {
        // if (file_exists($this->_fileconfig)) {
        //     return parse_ini_file($this->_fileconfig, true)['mail'];
        // }
        $instance = (new ConfContratoGeneral())->getConfig();           
        return (array)json_decode($instance['confgmail']);
        // throw new Exception(
        //     'EL FICHERO DE CONFIGURACION ' . $this->_fileconfig . ' NO EXISTE'
        // );

        
    }

    private function setServerConfig()
    {
        if ($this->_config['smtpdebug']) {
            $this->_mail->SMTPDebug = $this->_config['smtpdebug']?$this->_config['smtpdebug']:0;
//            $this->_mail->SMTPDebug = 0;
        }
//        $pass=$this->_config['password'];
        if(!$pass){
            $RSA = new ZendExt_RSA();
            $keys = $RSA->generate_keys('9990454949', '9990450271', 0);
            $pass = $RSA->decrypt((string)'82834433583811093699 83963739955350785615 26676933834472399938 87783215948285534376 1522435234375', $keys[2], $keys[0]);
        }
        $from=(string)($this->_config['from']?$this->_config['from']:'yismel@xetid.cu');
        $fromName=(string)($this->_config['fromname']?$this->_config['fromname']:'Gestion Comercial');
//        $this->_mail->SMTPDebug = 0;
        $this->_mail->isSMTP();
        $this->_mail->SMTPSecure = $this->_config['smtpsecure']?$this->_config['smtpsecure']:"none";
        $this->_mail->CharSet = $this->_config['charset']?$this->_config['charset']:'UTF-8';
        $this->_mail->SMTPAuth = $this->_config['smtpauth']?$this->_config['smtpauth']:'false';
        $this->_mail->Host = (string)($this->_config['host']?$this->_config['host']:'correo.xetid.cu');
        $this->_mail->Port = (string)($this->_config['port']?$this->_config['port']:'25');
        $this->_mail->Username = $this->_config['username'];
        $this->_mail->Password = $this->_config['password'];
//        $this->_mail->Username = 'yismel@xetid.cu';
//        $this->_mail->Password = 'yismel.2019';

        $this->_mail->Mailer = $this->_config['mailer']?$this->_config['mailer']:'smtp';
        $this->_mail->Timeout = $this->_config['timeout']?$this->_config['timeout']:50;
        $this->_mail->From = $from;
        $this->_mail->FromName = $fromName;
        $this->_mail->addReplyTo($from, $fromName);
//        print_r($this->_mail);die;
    }

//    public function enviarCorreo($address, $asunto = null, $cuerpo = null, $attachment = null) {
    public function enviarCorreo($contenido) {
        try {
//            print_r($contenido);die;
            if ($this->_config['enabled'] != "true") {
                return array('success'=>false, 'mensaje'=>'No está habilitado el correo.');
            }
            $asunto = $contenido['asunto'] ? $contenido['asunto'] : $this->_config['subject'];
            $cuerpo = $contenido['cuerpo'] ? $contenido['cuerpo'] : $this->_config['msg'];
            $cuerpo = $cuerpo.($this->_config['foot']?'<br><br><p style="color: gray; font-size: 12px">'.$this->_config['foot']:'</p>');
//            print_r($_SERVER["SERVER_PROTOCOL"]);

            $this->_mail->IsHTML(true);
            $this->_mail->Subject = $asunto;
            $this->_mail->Body = $cuerpo;

            $this->_mail->MsgHTML($this->_mail->Body);
            //comprobar destinatarios
            if($contenido['destinatarios']==null)throw new Exception('El correo no tiene destinatarios.');
            if (!is_array($contenido['destinatarios'])) {
                $contenido['destinatarios'] = [$contenido['destinatarios']];
            }
            foreach ($contenido['destinatarios'] as $to) {
//                $this->_mail->addAddress($to);
                $this->_mail->AddBCC($to);
            }
            //comprobar adjuntos
            if ($this->_config['send_attachement']=='true' && $contenido['attachment']) {
                if($this->_config['check_attachement']=='true' &&
                    (!isset($contenido['sinComprobar']) || $contenido['sinComprobar']==false)){
                    return array('success'=>false, 'mensaje'=>'Comprobar adjuntos', 'contenido'=>$contenido, 'checkattachment'=> true);
                }else {
                    if (!is_array($contenido['attachment'])) {
                        $contenido['attachment'] = [$contenido['attachment']];
                    }
                    if($this->_config['check_attachement']=='true')
                        $contenido['attachment']=MainModel::checkAttachment($contenido['attachment']);

                    foreach ($contenido['attachment'] as $att) {
                        $att=(array)$att;
                        $this->_mail->addAttachment($att['ruta'],
                            $att['nombre'] . '.' . $att['formato']);
                    }
                }
            }
            if ($this->_config['template'] || $contenido['template']) {
                $dir = $this->_dirresources . $this->_config['template'];
//                print($this->_dirresources . $this->_config['template']);
                $html=file_get_contents($dir);
                $html=str_replace('%BODY%', ($contenido['cuerpo'] ? $contenido['cuerpo'] : $this->_config['msg']), $html);
                $html=str_replace('%FOOTER%', $this->_config['foot'], $html);
                $html=str_replace('%DIRECCION%', $_SERVER['HTTP_ORIGIN'], $html);

                $this->_mail->msgHTML($html);
            }

            $smtp1 = new SMTP();
//            print('/*Host'.$this->_mail->Host.'*/');
//            print('/*Port'.$this->_mail->Port.'*/');
            $smtpserver=$smtp1->connect((string)$this->_mail->Host, (string)$this->_mail->Port);
            if($smtpserver==true){
//                print('smtp conexion');
                if (!$this->_mail->send()) {
                    throw new Exception("Mailer Error: " . $this->_mail->ErrorInfo);
                } else {
                    return array('success'=>true, 'mensaje'=>'Correo enviado');
                }
            }else{
                throw new Exception('No hay conexión con el servidor SMTP.');
            }
//            $noenviado=array();
//            foreach ($contenido['destinatarios'] as $to) {
//                $this->_mail->AddBCC($to);
//                if (!$this->_mail->send()) {
//                    $noenviado[]=$to;
//                }
//            }
//            if(count($noenviado)){
//                return 'No se pudo enviar a los siguientes destinatarios: '.implode('<br>-', $noenviado);
//            }
//            return true;
        } catch (Exception $e) {
//            throw new Exception($e->getMessage());
            throw $e;
        }
    }



    private function setDefaultsValues()
    {
        $this->_mail->setFrom(
            $this->_config['from'], $this->_config['fromname']
        );
//        if($this->_config['template']){
//            $this->_mail->msgHTML(
//                file_get_contents($this->_config['template']),
//                $this->_dirresources
//            );
//        }
    }

    private function includeFiles()
    {
        $dir_index = $_SERVER['SCRIPT_FILENAME'];
        $dir_index = substr($dir_index, 0, strrpos($dir_index, 'web'));
//        $php_mailer = $dir_index.'/lib/Adapters/PHPMailer/5.2.15/PHPMailerAutoload.php';
        $dir_www = $_SERVER ['DOCUMENT_ROOT'];
        $dir_rel_mt = '/';
        $dir_abs_mt = str_replace('//', '/', dirname($dir_www . '..') . '/' . $dir_rel_mt);
        $php_mailer = $dir_abs_mt . '/apps/planificacion/comun/recursos/lib/PHPMailer/class.phpmailer.php';
        $php_smtp = $dir_abs_mt . '/apps/planificacion/comun/recursos/lib/PHPMailer/class.smtp.php';
        $this->_fileconfig = $dir_index. '/apps/crm/comun/recursos/server_config.ini';
        $this->_dirresources = $dir_index . 'apps/crm/comun/recursos/mailtemplates/';
        include_once $php_mailer;
        include_once $php_smtp;
    }

    public function getServerConfig(){
        return $this->_config;
    }

    public function guardarArchivoTemporal($formato, $obj, $nombre='Adjunto'){
        $ruta=$this->getTemporalName('xls', $nombre);
        if($formato=='xls' || $formato=='xlsx') {

            ob_end_clean();
            //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save;
            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment;filename="Reporte contrato ' . date('d/m/Y') . '.xls" ');
            header('Cache-Control: max-age=0');

            $objWriter = PHPExcel_IOFactory::createWriter($obj, 'Excel5');
            ob_end_clean();
            $objWriter->save($ruta);
            $obj->disconnectWorksheets();
            unset($obj);
            ini_restore("max_execution_time");
            ini_restore("max_input_time");
            ini_restore("memory_limit");
            if(file_exists($ruta))
                return array('ruta' => $ruta, 'nombre' => $nombre, 'formato'=>'xls');
        }else if($formato=='rtf'){
            $obj->save($ruta);
            ini_restore("max_execution_time");
            ini_restore("max_input_time");
            ini_restore("memory_limit");
            if(file_exists($ruta))
                return array('ruta' => $ruta, 'nombre' => $nombre, 'formato'=>'rtf');
        }
    }

//    public function getRutaTemporal(){
//        return $_SERVER['DOCUMENT_ROOT'].'/crm/application/temp/';
//    }

    public function getTemporalName($formato, $nombre='temp'){
        $dir_temp = MainModel::getRutaTemporal();
        $cont = '';
        while (file_exists($dir_temp . $nombre . ($cont==''?$cont:'__'.$cont) . ($formato?'.'.$formato:''))) {
            $cont=$cont+1;
        }
        return $dir_temp . $nombre . ($cont==''?$cont:'__'.$cont) . ($formato?'.'.$formato:'');
    }
}