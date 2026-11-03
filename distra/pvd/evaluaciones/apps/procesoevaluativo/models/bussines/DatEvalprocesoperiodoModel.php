<?php

class DatEvalprocesoperiodoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function addRange($idpreprocesoevaluativo, $denominacion, $fechainicio, $fechafin, $fechainicioeval, $fechafineval, $estado, $idtipoestructura,$planilla)
    {
        try {
            $objDomain = new DatPeriodoproceso();

            if (!$objDomain->findByIdOrDenom($denominacion, $idpreprocesoevaluativo)) {
                $objDomain->idpreprocesoevaluativo = $idpreprocesoevaluativo;
                $objDomain->denominacion = $denominacion;
                $objDomain->fdesde = $fechainicio;
                $objDomain->fhasta = $fechafin;
                $objDomain->finicioeval = $fechainicioeval;
                $objDomain->ffineval = $fechafineval;
				$objDomain->estado = $estado;
				$objDomain->planilla = $planilla;
                $objDomain->save();

                $idperiodoproceso =  $objDomain->idperiodoproceso;
                $idestructura = $this->global->Estructura->idestructura;

                $arrEstPersona = ZendExt_IoC_Inter::getInstance()->maestro->getEstructurascontrolEvaluaciones($idtipoestructura, $idestructura);

                $functionarray = array();
                $function = "'{";
                $count = 0;
                $contador = 1;
                $countultimo = count($arrEstPersona);

                foreach($arrEstPersona as $r){
                     if($count==0){
                         $functionarray[$count] = $function.$r['idcontrolador'];
                     }
                     else if($contador==$countultimo){

                         $functionarray[$count] = $r['idcontrolador']."}'";

                     }
                    else{
                        $functionarray[$count] = $r['idcontrolador'];
                    }

                    $count++;
                    $contador++;
                }
                if(count($functionarray)==1){
                    $functionarray[0] = $functionarray[0]."}'";
                }

                $arrayfunction = implode(',',$functionarray);

                Doctrine_Manager::connection()->execute("Select mod_evaluaciones.f_personaevaluacion_insert($arrayfunction,$idperiodoproceso,$idtipoestructura)");

                return 1;
            } else {
                return 0;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }

    }

    public function changeRange($idperiodoproceso, $denominacion, $fechainicio, $fechafin, $fechainicioeval, $fechafineval,$planilla)
    {
        try {
            $objDomain = new DatPeriodoproceso();
            $result = $objDomain->changeRange($idperiodoproceso, $denominacion, $fechainicio, $fechafin, $fechainicioeval, $fechafineval,$planilla);
            return $result;
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    public function removeRange($idperiodoproceso)
    {
        try {

            $sqlidpersonaevaluacion = "SELECT  pe.idpersonaevaluacion
                                FROM mod_evaluaciones.dat_evalpersonaevaluacion pe
                                WHERE pe.idperiodoproceso = $idperiodoproceso";
            $arridpersonaevaluacion = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlidpersonaevaluacion);

            $objDomain = new DatPeriodoproceso();
            $DatEvalpersonaevaluacionModel = new DatEvalpersonaevaluacionModel();
            $delpreiodo = $DatEvalpersonaevaluacionModel->eliminarPorPeriodo($idperiodoproceso);

            /***************Para eliminar en datevalindicadoresevaluacion**********************************/
            foreach($arridpersonaevaluacion as $r){
                $idpersonaevaluacion = $r['idpersonaevaluacion'];
                $DatEvalindicadoresevaluacionModel = new DatEvalindicadoresevaluacionModel();
                $delpreiodoInd = $DatEvalindicadoresevaluacionModel->eliminarPorPeriodoInd($idpersonaevaluacion);
            }

            $del = $objDomain->removeRange($idperiodoproceso);
            return 1;
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    //**************adicionar persona a la estrcutura evaluativa**********//

    public function addPersonaEstructura($idperiodoproceso, $idplanilla, $estado, $idpersonaevaluador, $idpersonaevaluado)
    {
        try {
             if ($idperiodoproceso) {
                 $objDatpersonaevaluacion = new DatEvalpersonaevaluacion();				 

                $arrEstPersona = DatEvalpersonaevaluacion::getDatos($idperiodoproceso, $idpersonaevaluador);
				
                $arrEst = DatEvalpersonaevaluacion::getidEstructurapersona();

                 $idestructurapersona = $arrEst[count($arrEst)-1]['max'];
                $id = $idestructurapersona+1;
				
                 foreach ($arrEstPersona as $estPersona)
                {
                    $idmodelo = $estPersona['idmodelo'];
                    $idescala = $estPersona['idescala'];
                    $hareclamado = $estPersona['hareclamado'];
                }
				

                     $objDatpersonaevaluacion = new DatEvalpersonaevaluacion();

                     $objDatpersonaevaluacion->idestructurapersona = $id;
                     $objDatpersonaevaluacion->idperiodoproceso = $idperiodoproceso;
                     $objDatpersonaevaluacion->estado = 0;
                     $objDatpersonaevaluacion->idplanilla = $idplanilla;
                     $objDatpersonaevaluacion->idmodelo = $idmodelo;
                     $objDatpersonaevaluacion->idpersonaevaluador = $idpersonaevaluador;
                     $objDatpersonaevaluacion->idpersonaevaluado = $idpersonaevaluado;
                     $objDatpersonaevaluacion->idescala = $idescala;
                     $objDatpersonaevaluacion->nopersona = 0;
                     $objDatpersonaevaluacion->hareclamado = $hareclamado;

                 $objDatpersonaevaluacion->save();

                return 1;
            } else {
                return 0;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

}
