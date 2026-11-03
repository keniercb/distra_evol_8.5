<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatCuentadesgloceprecio extends BaseDatCuentadesgloceprecio
{

    public function setUp()
    {
        parent::Setup();
        $this->hasOne(
            'DatCategoriaprecioentidad',
            array(
            'local' => 'idcategoriaprecioentidad',
            'foreign' => 'idcategoriaprecioentidad'
            )
        );
        $this->hasMany(
            'DatDesgloceprecioexento',
            array(
            'local' => 'idcuentadesgloseprecio',
            'foreign' => 'idcuentadesgloseprecio'
            )
        );
        $this->hasMany(
            'DatPrecio',
            array(
            'local' => 'idcuentadesgloseprecio',
            'foreign' => 'idcuentadesgloseprecio'
            )
        );
        $this->hasMany(
            'NomClasificacioncontablelog', array('local' => 'idcuenta', 'foreign' => 'idclasificacioncontable')
        );
    }

    /**
     * Funcion que permite obtener los distintos tipos
     * de idcategoriaprecioentidad que existen
     *
     * @param array $params Arreglo con los parametros necesarios
     *                      para obtener las categorias de precios definidos
     *
     * @return array Retorna un arreglo con los idcategoriaprecioentidad
     */
    public function getResultByIdtipoPrecio($params)
    {
        $datos = Doctrine_Query::create()
            ->select(
                'dcdp.idcategoriaprecio,'
                . 'dcdp.idcuentadesgloseprecio'
            )
            ->from('DatCuentadesgloceprecio dcdp')
            //->innerJoin('dcdp.DatCategoriaprecioentidad dcpe')
            ->where(
                'dcdp.idtipoprecio = ?',
                array($params['tipoP'])
            )
            ->fetchArray();
        return $this->toConvertArray($datos);
    }

    /**
     * Funcion que permite convertir un array de index en otro de posiciones
     *
     * @param array $array Arreglo de index
     *
     * @return array Retorna un arreglo de posiciones
     *  con los idcategoriaprecioentidad
     */
    public function toConvertArray($array)
    {
        $newArray = [];
        foreach ($array as $value) {
            if ($value['DatCategoriaprecioentidad']) {
                $idcategoria = $value['DatCategoriaprecioentidad'];
                $newArray[] = $idcategoria['idcategoriaprecio'];
            } else {
                $newArray[] = $value['idcategoriaprecio'];
            }
            //$newArray[] = $value['idcuentadesgloseprecio'];            
        }
        return $newArray;
    }

    /**
     * Funcion que permite guardar la configuracion de Facturacion
     * para determinada estructura
     *
     * @param array $params Arreglo con las configuraciones
     *                      de una estructura determinada
     *
     * @return NULL
     */
    public function modifiedDesglosePrecio($params)
    {
        $result = new stdClass();
        $result->success = true;
        $result->codigoMsg = 1;
        $flags = false;
        if ($params['added']) {
            $this->addDesglosePrecio($params);
        }
        if ($params['deleted']) {
            $datas = $this->getCuentadesgloceprecioByIdCategoria(
                $params['deleted'], $params['tipoP']
            );
            $this->modifiedDesglosePrecioAux($datas, $result, $flags);
        }
        return $result;
    }

    public function modifiedDesglosePrecioAux($datas, &$result, $flags)
    {
        $colleccion = new Doctrine_Collection('DatCuentadesgloceprecio');
        foreach ($datas as $value) {
            $exists = DatPrecio::existsCuentaDesglosePrecio(
                    $value['idcuentadesgloseprecio']
            );
            if (count($exists) == 0) {
                $obj = new DatCuentadesgloceprecio();
                $obj->assignIdentifier($value);
                $colleccion->add($obj);
                $flags = true;
            } else {
                $result->success = false;
                $result->codigoMsg = 2;
            }

        }
        if ($flags) {
            $colleccion->delete();
        }
    }

    /**
     * Funcion que permite selecionar cuentas desgloce precio
     *
     * @param mixed $idcategoriaprecio El identificador de la tabla
     *                                 DatCuentadesgloceprecio
     *
     * @return array Retorna de $idcuentadesgloceprecio encontrados
     */
    public function getCuentadesgloceprecioByIdCategoria($arr, $tipoPrecio)
    {
        return Doctrine_Query::create()
                ->select(
                    'dcpe.idcategoriaprecioentidad as idcategoriaprecioentidad,'
                    . 'dcdp.idcuentadesgloseprecio'
                )
                ->from('DatCuentadesgloceprecio dcdp')
                ->leftJoin('dcdp.DatCategoriaprecioentidad dcpe')
                ->whereIn(
                    'dcdp.idcategoriaprecio', $arr
                )->addWhere('dcdp.idtipoprecio = ?', array($tipoPrecio))
                ->fetchArray();
    }

    /**
     * Funcion que permite eliminar la configuracion de las categorias de precio
     * de Facturacion para determinada estructura
     *
     * @param array $params Arreglo con las configuraciones
     *                      de una estructura determinada
     *
     * @return NULL
     */
    public function deletedDesglosePrecio(/* $params */)
    {

        /*
          $idcategoriaprecio = Doctrine_Query::create()
          ->select('dcpe.idcategoriaprecioentidad')
          ->from('DatCategoriaprecioentidad dcpe')
          ->whereIn('dcpe.idcategoriaprecio', $params['deleted'])
          ->fetchArray();
          $idcategoriaprecioentidad = $this->toConvertArray($idcategoriaprecio);
          Doctrine_Query::create()
          ->delete()
          ->from('DatCuentadesgloceprecio')
          ->whereIn('idcategoriaprecioentidad', $idcategoriaprecioentidad)
          ->execute(); */
    }

    /**
     * Funcion que permite guardar la configuracion de las categorias de precio
     * de Facturacion para determinada estructura
     *
     * @param array $params Arreglo con las configuraciones
     *                      de una estructura determinada
     *
     * @return NULL
     */
    public function addDesglosePrecio($params)
    {
        $collection = new Doctrine_Collection('DatCuentadesgloceprecio');
        foreach ($params['added'] as $value) {
            $desglose = new DatCuentadesgloceprecio();
            if ($params['actionMod'] == 'modCuentas') {
                $desglose->assignIdentifier($value->idcuentadesgloseprecio);
            } else {
                /*$categoriaprecioentidad = $this->getIdCtgPrecEntByParams(
                    $params['idestructuracomun'], $value->idcategoriaprecio
                );
                $categoria = $categoriaprecioentidad[0]['idcategoriaprecioentidad'];*/
                $desglose->idcategoriaprecio = $value->idcategoriaprecio;
               // $desglose->idcategoriaprecioentidad = $categoria;
                $desglose->idtipoprecio = $params['tipoP'];
            }
            if ($value->idcuenta) {
                $desglose->idcuenta = $value->idcuenta;
            }
            $collection->add($desglose);
        }
        $collection->save();
    }

    /**
     * Funcion que permite obtener
     * los distintos tipos de categorias de precio
     *
     * @param mixed $idestructuracomun El identificador de la estructura
     * @param mixed $idcategoriaprecio El identificador de
     *                                 la categoria de precio
     *
     * @return array Retorna un arreglo de las categorias de precio encontradas
     */
    public function getIdCtgPrecEntByParams($idestructuracomun, $idcategoriaprecio)
    {
        $objNomenclador = new NomencladoresLogService();
        $query = $objNomenclador->getQueryCategoriaPrecio();
        return $query->addWhere(
                    'dcpe.idestructuracomun = ? and dcpe.idcategoriaprecio =?',
                    array($idestructuracomun, $idcategoriaprecio)
                )
                ->fetchArray();
    }

    /**
     * Funcion que permite contar
     * los distintos tipos de categorias de precio
     *
     * @param mixed $idcategoriaprecioentidad El identificador de la tabla
     *                                        DatCategoriaprecioentidad
     *
     * @return int Retorna el total de $idcategoriaprecioentidad encontrados
     */
    public function checkIfExist($idcategoriaprecioentidad)
    {
        return Doctrine_Query::create()
                ->from('DatCuentadesgloceprecio dcdp')
                ->innerJoin('dcdp.DatCategoriaprecioentidad dcpe')
                ->where(
                    'dcdp.idcategoriaprecioentidad = ?', array($idcategoriaprecioentidad)
                )
                ->count();
    }

}
