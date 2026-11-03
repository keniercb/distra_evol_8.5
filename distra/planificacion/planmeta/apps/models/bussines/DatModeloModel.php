<?php

class DatModeloModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function InsertarModeloAsociar(DatModelo $modelo) {
        $model = DatModelo::getModeloPorEntidad(
                        $modelo->identidad, $modelo->idpadre
        );
        if (!$model[0]) {
            $modelo->save();
            return $modelo->idmodelo;
        }
    }

    /**
     * @function
     *  Insertar
     *  Inserta o modifica un modelo
     *
     * @params
     *     idmodelo    El identificador del modelo que se va a adicionar,
     * si este id viene vacio es que el modelo se va a insertar
     *     denominacion   La denominacion del modelo que se va a adicionar
     *     descripcion    La descripcion del modelo que se va a adicionar
     *     fechaentrega   La fecha en que debe ser entregado el modelo que se va a adicionar
     *     idaprobacion
     *     version        la version que tiene el modelo
     *     idplan        el identificador del plan al que pertenece el modelo
     *     idtipomodelo    el identificador del tipo de modelo
     *     idclasmodelo    el identificador de la clase de modelo
     *     identidad        el identificador de la entidad a que pertenece el modelo
     *
     * @return
     *  id identificador del modelo que se adiciono o se modifico
     * */
    public function Insertar(
    $idmodelo, $denominacion, $descripcion, $fechaentrega, $version, $idplan, $idtipomodelo, $identidad, $clasifmodelo, $denomsRutas, $irBalancematerial, $tipoplan
    ) {

        //creando o modificando el modelo
        $modelo = new DatModelo();
        //Crear los atributos de tipo modelo
        if ($idmodelo) { //modificar
            $modelo = Doctrine::getTable('DatModelo')->find($idmodelo);
            //si se modifico la uri
            if ($modelo->uriruta != $clasifmodelo . '*' . $denomsRutas) {
                $modelo->uriruta = $clasifmodelo . '*' . $denomsRutas;
                $idsnoms = explode('+', $clasifmodelo);
                DatModelodatosnomenclador::eliminar($modelo->idmodelo);
                for ($i = 0; $i < count($idsnoms) - 1; $i++) {
                    if ($idsnoms[$i]) {
                        $nom = explode('-', $idsnoms[$i]);
                        $nom = $nom[0];
                        DatModelodatosnomenclador::Insertar($nom, $modelo->idmodelo);
                    }
                }
            }
        } else { //insertar
            $modelo = new DatModelo();
            $modelo->identidad = $identidad;
            $modelo->version = $version;
            $modelo->idplan = $idplan;
            if ($clasifmodelo) {
                $modelo->uriruta = $clasifmodelo . '*' . $denomsRutas;
            }
        }
        //seteo parametros
        $modelo->denominacion = $denominacion;
        $modelo->fechaentrega = $fechaentrega;
        $modelo->descripcion = $descripcion;
        $modelo->balance = $irBalancematerial;
        $modelo->tipoplan = $tipoplan;
        if (!$idmodelo)
            $modelo->idtipomodelo = $idtipomodelo;
        $modelo->save();

//fin creando o modificando el modelo

        if (!$idmodelo) {//si esta adicionando
            $idsnoms = explode('+', $clasifmodelo);
            for ($i = 0; $i < count($idsnoms) - 1; $i++) {
                if ($idsnoms[$i]) {
                    $nom = explode('-', $idsnoms[$i]);
                    $nom = $nom[0];
                    DatModelodatosnomenclador::Insertar($nom, $modelo->idmodelo);
                }
            }

            $entidadeshijas = DatActividadentidad::auxObtenerEntidadesHijasComun($identidad);
            $entidadmodelo = new Doctrine_Collection('DatEntidadmodelo');
            foreach ($entidadeshijas as $key => $e) {
                if ($e) {
                    $max = DatEntidadmodelo::ultimaPrioridad($e);
                }
                $entidadmodelo[$key]->identidad = $e;
                $entidadmodelo[$key]->idmodelo = $modelo->idmodelo;
                $entidadmodelo[$key]->prioridad = $max[0]['max'] + 1;
            }
            //insertando la relacion modelo-entidad-prioridad
            $entidadmodelo->save();
        }
        return $modelo->idmodelo;
    }

    public function Actualizar(DatModelo $DatModelo) {
        $DatModelo->save();
    }

    public function eliminarDesgloses($idmodelo) {
        $result = DatDesgloseentidadnivel::eliminarDesgloses($idmodelo);
        return $result;
    }

    public function eliminarDesglosesxActividad($idactividad) {
        $result = DatDesgloseentidadnivel::eliminarDesglosesxActividad($idactividad);
        return $result;
    }

    public function Eliminar($identidadmodelo, $idmodelo, $identidadL = null) {
        $entidad = DatEntidadmodelo::listarEntMod($idmodelo);
        foreach ($entidad as $ent) {
            $modelo = Doctrine::getTable('DatEntidadmodelo')->find($ent['identidadmodelo']);
            $prioridad = $modelo->prioridad;
            $update = DatEntidadmodelo::prioridadMayorQue($modelo->identidad, $prioridad);
            foreach ($update as $v) {
                $actualizar = Doctrine::getTable('DatEntidadmodelo')->find($v['identidadmodelo']);
                $actualizar->prioridad = $actualizar->prioridad - 1;
                $actualizar->save();
            }
        }
        $mod = Doctrine::getTable('DatModelo')->find($idmodelo);
        $mod->delete();
    }

    /**
     * @function
     *  CargarModeloDeIgualTipo
     *  devuelve el id y la denominacion de los modelos que tienen igual tipo al modelo que se pasa por parametro
     *
     * @params
     *  idmodelo    El id del modelo para buscar los modelos de igual tipo
     *
     * @return
     *  idmodelo y denominacion de los modelos con igual tipo al pasado por parametro.
     * */
    public function CargarModeloDeIgualTipo($idmodelo) {
        $idtipomodelo = DatModelo::getTipoModeloDadoIdModelo($idmodelo);
        //Obtener idmodelo y denominacion de todos los modelos con igusl tipo al recibido
        $idmodelodenominacion = DatModelo::ObtenerModelosDeUnTipo(
                        $idtipomodelo
        );
        return $idmodelodenominacion;
    }

    /**
     * @function
     *  importarFuenteDatos
     *  Realiza la importacion de datos de los elementos de un modelo a otro
     *
     * @params
     *  modelofuente    El modelo del cual se van a tomar  los datos a importar
     *  modelodestino   El modelo al  cual se van a copiar los datos importados
     *  validar         Una bandera para saber si el usuario desea sobre escribir los datos o no
     *  0 no valides, sobre escribe
     *  1 valida y alerta para sobre escribir o no
     *
     * @return
     * */
    public function importarFuenteDatos($modelofuente, $modelodestino, $validar) {
        //Capturo una instancia de Doctrine_Manager para manejar la conexion
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();
        //si el modelo fuente tiene elementos a importar
        if (DatModelo::contarIndPlanificadosEnModelo($modelofuente->idmodelo)) {
            //Si tiene elementos y hay que validar valido
            if (DatModelo::contarIndPlanificadosEnModelo(
                            $modelodestino->idmodelo
                    ) && $validar
            ) {
                //Muestra alerta que el modelo destino tiene elementos
                echo json_encode(array('codMsg' => 21));
                return;
            } else { //Si no hay que validar o el usuario confirma la importacion, comienza el proceso
                //Cargo los indicadores planificados
                $indFuentes = DatModelo::obtenerTodosIndPlanificadosEnModelo(
                                $modelofuente->idmodelo
                );
                //Capturo una instancia el AR para manejar los metas
                $ar = new ActiveRecordFactory();
                $ciar = $ar->Factory();
                //Capturo una instancia de metadatos
                $meta = ZendExt_Metadata::getInstance();
                //Busco los campos de la tabla para el trabajo con los meta
                $campos = $meta->Attribute()->cargarCampos(
                        $modelodestino->NomTipomodelo->idtabla
                );
                //Por cada indicador planificado en el modelo fuente
                foreach ($indFuentes as $ind) {
                    //Busco si el indicador planificado en la fuenta ya esta en el destino
                    $indExistente = DatModelo::dameIndPlanificadoEnModelo(
                                    $modelodestino->idmodelo, $ind->idindicador
                    );
                    //Si esta procedo a su eliminacion para crearlo nuevo
                    if ($indExistente) {
                        //Elimino del metadatos lo correspondiente a la tupla del modelo
                        $ciar->delete(
                                'mod_planificacionmeta.nom_'
                                . $modelodestino->NomTipomodelo->idtipomodelo, array('idplanificacion' => $indExistente->idplanificacion)
                        );
                        //Elimino de la tabla dat_planificacion
                        $indExistente->delete();
                    }
                    //Adiciono en la tabla dat_planificacion el nuevo elemento en el modelo destino
                    $indNew = new DatPlanificacion();
                    $indNew->idmodelo = $modelodestino->idmodelo;
                    $indNew->idaprobacion = $ind->idaprobacion;
                    $indNew->idindicador = $ind->idindicador;
                    $indNew->save();
                    //Ejecuto la transaccion de doctrine para poder insertar el meta correspondiente a la tupla
                    $con->commit();
                    //Habro una nueva transaccion de doctrine para la proxima ejecucion
                    $con->beginTransaction();
                    //Cargo el meta del ind planificado.
                    $ciar->select('*');
                    $ciar->from(
                            'mod_planificacionmeta.nom_'
                            . $modelodestino->NomTipomodelo->idtipomodelo
                    );
                    $ciar->where('idplanificacion', $ind->idplanificacion);
                    $meta = $ciar->get()->result();
                    //Preparo el arreglo para la insercion en la tabla en metadatos
                    $data = array();
                    foreach ($campos->data as $campo) {
                        $denomcampo = $campo['denominacion'];
                        if ($denomcampo == 'idplanificacion') {
                            $data['idplanificacion'] = $indNew->idplanificacion;
                        } else {
                            if (!$campo['llave_primaria']) {
                                $data[$denomcampo] = $meta[0]->$denomcampo;
                            }
                        }
                    }
                    //Adiciono en la tabla en metadatos
                    $ciar->insert(
                            'mod_planificacionmeta.nom_'
                            . $modelodestino->NomTipomodelo->idtipomodelo, $data
                    );
                }
                //Si llega aqui es porque se ejecuto la importacion satisfactoriamente.
                echo json_encode(array('codMsg' => 1));
            }
        } else {
            echo json_encode(array('codMsg' => 3));
        }
    }

    public function eliminarIndmodPlan($idplanificacion, $identidad, $identidadmodelo = null
    ) {
        //Capturo una instancia el AR para manejar los metas

        if ($identidad == null) {
            $identidad = $this->global->Estructura->idestructura;
        }

        //Busco el elemento planificado en el modelo tabla dat planificacion
        //$tipomod = DatModelo::dameindmodeloplanif($idplanificacion);

        $indPlanificado = Doctrine::getTable('DatPlanificacion')->find(
                $idplanificacion
        );
        //Busco el modelo del cual voy a eliminar y obtengo lo que necesito como el idtipomodelo
        //Elimino el meta del elemento planificado
        /* $contIndDatPLanif = DatPlanificacion::damecantInd(
          $idindicadores, $identidadmodelo, $idejercicio
          ); */

        ////pregunto si la cantidad de veces que se repite en dat_planificacion es 1 y de ser asi lo elimino en Odcte

        /* if ($contIndDatPLanif == 1) {
          $indOdcte = DatOdcte::deleteInd($idindicadores);
          } */

        if ($arrayindicadores) {
            //$idindicador = $arrayindicadores[0]['idindicador'];
            $identidadmodelo = $arrayindicadores[0]['identidadmodelo'];
            /* $serepiten = DatPlanificacion::SeRepiten(
              $idindicador, $identidadmodelo
              ); */
        }


        //Elimino la base del elemento en el modelo
        $indPlanificado->delete();

        //Retorno que se ha eliminado satisfactoriamente
        return 1;
    }

    public function aprobarDesaprobar($idplanificacion, $aprobado) {

        DatPlanificacionModel::aprobarDesaprobar(
                $idplanificacion, $aprobado
        );
    }

    public function servicioBp($idtipomodelo) {
        $this->_meta = ZendExt_Metadata::getInstance();
        //$tm = Doctrine::getTable('NomTipomodelo')->find($idtipomodelo);
        $conn = Doctrine_Manager::connection();
        $query = "SELECT  tm.idtabla
                    FROM
                      mod_planificacion.nom_tipomodelo tm
                    WHERE
                     tm.idtipomodelo=$idtipomodelo";
        $tm = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);

        $editors = $this->_meta->Metadata()->obtenerConfigFormulario(
                //$tm->idtabla
                $tm[0]
        );
        foreach ($editors->items as $e) {
            if ($e['xtype'] == 'combo') {

                $id = NomTiponomenclador::buscarpordenom($e['fieldLabel']);

                if ($id) {
                    $array['idtiponomenclador'][] = $id[0]['idtiponomenclador'];
                }
            }
        }
        //$array['idtabla'] = $tm->idtabla;
        $array['idtabla'] = $tm[0];
        return $array;
    }

    public function aprobarDesaprobarFamilia($params) {
        $apdesp = DatModelo::aprobarDesaprobarFamilia($params);
        $dat->codMsgAD = 1;
        return $dat;
    }

    public function aprobarDesaprobarAjusteFamilia($params) {
        $dat = DatModelo::aprobarDesaprobarAjusteFamilia($params);
        return $dat;
    }

    public function aprobarDesaprobarTodosFamilia($identidad, $idmodelo, $aprobado, $rectora, $idejercicio, $glob, $identmodelo) {

        $identidadmodelo = array();
        if ($glob == 'true') {
            $arryhijos = array();
            $arryhijos = DatActividadentidad::auxObtenerEntidadesHijasComun($identidad);
            $arryhijos = implode(',', $arryhijos);

            $identidadmodelo = DatEntidadmodelo::listarEntModEnt($idmodelo, $arryhijos);
            $identidadmodelo[] = $identmodelo;
        } else
            $identidadmodelo[] = $identmodelo;
        DatModelo::aprobarDesaprobarTodosFamilia($identidadmodelo, $aprobado, $rectora, $idejercicio);

        $dat->codMsgM = 1;
        return $dat;
    }

    public function aprobarDesaprobarAjusteTodosFamilia($params) {

        $params['identidadmodelo'] = array();
        if ($params['glob'] == 'true') {
            $arryhijos = array();
            $arryhijos = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
            $arryhijos = implode(',', $arryhijos);

            $params['identidadmodelo'] = DatEntidadmodelo::listarEntModEnt($params['idmodelo'], $arryhijos);
            $params['identidadmodelo'][] = $params['identmod'];
        } else
            $params['identidadmodelo'][] = $params['identmod'];
        $dat = DatModelo::aprobarDesaprobarTodosAjusteFamilia($params);
        return $dat;
    }

    //Utilizado como servicio
    public function listarDatosdePlan($identidad, $idmodelo, $start = 0, $limit = 1000, $global = false) {
        $ejercicio = NomEjercicioplanificacion::servicioObtenerEjercicioActual();
        $idejercicio = $ejercicio['idejercicio'];

        $identidadmodelo = DatEntidadmodelo::getIdentidadmodelo($idmodelo, $identidad);
        $identidadmodelo = $identidadmodelo[0]['identidadmodelo'];

        if ($global == 'true') {
            $ajustar = 1;
        } else {
            $ajustar = 0;
        }

        $tipomod = new NomTipomodelo();
        $tipomodelo = $tipomod->ObtenerIdTipoModelo($idmodelo);

        //OBTIENE UN OBJETO ACTIVE RECORD CON TODA LA INFORMACION DE ESA TABLA PARA TRABAJAR Y HACER
        // MAS CONSULTAS CON ELLA
        $this->_meta = ZendExt_Metadata::getInstance();
        $x = $this->_meta->Metadata()->obtenerInfoTabla($tipomodelo[0]['idtabla']);


        $codigotm = $tipomodelo[0]['codigo'];
        $concat = $codigotm . '_id' . $codigotm;
        $llave = "mod_planificacionmeta_nom_$concat";
        $llaveprimaria = "mod_planificacionmeta_dat_$concat";

        if ($ajustar == 1) {
            $arryhijos = DatActividadentidad::auxObtenerEntidadesHijasComun(
                            $identidad
            );
            array_push($arryhijos, $identidad);
            $var = implode(',', $arryhijos);
            $arryhijos = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
            if ($arryhijos[0] == null || $arryhijos[0] == '' || !$arryhijos[0]) {
                $data->data = array();
                $data->total = 0;
                echo json_encode($data);
                return;
            }
        } else {
            $ident = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($identidad);
            if ($ident[0] == null || $ident[0] == '' || !$ident[0]) {
                $data->data = array();
                $data->total = 0;
                echo json_encode($data);
                return;
            }
        }


        $datosf = DatPlanModel::getDatosServicio(
                        $tipomodelo[0]['idtipomodelo'], $tipomodelo[0]['idtabla'], $x, $identidadmodelo, $idejercicio, $start, $limit, $ajustar, $arryhijos, $idmodelo
        );

        $datos = Array();


        for ($index = 0; $index < count($datosf); $index++) {
            $datos[] = $datosf[$index];
            if (count($datos) == $limit) {
                break;
            }
        }
        $integrator = ZendExt_IoC::getInstance();
        foreach ($datos as $k => $d) {
            $datos[$k]['centrobalance'] = $d['centrosbalance'];
            $existecom = DatComentario::verificarIdPlanificacion(
                            $datos[$k]['idplanificacion']
            );
            if ($existecom == 1) {
                $datos[$k]['comentario'] = true;
            } else {
                $datos[$k]['comentario'] = false;
            }
            $datos[$k]['flete'] = number_format($d['flete'], '3', '.', ',');
            $datos[$k]['contingencia'] = number_format(
                    $d['contingencia'], '3', '.', ','
            );
            $datos[$k]['importe'] = number_format($d['importe'], '3', '.', ',');
            $datos[$k]['importeajustado'] = number_format(
                    $d['importeajustado'], '3', '.', ','
            );
            $datos[$k]['importefinal'] = number_format(
                    $d['importefinal'], '3', '.', ','
            );
            $datos[$k]['importedivisa'] = number_format(
                    $d['importedivisa'], '3', '.', ','
            );
            $datos[$k]['importefila'] = number_format(
                    $d['importefila'], '3', '.', ','
            );
            $idpais = $d['idpais'];


            $this->nomenclador = new ZendExt_Nomencladores_ADT();
            $pais = $this->nomenclador->selectParam(
                    'nom_pais', array('nombrepais'), 0, 0, "idpais=$idpais"
            );
            $datos[$k] ['pais'] = $pais [0] ['nombrepais'];

            $unidades = $integrator->datosmaestros->obtenerUnidadMedidaDadoId(
                    Array($d['idumedida'])
            );
            $datos[$k]['umedida'] = $unidades[0]['denominacionunidadmedida'];

            $datos[$k]['_is_leaf'] = true;
            $datos[$k]['_parent'] = null;
        }

        return $datos;
    }

    public function datosExportar($params) {
        $tipomod = new NomTipomodelo();
        $tipomodelo = $tipomod->ObtenerIdTipoModelo($params->idmodelo);

        //OBTIENE UN OBJETO ACTIVE RECORD CON TODA LA INFORMACION DE ESA TABLA PARA
        // TRABAJAR Y HACER MAS CONSULTAS CON ELLA
        $x = $params->meta->Metadata()->obtenerInfoTabla(
                $tipomodelo[0]['idtabla']
        );
        if ($params->ajustar == 1) {
            $arryhijos = DatActividadentidad::auxObtenerEntidadesHijasComun(
                            $params->identidad
            );
            array_push($arryhijos, $params->identidad);
            $var = implode(',', $arryhijos);
            $arryhijos = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
            if ($arryhijos[0] == null || $arryhijos[0] == '' || !$arryhijos[0])
                $params->identidadmodelo = -1;
        } else {
            $ident = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($params->identidad);
            if ($ident[0] == null || $ident[0] == '' || !$ident[0]) {
                $params->identidadmodelo = -1;
            }
        }

        if ($params->identidadmodelo != -1) {
            /* nueva implementacion de filtros */
            $filt = DatModeloModel::auxConfigFiltros($params->filtros);
            $parametros = $filt->parametros;
            $filtroDin = $filt->filtroDin;

            $datos = DatPlanModel::getDatos(
                            $tipomodelo[0]['idtipomodelo'], $tipomodelo[0]['idtabla'], $x, $params->identidadmodelo, $params->idejercicio, $parametros, $params->start, $params->limit, $params->ajustar, $arryhijos, $params->idmodelo, $filtroDin
            );

            $x = $this->_meta->Metadata()->obtenerInfoTabla(
                    $tipomodelo[0]['idtabla']
            );



            $importet = DatPlanModel::getDatosImporte(
                            $tipomodelo[0]['idtipomodelo'], $tipomodelo[0]['idtabla'], $x, $params->identidadmodelo, $params->idejercicio, $parametros, $params->ajustar, $arryhijos, $filtroDin, $params->idmodelo
            );

            $arrayCampostab = DatPlanModel::camposdadoTabla(
                            $tipomodelo[0]['idtabla']
            );

            $arrayCampos = array();
            $arrayCamposDinNoNom = array();
            foreach ($arrayCampostab as $d) {
                $referencia[0] = "mod_planificacionmeta_dat_{$tipomodelo[0]['codigo']}_{$d['denomcampo']}";

                $referencia[1] = $d['denomcampo'];
                if ($d['tipoDato'] != 'Nomenclador')
                    $arrayCamposDinNoNom[] = $referencia;
                else
                    $arrayCampos[] = $referencia;
            }
            unset($arrayCampostab);

            $arrayIdsDatosNomUno = array();
            $arrayIdsDatosNomDos = array();
            $arrayUms = array();
            $arrayPais = array();

            $estructuras = $this->integrator->metadatos->DameEstructura($params->identidad);

            $unidadesmedida = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();

            $this->nomenclador = new ZendExt_Nomencladores_ADT();
            $paises = $this->nomenclador->selectParam(
                    'nom_pais', array('idpais',
                'nombrepais')
            );

            $misunidadesmedida = array();
            $mispaises = array();

            $total = 0;
            if (count($estructuras) > count($unidadesmedida) && count($estructuras) > count($paises)
            ) {
                $total = count($estructuras);
            } elseif (count($unidadesmedida) > count($estructuras) && count($unidadesmedida) >
                    count($paises)
            ) {
                $total = count($unidadesmedida);
            } elseif (count($paises) > count($unidadesmedida) && count($paises) > count($estructuras)
            ) {
                $total = count($paises);
            }


            $yaestructura = false;
            $yaunidadmedida = false;
            $yapais = false;
            for ($index = 0; $index < $total; $index++) {
                if (!$yaestructura) {
                    if ((count($estructuras) - 1) == $index) {
                        $yaestructura = true;
                    }
                }

                if (!$yaunidadmedida) {
                    $misunidadesmedida[$unidadesmedida[$index]['idunidadmedida']] = $unidadesmedida[$index];
                    if ((count($unidadesmedida) - 1) == $index) {
                        $yaunidadmedida = true;
                    }
                }

                if (!$yapais) {
                    $mispaises[$paises[$index]['idpais']] = $paises[$index];
                    if ((count($paises) - 1) == $index) {
                        $yapais = true;
                    }
                }
            }

            foreach ($datos as $k => $d) {
                $datos[$k]['centrobalance'] = $d['centrosbalance'];

                //busco la denominacion del pais.
                $idpais = $d['idpais']; //nomindicador o indicadorcontroller

                if ($arrayPais['_' . $idpais] == null) {
                    $datos[$k]['pais'] = $mispaises[$idpais]['nombrepais'];
                    $arrayPais['_' . $idpais] = $mispaises[$idpais]['nombrepais'];
                } else {
                    $datos[$k]['pais'] = $arrayPais['_' . $idpais];
                }
                $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(
                        Array($d['idumedida'])
                );

                $datos[$k]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];

                $datos[$k]['_is_leaf'] = true;
                $datos[$k]['_parent'] = null;
                foreach ($arrayCampos as $campoMeta) {
                    $campoMeta = $campoMeta[0];
                    if ($arrayIdsDatosNomUno['_' . $campoMeta] == null && $d[$campoMeta] != null
                    ) {
                        $arrayIdsDatosNomDos[] = $d[$campoMeta];
                        $arrayIdsDatosNomUno['_' . $d[$campoMeta]] = 'ok';
                    }
                }
            }
            $arrayIdsDatosNomDos = array_unique($arrayIdsDatosNomDos);
            unset($arrayIdsDatosNomUno);
            if ($arrayIdsDatosNomDos[0] != null) {

                $arrayColumnas = NomDatosnomenclador::ObtenerDatosDadoArrayIdDatosNom(
                                $arrayIdsDatosNomDos
                );
            }

            unset($arrayIdsDatosNomDos);
            if (is_array($arrayColumnas)) {
                foreach ($arrayColumnas as $key => $value) {
                    unset($arrayColumnas[$key]);
                    $arrayColumnas['_' . $value['iddatosnomenclador']] = $value['denominacion'];
                }
            }
            foreach ($datos as $k => $d) {
                foreach ($arrayCampos as $campoMeta) {
                    $datos[$k]['deno_' . $campoMeta[1]] = $arrayColumnas['_'
                            . $d[$campoMeta[0]]];
                }
                foreach ($arrayCamposDinNoNom as $campoMeta) {
                    $datos[$k]['deno_' . $campoMeta[1]] = $d['mod_planificacionmeta_dat_' . $tipomodelo[0]['codigo'] . '_' . $campoMeta[1]];
                }
            }
            $datos['importet'] = number_format(
                    $importet[0]['importetotal'], '3', '.', ','
            );
            $datos['importeajust'] = number_format(
                    $importet[0]['importeajustado'], '3', '.', ','
            );
            $datos['importefin'] = number_format(
                    $importet[0]['importefinal'], '3', '.', ','
            );
            $datos['importeflete'] = number_format(
                    $importet[0]['importeflete'], '3', '.', ','
            );
            $datos['importecontingencia'] = number_format(
                    $importet[0]['importecontingencia'], '3', '.', ','
            );
            $datos['importedivisa'] = number_format(
                    $importet[0]['importedivisa'], '3', '.', ','
            );

            $data->datos = $datos;
            $data->arrayCampos = $arrayCampos;
            $data->tipomodelo = $tipomodelo;
        } else {
            $data->datos = array();
            $data->arrayCampos = array();
            $data->tipomodelo = array();
        }
        return $data;
    }

    public function exportarIndicadoresPlan($params) {

        $data = self::datosExportar($params);
        $datos = $data->datos;

        $tipomodelo = $data->tipomodelo;
        unset($data);

        $arrayEtiquetas = DatPlanModel::getEtiquetasTabla($tipomodelo[0]['idtabla']);

        $tabla = '<table border="1">
            <thead>
                <tr>
                    <td colspan="11"><b>Entidad: </b> ' . utf8_decode($params->entidad) .
                ' &nbsp;&nbsp;&nbsp; <b>Plan: </b> ' . $params->plan . ' <br></td>
                </tr>
            </thead>
            <tbody>
                <tr>';

        $columnas = '<th>C&oacute;digo</th>
                    <th>Num. piezas</th>
                    <th>Denominaci&oacute;n</th>
                    <th>UM</th>
                    <th>Precio</th>
                    <th>Necesidad</th>
                    <th>Ajuste</th>
                    <th>Cantidad Final</th>
                    <th>Centro balance</th>
                    <th>Pa&iacute;s</th>';
        //construccion de las columnas
        foreach ($arrayEtiquetas as $ind => $etiq) {
            $columnas .= '<th>' . $etiq['etiqueta'] . '</th>';
        }

        $columnas .= ' <th>Importe Inicial</th>
                    <th>Importe Ajustado</th>
                    <th>Importe Final</th>
                    <th>Flete y Seguro</th>
                    <th>Contingencia</th>
                     <th>Origen</th>
                     <th>V&iacute;a de Aquisici&oacute;n</th>
                     <th>&Oacute;rgano que Satisface</th>
                </tr>';
        $tabla = $tabla . $columnas;
        $count = count($datos);
        for ($i = 0; $i < $count; $i++) {
            if ($datos[$i]['codigo'] != null) {
                if ($datos[$i]['generadobasesplan'] == 0) {
                    $baseplan = 'Directo al plan';
                } else if ($datos[$i]['generadobasesplan'] == 1) {
                    $baseplan = 'Base para el plan';
                } else if ($datos[$i]['generadobasesplan'] == 2) {
                    $baseplan = 'Afectado';
                } else if ($datos[$i]['generadobasesplan'] == 3) {
                    $baseplan = 'Otros';
                }

                $numeropieza = $datos[$i]['numeropieza'] ? $datos[$i]['numeropieza'] : 0;
                $datos[$i]['flete'] = number_format(
                        $datos[$i]['flete'], '3', '.', ''
                );
                $datos[$i]['contingencia'] = number_format(
                        $datos[$i]['contingencia'], '3', '.', ''
                );
                $tabla
                        .= '<tr style="text-align:RIGHT;">
                                <td>' . $datos[$i]['codigo'] . '</td>
                                <td style="text-align:LEFT;">' . $numeropieza .
                        '</td>
                                <td style="text-align:LEFT;">' . $datos[$i]['denominacion'] .
                        '</td><td style="text-align:LEFT;">' . $datos[$i]['umedida'] . '</td>
                                <td>' . $datos[$i]['precio'] . '</td>
                                <td>' . $datos[$i]['cantidad'] . '</td>
                                <td>' . $datos[$i]['ajuste'] . '</td>
                                <td>' . $datos[$i]['cantidadfinal'] . '</td>
                                <td style="text-align:LEFT;">'
                        . $datos[$i]['centrobalance'] .
                        '</td>
                                <td style="text-align:LEFT;">'
                        . $datos[$i]['pais'] .
                        '</td>';

                foreach ($arrayEtiquetas as $ind => $etiq) {
                    $tabla .= ' <td style="text-align:LEFT;">'
                            . $datos[$i]['deno_' . $etiq['denominacion']] .
                            '</td>';
                }
                $datos[$i]['importeind'] = $datos[$i]['importe'];
                $datos[$i]['importeind'] = number_format(
                        $datos[$i]['importeind'], '3', '.', ''
                );
                $tabla .= '     <td>' . $datos[$i]['importeind'] . '</td>
                                <td>' . number_format(
                                $datos[$i]['importeajustado'], '3', '.', ''
                        ) . '</td>
                                <td>' . number_format(
                                $datos[$i]['importefinal'], '3', '.', ''
                        ) . '</td>
                                <td>' . $datos[$i]['flete'] . '</td>
                                <td>' . $datos[$i]['contingencia'] .
                        '</td>
                                <td style="text-align:LEFT;">' . $baseplan .
                        '</td>
                                <td style="text-align:LEFT;">'
                        . $datos[$i]['viaadquisicion'] .
                        '</td>
                                <td style="text-align:LEFT;">'
                        . $datos[$i]['organosatisface'] .
                        '</td>
                           </tr>';
            }
        }
        $filaResumen = ' <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>';
        $cant = 0;
        foreach ($arrayEtiquetas as $ind => $etiq) {
            $filaResumen .= '<td></td>';
            $cant++;
        }
        $abc = "LMNOPQRSTUVWXYZA";
        $abcuno = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if ($cant < 16) {
            $LETRAFINAL = substr($abc, $cant, 1);
        } else {
            $LETRAFINAL = 'A' . substr($abcuno, ($cant - 16), 1);
        }
        $LETRAFINAL = 'O';

        $filaResumen
                .= '<td></td>
                                <td></td>
                                <td>Importe Total:</td>
                                <td>' . $datos['importet'] . '</td>
                                ';
        $tabla .= $filaResumen;

        $filaResumenuno = '
                                <td>' . $datos['importeajust'] . '</td>
                               ';
        $tabla .= $filaResumenuno;
        $filaResumendos = '
                                <td>' . $datos['importefin'] . '</td>
                                ';
        $tabla .= $filaResumendos;
        $tabla.='<td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                </tbody>
                  </table>';

        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=planes.xls");
        header("Content-Transfer-Encoding: utf8_decode ");

        echo $tabla;
    }

    public function exportarDemanda($params) {
        //indica que es el exportar para que no ponga offset y limit
        $params['exportar'] = 1;

        //Ajustando los parámetros de los filtros al formato 'listar'
//        $nuevos_filtros = [];
//        foreach ($params['filtros'] as $filtro) {
//            $obj_filtro['field'] = $filtro->field;
//            $obj_filtro['data']['type'] = $filtro->data->type;
//            if ($obj_filtro['data']['type'] == 'numeric') {
//                $obj_filtro['data']['comparison'] = $filtro->data->comparison;
//            }
//            if ($obj_filtro['data']['type'] == 'list') {
//                $obj_filtro['data']['value'] = $filtro->data->value[0];
//            } else {
//                $obj_filtro['data']['value'] = $filtro->data->value;
//            }
//            $nuevos_filtros[] = $obj_filtro;
//        }
//        $params['filtros'] = $nuevos_filtros;
        $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom($params['idcb']);
        $params['identidaddatosnomenclador'] = $entidaddatosnom[0]['identidaddatosnomenclador'];

        //preparando excel
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header('Content-Disposition: attachment;filename=demandas.xls');
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo "<table border=1>\n";
        echo "<H2 align=left>Demandas por entidades al Centro de Balance</H2>";
        echo "</tr>";
        //columnas
        echo '<th>' . 'Especialidad' . '</th>';
        echo '<th>' . 'Entidad' . '</th>';
        echo '<th>' . 'Plan' . '</th>';
        echo '<th>' . 'Codigo' . '</th>';
        echo '<th>' . 'Nro Pieza' . '</th>';
        echo '<th>' . 'Denominacion' . '</th>';
        echo '<th>' . 'Cantidad' . '</th>';
        echo '<th>' . 'Importe' . '</th>';
        echo "</tr>";

        //Obteniendo los datos
        $datos = DatPlanificacion::indXCB($params);

        //Mostrando los datos
        foreach ($datos->data as $value) {
            echo "<tr>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['denomentidadpadre'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['denominacionenti'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['denominacionmodelo'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['codigo'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['numeropieza'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['denominacionind'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['necesidad'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['importe'] . "</td>";
            echo "</tr>";
        }

        echo "</table>\n";
        $fecha = strftime("%Y/%m/%d %T", time());
        echo"Fecha: {$fecha}</H6>.";
        echo '</BODY></HTML>';
    }

    public function exportarReporteResumenOACE($params) {
        //manejo de parametros
        $integrator = ZendExt_IoC::getInstance();
        //obtener las entidades hijas de las seleccionadas
        //y que son organos demandantes
        $arrayentidades = explode(',', $params['idorganosdemandantes']);
        $todasEntidades = array();
        foreach ($arrayentidades as $key => $v) {
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($v);
            $var = implode(',', $entidades);
            $entidades = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
            $todasEntidades = array_merge($todasEntidades, $entidades);

            foreach ($todasEntidades as $entidad2) {
                $datosentidad = $integrator->metadatos->DameEstructura($entidad2);
                $array_entidades[$entidad2] = $datosentidad[0]->denominacion;
            }
        }
        $params['identidades'] = $todasEntidades;
        $params['oace'] = NomOrganosatisface::obtenerOrganoSatisfaceDadoVariosId($params['idoace']);

        //obtener los datos
        $data = self::datosExportarReporteResumenOACE($params);
        $datos = $data->datos;

//        $fecha = strftime("%Y/%m/%d %T");
//        este aqui no funciona es posible q sea por la version de php
        $fecha = date("d") . "/" . date("m") . "/" . date("Y") /* . time() */;

        //preparando excel
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header('Content-Disposition: attachment;filename=resumen_productos_oace_od.xls');
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo "<table border=1>\n";
        echo "<H2 align=left>RESUMEN DE PRODUCTOS POR OACE Y ÓRGANO DEMANDANTE</H2>";
        echo "<H3 align=left>Ejercicio: {$params['ejercicio']}</H3>";
        echo "<H3 align=left>Plan: {$params['modelo']}</H3>";
        echo "<H3 align=left>Fecha: $fecha</H3>";
        echo "</tr>";

        //columnas
        echo '<th>' . 'OACE' . '</th>';
        echo '<th>' . 'ÓRGANO DEMANDANTE' . '</th>';
        echo '<th>' . 'DEMANDA' . '</th>';
        echo '<th>' . 'DIVISA' . '</th>';
        /* PINTAR LOS NOMBRES DE LAS COL DINAM */
        $objtipodato = DatPlanModel::obtenerTipoDatoNum('Numérico');
        $arrayEtiquetas = DatPlanModel::getEtiquetasxTipoDatoTabla($params['tipomodelo'][0]['idtabla'], $objtipodato[0]);

        foreach ($arrayEtiquetas as $key => $etiq) {
            echo '<th>' . $etiq['etiqueta'] . '</th>';
        }
        echo "</tr>";
        $idtipomodelo = $params['tipomodelo'][0]['idtipomodelo'];
        $params['subtotaldemanda'] = null;
        $params['totaldemanda'] = 0;
        $params['subtotaldivisa'] = null;
        $params['totaldivisa'] = 0;
        $subtotaldinam = array();
        $totaldinam = array();
        //Mostrando los datos
        foreach ($datos as $value) {
            if ($params['oace'] == $value['organosatisface']) {
                $params['subtotaldemanda'] = $params['subtotaldemanda'] + $value['demanda'];
                $params['totaldemanda'] = $params['totaldemanda'] + $value['demanda'];
                $params['subtotaldivisa'] = $params['subtotaldivisa'] + $value['divisa'];
                $params['totaldivisa'] = $params['totaldivisa'] + $value['divisa'];
            } else {
                if ($params['oace'] != '' && ($params['subtotaldemanda'] != null || $params['subtotaldivisa'] != null)) {
                    DatModeloModel::pintarSubtotales($params, $arrayEtiquetas, $subtotaldinam);
                    $params['oace'] = '';
                    $params['subtotaldemanda'] = null;
                    $params['subtotaldivisa'] = null;
                    $subtotaldinam = array();
                }
                $params['subtotaldemanda'] = $value['demanda'];
                $params['subtotaldivisa'] = $value['divisa'];
                $params['totaldemanda'] = $params['totaldemanda'] + $value['demanda'];
                $params['totaldivisa'] = $params['totaldivisa'] + $value['divisa'];
                $params['oace'] = $value['organosatisface'];
            }
            echo "<tr>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['organosatisface'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $array_entidades[$value['identidad']] . "</td>";
            echo"<td align=left style=\"mso-number-format:'#,##0.00';\" >" . $value['demanda'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'#,##0.00';\" >" . $value['divisa'] . "</td>";

            foreach ($arrayEtiquetas as $key => $etiq) {
                $subtotaldinam[$etiq['denominacion']] = $subtotaldinam[$etiq['denominacion']] + $value['dat_' . $idtipomodelo . $etiq['denominacion']];
                $totaldinam[$etiq['denominacion']] = $totaldinam[$etiq['denominacion']] + $value['dat_' . $idtipomodelo . $etiq['denominacion']];
                echo"<td align=left style=\"mso-number-format:'#,##0.00';\" >" . $value['dat_' . $idtipomodelo . $etiq['denominacion']] . "</td>";
            }
            echo "</tr>";
        }
        if ($params['oace'] != '' && ($params['subtotaldemanda'] != null || $params['subtotaldivisa'] != null || $subtotaldinam)) {
            DatModeloModel::pintarSubtotales($params, $arrayEtiquetas, $subtotaldinam);
            $params['oace'] = '';
            $params['subtotaldemanda'] = null;
            $params['subtotaldivisa'] = null;
            $subtotaldinam = array();
        }
        DatModeloModel::pintarTotales($params, $arrayEtiquetas, $totaldinam);
        echo "</table>\n";
        echo '</BODY></HTML>';
    }

    public function datosExportarReporteResumenOACE($params) {
        $datos = DatPlanificacion::obtenerDatos($params);
        $arrayCampostab = DatPlanModel::camposNumericosDadoTabla($params['tipomodelo'][0]['idtabla']);

        $arrayCampos = array();
        $arrayCamposDinNoNom = array();
        foreach ($arrayCampostab as $d) {
            $referencia[0] = "mod_planificacionmeta_dat_{$params['tipomodelo'][0]['codigo']}_{$d['denomcampo']}";
            // print_r($referencia);die;
            $referencia[1] = $d['denomcampo'];
            if ($d['tipoDato'] != 'Nomenclador') {
                $arrayCamposDinNoNom[] = $referencia;
            } else {
                $arrayCampos[] = $referencia;
            }
        }
        unset($arrayCampostab);

        $arrayIdsDatosNomUno = array();
        $arrayIdsDatosNomDos = array();


        foreach ($datos as $k => $d) {
            foreach ($arrayCampos as $campoMeta) {
                $campoMeta = $campoMeta[0];
                if ($arrayIdsDatosNomUno['_' . $campoMeta] == null && $d[$campoMeta] != null
                ) {
                    $arrayIdsDatosNomDos[] = $d[$campoMeta];
                    $arrayIdsDatosNomUno['_' . $d[$campoMeta]] = 'ok';
                }
            }
        }
        $arrayIdsDatosNomDos = array_unique($arrayIdsDatosNomDos);
        unset($arrayIdsDatosNomUno);
        if ($arrayIdsDatosNomDos[0] != null) {
            $arrayColumnas = NomDatosnomenclador::ObtenerDatosDadoArrayIdDatosNom($arrayIdsDatosNomDos);
        }
        unset($arrayIdsDatosNomDos);
        if (is_array($arrayColumnas)) {
            foreach ($arrayColumnas as $key => $value) {
                unset($arrayColumnas[$key]);
                $arrayColumnas['_' . $value['iddatosnomenclador']] = $value['denominacion'];
            }
        }
        foreach ($datos as $k => $d) {
            foreach ($arrayCampos as $campoMeta) {
                $datos[$k]['deno_' . $campoMeta[1]] = $arrayColumnas['_'
                        . $d[$campoMeta[0]]];
            }
            foreach ($arrayCamposDinNoNom as $campoMeta) {
                $datos[$k]['deno_' . $campoMeta[1]] = $d['mod_planificacionmeta_dat_' . $params['tipomodelo'][0]['codigo'] . '_' . $campoMeta[1]];
            }
        }
        $data->datos = $datos;
        $data->arrayCampos = $arrayCampos;
        return $data;
    }

    public function pintarSubtotales($params, $arrayEtiquetas, $subtotaldinam) {
        echo "<tr>";
        echo"<td align=left style=\"mso-number-format:'@';\" >" . 'Subtotal ' . $params['oace'] . "</td>";
        echo"<td align=left style=\"mso-number-format:'@';\" >" . '' . "</td>";
        echo"<td align=left style=\"mso-number-format:'#,##0.00';\" >" . $params['subtotaldemanda'] . "</td>";
        echo"<td align=left style=\"mso-number-format:'#,##0.00';\" >" . $params['subtotaldivisa'] . "</td>";
        foreach ($arrayEtiquetas as $key => $etiq) {
            echo"<td align=left style=\"mso-number-format:'#,##0.00';\" >" . $subtotaldinam[$etiq['denominacion']] . "</td>";
        }
        echo "</tr>";
    }

    public function pintarTotales($params, $arrayEtiquetas, $totaldinam) {
        echo "<tr>";
        echo"<td align=left style=\"mso-number-format:'@';\" >" . 'TOTAL PLAN' . "</td>";
        echo"<td align=left style=\"mso-number-format:'@';\" >" . '' . "</td>";
        echo"<td align=left style=\"mso-number-format:'#,##0.00';\" >" . $params['totaldemanda'] . "</td>";
        echo"<td align=left style=\"mso-number-format:'#,##0.00';\" >" . $params['totaldivisa'] . "</td>";
        foreach ($arrayEtiquetas as $key => $etiq) {
            echo"<td align=left style=\"mso-number-format:'#,##0.00';\" >" . $totaldinam[$etiq['denominacion']] . "</td>";
        }
        echo "</tr>";
    }

    public function exportarIndicadoresParaEnmar($params) {
        $params->arryhijos = DatActividadentidad::auxObtenerEntidadesHijasComun($params->identidad);
        $params->arryhijosAux = implode(',', $params->arryhijos);
        $datosExportar = DatModelo::getDatosExportarEnm($params);
        $unidades = $params->integrator->datosmaestros->listarUnidadesMedidaTodas();
        foreach ($unidades as $value) {
            $unidades [$value['idunidadmedida']] = $value['abreviaturaunidadmedida'];
        }

        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=indicadores_sin_planes.xls");
        header("Content-Transfer-Encoding: utf8_encode");

        echo "<table border=1 cellspacing=0 width=60%>";

        echo "<th align=left>Codigo</th>
                    <th align=left>Denominacion</th>
                    <th align=left>UM</th>
                    <th align=left>Precio</th>
                    <th align=left>Precio MLC</th>
                    <th align=left>Organo Satisface</th>
                    <th align=left>Via Adquisicion</th>
                    <th align=left>Cantidad Final</th>
                    <th align=left>Importe inicial</th>
                    <th align=left>Importe ajuste</th>
                    <th align=left>Importe final</th>
                    <th align=left>Aprobacion</th>";

        foreach ($datosExportar as $key => $mostrar) {
            $datosExportar[$key]['abreviaturaunidadmedida'] = $unidades[$mostrar['idumedida']];
            echo "<tr>
                    <td>" . $mostrar['codigo'] . "</td>
                    <td>" . $mostrar['denominacion'] . "</td>
                    <td>" . $datosExportar[$key]['abreviaturaunidadmedida'] . "</td>
                    <td>" . $mostrar['precio'] . "</td>
                    <td>" . $mostrar['preciomlc'] . "</td>
                    <td>" . $mostrar['organo'] . "</td>
                    <td>" . $mostrar['via'] . "</td>
                    <td>" . number_format($mostrar['cantplanif'], '6', '.', ',') . "</td>
                    <td>" . number_format($mostrar['importeinicial'], '3', '.', ',') . "</td>
                    <td>" . number_format($mostrar['importeajustado'], '3', '.', ',') . "</td>
                    <td>" . number_format($mostrar['importefinal'], '3', '.', ',') . "</td>";
            if ($mostrar['idaprobaciondemanda'] == 4) {
                echo "<td>Rector</td>";
            }
            echo "</tr>";
        }
        echo "</table>";
    }

    /*
      Todo ---> De aqui empiesa las funciones para pronostico
     */

    public function getOrganosbyInd() {

        $arrayMeses = $this->getMeses();
        $arrayOS = $this->getOSbyIndicador(335676);
        $result = array();
        foreach ($arrayMeses as $i => $mes) {
            $result[$i]['mes'] = $mes['denominacion'];
        }


        foreach ($arrayOS as $j => $OS) {
            $result[$OS['denominacion']] = '-';
        }
        return $result;
    }

    public function getMeses($params) {

        $conn = Doctrine_Manager::connection();

        $paginado = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $paginado = " OFFSET $start LIMIT $limit ";
        }

        $sql = "SELECT dn.iddatosnomenclador,
                        dn.denominacion as mes,
                        COUNT(*) OVER() as total
                FROM mod_planificacion.nom_datosnomenclador dn
                      INNER JOIN mod_planificacion.nom_tiponomenclador tn ON
                dn.idtiponomenclador
                        = tn.idtiponomenclador
                WHERE tn.uritiponomenclador = 'mes' and dn.uridatosnomenclador <> '-'
                ORDER BY dn.iddatosnomenclador " . $paginado;

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    public function getOSbyIndicador($params) {

        $conn = Doctrine_Manager::connection();

        $sql = "SELECT os.idorganosatisface,
                        os.denominacion as organo
                FROM mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ios
                      INNER JOIN mod_datosmaestros.nom_organosatisface os ON
                        ios.idorganosatisface = os.idorganosatisface
                WHERE idindicador = " . intval($params['idIndicador']);

        $data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function setPronosticos($params) {

    }

    public function auxConfigFiltros($filtros) {
        $filtroDin = array();
        $contAux = 0;
        if ($filtros[0] != "") {
            foreach ($filtros as $datos) {
                if ($datos->field == 'codigo') {
                    $parametros ['codigo'] = $datos->data->value;
                } elseif ($datos->field == 'numeropieza') {
                    $parametros ['numeropieza'] = $datos->data->value;
                } elseif ($datos->field == 'centrobalance') {
                    $parametros ['centrobalance'] = $datos->data->value;
                } elseif ($datos->field == 'denominacion') {
                    $parametros ['denominacion'] = $datos->data->value;
                } elseif ($datos->field == 'descripcion') {
                    $parametros ['descripcion'] = $datos->data->value;
                } elseif ($datos->field == 'precio') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['precio_condicion1'] = array('precio' => $datos->data->value, 'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['precio_condicion2'] = array('precio' => $datos->data->value, 'condicion' => "<");
                    } else {
                        $parametros ['precio_condicion3'] = array('precio' => $datos->data->value, 'condicion' => "=");
                    }
                } elseif ($datos->field == 'flete') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['flete_condicion1'] = array('flete' => $datos->data->value, 'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['flete_condicion2'] = array('flete' => $datos->data->value, 'condicion' => "<");
                    } else {
                        $parametros ['flete_condicion3'] = array('flete' => $datos->data->value, 'condicion' => "=");
                    }
                } elseif ($datos->field == 'contingencia') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['contingencia_condicion1'] = array('contingencia' => $datos->data->value, 'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['contingencia_condicion2'] = array('contingencia' => $datos->data->value, 'condicion' => "<");
                    } else {
                        $parametros ['contingencia_condicion3'] = array('contingencia' => $datos->data->value, 'condicion' => "=");
                    }
                } elseif ($datos->field == 'cantidad') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['cantidad_condicion1'] = array('cantidad' => $datos->data->value, 'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['cantidad_condicion2'] = array('cantidad' => $datos->data->value, 'condicion' => "<");
                    } else {
                        $parametros ['cantidad_condicion3'] = array('cantidad' => $datos->data->value, 'condicion' => "=");
                    }
                } elseif ($datos->field == 'ajuste') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['ajuste_condicion1'] = array('ajuste' => $datos->data->value, 'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['ajuste_condicion2'] = array('ajuste' => $datos->data->value, 'condicion' => "<");
                    } else {
                        $parametros ['ajuste_condicion3'] = array('ajuste' => $datos->data->value, 'condicion' => "=");
                    }
                } elseif ($datos->field == 'importeajustado') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['importeajustado_condicion1'] = array('importeajustado' => $datos->data->value, 'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['importeajustado_condicion2'] = array('importeajustado' => $datos->data->value, 'condicion' => "<");
                    } else {
                        $parametros ['importeajustado_condicion3'] = array('importeajustado' => $datos->data->value, 'condicion' => "=");
                    }
                } elseif ($datos->field == 'importefinal') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['importefinal_condicion1'] = array('importefinal' => $datos->data->value, 'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['importefinal_condicion2'] = array('importefinal' => $datos->data->value, 'condicion' => "<");
                    } else {
                        $parametros ['importefinal_condicion3'] = array('importefinal' => $datos->data->value, 'condicion' => "=");
                    }
                } elseif ($datos->field == 'cantidadfinal') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['cantidadfinal_condicion1'] = array('cantidadfinal' => $datos->data->value, 'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['cantidadfinal_condicion2'] = array('cantidadfinal' => $datos->data->value, 'condicion' => "<");
                    } else {
                        $parametros ['cantidadfinal_condicion3'] = array('cantidadfinal' => $datos->data->value, 'condicion' => "=");
                    }
                } elseif ($datos->field == 'importe') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['importe_condicion1'] = array('importe' => $datos->data->value, 'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['importe_condicion2'] = array('importe' => $datos->data->value, 'condicion' => "<");
                    } else {
                        $parametros ['importe_condicion3'] = array('importe' => $datos->data->value, 'condicion' => "=");
                    }
                } elseif ($datos->field == 'preciodivisa') {
                    if ($datos->data->comparison == "gt") {
                        $parametros ['preciodivisa1'] = array('preciodivisa' => $datos->data->value, 'condicion' => ">");
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros ['preciodivisa2'] = array('preciodivisa' => $datos->data->value, 'condicion' => "<");
                    } else {
                        $parametros ['preciodivisa3'] = array('preciodivisa' => $datos->data->value, 'condicion' => "=");
                    }
                } elseif ($datos->field == 'generadobasesplan') {
                    $parametros ['generadobasesplan'] = $datos->data->value;
                } elseif ($datos->field == 'idaprobaciondemanda') {
                    if ($datos->data->value[0] == "Si" || $datos->data->value[0] == "Sí") {
                        $parametros ['idaprobaciondemanda'] = 3;
                    } elseif ($datos->data->value[0] == "No") {
                        $parametros ['idaprobaciondemanda'] = 1;
                    } elseif ($datos->data->value[0] == "Rector") {
                        $parametros ['idaprobaciondemanda'] = 4;
                    } elseif ($datos->data->value[0] == "Ajuste") {
                        $parametros ['idaprobaciondemanda'] = 5;
                    }
                } elseif ($datos->field == 'umedida') {
                    $parametros ['idumedida'] = $datos->data->value;
                } elseif ($datos->field == 'viaadquisicion') {
                    $parametros ['viaadquisicion'] = $datos->data->value;
                } elseif ($datos->field == 'organosatisface') {
                    $parametros ['organosatisface'] = $datos->data->value;
                } else {

                    foreach ($x->ar_select as $field) {
                        $pos = strripos($field, ' as ');
                        $inicio = $pos + 4;

                        $lenght = (strlen($field)) - ($pos + 4);
                        $cadena = substr($field, $inicio, $lenght);

                        if ($datos->field == $cadena) {
                            $pos = strripos($cadena, '_');
                            $denomCampo = substr($cadena, $pos + 1, (strlen($cadena)) - ($pos + 1));
                            break;
                        }
                    }
                    if ($datos->field) {
                        $pos = strripos($datos->field, '_');
                        $denomCampo = substr($datos->field, $pos + 1, (strlen($datos->field)) - ($pos + 1));
                        $filtroDin [$contAux]['campo'] = $denomCampo;
                        $filtroDin [$contAux]['value'] = $datos->data->value;
                        if ($datos->data->type == 'string') {
                            //es un nomenclador
                            if (is_numeric($datos->data->value)) {
                                $filtroDin [$contAux]['tipo'] = "nomenclador";
                            } else {
                                //es una cadena
                                $filtroDin [$contAux]['tipo'] = "cadena";
                            }
                        } else {
                            //es un numero
                            if ($datos->data->type == 'numeric') {
                                $filtroDin [$contAux]['tipo'] = "numero";
                                if ($datos->data->comparison == "gt") {
                                    $filtroDin [$contAux]['operador'] = "mayor";
                                } elseif ($datos->data->comparison == "lt") {
                                    $filtroDin [$contAux]['operador'] = "menor";
                                } else {
                                    $filtroDin [$contAux]['operador'] = "igual";
                                }
                            } else {
                                //es una fecha
                                if ($datos->data->type == 'date') {
                                    $filtroDin [$contAux]['tipo'] = "fecha";
                                    $fecha = explode('/', $datos->data->value);
                                    $fecha = $fecha[1] . '/' . $fecha[0] . '/' . $fecha[2];
                                    $filtroDin [$contAux]['value'] = $fecha;

                                    if ($datos->data->comparison == "gt") {
                                        $filtroDin [$contAux]['operador'] = "mayor";
                                    } elseif ($datos->data->comparison == "lt") {
                                        $filtroDin [$contAux]['operador'] = "menor";
                                    } else {
                                        $filtroDin [$contAux]['operador'] = "igual";
                                    }
                                }
                            }
                        }
                        $contAux++;
                    }
                }
            }
        }
        $result->parametros = $parametros;
        $result->filtroDin = $filtroDin;
        return $result;
    }

    public function listarPlanReporteOACE() {
        $result = DatModelo::listarPlanesConTipoModeloColNumerica();
        return $result;
    }

}
