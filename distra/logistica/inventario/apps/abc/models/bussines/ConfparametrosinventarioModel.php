<?php


class ConfparametrosinventarioModel extends BaseModel
{

    private $conexion = null;

    public function __construct($esExterno = false)
    {
        parent::__construct($esExterno);
        $mg = Doctrine_Manager::getInstance();
        $this->conexion = $mg->getCurrentConnection();
        $this->conexion->execute("SET enable_indexscan TO TRUE;");
        $this->conexion->execute("SET enable_seqscan TO FALSE;");
    }

    public function valoresSistema(){
        $a = array();
        $a[] = array('id'=> 0, 'valor'=>'Período a analizar');
        $a[] = array('id'=> 1, 'valor'=>'Unidades vendidas');
        $a[] = array('id'=> 2, 'valor'=>'Días cero');
        $a[] = array('id'=> 3, 'valor'=>'Costo x unidad');
        $a[] = array('id'=> 31, 'valor'=>'Existencia media del periodo');
        return $a;
    }

    public function obtenerCentrosLogisticos($idestructura)
    {
        $iddominio = ZendExt_GlobalConcept::getInstance()->Perfil->iddominio;
        $r = $this->conexion->fetchAll("select parent_path from mod_estructuracomp.nom_filaestruc where idfila = ?", array($idestructura));

        if (count($r) > 0) {
            $parent_path = $r[0]['parent_path'];
            $sql = "select nfe.idfila as idcentrologistico, deop.denominacion, parent_path, deop.codigo from mod_estructuracomp.nom_filaestruc nfe 
                    inner join mod_estructuracomp.dat_estructuraop deop ON (deop.idestructuraop = nfe.idfila and deop.idproyecto = 0 and deop.idorgano = -4)
                    where (nfe.parent_path operator (public.<@) ?) AND nfe.dominiofila[?]='1' AND nfe.fechafin is null and nfe.idconcepto = 8 ";

            $resultado = $this->conexion->fetchAll($sql, array($parent_path, $iddominio));

            return $resultado;
        } else {
            return array();
        }

    }

    public function obtenerConfiguracionParametrosInventario($idestructura)
    {
        $sql = "SELECT c.idconfparametrosinventario, c.idparametrosinventario, c.idformulaovalorsistema, 
               tn.denominacion as tipoparametrosinventario, n.abreviatura, n.denominacion, c.formacalculo,
               (CASE WHEN c.formacalculo = 1 THEN c.formula WHEN c.formacalculo = 2 THEN valorusuario::varchar ELSE c.idformulaovalorsistema::varchar END) as formulavalorsistema,
               c.orden, c.porcentual, c.lugaresdecimales, tn.idtipoparametrosinventario, c.formulacalcular, c.valorusuario, c.consolida, c.parapresupuesto, c.tipoconsolidacion
          FROM mod_logabc.conf_parametrosinventario c
          INNER JOIN mod_logabc.nom_parametrosinventario n ON n.idparametrosinventario = c.idparametrosinventario
          INNER JOIN mod_logabc.nom_tipoparametrosinventario tn ON tn.idtipoparametrosinventario = n.idtipoparametrosinventario
          WHERE c.idestructura = ? ORDER BY c.orden;";
        $r = $this->conexion->fetchAll($sql, array($idestructura));
        $arrVS = $this->valoresSistema();
        foreach($arrVS as $vs){
            foreach ($r as &$v){
                if($v['formacalculo'] == 3 && $vs['id'] == $v['idformulaovalorsistema']){
                    $v['formulavalorsistema'] = $vs['valor'];
                    break;
                }
            }
        }
        return $r;

    }

    public function obtenerDepositosParametrizacion($idueb)
    {
        $sql = "SELECT cdp.iddeposito, deop.codigo, deop.denominacion as deposito 
        FROM mod_logabc.conf_depositosparametrizacion cdp
        INNER JOIN mod_estructuracomp.dat_estructuraop deop ON (deop.idestructuraop = cdp.iddeposito)
        WHERE cdp.idueb = ?  ORDER BY deop.codigo;";
        return $this->conexion->fetchAll($sql, array($idueb));

    }

}
