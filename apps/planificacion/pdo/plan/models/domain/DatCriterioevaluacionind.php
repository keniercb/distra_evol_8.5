<?php 
class DatCriterioevaluacionind extends BaseDatCriterioevaluacionind
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasOne('DatIndicadorcriteriomedida', array('local'=>'idindicadorobjcrit','foreign'=>'idindicadorobjcrit')); 
         $this->hasOne('DatIndicadorobjcrit', array('local'=>'idindicadorobjcrit','foreign'=>'idindicadorobjcrit')); 
         $this->hasMany('DatFormulaindicador', array('local'=>'idcriterioevaluacionind','foreign'=>'idcriterioevaluacionind')); 

    }


  public function cargarcriterioevalcriteriomedida($params)
  {
    $cadenaSELECT
      = " SELECT 
                 nom.idnomenclador  as idresultado_evaluativo,
                 nom.dennomenclador as resultado_evaluativo, ce.idcriterioevaluacionind ";
    $cadenaFROM
      = " FROM 
                mod_objetivos.dat_criterioevaluacionind AS ce ";
    $cadenaJOIN
      = "  INNER JOIN mod_objetivos.nom_nomenclador AS nom
           ON ce.idnomencladorcriterioeval = nom.idnomenclador ";
    $cadenaWHERE
      = " where ce.idindicadorobjcrit = {$params->idindicadorobjcrit}";

    $cadenaOrdenar=" order by ce.idcriterioevaluacionind ";

    $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaJOIN . $cadenaWHERE . $cadenaOrdenar;

//    print_r($cadenaQUERY);die;
    $conn = Doctrine_Manager::connection();
    $result = $conn->execute($cadenaQUERY)->fetchAll(
      PDO::FETCH_ASSOC
    );
    return $result;
  }

  public function obtenerinformacionCriterioEvaluacionIndicador($params)
  {
    $cadenaSELECT
      = " SELECT ce.idcriterioevaluacionind, ce.idindicadorobjcrit, ce.idnomencladorcriterioeval,
                 f.signo, f.valor, f.operador, f.orden, f.idcriteriomedida, f.idformulaindicador,
                 nom.dennomenclador as resultado_evaluativo, cm.dencriterio as criteriomedida ";
    $cadenaFROM
      = " FROM 
              mod_objetivos.dat_criterioevaluacionind ce ";
    $cadenaJOIN
      = "  INNER JOIN mod_objetivos.dat_formulaindicador AS f
           ON ce.idcriterioevaluacionind = f.idcriterioevaluacionind 
           
           LEFT JOIN mod_objetivos.nom_nomenclador AS nom
           ON ce.idnomencladorcriterioeval = nom.idnomenclador
           
           LEFT JOIN mod_objetivos.dat_criteriomedida AS cm
           ON f.idcriteriomedida = cm.idcriteriomedida
           
           ";
    $cadenaWHERE
      = " WHERE ce.idcriterioevaluacionind = {$params->idcriterioevaluacionind}";

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


