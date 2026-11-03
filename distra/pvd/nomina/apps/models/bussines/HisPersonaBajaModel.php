<?php

class HisPersonaBajaModel extends ZendExt_Model
{
    public function HisPersonaBajaModel ()
    {
        parent::ZendExt_Model();
    }

    public function adicionar ($tiempoacumuladoinicial, $importeacumuladoinicial, $idpersona, $identidad, $idplantillanominal, $idcodigocontable, $operaciones)
    {
        //Save in HisPersonaBaja
        $objHisP = new HisPersonaBaja();
        $objHisP->tiempoacumuladoinicial  = $tiempoacumuladoinicial;
        $objHisP->importeacumuladoinicial = $importeacumuladoinicial;
        $objHisP->idpersona               = $idpersona;
        $objHisP->identidad               = $identidad;
        $objHisP->idplantillanominal      = $idplantillanominal;
        $objHisP->idcodigocontable        = $idcodigocontable;
        $objHisP->save();

        //Organizando las operaciones
        foreach($operaciones as &$op) {
            list($mes, $anno) = explode("-",  $op['periodo']);
            $op['orden'] = $anno.$mes.$op['idnomina'].$op['tipooperacion'];
        }
        $operaciones = $this->orderMultiDimensionalArray($operaciones, 'orden');
        //print_r($operaciones);die;

        foreach($operaciones as $op) {
            //Save in HisVacacionesPersonaBaja
            $objHisV = new HisVacacionesPersonaBaja();
            $objHisV->idpersonabaja    = $objHisP->idpersonabaja;
            $objHisV->idnomina         = $op['idnomina'];
            $objHisV->tipooperacion    = $op['tipooperacion'];
            $objHisV->fechaoperacion   = $op['fechaoperacion'];
            $objHisV->tiempoacumulado  = $op['tiempoacumulado'];
            $objHisV->importeacumulado = $op['importeacumulado'];
            $objHisV->saldoentiempo    = $op['saldoentiempo'];
            $objHisV->saldoenimporte   = $op['saldoenimporte'];
            $objHisV->ajusteimporte    = $op['ajusteimporte'];
            $objHisV->ajustetiempo     = $op['ajustetiempo'];
            $objHisV->tipoajuste       = $op['tipoajuste'];
            $objHisV->observaciones    = $op['observaciones'].'';
            $objHisV->periodo          = $op['periodo'].'';
            $objHisV->save();
        }
        return true;
    }

    //Listado de saldos acumulados de vacaciones
    public function plantillaPersonaDadoId ($identidad, $idpersona)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "    select cpn.idplantillanominal 
                    from mod_nomina.conf_plantillanominal cpn
                    inner join mod_nomina.conf_plantillanominalcargo cpnca on(cpnca.idplantillanominal = cpn.idplantillanominal) 
                    inner join mod_nomina.dat_cargosocupados dco on(dco.idcargo = cpnca.idcargo)
		    where cpn.identidad = ? and dco.idpersona = ? ;";
        return $conn->fetchAll($sql, array($identidad, $idpersona));
    }

    public function orderMultiDimensionalArray ($toOrderArray, $field, $inverse = false) {
        $position = array();
        $newRow = array();
        foreach ($toOrderArray as $key => $row) {
            $position[$key]  = $row[$field];
            $newRow[$key] = $row;
        }
        if ($inverse) {
            arsort($position);
        } else {
            asort($position);
        }
        $returnArray = array();
        foreach ($position as $key => $pos) {
            $returnArray[] = $newRow[$key];
        }
        return $returnArray;
    }
}
