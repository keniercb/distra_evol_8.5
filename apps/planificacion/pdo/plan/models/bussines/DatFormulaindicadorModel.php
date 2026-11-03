<?php 
class DatFormulaindicadorModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatFormulaindicador $DatFormulaindicador) 
    { 
            $DatFormulaindicador->save();
    } 
 
   public function Actualizar(DatFormulaindicador $DatFormulaindicador) 
    { 
            $DatFormulaindicador->save();
    } 
 
   public function Eliminar($DatFormulaindicador) 
    { 
            $DatFormulaindicador->delete();
    }

  public function adicionarEvaluacionCriterioMedida($params)
  {
    try{
      $formula=new DatFormulaindicador();
      $formula->idautor=$params->idautor;
      $formula->denominacion=$params->denominacion;
      $formula->descripcion=$params->descripcion;
      $formula->idobjetivo=$params->idobjetivo;
      $formula->save();
      return 1;
    }catch (Exception $e){
      return 0;
    }
  }
 } 
?>

