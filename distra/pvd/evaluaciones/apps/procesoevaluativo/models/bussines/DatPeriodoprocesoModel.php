<?php 
class DatPeriodoprocesoModel extends ZendExt_Model 
 { 
	 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatPeriodoprocesoModel $DatPeriodoprocesoModel) 
    { 
            $DatPeriodoprocesoModel->save();
    } 
 
   public function Actualizar(DatPeriodoprocesoModel $DatPeriodoprocesoModel) 
    { 
            $DatPeriodoprocesoModel->save();
    } 
 
   public function Eliminar($DatPeriodoprocesoModel) 
    { 
            $DatPeriodoprocesoModel->delete();
    } 
    
  public function ModificarEstado($idperiodoproceso)
    {
        try {
			$objDomain = new DatPeriodoproceso();
            return $objDomain->ModificarEstado($idperiodoproceso);
            
            } 
         catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }
    public function getGestionarpersonas($idpersona, $idperiodoproceso, $limit = null, $start = null, $filtro = null)
    {
        try {
			
            $objDomain = new DatPeriodoproceso();
            $r->datos = $objDomain->getGestionarpersonas($idpersona, $idperiodoproceso, $limit, $start, $filtro);
            
            $r->cantidad = $objDomain->getCantGestionarpersonas($idpersona, $idperiodoproceso, $filtro);   
                    
            return $r;
        } catch (Exception $e) {
            throw $e;
        }
    }
     public function cambiarEvaluador($idpersona_eval,$idpersona){
        try{
            $objDomain = new DatEvalpersonaevaluacion();            
            return $objDomain->cambiarEvaluador($idpersona_eval,$idpersona);
                           
          }catch (Exception $e){
            throw $e;
        }
    }

    public function Sincronizarestructura($idperiodoproceso){
        try{
            $idestructura = $this->global->Estructura->idestructura;
            $objDomain = new DatEvalpersonaevaluacion();
            set_time_limit(36000);
            ini_set('memory_limit', '2048M');
            return $objDomain->sincronizarestructura($idperiodoproceso,$idestructura);

        }catch (Exception $e){
            throw $e;
        }
    }
    
}
