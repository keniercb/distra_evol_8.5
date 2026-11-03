<?php 
class DatIndicadorobjcrit extends BaseDatIndicadorobjcrit
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasMany('DatIndicadorcriteriomedida', array('local'=>'idindicadorobjcrit','foreign'=>'idindicadorobjcrit')); 
         $this->hasMany('DatCriterioevaluacionind', array('local'=>'idindicadorobjcrit','foreign'=>'idindicadorobjcrit')); 
         $this->hasMany('DatFormulaobjetivo', array('local'=>'idindicadorobjcrit','foreign'=>'idindicadorobjcrit')); 

    }


  public function cargarindicadores($params)
  {
    $cadenaSELECT
              = " SELECT idindicadorobjcrit, denominacion, idautor, idnomenclador,
                   /*Para que cuando el usuario no tenga persona muestre usuario*/
                    CASE WHEN p.idpersona is NULL THEN u.nombreusuario
                    ELSE p.nombre || ' ' || p.papel || ' ' || p.sapel END as nombreautor,
                               idobjetivo, descripcion ";
    $cadenaFROM
              = " FROM 
                       mod_objetivos.dat_indicadorobjcrit AS i ";
    $cadenaJOIN
              = "  INNER JOIN mod_seguridad.seg_usuario u
                   ON u.idusuario = i.idautor

                   LEFT JOIN mod_persona.dat_persona p
                   ON u.idpersona = p.idpersona ";
    $cadenaWHERE
              = " WHERE i.idautor = {$params->idautor} AND i.idobjetivo={$params->idobjetivo}";

    $cadenaOrdenar=" order by i.idindicadorobjcrit ";

    $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaJOIN . $cadenaWHERE . $cadenaOrdenar;

//    print_r($cadenaQUERY);die;
    $conn = Doctrine_Manager::connection();
    $result = $conn->execute($cadenaQUERY)->fetchAll(
      PDO::FETCH_ASSOC
    );
    return $result;
  }

  public function obtenerinformacionIndicador($params)
  {
    $cadenaSELECT
      = " SELECT idindicadorobjcrit, denominacion, idautor, idnomenclador,
                               idobjetivo, descripcion ";
    $cadenaFROM
      = " FROM 
                       mod_objetivos.dat_indicadorobjcrit AS i";
    $cadenaJOIN
      = "  ";
    $cadenaWHERE
      = " WHERE i.idautor = {$params->idautor} AND i.idindicadorobjcrit={$params->idindicadorobjcrit}";

    $cadenaQUERY = $cadenaSELECT . $cadenaFROM . $cadenaJOIN . $cadenaWHERE;

//    print_r($cadenaQUERY);die;
    $conn = Doctrine_Manager::connection();
    $result = $conn->execute($cadenaQUERY)->fetchAll(
      PDO::FETCH_ASSOC
    );
    return $result;
  }
 
 
}//fin clase 
?>


