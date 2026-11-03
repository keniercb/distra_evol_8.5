<?php 
class DatCriterioevaluacionobj extends BaseDatCriterioevaluacionobj
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasMany('DatFormulaobjetivo', array('local'=>'idcriterioevaluacionobj','foreign'=>'idcriterioevaluacionobj')); 

    }

  public function cargarCriterioEvaluacionObjetivo($params)
  {
    $cadenaSELECT
      = " SELECT 
                 nom.idnomenclador  as idresultado_evaluativo,
                 nom.dennomenclador as resultado_evaluativo, ce.idcriterioevaluacionobj ";
    $cadenaFROM
      = " FROM 
                mod_objetivos.dat_criterioevaluacionobj AS ce ";
    $cadenaJOIN
      = "  INNER JOIN mod_objetivos.nom_nomenclador AS nom
           ON ce.idnomencladorcriterioeval = nom.idnomenclador ";
    $cadenaWHERE
      = " where ce.idobjetivo = {$params->idobjetivo}";

    $cadenaOrdenar=" order by ce.idcriterioevaluacionobj ";

    $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaJOIN . $cadenaWHERE . $cadenaOrdenar;

//    print_r($cadenaQUERY);die;
    $conn = Doctrine_Manager::connection();
    $result = $conn->execute($cadenaQUERY)->fetchAll(
      PDO::FETCH_ASSOC
    );
    return $result;
  }

  public function obtenerinformacionCriterioEvaluacionObjetivo($params)
  {
    $cadenaSELECT
      = " SELECT i.idindicadorobjcrit, i.denominacion as indicador,
                 f.signo, f.operador, ce.idnomencladorcriterioeval,
                 nom.dennomenclador as resultado_evaluativo, f.idformulaobjetivo,
                 ce.idcriterioevaluacionobj, f.orden, f.idnomencladorcondicion as idvalor, v.dennomenclador as valor ";
    $cadenaFROM
      = " FROM 
              mod_objetivos.dat_criterioevaluacionobj ce ";
    $cadenaJOIN
      = "  INNER JOIN mod_objetivos.dat_formulaobjetivo AS f
           ON ce.idcriterioevaluacionobj = f.idcriterioevaluacionobj 
           
           LEFT JOIN mod_objetivos.nom_nomenclador AS nom
           ON ce.idnomencladorcriterioeval = nom.idnomenclador
           
           INNER JOIN mod_objetivos.dat_indicadorobjcrit AS i
           ON f.idindicadorobjcrit = i.idindicadorobjcrit 
           
           INNER JOIN mod_objetivos.nom_nomenclador AS v
           ON v.idnomenclador = f.idnomencladorcondicion 
           
           ";
    $cadenaWHERE
      = " WHERE ce.idcriterioevaluacionobj = {$params->idcriterioevaluacionobj}";

    $cadenaOrdenar=" order by f.orden ";

    $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaJOIN . $cadenaWHERE . $cadenaOrdenar;

//    print_r($cadenaQUERY);die;
    $conn = Doctrine_Manager::connection();
    $result = $conn->execute($cadenaQUERY)->fetchAll(
      PDO::FETCH_ASSOC
    );
    return $result;
  }
 
 
}//fin clase 
?>


