<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatMatrizprecio extends BaseDatMatrizprecio
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomConcepto', array(
                'local'   => 'idconcepto',
                'foreign' => 'idconcepto'
            )
        );
        $this->hasMany(
            'DatMatrizpreciodualmonetaria', array(
                'local'   => 'idmatrizprecio',
                'foreign' => 'idmatrizprecio'
            )
        );
        $this->hasMany(
            'DatDesgloceprecioexento', array(
                'local'   => 'idmatrizprecio',
                'foreign' => 'idmatrizprecio'
            )
        );
    }

    public function createMatriz($params)
    {
        $newMatriz = new DatMatrizprecio();
        if ($params['idmatrizprecio']) {
            $newMatriz->assignIdentifier($params['idmatrizprecio']);
        }
        $newMatriz->synchronizeWithArray(
            [
                'idindicador'       => $params['idindicador'],
                'idumedida'       => $params['idumedida'],
                'idestructuracomun' => $params['idestructuracomun'],
                'idtipoprecio'      => $params['idtipoprecio'],
                'idorigen'      => $params['idorigen'],
                'iddestino'      => $params['iddestino'],
                'fechavigencia'      => $params['fechavigencia'],
                'preciopromedio'    => $params['preciopromedio'],
                'bi'    => $params['bi']
            ]
        );
        return $newMatriz;
    }

    /**
     * Funcion que permite guardar la configuracion de la matriz de Facturacion
     * para determinada estructura
     *
     * @param array $params Arreglo con las configuraciones
     *                      de una estructura determinada
     *
     * @return NULL
     */
    public function modifiedMatrizPrecio($params)
    {
        $matriz = $params['matriz'];
        $params['idindicador'] = $matriz->idindicador;
        $params['idtipoprecio'] = $matriz->idtipoprecio;
        $params['idorigen'] = $matriz->idorigen;
        $params['iddestino'] = $matriz->iddestino;
        $params['fechavigencia'] = $matriz->fechavigencia;
        $params['idmatrizprecio'] = $matriz->idmatrizprecio;
        $params['idumedida'] = $matriz->idumedida;
        $collectionMod = new Doctrine_Collection('DatPrecio');
        $collection = new Doctrine_Collection('DatMatrizprecio');
        $datMatrizpreciodualmonetaria = new DatMatrizpreciodualmonetaria();
        $modificarGeneral = false;
        if ($matriz->matrizGeneralDatas) {
            $this->mofifiedMatrizAux($matriz, $collectionMod, $collection, $params, $datMatrizpreciodualmonetaria);
            $collectionMod->save();
            $modificarGeneral = true;
        }
        if (!empty($matriz->matrizPreciosDatas)) {
            $flag = 'crear';
            if(count($collection) > 0){
                $flag = false;
                $newMatriz = false;
                foreach($collection as $col){
                    if($col->idindicador == $params['idindicador']){
                        $newMatriz = $col;
                    }
                }
            }
            $datMatrizpreciodualmonetaria->modifiedDualidadMonetaria($params, $newMatriz, $flag, $modificarGeneral);
        }
    }

    public function mofifiedMatrizAux($matriz, $collectionMod, $collection, $params, $datMatrizpreciodualmonetaria)
    {
        foreach ($matriz->matrizGeneralDatas as $generalData) {
            $newMatriz = $this->createMatriz(
                [
                    'idmatrizprecio'    => $generalData->idmatrizprecio,
                    'idindicador'       => $generalData->idindicador,
                    'idumedida'       => $generalData->idumedida,
                    'idestructuracomun' => $params['idestructuracomun'],
                    'idtipoprecio'      => $params['idtipoprecio'],
                    'idorigen'      => $params['idorigen'],
                    'iddestino'      => $params['iddestino'],
                    'fechavigencia'      => $params['fechavigencia'],
                    'preciopromedio'    => ($generalData->preciopromedio) ? 1 : 0,
                    'bi'    => ($generalData->bi) ? 1 : 0
                ]
            );
            $adicionados = $generalData->add;
            if (count($adicionados) > 0) {
                $this->addDesgloseExcento($adicionados, $generalData, $collectionMod, $newMatriz, $collection);
            }
            $eliminados = $generalData->del;
            if (count($eliminados) > 0) {
                $this->deleteDesgloseExcento($eliminados, $generalData);
            }
            if ($generalData->matrizPreciosDatas) {
                $datMatrizpreciodualmonetaria->modifiedDualidadMonetaria(['matriz' => $generalData], $newMatriz, '');
            }
            $collection->add($newMatriz);
        }
        $collection->save();
    }

    public function addDesgloseExcento($adicionados, $generalData, $collectionMod, $newMatriz, $collection)
    {
        foreach ($adicionados as $value) {
            $newDesgloseExcento = new DatDesgloceprecioexento();
            $this->addDesgloseExcentoAux($generalData, $newDesgloseExcento, $collectionMod, $value);
            $newDesgloseExcento->idcuentadesgloseprecio = $value;
            $newMatriz->DatDesgloceprecioexento->add($newDesgloseExcento);
        }
        $collection->add($newMatriz);
    }

    public function addDesgloseExcentoAux($generalData, $newDesgloseExcento, $collectionMod, $value)
    {
        if ($generalData->idmatrizprecio) {
            $newDesgloseExcento->idmatrizprecio = $generalData->idmatrizprecio;
            $dualidad = Doctrine::getTable('DatMatrizpreciodualmonetaria')
                ->findByDql(
                    'idmatrizprecio=?', array($generalData->idmatrizprecio)
                );
            foreach($dualidad as $index => $dual){
                $datPrecioMod[$index] = Doctrine::getTable('DatPrecio')
                    ->findByDql(
                        'idcuentadesgloseprecio=? and idmatrizpreciodualidadmonetaria=?',
                        array(
                            $value,
                            $dual->idmatrizpreciodualidadmonetaria
                        )
                    )[0];
            }
            if (count($datPrecioMod) > 0) {
                foreach($datPrecioMod as $i => $precioMod){
                    $precioMod->valor = 0;
                    $collectionMod->add($precioMod);
                }
            }
        }
    }

    public function deleteDesgloseExcento($eliminados, $generalData)
    {
        $collectionDel = new Doctrine_Collection('DatDesgloceprecioexento');
        foreach ($eliminados as $value) {
            $newDesgloseExcento = Doctrine::getTable('DatDesgloceprecioexento')
                ->findByDql(
                    'idcuentadesgloseprecio=? and idmatrizprecio=?', array($value, $generalData->idmatrizprecio)
                );
            $collectionDel->add($newDesgloseExcento);
        }
        $collectionDel->delete();
    }

    /**
     * Funcion que permite eliminar los datos inconsistentes en las tablas
     * de Facturacion para determinada estructura
     *
     * @param array $params Arreglo con las configuraciones
     *                      de una estructura determinada
     *
     * @return NULL
     */
    public function updateTables($params)
    {
        $idmatrizprecio = Doctrine::getTable('DatMatrizprecio')
            ->findByDql(
                'idindicador = ? '
                . 'and idestructuracomun = ? '
                . 'and idtipoprecio = ?', array(
                    $params['idindicador'],
                    $params['idestructuracomun'],
                    $params['idtipoprecio']
                )
            );
        if (count($idmatrizprecio->toArray()) > 0) {
            $this->deleteInTable('DatDesgloceprecioexento', $idmatrizprecio);
            $this->deleteInTable('DatMatrizpreciodualmonetaria', $idmatrizprecio);
            $this->deleteInTable('DatMatrizprecio', $idmatrizprecio);
        }
    }

    /**
     * Funcion que permite eliminar los datos
     * segun la seleccion realizada en la matriz
     *
     * @param mixed $table          Nombre de la tabla
     * @param mixed $idmatrizprecio Identificador de la tabla
     *
     * @return boolean Retorna true si fue un exito eliminar los datos
     */
    public function deleteInTable($table, $idmatrizprecio)
    {
        Doctrine_Query::create()
            ->delete()
            ->from($table)
            ->where(
                'idmatrizpreciodualidadmonetaria = ?', array($idmatrizprecio[0]->idmatrizpreciodualidadmonetaria)
            )
            ->execute();
        return true;
    }

    /**
     * Funcion que permite obtener la matriz de precio o tarifa
     *
     * @param mixed $idindicador Identificador segun la seleccion
     *                           en el listado de la matriz
     *
     * @return array Retorna la matriz
     */
    public function findMatrizPrecio($idindicador, $params)
    {
        $query = Doctrine_Query::create()
            ->select('idmatrizprecio,preciopromedio,idumedida,bi')
            ->from('DatMatrizprecio')
            ->where('idindicador = ? and idtipoprecio = ? and idestructuracomun = ?', array($idindicador, $params['idtipoprecio'], $params['idestructuracomun']))->orderBy('idmatrizprecio')->limit(1);
        if($params['idorigen'] && $params['iddestino']){
            $query->addWhere("idorigen = ? and iddestino = ? and fechavigencia = '{$params['fechavigencia']}'", array($params['idorigen'], $params['iddestino']));
        }
        return $query->fetchArray();
    }

    /**
     * Funcion que permite filtrar las columnas dinamicas
     * para la matriz
     *
     * @param mixed $idmatrizprecio         Identificador de la matriz
     * @param mixed $idcuentadesgloseprecio Identificador
     *                                      de la categoria de precio
     *
     * @return int Retorna la cantidad total
     */
    public function getDynamicFields($idmatrizprecio, $idcuentadesgloseprecio)
    {
        return Doctrine_Query::create()
            ->from('DatDesgloceprecioexento')
            ->where(
                'idmatrizprecio = ? '
                . 'and idcuentadesgloseprecio = ?', array(
                    $idmatrizprecio,
                    $idcuentadesgloseprecio
                )
            )
            ->count();
    }

    /**
     * Funcion que permite cargar los datos
     * segun la seleccion realizada en la matriz
     *
     * @param array $params Arreglo con los datos necesarios
     *                      para obtener la matriz
     *
     * @return array Retorna los datos segun la seleccion y la cantidad total
     */
    public function getDataToMatrizPrecio($params)
    {
        $query = Doctrine_Query::create()
            ->select(
                'dmp.idmatrizprecio, dmp.idumedida, '
                . 'dm.idmoneda, dm.precio, '
                . 'dm.precioventa, '
                . 'dmp.preciopromedio, '
                . 'dmp.bi, '
                . 'dp.idcuentadesgloseprecio, '
                . 'dp.valor, '
                . 'dp.porciento, '
                . 'dp.concepto'
            )
            ->from('DatMatrizprecio dmp')
            ->leftJoin('dmp.DatMatrizpreciodualmonetaria dm')
            ->leftJoin('dm.DatPrecio dp');

        $endQuery = $this->getFiltrerToMatriz($params, $query);
        return [
            'cantidad' => $endQuery->count(),
            'datos'    => $endQuery->fetchArray()
        ];
    }

    /**
     * Funcion que permite filtrar los datos
     * segun la seleccion realizada en la matriz
     *
     * @param array  $params Arreglo con los datos necesarios
     *                       para obtener la matriz
     * @param object $query  Objeto de doctrine
     *
     * @return object Retorna el objecto de doctrine
     */
    public function getFiltrerToMatriz($params, $query)
    {
        if($params['idmatrizprecio']){
            $query->addWhere(
                'dmp.idmatrizprecio = ?', array($params['idmatrizprecio'])
            );
        }
        $query->addWhere(
            'dmp.idindicador = ?', array($params['identificador'])
        );
        $query->addWhere(
            'dmp.idestructuracomun = ?', array($params['idestructuracomun'])
        );
        if ($params['idtipoprecio']) {
            $query->addWhere(
                'dmp.idtipoprecio = ?', array($params['idtipoprecio'])
            );
        }
        if ($params['idorigen']) {
            $query->addWhere(
                'dmp.idorigen = ?', array($params['idorigen'])
            );
        }
        if ($params['iddestino']) {
            $query->addWhere(
                'dmp.iddestino = ?', array($params['iddestino'])
            );
        }
        if ($params['fechavigencia']) {
            $query->addWhere(
                'dmp.fechavigencia = ?', array($params['fechavigencia'])
            );
        }
        if ($params['fecha']) {
            $query->addWhere(
                "dmp.fechavigencia <= (SELECT MIN(dmp1.fechavigencia) FROM DatMatrizprecio dmp1 WHERE dmp1.fechavigencia >= ?)", array($params['fecha'])
            );
            $query->addWhere(
                "dmp.fechavigencia >= (SELECT MAX(dmp2.fechavigencia) FROM DatMatrizprecio dmp2 WHERE dmp2.fechavigencia <= ?)", array($params['fecha'])
            );
        }
        $query->orderBy('dmp.idmatrizprecio');
        return $query;
    }

}
