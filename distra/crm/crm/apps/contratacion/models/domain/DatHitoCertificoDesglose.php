<?php

class DatHitoCertificoDesglose extends BaseDatHitoCertificoDesglose
{

    public function setUp()
    {
        parent::setUp();
    }

    static function listarPorCondicion($condicion)
    {
        $query = Doctrine_Query::create();
        return $query->select()->from('DatHitoCertificoDesglose')
            ->where($condicion)
            ->fetchArray();
    }
	
	static function guardar($datos)
    {
		$instance=new DatHitoCertificoDesglose();
		if($datos['idhitocertificodesglose'] && $datos['idhitocertificodesglose']!=''){
//			$instance=Doctrine::getTable('DatHitoAreaImplicada')
//                    ->find($datos['idhitoareaimplicada']);
            $instance=Doctrine::getTable('DatHitoCertificoDesglose')
                ->find($datos['idhitocertificodesglose']);
		}
        $instance->idhito=$datos['idhito'];
        $instance->idusuario=$datos['idusuario'];
        $instance->fecha=date('d/m/Y');
        $instance->save();
		return $instance->idhitocertificodesglose;
	}

	static function eliminarLista($array)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatHitoCertificoDesglose')
            ->whereIn('idhitocertificodesglose', $array)
            ->execute();
    }

    static function eliminarPorCondicion($condicion)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from('DatHitoCertificoDesglose')
            ->where($condicion)
            ->execute();
    }
    
}
