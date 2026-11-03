<?php

/**
 * @author    Nestor Bernal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
//$address=dirname(dirname(__FILE__));
// $address=str_ireplace('o/plan/models','o/comun/recursos/',$address);
//require_once($address.'html2pdf.class.php');
//$mail = str_ireplace(
//    '/web', 'lib/Adapters/PHPMailer/5.2.15/class.phpmailer.php', $_SERVER["DOCUMENT_ROOT"]
//  );
/* $dirXMLConfigEmail = str_ireplace(
  '/web',
  '/apps/planificacion/comun/recursos/xml/configuracioncorreosispoe.xml',
  $_SERVER["DOCUMENT_ROOT"]
  ); */

//include_once($mail);

class CmpgestionaractividadesModel extends ZendExt_Model
{

    public function CmpgestionaractividadesModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para cargar las actividades
     */
    public function CargarActividades_old(
        $idactividad, $idusuario, $idelementotributa, $enaprobacion, $arrayautores, $arrayinvolucrados, $categact, $tipoact, $start, $limit, $idtipoelementotributa, $idtipoelementotributasuperior, $busqueda, $arrayelementosrelacionados, $filtros, $parametros, $idtipoelemento
    )
    {
        $filtroestados = 0;
        $utilizacionFT = 0;
        $arrayestados = array();
        if (isset($filtros[0])) {
            foreach ($filtros as $k => $filtro) {
                if ($filtro['field'] == 'nombreestadoaprob') {
                    $filtroestados = 1;
                    $utilizacionFT = 1;
                    $arrayestados[] = $filtro['data']['value'];
                }
            }
            $arrayestados = implode(',', $arrayestados);
        }
        if ($filtroestados == 0) {
            $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
                $idusuario, $idtipodoc = 3
            );
            if (isset($arrayestadosver[0])) {
                $utilizacionFT = 1;
                foreach ($arrayestadosver as $estado) {
                    $arrayestados[] = $estado['idestado'];
                }
            }
            $arrayestados = implode(',', $arrayestados);
        }
        if (($parametros->dependenciaTotal || $parametros->dependenciaPorcentual || $parametros->dependenciaPuertaAbierta) && $parametros->idelementoafiltrar
        ) {
            $parametros->arraypadres = array();
            $parametros->arrayhijos = array();
            self::BuscarSuperiores(
                $parametros->idelementoafiltrar, $parametros->arraypadres
            );
            self::BuscarInferiores(
                $parametros->idelementoafiltrar, $parametros->arrayhijos
            );
            $parametros->arraypadresehijos = array_merge(
                $parametros->arraypadres, $parametros->arrayhijos
            );
            $parametros->arraypadresehijos = implode(
                ',', $parametros->arraypadresehijos
            );
        }
        $arrayautoresact = array();
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
                if ($involucrado->tipo == 2) {
                    $datosestructura
                        = $this->integrator->metadatos->DameEstructura(
                        $involucrado->idinvolucrado
                    );
                    $id = $datosestructura[0]->idestructura;
                    // $arrayinvolact[] = $id . $cero;
                    $arrayinvolact[] = $id . $uno;
                }
            }
        }
        if (isset($arrayautores[0])) {
            foreach ($arrayautores as $autor) {
                $idautor = $autor->idautor;
                if ($autor->tipo == 0) {
                    $arrayusuarios
                        = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
                        $idautor
                    );
                    if (isset($arrayusuarios[0])) {
                        foreach ($arrayusuarios as $usuario) {
                            $arrayautoresact[]
                                = $idautor;
                        }
                    }
                } else {
                    $arrayautoresact[] = $idautor;
                }
            }
        }
        //aqui empiezo a definir las posibles cmbinaciones para obtener 
        //arreglo de inv y autores cuanod estos no vienen del client
        if (!isset($arrayautores[0]) && !isset($arrayinvolucrados[0])) {
            if ($enaprobacion == 0) {
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
            } else {
                $arrayautoresact[] = $idusuario;
                $permisosubordinados
                    = $this->pIntegrator->configuracionpdo->DamePermisoSubordinados(
                    $idusuario
                );
                if (isset($permisosubordinados[0])) {
                    foreach ($permisosubordinados as $subordinado) {
                        $arrayautoresact[] = $subordinado['idpsobre'];
                    }
                }
            }
        }
        $objdatelementos = new DatElementos();

        if (!isset($idtipoelemento)) {
            $arrayactividades = $objdatelementos->CargarActividades(
                $hijo = 0, $idactividad, $idusuario, $idelementotributa, $arrayautoresact, $arrayinvolact, $categact, $tipoact, $start, $limit, $idtipoelementotributa, $idtipoelementotributasuperior, $arrayestados, $busqueda, $arrayelementosrelacionados, $filtros, $parametros, $idtipoelemento
            );
        } else {
            $arrayactividades = $objdatelementos->cargarPuntualizacion(
                $hijo = 0, $idactividad, $idusuario, $idelementotributa, $arrayautoresact, $arrayinvolact, $categact, $tipoact, $start, $limit, $idtipoelementotributa, $idtipoelementotributasuperior, $arrayestados, $busqueda, $arrayelementosrelacionados, $filtros, $parametros, 3
            );
        }
        $arrayactividadess['total'] = $arrayactividades['total'];
        $arrayactividadess['resultado'] = array();
        if (isset($arrayactividades['resultado'])) {
            $cont = 0;
            foreach ($arrayactividades['resultado'] as $key => $actividad) {
                $parent = null;
                if ($idactividad) {
                    $parent = $idactividad;
                }
                $leaf = true;
                if ($actividad['cantrelacdescorigen0'] > 0 || $actividad['cantrelacdescorigen2'] > 0
                ) {
                    $tienehijos = $objdatelementos->CargarActividades(
                        $hijo = 1, $actividad['idelemento'], $idusuario, $idelementotributa, $arrayautoresact, $arrayinvolact, $categact, $tipoact, $start, $limit, $idtipoelementotributa, $idtipoelementotributasuperior, $arrayestados, $busqueda, $arrayelementosrelacionados, $filtros, $parametros
                    );
                    if ($tienehijos['total'] > 0) {
                        $leaf = false;
                    }
                }
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                if ($actividad['idautor'] != $idusuario) {
                    $superior = 1;
                    $permisomodificacion
                        = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                        $idusuario, $actividad['idautor']
                    );
                    if ($permisomodificacion) {
                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                    }
                    $subordinado
                        = $this->pIntegrator->configuracionpdo->existeSubordinacion(
                        $idusuario, $actividad['idautor']
                    );
                }
                //verifico si se esta trabajando con el Flujo de Trabajo
                if ($utilizacionFT) {
                    $arraypermisos = array();
                    $arraypermisos
                        = $this->pIntegrator->workflow->obtenerPermisosPostAccion(
                        $idusuario, $actividad['idestadoaprob'], $idtipoelemento = 3
                    );
                    $modificar = $arraypermisos['modificar'];
                    $eliminar = $arraypermisos['eliminar'];
                }
                $nombreestadoapro = '';
                if ($actividad['idestadoaprob'] != null) {
                    $arrayestadosaprob
                        = $this->pIntegrator->workflow->DenomEstado(
                        $actividad['idestadoaprob']
                    );
                    if (isset($arrayestadosaprob[0])) {
                        $nombreestadoapro = $arrayestadosaprob[0]->denominacion;
                    }
                    $arraycontrolestado
                        = $this->pIntegrator->workflow->GetControlDeEstado(
                        $actividad['idestadoaprob'], 3
                    );
                    //print_r($arraycontrolestado);die;
                    if (isset($arraycontrolestado[0])) {
                        $generacontrol = $arraycontrolestado[0]->generacontrol;
                    }
                }
                //Calcular la duracion de la actividad
                $duracion = self::dias_transcurridos(
                        $actividad['fechafin'], $actividad['fechainicio']
                    ) + 1;
                //Formar la respuesta
                $arrayactividades['resultado'][$key]['fechainicio']
                    = $actividad['fechainicio'];
                $arrayactividades['resultado'][$key]['fechafin']
                    = $actividad['fechafin'];
                $arrayactividades['resultado'][$key]['duracion'] = $duracion;
                $denominacion = str_ireplace(
                    '"', '%', $actividad['denominacion']
                );
                /* $arrayactividades['resultado'][$key]['nombreautor']
                  = $this->integrator->seguridad->nombreUsuario(
                  $actividad['idautor']
                  ); */
                $arrayactividades['resultado'][$key]['nombreautor']
                    = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                    $actividad['idautor'], 'usuario', null
                );
                $arrayactividades['resultado'][$key]['_is_leaf'] = $leaf;
                $arrayactividades['resultado'][$key]['horainicio']
                    = $actividad['horainicio'];
                $arrayactividades['resultado'][$key]['denominacion']
                    = $denominacion;
                $arrayactividades['resultado'][$key]['_parent'] = $parent;
                $arrayactividades['resultado'][$key]['superior'] = $superior;
                $arrayactividades['resultado'][$key]['subordinado']
                    = $subordinado;
                $arrayactividades['resultado'][$key]['modificar'] = $modificar;
                $arrayactividades['resultado'][$key]['eliminar'] = $eliminar;
                $arrayactividades['resultado'][$key]['tipoelemento'] = 3;
                $arrayactividades['resultado'][$key]['textocumplimiento']
                    = $actividad['estadocumplimiento'];
                $arrayactividades['resultado'][$key]['estadocumplimiento']
                    = $actividad['estadocumplimiento'] . "("
                    . $actividad['gradocumplimiento'] . "%)";
                $arrayactividades['resultado'][$key]['nombreestadoaprob']
                    = $nombreestadoapro;
                $arrayactividades['resultado'][$key]['generacontrol']
                    = $generacontrol;
                $arrayactividades['resultado'][$key]['observaciones']
                    = $actividad['observaciones'];
                $arrayactividades['resultado'][$key]['categoria']
                    = $actividad['categoria'];
                $arrayactividades['resultado'][$key]['tipoactividad']
                    = $actividad['tipoactividad'];
                $arrayactividades['resultado'][$key]['usuario_logueado']
                    = $this->global->Perfil->idusuario;
            }
        }
        return $arrayactividades;
    }

    public function EstadosVerReasignar($idusuario, $idtipodoc)
    {
      $cadena = " SELECT e.idestado ,
                e.denominacion
                FROM mod_flujotrabajo.dat_estado e 
                WHERE (e.idautor = '$idusuario') ";
      //print_r($cadena);die;
      $connA = Doctrine_Manager:: connection();
      $res = $connA->execute($cadena);
      $resultado = $res->fetchAll();
      return $resultado;
    }

    /**
     * Funcion para cargar las actividades OPTIMIZADO****
     */
    public function CargarActividades($parametros)
    {

//        $integrator = ZendExt_IoC::getInstance();
        //para poder consultar cuando se envia desde el servicio web
        $pintegrator = ZendExt_IoC_Inter::getInstance();

        //validacion
        $this->pIntegrator = ($parametros->servicioweb == 1) ? $pintegrator : $this->pIntegrator;

        //---***buscar estados para las acts del usuario logueado***---//
        $arrayestados = array();
        if (isset($parametros->filtros[0])) {
            foreach ($parametros->filtros as $k => $filtro) {
                if ($filtro['field'] == 'nombreestadoaprob') {
                    $filtroestados = 1;
                    $arrayestados[] = $filtro['data']['value'];
                }
            }
            $parametros->arrayestados = implode(',', $arrayestados);
        }
        if ($filtroestados == 0) {
            $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
                $parametros->idusuario, $idtipodoc = 3
            );
            if (isset($arrayestadosver[0])) {
                foreach ($arrayestadosver as $estado) {
                    $arrayestados[] = $estado['idestado'];
                }
            }
            $parametros->arrayestados = implode(',', $arrayestados);
        }

        //---***filtro de involucrados***---//
        $arrayautoresact = array();
        $cero = 0;
        $uno = 1;
        if (isset($parametros->arrayinvolucrados[0])) {
            foreach ($parametros->arrayinvolucrados as $involucrado) {
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
                if ($involucrado->tipo == 2) {
                    $datosestructura
                        = $this->integrator->metadatos->DameEstructura(
                        $involucrado->idinvolucrado
                    );
                    $id = $datosestructura[0]->idestructura;
                    // $arrayinvolact[] = $id . $cero;
                    $arrayinvolact[] = $id . $uno;
                }
            }
        }
        //---***filtro de autores***---//
        //print_r($arrayautoresact);die;
        if (isset($parametros->arrayautores[0])) {
          $arrayautoresact = array();
          $array_existe=array();
            foreach ($parametros->arrayautores as $autor) {
				if($autor->idautor != $parametros->idusuario){
				   self::subordinadosPorUsuario($autor->idautor, $arrayautoresact, $array_existe);	
				}
              if ($autor->tipo == 0) {
                $arrayusuarios
                  = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
                  $autor->idautor
                );
                if (isset($arrayusuarios[0])) {
                  foreach ($arrayusuarios as $usuario) {
                    $arrayautoresact[] = $usuario->idautor;
                  }
                }
              } else {
                $arrayautoresact[] = $autor->idautor;
              }
            }
        }
		
		//print_r($arrayautoresact);die;

        //***---Filtro de autores e involucrados---***//
        if (!isset($parametros->arrayautores[0]) && !isset($parametros->arrayinvolucrados[0])
        ) {
			$arrayautoresact = array();
            $array_existe=array();
            if ($parametros->enaprobacion == 0) {
                $arrayautoresact[] = $parametros->idusuario;
                $arrayinvolact[] = $parametros->idusuario . $cero;
                $arrayinvolact[] = $parametros->idusuario . $uno;
                if($parametros->busqueda == 0){
                  $arraygrupos
                    = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                    $parametros->idusuario
                  );
                  if (isset($arraygrupos[0])) {
                    foreach ($arraygrupos as $grupo) {
                      $arrayinvolact[] = $grupo['idgrupo'] . $cero;
                      $arrayinvolact[] = $grupo['idgrupo'] . $uno;
                    }
                  }
                }
            }
            else {
				self::subordinadosPorUsuario($parametros->idusuario, $arrayautoresact, $array_existe);
                /*$arrayautoresact[] = $parametros->idusuario;
                $permisosubordinados
                    = $this->pIntegrator->configuracionpdo->DamePermisoSubordinados(
                    $parametros->idusuario
                );
                if (isset($permisosubordinados[0])) {
                    foreach ($permisosubordinados as $subordinado) {
                        $arrayautoresact[] = $subordinado['idpsobre'];
                   }
                }*/
            }
        }
    
        $parametros->arrayautores = implode(',', $arrayautoresact);
        $parametros->arrayinvolucrados = implode(',', $arrayinvolact);
        //***---Reorganizar---***//
        if (isset($parametros->reorganizar[0])) {
            $parametros->reorganizar = implode(',', $parametros->reorganizar);
        }
        //***---Dependencias---***//
        if (($parametros->dependenciaTotal || $parametros->dependenciaPorcentual || $parametros->dependenciaPuertaAbierta) && $parametros->idelementoafiltrar
        ) {
            $parametros->arraypadres = array();
            $parametros->arrayhijos = array();
            self::buscarSuperioresGantt(
                $parametros->idelementoafiltrar, $parametros->arraypadres
            );
            self::buscarInferioresGantt(
                $parametros->idelementoafiltrar, $parametros->arrayhijos
            );
            $parametros->arraypadresehijos = array_merge(
                $parametros->arraypadres, $parametros->arrayhijos
            );
            $parametros->arraypadresehijos = implode(
                ',', $parametros->arraypadresehijos
            );
        }
        $objdatelementos = new DatElementos();
        $arrayactividades = $objdatelementos->CargarActividades($parametros);
        return $arrayactividades;
    }

    public function subordinadosPorUsuario($idusuario, & $arrayautoresact, & $array_existe){
      $arrayautoresact [] = $idusuario;

      $subordinados = array();
      if(array_search($idusuario, $array_existe) === false){
          $subordinados=self::obtenerSubordinados($idusuario);
          array_push($array_existe, $idusuario);
      }
      foreach ($subordinados as $subordinado) {
          self::subordinadosPorUsuario($subordinado['idusuario'], $arrayautoresact);
      }
      return $arrayautoresact;
    }

    public function obtenerSubordinados($idusuariosession) {
	  $subordinado = 1;
	  $cadena
            = " select u.idusuario
                from mod_objetivos.dat_permiso p
                     inner join mod_seguridad.seg_usuario u on (u.idusuario = p.idpsobre)
                     left join mod_persona.dat_persona pe on (pe.idpersona = u.idpersona)
                where p.idppara = $idusuariosession AND
                      p.subordinado = $subordinado ";
   
      //print_r($cadena);die;
      $connector = Doctrine_Manager:: connection();
      $resultado = $connector->execute($cadena)->fetchAll();
      //print_r($resultado);die;
      return $resultado;
    }

    public function buscarPadre($arrayelementopadre, $idactividad)
    {
        $parent = null;
        foreach ($arrayelementopadre as $key => $elemento) {
            if ($elemento['idelemento'] == $idactividad) {
                $parent = $elemento['_parent'];
                break;
            }
        }
        return $parent;
    }

    /**
     * Funcion para adicionar las actividades por servicio
     */
    public
    function crearActividadPorServicio($parametros)
    {
        // $conexion = Doctrine_Manager::getInstance()->getCurrentConnection();
        //  $conexion->beginTransaction();
        $integrator = ZendExt_IoC::getInstance();
        //$parametros->idpersona = $parametros->idusuariocrea; 
        $procede = 1;

        if ($parametros->eshija == 1) {
            $elementopadre = Doctrine::getTable('DatElementos')->find(
                $parametros->idactividadpadre
            );
            if (!isset($elementopadre->idelemento)) {
                $procede = 0;
            }
        }
        if ($procede == 1) {
            $objelemmodel = new CmpgestionarelementoModel();
            if (isset($parametros->retornar) && $parametros->retornar == 1) {
                $estadoaprobpordefcto = $parametros->idestadoaprob;
            } else {
                $estadoaprobpordefcto
                    = $objelemmodel->ObtenerEstadoAprobPorDefecto(
                    $parametros->idusuariocrea, $idtipodocumento = 3
                );
            }
            //validar si retorna null....
            $estadocumplimiento
                = $objelemmodel->actualizarEstadoCumplimiento(
                $estadocumplimiento, $parametros->gradocumplimiento
            );

            //se crea el objeto 'elemento' y se registra
            $objCmpgestionarelementomodel = new CmpgestionarelementoModel();
            $datelemento = $objCmpgestionarelementomodel->AdicionarElemento(
                $parametros->denelemento, $parametros->descelemento, $parametros->gradocumplimiento, $parametros->idtipoelemento, $activo = 1, $estadocumplimiento, $estadoaprobpordefcto, $parametros->idusuariocrea, $parametros->dirigentes, $parametros->participantes, $parametros->autoManual, $parametros->peso
            );

            if (isset($datelemento->idelemento)) {
                $parametros->idelemento = $datelemento->idelemento;
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
                $objelemelem->idelementopadre
                    = $parametros->idactividadpadre;
                $objelemelem->idelementohijo = $datelemento->idelemento;
                $objelemelem->origen = $origen;
                $objelemelem->idautor = $parametros->idusuariocrea;
                $objelemelem->porcientoinicio = $parametros->porcientoRe;
                $objelemelem->ponderacion
                    = ($parametros->porcientoRe) / 10;
                $objelemelem->save();
            }
            //se crea el objeto 'nomenclador-elemento' y se registra
            $objelemnom = new DatElementosNomNomencladorModel();
            if ($parametros->idcategoria) {
                $elemnomcateg = $objelemnom->AdicionarRelacionNomElem(
                    $datelemento, $parametros->idcategoria, $tiponomenclador = 2
                );
            }
            if ($parametros->idtipo) {
                $elemnomtipo = $objelemnom->AdicionarRelacionNomElem(
                    $datelemento, $parametros->idtipo, $tiponomenclador = 3
                );
            }
            //esto ta loco
            if ($parametros->idrecursoasociado) {
                foreach ($parametros->idrecursoasociado as $key => $recurso) {
                    $elemrecursoactividad
                        = $objelemnom->AdicionarRelacionNomElem(
                        $datelemento, $recurso, $tiponomenclador = 5
                    );
                }
            }

            //se crea el objeto 'actividad' y se registra
            $datactividad = new DatActividades();
            $datactividad->idactividad = $datelemento->idelemento;
            $datactividad->fechainicio = $parametros->fechainicio;
            $datactividad->fechafin = $parametros->fechafin;
            $datactividad->horainicio = $parametros->horainicio;
            $datactividad->horafin = $parametros->horafin;
            $datactividad->lugar = $parametros->lugar;
            $datactividad->esprincipal = $parametros->principal;
            $datactividad->tiempoestimado = ($parametros->tiempoestimado == '') ? 0 : $parametros->tiempoestimado;
            $datactividad->criterioevaluacion = $parametros->criterioeval;
            $datactividad->categoria = $parametros->denomcategoria;
            $datactividad->tipo = $parametros->denomtipo;
            $datactividad->duracion = $parametros->duracion;

            /***
                 Adicionado desde bienestar...
             **/
            if(property_exists ( $parametros ,  "numcaso" )){
              $datactividad->numcaso=$parametros->numcaso;
            }

            $datactividad->save();

            $parametros->idactividad = $datelemento->idelemento;
            //se relacionan los involucrados al elemento o actividad

            $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
                $parametros->arrayinvolucrados, $datelemento->idelemento, $parametros->idtipoelemento
            );
            //se relacionan los elementos relacionados
            if (isset($parametros->documentos[0])) {
                foreach ($parametros->documentos as $key => $iddocumento) {
                    $objAsociarDoc = new DatElementosDocumento();
                    $objAsociarDoc->idelemento = $datelemento->idelemento;
                    $objAsociarDoc->iddocumento = $iddocumento->id;
                    $objAsociarDoc->save();
                }
            }
            if (isset($parametros->arrayelementosrelacionados)) {
                $objCmpgestionarelementomodel->RelacionarElementosAElementos(
                    $datelemento->idelemento, $parametros->idtipoelemento, $parametros->arrayelementosrelacionados, $parentrelacidelemento = 'hijo', $parametros->idusuariocrea
                );
            }
            //procedo a crear las repeticiones de actividad
            if (isset($parametros->arrayrepeticiones[0])) {
                $this->AdicionarRepeticionesActividad(
                    $parametros->arrayelementosrelacionados, $datelemento, $datactividad, $parametros->arrayrepeticiones, $parametros->arrayinvolucrados, $parametros->idcategoria, $parametros->idtipo, $estadocumplimiento, $parametros->principal, $parametros->idusuariocrea
                );
            }
            if ($parametros->retornar == 1) {
                return $datactividad;
            }
            //Notificacion
            //***historial***
            $arrayinvolucrados = array();
            foreach ($parametros->arrayinvolucrados as $involucrado) {
                $arrayinvolucrados[] = $involucrado->idusuario;
            }
            $involucradoshisto = implode(',', $arrayinvolucrados);
            //***fin historial**
            $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
            $objcambiohorario = $objcmpgestionaractividadesmodel->CambioHorario(
                $parametros
            );
            $accion = 1;
            $idelemento = $parametros->idactividad;
            $idtipoelemento = 3;
            $idautor = $parametros->idusuariocrea;
            //$arrayinvol = $parametros->arrayinvolucrados;
            $fecha = date('d/m/Y H:i:s');
            $objNotificacion = new CmpnotificacionesModel();
            $objNotificacion->generarNotificacion(
                $accion, $idelemento, $idtipoelemento, $idautor, $fecha, $objcambiohorario, $parametros, $involucradoshisto
            );
            /* actualizo los valores de sus padres (grado de cumplimiento)
              en dependencia de todos sus hijos */
            /* if ($parametros->eshija == 1) {
              self::actualizarPorcientoPadre($datelemento->idelemento);
              } */
            /* actualizo los valores de los objetivos con los que est� relacionada
             * la actividad (% de cumplimiento) */
            $arrayobjvs = DatElementosDatElementos::obtenerElemenRelacionados(
                $datelemento->idelemento, 1
            );
            if (isset($arrayobjvs[0])) {
                self::actualizarObjvsRelacionados($arrayobjvs);
            }
            /* actualizo el % de cumplimiento de los planes con los
             * que est� relacionada la actividad */
            $arrayPlanesE = DatElementosDatElementos::obtenerElemenRelacionados(
                $datelemento->idelemento, 0
            );
            $arrayPlanesA = DatElementosDatElementos::obtenerPlanRelacionadoARC(
                $datelemento->idelemento
            );
            $arrayPlanes = array_merge($arrayPlanesE, $arrayPlanesA);

            if (isset($arrayPlanes[0])) {
                CmpgestionarplanModel::actualizarPorcientoPlan($arrayPlanes);
            }
            //Envio de notificacion por email
            $emailinvolucrados = array();
            $arrayInvolucrados = array();

            foreach ($parametros->arrayinvolucrados as $involucrado) {
                $arrayInvolucrados[] = $involucrado->idusuario;
            }

            if (isset($arrayInvolucrados[0])) {
                $idpersonas
                    = $integrator->seguridad->getArrayIdPersonaByArrayUsers(
                    $arrayInvolucrados
                );
                if (isset($idpersonas[0])) {
                    foreach ($idpersonas as $persona) {
                        $datoscontacto
                            = $integrator->pvd->obtenerDatosdePersonaparaJabber(
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

        }


        Doctrine_Manager::getInstance()->getCurrentConnection()->commit();

        if ($procede == 1) {
            $parametros->emails = array();
            $parametros->emails = array_merge(
                $parametros->emails, $emailinvolucrados
            );
            $parametros->asunto = 'Nueva Actividad';
//            if (count($parametros->emails) > 0){
//              try{
//                self::enviarCorreoAPK($parametros);
//              }catch (Exception $e){
//
//              }
//
//            }

        }

        if(property_exists ( $parametros ,  "numcaso" )){
            return $datactividad;
        }

        return $procede;
    }

    /**
     * Funcion para adicionar las actividades
     */
    public function AdicionarActividad_original($parametros)
    {
        $procede = 1;
        if ($parametros->eshija == 1) {
            $elementopadre = Doctrine::getTable('DatElementos')->find(
                $parametros->idactividadpadre
            );
            if (!isset($elementopadre->idelemento)) {
                $procede = 0;
            }
        }
        if ($procede == 1) {
            $objelemmodel = new CmpgestionarelementoModel();
            if (isset($parametros->retornar) && $parametros->retornar == 1) {
                $estadoaprobpordefcto = $parametros->idestadoaprob;
            } else {
                $estadoaprobpordefcto
                    = $objelemmodel->ObtenerEstadoAprobPorDefecto(
                    $parametros->idusuariocrea, $idtipodocumento = 3
                );
            }
            //validar si retorna null....
            $estadocumplimiento
                = $objelemmodel->actualizarEstadoCumplimiento(
                $estadocumplimiento, $parametros->gradocumplimiento
            );

            //se crea el objeto 'elemento' y se registra
            $objCmpgestionarelementomodel = new CmpgestionarelementoModel();
            $datelemento = $objCmpgestionarelementomodel->AdicionarElemento(
                $parametros->denelemento, $parametros->descelemento, $parametros->gradocumplimiento, $parametros->idtipoelemento, $activo = 1, $estadocumplimiento, $estadoaprobpordefcto, $parametros->idusuariocrea, $parametros->dirigentes, $parametros->participantes, $parametros->autoManual, $parametros->peso
            );

            if (isset($datelemento->idelemento)) {
                $parametros->idelemento = $datelemento->idelemento;
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
                $objelemelem->idelementopadre
                    = $parametros->idactividadpadre;
                $objelemelem->idelementohijo = $datelemento->idelemento;
                $objelemelem->origen = $origen;
                $objelemelem->idautor = $parametros->idusuariocrea;
                $objelemelem->porcientoinicio = $parametros->porcientoRe;
                $objelemelem->ponderacion
                    = ($parametros->porcientoRe) / 10;
                $objelemelem->save();
            }
            //se crea el objeto 'nomenclador-elemento' y se registra
            $objelemnom = new DatElementosNomNomencladorModel();
            if ($parametros->idcategoria) {
                $elemnomcateg = $objelemnom->AdicionarRelacionNomElem(
                    $datelemento, $parametros->idcategoria, $tiponomenclador = 2
                );
            }
            if ($parametros->idtipo) {
                $elemnomtipo = $objelemnom->AdicionarRelacionNomElem(
                    $datelemento, $parametros->idtipo, $tiponomenclador = 3
                );
            }
            //esto ta loco
            if ($parametros->idrecursoasociado) {
                foreach ($parametros->idrecursoasociado as $key => $recurso) {
                    $elemrecursoactividad
                        = $objelemnom->AdicionarRelacionNomElem(
                        $datelemento, $recurso, $tiponomenclador = 5
                    );
                }
            }

            //se crea el objeto 'actividad' y se registra
            $datactividad = new DatActividades();
            $datactividad->idactividad = $datelemento->idelemento;
            $datactividad->fechainicio = $parametros->fechainicio;
            $datactividad->fechafin = $parametros->fechafin;
            $datactividad->horainicio = $parametros->horainicio;
            $datactividad->horafin = $parametros->horafin;
            $datactividad->lugar = $parametros->lugar;
            $datactividad->esprincipal = $parametros->principal;
            $datactividad->tiempoestimado = ($parametros->tiempoestimado == '') ? 0 : $parametros->tiempoestimado;
            $datactividad->criterioevaluacion = $parametros->criterioeval;
            $datactividad->categoria = $parametros->denomcategoria;
            $datactividad->tipo = $parametros->denomtipo;
            $datactividad->duracion = $parametros->duracion;
            $datactividad->save();
            $parametros->idactividad = $datelemento->idelemento;
            //se relacionan los involucrados al elemento o actividad
            $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
                $parametros->arrayinvolucrados, $datelemento->idelemento, $parametros->idtipoelemento
            );
            //se relacionan los elementos relacionados
            if (isset($parametros->documentos[0])) {
                foreach ($parametros->documentos as $key => $iddocumento) {
                    $objAsociarDoc = new DatElementosDocumento();
                    $objAsociarDoc->idelemento = $datelemento->idelemento;
                    $objAsociarDoc->iddocumento = $iddocumento->id;
                    $objAsociarDoc->save();
                }
            }
            if (isset($parametros->arrayelementosrelacionados)) {
                $objCmpgestionarelementomodel->RelacionarElementosAElementos(
                    $datelemento->idelemento, $parametros->idtipoelemento, $parametros->arrayelementosrelacionados, $parentrelacidelemento = 'hijo', $parametros->idusuariocrea
                );
            }
            //procedo a crear las repeticiones de actividad
            if (isset($parametros->arrayrepeticiones[0])) {
                $this->AdicionarRepeticionesActividad(
                    $parametros->arrayelementosrelacionados, $datelemento, $datactividad, $parametros->arrayrepeticiones, $parametros->arrayinvolucrados, $parametros->idcategoria, $parametros->idtipo, $estadocumplimiento, $parametros->principal, $parametros->idusuariocrea
                );
            }
            if ($parametros->retornar == 1) {
                return $datactividad;
            }
            //Notificacion
            //***historial***
            $arrayinvolucrados = array();
            foreach ($parametros->arrayinvolucrados as $involucrado) {
                $arrayinvolucrados[] = $involucrado->idusuario;
            }
            $involucradoshisto = implode(',', $arrayinvolucrados);
            //***fin historial**
            $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
            $objcambiohorario = $objcmpgestionaractividadesmodel->CambioHorario(
                $parametros
            );
            $accion = 1;
            $idelemento = $parametros->idactividad;
            $idtipoelemento = 3;
            $idautor = $parametros->idusuariocrea;
            //$arrayinvol = $parametros->arrayinvolucrados;
            $fecha = date('d/m/Y H:i:s');
            $objNotificacion = new CmpnotificacionesModel();
            $objNotificacion->generarNotificacion(
                $accion, $idelemento, $idtipoelemento, $idautor, $fecha, $objcambiohorario, $parametros, $involucradoshisto
            );
            /* actualizo los valores de sus padres (grado de cumplimiento)
              en dependencia de todos sus hijos */
            /* if ($parametros->eshija == 1) {
              self::actualizarPorcientoPadre($datelemento->idelemento);
              } */
            /* actualizo los valores de los objetivos con los que est� relacionada
             * la actividad (% de cumplimiento) */
            $arrayobjvs = DatElementosDatElementos::obtenerElemenRelacionados(
                $datelemento->idelemento, 1
            );
            if (isset($arrayobjvs[0])) {
                self::actualizarObjvsRelacionados($arrayobjvs);
            }
            /* actualizo el % de cumplimiento de los planes con los
             * que est� relacionada la actividad */
            $arrayPlanesE = DatElementosDatElementos::obtenerElemenRelacionados(
                $datelemento->idelemento, 0
            );
            $arrayPlanesA = DatElementosDatElementos::obtenerPlanRelacionadoARC(
                $datelemento->idelemento
            );
            $arrayPlanes = array_merge($arrayPlanesE, $arrayPlanesA);

            if (isset($arrayPlanes[0])) {
                CmpgestionarplanModel::actualizarPorcientoPlan($arrayPlanes);
            }
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
            $parametros->asunto = 'Nueva Actividad';
            if (count($parametros->emails) > 0)
                self::enviarCorreo($parametros);

        }
        return $procede;
    }

  /**
   * Funcion para adicionar las actividades
   */
  public function AdicionarActividad($parametros)
  {
    $procede = 1;
    if ($parametros->eshija == 1) {
      $elementopadre = Doctrine::getTable('DatElementos')->find(
        $parametros->idactividadpadre
      );
      if (!isset($elementopadre->idelemento)) {
        $procede = 0;
      }
    }
    if ($procede == 1) {
      $objelemmodel = new CmpgestionarelementoModel();
      if (isset($parametros->retornar) && $parametros->retornar == 1) {
        $estadoaprobpordefcto = $parametros->idestadoaprob;
      } else {
        $estadoaprobpordefcto
          = $objelemmodel->ObtenerEstadoAprobPorDefecto(
          $parametros->idusuariocrea, $idtipodocumento = 3
        );
      }
      //validar si retorna null....
      $estadocumplimiento
        = $objelemmodel->actualizarEstadoCumplimiento(
        $estadocumplimiento, $parametros->gradocumplimiento
      );

      //se crea el objeto 'elemento' y se registra
      $objCmpgestionarelementomodel = new CmpgestionarelementoModel();
      $datelemento = $objCmpgestionarelementomodel->AdicionarElemento(
        $parametros->denelemento, $parametros->descelemento, $parametros->gradocumplimiento, $parametros->idtipoelemento, $activo = 1, $estadocumplimiento, $estadoaprobpordefcto, $parametros->idusuariocrea, $parametros->dirigentes, $parametros->participantes, $parametros->autoManual, $parametros->peso
      );

      if (isset($datelemento->idelemento)) {
        $parametros->idelemento = $datelemento->idelemento;
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
        $objelemelem->idelementopadre
                     = $parametros->idactividadpadre;
        $objelemelem->idelementohijo = $datelemento->idelemento;
        $objelemelem->origen = $origen;
        $objelemelem->idautor = $parametros->idusuariocrea;
        $objelemelem->porcientoinicio = $parametros->porcientoRe;
        $objelemelem->ponderacion
          = ($parametros->porcientoRe) / 10;
        $objelemelem->save();
      }
      //se crea el objeto 'nomenclador-elemento' y se registra
      $objelemnom = new DatElementosNomNomencladorModel();
      if ($parametros->idcategoria) {
        $elemnomcateg = $objelemnom->AdicionarRelacionNomElem(
          $datelemento, $parametros->idcategoria, $tiponomenclador = 2
        );
      }
      if ($parametros->idtipo) {
        $elemnomtipo = $objelemnom->AdicionarRelacionNomElem(
          $datelemento, $parametros->idtipo, $tiponomenclador = 3
        );
      }
      //esto ta loco
      if ($parametros->idrecursoasociado) {
        foreach ($parametros->idrecursoasociado as $key => $recurso) {
          $elemrecursoactividad
            = $objelemnom->AdicionarRelacionNomElem(
            $datelemento, $recurso, $tiponomenclador = 5
          );
        }
      }

      //se crea el objeto 'actividad' y se registra
      $datactividad = new DatActividades();
      $datactividad->idactividad = $datelemento->idelemento;
      $datactividad->fechainicio = $parametros->fechainicio;
      $datactividad->fechafin = $parametros->fechafin;
      $datactividad->horainicio = $parametros->horainicio;
      $datactividad->horafin = $parametros->horafin;
      $datactividad->lugar = $parametros->lugar;
      $datactividad->esprincipal = $parametros->principal;
      $datactividad->tiempoestimado = ($parametros->tiempoestimado == '') ? 0 : $parametros->tiempoestimado;
      $datactividad->criterioevaluacion = $parametros->criterioeval;
      $datactividad->categoria = $parametros->denomcategoria;
      $datactividad->tipo = $parametros->denomtipo;
      $datactividad->duracion = $parametros->duracion;
      $datactividad->save();
      $parametros->idactividad = $datelemento->idelemento;
      //se relacionan los involucrados al elemento o actividad
      $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
        $parametros->arrayinvolucrados, $datelemento->idelemento, $parametros->idtipoelemento
      );
      //se relacionan los elementos relacionados
      if (isset($parametros->documentos[0])) {
        foreach ($parametros->documentos as $key => $iddocumento) {
          $objAsociarDoc = new DatElementosDocumento();
          $objAsociarDoc->idelemento = $datelemento->idelemento;
          $objAsociarDoc->iddocumento = $iddocumento->id;
          $objAsociarDoc->save();
        }
      }
      if (isset($parametros->arrayelementosrelacionados)) {
        $objCmpgestionarelementomodel->RelacionarElementosAElementos(
          $datelemento->idelemento, $parametros->idtipoelemento, $parametros->arrayelementosrelacionados, $parentrelacidelemento = 'hijo', $parametros->idusuariocrea
        );
      }
      //procedo a crear las repeticiones de actividad
      if (isset($parametros->arrayrepeticiones[0])) {
        $this->AdicionarRepeticionesActividad(
          $parametros->arrayelementosrelacionados, $datelemento, $datactividad, $parametros->arrayrepeticiones, $parametros->arrayinvolucrados, $parametros->idcategoria, $parametros->idtipo, $estadocumplimiento, $parametros->principal, $parametros->idusuariocrea
        );
      }
      if ($parametros->retornar == 1) {
        return $datactividad;
      }
      //Notificacion
      //***historial***
      $arrayinvolucrados = array();
      foreach ($parametros->arrayinvolucrados as $involucrado) {
        $arrayinvolucrados[] = $involucrado->idusuario;
      }
      $involucradoshisto = implode(',', $arrayinvolucrados);
      //***fin historial**
      $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
      $objcambiohorario = $objcmpgestionaractividadesmodel->CambioHorario(
        $parametros
      );
      $accion = 1;
      $idelemento = $parametros->idactividad;
      $idtipoelemento = 3;
      $idautor = $parametros->idusuariocrea;
      //$arrayinvol = $parametros->arrayinvolucrados;
      $fecha = date('d/m/Y H:i:s');
      $objNotificacion = new CmpnotificacionesModel();
      $objNotificacion->generarNotificacion(
        $accion, $idelemento, $idtipoelemento, $idautor, $fecha, $objcambiohorario, $parametros, $involucradoshisto
      );
      /* actualizo los valores de sus padres (grado de cumplimiento)
        en dependencia de todos sus hijos */
      /* if ($parametros->eshija == 1) {
        self::actualizarPorcientoPadre($datelemento->idelemento);
        } */
      /* actualizo los valores de los objetivos con los que est� relacionada
       * la actividad (% de cumplimiento) */
      $arrayobjvs = DatElementosDatElementos::obtenerElemenRelacionados(
        $datelemento->idelemento, 1
      );
      if (isset($arrayobjvs[0])) {
        self::actualizarObjvsRelacionados($arrayobjvs);
      }
      /* actualizo el % de cumplimiento de los planes con los
       * que est� relacionada la actividad */
      $arrayPlanesE = DatElementosDatElementos::obtenerElemenRelacionados(
        $datelemento->idelemento, 0
      );
      $arrayPlanesA = DatElementosDatElementos::obtenerPlanRelacionadoARC(
        $datelemento->idelemento
      );
      $arrayPlanes = array_merge($arrayPlanesE, $arrayPlanesA);

      if (isset($arrayPlanes[0])) {
        CmpgestionarplanModel::actualizarPorcientoPlan($arrayPlanes);
      }
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
      $parametros->asunto = 'Nueva Actividad';
//      if (count($parametros->emails) > 0)
//          self::enviarCorreo($parametros);

    }
    $record=DatElementos::getRecordListarActividades($parametros->idusuariocrea, $datelemento->idelemento);
    $respuesta->mensaje=$procede;
    $respuesta->actividad=$record;
    $respuesta->parametros=$parametros;
    return $respuesta;
  }



    /**
     * Funcion para actualizar los Objetivos Relacionados a actividades
     */
    public
    function actualizarObjvsRelacionados($arrayobjvs)
    {
        foreach ($arrayobjvs as $objv) {
            $suma = 0;
            $cant = 0;
            $objElemento = Doctrine::getTable('DatElementos')->find($objv);

            $objElemElem = new DatElementosDatElementos();
            //obtengo todas las actividades relacionadas al objetivo
            $arrayactividades = $objElemElem->ObtenerActsRelacionadas($objv);

            //Sumo los gradocumplimiento de todas las acts hijas
            if (isset($arrayactividades[0])) {
                foreach ($arrayactividades as $acts) {
                    $objActividad = Doctrine::getTable('DatElementos')->find(
                        $acts
                    );
                    $suma += $objActividad->gradocumplimiento;
                    $cant++;
                }
            }
            /* Si el objetivo es padre obtengo sus objs hijos */
            $objvosHijos = $objElemElem->obtenerHijosInmediatos($objv);
            //Sumo los gradocumplimiento de todos sus objs hijos
            if (isset($objvosHijos[0])) {
                foreach ($objvosHijos as $objvoHijo) {
                    $objObjvoHijo = Doctrine::getTable('DatElementos')
                        ->find($objvoHijo);
                    $suma += $objObjvoHijo->gradocumplimiento;
                    $cant++;
                }
            }

            //calcular el % de cumplimiento del objvo
            if (($suma / $cant) != 0) {
                $objElemento->gradocumplimiento = $suma / $cant;
            } else {
                $objElemento->gradocumplimiento = 0;
            }

            //Actualizar el estatus de cumplimiento del objvo
            $objelemmodel = new CmpgestionarelementoModel();
            $estadocumplimiento
                = $objelemmodel->actualizarEstadoCumplimiento(
                $estadocumplimiento, $objElemento->gradocumplimiento
            );
            $objElemento->estadocumplimiento = $estadocumplimiento;
            $objElemento->save();


            /* Luego de actualizar los objetivos relacionados a la actividad
             * se deben actualizar tambien los padres de esos objetivos */
            CmpgestionarobjetivosModel::actualizarObjvosPadres($objv);
        }
    }

    /**
     * Funcion para Actualizar mi porcentaje de cumplimiento
     */
    public
    function actualizarMiPorciento($idElemento)
    {
        $suma = 0;
        $cant = 0;
        $objElemElem = new DatElementosDatElementos();
        $Acthijos = $objElemElem->obtenerHijosInmediatos($idElemento);
        if (isset($Acthijos[0])) {
            foreach ($Acthijos as $actividadhija) {
                $objactividadhija = Doctrine::getTable('DatElementos')->find(
                    $actividadhija
                );
                $suma += $objactividadhija->gradocumplimiento;
                $cant++;
            }
            //el grado de cumplimiento del padre
            $objelementopadre = Doctrine::getTable('DatElementos')->find(
                $idElemento
            );
            $objelementopadre->gradocumplimiento = $suma / $cant;
            //Actualizar el estatus de cumplimiento del padre
            $objelemmodel = new CmpgestionarelementoModel();
            $estadocumplimiento = $objelemmodel->actualizarEstadoCumplimiento(
                $estadocumplimiento, $objelementopadre->gradocumplimiento
            );
            $objelementopadre->estadocumplimiento = $estadocumplimiento;
            $objelementopadre->save();
            //actualizo a mis padres
            self::actualizarPorcientoPadre($idElemento);
        }
    }

    /**
     * Funcion para Actualizar el porcentaje de cumplimiento del padre
     */
    public
    function actualizarPorcientoPadre($idElemento)
    {
        $Actpadres = array();
        self::BuscarSuperiores($idElemento, $Actpadres, '=', 0);
        //por cada padre actualizo sus valores
        for ($i = count($Actpadres) - 1; $i >= 0; $i--) {
            $suma = 0;
            $cant = 0;
            $objElemElem = new DatElementosDatElementos();
            $Acthijos = $objElemElem->obtenerHijosInmediatos(
                $Actpadres[$i]
            );
            foreach ($Acthijos as $actividadhija) {
                $objactividadhija = Doctrine::getTable('DatElementos')->find(
                    $actividadhija
                );
                $suma += $objactividadhija->gradocumplimiento;
                $cant++;
            }
            //el grado de cumplimiento del padre
            $objelementopadre = Doctrine::getTable('DatElementos')->find(
                $Actpadres[$i]
            );
            $objelementopadre->gradocumplimiento = $suma / $cant;
            //Actualizar el estatus de cumplimiento del padre
            $objelemmodel = new CmpgestionarelementoModel();
            $estadocumplimiento
                = $objelemmodel->actualizarEstadoCumplimiento(
                $estadocumplimiento, $objelementopadre->gradocumplimiento
            );
            $objelementopadre->estadocumplimiento = $estadocumplimiento;
            $objelementopadre->save();
        }
    }

    /**
     * Funcion para Buscar el id del recurso en NomNomenclador dado el id de la actividad
     */
    public
    function BuscarRecursoActividad($idelemento)
    {
        $cont = 0;
        $retorno = array();
        $objelemnom = new DatElementosNomNomencladorModel();
        $elemrecursoactividad = $objelemnom->existeActividadSegunId(
            $idelemento
        );
        foreach ($elemrecursoactividad as $nomenclador) {
            $retorno[$cont] = $nomenclador['idnomenclador'];
            $cont++;
        }
        return $retorno;
    }
    /**
     * Funcion para determinar si hubo cambio de fecha u horario (Ariadna RA)
     */
    public
    function CambioHorario($parametros)
    {
        //print_r($parametros);die;
        $objhorario = new stdClass();
        if (isset($parametros->fechainicio) || isset($parametros->fechafin) || isset($parametros->horainicio) || isset($parametros->horafin)
        ) {
            $objhorario = new stdClass();
            $objactividad = Doctrine::getTable('DatActividades')->find(
                $parametros->idactividad
            );
            $fini = self::ConvertirFecha($objactividad->fechainicio, '-');
            $ffin = self::ConvertirFecha($objactividad->fechafin, '-');
            if (isset($parametros->fechainicio) && $fini != $parametros->fechainicio
            ) {
                $objhorario->fechainicioanterior = $fini;
                $objhorario->fechainicio = $parametros->fechainicio;
            }
            if (isset($parametros->fechafin) && $ffin != $parametros->fechafin
            ) {
                $objhorario->fechafinanterior = $ffin;
                $objhorario->fechafin = $parametros->fechafin;
            }
            if (isset($parametros->horainicio) && $objactividad->horainicio != $parametros->horainicio
            ) {
                $objhorario->horainicioanterior = $objactividad->horainicio;
                $objhorario->horainicio = $parametros->horainicio;
            } else {
                $objhorario->horainicio = $parametros->horainicio;
            }
            if (isset($parametros->horafin) && $objactividad->horafin != $parametros->horafin
            ) {
                $objhorario->horafinanterior = $objactividad->horafin;
                $objhorario->horafin = $parametros->horafin;
            } else {
                $objhorario->horafin = $parametros->horafin;
            }
        }
        return $objhorario;
    }

    /**
     * Funcion para modificar la actividad
     */
    public
    function ModificarActividad_original($parametros)
    {
        $objelemento = Doctrine::getTable('DatElementos')->find(
            $parametros->idactividad
        );
        if (isset($objelemento->idelemento)) {
            $idusuariosession = $this->global->Perfil->idusuario;
            $idautoractividad = $objelemento->idusuariocrea;

            $gantt = 0;
            $objelemmodel = new CmpgestionarelementoModel();
            $objelementoo = $objelemmodel->ModificarElemento(
                $objelemento->idelemento, $parametros->denelemento, $parametros->descelemento, $parametros->gradocumplimiento, $parametros->dirigentes, $parametros->participantes, $parametros->autoManual, $parametros->peso
            );
            if (isset($parametros->fechainicio) || isset($parametros->fechafin) || isset($parametros->horainicio) || isset($parametros->horafin) || isset($parametros->lugar) || isset($parametros->esprincipal)
            ) {
                $objactividad = Doctrine::getTable('DatActividades')->find(
                    $parametros->idactividad
                );
                $paramsGantt->efecto = $parametros->efectocadena;
                $paramsGantt->ffinact = $parametros->fechafin;
                $paramsGantt->finiact = $parametros->fechainicio;
                $paramsGantt->idactividad = $parametros->idactividad;
                $paramsGantt->idusuariocrea = $parametros->idusuariocrea;
                $gantt = self::modificarFechaGantt($paramsGantt);
                if (isset($parametros->horainicio)) {
                    $objactividad->horainicio = $parametros->horainicio;
                }
                if (isset($parametros->horafin)) {
                    $objactividad->horafin = $parametros->horafin;
                }
                if (isset($parametros->lugar)) {
                    $objactividad->lugar = $parametros->lugar;
                }
                if (isset($parametros->tiempoestimado)) {
                    $objactividad->tiempoestimado
                        = ($parametros->tiempoestimado == '') ? 0 : $parametros->tiempoestimado;
                }
                if (isset($parametros->criterioevaluacion)) {
                    $objactividad->criterioevaluacion
                        = $parametros->criterioevaluacion;
                }
                if (isset($parametros->denomtipo)) {
                    $objactividad->tipo = $parametros->denomtipo;
                }
                if (isset($parametros->denomcategoria)) {
                    $objactividad->categoria = $parametros->denomcategoria;
                }
                if (isset($parametros->duracion)) {
                    $objactividad->duracion = ($parametros->duracion == '') ? 0 : $parametros->duracion;
                }
                if ($parametros->principal == 1) {
                    $princp = 1;
                } else {
                    $princp = 0;
                }
                $objactividad->esprincipal = $princp;
                $objactividad->save();
            }
            if ($parametros->eshija == 1) {
                $elementohijo = Doctrine::getTable(
                    'DatElementosDatElementos'
                )->findByDql(
                    "idelementohijo = '$parametros->idactividad'"
                );
                if ($elementohijo[0] != null) {
                    $elementohijo[0]->porcientoinicio
                        = $parametros->porcientoRe;
                    $elementohijo[0]->ponderacion
                        = ($parametros->porcientoRe) / 10;
                    $elementohijo[0]->save();
                }
                if ($parametros->autoManualPadre == 1) {
                    $respuesta->padreRaiz
                        = self::calcularGradoCumplimiento(
                        $parametros
                    );
                    $elementosrelacionados
                        = DatElementosDatElementos:: buscarElementosRelacionados(
                        $parametros
                    );
                    if (isset($elementosrelacionados[0])) {
                        self::actualizarGradoCumpObj(
                            $elementosrelacionados
                        );
                    }
                } else {
                    $elementosrelacionados
                        = DatElementosDatElementos:: buscarElementosRelacionados(
                        $parametros
                    );
                    if (isset($elementosrelacionados[0])) {
                        self::actualizarGradoCumpObj(
                            $elementosrelacionados
                        );
                    }
                }
            } else {
                $elementosrelacionados
                    = DatElementosDatElementos:: buscarElementosRelacionados(
                    $parametros
                );
                if (isset($elementosrelacionados[0])) {
                    self::actualizarGradoCumpObj($elementosrelacionados);
                }
            }
            $objcmprelacionesmodel = new CmprelacionesModel();
            if (isset($parametros->arrayelementosrelacionados[0])) {
                foreach (
                    $parametros->arrayelementosrelacionados as $key => $relacion
                ) {
                    if ($relacion->origen == 7) {
                        $existerelacion = Doctrine::getTable(
                            'DatElementosDatElementos'
                        )->findByDql(
                            "idelementopadre = '$parametros->idactividad'
                                    AND idelementohijo = '$relacion->idactividad'"
                        );
                        $existerelacionb = Doctrine::getTable(
                            'DatElementosDatElementos'
                        )->findByDql(
                            "idelementopadre = '$relacion->idactividad'
                                    AND idelementohijo = '$parametros->idactividad'"
                        );
                        if ($existerelacion[0]->idelementopadre != null) {
                            $existerelacion[0]->porcientoinicio
                                = $relacion->porcientoinicio;
                            $existerelacion[0]->save();
                        }
                        if ($existerelacionb[0]->idelementopadre != null) {
                            $existerelacionb[0]->porcientoinicio
                                = $relacion->porcientoinicio;
                            $existerelacionb[0]->save();
                        }
                    }
                }
            }
            $objCmpgestionarelementomodel = new CmpgestionarelementoModel();
            //se relacionan los involucrados al elemento o actividad
            $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
                $parametros->arrayinvolucrados, $parametros->idactividad, $parametros->idtipoelemento
            );
            //se eliminan los involucrados al elemento o actividad
            $objCmpgestionarelementomodel->EliminarUsuariosAElementos(
                $parametros->arrayinvolucradoseliminar, $parametros->idactividad, $parametros->idtipoelemento
            );
            //obtengo relacion con nomencladores y modifico
            $objelemnom = new DatElementosNomNomencladorModel();
            if ($parametros->idcategoria) {
                $elemnomcateg = $objelemnom->ModificarRelacionNomElem(
                    $objelementoo, $parametros->idcategoria, $tiponomenclador = 2
                );
            }
            if ($parametros->idtipo) {
                $elemnomtipo = $objelemnom->ModificarRelacionNomElem(
                    $objelementoo, $parametros->idtipo, $tiponomenclador = 3
                );
            }
            /* Cosas de Julio */
            // EliminarElemNom($idelemento)
            //obtengo todas las repticiones
            if ($parametros->idrecursoasociado) {
                $objelemnom->EliminarElemNom($parametros->idactividad);
                foreach ($parametros->idrecursoasociado as $key => $recurso) {
                    $elemrecursoactividad
                        = $objelemnom->AdicionarRelacionNomElem(
                        $parametros->idactividad, $recurso, $tiponomenclador = 5
                    );
                }
            } else {
                if ($objelemnom->existeActividadSegunId(
                    $parametros->idactividad
                )
                ) {
                    $objelemnom->EliminarElemNom($parametros->idactividad);
                }
            }
            $arrayestadosverdoc
                = $this->pIntegrator->workflow->EstadosVerDoc(
                $idsubsistema = 15, $parametros->idusuariocrea, $idtipodoc = 3
            );
            $arrayestados = array();
            if (isset($arrayestadosverdoc['data'][0])) {
                foreach ($arrayestadosverdoc['data'] as $key => $estado) {
                    $arrayestados[]['idestado'] = $estado['idestado'];
                }
            }
            $arrayrepeticiones = DatElementos::ObtenerRepeticiones(
                $parametros->idactividad, $arrayestados
            );
            if (isset($arrayrepeticiones[0])) {
                //obtengo relaciones de la actividad inicial para actualizar repeticiones
                $idusuariosession = $this->global->Perfil->idusuario;
                $objcmprelacionesmodel = new CmprelacionesModel();
                $arrayrelaciones
                    = $objcmprelacionesmodel->CargarRelacionesSuperiores(
                    $tipoelemento = 3, $parametros->idactividad, $idusuariosession
                );
                foreach ($arrayrepeticiones as $key => $repeticion) {
                    $objelementorep = Doctrine::getTable('DatElementos')
                        ->find(
                            $repeticion['idelemento']
                        );
                    if (isset($objelementorep->idelemento)) {
                        $objelementorep->denelemento
                            = $parametros->denelemento;
                        if (isset($parametros->descelemento)) {
                            $objelementorep->descelemento
                                = $parametros->descelemento;
                        }
                        if (isset($parametros->dirigentes)) {
                            $objelementorep->dirigente
                                = $parametros->dirigentes;
                        }
                        if (isset($parametros->participantes)) {
                            $objelementorep->participante
                                = $parametros->participantes;
                        }
                        $objelementorep->save();
                        //obtengo relacion con nomencladores y modifico
                        $objelemnomrep
                            = new DatElementosNomNomencladorModel();
                        if ($parametros->idcategoria) {
                            $elemnomcategrep
                                = $objelemnom->ModificarRelacionNomElem(
                                $objelementorep, $parametros->idcategoria, $tiponomenclador = 2
                            );
                        }
                        if ($parametros->idtipo) {
                            $elemnomtiporep
                                = $objelemnom->ModificarRelacionNomElem(
                                $objelementorep, $parametros->idtipo, $tiponomenclador = 3
                            );
                        }
                        $objactrep = Doctrine::getTable('DatActividades')
                            ->find(
                                $repeticion['idelemento']
                            );
                        $objactrep->esprincipal = $parametros->esprincipal;
                        if ($repeticion['tiporepeticion'] == 1) {
                            $objactrep->lugar = $parametros->lugar;
                            $objactrep->horainicio = $parametros->hora;
                            $objactrep->horafin = $parametros->horafin;
                            $objactrep->save();
                        }
                        //actualizo las relaciones a las repeticiones
                        if ($arrayrelaciones['contador'] > 0) {
                            $arrayrelacioness = array();
                            foreach (
                                $arrayrelaciones['array'] as $key => $relacion
                            ) {
                                $objrelacion->idplan = $relacion['idplan'];
                                $objrelacion->idarc = $relacion['idarc'];
                                $objrelacion->idobjetivo
                                    = $relacion['idobjetivo'];
                                $objrelacion->idactividad
                                    = $relacion['idactividad'];
                                $objrelacion->idfip = $relacion['idfip'];
                                $objrelacion->idautorrelacion
                                    = $relacion['idautorrelacion'];
                                $objrelacion->tipoelemento
                                    = $relacion['tipoelemento'];
                                $objrelacion->porcientoinicio
                                    = $relacion['porcientoinicio'];

                                $arrayrelacioness[$key] = $objrelacion;
                            }

                            $resp
                                = $objcmprelacionesmodel->RelacionarElementos(
                                $repeticion['idelemento'], $idtipoelemento = 3, $arrayrelacioness, $parentrelacidelemento = 'hijo', $idautorrelacion = null
                            );
                        }
                    }
                }
            }
            //actualizo las reasignaciones
            $this->ActualizarReasignaciones(
                $objelementoo, $objactividad, $parametros->idcategoria, $parametros->idtipo
            );
            if ($gantt == 2) {
                $respuesta->mensaje = 4;
            } else {
                $respuesta->mensaje = 1;
            }
            //***historial***
            $arrayinvolucrados = array();
            foreach ($parametros->arrayinvolucrados as $involucrado) {
                $arrayinvolucrados[] = $involucrado->idusuario;
            }
            $involucradoshisto = implode(',', $arrayinvolucrados);

            $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
            $objcambiohorario = $objcmpgestionaractividadesmodel->CambioHorario(
                $parametros
            );
            $accion = 2;
            $idelemento = $parametros->idactividad;
            $idtipoelemento = 3;
            $idautor = $parametros->idusuariocrea;
            $fecha = date('d/m/Y H:i:s');
            $parametros->participante = $parametros->participantes;
            $parametros->dirigente = $parametros->dirigentes;
            $objNotificacion = new CmpnotificacionesModel();
            $idhistorial = $objNotificacion->crearHistorial(
              $accion, $idelemento, $idtipoelemento, $idautor,
              $objcambiohorario, $parametros, $involucradoshisto
            );
            /*$objNotificacion->generarNotificacion(
                $accion, $idelemento, $idtipoelemento, $idautor, $fecha, $objcambiohorario, $parametros, $involucradoshisto
            );*/
            //***fin historial**
        } else {
            $respuesta->mensaje = 3;
        }
        if (isset($parametros->documentos[0])) {
            foreach ($parametros->documentos as $key => $iddocumento) {
                $docelem = Doctrine::getTable('DatElementosDocumento')
                    ->findByDql(
                        "idelemento = $parametros->idactividad AND iddocumento = '$iddocumento->id'"
                    )->toArray();
                if (count($docelem) == 0) {
                    $objAsociarDoc = new DatElementosDocumento();
                    $objAsociarDoc->idelemento = $parametros->idactividad;
                    $objAsociarDoc->iddocumento = $iddocumento->id;
                    $objAsociarDoc->save();
                }
            }
        }

        /* actualizo los valores de sus padres (grado de cumplimiento)
          en dependencia de todos sus hijos */
        /* if ($parametros->eshija == 1) {
          self::actualizarPorcientoPadre($parametros->idactividad);
          } */
        /* actualizo los valores de los objetivos con los que est� relacionada
          la actividad (% de cumplimiento) */
        $arrayobjvs = DatElementosDatElementos::obtenerElemenRelacionados(
            $parametros->idactividad, 1
        );
        if (isset($arrayobjvs[0])) {
            self::actualizarObjvsRelacionados($arrayobjvs);
        }

        /* actualizo el porcentaje de cumplimiento de los planes con los
         * que est� relacionada la actividad */
        $arrayPlanesE = DatElementosDatElementos::obtenerElemenRelacionados(
            $parametros->idactividad, 0
        );
        $arrayPlanesA = DatElementosDatElementos::obtenerPlanRelacionadoARC(
            $parametros->idactividad
        );
        $arrayPlanes = array_merge($arrayPlanesE, $arrayPlanesA);
        if (isset($arrayPlanes[0])) {
            CmpgestionarplanModel::actualizarPorcientoPlan($arrayPlanes);
        }

        $emailinvolucrados = array();
        $arrayInvolucrados
            = DatElementosDatInvolucrados::datosRelacionElemInvolColumn(
            $parametros->idactividad
        );
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

        $parametros->idelemento = $parametros->idactividad;
        $parametros->emails = array();
        $emailparticipantes = self::extract_email_address(
            $objelemento->participante
        );
        $emaildirigentes = self::extract_email_address($objelemento->dirigente);
        $parametros->emails = array_merge(
            $parametros->emails, $emailparticipantes, $emaildirigentes, $emailinvolucrados
        );

        $parametros->asunto = 'Actividad Modificada';
        self::sendMail($parametros);

        return $respuesta;
    }

  /**
   * Accion para actualizar parametors de las actividades
   */
  public
  function actualizarParametros($parametros)
  {
    $respuesta=0;
    try{
      foreach ($parametros->arrayidactividades as $idelemento) {
        $objAct = Doctrine::getTable('DatActividades')->find($idelemento);
        $datelemento = Doctrine::getTable('DatElementos')->find($idelemento);
        if($parametros->fechainicio!=''){
          $objAct->fechainicio = $parametros->fechainicio;
        }
        if($parametros->fechafin!=''){
          $objAct->fechafin = $parametros->fechafin;
        }
        if($parametros->horainicio!=''){
          $objAct->horainicio = $parametros->horainicio;
        }
        if($parametros->horafin!=''){
          $objAct->horafin = $parametros->horafin;
        }

        $objAct->esprincipal = $parametros->principal;

        //obtengo relacion con nomencladores y modifico
        $objelemnom = new DatElementosNomNomencladorModel();
        if ($parametros->idcategoria!='') {
          $elemnomcateg = $objelemnom->ModificarRelacionNomElem(
            $datelemento, $parametros->idcategoria, $tiponomenclador = 2
          );
        }
        if ($parametros->idtipo!='') {
          $elemnomtipo = $objelemnom->ModificarRelacionNomElem(
            $datelemento, $parametros->idtipo, $tiponomenclador = 3
          );
        }

        if ($parametros->denomtipo!='') {
          $objAct->tipo = $parametros->denomtipo;
        }
        if ($parametros->denomcategoria!='') {
          $objAct->categoria = $parametros->denomcategoria;
        }

        if ($parametros->idrecursoasociado) {
          $objelemnom->EliminarElemNom($objAct->idactividad);
          foreach ($parametros->idrecursoasociado as $key => $recurso) {
            $elemrecursoactividad
              = $objelemnom->AdicionarRelacionNomElem(
              $objAct->idactividad, $recurso, $tiponomenclador = 5
            );
          }
        }
        $objAct->save();

        /**************
        Modificar parametros en las repeticiones
         *************/

        $arrayestadosverdoc
                      = $this->pIntegrator->workflow->EstadosVerDoc(
          $idsubsistema = 15, $parametros->idusuariocrea, $idtipodoc = 3
        );
        $arrayestados = array();
        if (isset($arrayestadosverdoc['data'][0])) {
          foreach ($arrayestadosverdoc['data'] as $key => $estado) {
            $arrayestados[]['idestado'] = $estado['idestado'];
          }
        }
        $arrayrepeticiones = DatElementos::ObtenerRepeticiones(
          $objAct->idactividad, $arrayestados
        );

        if (isset($arrayrepeticiones[0])) {
          foreach ($arrayrepeticiones as $key => $repeticion) {
            $objActrep = Doctrine::getTable('DatActividades')->find($repeticion['idelemento']);
            $datelementorep = Doctrine::getTable('DatElementos')->find($repeticion['idelemento']);

            $objActrep->esprincipal = $parametros->principal;

            //obtengo relacion con nomencladores y modifico
            $objelemnomrep = new DatElementosNomNomencladorModel();
            if ($parametros->idcategoria!='') {
              $objelemnomrep->ModificarRelacionNomElem(
                $datelementorep, $parametros->idcategoria, $tiponomenclador = 2
              );
            }
            if ($parametros->idtipo!='') {
              $objelemnomrep->ModificarRelacionNomElem(
                $datelementorep, $parametros->idtipo, $tiponomenclador = 3
              );
            }

            $objActrep->save();
          }
        }
        /*************************************
         *****************************************/

        $respuesta++;
      }
    }catch (Exception $e){
      $respuesta=0;
    }

    return $respuesta;
  }

  /**
   * Funcion para modificar la actividad
   */
  public
  function ModificarActividad($parametros)
  {
    $objelemento = Doctrine::getTable('DatElementos')->find(
      $parametros->idactividad
    );
    if (isset($objelemento->idelemento)) {
      $idusuariosession = $this->global->Perfil->idusuario;
      $idautoractividad = $objelemento->idusuariocrea;

      if($parametros->act_bienestar == 1){
        $parametros->gradocumplimiento = $objelemento->gradocumplimiento;
      }

      $gantt = 0;
      $objelemmodel = new CmpgestionarelementoModel();
      $objelementoo = $objelemmodel->ModificarElemento(
        $objelemento->idelemento, $parametros->denelemento, $parametros->descelemento, $parametros->gradocumplimiento, $parametros->dirigentes, $parametros->participantes, $parametros->autoManual, $parametros->peso
      );
      if (isset($parametros->fechainicio) || isset($parametros->fechafin) || isset($parametros->horainicio) || isset($parametros->horafin) || isset($parametros->lugar) || isset($parametros->esprincipal)
      ) {
        $objactividad = Doctrine::getTable('DatActividades')->find(
          $parametros->idactividad
        );
        $paramsGantt->efecto = $parametros->efectocadena;
        $paramsGantt->ffinact = $parametros->fechafin;
        $paramsGantt->finiact = $parametros->fechainicio;
        $paramsGantt->idactividad = $parametros->idactividad;
        $paramsGantt->idusuariocrea = $parametros->idusuariocrea;
        $gantt = self::modificarFechaGantt($paramsGantt);
        if (isset($parametros->horainicio)) {
          $objactividad->horainicio = $parametros->horainicio;
        }
        if (isset($parametros->horafin)) {
          $objactividad->horafin = $parametros->horafin;
        }
        if (isset($parametros->lugar)) {
          $objactividad->lugar = $parametros->lugar;
        }
        if (isset($parametros->tiempoestimado)) {
          $objactividad->tiempoestimado
            = ($parametros->tiempoestimado == '') ? 0 : $parametros->tiempoestimado;
        }
        if (isset($parametros->criterioevaluacion)) {
          $objactividad->criterioevaluacion
            = $parametros->criterioevaluacion;
        }
        if (isset($parametros->denomtipo)) {
          $objactividad->tipo = $parametros->denomtipo;
        }
        if (isset($parametros->denomcategoria)) {
          $objactividad->categoria = $parametros->denomcategoria;
        }
        if (isset($parametros->duracion)) {
          $objactividad->duracion = ($parametros->duracion == '') ? 0 : $parametros->duracion;
        }
        if ($parametros->principal == 1) {
          $princp = 1;
        } else {
          $princp = 0;
        }
        $objactividad->esprincipal = $princp;
        $objactividad->save();
      }
      if ($parametros->eshija == 1) {
        $elementohijo = Doctrine::getTable(
          'DatElementosDatElementos'
        )->findByDql(
          "idelementohijo = '$parametros->idactividad'"
        );
        if ($elementohijo[0] != null) {
          $elementohijo[0]->porcientoinicio
            = $parametros->porcientoRe;
          $elementohijo[0]->ponderacion
            = ($parametros->porcientoRe) / 10;
          $elementohijo[0]->save();
        }
        if ($parametros->autoManualPadre == 1) {
          $respuesta->padreRaiz
            = self::calcularGradoCumplimiento(
            $parametros
          );
          $elementosrelacionados
            = DatElementosDatElementos:: buscarElementosRelacionados(
            $parametros
          );
          if (isset($elementosrelacionados[0])) {
            self::actualizarGradoCumpObj(
              $elementosrelacionados
            );
          }
        } else {
          $elementosrelacionados
            = DatElementosDatElementos:: buscarElementosRelacionados(
            $parametros
          );
          if (isset($elementosrelacionados[0])) {
            self::actualizarGradoCumpObj(
              $elementosrelacionados
            );
          }
        }
      } else {
        $elementosrelacionados
          = DatElementosDatElementos:: buscarElementosRelacionados(
          $parametros
        );
        if (isset($elementosrelacionados[0])) {
          self::actualizarGradoCumpObj($elementosrelacionados);
        }
      }
      $objcmprelacionesmodel = new CmprelacionesModel();
      if (isset($parametros->arrayelementosrelacionados[0])) {
        foreach (
          $parametros->arrayelementosrelacionados as $key => $relacion
        ) {
          if ($relacion->origen == 7) {
            $existerelacion = Doctrine::getTable(
              'DatElementosDatElementos'
            )->findByDql(
              "idelementopadre = '$parametros->idactividad'
                                    AND idelementohijo = '$relacion->idactividad'"
            );
            $existerelacionb = Doctrine::getTable(
              'DatElementosDatElementos'
            )->findByDql(
              "idelementopadre = '$relacion->idactividad'
                                    AND idelementohijo = '$parametros->idactividad'"
            );
            if ($existerelacion[0]->idelementopadre != null) {
              $existerelacion[0]->porcientoinicio
                = $relacion->porcientoinicio;
              $existerelacion[0]->save();
            }
            if ($existerelacionb[0]->idelementopadre != null) {
              $existerelacionb[0]->porcientoinicio
                = $relacion->porcientoinicio;
              $existerelacionb[0]->save();
            }
          }
        }
      }
      $objCmpgestionarelementomodel = new CmpgestionarelementoModel();
      //se relacionan los involucrados al elemento o actividad
      $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
        $parametros->arrayinvolucrados, $parametros->idactividad, $parametros->idtipoelemento
      );
      //se eliminan los involucrados al elemento o actividad
      $objCmpgestionarelementomodel->EliminarUsuariosAElementos(
        $parametros->arrayinvolucradoseliminar, $parametros->idactividad, $parametros->idtipoelemento
      );
      //obtengo relacion con nomencladores y modifico
      $objelemnom = new DatElementosNomNomencladorModel();
      if ($parametros->idcategoria) {
        $elemnomcateg = $objelemnom->ModificarRelacionNomElem(
          $objelementoo, $parametros->idcategoria, $tiponomenclador = 2
        );
      }
      if ($parametros->idtipo) {
        $elemnomtipo = $objelemnom->ModificarRelacionNomElem(
          $objelementoo, $parametros->idtipo, $tiponomenclador = 3
        );
      }
      /* Cosas de Julio */
      // EliminarElemNom($idelemento)
      //obtengo todas las repticiones
      if ($parametros->idrecursoasociado) {
        $objelemnom->EliminarElemNom($parametros->idactividad);
        foreach ($parametros->idrecursoasociado as $key => $recurso) {
          $elemrecursoactividad
            = $objelemnom->AdicionarRelacionNomElem(
            $parametros->idactividad, $recurso, $tiponomenclador = 5
          );
        }
      } else {
        if ($objelemnom->existeActividadSegunId(
          $parametros->idactividad
        )
        ) {
          $objelemnom->EliminarElemNom($parametros->idactividad);
        }
      }
      $arrayestadosverdoc
                    = $this->pIntegrator->workflow->EstadosVerDoc(
        $idsubsistema = 15, $parametros->idusuariocrea, $idtipodoc = 3
      );
      $arrayestados = array();
      if (isset($arrayestadosverdoc['data'][0])) {
        foreach ($arrayestadosverdoc['data'] as $key => $estado) {
          $arrayestados[]['idestado'] = $estado['idestado'];
        }
      }
      $arrayrepeticiones = DatElementos::ObtenerRepeticiones(
        $parametros->idactividad, $arrayestados
      );
      if (isset($arrayrepeticiones[0])) {
        //obtengo relaciones de la actividad inicial para actualizar repeticiones
        $idusuariosession = $this->global->Perfil->idusuario;
        $objcmprelacionesmodel = new CmprelacionesModel();
        $arrayrelaciones
          = $objcmprelacionesmodel->CargarRelacionesSuperiores(
          $tipoelemento = 3, $parametros->idactividad, $idusuariosession
        );
        foreach ($arrayrepeticiones as $key => $repeticion) {
          $objelementorep = Doctrine::getTable('DatElementos')
                                    ->find(
                                      $repeticion['idelemento']
                                    );
          if (isset($objelementorep->idelemento)) {
            $objelementorep->denelemento
              = $parametros->denelemento;
            if (isset($parametros->descelemento)) {
              $objelementorep->descelemento
                = $parametros->descelemento;
            }
            if (isset($parametros->dirigentes)) {
              $objelementorep->dirigente
                = $parametros->dirigentes;
            }
            if (isset($parametros->participantes)) {
              $objelementorep->participante
                = $parametros->participantes;
            }
            $objelementorep->save();
            //obtengo relacion con nomencladores y modifico
            $objelemnomrep
              = new DatElementosNomNomencladorModel();
            if ($parametros->idcategoria) {
              $elemnomcategrep
                = $objelemnom->ModificarRelacionNomElem(
                $objelementorep, $parametros->idcategoria, $tiponomenclador = 2
              );
            }
            if ($parametros->idtipo) {
              $elemnomtiporep
                = $objelemnom->ModificarRelacionNomElem(
                $objelementorep, $parametros->idtipo, $tiponomenclador = 3
              );
            }
            $objactrep = Doctrine::getTable('DatActividades')
                                 ->find(
                                   $repeticion['idelemento']
                                 );
            $objactrep->esprincipal = $parametros->esprincipal;
            if ($repeticion['tiporepeticion'] == 1) {
              $objactrep->lugar = $parametros->lugar;
              $objactrep->horainicio = $parametros->horainicio;
              $objactrep->horafin = $parametros->horafin;
              $objactrep->save();
            }
            //actualizo las relaciones a las repeticiones
            if ($arrayrelaciones['contador'] > 0) {
              $arrayrelacioness = array();
              foreach (
                $arrayrelaciones['array'] as $key => $relacion
              ) {
                $objrelacion->idplan = $relacion['idplan'];
                $objrelacion->idarc = $relacion['idarc'];
                $objrelacion->idobjetivo
                                     = $relacion['idobjetivo'];
                $objrelacion->idactividad
                                     = $relacion['idactividad'];
                $objrelacion->idfip = $relacion['idfip'];
                $objrelacion->idautorrelacion
                                     = $relacion['idautorrelacion'];
                $objrelacion->tipoelemento
                                     = $relacion['tipoelemento'];
                $objrelacion->porcientoinicio
                                     = $relacion['porcientoinicio'];

                $arrayrelacioness[$key] = $objrelacion;
              }

              $resp
                = $objcmprelacionesmodel->RelacionarElementos(
                $repeticion['idelemento'], $idtipoelemento = 3, $arrayrelacioness, $parentrelacidelemento = 'hijo', $idautorrelacion = null
              );
            }
          }
        }
      }
      //actualizo las reasignaciones
      $this->ActualizarReasignaciones(
        $objelementoo, $objactividad, $parametros->idcategoria, $parametros->idtipo
      );
      if ($gantt == 2) {
        $respuesta->mensaje = 4;
      } else {
        $respuesta->mensaje = 1;
      }
      //***historial***
      $arrayinvolucrados = array();
      foreach ($parametros->arrayinvolucrados as $involucrado) {
        $arrayinvolucrados[] = $involucrado->idusuario;
      }
      $involucradoshisto = implode(',', $arrayinvolucrados);

      $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
      $objcambiohorario = $objcmpgestionaractividadesmodel->CambioHorario(
        $parametros
      );
      $accion = 2;
      $idelemento = $parametros->idactividad;
      $idtipoelemento = 3;
      $idautor = $parametros->idusuariocrea;
      $fecha = date('d/m/Y H:i:s');
      $parametros->participante = $parametros->participantes;
      $parametros->dirigente = $parametros->dirigentes;
      $objNotificacion = new CmpnotificacionesModel();
//      $idhistorial = $objNotificacion->crearHistorial(
//        $accion, $idelemento, $idtipoelemento, $idautor,
//        $objcambiohorario, $parametros, $involucradoshisto
//      );
      $objNotificacion->generarNotificacion(
          $accion, $idelemento, $idtipoelemento, $idautor, $fecha, $objcambiohorario, $parametros, $involucradoshisto
      );
      //***fin historial**
    } else {
      $respuesta->mensaje = 3;
    }
    if (isset($parametros->documentos[0])) {
      foreach ($parametros->documentos as $key => $iddocumento) {
        $docelem = Doctrine::getTable('DatElementosDocumento')
                           ->findByDql(
                             "idelemento = $parametros->idactividad AND iddocumento = '$iddocumento->id'"
                           )->toArray();
        if (count($docelem) == 0) {
          $objAsociarDoc = new DatElementosDocumento();
          $objAsociarDoc->idelemento = $parametros->idactividad;
          $objAsociarDoc->iddocumento = $iddocumento->id;
          $objAsociarDoc->save();
        }
      }
    }

    /* actualizo los valores de sus padres (grado de cumplimiento)
      en dependencia de todos sus hijos */
    /* if ($parametros->eshija == 1) {
      self::actualizarPorcientoPadre($parametros->idactividad);
      } */
    /* actualizo los valores de los objetivos con los que est� relacionada
      la actividad (% de cumplimiento) */
    $arrayobjvs = DatElementosDatElementos::obtenerElemenRelacionados(
      $parametros->idactividad, 1
    );
    if (isset($arrayobjvs[0])) {
      self::actualizarObjvsRelacionados($arrayobjvs);
    }

    /* actualizo el porcentaje de cumplimiento de los planes con los
     * que est� relacionada la actividad */
    $arrayPlanesE = DatElementosDatElementos::obtenerElemenRelacionados(
      $parametros->idactividad, 0
    );
    $arrayPlanesA = DatElementosDatElementos::obtenerPlanRelacionadoARC(
      $parametros->idactividad
    );
    $arrayPlanes = array_merge($arrayPlanesE, $arrayPlanesA);
    if (isset($arrayPlanes[0])) {
      CmpgestionarplanModel::actualizarPorcientoPlan($arrayPlanes);
    }

    $emailinvolucrados = array();
    $arrayInvolucrados
                       = DatElementosDatInvolucrados::datosRelacionElemInvolColumn(
      $parametros->idactividad
    );
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

    $parametros->idelemento = $parametros->idactividad;
    $parametros->emails = array();
    $emailparticipantes = self::extract_email_address(
      $objelemento->participante
    );
    $emaildirigentes = self::extract_email_address($objelemento->dirigente);
    $parametros->emails = array_merge(
      $parametros->emails, $emailparticipantes, $emaildirigentes, $emailinvolucrados
    );

    $parametros->asunto = 'Actividad Modificada';
    $respuesta->parametros=$parametros;
    $respuesta->actividad=DatElementos::getRecordListarActividades($parametros->idusuariocrea, $parametros->idactividad);
    return $respuesta;
  }

    /**
     * Funcion para modificar la actividad
     */
    public
    function AprobarPuntualizacion($idpunt, $idelemento)
    {
        $objelemento = Doctrine::getTable('DatElementos')->find(
            $idelemento
        );
        $objpunt = Doctrine::getTable('DatElementos')->find(
            $idpunt
        );
        if (isset($objelemento->idelemento)) {
            $objelemmodel = new CmpgestionarelementoModel();
            $objelementoo = $objelemmodel->ModificarElemento(
                $objelemento->idelemento, $objpunt->denelemento, $objpunt->descelemento, $objpunt->gradocumplimiento, '', '', $objpunt->actualizarporciento, $objpunt->peso
            );
            $obja = Doctrine::getTable('DatActividades')->find(
                $idelemento
            );
            $objactpunt = Doctrine::getTable('DatActividades')->find(
                $idpunt
            );
            $obja->horainicio = $objactpunt->horainicio;
            $obja->horafin = $objactpunt->horafin;
            $obja->lugar = $objactpunt->lugar;
            $obja->tiempoestimado = $objactpunt->tiempoestimado;
            $obja->criterioevaluacion
                = $objactpunt->criterioevaluacion;
            $obja->esprincipal = $objactpunt->esprincipal;
            $obja->save();
            $arrayPlanesE = DatElementosDatElementos::obtenerElemenRelacionados(
                $idelemento, 0
            );
            $arrayPlanesA = DatElementosDatElementos::obtenerPlanRelacionadoARC(
                $idelemento
            );
            $arrayPlanes = array_merge($arrayPlanesE, $arrayPlanesA);
            if (isset($arrayPlanes[0])) {
                CmpgestionarplanModel::actualizarPorcientoPlan($arrayPlanes);
            }
            $objpunt->delete();
            $respuesta->mensaje = 1;
            return $respuesta;
        }
    }

    public
    function ModificarFechaActividad($parametros)
    {
        $objactividad = Doctrine::getTable('DatActividades')->find(
            $parametros->idactividad
        );
        $respuesta = 0;
        if (isset($objactividad->idactividad)) {
            $fecha = $parametros->fecha;
            if ($fecha != '' && $fecha != null) {
                $fechainicio = strtotime(
                    date(str_replace("/", "-", $objactividad->fechainicio))
                );
                $fechainicio = date('d-m-Y', $fechainicio);
                $fechafin = strtotime(
                    date(str_replace("/", "-", $objactividad->fechafin))
                );
                $fechafin = date('d-m-Y', $fechafin);
                switch ($fecha) {
                    case 'dia':
                        $fechainicio = date(
                            'd/m/Y', strtotime($fechainicio . "+ 1 days")
                        );
                        $fechafin = date(
                            'd/m/Y', strtotime($fechafin . "+ 1 days")
                        );
                        break;
                    case 'semana':
                        $fechainicio = date(
                            'd/m/Y', strtotime($fechainicio . "+ 1 week")
                        );
                        $fechafin = date(
                            'd/m/Y', strtotime($fechafin . "+ 1 week")
                        );
                        break;
                    case 'mes':
                        $fechainicio = date(
                            'd/m/Y', strtotime($fechainicio . "+ 1 month")
                        );
                        $fechafin = date(
                            'd/m/Y', strtotime($fechafin . "+ 1 month")
                        );
                        break;
                    case 'anno':
                        $fechainicio = date(
                            'd/m/Y', strtotime($fechainicio . "+ 1 year")
                        );
                        $fechafin = date(
                            'd/m/Y', strtotime($fechafin . "+ 1 year")
                        );
                        break;
                    default:
                        $diasTranscurridos = abs(
                            $this->dias_transcurridos(
                                $objactividad->fechainicio, $objactividad->fechafin
                            )
                        );
                        $fechainicio = strtotime(
                            date(str_replace("/", "-", $fecha))
                        );
                        $fechainicio = date('d-m-Y', $fechainicio);

                        $fechafin = date(
                            'd/m/Y', strtotime(
                                $fechainicio . "+ $diasTranscurridos days"
                            )
                        );
                        $fechainicio = date('d/m/Y', strtotime($fechainicio));
                }
                $parametros->fechainicio = $fechainicio;
                $parametros->fechafin = $fechafin;
            }
            $respuesta = DatActividades::actulizarFechaActividad(
                $parametros
            );
        }
        return $respuesta;
    }

    /**
     * Funcion para modificar el horario de la actividad
     */
    public
    function ModificarHorarioActividad(
        $idactividad, $horainicio, $horafin
    )
    {
        $objactividad = Doctrine::getTable('DatActividades')->find(
            $idactividad
        );
        if (isset($objactividad->idactividad)) {
            $objactividad->horainicio = $horainicio;
            $objactividad->horafin = $horafin;
            $objactividad->save();
            $respuesta = 1;
        } else {
            $respuesta = 0;
        }
        return $respuesta;
    }

    public
    function actualizarHorarioAct($idactividad, $horainicio, $horafin)
    {
        $objactividad = Doctrine::getTable('DatActividades')->find(
            $idactividad
        );
        if (isset($objactividad->idactividad)) {
            /* $objactividad = new DatActividades();
              $objactividad->actualizarHorarioAct(
              $idactividad, $horainicio, $horafin
              ); */
            $objactividad->horainicio = $horainicio;
            $objactividad->horafin = $horafin;
            $objactividad->save();
            $respuesta = 1;
        } else {
            $respuesta = 0;
        }
        return $respuesta;
    }

    public
    function actualizarHorarioFechaAct($parametros)
    {
        $objactividad = Doctrine::getTable('DatActividades')->find(
            $parametros->idactividad
        );
        if (isset($objactividad->idactividad)) {
            $objactividad->fechainicio = $parametros->fechainicio;
            $objactividad->fechafin = $parametros->fechafin;
            $objactividad->horainicio = $parametros->horainicio;
            $objactividad->horafin = $parametros->horafin;
            $objactividad->save();
            $respuesta = 1;
        } else {
            $respuesta = 0;
        }
        return $respuesta;
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

    private
    function sendMailService($parametros)
    {
        $integrator = ZendExt_IoC::getInstance();
        if (count($parametros->emails) > 0) {
            try {
                $xml = substr(
                        $_SERVER['SCRIPT_FILENAME'], 0, strrpos($_SERVER['SCRIPT_FILENAME'], 'web')
                    )
                    . 'apps/planificacion/comun/recursos/xml/configuracioncorreo.xml';
                if (is_readable($xml)) {
                    $xmlOperaciones = simplexml_load_file($xml);
                    $jsonString = json_encode($xmlOperaciones);
                    $xmlConfiguraciones = json_decode($jsonString, true);
                    if ($xmlConfiguraciones['AllowEmail'] == 'on') {
                        $mail = new PHPMailer(true);
                        //$mail->IsSMTP();
                        //$password = 'planificacion123';
                        /* if (password_verify(
                          $password, $xmlConfiguraciones['Password']
                          )) { */
                        $datosautor
                            = $integrator->pvd->getPrincipalesDatosPersona(
                            $params[] = $parametros->idpersona
                        );
                        if (isset($datosautor->data[0])) {
                            $autor
                                = ($datosautor->data[0]['nombreapellidos']);
                        } else {
                            $usuarioautor
                                = $integrator->seguridad->nombreUsuario(
                                $parametros->idusuariocrea
                            );
                            $autor = $usuarioautor;
                        }
                        $mail->SMTPDebug = $xmlConfiguraciones['SMTPDebug'];
                        $mail->SMTPSecure
                            = $xmlConfiguraciones['SMTPSecure'];
                        $mail->CharSet = $xmlConfiguraciones['CharSet'];
                        $mail->SMTPAuth = $xmlConfiguraciones['SMTPAuth'];
                        $mail->Host = $xmlConfiguraciones['Host'];
                        $mail->Port = $xmlConfiguraciones['Port'];
                        $mail->Username = $xmlConfiguraciones['Username'];
                        $mail->Password = $xmlConfiguraciones['Password'];
                        $mail->Mailer = $xmlConfiguraciones['Mailer'];
                        $mail->Timeout = $xmlConfiguraciones['Timeout'];
                        //====== DE QUIEN ES ========
                        $mail->From = $xmlConfiguraciones['From'];
                        $mail->FromName = $xmlConfiguraciones['FromName'];
                        //====== PARA QUIEN =========
                        $mail->Subject = $parametros->asunto;

                        //print_r($parametros->emails);die;
                        foreach ($parametros->emails as $dir) {
                            $mail->AddAddress($dir, $dir);
                        }
                        //Cuerpo del mensaje
                        if ($parametros->asunto == 'Actividad Modificada') {
                            $postaccion = 'modificada';
                            $bodyDetallesMod
                                = $this->compararUltimaModificacion(
                                $parametros
                            );
                            if ($bodyDetallesMod != '') {
                                $bodyDetallesMod
                                    = 'Detalles de los valores que fueron modificados:<br><br>'
                                    . $bodyDetallesMod;
                            }
                        } else {
                            $postaccion = 'adicionada';
                        }
                        $body
                            = '<p style= "font-family: arial,helvetica,sans-serif; font-size: 12pt;">'
                            . "La siguiente actividad ha sido $postaccion:<br><br>";
                        $body .= '<b>CAR: </b>' . $parametros->idelemento . '<br>
                                <b>Denominaci&oacute;n: </b>'
                            . $parametros->denelemento . '<br>
                                <b>Descripci&oacute;n: </b>'
                            . $parametros->descelemento . '<br>
                                <b>Fecha de inicio: </b>'
                            . $parametros->fechainicio . '<br>
                                <b>Fecha de fin: </b>' . $parametros->fechafin . '<br>
                                <b>Hora de inicio: </b>'
                            . $parametros->horainicio . '<br>
                                <b>Hora de fin: </b>' . $parametros->horafin . '<br>
                                <b>Lugar: </b>' . $parametros->lugar . '<br>
                                <b>Autor: </b>' . $autor . '<br><br>';
                        $body .= $bodyDetallesMod;
                        $body .= " <br><i>No responder este correo. Enviado desde el Sistema de Planificaci&oacute;n.</i></p>";
                        $mail->Body = $body;
                        $mail->IsHTML(true);
                        try {
                            ob_start();
                            $mail->Send();
                            $mail->SmtpClose();
                        } catch (phpmailerException $e) {
                            ob_get_clean();
                            $mail->SmtpClose();
                            //echo($e->getMessage());
                        }
                        return true;
                        /* } else {
                          //echo 'La contraseña no es válida.';
                          } */
                    }
                } else {
                    die('No se puede leer el fichero que se encuentra en: '
                        . $xml);
                }
            } catch (Exception $exc) {
                die($exc->getMessage());
            }
        }
    }

    public function enviarCorreoImportar($parametros)
    {
        $mail = $parametros->mail;
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
        foreach ($parametros->emails as $dir) {
            $mail->AddBCC($dir, $dir);
        };

        //Cuerpo del mensaje
        if ($parametros->asunto == 'Actividad Modificada') {
            $postaccion = 'modificada';
            $bodyDetallesMod
                = $this->compararUltimaModificacion(
                $parametros
            );
            if ($bodyDetallesMod != '') {
                $bodyDetallesMod
                    = 'Detalles de los valores que fueron modificados:<br><br>'
                    . $bodyDetallesMod;
            }
        } else {
            $postaccion = 'adicionada';
        }

        $body
            = '<p style= "font-family: arial,helvetica,sans-serif; font-size: 12pt;">'
            . "La siguiente actividad ha sido $postaccion:<br><br>";
        $body .= '<b>CAR: </b>' . $parametros->idelemento . '<br>
                                <b>Denominaci&oacute;n: </b>'
            . $parametros->denelemento . '<br>
                                <b>Descripci&oacute;n: </b>'
            . $parametros->descelemento . '<br>
                                <b>Fecha de inicio: </b>'
            . $parametros->fechainicio . '<br>
                                <b>Fecha de fin: </b>' . $parametros->fechafin . '<br>
                                <b>Hora de inicio: </b>'
            . $parametros->horainicio . '<br>
                                <b>Hora de fin: </b>' . $parametros->horafin . '<br>
                                <b>Lugar: </b>' . $parametros->lugar . '<br>
                                <b>Autor: </b>' . $autor . '<br><br>';
        $body .= $bodyDetallesMod;
        $body .= " <br><i>No responder este correo. Enviado desde el Sistema de Planificaci&oacute;n.</i></p>";
        $mail->Body = $body;

        $mail->MsgHTML($mail->Body);
        $mail->IsHTML(true);


        if (
        $mail->Send()
        ) {
            $result = true;

        } else {
            $result = false;
        }

        return $result;
    }

    public function enviarCorreo($parametros)
    {
//        print_r($parametros->emails);die;
       // $parametros->emails = ['tumbarell@xetid.cu', 'fsera@xetid.cu', 'ragraveran@xetid.cu'];

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
        require $dir_abs_mt . '/apps/planificacion/comun/recursos/lib/PHPMailer/class.phpmailer.php';
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

        //====== PARA QUIEN =========
        foreach ($parametros->emails as $dir) {
            $contador = 0;

            if($dir != 'SC'){
                $mail->AddBCC($dir, $dir);
            }else{
                $contador++;
            }
//            $mail->AddBCC($dir, $dir);
            //$mail->AddReplyTo($dir, $dir);
        };
        
        $mail->Body = $parametros->body;

        $mail->MsgHTML($mail->Body);
        $mail->IsHTML(true);

//        print_r($mail->Send());die;

        try{
          $respuesta = $mail->Send();  
          if ($respuesta) {
              $result[0] = 1;
              $result[1] = $contador;
              $result[2] = $respuesta[1];

        } else {
              $result[0] = 0;
              $result[1] = $contador;
              $result[2] = $respuesta[1];
        }


        }catch (Exception $exception){
//          print_r($exception->getMessage());die;
//          $result = false;
            $result[0] = 0;
        }

        return $result;
    }


      public function getIdPersona($idusuario)
      {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $sql = "SELECT su.idusuario, su.nombreusuario, su.iddominio, su.idpersona
              FROM mod_seguridad.seg_usuario su
          WHERE su.idusuario = '$idusuario' ";
        $info_usuario = $conn->fetchAll($sql);
        return (count($info_usuario)>0)?$info_usuario[0]['idpersona']:0;
      }


    public function getDatosPersona($idpersona){
      try {
        $sql = "SELECT nombre, snombre, papel, sapel
                    FROM mod_persona.dat_persona 
                    WHERE idpersona = {$idpersona}";
        $query = Doctrine_Manager::getInstance();
        $res = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        foreach ($res as $llave => $valor) {
          if ($res[$llave]['snombre'] != null) {
            $res[$llave]['nombreapellidos'] = $res[$llave]['nombre'] . ' ' . $res[$llave]['snombre'] . ' ' .
              $res[$llave]['papel'] . ' ' . $res[$llave]['sapel'];
          } else {
            $res[$llave]['nombreapellidos'] = $res[$llave]['nombre'] . ' ' . $res[$llave]['papel'] . ' ' .
              $res[$llave]['sapel'];
          }
        }

        return $res;

      } catch (Exception $e) {
        return '';
      }
    }


    public function enviarSugerencia($parametros)
    {

      $idpersona=CmpgestionaractividadesModel::getIdPersona($parametros->idusuario);
      $datos_persona=$parametros->nombreusuario;
      if($idpersona!=0){
        $datos_persona=CmpgestionaractividadesModel::getDatosPersona($idpersona)[0]['nombreapellidos'];
      }

        $parametros->emails = ['tumbarell@xetid.cu', 'fsera@xetid.cu', 'ragraveran@xetid.cu'];
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
        /*$datosautor
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
        }*/


        //====== PARA QUIEN =========
        //print_r($parametros->emails); die;
        foreach ($parametros->emails as $dir) {
            $mail->AddBCC($dir, $dir);
            //$mail->AddReplyTo($dir, $dir);
        };


        $body
            = '<p style= "font-family: arial,helvetica,sans-serif; font-size: 12pt;">'
            . "<br><br>";
        $body .= '<b>' . $parametros->asunto . ': </b>' . $parametros->denominacion . '<br>'
                                                        . $datos_persona . '<br>';
        //<b>Autor: </b>' . $autor . '<br><br>';

        $body .= " <br><i>No responder este correo. Enviado desde DiSTRAPLAN.</i></p>";
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

        if (
        $mail->Send()
        ) {
            $result = true;

        } else {
            $result = false;
        }

        return $result;
    }


    public function enviarCorreoAPK($parametros)
    {
//   $parametros->emails = ['tumbarell@xetid.cu', 'fsera@xetid.cu', 'ragraveran@xetid.cu'];
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
        /*$datosautor
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
        }*/


        //====== PARA QUIEN =========
        //print_r($parametros->emails); die;
        foreach ($parametros->emails as $dir) {
            $mail->AddBCC($dir, $dir);
            //$mail->AddReplyTo($dir, $dir);
        };

        //Cuerpo del mensaje
        if ($parametros->asunto == 'Actividad Modificada') {
            $postaccion = 'modificada';
            $bodyDetallesMod
                = $this->compararUltimaModificacion(
                $parametros
            );
            if ($bodyDetallesMod != '') {
                $bodyDetallesMod
                    = 'Detalles de los valores que fueron modificados:<br><br>'
                    . $bodyDetallesMod;
            }
        } else {
            $postaccion = 'adicionada';
        }

        $body
            = '<p style= "font-family: arial,helvetica,sans-serif; font-size: 12pt;">'
            . "La siguiente actividad ha sido $postaccion:<br><br>";
        $body .= '<b>CAR: </b>' . $parametros->idelemento . '<br>
                                <b>Denominaci&oacute;n: </b>'
            . $parametros->denelemento . '<br>
                                <b>Descripci&oacute;n: </b>'
            . $parametros->descelemento . '<br>
                                <b>Fecha de inicio: </b>'
            . $parametros->fechainicio . '<br>
                                <b>Fecha de fin: </b>' . $parametros->fechafin . '<br>
                                <b>Hora de inicio: </b>'
            . $parametros->horainicio . '<br>
                                <b>Hora de fin: </b>' . $parametros->horafin . '<br>
                                <b>Lugar: </b>' . $parametros->lugar . '<br>';
        //<b>Autor: </b>' . $autor . '<br><br>';
        $body .= $bodyDetallesMod;
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

        if (
        $mail->Send()
        ) {
            $result = true;

        } else {
            $result = false;
        }

        return $result;
    }

    private
    function sendMail($parametros)
    {
        $parametros->emails = ['ragraveran@xetid.cu', 'tumbarell@xetid.cu'];
        if (count($parametros->emails) > 0) {
            try {
//                $xml = substr(
//                        $_SERVER['SCRIPT_FILENAME'], 0, strrpos($_SERVER['SCRIPT_FILENAME'], 'web')
//                    )
//                    . 'apps/planificacion/comun/recursos/xml/configuracioncorreo.xml';
                $dir_www = $_SERVER ['DOCUMENT_ROOT'];
                $dir_rel_mt = '/';
                $dir_abs_mt = str_replace('//', '/', dirname($dir_www . '..') . '/' . $dir_rel_mt);


                $xml = $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'planificacion' . DIRECTORY_SEPARATOR .
                    'comun' . DIRECTORY_SEPARATOR . 'recursos' . DIRECTORY_SEPARATOR . 'xml' . DIRECTORY_SEPARATOR . 'config_mailer.xml';

                if (is_readable($xml)) {
                    $xmlOperaciones = simplexml_load_file($xml);
                    $jsonString = json_encode($xmlOperaciones);
                    $xmlConfiguraciones = json_decode($jsonString, true);
                    if ($xmlConfiguraciones['AllowEmail'] == 'on') {
                        require $dir_abs_mt . '/apps/planificacion/comun/recursos/lib/PHPMailer2/class.phpmailer.php';
                        $mail = new PHPMailer(true);
                        //$mail->IsSMTP();
                        //$password = 'planificacion123';
                        /* if (password_verify(
                          $password, $xmlConfiguraciones['Password']
                          )) { */
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
//                        $mail->SMTPDebug = $xmlConfiguraciones['SMTPDebug'];
//                        $mail->SMTPSecure
//                            = $xmlConfiguraciones['SMTPSecure'];
//                        $mail->CharSet = $xmlConfiguraciones['CharSet'];
//                        $mail->SMTPAuth = $xmlConfiguraciones['SMTPAuth'];
//                        $mail->Host = $xmlConfiguraciones['Host'];
//                        $mail->Port = $xmlConfiguraciones['Port'];
//                        $mail->Username = $xmlConfiguraciones['Username'];
//                        $mail->Password = $xmlConfiguraciones['Password'];
//                        $mail->Mailer = $xmlConfiguraciones['Mailer'];
//                        $mail->Timeout = $xmlConfiguraciones['Timeout'];

                        //====== DE QUIEN ES ========
//                      $mail->From = $xmlConfiguraciones['From'];
//                      $mail->FromName = $xmlConfiguraciones['FromName'];
                        //====== PARA QUIEN =========
//                      $mail->Subject = $parametros->asunto;


                        $mail->SMTPDebug = 3;
                        $mail->SMTPSecure = 'none';
                        $mail->CharSet = 'UTF-8';
                        $mail->SMTPAuth = true;
                        $mail->Host = 'correo.xetid.cu';
                        $mail->Port = '465';
                        $mail->Username = 'ragraveran@xetid.cu';
                        $mail->Password = 'robe2019**';
//                      $mail->Mailer='smtp';
                        $mail->Timeout = 50;

                        //====== DE QUIEN ES ========
                        $mail->From = 'ragraveran@xetid.cu';
                        $mail->FromName = 'ragraveran@xetid.cu';
                        //====== PARA QUIEN =========
                        $mail->Subject = 'Condenados';


                        //print_r($parametros->emails);die;
                        foreach ($parametros->emails as $dir) {
                            $mail->AddAddress($dir, $dir);
                        }
                        //Cuerpo del mensaje
                        if ($parametros->asunto == 'Actividad Modificada') {
                            $postaccion = 'modificada';
                            $bodyDetallesMod
                                = $this->compararUltimaModificacion(
                                $parametros
                            );
                            if ($bodyDetallesMod != '') {
                                $bodyDetallesMod
                                    = 'Detalles de los valores que fueron modificados:<br><br>'
                                    . $bodyDetallesMod;
                            }
                        } else {
                            $postaccion = 'adicionada';
                        }
                        $body
                            = '<p style= "font-family: arial,helvetica,sans-serif; font-size: 12pt;">'
                            . "La siguiente actividad ha sido $postaccion:<br><br>";
                        $body .= '<b>CAR: </b>' . $parametros->idelemento . '<br>
                                <b>Denominaci&oacute;n: </b>'
                            . $parametros->denelemento . '<br>
                                <b>Descripci&oacute;n: </b>'
                            . $parametros->descelemento . '<br>
                                <b>Fecha de inicio: </b>'
                            . $parametros->fechainicio . '<br>
                                <b>Fecha de fin: </b>' . $parametros->fechafin . '<br>
                                <b>Hora de inicio: </b>'
                            . $parametros->horainicio . '<br>
                                <b>Hora de fin: </b>' . $parametros->horafin . '<br>
                                <b>Lugar: </b>' . $parametros->lugar . '<br>
                                <b>Autor: </b>' . $autor . '<br><br>';
                        $body .= $bodyDetallesMod;
                        $body .= " <br><i>No responder este correo. Enviado desde el Sistema de Planificaci&oacute;n.</i></p>";
                        $mail->Body = $body;
                        $mail->IsHTML(true);
                        try {
                            ob_start();
                            if ($mail->Send()) {
                                $result = true;

                            } else {
                                $result = false;
                            }
                            print_r($result);
                            die;
                            ob_get_clean();
                            ob_clean();
                        } catch (phpmailerException $e) {
//            print_r($e->getMessage() . '</pre>' . $e->getTraceAsString());
//            die;
                        }
                        return $result;
                        /* } else {
                          //echo 'La contraseña no es válida.';
                          } */
                    }
                } else {
                    die('No se puede leer el fichero que se encuentra en: '
                        . $xml);
                }
            } catch (Exception $exc) {
                die($exc->getMessage());
            }
        }
    }

    private
    function sendMailOld($parametros)
    {
        if (count($parametros->emails) > 0) {
            $mail = new PHPMailer(true);
            //$mail->IsSMTP();
            $remitentemail = 'planificacion@xetid.cu';
            $remitente = "Sistema de Planificación";
            $datosautor
                = $this->integrator->pvd->getPrincipalesDatosPersona(
                $params[] = $parametros->idpersona
            );
            if (isset($datosautor->data[0])) {
                $autor
                    = ($datosautor->data[0]['nombreapellidos']);
            } else {
                $usuarioautor = $this->integrator->seguridad->nombreUsuario(
                    $parametros->idusuariocrea
                );
                $autor = $usuarioautor;
            }
            $mail->SMTPDebug = 1;
            $mail->SMTPSecure = "ssl";
            $mail->CharSet = 'UTF-8';
            $mail->SMTPAuth = true;
            $mail->Host = "correo.xetid.cu";
            $mail->Port = 465;
            $mail->Username = 'planificacion';
            $mail->Password = 'planificacion123';
            $mail->Mailer = "smtp";
            $mail->Timeout = 50;

            //====== DE QUIEN ES ========
            $mail->From = $remitentemail;
            $mail->FromName = $remitente;
            //====== PARA QUIEN =========
            $mail->Subject = $parametros->asunto;

            foreach ($parametros->emails as $dir) {
                $mail->AddAddress($dir, $dir);
            }
            //Cuerpo del mensaje
            if ($parametros->asunto == 'Actividad Modificada') {
                $postaccion = 'modificada';

                $bodyDetallesMod = $this->compararUltimaModificacion(
                    $parametros
                );
                if ($bodyDetallesMod != '') {
                    $bodyDetallesMod
                        = 'Detalles de los valores que fueron modificados:<br><br>'
                        . $bodyDetallesMod;
                }
            } else {
                $postaccion = 'adicionada';
            }
            $body
                = '<p style= "font-family: arial,helvetica,sans-serif; font-size: 12pt;">'
                . "La siguiente actividad ha sido $postaccion:<br><br>";
            $body .= '<b>CAR: </b>' . $parametros->idelemento . '<br>
                 <b>Denominaci&oacute;n: </b>' . $parametros->denelemento . '<br>
                  <b>Descripci&oacute;n: </b>' . $parametros->descelemento . '<br>
                  <b>Fecha de inicio: </b>' . $parametros->fechainicio . '<br>
                  <b>Fecha de fin: </b>' . $parametros->fechafin . '<br>
                  <b>Hora de inicio: </b>' . $parametros->horainicio . '<br>
                  <b>Hora de fin: </b>' . $parametros->horafin . '<br>
                  <b>Lugar: </b>' . $parametros->lugar . '<br>
                  <b>Autor: </b>' . $autor . '<br>
                  <br>';
            $body .= $bodyDetallesMod;
            $body .= " <br><i>No responder este correo. Enviado desde el Sistema de Planificaci&oacute;n.</i></p>";
            $mail->Body = $body;
            $mail->IsHTML(true);
            try {
                ob_start();
                $mail->Send();
                $mail->SmtpClose();
            } catch (phpmailerException $e) {
                ob_get_clean();
                $mail->SmtpClose();
                //die($e->getMessage());
            }
            return true;
        }
    }

    /**
     * Funcion para comparar la actividad actual con la modificacion anterior
     */
    public
    function compararUltimaModificacion($parametros)
    {
        $dathistorial = new DatHistorial();
        $actual = $dathistorial->obtenerTuplaMod($parametros);
        $body = '';
        if (isset($actual[0])) {
            $idhistorialact = $actual[0]['idhistorial'];
            $parametros->idhistorial = $idhistorialact;
            $parametros->penultima = true;
            $anterior = $dathistorial->obtenerTuplaMod($parametros);
            if (isset($anterior[0])) {
                $actual = $actual[0];
                $anterior = $anterior [0];
                $diferencia = array_diff_assoc($anterior, $actual);
                (isset($diferencia['denelemento'])) ? $body .= '<font color="red"><b>Denominaci&oacute;n: </b>'
                    . $diferencia['denelemento'] . '</font><br>' : null;
                (isset($diferencia['descelemento'])) ? $body .= '<font color="red"><b>Descripci&oacute;n: </b>'
                    . $diferencia['descelemento'] . '</font><br>' : null;
                (isset($diferencia['fechainicio'])) ? $body .= '<font color="red"><b>Fecha de inicio: </b>'
                    . $diferencia['fechainicio'] . '</font><br>' : null;
                (isset($diferencia['fechafin'])) ? $body .= '<font color="red"><b>Fecha de fin: </b>'
                    . $diferencia['fechafin']
                    . '</font><br>' : null;
                (isset($diferencia['horainicio'])) ? $body .= '<font color="red"><b>Hora de inicio: </b>'
                    . $diferencia['horainicio'] . '</font><br>' : null;
                (isset($diferencia['horafin'])) ? $body .= '<font color="red"><b>Hora de fin: </b>'
                    . $diferencia['horafin'] . '</font><br>' : null;
                (isset($diferencia['lugar'])) ? $body .= '<font color="red"><b>Lugar: </b>'
                    . $diferencia['lugar'] . '</font><br>' : null;
                if (isset($diferencia['idautor'])) {
                    $datosautor
                        = $this->integrator->pvd->getPrincipalesDatosPersona(
                        $params[] = $diferencia['idautor']
                    );
                    if ($datosautor->data[0] != '') {
                        $autor
                            = ($datosautor->data[0]['nombreapellidos']);
                    } else {
                        $usuarioautor
                            = $this->integrator->seguridad->nombreUsuario(
                            $parametros->idusuariocrea
                        );
                        $autor = $usuarioautor;
                    }
                    $body .= '<font color="red"><b>Autor: </b>'
                        . $autor . '</font><br>';
                }
            }
        }
        return $body;
    }

    /**
     * Funcion para eliminar las actividades
     */
    public
    function EliminarActividades($arrayidactividades, $idusuariosession, $idtipoelemento
    )
    {
      $objElemElem = new DatElementosDatElementos();
        foreach ($arrayidactividades as $idactividad) {
            //antes de eliminar busco su padre para actualizar sus valores
            //$actPadre = $objElemElem->obtenerPadreInmediato($idactividad);
            //antes de eliminar busco los objetivos relacionados a la actividad
            $arrayobjvs = $objElemElem->obtenerElemenRelacionados(
                $idactividad, 1
            );

            //antes de eliminar busco los planes relacionados a la actividad
            $arrayPlanesE = $objElemElem->obtenerElemenRelacionados(
                $idactividad, 0
            );
            $arrayPlanesA = $objElemElem->obtenerPlanRelacionadoARC(
                $idactividad
            );
            $arrayPlanes = array_merge($arrayPlanesE, $arrayPlanesA);
            $noeliminados = 0;
            $respuesta = 1;

            try{
              $objelemento = Doctrine::getTable('DatElementos')->find(
                $idactividad
              );
            }catch (Exception $exception){
              print_r($exception->getMessage());
            }


            if (isset($objelemento->idelemento)) {
                $arrayrepeticiones
                    = $objElemElem->ObtenerRepeticiones(
                    $idactividad
                );
                $objelemnom = new DatElementosNomNomencladorModel();
                $objelemnom->EliminarElemNom($objelemento->idelemento);
                if (isset($arrayrepeticiones[0])) {
                    foreach ($arrayrepeticiones as $repeticion) {
                        $objelementorep = Doctrine::getTable('DatElementos')
                            ->find($repeticion['idelementohijo']);
                        if (isset($objelementorep->idelemento)) {
                            $objelementorep->delete();
                        }
                    }
                }

                //obtengo y elimino las asignaciones
                $this->EliminarReasignaciones($objelemento, $idusuariosession);
                $objcmpelementosmodel = new CmpgestionarelementoModel();
                $datelementosDatElementos = new DatElementosDatElementos();
                foreach ($arrayidactividades as $idactividad) {
                    $descendencia
                        = $datelementosDatElementos->BuscarDescendenciaDelElemento(
                    //  $idactividad, array(0 => array('idtipoelemento' => 3)),
                        $idactividad, array(0 => array('idtipoelemento' => $idtipoelemento)), array(0 => array('origen' => 0)), $idusuariosession
                    );
                    $descendencia[] = $idactividad;
                    $objcmpelementosmodel->EliminarElementos($descendencia);
                    if (count($descendencia) > 1) {
                        $noeliminados += count($descendencia);
                    }
                }
            } else {
                $noeliminados++;
            }
            //Despues de eliminar actualizo a los padres de los eliminados
            /* if (isset($actPadre[0])) {
              self::actualizarMiPorciento($actPadre[0]);
              } */
            /* actualizo los valores de los objetivos con los
              que estaba relacionada la actividad (% de cumplimiento) */

            if (isset($arrayobjvs[0])) {//este es el k esta dando el error
                self::actualizarObjvsRelacionados($arrayobjvs);
            }
            //print_r('hxcghj');die;
            /* actualizo el % de cumplimiento de los planes con los
             * que estaba relacionada la actividad */
            if (isset($arrayPlanes[0])) {
                CmpgestionarplanModel::actualizarPorcientoPlan($arrayPlanes);
            }
        }

        if ($noeliminados > 0 && $noeliminados == count($arrayidactividades)) {
            $respuesta = 0;
        }

        DatElementosDocumentoModel::EliminarDocumentoByIdElemento(
            $arrayidactividades
        );
        return $respuesta;
    }

    /**
     * Funcion de trabajo con fecha para el plan
     */
    function adddate($fecha)
    {
        $data = explode("/", $fecha);
        $date = new DateTime();
        $date->setDate($data[2], $data[1], $data[0]);
        $format = $this->global->Formato->fecha;
        $day = $date->format("$format");
        return $day;
    }

    /**
     * Funcion para eliminar las repeticiones de una determinada actividad
     */
    public
    function EliminarRepeticiones($idactividad, $arrayrepeticiones)
    {
        $existeactividad = Doctrine::getTable('DatActividades')->find(
            $idactividad
        );
        if (isset($existeactividad->idactividad)) {
            if (isset($arrayrepeticiones[0])) {
                $contrepnoexistentes = 0;
                foreach ($arrayrepeticiones as $key => $repeticion) {
                    $objrepeticion = Doctrine::getTable('DatElementos')->find(
                        $repeticion->idactividad
                    );
                    if (isset($objrepeticion->idelemento)) {
                        $objrepeticion->delete();
                    } else {
                        $contrepnoexistentes++;
                    }
                }
                $totalrepeticiones = $key + 1;
                $respuesta = 1; //relaciones eliminadas correctamentes
                if ($contrepnoexistentes > 0) {
                    if ($totalrepeticiones == 1) {
                        $respuesta = 3;
                    }//no existe la repeticion
                }
            }
        } else {
            $respuesta = 0;
        }
        return $respuesta;
    }

    /**
     * Funcion para eliminar las Dependencia de una actividad
     */
    public
    function eliminarDependencia($parametros)
    {
        $objelemelemmodel = Doctrine::getTable(
            'DatElementosDatElementos'
        )->findByDql(
            "idelementopadre = '$parametros->idelementopadre'
                                AND idelementohijo = '$parametros->idelementohijo' 
                                    AND origen = '$parametros->origen' "
        );
        if (isset($objelemelemmodel[0]->idelementopadre) && $objelemelemmodel[0]->idelementopadre != ''
        ) {
            $objelemelemmodel->delete();
            $respuesta = 1;
        } else {
            $respuesta = 0;
        }
        return $respuesta;
    }

    /**
     * Funcion para modificar las fechas de una actividad
     */
    public
    function modificarFechaGantt($parametros)
    {
        $objAct = Doctrine::getTable('DatActividades')->find(
            $parametros->idactividad
        );
        $objElemento = Doctrine::getTable('DatElementos')->find(
            $parametros->idactividad
        );

        // *** Las dependencias TOTALES de la actividad
        $arregloPadresT = array();
        $arregloHijosT = array();
        // *** Las dependencias NO totales de la actividad
        $arregloPadres = array();
        $arregloHijos = array();
        $noPuede = 0;
        // *** Si existe la actividad
        if (isset($objAct->idactividad) && $objAct->idactividad != '') {
            self::buscarInferioresGantt(
                $objAct->idactividad, $arregloHijosT, '=', 6
            );
            self::buscarSuperioresGantt(
                $objAct->idactividad, $arregloPadresT, '=', 6
            );
            // *** Las dependencias NO totales de la actividad
            self::buscarInferioresGantt(
                $objAct->idactividad, $arregloHijos, '>', 6
            );
            self::buscarSuperioresGantt(
                $objAct->idactividad, $arregloPadres, '>', 6
            );
            // *** Si tiene dependencias
            if ($arregloHijosT[0] || $arregloPadresT[0] || $arregloHijos[0] || $arregloPadres[0]
            ) {
                // **** Para las dependencias totales *****
                //para los hijos que dependen totalmente
                if ($arregloHijosT[0]) {
                    foreach ($arregloHijosT as $hijoT) {
                        $objHijoT = Doctrine::getTable('DatActividades')->find(
                            $hijoT
                        );
                        $dias = self::dias_transcurridos(
                            $parametros->ffinact, $objHijoT->fechainicio
                        );
                        if ($dias > 0 && $parametros->efecto == 1) {
                            $paramsHijo->ffinact = self::correrFecha(
                                $objHijoT->fechafin, $dias
                            );
                            $paramsHijo->finiact = $parametros->ffinact;
                            $paramsHijo->idactividad = $hijoT;
                            $paramsHijo->efecto = 1;
                            $paramsHijo->idusuariocrea
                                = $parametros->idusuariocrea;
                            $paramsHijo->gantt = 1;
                            self::modificarFechaGantt($paramsHijo);
                        } else {
                            if ($dias > 0 && $parametros->efecto == 0) {
                                $noPuede++;
                                $respuesta = 2; //No se puede modificar
                            }
                        }/* if ($dias <= 0) Se puede modificar */
                    }
                }
                //para los padres de los que depende totalmente
                if ($arregloPadresT[0]) {
                    foreach ($arregloPadresT as $padreT) {
                        $objPadreT = Doctrine::getTable('DatActividades')->find(
                            $padreT
                        );
                        $dias = self::dias_transcurridos(
                            $objPadreT->fechafin, $parametros->finiact
                        );
                        if ($dias > 0 && $parametros->efecto == 1) {
                            $paramsPadre->ffinact = $parametros->finiact;
                            $paramsPadre->finiact = self::correrFecha(
                                $objPadreT->fechainicio, -$dias
                            );
                            $paramsPadre->idactividad = $padreT;
                            $paramsPadre->efecto = 1;
                            $paramsPadre->idusuariocrea
                                = $parametros->idusuariocrea;
                            $paramsPadre->gantt = 1;
                            self::modificarFechaGantt($paramsPadre);
                        } else {
                            if ($dias > 0 && $parametros->efecto == 0) {
                                $noPuede++;
                                $respuesta = 2; //No se puede modificar
                            }
                        }/* if ($dias <= 0) Se puede modificar */
                    }
                }
                // *** Para las dependencias NO Totales ***
                //para los hijos que dependen NO totalmente
                if ($arregloHijos[0]) {
                    foreach ($arregloHijos as $hijo) {
                        $objHijo = Doctrine::getTable('DatActividades')->find(
                            $hijo
                        );
                        $dias = self::dias_transcurridos(
                            $parametros->finiact, $objHijo->fechainicio
                        );
                        if ($dias > 0 && $parametros->efecto == 1) {
                            $paramsHijo->ffinact = self::correrFecha(
                                $objHijo->fechafin, $dias
                            );
                            $paramsHijo->finiact = $parametros->finiact;
                            $paramsHijo->idactividad = $hijo;
                            $paramsHijo->efecto = 1;
                            $paramsHijo->idusuariocrea
                                = $parametros->idusuariocrea;
                            $paramsHijo->gantt = 1;
                            self::modificarFechaGantt($paramsHijo);
                        } else {
                            if ($dias > 0 && $parametros->efecto == 0) {
                                $noPuede++;
                                $respuesta = 2; //No se puede modificar
                            }
                        }/* if ($dias <= 0) Se puede modificar */
                    }
                }
                //para los padres de los que depende NO totalmente
                if ($arregloPadres[0]) {
                    foreach ($arregloPadres as $padre) {
                        $objPadre = Doctrine::getTable('DatActividades')->find(
                            $padre
                        );
                        $dias = self::dias_transcurridos(
                            $objPadre->fechainicio, $parametros->finiact
                        );
                        if ($dias > 0 && $parametros->efecto == 1) {
                            $paramsPadre->finiact = $parametros->finiact;
                            $paramsPadre->ffinact = self::correrFecha(
                                $objPadre->fechafin, -$dias
                            );
                            $paramsPadre->idactividad = $padre;
                            $paramsPadre->efecto = 1;
                            $paramsPadre->idusuariocrea
                                = $parametros->idusuariocrea;
                            $paramsPadre->gantt = 1;
                            self::modificarFechaGantt($paramsPadre);
                        } else {
                            if ($dias > 0 && $parametros->efecto == 0) {
                                $noPuede++;
                                $respuesta = 2; //No se puede modificar
                            }
                        }/* if ($dias <= 0) Se puede modificar */
                    }
                }
                if (($parametros->efecto == 0 && $noPuede == 0) || $parametros->efecto == 1
                ) {
                    $objAct->fechainicio = $parametros->finiact;
                    $objAct->fechafin = $parametros->ffinact;
                    $objAct->save();
                    $respuesta = 1;
                } else {
                    $respuesta = 2; //No se puede modificar la actividad
                }
            } else {//Como no tiene dependencias se puede modificar
                $objAct->fechainicio = $parametros->finiact;
                $objAct->fechafin = $parametros->ffinact;
                $objAct->save();
                $respuesta = 1;
            }
            //Guardar en Historial
            if ($respuesta = 1 && isset($parametros->gantt)) {
                $parametros->fechainicio = $objAct->fechainicio;
                $parametros->fechafin = $objAct->fechafin;
                $parametros->horainicio = $objAct->horainicio;
                $parametros->horafin = $objAct->horafin;
                $parametros->denelemento = $objElemento->denelemento;
                $parametros->descelemento = $objElemento->descelemento;
                $parametros->dirigente = $objElemento->dirigente;
                $parametros->gradocumplimiento
                    = $objElemento->gradocumplimiento;
                $parametros->participante = $objElemento->participante;

                $arrayinvol = DatInvolucrados::involucrados(
                    $objAct->idactividad
                );
                $arrayinvolucrados = array();
                foreach ($arrayinvol as $involucrado) {
                    $arrayinvolucrados[] = $involucrado['idusuario'];
                }
                $involucradoshisto = implode(',', $arrayinvolucrados);

                $objcmpgestionaractividadesmodel
                    = new CmpgestionaractividadesModel();
                $objcambiohorario
                    = $objcmpgestionaractividadesmodel->CambioHorario(
                    $parametros
                );
                $accion = 2;
                $idelemento = $parametros->idactividad;
                $idtipoelemento = 3;
                $idautor = $parametros->idusuariocrea;
                $fecha = date('d/m/Y H:i:s');
                $objNotificacion = new CmpnotificacionesModel();
                $objNotificacion->generarNotificacion(
                    $accion, $idelemento, $idtipoelemento, $idautor, $fecha, $objcambiohorario, $parametros, $involucradoshisto
                );
            }
        } else {
            $respuesta = 0; //ya no se encuentra en los registros
        }
        return $respuesta;
    }

    public
    function AdicionarRepeticionesActividad(
        $arrayrelaciones, $elemento, $actividad, $arrayrepeticiones, $arrayinvolucrados, $categoriaactividad, $tipoactividad, $estadocumplimiento, $esprincipal, $idautorrelacion
    )
    {
        if (isset($arrayrepeticiones[0])) {
            foreach ($arrayrepeticiones as $repeticion) {
                //se crea el objeto 'elemento' y se registra
                $objCmpgestionarelementomodel = new CmpgestionarelementoModel();
                $datelemento = $objCmpgestionarelementomodel->AdicionarElemento(
                    $elemento->denelemento, $elemento->descelemento, $elemento->gradocumplimiento, $elemento->idtipoelemento, $activo = 1, $estadocumplimiento, $elemento->idestadoaprob, $elemento->idusuariocrea, $elemento->dirigente, $elemento->participante
                );
                //se crea el objeto 'nomenclador-elemento' y se registra
                $objelemnom = new DatElementosNomNomencladorModel();
                if ($categoriaactividad) {
                    $elemnomcateg = $objelemnom->AdicionarRelacionNomElem(
                        $datelemento, $categoriaactividad, $tiponomenclador = 2
                    );
                }
                if ($tipoactividad) {
                    $elemnomtipo = $objelemnom->AdicionarRelacionNomElem(
                        $datelemento, $tipoactividad, $tiponomenclador = 3
                    );
                }
                $horainicio = $repeticion->hora;
                $horafin = $repeticion->horafin;
                $lugar = $repeticion->lugar;
                //se relacionan los involucrados al elemento o actividad
                if ($repeticion->tiporepeticion == 1) {
                    $horainicio = $actividad->horainicio;
                    $horafin = $actividad->horafin;
                    $lugar = $actividad->lugar;
                    $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
                        $arrayinvolucrados, $datelemento->idelemento, $datelemento->idtipoelemento
                    );
                } else {
                    $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
                        $repeticion->involucrados, $datelemento->idelemento, $datelemento->idtipoelemento
                    );
                }
                //se crea el objeto 'actividad' y se registra
                $datactividad = new DatActividades();
                $datactividad->idactividad = $datelemento->idelemento;
                $datactividad->fechainicio = $repeticion->fechainicio;
                $datactividad->fechafin = $repeticion->fechafin;
                $datactividad->horainicio = $horainicio;
                $datactividad->horafin = $horafin;
                $datactividad->lugar = $lugar;
                $datactividad->tiporepeticion = $repeticion->tiporepeticion;
                $datactividad->esprincipal = $actividad->esprincipal;
                $datactividad->save();

                //se relacionan los elementos relacionados
                $objCmpgestionarelementomodel->RelacionarElementosAElementos(
                    $datelemento->idelemento, $datelemento->idtipoelemento, $arrayrelaciones, $parentrelacidelemento = 'hijo', $datelemento->idusuariocrea
                );

                $objelemelemmodel = new DatElementosDatElementos();
                $objelemelemmodel->idelementopadre = $elemento->idelemento;
                $objelemelemmodel->idelementohijo = $datelemento->idelemento;
                $objelemelemmodel->origen = 4;
                $objelemelemmodel->idautor = $elemento->idusuariocrea;
                $objelemelemmodel->save();
            }
        }
    }

    public
    function ModificarRepeticion(
        $fechainicio, $fechafin, $horainicio, $horafin, $lugar, $tiporepeticion, $idactividad, $idactrepeticion, $arrayinvolucrados, $arrayinvolucradoseliminar
    )
    {
        $objactividad = Doctrine::getTable('DatActividades')->find(
            $idactividad
        );
        if (isset($objactividad->idactividad)) {
            $objactrepeticion = Doctrine::getTable('DatActividades')->find(
                $idactrepeticion
            );
            if (isset($objactrepeticion->idactividad)) {
                $objactrepeticion->fechainicio = $fechainicio;
                $objactrepeticion->fechafin = $fechafin;
                $objactrepeticion->horainicio = $horainicio;
                $objactrepeticion->horafin = $horafin;
                $objactrepeticion->lugar = $lugar;
                $objactrepeticion->tiporepeticion = $tiporepeticion;
                $objactrepeticion->save();

                $objCmpgestionarelementomodel = new CmpgestionarelementoModel();
                //se relacionan los involucrados al elemento o actividad
                $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
                    $arrayinvolucrados, $objactrepeticion->idactividad, $idtipoelemento = 3
                );
                //se eliminan los involucrados al elemento o actividad
                $objCmpgestionarelementomodel->EliminarUsuariosAElementos(
                    $arrayinvolucradoseliminar, $objactrepeticion->idactividad, $idtipoelemento = 3
                );
                $respuesta = 1;
            } else {
                $respuesta = 3;
            }
        } else {
            $respuesta = 0;
        }
        return $respuesta;
    }

    public
    function ObtenerRepeticionesActividadPaginado(
        $idactividad, $idusuariosession, $limit, $start
    )
    {
        $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
            $idsubsistema = 15, $idusuariosession, $idtipodoc = 3
        );
        $arrayestados = array();
        if (isset($arrayestadosverdoc['data'][0])) {
            foreach ($arrayestadosverdoc['data'] as $key => $estado) {
                $arrayestados[] = $estado['idestado'];
            }
            $arrayestados = implode(',', $arrayestados);
        }

        $arrayactividades = DatElementos::ObtenerRepeticionesPaginado(
            $idactividad, $arrayestados, $limit, $start
        );
        if ($arrayactividades['total'] > 0) {
            foreach ($arrayactividades['resultado'] as $key => $actividad) {
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                $entrada = 1;
                if ($actividad['idusuariocrea'] != $idusuariosession) {
                    $superior = 1;
                    $objelemmodel = new DatElementosModel();
                    $estadoaprobpordefcto
                        = $objelemmodel->ObtenerEstadoAprobPorDefecto(
                        $idsubsistema = 15, $idusuariosession, $idtipodocumento = 3
                    );
                    if ($estadoaprobpordefcto == $actividad['idestadoaprob']) {
                        $entrada = 0;
                    }
                    $permisomodificacion
                        = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                        $idusuariosession, $actividad['idusuariocrea']
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
                if ($entrada == 1) {
                    //verificando que el estado de aprobacion no sea el estado por
                    //defecto para las actividades de otras personas
                    $arrayactividades['resultado'][$key]['identificador']
                        = $actividad['identificador'];
                    $arrayactividades['resultado'][$key]['idactividad']
                        = $actividad['identificador'];
                    $arrayactividades['resultado'][$key]['estadocumplimiento']
                        = $actividad['estadocumplimiento'] . '('
                        . $actividad['gradocumplimiento'] . '%)';
                    $arrayactividades['resultado'][$key]['nombreautor']
                        = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                        $actividad['idusuariocrea'], 'usuario', null
                    );
                    $arrayactividades['resultado'][$key]['idautor']
                        = $actividad['idusuariocrea'];
                    $separador = '-';
                    $arrayactividades['resultado'][$key]['fechainicio']
                        = $actividad['fechai'];
                    $arrayactividades['resultado'][$key]['fechafin']
                        = $actividad['fechaf'];
                    $arrayactividades['resultado'][$key]['hora']
                        = $actividad['hora'];
                    $arrayactividades['resultado'][$key]['horafin']
                        = $actividad['horafin'];
                    $arrayactividades['resultado'][$key]['lugar']
                        = $actividad['lugar'];
                    $arrayactividades['resultado'][$key]['superior']
                        = $superior;
                    $arrayactividades['resultado'][$key]['subordinado']
                        = $subordinado;
                    $arrayactividades['resultado'][$key]['modificar']
                        = $modificar;
                    $arrayactividades['resultado'][$key]['eliminar']
                        = $eliminar;
                    $arrayactividades['resultado'][$key]['tiporepeticion']
                        = $actividad['tiporepeticion'];
                    $objclasificadorinvolmodel = new ClasificadorinvolModel();
                    $arrayactividades['resultado'][$key]['involucrados']
                        = $objclasificadorinvolmodel->MostrarInvolucrados(
                        $actividad['identificador'], $idtipoelemento = 3
                    );
                    $arraydatosmes = $this->ObtenerDatosMes(
                        $actividad['fechai']
                    );
                    $arrayactividades['resultado'][$key]['mes']
                        = $arraydatosmes['nombremes'];
                    $arrayactividades['resultado'][$key]['numeroMes']
                        = $arraydatosmes['numeromes'];
                }
            }
        }
        return $arrayactividades;
    }

    public
    function ObtenerRepeticionesActividad(
        $idactividad, $idusuariosession
    )
    {
        $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
            $idsubsistema = 15, $idusuariosession, $idtipodoc = 3
        );
        $arrayestados = array();
        if (isset($arrayestadosverdoc['data'][0])) {
            foreach ($arrayestadosverdoc['data'] as $key => $estado) {
                $arrayestados[]['idestado'] = $estado['idestado'];
            }
        }
        $arrayactiv = DatElementos::ObtenerRepeticiones(
            $idactividad, $arrayestados
        );
        $arrayact = array();
        if (isset($arrayactiv[0]['idelemento'])) {
            foreach ($arrayactiv as $key => $act) {
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                $entrada = 1;
                if ($act['idusuariocrea'] != $idusuariosession) {
                    $superior = 1;
                    $objelemmodel = new DatElementosModel();
                    $estadoaprobpordefcto
                        = $objelemmodel->ObtenerEstadoAprobPorDefecto(
                        $idsubsistema = 15, $idusuariosession, $idtipodocumento = 3
                    );
                    if ($estadoaprobpordefcto == $act['idestadoaprob']) {
                        $entrada = 0;
                    }
                    $permisomodificacion
                        = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                        $idusuariosession, $act['idusuariocrea']
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
                if ($entrada == 1) {
                    //verificando que el estado de aprobacion no sea el estado por
                    //defecto para las actividades de otras personas
                    $arrayact[$key]['identificador'] = $act['identificador'];
                    $arrayact[$key]['idactividad'] = $act['identificador'];
                    $arrayact[$key]['estadocumplimiento']
                        = $act['estadocumplimiento'] . '('
                        . $act['gradocumplimiento'] . '%)';
                    $arrayact[$key]['nombreautor']
                        = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                        $act['idusuariocrea'], 'usuario', null
                    );
                    $arrayact[$key]['idautor'] = $act['idusuariocrea'];
                    $separador = '-';
                    $fechainicio = $act['fechai'];
                    $fechaI = $this->ConvertirFecha($fechainicio, $separador);
                    $fechafin = $act['fechaf'];
                    $fechaF = $this->ConvertirFecha($fechafin, $separador);
                    $arrayact[$key]['fechainicio'] = $fechaI;
                    $arrayact[$key]['fechafin'] = $fechaF;
                    $arrayact[$key]['hora'] = $act['hora'];
                    $arrayact[$key]['horafin'] = $act['horafin'];
                    $arrayact[$key]['lugar'] = $act['lugar'];
                    $arrayact[$key]['superior'] = $superior;
                    $arrayact[$key]['subordinado'] = $subordinado;
                    $arrayact[$key]['modificar'] = $modificar;
                    $arrayact[$key]['eliminar'] = $eliminar;
                    $arrayact[$key]['tiporepeticion'] = $act['tiporepeticion'];
                    //$objelemmodel = new DatElementosDatInvolucradosModel();
                    $objclasificadorinvolmodel = new ClasificadorinvolModel();
                    $arrayact[$key]['involucrados']
                        = $objclasificadorinvolmodel->MostrarInvolucrados(
                        $act['identificador'], $idtipoelemento = 3
                    );
                    $arraydatosmes = $this->ObtenerDatosMes($act['fechai']);
                    $arrayact[$key]['mes'] = $arraydatosmes['nombremes'];
                    $arrayact[$key]['numeroMes'] = $arraydatosmes['numeromes'];
                }
            }
        }
        return $arrayact;
    }

    public
    function ConvertirFecha($fecha, $tiposeparador)
    {
        switch ($tiposeparador) {
            case 'T':
                $fecha = explode('T', $fecha);
                list($annoinicio, $mesinicio, $diainicio) = explode(
                    '-', $fecha[0]
                );
                $numfecha = mktime(
                    0, 0, 0, $mesinicio, $diainicio, $annoinicio
                );
                $fechainstancia = date('d-m-Y', $numfecha);
                break;
            case '-':
                list($annoinicio, $mesinicio, $diainicio) = explode(
                    '-', $fecha
                );
                $numfecha = mktime(
                    0, 0, 0, $mesinicio, $diainicio, $annoinicio
                );
                $fechainstancia = date('d / m / Y', $numfecha);
                break;
        }
        return $fechainstancia;
    }

    public
    function ObtenerDatosMes($fecha)
    {
        $fecha = explode('/', $fecha);
        $numeromes = $fecha[1] * 1;
        $arraydatosmes['numeromes'] = $numeromes;
        switch ($numeromes) {
            case 1:
                $nombremes = 'Enero';
                break;
            case 2:
                $nombremes = 'Febrero';
                break;
            case 3:
                $nombremes = 'Marzo';
                break;
            case 4:
                $nombremes = 'Abril';
                break;
            case 5:
                $nombremes = 'Mayo';
                break;
            case 6:
                $nombremes = 'Junio';
                break;
            case 7:
                $nombremes = 'Julio';
                break;
            case 8:
                $nombremes = 'Agosto';
                break;
            case 9:
                $nombremes = 'Septiembre';
                break;
            case 10:
                $nombremes = 'Octubre';
                break;
            case 11:
                $nombremes = 'Noviembre';
                break;
            case 12:
                $nombremes = 'Diciembre';
                break;
        }
        $arraydatosmes['nombremes'] = $nombremes;
        return $arraydatosmes;
    }

    public
    function ActualizarReasignaciones(
        $objelemento, $objact, $idcategoria, $idtipo
    )
    {
        $tienereasignaciones
            = DatElementosDatElementos::ObtenerReasignacionesDadoActividad(
            $objelemento->idelemento
        );
        if (isset($tienereasignaciones[0])) {
            foreach ($tienereasignaciones as $key => $reasignacion) {
                $existe = 0;
                $objelemreasig = Doctrine::getTable('DatElementos')->find(
                    $reasignacion['idelementohijo']
                );
                if (isset($objelemreasig->idelemento)) {
                    $existe = 1;
                    $objelemreasig->denelemento = $objelemento->denelemento;
                    $objelemreasig->descelemento = $objelemento->descelemento;
                    $objelemreasig->participante = $objelemento->participante;
                    $objelemreasig->dirigente = $objelemento->dirigente;
                    $objelemreasig->save();
                    //actualizo los  nomencladores relacionados a la actividad
                    $objelemnomreasig = new DatElementosNomNomencladorModel();
                    if ($idcategoria) {
                        $elemnomcategreasig
                            = $objelemnomreasig->ModificarRelacionNomElem(
                            $objelemreasig, $idcategoria, $tiponomenclador = 2
                        );
                    }
                    if ($idtipo) {
                        $elemnomtiporeasig
                            = $objelemnomreasig->ModificarRelacionNomElem(
                            $objelemreasig, $idtipo, $tiponomenclador = 3
                        );
                    }
                }
                $objactreasig = Doctrine::getTable('DatActividades')->find(
                    $reasignacion['idelementohijo']
                );
                if (isset($objactreasig->idactividad)) {
                    $existe = 1;
                    $objactreasig->fechainicio = $objact->fechainicio;
                    $objactreasig->fechafin = $objact->fechafin;
                    $objactreasig->lugar = $objact->lugar;
                    $objactreasig->horainicio = $objact->horainicio;
                    $objactreasig->horafin = $objact->horafin;
                    $objactreasig->esprincipal = $objact->esprincipal;
                    $objactreasig->save();
                }
                if ($existe == 1) {
                    $this->ActualizarReasignaciones(
                        $objelemreasig, $objactreasig, $idcategoria, $idtipo
                    );
                }
            }
        }
    }

    public
    function EliminarReasignaciones($objelemento, $idusuariosession)
    {
        $tienereasignaciones
            = DatElementosDatElementos::ObtenerReasignacionesDadoActividad(
            $objelemento->idelemento
        );
        if (isset($tienereasignaciones[0])) {
            foreach ($tienereasignaciones as $key => $reasignacion) {
                $arrayidactividades[] = $reasignacion['idelementohijo'];
            }
            $this->EliminarActividades($arrayidactividades, $idusuariosession);
        }
    }

    public
    function ReorganizarSubActividades($datos)
    {
        $reordenado = 0;
        if (isset($datos->arraysubactividades[0])) {
            foreach ($datos->arraysubactividades as $key => $subactividad) {
                $objelemento = Doctrine::getTable('DatElementos')->find(
                    $subactividad->idelemento
                );
                if (isset($objelemento->idelemento)) {
                    if (isset($subactividad->_parent)) {
                        $idelementopadre = $subactividad->_parent;
                        $idelementohijo = $subactividad->idelemento;
                        $origen = 0;
                        $arrayobjrelacion = Doctrine::getTable(
                            'DatElementosDatElementos'
                        )->findByDql(
                            "idelementopadre = '$idelementopadre'
                                AND idelementohijo = '$idelementohijo' 
                                    AND origen = '$origen' "
                        );
                        if (isset($arrayobjrelacion[0]->idelementopadre) && $arrayobjrelacion[0]->idelementopadre != ''
                        ) {
                            $arrayobjrelacion->delete();
                        }
                    } else {
                        $origen = 0;
                        $idelementohijo = $subactividad->idelemento;
                        //$objelemento->delete();
                    }
                    $objrelacion = new DatElementosDatElementos();
                    $objrelacion->idelementopadre
                        = $datos->arrayactividadespadres[0]->idelemento;
                    $objrelacion->idelementohijo = $idelementohijo;
                    $objrelacion->origen = $origen;
                    $objrelacion->idautor = $datos->idusuariosession;
                    $objrelacion->save();
                    $reordenado++;
                }
                //actualiza el % de los viejos objs padres
                /* if (isset($subactividad->_parent)) {
                  self::actualizarMiPorciento($subactividad->_parent);
                  } */
            }
        }
        if ($reordenado == 0) {
            $respuesta = 0;
        } else {
            $respuesta = 1;
            //Despues de reorganizar actualizo el % del padre
            /* self::actualizarMiPorciento(
              $datos->arrayactividadespadres[0]->idelemento
              ); */
        }
        return $respuesta;
    }

    public
    function hacerRaizActividad($arrayidactividades)
    {
        $origen = 0;
        foreach ($arrayidactividades as $subactividad) {
            $arrayobjrelacion = Doctrine::getTable(
                'DatElementosDatElementos'
            )->findByDql(
                "idelementohijo = '$subactividad'
                                    AND origen = '$origen' "
            );
            if (isset($arrayobjrelacion[0]->idelementopadre) && $arrayobjrelacion[0]->idelementopadre != ''
            ) {
                $arrayobjrelacion->delete();
                $respuesta = 1;
            } else {
                $respuesta = 0;
            }
        }
        return $respuesta;
    }

    function getFechas($inicio, $fin, $intervalo)
    {
        $_inicio = new DateTime($inicio);
        $_fin = new DateTime($fin);

        $_intervalo = new DateInterval($intervalo);
        $fechas = new DatePeriod($_inicio, $_intervalo, $_fin);

        $ret = array();
        foreach ($fechas as $fecha) {
            $ret[] = $fecha->format('d/m/Y');
        }

        return $ret;
    }

    public
    function obtenerRangoDeFechas(
        $arrayinvolucrados, $fechainicio, $fechafin
    )
    {
        $arrayfechasdesglosadas = array();
        $arrayfechas = DatActividades::obtenerRangoDeFechas(
            $arrayinvolucrados, $fechainicio, $fechafin
        );
        foreach ($arrayfechas as $fecha) {
            $fechainicio = explode('/', $fecha['fechainicio']);
            $fechafin = explode('/', $fecha['fechafin']);
            $fecha['fechainicio']
                = $fechainicio[2] . '-' . $fechainicio[1] . '-'
                . $fechainicio[0];
            $fecha['fechafin']
                = $fechafin[2] . '-' . $fechafin[1] . '-' . $fechafin[0];
            $arrayfechasTemporal = $this->getFechas(
                $fecha['fechainicio'], $fecha['fechafin'] . '00:01', 'P1D'
            );
            $arrayfechasdesglosadas = array_merge(
                $arrayfechasdesglosadas, $arrayfechasTemporal
            );
        }
        return $arrayfechasdesglosadas;
    }

    public
    function verificarConflicto(
        $arrayidinvolucrados, $fechainicio, $fechafin
    )
    {
        $arraydenominvolucrados = array();
        $arraydatoinvolucrado = array();
        $ignorarinvolucrado = false;
        $pos = 0;
        foreach ($arrayidinvolucrados as $key => $idinvolucrado) {
            $arraydatoinvolucrado = DatActividades::verificarConflicto(
                $idinvolucrado, $fechainicio, $fechafin
            );
            if (isset($arraydatoinvolucrado[0])) {
                foreach ($arraydatoinvolucrado as $key => $datoinvolucrado) {
                    $arraydenominvolucrados[$pos]['denomuser']
                        = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                        $datoinvolucrado['idusuario'], 'usuario', null
                    );
                    $arraydenominvolucrados[$pos]['denomactividad']
                        = $datoinvolucrado['denominacion'];
                    $arraydenominvolucrados[$pos]['fechainicio']
                        = $datoinvolucrado['fechainicio'];
                    $arraydenominvolucrados[$pos]['horainicio']
                        = $datoinvolucrado['horainicio'];
                    $arraydenominvolucrados[$pos]['fechafin']
                        = $datoinvolucrado['fechafin'];
                    $arraydenominvolucrados[$pos]['horafin']
                        = $datoinvolucrado['horafin'];
                    $arraydenominvolucrados[$pos]['car']
                        = $datoinvolucrado['idactividad'];
                    $arraydenominvolucrados[$pos]['idusuario']
                        = $datoinvolucrado['idusuario'];
                    $pos++;
                }
            }
        }
        return $arraydenominvolucrados;
    }

    public
    function BuscarSuperiores(
        $idelementohijo, &$resultado, $comparacion = '>= ', $origen = 6
    )
    {
        $existerelacion = Doctrine::getTable('DatElementosDatElementos')
            ->findByDql(
                "idelementohijo = '$idelementohijo' AND origen $comparacion $origen"
            );
        if ($existerelacion[0]->idelementopadre != null) {
            $resultado[] = self::BuscarSuperiores(
                $existerelacion[0]->idelementopadre, $resultado
            );
        }
        return $idelementohijo;
    }

    /*
     * Buscar superiores del mismo tipo
     */

    public
    function buscarSuperioresMismo($idelementohijo, &$resultado)
    {
        $existerelacion = Doctrine::getTable('DatElementosDatElementos')
            ->findByDql(
                "idelementohijo = '$idelementohijo' AND (origen = 0 OR origen = 2) "
            );
        if ($existerelacion[0]->idelementopadre != null) {
            $resultado[] = self::buscarSuperioresMismo(
                $existerelacion[0]->idelementopadre, $resultado
            );
        }
        return $idelementohijo;
    }

    /*
     * Buscar inferiores del mismo tipo
     */

    public
    function buscarInferioresMismo($idelementopadre, &$resultado)
    {
        $existerelacion = Doctrine::getTable('DatElementosDatElementos')
            ->findByDql(
                "idelementopadre = '$idelementopadre' AND (origen = 0 OR origen = 2)"
            );
        if ($existerelacion[0]->idelementohijo != null) {
            $resultado[] = self::buscarInferioresMismo(
                $existerelacion[0]->idelementohijo, $resultado
            );
        }
        return $idelementopadre;
    }

    public
    function buscarSuperioresMismoARC($idelemento, &$resultado)
    {
        $existerelacion = Doctrine::getTable('DatArc')
            ->findByDql(
                "idarc = '$idelemento'"
            );
        if ($existerelacion[0]['idarc'] != $existerelacion[0]['idarcp']) {
            $resultado[] = self::buscarSuperioresMismoARC($existerelacion[0]['idarcp'], $resultado);
        }
        return $idelemento;

    }

    public
    function BuscarInferiores(
        $idelementopadre, &$resultado, $comparacion = '>=', $origen = 6
    )
    {
        $existerelacion = Doctrine::getTable('DatElementosDatElementos')
            ->findByDql(
                "idelementopadre = '$idelementopadre' AND origen $comparacion $origen"
            );
        if ($existerelacion[0]->idelementohijo != null) {
            $resultado[] = self::BuscarInferiores(
                $existerelacion[0]->idelementohijo, $resultado, $comparacion, $origen
            );
        }
        return $idelementopadre;
    }

    /*
     * Funcion para buscar todos los hijos inferiores de una actividad de gantt
     */

    public
    function buscarInferioresGantt(
        $idelementopadre, &$resultado, $comparacion = '>=', $origen = 6
    )
    {
        $existerelacion = Doctrine::getTable('DatElementosDatElementos')
            ->findByDql(
                "idelementopadre = '$idelementopadre' AND origen $comparacion $origen"
            );
        if ($existerelacion[0]->idelementohijo != null) {
            foreach ($existerelacion as $relacion) {
                $resultado[] = self::buscarInferioresGantt(
                    $relacion->idelementohijo, $resultado, $comparacion, $origen
                );
            }
        }
        return $idelementopadre;
    }

    /*
     * Funcion para buscar todos los padres superiores de una actividad de gantt
     */

    public
    function buscarSuperioresGantt(
        $idelementohijo, &$resultado, $comparacion = '>= ', $origen = 6
    )
    {
        $existerelacion = Doctrine::getTable('DatElementosDatElementos')
            ->findByDql(
                "idelementohijo = '$idelementohijo' AND origen $comparacion $origen"
            );
        if ($existerelacion[0]->idelementopadre != null) {
            foreach ($existerelacion as $relacion) {
                $resultado[] = self::buscarSuperioresGantt(
                    $relacion->idelementopadre, $resultado, $comparacion, $origen
                );
            }
        }
        return $idelementohijo;
    }

    private
    function EfectoCadena($parametros)
    {
        if ($parametros->enFinicio) {
            $actpadres = array();
            self::BuscarSuperiores($parametros->idactividad, $actpadres, '=');
            if (isset($actpadres[0])) {
                foreach ($actpadres as $actividad) {
                    $objactividad = Doctrine::getTable('DatActividades')->find(
                        $actividad
                    );
                    $objactividad->fechainicio = self::correrFecha(
                        $objactividad->fechainicio, $parametros->diasTranscurridos
                    );
                    $objactividad->fechafin = self::correrFecha(
                        $objactividad->fechafin, $parametros->diasTranscurridos
                    );
                    $objactividad->save();
                }
            }
        } else {
            $actDependientes = array();
            self::BuscarInferiores(
                $parametros->idactividad, $actDependientes, '='
            );
            if (isset($actDependientes[0])) {
                foreach ($actDependientes as $actividad) {
                    $objactividad = Doctrine::getTable('DatActividades')->find(
                        $actividad
                    );
                    $objactividad->fechainicio = self::correrFecha(
                        $objactividad->fechainicio, $parametros->diasTranscurridos
                    );
                    $objactividad->fechafin = self::correrFecha(
                        $objactividad->fechafin, $parametros->diasTranscurridos
                    );
                    $objactividad->save();
                }
            }
        }
    }

    function dias_transcurridos($fechaI, $fechaF)
    {
        $fechaI = explode('/', $fechaI);
        $fechaI = $fechaI[2] . '-' . $fechaI[1] . '-' . $fechaI[0];
        $fechaF = explode('/', $fechaF);
        $fechaF = $fechaF[2] . '-' . $fechaF[1] . '-' . $fechaF[0];
        $dias = (strtotime($fechaI) - strtotime($fechaF)) / 86400;
        $dias = floor($dias);
        return $dias;
    }

    function correrFecha($fechaI, $dias)
    {
        $op = ($dias < 0) ? '-' : '+';
        $fechaI = explode('/', $fechaI);
        $fechaI = $fechaI[2] . '-' . $fechaI[1] . '-' . $fechaI[0];
        $nuevafecha = strtotime($op . abs($dias) . ' day', strtotime($fechaI));
        $nuevafecha = date('d/m/Y', $nuevafecha);
        return $nuevafecha;
    }

    public
    function InsertarAlarma($parametros)
    {

        /*     if ($parametros->iguala != 0 || $parametros->mayorque != 0
          || $parametros->menorque != 0
          ) {
          $objCondicion = new NomComparacion();
          $objCondicion->igual = $parametros->iguala;
          $objCondicion->mayor = $parametros->mayorque;
          $objCondicion->menor = $parametros->menorque;
          $objCondicion->save();
          $parametros->idcomparacion = $objCondicion->idcomparacion;
          } else {
          $parametros->idcomparacion = '';
          } */
        $valora = $parametros->cantdiashoras;
        $parametros->fecha = $this->correrFecha(
            $parametros->fechainicio, $valora
        );

        $resultadofinal = DatActividades::InsertarAlarma($parametros);

        /* $result = $this->pIntegrator->planpdo->SeCumplenCondiciones(
          $parametros->idelemento, $parametros->idcomparacion, $parametros->porciento,
          $parametros->estadocump, $parametros->estadoaprov); */
        return 1;
    }

    public
    function ValidarHora($hora, $valor)
    {
        $hora = explode(':', $hora);
        if (($hora[0] + $valor) < 0 || ($hora[0] + $valor) > 24) {
            return -1;
        } else {
            return ($hora[0] + $valor) . ':' . $hora[1];
        }
    }

    public
    function calcularGradoCumplimiento($parametros)
    {
        $gradocumplimiento = 0;
        $arrayPorcientoRe = array();
        $idelementopadrepadre = null;
        $padreHijos = DatElementosDatElementos::buscarPadreHijos($parametros);
        foreach ($padreHijos as $key => $hijo) {
            $arrayPorcientoRe['suma_pond'] += $hijo['ponderacion'];
            $arrayPorcientoRe['hijos_pond'][$key] = $hijo['ponderacion'];
            $arrayPorcientoRe['idelementoshijo'][$key] = $hijo['hijos'];
            $arrayPorcientoRe['idelementopadre'] = $hijo['idelementopadre'];
            $arrayPorcientoRe['gradocumplimiento_hijo'][$key]
                = $hijo['gradocumplimiento'];
        }
        $arrayPorcientoRe['porciento_pond']
            = 100 / $arrayPorcientoRe['suma_pond'];
        foreach ($arrayPorcientoRe['hijos_pond'] as $keyh => $value) {
            $arrayPorcientoRe['porcientohijo'][$keyh]
                = $value * $arrayPorcientoRe['porciento_pond'];
            DatElementosDatElementos::setPorcientoRepresentaHijo(
                $arrayPorcientoRe['idelementoshijo'][$keyh], $arrayPorcientoRe['porcientohijo'][$keyh]
            );
            $gradocumplimiento
                += ($arrayPorcientoRe['gradocumplimiento_hijo'][$keyh] * $arrayPorcientoRe['porcientohijo'][$keyh]) / 100;
        }
        DatElementos::setGradoCumplimientoPadreAuto(
            $arrayPorcientoRe['idelementopadre'], $gradocumplimiento
        );
        //actualizar el estado de cumplimiento
        $objelemento = Doctrine::getTable('DatElementos')->find(
            $arrayPorcientoRe['idelementopadre']
        );
        if (isset($objelemento->idelemento)) {
            $estadocumplimiento
                = CmpgestionarelementoModel::actualizarEstadoCumplimiento(
                $estadocumplimiento, $gradocumplimiento
            );
            $objelemento->estadocumplimiento = $estadocumplimiento;
            $objelemento->save();
        }

        $idelementopadrepadre->idactividad
            = $arrayPorcientoRe['idelementopadre'];
        $elementosrelacionados
            = DatElementosDatElementos:: buscarElementosRelacionados(
            $idelementopadrepadre
        );
        if (isset($elementosrelacionados[0])) {
            self::actualizarGradoCumpObj($elementosrelacionados);
        }
        $padresPadres = Doctrine::getTable('DatElementosDatElementos')
            ->findByDql(
                "idelementohijo = '$idelementopadrepadre->idactividad'
                    AND (origen = 0 OR origen = 2)"
            );
        if ($padresPadres[0]->idelementopadre != null) {
            $idelementopadrepadre = $padresPadres[0]->idelementopadre;
            $parametros->idactividad = $padresPadres[0]->idelementohijo;
            self::calcularGradoCumplimiento($parametros);
        }
        return $idelementopadrepadre;
    }

    //******************gantt******************
    /*
     * carga el combo de planes de gantt
     */
    public
    function cargarComboPlanes($parametros)
    {
        $utilizacionFT = 0;
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 0
        );
        if (isset($arrayestadosver[0])) {
            $utilizacionFT = 1;
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        $planes = DatActividades::cargarComboPlanes($parametros);
        return $planes;
    }

    public
    function llenarGantt($fecha, $id, $elemento, $padre, $parentlost)
    {
        $gantt = array();
        $gantt['start_date'] = $fecha[0]['fechainicio'];
        $gantt['end_date'] = $fecha[0]['fechafin'];
        $gantt['parent'] = $padre;
        $gantt['id'] = $id;
        $gantt['idelemento'] = (isset($elemento['idelemento'])) ? $elemento['idelemento'] : $elemento['idarc'];
        $gantt['text'] = (isset($elemento['denelemento'])) ? $elemento['denelemento'] : $elemento['denarc'];
        $gantt['progress'] = $elemento['gradocumplimiento'];
        $gantt['open'] = $elemento['open'];
        $gantt['idtipoelemento'] = $elemento['idtipoelemento'];
        $gantt['actualizarporciento'] = $elemento['actualizarporciento'];
        $gantt['escapitulo'] = $elemento['escapitulo'];
        $gantt['parentlost'] = (isset($parentlost)) ? $parentlost : 0;
        return $gantt;
    }

    ////
    /////////
    public
    function actividadesParaGanttPlan($parametros)
    {
        $resultado = array();
        $unir->data = array();
        $final->data = array();
        $utilizacionFT = 0;
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 3//ACT
        );
        if (isset($arrayestadosver[0])) {
            $utilizacionFT = 1;
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 0//PLAN
        );
        if (isset($arrayestadosver[0])) {
            $utilizacionFT = 1;
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 1//OBJ
        );
        if (isset($arrayestadosver[0])) {
            $utilizacionFT = 1;
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        //todos los ementos que se listaran en Gantt
        $parametros->arrayTipos = implode(
            ',', $parametros->arrayTiposElementos
        );
        $elemenGantt = DatActividades::elementosParaGantt($parametros);
        $cont = 0;
        $id = 1;
        //print_r($elemenGantt);die;
        foreach ($elemenGantt->data as $key => $elemento) {
            $idelementopadre = $this->eliminarCorchetesCadena($elemento['idelementopadre']);
            $elemento['idelementopadre'] = $idelementopadre;
            switch ($elemento['idtipoelemento']) {
                case 0://El elemento es un PLAN
                    $fecha = DatActividades::planParaGantt(
                        $elemento['idelemento'], $parametros
                    );
                    if ($elemento['idelemento'] == $parametros->idplan) {
                        if ($fecha[0]) {
                            $planes->data[$cont] = self::llenarGantt(
                                $fecha, $id, $elemento, ''
                            );
                            $cont++;
                            $id++;
                        }
                    }
                    break;
                case 1://El elemento es un OBJETIVO
                    $existePadrePlan = 0;
                    $fecha = DatActividades::objetivoParaGantt(
                        $elemento['idelemento'], $parametros
                    );
                    //si tiene padre plan y tiene padre objetivo
                    if ($elemento['idelementopadre'] != '') {
                        if ($elemento['idelementopadre'] == $parametros->idplan
                        ) {
                            if ($fecha[0]) {
                                $objetivos->data[$cont] = self::llenarGantt(
                                    $fecha, $id, $elemento, $elemento['idelementopadre']
                                );
                                $cont++;
                                $id++;
                            }
                        } else {
                            //Busco si siendo hijo del objetivo sera hijo del plan recursivamente
                            $superiores = array();
                            self::buscarSuperioresMismo(
                                $elemento['idelemento'], $superiores
                            );
                            if (isset($superiores[0])) {
                                foreach ($superiores as $superior) {
                                    $existe
                                        = DatActividades::existePadrePlanDeObj(
                                        $superior, $parametros->idplan
                                    );
                                    if ($existe[0] != '') {
                                        $existePadrePlan = $existe[0];
                                    }
                                }
                            }
                            if ($existePadrePlan != 0) {
                                if ($fecha[0]) {
                                    $objetivos->data[$cont] = self::llenarGantt(
                                        $fecha, $id, $elemento, $elemento['idelementopadre']
                                    );
                                    $cont++;
                                    $id++;
                                }
                            } else {
                                if ($elemento['idplanobj'] == $parametros->idplan
                                ) {
                                    if ($fecha[0]) {
                                        $objetivos->data[$cont]
                                            = self::llenarGantt(
                                            $fecha, $id, $elemento, $elemento['idplanobj']
                                        );
                                        $cont++;
                                        $id++;
                                    }
                                }
                            }
                        }
                    } else {

                        if ($elemento['idplanobj'] == $parametros->idplan) {
                            if ($fecha[0]) {
                                $objetivos->data[$cont] = self::llenarGantt(
                                    $fecha, $id, $elemento, $elemento['idplanobj']
                                );
                                $cont++;
                                $id++;
                            }
                        }
                    }
                    break;
                case 3://El elemento es una ACTIVIDAD
                    $fecha = DatActividades::actividadParaGantt(
                        $elemento['idelemento'], $parametros
                    );
                    //si tiene padre plan y tiene padre actividad o padre objetivo
                    if ($elemento['idelementopadre'] != '') {
                        //Busco el tipoelemento del padre
                        $tipoPadre = DatActividades::tipoElemento(
                            $elemento['idelementopadre']
                        );
                        if ($tipoPadre[0] == 0) { //el padre es plan
                            if ($elemento['idplanact'] != '') {
                                if ($elemento['idplanact'] == $elemento['idelementopadre']
                                ) {
                                    if ($elemento['idelementopadre'] == $parametros->idplan
                                    ) {
                                        if ($fecha[0]) {
                                            $actividades->data[$cont]
                                                = self::llenarGantt(
                                                $fecha, $id, $elemento, $elemento['idelementopadre']
                                            );
                                            $cont++;
                                            $id++;
                                        }
                                    }
                                } else {
                                    if ($elemento['idelementopadre'] == $parametros->idplan
                                    ) {
                                        if ($fecha[0]) {
                                            $actividades->data[$cont]
                                                = self::llenarGantt(
                                                $fecha, $id, $elemento, $elemento['idelementopadre']
                                            );
                                            $cont++;
                                            $id++;
                                        }
                                    } else {
                                        if ($elemento['idplanact'] == $parametros->idplan
                                        ) {
                                            if ($fecha[0]) {
                                                $actividades->data[$cont]
                                                    = self::llenarGantt(
                                                    $fecha, $id, $elemento, $elemento['idplanact']
                                                );
                                                $cont++;
                                                $id++;
                                            }
                                        }
                                    }
                                }
                            } else {
                                if ($elemento['idelementopadre'] == $parametros->idplan
                                ) {
                                    if ($fecha[0]) {
                                        $actividades->data[$cont]
                                            = self::llenarGantt(
                                            $fecha, $id, $elemento, $elemento['idelementopadre']
                                        );
                                        $cont++;
                                        $id++;
                                    }
                                }
                            }
                        } else {
                            if ($tipoPadre[0] == 1) { //el padre es objetivo
                                //Busco si siendo hija del objetivo sera hija del plan recursivamente
                                $superiores = array();
                                $existePadrePlan = 0;
                                self::buscarSuperioresMismo(
                                    $elemento['idelementopadre'], $superiores
                                );
                                $existe = DatActividades::existePadrePlanDeObj(
                                    $elemento['idelementopadre'], $parametros->idplan
                                );
                                $existePadrePlan = $existe[0];
                                if ($existePadrePlan == 0) {
                                    if (isset($superiores[0])) {
                                        foreach ($superiores as $superior) {
                                            $existe
                                                = DatActividades::existePadrePlanDeObj(
                                                $superior, $parametros->idplan
                                            );
                                            if ($existe[0] != '') {
                                                $existePadrePlan = $existe[0];
                                            }
                                        }
                                    }
                                }
                                if ($existePadrePlan != 0) {
                                    if ($fecha[0]) {
                                        $actividades->data[$cont]
                                            = self::llenarGantt(
                                            $fecha, $id, $elemento, $elemento['idelementopadre']
                                        );
                                        $cont++;
                                        $id++;
                                    }
                                }
                            } else {
                                if ($tipoPadre[0] == 3) { //actividad
                                    //Busco si siendo hija de la actividad sera hija del plan recursivamente
                                    $superiores = array();
                                    $existePadrePlan = 0;
                                    self::buscarSuperioresGantt(
                                        $elemento['idelemento'], $superiores, '<', 4
                                    );
                                    if (isset($superiores[0])) {
                                        foreach ($superiores as $superior) {
                                            $tipoPadre
                                                = DatActividades::tipoElemento(
                                                $superior
                                            );
                                            if ($tipoPadre[0] == 3) {//act
                                                $existe
                                                    = DatActividades::existePadrePlanDeAct(
                                                    $superior, $parametros->idplan
                                                );
                                                if ($existe[0] == '') {
                                                    $existe
                                                        = DatActividades::existePadrePlanDeActE(
                                                        $superior, $parametros->idplan
                                                    );
                                                }
                                                if ($existe[0] != '') {
                                                    $existePadrePlan
                                                        = $existe[0];
                                                }
                                            } else {
                                                if ($tipoPadre[0] == 1) {//obj
                                                    $existe
                                                        = DatActividades::existePadrePlanDeObj(
                                                        $superior, $parametros->idplan
                                                    );
                                                    if ($existe[0] != '') {
                                                        $existePadrePlan
                                                            = $existe[0];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if ($existePadrePlan != 0) {
                                        if ($fecha[0]) {
                                            $actividades->data[$cont]
                                                = self::llenarGantt(
                                                $fecha, $id, $elemento, $elemento['idelementopadre']
                                            );
                                            $cont++;
                                            $id++;
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        if ($elemento['idplanact'] == $parametros->idplan) {
                            if ($fecha[0]) {
                                $actividades->data[$cont] = self::llenarGantt(
                                    $fecha, $id, $elemento, $elemento['idplanact']
                                );
                                $cont++;
                                $id++;
                            }
                        }
                    }
                    break;
            }
        }
        //Organizar los elementos
        if (isset($planes->data) && isset($objetivos->data)) {
            $unir->data = array_merge($planes->data, $objetivos->data);
        } elseif (isset($planes->data) && !isset($objetivos->data)) {
            $unir->data = $planes->data;
        } elseif (!isset($planes->data) && isset($objetivos->data)) {
            $unir->data = $objetivos->data;
        } else {
            $unir->data = '';
        }
        if ($unir->data != '' && isset($actividades->data)) {
            $final->data = array_merge($unir->data, $actividades->data);
        } elseif ($unir->data != '' && !isset($actividades->data)) {
            $final->data = $unir->data;
        } elseif ($unir->data == '' && isset($actividades->data)) {
            $final->data = $actividades->data;
        } else {
            $final->data = '';
        }
        //Poner el nuevo id del padre
        if ($final->data != '') {
            foreach ($final->data as $key => $elemento) {
                if ($elemento['parent'] != '') {
                    $cont = 0;
                    for ($i = 0; $i < count($final->data); $i++) {
                        if ($elemento['parent'] == $final->data[$i]['idelemento']
                        ) {
                            $final->data[$key]['parent']
                                = $final->data[$i]['id'];
                            $cont++;
                        }
                    }
                    if ($cont == 0) {
                        $final->data[$key]['parent'] = '';
                    }
                }
            }
        }
        //Escoger la mayor y la menor fecha de todos los elementos
        $resultP = DatActividades::planesParaGantt($parametros);
        $resultO = DatActividades::objetivosParaGantt($parametros);
        $resultA = DatActividades::ActividadesParaGantt($parametros);
        // *** fechas
        $resultT->fechas = array_merge($resultP->fechas, $resultO->fechas);
        $resultA->fechas = array_merge($resultT->fechas, $resultA->fechas);
        // *** Ordenar fechas ***
        //la menor de las primeras fechas
        if ($resultA->fechas[0]['primerafecha'] > $resultA->fechas[1]['primerafecha']
        ) {
            $resultA->fechas[0]['primerafecha']
                = $resultA->fechas[1]['primerafecha'];
        }
        if ($resultA->fechas[0]['primerafecha'] > $resultA->fechas[2]['primerafecha']
        ) {
            $resultA->fechas[0]['primerafecha']
                = $resultA->fechas[2]['primerafecha'];
        }
        //la mayor de las ultimas fechas
        if ($resultA->fechas[0]['ultimafecha'] < $resultA->fechas[1]['ultimafecha']
        ) {
            $resultA->fechas[0]['ultimafecha']
                = $resultA->fechas[1]['ultimafecha'];
        }
        if ($resultA->fechas[0]['ultimafecha'] < $resultA->fechas[2]['ultimafecha']
        ) {
            $resultA->fechas[0]['ultimafecha']
                = $resultA->fechas[2]['ultimafecha'];
        }
        //correr un poco mas las fechas
        $final->fechas[0][primerafecha] = self::correrFecha(
            $resultA->fechas[0][primerafecha], -5
        );
        $final->fechas[0][ultimafecha] = self::correrFecha(
            $resultA->fechas[0][ultimafecha], 5
        );

        $final->fechas[0][primerafecha] = $resultA->fechas[0][primerafecha];
        $final->fechas[0][ultimafecha] = $resultA->fechas[0][ultimafecha];

        //$final->fechas[0][primerafecha] = date("d/m/Y");
        //$final->fechas[0][ultimafecha] = self::correrFecha(date("d/m/Y"), 10);

        foreach ($final->data as $key => $elemento) {
            //****progreso***
            $progreso = $elemento['progress'] / 100;
            $final->data[$key]['progress'] = $progreso;
            $final->data[$key]['actualizarporciento']
                = $elemento['actualizarporciento'];
            if ($utilizacionFT) {
                $arraypermisos = array();
                $arraypermisos
                    = $this->pIntegrator->workflow->obtenerPermisosPostAccion(
                    $parametros->idusuario, $elemento['idestadoaprob'], $idtipoelemento = 3
                );
                $final->data[$key]['modificar'] = $arraypermisos['modificar'];
                $final->data[$key]['eliminar'] = $arraypermisos['eliminar'];
            } else {
                $final->data[$key]['modificar'] = 1;
                $final->data[$key]['eliminar'] = 1;
            }
            $fechainicio = explode('/', $elemento['start_date']);
            $fechafin = explode('/', $elemento['end_date']);
            $final->data[$key]['start_date']
                = $fechainicio[0] . '-' . $fechainicio[1] . '-'
                . $fechainicio[2]
                . ' ' . $elemento['horainicio'];
            $final->data[$key]['end_date']
                = $fechafin[0] . '-' . $fechafin[1] . '-' . $fechafin[2] . ' '
                . $elemento['horafin'];
        }
        $links = DatActividades::DependenciasDeGantt($parametros);
        foreach ($links->data as $key => $elemento) {
            foreach ($actividades->data as $actividad) {
                if ($elemento['idelementopadre'] == $actividad['idelemento']) {
                    $links->data[$key]['target'] = $actividad['id'];
                } else {
                    if ($elemento['idelementohijo'] == $actividad['idelemento']
                    ) {
                        $links->data[$key]['source'] = $actividad['id'];
                    }
                }
            }
            $links->data[$key]['id'] = $key;
        }
        $resultado['data'] = $final->data;
        $resultado['fechas'] = $final->fechas;
        $resultado['links'] = $links->data;
        return $resultado;
    }

    public function eliminarCorchetesCadena($idelemento)
    {
        $idelemento = substr($idelemento, 1, strlen($idelemento) - 2);
        $idelemento = explode(',', $idelemento);
        $idelemento = ($idelemento[0] == 'NULL') ? '' : $idelemento[0];

        return $idelemento;
    }

    ////
    public
    function ActividadesParaGantt($parametros)
    {
        $resultado = array();
        $utilizacionFT = 0;
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 3//ACT
        );
        if (isset($arrayestadosver[0])) {
            $utilizacionFT = 1;
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 0//PLAN
        );
        if (isset($arrayestadosver[0])) {
            $utilizacionFT = 1;
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 1//OBJ
        );
        if (isset($arrayestadosver[0])) {
            $utilizacionFT = 1;
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        //todos los ementos que se listaran en Gantt
        $parametros->arrayTipos = implode(
            ',', $parametros->arrayTiposElementos
        );
        $arc->data = '';
        $planes->data = '';
        $objetivos->data = '';
        $actividades->data = '';
        $cont = 0;
        $id = 1;
        if ($parametros->actividades == 1 || ($parametros->actividades == 0 && $parametros->proyectos == 0)
        ) {
            $elemenGantt = DatActividades::elementosParaGantt($parametros);
            //print_r($elemenGantt);die;
            foreach ($elemenGantt->data as $key => $elemento) {
                $arrayidelementopadre = $elemento['idelementopadre'];
                $arrayidelementopadre = substr($arrayidelementopadre, 1);
                $arrayidelementopadre = substr($arrayidelementopadre, 0, -1);
                $arrayidelementopadre = explode(',', $arrayidelementopadre);
                switch ($elemento['idtipoelemento']) {
                    case 0://El elemento es un PLAN
                        $fecha = DatActividades::planParaGantt(
                            $elemento['idelemento'], $parametros
                        );
                        if (isset($fecha[0])) {
                            $planes->data[$cont] = self::llenarGantt(
                                $fecha, $id, $elemento, ''
                            );
                            $cont++;
                            $id++;
                        }
                        break;
                    case 4://El elemento es ARC
                        $idelemento = (isset($elemento['idelemento'])) ? $elemento['idelemento'] : $elemento['idarc'];
                        $idelementopadre = $elemento['idarcpadre'];
                        $fecha = DatActividades::fechaArcParaGantt(
                            $idelemento, $parametros
                        );
                        if (isset($fecha[0])) {
                            //Adicionando como fecha fin del arc el ultimo dia del anno si viene en null
                            if (empty($fecha[0]['fechafin'])) {
                                $fecha[0]['fechafin'] = self::ultimoDiaAnno($fecha[0]['fechainicio']);
                            }
                            //Relacionado con plan
                            if (isset($arrayidelementopadre[0]) && $arrayidelementopadre[0] != 'NULL') {
                                if ($idelemento == $idelementopadre) { //El arc es raiz
                                    //Poner como padre el plan si se lista sino el ARC como raiz
                                    if (self::verificarListarPlanARC($parametros)) {
                                        foreach ($arrayidelementopadre as $value) {
                                            $existePlan = DatActividades::planParaGantt(
                                                $value, $parametros
                                            );
                                            $padre = (isset($existePlan[0])) ? $value : '';
                                            $arc->data[$cont] = self::llenarGantt(
                                                $fecha, $id, $elemento, $padre);
                                            $cont++;
                                            $id++;
                                        }
                                    } else {
                                        $arc->data[$cont] = self::llenarGantt(
                                            $fecha, $id, $elemento, '');
                                        $cont++;
                                        $id++;
                                    }
                                } else { //Verifico si mis padres se listan para listarme como hijo
                                    $arrayvariables['elemento'] = $elemento;
                                    $arrayvariables['idelemento'] = $idelemento;
                                    $arrayvariables['arc'] = $arc;
                                    $arrayvariables['fecha'] = $fecha;
                                    $arrayvariables['cont'] = $cont;
                                    $arrayvariables['id'] = $id;
                                    $arrayvariables = self::listarArcComoHijo($parametros, $arrayvariables);
                                    $arc = $arrayvariables['arc'];
                                    $id = $arrayvariables['id'];
                                    $cont = $arrayvariables['cont'];
                                }
                            } else {
                                //Arc raiz
                                if ($idelemento == $idelementopadre) {
                                    $arc->data[$cont] = self::llenarGantt(
                                        $fecha, $id, $elemento, '');
                                    $cont++;
                                    $id++;
                                } else {
                                    $arrayvariables['elemento'] = $elemento;
                                    $arrayvariables['idelemento'] = $idelemento;
                                    $arrayvariables['arc'] = $arc;
                                    $arrayvariables['fecha'] = $fecha;
                                    $arrayvariables['cont'] = $cont;
                                    $arrayvariables['id'] = $id;
                                    $arrayvariables = self::listarArcComoHijo($parametros, $arrayvariables);
                                    $arc = $arrayvariables['arc'];
                                    $id = $arrayvariables['id'];
                                    $cont = $arrayvariables['cont'];
                                }
                            }
                        }

                        break;
                    case 1://El elemento es un OBJETIVO
                        $fecha = DatActividades::objetivoParaGantt(
                            $elemento['idelemento'], $parametros
                        );
                        if (isset($fecha[0])) {
                            //Relacionado con plan y objetivo
                            $listar = self::verificarListarElemento($parametros);
                            if (isset($arrayidelementopadre[0]) && $arrayidelementopadre[0] != 'NULL') {
                                if (empty($elemento['idplanobj']) && empty($elemento['idarcobj'])) { //esta relacionado con plan o obt
                                    foreach ($arrayidelementopadre as $value) {
                                        $tipoelemento = DatActividades::tipoElemento($value);
                                        if (isset($tipoelemento[0])) {
                                            if ($tipoelemento[0] == '0') {
                                                if ($listar['listarTodos'] || $listar['listarPlan']) {
                                                    $existePlan = DatActividades::planParaGantt(
                                                        $value, $parametros
                                                    );
                                                    $padre = (isset($existePlan[0])) ? $value : '';
                                                    $objetivos->data[$cont] = self::llenarGantt(
                                                        $fecha, $id, $elemento, $padre);
                                                    $cont++;
                                                    $id++;
                                                } else {
                                                    $objetivos->data[$cont] = self::llenarGantt(
                                                        $fecha, $id, $elemento, '');
                                                    $cont++;
                                                    $id++;
                                                }
                                            } else if ($tipoelemento[0] == '1') {
                                                if ($listar['listarTodos'] || $listar['listarObj']) {
                                                    $existeObj = DatActividades::objetivoParaGantt(
                                                        $value, $parametros
                                                    );
                                                    $padre = (isset($existeObj[0])) ? $value : '';
                                                    $objetivos->data[$cont] = self::llenarGantt(
                                                        $fecha, $id, $elemento, $padre);
                                                    $cont++;
                                                    $id++;
                                                } else {
                                                    $objetivos->data[$cont] = self::llenarGantt(
                                                        $fecha, $id, $elemento, '');
                                                    $cont++;
                                                    $id++;
                                                }
                                            }
                                        }
                                    }
                                } else { //Esta relacionado con plan-arc, plan, obj
                                    foreach ($arrayidelementopadre as $value) {
                                        $idplanobj = $elemento['idplanobj'];
                                        if ($value != $idplanobj) {
                                            $tipoelemento = DatActividades::tipoElemento($value);
                                            if (isset($tipoelemento[0])) {
                                                if ($tipoelemento[0] == '0') {
                                                    if ($listar['listarTodos'] || $listar['listarPlan']) {
                                                        $existePlan = DatActividades::planParaGantt(
                                                            $value, $parametros
                                                        );
                                                        $padre = (isset($existePlan[0])) ? $value : '';
                                                        $objetivos->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, $padre);
                                                        $cont++;
                                                        $id++;
                                                    } else {
                                                        $objetivos->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, '');
                                                        $cont++;
                                                        $id++;
                                                    }
                                                } else if ($tipoelemento[0] == '1') {
                                                    if ($listar['listarTodos'] || $listar['listarObj']) {
                                                        $existeObj = DatActividades::objetivoParaGantt(
                                                            $value, $parametros
                                                        );
                                                        $padre = (isset($existeObj[0])) ? $value : '';
                                                        $objetivos->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, $padre);
                                                        $cont++;
                                                        $id++;
                                                    } else {
                                                        $objetivos->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, '');
                                                        $cont++;
                                                        $id++;
                                                    }
                                                }
                                            }
                                        } else {
                                            $idarcobj = $elemento['idarcobj'];
                                            if ($listar['listarTodos'] || ($listar['listarObj'] && $listar['listarPlan']
                                                    && ($listar['listarARC'] || $listar['listarCap']))) {
                                                $existeArc = DatActividades::fechaArcParaGantt(
                                                    $idarcobj, $parametros
                                                );
                                                if (isset($existeArc[0])) {
                                                    $objetivos->data[$cont] = self::llenarGantt(
                                                        $fecha, $id, $elemento, $idarcobj
                                                    );
                                                    $cont++;
                                                    $id++;
                                                } else {
                                                    $existePlan = DatActividades::planParaGantt(
                                                        $idplanobj, $parametros
                                                    );
                                                    if (isset($existePlan[0])) {
                                                        $objetivos->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, $idplanobj
                                                        );
                                                        $cont++;
                                                        $id++;
                                                    } else {
                                                        $objetivos->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, ''
                                                        );
                                                        $cont++;
                                                        $id++;
                                                    }
                                                }
                                            } else if ($listar['listarObj']) {
                                                if (($listar['listarARC'] || $listar['listarCap']) && !$listar['listarPlan']) {
                                                    $existeArc = DatActividades::fechaArcParaGantt(
                                                        $idarcobj, $parametros
                                                    );
                                                    if (isset($existeArc[0])) {
                                                        $objetivos->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, $idarcobj
                                                        );
                                                        $cont++;
                                                        $id++;
                                                    } else {
                                                        $objetivos->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, ''
                                                        );
                                                        $cont++;
                                                        $id++;
                                                    }
                                                } else if (!($listar['listarARC'] || $listar['listarCap']) && $listar['listarPlan']) {
                                                    $existePlan = DatActividades::planParaGantt(
                                                        $idplanobj, $parametros
                                                    );
                                                    if (isset($existePlan[0])) {
                                                        $objetivos->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, $idplanobj
                                                        );
                                                        $cont++;
                                                        $id++;
                                                    } else {
                                                        $objetivos->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, ''
                                                        );
                                                        $cont++;
                                                        $id++;
                                                    }
                                                } else {
                                                    $objetivos->data[$cont] = self::llenarGantt(
                                                        $fecha, $id, $elemento, ''
                                                    );
                                                    $cont++;
                                                    $id++;
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (empty($elemento['idplanobj']) && empty($elemento['idarcobj'])) { //Es raiz y no esta relacionado
                                    $objetivos->data[$cont] = self::llenarGantt(
                                        $fecha, $id, $elemento, ''
                                    );
                                    $cont++;
                                    $id++;
                                } else { //Es raiz y esta relacionado con plan-arc
                                    //Poner como padre ARC si se lista, sino el plan si se lista, sino como raiz
                                    $idarcobj = $elemento['idarcobj'];
                                    $idplanobj = $elemento['idplanobj'];
                                    if ($listar['listarTodos'] || ($listar['listarObj'] && $listar['listarPlan']
                                            && ($listar['listarARC'] || $listar['listarCap']))) {
                                        $existeArc = DatActividades::fechaArcParaGantt(
                                            $idarcobj, $parametros
                                        );
                                        if (isset($existeArc[0])) {
                                            $objetivos->data[$cont] = self::llenarGantt(
                                                $fecha, $id, $elemento, $idarcobj
                                            );
                                            $cont++;
                                            $id++;
                                        } else {
                                            $existePlan = DatActividades::planParaGantt(
                                                $idplanobj, $parametros
                                            );
                                            if (isset($existePlan[0])) {
                                                $objetivos->data[$cont] = self::llenarGantt(
                                                    $fecha, $id, $elemento, $idplanobj
                                                );
                                                $cont++;
                                                $id++;
                                            } else {
                                                $objetivos->data[$cont] = self::llenarGantt(
                                                    $fecha, $id, $elemento, ''
                                                );
                                                $cont++;
                                                $id++;
                                            }
                                        }
                                    } else if ($listar['listarObj']) {
                                        if (($listar['listarARC'] || $listar['listarCap']) && !$listar['listarPlan']) {
                                            $existeArc = DatActividades::fechaArcParaGantt(
                                                $idarcobj, $parametros
                                            );
                                            if (isset($existeArc[0])) {
                                                $objetivos->data[$cont] = self::llenarGantt(
                                                    $fecha, $id, $elemento, $idarcobj
                                                );
                                                $cont++;
                                                $id++;
                                            } else {
                                                $objetivos->data[$cont] = self::llenarGantt(
                                                    $fecha, $id, $elemento, ''
                                                );
                                                $cont++;
                                                $id++;
                                            }
                                        } else if (!($listar['listarARC'] || $listar['listarCap']) && $listar['listarPlan']) {
                                            $existePlan = DatActividades::planParaGantt(
                                                $idplanobj, $parametros
                                            );
                                            if (isset($existePlan[0])) {
                                                $objetivos->data[$cont] = self::llenarGantt(
                                                    $fecha, $id, $elemento, $idplanobj
                                                );
                                                $cont++;
                                                $id++;
                                            } else {
                                                $objetivos->data[$cont] = self::llenarGantt(
                                                    $fecha, $id, $elemento, ''
                                                );
                                                $cont++;
                                                $id++;
                                            }
                                        } else {
                                            $objetivos->data[$cont] = self::llenarGantt(
                                                $fecha, $id, $elemento, ''
                                            );
                                            $cont++;
                                            $id++;
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    case 3://El elemento es una ACTIVIDAD
                        $fecha = DatActividades::actividadParaGantt(
                            $elemento['idelemento'], $parametros
                        );
                        if (isset($fecha[0])) {
                            $listar = self::verificarListarElemento($parametros);
                            if (isset($arrayidelementopadre[0]) && $arrayidelementopadre[0] != 'NULL') {
                                if (empty($elemento['idplanarcact']) && empty($elemento['idarcplanact'])) { //esta relacionado con plan, obj, act
                                    foreach ($arrayidelementopadre as $value) {
                                        $tipoelemento = DatActividades::tipoElemento($value);
                                        if (isset($tipoelemento[0])) {
                                            if ($tipoelemento[0] == '0') {
                                                if ($listar['listarTodos'] || $listar['listarPlan']) {
                                                    $existePlan = DatActividades::planParaGantt(
                                                        $value, $parametros
                                                    );
                                                    $padre = (isset($existePlan[0])) ? $value : '';
                                                    $actividades->data[$cont] = self::llenarGantt(
                                                        $fecha, $id, $elemento, $padre);
                                                    $cont++;
                                                    $id++;
                                                } else {
                                                    $actividades->data[$cont] = self::llenarGantt(
                                                        $fecha, $id, $elemento, '');
                                                    $cont++;
                                                    $id++;
                                                }
                                            } else if ($tipoelemento[0] == '1') {
                                                if ($listar['listarTodos'] || $listar['listarObj']) {
                                                    $existeObj = DatActividades::objetivoParaGantt(
                                                        $value, $parametros
                                                    );
                                                    $padre = (isset($existeObj[0])) ? $value : '';
                                                    $actividades->data[$cont] = self::llenarGantt(
                                                        $fecha, $id, $elemento, $padre);
                                                    $cont++;
                                                    $id++;
                                                } else {
                                                    $actividades->data[$cont] = self::llenarGantt(
                                                        $fecha, $id, $elemento, '');
                                                    $cont++;
                                                    $id++;
                                                }
                                            } else if ($tipoelemento[0] == '3') {
                                                if ($listar['listarTodos'] || $listar['listarAct']) {
                                                    $existeAct = DatActividades::actividadParaGantt(
                                                        $value, $parametros
                                                    );
                                                    $padre = (isset($existeAct[0])) ? $value : '';
                                                    $actividades->data[$cont] = self::llenarGantt(
                                                        $fecha, $id, $elemento, $padre);
                                                    $cont++;
                                                    $id++;
                                                } else {
                                                    $actividades->data[$cont] = self::llenarGantt(
                                                        $fecha, $id, $elemento, '');
                                                    $cont++;
                                                    $id++;
                                                }
                                            }
                                        }
                                    }
                                } else { //Esta relacionado con plan-arc, plan, obj
                                    foreach ($arrayidelementopadre as $value) {
                                        $idplanarcact = $elemento['idplanarcact'];
                                        if ($value != $idplanarcact) {
                                            $tipoelemento = DatActividades::tipoElemento($value);
                                            if (isset($tipoelemento[0])) {
                                                if ($tipoelemento[0] == '0') {
                                                    if ($listar['listarTodos'] || $listar['listarPlan']) {
                                                        $existePlan = DatActividades::planParaGantt(
                                                            $value, $parametros
                                                        );
                                                        $padre = (isset($existePlan[0])) ? $value : '';
                                                        $actividades->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, $padre);
                                                        $cont++;
                                                        $id++;
                                                    } else {
                                                        $actividades->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, '');
                                                        $cont++;
                                                        $id++;
                                                    }
                                                } else if ($tipoelemento[0] == '1') {
                                                    if ($listar['listarTodos'] || $listar['listarObj']) {
                                                        $existeObj = DatActividades::objetivoParaGantt(
                                                            $value, $parametros
                                                        );
                                                        $padre = (isset($existeObj[0])) ? $value : '';
                                                        $actividades->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, $padre);
                                                        $cont++;
                                                        $id++;
                                                    } else {
                                                        $actividades->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, '');
                                                        $cont++;
                                                        $id++;
                                                    }
                                                } else if ($tipoelemento[0] == '3') {
                                                    if ($listar['listarTodos'] || $listar['listarAct']) {
                                                        $existeAct = DatActividades::actividadParaGantt(
                                                            $value, $parametros
                                                        );
                                                        $padre = (isset($existeAct[0])) ? $value : '';
                                                        $actividades->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, $padre);
                                                        $cont++;
                                                        $id++;
                                                    } else {
                                                        $actividades->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, '');
                                                        $cont++;
                                                        $id++;
                                                    }
                                                }
                                            }
                                        } else {
                                            //Buscar problemasss

                                            $idarplanact = $elemento['idarcplanact'];
                                            if ($listar['listarTodos'] || ($listar['listarAct'] && $listar['listarPlan']
                                                    && ($listar['listarARC'] || $listar['listarCap']))) {
                                                $existeArc = DatActividades::fechaArcParaGantt(
                                                    $idarplanact, $parametros
                                                );

                                                if (isset($existeArc[0])) {
                                                    $actividades->data[$cont] = self::llenarGantt(
                                                        $fecha, $id, $elemento, $idarplanact
                                                    );
                                                    $cont++;
                                                    $id++;
                                                } else {
                                                    $existePlan = DatActividades::planParaGantt(
                                                        $idplanarcact, $parametros
                                                    );
                                                    if (isset($existePlan[0])) {
                                                        $actividades->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, $idplanarcact
                                                        );
                                                        $cont++;
                                                        $id++;
                                                    } else {
                                                        $actividades->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, ''
                                                        );
                                                        $cont++;
                                                        $id++;
                                                    }
                                                }
                                            } else if ($listar['listarAct']) {
                                                if (($listar['listarARC'] || $listar['listarCap']) && !$listar['listarPlan']) {
                                                    $existeArc = DatActividades::fechaArcParaGantt(
                                                        $idarplanact, $parametros
                                                    );
                                                    if (isset($existeArc[0])) {
                                                        $actividades->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, $idarplanact
                                                        );
                                                        $cont++;
                                                        $id++;
                                                    } else {
                                                        $actividades->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, ''
                                                        );
                                                        $cont++;
                                                        $id++;
                                                    }
                                                } else if (!($listar['listarARC'] || $listar['listarCap']) && $listar['listarPlan']) {
                                                    $existePlan = DatActividades::planParaGantt(
                                                        $idplanarcact, $parametros
                                                    );
                                                    if (isset($existePlan[0])) {
                                                        $actividades->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, $idplanarcact
                                                        );
                                                        $cont++;
                                                        $id++;
                                                    } else {
                                                        $actividades->data[$cont] = self::llenarGantt(
                                                            $fecha, $id, $elemento, ''
                                                        );
                                                        $cont++;
                                                        $id++;
                                                    }
                                                } else {
                                                    $actividades->data[$cont] = self::llenarGantt(
                                                        $fecha, $id, $elemento, ''
                                                    );
                                                    $cont++;
                                                    $id++;
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (empty($elemento['idplanarcact']) && empty($elemento['idarcplanact'])) { //Es raiz y no esta relacionado
                                    $actividades->data[$cont] = self::llenarGantt(
                                        $fecha, $id, $elemento, ''
                                    );
                                    $cont++;
                                    $id++;
                                } else { //Es raiz y esta relacionado con plan-arc
                                    //Poner como padre ARC si se lista, sino el plan si se lista, sino como raiz
                                    $idarcplanact = $elemento['idarcplanact'];
                                    $idplanarcact = $elemento['idplanarcact'];
                                    if ($listar['listarTodos'] || ($listar['listarAct'] && $listar['listarPlan']
                                            && ($listar['listarARC'] || $listar['listarCap']))) {
                                        $existeArc = DatActividades::fechaArcParaGantt(
                                            $idarcplanact, $parametros
                                        );
                                        if (isset($existeArc[0])) {
                                            $actividades->data[$cont] = self::llenarGantt(
                                                $fecha, $id, $elemento, $idarcplanact
                                            );
                                            $cont++;
                                            $id++;
                                        } else {
                                            $existePlan = DatActividades::planParaGantt(
                                                $idplanarcact, $parametros
                                            );
                                            if (isset($existePlan[0])) {
                                                $actividades->data[$cont] = self::llenarGantt(
                                                    $fecha, $id, $elemento, $idplanarcact
                                                );
                                                $cont++;
                                                $id++;
                                            } else {
                                                $actividades->data[$cont] = self::llenarGantt(
                                                    $fecha, $id, $elemento, ''
                                                );
                                                $cont++;
                                                $id++;
                                            }
                                        }
                                    } else if ($listar['listarAct']) {
                                        if (($listar['listarARC'] || $listar['listarCap']) && !$listar['listarPlan']) {
                                            $existeArc = DatActividades::fechaArcParaGantt(
                                                $idarcplanact, $parametros
                                            );
                                            if (isset($existeArc[0])) {
                                                $actividades->data[$cont] = self::llenarGantt(
                                                    $fecha, $id, $elemento, $idarcplanact
                                                );
                                                $cont++;
                                                $id++;
                                            } else {
                                                $actividades->data[$cont] = self::llenarGantt(
                                                    $fecha, $id, $elemento, ''
                                                );
                                                $cont++;
                                                $id++;
                                            }
                                        } else if (!($listar['listarARC'] || $listar['listarCap']) && $listar['listarPlan']) {
                                            $existePlan = DatActividades::planParaGantt(
                                                $idplanarcact, $parametros
                                            );
                                            if (isset($existePlan[0])) {
                                                $actividades->data[$cont] = self::llenarGantt(
                                                    $fecha, $id, $elemento, $idplanarcact
                                                );
                                                $cont++;
                                                $id++;
                                            } else {
                                                $actividades->data[$cont] = self::llenarGantt(
                                                    $fecha, $id, $elemento, ''
                                                );
                                                $cont++;
                                                $id++;
                                            }
                                        } else {
                                            $actividades->data[$cont] = self::llenarGantt(
                                                $fecha, $id, $elemento, ''
                                            );
                                            $cont++;
                                            $id++;
                                        }
                                    }
                                }
                            }
                        }
                        break;
                }
            }
        }
        //Obtener de proyecto
        if ($parametros->proyectos == 1 || ($parametros->actividades == 0 && $parametros->proyectos == 0)
        ) {
            $proyecto->data = self::tareasParaGantt($parametros, $id, $cont);
        } else {
            $proyecto->data = '';
        }

        //Eliminar duplicados de ARC, obj y activ

        //Organizar los elementos
        //union planes y arc
        if ($planes->data != '' && $arc->data != '') {
            $final->data = array_merge($planes->data, $arc->data);
        } elseif ($planes->data != '' && $arc->data == '') {
            $final->data = $planes->data;
        } elseif ($planes->data == '' && $arc->data != '') {
            $final->data = $arc->data;
        } else {
            $final->data = '';
        }

        //union de planes y obj
        if ($final->data != '' && $objetivos->data != '') {
            $final->data = array_merge($final->data, $objetivos->data);
        } elseif ($final->data != '' && $objetivos->data == '') {
            $final->data = $final->data;
        } elseif ($final->data == '' && $objetivos->data != '') {
            $final->data = $objetivos->data;
        } else {
            $final->data = '';
        }
        //union con actividades
        if ($final->data != '' && $actividades->data != '') {
            $final->data = array_merge($final->data, $actividades->data);
        } elseif ($final->data != '' && $actividades->data == '') {
            $final->data = $final->data;
        } elseif ($final->data == '' && $actividades->data != '') {
            $final->data = $actividades->data;
        } else {
            $final->data = '';
        }
        //union con proyecto
        if ($final->data != '' && $proyecto->data != '') {
            $final->data = array_merge($final->data, $proyecto->data);
        } elseif ($final->data != '' && $proyecto->data == '') {
            $final->data = $final->data;
        } elseif ($final->data == '' && $proyecto->data != '') {
            $final->data = $proyecto->data;
        } else {
            $final->data = '';
        }
        //Poner el nuevo id del padre
        if ($final->data != '') {
            foreach ($final->data as $key => $elemento) {
                if ($elemento['parent'] != '') {
                    $cont = 0;
                    for ($i = 0; $i < count($final->data); $i++) {
                        if ($elemento['parent'] == $final->data[$i]['idelemento']
                        ) {
                            $final->data[$key]['parent']
                                = $final->data[$i]['id'];
                            $cont++;
                        }
                    }
                    if ($cont == 0) {
                        $final->data[$key]['parent'] = '';
                    }
                }
            }
        }

        //Escoger la mayor y la menor fecha de todos los elementos
        $resultP = DatActividades::planesParaGantt($parametros);
        $resultArc = DatActividades::arcParaGantt($parametros);
        $resultO = DatActividades::objetivosParaGantt($parametros);
        $resultA = DatActividades::ActividadesParaGantt($parametros);
        // *** fechas
        $resultT->fechas = array_merge($resultP->fechas, $resultArc->fechas);
        $resultT->fechas = array_merge($resultT->fechas, $resultO->fechas);
        $resultA->fechas = array_merge($resultT->fechas, $resultA->fechas);
        // *** Ordenar fechas ***
        //la menor de las primeras fechas
        if ($resultA->fechas[0]['primerafecha'] > $resultA->fechas[1]['primerafecha']
        ) {
            $resultA->fechas[0]['primerafecha']
                = $resultA->fechas[1]['primerafecha'];
        }
        if ($resultA->fechas[0]['primerafecha'] > $resultA->fechas[2]['primerafecha']
        ) {
            $resultA->fechas[0]['primerafecha']
                = $resultA->fechas[2]['primerafecha'];
        }
        //la mayor de las ultimas fechas
        if ($resultA->fechas[0]['ultimafecha'] < $resultA->fechas[1]['ultimafecha']
        ) {
            $resultA->fechas[0]['ultimafecha']
                = $resultA->fechas[1]['ultimafecha'];
        }
        if ($resultA->fechas[0]['ultimafecha'] < $resultA->fechas[2]['ultimafecha']
        ) {
            $resultA->fechas[0]['ultimafecha']
                = $resultA->fechas[2]['ultimafecha'];
        }
        //print_r($resultA->fechas);die;
        //correr un poco mas las fechas
        $final->fechas[0][primerafecha] = self::correrFecha(
            $resultA->fechas[0][primerafecha], -5
        );
        $final->fechas[0][ultimafecha] = self::correrFecha(
            $resultA->fechas[0][ultimafecha], 5
        );
        //$final->fechas[0][primerafecha] = date("d/m/Y");
        //$final->fechas[0][ultimafecha] = self::correrFecha(date("d/m/Y"), 10);
        foreach ($final->data as $key => $elemento) {
            //****progreso***
            $progreso = $elemento['progress'] / 100;
            $final->data[$key]['progress'] = $progreso;
            $final->data[$key]['actualizarporciento']
                = $elemento['actualizarporciento'];
            if ($utilizacionFT == 1) {
                $arraypermisos
                    = $this->pIntegrator->workflow->obtenerPermisosPostAccion(
                    $parametros->idusuario, $elemento['idestadoaprob'], $idtipoelemento = 3
                );
                $final->data[$key]['modificar'] = $arraypermisos['modificar'];
                $final->data[$key]['eliminar'] = $arraypermisos['eliminar'];
                /* $objElemento = new DatElementos();
                  $idautor = $objElemento->usuariocreaporidelemento(
                  $elemento['idelemento']
                  );
                  if (isset ($idautor[0])) {
                  $parametros->idautoractividad
                  = $idautor[0]['idusuariocrea'];
                  $parametros->idusuariosession = $parametros->idusuario;
                  $arraypermisos = $this->comprobarPermisos(
                  $parametros
                  );
                  $final->data[$key]['modificar']
                  = $arraypermisos['modificar'];
                  $final->data[$key]['eliminar'] = $arraypermisos['eliminar'];
                  } */
            } else {
                $final->data[$key]['modificar'] = 1;
                $final->data[$key]['eliminar'] = 1;
            }
            $fechainicio = explode('/', $elemento['start_date']);
            $fechafin = explode('/', $elemento['end_date']);
            $final->data[$key]['start_date']
                = $fechainicio[0] . '-' . $fechainicio[1] . '-'
                . $fechainicio[2]
                . ' ' . $elemento['horainicio'];
            $final->data[$key]['end_date']
                = $fechafin[0] . '-' . $fechafin[1] . '-' . $fechafin[2] . ' '
                . $elemento['horafin'];
        }
        $links = DatActividades::DependenciasDeGantt($parametros);
        foreach ($links->data as $key => $elemento) {
            foreach ($actividades->data as $actividad) {
                if ($elemento['idelementopadre'] == $actividad['idelemento']) {
                    $links->data[$key]['target'] = $actividad['id'];
                } else {
                    if ($elemento['idelementohijo'] == $actividad['idelemento']
                    ) {
                        $links->data[$key]['source'] = $actividad['id'];
                    }
                }
            }
            $links->data[$key]['id'] = $key;
        }
        $resultado['data'] = $final->data;
        $resultado['fechas'] = $final->fechas;
        $resultado['links'] = $links->data;
        return $resultado;
    }

    public
    function ultimoDiaAnno($fechainicio)
    {
        $anno = explode('/', $fechainicio);
        $anno = $anno[2];
        return '31/' . '12/' . $anno;
    }

    //Funcion para listar el arc como hijo del plan si se listan los planes, sino listar el arc como raiz
    public
    function verificarListarPlanARC($parametros)
    {
        if ($parametros->arrayTipos == '') {
            if ($parametros->listarARC == 'false' && $parametros->listarCapitulos == 'false') return true;
            else return false;
        } else {
            if (strpos($parametros->arrayTipos, '0') !== false) {
                if ($parametros->listarARC == 'false' && $parametros->listarCapitulos == 'false') return false;
                else return true;
            } else return false;
        }
    }

    //Funcion para listar el elemento como hijo del elemento relacionado, sino listarlo como raiz
    public
    function verificarListarElemento($parametros)
    {
        $result['listarPlan'] = 0;
        $result['listarARC'] = 0;
        $result['listarCap'] = 0;
        $result['listarObj'] = 0;
        $result['listarAct'] = 0;
        $result['listarTodos'] = 0;
        $cantElementos = count($parametros->arrayTiposElementos);
        if ($cantElementos == 0) {
            if ($parametros->listarARC == 'false' && $parametros->listarCapitulos == 'false') $result['listarTodos'] = 1;
            else {
                $result['listarARC'] = ($parametros->listarARC == 'false') ? 0 : 1;
                $result['listarCap'] = ($parametros->listarCapitulos == 'false') ? 0 : 1;
            }
        } else if ($cantElementos == 3) {
            if ($parametros->listarARC == 'true' && $parametros->listarCapitulos == 'true') $result['listarTodos'] = 1;
            else {
                $result['listarARC'] = ($parametros->listarARC == 'false') ? 0 : 1;
                $result['listarCap'] = ($parametros->listarCapitulos == 'false') ? 0 : 1;
                $result['listarPlan'] = 1;
                $result['listarObj'] = 1;
                $result['listarAct'] = 1;
            }
        } else {
            $result['listarPlan'] = (strpos($parametros->arrayTipos, '0') !== false) ? 1 : 0;
            $result['listarObj'] = (strpos($parametros->arrayTipos, '1') !== false) ? 1 : 0;
            $result['listarAct'] = (strpos($parametros->arrayTipos, '3') !== false) ? 1 : 0;
            $result['listarARC'] = ($parametros->listarARC == 'false') ? 0 : 1;
            $result['listarCap'] = ($parametros->listarCapitulos == 'false') ? 0 : 1;
        }
        return $result;
    }

    public
    function listarArcComoHijo($parametros, $arrayvariables)
    {
        $elemento = $arrayvariables['elemento'];
        $idelemento = $arrayvariables['idelemento'];
        $arc = $arrayvariables['arc'];
        $fecha = $arrayvariables['fecha'];
        $cont = $arrayvariables['cont'];
        $id = $arrayvariables['id'];
        $superiores = array();
        self::buscarSuperioresMismoARC(
            $idelemento, $superiores
        );
        if (isset($superiores[0])) {
            $datarc = new DatArc();
            $cant = count($superiores);
            for ($i = $cant - 1; $i >= 0; $i--) {
                $existe = $datarc->buscarArcFechaInicio(intval($superiores[$i]), $parametros);
                if (isset($existe[0])) {
                    if (isset($fecha[0])) {
                        $arc->data[$cont] = self::llenarGantt(
                            $fecha, $id, $elemento, $superiores[$i]
                        );
                        $cont++;
                        $id++;
                    }
                    $existe = 1;
                    break;
                }
            }
            if ($existe != 1) {
                if (isset($fecha[0])) {
                    $arc->data[$cont] = self::llenarGantt(
                        $fecha, $id, $elemento, ''
                    );
                    $cont++;
                    $id++;
                }
            }
        } else {
            if (isset($fecha[0])) {
                $arc->data[$cont] = self::llenarGantt(
                    $fecha, $id, $elemento, '');
                $cont++;
                $id++;
            }
        }
        $arrayvariables['arc'] = $arc;
        $arrayvariables['cont'] = $cont;
        $arrayvariables['id'] = $id;
        return $arrayvariables;

    }

    public
    function ActividadesParaGanttOld($parametros)
    {
        $resultado = array();
        $utilizacionFT = 0;
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 3//ACT
        );
        if (isset($arrayestadosver[0])) {
            $utilizacionFT = 1;
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 0//PLAN
        );
        if (isset($arrayestadosver[0])) {
            $utilizacionFT = 1;
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 1//OBJ
        );
        if (isset($arrayestadosver[0])) {
            $utilizacionFT = 1;
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        //todos los ementos que se listaran en Gantt
        $parametros->arrayTipos = implode(
            ',', $parametros->arrayTiposElementos
        );
        $planes->data = '';
        $objetivos->data = '';
        $actividades->data = '';
        $cont = 0;
        $id = 1;
        if ($parametros->actividades == 1 || ($parametros->actividades == 0 && $parametros->proyectos == 0)
        ) {
            $elemenGantt = DatActividades::elementosParaGantt($parametros);
            foreach ($elemenGantt->data as $key => $elemento) {
                switch ($elemento['idtipoelemento']) {
                    case 0://El elemento es un PLAN
                        $fecha = DatActividades::planParaGantt(
                            $elemento['idelemento'], $parametros
                        );
                        if ($fecha[0]) {
                            $planes->data[$cont] = self::llenarGantt(
                                $fecha, $id, $elemento, ''
                            );
                            $cont++;
                            $id++;
                        }
                        break;
                    case 1://El elemento es un OBJETIVO
                        $existePadrePlan = 0;
                        $fecha = DatActividades::objetivoParaGantt(
                            $elemento['idelemento'], $parametros
                        );
                        //si tiene padre plan y tiene padre objetivo
                        if ($elemento['idelementopadre'] != '') {
                            if ($elemento['idplanobj'] != '') {
                                //Busco si siendo hijo del objetivo sera hijo del plan recursivamente
                                $superiores = array();
                                self::buscarSuperioresMismo(
                                    $elemento['idelemento'], $superiores
                                );
                                if (isset($superiores[0])) {
                                    foreach ($superiores as $superior) {
                                        $existe
                                            = DatActividades::existePadrePlanDeObj(
                                            $superior, $elemento['idplanobj']
                                        );
                                        if ($existe[0] != '') {
                                            $existePadrePlan = $existe[0];
                                        }
                                    }
                                }
                                if ($existePadrePlan == 0) {
                                    if ($fecha[0]) {
                                        $objetivos->data[$cont]
                                            = self::llenarGantt(
                                            $fecha, $id, $elemento, $elemento['idplanobj']
                                        );
                                        $cont++;
                                        $id++;
                                    }
                                } else {
                                    if ($fecha[0]) {
                                        $objetivos->data[$cont]
                                            = self::llenarGantt(
                                            $fecha, $id, $elemento, $elemento['idelementopadre']
                                        );
                                        $cont++;
                                        $id++;
                                    }
                                }
                            } else {
                                if ($fecha[0]) {
                                    $objetivos->data[$cont] = self::llenarGantt(
                                        $fecha, $id, $elemento, $elemento['idelementopadre']
                                    );
                                    $cont++;
                                    $id++;
                                }
                            }
                        } else {
                            if ($fecha[0]) {
                                $objetivos->data[$cont] = self::llenarGantt(
                                    $fecha, $id, $elemento, $elemento['idplanobj']
                                );
                                $cont++;
                                $id++;
                            }
                        }
                        break;
                    case 3://El elemento es una ACTIVIDAD
                        $fecha = DatActividades::actividadParaGantt(
                            $elemento['idelemento'], $parametros
                        );
                        //si tiene padre plan y tiene padre actividad o padre objetivo
                        if ($elemento['idelementopadre'] != '') {
                            if ($elemento['idplanact'] != '') {
                                //Busco el tipoelemento del padre
                                $tipoPadre = DatActividades::tipoElemento(
                                    $elemento['idelementopadre']
                                );
                                if ($tipoPadre[0] == 0) { //el padre es plan
                                    if ($elemento['idplanact'] == $elemento['idelementopadre']
                                    ) {
                                        if ($fecha[0]) {
                                            $actividades->data[$cont]
                                                = self::llenarGantt(
                                                $fecha, $id, $elemento, $elemento['idelementopadre']
                                            );
                                            $cont++;
                                            $id++;
                                        }
                                    } else { //es hija de los dos planes
                                        if ($fecha[0]) {
                                            $actividades->data[$cont]
                                                = self::llenarGantt(
                                                $fecha, $id, $elemento, $elemento['idplanact']
                                            );
                                            $cont++;
                                            $id++;
                                            $actividades->data[$cont]
                                                = self::llenarGantt(
                                                $fecha, $id, $elemento, $elemento['idelementopadre']
                                            );
                                            $cont++;
                                            $id++;
                                        }
                                    }
                                } else {
                                    if ($tipoPadre[0] == 1
                                    ) { //el padre es objetivo
                                        //Busco si siendo hija del objetivo sera hija del plan recursivamente
                                        $superiores = array();
                                        $existePadrePlan = 0;
                                        self::buscarSuperioresMismo(
                                            $elemento['idelementopadre'], $superiores
                                        );
                                        $existe
                                            = DatActividades::existePadrePlanDeObj(
                                            $elemento['idelementopadre'], $elemento['idplanact']
                                        );
                                        $existePadrePlan = $existe[0];
                                        if ($existePadrePlan == 0) {
                                            if (isset($superiores[0])) {
                                                foreach (
                                                    $superiores as $superior
                                                ) {
                                                    $existe
                                                        = DatActividades::existePadrePlanDeObj(
                                                        $superior, $elemento['idplanact']
                                                    );
                                                    if ($existe[0] != '') {
                                                        $existePadrePlan
                                                            = $existe[0];
                                                    }
                                                }
                                            }
                                        }
                                        if ($existePadrePlan == 0) {
                                            if ($fecha[0]) {
                                                $actividades->data[$cont]
                                                    = self::llenarGantt(
                                                    $fecha, $id, $elemento, $elemento['idplanact']
                                                );
                                                $cont++;
                                                $id++;
                                            }
                                        } else {
                                            if ($fecha[0]) {
                                                $actividades->data[$cont]
                                                    = self::llenarGantt(
                                                    $fecha, $id, $elemento, $elemento['idelementopadre']
                                                );
                                                $cont++;
                                                $id++;
                                            }
                                        }
                                    } else {
                                        if ($tipoPadre[0] == 3
                                        ) { //el padre es actividad
                                            //Busco si siendo hija de la actividad sera hija del plan recursivamente
                                            $superiores = array();
                                            $existePadrePlan = 0;
                                            self::buscarSuperioresGantt(
                                                $elemento['idelemento'], $superiores, '<', 4
                                            );
                                            if (isset($superiores[0])) {
                                                foreach (
                                                    $superiores as $superior
                                                ) {
                                                    $tipoPadre
                                                        = DatActividades::tipoElemento(
                                                        $superior
                                                    );
                                                    if ($tipoPadre[0] == 3
                                                    ) {//act
                                                        $existe
                                                            = DatActividades::existePadrePlanDeAct(
                                                            $superior, $elemento['idplanact']
                                                        );
                                                        if ($existe[0] == '') {
                                                            $existe
                                                                = DatActividades::existePadrePlanDeActE(
                                                                $superior, $elemento['idplanact']
                                                            );
                                                        }
                                                        if ($existe[0] != '') {
                                                            $existePadrePlan
                                                                = $existe[0];
                                                        }
                                                    } else {
                                                        if ($tipoPadre[0] == 1
                                                        ) {//obj
                                                            $existe
                                                                = DatActividades::existePadrePlanDeObj(
                                                                $superior, $elemento['idplanact']
                                                            );
                                                            if ($existe[0] != ''
                                                            ) {
                                                                $existePadrePlan
                                                                    = $existe[0];
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            if ($existePadrePlan == 0) {
                                                if ($fecha[0]) {
                                                    $actividades->data[$cont]
                                                        = self::llenarGantt(
                                                        $fecha, $id, $elemento, $elemento['idplanact']
                                                    );
                                                    $cont++;
                                                    $id++;
                                                }
                                            } else {
                                                if ($fecha[0]) {
                                                    $actividades->data[$cont]
                                                        = self::llenarGantt(
                                                        $fecha, $id, $elemento, $elemento['idelementopadre']
                                                    );
                                                    $cont++;
                                                    $id++;
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                if ($fecha[0]) {
                                    $actividades->data[$cont]
                                        = self::llenarGantt(
                                        $fecha, $id, $elemento, $elemento['idelementopadre']
                                    );
                                    $cont++;
                                    $id++;
                                }
                            }
                        } else {
                            if ($fecha[0]) {
                                $actividades->data[$cont] = self::llenarGantt(
                                    $fecha, $id, $elemento, $elemento['idplanact']
                                );
                                $cont++;
                                $id++;
                            }
                        }
                        break;
                }
            }
        }
        //Obtener de proyecto
        if ($parametros->proyectos == 1 || ($parametros->actividades == 0 && $parametros->proyectos == 0)
        ) {
            $proyecto->data = self::tareasParaGantt($parametros, $id, $cont);
        } else {
            $proyecto->data = '';
        }
        //Organizar los elementos
        //union de planes y obj
        if ($planes->data != '' && $objetivos->data != '') {
            $final->data = array_merge($planes->data, $objetivos->data);
        } elseif ($planes->data != '' && $objetivos->data == '') {
            $final->data = $planes->data;
        } elseif ($planes->data == '' && $objetivos->data != '') {
            $final->data = $objetivos->data;
        } else {
            $final->data = '';
        }
        //union con actividades
        if ($final->data != '' && $actividades->data != '') {
            $final->data = array_merge($final->data, $actividades->data);
        } elseif ($final->data != '' && $actividades->data == '') {
            $final->data = $final->data;
        } elseif ($final->data == '' && $actividades->data != '') {
            $final->data = $actividades->data;
        } else {
            $final->data = '';
        }
        //union con proyecto
        if ($final->data != '' && $proyecto->data != '') {
            $final->data = array_merge($final->data, $proyecto->data);
        } elseif ($final->data != '' && $proyecto->data == '') {
            $final->data = $final->data;
        } elseif ($final->data == '' && $proyecto->data != '') {
            $final->data = $proyecto->data;
        } else {
            $final->data = '';
        }
        //Poner el nuevo id del padre
        if ($final->data != '') {
            foreach ($final->data as $key => $elemento) {
                if ($elemento['parent'] != '') {
                    $cont = 0;
                    for ($i = 0; $i < count($final->data); $i++) {
                        if ($elemento['parent'] == $final->data[$i]['idelemento']
                        ) {
                            $final->data[$key]['parent']
                                = $final->data[$i]['id'];
                            $cont++;
                        }
                    }
                    if ($cont == 0) {
                        $final->data[$key]['parent'] = '';
                    }
                }
            }
        }
        //Escoger la mayor y la menor fecha de todos los elementos
        $resultP = DatActividades::planesParaGantt($parametros);
        $resultO = DatActividades::objetivosParaGantt($parametros);
        $resultA = DatActividades::ActividadesParaGantt($parametros);
        // *** fechas
        $resultT->fechas = array_merge($resultP->fechas, $resultO->fechas);
        $resultA->fechas = array_merge($resultT->fechas, $resultA->fechas);
        // *** Ordenar fechas ***
        //la menor de las primeras fechas
        if ($resultA->fechas[0]['primerafecha'] > $resultA->fechas[1]['primerafecha']
        ) {
            $resultA->fechas[0]['primerafecha']
                = $resultA->fechas[1]['primerafecha'];
        }
        if ($resultA->fechas[0]['primerafecha'] > $resultA->fechas[2]['primerafecha']
        ) {
            $resultA->fechas[0]['primerafecha']
                = $resultA->fechas[2]['primerafecha'];
        }
        //la mayor de las ultimas fechas
        if ($resultA->fechas[0]['ultimafecha'] < $resultA->fechas[1]['ultimafecha']
        ) {
            $resultA->fechas[0]['ultimafecha']
                = $resultA->fechas[1]['ultimafecha'];
        }
        if ($resultA->fechas[0]['ultimafecha'] < $resultA->fechas[2]['ultimafecha']
        ) {
            $resultA->fechas[0]['ultimafecha']
                = $resultA->fechas[2]['ultimafecha'];
        }
        //print_r($resultA->fechas);die;
        //correr un poco mas las fechas
        $final->fechas[0][primerafecha] = self::correrFecha(
            $resultA->fechas[0][primerafecha], -5
        );
        $final->fechas[0][ultimafecha] = self::correrFecha(
            $resultA->fechas[0][ultimafecha], 5
        );
        //$final->fechas[0][primerafecha] = date("d/m/Y");
        //$final->fechas[0][ultimafecha] = self::correrFecha(date("d/m/Y"), 10);
        foreach ($final->data as $key => $elemento) {
            //****progreso***
            $progreso = $elemento['progress'] / 100;
            $final->data[$key]['progress'] = $progreso;
            $final->data[$key]['actualizarporciento']
                = $elemento['actualizarporciento'];
            if ($utilizacionFT == 1) {
                $arraypermisos
                    = $this->pIntegrator->workflow->obtenerPermisosPostAccion(
                    $parametros->idusuario, $elemento['idestadoaprob'], $idtipoelemento = 3
                );
                $final->data[$key]['modificar'] = $arraypermisos['modificar'];
                $final->data[$key]['eliminar'] = $arraypermisos['eliminar'];
                /* $objElemento = new DatElementos();
                  $idautor = $objElemento->usuariocreaporidelemento(
                  $elemento['idelemento']
                  );
                  if (isset ($idautor[0])) {
                  $parametros->idautoractividad
                  = $idautor[0]['idusuariocrea'];
                  $parametros->idusuariosession = $parametros->idusuario;
                  $arraypermisos = $this->comprobarPermisos(
                  $parametros
                  );
                  $final->data[$key]['modificar']
                  = $arraypermisos['modificar'];
                  $final->data[$key]['eliminar'] = $arraypermisos['eliminar'];
                  } */
            } else {
                $final->data[$key]['modificar'] = 1;
                $final->data[$key]['eliminar'] = 1;
            }
            $fechainicio = explode('/', $elemento['start_date']);
            $fechafin = explode('/', $elemento['end_date']);
            $final->data[$key]['start_date']
                = $fechainicio[0] . '-' . $fechainicio[1] . '-'
                . $fechainicio[2]
                . ' ' . $elemento['horainicio'];
            $final->data[$key]['end_date']
                = $fechafin[0] . '-' . $fechafin[1] . '-' . $fechafin[2] . ' '
                . $elemento['horafin'];
        }
        $links = DatActividades::DependenciasDeGantt($parametros);
        foreach ($links->data as $key => $elemento) {
            foreach ($actividades->data as $actividad) {
                if ($elemento['idelementopadre'] == $actividad['idelemento']) {
                    $links->data[$key]['target'] = $actividad['id'];
                } else {
                    if ($elemento['idelementohijo'] == $actividad['idelemento']
                    ) {
                        $links->data[$key]['source'] = $actividad['id'];
                    }
                }
            }
            $links->data[$key]['id'] = $key;
        }
        $resultado['data'] = $final->data;
        $resultado['fechas'] = $final->fechas;
        $resultado['links'] = $links->data;
        return $resultado;
    }

    //Función que carga los elemtos de planificación de Proyecto
    public
    function tareasParaGantt($parametros, $id, $cont)
    {
        //todos los ementos que se listaran en Gantt
        $parametros->arrayTipos = implode(
            ',', $parametros->arrayTiposElementos
        );
        $elemenGantt = DatActividades::elemenDeProyParaGantt($parametros);
        foreach ($elemenGantt->data as $key => $elemento) {
            switch ($elemento[idtipoelemento]) {
                case 8://El elemento es un PROYECTO
                    $fecha = DatActividades::proyectoParaGantt(
                        $elemento['idelemento'], $parametros
                    );
                    if ($fecha[0]) {
                        $final->data[$cont] = self::llenarGantt(
                            $fecha, $id, $elemento, ''
                        );
                        $cont++;
                        $id++;
                    }
                    break;
                case 9://El elemento es un HITO
                    $fecha = DatActividades::hitoParaGantt(
                        $elemento['idelemento'], $parametros
                    );
                    if ($fecha[0]) {
                        $final->data[$cont] = self::llenarGantt(
                            $fecha, $id, $elemento, $elemento['idelementopadre']
                        );
                        $cont++;
                        $id++;
                    }
                    break;
                case 10://El elemento es una TAREA
                    $fecha = DatActividades::tareaParaGantt(
                        $elemento['idelemento'], $parametros
                    );
                    if ($fecha[0]) {
                        $final->data[$cont] = self::llenarGantt(
                            $fecha, $id, $elemento, $elemento['idelementopadre']
                        );
                        $cont++;
                        $id++;
                    }
                    break;
            }
        }
        return $final->data;
    }

    //****************fin gantt******************
    //****************Pareto******************
    public
    function ActividadesParaPareto($parametros)
    {
        $resultado = array();
        $pesototal = 0;
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 3
        );
        if (isset($arrayestadosver[0])) {
            $utilizacionFT = 1;
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        $objDatAct = new DatActividades();
        $result = $objDatAct->ActividadesParaPareto($parametros);

        $cont = count($result->data);
        ///***** cuando las act son hijas de objetivos hijos del plan
        if ($parametros->idplan) {
            //dame todas las act hijas de act o de obj
            $actHijas = $objDatAct->actParetoPlan($parametros);
            foreach ($actHijas->data as $key => $act) {
                $tipoPadre = $objDatAct->tipoElemento($act['padre']);
                if ($tipoPadre[0] == 1) { //el padre es objetivo
                    //Busco si siendo hija del objetivo sera hija del plan recursivamente
                    $superiores = array();
                    $existePadrePlan = 0;
                    self::buscarSuperioresMismo($act['padre'], $superiores);
                    $existe = $objDatAct->existePadrePlanDeObj(
                        $act['padre'], $parametros->idplan
                    );
                    $existePadrePlan = $existe[0];
                    if ($existePadrePlan == 0) {
                        if (isset($superiores[0])) {
                            foreach ($superiores as $superior) {
                                $existe = $objDatAct->existePadrePlanDeObj(
                                    $superior, $parametros->idplan
                                );
                                if ($existe[0] != '') {
                                    $existePadrePlan = $existe[0];
                                }
                            }
                        }
                    }
                    if ($existePadrePlan != 0) {//concateno
                        $result->data[$cont] = $actHijas->data[$key];
                        $cont++;
                    }
                } else {
                    if ($tipoPadre[0] == 3) { //actividad
                        //Busco si siendo hija de la actividad sera hija del plan recursivamente
                        $superiores = array();
                        $existePadrePlan = 0;
                        self::buscarSuperioresGantt(
                            $act['padre'], $superiores, '<', 4
                        );
                        if (isset($superiores[0])) {
                            foreach ($superiores as $superior) {
                                $tipoPadre = $objDatAct->tipoElemento(
                                    $superior
                                );
                                if ($tipoPadre[0] == 3) {//act
                                    $existe
                                        = $objDatAct->existePadrePlanDeAct(
                                        $superior, $parametros->idplan
                                    );
                                    if ($existe[0] == '') {
                                        $existe
                                            = $objDatAct->existePadrePlanDeActE(
                                            $superior, $parametros->idplan
                                        );
                                    }
                                    if ($existe[0] != '') {
                                        $existePadrePlan = $existe[0];
                                    }
                                } else {
                                    if ($tipoPadre[0] == 1) {//obj
                                        $existe
                                            = $objDatAct->existePadrePlanDeObj(
                                            $superior, $parametros->idplan
                                        );
                                        if ($existe[0] != '') {
                                            $existePadrePlan = $existe[0];
                                        }
                                    } else {
                                        if ($tipoPadre[0] == 0) {//plan
                                            if ($superior == $parametros->idplan
                                            ) {
                                                $existePadrePlan = $superior;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if ($existePadrePlan != 0) {//concateno
                            $result->data[$cont] = $actHijas->data[$key];
                            $cont++;
                        }
                    }
                }
            }
        }
        //***** Por tipo de resultado
        if ($parametros->tipoR) {
            foreach ($result->data as $key => $act) {
                $sumPesoDependencias = 0;
                $arregloPadresT = array();
                $arregloHijosT = array();
                if ($parametros->tipoR == 2) {//Antecesores - (padres)
                    self::buscarSuperioresGantt(
                        $act['id'], $arregloPadresT, '>', 5
                    );
                    foreach ($arregloPadresT as $padre) {
                        $pesoPadre = $objDatAct->miPeso($padre);
                        $sumPesoDependencias += $pesoPadre[0];
                    }
                }
                if ($parametros->tipoR == 3) {//Sucesores - (hijos)
                    self::buscarInferioresGantt(
                        $act['id'], $arregloHijosT, '>', 5
                    );
                    foreach ($arregloHijosT as $hijo) {
                        $pesoHijo = $objDatAct->miPeso($hijo);
                        $sumPesoDependencias += $pesoHijo[0];
                    }
                }
                if ($parametros->tipoR == 4) {//(padres) - (hijos)
                    self::buscarInferioresGantt(
                        $act['id'], $arregloHijosT, '>', 5
                    );
                    foreach ($arregloHijosT as $hijo) {
                        $pesoHijo = $objDatAct->miPeso($hijo);
                        $sumPesoDependencias += $pesoHijo[0];
                    }
                    self::buscarSuperioresGantt(
                        $act['id'], $arregloPadresT, '>', 5
                    );
                    foreach ($arregloPadresT as $padre) {
                        $pesoPadre = $objDatAct->miPeso($padre);
                        $sumPesoDependencias += $pesoPadre[0];
                    }
                }
                $result->data[$key]['peso'] = $sumPesoDependencias + $act['peso'];
            }
        }
        //**** Calcular el peso total
        foreach ($result->data as $key => $elemento) {
            $pesototal += $elemento['peso'];
        }
        //****** Ordenar por peso de mayor a menor
        for ($i = 0; $i < count($result->data) - 1; $i++) {
            for ($j = $i + 1; $j < count($result->data); ++$j) {
                if ($result->data[$i]['peso'] < $result->data[$j]['peso']) {
                    $Temp = $result->data[$i];
                    $result->data[$i] = $result->data[$j];
                    $result->data[$j] = $Temp;
                }
            }
        }
        foreach ($result->data as $key => $value) {
            $porcientoRe = 100 * $value['peso'] / $pesototal;
            $porciento = round($porcientoRe, 1, PHP_ROUND_HALF_UP);
            $acumulado += $porciento;
            $resultado['peso'][$key] = $value['peso'];
            $resultado['porciento_re'][$key] = array(
                "y" => $porciento,
                "text" => $value['text']
            );
            $resultado['CAR'][$key] = $value['id'];
            $resultado['acumulado'][$key] = $acumulado;
            $resultado['text'][$key] = $value['text'];
        }
        //print_r($resultado);die;
        return $resultado;
    }

    //****************fin Pareto******************
    //********Graficas********//
    /*
     * Carga el comportamiento de las actividades
     * (Adicionadas, eliminadas o cambiadas de fecha) de los planes despues que
     * estos estan en un estado determinado(puede ser Aporobacion)
     * */
    public
    function cargarCalidadTri($parametros)
    {
        //estados de las actividades (idtipodoc = 3)
        $arrayestadosver
            = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 3
        );
        if (isset($arrayestadosver[0])) {
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        $arrayActs = DatActividades::actividadesCalidad($parametros);
        if ($parametros->idplan != '') {
            $arrayActs = self::actsDelPlan(
                $parametros, $parametros->fechainicio, $parametros->fechafin
            );
        }
        $arrayExcelente = array(0, 0, 0, 0);
        $arrayBien = array(0, 0, 0, 0);
        $arrayRegular = array(0, 0, 0, 0);
        $arrayMal = array(0, 0, 0, 0);
        $arrayNoEval = array(0, 0, 0, 0);
        //Recorro todas las acts hijas del plan para calculares sus valores
        foreach ($arrayActs as $k => $act) {
            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], date('01/01/Y')
            );
            $tiempo2 = self::dias_transcurridos(
                date('31/03/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                if ($act['criterioevaluacion'] == 'E') {
                    $arrayExcelente[0]++;
                } elseif ($act['criterioevaluacion'] == 'B') {
                    $arrayBien[0]++;
                } elseif ($act['criterioevaluacion'] == 'R') {
                    $arrayRegular[0]++;
                } elseif ($act['criterioevaluacion'] == 'M') {
                    $arrayMal[0]++;
                } elseif ($act['criterioevaluacion'] == 'NE') {
                    $arrayNoEval[0]++;
                }
            }
            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], date('01/04/Y')
            );
            $tiempo2 = self::dias_transcurridos(
                date('30/06/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                if ($act['criterioevaluacion'] == 'E') {
                    $arrayExcelente[1]++;
                } elseif ($act['criterioevaluacion'] == 'B') {
                    $arrayBien[1]++;
                } elseif ($act['criterioevaluacion'] == 'R') {
                    $arrayRegular[1]++;
                } elseif ($act['criterioevaluacion'] == 'M') {
                    $arrayMal[1]++;
                } elseif ($act['criterioevaluacion'] == 'NE') {
                    $arrayNoEval[1]++;
                }
            }
            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], date('01/07/Y')
            );
            $tiempo2 = self::dias_transcurridos(
                date('31/09/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                if ($act['criterioevaluacion'] == 'E') {
                    $arrayExcelente[2]++;
                } elseif ($act['criterioevaluacion'] == 'B') {
                    $arrayBien[2]++;
                } elseif ($act['criterioevaluacion'] == 'R') {
                    $arrayRegular[2]++;
                } elseif ($act['criterioevaluacion'] == 'M') {
                    $arrayMal[2]++;
                } elseif ($act['criterioevaluacion'] == 'NE') {
                    $arrayNoEval[2]++;
                }
            }
            $tiempo1 = self::dias_transcurridos(
                $act['fechainicio'], date('01/10/Y')
            );
            $tiempo2 = self::dias_transcurridos(
                date('31/12/Y'), $act['fechainicio']
            );
            if ($tiempo1 >= 0 && $tiempo2 >= 0) {
                if ($act['criterioevaluacion'] == 'E') {
                    $arrayExcelente[3]++;
                } elseif ($act['criterioevaluacion'] == 'B') {
                    $arrayBien[3]++;
                } elseif ($act['criterioevaluacion'] == 'R') {
                    $arrayRegular[3]++;
                } elseif ($act['criterioevaluacion'] == 'M') {
                    $arrayMal[3]++;
                } elseif ($act['criterioevaluacion'] == 'NE') {
                    $arrayNoEval[3]++;
                }
            }
        }
        //Acumulado de Excelentes
        $arrayAcumuladoE[0] = $arrayExcelente[0];
        $arrayAcumuladoE[1] = $arrayAcumuladoE[0] + $arrayExcelente[1];
        $arrayAcumuladoE[2] = $arrayAcumuladoE[1] + $arrayExcelente[2];
        $arrayAcumuladoE[3] = $arrayAcumuladoE[2] + $arrayExcelente[3];
        //Acumulado de Bien
        $arrayAcumuladoB[0] = $arrayBien[0];
        $arrayAcumuladoB[1] = $arrayAcumuladoB[0] + $arrayBien[1];
        $arrayAcumuladoB[2] = $arrayAcumuladoB[1] + $arrayBien[2];
        $arrayAcumuladoB[3] = $arrayAcumuladoB[2] + $arrayBien[3];
        //Acumulado de Regulares
        $arrayAcumuladoR[0] = $arrayRegular[0];
        $arrayAcumuladoR[1] = $arrayAcumuladoR[0] + $arrayRegular[1];
        $arrayAcumuladoR[2] = $arrayAcumuladoR[1] + $arrayRegular[2];
        $arrayAcumuladoR[3] = $arrayAcumuladoR[2] + $arrayRegular[3];
        //Acumulado de Mal
        $arrayAcumuladoM[0] = $arrayMal[0];
        $arrayAcumuladoM[1] = $arrayAcumuladoM[0] + $arrayMal[1];
        $arrayAcumuladoM[2] = $arrayAcumuladoM[1] + $arrayMal[2];
        $arrayAcumuladoM[3] = $arrayAcumuladoM[2] + $arrayMal[3];
        //Acumulado de NO evaluado
        $arrayAcumuladoNE[0] = $arrayNoEval[0];
        $arrayAcumuladoNE[1] = $arrayAcumuladoNE[0] + $arrayNoEval[1];
        $arrayAcumuladoNE[2] = $arrayAcumuladoNE[1] + $arrayNoEval[2];
        $arrayAcumuladoNE[3] = $arrayAcumuladoNE[2] + $arrayNoEval[3];
        $data = Array(
            array(
                "type" => 'column',
                "name" => 'E',
                "color" => '#72D572',
                "data" => $arrayExcelente,
                "shadow" => true,
                "dataLabels" => array(
                    "enabled" => true,
                    "format" => '{point.y}'
                )
            ), array(
                "type" => 'column',
                "name" => 'B',
                "color" => '#77C2F8',
                "data" => $arrayBien,
                "shadow" => true,
                "dataLabels" => array(
                    "enabled" => true,
                    "format" => '{point.y}'
                ),
            ), array(
                "type" => 'column',
                "name" => 'R',
                "color" => '#F6915C',
                "data" => $arrayRegular,
                "shadow" => true,
                "dataLabels" => array(
                    "enabled" => true,
                    "format" => '{point.y}'
                )
            ),
            array(
                "type" => 'column',
                "name" => 'M',
                "color" => '#FF5261',
                "data" => $arrayMal,
                "shadow" => true,
                "dataLabels" => array(
                    "enabled" => true,
                    "format" => '{point.y}'
                )
            ),
            array(
                "type" => 'column',
                "name" => 'NE',
                "color" => '#F9E58B',
                "data" => $arrayNoEval,
                "shadow" => true,
                "dataLabels" => array(
                    "enabled" => true,
                    "format" => '{point.y}'
                )
            ),
            array(
                "type" => 'spline',
                "name" => 'Acumulado de E',
                "color" => '#72D572',
                "data" => $arrayAcumuladoE,
                "shadow" => true,
                "dataLabels" => array(
                    "enabled" => true,
                    "format" => '{point.y}'
                )
            ), array(
                "type" => 'spline',
                "name" => 'Acumulado B',
                "color" => '#77C2F8',
                "data" => $arrayAcumuladoB,
                "shadow" => true,
                "dataLabels" => array(
                    "enabled" => true,
                    "format" => '{point.y}'
                ),
            ), array(
                "type" => 'spline',
                "name" => 'Acumulado de R',
                "color" => '#F6915C',
                "data" => $arrayAcumuladoR,
                "shadow" => true,
                "dataLabels" => array(
                    "enabled" => true,
                    "format" => '{point.y}'
                )
            ), array(
                "type" => 'spline',
                "name" => 'Acumulado de M',
                "color" => '#FF5261',
                "data" => $arrayAcumuladoM,
                "shadow" => true,
                "dataLabels" => array(
                    "enabled" => true,
                    "format" => '{point.y}'
                )
            ), array(
                "type" => 'spline',
                "name" => 'Acumulado de NE',
                "color" => '#F9E58B',
                "data" => $arrayAcumuladoNE,
                "shadow" => true,
                "dataLabels" => array(
                    "enabled" => true,
                    "format" => '{point.y}'
                )
            )
        );
        return $data;
    }

    public
    function cargarDisciplinaPlan($parametros)
    {
        $arrayActHijas = self::actsDelPlan(
            $parametros, $parametros->fechainicio, $parametros->fechafin
        );
        $incumplidas = 0;
        $parcialmenteCumplidas = 0;
        $noIniciadas = 0;
        $cumplidas = 0;
        $fechaActual = date('d/m/Y');
        //Por cada actividad calculo sus datos
        foreach ($arrayActHijas as $k => $act) {
            $duracionF = self::dias_transcurridos(
                $act['fechafin'], $fechaActual
            );
            $duracionI = self::dias_transcurridos(
                $act['fechainicio'], $fechaActual
            );
            if ($parametros->peso == 1) {
                if ($act['gradocumplimiento'] < 100 && $duracionF < 0) {
                    $incumplidas += $act['peso'];
                }
                if ($act['gradocumplimiento'] < 100 && $act['gradocumplimiento'] > 0 && $duracionF >= 0
                ) {
                    $parcialmenteCumplidas += $act['peso'];
                }
                if ($act['gradocumplimiento'] == 0 && $duracionF >= 0 && $duracionI <= 0
                ) {
                    $noIniciadas += $act['peso'];
                }
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidas += $act['peso'];
                }
            } else {
                if ($act['gradocumplimiento'] < 100 && $duracionF < 0) {
                    $incumplidas++;
                }
                if ($act['gradocumplimiento'] < 100 && $act['gradocumplimiento'] > 0 && $duracionF >= 0
                ) {
                    $parcialmenteCumplidas++;
                }
                if ($act['gradocumplimiento'] == 0 && $duracionF >= 0 && $duracionI <= 0
                ) {
                    $noIniciadas++;
                }
                if ($act['gradocumplimiento'] == 100) {
                    $cumplidas++;
                }
            }
        }
        $total = $incumplidas + $parcialmenteCumplidas + $noIniciadas + $cumplidas;
        $pIncumplidas = ($incumplidas * 100) / $total;
        $pParcialmenteCumplidas = ($parcialmenteCumplidas * 100) / $total;
        $pNoIniciadas = ($noIniciadas * 100) / $total;
        $pCumplidas = ($cumplidas * 100) / $total;
        $data = Array(
            array(
                "name" => 'Cumplidas',
                "y" => $pCumplidas,
                "color" => '#72D572',
                "cant" => $cumplidas
            ), array(
                "name" => 'Parcialmente cumplidas',
                "y" => $pParcialmenteCumplidas,
                "color" => '#F9E58B',
                "cant" => $parcialmenteCumplidas
            ), array(
                "name" => 'Incumplidas',
                "y" => $pIncumplidas,
                "color" => '#FF5261',
                "cant" => $incumplidas
            ), array(
                "name" => 'No iniciadas',
                "y" => $pNoIniciadas,
                "color" => '#F6915C',
                "cant" => $noIniciadas
            )
        );
        return $data;
    }

    public
    function cargarDisciplina($parametros)
    {
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 3
        );
        if (isset($arrayestadosver[0])) {
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        $objDatAct = new DatActividades();
        $incumplidas = $objDatAct->actIncumplidas($parametros);
        $parcialmenteCumplidas = $objDatAct->actPcumplidas($parametros);
        $noIniciadas = $objDatAct->actNoIniciadas($parametros);
        $cumplidas = $objDatAct->actCumplidas($parametros);
        $total = $incumplidas[0] + $parcialmenteCumplidas[0] + $noIniciadas[0] + $cumplidas[0];
        $pIncumplidas = ($incumplidas[0] * 100) / $total;
        $pParcialmenteCumplidas = ($parcialmenteCumplidas[0] * 100) / $total;
        $pNoIniciadas = ($noIniciadas[0] * 100) / $total;
        $pCumplidas = ($cumplidas[0] * 100) / $total;
        $data = Array(
            array(
                "name" => 'Cumplidas',
                "y" => $pCumplidas,
                "color" => '#72D572',
                "cant" => $cumplidas[0]
            ), array(
                "name" => 'Parcialmente cumplidas',
                "y" => $pParcialmenteCumplidas,
                "color" => '#F9E58B',
                "cant" => $parcialmenteCumplidas[0]
            ), array(
                "name" => 'Incumplidas',
                "y" => $pIncumplidas,
                "color" => '#FF5261',
                "cant" => $incumplidas[0]
            ), array(
                "name" => 'No iniciadas',
                "y" => $pNoIniciadas,
                "color" => '#F6915C',
                "cant" => $noIniciadas[0]
            )
        );
        return $data;
    }

    public
    function cargarCalidad($parametros)
    {
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 3
        );
        if (isset($arrayestadosver[0])) {
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        $objDatAct = new DatActividades();
        $parametros->eval = 'E';
        $excelente = $objDatAct->actsEvaluacion($parametros);
        $parametros->eval = 'B';
        $bien = $objDatAct->actsEvaluacion($parametros);
        $parametros->eval = 'R';
        $regular = $objDatAct->actsEvaluacion($parametros);
        $parametros->eval = 'M';
        $mal = $objDatAct->actsEvaluacion($parametros);
        $parametros->eval = 'NE';
        $noEval = $objDatAct->actsEvaluacion($parametros);
        //Si se selecciona el id plan, busco sus act relacionadas
        if ($parametros->idplan != '') {
            $arrayActHijas = self::actsDelPlan(
                $parametros, $parametros->fechainicio, $parametros->fechafin
            );
            $excelente[0] = 0;
            $bien[0] = 0;
            $regular[0] = 0;
            $mal[0] = 0;
            $noEval[0] = 0;
            //Por cada actividad calculo sus datos
            foreach ($arrayActHijas as $k => $act) {
                if ($parametros->peso == 1) {
                    if ($act['criterioevaluacion'] == 'E') {
                        $excelente[0] += $act['peso'];
                    } elseif ($act['criterioevaluacion'] == 'B') {
                        $bien[0] += $act['peso'];
                    } elseif ($act['criterioevaluacion'] == 'R') {
                        $regular[0] += $act['peso'];
                    } elseif ($act['criterioevaluacion'] == 'M') {
                        $mal[0] += $act['peso'];
                    } elseif ($act['criterioevaluacion'] == 'NE') {
                        $noEval[0] += $act['peso'];
                    }
                } else {
                    if ($act['criterioevaluacion'] == 'E') {
                        $excelente[0]++;
                    } elseif ($act['criterioevaluacion'] == 'B') {
                        $bien[0]++;
                    } elseif ($act['criterioevaluacion'] == 'R') {
                        $regular[0]++;
                    } elseif ($act['criterioevaluacion'] == 'M') {
                        $mal[0]++;
                    } elseif ($act['criterioevaluacion'] == 'NE') {
                        $noEval[0]++;
                    }
                }
            }
        }
        $total = $excelente[0] + $bien[0] + $regular[0] + $mal[0] + $noEval[0];
        $pE = ($excelente[0] * 100) / $total;
        $pB = ($bien[0] * 100) / $total;
        $pR = ($regular[0] * 100) / $total;
        $pM = ($mal[0] * 100) / $total;
        $pNE = ($noEval[0] * 100) / $total;
        $data = Array(
            array(
                "name" => 'E',
                "y" => $pE,
                "color" => '#72D572',
                "cant" => $excelente[0]
            ), array(
                "name" => 'B',
                "y" => $pB,
                "color" => '#77C2F8',
                "cant" => $bien[0]
            ), array(
                "name" => 'R',
                "y" => $pR,
                "color" => '#F6915C',
                "cant" => $regular[0]
            ), array(
                "name" => 'M',
                "y" => $pM,
                "color" => '#FF5261',
                "cant" => $mal[0]
            ), array(
                "name" => 'NE',
                "y" => $pNE,
                "color" => '#F9E58B',
                "cant" => $noEval[0]
            )
        );
        return $data;
    }

    public
    function cargarBalancePlan($parametros)
    {
        $arrayActHijas = self::actsDelPlan(
            $parametros, $parametros->fechainicio, $parametros->fechafin
        );
        $fechaActual = date('d/m/Y');
        $incumpSinIFueraFecha = 0;
        $parcialCFueraFecha = 0;
        $parcialCEnTiempo = 0;
        $noIniciadasEnTiempo = 0;
        $proximoLunes = date('Y-m-d', strtotime('next monday'));
        $proximoDomingo = date(
            'Y-m-d', strtotime('+6 day', strtotime($proximoLunes))
        );

        $proximoLunes = date('d/m/Y', strtotime($proximoLunes));
        $proximoDomingo = date('d/m/Y', strtotime($proximoDomingo));


        $proximaSemana = 0;
        //Por cada actividad calculo sus datos
        foreach ($arrayActHijas as $k => $act) {

            $duracionL = self::dias_transcurridos(
                $act['fechainicio'], $proximoLunes
            ); //ISE
            $duracionD = self::dias_transcurridos(
                $act['fechainicio'], $proximoDomingo
            ); //ISE
            $duracionF = self::dias_transcurridos(
                $act['fechafin'], $fechaActual
            );
            $duracionT = self::dias_transcurridos(
                $act['fechafin'], $proximoLunes
            ); //NIET - fechafin < proximo Lunes


            if ($parametros->peso == 1) {
                if ($act['gradocumplimiento'] == 0 && $duracionF < 0) {
                    $incumpSinIFueraFecha += $act['peso'];
                }
                if ($act['gradocumplimiento'] < 100 && $act['gradocumplimiento'] > 0 && $duracionF < 0
                ) {
                    $parcialCFueraFecha += $act['peso'];
                }
                if ($act['gradocumplimiento'] < 100 && $act['gradocumplimiento'] > 0 && $duracionF >= 0
                ) {
                    $parcialCEnTiempo += $act['peso'];
                }
                if ($act['gradocumplimiento'] == 0 && $duracionT >= 0) {
                    $noIniciadasEnTiempo += $act['peso'];
                }

                if ($act['gradocumplimiento'] == 0 && $duracionL >= 0 && $duracionD <= 0
                ) {
                    $proximaSemana += $act['peso'];
                }
            } else {
                if ($act['gradocumplimiento'] == 0 && $duracionF < 0) {
                    $incumpSinIFueraFecha++;
                }
                if ($act['gradocumplimiento'] < 100 && $act['gradocumplimiento'] > 0 && $duracionF < 0
                ) {
                    $parcialCFueraFecha++;
                }
                if ($act['gradocumplimiento'] < 100 && $act['gradocumplimiento'] > 0 && $duracionF >= 0
                ) {
                    $parcialCEnTiempo++;
                }
                if ($act['gradocumplimiento'] == 0 && $duracionT >= 0) {
                    $noIniciadasEnTiempo++;
                }
                if ($act['gradocumplimiento'] == 0 && $duracionL >= 0 && $duracionD <= 0
                ) {
                    $proximaSemana++;
                }
            }
        }
        $acumulado = $incumpSinIFueraFecha + $parcialCFueraFecha + $parcialCEnTiempo + $noIniciadasEnTiempo;
        $pronostico = $acumulado + $proximaSemana;
        $data = Array(
            array(
                "name" => 'ISIFF',
                "y" => $incumpSinIFueraFecha,
                "color" => '#FF5261',
                "text" => 'Incumplidas sin iniciar fuera de fecha',
            ), array(
                "name" => 'PCFF',
                "y" => $parcialCFueraFecha,
                "color" => '#F6915C',
                "text" => 'Parcialmente cumplidas fuera de fecha',
            ), array(
                "name" => 'PCET',
                "y" => $parcialCEnTiempo,
                "color" => '#F9E58B',
                "text" => 'Parcialmente cumplidas y en tiempo',
            ), array(
                "name" => 'NIET',
                "y" => $noIniciadasEnTiempo,
                "color" => '#77C2F8',
                "text" => 'No iniciadas y en tiempo',
            ), array(
                "name" => 'AP',
                "y" => $acumulado,
                "color" => '#959299',
                "text" => 'Acumulado de pendientes',
            ), array(
                "name" => 'ISE',
                "y" => $proximaSemana,
                "color" => '#9394DF',
                "text" => 'Inician la semana entrante',
            ), array(
                "name" => 'PEASE',
                "y" => $pronostico,
                "color" => '#72D572',
                "text" => 'Pronóstico de eventos activos para la semana entrante',
            )
        );
        return $data;
    }

    public
    function cargarBalance($parametros)
    {
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 3
        );
        if (isset($arrayestadosver[0])) {
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        $objDatAct = new DatActividades();
        $incumpSinIFueraFecha = $objDatAct->incumpSinIFueraFecha(
            $parametros
        );
        $parcialCFueraFecha = $objDatAct->parcialCFueraFecha($parametros);
        $parcialCEnTiempo = $objDatAct->parcialCEnTiempo($parametros);
        $noIniciadasEnTiempo = $objDatAct->noIniciadasEnTiempo($parametros);
        $acumulado = $incumpSinIFueraFecha[0] + $parcialCFueraFecha[0] + $parcialCEnTiempo[0] + $noIniciadasEnTiempo[0];
        $proximoLunes = date('Y-m-d', strtotime('next monday'));
        $proximoDomingo = date(
            "Y-m-d", strtotime("+6 day", strtotime($proximoLunes))
        );
        $proximaSemana = $objDatAct->proximaSemana(
            $proximoLunes, $proximoDomingo, $parametros
        );
        $pronostico = $acumulado + $proximaSemana[0];
        $data = Array(
            array(
                "name" => 'ISIFF',
                "y" => (integer)$incumpSinIFueraFecha[0],
                "color" => '#FF5261',
                "text" => 'Incumplidas sin iniciar fuera de fecha',
            ), array(
                "name" => 'PCFF',
                "y" => (integer)$parcialCFueraFecha[0],
                "color" => '#F6915C',
                "text" => 'Parcialmente cumplidas fuera de fecha',
            ), array(
                "name" => 'PCET',
                "y" => (integer)$parcialCEnTiempo[0],
                "color" => '#F9E58B',
                "text" => 'Parcialmente cumplidas y en tiempo',
            ), array(
                "name" => 'NIET',
                "y" => (integer)$noIniciadasEnTiempo[0],
                "color" => '#77C2F8',
                "text" => 'No iniciadas y en tiempo',
            ), array(
                "name" => 'AP',
                "y" => $acumulado,
                "color" => '#959299',
                "text" => 'Acumulado de pendientes',
            ), array(
                "name" => 'ISE',
                "y" => (integer)$proximaSemana[0],
                "color" => '#9394DF',
                "text" => 'Inician la semana entrante',
            ), array(
                "name" => 'PEASE',
                "y" => $pronostico,
                "color" => '#72D572',
                "text" => 'Pronóstico de eventos activos para la semana entrante',
            )
        );
        return $data;
    }

    public
    function cargarTipoActPlan($parametros)
    {
        //Trabajo con el id-plan que me pasan por parametro.
        //busco sus actividades asociadas
        $objElemElem = new DatElementosDatElementos();
        //estados de las actividades (idtipodoc = 3)
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 3
        );
        if (isset($arrayestadosver[0])) {
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        //Por cada plan obtengo todas sus actividades relacionadas directamente
        $arrayActHijas = $objElemElem->actHijasDePlanNom(
            $parametros, $parametros->idplan
        );
        //busco sus objetivos asociados para posteriormente buscar sus actividades
        //estados de los objetivos (idtipodoc = 1)
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 1
        );
        if (isset($arrayestadosver[0])) {
            foreach ($arrayestadosver as $estado) {
                $arrayestadosO[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestadosO;
        $parametros->arrayestados = implode(',', $arrayestadosO);
        //Por cada plan obtengo todos sus objetivos relacionadas directamente
        $arrayObjHijos = $objElemElem->obtenerObjHijosDePlan(
            $parametros, $parametros->idplan
        );
        //busco si a traves de los objs hay acts hijas recursivamente
        foreach ($arrayObjHijos as $obj) {
            //busco todos los objs hijos hijos y nietos etc para ver si tienen acts
            $resultado[]
                = CmpgestionaractividadesModel::buscarInferioresMismo(
                $obj['idelemento'], $resultado
            );
        }
        //estados de las actividades (idtipodoc = 3)
        $arrayestadosver
            = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 3
        );
        if (isset($arrayestadosver[0])) {
            foreach ($arrayestadosver as $estado) {
                $arrayestadosA[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestadosA;
        $parametros->arrayestados = implode(',', $arrayestadosA);
        //busco las acts hijas imediatas por cada obj
        foreach ($resultado as $re) {
            $actsHijas = $objElemElem->actsHijasDeObjNom($parametros, $re);
            $arrayActHijas = array_merge($arrayActHijas, $actsHijas);
        }
        $arrayTiposAct = DatActividades::tiposAct($parametros);
        $total = 0;
        $cont = 0;
        foreach ($arrayTiposAct as $key => $value) {
            $tiempo = 0;
            $cantAct = 0; //Cantidad de actividades por tipo de act
            foreach ($arrayActHijas as $valor) {
                if ($value['idnomenclador'] == $valor['idnomenclador']) {
                    $duracion = self::dias_transcurridos(
                            $valor['fechafin'], $valor['fechainicio']
                        ) + 1;
                    $horas = self::diferenciaHoras(
                        $valor['horainicio'], $valor['horafin']
                    );
                    $tiempo += $horas * $duracion;
                    $cantAct++;
                }
            }
            if ($parametros->peso == 1) {
                foreach ($arrayActHijas as $valor) {
                    if ($value['idnomenclador'] == $valor['idnomenclador']) {
                        $tiempo += $valor['peso'];
                        $total += $valor['peso'];
                    }
                }
            }
            if ($cantAct > 0) {
                $data[$cont]['name'] = $value['dennomenclador'];
                $data[$cont]['y'] = $tiempo;
                $data[$cont]['act'] = $cantAct;
                $cont++;
            }
        }
        if ($parametros->peso == 1) {
            foreach ($data as $key => $valor) {
                $data[$key]['cant'] = $valor['y'];
                $data[$key]['y'] = ($valor['y'] * 100) / $total;
            }
        }
        return $data;
    }

    public
    function cargarTipoAct($parametros)
    {
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 3
        );
        if (isset($arrayestadosver[0])) {
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        $arrayTiposAct = DatActividades::tiposAct($parametros);
        $total = 0;
        $cont = 0;
        foreach ($arrayTiposAct as $key => $value) {
            $tiempo = 0;
            $parametros->idnomenclador = $value['idnomenclador'];
            $arrayActPorTiposAct = DatActividades::ActPorTiposAct($parametros);
            if (isset($arrayActPorTiposAct[0]['fechainicio'])) {
                foreach ($arrayActPorTiposAct as $valor) {
                    $duracion = self::dias_transcurridos(
                            $valor['fechafin'], $valor['fechainicio']
                        ) + 1;
                    $horas = self::diferenciaHoras(
                        $valor['horainicio'], $valor['horafin']
                    );
                    $tiempo += $horas * $duracion;
                }
            }
            if (isset($arrayActPorTiposAct[0]['peso'])) {
                foreach ($arrayActPorTiposAct as $valor) {
                    $tiempo += $valor['peso'];
                    $total += $valor['peso'];
                }
            }
            if (count($arrayActPorTiposAct) > 0) {
                $data[$cont]['name'] = $value['dennomenclador'];
                $data[$cont]['y'] = $tiempo;
                $data[$cont]['act'] = count($arrayActPorTiposAct);
                $cont++;
            }
        }
        if ($parametros->peso == 1) {
            foreach ($data as $key => $valor) {
                $data[$key]['cant'] = $valor['y'];
                $data[$key]['y'] = ($valor['y'] * 100) / $total;
            }
        }
        return $data;
    }

    /*
     * Tiempo planificado vs tiempo disponible de todas las acts
     * */

    public
    function cargarTiempoPlanifPlan($parametros)
    {
        //Trabajo con el id-plan que me pasan por parametro.
        //busco sus actividades asociadas
        $objElemElem = new DatElementosDatElementos();
        //estados de las actividades (idtipodoc = 3)
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 3
        );
        if (isset($arrayestadosver[0])) {
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        //Por cada plan obtengo todas sus actividades relacionadas directamente
        $arrayActHijas = $objElemElem->actHijasDePlan(
            $parametros, $parametros->idplan
        );
        //busco sus objetivos asociados para posteriormente buscar sus actividades
        //estados de los objetivos (idtipodoc = 1)
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 1
        );
        if (isset($arrayestadosver[0])) {
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        //Por cada plan obtengo todos sus objetivos relacionadas directamente
        $arrayObjHijos = $objElemElem->obtenerObjHijosDePlan(
            $parametros, $parametros->idplan
        );
        //busco si a traves de los objs hay acts hijas recursivamente
        foreach ($arrayObjHijos as $obj) {
            //busco todos los objs hijos hijos y nietos etc para ver si tienen acts
            $resultado[]
                = CmpgestionaractividadesModel::buscarInferioresMismo(
                $obj['idelemento'], $resultado
            );
            foreach ($resultado as $re) {
                //estados de las actividades (idtipodoc = 3)
                $arrayestadosver
                    = $this->pIntegrator->workflow->EstadosVerDoc(
                    $parametros->idusuario, $idtipodoc = 3
                );
                if (isset($arrayestadosver[0])) {
                    foreach ($arrayestadosver as $estado) {
                        $arrayestados[] = $estado['idestado'];
                    }
                }
                $parametros->arregloestados = $arrayestados;
                $parametros->arrayestados = implode(',', $arrayestados);
                //busco las acts hijas imediatas por cada obj
                $actsHijas = $objElemElem->actsHijasDeObj($parametros, $re);
                $arrayActHijas = array_merge($arrayActHijas, $actsHijas);
            }
        }


        $parametros->eje = 1;
        $fechaI = date('01/01/Y');
        $fechaF = date('31/12/Y');
        if ($parametros->fechainicio != '') {
            $fechaI = $parametros->fechainicio;
        }
        if ($parametros->fechafin != '') {
            $fechaF = $parametros->fechafin;
        }

        $tiempoTotal = self::dias_transcurridos($fechaF, $fechaI) * 24;
        $tiempoPlanif = 0;
        foreach ($arrayActHijas as $key => $value) {
            //Calcular la duracion de la actividad
            if ($value['fechainicio'] < $fechaI) {
                $fechaInicio = $fechaI;
            } else {
                $fechaInicio = $value['fechainicio'];
            }
            if ($value['fechafin'] > $fechaF) {
                $fechaFin = $fechaF;
            } else {
                $fechaFin = $value['fechafin'];
            }
            $duracion = self::dias_transcurridos(
                    $fechaFin, $fechaInicio
                ) + 1;
            $horas = self::diferenciaHoras(
                $value['horainicio'], $value['horafin']
            );
            $tiempoPlanif += $horas * $duracion;
        }
        $tiempoDisponible = $tiempoTotal - $tiempoPlanif;
        $porcientoLibre = round(($tiempoDisponible * 100) / $tiempoTotal, 2);
        $porcientoPlanif = round(($tiempoPlanif * 100) / $tiempoTotal, 2);
        $data = Array(
            array(
                "name" => 'Tiempo total planificado',
                "cant" => $tiempoPlanif,
                "y" => $porcientoPlanif,
                "color" => '#72D572'
            ), array(
                "name" => 'Tiepo disponible',
                "cant" => $tiempoDisponible,
                "y" => $porcientoLibre,
                "color" => '#FF5261'
            )
        );
        return $data;
    }

    /*
     * Tiempo planificado vs tiempo disponible de todas las acts
     * */

    public
    function cargarTiempoPlanif($parametros)
    {
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 3
        );
        if (isset($arrayestadosver[0])) {
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        $parametros->eje = 1;
        $fechaI = date('01/01/Y');
        $fechaF = date('31/12/Y');
        if ($parametros->fechainicio != '') {
            $fechaI = $parametros->fechainicio;
        }
        if ($parametros->fechafin != '') {
            $fechaF = $parametros->fechafin;
        }
        $arrayAct = DatActividades::actividadesPlanif(
            $parametros, $fechaI, $fechaF
        );
        //Si se selecciona el id plan, busco sus act relacionadas
        if ($parametros->idplan != '') {
            $arrayAct = self::actsDelPlan($parametros, $fechaI, $fechaF);
        }
        $tiempoTotal = self::dias_transcurridos($fechaF, $fechaI) * 24;
        $tiempoPlanif = 0;
        foreach ($arrayAct as $key => $value) {
            //Calcular la duracion de la actividad
            if ($value['fechainicio'] < $fechaI) {
                $fechaInicio = $fechaI;
            } else {
                $fechaInicio = $value['fechainicio'];
            }
            if ($value['fechafin'] > $fechaF) {
                $fechaFin = $fechaF;
            } else {
                $fechaFin = $value['fechafin'];
            }
            $duracion = self::dias_transcurridos(
                    $fechaFin, $fechaInicio
                ) + 1;
            $horas = self::diferenciaHoras(
                $value['horainicio'], $value['horafin']
            );
            $tiempoPlanif += $horas * $duracion;
        }
        $tiempoDisponible = $tiempoTotal - $tiempoPlanif;
        $porcientoLibre = round(($tiempoDisponible * 100) / $tiempoTotal, 2);
        $porcientoPlanif = round(($tiempoPlanif * 100) / $tiempoTotal, 2);
        $data = Array(
            array(
                "name" => 'Tiempo total planificado',
                "cant" => $tiempoPlanif,
                "y" => $porcientoPlanif,
                "color" => '#72D572'
            ), array(
                "name" => 'Tiempo disponible',
                "cant" => $tiempoDisponible,
                "y" => $porcientoLibre,
                "color" => '#FF5261'
            )
        );
        return $data;
    }

    public
    function actsDelPlan($parametros, $fechaI, $fechaF)
    {
        $parametros->fechainicio = $fechaI;
        $parametros->fechafin = $fechaF;
        //Trabajo con el id-plan que me pasan por parametro.
        //busco sus actividades asociadas
        $objElemElem = new DatElementosDatElementos();
        //estados de las actividades (idtipodoc = 3)
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 3
        );
        if (isset($arrayestadosver[0])) {
            foreach ($arrayestadosver as $estado) {
                $arrayestados[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestados;
        $parametros->arrayestados = implode(',', $arrayestados);
        //Por cada plan obtengo todas sus actividades relacionadas directamente
        $arrayActHijas = $objElemElem->actHijasDePlan(
            $parametros, $parametros->idplan
        );
        //busco sus objetivos asociados para posteriormente buscar sus actividades
        //estados de los objetivos (idtipodoc = 1)
        $arrayestadosver = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 1
        );
        if (isset($arrayestadosver[0])) {
            foreach ($arrayestadosver as $estado) {
                $arrayestadosO[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestadosO;
        $parametros->arrayestados = implode(',', $arrayestadosO);
        //Por cada plan obtengo todos sus objetivos relacionadas directamente
        $arrayObjHijos = $objElemElem->obtenerObjHijosDePlan(
            $parametros, $parametros->idplan
        );
        //estados de las actividades (idtipodoc = 3)
        $arrayestadosver
            = $this->pIntegrator->workflow->EstadosVerDoc(
            $parametros->idusuario, $idtipodoc = 3
        );
        if (isset($arrayestadosver[0])) {
            foreach ($arrayestadosver as $estado) {
                $arrayestadosA[] = $estado['idestado'];
            }
        }
        $parametros->arregloestados = $arrayestadosA;
        $parametros->arrayestados = implode(',', $arrayestadosA);
        //busco si a traves de los objs hay acts hijas recursivamente
        foreach ($arrayObjHijos as $k => $obj) {
            //busco todos los objs hijos hijos y nietos etc para ver si tienen acts
            $resultado[]
                = CmpgestionaractividadesModel::buscarInferioresMismo(
                $obj['idelemento'], $resultado
            );
        }
        foreach ($resultado as $re) {
            //busco las acts hijas imediatas por cada obj
            $actsHijas = $objElemElem->actsHijasDeObj($parametros, $re);
            $arrayActHijas = array_merge($arrayActHijas, $actsHijas);
        }
        return $arrayActHijas;
    }

    public
    function diferenciaHoras($hInicio, $hFin)
    {
        $dif = date(
            "H:i:s", strtotime("00:00:00") + strtotime($hFin) - strtotime($hInicio)
        );
        $arrayH = explode(':', $dif);
        $min = $arrayH[1] / 60; //que porciento representa de una hora
        $dif = $arrayH[0] + $min;
        return $dif;
    }

    //***************Fin Graficas****************//

    public
    function EliminarAlarma($idelemento)
    {
        $result = DatActividades::EliminarAlarma($idelemento);
        return 1;
    }

    public
    function ExportarGanttApdf($parametros)
    {

    }

    public
    function porcientoLeft($idpadre)
    {
        $resultado = 100;
        $suma = 0;
        $obj = new DatElementosDatElementos();
        $hijos = $obj->ObtenerPorcientoRe($idpadre);
        foreach ($hijos as $value) {
            $suma += $value['porcientoinicio'];
        }
        if ($suma > 0) {
            $resultado = 100 - $suma;
        }
        return $resultado;
    }

    public
    function AdicionarDesdeIcal($events, $idusuario)
    {
        $objCmpgestionarelementomodel = new CmpgestionarelementoModel();
        $estadocumplimiento
            = $objCmpgestionarelementomodel->actualizarEstadoCumplimiento(
            $estadocumplimiento, 0
        );
        $estadoaprobpordefcto
            = $objCmpgestionarelementomodel->ObtenerEstadoAprobPorDefecto(
            $idusuario, $idtipodocumento = 3
        );

        $existenCoincidencias = 0;
        $arrayElementosExistentes = array();
        $arrayElementosOriginales = array();
        $contExistentes = 0;
        foreach ($events as $actividad) {

            $procede = 1;

            if (!preg_match("/^[0-9]+$/", $actividad['idelemento'])) {
                $procede = 0;
            }

            if ($procede == 1) {
                $objElemento = Doctrine::getTable('DatElementos')->find(
                    $actividad['idelemento']
                );
                if (isset($objElemento->idelemento)) {
                    $arrayElementosExistentes[$contExistentes]['idelemento']
                        = $actividad['idelemento'];
                    $arrayElementosExistentes[$contExistentes]['denelemento']
                        = $actividad['denelemento'];
                    $arrayElementosExistentes[$contExistentes]['fechainicio']
                        = $actividad['fechainicio'];
                    $arrayElementosExistentes[$contExistentes]['horainicio']
                        = $actividad['horainicio'];
                    $arrayElementosExistentes[$contExistentes]['fechafin']
                        = $actividad['fechafin'];
                    $arrayElementosExistentes[$contExistentes]['horafin']
                        = $actividad['horafin'];

                    if ($actividad['descripcion'] != "" && $actividad['descripcion'] != null
                    ) {
                        $arrayElementosExistentes[$contExistentes]['descelemento']
                            = $actividad['descripcion'];
                    }
                    if ($actividad['dirigentes'] != "" && $actividad['dirigentes'] != null
                    ) {
                        $arrayElementosExistentes[$contExistentes]['dirigentes']
                            = $actividad['dirigentes'];
                    }
                    if ($actividad['participantes'] != "" && $actividad['participantes'] != null
                    ) {
                        $arrayElementosExistentes[$contExistentes]['participantes']
                            = $actividad['participantes'];
                    }
                    if ($actividad['lugar'] != "" && $actividad['lugar'] != null
                    ) {
                        $arrayElementosExistentes[$contExistentes]['lugar']
                            = $actividad['lugar'];
                    }

                    $arrayElementosOriginales[$contExistentes]['idelemento']
                        = $objElemento->idelemento;
                    $arrayElementosOriginales[$contExistentes]['denelemento']
                        = $objElemento->denelemento;
                    $arrayElementosOriginales[$contExistentes]['descelemento']
                        = $objElemento->descelemento;
                    $arrayElementosOriginales[$contExistentes]['participantes']
                        = $objElemento->participante;
                    $arrayElementosOriginales[$contExistentes]['dirigentes']
                        = $objElemento->dirigente;

                    $objActividad = Doctrine::getTable('DatActividades')->find(
                        $actividad['idelemento']
                    );
                    $arrayElementosOriginales[$contExistentes]['fechainicio']
                        = $objActividad->fechainicio;
                    $arrayElementosOriginales[$contExistentes]['fechafin']
                        = $objActividad->fechafin;
                    $arrayElementosOriginales[$contExistentes]['horainicio']
                        = $objActividad->horainicio;
                    $arrayElementosOriginales[$contExistentes]['horafin']
                        = $objActividad->horafin;
                    $arrayElementosOriginales[$contExistentes]['lugar']
                        = $objActividad->lugar;

                    $contExistentes++;

                    $existenCoincidencias = 1;
                } else {
                    $procede = 0;
                }
            }
            if ($procede == 0) {
                $actividad['dirigentes'] = ($actividad['dirigentes']) ? $actividad['dirigentes'] : '';
                $actividad['participantes'] = ($actividad['participantes']) ? $actividad['participantes'] : '';
                $datelemento = $objCmpgestionarelementomodel->AdicionarElemento(
                    $actividad['denelemento'], $actividad['descripcion'], 0, 3, $activo = 1, $estadocumplimiento, $estadoaprobpordefcto, $idusuario, $actividad['dirigentes'], $actividad['participantes'], 0
                );
                $datactividad = new DatActividades();
                $datactividad->idactividad = $datelemento->idelemento;
                $datactividad->fechainicio
                    = $actividad['fechainicio']; //adddate($fechainicio);print_r(2);die();
                $datactividad->fechafin
                    = $actividad['fechafin']; //$this->adddate($fechafin);print_r(3);die();
                $datactividad->horainicio = $actividad['horainicio'];
                $datactividad->horafin = $actividad['horafin'];
                $datactividad->lugar = $actividad['lugar'];
                $datactividad->esprincipal = 0;
                if ($actividad['repeticion'] == 1) {
                    $datactividad->tiporepeticion = 1;
                }
                $datactividad->save();
                if ($actividad['repeticion'] == 1) {
                    $elementopadre = Doctrine::getTable('DatElementos')
                        ->findByDql(
                            "denelemento ILIKE '$datelemento->denelemento'"
                        );
                    if ($elementopadre[0]->idelemento != null) {
                        $relacion = new DatElementosDatElementos();
                        $relacion->idelementohijo = $datelemento->idelemento;
                        $relacion->idelementopadre
                            = $elementopadre[0]->idelemento;
                        $relacion->origen = 4;
                        $relacion->idautor = $idusuario;
                        $relacion->save();
                    }
                }
            }
        }
        $arrayRespuesta = array('success' => true,
            'existenCoincidencias' => $existenCoincidencias);
        if ($existenCoincidencias) {
            $arrayRespuesta['arrayElementosExistentes']
                = $arrayElementosExistentes;
            $arrayRespuesta['arrayElementosOriginales']
                = $arrayElementosOriginales;
        }

        return $arrayRespuesta;
    }

    public
    function actualizarGradoCumpObj($elementosrelacionados)
    {
        $cont = 0;
        $gradocumplimiento = 0;
        $sumaporciento = 0;
        $idobjetivo = $elementosrelacionados[0]['idelementopadre'];
        foreach ($elementosrelacionados as $key => $elemento) {
            $sumaporciento += $elemento['gradocumplimiento'];
            $cont++;
        }
        $gradocumplimiento = $sumaporciento / $cont;
        DatElementos::setGradoCumplimientoPadreAuto(
            $idobjetivo, $gradocumplimiento
        );
    }
	
	    function comprobarPermisos($parametros)
    {
		$idautoractividad = $parametros->idautoractividad;
        $idusuariosession = $parametros->idusuariosession;
		
		$respuesta = $this->comprobarPermisosWorkflow(
                $parametros->idactividad, $idusuariosession
            );

        return $respuesta;
    }

    function comprobarPermisos_old($parametros)
    {
        $idautoractividad = $parametros->idautoractividad;
        $idusuariosession = $parametros->idusuariosession;
        $respuesta = [];
        if ($idautoractividad != $idusuariosession) {
            $superior = 1;
            $arraypermisos
                = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
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

                /*********
                  Comprobar permiso por estado
                 ***********/

                /*$porestados = $this->comprobarPermisosPorEstadoWorkflow(
                        $parametros->idactividad, $idusuariosession
                    );*/
					
				$porestados = $this->comprobarPermisosWorkflow(
                    $parametros->idactividad, $idusuariosession
                );	

                if ($porestados[0]['modificar']) {
                    $modificar = $porestados[0]['modificar'];
                }
                if ($porestados[0]['eliminar']) {
                    $eliminar = $porestados[0]['eliminar'];
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
        $objElemento = Doctrine::getTable('DatElementos')->find(
            $idelemento
        );
        if (isset($objElemento->idelemento)) {
            $arraypermisos
                = $this->pIntegrator->workflow->obtenerPermisosPostAccion(
                $idusuariosession, $objElemento->idestadoaprob, $idtipoelemento = 3
            );
            return $arraypermisos;
        } else {
            $arraypermisos['modificar'] = 1;
            $arraypermisos['eliminar'] = 1;
            return $arraypermisos;
        }
    }

    public
    function comprobarPermisosPorEstadoWorkflow($idelemento, $idusuariosession)
    {
        $objElemento = Doctrine::getTable('DatElementos')->find(
            $idelemento
        );
		
        if (isset($objElemento->idelemento)) {
            $connA = Doctrine_Manager:: connection();
            $cadena = " SELECT 
                              *
                            FROM 
                              mod_flujotrabajo.dat_postconacceso
                              WHERE  idusuario = {$idusuariosession}";
							  				  
            $res = $connA->execute($cadena);
            $arraypermisos = $res->fetchAll(PDO::FETCH_ASSOC);
            return $arraypermisos;
        } else {
            $arraypermisos[0]['modificar'] = 0;
            $arraypermisos[0]['eliminar'] = 0;
            return $arraypermisos;
        }
    }

    public
    function asociarInvolucradosAct($parametros)
    {
        $arrayinvolucrados = $parametros->arrayinvolucrados;
        $arrayactividadesseleccionadas
            = $parametros->arrayactividadesseleccionadas;
        $actvSinModificar = 0;
        $actvModificada = 0;
        foreach ($arrayactividadesseleccionadas as $actividad) {
            $objelemento = Doctrine::getTable('DatElementos')->find(
                $actividad->idelemento
            );
            if (isset($objelemento->idelemento)) {
                //Verificar permisos para modificar actividad
                $idautoractividad = $objelemento->idusuariocrea;
                $idusuariosession = $this->global->Perfil->idusuario;
                $parametros->idautoractividad = $idautoractividad;
                $parametros->idusuariosession
                    = $this->global->Perfil->idusuario;
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
                    $actvModificada++;
                }
            }
        }
        if (!$actvSinModificar) {
            ($actvModificada > 0) ? $respuesta = 1 : $respuesta = 0;
        } else {
            ($actvModificada > 0) ? (($actvModificada > 1) ? $respuesta = 2 : $respuesta = 3) : $respuesta = 4;
        }
        return $respuesta;
    }

    public
    function getIdUsuario($parametros)
    {
//        try{
//            $obj = new DatElementos();
//            $idusuario = $obj->getIdUsuario($parametros);
//            return $idusuario;

//            return $parametros->usuario;
        $cadena
            = "   SELECT
                          su.idusuario
                        FROM
                          mod_seguridad.seg_usuario su                          
                        WHERE
                      su.nombreusuario = '$parametros->usuario' ";
        /*$cadena
            = "   SELECT
                          su.idusuario,
                          dp.nombre || ' ' || COALESCE(dp.snombre,'') || ' ' || dp.papel || ' ' || dp.sapel AS nombre
                        FROM
                          mod_seguridad.seg_usuario su
                          INNER JOIN mod_persona.dat_persona dp ON (su.idpersona = dp.idpersona)
                        WHERE
                      su.nombreusuario = '$parametros->usuario' ";*/

        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
//            return $result[0];
        return $result[0]['idusuario'];

//        }
//        catch(Exception $e){
//            return $e->getMessage();
//        }
    }


    public
    function AdicionarActividadImportar($parametros)
    {
//        print_r($parametros);die;
        $procede = 1;
        if ($parametros->eshija == 1) {
            $elementopadre = Doctrine::getTable('DatElementos')->find(
                $parametros->idactividadpadre
            );
            if (!isset($elementopadre->idelemento)) {
                $procede = 0;
            }
        }
        //print_r('Procede : ' . $procede . ' aaaaaaaa');die;
        if ($procede == 1) {
            $objelemmodel = new CmpgestionarelementoModel();
            /*if (isset($parametros->retornar) && $parametros->retornar == 1) {
                $estadoaprobpordefcto = $parametros->idestadoaprob;
            } else {
                $estadoaprobpordefcto
                    = $objelemmodel->ObtenerEstadoAprobPorDefecto(
                    $parametros->idusuariocrea, $idtipodocumento = 3
                );
            }*/
            if (!empty($parametros->idestado)) {
                $estadoaprobpordefcto = $parametros->idestado;
            } else {
                $estadoaprobpordefcto
                    = $objelemmodel->ObtenerEstadoAprobPorDefecto(
                    $parametros->idusuariocrea, $idtipodocumento = 3
                );
            }

            //validar si retorna null....
            $estadocumplimiento
                = $objelemmodel->actualizarEstadoCumplimiento(
                $estadocumplimiento, $parametros->gradocumplimiento
            );

            //se crea el objeto 'elemento' y se registra
            $objCmpgestionarelementomodel = new CmpgestionarelementoModel();
            $datelemento = $objCmpgestionarelementomodel->AdicionarElemento(
                $parametros->denelemento, $parametros->descelemento, $parametros->gradocumplimiento, $parametros->idtipoelemento, $activo = 1, $estadocumplimiento, $estadoaprobpordefcto, $parametros->idusuariocrea, $parametros->dirigentes, $parametros->participantes, $parametros->autoManual, $parametros->peso
            );

            if (isset($datelemento->idelemento)) {
                $parametros->idelemento = $datelemento->idelemento;
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
                $objelemelem->idelementopadre
                    = $parametros->idactividadpadre;
                $objelemelem->idelementohijo = $datelemento->idelemento;
                $objelemelem->origen = $origen;
                $objelemelem->idautor = $parametros->idusuariocrea;
                $objelemelem->porcientoinicio = $parametros->porcientoRe;
                $objelemelem->ponderacion
                    = ($parametros->porcientoRe) / 10;
                $objelemelem->save();
            }
            //se crea el objeto 'nomenclador-elemento' y se registra
            $objelemnom = new DatElementosNomNomencladorModel();
            if ($parametros->idcategoria) {
                $elemnomcateg = $objelemnom->AdicionarRelacionNomElem(
                    $datelemento, $parametros->idcategoria, $tiponomenclador = 2
                );
            }
            if ($parametros->idtipo) {
                $elemnomtipo = $objelemnom->AdicionarRelacionNomElem(
                    $datelemento, $parametros->idtipo, $tiponomenclador = 3
                );
            }
            //esto ta loco
            if ($parametros->idrecursoasociado) {
                foreach ($parametros->idrecursoasociado as $key => $recurso) {
                    $elemrecursoactividad
                        = $objelemnom->AdicionarRelacionNomElem(
                        $datelemento, $recurso, $tiponomenclador = 5
                    );
                }
            }

            //se crea el objeto 'actividad' y se registra
            $datactividad = new DatActividades();
            $datactividad->idactividad = $datelemento->idelemento;
            $datactividad->fechainicio = $parametros->fechainicio;
            $datactividad->fechafin = $parametros->fechafin;
            $datactividad->horainicio = $parametros->horainicio;
            $datactividad->horafin = $parametros->horafin;
            $datactividad->lugar = $parametros->lugar;
            $datactividad->esprincipal = $parametros->principal;
            $datactividad->tiempoestimado = ($parametros->tiempoestimado == '') ? 0 : $parametros->tiempoestimado;
            $datactividad->criterioevaluacion = $parametros->criterioeval;
            $datactividad->categoria = $parametros->denomcategoria;
            $datactividad->tipo = $parametros->denomtipo;
            $datactividad->duracion = $parametros->duracion;
            $datactividad->save();
            $parametros->idactividad = $datelemento->idelemento;
            //se relacionan los involucrados al elemento o actividad
            $objCmpgestionarelementomodel->InvolucrarUsuariosAElementos(
                $parametros->arrayinvolucrados, $datelemento->idelemento, $parametros->idtipoelemento
            );

            //se relacionan los elementos relacionados
            if (isset($parametros->documentos[0])) {
                foreach ($parametros->documentos as $key => $iddocumento) {
                    $objAsociarDoc = new DatElementosDocumento();
                    $objAsociarDoc->idelemento = $datelemento->idelemento;
                    $objAsociarDoc->iddocumento = $iddocumento->id;
                    $objAsociarDoc->save();
                }
            }
            if (isset($parametros->arrayelementosrelacionados)) {
                $objCmpgestionarelementomodel->RelacionarElementosAElementos(
                    $datelemento->idelemento, $parametros->idtipoelemento, $parametros->arrayelementosrelacionados, $parentrelacidelemento = 'hijo', $parametros->idusuariocrea
                );
            }

            //procedo a crear las repeticiones de actividad
            if (isset($parametros->arrayrepeticiones[0])) {
                $this->AdicionarRepeticionesActividad(
                    $parametros->arrayelementosrelacionados, $datelemento, $datactividad, $parametros->arrayrepeticiones, $parametros->arrayinvolucrados, $parametros->idcategoria, $parametros->idtipo, $estadocumplimiento, $parametros->principal, $parametros->idusuariocrea
                );
            }
            if ($parametros->retornar == 1) {
                return $datactividad;
            }


            //Notificacion
            //***historial***
            $arrayinvolucrados = array();
            foreach ($parametros->arrayinvolucrados as $involucrado) {
                $arrayinvolucrados[] = $involucrado->idusuario;
            }
            $involucradoshisto = implode(',', $arrayinvolucrados);
            //***fin historial**
            $objcmpgestionaractividadesmodel = new CmpgestionaractividadesModel();
            $objcambiohorario = $objcmpgestionaractividadesmodel->CambioHorario(
                $parametros
            );
            $accion = 1;
            $idelemento = $parametros->idactividad;
            $idtipoelemento = 3;
            $idautor = $parametros->idusuariocrea;
            //$arrayinvol = $parametros->arrayinvolucrados;
            $fecha = date('d/m/Y H:i:s');
            $objNotificacion = new CmpnotificacionesModel();
            $objNotificacion->generarNotificacion(
                $accion, $idelemento, $idtipoelemento, $idautor, $fecha, $objcambiohorario, $parametros, $involucradoshisto
            );
            /* actualizo los valores de sus padres (grado de cumplimiento)
              en dependencia de todos sus hijos */
            /* if ($parametros->eshija == 1) {
              self::actualizarPorcientoPadre($datelemento->idelemento);
              } */
            /* actualizo los valores de los objetivos con los que est� relacionada
             * la actividad (% de cumplimiento) */
            $arrayobjvs = DatElementosDatElementos::obtenerElemenRelacionados(
                $datelemento->idelemento, 1
            );
            if (isset($arrayobjvs[0])) {
                self::actualizarObjvsRelacionados($arrayobjvs);
            }
            /* actualizo el % de cumplimiento de los planes con los
             * que est� relacionada la actividad */
            $arrayPlanesE = DatElementosDatElementos::obtenerElemenRelacionados(
                $datelemento->idelemento, 0
            );
            $arrayPlanesA = DatElementosDatElementos::obtenerPlanRelacionadoARC(
                $datelemento->idelemento
            );
            $arrayPlanes = array_merge($arrayPlanesE, $arrayPlanesA);

            if (isset($arrayPlanes[0])) {
                CmpgestionarplanModel::actualizarPorcientoPlan($arrayPlanes);
            }
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
//            $emailparticipantes = self::extract_email_address(
//                $parametros->participantes
//            );
//            $emaildirigentes = self::extract_email_address(
//                $parametros->dirigentes
//            );
            $parametros->emails = array_merge(
                $parametros->emails/*, $emailparticipantes, $emaildirigentes*/, $emailinvolucrados
            );
            $parametros->asunto = 'Nueva Actividad';
            if (count($parametros->emails) > 0)
                self::enviarCorreoImportar($parametros);

        }
        return $parametros->idactividad;
    }

    function buscarInferioresPert(
        $idelementopadre, &$resultado, $comparacion = '<=', $origen = 3,
        $tipoelemento = 9
    )
    {
        $existerelacion = Doctrine::getTable('DatElementosDatElementos')
            ->findByDql(
                "idelementopadre = '$idelementopadre' AND origen $comparacion $origen"
            );
        if ($existerelacion[0]->idelementohijo != null) {
            foreach ($existerelacion as $relacion) {
                $valor = self::buscarInferioresPert(
                    $relacion->idelementohijo, $resultado, $comparacion,
                    $origen, $tipoelemento
                );
                if ($valor != 0) {
                    $resultado[] = $valor;
                }
            }
        }
        //print_r($resultado);
        $elemento = Doctrine::getTable('DatElementos')
            ->findByDql(
                "idelemento = '$idelementopadre' AND idtipoelemento = $tipoelemento"
            );
        if ($elemento[0]->idelemento != null) {
            return $idelementopadre;
        }
        return 0;
    }

    public function buscarGrupoHitos($arrayHitos)
    {
        //print_r($arrayHitos);die;
        $arrayGroup = array();
        foreach ($arrayHitos as $key => $idhito) {
            $elemento = Doctrine::getTable('DatElementos')->findByDql(
                "idelemento = '$idhito'"
            );
            if ($elemento[0]->idelemento
                != null
            ) { //{key: 5, text: "Epsilon", color: "green", isGroup: true}
                $arrayGroup[$key]['key'] = $elemento[0]->idelemento;
                $arrayGroup[$key]['text'] = $elemento[0]->denelemento;
                $arrayGroup[$key]['isGroup'] = true;
                $arrayGroup[$key]['color'] = "#5F5F5F";
            }
        }
        return $arrayGroup;
    }

    public function buscarInvolucradosAct($parametros)
    {
        $denominacion = $parametros->denelemento;
        $idusuario = $parametros->idusuariocrea;
        $estamodificando = 1;
        $idelemento = $parametros->idelemento;
        $idtipoelemento = $parametros->idtipoelemento;
        $permiso = 'adicionar';
        $resultado = $this->pIntegrator->configuracionpdo->BuscarInvolucrados(
            $denominacion, $idusuario, $estamodificando, $idelemento,
            $idtipoelemento, $permiso
        );
        return $resultado;
    }

//
//    public function getDenominacionIdUsuario($iduser)
//    {
//        return $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
//            $iduser, 'usuario', null
//        );
//    }
}
