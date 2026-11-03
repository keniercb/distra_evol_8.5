<?php

class NomNomencladorReferencia extends BaseNomNomencladorReferencia {

    public function setUp(){
        parent::setUp();
        $this->hasOne('ConfReportesCertificaciones', array(
             'local' => 'idnomencladorreferencia',
             'foreign' => 'idnomencladorreferencia',
             'refClass' => 'ConfReportesCertificaciones'
        ));
    }
    
    public static function obtenerListadoNomencladorReferenciaportipo($tiponomenclador = -1, $inicio = 0, $limite = 10) {
        if($tiponomenclador == -1){
            return Doctrine_Query::create()
                    ->from('NomNomencladorReferencia')
                    ->orderBy('denominacion')
                    ->limit($limite)
                    ->offset($inicio)
                    ->fetchArray();
        }else {
            return Doctrine_Query::create()
                    ->from('NomNomencladorReferencia')
                    ->orderBy('denominacion')
                    ->where('tiponomenclador = ?', array($tiponomenclador))
                    ->limit($limite)
                    ->offset($inicio)
                    ->fetchArray();
        }        
    }

    public static function obtenerCantidadNomencladorReferenciaportipo($tiponomenclador = -1) {
        if($tiponomenclador == -1){
            return Doctrine_Query::create()->select('COUNT(*) AS cantidad')
                        ->from('NomNomencladorReferencia')
                        ->fetchOne()
                        ->cantidad;
        }else {
            return Doctrine_Query::create()->select('COUNT(*) AS cantidad')
                        ->from('NomNomencladorReferencia')
                        ->where('tiponomenclador = ?', array($tiponomenclador))
                        ->fetchOne()
                        ->cantidad;
        }
    }
    
    
    /*Busca los datos de los nomencladores de referencia en dependencia*/
    public static function ObtenerDatosNomenclador($idnomencladorreferencia, $tiponomenclador){
		if($tiponomenclador == null){
			$obj = Doctrine::getTable('NomNomencladorReferencia')->find($idnomencladorreferencia);
			if($obj){
				$tiponomenclador = $obj->tiponomenclador;
			}else{
				return array();
			}
		}
        if($tiponomenclador == 1){//Nomenclador que se carga de otra tabla
            $objNom = Doctrine_Query::create()
                        ->from('NomNomencladorReferencia')
                        ->where('idnomencladorreferencia = ?', array($idnomencladorreferencia))
                        ->fetchOne();
                        
            $select =   "select ".$objNom->llavecampomostrar." as valor, ".$objNom->campomostrar." as denominacion ";
            $from   =   "from ".$objNom->esquematabla." ";
            $where  =   "where ".$objNom->condicioncampomostrar." ;";
            $sql    = $select.$from.$where;
            
        }else{ //Nomenclador fijo y se carga de la tabla de nom_valoresnomencladorreferencia
            $sql    = "select valor, denominacion from mod_nomina.nom_valoresnomencladorreferencia where idnomencladorreferencia = {$idnomencladorreferencia}";
        }
        
        $mg     = Doctrine_Manager::getInstance();
        $conn   = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
	
	/**
     * Obtener todos los nomencladores de referencia.
     * 
     * @return array    Listado de los datos de nomencladores de referencia.
     */
    public static function obtenerTodosNomencladoresReferencia() {

        //Devolviendo el listado de los nomencladores de referencia en forma de arreglo.
        return Doctrine_Query::create()
                ->from('NomNomencladorReferencia')
                ->fetchArray();
    }
	
	/**
     * Obtener una tupla de un nomenclador de referencia dado el id del mismo y el identificador del valor.
     * 
	 * @param int idnomencladorreferencia   Identificador del nomenclador de referencia.
	 * @param int idvalor					Identificador la tupla.
	 *
     * @return array  Tupla del nomenclador de referencia.
     */
	public static function obtenerTuplaNomenclador($idnomencladorreferencia, $idvalor){
		
		$objNom = Doctrine_Query::create()
                        ->from('NomNomencladorReferencia')
                        ->where('idnomencladorreferencia = ?', array($idnomencladorreferencia))
                        ->fetchOne();
                        
		$select =   "select ".$objNom->llavecampomostrar." as valor, ".$objNom->campomostrar." as denominacion ";
		$from   =   "from ".$objNom->esquematabla." ";
		$where  =   "where ".$objNom->llavecampomostrar." = '$idvalor';";
		$sql    = $select.$from.$where;
		
        $mg     = Doctrine_Manager::getInstance();
        $conn   = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    
}
