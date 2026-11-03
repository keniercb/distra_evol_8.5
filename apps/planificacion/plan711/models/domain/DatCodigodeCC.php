<?php

class DatCodigodeCC extends BaseDatCodigodeCC {
    
    public function setUp() {
        parent::setUp();
    }
        
    public function listarCodigo($parametros) {
        $conn = Doctrine_Manager::connection();
        $addWhere = "and true";
        if ($parametros['idejercicio']) {
            $addWhere .= " AND dat_plan711.idplan711 = {$parametros['idejercicio']}";
        }
        if ($parametros ['identidad']) {
            $addWhere .= " AND dat_codigodecc.identidad = {$parametros ['identidad']}" ;
        }
        if ($parametros['idempimp']) {
            $addWhere .= " AND dat_codigodecc.iddatosempimp = {$parametros['idempimp']}";
        }
        if ($parametros['idcc']) {
            $addWhere .= " AND dat_codigodecc.iddatoscc = {$parametros['idcc']}";
        }
                
            $sql = "SELECT  
                        dat_codigodecc.idcodigodecc, 
                        dat_codigodecc.iddatoscc, 
                        dat_codigodecc.codigo, 
                        dat_codigodecc.identidad, 
                        dat_codigodecc.iddatosempimp
                      FROM 
                        mod_plan711.dat_codigodecc, 
                        mod_plan711.dat_plan711
                      WHERE 
                        dat_codigodecc.idplan711 = dat_plan711.idplan711 $addWhere";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function AdcionarCredito($parametros) {
        foreach ($parametros['credito'] as $value) {
            $obj = new DatCodigodeCC();
            $obj->idplan711 = $parametros['idplan'];
            $obj->identidad = $parametros['identidad'];
            $obj->iddatosempimp = $parametros['idempimp'];
            $obj->iddatoscc = $value[1];
            $obj->codigo = $value[0];
            $obj->save();
        }
        return 1;
    }
    
    public function ModificarCredito($parametros) {
        $conn = Doctrine_Manager::connection();
        foreach ($parametros['credito'] as $value) {
            $sqlupd = "UPDATE mod_plan711.dat_codigodecc
                        SET codigo='{$value['dtn']}'
                      WHERE idplan711= {$parametros['idplan']} and identidad= {$parametros['identidad']} and 
                             iddatosempimp= {$parametros['idempimp']} and iddatoscc = {$value['idcc']} and codigo = '{$value['dtv']}'";
            $conn->execute($sqlupd);
        }
            //Doctrine_Manager::getInstance()->getCurrentConnection()->commit();
        return 1; //;$this->AdcionarCredito($parametros);
    }
}
