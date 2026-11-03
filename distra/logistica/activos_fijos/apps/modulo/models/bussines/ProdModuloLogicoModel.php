<?php

/**
 * Clase que implementa todos los métodos relacionados con el comportamiento de un producto lógico como un módulo
 *
 * @autor Jorge Luis Cuellar Mondeja
 */
class ProdModuloLogicoModel extends BaseModel
{

    public function __construct()
    {
        parent::__construct();
    }

    /**
     *
     */
    private function eliminarProdModulo($aux, $idProductosNoUsados, $flag, $collection, $idProductosUsados)
    {
        if ($aux) {
            $cant = count($idProductosNoUsados);
            $i = 0;
            while ($i < $cant) {
                $obj = Doctrine::getTable('DatProductoLogistica')->find($idProductosNoUsados[$i]);
                $collection->add($obj);
                $i++;
            }
            $collection->delete();
        }
        if ($flag) {
            self::habilitarModuloLogico($idProductosUsados, true);
        }
    }

    /**
     *
     */
    private function filtro($parametros)
    {
        $query = new Doctrine_Query();
        if ($parametros->idarea) {
            $query->addwhere("p.idestructura = ?", array($parametros->idarea));
        }

        if ($parametros->denominacion) {
            $query->addwhere("pm.denominacion like '%{$parametros->denominacion}%'");
        }

        if ($parametros->nroinventario) {
            $query->addwhere(
                "drna.nroinventario like '%$parametros->{nroinventario}%'"
            );
        }
        
        if ($parametros->criterio) {
            $query->addwhere("pm.denominacion like '%{$parametros->criterio}%'");
        }
        
        if ($parametros->idsRegNumNoMostrar) {
            $query->andWhereNotIn($parametros->idsRegNumNoMostrar);
        }

        if ($parametros->denominacion && $parametros->plantilla) {
            $query->addWhere("pl.denominacion iLIKE  '%{$parametros->denominacion}%'");
        }

        return $query;
    }

    /**
     * Adicionar un módulos lógico
     */
    public function adicionarModuloLogico($denominacion, $idAreaResp)
    {
        $existeP = $this->existeModuloLogico($denominacion, $idAreaResp);
        $cProductoModulo = 'DatProductoModulo';

        if ($existeP >= 1) {
            return 2;
        } else {
            $obj = new DatProductoLogistica();
            $obj->idestructura = $idAreaResp;
            $obj->$cProductoModulo->denominacion = $denominacion;
            $obj->save();

            return 1;
        }
    }

    /**
     * Modificar un módulos lógico
     */
    public function modificarModuloLogico($datos, $idAreaResp)
    {
        new DatProductoModulo();
        $cProductoModulo = 'DatProductoModulo';
        $obj = Doctrine:: getTable('DatProductoLogistica')->find($datos[0]->idproducto);
        $obj->$cProductoModulo->denominacion = $datos[0]->denominacion;
        $obj->idestructura = $idAreaResp;
        $obj->save();

        return 1;
    }

    /**
     * Eliminar módulos lógico
     */
    public function eliminarModulologico($parametros)
    {
        foreach ($parametros as $valores) {
            if ($valores->idproducto != null) {
                $idproductos[] = $valores->idproducto;
            }
        }

        $collection = new Doctrine_Collection('DatProductoLogistica');
        $query = Doctrine_Query::create();
        $query->from('DatRegnumerico rn');
        $query->addSelect('rn.idregnumerico, rn.idproducto');
        $query->whereIn("rn.idproducto", $idproductos);
        $query->orderBy('rn.idproducto ASC');
        $sistema = $query->fetchArray();

        foreach ($parametros as $valores) {
            $flag = false;
            foreach ($sistema as $datos) {
                if ($valores->idproducto == $datos['idproducto']) {
                    $flag = true;
                    $idProductosUsados[] = $datos['idproducto'];
                }
            }
            if (!$flag) {
                $aux = true;
                $idProductosNoUsados[] = $valores->idproducto;
            }
        }

        $this->eliminarProdModulo($aux, $idProductosNoUsados, $flag, $collection, $idProductosUsados);
    }

    /**
     * Obtener un listado de módulos lógicos
     */
    public function getModuloLogico($parametros)
    {
        new DatProductoModulo();
        $query = self::filtro($parametros);

        if ($parametros->accion == 'gestagrupacion') {
            if ($parametros->interfazNroInventario == 1) {

                $query->select(
                    'pm.denominacion as denominacion,
                     pm.estado as estado,
                     p.idproducto,
                     p.idestructura'
                )
                    ->from('DatProductoLogistica p')
                    ->leftJoin('p.DatProductoModulo pm')
                    ->addwhere("p.idindicador is null");
                $total = $query->count();
                $datos = $query->limit($parametros->limit)->offset($parametros->start)->fetchArray();
                return array('datos' => $datos, 'cantidad' => $total, 'total' => $total);
            }
        } else {
            if ($parametros->interfazNroInventario == 1) {

                $query->select(
                    'pm.denominacion as denominacion,
                    pm.estado as estado,
                    p.idproducto,
                    p.idestructura'
                )
                    ->from('DatProductoLogistica p')
                    ->innerJoin('p.DatProductoModulo pm')
                    ->addwhere("p.idindicador is null")
                    ->addwhere(" pm.estado = 1");
                $total = $query->count();
                $datos = $query->limit($parametros->limit)->offset($parametros->start)->fetchArray();
                return array('datos' => $datos, 'total' => $total, 'cantidad' => $total);

            } else {
                $query->select(
                    'drn.idregnumerico as idregnumerico,
                     pm.denominacion as denominacion,
                     pm.idproducto as idproducto,
                     pm.estado as estado,
                     drna.nroinventario'
                )
                    ->from('DatRegnumericoActivo drna')
                    ->innerJoin('drna.DatRegnumerico drn')
                    ->innerJoin('drn.DatProductoLogistica p')
                    ->innerJoin('p.DatProductoModulo pm')
                    ->addwhere("p.idindicador is null")
                    ->addwhere("drna.asignado = 1")
                    ->addwhere("drna.idarearesp =?", array($parametros->idarea));

                $total = $query->count();
                $datos = $query->limit($parametros->limit)->offset($parametros->start)->fetchArray();

                return array('datos' => $datos, 'total' => $total, 'cantidad' => $total);
            }
        }

    }

    /**
     * Comprobar si existe algún producto que tenga la misma denominación que el
     * que se quiere insertar, en la misma estructura
     */
    public function existeModuloLogico($denominacion, $idAreaResp)
    {
        $query = new Doctrine_Query();
        new DatProductoModulo();
        $query->from('DatProductoLogistica p')->innerJoin('p.DatProductoModulo pm');

        $query->addWhere("pm.denominacion iLike '$denominacion' AND p.idestructura = $idAreaResp");

        return $query->count();
    }

    /**
     *
     */
    public function habilitarModuloLogico($idProducto, $boolean)
    {
        $estado = ($boolean == false) ? 1 : 0;
        $colleObj = new Doctrine_Collection('DatProductoModulo');

        $query = Doctrine_Query::create();
        $query->from('DatProductoModulo mod');
        $query->whereIn("mod.idproducto", $idProducto);
        $sistema = $query->fetchArray();

        foreach ($sistema as $value) {
            if ($value != null) {
                $producto = Doctrine::getTable('DatProductoModulo')->find($value['idproducto']);
                $producto->estado = $estado;
                $colleObj->add($producto);
            }
        }
        $colleObj->save();
    }

}
