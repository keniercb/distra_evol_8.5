<?php 
class DatCriterioevaluacionindModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatCriterioevaluacionind $DatCriterioevaluacionind) 
    { 
            $DatCriterioevaluacionind->save();
    } 
 
   public function Actualizar(DatCriterioevaluacionind $DatCriterioevaluacionind) 
    { 
            $DatCriterioevaluacionind->save();
    } 
 
   public function Eliminar($DatCriterioevaluacionind) 
    { 
            $DatCriterioevaluacionind->delete();
    }

  public function adicionarEvaluacionCriterioMedida($params)
  {
    try{
      $criterio=new DatCriterioevaluacionind();
      $criterio->idindicadorobjcrit=$params->idindicadorobjcrit;
      $criterio->idnomencladorcriterioeval=$params->idnomencladorcriterioeval;
      $criterio->save();

      $arrayidelementos=$params->arrayformulas;
      $orden=1;

      foreach ($arrayidelementos as $item) {
        $formula=new DatFormulaindicador();
        $formula->idcriterioevaluacionind=$criterio->idcriterioevaluacionind;
        $formula->orden=$orden;
        $formula->valor=$item->valor;
        $formula->operador=$item->operador;
        $formula->signo=$item->signo;
        $formula->idcriteriomedida=$item->idcriterioevalindicador;
        $formula->save();
        $orden++;
      }
      return 1;
    }catch (Exception $e){
      return 0;
    }
  }

  public function modificarEvaluacionCriterioMedida($params)
  {
    try{
      $criterio = Doctrine::getTable('DatCriterioevaluacionind')->find(
        $params->idcriterioevaluacionind
      );
      $criterio->idindicadorobjcrit=$params->idindicadorobjcrit;
      $criterio->idnomencladorcriterioeval=$params->idnomencladorcriterioeval;
      $criterio->save();

      $formulaseliminar=$params->formulaseliminar;
      foreach ($formulaseliminar as $form) {
          $formula_eliminar=Doctrine::getTable('DatFormulaindicador')->find(
            $form->idformulaindicador
          );
        $formula_eliminar->delete();
      }

      $arrayidelementos=$params->arrayformulas;
      $orden=1;
      foreach ($arrayidelementos as $item) {
        if($item->idformulaindicador!=''){
          $formula=Doctrine::getTable('DatFormulaindicador')->find(
            $item->idformulaindicador
          );
        }else{
          $formula=new DatFormulaindicador();
        }

        $formula->idcriterioevaluacionind=$criterio->idcriterioevaluacionind;
        $formula->valor=$item->valor;
        $formula->orden=$orden;
        $formula->operador=$item->operador;
        $formula->signo=$item->signo;
        $formula->idcriteriomedida=$item->idcriterioevalindicador;
        $formula->save();
        $orden++;

      }

      return 1;
    }catch (Exception $e){
      return 0;
    }
  }

  public function cargarcriterioevalcriteriomedida($params)
  {
    $indicador=new DatCriterioevaluacionind();
    $listado_indicadores = $indicador->cargarcriterioevalcriteriomedida($params);
    return $listado_indicadores;
  }

  public function eliminarCriterioEvaluacionIndicador($params)
  {
    try{
      $arrayidelementos=$params->arraycriterios;
      foreach ($arrayidelementos as $indicador) {
        $objelemento = Doctrine::getTable('DatCriterioevaluacionind')->find(
          $indicador->idcriterioevaluacionind
        );
        if (isset($objelemento->idcriterioevaluacionind)) {
          $objelemento->delete();
        }
      }
      return 1;
    }catch (Exception $e){
      return 0;
    }
  }

  public function obtenerinformacionCriterioEvaluacionIndicador($params)
  {
    $criterio=new DatCriterioevaluacionind();
    $listado_indicadores = $criterio->obtenerinformacionCriterioEvaluacionIndicador($params);
    return $listado_indicadores;
  }



 } 
?>

