<?php 
class DatIndicadorcriteriomedidaModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatIndicadorcriteriomedida $DatIndicadorcriteriomedida) 
    { 
            $DatIndicadorcriteriomedida->save();
    } 
 
   public function Actualizar(DatIndicadorcriteriomedida $DatIndicadorcriteriomedida) 
    { 
            $DatIndicadorcriteriomedida->save();
    } 
 
   public function Eliminar($DatIndicadorcriteriomedida) 
    { 
            $DatIndicadorcriteriomedida->delete();
    }

  public function relacionarCriteriosIndicadores($params)
  {
    try{
      $arraycriteriosseleccionados=$params->arraycriteriosseleccionados;
      foreach ($arraycriteriosseleccionados as $criterio) {
        $relacionCMI=new DatIndicadorcriteriomedida();
        $relacionCMI->idindicadorobjcrit=$params->idindicadorobjcrit;
        $relacionCMI->idcriteriomedida=$criterio->idcriteriomedida;
        $relacionCMI->save();
      }
      return 1;
    }catch (Exception $e){
      return 0;
    }
  }

  public function eliminarRelacionCriterioMedidaIndicador($params)
  {
    try{
      $arraycriteriosmedidaindicador=$params->arraycriteriosmedidaindicador;
      foreach ($arraycriteriosmedidaindicador as $relacion) {
        $objelemento = Doctrine::getTable('DatIndicadorcriteriomedida')->find(
          $relacion->idindicadorcriteriomedida
        );
        if (isset($objelemento->idindicadorcriteriomedida)) {
          $objelemento->delete();
        }
      }
      return 1;
    }catch (Exception $e){
      return 0;
    }
  }

 } 
?>

