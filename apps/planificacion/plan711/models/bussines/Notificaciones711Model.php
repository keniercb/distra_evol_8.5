<?php

class Notificaciones711Model extends ZendExt_Model {
    
    public function setUp() {
        parent::ZendExt_Model();
    }
    
    public function adicionarNotificacion($parametros){
        $notificacion = new DatNotificaciones711();
        $not  = $notificacion->listarNotificacion($parametros);
        if(count($not)==0){
            $conn = Doctrine_Manager::connection();
            $ids= $parametros['listaidrol'];
            $is= $parametros['listaroles'];
            $idestadoaprobacion='null';
            $idsituacionpedido='null';
            if($parametros['tiponotificacion']==1){
                $idestadoaprobacion = $parametros ['idnomenclador'];
            }else{
                $idsituacionpedido = $parametros['idnomenclador'];
            }
            $paraconsolidacion='false';
            if($parametros['paraconsolidacion']==true){
                $paraconsolidacion='true';
            }
            $sqlupd = "INSERT INTO mod_plan711.dat_notificaciones711(
                                idtipoplan, idestadoaprobacion, idsituacionpedido, 
                                idconceptocompra, textonotificacion, listaidrol, listaroles, paraconsolidacion)
                        VALUES ({$parametros ['idtipoplan']}, $idestadoaprobacion, $idsituacionpedido, 
                                {$parametros ['idcc']}, '{$parametros ['textonotificacion']}', array[$ids], '$is', $paraconsolidacion);";
            $conn->execute($sqlupd); 
            return 1;
        }else{
            return 'La notificación que intenta configurar ya existe';
        }
        
    }
    
    public function modificarNotificacion($parametros) {
        $ids = $parametros['listaidrol'];
        $is = $parametros['listaroles'];
        $paraconsolidacion = 'false';
        if ($parametros['paraconsolidacion'] === 'true') {
            $paraconsolidacion = 'true';
        }
        $conn = Doctrine_Manager::connection();
            $sqlupd = "UPDATE mod_plan711.dat_notificaciones711
                        SET textonotificacion='{$parametros['textonotificacion']}', listaidrol=array[$ids], listaroles = '$is',
                                paraconsolidacion = ".$paraconsolidacion."
                      WHERE idnotificaciones711 ={$parametros['idnotificaciones711']}";
            $conn->execute($sqlupd); 
            Doctrine_Manager::getInstance()->getCurrentConnection()->commit();
        
        return 1;
    }
    
    public function listarNotificacion($parametros){
        $arrayResult = DatNotificaciones711::listarNotificacion($parametros);
        return $arrayResult;
    }

    public function EliminarNotificacion($parametros) {
        $conn = Doctrine_Manager::connection();
        $sqlinsert = "DELETE FROM mod_plan711.dat_notificaciones711
                        WHERE idnotificaciones711 ={$parametros['idnotificaciones711']}";
        $conn->execute($sqlinsert);
        return 1;
    }
    
    public function listarUserNotificar($parametros){
        $arrayResult = DatUserNotificar::listarUserNotificar($parametros);
        return $arrayResult;
    }
    
    public function ActualizarListaDeUsuarios($parametros) {
        $roles = self::cargarRoles();
        $integrator = ZendExt_IoC::getInstance();
        $auxusuarios=[];
        $cont=0;
        foreach ($roles as $value) {
            $aux=[];
            $aux = $this->integrator->seguridad->getUserListWithRole($value['idrol']);
            foreach ($aux['datos'] as $value1) {
                $value1['idrol']= $value['idrol'];
                $value1['rol']= $value['denominacion'];
                $idacceso = DatUserNotificar::ObtenerIdAcceso($value1);
//                var_dump($idacceso[0]['identidad']);die;
                $entidades = DatUserNotificar::ObtenerIdfila($idacceso[0]['identidad']);
                $value1['identidad']= null;
                $value1['entidad']= null;
                if(count($entidades)==1){
                    $value1['identidad']= $entidades[0]['idfila'];
                    $value1['entidad']= $entidades[0]['denominacion'];
                }
                $arrayidpersonaIdUsuario = $this->integrator->seguridad->getArrayIdPersonaByUsersName(
                    array($value1['nombreusuario'])
                );
                $value1['idpersona']=$arrayidpersonaIdUsuario[0];
                $auxusuarios[$cont]=$value1;
                $cont++;
            }
        }
//        var_dump($auxusuarios); die;
        $a=DatUserNotificar::LimpiarLista();
        foreach ($auxusuarios as $value) {
            $d=DatUserNotificar::AdcionarUserNotificar($value);
        }
        return $d;
    }
    
    public function GuardarCorreos($parametros) {
        
        foreach ($parametros['listausuarios'] as $value) {
            if($value->idpersona == NULL){
                $value->idpersona=DatUserNotificar::CrearPersona($value);
            }
            if($value->contacto=='' || $value->contacto== null){
                DatUserNotificar::EliminarDatoContacto($value);
            }else{
                DatUserNotificar::EliminarDatoContacto($value);
                DatUserNotificar::CrearDatoContacto($value);
            }
            
        }
        return 1;
    }
    
    public function cargarRoles() {
        $integrator = ZendExt_IoC::getInstance();
        $rolesresult = array();
        $roles = $integrator->seguridad->getTodosRoles();
        foreach ($roles as $value) {
            if(strpos($value['denominacion'],'711')){
                $rolesresult[]=$value;
            }
        }
        return $rolesresult;
    }
    
        //public function generarNotificacionSistema($parametros)
//        lo que se debe esperar dentro de parametros $idsolicitud711, $tiponotificacion
    public function DameUsuariosANotificar($parametros)
    {
        $solicitud = DatSolicitud711::listarSolicitudes711Reportes($parametros);
        $entidad = $solicitud[0]['identidadcliente'];

        if ($parametros['tiponotificacion'] == 1) {
            $parametros['idnomenclador'] = $solicitud[0]['iddatosestado'];
        }
        if ($parametros['tiponotificacion'] == 2) {
            $parametros['idnomenclador'] = $solicitud[0]['idsp'];
        }
        $parametros['idtipoplan'] = $solicitud[0]['idtiposolicitudplan'];
        $listausuarios = [];
        if($solicitud[0]['estaconsolidada']==true || $solicitud[0]['esconsolidada']==true){
            $parametros['paraconsolidacion']='true';
        }
        $listanotificacion = DatNotificaciones711::listarNotificacion($parametros);
        if(count($listanotificacion)>0){
            $listaidrol = $listanotificacion[0]['listaidrol'];
            $listaidrol = str_replace('{', '', $listaidrol);
            $listaidrol = str_replace('}', '', $listaidrol);
            $listausuarios = DatUserNotificar::listarUserNotificar(array('listaidrol' => $listaidrol, 'identidad' => $entidad, 'contacto'=>1));
            //var_dump($listausuarios); die;
        }
        //var_dump($respuesta); die;
        return $listausuarios;
    }
    
    
    public function generarNotificacionSistema_old($parametros)
    {
        $solicitud = DatSolicitud711::listarSolicitudes711Reportes($parametros);
        $entidad = $solicitud[0]['identidadcliente'];

        if ($parametros['tiponotificacion'] == 1) {
            $parametros['idnomenclador'] = $solicitud[0]['iddatosestado'];
        }
        if ($parametros['tiponotificacion'] == 2) {
            $parametros['idnomenclador'] = $solicitud[0]['idsp'];
        }
        $parametros['idtipoplan'] = $solicitud[0]['idtiposolicitudplan'];

        $listanotificacion = DatNotificaciones711::listarNotificacion($parametros);
        if(count($listanotificacion)>0){
            $listaidrol = $listanotificacion[0]['listaidrol'];
            $listaidrol = str_replace('{', '', $listaidrol);
            $listaidrol = str_replace('}', '', $listaidrol);
            $listausuarios = [];
            $listausuarios = DatUserNotificar::listarUserNotificar(array('listaidrol' => $listaidrol, 'identidad' => $entidad));

            $usuarios = [];
            foreach ($listausuarios as $value1) {
                $usuarios[] = $value1['nombreusuario'];
            }
            $arrayidpersonaIdUsuario = $this->integrator->seguridad->getArrayIdPersonaByUsersName(
                    $usuarios
            );
            if(count($arrayidpersonaIdUsuario)>0){
                $contenidoreal = $listanotificacion[0]['textonotificacion']."\n";
                $contenidoreal .= "No. Solicitud: {$solicitud[0]['nosolicitud']} "."\n";
                $contenidoreal .= "Usuario que hizo la modificación: {$parametros['usuario']} "."\n";
                //Para correo
                $contenido = '<p style= "font-family: arial,helvetica,sans-serif; font-size: 12pt;">'
                                .$value['textonotificacion'].'<br><br>';
                $contenido .= '<b>Entidad: </b>'. $solicitud[0]['nombreentidad'].'<br>';
                $contenido .= '<b>Plan: </b>'.$solicitud[0]['tipoplan'] .'<br>';
                if($solicitud[0]['idtiposolicitudplan']==1254){
                    $contenido .= '<b>Fuente de Financiamiento: </b>'. $solicitud[0]['fuente'] .'<br>';
                }else{
                    $contenido .= '<b>Código de Planificación: </b>'. $solicitud[0]['codigofar'] .'<br>';
                }
                $contenido .= '<b>Empresa Importadora: </b>'. $solicitud[0]['importadora'] .'<br>';
                $contenido .= '<b>No. Solicitud: </b>'.$solicitud[0]['nosolicitud'] .'<br>';
                $contenido .= '<b>Descripcion de la Solicitud: </b>'. $solicitud[0]['descripciongeneral'] .'<br>';
                $contenido .= '<b>Estado de Aprobación: </b>'. $solicitud[0]['denominacion'] .'<br>';
                $contenido .= '<b>Situación del Pedido: </b>'. $solicitud[0]['situacionpedido'] .'<br>';
                $contenido .= '<b>Usuario que hizo la modificación: </b>'. $parametros['usuario'] .'<br>';
                $contenido .= '<b>Observación: </b>'.$parametros['motivo'] .'<br>';
                
                $notificacioncorreo= array();
                
                $notificacioncorreo['contenido']=$contenido;
                $notificacioncorreo['usuarios']=$arrayidpersonaIdUsuario;
                $notificacioncorreo['correos']=array();
                $correos= DatUserNotificar::getCorreos($arrayidpersonaIdUsuario);
                $respuesta = array();
                $respuesta[0] = 1;
                if(count($correos)>0){
                    foreach ($correos as $value) {
                        if($value['contacto']!=null)
                            $notificacioncorreo['correos'][]=$value['contacto'];
                    }
                    $notificacioncorreo['asunto']="No.Sol: {$solicitud[0]['nosolicitud']} ".$listanotificacion[0]['textonotificacion'];
                    //var_dump('ddddd'); die;
                    $respuesta[1] = self::enviarCorreo($notificacioncorreo);
                }
                /**
                 * Datos que se deben llenar automáticamente cuando se envié la notificación:
                    • Entidad:
                    • Plan: FAR o de Negocio
                    • Fuente de financiamiento: (Bienes de capital o Bienes intermedios), esto solo sale si la solicitud es de Negocio.
                    • Empresa importadora:
                    • No. Solicitud
                    • Descripción general de la solicitud:
                    • Estado de aprobación
                    • Situación del pedido
                    • Usuario que hizo la modificación
                    • Observación: este dato es para las inversiones con Situación de pedido igual a “En proceso de contratación” que contienen una Observación solicitando cambios en la solicitud. 
                 */
                $this->integrator->notification->sendSistemMessage(
                        $arrayidpersonaIdUsuario, $contenidoreal, 1
                );
            }
            
        }
        //var_dump($respuesta); die;
        return $respuesta;
    }
    
    public function generarNotificacionSistema($parametros)
    {
        $solicitud = DatSolicitud711::listarSolicitudes711Reportes($parametros);
        $entidad = $solicitud[0]['identidadcliente'];

        if ($parametros['tiponotificacion'] == 1) {
            $parametros['idnomenclador'] = $solicitud[0]['iddatosestado'];
        }
        if ($parametros['tiponotificacion'] == 2) {
            $parametros['idnomenclador'] = $solicitud[0]['idsp'];
        }
        if($solicitud[0]['estaconsolidada']==true || $solicitud[0]['esconsolidada']==true){
            $parametros['paraconsolidacion']='true';
        }
        $parametros['idtipoplan'] = $solicitud[0]['idtiposolicitudplan'];

        $listanotificacion = DatNotificaciones711::listarNotificacion($parametros);
        if(count($listanotificacion)>0){
                $contenidoreal = $listanotificacion[0]['textonotificacion']."\n";
                $contenidoreal .= "No. Solicitud: {$solicitud[0]['nosolicitud']} "."\n";
                $contenidoreal .= "Usuario que hizo la modificación: {$parametros['nombreusuario']} "."\n";
                //Para correo
                $contenido = '<p style= "font-family: arial,helvetica,sans-serif; font-size: 12pt;">'
                                .$value['textonotificacion'].'<br><br>';
                $contenido .= '<b>Entidad: </b>'. $solicitud[0]['nombreentidad'].'<br>';
                $contenido .= '<b>Plan: </b>'.$solicitud[0]['tipoplan'] .'<br>';
                if($solicitud[0]['idtiposolicitudplan']==1254){
                    $contenido .= '<b>Fuente de Financiamiento: </b>'. $solicitud[0]['fuente'] .'<br>';
                }else{
                    $contenido .= '<b>Código de Planificación: </b>'. $solicitud[0]['codigofar'] .'<br>';
                }
                $contenido .= '<b>Empresa Importadora: </b>'. $solicitud[0]['importadora'] .'<br>';
                $contenido .= '<b>No. Solicitud: </b>'.$solicitud[0]['nosolicitud'] .'<br>';
                $contenido .= '<b>Descripcion de la Solicitud: </b>'. $solicitud[0]['descripciongeneral'] .'<br>';
                $contenido .= '<b>Estado de Aprobación: </b>'. $solicitud[0]['denominacion'] .'<br>';
                $contenido .= '<b>Situación del Pedido: </b>'. $solicitud[0]['situacionpedido'] .'<br>';
                $contenido .= '<b>Usuario que hizo la modificación: </b>'. $parametros['nombreusuario'] .'<br>';
                $paramestros['tipo']=3;
                $paramestros['ultimo']=1;
                $parametros['motivo']= (new DatMotivoModificacionModel)->listarModif($paramestros);
                $contenido .= '<b>Observación: </b>'.$parametros['motivo'] .'<br>';
                
                $notificacioncorreo= array();
                
                $notificacioncorreo['contenido']=$contenido;
                $notificacioncorreo['usuarios']=$arrayidpersonaIdUsuario;
                $notificacioncorreo['correos']=array();
                
                //$respuesta = array();
                $notificacioncorreo['correos'][]=$parametros['contacto'];
                $notificacioncorreo['asunto']="No.Sol: {$solicitud[0]['nosolicitud']} ".$listanotificacion[0]['textonotificacion'];
                $respuesta = self::enviarCorreo($notificacioncorreo);
                /**
                 * Datos que se deben llenar automáticamente cuando se envié la notificación:
                    • Entidad:
                    • Plan: FAR o de Negocio
                    • Fuente de financiamiento: (Bienes de capital o Bienes intermedios), esto solo sale si la solicitud es de Negocio.
                    • Empresa importadora:
                    • No. Solicitud
                    • Descripción general de la solicitud:
                    • Estado de aprobación
                    • Situación del pedido
                    • Usuario que hizo la modificación
                    • Observación: este dato es para las inversiones con Situación de pedido igual a “En proceso de contratación” que contienen una Observación solicitando cambios en la solicitud. 
                 */
//                $this->integrator->notification->sendSistemMessage(
//                        $arrayidpersonaIdUsuario, $contenidoreal, 1
//                );
            }
            
        //var_dump($respuesta); die;
        return $respuesta;
    }
    
    public function enviarCorreo($parametros)
    {
        //print_r('asdadasd'); die;
//   $parametros->emails = ['tumbarell@xetid.cu', 'fsera@xetid.cu', 'ragraveran@xetid.cu'];
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
        $passDesencriptado = $RSA->decrypt((string)$xmlCargado->config['pwd'], $keys[2], $keys[0]);

        $dir2 = split("web", $_SERVER['DOCUMENT_ROOT']);
        require_once '' . $dir2[0] .  '/apps/planificacion/comun/recursos/lib/PHPMailer/class.phpmailer.php';


        $mail = new PHPMailer();
        
        $mail->IsSMTP();
        
        $mail->SMTPDebug = 1;
        //OJO
        $mail->SMTPAuth = false;
        $mail->SMTPSecure = "none";

        $mail->Host = (string)$xmlCargado->config['host'];
        $mail->Port = (string)$xmlCargado->config['port'];
        $mail->Username = (string)$xmlCargado->config['nombre'];
        $mail->Password = $passDesencriptado;
//        $mail->Mailer = (string)$xmlCargado->config['mailer'];
        $mail->Timeout = 50;
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        //====== DE QUIEN ES ========
        $mail->From = (string)$xmlCargado->config['user'];
        $mail->FromName = (string)$xmlCargado->config['user'];
        $mail->Subject = $parametros['asunto'];

        //====== PARA QUIEN =========
        //print_r($parametros->emails); die;
        foreach ($parametros['correos'] as $dir) {
            $mail->AddBCC($dir, $dir);
            //$mail->AddReplyTo($dir, $dir);
        }

        //Cuerpo del mensaje

        $body .= $parametros['contenido'];
        $body .= " <br><i>No responder este correo. Enviado desde el Sistema de Planificaci&oacute;n.</i></p>";
        $mail->Body = $body;

        $mail->MsgHTML($mail->Body);
        $mail->IsHTML(true);
        //print_r($mail);die;
        require_once '' . $dir2[0] .  'apps/planificacion/comun/recursos/lib/PHPMailer/class.smtp.php';
        $mail2 = new SMTP();

        $a=$mail2->connect((string)$xmlCargado->config['host'], (string)$xmlCargado->config['port']);
        
        if($a==true){
            try {
                if (!class_exists("phpmailer")) {
                    require_once '' . $dir2[0] .  '/apps/planificacion/comun/recursos/lib/PHPMailer/class.phpmailer.php';
                }
                $r=$mail->Send();
                $respuesta[0]=1;
                $respuesta[1]=null;
                $respuesta[2]="ok";
                return $respuesta;
                
            } catch (phpmailerException $e) {
                $respuesta[0]=false;
                $respuesta[1]=2;
                $respuesta[2]="".$e->getMessage();
                return $respuesta;
            }
        }else{
            $respuesta[0]=false;
            $respuesta[1]=1;
            $respuesta[2]="No hay conexion con el servidor de correo";
            return $respuesta;
        }
        

//    } catch (phpmailerException $e) {
//            $e->getMessage();
//            $respuesta[0]=false;
//            $respuesta[1]="".$e->getMessage();
//            return $respuesta;
//    }
//        if (
//        $mail->Send()
//        ) {
//            $result = true;
//
//        } else {
//            $result = false;
//        }
        
	}
    
}