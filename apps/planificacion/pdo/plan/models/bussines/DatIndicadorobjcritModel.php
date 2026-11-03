<?php 
class DatIndicadorobjcritModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatIndicadorobjcrit $DatIndicadorobjcrit) 
    { 
            $DatIndicadorobjcrit->save();
    } 
 
   public function Actualizar(DatIndicadorobjcrit $DatIndicadorobjcrit) 
    { 
            $DatIndicadorobjcrit->save();
    } 
 
   public function Eliminar($DatIndicadorobjcrit) 
    { 
            $DatIndicadorobjcrit->delete();
    }

  public function cargarindicadores($params)
  {
    $indicador=new DatIndicadorobjcrit();
    $listado_indicadores = $indicador->cargarindicadores($params);
//    print_r($listado_indicadores);die;
//    $resultado=array();
//    foreach ($listado_indicadores as $key => $objetivo){
//      $resultado[$key]['idindicadorobjcrit']=$listado_indicadores['']
//    }

    return $listado_indicadores;
  }

  public function obtenerinformacionIndicador($params)
  {
    $indicador=new DatIndicadorobjcrit();
    $listado_indicadores = $indicador->obtenerinformacionIndicador($params);
    return $listado_indicadores[0];
  }

    public function adicionarindicador($params)
    {
      try{
        $indicador=new DatIndicadorobjcrit();
        $indicador->idautor=$params->idautor;
        $indicador->denominacion=$params->denominacion;
        $indicador->descripcion=$params->descripcion;
        $indicador->idobjetivo=$params->idobjetivo;
        $indicador->save();
        return 1;
      }catch (Exception $e){
        return 0;
      }
    }

    public function modificarindicador($params)
    {
      try{
        $indicador = Doctrine::getTable('DatIndicadorobjcrit')->find(
          $params->idindicadorobjcrit
        );
        $indicador->idautor=$params->idautor;
        $indicador->denominacion=$params->denominacion;
        $indicador->descripcion=$params->descripcion;
        $indicador->idobjetivo=$params->idobjetivo;
        $indicador->save();
        return 1;
      }catch (Exception $e){
        return 0;
      }
    }

    public function eliminarIndicador($params)
    {
      try{
        $arrayidelementos=$params->arrayindicadores;
        foreach ($arrayidelementos as $indicador) {
          $objelemento = Doctrine::getTable('DatIndicadorobjcrit')->find(
            $indicador->idindicadorobjcrit
          );
          if (isset($objelemento->idindicadorobjcrit)) {
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

