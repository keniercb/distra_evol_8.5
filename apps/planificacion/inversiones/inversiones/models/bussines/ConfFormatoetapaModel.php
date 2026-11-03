<?php

class ConfFormatoetapaModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function cargarFormatoEtapa($param) {
        return ConfFormatoetapa::getFormatosEtapaC($param);
    }
    
    public function mismoFormatoEtapa($param) {
        $denomExiste = ConfFormatoetapa::denomExistente($param);
        return (count($denomExiste) > 0) ? true : false;
    }

    public function adicionarFormatoEtapa($param) {
        if ($param['addMod'] == 0)
            $objConfformatoetapa = ConfFormatoetapa::getByid($param['idformatocomponente']);
        else
            $objConfformatoetapa = new ConfFormatoetapa();
        $objConfformatoetapa->denominacion = $param['denominacion'];
        $objConfformatoetapa->descripcion = $param['descripcion'];
        $objConfformatoetapa->save();
        return true;
    }

    public function getFormatoCompById($param) {
        return ConfFormatoetapa::getByid($param['idformatocomponente'])->toArray();
    }

    public function eliminarFormatoComponente($param) {
        $objConfformatoetapa = ConfFormatoetapa::getByid($param['idformatocomponente']);
        $objConfformatoetapa->delete();
        return true;
    }

    public function actDesactFormatoComponente($param) {

		$query = new Doctrine_Query ();
        $result = $query->update('ConfFormatoetapa n')
                ->set('activado', $param['activar'])
				->whereIn('idformatoetapa', json_decode(stripslashes($param['idformatoetapa'])))
				->execute();
                
        return true;

    }
    
    public function aprobDesapFormatoComponente($param) {
					

		$query = new Doctrine_Query ();
        $result = $query->update('ConfFormatoetapa n')
                ->set('aprobado', $param['aprobar'])
				->whereIn('idformatoetapa', json_decode(stripslashes($param['idformatoetapa'])))
				->execute();
        return true;
    }
}
