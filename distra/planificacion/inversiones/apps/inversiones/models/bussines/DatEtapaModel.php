<?php

class DatEtapaModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function cargarComponentes($param) {
        return DatEtapa::cargarComponentesByIdFormatoEtapa($param);
    }

    public function asocComponente($param, $idnomComponentes) {
        try {
            $collectionEtapas = new Doctrine_Collection('DatEtapa');
            $estado = DatEtapaModel::listarEstadoIniFlujo($param);
            foreach ($idnomComponentes as $index => $idnometapa) {
                $objDatetapa = new DatEtapa();
                $objDatetapa->idformatoetapa = $param['idnombreformatocomponente'];
                $objDatetapa->idnombreetapa = $idnometapa;
                $objDatetapa->idflujotrabajo = $param['idflujotrabajo'];
                $objDatetapa->orden = $param['orden'] + 1;
                $ordenar = $param['orden'] + 1;
                $objDatetapa->idestadoflujotrabajo = $estado[0]['idestadoinicial']?$estado[0]['idestadoinicial']:0;
                $collectionEtapas[$index] = $objDatetapa;
                $param['orden'] = $ordenar;
            }
            $collectionEtapas->save();
        } catch (Doctrine_Exception $ee) {
            if ($ee->getCode() == 23503)
                return '-4';
        }
        return true;
    }

    public function listarEstadoIniFlujo($param) {
        $conn = Doctrine_Manager::connection();
        $sql = "select
		trainicial.idestadoinicial 
					FROM mod_planifinversiones.dat_flujotrabajo 
					INNER JOIN mod_planifinversiones.dat_transicion trainicial ON (trainicial.idflujotrabajo = mod_planifinversiones.dat_flujotrabajo.idflujotrabajo)
					
					WHERE ( mod_planifinversiones.dat_flujotrabajo.idflujotrabajo= " . $param['idflujotrabajo'] . " and trainicial.inicial = 1 )
					Group by 
					trainicial.idestadoinicial";
      //  print_r($sql);die;
        $datosListar = $conn->execute($sql);
        $datos = $datosListar->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function desComponente($arrayIdNomEtapa) {
        try {
            $collectionEtapas = new Doctrine_Collection('DatEtapa');
            foreach ($arrayIdNomEtapa as $index => $idnometapa) {
                $objDatetapa = Doctrine::getTable('DatEtapa')->find($idnometapa);
                $collectionEtapas[$index] = $objDatetapa;
            }
            $collectionEtapas->delete();
        } catch (Doctrine_Exception $ee) {
            if ($ee->getCode() == 23503)
                return '-4';
        }

    }

    public function actualizarComponente($param) {
        foreach ($param as $componente) {
            $objDatetapa = DatEtapa::getByid($componente->idetapa);
            $objDatetapa->idformatoetapa = $componente->idformatoetapa;
            $objDatetapa->idnombreetapa = $componente->idnombreetapa;
            $objDatetapa->orden = $componente->orden;
            $objDatetapa->save();
        }
    }
    
    public function getEtapas($params,$entidades){
        $resultado = DatEtapa::getEtapasDadoEntidades($params, $entidades);        
        $resultado = $this->array_unique_callback(
                $resultado, function ($company) {
                    return $company['idnombreetapa'];
                }
        );        
        return $resultado;
    }
    
    public function array_unique_callback(array $arr, callable $callback, $strict = false) {
        return array_filter(
                $arr, function ($item) use ($strict, $callback) {
                    static $haystack = array();
                    $needle = $callback($item);
                    if (in_array($needle, $haystack, $strict)) {
                        return false;
                    } else {
                        $haystack[] = $needle;
                        return true;
                    }
                }
        );
    }
  

}
