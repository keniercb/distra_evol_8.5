<?php


class ConfModeloModel extends ZendExt_Model
{
    private $_confmodelo;
    private $_idestructura;
    private $_idestructuramodelo;

    public function ConfModeloModel()
    {
        parent::ZendExt_Model();
        $this->_confmodelo = new ConfModelosContabilizacion();
        $this->_idestructura = $this->global->Estructura->idestructura;
        $this->_idestructuramodelo = 0;
    }

    /**
     * Guarda los modelos configurados para la entidad actual como una plantilla
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
            if ($request['otherorgan'] && $request['idestructura']) {
                $idestructura = $request['idestructura'];
            } else {
                $idestructura = $this->_idestructura;
            }
            $conditions[] = 'idestructuracomun=?';
            $params[] = $idestructura;
            if ($request['subsistemas']) {
                $subsistemas = json_decode($request['subsistemas']);
                $conditions[] = 'idsubsistema in (' . implode(',', $subsistemas) . ')';
            }
            $modelos = NomModelosContabilizacion::GetByCondition(implode(' AND ', $conditions), $params, true);

            if ($result['id']) {
                foreach ($modelos as $row) {
                    $conf = new ConfModelosContabilizacion();
                    $conf->codigo = $row['codigo'];
                    $conf->nombre = $row['nombre'];
                    $conf->descripcion = $row['descripcion'];
                    $conf->estado = $row['estado'];
                    $conf->idsubsistema = $row['idsubsistema'];
                    $conf->idplantilla = $result['id'];
                    $conf->configuracion = json_encode($row['DatAsientosContables']);
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
            if ($request['otherorgan'] && $request['idestructura']) {
                $this->_idestructura = $request['idestructura'];
            }

            $modelos = $this->_confmodelo->getModelos($idplantilla);

            $this->adicionarModelos($modelos);

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

    public function convertObjectToArray($object)
    {
        $arr = array();
        foreach ($object as $key => $value) {
            $arr[$key] = $value;
        }
        return $arr;
    }

    public function adicionarModelos($modelos)
    {
        try {
            $idmodelos = array();
            foreach ($modelos as $modelo) {
                $instancia = new NomModelosContabilizacion();
                $oldidmodelo = $modelo->idmodelo;
                $instancia->idestructuracomun = $this->_idestructura;
                $instancia->codigo = $modelo['codigo'];
                $instancia->nombre = $modelo['nombre'];
                $instancia->descripcion = $modelo['descripcion'];
                $instancia->estado = $modelo['estado'];
                $instancia->idsubsistema = $modelo['idsubsistema'];
                $instancia->save();
                if ($modelo['configuracion']) {
                    $asientos = json_decode($modelo['configuracion']);
                } else {
                    $asientos = $modelo['DatAsientosContables'];
                }

                $this->adicionarAsientos($asientos, $instancia->toArray());
                //guardando referencia al nuevo idmodelo por idmodelo original
                $idmodelos[$oldidmodelo] = $instancia->idmodelo;
            }
            return $idmodelos;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function adicionarAsientos($asientos, $modelo)
    {
        try {
            $this->_idestructuramodelo = $modelo['idestructuracomun'];
            foreach ($asientos as $asiento) {
                $asiento = (object)$asiento;
                $instancia = new DatAsientosContables();
                if ($asiento->NomCamposContables) {
                    $campocontable = $this->adicionarCampoContable($asiento->NomCamposContables);
                    $instancia->cuenta = $campocontable->idcampo;
                } else {
                    $instancia->cuenta = $asiento->cuenta;
                }
                if ($asiento->NomValoresContables) {
                    $valorcontable = $this->adicionarValorContable($asiento->NomValoresContables);
                }
                $instancia->idmodelo = $modelo['idmodelo'];
                $instancia->tipocuenta = $asiento->tipocuenta;
                $instancia->creditodebito = $asiento->creditodebito;
                $instancia->porciento = $asiento->porciento;
                $instancia->idvalorcontable = $valorcontable->idvalorcontable;
                $instancia->save();

                if ($asiento->DatSustituciones) {
                    $this->adicionarSustituciones($asiento->DatSustituciones, $instancia->toArray());
                }
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function adicionarCampoContable($objeto)
    {
        try {
            $objeto = (object)$objeto;
            if ($objeto->idestructuracomun) {
                $objeto->idestructuracomun = $this->_idestructura;
            }
            $campocontable = $this->buscarEntidad('NomCamposContables', $objeto, array('idcampo'));
            if (count($campocontable)) {
                return $campocontable[0];
            }

            $campocontable = new NomCamposContables();
            $clasificador = $objeto->NomClasificadores;
            if ($clasificador) {
                $clasificador = $this->adicionarClasificador($clasificador);
                $campocontable->idclasificador = $clasificador->idclasificador;
            }

            $campocontable->nombre = $objeto->nombre;
            $campocontable->tipo = $objeto->tipo;
            $campocontable->referencia = $objeto->referencia;
            $campocontable->idsubsistema = $objeto->idsubsistema;
            $campocontable->ruta = $objeto->ruta;
            $campocontable->idestructuracomun = $this->_idestructura;
            $campocontable->save();

            return $campocontable;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }

    }

    public function adicionarClasificador($objeto)
    {
        try {
            $objeto = (object)$objeto;
            if ($objeto->idestructuracomun) {
                $objeto->idestructuracomun = $this->_idestructura;
            }
            $clasificador = $this->buscarEntidad(
                'NomClasificadores', $objeto, array('idclasificador')
            );
            if (count($clasificador)) {
                return $clasificador[0];
            }
            $clasificador = new NomClasificadores();
            $clasificador->nombre = $objeto->nombre;
            $clasificador->descripcion = $objeto->descripcion;
            $clasificador->ruta = $objeto->ruta;
            $clasificador->referenciaclase = $objeto->referenciaclase;
            $clasificador->idsubsistema = $objeto->idsubsistema;
            $clasificador->idestructuracomun = $this->_idestructura;
            $clasificador->save();
            return $clasificador;

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function adicionarValorContable($objeto)
    {
        try {
            $objeto = (object)$objeto;
            if ($objeto->idestructuracomun) {
                $objeto->idestructuracomun = $this->_idestructura;
            }
            $valor = $this->buscarEntidad(
                'NomValoresContables', $objeto, array('idvalorcontable')
            );
            if (count($valor)) {
                return $valor[0];
            }
            $valor = new NomValoresContables();
            $valor->nombre = $objeto->nombre;
            $valor->idsubsistema = $objeto->idsubsistema;
            $valor->tipo = $objeto->tipo;
            $valor->idestructuracomun = $this->_idestructura;
            $valor->sustitucion = $objeto->sustitucion;
            $valor->ruta = $objeto->ruta;
            $valor->referencia = $objeto->referencia;
            $valor->save();
            return $valor;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function adicionarSustituciones($sustituciones, $asiento)
    {
        try {
            foreach ($sustituciones as $sustitucion) {
                $sustitucion = (object)$sustitucion;
                $instancia = new DatSustituciones();
                if ($sustitucion->NomValoresContables) {
                    $valorcontable = $this->adicionarValorContable($sustitucion->NomValoresContables);
                    $instancia->valor = $valorcontable->idvalorcontable;
                } else {
                    $instancia->valor = null;
                }
                $instancia->idasiento = $asiento['idasiento'];
                $idapertura = $this->obtenerApertura($sustitucion->tipoorigen, $this->_idestructuramodelo);
                $idnivel = $this->obtenerNivelCuenta($sustitucion->idnivelsustitucion);
                $instancia->tipoorigen = $idapertura;
                $instancia->idnivelsustitucion = $idnivel;
                $instancia->referencia = $sustitucion->referencia;
                if ($idapertura && $idnivel) {
                    $instancia->save();
                }
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function buscarEntidad($entidad, $datos, $excluidos)
    {
        try {
            $filtros = $this->obtenerFiltros($entidad, $datos, $excluidos);
            $where = '';
            if (count($filtros)) {
                $where = implode(' AND ', $filtros);
            }
            $query = Doctrine_Query::create();
            $query->from($entidad)->where($where);

            $result = $query->execute();
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function obtenerFiltros($entidad, $datos, $excluidos)
    {
        try {

            $filtros = array();
            $clase = new $entidad();
            $columns = $clase->getTable()->getColumnNames();
            foreach ($datos as $k => $valor) {
                if (!is_object($valor) && !is_array($valor) && !in_array($k, $excluidos) && in_array($k, $columns)) {
                    $type = $clase->getTable()->getTypeOfColumn($k);
                    if (is_null($valor)) {
                        $filtros[] = $k . " ISNULL";
                    } else {
                        if ($type == 'boolean') {
                            $valor = $valor ? 'TRUE' : 'FALSE';
                            $filtros[] = $k . " = " . $valor;
                        } else {
                            $filtros[] = $k . " = '" . $valor . "'";
                        }
                    }
                }
            }
            return $filtros;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerApertura($idapertura, $identidad)
    {
        try {
            if ($idapertura == -1 || !$identidad) {
                return -1;
            }
            $estructurae = $this->integrator->contabilidad->obtenerEstructuraE($identidad);
            $params = array('idconfapertura' => $idapertura);
            $result = $this->integrator->contabilidad->getConfAperturaByParams($params);
            if (count($result)) {
                $concepto = "'" . $result[0]['concepto'] . "'";
                $nomesquema = "'" . $result[0]['nomesquema'] . "'";
                //$params = array('concepto'      => $concepto, 'nomesquema' => $nomesquema,
                //                'idestructurae' => $estructurae->idestructurae);
                $params = array('concepto'      => $concepto, 'nomesquema' => $nomesquema);
                $result = $this->integrator->contabilidad->getConfAperturaByParams($params);
                if (count($result)) {
                    return $result[0]['idconfapertura'];
                }
            }
            return 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function obtenerNivelCuenta($idparteformato)
    {
        try {
            $estructurae = $this->integrator->contabilidad->obtenerEstructuraE($this->_idestructura);
            if (!$estructurae->idestructurae) {
                return 0;
            }
            $idformato = $this->integrator->contabilidad->obtenerFormatoClasificadorCta($this->_idestructura);
            $partesformato = $this->integrator->datosmaestros->buscarParteFormato(99000000003);
            foreach ($partesformato as $parteformato) {
                if ($parteformato->idparteformato == $idparteformato) {
                    return $idparteformato;
                }
            }
            return 0;
        } catch (Exception $e) {
            return 0;
        }
    }

    public function replicarDatos($post)
    {
        try {
            $estructuras = json_decode($post['estructuras']);
            $data = $this->getDataToReplicate($post);
            $result = $this->replicateDataByEntity($estructuras, $data);
            return array('code' => 1, 'success' => true, 'data' => $result);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function getDataToReplicate($post)
    {
        try {
            $modelos = json_decode($post['datos']);
            $subsistemas = json_decode($post['subsistemas']);

            $temp = [];
            foreach ($subsistemas as $subsistema) {
                if ($subsistema->alldata) {
                    $temp[] = $subsistema->id;
                }
            }
            $estructura = $this->global->Estructura->idestructura;

            if ($post['idestructura']) {
                $estructura = $post['idestructura'];
            }

            $conditions[] = "idestructuracomun = ?";
            $params[] = $estructura;

            if (count($temp)) {
                $condition[] = "idsubsistema in (" . implode(',', $temp) . ")";
            }

            if (count($modelos)) {
                $condition [] = "idmodelo in (" . implode(',', $modelos) . ")";
            }
            $conditions[] = implode(' OR ', $condition);

            return NomModelosContabilizacion::GetByCondition(implode(" AND ", $conditions), $params, true);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function replicateDataByEntity($estructuras, $data)
    {
        try {
            $result = array();
            foreach ($estructuras as $idestructura) {
                $this->_idestructura = $idestructura;
                $result[$idestructura] = $this->adicionarModelos($data);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function cargarEntidadesEconomicas($parametros)
    {
        try {
            $nodo = $parametros['node'];
            $estructuras = [];
            $resultado = $this->integrator->contabilidad->arbolEstructuraE($nodo);
            foreach ($resultado as $clave => $valor) {
                //Se asigna nulo a este campo porque da problema con el json_encode en distintas versiones de php
                $valor->logo = null;
                $estructuras[] = $valor;
            }
            return $estructuras;
        } catch (Exception $e) {
            return array();
        }
    }

} 
