<?php

/**
 * @author    Alberto Tamayo Ramos y Jany Coto García
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class GestionarNomencladoresController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
    }

    /**
     * Acción para mostrar la vista gestionarnomencladres.phtml
     */
    function gestionarnomencladoresAction()
    {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        //$this->view->jsayuda = $jsayuda;
        $this->render();
    }

    /**
     * @author Jany Coto García
     * Inserta Categoría de la Actividad
     */
    function adicionarCategActividad($idNom)
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $objCatActividad = new NomCategactividad();
        $objCategoriaActividadModel = new NomCategActividadModel();
        if ($this->_request->getPost('color') == null) {
            $color = 'FFFFFF';
        } else {
            $color = $this->_request->getPost('color');
        }
        $objCatActividad->color = $color;
        $objCatActividad->idnomenclador = $idNom;
        $objCategoriaActividadModel->Adicionar($objCatActividad);
        $this->conn->commit();
        $this->conn->beginTransaction();
    }

    /**
     *
     *
     */
    function adicionarTipoHoja($idNom)
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $objTipoHoja = new NomTipohoja();
        $objTipoHojaModel = new NomTipohojaModel();
        $ancho = $this->_request->getPost('ancho');
        $alto = $this->_request->getPost('alto');
        $objTipoHoja->ancho = $ancho;
        $objTipoHoja->alto = $alto;
        $objTipoHoja->idtipohoja = $idNom;
        $objTipoHojaModel->Adicionar($objTipoHoja);
        $this->conn->commit();
        $this->conn->beginTransaction();
    }

    /**
     * @author Jany Coto García
     * Inserta Grupo
     */
    function adicionarGrupo($idNom, /*$publico, */$arrPublicidad)
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        //if ( $publico == '1' ) {
        $arrPublicidad = stripslashes($arrPublicidad);
        $arrPublicidad = json_decode($arrPublicidad);
        if (count($arrPublicidad) != 0) {
            foreach ($arrPublicidad as $arrayPublicidad) {
                $grupoNom = new DatGrupoNomNomenclador();
                $grupoNomModel = new DatGrupoNomNomencladorModel(
                ); //DatGrupoGestionarnomencladoresModel ();
                if ($arrayPublicidad->tipo == '0') {
                    $grupoNom->idnomenclador = $idNom;
                    $grupoNom->idgrupo = $arrayPublicidad->idgrupo;
                    $grupoNomModel->Adicionar($grupoNom);
                    $this->conn->commit();
                    $this->conn->beginTransaction();
                }
            }
        }
        //}
    }

    /**
     * @author Jany Coto García
     * Insertar Grupo de Usuarios
     */
    function adicionarUsuario($idNom, /*$publico, */$arrPublicidad)
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        //if ( $publico == '1' ) {
        $arrPublicidad = stripslashes($arrPublicidad);
        $arrPublicidad = json_decode($arrPublicidad);
        if (count($arrPublicidad != 0)) {
            foreach ($arrPublicidad as $arrayPublicidad) {
                $usuarioNom = new DatUsuarioNomNomenclador();
                $usuarioNomModel = new DatUsuarioGestionarnomencladoresModel();

                if ($arrayPublicidad->tipo == '1') {
                    $idUsuario = $arrayPublicidad->idusuario;
                    //$exiteUsuarioPdo = DatUsuarioPdo::existeUsuario ( $idUsuario );
                    $exiteUsuario = NomNomenclador::existeUsuarioNom(
                        $idUsuario, $idNom
                    );
                    /* if ( !isset($exiteUsuarioPdo[0]) ) {
                      $usuarioPdo = new DatUsuarioPdo ();
                      $usuarioPdoModel = new DatUsuarioPdoModel ();
                      $usuarioPdo->idusuario = $idUsuario;
                      $usuarioPdo->idcargo = null;
                      $usuarioPdo->denusuario = $arrayPublicidadInsertar->text;
                      $usuarioPdoModel->Insertar ( $usuarioPdo );
                      $this->conn->commit();
                      $this->conn->beginTransaction();
                      } */
                    if (!$exiteUsuario) {
                        $usuarioNom->idnomenclador = $idNom;
                        $usuarioNom->idusuario = $arrayPublicidad->idusuario;
                        $usuarioNomModel->Adicionar($usuarioNom);
                        $this->conn->commit();
                        $this->conn->beginTransaction();
                    }
                }
            }
        }
        //}
    }

    public function adicionarCampoActivo($fechaInicio, $fechaFin)
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $activo = 0;
        // Captura la fecha de inicio en la que se activa el nomenclador
        $fechaInicio = explode('/', $fechaInicio);
        $fecInicio
            = $fechaInicio[2] . '-' . $fechaInicio[1] . '-' . $fechaInicio[0];
        // Captura la fecha actual del servidor
        $fechaActual = date('d/m/Y');
        $fechaActual = explode('/', $fechaActual);
        $fecActual
            = $fechaActual[2] . '-' . $fechaActual[1] . '-' . $fechaActual[0];
        if ($fechaFin == null) {
            // Comparara rangos de fecha
            if ($fecInicio > $fecActual) {
                $activo = 0;
            } else {
                $activo = 1;
            }
        } else {
            $fechaFin = explode('/', $fechaFin);
            $fecFin = $fechaFin[2] . '-' . $fechaFin[1] . '-' . $fechaFin[0];
            // Comparara rangos de fecha
            if (($fecActual >= $fecInicio && $fecActual <= $fecFin)
                || ($fecActual == $fecInicio)
                || ($fecActual == $fecFin)
            ) {
                $activo = 1;
            } else {
                $activo = 0;
            }
        }
        return $activo;
    }

    /**
     * @author Alberto Tamayo Ramos y Jany Coto García
     * Acción para adicionar nomencladores segun el tipo que se especifique.
     */
    public function adicionarNomencladorAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->tiponomenclador = $this->_request->getPost('tiponom');
        $parametros->dennomenclador = $this->_request->getPost('denom');
        //$parametros->dennomenclador = json_decode(stripslashes($this->_request->getPost('denom')));        
        $parametros->descnomenclador = $this->_request->getPost('descrip');
        $parametros->fechainicio = $this->_request->getPost('fdesde');
        $parametros->fechafin = $this->_request->getPost('fhasta');
        $parametros->color = $this->_request->getPost('color');
        $parametros->alto = $this->_request->getPost('alto');
        $parametros->ancho = $this->_request->getPost('ancho');
        $parametros->inicial = $this->_request->getPost('inicial');
        $parametros->incidencia = $this->_request->getPost('incidencia');
        $parametros->caduca = $this->_request->getPost('caduca');
        $parametros->publico = $this->_request->getPost('pub');
        $parametros->publicoxtodos = $this->_request->getPost('pubtodos');
        $parametros->idpadre = $this->_request->getPost('idnom');
        $parametros->arraypublicidadinsertar = json_decode(
            stripslashes(
                $this->_request->getPost('arrayinsertar')
            )
        );
        $objnomencladormodel = new GestionarnomencladoresModel();
        $respuesta = $objnomencladormodel->AdicionarNomenclador($parametros);       
        echo json_encode(array('mensaje' => $respuesta));
    }

    public function activarNomenclador($arrayNomen)
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        foreach ($arrayNomen as $key => $arrNomen) {
            $activo = $arrNomen['activo'];
            $idNomen = $arrNomen['idnom'];            
            // Captura la fecha de inicio en la que se activa el nomenclador
            $fechaInicio = $arrayNomen[$key]['fdesde'];
            if ($fechaInicio != null) {
                $fechaInicio = explode('/', $fechaInicio);
                $fecInicio
                    = $fechaInicio[2] . $fechaInicio[1] . $fechaInicio[0];
                // Captura la fecha actual del servidor
                $fechaActual = date('d/m/Y');
                $fechaActual = explode('/', $fechaActual);
                $fecActual = $fechaActual[2] . '-' . $fechaActual[1] . '-'
                    . $fechaActual[0];
                // Compara rangos de fecha
                if ($fecInicio == $fecActual) {
                    $activo = 1;
                    NomNomenclador::cambiarEstado($idNomen, $activo);
                }
            }
        }
    }

    public function desactivarNomenclador($arrayNomen)
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        // Captura la fecha actual del servidor
        $fechaActual = date('d/m/Y');
        $fechaActual = explode('/', $fechaActual);
        $fecActual
            = $fechaActual[2] . '-' . $fechaActual[1] . '-' . $fechaActual[0];
        foreach ($arrayNomen as $key /*=> $arrNomen*/) {
            $activo = $arrayNomen[$key]['activo'];
            $idNomen = $arrayNomen[$key]['idnom'];
            // Captura la fecha de inicio en la que se activa el nomenclador
            $fechaFin = $arrayNomen[$key]['fhasta'];
            if ($fechaFin != null) {
                $fechaFin = explode('/', $fechaFin);
                $fecFin = $fechaFin[2] . $fechaFin[1] . $fechaFin[0];
                // Comparara rangos de fecha
                if ($fecFin < $fecActual) {
                    $activo = 0;
                    NomNomenclador::cambiarEstado($idNomen, $activo);
                }
            }
        }
    }

    /**
     * @author Alberto Tamayo Ramos y Jany Coto García
     * Método genérico para cargar el grid segun la categoria que se tenga seleccionada.
     */
    public function cargarNomencladoresAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $tipoNom = $this->_request->getPost("tiponom");
        $node = $this->_request->getPost("anode");
        $idUsuarioLog = $this->global->Perfil->idusuario;
        $filters = $this->_request->getPost('filtros');
        $arrTodos = GestionarnomencladoresModel::cargarNomencladoresNom(
            $tipoNom, $idUsuarioLog, $filters
        );
        $this->activarNomenclador($arrTodos);
        $this->desactivarNomenclador($arrTodos);
        $campo = "";
        $valor = "";
        for ($index = 0; $index < count($filters); $index++) {
            $campo = $filters[$index]['field'];
            if ($campo == 'nombreautor') {
                $valor = $filters[$index]['data']['value'];
                break;
            }
        }
        $arraynomencladores = array();
        if (isset($arrTodos[0]['idnomenclador'])) {
            $cont = 0;
            foreach ($arrTodos as $key => $nom) {
                if ($nom['idnomenclador']) {
                    $nomenclador = $nom;
                    $arraynomencladores[$cont] = $nomenclador;
                   //$idautor = $nomenclador['idautor'];
                    $nomuser = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                        $nomenclador['idautor'], 'usuario', null);
                    $arraynomencladores[$cont]['nombreautor'] = $nomuser;
                    if ($tipoNom == 8) {
                        $arraynomencladores[$cont]['alto']
                            = $nomenclador['NomTipohoja']['alto'];
                        $arraynomencladores[$cont]['ancho']
                            = $nomenclador['NomTipohoja']['ancho'];
                    }
                    $cont++;
                    /* if ($idautor != null) {
                      if ($campo == 'nombreautor') {
                      if (!preg_match("/$valor/i", $nomuser)) {
                      unset($arrTodos[$key]);
                      } else {
                      $arrTodos[$key]['nombreautor'] = $nomuser;
                      if ($tipoNom == 8) {
                      $arrTodos[$key]['alto'] = $nomenclador['NomTipohoja']['alto'];
                      $arrTodos[$key]['ancho'] = $nomenclador['NomTipohoja']['ancho'];
                      }
                      }
                      } else {
                      $arrTodos[$key]['nombreautor'] = $nomuser;
                      if ($tipoNom == 8) {
                      $arrTodos[$key]['alto'] = $nomenclador['NomTipohoja']['alto'];
                      $arrTodos[$key]['ancho'] = $nomenclador['NomTipohoja']['ancho'];
                      }
                      }
                      } 
                      if($nom['idnomenclador']) {
                      $idautor = $nom['idautor'];
                      $nomuser = $this->integrator->seguridad->nombreUsuario($nom['idautor']);
                      if ($idautor != null) {
                      if ($campo == 'nombreautor') {
                      if (!preg_match("/$valor/i", $nomuser)) {
                      unset($arrTodos[$key]);
                      } else {
                      $arrTodos[$key]['nombreautor'] = $nomuser;
                      if ($tipoNom == 8) {
                      $arrTodos[$key]['alto'] = $nom['NomTipohoja']['alto'];
                      $arrTodos[$key]['ancho'] = $nom['NomTipohoja']['ancho'];
                      }
                      }
                      } else {
                      $arrTodos[$key]['nombreautor'] = $nomuser;
                      if ($tipoNom == 8) {
                      $arrTodos[$key]['alto'] = $nom['NomTipohoja']['alto'];
                      $arrTodos[$key]['ancho'] = $nom['NomTipohoja']['ancho'];
                      }
                      }
                      }
                      } */
                }
            }
            $dat->data = $arraynomencladores; //$arrTodos;
        } else {
            $dat->total = 0;
            $dat->data = array();
        }
        //print_r($dat);die;
        echo json_encode($dat);
    }

    /**
     * @author Jany Coto García
     * Acción para cargar los nodos del árbol de involucrados
     */
    public function cargarRangoPublicidadAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $node = $this->_request->getPost('idgrupo');
        $funcion = $this->_request->getPost('estamodificando');
        $idusuario = $this->global->Perfil->idusuario;
        $iddominio = $this->global->Perfil->iddominio;
        $session = Zend_Registry::get('session');
        $certificado = $session->certificado;
        $objPermisoModel = new GestionarpermisosModel();
        if ($funcion == 0) {
            $idNom = null;
        }
        if ($funcion == 1) {
            $idNom = $this->_request->getPost('idnom');
        }
        switch ($node) {
            case 'nodo2':
                $arrayGrupos = $objPermisoModel->ArbolDeGrupos(
                    $idusuario, $node, $funcion, 'nomencladores', $idNom,
                    $certificado, $iddominio
                );
                if ($arrayGrupos) {
                    echo json_encode($arrayGrupos);
                }
                if (!$arrayGrupos) {
                    $this->showMessage('Usted no tiene grupos gestionados.');
                }
                break;
            case 'nodo3':
                $usersDomain = $objPermisoModel->ArbolDeGrupos(
                    $idusuario, $node, $funcion, 'nomencladores', $idNom,
                    $certificado, $iddominio
                );
                if ($usersDomain) {
                    echo json_encode($usersDomain);
                }
                if (!$usersDomain) {
                    $this->showMessage('Usted no tiene usuarios subordinados.');
                }
                break;
            case 'nodo4':
                $denoentidades = Array();
                $idusuario = $this->global->Perfil->idusuario;
                $iddominio = $this->global->Perfil->iddominio;
                $objAsignarEntidades = new CmpasignarentidadesModel();
                $denoentidades
                    = $objAsignarEntidades->obtenerArbolRelacionesAutor(
                    $idusuario, $funcion, $idNom
                );
                echo json_encode($denoentidades);
                break;
            case 'nodo5':
                $usersDomain
                    = $this->pIntegrator->configuracionpdo->DameEstructurasRelacionadasbyIduser(
                    $idusuario, $funcion, $idNom
                );
                if ($usersDomain) {
                    echo json_encode($usersDomain);
                }
                if (!$usersDomain) {
                    $this->showMessage(
                        'Usted no tiene estructuras relacionadas.'
                    );
                }
                break;
            default:
                $users = $objPermisoModel->ArbolDeGrupos(
                    $idusuario, $node, $funcion, 'nomencladores', $idNom,
                    $certificado, $iddominio
                );
                echo json_encode($users);
        }
    }

    /**
     * @author Jany Coto García
     * Acción para cambiar el estado del nomenclador
     */
    function cambiarEstadoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $objNomenclador = new GestionarnomencladoresModel();
        $node = $this->_request->getPost('idnom');
        $estado = $this->_request->getPost('estado');
        $mensaje = $objNomenclador->CambiarEstado($node, $estado);
        echo('{"mensaje" : ' . $mensaje . '}');
    }

    /**
     * @author Jany Coto Garcia
     * Acción para eliminar nomenclador
     */
    public function eliminarNomencladorAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $objNomencladorModel = new GestionarnomencladoresModel();
        $node = $this->_request->getPost('idnom');
        $existeNomenclador = NomNomenclador::existeNomencladorSegunId($node);
        if (!$existeNomenclador) {
            echo('{"mensaje" : 3}');
        } else {
            $familia = NomNomenclador::buscarFamilia($node);
            foreach ($familia as /*$key => */$h) {
                $idNom = $h['idnomenclador'];
                $existeNomElemento
                    = $this->pIntegrator->planpdo->existeNomencladorElemento(
                    $idNom
                );
                $existeNomCriterio
                    = $this->pIntegrator->planpdo->existeNomencladorCriterioMedidida(
                    $idNom
                );
                $existe = 1;
                if (!isset($existeNomElemento[0])) {

                    if (!isset($existeNomCriterio[0])) {
                        $existe = 0;
                        $id = Doctrine::getTable('NomNomenclador')->find(
                            $idNom
                        );
                        $nomenclador = $objNomencladorModel->Eliminar($id);
                        $this->conn->commit();
                        $this->conn->beginTransaction();
                    }
                }
                if ($existe == 1) {
                    /*$mensaje = */$objNomencladorModel->CambiarEstado(
                        $idNom, $estado = 0
                    );
                    echo('{"mensaje" : 2}');
                }
            }
            if ($nomenclador) {
                $existe = 0;
                echo('{"mensaje" : 1}');
            }
            /* else {
              echo ('{"mensaje" : 3}');
              } */
        }
    }

    /**
     * @author Jany Coto García
     * Modificar Categoría de la Actividad
     */
    function modificarCategActividad($idNom)
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $catActividad = Doctrine::getTable('NomCategactividad')->find($idNom);
        $objCategoriaActividadModel = new NomCategActividadModel();
        if ($this->_request->getPost('color') == null) {
            $color = 'FFFFFF';
        } else {
            $color = $this->_request->getPost('color');
        }
        $catActividad->color = $color;
        $objCategoriaActividadModel->Actualizar($catActividad);
        $this->conn->commit();
        $this->conn->beginTransaction();
    }

    /**
     * @author Jany Coto García
     */
    function modificarNomencladorAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->tiponomenclador = $this->_request->getPost('tiponom');
        $parametros->dennomenclador = $this->_request->getPost('denom');
        $parametros->descnomenclador = $this->_request->getPost('descrip');
        $parametros->fechainicio = $this->_request->getPost('fdesde');
        $parametros->fechafin = $this->_request->getPost('fhasta');
        $parametros->color = $this->_request->getPost('color');
        $parametros->alto = $this->_request->getPost('alto');
        $parametros->ancho = $this->_request->getPost('ancho');
        $parametros->inicial = $this->_request->getPost('inicial');
        $parametros->incidencia = $this->_request->getPost('incidencia');
        $parametros->caduca = $this->_request->getPost('caduca');
        $parametros->publico = $this->_request->getPost('pub');
        $parametros->publicoxtodos = $this->_request->getPost('pubtodos');
        $parametros->idnomenclador = $this->_request->getPost('idnom');
        $parametros->arraypublicidadinsertar = json_decode(
            stripslashes(
                $this->_request->getPost('arrayinsertar')
            )
        );
        $parametros->arraypublicidadeliminar = json_decode(
            stripslashes(
                $this->_request->getPost('arrayeliminar')
            )
        );
        $objnomencladormodel = new GestionarnomencladoresModel();
        $respuesta = $objnomencladormodel->ModificarNomenclador($parametros);
        echo json_encode(array('mensaje' => $respuesta));
        /* $idNom = $this->_request->getPost ( 'idnom' );
          $dennomenclador = $this->_request->getPost ( 'denom' );
          $existeNomenclador = NomNomenclador::existeNomencladorSegunId ( $idNom );          
          if ( !$existeNomenclador ) {
          echo ( '{"mensaje" : 3}' );
          }
          else {
          $exist = 0;
          $nomenclador = Doctrine::getTable( 'NomNomenclador' )->find ( $idNom );
          $existeNomen = NomNomenclador::existeNomenclador ( $nomenclador->tiponomenclador, $dennomenclador );        
          if(isset($existeNomen[0]))
          {
          foreach($existeNomen as $nom)
          {
          if($nom['idnomenclador'] != $nomenclador->idnomenclador)
          {
          $exist = 1;
          }
          }
          }
          if($exist == 0)
          {
          $nomenclador = Doctrine::getTable ( 'NomNomenclador' )->find( $idNom );
          $arrPublicidadEliminar = $this->_request->getPost ( 'arrayeliminar' );
          $arrPublicidadInsertar = $this->_request->getPost ( 'arrayinsertar' );
          $pubtodos = $this->_request->getPost ( 'pubtodos' )?1:0;
          $pub = $this->_request->getPost ( 'pub' );
          $caduca = $this->_request->getPost ( 'caduca' );
          $idPadre = $this->_request->getPost ( 'idnom' );
          $tipoNom = $this->_request->getPost ( 'tiponom' );
          $nomenclador->tiponomenclador = $tipoNom;
          $nomenclador->dennomenclador = $this->_request->getPost ( 'denom' );
          $nomenclador->descnomenclador = $this->_request->getPost ( 'descrip' );
          if ( $this->_request->getPost ( 'fdesde' ) == null ) { $nomenclador->fechainicio = Null; }
          else { $nomenclador->fechainicio = $this->_request->getPost ( 'fdesde' ); }
          if ( $this->_request->getPost ( 'fhasta' ) == null ) { $nomenclador->fechafin = Null; }
          else { $nomenclador->fechafin = $this->_request->getPost ( 'fhasta' ); }
          $nomenclador->publicoxtodos = $pubtodos;
          $nomenclador->publico = $pub;
          $nomenclador->caduca = $caduca;
          if ( $idPadre != null ) {
          $nomenclador->idpadre = $idPadre;
          }
          $activo = $this->adicionarCampoActivo ( $this->_request->getPost ( 'fdesde' ),$nomenclador->fechafin );
          $nomenclador->activo = $activo;
          //Adiciona inicialmente en la tabla nom_nomenclador
          $objGestionarnomencladoresModel = new GestionarnomencladoresModel ();
          $idNom = $objGestionarnomencladoresModel->Actualizar ( $nomenclador );
          $this->conn->commit ();
          $this->conn->beginTransaction ();
          //Adiciona en Categoría de la Actividad
          if($nomenclador->tiponomenclador == 2)
          {$this->modificarCategActividad ( $idNom );}
          //Adiciona en Tipo de Hoja
          if($nomenclador->tiponomenclador == 8)
          {
          $objtipoHoja = Doctrine::getTable('NomTipohoja')->find($idNom);
          $objtipoHoja->ancho = $this->_request->getPost ( 'ancho' );
          $objtipoHoja->alto = $this->_request->getPost ( 'alto' );
          $objtipoHoja->save();
          }
          if ( $pubtodos == 0 && $pub == 1 || $arrPublicidadEliminar || $arrPublicidadInsertar) {
          $this->editarGrupo($idNom, $pub, $arrPublicidadEliminar, $arrPublicidadInsertar);
          $this->editarUsuario($idNom, $pub, $arrPublicidadEliminar, $arrPublicidadInsertar);
          NomNomenclador::editarCampoPublicoNom ( $idNom, $pub );
          NomNomenclador::editarCampoPublicoxTodosNom ( $idNom, $pubtodos );
          }
          if ( $pubtodos == 1 ) {
          $this->eliminarPublicidad ( $idNom, $arrPublicidadEliminar );
          NomNomenclador::editarCampoPublicoNom ( $idNom, $pub );
          NomNomenclador::editarCampoPublicoxTodosNom ( $idNom, $pubtodos );
          }
          echo ('{"mensaje" : 1}');
          }
          else
          {
          echo ( '{"mensaje" : 8}' );
          }
          } */
    }

    /**
     * @author Jany Coto García
     * Editar Grupo
     */
    function editarGrupo(
        $idNom, $publico, $arrPublicidadEliminar, $arrPublicidadInsertar
    ) 
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $arrPublicidadEliminar = stripslashes($arrPublicidadEliminar);
        $arrPublicidadEliminar = json_decode($arrPublicidadEliminar);
        $arrPublicidadInsertar = stripslashes($arrPublicidadInsertar);
        $arrPublicidadInsertar = json_decode($arrPublicidadInsertar);
        if ($publico == '1' || $arrPublicidadEliminar
            || $arrPublicidadInsertar
        ) {
            $grupoNom = new DatGrupoNomNomenclador();
            $grupoNomModel = new DatUsuarioNomNomencladorModel();
            if (count($arrPublicidadEliminar) != 0) {
                foreach ($arrPublicidadEliminar as $arrayPublicidadEliminar) {
                    if ($arrayPublicidadEliminar->tipo == '0'
                        && $arrayPublicidadIsertar->id != 'nodo2'
                        && $arrayPublicidadIsertar->id != 'nodo3'
                    ) {
                        $grupoNom->idnomenclador = $idNom;
                        $idGrupo = $arrayPublicidadEliminar->idgrupo;
                        $grupoNom->idgrupo = $arrayPublicidadEliminar->idgrupo;
                        $exiteGrupo = NomNomenclador::existeGrupoNom(
                            $idGrupo, $idNom
                        );
                        if (isset($exiteGrupo[0])) {
                            $objGrupoNom = Doctrine::getTable(
                                'DatGrupoNomNomenclador'
                            )->findByDql(
                                "idnomenclador = $idNom AND idgrupo = $idGrupo"
                            );
                            $grupoNomModel->Eliminar($objGrupoNom);
                            $this->conn->commit();
                            $this->conn->beginTransaction();
                        }
                    }
                }
            }
            if (count($arrPublicidadInsertar) != 0) {
                foreach ($arrPublicidadInsertar as $arrayPublicidadIsertar) {
                    $grupoNom = new DatGrupoNomNomenclador();
                    $grupoNomModel = new DatUsuarioNomNomencladorModel(
                    ); //DatGrupoGestionarnomencladoresModel ();
                    if ($arrayPublicidadIsertar->tipo == '0'
                        && $arrayPublicidadIsertar->id != 'nodo2'
                        && $arrayPublicidadIsertar->id != 'nodo3'
                    ) {
                        $grupoNom->idnomenclador = $idNom;
                        $idGrupo = $arrayPublicidadIsertar->idgrupo;
                        $grupoNom->idgrupo = $idGrupo;
                        $exiteGrupo = NomNomenclador::existeGrupoNom(
                            $idGrupo, $idNom
                        );
                        if (!isset($exiteGrupo[0])) {
                            $grupoNomModel->Adicionar($grupoNom);
                            $this->conn->commit();
                            $this->conn->beginTransaction();
                        }
                    }
                }
            }
        }
    }

    /**
     * @author Jany Coto García
     * Eliminar publicidad
     */
    function eliminarPublicidad($idNom, $arrPublicidadEliminar)
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $arrPublicidadEliminar = stripslashes($arrPublicidadEliminar);
        $arrPublicidadEliminar = json_decode($arrPublicidadEliminar);
        $arrPublicidadInsertar = stripslashes($arrPublicidadInsertar);
        $arrPublicidadInsertar = json_decode($arrPublicidadInsertar);
        if (count($arrPublicidadEliminar != 0)) {
            foreach ($arrPublicidadEliminar as $arrayPublicidadEliminar) {
                if ($arrayPublicidadEliminar->tipo == '1') {
                    $usuarioNom = new DatUsuarioNomNomenclador();
                    $usuarioNomModel = new DatUsuarioNomNomencladorModel();
                    $usuarioNom->idnomenclador = $idNom;
                    $idUsuario = $arrayPublicidadEliminar->idusuario;
                    $usuarioNom->idusuario = $idUsuario;
                    $exiteUsuario = NomNomenclador::existeUsuarioNom(
                        $idUsuario, $idNom
                    );
                    if ($exiteUsuario) {
                        $objUsuarioNom = Doctrine::getTable(
                            'DatUsuarioNomNomenclador'
                        )->findByDql(
                            "idnomenclador = $idNom AND idusuario = $idUsuario"
                        );
                        $usuarioNomModel->Eliminar($objUsuarioNom);
                        $this->conn->commit();
                        $this->conn->beginTransaction();
                    }
                }
                if ($arrayPublicidadEliminar->tipo == '0') {
                    $grupoNom = new DatGrupoNomNomenclador();
                    $grupoNomModel = new DatGrupoNomNomencladorModel(
                    ); //DatGrupoGestionarnomencladoresModel ();
                    $grupoNom->idnomenclador = $idNom;
                    $idGrupo = $arrayPublicidadEliminar->idgrupo;
                    $grupoNom->idgrupo = $arrayPublicidadEliminar->idgrupo;
                    $exiteGrupo = NomNomenclador::existeGrupoNom(
                        $idGrupo, $idNom
                    );
                    if ($exiteGrupo) {
                        $objGrupoNom = Doctrine::getTable(
                            'DatGrupoNomNomenclador'
                        )->findByDql(
                            "idnomenclador = $idNom AND idgrupo = $idGrupo"
                        );
                        $grupoNomModel->Eliminar($objGrupoNom);
                        $this->conn->commit();
                        $this->conn->beginTransaction();
                    }
                }
            }
        }
    }

    /**
     * @author Jany Coto García
     * Editar Usuarios
     */
    function editarUsuario(
        $idNom, $publico, $arrPublicidadEliminar, $arrPublicidadInsertar
    ) 
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $arrPublicidadEliminar = stripslashes($arrPublicidadEliminar);
        $arrPublicidadEliminar = json_decode($arrPublicidadEliminar);
        $arrPublicidadInsertar = stripslashes($arrPublicidadInsertar);
        $arrPublicidadInsertar = json_decode($arrPublicidadInsertar);
        if ($publico == '1' || $arrPublicidadEliminar
            || $arrPublicidadInsertar
        ) {
            $usuarioNom = new DatUsuarioNomNomenclador();
            $usuarioNomModel = new DatUsuarioNomNomencladorModel();
            if (count($arrPublicidadEliminar != 0)) {
                foreach ($arrPublicidadEliminar as $arrayPublicidadEliminar) {

                    if ($arrayPublicidadEliminar->tipo == '1'
                        && $arrayPublicidadIsertar->id != 'nodo2'
                        && $arrayPublicidadIsertar->id != 'nodo3'
                    ) {
                        $usuarioNom->idnomenclador = $idNom;
                        $idUsuario = $arrayPublicidadEliminar->idusuario;
                        $usuarioNom->idusuario = $idUsuario;
                        $exiteUsuario = NomNomenclador::existeUsuarioNom(
                            $idUsuario, $idNom
                        );
                        if (isset($exiteUsuario[0])) {
                            $objUsuarioNom = Doctrine::getTable(
                                'DatUsuarioNomNomenclador'
                            )->findByDql(
                                "idnomenclador = $idNom AND idusuario = $idUsuario"
                            );
                            $usuarioNomModel->Eliminar($objUsuarioNom);
                            $this->conn->commit();
                            $this->conn->beginTransaction();
                        }
                    }
                }
            }
            if (count($arrPublicidadInsertar != 0)) {
                foreach ($arrPublicidadInsertar as $arrayPublicidadInsertar) {
                    $usuarioNom = new DatUsuarioNomNomenclador();
                    $usuarioNomModel = new DatUsuarioNomNomencladorModel();
                    if ($arrayPublicidadInsertar->tipo == '1'
                        && $arrayPublicidadIsertar->id != 'nodo2'
                        && $arrayPublicidadIsertar->id != 'nodo3'
                    ) {
                        $idUsuario = $arrayPublicidadInsertar->idusuario;
                        $usuarioNom->idnomenclador = $idNom;
                        $usuarioNom->idusuario = $idUsuario;
                        //$exiteUsuarioPdo = //DatUsuarioPdo::existeUsuario ( $idUsuario );
                        $exiteUsuario = NomNomenclador::existeUsuarioNom(
                            $idUsuario, $idNom
                        );
                        /* if ( !$exiteUsuarioPdo ) {
                          $usuarioPdo = new DatUsuarioPdo ();
                          $usuarioPdoModel = new DatUsuarioPdoModel ();
                          $usuarioPdo->idusuario = $idUsuario;
                          $usuarioPdo->idcargo = null;
                          $usuarioPdo->denusuario = $arrayPublicidadInsertar->text;
                          $usuarioPdoModel->Insertar ( $usuarioPdo );
                          $this->conn->commit();
                          $this->conn->beginTransaction();
                          } */
                        if (!isset($exiteUsuario[0])) {

                            $usuarioNomModel->Adicionar($usuarioNom);
                            $this->conn->commit();
                            $this->conn->beginTransaction();
                        }
                    }
                }
            }
        }
    }

    function editarPublicidadAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $arrPublicidadEliminar = $this->_request->getPost('arrayeliminar');
        $arrPublicidadInsertar = $this->_request->getPost('arrayinsertar');
        $pubtodos = $this->_request->getPost('pubtodos') ? 1 : 0;
        $pub = $this->_request->getPost('pub');
        $idNom = $this->_request->getPost('idnom');
        $add = 0;
        if ($pubtodos == 0 && $pub == 1) {
            $this->editarGrupo(
                $idNom, $pub, $arrPublicidadEliminar, $arrPublicidadInsertar
            );
            $this->editarUsuario(
                $idNom, $pub, $arrPublicidadEliminar, $arrPublicidadInsertar
            );
            NomNomenclador::editarCampoPublicoNom($idNom, $pub);
            NomNomenclador::editarCampoPublicoxTodosNom($idNom, $pubtodos);
            $add = 1;
        }
        if ($pubtodos == 1) {
            $this->eliminarPublicidad($idNom, $arrPublicidadEliminar);
            NomNomenclador::editarCampoPublicoNom($idNom, $pub);
            NomNomenclador::editarCampoPublicoxTodosNom($idNom, $pubtodos);
        }
        if ($add == 1) {
            echo('{"mensaje" : 1}');
        } else {
            echo('{"mensaje" : 3}');
        }
    }

    public function existeNomencladorAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idNom = $this->_request->getPost('idnom');
        //$existe = 0;
        $existeNomenclador = NomNomenclador::existeNomencladorSegunId($idNom);
        if (!$existeNomenclador) {
            echo('{"mensaje" : 3}');
        } else {
            echo('{"mensaje" : 1}');
        }
    }

    public function listarNomencladoresAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $tipoNom = $this->_request->getPost("tiponom");
        //$node = $this->_request->getPost("anode");
        $parametros->start = ($this->_request->getPost("start")
            && $this->_request->getPost("start") != 'NaN')
            ? $this->_request->getPost("start") : 0;
        $parametros->limit = ($this->_request->getPost("limit"))
            ? $this->_request->getPost("limit") : 10;
        $parametros->categoria = false;
        $idpadre = $this->_request->getPost("idpadre");
        $idUsuarioLog = $this->global->Perfil->idusuario;
        $filters = $this->_request->getPost('filtros');
        $arrTodos = NomNomencladorModel::listarNomencladores(
            $tipoNom, $idUsuarioLog, $filters, $idpadre, $parametros
        );
        $dat->total = $arrTodos->total;
        $this->activarNomenclador($arrTodos->data);
        $this->desactivarNomenclador($arrTodos->data);
        //$campo = "";
        //$valor = "";
        $arraynomencladores = array();
        if (isset($arrTodos->data[0]['idnom'])) {
            foreach ($arrTodos->data as $key => $nom) {
                if ($nom['idnom']) {
                    $nomenclador = $nom;
                    $arraynomencladores[$key] = $nomenclador;
                    $idautor = $nomenclador['idautor'];
                    $nomuser = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                        $nomenclador['idautor'], 'usuario', null);
                    $arraynomencladores[$key]['nombreautor'] = $nomuser;
                    if (!$nomenclador['_is_leaf']) {
                        $tienepadre = NomNomencladorModel::listarNomencladores(
                            $tipoNom, $idUsuarioLog, $filters,
                            $nomenclador['idnom'], $parametros
                        );
                        if (count($tienepadre->data) == 0) {
                            $arraynomencladores[$key]['_is_leaf'] = true;
                        }
                    }
                    $superior = 0;
                    if ($idautor != $idUsuarioLog) {
                        $superior = 1;
                    }
                    $arraynomencladores[$key]['superior'] = $superior;
                }
            }
            $dat->data = $arraynomencladores;
        } else {
            $dat->total = 0;
            $dat->data = array();
        }
        echo json_encode($dat);
    }

    public function PublicarTodosNomencladorAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        /* $parametros->idnomenclador = $this->_request->getPost('idnomenclador'); */
        $parametros->arrayidnomencladores = json_decode(
            stripslashes(
                $this->_request->getPost('arrayidnomencl')
            )
        );
        $parametros->arrayidusuarios = json_decode(
            stripslashes(
                $this->_request->getPost('arrayidusuarios')
            )
        );
        $parametros->arrayidentidades = json_decode(
            stripslashes(
                $this->_request->getPost('arrayidentidades')
            )
        );       
        $objnomencladormodel = new GestionarnomencladoresModel();
        $objnomencladormodel->PublicarTodosNomencladores($parametros);
        $respuesta = 1;
        echo json_encode(array('mensaje' => $respuesta));
    }

    public function DespublicarTodosNomencladorAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora

        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->arrayidnomencladores = json_decode(
            stripslashes(
                $this->_request->getPost('arrayidnomencl')
            )
        );
        $objnomencladormodel = new GestionarnomencladoresModel();
        $objnomencladormodel->DespublicarTodosNomencladores($parametros);
        $respuesta = 1;
        echo json_encode(array('mensaje' => $respuesta));
    }

    public function BuscarInvolucradosAction()
    {
        $nodo = $this->_request->getPost('nodo');        
       //$idgrupo = $this->_request->getPost('idgrupo');
        $denominacionbuscar = $this->_request->getPost('denominacion');
        $funcAsoc = $this->_request->getPost('funcionalidadAsoc');
        $idusuario = $this->global->Perfil->idusuario;
        $iddominio = $this->global->Perfil->iddominio;
        $session = Zend_Registry::get('session');
        $certificado = $session->certificado;
        $estamodificando = $this->_request->getPost('estamodificando');
        $objpermiso = new GestionarpermisosModel();
        if ($denominacionbuscar) {
            $arraygrupos = $objpermiso->CargarGruposyUsuariosPara(
                $nodo, 'nodo1', $idusuario, $estamodificando, $iddominio,
                $certificado, null
            );
            $data[0] = $objpermiso->Buscardenominacion(
                $arraygrupos, $denominacionbuscar
            );
            /*$misgrupos = */$objpermiso->Buscardenominacion(
                $arraygrupos, $denominacionbuscar
            );
            $arrausersdomain = $objpermiso->CargarGruposyUsuariosPara(
                $nodo, 'nodo2', $idusuario, $estamodificando, $iddominio,
                $certificado, $funcAsoc
            );
            $data[1] = $objpermiso->Buscardenominacion(
                $arrausersdomain, $denominacionbuscar
            );
            $otros
                = $this->pIntegrator->configuracionpdo->DameEstructurasRelacionadasbyIduser(
                $idusuario
            );
            $data[2] = $objpermiso->Buscardenominacion(
                $otros, $denominacionbuscar
            );
            echo json_encode(array('data' => $data));
        }
    }

    public function obtenerSistemasAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $objnomencladormodel = new GestionarnomencladoresModel();
        $sistemas = $objnomencladormodel->obtenerSistemas();
        echo json_encode($sistemas);
    }
}


