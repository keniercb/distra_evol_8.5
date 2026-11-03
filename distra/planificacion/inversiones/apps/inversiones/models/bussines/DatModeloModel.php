<?php

class DatModeloModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function InsertarModeloAsociar(DatModelo $modelo)
    {
        $model = DatModelo::getModeloPorEntidad($modelo->identidad, $modelo->idpadre);
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
     *     idmodelo    El identificador del modelo que se va a adicionar, si este id viene vacio es que el modelo se va a insertar
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
        $idmodelo, $denominacion, $descripcion, $fechaentrega, $version, $idplan, $idtipomodelo, $identidad, $rectora,
        $clasifmodelo, $clasifmodmatpre, $denomsRutas, $idejercicio, $ir_a_balancematerial
    ) {
        $idsnoms = explode('+', $clasifmodelo);

        $modelo = new DatModelo();
        //Crear los atributos de tipo modelo
        if ($idmodelo) { //si entra aqui es que modifica sino es que inserta
            $modelo = Doctrine::getTable('DatModelo')->find($idmodelo);
        } else {
            $modelo = new DatModelo();
            $modelo->identidad = $identidad;
            $modelo->version = $version;
            $modelo->idplan = $idplan;
            $modelo->idtipomodelo = $idtipomodelo;            
            }
        //seteo par�metros
        $modelo->denominacion = $denominacion;
        $modelo->fechaentrega = $fechaentrega;
        $modelo->descripcion = $descripcion;
        $modelo->balance = $ir_a_balancematerial;


        if ($clasifmodelo) {
            $modelo->uriruta = $clasifmodelo . '*' . $denomsRutas;
        }

        $modelo->save();
       

        DatModelodatosnomenclador::eliminar($modelo->idmodelo);
         
        for ($i = 0; $i < count($idsnoms) - 1; $i++) {
            $nom = explode('-', $idsnoms[$i]);
            $nom = $nom[0];
            /*ELIMINAR ASOCIACIONES*/

            DatModelodatosnomenclador::Insertar($nom, $modelo->idmodelo);
        }


        if (!$idmodelo) {
            $entidadeshijas = $this->integrator->metadatos->buscarArbolHijosEstructuras(array($identidad));
            $mientidad = array();
            $mientidad['idestructura'] = $identidad;
            array_push($entidadeshijas, $mientidad);
            $entidadmodelo = new Doctrine_Collection('DatEntidadmodelo');
            foreach ($entidadeshijas as $key => $e) {
                ($e['idestructura']) ? $max = DatEntidadmodelo::ultimaPrioridad($e['idestructura'])
                    : $max = DatEntidadmodelo::ultimaPrioridad($e['idestructura']);

                $identidad = $e['idestructura'];
                $entidadmodelo[$key]->identidad = $identidad;
                $entidadmodelo[$key]->idmodelo = $modelo->idmodelo;
                $entidadmodelo[$key]->prioridad = $max[0]['MAX'] + 1;
            }
            $entidadmodelo->save();
        }
        $id = $modelo->idmodelo;
        return $id;
    }

    public function Actualizar(DatModelo $DatModelo)
    {
        $DatModelo->save();
    }

    /**
     * @function
     *  Eliminar
     *  Elimina los indicadores que tiene planificado el modelo y despues elimina el modelo
     *
     * @params
     *  idmodelo    El modelo que se va a eliminar
     *
     * @return
     * */
    public function Eliminar($identidadmodelo, $idmodelo, $identidadL)
    {

        //obtiene todos los indicadores que estan en un modelo especifico
        $indicadores = DatModelo::obtenerTodosIndPlanificadosEnModelo($identidadmodelo);
        if ($indicadores[0] != null) {
            foreach ($indicadores as $key => $ind) {
                $indExistente = DatModelo::dameIndPlanificadoEnModelo($identidadmodelo, $ind['idindicador']);
                DatModeloModel::eliminarIndmodPlan($indExistente->idplanificacion, $identidadL);
            }
        }

        $entidad = DatEntidadmodelo::listarEntMod($idmodelo);
        foreach ($entidad as $key => $ent) {
            $modelo = new DatEntidadmodelo();
            $modelo = Doctrine::getTable('DatEntidadmodelo')->find($ent['identidadmodelo']);
            $prioridad = $modelo->prioridad;
            $update = DatEntidadmodelo::prioridadMayorQue($modelo->identidad, $prioridad);
            //print_r($update);die;
            foreach ($update as $k => $v) {
                $actualizar = Doctrine::getTable('DatEntidadmodelo')->find($v['identidadmodelo']);
                $actualizar->prioridad = $actualizar->prioridad - 1;
                $actualizar->save();
            }
            $modelo->delete();

        }
        $enmodelo = DatEntidadmodelo::enModelo($idmodelo);
        if ($enmodelo == 0) {
            $modactiv = new DatActividadmodelo();
            $modactiv = Doctrine::getTable('DatActividadmodelo')->find($ent['idmodelo']);
            if ($modactiv) {
                $modactiv->delete();
            }
            $mod = Doctrine::getTable('DatModelo')->find($idmodelo);

            $mod->delete();
        } else {

        }
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
    public function CargarModeloDeIgualTipo($idmodelo)
    {
        $idtipomodelo = DatModelo::getTipoModeloDadoIdModelo($idmodelo);
        //Obtener idmodelo y denominacion de todos los modelos con igusl tipo al recibido
        $idmodelodenominacion = DatModelo::ObtenerModelosDeUnTipo($idtipomodelo);
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
    public function importarFuenteDatos($modelofuente, $modelodestino, $validar)
    {
        //Capturo una instancia de Doctrine_Manager para manejar la conexion
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();
        //si el modelo fuente tiene elementos a importar
        if (DatModelo::contarIndPlanificadosEnModelo($modelofuente->idmodelo)) {
            //Si tiene elementos y hay que validar valido
            if (DatModelo::contarIndPlanificadosEnModelo($modelodestino->idmodelo) && $validar) {
                //Muestra alerta que el modelo destino tiene elementos
                echo json_encode(array('codMsg' => 21));
                return;
            } else { //Si no hay que validar o el usuario confirma la importacion, comienza el proceso
                //Cargo los indicadores planificados
                $indFuentes = DatModelo::obtenerTodosIndPlanificadosEnModelo($modelofuente->idmodelo);
                //Capturo una instancia el AR para manejar los metas
                $ar = new ActiveRecordFactory();
                $ciar = $ar->Factory();
                //Capturo una instancia de metadatos
                $meta = ZendExt_Metadata::getInstance();
                //Busco los campos de la tabla para el trabajo con los meta
                $campos = $meta->Attribute()->cargarCampos($modelodestino->NomTipomodelo->idtabla);
                //Por cada indicador planificado en el modelo fuente
                foreach ($indFuentes as $key => $ind) {
                    //Busco si el indicador planificado en la fuenta ya esta en el destino
                    $indExistente = DatModelo::dameIndPlanificadoEnModelo($modelodestino->idmodelo, $ind->idindicador);
                    //Si esta procedo a su eliminacion para crearlo nuevo
                    if ($indExistente) {
                        //Elimino del metadatos lo correspondiente a la tupla del modelo
                        $ciar->delete(
                            'mod_planificacionmeta.nom_' . $modelodestino->NomTipomodelo->idtipomodelo,
                            array('idplanificacion' => $indExistente->idplanificacion)
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
                    $ciar->from('mod_planificacionmeta.nom_' . $modelodestino->NomTipomodelo->idtipomodelo);
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
                    $ciar->insert('mod_planificacionmeta.nom_' . $modelodestino->NomTipomodelo->idtipomodelo, $data);
                }
                //Si llega aqui es porque se ejecuto la importacion satisfactoriamente.
                echo json_encode(array('codMsg' => 1));
            }
        } else //Si se ejecuta es que el modelo fuente no tiene elementos planificados.
        {
            echo json_encode(array('codMsg' => 3));
        }
    }

    /**
     * @function
     *  eliminarIndmodPlan
     *  para eliminar un indicador de un modelo planificado
     *
     * @params
     *  $idplanificacion    id del elemento planificado en el modelo, en este caso de la tabla dat_planificacion
     *
     * @return
     *  1 Se ha eliminado satisfactoriamente el elemento
     * */
    public function eliminarIndmodPlan($idplanificacion, $identidad,$idindicadores,$identidadmodelo,$idejercicio)
    {
        //Capturo una instancia el AR para manejar los metas

        if ($identidad == null) {
            $identidad = $this->global->Estructura->idestructura;
        }

        //Busco el elemento planificado en el modelo tabla dat planificacion
        $tipomod = DatModelo::dameindmodeloplanif($idplanificacion);
        
        $indPlanificado = Doctrine::getTable('DatPlanificacion')->find($idplanificacion);
        //Busco el modelo del cual voy a eliminar y obtengo lo que necesito como el idtipomodelo
        //Elimino el meta del elemento planificado
        $contIndDatPLanif= DatPlanificacion::damecantInd($idindicadores,$identidadmodelo,$idejercicio);
        
    ////pregunto si la cantidad de veces que se repite en dat_planificacion es 1 y de ser asi lo elimino en Odcte
  
        if($contIndDatPLanif==1){
          $indOdcte = DatOdcte::deleteInd($idindicadores);
        }

        if ($arrayindicadores) {
            $idindicador = $arrayindicadores[0]['idindicador'];
            $identidadmodelo = $arrayindicadores[0]['identidadmodelo'];
            $serepiten = DatPlanificacion::SeRepiten($idindicador, $identidadmodelo);
        }


        //Elimino la base del elemento en el modelo
        $indPlanificado->delete();
        
        //Retorno que se ha eliminado satisfactoriamente
        return 1;
    }

    public function aprobarDesaprobar($idplanificacion, $aprobado, $identidad)
    {

        DatPlanificacionModel::aprobarDesaprobar($idplanificacion, $aprobado, $identidad);
    }

    public function servicioBp($idtipomodelo)
    {
        $this->_meta = ZendExt_Metadata::getInstance();
        $tm = Doctrine::getTable('NomTipomodelo')->find($idtipomodelo);
        $editors = $this->_meta->Metadata()->obtenerConfigFormulario($tm->idtabla);
        foreach ($editors->items as $e) {
            if ($e['xtype'] == 'combo') {
                $id = NomTiponomenclador::buscarpordenom($e['fieldLabel']);
               
                if ($id) {
                    $array['idtiponomenclador'][] = $id[0]['idtiponomenclador'];
                }
            }
        }
        $array['idtabla'] = $tm->idtabla;
        return $array;
    }


    public function aprobarDesaprobarFamilia($params)
    {         
        $apdesp = DatModelo::aprobarDesaprobarFamilia($params);
        $dat->codMsgAD = 1;
        return $dat;
    }
        public function aprobarDesaprobarAjusteFamilia($params) {
        $dat = DatModelo::aprobarDesaprobarAjusteFamilia($params);
        return $dat;
    }

    public function aprobarDesaprobarTodosFamilia($identidad, $idmodelo, $aprobado, $rectora, $security, $idejercicio)
    {
        //Buscar hijas
        $arryhijos = DatEntidadmodeloModel::Entidades_hijas($identidad, $security);
        array_push($arryhijos, $identidad); //print_r($arryhijos);die;
        $identmod = DatEntidadmodelo::obtenerIdEtidadModlo($idmodelo, $arryhijos);
        foreach ($identmod as $key => $em) {
            $identidadmodelo[] = $em['identidadmodelo'];
        }
        //print_r($identidadmodelo);die;
        $apdesp = DatModelo::aprobarDesaprobarTodosFamilia($identidadmodelo, $aprobado, $rectora, $idejercicio);
        $dat->codMsgM = 1;
        return $dat;
    }
    
        public function aprobarDesaprobarAjusteTodosFamilia($params)
    {
        //Buscar hijas
        $arryhijos = DatEntidadmodeloModel::Entidades_hijas($params['identidad'], $params['security']);
        array_push($arryhijos, $params['identidad']); //print_r($arryhijos);die;
        $identmod = DatEntidadmodelo::obtenerIdEtidadModlo($params['idmodelo'], $arryhijos);
        foreach ($identmod as $key => $em) {
            $identidadmodelo[] = $em['identidadmodelo'];
        }
        $params['identidadmodelo']=$identidadmodelo;
        $dat = DatModelo::aprobarDesaprobarTodosAjusteFamilia($params);
        return $dat;
    }
	

}

