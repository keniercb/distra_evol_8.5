<?php

/**
 * PlanificacionSoapService
 *
 * @package PlanificacionSoapService.
 * @copyright XETID Cuba
 * @author
 * @version 1.0-0
 */
class PlanificacionSoapService
{

    function _construct()
    {

    }

  function cargarNotificaciones($contenido)
  {
    $info=json_decode($contenido);
    $noleidas = false;
    $start = $info->start;
    $limit = $info->limit;
    $asunto='';
    $idaccion='';

    $arraytipoelem=[];
    $fecha='';
    $autores=[];

    $idusuario=$info->idusuario;
    $involucrado = new DatInvolucrados();
    $usuariorelacionado = $involucrado->dameInvolucradosDadoIdUsuario(
      $idusuario
    );

    $idusuariorelacionado = $usuariorelacionado[0]['idinvolucrado'];
    $objNotificacionesModel = new CmpnotificacionesModel();
    $result = $objNotificacionesModel->cargarNotificaciones(
      $idusuario, $idusuariorelacionado, $asunto, $idaccion,
      $arraytipoelem, $fecha, $autores, $limit, $start, $noleidas
    );

    return json_encode(
        array('success' => true, 'cantidad_total' => $result['total'], 'notificaciones' => $result['datos'])
      );

  }

  function cargarContratos($contenido)
  {
    $info=json_decode($contenido);

    $start = $info->start;
    $limit = $info->limit;

    $dm = Doctrine_Manager::getInstance();
    $conn = $dm->getCurrentConnection();
    $sql = " SELECT 
                   c.*, e.nombre as denestado, s.denominacion as densector
                  FROM mod_crmcontratacion.dat_contrato c
                  INNER JOIN mod_crmcontratacion.nom_estado e
                  ON c.idestado=e.idestado   
                  INNER JOIN mod_crmcontratacion.nom_sector s
                  ON c.idsector=s.idsector
                     ";

    $resnopag = $conn->execute($sql);
    $resultnopag = $resnopag->fetchAll();
    $total = count($resultnopag);

    $sql.=" OFFSET( " . $start . " ) LIMIT( " . $limit . " ) ";

    $info_contratos = $conn->fetchAll($sql);

    return json_encode(
      array('success' => true, 'cantidad_total' => $total, 'contratos' =>$info_contratos)
    );

  }




  /**
  Metodo para verificar credenciales
   **/

  public function autenticarUsuario($contenido)
  {
    $info=json_decode($contenido);
    $user=$info->user;
    $pass=$info->pass;
    $autenticado=0;
    $info_usuario=array();
    if(self::verificarUsuario($user, $pass,$info_usuario)){
      $autenticado=1;
    }
    return json_encode(array('autenticado' => $autenticado, 'nombreusuario'=>$info_usuario[0]['nombreusuario'],
                             'idusuario' => $info_usuario[0]['idusuario'],
                             'iddominio' => $info_usuario[0]['iddominio']
                       ));
  }

  /**
  Metodo para enviar sugerencias
   **/

  public function enviarSugerencia($contenido)
  {
    $info=json_decode($contenido);
    $parametros->idusuario=$info->idusuario;
    $parametros->nombreusuario=$info->nombreusuario;
    $parametros->problema=($info->problema=="1")?1:0;
    $parametros->denominacion=$info->denominacion;
    $parametros->asunto=($parametros->problema==1)?"Problema":"Sugerencia";

    $enviado=0;
    if(CmpgestionaractividadesModel::enviarSugerencia($parametros)){
      $enviado=1;
    }
    return json_encode(array('enviado' => $enviado));
  }

  public function cargarFips($contenido)
  {

    // return json_encode(array('total' => 0, 'resultado' => []));

    $info=json_decode($contenido);

    $parametros=new stdClass();
    $parametros->servicioweb = 1;
    $parametros->usuario = $info->user;

    $parametros->start = (property_exists ( $info ,  "start" ))?$info->start:0;
    $parametros->limit = (property_exists ( $info ,  "limit" ))?$info->limit:5000;




    $array_f_i=($info->finicio != '') ? explode("/",$info->finicio):[];
    $finicio='';
    if(count($array_f_i)==3){
      $finicio=$array_f_i[2]."-".$array_f_i[1]."-".$array_f_i[0]." 00:00:00";
    }

    $array_f_f=($info->ffin != '') ? explode("/",$info->ffin):[];
    $ffin='';
    if(count($array_f_f)==3){
      $ffin=$array_f_f[2]."-".$array_f_f[1]."-".$array_f_f[0]." 00:00:00";
    }

    $parametros->fechainicio = ($finicio != '') ? $finicio : date('Y'). '-01-01 00:00:00';
    $parametros->fechafin = ($ffin != '') ? $ffin :  date('Y').'-12-31 00:00:00';

    $filtros=[];
    $filtros[0][field]="fechainicio";
    $filtros[0][data][type]="date";
    $filtros[0][data][comparison]=	"gt";
    $filtros[0][data][value]=	$parametros->fechainicio;

    $filtros[1][field]="fechafin";
    $filtros[1][data][type]="date";
    $filtros[1][data][comparison]="lt";
    $filtros[1][data][value]=$parametros->fechafin;

    $parametros->arrayautores = [];
    $parametros->arraycategoriasact = [];
    $parametros->arraytipoact = [];
    $parametros->personal = 1;
    $parametros->busqueda = 0;
    $parametros->idcalendario = '';
    $parametros->arrayelementostributa = [];

    $arrayinvolucrados = [];
    $reorganizar = [];

    try {

      $parametros->idusuariosession = CmpgestionaractividadesModel::getIdUsuario($parametros);

      /***
        Solamente los fips creados por el usuario
       ***/
//      $autor=new stdClass();

//      if (!isset($parametros->arrayautores[0])) {
//        $autor->idautor = $parametros->idusuariosession;
//        $parametros->arrayautores[0] = $autor;
//      }

      $objfipmodel = new CmpgestionarfipModel();
      $response = $objfipmodel->CargarFips(
        null, $parametros->idusuariosession, null, $parametros->arrayautores,
        $arrayinvolucrados, "", null, $parametros->start, $parametros->limit,
        "", $filtros, $reorganizar
      );

      return json_encode($response);
    } catch (Doctrine_Exception $e) {
      return json_encode(array('total' => -1, 'resultado' => []));
    }
  }

	
 
    public function obtenerActividades($contenido)
    {

     // return json_encode(array('total' => 0, 'resultado' => []));

		    $info=json_decode($contenido);
        $parametros = new stdClass();
        $parametros->servicioweb = 1;
        $parametros->usuario = $info->user;
        $chequeo=0;

        $parray['fechainicio'] = ($info->finicio != '') ? $info->finicio : '01/01/' . date('Y');
        $parray['fechafin'] = ($info->ffin != '') ? $info->ffin : '31/12/' . date('Y');

        $parametros->fechainicio = '/' . $info->finicio . '/';
        $parametros->fechafin = '/' . $info->ffin . '/';

//        $parametros->fechainicio = '01/02/'. date('Y');
//        $parametros->fechafin = '28/02/'. date('Y');
        $parametros->arrayautores = [];
        $parametros->arraycategoriasact = [];
        $parametros->arraytipoact = [];
        $parametros->personal = 1;
        $parametros->busqueda = 0;
        $parametros->idcalendario = '';
        $parametros->arrayelementostributa = [];

        if(property_exists ( $info ,  "start" )){
          $chequeo = 1;
          $parametros->start = $info->start;
          $parametros->limit = $info->limit;
        }

        if(property_exists ( $info ,  "car" )){
          $parametros->car = $info->car;
        }

        if(property_exists ( $info ,  "den" )){
          $parametros->den = $info->den;
        }

//        return json_encode('01/01/'. date('Y'));die;

//        if (self::verificarUsuarioLdap($info->user, $info->pass)) {
            try {
                //si el usuario se autentica contra LDAP obtengo si ID
                $parametros->idusuariosession = CmpgestionaractividadesModel::getIdUsuario($parametros);

                if (!isset($parametros->arrayautores[0])) {
                    $autor->idautor = $parametros->idusuariosession;
                    $parametros->arrayautores[0] = $autor;
                }

                $respuesta = CmpcalendarionuevoModel::CargarElCalendario($parametros);

                $response = array();
                $contact = 0;
                foreach ($respuesta as $actividad) {
                  if($chequeo==1 && $actividad['gradocump']<100){
                    $response[$contact]=$actividad;
                    $contact++;
                  }else if($chequeo==0){
                    $response[$contact]=$actividad;
                    $contact++;
                  }
                }

                $aux = array();
                $aux['total'] = count($response);
                if($chequeo==1){
                  $aux['resultado'] = array_slice($response, $parametros->start, $parametros->limit);
                }else{
                  $aux['resultado'] = $response;
                }
                return json_encode($aux);
            } catch (Doctrine_Exception $e) {
              return json_encode(array('total' => -1, 'resultado' => []));
            }

//        } else {
//            return json_encode(array('total' => -1, 'resultado' => []));
//        }
    }

    public function verificarUsuarioLdap_old($user, $pass, $ldap)
    {

        $host = ($ldap == '') ? 'ldap://10.12.0.3' : $ldap; // nombre del host o servidor LDAP
        $port = 389; // puerto del LDAP en el servidor
        $dn = 'uid=' . $user . ',cn=users,cn=accounts,dc=xetid,dc=cu'; // modificar respecto a los valores del LDAP
        $ldap['base'] = ' ';

        // conexion a ldap
        $conn = ldap_connect($host, $port);
        ldap_set_option($conn, LDAP_OPT_PROTOCOL_VERSION, 3);

        // match de usuario y password
        $bind = ldap_bind($conn, $dn, $pass);

        if ($bind) {
            return true;
        } else if ($host != 'ldap://10.12.0.4') {
            return $this->verificarUsuarioLdap($user, $pass, 'ldap://10.12.0.4');
        } else {
            return false;
        }

    }
	
	  public function verificarUsuarioLdap($usuario, $pass)
    {
        //$passs = md5($pass);
        $respuesta = true;
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $sql = "SELECT su.idusuario, su.nombreusuario
            FROM mod_seguridad.seg_usuario su
               WHERE su.nombreusuario = '$usuario' 
		          AND su.contrasenna = (Select md5('$pass'))  
         		AND su.activo = true;";
        $r = $conn->fetchAll($sql);
        if($r[0]['nombreusuario'] == $usuario){
            return true;
        } else {
            return false;
        }
    }

    public function getIdusuarios($contenido)
    {
        $info=json_decode($contenido);
        $nombreusuarios = "";
        foreach ($info as $value){
          $nombreusuarios .= ($nombreusuarios=="")? "'".$value."'":", '".$value."'";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $sql = "SELECT su.idusuario, su.nombreusuario
            FROM mod_seguridad.seg_usuario su
               WHERE su.nombreusuario in ({$nombreusuarios})";

        $r = $conn->fetchAll($sql);

        $array_id= array();
        foreach ($r as $value)
            array_push($array_id, $value['idusuario']);

        return json_encode($array_id);
    }

    public function getActividadesBienestar($contenido)
    {
        $idusuariocrea=json_decode($contenido);
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $sql = "SELECT 
                      a.*,
                      e.*
                    FROM mod_objetivos.dat_actividades as a
                    INNER JOIN mod_objetivos.dat_elementos as e
                    ON a.idactividad = e.idelemento
                    
                    WHERE a.numcaso IS NOT NULL AND 
                          e.idusuariocrea = {$idusuariocrea} ";

        $r = $conn->fetchAll($sql);
        return json_encode($r);
    }

    public function adicionarActividad($contenido)
    {
        $info=json_decode($contenido);
        $parametros->servicioweb = 1;
        $parametros->usuario = $info->user;

        $parray['fechainicio'] = ($info->finicio != '') ? $info->finicio : '01/01/' . date('Y');
        $parray['fechafin'] = ($info->ffin != '') ? $info->ffin : '31/12/' . date('Y');

        $parametros->fechainicio = '/' . $info->finicio . '/';
        $parametros->fechafin = '/' . $info->ffin . '/';

//        $parametros->fechainicio = '01/02/'. date('Y');
//        $parametros->fechafin = '28/02/'. date('Y');
        $parametros->arrayautores = [];
        $parametros->arraycategoriasact = [];
        $parametros->arraytipoact = [];
        $parametros->personal = 1;
        $parametros->busqueda = 0;
        $parametros->idcalendario = '';
        $parametros->arrayelementostributa = [];


//        if (self::verificarUsuarioLdap($info->user, $info->pass)) {
            try {
                $response=-1;
                $integrator = ZendExt_IoC::getInstance();
                $arrayActividades=json_decode($info->actividades);
                $infouser->usuario=$info->user;
                $idusuario = CmpgestionaractividadesModel::getIdUsuario($infouser);

                $denominacion=$info->user;

                $arrayidpersona
                    = $integrator->seguridad->getIdPersonaByIdUsuario(
                    $idusuario
                );

                $idpersona = $arrayidpersona[0]['idpersona'];

                $datosautor=
                    $integrator->pvd->getPrincipalesDatosPersona(
                        $params[] = $idpersona
                    );
                if (isset($datosautor->data[0])) {
                    $denominacion
                        = ($datosautor->data[0]['nombreapellidos']);
                }

                $yo = new stdClass();
                $yo->idinvolucrado =$idusuario;
                $yo->llaveinvolucrado =$idusuario;
                $yo->denominacion =$denominacion;
                $yo->idusuario =$idusuario;
                $yo->idgrupo =null;
                $yo->tipo =1;
                $yo->nombretipo='Usuario';
                $yo->tipoinvol=1;
                $yo->idtipoinvolucrado=null;

                $actividad->arrayinvolucrados[0]=$yo;
                $arrayidInvolucrados=json_decode($info->idInvolucrados);
                $cantInvolucrados=1;
                foreach ($arrayidInvolucrados as $value){
                  if($idusuario!=$value){
                    $inv = new stdClass();
                    $inv->idinvolucrado =$value;
                    $inv->llaveinvolucrado =$value;
                    $inv->denominacion ="";
                    $inv->idusuario =$value;
                    $inv->idgrupo =null;
                    $inv->tipo =1;
                    $inv->nombretipo='Usuario';
                    $inv->tipoinvol=1;
                    $inv->idtipoinvolucrado=null;
                    $actividad->arrayinvolucrados[$cantInvolucrados++]=$inv;
                  }
                }

                $actividad->eshija=0;
                $actividad->idpersona=$idpersona;
                $actividad->peso=1;
                $actividad->idsubsistema=1;
                $actividad->autoManual=0;
                $actividad->duplicando=0;
                $actividad->accion='';
                $actividad->idcategoria='';
                $actividad->idactividadpadre='';
                $actividad->porcientoRe=0;
                $actividad->idactividad=0;
//                $actividad->duracion=24;
                $actividad->tiempoestimado=0;
                $actividad->denomcategoria='';
                $actividad->idtipo='';
                $actividad->dirigentes='';
                $actividad->emails=$info->user.'@xetid.cu';
                $actividad->denomtipo='';
                $actividad->criterioeval='NE';
                $actividad->participantes='';
                $actividad->idusuariocrea=$idusuario;
                $actividad->idusuariosession=$idusuario;
                $actividad->idautoractividad=$idusuario;
                $actividad->arrayinvolucradoseliminar=[];
                $actividad->arrayelementosrelacionados=[];
                $actividad->idrecursoasociado=[];
                $actividad->arrayrepeticiones=[];
                $actividad->documentos=[];
                foreach ($arrayActividades as $relacion) {

                    $actividad->denelemento=$relacion->title;
                    $actividad->descelemento=$relacion->description;
                    $actividad->idtipoelemento=3;
                    $actividad->fechainicio=explode(' ', $relacion->start)[0];
                    $actividad->fechafin=explode(' ', $relacion->end)[0];
//                    $actividad->horainicio=explode(' ', $relacion->start)[1];
//                    $actividad->horafin=explode(' ', $relacion->end)[1];
                    $actividad->horainicio=$relacion->hora_inicio;
                    $actividad->horafin=$relacion->hora_final;
                    $actividad->gradocumplimiento=$relacion->porc_cumplimiento;
                    $actividad->principal=($relacion->principal=="1")?1:0;
                    $actividad->lugar=$relacion->lugar;
                    $actividad->dirigentes=$relacion->dirigentes;
                    $actividad->participantes=$relacion->participantes;

                    /***
                        Adicionado desde bienestar...
                     **/
                    if(property_exists ( $relacion ,  "numcaso" )){
                      $actividad->numcaso=$relacion->numcaso;
                    }

                    $response = CmpgestionaractividadesModel::crearActividadPorServicio($actividad);

                    if(property_exists ( $relacion ,  "numcaso" )){
                        $parametros->car = $response->idactividad;
                    }
				
                }


            $parametros->idusuariosession = CmpgestionaractividadesModel::getIdUsuario($parametros);

                if (!isset($parametros->arrayautores[0])) {
                    $autor->idautor = $parametros->idusuariosession;
                    $parametros->arrayautores[0] = $autor;
                }

                $response = CmpcalendarionuevoModel::CargarElCalendario($parametros);
                $aux = array();
                $aux['total'] = count($response);
                $aux['resultado'] = $response;
                return json_encode($aux);

            } catch (Doctrine_Exception $e) {
                $response= $e->getMessage().'-------'.$e->getTraceAsString();
                return json_encode(array('total' => -1, 'resultado' => []));
            }

//        }
//        else {
//                return json_encode(array('total' => -1, 'resultado' => []));
//        }

        return $response;
    }


    /***********
       Metodo para actualizar cumplimiento
     ***********/

  public function actualizarCumplimiento($contenido)
  {
    $info=json_decode($contenido);
    $idusuario=$info->idusuario;
    $arrayparametros->cumplimiento = ($info->cumplimiento!=null) ? (int) $info->cumplimiento : 100;
    $datosactividad = json_decode(
      stripslashes($info->arrayidtareas)
    );

    $arrayparametros->arrayidelementos=array();
    $pos=0;
    foreach ($datosactividad as $key => $elemento){
      $arrayparametros->arrayidelementos[$pos]=$elemento->id;
      $pos++;
    }

    $arrayparametros->metodo = $info->metodo;
    $objelementomodel = new CmpgestionarelementoModel();
    $respuesta = $objelementomodel->actualizarCumplimiento(
      $arrayparametros
    );
    Doctrine_Manager::getInstance()->getCurrentConnection()->commit();

    return json_encode(
      array('respuesta' => $respuesta)
    );
  }


  /***
      Metodo para cargar involucrados
   **/

  public function cargarclasificadorinvol($contenido)
  {
    $info=json_decode($contenido);
    $nodo = $info->node;
    $idusuario =$info->idusuario;
    $idelemento = undefined;
    $tipo = $info->tipo;
    $idgrupo = $info->idgrupo;
    $estamodificando = 0;
    $tipoelemento = 3;
    $certificado = null;
    $iddominio =$info->iddominio;
    $idautor = $idusuario;

    $integrator = ZendExt_IoC_Inter::getInstance();

//        print_r($idgrupo);die;
    switch ($idgrupo) {
      case 'nodo1':
        $usuario
          = $integrator->configuracionpdo->DameInvolucradosAdicionar(
          $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
          $estamodificando, $tipoelemento, $iddominio, $certificado,
          $idautor
        );
        return json_encode($usuario);
        break;
      case 'nodo2':
        if ($tipoelemento == 'desviacion' && $estamodificando == 1) {
          $arraygrupos
                          = $integrator->configuracionpdo->DameInvolucradosAdicionar(
            $nodo, $idusuario, $idelemento, $tipo, $idgrupo, 0,
            $tipoelemento, $iddominio, $certificado, $idautor
          );
          $objclasifmodel = new ClasificadorinvolModel();
          $arraygrupos
                          = $objclasifmodel->ObtenerPublicadosParaCargarArbolInvol(
            $idelemento, $arraygrupos
          );
          if ($arraygrupos) {
            return json_encode($arraygrupos);
          }
          if (!$arraygrupos) {
            $this->showMessage(
              'Usted no tiene grupos gestionados.'
            );
          }
        } else {
          if ($tipoelemento == 'incidencia'
            && $estamodificando == 1
          ) {
            $arraygrupos
                            = $integrator->configuracionpdo->DameInvolucradosAdicionar(
              $nodo, $idusuario, $idelemento, $tipo, $idgrupo, 0,
              $tipoelemento, $iddominio, $certificado, $idautor
            );
            $objclasifmodel = new ClasificadorinvolModel();
            $arraygruposs
                            = $objclasifmodel->ObtenerIncidenciaPublicadaGrupo(
              $idelemento, $arraygrupos
            );
            if ($arraygruposs) {
              return json_encode($arraygruposs);
            }
            if (!$arraygruposs) {
              $this->showMessage(
                'Usted no tiene grupos gestionados.'
              );
            }
          } else {
            $arraygrupos
              = $integrator->configuracionpdo->DameInvolucradosAdicionar(
              $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
              $estamodificando, $tipoelemento, $iddominio,
              $certificado, $idautor
            );
            if ($arraygrupos) {
              return json_encode($arraygrupos);
            }
            if (!$arraygrupos) {
              $this->showMessage(
                'Usted no tiene grupos gestionados.'
              );
            }
          }
        }
        break;
      case 'nodo3':
        if ($tipoelemento == 'desviacion' && $estamodificando == 1) {
          $usersdomain
                          = $integrator->configuracionpdo->DameInvolucradosAdicionar(
            $nodo, $idusuario, $idelemento, $tipo, $idgrupo, 0,
            $tipoelemento, $iddominio, $certificado, $idautor
          );
          $objclasifmodel = new ClasificadorinvolModel();
          $usersdomain
                          = $objclasifmodel->ObtenerPublicadosParaCargarArbolInvol(
            $idelemento, $usersdomain
          );
          if ($usersdomain) {
            return json_encode($usersdomain);
          }
          if (!$usersdomain) {
            $this->showMessage(
              'Usted no tiene usuarios subordinados.'
            );
          }
        } else {
          if ($tipoelemento == 'incidencia'
            && $estamodificando == 1
          ) {
            $arraygrupos
                            = $integrator->configuracionpdo->DameInvolucradosAdicionar(
              $nodo, $idusuario, $idelemento, $tipo, $idgrupo, 0,
              $tipoelemento, $iddominio, $certificado, $idautor
            );
            $objclasifmodel = new ClasificadorinvolModel();
            $arraygruposs
                            = $objclasifmodel->ObtenerIncidenciaPublicadaUsuario(
              $idelemento, $arraygrupos
            );
            if ($arraygruposs) {
              return json_encode($arraygruposs);
            }
            if (!$arraygruposs) {
              $this->showMessage(
                'Usted no tiene usuarios subordinados.'
              );
            }
          } else {
            $usersdomain
              = $integrator->configuracionpdo->DameInvolucradosAdicionar(
              $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
              $estamodificando, $tipoelemento, $iddominio,
              $certificado, $idautor
            );
            if ($usersdomain) {
              return json_encode($usersdomain);
            }
            if (!$usersdomain) {
              $this->showMessage(
                'Usted no tiene usuarios subordinados.'
              );
            }
          }
        }
        break;
      case 'nodo4':
        $otros
          = $integrator->configuracionpdo->DameInvolucradosAdicionar(
          $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
          $estamodificando, $tipoelemento, $iddominio, $certificado,
          $idautor
        );
        if ($otros) {
          return json_encode($otros);
        }
        if (!$otros) {
          $this->showMessage(
            'Usted no posee permisos otorgados por el nivel superior para adicionar.'
          );
        }
        break;
      case 'nodo5':
        if ($tipoelemento == 'desviacion' && $estamodificando == 1) {
          $estructuras
                          = $integrator->configuracionpdo->DameEstructurasRelacionadasbyIduser(
            $idusuario
          );
          $objclasifmodel = new ClasificadorinvolModel();
          $estructuras
                          = $objclasifmodel->ObtenerPublicadosParaCargarArbolInvol(
            $idelemento, $estructuras
          );
          if ($estructuras) {
            return json_encode($estructuras);
          }
          if (!$estructuras) {
            $this->showMessage(
              'Usted no tiene estructuras que mostrar.'
            );
          }
        } else {
          if ($tipoelemento == 'incidencia'
            && $estamodificando == 1
          ) {
            $arraygrupos
                            = $integrator->configuracionpdo->DameEstructurasRelacionadasbyIduser(
              $idusuario
            );
            $objclasifmodel = new ClasificadorinvolModel();
            $arraygruposs
                            = $objclasifmodel->ObtenerIncidenciaPublicadaEstructura(
              $idelemento, $arraygrupos
            );
            if ($arraygruposs) {
              return json_encode($arraygruposs);
            }
            if (!$arraygruposs) {
              $this->showMessage(
                'Usted no tiene estructuras que mostrar.'
              );
            }
          } else {
            $estructuras
              = $integrator->configuracionpdo->DameEstructurasRelacionadasbyIduser(
              $idusuario
            );
            if ($estructuras) {
              return json_encode($estructuras);
            }
            if (!$estructuras) {
              $this->showMessage(
                'Usted no tiene estructuras que mostrar.'
              );
            }
          }
        }
        break;
      default:
        $usersandgrupos
          = $integrator->configuracionpdo->DameInvolucradosAdicionar(
          $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
          $estamodificando, $tipoelemento, $iddominio, $certificado,
          $idautor
        );
        return json_encode($usersandgrupos);
    }
  }

  public function asociarInvolucradosAdicionando($info)
  {
    $idusuario=$info->idusuario;
    $parametros=new stdClass();
    $parametros->arrayactividadesseleccionadas[0] = $info->idelemento;
    $arrayinvolucrados = [];
    $idinvolucrados=json_decode(
      stripslashes($info->idinvolucrados)
    );

    foreach ($idinvolucrados as $id){
      $actual=new stdClass();
      $actual->idinvolucrado=$id;
      $actual->llaveinvolucrado=$id;
      $actual->tipo=1;
      $actual->tipoinvol=1;
      $actual->idusuario=$id;
      $arrayinvolucrados[]=$actual;
    }

    $parametros->arrayinvolucrados=$arrayinvolucrados;

    if (isset($parametros->arrayinvolucrados[0]) && isset($parametros->arrayactividadesseleccionadas[0])
    ) {
      $actvSinModificar = 0;
      $actvModificada = 0;
      $objelemento = Doctrine::getTable('DatElementos')->find(
        $info->idelemento
      );
      if (isset($objelemento->idelemento)) {
        //Verificar permisos para modificar actividad
        $idautoractividad = $idusuario;
        $idusuariosession = $idusuario;
        $parametros->idautoractividad = $idautoractividad;
        $parametros->idusuariosession
          =$idusuariosession;
        $permisos = $this->comprobarPermisos(
          $parametros
        );
        if ($permisos['modificar'] == 0) {
          $actvSinModificar = 1;
        } else {
          $objCmpgestionarelementomodel
            = new CmpgestionarelementoModel();
          $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
            $arrayinvolucrados, $objelemento->idelemento, $objelemento->idtipoelemento
          );
          Doctrine_Manager::getInstance()->getCurrentConnection()->commit();
          $actvModificada++;
        }
      }

      if (!$actvSinModificar) {
        ($actvModificada > 0) ? $respuesta = 1 : $respuesta = 0;
      } else {
        ($actvModificada > 0) ? (($actvModificada > 1) ? $respuesta = 2 : $respuesta = 3) : $respuesta = 4;
      }



      return $respuesta;
    } else {
      return 0;
    }
  }


public function asociarInvolucrados($contenido)
  {

    $info=json_decode($contenido);
    $idusuario=$info->idusuario;
    $parametros=new stdClass();
    $parametros->arrayactividadesseleccionadas[0] = $info->idelemento;
    $arrayinvolucrados = [];
    $idinvolucrados=json_decode(
      stripslashes($info->idinvolucrados)
    );

    foreach ($idinvolucrados as $id){
      $actual=new stdClass();
      $actual->idinvolucrado=$id;
      $actual->llaveinvolucrado=$id;
      $actual->tipo=1;
      $actual->tipoinvol=1;
      $actual->idusuario=$id;
      $arrayinvolucrados[]=$actual;
    }

    $parametros->arrayinvolucrados=$arrayinvolucrados;

    if (isset($parametros->arrayinvolucrados[0]) && isset($parametros->arrayactividadesseleccionadas[0])
    ) {
      $actvSinModificar = 0;
      $actvModificada = 0;
        $objelemento = Doctrine::getTable('DatElementos')->find(
          $info->idelemento
        );
        if (isset($objelemento->idelemento)) {
          //Verificar permisos para modificar actividad
          $idautoractividad = $idusuario;
          $idusuariosession = $idusuario;
          $parametros->idautoractividad = $idautoractividad;
          $parametros->idusuariosession
            =$idusuariosession;
          $permisos = $this->comprobarPermisos(
            $parametros
          );
          if ($permisos['modificar'] == 0) {
            $actvSinModificar = 1;
          } else {
            $objCmpgestionarelementomodel
              = new CmpgestionarelementoModel();
            $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
              $arrayinvolucrados, $objelemento->idelemento, $objelemento->idtipoelemento
            );
            Doctrine_Manager::getInstance()->getCurrentConnection()->commit();
            $actvModificada++;
          }
        }

      if (!$actvSinModificar) {
        ($actvModificada > 0) ? $respuesta = 1 : $respuesta = 0;
      } else {
        ($actvModificada > 0) ? (($actvModificada > 1) ? $respuesta = 2 : $respuesta = 3) : $respuesta = 4;
      }



      return json_encode(array('mensaje' => $respuesta));
    } else {
      $respuesta = 0;
      return json_encode(array('mensaje' => $respuesta));
    }
  }

  public function adicionarAcuerdo($contenido)
  {
    $info=json_decode($contenido);

    $parametros=new stdClass();
    $parametros->idusuariocrea = $info->idusuario;

    $acuerdos=json_decode(
      stripslashes($info->acuerdos)
    );

    $parametros->idpersona =CmpgestionaractividadesModel::getIdPersona($info->idusuario);

    $parametros->denelemento = $acuerdos->denominacion;
    $parametros->descelemento =  $acuerdos->descripcion;
    if ($acuerdos->porc_cumplimiento == "") {
       $parametros->gradocumplimiento = 0;
    } else {
      $parametros->gradocumplimiento
        = $acuerdos->porc_cumplimiento * 1;
    }
    $parametros->fechaemision = $acuerdos->fechainicio;
    $parametros->fechacumplimiento = $acuerdos->fechafin;
    $parametros->fechacumplio = null;

    $parametros->idtipo = "";
    $parametros->idnivel = "";
    $parametros->dirigentes = $acuerdos->dirigentes;
    $parametros->participantes = $acuerdos->participantes;
    $parametros->emite = $acuerdos->emite;
    $parametros->arrayinvolucrados = [];
    $parametros->arrayfechascontrol = [];
    $parametros->idtipoelemento = 2;
    $parametros->eshija = 0;
    $parametros->idfippadre = "";
    $parametros->numfip = $acuerdos->documento;
    $parametros->documentos = [];
    $parametros->retornar=1;
    $objcmpgestionarfipesmodel = new CmpgestionarfipModel();
    $objetoFip = $objcmpgestionarfipesmodel->AdicionarFip($parametros);
    $info->idelemento=$objetoFip->idfip;
    $respuesta=$this->asociarInvolucradosAdicionando($info);
    Doctrine_Manager::getInstance()->getCurrentConnection()->commit();
    return json_encode(array('mensaje' => $respuesta));
  }


  public function comprobarPermisos($parametros)
  {
    $idautoractividad = $parametros->idautoractividad;
    $idusuariosession = $parametros->idusuariosession;
    $respuesta = [];
    $integrator = ZendExt_IoC_Inter::getInstance();
    if ($idautoractividad != $idusuariosession) {
      $superior = 1;
      $arraypermisos
                = $integrator->configuracionpdo->TienePermisoParaSobre(
        $idusuariosession, $idautoractividad
      );
      if (isset($arraypermisos[0])) {
        $annadir = $arraypermisos[1];
        $modificar = $arraypermisos[2];
        $eliminar = $arraypermisos[3];
        if ($modificar || $eliminar) {
          $respuesta = $this->comprobarPermisosWorkflow(
            $parametros->idactividad, $idusuariosession
          );
          if ($modificar) {
            $modificar = $respuesta['modificar'];
          }
          if ($eliminar) {
            $eliminar = $respuesta['eliminar'];
          }
        }
        $respuesta['modificar'] = $modificar;
        $respuesta['eliminar'] = $eliminar;
      } else {
        $respuesta = $this->comprobarPermisosWorkflow(
          $parametros->idactividad, $idusuariosession
        );
      }
    } else {
      $respuesta = $this->comprobarPermisosWorkflow(
        $parametros->idactividad, $idusuariosession
      );
    }
    return $respuesta;
  }

  public
  function comprobarPermisosWorkflow($idelemento, $idusuariosession)
  {
    $integrator = ZendExt_IoC_Inter::getInstance();
    $objElemento = Doctrine::getTable('DatElementos')->find(
      $idelemento
    );
    if (isset($objElemento->idelemento)) {
      $arraypermisos
        = $integrator->workflow->obtenerPermisosPostAccion(
        $idusuariosession, $objElemento->idestadoaprob, $idtipoelemento = 3
      );
      return $arraypermisos;
    } else {
      $arraypermisos['modificar'] = 1;
      $arraypermisos['eliminar'] = 1;
      return $arraypermisos;
    }
  }


    public function verificarUsuario($user, $pass, & $info_usuario)
    {
      $passs = md5($pass);
      $dm = Doctrine_Manager::getInstance();
      $conn = $dm->getCurrentConnection();
      $sql = "SELECT su.idusuario, su.nombreusuario, su.iddominio
          FROM mod_seguridad.seg_usuario su
      WHERE su.nombreusuario = '$user' AND su.contrasenna = '$passs' AND su.activo = true;";
      $info_usuario = $conn->fetchAll($sql);
      if ($info_usuario[0]['nombreusuario'] == $user) {
        return true;
      } else {
        return false;
      }

  }

}
