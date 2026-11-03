<?php

class NomTipoConstruccionModel extends NomencladoresGeneralesModel {
    
     private $tipomaterialModel, $material;
    public function NomTipoConstruccionModel()
    {  
        parent::ZendExt_Model();
        $this->tipomaterialModel = new NomTipoConstruccion();
        $this->material = new NomMaterialConstruccion();
    }

    public function getMaterialConstruccion($parametros)
    {
        $datos = $this->material->getDatos($parametros);   
        $total = $this->material->getCantDatos($parametros);
        return array('cantidad' => $total, 'datos' => $datos);
    }

    public function getTipoConstruccion($parametros)
    {
        $datos = $this->tipomaterialModel->getDatos($parametros);
        $total = $this->tipomaterialModel->getCantDatos($parametros);
        return array('cantidad' => $total, 'datos' => $datos);
    }
    
      public function GetInsertarTipoConstruccion($parametros){
        unset($parametros['idtipoconstruccion']);
        
        $denomDuplicada = $this->tipomaterialModel->isTipoConstruccionDuplicada($parametros);
        if ($denomDuplicada==1) {
            $modelo = new NomTipoConstruccion();         
            $modelo->synchronizeWithArray($parametros);          
            $modelo->save();
        }

        return $denomDuplicada; 
    }
    
    public function GetInsertarMaterialConstruccion($parametros){
        
        unset($parametros['idtipoconstruccion']);        
        $denomDuplicada = NomMaterialConstruccion ::isMaterialConstruccionDuplicado($parametros);        
  
      if ($denomDuplicada==1) {
            $modelo = new NomMaterialConstruccion ();         
            $modelo->synchronizeWithArray($parametros);  
            
            $relacion = new DatTipoMaterialConstruccion();
            $relacion->idtipoconstruccion = $parametros['idpadre'];  
            $modelo->DatTipoMaterialConstruccion->add($relacion);            
            $modelo->save();            
       }
        return $denomDuplicada;
    }    
    
    public function modificarMaterialConstruccion($parametros){       
        
         $denomDuplicada = $this->material->isMaterialConstruccionDuplicado($parametros);        

         if ($denomDuplicada==1) {
         
            $modelo = Doctrine::getTable('NomMaterialConstruccion')->find($parametros['idmaterialesconstruccion']);
            $modelo->synchronizeWithArray($parametros);
            $modelo->save();
            return 1;
   
        }
           return $denomDuplicada;     
        
    }
    
     public function modificarTipoConstruccion($parametros){     
      
        $denomDuplicada = $this->tipomaterialModel->isTipoConstruccionDuplicada($parametros);      
      
        if ($denomDuplicada==1) {
            $modelo = Doctrine::getTable('NomTipoConstruccion')->find($parametros['idtipoconstruccion']);
            $modelo->synchronizeWithArray($parametros);
            $modelo->save();
            return 1;   
        }
        return $denomDuplicada;

     }     
     
      public function eliminarTipoConstruccion($parametros, $modificar = array())
   
      {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();

        $tipomaterialesconstruccion = ($parametros['idnom']) ? json_decode(stripcslashes($parametros['idnom'])) : $parametros;

        foreach ($tipomaterialesconstruccion as $key => $idtipoconstruccion) {          
                try {
                    Doctrine::getTable('NomTipoConstruccion')->find($idtipoconstruccion)->delete();

                } catch (Doctrine_Connection_Pgsql_Exception $e) {

                    if ($e->getCode() == '23503') {

                        unset($tipomaterialesconstruccion[$key]);
                        $modificar[] = $idtipoconstruccion;

                        if ($conn->getTransactionLevel() != 0) {
                            $conn->rollBack();
                        }
                        self::eliminarTipoConstruccion($tipomaterialesconstruccion, $modificar);
                    }
                }          
        }

        if ($modificar) {

            $conn = Zend_Registry::get('conexion');
            $arr = implode(',', $modificar);
            $conn->execute("UPDATE mod_logactivofijotangible.nom_tipoconstruccion SET estado = 0 WHERE (idtipoconstruccion IN ($arr))");

            return 3;
        }

        return true;
    }    
     
      public function eliminarMaterialConstruccion($parametros, $modificar = array())
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();

        $materialesconstruccion = json_decode(stripcslashes($parametros['idnom']));

        foreach ($materialesconstruccion as $key => $idmaterialesconstruccion) {
            $relacion = $this->material->GetRealacionesMC($idmaterialesconstruccion);

            if (count($relacion->toArray()) == 0) {
                try {
                    Doctrine::getTable('NomMaterialConstruccion')->find($idmaterialesconstruccion)->delete();

                } catch (Doctrine_Connection_Pgsql_Exception $e) {
                    if ($e->getCode() == '23503') {
                   
                        unset($parametros[$key]);
                        $modificar[] = $idmaterialesconstruccion;

                        if ($conn->getTransactionLevel() != 0) {
                            $conn->rollBack();
                        }

                        $materialesconstruccion['idnom'] = $materialesconstruccion;
                        self::eliminarMaterialConstruccion($materialesconstruccion, $modificar);
                    }
                }

            } else {

                    Doctrine::getTable('DatTipoMaterialConstruccion')->findByDql(
                    'idmaterialesconstruccion = ? and idtipoconstruccion = ?',
                    array($idmaterialesconstruccion, $parametros['idtipoconstruccion'])
                )->delete();
            }
        }

        if ($modificar) {

            $conn = Zend_Registry::get('conexion');
            $arr = implode(',', $modificar);
            $conn->execute("UPDATE mod_logactivofijotangible.nom_materialesconstruccion SET estado = 0 WHERE (idmaterialesconstruccion IN ($arr))");

            return 3;
        }

        return true;
    }

}
