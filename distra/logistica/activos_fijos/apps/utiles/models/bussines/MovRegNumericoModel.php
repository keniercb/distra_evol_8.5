<?php

/**
 *
 */
class MovRegNumericoModel extends AbstractCompositeModel /* BaseModel */
{
    protected $sConfActivos,
        $idmonedaAlt,
        $idmonedaCont,
        $codigo;

    /**
     *
     */
    public function __construct()
    {
        parent::__construct();
        JSONComponent::__init()->loadDefinitionsFile('cmp.definitions')->buildComponent('log.aft.regnumerico');
        $this->sConfActivos = new ConfiguracionActivosService();
        $this->primaryKeyField = "idmovregnumerico";
        $this->initRelations();


        $monedaContable = $this->configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
        foreach ($monedaContable['datos'] as $value) {
            if ($value['dualidad'] == 1) {
                $this->idmonedaAlt = $value['idmoneda'];
                $this->codigo['alternativa'] = $value['codigoiso'];
            } else if ($value['tipomoneda'] == 0) {
                $this->idmonedaCont = $value['idmoneda'];
                $this->codigo['contable'] = $value['codigoiso'];
            }
        }
    }

    public function initRelations()
    {
        return;
    }

    /**
     *
     */
    protected function getWhere($query, $alias, $parametros)
    {
        /* hay que implementarlo */
        return $query;
    }

    /**
     *
     */
    public function initBaseModel()
    {
        $this->baseModel = new DatMovRegnumerico();
    }

    /**
     *
     */
    public function addJoinModel(
    Doctrine_Query $query, $aliasExterno, $aliasLocal = 'mrn', $includeSelect = true, $parametros = array(), $join = 1
    )
    {
        if ($join == 1) {
            $query->innerJoin("{$aliasExterno}.DatMovRegnumerico {$aliasLocal}");
        } else {
            $query->leftJoin("{$aliasExterno}.DatMovRegnumerico {$aliasLocal}");
        }

        if ($includeSelect) {
            $query->addSelect($this->getQuerySelectFields($aliasLocal));
        }

        if (count($parametros)) {
            $this->getWhere($query, $aliasLocal, $parametros);
        }

        return $query;
    }

    /**
     *
     */
    public function addQueryFilters(Doctrine_Query $query, $aliasTabla, $parametros = array())
    {
        
    }

    /**
     *
     */
    public function getQuerySelectFields($alias)
    {
        return "
            {$alias}.idmovregnumerico as idmovregnumerico,
            {$alias}.idregnumerico as idregnumerico,
            {$alias}.idmovimiento as idmovimiento
        ";
    }

    /**
     *
     */
    public function beforeDelete($parametros)
    {
        
    }

    /**
     *
     */
    public function initBaseRelation(Doctrine_Record $model)
    {
        
    }

    /**
     *
     */
    public function getIdMovRegNumericoActivo($idRegNumerico)
    {
        $subQuery = new Doctrine_Query();
        $subQuery->select('MAX(d.cronologia) as cronologia')
            ->from('DatMovRegnumerico mrn')
            ->innerJoin('mrn.DatMovimientos m')
            ->innerJoin('m.DatDocumento d')
            ->addWhere('mrn.idregnumerico = ?', $idRegNumerico);

        $cronologia = $subQuery->fetchOne()->cronologia;

        $query = new Doctrine_Query();

        $query->select('mrn.idmovregnumerico')
            ->from('DatMovRegnumerico mrn')
            ->innerJoin('mrn.DatMovimientos m')
            ->innerJoin('m.DatDocumento d')
            ->addWhere('mrn.idregnumerico = ?', array($idRegNumerico))
            ->addWhere('d.cronologia = ?', array($cronologia));

        return $query->fetchOne()->idmovregnumerico;
    }

    /**
     *
     */
    public function getCantidadMovRegNumPorDocumento($idDocumento)
    {
        $query = new Doctrine_Query();

        $query->from('DatMovRegnumerico mrn')
            ->innerJoin('mrn.DatMovimientos m')
            ->addWhere('m.iddocumento = ?', array($idDocumento));

        return $query->count();
    }

    /**
     *
     */
    public function getIdesRegNumByIdDocumento($idDocumento)
    {
        $arrIdRegNumerico = array();
        $query = new Doctrine_Query();

        $query->select('mrn.idregnumerico')
            ->from('DatMovRegnumerico mrn')
            ->innerJoin('mrn.DatMovimientos m')
            ->addWhere('m.iddocumento = ?', array($idDocumento));


        foreach ($query->fetchArray() as $value) {
            array_push($arrIdRegNumerico, $value['idregnumerico']);
        }

        return $arrIdRegNumerico;
    }

    /**
     *
     */
    public function getMovDadoDocumento($idDocumento)
    {
        $query = new Doctrine_Query();

        $query->from('DatMovimientos m')
            ->innerJoin('m.DatMovRegnumerico mrn')
            ->addWhere('m.iddocumento = ?', array($idDocumento));

        return $query->fetchArray();
    }

    /**
     *
     */
    public function addJoinModelMy(Doctrine_Query $dql, $asExt, $asLoc = 'rn', $join = 1)
    {
        if ($join == 1) {
            $dql->innerJoin("{$asExt}.DatMovRegnumerico {$asLoc}");
        } else {
            $dql->leftJoin("{$asExt}.DatMovRegnumerico {$asLoc}");
        }
    }

    public function incrementarCantidadMovimiento($idMovimiento, $cantidad)
    {
        $mov = Doctrine::getTable('DatMovimientos')->find($idMovimiento);
        $mov->cantidad = $mov->cantidad + $cantidad;
        $mov->save();
    }

    public function decrementarCantidadMovimiento($idMovimiento, $cantidad)
    {
        $mov = Doctrine::getTable('DatMovimientos')->find($idMovimiento);
        $mov->cantidad = $mov->cantidad - $cantidad;
        $mov->save();
    }

    /**
     * Devuelve todos los movimientos de los registros numéricos dado un idmovimiento
     */
    public function getDqlMovsRegNumericos($parametros, $alias)
    {
        $dql = new Doctrine_Query();

        $dql->select(
                "rn.idregnumerico,
            rn.nroserie as nroserie,
            $alias.idmovregnumerico as idmovregnumerico,
            $alias.idmovimiento as idmovimiento,
            "
            )
            ->from("DatRegnumerico rn")
            ->innerJoin("rn.DatMovRegnumerico $alias")
            ->orderBy('rn.idregnumerico DESC');

        if ($parametros['limit']) {
            $dql->offset($parametros['start'])->limit($parametros['limit']);
        }
        if ($parametros['nroserie']) {
            $dql->addWhere(
                "rn.nroserie LIKE '%".$parametros['nroserie']."%'"
            );
        }
        if ($parametros['idmovimiento']) {
            $dql->addWhere(
                "$alias.idmovimiento = ?", array($parametros['idmovimiento'])
            );
        }

        return $dql;
    }

    public function salvarMovActivosEntrada($parametros, $datos_oper = false)
    {
       // print_r($parametros);die;
        $valuesRepetidos = array();
        $collectionActivos = new Doctrine_Collection('DatRegnumerico');
        $mRegNumActivo = new RegNumericoActivoModel();
        $sConfigActivos = new ConfiguracionActivosService();
        $cfg = $sConfigActivos->getConfiguracionPG($this->global->Estructura->idestructura);
        foreach ($parametros->activos as $valueAux) {
            $valueAux->idestatustecnico = $valueAux->iddenomestadotecnico;
            // if ($valueAux->nroinventario && $cfg[0]['prefijo']) {
            //     $valueAux->nroinventario = str_replace($cfg[0]['prefijo'], "", ($valueAux->nroinventario));
            // }
            $datos = (array) $valueAux;
            foreach ($this->listaPlugins as $plug) {
                $val = $plug->preBeforeSaveMov($datos);
//                if ($val) {
//                    return array('fail' => $val);
//                }
            }
            if ($datos['nroserie']) {
                $existe = $mRegNumActivo->existeRegNumerico(
                    $datos['nroserie'], $datos['idregnumerico'], $this->global->Estructura->idestructura
                );
            }
            if ($existe && $datos['forzado'] == false) {
                $valuesRepetidos[] = $datos['nroserie'];
            } else {
                //  Preparando los datos del responsable

                    $idResponsable = $this->sConfActivos->getResponsableByAreaAndPerson(
                        $datos['idarearesp'], $datos['idresponsable']
                    );
                    if ($idResponsable != null) {
                        $datos['idresponsable'] = $idResponsable;
                    }
                          
                //  Adicionando los datos
                $regNumerico = $this->salvarMovRegNumerico($datos, false, $datos_oper);
                $collectionActivos->add($regNumerico);
                /**
                 * Cuando se apruebe el documento el estado lo coge del movimiento del registro numerico.
                 *
                 * Esto se comentario porque al eliminar el mov el rn se queda con el estado null y no lo carga en
                 * los rn disponibles.
                 */
                if (!$datos['idregnumerico']) {
                    $this->incrementarCantidadMovimiento($datos['idmovimiento'], 1);
                }
            }
        }
        if (count($valuesRepetidos)) {
            return $valuesRepetidos;
        } else {
            $collectionActivos->save();
            return 2;
        }
    }

    private function devolverPosMovRegNumerico($arreglo, $idMovRegNumerico)
    {
        foreach ($arreglo as $key => $movreg) {
            if ($movreg['idmovregnumerico'] == $idMovRegNumerico) {
                return $key;
            }
        }
    }

    /**
     *
     */
    public function salvarMovRegNumerico($datos, $inventario = false, $datos_oper = false)
    {
        $cDatRegnumericoActivo = 'DatRegnumericoActivo';
        $cDatMovRegnumericoActivo = 'DatMovRegnumericoActivo';
        $cDatMovRegnumerico = 'DatMovRegnumerico';
        $cDatMovRegnumericoInventario = 'DatMovRegnumericoInventario';
        /* if (!$datos['idarearesp'] || $datos['idarearesp'] == null) {
          $datos['idarearesp'] = 100000033;
          } */
        $mRegNumActivo = new RegNumericoActivoModel();
        if (!$datos['idestatustecnico'] && $datos['iddenomestadotecnico']) {
            $datos['idestatustecnico'] = $datos['iddenomestadotecnico'];
        }

        foreach ($datos as $pos => $item) {
            if ($datos[$pos] === "") {
                $datos[$pos] = null;
            }
        }

        $regNumerico = $mRegNumActivo->crearObjRegNumerico($datos);
        // Esto es para conocer que el registro esta siendo usado en un documento que no esta aprobado.
        $regNumerico->enproceso = 1;

        $datosRegActAux = $datos;
        if ($datos_oper && $datos_oper['codigo'] == 'OPER_MOD_PROPIEDAD') {
            unset($datosRegActAux['idgruposubgrupo']);
            unset($datosRegActAux['gruposubgrupo']);
        }
        $regNumerico->$cDatRegnumericoActivo->synchronizeWithArray($datosRegActAux);//Es Aqui
        $dataMovRegNumerico = $regNumerico->$cDatMovRegnumerico->toArray();
        $pos = $this->devolverPosMovRegNumerico($dataMovRegNumerico, $datos['idmovregnumerico']);

        $plug = $this->getListaPlugins();

        $result = $this->modificarMovRegistro($datos);

        $array = array_merge($datos, $result);
        $array['fechafianl'] = $array['fechaexpfin'];

        $regNumerico->{$cDatMovRegnumerico}[$pos]->{$cDatMovRegnumericoActivo}->synchronizeWithArray($array);
        if ($inventario) {
            new DatMovRegnumericoInventario();
            $regNumerico->{$cDatMovRegnumerico}[$pos]->{$cDatMovRegnumericoActivo}->{$cDatMovRegnumericoInventario}
                ->synchronizeWithArray($datos);
        }
   
        foreach ($this->listaPlugins as $plug) {
            $plug->beforeSaveMov($regNumerico->{$cDatMovRegnumerico}[$pos]->{$cDatMovRegnumericoActivo}, $array);
        }

        //Gestion de monedas
        if (count($datos['monedas']) > 0) {
            $this->initMonedaMovRelation($regNumerico->{$cDatMovRegnumerico}[$pos]->{$cDatMovRegnumericoActivo});
            $regNumerico->{$cDatMovRegnumerico}[$pos]->{$cDatMovRegnumericoActivo}->DatMovRegnumericoMoneda;
            $this->adicionarMonedaAlMovimiento(
                $datos['monedas'],
                $regNumerico->{$cDatMovRegnumerico}[$pos]->{$cDatMovRegnumericoActivo}->DatMovRegnumericoMoneda);
        }

        $valor = ($datos['valorcontable'] + $datos['diferenciavalor']) - ($datos['depreciacionacumulada'] + $datos['diferenciadepreciacion']);
        $valtr = ($datos['valorcontablealternativo'] + $datos['diferenciavaloralternativo']) - ($datos['depreciacionacumuladaalternativo'] + $datos['diferenciadepreciacionalternativo']);

        if($valor < 0 && $valtr < 0){
            throw new LogisticaException('LOG_AFT_MOV_001');
        }

        return $regNumerico;
    }

    private function initMonedaMovRelation(Doctrine_Record $model)
    {
        $array[] = array('cardinalidad' => 'many',
            'relation' => 'DatMovRegnumericoMoneda',
            'properties' => array('local' => 'idmovregnumerico',
                'foreign' => 'idmovregnumerico'));
        LogisticaDoctrineHelper::__init()->tryInyectRelactions($model, $array);
    }

    private function modificarMovRegistro($datos)
    {
        if (count($datos['monedas']) > 0) {
            $valorcontable = $valorcontableAlt = $valorcontableOtro = 0;
            $depreciacionacumulada = $depreciacionacumuladaAlt = $depreciacionacumuladaOtro = 0;
            $valoradquisicion = $valoradquisicionAlt = $valoradquisicionOtro = 0;
            foreach ($datos['monedas'] as $pos => $item) {
                //Moneda contable
                if ($item->idmoneda == $this->idmonedaCont) {
                    $valorcontable = (float) $item->valorcontable;
                    $depreciacionacumulada = (float) $item->depreciacionacumulada;
                    $valoradquisicion = (float) $item->valoradquisicion;
                }
                //Moneda alternativa
                if ($item->idmoneda == $this->idmonedaAlt) {
                    $valorcontableAlt = (float) $item->valorcontable;
                    $depreciacionacumuladaAlt = (float) $item->depreciacionacumulada;
                    $valoradquisicionAlt = (float) $item->valoradquisicion;
                }
                //Otras monedas
                if ($item->idmoneda != $this->idmonedaAlt && $item->idmoneda != $this->idmonedaCont) {
                    $valorcontableOtro = $this->configuracionHelper->convertirImporte(
                        $item->idmoneda, $this->idmonedaAlt, 3, $item->valorcontable, 0
                    );
                    $depreciacionacumuladaOtro = $this->configuracionHelper->convertirImporte(
                        $item->idmoneda, $this->idmonedaAlt, 3, $item->depreciacionacumulada, 0
                    );
                    $valoradquisicionOtro = $this->configuracionHelper->convertirImporte(
                        $item->idmoneda, $this->idmonedaAlt, 3, $item->valoradquisicion, 0
                    );
                }
                $valorcontableAlt += is_numeric($valorcontableOtro) ? $valorcontableOtro : 0;
                $depreciacionacumuladaAlt += is_numeric($depreciacionacumuladaOtro) ? $depreciacionacumuladaOtro : 0;
                $valoradquisicionAlt += is_numeric($valoradquisicionOtro) ? $valoradquisicionOtro : 0;
            }
            $valorcontable = ($valorcontable == 0) ? $valoradquisicion : $valorcontable;
            $valorcontableAlt = ($valorcontableAlt == 0) ? $valoradquisicionAlt : $valorcontableAlt;
            $datosAct = array(
                'valorcontable' => $valorcontable,
                'valorcontablealternativo' => $valorcontableAlt,
                'depreciacionacumulada' => $depreciacionacumulada,
                'depreciacionacumuladaalternativo' => $depreciacionacumuladaAlt,
                'valoradquisicion' => $valoradquisicion,
                'valoradquisicionalternativo' => $valoradquisicionAlt,
            );
            return $datosAct;
        } else {
            return $datos;
        }

    }

    public function adicionarMonedaAlMovimiento($datos, $model)
    {
        foreach ($datos as $pos => $item) {
            $salvar = array();
            $salvar['depreciacionacumulada'] = (float)$item->depreciacionacumulada;
            $salvar['valoradquisicion'] = (float)$item->valoradquisicion;
            if ($item->valorcontable == 0 || $item->valorcontable == '')
                $salvar['valorcontable'] = (float)$item->valoradquisicion - (float)$item->depreciacionacumulada;
            else
                $salvar['valorcontable'] = (float)$item->valorcontable - (float)$item->depreciacionacumulada;
            $salvar['idmoneda'] = $item->idmoneda;
            $model[$pos]->synchronizeWithArray($salvar);
        }
    }

    /**
     * Devuelve los tipos de monedas de la entidad.
     * @return array
     */
    public function cargarTipoMonedas()
    {
        $monedas = $this->configuracionHelper->obtenerMonedasPorEntidad($this->global->Estructura->idestructura);
        return array('datos' => $monedas['datos'], 'cantidad' => count($monedas['datos']));
    }

    /**
     * Devuelve las monedas de un movimiento.
     * @param array $filtro
     * @return array
     */
    public function cargarMonedas($filtro)
    {
        $filtro['idmovregnumerico'] = ($filtro['idmovregnumerico'] == "") ? null : $filtro['idmovregnumerico'];
        $query = Doctrine_Query::create()
            ->select(
                'm.idmovregnumericomoneda, m.idmovregnumerico, m.idmoneda, round(m.valorcontable, 6) AS valorcontable,
                round(m.valoradquisicion, 6) AS valoradquisicion,
                round(m.depreciacionacumulada, 6) AS depreciacionacumulada, '
            )
            ->from('DatMovRegnumericoMoneda m')
            ->where('m.idmovregnumerico = ?', $filtro['idmovregnumerico']);

        return array('datos' => $query->fetchArray(), 'cantidad' => $query->count());
    }

    public function eliminarMoneda($filtro)
    {
        $datos = array();
        $collection = new Doctrine_Collection('DatMovRegnumericoActivo');
        $mRegNumActivo = new DatMovRegnumericoActivo();
        $mRegNumActivo->assignIdentifier($filtro['idmovregnumerico']);

        if ($filtro['idmoneda'] == $this->idmonedaCont) {
            $datos['valorcontable'] = 0;
            $datos['depreciacionacumulada'] = 0;
            $datos['valoradquisicion'] = 0;
            $mRegNumActivo->synchronizeWithArray($datos);
        } else {
            $result = $this->actualizarValores($filtro);
            $mRegNumActivo->synchronizeWithArray($result);
        }
        $collection->add($mRegNumActivo);
        $collection->save();

        $query = Doctrine_Query::create()
                ->delete()
                ->from('DatMovRegnumericoMoneda m')
                ->where('m.idmovregnumericomoneda = ?', $filtro['idmovregnumericomoneda'])->execute();
        return array('success' => true);
    }

    private function actualizarValores($filtro)
    {
        $array = array();
        $query = Doctrine_Query::create()
            ->select('m.valorcontablealternativo, m.depreciacionacumuladaalternativo,
            m.valoradquisicionalternativo')
            ->from('DatMovRegnumericoActivo m')
            ->where('m.idmovregnumerico = ?', $filtro['idmovregnumerico']);
        $result = $query->fetchArray()[0];

        $array['valorcontablealternativo'] = $result['valorcontablealternativo'] - $filtro['valorcontable'];
        $array['depreciacionacumuladaalternativo'] = $result['depreciacionacumuladaalternativo'] - $filtro['depreciacionacumulada'];
        $array['valoradquisicionalternativo'] = $result['valoradquisicionalternativo'] - $filtro['valoradquisicion'];

        return $array;
    }

}
