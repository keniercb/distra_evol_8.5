<?php

/**
 * Controlador para gestionar la asignacion de entidades a usuario
 *
 */
class CmpasignarentidadesController extends ZendExt_Controller_Secure
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
     * Accion para mostrar la vista cmpasignarentidades.phtml
     *
     */
    function cmpasignarentidadesAction()
    {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        //$this->view->jsayuda = $jsayuda; as
        $this->render();
    }

    function cargarArbolEntidadesAction()
    {
        $denoentidades = Array();
        $idusuario = $this->global->Perfil->idusuario;
        $denominacion = $this->_request->getPost('denominacion');
        $iddominio = $this->global->Perfil->iddominio;
        $entidades = $this->integrator->seguridad->getIdsEntityByUser(
            $idusuario
        );
        $cont = 0;
        /*if ($denominacion) {
            $j = $this->integrator->metadatos->obtenerEstructurasFiltroDenom(
                $iddominio, $denominacion, $entidades
            );
        }*/
        foreach ($entidades as $value) {
            $aux = Array();
            $aux[] = $value;
            $flag = true;
            /*$arrayidcargos
                = $this->integrator->metadatos->obtenerCargosEstructuraInmediatos(
                $aux, $iddominio
            );*/
//            if (count($arrayidcargos) > 0) {
                $asociada = DatUsuarioEstructura::obtenerEstructuraUser($value);
                $entidad = $this->integrator->metadatos->DameEstructura($value);
                if (($denominacion)
                    != null
                )//filtra en caso que exista la denominacion
                {
                    $flag = stristr($entidad[0]->denominacion, $denominacion);
                }
                if (($entidad[0]->idtipo != 7) && $flag && $entidad[0]->denominacion!="") {
                    if (isset($asociada[0])) {
                        $objpermisos = new GestionarpermisosModel();
                        $nombreuser = $objpermisos->DameDenominacion(
                            $asociada[0]['idusuario'], 'usuario'
                        );
                        $nombreautor = $objpermisos->DameDenominacion(
                            $asociada[0]['autor'], 'usuario'
                        );
                        $denoentidades[]['text']
                            = $entidad[0]->denominacion
                            . ' -- Asociada con: <b>'
                            . /*$this->integrator->seguridad->nombreUsuario(
                                $asociada[0]['idusuario']
                            )*/
                            $nombreuser . '</b>';
                        $denoentidades[$cont]['id'] = $value;
                        $denoentidades[$cont]['icon'] = $entidad[0]->icon;
                        $denoentidades[$cont]['cls'] = 'superior';
                        $denoentidades[$cont]['qtip'] = 'Asociada con <b>'
                            . /*$this->integrator->seguridad->nombreUsuario(
                                $asociada[0]['idusuario']
                            ) */
                            $nombreuser . '</b> el '
                            . $asociada[0]['fechaasociacion']
                            . ' por <b>'
                            . /*$this->integrator->seguridad->nombreUsuario(
                                $asociada[0]['autor']
                            )*/
                            $nombreautor . '</b>';
                        $denoentidades[$cont]['checked'] = false;
                        $denoentidades[$cont]['idrelacion']
                            = $asociada[0]['idusuarioestructura'];
                        $denoentidades[$cont++]['leaf'] = true;
                    } else {
                        $denoentidades[]['text'] = $entidad[0]->denominacion;
                        $denoentidades[$cont]['id'] = $value;
                        $denoentidades[$cont]['icon'] = $entidad[0]->icon;
                        $denoentidades[$cont]['checked'] = false;
                        $denoentidades[$cont++]['leaf'] = true;
                    }
                }

//            }
        }
        echo json_encode($denoentidades);
    }

    /**
     * Accion para buscar involucrados
     */
    function buscarinvolucradosAction()
    {
        $arreglo = null;
        ini_set("max_execution_time", 3600); //3600 1hora
        $denominacion = $this->_request->getPost('denominacion');
        $idusuario = $this->global->Perfil->idusuario;
        $permiso = $this->_request->getPost('permiso');
        /*   $asignarentidadesmodelo=new CmpasignarentidadesModel();
         $resultado=  $asignarentidadesmodelo->buscarinvolucrados();*/
        $objdatpermiso = new DatPermiso();
        //$arreglo= $objdatpermiso->buscarinvolucrados($idusuario,$denominacion,$permiso);
        $resultado = $objdatpermiso->ObtPermisosDado_UserDenSub(
            $idusuario, $denominacion,
            $subordinado = 1, $permiso
        );
        $cont = 0;
        foreach ($resultado as $key => $permiso) {
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
                $arreglo[$cont]['id'] = $permiso['idpsobre'];
                $arreglo[$cont]['text']
                    = $denominacionUser;//$permiso['denpsobre'];
                $arreglo[$cont]['idusuario'] = $permiso['idpsobre'];
                $arreglo[$cont]['draggable'] = false;
                if ($flaguser['flag'] != 'false') {
                    $arreglo[$cont]['checked'] = false;
                }
                $arreglo[$cont]['iconCls'] = 'usuario';
                $arreglo[$cont]['leaf'] = true;
                $arreglo[$cont]['tipo'] = 1;
                $cont++;
            }
        }
        if ($arreglo) {
            echo json_encode(array('nodos' => $arreglo, 'msj' => 1));
        } else {
            echo json_encode(array('msj' => 3));
        }
        /*   $estamodificando = $this->_request->getPost('estamodificando');
           $idelemento = $this->_request->getPost('idelemento');
           $idtipoelemento = $this->_request->getPost('idtipoelemento');
           $permiso = $this->_request->getPost('permiso');
           $resultado = $this->pIntegrator->configuracionpdo->BuscarInvolucrados($denominacion,
               $idusuario, $estamodificando, $idelemento, $idtipoelemento, $permiso);           
           if ($resultado) {
               echo json_encode(array('nodos' => $resultado, 'msj' => 1));
           } else {
               echo json_encode(array('msj' => 3));
           }*/
    }

    function cargarArbolRelacionesAutorAction()
    {
        //$denoentidades = Array();
        $idusuario = $this->global->Perfil->idusuario;
        //$iddominio = $this->global->Perfil->iddominio;
        $objAsignarEntidades = new CmpasignarentidadesModel();
        $denoentidades = $objAsignarEntidades->obtenerArbolRelacionesAutor(
            $idusuario
        );
        echo json_encode($denoentidades);
    }

    function adicioanarAsocUserEntidadAction()
    {
        $parametros['idusuario'] = $this->_request->getPost('idusuario');
        $parametros['accion'] = $this->_request->getPost('accion');
        $parametros['idrelacion'] = $this->_request->getPost('idrelacion');
        $parametros['idestructura'] = $this->_request->getPost('idestrctura');
        $parametros['autor'] = $this->global->Perfil->idusuario;
        $parametros['fecha_actual'] = date("d/m/Y");
        $flaguser['flag'] = 'true';
        $flagestr['flag'] = 'true';
        $obj = new CmpasignarentidadesModel();
        if ($parametros['accion'] == 'mod') {
            if (isset($parametros['idrelacion'])) {
                $parametros['relacionActual'] = Doctrine_Core::getTable(
                    'DatUsuarioEstructura'
                )->find($parametros['idrelacion']);
                if ($parametros['relacionActual']) {
                    if ($parametros['idusuario']
                        == $parametros['relacionActual']->idusuario
                        && $parametros['idestructura']
                        == $parametros['relacionActual']->idestructura
                    ) {
                        echo json_encode(array('resp' => 1));
                        return;
                    } else {
                        if ($parametros['idusuario']
                            == $parametros['relacionActual']->idusuario
                        ) {
                            $flagestr = $obj->verificarSiExisteEstruturaUser(
                                $parametros['idestructura']
                            );
                        } else {
                            if ($parametros['idestructura']
                                == $parametros['relacionActual']->idestructura
                            ) {
                                $flaguser
                                    = $obj->verificarSiExisteUserEstrutura(
                                    $parametros['idusuario']
                                );
                            }
                        }
                    }
                } else {
                    echo json_encode(array('resp' => 3));
                    return;
                }
            }
        } else {
            $flaguser = $obj->verificarSiExisteUserEstrutura(
                $parametros['idusuario']
            );
            $flagestr = $obj->verificarSiExisteEstruturaUser(
                $parametros['idestructura']
            );
        }
        if ($flaguser['flag'] != 'false' && $flagestr['flag'] != 'false') {
            $resp = $obj->adicionarAsocUserEstr($parametros);
            echo json_encode(array('resp' => $resp));
        } else {
            $objpermiso = new GestionarpermisosModel();
            if ($flaguser['flag'] == 'false'
                && $flagestr['flag'] == 'false'
            ) {
                /*$denousuario = $this->integrator->seguridad->nombreUsuario(
                    $flagestr['sql'][0]['idusuario']
                );*/
                $denousuario = $objpermiso->DameDenominacion(
                    $flagestr['sql'][0]['idusuario'], 'usuario'
                );
                $denoestructura = $this->integrator->metadatos->DameEstructura(
                    $flaguser['sql'][0]['idestructura']
                );
                echo json_encode(
                    array('resp'             => 5,
                          'estructura'       => $denoestructura[0]->denominacion,
                          'usuario'          => $denousuario,
                          'idrelacionestruc' => $flagestr['sql'][0]['idusuarioestructura'],
                          'idrelacion'       => $flaguser['sql'][0]['idusuarioestructura'])
                );
            } else {
                if ($flaguser['flag'] == 'false') {
                    /*$denoautor = $this->integrator->seguridad->nombreUsuario(
                        $flaguser['sql'][0]['autor']
                    );*/
                    $denoautor = $objpermiso->DameDenominacion(
                        $flaguser['sql'][0]['autor'], 'usuario'
                    );
                    $denoestructura
                        = $this->integrator->metadatos->DameEstructura(
                        $flaguser['sql'][0]['idestructura']
                    );
                    echo json_encode(
                        array('resp'        => $flaguser['resp'],
                              'autor'       => $denoautor,
                              'fecha'       => $flaguser['sql'][0]['fechaasociacion'],
                              'estrucutura' => $denoestructura[0]->denominacion,
                              'idrelacion'  => $flaguser['sql'][0]['idusuarioestructura'])
                    );
                } else {
                    if ($flagestr['flag'] == 'false') {
                        /*$denoautor
                            = $this->integrator->seguridad->nombreUsuario(
                            $flagestr['sql'][0]['autor']
                        );
                        $denousuario
                            = $this->integrator->seguridad->nombreUsuario(
                            $flagestr['sql'][0]['idusuario']
                        );*/
                        $denoautor = $objpermiso->DameDenominacion(
                            $flagestr['sql'][0]['autor'], 'usuario'
                        );
                        $denousuario = $objpermiso->DameDenominacion(
                            $flagestr['sql'][0]['idusuario'], 'usuario'
                        );
                        echo json_encode(
                            array('resp'       => $flagestr['resp'],
                                  'autor'      => $denoautor,
                                  'fecha'      => $flagestr['sql'][0]['fechaasociacion'],
                                  'usuario'    => $denousuario,
                                  'idrelacion' => $flagestr['sql'][0]['idusuarioestructura'])
                        );
                    }
                }
            }
        }
    }

    function actualizarUserEstructuraAction()
    {
        $parametros['idestructura'] = $this->_request->getPost('idestrctura');
        $parametros['idusuario'] = $this->_request->getPost('idusuario');
        $parametros['autor'] = $this->global->Perfil->idusuario;
        $parametros['idrelacion'] = $this->_request->getPost('idrelacion');
        $parametros['idrelacionestruc'] = $this->_request->getPost(
            'idrelacionestruc'
        );
        $parametros['fecha_actual'] = date("d/m/Y");
        $obj = new CmpasignarentidadesModel();
        $resp = $obj->actualizarUserEstrc($parametros);
        echo json_encode(array('mensaje' => $resp));
    }

    function listarAsociacionUserEstrucAction()
    {
        $parametros['start'] = ($this->_request->getPost('start'))
            ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit'))
            ? $this->_request->getPost('limit') : 20;
        $parametros['filtros'] = $this->_request->getPost('filtros');
        $parametros['idusuario'] = $this->global->Perfil->idusuario;
        $parametros['integrator'] = $this->integrator;
        $obj = new CmpasignarentidadesModel();
        $result = $obj->listarAsocUserEstruc($parametros);
        echo json_encode($result);
    }

    function activarDesactivarRelacionAction()
    {
        $parametros['accion'] = $this->_request->getPost('accion');
        $parametros['idrelacion'] = $this->_request->getPost('idrelacion');
        $obj = new CmpasignarentidadesModel();
        $resp = $obj->activarDesactivarRelacion($parametros);
        echo json_encode(
            array('resp' => $resp, 'accion' => $parametros['accion'])
        );
    }

    function eliminarAsociacionAction()
    {
        $parametros['idrelacion'] = $this->_request->getPost('idrelacion');
        $obj = new CmpasignarentidadesModel();
        $objrelacion = Doctrine::getTable('DatUsuarioEstructura')->find(
            $parametros['idrelacion']
        );
        if (isset($objrelacion)) {
            if ($obj->verificarUsoPermiso($objrelacion)) {
                $obj->Eliminar($objrelacion);
                echo json_encode(array('resp' => 1, 'accion' => 'eliminar'));
            } else {
                echo json_encode(array('resp' => 4, 'accion' => 'eliminar'));
            }
        } else {
            echo json_encode(array('resp' => 3, 'accion' => 'eliminar'));
        }
    }

}


