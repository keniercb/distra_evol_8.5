<?php 
class DatCriterioevaluacionobjModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatCriterioevaluacionobj $DatCriterioevaluacionobj) 
    { 
            $DatCriterioevaluacionobj->save();
    } 
 
   public function Actualizar(DatCriterioevaluacionobj $DatCriterioevaluacionobj) 
    { 
            $DatCriterioevaluacionobj->save();
    } 
 
   public function Eliminar($DatCriterioevaluacionobj) 
    { 
            $DatCriterioevaluacionobj->delete();
    }

  public function adicionarEvaluacionObjetivo($params)
  {
    try{
      $criterio=new DatCriterioevaluacionobj();
      $criterio->idobjetivo=$params->idobjetivo;
      $criterio->idnomencladorcriterioeval=$params->idnomencladorcriterioeval;
      $criterio->save();

      $arrayidelementos=$params->arrayformulas;
      $orden=1;

      foreach ($arrayidelementos as $item) {
        $formula=new DatFormulaobjetivo();
        $formula->idcriterioevaluacionobj=$criterio->idcriterioevaluacionobj;
        $formula->orden=$orden;
        $formula->idnomencladorcondicion=$item->idvalor;
        $formula->operador=$item->operador;
        $formula->signo=$item->signo;
        $formula->idindicadorobjcrit=$item->idindicadorobjcrit;
        $formula->save();
        $orden++;
      }
      return 1;
    }catch (Exception $e){
      return 0;
    }
  }


  public function modificarEvaluacionObjetivo($params)
  {
    try{
      $criterio = Doctrine::getTable('DatCriterioevaluacionobj')->find(
        $params->idcriterioevaluacionobj
      );
      $criterio->idnomencladorcriterioeval=$params->idnomencladorcriterioeval;
      $criterio->save();

      $formulaseliminar=$params->formulaseliminar;
      foreach ($formulaseliminar as $form) {
        $formula_eliminar=Doctrine::getTable('DatFormulaobjetivo')->find(
          $form->idformulaobjetivo
        );
        $formula_eliminar->delete();
      }

      $arrayidelementos=$params->arrayformulas;
      $orden=1;
      foreach ($arrayidelementos as $item) {
        if($item->idformulaobjetivo!=''){
          $formula=Doctrine::getTable('DatFormulaobjetivo')->find(
            $item->idformulaobjetivo
          );
        }else{
          $formula=new DatFormulaobjetivo();
        }

        $formula->idcriterioevaluacionobj=$criterio->idcriterioevaluacionobj;
        $formula->idnomencladorcondicion=$item->idvalor;
        $formula->orden=$orden;
        $formula->operador=$item->operador;
        $formula->signo=$item->signo;
        $formula->idindicadorobjcrit=$item->idindicadorobjcrit;
        $formula->save();
        $orden++;

      }

      return 1;
    }catch (Exception $e){
      return 0;
    }
  }


  public function cargarCriterioEvaluacionObjetivo($params)
  {
    $indicador=new DatCriterioevaluacionobj();
    $listado_indicadores = $indicador->cargarCriterioEvaluacionObjetivo($params);
    return $listado_indicadores;
  }

  public function eliminarCriterioEvaluacionObjetivo($params)
  {
    try{
      $arrayidelementos=$params->arraycriterios;
      foreach ($arrayidelementos as $indicador) {
        $objelemento = Doctrine::getTable('DatCriterioevaluacionobj')->find(
          $indicador->idcriterioevaluacionobj
        );
        if (isset($objelemento->idcriterioevaluacionobj)) {
          $objelemento->delete();
        }
      }
      return 1;
    }catch (Exception $e){
      return 0;
    }
  }

  public function obtenerinformacionCriterioEvaluacionObjetivo($params)
  {
    $criterio=new DatCriterioevaluacionobj();
    $listado_indicadores = $criterio->obtenerinformacionCriterioEvaluacionObjetivo($params);
    return $listado_indicadores;
  }

 } 
?>

