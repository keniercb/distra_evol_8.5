<?php

/**
 * @author    Nestor Bernal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpgestionarfipModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para cargar las fip
     */
    public function CargarFips(
        $idfip, $idusuario, $idelementotributa, $arrayautores, $arrayinvolucrados, $nivelacceso,
        $tipoact, $start, $limit, $busqueda, $filtros, $reorganizar
    )
    {
        $cero = 0;
        $uno = 1;
        if (isset($arrayinvolucrados[0])) {
            foreach ($arrayinvolucrados as $involucrado) {
                $id = $involucrado->idusuario;
                if ($involucrado->tipo == 0) {
                    $id = $involucrado->idgrupo;
                }
                $arrayinvolact[] = $id . $cero;
                $arrayinvolact[] = $id . $uno;
                if ($involucrado->tipo == 1) {
                    $arraygrupos
                        = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                        $id
                    );
                    if (isset($arraygrupos[0])) {
                        foreach ($arraygrupos as $grupo) {
                            $arrayinvolact[] = $grupo['idgrupo'] . $cero;
                            $arrayinvolact[] = $grupo['idgrupo'] . $uno;
                        }
                    }
                }
            }
        }
        if (isset($arrayautores[0])) {
            foreach ($arrayautores as $autor) {
                $arrayautoresact[] = $autor->idautor;
            }
        }

        //***---Reorganizar---***//
        if (isset($reorganizar[0])) {
          $reorganizar = implode(',', $reorganizar);
        }
//
        //aqui empiezo a definir las posibles cmbinaciones para obtener
        //arreglo de inv y autores cuanod estos no vienen del client
        if (!isset($arrayautores[0]) && !isset($arrayinvolucrados[0])) {
            $arrayautoresact[] = $idusuario;
            $arrayinvolact[] = $idusuario . $cero;
            $arrayinvolact[] = $idusuario . $uno;
            $arraygrupos
                = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                $idusuario
            );
            if (isset($arraygrupos[0])) {
                foreach ($arraygrupos as $grupo) {
                    $arrayinvolact[] = $grupo['idgrupo'] . $cero;
                    $arrayinvolact[] = $grupo['idgrupo'] . $uno;
                }
            }
        }

        $objdatelementos = new DatElementos();
        $arrayfips = $objdatelementos->CargarFips(
            $idfip, $idusuario, $idelementotributa, $arrayautoresact, $arrayinvolact, $nivelacceso,
            $tipoact, $start, $limit, $busqueda, $filtros, $reorganizar
        );




        $arrayelementopadre = [];
        if (isset($arrayfips['resultado'][0])) {


            foreach ($arrayfips['resultado'] as $key => $fip) {
                $parent = self::buscarPadre($arrayelementopadre, $fip['idelemento']);
                if ($parent == null) {
                    $parent = ($idfip) ? $idfip : null;
                }
                $leaf = true;
                if ($fip['cantrelacdescorigen0'] > 0 || $fip['cantrelacdescorigen2'] > 0
                ) {
                    $tienehijos = $objdatelementos->CargarFips(
                        $fip['idelemento'], $idusuario, $idelementotributa, $arrayautoresact, $arrayinvolact, $nivelacceso, $tipoact, $start, $limit, $busqueda, $filtros, $reorganizar
                    );
                    if ($tienehijos['total'] > 0) {
                        $leaf = false;
                        foreach ($tienehijos['resultado'] as $key1 => $hijo) {
                            $data['idelemento'] = $hijo['idelemento'];
                            $data['parent'] = $fip['idelemento'];
                            array_push($arrayelementopadre, $data);
                        }
                    }
                }

                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                if ($fip['idautor'] != $idusuario) {
                    $superior = 1;
                    $permisomodificacion
                        = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                        $idusuario, $fip['idautor']
                    );
                    if ($permisomodificacion) {
                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                        $subordinado = $permisomodificacion[4];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                        $subordinado = 0;
                    }
                }
                $parametros->idelemento = $fip['idelemento'];
                $arrayfechascontrol = DatFechaControl::CargarFechasControl(
                    $parametros
                );

                $textofechascontrol = '';
                if (isset($arrayfechascontrol[0])) {
                    foreach ($arrayfechascontrol as $k => $fechacontrol) {
                        if ($k > 0) {
                            $textofechascontrol = $textofechascontrol . ',  ';
                        }
                        $fechadecontrol = explode(
                            '/', $fechacontrol['fechacontrol']
                        );
                        $textofechascontrol
                            = $textofechascontrol . $fechadecontrol[0] . '/'
                            . $fechadecontrol[1] . '/' . $fechadecontrol[2];
                    }
                }
                $arrayfips['resultado'][$key]['nombreautor']
                    = $fip['autor'];//$this->pIntegrator->configuracionpdo->getDenominacionIdUsuario($fip['idautor'], 'usuario', null);

                $arrayfips['resultado'][$key]['_is_leaf'] = $leaf;
                $arrayfips['resultado'][$key]['_parent'] = $parent;
                $arrayfips['resultado'][$key]['superior'] = $superior;
                $arrayfips['resultado'][$key]['subordinado'] = $subordinado;
                $arrayfips['resultado'][$key]['modificar'] = $modificar;
                $arrayfips['resultado'][$key]['eliminar'] = $eliminar;
                $arrayfips['resultado'][$key]['textocumplimiento']
                    = $fip['estadocumplimiento'];

                $arrayfips['resultado'][$key]['estadocumplimiento']
                    = $fip['estadocumplimiento'] . "("
                    . $fip['gradocumplimiento']
                    . "%)";
                $arrayfips['resultado'][$key]['observaciones']
                    = $fip['observaciones'];
                $arrayfips['resultado'][$key]['fechascontrol']
                    = $textofechascontrol;

            } //print_r('df'); die();
        }
        return $arrayfips;
    }

    public function buscarPadre($arrayelementopadre, $idfip)
    {
        $parent = null;
        foreach ($arrayelementopadre as $key => $elemento) {
            if ($elemento['idelemento'] == $idfip) {
                $parent = $elemento['parent'];
                break;
            }
        }
        return $parent;
    }

    /********
       Enviar correo notificacion
     ********/

  public function enviarCorreo($parametros)
  {
   //$parametros->emails = ['ragraveran@xetid.cu'];
    $dir_www = $_SERVER ['DOCUMENT_ROOT'];
    $dir_rel_mt = '/';
    $dir_abs_mt = str_replace('//', '/', dirname($dir_www . '..') . '/' . $dir_rel_mt);


    $configFile = $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'planificacion' . DIRECTORY_SEPARATOR .
      'comun' . DIRECTORY_SEPARATOR . 'recursos' . DIRECTORY_SEPARATOR . 'xml' . DIRECTORY_SEPARATOR . 'config_mailer.xml';
    if (file_exists($configFile)) {
      $xmlCargado = simplexml_load_file($configFile);
    }

//    cod auxiliar para encriptar el pass del usuario para acceder al smtp. lo que imprime debe ponerse en el config_mailer.xml
//              $RSA = new ZendExt_RSA();
//          $keys = $RSA->generate_keys('9990454949', '9990450271', 0);
//          $passEncriptado = $RSA->encrypt('planificaciondev*2017', $keys[1], $keys[0], 5);
//          print_r($passEncriptado);die;


    $RSA = new ZendExt_RSA();
    $keys = $RSA->generate_keys('9990454949', '9990450271', 0);
    $passDesencriptado = $RSA->decrypt((string)$xmlCargado->config['pwd'], $keys[2], $keys[0]);
    require $dir_abs_mt . '/apps/planificacion/comun/recursos/lib/PHPMailer2/class.phpmailer.php';
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
    $mail->Subject = $parametros->asunto;
    $datosautor
      = $this->integrator->pvd->getPrincipalesDatosPersona(
      $params[] = $parametros->idpersona
    );
    if (isset($datosautor->data[0])) {
      $autor
        = ($datosautor->data[0]['nombreapellidos']);
    } else {
      $usuarioautor
             = $this->integrator->seguridad->nombreUsuario(
        $parametros->idusuariocrea
      );
      $autor = $usuarioautor;
    }


    //====== PARA QUIEN =========
    //print_r($parametros->emails); die;
    foreach ($parametros->emails as $dir) {
      $mail->AddBCC($dir, $dir);
      //$mail->AddReplyTo($dir, $dir);
    };

    $body
                = '<p style= "font-family: arial,helvetica,sans-serif; font-size: 12pt;">'
      . $parametros->asunto ."<br><br>";
    $body .= '<b>Denominaci&oacute;n: </b>'
      . $parametros->denelemento . '<br>
                                <b>Descripci&oacute;n: </b>'
      . $parametros->descelemento . '<br>
                                <b>Fecha de emisión: </b>'
      . $parametros->fechaemision . '<br>
                                <b>Fecha de cumplimiento: </b>'
      . $parametros->fechacumplimiento . '<br>
                                <b>Fecha en que se cumplió: </b>'
      . $parametros->fechacumplio . '<br>
                                <b>Número: </b>'
      . $parametros->numfip . '<br>
                                <b>Emite: </b>'
      . $parametros->emite . '<br>
                                <b>Autor: </b>'
      . $autor . '<br><br>';

    $body .= " <br><i>No responder este correo. Enviado desde el Sistema de Planificaci&oacute;n.</i></p>";
    $mail->Body = $body;

//    if ($params->archivos) {
//      foreach ($params->archivos as $arch) {
//        $archivo = $dir_abs_mt . $params->direccion . $arch->name;
//        chmod($archivo, 0777);
//        $mail->AddAttachment($archivo, $arch->name); //Archivo adjunto
//      }
//    }
//    if ($params->archivo) {
//      $archivo = $dir_abs_mt . $params->direccion . $params->archivo;
//      chmod($archivo, 0777);
//      $mail->AddAttachment($archivo, $params->archivo); //Archivo adjunto
//    }
    $mail->MsgHTML($mail->Body);
    $mail->IsHTML(true);


//    try {
    if (
    $mail->Send()
    ) {
      $result = true;

    } else {
      $result = false;
    }
//    } catch (phpmailerException $e) {
//            print_r($e->getMessage() . '</pre>' . $e->getTraceAsString());
//
//    }
    return $result;
  }

  private
  function extract_email_address($string)
  {
    $response = array();
    foreach (preg_split('/\s/', $string) as $token) {
      $email = filter_var(
        filter_var($token, FILTER_SANITIZE_EMAIL), FILTER_VALIDATE_EMAIL
      );
      if ($email !== false) {
        $response[] = $email;
      }
    }
    return $response;
  }



    /**
     * Funcion para adicionar las f
     */
    public function AdicionarFip($parametros)
    {
        $procede = 1;
        if ($parametros->eshija == 1) {
            $elementopadre = Doctrine::getTable('DatElementos')->find(
                $parametros->idfippadre
            );
            if (!isset($elementopadre->idelemento)) {
                $procede = 0;
            }
        }
        if ($procede == 1) {
            
            /**
             * El siguiente bloque fue comentariado para el GAE
             */
            /*$existeelemento = Doctrine::getTable('DatElementos')->findByDql(
                "denelemento = '$parametros->denelemento' AND idtipoelemento = 2"
            );
            if ($existeelemento[0]->idelemento != null) {
                $procede = 2;
            } else {*/
                $objelemmodel = new CmpgestionarelementoModel();
                $estadoaprobpordefcto = null;

                //validar si retorna null....
                $estadocumplimiento
                    = $objelemmodel->actualizarEstadoCumplimiento(
                    $estadocumplimiento, $parametros->gradocumplimiento
                );
                //se crea el objeto 'elemento' y se registra
                $objCmpgestionarelementomodel = new Cmpgestionarelementomodel();

                $datelemento = $objCmpgestionarelementomodel->AdicionarElemento(
                    $parametros->denelemento, $parametros->descelemento, $parametros->gradocumplimiento, $parametros->idtipoelemento, $activo = 1, $estadocumplimiento, $estadoaprobpordefcto, $parametros->idusuariocrea, $parametros->dirigentes, $parametros->participantes
                );

                //se procede a crear las fechas de control para el fip
                if (isset($parametros->arrayfechascontrol[0]->fechacontrol)) {
                    $objfechacontrolmodel = new CmpfechacontrolModel();
                    $parametros->idelemento = $datelemento->idelemento;
                    $parametros->fechacreacion = date('d/m/Y');
                    foreach (
                        $parametros->arrayfechascontrol as $key => $fechacontrol
                    ) {
                        $parametros->fechacontrol = str_replace(
                            " ", "", $fechacontrol->fechacontrol
                        );
                        //$parametros->fechacontrol = $fechacontrol->fechacontrol;
                        $parametros->comentario = $fechacontrol->comentario;
                        /* $respuesta = */
                        $objfechacontrolmodel->AdicionarFechaControl(
                            $parametros
                        );
                    }
                }

                //se procede a crear la relacion padre-hijo
                if ($parametros->eshija == 1) {
                    $idautorelemento = $elementopadre->idusuariocrea;
                    if ($parametros->idusuariocrea == $idautorelemento) {
                        $origen = 0;
                    } else {
                        $origen = 2;
                    }
                    $objelemelem = new DatElementosDatElementos();
                    $objelemelem->idelementopadre = $parametros->idfippadre;
                    $objelemelem->idelementohijo = $datelemento->idelemento;
                    $objelemelem->origen = $origen;
                    $objelemelem->idautor = $parametros->idusuariocrea;
                    $objelemelem->save();
                }

                //se crea el objeto 'nomenclador-elemento' y se registra
                $objelemnom = new DatElementosNomNomencladorModel();
                if ($parametros->idnivel) {
                    /* $elemnomcateg = */
                    $objelemnom->AdicionarRelacionNomElem(
                        $datelemento, $parametros->idnivel, $tiponomenclador = 7
                    );
                }
                if ($parametros->idtipo) {
                    /* $elemnomtipo = */
                    $objelemnom->AdicionarRelacionNomElem(
                        $datelemento, $parametros->idtipo, $tiponomenclador = 4
                    );
                }

                //se crea el objeto 'fip' y se registra
                $datfip = new DatFip();
                $datfip->idfip = $datelemento->idelemento;
                $datfip->fechaemision
                    = $parametros->fechaemision; //adddate($fechainicio);print_r(2);die();
                $datfip->fechacumplimiento
                    = $parametros->fechacumplimiento; //$this->adddate($fechafin);print_r(3);die();
                $datfip->fechacumplio = $parametros->fechacumplio;
                $datfip->numfip = $parametros->numfip;
                $datfip->emite = $parametros->emite;
                $datfip->save();

                if (isset($parametros->documentos[0])) {
                    foreach ($parametros->documentos as $key => $iddocumento) {
                        $objAsociarDoc = new DatElementosDocumento();
                        $objAsociarDoc->idelemento = $datelemento->idelemento;
                        $objAsociarDoc->iddocumento = $iddocumento->id;
                        $objAsociarDoc->save();
                    }
                }

                //se relacionan los involucrados al elemento o fip
                $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
                    $parametros->arrayinvolucrados, $datelemento->idelemento, $parametros->idtipoelemento
                );

                /*self::NotificarCorreo($parametros, 'adicionar');


                $objhisto->denelemento = $parametros->denelemento;
                $objhisto->descelemento = $parametros->descelemento;
                $objhisto->dirigente = '';
                $objhisto->gradocumplimiento = $parametros->gradocumplimiento;
                $objhisto->participante = '';

                $objNotificacion = new CmpnotificacionesModel();
                $accion = 1;
                $idelemento = $datelemento->idelemento;
                $idtipoelemento = 2;
                $idautor = $parametros->idusuariocrea;
                $fecha = date('d/m/Y H:i:s');

                $objcambiohorario->fechainicio = $parametros->fechaemision;
                $objcambiohorario->fechafin = $parametros->fechacumplimiento;*/

                /*$objNotificacion->generarNotificacion(
                    $accion, $idelemento, $idtipoelemento, $idautor, $fecha,
                    $objcambiohorario, $objhisto, ''
                );*/

                if ($parametros->retornar == 1) {
                    return $datfip;
                }
            //}
        }
        return $procede;
    }

    public function NotificarCorreo($parametros, $accion){
          //Envio de notificacion por email
          $emailinvolucrados = array();
          $arrayInvolucrados = array();

          foreach ($parametros->arrayinvolucrados as $involucrado) {
            $arrayInvolucrados[] = $involucrado->idusuario;
          }

          if (isset($arrayInvolucrados[0])) {
            $idpersonas
              = $this->integrator->seguridad->getArrayIdPersonaByArrayUsers(
              $arrayInvolucrados
            );
            if (isset($idpersonas[0])) {
              foreach ($idpersonas as $persona) {
                $datoscontacto
                  = $this->integrator->pvd->obtenerDatosdePersonaparaJabber(
                  $persona['idpersona']
                );
                if (isset($datoscontacto['correoelectronico']) && $datoscontacto['correoelectronico'] != ''
                ) {
                  $emailinvolucrados[]
                    = $datoscontacto['correoelectronico'];
                }
              }
            }
          }

          $parametros->emails = array();
          $emailparticipantes = self::extract_email_address(
            $parametros->participantes
          );
          $emaildirigentes = self::extract_email_address(
            $parametros->dirigentes
          );
          $parametros->emails = array_merge(
            $parametros->emails, $emailparticipantes, $emaildirigentes, $emailinvolucrados
          );
          $parametros->asunto = ($accion=='modificar')?'Modificar FIP':'Nuevo FIP';

          if (count($parametros->emails) > 0)
            self::enviarCorreo($parametros);
    }

    /**
     * Funcion para modificar la Fip
     */
    public function ModificarFip($parametros)
    {
        $existeelemento = Doctrine::getTable('DatElementos')->findByDql(
            "idelemento != {$parametros->idfip} AND idtipoelemento = 2 AND denelemento = '$parametros->denelemento' "
        );
        if ($existeelemento[0]->idelemento) {
            $respuesta = 2;
        } else {
            $objelemento = Doctrine::getTable('DatElementos')->find(
                $parametros->idfip
            );
            if (isset($objelemento->idelemento)) {
                $objelemmodel = new CmpgestionarelementoModel();
                $objelementoo = $objelemmodel->ModificarElemento(
                    $objelemento->idelemento, $parametros->denelemento, $parametros->descelemento, $parametros->gradocumplimiento, $parametros->dirigentes, $parametros->participantes
                );

                $objfip = Doctrine::getTable('DatFip')->find(
                    $parametros->idfip
                );
                $objfip->fechaemision = $parametros->fechaemision;
                $objfip->fechacumplimiento = $parametros->fechacumplimiento;
                $objfip->fechacumplio = $parametros->fechacumplio;
                $objfip->numfip = $parametros->numfip;
                $objfip->emite = $parametros->emite;
                $objfip->save();

                $objCmpgestionarelementomodel = new Cmpgestionarelementomodel();
                //se relacionan los involucrados al elemento o actividad
                $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
                    $parametros->arrayinvolucrados, $parametros->idfip, $parametros->idtipoelemento
                );
                //se eliminan los involucrados al elemento o actividad
                $objCmpgestionarelementomodel->EliminarUsuariosAElementos(
                    $parametros->arrayinvolucradoseliminar, $parametros->idfip, $parametros->idtipoelemento
                );

                //obtengo relacion con nomencladores y modifico
                $objelemnom = new DatElementosNomNomencladorModel();
                if ($parametros->idnivel) {
                    /* / $elemnomcateg = */
                    $objelemnom->ModificarRelacionNomElem(
                        $objelementoo, $parametros->idnivel, $tiponomenclador = 7
                    );
                }
                if ($parametros->idtipo) {
                    /* $elemnomtipo = */
                    $objelemnom->ModificarRelacionNomElem(
                        $objelementoo, $parametros->idtipo, $tiponomenclador = 4
                    );
                }
                if (isset($parametros->documentos[0])) {
                    foreach (
                        $parametros->documentos as /* $key => */
                        $iddocumento
                    ) {
                        $docElem = Doctrine::getTable('DatElementosDocumento')
                            ->findByDql(
                                "idelemento = $parametros->idfip AND iddocumento = '$iddocumento->id'"
                            )->toArray();
                        if (count($docElem) == 0) {
                            $objAsociarDoc = new DatElementosDocumento();
                            $objAsociarDoc->idelemento = $parametros->idfip;
                            $objAsociarDoc->iddocumento = $iddocumento->id;
                            $objAsociarDoc->save();
                        }
                    }
                }
                $respuesta = 1;
            } else {
                $respuesta = 3;
            }
        }
        return $respuesta;
    }

    /**
     * Funcion para eliminar las FIP
     */
    public function EliminarFip($arrayidfips, $idusuariosession)
    {
        foreach ($arrayidfips as $idfip) {
            $noeliminados = 0;
            $respuesta = 1;
            $objelemento = Doctrine::getTable('DatElementos')->find($idfip);
            if (isset($objelemento->idelemento)) {
                $objcmpelementosmodel = new CmpgestionarelementoModel();
                $datelementosDatElementos = new DatElementosDatElementos();
                foreach ($arrayidfips as $idfip) {
                    $descendencia
                        = $datelementosDatElementos->BuscarDescendenciaDelElemento(
                        $idfip, array(0 => array('idtipoelemento' => 2)), array(0 => array('origen' => 0)), $idusuariosession
                    );
                    $descendencia[] = $idfip;
                    $objcmpelementosmodel->EliminarElementos($descendencia);
                    if (count($descendencia) > 1) {
                        $noeliminados += count($descendencia);
                    }
                }
            } else {
                $noeliminados++;
            }
        }
        if ($noeliminados > 0 && $noeliminados == count($arrayidfips)) {
            $respuesta = 0;
        }
        return $respuesta;
    }

    /*
     * Devuelve la cantidad de FIP por tipos para las graficas
     * */

    public function cargarTipoFIP($parametros)
    {
        $objDatFip = new DatFip();
        $arrayTiposFip = $objDatFip->tiposFip($parametros);
        $total = 0;
        $cont = 0;
        $parametros->cumpl = 0;
        foreach ($arrayTiposFip as $key => $value) {
            $parametros->idnomenclador = $value['idnomenclador'];
            $cantFipPorTipo = $objDatFip->cantFipPorTipo($parametros);
            if ($cantFipPorTipo[0] > 0) {
                $data[$cont]['name'] = $value['dennomenclador'];
                $data[$cont]['y'] = $cantFipPorTipo[0];
                $data[$cont]['cant'] = $cantFipPorTipo[0];
                $total += $cantFipPorTipo[0];
                if ($parametros->cumplimiento == 1) {
                    $parametros->cumpl = 1;
                    $sumaPorciento = $objDatFip->cantFipPorTipo($parametros);
                    $parametros->cumpl = 0;
                    $data[$cont]['y'] = round(
                        $sumaPorciento[0] / $cantFipPorTipo[0], 2
                    );
                }
                $cont++;
            }
        }
        if ($parametros->cumplimiento == 0) {
            foreach ($data as $key => $valor) {
                $data[$key]['y'] = round(($valor['y'] * 100) / $total, 2);
            }
        }
        return $data;
    }

    /*
     * Devuelve el cumplimiento de los FIPs
     * */

    public function cargarCumplFip($parametros)
    {
        $objDatFip = new DatFip();
        $parametros->cumpl = 100;
        $cumplidos = $objDatFip->cumplFip($parametros);
        $parametros->cumpl = 0;
        $incumplidos = $objDatFip->cumplFip($parametros);
        $parCumplidos = $objDatFip->parCumplFip($parametros);
        $total = $cumplidos[0] + $incumplidos[0] + $parCumplidos[0];
        $pCumplidos = ($cumplidos[0] * 100) / $total;
        $pIncumplidos = ($incumplidos[0] * 100) / $total;
        $pParCumplidos = ($parCumplidos[0] * 100) / $total;
        $data = Array(
            array(
                "name" => 'Cumplidas',
                "y" => $pCumplidos,
                "color" => '#72D572',
                "cant" => $cumplidos[0]
            ), array(
                "name" => 'Parcialmente cumplidas',
                "y" => $pParCumplidos,
                "color" => '#F9E58B',
                "cant" => $parCumplidos[0]
            ), array(
                "name" => 'Incumplidas',
                "y" => $pIncumplidos,
                "color" => '#FF5261',
                "cant" => $incumplidos[0]
            )
        );
        if ($parametros->cumplimiento == 0) {
            $atrazados = $objDatFip->atrazoFip($parametros);
            $enTiempo = $objDatFip->enTiempo($parametros);
            $data = Array(
                array(
                    "name" => 'En tiempo',
                    "y" => $enTiempo[0],
                    "color" => '#72D572'
                ), array(
                    "name" => 'Atrazados',
                    "y" => $atrazados[0],
                    "color" => '#FF5261'
                )
            );
        }
        return $data;
    }

}
