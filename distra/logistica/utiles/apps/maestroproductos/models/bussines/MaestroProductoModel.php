<?php

/**
 * Description of MaestroProductoModel
 * @author        Kenier Cumba Bueno
 * @copyright (c) 2014, XETID
 */
class MaestroProductoModel extends BaseModel
{

    const TIPO_PRODUCTO = 1,
    TIPO_SERVICIO = 2,
    FORMA_ALM_LINEAL = 1,
    FORMA_ALM_SERIAL = 2,
    FORMA_ALM_LOTE = 3;

    private $maestroPlanificacion, $validator, $filtrarCentros, $esFarmacia;

    /**
     * @param boolean $filtrarCentros
     */
    public function setFiltrarCentros($filtrarCentros)
    {
        $this->filtrarCentros = $filtrarCentros;
    }

    public function __construct()
    {
        parent::__construct(true);
        $this->maestroPlanificacion = new MaestroPlanificacionModel;
        $this->maestroPlanificacion->setMaestroProducto($this);
        $this->validator = new MaestroProductoValidator();
        $this->filtrarCentros = false;
        $this->esFarmacia = (new VariablesGlobalesModel())->obtenerValor('farmacia');
        $this->initRelations();
    }

    public function initRelations($params = null)
    {
        $relations = array();
        array_push(
            $relations, array(
                'cardinalidad' => 'one',
                'relation' => 'NomNaturaleza',
                'properties' => array('local' => 'idnaturaleza', 'foreign' => 'idnaturaleza'),
            )
        );
        array_push(
            $relations, array(
                'cardinalidad' => 'one',
                'relation' => 'NomUnidadmedida',
                'properties' => array('local' => 'idumedida', 'foreign' => 'idunidadmedida'),
            )
        );
        $this->doctrineHelper->tryInyectRelactions(new NomIndicador, $relations);

        if (class_exists('NomUnidadmedida')) {
            $relations = array();
            array_push(
                $relations, array(
                    'cardinalidad' => 'one', 'relation' => 'NomFactorconversion',
                    'properties' => array('local' => 'idunidadmedida', 'foreign' => 'idunidadmedida'),
                )
            );
            array_push(
                $relations, array(
                    'cardinalidad' => 'one', 'relation' => 'NomIndicador',
                    'properties' => array('local' => 'idunidadmedida', 'foreign' => 'idumedida'),
                )
            );
            $this->doctrineHelper->tryInyectRelactions(new NomUnidadmedida, $relations);
        }
        if (!is_null($params)) {
            foreach ($params as $c => $relations) {
                $clase = "{$c}";
                $this->doctrineHelper->tryInyectRelactions(new $clase, $relations);
            }
        }
    }

    private function salvarImagenes(NomIndicador $indicador, $datosIndicador = array())
    {
        if (is_array($datosIndicador['idImagenes'])) {
            $collImagenes = new Doctrine_Collection('DatImagenindicador');
            foreach ($datosIndicador['idImagenes'] as $idIamagen) {
                if ((!is_null($idIamagen) && !is_null($indicador->idindicador)) && !$this->existeImagen(
                    $idIamagen, $indicador->idindicador
                )
                ) {
                    $record = new DatImagenindicador;
                    $record->synchronizeWithArray(
                        array(
                            'idimagen' => $idIamagen,
                            'idindicador' => $indicador->idindicador,
                        )
                    );
                    $collImagenes->add($record);
                }
            }
            $collImagenes->save();
        }
        return true;
    }

    /**
     * @param type $indicador
     * @param type $dataProducto
     */
    private function salvarUltimoNivel($indicador, $dataProducto)
    {
        if ($dataProducto['nivelsurtido']) {
            $hoja = new NomIndicadorhoja();
            if (!is_null($dataProducto[$dataProducto['primaryKeyField']])) {
                $hoja->assignIdentifier($dataProducto[$dataProducto['primaryKeyField']]);
            }
            $hoja->synchronizeWithArray($dataProducto);
            $indicador->NomIndicadorhoja = $hoja;
        }
       $this->maestroPlanificacion->beforeInsertIndicador($indicador, $dataProducto);
    }

    /**
     * @param type $indicador
     * @param type $dataProducto
     */
    private function salvarDatosMedicamentos($indicador, $dataProducto)
    {
        if ($dataProducto['nivelsurtido']) {
            $medicamento = new NomIndicadormedicamento();
            $existProd = Doctrine::getTable('NomIndicadormedicamento')->find($dataProducto['idindicador']);
            if (!empty($existProd->idindicador)) {
                $medicamento->assignIdentifier($dataProducto[$dataProducto['primaryKeyField']]);
            }
            $medicamento->synchronizeWithArray($dataProducto);
            $indicador->NomIndicadormedicamento = $medicamento;
        }
    }
    

    /**
     * @param type $arrayData
     * @return type
     */
    public function addSelectionData(&$arrayData = array())
    {
        $paisArray = array();
        $fromatos = array();
        $elementos = array();
        if (count($arrayData)) {
            foreach ($arrayData as $pos => $nomenclador) {
                if (!$paisArray[$nomenclador['idpais']]) {
                    $paisArray[$nomenclador['idpais']] = $this->configuracionHelper
                        ->obtenerPaisXID($nomenclador['idpais']);
                }
                $nomenclador['idelementogasto'] = $nomenclador['idelemento'] ? $nomenclador['idelemento'] : $nomenclador['idelementogasto'];
                $nomenclador['idelementogastoalt'] = $nomenclador['idelementoalt'] ? $nomenclador['idelementoalt'] : $nomenclador['idelementogastoalt'];
                if (!array_key_exists($nomenclador['idelementogasto'], $elementos) && !is_null($nomenclador['idelementogasto'])) {
                    $elementos[$nomenclador['idelementogasto']] = $this->contabilidadHelper->obtenerElementoObjetoPorId($nomenclador['idelementogasto']);
                }
                if (!array_key_exists($nomenclador['idelementogastoalt'], $elementos) && !is_null($nomenclador['idelementogastoalt'])) {
                    $elementos[$nomenclador['idelementogastoalt']] = $this->contabilidadHelper->obtenerElementoObjetoPorId($nomenclador['idelementogastoalt']);
                }

                if (!array_key_exists($nomenclador['idformato'], $fromatos)) {
                    $fromatos[$nomenclador['idformato']] = $this->configuracionHelper
                        ->buscarParteFormato($nomenclador['idformato']);
                }
                $arrayData[$pos]['nacionalidad'] = $paisArray[$nomenclador['idpais']]['siglas'];
                $arrayData[$pos]['naturaleza'] = ($nomenclador['naturaleza']) ? $nomenclador['naturaleza'] : $nomenclador['NomNaturaleza']['denominacion'];
                $arrayData[$pos]['dnivel'] = $fromatos[$nomenclador['idformato']][$nomenclador['nivel'] - 1]->nombre;
                $arrayData[$pos]['elementogasto'] = $elementos[$nomenclador['idelementogasto']]['codigoelementoobjeto'] . ' '
                    . $elementos[$nomenclador['idelementogasto']]['descripcionelementoobjeto'];
                $arrayData[$pos]['elementogastoalt'] = $elementos[$nomenclador['idelementogastoalt']]['codigoelementoobjeto'] . ' '
                    . $elementos[$nomenclador['idelementogastoalt']]['descripcionelementoobjeto'];
                unset($nomenclador['NomNaturaleza']);
            }
        }
        return $arrayData;
    }

    /**
     * @param type $idIndicador
     */
    private function actualizarCodigosHijos($idIndicador, $codigo)
    {
        $arrayId = $this->getIdIndicadoresRama($idIndicador);
        Doctrine_Query::create()->update('NomIndicador')
            ->set(
                'codigo', "'{$codigo}' || \"substring\"(codigo, length('{$codigo}') + 1, length(codigo)-length('{$codigo}'))"
            )
            ->whereIn('idindicador', $arrayId)
            ->execute();
    }

    private function actualizarNaturalezaHijos($idIndicador, $idNaturaleza)
    {
        $arrayId = $this->getIdIndicadoresRama($idIndicador);
        Doctrine_Query::create()->update('NomIndicador')
            ->set('idnaturaleza', $idNaturaleza)
            ->whereIn('idindicador', $arrayId)
            ->execute();
    }

    private function eliminarNomencladores($arrIdNomencladores, $arrNoEliminados = array())
    {
        if (!count($arrIdNomencladores)) {
            return false;
        }
        foreach ($arrIdNomencladores as $pos => $id) {
            try {
                $this->doctrineHelper->query("DELETE FROM NomIndicador WHERE idindicador = {$id}");
            } catch (Doctrine_Connection_Pgsql_Exception $e) {
                if ($e->getCode() == '23503') {
                    unset($arrIdNomencladores[$pos]);
                    array_push($arrNoEliminados, $id);
                    if ($this->doctrineHelper->getConnection()->getTransactionLevel() != 0) {
                        $this->doctrineHelper->getConnection()->rollBack();
                    }
                }
            } catch (Exception $e) {
                throw $e;
            }
        }
        if (count($arrNoEliminados)) {
            Doctrine_Query::create()
                ->update('NomIndicador')
                ->set('activo', '?', 0)
                ->set('fechafin', '?', date('d-m-Y'))
                ->whereIn('idindicador', $arrNoEliminados)
                ->execute();
        }
        return true;
    }

    public function setLastLevel($datos)
    {
        $cacheFormatos = $cacheImagenes = array();
        foreach ($datos as $pos => $nodo) {
            if (!array_key_exists($nodo['idformato'], $cacheFormatos)) {
                $partes = $this->configuracionHelper->buscarParteFormato($nodo['idformato']);
                $cacheFormatos['idformato'] = count($partes);
            }
            $datos[$pos]['leaf'] = ($nodo['nivel'] == ($cacheFormatos['idformato'] - 1)) ? true : false;
            $datos[$pos]['maxlevel'] = $cacheFormatos['idformato'];
            if ($nodo['imagen']) {
                $cacheImagenes[$nodo['imagen']] = array_key_exists($cacheImagenes, $nodo['imagen']) ?
                $cacheImagenes[$nodo['imagen']] : $this->imagenHelper->obtenerImagenDb($nodo['imagen']);
                $datos[$pos]['imagen'] = $cacheImagenes[$nodo['imagen']];
            }
            $imagenes = $this->doctrineHelper->query(
                "SELECT idimagen FROM DatImagenindicador WHERE "
                . "idindicador = {$nodo['idindicador']}"
            )->toArray();
            if (count($imagenes)) {
                $datos[$pos]['imagenes'] = $this->imagenHelper->getImagenesIndicador(
                    $imagenes, $cacheImagenes
                );
            }
        }
        return $this->maestroPlanificacion->setDataPlanificacion($datos);
    }

    /**
     * @param type $dataProducto
     * @return type
     */
    public function adicionarNodoClasificador($dataProducto = array())
    {
        $this->validator->validarSalvarIndicador($dataProducto);
        if (!$dataProducto['forzarGrupo']) {
            $entidadesConGrupo = $this->validarCambioEnGrupo($dataProducto['idindicador'], $dataProducto['idgruposubgrupo']);
            if (count($entidadesConGrupo) > 1) {
                return array(
                    'success' => false,
                    'errorCode' => 'GRUPO_USADO_MULTIPLES_ENTIDADES',
                    'entidades' => $entidadesConGrupo,
                    'msg' => 'Modificar el grupo repercute en el balance contable de las siguientes entidades: ' . implode(', ', $entidadesConGrupo),
                );
            }
        }
        $indicador = new NomIndicador();

        if (!is_null($dataProducto[$dataProducto['primaryKeyField']])) {
            $indicador->assignIdentifier($dataProducto[$dataProducto['primaryKeyField']]);
        } else {
            $dataProducto['idusuario'] = $this->global->Perfil->idusuario;
        }
        $this->updateTablasDinamicas($indicador, $dataProducto);
        $indicador->synchronizeWithArray($dataProducto);
        $this->salvarUltimoNivel($indicador, $dataProducto);  
        $this->salvarDatosMedicamentos($indicador, $dataProducto);
        //print_r($indicador->toArray());die;
        $indicador->save();
        $this->maestroPlanificacion->postInsertIndicador($indicador, $dataProducto);
        $this->salvarImagenes($indicador, $dataProducto);
        if ($dataProducto['idindicador'] && !$dataProducto['atributodinamico']) {
            $this->actualizarCodigosHijos($dataProducto['idindicador'], $indicador->codigo);
            //$this->actualizarNaturalezaHijos($dataProducto['idindicador'], $indicador->idnaturaleza);
        } else {
            if ($dataProducto['idnaturaleza']) {
                $this->facturacionHelper->addPrecioMatrizNaturaleza(
                    array('idnaturaleza' => $dataProducto['idnaturaleza'], 'idindicador' => $indicador->idindicador)
                );
            }
        }
        $datosvisualizacion = $dataProducto['datosvisualizacion'];
        if (count($datosvisualizacion) > 0) {
            foreach ($datosvisualizacion as $dat) {
                $this->asociarPlanificacion(array(
                    'idindicador' => $indicador->idindicador,
                    'idviaadquisicion' => $dat['idviaadquisicion'],
                    'idorganosatisface' => implode(',', LogisticaObjectHelper::__init()->extractValueFromArrayColumn($dat['children'], 'id')),
                ));
            }
        }
        if ($dataProducto['indconjunto']) {
            $prodConjuntos = json_decode($dataProducto['indconjunto']);
            $collectionConj = new Doctrine_Collection('DatIndicadorconjunto');
            foreach ($prodConjuntos as $prod) {
                $prod = (array) $prod;
                $objConj = new DatIndicadorconjunto();
                if ($prod['idindicadorconjunto']) {
                    $objConj->assignIdentifier($prod['idindicadorconjunto']);
                }
                $objConj->synchronizeWithArray($prod);
                $objConj->idpadre = $indicador->idindicador;
                $collectionConj->add($objConj);
            }
            if ($collectionConj->count()) {
                $collectionConj->save();
            }
        }
        return array('success' => true, 'idindicador' => $indicador->idindicador);
    }

    public function eliminarNodoClasificador($idIndicador)
    {
        return $this->eliminarNomencladores($this->getIdIndicadoresRama($idIndicador));
    }

    public function getIdIndicadoresRama($idIndicador, $miniMax = false)
    {
        $params = array(
            'idindicador' => $idIndicador,
        );
        $primario = $this->getDatosIndicadoresHojas($params, false);
        $elementos = $elementosSuperior = array();
        foreach ($primario as $item) {
            $sql = "select i.idindicador from mod_datosmaestros.nom_indicador i "
                . "where i.parentpath OPERATOR(public.~) '{$item['parentpath']}.*' ";
            $elementos = array_merge(
                $elementos, $this->doctrineHelper->getConnection()->fetchAssoc($sql)
            );
            $sql = "select i.idindicador from mod_datosmaestros.nom_indicador i "
                . "where i.parentpath OPERATOR(public.~) '*.{$item['parentpath']}' "
                . "and i.parentpath OPERATOR(public.<) (cast('{$item['parentpath']}' as varchar))::public.ltree";
            $elementosSuperior = array_merge(
                $elementosSuperior, $this->doctrineHelper->getConnection()->fetchAssoc($sql)
            );
        }
        if ($miniMax) {
            return array(
                'inferior' => $this->objectHelper->extractValueFromArrayColumn($elementos, 'idindicador'),
                'superior' => $this->objectHelper->extractValueFromArrayColumn($elementosSuperior, 'idindicador'),
            );
        }
        return $this->objectHelper->extractValueFromArrayColumn($elementos, 'idindicador');
    }

    public function habilitarNomencladores($idIndicadores, $cancel = false)
    {
        if (!count($idIndicadores)) {
            return false;
        }
        Doctrine_Query::create()
            ->update('NomIndicador')
            ->set('estado', '?', ($cancel == true ? 0 : 1))
            ->whereIn('idindicador', $this->getIdIndicadoresRama($idIndicadores))
            ->execute();
        return true;
    }

    public function aprobarNomencladores($parametros = array())
    {
        $arrayId = array();
        foreach ($parametros['id'] as $id) {
            $arrayId = array_merge($arrayId, $this->getIdIndicadoresRama($id));
        }
        $parametros['id'] = $arrayId;
        return $this->maestroPlanificacion->aprobarClasificador($parametros);
    }

    public function establecerNivelPlanificacion($idIndicador)
    {
        return $this->maestroPlanificacion->establecerNivelPlanificacion($idIndicador);
    }

    /**
     * Devuelve el arbol del nomenclador.
     * @param array $parametros
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function cargarArbolNomenclador($parametros = array(), $dql = false)
    {
        $params = $parametros;
        unset($params['idseleccionados']);
        $query = $this->getQueryIndicador('ind');
        $this->addFiltersQueryIndicador($query, 'ind', $params);
        $this->addQueryJoinIndicadorHoja($query, 'ind', 'h', 2);
        $this->maestroPlanificacion->addQueryJoinNomIndicadorPlanif($query, 'ind');
        $this->configuracionHelper->getQueryJoinUnidadMedida(
            $query, 'ind', 'umedida', 'umedida.abreviaturaunidadmedida as umedida', 'leftJoin'
        );
        $this->configuracionHelper->innerJoinNomNaturaleza($query, 'ind', 'nat', true);
        $query->andWhere('h.idindicador is null');
        if ($parametros['checkbox']) {
            $parametros['idseleccionados'] = json_decode($parametros['idseleccionados']);
            $ids = is_array($parametros['idseleccionados']) ? $parametros['idseleccionados'] : array(
                $parametros['idseleccionados'],
            );
            array_push($ids, -1);
            $this->objectHelper->unsetNullValues($ids);
            $strIds = implode(',', $ids);
            $query->addSelect("(ind.idindicador in ({$strIds})) as checked");
        }
        if ($parametros['usarCheckBox']) {
            $query->addSelect("false as checked");
        }
        if ($dql) {
            return $query;
        }
        $arbol = $query->fetchArray();
        $this->addSelectionData($arbol);
        $parametros['excluirHojas'] = true;
        return $this->setLastLevel($arbol);
    }

    /**
     * @param array $parametros
     * @param boolean $asQuery
     * @param boolean $treeGrid
     * @param boolean $indexById
     * @return type
     */
    public function cargarGridNomenclador(
        $parametros = array(), $asQuery = false, $treeGrid = false, $indexById = false, $reInitrelations = false
    ) {
       
        $sort = $parametros['sort'];
        $dir = $parametros['dir'];
        $a = ' ';

        if ($reInitrelations) {
            $this->initRelations($parametros['relaciones']);
            $this->maestroPlanificacion->initRelactions();
        }
        if (!$treeGrid) {
            $parametros['grid'] = true;
        }
        if ($parametros['filter']) {
            $this->proccessFilters($parametros);
        }
        $parametros['activo'] = 1;
        $query = $this->getQueryIndicador('ind', $indexById, $this->esFarmacia);
        $this->addFiltersQueryIndicador($query, 'ind', $parametros);
        $this->addQueryJoinIndicadorHoja($query, 'ind', 'indh', $treeGrid ? 2 : 1);
        $this->addQueryLeftIndicadorMedicamento($query, 'ind', 'indm');
        $this->addQueryJoinMarcaModelo($query, 'indh', 'nmar', 'nm', true, true, 'ind');
        $this->addQueryJoinImagenIndicador($query, 'ind', 'imagen');
        $query->addSelect($this->getSelectStringForQueryIndHoja('indh'));
        $query->addSelect($this->getSelectStringForQueryIndMedicamento('indm'));
        $this->addFiltersQueryIndicadorHoja($query, $parametros);
        $this->configuracionHelper->getQueryJoinUnidadMedida(
            $query, 'ind', 'umedida', 'umedida.abreviaturaunidadmedida as umedida, umedida.decimales as decimales, '
            . 'umedida.denominacionunidadmedida as dumedida', 'leftJoin'
        );

        $this->configuracionHelper->innerJoinNomNaturaleza($query, 'ind', 'nat', true);
        $this->maestroPlanificacion->addQueryJoinNomIndicadorPlanif($query, 'ind');
        $this->addFiltersQueryGridNomencladorVistaUnaColumna($query, 'ind', 'indh', $parametros);
        if ($parametros['idtipoprecio']) {
            $service = $this->facturacionHelper->addSelectPrecioMatrizIndicador(
                $parametros['idtipoprecio'], 'ind', $query, $parametros['idestructura']
            );
            $query = $service['dql'];
        }
        if ($asQuery) {
            return $query;
        }

        if ((new VariablesGlobalesModel())->obtenerValor('farmacia') == 1) {
            $query->orderBy('ind.denominacion');
        }

        if ($parametros['sort'] && $parametros['dir']) {
            $query->orderBy($sort.= $a .= $dir);
        } 

        $datos = $this->addSelectionData( //cambiar orderby
            $this->setLastLevel($this->doctrineHelper->addQueryLimits($query, $parametros)->fetchArray())
        );
       
        $cacheFabricante = array();
        foreach ($datos as $i => $d) {
            if ($d['idfabricante']) {
                if (!array_key_exists($d['idfabricante'], $cacheFabricante)) {
                    $cache = $this->configuracionHelper->getClientesProveedorByParams(
                        $d['idfabricante'], null, null, null, null, null
                    );
                    $cacheFabricante[$d['idfabricante']] = $cache['datos'][0];
                }
                $datos[$i]['fabricante'] = $cacheFabricante[$d['idfabricante']]['codigo'] . ' ' . $cacheFabricante[$d['idfabricante']]['nombre'];
            }
        }
        return array(
            'cantidad' => $query->count(), 'datos' => $datos, 'usuarios' => $this->devolverUsuarios(),
        );
    }

    public function devolverUsuarios($campo = 'idusuario')
    {
        $dql = Doctrine_Query::create()->select("DISTINCT i.{$campo} as  id")->from('NomIndicador i');

        $queryResults = $dql->fetchArray();

        $usuariosDevueltos = array($this->global->Perfil->idusuario);
        foreach ($queryResults as $idusuario) {
            if (!array_search($idusuario['id'], $usuariosDevueltos)) {
                array_push($usuariosDevueltos, $idusuario['id']);
            }
        }
        return ServiciosSeguridadHelper::__init()->getUsersNameById($usuariosDevueltos);
    }

    public function cargarGridNomencladorVistaUnaColumna(
        $parametros = array(), $asQuery = false, $treeGrid = false, $indexById = false
    ) {
        if (!$treeGrid) {
            $parametros['grid'] = true;
        }
        $parametros['activo'] = 1;
        $query = $this->getQueryIndicador('ind', $indexById);
        $this->addFiltersQueryIndicador($query, 'ind', $parametros);
        $this->addQueryJoinIndicadorHoja($query, 'ind', 'indh', $treeGrid ? 2 : 1);
        $this->addQueryJoinMarcaModelo($query, 'indh', 'nmar', 'nm', true, true, 'ind');
        $this->addQueryJoinImagenIndicador($query, 'ind', 'imagen');
        $query->addSelect($this->getSelectStringForQueryIndHoja('indh'));
        $this->addFiltersQueryIndicadorHoja($query, $parametros);
        $this->configuracionHelper->getQueryJoinUnidadMedida(
            $query, 'ind', 'umedida', 'umedida.abreviaturaunidadmedida as umedida, umedida.decimales as decimales, '
            . 'umedida.denominacionunidadmedida as dumedida', 'leftJoin'
        );
        $this->configuracionHelper->innerJoinNomNaturaleza($query, 'ind', 'nat', true);
        $this->maestroPlanificacion->addQueryJoinNomIndicadorPlanif($query, 'ind');
        $this->addFiltersQueryGridNomencladorVistaUnaColumna($query, 'ind', 'indh', $parametros);
        if ($asQuery) {
            return $query;
        }

        return array(
            'cantidad' => $query->count(), 'datos' => $this->addSelectionData(
                $this->maestroPlanificacion->setDataPlanificacion(
                    $this->doctrineHelper->addQueryLimits($query, $parametros)->fetchArray()
                )
            ),
        );
    }

    public function addFiltersQueryGridNomencladorVistaUnaColumna(Doctrine_Query $query, $alias, $aliashoja, $parametros)
    {

        // if (count($parametros['comparaciones']) == 0) {
        if ($parametros['numeropieza']) {
            $query->addWhere("{$alias}.numeropieza = ?", $parametros['numeropieza']);
        }
        if ($parametros['criterio']) {
            $query->addWhere(
                "({$alias}.codigo ILIKE '{$parametros['criterio']}%' "
                . " OR {$alias}.denominacion ILIKE '%{$parametros['criterio']}%' OR {$alias}.numeropieza ILIKE '%{$parametros['criterio']}%'
                OR {$aliashoja}.codigoauxiliar ILIKE '%{$parametros['criterio']}%')"
            );
        }
        if ($parametros['precio']) {
            $query->addWhere("{$aliashoja}.precio = ? and not precio is null", $parametros['precio']);
        }
        if ($parametros['preciodivisa']) {
            $query->leftJoin("{$alias}.NomIndicadorplanif idplanifz");
            $query->addWhere("idplanifz.preciodivisa = ?", $parametros['preciodivisa']);
        }
        if ($parametros['precioventa']) {
            $query->leftJoin("{$alias}.NomIndicadorplanif idplanifk");
            $query->addWhere("idplanifk.precioventa = ?", $parametros['precioventa']);
        }
        if ($parametros['flete']) {
            $query->leftJoin("{$alias}.NomIndicadorplanif idplanifm");
            $query->addWhere("idplanifm.flete = ?", $parametros['flete']);
        }
        if ($parametros['contingencia']) {
            $query->leftJoin("{$alias}.NomIndicadorplanif idplanifn");
            $query->addWhere("idplanifn.contingencia = ?", $parametros['contingencia']);
        }
        if ($parametros['cobertura']) {
            $query->leftJoin("{$alias}.NomIndicadorplanif idplanifh");
            $query->addWhere("idplanifh.cobertura = ?", $parametros['cobertura']);
        }
        if ($parametros['margencomercial']) {
            $query->leftJoin("{$alias}.NomIndicadorplanif idplanift");
            $query->addWhere("idplanift.margencomercial = ?", $parametros['margencomercial']);
        }
        if (isset($parametros['balanceable'])) {
            $query->leftJoin("{$alias}.NomIndicadorplanif idplanifq");
            $query->addWhere("idplanifq.balanceable = ?", (int) $parametros['balanceable']);
        }
        if (isset($parametros['nivelplanif'])) {
            $query->leftJoin("{$alias}.NomIndicadorplanif idplanifg");
            $query->addWhere("idplanifg.nivelplanif = ?", (int) $parametros['nivelplanif']);
        }
        if (isset($parametros['idaprobacion'])) {
            $query->leftJoin("{$alias}.NomIndicadorplanif idplanifw");
            $query->WhereIn("idplanifw.idaprobacion", $parametros['idaprobacion']);
        }
        if (isset($parametros['idorganosatisface'])) {
            $query->leftJoin("{$alias}.DatIndicadorviaadquisicionorganosatisface indvp");
            $query->leftJoin(
                "indvp.NomOrganosatisface nomorgp ON indvp.idorganosatisface=nomorgp.idorganosatisface"
            );
            $query->addWhere("nomorgp.idorganosatisface = ?", $parametros['idorganosatisface']);
        }
        if (isset($parametros['idviaadquisicion'])) {
            $query->leftJoin("{$alias}.DatIndicadorviaadquisicion indvpt");
            $query->leftJoin("indvpt.NomViaadquisicion vadq ON indvpt.idviaadquisicion=vadq.idviaadquisicion");
            $query->addWhere("indvpt.idviaadquisicion = ?", $parametros['idviaadquisicion']);
        }
        if (isset($parametros['plandirecto'])) {
            $query->leftJoin("{$alias}.DatIndicadormodelo indpland");
            $query->addWhere("indpland.idmodelo = ?", $parametros['plandirecto']);
        }
        if ($parametros['dnivel']) {
            $query->WhereIn("{$alias}.nivel", $parametros['dnivel']);
        }
        if ($parametros['fabricante']) {
            $query->addWhere("{$alias}.idfabricante = ?", $parametros['fabricante']);
        }
        // }
        foreach ($parametros['comparaciones'] as $filtro) {

            /*if ($filtro['campo'] == 'numeropieza') {

            if ($filtro['signo'] == '<') {
            $query->addWhere("{$alias}.numeropieza < ?", $filtro['valor']);
            }
            if ($filtro['signo'] == '>') {
            $query->addWhere("{$alias}.numeropieza > ?", $filtro['valor']);
            }
            }*/
            if ($filtro['campo'] == 'precio') {
                if ($filtro['signo'] == '<') {
                    $query->addWhere("{$aliashoja}.precio < ? and not precio is null", $filtro['valor']);
                }
                if ($filtro['signo'] == '>') {
                    $query->addWhere("{$aliashoja}.precio > ? and not precio is null", $filtro['valor']);
                }
            }
            if ($filtro['campo'] == 'preciodivisa') {

                if ($filtro['signo'] == '<') {
                    $query->leftJoin("{$alias}.NomIndicadorplanif idplanifi");
                    $query->addWhere("idplanifi.preciodivisa < ?", $filtro['valor']);
                }
                if ($filtro['signo'] == '>') {
                    $query->leftJoin("{$alias}.NomIndicadorplanif idplanifc");
                    $query->addWhere("idplanifc.preciodivisa > ?", $filtro['valor']);
                }
            }
            if ($filtro['campo'] == 'precioventa') {

                if ($filtro['signo'] == '<') {
                    $query->leftJoin("{$alias}.NomIndicadorplanif idplanifo");
                    $query->addWhere("idplanifo.precioventa < ?", $filtro['valor']);
                }
                if ($filtro['signo'] == '>') {
                    $query->leftJoin("{$alias}.NomIndicadorplanif idplanifp");
                    $query->addWhere("idplanifp.precioventa > ?", $filtro['valor']);
                }
            }
            if ($filtro['campo'] == 'cobertura') {

                if ($filtro['signo'] == '<') {
                    $query->leftJoin("{$alias}.NomIndicadorplanif idplanifb");
                    $query->addWhere("idplanifb.cobertura < ?", $filtro['valor']);
                }
                if ($filtro['signo'] == '>') {
                    $query->leftJoin("{$alias}.NomIndicadorplanif idplanifu");
                    $query->addWhere("idplanifu.cobertura > ?", $filtro['valor']);
                }
            }
            if ($filtro['campo'] == 'margencomercial') {

                if ($filtro['signo'] == '<') {
                    $query->leftJoin("{$alias}.NomIndicadorplanif idplanifbb");
                    $query->addWhere("idplanifbb.margencomercial < ?", $filtro['valor']);
                }
                if ($filtro['signo'] == '>') {
                    $query->leftJoin("{$alias}.NomIndicadorplanif idplanifuu");
                    $query->addWhere("idplanifuu.margencomercial > ?", $filtro['valor']);
                }
            }
            if ($filtro['campo'] == 'flete') {

                if ($filtro['signo'] == '<') {
                    $query->leftJoin("{$alias}.NomIndicadorplanif idplanifbb");
                    $query->addWhere("idplanifbb.flete < ?", $filtro['valor']);
                }
                if ($filtro['signo'] == '>') {
                    $query->leftJoin("{$alias}.NomIndicadorplanif idplanifooo");
                    $query->addWhere("idplanifooo.flete > ?", $filtro['valor']);
                }
            }
            if ($filtro['campo'] == 'contingencia') {

                if ($filtro['signo'] == '<') {
                    $query->leftJoin("{$alias}.NomIndicadorplanif idplanifbb");
                    $query->addWhere("idplanifbb.contingencia < ?", $filtro['valor']);
                }
                if ($filtro['signo'] == '>') {
                    $query->leftJoin("{$alias}.NomIndicadorplanif idplanifooo");
                    $query->addWhere("idplanifooo.contingencia > ?", $filtro['valor']);
                }
            }
        }
        return $query;
    }

    public function cargarCentrosBalance()
    {
        return $this->maestroPlanificacion->cargarCentrosBalance();
    }

    public function cargarPlanes()
    {
        return $this->maestroPlanificacion->cargarPlanes();
    }

    /**
     * Metodos basicos para el trabajo con el arbol de indicador
     */

    /**
     * @param type $alias
     */
    public function getQueryIndicador($alias = 'ind', $indexById = false, $esFarmacia = false)
    {
        $query = new Doctrine_Query();
        $from = "NomIndicador {$alias}";
        if ($indexById) {
            $from .= " INDEXBY {$alias}.idindicador";
        }
        $query->from($from)
            ->addSelect($this->getSelectStringForQueryIndicador($alias))
            ->addSelect("{$alias}.idindicador"); //cambiar orderby
        //->addOrderBy("{$alias}.codigo");
        if (!$esFarmacia) {
            $query->addOrderBy("{$alias}.codigo");
        }
        return $query;
    }

    public function addQueryNomIndicador(
        Doctrine_Query $dql, $asExt, $asLoc = 'i', $asHoja = 'ih', $select = true, $asGrupo = 'ngs', $joinHoja = 2, $joinUM = false
    ) {
        $dql->addOrderBy("{$asLoc}.codigo ASC");
        $dql->leftJoin("{$asExt}.NomIndicador {$asLoc}");
        $this->addQueryJoinIndicadorHoja($dql, $asLoc, $asHoja, $joinHoja);
        if ($asGrupo) {
            $dql->leftJoin("{$asHoja}.NomGruposubgrupo {$asGrupo}");
        }
        if ($select) {
            $dql->addSelect($this->getSelectStringForQueryIndicador($asLoc));
            $dql->addSelect($this->getSelectStringForQueryIndHoja($asHoja));

            if ($joinUM) {
                $this->configuracionHelper->getQueryJoinUnidadMedida(
                    $dql, $asLoc, 'umedida', 'umedida.abreviaturaunidadmedida AS umedida, umedida.decimales AS decimales', 'leftJoin'
                );
            }
            $this->addQueryJoinImagenIndicador($dql, $asLoc, 'imagen');
        }
        return $this;
    }

    /**
     * @param Doctrine_Query $dql
     * @param type $alias
     * @param type $params
     */
    public function addFiltersQueryIndicador(Doctrine_Query $dql, $alias = 'ind', $params = array(), $indh = 'indh')
    {

        $this->setParamEspecialidad($params);

        if ($params['idindicador']) {
            $params['idindicador'] = json_decode($params['idindicador']);
            if (!is_array($params['idindicador'])) {
                $params['idindicador'] = array($params['idindicador']);
            }
            $dql->andWhereIn("{$alias}.idindicador", $params['idindicador']);
        }
        if ($params['grid']) {
            if ($params['node'] != 0) {
                $nodo = $this->doctrineHelper
                    ->query(
                        "SELECT i.parentpath FROM NomIndicador i "
                        . "WHERE i.idindicador = {$params['node']}"
                    )
                    ->getFirst()->toArray();

                $dql->andWhere("{$alias}.parentpath OPERATOR(public.<@) ?", $nodo['parentpath']);
            }
            if ($params['codigoauxiliar']) {
                $dql->addWhere("{$indh}.codigoauxiliar = ?", $params['codigoauxiliar']);
            }
            if ($params['criterio']) {
                $dql->addWhere(
                    "({$alias}.codigo ILIKE '{$params['criterio']}%' OR {$indh}.codigoauxiliar ILIKE '%{$params['criterio']}%'"
                    . " OR {$alias}.denominacion ILIKE '%{$params['criterio']}%' OR {$alias}.numeropieza ILIKE '%{$params['criterio']}%')"
                );
            }
        } else {
            if ($params['treeSearch']) {
                $dql->addWhere(
                    "({$alias}.codigo ILIKE '{$params['treeSearch']}%' "
                    . " OR {$alias}.denominacion ILIKE '{$params['treeSearch']}%')"
                );
            } else {
                if (isset($params['node'])) {
                    if ($params['node'] == 0) {
                        $dql->addWhere("{$alias}.idindicador = {$alias}.idpadre");
                    } else {
                        $dql->addWhere(
                            "({$alias}.idpadre = ? AND {$alias}.idindicador <> {$alias}.idpadre)", $params['node']
                        );
                    }
                }
            }
            if ($params['excluirHojas']) {
                $hojas = $this->getDatosIndicadoresHojas();
                if (count($hojas)) {
                    $idHojas = $this->objectHelper->extractValueFromArrayColumn($hojas, 'idindicador');
                    $dql->andWhereNotIn("{$alias}.idindicador", $idHojas);
                }
                $this->addSelectHojas($dql, $hojas, $alias);
            }
            /* if ($params['GridVistaUnaColumn']) {
        $hojas = $this->getDatosIndicadoresHojas();
        }
        $this->addSelectHojas($dql, $hojas, $alias);*/
        }
        if ($params['idEspecialidad']) {
            $espec = is_array($params['idEspecialidad']) ? $params['idEspecialidad'] : array($params['idEspecialidad']);
            $dql->andWhereIn("{$alias}.idespecialidad", $espec);
        }

        if ($params['tipo']) {
            $dql->addWhere("{$alias}.tipo = ?", $params['tipo']);
        }

        if (isset($params['estado'])) {
            $dql->addWhere("{$alias}.estado = ?", (int) $params['estado']);
        }

        if (isset($params['activo'])) {
            $dql->addWhere("{$alias}.activo = ?", (int) $params['activo']);
        }

        if ($params['idseleccionados']) {
            $dql->andWhereNotIn("{$alias}.idindicador", json_decode($params['idseleccionados']));
        }
        if ($params['idarbol']) {
            $dql->addWhere("{$alias}.idarbol = ?", $params['idarbol']);
        }
        if ($params['nivel']) {
            $dql->addWhere("{$alias}.nivel = ?", $params['nivel']);
        }
        if ($params['codigo']) {
            $dql->addWhere("{$alias}.codigo ilike '{$params['codigo']}%' ");
        }
        if (isset($params['idviaadquisicion'])) {
            $dql->leftJoin("{$alias}.DatIndicadorviaadquisicion indvpt");
            $dql->leftJoin("indvpt.NomViaadquisicion vadq ON indvpt.idviaadquisicion=vadq.idviaadquisicion");
            $dql->addWhere("indvpt.idviaadquisicion = ?", $params['idviaadquisicion']);
        }
        if ($params['numeropieza']) {
            $dql->addWhere("{$alias}.numeropieza ilike '%{$params['numeropieza']}%' ");
        }
        if ($params['codigoproveedor']) {
            $dql->addWhere("{$alias}.numeropieza ilike '%{$params['codigoproveedor']}%' ");
        }
        if ($params['idespecialidad']) {
            $dql->addWhere("{$alias}.idespecialidad = ?", $params['idespecialidad']);
        }
        if ($params['denominacion']) {
            $dql->addWhere("{$alias}.denominacion ilike '%{$params['denominacion']}%' ");
        }
        if ($params['umedida']) {
            $dql->addWhere("{$alias}.idumedida = ?", $params['umedida']);
        }
        if ($params['idnaturaleza'] || $params['naturaleza']) {
            if ($params['naturaleza'] && $params['naturaleza'] == "null") {
                $dql->addWhere("{$alias}.idnaturaleza is null", array());
            } else {
                $params['idnaturaleza'] = $params['idnaturaleza'] ? $params['idnaturaleza'] : $params['naturaleza'];
                if (is_array(json_decode($params['idnaturaleza']))) {
                    $dql->andWhereIn("{$alias}.idnaturaleza", json_decode($params['idnaturaleza']));
                } else {
                    $dql->addWhere("{$alias}.idnaturaleza =?", $params['idnaturaleza']);
                }
            }
        }
        if ($params['idnaturalezaexcluir']) {
            $dql->andWhereNotIn("{$alias}.idnaturaleza", $params['idnaturalezaexcluir']);
        }
        if ($params['nacionalidad']) {
            $dql->addWhere("{$alias}.idpais =?", $params['nacionalidad']);
        }
        if ($params['idpais']) {
            $dql->addWhere("{$alias}.idpais =?", $params['idpais']);
        }
        if (isset($params['idaprobacion'])) {
            $dql->leftJoin("{$alias}.NomIndicadorplanif idplanifws");
            $dql->WhereIn("idplanifws.idaprobacion", $params['idaprobacion']);
        }
        if ($params['filtrarentidad']) {
            $query = 'select p.idindicador from mod_logistica.dat_producto p where p.idestructuracomun ='
            . $this->global->Estructura->idestructura;
            $idIndEntidad = $this->objectHelper->extractValueFromArrayColumn(
                $this->doctrineHelper
                    ->getConnection()->fetchAssoc($query), 'idindicador'
            );
            $dql->andWhereIn($alias . '.idindicador', $idIndEntidad);
        }
        if ($params['iddeposito']) {
            $query = 'select p.idindicador from mod_logistica.dat_producto p where p.idestructura ='
                . $params['iddeposito'];
            $idIndEntidad = $this->objectHelper->extractValueFromArrayColumn(
                $this->doctrineHelper
                    ->getConnection()->fetchAssoc($query), 'idindicador'
            );
            $dql->andWhereIn($alias . '.idindicador', $idIndEntidad);
        }
        if (isset($params['nivelplanif'])) {
            $dql->leftJoin("{$alias}.NomIndicadorplanif idplanifgt");
            $dql->addWhere("idplanifgt.nivelplanif = ?", (int) $params['nivelplanif']);
        }
        if (isset($params['idcentrobalance'])) {
            $params['idcentrobalance'] = is_array($params['idcentrobalance']) ? $params['idcentrobalance'] :
            array($params['idcentrobalance']);
            $dql->leftJoin("{$alias}.DatIndicadorcentrobalance indcentrob");
            $dql->whereIn("indcentrob.identidaddatosnomenclador", $params['idcentrobalance']);
        }
        $this->addFiltrosFecha($dql, $alias, $params);
        return $this;
    }

    public function addFiltrosFecha(Doctrine_Query $dql, $alias = 'ind', $params = array())
    {
        if ($params['actual']) {
            $currentDay = date('d-m-Y');
            if ($params['fechainicio']) {
                $dql->addWhere("{$alias}.fechainicio >= ?", array($params['fechainicio']));
            } else {
                $dql->addWhere("{$alias}.fechainicio <= ? OR {$alias}.fechainicio IS NULL", array($currentDay));
            }
            if ($params['fechafin']) {
                $dql->addWhere("{$alias}.fechafin <= ?", array($params['fechafin']));
            } else {
                $dql->addWhere("{$alias}.fechafin >= ? OR {$alias}.fechafin IS NULL", array($currentDay));
            }
        }
        return $this;
    }

    /**
     * @param type $alias
     */
    public function getSelectStringForQueryIndicador($alias = 'ind')
    {
        $arrayQueryStrings = array(
            'id' => '_t.idindicador',
            '_parent' => '(case when _t.idpadre = _t.idindicador then null else _t.idpadre end)',
            'idpadre' => '_t.idpadre',
            '_is_leaf' => "(CASE WHEN (_t.ordender - _t.ordenizq ) = 1 THEN true ELSE false END)",
            '_lft' => '_t.ordenizq',
            '_rgt' => '_t.ordender',
            'idindicador' => '_t.idindicador',
            'denominacion' => '_t.denominacion',
            'numeropieza' => '_t.numeropieza',
            'descripcion' => '_t.descripcion',
            'idelementogasto' => '_t.idelementogasto',
            'idelementogastoalt' => '_t.idelementogastoalt',
            'idnaturaleza' => '_t.idnaturaleza',
            'codigo' => '_t.codigo',
            'nivel' => '_t.nivel',
            '_level' => '_t.nivel',
            'text' => "(_t.codigo || ' - ' || _t.denominacion)",
            'idformato' => '_t.idformato',
            'idarbol' => '_t.idarbol',
            'idpais' => '_t.idpais',
            'idumedida' => '_t.idumedida',
            'activo' => '_t.activo',
            'estado' => '_t.estado',
            'iconCls' => " (CASE WHEN _t.tipo = 2 THEN 'cog' ELSE 'box' END)",
            'tipo' => '_t.tipo',
            'fechainicio' => '_t.fechainicio',
            'fechafin' => '_t.fechafin',
            'idespecialidad' => '_t.idespecialidad',
            'codigoproveedor' => '_t.numeropieza',
            'idtabla' => '_t.idtabla',
            'idtablageneral' => '_t.idtablageneral',
            'arridtablas' => '_t.arridtablas',
            'arridtablasgenerales' => '_t.arridtablasgenerales',
            'precio' => '_t.precio',
            'idusuario' => '_t.idusuario',
            'precioalt' => '_t.precioalternativo',
            'idfabricante' => '_t.idfabricante',
        );
        return $this->doctrineHelper->getStrSelectString($arrayQueryStrings, $alias, '_t');
    }

    /**
     * para el terminal punto de venta
     * @param type $alias
     */
    public function getSelectStringForQueryIndicadorPTV($alias = 'ind')
    {
        $arrayQueryStrings = array(
            'id' => '_t.idindicador',
            '_parent' => '(case when _t.idpadre = _t.idindicador then null else _t.idpadre end)',
            'idpadre' => '_t.idpadre',
            '_is_leaf' => "(CASE WHEN (_t.ordender - _t.ordenizq ) = 1 THEN true ELSE false END)",
            '_lft' => '_t.ordenizq',
            '_rgt' => '_t.ordender',
            'idindicador' => '_t.idindicador',
            'denominacion' => '_t.denominacion',
            'numeropieza' => '_t.numeropieza',
            'descripcion' => '_t.descripcion',
            'idnaturaleza' => '_t.idnaturaleza',
            'idelementogasto' => '_t.idelementogasto',
            'idelementogasto' => '_t.idelementogastoalt',
            'codigo' => '_t.codigo',
            'nivel' => '_t.nivel',
            '_level' => '_t.nivel',
            'text' => "(_t.codigo || ' - ' || _t.denominacion)",
            'idformato' => '_t.idformato',
            'idarbol' => '_t.idarbol',
            'idpais' => '_t.idpais',
            'idumedida' => '_t.idumedida',
            'activo' => '_t.activo',
            'estado' => '_t.estado',
            'iconCls' => " (CASE WHEN _t.tipo = 2 THEN 'cog' ELSE 'box' END)",
            'tipo' => '_t.tipo',
            'fechainicio' => '_t.fechainicio',
            'fechafin' => '_t.fechafin',
            'idespecialidad' => '_t.idespecialidad',
            'codigoproveedor' => '_t.numeropieza',
            'idtabla' => '_t.idtabla',
            'idtablageneral' => '_t.idtablageneral',
            'arridtablas' => '_t.arridtablas',
            'arridtablasgenerales' => '_t.arridtablasgenerales',
        );
        return $this->doctrineHelper->getStrSelectString($arrayQueryStrings, $alias, '_t');
    }

    public function getSelectStringForQueryIndHoja($alias = 'indh')
    {
        $arrayQueryStrings = array(
            'precio' => 'coalesce(_t.precio,0)',
            'tienelote' => "(CASE WHEN _t.tipocontrol = 2 THEN 1 ELSE 0 END)",
            'tienetalla' => "(CASE WHEN _t.tipocontrol =5 THEN 1 ELSE 0 END)",
            'equipo' => "(CASE WHEN _t.tipocontrol = 3 THEN 1 ELSE 0 END)",
            'municion' => "(CASE WHEN _t.tipocontrol = 4 THEN 1 ELSE 0 END)",
            'explotacion' => '_t.explotacion',
            'almacenado' => '_t.almacenado',
            'idmarca' => '_t.idmarca',
            'isuh' => '_t.isuh',
            'idgruposubgrupo' => '_t.idgruposubgrupo',
            'idmodelo' => '_t.idmodelo',
            'peso' => '_t.peso',
            'largo' => '_t.largo',
            'ancho' => '_t.ancho',
            'alto' => '_t.alto',
            'tipocontrol' => '_t.tipocontrol',
            'codigoauxiliar' => '_t.codigoauxiliar',
            'codigobarra' => '_t.codigobarra',
            'descripcionventa' => '_t.descripcionventa',
        );
        return $this->doctrineHelper->getStrSelectString($arrayQueryStrings, $alias, '_t');
    }

    public function getSelectStringForQueryIndMedicamento($alias = 'ind')
    {
        $arrayQueryStrings = array(
            'idforma' => '_t.idforma',
            'composicion' => '_t.composicion',
            'idumcomposicion' => '_t.idumcomposicion',
            'idpresentacion' => '_t.idpresentacion',
            'municion' => '_t.idforma',
            'unidadpresent' => '_t.unidadpresent',
            'dosisunitaria' => '_t.dosisunitaria',
            'temperatura' => '_t.temperatura',
            'pesoenvase' => '_t.pesoenvase',
            'idumpeso' => '_t.idumpeso',
        );
        return $this->doctrineHelper->getStrSelectString($arrayQueryStrings, $alias, '_t');
    }

    /**
     * Metodos basicos para el trabajo con las hojas de indicador
     */

    /**
     * @param Doctrine_Query $dql
     * @param type $alias
     * @param type $aliasHoja
     * @param type $join
     */
    public function addQueryJoinIndicadorHoja(Doctrine_Query $dql, $alias = 'ind', $aliasHoja = 'indh', $join = 1)
    {
        if ($join == 1) {
            $dql->innerJoin("{$alias}.NomIndicadorhoja {$aliasHoja}");
        } else {
            $dql->leftJoin("{$alias}.NomIndicadorhoja {$aliasHoja}");
        }
    }

    /**
     * @param Doctrine_Query $dql
     * @param type $alias
     * @param type $aliasHoja
     * @param type $join
     */
    public function addQueryLeftIndicadorMedicamento(Doctrine_Query $dql, $alias = 'ind', $aliasMed = 'indm')
    {
        $dql->leftJoin("{$alias}.NomIndicadormedicamento {$aliasMed}");
        
    }

    /**
     * @param type $params
     * @param type $hojas
     * @return type
     */
    public function getDatosIndicadoresHojas($params = array(), $hojas = true)
    {
        $arrayFilter = array();
        if ($params['idindicador']) {
            if (!is_array($params['idindicador'])) {
                $params['idindicador'] = array($params['idindicador']);
            }
            $idindicador = implode(',', $params['idindicador']);
            $arrayFilter[] = "i.idindicador IN ({$idindicador})";
        }
        $filtro = '';
        if (count($arrayFilter)) {
            $filtro .= " WHERE" . ' ' . implode(' AND ', $arrayFilter);
        }
        $joins = $hojas == true ? "INNER JOIN i.NomIndicadorhoja ih" : "";
        return $this->doctrineHelper->query(
            "SELECT i.idindicador, i.idpadre, i.idarbol, i.ordenizq, i.ordender, i.parentpath FROM NomIndicador i"
            . " {$joins} {$filtro}"
        )
            ->toArray();
    }

    /**
     * @param Doctrine_Query $dql
     * @param type $hojas
     * @param type $alias
     */
    public function addSelectHojas(Doctrine_Query $dql, $hojas, $alias = 'ind')
    {
        $idPadres = implode(',', $this->objectHelper->extractValueFromArrayColumn($hojas, 'idpadre'));
        if (!empty($idPadres)) {
            $dql->addSelect("(CASE WHEN {$alias}.idindicador IN ({$idPadres}) THEN 1 ELSE 0 END) AS leaf");
        }
    }

    /**
     * @param Doctrine_Query $query
     * @param type $aliasExterno
     * @param type $campo
     */
    public function devolverProductosServicio($params = array(), $inDQL = false)
    {
        $dql = $this->getQueryIndicador('np')
            ->innerJoin('np.NomProductoservicio nps ON nps.idnomproducto = np.idindicador');
        $params['grid'] = true;
        $this->addFiltersQueryIndicador($dql, 'np', $params);
        $this->addQueryJoinIndicadorHoja($dql, 'np', 'nph');
        $dql->addSelect($this->getSelectStringForQueryIndHoja('nph'));
        if ($params['idservicio']) {
            $dql->andWhere('nps.idservicio = ?', array($params['idservicio']));
        }
        if ($inDQL) {
            return $dql;
        }
        return array(
            'cantidad' => $dql->count(),
            'datos' => $this->addSelectionData($this->doctrineHelper->addQueryLimits($dql, $params)->fetchArray()),
        );
    }

    public function addQueryJoinImagenIndicador(Doctrine_Query $query, $aliasExterno, $campo)
    {
        $query->addSelect(
            "(SELECT img.idimagen FROM DatImagenindicador img WHERE img.principal = 0 "
            . "AND img.idindicador = {$aliasExterno}.idindicador LIMIT 1) as {$campo}"
        );
    }

    /*     * metodos basicos para el trabajo con los atributos dinamicos del indicador */

    /**
     *  Si se modifico el idtabla ó idtablageneral, actualizo el arreglo
     *  de idtablas de los hijos y  del indicador
     */
    public function updateTablasDinamicas(NomIndicador $indicador, $params)
    {
        if (
            ($params['idtabla'] && $params['idtabla'] != null && $params['idtabla'] != '') || ($params['idtablageneral'] && $params['idtablageneral'] != null && $params['idtablageneral'] != '')
        ) {
            $indicadoresCollection = new Doctrine_Collection('NomIndicador');
            $parentPath = $indicador->get('parentpath');
            $idIndicador = $indicador->get('idindicador');
            $hijos = Doctrine::getTable('NomIndicador')->findByDql(
                "parentpath OPERATOR(public.~) '{$parentPath}.*'  and idindicador <> ?", array($idIndicador)
            );
            $arrIdesTablas = array();
            $arrIdesTablasGenerales = array();
            /*
             *  (1) Primero creo el arreglo de idtablas del propio indicador a modificar
             */
            if ($params['idtabla'] && $indicador->idtabla != $params['idtabla']) {

                $arrIdesTablas = $indicador->arridtablas;
                $arrIdesTablas = explode(',', $arrIdesTablas);
                $arrIdesTablas[count($arrIdesTablas) - 1] = $params['idtabla'];

                $indicador->arridtablas = implode(',', $arrIdesTablas);
            }

            if ($params['idtablageneral'] && $indicador->idtablageneral != $params['idtablageneral']) {

                $arrIdesTablasGenerales = $indicador->arridtablasgenerales;
                $arrIdesTablasGenerales = explode(',', $arrIdesTablasGenerales);
                $arrIdesTablasGenerales[count($arrIdesTablasGenerales) - 1] = $params['idtablageneral'];

                $indicador->arridtablasgenerales = implode(',', $arrIdesTablasGenerales);
            }
            /*
             *  (2) Actualizo el arreglo de idtablas de los hijos del indicador
             */
            foreach ($hijos as $hijo) {

                if (count($arrIdesTablas)) {
                    $arrIdesTablasAux = $hijo->arridtablas;
                    $arrIdesTablasAux = explode(',', $arrIdesTablasAux);
                    $arrIdesTablasAux[($indicador->nivel) - 1] = $params['idtabla'];

                    $hijo->arridtablas = implode(',', $arrIdesTablasAux);
                }
                if (count($arrIdesTablasGenerales)) {
                    $arrIdesTablasGeneralesAux = $hijo->arridtablasgenerales;
                    $arrIdesTablasGeneralesAux = explode(',', $arrIdesTablasGeneralesAux);
                    $arrIdesTablasGeneralesAux[($indicador->nivel) - 1] = $params['idtablageneral'];

                    $hijo->arridtablasgenerales = implode(',', $arrIdesTablasGeneralesAux);
                }
                $indicadoresCollection->add($hijo);
            }
            $indicadoresCollection->save();
        }
    }

    public function addQueryJoinMarcaModelo(
        Doctrine_Query $query, $asHoja = 'ih', $asMarca = 'nmar', $asModelo = 'nm', $selDatosMar = false, $selDatModelo = false, $aliasInd = 'ind'
    ) {
        $query->leftJoin("{$asHoja}.NomMarca {$asMarca}");
        $query->leftJoin("{$asHoja}.NomModelo {$asModelo}");
        if ($selDatosMar) {
            $query->addSelect(
                "{$asMarca}.denominacion as marca, {$asMarca}.estado as usomarca "
            );
        }
        if ($selDatModelo) {
            $query->addSelect(
                " {$asModelo}.denominacion as modelo, {$asModelo}.estado as usomodelo "
            );
        }
        if ($selDatosMar && $selDatModelo) {
            $query->addSelect(
                " ({$asModelo}.denominacion || '-' || {$asMarca}.denominacion) as marcamodelo "
            );
        }

        $query->addSelect(
            "({$aliasInd}.denominacion || ' '||((Case When {$asHoja}.idmarca is not null "
            . "Then ({$asMarca}.denominacion  || (Case When {$asHoja}.idmodelo is not null Then ' - ' Else '' End)) "
            . "Else '' End)  || (Case When {$asHoja}.idmodelo is not null "
            . "Then {$asModelo}.denominacion Else '' End))) as descripcionmarcamodelo"
        );
    }

    public function devolverIndicadorById($idIndicador)
    {
        $query = $this->getQueryIndicador('ind');
        $this->addQueryJoinIndicadorHoja($query, 'ind', 'indh', 1);
        $this->addQueryJoinImagenIndicador($query, 'ind', 'imagen');
        $query->addSelect($this->getSelectStringForQueryIndHoja('indh'));
        $this->configuracionHelper->getQueryJoinUnidadMedida(
            $query, 'ind', 'umedida', 'umedida.abreviaturaunidadmedida as umedida', 'leftJoin'
        );
        $this->configuracionHelper->innerJoinNomNaturaleza($query, 'ind', 'nat', true);
        $this->maestroPlanificacion->addQueryJoinNomIndicadorPlanif($query, 'ind');
        $query->andWhereIn('ind.idindicador', $idIndicador);
        return $this->setLastLevel($query->fetchArray())[0];
    }

    public function devolverIndicadorSelfById($idIndicador)
    {
        if ($idIndicador) {
            $Idindicador = Doctrine::getTable('NomIndicador')->find($idIndicador);
            return $Idindicador;
        }
        return false;
    }

    public function devolverIndicadorSelfByIdtabla($idTabla)
    {
        if ($idTabla && $idTabla != -1) {
            $Idindicador = Doctrine::getTable('NomIndicador')->findByDql(
                'idtabla = ?', array($idTabla)
            );
            if (count($Idindicador)) {
                $Idindicador = $Idindicador[0];
                return $Idindicador;
            }
        }
        return false;
    }

    public function devolverIndicadorSelfByIdTablaGeneral($idtablageneral)
    {
        if ($idtablageneral && $idtablageneral != -1) {
            $Idindicador = Doctrine::getTable('NomIndicador')->findByDql(
                'idtablageneral = ?', array($idtablageneral)
            );
            if (count($Idindicador)) {
                $Idindicador = $Idindicador[0];
                return $Idindicador;
            }
        }
        return false;
    }

    public function existeImagen($idIamagen, $idIndicador)
    {
        $cant = $this->doctrineHelper->query(
            "SELECT COUNT(di.idimagenindicador) as cant "
            . "FROM DatImagenindicador di WHERE  di.idimagen = {$idIamagen} "
            . "AND di.idindicador = {$idIndicador}"
        )->getFirst()->toArray();
        return $cant['cant'] != 0;
    }

    /**
     * @param type $filtro
     * @return type
     */
    public function getNaturalezasAsociadas($filtro = null)
    {
        $arrayData = Doctrine_Query::create()->select('i.idnaturaleza as idnaturaleza')
            ->from('NomIndicador i')
            ->innerJoin('i.NomIndicadorhoja ih');
        if (!is_null($filtro)) {
            $arrayData->addWhere($filtro);
        }
        return $this->objectHelper->extractValueFromArrayColumn($arrayData->fetchArray(), 'idnaturaleza');
    }

    public function addFiltersQueryIndicadorHoja(Doctrine_Query $query, $parametros, $alias = 'indh')
    {
        /* if (isset($parametros['criterio'])) {
            $parametros['codigoauxiliar'] = $parametros['criterio'];
        }  */
        if (isset($parametros['almacenado'])) {
            $query->andWhere("$alias.almacenado = ?", array($parametros['almacenado']));
        }
        if (isset($parametros['isuh'])) {
            $query->andWhere("$alias.isuh = ?", array($parametros['isuh']));
        }
        if (isset($parametros['explotacion'])) {
            $query->andWhere("$alias.explotacion = ?", array($parametros['explotacion']));
        }
        if (isset($parametros['codigoauxiliar'])) {
            $query->orWhere("($alias.codigoauxiliar ILIKE '%{$parametros['codigoauxiliar']}%')");
        }
        if (isset($parametros['idmarca']) || isset($parametros['marca'])) {
            $marca = ($parametros['idmarca']) ? ($parametros['idmarca']) : $parametros['marca'];
            $query->andWhere("$alias.idmarca = ?", array($marca));
        }
        if (isset($parametros['idmodelo']) || isset($parametros['modelo'])) {
            $modelo = ($parametros['idmodelo']) ? ($parametros['idmodelo']) : $parametros['modelo'];
            $query->andWhere("$alias.idmodelo = ?", array($modelo));
        }
        if (isset($parametros['precio'])) {
            $query->addWhere("{$alias}.precio = ? and not precio is null", $parametros['precio']);
        }
        if (is_array($parametros['comparaciones'])) {
            foreach ($parametros['comparaciones'] as $filtro) {
                if ($filtro['campo'] == 'precio') {
                    if ($filtro['signo'] == '<') {
                        $query->addWhere("{$alias}.precio < ? and not precio is null", $filtro['valor']);
                    }
                    if ($filtro['signo'] == '>') {
                        $query->addWhere("{$alias}.precio > ? and not precio is null", $filtro['valor']);
                    }
                }
            }
        }
    }

    public function devolverPadresHojas($parametros = array())
    {
        $idHojas = $this->doctrineHelper->getConnection()->execute(
            "select distinct i.idpadre from "
            . "mod_datosmaestros.nom_indicador i inner join mod_datosmaestros.nom_indicadorhoja ih "
            . "on ih.idindicador = i.idindicador"
        )->fetchAll(PDO::FETCH_COLUMN);
        $query = $this->getQueryIndicador();
        $this->addFiltersQueryIndicador($query, 'ind', $parametros);
        $query->andWhereIn('idindicador', $idHojas);
        return array(
            'cantidad' => $query->count(), 'datos' => $this->doctrineHelper
                ->addQueryLimits($query, $parametros)->fetchArray(),
        );
    }

    //auxiliar para maestros de productos y servicios
        public function devolverPadres($parametros = array())
    {
        if ($parametros['criterio']) {
            $addWhere = " AND i.denominacion ILIKE '%{$parametros['criterio']}%' ";
        }
        $idPadres = $this->doctrineHelper->getConnection()->execute(
            " select i.idindicador as idpadre from mod_datosmaestros.nom_indicador i
                where i.idindicador = i.idpadre $addWhere
                order by i.codigo "
        )->fetchAll(PDO::FETCH_COLUMN);
        $query = $this->getQueryIndicador();
        $this->addFiltersQueryIndicador($query, 'ind', $parametros);
        $query->andWhereIn('idindicador', $idPadres);
        return array(
            'cantidad' => $query->count(), 'datos' => $this->doctrineHelper
                ->addQueryLimits($query, $parametros)->fetchArray(),
        );
    }

    public function getFormatosConfigurados()
    {
        $result = array();
        $formato = $this->doctrineHelper->getConnection()
            ->fetchAll('select idformato from mod_datosmaestros.conf_maestropordserv where activo = 1');
        foreach ($formato as $f) {
            array_push($result, $this->configuracionHelper->buscarFormatoPorID($f['idformato']));
        }
        return $result;
    }

    public function getFormatosVariable()
    {
        $result = array();
        $formato = $this->doctrineHelper->getConnection()
            ->fetchAll("select valor from mod_logistica.nom_variableglobal where nombre = 'FORMATO_TALL'");
        foreach ($formato as $f) {
            array_push($result, $f);
        }
        return $result;
    }

    public function setParamEspecialidad(&$params = array())
    {
        if ($this->filtrarCentros == true) {
            $id = $this->global->Estructura->idestructura;
            $params['idcentrobalance'] = -1;
            if ($id == 1) {
                $params['idcentrobalance'] = LogisticaObjectHelper::__init()
                    ->extractValueFromArrayColumn($this->maestroPlanificacion->cargarCentrosBalance(), 'id');
            } elseif ($id != 0) {
                $params['idcentrobalance'] = LogisticaObjectHelper::__init()
                    ->extractValueFromArrayColumn($this->maestroPlanificacion->cargarCentrosBalance(), 'id');
            }
            $params['idEspecialidad'] = -1;
            $params['restringir'] = 0;
        }
        if ($params['idEspecialidad'] == -1) {
            $especialidades = $this->configuracionHelper->obtenerEspecialidades($params);
            if (count($especialidades) == 0 && $params['restringir'] == 1) {
                $params['idEspecialidad'] = -1;
                return;
            }
            $params['idEspecialidad'] = LogisticaObjectHelper::__init()
                ->extractValueFromArrayColumn($especialidades, 'idespecialidad');
        }
    }

    public function getFormatoIndicadores()
    {
        $formatos = Doctrine_Query::create()->from('NomIndicador i')->select('distinct(i.idformato) as idformato')
            ->fetchArray();
        return $formatos[0]['idformato'];
    }

    /**
     * Devuelve las unidades de medidas configuradas para el indicador
     * @param array $filtro
     * @return array
     */
    public function cargarComboUM($filtro)
    {
        $umedida = Doctrine_Query::create()
            ->select('um.idunidadmedida, um.abreviaturaunidadmedida')
            ->from('NomUnidadmedida um')
        /*->leftJoin('um.NomIndicador i')
        ->leftJoin('um.NomFactorconversion fc')
        ->where('i.idindicador = ? OR fc.idindicador = $1', array($filtro['idindicador']))*/
            ->fetchArray();
        return array('datos' => $umedida);
    }

    /**
     * Devuelve los factores de conversion de las unidades de medida.
     * @param array $filtro
     * @param boolean $dql [Opcional]
     * @return array
     */
    public function cargarFactorConversion($filtro, $dql = false)
    {
        $query = Doctrine_Query::create()
            ->select(
                'fc.idfactorconversion, fc.idindicador, fc.idunidadmedida, fc.factorconversion, '
                . 'um.decimales AS decimales, um.denominacionunidadmedida AS denominacionunidadmedida, '
                . 'um.abreviaturaunidadmedida AS abreviaturaunidadmedida'
            )
            ->from('NomFactorconversion fc')
            ->innerJoin('fc.NomUnidadmedida um');
        if ($filtro['idindicador']) {
            $query->where('fc.idindicador = ?', $filtro['idindicador']);
        }
        if ($filtro['idunidadmedida']) {
            $query->addWhere('fc.idunidadmedida = ?', $filtro['idunidadmedida']);
        }
        if ($dql) {
            return $query;
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray(),
        );
    }

    /**
     * Adiciona factores de conversion de las unidades de medida.
     * @param array $datos
     * @return array
     */
    public function adicionarFactorConversion($datos)
    {
        $record = new NomFactorconversion();
        if ($datos['idfactorconversion']) {
            $record->assignIdentifier($datos['idfactorconversion']);
        }
        $record->synchronizeWithArray($datos);
        $record->save();
        return true;
    }

    /**
     * Elimina los factores de conversion de las unidades de medida.
     * @param array $idfactorconversion
     * @return array
     */
    public function eliminarFactorConversion($idfactorconversion)
    {
        Doctrine_Query::create()
            ->delete('NomFactorconversion')
            ->whereIn('idfactorconversion', $idfactorconversion)
            ->execute();
        return array('success' => true);
    }

    /**
     * Devuelve el factor de conversion de un indicador a una unidad de medida.
     * @param array $filtro
     * @return array
     * @throws LogisticaException Excepcion que se lanza de no existir el factor de conversion.
     */
    public function getFactorConversion($filtro)
    {
        $query = $this->cargarFactorConversion($filtro, true);
        if ($query->count() == 0) {
            throw new LogisticaException('LOG_LB_FC_001');
        }
        return $query->fetchArray()[0];
    }

    /**
     * Devuelve el arbol del tab Elementos de planificacion.
     * @param
     * @return
     * @throws
     */
    public function cargarArbolPlanificacion($id)
    {
        $where = ($id) ? "and di.idindicador={$id}" : "and di.idindicador=null";
        $where2 = ($id) ? " and dat_indicadorviaadquisicionorganosatisface.idindicador ={$id}" : "and dat_indicadorviaadquisicionorganosatisface.idindicador =null";
        $sqlViaAdquisicion = "select
        nv.denominacion as text,
        di.idviaadquisicion as id,
        false as  checked,
        false as leaf
        from mod_datosmaestros.nom_viaadquisicion as nv,mod_datosmaestros.dat_indicadorviaadquisicion as di
        where di.idviaadquisicion = nv.idviaadquisicion {$where}";
        $arrayAdquisicion = Doctrine_Manager::connection()->fetchAll($sqlViaAdquisicion);

        foreach ($arrayAdquisicion as $index1 => $lolo) {
            $sqlOrgano = "select   distinct nom_organosatisface.denominacion as text,nom_organosatisface.idorganosatisface as id, true as leaf, false as  checked
        from  mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface,mod_datosmaestros.nom_organosatisface,mod_datosmaestros.dat_indicadorviaadquisicion
        where nom_organosatisface.idorganosatisface=dat_indicadorviaadquisicionorganosatisface.idorganosatisface
        and dat_indicadorviaadquisicion.idviaadquisicion=dat_indicadorviaadquisicionorganosatisface.idviaadquisicion {$where2} and dat_indicadorviaadquisicion.idviaadquisicion={$lolo['id']}";
            $arrayOrgano = Doctrine_Manager::connection()->fetchAll($sqlOrgano);

            $arrayAdquisicion[$index1]['children'] = array();
            foreach ($arrayOrgano as $index2 => $org) {
                $arrayOrgano[$index2]['id'] = ($lolo['id']) . '-' . ($org['id']);
                $arrayOrgano[$index2]['leaf'] = true;
                $arrayOrgano[$index2]['expanded'] = false;
                array_push($arrayAdquisicion[$index1]['children'], $org);
            }
        }
        return $arrayAdquisicion;
    }

    public function asociarPlanificacion($params)
    {
        $sqlidvia = "select
        count(di.idviaadquisicion) as id
        from mod_datosmaestros.nom_viaadquisicion as nv,mod_datosmaestros.dat_indicadorviaadquisicion as di
        where di.idviaadquisicion = nv.idviaadquisicion and di.idindicador={$params['idindicador']} and di.idviaadquisicion in ({$params['idviaadquisicion']})";
        $arrayidvia = Doctrine_Manager::connection()->fetchAll($sqlidvia);
        $idorganos = "select
        count(id.idorganosatisface) as id
        from mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface id
        where id.idindicador={$params['idindicador']} and id.idviaadquisicion in ({$params['idviaadquisicion']}) and /*id.idorganosatisface in ({$params['idorganosatisface']})*/ and id.idorganosatisface=368";

        if (LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_PLAN)) {
            if ($arrayidvia[0]['id'] != 1) {
                $arrayorganos = explode(",", $params['idorganosatisface']);
                $arrayvia = explode(",", $params['idviaadquisicion']);
                $this->maestroPlanificacion->salvarViasAdquisicion($arrayvia, $params['idindicador']);
                $this->maestroPlanificacion->salvarOrganos($arrayorganos, $arrayvia, $params['idindicador']);
            } else {
                $arrayorganos = explode(",", $params['idorganosatisface']);
                $arrayvia = explode(",", $params['idviaadquisicion']);
                foreach ($arrayorganos as $idorgano) {
                    $idorganos = "select
        count(id.idorganosatisface) as id
        from mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface id
        where id.idindicador={$params['idindicador']} and id.idviaadquisicion={$params['idviaadquisicion']} and id.idorganosatisface={$idorgano}";
                    $arrayidorg = Doctrine_Manager::connection()->fetchAll($idorganos);
                    if ($arrayidorg[0]['id'] != 1) {
                        $idorgano = explode(",", $idorgano);
                        $this->maestroPlanificacion->salvarOrganos($idorgano, $arrayvia, $params['idindicador']);
                    } /*else{
                throw new LogisticaException(LOG_LB_MA_001);
                }*/
                }

                $arrayorganos = explode(",", $params['idorganosatisface']);
                $arrayvia = explode(",", $params['idviaadquisicion']);
                $this->maestroPlanificacion->salvarOrganos($arrayorganos, $arrayvia, $params['idindicador']);
            }
        }
    }

    public function desasociarPlanificacion($params)
    {
        $params['idviasorganos'] = explode(",", $params['idviasorganos']);
        foreach ($params['idviasorganos'] as $value) {
            $trozos = explode("-", $value);
            Doctrine_Query::create()->delete('DatIndicadorviaadquisicionorganosatisface')
                ->where('idindicador = ?', $params['idindicador'])->andWhere(
                'idviaadquisicion = ?',
                (int) str_replace('[', '', str_replace(']', '', str_replace('"', '', $trozos[0])))
            )->andWhere(
                'idorganosatisface = ?',
                (int) str_replace('[', '', str_replace(']', '', str_replace('"', '', $trozos[1])))
            )->execute();
        }
        $params['idviaadquisicion'] = explode(",", $params['idviaadquisicion']);
        $params['idviaadquisicion'] = str_replace('[', '', str_replace(']', '', $params['idviaadquisicion']));
        foreach ($params['idviaadquisicion'] as $valor) {
            Doctrine_Query::create()->delete('DatIndicadorviaadquisicion')
                ->where('idindicador = ?', $params['idindicador'])->andWhere(
                'idviaadquisicion = ?', (int) str_replace('"', '', $valor)
            )->execute();
        }
    }

    public function DayCero($params)
    {
        $query = Doctrine_Query::create()
            ->select(
                'indplanif.idindicador, indplanif.precio + indplanif.preciodivisa as sumatoria '
            )
            ->from('NomIndicadorplanif indplanif');
        foreach ($query->fetchArray() as $suma) {
            $diacero = $suma['sumatoria'] * $params['coeficiente'];
            $query = "UPDATE mod_datosmaestros.nom_indicadorplanif SET precio='" . $diacero .
                "',preciodivisa=0 WHERE idindicador='" . $suma['idindicador'] . "'";
            Doctrine_Manager::connection()->execute($query);
        }
    }

    public function getConfigCodigo()
    {
        $sql = 'select c.idformato, c.gencodigo
	                from mod_datosmaestros.conf_maestropordserv c
	            where c.activo = 1  limit 1';
        return $this->doctrineHelper->getConnection()->fetchAll($sql);
    }

    //prueba

    public function getServiciosSoap($parametros)
    {
        /*if($parametros['connection']){
        Doctrine_Manager::getInstance()->setCurrentConnection($parametros['connection']);
        }*/
        $query = new Doctrine_Query();

        $query->from('NomIndicador i')
            ->addSelect("i.idindicador")
            ->addSelect("i.codigo")
            ->addSelect("i.denominacion")
            ->addSelect("i.precio")
            ->addOrderBy("i.codigo");
        //hacer los filtros
        $query->addSelect('i.tipo');
        $query->innerJoin('i.NomIndicadorhoja ih');
        $query->addWhere('i.tipo =2');
        if ($parametros['criterio']) {
            $query->addWhere("i.codigo = ? or i.denominacion ILIKE '%{$parametros['criterio']}%'", array($parametros['criterio']));
        }
        $cantidad = $query->count();
        if ($parametros['limit']) {
            $query->limit($parametros['limit']);
        } else {
            $query->limit(30);
        }
        if ($parametros['start']) {
            $query->offset($parametros['start']);
        } else {
            $query->offset(0);
        }
        $array = $query->fetchArray();
        $respuesta = array(
            'cantidad' => $cantidad,
            'matriz' => $array,
        );
        //Doctrine_Manager::getInstance()->getCurrentConnection()->commit();
        return $respuesta;
    }

    public function getAtributosDinamicos($idindicador)
    {
        $sql = "select ca.* from mod_logmetadata.conf_atributo ca
                inner join mod_logmetadata.dat_atribagrupacion aa on aa.idatributo = ca.idatributo
                inner join mod_logmetadata.dat_atributotabla at on at.idatribagrupacion = aa.idatribagrupacion
                inner join mod_logmetadata.dat_tablameta tm on tm.idtablameta = at.idtablameta
                where tm.columnaref = 'idnaturaleza'
                and tm.datoref = CAST((select i.idnaturaleza from mod_datosmaestros.nom_indicador i where i.idindicador = {$idindicador}) as VARCHAR)";
        return $this->doctrineHelper->getConnection()->fetchAll($sql);
    }

    public function getDatosByIndicador($params)
    {
        $objcodigoind = new DatCodigoindicador();
        return $objcodigoind->getDatosbyIndicador($params);
    }

    public function getDatosByCodigoIndicador($params)
    {
        $objclientecod = new DatClientecodigo();
        $arrayClientes = array();
        if (!is_null($params['idcodigoindicador'])) {
            $arrayClientes = $objclientecod->getDatosByCodigoIndicador($params);
            foreach ($arrayClientes['datos'] as &$dat) {
                $clientes = $this->getNombreClienteProveedorById($dat['idcliente']);
                $dat['codigo'] = $clientes['codigo'];
                $dat['cliente'] = $clientes['nombre'];
            }
        }
        return $arrayClientes;
    }

    public function getClientesService($params)
    {
        $params = $this->filterCliente($params);
        $configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        $params['padres'] = true;
        $clientsObj = $configuracionHelper->getClientesProveedorByParams(
            false, $this->global->Estructura->idestructura, true, true,
            false, $params, $params['start'], $params['limit']
        );
        return $clientsObj;
    }

    public function filterCliente($params)
    {
        if ($params['criterio']) {
            if (is_numeric($params['criterio'])) {
                $params['codigocliente'] = $params['criterio'];
            } else {
                $params['nombre'] = $params['criterio'];
            }
        } else {
            $params['codigocliente'] = ($params['codigo']) ? $params['codigo'] : null;
            $params['codigo'] = null;
        }
        return $params;
    }

    public function adicionarCodigo($dataProducto = array())
    {
        $codindicador = new DatCodigoindicador();
        $existeCodNom = $codindicador->verifExisteCodigoNombre(
            $dataProducto['data']['codigo'], $dataProducto['data']['idindicador']
        );
        if (!$existeCodNom['valor']) {
            $codindicador->synchronizeWithArray($dataProducto['data']);
            $codindicador->save();
        }

        return array('success' => (!$existeCodNom['valor']) ? true : false,
            'idcodigoindicador' => $codindicador->idcodigoindicador,
            'existe' => $existeCodNom['atributo'],
        );
    }

    public function adicionarClientes($dataClientes = array())
    {
        $collClienteCod = new Doctrine_Collection('DatClientecodigo');
        $clientCodigo = new DatClientecodigo();
        $clientExist = array();
        foreach ($dataClientes['data'] as $data) {
            if (!$clientCodigo->verifExisteClienteCodigo($data['idclientesproveedores'], $data['idindicador'])) {
                $clientCodigo = new DatClientecodigo();
                $clientCodigo->idcodigoindicador = $data['idcodigoindicador'];
                $clientCodigo->idclientesproveedores = $data['idclientesproveedores'];
                $collClienteCod->add($clientCodigo);
            } else {
                $datos['idcliente'] = $data['idclientesproveedores'];
                $datos = $this->getNombreClienteProveedorById($datos['idcliente']);
                array_push($clientExist, array(
                    'idclienteproveedor' => $data['idclientesproveedores'],
                    'nombre' => $datos['nombre'],
                ));
            }
        }
        $collClienteCod->save();
        return array('success' => (count($collClienteCod) > 0) ? true : false,
            'existenClientes' => $clientExist,
        );
    }

    public function getNombreClienteProveedorById($datos)
    {
        $configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        $clientes = $configuracionHelper->getClientesProveedorByParams(
            $datos, $this->global->Estructura->idestructura, true, true,
            false, false, false, false
        );
        return $clientes['datos'][0];
    }

    public function eliminarElementos($datos)
    {
        if ($datos['opcion'] == 1) {
            Doctrine_Query::create()
                ->delete('DatCodigoindicador')
                ->whereIn('idcodigoindicador', $datos['arrayAuxiliar'])
                ->execute();
        } else {
            Doctrine_Query::create()
                ->delete('DatClientecodigo')
                ->whereIn('idclientecodigo', $datos['arrayAuxiliar'])
                ->execute();
        }
        return array('success' => true);
    }

    public function getConjuntoIndicador($params)
    {
        $query = $this->getQueryIndicador('ind');
        $query->innerJoin('ind.DatIndicadorconjunto dinc')->addWhere('dinc.idpadre = ?', array($params['idpadre']));
        $query->addSelect('dinc.cantidad as cantidad, dinc.idindicadorconjunto as idindicadorconjunto');
        $all = $query->fetchArray();
        $cantidad = $query->count();
        $query->offset($params['start'])->limit($params['limit']);
        $datos = $query->fetchArray();
        return array('datos' => $datos, 'cantidad' => $cantidad, 'adicionados' => LogisticaObjectHelper::__init()->extractValueFromArrayColumn($all, 'idindicador'));
    }

    public function eliminarConjunto($params)
    {
        Doctrine_Query::create()
            ->delete('DatIndicadorconjunto')
            ->whereIn('idindicadorconjunto', json_decode($params['datos']))
            ->execute();
        return array('success' => true);
    }

    public function addIndicadorExterno($params)
    {
        $marcas = array();
        $vehiculos = array();
        $formatos = $this->getFormatosVariable();
        if (count($formatos)) {
            $idformato = $formatos[0]['valor'];
            $collection = new Doctrine_Collection('NomIndicador');
            $collIndicadorCliente = new Doctrine_Collection('DatIndicadorcliente');
            $existe = Doctrine::getTable('NomIndicador')
                ->findByDql('denominacion = ? and idformato = ?', array('Equipos reparaciones', $idformato));
            if (count($existe)) {
                $indicador = $existe[0];
            } else {
                $indicador = new NomIndicador();
                $indicador->tipo = 1;
                $indicador->denominacion = 'Equipos reparaciones';
                $indicador->idformato = $idformato;
                $indicador->idespecialidad = 1;
            }
            //$indicador->synchronizeWithArray();
            foreach ($params['equipos'] as $index => $n) {
                $existe1 = Doctrine::getTable('NomIndicador')
                    ->findByDql('lower(denominacion) = ? and idformato = ?', array(strtolower($index), $idformato));
                if (count($existe1)) {
                    $nivel = $existe1[0];
                } else {
                    $nivel = new NomIndicador();
                    $nivel->tipo = 1;
                    $nivel->denominacion = $index;
                    $nivel->idformato = $idformato;
                    $nivel->idespecialidad = 1;
                    $nivel->NomIndicador = $indicador;
                }
                foreach ($n as $u) {
                    $idmarca = $this->getMarcaByCodigo($u['marca']);
                    $idmodelo = -1;
                    if ($idmarca != -1) {
                        $idmodelo = $this->getModeloByCodigo($u['marca'], $u['modelo']);
                        if ($idmodelo == -1) {
                            $marcas[$u['marca']][] = $u['modelo'];
                        }
                    } else {
                        $marcas[] = $u['marca'];
                    }
                    $nivel2 = new NomIndicador();
                    $existe2 = Doctrine::getTable('NomIndicador')
                        ->findByDql('numeropieza = ? and idformato = ?', array($u['serie'], $idformato));
                    if (count($existe2)) {
                        $nivel2->assignIdentifier($existe2[0]->idindicador);
                        $existe3 = Doctrine::getTable('DatIndicadorcliente')->findByDql(
                            'idcliente <> ? and estado = 1 and idindicador = ?', array($params['idcliente'], $existe2[0]->idindicador)
                        );
                        if (count($existe3) && !isset($params['reasignar'])) {
                            $vehiculos[] = $u['serie'];
                        } else if ($params['reasignar']) {
                            $indClienteOld = new DatIndicadorcliente();
                            $indClienteOld->assignIdentifier($existe3[0]->idindicadorcliente);
                            $indClienteOld->estado = 0;
                            $indClienteOld->fechafin = '10/04/2021';
                            $collIndicadorCliente->add($indClienteOld);

                            //adicionando con el nuevo cliente
                            $indCliente = new DatIndicadorcliente();
                            $indCliente->idcliente = $params['idcliente'];
                            //$hoja->tipocontrol = 1;
                            $indCliente->codigoaux = $u['codigo'];
                            $indCliente->ano = $u['anno'];
                            $nivel2->DatIndicadorcliente->add($indCliente);
                            $collection->add($nivel2);
                        }
                    } else {
                        $hoja = new NomIndicadorhoja();
                        $indCliente = new DatIndicadorcliente();
                        $indCliente->idcliente = $params['idcliente'];
                        //$hoja->tipocontrol = 1;
                        $nivel2->numeropieza = $u['serie'];
                        $indCliente->codigoaux = $u['codigo'];
                        $indCliente->ano = $u['anno'];
                        $hoja->idmarca = $idmarca;
                        $hoja->idmodelo = $idmodelo;
                        $hoja->explotacion = 1;
                        $nivel2->tipo = 1;
                        $nivel2->denominacion = $u['denominacion'];
                        $nivel2->idformato = $idformato;
                        $nivel2->idespecialidad = 1;
                        $nivel2->NomIndicador = $nivel;
                        $nivel2->NomIndicadorhoja = $hoja;
                        $nivel2->DatIndicadorcliente->add($indCliente);
                        $collection->add($nivel2);
                    }
                }

            }

            //print_r($collection->toArray());die;
            //$indicador = new NomIndicador();

            //$this->salvarUltimoNivel($indicador, $dataProducto);
            //print_r($collection->toArray());die;
            if (!count($marcas) && !count($vehiculos)) {
                if ($collIndicadorCliente->count()) {
                    $collIndicadorCliente->save();
                }
                $collection->save();
            } else {
                return array('marcas' => $marcas, 'vehiculos' => $vehiculos);
            }
        } else {
            return false;
        }


        //print_r($formatos);die;
    }

    public function eliminarIndicadorCliente($idcliente, $arrayindicador)
    {
        $indicadores = implode(',', $arrayindicador);
        $sql = "update mod_datosmaestros.dat_indicadorcliente
        set fechafin = now(), estado = 0 where idcliente = {$idcliente} and idindicador in ($indicadores)";
        $respuesta = $this->doctrineHelper->getConnection()->execute($sql);
        return true;
    }

    public function getMarcaByCodigo($codigo)
    {
        $sql = "select nm.idmarca from mod_datosmaestros.nom_marca nm where lower(nm.codigo) = lower('{$codigo}') or lower(nm.denominacion) = lower('{$codigo}')";
        $marca = $this->doctrineHelper->getConnection()->fetchAssoc($sql);
        return (count($marca)) ? $marca[0]['idmarca'] : -1;
    }

    public function getModeloByCodigo($marca, $codigo)
    {
        $sql = "select nm.idmodelo from mod_datosmaestros.nom_modelo nm
                inner join mod_datosmaestros.dat_nommarcamodelo dnm on dnm.idmodelo = nm.idmodelo
                inner join mod_datosmaestros.nom_marca mar on mar.idmarca = dnm.idmarca
                where lower(nm.denominacion) = lower('{$codigo}') and (lower(mar.codigo) = lower('{$marca}') or lower(nm.denominacion) = lower('{$codigo}'))";
        $modelo = $this->doctrineHelper->getConnection()->fetchAssoc($sql);
        return (count($modelo)) ? $modelo[0]['idmodelo'] : -1;
    }

    /*
     *   -- Validacion antes de cambiar el grupo --
     *   Si existen activos con el mismo grupo en diferentes entidades
     *   que esten aperturadas y que contabilicen no debe dejar cambiar el grupo.
     */
    public function validarCambioEnGrupo($idindicador, $idgrupo)
    {
        $indicador = Doctrine::getTable('NomIndicadorhoja')->find($idindicador);

        if ($indicador && $idgrupo && $indicador->idgruposubgrupo && $idgrupo != $indicador->idgruposubgrupo) {
            $sql = "
                SELECT DISTINCT e.denominacion as entidad
                    FROM mod_datosmaestros.nom_indicador i
                    INNER JOIN mod_datosmaestros.nom_indicadorhoja ih ON ih.idindicador = i.idindicador
                    INNER JOIN mod_logistica.dat_producto p ON p.idindicador = ih.idindicador
                    INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON rn.idproducto = p.idproducto
                    INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
                    INNER JOIN mod_estructuracomp.v_dametodasestructuras e ON e.idestructura = p.idestructuracomun
                    INNER JOIN mod_datosmaestros.dat_estructurasubsist des on des.idestructuracomun = p.idestructuracomun and des.idsubsistema = 11
                WHERE
                    i.idindicador = {$idindicador}
                    AND rna.idestadoperacion > 0
                    AND des.aperturado = 1
                    AND des.contabiliza = 1
            ";
            $conn = Zend_Registry::get('conexion');
            $result = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);

            return $result;
        }
    }
    public function importarFicheroCSV($datos, $params) {
        Doctrine_Query::create()->delete('DatImpproducto')->execute();
        $collection = new Doctrine_Collection('DatImpproducto');
        $errorCodificacion = array();

        foreach ($datos as &$item) {
            $prodArrAux = $item;
            if (count($prodArrAux)) {
                if (mb_detect_encoding($prodArrAux[1], 'UTF-8', true) && mb_detect_encoding($prodArrAux[2], 'UTF-8', true))
                {
                    $prodInd = new DatImpproducto();
                    $prod = array();
                    $umAux = explode(',', $prodArrAux[5]);
                    if (count($umAux)) {
                        $um = $umAux[0];
                        $prod['um'] = $um;
                    }
                    $prod['codigoproducto'] = $prodArrAux[1];
                    $prod['codigoauxiliar'] = $prodArrAux[1];
                    $prod['denominacionproducto'] = /*str_replace("\"", '', */utf8_encode($prodArrAux[3])/*)*/;
                    $prod['descripcionproducto'] = /*str_replace("\"", '', */utf8_encode($prodArrAux[3])/*)*/;
                    $prod['naturaleza'] = substr($prodArrAux[1], 0, 3);
                    $prod['tipo'] = ($prodArrAux[4] == 'yes') ? 1 : 2;
                    $prod['almacenamiento'] = 1;
                    $prod['utiloherramienta'] = 0;
                    $prod['precio'] = 0;
                    $prod['formaalmacenamiento'] = 1;
                    $prod['grupo'] = null;
                    $prod['marca'] = null;
                    $prod['modelo'] = null;
                    $prod['elementogasto'] = null;
                    $prod['elementogastoalternativo'] = null;
                    $prod['referencia'] = $prodArrAux[0];
                    $prod['codigobarra'] = (strlen($prodArrAux[2]) > 5) ? $prodArrAux[2] : null;

                    $prodInd->synchronizeWithArray($prod);
                    $collection->add($prodInd);
                } else {
                    $prod = array();

                    $umAux = explode(',', $prodArrAux[5]);
                    if (count($umAux)) {
                        $um = $umAux[0];
                        $prod['um'] = $um;
                    }

                    $prod['codigoproducto'] = utf8_encode($prodArrAux[1]);
                    $prod['denominacionproducto'] = /*str_replace("\"", '', */utf8_encode($prodArrAux[3])/*)*/;
                    $prod['descripcionproducto'] = /*str_replace("\"", '', */utf8_encode($prodArrAux[3])/*)*/;
                    $prod['naturaleza'] = substr($prodArrAux[1], 0, 3);
                    $prod['codigobarra'] = (strlen($prodArrAux[2]) > 5) ? utf8_encode($prodArrAux[2]) : null;
                    $prod['error'] = 4;

                    $errorCodificacion[] = $prod;
                }
            }
        }
        $error = false;//implementar errores
        $collection->save();

        if (!$error) {
            $sql = "SELECT * FROM mod_datosmaestros.f_importaproducto({$this->global->Perfil->idusuario})";
            $result = Doctrine_Manager::connection()->fetchOne($sql);
            // Productos duplicados. Error 3.
            // Codigo producto nulo. Error 4.

            if (count($errorCodificacion)){
                $sqlInsert = "insert into mod_datosmaestros.tmp_impproductoerror(
                        codigoproducto,
                        codigobarra,
                        denominacionproducto,
                        um,
                        error
                      ) 
                      VALUES";

                    foreach ($errorCodificacion as $index => $e) {
                        $sqlInsert .= "('{$e['codigoproducto']}', '{$e['codigobarra']}', '{$e['denominacionproducto']}', '{$e['um']}',
                                        '4')";
                        if ($index + 1 < count($errorCodificacion)) {
                            $sqlInsert .= ',';
                        }
                    }
                Doctrine_Manager::connection()->fetchAll($sqlInsert);
            }
            $sqlError = "SELECT * FROM mod_datosmaestros.tmp_impproductoerror";

            $resultError = Doctrine_Manager::connection()->execute($sqlError)->fetchAll(PDO::FETCH_ASSOC);
            $error = count($resultError);
        }
        /*if (substr_count($result, '3') > 0) {
            $error = 3;
        }
        if (substr_count($result, '4') > 0) {
            $error = 4;
        }*/
        return array(
            'total' => $collection->count(), 'datos' => $collection->toArray(),
            'error' => ($error) ? $error : null
        );
    }

    //Importar
    public function importarFichero($file, $params)
    {

        $error = $file['error'];
        Doctrine_Query::create()->delete('DatImpproducto')->execute();
        $collection = new Doctrine_Collection('DatImpproducto');
        $collection->synchronizeWithArray($file['productos']);
        $collection->save();
        if (!$error) {
            $error = $this->importarProducto();
        }

        return array(
            'total' => $collection->count(), 'datos' => $collection->toArray(),
            'error' => ($error) ? $error : null,
        );
    }

    public function importarProducto()
    {
        $sql = "SELECT * FROM mod_datosmaestros.f_importaproducto({$this->global->Perfil->idusuario})";
            // Productos duplicados. Error 3.
            // Codigo producto nulo. Error 4.

        $result = Doctrine_Manager::connection()->fetchOne($sql);
        $error = 0;
        if (substr_count($result, '3') > 0) {
            $error = 3;
        }
        if (substr_count($result, '4') > 0) {
            $error = 4;
        }
        if (substr_count($result, '7') > 0) {
            $error = 7;
        }
        if (substr_count($result, '8') > 0) {
            $error = 8;
        }
        if (substr_count($result, '9') > 0) {
            $error = 9;
        }
        if (substr_count($result, '10') > 0) {
            $error = 10;
        }
        return $error;
    }

    public function sincronizarArray($datos, $params)
    {
        $campos = array(
            'codigoproducto', 'codigoauxiliar', 'denominacionproducto', 'descripcionproducto', 'um', 'naturaleza', 'tipo',
            'almacenamiento', 'utiloherramienta', 'precio', 'formaalmacenamiento',
            'grupo', 'marca', 'modelo', 'elementogasto', 'elementogastoalternativo', 'codigobarra'
        );
        $productos = array();

        foreach ($datos as $index => $item) {
            if ($index > 0) {
                $prod = array();
                if (strlen($item[0]) > 0) {
                    foreach ($item as $key => $value) {
                        $value = trim($value);
                        if ($value && (substr_count($campos[$key], 'cantidad') || substr_count($campos[$key], 'precio') ||
                                substr_count($campos[$key], 'importe'))) {
                            $value = str_replace(',', '', $value);

                        }
                        $prod[$campos[$key]] = $value ? $value : null;
                    }
                    $productos[] = $prod;
                }

            }
        }

        return array('productos' => $productos, 'error' => $error);
    }
    public function cargarProductoError($filtro)
    {
        if (isset($filtro['csv'])) {
            $selectD = "SELECT err.* from mod_datosmaestros.tmp_impproductoerror err
    ORDER BY err.error, err.codigoproducto";
        } else {
            $selectD = "(SELECT a.*
    FROM mod_datosmaestros.dat_impproducto a
    inner join (
        select _a.codigoproducto as duplicado
             from mod_datosmaestros.dat_impproducto _a
             where _a.codigoproducto is not null
             group by _a.codigoproducto
             having count(_a.codigoproducto) > 1
    ) b on (a.codigoproducto = b.duplicado)
    ORDER BY a.codigoproducto)";
        }

        /*$selectV = "( select aa.codigoproducto AS vacio
        FROM mod_datosmaestros.dat_impproducto aa
        WHERE aa.codigoproducto IS NULL) ";*/

        $cantidad = count(Doctrine_Manager::connection()->fetchAll($selectD));
        if (isset($filtro['errorcodif'])) {
            $errorProd = json_decode($filtro['errorcodif']);
        }
        $datos = array();
        if (isset($errorProd)) {
            $datos = $errorProd;
        }
        $datos = array_merge($datos, Doctrine_Manager::connection()
            ->fetchAll($selectD));
        return array(
            'cantidad' => $cantidad,
            'datos' => array_splice($datos, $filtro['start'], $filtro['limit']),
        );
    }
    public function eliminarImportar()
    {
        Doctrine_Query::create()->delete('DatImpproducto')->execute();
    }

    public function getTipoEnvase()
    {
        $estructura = 'Estructura';
        $global = ZendExt_GlobalConcept::getInstance();
        $estructura = $global->$estructura->idestructura;
        $sqlDatos = " SELECT te.denominacion, te.idtipoenvase
                FROM mod_datosmaestros.nom_tipoenvase te
                INNER JOIN mod_datosmaestros.dat_tipoenvaseentidad tee on tee.idtipoenvase = te.idtipoenvase
                WHERE tee.idestructuracomun =  {$estructura}";
        return array(
            'cantidad' => 1000,
            'datos' => LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sqlDatos),
        );
    }

    public function exportarError($params)
    {
        $objPHPExcel = new PHPExcel();

        // Cambiando las propiedades del documento
        $objPHPExcel->getProperties()->setCreator("DISTRA");
        $objPHPExcel->getProperties()->setLastModifiedBy("DISTRA");
        $objPHPExcel->getProperties()->setTitle("PRODUCTOS CON ERRORES AL IMPORTAR");
        $objPHPExcel->getProperties()->setSubject("PRODUCTOS CON ERRORES");
        $objPHPExcel->getProperties()->setDescription("Reporte de productos con errores.");
        $objPHPExcel->getProperties()->setKeywords("Producto, error");
        $objPHPExcel->getProperties()->setCategory("REPORTE");

        // Configurando encabezado
        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('PRODUCTOS ERRORES');

        //Crear cuerpo del documento
        $objPHPExcel = self::crearCuerpoExportar($objPHPExcel, $params);

        // Save Excel 95 file
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');

        error_reporting(E_ALL);
        ini_set('display_errors', true);
        ini_set('display_startup_errors', true);

        define('EOL', (PHP_SAPI == 'cli') ? PHP_EOL : '<br />');

        // Generate the server headers
        $name = "PRODUCTOS_ERRORES_". date('dmy_his');
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment; filename=" '. $name . '.xls"');
        header("Content-Transfer-Encoding: binary");
        header('Expires: 0');
        header('Cache-Control: max-age=0');
        header('Cache-Control: max-age=1');
        header('Cache-Control: cache, must-revalidate');
        header('Expires: ' . gmdate('D, d M Y H:i:s') . ' GMT');
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');

        if (strpos($_SERVER['HTTP_USER_AGENT'], "MSIE") !== false) {
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Pragma: public', true);
        } else {
            header('Pragma: no-cache');
        }

        $objWriter->save('php://output');
    }

    public function crearCuerpoExportar($objPHPExcel, $params) {
        if (isset($params['csv']) && $params['csv'] == 1) {
            $selectD = "SELECT err.* from mod_datosmaestros.tmp_impproductoerror err
    ORDER BY err.codigoproducto";
        } else {
            $selectD = "(SELECT a.*
    FROM mod_datosmaestros.dat_impproducto a
    inner join (
        select _a.codigoproducto as duplicado
             from mod_datosmaestros.dat_impproducto _a
             where _a.codigoproducto is not null
             group by _a.codigoproducto
             having count(_a.codigoproducto) > 1
    ) b on (a.codigoproducto = b.duplicado)
    ORDER BY a.codigoproducto)";
        }

        /*if (isset($filtro['errorcodif'])) {
            $errorProd = json_decode($filtro['errorcodif']);
        }*/
        $datos = array();
        if (isset($errorProd)) {
            $datos = $errorProd;
        }
        $datos = array_merge($datos, Doctrine_Manager::connection()
            ->fetchAll($selectD));

        $objPHPExcel->getActiveSheet()->setCellValue('A' . 1, "Codigo");
        $objPHPExcel->getActiveSheet()->setCellValue('B' . 1, "Codigo Barras");
        $objPHPExcel->getActiveSheet()->setCellValue('C' . 1, "Denominacion");
        $objPHPExcel->getActiveSheet()->setCellValue('D' . 1, "UM");
        $objPHPExcel->getActiveSheet()->setCellValue('E' . 1, "Tipo Error");

        $row = 2;

        foreach ($datos as &$prod) {
            switch ($prod["error"]) {
                case '1':
                    $prod["error"] = 'Codigo repetido';
                    break;
                case '2':
                    $prod["error"] = 'Codigo barra repetido';
                    break;
                case '3':
                    $prod["error"] = 'Codigo vacio';
                    break;
                case '4':
                    $prod["error"] = 'Caracter especial en el codigo';
                    break;
                default:
                    break;
            }
            $objPHPExcel->getActiveSheet()->setCellValue('A' . $row, $prod["codigoproducto"]);
            $objPHPExcel->getActiveSheet()->setCellValue('B' . $row, $prod["codigobarra"]);
            $objPHPExcel->getActiveSheet()->setCellValue('C' . $row, $prod["denominacionproducto"]);
            $objPHPExcel->getActiveSheet()->setCellValue('D' . $row, $prod["um"]);
            $objPHPExcel->getActiveSheet()->setCellValue('E' . $row, $prod["error"]);
            $row++;
        }

        return $objPHPExcel;
    }

    public function generarCodigoBarrasProductoError($post)
    {
        $idestandarcodigobarra = $post['idestandarcodigobarra'];
		$idestructura = $this->global->Estructura->idestructura;
        if (!$idestandarcodigobarra) {
            return [
                'codigoMsg' => -2, 
                'msg' => 'Debe seleccionar un estandar de codigo de barra'
            ];
        }

        $conn = Doctrine_Manager::connection();

        $errores = $conn->fetchAll("
            select error
            from mod_datosmaestros.tmp_impproductoerror
            group by error
        ");

        if (!(count($errores) === 1 && $errores[0]['error'] == 7)) {
            return [
                'codigoMsg' => -1, 
                'msg' => 'Resuelva los demas errores aparte de los codigo barra vacio'
            ];
        }
		
		$result = Doctrine_Manager::connection()->fetchOne("
			select *
			from mod_datosmaestros.f_generar_codigo_barra_en_impproducto(
				{$idestandarcodigobarra},
				{$idestructura}
			)
		");

        $error = $this->importarProducto();
        if ($error === 0) {
            return [
                'datos' => $datos,
                'codigoMsg' => 1,
                'msg' => 'Se importaron los datos',
                'error' => $error
            ];
        } else {
            return [
                'codigoMsg' => -3,
                'msg' => 'Esto no deberia pasar',
                'error' => $error
            ];
        }
    }

	public function generarCodigoBarrasGeneral($post)
	{
		$idestandarcodigobarra = $post['idestandarcodigobarra'];
        if (!$idestandarcodigobarra) {
            return [
                'codigoMsg' => -2, 
                'msg' => 'Debe seleccionar un estandar de codigo de barra'
            ];
        }

		$globalConcept = ZendExt_GlobalConcept::getInstance();
        $idEstructura = $globalConcept->EstructuraEconomica->idestructuracomun;

		$conn = Zend_Registry::get('conexion');
		$res = $conn->fetchAll("
			select *
			from mod_datosmaestros.f_generar_codigo_barra_en_indicadorhoja({$idestandarcodigobarra}, {$idEstructura}) 
		");
		
		return [
			'codigoMsg' => $res[0]['codigo_msg'],
			'msg' => $res[0]['msg']
		];
	}
}
