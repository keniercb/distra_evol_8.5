<?php
class DatEvalplanillasevaluativasModel extends ZendExt_Model
{
    public function DatEvalplanillasevaluativasModel()
    {
        parent::ZendExt_Model();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatEvalplanillasevaluativas $DatEvalplanillasevaluativas)
    {
        $DatEvalplanillasevaluativas->save();
    }

    public function Actualizar(DatEvalplanillasevaluativas $DatEvalplanillasevaluativas)
    {
        $DatEvalplanillasevaluativas->save();
    }

    public function Eliminar($DatEvalplanillasevaluativas)
    {
        $DatEvalplanillasevaluativas->delete();
    }

    public function delete($idplanilla)
    {
        try {
            $r->cantRowAfected = Doctrine_Query::create()
                ->delete()
                ->from('DatEvalplanillasevaluativas')
                ->where('idplanilla = ?', $idplanilla)
                ->execute();
            $r->success = true;

            return $r;
        }catch (Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
               return 4;
            } else {
                return (json_encode($e->getMessage()));
            }
        }
    }

    public function existeCodPlanilla($cod)
    {
        $existe = DatEvalplanillasevaluativas :: ExisteCodPlanilla($cod);

        if ($existe) {
            return true;
        }

        return false;
    }

    public function planillaEnUso($idplanilla)
    {
        $defProceso = $this->pIntegrator->procesoevaluativo->BuscarPlanillaSiExiste($idplanilla);
        $modelo = $this->pIntegrator->evaluaciones->CantidadModelosPorPlanilla($idplanilla);
        $result = false;
        if ($defProceso || $modelo > 0) {
            $result = true;
        }
        $existe = DatEvalplanillasevaluativas::planillaEnUso($idplanilla);
        if ($existe) {
            $result = true;
        }

        return $result;
    }

    public function getArbolIndicadores($idplanilla, $idnodopadre)
    {
        $indicadores = array();
        $objIndicadorPlanilla = new DatEvalindicadoresplanilla();
        $objIndicadorTexto = new NomEvalindicadortexto();
        $objIndImg = new NomEvalindicadorimagen();
        if (!empty($idplanilla) && $idplanilla != -1) {
            $indicadores = $objIndicadorPlanilla->GetIndicadoresPorPlanilla($idplanilla, $idnodopadre);
            $arrIndTexto = array();
            $arrIndImagen = array();
            foreach ($indicadores as $indicador) {
                if ($indicador['tipo'] == true) {
                    $arrIndTexto[] = $indicador['idindicador'];
                } else {
                    $arrIndImagen[] = $indicador['idindicador'];
                }
            }
            if (count($arrIndTexto) > 0) {
                $arrIndTexto = $objIndicadorTexto->getArrIndicadoresPorId($arrIndTexto);
            }
            if (count($arrIndImagen) > 0) {
                $arrIndImagen = $objIndImg->getArrIndicadoresPorId($arrIndImagen);
            }
            $result = array();
            if (count($indicadores) > 0) {
                foreach ($indicadores as $key => $indicador) {
                    foreach ($arrIndTexto as $indTexto) {
                        if ($indicador['idindicador'] == $indTexto['idindicadortexto']) {
                            $result[] = array_merge($indicador, $indTexto);
                        }
                    }
                    foreach ($arrIndImagen as $indImg) {
                        if ($indicador['idindicador'] == $indImg['idindicadorimagen']) {
                            $result[] = array_merge($indicador, $indImg);
                        }
                    }
                }
            }
            $nodos = array();
            if (count($result) > 0) {
                foreach ($result as $v) {
                    $hoja = false;
                    if ($v['calculado'] == true) {
                        $hoja = true;
                    }
                    $nodos[] = array(
                        'id'          => $v['idindicadorplanilla'],
                        'idindicador' => $v['idindicador']
                    ,
                        'text'        => $v['denom'],
                        'abreviatura' => $v['abreviatura'],
                        'idpadre'     => $v['idpadre']
                    ,
                        'qtip'        => $v['descripcion'],
                        'tipo'        => $v['tipo'],
                        'calculado'   => $v['calculado'],
                        'ayuda'       => $v['ayuda'],
                        'leaf'        => $hoja
                    );
                }
            }

            return $nodos;
        }
    }


    /**
     * Duplica la planilla dada con los parametros especificados
     *
     * @param $idplanilla
     * @param $codigo
     * @param $denominacion
     * @param $descripcion
     * @param $fechaInicio
     * @param $fechaFin
     * @param $iddominio
     */
    public function duplicarPlanillaAction(
        $idplanilla, $codigo, $denominacion, $descripcion, $fechaInicio, $fechaFin, $iddominio
    ) {

        //Crea la planilla evaluativa
        $objPlanilla = new DatEvalplanillasevaluativas();
        $objPlanilla->codigo = $codigo;
        $objPlanilla->denom = $denominacion;
        $objPlanilla->descripcion = $descripcion;
        $objPlanilla->fechainicio = $fechaInicio;
        $objPlanilla->fechafin = $fechaFin;
        $objPlanilla->iddominioevaluativo = $iddominio;
        $objPlanilla->idestado = 0;
        $objPlanilla->save();

       $idplanillanueva = $objPlanilla->idplanilla;
        //Busca todos los hijos

        $sqlidpadreviejo = "SELECT idpadre
				FROM mod_evaluaciones.dat_evalindicadoresplanilla as p
                WHERE p.idplanilla = $idplanilla ";
        $resultpadreviejo = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlidpadreviejo);
        $arraypadre = array();
        $count = 0;
        foreach($resultpadreviejo as $r){
            $idpadre = $r['idpadre'];
            $sqlabreviatura = "SELECT abreviatura
				FROM mod_evaluaciones.dat_evalindicadoresplanilla as p
                WHERE p.idindicadorplanilla =  $idpadre";
            $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlabreviatura);
            $arraypadre[$count]['idpadre'] = $idpadre;
            $arraypadre[$count]['abreviatura'] = $result[0]['abreviatura'];
            $count++;
        }

        $objIndPlan = new DatEvalindicadoresplanilla();
        $listInd = $objIndPlan->BuscarIdPlanilla($idplanilla);
        $count = 0;
        $array = array();
       foreach($listInd as $r){
           $abreviatura = "'".$r['abreviatura']."'";
           $calculado = $r['calculado'];
           $idpadre = $r['idpadre'];
           $idindicador = $r['idindicador'];
           $eshoja = $r['eshoja'];
           if($r['idpadre'] == $r['idindicadorplanilla']){
               $array[$count]['valor'] = 1;
           }
           else
           {
               $array[$count]['valor'] = 2;
           }

           $sql_insert = "INSERT INTO mod_evaluaciones.dat_evalindicadoresplanilla(
                                      idindicador, abreviatura, idpadre, idplanilla, eshoja, calculado, tipo)
                          VALUES ($idindicador, $abreviatura, $idpadre, $idplanillanueva, $eshoja, $calculado, TRUE);";
           $result_insert = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql_insert);

           $count++;
       }
        $sqltodo = "SELECT *
				FROM mod_evaluaciones.dat_evalindicadoresplanilla as p
                WHERE p.idplanilla = $idplanillanueva ";
        $resulttodo = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqltodo);
        $arrayultimo = array();
        $countultimo =0;
        foreach($resulttodo as $r){
            foreach($arraypadre as $d){
              if($r['idpadre']==$d['idpadre']){
                  $idpadrenuevo = $r['idpadre'];
                  $abreviatura ="'".$d['abreviatura']."'" ;

                  $sqlselect = "SELECT p.idindicadorplanilla
				FROM mod_evaluaciones.dat_evalindicadoresplanilla as p
                WHERE p.abreviatura = $abreviatura AND p.idplanilla = $idplanillanueva AND p.idpadre = $idpadrenuevo";
                $resultselect = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlselect);

                  $arrayultimo[$countultimo]['idpadre'] = $resultselect[0]['idindicadorplanilla'];
                  $arrayultimo[$countultimo]['abreviatura'] = $abreviatura;

                  $countultimo++;

              }
            }
        }
        foreach($arrayultimo as $u){
            $idpadre = $u['idpadre'];
            $abreviatura = $u['abreviatura'];
            $sqlupdate = "UPDATE mod_evaluaciones.dat_evalindicadoresplanilla SET idpadre = $idpadre
                  WHERE mod_evaluaciones.dat_evalindicadoresplanilla.idplanilla = $idplanillanueva and mod_evaluaciones.dat_evalindicadoresplanilla.abreviatura = $abreviatura";
            $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlupdate);
        }

        $arrayevaluar = array();
        $eval = 0;
        $sqlindicadorviejo = "SELECT idindicadorplanilla,abreviatura
				FROM mod_evaluaciones.dat_evalindicadoresplanilla as p
                WHERE p.idplanilla = $idplanilla ";
        $resultindicadorviejo = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlindicadorviejo);
        foreach($resultindicadorviejo as $r){
            $arrayevaluar[$eval]['idindicadorplanilla'] = $r['idindicadorplanilla'];
            $arrayevaluar[$eval]['abreviatura'] = $r['abreviatura'];
            $eval++;
        }

        $c= 0;
        foreach($arrayevaluar as $a){
            $abreviatura ="'".$a['abreviatura']."'"  ;
            $idindicador = $a['idindicadorplanilla'];
            $sqlindicadornuevo = "SELECT idindicadorplanilla
				FROM mod_evaluaciones.dat_evalindicadoresplanilla as p
                WHERE p.abreviatura = $abreviatura AND p.idindicadorplanilla<>$idindicador";
            $resultindicadornuevo = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlindicadornuevo);
            $arrayevaluar[$c]['idindicadornuevo'] = $resultindicadornuevo[0]['idindicadorplanilla'];
            $c++;
        }

        $sqlinsert = "SELECT idindicadorplanilla,idescala,complementotextual,version,idcentrodatos
				FROM mod_evaluaciones.dat_evalindicadoresevaluar as e
               ";
        $resultrrr = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlinsert);
        $d =0;
        foreach($resultrrr as $r){
            foreach($arrayevaluar as $e){
                if($r['idindicadorplanilla']== $e['indicadorplanilla']){
                    $arrayevaluar[$d]['idescala'] = $resultrrr[0]['idescala'];
                    $arrayevaluar[$d]['complementotextual'] = $resultrrr[0]['complementotextual'];
                    $arrayevaluar[$d]['version'] = $resultrrr[0]['version'];
                    $arrayevaluar[$d]['idcentrodatos'] = $resultrrr[0]['idcentrodatos'];
                    $d++;
                }
            }
        }


        /*foreach($arrayevaluar as $i){
            $idindicador = $i['idindicadornuevo'];
            $idescala = $i['idescala'];
            $complementotextual = $i['complementotextual'];
            $version = $r['version'];

            $sqlinsertar = "INSERT INTO mod_evaluaciones.dat_evalindicadoresevaluar(
                                      idindicadorplanilla, idescala, complementotextual, version)
                          VALUES ($idindicador, $idescala, $complementotextual, $version);";
            $resultinsertar = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlinsertar);
        }*/
        return true;

    }

    private function generateTreeStructure($array){

    }
}

