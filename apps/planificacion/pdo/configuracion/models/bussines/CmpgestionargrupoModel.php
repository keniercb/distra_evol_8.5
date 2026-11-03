<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpgestionargrupoModel extends ZendExt_Model
{

    /**
     * Constructor de la clase
     */
    public function GestionargrupoModel()
    {
        parent::ZendExt_Model();
    }

    /*
     * funcion para cargar los grupos creados por el usuario
     */

    public function CargarGrupos($params)
    {
        if (!$params->idgrupo) {
            $arraygrupos = DatGrupo::ObtenerGruposPorLimite($params);
            if ($arraygrupos['total'] > 0) {
                foreach ($arraygrupos['datos'] as $key => $grupo) {
                    $idgrupo = $grupo['idgrupo'];
                    $arraygrupos['datos'][$key]['_parent'] = $params->idgrupo;
                    $eshoja = true;
                    $arrayusuarios = array();
                    $arrayusuarios = Doctrine::getTable('DatGrupoUsuario')
                        ->findByDQL("idgrupo = $idgrupo");
                    if (isset($arrayusuarios[0]->idgrupo)
                        && ($arrayusuarios[0]->idgrupo != ''
                            && $arrayusuarios[0]->idgrupo != null)
                    ) {
                        $eshoja = false;
                    } else {
                        $arrayestructuras = array();
                        $arrayestructuras = Doctrine::getTable(
                            'DatGrupoEstructura'
                        )->findByDQL("idgrupo = $idgrupo");
                        if (isset($arrayestructuras[0]->idgrupo)
                            && ($arrayestructuras[0]->idgrupo != ''
                                && $arrayestructuras[0]->idgrupo != null)
                        ) {
                            $eshoja = false;
                        }
                    }
                    $arraygrupos['datos'][$key]['_is_leaf'] = $eshoja;
                    $arraygrupos['datos'][$key]['tipo'] = 'grupo';
                }
            }
        } else {
            $arrayusuarios = array();
            $cont = 0;
            $arrayusuariosgrupo = array();
            $arrayestructurasgrupo = array();
            $arrayuserestructurasgrupo = array();
            $arrayusuariosgrupo = DatGrupoUsuario::BuscarUsuariosPorGrupo(
                $params->idgrupo
            );

            $arrayestructurasgrupo
                = DatGrupoEstructura::BuscarEstructuraPorGrupo(
                $params->idgrupo
            );

            $arrayuserestructurasgrupo = array_merge(
                $arrayusuariosgrupo, $arrayestructurasgrupo
            );

            if (isset($arrayuserestructurasgrupo[0])) {
                foreach ($arrayuserestructurasgrupo as $user) {
                    if ($user['idusuario']) {
                        $arrayusuarios[$cont]['idgrupo']
                            = $params->idgrupo . $user['idusuario'];
                        $arrayusuarios[$cont]['idusuario'] = $user['idusuario'];
                        
                        $arrayusuarios2
                            = $this->integrator->seguridad->nombreUsuario( $user['idusuario']);

                        if($arrayusuarios2 == null || $arrayusuarios2 == ''){

                            $arrayusuarios[$cont]['dengrupo'] = '';
                            $arrayusuarios[$cont]['_parent'] = $params->idgrupo;
                            $arrayusuarios[$cont]['_is_leaf'] = true;
                            $arrayusuarios[$cont]['tipo'] = 'usuario';
                            $cont++;

                        }else{

                            $arrayidpersonaIdUsuario = $this->integrator->seguridad->getArrayIdPersonaByUsersName(
                                $arrayusuarios2
                            );

                            $datosautor
                                = $this->integrator->pvd->getPrincipalesDatosPersona(
                                $arrayidpersonaIdUsuario
                            );


                            $arrayusuarios[$cont]['dengrupo']
                                = $datosautor->data[0]['nombreapellidos'].' - ('.$arrayusuarios2.')&usuario';

                            $arrayusuarios[$cont]['_parent'] = $params->idgrupo;
                            $arrayusuarios[$cont]['_is_leaf'] = true;
                            $arrayusuarios[$cont]['tipo'] = 'usuario';
                            $cont++;
                        }


                    } else {
                        if ($user['idestructura']) {
                            $arrayusuarios[$cont]['idgrupo']
                                = $params->idgrupo . $user['idestructura'];
                            $arrayusuarios[$cont]['idusuario']
                                = $user['idestructura'];
                            $estructura
                                = $this->integrator->metadatos->DameEstructura(
                                $user['idestructura']
                            );
                            $arrayusuarios[$cont]['dengrupo']
                                = $estructura[0]->denominacion . '&estructura';
                            $arrayusuarios[$cont]['icono']
                                = $estructura[0]->icon;
                            $arrayusuarios[$cont]['_parent'] = $params->idgrupo;
                            $arrayusuarios[$cont]['_is_leaf'] = true;
                            $arrayusuarios[$cont]['tipo'] = 'estructura';
                            $cont++;
                        }
                    }
                }
                $arraygrupos['total'] = count($arrayusuarios);
                $arraygrupos['datos'] = $arrayusuarios;
            }
        }
        return $arraygrupos;
    }

    /*
     * funcion para adicionar grupos
     */

    public function AdicionarGrupos(
        $idusuariocrea, $arraygruposusuarios, $dengrupo, $descgrupo
    ) 
    {
        $resp = 1;
        $existegrupoigual = DatGrupo::GetGruposIguales(
            $idusuariocrea, $dengrupo
        );
        if (isset($existegrupoigual[0])) {
            $resp = 3;
        } else {
            $grupo = new DatGrupo();
            $grupo->dengrupo = $dengrupo;
            $grupo->descgrupo = $descgrupo;
            $grupo->fechacreacion = date("Y-m-d H:i:s");
            $grupo->idusuariocrea = $idusuariocrea;
            $grupo->activo = 1;
            $grupo->save();
            //$this->integrator->seguridad->ChangeState($idusuariocrea,'1');
            $idgrupo = $grupo->idgrupo;            
            //procedo a insertar los usuarios en el grupo
            $this->AdicionarUsuariosaGrupos($idgrupo, $arraygruposusuarios);
            //procedo a crear los permisos por defecto sobre ese grupo
            $arraypermsospara[0]->idusuario = $idusuariocrea;
            $arraypermsospara[0]->tipo = 1;
            $arraypermsospara[0]->denominacion
                = $this->integrator->seguridad->nombreUsuario($idusuariocrea);
            $arraypermsossobre[0]->idgrupo = $idgrupo;
            $arraypermsossobre[0]->tipo = 0;
            $arraypermsossobre[0]->denominacion = $dengrupo;
            $arraypermsossobre[0]->esgrupo = 1;
            $arraypermisos->leer = 1;
            $arraypermisos->anadir = 1;
            $arraypermisos->modificar = 1;
            $arraypermisos->eliminar = 1;
            $objpermisosmodel = new GestionarpermisosModel();
            $objpermisosmodel->AdicionarPermiso(
                $idusuariocrea, $arraypermsospara, $arraypermsossobre,
                $arraypermisos
            );
        }
        return $resp;
    }

    public function AdicionarUsuariosaGrupos($idgrupo, $arraygruposusuarios)
    {
        if (isset($arraygruposusuarios[0])) {
            foreach ($arraygruposusuarios as /*$key => */$gruposusuario) {
                if ($gruposusuario->tipo == 1) {
                    $idusuario = $gruposusuario->idusuario;
                    $existerelgrupousuario = Doctrine::getTable(
                        'DatGrupoUsuario'
                    )->findByDQL(
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
                        //$this->integrator->seguridad->ChangeState($idusuario,'1');
                    }
                } else {
                    if ($gruposusuario->tipo == 2) {
                        $idusuario = $gruposusuario->idusuario;
                        $existerelgrupoestructura = Doctrine::getTable(
                            'DatGrupoEstructura'
                        )->findByDQL(
                            "idgrupo = $idgrupo AND idestructura = $idusuario"
                        );
                        if (!isset($existerelgrupoestructura[0]->idestructura)
                            || ($existerelgrupoestructura[0]->idestructura == ''
                                || $existerelgrupoestructura[0]->idestructura
                                == null)
                        ) {
                            $objgrupousuario = new DatGrupoEstructura();
                            $objgrupousuario->idgrupo = $idgrupo;
                            $objgrupousuario->idestructura = $idusuario;
                            $objgrupousuario->save();
                            //$this->integrator->seguridad->ChangeState($idusuario,'1');
                        }
                    } else {
                        $idgrupoorigen = $gruposusuario->idgrupo;
                        $arrayusuarios = Doctrine::getTable('DatGrupoUsuario')
                            ->findByDQL("idgrupo = $idgrupoorigen ");
                        if (isset($arrayusuarios[0]->idusuario)
                            && ($arrayusuarios[0]->idusuario != ''
                                && $arrayusuarios[0]->idusuario != null)
                        ) {
                            foreach ($arrayusuarios as /*$pos => */$usuario) {
                                $idusuario = $usuario->idusuario;
                                $existerelgrupousuario = Doctrine::getTable(
                                    'DatGrupoUsuario'
                                )->findByDQL(
                                    "idgrupo = $idgrupo AND idusuario = $idusuario"
                                );
                                if (!isset($existerelgrupousuario[0]->idusuario)
                                    || ($existerelgrupousuario[0]->idusuario
                                        == ''
                                        || $existerelgrupousuario[0]->idusuario
                                        == null)
                                ) {
                                    $objgrupousuario = new DatGrupoUsuario();
                                    $objgrupousuario->idgrupo = $idgrupo;
                                    $objgrupousuario->idusuario = $idusuario;
                                    $objgrupousuario->save();
                                    //$this->integrator->seguridad->ChangeState($idusuario,'1');
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /*
     * Funcion para adicionar la lista de puntos estructurales que estan por 
     * encima de un determinado punto
     */

    public function addPadres($arraypadres, $idgrupo)
    {

        $cantidadentidades = count(
            $arraypadres['entidades']
        ); //....para adicionar entidades y gruposentidades
        for ($i = $cantidadentidades - 1; $i >= 0; $i--) {
            $dominio = $arraypadres['entidades'][$i]['dominio'];
            $existe = DatEntidadPdo::Buscar(
                $arraypadres['entidades'][$i]['idnodo']
            );
            if (!$existe) {
                $objentidad = new DatEntidadPdo();
                $objentidad->identidad
                    = $arraypadres['entidades'][$i]['idnodo'];
                $objentidad->idpadre = $arraypadres['entidades'][$i]['idpadre'];
                $objentidad->save();
                if ($dominio == true
                    && $arraypadres['entidades'][$i]['todos'] == true
                ) {
                    $identidad = $objentidad->identidad;
                    $objge = new DatGrupoDatEntidad();
                    $objge->idgrupo = $idgrupo;
                    $objge->identidad = $identidad;
                    $objge->todos = $arraypadres['entidades'][$i]['todos'];
                    $objge->save();
                }
            }
            if ($existe) {
                $existeenGE = DatGrupoDatEntidad::ExisteEntidadenGrupo(
                    $idgrupo, $arraypadres['entidades'][$i]['idnodo']
                );
                if (!$existeenGE && $dominio == true
                    && $arraypadres['entidades'][$i]['todos'] == true
                ) {
                    $identidad = $arraypadres['entidades'][$i]['idnodo'];
                    $objge = new DatGrupoDatEntidad();
                    $objge->idgrupo = $idgrupo;
                    $objge->identidad = $identidad;
                    $objge->todos = $arraypadres['entidades'][$i]['todos'];
                    $objge->save();
                }
            }
        }
        $cantidadareas = count(
            $arraypadres['areas']
        ); //.........para adicionar areas y gruposareas
        if ($cantidadareas > 0) {
            for ($i = $cantidadareas - 1; $i >= 0; $i--) {
                $dominio = $arraypadres['areas'][$i]['dominio'];
                $existe = DatAreaPdo::Buscar(
                    $arraypadres['areas'][$i]['idnodo']
                );
                if (!$existe) {
                    $objarea = new DatAreaPdo();
                    $objarea->idarea = $arraypadres['areas'][$i]['idnodo'];
                    $objarea->idpadre = $arraypadres['areas'][$i]['idpadre'];
                    $objarea->save();
                    if ($dominio == true
                        && $arraypadres['areas'][$i]['todos'] == true
                    ) {
                        $idarea = $objarea->idarea;
                        $objga = new DatGrupoDatArea();
                        $objga->idgrupo = $idgrupo;
                        $objga->idarea = $idarea;
                        $objga->todos = $arraypadres['areas'][$i]['todos'];
                        $objga->save();
                    }
                }
                if ($existe) {
                    $existeenGA = DatGrupoDatArea::ExisteAreaenGrupo(
                        $idgrupo, $arraypadres['areas'][$i]['idnodo']
                    );
                    if (!$existeenGA && $dominio == true
                        && $arraypadres['areas'][$i]['todos'] == true
                    ) {
                        $idarea = $arraypadres['areas'][$i]['idnodo'];
                        $objga = new DatGrupoDatArea();
                        $objga->idgrupo = $idgrupo;
                        $objga->idarea = $idarea;
                        $objga->todos = $arraypadres['areas'][$i]['todos'];
                        $objga->save();
                    }
                }
            }
        }
        $cantidadcargos = count(
            $arraypadres['cargos']
        ); //........para adicionar cargos y gruposcargos
        if ($cantidadcargos > 0) {
            for ($i = $cantidadcargos - 1; $i >= 0; $i--) {
                $dominio = $arraypadres['cargos'][$i]['dominio'];
                $existe = DatCargoPdo::Buscar(
                    $arraypadres['cargos'][$i]['idnodo']
                );
                if (!$existe) {
                    $objcargo = new DatCargoPdo();
                    $objcargo->idcargo = $arraypadres['cargos'][$i]['idnodo'];
                    $objcargo->idarea = $arraypadres['cargos'][$i]['idpadre'];
                    $objcargo->save();
                    if ($dominio == true
                        && $arraypadres['cargos'][$i]['todos'] == true
                    ) {
                        $idcargo = $objcargo->idcargo;
                        $objgc = new DatGrupoDatCargo();
                        $objgc->idgrupo = $idgrupo;
                        $objgc->idcargo = $idcargo;
                        $objgc->todos = $arraypadres['cargos'][$i]['todos'];
                        $objgc->save();
                    }
                }
                if ($existe) {
                    $existeenGC = DatGrupoDatCargo::ExisteCargoenGrupo(
                        $idgrupo, $arraypadres['cargos'][$i]['idnodo']
                    );
                    if (!$existeenGC && $dominio == true
                        && $arraypadres['cargos'][$i]['todos'] == true
                    ) {
                        $idcargo = $arraypadres['cargos'][$i]['idnodo'];
                        $objgc = new DatGrupoDatCargo();
                        $objgc->idgrupo = $idgrupo;
                        $objgc->idcargo = $idcargo;
                        $objgc->todos = $arraypadres['cargos'][$i]['todos'];
                        $objgc->save();
                    }
                }
            }
        }
        $cantidadusuarios = count(
            $arraypadres['usuarios']
        ); //.......para adicionar usuarios y gruposusuarios
        if ($cantidadusuarios > 0) {
            for ($i = $cantidadusuarios - 1; $i >= 0; $i--) {
                $dominio = $arraypadres['usuarios'][$i]['dominio'];
                $existe = DatUsuarioPdo::Buscar(
                    $arraypadres['usuarios'][$i]['idnodo']
                );
                if (!$existe) {
                    $objusuario = new DatUsuarioPdo();
                    $objusuario->idusuario
                        = $arraypadres['usuarios'][$i]['idnodo'];
                    $objusuario->idcargo
                        = $arraypadres['usuarios'][$i]['idpadre'];
                    $objusuario->idnivel = null;
                    $objusuario->denusuario = null;
                    $objusuario->save();
                    if ($dominio == true
                        && $arraypadres['usuarios'][$i]['alias'] == true
                    ) {
                        $objgu = new DatGrupoDatUsuario();
                        $objgu->idgrupo = $idgrupo;
                        $objgu->idusuario
                            = $arraypadres['usuarios'][$i]['idnodo'];
                        $objgu->alias = $arraypadres['usuarios'][$i]['alias'];
                        $objgu->save();
                    }
                }
                if ($existe) {
                    /* $objuser = Doctrine::getTable('DatUsuarioPdo')->find(
                      $arraypadres['usuarios'][$i]['idnodo']);
                      $objuser->idcargo = $arraypadres['usuarios'][$i]['idpadre'];
                      $objuser->save(); */
                    $existeenGU = DatGrupoDatUsuario::ExisteUsuarioenGrupo(
                        $idgrupo, $arraypadres['usuarios'][$i]['idnodo']
                    );
                    if (!$existeenGU && $dominio == true
                        && $arraypadres['usuarios'][$i]['alias'] == true
                    ) {
                        $idusuario = $arraypadres['usuarios'][$i]['idnodo'];
                        $objgu = new DatGrupoDatUsuario();
                        $objgu->idgrupo = $idgrupo;
                        $objgu->idusuario = $idusuario;
                        $objgu->alias = $arraypadres['usuarios'][$i]['alias'];
                        $objgu->save();
                    }
                }
            }
        }
    }

    /**
     * Funcion para adicionar la lista de puntos estructurales que estan por 
     * debajo de un determinado punto
     */
    public function addHijos($arrayhijos, $idgrupo)
    {
        $cantidadenthijas = count(
            $arrayhijos['entidades']
        ); //......para adicionar entidaes y gruposentidades
        if ($cantidadenthijas > 0) {
            for ($i = 0; $i < $cantidadenthijas; $i++) {
                $dominio = $arrayhijos['entidades'][$i]['dominio'];
                $existe = DatEntidadPdo::Buscar(
                    $arrayhijos['entidades'][$i]['idnodo']
                );
                if (!$existe) {
                    $objentidad = new DatEntidadPdo();
                    $objentidad->identidad
                        = $arrayhijos['entidades'][$i]['idnodo'];
                    $objentidad->idpadre
                        = $arrayhijos['entidades'][$i]['idpadre'];
                    $objentidad->save();
                    if ($dominio == true
                        && $arrayhijos['entidades'][$i]['todos'] == true
                    ) {
                        $identidad = $objentidad->identidad;
                        $objge = new DatGrupoDatEntidad();
                        $objge->idgrupo = $idgrupo;
                        $objge->identidad = $identidad;
                        $objge->todos = $arrayhijos['entidades'][$i]['todos'];
                        $objge->save();
                    }
                }
                if ($existe) {
                    $existeenGE = DatGrupoDatEntidad::ExisteEntidadenGrupo(
                        $idgrupo, $arrayhijos['entidades'][$i]['idnodo']
                    );
                    if (!$existeenGE && $dominio == true
                        && $arrayhijos['entidades'][$i]['todos'] == true
                    ) {
                        $identidad = $arrayhijos['entidades'][$i]['idnodo'];
                        $objge = new DatGrupoDatEntidad();
                        $objge->idgrupo = $idgrupo;
                        $objge->identidad = $identidad;
                        $objge->todos = $arrayhijos['cargos'][$i]['todos'];
                        $objge->save();
                    }
                }
            }
        }
        $cantidadareashijas = count(
            $arrayhijos['areas']
        ); //.......para adicionar areas y gruposareas
        if ($cantidadareashijas > 0) {
            for ($i = 0; $i < $cantidadareashijas; $i++) {
                $dominio = $arrayhijos['areas'][$i]['dominio'];
                $existe = DatAreaPdo::Buscar(
                    $arrayhijos['areas'][$i]['idnodo']
                );
                if (!$existe) {
                    $objarea = new DatAreaPdo();
                    $objarea->idarea = $arrayhijos['areas'][$i]['idnodo'];
                    $objarea->idpadre = $arrayhijos['areas'][$i]['idpadre'];
                    $objarea->save();

                    if ($dominio == true
                        && $arrayhijos['areas'][$i]['todos'] == true
                    ) {
                        $idarea = $objarea->idarea;
                        $objga = new DatGrupoDatArea();
                        $objga->idgrupo = $idgrupo;
                        $objga->idarea = $idarea;
                        $objga->todos = $arrayhijos['areas'][$i]['todos'];
                        $objga->save();
                    }
                }
                if ($existe) {
                    $existeenGA = DatGrupoDatArea::ExisteAreaenGrupo(
                        $idgrupo, $arrayhijos['areas'][$i]['idnodo']
                    );
                    if (!$existeenGA && $dominio == true
                        && $arrayhijos['areas'][$i]['todos'] == true
                    ) {
                        $idarea = $arrayhijos['areas'][$i]['idnodo'];
                        $objga = new DatGrupoDatArea();
                        $objga->idgrupo = $idgrupo;
                        $objga->idarea = $idarea;
                        $objga->todos = $arrayhijos['areas'][$i]['todos'];
                        $objga->save();
                    }
                }
            }
        }
        $cantidadcargoshijas = count(
            $arrayhijos['cargos']
        ); //........para adicionar cargos y gruposcargos
        if ($cantidadcargoshijas > 0) {
            for ($i = 0; $i < $cantidadcargoshijas; $i++) {
                $dominio = $arrayhijos['cargos'][$i]['dominio'];
                $existe = DatCargoPdo::Buscar(
                    $arrayhijos['cargos'][$i]['idnodo']
                );
                if (!$existe) {
                    $objcargo = new DatCargoPdo();
                    $objcargo->idcargo = $arrayhijos['cargos'][$i]['idnodo'];
                    $objcargo->idarea = $arrayhijos['cargos'][$i]['idpadre'];
                    $objcargo->save();

                    if ($dominio == true
                        && $arrayhijos['cargos'][$i]['todos'] == true
                    ) {
                        $idcargo = $objcargo->idcargo;
                        $objgc = new DatGrupoDatCargo();
                        $objgc->idgrupo = $idgrupo;
                        $objgc->idcargo = $idcargo;
                        $objgc->todos = $arrayhijos['cargos'][$i]['todos'];
                        $objgc->save();
                    }
                }
                if ($existe) {
                    $existeenGC = DatGrupoDatCargo::ExisteCargoenGrupo(
                        $idgrupo, $arrayhijos['cargos'][$i]['idnodo']
                    );
                    if (!$existeenGC && $dominio == true
                        && $arrayhijos['cargos'][$i]['todos'] == true
                    ) {
                        $idcargo = $arrayhijos['cargos'][$i]['idnodo'];
                        $objgc = new DatGrupoDatCargo();
                        $objgc->idgrupo = $idgrupo;
                        $objgc->idcargo = $idcargo;
                        $objgc->todos = $arrayhijos['cargos'][$i]['todos'];
                        $objgc->save();
                    }
                }
            }
        }
        $cantidadusuarioshijas = count(
            $arrayhijos['usuarios']
        ); //......para adicionar usuarios y gruposusuarios
        if ($cantidadusuarioshijas > 0) {
            for ($i = 0; $i < $cantidadusuarioshijas; $i++) {
                $dominio = $arrayhijos['usuarios'][$i]['dominio'];
                $existe = DatUsuarioPdo::Buscar(
                    $arrayhijos['usuarios'][$i]['idnodo']
                );
                if (!$existe) {
                    $objusuario = new DatUsuarioPdo();
                    $objusuario->idusuario
                        = $arrayhijos['usuarios'][$i]['idnodo'];
                    $objusuario->idcargo
                        = $arrayhijos['usuarios'][$i]['idpadre'];
                    $objusuario->idnivel = null;
                    $objusuario->denusuario = null;
                    $objusuario->save();
                    if ($dominio == true
                        && $arrayhijos['usuarios'][$i]['alias'] == true
                    ) {
                        $idusuario = $objusuario->idusuario;
                        $objgu = new DatGrupoDatUsuario();
                        $objgu->idgrupo = $idgrupo;
                        $objgu->idusuario = $idusuario;
                        $objgu->alias = $arrayhijos['usuarios'][$i]['alias'];
                        $objgu->save();
                    }
                }
                if ($existe) {
                    /* $objuser = Doctrine::getTable('DatUsuarioPdo')->find(
                      $arrayhijos['usuarios'][$i]['idnodo']);
                      $objuser->idcargo =  $arrayhijos['usuarios'][$i]['idpadre'];
                      $objuser->save(); */
                    $existeenGU = DatGrupoDatUsuario::ExisteUsuarioenGrupo(
                        $idgrupo, $arrayhijos['usuarios'][$i]['idnodo']
                    );
                    if (!$existeenGU && $dominio == true
                        && $arrayhijos['usuarios'][$i]['alias'] == true
                    ) {
                        $idusuario = $arrayhijos['usuarios'][$i]['idnodo'];
                        $objgu = new DatGrupoDatUsuario();
                        $objgu->idgrupo = $idgrupo;
                        $objgu->idusuario = $idusuario;
                        $objgu->alias = $arrayhijos['usuarios'][$i]['alias'];
                        $objgu->save();
                    }
                }
            }
        }
    }

    /**
     * Funcion para obtener un arreglo con los puntos estructurales que estan por encima  de un determinado punto
     */
    public function damepadres($element, $arraypadres, $todos)
    {
        $padre = $element->padre;
        if (count($padre->id) > 0) {
            if ($element->tipo == 'externa') {
                $padre = $element->padre;
                $entidad = array('idnodo'  => $element->id, 'todos' => $todos,
                                 'tipo'    => $element->tipo,
                                 'idpadre' => $padre->id,
                                 'dominio' => $element->dominio);
                $arraypadres['entidades'][] = $entidad;
                $tod = false;
                $this->damepadres($padre, $arraypadres, $tod);
            }
            if ($element->tipo == 'interna') {
                $padre = $element->padre;
                $area = array('idnodo'  => $element->id, 'todos' => $todos,
                              'tipo'    => $element->tipo,
                              'idpadre' => $padre->id,
                              'dominio' => $element->dominio);
                $arraypadres['areas'][] = $area;
                $tod = false;
                $this->damepadres($padre, $arraypadres, $tod);
            }
            if ($element->tipo == 'cargo') {
                $padre = $element->padre;
                $cargo = array('idnodo'  => $element->id, 'todos' => $todos,
                               'tipo'    => $element->tipo,
                               'idpadre' => $padre->id, 'dominio' => true);
                $arraypadres['cargos'][] = $cargo;
                $tod = false;
                $this->damepadres($padre, $arraypadres, $tod);
            }
            if (!$element->tipo) {
                $padre = $element->padre;
                $usuario = array('idnodo'     => $element->id,
                                 'alias'      => $this->integrator->seguridad->nombreUsuario(
                                     $element->id
                                 ), 'idpadre' => $padre->id, 'dominio' => true);
                $arraypadres['usuarios'][] = $usuario;
                $tod = false;
                $this->damepadres($padre, $arraypadres, $tod);
            }
        }
        if (count($padre->idnodo) == 0) {
            $estructura = 'entidades';
            $dominio = true;
            if ($element->tipo == 'interna') {
                $estructura = 'areas';
            }
            if ($element->tipo == 'cargo') {
                $estructura = 'cargos';
            }
            if (!$element->tipo) {
                $estructura = 'usuarios';
            }
            $datos = array('idnodo'  => $element->id, 'todos' => $todos,
                           'tipo'    => $element->tipo,
                           'idpadre' => $element->id, 'dominio' => $dominio);
            $arraypadres[$estructura][] = $datos;
        }
        return $arraypadres;
    }

    /**
     * Funcion para obtener un arreglo con los puntos estructurales que estan 
     * por debajo  de un determinado punto
     */
    public function damehijos(
        $certificado, $idestructura, $tipo, &$arrayhijos, $dominiopadre
    ) 
    {
        $estaendominio = 0;
        if ($dominiopadre) {
            $estaendominio = 1;
        }
        $hijos = $this->integrator->seguridad->dominoHastaUsuario(
            $certificado, $idestructura, $tipo, $estaendominio, $estaendominio
        );
        if ($hijos) {
            foreach ($hijos as $hijo) {
                if ($hijo['tipo'] == 'externa') {
                    $entidad = array('idnodo'  => $hijo['idestructura'],
                                     'todos'   => true, 'tipo' => $hijo['tipo'],
                                     'idpadre' => $idestructura,
                                     'dominio' => $hijo['dominio']);
                    $arrayhijos['entidades'][] = $entidad;
                    $this->damehijos(
                        $certificado, $hijo['idestructura'], $hijo['tipo'],
                        $arrayhijos, $hijo['dominio']
                    );
                }
                if ($hijo['tipo'] == 'interna') {
                    $arrayhijos['areas'][]
                        = array('idnodo'  => $hijo['idestructura'],
                                'todos'   => true, 'tipo' => $hijo['tipo'],
                                'idpadre' => $idestructura,
                                'dominio' => $hijo['dominio']);
                    $this->damehijos(
                        $certificado, $hijo['idestructura'], $hijo['tipo'],
                        $arrayhijos, $hijo['dominio']
                    );
                }
                if ($hijo['tipo'] == 'cargo') {
                    $arrayhijos['cargos'][]
                        = array('idnodo'  => $hijo['idcargo'], 'todos' => true,
                                'tipo'    => $hijo['tipo'],
                                'idpadre' => $idestructura,
                                'dominio' => $dominiopadre);
                    $this->damehijos(
                        $certificado, $hijo['idcargo'], $hijo['tipo'],
                        $arrayhijos, $dominiopadre
                    );
                }
                if (!$hijo['tipo']) {
                    $arrayhijos['usuarios'][] = array('idnodo'  => $hijo['id'],
                                                      'alias'   => $this->integrator->seguridad->nombreUsuario(
                                                          $hijo['id']
                                                      ),
                                                      'idpadre' => $idestructura,
                                                      'dominio' => $dominiopadre);
                }
            }
            return $arrayhijos;
        }
    }

    /**
     * Funcion para adicionar los puntos estructurales donde estan los usuarios 
     * que conforman mi grupo
     */
    public function adicionarelementos($elementos, $idgrupo)
    {
        //$idusuariosession = $this->global->Perfil->idusuario;
        $iddominio = $this->global->Perfil->iddominio;
        $arrayidestructuras = array();
        $arrayTemp = array();
        foreach ($elementos as $elemeno) {
            if (!$elemeno->tipo) {
                $datoscargo
                    = $this->integrator->seguridad->datosEntAreaCargoUsuario(
                    $elemeno->id
                );
                $objgrupocargousuario = new DatGrupoUsuario();
                $objgrupocargousuario->idgrupo = $idgrupo;
                $objgrupocargousuario->idcargo = $datoscargo[0]['idcargo'];
                $objgrupocargousuario->idusuario = $elemeno->id;
                $objgrupocargousuario->alias
                    = $this->integrator->seguridad->nombreUsuario($elemeno->id);
                $objgrupocargousuario->save();
            }
            if ($elemeno->tipo == 'cargo') {
                $arrayidcargos[] = $elemeno->id;
            }
            if ($elemeno->tipo == 'externa' || $elemeno->tipo == 'interna') {
                $arrayidestructuras[] = $elemeno->id;
            }
        }
        if (isset($arrayidestructuras[0])) {
            $arrayestructurashijas
                = $this->integrator->metadatos->getArrayEstructuras(
                $arrayidestructuras, $iddominio
            );
            if (isset($arrayestructurashijas[0])) {
                foreach ($arrayestructurashijas as $estructura) {
                    if ($estructura['idfila'] != null
                        && !count(
                            array_intersect(
                                array($estructura['idfila']), $arrayTemp
                            )
                        )
                    ) {
                        $objgrupoestructura = new DatGrupoEstructura();
                        $objgrupoestructura->idgrupo = $idgrupo;
                        $objgrupoestructura->idestructura
                            = $estructura['idfila'];
                        $objgrupoestructura->save();
                        $arrayTemp[] = $estructura['idfila'];
                    }
                    if ($estructura['idcargo'] != null) {
                        $arrayidcargos[] = $estructura['idcargo'];
                    }
                }
            }
        }
        if (isset($arrayidcargos[0])) {
            $arrayidusuarioscargos
                = $this->integrator->seguridad->getUsuariosCargoByArrayId(
                $arrayidcargos
            );
            if (isset($arrayidusuarioscargos[0])) {
                foreach ($arrayidusuarioscargos as $idusuariocargo) {
                    $idcargg = $idusuariocargo['idcargo'];
                    $iduserr = $idusuariocargo['idusuario'];
                    $existegrupcaruser = Doctrine::getTable('DatGrupoUsuario')
                        ->findByDql(
                            "idgrupo = $idgrupo AND idcargo = $idcargg AND idusuario = $iduserr"
                        );
                    if (!isset($existegrupcaruser[0])
                        && $existegrupcaruser[0]->idgrupo == null
                    ) {
                        $objgrupocargousuario = new DatGrupoUsuario();
                        $objgrupocargousuario->idgrupo = $idgrupo;
                        $objgrupocargousuario->idcargo = $idcargg;
                        $objgrupocargousuario->idusuario = $iduserr;
                        $objgrupocargousuario->alias
                            = $this->integrator->seguridad->nombreUsuario(
                            $idusuariocargo['idusuario']
                        );
                        $objgrupocargousuario->save();
                    }
                }
            }
        }
    }

    /**
     * Funcion para adicionar y relacionar elementos al grupo creado,asi como
     * grupos hijos y usuarios
     */
    public function addTodo(
        $idgrupo, /*$idusuariocrea, */$elementosainsertar, $gruposainsertar
    ) 
    {
        if ($elementosainsertar) {
            $this->adicionarelementos($elementosainsertar, $idgrupo);
        }
        if ($gruposainsertar) {
            foreach ($gruposainsertar as $grupo) {
                if ($grupo->tipo == 1) {
                    $idusuario = $grupo->idusuario;
                    $idgrupoex = $grupo->idgrupo;
                    $existenusuarioscargos = Doctrine::getTable(
                        'DatGrupoUsuario'
                    )->findByDql(
                        "idgrupo = '$idgrupoex' AND idusuario = '$idusuario'"
                    );
                    if (isset($existenusuarioscargos[0])
                        && $existenusuarioscargos[0]->idgrupo != null
                    ) {
                        $idcargo = $existenusuarioscargos[0]->idcargo;
                        $existenusuarioscargosgrupos = Doctrine::getTable(
                            'DatGrupoUsuario'
                        )->findByDql(
                            "idgrupo = '$idgrupo' AND idusuario = '$idusuario' AND idcargo = '$idcargo'"
                        );
                        if (!isset($existenusuarioscargosgrupos[0])
                            && $existenusuarioscargosgrupos[0]->idgrupo == null
                        ) {
                            $objgrupocargousuario = new DatGrupoUsuario();
                            $objgrupocargousuario->idgrupo = $idgrupo;
                            $objgrupocargousuario->idcargo = $idcargo;
                            $objgrupocargousuario->idusuario = $idusuario;
                            $objgrupocargousuario->alias
                                = $existenusuarioscargos[0]->alias;
                            $objgrupocargousuario->save();
                        }
                    }
                }
                if ($grupo->tipo == 0) {
                    $idgrupop = $grupo->idgrupo;
                    $arrayusuarioscargosdelgrupo = Doctrine::getTable(
                        'DatGrupoUsuario'
                    )->findByDql("idgrupo = '$idgrupop'");
                    if (isset($arrayusuarioscargosdelgrupo[0])
                        && $arrayusuarioscargosdelgrupo[0]->idgrupo != null
                    ) {
                        foreach ($arrayusuarioscargosdelgrupo as $usuariocargo) {
                            $idusuario = $usuariocargo->idusuario;
                            $existenusuarioscargoss = Doctrine::getTable(
                                'DatGrupoUsuario'
                            )->findByDql(
                                "idgrupo = '$idgrupo' AND idusuario = '$idusuario'"
                            );
                            if (!isset($existenusuarioscargoss[0])
                                && $existenusuarioscargoss[0]->idgrupo == null
                            ) {
                                $objgrupocargousuarioo = new DatGrupoUsuario();
                                $objgrupocargousuarioo->idgrupo = $idgrupo;
                                $objgrupocargousuarioo->idcargo
                                    = $usuariocargo->idcargo;
                                $objgrupocargousuarioo->idusuario = $idusuario;
                                $objgrupocargousuarioo->alias
                                    = $usuariocargo->alias;
                                $objgrupocargousuarioo->save();
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Funcion para modificar grupos
     */
    public function ModificarGrupos(
        $idusuariocrea, $arraygruposusuarios, $dengrupo, $descgrupo, $idgrupo
    ) 
    {
        $existegrupoigual = DatGrupo::GetGruposIgualesModificar(
            $idusuariocrea, $dengrupo, $idgrupo
        );
        if (isset($existegrupoigual[0])) {
            $respuesta = 3;
        } else {
            $objgrupo = Doctrine::getTable('DatGrupo')->find($idgrupo);
            //$objgrupo = Doctrine::getTable('DatGrupo')->find($idgrupo);
            if (isset($objgrupo->idgrupo)) {
            //Que no exista otro grupo con el mismo nombre
                $objgrupo->dengrupo = $dengrupo;
                $objgrupo->descgrupo = $descgrupo;
                $objgrupo->save();
               /* $rus = */DatGrupoUsuario::EliminarUsuariosDelGrupo(
                    $idgrupo
                ); //falta informar a seguridad el desuso de los usuarios del grupo
                /*$res = */DatGrupoEstructura::EliminarEstructuraDelGrupo($idgrupo);
                $this->AdicionarUsuariosaGrupos($idgrupo, $arraygruposusuarios);
                $respuesta = 1;
            } else {
                $respuesta = 3;
            }
        }
        return $respuesta;
        /* $session = Zend_Registry::get('session');
          $certificado = $session->certificado;
          $puedemodificar = 1;
          $grupomismonombre = DatGrupo::GetGruposIguales(
          $idusuariocrea,$dengrupo);
          if(isset($grupomismonombre[0]))
          {
          foreach($grupomismonombre as $grup)
          {
          if($grup['idgrupo'] != $idgrupomodificar)
          {
          $puedemodificar = 3;
          }
          }
          }
          if($puedemodificar == 1)
          {
          $objgrupo = Doctrine::getTable('DatGrupo')->find( $idgrupomodificar );
          $objgrupo->dengrupo = $dengrupo;
          $objgrupo->descgrupo = $descgrupo;
          $objgrupo->save();
          $this->EliminarIntegrantesDeGrupo($idgrupomodificar,
          $elementoseliminar,$gruposeliminar,$certificado);
          $this->addTodo($idgrupomodificar,$idusuariocrea,
          $elementosinsertar,$gruposinsertar);
          }
          return $puedemodificar; */
    }

    /**
     * Funcion para eliminar grupos
     */
    public function EliminarGrupos($idusuariocrea, $arrayidgrupos)
    {
        if (isset($arrayidgrupos[0])) {
            $eliminados = 0;
            $desactivados = 0;
            $cont = 0;
            foreach ($arrayidgrupos as $idgrupo) {
                $existe = 0;
                //verifico si el grupo esta involucrado con arc o elementos de la planificacion
                $existeinvolucradoarc
                    = $this->pIntegrator->planpdo->ExisteGrupoInvolucradoARC(
                    $idgrupo
                );
                if ($existeinvolucradoarc) {
                    $existe = 1;
                }
                $existeinvolelementos
                    = $this->pIntegrator->planpdo->VerificarInvolucradoConElementos(
                    $idgrupo
                );
                if ($existeinvolelementos) {
                    $existe = 1;
                }
                //si no lo esta procedo a eliminarlo, sino lo guardo en un array para luego desactivarlo		 
                if ($existe == 1) {
                    $desactivados = 1 + $desactivados;
                    $arrayidgruposs[$cont] = $idgrupo;
                    $cont++;
                    //$this->DesactivarGrupos($arrayidgrupo);
                }
                //procedo a eliminar los permisos para y sobre el grupo		  
                $existepermisoparaelgrupo
                    = DatPermiso::GetPermisosParaDadoIdusuariocrea(
                    $idgrupo, $idusuariocrea
                );
                if ($existepermisoparaelgrupo) {
                    foreach ($existepermisoparaelgrupo as $key => $permiso) {
                        $idpermiso = $permiso['idpermiso'];
                        $perm = Doctrine::getTable('DatPermiso')->find(
                            $idpermiso
                        );
                        $arrayidpermiso[$key] = $perm;
                    }
                    $objpermiso = new GestionarpermisosModel();
                    $objpermiso->EliminarPermiso(
                        $idusuariocrea, $arrayidpermiso
                    );
                }
                $existepermisosobreelgrupo
                    = DatPermiso::GetPermisosSobreDadoIdusuariocrea(
                    $idgrupo, $idusuariocrea
                );
                if ($existepermisosobreelgrupo) {
                    foreach ($existepermisosobreelgrupo as $key => $permiso) {
                        $idpermiso = $permiso['idpermiso'];
                        $perm = Doctrine::getTable('DatPermiso')->find(
                            $idpermiso
                        );
                        $arrayidpermiso[$key] = $perm;
                    }
                    $objpermiso = new GestionarpermisosModel();
                    $objpermiso->EliminarPermiso(
                        $idusuariocrea, $arrayidpermiso
                    );
                }
                if ($existe == 0) {
                    $eliminados = 1 + $eliminados;
                    $grupo = Doctrine::getTable('DatGrupo')->find($idgrupo);
                    $grupo->delete();                    
                }
            }            
            if (isset($arrayidgruposs[0])) {
                $this->DesactivarGrupos($idusuariocrea, $arrayidgruposs);
            }
            $respuesta['eliminados'] = $eliminados;
            $respuesta['desactivados'] = $desactivados;
            return $respuesta;
        }
    }

    public function EliminarIntegrantesRecursiva(
        $idgrupomodificar, $idestructura, $tipoestructura, $certificado,
        $dominio
    ) 
    {
        if ($tipoestructura == 'externa' || $tipoestructura == 'interna') {
            if ($dominio == 1) {
                $arraygrupoestructuras = Doctrine::getTable(
                    'DatGrupoEstructura'
                )->findByDql(
                    "idgrupo = 'idgrupomodificar' AND idestructura = '$idestructura'"
                );
                if (isset($arraygrupoestructuras[0])
                    && $arraygrupoestructuras[0]->idgrupo != null
                ) {
                    foreach ($arraygrupoestructuras as $grupoestructura) {
                        $grupoestructura->delete();
                    }
                    $arrayestruct
                        = $this->integrator->seguridad->dominoHastaUsuario(
                        $certificado, $idestructura, $tipoestructura, $dominio
                    );
                    if (isset($arrayestruct[0])) {
                        foreach ($arrayestruct as $estruct) {
                            $tipoestruct = $estruct['tipo'];
                            $idestruct = $estruct['idestructura'];
                            if ($tipoestruct == 'cargo') {
                                $idestruct = $estruct['idcargo'];
                            }
                            $dominio = $estruct['dominio'];
                            $this->EliminarIntegrantesRecursiva(
                                $idgrupomodificar, $idestruct, $tipoestruct,
                                $certificado, $dominio
                            );
                        }
                    }
                }                
            }
        } else {
            if ($tipoestructura == 'cargo') {                   
                DatGrupoDatCargo:: Eliminar($idgrupomodificar, $idestructura);
                $arrayestruct
                    = $this->integrator->seguridad->dominoHastaUsuario(
                    $certificado, $idestructura, $tipoestructura, $dominio
                );
                if (isset($arrayestruct[0])) {
                    foreach ($arrayestruct as $estruct) {
                        $tipoestruct = null;
                        $idestruct = $estruct['idusuario'];
                        $dominio = 1;
                        $this->EliminarIntegrantesRecursiva(
                            $idgrupomodificar, $idestruct, $tipoestruct,
                            $certificado, $dominio
                        );
                    }
                }                
            } else {
                DatGrupoDatUsuario::Eliminar($idgrupomodificar, $idestructura);
            }
        }
    }

    public function EliminarRelacionConGrupo(
        $tipoestructura, $idestructura, $idgrupomodificar
    ) 
    {
        if ($tipoestructura == 'externa') {
            $tabla = 'DatGrupoDatEntidad';
            $sentencia
                = "idgrupo = $idgrupomodificar AND identidad = $idestructura";
        }
        if ($tipoestructura == 'interna') {
            $tabla = 'DatGrupoDatArea';
            $sentencia
                = "idgrupo = $idgrupomodificar AND idarea = $idestructura";
        }
        if ($tipoestructura == 'cargo') {
            $tabla = 'DatGrupoDatCargo';
            $sentencia
                = "idgrupo = $idgrupomodificar AND idcargo = $idestructura";
        }
        if (!$tipoestructura) {
            $tabla = 'DatGrupoDatUsuario';
            $sentencia
                = "idgrupo = $idgrupomodificar AND idusuario = $idestructura";
        }
        $obj = Doctrine::getTable($tabla)->findByDql($sentencia);
        if (isset($obj)) {
            $obj->delete();
        }
    }

    public function EliminarIntegrantesDeGrupo(
        $idgrupomodificar, $elementoseliminar, $gruposeliminar/*, $certificado*/
    ) 
    {
        if ($elementoseliminar) {
            foreach ($elementoseliminar as $elemento) {
                if (!$elemento->tipo) {
                    $arrayidusuarios[] = $elemento->id;
                }
                if ($elemento->tipo == 'cargo') {
                    $arrayidcargos[] = $elemento->id;
                }
                if ($elemento->tipo == 'externa'
                    || $elemento->tipo == 'interna'
                ) {
                    $arrayidestructuras[] = $elemento->id;
                }
            }
            if (isset($arrayidestructuras[0])) {
                $iddominio = $this->global->Perfil->iddominio;
                $arrayTemp = array();
                $arrayestructurashijas
                    = $this->integrator->metadatos->getArrayEstructuras(
                    $arrayidestructuras, $iddominio
                );
                if (isset($arrayestructurashijas[0])) {
                    foreach ($arrayestructurashijas as $estructura) {
                        if ($estructura['idfila'] != null
                            && !count(
                                array_intersect(
                                    array($estructura['idfila']), $arrayTemp
                                )
                            )
                        ) {
                            $arrayidestructuras[] = $estructura['idcargo'];
                            $arrayTemp[] = $estructura['idcargo'];
                        }
                        if ($estructura['idcargo'] != null) {
                            $arrayidcargos[] = $estructura['idcargo'];
                        }
                    }
                    if (isset($arrayidestructuras[0])) {
                        DatGrupoEstructura::EliminarDatosPorIdGrupoIdEstruct(
                            $arrayidestructuras, $idgrupomodificar
                        );
                    }
                }
            }
            if (isset($arrayidcargos[0])) {
                DatGrupoUsuario::EliminarDatosPorIdGrupoIdCargo(
                    $arrayidcargos, $idgrupomodificar
                );
            }
            if (isset($arrayidusuarios[0])) {
                DatGrupoUsuario::EliminarDatosPorIdGrupoIdUsuario(
                    $arrayidusuarios, $idgrupomodificar
                );
            }
        }
        if (isset($gruposeliminar[0])) {
            $arrayidusuarioseliminar = array();
            foreach ($gruposeliminar as $grupo) {
                $arrayidusuarioseliminar[] = $grupo->idusuario;
            }
            if (isset($arrayidusuarioseliminar[0])) {
                DatGrupoUsuario::EliminarDatosPorIdGrupoIdUsuario(
                    $arrayidusuarioseliminar, $idgrupomodificar
                );
            }
        }
        $resp = 1;
        return $resp;
    }

    /**
     * Funcion para eliminar las relaciones de un determinado grupo con entidades,areas,cargos,usuarios y grupos hijos
     *
     */
    public function eliminarDependencias($idgrupo)
    {
        $arraygruposentidades = DatGrupoDatEntidad::BuscarEntidadenGrupo(
            $idgrupo
        ); //elimino relaciones con entidades
        if ($arraygruposentidades) {
            foreach ($arraygruposentidades as $grupoentidad) {
                $idgrupo = $grupoentidad['idgrupo'];
                $identidad = $grupoentidad['identidad'];
                $objgrupoentidad = Doctrine::getTable('DatGrupoDatEntidad')
                    ->findByDql(
                        "idgrupo = $idgrupo and identidad = $identidad"
                    );
                $objgrupoentidad[0]->delete();
            }
        }
        $arraygruposareas = DatGrupoDatArea::BuscarAreaenGrupo(
            $idgrupo
        ); //elimino relaciones con areas
        if ($arraygruposareas) {
            foreach ($arraygruposareas as $grupoarea) {
                $idgrupo = $grupoarea['idgrupo'];
                $idarea = $grupoarea['idarea'];
                $objgrupoarea = Doctrine::getTable('DatGrupoDatArea')
                    ->findByDql("idgrupo = $idgrupo and idarea = $idarea");
                $objgrupoarea[0]->delete();
            }
        }
        $arraygruposcargos = DatGrupoDatCargo::BuscarCargoenGrupo(
            $idgrupo
        ); //elimino relaciones con cargos
        if ($arraygruposcargos) {
            foreach ($arraygruposcargos as $grupocargo) {
                $idgrupo = $grupocargo['idgrupo'];
                $idcargo = $grupocargo['idcargo'];
                $objgrupocargo = Doctrine::getTable('DatGrupoDatCargo')
                    ->findByDql("idgrupo = $idgrupo and idcargo = $idcargo");
                $objgrupocargo[0]->delete();
            }
        }
        $arraygruposusuarios = DatGrupoDatUsuario::BuscarUsuariosPorGrupo(
            $idgrupo
        ); //elimino relaciones con usuarios
        if ($arraygruposusuarios) {
            foreach ($arraygruposusuarios as $grupousuario) {
                $idgrupo = $grupousuario['idgrupo'];
                $idusuario = $grupousuario['idusuario'];
                $objgrupousuario = Doctrine::getTable('DatGrupoDatUsuario')
                    ->findByDql(
                        "idgrupo = $idgrupo and idusuario = $idusuario"
                    );
                $objgrupousuario[0]->delete();
            }
        }
    }

    public function CargarUsuariosdelGrupo($idgrupo)
    {
        $arrayusuariosgrupo = Doctrine::getTable('DatGrupoUsuario')->findByDql(
            "idgrupo = '$idgrupo'"
        ); //DatGrupoUsuario::ObtenerDatosPorIdGrupo($idgrupo);
            //DatGrupoDatUsuario::BuscarUsuariosPorGrupo($idgrupo);
        if (isset($arrayusuariosgrupo[0])
            && $arrayusuariosgrupo[0]->idgrupo != null
        ) {
            foreach ($arrayusuariosgrupo as $key => $usuario) {
                $usuariogrupo[$key]['idusuario'] = $usuario->idusuario;
                $usuariogrupo[$key]['denominacion'] = $usuario->alias;
            }
        }
        return $usuariogrupo;
    }

    /**
     * Funcion para cargar el grid donde muestro los alias de cada usuario
     *
     */
    public function CargarGridDeAlias($idgrupo)
    {
        $arrayusuarios = DatGrupoUsuario::BuscarUsuariosPorGrupo($idgrupo);
        return $arrayusuarios;
    }

    /**
     * Funcion para modificar el alias de los usuarios
     *
     */
    public function ModificarAlias($arraycambios)
    {
        foreach ($arraycambios as $usuario) {
            $idgrupo = $usuario->idgrupo;
            $idusuario = $usuario->idusuario;
            $objgrupocargousuario = Doctrine::getTable('DatGrupoUsuario')
                ->findByDql(
                    "idgrupo = '$idgrupo' AND idusuario = '$idusuario'"
                );
            if (isset($objgrupocargousuario[0])
                && $objgrupocargousuario[0]->idgrupo != null
            ) {
                $objgrupocargousuario[0]->alias = $usuario->alias;
                $objgrupocargousuario->save();
            }
        }
    }

    /**
     * Funcion para cargar las estructuras de mi dominio
     *
     */
    public function CargarEstructuras(
        $idestructura, $estamodificando, $idgrupoamodificar, $tipo
    ) 
    {
        $arrayestructuras = array();
        if ($tipo == 'cargo') {
            $arrayidestructuras[] = $idestructura;
            $arrayidpersonas
                = $this->integrator->pvd->BuscarPersonasdadoarrayIdEntidadoCargos(
                $arrayidestructuras
            );
            $arrayestructuras
                = $this->integrator->seguridad->getUsersInformationByArrayIdPersona(
                $arrayidpersonas
            );
        } else {
            $arrayestructuras
                = $this->integrator->seguridad->dominoHastaUsuario(
                $idestructura
            );
        }
        if (isset($arrayestructuras[0])) {
            foreach ($arrayestructuras as $key => $estructura) {
                $checked = false;
                $idestructura = $estructura['idestructura'];
                if ($estructura['cargo'] || $estructura['idusuario']) {
                    if ($estructura['cargo']) {
                        $campo = 'idcargo';
                    } else {
                        $idestructura = $estructura['idusuario'];
                        $campo = 'idusuario';
         //Agregar la restriccion para cuando sea un cargo donde se tiene un rol
                    }
                    if ($estamodificando) {
                        $existecargousuario = Doctrine::getTable(
                            'DatGrupoUsuario'
                        )->findByDql(
                            "idgrupo = '$idgrupoamodificar' AND " . $campo . " = '$idestructura'"
                        );
                        if (isset($existecargousuario[0])
                            && $existecargousuario[0]->idgrupo != null
                        ) {
                            $checked = true;
                        }
                    }
                } else {
                    $arrayestructuras[$key]['iconCls'] = 'entidad';
                    if ($estructura['tipo'] == 'interna') {
                        $arrayestructuras[$key]['iconCls'] = 'area';
                    }
                    if ($estamodificando) {
                        $existeestructura = Doctrine::getTable(
                            'DatGrupoEstructura'
                        )->findByDql(
                            "idgrupo = '$idgrupoamodificar' AND idestructura = '$idestructura'"
                        );
                        if (isset($existeestructura[0])
                            && $existeestructura[0]->idgrupo != null
                        ) {
                            $checked = true;
                        }
                    }
                    $arrayestructuras[$key]['checked'] = $checked;
                }
                /* if($estamodificando)
                  {
                  $idestructura = $estructura['idestructura'];
                  if($estructura['cargo'] || $estructura['idusuario'])
                  {
                  if($estructura['cargo'])
                  {
                  //$idestructura = $estructura['idcargo'];
                  $campo = 'idcargo';
                  }
                  else
                  {
                  //$arrayestructuras[$key]['dominio'] = true;
                  //$idestructura = $estructura['id'];
                  $idestructura = $estructura['idusuario'];
                  $campo = 'idusuario';
                  }
                  }
                  else
                  {
                  $arrayestructuras[$key]['iconCls'] = 'entidad';
                  if($estructura['tipo'] == 'interna')
                  {$arrayestructuras[$key]['iconCls'] = 'area';}
                  $existeestructura = Doctrine::getTable('DatGrupoEstructura')->findByDql(
                  "idgrupo = '$idgrupoamodificar' AND idestructura = '$idestructura'");
                  if(isset($existeestructura[0]) && $existeestructura[0]->idgrupo != null)
                  {$arrayestructuras[$key]['checked'] = true;}
                  }
                  } else {
                  if($estructura['cargo'] || $estructura['idusuario']) {

                  } else {

                  }
                  if($estructura['tipo'] == 'externa') {
                  $arrayestructuras[$key]['iconCls'] = 'entidad';
                  $arrayestructuras[$key]['dominio'] = $dominio;
                  }
                  if($estructura['tipo'] == 'interna')
                  {
                  $arrayestructuras[$key]['iconCls'] = 'area';
                  $arrayestructuras[$key]['interna'] = $dominio;
                  }
                  if($estructura['tipo'] == 'cargo')
                  {
                  $arrayestructuras[$key]['iconCls'] = 'cargo';
                  $arrayestructuras[$key]['dominio'] = $dominio;
                  }
                  if(!$estructura['tipo'])
                  {
                  $arrayestructuras[$key]['iconCls'] = 'usuario';
                  $arrayestructuras[$key]['dominio'] = $dominio;
                  }
                  } */
            }
        }
        /* $estaendominio = 0;
          if($dominio == 'true'){$estaendominio = 1;}
          $arrayestructuras = $this->integrator->seguridad->dominoHastaUsuario(
          $certificado,$idpuntoestructural,$tipo,$estaendominio );
          if($estamodificando == 'true')
          {
          foreach($arrayestructuras as $key=>$estructura)
          {
          if($estructura['tipo'] == 'externa' || $estructura['tipo'] == 'interna')
          {
          $idestructura = $estructura['idestructura'];
          $arrayestructuras[$key]['iconCls'] = 'entidad';
          if($estructura['tipo'] == 'interna')
          {$arrayestructuras[$key]['iconCls'] = 'area';}
          $existeestructura = Doctrine::getTable('DatGrupoEstructura')->findByDql(
          "idgrupo = '$idgrupoamodificar' AND idestructura = '$idestructura'");
          if(isset($existeestructura[0]) && $existeestructura[0]->idgrupo != null)
          {$arrayestructuras[$key]['checked'] = true;}
          } else {
          if($estructura['tipo'] == 'cargo') {
          $idestructura = $estructura['idcargo'];
          $campo = 'idcargo';
          }else {
          $arrayestructuras[$key]['dominio'] = true;
          $idestructura = $estructura['id'];
          $campo = 'idusuario';
          }
          $existecargousuario = Doctrine::getTable('DatGrupoUsuario')->findByDql(
          "idgrupo = '$idgrupoamodificar' AND ".$campo." = '$idestructura'");
          if(isset($existecargousuario[0]) && $existecargousuario[0]->idgrupo != null)
          {$arrayestructuras[$key]['checked'] = true;}
          }
          }
          echo json_encode($arrayestructuras);return;
          } else {
          foreach($arrayestructuras as $key=>$estructura)
          {
          if($estructura['tipo'] == 'externa') {
          $arrayestructuras[$key]['iconCls'] = 'entidad';
          $arrayestructuras[$key]['dominio'] = $dominio;
          }
          if($estructura['tipo'] == 'interna') {
          $arrayestructuras[$key]['iconCls'] = 'area';
          $arrayestructuras[$key]['interna'] = $dominio;
          }
          if($estructura['tipo'] == 'cargo') {
          $arrayestructuras[$key]['iconCls'] = 'cargo';
          $arrayestructuras[$key]['dominio'] = $dominio;
          } if(!$estructura['tipo'])
          {
          $arrayestructuras[$key]['iconCls'] = 'usuario';
          $arrayestructuras[$key]['dominio'] = $dominio;
          }
          }
          }
          echo json_encode($arrayestructuras);return; */
    }

    /**
     * Funcion para desactivar un grupo
     *
     */
    public function DesactivarGrupos($idusuariocrea, $arrayidgrupos)
    {
        if (isset($arrayidgrupos[0])) {
            foreach ($arrayidgrupos as $key => $idgrupo) {
                $objgrupo = Doctrine::getTable('DatGrupo')->find($idgrupo);
                $objgrupo->activo = 0;
                $objgrupo->save();
                $arraygrupos[$key] = $objgrupo;
                //procedo a eliminar los permisos para y sobre el grupo		  
                $existepermisoparaelgrupo
                    = DatPermiso::GetPermisosParaDadoIdusuariocrea(
                    $idgrupo, $idusuariocrea
                );
                if ($existepermisoparaelgrupo) {
                    foreach ($existepermisoparaelgrupo as $key => $permiso) {
                        $idpermiso = $permiso['idpermiso'];
                        $perm = Doctrine::getTable('DatPermiso')->find(
                            $idpermiso
                        );
                        $arrayidpermiso[] = $perm;
                    }
                }
                $existepermisosobreelgrupo
                    = DatPermiso::GetPermisosSobreDadoIdusuariocrea(
                    $idgrupo, $idusuariocrea
                );
                if ($existepermisosobreelgrupo) {
                    foreach ($existepermisosobreelgrupo as $key => $permiso) {
                        $idpermiso = $permiso['idpermiso'];
                        $perm = Doctrine::getTable('DatPermiso')->find(
                            $idpermiso
                        );
                        $arrayidpermiso[] = $perm;
                    }
                }
            }
            $objpermiso = new GestionarpermisosModel();
            $objpermiso->EliminarPermiso($idusuariocrea, $arrayidpermiso);
        }
    }

    /**
     * Funcion para activar un grupo
     *
     */
    public function ActivarGrupos($totalidgrupos)
    {
        if ($totalidgrupos) {
            $idusuariocrea = $this->global->Perfil->idusuario;
            $arraypermsospara[0]->idusuario = $idusuariocrea;
            $arraypermsospara[0]->tipo = 1;
            $arraypermsospara[0]->denominacion
                = $this->integrator->seguridad->nombreUsuario($idusuariocrea);
            $arraypermisos->leer = 1;
            $arraypermisos->anadir = 1;
            $arraypermisos->modificar = 1;
            $arraypermisos->eliminar = 1;
            foreach ($totalidgrupos as $key => $idgrupo) {
                $objgrupo = Doctrine::getTable('DatGrupo')->find($idgrupo);
                $objgrupo->activo = 1;
                $objgrupo->save();
                //procedo a crear los permisos por defecto sobre ese grupo
                $arraypermsossobre[$key]->idgrupo = $idgrupo;
                $arraypermsossobre[$key]->tipo = 0;
                $arraypermsossobre[$key]->denominacion = Doctrine::getTable(
                    'DatGrupo'
                )->find($idgrupo)->dengrupo;
                $arraypermsossobre[$key]->esgrupo = 1;
            }
            $objpermisosmodel = new GestionarpermisosModel();
            $objpermisosmodel->AdicionarPermiso(
                $idusuariocrea, $arraypermsospara, $arraypermsossobre,
                $arraypermisos
            );
        }
    }

    /**
     * Funcion para cargar los grupos existentes
     *
     */
    public function CargarGruposExistentes(
        $idusuariosession, $estamodificando, $idgrupoamodificar, $idgrupo,
        $idusuario/*, $tipo*/
    ) 
    {
        switch ($idgrupo) {
            case 'nodo2' :
                $count = 0;
                $misgrupos = DatGrupo::GetGruposPorPropietario(
                    $idusuariosession
                );
                if ($misgrupos) {
                    foreach ($misgrupos as $grupo) {
                        $ischecked = false;
                        $idgrupop = $grupo['idgrupo'];
                        $leaf = true;                       
                        $tieneusuarios = Doctrine::getTable('DatGrupoUsuario')
                            ->findByDql("idgrupo = '$idgrupop'");
                        if (isset($tieneusuarios[0])
                            && $tieneusuarios[0]->idgrupo != null
                        ) {
                            $leaf = false;
                        }
                        if ($estamodificando == 'true') {
                            if ($idgrupoamodificar != $grupo['idgrupo']) {
                                $arraygruposs[$count]['id'] = $grupo['idgrupo'];
                                $arraygruposs[$count]['text']
                                    = $grupo['dengrupo'];
                                $arraygruposs[$count]['idgrupo']
                                    = $grupo['idgrupo'];
                                $arraygruposs[$count]['iconCls'] = 'grupo';
                                $arraygruposs[$count]['tipo'] = 0;
                                $arraygruposs[$count]['draggable'] = false;
                                //$arraygruposs[$count]['checked'] = $ischecked;			 
                                $arraygruposs[$count]['leaf'] = $leaf;
                                $count++;
                            }
                        }
                        if ($estamodificando == 'false') {
                            $arraygruposs[$count]['id'] = $grupo['idgrupo'];
                            $arraygruposs[$count]['text'] = $grupo['dengrupo'];
                            $arraygruposs[$count]['idgrupo']
                                = $grupo['idgrupo'];
                            $arraygruposs[$count]['iconCls'] = 'grupo';
                            $arraygruposs[$count]['tipo'] = 0;
                            $arraygruposs[$count]['draggable'] = false;
                            //$arraygruposs[$count]['checked'] = $ischecked;			 
                            $arraygruposs[$count]['leaf'] = $leaf;
                            $count++;
                        }
                    }
                }
                return $arraygruposs;
                break;
            default:
                $cont = 0;
                $arrayusuarioscargos = Doctrine::getTable('DatGrupoUsuario')
                    ->findByDql("idgrupo = '$idgrupo'");
                if (isset($arrayusuarioscargos[0])
                    && $arrayusuarioscargos[0]->idgrupo != null
                ) {
                    foreach ($arrayusuarioscargos as $usuariocargo) {
                        $ischecked = false;
                        $idusuario = $usuariocargo->idusuario;
                        if ($estamodificando == 'true') {
                            $existenusuariosengrupo = Doctrine::getTable(
                                'DatGrupoUsuario'
                            )->findByDql(
                                "idgrupo = '$idgrupoamodificar' AND idusuario = '$idusuario'"
                            );
                            if (isset($existenusuariosengrupo[0])
                                && $existenusuariosengrupo[0]->idgrupo != null
                            ) {
                                $ischecked = true;
                            }
                        }
                        $arrayusuarios[$cont]['id'] = $idgrupo . $idusuario;
                        $arrayusuarios[$cont]['text'] = $usuariocargo->alias;
                        $arrayusuarios[$cont]['idusuario'] = $idusuario;
                        $arrayusuarios[$cont]['idgrupo'] = $idgrupo;
                        $arrayusuarios[$cont]['tipo'] = 1;
                        $arrayusuarios[$cont]['iconCls'] = 'usuario';
                        $arrayusuarios[$cont]['draggable'] = false;
                        $arrayusuarios[$cont]['leaf'] = true;
                        $arrayusuarios[$cont]['checked'] = $ischecked;
                        $cont++;
                    }
                }
                return $arrayusuarios;
        }
    }

    public function actualizarGruposDPO($arrayUser, $cargo, $accion)
    {
        //cuando elimina obtengo id en $arrayUser[0];
        switch ($accion) {
            case 'I':
                $arrayelementos = $this->ObtenerArrayPadres(
                    $arrayUser[0], 'usuario', $arrayelementos, $cargo,
                    $tipopadre = 'cargo', $idhijo = null, $tipohijo = null
                );
                $this->ActualizarGruposConElementos(
                    $arrayelementos, $accion = 'a'
                );
                break;
            case 'M':
                break;
            case'E':
                $this->ActualizarGruposConElementos($arrayUser, $accion = 'e');
                break;
        }
        // $area = $this->integrator->metadatos->DameAreasPorId($idestructuraop);
    }

    public function ActualizarGruposConElementos($arrayelementos, $accion)
    {
        if ($accion == 'a') {
            $actualizado = 0;
            if (isset($arrayelementos['entidades'][0])) {
                foreach ($arrayelementos['entidades'] as $entidad) {
                    $existerelacion = DatGrupoDatEntidad::Buscar(
                        $entidad['identidad']
                    );
                    if (isset($existerelacion[0])) {
                        $actualizado = 1;
                        foreach ($existerelacion as $key => $relacion) {
                            $arrayidgrupos[$key]['idgrupo']
                                = $relacion['idgrupo'];
                        }
                        $idhijo = $entidad['idhijo'];
                        $tipohijo = $entidad['tipohijo'];
                        $this->ActualizarEntidadesAreasCargos(
                            $arrayelementos, $arrayidgrupos, $idhijo, $tipohijo,
                            $entidad['identidad'], 'entidad'
                        );
                    }
                }
            }
            if ($actualizado == 0) {
                if (isset($arrayelementos['areas'][0])) {
                    foreach ($arrayelementos['areas'] as $area) {
                        $existerelacion = DatGrupoDatArea::Buscar(
                            $area['idarea']
                        );
                        if (isset($existerelacion[0])) {
                            $actualizado = 1;
                            foreach ($existerelacion as $key => $relacion) {
                                $arrayidgrupos[$key]['idgrupo']
                                    = $relacion['idgrupo'];
                            }                            
                        }
                    }
                }
            }
        }
        if ($accion == 'e') {
            if (isset($arrayelementos[0])) {
                foreach ($arrayelementos as $elemento) {
                    $idusuario = $elemento;
                    $arraygruposusers
                        = DatGrupoDatUsuario::DameGruposDadoIdUsuario(
                        $idusuario
                    );
                    if (isset($arraygruposusers[0])) {
                        foreach ($arraygruposusers as $grupouser) {
                            $idgrupo = $grupouser['idgrupo'];
                            $iduser = $grupouser['idusuario'];
                            $existe = DatGrupoDatUsuario::ExisteUsuarioEnGrupo(
                                $idgrupo, $iduser
                            );
                            if (isset($existe[0])) {
                                $objusuariogrup = Doctrine::getTable(
                                    'DatGrupoDatUsuario'
                                )->findByDql(
                                    "idgrupo = $idgrupo AND idusuario = $iduser"
                                );
                                $objusuariogrup->delete();
                            }                           
                              //if($objusuariogrup->idgrupo)                               
                        }
                    }
                }
            }
        }
    }

    public function ObtenerArrayPadres(
        $idestructura, $tipoestruct, $arrayelementos, $idelementopadre,
        $tipopadre, $idhijo, $tipohijo
    ) 
    {
        switch ($tipoestruct) {
            case 'usuario':
                $arrayelementos['usuarios'][]
                    = array('idusuario' => $idestructura,
                            'idcargo'   => $idelementopadre,
                            'tipopadre' => 'cargo', 'idhijo' => $idhijo,
                            'tipohijo'  => $tipohijo);
                $arraydatoscargo = $this->integrator->metadatos->DameCargoPorId(
                    $idelementopadre
                );
                $idarea
                    = $arraydatoscargo[0]->DatCargomtar[0]['DatCargo']['idestructuraop'];
                $arrayelementos = $this->ObtenerArrayPadres(
                    $idelementopadre, 'cargo', $arrayelementos, $idarea,
                    $tipopadre = 'area', $idestructura, 'usuario'
                );
                break;
            case 'cargo':
                $arrayelementos['cargos'][] = array('idcargo'   => $idestructura,
                                                    'idarea'    => $idelementopadre,
                                                    'tipopadre' => 'area',
                                                    'idhijo'    => $idhijo,
                                                    'tipohijo'  => $tipohijo);
                $arraypadre = $this->integrator->metadatos->ObtenerTipoPadre(
                    $idelementopadre, false
                );
                if ($arraypadre[0]->id != $idelementopadre) {
                    $idpadre = $arraypadre[0]->id;
                    $tipopadre = 'area';
                }
                if ($arraypadre[0]->id == $idelementopadre) {
                    $idpadre = $arraypadre[0]->idestructura;
                    $tipopadre = 'entidad';
                }
                $arrayelementos = $this->ObtenerArrayPadres(
                    $idelementopadre, 'area', $arrayelementos, $idpadre,
                    $tipopadre, $idestructura, 'cargo'
                );
                break;
            case 'area':
                $arrayelementos['areas'][] = array('idarea'    => $idestructura,
                                                   'idpadre'   => $idelementopadre,
                                                   'tipopadre' => $tipopadre,
                                                   'idhijo'    => $idhijo,
                                                   'tipohijo'  => $tipohijo);
                if ($tipopadre == 'area') {
                    $boleano = false;
                } else {
                    $boleano = true;
                }
                $datospadre = $this->integrator->metadatos->ObtenerTipoPadre(
                    $idelementopadre, $boleano
                );
                $tipoestruct = $tipopadre;
                if ($tipopadre == 'area') {
                    if ($datospadre[0]->id != $idelementopadre) {
                        $idpadre = $arraypadre[0]->id;
                        $tipopadre = 'area';
                    }
                    if ($datospadre[0]->id == $idelementopadre) {
                        $idpadre = $arraypadre[0]->idestructura;
                        $tipopadre = 'entidad';
                    }
                } else {
                    if ($datospadre[0]->id != $idelementopadre) {
                        $idpadre = $datospadre[0]->id;
                        $tipopadre = 'entidad';
                    }
                    if ($datospadre[0]->id == $idelementopadre) {
                        $idpadre = $idelementopadre;
                        $tipopadre = 'same';
                    }
                }
                $arrayelementos = $this->ObtenerArrayPadres(
                    $idelementopadre, $tipoestruct, $arrayelementos, $idpadre,
                    $tipopadre, $idestructura, 'area'
                );
                break;
            case 'entidad':
                $arrayelementos['entidades'][]
                    = array('identidad' => $idestructura,
                            'idpadre'   => $idelementopadre,
                            'tipopadre' => $tipopadre, 'idhijo' => $idhijo,
                            'tipohijo'  => $tipohijo);
                $datospadre = $this->integrator->metadatos->ObtenerTipoPadre(
                    $idestructura, true
                );
                if ($datospadre[0]->id != $idestructura) {
                    $idpadre = $arraypadre[0]->id;
                    $this->ObtenerArrayPadres(
                        $idpadre, 'entidad', $arrayelementos, $idpadre,
                        'entidad', $idestructura, 'entidad'
                    );
                }
                if ($datospadre[0]->id == $idestructura) {
                    return $arrayelementos;
                }
                break;
        }
        return $arrayelementos;
    }

    public function RelacionarUsuariosConGrupo($arraygruposcargo, $idusuario)
    {
        foreach ($arraygruposcargo as $grupocargo) {
            $idgrupo = $grupocargo['idgrupo'];
            $nombreusuario = $this->integrator->seguridad->nombreUsuario(
                $idusuario
            );
            $objgu = new DatGrupoDatUsuario();
            $objgu->idgrupo = $idgrupo;
            $objgu->idusuario = $idusuario;
            $objgu->alias = $nombreusuario;
            $objgu->save();
        }
    }

    public function RelacionarCargosConGrupo(
        $arraygruposarea, $idcargo, $idusuario
    )
    {
        foreach ($arraygruposarea as $key => $grupoarea) {
            $idgrupo = $grupoarea['idgrupo'];
            $objga = new DatGrupoDatCargo();
            $objga->idgrupo = $idgrupo;
            $objga->idcargo = $idcargo;
            $objga->todos = true;
            $objga->save();
            $arraygruposcargo[$key]['idgrupo'] = $idgrupo;
        }
        $this->RelacionarUsuariosConGrupo($arraygruposcargo, $idusuario);
    }

    public function ActualizarEntidadesAreasCargos(
        $arrayelementos, $arrayidgrupos, $idestructurahija, $tipoestructurahija/*,
        $idestructurapadre, $tipoestructurapadre*/
    ) 
    {
        switch ($tipoestructurahija) {
            case 'entidad':
                foreach ($arrayidgrupos as $idgrupo) {
                    $iddgrupo = $idgrupo['idgrupo'];
                    $existerelacion = DatGrupoDatEntidad::ExisteEntidadenGrupo(
                        $iddgrupo, $idestructurahija
                    );
                    if (!isset($existerelacion[0])) {
                        $objentgrupo = new DatGrupoDatEntidad();
                        $objentgrupo->idgrupo = $iddgrupo;
                        $objentgrupo->identidad = $idestructurahija;
                        $objentgrupo->todos = true;
                        $objentgrupo->save();
                    }
                }
                foreach ($arrayelementos['entidades'] as $entidad) {
                    if ($entidad['identidad'] == $idestructurahija) {
                        $idhijo = $entidad['idhijo'];
                        $tipohijo = $entidad['tipohijo'];
                        $this->ActualizarEntidadesAreasCargos(
                            $arrayelementos, $arrayidgrupos, $idhijo, $tipohijo,
                            $idestructurahija, 'entidad'
                        );
                    }
                }
                break;
            case 'area':
                foreach ($arrayidgrupos as $idgrupo) {
                    $iddgrupo = $idgrupo['idgrupo'];
                    $existerelacion = DatGrupoDatArea::ExisteAreaenGrupo(
                        $iddgrupo, $idestructurahija
                    );
                    if (!isset($existerelacion[0])) {
                        $objareagrupo = new DatGrupoDatArea();
                        $objareagrupo->idgrupo = $iddgrupo;
                        $objareagrupo->idarea = $idestructurahija;
                        $objareagrupo->todos = true;
                        $objareagrupo->save();
                    }
                }
                foreach ($arrayelementos['areas'] as $area) {
                    if ($area['idarea'] == $idestructurahija) {
                        $idhijo = $area['idhijo'];
                        $tipohijo = $area['tipohijo'];
                        $this->ActualizarEntidadesAreasCargos(
                            $arrayelementos, $arrayidgrupos, $idhijo, $tipohijo,
                            $idestructurahija, 'area'
                        );
                    }
                }
                break;
            case 'cargo':
                foreach ($arrayidgrupos as $idgrupo) {
                    $iddgrupo = $idgrupo['idgrupo'];
                    $existerelacion = DatGrupoDatCargo::ExisteCargoenGrupo(
                        $iddgrupo, $idestructurahija
                    );
                    if (!isset($existerelacion[0])) {
                        $objcargogrupo = new DatGrupoDatCargo();
                        $objcargogrupo->idgrupo = $iddgrupo;
                        $objcargogrupo->idcargo = $idestructurahija;
                        $objcargogrupo->todos = true;
                        $objcargogrupo->save();
                    }
                }
                foreach ($arrayelementos['cargos'] as $cargo) {
                    if ($cargo['idcargo'] == $idestructurahija) {
                        $idhijo = $cargo['idhijo'];
                        $tipohijo = $cargo['tipohijo'];
                        $this->ActualizarEntidadesAreasCargos(
                            $arrayelementos, $arrayidgrupos, $idhijo, $tipohijo,
                            $idestructurahija, 'cargo'
                        );
                    }
                }
                break;
            case 'usuario':
                /* foreach($arrayidgrupos as $idgrupo)
                  {
                  $objuser = new DatUsuarioPdo();
                  $objuser->idusuario = $idestructurahija;
                  $objuser->idcargo = $idestructurapadre;
                  $objuser->idnivel = null;
                  $objuser->denusuario = null;
                  $objuser->save();
                  $objcargogrupo = new DatGrupoDatUsuario();
                  $objcargogrupo->idgrupo = $idgrupo['idgrupo'];
                  $objcargogrupo->idusuario = $idestructurahija;
                  $objcargogrupo->alias = $this->integrator->seguridad->nombreUsuario(
                  $idestructurahija);
                  $objcargogrupo->save();
                  } */
                break;
        }
    }

}


