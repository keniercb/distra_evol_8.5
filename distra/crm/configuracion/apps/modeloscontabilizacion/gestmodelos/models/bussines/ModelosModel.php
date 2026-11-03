<?php

/**
 * @package       ERP-Modelos de contabilizacion
 * @category      Model
 * @author        Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @author        Ing. Alejandro Mengana <amengana@xetid.cu>
 * @author        Ing. Alberto Mesa Martínez <amartinez@xetid.cu>
 * @copyright (c) 2014, XETID
 */
class ModelosModel extends ZendExt_Model {

    private $_confmodelo;

    public function ModelosModel() {
        $this->_confmodelo = new ConfModelosContabilizacion();
        parent::ZendExt_Model();
    }

    /* ---------------------------------------------------- */
    /* .::MODELOS DE CONTABILIZACION | MODELS ACCOUNTING::. */
    /* ---------------------------------------------------- */

    /**
     * Obtiene los subsistemas de la entidad comun que contabilizan.
     *
     * @param array $request Arreglo con los datos enviados en la peticion
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con los subsistemas
     */
    public function cargarsubsistemas($request) {
        $idestructura = $this->global->Estructura->idestructura;
        if ($request['idestructura']) {
            $idestructura = $request['idestructura'];
        }
        $subsistemas = array();
        if ($request['idsubsistema'] === '0') {
            $subsistemas = $this->integrator->datosmaestros->buscarSubsistemasEstructuraContabilizan($idestructura);
        } else {
            $subsistemas = $this->integrator->datosmaestros->buscarSubsistemasEstructuraContabilizan(
                    $idestructura, $request['idsubsistema']
            );
        }
        return $subsistemas;
    }

    /**
     * Obtiene los niveles de las cuentas de la entidad comun.
     *
     * @param array $request Arreglo con los datos enviados en la peticion
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con los niveles
     */
    public function cargarNivelesCuentas($request) {
        try {
            $idestructura = $this->global->Estructura->idestructura;
            if ($request['idestructura']) {
                $idestructura = $request['idestructura'];
            }
            $idformato = $this->integrator->contabilidad->obtenerFormatoClasificadorCta($idestructura);
            $result = $this->integrator->datosmaestros->buscarParteFormato($idformato);
            return array("datos" => $result);
        } catch (Exception $e) {
            return array('datos' => null, 'code' => $e->getCode(), 'msg' => $e->getMessage());
        }
//
    }

    /**
     * Obtiene los nomencladores para aperturar una cuenta dada la estructura comun.
     *
     * @param array $request Arreglo con los datos enviados en la peticion
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con los niveles
     */
    public function cargarOrigen($request) {
        $idestructura = $this->global->Estructura->idestructura;
        if ($request['idestructura']) {
            $idestructura = $request['idestructura'];
        }
        $result = $this->integrator->contabilidad->obtenerAperturasNomencladorPorEntidad($idestructura);
        foreach ($result as $key => $val) {
            $result[$key]['denominacion'] = ucwords(
                    mb_strtolower($val['denominacion'], 'UTF-8')
            );
        }
        array_splice($result, 0, 0, array(array('idconfapertura' => -1, 'denominacion' => 'Valor Dinámico')));
        return array("datos" => $result);
    }

    /**
     * Obtiene los Modelos de contabilizacion de un subsistema.
     *
     * @param array $post Arreglo con los datos enviados en la peticion
     *                    (debe traer el subsistema en el índice 'ids')
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con los Modelos de contabilizacion
     */
    public function load($post) {
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
        $conditions[] = "idestructuracomun = ?";
        $params[] = $estructura;

        $subsistemas = json_decode($post['idsubsistema']);
        if (!empty($subsistemas)) {
            if (!is_array($subsistemas)) {
                $subsistemas = [$subsistemas];
            }
            $conditions[] = "idsubsistema in (" . implode(',', $subsistemas) . ")";
        }

        if (!empty($post['filter'])) {
            $filter = $post['filter'];
            $conditions[] = "(lower(nombre) ILIKE lower('%$filter%') OR lower(codigo) ILIKE lower('%$filter%'))";

            $data = NomModelosContabilizacion::GetByCondition(
                            implode(" AND ", $conditions), $params, true, $start, $limit
            );
            $cantidad = NomModelosContabilizacion::CountByCondition(
                            implode(" AND ", $conditions), $params
            );
            /* Colocando un highlight al filtro */
            if (count($data)) {
                foreach ($data as &$campo) {
                    $campo['nombre'] = str_replace(
                            $filter, "<span style=\"background-color: rgb(255, 255, 0);\">" . $filter . "</span>",
                            $campo['nombre']
                    );
                    $campo['codigo'] = str_replace(
                            $filter, "<span style=\"background-color: rgb(255, 255, 0);\">" . $filter . "</span>",
                            $campo['codigo']
                    );
                }
            }
        } else {
            $data = NomModelosContabilizacion::GetByCondition(
                            implode(" AND ", $conditions), $params, true, $start, $limit
            );
            $cantidad = NomModelosContabilizacion::CountByCondition(
                            implode(" AND ", $conditions), $params
            );
        }
        $paging = array(
            'success' => true,
            'total' => $cantidad,
            'data' => $data
        );
        return $paging;
    }

    /**
     * Eliminar uno o varios Modelos de contabilizacion.
     *
     * @param array $post Arreglo con los datos enviados en la peticion
     *                    (almacena los ids de los campos a eliminar en el índice 'ids')
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con la respuesta del servidor
     */
    public function delete($post) {
        //Si el arreglo de errors tiene valores es que ha habido
        //errores en el proceso
        $response = array('errors' => array(), 'success' => array());
        $cont = 0;
        if (!empty($post['ids'])) {
            $ids = json_decode(stripslashes($post['ids']));
            $total = count($ids);
            foreach ($ids as $idmodelo) {
                $result = NomModelosContabilizacion::GetOperacionByIdModelo(
                                $idmodelo, true
                );
                //Se eliminan los asientos asociados a los modelos
                if (count($result) == 0) {
                    $result = $this->deleteAccountingEntriesByModel(
                            $idmodelo
                    );
                    if ($result['code'] == 1) {
                        $result = NomModelosContabilizacion::Erase($idmodelo);
                        /* print_r($result->getCode());
                          print_r($result->getMessage());die; */
                        if (!is_bool($result)) {
                            $isException = $result instanceof Doctrine_Exception;
                            if ($isException && $result->getCode() == '23503') {
                                /* An error was ocurred */
                                //No se ha podido eliminar el modelo.
                                $response['code'] = 6;
                                $response['errors'][] = array('code' => 8,
                                    'errorcmp' => 'modelo',
                                    'id' => $idmodelo);
                            } else {
                                /* An error was ocurred */
                                //No se ha podido eliminar el modelo.
                                $response['code'] = 3;
                                $response['errors'][] = array('code' => 8,
                                    'errorcmp' => 'modelo',
                                    'id' => $idmodelo);
                            }
                        } else {
                            $response['success'][] = $idmodelo;
                        }
                    } else {
                        /* An error was ocurred */
                        //Ocurrio un error eliminando los asientos del modelo.
                        $response['errors'][] = $result;
                    }
                } else {
                    if ($total != 1) {
                        $cont++;
                        if ($cont == $total) {
                            /* All models are being used */
                            //Todos los modelos estan siendo usados.
                            $response['code'] = 5;
                        } else {
                            if ($cont == 1) {
                                /* Only one model is being used */
                                //Solo un modelo esta siendo usado.
                                $response['code'] = 6;
                            } else {
                                /* Not all models are being used */
                                //No todos los modelos estan siendo usados.
                                $response['code'] = 7;
                            }
                        }
                    } else {
                        /* The model is being used */
                        //El modelo está siendo usado.
                        $response['code'] = 4;
                    }
                    $response['errors'][] = array('code' => 8, 'errorcmp' => 'modelo', 'id' => $idmodelo);
                }
            }
        } else {
            /* No data to delete */
            //No hay modelos contables a eliminar
            $response['errors'][] = array('code' => 2, 'errorcmp' => 'modelo');
        }
        return $response;
    }

    /**
     * Cambiar estado de uno o varios Modelos de contabilizacion.
     *
     * @param array $post Arreglo con los datos enviados en la peticion
     *                    (almacena los ids de los campos a eliminar en el índice 'ids')
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con la respuesta del servidor
     */
    public function cambiarEstado($post) {
        //Si el arreglo de errors tiene valores es que ha habido
        //errores en el proceso
        $response = array('errors' => array(), 'success' => array());
        if (!empty($post['ids'])) {
            $ids = json_decode(stripslashes($post['ids']));
            foreach ($ids as $id) {
                $objeto = NomModelosContabilizacion::GetById($id);
                $objeto->estado = !$objeto->estado;
                $objeto->save();
            }
        } else {
            /* No data to delete */
            //No hay campos contables para cambiar su estado
            $response['errors'][] = array('code' => 2, 'errorcmp' => 'modelo');
        }
        return $response;
    }

    /**
     * Inserta un Modelo de contabilizacion.
     *
     * @param array $post Arreglo con los datos del modelo
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con la respuesta del servidor
     */
    public function add($post) {
        $response = array('code' => 1, 'errors' => array(),
            'success' => array());
        if (!empty($post['nombre']) && !empty($post['codigo']) && !empty($post['idsubsistema'])) {
            $estructura = $this->global->Estructura->idestructura;
            if ($post['otherorgan'] && $post['idestructura']) {
                $estructura = $post['idestructura'];
            } else {
                $estructura = $this->global->Estructura->idestructuracomun;
            }
            $idsubsistema = (!empty($post['idsubsistema']) && is_numeric(
                            $post['idsubsistema']
                    )) ? $post['idsubsistema'] : $this->global->Subsistema->idsubsistema;

            $conditions = array("idsubsistema = ? AND idestructuracomun = ? AND codigo=?");
            $params = array($idsubsistema, $estructura, $post['codigo']);
            if (!empty($post['idmodelo'])) {
                array_push($conditions, "idmodelo!=?");
                array_push($params, $post['idmodelo']);
            }
            $result = NomModelosContabilizacion::GetByCondition(
                            implode(" AND ", $conditions), $params, true
            );
            $existeCod = (count($result) != 0) ? true : false;

            if (!$existeCod) {

                $conditions = array("idsubsistema = ? AND idestructuracomun = ? AND nombre=?");
                $params = array($idsubsistema, $estructura, $post['nombre']);
                if (!empty($post['idmodelo'])) {
                    array_push($conditions, "idmodelo!=?");
                    array_push($params, $post['idmodelo']);
                }
                $result = NomModelosContabilizacion::GetByCondition(
                                implode(" AND ", $conditions), $params, true
                );

                $existeNomb = (count($result) != 0) ? true : false;

                if (!$existeNomb) {
                    /* Si se esta modificando */
                    if (!empty($post['idmodelo']) && is_numeric(
                                    $post['idmodelo']
                            )
                    ) {

                        if (!empty($post['sustEliminadas'])) {
                            $response = $this->deleteSustitution(
                                    array('ids' => $post['sustEliminadas'])
                            );
                        }

                        if (!empty($post['asientosEliminados'])) {
                            //$arrasientos=json_decode($post['asientosEliminados']);
                            $response = $this->deleteAccountingEntries(
                                    array('ids' => $post['asientosEliminados'])
                            );
                        }

                        $objeto = NomModelosContabilizacion::GetById(
                                        $post['idmodelo']
                        );
                    } else {
                        $objeto = new NomModelosContabilizacion();
                    }

                    $objeto->nombre = $post['nombre'];
                    $objeto->codigo = $post['codigo'];
                    $objeto->descripcion = !empty($post['descripcion']) ? $post['descripcion'] : null;
                    $objeto->estado = (!empty($post['estado'])) ? $post['estado'] : true;
                    $objeto->idsubsistema = $post['idsubsistema'];
                    $objeto->idestructuracomun = !empty($post['idestructura']) ? $post['idestructura'] : $estructura;

                    $objeto->save();
                    $idmodelo = $objeto->idmodelo;

                    if (!is_numeric($idmodelo)) {
                        /* Ocurrio un error al insertar */
                        $response['code'] = 3;
                        $response['errors'] = 'Ocurrio un error al insertar el modelo'
                                . $post['nombre'];
                    } else {
                        //En caso que haya tomado codigo 2 mientras intentaba eliminar las
                        //sustituciones y los asientos se sobreescriben
                        $response['code'] = 1;
                        $response['errors'] = '';
                        //$asientos = json_decode(stripcslashes($post['asientos']));
                        $asientos = json_decode($post['asientos']);
                        foreach ($asientos as $asiento) {
                            $asiento = is_array($asiento) ? $asiento : (array) $asiento;
                            $response = $this->addAccountingEntry(
                                    $asiento, $idmodelo
                            );
                        }
                    }
                } else {
                    /* Ya existe un modelo de contabilización con este nombre */
                    $response['code'] = 6;
                    $response['errors'][] = $post['nombre'];
                }
            } else {
                /* Ya existe un modelo de contabilización con este código */
                $response['code'] = 5;
                $response['errors'][] = $post['codigo'];
            }
        } else {
            /* Faltan datos */
            $response['code'] = 2;
        }
        return $response;
    }

    /**
     * Obtiene los campos contables para un subsistema de la estructura comun.
     *
     * @param array $post Arreglo con el identificador del subsitema
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con la respuesta del servidor
     */
    public function cargarCampos($post) {
        $camposContbModel = new CamposModel();
        $result = $camposContbModel->load($post, true);
        $result['datos'] = $result['data'];
        unset($result['data']);
        foreach ($result['datos'] as $key => $value) {
            $result['datos'][$key]['id'] = $value['idcampo'];
            $result['datos'][$key]['text'] = $value['nombre'];
        }
        return $result;
    }

    /**
     * Obtiene los valores contables para un subsistema de la estructura comun.
     *
     * @param array $post Arreglo con los datos enviados en la peticion
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con la respuesta del servidor
     */
    public function cargarValores($post) {
        $valorContbModel = new ValoresModel();
        $arrIds = array();
        //Si cargaInicial, entonces se cargan solamente los campos
        //pertenecientes al id modelo pasado por parametros
        if ($post['cargaInicial']) {
            $data = NomModelosContabilizacion::GetValorByIdModelo(
                            $post['idmodelo'], true
            );
            foreach ($data[0]['DatAsientosContables'] as $valor) {
                array_push($arrIds, $valor['idvalorcontable']);
            }
            if (count($arrIds) == 0) {
                return array();
            }
            $post['arrIds'] = $arrIds;
        }
        if (empty($post['esquema']) && empty($post['concepto'])) {
            $result = $valorContbModel->load($post);
        } else {
            $node = $post['node'] ? $post['node'] : 0;
            $arrFiltros['idconfapertura'] = $post['tipoorigen'];
            $arrFiltros['nomesquema'] = $post['esquema'];
            $arrFiltros['concepto'] = $post['concepto'];
            $arrFiltros['descripcion'] = $post['descripcion'] ? $post['descripcion'] : '';
            $arrFiltros['identificadorpadre'] = $post['identificadorpadre'] != 'null' ? $post['identificadorpadre'] : '';
            $arrFiltros['identificador'] = $post['identificador'] ? $post['identificador'] : '';
            $arrdata = $this->integrator->contabilidad->obtenerNomencladoresParaAperturarCuentas($arrFiltros, $node);
            // esto lo puse porque miguel cambio la forma en que devuelve los datos datos el servicio
            $arrdata = !empty($arrdata['data']) ? $arrdata['data'] : $arrdata;

            foreach ($arrdata as $key => $value) {
                $arrdata[$key]['idvalorcontable'] = isset($value[$post['identificador']]) ? $value[$post['identificador']] : $value['id'];
                if ($post['concepto'] == 'dat_persona') {
                    $arrdata[$key]['nombre'] = ucwords(
                            mb_strtolower($value['nombre'] . ' ' . $value['papel'] . ' ' . $value['sapel'], 'UTF-8')
                    );
                } else {
                    $arrdata[$key]['nombre'] = ucwords(mb_strtolower($value[$post['descripcion']], 'UTF-8'));
                }
                $arrdata[$key]['checked'] = false;
                //unset($arrdata[$key]['checked']);
            }
            $result = array('data' => $arrdata);
        }

        return $result;
    }

    /**
     * Obtiene los cuentas del nomenclador de la estructura comun.
     *
     * @param array $post Arreglo con los datos enviados en la peticion
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con la respuesta del servidor
     */
    public function cargarCuentas($post) {
        $idestructura = $this->global->Estructura->idestructura;
        if ($post['idestructura']) {
            $idestructura = $post['idestructura'];
        }
        $idsubsistema = $post['idsubsistema'];
        if ($idsubsistema == 14 || $idsubsistema == 71)
            $idsubsistema = '';
        else
            $idsubsistema = '-1';
        if ($post['node'] == 0) {
            $cuentas = $this->integrator->contabilidad->obtenerClasificadorCuentas(
                    $idestructura, null, $post['filter'], false, $idsubsistema
            );
        } else {
            $cuentas = $this->integrator->contabilidad->obtenerClasificadorCuentas(
                    $idestructura, $post['node'], $post['filter'], false, $idsubsistema
            );
        }
        return $cuentas;
    }

    /* ---------------------------------- */
    /* .::SUSTITUCIONES | SUSTITUTIONS::. */
    /* ---------------------------------- */

    /**
     * Obtiene las sutituciones para un asiento.
     *
     * @param int $idasiento Identificador del asiento contable
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con las sustituciones del asiento
     */
    public function loadSustitutions($idasiento) {
        $data = array();
        if (!empty($idasiento) && is_numeric($idasiento)) {
            $data = DatSustituciones::GetByCondition('idasiento=?', array($idasiento), true);
            $cont = 0;
            foreach ($data as $sust) {
                $data[$cont]['valid'] = true;
                if (empty($sust['referencia'])) {
                    if ($sust['valor']) {
                        $valor = NomValoresContables::GetById($sust['valor'], true);
                        $valor = !is_array($valor) ? (array) $valor : $valor;
                    }
                    //Si no se encuentra un valor con el id pasado por parametros esta sustitucion
                    //se descarta.
                    if (!empty($valor)) {
                        $data[$cont]['denominacion'] = $valor['nombre'];
                        $cont++;
                    } /* else {
                      unset($data[$cont]);
                      } */
//                    }
                } else {
                    if (!empty($sust['valor'])) {
                        list($esquema, $concepto, $idConcepto, $nombConcepto) = explode('.', $sust['referencia']);
                        $arrConcepto = NomModelosContabilizacion::GetConcepto(
                                        $esquema, $concepto, $idConcepto, $sust['valor'], true
                        );
                        $arrConcepto = !is_array($arrConcepto) ? (array) $arrConcepto : $arrConcepto;
                        //Si no se encuentra un concepto con el id pasado por parametros esta sustitucion
                        //se descarta.
                        if (!empty($arrConcepto)) {
                            $data[$cont]['denominacion'] = ucwords(
                                    mb_strtolower($arrConcepto[0][$nombConcepto], 'UTF-8')
                            );
                            $cont++;
                        } /* else {
                          unset($data[$cont]);
                          } */
                    } else {
                        $cantArray = substr_count($sust['referencia'], 'array');
                        if ($cantArray == 2) {
                            $pattern = '/[\s\S]\(array\((\d+),[^,]+,(\w+),(?:[^,]+,){3}[^,]+,(\w+),array\(([\d,]+)\)\)[^.]+.([.\w]+)/i';
                            preg_match_all($pattern, $sust['referencia'], $matches, PREG_SET_ORDER);
                            list($trash, $idConcepto, $concepto, $esquema, $valores, $campos) = $matches[0];
                            list($codigo, $identificador, $denominacion) = explode('.', $campos);
                            $data[$cont]['valor'] = explode(',', $valores);
                            $arrDenomiacion = array();
                            foreach ($data[$cont]['valor'] as $valor) {
                                $arrConcepto = NomModelosContabilizacion::GetConcepto(
                                                $esquema, $concepto, $identificador, $valor, true
                                );
                                $arrDenomiacion[] = ucwords(mb_strtolower($arrConcepto[0][$denominacion], 'UTF-8'));
                            }
                            $data[$cont]['denominacion'] = implode(', ', $arrDenomiacion);
                            $cont++;
                        } else {
                            $data[$cont]['denominacion'] = '';
                            $data[$cont]['valor'] = '';
                            $cont++;
                        }
                    }
                }
            }
        }

        return array(
            'success' => true,
            'total' => count($data),
            'data' => $data
        );
    }

    /**
     * Elimina una o varias sustituciones en un asiento.
     *
     * @param array $post Arreglo con los datos enviados en la peticion
     *                    (almacena los ids de las sustituciones a eliminar en el índice 'ids')
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con la respuesta del servidor
     */
    public function deleteSustitution($post) {
        /* All code here */
        $response = array('code' => 1, 'errors' => array(),
            'success' => array());
        if (!empty($post['ids'])) {
            $ids = json_decode(stripslashes($post['ids']));
            foreach ($ids as $idsustitucion) {
                $result = DatSustituciones::Erase($idsustitucion);
                if (!$result) {
                    /* An error was ocurred */
                    $response['code'] = 3;
                    $response['errors'][] = $idsustitucion;
                } else {
                    $response['success'][] = $idsustitucion;
                }
            }
        } else {
            /* No data to delete */
            $response['code'] = 2;
        }
        return $response;
    }

    /**
     * Elimina todas las sustituciones definidas para un asiento contable.
     *
     * @param int|array $idasiento Identificador(es) del (de los) asiento(s) contable(s)
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con la respuesta del servidor
     */
    public function deleteSustitutionByIdAsiento($idasiento) {
        /* All code here */
        $response = array('code' => 1, 'errors' => array(),
            'success' => array());
        $idasiento = is_array($idasiento) ? $idasiento : array($idasiento);
        if (count($idasiento)) {
            $conditions = "idasiento IN(" . implode(',', $idasiento) . ")";
            $result = DatSustituciones::EraseByCondition($conditions, array());
            if (!$result) {
                /* An error was ocurred */
                $response['code'] = 3;
                $response['errors'] = 'Ah ocurrido un error eliminando las sust por idasiento';
            }
        } else {
            /* No data to delete */
            $response['code'] = 2;
        }

        return $response;
    }

    /**
     * Agrega una sustitucion a in asiento contable.
     *
     * @param array $post      Arreglo con los datos del clasificador
     * @param int   $idasiento Identificador del asiento al que se le registra
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con la respuesta del servidor
     */
    public function addSustitution($post, $idasiento) {
        /* All code here */
        $response = array('code' => 1, 'errors' => array(), 'success' => array());
        if (is_numeric($idasiento) && !empty($post['tipoorigen']) && !empty($post['idnivelsustitucion'])) {
            /* Si se esta modificando */
            $objeto = (!empty($post['idsustitucion']) && is_numeric($post['idsustitucion'])) ? DatSustituciones::GetById($post['idsustitucion']) : new DatSustituciones();

            $objeto->idasiento = $idasiento;
            $objeto->tipoorigen = $post['tipoorigen'];
            $objeto->idnivelsustitucion = $post['idnivelsustitucion'];

            if (!empty($post['valor']) && !is_array($post['valor']) /* && $post['tipoorigen'] == -1 */) {
                $objeto->valor = $post['valor']; // id del nomenclador que corresponda o id del valor contable
                $objeto->referencia = $post['referencia'];
            } else {
                $arrReferencia = explode('.', $post['referencia']);
                $objeto->valor = null;

                if (is_array($post['valor'])) {
                    $ident = '\'' . $arrReferencia[2] . '\'';
                    $valor = ',array(' . implode(',', $post['valor']) . ')';
                } else {
                    $ident = '\'\'';
                    $valor = '';
                }

                //En caso de que la referencia no sea la llamada a un servicio, esta
                //está compuesta por esquema.tabla.campoidentificador.campodenominacion.campocodigo.
                if (count($arrReferencia) == 5) {
                    $esquema = $arrReferencia[0];
                    $tabla = $arrReferencia[1];
                    $campoidentificador = $arrReferencia[2];
                    $campodenominacion = $arrReferencia[3];
                    $campocodigo = $arrReferencia[4];
                } else {
                    //Si el arreglo $arrReferencia no posee longitud 5, es porque la referencia esta compuesta
                    //por Servicio.campoidentificador.campodenominacion.campocodigo y se aplica un expresion regular
                    //para obtener la tabla y el esquema.
                    $pattern = '/[\s\S]\(array\(\d+,[^,]+,(\w+),(?:[^,]+,){3}[^,]+,(\w+)/i';
                    preg_match_all($pattern, $arrReferencia[0], $matches, PREG_SET_ORDER);
                    list($temp, $tabla, $esquema) = $matches[0];
                    $campocodigo = $arrReferencia[1];
                    $campoidentificador = $arrReferencia[2];
                    $campodenominacion = $arrReferencia[3];
                }

                $objeto->referencia = '$this->integrator->contabilidad->obtenerNomencladoresParaAperturarCuentas(array('
                        . $post["tipoorigen"] . ',' . '\'\'' . ','
                        . $tabla . ',' . $ident . ',' . '\'\'' . ',' . '\'\''
                        . ', null,' . $esquema . $valor . '), 0).'
                        . $campocodigo . '.' . $campoidentificador . '.' . $campodenominacion;
            }

            $objeto->save();
            $idsustitucion = $objeto->idsustitucion;

            if (!is_numeric($idsustitucion)) {
                /* Ocurrio un error al insertar */
                $response['code'] = 3;
            }
        } else {
            /* Missing data */
            $response['code'] = 2;
        }
        return $response;
    }

    /* --------------------------------------------- */
    /* .::ASIENTOS CONTABLES | ACCOUNTING ENTRIES::. */
    /* --------------------------------------------- */

    /**
     * Obtiene los asientos contables de un modelo de contabilizacion.
     *
     * @param int $idmodelo Identificador del modelo de contabilizacion
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo los asientos contables del modelo de contabilizacion
     */
    public function loadAccountingEntries($idmodelo) {
        $data = array();
        if (!empty($idmodelo) && is_numeric($idmodelo)) {
            $data = DatAsientosContables::GetByCondition('idmodelo=?', array($idmodelo), true);
            $cont = 0;
            $result = array();
            foreach ($data as $dat) {
                $dat['valid'] = true;
                $dat['sustitucion'] = array();
                $dat['cantsustituciones'] = '';
                if ($dat['tipocuenta'] == '1' && $dat['cuenta']) {
                    $campo = NomCamposContables::GetById($dat['cuenta'], true);
                    $campo = !is_array($campo) ? (array) $campo : $campo;
                    //Si no se encuentra un campo con el id pasado por parametros este asiento
                    //se descarta.
                    if (!empty($campo)) {
                        $result[$cont] = $dat;
                        $result[$cont]['denominacion'] = $campo['nombre'];
                        $cont++;
                    }
                } else {
                    if ($dat['cuenta']) {
                        $cuenta = $this->integrator->contabilidad->obtenerCuentaPorId($dat['cuenta']);
                        $cuenta = !is_array($cuenta) ? (array) $cuenta : $cuenta;
                        //Si no se encuentra una cuenta con el id pasado por parametros este asiento
                        //se descarta.
                        if (!empty($cuenta)) {
                            $result[$cont] = $dat;
                            $result[$cont]['denominacion'] = $cuenta['text'];
                            $cont++;
                        }
                    }
                }
            }
        }

        return array(
            'success' => true,
            'total' => count($result),
            'data' => $result
        );
    }

    /**
     * Elimina uno o varios asientos contables de un modelo de contabilización.
     *
     * @param array $post Arreglo con los datos enviados en la peticion
     *                    (almacena los ids de los asientos a eliminar en el índice 'ids')
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con la respuesta del servidor
     */
    public function deleteAccountingEntries($post) {
        /* All code here */
        $response = array('code' => 1, 'errors' => array(),
            'success' => array());
        if (!empty($post['ids'])) {
            $ids = json_decode(stripslashes($post['ids']));
            //Se eliminan las sustituciones por un arreglo de con los ids de las asientos
            $response = $this->deleteSustitutionByIdAsiento($ids);
            if ($response['code'] != 3) {
                foreach ($ids as $idasiento) {
                    $result = DatAsientosContables::Erase($idasiento);
                    if (!$result) {
                        /* An error was ocurred */
                        $response['code'] = 3;
                        $response['errors'][] = $idasiento;
                    } else {
                        $response['success'][] = $idasiento;
                    }
                }
            }
        } else {
            /* No data to delete */
            $response['code'] = 2;
        }
        return $response;
    }

    /**
     * Elimina todas los asientos contables para uno o varios modelos de contabilización.
     *
     * @param int|array $idmodelo Identificador(es) del (de los) modelo(s) de contabilización
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con la respuesta del servidor
     */
    public function deleteAccountingEntriesByModel($idmodelo) {
        /* All code here */
        $response = array('code' => 1, 'errors' => array(),
            'success' => array());
        $idmodelo = is_array($idmodelo) ? $idmodelo : array($idmodelo);
        if (count($idmodelo)) {
            $conditions = "idmodelo IN(" . implode(',', $idmodelo) . ")";
            //Se obtienen los asientos pertenecientes a ese modelo
            $asientos = DatAsientosContables::GetByCondition(
                            $conditions, array(), true
            );
            //Se recorre el arreglo de asientos y se elminan
            if (count($asientos) != 0) {
                foreach ($asientos as $asiento) {
                    $response = $this->deleteAccountingEntries(
                            array("ids" => $asiento['idasiento'])
                    );
                    //Si ocurrió un error mientras se eliminaba se rompe el ciclo
                    if ($response['code'] == 3) {
                        break;
                    }
                }
            }
            if ($response['code'] != 3) {
                $response['code'] = 1;
                $result = DatAsientosContables::EraseByCondition(
                                $conditions, array()
                );
                if (!$result) {
                    /* An error was ocurred */
                    $response['code'] = 3;
                }
            }
        } else {
            /* No data to delete */
            $response['code'] = 2;
        }

        return $response;
    }

    /**
     * Agrega un asiento contable a un  modelo de contabilización.
     *
     * @param array $post     Arreglo con los datos del clasificador
     * @param int   $idmodelo Identificador del modelo al que se le registra
     *
     * @throws Doctrine_Exception
     * @return mixed Arreglo con la respuesta del servidor
     */
    public function addAccountingEntry($post, $idmodelo) {
        $response = array('code' => 1, 'errors' => array(),
            'success' => array());
        if (!is_null($idmodelo) && !empty($post['cuenta']) && !empty($post['tipocuenta']) && !empty($post['creditodebito']) && !empty($post['idvalorcontable']) && (!empty($post['porciento']) || $post['porciento'] == 0)
        ) {
            /* Si se esta modificando */
            $objeto = (!empty($post['idasiento']) && is_numeric(
                            $post['idasiento']
                    )) ? DatAsientosContables::GetById($post['idasiento']) :
                    new DatAsientosContables();
            $objeto->idmodelo = $idmodelo;
            $objeto->cuenta = $post['cuenta'];
            $objeto->tipocuenta = $post['tipocuenta'];
            $objeto->creditodebito = $post['creditodebito'];
            $objeto->idvalorcontable = $post['idvalorcontable'];
            $objeto->porciento = $post['porciento'];


            $objeto->save();
            $idasiento = $objeto->idasiento;

            if (!is_numeric($idasiento)) {
                /* Ocurrio un error al insertar */
                $response['code'] = 3;
            } else {
                $sustituciones = $post['sustitucion'];
                if (count($sustituciones) != 0) {
                    foreach ($sustituciones as $sustitucion) {
                        $sustitucion = is_array($sustitucion) ? $sustitucion : (array) $sustitucion;
                        $this->addSustitution($sustitucion, $idasiento);
                    }
                }
            }
        } else {
            /* Missing data */
            $response['code'] = 2;
        }
        return $response;
    }

    public function exportModelos($idsubsystm, $idestructura, $otherorgan) {
        $estructura = $this->global->Estructura->idestructura;
        if ($idestructura) {
            $estructura = $idestructura;
        }
        $records = NomModelosContabilizacion::getModelosBySubsystems($idsubsystm, $estructura);

        foreach ($records as &$value) {
            unset($value['idmodelo']);
            $this->formatModelosReferences($value, 'DatAsientosContables', 'idasiento', 'idmodelo');
        }

        return $records;
    }

    private function formatModelosReferences(&$record, $referenceName, $pkname, $fkname) {
        if (empty($record[$referenceName])) {
            unset($record[$referenceName]);
        } else {
            foreach ($record[$referenceName] as &$elem) {
                unset($elem[$pkname]);
                unset($elem[$fkname]);
                if ($referenceName == 'DatAsientosContables') {
                    $this->formatModelosReferences($elem, 'DatSustituciones', 'idsustitucion', 'idasiento');
                }
            }
        }
    }

    public function importModelos($fileDir) {
        $data = json_decode(file_get_contents($fileDir), true);

        try {
            $objectModel = new Doctrine_Collection('NomModelosContabilizacion');
            $objectModel->fromArray($data);
            $objectModel->save();
        } catch (Exception $e) {
            print_r($e->getMessage());
            die;
        }
    }

}
