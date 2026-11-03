<?php
class RegimentrabajoServices extends ZendExt_Model{

    public function getRegimenTrabajo($filtro,$limit,$start){
        $objRegimentrabajo = new NomRegimentrabajo();
        $result['datos'] = $objRegimentrabajo->getRegimenTrabajoActive($filtro,$limit,$start);
        $result['cantidad'] = count($objRegimentrabajo->getRegimenTrabajoActive($filtro));
        return $result;
    }
   
    public function getGrupoDescansoByRegimen($idregimentrabajo,$filtro,$limit,$start){
        $objgrupodescanso = new NomGrupodescanso();
        $result['datos'] =  $objgrupodescanso->getGrupoDescansoByRegimenActive($idregimentrabajo,$filtro,$limit,$start);
        $result['cantidad'] = count($objgrupodescanso->getGrupoDescansoByRegimenActive($idregimentrabajo,$filtro));
        return $result;
    }

    public function GetAPA($idspersona,$fdesde,$fhasta, $configuracion,$identidad){
        $obj = new DatAsistenciamensualModel();//print_r($obj->GetApaNomina($idspersona,$fdesde,$fhasta, $configuracion));die;
        return $obj->GetApaNomina($idspersona,$fdesde,$fhasta, $configuracion,$identidad);
    }

    public function getTurnoTrabajo(){
        $obj = new NomTurnotrabajoModel();
        return $obj->getTurnoTrabajo();
    }

    public function getRegimenGrupoTurnoTrabajo($idregimentrabajo, $idgrupo, $idturno){
        $result->regimen = NomRegimentrabajo::getById($idregimentrabajo)->denominacion;
        $result->grupo = NomGrupodescanso::getById($idgrupo)->denominacion;
        $result->turno = NomTurnotrabajo::getByid($idturno)['denominacion'];
        return $result;
    }
	
	public function getCausasNomina(){
        $obj = new NomCausaModel();
        $objnoct = new ConfHabhorarionocturnidad();
        $causas = $obj->GetCausas();
        $nocturnidad = $objnoct->getHabilitarhorarionocturnidad();
        $nocturnidadfer = $nocturnidad;
        foreach ($nocturnidad as $k => $noct){
            $nocturnidad[$k]['idcausa'] = 'noct_'. $noct['horainicio'].'_'.$noct['horafin'];
            $nocturnidad[$k]['denominacion'] = 'noct_'. $noct['denominacion'];
            $nocturnidadfer[$k]['idcausa'] = 'noct_fer_' . $noct['horainicio'] . '_' . $noct['horafin'];
            $nocturnidadfer[$k]['denominacion'] = 'noct_fer_'. $noct['denominacion'];
        }
        $result = array_merge($causas,$nocturnidad,$nocturnidadfer);
        return $result;
    }

	 public function GetAsistenciaByIdpersonasFecha($fecha,$idpersonas){
        $Amodel = new DatAsistenciaModel();
        return $Amodel->GetReporteAsistencia($fecha,$idpersonas);
    }

    public function getMes(){
        $Amodel = new DatAsistenciaModel();
        return $Amodel->getMes();
    }

    public function generarReporteAsistencia($fechdesde, $fechhasta,$idpersona){
        $Amodel = new DatAsistenciaModel();
        return $Amodel->generarReporteAsistencia($fechdesde, $fechhasta,$idpersona);
    }

    public function NotificarCorreoAsistencia($fechdesde, $fechhasta,$idpersona){
        $Amodel = new DatAsistenciaModel();
        return $Amodel->NotificarCorreoAsistencia($fechdesde, $fechhasta,$idpersona);
    }

    public function registrarAsistencia($idpersona,$estado)
    {
        //aqui hacer las validaciones de si la persona tiene regimen, grupo, turno y tiene planificado el dia en cuestion
        $cumpleCondiciones = false;
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();

        try{
            $regimen = ZendExt_IoC_Inter::getInstance()->persona->getRegimenByPerson($idpersona,null,null,null);


        if(is_array($regimen) && count($regimen) > 0)
        {
            $confCalendario = new ConfCalendario();
            $calendario = $confCalendario->getCalendarioByFecha(date('d/m/Y'),$regimen[0]['idgrupodescanso']);
            if($calendario[0]['feriado'] == 1)
            {
                $datDiaFeriado = new DatDiaferiadohabilitado();
                $diaFeriadohab = $datDiaFeriado->GetDiaFeriadoHabilitado($idpersona,date('d/m/Y'));
            }

            if(is_array($calendario) && count($calendario) > 0 && ($calendario[0]['trabajo'] == 1 ||
                    ($calendario[0]['feriado'] == 1 && is_array($diaFeriadohab) && count($diaFeriadohab) > 0)))
            {
                $Controlado = "SELECT 
                                  idcontrolado,
                                  idcargo,
                                  idcontrolador,
                                  idarea
                                FROM 
                                  mod_rrhhmaestro.dat_controlado 
                                WHERE 
                                  idcargo = (SELECT   
                                                idcargo
                                              FROM 
                                                mod_persona.dat_situacionlaboral sl
                                               INNER JOIN mod_persona.dat_personaentidad pe ON (pe.idpersonaentidad = sl.idpersonaentidad)
                                              WHERE
                                                pe.idpersona = ".$idpersona." and sl.estado = 0 and principal = 1 
                                                and (sl.fhasta is NULL or sl.fhasta > cast('".date('d/m/Y')."' as date)))
                                        ;";
                $rControlado = $conn->fetchAll($Controlado);
			/*	$result['codigo'] = 'ERROR';
				$result['error'] = $regimen;
return $result;*/
                if(count($rControlado) > 0)
                {
                    $cumpleCondiciones = true;
                }
                else
                {
                    $Controlador = "SELECT 
                                      idcontrolador,
                                      idcargo,
                                      idpersona,
                                      idestructuracontrol
                                    FROM 
                                      mod_rrhhmaestro.dat_controlador 
                                    WHERE
                                      idpersona = ".$idpersona." OR
                                      idcargo = (SELECT   
                                                    idcargo
                                                  FROM 
                                                    mod_persona.dat_situacionlaboral sl
                                                   INNER JOIN mod_persona.dat_personaentidad pe ON (pe.idpersonaentidad = sl.idpersonaentidad)
                                                  WHERE
                                                    pe.idpersona = ".$idpersona." and sl.estado = 0 and principal = 1 
                                                    and (sl.fhasta is NULL or sl.fhasta > cast('".date('d/m/Y')."' as date)))
                                                  
                                                ;";
                    $rControlador = $conn->fetchAll($Controlador);

                    if(count($rControlador) > 0)
                    {
                        $cumpleCondiciones = true;
                    }
                    else
                    {
                        $Movimiento = "SELECT 
                                          idmovimiento,
                                          idpersona,
                                          accion,
                                          idcontrolador
                                        FROM 
                                          mod_rrhhmaestro.dat_movimientos 
                                        WHERE
                                          idpersona = ".$idpersona." and accion = 1
                                                    ;";
                        $rMovimiento = $conn->fetchAll($Movimiento);

                        if(count($rMovimiento) > 0)
                        {
                            $cumpleCondiciones = true;
                        }
                        else
                        {
                            $result['codigo'] = 'ERROR';
                            $result['error'] = "La persona no se encuentra en la estructura de control de asistencia.";
                        }
                    }
                }
            }
            else
            {
                $result['codigo'] = 'ERROR';
                $result['error'] = "La persona no tiene trabajo planificado hoy o la cantidad de horas a trabajar no se especificó en la planificación.";
            }
        }
        else
        {
            $result['codigo'] = 'ERROR';
            $result['error'] = "La persona no tiene régimen de trabajo configurado.";
        }
        if($cumpleCondiciones)
        {
            $datAsist = new DatAsistenciaModel();
            return $datAsist->registrarAsistencia($idpersona,$estado);
        }
        else
        {
            return $result;
        }

        }
        catch(Exception $e)
        {
            $res['codigo'] = 'ERROR';
            $res['error'] = $e->getMessage();
            return $res;
        }

    }

    public function getAsistenciaByCargos($fecha,$idcargos){
        $Amodel = new DatAsistenciaModel();
        return $Amodel->getAsistenciaByCargos($fecha,$idcargos);
    }

    public function registrarAcceso($ci,$fechahoraacceso,$evento){
        $Amodel = new DatAsistenciaModel();
        return $Amodel->registrarAcceso($ci,$fechahoraacceso,$evento);
    }

}

