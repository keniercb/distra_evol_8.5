<?php

/**
 * Controlador para gestionar grupos
 *
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpgestionargruposController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     *
     */
    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista gestionargrupos.phtml
     *
     */
    function cmpgestionargruposAction()
    {
       // $jsayuda = $this->integrator->ayuda->devolverJS();
        //$this->view->jsayuda = $jsayuda;
        $this->render();
    }

    /**
     * Accion para cargar el grid donde muestro los grupos
     *
     */
    function cargargruposAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $params->idusuario = $this->global->Perfil->idusuario;
        $params->idgrupo = $this->_request->getPost('anode');
        $params->tipo = $this->_request->getPost('tipo');
        $params->limit = 80;
        if ($this->_request->getPost('limit') != null) {
            $params->limit = $this->_request->getPost('limit');
        }
        $params->start = 0;
        if ($this->_request->getPost('start') != null) {
            $params->start = $this->_request->getPost('start');
        }
        $params->filters = $this->_request->getPost('filtros');

        $objgrupo = new CmpgestionargrupoModel();
        $arraygrupos = $objgrupo->CargarGrupos($params);

        if ($arraygrupos['total'] > 0) {
            echo json_encode(
                array('total'  => $arraygrupos['total'],
                      'campos' => $arraygrupos['datos'])
            );
        } else {
            echo json_encode(array('total' => 0, 'campos' => array()));
        }
    }

    /**
     * Accion para adicionar grupos
     *
     */
    function adicionargrupoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariocrea = $this->global->Perfil->idusuario;
        $arraygruposusuarios = json_decode(
            stripslashes($this->_request->getPost('arraygruposusuarios'))
        );
        $dengrupo = $this->_request->getPost('tfdenominaciongrupo');
        $descgrupo = $this->_request->getPost('hedescripciongrupo');
        $objgrupo = new CmpgestionargrupoModel();
        $resp = $objgrupo->AdicionarGrupos(
            $idusuariocrea, $arraygruposusuarios, $dengrupo, $descgrupo
        );
        echo json_encode(array('mensaje' => $resp));
        /* $idusuariocrea = $this->global->Perfil->idusuario;
          $elementosinsertar = stripslashes($this->_request->getPost('elementosinsertar'));
          $elementosinsertar = json_decode($elementosinsertar);
          $elementoseliminar = json_decode(stripslashes($this->_request->getPost('elementoseliminar')));
          $gruposinsertar = stripslashes($this->_request->getPost('gruposinsertar'));
          $gruposinsertar = json_decode($gruposinsertar);
          $dengrupo = $this->_request->getPost('dengrupo');
          $personal = $this->_request->getPost('personal');
          $descgrupo = $this->_request->getPost('descgrupo');
          $objgrupo = new CmpgestionargrupoModel();
          $resp = $objgrupo->AdicionarGrupos($idusuariocrea, $elementosinsertar, 
           $gruposinsertar, $dengrupo, $descgrupo, $personal);
          echo json_encode(array('resp' => $resp)); */
    }

    /**
     * Accion para adicionar modificar grupos
     *
     */
    function modificargrupoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariocrea = $this->global->Perfil->idusuario;
        $idgrupo = $this->_request->getPost('idgrupo');
        $arraygruposusuarios = json_decode(
            stripslashes($this->_request->getPost('arraygruposusuarios'))
        );
        $dengrupo = $this->_request->getPost('tfdenominaciongrupo');
        $descgrupo = $this->_request->getPost('hedescripciongrupo');

        $objgrupo = new CmpgestionargrupoModel();
        $resp = $objgrupo->ModificarGrupos(
            $idusuariocrea, $arraygruposusuarios, $dengrupo, $descgrupo,
            $idgrupo/* $idusuariocrea, $elementosinsertar, $elementoseliminar, $gruposinsertar, 
                    $gruposeliminar, $idgrupomodificar, $dengrupo, $descgrupo, $personal */
        );
        echo json_encode(array('mensaje' => $resp));
    }

    /**
     * Accion para eliminar grupos
     *
     */
    public function eliminargruposAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariocrea = $this->global->Perfil->idusuario;
        $arrayidgrupos = json_decode(
            stripslashes($this->_request->getPost('arrayidgrupos'))
        );
        $objgrupo = new CmpgestionargrupoModel();
        $respuesta = $objgrupo->EliminarGrupos($idusuariocrea, $arrayidgrupos);
        if ($respuesta['eliminados'] != 0 && $respuesta['desactivados'] == 0) {
            $mensaje = 1;            
        } else {
            if ($respuesta['eliminados'] == 0
                && $respuesta['desactivados'] != 0
            ) {
                $mensaje = 4;                
            } else {
                if ($respuesta['eliminados'] != 0
                    && $respuesta['desactivados'] != 0
                ) {
                    $mensaje = 2;                   
                } else {
                    if ($respuesta['eliminados'] == 0
                        && $respuesta['desactivados'] == 0
                    ) {
                        $mensaje = 0;
                    }
                }
            }
        }
        echo json_encode(array('mensaje' => $mensaje));
    }

    public function cargarusuariosgrupoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idgrupo = $this->_request->getPost('idgrupo');
        $objgrupo = new CmpgestionargrupoModel();
        $usuarios = $objgrupo->CargarUsuariosdelGrupo($idgrupo);
        if ($usuarios) {
            echo json_encode(
                array('total' => count($usuarios), 'campos' => $usuarios)
            );
        }
        if (!$usuarios) {
            echo json_encode(array('total' => 0, 'campos' => array()));
        }
    }

    /**
     * Accion  para cargar el grid donde se mostraran los usuarios a los cuales se les puede cambiar el alias
     *
     */
    function cargargridaliasAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idgrupo = $this->_request->getPost('idgrupo');
        $objgrupo = new CmpgestionargrupoModel();
        $arrayusuarios = $objgrupo->CargarGridDeAlias($idgrupo);
        if (count($arrayusuarios)) {
            echo json_encode(
                array('total'  => count($arrayusuarios),
                      'campos' => $arrayusuarios)
            );
        } else {
            $this->showMessage('Este grupo no tiene usuarios.');
        }
    }

    /**
     * Accion  para modificar el alias de los usuarios de un determinado grupo
     *
     */
    function modificaraliasAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $arraycambios = $this->_request->getPost('arraycambios');
        $arraycambios = stripslashes($arraycambios);
        $arraycambios = json_decode($arraycambios);
        $objgrupo = new CmpgestionargrupoModel();
        $objgrupo->ModificarAlias($arraycambios);
        $this->showMessage('El alias ha sido modificada correctamente.');
    }

    /**
     * Accion  para cargar el arbol de estructuras del dominio del usuario
     *
     */
    function cargarestructurasAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idpuntoestructural = $this->_request->getPost('node');
        $estamodificando = $this->_request->getPost('estamodificando');
        $idgrupoamodificar = $this->_request->getPost('idgrupoamodificar');
        $tipo = $this->_request->getPost('tipo');
        //$session = Zend_Registry::get('session');
        //$certificado = $session->certificado;
        //$dominio = $this->_request->getPost('dominio');
        $objgrupo = new CmpgestionargrupoModel();
        $objgrupo->CargarEstructuras(
            $idpuntoestructural, $estamodificando, $idgrupoamodificar, $tipo
        );
    }

    /**
     * Accion  para desactivar un grupo
     *
     */
    public function suspendergrupoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariocrea = $this->global->Perfil->idusuario;
        $totalidgrupos = $this->_request->getPost('totalidgrupos');
        $totalidgrupos = stripslashes($totalidgrupos);
        $totalidgrupos = json_decode($totalidgrupos);
        $objgrupo = new CmpgestionargrupoModel();
        $objgrupo->DesactivarGrupos($idusuariocrea, $totalidgrupos);
        if (count($totalidgrupos) > 1) {
            $this->showMessage(
                'Los grupos han sido desactivados correctamente.'
            );
        } else {
            $this->showMessage('El grupo ha sido desactivado correctamente.');
        }
    }

    /**
     * Accion  para activar un grupo
     *
     */
    public function activargrupoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $totalidgrupos = $this->_request->getPost('totalidgrupos');
        $totalidgrupos = stripslashes($totalidgrupos);
        $totalidgrupos = json_decode($totalidgrupos);
        $objgrupo = new CmpgestionargrupoModel();
        $objgrupo->ActivarGrupos($totalidgrupos);
        if (count($totalidgrupos) > 1) {
            $this->showMessage('Los grupos han sido activados correctamente.');
        } else {
            $this->showMessage('El grupo ha sido activado correctamente.');
        }
    }

    public function activardesactivargruposAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariocrea = $this->global->Perfil->idusuario;
        $arrayidgrupos = json_decode(
            stripslashes($this->_request->getPost('arrayidgrupos'))
        );
        $accion = $this->_request->getPost('accion');
        $objmodel = new CmpgestionargrupoModel();
        if ($accion == 1) {
            $respuesta = $objmodel->ActivarGrupos($arrayidgrupos);
        } else {
            $respuesta = $objmodel->DesactivarGrupos(
                $idusuariocrea, $arrayidgrupos
            );
        }
        $respuesta = 1;
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Accion  para cargar el arbol de grupos existentes
     *
     */
    public function cargargruposexistentesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $estamodificando = $this->_request->getPost('estamodificando');
        $idgrupoamodificar = $this->_request->getPost('idgrupoamodificar');
        $idgrupo = $this->_request->getPost('idgrupo');
        $idusuario = $this->_request->getPost('idusuario');
        $tipo = $this->_request->getPost('tipo');
        $objgrupo = new CmpgestionargrupoModel();
        $arraygruposs = $objgrupo->CargarGruposExistentes(
            $idusuariosession, $estamodificando, $idgrupoamodificar, $idgrupo,
            $idusuario, $tipo
        );
        if ($arraygruposs) {
            echo json_encode($arraygruposs);
        } else {
            if ($estamodificando == 'true') {
                $this->showMessage(
                    'Usted solo ha gestionado el grupo que esta modificando.'
                );
            } else {
                $this->showMessage('Usted no tiene grupos gestionados.');
            }
        }
    }

    public function actualizardatosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        //$idusuariosession = $this->global->Perfil->idusuario;
        $objgrupo = new CmpgestionargrupoModel();
        /*$arraygruposs = */ $objgrupo->ActualizarDatos();
    }

    public function cargarpermisosnivelsuperiorAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $nodo = $this->_request->getPost('node');
        //$estamodificando = $this->_request->getPost('estamodificando');
        $idusuario = $this->global->Perfil->idusuario;
        $permisomodel = new GestionarpermisosModel();
        $arrayotros = array();
        switch ($nodo) {
            case 'nodo4':
                $arraypermisos = DatPermiso::GetPermisosAdicionarNivelSupPara(
                    $idusuario
                );
                $count = 0;
                foreach ($arraypermisos as $permiso) {
                    $tipo = 'usuario';
                    if ($permiso['tipopsobre'] == 0) {
                        $tipo = 'grupo';
                    }
                    $denominacionsobre = $permisomodel->DameDenominacion(
                        $permiso['idpsobre'], $tipo, null
                    );
                    //tomo por defecto que es un usuario sobre el cual tengo permiso
                    $tipo = 1;
                    $id = $idgrupo
                        . $permiso['idpermiso']; //$permiso['idgruposobre'].$permiso['idpsobre'];
                    $leaf = true;
                    $icon = 'usuario';
                    $estaactivo = 1;
                    if ($permiso['tipoppara'] == 0) {
                        $objgrupopara = Doctrine::getTable(DatGrupo)->find(
                            $permiso['idppara']
                        );
                        if ($objgrupopara->activo == 0) {
                            $estaactivo = 0;
                        }
                    }
                    //verifico si  es un grupo y cambio variables
                    if ($permiso['tipopsobre'] == 0) {
                        $objgrupo = Doctrine::getTable('DatGrupo')->find(
                            $permiso['idpsobre']
                        );
                        if ($objgrupo->activo == 0) {
                            $estaactivo = 0;
                        }
                        $tipo = 0;
                        $id = $idgrupo . $permiso['idpermiso'];
                        $icon = 'grupo';
                        $tienehijosusuarios
                            = DatGrupoUsuario::BuscarUsuariosPorGrupo(
                            $permiso['idpsobre']
                        ); //DatGrupoDatUsuario::BuscarUsuariosPorGrupo($permiso['idpsobre']);
                        if (isset($tienehijosusuarios[0])) {
                            $leaf = false;
                        }
                    }
                    $checked = false;
                    if ($estaactivo == 1) {
                        $arrayotros[$count]['id'] = $id;
                        $arrayotros[$count]['text'] = $denominacionsobre;
                        $arrayotros[$count]['idgrupo'] = $idgrupo;
                        $arrayotros[$count]['idusuario'] = $idusuario;
                        $arrayotros[$count]['tipo'] = $tipo;
                        $arrayotros[$count]['iconCls'] = $icon;
                        $arrayotros[$count]['draggable'] = false;
                        $arrayotros[$count]['leaf'] = $leaf;
                        $arrayotros[$count]['checked'] = $checked;
                        //$otros[$count]['tipoinvol'] = $arraydatos['tipoinvol'];			
                        $count++;
                    }
                }
                break;
            default:
                $cont = 0;
                $arrayusuarios = DatGrupoUsuario::BuscarUsuariosPorGrupo(
                    $nodo
                ); //DatGrupoDatUsuario::BuscarUsuariosPorGrupo($idgrupo);
                if (isset($arrayusuarios[0])) {
                    foreach ($arrayusuarios as $usuario) {
                        //esto hay ke rvisarlo 
                        if ($usuario['idusuario'] != $idautor) {
                            $checked = false;
                            //$tipoinvol = 1;
                            $idusuario = $usuario['idusuario'];
                            $arrayotros[$cont]['id']
                                = $nodo . $nodo . $usuario['idusuario'];
                            $arrayotros[$cont]['text'] = $usuario['alias'];
                            $arrayotros[$cont]['idusuario'] = $idusuario;
                            $arrayotros[$cont]['idgrupo'] = $usuario['idgrupo'];
                            $arrayotros[$cont]['tipo'] = 1;
                            $arrayotros[$cont]['draggable'] = false;
                            $arrayotros[$cont]['leaf'] = true;
                            $arrayotros[$cont]['checked'] = $checked;
                            $cont++;
                        }
                    }
                }
        }
        echo json_encode($arrayotros);
    }

    public function cargarformgrupoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
       //$idusuario = $this->global->Perfil->idusuario;
        $idgrupo = $this->_request->getPost('idgrupo');
        $objgrupo = Doctrine::getTable('DatGrupo')->find($idgrupo);
        if (isset($objgrupo->idgrupo)) {
            $dat->data [] = array(
                'idgrupo'   => $idgrupo,
                'dengrupo'  => $objgrupo->dengrupo,
                'descgrupo' => $objgrupo->descgrupo,
                'mensaje'   => 1
            );
            echo json_encode($dat);
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }

    public function traspasarusuariosdelgrupoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $arraygrupocargossusuarios = DatGrupoUsuario::ObtenerTodosLosDatos();
        if (isset($arraygrupocargossusuarios[0]['idgrupo'])) {
            foreach (
                $arraygrupocargossusuarios as/*$key => */$gruposcargosusuarios
            ) {
                $idgrupo = $gruposcargosusuarios['idgrupo'];
                $idusuario = $gruposcargosusuarios['idusuario'];
                $existerelgrupousuario = Doctrine::getTable('DatGrupoUsuario')
                    ->findByDQL(
                        "idgrupo = $idgrupo AND idusuario = $idusuario"
                    );
                if (!isset($existerelgrupousuario[0]->idusuario)
                    || ($existerelgrupousuario[0]->idusuario == ''
                        || $existerelgrupousuario[0]->idusuario == null)
                ) {
                    $objgrupousuario = new DatGrupoUsuario();
                    $objgrupousuario->idgrupo = $idgrupo;
                    $objgrupousuario->idusuario = $idusuario;
                    $objgrupousuario->save();
                    /*$resp = */$this->integrator->seguridad->ChangeState(
                        $idusuario, '1'
                    );
                }
            }
        }
        echo json_encode(array('mensaje' => 1));
    }

}
