<?php

/**
 * @version 1.0
 */
class ConfiguracionMediosTalleresModel extends ZendExt_Model {

    private $_servicioTipoMedio, $_serviciosConfiguracion, $_limitOld, $_ordenTrabajoService;

    public function __construct($aft) {
        parent::__construct();
        if ($aft) {
            $this->_servicioTipoMedio = new ConfiguracionActivosService();
        }
        $this->_limitOld = 0;
        $this->_serviciosConfiguracion = ServiciosConfiguracionGeneralHelper::__init();
        $this->_doctrineHelper = LogisticaDoctrineHelper::__init();
        $this->_ordenTrabajoService = new OrdenTrabajoTalleresService();
    }

    /**
     * Método para devolver las atributos de un indicador
     *
     * @param Array $parametros Arreglo con los parametros para filtrar las indicadores
     *
     * @return array
     */
    public function devolverAtributos($parametros, $aft) {
        if ($aft) {
            $naturaleza = $this->_servicioTipoMedio->getConfDatPorNaturaleza(
                    $parametros['idnaturaleza'], false, false
            );
        }
        $arreglo['idtabla'] = $parametros['idtabla'];
        $arreglo['idindicador'] = $parametros['idindicador'];
        $dinamicos = $this->_serviciosConfiguracion->getAtributosAgrupacionIndicador($arreglo);
        return array("naturaleza" => $naturaleza, "cantidadN" => count($naturaleza), "dinamicos" => $dinamicos,
            "cantidadD" => count($dinamicos));
    }

    /**
     * Método para almacenar las atributos configurados de un indicador
     *
     * @param Array $parametros Arreglo con los parametros para filtrar las indicadores
     *
     * @return boolean
     */
    public function guardarIndicador($parametros) {
        if ($parametros['atributosNaturaleza']) {
            $this->guardarAtributosNaturales($parametros);
        } else {
            $datos = array('idindicador' => $parametros['idindicador'], 'atributo' => $parametros['identificador']);
            $this->establecerIdentificador($datos, true);
        }
        if ($parametros['eliminarPorNaturaleza']) {
            foreach ($parametros['eliminarPorNaturaleza'] as $row) {
                $param['idindicador'] = $parametros['idindicador'];
                $param['data'] = $row;
                $this->eliminarAtributoNatural($param, false);
            }
        }
        $this->guardarAtributosDinamicos($parametros);
        return true;
    }

    public function guardarAtributosNaturales($parametros) {
        foreach ($parametros['atributosNaturaleza'] as $row) {
            if (!$this->existsAtributoNaturaleza($parametros['idindicador'], $row['index'])) {
                $parametros['idnaturaleza'] = ($parametros['idnaturaleza'] == "") ? null : $parametros['idnaturaleza'];
                $datosAtbNaturaleza = array();
                $atributoNaturaleza = new DatAtributosNaturaleza();
                $datosAtbNaturaleza['denominacion'] = $row['deno'];
                $datosAtbNaturaleza['data'] = $row['index'];
                $datosAtbNaturaleza['idindicador'] = $parametros['idindicador'];
                $datosAtbNaturaleza['idnaturaleza'] = $parametros['idnaturaleza'];
                $datosAtbNaturaleza['idtabla'] = $parametros['idtabla'];
                if ($row['index'] == $parametros['identificador']) {
                    $datos = array('idindicador' => $parametros['idindicador']);
                    $this->reinicarAtributos($datos);
                    $datosAtbNaturaleza['identificador'] = 1;
                } else {
                    $datosAtbNaturaleza['identificador'] = 0;
                }
                $atributoNaturaleza->synchronizeWithArray($datosAtbNaturaleza);
                $atributoNaturaleza->save();
            } else {
                $datos = array('idindicador' => $parametros['idindicador'], 'atributo' => $parametros['identificador']);
                $this->establecerIdentificador($datos, true);
            }
        }
    }

    /**
     * Método para almacenar las atributos por naturaleza configurados de un indicador
     *
     * @param Array $parametros Arreglo con los parametros para filtrar las indicadores
     *
     * @return boolean
     */
    public function guardarAtributosDinamicos($parametros) {
        foreach ($parametros['atributosDinamicos'] as $row) {
            if (!$this->existsAtributoIndicador($parametros['idindicador'], $row['idcampo'])) {
                $datosAtbIndicador = array();
                $atributosIndicador = new DatAtributosIndicador();
                $datosAtbIndicador['idatributodinamico'] = $row['idcampo'];
                $datosAtbIndicador['idindicador'] = $parametros['idindicador'];
                $datosAtbIndicador['nombretabla'] = $row['name'];
                $datosAtbIndicador['recuperable'] = 0;
                if ($row['name'] == $parametros['identificador']) {
                    $datos = array('idindicador' => $parametros['idindicador']);
                    $this->reinicarAtributos($datos);
                    $datosAtbIndicador['identificador'] = 1;
                } else {
                    $datosAtbIndicador['identificador'] = 0;
                }
                $atributosIndicador->synchronizeWithArray($datosAtbIndicador);
                $atributosIndicador->save();
            } else {
                if ($row['name'] == $parametros['identificador']) {
                    $datos = array('idindicador' => $parametros['idindicador'], 'atributo' => $row['idcampo']);
                    $this->establecerIdentificador($datos);
                }
            }
        }
        if ($parametros['eliminarDinamicos']) {
            foreach ($parametros['eliminarDinamicos'] as $row) {
                $param['idindicador'] = $parametros['idindicador'];
                $param['idatributodinamico'] = $row;
                $this->eliminarAtributoDinamico($param, false);
            }
        }
    }

    /**
     * Método para verificar la existencia de un atributo natural configurado para un indicador
     *
     * @param $idindicador id del indicador
     *                     $deno denominacion del atributo
     *
     * @return boolean
     */
    public function existsAtributoNaturaleza($idindicador, $data) {
        $query = new Doctrine_Query();
        $query->select('*')->from('DatAtributosNaturaleza nat')->whereIn('nat.idindicador', $idindicador);
        if ($data) {
            $query->addWhere('nat.data = ?', array($data));
        }
        $result = $query->fetchArray();
        if ($result) {
            return true;
        }
        return false;
    }

    /**
     * Método para verificar la existencia de un atributo dinamico configurado para un indicador
     *
     * @param $idindicador id del indicador
     *                     $campo idcampo del atributo
     *
     * @return boolean
     */
    public function existsAtributoIndicador($idindicador, $campo) {
        $query = new Doctrine_Query();
        $query->select('*')->from('DatAtributosIndicador ind')->whereIn('ind.idindicador', $idindicador);
        if ($campo) {
            $query->addWhere('ind.idatributodinamico = ?', array($campo));
        }
        $result = $query->fetchArray();
        if ($result) {
            return true;
        }
        return false;
    }

    /**
     * Método para eliminar un atributo natural configurado de un indicador
     *
     * @param Array $parametros Arreglo con los parametros para filtrar las indicadores
     *                          Boolean $medio boolean para determinar si se elimina el indicador de la configuración
     *
     * @return boolean
     */
    public function eliminarAtributoNatural($parametros, $medio) {
        $query = new Doctrine_Query();
        if (!$medio) {
            $query->delete()->from('DatAtributosNaturaleza nat')->whereIn('nat.idindicador', $parametros['idindicador'])
                    ->andWhereIn('nat.data', $parametros['data'])->execute();
        } else {
            $query->delete()->from('DatAtributosNaturaleza nat')->whereIn('nat.idindicador', $parametros)->execute();
        }


        return true;
    }

    /**
     * Método para eliminar un atributo dinamico configurado de un indicador
     *
     * @param Array $parametros Arreglo con los parametros para filtrar las indicadores
     *                          Boolean $medio boolean para determinar si se elimina el indicador de la configuración
     *
     * @return boolean
     */
    public function eliminarAtributoDinamico($parametros, $medio) {
        $query = new Doctrine_Query();
        if (!$medio) {
            $query->delete()->from('DatAtributosIndicador ind')->whereIn('ind.idindicador', $parametros['idindicador'])
                    ->andWhereIn(
                            'ind.idatributodinamico', $parametros['idatributodinamico']
                    )->execute();
        } else {
            $query->delete()->from('DatAtributosIndicador ind')->whereIn('ind.idindicador', $parametros)->execute();
        }


        return true;
    }

    /**
     * Método para cargar la configuracion de los atributos por naturaleza de un indicador
     *
     * @param Array $parametros Arreglo con los parametros para filtrar las indicadores
     *
     * @return array
     */
    public function cargarConfigIndicador($parametros) {
        $naturaleza = array();
        $query = new Doctrine_Query();
        $query->select(
                'nat.idindicador as idindicador, nat.idnaturaleza as idnaturaleza,
            nat.denominacion as denominacion, nat.data as data, nat.idtabla as idtabla,
            nat.identificador as identificador'
        )->from('DatAtributosNaturaleza nat');
        $resultado = $query->fetchArray();
        $i = 0;
        foreach ($resultado as $row) {
            $naturaleza[$i]['idindicador'] = $row['idindicador'];
            $naturaleza[$i]['idnaturaleza'] = $row['idnaturaleza'];
            $naturaleza[$i]['idtabla'] = $row['idtabla'];
            if (count($this->devolverRecuperables($row['idindicador'])) > 0) {
                $naturaleza[$i]['recuperable'] = '1';
            } else {
                $naturaleza[$i]['recuperable'] = '0';
            }
            $naturaleza[$i]['denominacion'] = [$row['denominacion'], $row['data'], $row['identificador']];
            $i++;
        }
        $query->select('din.idindicador as idindicador')
                ->from('DatAtributosIndicador din');
        $dinamicos = $query->fetchArray();
        $naturaleza = $this->pushDinamicos($dinamicos, $naturaleza);
        $obtener = $this->agruparAtributosNaturaleza($naturaleza, 'idindicador');
        return $this->addResultLimits($obtener, $parametros);
    }

    public function pushDinamicos($dinamicos, $naturaleza) {
        foreach ($dinamicos as $din) {
            $add = true;
            foreach ($naturaleza as $nat) {
                if ($din['idindicador'] == $nat['idindicador']) {
                    $add = false;
                    break;
                }
            }
            if ($add) {
                if (count($this->devolverRecuperables($din['idindicador'])) > 0) {
                    array_push(
                            $naturaleza, array('idindicador' => $din['idindicador'], 'recuperable' => '1')
                    );
                } else {
                    array_push(
                            $naturaleza, array('idindicador' => $din['idindicador'], 'recuperable' => '0')
                    );
                }
            }
        }
        return $naturaleza;
    }

    /**
     * Método auxiliar para devolver los atributos recuperables
     *
     * @param $idindicador id del indicador
     *
     * @return array
     */
    public function devolverRecuperables($idindicador) {
        $query = new Doctrine_Query();
        if ($idindicador) {
            $query->select(
                    'din.idindicador as idindicador, din.idatributodinamico as idatributodinamico,
                 din.atributoidentificador as atributoidentificador, din.nombretabla as nombretabla'
            )->from('DatAtributosIndicador din')->where('din.idindicador = ?', array($idindicador))->andWhere(
                    'din.recuperable = 1'
            );
        } else {
            $query->select(
                    'din.idindicador as idindicador, din.idatributodinamico as idatributodinamico,
                 din.atributoidentificador as atributoidentificador, din.nombretabla as nombretabla'
            )->from('DatAtributosIndicador din')->andWhere('din.recuperable = 1');
        }
        $result = $query->fetchArray();
        return $result;
    }

    public function verificarIndicadores($indicadores, $indicador) {
        $result = false;
        foreach ($indicadores as $row) {
            if ($row == $indicador) {
                $result = true;
            }
        }
        return $result;
    }

    public function mediosAtributosRecuperables($idindicador) {
        $tablas = array();
        $indicadores = array();
        $arrayIds = array();
        $resultado = array();
        $medios = $this->devolverRecuperables($idindicador);
        foreach ($medios as $index => $row) {
            $arrayIds[$index] = $row['idatributodinamico'];
            $tablas[$index] = $row['nombretabla'];
            $indicadores[$index] = $row['idindicador'];
            if (!$this->verificarIndicadores($resultado, $row['idindicador'])) {
                $resultado[$index] = $row['idindicador'];
            }
        }
        $query = new Doctrine_Query();
        foreach ($arrayIds as $row) {
            $query->select(
                    'f.idcampo as idcampo, f.longitud as longitud, cp.etiqueta as row,
                    cp.idtipocomponente as idtipocomponente'
            )->from('DatCampo f')->innerJoin('f.DatComponente cp')->where("f.idcampo = {$row}");
            $data = $query->fetchArray();
            $result[] = $data[0];
        }
        foreach ($result as $index => $row) {
            $data[$index]['indicador'] = $indicadores[$index];
            $data[$index]['idcampo'] = $row['idcampo'];
            $data[$index]['longitud'] = $row['longitud'];
            $data[$index]['label'] = $row['row'];
            $data[$index]['nombretabla'] = $tablas[$index];
            $data[$index]['tipocomponente'] = $this->devolverTipoComponente(
                    $row['idtipocomponente']
            );
            $data[$index]['idtipocomponente'] = $row['idtipocomponente'];
        }
        $results = $this->agruparAtributosDinamicos($resultado, $data);
        return array("datos" => $results, "cantidad" => count($results));
    }

    public function agruparAtributosDinamicos($result, $datos) {
        $resultado = array();
        $i = 0;
        foreach ($result as $indicador) {
            $resultado[$i]['indicador'] = $indicador;
            $resultado[$i]['atributos'] = array();
            foreach ($datos as $row) {
                if ($indicador == $row['indicador']) {
                    array_push($resultado[$i]['atributos'], $row);
                }
            }
            $i++;
        }
        return $resultado;
    }

    public function hacerRecuperable($datos) {
        if (is_array($datos[0])) {
            foreach ($datos as $row) {
                if (!$row['desmaracar']) {
                    $this->actualizarRecuperables(
                            $row['atributo'], $row['idindicador'], 1
                    );
                } else {
                    $this->actualizarRecuperables(
                            $row['atributo'], $row['idindicador'], 0
                    );
                }
            }
        } else {
            if ($datos['desmaracar'] == 0) {
                $this->actualizarRecuperables(
                        $datos['atributo'], $datos['idindicador'], 1
                );
            } else {
                if ($datos['desmaracar'] == 1) {
                    $this->actualizarRecuperables(
                            $datos['atributo'], $datos['idindicador'], 0
                    );
                } else {
                    $this->actualizarRecuperables(
                            null, $datos['idindicador'], 0
                    );
                }
            }
        }

        return true;
    }

    public function actualizarRecuperables($atributo, $indicador, $valor) {
        $query = new Doctrine_Query();
        $query->update('DatAtributosIndicador din')->set('din.recuperable', $valor)->where(
                'din.idindicador = ?', array($indicador)
        );
        if ($atributo != null) {
            $query->addWhere('din.idatributodinamico = ?', array($atributo));
        }
        $query->execute();
    }

    /**
     * Método auxiliar para agrupar los atributos por naturaleza de un indicador
     *
     * @param $array arreglo de atributos a agrupar por indicador
     *
     * @return array
     */
    public function agruparAtributosNaturaleza($array) {
        if (count($array) > 0) {
            $keys = array_keys($array[0]);
            $indicador = array_search('idindicador', $keys);
            $nomindicador = array_search('nomindicador', $keys);
            $naturaleza = array_search('idnaturaleza', $keys);
            $idtabla = array_search('idtabla', $keys);
            $recuperable = array_search('recuperable', $keys);
            unset($keys[$indicador]);
            unset($keys[$nomindicador]);
            unset($keys[$naturaleza]);
            unset($keys[$idtabla]);
            unset($keys[$recuperable]);
            $grupo = array();
            $result = array();
            foreach ($array as $value) {
                $denominacion = null;
                foreach ($keys as $key) {
                    $denominacion = $value[$key];
                }
                $exist = array_search($value['idindicador'], $grupo);
                if ($exist === false) {
                    $grupo[] = $value['idindicador'];
                    $result[] = array('idindicador' => $value['idindicador'], 'idnaturaleza' => $value['idnaturaleza'],
                        'idtabla' => $value['idtabla'], 'recuperable' => $value['recuperable'],
                        'atributos' => array());
                    $exist = count($result) - 1;
                }
                if ($denominacion) {
                    $result[$exist]['atributos'][] = $denominacion;
                }
            }
            return $result;
        } else {
            return array();
        }
    }

    /**
     * Método para cargar todos los atributos configurados de un indicador
     *
     * @param $idindicador id del indicador
     *
     * @return array
     */
    public function cargarAtributosPorIndicador($idindicador, $idmode, $params = false) {
        $arrayIds = array();
        $identificadores = array();
        $denominaciones = array();
        $arrayResultados = array();
        $campos = $this->devolverIndicadoresIdCampo($idindicador);
        foreach ($campos as $index => $row) {
            $arrayIds[$index] = $row['idatributodinamico'];
            $identificadores[$index] = $row['identificador'];
            $denominaciones[$index] = $row['nombretabla'];
        }
        if ($arrayIds) {
            $resp = $this->devolverAtributosDinamicoIndicador($idindicador);
            ;
            $etiquetasCampos = array();
            $i = 0;
            foreach ($resp as $row) {
                $etiquetasCampos[$i]['idcampo'] = $row['idcampo'];
                $etiquetasCampos[$i]['label'] = $row['denominacion'];
                $etiquetasCampos[$i]['longitud'] = $row['longitud'];
                $etiquetasCampos[$i]['tipocomp'] = $row['idtipocomponente'];
                $etiquetasCampos[$i]['identificador'] = $identificadores[$i];
                $etiquetasCampos[$i]['nombretabla'] = $denominaciones[$i];
                $i++;
            }
        }
        $indicadores = $this->devolverIndicadoresDenoNaturaleza($idindicador);
        $arrayResultados['naturaleza'] = array();
        $arrayResultados['naturaleza'] = $indicadores;
        $arrayResultados['dinamicos'] = array();
        for ($i = 0; $i < count($etiquetasCampos); $i++) {
            array_push($arrayResultados['dinamicos'], $etiquetasCampos[$i]);
        }
        $isTransgaviotasql = "select nv.valor from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'estransgaviota' and nv.valor = '1'";
        $isTransgaviota = LogisticaDoctrineHelper::__init()->getConnection()->execute($isTransgaviotasql)->fetchAll(PDO::FETCH_COLUMN);
        if (count($isTransgaviota) > 0) {
            $sql = "select mar.denominacion as marca, mo.denominacion as modelo
                    from mod_datosmaestros.nom_indicador ni 
                    inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
                    left join mod_datosmaestros.nom_marca mar on mar.idmarca = nih.idmarca
                    left join mod_datosmaestros.nom_modelo mo on mo.idmodelo = nih.idmodelo
                    where ni.idindicador = {$idindicador}";
            $data = $this->_doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            $marca = $modelo = '';
            if (count($data)) {
                $marca = $data[0]['marca'];
                $modelo = $data[0]['modelo'];
            }
            if (count($arrayResultados['naturaleza'])) {
                array_push($arrayResultados['naturaleza'], array(
                    'label' => "Marca",
                    'longitud' => 50,
                    'tipocomp' => 4,
                    'value' => $marca,
                    'identificador' => 0,
                    'disabled' => 1,
                    'name' => 'marca'
                ));
                array_push($arrayResultados['naturaleza'], array(
                    'label' => "Modelo",
                    'longitud' => 50,
                    'tipocomp' => 4,
                    'value' => $modelo,
                    'identificador' => 0,
                    'disabled' => 1,
                    'name' => 'modelo'
                ));
            } else if (count($arrayResultados['dinamicos'])) {
                array_push($arrayResultados['dinamicos'], array(
                    'label' => "Marca",
                    'longitud' => 50,
                    'tipocomp' => 4,
                    'value' => $marca,
                    'identificador' => 0,
                    'disabled' => 1,
                    'name' => 'marca'
                ));
                array_push($arrayResultados['dinamicos'], array(
                    'label' => "Modelo",
                    'longitud' => 50,
                    'tipocomp' => 4,
                    'value' => $modelo,
                    'identificador' => 0,
                    'disabled' => 1,
                    'name' => 'modelo'
                ));
            }
        }
        if ($idmode && $idmode == 'medioscliente') {
            $sql = "select ni.numeropieza, cl.codigoaux, mar.denominacion as marca, mo.denominacion as modelo
                    from mod_datosmaestros.nom_indicador ni 
                    inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
                    inner join mod_datosmaestros.dat_indicadorcliente cl on cl.idindicador = ni.idindicador and cl.estado = 1
                    left join mod_datosmaestros.nom_marca mar on mar.idmarca = nih.idmarca
                    left join mod_datosmaestros.nom_modelo mo on mo.idmodelo = nih.idmodelo
                    where ni.idindicador = {$idindicador}";
            $data = $this->_doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            $matricula = $serie = $marca = $modelo = '';
            if (count($data)) {
                $matricula = $data[0]['codigoaux'];
                $serie = $data[0]['numeropieza'];
                ;
                $marca = $data[0]['marca'];
                ;
                $modelo = $data[0]['modelo'];
                ;
            }
            array_push($arrayResultados['dinamicos'], array(
                'label' => "matricula",
                'longitud' => 10,
                'tipocomp' => 4,
                'value' => $matricula,
                'identificador' => 1,
                'disabled' => 1,
                'name' => 'chapa'
            ));
            array_push($arrayResultados['dinamicos'], array(
                'label' => "serie/VIN",
                'longitud' => 50,
                'tipocomp' => 4,
                'value' => $serie,
                'identificador' => 0,
                'disabled' => 1,
                'name' => 'vim'
            ));
            array_push($arrayResultados['dinamicos'], array(
                'label' => "marca",
                'longitud' => 50,
                'tipocomp' => 4,
                'value' => $marca,
                'identificador' => 0,
                'disabled' => 1,
                'name' => 'marca'
            ));
            array_push($arrayResultados['dinamicos'], array(
                'label' => "modelo",
                'longitud' => 50,
                'tipocomp' => 4,
                'value' => $modelo,
                'identificador' => 0,
                'disabled' => 1,
                'name' => 'modelo'
            ));
        }
        if ($idmode && $idmode == 'tallaft') {
            $sql = "select distinct ni.numeropieza, mar.denominacion as marca, mo.denominacion as modelo,drnp.nromatricula as matricula
                    from mod_datosmaestros.nom_indicador ni 
                    inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
                    left join mod_datosmaestros.nom_marca mar on mar.idmarca = nih.idmarca
                    left join mod_datosmaestros.nom_modelo mo on mo.idmodelo = nih.idmodelo
                    left join mod_logistica.dat_producto dp on dp.idindicador = ni.idindicador
                    left join mod_logactivofijotangible.dat_registronumerico drn on drn.idproducto = dp.idproducto
                    left join mod_logactivofijotangible.dat_regnumericoactivotransp drnp on drnp.idregnumerico = drn.idregnumerico
                    where ni.idindicador = {$idindicador} and drnp.idregnumerico = {$params['idregnumerico']}";
            $data = $this->_doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            $matricula = $serie = $marca = $modelo = '';
            if (count($data)) {
                $matricula = $data[0]['matricula'];
                $serie = $data[0]['numeropieza'];
                ;
                $marca = $data[0]['marca'];
                ;
                $modelo = $data[0]['modelo'];
                ;
            }
            array_push($arrayResultados['dinamicos'], array(
                'label' => "matricula",
                'longitud' => 10,
                'tipocomp' => 4,
                'value' => $matricula,
                'identificador' => 1,
                'disabled' => 1,
                'name' => 'chapa'
            ));
            array_push($arrayResultados['dinamicos'], array(
                'label' => "serie/VIN",
                'longitud' => 50,
                'tipocomp' => 4,
                'value' => $serie,
                'identificador' => 0,
                'disabled' => 1,
                'name' => 'vim'
            ));
            array_push($arrayResultados['dinamicos'], array(
                'label' => "marca",
                'longitud' => 50,
                'tipocomp' => 4,
                'value' => $marca,
                'identificador' => 0,
                'disabled' => 1,
                'name' => 'marca'
            ));
            array_push($arrayResultados['dinamicos'], array(
                'label' => "modelo",
                'longitud' => 50,
                'tipocomp' => 4,
                'value' => $modelo,
                'identificador' => 0,
                'disabled' => 1,
                'name' => 'modelo'
            ));
        }


        return $arrayResultados;
    }

    /**
     * Método para devolver los idscampos de los atributos dinamicos de un indicador
     *
     * @param $idindicador id del indicador
     *
     * @return array
     */
    public function devolverIndicadoresIdCampo($idindicador) {
        new DatAtributosIndicador();
        if ($idindicador) {
            $query = new Doctrine_Query();
            $query->select(
                    'ind.idindicador, ind.idatributodinamico, ind.nombretabla as nombretabla,
                ind.recuperable as recuperable, ind.identificador as identificador'
            )->from('DatAtributosIndicador ind')->whereIn('ind.idindicador', $idindicador)->orderBy(
                    'ind.idatributodinamico'
            );
            $result = $query->fetchArray();
            return $result;
        }
    }

    /**
     * Método para devolver las denominaciones de los atributos por naturaleza de un indicador
     *
     * @param $idindicador id del indicador
     *
     * @return array
     */
    public function devolverIndicadoresDenoNaturaleza($idindicador) {
        if ($idindicador) {
            $query = new Doctrine_Query();
            $query->select(
                    'nat.idindicador as indicador, nat.denominacion as denominacion,
                            nat.data as nombretabla, nat.identificador as identificador'
            )->from('DatAtributosNaturaleza nat')->where('nat.idindicador = ?', array($idindicador));
            $result = $query->fetchArray();
            return $result;
        }
    }

    /**
     * Método para devolver los atributos dinamicos de un indicador
     *
     * @param $idindicador id del indicador
     *
     * @return array
     */
    public function devolverAtributosDinamicoIndicador($idindicador) {
        $idsCampos = $this->devolverIndicadoresIdCampo($idindicador);
        $result = array();
        $data = array();
        if ($idsCampos) {
            $idcampo = array();
            $identificadores = array();
            $names = array();
            foreach ($idsCampos as $index => $row) {
                $idcampo[] = $row['idatributodinamico'];
                $identificadores[] = $row['identificador'];
                $recuperables[] = $row['recuperable'];
                $names[] = $row['nombretabla'];
            }
            $query = new Doctrine_Query();
            foreach ($idcampo as $row) {
                $query->select(
                        'f.idcampo as idcampo, f.longitud as longitud, cp.etiqueta as denominacion,
                    cp.idtipocomponente as idtipocomponente'
                )->from('DatCampo f')->innerJoin('f.DatComponente cp')->where("f.idcampo = {$row}");
                $data = $query->fetchArray();
                $result[] = $data[0];
            }
            foreach ($result as $index => $row) {
                $data[$index]['idcampo'] = $row['idcampo'];
                $data[$index]['longitud'] = $row['longitud'];
                $data[$index]['denominacion'] = $row['denominacion'];
                $data[$index]['identificador'] = $identificadores[$index];
                $data[$index]['recuperable'] = $recuperables[$index];
                $data[$index]['idindicador'] = $idindicador;
                $data[$index]['name'] = $names[$index];
                $data[$index]['tipocomponente'] = $this->devolverTipoComponente(
                        $row['idtipocomponente']
                );
                $data[$index]['idtipocomponente'] = $row['idtipocomponente'];
            }
            return $data;
        }
    }

    /**
     * Método para devolver el tipo de componente de un atributo dinamico de un indicador
     *
     * @param $idtipocomponente id del tipo de componete
     *
     * @return string
     */
    public function devolverTipoComponente($idtipocomponente) {
        if (!$idtipocomponente) {
            $idtipocomponente = -1;
        }
        $q = Doctrine_Query:: create();
        $q->from('NomTipoComponente  tcp')->select('tcp.tipocomponente as tipocomponente')->whereIn(
                'tcp.idtipocomponente', $idtipocomponente
        )->setHydrationMode(Doctrine :: HYDRATE_RECORD)->execute();
        $result = $q->fetchArray();
        return array_pop($result)['tipocomponente'];
    }

    /**
     * Método para eliminar los indicadores de la configuración
     *
     * @param $idindicador id del indicador
     *
     * @return boolean
     */
    public function eliminarIndicador($idindicador) {
        $exito = false;
        foreach ($idindicador as $row) {

            $exist = $this->indicadorUso($row);
            if (!$exist) {
                $this->eliminarAtributoNatural($row, true);
                $this->eliminarAtributoDinamico($row, true);
                $exito = true;
            }
        }
        return $exito;
    }

    /**
     * Método para verificar si los indicadores est'an en uso
     *
     * @param $idindicador id del indicador
     *
     * @return boolean
     */
    public function indicadorUso($idindicador) {
        $query = new Doctrine_Query();
        $query->select('*')->from('DatMedio medio')->whereIn('medio.idindicador', $idindicador);
        $exist = $query->fetchArray();
        if (count($exist) > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Método para establecer un atributo dinámico como identificador
     *
     * @param $datos array de parametros para actualizar atributo,
     *               $natural boolean para actualizar dianmicos o naturales
     *
     * @return boolean
     */
    public function establecerIdentificador($datos, $natural = false) {
        $this->reinicarAtributos($datos);
        $query = new Doctrine_Query();
        if ($natural) {
            $query->update('DatAtributosNaturaleza nat')->set('nat.identificador', 1)->where(
                    'nat.data = ?', array($datos['atributo'])
            )->andWhere('nat.idindicador = ?', array($datos['idindicador']))->execute();
        } else {
            $query->update('DatAtributosIndicador din')->set('din.identificador', 1)->where(
                    'din.idatributodinamico = ?', array($datos['atributo'])
            )->andWhere('din.idindicador = ?', array($datos['idindicador']))->execute();
        }
        return true;
    }

    public function reinicarAtributos($datos) {
        $queryDinamicos = new Doctrine_Query();
        $queryNaturales = new Doctrine_Query();
        $queryDinamicos->update('DatAtributosIndicador din')->set('din.identificador', 0)->where(
                'din.idindicador = ?', array($datos['idindicador'])
        )->execute();

        $queryNaturales->update('DatAtributosNaturaleza nat')->set('nat.identificador', 0)->where(
                'nat.idindicador = ?', array($datos['idindicador'])
        )->execute();
    }

    /**
     * Funcion que parametriza la cantidad de resultados que se devuelve
     *
     * @param Array $array
     * @param Array $params Arreglo que contiene los parametros de offset y limite
     *
     * @return Array $result
     */
    public function addResultLimits($array = array(), $params = array()) {
        $result = array();
        $valores = array();
        $this->_limitOld += $params['start'] + $params['limit'];
        for ($i = $params['start']; $i < $this->_limitOld; $i++) {
            if (count($array) == $i) {
                break;
            }
            array_push($valores, $array[$i]);
        }
        $result['valores'] = $valores;
        $result['cantidad'] = count($array);
        return $result;
    }

}
