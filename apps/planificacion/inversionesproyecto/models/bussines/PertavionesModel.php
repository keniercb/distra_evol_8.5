<?php

/**
 * Created by PhpStorm.
 * User: Ariel
 * Date: 06/10/2016
 * Time: 16:05
 */
class PertavionesModel extends ZendExt_Model
{


    function compararFechas($primera, $segunda)
    {
        $valoresPrimera = explode ("/", $primera);
        $valoresSegunda = explode ("/", $segunda);
        $diaPrimera    = $valoresPrimera[0];
        $mesPrimera  = $valoresPrimera[1];
        $anyoPrimera   = $valoresPrimera[2];
        $diaSegunda   = $valoresSegunda[0];
        $mesSegunda = $valoresSegunda[1];
        $anyoSegunda  = $valoresSegunda[2];
        $diasPrimeraJuliano = gregoriantojd($mesPrimera, $diaPrimera, $anyoPrimera);
        $diasSegundaJuliano = gregoriantojd($mesSegunda, $diaSegunda, $anyoSegunda);
        if(!checkdate($mesPrimera, $diaPrimera, $anyoPrimera)){
            // "La fecha ".$primera." no es válida";
            return 0;
        }elseif(!checkdate($mesSegunda, $diaSegunda, $anyoSegunda)){
            // "La fecha ".$segunda." no es válida";
            return 0;
        }else{
            return  $diasPrimeraJuliano - $diasSegundaJuliano;
        }
    }

    public function getProyectosVivos($params){
        $proyectos = self::getProyectosVivosSQL($params);
        $proyectosresult = array();
        $index = 0;
        foreach($proyectos as $key => $proyecto){
            $inferiores = array();
            $actModel = new CmpgestionaractividadesModel();
            $actModel->buscarInferioresPert($proyecto['idelemento'],$inferiores,'<=',3,10);
            if(count($inferiores)>0){
                $params->inferiores = implode(',',$inferiores);
                $plan = self::calcularPlan($params);
                $plan = number_format($plan/count($inferiores)*100,0);
                $cont = 1;
               // print_r(self::compararFechas($proyecto['fechafin'],$params->fecha));die;
                if($plan > $proyecto['gradocumplimiento'] ||
                    (self::compararFechas($proyecto['fechainicio'],$params->fecha)<=0 &&
                        self::compararFechas($proyecto['fechafin'],$params->fecha)>=0)){
                    $proyectosresult[$index] = $proyecto;
                    $proyectosresult[$index]['key'] = $proyecto['idelemento'];
                    $proyectosresult[$index]['text'] = $proyecto['denelemento'];
                    $proyectosresult[$index]['fotoavion'] = '';
                    $proyectosresult[$index]['atraso'] = 0;
                    $proyectosresult[$index]['tareas'] = implode(',',$inferiores);
                    $proyectosresult[$index]['plan'] = $plan;
                    $proyectosresult[$index]['category'] = 'simple';
                    foreach($inferiores as $pos => $alive){
                        $elemento = Doctrine::getTable('DatElementos')
                            ->find($alive);
                        if($elemento->gradocumplimiento > 0 && $elemento->gradocumplimiento < 100){
                            $tarea = Doctrine::getTable('DatTarea')
                                ->find($alive);
                            if($tarea->evento != null){
                                $proyectosresult[$index]['space'.$cont] = $tarea->evento;
                                $cont+=1;
                            }
                        }
                    }
                    if($plan > $proyecto['gradocumplimiento']){
                        $proyectosresult[$index]['atraso'] = 1;
                    }
                    $index+=1;
                }
            }

        }
        return $proyectosresult;
    }

    public function calcularPlan($params){
        $cadenaSELECT = "";
        $cadenaJOIN = "";
        $cadenaWHERE = "";
        $cadenaQUERY = "";

        $cadenaSELECT = " SELECT COUNT(o.idelemento) as planif FROM (
                          SELECT e.idelemento,t.horafin,
                          CASE WHEN t.fechafin = '{$params->fecha}' THEN 1 ELSE 0 END AS igualfecha  ";
        $cadenaJOIN = " FROM mod_objetivos.dat_elementos e
                        INNER JOIN mod_planifproyecto.dat_tarea t ON t.idtarea = e.idelemento ";
        $cadenaWHERE = " WHERE t.fechafin < '{$params->fecha}' AND t.idtarea IN ({$params->inferiores})) AS o
                         WHERE (o.igualfecha = 1 AND o.horafin < '{$params->hora}') OR o.igualfecha = 0 ";
        $cadenaQUERY = $cadenaSELECT.$cadenaJOIN.$cadenaWHERE;

        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaQUERY)->fetchAll(PDO::FETCH_COLUMN);
        return $result[0];
    }

    public function getProyectosVivosSQL($params){
        $cadenaSELECT = "";
        $cadenaJOIN = "";
        $cadenaWHERE = "";
        $cadenaQUERY = "";

        $cadenaSELECT = " SELECT * ";
        $cadenaJOIN = " FROM mod_objetivos.dat_elementos e
                        INNER JOIN mod_planifproyecto.dat_proyecto p ON p.idproyecto = e.idelemento";
        $cadenaWHERE = " WHERE p.plantilla = 0 ";
        $cadenaQUERY = $cadenaSELECT.$cadenaJOIN.$cadenaWHERE;
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaQUERY)->fetchAll();
        return $result;
    }

    public function getActividadesByIdProyecto($params){
        $cadenaSELECT = "";
        $cadenaJOIN = "";
        $cadenaWHERE = "";
        $cadenaQUERY = "";

        $porciento = " e.gradocumplimiento < 100 ";
        $selectAtraso = " ,case when (t.fechafin::varchar || ' ' || t.horafin::varchar )::timestamp < '".$params->fecha.' '.$params->hora."'::timestamp then 1 else 0 end as atrasada";

        if($params->ejecutadas == 1){
            $porciento = " e.gradocumplimiento = 100 ";
            $selectAtraso = "";

        }

        $cadenaSELECT = " SELECT *{$selectAtraso}
                           ";
        $cadenaJOIN = " FROM mod_objetivos.dat_elementos e
                        INNER JOIN mod_planifproyecto.dat_tarea t ON t.idtarea = e.idelemento ";
        $cadenaWHERE = " WHERE {$porciento} AND t.idtarea IN ({$params->inferiores})
                         ";
        $cadenaQUERY = $cadenaSELECT.$cadenaJOIN.$cadenaWHERE;
        //print_r($cadenaQUERY);die;

        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaQUERY)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

}