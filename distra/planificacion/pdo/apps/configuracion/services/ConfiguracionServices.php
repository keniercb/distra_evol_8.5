<?php

class ConfiguracionServices extends ZendExt_Model
{

    public function GetTodosNomencladoresPorTipo($tiponomen, $idUsuarioCrea)
    {
        $parametros->categoria = true;
        $model = new NomNomencladorModel();
        $result = $model->listarNomencladores(
            $tiponomen, $idUsuarioCrea, $filters = array(), null, $parametros
        ); //GestionarnomencladoresModel::cargarNomencladoresNom($tiponomen, 
        // $idUsuarioCrea,$filters = array());
        //NomNomencladorModel::cargarNomencladores($tiponomen, $idUsuarioCrea);
        return $result->data;
    }

    public function DameCategoriasHijas(/* $idnomencladorpadre */)
    {
        $arraynomencladoreshijos = NomNomenclador::DameNomencladoresHijos(
            $idpadre
        );
        if (count($arraynomencladoreshijos) > 0) {
            foreach ($arraynomencladoreshijos as $key => $nomencladorhijo) {
                $arraidnomhijo[$key]['idnomenclador']
                    = $nomencladorhijo['idnomenclador'];
            }
        }
        return $arraidnomhijo;
    }

    public function DameArbolDeGrupos(
        $idusuario, $idgrupo, $estamodificando, $idcomponente, $idelemento,
        $certificado, $iddominio
    ) {
        $objpermiso = new GestionarpermisosModel();
        switch ($idgrupo) {
            case 'nodo1': //mi usuario
                $usuario = $objpermiso->ArbolDeGrupos(
                    $idusuario, $idgrupo, $estamodificando, $idcomponente,
                    $idelemento, $certificado, $iddominio
                );
                return $usuario;
                break;
            case 'nodo2': //mis grupos
                $arraygrupos = $objpermiso->ArbolDeGrupos(
                    $idusuario, $idgrupo, $estamodificando, $idcomponente,
                    $idelemento, $certificado, $iddominio
                );
                return $arraygrupos;
                break;
            case 'nodo3': //mis usuarios subordinados
                $arrayusersdomain = $objpermiso->ArbolDeGrupos(
                    $idusuario, $idgrupo, $estamodificando, $idcomponente,
                    $idelemento, $certificado, $iddominio
                );
                return $arrayusersdomain;
                break;
            default: //usuarios del grupo
                $usuariosgrupos = $objpermiso->ArbolDeGrupos(
                    $idusuario, $idgrupo, $estamodificando, $idcomponente,
                    $idelemento, $certificado, $iddominio
                );
                return $usuariosgrupos;
        }
    }

    public function DameInvolucradosAdicionar(
        $nodo, $idusuario, $idelemento, $tipo, $idgrupo, $estamodificando,
        $tipoelemento, $iddominio, $certificado, $idautor
    ) {
        if ($idautor == 'null' || $idautor == 'nulo') {
            $idautor = $idusuario;
        }
        $objpermiso = new GestionarpermisosModel();
        switch ($idgrupo) {
            case 'nodo1': //mi usuario
                $usuario = $objpermiso->CargarPermisosParaAdicionar(
                    $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
                    $estamodificando, $tipoelemento, $iddominio, $certificado,
                    $idautor
                );
                return $usuario;
                break;
            case 'nodo2': //mis grupos
                $arraygrupos = $objpermiso->CargarPermisosParaAdicionar(
                    $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
                    $estamodificando, $tipoelemento, $iddominio, $certificado,
                    $idautor
                );
                return $arraygrupos;
                break;
            case 'nodo3': //mis usuarios subordinados
                //print_r('tutut');die;
                $arrayusersdomain = $objpermiso->CargarPermisosParaAdicionar(
                    $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
                    $estamodificando, $tipoelemento, $iddominio, $certificado,
                    $idautor
                );
                return $arrayusersdomain;
                break;
            case 'nodo4': //mis permisos de adicionar sobre otras personas o grupos
                $mispermisos = $objpermiso->CargarPermisosParaAdicionar(
                    $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
                    $estamodificando, $tipoelemento, $iddominio, $certificado,
                    $idautor
                );
                return $mispermisos;
                break;
            default:
                $usersandgrupos = $objpermiso->CargarPermisosParaAdicionar(
                    $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
                    $estamodificando, $tipoelemento, $iddominio, $certificado,
                    $idautor
                );
                return $usersandgrupos;
        }
    }

    public function DameArbolBuscarPorInvolucradoCalendario(
        $nodo, $idusuario, $tipo, $idgrupo, $iddominio, $certificado
    ) {
        $objpermiso = new GestionarpermisosModel();
        switch ($idgrupo) {
            case 'nodo1':
                $usuario = $objpermiso->DameArbolBuscarPorInvolucradoCalendario(
                    $nodo, $idusuario, $tipo, $idgrupo, $iddominio, $certificado
                );
                return $usuario;
                break;
            case 'nodo2':
                $arraygrupos
                    = $objpermiso->DameArbolBuscarPorInvolucradoCalendario(
                    $nodo, $idusuario, $tipo, $idgrupo, $iddominio, $certificado
                );
                return $arraygrupos;
                break;
            case 'nodo3':
                $arrayusersdomain
                    = $objpermiso->DameArbolBuscarPorInvolucradoCalendario(
                    $nodo, $idusuario, $tipo, $idgrupo, $iddominio, $certificado
                );
                return $arrayusersdomain;
                break;
            case 'nodo4':
                $otros = $objpermiso->DameArbolBuscarPorInvolucradoCalendario(
                    $nodo, $idusuario, $tipo, $idgrupo, $iddominio, $certificado
                );
                return $otros;
                break;
            default:
                $usersandgrupos
                    = $objpermiso->DameArbolBuscarPorInvolucradoCalendario(
                    $nodo, $idusuario, $tipo, $idgrupo, $iddominio, $certificado
                );
                return $usersandgrupos;
        }
    }

    public function DameColorCategoriaActividad($idnomenclador)
    {
        $objcategactividad = Doctrine::getTable('NomCategactividad')->find(
            $idnomenclador
        );
        $coloractividad = $objcategactividad->color;
        return $coloractividad;
    }

    public function DameGruposDondeEstaUsuario($idusuario)
    {
        $arrayidusuarios[0] = $idusuario;
        $arraygrupos = DatGrupoUsuario::BuscarDatosPorIdUsuario(
            $arrayidusuarios
        ); //DatGrupoDatUsuario::DameGruposDadoIdUsuario($idusuario);
        return $arraygrupos;
    }

    public function DameUsuariosDeGrupoGU($idgrupo)
    {
        $arrayusuarios = DatGrupoUsuario::BuscarUsuariosPorGrupo(
            $idgrupo
        ); //DatGrupoDatUsuario::BuscarUsuariosPorGrupo($idgrupo);
        $arrayestructuras = DatGrupoEstructura::BuscarEstructuraPorGrupo(
            $idgrupo
        );
        $resultado = array_merge($arrayusuarios, $arrayestructuras);
        return $resultado;
    }

    public function DameUsuariosDeGrupo($idgrupo)
    {
        $arrayusuarios = DatGrupoUsuario::BuscarUsuariosPorGrupo(
            $idgrupo
        ); //DatGrupoDatUsuario::BuscarUsuariosPorGrupo($idgrupo);
        $arrayestructuras = DatGrupoEstructura::BuscarEstructuraPorGrupo(
            $idgrupo
        );
        $resultado = array_merge($arrayusuarios, $arrayestructuras);

        return $resultado;
    }

    public function actualizarGruposDPO(/* $arrayUser, $cargo, $accion */)
    {
        //$objgrupomodel = new GestionargrupoModel();
        //$objgrupomodel->actualizarGruposDPO($arrayUser, $cargo, $accion);        
    }

    public function DameSubordinados($certificado, $iddominio, $idusuario)
    {
        $objpermisomodel = new GestionarpermisosModel();
        $arraysubordinados = $objpermisomodel->CargarUsuariosDelDominio(
            $certificado, $iddominio, $idusuario
        );
        return $arraysubordinados;
    }

    public function DamePermisosLeer($idusuario)
    {
        $arraydatospermisoleer = DatPermiso::DamePermisosLeer($idusuario);
        if (isset($arraydatospermisoleer[0])) {
            $cont = 0;
            foreach (
                $arraydatospermisoleer as /* $key => */
                $permisoleer
            ) {
                if ($permisoleer['tipopsobre'] == 0) {
                    $usuariosdegrupo = DatGrupoUsuario::BuscarUsuariosPorGrupo(
                        $permisoleer['idpsobre']
                    ); //DatGrupoDatUsuario::BuscarUsuariosPorGrupo($permisoleer['idpsobre']);
                    if (isset($usuariosdegrupo[0])) {
                        foreach ($usuariosdegrupo as $usuario) {
                            $arraydatos[$cont]['idusuario']
                                = $usuario['idusuario'];
                            $arraydatos[$cont]['nombreusuario']
                                = $usuario['alias'];
                            $cont++;
                        }
                    }
                }
                if ($permisoleer['tipopsobre'] == 1) {
                    $arraydatos[$cont]['idusuario'] = $permisoleer['idpsobre'];
                    $arraydatos[$cont]['nombreusuario']
                        = $permisoleer['denpsobre'];
                    $cont++;
                }
            }
        }
        return $arraydatos;
    }

    public function DamePermisosLeerNivelSuperior($idusuario, $idgrupo)
    {
        $arraydatospermisoleerns = DatPermiso::DamePermisosLeerNivelSuperior(
            $idusuario
        );
        if (isset($arraydatospermisoleerns[0])) {
            foreach ($arraydatospermisoleerns as $key => $permiso) {
                $tipo = 1;
                $idusuario = $permiso['idpsobre'];
                $idgrupo = null;
                $leaf = true;
                if ($permiso['tipopsobre'] == 0) {
                    $tipo = 0;
                    $idusuario = null;
                    $idgrupo = $permiso['idpsobre'];
                    $leaf = false;
                }
                $arraydatos[$key]['id'] = $idgrupo . $permiso['idpsobre'];
                $arraydatos[$key]['text'] = $permiso['denpsobre'];
                $arraydatos[$key]['tipo'] = $tipo;
                $arraydatos[$key]['idusuario'] = $idusuario;
                $arraydatos[$key]['idgrupo'] = $idgrupo;
                $arraydatos[$key]['tipoinvol'] = 1;
                $arraydatos[$key]['leaf'] = $leaf;
                $arraydatos[$key]['draggable'] = false;
                $arraydatos[$key]['checked'] = false;
            }
        }
        return $arraydatos;
    }

    public function DamePermisoSubordinados($idusuario)
    {
        $permisosubordinados = DatPermiso::ObtenerPermisosSobreSubordinados(
            $idusuario
        );
        return $permisosubordinados;
    }

    public function DameGruposCreadosPorMi($idusuariocrea)
    {
        $arraygrupos = DatGrupo::GetGruposPorPropietario($idusuariocrea);
        return $arraygrupos;
    }

    public function DameOtrosConPermisoAdicionar($idusuario)
    {
        $arraydatospermiso = DatPermiso::GetPermisosPorAutorParaOtros(
            $idusuario
        );
        if ($arraydatospermiso) {
            $cont = 0;
            foreach ($arraydatospermiso as $permiso) {
                $numeropermiso = $permiso['numpermiso'];
                if ($numeropermiso == 2 || $numeropermiso == 3
                    || $numeropermiso == 7
                    || $numeropermiso ==
                    11
                    || $numeropermiso == 15
                ) {
                    $permisosparaotros[$cont]['idusuario']
                        = $permiso['idppara'];
                    $permisosparaotros[$cont]['nombreusuario']
                        = $permiso['denppara'];
                    $cont++;
                }
            }
        }
        return $permisosparaotros;
    }

    public function DameDatosNomenclador($idnomenclador)
    {
        $objnom = Doctrine::getTable('NomNomenclador')->find($idnomenclador);
        return $objnom;
    }

    public function DameDatosNomencladorXDatos(
        $idnomenclador, $tiponomenclador, $idusuariocrea
    ) {
        $objnom = Doctrine::getTable('NomNomenclador')->findByDql(
            "idnomenclador = $idnomenclador
            AND tiponomenclador = $tiponomenclador 
            AND idusuariocrea = $idusuariocrea"
        );
        return $objnom;
    }

    public function UsuariosSubordinados($idusuario)
    {
        $permisosubordinados = DatPermiso::ObtenerPermisosSobreSubordinados(
            $idusuario
        );
        return $permisosubordinados;
    }

    public function ObtenerNomencladoresCalendario(
        $idusuariosession, $tiponomenclador
    ) {
        $objnommodel = new NomNomencladorModel();
        $arraynomencladores = $objnommodel->ObtenerNomencladoresCalendario(
            $idusuariosession, $tiponomenclador
        );
        return $arraynomencladores;
    }

    public function DameDatosDeGrupo($idgrupo)
    {
        $grupo = Doctrine::getTable('DatGrupo')->find($idgrupo);
        return $grupo;
    }

    public function TienePermisoParaSobre($idppara, $idpsobre)
    {
        $objpermisomodel = new GestionarpermisosModel();
        $arraypermisos = $objpermisomodel->TienePermisoParaSobre(
            $idppara, $idpsobre
        );
        return $arraypermisos;
    }

    public function BuscarInvolucrados($denominacion, $idusuario,
        $estamodificando, $idelemento, $tipoelemento, $permiso
    ) {
        $nombreusuario = $this->global->Perfil->usuario;
        $idusuario = $this->global->Perfil->idusuario;
        //nombre y apellidos de los usuarios
        $denoUsuario = self::getDenominacionIdUsuario(
            $idusuario, 'usuario', null
        );

        $eliminarduplicidad = [];
        $resultado = array();
        $cont = 0;
        //$tipoelemento = 3;
        $objpermisomodel = new GestionarpermisosModel();
        //$estacontenido= eregi($denominacion, $nombreusuario);
        if (eregi($denominacion, $nombreusuario)) {
            $checked = false;
            $tipoinvol = 1;
            $arrayusuario = $objpermisomodel->VerificaSiUsuarioEsInvolucrado(
                $idusuario, $estamodificando, $idelemento, $checked, $tipoinvol,
                $tipoelemento, $idusuario
            );
            if ($arrayusuario['tipoinvol'] == 0) {
                $icon = 'persona';
            } else {
                $icon = 'usuario';
            }

            if( !in_array($idusuario, $eliminarduplicidad, false) ) {
                $eliminarduplicidad[] = $idusuario;
                $resultado[$cont]['id'] = $idusuario;
                $resultado[$cont]['text'] = $nombreusuario;
                $resultado[$cont]['idusuario'] = $idusuario;
                $resultado[$cont]['tipo'] = 1;
                $resultado[$cont]['iconCls'] = $icon;
                $resultado[$cont]['draggable'] = false;
                $resultado[$cont]['leaf'] = true;
                $resultado[$cont]['checked'] = $arrayusuario['checked'];
                $resultado[$cont]['tipoinvol'] = $arrayusuario['tipoinvol'];
                $cont++;
            }
        }
        if (eregi($denominacion, $denoUsuario)) {
            $checked = false;
            $tipoinvol = 1;
            $arrayusuario = $objpermisomodel->VerificaSiUsuarioEsInvolucrado(
                $idusuario, $estamodificando, $idelemento, $checked, $tipoinvol,
                $tipoelemento, $idusuario
            );
            if ($arrayusuario['tipoinvol'] == 0) {
                $icon = 'persona';
            } else {
                $icon = 'usuario';
            }

            if( !in_array($idusuario, $eliminarduplicidad, false) ) {
                $eliminarduplicidad[] = $idusuario;
                $resultado[$cont]['id']        = $idusuario;
                $resultado[$cont]['text']      = $denoUsuario;
                $resultado[$cont]['idusuario'] = $idusuario;
                $resultado[$cont]['tipo']      = 1;
                $resultado[$cont]['iconCls']   = $icon;
                $resultado[$cont]['draggable'] = false;
                $resultado[$cont]['leaf']      = true;
                $resultado[$cont]['checked']   = $arrayusuario['checked'];
                $resultado[$cont]['tipoinvol'] = $arrayusuario['tipoinvol'];
                $cont++;
            }
        }
        //para obtener los grupos
        $objdatgrupo = new DatGrupo();

        $arraydengrupos = $objdatgrupo->DameGruposDadoUsuarioDen(
            $idusuario, $denominacion
        );

        $existengrupos = [];
        foreach($arraydengrupos as $arr ) {
                $existengrupos[] = $arr['idgrupo'];
        }

        $arrayallgrupos = $objdatgrupo->DameGruposDadoUsuarioDen(
             $idusuario, null
           );

        $arrayuniongrupos = array_merge($arraydengrupos, $arrayallgrupos);

        $uniques = [];
        $arraygrupos = [];
        foreach($arrayuniongrupos as $arr ) {
                if( !in_array($arr['idgrupo'], $uniques, false) ) {
                    $uniques[] = $arr['idgrupo'];
                    $arraygrupos[] = $arr;
                }

        }

        if (isset($arraygrupos[0])) {
            foreach ($arraygrupos as $key => $grupo) {
                if ($grupo['activo'] == 1) {
                    $leaf = true;
                    $tienehijosusuarios
                        = DatGrupoUsuario::BuscarUsuariosPorGrupo(
                        $grupo['idgrupo']
                    );

                    if (isset($tienehijosusuarios[0])) {
                        $leaf = false;

                    /**
                                       Buscar dentro de un Grupo
                                                                                                    **/

                        foreach ($tienehijosusuarios as $user) {
                            $checked = false;
                            $tipoinvol = 1;
                            $arrayusuario
                              = $objpermisomodel->VerificaSiUsuarioEsInvolucrado(
                              $user['idusuario'], $estamodificando, $idelemento,
                              $checked, $tipoinvol, $tipoelemento, $user['idusuario']
                            );
                            if ($arrayusuario['tipoinvol'] == 0) {
                                $icon = 'persona';
                            } else {
                                $icon = 'usuario';
                            }
                            $denominacionUser = $this->integrator->seguridad->nombreUsuario(
                              $user['idusuario']
                            );

                            $denominacionPersona = '';
                            $arrayidpersona
                                           = $this->integrator->seguridad->getIdPersonaByIdUsuario(
                              $user['idusuario']
                                );
                                $idpersona = $arrayidpersona[0]['idpersona'];
                                if ($idpersona != null) {
                                    $datospersona
                                      = $this->integrator->pvd->getPrincipalesDatosPersona(
                                      $params[] = $idpersona
                                    );
                                    if ($datospersona->data[0] != '') {
                                        $denominacionPersona
                                          = ($datospersona->data[0]['nombreapellidos']);
                                    }
                                }

                        if (eregi($denominacion, $denominacionUser) || eregi($denominacion, $denominacionPersona)){
                            if( !in_array($user['idusuario'], $eliminarduplicidad, false) ) {
                               $eliminarduplicidad[] = $user['idusuario'];
                                $resultado[$cont]['id'] = $user['idusuario'];
                                $resultado[$cont]['text'] = /*($denominacionPersona!='')?
                                                      $denominacionPersona:*/$denominacionUser;
                                $resultado[$cont]['idusuario'] = $user['idusuario'];
                                $resultado[$cont]['tipo'] = 1;
                                $resultado[$cont]['iconCls'] = $icon;
                                $resultado[$cont]['draggable'] = false;
                                $resultado[$cont]['leaf'] = true;
                                $resultado[$cont]['checked'] = $arrayusuario['checked'];
                                $resultado[$cont]['tipoinvol'] = $arrayusuario['tipoinvol'];
                                $cont++;
                            }
                        }
                    }


                    /*******************************************
                                                                  *******************************************/

                    }

                 if(in_array($grupo['idgrupo'], $existengrupos, false) ) {
                        $checked = false;
                        $tipoinvol = 1;
                        $arraydatos
                          = $objpermisomodel->VerificaSiGrupoEsInvolucrado(
                          $grupo['idgrupo'], $estamodificando, $idelemento,
                          $checked, $tipoinvol, $tipoelemento
                        );
                        if ($arraydatos['tipoinvol'] == 0) {
                            $icon = 'rolesygrupos';
                        } else {
                            $icon = 'rolesygrupos';
                        }

                        if( !in_array($grupo['idgrupo'], $eliminarduplicidad, false) ) {
                               $eliminarduplicidad[] = $grupo['idgrupo'];
                            $resultado[$cont]['id'] = $grupo['idgrupo'];
                            $resultado[$cont]['idgrupo'] = $grupo['idgrupo'];
                            $resultado[$cont]['text'] = $grupo['dengrupo'];
                            $resultado[$cont]['iconCls'] = $icon;
                            $resultado[$cont]['tipo'] = 0;
                            $resultado[$cont]['draggable'] = false;
                            $resultado[$cont]['checked'] = $arraydatos['checked'];
                            $resultado[$cont]['leaf'] = $leaf;
                            $resultado[$cont]['tipoinvol'] = $arraydatos['tipoinvol'];
                            $cont++;
                        }
                    }
                }
            }
        }

        //para obtener los subordinados *********  *********
        $objdatpermiso = new DatPermiso();
        $espara = false;
        $arraypermiso = $objdatpermiso->ObtPermisosDado_UserDenSub(
            $idusuario, $denominacion, $subordinado = 1, $permiso
        );
        if (!$arraypermiso) {
            $arraypermiso = $objdatpermiso->ObtPermisosDado_UserDenSubPara(
                $idusuario, $denominacion, $subordinado = 1, $permiso
            );
            $espara = true;
        }

        if ($arraypermiso) {
            foreach ($arraypermiso as $permiso) {
                $checked = false;
                $tipoinvol = 1;
                $arrayusuario
                    = $objpermisomodel->VerificaSiUsuarioEsInvolucrado(
                    $permiso['idpsobre'], $estamodificando, $idelemento,
                    $checked, $tipoinvol, $tipoelemento, $permiso['idpsobre']
                );
                if ($arrayusuario['tipoinvol'] == 0) {
                    $icon = 'persona';
                } else {
                    $icon = 'usuario';
                }
                $denominacionUser = $this->integrator->seguridad->nombreUsuario(
                    $permiso['idpsobre']
                );
                if ($denominacionUser != null) {
                    $arrayidpersona
                        = $this->integrator->seguridad->getIdPersonaByIdUsuario(
                        $permiso['idpsobre']
                    );
                    $idpersona = $arrayidpersona[0]['idpersona'];
                    if ($idpersona != null) {
                        $datospersona
                            = $this->integrator->pvd->getPrincipalesDatosPersona(
                            $params[] = $idpersona
                        );
                        if ($datospersona->data[0] != '') {
                            $denominacionUser
                                = ($datospersona->data[0]['nombreapellidos']);
                        }
                    }
                } else {
                    $denominacionUser = $permiso['denpsobre'];
                }
                if (eregi($denominacion, $denominacionUser)) {
                    if( !in_array($permiso['idpermiso'], $eliminarduplicidad, false) ) {
                               $eliminarduplicidad[] = $permiso['idpermiso'];
                        $resultado[$cont]['id'] = $permiso['idpermiso'];
                        $resultado[$cont]['text'] = ($espara) ? $permiso['denppara']
                          : $denominacionUser; //$permiso['denpsobre'];
                        $resultado[$cont]['idusuario'] = ($espara)
                          ? $permiso['idppara'] : $permiso['idpsobre'];
                        $resultado[$cont]['tipo'] = 1;
                        $resultado[$cont]['iconCls'] = $icon;
                        $resultado[$cont]['draggable'] = false;
                        $resultado[$cont]['leaf'] = true;
                        $resultado[$cont]['checked'] = $arrayusuario['checked'];
                        $resultado[$cont]['tipoinvol'] = $arrayusuario['tipoinvol'];
                        $cont++;
                    }
                }
            }
        }
        //para obtener los permisos otorgados
        $espara = false;
        $arraypermisos = $objdatpermiso->ObtPermisosDado_UserDenSub(
            $idusuario, $denominacion, $subordinado = 0, $permiso
        );
        if (!$arraypermisos) {
            $arraypermisos = $objdatpermiso->ObtPermisosDado_UserDenSubPara(
                $idusuario, $denominacion, $subordinado = 0, $permiso
            );
            $espara = true;
        }
        if ($arraypermisos) {
            foreach ($arraypermisos as $permisos) {

                $puede = 1;
                $leaf = true;
                if ($permisos['tipopsobre'] == 0) {
                    $objgrupo = Doctrine::getTable('DatGrupo')->find(
                        $permisos['idpsobre']
                    );
                    if ($objgrupo->activo == 1) {
                        $tienehijosusuarios
                            = DatGrupoUsuario::BuscarUsuariosPorGrupo(
                            $permisos['idpsobre']
                        ); //DatGrupoDatUsuario::BuscarUsuariosPorGrupo($permisos['idpsobre']);

                        if (isset($tienehijosusuarios[0])) {
                            $leaf = false;
                        }
                        $checked = false;
                        $tipoinvol = 1;
                        $arrayusuario
                            = $objpermisomodel->VerificaSiGrupoEsInvolucrado(
                            $permisos['idpsobre'], $estamodificando,
                            $idelemento, $checked, $tipoinvol, $tipoelemento
                        );
                        if ($arrayusuario['tipoinvol'] == 0) {
                            $icon = 'rolesygrupos';
                        } else {
                            $icon = 'rolesygrupos';
                        }
                    } else {
                        $puede = 0;
                    }
                }
                if ($permisos['tipopsobre'] == 1) {
                    $checked = false;
                    $tipoinvol = 1;
                    $arrayusuario
                        = $objpermisomodel->VerificaSiUsuarioEsInvolucrado(
                        $permisos['idpsobre'], $estamodificando, $idelemento,
                        $checked, $tipoinvol, $tipoelemento,
                        $permisos['idpsobre']
                    );
                    if ($arrayusuario['tipoinvol'] == 0) {
                        $icon = 'persona';
                    } else {
                        $icon = 'usuario';
                    }
                }
                if ($puede == 1) {
                    if( !in_array($permiso['idpermiso'], $eliminarduplicidad, false) ) {
                               $eliminarduplicidad[] = $permiso['idpermiso'];
                        $resultado[$cont]['id'] = $permisos['idpermiso'];
                        $resultado[$cont]['text'] = ($espara)
                          ? $permisos['denppara'] : $permisos['denpsobre'];
                        $resultado[$cont]['idusuario'] = ($espara)
                          ? $permisos['idppara'] : $permisos['idpsobre'];
                        $resultado[$cont]['idgrupo'] = ($espara)
                          ? $permisos['idppara'] : $permisos['idpsobre'];
                        $resultado[$cont]['tipo'] = $permisos['tipopsobre'];
                        $resultado[$cont]['iconCls'] = $icon;
                        $resultado[$cont]['draggable'] = false;
                        $resultado[$cont]['leaf'] = $leaf;
                        $resultado[$cont]['checked'] = $arrayusuario['checked'];
                        $resultado[$cont]['tipoinvol'] = $arrayusuario['tipoinvol'];
                        $cont++;
                    }
                }
            }
        }
        //Buscar Estructuras
        $otros = self::DameEstructurasRelacionadasbyIduser($idusuario);
        if ($otros) {
            $estructura = GestionarpermisosModel::Buscardenominacion(
                $otros, $denominacion
            );
            if ($estructura[0]) {
                foreach ($estructura as $est) {
                    if( !in_array($est['id'], $eliminarduplicidad, false) ) {
                               $eliminarduplicidad[] = $est['id'];
                    $resultado[$cont]['id'] = $est['id'];
                    $resultado[$cont]['text'] = $est['text'];
                    $resultado[$cont]['idusuario'] = $est['idusuario'];
                    $resultado[$cont]['idgrupo'] = $est['idgrupo'];
                    $resultado[$cont]['tipo'] = $est['tipo'];
                    $resultado[$cont]['iconCls'] = $est['iconCls'];
                    $resultado[$cont]['draggable'] = $est['draggable'];
                    $resultado[$cont]['leaf'] = $est['leaf'];
                    $resultado[$cont]['checked'] = $est['checked'];
                    $resultado[$cont]['tipoinvol'] = $est['tipoinvol'];
                    $cont++;
                   }
                }
            }
        }
        return $resultado;
    }

    public function ObtenerNomencladorPorId($idnom)
    {
        return NomNomenclador::existeNomencladorSegunId($idnom);
    }

    public function ObtenerGruposDeUsuarios($idusuario, $estado)
    {
        $arraygrupos = DatGrupo::ObtenerGruposDeUsuarios($idusuario, $estado);
        return $arraygrupos;
    }

    public function DameInvolucradosAdicionarPreCond(
        $idprecondicion, $tipo, $idgrupo, $estamodificando, $idautor
    ) {

        $objpermiso = new GestionarpermisosModel();
        switch ($idgrupo) {
            case 'nodo1': //mi usuario
                $usuario = $objpermiso->CargarPermisosParaAdicionarPreCond(
                    $idprecondicion, $tipo, $idgrupo, $estamodificando, $idautor
                );
                return $usuario;
                break;
            case 'nodo2': //mis grupos
                $arraygrupos = $objpermiso->CargarPermisosParaAdicionarPreCond(
                    $idprecondicion, $tipo, $idgrupo, $estamodificando, $idautor
                );
                return $arraygrupos;
                break;
            case 'nodo3': //mis usuarios subordinados
                $arrayusersdomain
                    = $objpermiso->CargarPermisosParaAdicionarPreCond(
                    $idprecondicion, $tipo, $idgrupo, $estamodificando, $idautor
                );
                return $arrayusersdomain;
                break;
            case 'nodo4': //mis permisos de adicionar sobre otras personas o grupos
                $mispermisos = $objpermiso->CargarPermisosParaAdicionarPreCond(
                    $idprecondicion, $tipo, $idgrupo, $estamodificando, $idautor
                );
                return $mispermisos;
                break;
            default:
                $usersandgrupos
                    = $objpermiso->CargarPermisosParaAdicionarPreCond(
                    $idprecondicion, $tipo, $idgrupo, $estamodificando, $idautor
                );
                return $usersandgrupos;
        }
    }

    ///Esto es para probar el WorkFlow
    public function GetTruePre(/* $obj */)
    {
        return true;
    }

    public function GetFalsePre(/* $obj */)
    {
        return true;
    }

    public function GetTruePos(/* $obj */)
    {
        return true;
    }

    public function GetFalsePos(/* $obj */)
    {
        return false;
    }

    public function existeSubordinacion($idjefe, $idsubordinado)
    {
        $existesubordinacion = 0;
        $arraysubordinados = Doctrine::getTable('DatSubordinacion')->findByDql(
            "idpadre = $idjefe AND idhijo = $idsubordinado"
        );
        if (isset($arraysubordinados[0]->idpadre)
            && $arraysubordinados[0]->idpadre != null
            && $arraysubordinados[0]->idpadre != ''
        ) {
            $existesubordinacion = 1;
        }
        return $existesubordinacion;
    }

    public function dameJefes($idsubordinado)
    {
        $arrayjefes = DatSubordinacion::obtenerTodosLosJefes($idsubordinado);
        return $arrayjefes;
    }

    public function getConfPerfilxtipoelytipoconf(
        $tipelemento, $idconfi, $idusuario, $idcargaxdefecto
    ) {
        $parametros->idusuario = $idusuario;
        $parametros->tipoconfiguracion = $idconfi;
        $parametros->idcargaxdefecto = $idcargaxdefecto;
        $parametros->idtipoelemento = $tipelemento;
        $result = ConfPerfil::getConfPerfilxtipoelytipoconf($parametros);
        if (isset($result[0])) {
            return $result;
        } else {
            return array();
        }
    }

    public function Cargaxdefecto($parametros)
    {
        $objetoconfiguracionperfil = new CmpconfigurarperfilModel();
        $resultado = $objetoconfiguracionperfil->listarCargasxdefecto(
            $parametros
        );
        return $resultado;
    }

    public function DameEstructurasRelacionadasbyIduser(
        $idusuario, $estamodificando, $idnomenclador
    ) {
        $objAsignarEntidades = new CmpasignarentidadesModel();
        $denoentidades = $objAsignarEntidades->obtenerArbolRelacionesAutor(
            $idusuario, $estamodificando, $idnomenclador
        );
        return $denoentidades;
    }

    public function getInvolucradoConfCalendario($idconfiguracion)
    {
        $objConfCalendarInvolucrados
            = new DatConfperfilcalendarioUsuariosinvolucrados();
        $resultado
            = $objConfCalendarInvolucrados->getInvolucradosConfPerfilCalendario(
            $idconfiguracion
        );
        return $resultado;
    }

    public function getInvolucradoConfComportamiento($idconfiguracion)
    {
        $objConfComportInvolucrados
            = new DatPerfilinvolucradoUsuariosinvolucrados();
        $resultado
            = $objConfComportInvolucrados->getInvolucradosConfPerfilComportamiento(
            $idconfiguracion
        );
        return $resultado;
    }

    public function PublicarDesviacion($parametros)
    {
        $objcmpgestionarnomencladores = new GestionarnomencladoresModel();
        $objcmpgestionarnomencladores->PublicarTodosNomencladores($parametros);
    }

    public function listarCalendariosConfigurados($parametros)
    {
        $model = new CmpconfigurarperfilModel();
        $result = $model->listarCalendario($parametros);
        if ($parametros->actual == 1 || $parametros->idconfiguracion) {
            return $result->data;
        }
        foreach ($result->data as $key => $value) {
            $result->data[$key]['text'] = $value['denominacion'];
            $result->data[$key]['qtip'] = $value['denominacion'];
            $result->data[$key]['id'] = $value['idconfiguracionperfil'];
            $result->data[$key]['leaf'] = true;
            if ($value['actual'] == 1) {
                $result->data[$key]['text']
                    = '<b>' . $value['denominacion'] . '</b>';
            }
        }
        return $result->data;
    }

    public function getJsPerfil()
    {
        $dirapps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirphtml = $dirapps
            . 'planificacion/pdo/configuracion/views/scripts/cmpconfigurarperfil/cmpconfigurarperfil.phtml';
        $js = file_get_contents($dirphtml);
        return $js;
    }

    public function getUsuarioEstructura($idestructura)
    {
        $obj = new CmpasignarentidadesModel();
        return $obj->verificarSiExisteEstruturaUser($idestructura);
    }

    public function getEstructuraUsuario($idusuario)
    {
        $obj = new CmpasignarentidadesModel();
        return $obj->verificarSiExisteUserEstrutura($idusuario);
    }

    public function getDenominacionIdUsuario($idelemento, $tipoelemento,
        $idgrupoelemento
    ) {
        $obj = new GestionarpermisosModel();
        return $obj->DameDenominacion(
            $idelemento, $tipoelemento, $idgrupoelemento
        );
    }

    public function getFechaFin($arrayInvol, $fechaini, $tiempoestimado,
                                $anno, $idsubsistema
    ) {
        if (isset($arrayInvol[0])) {
            $arrayInvol = array_unique($arrayInvol);
            $arrayIdPersonaUsuario = array();
            $arrayIdUsuariosSinPerfil = array();
            $arrayIdPersona = array();
            foreach ($arrayInvol as $value) {
                $idPersonaUsuario
                    = $this->integrator->seguridad->getIdPersonaByIdUsuario(
                    $value
                );
                $idpersona = $idPersonaUsuario[0]['idpersona'];
                if ($idpersona != '') {
                    $data['idusuario'] = $idPersonaUsuario[0]['idusuario'];
                    $data['idpersona'] = $idpersona;
                    array_push($arrayIdPersonaUsuario, $data);
                    array_push($arrayIdPersona, $idpersona);
                } else {
                    $idusuario = $idPersonaUsuario[0]['idusuario'];
                    array_push(
                        $arrayIdUsuariosSinPerfil,
                        $idusuario
                    );
                }
            }
            $result = array();
            if (isset($arrayIdPersona[0])) {
                $datosPersona
                    = $this->integrator->pvd->getPrincipalesDatosPersona(
                    $arrayIdPersona
                );
                $result = array();
                $parametros['fechaini'] = $fechaini;
                $parametros['tiempoestimado'] = $tiempoestimado;
                $parametros['anno'] = $anno;
                if (isset($datosPersona->data[0])) {
                    foreach ($datosPersona->data as $value => $key) {
                        $indexResultIdEstructura
                            = $this->getIndexPorIdEstructura(
                            $key['identidad'], $result
                        );
                        if (!$indexResultIdEstructura) {
                            $parametros['idestructura']
                                = $key['identidad'] . $idsubsistema;
                            $calendarioModel = new ConfCalendarioModel();
                            $fechafin
                                = $calendarioModel->calcularFechaFin(
                                $parametros
                            );
                            $datos['fechafin'] = $fechafin['fechafin'];
                            $datos['horasestimadas']
                                = $fechafin['horasestimadas'];
                            $datos['horasreal'] = $fechafin['horasreal'];
                            $datos['idestructura'] = $key['identidad'];

                        } else {
                            $datos['fechafin']
                                = $result[$indexResultIdEstructura]['fechafin'];
                            $datos['horasestimadas']
                                = $result[$indexResultIdEstructura]['horasestimadas'];
                            $datos['horasreal']
                                = $result[$indexResultIdEstructura]['horasreal'];
                        }
                        $datos['idpersona'] = $key['idpersona'];
                        $refIdUsuario = array_search(
                            $key['idpersona'], array_column(
                                $arrayIdPersonaUsuario, 'idpersona'
                            )
                        );
                        $datos['idusuario']
                            = $arrayIdPersonaUsuario[$refIdUsuario]['idusuario'];
                        $datos['nombreapellidos'] = $key['nombreapellidos'];
                        array_push($result, $datos);
                    }
                }
            }
            if (isset($arrayIdUsuariosSinPerfil[0])) {
                foreach ($arrayIdUsuariosSinPerfil as $value) {
                    $idestructura = '';
                    $indexResultIdEstructura
                        = $this->getIndexPorIdEstructura(
                        $idestructura, $result
                    );
                    if (!$indexResultIdEstructura) {
                        $parametros['idestructura'] = '';
                        $calendarioModel = new ConfCalendarioModel();
                        $fechafin = $calendarioModel->calcularFechaFin(
                            $parametros
                        );
                        $datos['fechafin'] = $fechafin['fechafin'];
                        $datos['horasestimadas']
                            = $fechafin['horasestimadas'];
                        $datos['horasreal'] = $fechafin['horasreal'];
                    } else {
                        $datos['fechafin']
                            = $result[$indexResultIdEstructura]['fechafin'];
                        $datos['horasestimadas']
                            = $result[$indexResultIdEstructura]['horasestimadas'];
                        $datos['horasreal']
                            = $result[$indexResultIdEstructura]['horasreal'];
                    }
                    $datos['idestructura'] = $idestructura;
                    $datos['idpersona'] = '';
                    $datos['idusuario'] = $value;
                    $datos['usuario']
                        = $this->integrator->seguridad->nombreUsuario(
                        $value
                    );
                    $datos['nombreapellidos'] = '';
                    array_push($result, $datos);
                }
            }
            if (isset($result[0])) {
                return $result;
            } else {
                return false;
            }
        } else {
            return false;
        }

    }

    public function array_unique_multidimensional($input)
    {
        $serialized = array_map('serialize', $input);
        $unique = array_unique($serialized);
        return array_intersect_key($input, $unique);
    }

    public function getIndexPorIdEstructura($identidad, $array)
    {
        foreach ($array as $value => $key) {
            if ($key['idestructura'] == $identidad) {
                return $value;
            }
        }
        return false;
    }

    public function getIdUsuario($arrayIdPersonaUsuario, $idpersona)
    {
        foreach ($arrayIdPersonaUsuario as $value => $key) {
            if ($key['idpersona'] == $idpersona) {
                return $key['idusuario'];
            }
        }
    }

    public function getJSNomenclador()
    {
        $dirapps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirphtml = $dirapps
            . 'planificacion/pdo/configuracion/views/scripts/gestionarnomencladores/obtenerJSNomenclador.phtml';
        $js = file_get_contents($dirphtml);
        return $js;
    }

    public function getJSFondodetiempo()
    {
        $dirapps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirphtml = $dirapps
            . 'planificacion/pdo/configuracion/views/scripts/cmpgestionarfondotiempo/obtenerJSFondodetiempo.phtml';
        $js = file_get_contents($dirphtml);
        return $js;
    }

    public function getJSPermisos()
    {
        $dirapps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirphtml = $dirapps
            . 'planificacion/pdo/configuracion/views/scripts/gestionarpermisos/obtenerJSPermisos.phtml';
        $js = file_get_contents($dirphtml);
        return $js;
    }

    public function getJSClasificadorInvolucrado()
    {
        $js
            = 'planificacion/pdo/plan/views/js/cmpgestionarnomenclador/initgestionarnomencladores.js';
        return $js;
    }

    public function getJSRelaciones()
    {
        $dirapps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirphtml = $dirapps
            . 'planificacion/pdo/plan/views/scripts/cmpgestionaractividades/obtenerJSRelaciones.phtml';
        $js = file_get_contents($dirphtml);
        return $js;
    }

    public function getFondoTiempo($idcalendario, $anno)
    {
        $parametros['idcalendario'] = $idcalendario;
        $parametros['getByIdEstructura'] = false;
        $parametros['anno'] = $anno;
        $parametros['incidencia'] = '1';
        $model = new ConfCalendarioModel();
        $result = $model->getCalendario($parametros);
        return $result;
    }

}

?>

