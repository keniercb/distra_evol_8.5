<?php

/**
 * @author
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpgestionarplantillaModel extends ZendExt_Model
{

    public function CmpgestionarplantillaModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para cargar las plantillas
     */
    public function cargarProyectos($parametros)
    {
        $objDatProyecto = new DatProyecto();
        $arrayautoresact = array();
        $arrayinvolact = array();
        $cero = 0;
        $uno = 1;
        if (isset($parametros->arrayinvolucrados[0])) {
            foreach ($parametros->arrayinvolucrados as $involucrado) {
                $id = $involucrado->idusuario;
                if ($involucrado->tipo == 0) {
                    $id = $involucrado->idgrupo;
                }
                $arrayinvolact[] = $id; //. $cero;
                $arrayinvolact[] = $id; //. $uno;
                if ($involucrado->tipo == 1) {
                    $arraygrupos = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                        $id
                    );
                    if (isset($arraygrupos[0])) {
                        foreach ($arraygrupos as $grupo) {
                            $arrayinvolact[] = $grupo['idgrupo']; // . $cero;
                            $arrayinvolact[] = $grupo['idgrupo']; // . $uno;
                        }
                    }
                }
                if ($involucrado->tipo == 2) {
                    $datosestructura = $this->integrator->metadatos->DameEstructura(
                        $involucrado->idinvolucrado
                    );
                    $id = $datosestructura[0]->idestructura;
                    $arrayinvolact[] = $id; // . $uno;
                }
            }
        }
        if (isset($parametros->arrayautores[0])) {
            foreach ($parametros->arrayautores as $autor) {
                $idautor = $autor->idautor;
                if ($autor->tipo == 0) {
                    $arrayusuarios = $this->pIntegrator->configuracionpdo->DameUsuariosDeGrupo(
                        $idautor
                    );
                    if (isset($arrayusuarios[0])) {
                        foreach ($arrayusuarios as $usuario) {
                            $arrayautoresact[] = $idautor;
                        }
                    }
                } else {
                    $arrayautoresact[] = $idautor;
                }
            }
        }
        if (isset($arrayautoresact)) {
            $arrayautoresact = implode(',', $arrayautoresact);
        }
        if (isset($arrayinvolact)) {
            $arrayinvolact = implode(',', $arrayinvolact);
        }
        $parametros->arrayautores = $arrayautoresact;
        $parametros->arrayinvolucrados = $arrayinvolact;
        $arrayElementos = $objDatProyecto->cargarElementos($parametros);
        $elementos['total'] = $arrayElementos['total'];
        if (isset($arrayElementos['resultado'])) {
            foreach ($arrayElementos['resultado'] as $key => $elemen) {
                $parent = null;
                if ($parametros->anode) {
                    $parent = $parametros->anode;
                }
                $parametros->idelementopadre = $elemen['idelemento'];
                $tienehijos = $objDatProyecto->tieneHijos($parametros);
                $leaf = true;
                if ($tienehijos['total'] > 0) {
                    $leaf = false;
                }
                $leafSt = "true";
                if ($tienehijos['total'] > 0) {
                    $leafSt = "false";
                }
                $superior = 0;
                if ($elemen['idusuariocrea'] != $parametros->idusuariocrea) {
                    $superior = 1;
                }
                //Formar la respuesta
                //si elemento es proyecto
                if ($elemen['idtipoelemento'] == 8) {
                    $elementos['resultado'][$key]['identificador'] = $elemen['identificador'];
                    $elementos['resultado'][$key]['idprioridad'] = $elemen['idprioridad'];
                }
                //si elemento es tarea
                if ($elemen['idtipoelemento'] == 10) {
                    $elementos['resultado'][$key]['plantilla'] = $elemen['plantillat'];
                    $elementos['resultado'][$key]['fechainicio'] = $elemen['fechainiciot'];
                    $elementos['resultado'][$key]['horainicio'] = $elemen['horainicio'];
                    $elementos['resultado'][$key]['fechafin'] = $elemen['fechafint'];
                    $elementos['resultado'][$key]['horafin'] = $elemen['horafin'];
                    $elementos['resultado'][$key]['duracionreal'] = $elemen['duracionrealt'];
                    $elementos['resultado'][$key]['duracionestimada'] = $elemen['duracionestimadat'];
                    $elementos['resultado'][$key]['idevaluacion'] = $elemen['idevaluacion'];
                    $elementos['resultado'][$key]['lugar'] = $elemen['lugar'];
                    $elementos['resultado'][$key]['evento'] = $elemen['evento'];
                    $elementos['resultado'][$key]['esprincipal'] = $elemen['esprincipal'];
                    $elementos['resultado'][$key]['origen'] = $elemen['origen'];

                    $elementos['resultado'][$key]['unidadmedida'] = $elemen['unidadmedida'];
                    $elementos['resultado'][$key]['valorreal'] = $elemen['valorreal'];
                    $elementos['resultado'][$key]['valormeta'] = $elemen['valormeta'];
                    $elementos['resultado'][$key]['costo'] = $elemen['costo'];
                    $elementos['resultado'][$key]['costototal'] = $elemen['valormeta'] * $elemen['costo'];
                } else {
                    $elementos['resultado'][$key]['plantilla'] = $elemen['plantilla'];
                    $elementos['resultado'][$key]['fechainicio'] = $elemen['fechainicio'];
                    $elementos['resultado'][$key]['fechafin'] = $elemen['fechafin'];
                    $elementos['resultado'][$key]['duracionreal'] = $elemen['duracionreal'];
                    $elementos['resultado'][$key]['duracionestimada'] = $elemen['duracionestimada'];

                    $elementos['resultado'][$key]['unidadmedida'] = '-';
                    $elementos['resultado'][$key]['valorreal'] = '-';
                    $elementos['resultado'][$key]['valormeta'] = '-';
                    $elementos['resultado'][$key]['costo'] = '-';
                    $elementos['resultado'][$key]['costototal'] = '-';
                }
                $denominacion = str_ireplace('"', '%', $elemen['denelemento']);
                $elementos['resultado'][$key]['nombreautor'] = $this->integrator->seguridad->nombreUsuario(
                    $elemen['idusuariocrea']
                );
                $elementos['resultado'][$key]['idelemento'] = $elemen['idelemento'];
                $elementos['resultado'][$key]['idautor'] = $elemen['idusuariocrea'];
                $elementos['resultado'][$key]['_parent'] = $parent;
                $elementos['resultado'][$key]['_is_leaf'] = $leaf;
                $elementos['resultado'][$key]['hoja'] = $leafSt;
                $elementos['resultado'][$key]['denominacion'] = self::Mayus(
                    $denominacion
                ); //self::Mayus($denominacion);
                $elementos['resultado'][$key]['gradocumplimiento'] = $elemen['gradocumplimiento'];
                $elementos['resultado'][$key]['tipoelemento'] = $elemen['idtipoelemento'];
                $elementos['resultado'][$key]['textocumplimiento'] = $elemen['estadocumplimiento'];
                $elementos['resultado'][$key]['estadocumplimiento'] = $elemen['estadocumplimiento'] . "("
                    . $elemen['gradocumplimiento'] . "%)";
                $elementos['resultado'][$key]['observaciones'] = $elemen['cantobserv'];
                $elementos['resultado'][$key]['denoestado'] = $elemen['denoestado'];
                $elementos['resultado'][$key]['idestadoaprob'] = $elemen['idestadoaprob'];
                $elementos['resultado'][$key]['superior'] = $superior;
                if ($elemen['idtipoelemento'] == 8) {
                    $idplantilla = $elemen['idelemento'];
                } else {
                    $temp = array();
                    self::getProyectoPadre($elemen['idelemento'], $temp);
                    $idplantilla = $temp[0]['idelemento'];
                }
                $elementos['resultado'][$key]['idplantilla'] = $idplantilla;
            }
        }
        //print_r($elementos);die;
        return $elementos;
    }

    //funciÃ³n para convertir un string a mayÃºsculas
    public function Mayus($variable)
    {
        setlocale(LC_CTYPE, 'es');
        //$variable = strtr(strtoupper($variable),"àèìòùáéíóúçñäëïöü","ÀÈÌÒÙÁÉÍÓÚÇÑÄËÏÖÜ");
        $variable = strtr(
            strtoupper($variable), "àèìòùáéíóúçñäëïöü", "ÀÈÌÒÙÁÉÍÓÚÇÑÄËÏÖÜ"
        );
        return $variable;
    }

    /**
     * Funcion para adicionar las plantillas
     */
    public function adicionarProyecto($parametros)
    {
        //Verificar conflictos entre la fecha fin y el fondo de tiempo planificado
        /* if ($parametros->verificartiempoinvol) {
          $arrayInvolFondoTiempo = $this->verificarFondoTiempo(
          $parametros
          );
          if ($arrayInvolFondoTiempo) {
          $arrayInvolFondoTiempo['mensaje'] = 5;
          $arrayInvolFondoTiempo['fechafinact'] = $parametros->fechafin;
          return $arrayInvolFondoTiempo;
          }
          } */
        //Hay que hacer lo de flujo de trabajo
        $dm = Doctrine_Manager::getInstance();
        $con = $dm->getCurrentConnection();
        $procede = 0;
        $objDatProyecto = new DatProyecto();
        $parametros->tipo = 8;
        $parametros->denelemento = $this->Mayus($parametros->denelemento);
        $elemen = $objDatProyecto->adicionarElemento($parametros);
        $parametros->idElemen = $elemen[0]['idelemento'];
        //$parametros->identificacion = self::generarIdentificadorPlantillaProyecto($parametros->identificacion, $parametros->plantilla);
        //verifico si existe el identificador en BD
        if (self::existeIdentificador($parametros->identificacion)) {
            return $procede;
        } else {
            //Add en dat-proyecto
            $objDatProyecto->idproyecto = $parametros->idElemen;
            $objDatProyecto->idprioridad = $parametros->idprioridad; //9000000395
            $objDatProyecto->identificador = $parametros->identificacion;
            //$objDatProyecto->duracionestimada = ($parametros->duracionE * 24) * 60;
            //$objelemento->duracionestimada = ($parametros->duracionE * 24) * 60;
            $parametros->duracionestimada = 0;
            if ($parametros->duracionEstimadaDias) {
                $parametros->duracionestimada = ($parametros->duracionEstimadaDias * 24) * 60;
            }
            if ($parametros->duracionEstimadaHoras) {
                $parametros->duracionestimada += ($parametros->duracionEstimadaHoras * 60);
            }
            if ($parametros->duracionEstimadaMinutos) {
                $parametros->duracionestimada += $parametros->duracionEstimadaMinutos;
            }
            $objDatProyecto->duracionestimada = round(
                $parametros->duracionestimada
            );
            $objDatProyecto->duracionreal = $parametros->duracionR;
            $objDatProyecto->plantilla = $parametros->plantilla;
            if ($parametros->fechainicio != '') {
                $objDatProyecto->fechainicio = $parametros->fechainicio;
                $objDatProyecto->fechafin = $parametros->fechafin;
            }
            $objDatProyecto->save();
            $con->commit();
            $con->beginTransaction();
            //Add categoria del proyecto
            if ($parametros->idcategoria != '') {
                $parametros->tiponomenclador = 14;
                $objDatProyecto->adicionarNomenclador($parametros);
            }
            //Add prioridad del proyecto
            if ($parametros->idprioridad != '') {
                $parametros->tiponomenclador = 19;
                $parametros->idcategoria = $parametros->idprioridad;
                $objDatProyecto->adicionarNomenclador($parametros);
            }
            //procedo a insertar los involucrados en el proyecto
            $this->pIntegrator->planpdo->insertarInvolucradosTarea(
                $parametros->arrayinvolucrados, $parametros->idElemen, $parametros->tipo
            );
            //procedo a insertar la estructura que crea
            if ($parametros->idEstructura) {
                $elemenEstrucCrea = new DatElementoEstructuraCrea();
                $elemenEstrucCrea->addElementoEstructuraCrea(
                    $parametros->idElemen, $parametros->idEstructura
                );
            }
            $procede = $parametros->idElemen;
            return $procede;
        }
    }


    /**********
     * Hijos directos del elemento importado
     **********/

    public function getHijosElementoImportado($rows, $nro)
    {
        $liste_element = array();
        $i = 0;
        foreach ($rows as $row) {
            // get each column by tag name
            $cols = $row->getElementsByTagName('td');

            if ($cols->item(7)->nodeValue == $nro) {
                $liste_element[$i]['nro'] = $cols->item(0)->nodeValue;
                $liste_element[$i]['nivel'] = $cols->item(1)->nodeValue;
                $liste_element[$i]['denominacion'] = $cols->item(2)->nodeValue;
                $liste_element[$i]['fechainicio'] = $cols->item(3)->nodeValue;
                $liste_element[$i]['fechafin'] = $cols->item(4)->nodeValue;
                $liste_element[$i]['horainicio'] = $cols->item(5)->nodeValue;
                $liste_element[$i]['horafin'] = $cols->item(6)->nodeValue;
                $i++;
            }
        }
        return $liste_element;
    }

    /**********
     * Gets id elemento padre
     **********/

    public function getIdPadreSistema($liste_element, $nro_padre)
    {
        foreach ($liste_element as $key => $row) {
            if ($nro_padre == $row['nro']) {
                return array('idelementosistema' => $row['idelementosistema']
                , 'tipo' => $row['nivel']);
            }
        }
        return array();
    }


    /**
     * Funcion para adicionar Hijos de elementos importados
     */
    public function adicionarElementoImportado($parametros, $liste_element)
    {
        try {
            if (count($liste_element) > 0) {
                foreach ($liste_element as $key => $row) {
                    $tipoelemento = $row['nivel'];
                    switch ($tipoelemento) {
                        case "proyecto":
                            $params_proyecto->idusuariocrea = $parametros->idusuariocrea;
                            $params_proyecto->denelemento = $row['denominacion'];
                            $params_proyecto->descelemento = '';
                            $params_proyecto->idcategoria = null;
                            $params_proyecto->idprioridad = null;
                            $params_proyecto->idestadocump = 'Sin cumplir';
                            $params_proyecto->fechainicio = $row['fechainicio'];
                            $params_proyecto->fechafin = $row['fechafin'];
                            $params_proyecto->duracionE = $row['duracionestimada'];
                            $tiempo_duracionestimada = self::getduracionDias_Horas_Minutos($row['duracionestimada']);
                            $params_proyecto->duracionEstimadaDias = $tiempo_duracionestimada['dias'];
                            $params_proyecto->duracionEstimadaHoras = $tiempo_duracionestimada['horas'];
                            $params_proyecto->duracionEstimadaMinutos = $tiempo_duracionestimada['minutos'];
                            $params_proyecto->identificacion = rand(100, 100000);
                            $params_proyecto->duracionR = 0;
                            $params_proyecto->idrecursoasociado = [];
                            $params_proyecto->porcientocump = 0;
                            $params_proyecto->plantilla = $row['plantilla'];
                            $params_proyecto->arrayinvolucrados = [];
                            $params_proyecto->verificartiempoinvol = 0;
                            $params_proyecto->idEstructura = $parametros->idEstructura;

                            $params_proyecto->nro = $row['nro'];
                            $params_proyecto->nivel = $row['nivel'];
                            $params_proyecto->horainicio = $row['horainicio'];
                            $params_proyecto->horafin = $row['horafin'];
                            $idproyecto = self::adicionarProyectoImportado($params_proyecto);
                            $liste_element[$key]['idelementosistema'] = $idproyecto;
                            break;
                        case "plantilla":
                            $params_proyecto->idusuariocrea = $parametros->idusuariocrea;
                            $params_proyecto->denelemento = $row['denominacion'];
                            $params_proyecto->descelemento = '';
                            $params_proyecto->idcategoria = null;
                            $params_proyecto->idprioridad = null;
                            $params_proyecto->idestadocump = 'Sin cumplir';
                            $params_proyecto->fechainicio = $row['fechainicio'];
                            $params_proyecto->fechafin = $row['fechafin'];
                            $params_proyecto->duracionE = $row['duracionestimada'];
                            $tiempo_duracionestimada = self::getduracionDias_Horas_Minutos($row['duracionestimada']);
                            $params_proyecto->duracionEstimadaDias = $tiempo_duracionestimada['dias'];
                            $params_proyecto->duracionEstimadaHoras = $tiempo_duracionestimada['horas'];
                            $params_proyecto->duracionEstimadaMinutos = $tiempo_duracionestimada['minutos'];
                            $params_proyecto->identificacion = rand(100, 100000);
                            $params_proyecto->duracionR = 0;
                            $params_proyecto->idrecursoasociado = [];
                            $params_proyecto->porcientocump = 0;
                            $params_proyecto->plantilla = $row['plantilla'];
                            $params_proyecto->arrayinvolucrados = [];
                            $params_proyecto->verificartiempoinvol = 0;
                            $params_proyecto->idEstructura = $parametros->idEstructura;

                            $params_proyecto->nro = $row['nro'];
                            $params_proyecto->nivel = $row['nivel'];
                            $params_proyecto->horainicio = $row['horainicio'];
                            $params_proyecto->horafin = $row['horafin'];
                            $idproyecto = self::adicionarProyectoImportado($params_proyecto);
                            $liste_element[$key]['idelementosistema'] = $idproyecto;
                            break;
                        case "hito":
                            $infopadre = self::getIdPadreSistema($liste_element, $row['padre']);
                            if (count($infopadre) > 0) {
                                $idpadre = $infopadre['idelementosistema'];
                            } else {
                                $idpadre = $parametros->idelemento;
                            }
                            $parametros_hito->idusuariocrea = $parametros->idusuariocrea;
                            $parametros_hito->denelemento = $row['denominacion'];
                            $parametros_hito->descelemento = '';
                            $parametros_hito->idcategoria = null;
                            $parametros_hito->idestadocump = 'Sin cumplir';
                            $parametros_hito->idEstructura = $parametros->idEstructura;
                            $parametros_hito->fechainicio = $row['fechainicio'];
                            $parametros_hito->fechafin = $row['fechafin'];
                            $parametros_hito->duracionE = $row['duracionestimada'];
                            $tiempo_duracionestimada = self::getduracionDias_Horas_Minutos($row['duracionestimada']);
                            $parametros_hito->duracionEstimadaDias = $tiempo_duracionestimada['dias'];
                            $parametros_hito->duracionEstimadaHoras = $tiempo_duracionestimada['horas'];
                            $parametros_hito->duracionEstimadaMinutos = $tiempo_duracionestimada['minutos'];
                            $parametros_hito->duracionR = 0;
                            $parametros_hito->peso = 1;
                            $parametros_hito->porcientocump = 0;
                            $parametros_hito->plantilla = $row['plantilla'];
                            $parametros_hito->idpadre = $idpadre;
                            $parametros_hito->idautorpadre = $parametros->idusuariocrea;
                            $parametros_hito->tipopadre = 8;
                            $parametros_hito->arrayinvolucrados = [];
                            $parametros_hito->verificartiempoinvol = 0;
                            $idhito = self::adicionarHitoImportado($parametros_hito);
                            $liste_element[$key]['idelementosistema'] = $idhito;
                            break;
                        case "tarea":
                            $infopadre = self::getIdPadreSistema($liste_element, $row['padre']);
                            if (count($infopadre) > 0) {
                                $idpadre = $infopadre['idelementosistema'];
                                if ($infopadre['tipo'] == 'proyecto') {
                                    $tipopadre = 8;
                                } else if ($infopadre['tipo'] == 'hito') {
                                    $tipopadre = 9;
                                } else {
                                    $tipopadre = 10;
                                }
                            } else {
                                $idpadre = $parametros->idelemento;
                                if ($parametros->tipo == 'proyecto') {
                                    $tipopadre = 8;
                                } else if ($parametros->tipo == 'hito') {
                                    $tipopadre = 9;
                                } else {
                                    $tipopadre = 10;
                                }

                            }
                            $parametros_tareas->idusuariocrea = $parametros->idusuariocrea;
                            $parametros_tareas->denelemento = $row['denominacion'];
                            $parametros_tareas->descelemento = '';
                            $parametros_tareas->idcategoria = null;
                            $parametros_tareas->idestadocump = 'Sin cumplir';
                            $parametros_tareas->fechainicio = $row['fechainicio'];
                            $parametros_tareas->fechafin = $row['fechafin'];
                            $parametros_tareas->horainicio = $row['horainicio'];
                            $parametros_tareas->horafin = $row['horafin'];
                            $parametros_tareas->idEstructura = $parametros->idEstructura;
                            $parametros_tareas->duracionE = $row['duracionestimada'];
                            $tiempo_duracionestimada = self::getduracionDias_Horas_Minutos($row['duracionestimada']);
                            $parametros_tareas->duracionEstimadaDias = $tiempo_duracionestimada['dias'];
                            $parametros_tareas->duracionEstimadaHoras = $tiempo_duracionestimada['horas'];
                            $parametros_tareas->duracionEstimadaMinutos = $tiempo_duracionestimada['minutos'];
                            $parametros_tareas->tiempooptimistaDias = 0;
                            $parametros_tareas->tiempooptimistaHoras = 0;
                            $parametros_tareas->tiempooptimistaMinutos = 0;
                            $parametros_tareas->tiempomedioDias = 0;
                            $parametros_tareas->tiempomedioHoras = 0;
                            $parametros_tareas->tiempomedioMinutos = 0;
                            $parametros_tareas->tiempopesimistaDias = 0;
                            $parametros_tareas->tiempopesimistaHoras = 0;
                            $parametros_tareas->tiempopesimistaMinutos = 0;
                            $parametros_tareas->duracionR = 0;
                            $parametros_tareas->peso = 1;
                            $parametros_tareas->porcientocump = 0;
                            $parametros_tareas->criterioeval = null;
                            $parametros_tareas->idtipotarea = null;
                            $parametros_tareas->lugar = null;
                            $parametros_tareas->principal = 0;
                            $parametros_tareas->plantilla = $row['plantilla'];
                            $parametros_tareas->idpadre = $idpadre;
                            $parametros_tareas->idautorpadre = $parametros->idusuariocrea;
                            $parametros_tareas->evento = 'vacio';
                            $parametros_tareas->tipopadre = $tipopadre;
                            $parametros_tareas->arrayrepeticiones = [];
                            $parametros_tareas->arrayinvolucrados = [];
                            $parametros_tareas->arrayelementosrelacionados = [];
                            $parametros_tareas->recursoasociado = [];
                            $parametros_tareas->verificartiempoinvol = 0;
                            $parametros_tareas->idSubsistema = 2;
                            $parametros_tareas->unidadmedida = null;
                            $parametros_tareas->valorreal = 0;
                            $parametros_tareas->valormeta = 0;
                            $parametros_tareas->costo = 0;
                            $parametros_tareas->clave = null;
                            $idtarea = self::adicionarTareaImportada($parametros_tareas);
                            $liste_element[$key]['idelementosistema'] = $idtarea;
                            break;
                    }
                }
                /*************************
                 * Relaciones entre actividades
                 *************************************/

                //print_r($liste_element);die;
                foreach ($liste_element as $key => $row) {
                    $tipoelemento = $row['nivel'];
                    if ($tipoelemento == 'tarea' && $row['dependencia'] !== "") {
                        $parametros_relaciones->idusuario = $parametros->idusuariocrea;
                        $array_dependencias = explode(',', $row['dependencia']);
                        $parametros_relaciones->arraydependencias = self::getArrayIdRelaciones($liste_element, $array_dependencias);
                        $parametros_relaciones->origen = 6;
                        $parametros_relaciones->idelementohijo = $row['idelementosistema'];
                        $parametros_relaciones->porcientoinicio = 0;
                        $dependenciaModel = new DependenciaModel();
                        $parametros_relaciones->idmodulo = 2;
                        $result = $dependenciaModel->GenerarDependencia($parametros_relaciones);
                    }
                }

            }
            return 1;
        } catch (Exception $e) {
            return 0;
        }
    }

    public function getArrayIdRelaciones($liste_element, $array_dependencias)
    {
        $resultado = array();
        $pos = 0;
        foreach ($liste_element as $key => $row) {
            if (in_array(floatval($row['CAR']), $array_dependencias)) {
                $resultado[$pos] = $row['idelementosistema'];
                $pos++;
            }
        }
        return $resultado;
    }


    /**
     * Funcion para adicionar los proyectos importados
     */
    public function adicionarProyectoImportado($parametros)
    {

        //Hay que hacer lo de flujo de trabajo
        $dm = Doctrine_Manager::getInstance();
        $con = $dm->getCurrentConnection();
        $procede = 0;
        $objDatProyecto = new DatProyecto();
        $parametros->tipo = 8;
        $parametros->denelemento = $this->Mayus($parametros->denelemento);
        $elemen = $objDatProyecto->adicionarElemento($parametros);
        $parametros->idElemen = $elemen[0]['idelemento'];
        //$parametros->identificacion = self::generarIdentificadorPlantillaProyecto($parametros->identificacion, $parametros->plantilla);
        //verifico si existe el identificador en BD
        if (self::existeIdentificador($parametros->identificacion)) {
            return $procede;
        } else {
            //Add en dat-proyecto
            $objDatProyecto->idproyecto = $parametros->idElemen;
            $objDatProyecto->idprioridad = $parametros->idprioridad; //9000000395
            $objDatProyecto->identificador = $parametros->identificacion;
            //$objDatProyecto->duracionestimada = ($parametros->duracionE * 24) * 60;
            //$objelemento->duracionestimada = ($parametros->duracionE * 24) * 60;
            $parametros->duracionestimada = 0;
            if ($parametros->duracionEstimadaDias) {
                $parametros->duracionestimada = ($parametros->duracionEstimadaDias * 24) * 60;
            }
            if ($parametros->duracionEstimadaHoras) {
                $parametros->duracionestimada += ($parametros->duracionEstimadaHoras * 60);
            }
            if ($parametros->duracionEstimadaMinutos) {
                $parametros->duracionestimada += $parametros->duracionEstimadaMinutos;
            }
            $objDatProyecto->duracionestimada = round(
                $parametros->duracionestimada
            );
            $objDatProyecto->duracionreal = $parametros->duracionR;
            $objDatProyecto->plantilla = $parametros->plantilla;
            if ($parametros->fechainicio != '') {
                $objDatProyecto->fechainicio = $parametros->fechainicio;
                $objDatProyecto->fechafin = $parametros->fechafin;
            }

            $objDatProyecto->save();
            $con->commit();
            $con->beginTransaction();
            //Add categoria del proyecto
            if ($parametros->idcategoria != '') {
                $parametros->tiponomenclador = 14;
                $objDatProyecto->adicionarNomenclador($parametros);
            }
            //Add prioridad del proyecto
            if ($parametros->idprioridad != '') {
                $parametros->tiponomenclador = 19;
                $parametros->idcategoria = $parametros->idprioridad;
                $objDatProyecto->adicionarNomenclador($parametros);
            }
            //procedo a insertar los involucrados en el proyecto
            $this->pIntegrator->planpdo->insertarInvolucradosTarea(
                $parametros->arrayinvolucrados, $parametros->idElemen, $parametros->tipo
            );
            //procedo a insertar la estructura que crea
            if ($parametros->idEstructura) {
                $elemenEstrucCrea = new DatElementoEstructuraCrea();
                $elemenEstrucCrea->addElementoEstructuraCrea(
                    $parametros->idElemen, $parametros->idEstructura
                );
            }
            $procede = $parametros->idElemen;
            return $procede;
        }
    }


    /************
     * Adicionar hito importado
     ***********/

    public function adicionarHitoImportado($parametros)
    {
        //Verificar conflictos entre la fecha fin y el fondo de tiempo planificado
        if ($parametros->verificartiempoinvol) {
            $arrayInvolFondoTiempo = $this->verificarFondoTiempo(
                $parametros
            );
            if ($arrayInvolFondoTiempo) {
                $arrayInvolFondoTiempo['mensaje'] = 5;
                $arrayInvolFondoTiempo['fechafinact']
                    = $parametros->fechafin;
                return $arrayInvolFondoTiempo;
            }
        }

        //Hay que hacer lo de flujo de trabajo
        $objDatProyecto = new DatProyecto();
        $parametros->tipo = 9;
        $obj = new CmpgestionarplantillaModel();
        $parametros->denelemento = $obj->Mayus($parametros->denelemento);
        $elemen = $objDatProyecto->adicionarElemento($parametros);
        $parametros->idElemen = $elemen[0]['idelemento'];
        //Add en dat hito
        $objDatHito = new DatHito();
        $objDatHito->idhito = $parametros->idElemen;

        //$objDatHito->duracionestimada = ($parametros->duracionE * 24) * 60;
        $objDatHito->duracionestimada = 0;
        if ($parametros->duracionEstimadaDias) {
            $parametros->duracionestimada = ($parametros->duracionEstimadaDias * 24) * 60;
        }
        if ($parametros->duracionEstimadaHoras) {
            $parametros->duracionestimada += ($parametros->duracionEstimadaHoras * 60);
        }
        if ($parametros->duracionEstimadaMinutos) {
            $parametros->duracionestimada += $parametros->duracionEstimadaMinutos;
        }
        $objDatHito->duracionestimada = round($parametros->duracionestimada);

        $objDatHito->plantilla = $parametros->plantilla;
        if ($parametros->fechainicio != '') {
            $objDatHito->fechainicio = $parametros->fechainicio;
            $objDatHito->fechafin = $parametros->fechafin;
            $objDatHito->duracionreal = $parametros->duracionR;
        }
        $objDatHito->save();
        //Add categoria del hito
        if ($parametros->idcategoria != '') {
            $parametros->tiponomenclador = 15;
            $objDatProyecto->adicionarNomenclador($parametros);
        }
        //Add relacion dat-elemen-dat-elemen
        $objDatProyecto->adicionarElemenElemen($parametros);
        //procedo a insertar los involucrados en el hito
        if (isset($parametros->arrayinvolucrados[0])) {
            $this->pIntegrator->planpdo->insertarInvolucradosTarea(
                $parametros->arrayinvolucrados, $parametros->idElemen, $parametros->tipo
            );
        }
        //procedo a insertar la estructura que crea
        if ($parametros->idEstructura) {
            $elemenEstrucCrea = new DatElementoEstructuraCrea();
            $elemenEstrucCrea->addElementoEstructuraCrea(
                $parametros->idElemen, $parametros->idEstructura
            );
        }
        $procede = $parametros->idElemen;
        return $procede;
    }


    /**
     * Adicionar tarea importada
     */
    public function adicionarTareaImportada($parametros)
    {

        $dm = Doctrine_Manager::getInstance();
        $con = $dm->getCurrentConnection();
        $objDatProyecto = new DatProyecto();
        $parametros->tipo = 10;
        $obj = new CmpgestionarplantillaModel();
        $parametros->denelemento = $obj->Mayus($parametros->denelemento);
        //procedo a insertar el elemento
        $elemen = $objDatProyecto->adicionarElemento($parametros);
        $parametros->idElemen = $elemen[0]['idelemento'];

        //add en DatTarea
        $objDatTarea = new DatTarea();
        $objDatTarea->idtarea = $parametros->idElemen;
        $objDatTarea->duracionreal = $parametros->duracionR;
        $objDatTarea->plantilla = $parametros->plantilla;
        $objDatTarea->lugar = $parametros->lugar;
        $objDatTarea->evento = $parametros->evento;
        $objDatTarea->esprincipal = $parametros->principal;

        if ($parametros->porcientocump == 100) {
            $objDatTarea->fechacumplimiento = date('d/m/Y', time());
            $objDatTarea->horacumplimiento = date('H:i:s', time());
        }

        if ($parametros->fechainicio != '') {
            $objDatTarea->fechainicio = $parametros->fechainicio;
            $objDatTarea->fechafin = $parametros->fechafin;
        }

        if ($parametros->criterioeval != '') {
            $objDatTarea->idevaluacion = $parametros->criterioeval;
        } else {
            $idnomenclador = $objDatProyecto->buscaridNoEvaluado();
            $objDatTarea->idevaluacion = $idnomenclador[0]['idnomenclador'];
        }

        if ($parametros->horainicio != '') {
            $objDatTarea->horainicio = $parametros->horainicio;
            $objDatTarea->horafin = $parametros->horafin;
        }
        $objDatTarea->idtareadepende = $parametros->idtareadepende;
        $objDatTarea->dependencias = $parametros->dependencias;

        $parametros->duracionestimada = 0;
        if ($parametros->duracionEstimadaDias) {
            $parametros->duracionestimada = ($parametros->duracionEstimadaDias * 24) * 60;
        }
        if ($parametros->duracionEstimadaHoras) {
            $parametros->duracionestimada += ($parametros->duracionEstimadaHoras * 60);
        }
        if ($parametros->duracionEstimadaMinutos) {
            $parametros->duracionestimada += $parametros->duracionEstimadaMinutos;
        }
        $objDatTarea->duracionestimada = round($parametros->duracionestimada);

        $parametros->tiempooptimista = 0;
        if ($parametros->tiempooptimistaDias) {
            $parametros->tiempooptimista = ($parametros->tiempooptimistaDias * 24) * 60;
        }
        if ($parametros->tiempooptimistaHoras) {
            $parametros->tiempooptimista += ($parametros->tiempooptimistaHoras * 60);
        }
        if ($parametros->tiempooptimistaMinutos) {
            $parametros->tiempooptimista += $parametros->tiempooptimistaMinutos;
        }
        $objDatTarea->tiempooptimista = round($parametros->tiempooptimista);

        $parametros->tiempomedio = 0;
        if ($parametros->tiempomedioDias) {
            $parametros->tiempomedio = ($parametros->tiempomedioDias * 24) * 60;
        }
        if ($parametros->tiempomedioHoras) {
            $parametros->tiempomedio += ($parametros->tiempomedioHoras * 60);
        }
        if ($parametros->tiempomedioMinutos) {
            $parametros->tiempomedio += $parametros->tiempomedioMinutos;
        }
        $objDatTarea->tiempomedio = round($parametros->tiempomedio);

        $parametros->tiempopesimista = 0;
        if ($parametros->tiempopesimistaDias) {
            $parametros->tiempopesimista = ($parametros->tiempopesimistaDias * 24) * 60;
        }
        if ($parametros->tiempopesimistaHoras) {
            $parametros->tiempopesimista += ($parametros->tiempopesimistaHoras * 60);
        }
        if ($parametros->tiempopesimistaMinutos) {
            $parametros->tiempopesimista += $parametros->tiempopesimistaMinutos;
        }
        $objDatTarea->tiempopesimista = round($parametros->tiempopesimista);

        $objDatTarea->unidadmedida = $parametros->unidadmedida;
        $objDatTarea->valorreal = $parametros->valorreal;
        $objDatTarea->valormeta = $parametros->valormeta;
        $objDatTarea->costo = $parametros->costo;
        $objDatTarea->clave = $obj->Mayus($parametros->clave);

        $objDatTarea->save();
        $con->commit();
        $con->beginTransaction();
        //Add categoria de la tarea
        if ($parametros->idcategoria != '') {
            $parametros->tiponomenclador = 16;
            $objDatProyecto->adicionarNomenclador($parametros);
        }
        if ($parametros->generaproyecto) {
            $nomenclador = $objDatProyecto->buscarNomencladoridGenertarProyecto(
                $parametros->idtareadepende
            );
            foreach ($nomenclador as $key => $n) {
                $parametros->tiponomenclador = $n['tiponomenclador'];
                $parametros->idcategoria = $n['idnomenclador'];
                if ($parametros->tiponomenclador != 5) {
                    $parametros->cantidad = $n['cantidad'];
                    $objDatProyecto->adicionarNomenclador($parametros);
                }
            }
        }
        //Add criterio de evaluacion de la tarea
        if ($parametros->criterioeval != '') {
            $parametros->tiponomenclador = 18;
            $idcategoria = $parametros->idcategoria;
            $parametros->idcategoria = $parametros->criterioeval;
            $objDatProyecto->adicionarNomenclador($parametros);
            $parametros->idcategoria = $idcategoria;
        }
        //Add tipo de tarea
        if ($parametros->idtipotarea) {
            $parametros->tiponomenclador = 17;
            $idcategoria = $parametros->idcategoria;
            $parametros->idcategoria = $parametros->idtipotarea;
            $objDatProyecto->adicionarNomenclador($parametros);
            $parametros->idcategoria = $idcategoria;
        }
        //Add recursos
        if (isset($parametros->recursoasociado[0]) || $parametros->recursoasociado[0] == '') {
            $parametros->tiponomenclador = 5;
            foreach ($parametros->recursoasociado as $recurso) {
                $parametros->idcategoria = $recurso->idcategoria;
                $parametros->cantidad = ($recurso->cantidad) ? $recurso->cantidad : 1;
                if ($recurso->indicador == 0) {
                    $objDatProyecto->adicionarRecurso($parametros);
                } else {
                    $objDatProyecto->adicionarIndicador($parametros);
                }
            }
        }
        //Add relacion dat-elemen-dat-elemen
        $objDatProyecto->adicionarElemenElemen($parametros);
        //Adicionar Dependencias
        if (isset($parametros->arrayelementosrelacionados[0])) {
            foreach ($parametros->arrayelementosrelacionados as $relacion) {
                if ($relacion->tipoelemento == 10) {
                    $objDatProyecto->adicionarDependencias(
                        $parametros, $relacion
                    );
                }
            }
        }
        //procedo a crear las repeticiones de tarea
        if (isset($parametros->arrayrepeticiones[0])) {
            $this->adicionarRepeticiones($parametros);
        }
        //procedo a insertar los involucrados en la tarea
        if (isset($parametros->arrayinvolucrados[0])) {
            $this->pIntegrator->planpdo->insertarInvolucradosTarea(
                $parametros->arrayinvolucrados, $parametros->idElemen, $parametros->tipo
            );
        }
        $p['action'] = 'ins';
        $p['modfila'] = false;
        $p['addfila'] = true;
        $p['array'] = $parametros->arrayinvolucrados;
        $p['idelemento'] = $parametros->idElemen;
        $p['denelemento'] = $parametros->denelemento;
//        $this->actualizarDatosMatriz($p);
        //procedo a insertar la estructura que crea
        if ($parametros->idEstructura) {
            $elemenEstrucCrea = new DatElementoEstructuraCrea();
            $elemenEstrucCrea->addElementoEstructuraCrea(
                $parametros->idElemen, $parametros->idEstructura
            );
        }
        $procede = $parametros->idElemen;
        ///***...ACTUALIZAR PORCIENTO DE LOS PADRES...***///
        $CmpgestionartareaModel = new CmpgestionartareaModel();
        $CmpgestionartareaModel->actualizarPorcientoPadre($parametros);
        //$this->actualizarFechaDuracionHito($parametros->idpadre);
        return $procede;
    }


    public function generarIdentificadorPlantillaProyecto($identificacion, $plantilla)
    {

        if ($plantilla == 1) {
            return 'pla-' . $identificacion . '-' . date('d/m/Y-h:i:s A');
        } else {
            return 'pro-' . $identificacion . '-' . date('d/m/Y-h:i:s A');
        }
    }

    /*
     * Funcion para saber si en  mod_planifproyecto.dat_proyecto ya existe el identificador
     * */

    public function existeIdentificador($identificacion)
    {
        $datproy = new DatProyecto();
        $respuesta = $datproy->existeEsteIdentificador($identificacion);
        return $respuesta;
    }

    /**
     * Funcion para modificar las plantillas
     */
    public function modificarProyecto($parametros)
    {
        //Verificar conflictos entre la fecha fin y el fondo de tiempo planificado
        if ($parametros->verificartiempoinvol) {
            $arrayInvolFondoTiempo = $this->verificarFondoTiempo(
                $parametros
            );
            if ($arrayInvolFondoTiempo) {
                $arrayInvolFondoTiempo['mensaje'] = 5;
                $arrayInvolFondoTiempo['fechafinact'] = $parametros->fechafin;
                return $arrayInvolFondoTiempo;
            }
        }
        $respuesta = 0;
        $datproy = new DatProyecto();
        $objelemento = Doctrine::getTable('DatProyecto')
            ->find(
                $parametros->idelemento
            );
        $parametros->denelemento = $this->Mayus($parametros->denelemento);
        $respuesta = $datproy->modificarElemento($parametros);
        if ($parametros->plantilla == 0) {
            $objelemento->fechainicio = $parametros->fechainicio;
            $objelemento->fechafin = $parametros->fechafin;
            $objelemento->duracionreal = $parametros->duracionR;
        }
        $parametros->idElemen = $parametros->idelemento;
        if ($parametros->idcategoria != '') {
            $parametros->tiponomenclador = 14;
            $datproy->modificarNomenclador($parametros);
        }
        if ($parametros->idprioridad != '') {
            $parametros->idcategoria = $parametros->idprioridad;
            $parametros->tiponomenclador = 19;
            $datproy->modificarNomenclador($parametros);
        }

        //$objelemento->duracionestimada = ($parametros->duracionE * 24) * 60;
        $parametros->duracionestimada = 0;
        if ($parametros->duracionEstimadaDias) {
            $parametros->duracionestimada = ($parametros->duracionEstimadaDias * 24) * 60;
        }
        if ($parametros->duracionEstimadaHoras) {
            $parametros->duracionestimada += ($parametros->duracionEstimadaHoras * 60);
        }
        if ($parametros->duracionEstimadaMinutos) {
            $parametros->duracionestimada += $parametros->duracionEstimadaMinutos;
        }
        $objelemento->duracionestimada = round($parametros->duracionestimada);

        $objelemento->identificador = $parametros->identificacion;
        $objelemento->save();

        //se eliminan los involucrados al elemento
        if (isset($parametros->arrayinvolucradoseliminar)) {
            $this->pIntegrator->planpdo->eliminarUsuariosAElemento(
                $parametros->arrayinvolucradoseliminar, $parametros->idelemento, 8
            );
        }

        //se relacionan los involucrados al elemento
        if (isset($parametros->arrayinvolucrados[0])) {
            $this->pIntegrator->planpdo->insertarInvolucradosTarea(
                $parametros->arrayinvolucrados, $parametros->idelemento, 8, $parametros->idusuariocrea
            );
        }

        /*  //recursos modificados L para gestionar recursos-proyectos
          if ($parametros->idrecursoasociado) {
          //$this->pIntegrator->planpdo->
          // $objelemnom->EliminarElemNom($parametros->idactividad);
          foreach ($parametros->idrecursoasociado as $key => $recurso) {
          $elemrecursoactividad
          = $objelemnom->AdicionarRelacionNomElem(
          $parametros->idactividad, $recurso, $tiponomenclador = 5
          );
          }
          } */


        //se verifica el fondo de tiempo
//        $anno = explode('/', $parametros->fechainicio);
//        $arrayIdUsuarios = $this->getIdUsuarios($parametros->arrayinvolucrados);
//        $fechafin = $this->pIntegrator->configuracionpdo->getFechaFin(
//            $arrayIdUsuarios, $parametros->fechainicio,
//            $parametros->duracionE,
//            $anno[2]
//        );

        return 1;
    }


    public function getRowsExportarProyecto($idproyecto, $nivel, $num, & $rows, $arrayTareas, $arrayResultanteAlgoritmoPert)
    {
        $hijos = DatProyecto::getHijosInmediatos($idproyecto);
        foreach ($hijos as $hijo) {
            $nro = $nivel . "." . $num;
            if ($hijo['idtipoelemento'] == 10) {
                $tarea = DatProyecto::getDatosTarea($hijo['idelemento'])[0];

                //Antecedentes.
                $antecedentes = '';
                $cantRelacionA = 0;
                foreach (
                    $arrayResultanteAlgoritmoPert['arrayRelacionesPert'] as $key1 => $relacion
                ) {
                    if ($hijo['idelemento'] == $relacion['to']) {
                        $task = array_search($relacion['from'], array_column($arrayTareas, 'idelemento'));
                        if ($cantRelacionA >= 1) {
                            $antecedentes .= " ,</br> " . $arrayTareas[$task]['idelemento'];
                            $cantRelacionA++;
                        } else {
                            $antecedentes .= $arrayTareas[$task]['idelemento'];
                            $cantRelacionA++;
                        }
                    }
                }

                $rows .= " <tr>
                                   <td>" . $nro . "</td>
                                   <td>tarea</td>
                                   <td>" . $tarea['denelemento'] . "</td> 
                                   <td>" . $tarea['fechainicio'] . "</td>
                                   <td>" . $tarea['fechafin'] . "</td> 
                                   <td>" . $tarea['horainicio'] . "</td>
                                   <td>" . $tarea['horafin'] . "</td>
                                   <td>" . $nivel . "</td>
                                   <td>" . $tarea['duracionestimada'] . "</td>
                                   <td>" . $tarea['plantilla'] . "</td>
                                   <td>" . $tarea['idelemento'] . "</td>
                                   <td>" . $antecedentes . "</td>
                             </tr> ";
            } else {
                $hito = DatProyecto::getDatosHito($hijo['idelemento'])[0];
                $rows .= " <tr>
                               <td>$nro</td>
                               <td>hito</td>
                               <td>" . $hito['denelemento'] . "</td> 
                               <td>" . $hito['fechainicio'] . "</td>
                               <td>" . $hito['fechafin'] . "</td> 
                               <td></td>
                               <td></td>
                               <td>" . $nivel . "</td>
                               <td>" . $hito['duracionestimada'] . "</td>
                               <td>" . $hito['plantilla'] . "</td>
                               <td>" . $hito['idelemento'] . "</td>
                               <td></td>
                         </tr> ";
            }
            $num++;
            self::getRowsExportarProyecto($hijo['idelemento'], $nro, 1, $rows, $arrayTareas, $arrayResultanteAlgoritmoPert);
        }
        return $rows;
    }


    /**
     * Funcion para exportar elementos
     */
    public function exportardatoselementos($parametros)
    {
        $register = Zend_Registry::getInstance();
        $nombrearchivo = $parametros->nombrefichero . "_" . $parametros->tipo . "_" . date('d-m-Y') . '.xls';
        $dirarchivo = $register->config->modulo_path . 'resources/descargas/'
            . $nombrearchivo;
        $dirarchivo = str_replace("apps", "web", $dirarchivo);
        $encabezado = "<table width='100%' border='1'>
                    <tr bgcolor='#CCCCCC'>
                        <th>Nro</th>
                        <th>Nivel</th>
                        <th>Denominacion</th> 
                        <th>Fecha inicio</th>
                        <th>Fecha fin </th> 
                        <th>Hora inicio </th>
                        <th>Hora fin </th>
                        <th>Padre</th>
                        <th>Duracion estimada</th>
                        <th>Plantilla</th>
                        <th>CAR</th>
                        <th>Relaciones</th>
                    </tr> <tbody>";

        $contenido = " ";

        $arrayTareas = array();
        $arrayResultanteAlgoritmoPert = array();

        switch ($parametros->tipo) {
            case 'proyecto':
                //Obtener relaciones;
                self::getTareasProyecto($parametros->idelemento, $arrayTareas);
                $parametros->idproyecto = $parametros->idelemento;
                $parametros->denproyecto = $parametros->denelemento;
                self::obtenerDatosPert($parametros, $arrayResultanteAlgoritmoPert);

                $proyecto = DatProyecto::getDatosProyecto($parametros->idelemento)[0];
                $num_proyecto = 1;
                $contenido .= " <tr>
                               <td>$num_proyecto</td>
                               <td>$parametros->tipo</td>
                               <td>" . $proyecto['denelemento'] . "</td> 
                               <td>" . $proyecto['fechainicio'] . "</td>
                               <td>" . $proyecto['fechafin'] . "</td> 
                               <td></td>
                               <td></td>
                               <td></td>
                               <td>" . $proyecto['duracionestimada'] . "</td>
                               <td>" . $proyecto['plantilla'] . "</td>
                               <td>" . $proyecto['idelemento'] . "</td>
                               <td></td>
                         </tr> ";

                $rows = "";
                self::getRowsExportarProyecto($parametros->idelemento, 1, 1, $rows, $arrayTareas, $arrayResultanteAlgoritmoPert);
                $contenido .= $rows;
                break;
            case 'plantilla':
                //Obtener relaciones;
                self::getTareasProyecto($parametros->idelemento, $arrayTareas);
                $parametros->idproyecto = $parametros->idelemento;
                $parametros->denproyecto = $parametros->denelemento;
                self::obtenerDatosPert($parametros, $arrayResultanteAlgoritmoPert);

                $proyecto = DatProyecto::getDatosProyecto($parametros->idelemento)[0];
                $num_proyecto = 1;
                $contenido .= " <tr>
                               <td>$num_proyecto</td>
                               <td>$parametros->tipo</td>
                               <td>" . $proyecto['denelemento'] . "</td> 
                               <td>" . $proyecto['fechainicio'] . "</td>
                               <td>" . $proyecto['fechafin'] . "</td> 
                               <td></td>
                               <td></td>
                               <td></td>
                               <td>" . $proyecto['duracionestimada'] . "</td>
                               <td>" . $proyecto['plantilla'] . "</td>
                               <td>" . $proyecto['idelemento'] . "</td>
                               <td></td>
                         </tr> ";

                $rows = "";
                self::getRowsExportarProyecto($parametros->idelemento, 1, 1, $rows, $arrayTareas, $arrayResultanteAlgoritmoPert);
                $contenido .= $rows;
                break;
            case 'hito':
                $hito = DatProyecto::getDatosHito($parametros->idelemento)[0];
                $num_hito = 1;
                $contenido .= " <tr>
                               <td>$num_hito</td>
                               <td>$parametros->tipo</td>
                               <td>" . $hito['denelemento'] . "</td> 
                               <td>" . $hito['fechainicio'] . "</td>
                               <td>" . $hito['fechafin'] . "</td> 
                               <td></td>
                               <td></td>
                               <td></td>
                               <td>" . $hito['duracionestimada'] . "</td>
                               <td>" . $hito['plantilla'] . "</td>
                               <td>" . $hito['idelemento'] . "</td>
                               <td></td>
                         </tr> ";
                $rows = "";
                self::getRowsExportarProyecto($parametros->idelemento, 1, 1, $rows, $arrayTareas, $arrayResultanteAlgoritmoPert);
                $contenido .= $rows;

                break;
            case 'tarea':
                $tarea = DatProyecto::getDatosTarea($parametros->idelemento)[0];
                $contenido .= " <tr>
                               <td>1</td>
                               <td>$parametros->tipo</td>
                               <td>" . $tarea['denelemento'] . "</td> 
                               <td>" . $tarea['fechainicio'] . "</td>
                               <td>" . $tarea['fechafin'] . "</td> 
                               <td>" . $tarea['horainicio'] . "</td>
                               <td>" . $tarea['horafin'] . "</td>
                               <td></td>
                               <td>" . $tarea['duracionestimada'] . "</td>
                               <td>" . $tarea['plantilla'] . "</td>
                               <td>" . $tarea['idelemento'] . "</td>
                               <td></td>
                         </tr> ";
                break;
        }


        $pie = " </tbody></table> ";

        $cuerpo = $encabezado . $contenido . $pie;

        if ($parametros->encrypt > 0) {
            $cuerpo = self::seguridad("AES-128-ECB", $cuerpo, "encrypt");
        }

        $fp = fopen($dirarchivo, 'w+');
        fwrite($fp, $cuerpo);
        fclose($fp);
        return $nombrearchivo;
    }


    /**************
     * Encrypty datos string
     *************/

    public function seguridad($key, $cadena, $accion)
    {
//       $string_to_encrypt="voy por calle caminando de la mano de mi amor.";
//       $password="password";
//       $encrypted_string=openssl_encrypt($string_to_encrypt,"AES-128-ECB",$password);
//       $decrypted_string=openssl_decrypt($encrypted_string,"AES-128-ECB",$password);
//       print_r($encrypted_string . '  ' . $decrypted_string);die;
        $resultado = "";
        try {
            $password = "password";
            if ($accion === "encrypt") {
                $resultado = openssl_encrypt($cadena, $key, $password);
            } else {
                $resultado = openssl_decrypt($cadena, $key, $password);
            }
            return $resultado;
        } catch (Exception $e) {
            return $resultado;
        }
    }

    /**
     * Funcion para eliminar las plantillas
     */
    public function eliminarProyecto($parametros)
    {
        $datproy = new DatProyecto();
        foreach ($parametros as $elemento) {
            $params->idelementopadre = $elemento->id;
            //busco el padre para actualizar su porciento
            $padre = $datproy->getPadresInmediatos($elemento->id);

            $arrayHijos = $datproy->tieneHijos($params);

            for ($i = 0; $i < count($arrayHijos['resultado']); $i++) {
                $elhijo = new stdClass();
                $elhijo->id = $arrayHijos['resultado'][$i]['idelemento'];
                $data[$i] = $elhijo;
            }
            self::eliminarProyecto($data);
            $datproy->eliminarElemento($elemento->id);
            //actualizo el padre
            if (isset($padre[0])) {
                $params->idElemen = $padre[0]['idelementopadre'];
                CmpgestionartareaModel::actualizarMiPorciento($params);
            }
        }
    }

    public function buscarProyecto($parametros)
    {
        $datproy = new DatProyecto();
        $respuesta = $datproy->buscarElementoPorId($parametros);
        return $respuesta;
    }

    public function buscarNomencladorId($tiponomenclador, $idusuario, $idelemento
    )
    {
        $datproy = new DatProyecto();
        $elemnom = $datproy->buscarNomencladorDadoId(
            $idelemento, $tiponomenclador
        );
        $nomencladores = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
            $tiponomenclador, $idusuario
        );
        //Obtener la denomicacion del nomenclador asociado al plan
        if (isset($nomencladores[0])) {
            foreach ($nomencladores as $value) {
                if ($elemnom[0]['idnomenclador'] == $value['idnomenclador']) {
                    $nomenclador->idnomenclador = $value['idnomenclador'];
                    $nomenclador->dennomenclador = $value['denom'];
                }
            }
        }
        return $nomenclador;
    }

    public function getNomenclador($idelemento, $tipoNomenclador)
    {
        $data = new DatProyecto();
        return $data->returnIdNomenclador($idelemento, $tipoNomenclador);;
    }

    //////////////////////////////////////////////////////////////////
    public function generarProyectodeInsertandoNodo($params)
    {
        $plantilla = $params->plantilla;
        $params->porcientocump = '0';
        $insertadas = array();
        $params->idcategoria = self::getNomenclador($params->idelemento, 14);
        $params->idprioridad = self::getNomenclador($params->idelemento, 19);

        if ($params->generarproyecto == 1 && $params->plantilla == 1) {
            $grado = '0';
        }

        $idproyecto = self::adicionarProyecto($params);

        if ($idproyecto != 0) {

            self::adicionarestructuraaproyecto($params->idelemento, $idproyecto, $insertadas, $plantilla, $grado, $params);
            //print_r($insertadas);die;
            $tareasind = implode(',', $insertadas);
            foreach ($insertadas as $pos => $tarea) {
                $objTarea = Doctrine::getTable('DatTarea')->find($tarea);
                if ($objTarea->dependencias != 0) {
                    $dependencias = explode(',', $objTarea->dependencias);
                    foreach ($dependencias as $depend) {
                        $dm = Doctrine_Manager::getInstance();
                        $con = $dm->getCurrentConnection();
                        $elemDep = Doctrine::getTable('DatTarea')->findByDql(
                            "idtareadepende = {$depend} AND idtarea IN({$tareasind})"
                        );
                        $objGuardar = new DatElementosDatElementos();
                        $objGuardar->idelementopadre = $elemDep[0]->idtarea;
                        $objGuardar->idelementohijo = $tarea;
                        $objGuardar->idautor = $params->idautor;
                        $objGuardar->origen = 6;
                        $objGuardar->save();
                        $con->commit();
                        $con->beginTransaction();
                    }
                }
            }
            $result['tareas'] = $insertadas;
            $result['idproyecto'] = $idproyecto;
            return $result;
        } else {
            $result['existe_identificador'] = 'existe';
            return $result;
        }
    }

    public function adicionarestructuraaproyecto($idelementoPlantilla, $idpadre, &$insertadas, $plantilla, $grado, $params
    )
    {
        $dp = new DatProyecto();
        $hijosInmediatos = $dp->getHijosInmediatos($idelementoPlantilla);
        foreach ($hijosInmediatos as $value) {
            $obj = new DatTarea();
            //se buscan los datos de cada hijo
            $elemento = $obj->getElemento($value['idelementohijo'])[0];
            //Se inserta el hito (idtipoelement = 9)
            if ($elemento['idtipoelemento'] == 9) {

                $idhito = self::insertarHito(
                    $elemento, $idpadre, $plantilla, $grado, $params
                );
                self::adicionarestructuraaproyecto(
                    $value['idelementohijo'], $idhito, $insertadas, $plantilla, $grado, $params
                );
            } elseif ($elemento['idtipoelemento'] == 10) {
                $objElemenNomModel = new DatElementosNomNomencladorModel();
                $parames->idactividad = $elemento['idelemento'];
                $parames->estamodificando = 1;
                $parames->objeto = 1;
                $parames->idusuario = $params->idusuariocrea; //$this->global->Perfil->idusuario;
                $recursosasociados = $objElemenNomModel->cargarRecursosAsociados($parames);
                $params->recursoasociado = $recursosasociados;

                $dependenciaSuperiores = $dp->getdependenciaSuperioresSoloId($value['idelementohijo']);
                if (isset($dependenciaSuperiores[0])) {
                    $dependenciaSuperiores = implode(',', $dependenciaSuperiores);
                } else {
                    $dependenciaSuperiores = 0;
                }
                $elemento['idtareadepende'] = $idelementoPlantilla;
                $elemento['dependencias'] = $dependenciaSuperiores;
                $idtarea = self::insertarTarea(
                    $elemento, $idpadre, $plantilla, $grado, $params
                );
                $insertadas[] = $idtarea;
                self::adicionarestructuraaproyecto(
                    $value['idelementohijo'], $idtarea, $insertadas, $plantilla, $grado, $params
                );
            }
        }
    }

    public function insertarTarea($elemento, $idpadre, $plantilla, $grado, $params
    )
    {
        $obj = new DatTarea();
        $elem = $obj->getElemento($idpadre)[0];
        $model = new CmpgestionartareaModel();
        $parametros->recursoasociado = $params->recursoasociado;
        $parametros->idusuariocrea = $elemento['idusuariocrea'];
        $parametros->denelemento = $elemento['denelemento'];
        $parametros->descelemento = $elemento['descelemento'];
        $parametros->idestadocump = $elemento['estadocumplimiento'];
        $parametros->duracionE = $elemento[36]; //$elemento['duracionestimada'];

        if (isset($params->compresion) && array_search($elemento['idelemento'] . "", $params->compresion) !== false) {
            $TN = $elemento['duracionestimada'];
            $COMP = $elemento['duracionestimada'] - $elemento['tiempooptimista'];
            $minutos = $TN - $COMP;
            if ($COMP > $params->COMP_PROY) {
                $minutos = $params->COMP_PROY;
            }
            $tiempodesglosado = self::toHours($minutos, '');
            $parametros->duracionEstimadaDias = $tiempodesglosado['dias'];
            $parametros->duracionEstimadaHoras = $tiempodesglosado['horas'];
            $parametros->duracionEstimadaMinutos = $tiempodesglosado['minutos'];
        } else {
            if ($parametros->duracionE) {
                $minutos = $parametros->duracionE;
                $tiempodesglosado = self::toHours($minutos, '');
                $parametros->duracionEstimadaDias = $tiempodesglosado['dias'];
                $parametros->duracionEstimadaHoras = $tiempodesglosado['horas'];
                $parametros->duracionEstimadaMinutos = $tiempodesglosado['minutos'];
            }

            $minutos = $elemento['tiempooptimista']; // * 60;
            $tiempodesglosado = self::toHours($minutos, '');
            $parametros->tiempooptimistaDias = $tiempodesglosado['dias'];
            $parametros->tiempooptimistaHoras = $tiempodesglosado['horas'];
            $parametros->tiempooptimistaMinutos = $tiempodesglosado['minutos'];

            $minutos = $elemento['tiempomedio']; // * 60;
            $tiempodesglosado = self::toHours($minutos, '');
            $parametros->tiempomedioDias = $tiempodesglosado['dias'];
            $parametros->tiempomedioHoras = $tiempodesglosado['horas'];
            $parametros->tiempomedioMinutos = $tiempodesglosado['minutos'];

            $minutos = $elemento['tiempopesimista']; // * 60;
            $tiempodesglosado = self::toHours($minutos, '');
            $parametros->tiempopesimistaDias = $tiempodesglosado['dias'];
            $parametros->tiempopesimistaHoras = $tiempodesglosado['horas'];
            $parametros->tiempopesimistaMinutos = $tiempodesglosado['minutos'];
        }

        $parametros->duracionR = $elemento['duracionreal'];
        $parametros->peso = $elemento['peso'];
        $parametros->porcientocump = '0';
        // $parametros->criterioeval = $tarea['gradocumplimiento'];
        // $parametros->idtipotarea = $tarea['gradocumplimiento'];
        $parametros->fechainicio = $elemento['fechainicio'];
        $parametros->fechafin = $elemento['fechafin'];
        $parametros->horainicio = $elemento['horainicio'];
        $parametros->horafin = $elemento['horafin'];
        $parametros->lugar = $elemento['lugar'];
        $parametros->principal = $elemento['esprincipal'];
        $parametros->plantilla = ($plantilla) ? $plantilla : 0;
        $parametros->idpadre = $idpadre;
        $parametros->idautorpadre = $elem['idusuariocrea'];
        $parametros->tipopadre = $elem['idtipoelemento'];
        $parametros->idtareadepende = $elemento['idelemento'];
        $parametros->dependencias = $elemento['dependencias'];
        $parametros->generaproyecto = true;

        $parametros->unidadmedida = $elemento['unidadmedida'];
        $parametros->valorreal = $elemento['valorreal'];
        $parametros->valormeta = $elemento['valormeta'];
        $parametros->costo = $elemento['costo'];
        $parametros->clave = $elemento['clave'];

        $involucrados = $obj->getInvolucrados($elemento['idelemento']);
        foreach ($involucrados as $inv) {
            $involucrado = new stdClass();
            $involucrado->idinvolucrado = $inv['idinvolucrado'];
            $involucrado->llaveinvolucrado = $inv['llaveinvolucrado'];
            $involucrado->idusuario = $inv['idusuario'];
            //  $involucrado->denominacion="Dany";
            $involucrado->idgrupo = $inv['idgrupo'];
            $involucrado->tipoinvol = $inv['tipoinvolucrado'];
            $involucrado->tipo = $inv['tipoinvolucrado'];
            $parametros->arrayinvolucrados[] = $involucrado;
        }
        $parametros->idEstructura = $params->idEstructura;
        //$parametros->arrayrepeticiones =$tarea['gradocumplimiento'];
        //$parametros->arrayinvolucrados =$tarea['gradocumplimiento'];
        return $model->adicionarTarea($parametros);
    }

    public function insertarHito($elemento, $idpadre, $plantilla, $grado, $params
    )
    {
        $obj = new DatTarea();
        $elem = $obj->getElemento($idpadre)[0];
        $model = new CmpgestionarhitoModel();
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->denelemento = $elemento['denelemento'];
        $parametros->descelemento = $elemento['descelemento'];
        $parametros->idcategoria = self::getNomenclador(
            $elemento['idelemento'], 15
        );
        $parametros->idestadocump = $elemento['estadocumplimiento'];
        $parametros->fechainicio = $elemento['fechainiciohito'];
        $parametros->fechafin = $elemento['fechafinhito'];
        $parametros->duracionE = $elemento['duracionestimada'];
        $parametros->duracionR = $elemento['duracionreal'];
        $parametros->peso = $elemento['peso'];
        $parametros->porcientocump = '0';
        $parametros->plantilla = ($plantilla) ? $plantilla : 0;
        $parametros->idpadre = $idpadre;
        $parametros->idautorpadre = $elem['idusuariocrea'];
        $parametros->tipopadre = $elem['idtipoelemento'];
        $parametros->tipo = $elemento['idtipoelemento'];
        $involucrados = $obj->getInvolucrados($elemento['idelemento']);
        $parametros->idEstructura = $params->idEstructura;
        foreach ($involucrados as $inv) {
            $involucrado = new stdClass();
            $involucrado->idinvolucrado = $inv['idinvolucrado'];
            $involucrado->llaveinvolucrado = $inv['llaveinvolucrado'];
            $involucrado->idusuario = $inv['idusuario'];
            $involucrado->idgrupo = $inv['idgrupo'];
            $involucrado->tipoinvol = $inv['tipoinvolucrado'];
            $involucrado->tipo = $inv['tipoinvolucrado'];
            $parametros->arrayinvolucrados[] = $involucrado;
        }
        return $model->adicionarHito($parametros);
    }

    public function adicionarfechaEstructura($tareas, $fechainicio)
    {
        $obj = new DatTarea();
        $parametros = array();
        $var = count($tareas);
        while ($var > 0) {
            foreach ($tareas as $k => $valor) {
                $parametros['idtarea'] = $valor;
                $parametros['fechainicio'] = $fechainicio;
                $parametros['elemDep'] = Doctrine::getTable('DatTarea')->find(
                    $parametros['idtarea']
                );
                if ($parametros['elemDep']->dependencias != 0) {
                    if (!self::ExisteunaSinFecha($parametros)) {
                        $objeto = $obj->buscarMayorFecha($parametros);
                        $parametros['fechainicio'] = $objeto[0]['max'];
                        $parametros['horafin'] = $objeto[0]['horafin'];
                        self::pornerFecha($parametros);
                        $var = $var - 1;
                    }
                } else {
                    self::pornerFecha($parametros);
                    $var = $var - 1;
                }
            }
        }
        return true;
    }

    public function funcionSetFechas($parametros)
    {
        $parametros->tareasimplode = implode(',', $parametros->tareas);
        $tareasordenadas = DatTarea::getOrderByDependencias($parametros);
        if (!empty($parametros->idfondotiempo)) {
            $anno = explode('/', $parametros->fechainicio);
            $anno = $anno[2];
            $fondotiempo = array();
            //Buscar fondo de tiempo para un periodo de 5 annos
            for ($i = 0; $i < 5; $i++) {
                try {
                    $ft = $this->pIntegrator->configuracionpdo->getFondoTiempo(
                        $parametros->idfondotiempo, $anno);
                    array_push($fondotiempo, $ft);
                    $anno += 1;
                } catch (Exception $e) {
                    $msg = 'No se ha podido obtener la configuración de fondo de tiempo';
                    $data['msg'] = $msg;
                    $data['mensaje'] = 2;
                    return $data;
                }
            }
            if (!isset($fondotiempo[0])) {
                $msg = 'El fondo de tiempo seleccionado no tiene planificación para el año ' . $anno;
                $data['msg'] = $msg;
                $data['mensaje'] = 2;
                return $data;
            }
        }
        $parametros->fondotiempo = $fondotiempo;
        $array_aux = array();
        foreach ($tareasordenadas as $tarea) {
            $result = self::analisisFecha($parametros, $tarea['idtarea'], $array_aux);
            if (isset($result['mensaje'])) return $result;
        }
        return;
    }

    public function analisisFecha($parametros, $idtarea, & $array_aux)
    {
        $tieneFecha = self::tieneFecha($idtarea);
        if (!$tieneFecha) {
            $dependencias = self::Dependencias($idtarea);
            /*var_dump($idtarea);
            print_r($dependencias);*/
            foreach ($dependencias as $depend) {
                $result = self::analisisFecha($parametros, $depend, $array_aux);
                if (isset($result['mensaje'])) return $result;
            }
            if (count($dependencias) == 0) {
                $fecha_ini_proyecto = $parametros->fechainicio;
                $result = self::pornerFecha(
                    $idtarea, $fecha_ini_proyecto, 0, $parametros->horainicio,
                    $parametros->ignorarFinSemana, $parametros->regimen8hrs, $parametros, $array_aux
                );
                if (isset($result['mensaje'])) return $result;
            } else {
                $objeto = DatTarea::buscarMayorFechaNew(
                    implode(',', $dependencias)
                );
                //print_r($objeto);die;
                //condicion para reparar el calculo de tiempo de las tareas
                if ($parametros->regimen8hrs == 1 && ($objeto[0]['horafin'] == '17:00' || $objeto[0]['horafin'] == '17:00:00')) {

                    $objeto[0]['horafin'] = '8:00';

                    $diasSumar = 1;

                    if ($parametros->ignorarFinSemana == 1) {
                        $result = self::get_nombre_dia($objeto[0]['fechafin']);
                        if ($result == 'Viernes') {
                            $diasSumar = 3;
                        }
                    }

                    $parts = explode('/', $objeto[0]['fechafin']);
                    $objeto[0]['fechafin'] = $parts[0] . '-' . $parts[1] . '-' . $parts[2];

                    $fechafin = date("d-m-Y", strtotime($objeto[0]['fechafin'] . " +" . $diasSumar . " day"));
                    $parts = explode('-', $fechafin);
                    $objeto[0]['fechafin'] = $parts[0] . '/' . $parts[1] . '/' . $parts[2];
                }
                //FIN condicion para reparar el calculo de tiempo de las tareas

                $fecha_ini_proyecto = $objeto[0]['fechafin'];
                $result = self::pornerFecha(
                    $idtarea, $fecha_ini_proyecto, $objeto[0]['horafin'], $objeto[0]['horainicio'],
                    $parametros->ignorarFinSemana, $parametros->regimen8hrs, $parametros, $array_aux
                );
                if (isset($result['mensaje'])) return $result;
            }
        }

    }

    public function tieneFecha($idtarea)
    {
        $result = false;
        $tarea = Doctrine::getTable('DatTarea')->find($idtarea);
        if ($tarea->fechainicio != null AND $tarea->fechafin != null) {
            $result = true;
        }
        return $result;
    }

    public function Dependencias($idtarea)
    {
        $result = array();
        $tareas = Doctrine::getTable('DatElementosDatElementos')->findByDql(
            "idelementohijo = {$idtarea} AND origen = 6"
        );
        if ($tareas[0]->idelementohijo != null) {
            foreach ($tareas as $d) {
                $result[] = $d->idelementopadre;
            }
        }
        return $result;
    }

    public function buscarCriterioId($idnomenclador)
    {
        $tareas = Doctrine::getTable('NomNomenclador')->findByDql(
            "idnomenclador = {$idnomenclador} AND tiponomenclador = 18"
        );
        return $tareas;
    }

    public function adicionarfechaProyecto($tareas, $idproyecto)
    {
        $dm = Doctrine_Manager::getInstance();
        $con = $dm->getCurrentConnection();
        $obj = new DatTarea();
        $fechafin = $obj->buscarFechaFecha($tareas);
        $proyecto = Doctrine::getTable('DatProyecto')->find($idproyecto);
        $proyecto->fechafin = $fechafin[0]['max'];
        $proyecto->duracionestimada = $fechafin[0]['sum'];
        $proyecto->save();
        $con->commit();
        $con->beginTransaction();
        return true;
    }

    public function adicionarfechaHitos($idproyecto)
    {
        $dm = Doctrine_Manager::getInstance();
        $con = $dm->getCurrentConnection();
        $obj = new DatTarea();
        $hitos = array();
        self::buscarInferiores($idproyecto, $hitos);
        if (isset($hitos[0])) {
            foreach ($hitos as $hito) {
                $tareashito = array();
                self::buscarInferiores($hito, $tareashito, '<=', 3, 10);
                if (isset($tareashito[0])) {
                    $fecha = $obj->buscarFechaHito($tareashito);
                    $proyecto = Doctrine::getTable('DatHito')->find($hito);
                    $proyecto->fechafin = $fecha[0]['max'];
                    $proyecto->fechainicio = $fecha[0]['min'];
                    $proyecto->duracionestimada = $fecha[0]['sum'];
                    $proyecto->save();
                }
            }
            $con->commit();
            $con->beginTransaction();
        }

        return true;
    }

    public function adicionarDuracionPlantilla($tareas, $idproyecto)
    {
        $dm = Doctrine_Manager::getInstance();
        $con = $dm->getCurrentConnection();
        $obj = new DatTarea();
        $duracion = $obj->buscarDuracionTareas($tareas);
        $proyecto = Doctrine::getTable('DatProyecto')->find($idproyecto);
        $proyecto->duracionestimada = $duracion[0]['sum'];
        $proyecto->save();
        $con->commit();
        $con->beginTransaction();
        return true;
    }

    public function adicionarDuracionHitos($idproyecto)
    {
        $dm = Doctrine_Manager::getInstance();
        $con = $dm->getCurrentConnection();
        $obj = new DatTarea();
        $hitos = array();
        self::buscarInferiores($idproyecto, $hitos);
        if (isset($hitos[0])) {
            foreach ($hitos as $hito) {
                $tareashito = array();
                self::buscarInferiores($hito, $tareashito, '<=', 3, 10);
                if (isset($tareashito[0])) {
                    $fecha = $obj->buscarFechaHito($tareashito);
                    $proyecto = Doctrine::getTable('DatHito')->find($hito);
                    $proyecto->duracionestimada = $fecha[0]['sum'];
                    $proyecto->save();
                }
            }
            $con->commit();
            $con->beginTransaction();
        }

        return true;
    }

    public function ExisteunaSinFecha($parametros)
    {
        $obj = new DatTarea();
        //se buscan los datos de cada hijo
        $result = $obj->existedependenciaSinFecha($parametros);
        $result = false;
        if ($result[0] > 0) {
            $result = true;
        }
        return $result;
    }

    public function compararFechas($primera, $segunda)
    {
        $valoresPrimera = explode('-', $primera);
        $valoresSegunda = explode('-', $segunda);
        $diaPrimera = $valoresPrimera[0];
        $mesPrimera = $valoresPrimera[1];
        $annoPrimera = $valoresPrimera[2];
        $diaSegunda = $valoresSegunda[0];
        $mesSegunda = $valoresSegunda[1];
        $annoSegunda = $valoresSegunda[2];
        $diasPrimeraJuliano = gregoriantojd($mesPrimera, $diaPrimera, $annoPrimera);
        $diasSegundaJuliano = gregoriantojd($mesSegunda, $diaSegunda, $annoSegunda);
        if (!checkdate($mesPrimera, $diaPrimera, $annoPrimera)) {
            return -1;
        } elseif (!checkdate($mesSegunda, $diaSegunda, $annoSegunda)) {
            return -1;
        } else {
            return $diasPrimeraJuliano - $diasSegundaJuliano;
        }
    }

    public function difDays($date1, $date2)
    {
        $date1 = explode('-', $date1);
        $date1 = "$date1[2]-$date1[1]-$date1[0]";
        $date2 = explode('-', $date2);
        $date2 = "$date2[2]-$date2[1]-$date2[0]";

        $date1 = new DateTime($date1);
        $date2 = new DateTime($date2);
        $diff = $date1->diff($date2);
        return $diff->days;
    }

    public function hourIsBetween($from, $to, $input, $includeto)
    {
        $dateFrom = DateTime::createFromFormat('!H:i', $from);
        $dateTo = DateTime::createFromFormat('!H:i', $to);
        $dateInput = DateTime::createFromFormat('!H:i', $input);
        if ($dateFrom > $dateTo) $dateTo->modify('+1 day');
        if ($includeto) return ($dateFrom <= $dateInput && $dateInput <= $dateTo) || ($dateFrom <= $dateInput->modify('+1 day') && $dateInput <= $dateTo);
        else return ($dateFrom <= $dateInput && $dateInput < $dateTo) || ($dateFrom <= $dateInput->modify('+1 day') && $dateInput < $dateTo);

    }

    public function sumarHoras($horaini, $horas)
    {
        $horaini = DateTime::createFromFormat('!H:i', $horaini);
        $horas = explode(':', $horas);
        $hora = $horas[0];
        $min = $horas[1];
        $seg = (isset($horas[2])) ? $horas[2] : '0';
        $horaini->modify('+ ' . $hora . ' hours');
        $horaini->modify('+ ' . $min . ' minute');
        $horaini->modify('+ ' . $seg . ' second');
        return $horaini->format('H:i');
    }

    public function restarHoras($horafin, $horas)
    {
        $horafin = DateTime::createFromFormat('!H:i', $horafin);
        $horas = explode(':', $horas);
        $hora = $horas[0];
        $min = $horas[1];
        $seg = (isset($horas[2])) ? $horas[2] : '0';
        $horafin->modify('- ' . $hora . ' hours');
        $horafin->modify('- ' . $min . ' minute');
        $horafin->modify('- ' . $seg . ' second');
        return $horafin->format('H:i');
    }

    public function convertirMinutosaHoras($tiempomin)
    {
        $horas = (int)$tiempomin / 60;
        $min = (int)$tiempomin % 60;
    }

    public function pornerFecha($idtarea, $fecha, $horafin = 0, $horainicio, $ignorarFinSemana, $regimen8hrs, $parametros, & $array_aux)
    {
        $dm = Doctrine_Manager::getInstance();
        $con = $dm->getCurrentConnection();
        $tarea = Doctrine::getTable('DatTarea')->find($idtarea);
        if (isset($tarea->idtarea)) {
            if ($horafin != 0) {
                $horaInicioReal = $horafin;
            } else {
                $horaInicioReal = $horainicio;
            }
            if (isset($parametros->fondotiempo[0])) {
                $params['fondotiempo'] = $parametros->fondotiempo;
                $params['fecha'] = $fecha;
                $params['tarea'] = $tarea;
                $params['horainicio'] = $horaInicioReal;
                $params['con'] = $con;
                $params['array_aux'] = $array_aux;
                $array_aux = $this->calcularFondoTiempo($params);
            } else {
                if ($ignorarFinSemana == 1 && $regimen8hrs == 1) {
                    $result = self::jornada8hrsIgnorarFinSemana($fecha, $horaInicioReal, $tarea->duracionestimada, $ignorarFinSemana, $regimen8hrs);
                    $tarea->fechainicio = $fecha;
                    $tarea->fechafin = $result['fechafin'];

                    $tarea->horainicio = $result['horainicio'];

                    if ($horainicio == 0) {
                        $tarea->horafin = $result['horafin'];
                    } else {
                        $tarea->horafin = $result['horafin'];
                    }
                } else {
                    $e = self::calcularHora($tarea->duracionestimada, $horafin);
                    $ff = self::correrFecha($fecha, $e['dias']); //para el fondo de tiempo aqui se le suman los dias
                    $tarea->fechainicio = $fecha;
                    $tarea->fechafin = $ff;
                    if ($horainicio == '') {
                        $tarea->horainicio = ($horafin == 0) ? $e['horainicio'] : $horafin;
                        $tarea->horafin = $e['horafin'];
                    } else {
                        $tarea->horainicio = ($horafin == 0) ? $horainicio : $horafin;
                        $e = self::calcularHora($tarea->duracionestimada, $horainicio);
                        $tarea->horafin = $e['horafin'];
                    }
                }
            }
            $tarea->save();
            $con->commit();
            $con->beginTransaction();
            return $array_aux;
        }
    }

    public function calcularFondoTiempo($parametros)
    {
        extract($parametros);
        if (isset($fondotiempo[0])) {
            $cantft = count($array_aux);
            $arrayft = [];
            $pos = 0;
            if ($cantft > 0) {
                //El array auxiliar tiene fechas ordenadas
                for ($i = 0; $i < $cantft; $i++) {
                    $fecha = str_replace('/', '-', $fecha);
                    $fechaft = $array_aux[$i]['fecha'];
                    $diferenciadias = $this->compararFechas($fechaft, $fecha);
                    if ($diferenciadias >= 0) {
                        //Valido si la hora de inicio es igual a la hora de fin para cambiarla por la hora de inicio del siguiente dia
                        $horainift = substr($array_aux[$i]['horainift'], 0, 5);
                        $horafinft = substr($array_aux[$i]['horafinft'], 0, 5);
                        $horainicio = substr($horainicio, 0, 5);
                        $pos = $i;

                        $params['horainift'] = $horainift;
                        $params['horafinft'] = $horafinft;
                        $params['horainiciotemp'] = $horainicio;
                        $params['minft'] = $array_aux[$i]['minft'];

                        $mindisponibles = $this->calcularMinDisponibles($params);
                        $array_aux[$i]['mindisponibles'] = $mindisponibles;

                        if ($horainicio == $horafinft || $mindisponibles == 0) {
                            if (isset($array_aux[$i + 1])) {
                                $horainicio = substr($array_aux[$i + 1]['horainift'], 0, 5);
                                $fecha = $array_aux[$i + 1]['fecha'];
                                $pos = $i + 1;
                            } else {
                                $msg = 'El tiempo del proyecto excede la configuración del fondo de tiempo.';
                                $data['msg'] = $msg;
                                $data['mensaje'] = 2;
                                return $data;
                            }
                        }
                        $arrayft = $array_aux;
                        break;
                    }
                }
            } else {
                //Procedo a crear mi array de fechas ordenados
                foreach ($fondotiempo as $ft) {
                    foreach ($ft as $value => $key) {
                        $arrayfechasft = explode(',', $key['fecha']);
                        foreach ($arrayfechasft as $fechas) {
                            $fechas = str_replace('/', '-', $fechas);
                            $data['fecha'] = $fechas;
                            $data['horasft'] = $key['horas'];
                            $data['minft'] = intval($key['horas']) * 60;
                            $data['horainift'] = $key['horainicio'];
                            $data['horafinft'] = $key['horafin'];
                            array_push($arrayft, $data);
                        }
                    }
                }
                usort($arrayft, function ($a1, $a2) {
                    $v1 = strtotime($a1['fecha']);
                    $v2 = strtotime($a2['fecha']);
                    return ($v1 < $v2) ? -1 : 1;
                });

                $cant = count($arrayft);
                $find = 0;
                for ($i = 0; $i < $cant; $i++) {
                    $fecha = str_replace('/', '-', $fecha);
                    $fechaft = $arrayft[$i]['fecha'];
                    $diferenciadias = $this->compararFechas($fechaft, $fecha);
                    if ($diferenciadias >= 0) {
                        if ($diferenciadias == 0) {
                            $horainift = substr($arrayft[$i]['horainift'], 0, 5);
                            $horafinft = substr($arrayft[$i]['horafinft'], 0, 5);
                            if ($this->hourIsBetween($horainift, $horafinft, $horainicio, false)) {
                                $arrayft[$i]['horainiproy'] = 1;
                                $arrayft = array_slice($arrayft, $i);
                                $pos = 0;
                                $find = 1;
                                break;
                            } else {
                                $msg = 'Debe introducir una hora de inicio de proyecto entre la(s) ' . $arrayft[$i]['horainift'] . ' hr(s) la(s) ' . $arrayft[$i]['horafinft'] . ' hr(s).';
                                $data['msg'] = $msg;
                                $data['mensaje'] = 2;
                                return $data;
                            }
                        } else {
                            $msg = 'El día ' . $fecha . ' no tiene fondo de tiempo planificado para poder iniciar un proyecto ese día.';
                            $data['msg'] = $msg;
                            $data['mensaje'] = 2;
                            return $data;
                        }
                    }
                }
                if (!$find) {
                    $msg = 'No existe una configuración de fondo de tiempo para comenzar un proyecto a partir del día ' . $fecha . '.';
                    $data['msg'] = $msg;
                    $data['mensaje'] = 2;
                    return $data;
                }
            }
            $duracionmin = $tarea->duracionestimada;
            $cant = count($arrayft);
            $find = 0;
            $horainiciotemp = 0;
            //Procedo a calcular la fecha y hora fin
            for ($i = $pos; $i < $cant; $i++) {
                $fecha = str_replace('/', '-', $fecha);
                $fechaft = $arrayft[$i]['fecha'];
                $diferenciadias = $this->compararFechas($fechaft, $fecha);
                if ($diferenciadias >= 0) {
                    $horainift = substr($arrayft[$i]['horainift'], 0, 5);
                    $horafinft = substr($arrayft[$i]['horafinft'], 0, 5);
                    $horainiciotemp = (!$horainiciotemp) ? $horainicio : $horainift;
                    $horainiciotemp = substr($horainiciotemp, 0, 5);
                    //Calculo los minutos que pueden ser planificados para una jornada
                    if (isset($arrayft[$i]['mindisponibles'])) {
                        $mindisponibles = $arrayft[$i]['mindisponibles'];
                    } else {
                        $params['horainift'] = $horainift;
                        $params['horafinft'] = $horafinft;
                        $params['horainiciotemp'] = $horainiciotemp;
                        $params['minft'] = $arrayft[$i]['minft'];
                        $params['horainiproy'] = $arrayft[$i]['horainiproy'];
                        $mindisponibles = $this->calcularMinDisponibles($params);
                    }
                    if ($mindisponibles != 0) {
                        if ($duracionmin <= $mindisponibles) {
                            $duracionhoras = $this->toHours($duracionmin);
                            $duracionhoras = $duracionhoras['horas'] . ':' . $duracionhoras['minutos'];
                            $horafin = $this->sumarHoras($horainiciotemp, $duracionhoras);
                            if ($this->hourIsBetween($horainift, $horafinft, $horafin, true)) {
                                $tarea->horainicio = $horainicio;
                                $tarea->fechainicio = $fecha;
                                $tarea->horafin = $horafin;
                                $tarea->fechafin = $arrayft[$i]['fecha'];
                                $find = 1;
                                $tarea->save();
                                $con->commit();
                                $con->beginTransaction();
                                return $arrayft;
                            } else {
                                $horasrestantes = $this->restarHoras($horafin, $horafinft);
                                $horasrestantes = explode(':', $horasrestantes);
                                $duracionmin = $horasrestantes[0] * 60 + $horasrestantes[1];
                            }
                        } else {
                            $duracionmin -= $mindisponibles;
                            $horainiciotemp = 1;
                        }
                    }
                }
            }
            if (!$find) {
                $msg = 'El tiempo del proyecto excede la configuración del fondo de tiempo.';
                $data['msg'] = $msg;
                $data['mensaje'] = 2;
                return $data;
            }
        }
    }

    public function calcularMinDisponibles($parametros)
    {
        extract($parametros);
        if (isset($horainiproy) && $horainiproy) {
            $horasrestantes = $this->restarHoras($horafinft, $horainiciotemp);
            $horasrestantes = explode(':', $horasrestantes);
            $minrestantes = $horasrestantes[0] * 60 + $horasrestantes[1];

            if ($minft <= $horasrestantes) return $minft;
            else return $horasrestantes;
        } else {
            $horastranscurridas = $this->restarHoras($horainiciotemp, $horainift);
            $horastranscurridas = explode(':', $horastranscurridas);
            $mintranscurridos = $horastranscurridas[0] * 60 + $horastranscurridas[1];

            $mindisponibles = $minft - $mintranscurridos;
            if ($mindisponibles <= 0)
                $mindisponibles = 0;
            return $mindisponibles;
        }
    }

    public function calcularHora($duracionestimada, $horainicio)
    {
        $minutos = 0;
        $duracionestimada = $duracionestimada / 60;
//        if ($horainicio != 0) {
        if ($horainicio != '' || $horainicio == 0) {
            $p = explode(':', $horainicio);
            $hi = $p[0];  // $hi[0] -> tiene las horas
            $h1['horainicio'] = $horainicio;
        } else {
            $hi = date("H");
            $h1['horainicio'] = date("H:i");
            $time = strtotime($h1['horainicio'] . ':00');
            $h1['horainicio'] = date("H:i:s", $time);
            $p = explode(':', $h1['horainicio']); // $p[0] -> tiene las horas , $p[1] -> tiene los minutos
        }

        //Gestion Horas
        $e = (int)($duracionestimada / 24);
        $r = $duracionestimada % 24;
        $e1 = (int)(($r + $hi) / 24);  // $hi[0] -> tiene las horas
        $r1 = ($r + $hi) % 24;

        if ($e1 >= 1) {
            $e = $e + $e1;
            $hf = $r1;
        } else {
            $hf = $r1;
        }
        //gestion minutos
        $m1 = ($duracionestimada) - (int)($duracionestimada);
        $m1 = ($m1 * 60);
        $minutos = round($m1 + $p[1]);  // $p[1] -> tiene los minutos
        $time = strtotime($hf . ':00:00');

        $h1['horafin'] = date("H:i:s", $time);

        $nuevafecha = strtotime('+' . $minutos . 'minute', strtotime($h1['horafin']));

        $h1['horafin'] = date("H:i:s", $nuevafecha);
        $h1['dias'] = $e;
        return $h1;
    }

    function get_nombre_dia($fecha)
    {
        $parts = explode('/', $fecha);
        $fecha = $parts[0] . '-' . $parts[1] . '-' . $parts[2];
        // el parametro w en la funcion date indica que queremos el dia de la semana lo devuelve en numero 0 domingo, 1 lunes,....
        switch (date('w', strtotime($fecha))) {
            case 0:
                return "Domingo";
                break;
            case 1:
                return "Lunes";
                break;
            case 2:
                return "Martes";
                break;
            case 3:
                return "Miercoles";
                break;
            case 4:
                return "Jueves";
                break;
            case 5:
                return "Viernes";
                break;
            case 6:
                return "Sabado";
                break;
        }
    }

    public function comienzaFinSemana()
    {

        // Monday, Tuesday,  Wednesday, Thursday, Friday, Saturday, Sunday
        // Si es Viernes
        if (date('l') == 'Thursday') { //Friday
            // Si es una hora determinada en este ejemplo a las 11:30am
            if (date('H:i:s') == '11:30:00') {
                // muestro el link
                echo 'link';
            } else {
                echo '';
            }
        } else {
            echo '';
        }
    }

    function jornada8hrsIgnorarFinSemana($fechainicio, $horainicioreal, $duracionTarea, $ignorarFinSemana, $regimen8hrs)
    {
        $minutosFin = 0;
        $minutos = 0;
        $totalhoras = $duracionTarea / 60;  //obtengo las horas de duracion de la tarea, lo convierto a horas porque la duracion de la tarea se guarda en minutos en la BD

        if ($duracionTarea < 60) {
            $minutos = $duracionTarea;
        } else {
            $minutos = $duracionTarea % 60;
        }

        $horainicio = $horainicioreal;
        $diainicio = self::get_nombre_dia($fechainicio);

        $parts = explode('/', $fechainicio);
        $fechainicio = $parts[0] . '-' . $parts[1] . '-' . $parts[2];

        $hr = explode(':', $horainicio);

        if ($hr[0] == '12') {
            $hr[0] = 14;
        } else {
            $hr[0]++;
        }

        if ($duracionTarea > 59) {
            $minutosFin = $duracionTarea % 60;
        } else {
            $minutosFin = $duracionTarea;
        }

        if (($hr[1] + $minutosFin) >= 60) {
            $hr[0]++;
            $minutosFin = ($hr[1] + $minutosFin) - 60;
        } else {
            $minutosFin = ($hr[1] + $minutosFin);
        }

//        print_r($minutosFin);

        $horainicio = $hr[0] . ':00';

        $horas8 = array('9:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00');
        $horas24 = array('1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00');
        $dias = array('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes');

        $clave8 = array_search($horainicio, $horas8);
        $clave24 = array_search($horainicio, $horas24);
        $clavedia = array_search($diainicio, $dias);
        $horafin = 0;
        $diafin = 0;

        if ($regimen8hrs == 1) {
            for ($i = 0; $i < $totalhoras; $i++) {
                $pos = $i + $clave8;

                if ($pos < 8) {
                    $horafin = $horas8[$pos];
                } else {

                    $diafin = $rdiv = floor($pos / 8);
                    $rresta = $rdiv * 8;
                    $j = $pos - $rresta;
                    $horafin = $horas8[$j];
                }
            }
        } else {
            for ($i = 0; $i < $totalhoras; $i++) {
                $pos = $i + $clave24;

                if ($pos < 24) {
                    $horafin = $horas24[$pos];
                } else {

                    $diafin = $rdiv = floor($pos / 24);
                    $rresta = $rdiv * 24;
                    $j = $pos - $rresta;
                    $horafin = $horas24[$j];
                }
            }
        }

        $diassum = 0;
        for ($h = 0; $h < $diafin; $h++) {

            $posdia = $h + $clavedia;
            if ($posdia < 5) {
                $jx = $posdia;
            } else {

                $rdivh = floor($posdia / 5);
                $rrestah = $rdivh * 5;
                $jx = $posdia - $rrestah;
            }

            if ($dias[$jx] == 'Viernes' && $ignorarFinSemana == 1) {
                $diassum = $diassum + 2;
            }
        }

        $diassumtotal = $diafin + $diassum;

        if ($minutos > 0) {
            $horafinfinal = $horafin - 1;

            if ($minutosFin < 10) {
                $minutosFin = '0' . $minutosFin;
            }

            $resultado['horafin'] = $horafinfinal . ":" . $minutosFin;
            $fechafin = date("d-m-Y", strtotime($fechainicio . " +" . $diassumtotal . " day"));
            $parts = explode('-', $fechafin);
            $resultado['fechafin'] = $parts[0] . '/' . $parts[1] . '/' . $parts[2];
        } else {

            $hrsfin = explode(':', $horafin);

            if ($minutosFin < 10) {
                $minutosFin = '0' . $minutosFin;
            }

            $resultado['horafin'] = $hrsfin[0] . ":" . $minutosFin;
            $fechafin = date("d-m-Y", strtotime($fechainicio . " +" . $diassumtotal . " day"));
            $parts = explode('-', $fechafin);
            $resultado['fechafin'] = $parts[0] . '/' . $parts[1] . '/' . $parts[2];
        }
        $resultado['horainicio'] = $horainicioreal;
//        print_r($resultado);die;
        return $resultado;
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

    public function returnIdProyecto($id, &$resultado)
    {
        $data = new DatProyecto();
        $valor = $data->getIdPadre($id);
        if ($valor['idtipoelemento'] == 8) {
            $resultado[] = $valor['idelementopadre'];
        } else {
            self::returnIdProyecto($valor['idelementopadre'], $resultado);
        }
        return $resultado;
    }

    public function getSuperiores($idhijo, &$resultado, $comparacion, $origen, $tipoelemento
    )
    {
        $data = new DatProyecto();
        $existerelacion = $data->getPadres($idhijo, $comparacion, $origen);
        if ($existerelacion['idelementohijo'] != null) {
            $valor = self::getSuperiores(
                $existerelacion['idelementopadre'], $resultado, $comparacion, $origen, $tipoelemento
            );
            if ($valor != 0) {
                $resultado[] = $valor;
            }
        }
        return $idhijo;
    }

    public function getDependenciasSuperiores($idElemHijo, &$arrayResultado)
    {
        $obj = new DatTarea();
        $existerelacion = $obj->getDependenciaSuperior($idElemHijo);

        if ($existerelacion[0]['idelementohijo'] != null) {
            foreach ($existerelacion as $relacion) {
                $valor = self::getDependenciasSuperiores(
                    $relacion['idelementopadre'], $arrayResultado
                );
                if ($valor != 0) {
                    $arrayResultado[] = $valor;
                }
            }
        }
        $elemento = $obj->getTarea($idElemHijo);
        if ($elemento[0]['idelemento'] != null) {
            return $idElemHijo;
        }
        return 0;
    }

    public function actualizarCumplimientoTareasAnteceden($arrayTareas)
    {

        foreach ($arrayTareas as $elemento) {
            DatTarea::updateGradocumplimientoTarea($elemento);
        }
        return 1;
    }

    public function buscarSuperiores(
        $idelementopadre, &$resultado, $comparacion = '=', $origen = 6, $tipoelemento = 10
    )
    {
        $existerelacion = Doctrine::getTable('DatElementos')
            ->findByDql(
                "idelementohijo = '$idelementopadre' AND origen $comparacion $origen"
            );
        if ($existerelacion[0]->idelementohijo != null) {
            foreach ($existerelacion as $relacion) {
                $valor = self::buscarSuperiores(
                    $relacion->idelementopadre, $resultado, $comparacion, $origen, $tipoelemento
                );
                if ($valor != 0) {
                    $resultado[] = $valor;
                }
            }
        }
        $elemento = Doctrine::getTable('DatElementos')
            ->findByDql(
                "idelemento = '$idelementopadre' AND idtipoelemento = $tipoelemento"
            );
        if ($elemento[0]->idelemento != null) {
            return $idelementopadre;
        }
        return 0;
    }

    public function buscarInferiores(
        $idelementopadre, &$resultado, $comparacion = '<=', $origen = 3, $tipoelemento = 9
    )
    {
        $existerelacion = Doctrine::getTable('DatElementosDatElementos')
            ->findByDql(
                "idelementopadre = '$idelementopadre' AND origen $comparacion $origen"
            );
        if ($existerelacion[0]->idelementohijo != null) {
            foreach ($existerelacion as $relacion) {
                $valor = self::buscarInferiores(
                    $relacion->idelementohijo, $resultado, $comparacion, $origen, $tipoelemento
                );
                if ($valor != 0) {
                    $resultado[] = $valor;
                }
            }
        }
        $elemento = Doctrine::getTable('DatElementos')
            ->findByDql(
                "idelemento = '$idelementopadre' AND idtipoelemento = $tipoelemento"
            );
        if ($elemento[0]->idelemento != null) {
            return $idelementopadre;
        }
        return 0;
    }

    public function cargarMatrizHibrida($p)
    {
        //Definiendo variables
        $arrayTareas = array();
        $filas = Array();
        $columnas1 = array('Antecesores', 'Sucesores');
        $columnas = array();
        $datos = Array();

        //Llenar las columnas
        foreach ($columnas1 as $key => $value) {
            $columnas[$key] = array(
                "denominacion" => $value
            );
        }
        //Obtener relaciones;
        self::getTareasProyecto($p->idproyecto, $arrayTareas);
        self::obtenerDatosPert($p, $arrayResultanteAlgoritmoPert);

        //LLenar las filas;
        foreach ($arrayTareas as $key => $tarea) {
            //Antecedentes.
            $antecedentes = '';
            $cantRelacionA = 0;
            foreach (
                $arrayResultanteAlgoritmoPert['arrayRelacionesPert'] as $key1 => $relacion
            ) {
                if ($tarea['idelemento'] == $relacion['to']) {
                    $task = array_search($relacion['from'], array_column($arrayTareas, 'idelemento'));
                    if ($cantRelacionA >= 1) {
                        $antecedentes .= " , </br> </br>    " . $arrayTareas[$task]['denelemento'];
                        $cantRelacionA++;
                    } else {
                        $antecedentes .= $arrayTareas[$task]['denelemento'];
                        $cantRelacionA++;
                    }
                }
            }

            //Sucesores
            $secuencia = '';
            $cantRelacion = 0;
            foreach (
                $arrayResultanteAlgoritmoPert['arrayRelacionesPert'] as $key2 => $relacion
            ) {
                if ($tarea['idelemento'] == $relacion['from']) {
                    $task = array_search($relacion['to'], array_column($arrayTareas, 'idelemento'));
                    if ($cantRelacion >= 1) {
                        $secuencia .= " , </br> </br>    " . $arrayTareas[$task]['denelemento'];
                        $cantRelacion++;
                    } else {
                        $secuencia .= $arrayTareas[$task]['denelemento'];
                        $cantRelacion++;
                    }
                }
            }
            $antecedentes = ($antecedentes !== '') ? $antecedentes : '-';
            $secuencia = ($secuencia !== '') ? $secuencia : '-';
            //Retornar filas
            $filas[$key] = array(
                "denominacion" => self::Mayus($tarea['denelemento']),
                "codigo" => $tarea['idelemento']
            );

            $datos[] = array(
                "column" => $columnas[0]['denominacion'],
                "row" => self::Mayus($tarea['denelemento']),
                "value" => $antecedentes,
                "hibrida" => true
            );

            $datos[] = array(
                "column" => $columnas[1]['denominacion'],
                "row" => self::Mayus($tarea['denelemento']),
                "value" => $secuencia,
                "hibrida" => true
            );
        }


        $objMatriz = new stdClass();
        $objMatriz->idproyectoplanificacion = $p->idproyecto;
        $objMatriz->denominacionproyecto = $p->denproyecto;
        $objMatriz->columnas = $columnas;
        $objMatriz->filas = $filas;
        $objMatriz->datos = $datos;

        return $objMatriz;
    }

    public function cargarMatrizHibridaTareas($p)
    {
        //Definiendo variables
        $arrayTareas = array();
        $arrayIdTareas = array();
        $filas = Array();
        $columnas = Array();
        $datos = Array();
        //Obtener relaciones;
        self::getTareasProyecto($p->idproyecto, $arrayTareas);
        //Obtener Pert.
        self::obtenerDatosPert($p, $arrayResultanteAlgoritmoPert);

        //LLenar las filas;
        foreach ($arrayTareas as $key => $tarea) {
//            print_r($tarea);
            //Retornar filas
            $filas[$key] = array(
                "denominacion" => self::Mayus($tarea['denelemento'])
            );
            $columnas[$key] = array(
                "denominacion" => self::Mayus($tarea['denelemento'])
            );
            foreach ($arrayResultanteAlgoritmoPert['arrayRelacionesPert'] as $key1 => $relacion) {
                if ($tarea['idelemento'] == $relacion['from']) {
                    $task = array_search($relacion['to'], array_column($arrayTareas, 'idelemento'));
                    $datos[] = array(
                        "column" => self::Mayus($arrayTareas[$task]['denelemento']),
                        "row" => self::Mayus($tarea['denelemento']),
                        "value" => "X",
                    );
                    $datos[] = array(
                        "column" => self::Mayus($tarea['denelemento']),
                        "row" => self::Mayus($arrayTareas[$task]['denelemento']),
                        "value" => "X",
                    );
                }
            }
        }

        $objMatriz = new stdClass();
        $objMatriz->idproyectoplanificacion = $p->idproyecto;
        $objMatriz->denominacionproyecto = $p->denproyecto;
        $objMatriz->columnas = $columnas;
        $objMatriz->filas = $filas;
        $objMatriz->datos = $datos;

        return $objMatriz;
    }

    public function calcularDuracionRealPorTarea($tarea)
    {
        $fechaI = explode('/', $tarea['fechainicio']);
        $datetimeInicio = new DateTime($fechaI[2] . $fechaI[1] . $fechaI[0] . ' ' . $tarea['horainicio']);
        $datetimeFin = new DateTime();
        if ($tarea['gradocumplimiento'] > 0 && $tarea['gradocumplimiento'] < 100) {
            $datetimeFin = new DateTime();
        } else if ($tarea['gradocumplimiento'] == 100) {
            $datetimeFin = new DateTime();
        }

        $tiempoInicio = $datetimeInicio->getTimestamp();
        $tiempoFin = $datetimeFin->getTimestamp();
        $tiempoDuracion = $tiempoFin - $tiempoInicio;
        $duracion = $tiempoDuracion / 60;
        return $duracion;
    }

    public function esAtrasada($tarea)
    {
        $fechaf = explode('/', $tarea['fechafin']);
        $datetimeFin = new DateTime($fechaf[2] . $fechaf[1] . $fechaf[0] . ' ' . $tarea['horafin']);
        $datetimeHoy = new DateTime();
        $tiempoFin = $datetimeFin->getTimestamp();
        $tiempoHoy = $datetimeHoy->getTimestamp();
        if ($tiempoFin > $tiempoHoy) {
            return false;
        } else {
            return true;
        }
    }

    public function getDatosReporte($p)
    {
        $datos = array();
        $objelemmodel = new CmpgestionarelementoModel();
        $arrayTareas = array();
        $columnas_agrupadas = '';
        $data = array();
        $total_costo_plan = 0;
        $total_costo_real = 0;
        $total_costo_normal = 0;
        $total_costo_limite = 0;
        $total_matriz_elasticidad = 0;
        if ($p['tiporeporte'] != 6) {
            self::getTareasProyecto($p['idproyecto'], $arrayTareas);
            usort($arrayTareas, function ($a1, $a2) {

              $sa1 = str_replace('/','-', $a1['fechainicio']);
              $sa2 = str_replace('/','-', $a2['fechainicio']);

              $v1 = strtotime($sa1 . ' '. $a1['horainicio']);
              $v2 = strtotime($sa2. ' '. $a2['horainicio']);
              return ($v1 < $v2) ? -1 : 1;
            });
        }
        switch ($p['tiporeporte']) {
            case 1:
                //Declarando variables a usar.
                $tipo = 'estandar';
                $color = '';
                $cantidadcumplida = 0;
                $cantidadincumplida = 0;
                $cantidadparcial = 0;
                $cantidadpendiente = 0;
                //Obteniendo los datos;
                self::obtenerDatosPert($p, $arrayResultanteAlgoritmoPert);
                //LLenar las filas;
                foreach ($arrayTareas as $key => $tarea) {

                    //Antecedentes.
                    $antecedentes = '';
                    $cantRelacionA = 0;
                    foreach (
                        $arrayResultanteAlgoritmoPert['arrayRelacionesPert'] as $key1 => $relacion
                    ) {
                        if ($tarea['idelemento'] == $relacion['to']) {
                            $task = array_search($relacion['from'], array_column($arrayTareas, 'idelemento'));
                            if ($cantRelacionA >= 1) {
                                $antecedentes .= " , </br> </br>    " . $arrayTareas[$task]['denelemento'];
                                $cantRelacionA++;
                            } else {
                                $antecedentes .= $arrayTareas[$task]['denelemento'];
                                $cantRelacionA++;
                            }
                        }
                    }

                    //Sucesores
                    $secuencia = '';
                    $cantRelacion = 0;
                    foreach (
                        $arrayResultanteAlgoritmoPert['arrayRelacionesPert'] as $key2 => $relacion
                    ) {
                        if ($tarea['idelemento'] == $relacion['from']) {
                            $task = array_search($relacion['to'], array_column($arrayTareas, 'idelemento'));
                            if ($cantRelacion >= 1) {
                                $secuencia .= " , </br> </br>    " . $arrayTareas[$task]['denelemento'];
                                $cantRelacion++;
                            } else {
                                $secuencia .= $arrayTareas[$task]['denelemento'];
                                $cantRelacion++;
                            }
                        }
                    }
                    $antecedentes = ($antecedentes !== '') ? $antecedentes : '-';
                    $secuencia = ($secuencia !== '') ? $secuencia : '-';

                    //Duracion
                    $realminutos = self::calcularDuracionRealPorTarea($tarea);
                    $minutos = $tarea['duracionestimada'];
                    $tiempodesglosado = self::toHours($minutos, '');
                    $tiempodesglosadoreal = self::toHours($realminutos, '');
                    $plan = $tiempodesglosado['dias'] . ' dias ' . $tiempodesglosado['horas'] . ' horas ' . $tiempodesglosado['minutos'] . ' min ';
                    $real = $tiempodesglosadoreal['dias'] . ' dias ' . $tiempodesglosadoreal['horas'] . ' horas ' . $tiempodesglosadoreal['minutos'] . ' min ';
                    $estadocumplimiento
                        = $objelemmodel->actualizarEstadoCumplimiento(
                        $estadocumplimiento, $tarea['gradocumplimiento']
                    );
                    $estado = '';

                    if (($estadocumplimiento == 'Cumplida' || $estadocumplimiento == 'Sobrecumplida') /* && ($realminutos < $minutos || $realminutos == $minutos) */) {
                        $estado = 'ejecutada';
                        $cantidadcumplida++;
//                        $color = '#55d822';
                    } else if (($estadocumplimiento == 'Parcialmente cumplido')/* && ($realminutos < $minutos || $realminutos == $minutos) */) {
                        $estado = 'en ejecuciÃ³n';
                        $cantidadparcial++;
//                        $color = '#FFCC00';
                    } else if (self::esAtrasada($tarea)) {
                        $estado = 'atrasada';
                        $cantidadincumplida++;
//                        $color = '#FF9F9F';
                    } else {
                        $estado = 'en tiempo';
                        $cantidadpendiente++;
//                        $color = 'white';
                    }

                    //Notas sobre cumplimiento.
                    $notacumplimiento = 'Se encuentra ' . $estado . ' con un ' . $tarea['gradocumplimiento'] . ' % de cumplimiento  y su estado es ' . strtolower($estadocumplimiento);

                    //Involucrados
                    $involucradosTarea = DatProyecto::getInvolMatriz($tarea['idelemento']);
                    $involucrados = '';
                    foreach ($involucradosTarea as $key3 => $invol) {
                        $denoInvol = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                            $invol['idusuario'], 'usuario', null
                        );
                        if ($key3 == 0) {
                            $involucrados = $denoInvol;
                        } else {
                            $involucrados .= ", " . $denoInvol;
                        }
                    }

                    //Hitos
                    $padres = DatProyecto::getPadresInmediatos($tarea['idelemento']);
                    //Calcular holguras
                    //Devolver datos
                    $datos[$key]['orden'] = $key + 1;
//                    $datos[$key]['color'] = $color;
                    $datos[$key]['denominacion'] = self::Mayus($tarea['denelemento']);
                    $datos[$key]['codigo'] = $tarea['idelemento'];
                    $datos[$key]['antecedente'] = $antecedentes;
                    $datos[$key]['secuencia'] = $secuencia;
                    $datos[$key]['duracion'] = $plan;
                    //Por hacer en la logica pk esta hecho pero en la vista.
                    $datos[$key]['holgura'] = ($arrayResultanteAlgoritmoPert['arrayActividadesPert'][array_search($tarea['idelemento'], array_column($arrayResultanteAlgoritmoPert['arrayActividadesPert'], 'key'))]['holgura']);
                    $datos[$key]['hitos'] = $padres[0]['denelemento'];
                    $datos[$key]['involucrados'] = $involucrados;
                    $datos[$key]['estadocumplimiento'] = $notacumplimiento;
                }
                $columnas = array('No.', 'Denominaci&oacute;n de la actividad(tarea)', 'Actividades antecedentes', 'Actividades subsiguientes', 'Duraci&oacute;n', 'Holgura', 'Eventos(hitos)', 'Quien ejecuta', 'Nota sobre el cumplimiento', 'Observaciones');
                $referencia = array('orden', 'denominacion', 'antecedente', 'secuencia', 'duracion', 'holgura', 'hitos', 'involucrados', 'estadocumplimiento', 'observaciones');
                $data['subtitulo'] = "<div style='width: 100%;margin-left:15%;float:left;'>" .
                    "<div style='width:15%;height:30px ;float:left;text-align: right;font-size:13px; '>" .
                    "<label style='color: black;font-weight: bold;'>Cumplidas </label> : " .
                    "<label style='color: black;'> " . '   ' . $cantidadcumplida . '   ' . " </label>" .
                    "</div>" .
                    "<div style='width:15%;height:30px ;float:left;text-align: right;font-size:13px; '>" .
                    "<label style='color: black;font-weight: bold;'>Incumplidas </label> : " .
                    "<label style='color: black;'> " . '   ' . $cantidadincumplida . '   ' . " </label>" .
                    "</div>" .
                    "<div style='width:15%;height:30px ;float:left;text-align: right;font-size:13px; '>" .
                    "<label style='color: black;font-weight: bold;'>Parciales </label> : " .
                    "<label style='color: black;'> " . '   ' . $cantidadparcial . '   ' . " </label>" .
                    "</div>"
                    .
                    "</br>"
                    .
                    "</br>" .
                    "<div style='width:15%;height:30px ;float:left;text-align: right;font-size:13px; '>" .
                    "<label style='color: black;font-weight: bold;'>Pendientes </label> : " .
                    "<label style='color: black ;'> " . '   ' . $cantidadpendiente . '   ' . " </label>" .
                    "</div>" .
                    "<div style='width:15%;height:30px ;float:left;text-align: right;font-size:13px; '>" .
                    "<label style='color: black;font-weight: bold;'>TOTAL </label> : " .
                    "<label style='color: black ;'> " . '   ' . ($cantidadcumplida + $cantidadpendiente + $cantidadincumplida + $cantidadparcial) . '   ' . " </label>" .
                    "</div>" .
                    "<div style='width:25%;height:30px ;float:left;text-align: right;font-size:13px; '>" .
                    "<label style='color: black;font-weight: bold;'>Porciento de cumplimiento del proyecto </label> : " .
                    "<label style='color: black ;'> " . '   ' . ($p['gradocumplimiento']) . ' %  ' . " </label>" .
                    "</div>" .
                    "</div>";
                break;
            case 2:
                $tipo = 'encabezado_agrupado';

                $arrayIdTareas = array();
                foreach ($arrayTareas as $key => $tarea) {
                    $arrayIdTareas[$key] = $tarea['idelemento'];
                }
                $arrayIdTareas = implode(',', $arrayIdTareas);
                $a_fi = explode('/', $p['fechainicio']);
                $a_ff = explode('/', $p['fechafin']);
                $fi = $a_fi[2] . '-' . $a_fi[1] . '-' . $a_fi[0];
                $ff = $a_ff[2] . '-' . $a_ff[1] . '-' . $a_ff[0];
                $arrayDias = self::getDatesFromRange($fi, $ff);
//              $arrayFechas = DatProyecto::devolverFechasTareas($arrayIdTareas);
//              foreach ($arrayFechas as $value) {
//                  if (!(array_search($value['fechainicio'], $arrayDias))) {
//                      $arrayDias[] = $value['fechainicio'];
//                  } else if (!(array_search($value['fechafin'], $arrayDias))) {
//                      $arrayDias[] = $value['fechafin'];
//                  }
//              }
                $acumuladas_dias = 0;
//              print_r($arrayDias);die;
                foreach ($arrayDias as $k => $dia) {
                    $cantidad = DatProyecto::getCantidadTareasXDias($arrayIdTareas, $dia);
                    $datos[$k]['dia'] = $k + 1;
                    $acumuladas_dias += $cantidad[0]['cantidad'];
                    $datos[$k]['cant_act_x_dia'] = " " . $cantidad[0]['cantidad'] . " ";
                    $datos[$k]['cant_act_acumuladas'] = " " . $acumuladas_dias . " ";
                    $datos[$k]['avance_x_dia'] = "0";
                }

                $p['informe'] = $p['denoreporte'] . '  ' . $p['denproyecto'] . '  </br> Avance programado por día:</br>' .
                    'F (D-a) = 1/Σe';
                $factor_avance = 1 / $acumuladas_dias;
                $factor_avance_redondeado = self::redondear_decimal(1 / $acumuladas_dias, 100000);
                $acumuladas_dias = 0;
                foreach ($arrayDias as $k => $dia) {
                    $cantidad = DatProyecto::getCantidadTareasXDias($arrayIdTareas, $dia);
                    $acumuladas_dias += $cantidad[0]['cantidad'];
                    $redondear_avance_x_dias = self::redondear_decimal($acumuladas_dias * $factor_avance, 100000);
                    $datos[$k]['avance_x_dia'] = $redondear_avance_x_dias;
                }

                $columnas_agrupadas = '<TR>
                                       <TH style="background:#9D9898;" align="center" COLSPAN="4">
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Factor de avance =&nbsp;' . $factor_avance_redondeado .
                    '<TR>
                                       <TH style="background:#9D9898;" align="center" COLSPAN="4">
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                                               
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                                               
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                                               
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                                               
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                                               
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Avance programado P/Día                                                   
                                   <TR>
                                       <TH style="background:#9D9898;" align="center">Día
                                       <TH style="background:#9D9898;" align="center">Actividades por día
                                       <TH style="background:#9D9898;" align="center">Actividades acumuladas
                                       <TH style="background:#9D9898;" align="center">Avance programado por día';
                $columnas = array('Día', 'Actividades por día', 'Actividades acumuladas', 'Avance programado por día ');
                $referencia = array('dia', 'cant_act_x_dia', 'cant_act_acumuladas', 'avance_x_dia');

                break;
            case 3:
                $tipo = 'estandar';
                $htmlRC_Vectores = '';
                $htmlRC_Sumas = '';
                $htmlTotalActYEventos = '';
                $tiempoestimado = 0;
                self::obtenerDatosPert($p, $arrayResultanteAlgoritmoPert);
                $html = '<div style="font-size:16px;padding:12px 0px;float:left;text-align:center;margin-top:20px;border-top:1px solid #ffffff;width:100%;">';
                foreach ($arrayResultanteAlgoritmoPert['caminoCritico'] as $camino) {
                    $html .= '<label style="font-weight: bold;color: #ff0000">RC = </label>';
                    $htmlRC_Vectores .= '<div style="font-size:16px;padding:12px 0px;float:left;text-align:center;margin-top:20px;border-top:1px solid #DEDEDE;width:100%;">';
                    $htmlRC_Vectores .= '<label style="font-weight: bold;color: #ff0000">RC = </label>';
                    $htmlRC_Sumas .= '<div style="font-size:16px;padding:12px 0px;float:left;text-align:center;margin-top:20px;border-top:1px solid #DEDEDE;width:100%;">';
                    $htmlRC_Sumas .= '<label style="font-weight: bold;color: #ff0000">RC = </label>';
                    $htmlTotalActYEventos .= '<div style="font-size:16px;padding:12px 0px;float:left;text-align:center;margin-top:20px;border-top:1px solid #DEDEDE;width:100%;">';
                    $htmlTotalActYEventos .= '<label style="font-weight: bold">TOTAL DE ACTIVIDADES: ' . '<label style="font-weight: bold;color: #ff0000">' . count($arrayResultanteAlgoritmoPert['arrayActividadesPert']) . '</label></label>';
                    $duracion = ($camino['camino'][0]['tiempoestimado']);
                    foreach ($camino['camino'] as $j => $Camino) {
                        if ($j > 0) {
                            $duracion = $duracion + $Camino['tiempoestimado'];
                        }
                        $signo = ' + ';
                        $tiempo = '';

                        if ($j == (count($camino['camino']) - 1)) {
                            $signo = '';
                        }
                        $html .= '<label>' . $Camino['numero'] . '</label>';
                        $html .= '<label>(' . round($duracion) . 'minutos)</label>';
                        $html .= $signo;
                        $tiempoestimado = floatval($Camino['tiempoestimado']); // * 60;

                        $equivalencia = self::MostrarDuracionPlan($tiempoestimado);
                        if (floatval($tiempoestimado) >= 60) {
                            if ($equivalencia['equivalencia']->equivalenciaDias != 0)
                                $tiempo = intval($equivalencia['equivalencia']->equivalenciaDias) . ' dias';
                            else
                                $tiempo = '';
                            if ($equivalencia['equivalencia']->equivalenciaHoras != 0)
                                $tiempo .= ' ' . intval($equivalencia['equivalencia']->equivalenciaHoras) . ' horas';
                            else
                                $tiempo .= '';
                            if ($equivalencia['equivalencia']->restoMinutos != 0)
                                $tiempo .= ' ' . round($equivalencia['equivalencia']->restoMinutos, 4) . ' min';
                            else
                                $tiempo .= '';
                        } else {
                            $tiempo = $tiempoestimado . ' min';
                        }

                        $htmlRC_Sumas .= '<label style="color: #ff0000">' . $tiempo . $signo . '</label>';
                        if ($j == 0) {
                            $htmlRC_Vectores .= '<label style="color: #ff0000">(' . $Camino['numero'] . ', ' . $camino['camino'][$j + 1]['numero'] . ')</label>';
                        } else if ($j != (count($camino['camino']) - 1)) {
                            $htmlRC_Vectores .= '<label style="color: #ff0000">(' . $camino['camino'][$j]['numero'] . ', ' . $camino['camino'][$j + 1]['numero'] . ')</label>';
                        }
                    }
                    $html .= '<label style="font-weight: bold;color: #ff0000"> = </label>';
                    $duracionMinutos = $camino['duracion'];
                    $html .= '<label>' . round($duracion, 4)/* duracionMinutos */ . ' minutos</label>';
                    $equivalenciaHoras = $duracion /* duracionMinutos */ / (60);
                    $html .= '<label style="font-weight: bold;color: #ff0000"> &tilde;</label>';
                    $html .= '<label>' . $equivalenciaHoras . ' horas</label>';
                    $duracionPlanMinutos = $duracion;
                    $duracionPlanTotal = self::MostrarDuracionPlan($duracionPlanMinutos);
                }

                $html .= $htmlRC_Vectores . $htmlRC_Sumas . $htmlTotalActYEventos . '</div>';
                $inicio = "<div style='width: 100%;float:left;height: 100%;font: Arial;padding:10px;'>" .
                    "<div style='width:100%;height:30px ;float:left;text-align: center;font-size:13px; text-decoration: underline;color: black;'>" .
                    $p['denproyecto'] .
                    "</div>" .
                    "<div style='width:33%;height:30px ;float:left;text-align: right;font-size:13px; '>" .
                    "<label style='text-decoration: underline;color: black;font-weight: bold;'>Inicia </label> : " .
                    "<label style='color: black;'>" . $p['fechainicio'] . "</label>" .
                    "</div>" .
                    "<div style='width:33%;height:30px ;float:left;text-align: center;font-size:13px; '>" .
                    "<label style='text-decoration: underline;color: black;font-weight: bold;'>Termina </label> : " .
                    "<label style='color: black;'>" . $p['fechafin'] . "</label>" .
                    "</div>" .
                    "<div style='width:33%;height:30px ;float:left;text-align: left;font-size:13px; '>" .
                    "<label style='text-decoration: underline;color: black;font-weight: bold;'>DuraciÃ³n </label> : " .
                    "<label style='color: black;'>" . $duracionPlanMinutos . " minutos</label> " .
                    "<label style='color: black;'>( " . $duracionPlanTotal['duracionPlanTotal'] . " )</label> " .
                    "</div>" .
                    $html .
                    "</div> ";
                $data['observaciones'] = $inicio;
//                $referencia = array('descripcion');
//                $columnas = array('');
                break;
            case 4:
                $tipo = 'multiheader';
                $hijos = DatProyecto::getHijosInmediatos($p['idproyecto']);
                $hitos = array();
                $columnas[] = 'Unidad';
                $referenciahitos = array();
                $global = 0;
                $mostrarDuracionGlobal = '';
                foreach ($hijos as $value) {
                    $hitos[] = $value['denelemento'];
                    $referenciahitos[] = $value['idelemento'];
                    self::buscarInferiores($value['idelemento'], $tareas, '<=', 1, 10);
                    $duracion = 0;
                    $mostrarDuracionHito = '';
                    foreach ($tareas as $ta) {
                        $temp = DatProyecto::getDatosTarea($ta);
                        $duracion += floatval($temp[0]['duracionestimada']);
                    }
                    $global += $duracion;
                    $equivalencia = self::MostrarDuracionPlan($duracion)['equivalencia'];
                    if ($equivalencia->equivalenciaAnos !== 0) {
                        $mostrarDuracionHito .= ' ' . $equivalencia->equivalenciaAnos . ' A';
                    }
                    if ($equivalencia->equivalenciaMeses !== 0) {
                        $mostrarDuracionHito .= ' ' . $equivalencia->equivalenciaMeses . ' M';
                    }
                    if ($equivalencia->equivalenciaDias !== 0) {
                        $mostrarDuracionHito .= ' ' . $equivalencia->equivalenciaDias . ' D';
                    }
                    if ($equivalencia->equivalenciaHoras !== 0) {
                        $mostrarDuracionHito .= ' ' . $equivalencia->equivalenciaHoras . ' H';
                    }
                    $datos[0]['datoshitos'][$value['idelemento']] = $mostrarDuracionHito;
                }
                $equivalenciaGlobal = self::MostrarDuracionPlan($global)['equivalencia'];
                if ($equivalenciaGlobal->equivalenciaAnos !== 0) {
                    $mostrarDuracionGlobal .= ' ' . $equivalenciaGlobal->equivalenciaAnos . ' A';
                }
                if ($equivalenciaGlobal->equivalenciaMeses !== 0) {
                    $mostrarDuracionGlobal .= ' ' . $equivalenciaGlobal->equivalenciaMeses . ' M';
                }
                if ($equivalenciaGlobal->equivalenciaDias !== 0) {
                    $mostrarDuracionGlobal .= ' ' . $equivalenciaGlobal->equivalenciaDias . ' D';
                }
                if ($equivalenciaGlobal->equivalenciaHoras !== 0) {
                    $mostrarDuracionGlobal .= ' ' . $equivalenciaGlobal->equivalenciaHoras . ' H';
                }
                $datos[0]['unidad'] = $p['denomestructura'];
                $datos[0]['plazototal'] = $mostrarDuracionGlobal;

                $data[0]->encabezados[] = array(
                    'tipo' => 'simple',
                    'emptyvalue' => 0,
//                    'actual' => 'actual',
                    'center' => true,
                    'columnas' => array('UNIDAD'),
                    'referencias' => array('unidad')
                );;
                $data[0]->encabezados[] = array(
                    'tipo' => 'simple',
                    'emptyvalue' => '-',
                    'inside' => 'datoshitos',
                    'center' => true,
                    'header' => 'EVENTOS',
                    'columnas' => $hitos,
                    'referencias' => $referenciahitos
                );
                $data[0]->encabezados[] = array(
                    'tipo' => 'simple',
                    'emptyvalue' => 0,
                    'center' => true,
                    'columnas' => array('PLAZO TOTAL'),
                    'referencias' => array('plazototal')
                );


                break;
            case 5:

                $tipo = 'estandar';
                $p['informe'] = $p['denoreporte'] . '  ' . $p['denproyecto'] . '  </br> RESUMEN DE RECURSOS Y/O EQUIPAMIENTO : ';
                $columnas = array('DenominaciÃ³n', 'Unidad de medida', 'Cantidad', 'Valor CUP', 'valor CUC');
                $referencia = array('denominacion', 'um', 'cantidad', 'valor', 'valor1');
                self::getTareasProyecto($p['idproyecto'], $arrayTareas);
                $recursot = array();
                foreach ($arrayTareas as $key => $tarea) {
                    //...llenar array filas...
                    $recursos = DatProyecto::getRecursoTarea($tarea['idelemento']);
                    foreach ($recursos as $recurso) {
                        if (!(array_search($recurso['idnomenclador'], array_column($recursot, 'idnomenclador'))) && (array_search($recurso['idnomenclador'], array_column($recursot, 'idnomenclador'))) !== 0) {
                            $recursot[] = $recurso;
                        } else {
                            $recursot[(array_search($recurso['idnomenclador'], array_column($recursot, 'idnomenclador')))]['cantidad'] += round($recurso['cantidad'], 3);
                            $recursot[(array_search($recurso['idnomenclador'], array_column($recursot, 'idnomenclador')))]['valor'] += round($recurso['valor'], 3);
                            $recursot[(array_search($recurso['idnomenclador'], array_column($recursot, 'idnomenclador')))]['valor1'] += round($recurso['valor1'], 3);
                        }
                    }
                }
                $datos = $recursot;
                break;
            case 6:
                $tipo = 'estandar';
                $p_idestructura = $p['idestructura'];
                $fechainicio = $p['fechainicio'] ? $p['fechainicio'] : '01/2/2017';
                $fechafin = $p['fechafin'] ? $p['fechafin'] : '30/6/2017';
                $p['informe'] = $p['denoreporte'] . '  ' . $p['denproyecto'] . '  </br> RESUMEN DE TAREAS : ';
                $columnas = array('Persona', 'Proyecto', 'Hito', 'Tarea', 'Fecha inicio', 'Fecha inicio', 'Tiempo dedicado', 'Tareas totales', 'Cumplidas', 'Pendientes', '%', '% avance');
                $referencia = array('persona', 'proyecto', 'hito', 'tarea', 'fechainicio', 'fechafin', 'tiempodedicado', 'totaltareas', 'tareascumplidas', 'pendientes', 'porcientocumplimiento', 'avance');

                $consulta = "SELECT * FROM mod_planifproyecto.f_reporte_tareas_semanal($p_idestructura, '$fechainicio','$fechafin');";
                $connA = Doctrine_Manager:: connection();
                $result = $connA->execute($consulta)->fetchAll(PDO::FETCH_ASSOC);
                $datos = $result;
                break;
            case 7:
                $tipo = 'encabezado_agrupado';
                $p['informe'] = $p['denoreporte'] . '  ' . $p['denproyecto'] . '  </br> PLAN VS REAL : ';
                $columnas_agrupadas = '<TR>
                                                <TH style="background:#9D9898;" align="center" ROWSPAN="2">Actividad 
                                                <TH style="background:#9D9898;" align="center" ROWSPAN="2">UM
                                                <TH style="background:#9D9898;" align="center" ROWSPAN="2">Costo    
                                                <TH style="background:#9D9898;" align="center" COLSPAN="2">Plan
                                                <TH style="background:#9D9898;" align="center" COLSPAN="2">Real    
                                                <TH style="background:#9D9898;" align="center" ROWSPAN="2">% de cumplimiento            
                                                        <TR>
                                                        <TH style="background:#9D9898;" align="center">Valor
                                                        <TH style="background:#9D9898;" align="center">Costo
                                                        <TH style="background:#9D9898;" align="center">Valor
                                                        <TH style="background:#9D9898;" align="center">Costo';
                $columnas = array('Actividad', 'UM', 'Costo', 'Valor plan', 'Costo plan', 'Valor real', 'Costo real', '% de cumplimiento');
                $referencia = array('denominacion', 'um', 'costo', 'valor_p', 'costo_p', 'valor_r', 'costo_r', 'cumplimiento');

              usort($arrayTareas, function ($a1, $a2) {

                $sa1 = str_replace('/','-', $a1['fechainicio']);
                $sa2 = str_replace('/','-', $a2['fechainicio']);

                $v1 = strtotime($sa1 . ' '. $a1['horainicio']);
                $v2 = strtotime($sa2. ' '. $a2['horainicio']);
                return ($v1 < $v2) ? -1 : 1;
              });

                foreach ($arrayTareas as $key => $tarea) {
                    $datos[$key]['denominacion'] = self::Mayus($tarea['denelemento']);
                    $datos[$key]['um'] = $tarea['unidadmedida'];
                    $datos[$key]['costo'] = $tarea['costo'];
                    $datos[$key]['valor_p'] = $tarea['valormeta'];
                    $datos[$key]['costo_p'] = $tarea['valormeta'] * $tarea['costo'];
                    $datos[$key]['valor_r'] = $tarea['valorreal'];
                    $datos[$key]['costo_r'] = $tarea['valorreal'] * $tarea['costo'];
                    $datos[$key]['cumplimiento'] = $tarea['gradocumplimiento'] + ' %';

                    $total_costo_plan += $datos[$key]['costo_p'];
                    $total_costo_real += $datos[$key]['costo_r'];
                }
                break;
            case 8:
                $tipo = 'encabezado_agrupado';

              usort($arrayTareas, function ($a1, $a2) {

                $sa1 = str_replace('/','-', $a1['fechainicio']);
                $sa2 = str_replace('/','-', $a2['fechainicio']);

                $v1 = strtotime($sa1 . ' '. $a1['horainicio']);
                $v2 = strtotime($sa2. ' '. $a2['horainicio']);
                return ($v1 < $v2) ? -1 : 1;
              });

                $arrayIdTareas = array();
                foreach ($arrayTareas as $key => $tarea) {
                    $arrayIdTareas[$key] = $tarea['idelemento'];
                }
                $arrayIdTareas = implode(',', $arrayIdTareas);
                $a_fi = explode('/', $p['fechainicio']);
                $a_ff = explode('/', $p['fechafin']);
                $fi = $a_fi[2] . '-' . $a_fi[1] . '-' . $a_fi[0];
                $ff = $a_ff[2] . '-' . $a_ff[1] . '-' . $a_ff[0];
                $arrayDias = self::getDatesFromRange($fi, $ff);
                $acumuladas_dias = 0;
//              print_r($arrayDias);die;
                foreach ($arrayDias as $k => $dia) {
                    $cantidad = DatProyecto::getCantidadTareasXDias($arrayIdTareas, $dia);
                    $acumuladas_dias += $cantidad[0]['cantidad'];
                }

                $p['informe'] = $p['denoreporte'] . '  ' . $p['denproyecto'] . '  </br>Porcentaje de avance real de las Tareas:</br>' .
                    'F (D-a) = 1/Σe';
                $factor_avance = 1 / $acumuladas_dias;
                $pos = 0;
                foreach ($arrayDias as $k => $dia) {
                    $respuesta = DatProyecto::getCantidadTareasXDiasDenominacion($arrayIdTareas, $dia);
                    $column_day = '<TH align="center" ROWSPAN="' . (count($respuesta)) . '">' . ($k + 1);
                    foreach ($respuesta as $H => $tarea) {
                        $avance = self::redondear_decimal(($tarea['gradocumplimiento'] / 100) * $factor_avance, 100000);
                        $datos[$pos]['tareas'] = " " . $tarea['denelemento'] . " ";
                        $datos[$pos]['porciento_avance'] = " " . $avance . " ";
                        $datos[$pos]['tr_columna'] = '<TR>' . $column_day . '                                       
                                       <TH align="center">' . " " . $tarea['denelemento'] . '
                                       <TH align="center">' . " " . $avance;
                        $column_day = '';
                        $pos++;
                    }
                }
                $columnas_agrupadas = '<TR>
                                       <TH style="background:#9D9898;" align="center" COLSPAN="4">
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                       Avance programado P/Día' .
                    '<TR>
                                       <TH style="background:#9D9898;" align="center" COLSPAN="4">
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                       Factor de avance =&nbsp;' . $factor_avance .
                    '<TR>
                                       <TH style="background:#9D9898;" align="center">Día
                                       <TH style="background:#9D9898;" align="center">Tareas
                                       <TH style="background:#9D9898;" align="center">% Avance';
                $columnas = array('Día', 'Tareas', '% Avance');
                $referencia = array('dia', 'tareas', 'porciento_avance');
                break;

            case 9:
                $tipo = 'estandar';
                $arrayTareas = array();
                self::getTareasProyectoCumplidaFueraTiempo($p['idproyecto'], $arrayTareas);
                $p['informe'] = $p['denoreporte'] . '  ' . $p['denproyecto'] . '  </br> Resumen de tareas cumplidas fuera de tiempo: ';
                $columnas = array('Nro.', 'Actividad', 'Fecha-Hora</br>inicio', 'Fecha-Hora</br>fin', 'Fecha-Hora</br>cumplimiento');
                $referencia = array('nro', 'denominacion', 'fh_i', 'fh_f', 'fh_c');
                foreach ($arrayTareas as $key => $tarea) {
                    $datos[$key]['nro'] = $key + 1;
                    $datos[$key]['denominacion'] = self::Mayus($tarea['denelemento']);
                    $datos[$key]['fh_i'] = $tarea['fh_i'];
                    $datos[$key]['fh_f'] = $tarea['fh_f'];
                    $datos[$key]['fh_c'] = $tarea['fh_c'];
                }
                break;

            /*             * ****
              Este es un reporte de matriz con el nombre Matriz de costo;
             * * */
            case 10:
                $tipo = 'encabezado_agrupado';
                $arrayTareas = array();
                self::getTareasProyecto($p['idproyecto'], $arrayTareas);

                $data[0]->leyenda =
                    "<TABLE width=\"100%\" id=\"tablaleyenda\" class=\"table\" BORDER=\"0\">
                      <tr><th width=\"20%\" style ='align=\"center\"; font-size: 12px; font-family: bold; font-weight: bold;'>
                              •	To:Tiempo óptimo.<br>
                              •	Te: Tiempo estándar.</br></br>
                              &nbsp;&nbsp;Fórmula: Costo Límite (CL) = [ ( (CN * To) / Te) + CN] * 0.85
                              </table>";

                $p['informe'] = 'Matriz de costo: </br></br>' . $p['denproyecto'] .
                    '</br>';
                $columnas_agrupadas = '<TR>
                                   <TH style="background:#9D9898;" align="center">Nro
                                   <TH style="background:#9D9898;" align="center">Actividad
                                   <TH style="background:#9D9898;" align="center">Costo normal
                                   <TH style="background:#9D9898;" align="center">Costo límite';

                $columnas = array('Nro.', 'Actividad', 'Costo normal', 'Costo límite');
                $referencia = array('nro', 'denominacion', 'costo_normal', 'costo_limite');

                usort($arrayTareas, function ($a1, $a2) {

                  $sa1 = str_replace('/','-', $a1['fechainicio']);
                  $sa2 = str_replace('/','-', $a2['fechainicio']);

                  $v1 = strtotime($sa1 . ' '. $a1['horainicio']);
                  $v2 = strtotime($sa2. ' '. $a2['horainicio']);
                  return ($v1 < $v2) ? -1 : 1;
                });

                foreach ($arrayTareas as $key => $tarea) {
                    $TN = $tarea['duracionestimada'] / 60;
                    $TL = $tarea['tiempooptimista'] / 60;
                    $CN = ($tarea['costo'] * $tarea['valormeta'] > 0) ? $tarea['costo'] * $tarea['valormeta'] : $tarea['costo'];
                    $CL = ((($CN * $TL) / $TN) + $CN) * 0.85;
                    $datos[$key]['nro'] = $key + 1;
                    $datos[$key]['denominacion'] = self::Mayus($tarea['denelemento']);
                    $datos[$key]['costo_normal'] = $CN;
                    $datos[$key]['costo_limite'] = self::redondear_decimal($CL, 100000);

                    $total_costo_normal += $CN;
                    $total_costo_limite += $CL;
                }
                $total_costo_normal = self::redondear_decimal($total_costo_normal, 100000);
                $total_costo_limite = self::redondear_decimal($total_costo_limite, 100000);
                break;
            /*             * ****
              Este es un reporte de matriz con el nombre Matriz de pendiente;
             * * */
            case 11:
                $tipo = 'encabezado_agrupado';
                $arrayTareas = array();
                self::getTareasProyecto($p['idproyecto'], $arrayTareas);

                $data[0]->leyenda =
                    "<TABLE width=\"100%\" id=\"tablaleyenda\" class=\"table\" BORDER=\"0\">
                      <tr><th width=\"20%\" style ='align=\"center\"; font-size: 12px; font-family: bold; font-weight: bold;'>
                              •	To:Tiempo óptimo.<br>
                              •	Te: Tiempo estándar.</br></br>
                              &nbsp;&nbsp;Fórmula: M = (CL – CN) / (Te – To)
                              </table>";

                $p['informe'] = 'Matriz de pendiente: </br></br>' . $p['denproyecto'] . '</br>';
                $columnas_agrupadas = '<TR>
                                                <TH style="background:#9D9898;" align="center" ROWSPAN="2">Nro 
                                                <TH style="background:#9D9898;" align="center" ROWSPAN="2">Actividad   
                                                <TH style="background:#9D9898;" align="center" COLSPAN="2">Tiempos
                                                <TH style="background:#9D9898;" align="center" COLSPAN="2">Costos    
                                                <TH style="background:#9D9898;" align="center" ROWSPAN="2">M = Pesos/Días            
                                                        <TR>
                                                        <TH style="background:#9D9898;" align="center">TN
                                                        <TH style="background:#9D9898;" align="center">TL
                                                        <TH style="background:#9D9898;" align="center">CN
                                                        <TH style="background:#9D9898;" align="center">CL';

                $columnas = array('Nro.', 'Actividad', 'Tiempos', 'Costos', 'M = Pesos/Días');
                $referencia = array('nro', 'denominacion', 'tn', 'tl', 'cn', 'cl', 'peso_dias');

                  usort($arrayTareas, function ($a1, $a2) {

                    $sa1 = str_replace('/','-', $a1['fechainicio']);
                    $sa2 = str_replace('/','-', $a2['fechainicio']);

                    $v1 = strtotime($sa1 . ' '. $a1['horainicio']);
                    $v2 = strtotime($sa2. ' '. $a2['horainicio']);
                    return ($v1 < $v2) ? -1 : 1;
                  });

                foreach ($arrayTareas as $key => $tarea) {
                    $str_tn = self::getDiasHorasMinutos($tarea['duracionestimada']);
                    $str_tl = self::getDiasHorasMinutos($tarea['tiempooptimista']);
                    $TN = $tarea['duracionestimada'] / 60;
                    $TL = $tarea['tiempooptimista'] / 60;
                    $CN = $tarea['costo'] * $tarea['valormeta'];
                    $CL = ((($CN * $TL) / $TN) + $CN) * 0.85;
                    $datos[$key]['nro'] = $key + 1;
                    $datos[$key]['denominacion'] = self::Mayus($tarea['denelemento']);
                    $datos[$key]['tn'] = $str_tn;
                    $datos[$key]['tl'] = $str_tl;
                    $datos[$key]['cn'] = $CN;
                    $datos[$key]['cl'] = self::redondear_decimal($CL, 100000);
                    $datos[$key]['peso_dias'] = self::redondear_decimal(($CL - $CN) / ($TN - $TL), 100000);
                }
                break;
            /*             * ****
              Este es un reporte de matriz con el nombre Matriz de pendiente;
             * * */
            case 12:
                $tipo = 'encabezado_agrupado';
                $arrayTareas = array();
                $arrayResultanteAlgoritmoPert = array();
                self::getTareasProyecto($p['idproyecto'], $arrayTareas);
                self::obtenerDatosPert($p, $arrayResultanteAlgoritmoPert);

                /**
                 * Pi = TIMP
                 * Pj = TIML
                 * Ui = TTMP
                 * Uj = TTML
                 * */
                $data[0]->leyenda =
                    "<TABLE width=\"100%\" id=\"tablaleyenda\" class=\"table\" BORDER=\"0\">
                      <tr><th width=\"20%\" style ='align=\"center\"; font-size: 12px; font-family: bold; font-weight: bold;'>
                              •	To:Tiempo óptimo.<br>
                              •	Tm: Tiempo más probable.<br>
                              •	Tp:Tiempo pesimista.<br>
                              •	Te: Tiempo estándar.<br>
                              •	$ N: Costo normal.<br>
                              •	$ L: Costo límite.
                           <th width=\"30%\" style ='align=\"center\"; font-size: 12px; font-family: bold; font-weight: bold;'>
                              •	TIMT: Tiempo inicial más tardío.<br>
                              •	TFMT: Tiempo final más tardío.<br>
                              •	TIMP: Tiempo inicial más próximo.<br>
                              •	TFMP: Tiempo final más próximo. 
                           <th width=\"40%\" style ='align=\"center\"; font-size: 12px; font-family: bold; font-weight: bold;'>
                              •	HT: Holgura total (HT = TFMT – TIMT -Te).<br>
                              •	HL: Holgura límite (HL = TFMP – TIMT -Te).<br>
                              •	HI: Holgura independiente (HI = TFMP – TIMT -Te).<br>
                              •	D: Días en que puede comprimirse la red. (D = To - Te). 
                           <tr><th width=\"70%\" style ='align=\"center\"; font-size: 12px; font-family: bold; font-weight: bold;' COLSPAN=\"3\">
                              •	% Compresión: debe mostrar el porcentaje de compresión (%C = (Te – To) / Te).<br>
                              •	σ: Desviación estándar (σ= (Tp – To)/6).<br>
                              •	σ %: Desviación estándar (	σ %= 	σ *100).<br>
                              •	σ (Proy): Desviación estándar del proyecto (σ (Proy) = Σ σ (Camino crítico)).
                              </table>";

                $p['informe'] = 'Matriz de elasticidad: </br></br>' . $p['denproyecto'];

                $columnas_agrupadas = '<TR>                                             
                                      <TH style="background:#9D9898;" align="center" ROWSPAN="2">Actividad   
                                      <TH style="background:#9D9898;" align="center" ROWSPAN="2">Secuencia   
                                      <TH style="background:#9D9898;" align="center" COLSPAN="4">Tiempos
                                      <TH style="background:#9D9898;" align="center" COLSPAN="2">Costos    
                                      <TH style="background:#9D9898;" align="center" COLSPAN="4">Lecturas    
                                      <TH style="background:#9D9898;" align="center" COLSPAN="3">HT    
                                      <TH style="background:#9D9898;" align="center" COLSPAN="0">HL    
                                      <TH style="background:#9D9898;" align="center" COLSPAN="0">HI    
                                      <TH style="background:#9D9898;" align="center" ROWSPAN="2">D  
                                      <TH style="background:#9D9898;" align="center" ROWSPAN="2">Compresión %    
                                      <TH style="background:#9D9898;" align="center" ROWSPAN="2">σ            
                                      <TH style="background:#9D9898;" align="center" ROWSPAN="2">σ %            
                                      <TH style="background:#9D9898;" align="center" ROWSPAN="2">σ (Proy)            
                                              <TR>
                                              <TH style="background:#9D9898;" align="center">O
                                              <TH style="background:#9D9898;" align="center">M
                                              <TH style="background:#9D9898;" align="center">P
                                              <TH style="background:#9D9898;" align="center">T
                                              <TH style="background:#9D9898;" align="center">$N
                                              <TH style="background:#9D9898;" align="center">$L
                                              <TH style="background:#9D9898;" align="center">TIMT
                                              <TH style="background:#9D9898;" align="center">TFMP
                                              <TH style="background:#9D9898;" align="center">TTMP
                                              <TH style="background:#9D9898;" align="center">TFMT
                                              <TH style="background:#9D9898;" align="center">Días
                                              <TH style="background:#9D9898;" align="center">%
                                              <TH style="background:#9D9898;" align="center">CI
                                              <TH style="background:#9D9898;" align="center">Días
                                              <TH style="background:#9D9898;" align="center">Días';

                $columnas = array('Actividad', 'Secuencia', 'O', 'M', 'P', 'T', '$N', '$L', 'Ui', 'Uj', 'Pi', 'Pj', 'Días', '%', 'CI', 'Días', 'Días', 'D', 'Compresión %');
                $referencia = array('denominacion', 'secuencia', 'o', 'm', 'p', 't', 'n', 'l', 'Pi', 'Pj', 'Ui', 'Uj', 'dias1', 'porciento', 'CI', 'dias2', 'dias3', 'D',
                    'porciento_compresion', 'varianza', 'porciento_varianza', 'varianza_proy');

                  usort($arrayTareas, function ($a1, $a2) {

                    $sa1 = str_replace('/','-', $a1['fechainicio']);
                    $sa2 = str_replace('/','-', $a2['fechainicio']);

                    $v1 = strtotime($sa1 . ' '. $a1['horainicio']);
                    $v2 = strtotime($sa2. ' '. $a2['horainicio']);
                    return ($v1 < $v2) ? -1 : 1;
                  });


                foreach ($arrayTareas as $key => $tarea) {

                    //Sucesores
                    $secuencia = '';
                    $cantRelacion = 0;

                    $informacion_tiempo_antes = self::getInformacionTiempoAntes($tarea, $arrayTareas, $arrayResultanteAlgoritmoPert);
                    $Ui = $informacion_tiempo_antes['Ui'];
                    $Pi = $informacion_tiempo_antes['Pi'];

                    $informacion_tiempo_despues = self::getInformacionTiempoDespues($tarea, $arrayTareas, $arrayResultanteAlgoritmoPert);
                    $Uj = $informacion_tiempo_despues['Uj'];
                    $Pj = $informacion_tiempo_despues['Pj'];

                    $HT = $Uj - $Pi - $tarea['duracionestimada'];
                    $HL = $Pj - $Pi - $tarea['duracionestimada'];
                    $HI = $Pj - $Ui - $tarea['duracionestimada'];
                    $H = $Uj - $Ui;

                    foreach (
                        $arrayResultanteAlgoritmoPert['arrayRelacionesPert'] as $key2 => $relacion
                    ) {
                        if ($tarea['idelemento'] == $relacion['from']) {
                            $task = array_search($relacion['to'], array_column($arrayTareas, 'idelemento'));
                            if ($cantRelacion >= 1) {
                                $secuencia .= " , </br> </br>    " . $arrayTareas[$task]['denelemento'];
                                $cantRelacion++;
                            } else {
                                $secuencia .= $arrayTareas[$task]['denelemento'];
                                $cantRelacion++;
                            }
                        }
                    }

                    $secuencia = ($secuencia !== '') ? $secuencia : '-';

                    $TN = $tarea['duracionestimada'] / 60;
                    $TL = $tarea['tiempooptimista'] / 60;
                    $CN = $tarea['costo'] * $tarea['valormeta'];
                    $CL = ((($CN * $TL) / $TN) + $CN) * 0.85;
                    $datos[$key]['denominacion'] = self::Mayus($tarea['denelemento']);
                    $datos[$key]['secuencia'] = $secuencia;
                    $datos[$key]['o'] = ($tarea['tiempooptimista'] == 0) ? '0' . ' ' : self::getDiasHorasMinutos($tarea['tiempooptimista']);
                    $datos[$key]['m'] = ($tarea['tiempomedio'] == 0) ? '0' . ' ' : self::getDiasHorasMinutos($tarea['tiempomedio']);
                    $datos[$key]['p'] = ($tarea['tiempopesimista'] == 0) ? '0' . ' ' : self::getDiasHorasMinutos($tarea['tiempopesimista']);
                    $datos[$key]['t'] = ($tarea['duracionestimada'] == 0) ? '0' . ' ' : self::getDiasHorasMinutos($tarea['duracionestimada']);
                    $datos[$key]['n'] = $tarea['valormeta'] * $tarea['costo'];
                    $datos[$key]['l'] = $CL;
                    $datos[$key]['Ui'] = ($Ui == 0) ? '0' . ' ' : self::getDiasHorasMinutos($Ui);
                    $datos[$key]['Uj'] = ($Uj == 0) ? '0' . ' ' : self::getDiasHorasMinutos($Uj);
                    $datos[$key]['Pi'] = ($Pi == 0) ? '0' . ' ' : self::getDiasHorasMinutos($Pi);
                    $datos[$key]['Pj'] = ($Pj == 0) ? '0' . ' ' : self::getDiasHorasMinutos($Pj);
                    $datos[$key]['dias1'] = self::getDiasHorasMinutos($HT);
                    $datos[$key]['porciento'] = self::redondear_decimal($HT / $tarea['duracionestimada'], 100000);
                    $datos[$key]['CI'] = ($HT / $tarea['duracionestimada'] == 0) ? 'C' : self::getDiasHorasMinutos($HT);
                    $datos[$key]['dias2'] = ($HL == 0) ? '0' . ' ' : self::getDiasHorasMinutos($HL);
                    $datos[$key]['dias3'] = ($HI == 0) ? '0' . ' ' : self::getDiasHorasMinutos($HI);
                    $datos[$key]['D'] = ($tarea['tiempooptimista'] / $tarea['duracionestimada'] == 0) ? '0' . ' ' : self::getDiasHorasMinutos($tarea['tiempooptimista'] / $tarea['duracionestimada']);
                    $datos[$key]['porciento_compresion'] = self::redondear_decimal(($tarea['duracionestimada'] - $tarea['tiempooptimista']) / $tarea['duracionestimada'], 100000);
                    $datos[$key]['varianza'] = self::redondear_decimal(($tarea['tiempopesimista'] - $tarea['tiempooptimista']) / 6, 100000);
                    $datos[$key]['porciento_varianza'] = self::redondear_decimal((($tarea['tiempopesimista'] - $tarea['tiempooptimista']) / 6) * 100, 100000);
                    if ($H == 0) {
                        $datos[$key]['varianza_proy'] = self::redondear_decimal(($tarea['tiempopesimista'] - $tarea['tiempooptimista']) / 6, 100000);
                        $total_matriz_elasticidad += self::redondear_decimal(($tarea['tiempopesimista'] - $tarea['tiempooptimista']) / 6, 100000);
                    } else {
                        $datos[$key]['varianza_proy'] = '-';
                    }
                }
                break;
            /*             * ****
              Este es un reporte de matriz con el nombre Matriz de secuencia;
             * * */
            case 13:
                $tipo = 'encabezado_agrupado';
                $arrayTareas = array();
                $arrayResultanteAlgoritmoPert = array();
                self::getTareasProyecto($p['idproyecto'], $arrayTareas);
                self::obtenerDatosPert($p, $arrayResultanteAlgoritmoPert);
                $p['informe'] = 'Matriz de secuencia: </br></br>' . $p['denproyecto'];
                $columnas_agrupadas = '<TR>
                                              <TH style="background:#9D9898;" align="center">Actividad 
                                              <TH style="background:#9D9898;" align="center">Secuencia';

                $columnas = array('Actividad', 'Secuencia');
                $referencia = array('denominacion', 'secuencia');

                  usort($arrayTareas, function ($a1, $a2) {

                    $sa1 = str_replace('/','-', $a1['fechainicio']);
                    $sa2 = str_replace('/','-', $a2['fechainicio']);

                    $v1 = strtotime($sa1 . ' '. $a1['horainicio']);
                    $v2 = strtotime($sa2. ' '. $a2['horainicio']);
                    return ($v1 < $v2) ? -1 : 1;
                  });

                foreach ($arrayTareas as $key => $tarea) {

                    //Sucesores
                    $secuencia = '';
                    $cantRelacion = 0;

                    foreach (
                        $arrayResultanteAlgoritmoPert['arrayRelacionesPert'] as $key2 => $relacion
                    ) {
                        if ($tarea['idelemento'] == $relacion['from']) {
                            $task = array_search($relacion['to'], array_column($arrayTareas, 'idelemento'));
                            if ($cantRelacion >= 1) {
                                $secuencia .= " , </br> </br>    " . $arrayTareas[$task]['denelemento'];
                                $cantRelacion++;
                            } else {
                                $secuencia .= $arrayTareas[$task]['denelemento'];
                                $cantRelacion++;
                            }
                        }
                    }

                    $secuencia = ($secuencia !== '') ? $secuencia : '-';
                    $datos[$key]['denominacion'] = self::Mayus($tarea['denelemento']);
                    $datos[$key]['secuencia'] = $secuencia;
                }
                break;
            /*             * ****
              Este es un reporte de matriz con el nombre Matriz de antecedentes;
             * * */
            case 14:
                $tipo = 'encabezado_agrupado';
                $arrayTareas = array();
                $arrayResultanteAlgoritmoPert = array();
                self::getTareasProyecto($p['idproyecto'], $arrayTareas);
                self::obtenerDatosPert($p, $arrayResultanteAlgoritmoPert);
                $p['informe'] = 'Matriz de antecedentes: </br></br>' . $p['denproyecto'];
                $columnas_agrupadas = '<TR>
                                              <TH style="background:#9D9898;" align="center">Actividad
                                              <TH style="background:#9D9898;" align="center">Antecedentes';

                $columnas = array('Actividad', 'Antecedentes');
                $referencia = array('denominacion', 'antecedentes');

                usort($arrayTareas, function ($a1, $a2) {

                  $sa1 = str_replace('/','-', $a1['fechainicio']);
                  $sa2 = str_replace('/','-', $a2['fechainicio']);

                  $v1 = strtotime($sa1 . ' '. $a1['horainicio']);
                  $v2 = strtotime($sa2. ' '. $a2['horainicio']);
                  return ($v1 < $v2) ? -1 : 1;
                });

                foreach ($arrayTareas as $key => $tarea) {

                    //Antecedentes.
                    $antecedentes = '';
                    $cantRelacionA = 0;
                    foreach (
                        $arrayResultanteAlgoritmoPert['arrayRelacionesPert'] as $key1 => $relacion
                    ) {
                        if ($tarea['idelemento'] == $relacion['to']) {
                            $task = array_search($relacion['from'], array_column($arrayTareas, 'idelemento'));
                            if ($cantRelacionA >= 1) {
                                $antecedentes .= " , </br> </br>    " . $arrayTareas[$task]['denelemento'];
                                $cantRelacionA++;
                            } else {
                                $antecedentes .= $arrayTareas[$task]['denelemento'];
                                $cantRelacionA++;
                            }
                        }
                    }

                    $antecedentes = ($antecedentes !== '') ? $antecedentes : '-';
                    $datos[$key]['denominacion'] = self::Mayus($tarea['denelemento']);
                    $datos[$key]['antecedentes'] = $antecedentes;
                }
                break;
            /*             * ****
              Este es un reporte de matriz con el nombre Matriz de tiempo;
             * * */
            case 15:
                $tipo = 'encabezado_agrupado';
                $arrayTareas = array();
                $arrayResultanteAlgoritmoPert = array();
                self::getTareasProyecto($p['idproyecto'],$arrayTareas);
                self::obtenerDatosPert($p, $arrayResultanteAlgoritmoPert);

                $data[0]->leyenda =
                    "<TABLE width=\"100%\" id=\"tablaleyenda\" class=\"table\" BORDER=\"0\">
                      <tr><th width=\"20%\" style ='align=\"center\"; font-size: 12px; font-family: bold; font-weight: bold;'>
                              •	To:Tiempo óptimo.<br>
                              •	Tm: Tiempo más probable.<br>
                              •	Tp:Tiempo pesimista.<br>
                              •	Te: Tiempo estándar.</br></br>
                              &nbsp;&nbsp;Fórmula: Te = (To + 4Tm + Tp)/6
                              </table>";

                $p['informe'] = 'Matriz de tiempo: </br></br>' . $p['denproyecto'] . '</br>';
                $columnas_agrupadas = '<TR>
                                              <TH style="background:#9D9898;" align="center">Actividad
                                              <TH style="background:#9D9898;" align="center">To
                                              <TH style="background:#9D9898;" align="center">Tm
                                              <TH style="background:#9D9898;" align="center">Tp
                                              <TH style="background:#9D9898;" align="center">Te
                                              <TH style="background:#9D9898;" align="center">Fecha inicio
                                              <TH style="background:#9D9898;" align="center">Hora inicio';

                $columnas = array('Actividad', 'O', 'M', 'P', 'T', 'Fecha inicio', 'Hora inicio');
                $referencia = array('denominacion', 'o', 'm', 'p', 't', 'fi', 'hi');

                usort($arrayTareas, function ($a1, $a2) {

                    $sa1 = str_replace('/','-', $a1['fechainicio']);
                    $sa2 = str_replace('/','-', $a2['fechainicio']);

                    $v1 = strtotime($sa1 . ' '. $a1['horainicio']);
                    $v2 = strtotime($sa2. ' '. $a2['horainicio']);
                    return ($v1 < $v2) ? -1 : 1;
                });

                foreach ($arrayTareas as $key => $tarea) {
                    $datos[$key]['denominacion'] = self::Mayus($tarea['denelemento']);
                    $datos[$key]['o'] = ($tarea['tiempooptimista'] == 0) ? '0' . ' ' : self::getDiasHorasMinutos($tarea['tiempooptimista']);
                    $datos[$key]['m'] = ($tarea['tiempomedio'] == 0) ? '0' . ' ' : self::getDiasHorasMinutos($tarea['tiempomedio']);
                    $datos[$key]['p'] = ($tarea['tiempopesimista'] == 0) ? '0' . ' ' : self::getDiasHorasMinutos($tarea['tiempopesimista']);
                    $datos[$key]['t'] = (($tarea['tiempooptimista'] + (4 * $tarea['tiempomedio']) + $tarea['tiempopesimista']) > 0) ?
                        self::getDiasHorasMinutos(($tarea['tiempooptimista'] + (4 * $tarea['tiempomedio']) + $tarea['tiempopesimista']) / 6) : ' 0 ';
                    $datos[$key]['fi'] = $tarea['fechainicio'];
                    $datos[$key]['hi'] = $tarea['horainicio'];
//                    $datos[$key]['t'] = (($tarea['tiempooptimista'] + (4*$tarea['tiempomedio']) + $tarea['tiempopesimista']) > 0) ?
//                        self::getDiasHorasMinutos(($tarea['tiempooptimista'] + (4*$tarea['tiempomedio']) + $tarea['tiempopesimista']) / 6) : (($tarea['duracionestimada'] == 0) ? '0' . ' ' : self::getDiasHorasMinutos($tarea['duracionestimada']));
                }
                break;
        }
        $data[0]->tipo = $tipo;
        $data[0]->encabezado = $p['denoreporte'];
        $data[0]->columnas = $columnas;
        if ($p['tiporeporte'] == 7) {
            $data[0]->total_costo_plan = $total_costo_plan;
            $data[0]->total_costo_real = $total_costo_real;
        }
        if ($p['tiporeporte'] == 10) {
            $data[0]->total_costo_normal = $total_costo_normal;
            $data[0]->total_costo_limite = $total_costo_limite;
        }
        if ($p['tiporeporte'] == 12) {
            $data[0]->total_matriz_elasticidad = $total_matriz_elasticidad;
        }
        $data[0]->columnas_agrupadas = $columnas_agrupadas;
        $data[0]->referencias = $referencia;
        $data[0]->datos = $datos;
        $data['informe'] = ($p['informe']) ? $p['informe'] : $p['denoreporte'] . '  ' . $p['denproyecto'];
        $data['denominacion'] = $p['denoreporte'];
        $data['subsistema'] = 'proyecto';
        return $data;
    }

    public function getDatesFromRange($start, $end, $format = 'Y-m-d')
    {
        $array = array();
        $interval = new DateInterval('P1D');

        $realEnd = new DateTime($end);
        $realEnd->add($interval);

        $period = new DatePeriod(new DateTime($start), $interval, $realEnd);

        foreach ($period as $date) {
            $a_fi = explode('-', $date->format($format));
            $fi = $a_fi[2] . '/' . $a_fi[1] . '/' . $a_fi[0];
            $array[] = $fi;
        }

        return $array;
    }

    public function getDiasHorasMinutos_old($equivalenciaMinutos)
    {
        $restoAnos = $equivalenciaMinutos % (525600);
        $equivalenciaAnos = $equivalenciaMinutos / (525600);
        $restoMeses = $restoAnos % (44640);
        $equivalenciaMeses = $restoAnos / (44640);
        $restoDias = $restoMeses % (1440);
        $equivalenciaDias = $restoMeses / (1440);
        $restoHoras = $restoDias % (60);
        $equivalenciaHoras = $restoDias / (60);
        $restoMinutos = $restoDias % (60);
        $str_tn = array(
            'dias' => (intval($equivalenciaDias) != 0) ? intval($equivalenciaDias) : 0,
            'horas' => (intval($equivalenciaHoras) != 0) ? intval($equivalenciaHoras) : 0,
            'minutos' => ($restoMinutos != 0) ? $restoMinutos : 0
        );
        $duaracion = (($str_tn['dias'] + $str_tn['horas'] + $str_tn['minutos']) > 0) ? $str_tn['dias'] . 'D-' . $str_tn['horas'] . 'H-' . $str_tn['minutos'] . 'M' : '';
        return $duaracion;
    }

    public function getDiasHorasMinutos($equivalenciaMinutos)
    {

        $restoDias = $equivalenciaMinutos % (1440);
        $equivalenciaDias = $equivalenciaMinutos / (1440);
        $equivalenciaHoras = $restoDias / (60);
        $restoMinutos = $restoDias % (60);


        if ($equivalenciaMinutos >= 60) {
            if ($equivalenciaDias != 0)
                $tiempo = intval($equivalenciaDias) . ' dias';
            else
                $tiempo = '';
            if ($equivalenciaHoras != 0)
                $tiempo .= ' ' . intval($equivalenciaHoras) . ' horas';
            else
                $tiempo .= '';
            if ($restoMinutos != 0)
                $tiempo .= ' ' . round($restoMinutos) . ' min';
            else
                $tiempo .= '';
        } else {
            $tiempo = round($equivalenciaMinutos) . ' min';
        }

        return $tiempo;
    }

    public function getduracionDias_Horas_Minutos($equivalenciaMinutos)
    {

        $restoDias = $equivalenciaMinutos % (1440);
        $equivalenciaDias = $equivalenciaMinutos / (1440);
        $equivalenciaHoras = $restoDias / (60);
        $restoMinutos = $restoDias % (60);


        if ($equivalenciaMinutos >= 60) {
            if ($equivalenciaDias != 0)
                $tiempoD = intval($equivalenciaDias);
            else
                $tiempoD = 0;
            if ($equivalenciaHoras != 0)
                $tiempoH = intval($equivalenciaHoras);
            else
                $tiempoH = 0;
            if ($restoMinutos != 0)
                $tiempoM = round($restoMinutos);
            else
                $tiempoM = 0;
        } else {
            $tiempoM = round($equivalenciaMinutos);
        }

        return array('dias' => $tiempoD, 'horas' => $tiempoH, 'minutos' => $tiempoM);
    }


    public function getAntecesores($tarea, $arrayTareas, $resultadoPert)
    {
        $cantRelacionA = 0;
        $resul = array();
        foreach (
            $resultadoPert['arrayRelacionesPert'] as $key1 => $relacion
        ) {
            if ($tarea['idelemento'] == $relacion['to']) {
                $task = array_search($relacion['from'], array_column($arrayTareas, 'idelemento'));
                $resul[] = $arrayTareas[$task];
                $cantRelacionA++;
            }
        }
        return $resul;
    }

    public function getSucesores($tarea, $arrayTareas, $resultadoPert)
    {
        $cantRelacionA = 0;
        $resul = array();
        foreach (
            $resultadoPert['arrayRelacionesPert'] as $key1 => $relacion
        ) {
            if ($tarea['idelemento'] == $relacion['from']) {
                $task = array_search($relacion['to'], array_column($arrayTareas, 'idelemento'));
                $resul[] = $arrayTareas[$task];
                $cantRelacionA++;
            }
        }
        return $resul;
    }

    public function getInformacionTiempoAntes($tarea, $arrayTareas, $resultadoPert)
    {
        $antecesores = self::getAntecesores($tarea, $arrayTareas, $resultadoPert);
        $Pi = 0;
        if (count($antecesores) == 0) {
            $Pi = 0;
        } else {
            foreach ($antecesores as $key => $antes) {
                $result_anterior = self::getInformacionTiempoAntes($antes, $arrayTareas, $resultadoPert);
                if ($Pi < $result_anterior['Ui'])
                    $Pi = $result_anterior['Ui'];
            }
        }
        $Ui = $Pi + $tarea['duracionestimada'];
        $respuesta = array(
            'Ui' => $Ui,
            'Pi' => $Pi,
        );
        return $respuesta;
    }

    public function getInformacionTiempoDespues($tarea, $arrayTareas, $resultadoPert)
    {
        $sucesores = self::getSucesores($tarea, $arrayTareas, $resultadoPert);
        $valores_sucesores = array();
        if (count($sucesores) == 0) {
            $informacion_tiempo_antes = self::getInformacionTiempoAntes($tarea, $arrayTareas, $resultadoPert);
            $valores_sucesores [] = $informacion_tiempo_antes['Ui'];
        } else {
            foreach ($sucesores as $key => $despues) {
                $result_despues = self::getInformacionTiempoDespues($despues, $arrayTareas, $resultadoPert);
                $valores_sucesores [] = $result_despues['Pj'];
            }
        }
        $Uj = min($valores_sucesores);
        $Pj = $Uj - $tarea['duracionestimada'];
        $respuesta = array(
            'Uj' => $Uj,
            'Pj' => $Pj,
        );
        return $respuesta;
    }

    public function redondear_decimal($valor, $cantidad)
    {
        $float_redondeado = round($valor * $cantidad) / $cantidad;
        return $float_redondeado;
    }

    public function MostrarDuracionPlan($equivalenciaMinutos)
    {

        $restoAnos = $equivalenciaMinutos % (525600);
        $equivalenciaAnos = $equivalenciaMinutos / (525600);
        $restoMeses = $restoAnos % (44640);
        $equivalenciaMeses = $restoAnos / (44640);
        $restoDias = $restoMeses % (1440);
        $equivalenciaDias = $restoMeses / (1440);
        $restoHoras = $restoDias % (60);
        $equivalenciaHoras = $restoDias / (60);
        $restoMinutos = $restoDias % (60);
        $duracionPlanTotal = intval($equivalenciaAnos) . ' aÃ±os - ' . intval($equivalenciaMeses) . ' meses - ' . intval($equivalenciaDias) . ' dias - ' . intval($equivalenciaHoras) . ' horas - ' . intval($restoMinutos) . ' minutos';
        $equivalencia->equivalenciaAnos = (intval($equivalenciaAnos) != 0) ? intval($equivalenciaAnos) : 0;
        $equivalencia->equivalenciaMeses = (intval($equivalenciaMeses) != 0) ? intval($equivalenciaMeses) : 0;
        $equivalencia->equivalenciaDias = (intval($equivalenciaDias) != 0) ? intval($equivalenciaDias) : 0;
        $equivalencia->equivalenciaHoras = (intval($equivalenciaHoras) != 0) ? intval($equivalenciaHoras) : 0;
        $equivalencia->restoMinutos = (intval($restoMinutos) != 0) ? intval($restoMinutos) : 0;

        return array('duracionPlanTotal' => $duracionPlanTotal, 'equivalencia' => $equivalencia);
    }

    public function cargarMatrizTiempos($p)
    {
        $arrayTareas = array();
        $arrayIdTareas = array();
        $filas = Array();
        $columnas = Array();
        $datos = Array();
        $objelemmodel = new CmpgestionarelementoModel();
        self::getTareasProyecto($p->idproyecto, $arrayTareas);
        foreach ($arrayTareas as $key => $tarea) {
            $realminutos = self::calcularDuracionRealPorTarea($tarea);
            $minutos = $tarea['duracionestimada'];
            $tiempodesglosado = self::toHours($minutos, '');
            $tiempodesglosadoreal = self::toHours($realminutos, '');
            $plan = $tiempodesglosado['dias'] . ' dias ' . $tiempodesglosado['horas'] . ' horas ' . $tiempodesglosado['minutos'] . ' min ';
            $real = $tiempodesglosadoreal['dias'] . ' dias ' . $tiempodesglosadoreal['horas'] . ' horas ' . $tiempodesglosadoreal['minutos'] . ' min ';
            $estadocumplimiento
                = $objelemmodel->actualizarEstadoCumplimiento(
                $estadocumplimiento, $tarea['gradocumplimiento']
            );
            $estado = '';

            if (($estadocumplimiento == 'Cumplida' || $estadocumplimiento == 'Sobrecumplida') && ($realminutos < $minutos || $realminutos == $minutos)) {
                $estado = 'ejecutadas';
            } else if (($estadocumplimiento == 'Parcialmente cumplido') && ($realminutos < $minutos || $realminutos == $minutos)) {
                $estado = 'ejecucion';
            } else if (self::esAtrasada($tarea)) {
                $estado = 'atrasada';
            }
            //...llenar array filas...
            $filas[$key] = array(
                "denominacion" => self::Mayus($tarea['denelemento']),
                "estado" => $estado,
                'fechaini' => $tarea['fechainicio'] . ' ' . $tarea['horainicio']
            );
            //...llenar array $datos...
            $involucradosTarea = DatProyecto::getInvolMatriz($tarea['idelemento']);
            foreach ($involucradosTarea as $invol) {
                $denoInvol = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                    $invol['idusuario'], 'usuario', null
                );

                $datos[] = array(
                    "column" => $denoInvol,
                    "row" => self::Mayus($tarea['denelemento']),
                    "value" => "$plan / $real",
                    'hibrida' => true
                );
            }
            $arrayIdTareas[$key] = $tarea['idelemento'];
        }
        //...llenar array $columnas...
        $arrayIdTareas = implode(',', $arrayIdTareas);
        $involucrados = DatProyecto::getInvolMatriz($arrayIdTareas);
        foreach ($involucrados as $key => $invol) {
            $denoInvol = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                $invol['idusuario'], 'usuario', null
            );
            $columnas[$key] = array(
                "denominacion" => $denoInvol
            );
        }
        //... Conformar OBJETO MATRIZ...
        $objMatriz = new stdClass();
        $objMatriz->idproyectoplanificacion = $p->idproyecto;
        $objMatriz->denominacionproyecto = $p->denproyecto;
        $objMatriz->columnas = $columnas;
        $objMatriz->filas = $filas;
        $objMatriz->datos = $datos;
        return $objMatriz;
    }

    public function obtenerDatosPert($p, &$arrayResultanteAlgoritmoPert)
    {
        $parametros->elemento->idelemento = ($p->idproyecto) ? $p->idproyecto : $p['idproyecto'];
        $parametros->elemento->denproyecto = ($p->denproyecto) ? $p->denproyecto : $p['denproyecto'];
        $parametros->elemento->tipoelemento = 8;
        $parametros->idTipoElemento = 0;
        $parametros->idusuario = $datos->idusuariosession;
        $parametros->dependenciaTotal = 1;
        $objDiagramaPert = new CmpDiagramaPertModel();
        $arrayResultanteAlgoritmoPert = $objDiagramaPert->ObtenerActividadesPert($parametros);
    }

    public function cargarMatrizRecurso($parametros)
    {
        $arrayTareas = array();
        $arrayIdTareas = array();
        $filas = Array();
        $columnas = Array();
        $datos = Array();
        $totalrecursos = 0;
        self::getTareasProyecto($parametros->idproyecto, $arrayTareas);
        foreach ($arrayTareas as $key => $tarea) {
            //...llenar array filas...
            $recursos = DatProyecto::getRecursoTarea($tarea['idelemento']);
            $denoRecursos = Array();
            $valor = 0;
            $valor1 = 0;
            $totalrecursostarea = 0;
            foreach ($recursos as $recurso) {
                $cant = round($recurso['cantidad'], 3);
                $denoRecursos[] = $cant . ' '
                    . ' de ' . $recurso['denominacion'];
                $valor += $recurso['valor'];
                $valor1 += $recurso['valor1'];
                $totalrecursos += $cant;
                $totalrecursostarea += $cant;
            }
            $denoRecursos = implode(', ', $denoRecursos);
//...llenar array $datos...
            $involucradosTarea = DatProyecto::getInvolMatriz(
                $tarea['idelemento']
            );
            foreach ($involucradosTarea as $invol) {
                $denoInvol = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                    $invol['idusuario'], 'usuario', null
                );
                $datos[] = array(
                    "column" => $denoInvol,
                    "row" => self::Mayus($tarea['denelemento']),
                    "value" => "X"
                );
            }
            $filas[$key] = array(
                "denominacion" => self::Mayus($tarea['denelemento']),
                //erio
                "presupuesto" => 0,
                "recursos" => $denoRecursos,
                "totalrecursos" => $totalrecursostarea,
                "valor" => $valor,
                //falta agregarle la tarifa horaria d los involucrados
                "valor1" => $valor1
            );
            $arrayIdTareas[$key] = $tarea['idelemento'];
        }
//...llenar array $columnas...
        if (isset($arrayIdTareas[0])) {
            $arrayIdTareas = implode(',', $arrayIdTareas);
            $involucrados = DatProyecto::getInvolMatriz($arrayIdTareas);
            foreach ($involucrados as $key => $invol) {
                $denoInvol = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                    $invol['idusuario'], 'usuario', null
                );
                $columnas[$key] = array(
                    "denominacion" => $denoInvol
                );
            }
        }

//... Conformar OBJETO MATRIZ...
        $objMatriz = new stdClass();
        $objMatriz->idproyectoplanificacion = $parametros->idproyecto;
        $objMatriz->denominacionproyecto = $parametros->denproyecto;
        $objMatriz->columnas = $columnas;
        $objMatriz->filas = $filas;
        $objMatriz->datos = $datos;
        $objMatriz->totalrecursos = $totalrecursos;
//print_r($objMatriz);
        return $objMatriz;
    }

    public function getProyectoPadre($id, &$proyecto)
    {
        $padres = DatProyecto::getPadresInmediatos($id);
        foreach ($padres as $padre) {
            if ($padre['idtipoelemento'] == 8) {
                array_push($proyecto, $padre);
            }
            self::getProyectoPadre($padre['idelemento'], $proyecto);
        }
        return $proyecto;
    }

    public function getTareasProyecto($idproyecto, & $arrayTareas)
    {
        $hijos = DatProyecto::getHijosInmediatos($idproyecto);
        foreach ($hijos as $hijo) {
            if ($hijo['idtipoelemento'] == 10) {
                $temp = DatProyecto::getDatosTarea($hijo['idelemento']);
                $hijo['duracionestimada'] = $temp[0]['duracionestimada'];
                $hijo['idelemento'] = $temp[0]['idelemento'];
                $hijo['fechainicio'] = $temp[0]['fechainicio'];
                $hijo['fechafin'] = $temp[0]['fechafin'];
                $hijo['horainicio'] = $temp[0]['horainicio'];
                $hijo['horafin'] = $temp[0]['horafin'];
                $hijo['gradocumplimiento'] = $temp[0]['gradocumplimiento'];
                $hijo['unidadmedida'] = $temp[0]['unidadmedida'];
                $hijo['valorreal'] = $temp[0]['valorreal'];
                $hijo['valormeta'] = $temp[0]['valormeta'];
                $hijo['costo'] = $temp[0]['costo'];
                $hijo['duracionestimada'] = $temp[0]['duracionestimada'];
                $hijo['tiempooptimista'] = $temp[0]['tiempooptimista'];
                $hijo['tiempomedio'] = $temp[0]['tiempomedio'];
                $hijo['tiempopesimista'] = $temp[0]['tiempopesimista'];
                $hijo['actualizar'] = 0;
                array_push($arrayTareas, $hijo);
            }
            self::getTareasProyecto($hijo['idelemento'], $arrayTareas);
        }
        return $arrayTareas;
    }

    public function ordenarPorCampo($entrada, $campo)
    {
        if (count($entrada) > 0) {
            for ($i = 0; $i < count($entrada); $i++) {
                for ($j = 0; $j < count($entrada); $j++) {
                    $array_date1=explode('/', $entrada[$i]['fechainicio']);
                    $array_date2=explode('/', $entrada[$j]['fechainicio']);
                    $str_date1=$array_date1[2].'-'.$array_date1[1].'-'.$array_date1[0];
                    $str_date2=$array_date2[2].'-'.$array_date2[1].'-'.$array_date2[0];
                    $date1 = strtotime($str_date1);
                    $date2 = strtotime($str_date2);
                    $diff = abs($date2 - $date1);
                    if ($diff > 0) {
                        $aux = $entrada[$i];
                        $entrada[$i] = $entrada[$j];
                        $entrada[$j] = $aux;
                    }
                }
            }
        }
        return $entrada;
    }

    public function getTareasProyectoComprimir($parametros, $ordenar)
    {
        $idproyecto = $parametros['idproyecto'];
        $escala_tiempo = $parametros['escala_tiempo'];
        $resultado = array();
        $arrayTareas = array();
        $arrayResultanteAlgoritmoPert = array();
        self::getTareasProyecto($idproyecto, $arrayTareas);
        self::obtenerDatosPert($parametros, $arrayResultanteAlgoritmoPert);
        $COMP_PROY = 0;
        foreach ($arrayTareas as $key => $tarea) {
            // Criticas
            $critica = false;
            foreach (
                $arrayResultanteAlgoritmoPert['arrayActividadesPert'] as $key1 => $relacion
            ) {
                if ($tarea['idelemento'] == $relacion['key']) {
                    $critica = $relacion['critical'];
                    break;
                }
            }

            //Antecedentes.
            $antecedentes = '';
            $cantRelacionA = 0;
            foreach (
                $arrayResultanteAlgoritmoPert['arrayRelacionesPert'] as $key1 => $relacion
            ) {
                if ($tarea['idelemento'] == $relacion['to']) {
                    $task = array_search($relacion['from'], array_column($arrayTareas, 'idelemento'));
                    if ($cantRelacionA >= 1) {
                        $antecedentes .= " , </br>" . $arrayTareas[$task]['denelemento'];
                        $cantRelacionA++;
                    } else {
                        $antecedentes .= $arrayTareas[$task]['denelemento'];
                        $cantRelacionA++;
                    }
                }
            }

            if ($escala_tiempo == '1') {
                $valor_tiempo = ' horas';
            } else if ($escala_tiempo == '2') {
                $valor_tiempo = ' días';
            } else {
                $valor_tiempo = ' minutos';
            }


            $antecedentes = ($antecedentes !== '') ? $antecedentes : '-';

            $array_tiempo = self::escalasTiempos($escala_tiempo, $tarea);

            $duracionestimada = $array_tiempo['duracionestimada'];
            $tiempooptimista = $array_tiempo['tiempooptimista'];

            $TN = $duracionestimada;
            $TL = $tiempooptimista;
            $CN = ($tarea['costo'] * $tarea['valormeta'] > 0) ? $tarea['costo'] * $tarea['valormeta'] : $tarea['costo'];
            $CL = ((($CN * $TL) / $TN) + $CN) * 0.85;

            $COMP_PROY += ($TN - $TL);

            $resultado[$key]['id'] = $tarea['idelemento'];
            $resultado[$key]['clave'] = '-';
            $resultado[$key]['critica'] = $critica;
            $resultado[$key]['duracionestimada'] = $duracionestimada;
            $resultado[$key]['tiempooptimista'] = $tiempooptimista;
            $resultado[$key]['costo'] = $tarea['costo'];
            $resultado[$key]['valormeta'] = $tarea['valormeta'];
            $resultado[$key]['actividad'] = self::Mayus($tarea['denelemento']);
            $resultado[$key]['precedencia'] = $antecedentes;
            $resultado[$key]['tiempo_normal'] = ($TN > 0) ? self::getDiasHorasMinutos($tarea['duracionestimada']) : 0;
            $resultado[$key]['tiempo_optimo'] = ($TL > 0) ? self::getDiasHorasMinutos($tarea['tiempooptimista']) : 0;
            $resultado[$key]['costo_normal'] = self::redondear_decimal($CN, 10000);
            $resultado[$key]['costo_limite'] = self::redondear_decimal($CL, 10000);
            $resultado[$key]['compresion'] = (($TN - $TL) > 0) ? ($TN - $TL) . $valor_tiempo : 0;
            $resultado[$key]['varianza_costo'] = self::redondear_decimal($CL - $CN, 100);
            $resultado[$key]['pendiente'] = self::redondear_decimal((($TN - $TL) > 0) ?
                ($CL - $CN) / ($TN - $TL) : 0, 10000);
        }
        $resultado[0]['COMP_PROY'] = $COMP_PROY;
        if ($ordenar == 1)
            $resultado = self::ordenarPendiente($resultado);


        return $resultado;
    }

    public function escalasTiempos($escala_tiempo, $tarea)
    {
        $duracionestimada = $tarea['duracionestimada'];
        $tiempooptimista = $tarea['tiempooptimista'];
        switch ($escala_tiempo) {
            case '0':
                $duracionestimada = $tarea['duracionestimada'];
                $tiempooptimista = $tarea['tiempooptimista'];
                break;
            case '1':
                $duracionestimada = $tarea['duracionestimada'] / (60);
                $tiempooptimista = $tarea['tiempooptimista'] / (60);
                break;
            case '2':
                $duracionestimada = $tarea['duracionestimada'] / (1440);
                $tiempooptimista = $tarea['tiempooptimista'] / (1440);
                break;
            default:
                {
                    $duracionestimada = $tarea['duracionestimada'] / 60;
                    $tiempooptimista = $tarea['tiempooptimista'] / 60;
                }
        }

        return array('duracionestimada' => $duracionestimada,
            'tiempooptimista' => $tiempooptimista);
    }

    public function ordenarPendiente($entrada)
    {
        if (count($entrada) > 0) {
            for ($i = 0; $i < count($entrada); $i++) {
                for ($j = 0; $j < count($entrada); $j++) {
                    if ($entrada[$i]['pendiente'] < $entrada[$j]['pendiente']) {
                        $aux = $entrada[$i];
                        $entrada[$i] = $entrada[$j];
                        $entrada[$j] = $aux;
                    }
                }
            }
        }
        return $entrada;
    }

    public function getVerDatosGeneralesProyectoComprimir($parametros, $ordenar)
    {
        $arrayTareas = self::getTareasProyectoComprimir($parametros, $ordenar);
        $idproyecto = $parametros['idproyecto'];
        $escala_tiempo = $parametros['escala_tiempo'];
//        $arrayTareas = $parametros['elementosdatosgeneralesproyecto'];
//        print_r($arrayTareas[0]['id']);die;
        $resultado = '<style> .old_ie_wrapper { background:#ffffff; height: 400px; overflow-y: scroll;}
                       </style>
                    <TABLE class="table" style="margin-top: 0px;
                                margin-bottom: 0px;
                                margin-right: 0px;
                                margin-left: 0px; width:100%"  BORDER="2">
								    <TR><TH style="background:#C0C0C0; width:100px; max-width: 100px; font-size: 10px; font-weight: bold;" align="center">Actividad</TH>
										<TH style="background:#C0C0C0; width:100px; max-width: 100px; font-size: 10px; font-weight: bold;" align="center">Costo Directo</TH>
										<TH style="background:#C0C0C0; width:100px; max-width: 100px; font-size: 10px; font-weight: bold;" align="center">Costo Indirecto (' . $parametros['valor_costo_directo'] . ')' . '</TH>
										<TH style="background:#C0C0C0; width:100px; max-width: 100px; font-size: 10px; font-weight: bold;" align="center">Costo Total</TH>
										<TH style="background:#C0C0C0; width:115px; max-width: 115px; font-size: 10px; font-weight: bold;" align="center">Plazo Total</TH></TR></TABLE>';

//        $arrayResultanteAlgoritmoPert = array();
//        self::getTareasProyecto($idproyecto, $arrayTareas);
//        self::obtenerDatosPert($parametros, $arrayResultanteAlgoritmoPert);
        $info_actividades = '';
        $CDP = 0;
        $PTP = 0;

        if ($escala_tiempo == '1') {
            $tiempo_plazo_toal = $parametros['duracionestimada'] / (60);
        } else if ($escala_tiempo == '2') {
            $tiempo_plazo_toal = $parametros['duracionestimada'] / (1440);
        } else {
            $tiempo_plazo_toal = $parametros['duracionestimada'];
        }
        foreach ($arrayTareas as $key => $tarea) {
            $array_tiempo = self::escalasTiempos($escala_tiempo, $tarea);

            $duracionestimada = $array_tiempo['duracionestimada'];
            $tiempooptimista = $array_tiempo['tiempooptimista'];

            $TN = $duracionestimada;
            $TL = $tiempooptimista;
            $CN = ($tarea['costo'] * $tarea['valormeta'] > 0) ? $tarea['costo'] * $tarea['valormeta'] : $tarea['costo'];
            $CL = ((($CN * $TL) / $TN) + $CN) * 0.85;
            $COMP = $duracionestimada - $tiempooptimista;
            $PEND = ($duracionestimada - $tiempooptimista > 0) ?
                ($CL - $CN) / ($duracionestimada - $tiempooptimista) : 0;
            $CD = ($COMP * $PEND) + $CN;
            $PT = $tiempo_plazo_toal - $COMP;
            $tiempo_plazo_toal = $PT;
            $CIND = $PT * $parametros['valor_costo_directo'];
            $CT = $CD + $CIND;

            /*             * *
              Valor del proyecto
             * */

            $CDP += $CN;


            $str_PT = ($PT > 0) ? self::getDiasHorasMinutos($PT) : 0;
            $color_fondo = "#ffffff";
            if ($tarea['critica'] === true) {
                $color_fondo = "#FF9F9F";
                $PTP += $TN;
            }

            $info_actividades .= '<TH style="background:' . $color_fondo . '; max-width: 100px; width:100px; font-size: 10px;" align="center">' . self::Mayus($tarea['actividad']) . '</TH>
                              <TH style="background:' . $color_fondo . '; max-width: 100px; width:100px; font-size: 10px;" align="center">' . self::redondear_decimal($CD, 10000) . '</TH>
									            <TH style="background:' . $color_fondo . '; max-width: 100px; width:100px; font-size: 10px;" align="center">' . self::redondear_decimal($CIND, 10000) . '</TH>
									            <TH style="background:' . $color_fondo . '; max-width: 100px; width:100px; font-size: 10px;" align="center">' . self::redondear_decimal($CT, 10000) . '</TH>
									            <TH style="background:' . $color_fondo . '; max-width: 100px; width:100px; font-size: 10px;" align="center">' . $str_PT . '</TH></TR>';
        }

        $CIP = $PTP * $parametros['valor_costo_directo'];
        $CTP = $CDP + $CIP;

        $str_PTP = ($PTP > 0) ? self::getDiasHorasMinutos($PTP) : 0;

        $info_proyecto = '<div class="old_ie_wrapper"><TR><TABLE class="table" 
                            style="margin-top: 0px;
                                margin-bottom: 0px;
                                margin-right: 0px;
                                margin-left: 0px; width:100%"
                          BORDER="2" >
                          <TR>
                          <TH style="background:#bdd899; width:100px; max-width: 100px; font-size: 10px;" align="center">' . self::Mayus($parametros['denproyecto']) . '</TH>
                            <TH style="background:#bdd899; width:100px; max-width: 100px; font-size: 10px;" align="center">' . self::redondear_decimal($CDP, 10000) . '</TH>
                            <TH style="background:#bdd899; width:100px; max-width: 100px; font-size: 10px;" align="center">' . self::redondear_decimal($CIP, 10000) . '</TH>
                            <TH style="background:#bdd899; width:100px; max-width: 100px; font-size: 10px;" align="center">' . self::redondear_decimal($CTP, 10000) . '</TH>
                            <TH style="background:#bdd899; width:100px; max-width: 100px; font-size: 10px;" align="center">' . $str_PTP . '</TH></TR>';

        $resultado .= $info_proyecto . $info_actividades . '</TABLE></div>';
        return $resultado;
    }

    public function getTareasProyectoCumplidaFueraTiempo($idproyecto, & $arrayTareas)
    {
        $hijos = DatProyecto::getHijosInmediatos($idproyecto);
        foreach ($hijos as $hijo) {
            if ($hijo['idtipoelemento'] == 10) {
                $temp = DatProyecto::getDatosTareaCumplidasFueraRango($hijo['idelemento']);
                if (count($temp) > 0) {
                    $hijo['duracionestimada'] = $temp[0]['duracionestimada'];
                    $hijo['fechainicio'] = $temp[0]['fechainicio'];
                    $hijo['fechafin'] = $temp[0]['fechafin'];
                    $hijo['horainicio'] = $temp[0]['horainicio'];
                    $hijo['horafin'] = $temp[0]['horafin'];
                    $hijo['gradocumplimiento'] = $temp[0]['gradocumplimiento'];
                    $hijo['unidadmedida'] = $temp[0]['unidadmedida'];
                    $hijo['valorreal'] = $temp[0]['valorreal'];
                    $hijo['valormeta'] = $temp[0]['valormeta'];
                    $hijo['fh_i'] = $temp[0]['fh_i'];
                    $hijo['fh_f'] = $temp[0]['fh_f'];
                    $hijo['fh_c'] = $temp[0]['fh_c'];
                    $hijo['costo'] = $temp[0]['costo'];
                    $hijo['actualizar'] = 0;
                    array_push($arrayTareas, $hijo);
                }
            }
            self::getTareasProyectoCumplidaFueraTiempo($hijo['idelemento'], $arrayTareas);
        }
        return $arrayTareas;
    }

    public function getTareas($idproyecto, & $arrayTareas)
    {
        $hijos = DatProyecto::getHijosInmediatosEjercicio($idproyecto);
        foreach ($hijos as $hijo) {
            if ($hijo['tipo'] == 10) {
                $temp = DatProyecto::getDatosTareaEjercicio($hijo['idelemento']);
                if ($temp[0]['hoja'] != 0)
                    $hijo['hoja'] = 'false';
                else
                    $hijo['hoja'] = 'true';
                $hijo['fechafin'] = $temp[0]['fechafin'];
                $hijo['fechainicio'] = $temp[0]['fechainicio'];
                $hijo['horainicio'] = $temp[0]['horainicio'];
                $hijo['horafin'] = $temp[0]['horafin'];
                array_push($arrayTareas, $hijo);
            }
            self::getTareas($hijo['idelemento'], $arrayTareas);
        }
        return $arrayTareas;
    }

    public function getIdUsuarios($arrayInvol)
    {
        $result = array();
        if (isset($arrayInvol[0])) {
            foreach ($arrayInvol as $value => $key) {
                array_push($result, $key->idusuario);
            }
        }
        return $result;
    }

    public function obtenerTareasParaChequear($parametros)
    {

        $objDatProyecto = new DatProyecto();
        $arrayTareas = $objDatProyecto->obtenerTareasParaChequear($parametros);


        if (isset($arrayTareas['resultado'])) {

            foreach ($arrayTareas['resultado'] as $key => $tarea) {

                $arrayTareasAEjecutar['resultado'][$key]['fechainicio'] = $tarea['fechainicio'];
                $arrayTareasAEjecutar['resultado'][$key]['horainicio'] = $tarea['horainicio'];
                $arrayTareasAEjecutar['resultado'][$key]['fechafin'] = $tarea['fechafin'];
                $arrayTareasAEjecutar['resultado'][$key]['horafin'] = $tarea['horafin'];
                $arrayTareasAEjecutar['resultado'][$key]['tiempoestimado'] = $tarea['duracionestimada'];
                $arrayTareasAEjecutar['resultado'][$key]['gradocumplimiento'] = $tarea['gradocumplimiento'];

                $denominacion = str_ireplace('"', ' % ', $tarea['denelemento']);
                $arrayTareasAEjecutar['resultado'][$key]['nombreautor'] = $this->integrator->seguridad->nombreUsuario(
                    $tarea['idusuariocrea']
                );
                $arrayTareasAEjecutar['resultado'][$key]['idelemento'] = $tarea['idelemento'];
                $arrayTareasAEjecutar['resultado'][$key]['idautor'] = $tarea['idusuariocrea'];
                $arrayTareasAEjecutar['resultado'][$key]['denominacion'] = $denominacion;
                $arrayTareasAEjecutar['resultado'][$key]['gradocumplimiento'] = $tarea['gradocumplimiento'];
                $arrayTareasAEjecutar['resultado'][$key]['tipoelemento'] = $tarea['idtipoelemento'];
                $arrayTareasAEjecutar['resultado'][$key]['textocumplimiento'] = $tarea['estadocumplimiento'];
                $arrayTareasAEjecutar['resultado'][$key]['estadocumplimiento'] = $tarea['estadocumplimiento'] . "("
                    . $tarea ['gradocumplimiento'] . "%)";
            }
        }
        $arrayTareasAEjecutar['total'] = $arrayTareas['total'];
//print_r($arrayTareasAEjecutar);die;
        return $arrayTareasAEjecutar;
    }

    public function toHours($min)
    {
        //obtener segundos
        $sec = $min * 60;
        //dias es la division de n segs entre 86400 segundos que representa un dia
        $dias = floor($sec / 86400);
        //mod_hora es el sobrante, en horas, de la division de dias;
        $mod_hora = $sec % 86400;
        //hora es la division entre el sobrante de horas y 3600 segundos que representa una hora;
        $horas = floor($mod_hora / 3600);
        //mod_minuto es el sobrante, en minutos, de la division de horas;
        $mod_minuto = $mod_hora % 3600;
        //minuto es la division entre el sobrante y 60 segundos que representa un minuto;
        $minutos = floor($mod_minuto / 60);

        $text['dias'] = ($dias < 0) ? 0 : $dias;
        $text['horas'] = ($horas < 0) ? 0 : $horas;
        $text['minutos'] = $minutos;

        return $text;
    }

    public function verificarFondoTiempo($parametros)
    {
        $fechainicio = $parametros->fechainicio;
        $anno = explode(' / ', $fechainicio);
        $involucrados = array();
        $arrayInvol = $parametros->arrayinvolucrados;
        foreach ($arrayInvol as $involucrado) {
            if ($involucrado->tipo == 1) {
                $involucrados[] = $involucrado->idusuario;
            }
        }
        $arrayInvol = $this->pIntegrator->configuracionpdo->getFechaFin(
            $involucrados, $fechainicio, $parametros->duracionR, $anno[2]
        );
        if (isset($arrayInvol[0])) {
            foreach ($arrayInvol as $value => $key) {
                $fechaUser = strtotime(
                    str_replace(' / ', ' - ', $key['fechafin'])
                );
                $fechaAct = strtotime(
                    str_replace(' / ', ' - ', $parametros->fechafin)
                );
                if ($fechaUser <= $fechaAct) {
                    unset($arrayInvol[$value]);
                }
            }
            if (isset($arrayInvol[0])) {
                $result['involucrados'] = $arrayInvol;
                return $result;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public function obtenerPlanesParaFiltro($parametros)
    {

        $objDatProyecto = new DatProyecto();

        $arrayElementos = $objDatProyecto->obtenerPlanesParaFiltro($parametros);
        return $arrayElementos;
    }

    public function obtenerHitosParaFiltro($parametros) {

        $objDatProyecto = new DatProyecto();

        $arrayElementos = $objDatProyecto->obtenerHitosParaFiltro($parametros);
        return $arrayElementos;
    }

    public function involucrarUsuarios($parametros)
    {

        if ($parametros->involucrarelementoshijos != 0) {

            $objDatProyecto = new DatProyecto();
            foreach ($parametros->arrayelementosseleccionados as $elemento) {
                $arrayElementos = [];
                $this->pIntegrator->planpdo->insertarInvolucradosTarea($parametros->arrayinvolucrados, $elemento->id, $elemento->tipo);

                $arrayElementos = $objDatProyecto->obtenerHitosTareasDadoProyecto($elemento->id);
                if (isset($arrayElementos[0])) {
                    foreach ($arrayElementos as $elementoAinvolucrar) {
                        $this->pIntegrator->planpdo->insertarInvolucradosTarea($parametros->arrayinvolucrados, $elementoAinvolucrar['idelemento'], $elementoAinvolucrar['idtipoelemento']);
                    }
                }
            }
        } else {
            foreach ($parametros->arrayelementosseleccionados as $elemento) {
                $this->pIntegrator->planpdo->insertarInvolucradosTarea($parametros->arrayinvolucrados, $elemento->id, $elemento->tipo);
            }
        }

        return 1;
    }

    public function reorganizarElemento($parametros)
    {
        $result = 0;
        $objDatProyecto = new DatProyecto();

        foreach ($parametros->arrayidelementopegar as $elemento) {
            $result = $objDatProyecto->EliminarElemenElemen($elemento);
            if ($result == 1) {
                $elemento->idpadre = $parametros->idpadre;
                $elemento->tipopadre = $parametros->tipopadre;
                $elemento->idautorpadre = $parametros->idautorpadre;
                $objDatProyecto->adicionarElemenElemen($elemento);
            }
        }
        return 1;
    }

    public function obtenerTareasDadoProyecto($parametros)
    {

        $objDatProyecto = new DatProyecto();

        $arrayTareas = $objDatProyecto->obtenerTareasDadoProyecto($parametros);
        return $arrayTareas;
    }

    public function realPorFechaEjecutado($parametros)
    {

        $objDatProyecto = new DatProyecto();

        $arrayEjecutados = $objDatProyecto->realPorFechaEjecutado($parametros);
        return $arrayEjecutados;
    }

    public function guardarEjecutados($parametros)
    {

        $objDatProyecto = new DatProyecto();

        if (isset($parametros->arrayEjecutadosEliminados[0])) {
            foreach ($parametros->arrayEjecutadosEliminados as $ejecutadoEliminado) {
                $ejecutado = $objDatProyecto->existeEjecutado($ejecutadoEliminado);
                if (isset($ejecutado[0])) {
                    $objDatProyecto->eliminarEjecutado($ejecutadoEliminado);
                }
            }
        }
        if (isset($parametros->arrayEjecutadosAdicionados[0])) {
            foreach ($parametros->arrayEjecutadosAdicionados as $ejecutadoAdicionado) {
                $ejecutado = $objDatProyecto->existeEjecutado($ejecutadoAdicionado);
                if (isset($ejecutado[0])) {
                    $objDatProyecto->actualizarEjecutado($ejecutadoAdicionado);
                } else {
                    $objDatProyecto->adicionarEjecutado($ejecutadoAdicionado);
                }
            }
        }

        /* if (isset($parametros->arrayEjecutadosEliminados[0])) {
          foreach ($parametros->arrayEjecutadosEliminados as $ejecutadoEliminado) {
          $existeEjecutado = Doctrine::getTable('DatControlejecuciontarea')->findByDql("idtarea = '$ejecutadoEliminado->idtarea'
          AND fecha = '$ejecutadoEliminado->fecha'");
          if ($existeEjecutado[0]->idtarea != null) {
          $existeEjecutado->delete();
          }
          }
          }
          if (isset($parametros->arrayEjecutadosAdicionados[0])) {
          foreach ($parametros->arrayEjecutadosAdicionados as $ejecutadoAdicionado) {
          $existeEjecutado = Doctrine::getTable('DatControlejecuciontarea')->findByDql("idtarea = '$ejecutadoAdicionado->idtarea'
          AND fecha = '$ejecutadoAdicionado->fecha'");
          if ($existeEjecutado[0]->idtarea != null) {
          $existeEjecutado[0]->cantidad = $ejecutadoAdicionado->cantidad;
          $existeEjecutado[0]->save();
          } else {
          $objDatControlEjec = new DatControlejecuciontarea();
          $objDatControlEjec->idtarea = $ejecutadoAdicionado->idtarea;
          $objDatControlEjec->fecha = $ejecutadoAdicionado->fecha;
          $objDatControlEjec->cantidad = $ejecutadoAdicionado->cantidad;
          $objDatControlEjec->save();
          }
          }
          } */

        return 1;
    }

    public function actualizarValorReal($parametros)
    {

        $objDatTarea = Doctrine::getTable('DatTarea')->find($parametros->idtarea);
        if ($objDatTarea->idtarea != null) {
            $objDatTarea->valorreal = $parametros->valorreal;
            $objDatTarea->save();
        }
        return 1;
    }

    public function importarTareas($parametros)
    {
        $ruta = '../models/bussines/ReaderModel.php';
        include_once(dirname(__FILE__) . $ruta);
        $data = new ReaderModel();
        $data->setOutputEncoding('CP1251');
        $data->read($parametros->file);
        $clientesAux = $data->sheets[0]['cells'];
        $salto = 0;
        $arrayId = array();
        $arrayPadres = array();
        //print_r($clientesAux);die;
        foreach ($clientesAux as $key => $value) {
            //Ignorando los datos del encabezado de la tabla
            if ($salto <= 1) {
                $salto++;
                continue;
            }
            if (!empty($value[0])) {
                $parametros->denelemento = (isset($value[1])) ? utf8_encode($value[1]) : '';
                $parametros->descelemento = '';
                $parametros->idcategoria = null;
                $parametros->idestadocump = '';

                $parametros->fechainicio = (isset($value[15])) ? $value[15] : '';
                $parametros->fechafin = (isset($value[17])) ? $value[17] : '';

                $parametros->horainicio = (isset($value[16])) ? $value[16] : '08:00';
                $parametros->horafin = (isset($value[18])) ? $value[18] : '17:00';

                $params['diasDuracion'] = (isset($value[2])) ? $value[2] : 0;
                $params['horasDuracion'] = (isset($value[3])) ? $value[3] : 0;
                $params['minDuracion'] = (isset($value[4])) ? $value[4] : 0;

                $params['diasTo'] = (isset($value[5])) ? $value[5] : 0;
                $params['horasTo'] = (isset($value[6])) ? $value[6] : 0;
                $params['minTo'] = (isset($value[7])) ? $value[7] : 0;

                $params['diasTm'] = (isset($value[8])) ? $value[8] : 0;
                $params['horasTm'] = (isset($value[9])) ? $value[9] : 0;
                $params['minTm'] = (isset($value[10])) ? $value[10] : 0;

                $params['diasTp'] = (isset($value[11])) ? $value[11] : 0;
                $params['horasTp'] = (isset($value[12])) ? $value[12] : 0;
                $params['minTp'] = (isset($value[13])) ? $value[13] : 0;

                $tiempoestimado = $this->calcularTiempoEstimado($params);

                //$parametros->duracionE = '25.02';
                $parametros->duracionEstimadaDias = $tiempoestimado['diasDuracion'];
                $parametros->duracionEstimadaHoras = $tiempoestimado['horasDuracion'];
                $parametros->duracionEstimadaMinutos = $tiempoestimado['minDuracion'];

                $parametros->tiempooptimista = (isset($tiempoestimado['tiempooptimista'])) ? $tiempoestimado['tiempooptimista'] : 0;
                $parametros->tiempomedio = (isset($tiempoestimado['tiempomedio'])) ? $tiempoestimado['tiempomedio'] : 0;
                $parametros->tiempopesimista = (isset($tiempoestimado['tiempopesimista'])) ? $tiempoestimado['tiempopesimista'] : 0;

                $parametros->duracionR = '0';
                $parametros->peso = '1';
                $parametros->porcientocump = '0';

                $parametros->criterioeval = null;
                $parametros->idtipotarea = null;
                $parametros->lugar = '';
                $parametros->principal = '0';

                /* $parametros->unidadmedida = null;
                  $parametros->valorreal = null;
                  $parametros->valormeta = null; */

                $parametros->idautorpadre = $parametros->idusuariocrea;
                $parametros->evento = 'vacio';
                $parametros->tipopadre = '8';
                $parametros->arrayrepeticiones = Array();

                $parametros->arrayinvolucrados = Array();

                //creo el array de dependencias de la actividad
                $relaciones = Array();
                if (isset($value[14])) {
                    $dep = explode(';', $value[14]);
                    $a = 0;
                    foreach ($arrayId as $key => $id) {
                        foreach ($dep as $rel) {
                            if ($key == $rel) {
                                $relaciones[$a]->idplan = null;
                                $relaciones[$a]->idarc = null;
                                $relaciones[$a]->idobjetivo = null;
                                $relaciones[$a]->idfip = null;
                                $relaciones[$a]->iddesviacion = null;
                                $relaciones[$a]->idactividad = $id;
                                $relaciones[$a]->tipoelemento = 10;
                                $relaciones[$a]->origen = 6;
                                $relaciones[$a]->porcientoinicio = null;
                                $a++;

                                $parametros->arrayelementosrelacionados = $relaciones;
                            }
                        }
                    }
                } else {
                    $parametros->arrayelementosrelacionados = Array();
                }

                $parametros->recursoasociado = Array();
                $parametros->verificartiempoinvol = '0';
                $parametros->idSubsistema = '';

                $modeltarea = new CmpgestionartareaModel();
                $result = $modeltarea->adicionarTarea($parametros);

                $arrayId[$value[0]] = $result;

                //guardo los id de los objetivos
                if (fmod($value[0], 1) === 0.00) {
                    $arrayPadres[$value[0]] = $result;
                }
                $salto++;

            } else return array('cod' => 6);
        }
        return array('cod' => 1);
    }

    public function calcularTiempoEstimado($params)
    {
        try {
            $calculo = 0;
            foreach ($params as $value => $val) {
                $params[$value] = intval($val);
                if ($value != 'diasDuracion' && $value != 'horasDuracion' && $value != 'minDuracion') {
                    if ($params[$value] != 0) $calculo = 1;
                }
            }
            if ($calculo) {
                extract($params);
                $tiempooptimista = ($diasTo * 24) * 60;
                $tiempooptimista = ($horasTo * 60) + $tiempooptimista;
                $tiempooptimista = $minTo + $tiempooptimista;
                $tiempooptimista = round($tiempooptimista);

                $tiempomedio = ($diasTm * 24) * 60;
                $tiempomedio = ($horasTm * 60) + $tiempomedio;
                $tiempomedio = $minTm + $tiempomedio;
                $tiempomedio = round($tiempomedio);

                $tiempopesimista = ($diasTp * 24) * 60;
                $tiempopesimista = ($horasTp * 60) + $tiempopesimista;
                $tiempopesimista = $minTp + $tiempopesimista;
                $tiempopesimista = round($tiempopesimista);

                $tiempoestandar = round((4 * $tiempomedio + $tiempooptimista + $tiempopesimista) / 6);
                $tiempoestandar = $this->getduracionDias_Horas_Minutos($tiempoestandar);

                $params['diasDuracion'] = $tiempoestandar['dias'];
                $params['horasDuracion'] = $tiempoestandar['horas'];
                $params['minDuracion'] = $tiempoestandar['minutos'];
                $params['tiempooptimista'] = $tiempooptimista;
                $params['tiempomedio'] = $tiempomedio;
                $params['tiempopesimista'] = $tiempopesimista;
            }
            return $params;
        } catch (Exception $e) {
            $params['diasDuracion'] = 0;
            $params['horasDuracion'] = 0;
            $params['minDuracion'] = 0;
            return $params;
        }
    }

    //******Integracion con Produccion******
    public function calcularDuracionestimadaPorTarea($fechainicio, $fechafin) {
        $fechaI = explode('/', $fechainicio);
        $datetimeInicio = new DateTime($fechaI[2] . $fechaI[1] . $fechaI[0] . ' ' . '08:00:00');
        $fechaF = explode('/', $fechafin);
        $datetimeFin = new DateTime($fechaF[2] . $fechaF[1] . $fechaF[0] . ' ' . '17:00:00');

        $tiempoInicio = $datetimeInicio->getTimestamp();
        $tiempoFin = $datetimeFin->getTimestamp();
        $tiempoDuracion = $tiempoFin - $tiempoInicio;
        $duracion = $tiempoDuracion / 60;
        return $duracion;
    }

    public function generarProyectoDadaProduccion($arrayProduccion, $arrayEtapasActividades, $idusuario) {

        $parametros->idusuariocrea = $idusuario;
        $result = $this->adicionarProyectoDadaProduccion($parametros, $arrayProduccion, $arrayEtapasActividades);

        return 1;
    }

    public function adicionarProyectoDadaProduccion($parametros, $arrayProduccion, $arrayEtapasActividades) {

        if (!empty($arrayProduccion ['idproduccion'])) {
            $parametros->denelemento = $arrayProduccion['denominacionproduccion'];
            $parametros->idEstructura = $arrayProduccion['identidad'];
            $parametros->idproduccion = $arrayProduccion['idproduccion'];

            $fecha = explode(' ', $arrayProduccion['fechainicio']);
            $parametros->fechainicio = $fecha[0];
            $fecha = explode(' ', $arrayProduccion['fechafin']);
            $parametros->fechafin = $fecha[0];
        }

        $parametros->arrayinvolucrados = [];
        $parametros->arrayinvolucradoseliminar = [];
        $parametros->duracionE = 0;
        $parametros->duracionEstimadaDias = $arrayProduccion['duracionestimada']->days;
        $parametros->duracionEstimadaHoras = 0;
        $parametros->duracionEstimadaMinutos = 0;
        $parametros->duracionR = $arrayProduccion['duracionrealhoras'];
        $parametros->estadoCumpl = 'Sin cumplir';
        $parametros->hedescripcion = '';
        $parametros->identificacion = rand(1, 1000000000);
        $parametros->plantilla = 0;
        $parametros->porcientocump = 0;
        $parametros->verificartiempoinvol = 0;

        $result = $this->adicionarProyecto($parametros);

        $objDatAplicacioncartatecproyecto = new DatAplicacioncartatecproyecto();
        $objDatAplicacioncartatecproyecto->idaplicacioncartatec = $arrayProduccion['idproduccion'];
        $objDatAplicacioncartatecproyecto->idproyecto = $parametros->idElemen;
        $objDatAplicacioncartatecproyecto->save();


        if ($result != 0) {
            $parametros->arrayidhitos = [];
            $this->adicionarHitoConTareasDadaProduccion($parametros, $arrayEtapasActividades);
            //$this->adicionarfechaHitos($parametros->idElemen);
            // $this->modificarFechaProyecto($parametros);
        }
        return $result;
    }

    public function adicionarHitoConTareasDadaProduccion($parametrosPro, $arrayEtapasActividades) {

        $modelHito = new CmpgestionarhitoModel();
        $modelTarea = new CmpgestionartareaModel();
        $cant = count($arrayEtapasActividades);
        for ($i = 0; $i < $cant; $i++) {
            //print_r($parametrosPro->idusuariocrea);die;
            $cantTareas = count($arrayEtapasActividades[$i]['actividades']);
            $parametrosHito->idusuariocrea = $parametrosPro->idusuariocrea;
            $parametrosHito->denelemento = $arrayEtapasActividades[$i]['denominacionetapa'];
            $parametrosHito->idestadocump = 'Sin cumplir';
            $parametrosHito->idEstructura = $parametrosPro->idEstructura;
            $fechaini = explode(' ', $arrayEtapasActividades[$i]['fechainicioetapa']);
            $parametrosHito->fechainicio = $fechaini[0];
            $fechafin = explode(' ', $arrayEtapasActividades[$i]['fechafinetapa']);
            $parametrosHito->fechafin = $fechafin[0];
            $parametrosHito->duracionE = 0;
            $parametrosHito->duracionEstimadaDias = self::diffDias($arrayEtapasActividades[$i]['fechainicioetapa'], $arrayEtapasActividades[$i]['fechafinetapa']);
            $parametrosHito->duracionEstimadaHoras = 0;
            $parametrosHito->duracionEstimadaMinutos = 0;
            $parametrosHito->duracionR = $arrayEtapasActividades[$i]['duracionrealhoras'];
            $parametrosHito->peso = 1;
            $parametrosHito->porcientocump = 0;
            $parametrosHito->plantilla = 0;
            $parametrosHito->idpadre = $parametrosPro->idElemen;
            $parametrosHito->idautorpadre = $parametrosPro->idusuariocrea;
            $parametrosHito->tipopadre = 8;
            $parametrosHito->arrayinvolucrados = [];
            $parametrosHito->verificartiempoinvol = 0;
            $result = $modelHito->adicionarHito($parametrosHito);
            if ($result == 0) {
                return 0;
            }

            $parametrosPro->arrayidhitos[$i] = $parametrosHito->idElemen;
            $arrayActividades = [];
            $arrayActividades = $arrayEtapasActividades[$i]['actividades'];
            $arrayCollDatActProdCartatecHitoTarea = new Doctrine_Collection(Doctrine:: getTable("DatActividadentidadprodcartatechitotarea"));
            for ($j = 0; $j < $cantTareas; $j++) {
                $parametrosTarea = null;
                $parametrosTarea->idusuariocrea = $parametrosPro->idusuariocrea;
                $parametrosTarea->denelemento = $arrayActividades[$j]['denominacionactividad'];
                $fecha = explode(' ', $arrayActividades[$j]['fechainicio']);
                $parametrosTarea->fechainicio = $fecha[0];
                $fecha = explode(' ', $arrayActividades[$j]['fechafin']);
                $parametrosTarea->fechafin = $fecha[0];
                $parametrosTarea->horainicio = '08:00:00';
                $parametrosTarea->horafin = '17:00:00';
                $parametrosTarea->idEstructura = $parametrosPro->idEstructura;
                $parametrosTarea->duracionE = $arrayActividades[$j]['duracion'] * 60; //$this->calcularDuracionestimadaPorTarea($parametrosTarea->fechainicio, $parametrosTarea->fechafin);
                $tiempoDesglosado = self::toHours($parametrosTarea->duracionE, '');
                $parametrosTarea->duracionEstimadaDias = $tiempoDesglosado['dias'];
                $parametrosTarea->duracionEstimadaHoras = $tiempoDesglosado['horas'];
                $parametrosTarea->duracionEstimadaMinutos = $tiempoDesglosado['minutos'];

                if ($parametrosTarea->duracionEstimadaDias) {
                    $parametros->duracionestimada = ($parametrosTarea->duracionEstimadaDias * 24) * 60;
                }
                if ($parametrosTarea->duracionEstimadaHoras) {
                    $parametros->duracionestimada += ($parametrosTarea->duracionEstimadaHoras * 60);
                }
                if ($parametrosTarea->duracionEstimadaMinutos) {
                    $parametros->duracionestimada += $parametrosTarea->duracionEstimadaMinutos;
                }

                $parametrosTarea->duracionR = 0; //$parametros->duracionestimada;
                $parametrosTarea->peso = 1;
                $parametrosTarea->porcientocump = 0;
                $parametrosTarea->principal = 0;
                $parametrosTarea->plantilla = 0;
                $parametrosTarea->idpadre = $parametrosHito->idElemen;
                $parametrosTarea->idautorpadre = $parametrosPro->idusuariocrea;
                $parametrosTarea->evento = 'vacio';
                $parametrosTarea->tipopadre = 9;
                $parametrosTarea->arrayrepeticiones = [];
                $parametrosTarea->arrayinvolucrados = [];
                $parametrosTarea->arrayelementosrelacionados = [];
                $parametrosTarea->recursoasociado = [];
                $parametrosTarea->recursoasociado = $this->obtenerRecursos($arrayActividades[$j]['recursos']); //[];
                //print_r($parametrosTarea->recursoasociado);die;
                $parametrosTarea->verificartiempoinvol = 0;

                $result = $modelTarea->adicionarTarea($parametrosTarea);
                if ($result == 0) {
                    return 0;
                }
                /* $objDatActividadentidadprodcartatechitotarea = new DatActividadentidadprodcartatechitotarea();
                  $objDatActividadentidadprodcartatechitotarea->idactividadentidadprodcartatec = $arrayActividades[$j]['idactividadentidadprodcartatec'];
                  $objDatActividadentidadprodcartatechitotarea->idhito = $parametrosHito->idElemen;
                  $objDatActividadentidadprodcartatechitotarea->idtarea = $parametrosTarea->idElemen;
                  $objDatActividadentidadprodcartatechitotarea->save(); */


                $arrayCollDatActProdCartatecHitoTarea[$j]->idactividadentidadprodcartatec = $arrayActividades[$j]['idactividadentidadprodcartatec'];
                $arrayCollDatActProdCartatecHitoTarea[$j]->idhito = $parametrosHito->idElemen;
                $arrayCollDatActProdCartatecHitoTarea[$j]->idtarea = $parametrosTarea->idElemen;
                //print_r($arrayCollDatActProdCartatecHitoTarea);die;
            }
            $arrayCollDatActProdCartatecHitoTarea->save();
        }
        return 1;
    }

    public function obtenerRecursos($arrayrecursos) {
        $arrayDatosRecursos = [];
        for ($j = 0; $j < count($arrayrecursos); $j++) {
            $param = null;
            $param->idcategoria = $arrayrecursos[$j]['idindicador'];
            $param->cantidad = $arrayrecursos[$j]['cantidad'];
            $param->indicador = 1;
            $arrayDatosRecursos[$j] = $param;
        }
        return $arrayDatosRecursos;
    }

    public function obtenerProyectoDadaProduccion($idproduccion) {
        $arrayidproyecto = null;
        $objDatAplicacionCartatecProyecto = Doctrine::getTable('DatAplicacioncartatecproyecto')->findByDql("idaplicacioncartatec = '$idproduccion'");

        if (!empty($objDatAplicacionCartatecProyecto[0]->idaplicacioncartatecproyecto)) {
            for ($j = 0; $j < count($objDatAplicacionCartatecProyecto); $j++) {
                $elemento->id = $objDatAplicacionCartatecProyecto[$j]->idproyecto;
                $arrayidproyecto[$j] = $elemento;
            }
            $objDatAplicacionCartatecProyecto->delete();
        }
        return $arrayidproyecto;
    }

    function diffDias($fechaInicio, $fechaFin) {
        $fechaInicial = explode('/', explode(' ', $fechaInicio)[0]);
        $fechaFinal = explode('/', explode(' ', $fechaFin)[0]);

        $timestamp1 = mktime(0, 0, 0, $fechaInicial[1], $fechaInicial[0], $fechaInicial[2]);
        $timestamp2 = mktime(0, 0, 0, $fechaFinal[1], $fechaFinal[0], $fechaFinal[2]);

        $segundos_diferencia = $timestamp1 - $timestamp2;
        $dias_diferencia = $segundos_diferencia / (60 * 60 * 24);
        $dias_diferencia = abs($dias_diferencia);
        $dias_diferencia = floor($dias_diferencia);

        return $dias_diferencia;
    }
    //******Fin Integracion con Produccion******

    //******Inicio Carta limite****************
    function obtenerCL2(){
        return 1;
    }
}