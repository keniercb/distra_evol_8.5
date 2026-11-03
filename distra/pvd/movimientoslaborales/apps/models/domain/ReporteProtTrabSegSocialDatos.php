<?php

class ReporteProtTrabSegSocialDatos extends ZendExt_Model
{
    public function ReporteProtTrabSegSocialDatos()
    {
        parent::ZendExt_Model();
    }

    public function datosTrimestre($idestructura,$iniciot,$fint) {
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false); //echo'<pre>';print_r($cargosEstructura);die;
        if (count($cargosEstructura)>1) {
            foreach ($cargosEstructura as $key => $value) {
                $idcargos[]=$value['idcargo'];
            }
        }
        $datostrimestreactual = $this->DatosTrimestralPersonal($idestructura,$iniciot,$fint,$idcargos); //echo'<pre>'; print_r($datostrimestreactual);die;
        $fecha= $this->yearAnterior($iniciot,$fint);
        $iniant=$fecha['inicio'];
        $finant=$fecha['fin']; 
        $datostrimestreanterior = $this->DatosTrimestralPersonal($idestructura,$iniant,$finant,$idcargos);
        $fechas= $this->yearAnteriores($iniciot,$fint); 
            $inicio1=$fechas['inicio1'];
            $fin1=$fechas['fin1'];
            $inicio2=$fechas['inicio2'];
            $fin2=$fechas['fin2'];
        $datostrimestreanterior1 = $this->DatosTrimestralPersonal($idestructura,$inicio1,$fin1,$idcargos); 
        $datostrimestreanterior2 = $this->DatosTrimestralPersonal($idestructura,$inicio2,$fin2,$idcargos); 
        return array('act'=>$datostrimestreactual,'ant'=>$datostrimestreanterior,'ant1'=>$datostrimestreanterior1,'ant2'=>$datostrimestreanterior2);
    }

    public function DatosSemestre($idestructura,$inicios,$fins){
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false);
        if (count($cargosEstructura)>1) {
            foreach ($cargosEstructura as $key => $value) {
                $idcargos[]=$value['idcargo'];
            }
        }
        $datossemestre = $this->DatosSemestralPersonal($idestructura,$inicios,$fins,$idcargos); //echo'<pre>';print_r($datossemestre);die;
          $fechasem= ReporteProtTrabSegSocialDatos::yearAnterior($inicios,$fins); 
            $inians= $fechasem['inicio']; 
            $finans= $fechasem['fin']; 
        $datossemestreanterior = ReporteProtTrabSegSocialDatos::DatosSemestralPersonal($idestructura,$inians,$finans,$idcargos);
       return array('act'=>$datossemestre,'ant'=>$datossemestreanterior);
    }

    public function Saldo($idestructura,$inicios,$fins) {
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false);//echo'<pre>';print_r($cargosEstructura);die;
        if (count($cargosEstructura)>1) {
            foreach ($cargosEstructura as $key => $value) {
                $idcargos[]=$value['idcargo'];
            }
        }
        $actual = ReporteProtTrabSegSocialDatos::saldoPersonasPagadasSubsidios($idestructura,$inicios,$fins,$idcargos);
        $fecha= ReporteProtTrabSegSocialDatos::yearAnterior($inicios,$fins);
           $ini= $fecha['fin'];
           $fina= $fecha['fin'];
        $anterior = ReporteProtTrabSegSocialDatos::saldoPersonasPagadasSubsidios($idestructura,$ini,$fina,$idcargos);
      return array('act'=>$actual,'ant'=>$anterior);
    }

    public function yearAnterior($inicio,$fin)    {
        list($diai, $mesi, $annoi) = explode('/', $inicio);
        list($diaf, $mesf, $annof) = explode('/', $fin);
        $annoini=$annoi-1;
        $annofin=$annof-1;
        $iniant="$diai/$mesi/$annoini";
        $finant="$diaf/$mesf/$annofin";
       $fecha['inicio']=$iniant;
       $fecha['fin']=$finant;
       return $fecha;
    }
  
    public function yearAnteriores($inicio,$fin){
        list($diai, $mesi, $annoi) = explode('/', $inicio);
        list($diaf, $mesf, $annof) = explode('/', $fin);
        $annoini1=$annoi-1;
        $annofin1=$annof-1;
        $annoini2=$annoini1-1;
        $annofin2=$annofin1-1;
        $iniant1="$diai/$mesi/$annoini1";
        $finant1="$diaf/$mesf/$annofin1";
        $iniant2="$diai/$mesi/$annoini2";
        $finant2="$diaf/$mesf/$annofin2";
       $fecha['inicio1']=$iniant1;
       $fecha['fin1']=$finant1;
       $fecha['inicio2']=$iniant2;
       $fecha['fin2']=$finant2;
       return $fecha;
    }
    public function obtenerIDcausa(){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection(); 
        $sql=' SELECT DISTINCT  nc.orden FROM mod_regimentrabajo.nom_concepto nc
                         INNER JOIN mod_regimentrabajo.conf_conceptocausas_onei co on (co.idconcepto = nc.idconcepto) order by nc.orden ASC';
        $id= $conn->fetchAll($sql); 
        $cont=0;
        foreach ($id as $i) {
            switch ($i['orden']) {
                case '2':
                    $sqlidcausaacctrab="SELECT co.idcausa
                                        FROM mod_regimentrabajo.nom_concepto nc
                                             INNER JOIN mod_regimentrabajo.conf_conceptocausas_onei co on (co.idconcepto = nc.idconcepto)
                                                 where nc.orden = 2 ";
                    $causaacctrab= $conn->fetchAll($sqlidcausaacctrab);
                    if(count($causaacctrab) > 0) {
                        foreach ($causaacctrab as $key => $value) {
                            $idcausaacctrab [] = $value['idcausa'];
                        }     
                    }
                     else {
                        $idcausaacctrab = [];
                    }
                    
                    $arrayidcausaacctrab = implode("','", $idcausaacctrab);
                break;

                case '3':
                    $sqlaccequiptrab="SELECT DISTINCT co.idcausa
                         FROM mod_regimentrabajo.nom_concepto nc
                         INNER JOIN mod_regimentrabajo.conf_conceptocausas_onei co on (co.idconcepto = nc.idconcepto)
                         where nc.orden = 3 ";
                         $accequiptrab= $conn->fetchAll($sqlaccequiptrab);
                         if(count($accequiptrab) > 0) {
                             foreach ($accequiptrab as $key => $value) {
                                 $idaccequiptrab[] = $value['idcausa'];
                               }  
                         }
                         else {
                             $idaccequiptrab = [];
                         }
                         $arrayidaccequiptrab = implode("','", $idaccequiptrab);
                break;
                
                case '4':
                    $sqlfallacctrab="SELECT DISTINCT co.idcausa
                         FROM mod_regimentrabajo.nom_concepto nc
                         INNER JOIN mod_regimentrabajo.conf_conceptocausas_onei co on (co.idconcepto = nc.idconcepto)
                         where nc.orden = 4 ";
                         $fallacctrab= $conn->fetchAll($sqlfallacctrab); 
                         if(count($fallacctrab) > 0) {
                             for ($i=0; $i < count($fallacctrab) ; $i++) { 
                                 $idfallacctrab[] = $fallacctrab[$i]['idcausa'];
                               }     
                         }
                         else {
                             $idfallacctrab = $fallacctrab;
                         }//echo'<pre>';print_r($idfallacctrab);die;
                         $arrayidfallacctrab = implode("','", $idfallacctrab);   
                break;
               
                case '5':
                    $sqlfallaccequiptrab="SELECT DISTINCT co.idcausa
                         FROM mod_regimentrabajo.nom_concepto nc
                         INNER JOIN mod_regimentrabajo.conf_conceptocausas_onei co on (co.idconcepto = nc.idconcepto)
                         where nc.orden = 5 ";
                         $fallaccequiptrab = $conn->fetchAll($sqlfallaccequiptrab);
                         if(count($fallaccequiptrab) > 0) {
                             for ($i=0; $i < count($fallaccequiptrab) ; $i++) { 
                                 $idfallaccequiptrab[] = $fallaccequiptrab[$i]['idcausa'];
                             }     
                         }
                         else {
                             $idfallaccequiptrab= $fallaccequiptrab ;
                         }
                        $arrayidfallaccequiptrab = implode("','", $idfallaccequiptrab);    
                break;
                
                case '6':
                    $sqlenfprof="SELECT DISTINCT co.idcausa
                         FROM mod_regimentrabajo.nom_concepto nc
                         INNER JOIN mod_regimentrabajo.conf_conceptocausas_onei co on (co.idconcepto = nc.idconcepto)
                         where nc.orden = 6 ";
                         $enfprof= $conn->fetchAll($sqlenfprof);
                         if(count($enfprof) > 0 ) {
                             for ($i=0; $i < count($enfprof) ; $i++) { 
                                 $idenfprof[]= $enfprof[$i]['idcausa'];
                               }  
                         }
                         else {
                             $idenfprof = $enfprof;
                         }
                        $arrayidenfprof = implode("','", $idenfprof);         
                break;
                
                case '7':
                    $sqlenfacccomun="SELECT co.idcausa
                         FROM mod_regimentrabajo.nom_concepto nc
                         INNER JOIN mod_regimentrabajo.conf_conceptocausas_onei co on (co.idconcepto = nc.idconcepto)
                         where nc.orden = 7 ";
                         $enfacccomun= $conn->fetchAll($sqlenfacccomun); 
                         if(count($enfacccomun) > 0) {
                             for ($i=0; $i < count($enfacccomun) ; $i++) { 
                                 $idenfacccomun []= $enfacccomun[$i]['idcausa'];
                               }         
                         }
                         else {
                             $idenfacccomun = $enfacccomun;
                         }
                        $arrayenfacccomun = implode("','", $idenfacccomun);            
                break;
                
                case '8':
                    $sqlinvparcialenfcomun="SELECT co.idcausa
                         FROM mod_regimentrabajo.nom_concepto nc
                         INNER JOIN mod_regimentrabajo.conf_conceptocausas_onei co on (co.idconcepto = nc.idconcepto)
                         where nc.orden = 8 ";
                         $invparcialenfcomun= $conn->fetchAll($sqlinvparcialenfcomun); 
                         if(count($invparcialenfcomun) > 0) {
                             for ($i=0; $i < count($invparcialenfcomun) ; $i++) { 
                                 $idinvparcialenfcomun []= $invparcialenfcomun[$i]['idcausa'];
                               }         
                         }
                         else {
                             $idinvparcialenfcomun = $invparcialenfcomun;
                         }
                        $arrayinvparcialenfcomun = implode("','", $idinvparcialenfcomun);                       
                break;
                
                case '9':
                    $sqlinvtotalenfcomun="SELECT co.idcausa
                         FROM mod_regimentrabajo.nom_concepto nc
                         INNER JOIN mod_regimentrabajo.conf_conceptocausas_onei co on (co.idconcepto = nc.idconcepto)
                         where nc.orden = 9 ";
                         $invtotalenfcomun= $conn->fetchAll($sqlinvtotalenfcomun); 
                         if(count($invtotalenfcomun) > 0) {
                             for ($i=0; $i < count($invtotalenfcomun) ; $i++) { 
                                 $idinvtotalenfcomun []= $invtotalenfcomun[$i]['idcausa'];
                               }         
                         }
                         else {
                             $idinvtotalenfcomun = $invtotalenfcomun;
                         }
                        $arrayinvtotalenfcomun = implode("','", $idinvtotalenfcomun);                          
                break;
            }
           
        }
        
        return array( 'arrayidcausaacctrab'=>$arrayidcausaacctrab,'arrayidaccequiptrab'=>$arrayidaccequiptrab, 'arrayidfallacctrab'=>$arrayidfallacctrab,
                        'arrayidfallaccequiptrab'=>$arrayidfallaccequiptrab,'arrayidenfprof'=>$arrayidenfprof,  'arrayenfacccomun'=>$arrayenfacccomun,
                         'arrayinvparcialenfcomun'=>$arrayinvparcialenfcomun,'arrayinvtotalenfcomun'=>$arrayinvtotalenfcomun);
    }
    // $aux = $cond ? cumple: nocumple;

    
    public function DatosTrimestralPersonal($idestructura,$iniciot,$fint,$idcargos){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection(); 
        $ioc = ZendExt_IoC_Inter::getInstance();
        $contsql=0;
        $personal = array();
        $id= ReporteProtTrabSegSocialDatos::obtenerIDcausa(); //echo'<pre>';print_r($id);die;
        $causaacctrab = $id['arrayidcausaacctrab'];
        $causaaccequiptrab = $id['arrayidaccequiptrab'];
        $causafallacctrab = $id['arrayidfallacctrab'];
        $causafallaccequiptrab = $id['arrayidfallaccequiptrab'];

        $conttotalfallecidosmujer=0; 
        if (count($causafallacctrab)>0) {
           $sqltotalfallecidos= " SELECT das.idpersona, das.idcausa , mdp.sexo
                                    FROM mod_regimentrabajo.dat_asistencia  das
                                    INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                                    INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                    INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                        WHERE das.fecharegistro BETWEEN  '$iniciot' AND '$fint' AND sl.idcargo IN (" . implode(',', $idcargos) . ") AND (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)  AND 
                                        das.idcausa IN ('$causafallacctrab')"; 
            $totalfallecidos  = $conn->fetchAll($sqltotalfallecidos); 
                if (count($totalfallecidos)>0) {
                    $conttotalfallecidos= count($totalfallecidos); 
                    foreach ($totalfallecidos as $key => $value) {
                        if ($value['sexo']==0) {
                            $conttotalfallecidosmujer++; 
                        }
                    }

                }else {
                    $conttotalfallecidos = 0;
                    $conttotalfallecidosmujer=0; 
                } 
        }

        $conttotalacctrabmujer = 0;
        if (count($causaacctrab)>0) {
            $sqltotalacctrab= " SELECT  das.idpersona, das.idcausa , mdp.sexo, das.idturnotrabajo
                                    FROM mod_regimentrabajo.dat_asistencia  das
                                    INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                                    INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                    INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                        WHERE  das.fecharegistro >=  cast('$iniciot' as date) AND  
                                                das.fecharegistro <= cast('$fint' as date) AND 
                                                sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                                (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)  AND 
                                                      das.idcausa IN ('$causaacctrab')"; echo '<pre>';
            $totalacctrab  = $conn->fetchAll($sqltotalacctrab);   
            if (count($totalacctrab)>0) {
                $conttotalacctrab= count($totalacctrab) + $conttotalfallecidos; 
                foreach ($totalacctrab as $key => $value) {
                    $turnoacctrab[]= $value['idturnotrabajo'];
                    if ($value['sexo']==0) {
                        $conttotalacctrabmujer++; 
                    }
                }
                $cat=count($turnoacctrab);
            }else {
                $cat=0;
                $conttotalacctrab = 0; 
                $conttotalacctrabmujer = 0;
            }  
        }    

        if (count($causafallaccequiptrab)>0) {
                $sqltotalfallecidosaccequiptrab= " SELECT das.idpersona, das.idcausa , mdp.sexo, das.idturnotrabajo
                                                FROM mod_regimentrabajo.dat_asistencia  das
                                                INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                                                INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                        INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                            WHERE  das.fecharegistro >=  cast('$iniciot' as date) AND  
                                                    das.fecharegistro <= cast('$fint' as date) AND 
                                                    sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                                    (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)  AND 
                                                    das.idcausa IN ('$causafallaccequiptrab')";
                $totalfallecidosequip  = $conn->fetchAll($sqltotalfallecidosaccequiptrab);
                if (count($totalfallecidosequip)>0) {
                    $conttotalfallecidosequip= count($totalfallecidosequip); 
                }else {
                    $conttotalfallecidosequip = 0;
                }             

        }else {
            $conttotalfallecidosequip = 0;
        }
    
        $conttotalaccequiptrabmujer=0;
        if (count($causaaccequiptrab)>0) {
            $sqltotalaccequiptrab= " SELECT das.idpersona, das.idcausa , mdp.sexo, das.idturnotrabajo
                                    FROM mod_regimentrabajo.dat_asistencia  das
                                    INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                                    INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                    INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                        WHERE  das.fecharegistro >=  cast('$iniciot' as date) AND  
                                                das.fecharegistro <= cast('$fint' as date) AND 
                                                sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                                (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)  AND 
                                        das.idcausa IN ('$causaaccequiptrab')";
            $totalaccequiptrab  = $conn->fetchAll($sqltotalaccequiptrab);  
            if (count($totalaccequiptrab)>0) {
                $conttotalaccequiptrab= count($totalaccequiptrab)+$conttotalfallecidosequip; 
                foreach ($totalacctrab as $key => $value) {
                    $turnoaccequiptrab[]= $turnoacctrab[]= $value['idturnotrabajo'];
                    if ($value['sexo']==0) {
                        $conttotalaccequiptrabmujer++; 
                    }               
                }    
                $caet=count($turnoaccequiptrab);
            }else {
            $caet=0;
            $conttotalaccequiptrab = 0;
            $conttotalaccequiptrabmujer = 0;
            }
        }

         
        $final=[];
        $final['acctrab']=$conttotalacctrab;       
        $final['accequiptrab']=$conttotalaccequiptrab;    
        $final['fallecidos']=$conttotalfallecidos;    
        $final['acctrabmujer']=$conttotalacctrabmujer;    
        $final['accequiptrabmujer']=$conttotalaccequiptrabmujer;    
        $final['fallecidosmujer']=$conttotalfallecidosmujer;
        $final['fallecidosequip']=$conttotalfallecidosequip; 
        $final['diasperdidos']=$cat + $catm;  
        return $final;
        
    }
       
    //da la cant de personas segun la causal q obtuvieron un pago de subsidios 
    public function DatosSemestralPersonal($idestructura,$inicio,$fin,$idcargos){ 
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection(); 
        $ioc = ZendExt_IoC_Inter::getInstance();
        $id= ReporteProtTrabSegSocialDatos::obtenerIDcausa(); 
        $causaacctrab = $id['arrayidcausaacctrab'];
        $causaaccequiptrab = $id['arrayidaccequiptrab'];
        $causaidenfprof = $id['arrayidenfprof'];
        $causaenfacccomun = $id['arrayenfacccomun'];
        $causainvparcialenfcomun = $id['arrayinvparcialenfcomun'];
        $causainvtotalenfcomun = $id['arrayinvtotalenfcomun'];
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
         $personassalsem= $this->obtenerSaldosPersonasSubsidios($idestructura,$inicio,$fin); 
        if (count($personassalsem)>0) {
            foreach ($personassalsem as $key => $value) {
             $persem[]= $value[0];
              } 
         }
        $idpersonas= ReporteProtTrabSegSocialDatos::personasxCausasAntesInicio($idestructura, $inicio, $causaacctrab,$causaaccequiptrab,$idcargos); 
       
        if (count($causaenfacccomun) > 0 && count($persem) > 0 ) {
            $pers = implode("','",$persem);      //echo'<pre>';print_r($pers);die;
          $sqltotalenfacccomun= "SELECT DISTINCT das.idpersona 
                                        FROM mod_regimentrabajo.dat_asistencia das
                                            INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                                            INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                    INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                        WHERE  das.fecharegistro >=  cast('$inicio' as date) AND  
                                                das.fecharegistro <= cast('$fin' as date) AND 
                                                sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                                (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)  AND 
                                                das.idcausa IN ('$causaenfacccomun') and
                                                das.idpersona in ('$pers')"; // echo'<pre>';print_r($sqltotalenfacccomun);die;
                                           
              $totalenfacccomun= $conn->fetchAll($sqltotalenfacccomun);  
              
              $contenfacccomun=0;
          if (count($totalenfacccomun) > 0) {
               $contenfacccomun= count($totalenfacccomun);
          }else { 
                  $contenfacccomun=0;
          }                   
        }else {
            $contenfacccomun=0;
       } 
      // echo '<pre>';print_r(count($idpersonas['persAT']));die;
        if (count($idpersonas['persAT'])> 0 && count($persem) > 0 && count($causaacctrab) > 0 ) {
            $pers = implode("','",$persem);
            $persAT = implode("','",$idpersonas['persAT']);
            $sqltotalacctrab= " SELECT  das.idpersona
                 FROM mod_regimentrabajo.dat_asistencia  das
                 INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                 INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                    INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                        WHERE  das.fecharegistro >=  cast('$inicio' as date) AND  
                                                das.fecharegistro <= cast('$fin' as date) AND 
                                                sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                                (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)  AND 
                       das.idcausa IN ('$causaacctrab') and 
                       das.idpersona in ('$persAT') and 
                       das.idpersona in ('$pers')";  //echo '<pre>';print_r($sqltotalacctrab);die;
            $totalacctrab  = $conn->fetchAll($sqltotalacctrab);
            if (count($totalacctrab) > 0) {
                 $contAT=count($totalacctrab);
            } else { 
                $contAT=0;
            }                
        }else {
            $contAT=0;
        } 
        
        if (count($idpersonas['persAET'])>0  && count($persem) > 0 && count($causaaccequiptrab) > 0 ) {
            $pers = implode("','",$persem);
            $persAET = implode("','",$idpersonas['persAET']); 
            $sqltotalAET= " SELECT  das.idpersona
                                FROM mod_regimentrabajo.dat_asistencia  das
                                INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                                INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                    INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                        WHERE  das.fecharegistro >=  cast('$inicio' as date) AND  
                                                das.fecharegistro <= cast('$fin' as date) AND 
                                                sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                                (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)  AND 
                                                das.idcausa IN ('$causaaccequiptrab') and 
                                                das.idpersona in ('$persAET' ) and 
                                                das.idpersona in ('$pers')"; 
                $totalAET  = $conn->fetchAll($sqltotalAET);   
            if (count($totalAET) > 0) {
                 $contAET=count($totalAET);
            }    
            else { 
                $contAET=0;
            }             
        } 
        else {
            $contAET=0;
        }
        //
      
        if (count($causaidenfprof) > 0 && count($persem) > 0 ) {
            $pers = implode("','",$persem);
            $sqltotalENFPROF= " SELECT  das.idpersona
                                    FROM mod_regimentrabajo.dat_asistencia  das
                                    INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                                    INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                    INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                        WHERE  das.fecharegistro >=  cast('$inicio' as date) AND  
                                                das.fecharegistro <= cast('$fin' as date) AND 
                                                sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                                (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)  AND 
                                                das.idcausa IN ('$causaidenfprof') and 
                                                    das.idpersona in ('$pers')";//
                $totalenfprof  = $conn->fetchAll($sqltotalENFPROF);  
            if (count($totalenfprof) > 0) {
                 $contenfprof=count($totalenfprof);
            }else { 
                    $contenfprof=0;
            }                   
        }else {
            $contenfprof=0;
        }
       
        if ( count($causainvparcialenfcomun) > 0 && count($persem) > 0 ) {
            $pers = implode("','",$persem);
            $sqltotalparcial= " SELECT  das.idpersona
                                FROM mod_regimentrabajo.dat_asistencia  das
                                INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                                INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                    INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                        WHERE  das.fecharegistro >=  cast('$inicio' as date) AND  
                                                das.fecharegistro <= cast('$fin' as date) AND 
                                                sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                                (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)  AND 
                                    das.idcausa IN ('$causainvparcialenfcomun')  and das.idpersona in ('$pers')";  
                $totalparcial  = $conn->fetchAll($sqltotalparcial); 
            if (count($totalparcial) > 0) {
                 $contparcial=count($totalparcial);
            }else { 
                    $contparcial=0;
            }                   
        }else {
            $contparcial=0;
        } //echo '<pre>';print_r($contparcial);die;

       
        if ( count($causainvtotalenfcomun) > 0 && count($persem) > 0 ) {
            $pers = implode("','",$persem);
            $sqltotaltotal= " SELECT das.idpersona
                                FROM mod_regimentrabajo.dat_asistencia  das
                                INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                                INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                    INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                        WHERE  das.fecharegistro >=  cast('$inicio' as date) AND  
                                                das.fecharegistro <= cast('$fin' as date) AND 
                                                sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                                (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)  AND 
                                    das.idcausa IN ('$causainvtotalenfcomun') and das.idpersona in ('$pers')"; 
                $totaltotal  = $conn->fetchAll($sqltotaltotal); 
            if (count($totaltotal) > 0) {
                 $conttotal=count($totaltotal);
            }else { 
                    $conttotal=0;
            }                   
        }else {
            $conttotal=0;
        }
      
        $final=[];
        $final['contat']=$contAT;       
        $final['contaet']=$contAET;    
        $final['contenfprof']=$contenfprof;    
        $final['contencom']=$contenfacccomun; 
        $final['contparcial']=$contparcial;
        $final['conttotal']=$conttotal;
 
        return $final;

    }   

    public function cantIguales($array1,$array2) {
        $cont=0;
        foreach ($arr1 as $elemento1) {
            foreach ($arr2 as $elemento2) {
              if ($elemento1 === $elemento2) {
               $cont++;
              }
            }
          }
          return $cont;
    }
    // da las personas que segun el tipo de accidente en estos casos solo para AccTrab Y AccEquipTrab que fueron pagadas por subsidios 
    public function personasxCausasAntesInicio($idestructura, $inicio, $causaacctrab,$causaaccequiptrab,$idcargos){
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            list($dia, $mes, $anno) = explode('/', $inicio);
            $annon=$anno-1; 
            $inicion="01/01/$annon";  
            $fin=$inicio;
            $personassaldo= $this->obtenerSaldosPersonasSubsidios($idestructura,$inicion,$fin); 
            if (count($personassaldo)>0) {
                foreach ($personassaldo as $key => $value) {
                 $idper[]= $value[0];
                  } 
             }
         // personas antes del inicio con Accidente de trabajo
            if (count($causaacctrab)>0 && count($idper) > 0 ) {
                $pers = implode("','",$idper);
                $sqlATANT= "SELECT Distinct das.idpersona
                                FROM mod_regimentrabajo.dat_asistencia  das
                                    INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                                    INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                    INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                        WHERE  das.fecharegistro >=  cast('$inicion' as date) AND  
                                                das.fecharegistro <= cast('$fin' as date) AND 
                                                sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                                (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)  AND 
                                                    das.idcausa IN ('$causaacctrab') AND  das.idpersona IN ('$pers') ";//echo '<pre>';print_r($sqlATANT);die;
                $ATANT  = $conn->fetchAll($sqlATANT); 
                if (count($ATANT)>0 ) {                
                    foreach ($ATANT as $value) {
                        $persAT[]= $value['idpersona'];
                    } 
                }else {
                    $persAT= [];
                }
            }else {
                $persAT= [];
            }
         // personas antes del inicio con Accidente Equiparado al trabajo
            if (count($causaaccequiptrab)>0  && count($idper) > 0 ) {
                $pers = implode("','",$idper);
                $sqlAETANT= "SELECT Distinct das.idpersona
                                 FROM mod_regimentrabajo.dat_asistencia  das
                                     INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                                     INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                    INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                        WHERE  das.fecharegistro >=  cast('$inicion' as date) AND  
                                                das.fecharegistro <= cast('$fin' as date) AND 
                                                sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                                (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)  AND 
                                                     das.idcausa IN ('$causaaccequiptrab') AND  das.idpersona IN ('$pers') "; //echo '<pre>';print_r($sqlAETANT);die;
                $AETANT  = $conn->fetchAll($sqlAETANT); 
                if (count($AETANT)>0) {
                    foreach ($AETANT as $value) {
                        $persAET[]= $value['idpersona'];
                    } 
                }else {
                    $persAET= [];
                }                   
            }else {
                $persAET= [];
            }    
          
        return array('persAT'=>$persAT,'persAET'=>$persAET);
    }
  
    public function numberFormat($agNumero, $agKeepCero = false) {
        if ($agNumero == 0) {
            if (!$agKeepCero) {
                return '';
            } else {
                if ($agKeepCero) {
                    return number_format($agNumero, '2', '.', ',');
                }
            }
        } elseif ($agNumero < 0) {
            return '(' . number_format($agNumero * -1, '2', '.', ',') . ')';
        } else {
            return number_format($agNumero, '2', '.', ',');
        }
    }



    public function saldoPersonasPagadasSubsidios($identidad,$inicio,$fin,$idcargos) {
        list($dia, $mes, $anno) = explode('/', $inicio);
        $ini="01/01/$anno";
        $personassaldo= $this->obtenerSaldosPersonasSubsidios($identidad,$ini,$fin); //
        $id= $this-> obtenerIDcausa(); //echo'<pre>';print_r($id);die;
        $causaacctrab = $id['arrayidcausaacctrab'];
        $causaaccequiptrab = $id['arrayidaccequiptrab'];
        $causaenfprof = $id['arrayidenfprof'];
        $causaenfacccomun = $id['arrayenfacccomun'];
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
      
      if (count($personassaldo)>0) {
        for ($i=0; $i < count($personassaldo) ; $i++) { 
            $persona=$personassaldo[$i][0];
            $saldo=$personassaldo[$i][1];
            if (count($causaacctrab)>0 ) {
                $sqltotalacctrab= " SELECT  das.idpersona
                                    FROM mod_regimentrabajo.dat_asistencia  das
                                    INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                                    INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                    INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                        WHERE  das.fecharegistro >=  cast('$ini' as date) AND  
                                                das.fecharegistro <= cast('$fin' as date) AND 
                                                sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                                (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)  AND 
                        das.idcausa IN ('$causaacctrab') and das.idpersona ='$persona'";// print_r($sqltotalacctrab);die;
                $totalacctrab= $conn->fetchAll($sqltotalacctrab); 
                if (count($totalacctrab) > 0) {
                    $contAT += $saldo;
                }                 
            } else {
                $contAT+=0;
            }
            
            if (count($causaaccequiptrab)>0 ) {
                $sqltotalAET= " SELECT  das.idpersona as cantidad
                     FROM mod_regimentrabajo.dat_asistencia  das
                     INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                     INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                    INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                        WHERE  das.fecharegistro >=  cast('$ini' as date) AND  
                                                das.fecharegistro <= cast('$fin' as date) AND 
                                                sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                                (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)  AND 
                           das.idcausa IN ('$causaaccequiptrab') and das.idpersona = '$persona' "; 
                    $totalAET  = $conn->fetchAll($sqltotalAET); 
                if (count($totalAET) > 0) {
                     $contAET+= $saldo;
                }                
            } else {
                $contAET+=0;
            }
            
           
            if (count($causaenfprof) > 0) {
                $sqltotalENFPROF= " SELECT  DISTINCT das.idpersona
                     FROM mod_regimentrabajo.dat_asistencia  das
                     INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                     INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                    INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                        WHERE  das.fecharegistro >=  cast('$ini' as date) AND  
                                                das.fecharegistro <= cast('$fin' as date) AND 
                                                sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                                (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)  AND 
                           das.idcausa IN ('$causaenfprof') and  das.idpersona='$persona' ";  
                    $totalenfprof  = $conn->fetchAll($sqltotalENFPROF);
                if (count($totalenfprof) > 0) {
                     $contenfprof+=$saldo;
                }                
            }else {
                $contenfprof+=0;
            }
            
            if ( count($causaenfacccomun) > 0 ) {
              $sqltotalenfacccomun= "  SELECT DISTINCT das.idpersona
                   FROM mod_regimentrabajo.dat_asistencia  das
                   INNER JOIN mod_persona.dat_persona AS mdp ON (mdp.idpersona = das.idpersona)
                   INNER JOIN mod_persona.dat_personaentidad pe ON mdp.idpersona = pe.idpersona AND ((pe.fdesde <= CURRENT_DATE AND (CURRENT_DATE <= pe.fhasta OR pe.fhasta IS NULL)))
                                    INNER JOIN mod_persona.dat_situacionlaboral sl ON pe.idpersonaentidad = sl.idpersonaentidad AND sl.estado = 0
                                        WHERE  das.fecharegistro >=  cast('$ini' as date) AND  
                                                das.fecharegistro <= cast('$fin' as date) AND 
                                                sl.idcargo IN (" . implode(',', $idcargos) . ") AND 
                                                (mdp.feliminado >= CURRENT_DATE OR mdp.feliminado IS NULL)  AND 
                         das.idcausa IN ('$causaenfacccomun') and das.idpersona= '$persona' "; 
                  $totalenfacccomun  = $conn->fetchAll($sqltotalenfacccomun); 

              if (count($totalenfacccomun) > 0) {
                   $contenfacccomun+=$saldo;
              }else { 
                      $contenfacccomun+=0;
              }                   
            }else {
                $contenfacccomun+=0;
            }  
          }
        }
        $final=[];
        $final['sumAT']= (count($contAT)==0) ? 0 : $contAT;
        $final['sumAET']=(count($contAET)==0) ? 0 : $contAET;
        $final['sumENF']=(count($contenfacccomun)==0) ? 0 : $contenfacccomun;
        $final['sumPROF']=(count($contenfprof)==0) ? 0 : $contenfprof; 
        $final['importeAT']= (count($contAT)==0) ? 0 : $this->numberFormat($contAT);
        $final['importeAET']=(count($contAET)==0) ? 0 : $this->numberFormat($contAET);
        $final['importepENF']=(count($contenfacccomun)==0) ? 0 : $this->numberFormat($contenfacccomun);
        $final['importepPROF']=(count($contenfprof)==0) ? 0 : $this->numberFormat($contenfprof);   
        // echo '<pre>';print_r($final);die;
      return $final;
    }
    
    //da las personas y el sueldo que obtuvieron por el pago de subsidios
    public function obtenerSaldosPersonasSubsidios($identidad,$inicio,$fin){  
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $sql = "SELECT DISTINCT tp.idtipopago FROM mod_nomina.nom_tipopago tp
            INNER JOIN mod_nomina.conf_tiporeportescertificaciones ctp on (ctp.idconfreportescertificaciones = tp.idconfreportescertificaciones)
            where ctp.comportamientoreportesc4 = 3";
            $sub=$conn->fetchAll($sql);
            $idsub= $sub[0]['idtipopago']; //echo '<pre>';print_r($idsub);die;
            $sqlvalores = "SELECT dnd.valores,dnd.campos
                        FROM mod_nomina.dat_nominadatos dnd 
                            inner join   mod_nomina.dat_nomina dn on (dn.idnomina = dnd.idnomina)
                            inner join   mod_nomina.dat_elaborarpagos de on (de.idelaborarpagos = dn.idelaborarpago)
                            where de.identidad='$identidad' and   
                                de.fechainicioperiodo>='$inicio'and
                                    de.fechafinperiodo <='$fin' and 
                                de.idtipopago = '$idsub'"; //echo '<pre>';print_r($sqlvalores);die;
            $valores=$conn->fetchAll($sqlvalores); //
            $cnntp=0;
             for ($i=0; $i < count($valores);$i++) {
                $val[]=unserialize($valores[$i]['valores']);
            } //echo '<pre>';print_r($val);die;         
        
            $datos=call_user_func_array('array_merge',$val); //echo '<pre>';print_r($datos);die;
            foreach($datos as $values){
                foreach ($values as $key => $recorrido) {
                    if(is_numeric (explode('c',$key)[1])){
                        $idcampo = explode('c',$key)[1];
                        
                        $sqltipo = "SELECT esconceptopagosalario from mod_nomina.conf_estructuramodelosnomina
                                    where idestructuramodelodomina = $idcampo";
                        $concepto = $conn->fetchOne($sqltipo);            
                     //    echo '<pre>';print_r($concepto); 
                         if($concepto == 1){
                            $saldopers[]=[$values['idpersona'],$values['c'.$idcampo]];
                         }      
                    }
                }
            } 
     
     return $saldopers;     
    }

}