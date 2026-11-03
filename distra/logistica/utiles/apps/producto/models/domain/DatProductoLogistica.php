<?php

class DatProductoLogistica extends BaseDatProductoLogistica
{

    public function setUp()
    {
        parent::setUp();
        if (class_exists('DatMovimientos')) {
            $this->hasMany('DatMovimientos', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        }
        if (class_exists('NomCategoriasproducto')) {
            $this->hasMany('NomCategoriasproducto', array('local' => 'idcategoria', 'foreign' => 'idcategoria'));
        }
        // $this->hasMany('DatRegnumerico', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        if (class_exists('NomIndicador')) {
            $this->hasOne('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        }
        if (class_exists('NomUnidadmedida')) {
            $this->hasOne('NomUnidadmedida', array('local' => 'idumedida', 'foreign' => 'idunidadmedida'));
        }
        if (class_exists('DatAreaproducto')) {
            $this->hasOne('DatAreaproducto', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        }
        if (class_exists('DatUbicacionproducto')) {
            $this->hasOne('DatUbicacionproducto', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        }
        if (class_exists('NomClasificacioncontablelog')) {
            $this->hasOne(
                'NomClasificacioncontablelog',
                array('local' => 'idclasificacioncontable', 'foreign' => 'idclasificacioncontable')
            );
        }
        if (class_exists('DatCantidadesComprometidas')) {
            $this->hasMany('DatCantidadesComprometidas', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        }
    }

    public function GetLLave()
    {
        $query = new Doctrine_Query();
        $result = $query->select('MAX(idproducto)')->from('DatProductoLogistica')->execute();
        $arr = $result->toArray();
        return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1);
    }

    public function Buscar($idmovimiento)
    {
        return Doctrine::getTable('DatProductoLogistica')->find($idmovimiento);
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatProductoLogistica')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatProductoLogistica')->limit($limite)->offset($inicio)->execute();
        return $result->toArray();
    }

    public function existeProducto($iddeposito, $idprod)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatProductoLogistica dp');

        if (is_array($iddeposito)) {
            $result->whereIn("dp.idestructura", $iddeposito)->addWhere("dp.idindicador = ?", array($idprod));
        } else {
            $result->where("dp.idestructura = ? and dp.idindicador = ?", array($iddeposito, $idprod));
        }
        $datosProd = $result->execute();
        return $datosProd->toArray();
    }

    public function existeIdProd($idprod)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatProductoLogistica dp')->where("dp.idprod = ?", array($idprod))->execute();
        return $result->toArray();
    }

    public function getProd($idprod)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatProductoLogistica dp')->where("dp.idprod = ?", array($idprod))->execute();
        return $result->toArray();
    }

    public function GetIdesProdEnAlmacen($idestructuraop)
    {

        $conn = Zend_Registry::get('conexion');
        return $conn->execute(
                    "SELECT DISTINCT p.idprod FROM mod_logistica.dat_producto p "
                    . "INNER JOIN  mod_logistica.dat_movimiento m ON p.idproducto = m.idproducto "
                    . "WHERE m.cronologia > 0 AND p.idestructuraop = '$idestructuraop'"
                )
                ->fetchAll(PDO::FETCH_COLUMN);
    }

    public function validarExistenciaProdCantegDep($idestructura, $idindicador, $idcategoria, $idumedida, $cfgInv, $loteFarmacia = false)
    {
        $query = Doctrine_Query::create();
        $cant = $query->select("dp.idproducto ")
            ->from('DatProductoLogistica dp')
            ->where(
                'dp.idindicador = ? and dp.idestructura = ? and dp.idumedida = ? ',
                array($idindicador, $idestructura, $idumedida)
            );
        if ($cfgInv['categoriaproducto']) {
            if (!empty($idcategoria)) {
                $cant->andWhere('dp.idcategoria = ?', array($idcategoria));
            } else {
                $cant->andWhere('dp.idcategoria IS NULL');
            }
        }
        if ($loteFarmacia) {
            $cant->andWhere('dp.numerolote = ?', array($loteFarmacia));
        }
        return ($cant->count() == 0) ? true : false;
    }

    public function obtenerImporteTotalDeposito($iddeposito)
    {
        $query = Doctrine_Query::create();
        return $query->select("SUM(dp.importe)")
                ->from('DatProductoLogistica dp')
                ->where(' dp.idestructura = ? ', $iddeposito)
                ->fetchArray();
    }

    public function preInsert($event)
    {
        parent::preInsert($event);
        if ($this->contains('idestructuracomun') && is_null($this->idestructuracomun)) {
            $this->set('idestructuracomun', ZendExt_GlobalConcept::getInstance()->Estructura->idestructura);
        }
    }

}
