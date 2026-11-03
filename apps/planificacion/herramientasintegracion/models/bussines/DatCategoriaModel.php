<?php

class DatCategoriaModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }
    
    public static function crearDatCategoria($idefecto, $denominacion) {
        $objDatCategoria = new DatCategoria();
        $objDatCategoria->idefecto = $idefecto;
        $objDatCategoria->denominacion = $denominacion;
        return $objDatCategoria;
    }


    public static function guardarCategoria($objCategoria) {
        $data = array();
        
        try {
            $idefecto = $objCategoria['idefecto'];
            $denominacion = $objCategoria['denominacion'];
            $buscar = self::buscarCategoria($denominacion, $idefecto);

            if (count($buscar) > 0) {
                
                $data = array("cod" => 1, "mensaje" => "La categor&iacute;a que quiere adicionar ya existe."); 
                
            } else {
                $objDatCategoria = self::crearDatCategoria($idefecto, $denominacion);
                $objDatCategoria->save();
                $data = $objDatCategoria->toArray();                
            }
            
        } catch (Exception $ex) {
            $data = array("cod" => 3, "mensaje" => $ex->getMessage());
        }        
        
        return $data;
    }
    
    public static function modificarCategoria($objCategoria) {        
        $data = array();
        try {
            $idcategoria = $objCategoria['idcategoria'];
            $idefecto = $objCategoria['idefecto'];
            $denominacion = $objCategoria['denominacion'];
            $buscar = self::buscarCategoria($denominacion, $idefecto);

            if (count($buscar) > 0) {
                
                $data = array("cod" => 1, "mensaje" => "Ya existe una categor&iacute;a con esta denominaci&oacute;n."); 
                
            } else {
                $newObjCategoria = DatCategoria::getByid($idcategoria);
                $newObjCategoria->denominacion = $denominacion; 
                $newObjCategoria->save();
                $data = $newObjCategoria->toArray();
            }
            
        } catch (Exception $ex) {
            $data = array("cod" => 3, "mensaje" => $ex->getMessage());
        }
        
        return $data;      
    }


    public static function eliminarCategoria($objCategoria) {
        $data = false;        
        $idcategoria = $objCategoria['idcategoria']; 
        $newObjCategoria = DatCategoria::getByid($idcategoria);
        if($newObjCategoria != null && isset($newObjCategoria)) {            
            $data = $newObjCategoria->delete();
        }        
        return $data;
    }
    
    public static function getByParams($objEfecto, $offset, $limit) {
        $idefecto = $objEfecto['idefecto'];
        $data = DatCategoria::getByParams($idefecto, $offset, $limit);

        foreach($data as $key => $objData){
            $idcategoria = $objData['idcategoria'];
            $type = 'categoria';
            $leaf = DatCategoriaModel::cargarArbolCategoria($type, $idcategoria, false);

            if(!$leaf){
                $data[$key]['leaf'] = true;
            }
        }

        $total = DatCategoria::getByEfecto($idefecto);
        return array("datos" => $data, "total" => count($total));
    }
    
    public static function cargarArbolCategoria($type, $idcategoria, $idcausa) {
        $data = array();        
        if ($type === 'categoria') {            
            $data = DatCausa::listCategoria($idcategoria);
        } elseif ($type === 'causa') {            
            $data = DatCausa::listCausa($idcategoria, $idcausa);            
        }
        return $data;
    }
    
    public static function buscarCategoria($denominacion, $idefecto = false) {
        return DatCategoria::buscarCategoria($denominacion, $idefecto);
    }
    
    public static function findCategoria($denominacion, $idefecto) {
        return DatCategoria::findCategoria($denominacion, $idefecto);
    }
	
	public function getDatosReporte($params) {
		$data = array();
		$arraycategoriacausas = array();
        $categorias = $this->getByParams($params,0,10000);
		$index = 0;
		foreach($categorias['datos'] as $catagoria){
			$aux = $this->cargarArbolCategoria('categoria',$catagoria['idcategoria'],null);
			$arraycategoriacausas[$index] = $catagoria;
			$arraycategoriacausas[$index]['causas'] = $aux;
			$index += 1;
			
		}
		
		
        $data[0]->tipo = 'arbol';
        $data[0]->columnas = array('Categorías y causas');
        $data[0]->referencia = array('denominacion');
        $data[0]->encabezado = $params['denominacioncausa'];
        $data[0]->referenciaParent = 'idpadre';
        $data[0]->referenciaSon = 'idcausa';
        $data[0]->hijos = 'causas';
        $data[0]->datos = $arraycategoriacausas;
		
        return $data;
    }
	
		
	

}
