<?php

/**
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpgestionarelementoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function AdicionarElemento(
        $denelemento, $descelemento, $gradocumplimiento, $idtipoelemento,
        $activo, $estadocumplimiento, $estadoaprobpordefcto, $idusuariocrea,
        $dirgente, $participante, $autoManual = 0, $peso
    ) {
        $datelemento = new DatElementos();
        $datelemento->idusuariocrea = $idusuariocrea;
        $datelemento->denelemento = str_replace("'", "", $denelemento);
        $datelemento->descelemento = str_replace("'", "", $descelemento);
        $datelemento->fechacreacion = date('d/m/Y');
        $datelemento->gradocumplimiento = $gradocumplimiento;
        $datelemento->idtipoelemento = $idtipoelemento;
        $datelemento->idestadoaprob = $estadoaprobpordefcto;
        $datelemento->activo = $activo;
        $datelemento->estadocumplimiento = $estadocumplimiento;
        $datelemento->peso = $peso;

        if ($dirgente) {
            $datelemento->dirigente = str_replace("'", "", $dirgente);
        }
        if ($participante) {
            $datelemento->participante = str_replace("'", "", $participante);
        }
        $datelemento->actualizarporciento = $autoManual;
        $datelemento->save();
        return $datelemento;
    }

    public function ModificarElemento(
        $idelemento, $denelemento, $descelemento, $gradocumplimiento,
        $dirigente, $participante, $autoManual, $peso = 0
    ) {
        $datelemento = Doctrine::getTable('DatElementos')->find($idelemento);
        if ($datelemento) {
            $datelemento->actualizarporciento = $autoManual;
            $datelemento->denelemento = str_replace("'", "", $denelemento);
            if (isset($descelemento)) {
                $datelemento->descelemento = str_replace("'", "", $descelemento);
            }
            $datelemento->gradocumplimiento = $gradocumplimiento;
            $estadocumplimiento = $this->actualizarEstadoCumplimiento(
                $estadocumplimiento, $gradocumplimiento
            );
            $datelemento->estadocumplimiento = $estadocumplimiento;
            if (isset($dirigente)) {
                $datelemento->dirigente = str_replace("'", "", $dirigente);
            }
            if (isset($participante)) {
                $datelemento->participante = str_replace("'", "", $participante);
            }
            $datelemento->peso = $peso;
            $datelemento->save();
            return $datelemento;
        } else {
            return 3;
        }
    }

    /**
     * Funcion para modificar las fechas de los objetivos y los planes en gantt
     */
    public function modificarFechaGanttE($parametros)
    {
        if ($parametros->tipo == 0) {//Es un plan
            $objPlan = Doctrine::getTable('DatPlanPdo')->find(
                $parametros->idactividad
            );
            if (isset($objPlan->idplan) && $objPlan->idplan != '') {
                $objPlan->fechainicio = $parametros->finiact;
                $objPlan->fechafin = $parametros->ffinact;
                $objPlan->save();
                $respuesta = 1;
            } else {
                $respuesta = 0; //ya no se encuentra en los registros
            }
        } else {//Es un objetivo
            $objObjetivo = Doctrine::getTable('DatObjetivo')->find(
                $parametros->idactividad
            );
            if (isset($objObjetivo->idobjetivo)
                && $objObjetivo->idobjetivo != ''
            ) {
                $objObjetivo->fechainicio = $parametros->finiact;
                $objObjetivo->fechafin = $parametros->ffinact;
                $objObjetivo->save();
                $respuesta = 1;
            } else {
                $respuesta = 0; //ya no se encuentra en los registros
            }
        }
        return $respuesta;
    }

    /**
     * Funcion para eliminar los elementos
     */
    public function EliminarElementos($arrayidelementos)
    {
        $noexiste = 0;
        foreach ($arrayidelementos as $idelemento) {
            $objelemento = Doctrine::getTable('DatElementos')->find(
                $idelemento
            );
            if (isset($objelemento->idelemento)) {
                $objelemento->delete();
            } else {
                $noexiste = 1;
            }
        }
        if ($noexiste == 1 && count($arrayidelementos) == 1) {
            $mensaje = 0; //mensaje :el elemento no existe en el registro
        }
        if (count($arrayidelementos) > 1) {
            $mensaje = 2; // mensaje :elementos eliminados correctamente
        }
        if ($noexiste == 0 && count($arrayidelementos) == 1) {
            $mensaje = 1; //mensaje :elemento eliminado correctamente
        }
        return $mensaje;
    }

    public function actualizarEstadoCumplimiento(
        $estadocumplimiento, $porciento
    ) {
        if ($porciento <= 0) {

            $estadocumplimiento = "Sin cumplir";
        }
        if ($porciento > 0 && $porciento < 95) {
            $estadocumplimiento = "Parcialmente cumplido";
        }
        if ($porciento >= 95 && $porciento <= 100) {
            $estadocumplimiento = "Cumplida";
        }
        if ($porciento > 100) {
            $estadocumplimiento = "Sobrecumplida";
        }
        //  }
        return $estadocumplimiento;

    }


    public function EliminarRelacionesElementos($idelemento)
    {
        $obelemento = Doctrine::getTable('DatElementos')->find($idelemento);
        switch ($obelemento->idtipoelemento) {
            case 0:
                $arrayrelaciones = DatElementosDatElementos::BuscarElementos(
                    $idelemento
                );
                if (isset($arrayrelaciones[0])) {
                    foreach ($arrayrelaciones as $relacion) {
                        DatElementosDatElementos::EliminarRelaciones(
                            $idelemento
                        );
                    }
                }
                break;
        }
    }

    public function ActivarDesactivarElemento($objelemento, $estado)
    {
        $objelemento->activo = $estado;
        $objelemento->save();
        return $objelemento;
    }

    public function ObtenerAutores(
        /* $certificado, $iddominio, */
        $idusuariosession, $idgrupo, $nombreusuario
    ) {
        switch ($idgrupo) {
            case 'nodo1':
                $datosusuariosession[0]['id'] = $idgrupo . $idusuariosession;
                $datosusuariosession[0]['idusuario'] = $idusuariosession;
                $datosusuariosession[0]['text'] = $nombreusuario;
                $datosusuariosession[0]['tipo'] = 1;
                $datosusuariosession[0]['iconCls'] = 'usuarioejecutor';
                $datosusuariosession[0]['draggable'] = false;
                $datosusuariosession[0]['checked'] = false;
                $datosusuariosession[0]['leaf'] = true;

                return $datosusuariosession;
                break;
            case 'nodo2':
                $permisosubordinados
                    = $this->pIntegrator->configuracionpdo->DamePermisoSubordinados(
                    $idusuariosession
                );
                if (isset($permisosubordinados[0])) {
                    foreach ($permisosubordinados as $key => $subordinado) {
                        $datossubordinados[$key]['id']
                            = $idgrupo . $subordinado['idpsobre'];
                        $datossubordinados[$key]['idusuario']
                            = $subordinado['idpsobre'];
                        $datossubordinados[$key]['text']
                            = $subordinado['denpsobre'];
                        $datossubordinados[$key]['tipo'] = 1;
                        $datossubordinados[$key]['iconCls'] = 'usuarioejecutor';
                        $datossubordinados[$key]['draggable'] = false;
                        $datossubordinados[$key]['checked'] = false;
                        $datossubordinados[$key]['leaf'] = true;
                    }
                }
                return $datossubordinados;
                break;
            case 'nodo3':
                $arraypermisosleer
                    = $this->pIntegrator->configuracionpdo->DamePermisosLeer(
                    $idusuariosession
                );
                if (isset($arraypermisosleer[0])) {
                    foreach ($arraypermisosleer as $key => $permisoleer) {
                        $permisosleer[$key]['id']
                            = $idgrupo . $permisoleer['idusuario'];
                        $permisosleer[$key]['idusuario']
                            = $permisoleer['idusuario'];
                        $permisosleer[$key]['text']
                            = $permisoleer['nombreusuario'];
                        $permisosleer[$key]['tipo'] = 1;
                        $permisosleer[$key]['iconCls'] = 'usuarioejecutor';
                        $permisosleer[$key]['draggable'] = false;
                        $permisosleer[$key]['checked'] = false;
                        $permisosleer[$key]['leaf'] = true;
                    }
                }
                return $permisosleer;
                break;
        }
    }

    public function ObtenerArregloDeDependenciasParaDesgloce(
        $objelemento, $arrayelementos, $idtipoelemento, $objplangeneral
    ) {
        switch ($idtipoelemento) {
            case 0://plan
                //primero pido las areas relacionadas con el plan
                $arrayelementos['plan_arc']
                    = DatArcDatPlan::ObtenerAreasPorPlanes(
                    $objelemento->idelemento
                );
                $arrayidtipoelemento[0]['idtipoelemento'] = 3;
                $arrayorigen[0]['origen'] = 3;
                $arrayorigen[1]['origen'] = 1;
                //pido las actividades relacionadas directamente con el plan
                $arrayelementos['plan_activ']
                    = DatElementosDatElementos::BuscarElementosHijos(
                    $objelemento->idelemento, $arrayidtipoelemento,
                    $arrayorigen, $objelemento->idusuariocrea
                );
                break;
            case 1://objetivo
                //pido los criterios del objetivo
                $arrayelementos['criterios']
                    = DatCriteriomedida::ObtenerCriteriosByOvjetivo(
                    $objelemento->idelemento
                );
                //pido las actividades que cuelgan al objetivo
                $arrayelementos['actividades']
                    = DatElementosDatElementos::BuscarActivHijasDeObjet(
                    $objelemento->idelemento, $objplangeneral->idusuariocrea
                );
                break;
            case 2://fip
                $arrayidtipoelemento[0]['idtipoelemento'] = 3;
                $arrayorigen[0]['origen'] = 3;
                $arrayorigen[1]['origen'] = 1;
                //pido las actividades relacionadas directamente con el plan
                $arrayelementos['fip_activ']
                    = DatElementosDatElementos::BuscarElementosHijos(
                    $objelemento->idelemento, $arrayidtipoelemento,
                    $arrayorigen, $objelemento->idusuariocrea
                );
                $arrayidtipoelemento[0]['idtipoelemento'] = 1;
                $arrayelementos['fip_obj']
                    = DatElementosDatElementos::BuscarElementosHijos(
                    $objelemento->idelemento, $arrayidtipoelemento,
                    $arrayorigen, $objelemento->idusuariocrea
                );
                break;
            case 4://arc
                //pido las actividades que cuelgan al plan mediante areas
                $arrayelementos['actividades']
                    = DatArcDatPlanActividades::ObtenerRelacionPlanArcActByPlanArc(
                    $objplangeneral->idelemento, $objelemento->idarc,
                    $objplangeneral->idusuariocrea
                );
                //pido los objetivos que cuelgan del plan medinate areas
                $arrayelementos['objetivos']
                    = DatArcDatPlanObjetivo::ObtenerRelacionObjetivoArcActByPlanArc(
                    $objplangeneral->idelemento, $objelemento->idarc,
                    $objplangeneral->idusuariocrea
                );
                break;
            case 2://fip
                $arrayidtipoelemento[0]['idtipoelemento'] = 3;
                $arrayorigen[0]['origen'] = 3;
                $arrayorigen[1]['origen'] = 1;
                //pido las actividades relacionadas directamente con el plan
                $arrayelementos['fip_activ']
                    = DatElementosDatElementos::BuscarElementosHijos(
                    $objelemento->idelemento, $arrayidtipoelemento,
                    $arrayorigen, $objelemento->idusuariocrea
                );
                break;
        }
        return $arrayelementos;
    }

    public function CambiarEstadoAprobacion(
        $idelem, $idusuariosession, $idestadoinicial, $idestadofinal,
        $idtipodoc, $obj, $cant
    ) {
        $respuesta = array();
        $respuesta = $this->pIntegrator->workflow->Ejecutar(
            $idusuariosession, $idestadoinicial, $idestadofinal, $idtipodoc,
            $obj
        );
        if ($respuesta == 1) {
            $this->ActualizarEstadoAElemento(
                $idelem, $idestadofinal, $idtipodoc, $idusuariosession
            );
            if ($cant == 1) {
                $objelemento = Doctrine::getTable('DatElementos')->find(
                    $idelem
                );
                if ($objelemento->idelemento) {
                    $arraydatos->idtipoelemento = $objelemento->idtipoelemento;
                    $arraydatos->idelemento = $idelem;
                    $arrayelementos = $this->DezglozarElementos($arraydatos);
                    if (isset($arrayelementos[0])) {
                        $this->ObtenerElementosDelArreglo(
                            $arrayelementos, $idusuariosession,
                            $idestadoinicial, $idestadofinal, $idtipodoc, $obj
                        );
                    }
                }
            }
        } else {
            $respuesta = 3;
        }
        return $respuesta;
    }

    public function cambiandoEstadoAprobacion(
        $arrayidelementos, $idusuariosession, $idestadoinicial, $idestadofinal,
        $idtipodoc, $obj, $cant
    ) {
        $respuesta = array();
        $respuesta = $this->pIntegrator->workflow->Ejecutar(
            $idusuariosession, $idestadoinicial, $idestadofinal, $idtipodoc,
            $obj
        );
        if ($respuesta == 1) {
            $this->ActualizarEstadoAElemento(
                $idelem, $idestadofinal, $idtipodoc, $idusuariosession
            );
            if ($cant == 1) {
                $objelemento = Doctrine::getTable('DatElementos')->find(
                    $idelem
                );
                if ($objelemento->idelemento) {
                    $arraydatos->idtipoelemento = $objelemento->idtipoelemento;
                    $arraydatos->idelemento = $idelem;
                    $arrayelementos = $this->DezglozarElementos($arraydatos);
                    if (isset($arrayelementos[0])) {
                        $this->ObtenerElementosDelArreglo(
                            $arrayelementos, $idusuariosession,
                            $idestadoinicial, $idestadofinal, $idtipodoc, $obj
                        );
                    }
                }
            }
        } else {
            $respuesta = 3;
        }
        return $respuesta;
    }

    public function ObtenerElementosDelArreglo(
        $arrayelementos, $idusuariosession, $idestadoinicial, $idestadofinal,
        $idtipodoc, $obj
    ) {
        if (isset($arrayelementos[0])) {
            foreach ($arrayelementos as $elemento) {
                if ($elemento['idtipoelemento'] != 4
                    && $elemento['idtipoelemento'] != 5
                ) {
                    $objelemento = Doctrine::getTable('DatElementos')->find(
                        $elemento['idelemento']
                    );
                    $idestadoinicial = $objelemento->idestadoaprob;
                    $respuesta = $this->pIntegrator->workflow->Ejecutar(
                        $idusuariosession, $idestadoinicial, $idestadofinal,
                        $objelemento->idtipoelemento, $obj
                    );
                    if ($respuesta == 1) {
                        $this->ActualizarEstadoAElemento(
                            $elemento['idelemento'], $idestadofinal
                        );
                    }
                }
                if (isset($elemento['hijos'][0])) {
                    $this->ObtenerElementosDelArreglo(
                        $elemento['hijos'], $idusuariosession, $idestadoinicial,
                        $idestadofinal, $idtipodoc, $obj
                    );
                }
            }
        }
    }

    public function ActualizarEstadoAElemento($idelemento, $idestadofinal,
        $idtipodoc, $idusuariosession
    ) {
        
        
        $objelemento = Doctrine::getTable('DatElementos')->find($idelemento);
       $objelemento->idestadoaprob = $idestadofinal;
        $control = $this->pIntegrator->workflow->generaControl(
            $idestadofinal, $idtipodoc, $idusuariosession
       );
        
        
        if ($control[0]['generacontrol'] == 1) {
            
          
            $objelemento->controlcambio = 1;
            $objelemento->fechacontrolcambio = date('d/m/Y');
        }
        
        
     
        $objelemento->save();
    }

    public function actualizandoEstadoAElemento($parametros) {
      $arrayidelementos=implode(',', $parametros->arrayidelementos);

      try {
          $sql = ' update mod_objetivos.dat_elementos set idestadoaprob = '. $parametros->idestadofinal .' where idelemento IN (' . $arrayidelementos .')' ;

          $connA = Doctrine_Manager:: connection();
          $connA->execute($sql);

          $cadena
                          = " SELECT e.generacontrol
                        FROM mod_flujotrabajo.conf_doc_dat_estado e
                        WHERE e.idtipodoc = $parametros->idtipodocumento
                        AND e.idestado = $parametros->idestadofinal
                        AND e.idautor = $parametros->idusuariosession ";

          $res = $connA->execute($cadena);
          $control = $res->fetchAll();

          if ($control[0]['generacontrol'] == 1) {
            $sql = " update mod_objetivos.dat_elementos set controlcambio = 1,
                          fechacontrolcambio = now()
                          where idelemento IN (" . $arrayidelementos .")" ;

            $connA->execute($sql);

          }

          return 1;
          
        } catch (Exception $e) {
//            print_r($e->getMessage());die;
          return 0;
      }
      
      
      
    }

    public function ObtenerArregloDeDependencias(/* $objelemento, $arrayelementos */
    )
    {
        /* switch($objelemento->idtipoelemento)
          {
          case 0:
          //primero pido las areas relacionadas con el plan
          $arrayareasdelplan = DatArcDatPlan::ObtenerAreasPorPlanes(
          $objelemento->idelemento);
          $arrayelementos['plan_arc'] = $arrayareasdelplan;
          if(isset($arrayareasdelplan[0]))
          {
          foreach($arrayareasdelplan as $key=>$arc)
          {
          //pido las actividades que cuelgan al plan mediante areas
          $arrayelementos['plan_arc'][$key]['actividades'] =
          DatArcDatPlanActividades::ObtenerRelacionPlanArcActByPlanArc(
          $objelemento->idelemento,$arc['idarc'],$objelemento->idusuariocrea);
          //pido los objetivos que cuelgan del plan medinate areas
          $arrayobj_arc_plan =
          DatArcDatPlanObjetivo::ObtenerRelacionObjetivoArcActByPlanArc(
          $objelemento->idelemento,$arc['idarc'],$objelemento->idusuariocrea);
          $arrayelementos['plan_arc'][$key]['objetivos'] = $arrayobj_arc_plan;
          if(isset($arrayobj_arc_plan[0])) {
          foreach($arrayobj_arc_plan as $pos=>$objetivo) {
          //pido los criterios que cuelgan del objetivo
          $arrayelementos['plan_arc'][$key]['objetivos'][$pos]['citerios'] =
          DatCriteriomedida::ObtenerCriteriosByOvjetivo($objetivo['idelemento']);
          $arrayidtipoelemento[0]['idtipoelemento'] = 1;
          $arrayorigen[0]['origen'] = 3;
          $arrayorigen[1]['origen'] = 1;
          //pido las actividades que cuelgan del objetivo
          $arrayelementos['plan_arc'][$key]['objetivos'][$pos]['actividades'] =
          DatElementosDatElementos::BuscarElementosHijos(
          $objetivo['idelemento'],$arrayidtipoelemento,$arrayorigen,
          $objelemento->idusuariocrea);
          }
          }
          }
          }
          //pido las actividades relacionadas directamente con el plan
          $arrayidtipoelemento[0]['idtipoelemento'] = 3;
          $arrayorigen[0]['origen'] = 3;
          $arrayorigen[1]['origen'] = 1;
          $arrayelementos['plan_activ'] =
          DatElementosDatElementos::BuscarElementosHijos(
          $objelemento->idelemento,$arrayidtipoelemento,$arrayorigen,
          $objelemento->idusuariocrea);
          break;
          case 1:
          //pido los criterios que cuelgan del objetivo
          $arrayelementos['plan_arc_obj'][]['citerios'] =
          DatCriteriomedida::ObtenerCriteriosByOvjetivo(
          $objelemento->idelemento);
          $arrayidtipoelemento[0]['idtipoelemento'] = 1;
          $arrayorigen[0]['origen'] = 3;
          $arrayorigen[1]['origen'] = 1;
          //pido las actividades que cuelgan del objetivo
          $arrayelementos['plan_arc_obj'][]['actividades'] =
          DatElementosDatElementos::BuscarElementosHijos(
          $objelemento->idelemento,$arrayidtipoelemento,$arrayorigen,
          $objelemento->idusuariocrea);
          break;
          }
          return $arrayelementos; */
    }

    public function InvolucrarUsuariosAElementos(
        $arrayinvolucrados, $idelemento, $idtipoelemento /* $arraytipoinvol */
    )
    {
        if (isset($arrayinvolucrados[0])) {
            $objcalsificadorinvol = new ClasificadorinvolModel();
            foreach ($arrayinvolucrados as $involucrado) {
                if ($involucrado->tipo == 2) {
                    $usuarioestruc
                        = $this->pIntegrator->configuracionpdo->getUsuarioEstructura(
                        $involucrado->idusuario
                    );

                    $llaveinvolucrado = $usuarioestruc['sql'][0][idusuario];
                    $denominacion
                        = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                        $llaveinvolucrado, 'usuario'
                    );
                    if ($denominacion != null) {
                        $involucradouser = new stdClass();
                        $involucradouser->idinvolucrado = $llaveinvolucrado;
                        $involucradouser->llaveinvolucrado = $llaveinvolucrado;
                        $involucradouser->denominacion = $denominacion;
                        $involucradouser->idusuario = $llaveinvolucrado;
                        $involucradouser->idgrupo = null;
                        $involucradouser->tipo = 1;
                        $involucradouser->idestructura
                            = $usuarioestruc['sql'][0][idestructura];
                        $involucradouser->nombretipo = 'Usuario';
                        $involucradouser->tipoinvol = 1;
                        $involucradouser->idtipoinvolucrado
                            = $involucrado->idtipoinvolucrado;
                        $involucradouser->actualiza = $involucrado->actualiza;

                        $objcalsificadorinvol->Involucrar(
                            $involucradouser, $idelemento, $idtipoelemento,
                            $estamodificando = 0, $userestruc = true
                        );
                    }
                }
                $objcalsificadorinvol->Involucrar(
                    $involucrado, $idelemento, $idtipoelemento,
                    $estamodificando = 0
                );
            }
        }
    }

    public function EliminarUsuariosAElementos(
        $arrayinvolucradoseliminar, $idelemento, $idtipoelemento
    ) {
        if (isset($arrayinvolucradoseliminar[0])) {
            $objcalsificadorinvol = new ClasificadorinvolModel();
            foreach ($arrayinvolucradoseliminar as $involucrado) {
                $objcalsificadorinvol->EliminarInvolucrados(
                    $involucrado, $idelemento, $idtipoelemento
                );
            }
        }
    }

    public function RelacionarElementosAElementos(
        $idelemento, $idtipoelemento, $arrayelementosrelacionados,
        $parentrelacidelemento, $idautorrelacion
    ) {
        $objrelaciones = new CmprelacionesModel();
        $objrelaciones->RelacionarElementos(
            $idelemento, $idtipoelemento, $arrayelementosrelacionados,
            $parentrelacidelemento, $idautorrelacion
        );
    }

    /**
     * Funcion para obtener los valores de un nomenclador dado el id del elemento
     */
    public function DameNomencladorDadoIdElemento(
        $idelemento, $tiponomenclador, $tipoelemento
    ) {
        //Obtener el id del nomenclador asociado al elemento
        if ($tipoelemento != 6) {
            $elemnom = DatElementosNomNomenclador::DameIdNomencladorDadoTipoNom(
                $idelemento, $tiponomenclador
            );
            $nomenclador
                = $this->pIntegrator->configuracionpdo->DameDatosNomenclador(
                $elemnom[0]['idnomenclador']
            );
            if (isset($nomenclador->idnomenclador)) {
                $nom->idnomenclador = $nomenclador->idnomenclador;
                $nom->dennomenclador = $nomenclador->dennomenclador;
            }
        } else {
            $objcriterio = Doctrine::getTable('DatCriteriomedida')->find(
                $idelemento
            );
            $nomenclador
                = $this->pIntegrator->configuracionpdo->DameDatosNomenclador(
                $objcriterio->idumedida
            );
            $nom->idnomenclador = $nomenclador->idnomenclador;
            $nom->dennomenclador = $nomenclador->dennomenclador;
        }
        return $nom;
    }

    public function ObtenerEstadoAprobPorDefecto($idusuario, $idtipodocumento)
    {
        $arrayestadoinicial = $this->pIntegrator->workflow->EstadoPorDefecto(
            $idusuario, $idtipodocumento
        );
        if (isset($arrayestadoinicial[0])) {
            $idestadoaprobpordefecto = $arrayestadoinicial[0]->idestado;
        } else {
            $idestadoaprobpordefecto = null;
        }
        return $idestadoaprobpordefecto;
    }

    public function DezglozarElementos($arraydatos)
    {
        $arrayestados = $this->pIntegrator->workflow->EstadosVerDoc(
            $this->global->Perfil->idusuario, $arraydatos->idtipoelemento
        );
        $arrayestadoss = array();
        if (isset($arrayestados[0])) {
            foreach ($arrayestados as $estado) {
                $arrayestadoss[] = $estado['idestado'];
            }
            $arrayestadoss = implode(',', $arrayestadoss);
        }
        $arrayestados = $arrayestadoss;
        $arrayresp = array();
        if ($arraydatos->idtipoelemento != 5) {
            $objelemento = Doctrine::getTable('DatElementos')->find(
                $arraydatos->idelemento
            );
        } else {
            $objarc = Doctrine::getTable('DatArc')->find(
                $arraydatos->idelemento
            );
            $objelemento->idelemento = $objarc->idarc;
        }
        if (isset($objelemento->idelemento)) {
            $cont = 0;
            switch ($arraydatos->idtipoelemento) {
                case 0:
                    //busco las arc relacionadas con el plan
                    $arrayplanArc
                        = DatArcDatPlan::ObtenerAreasPorPlanesNohijas(
                        $objelemento->idelemento
                    );
                    if (isset($arrayplanArc[0]['idarc'])) {
                        foreach ($arrayplanArc as $key => $arc) {
                            $arrayresp[$cont]['id']
                                = $arraydatos->idelemento . $arc['idarc'];
                            $arrayresp[$cont]['text'] = $arc['denarc'];
                            $arrayresp[$cont]['idelemento'] = $arc['idarc'];
                            $arrayresp[$cont]['iconCls']
                                = 'gestionardocumentosporsubsistema';
                            $arrayresp[$cont]['draggable'] = false;
                            $arrayresp[$cont]['idtipoelemento'] = 5;
                            $leaf = true;
                            $arraydat->idelemento = $arc['idarc'];
                            $arraydat->idplan = $arraydatos->idelemento;
                            $arraydat->idtipoelemento = 5;
                            $arrayhijos = $this->DezglozarElementos($arraydat);
                            if (isset($arrayhijos[0])) {
                                $leaf = false;
                            }
                            $arrayresp[$cont]['leaf'] = $leaf;
                            $arrayresp[$cont]['hijos'] = $arrayhijos;
                            $cont++;
                        }
                    }
                    //busco las actividades relacionadas con el plan
                    $arrayorigen[0]['origen'] = 3;
                    $arrayorigen[1]['origen'] = 1;
                    $arrayplanAct
                        = DatElementosDatElementos::BuscarActividadesAlPlanSinRepeticion(
                        null, $arraydatos->idelemento, $arrayorigen, null,
                        $arrayestados
                    );
                    if (isset($arrayplanAct[0]['idelemento'])) {
                        foreach ($arrayplanAct as $key => $actividad) {
                            $procede = 1;
                            $arraypadres
                                = DatElementosDatElementos::EsElementoHijo(
                                $actividad['idelemento']
                            );
                            if (isset($arraypadres)) {
                                foreach ($arraypadres as $padre) {
                                    foreach ($arrayplanAct as $acti) {
                                        if ($padre['idelementopadre']
                                            == $acti['idelemento']
                                        ) {
                                            $procede = 0;
                                        }
                                    }
                                }
                            }
                            if ($procede == 1) {
                                $leaf = true;
                                $arrayresp[$cont]['id']
                                    = $arraydatos->idelemento
                                    . $actividad['idelemento'];
                                $arrayresp[$cont]['text']
                                    = $actividad['denelemento'];
                                $arrayresp[$cont]['idelemento']
                                    = $actividad['idelemento'];
                                $arrayresp[$cont]['iconCls'] = 'actividades';
                                $arrayresp[$cont]['draggable'] = false;
                                $arrayresp[$cont]['idtipoelemento'] = 3;
                                $arraydat->idelemento
                                    = $actividad['idelemento'];
                                $arraydat->idplan = $arraydatos->idelemento;
                                $arraydat->idtipoelemento = 3;
                                $arrayhijos = $this->DezglozarElementos(
                                    $arraydat
                                );
                                if (isset($arrayhijos[0])) {
                                    $leaf = false;
                                }
                                $arrayresp[$cont]['leaf'] = $leaf;
                                $arrayresp[$cont]['idarc'] = 0;
                                $arrayresp[$cont]['hijos'] = $arrayhijos;
                                $cont++;
                            }
                        }
                    }
                    $arrayobjetivos
                        = DatElementosDatElementos::BuscarObjetivosAlPlan(
                        $arraydatos->idelemento
                    );
                    if (isset($arrayobjetivos[0]['idelemento'])) {
                        foreach ($arrayobjetivos as $key => $objetivo) {
                            $procede = 1;
                            $arraypadres
                                = DatElementosDatElementos::EsElementoHijo(
                                $objetivo['idelemento']
                            );
                            if (isset($arraypadres)) {
                                foreach ($arraypadres as $padre) {
                                    foreach ($arrayobjetivos as $obj) {
                                        if ($padre['idelementopadre']
                                            == $obj['idelemento']
                                        ) {
                                            $procede = 0;
                                        }
                                    }
                                }
                            }
                            if ($procede == 1) {
                                $leaf = true;
                                $arrayresp[$cont]['id']
                                    = $arraydatos->idelemento
                                    . $objetivo['idelemento'];
                                $arrayresp[$cont]['text']
                                    = $objetivo['denelemento'];
                                $arrayresp[$cont]['idelemento']
                                    = $objetivo['idelemento'];
                                $arrayresp[$cont]['iconCls'] = 'archivo';
                                $arrayresp[$cont]['draggable'] = false;
                                $arrayresp[$cont]['idtipoelemento'] = 1;
                                $arraydat->idelemento
                                    = $objetivo['idelemento'];
                                $arraydat->idplan = $arraydatos->idelemento;
                                $arraydat->idtipoelemento = 1;
                                $arrayhijos = $this->DezglozarElementos(
                                    $arraydat
                                );
                                if (isset($arrayhijos[0])) {
                                    $leaf = false;
                                }
                                $arrayresp[$cont]['leaf'] = $leaf;
                                $arrayresp[$cont]['idarc'] = 0;
                                $arrayresp[$cont]['hijos'] = $arrayhijos;
                                $cont++;
                            }
                        }
                    }
                    break;
                case 1:
                    //busco los criterios de medidas del objetivo
                    $arraycriteriosmedida
                        = DatCriteriomedida::ObtenerCriteriosByOvjetivo(
                        $arraydatos->idelemento
                    );
                    if (isset($arraycriteriosmedida[0])) {
                        foreach ($arraycriteriosmedida as $key => $criterio) {
                            $arrayresp[$cont]['id'] = $arraydatos->idelemento
                                . $criterio['idcriteriomedida'];
                            $arrayresp[$cont]['text']
                                = $criterio['dencriterio'];
                            $arrayresp[$cont]['idelemento']
                                = $criterio['idcriteriomedida'];
                            $arrayresp[$cont]['iconCls'] = 'unidadmedida';
                            $arrayresp[$cont]['draggable'] = false;
                            $arrayresp[$cont]['idtipoelemento'] = 4;
                            $arrayresp[$cont]['leaf'] = true;
                            $cont++;
                        }
                    }
                    //verifico si el objetivo debe de estar relacionado a un 
                    //tercer elemento
                    if ($arraydatos->trinomio == 1) {
                        //pido los objetivos hijos relacionados con un plan 
                        //y un arc determinado                        
                        $arrayobjetivoshijos
                            = DatElementosDatElementos::BuscarSubObjetivosAlArcPlan(
                            $arraydatos->idelemento, $arraydatos->idplan,
                            $arraydatos->idarc
                        );
                        if (isset($arrayobjetivoshijos[0])) {
                            foreach ($arrayobjetivoshijos as $objetivohijo) {
                                $arrayresp[$cont]['id']
                                    = $arraydatos->idelemento
                                    . $objetivohijo['idobjetivo'];
                                $arrayresp[$cont]['text']
                                    = $objetivohijo['denelemento'];
                                $arrayresp[$cont]['idelemento']
                                    = $objetivohijo['idobjetivo'];
                                $arrayresp[$cont]['iconCls'] = 'archivo';
                                $arrayresp[$cont]['draggable'] = false;
                                $arrayresp[$cont]['idtipoelemento'] = 1;
                                $arrayresp[$cont]['idarc'] = $arraydatos->idarc;
                                $leaf = true;
                                $arraydat->idelemento = $objetivohijo['idobjetivo'];
                                $arraydat->idplan = $arraydatos->idplan;
                                $arraydat->idarc = $arraydatos->idarc;
                                $arraydat->trinomio = 1;
                                $arraydat->idtipoelemento = 1;
                                $arrayhijos = $this->DezglozarElementos(
                                    $arraydat
                                );
                                if (isset($arrayhijos[0])) {
                                    $leaf = false;
                                }
                                $arrayresp[$cont]['leaf'] = $leaf;
                                $arrayresp[$cont]['hijos'] = $arrayhijos;
                                $cont++;
                            }
                        }
                    } else {
                        if ($arraydatos->trinomio == 2) {
                            //pido los objetivos hijos relacionados con el fip
                            $arrayobjetivoshijos
                                = DatElementosDatElementos::BuscarSubObjetivosAlFIP(
                                $arraydatos->idelemento, $arraydatos->idfip
                            );
                            if (isset($arrayobjetivoshijos[0])) {
                                foreach ($arrayobjetivoshijos as $objetivohijo)
                                {
                                    $arrayresp[$cont]['id']
                                        = $arraydatos->idelemento
                                        . $objetivohijo['idobjetivo'];
                                    $arrayresp[$cont]['text']
                                        = $objetivohijo['denelemento'];
                                    $arrayresp[$cont]['idelemento']
                                        = $objetivohijo['idobjetivo'];
                                    $arrayresp[$cont]['iconCls'] = 'archivo';
                                    $arrayresp[$cont]['draggable'] = false;
                                    $arrayresp[$cont]['idtipoelemento'] = 1;
                                    $arrayresp[$cont]['idarc']
                                        = $arraydatos->idarc;
                                    $arrayresp[$cont]['idfip']
                                        = $arraydatos->idfip;
                                    $leaf = true;
                                    $arraydatap->idelemento
                                        = $objetivohijo['idobjetivo'];
                                    $arraydatap->idfip = $arraydatos->idfip;
                                    $arraydatap->trinomio = 2;
                                    $arraydatap->idtipoelemento = 1;
                                    $arrayhijos = $this->DezglozarElementos(
                                        $arraydatap
                                    );
                                    if (isset($arrayhijos[0])) {
                                        $leaf = false;
                                    }
                                    $arrayresp[$cont]['leaf'] = $leaf;
                                    $arrayresp[$cont]['hijos'] = $arrayhijos;
                                    $cont++;
                                }
                            }
                        } else {
                            //pido los objetivos hijos
                            $arrayobjetivoshijos
                                = DatElementosDatElementos::BuscarSubObjetivos(
                                $arraydatos->idelemento
                            );
                            if (isset($arrayobjetivoshijos[0])) {
                                foreach ($arrayobjetivoshijos as $objetivohijo)
                                {
                                    $arrayresp[$cont]['id']
                                        = $arraydatos->idelemento
                                        . $objetivohijo['idobjetivo'];
                                    $arrayresp[$cont]['text']
                                        = $objetivohijo['denelemento'];
                                    $arrayresp[$cont]['idelemento']
                                        = $objetivohijo['idobjetivo'];
                                    $arrayresp[$cont]['iconCls'] = 'archivo';
                                    $arrayresp[$cont]['draggable'] = false;
                                    $arrayresp[$cont]['idtipoelemento'] = 1;
                                    $arrayresp[$cont]['idarc']
                                        = $arraydatos->idarc;
                                    $leaf = true;
                                    $arraydat->idelemento
                                        = $objetivohijo['idobjetivo'];
                                    $arraydat->idplan = null;
                                    $arraydat->idarc = null;
                                    $arraydat->trinomio = 0;
                                    $arraydat->idtipoelemento = 1;
                                    $arrayhijos = $this->DezglozarElementos(
                                        $arraydat
                                    );
                                    if (isset($arrayhijos[0])) {
                                        $leaf = false;
                                    }
                                    $arrayresp[$cont]['leaf'] = $leaf;
                                    $arrayresp[$cont]['hijos'] = $arrayhijos;
                                    $cont++;
                                }
                            }
                        }
                    }
                    //busco las actividades que cuelgan del objetivo
                    $arrayorigen[0]['origen'] = 3;
                    $arrayorigen[1]['origen'] = 1;
                    $arrayactividades
                        = DatElementosDatElementos::BuscarActividadesAlPlanSinRepeticion(
                        null, $arraydatos->idelemento, $arrayorigen, null,
                        $arrayestados
                    );
                    if (isset($arrayactividades[0])) {
                        foreach ($arrayactividades as $key => $actividad) {
                            $procede = 1;
                            $arraypadres
                                = DatElementosDatElementos::EsElementoHijo(
                                $actividad['idelemento']
                            );
                            if (isset($arraypadres)) {
                                foreach ($arraypadres as $padre) {
                                    foreach ($arrayactividades as $acti) {
                                        if ($padre['idelementopadre']
                                            == $acti['idelemento']
                                        ) {
                                            $procede = 0;
                                        }
                                    }
                                }
                            }
                            if ($procede == 1) {
                                $leaf = true;
                                $arrayresp[$cont]['id']
                                    = $arraydatos->idelemento
                                    . $actividad['idelemento'];
                                $arrayresp[$cont]['text']
                                    = $actividad['denelemento'];
                                $arrayresp[$cont]['idelemento']
                                    = $actividad['idelemento'];
                                $arrayresp[$cont]['iconCls'] = 'actividades';
                                $arrayresp[$cont]['draggable'] = false;
                                $arrayresp[$cont]['idtipoelemento'] = 3;
                                $arraydato->idelemento
                                    = $actividad['idelemento'];
                                $arraydato->idplan = $arraydatos->idelemento;
                                $arraydato->idtipoelemento = 3;
                                $arrayhijos = $this->DezglozarElementos(
                                    $arraydato
                                );
                                if (isset($arrayhijos[0])) {
                                    $leaf = false;
                                }
                                $arrayresp[$cont]['leaf'] = $leaf;
                                $arrayresp[$cont]['idarc'] = 0;

                                $arrayresp[$cont]['hijos'] = $arrayhijos;

                                $cont++;
                            }
                        }
                    }
                    //Busco las desviaciones relacionadas al objetivo
                    $arrayDesviaciones
                        = DatElementosDatElementos::BuscarDesviacionesRelacionadas(
                        $arraydatos->idelemento
                    );
                    if (isset($arrayDesviaciones[0])) {
                        foreach ($arrayDesviaciones as $key => $desviacion) {
                            $procede = 1;
                            if ($procede == 1) {
                                $leaf = true;
                                $arrayresp[$cont]['id']
                                    = $arraydatos->idelemento
                                    . $desviacion['idelemento'];
                                $arrayresp[$cont]['text']
                                    = $desviacion['denelemento'];
                                $arrayresp[$cont]['idelemento']
                                    = $desviacion['idelemento'];
                                $arrayresp[$cont]['iconCls'] = 'conflicto';
                                $arrayresp[$cont]['draggable'] = false;
                                $arrayresp[$cont]['idtipoelemento'] = 6;
                                $arraydato->idelemento
                                    = $desviacion['idelemento'];
                                $arraydato->idplan = $arraydatos->idelemento;
                                $arraydato->idtipoelemento = 6;
                                $arrayhijos = $this->DezglozarElementos(
                                    $arraydato
                                );
                                if (isset($arrayhijos[0])) {
                                    $leaf = false;
                                }
                                $arrayresp[$cont]['leaf'] = $leaf;
                                $arrayresp[$cont]['idarc'] = 0;
                                $arrayresp[$cont]['hijos'] = $arrayhijos;
                                $cont++;
                            }
                        }
                    }
                    break;
                case 2:
                    //pido los fips hijos
                    $arrayfiphijos = DatElementosDatElementos::BuscarSubFips(
                        $arraydatos->idelemento
                    );
                    if (isset($arrayfiphijos[0])) {
                        foreach ($arrayfiphijos as $fiphijo) {
                            $arrayresp[$cont]['id']
                                = $arraydatos->idelemento . $fiphijo['idfip'];
                            $arrayresp[$cont]['text'] = $fiphijo['denelemento'];
                            $arrayresp[$cont]['idelemento'] = $fiphijo['idfip'];
                            $arrayresp[$cont]['iconCls'] = 'ficha';
                            $arrayresp[$cont]['draggable'] = false;
                            $arrayresp[$cont]['idtipoelemento'] = 2;
                            $arrayresp[$cont]['idarc'] = 0;
                            $leaf = true;
                            $arraydat->idelemento = $fiphijo['idfip'];
                            $arraydat->idplan = null;
                            $arraydat->idarc = null;
                            $arraydat->trinomio = 0;
                            $arraydat->idtipoelemento = 2;
                            $arrayhijos = $this->DezglozarElementos($arraydat);
                            if (isset($arrayhijos[0])) {
                                $leaf = false;
                            }
                            $arrayresp[$cont]['leaf'] = $leaf;

                            $arrayresp[$cont]['hijos'] = $arrayhijos;

                            $cont++;
                        }
                    }
                    //pido los objetivos relacionados con el fip
                    $arrayorigen[0]['origen'] = 3;
                    $arrayorigen[1]['origen'] = 1;
                    $arrayobjetivos
                        = DatElementosDatElementos::BuscarObjetivosAlFip(
                        $arraydatos->idelemento, $arrayorigen
                    );
                    if (isset($arrayobjetivos[0])) {
                        foreach ($arrayobjetivos as $key => $objetivo) {
                            $procede = 1;
                            $arraypadres
                                = DatElementosDatElementos::EsElementoHijo(
                                $objetivo['idelemento']
                            );
                            if (isset($arraypadres)) {
                                foreach ($arraypadres as $padre) {
                                    foreach ($arrayobjetivos as $obj) {
                                        if ($padre['idelementopadre']
                                            == $obj['idelemento']
                                        ) {
                                            $procede = 0;
                                        }
                                    }
                                }
                            }
                            if ($procede == 1) {
                                $arrayresp[$cont]['id']
                                    = $arraydatos->idelemento
                                    . $objetivo['idobjetivo'];
                                $arrayresp[$cont]['text']
                                    = $objetivo['denelemento'];
                                $arrayresp[$cont]['idelemento']
                                    = $objetivo['idobjetivo'];
                                $arrayresp[$cont]['iconCls'] = 'archivo';
                                $arrayresp[$cont]['draggable'] = false;
                                $arrayresp[$cont]['idtipoelemento'] = 1;
                                $arrayresp[$cont]['idarc'] = $arraydatos->idarc;
                                $arrayresp[$cont]['trinomio'] = 2;
                                $arrayresp[$cont]['idfip']
                                    = $arraydatos->idelemento;
                                $leaf = true;
                                $arraydatop->idelemento
                                    = $objetivo['idobjetivo'];
                                $arraydatop->idfip = $arraydatos->idelemento;
                                $arraydatop->trinomio = 2;
                                $arraydatop->idtipoelemento = 1;
                                $arrayhijos = $this->DezglozarElementos(
                                    $arraydatop
                                );
                                if (isset($arrayhijos[0])) {
                                    $leaf = false;
                                }
                                $arrayresp[$cont]['leaf'] = $leaf;

                                $arrayresp[$cont]['hijos'] = $arrayhijos;

                                $cont++;
                            }
                        }
                    }
                    //pido las actividades relacionadas al fip
                    $arrayactividades
                        = DatElementosDatElementos::BuscarActividadesAlFipSinRepeticion(
                        $arraydatos->idelemento, $arrayorigen
                    );
                    if (isset($arrayactividades[0])) {
                        foreach ($arrayactividades as $key => $actividad) {
                            $procede = 1;
                            $arraypadres
                                = DatElementosDatElementos::EsElementoHijo(
                                $actividad['idelemento']
                            );
                            if (isset($arraypadres)) {
                                foreach ($arraypadres as $padre) {
                                    foreach ($arrayactividades as $acti) {
                                        if ($padre['idelementopadre']
                                            == $acti['idelemento']
                                        ) {
                                            $procede = 0;
                                        }
                                    }
                                }
                            }
                            if ($procede == 1) {
                                $leaf = true;
                                $arrayresp[$cont]['id']
                                    = $arraydatos->idelemento
                                    . $actividad['idelemento'];
                                $arrayresp[$cont]['text']
                                    = $actividad['denelemento'];
                                $arrayresp[$cont]['idelemento']
                                    = $actividad['idelemento'];
                                $arrayresp[$cont]['iconCls'] = 'actividades';
                                $arrayresp[$cont]['draggable'] = false;
                                $arrayresp[$cont]['idtipoelemento'] = 3;
                                $arraydato->idelemento
                                    = $actividad['idelemento'];
                                $arraydato->idplan = $arraydatos->idelemento;
                                $arraydato->idtipoelemento = 3;
                                $arrayhijos = $this->DezglozarElementos(
                                    $arraydato
                                );
                                if (isset($arrayhijos[0])) {
                                    $leaf = false;
                                }
                                $arrayresp[$cont]['leaf'] = $leaf;
                                $arrayresp[$cont]['idarc'] = 0;

                                $arrayresp[$cont]['hijos'] = $arrayhijos;

                                $cont++;
                            }
                        }
                    }

                    break;
                case 3:
                    //verifico si la actividad debe de estar relacionado a un tercer elemento
                    if ($arraydatos->idarc) {
                        $arrayorigen[0]['origen'] = 3;
                        $arrayorigen[1]['origen'] = 1;
                        $arrayactividadeshijas
                            = DatElementosDatElementos::BuscarSubActividadesAlArcPlanSinRepeticion(
                            $arraydatos->idelemento, $arraydatos->idplan,
                            $arraydatos->idarc, $arrayorigen, null
                        );
                        if (isset($arrayactividadeshijas[0])) {
                            foreach ($arrayactividadeshijas as $actividad) {
                                $leaf = true;
                                $arrayresp[$cont]['id']
                                    = $arraydatos->idelemento
                                    . $actividad['idelemento'];
                                $arrayresp[$cont]['text']
                                    = $actividad['denelemento'];
                                $arrayresp[$cont]['idelemento']
                                    = $actividad['idelemento'];
                                $arrayresp[$cont]['iconCls'] = 'actividades';
                                $arrayresp[$cont]['draggable'] = false;
                                $arrayresp[$cont]['idtipoelemento'] = 3;
                                $arraydatas->idarc = $arraydatos->idarc;
                                $arraydatas->idplan = $arraydatos->idplan;
                                $arraydatas->idelemento
                                    = $actividad['idelemento'];
                                $arraydatas->idtipoelemento = 3;
                                $arrayhijos = $this->DezglozarElementos(
                                    $arraydatas
                                );
                                if (isset($arrayhijos[0])) {
                                    $leaf = false;
                                }
                                $arrayresp[$cont]['leaf'] = $leaf;
                                $arrayresp[$cont]['idarc'] = $arraydatos->idarc;

                                $arrayresp[$cont]['hijos'] = $arrayhijos;

                                $cont++;
                            }
                        }
                    } else {
                        //busco las actividades hijas
                        $arrayactividadeshijas
                            = DatElementosDatElementos::BuscarSubActividadesAlElementoPadre(
                            $arraydatos->idelemento, $arraydatos->idplan
                        );
                        if (isset($arrayactividadeshijas[0])) {
                            foreach ($arrayactividadeshijas as $actividad) {
                                $leaf = true;
                                $arrayresp[$cont]['id']
                                    = $arraydatos->idelemento
                                    . $actividad['idelemento'];
                                $arrayresp[$cont]['text']
                                    = $actividad['denelemento'];
                                $arrayresp[$cont]['idelemento']
                                    = $actividad['idelemento'];
                                $arrayresp[$cont]['iconCls'] = 'actividades';
                                $arrayresp[$cont]['draggable'] = false;
                                $arrayresp[$cont]['idtipoelemento'] = 3;
                                $arrayresp[$cont]['tipoelemento'] = 'Actividad';
                                $arraydata->idelemento
                                    = $actividad['idelemento'];
                                $arraydata->idplan = $arraydatos->idplan;
                                $arraydata->idtipoelemento = 3;
                                $arrayhijos = $this->DezglozarElementos(
                                    $arraydata
                                );
                                if (isset($arrayhijos[0])) {
                                    $leaf = false;
                                }
                                $arrayresp[$cont]['leaf'] = $leaf;
                                $arrayresp[$cont]['idarc'] = 0;

                                $arrayresp[$cont]['hijos'] = $arrayhijos;

                                $cont++;
                            }
                        }
                    }
                    break;
                case 5:
                    //pido las arc hijas relacionadas al plan
                    $archijas = DatArcDatPlan::ObtenerAreasPorPlanesHijas(
                        $arraydatos->idplan, $arraydatos->idelemento
                    );
                    if (isset($archijas[0]['idarc'])) {
                        foreach ($archijas as $arc) {
                            $arrayresp[$cont]['id']
                                = $arraydatos->idelemento . $arc['idarc'];
                            $arrayresp[$cont]['text'] = $arc['denarc'];
                            $arrayresp[$cont]['idelemento'] = $arc['idarc'];
                            $arrayresp[$cont]['iconCls']
                                = 'gestionardocumentosporsubsistema';
                            $arrayresp[$cont]['draggable'] = false;
                            $arrayresp[$cont]['idtipoelemento'] = 5;
                            $caduca = 'Si';
                            if ($arc['caduca'] == 0) {
                                $caduca = 'No';
                            }
                            $arrayresp[$cont]['caduca'] = $caduca;
                            $leaf = true;
                            $arraydat->idelemento = $arc['idarc'];
                            $arraydat->idplan = $arraydatos->idplan;
                            $arraydat->idtipoelemento = 5;
                            $arrayhijos = $this->DezglozarElementos($arraydat);
                            if (isset($arrayhijos[0])) {
                                $leaf = false;
                            }
                            $arrayresp[$cont]['leaf'] = $leaf;

                            $arrayresp[$cont]['hijos'] = $arrayhijos;

                            $cont++;
                        }
                    }
                    //pido los objetivos relacionados al arc y al plan
                    $objetivosrel
                        = DatArcDatPlanObjetivo::ObtenerObjetivosARCPlan(
                        $arraydatos->idplan, $arraydatos->idelemento
                    );
                    if (isset($objetivosrel[0])) {
                        foreach ($objetivosrel as $objetivo) {
                            $procede = 1;
                            $arraypadres
                                = DatElementosDatElementos::EsElementoHijo(
                                $objetivo['idobjetivo']
                            );
                            if (isset($arraypadres)) {
                                foreach ($arraypadres as $padre) {
                                    foreach ($objetivosrel as $obj) {
                                        if ($padre['idelementopadre']
                                            == $obj['idobjetivo']
                                        ) {
                                            $procede = 0;
                                        }
                                    }
                                }
                            }
                            if ($procede == 1) {
                                $arrayresp[$cont]['id']
                                    = $arraydatos->idelemento
                                    . $objetivo['idobjetivo'];
                                $arrayresp[$cont]['text']
                                    = $objetivo['DatElementos']['denelemento'];
                                $arrayresp[$cont]['idelemento']
                                    = $objetivo['idobjetivo'];
                                $arrayresp[$cont]['iconCls'] = 'archivo';
                                $arrayresp[$cont]['draggable'] = false;
                                $arrayresp[$cont]['idtipoelemento'] = 1;
                                $arrayresp[$cont]['idarc']
                                    = $arraydatos->idelemento;
                                $leaf = true;
                                $arraydat->idelemento = $objetivo['idobjetivo'];
                                $arraydat->idplan = $arraydatos->idplan;
                                $arraydat->idarc = $arraydatos->idelemento;
                                $arraydat->trinomio = 1;
                                $arraydat->idtipoelemento = 1;
                                $arrayhijos = $this->DezglozarElementos(
                                    $arraydat
                                );
                                if (isset($arrayhijos[0])) {
                                    $leaf = false;
                                }
                                $arrayresp[$cont]['leaf'] = $leaf;

                                $arrayresp[$cont]['hijos'] = $arrayhijos;

                                $cont++;
                            }
                        }
                    }
                    //pido las actividades relacionadas al arc y al plan
                    $arrayorigen[0]['origen'] = 3;
                    $arrayorigen[1]['origen'] = 1;
                    $actividadesrel
                        = DatElementosDatElementos::BuscarActividadesAlArcPlanSinRepeticion(
                        null, $arraydatos->idplan, $arraydatos->idelemento,
                        $arrayorigen, null
                    );
                    if (isset($actividadesrel[0])) {
                        foreach ($actividadesrel as $actividad) {
                            $procede = 1;
                            $arraypadres
                                = DatElementosDatElementos::EsElementoHijo(
                                $actividad['idelemento']
                            );
                            if (isset($arraypadres)) {
                                foreach ($arraypadres as $padre) {
                                    foreach ($actividadesrel as $acti) {
                                        if ($padre['idelementopadre']
                                            == $acti['idelemento']
                                        ) {
                                            $procede = 0;
                                        }
                                    }
                                }
                            }
                            if ($procede == 1) {
                                $leaf = true;
                                $arrayresp[$cont]['id']
                                    = $arraydatos->idelemento
                                    . $actividad['idelemento'];
                                $arrayresp[$cont]['text']
                                    = $actividad['denelemento'];
                                $arrayresp[$cont]['idelemento']
                                    = $actividad['idelemento'];
                                $arrayresp[$cont]['iconCls'] = 'actividades';
                                $arrayresp[$cont]['draggable'] = false;
                                $arrayresp[$cont]['idtipoelemento'] = 3;
                                $arraydatao->idarc = $arraydatos->idelemento;
                                $arraydatao->idplan = $arraydatos->idplan;
                                $arraydatao->idelemento
                                    = $actividad['idelemento'];
                                $arraydatao->idtipoelemento = 3;
                                $arrayhijos = $this->DezglozarElementos(
                                    $arraydatao
                                );
                                if (isset($arrayhijos[0])) {
                                    $leaf = false;
                                }
                                $arrayresp[$cont]['leaf'] = $leaf;
                                $arrayresp[$cont]['idarc']
                                    = $arraydatos->idelemento;
                                $arrayresp[$cont]['hijos'] = $arrayhijos;
                                $cont++;
                            }
                        }
                    }
                    break;
            }
            return $arrayresp;
        }
    }

    public function ObtenerDenominacionNomencladorElemento(
        $idelemento, $tiponom, $base
    ) {
        $dennomenclador = '';
        if ($base == 'E') {
            $nomenclador
                = DatElementosNomNomenclador::DameIdNomencladorDadoTipoNom(
                $idelemento, $tiponom
            );
            $idnomenclador = $nomenclador[0]['idnomenclador'];
        } else {
            $idnomenclador = Doctrine::getTable('DatCriteriomedida')->find(
                $idelemento
            )->idumedida;
            $nomenclador = 1;
        }
        if ($nomenclador) {
            $datosnomenclador
                = $this->pIntegrator->configuracionpdo->DameDatosNomenclador(
                $idnomenclador
            );
            $dennomenclador = $datosnomenclador->dennomenclador;
        }
        return $dennomenclador;
    }

    public function ResetCantObserv($idelemento, $cantobserv)
    {
        $datelemento = new DatElementos();
        $result = $datelemento->ResetCantObserv($idelemento, $cantobserv);
        return $result;
    }

    public function ActualizarRelaciones()
    {
        $arrayrelaciones = DatElementos:: ObtenerRelaciones();
        DatElementos:: EliminarRelaciones();
        /* $actualizado = */
        DatElementos:: ActualizarContadoresRelaciones();
        if (isset($arrayrelaciones[0])) {
            foreach ($arrayrelaciones as $relacion) {
                $origen = $relacion['origen'];
                if ($origen == 3) {
                    $idelementopadre = $relacion['idelementopadre'];
                    $idelementohijo = $relacion['idelementohijo'];
                    $objelementopadre = Doctrine::getTable('DatElementos')
                        ->find($idelementopadre);
                    $objelementohijo = Doctrine::getTable('DatElementos')->find(
                        $idelementohijo
                    );
                    if (($objelementopadre->idtipoelemento
                            == $objelementohijo->idtipoelemento)
                        AND ($objelementopadre->idusuariocrea
                            != $objelementohijo->idusuariocrea)
                    ) {
                        $origen = 2;
                    }
                    if (($objelementopadre->idtipoelemento
                            != $objelementohijo->idtipoelemento)
                        AND ($objelementopadre->idusuariocrea
                            == $objelementohijo->idusuariocrea)
                    ) {
                        $origen = 1;
                    }
                }
                $objrelacion = new DatElementosDatElementos();
                $objrelacion->idelementopadre = $relacion['idelementopadre'];
                $objrelacion->idelementohijo = $relacion['idelementohijo'];
                $objrelacion->origen = $origen;
                $objrelacion->idautor = $relacion['idautor'];
                $objrelacion->save();
            }
        }
        return 1;
    }

    public function actualizarCumplimiento($arrayparametros)
    {
        $valorCumplimiento = 100;
        if ($arrayparametros->metodo == 2) {
            $valorCumplimiento = $arrayparametros->cumplimiento;
        }
        if (isset($arrayparametros->arrayidelementos)) {
            $const = 0;
            foreach ($arrayparametros->arrayidelementos as $key => $idelemento)
            {
                $objElemento = Doctrine::getTable('DatElementos')->find(
                    $idelemento
                );
                if ($objElemento->actualizarporciento == 0) {//es manual
                    $arraydescendencia = array();
                    self::BuscarInferiores(
                        $idelemento, $arraydescendencia, '=', 0
                    );
                    if (isset($arraydescendencia[0])) {
                        foreach ($arraydescendencia as $descendencia) {
                            self::actualizarCumplimientoElemento(
                                $descendencia, $valorCumplimiento
                            );
                        }
                    }
                    self::actualizarCumplimientoElemento(
                        $idelemento, $valorCumplimiento
                    );
                    //actualizar a mi padre si es automatico
                    $autoManualPadre
                        = DatElementosDatElementos:: getAutoManualPadre(
                        $idelemento
                    );
                    $parametros->idactividad = $idelemento;
                    if ($autoManualPadre[0]['automanualpadre'] == 1) {
                        $respuesta->padreRaiz
                            = CmpgestionaractividadesModel::calcularGradoCumplimiento(
                            $parametros
                        );
                    }
                } else {
                    $const++;
                }
            }
            if ($const == 0) {
                $respuesta = 1;
            } elseif ($const < ($key + 1)) {
                $respuesta = 2; //varias selecciones
            } elseif ($const == ($key + 1)) {
                $respuesta = 3; //automatico
            }
            return $respuesta;
        }
    }

    public function actualizarCumplimientoFips($arrayparametros)
    {
      $valorCumplimiento = 100;
      if ($arrayparametros->metodo == 2) {
        $valorCumplimiento = $arrayparametros->cumplimiento;
      }
      if (isset($arrayparametros->arrayidelementos)) {
        foreach ($arrayparametros->arrayidelementos as $key => $idelemento)
        {
            self::actualizarCumplimientoElemento(
              $idelemento, $valorCumplimiento
            );
        }

        return 1;
      }
    }

    public function BuscarInferiores(
        $idelementopadre, &$resultado, $comparacion = '>=', $origen = 6
    ) {
        $existerelacion = Doctrine::getTable('DatElementosDatElementos')
            ->findByDql(
                "idelementopadre = '$idelementopadre' AND origen $comparacion $origen"
            );
        if ($existerelacion[0]->idelementohijo != null) {
            $resultado[] = self::BuscarInferiores(
                $existerelacion[0]->idelementohijo, $resultado, $comparacion,
                $origen
            );
        }
        return $idelementopadre;
    }

    public function actualizarCumplimientoElemento($idelemento, $valor)
    {
        $objelemento = Doctrine::getTable('DatElementos')->find($idelemento);
        if (isset($objelemento->idelemento)) {
            $objelemento->gradocumplimiento = $valor;
            $estadocumplimiento
                = CmpgestionarelementoModel::actualizarEstadoCumplimiento(
                $estadocumplimiento, $objelemento->gradocumplimiento
            );
            $objelemento->estadocumplimiento = $estadocumplimiento;
            $objelemento->save();
        }
    }

}
