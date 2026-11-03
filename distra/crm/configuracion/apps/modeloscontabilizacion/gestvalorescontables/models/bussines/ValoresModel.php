<?php

/**
 * @package       ERP-Modelos de contabilizacion
 * @category      Model
 * @author        Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @author        Ing. Alejandro Megana <amengana@xetid.cu>
 * @copyright (c) 2014, XETID
 */
class ValoresModel extends ZendExt_Model
{

    public function ValoresModel()
    {
        parent::ZendExt_Model();
    }

    public function load($post)
    {
        if ($post['arrIds']) {
            $data = NomValoresContables::GetByIds($post['arrIds'], true);
        } else {
            $start = $post['start'];
            $limit = $post['limit'];
            $utf8 = array("à" => "À", "è" => "È", "ì" => "Ì", "ò" => "Ò",
                          "ù" => "Ù", "á" => "Á", "é" => "É", "í" => "Í",
                          "ó" => "Ó", "ú" => "Ú", "â" => "Â", "ê" => "Ê",
                          "î" => "Î", "ô" => "Ô", "û" => "Û", "ç" => "Ç");
            $estructura = $this->global->Estructura->idestructura;
            if ($post['idestructura']) {
                $estructura = $post['idestructura'];
            }
            $idsubsistema = (!empty($post['idsubsistema'])
                && is_numeric(
                    $post['idsubsistema']
                )) ? $post['idsubsistema']
                : $this->global->Subsistema->idsubsistema;

            $conditions = array("idsubsistema = ? AND idestructuracomun = ?");
            $params = array($idsubsistema, $estructura);
            //En caso de que se quieran los valores por sustitucion
            if (!empty($post['sustitucion'])) {
                array_push($conditions, "sustitucion=?");
                array_push($params, $post['sustitucion']);
            }

            if (!empty($post['filter'])) {
                $filter = $post['filter'];
                $conditions[] = "lower(nombre) ILIKE lower('%$filter%')";
                $data = NomValoresContables::GetByCondition(
                    implode(" AND ", $conditions), $params, true
                );
                $cantidad = NomValoresContables::CountByCondition(
                    implode(" AND ", $conditions), $params
                );
                /* Colocando un highlight al filtro */
                if (count($data)) {
                    foreach ($data as &$campo) {
                        $campo['nombre'] = str_replace(
                            $filter,
                            "<span style=\"background-color: rgb(255, 255, 0);\">"
                            . $filter . "</span>", $campo['nombre']
                        );
                    }
                }
            } else {
                $data = NomValoresContables::GetByCondition(
                    implode(" AND ", $conditions), $params, true, $start, $limit
                );

                $cantidad = NomValoresContables::CountByCondition(
                    implode(" AND ", $conditions), $params
                );
            }
            /*foreach ($data as $key => $val) {
                //Si el valor apunta hacia una cuenta
                if ($val['tipo'] == 3) {
                    $result = $this->cargarCuentas(
                            array('idcuenta' => $data[$key]['referencia'])
                    );
                    $data[$key]['concat'] = $result['datos'][0]->text;
                }
//                $data[$key]['checked'] = false;
            }*/
        }

        $paging = array(
            'success' => true,
            'total'   => $cantidad,
            'data'    => $data
        );
        return $paging;
    }

    /**
     * Eliminar uno o varios Valores contables.
     *
     * @param array $post Arreglo con los datos enviados en la peticion
     *                    (almacena los ids de los campos a eliminar en el índice 'ids')
     *
     * @return mixed Arreglo con la respuesta del servidor
     */
    public function delete($post)
    {
        //Si el arreglo de errors tiene valores es que ha habido errores en el proceso
        $response = array('errors' => array(), 'success' => array());
        if (!empty($post['ids'])) {
            $ids = json_decode(stripslashes($post['ids']), true);
            $total = count($ids);
            $cont = 0;
            foreach ($ids as $idvalor) {
                $valorAsiento = DatAsientosContables::GetByCondition(
                    'idvalorcontable=?', array($idvalor), true
                );
                $valorSust = DatSustituciones::GetByCondition(
                    'valor=?', array($idvalor), true
                );
                if (count($valorAsiento) == 0 && count($valorSust) == 0) {
                    $result = NomValoresContables::Erase($idvalor);
                    if (!$result) {
                        /* An error was ocurred */
                        //No se ha podido eliminar el valor contable
                        $response['code'] = 3;
                        $response['errors'][] = array('code'     => 3,
                                                      'errorcmp' => 'valores',
                                                      'id'       => $idvalor);
                    } else {
                        $response['success'][] = $idvalor;
                    }
                } else {
                    if ($total != 1) {
                        $cont++;
                        if ($cont == $total) {
                            /* All values are being used */
                            //Todos los valores estan siendo usados.
                            $response['code'] = 5;
                        } else {
                            if ($cont == 1) {
                                /* Only one value is being used */
                                //Solo un valor esta siendo usado.
                                $response['code'] = 6;
                            } else {
                                /* Not all values are being used */
                                //No todos los valores estan siendo usados.
                                $response['code'] = 7;
                            }
                        }
                    } else {
                        /* The value is being used */
                        //El valor está siendo usado.
                        $response['code'] = 4;
                    }
                    $response['errors'][] = array('code'     => 8,
                                                  'errorcmp' => 'valor',
                                                  'id'       => $idvalor);
                }
            }
        } else {
            /* No data to delete */
            //No hay campos contables a eliminar
            $response['errors'][] = array('code' => 2, 'errorcmp' => 'valores');
        }
        return $response;
    }

    /**
     * Inserta un Valor contable.
     *
     * @param array $post Arreglo con los datos del clasificador
     *
     * @return mixed Arreglo con la respuesta del servidor
     */
    public function add($post)
    {
        //Si el arreglo de errors tiene valores es que ha habido errores en el proceso
        $response = array('errors' => array(), 'success' => array());

        if (!empty($post['nombre']) && !empty($post['tipo'])
            && !empty($post['referencia'])
            && !empty($post['idsubsistema'])
        ) {

            $estructura = $this->global->Estructura->idestructura;
            if ($post['idestructura']) {
                $estructura = $post['idestructura'];
            }
            $idsubsistema = $post['idsubsistema'];

            $conditions
                = array("idsubsistema = ? AND idestructuracomun = ? AND nombre=?");
            $params = array($idsubsistema, $estructura, $post['nombre']);
            if (!empty($post['idvalorcontable'])) {
                array_push($conditions, "idvalorcontable!=?");
                array_push($params, $post['idvalorcontable']);
            }
            $result = NomValoresContables::GetByCondition(
                implode(" AND ", $conditions), $params, true
            );

            $existeNomb = (count($result) != 0) ? true : false;

            if (!$existeNomb) {
                /* Si se esta modificando */
                $objeto = (!empty($post['idvalorcontable'])
                    && is_numeric(
                        $post['idvalorcontable']
                    )) ? NomValoresContables::GetById($post['idvalorcontable'])
                    : new NomValoresContables();

                $objeto->nombre = $post['nombre'];
                $objeto->tipo = $post['tipo'];

                //Se decodifica sustitucion dado que es un boleano
                $sustitucion = json_decode($post['sustitucion']);
                //Si se está modificando un valor contable y este está siendo usado por un asiento o una
                //sustitución el atributo sustitución no puede ser modificado.
                if (!empty($post['idvalorcontable'])
                    && $objeto->sustitucion != $sustitucion
                ) {
                    $valorAsiento = DatAsientosContables::GetByCondition(
                        'idvalorcontable=?', array($post['idvalorcontable']),
                        true
                    );
                    $valorSust = DatSustituciones::GetByCondition(
                        'valor=?', array($post['idvalorcontable']), true
                    );
                    //Si al menos un asiento o una sustitucion tienen asociado un valor contable el atributo
                    //no puede ser modificado.
                    if (count($valorAsiento) != 0 || count($valorSust) != 0) {
                        $response['code'] = 6;
                        $response['errors'][] = array('code'     => 6,
                                                      'errorcmp' => 'valores',
                                                      'nombre'   => $post['nombre']);
                        return $response;
                    } else {
                        $objeto->sustitucion = $post['sustitucion'];
                    }
                } else {
                    $objeto->sustitucion = $post['sustitucion'];
                }

                $objeto->referencia = $post['referencia'];
                $objeto->idsubsistema = $idsubsistema;
                if (isset($post['ruta'])) {
                    $dir_aplicaction = Zend_Registry::get(
                        'config'
                    )->dir_aplication;
                    $ruta = str_replace($dir_aplicaction, '/', $post['ruta']);
                    $objeto->ruta = $ruta;
                } else {
                    $objeto->ruta = null;
                }


                $objeto->idestructuracomun = !empty($post['idestructuracomun'])
                    ? $post['idestructuracomun'] : $estructura;

                $idvalor = $objeto->persist();

                if (!is_numeric($idvalor)) {
                    /* Ocurrio un error al insertar el campo contable */
                    $response['code'] = 3;
                    $response['errors'][] = array('code'     => 3,
                                                  'errorcmp' => 'valores',
                                                  'nombre'   => $post['nombre']);
                } else {
                    $response['success'] = $objeto->toArray();
                }
            } else {
                /* ya existe un valor contable con este nombre */
                $response['code'] = 5;
                $response['errors'][] = array('code'     => 5,
                                              'errorcmp' => 'valores',
                                              'nombre'   => $post['nombre']);
            }
        } else {
            /* Faltan datos para adicionar el campo contable */
            $response['code'] = 2;
            $response['errors'][] = array('code' => 2, 'errorcmp' => 'valores');
        }
        return $response;
    }

    /**
     * Obtiene los subsistemas de la entidad comun que contabiliza.
     *
     * @param array $request Arreglo con los datos enviados en la peticion
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con los subsistemas
     */
    public function cargarsubsistemas($request)
    {
        $idestructura = $this->global->Estructura->idestructura;
        if ($request['idestructura']) {
            $idestructura = $request['idestructura'];
        }
        $subsistemas = array();
        if ($request['idsubsistema'] === '0') {
            $subsistemas
                = $this->integrator->datosmaestros->buscarSubsistemasEstructuraContabilizan(
                $idestructura
            );
        } else {
            $subsistemas
                = $this->integrator->datosmaestros->buscarSubsistemasEstructuraContabilizan(
                $idestructura, $request['idsubsistema']
            );
        }
        return $subsistemas;
    }

    /**
     * Obtiene los cuentas del nomenclador de la estructura comun.
     *
     * @param array $post Arreglo con los datos enviados en la peticion
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con la respuesta del servidor
     */
    public function cargarCuentas($post)
    {
        $idestructura = $this->global->Estructura->idestructura;
        if ($post['idestructura']) {
            $idestructura = $post['idestructura'];
        }
        if (!empty($post['idcuenta'])) {
            $cuentas
                = array("datos" => array($this->integrator->contabilidad->obtenerCuentaPorId(
                $post['idcuenta']
            )));
        } else {
            if ($post['node'] == 0) {
                $cuentas
                    = $this->integrator->contabilidad->obtenerClasificadorCuentas(
                    $idestructura,null,$post['filter'],false
                );
            } else {
                $cuentas
                    = $this->integrator->contabilidad->obtenerClasificadorCuentas(
                    $idestructura, $post['node'],$post['filter'],false
                );
            }
        }
        return $cuentas;
    }

    /**
     * Carga los directorios del marco de trabajo, para poder cargar una clase.
     *
     * @param array $request Arreglo con la ruta del directorio a cargar
     *
     * @return mixed Arreglo con los datos para cargar el árbol de directorios
     */
    public function cargarDir($request)
    {
        $ruta = $request['node'];
        $tipo = $request['tipo'];
        $arrtreedirectorios = array();
        $arrtreefiles = array();

        if ($ruta === '0') {
            $dir_aplication = Zend_Registry::get('config')->dir_aplication;
            $arrdirectorios = glob(
                $dir_aplication . '*', GLOB_ONLYDIR
            ); //toma la ruta de todos los directorios que hay en dir_aplication

            foreach ($arrdirectorios as $value) {
                $arrexplode = explode('/', $value);
                $cantexplode = count($arrexplode);
                $arrtreedirectorios[] = array(
                    'id'   => $value,
                    'text' => $arrexplode[$cantexplode - 1],
                    'leaf' => false
                );
            }
        } else {
            $arrdirectorios = glob(
                $ruta . '/*', GLOB_ONLYDIR
            ); //toma la ruta de todos los directorios que hay en $ruta
            //Ciclo que controla los directorios
            foreach ($arrdirectorios as $dir) {
                $explodedir = explode('/', $dir);
                $cantexplodedir = count($explodedir);

                if ($explodedir[$cantexplodedir - 1] === 'models'
                    || $explodedir[$cantexplodedir - 1] === 'controllers'
                ) {
                    if ($tipo == '1' || $tipo == '5') {
                        $clases = 'domain/';
                    } else {
                        $clases = '{bussines/,domain/}';
                    }
                    $arrphpfiles = glob(
                        $ruta . '/models/' . $clases . '*.php', GLOB_BRACE
                    );
                    foreach ($arrphpfiles as $file) {
                        $arrclasesbyfile = get_class_name_from_file(
                            $file, true
                        );
                        foreach ($arrclasesbyfile as $class) {
                            $arrtreefiles[] = array(
                                'id'   => $file,
                                'text' => $class,
                                'leaf' => true
                            );
                        }
                    }
                    break;
                } else {
                    $arrtreedirectorios[] = array(
                        'id'   => $dir,
                        'text' => $explodedir[$cantexplodedir - 1],
                        'leaf' => false
                    );
                }
            }
        }
        return (!empty($arrtreefiles)) ? $arrtreefiles : $arrtreedirectorios;
    }

    /**
     * Carga los campos de una determinada clase.
     *
     * @param array $request Arreglo con los datos enviados en la peticion
     *
     * @return mixed Arreglo con los subsistemas
     */
    public function cargarCampos($request)
    {
        $ruta = str_replace(
            Zend_Registry::get('config')->dir_aplication, '/', $request['ruta']
        );
        ClasificadoresModel::inludeDomainModel(
            Zend_Registry::get('config')->dir_aplication . $ruta
        );
        $entidad = new $request['clase']();
        $array = array_keys($entidad->getData());
        foreach ($array as $key => $value) {
            $response[$key]['denominacion'] = $value;
        }
        return $response;
    }

    /**
     * Carga los metodos de una determinada clase.
     *
     * @param array $request Arreglo con los datos enviados en la peticion
     *
     * @return mixed Arreglo con los subsistemas
     */
    public function cargarFuncionalidades($request)
    {
        $ruta = str_replace(
            Zend_Registry::get('config')->dir_aplication, '/', $request['ruta']
        );
        ClasificadoresModel::inludeDomainModel(
            Zend_Registry::get('config')->dir_aplication . $ruta
        );
        $methods = get_methods_from_file(
            Zend_Registry::get('config')->dir_aplication . $ruta
        );

        $cont = 0;
        foreach ($methods as $key => $method) {
            $result[$key]['denominacion'] = $method;
            $cont++;
        }
        return $result;
    }

    /**
     * Carga los campos y los datos necesarios para crear un grid de forma dinánica.
     *
     * @param array $request Arreglo con los datos enviados en la peticion
     *
     * @return mixed Arreglo con los campos del store y los datos a mostrar en el
     *               grid.
     */
    public function cargarConfiguracionGrid($request)
    {
        try {
            $ruta = str_replace(
                Zend_Registry::get('config')->dir_aplication, '/',
                $request['ruta']
            );
            ClasificadoresModel::inludeDomainModel(
                Zend_Registry::get('config')->dir_aplication . $ruta
            );
            $fields = array();
            $dataTable = array();
            $start = $request['start'];
            $limit = $request['limit'];
            $filter = $request['filter'];
            $entidad = Doctrine::getTable($request['clase']);
            //nombre del atributo identificador de la tabla
            $identificador = $entidad->getIdentifier();
            //arreglo con todos las columnas de la clase dominio
            $columns = $entidad->getColumns();

            if (!empty($filter)) {
                foreach ($columns as $key => $value) {
                    array_push(
                        $fields, array(
                            "id"     => $value,
                            "name"   => $key,
                            "header" => ucwords($key),
                            "hidden" => false
                        )
                    );
                    if ($key != $identificador) {
                        $conditions[]
                            = "lower(cast($key as text)) ILIKE lower('%$filter%')";
                    }
                }

                $dataTable = NomValoresContables::GetByTable(
                    $request['clase'], $identificador, true, $start, $limit
                    , implode(' OR ', $conditions)
                );
                $cantidad = NomValoresContables::CountByTable(
                    $request['clase'], implode(' OR ', $conditions)
                );
            } else {
                $dataTable = NomValoresContables::GetByTable(
                    $request['clase'], $identificador, true, $start, $limit
                );
                $cantidad = NomValoresContables::CountByTable(
                    $request['clase']
                );

                foreach ($columns as $key => $value) {
                    array_push(
                        $fields, array(
                            "id"       => $key,
                            "name"     => $key,
                            "header"   => ucwords($key),
                            "hidden"   => $key == $identificador ? true : false,
                            "hideable" => $key == $identificador ? false : true,
                        )
                    );
                }
            }

            $metadata = array(
                "totalProperty"   => "cantidad",
                "successProperty" => "success",
                "idProperty"      => $identificador,
                "fields"          => $fields,
                "root"            => "data"
            );

            return array(
                "success"  => true,
                "metaData" => $metadata,
                "data"     => $dataTable,
                "cantidad" => $cantidad
            );
        } catch (Exception $e) {
            return array('errors' => array('code' => $e->getCode(), 'message' => $e->getMessage()), 'success' => array());
        }
    }

    /**
     * Determina el start y el limit dado un identificador para cargar solamente las tuplas de ese intervalo.
     *
     * @param array $request Arreglo con los datos enviados en la peticion
     *
     * @return mixed Arreglo con los campos del store y los datos a mostrar en el
     *               grid.
     */
    public function getRange($request)
    {
        $ruta = str_replace(
            Zend_Registry::get('config')->dir_aplication, '/', $request['ruta']
        );
        ClasificadoresModel::inludeDomainModel(
            Zend_Registry::get('config')->dir_aplication . $ruta
        );

        $entidad = Doctrine::getTable($request['clase']);
        //nombre del atributo identificador de la tabla
        $identificador = $entidad->getIdentifier();

        $tabla = Doctrine::getTable($request['clase'])->getTableName();
        $cantTotal = Doctrine::getTable($request['clase'])->count();
        $row = NomValoresContables::getRow(
            $tabla, $identificador, $request['idtabla']
        );
        //print_r($row.',');
        $row = (int)$row;
        if ($row == 0 || $row == 10) {
            $limit = 10;
            $start = 0;
            $page = 1;
        } else {
            $a = $row / 10;
            $b = is_float($a) ? explode('.', (string)$a) : $a;
            $c = is_array($b) ? (int)$b[0] * 10 : $b * 10;
            //print_r($c.',');
            if ($row == $c) {
                $limit = 10;
                $start = $c - 10;
                $page = is_array($b) ? (int)$b[0] : $b;
            } else {
                if ($row > $c) {
                    $start = $c;
                    $limit = 10;
                    $page = is_array($b) ? (int)$b[0] + 1 : $b + 1;
                    /*if ($limit > $cantTotal) {
                        $limit = $limit - $cantTotal;
                    }*/
                }
            }
        }
        /*print_r(array('start' => $start, 'limit' => $limit, 'page' => $page));
          die;*/

        return array('start' => $start, 'limit' => $limit, 'page' => $page);
    }

}
