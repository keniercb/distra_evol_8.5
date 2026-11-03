<?php

/**
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class GestionarpermisosModel extends ZendExt_Model {

    /**
     * Constructor de la clase
     */
    public function setUp() {
        parent::ZendExt_Model();
    }

    /*
     * funcion para cargar los permisos que me han sido otorgados
     */

    public function CargarPermisosOtorgadosParaMi(
    $idusuario, $certificado, $iddominio, $limit, $start, $filters
    ) {
        //busco los permisos que tengo por defecto sobre grupos , 
        //subordinados y aquellos permisos que me han sido otorgados
        $mispermisos = DatPermiso::ObtenerPermisos(
                        $idusuario, $limit, $start, $filters
        );

        if ($mispermisos['total'] > 0) {
            foreach ($mispermisos['resultado'] as $key => $permiso) {
                $origen = 'Otorgados por el nivel superior';
                if ($permiso['subordinado'] == 1 || $permiso['esgrupo'] == 1) {
                    $origen = 'Por defecto (sobre mis grupos)';
                    if ($permiso['subordinado'] == 1) {
                        $origen = 'Por defecto (sobre mis subordinados)';
                    }
                }
                $arrayelementosboleanos[0] = 0; //leer
                $arrayelementosboleanos[1] = 0; //annadir
                $arrayelementosboleanos[2] = 0; //modificar
                $arrayelementosboleanos[3] = 0; //eliminar
                $numeropermiso = $permiso['numpermiso'];
                $arraypermisosboleanos = $this->ConvertirPermisoNumeroABoleanos(
                        $arrayelementosboleanos, $numeropermiso
                );
                $tipo = 'grupo';
                if ($permiso['tipopsobre'] == 1) {
                    $tipo = 'usuario';
                }
                $denominacion = $this->DameDenominacion(
                        $permiso['idpsobre'], $tipo, null
                );
                $mispermisos['resultado'][$key]['idelemento']
                        = $permiso['idpermiso'];
                $mispermisos['resultado'][$key]['denominacion'] = $denominacion;
                $mispermisos['resultado'][$key]['origen'] = $origen;
                $mispermisos['resultado'][$key]['tipo']
                        = $permiso['tipopsobre'];
                $mispermisos['resultado'][$key]['leer']
                        = $arraypermisosboleanos[0];
                $mispermisos['resultado'][$key]['annadir']
                        = $arraypermisosboleanos[1];
                $mispermisos['resultado'][$key]['modificar']
                        = $arraypermisosboleanos[2];
                $mispermisos['resultado'][$key]['eliminar']
                        = $arraypermisosboleanos[3];
            }
        }
        //Para cuando el filtro es por la denominacion
        if (is_array($filters)) {
            $cant = 0;
            foreach ($filters as $datos) {
                if ($datos ['field'] == 'denominacion') {
                    foreach ($mispermisos['resultado'] as $permiso) {
                        //covertir en may�scula
                        $denoFiltro = strtoupper($datos['data']['value']);
                        $denominacion = strtoupper($permiso['denominacion']);
                        //buscar subcadena
                        $pos = strpos($denominacion, $denoFiltro);
                        if ($pos !== false) {
                            $mispermisosF['resultado'][$cant] = $permiso;
                            $cant++;
                        }
                    }
                    $mispermisosF['total'] = $cant;
                    return $mispermisosF;
                }
            }
        }
        return $mispermisos;
    }

    /*
     * funcion para cargar los permisos otorgados por el usuario
     */

    public
            function CargarPermisosOtorgadosPorMi(
    $idusuariocrea, $limit, $start, $filters
    ) {
        $arraypermisosotrogados
                = DatPermiso::GetPermisosPorIdusuariocreaNoSubNoGrupo(
                        $idusuariocrea, $limit, $start, $filters
        );
        if ($arraypermisosotrogados['total'] > 0) {
            foreach (
            $arraypermisosotrogados['resultado'] as $key => $permiso
            ) {
                $tipopara = 'grupo';
                if ($permiso['tipoppara'] == 1) {
                    $tipopara = 'usuario';
                }
                if ($permiso['tipoppara'] == 2) {
                    $tipopara = 'estructura';
                }
                $denominacionpara = $this->DameDenominacion(
                        $permiso['idppara'], $tipopara, null
                );
                $tiposobre = 'grupo';
                if ($permiso['tipopsobre'] == 1) {
                    $tiposobre = 'usuario';
                }
                if ($permiso['tipopsobre'] == 2) {
                    $tiposobre = 'estructura';
                }
                $denominacionsobre = $this->DameDenominacion(
                        $permiso['idpsobre'], $tiposobre, null
                );
                $arrayelementosboleanos[0] = 0; //leer
                $arrayelementosboleanos[1] = 0; //annadir
                $arrayelementosboleanos[2] = 0; //modificar
                $arrayelementosboleanos[3] = 0; //eliminar
                $arraypermisosboleanos
                        = $this->ConvertirPermisoNumeroABoleanos(
                        $arrayelementosboleanos, $permiso['numpermiso']
                );
                $arraypermisosotrogados['resultado'][$key]['idpermiso']
                        = $permiso['idpermiso'];
                $arraypermisosotrogados['resultado'][$key]['denominacionpara']
                        = $denominacionpara;
                $arraypermisosotrogados['resultado'][$key]['tipopara']
                        = $permiso['tipoppara']; //$tipopara;
                $arraypermisosotrogados['resultado'][$key]['denominacionsobre']
                        = $denominacionsobre;
                $arraypermisosotrogados['resultado'][$key]['tiposobre']
                        = $permiso['tipopsobre']; //$tiposobre;
                $arraypermisosotrogados['resultado'][$key]['leer']
                        = $arraypermisosboleanos[0];
                $arraypermisosotrogados['resultado'][$key]['annadir']
                        = $arraypermisosboleanos[1];
                $arraypermisosotrogados['resultado'][$key]['modificar']
                        = $arraypermisosboleanos[2];
                $arraypermisosotrogados['resultado'][$key]['eliminar']
                        = $arraypermisosboleanos[3];
            }
        }
        return $arraypermisosotrogados;
    }

    /*
     * funcion para adicionar pemrisos
     */

    public
            function AdicionarPermiso(
    $idusuariocrea, $arraypermsospara, $arraypermsossobre, $arraypermisos
    ) {
        $arrayvaloresboleanos[0] = $arraypermisos->leer;
        $arrayvaloresboleanos[1] = $arraypermisos->anadir;
        $arrayvaloresboleanos[2] = $arraypermisos->modificar;
        $arrayvaloresboleanos[3] = $arraypermisos->eliminar;
        $numpermiso = $this->ConvertirPermisoBoleanosANumero(
                $arrayvaloresboleanos
        );
        foreach ($arraypermsospara as $permisopara) {
            $idppara = $permisopara->idgrupo;
            $idgrupopara = null;
            $tipoppara = $permisopara->tipo;
            $denppara = $permisopara->denominacion;
            if ($tipoppara == 1) {
                $idppara = $permisopara->idusuario;
                $idgrupopara = $permisopara->idgrupo;
            }
            if ($tipoppara == 2) {
                $idppara = $permisopara->idusuario;
            }
            foreach ($arraypermsossobre as $permsossobre) {
                //aplico los permisos sobre los usuarios y grupos directamente
                $idpsobre = $permsossobre->idgrupo;
                $tipopsobre = $permsossobre->tipo;
                $denpsobre = $permsossobre->denominacion;
                if ($tipopsobre == 1 || $tipopsobre == 2) {
                    $idpsobre = $permsossobre->idusuario;
                }
                if ($tipoppara == 1) {
                    $arrayidusuarios[0] = $idppara;
                    $tienegrupospadres = DatGrupoUsuario::BuscarDatosPorIdUsuario($arrayidusuarios); //DatGrupoDatUsuario::DameGruposDadoIdUsuario($idppara);
                    $numpermiso = $this->HeredarPermisosdePadresPorUsuarios($tienegrupospadres, $idppara, $idpsobre, $idusuariocrea, $numpermiso);
                }
                //$idpermiso = $idppara.$idpsobre.$idusuariocrea.$tipoppara;
                $uri = $idppara . $idpsobre . $idusuariocrea . $tipoppara;

                $permiso = Doctrine::getTable('DatPermiso')->findByDql("uri = $uri");
                if (isset($permiso[0]->idpermiso) && $permiso[0]->idpermiso != '') {
                    $permisoviejo = $permiso[0]->numpermiso;
                    $permiso[0]->numpermiso = $numpermiso;
                    $permiso[0]->save();

                    if ($tipoppara == 0) {
                        $this->AplicarPermisoSobreHijos($idppara, $idpsobre, $denpsobre, $tipopsobre, $permisoviejo, $idusuariocrea);
                    }
                }
                if (!$existepermiso) {//al parecer esta variable no se ha declarado
                    //tratando de restringir que el mismo usuario
                    //no se epueda crear permisos para el
                    if (($idppara != $idusuariocrea) || ($permsossobre->esgrupo == 1) || ($tipopsobre == 0 && $tipoppara == 0) ||
                            ($idppara != $idpsobre && $tipopsobre == 1 && $tipoppara == 1)) {
                        $permiso = new DatPermiso();
                        $permiso->uri = $uri;
                        $permiso->idpsobre = $idpsobre;
                        $permiso->idppara = $idppara;
                        $permiso->numpermiso = $numpermiso;
                        $permiso->tipopsobre = $tipopsobre;
                        $permiso->idusuariocrea = $idusuariocrea;
                        $permiso->fechacreacion = date("d-m-Y");
                        $permiso->tipoppara = $tipoppara;
                        $permiso->idgrupopara = null;
                        $permiso->idgruposobre = null;
                        $permiso->denppara = $denppara;
                        $permiso->denpsobre = $denpsobre;
                        $permiso->subordinado = 0;
                        if ($permsossobre->esgrupo == 1) {
                            $permiso->esgrupo = 1;
                        } else {
                            $permiso->esgrupo = 0;
                        }
                        try {
                            $permiso->save();
                        } catch (exception $e) {
                            return 4;
                        }
                        if ($tipoppara == 0) {
                            $this->AplicarPermisoSobreHijos(
                                    $idppara, $idpsobre, $tipopsobre, $denpsobre, $numpermiso, $idusuariocrea
                            );
                        } else {
                            //$this->integrator->seguridad->ChangeState($idppara,'1');
                        }
                        if ($tipopsobre == 1) {
                            /* $this->integrator->seguridad->ChangeState($idpsobre,'1'); */
                        }
                    }
                }
            }
        }
    }

    /*
     * funcion para modificar permisos
     */

    public
            function ModificarPermiso(
    $idusuariocrea, $arrayidpermiso, $arraypermisos
    ) {
        $arrayvaloresboleanos[0] = $arraypermisos->leer;
        $arrayvaloresboleanos[1] = $arraypermisos->anadir;
        $arrayvaloresboleanos[2] = $arraypermisos->modificar;
        $arrayvaloresboleanos[3] = $arraypermisos->eliminar;
        $numpermiso = $this->ConvertirPermisoBoleanosANumero(
                $arrayvaloresboleanos
        );
        $idpermiso = $arrayidpermiso[0]->idpermiso;
        $permiso = Doctrine::getTable('DatPermiso')->find($idpermiso);
        $idppara = $permiso->idppara;
        $idpsobre = $permiso->idpsobre;
        $tipoppara = $permiso->tipoppara;
        $tipopsobre = $permiso->tipopsobre;
        $denpsobre = $permiso->denpsobre;
        $numpermisoquetenia = $permiso->numpermiso;
        if ($tipoppara == 0) {
            $permiso->numpermiso = $numpermiso;
            $permiso->save();
            $this->AplicarPermisoSobreHijos(
                    $idppara, $idpsobre, $tipopsobre, $denpsobre, $numpermisoquetenia, $idusuariocrea
            );
        }
        if ($tipoppara == 1 || $tipoppara == 2) {
            $permiso->numpermiso = $numpermiso;
            $permiso->save();
        }
    }

    /*
     * funcion para eliminar permisos
     */

    public
            function EliminarPermiso($idusuariocrea, $arrayidpermiso
    ) {
        if ($arrayidpermiso) {
            foreach ($arrayidpermiso as $idpermiso) {
                $permiso = Doctrine::getTable('DatPermiso')->find(
                        $idpermiso->idpermiso
                );
                if ($permiso->idpermiso) {
                    $idppara = $permiso->idppara;
                    $idpsobre = $permiso->idpsobre;
                    $tipoppara = $permiso->tipoppara;
                    $tipopsobre = $permiso->tipopsobre;
                    $denpsobre = $permiso->denpsobre;
                    $numpermisoquetenia = $permiso->numpermiso;
                    $numpermiso = 0;
                    if ($tipoppara == 0 || $tipoppara == 2) {
                        $permiso->delete();
                        $this->AplicarPermisoSobreHijos(
                                $idppara, $idpsobre, $tipopsobre, $denpsobre, $numpermisoquetenia, $idusuariocrea
                        );
                    }
                    if ($tipoppara == 1) {
                        $arrayidusuarios[0] = $idppara;
                        $tienegrupospadres
                                = DatGrupoUsuario::BuscarDatosPorIdUsuario(
                                        $arrayidusuarios
                        ); //DatGrupoDatUsuario::DameGruposDadoIdUsuario($idppara);
                        if ($tienegrupospadres) {
                            $numpermiso
                                    = $this->HeredarPermisosdePadresPorUsuarios(
                                    $tienegrupospadres, $idppara, $idpsobre, $idusuariocrea, $numpermiso
                            );
                            if ($numpermiso != 0) {
                                $permiso->numpermiso = $numpermiso;
                                $permiso->save();
                            }
                            if ($numpermiso == 0) {
                                $permiso->delete();
                                if ($permiso->tipoppara == 1) {
                                    /* $this->integrator->seguridad->ChangeState($idppara,'0'); */
                                }
                                if ($permiso->tipopsobre == 1) {
                                    /* $this->integrator->seguridad->ChangeState($idpsobre,'0'); */
                                }
                            }
                        }
                        if (!$tienegrupospadres) {
                            $permiso->delete();
                            if ($permiso->tipoppara == 1) {
                                /* $this->integrator->seguridad->ChangeState($idppara,'0'); */
                            }
                            if ($permiso->tipopsobre == 1) {
                                /* $this->integrator->seguridad->ChangeState($idpsobre,'0'); */
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Funcion para convertir un numero que representa un permiso a valores boleanos
     */
    function ConvertirPermisoNumeroABoleanos(
    $arrayelementosboleanos, $numeropermiso
    ) {
        $auxiliar = 0;
        $totalelementosboleanos = count($arrayelementosboleanos);
        for ($i = $totalelementosboleanos - 1; $i >= 0; $i--) {
            $posicion = $i;
            $valor = pow(2, $posicion);
            if ($valor == $numeropermiso) {
                $arrayelementosboleanos[$posicion] = 1;
                return $arrayelementosboleanos;
            }
            if ($valor < $numeropermiso) {
                $auxiliar = $auxiliar + $valor;
                if ($auxiliar == $numeropermiso) {
                    $arrayelementosboleanos[$posicion] = 1;
                    return $arrayelementosboleanos;
                }
                if ($auxiliar < $numeropermiso) {
                    $arrayelementosboleanos[$posicion] = 1;
                }
                if ($auxiliar > $numeropermiso) {
                    $auxiliar = $auxiliar - $valor;
                }
            }
        }
    }

    /**
     * Funcion para saber la denominacion del grupo o del usuario
     */
    function DameDenominacion($idelemento, $tipoelemento, $idgrupoelemento) {
        if ($tipoelemento == 'grupo') {
            $datosgrupo = Doctrine::getTable('DatGrupo')->find(
                    $idelemento
            ); //DatGrupo::GetGruposIdGrupo($idelemento);
            $denominacion = $datosgrupo->dengrupo;
        }
        if ($tipoelemento == 'usuario') {
            $denominacion = $this->integrator->seguridad->nombreUsuario(
                    $idelemento
            );

            if ($denominacion != null) {
                $arrayidpersona
                        = $this->integrator->seguridad->getIdPersonaByIdUsuario(
                        $idelemento
                );
                $idpersona = $arrayidpersona[0]['idpersona'];
                if ($idpersona != null) {
                    // el servicio que retorna nombreapellidos no funciona, revisarlo
                    $datospersona
                            = $this->integrator->pvd->getPrincipalesDatosPersona(
                            $params[] = $idpersona
                    );
                    if ($datospersona->data[0] != '') {
                        $denominacion
                                = ($datospersona->data[0]['nombreapellidos']);
                    }
                }
            } else {
                //Eliminar permisos del involucrado y su subordinacion
                $permisos = new DatPermiso();
                $permisos->eliminarPermisos($idelemento);
                $subordinacion = new DatSubordinacion();
                $subordinacion->eliminarSubordinados($idelemento);
            }
        }
        if ($tipoelemento == 'estructura') {
            $obj = Doctrine::getTable('DatUsuarioEstructura')->findByDql(
                    "idusuario = $idelemento"
            );
            if ($obj[0]->idestructura != null) {
                $estructura = $this->integrator->metadatos->DameEstructura(
                        $obj[0]->idestructura
                );
                $denominacion = $estructura[0]->denominacion;
            } else {
                $denominacion = 'Error';
            }
        }
        return $denominacion;
    }

    /**
     * Funcion para convertir valores boleanos que representan un permiso a numero
     */
    function ConvertirPermisoBoleanosANumero($arrayelementosboleanos) {
        $numpermiso = 0;
        $totalelementosboleanos = count($arrayelementosboleanos);
        for ($i = 0; $i < $totalelementosboleanos; $i++) {
            if ($arrayelementosboleanos[$i] == 1) {
                $numpermiso = $numpermiso + pow(2, $i);
            }
        }
        return $numpermiso;
    }

    /**
     * Funcion para que un usuario herede lospermisos de los grupos donde se encuentre
     */
    public
            function HeredarPermisosdePadresPorUsuarios(
    $tienegrupospadres, $idppara, $idpsobre, $idusuariocrea, $numpermisohijo
    ) {
        foreach ($tienegrupospadres as $grupopadre) {
            $idppara = $grupopadre['idgrupo'];
            $uri = $idppara . $idpsobre . $idusuariocrea;
            $existepermiso = DatPermiso::GetPermisoPorURIPermiso($uri);
            if ($existepermiso) {
                $permiso = Doctrine::getTable('DatPermiso')->find($uri);
                $numpermisopadre = $permiso->numpermiso;
                $numpermisohijo = $this->UnirPermisosANumero(
                        $numpermisopadre, $numpermisohijo
                );
            }
        }
        $numper = $numpermisohijo;
        return $numper;
    }

    /**
     * Funcion para realizar la fusion de los permisos entre un permiso de un padre y el de un hijo
     */
    public
            function UnirPermisosANumero($numpermisopadre, $numpermisohijo
    ) {
        if ($numpermisohijo != 0) {
            $arrayelementosboleanospadre[0] = 0; //leer
            $arrayelementosboleanospadre[1] = 0; //annadir
            $arrayelementosboleanospadre[2] = 0; //modificar
            $arrayelementosboleanospadre[3] = 0; //eliminar
            $arrayelementosboleanoshijo[0] = 0; //leer
            $arrayelementosboleanoshijo[1] = 0; //annadir
            $arrayelementosboleanoshijo[2] = 0; //modificar
            $arrayelementosboleanoshijo[3] = 0; //eliminar
            $arraypermisosboleanospadre
                    = $this->ConvertirPermisoNumeroABoleanos(
                    $arrayelementosboleanospadre, $numpermisopadre
            );
            $arraypermisosboleanoshijo
                    = $this->ConvertirPermisoNumeroABoleanos(
                    $arrayelementosboleanoshijo, $numpermisohijo
            );
            $cant = count($arraypermisosboleanoshijo);
            for ($i = 0; $i < $cant; $i++) {
                if ($arraypermisosboleanoshijo[$i] != $arraypermisosboleanospadre[$i]
                ) {
                    $arraypermisosbol[$i] = 1;
                }
                if ($arraypermisosboleanoshijo[$i] == $arraypermisosboleanospadre[$i]
                ) {
                    $arraypermisosbol[$i] = $arraypermisosboleanoshijo[$i];
                }
            }
        }
        if ($numpermisohijo == 0) {
            $arrayelementosboleanoshijo[0] = 0; //leer
            $arrayelementosboleanoshijo[1] = 0; //annadir
            $arrayelementosboleanoshijo[2] = 0; //modificar
            $arrayelementosboleanoshijo[3] = 0; //eliminar
            $arraypermisosbol = $this->ConvertirPermisoNumeroABoleanos(
                    $arrayelementosboleanoshijo, $numpermisopadre
            );
        }
        $permiso = $this->ConvertirPermisoBoleanosANumero(
                $arraypermisosbol
        );
        return $permiso;
    }

    /**
     * Funcion para aplicar el permiso de un grupo sobre sus grupos hijos
     */
    public
            function AplicarPermisoSobreHijos(
    $idgrupopadre, $idpsobre, $tipopsobre, $denpsobre, $numpermiso, $idusuariocrea
    ) {
        //verifico que no estoy eliminando, sino adicionando o modificando
        if ($numpermiso != 0) {
            //busco si el grupo esta formado por usuarios
            $existusuariosengrupo = DatGrupoUsuario::BuscarUsuariosPorGrupo(
                            $idgrupopadre
            );
            if ($existusuariosengrupo) {
                foreach ($existusuariosengrupo as $usuario) {
                    $idppara = $usuario['idusuario'];
                    $denppara = $usuario['alias'];
                    $idpsobre = $idpsobre;
                    $uri = $idppara . $idpsobre . $idusuariocrea;
                    $permiso = Doctrine::getTable('DatPermiso')->findByDql(
                            "uri = $uri"
                    );
                    if (isset($permiso[0]->idpermiso) && $permiso[0]->idpermiso != ''
                    ) {
                        $numpermisousuariohijo = $permiso[0]->numpermiso;
                        $numpermisopadre = $numpermiso;
                        $numpermisousuariohijo
                                = $this->DameDiferenciasDePermisos(
                                $numpermisopadre, $numpermisousuariohijo
                        );
                        $arrayidusuarios[0] = $idppara;
                        $grupospadres
                                = DatGrupoUsuario::BuscarDatosPorIdUsuario(
                                        $arrayidusuarios
                        ); //DatGrupoDatUsuario::DameGruposDadoIdUsuario($idppara);
                        $numpermisouser
                                = $this->HeredarPermisosdePadresPorUsuarios(
                                $grupospadres, $idppara, $idpsobre, $idusuariocrea, $numpermisousuariohijo
                        );
                        if ($numpermisouser == 0) {
                            $permiso[0]->delete();
                        }
                        if ($numpermisouser != 0) {
                            $permiso[0]->numpermiso = $numpermisouser;
                            $permiso[0]->save();
                        }
                    }
                    if (!$existepermiso) {//al parecer esta variable no se ha declarado
                        $arrayidusuarios[0] = $idppara;
                        $grupospadres
                                = DatGrupoUsuario::BuscarDatosPorIdUsuario(
                                        $arrayidusuarios
                        ); //DatGrupoDatUsuario::DameGruposDadoIdUsuario($idppara);
                        $numpermiso
                                = $this->HeredarPermisosdePadresPorUsuarios(
                                $grupospadres, $idppara, $idpsobre, $idusuariocrea, $numpermiso
                        );
                        $tipoppara = 1;
                        if ($idppara != $idusuariocrea || ($tipopsobre == 0 && $tipoppara == 0) || ($idppara !=
                                $idpsobre && $tipopsobre == 1 && $tipoppara == 1)
                        ) {
                            $permiso = new DatPermiso();
                            $permiso->idpsobre = $idpsobre;
                            $permiso->idppara = $idppara;
                            $permiso->uri = $uri;
                            $permiso->numpermiso = $numpermiso;
                            $permiso->tipopsobre = $tipopsobre;
                            $permiso->idusuariocrea = $idusuariocrea;
                            $permiso->fechacreacion = date(
                                    "d-m-Y"
                            ); //date("Y-m-d H:i:s");
                            $permiso->tipoppara = $tipoppara;
                            $permiso->idgrupopara = null;
                            $permiso->idgruposobre = null;
                            $permiso->denppara = $denppara;
                            $permiso->denpsobre = $denpsobre;
                            $permiso->subordinado = 0;
                            $permiso->save();
                        }
                    }
                }
            }
        }
    }

    public
            function DameDiferenciasDePermisos(
    $numpermisopadre, $numpermisogrupohijo
    ) {
        if ($numpermisogrupohijo != 0) {
            $arrayelementosboleanospadre[0] = 0; //leer
            $arrayelementosboleanospadre[1] = 0; //annadir
            $arrayelementosboleanospadre[2] = 0; //modificar
            $arrayelementosboleanospadre[3] = 0; //eliminar
            $arrayelementosboleanoshijo[0] = 0; //leer
            $arrayelementosboleanoshijo[1] = 0; //annadir
            $arrayelementosboleanoshijo[2] = 0; //modificar
            $arrayelementosboleanoshijo[3] = 0; //eliminar
            $arraypermisosboleanospadre
                    = $this->ConvertirPermisoNumeroABoleanos(
                    $arrayelementosboleanospadre, $numpermisopadre
            );
            $arraypermisosboleanoshijo
                    = $this->ConvertirPermisoNumeroABoleanos(
                    $arrayelementosboleanoshijo, $numpermisogrupohijo
            );
            $cant = count($arraypermisosboleanoshijo);
            for ($i = 0; $i < $cant; $i++) {
                if ($arraypermisosboleanoshijo[$i] != $arraypermisosboleanospadre[$i]
                ) {
                    $arraypermisosbol[$i] = $arraypermisosboleanoshijo[$i];
                }
                if ($arraypermisosboleanoshijo[$i] == $arraypermisosboleanospadre[$i]
                ) {
                    $arraypermisosbol[$i] = 0;
                }
            }
        }
        if ($numpermisogrupohijo == 0) {
            $arrayelementosboleanoshijo[0] = 0; //leer
            $arrayelementosboleanoshijo[1] = 0; //annadir
            $arrayelementosboleanoshijo[2] = 0; //modificar
            $arrayelementosboleanoshijo[3] = 0; //eliminar
            $arraypermisosbol = $this->ConvertirPermisoNumeroABoleanos(
                    $arrayelementosboleanoshijo, $numpermisopadre
            );
        }
        $permiso = $this->ConvertirPermisoBoleanosANumero(
                $arraypermisosbol
        );
        return $permiso;
    }

    public function obtenerUsuariosXIdEstructura($idestructura) {
        $dominios = ZendExt_IoC::getInstance()->metadatos->DominiosPorEstructura($idestructura, array());
        $arrayIddominios = SegUtil::convertToUnidimensional($dominios, 'iddominio');
        foreach ($arrayIddominios as $dominio) {
            $rolesDominio[] = array(
                'dominio' => $dominio,
                'roles' => SegRolNomDominio::RolesdelDominio($dominio)
            );
        }
        foreach ($rolesDominio as $rd) {
            if (!empty($rd['roles'])) {
                $arrayRoles = join(',', SegUtil::convertToUnidimensional($rd['roles'], 'idrol'));
                $result[] = SegUsuarioSegRolModel::getUsersByRolAndDomain($rd['dominio'], $arrayRoles);
            }
        }
        foreach ($result as $r) {
            if (!empty($r)) {
                foreach ($r as $user) {
                    $trueResult[] = $user;
                }
            }
        }
        return $trueResult;
    }

    public function ObtenerUsuariosDelDominio($idusuario, $iddominio) {//Para proyecto
        $arrayidestrucutras
                = $this->integrator->seguridad->getIdsEntityByUser(
                $idusuario
        );

        $arrayusuariosdominio = $this->integrator->seguridad->obtenerUsuariosXIdEstructura($arrayidestrucutras[0]); //ver a yasmany para que actualice seguridad
        $users = array();
        foreach ($arrayusuariosdominio as $user) {
            if ($user['iddominio'] == $iddominio) {
                $users[] = $user;
            }
        }

        foreach ($arrayidestrucutras as $id) {
            $est = $this->integrator->metadatos->DameEstructura(
                    $id
            );
            $res[] = $est[0]->denominacion;
        }

        $arrayidcargos
                = $this->integrator->metadatos->obtenerCargosEstructuraInmediatos(
                $arrayidestrucutras, $iddominio
        );


        if (isset($arrayidcargos[0])) {
            $arrayidpersonas
                    = $this->integrator->pvd->getPrincipalesDatosPersona(
                    null, null, null, null, null, $arrayidcargos
            );
            $aux = $arrayidpersonas->data;

            $arrayidpersonas = self::toUnidimencional(
                            $arrayidpersonas->data, 'idpersona'
            );

            $arrayusuariossubordinados = array();
            if (isset($arrayidpersonas[0])) {
                $arrayusuariossubordinados
                        = $this->integrator->seguridad->getUsersInformationByArrayIdPersona(
                        $arrayidpersonas
                );
            }
            foreach ($arrayusuariossubordinados as $key => $usuario) {
                foreach ($aux as $key1 => $persona) {
                    if ($usuario['idpersona'] == $persona['idpersona']) {
                        if (!empty($persona['nombreapellidos'])) {
                            $arrayusuariossubordinados[$key]['nombreusuario'] .= ' (' . $persona['nombreapellidos'] . ')';
                            break;
                        }
                    }
                }
            }
            $result = array();
            foreach ($arrayusuariossubordinados as $user1) {
                $var = false;
                foreach ($users as $key => $user) {
                    if ($user1['idusuario'] == $user['idusuario']) {
                        $var = true;
                        unset($users[$key]);
                        break;
                    }
                }
            }
            $result = array_merge($users, $arrayusuariossubordinados);
            return ($result);
        } else {
            return $users;
        }
//        return array();
        /* $filas = self::toUnidimencional(
          $this->integrator->metadatos->getArrayEstructurasInternas($iddominio), 'idfila');
          $arrayusuariosdominio = $this->integrator->seguridad->obtenerUsuariosPorAreas($filas);
          return $arrayusuariosdominio; */
    }

    private static function toUnidimencional($array, $indice
    ) {
        $arrayResult = array();
        foreach ($array as $values) {
            array_push($arrayResult, $values[$indice]);
        }
        return $arrayResult;
    }

    /*
     * funcion para cargar el arbol con los usuarios sobre los cuales voy a dar permisos
     */

    public function CargarGruposyUsuariosSobre(
    $nodo, $idgrupo, $idusuario, $estamodificando
    ) {
        switch ($idgrupo) {
            case 'nodo1':
                $usuarios[0]['id'] = $idgrupo . $idusuario;
                $usuarios[0]['text'] = $this->global->Perfil->usuario;
                $usuarios[0]['idusuario'] = $idusuario;
                $usuarios[0]['idgrupo'] = null;
                $usuarios[0]['tipo'] = 1;
                $usuarios[0]['iconCls'] = 'usuario';
                $usuarios[0]['draggable'] = false;
                $usuarios[0]['leaf'] = true;
                $usuarios[0]['checked'] = false;
                echo json_encode($usuarios);
                break;
            case 'nodo2':
                $count = 0;
                $arraydegrupos = DatGrupo::GetGruposPorPropietario(
                                $idusuario
                );
                if ($arraydegrupos) {
                    foreach ($arraydegrupos as $key => $grupo) {
                        $leaf = true;
                        $tienehijosusuarios
                                = DatGrupoUsuario::BuscarUsuariosPorGrupo(
                                        $grupo['idgrupo']
                        );
                        if (isset($tienehijosusuarios[0])) {
                            $leaf = false;
                        }
                        $arraygrupos[$count]['id'] = $grupo['idgrupo'];
                        $arraygrupos[$count]['idgrupo'] = $grupo['idgrupo'];
                        $arraygrupos[$count]['text'] = $grupo['dengrupo'];
                        $arraygrupos[$count]['iconCls'] = 'rolesygrupos';
                        $arraygrupos[$count]['tipo'] = 0;
                        $arraygrupos[$count]['draggable'] = false;
                        $arraygrupos[$count]['checked'] = false;
                        $arraygrupos[$count]['leaf'] = $leaf;
                        $count++;
                    }
                }
                return $arraygrupos;
                break;
            case 'nodo3':
                $objdatpermiso = new DatPermiso();
                $arraypermiso
                        = $objdatpermiso->ObtenerPermisosSobreSubordinados(
                        $idusuario
                );
                if (isset($arraypermiso[0])) {
                    foreach ($arraypermiso as $key => $permiso) {
                        $tipo = 'grupo';
                        if ($permiso['tipopsobre'] == 1) {
                            $tipo = 'usuario';
                        }
                        $denominacionsobre = $this->DameDenominacion(
                                $permiso['idpsobre'], $tipo, null
                        );
                        $arrausersdomain[$key]['id'] = $permiso['idpsobre'];
                        $arrausersdomain[$key]['text'] = $denominacionsobre;
                        $arrausersdomain[$key]['idusuario']
                                = $permiso['idpsobre'];
                        $arrausersdomain[$key]['draggable'] = false;
                        $arrausersdomain[$key]['checked'] = false;
                        $arrausersdomain[$key]['iconCls'] = 'usuario';
                        $arrausersdomain[$key]['leaf'] = true;
                        $arrausersdomain[$key]['tipo'] = 1;
                    }
                }
                return $arrausersdomain;
                break;
            case 'nodo4':
                $count = 0;
                //ahora busco los permisos que me han sido otorgados como usuario
                $permisoscomousuario = DatPermiso::GetPermisosPara(
                                $idusuario
                );
                if ($permisoscomousuario) {
                    foreach ($permisoscomousuario as $permiso) {
                        $arrayelementosboleanos[0] = 0; //leer
                        $arrayelementosboleanos[1] = 0; //annadir
                        $arrayelementosboleanos[2] = 0; //modificar
                        $arrayelementosboleanos[3] = 0; //eliminar
                        $numeropermiso = $permiso['numpermiso'];
                        $arraypermisosboleanos
                                = $this->ConvertirPermisoNumeroABoleanos(
                                $arrayelementosboleanos, $numeropermiso
                        );
                        $tipo = 'grupo';
                        if ($permiso['tipopsobre'] == 1) {
                            $tipo = 'usuario';
                        }
                        $denominacionsobre = $this->DameDenominacion(
                                        $permiso['idpsobre'], $tipo, null
                                ) .
                                '( ';
                        if ($arraypermisosboleanos[0] == 1) {
                            $denominacionsobre .= 'leer-';
                        }
                        if ($arraypermisosboleanos[1] == 1) {
                            $denominacionsobre .= 'adicionar-';
                        }
                        if ($arraypermisosboleanos[2] == 1) {
                            $denominacionsobre .= 'modificar-';
                        }
                        if ($arraypermisosboleanos[3] == 1) {
                            $denominacionsobre .= 'eliminar ';
                        }
                        $denominacionsobre .= ')';
                        //tomo por defecto que es un usuario sobre el cual tengo permiso
                        $tipo = 1;
                        $id = $permiso['idgruposobre']
                                . $permiso['idpsobre'];
                        $leaf = true;
                        $icon = 'usuario';
                        //verifico si  es un grupo y cambio variables
                        if ($permiso['tipopsobre'] == 0) {
                            $tipo = 0;
                            $id = $permiso['idpsobre'];
                            $icon = 'rolesygrupos';
                            $tienehijosusuarios
                                    = DatGrupoUsuario::BuscarUsuariosPorGrupo(
                                            $permiso['idpsobre']
                            );
                            if (isset($tienehijosusuarios[0])) {
                                $leaf = false;
                            }
                        }
                        $entrada = 1;
                        if (isset($otros[0])) {
                            foreach ($otros as $k => $otro) {
                                if ($otro['id'] == $idgrupo . $id) {
                                    $entrada = 0;
                                }
                            }
                        }
                        if ($entrada == 1) {
                            $otros[$count]['id'] = $idgrupo . $id;
                            $otros[$count]['text'] = $denominacionsobre;
                            if ($permiso['tipopsobre'] == 0) {
                                $otros[$count]['idgrupo']
                                        = $permiso['idpsobre'];
                            } else {
                                $otros[$count]['idusuario']
                                        = $permiso['idpsobre'];
                            }
                            $otros[$count]['tipo'] = $tipo;
                            $otros[$count]['iconCls'] = $icon;
                            $otros[$count]['leer']
                                    = $arraypermisosboleanos[0];
                            $otros[$count]['adicionar']
                                    = $arraypermisosboleanos[1];
                            $otros[$count]['modificar']
                                    = $arraypermisosboleanos[2];
                            $otros[$count]['eliminar']
                                    = $arraypermisosboleanos[3];
                            $otros[$count]['draggable'] = false;
                            $otros[$count]['leaf'] = $leaf;
                            $otros[$count]['checked'] = false;
                            $otros[$count]['superior'] = 1;
                            $otros[$count]['autorpermiso']
                                    = $permiso['idusuariocrea'];
                            $count++;
                        }
                    }
                }
                //ahora busco los permisos que me han sido otorgados como
                //integrante de un grupo
                $arrayidusers[0] = $idusuario;
                $gruposdondeestoy
                        = DatGrupoUsuario::BuscarDatosPorIdUsuario(
                                $arrayidusers
                ); //DatGrupoDatUsuario::DameGruposDadoIdUsuario($idusuario);
                if ($gruposdondeestoy) {
                    foreach ($gruposdondeestoy as $grupo) {
                        $permisocomointgrupo = DatPermiso::GetPermisosPara(
                                        $grupo['idgrupo']
                        );
                        if ($permisocomointgrupo) {
                            foreach ($permisocomointgrupo as $permiso) {
                                $arrayelementosboleanos[0] = 0; //leer
                                $arrayelementosboleanos[1] = 0; //annadir
                                $arrayelementosboleanos[2] = 0; //modificar
                                $arrayelementosboleanos[3] = 0; //eliminar
                                $numeropermiso = $permiso['numpermiso'];

                                $tipo = 'grupo';
                                if ($permiso['tipopsobre'] == 1) {
                                    $tipo = 'usuario';
                                }
                                $denominacionsobre
                                        = $this->DameDenominacion(
                                        $permiso['idpsobre'], $tipo, null
                                );
                                $arraypermisosboleanos
                                        = $this->ConvertirPermisoNumeroABoleanos(
                                        $arrayelementosboleanos, $numeropermiso
                                );

                                if ($arraypermisosboleanos[0] == 1) {
                                    $denominacionsobre .= 'leer-';
                                }
                                if ($arraypermisosboleanos[1] == 1) {
                                    $denominacionsobre .= 'adicionar-';
                                }
                                if ($arraypermisosboleanos[2] == 1) {
                                    $denominacionsobre .= 'modificar-';
                                }
                                if ($arraypermisosboleanos[3] == 1) {
                                    $denominacionsobre .= 'eliminar ';
                                }
                                $denominacionsobre .= ')';
                                //tomo por defecto que es un usuario
                                //sobre el cual tengo permiso
                                $tipo = 1;
                                $id = $permiso['idgruposobre']
                                        . $permiso['idpsobre'];
                                $leaf = true;
                                $icon = 'otrousuario';
                                //verifico si  es un grupo y cambio variables
                                if ($permiso['tipopsobre'] == 0) {
                                    $tipo = 0;
                                    $id = $permiso['idpsobre'];
                                    $icon = 'otrogrupo';
                                    $tienehijosusuarios
                                            = DatGrupoUsuario::BuscarUsuariosPorGrupo(
                                                    $permiso['idpsobre']
                                    );
                                    if (isset($tienehijosusuarios[0])) {
                                        $leaf = false;
                                    }
                                }
                                $entrada = 1;
                                if (isset($otros[0])) {
                                    foreach ($otros as $k => $otro) {
                                        if ($otro['id'] == $idgrupo . $id) {
                                            $entrada = 0;
                                        }
                                    }
                                }
                                if ($entrada == 1) {
                                    $otros[$count]['id'] = $idgrupo . $id;
                                    $otros[$count]['text']
                                            = $denominacionsobre;
                                    $otros[$count]['idgrupo']
                                            = $permiso['idpsobre'];
                                    $otros[$count]['tipo'] = $tipo;
                                    $otros[$count]['iconCls'] = $icon;
                                    $otros[$count]['leer']
                                            = $arraypermisosboleanos[0];
                                    $otros[$count]['adicionar']
                                            = $arraypermisosboleanos[1];
                                    $otros[$count]['modificar']
                                            = $arraypermisosboleanos[2];
                                    $otros[$count]['eliminar']
                                            = $arraypermisosboleanos[3];
                                    $otros[$count]['draggable'] = false;
                                    $otros[$count]['leaf'] = $leaf;
                                    $otros[$count]['checked'] = false;
                                    $otros[$count]['superior'] = 1;
                                    $otros[$count]['autorpermiso']
                                            = $permiso['idusuariocrea'];
                                    $count++;
                                }
                            }
                        }
                    }
                }
                return $otros;
                break;
            //se puede implementar un "Ver detalles" en la interfaz
            default:
                $cont = 0;
                $arrayusuarios = DatGrupoUsuario::BuscarUsuariosPorGrupo(
                                $idgrupo
                ); //DatGrupoDatUsuario::BuscarUsuariosPorGrupo($idgrupo);
                if (isset($arrayusuarios[0])) {
                    foreach ($arrayusuarios as $usuario) {
                        $usuarios[$cont]['id']
                                = $idgrupo . $usuario['idusuario'];
                        $usuarios[$cont]['text']
                                = $this->integrator->seguridad->nombreUsuario(
                                $usuario['idusuario']
                        );
                        $usuarios[$cont]['idusuario']
                                = $usuario['idusuario'];
                        $usuarios[$cont]['idgrupo'] = $usuario['idgrupo'];
                        $usuarios[$cont]['tipo'] = 1;
                        $usuarios[$cont]['iconCls'] = 'usuario';
                        $usuarios[$cont]['draggable'] = false;
                        $usuarios[$cont]['leaf'] = true;
                        $usuarios[$cont]['checked'] = false;
                        $cont++;
                    }
                }
                echo json_encode($usuarios);
        }
    }

    /*
     * funcion para cargar el arbol con los usuarios para los cuales voy a dar permisos
     */

    public function Buscardenominacion($array, $subcadena) {
        /* $cont = 0;
          foreach ($array as $posicion) {
          $pos = stripos($posicion['text'], $subcadena);
          if ($pos !== false) {
          $arreglo[$cont++] = $posicion;
          }
          }
          return $arreglo; */
        $cont = 0;
        foreach ($array as $posicion) {
            $text = strtolower($posicion['text']);
            $search = strtolower($subcadena);
            $pos = strpos($text, $search);
            if ($pos !== false) {
                $arreglo[$cont++] = $posicion;
            }
        }
        return $arreglo;
    }

    public function CargarGruposyUsuariosPara(
    $nodo, $idgrupo, $idusuario, $estamodificando, $iddominio, $certificado, $funcAsoc
    ) {
        switch ($idgrupo) {
            case 'nodo1':
                $arraydegrupos = DatGrupo::GetGruposPorPropietario(
                                $idusuario
                );
                if ($arraydegrupos) {
                    foreach ($arraydegrupos as $key => $grupo) {
                        $leaf = true;
                        $tienehijosusuarios
                                = DatGrupoUsuario::BuscarUsuariosPorGrupo(
                                        $grupo['idgrupo']
                        );
                        if (isset($tienehijosusuarios[0])) {
                            $leaf = false;
                        }
                        $arraygrupos[$key]['id'] = $grupo['idgrupo'];
                        $arraygrupos[$key]['idgrupo'] = $grupo['idgrupo'];
                        $arraygrupos[$key]['text'] = $grupo['dengrupo'];
                        $arraygrupos[$key]['iconCls'] = 'rolesygrupos';
                        $arraygrupos[$key]['tipo'] = 0;
                        $arraygrupos[$key]['draggable'] = false;
                        $arraygrupos[$key]['checked'] = false;
                        $arraygrupos[$key]['leaf'] = $leaf;
                    }
                }
                return $arraygrupos;
                break;
            case 'nodo2':
                $objdatpermiso = new DatPermiso();
                $obj = new CmpasignarentidadesModel();
                $arraypermiso
                        = $objdatpermiso->ObtenerPermisosSobreSubordinados(
                        $idusuario
                );
                if (isset($arraypermiso[0])) {
                    foreach ($arraypermiso as $key => $permiso) {
                        $tipo = 'grupo';
                        if ($permiso['tipopsobre'] == 1) {
                            $tipo = 'usuario';
                        }
                        $denominacionsobre = $this->DameDenominacion(
                                $permiso['idpsobre'], $tipo, null
                        );
                        if (isset($funcAsoc) && $funcAsoc != 'no') {
                            $flagUser
                                    = $obj->verificarSiExisteUserEstrutura(
                                    $permiso['idpsobre']
                            );
                        }
                        $arrausersdomain[$key]['id'] = $permiso['idpsobre'];
                        $arrausersdomain[$key]['text'] = $denominacionsobre;
                        $arrausersdomain[$key]['idusuario']
                                = $permiso['idpsobre'];
                        $arrausersdomain[$key]['draggable'] = false;
                        if ($flagUser['flag'] != 'false') {
                            $arrausersdomain[$key]['checked'] = false;
                        }
                        $arrausersdomain[$key]['iconCls'] = 'usuario';
                        $arrausersdomain[$key]['leaf'] = true;
                        $arrausersdomain[$key]['tipo'] = 1;
                    }
                }
                return $arrausersdomain;
                break;
            default:
                $cont = 0;
                $arrayusuarios = DatGrupoUsuario::BuscarUsuariosPorGrupo(
                                $idgrupo
                );
                if (isset($arrayusuarios[0])) {
                    foreach ($arrayusuarios as $usuario) {
                        $usuarios[$cont]['id']
                                = $idgrupo . $usuario['idusuario'];
                        $usuarios[$cont]['text']
                                = $this->integrator->seguridad->nombreUsuario(
                                $usuario['idusuario']
                        );
                        $usuarios[$cont]['idusuario']
                                = $usuario['idusuario'];
                        $usuarios[$cont]['idgrupo'] = $usuario['idgrupo'];
                        $usuarios[$cont]['tipo'] = 1;
                        $usuarios[$cont]['iconCls'] = 'usuario';
                        $usuarios[$cont]['draggable'] = false;
                        $usuarios[$cont]['leaf'] = true;
                        $usuarios[$cont]['checked'] = false;
                        $cont++;
                    }
                }
                echo json_encode($usuarios);
        }
    }

    public function ActualizarPermisos($idusuariocrea) {
        $arraygrupos = DatGrupo::GetGrupos();
        if (isset($arraygrupos[0])) {
            $arraypermisos->leer = 1;
            $arraypermisos->anadir = 1;
            $arraypermisos->modificar = 1;
            $arraypermisos->eliminar = 1;
            $objpermisopara->idusuario = $idusuariocrea;
            $objpermisopara->tipo = 1;
            $objpermisopara->idgrupo = null;
            $objpermisopara->denominacion
                    = $this->integrator->seguridad->nombreUsuario(
                    $idusuariocrea
            );
            $arraypermisopara[0] = $objpermisopara;
            foreach ($arraygrupos as $grupo) {
                $objpermisosobre->idgrupo = $grupo['idgrupo'];
                $objpermisosobre->tipo = 0;
                $objpermisosobre->esgrupo = 1;
                $objpermisosobre->denominacion = $grupo['dengrupo'];
                $arraypermisosobre[0] = $objpermisosobre;
            }
            $this->AdicionarPermiso(
                    $idusuariocrea, $arraypermisopara, $arraypermisosobre, $arraypermisos
            );
            $respuesta = 1;
        } else {
            $respuesta = 0;
        }
        return $respuesta;
    }

    public function ArbolDeGrupos(
    $idusuario, $idgrupo, $estamodificando, $idcomponente, $idelemento, $certificado, $iddominio
    ) {
        switch ($idgrupo) {
            case 'nodo1': //este solo lo pide aRC
                $checked = false;
                $tipoinvol == 1;
                $icon = 'usuario';
                $nivelinvol = 2;
                if ($estamodificando == 1) {
                    $nivelinvol
                            = $this->pIntegrator->planpdo->VerificarUsuarioInvolucradoArc(
                            $idusuario, $idelemento, $nivelinvol
                    );
                    if ($nivelinvol == 0 || $nivelinvol == 1) {
                        $tipoinvol = $nivelinvol;
                        $checked = true;
                        if ($tipoinvol == 0) {
                            $icon = 'persona';
                        }
                        if ($tipoinvol == 1) {
                            $icon = 'usuario';
                        }
                    }
                }
                $usuarios[0]['id'] = $idgrupo . $idusuario;
                $usuarios[0]['text'] = $this->global->Perfil->usuario;
                $usuarios[0]['idusuario'] = $idusuario;
                $usuarios[0]['idgrupo'] = null;
                $usuarios[0]['tipo'] = 1;
                $usuarios[0]['iconCls'] = $icon;
                $usuarios[0]['draggable'] = false;
                $usuarios[0]['leaf'] = true;
                $usuarios[0]['checked'] = $checked;
                $usuarios[0]['tipoinvol'] = $tipoinvol;
                return $usuarios;
                break;
            case 'nodo2':
                $arraydegrupos = DatPermiso::ObtenerPermisosSobreGrupo(
                                $idusuario
                );
                if (isset($arraydegrupos[0])) {
                    foreach ($arraydegrupos as $key => $grupo) {
                        $objgrupo = Doctrine::getTable('DatGrupo')->find(
                                $grupo['idpsobre']
                        );
                        $leaf = true;
                        $arrayusuarios
                                = DatGrupoUsuario::BuscarUsuariosPorGrupo(
                                        $grupo['idpsobre']
                        );
                        $arrayestructuras
                                = DatGrupoEstructura::BuscarEstructuraPorGrupo(
                                        $grupo['idpsobre']
                        );
                        $tienehijosusuarios = array_merge(
                                $arrayusuarios, $arrayestructuras
                        );
                        if ($tienehijosusuarios) {
                            $leaf = false;
                        }
                        $checked = false;
                        $tipoinvol == 1;
                        $icon = 'rolesygrupos';
                        if ($estamodificando == 1) {
                            switch ($idcomponente) {
                                case 'nomencladores':
                                    $objnom = Doctrine::getTable(
                                                    'NomNomenclador'
                                            )->find($idelemento);
                                    if ($objnom->publicoxtodos == 1) {
                                        $checked = true;
                                    }
                                    $espublicoparagrupo
                                            = DatGrupoNomNomenclador::ExisteRelacionGrupoNomenclador(
                                                    $grupo['idpsobre'], $idelemento
                                    );
                                    if ($espublicoparagrupo) {
                                        $checked = true;
                                    }
                                    break;
                                case 'arc':
                                    $nivelinvol = 2;
                                    $nivelinvol
                                            = $this->pIntegrator->planpdo->VerificarGrupoInvolucradoArc(
                                            $grupo['idpsobre'], $idelemento, $nivelinvol
                                    );
                                    if ($nivelinvol == 0 || $nivelinvol == 1
                                    ) {
                                        $tipoinvol = $nivelinvol;
                                        $checked = true;
                                        if ($tipoinvol == 0) {
                                            $icon = 'rolesygrupos';
                                        }
                                        if ($tipoinvol == 1) {
                                            $icon = 'rolesygrupos';
                                        }
                                    }
                                    break;
                            }
                        }
                        if ($idcomponente == 'nomencladores') {
                            $arraygrupos[$key]['id'] = $grupo['idpsobre'];
                            $arraygrupos[$key]['idgrupo']
                                    = $grupo['idpsobre'];
                            $arraygrupos[$key]['text']
                                    = $objgrupo->dengrupo;
                            $arraygrupos[$key]['iconCls'] = $icon;
                            $arraygrupos[$key]['tipo'] = 0;
                            $arraygrupos[$key]['draggable'] = false;
                            $arraygrupos[$key]['checked'] = $checked;
                            $arraygrupos[$key]['leaf'] = $leaf;
                        }
                        if ($idcomponente == 'arc') {
                            $arraygrupos[$key]['id'] = $grupo['idpsobre'];
                            $arraygrupos[$key]['idgrupo']
                                    = $grupo['idpsobre'];
                            $arraygrupos[$key]['text']
                                    = $objgrupo->dengrupo;
                            $arraygrupos[$key]['iconCls'] = $icon;
                            $arraygrupos[$key]['tipo'] = 0;
                            $arraygrupos[$key]['draggable'] = false;
                            $arraygrupos[$key]['checked'] = $checked;
                            $arraygrupos[$key]['leaf'] = $leaf;
                            $arraygrupos[$key]['tipoinvol'] = $tipoinvol;
                        }
                    }
                    return $arraygrupos;
                }
                return $arraygrupos;
                break;
            case 'nodo3':
                $arraysubordinados
                        = DatPermiso::ObtenerPermisosSobreSubordinados(
                                $idusuario
                );
                if (isset($arraysubordinados[0])) {
                    foreach ($arraysubordinados as $key => $subordinado) {
                        $idsubordinado = $subordinado['idpsobre'];
                        $nombresubordinado
                                = $this->integrator->seguridad->nombreUsuario(
                                $subordinado['idpsobre']
                        );
                        $nombresubordinado = $this->DameDenominacion(
                                $subordinado['idpsobre'], 'usuario'
                        );
                        $checked = false;
                        $tipoinvol == 1;
                        $icon = 'usuario';
                        if ($estamodificando == 1) {
                            switch ($idcomponente) {
                                case 'nomencladores':
                                    $objnom = Doctrine::getTable(
                                                    'NomNomenclador'
                                            )->find($idelemento);
                                    if ($objnom->publicoxtodos == 1) {
                                        $checked = true;
                                    }
                                    $espublicoparausuario
                                            = DatUsuarioNomNomenclador::
                                            ExisteRelacionUsuarioNomenclador(
                                                    $idsubordinado, $idelemento
                                    );
                                    if ($espublicoparausuario) {
                                        $checked = true;
                                    }
                                    break;
                                case 'arc':
                                    $nivelinvol = 2;
                                    $nivelinvol
                                            = $this->pIntegrator->planpdo->VerificarUsuarioInvolucradoArc(
                                            $idsubordinado, $idelemento, $nivelinvol
                                    );
                                    if ($nivelinvol == 0 || $nivelinvol == 1
                                    ) {
                                        $tipoinvol = $nivelinvol;
                                        $checked = true;
                                        if ($tipoinvol == 0) {
                                            $icon = 'persona';
                                        }
                                        if ($tipoinvol == 1) {
                                            $icon = 'usuario';
                                        }
                                    }
                                    break;
                            }
                        }
                        if ($idcomponente == 'nomencladores') {
                            $usuarios[$key]['id'] = $idgrupo
                                    . $idsubordinado;
                            $usuarios[$key]['text'] = $nombresubordinado;
                            $usuarios[$key]['idusuario'] = $idsubordinado;
                            $usuarios[$key]['idgrupo'] = null;
                            $usuarios[$key]['tipo'] = 1;
                            $usuarios[$key]['iconCls'] = $icon;
                            $usuarios[$key]['draggable'] = false;
                            $usuarios[$key]['leaf'] = true;
                            $usuarios[$key]['checked'] = $checked;
                        }
                        if ($idcomponente == 'arc') {
                            $usuarios[$key]['id'] = $idgrupo
                                    . $idsubordinado;
                            $usuarios[$key]['text'] = $nombresubordinado;
                            $usuarios[$key]['idusuario'] = $idsubordinado;
                            $usuarios[$key]['idgrupo'] = null;
                            $usuarios[$key]['tipo'] = 1;
                            $usuarios[$key]['iconCls'] = $icon;
                            $usuarios[$key]['draggable'] = false;
                            $usuarios[$key]['leaf'] = true;
                            $usuarios[$key]['checked'] = $checked;
                            $usuarios[$key]['tipoinvol'] = $tipoinvol;
                        }
                    }
                }
                return $usuarios;
                break;
            default:
                $cont = 0;
                $arrayusuarios = DatGrupoUsuario::BuscarUsuariosPorGrupo(
                                $idgrupo
                );
                $arrayestructuras
                        = DatGrupoEstructura::BuscarEstructuraPorGrupo(
                                $idgrupo
                );
                $tienehijosusuarios = array_merge(
                        $arrayusuarios, $arrayestructuras
                );
                if ($tienehijosusuarios) {
                    foreach ($tienehijosusuarios as $usuario) {
                        $checked = false;
                        $tipoinvol == 1;
                        $icon = 'usuario';
                        if ($idcomponente == 'nomencladores') {
                            if ($usuario['idestructura']) {
                                $usuarios[$cont]['id']
                                        = $idgrupo . $usuario['idestructura'];
                                $estructura
                                        = $this->integrator->metadatos->DameEstructura(
                                        $usuario['idestructura']
                                );
                                $usuarios[$cont]['text']
                                        = $estructura[0]->denominacion;
                                $usuarios[$cont]['idusuario']
                                        = $usuario['idestructura'];
                                $usuarios[$cont]['idestructura']
                                        = $usuario['idestructura'];
                                $usuarios[$cont]['idgrupo']
                                        = $usuario['idgrupo'];
                                $usuarios[$cont]['tipo'] = 2;
                                $usuarios[$cont]['icon']
                                        = $estructura[0]->icon;
                                $usuarios[$cont]['draggable'] = false;
                                $usuarios[$cont]['leaf'] = true;
                                $cont++;
                            } else {
                                $usuarios[$cont]['id']
                                        = $idgrupo . $usuario['idusuario'];
                                $usuarios[$cont]['text']
                                        = $this->integrator->seguridad->nombreUsuario(
                                        $usuario['idusuario']
                                );
                                $usuarios[$cont]['idusuario']
                                        = $usuario['idusuario'];
                                $usuarios[$cont]['idgrupo']
                                        = $usuario['idgrupo'];
                                $usuarios[$cont]['tipo'] = 1;
                                $usuarios[$cont]['iconCls'] = $icon;
                                $usuarios[$cont]['draggable'] = false;
                                $usuarios[$cont]['leaf'] = true;
                                $cont++;
                            }
                        }
                        if ($idcomponente == 'arc') {
                            $usuarios[$cont]['id']
                                    = $idgrupo . $usuario['idusuario'];
                            $usuarios[$cont]['text']
                                    = $this->integrator->seguridad->nombreUsuario(
                                    $usuario['idusuario']
                            );
                            $usuarios[$cont]['idusuario']
                                    = $usuario['idusuario'];
                            $usuarios[$cont]['idgrupo']
                                    = $usuario['idgrupo'];
                            $usuarios[$cont]['tipo'] = 1;
                            $usuarios[$cont]['iconCls'] = $icon;
                            $usuarios[$cont]['draggable'] = false;
                            $usuarios[$cont]['leaf'] = true;
                            $cont++;
                        }
                    }
                }
                return $usuarios;
        }
    }

    /*
     * funcion para cargar el arbol con los usuarios de un determinado domio
     */

    public function CargarUsuariosDelDominio(
    $certificado, $iddominio, $idusuario
    ) {
        $tienepermiso = 1;
        $contador = 0;
        if ($tienepermiso == 1) {
            $arrausuariosdominio = $this->CargarEstructuras(
                    $certificado, $idestructura = 0, $tipo = 0, $dominio = true, $arrausuariosdominio, $estaendominio = 0
            );
            if ($arrausuariosdominio) {
                foreach ($arrausuariosdominio as $usuariodominio) {
                    if ($usuariodominio['idusuario'] != $idusuario) {
                        $arrayuserdomain[$contador]['id']
                                = $usuariodominio['idusuario'];
                        $arrayuserdomain[$contador]['text']
                                = $usuariodominio['nombreusuario'];
                        $arrayuserdomain[$contador]['idusuario']
                                = $usuariodominio['idusuario'];
                        $arrayuserdomain[$contador]['draggable'] = false;
                        $arrayuserdomain[$contador]['checked'] = false;
                        $arrayuserdomain[$contador]['iconCls'] = 'usuario';
                        $arrayuserdomain[$contador]['leaf'] = true;
                        $arrayuserdomain[$contador]['tipo'] = 1;
                        $contador++;
                    }
                }
            }
        }
        return $arrayuserdomain;
    }

    public function CargarEstructuras(
    $certificado, $idestructura, $tipo, $dominio, &$arrausuariosdominio, $estaendominio
    ) {
        $arrausuariosdominio = array();
        $arrayidusuariossub
                = $this->integrator->seguridad->dominoHastaUsuarioCompleto(
                $certificado, $idestructura, $tipo, $estaendominio
        );
        if (isset($arrayidusuariossub[0])) {
            foreach ($arrayidusuariossub as $idusuario) {
                $arrausuariosdominio[] = array('idusuario' => $idusuario,
                    'nombreusuario' => $this->integrator->seguridad->nombreUsuario(
                            $idusuario
                ));
            }
        }
        return $arrausuariosdominio;
    }

    /*
     * funcion para cargar el arbol con los usuarios para los cuales voy a dar permisos
     */

    public function CargarPermisosParaAdicionar(
    $nodo, $idusuario, $idelemento, $tipo, $idgrupo, $estamodificando, $tipoelemento, $iddominio, $certificado, $idautor
    ) {
        switch ($idgrupo) {
            case 'nodo1':
                $usuarios = array();
                $checked = false;
                $tipoinvol = 1;
                $arraydatos = $this->VerificaSiUsuarioEsInvolucrado(
                        $idusuario, $estamodificando, $idelemento, $checked, $tipoinvol, $tipoelemento, $idautor
                );
                if ($arraydatos['tipoinvol'] == 0) {
                    $icon = 'persona';
                } else {
                    $icon = 'usuario';
                }
                $usuarios[0]['id'] = $idgrupo . $idautor;
                $usuarios[0]['text']
                        //= $this->integrator->seguridad->nombreUsuario($idautor);
                        = $this->DameDenominacion($idautor, 'usuario');
                $usuarios[0]['idusuario'] = $idautor;
                $usuarios[0]['idgrupo'] = null;
                $usuarios[0]['tipo'] = 1;
                $usuarios[0]['iconCls'] = $icon;
                $usuarios[0]['draggable'] = false;
                $usuarios[0]['leaf'] = true;
                $usuarios[0]['checked'] = $arraydatos['checked'];
                $usuarios[0]['tipoinvol'] = $arraydatos['tipoinvol'];
                return $usuarios;
                break;
            case 'nodo2':
                $count = 0;
                $arraydegrupos = DatGrupo::GetGruposPorPropietario(
                                $idautor
                );
                if ($arraydegrupos) {
                    foreach ($arraydegrupos as $key => $grupo) {
                        if ($grupo['activo'] == 1) {
                            $leaf = true;
                            $arrayusuarios
                                    = DatGrupoUsuario::BuscarUsuariosPorGrupo(
                                            $grupo['idgrupo']
                            );
                            $arrayestructuras
                                    = DatGrupoEstructura::BuscarEstructuraPorGrupo(
                                            $grupo['idgrupo']
                            );
                            $tienehijosusuarios = array_merge(
                                    $arrayusuarios, $arrayestructuras
                            );
                            if (isset($tienehijosusuarios[0])) {
                                $leaf = false;
                            }
                            $checked = false;
                            $tipoinvol = 1;
                            $arraydatos
                                    = $this->VerificaSiGrupoEsInvolucrado(
                                    $grupo['idgrupo'], $estamodificando, $idelemento, $checked, $tipoinvol, $tipoelemento
                            );
                            if ($arraydatos['tipoinvol'] == 0) {
                                $icon = 'rolesygrupos';
                            } else {
                                $icon = 'rolesygrupos';
                            }
                            $arraygrupos[$count]['id'] = $grupo['idgrupo'];
                            $arraygrupos[$count]['idgrupo']
                                    = $grupo['idgrupo'];
                            $arraygrupos[$count]['text']
                                    = $grupo['dengrupo'];
                            $arraygrupos[$count]['iconCls'] = $icon;
                            $arraygrupos[$count]['tipo'] = 0;
                            $arraygrupos[$count]['draggable'] = false;
                            $arraygrupos[$count]['checked']
                                    = $arraydatos['checked'];
                            $arraygrupos[$count]['leaf'] = $leaf;
                            $arraygrupos[$count]['tipoinvol']
                                    = $arraydatos['tipoinvol'];
                            $count++;
                        }
                    }
                }
                return $arraygrupos;
                break;
//            case 'nodo3':
//                $objdatpermiso = new DatPermiso();
//                $arraypermiso
//                        = $objdatpermiso->ObtenerPermisosSobreSubordinados(
//                        $idautor
//                );
//                if ($arraypermiso) {
//                    $index = false;
//                    foreach ($arraypermiso as $key => $permiso) {
//                        $checked = false;
//                        $tipoinvol = 1;
//                        $arrayusuario
//                                = $this->VerificaSiUsuarioEsInvolucrado(
//                                $permiso['idpsobre'], $estamodificando, $idelemento, $checked, $tipoinvol, $tipoelemento, $permiso['idpsobre']
//                        );
//                        if ($arrayusuario['tipoinvol'] == 0) {
//                            $icon = 'persona';
//                        } else {
//                            $icon = 'usuario';
//                        }
//                        $tipo = 'usuario';
//                        $denominacion = $this->DameDenominacion(
//                                $permiso['idpsobre'], $tipo, null
//                        );
//                        if ($denominacion == null) {
//                            unset($permiso[$key]);
//                            $index = true;
//                        } else {
//                            $result = $this->compararInvolucradosListados(
//                                    $permiso['idpsobre'], $idelemento
//                            );
//
//                            $arrayusersdomain[$key]['checked']
//                                    = $arrayusuario['checked'];
//                            if ($result['comparar']) {
//                                $denomestruc
//                                        = $result['estructura'][0]->denominacion;
//                                $arrayusersdomain[$key]['qtip']
//                                        = 'Usuario asignado a la estructura: <b>'
//                                        . "$denomestruc" . '</b>';
//                                $arrayusersdomain[$key]['checked'] = null;
//                            }
//                            $arrayusersdomain[$key]['id']
//                                    = $permiso['idpermiso'];
//                            $arrayusersdomain[$key]['text'] = $denominacion;
//                            $arrayusersdomain[$key]['idusuario']
//                                    = $permiso['idpsobre'];
//                            $arrayusersdomain[$key]['tipo'] = 1;
//                            $arrayusersdomain[$key]['iconCls'] = $icon;
//                            $arrayusersdomain[$key]['draggable'] = false;
//                            $arrayusersdomain[$key]['leaf'] = true;
//                            $arrayusersdomain[$key]['tipoinvol']
//                                    = $arrayusuario['tipoinvol'];
//                        }
//                    }
//                }
//                if ($index) {
//                    $arrayusersdomain = array_values($arrayusersdomain);
//                    $index = false;
//                }
//
//                return $arrayusersdomain;
//                break;
        case 'nodo3':
          $objdatpermiso = new DatPermiso();

          $arraypermiso = $objdatpermiso->ObtenerPermisosSobreSubordinados($idautor);

          //print_r($arraypermiso);die;

          if ($arraypermiso) {
            $index = false;
            foreach ($arraypermiso as $key => $permiso) {
              $checked = false;
              $tipoinvol = 1;
              if ($estamodificando == 1) {
                $arrayusuario
                        = $this->VerificaSiUsuarioEstaInvolucrado(
                        $permiso['idpsobre'], $estamodificando, $idelemento, $checked, $tipoinvol, $tipoelemento, $permiso['idpsobre']
                );
                $checked = $arrayusuario['checked'];
                $tipoinvol = $arrayusuario['tipoinvol'];
              }

              if ($tipoinvol == 0) {
                  $icon = 'persona';
              } else {
                  $icon = 'usuario';
              }

              $denominacion = self::nombrePersona($permiso['idpsobre']);

              if ($denominacion == null) {
                unset($permiso[$key]);
                $index = true;
              } else {
                $result = $this->compararInvolucradosListados(
                  $permiso['idpsobre'], $idelemento
                );

                $arrayusersdomain[$key]['checked'] = $checked;
                if ($result['comparar']) {
                  $denomestruc = $result['estructura'][0]->denominacion;
                  $arrayusersdomain[$key]['qtip'] = 'Usuario asignado a la estructura: <b>' . "$denomestruc" . '</b>';
                  $arrayusersdomain[$key]['checked'] = null;
                }
                $arrayusersdomain[$key]['id'] = $permiso['idpermiso'];
                $arrayusersdomain[$key]['text'] = $denominacion;
                $arrayusersdomain[$key]['idusuario'] = $permiso['idpsobre'];
                $arrayusersdomain[$key]['tipo'] = 1;
                $arrayusersdomain[$key]['iconCls'] = $icon;
                $arrayusersdomain[$key]['draggable'] = false;
                $arrayusersdomain[$key]['leaf'] = true;
                $arrayusersdomain[$key]['tipoinvol'] = 1;//$arrayusuario['tipoinvol'];
              }

              //print_r($arrayusersdomain);die;
            }
          }

          if ($index) {
            $arrayusersdomain = array_values($arrayusersdomain);
            $index = false;
          }
          //print_r($arrayusersdomain);die;

          return $arrayusersdomain;
          break;
            case 'nodo4':
                $count = 0;
                //busco los permisos que me han sido otorgados como usuario
                $permisoscomousuario = DatPermiso::GetPermisosPara(
                                $idautor
                );
                if ($permisoscomousuario) {
                    foreach ($permisoscomousuario as $permiso) {
                        $numeropermiso = $permiso['numpermiso'];
                        if ($numeropermiso == 2 || $numeropermiso == 3 || $numeropermiso == 7 || $numeropermiso ==
                                11 || $numeropermiso == 15
                        ) {
                            $tipo = 'usuario';
                            if ($permiso['tipopsobre'] == 0) {
                                $tipo = 'grupo';
                            }
                            $denominacionsobre = $this->DameDenominacion(
                                    $permiso['idpsobre'], $tipo, null
                            );
                            //por defecto que es un usuario sobre el cual tengo permiso
                            $tipo = 1;
                            $id = $idgrupo
                                    . $permiso['idpermiso'];
                            $leaf = true;
                            $icon = 'usuario';
                            $estaactivo = 1;
                            if ($permiso['tipoppara'] == 0) {
                                $objgrupopara = Doctrine::getTable(DatGrupo)
                                        ->find($permiso['idppara']);
                                if ($objgrupopara->activo == 0) {
                                    $estaactivo = 0;
                                }
                            }
                            //verifico si  es un grupo y cambio variables
                            if ($permiso['tipopsobre'] == 0) {
                                $objgrupo = Doctrine::getTable('DatGrupo')
                                        ->find($permiso['idpsobre']);
                                if ($objgrupo->activo == 0) {
                                    $estaactivo = 0;
                                }
                                $tipo = 0;
                                $id = $idgrupo . $permiso['idpermiso'];
                                $icon = 'rolesygrupos';
                                $tienehijosusuarios
                                        = DatGrupoUsuario::BuscarUsuariosPorGrupo(
                                                $permiso['idpsobre']
                                );
                                if (isset($tienehijosusuarios[0])) {
                                    $leaf = false;
                                }
                            }
                            $checked = false;
                            $tipoinvol = 1;
                            if ($tipo == 0) {
                                $idgrupo = $permiso['idpsobre'];
                                $arraydatos
                                        = $this->VerificaSiGrupoEsInvolucrado(
                                        $idgrupo, $estamodificando, $idelemento, $checked, $tipoinvol, $tipoelemento
                                );
                                if ($arraydatos['tipoinvol'] == 0) {
                                    $icon = 'gruporesponsable';
                                }
                                if ($arraydatos['tipoinvol'] == 1) {
                                    $icon = 'grupoejecutor';
                                }
                            }
                            if ($tipo == 1) {
                                $idusuario = $permiso['idpsobre'];
                                $arraydatos
                                        = $this->VerificaSiUsuarioEsInvolucrado(
                                        $idusuario, $estamodificando, $idelemento, $checked, $tipoinvol, $tipoelemento, $idusuario
                                );
                                if ($arraydatos['tipoinvol'] == 0) {
                                    $icon = 'persona';
                                }
                                if ($arraydatos['tipoinvol'] == 1) {
                                    $icon = 'usuario';
                                }
                            }
                            if ($estaactivo == 1) {
                                $otros[$count]['id'] = $id;
                                $otros[$count]['text'] = $denominacionsobre;
                                $otros[$count]['idgrupo'] = $idgrupo;
                                $otros[$count]['idusuario'] = $idusuario;
                                $otros[$count]['tipo'] = $tipo;
                                $otros[$count]['iconCls'] = $icon;
                                $otros[$count]['draggable'] = false;
                                $otros[$count]['leaf'] = $leaf;
                                $otros[$count]['checked']
                                        = $arraydatos['checked'];
                                $otros[$count]['tipoinvol']
                                        = $arraydatos['tipoinvol'];
                                $count++;
                            }
                        }
                    }
                }
                return $otros;
                break;
            default:
                $usuarios = array();
                $cont = 0;
                $arrayusuarios = DatGrupoUsuario::BuscarUsuariosPorGrupo(
                                $idgrupo
                );

                $arrayestructuras
                        = DatGrupoEstructura::BuscarEstructuraPorGrupo(
                                $idgrupo
                );
                $arrayuserestructuras = array_merge(
                        $arrayusuarios, $arrayestructuras
                );

                if (isset($arrayuserestructuras[0])) {
                    foreach ($arrayuserestructuras as $usuario) {
                        if ($usuario['idusuario'] != $idautor) {
                            $checked = false;
                            $tipoinvol = 1;
                            $idusuario = $usuario['idusuario'];
                            $icon = 'usuario';
                            $arraydatos
                                    = $this->VerificaSiGrupoEsInvolucrado(
                                    $idgrupo, $estamodificando, $idelemento, $checked, $tipoinvol, $tipoelemento
                            );
                            if ($arraydatos['tipoinvol'] == 0) {
                                $icon = 'persona';
                            }
                            if ($arraydatos['tipoinvol'] == 1) {
                                $icon = 'usuario';
                            }
                            if ($usuario['idestructura']) {
                                $usuarios[$cont]['id']
                                        = $nodo . $idgrupo
                                        . $usuario['idestructura'];
                                $estructura
                                        = $this->integrator->metadatos->DameEstructura(
                                        $usuario['idestructura']
                                );
                                $usuarios[$cont]['text']
                                        = $estructura[0]->denominacion;
                                $usuarios[$cont]['idusuario']
                                        = $usuario['idestructura'];
                                $usuarios[$cont]['idestructura']
                                        = $usuario['idestructura'];
                                $usuarios[$cont]['idgrupo']
                                        = $usuario['idgrupo'];
                                $usuarios[$cont]['tipo'] = 2;
                                $usuarios[$cont]['icon']
                                        = $estructura[0]->icon;
                                $usuarios[$cont]['draggable'] = false;
                                $usuarios[$cont]['leaf'] = true;
                                $usuarios[$cont]['checked']
                                        = $arraydatos['checked'];
                                $usuarios[$cont]['tipoinvol']
                                        = $arraydatos['tipoinvol'];
                                $cont++;
                            } else {
                                $usuarios[$cont]['id']
                                        = $nodo . $idgrupo
                                        . $usuario['idusuario'];
                                $usuarios[$cont]['text']
                                        = $this->integrator->seguridad->nombreUsuario(
                                        $usuario['idusuario']
                                );
                                $usuarios[$cont]['idusuario'] = $idusuario;
                                $usuarios[$cont]['idgrupo']
                                        = $usuario['idgrupo'];
                                $usuarios[$cont]['tipo'] = 1;
                                $usuarios[$cont]['iconCls'] = $icon;
                                $usuarios[$cont]['draggable'] = false;
                                $usuarios[$cont]['leaf'] = true;
                                $usuarios[$cont]['checked']
                                        = $arraydatos['checked'];
                                $usuarios[$cont]['tipoinvol']
                                        = $arraydatos['tipoinvol'];
                                $cont++;
                            }
                        }
                    }
                }
                return $usuarios;
        }
    }

    public function compararInvolucradosListados($idusuario, $idelemento) {
        $result = array();
        $comparar = false;
        $usuarioestruc = $this->pIntegrator->configuracionpdo->getEstructuraUsuario($idusuario);

        if (isset($usuarioestruc)) {
            $involucrados = $this->pIntegrator->planpdo->getInvolucrados(null, $idelemento);

            foreach ($involucrados as $key) {
                if ($key['idusuario'] == $usuarioestruc['sql'][0]['idestructura']
                ) {
                    $comparar = true;
                    break;
                }
            }
        }
        if ($comparar) {
            $idestructura = $usuarioestruc['sql'][0]['idestructura'];
            $datosestructura = $this->integrator->metadatos->DameEstructura(
                    $idestructura
            );
        }
        $result['comparar'] = $comparar;
        $result['estructura'] = $datosestructura;
        return $result;
    }

    /*
     * funcion para verificar si un grupo o un usuario se encuentra involucrado
     */

    public function VerificaSiGrupoEsInvolucrado(
    $idgrupo, $estamodificando, $idelemento, $checked, $tipoinvol, $tipoelemento
    ) {
        $cero = 0;
        $uno = 1;
        if ($estamodificando == 1) {
            $idinvolucradoresp = $idgrupo . $cero;
            $idinvolucradoejec = $idgrupo . $uno;
            $existocomoresp
                    = $this->pIntegrator->planpdo->VerificarInvolucrado(
                    $idinvolucradoresp, $idelemento, $tipoelemento
            );
            if (isset($existocomoresp[0])) {
                $checked = true;
                $tipoinvol = 0;
            }
            $existocomoejec
                    = $this->pIntegrator->planpdo->VerificarInvolucrado(
                    $idinvolucradoejec, $idelemento, $tipoelemento
            );
            if (isset($existocomoejec[0])) {
                $checked = true;
                $tipoinvol = 1;
            }
            //}
        }
        $arraydatos['checked'] = $checked;
        $arraydatos['tipoinvol'] = $tipoinvol;
        return $arraydatos;
    }

    /*
     * funcion para verificar si un grupo o un usuario se encuentra involucrado
     */

    public function VerificaSiUsuarioEsInvolucrado(
    $idusuario, $estamodificando, $idelemento, $checked, $tipoinvol, $tipoelemento, $idautor
    ) {
        $cero = 0;
        $uno = 1;
        if ($estamodificando == 1) {
            if ($tipoelemento != 'grupo' && $tipoelemento != 'nomenclador'
            ) {
                $idinvolucradoresp = $idautor . $cero;
                $idinvolucradoejec = $idautor . $uno;
                $existocomoresp
                        = $this->pIntegrator->planpdo->VerificarInvolucrado(
                        $idinvolucradoresp, $idelemento, $tipoelemento
                );
                if (isset($existocomoresp[0])) {
                    $checked = true;
                    $tipoinvol = 0;
                }
                $existocomoejec
                        = $this->pIntegrator->planpdo->VerificarInvolucrado(
                        $idinvolucradoejec, $idelemento, $tipoelemento
                );
                if (isset($existocomoejec[0])) {
                    $checked = true;
                    $tipoinvol = 1;
                }
            } else {
                $tabla = 'DatGrupoUsuario';
                $dql = "idgrupo = $idelemento";
                if ($tipoelemento == 'nomenclador') {
                    $tabla = 'DatGrupoUsuario';
                }
                $arrayobjusuarios = Doctrine::getTable($tabla)->findByDQL(
                        $dql
                );
                if (isset($arrayobjusuarios[0]->idusuario) && ($arrayobjusuarios[0]->idusuario !=
                        '' && $arrayobjusuarios[0]->idusuario != null)
                ) {
                    $checked = false;
                    $tipoinvol = 1;
                }
            }
        }
        $arraydatos['checked'] = $checked;
        $arraydatos['tipoinvol'] = $tipoinvol;
        return $arraydatos;
    }


    public function VerificaSiUsuarioEstaInvolucrado(
    $idusuario, $estamodificando, $idelemento, $checked, $tipoinvol, $tipoelemento, $idautor
    ) {
        $cero = 0;
        $uno = 1;
        if ($estamodificando == 1) {
          $idinvolucradoresp = $idautor . $cero;
          $idinvolucradoejec = $idautor . $uno;
          $existocomoresp
                  = $this->pIntegrator->planpdo->VerificarInvolucrado(
                  $idinvolucradoresp, $idelemento, $tipoelemento
          );
          if (isset($existocomoresp[0])) {
              $checked = true;
              $tipoinvol = 0;
          }
          $existocomoejec
                  = $this->pIntegrator->planpdo->VerificarInvolucrado(
                  $idinvolucradoejec, $idelemento, $tipoelemento
          );
          if (isset($existocomoejec[0])) {
              $checked = true;
              $tipoinvol = 1;
          }

        }
        $arraydatos['checked'] = $checked;
        $arraydatos['tipoinvol'] = $tipoinvol;
        return $arraydatos;
    }

    public function TienePermisoParaSobre($idppara, $idpsobre) {
        $arrayelementosboleanos[0] = 0; //leer
        $arrayelementosboleanos[1] = 0; //annadir
        $arrayelementosboleanos[2] = 0; //modificar
        $arrayelementosboleanos[3] = 0; //eliminar
        $arrayelementosboleanos[4] = 0; //es subordinado?
        $permiso = DatPermiso::DamePermisosParaSobre($idppara, $idpsobre);
        if (isset($permiso[0]['idpermiso'])) {
            $numpermiso = $permiso[0]['numpermiso'];
            $arrayelementosboleanos
                    = $this->ConvertirPermisoNumeroABoleanos(
                    $arrayelementosboleanos, $numpermiso
            );
            $arrayelementosboleanos[4] = $permiso[0]['subordinado'];
        }
        return $arrayelementosboleanos;
    }

    public function ActualizarSubordinacionDescendente(
    $accion, $idjefe, $idsubordinado, $nivelrelacion
    ) {
        if ($accion == 'adicionar' && $idjefe != $idsubordinado) {
            $existesub = Doctrine::getTable('DatSubordinacion')->findByDql("idpadre = $idjefe AND idhijo = $idsubordinado");
            if (!isset($existesub[0]->idpadre) || $existesub[0]->idpadre == '' || $existesub[0]->idpadre == null) {
                $objsubordinado = new DatSubordinacion();
                $objsubordinado->idpadre = $idjefe;
                $objsubordinado->idhijo = $idsubordinado;
                $objsubordinado->nivelrelacion = $nivelrelacion;
                $objsubordinado->save();
                //actualizo a todos los padres del jefe con el nuevo subordinado
                $arraypadresjefe = Doctrine::getTable('DatSubordinacion')->findByDql("idhijo = $idjefe");
                if (isset($arraypadresjefe[0]->idpadre) && $arraypadresjefe[0]->idpadre != null && $arraypadresjefe[0]->idpadre != '') {
                    foreach ($arraypadresjefe as $padrejefe) {
                        $idpadre = $padrejefe->idpadre;
                        $existerel = Doctrine::getTable("DatSubordinacion")->findByDql("idpadre = $idpadre AND idhijo = $idsubordinado");
                        if (!isset($existerel[0]->idpadre) || $existerel[0]->idpadre == null || $existerel[0]->idpadre == '') {
                            $objsubordinado = new DatSubordinacion();
                            $objsubordinado->idpadre = $idpadre;
                            $objsubordinado->idhijo = $idsubordinado;
                            $objsubordinado->nivelrelacion = ($padrejefe->nivelrelacion + 1);
                            $objsubordinado->save();
                        }
                    }
                }
                $arraysubordinadosnietos = Doctrine::getTable('DatSubordinacion')->findByDql(" idpadre = $idsubordinado ");
                if (isset($arraysubordinadosnietos[0]->idpadre) && $arraysubordinadosnietos[0]->idpadre != null && $arraysubordinadosnietos[0]->idpadre != '') {
                    $nivelrelacion++;
                    foreach ($arraysubordinadosnietos as $subordinadonieto) {
                        $this->ActualizarSubordinacionDescendente($accion, $idjefe, $subordinadonieto->idhijo, $nivelrelacion);
                    }
                }
            }
        }
        if ($accion == 'eliminar') {
            $subordinacion = Doctrine::getTable('DatSubordinacion')->findByDql("idpadre = $idjefe AND idhijo = $idsubordinado"
            );
            if (isset($subordinacion[0]->idpadre) && $subordinacion[0]->idpadre != '' && $subordinacion[0]->idpadre != null
            ) {
                $subordinacion[0]->delete();
                //elimino esta subordinacion en todos los padres del jefe
                $arrayascendencia = Doctrine::getTable('DatSubordinacion')->findByDql("idhijo = $idjefe");
                if (isset($arrayascendencia[0]->idpadre) && $arrayascendencia[0]->idpadre != '' && $arrayascendencia[0]->idpadre != null
                ) {
                    foreach ($arrayascendencia as $ascendencia) {
                        $idjefeabuelo = $ascendencia->idpadre;
                        $objsub = Doctrine::getTable('DatSubordinacion')
                                ->findByDql(
                                "idpadre = $idjefeabuelo AND idhijo = $idsubordinado"
                        );
                        if (isset($objsub[0]->idpadre) && $objsub[0]->idpadre != '' && $objsub[0]->idpadre != null
                        ) {
                            $objsub[0]->delete();
                        }
                    }
                }
                /* elimino las subordinaciones que se heredaron del hijo */
                $arraydescendencia = Doctrine::getTable('DatSubordinacion')
                        ->findByDql("idpadre = $idsubordinado");
                if (isset($arraydescendencia[0]->idpadre) && $arraydescendencia[0]->idpadre !=
                        '' && $arraydescendencia[0]->idpadre != null
                ) {
                    foreach ($arraydescendencia as $descendencia) {
                        $idhijo = $descendencia->idhijo;
                        $arraysubordinados = Doctrine::getTable(
                                        'DatSubordinacion'
                                )->findByDql(
                                "idpadre = $idjefe AND idhijo = $idhijo"
                        );
                        if (isset($arraysubordinados[0]->idpadre) && $arraysubordinados[0]->idpadre !=
                                '' && $arraysubordinados[0]->idpadre != null
                        ) {
                            $arraysubordinados[0]->delete();
                            /* elimino esta subordinacion en todos los padres del jefe */
                            $arrayascendencia = Doctrine::getTable(
                                            'DatSubordinacion'
                                    )->findByDql("idhijo = $idjefe");
                            if (isset($arrayascendencia[0]->idpadre) && $arrayascendencia[0]->idpadre != '' && $arrayascendencia[0]->idpadre != null
                            ) {
                                foreach ($arrayascendencia as $ascendencia) {
                                    $idjefe = $ascendencia->idpadre;
                                    $objsub = Doctrine::getTable(
                                                    'DatSubordinacion'
                                            )->findByDql(
                                            "idpadre = $idjefe AND idhijo = $idhijo"
                                    );
                                    if (isset($objsub[0]->idpadre) && $objsub[0]->idpadre != '' && $objsub[0]->idpadre != null
                                    ) {
                                        $objsub[0]->delete();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public function reorganizarPermisos($datos) {
        $idppara = $datos->idppara;
        $arraypermisossobresubordinados = Doctrine::getTable('DatPermiso')
                ->findByDql("idppara = $idppara AND subordinado = 1");
        if (isset($arraypermisossobresubordinados[0]->idpermiso) && $arraypermisossobresubordinados[0]->idpermiso != '' && $arraypermisossobresubordinados[0]->idpermiso != null
        ) {
            foreach ($arraypermisossobresubordinados as $permisosubordinado) {
                $idsubordinado = $permisosubordinado->idpsobre;
                $idjefe = $idppara;
                $existeusuariosub
                        = $this->integrator->seguridad->ObtenerUsuarioById(
                        $idsubordinado
                );
                if (isset($existeusuariosub->idusuario)) {
                    $nivelrelacion = 1;
                    $this->ActualizarSubordinacionDescendente(
                            $accion = 'adicionar', $idjefe, $idsubordinado, $nivelrelacion
                    );
                    $datos->idppara = $idsubordinado;
                    $this->reorganizarPermisos($datos);
                } else {
                    $permisosubordinado->delete();
                }
            }
        }
        $respuesta = 1;
        return $respuesta;
    }

    public function cargarCadenaSubordinacion($idusuariosession, $idsubordinado) {
        $arraysubordinados = DatPermiso::obtenerCadenaSubordinacion(
                        $idusuariosession, $idsubordinado
        );
        $arraynodossubordinados = array();
        if (isset($arraysubordinados[0]['idpadre'])) {
            foreach ($arraysubordinados as $key => $subordinado) {
                $leaf = true;
                $arraydescendencia = DatPermiso::obtenerCadenaSubordinacion(
                                $idusuariosession, $subordinado['idhijo']
                );
                if (isset($arraydescendencia[0]['idpadre'])) {
                    $leaf = false;
                }
                $icono = 'icondistra-usuario';
                $iconCls = 'imagen-none';
                if ($idsubordinado != 0) {
                    $icono = 'icondistra-persona';
                    $iconCls = 'imagen-none';
                }
                $arraynodossubordinados[$key]['id']
                        = $subordinado['idhijo'];
                $arraynodossubordinados[$key]['text']
                        = "<span class = " . $icono . '>' . ' '
                        . $this->DameDenominacion(
                                $subordinado['idhijo'], 'usuario'
                );
                /* = $this->integrator->seguridad->nombreUsuario(
                  $subordinado['idhijo']); */
                $arraynodossubordinados[$key]['idsubordinado']
                        = $subordinado['idhijo'];
                $arraynodossubordinados[$key]['draggable'] = false;
                $arraynodossubordinados[$key]['leaf'] = $leaf;
                $arraynodossubordinados[$key]['iconCls'] = $iconCls;
                $arraynodossubordinados[$key]['ctCls'] = $ctCls;
            }
        }
        return $arraynodossubordinados;
    }

    public function reorganizarSubordinacion($datos) {
        $idppara = $datos->idppara;
        $query
                = "select * from mod_objetivos.ft_reorganizarpermisos("
                . $idppara .
                ",1,1);";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        /* $result = */
        $res->fetchAll(PDO::FETCH_ASSOC);
        $respuesta = 1;
        return $respuesta;
    }

    public function nombrePersona($idusuario) {

        $query = " SELECT 
                  CASE WHEN p.idpersona is NULL THEN u.nombreusuario
                  ELSE p.nombre || ' ' || p.papel || ' ' || p.sapel END as nombreautor
                FROM 
                  mod_seguridad.seg_usuario u
                  
                  LEFT JOIN mod_persona.dat_persona p
                  ON u.idpersona = p.idpersona
                  where u.idusuario = {$idusuario} ";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);

        return (count($result)>0)?$result[0]['nombreautor']:null;
    }

    function cargarUsuariosDominio($idusuario, $iddominio) {
        ini_set("max_execution_time", 3600); //3600 1hora
        $arrayidestrucutras
                = $this->integrator->seguridad->getIdsEntityByUser(
                $idusuario
        );
        $arrayidcargos
                = $this->integrator->metadatos->obtenerCargosEstructuraInmediatos(
                $arrayidestrucutras, $iddominio
        );
        $result = array();
        if (isset($arrayidcargos[0])) {
            $arraypersonas
                    = $this->integrator->pvd->getPrincipalesDatosPersona(
                    null, null, null, null, null, $arrayidcargos
            );
            if (isset($arraypersonas->data[0])) {
                $arrayidpersonas = self::toUnidimencional(
                                $arraypersonas->data, 'idpersona'
                );
                $arrayusuarios = array();
                if (isset($arrayidpersonas[0])) {
                    $arrayusuarios
                            = $this->integrator->seguridad->getUsersInformationByArrayIdPersona(
                            $arrayidpersonas
                    );
                    $arraypersonas = array_replace_recursive($arraypersonas->data, $arrayusuarios);
                    if (isset($arraypersonas[0])) {
                        foreach ($arraypersonas as $persona => $key) {
                            $result[$persona]['idpersona'] = $key['idpersona'];
                            $result[$persona]['nombreapellidos'] = $key['nombreapellidos'];
                            $result[$persona]['idusuario'] = $key['idusuario'];
                            $result[$persona]['nombreusuario'] = $key['nombreusuario'];
                            $result[$persona]['iddominio'] = $key['iddominio'];
                            $result[$persona]['nombreapellidosusuario'] = '<b>' . $key['nombreapellidos'] . '</b><br>' . $key['nombreusuario'];
                        }
                        return $result;
                    }
                }
            }
        }
        return $result;
    }

}
