<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatMatrizpreciodualmonetaria extends BaseDatMatrizpreciodualmonetaria
{

    public function setUp()
    {
        parent::Setup();
        $this->hasOne(
            'DatMatrizprecio', array(
                'local'   => 'idmatrizprecio',
                'foreign' => 'idmatrizprecio'
            )
        );
        $this->hasMany(
            'DatPrecio', array(
                'local'   => 'idmatrizpreciodualidadmonetaria',
                'foreign' => 'idmatrizpreciodualidadmonetaria'
            )
        );
    }

    /**
     * Funcion que permite guardar la configuracion
     * de la matriz de precio o tarifa de Facturacion
     * para determinada estructura
     *
     * @param array  $params     Arreglo con las configuraciones
     *                           de una estructura determinada
     * @param object $newMatriz  Objeto de doctrine de matrizprecio
     * @param array  $collection Arreglo de objectos de la matriz de precio
     *
     * @return NULL
     */
    public function modifiedDualidadMonetaria($params, $newMatriz = false, $flag = false, $modificarGeneral = false)
    {
        $matrizPreciosDatas = $params['matriz']->matrizPreciosDatas;
        $params['preciopromedio'] = 0;
        if (!$modificarGeneral && $params['idmatrizprecio']) {
            $obj = Doctrine::getTable('DatMatrizprecio')->find($params['idmatrizprecio']);
            $params['preciopromedio'] = $obj->preciopromedio;
        }
        if ($flag == 'crear') {
            $newMatriz = DatMatrizprecio::createMatriz(
                [
                    'idmatrizprecio'    => $params['idmatrizprecio'],
                    'idindicador'       => $params['idindicador'],
                    'idestructuracomun' => $params['idestructuracomun'],
                    'idtipoprecio'      => $params['idtipoprecio'],
                    'idorigen'      => $params['idorigen'],
                    'iddestino'      => $params['iddestino'],
                    'fechavigencia'      => $params['fechavigencia'],
                    'preciopromedio'    => $params['preciopromedio']
                ]
            );
        }
        if ($matrizPreciosDatas) {
            foreach($matrizPreciosDatas as $index => $preciomoneda){
                $newDualidad = new DatMatrizpreciodualmonetaria();
                $dualidad = array(
                    'idmoneda'    => $preciomoneda->idmoneda, //$matrizBySelection[0],
                    'precio'      => $preciomoneda->precio, //$matrizBySelection[1],
                    'precioventa' => $preciomoneda->precioventa//$matrizBySelection[2]
                );
                if ($preciomoneda->idmatrizpreciodualidadmonetaria) {
                    $newDualidad->assignIdentifier($preciomoneda->idmatrizpreciodualidadmonetaria);
                }
                $newDualidad->synchronizeWithArray($dualidad);
                $this->modifiedDualidadMonetariaAux($preciomoneda->columnDinamicaDatas, $preciomoneda, $newDualidad);
                $newMatriz->DatMatrizpreciodualmonetaria->add($newDualidad);
            }
        }
        $newMatriz->save();
    }

    public function modifiedDualidadMonetariaAux($columnDinamicaDatas, $matrizPreciosDatas, $newDualidad)
    {
        foreach ($columnDinamicaDatas as $value) {
            if ($matrizPreciosDatas->idmatrizpreciodualidadmonetaria) {
                $newPrecio = Doctrine::getTable('DatPrecio')
                    ->findByDql(
                        'idmatrizpreciodualidadmonetaria = ? and idcuentadesgloseprecio = ?', array(
                            $matrizPreciosDatas->idmatrizpreciodualidadmonetaria,
                            $value->idcuentadesgloseprecio
                        )
                    );
                $value->valor = ($value->valor) ? $value->valor : 0;
                $newPrecio[0]->idmatrizpreciodualidadmonetaria = $matrizPreciosDatas->idmatrizpreciodualidadmonetaria;
                $newPrecio[0]->synchronizeWithArray($value);
                $newPrecio[0]->save();
            } else {
                $newPrecio = new DatPrecio();
                settype($value, 'Array');
                $newPrecio->synchronizeWithArray($value);
                $newDualidad->DatPrecio->add(
                    $newPrecio
                );
            }
        }
    }

}
