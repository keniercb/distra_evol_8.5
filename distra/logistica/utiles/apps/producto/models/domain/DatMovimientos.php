<?php

class DatMovimientos extends BaseDatMovimientos
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasOne('DatProductoLogistica', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->hasMany('DatMovmoneda',  array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
        //$this->hasOne('DatMovValoresGenerales', array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
        //$this->hasMany('DatMovUbicProducto', array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
        if (class_exists('NomClasificacioncontablelog')) {
            $this->hasOne(
                'NomClasificacioncontablelog',
                array('local' => 'idclasificacion', 'foreign' => 'idclasificacioncontable')
            );
        }
    }

    public function GetLLave()
    {
        $query = new Doctrine_Query();
        $result = $query->select('MAX(idmovimiento)')->from('DatMovimientos')->execute();
        $arr = $result->toArray();

        return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1);
    }

    public function Buscar($idmovimiento)
    {
        return Doctrine::getTable('DatMovimientos')->find($idmovimiento);
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatMovimientos')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatMovimientos')->limit($limite)->offset($inicio)->execute();
        return $result->toArray();
    }

    public function existeMovimiento($iddocumento, $idprod)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatMovimientos dm')
            ->where(
                "dm.iddocumento = ? and dm.idproducto = ?", array($iddocumento, $idprod)
            )->execute();
        return $result->toArray();
    }

    public function DevolverProductosDocumentos($iddocumento)
    {
        $query = new Doctrine_Query();
        $query->select(
            'dm.iddocumento, dm.idproducto, dm.recargodescuento, dm.cantidad,'
            . 'dm.preciocontable, dm.importecontable'
        )
            ->from('DatMovimientos dm')->where("dm.iddocumento = ?", $iddocumento);
        return array('cantidad' => $query->count(), 'datos' => $query->orderBy('dm.idproducto')->fetchArray());
    }

    public function CalcularImporteTotal($iddocumento)
    {
        return Doctrine_Query::create()
            ->select('sum(m.importecontable) as importe')
            ->from('DatMovimientos m')
            ->where('m.iddocumento = ?', array($iddocumento))
            ->fetchArray();
    }

    public function getQueryMovimientos($alias, array $parametros)
    {
        $query = new Doctrine_Query();
        $query->select(
            '       idmovimiento,
                                idmoneda as idmoneda,
                                iddocumento as iddocumento,
                                idproducto as idproducto,
                                recargodescuento as recargodescuento,
                                tienedualidad as tienedualidad,
                                preciocontable as preciocontable,
                                importecontable as importecontable,
                                cantidad as cantidad
                            '
        )
            ->from("DatMovimientos {$alias}")
            ->where("{$alias}.iddocumento = ?", array($parametros['iddocumento']))
            ->orderBy('idmovimiento DESC');
        return $query;
    }

//    public function updatemovcontabilizar($idmovimiento, $cronologia, $precio){
//			$movimiento = Doctrine::getTable('DatMovimientos')->find($idmovimiento);
//			$movimiento->cronologia = $cronologia;
//			$movimiento->preciocontable = round($precio,6);
//			$movimiento->importecontable = round($precio * $movimiento->cantidad,2);
//			$movimiento->save();
//			return $movimiento;
//	}
//
//	public function getMovMismoDocOrigen($idsdocumento){
//		$query = new Doctrine_Query();
//        $datos = $query->select('dm.idproducto as idproducto,
//								 deu.idarea as idarea,
//								 sum(ubp.cantidad) as suma')
//                ->from('DatMovimientos dm')
//                ->innerJoin('dm.DatMovUbicProducto ubp')
//                ->innerJoin('ubp.DatEstructuraubicacion deu')
//                ->whereIn('dm.iddocumento', $idsdocumento)
//                ->groupby('dm.idproducto,
//									 deu.idarea')
//                ->fetchArray();
//	}
}
