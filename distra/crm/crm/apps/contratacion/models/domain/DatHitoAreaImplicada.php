<?php

class DatHitoAreaImplicada extends BaseDatHitoAreaImplicada
{

    public function setUp()
    {
        parent::setUp();
    }
	
	static function guardar($datos)
    {
		$hitoArea=new DatHitoAreaImplicada();
		if($datos['idhitoareaimplicada'] && $datos['idhitoareaimplicada']!=''){
//			$hitoArea=Doctrine::getTable('DatHitoAreaImplicada')
//                    ->find($datos['idhitoareaimplicada']);
            $hitoArea=Doctrine::getTable('DatHitoAreaImplicada')
                ->findBySql(
                    'idarea=' . $datos['idarea'] . ' AND 
                    idhito='. $datos['idhito']
                )->getFirst();
		}
		$hitoArea->idarea=$datos['idarea'];
		$hitoArea->porciento=$datos['porciento'];
		$hitoArea->monto=$datos['monto'];
		$hitoArea->idhito=$datos['idhito'];
		$hitoArea->idlineanegocio=$datos['idlineanegocio']?$datos['idlineanegocio']:null;
		$hitoArea->idproducto=$datos['idproducto']?$datos['idproducto']:null;
		$hitoArea->idservicio=$datos['idservicio']?$datos['idservicio']:null;
		$hitoArea->save();
		return $hitoArea->idhitoareaimplicada;
	}

	static function eliminarLista($array)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatHitoAreaImplicada')
            ->whereIn('idhitoareaimplicada', $array)
            ->execute();
    }

    static function eliminarPorParametros($datos)
    {
        $query = Doctrine_Query::create();
//        print_r($datos);die;
        $query->delete()->from('DatHitoAreaImplicada')
            ->where('idarea=? AND idhito=?', array($datos['idarea'], $datos['idhito']))
            ->execute();
    }
    
}
