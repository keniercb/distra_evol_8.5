<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 05/02/18
 * Time: 2:56 PM
 */
class DatProgramaMedico extends BaseDatProgramaMedico
{

    public function setUp()
    {
        parent::setUp();
    }

    public function listarProgramasMedicos($params){
        try {
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $where = '';
            $where2 = '';
            $offset = '';
            $arratFiltros=DatProgramaMedico::getFiltros($params);
            if(count($arratFiltros))
                $where=' WHERE '.implode(' AND ', $arratFiltros);

            $result = $conexionActual->fetchAll("
                SELECT count(pm.idprogramamedico) over(), pm.*, 
                       (CASE WHEN position('{\"pn\":' IN c.nombre)=1 THEN 
                  (c.nombre::json->>'pn')||' '||(c.nombre::json->>'sn')||' '||(c.nombre::json->>'pa')||' '||(c.nombre::json->>'sa') 
                  ELSE COALESCE (c.nombre) END) as paciente,
                   (p1.nombre||' '||p1.papel||' '||p1.sapel) as emisor,
                   es.denespecialidad as especialidad, cp.nombre as condicionpago, 
                   tc.denominacion as tipocontacto, 
                   tp.denominacion as tipoprograma,
                   p.nombrepais as pais,
                   COALESCE (desop.denominacion, des.denominacion) as area,
                   pme.fechainicio as fechaestado, e.nombre as estado, pme.idestado, e.icono as iconoestado,
                   (SELECT SUM(pmsm.valor*pms.cantidad) FROM mod_programamedico.dat_programamedicoservicio pms 
                    LEFT JOIN mod_programamedico.dat_programamedicoserviciomoneda pmsm 
                        ON (pms.idprogramamedicoservicio=pmsm.idprogramamedicoservicio) 
                   WHERE pms.idprogramamedico=pm.idprogramamedico) as montototal, pm.idhis,
                    ((SELECT COUNT(*) FROM mod_programamedico.dat_programamedicoservicio pms1 
                          WHERE pms1.idprogramamedico=pm.idprogramamedico)=
                     (SELECT COUNT(*) FROM mod_programamedico.dat_programamedicoservicio pms1 
                          WHERE pms1.idprogramamedico=pm.idprogramamedico AND (pms1.facturado=1 OR pms1.facturado=2))) as completofacturado
                FROM mod_programamedico.dat_programamedico pm
                LEFT JOIN mod_programamedico.dat_programamedicoestado pme ON (pme.idprogramamedico=pm.idprogramamedico AND pme.fechafin IS NULL)
                LEFT JOIN mod_crmcontratacion.nom_estado e ON (e.idestado=pme.idestado)
                LEFT JOIN mod_datosmaestros.nom_clientesproveedor c ON c.idclientesproveedores=pm.idpaciente
                LEFT JOIN mod_persona.dat_persona p1 ON p1.idpersona=pm.idemisor
                LEFT JOIN mod_datosmaestros.nom_especialidad es ON es.idespecialidad=pm.idespecialidad
                LEFT JOIN mod_datosmaestros.nom_terminosdepago cp ON cp.idterminodepago=pm.idcondicionpago
                LEFT JOIN mod_persona.nom_tipomediocontacto tc ON tc.idtipomediocontacto=pm.idtipocontacto
                LEFT JOIN mod_programamedico.nom_tipoprograma tp ON tp.idtipoprograma=pm.idtipoprograma
                LEFT JOIN mod_datosmaestros.nom_pais p ON p.idpais=pm.idpais 
                LEFT JOIN mod_estructuracomp.dat_estructura des ON (pm.idarea = des.idestructura and des.idproyecto = 0)
                LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (pm.idarea = desop.idestructuraop and desop.idproyecto = 0)
                $where
                ORDER BY pm.fechasolicitud DESC

            ");
//            foreach($result as &$i){
//                $i=DatProgramaMedico::agregarMonedas($i);
//                try{
//                    $jsonvalue=json_decode($i['paciente']);
//                    if(!$jsonvalue)continue;
//                    $i['paciente']=$jsonvalue->{'pn'}.' '.($jsonvalue->{'sn'}==''?'':$jsonvalue->{'sn'}.' ').$jsonvalue->{'pa'}.' '.$jsonvalue->{'sa'};
//                }catch(Exception $e){
//                    continue;
//                }
//            }
            return array('success' => true, 'cantidad' => count($result) == 0 ? 0 : $result[0]['count'], 'datos' => $result);
        }catch (Exception $e) {
            throw $e;
        }
    }

    private function agregarMonedas($data){
        try {
            $result=DatProgramaMedicoMoneda::getMonedasByProgramaMedico($data);
            if(count($result)){
                foreach($result as $m){
                    $data['montomoneda_'.strtolower($m['codigoiso']).'_'.$m['idmoneda']]=$m['valor'];
                }
            }
            return $data;
        }catch (Exception $e) {
            throw $e;
        }
    }

    private function getFroms(){
        return " FROM mod_programamedico.dat_programamedico pm
          LEFT JOIN mod_crmcontratacion.nom_mediodepago mp ON a.idformapago=mp.idmediodepago
          LEFT JOIN mod_estructuracomp.dat_estructura des ON (a.idarea = des.idestructura and des.idproyecto = 0)
          LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (a.idarea = desop.idestructuraop and desop.idproyecto = 0)
          LEFT JOIN mod_estructuracomp.nom_filaestruc nfe ON (a.idarea = nfe.idfila) 
          LEFT JOIN mod_crmcontratacion.dat_arriboestado ae 
          ON (ae.idarribo=a.idarribo AND ae.fechafin ISNULL) 
          LEFT JOIN mod_crmcontratacion.nom_estado e ON (ae.idestado = e.idestado)
          LEFT JOIN mod_crmcontratacion.dat_arribopedido ap ON (a.idarribo=ap.idarribo)";
    }

    private function getFiltros($filtros){
        $where = array();
        if($filtros['idprogramamedico'])
            $where[]='pm.idprogramamedico='.$filtros['idprogramamedico'];
        return $where;
    }

    private function getNumericFilter($field, $value, $comparison)
    {
        if ($value || $value == 0) {
            if ($comparison) {
                if ($comparison == 'lt') {
                    return $field . " < " . $value;
                }
                if ($comparison == 'gt') {
                    return $field . " > " . $value;
                }
                if ($comparison == 'eq') {
                    return $field . " = " . $value;
                }
                if ($comparison == 'null') {
                    return $field . $value;
                }
            } else {
                if (is_array($value)) {
                    return $field . " IN (" . implode(',', $value) . ")";
                } else {
                    return $field . " = " . $value;
                }
            }
        }
    }

    public function eliminarProgramasMedicos($params){
        try {
            $query = Doctrine_Query::create();
            $query->delete()->from('DatProgramaMedico')
                ->whereIn('idprogramamedico', json_decode($params['idprogramamedico']))
                ->execute();
        }catch (Exception $e) {
            throw $e;
        }
    }

}