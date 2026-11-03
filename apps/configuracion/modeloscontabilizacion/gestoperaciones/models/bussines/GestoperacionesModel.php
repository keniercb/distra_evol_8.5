<?php

/**
 * @package       ERP-Operaciones contables
 * @category      Model
 * @author        Ing. Alejandro Mengana <amengana@xetid.cu>
 * @copyright (c) 2014, XETID
 */
class GestoperacionesModel extends ZendExt_Model
{
    private $_confoperacion;

    public function __construct()
    {
        $this->_confoperacion = new ConfOperacionesentidad();
        parent::ZendExt_Model();
    }
    public function GestoperacionesModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtiene las operaciones contables.
     *
     * @param array $post Arreglo con los datos enviados en la peticion
     *
     * @throws Doctrine_Exception
     * @return array Arreglo con las operaciones contables
     */
    public function load($post)
    {
//        $start = !empty($post['start']) ? $post['start'] : 0;
//        $limit = !empty($post['limit']) ? $post['limit'] : 20;
        $utf8 = array("à" => "À", "è" => "È", "ì" => "Ì", "ò" => "Ò", "ù" => "Ù", "á" => "Á", "é" => "É", "í" => "Í",
                      "ó" => "Ó", "ú" => "Ú", "â" => "Â", "ê" => "Ê", "î" => "Î", "ô" => "Ô", "û" => "Û", "ç" => "Ç");
        $data = array();
        //$paging = array();
        $estructura = $this->global->Estructura->idestructura;
        if ($post['idestructura']) {
            $estructura = $post['idestructura'];
        }
        $idsubsistema = $post['idsubsistema'];
        $conditions = array('idsubsistema' => $idsubsistema);
        $total = NomOperaciones::TotalByField('idsubsistema', $idsubsistema);

        if (isset($post['filter']) && !empty($post['filter'])) {
            $filter = $post['filter'];
            $conditions['filter'] = " AND lower(a.denominacion) ILIKE lower('%$filter%')";
            $data = NomOperaciones::GetOperacionesEntidadSubsistema($conditions, $estructura);
            /* Colocando un highlight al filtro */
            if (count($data)) {
                foreach ($data as &$operacion) {
                    $operacion['denominacion'] = str_replace(
                        $filter, "<span style=\"background-color: rgb(255, 255, 0);\">" . $filter . "</span>",
                        $operacion['denominacion']
                    );
                }
            }
        } else {
            $data = NomOperaciones::GetOperacionesEntidadSubsistema($conditions, $estructura);
        }
        $paging = array(
            'success' => true,
            'total'   => $total,
            'data'    => $data
        );
        return $paging;
    }

    /**
     * Adiciona la operación contable de una entidad logueada.
     * Modifica la operación contable de una entidad logueada.
     *
     * @param array $post     Arreglo con los datos de las operaciones
     * @param array $response Arreglo con los errores si hubieron
     *
     * @throws Doctrine_Exception
     * @return array Arreglo que almacena si hubo error o si fue
     * satisfactoria la acción
     */
    public function add($post, &$response)
    {
        /*
         *  En esta condición no se verificar el idmodelo porque
         * puede ser vacío
         */
        if (!empty($post['denominacion']) && !empty($post['iddoc']) && !empty($post['idsubsistema'])) {
            $flagmodify = false;
            $alreadyExist = false;

            /* Si se esta modificando */
            if (!empty($post['idnomoperaciones']) && is_numeric($post['idnomoperaciones'])) {
                $nomOperacion = Doctrine_Core::getTable('NomOperaciones')->find($post['idnomoperaciones']);

                /* Condición necesaria para saber si se esta heredando la operación contable
                 * la estructura común debe ser diferente a la propietaria para que se herede
                 * si son iguales no se esta heredando la operación.
                 */
                if (empty($post['idoperacionesentidad'])) {
                    //Se está heredando
                    $datoperacionEnt = new DatOperacionesentidad();
                } else {
                    $datoperacionEnt = Doctrine_Core::getTable('DatOperacionesentidad')->find(
                        $post['idoperacionesentidad']
                    );
                }
                $flagmodify = true;
            } else {
                /* Se está adicionando */
                $nomOperacion = new NomOperaciones();
                $datoperacionEnt = new DatOperacionesentidad();
            }

            $estructura = empty($post['idestructuracomun'])
                ? $this->global->Estructura->idestructura
                :
                $post['idestructuracomun'];
            if ($post['idestructura']) {
                $estructura = $post['idestructura'];
            }
            $conditions[] = "denominacion = ? AND idsubsistema = ? AND idestructuracomun = ?";
            $params = array($post['denominacion'], $post['idsubsistema'],
                            ($flagmodify) ? $post['estructurapropietaria'] : $estructura);

            if ($flagmodify) {
                $conditions[] = 'idnomoperaciones!=?';
                $params[] = $post['idnomoperaciones'];
            }

            $check = NomOperaciones::GetByCondition(implode(' AND ', $conditions), $params, true);
            $alreadyExist = count($check) > 0;

            if (!$alreadyExist) {
                //Datos del nomenclador de operaciones NomOperaciones
                $nomOperacion->denominacion = $post['denominacion'];
                $nomOperacion->idestructuracomun = ($flagmodify) ? $post['estructurapropietaria'] : $estructura;
                $nomOperacion->idsubsistema = $post['idsubsistema'];

                $operacion = $nomOperacion->persist();

                if (!is_numeric($operacion->idnomoperaciones)) {
                    /* Ocurrió un error al insertar la operación contable X */
                    $response['errors'][] = array('code' => 3, 'denominacion' => $post['denominacion']);
                } else {
                    //Datos de la tabla DatOperacionesentidad
                    $datoperacionEnt->idestructuracomun = $estructura;
                    $datoperacionEnt->idnomoperaciones = $operacion->idnomoperaciones;
                    $datoperacionEnt->idmodelo = (empty($post['idmodelo'])) ? null : $post['idmodelo'];
                    $datoperacionEnt->signo = (empty($post['signo'])) ? null : $post['signo'];
                    $datoperacionEnt->iddoc = $post['iddoc'];

                    $operacioEnt = $datoperacionEnt->persist();

                    if (!is_numeric($operacioEnt->idoperacionesentidad)) {
                        /* Ocurrió un error al insertar la operación contable X */
                        $response['errors'][] = array('code' => 3, 'denominacion' => $post['denominacion']);
                    } else {
                        /* La operación contable se salvó satisfactoriamente */
                        $response['success'][] = $operacion->idnomoperaciones;
                    }
                }
            } else {
                /* Ya existe la operación contable que se está adicionando */
                $response['errors'][] = array('code' => 2, 'denominacion' => $post['denominacion']);
            }
        } else {
            /* Faltan datos para adicionar la operación contable */
            $response['errors'][] = array('code' => 1);
        }
        return $response;
    }

    /**
     * Adiciona las operaciones contables de la entidad logueada.
     * Modifica las operaciones contables y asocia la operación a una entidad que la hereda
     * en caso que no sea la que la adicione, la entidad que adicione la operación es por default la propietaria.
     *
     * @param array $request Arreglo con los datos enviados en la peticion
     *
     * @throws Doctrine_Exception
     * @return array Arreglo que almacena si hubo error o si fue
     * satisfactoria la acción
     */
    public function addmodOperacion($request)
    {
        //Si el arreglo de errors tiene valores es que ha habido
        //errores en el proceso
        $response = array('errors' => array(), 'success' => array());
        $operaciones = json_decode(stripcslashes($request['operaciones']), true);

        foreach ($operaciones as $operacion) {
            $this->add($operacion, $response);
        }

        return $response;
    }

    /**
     * Eliminar una o varias Operaciones.
     *
     * @param array $post Arreglo con los datos enviados en la peticion
     *                    (almacena los ids de las operaciones a eliminar en el índice 'ids')
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con la respuesta del servidor
     */
    public function delete($post)
    {
        //Si el arreglo de errors tiene valores es que ha habido
        //errores en el proceso
        $estructura = $this->global->Estructura->idestructura;
        if ($post['idestructura']) {
            $estructura = $post['idestructura'];
        }
        $response = array('errors' => array(), 'success' => array());

        if (!empty($post['ids'])) {

            $ids = json_decode(stripslashes($post['ids']), true);
            foreach ($ids as $idoperacion) {
                //La entidad logueada es la propietaria de la operación
                if ($idoperacion['estructurapropietaria'] == $estructura) {
                    $conditions = 'idnomoperaciones = ? AND idestructuracomun <> ?';
                    $params = array($idoperacion['idnomoperaciones'], $estructura);
                    $uso = DatOperacionesentidad::GetByCondition($conditions, $params, true);

                    //Está en uso la operación contable en una entidad diferente a la logueada
                    if (count($uso) > 0) {
                        $conditions1 = 'idnomoperaciones = ? AND idestructuracomun = ?';
                        $params1 = array($idoperacion['idnomoperaciones'], $estructura);
                        $referencia = DatOperacionesentidad::GetByCondition($conditions1, $params1, true);

                        //Hay referencia de la entidad logueada en DatOperacionesentidad
                        //Pues se elimina esta referencia y se le muestra al usuario un mensaje
                        if (count($referencia) > 0) {
                            $delcondition = 'idnomoperaciones = ? AND idestructuracomun = ?';
                            $delparams = array($idoperacion['idnomoperaciones'], $estructura);
                            $delrefoperacion = DatOperacionesentidad::EraseByCondition($delcondition, $delparams);
                            if (!$delrefoperacion) {
                                //Ha ocurrido un error al eliminar la referencia de la operación contable
                                //No se pudo eliminar la operación contable
                                //No se pudo desasociar la operación contable para esta entidad
                                $response['errors'][] = array('code'         => 5, 'reload' => 1,
                                                              'denominacion' => $idoperacion['denominacion']);
                            } else {
                                //La operación contable no ha podido ser eliminada,
                                //pues está en uso por otra entidad, pero ha sido desasociada de la entidad logueada.
                                $response['errors'][] = array('code'         => 6, 'reload' => 1,
                                                              'denominacion' => $idoperacion['denominacion']);
                            }
                        }
                        //No hay referencia de la entidad logueada en DatOperacionesentidad
                        //Pues se le muestra al usuario un mensaje nada más
                        else {
                            //La operación contable no ha podido ser eliminada,
                            //pues está en uso por otra entidad. Está desasociada a la entidad logueada.
                            $response['errors'][] = array('code'         => 7, 'reload' => 1,
                                                          'denominacion' => $idoperacion['denominacion']);
                        }
                    }
                    //Si no está en uso la operación contable en una entidad diferente a la logueada
                    //Se elimina la referencia de la operación de las dos tablas, para la entidad logueada
                    else {
                        $delcondition1 = 'idnomoperaciones = ? AND idestructuracomun = ?';
                        $delparams1 = array($idoperacion['idnomoperaciones'], $estructura);
                        $delrefoperacionent = DatOperacionesentidad::EraseByCondition($delcondition1, $delparams1);
                        if (!$delrefoperacionent) {
                            //Ha ocurrido un error al eliminar la referencia de la operación contable
                            //No se ha podido desasociar la operación contable para esta entidad
                            $response['errors'][] = array('code'         => 8, 'reload' => 1,
                                                          'denominacion' => $idoperacion['denominacion']);
                        } else {
                            //Se pudo eliminar la referencia de la operación contable en DatOperacionesentidad
                            //Por tanto se procede a eliminar la operación contable
                            $deloperacioncont = NomOperaciones::Erase($idoperacion['idnomoperaciones']);
                            if (!$deloperacioncont) {
                                //Ha ocurrido un error al eliminar la operación contable
                                $response['errors'][] = array('code'         => 9, 'reload' => 1,
                                                              'denominacion' => $idoperacion['denominacion']);
                            } else {
                                //La operación contable se ha eliminado satisfactoriamente
                                $response['success'][] = $idoperacion['idnomoperaciones'];
                            }
                        }
                    }
                } //La entidad logueada no es la propietaria de la operación
                else {
                    //Verificar si existe la referencia de la operación en DatOperacionesentidad
                    //para la entidad logueada
                    $conditions2 = 'idnomoperaciones = ? AND idestructuracomun = ?';
                    $params2 = array($idoperacion['idnomoperaciones'], $estructura);
                    $referencia2 = DatOperacionesentidad::GetByCondition($conditions2, $params2, true);

                    //Existe la referencia de la operación en DatOperacionesentidad para la entidad logueada
                    //Se elimina la referencia en DatOperacionesentidad
                    //No se pudo eliminar la operación contable, pues no ha sido creada por la entidad logueada. Fue desasociada de la entidad.
                    if (count($referencia2) > 0) {
                        $delcondition2 = 'idnomoperaciones = ? AND idestructuracomun = ?';
                        $delparams2 = array($idoperacion['idnomoperaciones'], $estructura);
                        $delrefoperacionent2 = DatOperacionesentidad::EraseByCondition($delcondition2, $delparams2);

                        if (!$delrefoperacionent2) {
                            //Ha ocurrido un error al eliminar la referencia en DatOperacionesentidad
                            //Ha ocurrido un error al desasociar la operación contable para la entidad.
                            $response['errors'][] = array('code'         => 10, 'reload' => 1,
                                                          'denominacion' => $idoperacion['denominacion']);
                        } else {
                            //Se eliminó la referencia satisfactoriamente
                            //No se pudo eliminar la operación contable, pues no ha sido creada por la entidad logueada.
                            //Se desasoció la operación contable para la entidad satisfactoriamente.
                            $response['errors'][] = array('code'         => 11, 'reload' => 1,
                                                          'denominacion' => $idoperacion['denominacion']);
                        }
                    }
                    //No existe la referencia con la tabla DatOperacionesentidad
                    //para la operación en la entidad logueada
                    else {
                        //No se pudo eliminar la operación contable, pues no ha sido creada por la entidad logueada.
                        //Está desasociada de la entidad logueada.
                        $response['errors'][] = array('code'         => 12, 'reload' => 1,
                                                      'denominacion' => $idoperacion['denominacion']);
                    }
                }
            }
        } else {
            //No hay datos para eliminar la o las operaciones contables
            $response['errors'][] = array('code' => 4, 'reload' => 1);
        }
        return $response;
    }

    /**
     * Obtiene los subsistemas de la entidad comun que contabilizan.
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con los subsistemas
     */
    public function cargarsubsistemas($post)
    {
        $idestructura = $this->global->Estructura->idestructura;
        if ($post['idestructura']) {
            $idestructura = $post['idestructura'];
        }
        $subsistemas = $this->integrator->datosmaestros->buscarSubsistemasEstructuraContabilizan($idestructura);
        return $subsistemas;
    }

    /**
     * Obtiene los modelos de contabilización y los documentos primarios
     * por estructura y el idsubsistema
     *
     * @param array $request Arreglo con los datos enviados en la peticion
     *                       (almacena el idsubsistema del cual se quiere obtener los modelos y documentos)
     *
     * @throws Doctrine_Exception
     * @return array Arreglo con la respuesta del servidor
     */
    public function cargarModelsAndDoc($request)
    {
        $idsubsistema = $request['idsubsistema'];
        $estructura = $this->global->Estructura->idestructura;
        if ($request['idestructura']) {
            $estructura = $request['idestructura'];
        }
        //$condition = "idsubsistema = ? ";
        $condition = "idsubsistema = ? AND idestructuracomun = ?";
        //$params = array($idsubsistema);
        $params = array($idsubsistema, $estructura);
        $modelos = NomModelosContabilizacion::GetByCondition($condition, $params, true);
        $signos = NomConceptoOperacion::GetAll();

        $documentos = $this->integrator->datosmaestros->documentosPorSubsistemaEntidad(
            $idsubsistema, $estructura, array()
        );

        return array('modelos'    => array('data' => $modelos, 'total' => count($modelos)),
                     'documentos' => array('data' => $documentos, 'total' => count($documentos)),
                     'signos'     => array('data' => $signos, 'total' => count($signos)));
    }

    /**
     * Obtiene los signos para las operaciones contables.
     *
     * @throws Doctrine_Exception
     * @return array Arreglo con las operaciones contables
     */
    public function loadSigns()
    {
        $data = NomConceptoOperacion::GetAll();

        $paging = array(
            'success' => true,
            'total'   => count($data),
            'data'    => $data
        );

        return $paging;
    }

    public function GetBySqlQuery(
        $idestructura, $idsubsistema = null, $iddocumento = null, $idoperacion = null, $start = null, $limit = null,
        $filtros = array()
    ) {
        $result = NomOperaciones::GetBySqlQuery(
            $idestructura, $idsubsistema, $iddocumento, $idoperacion, $start, $limit, $filtros
        );
        if ($start && $limit || $limit != 0) {
            $cant = NomOperaciones::CountBySqlQuery(
                $idestructura, $idsubsistema, $iddocumento, $idoperacion, $start, $limit, $filtros
            );
            return array('cant' => $cant, 'data' => $result);
        }
        return $result;


    }

    /**
     * devuelve el dql pasado por parametros unido con la tabla nom_operaiones
     *
     * @param Doctrine_Query $dql   consulta en dql
     * @param string         $asExt alias de la tabla que se une con nom_operaiones
     * @param string         $asLoc alias de la tabla nom_operaiones
     * @param numeric        $join  Si se unen las tablas con innerjoin o leftjoin
     *
     * @return Doctrine_Query
     */
    public function addQueryJoinOperacion($dql, $asExt, $asLoc = 'no', $join = 1)
    {
        if ($join == 1) {
            $dql->innerJoin("{$asExt}.NomOperaciones {$asLoc}");
        } else {
            $dql->leftJoin("{$asExt}.NomOperaciones {$asLoc}");
        }
        return $dql;
    }

    /**
     * devuelve el dql pasado por parametros unido con la tabla nom_operaiones
     *
     * @param Doctrine_Query $dql   consulta en dql
     * @param string         $asLoc alias de la tabla nom_operaiones
     *
     * @return Doctrine_Query
     */
    public function addQuerySelectOperacion($dql, $asLoc = 'no')
    {
        $dql->addSelect(
            "$asLoc.idnomoperaciones AS idoperacion, $asLoc.denominacion AS denominacion, $asLoc.codigooperacion AS codigooperacion"
        );
        return $dql;
    }

    /**
     * Guarda las operaciones configuradas para la entidad actual como una plantilla
     * para ser usados posteriormente por otra entidad
     *
     * @param array $request Arreglo con los datos que vienen por post
     *
     * @return mixed Arreglo con los datos de errores o si todo fue satisfactorio.
     */
    public function crearPlantilla($request)
    {
        try {
            $instance = Doctrine_Manager::getInstance();
            $conexion = $instance->getCurrentConnection();
            $request['conexion'] = $conexion;
            $result = $this->integrator->datosmaestros->insertarPlantilla($request);
            $idestructura = $this->global->Estructura->idestructura;
            if ($request['idestructura']) {
                $idestructura = $request['idestructura'];
            }
            $conditions[] = 'idestructuracomun=?';
            $params[] = $idestructura;
            if ($request['subsistemas']) {
                $subsistemas = json_decode($request['subsistemas']);
                $conditions[] = 'idsubsistema in (' . implode(',', $subsistemas) . ')';
            }
            $operaciones = DatOperacionesentidad::GetByCondition(implode(' AND ',$conditions), $params, true);
            if ($result['id']) {
                foreach ($operaciones as $row) {
                    $conf = new ConfOperacionesentidad();
                    $conf->idnomoperaciones = $row['idnomoperaciones'];
                    $conf->iddoc = $row['iddoc'];
                    $conf->signo = $row['signo'];
                    $conf->idplantilla = $result['id'];
                    $conf->save();
                }
            }
            return array('code' => 1, 'msg' => '');
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtiene la información de una platilla determinada y la inserta para la entidad
     * actual
     *
     * @param array $request Arreglo con los datos que vienen por post
     *
     * @return mixed Arreglo con los datos de errores o si todo fue satisfactorio.
     */
    public function usarPlantilla($request)
    {
        try {
            $idplantilla = $request['idplantilla'];
            $idestructura = $this->global->Estructura->idestructura;
            if ($request['idestructura']) {
                $idestructura = $request['idestructura'];
            }
            $operaciones = $this->_confoperacion->getOperaciones($idplantilla);
            if (count($operaciones)) {
                DatOperacionesentidad::EraseByCondition('idestructuracomun=?', array($idestructura));
            }
            foreach ($operaciones as $row) {
                $instance = new DatOperacionesentidad();
                $instance->idestructuracomun = $idestructura;
                $instance->idnomoperaciones = $row['idnomoperaciones'];
                $instance->iddoc = $row['iddoc'];
                $instance->signo = $row['signo'];
                $instance->save();
            }

            return array('code' => 1, 'msg' => '');
        } catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage());
        }
    }

    /**
     * Lista las plantillas creadas para este componente
     *
     * @param array $request Arreglo con los datos que vienen por post
     *
     * @return mixed Arreglo con las plantillas disponibles
     */
    public function listarPlantillas($request)
    {
        return $this->integrator->datosmaestros->listarPlantillas($request);
    }
}
